/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var path = require('path');
var fs = require('fs');
var appRoot = path.dirname(path.dirname(require.main.filename));
var sleep = require('system-sleep');
var moment = require('moment');
var Base = require('../libs/Base');
var multer = require('multer'); //multer is used for html form data
//var store_path = appRoot + 'tmp/documents';
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, appRoot + 'tmp/documents');
    },
    filename: function (req, received_file, cb) {
        var originalname = received_file.originalname;
        var extension = originalname.split(".");
        filename = Date.now() + extension[extension.length - 1];
        cb(null, filename);
    }
});
//var upload = multer({"storage": storage});
const  multipart = require('connect-multiparty'); // multiparty is used for angular
const multipartMiddleware = multipart({uploadDir: './tmp/documents'});

module.exports.controller = function (app) {
    app.post('/document_details/upload_document', (req, res) => {
        try {
            var formidable = require('formidable');
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                //var objRequest = fields;

                var objRequest = fields;
                var files = files;

                //Upload documnent
                var objfile = {
                    "file_1": null,
                    "file_2": null,
                    "file_3": null,
                    "file_4": null
                };
                let args = {
                    "Document_Type": objRequest.Document_Type,
                    "Product_Id": objRequest.Product_Id,
                    "PB_CRN": objRequest.PB_CRN,
                    "Status": objRequest.Status,
                    "Doc1": "",
                    "Doc2": "",
                    "Vehicle_Front": "",
                    "Vehicle_Back": "",
                    "Vehicle_Left": "",
                    "Vehicle_Right": "",
                    "Created_On": new Date(),
                    "Modified_On": new Date()
                };
                if (objRequest && objRequest.Proposal_Url) {
                    args['Proposal_Url'] = objRequest.Proposal_Url;
                }
                if (objRequest && objRequest.registration_no) {
                    args['registration_no'] = objRequest.registration_no;
                }
                if (objRequest && objRequest.registration_no) {
                    let document_details = require("../models/document_details");
//                    document_details.findOne({registration_no: args['registration_no']}, function (err, dbDocumentDetails) {
                    document_details.find({registration_no: args['registration_no']}, function (err, dbDocumentDetails) {
                        if (err)
                            res.send(err);
                        else {
                            dbDocumentDetails = dbDocumentDetails.hasOwnProperty('_doc') ? dbDocumentDetails._doc : '';
                            if (dbDocumentDetails === '' || dbDocumentDetails === null || dbDocumentDetails === undefined || (dbDocumentDetails && dbDocumentDetails.hasOwnProperty('Status') && dbDocumentDetails.Status !== 'UPLOADED' && dbDocumentDetails.Status !== 'APPROVED')) {
                                var todayDate_time = moment((args["Created_On"]), 'YYYY-MM-DD HH:MM:SS:ZZZ').format("DD-MM-YYYY") + "_" + moment((args["Created_On"]), 'YYYY-MM-DD_HH:MM:SS:ZZZ').format("HH:MM:SS");
                                todayDate_time = todayDate_time.replace(/:/g, '');
                                var objdata = {'UploadFiles': objfile};
                                //let doc_id = objRequest.Document_Id;
                                if (JSON.stringify(files) !== "{}") {
                                    if (!fs.existsSync(appRoot + "/tmp/documents/" + objRequest.PB_CRN)) {
                                        fs.mkdirSync(appRoot + "/tmp/documents/" + objRequest.PB_CRN);
                                    }
                                    for (var i in files) {
                                        if (files[i].hasOwnProperty('name') && files[i].name) {
                                            var doc_no = i.split("_")[1];
                                            var file_name = files[i].name.split('.')[0].replace(/ /g, '') + "." + files[i].name.split('.')[1];
                                            var extension = files[i].name.split('.')[files[i].name.split('.').length - 1];
                                            var file_sys_loc_horizon = appRoot + "/tmp/documents/" + objRequest.PB_CRN + "/" + "Doc" + doc_no + "_" + objRequest.PB_CRN + "_" + objRequest.UDID + "." + extension;
                                            var file_web_path_horizon = "/tmp/documents/" + objRequest.PB_CRN + "/" + "Doc" + doc_no + "_" + objRequest.PB_CRN + "_" + objRequest.UDID + "." + extension;
                                            objdata.UploadFiles[i] = file_web_path_horizon;
                                            let doc_name = i;
                                            if (doc_name === "Vehicle_Front") {
                                                args['Vehicle_Front'] = objdata.UploadFiles[i];
                                            } else if (doc_name === "Vehicle_Back") {
                                                args['Vehicle_Back'] = objdata.UploadFiles[i];
                                            } else if (doc_name === "Vehicle_Right") {
                                                args['Vehicle_Right'] = objdata.UploadFiles[i];
                                            } else if (doc_name === "Vehicle_Left") {
                                                args['Vehicle_Left'] = objdata.UploadFiles[i];
                                            } else {
                                                args["Doc" + doc_no] = objdata.UploadFiles[i];
                                            }
                                            var oldpath = files[i].path;
                                            fs.readFile(oldpath, function (err, data) {
                                                if (err)
                                                {
                                                    console.error('Read', err);
                                                }
                                                console.log('File read!');

                                                // Write the file
                                                fs.writeFile(file_sys_loc_horizon, data, function (err) {
                                                    if (err)
                                                    {
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
                                            sleep(1000);
                                        }
                                    }
                                    let Client = require('node-rest-client').Client;
                                    let client = new Client();
                                    //                    var User_Data = require('../models/user_data');
                                    //                    User_Data.findOne({"PB_CRN": objRequest.PB_CRN, 'User_Data_Id': objRequest.UDID}, function (err, dbUserData) {
                                    client.get('https://horizon.policyboss.com:5443/user_datas/view/' + objRequest.UDID, {}, function (data, response) {
                                        if (err) {
                                            res.send(err);
                                        } else {
                                            var user_data = data[0];
                                            var ss_id = 0;
                                            var uid = '';
                                            var name = '';
                                            var Vehicle_Details = '';
                                            var Relationship_Manager = '';
                                            if (user_data && user_data.Premium_Request) {
                                                if (user_data.Premium_Request.hasOwnProperty('vehicle_full') && user_data.Premium_Request.vehicle_full) {
                                                    Vehicle_Details = user_data.Premium_Request.vehicle_full;
                                                }
                                                if (user_data.Premium_Request.hasOwnProperty('ss_id') && user_data.Premium_Request.ss_id) {
                                                    ss_id = user_data.Premium_Request.ss_id;
                                                }
                                                client.get('http://horizon.policyboss.com:5000/posps/dsas/view/' + ss_id, {}, function (data, response) {
                                                    if (data['status'] === 'SUCCESS') {
                                                        if (data.hasOwnProperty('EMP') && data.EMP && data.EMP.hasOwnProperty('UID')) {
                                                            uid = data.EMP.UID;
                                                        }
                                                        name = (data.hasOwnProperty('EMP') && data.EMP && data.EMP.hasOwnProperty('Emp_Name') && data.EMP.Emp_Name) ? data.EMP.Emp_Name : '';
                                                        Relationship_Manager = (data.hasOwnProperty('RM') && data.RM && data.RM.hasOwnProperty('rm_details') && data.RM.rm_details && data.RM.rm_details.hasOwnProperty('name') && data.RM.rm_details.name) ? data.RM.rm_details.name : '';
                                                    }
                                                    let Uploaded_By_Uid = uid ? '(' + uid + ')' : '';
                                                    args['Uploaded_By'] = name + Uploaded_By_Uid;
                                                    args['Vehicle_Details'] = Vehicle_Details;
                                                    var document_details = require("../models/document_details");
                                                    var document_details1 = new document_details(args);
                                                    document_details1.save(function (err, response) {
                                                        if (err) {
                                                            console.log(err);
                                                            res.json({"Status": err});
                                                        } else {
                                                            console.log(response);
                                                            let Email = require('../models/email');
                                                            let objModelEmail = new Email();
                                                            let email_data = fs.readFileSync(appRoot + '/resource/email/Send_My_Document_Link.html').toString();
                                                            let objEmail = {
                                                                '___agent_name___': 'Customer Care', //name,
                                                                '___short_url___': '',
                                                                '___content_msg___': 'Following agent name ' + name + ' uploaded RC Document for following transaction.<br><br><div style="border:solid 1pt #0cb2dc; border-radius:6px; padding:5px; background-color:#fff; margin:10px; font-family:calibri; font-size:20px;"><span><b>Customer Reference No.</b> : </span> ' + objRequest.PB_CRN + '<br><span><b>Vehicle</b> : </span> ' + Vehicle_Details + '<br><span><b>Registration No.</b> : </span> ' + objRequest.registration_no.toUpperCase() + '</div><br><br>' + 'For any query, please connect with your relationship manager ' + Relationship_Manager,
                                                                '___content_url___': '',
                                                                '___rm_name___': Relationship_Manager
                                                            };
                                                            let mail_content = email_data.replaceJson(objEmail);
                                                            var Product_name = 'CAR';
                                                            if (objRequest.Product_Id == 10) {
                                                                Product_name = 'TW';
                                                            }
                                                            if (objRequest.Product_Id == 12) {
                                                                Product_name = 'CV';
                                                            }
                                                            //let subject = '[RC UPLOAD]-' + objRequest.PB_CRN;
                                                            let subject = '[RC_UPLOAD] ' + Product_name + ' : CRN : ' + objRequest.PB_CRN;
                                                            let sendTo = 'customercare@policyboss.com';
                                                            let arrCC = [];
                                                            //let mail_content= 'RC Copy uploaded successfully.\nCRN: '+ objRequest.PB_CRN+'\nRegistration Number: ' + objRequest.registration_no;
                                                            if (config.environment.name === 'Production') {
                                                                objModelEmail.send('noreply@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), config.environment.notification_email, ''); // LIVE
                                                            } else {
                                                                objModelEmail.send('noreply@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), config.environment.notification_email, ''); // Devlopment
                                                            }

                                                            try {
                                                                client.get(config.environment.weburl + '/document_details/rc_ocr_verification/' + args['registration_no'], {}, function (data, response) {
                                                                    if (err) {
                                                                        console.log("rc_ocr_verification", err);
                                                                    } else {
                                                                        //console.log(data);
                                                                    }
                                                                });
                                                            } catch (e) {
                                                                console.log('Exception in /rc_ocr_verification : ', e.stack);
                                                            }

                                                            res.json({"Status": "Uploaded Successfully"});
                                                        }
                                                    });
                                                });
                                            }
                                        }
                                    });
                                }
                            } else {
                                if (dbDocumentDetails.Status == 'UPLOADED') {
                                    res.json({"Status": "Vehicle RC Copy already uploaded for verification"});
                                } else if (dbDocumentDetails.Status == 'APPROVED') {
                                    res.json({"Status": "Vehicle RC Copy already approved"});
                                } else {
                                    res.json({"Status": dbDocumentDetails.Status});
                                }
                            }
                        }
                    }).sort({Modified_On: -1});
                } else {
                    res.json({"Status": "Please Enter Registration Number."});
                }
            });
        } catch (e) {
            console.log('Exception in upload_document() : ', e.stack);
            res.json({'Status': e.stack});
        }
    });
    app.get('/document_details/rc_dashboard', function (req, res) {
        let Document_detail = require("../models/document_details");
        let RC_Summary = {
            'ALL': {
                'TOTAL': 0,
                'UPLOADED': 0,
                'REJECTED': 0,
                'APPROVED': 0
            },
            'TODAY': {
                'TOTAL': 0,
                'UPLOADED': 0,
                'REJECTED': 0,
                'APPROVED': 0
            }
        };
        Document_detail.aggregate([
            {"$match": {}},
            {"$group": {
                    '_id': {'Status': "$Status"},
                    'CountStatus': {"$sum": 1}
                }},
            {$project: {_id: 0, Status: "$_id.Status", CountStatus: "$CountStatus"}},
            {"$sort": {"CountStatus": -1}}
        ]).exec(function (err, dbRC_Document_All) {
            if (err) {
                return res.send(err);
            }
            try {
                for (let k in dbRC_Document_All) {
                    RC_Summary.ALL[dbRC_Document_All[k]['Status']] += dbRC_Document_All[k]['CountStatus'];
                    RC_Summary.ALL['TOTAL'] += dbRC_Document_All[k]['CountStatus'];
                }
                let StartDate;
                let EndDate;
                StartDate = moment().utcOffset("+05:30").startOf('Day');
                EndDate = moment().utcOffset("+05:30").endOf('Day');
                let cond_RC = {
                    "Modified_On": {"$gte": StartDate.toDate(), "$lte": EndDate.toDate()}
                };
                Document_detail.aggregate([
                    {"$match": cond_RC},
                    {"$group": {
                            '_id': {'Status': "$Status"},
                            'CountStatus': {"$sum": 1}
                        }},
                    {$project: {_id: 0, Status: "$_id.Status", CountStatus: "$CountStatus"}},
                    {"$sort": {"CountStatus": -1}}
                ]).exec(function (err, dbRC_Document_Today) {
                    if (err) {
                        return res.send(err);
                    }
                    try {
                        for (let k in dbRC_Document_Today) {
                            RC_Summary.TODAY[dbRC_Document_Today[k]['Status']] += dbRC_Document_Today[k]['CountStatus'];
                            RC_Summary.TODAY['TOTAL'] += dbRC_Document_Today[k]['CountStatus'];
                        }
                        res.json(RC_Summary);
                    } catch (e) {
                        res.send(e.stack);
                    }
                });
            } catch (e) {
                res.send(e.stack);
            }
        });
    });
    app.get('/document_details/:registration_no', function (req, res) {
        try {
            let registration_no = req.params.registration_no;
            let document_details = require("../models/document_details");
            if (req.query.hasOwnProperty('dbg') && req.query['dbg'] === 'yes') {
                document_details.findOne({registration_no: registration_no}, function (err, dbDocumentDetails) {
                    if (err)
                        res.send(err);
                    else {
                        res.json(dbDocumentDetails);
                    }
                });
            } else {
                //document_details.findOne({registration_no: registration_no}, null, {sort: {Created_On: -1}}, function (err, dbDocumentDetails) {
                document_details.find({registration_no: registration_no}, function (err, dbDocumentDetails) {
                    if (err)
                        res.send(err);
                    else {
                        res.json(dbDocumentDetails[0]);
                    }
                }).sort({Modified_On: -1});
            }
        } catch (err) {
            res.json({'Status': err.stack});
        }
    });
    app.post('/document_details/update_status/:document_id/:status/:crn', function (req, res) {
        try {
            var formidable = require('formidable');
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                try {
                    var objRequest = fields;
                    var files = files;
                    let folder = fields['folder'];
                    let verifiedby = fields['verifiedby'];
                    let vehicledetail = fields['vehicledetail'];
                    let uploadedon = fields['uploadedon'];
                    var objfile = {
                        "Approval_Document": null
                    };
                    let document_details = require('../models/document_details');
                    let Client = require('node-rest-client').Client;
                    let Email = require('../models/email');
                    let objModelEmail = new Email();
                    let client = new Client();

                    let doc_id = parseInt(req.params.document_id);
                    let crn = req.params.crn;
                    let status = req.params.status;
                    let reject_reason = req.query.rejectreason ? req.query.rejectreason : "";
                    let vahansource = req.query.vahansource ? req.query.vahansource : "";
                    let remark = req.query.remark ? req.query.remark : "";
                    let args = {"Reject_Reason": reject_reason, "Status": status, "Approval_Source": vahansource, 'Remark': remark, 'Verified_By': verifiedby, "Modified_On": new Date()};
                    //var todayDate_time = moment().format("DD-MM-YYYY") + "_" + moment().format("HH:MM:SS");
                    //todayDate_time = todayDate_time.replace(/:/g, '');
                    var objdata = {'UploadFiles': objfile};
                    if (JSON.stringify(files) !== "{}") {
                        if (!fs.existsSync(appRoot + "/tmp/documents/" + folder)) {
                            fs.mkdirSync(appRoot + "/tmp/documents/" + folder);
                        }
                        for (var i in files) {
                            if (files[i].hasOwnProperty('name') && files[i].name) {
//                            var file_name = files[i].name.split('.')[0].replace(/ /g, '') + "." + files[i].name.split('.')[1];
//                            var file_name = "approval_"+crn+"_"+(files[i].name.split('.')[0].replace(/ /g, '') + "." + files[i].name.split('.')[1]);
                                var extension = files[i].name.split('.')[files[i].name.split('.').length - 1];
                                var file_name = "Approver_" + crn + "." + extension;
                                var file_sys_loc_horizon = appRoot + "/tmp/documents/" + folder + "/" + file_name;
                                var file_web_path_horizon = "/tmp/documents/" + folder + "/" + file_name;//config.environment.downloadurl + "/tmp/documents/" + objRequest.PB_CRN + "_" + todayDate_time + "/" + file_name;
                                objdata.UploadFiles[i] = file_web_path_horizon;
                                var doc_no = i.split("_")[1];
                                let doc_name = i;
                                if (doc_name === "Approval_Document") {
                                    args['Approval_Document'] = objdata.UploadFiles[i];
                                }
                                var oldpath = files[i].path;
                                fs.readFile(oldpath, function (err, data) {
                                    if (err)
                                    {
                                        console.error('Read', err);
                                    }
                                    console.log('File read!');

                                    // Write the file
                                    fs.writeFile(file_sys_loc_horizon, data, function (err) {
                                        if (err)
                                        {
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
                                sleep(1000);
                            }
                        }
                    }
                    client.get(config.environment.weburl + '/user_datas/detail_by_crn/' + crn, function (data, response) {
                        if (data.hasOwnProperty('Proposal_Request')) {
                            document_details.findOneAndUpdate({"Document_Id": doc_id}, {$set: args}, function (err, dbdata) {
                                if (err) {
                                    res.json({'Status': 'Fail', 'Msg': 'Status not Updated'});
                                } else {
                                    try {
                                        let fs = require('fs');
                                        let email_data = '';
                                        let short_url = "";
                                        let contact_name = "";
                                        let agent_name = "";
                                        let rm_name = "";
                                        let productid = "";
                                        let regno = data.hasOwnProperty('Proposal_Request') && data['Proposal_Request'].hasOwnProperty('registration_no') ? data['Proposal_Request']['registration_no'] : '';
                                        if (data.hasOwnProperty('Proposal_Request') && data['Proposal_Request'].hasOwnProperty('middle_name') && (data['Proposal_Request']['middle_name'] === "" || data['Proposal_Request']['middle_name'] === null)) {
                                            contact_name = data['Proposal_Request']['first_name'] + " " + data['Proposal_Request']['last_name'];
                                        } else {
                                            contact_name = data['Proposal_Request']['first_name'] + " " + data['Proposal_Request']['middle_name'] + " " + data['Proposal_Request']['last_name'];
                                        }
                                        if (data && data.hasOwnProperty('Premium_Request') && data['Premium_Request'].hasOwnProperty('product_id')) {
                                            productid = (data['Premium_Request']['product_id'] === 1 || parseInt(data['Premium_Request']['product_id']) === 1) ? "CAR" : "TW";
                                        }
                                        if (data && data.hasOwnProperty('Premium_Request') && data['Premium_Request'].hasOwnProperty('posp_first_name') && data['Premium_Request']['posp_first_name'] !== '') {
                                            agent_name = data['Premium_Request']['posp_first_name'];
                                        }
                                        if (data && data.hasOwnProperty('Premium_Request') && data['Premium_Request'].hasOwnProperty('posp_last_name') && data['Premium_Request']['posp_last_name'] !== '') {
                                            agent_name = agent_name + " " + data['Premium_Request']['posp_last_name'];
                                        }
                                        if (data && data.hasOwnProperty('Premium_Request') && data['Premium_Request'].hasOwnProperty('rm_details_name') && data['Premium_Request']['rm_details_name'] !== '') {
                                            rm_name = data['Premium_Request']['rm_details_name'];
                                        }
                                        let arrCC = [];
                                        let sendTo = '';
                                        let arrBcc = [config.environment.notification_email];
                                        if (data.hasOwnProperty('Premium_Request') && data['Premium_Request'].hasOwnProperty('ss_id') && data['Premium_Request']['ss_id'] > 0) {
                                            /*if (data && data.Premium_Request && data['Premium_Request'].posp_email_id) {
                                             arrCC.push(data['Premium_Request']['posp_email_id']);
                                             }*/
                                            if (data && data.Premium_Request && data['Premium_Request'].posp_reporting_email_id) {
                                                arrCC.push(data['Premium_Request']['posp_reporting_email_id']);
                                            }
                                        }
                                        if (data && data.Premium_Request && data['Premium_Request'].posp_email_id) {
                                            sendTo = data['Premium_Request']['posp_email_id'];
                                        }
                                        let url = dbdata['_doc']['Proposal_Url'] + "&is_document_approved=yes";
                                        //let subject = '[Document Upload]-' + contact_name + '-' + crn+'-'+regno;
                                        //let sendTo = data['Proposal_Request']['email'];
                                        let subject = '';
                                        email_data = fs.readFileSync(appRoot + '/resource/email/Send_My_Document_Link.html').toString();
                                        let objEmail = {
                                            '___agent_name___': agent_name,
                                            '___short_url___': '',
                                            '___content_msg___': '',
                                            '___content_url___': ''
                                        };
                                        if (status === "APPROVED") {
                                            client.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(url), function (data1, response) {
                                                try {
                                                    if (data1 && data1.Short_Url) {
                                                        short_url = data1.Short_Url;
                                                    }
                                                    subject = '[RC_APPROVED] ' + productid + ' : CRN : ' + crn;
                                                    objEmail['___content_msg___'] = `You had uploaded vehicle rc documented for following transaction. PolicyBoss team has approved the document. Kindly continue with payment process.
                                            <br><br><div style="border:solid 1pt #0cb2dc; border-radius:6px; padding:5px; background-color:#fff; margin:10px; font-family:calibri; font-size:20px;">
                                            <span><b>Customer Reference No.</b> : </span><span>${crn}</span><br>
                                            <span><b>Customer Name </b> : </span><span> ${contact_name}</span><br>
                                            <span><b>Vehicle </b> : </span><span> ${vehicledetail}</span><br>
                                            <span><b>Rc Uploaded on </b> : </span><span>${uploadedon}</span><br>
                                            <span><b>Reject Reason </b> : </span><span>${reject_reason}</span>
                                            </div><br>For any query, please connect with your relationship manager ${rm_name}`;
                                                    objEmail['___content_url___'] = `Please click on the below to complete the payment process. <br><br><a href="${short_url}" style="background-color:#00556b;color:#ffffff; text-decoration:none;  padding:10px; font-weight: bold;">PAY NOW</a>`;
                                                    let mail_content = email_data.replaceJson(objEmail);
                                                    if (config.environment.name === 'Production') {
                                                        objModelEmail.send('noreply@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), arrBcc.join(','), ''); // LIVE
                                                    } else {
                                                        objModelEmail.send('noreply@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), arrBcc.join(','), ''); // Devlopment
                                                    }
                                                    res.json({"Status": "Success", "Msg": "Updated Successfully"});
                                                } catch (ex) {
                                                    console.log("error:", ex);
                                                    res.json({'Status': 'Error', 'Msg': ex.stack});
                                                }
                                            });
                                        } else {
                                            subject = '[RC_REJECTED] ' + productid + ' : CRN : ' + crn;
                                            objEmail['___content_msg___'] = `You had uploaded vehicle rc documented for following transaction. PolicyBoss team has rejected the document.
                                    <br><br><div style="border:solid 1pt #0cb2dc; border-radius:6px; padding:5px; background-color:#fff; margin:10px; font-family:calibri; font-size:20px;">
                                    <span><b>Customer Reference No.</b> : </span><span>${crn}</span><br>
                                    <span><b>Customer </b> : </span><span> ${contact_name}</span><br>
                                    <span><b>Vehicle </b> : </span><span> ${vehicledetail}</span><br>
                                    <span><b>Rc Uploaded on </b> : </span><span>${uploadedon}</span><br>
                                    <span><b>Reject Reason </b> : </span><span>${reject_reason}</span><br>
                                    <span><b>Reject Remark </b> : </span><span>${remark}</span>
                                    </div><br>For any query, please connect with your relationship manager ${rm_name}`;
                                            let mail_content = email_data.replaceJson(objEmail);
                                            if (config.environment.name === 'Production') {
                                                objModelEmail.send('noreply@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), arrBcc.join(','), ''); // LIVE
                                            } else {
                                                objModelEmail.send('noreply@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), arrBcc.join(','), '');
                                            }
                                            res.json({"Status": "Success", "Msg": "Updated Successfully"});
                                        }

                                    } catch (ex) {
                                        console.log("error:", ex);
                                        res.json({'Status': 'Error', 'Msg': ex.stack});
                                    }
                                }
                            });

                        } else {
                            res.json({'Status': 'Fail', 'Msg': 'Status not Updated.'});
                        }

                    });
                } catch (ex) {
                    console.log("error:", ex);
                    res.json({'Status': 'Error', 'Msg': ex.stack});
                }
            });
        } catch (ex) {
            console.log("error:", ex);
            res.json({'Status': 'Error', 'Msg': ex.stack});
        }
    });
    app.post('/document_details/get_all_document', function (req, res) {
        try {
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                // select: 'Document_Id Document_Type Product_Id PB_CRN Status Product CRN Status Doc1 Doc2 Created_On Modified_On',
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
            filter = {
                //$or:[{"Status":"UPLOADED"},{"Status":"PENDING"}]
            };
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
            if (req && req.body && req.body.searchByStatus && req.body.searchByStatus !== '') {
                filter["Status"] = new RegExp(req.body['searchByStatus'], 'i');
            }
            if (req && req.body && (req.body.searchByCrn || req.body.searchByRegNo)) {
                if (req.body.searchByCrn && req.body['searchByCrn'] !== '') {
                    filter["PB_CRN"] = typeof req.body['searchByCrn'] === 'string' ? parseInt(req.body['searchByCrn']) : req.body['searchByCrn'];
                } else if (req.body.searchByRegNo && req.body.searchByRegNo !== '') {
                    filter["registration_no"] = new RegExp(req.body['searchByRegNo'], 'i');
                } else {

                }
            }
            var document_details = require('../models/document_details');
            //console.error('HorizonMyDocumentList', filter, req.body);
            document_details.paginate(filter, optionPaginate).then(function (user_datas) {
                res.json(user_datas);
            });
        } catch (ex) {
            console.log("error:", ex);
            res.json({'Status': 'Error', 'Msg': ex.stack});
        }
    });
    app.get('/document_details/rc_ocr_verification/:vehicle_reg_no', function (req, res) {
        try {
            let Document_detail = require("../models/document_details");
            if (req.params.vehicle_reg_no && req.params.vehicle_reg_no !== "") {
                Document_detail.findOne({registration_no: req.params.vehicle_reg_no}, function (dbDocumentDetailerr, dbDocumentDetailData) {
                    if (dbDocumentDetailerr) {
                        res.json({"Msg": dbDocumentDetailerr, "Status": "Fail"});
                    } else {
                        let timestamp = new Date().getTime();
                        if (dbDocumentDetailData && dbDocumentDetailData.hasOwnProperty("_doc")) {
                            try {
                                let req_txt = {
                                    "task_id": dbDocumentDetailData["_doc"]["PB_CRN"].toString() + "-" + timestamp, //"74f4c926-250c-43ca-9c53-453e87743857477699",
                                    "group_id": dbDocumentDetailData["_doc"]["PB_CRN"].toString() + "-" + timestamp, //"8e16424a-58fc-4ba4-ab20-5bc8e7c3c41ejdghj",
                                    "data": {
                                        "document1": "https://horizon.policyboss.com:5443" + dbDocumentDetailData["_doc"]["Doc1"],
                                        "document2": ((dbDocumentDetailData["_doc"]["Doc2"] !== "") ? ("https://horizon.policyboss.com:5443" + dbDocumentDetailData["_doc"]["Doc2"]) : "")
                                    }
                                };
                                let args = {
                                    data: JSON.stringify(req_txt),
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                        "api-key": "1995b4d5-8ed2-4d49-86a1-b851067c9bf5", //"c9a96100-71ea-4725-a919-69796ef367fa",
                                        "account-id": "0e5301d26593/08d53e4c-acee-4d24-91c4-75f8e31dbc25"//bc6b57847aa5/70833974-5f80-46e4-ae6e-5979f1d22910"
                                    }
                                };
                                var Client = require('node-rest-client').Client;
                                var client = new Client();
                                let class_txt = "";
                                let rc_status = "PENDING";
                                client.post("https://eve.idfy.com/v3/tasks/sync/extract/ind_rc", args, function (data, response) {
                                    //console.log(JSON.stringify(data));
                                    if (data) {
                                        if (data.hasOwnProperty("status") && data.status === "completed") {
                                            class_txt = data.result.extraction_output.class;
                                            rc_status = "SUCCESS";
                                        }
                                        if (data.hasOwnProperty("status") && data.status === "failed") {
                                            rc_status = "FAIL";
                                        }

                                        let queryObj = {
                                            Vehicle_No: req.params.vehicle_reg_no,
                                            Doc1_Url: dbDocumentDetailData["_doc"]["Doc1"],
                                            Doc2_Url: dbDocumentDetailData["_doc"]["Doc2"],
                                            Vehicle_Class: class_txt,
                                            Status: rc_status,
                                            Request_Core: JSON.stringify(req_txt),
                                            Response_Core: JSON.stringify(data),
                                            Created_On: new Date(),
                                            Modified_On: new Date()
                                        };

                                        let Rc_ocr_detail = require("../models/rc_ocr_detail");
                                        var Rc_ocr_detail1 = new Rc_ocr_detail(queryObj);
                                        Rc_ocr_detail1.save(function (Rc_ocr_err, Rc_ocr_res) {
                                            if (Rc_ocr_err) {
                                                res.json({"Msg": Rc_ocr_err, "Status": "Fail"});
                                            } else {
                                                res.json({"Msg": "Insertion Successful", "Status": "Success"});
                                            }
                                        });
                                    }
                                });
                            } catch (e) {
                                res.json({"Msg": e.stack, "Status": "Fail"});
                            }
                            //res.send(dbDocumentDetailData);
                        } else {
                            res.json({"Msg": "Data not available", "Status": "Success"});
                        }
                    }
                });
            } else {
                res.json({"Msg": "Invalid vehicle_reg_no", "Status": "Fail"});
            }
        } catch (e) {
            res.json({"Msg": e.stack, "Status": "Fail"});
        }
    });
};