/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var path = require('path');
var fs = require('fs');
var appRoot = path.dirname(path.dirname(require.main.filename));
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var config = require('config');
var mongojs = require('mongojs');
var autoIncrement = require("mongodb-autoincrement");
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
var Ticket = require('../models/ticket');
var sleep = require('system-sleep');
var multer = require('multer');
var store_path = appRoot + "/tmp/ticketing";
var util = require('util');
var User_Data = require('../models/user_data');
var xl = require('excel4node');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, appRoot + "/tmp/ticketing/");
    },
    filename: function (req, recieved_file, cb) {
        var originalname = recieved_file.originalname;
        var extension = originalname.split(".");
        filename = Date.now() + '.' + extension[extension.length - 1];
        cb(null, filename);
    }
});
var upload = multer({storage: storage});
const  multipart = require('connect-multiparty');
const  multipartMiddleware = multipart({uploadDir: './tmp/ticketing'});
var post_sale = ["Policy not received", "Post Sale Query", "Endorsement", "Claim Related", "Received policy copy, CRN is not marked as sell", "Done payment but not received policy copy"];



var Const_Product = {
    '1': 'Car',
    '2': 'Health',
    '4': 'Travel',
    '3': 'Term',
    '10': 'TW',
    '12': 'CV',
    '17': 'CoronaCare',
    '13': 'Marine',
    '5': 'Investment',
    '16': 'CancerCare',
    '18': 'CyberSecurity'
};

var const_arr_insurer = {
    "Insurer_1": "Bajaj",
    "Insurer_4": "FutureGenerali",
    "Insurer_16": "RahejaQBE",
    "Insurer_3": "Chola",
    "Insurer_19": "UniversalSompo",
    "Insurer_47": "DHFL",
    "Insurer_13": "Oriental",
    "Insurer_11": "TataAIG",
    "Insurer_44": "Digit",
    "Insurer_46": "Edelweiss",
    "Insurer_45": "Acko",
    "Insurer_5": "HdfcErgo",
    "Insurer_6": "IciciLombard",
    "Insurer_10": "RoyalSundaram",
    "Insurer_33": "LibertyVideocon",
    "Insurer_2": "Bharti",
    "Insurer_9": "Reliance",
    "Insurer_14": "United",
    "Insurer_30": "Kotak",
    "Insurer_7": "IffcoTokio",
    "Insurer_12": "NewIndia",
    "Insurer_8": "National",
    "Insurer_17": "SBI_General",
    "Insurer_18": "Shriram",
    "Insurer_35": "Magma"
};
var emailtocc = {
    "Product Input Page": [{
            "to": "savio.lobo@landmarkinsurance.in,ashish.hatia@policyboss.com",
            "cc": "techsupport@policyboss.com"
        }],
    "Quotation": [{
            "to": "quotesupport@policyboss.com",
            "cc": "techsupport@policyboss.com"
        }],
    "Proposal": [{
            "to": "",
            "cc": "techsupport@policyboss.com"
        }],
    "Policy not received": [{
            "to": "rohit.rajput@policyboss.com",
            "cc": "techsupport@policyboss.com,susanna.lobo@landmarkinsurance.in"
        }],
    "Post Sale Query": [{
            "to": "rohit.rajput@policyboss.com",
            "cc": "techsupport@policyboss.com,susanna.lobo@landmarkinsurance.in"
        }],
    "Endorsement": [{
            "to": "rohit.rajput@policyboss.com",
            "cc": "techsupport@policyboss.com,susanna.lobo@landmarkinsurance.in"
        }],
    "Claim Related": [{
            "to": "rohit.rajput@policyboss.com",
            "cc": "techsupport@policyboss.com,susanna.lobo@landmarkinsurance.in"
        }],
    "Finmart": [{
            "to": "anil.yadav@policyboss.com",
            "cc": "techsupport@policyboss.com"
        }],
    "Received policy copy, CRN is not marked as sell": [{
            "to": "nikita.jadhav@policyboss.com,rohit.rajput@policyboss.com",
            "cc": "techsupport@policyboss.com,susanna.lobo@landmarkinsurance.in"
        }],
    "Done payment but not received policy copy": [{
            "to": "rohit.rajput@policyboss.com",
            "cc": "techsupport@policyboss.com,susanna.lobo@landmarkinsurance.in"
        }],
    "Sign up issue": [{
            "to": "",
            "cc": "techsupport@policyboss.com"
        }],
    "Login issue": [{
            "to": "",
            "cc": "techsupport@policyboss.com"
        }]
};
module.exports.controller = function (app) {

    app.get('/tickets/getticketHTML', function (req, res) {
        fs.readFile(appRoot + '/resource/request_file/Ticketing/ticketpopup.html', function (error, pgResp) {
            res.send(pgResp);
        });
    });

    app.get('/tickets/getticketing_category/:product_id/:source?', function (req, res) {
        try {

            var resobj = {};
            var obj = [];
            var objproduct = [];
            var productid = req.params["product_id"];
            var source = req.params["source"];
            var cache_key = 'live_tickets_getticketing_category_' + productid + '_' + source;

            var arr = {};
            if (productid !== null && productid !== "" && productid !== "0") {
                arr["Product_Id"] = {$in: [productid]};
            }
            if (source !== null && source !== "" && source !== undefined) {
                arr["Display_Source"] = {$in: [source]};
            }

            if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
                var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
                var obj_cache_content = JSON.parse(cache_content);
                res.json(obj_cache_content);
            } else {
                var dbticketing_category = myDb.collection('ticketing_category');
                //db.collection('ticketing_category').find(arr).toArray(function (err, dbCategory) {
                dbticketing_category.find(arr).toArray(function (err, dbCategory) {
                    if (err) {
                        res.send(err);
                    } else {
                        console.log(dbCategory);
                        for (var i in dbCategory) {
                            // obj.push(dbCategory[i]['Category_Id'] + ':' + dbCategory[i]['Category']);
                            obj.push({
                                key: dbCategory[i]['Category_Id'] + ':' + dbCategory[i]['Product_Id'],
                                value: dbCategory[i]['Category']
                            });
                            //objproduct.push(dbCategory[i]['Category_Id'] + ':' + dbCategory[i]['Product_Id']);
                        }
                        fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(obj), function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                        res.json(obj);
                    }
                });
            }
            // });
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });
    app.post('/tickets/raiseticket', function (req, res, next) {
        try {
            var objRequest = req.body;
            var product_id = 0;
            var path = appRoot + "/tmp/ticketing/";
            var Ticket_id = objRequest["Ticket_Id"];
            var isticket_created;
            var Is_Customer = objRequest['Is_Customer'] === undefined ? false : objRequest['Is_Customer'];
            console.log(objRequest);
            console.error(objRequest);
            var offical_email_id = "";

            if ((objRequest['ss_id'] > 0 && objRequest['ss_id'] !== 5) || Is_Customer === true) {
                var Client = require('node-rest-client').Client;
                var client = new Client();
                client.get(config.environment.weburl + '/posps/dsas/view/' + objRequest['ss_id'], {}, function (data, response) {
                    if (data['status'] === 'SUCCESS' || Is_Customer) {
                        objRequest['agent'] = data;
                        var agentdetails = objRequest['agent']['EMP'];
                        if (objRequest["Product"] === "CAR") {
                            product_id = 1;
                        } else if (objRequest["Product"] === "BIKE") {
                            product_id = 10;
                        } else if (objRequest["Product"] === "HEALTH") {
                            product_id = 2;
                        }

                        if (data['user_type'] === "FOS") {
                            if (data.EMP.Email_Id) {
                                offical_email_id = data.EMP.Email_Id;
                            }
                            if (data.RM.rm_details.email) {
                                offical_email_id += offical_email_id === "" ? data.RM.rm_details.email : "," + data.RM.rm_details.email;
                            }
                        } else if (data['user_type'] === "POSP") {
                            if (data.POSP.Email_Id) {
                                offical_email_id = data.POSP.Email_Id;
                            }
                            if (data.RM.rm_details.email) {
                                offical_email_id += offical_email_id === "" ? data.RM.rm_details.email : "," + data.RM.rm_details.email;
                            }
                        } else if (data['user_type'] === "EMP") {
                            if (data.EMP.Email_Id) {
                                offical_email_id = data.EMP.Email_Id;
                            }
                        } else if (data['user_type'] === "MISP") {
                            if (data.EMP.Email_Id) {
                                offical_email_id = data.EMP.Email_Id;
                            }
                            if (data.EMP.Reporting_Email_ID) {
                                offical_email_id += offical_email_id === "" ? data.EMP.Reporting_Email_ID : ',' + data.EMP.Reporting_Email_ID;
                            }
                        }

                        var file_obj = [];
                        var file_ext = [];
                        for (var i = 1; i <= 4; i++) {
                            if (objRequest["file_" + i] !== null && objRequest["file_" + i] !== "" && objRequest["file_" + i] !== undefined) {
                                file_obj.push(decodeURIComponent(objRequest["file_" + i]));
                            }
                        }
                        for (var i = 1; i <= 4; i++) {
                            if (objRequest["file_ext_" + i] !== null && objRequest["file_ext_" + i] !== "" && objRequest["file_" + i] !== undefined) {
                                file_ext.push(objRequest["file_ext_" + i]);
                            }
                        }
                        console.log(file_obj);
                        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                            if (err)
                                throw err;

                            autoIncrement.getNextSequence(db, 'tickets', function (err1, autoIndex) {
                                var tickets = db.collection('tickets');
                                var agg = [
                                    // Group by the grouping key, but keep the valid values
                                    {"$group": {
                                            "_id": "$Ticket_Id",
                                            "docId": {"$last": "$_id"},
                                            "Ticket_Id": {"$last": "$Ticket_Id"},
                                            "Category": {"$last": "$Category"},
                                            "SubCategory": {"$last": "$SubCategory"},
                                            "From": {"$last": "$From"},
                                            "To": {"$last": "$To"},
                                            "Status": {"$last": "$Status"},
                                            "Created_by": {"$last": "$Created_by"},
                                            "Created_On": {"$last": "$Created_On"},
                                            "Modified_On": {"$last": "$Modified_On"},
                                            "CRN": {"$last": "$CRN"},
                                            "Mobile_No": {"$last": "$Mobile_No"},
                                            "Vehicle_No": {"$last": "$Vehicle_No"},
                                            "Remark": {"$last": "$Remark"},
                                            "ss_id": {"$last": "$ss_id"},
                                            "SubCategory_level2": {"$last": "$SubCategory_level2"},
                                            "Product": {"$last": "$Product"}
                                        }},
                                    // Then sort
                                    {"$sort": {"Created_On": -1}}

                                ];
                                console.log(agg);
                                //tickets.aggregate(agg, function (err1, dbTicket1) {
                                if (err1) {
                                    throw err1;
                                } else {
                                    tickets.find({"$or": [{"CRN": (objRequest.CRN).toString()}, {"CRN": parseInt(objRequest.CRN)}], "Category": objRequest.Category}).toArray(function (err, crn_cat_exist) {
                                        if ((crn_cat_exist.length === 0 && objRequest.hasOwnProperty('CRN') && objRequest.CRN !== "") ||
                                                ((crn_cat_exist.length > 0 || crn_cat_exist.length === 0) && (objRequest.CRN === "" || objRequest.CRN === undefined))) {

                                            //if (dbTicket1.length > 0) {
                                            //   debugger;
                                            //}
                                            var todayDate = new Date();

                                            var NewTicket_Id;

                                            if (Ticket_id === "") {
                                                //create new ticket id.
                                                NewTicket_Id = objRequest["Product"].substring(0, 2).toString().toUpperCase() + objRequest["Category"].substring(0, 2).toString().toUpperCase() + autoIndex;
                                                isticket_created = 1;
                                            } else {
                                                NewTicket_Id = Ticket_id;
                                                isticket_created = 0;
                                            }
                                            tickets.findOne({"Ticket_Id": Ticket_id}, {sort: {"Modified_On": -1}}, function (err, dbticket) {
                                                console.log(dbticket);
                                                var arg = {};

                                                arg = {
                                                    Ticket_Id: dbticket !== null ? dbticket['Ticket_Id'] : NewTicket_Id,
                                                    Product: dbticket !== null ? dbticket['Product'] : product_id,
                                                    Category: dbticket !== null ? dbticket["Category"] : objRequest["Category"],
                                                    SubCategory: dbticket !== null ? dbticket["SubCategory"] : objRequest["SubCategory"],
                                                    Proposal_Error_Msg: objRequest["Proposal_Error_Msg"],
                                                    From: dbticket !== null ? dbticket["From"] : (Is_Customer === true ? objRequest["Created_By"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') '),
                                                    To: dbticket !== null ? dbticket["To"] : (Is_Customer === true ? objRequest["Created_By"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') '),
                                                    Status: objRequest["Status"] === "0" ? dbticket["Status"] : objRequest["Status"],
                                                    Created_By: dbticket !== null ? dbticket["Created_By"] : (Is_Customer === true ? objRequest["Created_By"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') '),
                                                    Modified_By: agentdetails.Emp_Id,
                                                    Created_On: dbticket !== null ? dbticket["Created_On"] : todayDate,
                                                    Modified_On: todayDate,
                                                    CRN: dbticket !== null ? dbticket["CRN"] : objRequest["CRN"] - 0,
                                                    Mobile_No: dbticket !== null ? dbticket["Mobile_No"] : objRequest["Mobile_No"],
                                                    Vehicle_No: dbticket !== null ? dbticket["Vehicle_No"] : objRequest["Vehicle_No"],
                                                    Remark: objRequest["Remark"],
                                                    ss_id: dbticket !== null ? dbticket["ss_id"] : agentdetails.Emp_Id,
                                                    SubCategory_level2: objRequest["SubCategory_level2"],
                                                    CRN_owner: dbticket !== null ? dbticket["CRN_owner"] : objRequest["CRN_owner"],
                                                    IsActive: 1,
                                                    fba_id: dbticket !== null ? dbticket["fba_id"] : agentdetails.FBA_ID,
                                                    CRN_fba_id: dbticket !== null ? dbticket["CRN_fba_id"] : objRequest["CRN_fba_id"],
                                                    channel: dbticket !== null ? dbticket["channel"] : objRequest["channel"],
                                                    subchannel: dbticket !== null ? dbticket["subchannel"] : objRequest["subchannel"],
                                                    UploadFiles: dbticket !== null ? dbticket["UploadFiles"] : "",
                                                    Ticket_Code: dbticket !== null ? dbticket['Ticket_Id'] : NewTicket_Id,
                                                    Agent_Email_Id: Is_Customer === true ? objRequest["Agent_Email"] : offical_email_id,
                                                    Transaction_On: dbticket !== null ? dbticket["Transaction_On"] : objRequest["Transaction_On"],
                                                    Source: objRequest["Source"],
                                                    RM_Email_Id: dbticket !== null ? dbticket["RM_Email_Id"] : objRequest["rm_email_id"],
                                                    Insurer_Id: objRequest["Insurer_Id"] !== "" ? parseInt(objRequest["Insurer_Id"]) : "",
                                                    RM_Agent_Name: dbticket !== null ? dbticket["RM_Agent_Name"] : objRequest["rm_agent_name"]
                                                };
                                                var filecount = 0;
                                                if (dbticket !== null) {
                                                    var objticket = {};
                                                    objticket['IsActive'] = 0;

                                                    tickets.updateMany({'Ticket_Id': NewTicket_Id}, {$set: {"IsActive": 0}}, function (err, numAffected) {
                                                        if (err) {
                                                            res.json({Msg: 'Ticket_Not_Saved', Details: err});
                                                        } else {
                                                            //res.json({Msg: 'Success_Created', Details: numAffected});
                                                        }
                                                    });

                                                    for (var j = 1 in dbticket["UploadFiles"]) {
                                                        if (dbticket["UploadFiles"][j] !== null) {
                                                            filecount = dbticket["UploadFiles"]["file_count"];
                                                        }
                                                    }
                                                }

                                                tickets.insertOne(arg, function (err, res1) {
                                                    if (err)
                                                        throw err;
                                                    if (res1["insertedCount"] > 0) {

                                                        //user_details
                                                        var userdetails = {
                                                            data: {
                                                                "Ticket_id": NewTicket_Id,
                                                                "isticket_created": isticket_created,
                                                                "Modified_By": agentdetails.Emp_Id,
                                                                "Remark": objRequest["Remark"]
                                                            },
                                                            headers: {
                                                                "Content-Type": "application/json"
                                                            }
                                                        };

                                                        var url_api = config.environment.weburl + '/tickets/user_details';
                                                        var Client = require('node-rest-client').Client;
                                                        var client = new Client();
                                                        client.post(url_api, userdetails, function (data, response) {
                                                            if (data.Status === "error") {
                                                                throw err;
                                                            } else {
                                                                console.log(response);
                                                                //Upload documnent
                                                                if (file_obj.length > 0) {
                                                                    var objfile = {
                                                                        "file_1": null,
                                                                        "file_2": null,
                                                                        "file_3": null,
                                                                        "file_4": null};
                                                                    var objdata = {'UploadFiles': objfile};
                                                                    if (!fs.existsSync(appRoot + "/tmp/ticketing/" + NewTicket_Id)) {
                                                                        fs.mkdirSync(appRoot + "/tmp/ticketing/" + NewTicket_Id);
                                                                    }
                                                                    var doc_prefix = "";
                                                                    for (var i in file_obj) {
                                                                        var data = file_obj[i].replace(/^data:image\/\w+;base64,/, "");
                                                                        if (data === "") {
                                                                            res1.json({'msg': 'Something Went Wrong'});
                                                                        } else {
                                                                            if (i == 0) {
                                                                                doc_prefix = objRequest["doc_prefix"] !== "" && objRequest["doc_prefix"] !== undefined ? objRequest["doc_prefix"] + "_" : "";
                                                                            }
                                                                            var buf = new Buffer(data, 'base64');
                                                                            fs.writeFile(path + '/' + NewTicket_Id + '/' + doc_prefix + NewTicket_Id + '_file_' + (parseInt(filecount) + 1) + '.' + file_ext[i], buf);
                                                                            objdata.UploadFiles["file_" + (parseInt(filecount) + 1)] = config.environment.downloadurl + '/ticketing/' + NewTicket_Id + '/' + doc_prefix + NewTicket_Id + '_file_' + (parseInt(filecount) + 1) + '.' + file_ext[i];
                                                                            objdata.UploadFiles["file_count"] = (parseInt(filecount) + 1);
                                                                            //fs.writeFile(path + '/' + NewTicket_Id + '_file_' + i + '.' + file_ext[i], buf);
                                                                            //objdata.UploadFiles[i] = config.environment.weburl + '/tmp/ticketing/' + NewTicket_Id + '_file_' + i + '.' + file_ext[i];
                                                                        }
                                                                    }
                                                                    tickets.findAndModify({'Ticket_Id': NewTicket_Id}, [["Modified_On", -1]], {$set: objdata}, {}, function (err, numAffected) {
                                                                        console.log('UserDataUpdated', err, numAffected);
                                                                        if (err) {
                                                                            objdata['Msg'] = err;
                                                                        } else {
                                                                            objdata['Msg'] = numAffected;

                                                                        }
                                                                    });
                                                                }
                                                                var Insurer_name = objRequest["Insurer_Id"] !== "" ? const_arr_insurer["Insurer_" + objRequest["Insurer_Id"]] : "";
                                                                //Send Mail
                                                                var Email = require('../models/email');
                                                                var objModelEmail = new Email();
                                                                var environment = config.environment.name === 'Production' ? "" : "QA-";
                                                                if (objRequest["CRN"] !== "" || objRequest["CRN"] !== null || objRequest["CRN"] !== undefined) {
                                                                    var subject = "[TICKET] " + NewTicket_Id + " - " + objRequest["CRN"] + " " + environment + objRequest["Product"] + '-' + objRequest["Category"] + '-' + objRequest["SubCategory"];
                                                                } else {
                                                                    var subject = "[TICKET] " + NewTicket_Id + " " + environment + objRequest["Product"] + '-' + objRequest["Category"] + '-' + objRequest["SubCategory"];
                                                                }
                                                                var rm_emailid = dbticket !== null ? dbticket["RM_Email_Id"] : objRequest["rm_email_id"];
                                                                var cc = '';

                                                                var mail_content = '<html><body>' +
                                                                        'Ticket is created.' +
                                                                        '<p></p>Ticket No - ' + NewTicket_Id +
                                                                        '<p></p>CRN  - ' + objRequest["CRN"] +
                                                                        '<p></p>Status  - ' + objRequest["Status"] +
                                                                        '<p></p>Product  - ' + objRequest["Product"] +
                                                                        '<p></p>Remarks  - ' + objRequest["Remark"] +
                                                                        '<p></p>You will be notified once ticket is resolved.' +
                                                                        '<p></p>You can check ticket status in my ticket section.' +
                                                                        '</body></html>';
                                                                var email_id;
                                                                if (Is_Customer) {
                                                                    email_id = objRequest["Agent_Email"];
                                                                } else {
                                                                    email_id = agentdetails.Email_Id;
                                                                }
                                                                if (emailtocc.hasOwnProperty(objRequest["Category_Name"])) {
//                                                            if (objRequest["Category_Name"] === "Product Input Page") {
//                                                                if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"] !== "")
//                                                                {
//                                                                    email_id += "," + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"];
//                                                                }
//                                                                if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"] !== "")
//                                                                {
//                                                                    cc += rm_emailid !== "" ? "," + rm_emailid : '' + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"];
//                                                                }
//                                                            } else {

                                                                    if (emailtocc[objRequest["Category_Name"]][0]["to"] !== "")
                                                                    {
                                                                        email_id += "," + emailtocc[objRequest["Category_Name"]][0]["to"];
                                                                    }
                                                                    if (emailtocc[objRequest["Category_Name"]][0]["cc"] !== "")
                                                                    {
                                                                        cc += rm_emailid !== "" ? "," + rm_emailid : '' + emailtocc[objRequest["Category_Name"]][0]["cc"];
                                                                    }
//                                                            }
                                                                }
                                                                if (email_id !== null || email_id !== undefined) {
                                                                    objModelEmail.send('noreply@policyboss.com', email_id, subject, mail_content, cc, config.environment.notification_email, objRequest["CRN"]);
                                                                }

                                                                if (Ticket_id === "") {
                                                                    res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is created.', 'Created_On': moment(todayDate).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Insurer_Name': Insurer_name, 'Product_Name': objRequest['Product']});
                                                                } else {
                                                                    res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is updated.', 'Created_On': moment(todayDate).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Insurer_Name': Insurer_name, 'Product_Name': objRequest['Product']});
                                                                }

                                                            }
                                                        });
                                                        //user_details end
                                                    } else {
                                                        res.json({'Status': "Fail", 'Msg': "No Ticket raised"});
                                                    }
                                                    //console.log(res);
                                                });
                                            });

                                        } else {
                                            res.json({'Status': "exist", 'Msg': 'Ticket for this CRN under this category is already created'});
                                        }
                                    });
                                }
                            });
                        });
                        //res.json({'Status': "Inserted Succefully"});
                    } else {
                        objRequest['agent'] = 'NA';
                    }
                });
            }
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });
    app.post('/tickets/raiseticket_beta', multipartMiddleware, function (req, res, next) {
        try {
            var objRequest = req.body;
            var product_id = 0;
            var path = appRoot + "/tmp/ticketing/";
            var Ticket_id = objRequest["Ticket_Id"];
            var isticket_created;
            var Is_Customer = objRequest['Is_Customer'] === undefined ? false : objRequest['Is_Customer'];
            console.log(objRequest);
            console.error(objRequest);
            var ss_id = parseInt(objRequest['ss_id']);
            if ((ss_id > 0 && ss_id !== 5) || Is_Customer === true) {
                var Client = require('node-rest-client').Client;
                var client = new Client();
                client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id, {}, function (data, response) {
                    if (data['status'] === 'SUCCESS' || Is_Customer === true) {
                        objRequest['agent'] = data;
                        var agentdetails = objRequest['agent']['EMP'];
                        if (data['user_type'] === "FOS") {
                            if (data.EMP.Email_Id) {
                                offical_email_id = data.EMP.Email_Id;
                            }
                            if (data.RM.rm_details.email) {
                                offical_email_id += offical_email_id === "" ? data.RM.rm_details.email : "," + data.RM.rm_details.email;
                            }
                        } else if (data['user_type'] === "POSP") {
                            if (data.POSP.Email_Id) {
                                offical_email_id = data.POSP.Email_Id;
                            }
                            if (data.RM.rm_details.email) {
                                offical_email_id += offical_email_id === "" ? data.RM.rm_details.email : "," + data.RM.rm_details.email;
                            }
                        } else if (data['user_type'] === "EMP") {
                            if (data.EMP.Email_Id) {
                                offical_email_id = data.EMP.Email_Id;
                            }
                        } else if (data['user_type'] === "MISP") {
                            if (data.EMP.Email_Id) {
                                offical_email_id = data.EMP.Email_Id;
                            }
                            if (data.EMP.Reporting_Email_ID) {
                                offical_email_id += offical_email_id === "" ? data.EMP.Reporting_Email_ID : ',' + data.EMP.Reporting_Email_ID;
                            }
                        }
                        if (objRequest["Product"] === "CAR") {
                            product_id = 1;
                        } else if (objRequest["Product"] === "BIKE") {
                            product_id = 10;
                        } else if (objRequest["Product"] === "HEALTH") {
                            product_id = 2;
                        }

                        var file_obj = [];
                        var file_ext = [];
                        for (var i = 1; i <= 4; i++) {
                            if (objRequest["file_" + i] !== null && objRequest["file_" + i] !== "" && objRequest["file_" + i] !== undefined) {
                                file_obj.push(decodeURIComponent(objRequest["file_" + i]));
                            }
                        }
                        for (var i = 1; i <= 4; i++) {
                            if (objRequest["file_ext_" + i] !== null && objRequest["file_ext_" + i] !== "" && objRequest["file_" + i] !== undefined) {
                                file_ext.push(objRequest["file_ext_" + i]);
                            }
                        }
                        console.log(file_obj);
                        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                            if (err)
                                throw err;

                            autoIncrement.getNextSequence(db, 'tickets', function (err1, autoIndex) {
                                var tickets = db.collection('tickets');
                                var agg = [
                                    // Group by the grouping key, but keep the valid values
                                    {"$group": {
                                            "_id": "$Ticket_Id",
                                            "docId": {"$last": "$_id"},
                                            "Ticket_Id": {"$last": "$Ticket_Id"},
                                            "Category": {"$last": "$Category"},
                                            "SubCategory": {"$last": "$SubCategory"},
                                            "From": {"$last": "$From"},
                                            "To": {"$last": "$To"},
                                            "Status": {"$last": "$Status"},
                                            "Created_by": {"$last": "$Created_by"},
                                            "Created_On": {"$last": "$Created_On"},
                                            "Modified_On": {"$last": "$Modified_On"},
                                            "CRN": {"$last": "$CRN"},
                                            "Mobile_No": {"$last": "$Mobile_No"},
                                            "Vehicle_No": {"$last": "$Vehicle_No"},
                                            "Remark": {"$last": "$Remark"},
                                            "ss_id": {"$last": "$ss_id"},
                                            "SubCategory_level2": {"$last": "$SubCategory_level2"},
                                            "Product": {"$last": "$Product"}
                                        }},
                                    // Then sort
                                    {"$sort": {"Created_On": -1}}

                                ];
                                console.log(agg);
                                //tickets.aggregate(agg, function (err1, dbTicket1) {
                                if (err1) {
                                    throw err1;
                                } else {
                                    tickets.find({"$or": [{"CRN": (objRequest.CRN).toString()}, {"CRN": parseInt(objRequest.CRN)}], "Category": objRequest.Category}).toArray(function (err, crn_cat_exist) {
                                        if (((crn_cat_exist.length > 0 || crn_cat_exist.length === 0) && objRequest.CRN === "") || (objRequest.CRN !== "" && objRequest.Ticket_Id !== "")
                                                || (crn_cat_exist.length === 0 && objRequest.CRN !== "")) {
                                            //if (dbTicket1.length > 0) {
                                            //   debugger;
                                            //}
                                            var todayDate = new Date();

                                            var NewTicket_Id;

                                            if (Ticket_id === "") {
                                                //create new ticket id.
                                                NewTicket_Id = objRequest["Product"].substring(0, 2).toString().toUpperCase() + objRequest["Category"].substring(0, 2).toString().toUpperCase() + autoIndex;
                                                isticket_created = 1;
                                            } else {
                                                NewTicket_Id = Ticket_id;
                                                isticket_created = 0;
                                            }
                                            tickets.findOne({"Ticket_Id": Ticket_id}, {sort: {"Modified_On": -1}}, function (err, dbticket) {
                                                console.log(dbticket);
                                                var arg = {};

                                                arg = {
                                                    Ticket_Id: dbticket !== null ? dbticket['Ticket_Id'] : NewTicket_Id,
                                                    Product: dbticket !== null ? dbticket['Product'] : product_id,
                                                    Category: dbticket !== null ? dbticket["Category"] : objRequest["Category"],
                                                    SubCategory: dbticket !== null ? dbticket["SubCategory"] : objRequest["SubCategory"],
                                                    Proposal_Error_Msg: objRequest["Proposal_Error_Msg"],
                                                    From: dbticket !== null ? dbticket["From"] : (Is_Customer === true ? objRequest["Created_By"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') '),
                                                    To: dbticket !== null ? dbticket["To"] : (Is_Customer === true ? objRequest["Created_By"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') '),
                                                    Status: objRequest["Status"] === "0" ? dbticket["Status"] : objRequest["Status"],
                                                    Created_By: dbticket !== null ? dbticket["Created_By"] : (Is_Customer === true ? objRequest["Created_By"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') '),
                                                    Modified_By: agentdetails.Emp_Id,
                                                    Created_On: dbticket !== null ? dbticket["Created_On"] : todayDate,
                                                    Modified_On: todayDate,
                                                    CRN: dbticket !== null ? dbticket["CRN"] : objRequest["CRN"] - 0,
                                                    Mobile_No: dbticket !== null ? dbticket["Mobile_No"] : objRequest["Mobile_No"],
                                                    Vehicle_No: dbticket !== null ? dbticket["Vehicle_No"] : objRequest["Vehicle_No"],
                                                    Remark: objRequest["Remark"],
                                                    ss_id: dbticket !== null ? dbticket["ss_id"] : agentdetails.Emp_Id,
                                                    SubCategory_level2: objRequest["SubCategory_level2"],
                                                    CRN_owner: dbticket !== null ? dbticket["CRN_owner"] : objRequest["CRN_owner"],
                                                    IsActive: 1,
                                                    fba_id: dbticket !== null ? dbticket["fba_id"] : agentdetails.FBA_ID,
                                                    CRN_fba_id: dbticket !== null ? dbticket["CRN_fba_id"] : objRequest["CRN_fba_id"],
                                                    channel: dbticket !== null ? dbticket["channel"] : objRequest["channel"],
                                                    subchannel: dbticket !== null ? dbticket["subchannel"] : objRequest["subchannel"],
                                                    UploadFiles: dbticket !== null ? dbticket["UploadFiles"] : "",
                                                    Ticket_Code: dbticket !== null ? dbticket['Ticket_Id'] : NewTicket_Id,
                                                    Agent_Email_Id: dbticket !== null ? dbticket['Agent_Email_Id'] : offical_email_id,
                                                    Transaction_On: dbticket !== null ? dbticket["Transaction_On"] : objRequest["Transaction_On"],
                                                    Source: objRequest["Source"],
                                                    RM_Email_Id: dbticket !== null ? dbticket["RM_Email_Id"] : objRequest["rm_email_id"],
                                                    RM_Agent_Name: dbticket !== null ? dbticket["RM_Agent_Name"] : objRequest["rm_agent_name"],
                                                    Insurer_Id: objRequest["Insurer_Id"] !== "" ? parseInt(objRequest["Insurer_Id"]) : ""
                                                };
                                                var filecount = 0;
                                                if (dbticket !== null) {
                                                    var objticket = {};
                                                    objticket['IsActive'] = 0;

                                                    tickets.updateMany({'Ticket_Id': NewTicket_Id}, {$set: {"IsActive": 0}}, function (err, numAffected) {
                                                        if (err) {
                                                            res.json({Msg: 'Ticket_Not_Saved', Details: err});
                                                        } else {
                                                            //res.json({Msg: 'Success_Created', Details: numAffected});
                                                        }
                                                    });

                                                    for (var j = 1 in dbticket["UploadFiles"]) {
                                                        if (dbticket["UploadFiles"][j] !== null) {
                                                            filecount = dbticket["UploadFiles"]["file_count"];
                                                        }
                                                    }
                                                }

                                                tickets.insertOne(arg, function (err, res1) {
                                                    if (err)
                                                        throw err;
                                                    if (res1["insertedCount"] > 0) {

                                                        //user_details
                                                        var userdetails = {
                                                            data: {
                                                                "Ticket_id": NewTicket_Id,
                                                                "isticket_created": isticket_created,
                                                                "Modified_By": agentdetails.Emp_Id,
                                                                "Remark": objRequest["Remark"],
                                                                "Status": objRequest["Status"]
                                                            },
                                                            headers: {
                                                                "Content-Type": "application/json"
                                                            }
                                                        };

                                                        var url_api = config.environment.weburl + '/tickets/user_details';
                                                        var Client = require('node-rest-client').Client;
                                                        var client = new Client();
                                                        client.post(url_api, userdetails, function (data, response) {
                                                            if (data.Status === "error") {
                                                                throw err;
                                                            } else {
                                                                console.log(response);
                                                                //Upload documnent

                                                                movefilelocation(req.files.uploads, NewTicket_Id, objRequest["doc_prefix"]);

                                                                //Send Mail
                                                                var Email = require('../models/email');
                                                                var objModelEmail = new Email();
                                                                var environment = config.environment.name === 'Production' ? "" : "QA-";
                                                                if (objRequest["CRN"] !== "" || objRequest["CRN"] !== null || objRequest["CRN"] !== undefined) {
                                                                    var subject = "[TICKET] " + NewTicket_Id + " - " + objRequest["CRN"] + " " + environment + objRequest["Product"] + '-' + objRequest["Category"] + '-' + objRequest["SubCategory"];
                                                                } else {
                                                                    var subject = "[TICKET] " + NewTicket_Id + " " + environment + objRequest["Product"] + '-' + objRequest["Category"] + '-' + objRequest["SubCategory"];
                                                                }
                                                                var rm_emailid = dbticket !== null ? dbticket["RM_Email_Id"] : objRequest["rm_email_id"];
                                                                var cc = '';

                                                                var mail_content = '<html><body>' +
                                                                        'Ticket is created.' +
                                                                        '<p></p>Ticket No - ' + NewTicket_Id +
                                                                        '<p></p>CRN  - ' + objRequest["CRN"] +
                                                                        '<p></p>Status  - ' + objRequest["Status"] +
                                                                        '<p></p>Product  - ' + objRequest["Product"] +
                                                                        '<p></p>Remarks  - ' + objRequest["Remark"] +
                                                                        '<p></p>You will be notified once ticket is resolved.' +
                                                                        '<p></p>You can check ticket status in my ticket section.' +
                                                                        '</body></html>';
                                                                var email_id;
                                                                if (Is_Customer) {
                                                                    email_id = objRequest["Agent_Email"];
                                                                } else {
                                                                    email_id = offical_email_id;
                                                                }
                                                                if (emailtocc.hasOwnProperty(objRequest["Category_Name"])) {
//                                                                if (objRequest["Category_Name"] === "Product Input Page") {
//                                                                    if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"] !== "")
//                                                                    {
//                                                                        email_id += "," + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"];
//                                                                    }
//                                                                    if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"] !== "")
//                                                                    {
//                                                                        cc += rm_emailid !== "" ? "," + rm_emailid : '' + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"];
//                                                                    }
//                                                                } else {

                                                                    if (emailtocc[objRequest["Category_Name"]][0]["to"] !== "")
                                                                    {
                                                                        email_id += "," + emailtocc[objRequest["Category_Name"]][0]["to"];
                                                                    }
                                                                    if (emailtocc[objRequest["Category_Name"]][0]["cc"] !== "")
                                                                    {
                                                                        cc += rm_emailid !== "" ? "," + rm_emailid : '' + emailtocc[objRequest["Category_Name"]][0]["cc"];
                                                                    }
//                                                                }
                                                                }
                                                                if (email_id !== null || email_id !== undefined) {
                                                                    objModelEmail.send('noreply@policyboss.com', email_id, subject, mail_content, cc, config.environment.notification_email, objRequest["CRN"]);
                                                                }

                                                                if (Ticket_id === "") {
                                                                    res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is created.', 'Created_On': moment(todayDate).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss")});
                                                                } else {
                                                                    res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is updated.', 'Created_On': moment(todayDate).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss")});
                                                                }

                                                            }
                                                        });
                                                        //user_details end
                                                    } else {
                                                        res.json({'Status': "Fail", 'Msg': "No Ticket raised"});
                                                    }
                                                    //console.log(res);
                                                });
                                            });
                                        } else {
                                            res.json({'Status': "exist", 'Msg': 'Ticket for this CRN under this category is already created'});
                                        }
                                    });
                                }
                            });
                        });
                        //res.json({'Status': "Inserted Succefully"});
                    } else {
                        objRequest['agent'] = 'NA';
                    }
                });
            }
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });

    app.post('/raise_ticket1', function (req, res, next) {
        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            res.end(util.inspect({fields: fields, files: files}));
        });
    });
    app.post('/raise_ticket', function (req, res, next) {
        try {
            var formidable = require('formidable');
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                //var objRequest = fields;

                var objRequest = fields;
                var files = files;
                var product_id = 0;
                var Ticket_id = objRequest["Ticket_Id"];
                var isticket_created;
                var Is_Customer = Boolean(parseInt(objRequest['Is_Customer']));

                console.error(objRequest);

                if ((objRequest['ss_id'] > 0 && objRequest['ss_id'] !== 5) || Is_Customer === true) {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    client.get(config.environment.weburl + '/posps/dsas/view/' + objRequest['ss_id'], {}, function (data, response) {
                        if (data['status'] === 'SUCCESS' || Is_Customer) {
                            objRequest['agent'] = data;
                            var agentdetails = objRequest['agent']['EMP'];
                            if (objRequest["Product"] === "CAR") {
                                product_id = 1;
                            } else if (objRequest["Product"] === "BIKE") {
                                product_id = 10;
                            } else if (objRequest["Product"] === "HEALTH") {
                                product_id = 2;
                            }

                            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                                if (err)
                                    throw err;

                                autoIncrement.getNextSequence(db, 'tickets', function (err1, autoIndex) {
                                    var tickets = db.collection('tickets');
                                    var agg = [
                                        // Group by the grouping key, but keep the valid values
                                        {"$group": {
                                                "_id": "$Ticket_Id",
                                                "docId": {"$last": "$_id"},
                                                "Ticket_Id": {"$last": "$Ticket_Id"},
                                                "Category": {"$last": "$Category"},
                                                "SubCategory": {"$last": "$SubCategory"},
                                                "From": {"$last": "$From"},
                                                "To": {"$last": "$To"},
                                                "Status": {"$last": "$Status"},
                                                "Created_by": {"$last": "$Created_by"},
                                                "Created_On": {"$last": "$Created_On"},
                                                "Modified_On": {"$last": "$Modified_On"},
                                                "CRN": {"$last": "$CRN"},
                                                "Mobile_No": {"$last": "$Mobile_No"},
                                                "Vehicle_No": {"$last": "$Vehicle_No"},
                                                "Remark": {"$last": "$Remark"},
                                                "ss_id": {"$last": "$ss_id"},
                                                "SubCategory_level2": {"$last": "$SubCategory_level2"},
                                                "Product": {"$last": "$Product"}
                                            }},
                                        // Then sort
                                        {"$sort": {"Created_On": -1}}

                                    ];
                                    console.log(agg);
                                    //tickets.aggregate(agg, function (err1, dbTicket1) {
                                    if (err1) {
                                        throw err1;
                                    } else {

                                        //if (dbTicket1.length > 0) {
                                        //   debugger;
                                        //}
                                        var todayDate = new Date();

                                        var NewTicket_Id;

                                        if (Ticket_id === "") {
                                            //create new ticket id.
                                            NewTicket_Id = objRequest["Product"].substring(0, 2).toString().toUpperCase() + objRequest["Category"].substring(0, 2).toString().toUpperCase() + autoIndex;
                                            isticket_created = 1;
                                        } else {
                                            NewTicket_Id = Ticket_id;
                                            isticket_created = 0;
                                        }
                                        tickets.findOne({"Ticket_Id": Ticket_id}, {sort: {"Modified_On": -1}}, function (err, dbticket) {
                                            console.log(dbticket);
                                            var arg = {};

                                            arg = {
                                                Ticket_Id: dbticket !== null ? dbticket['Ticket_Id'] : NewTicket_Id,
                                                Product: dbticket !== null ? dbticket['Product'] : product_id,
                                                Category: dbticket !== null ? dbticket["Category"] : objRequest["Category"],
                                                SubCategory: dbticket !== null ? dbticket["SubCategory"] : objRequest["SubCategory"],
                                                Proposal_Error_Msg: objRequest["Proposal_Error_Msg"],
                                                From: dbticket !== null ? dbticket["From"] : (Is_Customer === true ? objRequest["Created_By"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') '),
                                                To: dbticket !== null ? dbticket["To"] : (Is_Customer === true ? objRequest["Created_By"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') '),
                                                Status: objRequest["Status"] === "0" ? dbticket["Status"] : objRequest["Status"],
                                                Created_By: dbticket !== null ? dbticket["Created_By"] : (Is_Customer === true ? objRequest["Created_By"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') '),
                                                Modified_By: agentdetails.Emp_Id,
                                                Created_On: dbticket !== null ? dbticket["Created_On"] : todayDate,
                                                Modified_On: todayDate,
                                                CRN: dbticket !== null ? dbticket["CRN"] : objRequest["CRN"] - 0,
                                                Mobile_No: dbticket !== null ? dbticket["Mobile_No"] : objRequest["Mobile_No"],
                                                Vehicle_No: dbticket !== null ? dbticket["Vehicle_No"] : objRequest["Vehicle_No"],
                                                Remark: objRequest["Remark"],
                                                ss_id: dbticket !== null ? dbticket["ss_id"] : agentdetails.Emp_Id,
                                                SubCategory_level2: objRequest["SubCategory_level2"],
                                                CRN_owner: dbticket !== null ? dbticket["CRN_owner"] : objRequest["CRN_owner"],
                                                IsActive: 1,
                                                fba_id: dbticket !== null ? dbticket["fba_id"] : agentdetails.FBA_ID,
                                                CRN_fba_id: dbticket !== null ? dbticket["CRN_fba_id"] : objRequest["CRN_fba_id"],
                                                channel: dbticket !== null ? dbticket["channel"] : objRequest["channel"],
                                                subchannel: dbticket !== null ? dbticket["subchannel"] : objRequest["subchannel"],
                                                UploadFiles: dbticket !== null ? dbticket["UploadFiles"] : "",
                                                Ticket_Code: dbticket !== null ? dbticket['Ticket_Id'] : NewTicket_Id,
                                                Agent_Email_Id: dbticket !== null ? dbticket['Agent_Email_Id'] : agentdetails.Email_Id,
                                                Transaction_On: dbticket !== null ? dbticket["Transaction_On"] : objRequest["Transaction_On"],
                                                Source: objRequest["Source"],
                                                RM_Email_Id: dbticket !== null ? dbticket["RM_Email_Id"] : objRequest["rm_email_id"],
                                                Insurer_Id: objRequest["Insurer_Id"] !== "" ? parseInt(objRequest["Insurer_Id"]) : ""

                                            };
                                            var filecount = 0;
                                            if (dbticket !== null) {
                                                var objticket = {};
                                                objticket['IsActive'] = 0;

                                                tickets.updateMany({'Ticket_Id': NewTicket_Id}, {$set: {"IsActive": 0}}, function (err, numAffected) {
                                                    if (err) {
                                                        res.json({Msg: 'Ticket_Not_Saved', Details: err});
                                                    } else {
                                                        //res.json({Msg: 'Success_Created', Details: numAffected});
                                                    }
                                                });

                                                for (var j = 1 in dbticket["UploadFiles"]) {
                                                    if (dbticket["UploadFiles"][j] !== null) {
                                                        filecount = dbticket["UploadFiles"]["file_count"];
                                                    }
                                                }
                                            }

                                            tickets.insertOne(arg, function (err, res1) {
                                                if (err)
                                                    throw err;
                                                if (res1["insertedCount"] > 0) {

                                                    //user_details start
                                                    var user_details = db.collection('user_details');
                                                    if (isticket_created === 1) {
                                                        var ObjUser_Data = {"PG_Dropoff_Status": objRequest["PG_Dropoff_Status"]};
                                                        User_Data.update({'User_Data_Id': objRequest['User_Data_Id'] - 0}, {$set: ObjUser_Data}, function (err, numAffected) {

                                                        });

                                                        autoIncrement.getNextSequence(db, 'user_details', function (err1, autoIndex) {
                                                            var arg = {
                                                                Ticket_Id: autoIndex,
                                                                Ticket_code: NewTicket_Id,
                                                                Product: objRequest["Product"],
                                                                Category: objRequest["Category"],
                                                                Status: objRequest["Status"],
                                                                Created_By: objRequest["Created_By"],
                                                                Created_On: objRequest["Created_On"] === "" ? todayDate : objRequest["Created_On"],
                                                                Modified_By: objRequest["Modified_By"] - 0,
                                                                Modified_On: todayDate,
                                                                CRN: objRequest["CRN"],
                                                                ss_id: objRequest["ss_id"] - 0,
                                                                CRN_owner: objRequest["CRN_owner"],
                                                                fba_id: objRequest["fba_id"],
                                                                CRN_fba_id: objRequest["CRN_fba_id"],
                                                                channel: objRequest["channel"],
                                                                subchannel: objRequest["subchannel"],
                                                                Source: objRequest["Source"],
                                                                RM_Email_Id: objRequest["rm_email_id"],
                                                                Insurer_Id: objRequest["Insurer_Id"]
                                                            };
                                                            user_details.insertOne(arg, function (err, res1) {
                                                                if (err) {
                                                                    throw err;
                                                                } else {
                                                                    console.log('user_detailsInsert', err, res1);
                                                                }
                                                            });
                                                        });
                                                    } else {
                                                        var objticket = {
                                                            "Modified_By": objRequest["Modified_By"] - 0,
                                                            "Status": objRequest['Status'],
                                                            "Modified_On": todayDate
                                                        };
                                                        user_details.update({'Ticket_code': NewTicket_Id}, {$set: objticket}, function (err, numAffected) {
                                                            console.log('user_detailsUpdate', err, numAffected);
                                                        });
                                                    }
                                                    //user_details end

                                                    //Upload documnent
                                                    var objfile = {
                                                        "file_1": null,
                                                        "file_2": null,
                                                        "file_3": null,
                                                        "file_4": null};
                                                    var objdata = {'UploadFiles': objfile};

                                                    if (JSON.stringify(files) !== "{}") {
                                                        if (!fs.existsSync(appRoot + "/tmp/ticketing/" + NewTicket_Id)) {
                                                            fs.mkdirSync(appRoot + "/tmp/ticketing/" + NewTicket_Id);
                                                        }
                                                        for (var i in files) {
                                                            var pdf_file_name = files[i].name.split('.')[0].replace(/ /g, '') + "." + files[i].name.split('.')[files[i].name.split('.').length - 1];
                                                            var pdf_sys_loc_horizon = appRoot + "/tmp/ticketing/" + NewTicket_Id + "/" + objRequest["ss_id"] + "_" + pdf_file_name;
                                                            var pdf_web_path_horizon = config.environment.downloadurl + "/ticketing/" + NewTicket_Id + "/" + objRequest["ss_id"] + "_" + pdf_file_name;
                                                            objdata.UploadFiles[i] = pdf_web_path_horizon;
                                                            var oldpath = files[i].path;
                                                            fs.readFile(oldpath, function (err, data) {
                                                                if (err)
                                                                {
                                                                    console.error('Read', err);
                                                                }
                                                                console.log('File read!');

                                                                // Write the file
                                                                fs.writeFile(pdf_sys_loc_horizon, data, function (err) {
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
                                                            // sleep(1000);
                                                        }
                                                        tickets.update({'Ticket_Id': NewTicket_Id}, {$set: objdata}, function (err, numAffected) {
                                                            console.log('TicketUpdated', err, numAffected);
                                                            if (err) {
                                                                objdata['Msg'] = err;
                                                            } else {
                                                                objdata['Msg'] = numAffected;
                                                            }
                                                            //res.json(objUserData);
                                                        });
                                                    }
                                                    //Send Mail
                                                    var Email = require('../models/email');
                                                    var objModelEmail = new Email();
                                                    var environment = config.environment.name === 'Production' ? "" : "QA-";
                                                    if (objRequest["CRN"] !== "" || objRequest["CRN"] !== null || objRequest["CRN"] !== undefined) {
                                                        var subject = "[TICKET] " + NewTicket_Id + " - " + objRequest["CRN"] + " " + environment + objRequest["Product"] + '-' + objRequest["Category"] + '-' + objRequest["SubCategory"];
                                                    } else {
                                                        var subject = "[TICKET] " + NewTicket_Id + " " + environment + objRequest["Product"] + '-' + objRequest["Category"] + '-' + objRequest["SubCategory"];
                                                    }
                                                    var rm_emailid = dbticket !== null ? dbticket["RM_Email_Id"] : objRequest["rm_email_id"];
                                                    var cc = 'techsupport@policyboss.com';

                                                    var Insurer_Name = objRequest["insurer_id"] !== "" ? const_arr_insurer["Insurer_" + objRequest["insurer_id"]] : "";
                                                    var mail_content = '<html><body>' +
                                                            'Ticket is created.' +
                                                            '<p></p>Ticket No - ' + NewTicket_Id +
                                                            '<p></p>CRN  - ' + objRequest["CRN"] +
                                                            '<p></p>Status  - ' + objRequest["Status"] +
                                                            '<p></p>Product  - ' + objRequest["Product"] +
                                                            '<p></p>Remarks  - ' + objRequest["Remark"] +
                                                            '<p></p>You will be notified once ticket is resolved.' +
                                                            '<p></p>You can check ticket status in my ticket section.' +
                                                            '</body></html>';

                                                    var email_id;
                                                    if (Is_Customer) {
                                                        email_id = objRequest["Agent_Email"];
                                                    } else {
                                                        email_id = agentdetails.Email_Id;
                                                    }

                                                    if (emailtocc.hasOwnProperty(objRequest["Category_Name"])) {
//                                                        if (objRequest["Category_Name"] === "Product Input Page") {
//                                                            if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"] !== "")
//                                                            {
//                                                                email_id += "," + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"];
//                                                            }
//                                                            if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"] !== "")
//                                                            {
//                                                                cc += rm_emailid !== "" ? "," + rm_emailid : '' + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"];
//                                                            }
//                                                        } else {

                                                        if (emailtocc[objRequest["Category_Name"]][0]["to"] !== "")
                                                        {
                                                            email_id += "," + emailtocc[objRequest["Category_Name"]][0]["to"];
                                                        }
                                                        if (emailtocc[objRequest["Category_Name"]][0]["cc"] !== "")
                                                        {
                                                            cc += rm_emailid !== "" ? "," + rm_emailid : '' + emailtocc[objRequest["Category_Name"]][0]["cc"];
                                                        }
//                                                        }
                                                    }

                                                    objModelEmail.send('noreply@policyboss.com', email_id, subject, mail_content, cc, config.environment.notification_email, objRequest["CRN"]);


                                                    if (Ticket_id === "") {
                                                        res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is created.', 'Created_On': moment(todayDate).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Insurer_Name': Insurer_Name});
                                                    } else {
                                                        res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is updated.', 'Created_On': moment(todayDate).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Insurer_Name': Insurer_Name});
                                                    }

                                                    // }
                                                    // });
                                                    //user_details end
                                                } else {
                                                    res.json({'Status': "Fail", 'Msg': "No Ticket raised"});
                                                }
                                                //console.log(res);
                                            });
                                        });
                                    }
                                });
                            });
                            //res.json({'Status': "Inserted Succefully"});
                        } else {
                            objRequest['agent'] = 'NA';
                        }
                    });
                }
            });
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });


    app.get('/ticket_Comments/:Ticket_Id', function (req, res) {
        try {
            var Ticket_id = req.params['Ticket_Id'];
            var ObjResposne = [];
            var tickets = require('../models/ticket');

            tickets.find({"Ticket_Id": Ticket_id}).sort({"Modified_On": -1}).exec(function (err, dbtickets) {
                if (err) {
                    res.send(err);
                } else {
                    console.log(dbtickets.length);
                    for (var i in dbtickets) {

                        var dbtickets1 = dbtickets[i]._doc;
                        if (dbtickets1['Status'] !== "InProgress") {
                            var Obj = {
                                "Remark": dbtickets1['Remark'],
                                "UploadFiles": dbtickets1['UploadFiles']
                            };
                            ObjResposne.push(Obj);
                        }
                    }
                    res.json(ObjResposne);
                }
            });
            //});

        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });
    app.get('/tickets/getCRNdetails/:CRN', function (req, res) {
        try {
            var CRN = req.params['CRN'];
            var user_data = require('../models/user_data');
            var ObjArrResponse = [];
            var objResponse = {};

            //MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            user_data.find({'PB_CRN': CRN}).exec(function (err, dbUsers) {
                if (err)
                    throw err;

                if (dbUsers.length > 0) {
                    for (var i in dbUsers) {
                        var user_data = dbUsers[i]._doc;

                        objResponse['Product'] = user_data['Product_Id'];
                        objResponse['Insurer_Id'] = user_data['Insurer_Id'] === undefined ? "" : user_data['Insurer_Id'];
                        objResponse['Last_Status'] = user_data['Last_Status'];
                        objResponse['Vehicle_No'] = user_data['Premium_Request']['registration_no'];
                        objResponse['Mobile_No'] = user_data['Premium_Request']['mobile'];
                        objResponse['ss_id'] = user_data['Premium_Request']['ss_id'];
                        objResponse['fba_id'] = user_data['Premium_Request']['fba_id'];
                        objResponse['subchannel'] = user_data['Premium_Request']['posp_sources'] - 0 === 0 ? user_data['Premium_Request']['subchannel'] !== "" && user_data['Premium_Request']['subchannel'] !== undefined && user_data['Premium_Request']['subchannel'] !== null ? user_data['Premium_Request']['subchannel'] : get_search_source(user_data) : get_search_source(user_data);
                        objResponse['channel'] = user_data['Premium_Request']['posp_sources'] - 0 === 0 ? user_data['Premium_Request']['channel'] !== "" && user_data['Premium_Request']['channel'] !== undefined && user_data['Premium_Request']['channel'] !== null ? user_data['Premium_Request']['channel'] : get_channel(objResponse['subchannel']) : get_channel(objResponse['subchannel']);
                        objResponse['transaction_on'] = user_data['Created_On'];
                        objResponse['Customer_Name'] = user_data['Premium_Request']['first_name'] + ' ' + user_data['Premium_Request']['middle_name'] + ' ' + user_data['Premium_Request']['last_name'];
                        objResponse['rm_email_id'] = user_data['Premium_Request']['posp_reporting_email_id'] !== 0 ? user_data['Premium_Request']['posp_reporting_email_id'] : "";
                        objResponse['rm_agent_name'] = user_data['Premium_Request']['posp_reporting_agent_name'] !== "" && user_data['Premium_Request']['posp_reporting_agent_name'] !== undefined ? user_data['Premium_Request']['posp_reporting_agent_name'] : "";
                    }
                    ObjArrResponse.push(objResponse);
                }
                res.json(ObjArrResponse);
            });
            //});
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });

    app.get('/tickets/gettickingCategory1', function (req, res) {
        try {
            var obj = [];
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                var arr = [
                    {
                        $lookup:
                                {
                                    from: "ticking_subcategory",
                                    localField: "Category_Id",
                                    foreignField: "Category_Id",
                                    as: "SubCategory"
                                }
                    }
                ];
                db.collection('ticking_category').aggregate(arr).toArray(function (err, dbCategory) {
                    if (err) {
                        res.send(err);
                    } else {
                        console.log(dbCategory);
                        res.json(dbCategory);
                    }
                });
            });
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });

    app.get('/tickets/getticketingSubCategory/:category/:product_id', function (req, res) {
        try {

            var obj = [];
            var category_id = req.params['category'] - 0;
            var productid = parseInt(req.params['product_id']);
            var cache_key = 'live_tickets_getticketingSubCategory_' + category_id + '_' + productid;
            var arr = {};
            if (productid !== null && productid !== "" && productid !== 0) {
                arr = {"Category_Id": category_id,
                    "Product_Id": {$in: [productid]}
                };
            } else {
                arr = {"Category_Id": category_id
                };
            }
            if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
                var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
                var obj_cache_content = JSON.parse(cache_content);
                res.json(obj_cache_content);
            } else {
                var dbticketing_subcategory = myDb.collection('ticketing_subcategory');
                dbticketing_subcategory.find(arr).toArray(function (err, dbsubCategory) {
                    if (err) {
                        res.send(err);
                    } else {
                        console.log(dbsubCategory);
                        for (var i in dbsubCategory) {
                            // obj.push(dbsubCategory[i]['SubCategory']);
                            obj.push({
                                key: dbsubCategory[i]['SubCategory_Id'] + ':' + dbsubCategory[i]['Product_Id'],
                                value: dbsubCategory[i]['SubCategory'],
                                category_id: dbsubCategory[i]['Category_Id'],
                                subcategory_id: dbsubCategory[i]['SubCategory_Id'],
                                error_code: dbsubCategory[i]['Error_Code'],
                                product: dbsubCategory[i]['Product_Id'],
                                documents: dbsubCategory[i]['documents']
                            });
                        }
                        fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(obj), function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                        res.json(obj);
                    }
                });
            }
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });

    app.post('/tickets/getticketsList', function (req, res) {

        try {
            var objCategory = [];
            var ObjResposne = [];
            var objRequest = req.body;
            var ss_id = 0;
            var roleType = objRequest["role_type"];
            if (objRequest["Category"] !== "") {
                objCategory = objRequest["Category"].split(',');
            }
            ss_id = objRequest["ss_id"] - 0;
            var Condition = [];
            var fromDate = new Date();
            fromDate.setHours(0, 0, 0, 0);

            var toDate = new Date();
            toDate.setHours(23, 59, 59, 999);

            var today = moment().utcOffset("+05:30").startOf('Day');

            var fromDate = moment(today).format("YYYY-MM-D");
            var toDate = moment(today).format("YYYY-MM-D");

            var arrFrom = fromDate.split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);

            var arrTo = toDate.split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);

            // console.log('DateRange', 'from', dateFrom, 'to', dateTo);
            if (roleType === "tickets") {
                Condition = {"ss_id": ss_id,
                    "Created_On": {$gte: dateFrom, $lt: dateTo}
                };
            } else {
                Condition = {"Category": {$in: objCategory},
                    "Created_On": {$gte: dateFrom, $lt: dateTo}
                };
            }
            var agg = [
                // Group by the grouping key, but keep the valid values
                {"$group": {
                        "_id": "$Ticket_Id",
                        "docId": {"$last": "$_id"},
                        "Ticket_Id": {"$last": "$Ticket_Id"},
                        "Category": {"$last": "$Category"},
                        "SubCategory": {"$last": "$SubCategory"},
                        "From": {"$last": "$From"},
                        "To": {"$last": "$To"},
                        "Status": {"$last": "$Status"},
                        "Created_By": {"$last": "Created_By"},
                        "Created_On": {"$last": "$Created_On"},
                        "Modified_On": {"$last": "$Modified_On"},
                        "CRN": {"$last": "$CRN"},
                        "Mobile_No": {"$last": "$Mobile_No"},
                        "Vehicle_No": {"$last": "$Vehicle_No"},
                        "Remark": {"$last": "$Remark"},
                        "ss_id": {"$last": "$ss_id"},
                        "SubCategory_level2": {"$last": "$SubCategory_level2"},
                        "Product": {"$last": "$Product"}
                    }},
//            {"$match": {$or: [
//                        {"Category": {$in: objCategory},
//                            "Created_On": {$gte: dateFrom, $lt: dateTo}
//                        }, {"ss_id": ss_id}]
//                }
//            },
                {"$match": Condition
                },
                // Then sort
                {"$sort": {"Modified_On": -1}}

            ];
            console.log(Condition);

            var tickets = require('../models/ticket');
            tickets.aggregate(agg, function (err, dbTicket) {
                if (err) {
                    res.send(err);
                    console.error(err);
                } else {
                    console.log(dbTicket);
                    for (var i in dbTicket) {
                        var productname = "";
                        if (dbTicket[i]["Product"] === 1) {
                            productname = "CAR";
                        } else if (dbTicket[i]["Product"] === 10) {
                            productname = "BIKE";
                        } else if (dbTicket[i]["Product"] === 2) {
                            productname = "HEALTH";
                        }

                        var Action_name = "";
                        if (objRequest["Category"] === "") {
                            Action_name = "Action";
                        } else {
                            if (dbTicket[i]["Status"] === "Open" && objRequest["role_type"] !== "tickets") {
                                Action_name = "Start";
                            } else {
                                Action_name = "Action";
                            }
                        }

                        var Obj = {
                            "Ticket_Id": dbTicket[i]['Ticket_Id'],
                            "Product": productname,
                            "Category": dbTicket[i]['Category'],
                            "SubCategory": dbTicket[i]['SubCategory'],
                            "Status": dbTicket[i]['Status'],
                            "Created_By": dbTicket[i]['Created_By'],
                            "From": dbTicket[i]['From'],
                            "Mobile_No": dbTicket[i]['Mobile_No'],
                            "Vehicle_No": dbTicket[i]['Vehicle_No'],
                            "Remark": dbTicket[i]['Remark'],
                            "CRN": dbTicket[i]['CRN'],
                            "Created_On_UI": moment(dbTicket[i]['Created_On']).format("DD/MM/YYYY"),
                            "Created_On": dbTicket[i]['Created_On'],
                            "SubCategory_level2": dbTicket[i]['SubCategory_level2'],
                            "ss_id": dbTicket[i]['ss_id'],
                            "Action_name": Action_name

                        };
                        ObjResposne.push(Obj);
                    }
                    res.json(ObjResposne);
                }
            });
            //  });
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });

    app.post('/tickets/get_ReportedticketsList', function (req, res) {

        try {

            var objCategory = [];
            var ObjResposne = [];
            var objRequest = req.body;
            var ss_id = 0;
            if (objRequest["Category"] !== "") {
                objCategory = objRequest["Category"].split(',');
            }
            ss_id = objRequest["ss_id"] - 0;
            //var category = req.params["Category"].toString();

            var Condition = [];
            var fromDate = new Date();
            fromDate.setHours(0, 0, 0, 0);

            var toDate = new Date();
            toDate.setHours(23, 59, 59, 999);

            var today = moment().utcOffset("+05:30").startOf('Day');

            var fromDate = moment(today).format("YYYY-MM-D");
            var toDate = moment(today).format("YYYY-MM-D");

            var arrFrom = fromDate.split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);

            var arrTo = toDate.split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);

            console.log('DateRange', 'from', dateFrom, 'to', dateTo);

            Condition = {"ss_id": ss_id,
                "Created_On": {$gte: dateFrom, $lt: dateTo}
            };

            var agg = [
                // Group by the grouping key, but keep the valid values
                {"$group": {
                        "_id": "$Ticket_Id",
                        "docId": {"$last": "$_id"},
                        "Ticket_Id": {"$last": "$Ticket_Id"},
                        "Category": {"$last": "$Category"},
                        "SubCategory": {"$last": "$SubCategory"},
                        "From": {"$last": "$From"},
                        "To": {"$last": "$To"},
                        "Status": {"$last": "$Status"},
                        "Created_By": {"$last": "Created_By"},
                        "Created_On": {"$last": "$Created_On"},
                        "Modified_On": {"$last": "$Modified_On"},
                        "CRN": {"$last": "$CRN"},
                        "Mobile_No": {"$last": "$Mobile_No"},
                        "Vehicle_No": {"$last": "$Vehicle_No"},
                        "Remark": {"$last": "$Remark"},
                        "ss_id": {"$last": "$ss_id"},
                        "SubCategory_level2": {"$last": "$SubCategory_level2"},
                        "Product": {"$last": "$Product"}
                    }},
//            {"$match": {$or: [
//                        {"Category": {$in: objCategory},
//                            "Created_On": {$gte: dateFrom, $lt: dateTo}
//                        }, {"ss_id": ss_id}]
//                }
//            },
                {"$match": {Condition}
                },
                // Then sort
                {"$sort": {"Modified_On": -1}}

            ];
            // console.log(Condition);

            var tickets = require('../models/ticket');
            tickets.aggregate(agg, function (err, dbTicket) {
                if (err) {
                    res.send(err);
                    console.error(err);
                } else {
                    console.log(dbTicket);
                    for (var i in dbTicket) {
                        var productname = "";
                        if (dbTicket[i]["Product"] === 1) {
                            productname = "CAR";
                        } else if (dbTicket[i]["Product"] === 10) {
                            productname = "BIKE";
                        } else if (dbTicket[i]["Product"] === 2) {
                            productname = "HEALTH";
                        }
                        var Obj = {
                            "Ticket_Id": dbTicket[i]['Ticket_Id'],
                            "Product": productname,
                            "Category": dbTicket[i]['Category'],
                            "SubCategory": dbTicket[i]['SubCategory'],
                            "Status": dbTicket[i]['Status'],
                            "Created_By": dbTicket[i]['Created_By'],
                            "From": dbTicket[i]['From'],
                            "Mobile_No": dbTicket[i]['Mobile_No'],
                            "Vehicle_No": dbTicket[i]['Vehicle_No'],
                            "Remark": dbTicket[i]['Remark'],
                            "CRN": dbTicket[i]['CRN'],
                            "Created_On_UI": moment(dbTicket[i]['Created_On']).format("DD/MM/YYYY"),
                            "Created_On": dbTicket[i]['Created_On'],
                            "SubCategory_level2": dbTicket[i]['SubCategory_level2'],
                            "ss_id": dbTicket[i]['ss_id']
                        };
                        ObjResposne.push(Obj);
                    }
                    res.json(ObjResposne);
                }

            });

            //  });
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });


    app.get('/tickets/getticket/:Ticket_Id',validateSession, function (req, res) {
        try {
            var Ticket_id = req.params['Ticket_Id'];
            var Condition = [];
            var sort = {};
            var ObjResposne = [];
            Condition = {"Ticket_Id": Ticket_id};
            sort = {"Modified_On": -1};

            console.log(Condition);

            //MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            var tickets = require('../models/ticket');

            tickets.find(Condition).sort(sort).exec(function (err, dbtickets) {
                //tickets.find({"Ticket_Id": Ticket_id}).sort({"Modified_On": -1}).exec(function (err, dbtickets) {
                //tickets.find({"Ticket_Id": Ticket_id},{}, function (err, dbtickets) {
                if (err) {
                    res.send(err);
                } else {
                    console.log(dbtickets.length);
                    //var dbtickets = dbtickets[0]._doc;
                    var objFile = [];
                    for (var i in dbtickets) {
                        var dbtickets1 = dbtickets[i]._doc;
                        var productname = "";
                        if (dbtickets1["Product"] === 1) {
                            productname = "CAR";
                        } else if (dbtickets1["Product"] === 10) {
                            productname = "BIKE";
                        } else if (dbtickets1["Product"] === 2) {
                            productname = "HEALTH";
                        }
                        var Obj = {
                            "Ticket_Id": dbtickets1['Ticket_Id'],
                            "Product": productname,
                            "Category": dbtickets1['Category'],
                            "SubCategory": dbtickets1['SubCategory'],
                            "Status": dbtickets1['Status'],
                            "Created_By": dbtickets1['Created_By'],
                            "From": dbtickets1['From'],
                            "To": dbtickets1['To'],
                            "Mobile_No": dbtickets1['Mobile_No'],
                            "Vehicle_No": dbtickets1['Vehicle_No'],
                            "Remark": dbtickets1['Remark'],
                            "CRN": dbtickets1['CRN'],
                            "Created_On_UI": moment(dbtickets1['Created_On']).format("DD/MM/YYYY"),
                            "Created_On": dbtickets1['Created_On'],
                            "Modified_On_UI": moment(dbtickets1['Modified_On']).format("DD/MM/YYYY"),
                            "Modified_On": dbtickets1['Modified_On'],
                            "ss_id": dbtickets1['ss_id'],
                            "Pincode": dbtickets1['Pincode']

                        };
                        if (i === "0") {
                            ObjResposne.push(Obj);
                        }
                        for (var j in dbtickets1['UploadFiles']) {
                            if (dbtickets1['UploadFiles'][j] !== null && j !== "file_count") {
                                objFile.push(dbtickets1['UploadFiles'][j]);
                            }
                        }

                    }
                    ObjResposne[0]["UploadFiles"] = objFile;
                    res.json(ObjResposne);

                }
            });
            //});

        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });

    app.get('/tickets/getticket_history/:Ticket_Id', function (req, res) {
        try {
            var Ticket_id = req.params['Ticket_Id'];
            var Condition = [];
            var sort = {};
            var ObjResposne = [];
            Condition = {"Ticket_Id": Ticket_id};
            sort = {"Modified_On": -1};

            console.log(Condition);

            //MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            var tickets = require('../models/ticket');

            // tickets.find(Condition).sort(sort).limit(1).exec(function (err, dbCategory) {
            tickets.find({"Ticket_Id": Ticket_id}).sort({"Modified_On": -1}).exec(function (err, dbtickets) {
                //tickets.find({"Ticket_Id": Ticket_id},{}, function (err, dbtickets) {
                if (err) {
                    res.send(err);
                } else {
                    console.log(dbtickets.length);
                    //var dbtickets = dbtickets[0]._doc;
                    for (var i in dbtickets) {
                        var dbtickets1 = dbtickets[i]._doc;
                        //for (var i in dbCategory) {
                        var productname = "";
                        //var Create
                        if (dbtickets1["Product"] === 1) {
                            productname = "CAR";
                        } else if (dbtickets1["Product"] === 10) {
                            productname = "BIKE";
                        } else if (dbtickets1["Product"] === 2) {
                            productname = "HEALTH";
                        }
                        var Obj = {
//                            "Ticket_Id": dbtickets1['Ticket_Id'],
//                            "Product": productname,
//                            "Category": dbtickets1['Category'],
//                            "SubCategory": dbtickets1['SubCategory'],
                            "Status": dbtickets1['Status'],
//                            "Created_By": dbtickets1['Created_By'],
                            "From": dbtickets1['From'],
                            "To": dbtickets1['To'],
//                            "Mobile_No": dbtickets1['Mobile_No'],
//                            "Vehicle_No": dbtickets1['Vehicle_No'],
                            "Remark": dbtickets1['Remark'],
//                            "CRN": dbtickets1['CRN'],
//                            "Created_On_UI": moment(dbtickets1['Created_On']).format("DD/MM/YYYY"),
//                            "Created_On": dbtickets1['Created_On'],
//                            "Modified_On_UI": moment(dbtickets1['Modified_On']).format("DD/MM/YYYY"),
                            "Modified_On": dbtickets1['Modified_On'],
                            "Modified_By_Name": dbtickets1['Modified_By_Name']
//                            "ss_id": dbtickets1['ss_id'],
//                            "UploadFiles" : dbtickets1['UploadFiles']
                        };
                        ObjResposne.push(Obj);
                    }
                    res.json(ObjResposne);

                }
            });
            //});

        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });

    app.get('/tickets/CheckTickitingCategory/:UDID', function (req, res) {
        try {
            var UDID = req.params["UDID"];
            UDID = new RegExp(UDID, 'i');
            var Condition = {$or: [
                    {$or: [{"Level_1": UDID}]},
                    {$or: [{"Level_2": UDID}]},
                    {$or: [{"Level_3": UDID}]}
                ]};
            var obj = [];
            var dbticketing_category = myDb.collection('ticketing_category');
            dbticketing_category.find({"Level_1": UDID}).toArray(function (err, dbCategory) {
                //  db.collection('ticketing_category').find(Condition).exec(function (err, dbCategory) {
                if (err) {
                    res.send(err);
                } else {
                    console.log(dbCategory);
                    for (var i in dbCategory) {
                        // obj.push(dbCategory[i]['Category_Id'] + ':' + dbCategory[i]['Category']);
                        obj.push(dbCategory[i]['Category']);
                    }
                    res.json(obj);
                }
            });
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });

    app.post('/tickets/getticketList', LoadSession, function (req, res) {
        try
        {

            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);

            var optionPaginate = {
                select: 'Ticket_code channel subchannel Category SubCategory Product CRN Status From Created_By Created_On Modified_On Agent_Email_Id Remark Source Insurer_Id',
                sort: {'Modified_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };

            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }

            let objRequest = req.body;
            let filter = obj_pagination.filter;

            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
            } else if([118288, 12756, 17026, 8054, 7960, 125929, 127258, 8067].indexOf(req.obj_session.user.ss_id) > -1){
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                let arr_ch_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                }
                arr_ch_ssid.push(req.obj_session.user.ss_id);
                channel = req.obj_session.user.role_detail.channel;
                filter['$or'] = [
                    {'channel': channel},
                    {'ss_id': {$in: arr_ch_ssid}}
                ];
            } else {
                if ([7814].indexOf(req.obj_session.user.ss_id) > -1 && objRequest["role_type"] === "mytickets") {

                } else {
                    let arr_ssid = [];
                    if (req.obj_session.hasOwnProperty('users_assigned')) {
                        var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                        arr_ssid = combine_arr.split(',').filter(Number).map(Number);

                    }
                    arr_ssid.push(req.obj_session.user.ss_id);
                    //filter['ss_id'] = {$in: arr_ssid};
                    filter['$or'] = [
                        {'lead_assigned_ssid': {$in: arr_ssid}},
                        {'ss_id': {$in: arr_ssid}}
                    ];
                }
            }






            let objResponse = [];
            let mysort = "";
            let roleType = objRequest["role_type"];
            if (objRequest["Category"] !== "") {
                objCategory = objRequest["Category"].split(',');
            }
            ss_id = objRequest["ss_id"] - 0;

            var today = moment().utcOffset("+05:30").startOf('Day');
            var fromDate = moment(objRequest["from_date"] === "" ? today : objRequest["from_date"]).format("YYYY-MM-D");
            var toDate = moment(objRequest["to_date"] === "" ? today : objRequest["to_date"]).format("YYYY-MM-D");

            var arrFrom = fromDate.split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);

            var arrTo = toDate.split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);

            console.log('DateRange', 'from', dateFrom, 'to', dateTo);

            if (objRequest["search_by"] !== "CurrentDate") {
                if (objRequest["search_by"] === "ticketid") {
                    //filter["Ticket_Id"] = objRequest["search_byvalue"];
                    filter["Ticket_code"] = new RegExp(objRequest["search_byvalue"], 'i');
                } else if (objRequest["search_by"] === "CRN") {
                    //filter["CRN"] = parseInt(objRequest["search_byvalue"]);
                    filter = {"$or": [{"CRN": (objRequest["search_byvalue"]).toString()}, {"CRN": parseInt(objRequest["search_byvalue"])}]};
                } else if (objRequest["search_by"] === "Source") {
                filter["Source"] = new RegExp(objRequest["search_byvalue"], 'i');
                if(objRequest["search_byvalue"].includes('auto')){
                    filter["Status"] = "Open";
                }
            }else if (objRequest["search_by"] === "Category") {
                filter["Category"] = new RegExp(objRequest["search_byvalue"], 'i');
            }else if (objRequest["search_by"] === "Insurer_Name") {
                filter = {"Insurer_Id":objRequest["search_byvalue"]};
            }else {
                    if (roleType === "tickets") {
                        /* filter = {"ss_id": ss_id,
                         "Created_On": {$gte: dateFrom, $lt: dateTo}
                         };*/
//                        filter["Created_On"] = {$gte: dateFrom, $lt: dateTo};
                    } else {
                        /* filter = {"Category": {$in: objCategory},
                         "Modified_On": {$gte: dateFrom, $lt: dateTo}
                         };*/
                        filter["Category"] = {$in: objCategory};
//                        filter["Modified_On"] = {$gte: dateFrom, $lt: dateTo};
                    }
                    if (objRequest["status"] !== "") {
                        filter["Status"] = objRequest["status"];
                    }
                }
                mysort = {Modified_On: -1};
            } else {
                if (roleType === "tickets") {
                    /* filter = {"ss_id": ss_id,
                     "Created_On": {$gte: dateFrom, $lt: dateTo}
                     };*/
                    filter["Created_On"] = {$gte: dateFrom, $lt: dateTo};
                } else {
                    /*filter = {"Category": {$in: objCategory},
                     "Modified_On": {$gte: dateFrom, $lt: dateTo}
                     };*/
                    filter["Category"] = {$in: objCategory};
                    filter["Modified_On"] = {$gte: dateFrom, $lt: dateTo};
                }
                if (objRequest["status"] !== "") {
                    filter["Status"] = objRequest["status"];
                }
            }
            console.log(filter);
            var user_details = require('../models/user_details');
            user_details.paginate(filter, optionPaginate).then(function (dbTicket) {
                res.json(dbTicket);
            });

        } catch (err) {
            console.log(err.stack);
            return res.send({'msg': 'error'});
        }
    });

    app.post('/tickets/search', function (req, res) {
        try
        {
            var objRequest = req.body;
            var objResponse = [];
            var mysort = "";
            var roleType = objRequest["role_type"];
            if (objRequest["Category"] !== "" && objRequest["Category"] !== undefined) {
                objCategory = objRequest["Category"].split(',');
            }
            ss_id = objRequest["ss_id"] - 0;

            var Condition = {};
            var today = moment().utcOffset("+05:30").startOf('Day');
            var fromDate = moment(objRequest["from_date"] === "" ? today : objRequest["from_date"]).format("YYYY-MM-D");
            var toDate = moment(objRequest["to_date"] === "" ? today : objRequest["to_date"]).format("YYYY-MM-D");

            var arrFrom = fromDate.split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);

            var arrTo = toDate.split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);

            console.log('DateRange', 'from', dateFrom, 'to', dateTo);

            if (objRequest["search_by"] !== "CurrentDate") {
                if (objRequest["search_by"] === "ticketid") {
                    //Condition["Ticket_Id"] = objRequest["search_byvalue"];
                    Condition["Ticket_Id"] = new RegExp(objRequest["search_byvalue"], 'i');
                } else if (objRequest["search_by"] === "CRN") {
//                    Condition["CRN"] = parseInt(objRequest["search_byvalue"]);
                    Condition = {"$or": [{"CRN": (objRequest["search_byvalue"]).toString()}, {"CRN": parseInt(objRequest["search_byvalue"])}]};
                } else {
                    if (roleType === "tickets") {
                        Condition = {"ss_id": ss_id,
                            "Created_On": {$gte: dateFrom, $lt: dateTo}
                        };
                    } else {
                        Condition = {"Category": {$in: objCategory},
                            "Modified_On": {$gte: dateFrom, $lt: dateTo}
                        };
                    }
                    if (objRequest["status"] !== "") {
                        Condition["Status"] = objRequest["status"];
                    }
                }
                mysort = {Modified_On: -1};
            } else {
                if (roleType === "tickets") {
                    Condition = {"ss_id": ss_id,
                        "Created_On": {$gte: dateFrom, $lt: dateTo}
                    };
                } else {
                    Condition = {"Category": {$in: objCategory},
                        "Modified_On": {$gte: dateFrom, $lt: dateTo}
                    };
                }
                if (objRequest["status"] !== "") {
                    Condition["Status"] = objRequest["status"];
                }
            }
            console.log(Condition);
            var agg = [
                // Group by the grouping key, but keep the valid values
                {"$group": {
                        "_id": "$Ticket_Id",
                        "docId": {"$last": "$_id"},
                        "Ticket_Id": {"$last": "$Ticket_Id"},
                        "Category": {"$last": "$Category"},
                        "SubCategory": {"$last": "$SubCategory"},
                        "channel": {"$last": "$channel"},
                        "subchannel": {"$last": "$subchannel"},
                        "From": {"$last": "$From"},
                        "To": {"$last": "$To"},
                        "Status": {"$last": "$Status"},
                        "Created_By": {"$last": "Created_By"},
                        "Created_On": {"$last": "$Created_On"},
                        "Modified_On": {"$last": "$Modified_On"},
                        "CRN": {"$last": "$CRN"},
                        "Mobile_No": {"$last": "$Mobile_No"},
                        "Vehicle_No": {"$last": "$Vehicle_No"},
                        "Remark": {"$last": "$Remark"},
                        "ss_id": {"$last": "$ss_id"},
                        "SubCategory_level2": {"$last": "$SubCategory_level2"},
                        "Product": {"$last": "$Product"},
                        "UploadFiles": {"$last": "$UploadFiles"},
                        "Agent_Email_Id": {"$last": "$Agent_Email_Id"}
                    }},
                {"$match": Condition},
                // Then sort
                {"$sort": {"Modified_On": -1}}
            ];

            var tickets = require('../models/ticket');
            tickets.aggregate(agg, function (err, dbTicket) {
                if (err) {
                    throw err;
                } else {
                    console.log(dbTicket);
                    for (var i in dbTicket) {
                        var productname = "";
                        // var Create;
                        if (dbTicket[i]["Product"] === 1) {
                            productname = "CAR";
                        } else if (dbTicket[i]["Product"] === 10) {
                            productname = "BIKE";
                        } else if (dbTicket[i]["Product"] === 2) {
                            productname = "HEALTH";
                        }
                        var Action_name = "";
                        if (objRequest["Category"] === "") {
                            Action_name = "Action";
                        } else {
                            if (dbTicket[i]["Status"] === "Open" && objRequest["role_type"] !== "tickets") {
                                Action_name = "Start";
                            } else {
                                Action_name = "Action";
                            }
                        }

                        var Obj = {
                            "Ticket_Id": dbTicket[i]['Ticket_Id'],
                            "Product": productname,
                            "Category": dbTicket[i]['Category'],
                            "SubCategory": dbTicket[i]['SubCategory'],
                            "channel": dbTicket[i]['channel'],
                            "subchannel": dbTicket[i]['subchannel'],
                            "Status": dbTicket[i]['Status'],
                            "Created_By": dbTicket[i]['Created_By'],
                            "From": dbTicket[i]['From'],
                            "Mobile_No": dbTicket[i]['Mobile_No'],
                            "Vehicle_No": dbTicket[i]['Vehicle_No'],
                            "Remark": dbTicket[i]['Remark'],
                            "CRN": dbTicket[i]['CRN'],
                            "Created_On_UI": moment(dbTicket[i]['Created_On']).format("DD/MM/YYYY"),
                            "Created_On": dbTicket[i]['Created_On'],
                            "SubCategory_level2": dbTicket[i]['SubCategory_level2'],
                            "ss_id": dbTicket[i]['ss_id'],
                            "Action_name": Action_name,
                            "Modified_On_UI": moment(dbTicket[i]['Modified_On']).format("DD/MM/YYYY"),
                            "Modified_On": dbTicket[i]['Modified_On'],
                            "UploadFiles": dbTicket[i]['UploadFiles'],
                            "Agent_Email_Id": dbTicket[i]['Agent_Email_Id'],
                            "Ageing": dbTicket[i]['Status'] === "Resolved" ? parseInt((dbTicket[i]['Modified_On'] - dbTicket[i]['Created_On']) / (1000 * 60 * 60 * 24)) : "",
                            "Close_Date": dbTicket[i]['Status'] === "Resolved" ? moment(dbTicket[i]['Modified_On']).format("DD/MM/YYYY") : ""
                        };
                        objResponse.push(Obj);
                    }
                    res.json(objResponse);
                }
            });
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });
    app.post('/admin_raiseticket', LoadSession1, function (req, res, next) {
        try {
            var product_id = 0;
            var fields = req.fields;
            var files = req.files;
            var objRequest;
            objRequest = fields;
            let ticket_remark = objRequest["txt_remark"];
            objRequest["txt_remark"] = htmlEscape(ticket_remark);
            var Ticket_id = objRequest["Ticket_Id"];
            if (objRequest["Product"] === "CAR") {
                product_id = 1;
            } else if (objRequest["Product"] === "BIKE") {
                product_id = 10;
            } else if (objRequest["Product"] === "HEALTH") {
                product_id = 2;
            } else if (objRequest["Product"] === "CV") {
                product_id = 12;
            } else if (objRequest["Product"] === "TRAVEL") {
                product_id = 4;
            }

            //console.log(file_obj);
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                if (err)
                    throw err;
                var autoIncrement = require("mongodb-autoincrement");
                autoIncrement.getNextSequence(db, 'tickets', function (err1, autoIndex) {
                    if (err1) {
                        throw err1;
                    } else {
                        var tickets = db.collection('tickets');
                        var todayDate = new Date();
                        var isticket_created;
                        var NewTicket_Id;
                        var offical_email_id;
                        if (req.obj_session.user.hasOwnProperty('profile') && req.obj_session.user.profile.hasOwnProperty('Official_Email') && req.obj_session.user.profile.Official_Email) {
                            offical_email_id = req.obj_session.user.profile.Official_Email;
                        } else {
                            offical_email_id = req.obj_session.user.email;
                        }
                        tickets.find({"$or": [{"CRN": (objRequest.CRN).toString()}, {"CRN": parseInt(objRequest.CRN)}], "Category": objRequest.Category}).toArray(function (err, crn_cat_exist) {
                            if (err) {
                                throw err;
                            } else {
                                if ((crn_cat_exist.length === 0 && objRequest.CRN !== "") || ((crn_cat_exist.length > 0 || crn_cat_exist.length === 0) && objRequest.CRN === "")) {
                                    if (Ticket_id === "") {
                                        //create new ticket id.
                                        NewTicket_Id = objRequest["Product"].substring(0, 2).toString().toUpperCase() + objRequest["Category_Name"].substring(0, 2).toString().toUpperCase() + autoIndex;
                                        isticket_created = 1;
                                    } else {
                                        NewTicket_Id = Ticket_id;
                                        isticket_created = 0;
                                    }
                                    // console.error("ticketingAdmin1");
                                    //console.error(req.obj_session);
                                    //console.error( objRequest["insurer_id"] !== "" ? parseInt(objRequest["insurer_id"]) : "");
                                    tickets.findOne({"Ticket_Id": Ticket_id}, {sort: {"Modified_On": -1}}, function (err, dbticket) {
                                        //console.log(dbticket);
                                        var arg = {};
                                        arg = {
                                            Ticket_Id: dbticket !== null ? dbticket['Ticket_Id'] : NewTicket_Id,
                                            Product: dbticket !== null ? dbticket['Product'] : product_id,
                                            Category: dbticket !== null ? dbticket["Category"] : objRequest["Category_Name"],
                                            SubCategory: dbticket !== null ? dbticket["SubCategory"] : objRequest["SubCategory"],
                                            From: dbticket !== null ? dbticket["From"] : req.obj_session.user.fullname + "(" + req.obj_session.user.uid + ")",
                                            To: dbticket !== null ? dbticket["To"] : req.obj_session.user.fullname + "(" + req.obj_session.user.uid + ")",
                                            Status: objRequest["Status"] === "0" ? dbticket["Status"] : objRequest["Status"],
                                            Created_By: dbticket !== null ? dbticket["Created_By"] : req.obj_session.user.fullname,
                                            Modified_By: req.obj_session.user.ss_id,
                                            Created_On: dbticket !== null ? dbticket["Created_On"] : todayDate,
                                            Modified_On: todayDate,
                                            CRN: dbticket !== null ? dbticket["CRN"] : objRequest["CRN"] - 0,
                                            Mobile_No: dbticket !== null ? dbticket["Mobile_No"] : objRequest["Mobile_No"],
                                            Vehicle_No: dbticket !== null ? dbticket["Vehicle_No"] : objRequest["Vehicle_No"],
                                            Remark: objRequest["txt_remark"],
                                            ss_id: req.obj_session.user.ss_id,
                                            CRN_owner: dbticket !== null ? dbticket["CRN_owner"] : objRequest["CRN_owner"],
                                            IsActive: 1,
                                            fba_id: req.obj_session.user.fba_id,
                                            CRN_fba_id: dbticket !== null ? dbticket["CRN_fba_id"] : objRequest["CRN_fba_id"],
                                            channel: dbticket !== null ? dbticket["channel"] : objRequest["channel"],
                                            subchannel: dbticket !== null ? dbticket["subchannel"] : objRequest["subchannel"],
                                            //UploadFiles: dbticket !== null ? dbticket["UploadFiles"] : "",
                                            Modified_By_Name: req.obj_session.user.fullname,
                                            Ticket_Code: dbticket !== null ? dbticket['Ticket_Id'] : NewTicket_Id,
                                            Agent_Email_Id: dbticket !== null ? dbticket['Agent_Email_Id'] : offical_email_id,
                                            Transaction_On: dbticket !== null ? dbticket["Transaction_On"] : objRequest["Transaction_On"],
                                            Source: objRequest["Source"],
                                            RM_Email_Id: objRequest["rm_email_id"],
                                            RM_Agent_Name: dbticket !== null ? dbticket["RM_Agent_Name"] : objRequest["rm_agent_name"],
                                            Insurer_Id: objRequest["insurer_id"] !== "" ? parseInt(objRequest["insurer_id"]) : ""
                                        };

                                        tickets.insertOne(arg, function (err, res1) {
                                            if (err)
                                                throw err;
                                            if (res1["insertedCount"] > 0) {
                                                //user_details

                                                var user_details = db.collection('user_details');
                                                if (dbticket === null) {
                                                    autoIncrement.getNextSequence(db, 'user_details', function (err1, autoIndex) {
                                                        var arg = {
                                                            Ticket_Id: autoIndex,
                                                            Ticket_code: NewTicket_Id,
                                                            Product: product_id,
                                                            Category: objRequest["Category_Name"],
                                                            SubCategory: objRequest["SubCategory"],
                                                            From: req.obj_session.user.fullname + "(" + req.obj_session.user.uid + ")",
                                                            To: req.obj_session.user.fullname + "(" + req.obj_session.user.uid + ")",
                                                            Status: objRequest["Status"],
                                                            Created_By: req.obj_session.user.fullname,
                                                            Created_On: todayDate,
                                                            Modified_By: req.obj_session.user.ss_id,
                                                            Modified_On: todayDate,
                                                            CRN: objRequest["CRN"] - 0,
                                                            Mobile_No: objRequest["Mobile_No"],
                                                            Vehicle_No: objRequest["Vehicle_No"],
                                                            Remark: objRequest["txt_remark"],
                                                            ss_id: req.obj_session.user.ss_id,
                                                            CRN_owner: objRequest["CRN_owner"],
                                                            fba_id: req.obj_session.user.fba_id,
                                                            CRN_fba_id: objRequest["CRN_fba_id"],
                                                            channel: objRequest["channel"],
                                                            subchannel: objRequest["subchannel"],
                                                            Agent_Email_Id: offical_email_id,
                                                            Transaction_On: objRequest["Transaction_On"],
                                                            Source: objRequest["Source"],
                                                            RM_Email_Id: objRequest["rm_email_id"],
                                                            RM_Agent_Name: objRequest["rm_agent_name"] !== "" ? objRequest["rm_agent_name"] : "",
                                                            Insurer_Id: objRequest["insurer_id"] !== "" ? parseInt(objRequest["insurer_id"]) : ""
                                                        };
                                                        user_details.insert(arg, function (err, res1) {
                                                            if (err) {
                                                                throw err;
                                                            } else {
                                                                console.log('user_detailsInsert', err, res1);
                                                                //                                                            res.json({'Status': 'Inserted'});
                                                            }
                                                        });
                                                    });
                                                } else {
                                                    var objticket = {
                                                        "Modified_By": objRequest["Modified_By"] - 0,
                                                        "Status": dbticket['Status'],
                                                        "Modified_On": todayDate,
                                                        "Remark": objRequest["txt_remark"]
                                                    };
                                                    user_details.update({'Ticket_code': Ticket_id}, {$set: objticket}, function (err, numAffected) {
                                                        console.log('user_detailsUpdate', err, numAffected);
                                                        //                                                    res.json({'Status': 'Updated'});
                                                    });
                                                }

                                                //Upload documnent
                                                var objfile = {
                                                    "file_1": null,
                                                    "file_2": null,
                                                    "file_3": null,
                                                    "file_4": null};
                                                var objdata = {'UploadFiles': objfile};
                                                if (files !== null) {
                                                    if (!fs.existsSync(appRoot + "/tmp/ticketing/" + NewTicket_Id)) {
                                                        fs.mkdirSync(appRoot + "/tmp/ticketing/" + NewTicket_Id);
                                                    }

                                                    var pdf_file_name = "";

                                                    for (var i in files) {
                                                        var doc_prefix = objRequest["doc_prefix"] !== "" ? objRequest["doc_prefix"] + "_" : "";
                                                        pdf_file_name = i + "." + files[i].name.split('.')[files[i].name.split('.').length - 1];
                                                        var pdf_sys_loc_horizon = appRoot + "/tmp/ticketing/" + NewTicket_Id + "/" + doc_prefix + req.obj_session.user.ss_id + "_" + pdf_file_name;
                                                        var pdf_web_path_horizon = config.environment.downloadurl + "/ticketing/" + NewTicket_Id + "/" + doc_prefix + req.obj_session.user.ss_id + "_" + pdf_file_name;
                                                        objdata.UploadFiles[i] = pdf_web_path_horizon;
                                                        var oldpath = files[i].path;
                                                        fs.readFile(oldpath, function (err, data) {
                                                            if (err)
                                                            {
                                                                console.error('Read', err);
                                                            }
                                                            console.log('File read!');

                                                            // Write the file
                                                            fs.writeFile(pdf_sys_loc_horizon, data, function (err) {
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
                                                    tickets.update({'Ticket_Id': NewTicket_Id}, {$set: objdata}, function (err, numAffected) {
                                                        console.log('TicketUpdated', err, numAffected);
                                                        if (err) {
                                                            objdata['Msg'] = err;
                                                        } else {
                                                            objdata['Msg'] = numAffected;
                                                        }
                                                    });
                                                }

                                                var product_name;
                                                if (product_id === 1) {
                                                    product_name = "CAR";
                                                } else if (product_id === 10) {
                                                    product_name = "BIKE";
                                                } else if (product_id === 2) {
                                                    product_name = "HEALTH";
                                                } else if (product_id === 12) {
                                                    product_name = "CV";
                                                } else if (product_id === 4) {
                                                    product_name = "TRAVEL";
                                                }

                                                var Insurer_Name = objRequest["insurer_id"] !== "" ? const_arr_insurer["Insurer_" + objRequest["insurer_id"]] : "";

                                                var Email = require('../models/email');
                                                var objModelEmail = new Email();
                                                var environment = config.environment.name === 'Production' ? "" : "QA-";
                                                var cc = "";

                                                var to = "";
                                                var Insurer_Name = objRequest["insurer_id"] !== "" ? const_arr_insurer["Insurer_" + objRequest["insurer_id"]] : "";
                                                if (offical_email_id !== null || offical_email_id !== undefined) {
                                                    to = offical_email_id;
                                                }
                                                if (emailtocc.hasOwnProperty(objRequest["Category_Name"])) {
//                                                    if (objRequest["Category_Name"] === "Product Input Page") {
//                                                        if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"] !== "")
//                                                        {
//                                                            to += "," + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"];
//                                                        }
//                                                        if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"] !== "")
//                                                        {
//                                                            cc += objRequest["rm_email_id"] !== "" ? "," + objRequest["rm_email_id"] : '' + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"];
//                                                        }
//                                                    } else {

                                                    if (emailtocc[objRequest["Category_Name"]][0]["to"] !== "")
                                                    {
                                                        to += "," + emailtocc[objRequest["Category_Name"]][0]["to"];
                                                    }
                                                    if (emailtocc[objRequest["Category_Name"]][0]["cc"] !== "")
                                                    {
                                                        cc += objRequest["rm_email_id"] !== "" ? "," + objRequest["rm_email_id"] : '' + emailtocc[objRequest["Category_Name"]][0]["cc"];
                                                    }
//                                                    }
                                                }

                                                if (objRequest["CRN"] !== "" && objRequest["CRN"] !== null && objRequest["CRN"] !== undefined) {
                                                    var subject = "[TICKET] " + NewTicket_Id + "-" + objRequest["CRN"] + "  " + environment + " " + product_name + '-' + objRequest["Category_Name"] + '-' + objRequest["SubCategory"];
                                                } else {
                                                    var subject = "[TICKET] " + NewTicket_Id + "  " + environment + " " + product_name + '-' + objRequest["Category_Name"] + '-' + objRequest["SubCategory"];
                                                }
                                                var mail_content = '<html><body>' +
                                                        'Ticket is created.' +
                                                        '<p></p>Ticket No - ' + NewTicket_Id +
                                                        '<p></p>CRN  - ' + objRequest["CRN"] +
                                                        '<p></p>Status  - ' + objRequest["Status"] +
                                                        '<p></p>Product  - ' + product_name +
                                                        '<p></p>Remarks  - ' + objRequest["txt_remark"] +
                                                        '<p></p>You will be notified once ticket is resolved.' +
                                                        '<p></p>You can check ticket status in my ticket section.' +
                                                        '</body></html>';
                                                if (offical_email_id !== null || offical_email_id !== undefined) {
                                                    objModelEmail.send('noreply@policyboss.com', to, subject, mail_content, cc, config.environment.notification_email, objRequest["CRN"]);
                                                }

                                                if (Ticket_id === "") {
                                                    res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is created.', 'Created_On': moment(objRequest["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), "Product_Name": product_name, 'Insurer_Name': Insurer_Name});
                                                } else {
                                                    res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is updated.', 'Created_On': moment(objRequest["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), "Product_Name": product_name, 'Insurer_Name': Insurer_Name});
                                                }

                                            } else {
                                                //console.log(response);
                                            }

                                            ////console.log(res);
                                        });
                                    });
                                } else {
                                    res.json({'Status': "exist", 'Msg': 'Ticket for this CRN under this category is already created'});
                                }
                            }
                        });
                    }
                });
            });

            //res.json({'Status': "Inserted Succefully"});
        } catch (err) {
            console.log(err);
            console.error("catch" + err);
            return res.send(err.stack);
        }
    });
    app.get('/scheduler_history', function (req, res) {
        let startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
        let currentOfMonth = moment().format('YYYY-MM-DD');
        if (currentOfMonth === moment().format('YYYY-MM-01')) {
            startOfMonth = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
            currentOfMonth = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        }
        const startDate = new Date(startOfMonth + "T00:00:00Z");
        const currentDate = new Date(currentOfMonth + "T23:59:59Z");
        var Insurer = require('../models/insurer');
        var insurer_list = {};
        try {
            Insurer.find().select('Insurer_ID Insurer_Name').exec(function (err, insurers) {
                if (err)
                    res.send(err);
                else
                if (insurers.length > 0) {
                    insurer_list = insurers;
                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                        if (err)
                            throw err;
                        var user_details = db.collection('user_details');
                        user_details.find({Created_On: {$gte: startDate, $lte: currentDate}}, {_id: 0}).toArray(function (err, getData) {
                            if (err) {
                                res.send(err);
                            } else {
                                if (getData.length > 0) {
                                    var ff_file_name = startOfMonth + "To" + currentOfMonth + ".xlsx";
                                    var ff_loc_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                                    var ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                                    var wb = new xl.Workbook();
                                    var ws = wb.addWorksheet('Sheet 1');
                                    var styleh = wb.createStyle({
                                        font: {
                                            bold: true,
                                            size: 12
                                        }
                                    });
                                    //row 1
                                    ws.cell(1, 1).string('Ticket_Id').style(styleh);
                                    ws.cell(1, 2).string('Channel').style(styleh);
                                    ws.cell(1, 3).string('SubChannel').style(styleh);
                                    ws.cell(1, 4).string('Category').style(styleh).ws.column(4).setWidth(20);
                                    ws.cell(1, 5).string('SubCategory').style(styleh).ws.column(5).setWidth(30);
                                    ws.cell(1, 6).string('Product').style(styleh);
                                    ws.cell(1, 7).string('CRN').style(styleh);
                                    ws.cell(1, 8).string('Status').style(styleh);
                                    ws.cell(1, 9).string('Created_By').style(styleh).ws.column(9).setWidth(25);
                                    ws.cell(1, 10).string('Created_On').style(styleh).ws.column(10).setWidth(25);
                                    ws.cell(1, 11).string('Modified_On').style(styleh).ws.column(11).setWidth(25);
                                    ws.cell(1, 12).string('Email_Id').style(styleh).ws.column(12).setWidth(30);
                                    ws.cell(1, 13).string('Ageing').style(styleh);
                                    ws.cell(1, 14).string('Close_Date').style(styleh);
                                    ws.cell(1, 15).string('Remark').style(styleh);
                                    ws.cell(1, 16).string('Source').style(styleh);
                                    ws.cell(1, 17).string('Insurer_Name').style(styleh).ws.column(17).setWidth(25);
                                    ws.cell(1, 18).string('Agent_Name').style(styleh).ws.column(18).setWidth(30);
                                    ws.cell(1, 19).string('RM_Name').style(styleh);
                                    for (var i = 0; i < getData.length; i++) {
                                        //row 2
                                        ws.cell(i + 2, 1).string(getData[i]['Ticket_code']);
                                        ws.cell(i + 2, 2).string(getData[i]['channel']);
                                        ws.cell(i + 2, 3).string(getData[i]['subchannel']);
                                        ws.cell(i + 2, 4).string(getData[i]['Category']);
                                        ws.cell(i + 2, 5).string(getData[i]['SubCategory'] !== "" && getData[i]['SubCategory'] !== null && getData[i]['SubCategory'] !== undefined ? getData[i]['SubCategory'] : "");
                                        ws.cell(i + 2, 6).string(getData[i]['Product'].toString());
                                        ws.cell(i + 2, 7).string(getData[i]['CRN'] !== "" && getData[i]['CRN'] !== null ? getData[i]['CRN'].toString() : "");
                                        ws.cell(i + 2, 8).string(getData[i]['Status']);
                                        ws.cell(i + 2, 9).string(getData[i]['Created_By']);
                                        ws.cell(i + 2, 10).string((new Date((getData[i]['Created_On']))).toLocaleString());
                                        ws.cell(i + 2, 11).string((new Date((getData[i]['Modified_On']))).toLocaleString());
                                        ws.cell(i + 2, 12).string(getData[i]['Agent_Email_Id']);
                                        var ageing = parseInt((getData[i]['Modified_On'] - getData[i]['Created_On']) / (1000 * 60 * 60 * 24));
                                        ws.cell(i + 2, 13).string(getData[i]['Status'] === "Resolved" ? ageing.toString() : "");
                                        ws.cell(i + 2, 14).string(getData[i]['Status'] === "Resolved" ? moment(getData[i]['Modified_On']).format("DD/MM/YYYY") : "");
                                        ws.cell(i + 2, 15).string(getData[i]['Remark'] !== "" && getData[i]['Remark'] !== null && getData[i]['Remark'] !== undefined ? getData[i]['Remark'] : "");
                                        ws.cell(i + 2, 16).string(getData[i]['Source']);
                                        if (getData[i].hasOwnProperty('Insurer_Id') && getData[i].Insurer_Id) {
                                            for (var k = 0; k < insurer_list.length; k++) {
                                                if (insurer_list[k]['_doc']['Insurer_ID'] === parseInt(getData[i]['Insurer_Id'])) {
                                                    ws.cell(i + 2, 17).string(insurer_list[k]['_doc']['Insurer_Name']);
                                                }
                                            }
                                        } else {
                                            ws.cell(i + 2, 17).string("");
                                        }
                                        ws.cell(i + 2, 18).string(getData[i]['From'] !== "" && getData[i]['From'] !== undefined && getData[i]['From'] !== null ? getData[i]['From'].toString() : "");
                                        ws.cell(i + 2, 19).string(getData[i]['RM_Agent_Name'] !== "" && getData[i]['RM_Agent_Name'] !== undefined && getData[i]['RM_Agent_Name'] !== null ? getData[i]['RM_Agent_Name'] : "");
                                    }
                                    wb.write(ff_loc_path_portal);
                                    var Email = require('../models/email');
                                    var objModelEmail = new Email();
                                    var sub = 'Ticket File';
                                    email_body = '<html><body><p>Hello,</p><BR/><p>Please find below the URL of Ticket details from <b>' + startOfMonth + " To " + currentOfMonth + '</b></p>'
                                            + '<BR><p>Ticket file URL : ' + ff_web_path_portal + '</p></body></html>';
                                    if (config.environment.name === 'Production') {
//                                    var arrCc = ['ashish.hatia@policyboss.com', 'anuj.singh@policyboss.com'];
//                                    objModelEmail.send('noreply@landmarkinsurance.co.in', config.environment.notification_email, sub, email_body, arrCc.join(','), '', '');
                                        var arrTo = ['susanna.lobo@landmarkinsurance.in'];
                                        var arrCc = ['rohit.rajput@policyboss.com'];
                                        var arrBcc = [config.environment.notification_email];
                                        objModelEmail.send('noreply@landmarkinsurance.co.in', arrTo.join(','), sub, email_body, arrCc.join(','), arrBcc.join(','), '');
                                    } else {
                                        objModelEmail.send('noreply@landmarkinsurance.co.in', 'roshani.prajapati@policyboss.com', sub, email_body, '', '', '');
                                    }
                                    res.json({'msg': 'success'});
                                } else {
                                    res.json({'msg': 'error'});
                                }
                            }
                        });
                    });
                } else {
                    res.json({'msg': 'error'});
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });
    app.post('/update_ticket', LoadSession1, function (req, res, next) {
        try {
            console.error("req.fields");
            console.error(req.fields);
            console.error("fields");
            console.error(fields);
            var fields = req.fields;
            var files = req.files;
            var objRequest;
            objRequest = fields;
			let ticket_remark = objRequest["Remark"];
            objRequest["Remark"] = htmlEscape(ticket_remark);
            var offical_email_id;
            if (req.obj_session.user.hasOwnProperty('profile') && req.obj_session.user.profile.hasOwnProperty('Official_Email') && req.obj_session.user.profile.Official_Email) {
                offical_email_id = req.obj_session.user.profile.Official_Email;
            } else {
                offical_email_id = req.obj_session.user.email;
            }
            //var objRequest = req.body;
            var Ticket_id = objRequest["Ticket_Id"];

            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                if (err)
                    throw err;
                var tickets = db.collection('tickets');
                tickets.findOne({"Ticket_Id": Ticket_id}, {sort: {"Modified_On": -1}}, function (err, dbticket) {
                    //console.log(dbticket);
                    var todayDate = new Date();
                    var arg = {};
                    arg = {
                        Ticket_Id: dbticket['Ticket_Id'],
                        Product: dbticket['Product'],
                        Category: dbticket["Category"],
                        SubCategory: dbticket["SubCategory"],
                        From: dbticket["From"],
                        To: dbticket["To"],
                        Status: objRequest["Status"],
                        Created_By: dbticket["Created_By"],
                        Modified_By: req.obj_session.user.ss_id,
                        Created_On: dbticket["Created_On"],
                        Modified_On: todayDate,
                        CRN: dbticket["CRN"],
                        Mobile_No: dbticket["Mobile_No"],
                        Vehicle_No: dbticket["Vehicle_No"],
                        Remark: objRequest["Remark"],
                        ss_id: dbticket["ss_id"],
                        CRN_owner: dbticket["CRN_owner"],
                        IsActive: 1,
                        fba_id: dbticket["fba_id"],
                        CRN_fba_id: dbticket["CRN_fba_id"],
                        channel: dbticket["channel"],
                        subchannel: dbticket["subchannel"],
                        //UploadFiles: dbticket["UploadFiles"],
                        Modified_By_Name: req.obj_session.user.fullname,
                        Ticket_Code: dbticket['Ticket_Id'],
                        Agent_Email_Id: dbticket['Agent_Email_Id'],
                        Transaction_On: dbticket["Transaction_On"],
                        Source: objRequest["Source"],
                        RM_Email_Id: dbticket["RM_Email_Id"],
                        RM_Agent_Name: dbticket["RM_Agent_Name"],
                        Pincode: dbticket["Pincode"],
                        Insurer_Id: dbticket["Insurer_Id"]
                    };
                    if (files !== undefined && JSON.stringify(files) !== "{}") {

                        var DocName = files['uploadfile']['name'].split(".")[0].replace(/ /g, '');
                        var extension = files['uploadfile']['name'].split(".")[1];
                        var pdf_sys_loc_horizon = appRoot + "/tmp/ticketing/" + dbticket['Ticket_Id'] + "/Resolver/" + req.obj_session.user.ss_id + "_" + DocName + "." + extension;
                        var pdf_web_path_horizon = config.environment.downloadurl + "/ticketing/" + dbticket['Ticket_Id'] + "/Resolver/" + req.obj_session.user.ss_id + "_" + DocName + "." + extension;

                        var oldpath = files['uploadfile']['path'];
                        var dir = appRoot + "/tmp/ticketing/" + dbticket['Ticket_Id'] + "/Resolver";

                        if (!fs.existsSync(appRoot + "/tmp/ticketing/" + dbticket['Ticket_Id'])) {
                            fs.mkdirSync(appRoot + "/tmp/ticketing/" + dbticket['Ticket_Id']);
                        }

                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }
                        if (fs.existsSync(dir)) {
                            fs.readFile(oldpath, function (err, data) {
                                if (err)
                                    throw err;
                                // Write the file
                                fs.writeFile(pdf_sys_loc_horizon, data, function (err) {
                                    if (err)
                                        throw err;
                                });
                                // Delete the file
                                fs.unlink(oldpath, function (err) {
                                    if (err)
                                        throw err;
                                });
                            });
                        }
                        sleep(1000);

                        var objfile = {
                            "file_1": pdf_web_path_horizon
                        };
                        arg['UploadFiles'] = objfile;
                    }
                    tickets.insertOne(arg, function (err, res1) {
                        if (err)
                            throw err;
                        if (res1["insertedCount"] > 0) {
                            //user_details
                            var objticket = {
                                "Modified_By": req.obj_session.user.ss_id,
                                "Status": objRequest["Status"],
                                "Modified_On": todayDate,
                                "Remark": objRequest["Remark"]
                            };
                            var user_details = db.collection('user_details');
                            user_details.update({'Ticket_code': Ticket_id}, {$set: objticket}, function (err, numAffected) {
                                console.log('user_detailsUpdate', err, numAffected);
                                //res.json({'Status': 'Updated'});
                            });
                            var product_name;
                            if (dbticket["Product"] === 1) {
                                product_name = "CAR";
                            } else if (dbticket["Product"] === 10) {
                                product_name = "BIKE";
                            } else if (dbticket["Product"] === 2) {
                                product_name = "HEALTH";
                            } else if (dbticket["Product"] === 12) {
                                product_name = "CV";
                            }
                            var Email = require('../models/email');
                            var objModelEmail = new Email();
                            var environment = config.environment.name === 'Production' ? "" : "QA-";
                            var cc = '';
                            var to = "";

                            if (offical_email_id !== null || offical_email_id !== undefined) {
                                to = offical_email_id;
                            }

                            if (emailtocc.hasOwnProperty(dbticket["Category_Name"])) {
//                                if (dbticket["Category_Name"] === "Product Input Page") {
//                                    if (emailtocc[dbticket["Category_Name"]][dbticket["SubCategory"]][0]["to"] !== "")
//                                    {
//                                        to += "," + emailtocc[dbticket["Category_Name"]][dbticket["SubCategory"]][0]["to"];
//                                    }
//                                    if (emailtocc[dbticket["Category_Name"]][dbticket["SubCategory"]][0]["cc"] !== "")
//                                    {
//                                        cc += dbticket["RM_Email_Id"] !== "" ? "," + dbticket["RM_Email_Id"] : '' + emailtocc[dbticket["Category_Name"]][dbticket["SubCategory"]][0]["cc"];
//                                    }
//                                } else {

                                if (emailtocc[dbticket["Category_Name"]][0]["to"] !== "")
                                {
                                    to += "," + emailtocc[dbticket["Category_Name"]][0]["to"];
                                }
                                if (emailtocc[dbticket["Category_Name"]][0]["cc"] !== "")
                                {
                                    cc += dbticket["RM_Email_Id"] !== "" ? "," + dbticket["RM_Email_Id"] : '' + emailtocc[dbticket["Category_Name"]][0]["cc"];
                                }
//                                }
                            }



                            if (objRequest["CRN"] !== "" && objRequest["CRN"] !== null && objRequest["CRN"] !== undefined) {
                                var subject = "[TICKET] " + Ticket_id + " - " + dbticket["CRN"] + " " + environment + " " + product_name + '-' + dbticket["Category"] + '-' + dbticket["SubCategory"];
                            } else {
                                var subject = "[TICKET] " + Ticket_id + " " + environment + " " + product_name + '-' + dbticket["Category"] + '-' + dbticket["SubCategory"];
                            }

                            var Insurer_Name = dbticket["Insurer_Id"] !== "" ? const_arr_insurer["Insurer_" + dbticket["Insurer_Id"]] : "";
                            var mail_content = '<html><body>' +
                                    'Ticket is created.' +
                                    '<p></p>Ticket No - ' + Ticket_id +
                                    '<p></p>CRN  - ' + dbticket["CRN"] +
                                    '<p></p>Status  - ' + objRequest["Status"] +
                                    '<p></p>Product  - ' + product_name +
                                    '<p></p>Remarks  - ' + objRequest["Remark"] +
                                    '<p></p>You will be notified once ticket is resolved.' +
                                    '<p></p>You can check ticket status in my ticket section.' +
                                    '</body></html>';
                            if (offical_email_id !== null || offical_email_id !== undefined) {
                                objModelEmail.send('noreply@policyboss.com', to, subject, mail_content, cc, config.environment.notification_email, dbticket["CRN"]);
                            }

                            if (Ticket_id === "") {
                                res.json({'Status': "Success", 'Ticket_Id': Ticket_id, 'CRN': dbticket["CRN"], 'Category': dbticket["Category"], 'SubCategory': dbticket["SubCategory"], 'Msg': 'Ticket is created.', 'Created_On': moment(dbticket["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(dbticket["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Product_name': product_name, 'Insurer_name': Insurer_Name});
                            } else {
                                res.json({'Status': "Success", 'Ticket_Id': Ticket_id, 'CRN': dbticket["CRN"], 'Category': dbticket["Category"], 'SubCategory': dbticket["SubCategory"], 'Msg': 'Ticket is updated.', 'Created_On': moment(dbticket["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(dbticket["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Product_name': product_name, 'Insurer_name': Insurer_Name});
                            }
                        }
                    });
                });

            });
        } catch (err) {
            console.log(err);
            console.error("catch" + err);
            return res.send(err.stack);
        }

    });

    app.post('/tickets/getSubCategoryLevel', function (req, res) {
        try {
            var objRequest = req.body;
            var SubCategoryLevel = objRequest["level"] - 0;
            var SubCategory = objRequest["subcategory"];
            var objResponse = [];


            var dbticketing_subcategory = myDb.collection('ticketing_subcategory');
            dbticketing_subcategory.find({"SubCategory": SubCategory}).toArray(function (err, dbsubCategory) {
                if (err) {
                    res.send(err);
                } else {
                    console.log(dbsubCategory);
                    for (var i in dbsubCategory) {
                        if (SubCategoryLevel === 2) {
                            for (var j in dbsubCategory[i]['SubCategory_Level2']) {
                                objResponse.push(dbsubCategory[i]['SubCategory_Level2'][j]);
                            }
                        }

                    }
                    res.json(objResponse);
                }
            });

        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }

    });

    app.post('/tickets/user_details', function (req, res) {
        try {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                if (err)
                    throw err;
                var objRequest = req.body;
                var Ticket_id = objRequest['Ticket_id'];
                var todayDate = new Date();
                var tickets = db.collection('tickets');
                //var tickets = require('../models/ticket');
                tickets.findOne({"Ticket_Id": Ticket_id}, {sort: {"Modified_On": -1}}, function (err, dbticket) {
                    //tickets.find({"Ticket_Id": Ticket_id}).sort({"Modified_On": -1}).limit(1).exec(function (err, dbticket) {
                    if (dbticket !== null) {
                        var user_details = db.collection('user_details');
                        if (objRequest["isticket_created"] === 1) {
                            autoIncrement.getNextSequence(db, 'user_details', function (err1, autoIndex) {
                                var arg = {
                                    Ticket_Id: autoIndex,
                                    Ticket_code: Ticket_id,
                                    Product: dbticket["Product"],
                                    Category: dbticket["Category"],
                                    SubCategory: dbticket["SubCategory"],
                                    Status: dbticket["Status"],
                                    From: dbticket["From"],
                                    To: dbticket["To"],
                                    Created_By: dbticket["Created_By"],
                                    Created_On: dbticket["Created_On"] === "" ? todayDate : dbticket["Created_On"],
                                    Modified_By: objRequest["Modified_By"] - 0,
                                    Modified_On: todayDate,
                                    CRN: dbticket["CRN"],
                                    Mobile_No: dbticket["Mobile_No"],
                                    Vehicle_No: dbticket["Vehicle_No"],
                                    Remark: dbticket["Remark"],
                                    ss_id: dbticket["ss_id"] - 0,
                                    CRN_owner: dbticket["CRN_owner"],
                                    fba_id: dbticket["fba_id"],
                                    CRN_fba_id: dbticket["CRN_fba_id"],
                                    channel: dbticket["channel"],
                                    subchannel: dbticket["subchannel"],
                                    Agent_Email_Id: dbticket["Agent_Email_Id"],
                                    Transaction_On: dbticket["Transaction_On"],
                                    Source: dbticket["Source"],
                                    RM_Email_Id: dbticket["RM_Email_Id"],
                                    RM_Agent_Name: dbticket["RM_Agent_Name"],
                                    Insurer_Id: dbticket["Insurer_Id"]
                                };
                                user_details.insert(arg, function (err, res1) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log('user_detailsInsert', err, res1);
                                        res.json({'Status': 'Inserted'});
                                    }
                                });
                            });
                        } else {
                            var objticket = {
                                "Modified_By": objRequest["Modified_By"] - 0,
                                "Status": objRequest['Status'],
                                "Modified_On": todayDate,
                                "Remark": objRequest["Remark"]
                            };
                            user_details.update({'Ticket_code': Ticket_id}, {$set: objticket}, function (err, numAffected) {
                                console.log('user_detailsUpdate', err, numAffected);
                                res.json({'Status': 'Updated'});
                            });
                        }
                    }
                });
            });
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });

    app.post('/tickets', LoadSession, function (req, res) {
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
            filter = {};
            filter['ss_id'] = 0;
            if (req.body['page_action'] === 'all') {
                delete filter.ss_id;
            }
            if (req.body['page_action'] === 'channel') {
                filter['ss_id'] = req.obj_session.user.role_detail.channel;
            }
            if (req.body['page_action'] === 'my') {
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    var arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                    filter['ss_id'] = {$in: arr_ssid};
                } else {
                    filter['ss_id'] = req.obj_session.user.ss_id - 0;
                }
            }

            if (typeof req.body['Col_Name'] === 'string' && req.body['Col_Name'] !== '' && req.body['txtCol_Val'] !== '') {
                filter[req.body['Col_Name']] = (req.body['Col_Name'] === 'Ss_Id') ? req.body['txtCol_Val'] - 0 : req.body['txtCol_Val'];
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
        }


        Ticket.paginate(filter, optionPaginate).then(function (posps) {
            console.log(obj_pagination.filter, optionPaginate, posps);
            res.json(posps);
        });
    });
    app.get('/finmart_version', function (req, res) {
        try {
            var finmartversion = config.finmart_version.app_version;
            res.send(finmartversion);
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });

    app.post('/finmart_raiseticket', function (req, res) {
        try {
            var formidable = require('formidable');
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                var objRequest = fields;
                var updateobjRequest = {};
                var product_id = 0;
                var Ticket_id = objRequest["Ticket_Id"];
                var isticket_created = 0;
                var Is_Customer = Boolean(parseInt(objRequest['Is_Customer']));
                var offical_email_id = "";
                console.error("Is_Customer " + Is_Customer);

                console.log(objRequest);
                var ss_id = parseInt(objRequest['ss_id']);
                console.error("ss_id " + ss_id);
                if (ss_id > 0 && objRequest['ss_id'] !== 5 || Is_Customer === true) {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id, {}, function (data, response) {
                        if (data['status'] === 'SUCCESS' || Is_Customer === true) {
                            objRequest['agent'] = data;
                            var agentdetails = objRequest['agent']['EMP'];
                            if (data['user_type'] === "FOS") {
                                if (data.EMP.Email_Id) {
                                    offical_email_id = data.EMP.Email_Id;
                                }
                                if (data.RM.rm_details.email) {
                                    offical_email_id += offical_email_id === "" ? data.RM.rm_details.email : "," + data.RM.rm_details.email;
                                }
                            } else if (data['user_type'] === "POSP") {
                                if (data.POSP.Email_Id) {
                                    offical_email_id = data.POSP.Email_Id;
                                }
                                if (data.RM.rm_details.email) {
                                    offical_email_id += offical_email_id === "" ? data.RM.rm_details.email : "," + data.RM.rm_details.email;
                                }
                            } else if (data['user_type'] === "EMP") {
                                if (data.EMP.Email_Id) {
                                    offical_email_id = data.EMP.Email_Id;
                                }
                            } else if (data['user_type'] === "MISP") {
                                if (data.EMP.Email_Id) {
                                    offical_email_id = data.EMP.Email_Id;
                                }
                                if (data.EMP.Reporting_Email_ID) {
                                    offical_email_id += offical_email_id === "" ? data.EMP.Reporting_Email_ID : ',' + data.EMP.Reporting_Email_ID;
                                }
                            }

                            if (objRequest["Product"] === "CAR") {
                                product_id = 1;
                            } else if (objRequest["Product"] === "BIKE") {
                                product_id = 10;
                            } else if (objRequest["Product"] === "HEALTH") {
                                product_id = 2;
                            } else if (objRequest["Product"] === "CV") {
                                product_id = 12;
                            } else if (objRequest["Product"] === "FL") {
                                product_id = 0;
                            }

                            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                                if (err)
                                    throw err;

                                autoIncrement.getNextSequence(db, 'tickets', function (err1, autoIndex) {
                                    var tickets = db.collection('tickets');
                                    var agg = [
                                        // Group by the grouping key, but keep the valid values
                                        {"$group": {
                                                "_id": "$Ticket_Id",
                                                "docId": {"$last": "$_id"},
                                                "Ticket_Id": {"$last": "$Ticket_Id"},
                                                "Category": {"$last": "$Category"},
                                                "SubCategory": {"$last": "$SubCategory"},
                                                "From": {"$last": "$From"},
                                                "To": {"$last": "$To"},
                                                "Status": {"$last": "$Status"},
                                                "Created_by": {"$last": "$Created_by"},
                                                "Created_On": {"$last": "$Created_On"},
                                                "Modified_On": {"$last": "$Modified_On"},
                                                "CRN": {"$last": "$CRN"},
                                                "Mobile_No": {"$last": "$Mobile_No"},
                                                "Vehicle_No": {"$last": "$Vehicle_No"},
                                                "Remark": {"$last": "$Remark"},
                                                "ss_id": {"$last": "$ss_id"},
                                                "SubCategory_level2": {"$last": "$SubCategory_level2"},
                                                "Product": {"$last": "$Product"}
                                            }},
                                        // Then sort
                                        {"$sort": {"Created_On": -1}}

                                    ];
                                    console.log(agg);
                                    //tickets.aggregate(agg, function (err1, dbTicket1) {
                                    if (err1) {
                                        throw err1;
                                    } else {
                                        tickets.find({"$or": [{"CRN": (objRequest.CRN).toString()}, {"CRN": parseInt(objRequest.CRN)}], "Category": objRequest.Category}).toArray(function (err, crn_cat_exist) {
                                            if ((crn_cat_exist.length === 0 && objRequest.hasOwnProperty('CRN') && objRequest.CRN !== "") ||
                                                    ((crn_cat_exist.length > 0 || crn_cat_exist.length === 0) && (objRequest.CRN === "" || objRequest.CRN === undefined))) {
                                                var todayDate = new Date();

                                                var NewTicket_Id;
                                                var productname = "";
                                                if (objRequest["Category"] === "Finmart") {
                                                    productname = "FM";
                                                } else {
                                                    productname = objRequest["Product"].substring(0, 2).toString().toUpperCase();
                                                }

                                                if (Ticket_id === "") {
                                                    //create new ticket id.
                                                    NewTicket_Id = productname + objRequest["Category"].substring(0, 2).toString().toUpperCase() + autoIndex;
                                                    isticket_created = 1;
                                                } else {
                                                    NewTicket_Id = Ticket_id;
                                                    isticket_created = 0;
                                                }
                                                tickets.findOne({"Ticket_Id": Ticket_id}, {sort: {"Modified_On": -1}}, function (err, dbticket) {
                                                    console.log(dbticket);

                                                    var arg = {};

                                                    arg = {
                                                        Ticket_Id: dbticket !== null ? dbticket['Ticket_Id'] : NewTicket_Id,
                                                        Product: dbticket !== null ? dbticket['Product'] : product_id,
                                                        Category: dbticket !== null ? dbticket["Category"] : objRequest["Category"],
                                                        SubCategory: dbticket !== null ? dbticket["SubCategory"] : objRequest["SubCategory"],
                                                        From: dbticket !== null ? dbticket["From"] : Is_Customer === true ? objRequest["Agent_Name"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') ',
                                                        To: dbticket !== null ? dbticket["To"] : Is_Customer === true ? objRequest["Agent_Name"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') ',
                                                        Status: (objRequest["Status"] === "0" || objRequest["Status"] === undefined) ? dbticket["Status"] : objRequest["Status"],
                                                        Created_By: dbticket !== null ? dbticket["Created_By"] : Is_Customer === true ? objRequest["Agent_Name"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') ',
                                                        Modified_By: agentdetails.Emp_Id,
                                                        Created_On: dbticket !== null ? dbticket["Created_On"] : (objRequest["Created_On"] === "" ? todayDate : objRequest["Created_On"]),
                                                        Modified_On: todayDate,
                                                        CRN: dbticket !== null ? dbticket["CRN"] : objRequest["CRN"] - 0,
                                                        Mobile_No: dbticket !== null ? dbticket["Mobile_No"] : objRequest["Mobile_No"],
                                                        Vehicle_No: dbticket !== null ? dbticket["Vehicle_No"] : objRequest["Vehicle_No"],
                                                        Remark: objRequest["Remark"],
                                                        ss_id: dbticket !== null ? dbticket["ss_id"] : agentdetails.Emp_Id,
                                                        SubCategory_level2: objRequest["SubCategory_level2"],
                                                        CRN_owner: dbticket !== null ? dbticket["CRN_owner"] : objRequest["CRN_owner"],
                                                        IsActive: 1,
                                                        fba_id: dbticket !== null ? dbticket["fba_id"] : agentdetails.FBA_ID,
                                                        CRN_fba_id: dbticket !== null ? dbticket["CRN_fba_id"] : objRequest["CRN_fba_id"],
                                                        channel: dbticket !== null ? dbticket["channel"] : objRequest["channel"],
                                                        subchannel: dbticket !== null ? dbticket["subchannel"] : objRequest["subchannel"],
                                                        UploadFiles: "",
                                                        Ticket_Code: dbticket !== null ? dbticket['Ticket_Id'] : NewTicket_Id,
                                                        Agent_Email_Id: Is_Customer === true ? objRequest["Agent_Email"] : offical_email_id,
                                                        Transaction_On: dbticket !== null ? dbticket['Transaction_On'] : objRequest["Transaction_On"],
                                                        Source: objRequest["Source"],
                                                        RM_Email_Id: dbticket !== null ? dbticket["RM_Email_Id"] : objRequest["rm_email_id"],
                                                        RM_Agent_Name: dbticket !== null ? dbticket["RM_Agent_Name"] : objRequest["rm_agent_name"],
                                                        Agent_Name: dbticket !== null ? dbticket["Agent_Name"] : objRequest["Agent_Name"],
                                                        Pincode: dbticket !== null ? dbticket["Pincode"] : objRequest["Pincode"] - 0,
                                                        Insurer_Id: dbticket !== null ? dbticket["insurer_id"] : objRequest["Insurer_Id"] !== "" ? parseInt(objRequest["Insurer_Id"]) : ""
                                                    };

                                                    if (dbticket !== null) {
                                                        updateobjRequest = dbticket;
                                                        var objticket = {};
                                                        objticket['IsActive'] = 0;

                                                        tickets.updateMany({'Ticket_Id': NewTicket_Id}, {$set: {"IsActive": 0}}, function (err, numAffected) {
                                                            if (err) {
                                                                res.json({Msg: 'Ticket_Not_Saved', Details: err});
                                                            } else {
                                                                //res.json({Msg: 'Success_Created', Details: numAffected});
                                                            }
                                                        });
                                                    }

                                                    tickets.insertOne(arg, function (err, res1) {
                                                        if (err)
                                                            throw err;
                                                        if (res1["insertedCount"] > 0) {

                                                            //user_details start
                                                            var user_details = db.collection('user_details');
                                                            if (isticket_created === 1) {
                                                                autoIncrement.getNextSequence(db, 'user_details', function (err1, autoIndex) {
                                                                    var arg = {
                                                                        Ticket_Id: autoIndex,
                                                                        Ticket_code: NewTicket_Id,
                                                                        Product: product_id,
                                                                        Category: objRequest["Category"],
                                                                        SubCategory: objRequest["SubCategory"],
                                                                        Status: objRequest["Status"],
                                                                        From: Is_Customer === true ? objRequest["Agent_Name"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') ',
                                                                        To: Is_Customer === true ? objRequest["Agent_Name"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') ',
                                                                        Created_By: Is_Customer === true ? objRequest["Agent_Name"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') ',
                                                                        Created_On: objRequest["Created_On"] === "" ? todayDate : objRequest["Created_On"],
                                                                        Modified_By: agentdetails.Emp_Id - 0,
                                                                        Modified_On: todayDate,
                                                                        CRN: objRequest["CRN"] - 0,
                                                                        Mobile_No: objRequest["Mobile_No"],
                                                                        Vehicle_No: objRequest["Vehicle_No"],
                                                                        Remark: objRequest["Remark"],
                                                                        ss_id: objRequest["ss_id"] - 0,
                                                                        CRN_owner: objRequest["CRN_owner"],
                                                                        fba_id: objRequest["fba_id"],
                                                                        CRN_fba_id: objRequest["CRN_fba_id"],
                                                                        channel: objRequest["channel"],
                                                                        subchannel: objRequest["subchannel"],
                                                                        Source: objRequest["Source"],
                                                                        RM_Email_Id: objRequest["rm_email_id"],
                                                                        RM_Agent_Name: objRequest["rm_agent_name"] !== "" ? objRequest["rm_agent_name"] : "",
                                                                        Agent_Name: objRequest["Agent_Name"],
                                                                        Pincode: objRequest["Pincode"] - 0,
                                                                        Transaction_On: objRequest["Transaction_On"],
                                                                        Insurer_Id: objRequest["Insurer_Id"],
                                                                        Agent_Email_Id: Is_Customer === true ? objRequest["Agent_Email"] : offical_email_id
                                                                    };
                                                                    user_details.insertOne(arg, function (err, res1) {
                                                                        if (err) {
                                                                            throw err;
                                                                        } else {
                                                                            console.log('user_detailsInsert', err, res1);
                                                                        }
                                                                    });
                                                                });
                                                            } else {
                                                                var objticket = {
                                                                    "Modified_By": objRequest["Modified_By"] - 0,
                                                                    "Status": objRequest['Status'],
                                                                    "Modified_On": todayDate
                                                                };
                                                                user_details.update({'Ticket_code': NewTicket_Id}, {$set: objticket}, function (err, numAffected) {
                                                                    console.log('user_detailsUpdate', err, numAffected);
                                                                });
                                                            }
                                                            //user_details end

															if(objRequest['fileupload_flag'] === 'Multiple'){
																var objfile = {};
																for (var i = 0; i < 4; i++) {
																	var doc_prefix = objRequest["doc_prefix_" + i] !== "" ? objRequest["doc_prefix_" + i] + "_" : "";
																	if (objRequest['file_path_' + i] !== "" && objRequest['file_name_' + i] !== "" && objRequest['file_path_' + i] !== undefined) {
																		var source = objRequest['file_path_' + i];
																		var DocName = objRequest['file_name_' + i];
																		var extension = source.split(".");
																		console.error("source  " + source);
																		console.error("DocName  " + DocName);
																		var pdf_web_path_horizon = config.environment.downloadurl + "/ticketing/" + NewTicket_Id + '/' + doc_prefix + DocName + "." + extension[extension.length - 1];
																		console.error("pdf_web_path_horizon  " + pdf_web_path_horizon);

																		move(source, NewTicket_Id, DocName, doc_prefix, function (err) {

																		});
																		objfile["file_" + i] = pdf_web_path_horizon;
																		console.log(objfile);
																	}
																} 
																var objdata = {'UploadFiles': objfile};
																console.log("objdata : ", objdata);
																tickets.findAndModify({'Ticket_Id': NewTicket_Id}, [["Modified_On", -1]], {$set: objdata}, {}, function (err, numAffected) {
																	console.log('UserDataUpdated', err, numAffected);
																	if (err) {
																		objdata['Msg'] = err;
																	} else {
																		objdata['Msg'] = numAffected;

																	}
																});
															} else {
																var doc_prefix = objRequest["doc_prefix"] !== "" ? objRequest["doc_prefix"] + "_" : "";
																if (objRequest['file_path'] !== "" && objRequest['file_name'] !== "" && objRequest['file_path'] !== undefined) {
																	var source = objRequest['file_path'];
																	var DocName = objRequest['file_name'];
																	var extension = source.split(".");
																	console.error("source  " + source);
																	console.error("DocName  " + DocName);
																	var pdf_web_path_horizon = config.environment.downloadurl + "/ticketing/" + NewTicket_Id + '/' + doc_prefix + DocName + "." + extension[extension.length - 1];
																	console.error("pdf_web_path_horizon  " + pdf_web_path_horizon);
																	move(source, NewTicket_Id, DocName, doc_prefix, function (err) {

																	});
																	var objfile = {
																		"file_1": pdf_web_path_horizon
																	};
																	var objdata = {'UploadFiles': objfile};

																	tickets.findAndModify({'Ticket_Id': NewTicket_Id}, [["Modified_On", -1]], {$set: objdata}, {}, function (err, numAffected) {
																		console.log('UserDataUpdated', err, numAffected);
																		if (err) {
																			objdata['Msg'] = err;
																		} else {
																			objdata['Msg'] = numAffected;

																		}
																	});
																}
                                                            }

                                                            //Send Mail
                                                            var Email = require('../models/email');
                                                            var objModelEmail = new Email();
                                                            var environment = config.environment.name === 'Production' ? "" : "QA-";
                                                            var category = Ticket_id === "" ? objRequest["Category"] : updateobjRequest["Category"];
                                                            var subcategory = Ticket_id === "" ? objRequest["SubCategory"] : updateobjRequest["SubCategory"];
                                                            var crn = Ticket_id === "" ? objRequest["CRN"] : updateobjRequest["CRN"];
                                                            var product = Ticket_id === "" ? objRequest["Product"] : updateobjRequest["Product"];
                                                            var status = Ticket_id === "" ? objRequest["Status"] : updateobjRequest["Status"];

                                                            var Created_On = updateobjRequest["Created_On"];
                                                            var Transaction_On = Ticket_id === "" ? objRequest["Transaction_On"] : updateobjRequest["Transaction_On"];
                                                            var rm_emailid = "";
                                                            rm_emailid = Ticket_id === "" ? objRequest["rm_email_id"] : updateobjRequest["RM_Email_Id"];
                                                            var cc = '';
                                                            var to = "";

                                                            if (offical_email_id !== null && offical_email_id !== undefined) {
                                                                to = offical_email_id;
                                                            } else if (Is_Customer) {
                                                                to = objRequest["Agent_Email"];
                                                            }

                                                            if (emailtocc.hasOwnProperty(objRequest["Category_Name"])) {
//                                                        if (objRequest["Category_Name"] === "Product Input Page") {
//                                                            if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"] !== "")
//                                                            {
//                                                                to += "," + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"];
//                                                            }
//                                                            if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"] !== "")
//                                                            {
//                                                                cc += rm_emailid !== "" ? "," + rm_emailid : '' + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"];
//                                                            }
//                                                        } else {

                                                                if (emailtocc[objRequest["Category_Name"]][0]["to"] !== "")
                                                                {
                                                                    to += "," + emailtocc[objRequest["Category_Name"]][0]["to"];
                                                                }
                                                                if (emailtocc[objRequest["Category_Name"]][0]["cc"] !== "")
                                                                {
                                                                    cc += rm_emailid !== "" ? "," + rm_emailid : '' + emailtocc[objRequest["Category_Name"]][0]["cc"];
                                                                }
//                                                        }
                                                            }

                                                            var Insurer_Name = objRequest["Insurer_Id"] !== "" ? const_arr_insurer["Insurer_" + objRequest["Insurer_Id"]] : "";
                                                            var product = "";
                                                            if (category === "Finmart") {
                                                                //to += ";pramod.parit@policyboss.com";
                                                            } else {
                                                                product = "-" + objRequest["Product"];
                                                            }

                                                            if (crn !== "" && crn !== null && crn !== undefined) {
                                                                var subject = "[TICKET] " + NewTicket_Id + " - " + crn + " " + environment + product + '-' + category + '-' + subcategory;
                                                            } else {
                                                                var subject = "[TICKET] " + NewTicket_Id + " " + environment + product + '-' + category + '-' + subcategory;
                                                            }

                                                            var mail_content = '<html><body>' +
                                                                    'Ticket is created.' +
                                                                    '<p></p>Ticket No - ' + NewTicket_Id +
                                                                    '<p></p>CRN  - ' + crn +
                                                                    '<p></p>Status  - ' + status +
                                                                    '<p></p>Product  - ' + product +
                                                                    '<p></p>Remarks  - ' + objRequest["Remark"] +
                                                                    '<p></p>You will be notified once ticket is resolved.' +
                                                                    '<p></p>You can check ticket status in my ticket section.' +
                                                                    '</body></html>';

                                                            if (to !== "") {
                                                                objModelEmail.send('noreply@policyboss.com', to, subject, mail_content, cc, config.environment.notification_email, crn);

                                                            }
                                                            if (Ticket_id === "") {
                                                                res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is created.', 'Created_On': moment(todayDate).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Insurer_Name': Insurer_Name, "Product_Name": objRequest["Product"]});
                                                            } else {
                                                                res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': crn, 'Category': category, 'SubCategory': subcategory, 'Msg': 'Ticket is updated.', 'Created_On': moment(Created_On).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(Transaction_On).format("YYYY-MM-DD HH:mm:ss"), 'Insurer_Name': Insurer_Name, "Product_Name": objRequest["Product"]});
                                                            }


                                                        } else {
                                                            res.json({'Status': "Fail", 'Msg': "No Ticket raised"});
                                                        }
                                                        //console.log(res);
                                                    });
                                                });
                                            } else {
                                                res.json({'Status': "exist", 'Msg': 'Ticket for this CRN under this category is already created'});
                                            }
                                        });
                                    }
                                });
                            });
                        } else {
                            res.json({'Status': "Fail", 'Msg': "Ss Id is 0"});
                        }
                    });
                } else {
                    res.json({'Status': "Fail", 'Msg': ""});
                }
            });
        } catch (err) {
            return res.send(err.stack);
        }
    });

    app.post('/mobile_raiseticket_doc', upload.single('doc_type'), (req, res) => {
        try {
            var obj = {"file_name": "",
                "file_path": ""};
            if (req.file !== null) {
                obj["file_name"] = req.file['originalname'].split(".")[0];
                obj["file_path"] = req.file.path;
                res.json({'Status': "success", 'Message': "File Upload Success", "StatusNo": 0, "MasterData": obj});

            } else {
                res.json({'Status': "failure", 'Message': "No File Uploaded", "StatusNo": 1, "MasterData": obj});
            }
        } catch (err) {
            return res.send(err.stack);
        }
    });

    app.get('/closed_ticket/:CRN', function (req, res) {
        try {
            var CRN = req.params['CRN'] - 0;
            var user_data = require('../models/user_data');
            var tickets = require('../models/ticket');
            var user_details = require('../models/user_details');
            user_data.find({'PB_CRN': CRN}).exec(function (err, dbUsers) {
                if (err)
                    throw err;
                if (dbUsers.length > 0) {
                    var last_status = dbUsers[0]._doc['Last_Status'];
                    if (last_status === "TRANS_SUCCESS_WO_POLICY") {
                        var agg = [
                            {$match: {CRN: CRN.toString()}},
                            {$group: {_id: "$Ticket_Id", "doc": {"$first": "$$ROOT"}}},
                            {$sort: {Modified_On: -1}}
                        ];
                        tickets.aggregate(agg, function (err, dbticket) {
                            if (err)
                                throw err;
                            for (var i in dbticket) {
                                var objticket = dbticket[i].doc;

                                objticket['Status'] = "Closed";
                                objticket['Modified_On'] = new Date();
                                delete objticket._id;
                                console.log(objticket);
                                ticket = new tickets(objticket);
                                ticket.save(function (err2, ticket) {

                                });

                                var objuser = {
                                    "Status": "Closed",
                                    "Modified_On": new Date()
                                };
                                user_details.update({'Ticket_code': objticket['Ticket_Id'].toString()}, {$set: objuser}, function (err, numAffected) {
                                    console.log('user_detailsUpdate', err, numAffected);
                                });


                            }
                        });
                    }
                } else {

                }
            });
        } catch (err) {
            return res.send(err.stack);
        }
    });
    app.get('/ticket_exist/:CRN/:SubCategory?', function (req, res) {
        try {
            var CRN = req.params['CRN'] - 0;
            var SubCategory = req.params['SubCategory'];
            var ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            var tickets = require('../models/ticket');
            var userdetails = require('../models/user_details');
            var Condition = {"CRN": CRN};
//            if (SubCategory !== "" && SubCategory !== undefined) {
//                Condition['SubCategory'] = SubCategory;
//            }
            userdetails.find(Condition).sort({"Modified_On":-1}).exec(function (err, dbticket) {
                if (dbticket.length > 0) {
                    var dbticket = dbticket[0]['_doc'];
                    if (dbticket['Source'] === "policyboss-auto") {
                        if (ss_id && ss_id > 0) { //for agent creating ticket
                            var Client = require('node-rest-client').Client;
                            var client = new Client();
                            client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id, {}, function (data, response) {
                                var agentdetails = data['EMP'];
                                let setObj = {
                                    "Created_By": agentdetails.Emp_Name + ' (' + agentdetails.UID + ') ',
                                    "Source" : "policyboss",
                                    "ss_id" : ss_id
                                };
                                userdetails.updateOne(Condition, {$set: setObj}, function (err, dbres) {
                                    if (err) {
                                        res.json({"Status": "Fail", "Msg": err});
                                    } else {
                                        if (dbres) {
                                            var dbticketObj = {
                                                "Ticket_Id": dbticket['Ticket_code'],
                                                "Product": dbticket['Product'],
                                                "Category": dbticket['Category'],
                                                "SubCategory": dbticket['SubCategory'],
                                                "From": agentdetails.Emp_Name + ' (' + agentdetails.UID + ') ',
                                                "To": agentdetails.Emp_Name + ' (' + agentdetails.UID + ') ',
                                                "Status": dbticket['Status'],
                                                "Created_By": agentdetails.Emp_Name + ' (' + agentdetails.UID + ') ',
                                                "Modified_By": ss_id,
                                                "Created_On": new Date(),
                                                "Modified_On":new Date(),
                                                "Remark": dbticket['Remark'],
                                                "Vehicle_No": dbticket['Vehicle_No'],
                                                "CRN": dbticket['CRN'],
                                                "Mobile_No": dbticket['Mobile_No'],
                                                "ss_id": ss_id,
                                                "SubCategory_level2": dbticket['SubCategory_level2'] ? dbticket['SubCategory_level2'] : "",
                                                "CRN_owner": dbticket['CRN_owner'],
                                                "fba_id": dbticket['fba_id'],
                                                "CRN_fba_id": dbticket['CRN_fba_id'],
                                                "channel": dbticket['channel'],
                                                "subchannel": dbticket['subchannel'],
                                                "Source" : "policyboss"
                                            };
                                            delete dbticket['_id'];
                                            dbticket["Agent_Email_Id"] = agentdetails.Email_Id ? agentdetails.Email_Id : dbticket["Agent_Email_Id"];
                                            let ticketObj = new tickets(dbticketObj);
                                            ticketObj.save(function (err, user) {
                                                if (err) {
                                                    res.json({"Status": "Fail", "Msg": err});
                                                } else {
                                                    sendmail(dbticket);
                                                    res.json({'result': 1, 'Status': "Success", 'Ticket_Id': dbticket['Ticket_code'], 'CRN': dbticket["CRN"], 'Category': dbticket["Category"], 'SubCategory': dbticket["SubCategory"], 'Msg': 'Ticket Created.', 'Created_On': moment(dbticket["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(dbticket["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss")});
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                        } else { //for customer creating ticket
                            let setObj = {
                                "Created_By": dbticket['From'],
                                "Source": "policyboss",
                                "Modified_On": new Date()
                            };
                            userdetails.updateOne(Condition, {$set: setObj}, function (err, dbres) {
                                if (err) {
                                    res.json({"Status": "Fail", "Msg": err});
                                } else {
                                    if (dbres) {
                                        delete dbticket['_id'];
                                        var dbticketObj = {
                                                "Ticket_Id": dbticket['Ticket_code'],
                                                "Product": dbticket['Product'],
                                                "Category": dbticket['Category'],
                                                "SubCategory": dbticket['SubCategory'],
                                                "From": '',
                                                "To": '',
                                                "Status": dbticket['Status'],
                                                "Created_By": '',
                                                "Modified_By": '',
                                                "Created_On": new Date(),
                                                "Modified_On":new Date(),
                                                "Remark": dbticket['Remark'],
                                                "Vehicle_No": dbticket['Vehicle_No'],
                                                "CRN": dbticket['CRN'],
                                                "Mobile_No": dbticket['Mobile_No'],
                                                "ss_id": ss_id,
                                                "SubCategory_level2": dbticket['SubCategory_level2'] ? dbticket['SubCategory_level2'] : "",
                                                "CRN_owner": dbticket['CRN_owner'],
                                                "fba_id": dbticket['fba_id'],
                                                "CRN_fba_id": dbticket['CRN_fba_id'],
                                                "channel": dbticket['channel'],
                                                "subchannel": dbticket['subchannel'],
                                                "Source" : "policyboss"
                                            };
                                        let ticketObj = new tickets(dbticketObj);
                                        ticketObj.save(function (err, user) {
                                            if (err) {
                                                res.json({"Status": "Fail", "Msg": err});
                                            } else {
                                                sendmail(dbticket,true);
                                                res.json({'result': 1, 'Status': "Success", 'Ticket_Id': dbticket['Ticket_code'], 'CRN': dbticket["CRN"], 'Category': dbticket["Category"], 'SubCategory': dbticket["SubCategory"], 'Msg': 'Ticket Created.', 'Created_On': moment(dbticket["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(dbticket["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss")});
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    } else {
                        res.json({'result': 1, 'Status': "Success", 'Ticket_Id': dbticket['Ticket_code'], 'CRN': dbticket["CRN"], 'Category': dbticket["Category"], 'SubCategory': dbticket["SubCategory"], 'Msg': 'Ticket already created.', 'Created_On': moment(dbticket["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(dbticket["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss")});
                    }
                } else {
                    res.json({'result': 0, 'Status': "Fail", 'Ticket_Id': '', 'CRN': '', 'Category': '', 'SubCategory': '', 'Msg': 'No ticket exist', 'Created_On': '', 'Transaction_On': ''});
                }
            });
        } catch (err) {
            console.error("Ticketexist", err);
            return res.send(err.stack);
        }
    });
    app.post('/tickets/search_old', function (req, res) {
        try
        {
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);

            var optionPaginate = {
                select: 'Ticket_code Product Category SubCategory From Created_On Modified_On Status CRN Remark Ageing Close_Date Agent_Email_Id',
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };

            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);

            }
            var Condition = obj_pagination.filter;
            var objRequest = req.body;
            var objResponse = [];
            var mysort = "";
            var roleType = objRequest.role_type;
            if (objRequest["Category"] !== "") {
                objCategory = (objRequest.Category).split(',');
            }
            var today = moment().utcOffset("+05:30").startOf('Day');
            var fromDate = moment(objRequest["from_date"] === "" ? today : objRequest["from_date"]).format("YYYY-MM-D");
            var toDate = moment(objRequest["to_date"] === "" ? today : objRequest["to_date"]).format("YYYY-MM-D");
            var arrFrom = fromDate.split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
            var arrTo = toDate.split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);
            console.log('DateRange', 'from', dateFrom, 'to', dateTo);

            if (objRequest["search_by"] !== "CurrentDate") {
                if (objRequest["search_by"] === "ticketid") {
                    //Condition["Ticket_Id"] = objRequest["search_byvalue"];
                    Condition["Ticket_Id"] = new RegExp(objRequest["search_byvalue"], 'i');
                } else if (objRequest["search_by"] === "CRN") {
                    Condition["CRN"] = objRequest["search_byvalue"];
                } else {
                    if (roleType === "tickets") {
                        Condition = {"ss_id": objRequest.ss_id - 0,
                            "Created_On": {$gte: dateFrom, $lt: dateTo}
                        };
                    } else {
                        Condition = {"Category": {$in: objCategory},
                            "Modified_On": {$gte: dateFrom, $lt: dateTo}
                        };
                    }
                    if (objRequest["status"] !== "") {
                        Condition["Status"] = objRequest["status"];
                    }
                }
                mysort = {Modified_On: -1};
            } else {
                if (roleType === "tickets") {
                    Condition = {"ss_id": objRequest.ss_id - 0,
                        "Created_On": {$gte: dateFrom, $lt: dateTo}
                    };
                } else {
                    Condition = {"Category": {$in: objCategory},
                        "Modified_On": {$gte: dateFrom, $lt: dateTo}
                    };
                }
                if (objRequest["status"] !== "") {
                    Condition["Status"] = objRequest["status"];
                }
            }
            //var tickets = require('../models/ticket');
            var tickets = require('../models/user_details');
            console.error('HorizonTicketSearch', Condition, req.body);
            tickets.paginate(Condition, optionPaginate).then(function (dbTicket) {
                console.log(dbTicket);
                for (var i in dbTicket.docs) {
                    var productname = "";
                    // var Create;
                    if (dbTicket.docs[i]["Product"] === 1) {
                        productname = "CAR";
                    } else if (dbTicket.docs[i]["Product"] === 10) {
                        productname = "BIKE";
                    } else if (dbTicket.docs[i]["Product"] === 2) {
                        productname = "HEALTH";
                    }
                    var Action_name = "";
                    if (objRequest["Category"] === "") {
                        Action_name = "Action";
                    } else {
                        if (dbTicket.docs[i]["Status"] === "Open" && objRequest["role_type"] !== "tickets") {
                            Action_name = "Start";
                        } else {
                            Action_name = "Action";
                        }
                    }

                    var Obj = {
                        "Ticket_Id": dbTicket.docs[i]['Ticket_code'],
                        "Product": productname,
                        "Category": dbTicket.docs[i]['Category'],
                        "SubCategory": dbTicket.docs[i]['SubCategory'],
                        "Status": dbTicket.docs[i]['Status'],
                        "Created_By": dbTicket.docs[i]['Created_By'],
                        "From": dbTicket.docs[i]['From'],
                        "Mobile_No": dbTicket.docs[i]['Mobile_No'] === undefined ? "" : dbTicket.docs[i]['Mobile_No'],
                        "Vehicle_No": dbTicket.docs[i]['Vehicle_No'] === undefined ? "" : dbTicket.docs[i]['Vehicle_No'],
                        "Remark": dbTicket.docs[i]['Remark'] === undefined ? "" : dbTicket.docs[i]['Remark'],
                        "CRN": dbTicket.docs[i]['CRN'],
                        "Created_On_UI": moment(dbTicket.docs[i]['Created_On']).format("DD/MM/YYYY"),
                        "Created_On": dbTicket.docs[i]['Created_On'],
                        "SubCategory_level2": dbTicket.docs[i]['SubCategory_level2'],
                        "ss_id": dbTicket.docs[i]['ss_id'],
                        "Action_name": Action_name,
                        "Modified_On_UI": moment(dbTicket.docs[i]['Modified_On']).format("DD/MM/YYYY"),
                        "Modified_On": dbTicket.docs[i]['Modified_On'],
                        "UploadFiles": dbTicket.docs[i]['UploadFiles'],
                        "Agent_Email_Id": dbTicket.docs[i]['Agent_Email_Id'],
                        "Ageing": dbTicket.docs[i]['Status'] === "Resolved" ? parseInt((dbTicket.docs[i]['Modified_On'] - dbTicket.docs[i]['Created_On']) / (1000 * 60 * 60 * 24)) : "",
                        "Close_Date": dbTicket.docs[i]['Status'] === "Resolved" ? moment(dbTicket.docs[i]['Modified_On']).format("DD/MM/YYYY") : ""
                    };
                    objResponse.push(Obj);
                }
                dbTicket.docs = objResponse;
                res.json(dbTicket);
            });
        } catch (err) {
            console.log(err);
            return res.send(err.stack);
        }
    });
    app.get('/tickets_updateUserdetails/:from_date/:to_date', function (req, res) {
        var UpdateCount = 0;
        var from_date = req.params.from_date;
        var to_date = req.params.to_date;

        var fromDate = moment(from_date).format("YYYY-MM-D");
        var toDate = moment(to_date).format("YYYY-MM-D");

        var arrFrom = fromDate.split('-');
        var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);

        var arrTo = toDate.split('-');
        var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
        dateTo.setDate(dateTo.getDate() + 1);
        var Condition = {
            "Created_On": {$gte: dateFrom, $lt: dateTo}
        };
        var agg = [
            // Group by the grouping key, but keep the valid values
            {"$group": {
                    "_id": "$Ticket_Id",
                    "docId": {"$last": "$_id"},
                    "Ticket_Id": {"$last": "$Ticket_Id"},
                    "Created_On": {"$last": "$Created_On"},
                    "Status": {"$last": "$Status"},
                    "Modified_By": {"$last": "$Modified_By"},
                    "Remark": {"$last": "$Remark"},
                    "Modified_On": {"$last": "$Modified_On"}

                }},
            {"$match": Condition},
            // Then sort
            {"$sort": {"Modified_On": -1}}
        ];

        var tickets = require('../models/ticket');
        var user_details = require('../models/user_details');
        console.log(agg);
        tickets.aggregate(agg, function (err, dbTicket) {
            if (err) {
                throw err;
            } else {
                console.log(dbTicket);
                for (var i in dbTicket) {
                    var objticket = {
                        "Modified_By": parseInt(dbTicket[i]["Modified_By"]) - 0,
                        "Status": dbTicket[i]['Status'],
                        "Remark": dbTicket[i]['Remark'],
                        "Modified_On": dbTicket[i]['Modified_On']
                    };
                    user_details.update({'Ticket_code': dbTicket[i]["Ticket_Id"]}, {$set: objticket}, function (err, numAffected) {
                        console.log('user_detailsUpdate', err, numAffected);
                        if (numAffected) {
                            UpdateCount++;
                        }
                    });
                }
                res.json({'Status': "success", 'Message': "File Upload Success", "UpdateData": UpdateCount});
                // res.json({"UpdateData" + UpdateCount});
            }
        });
    });
    app.post('/get_variant', function (req, res, next) {
        try {
            var Product_Id_New = req.body['product_id'] - 0;
            var Insurer_ID = req.body['insurer_id'] - 0;
            var Insurer_Vehicle_Model_Name = req.body['model_name'];
            var Insurer_Vehicle_FuelType = req.body['fuel_type'];
            var Insurer_Vehicle_CubicCapacity = req.body['cubic_capacity'];
            var Insurer_Vehicle_Model_Code = req.body['model_code'] ? req.body['model_code'] : '';
            var args = {"Product_Id_New": Product_Id_New, "Insurer_ID": Insurer_ID, "Insurer_Vehicle_Model_Name": Insurer_Vehicle_Model_Name, "Insurer_Vehicle_CubicCapacity": Insurer_Vehicle_CubicCapacity, "Insurer_Vehicle_FuelType": Insurer_Vehicle_FuelType};
            var new_args = {"_id": 0, "Insurer_Vehicle_Code": 1, "Insurer_Vehicle_Variant_Name": 1, "Insurer_Vehicle_Variant_Code": 1, Insurer_Vehicle_CubicCapacity: 1};
            if (Insurer_Vehicle_Model_Code) {
                args['Insurer_Vehicle_Model_Code'] = Insurer_Vehicle_Model_Code;
            }
            if (Insurer_ID == 17) {
                args['Insurer_Vehicle_CubicCapacity'] = args['Insurer_Vehicle_CubicCapacity'] - 0;
            }
            var Vehicles_Insurer = require('../models/vehicles_insurer');
            Vehicles_Insurer.find(args, new_args, function (err, dbData) {
                if (err) {
                    res.json({msg: 'fail', data: ''});
                } else {
                    res.json({msg: 'success', data: dbData});
                }
            });
        } catch (e) {
            res.json({msg: 'fail', data: '', error: e});
        }
    });
    app.post('/ticket/getEndorsementDetails', function (req, res) {
        try
        {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                sort: {'Modified_On': -1}
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            filter["Category"] = req.body.Category;
            filter["Product"] = parseInt(req.body.Product);
            filter["Insurer_Id"] = parseInt(req.body.insurer_id);
//            var days = (req.body.hasOwnProperty('days')) ? req.body.days - 0 : 1;
            const startOfMonth = moment().format('YYYY-MM-DD');
            const currentOfMonth = moment().format('YYYY-MM-DD');
            const startDate = new Date(startOfMonth + "T00:00:00Z");
            const currentDate = new Date(currentOfMonth + "T23:59:59Z");
            filter["Created_On"] = {$gte: startDate, $lt: currentDate};
            var user_details = require('../models/user_details');
            user_details.paginate(filter, optionPaginate).then(function (dbTicket) {
                res.json(dbTicket);
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error', 'Data': err.stack});
        }
    });
    app.post('/ticket/endoUpdateUserDatas', function (req, res) {
        try {
            let userDataRes = "";
            var objRequest = req.body;
            var arg = {
                "PB_CRN": objRequest['crn'] - 0,
                "Last_Status": /.*TRANS_SUCCESS.*/
            };
            var request = objRequest['update_request'];
            User_Data.find(arg, function (err, getData) {
                if (err) {
                    res.json({Status: 'Error', Msg: err.stack});
                } else {
                    if (getData.length > 0) {
                        if (objRequest['update'] === "yes") {
                            if (request.hasOwnProperty('contact_name') && request.contact_name) {
                                var namearray = request['contact_name'].split(" ");
                                console.log('namearray', namearray);
                                request.middle_name = "";
                                for (var i = 2; i < namearray.length; i++) {
                                    request.middle_name = namearray[i - 1];
                                    if (objRequest['product_id'] === "2") {
                                        request.member_1_middle_name = namearray[i - 1];
                                    }
                                }
                                request.first_name = request['contact_name'].split(' ')[0];
                                if (objRequest['product_id'] === "2") {
                                    request.member_1_first_name = request['contact_name'].split(' ')[0];
                                }
                                request.last_name = namearray.length === 1 ? "" : namearray[namearray.length - 1];
                                if (objRequest['product_id'] === "2") {
                                    request.member_1_last_name = namearray.length === 1 ? "" : namearray[namearray.length - 1];
                                }
                            }
                            if (request.permanent_address_1 && request.permanent_address_2 && request.permanent_address_3) {
                                var address = request.permanent_address_1 + ',' + request.permanent_address_2 + ',' + request.permanent_address_3;
                                request['communication_address'] = request.communication_address_1 + ", " + request.communication_address_2 +
                                        ", " + request.communication_address_3 + ", " + getData[0]['_doc']['Erp_Qt_Request_Core']['___communication_city___'] +
                                        ", " + getData[0]['_doc']['Erp_Qt_Request_Core']['___communication_state___'] + ", " + getData[0]['_doc']['Erp_Qt_Request_Core']['___communication_pincode___'];
                                if (objRequest['product_id'] === "2" && getData[0]._doc.hasOwnProperty('Erp_Qt_Request_Core') && getData[0]._doc['Erp_Qt_Request_Core']['___same_as_for_nominee___'] === true) {
                                    request.nominee_address = address;
                                }
                            }
                            if (request.nominee_relation) {
                                request.nominee_relation_text = request.nominee_relation;
                            }
                            if (request.nominee_birth_date) {
                                var nominee_age = moment().diff(request.nominee_birth_date, 'years');
                                request.nominee_age = nominee_age;
                            }
                            if (request.registration_no) {
                                var reg_no = request.registration_no.split('-');
                                request.registration_no_4 = reg_no[3];
                                request.erp_registration_no = reg_no[0] + reg_no[1] + reg_no[2] + reg_no[3];
                            }
                            request.customer_email = request.email;
                            var update_data = {};
                            for (var i in request) {
                                if (i === "variant_name") {
                                    if ((getData[0]['_doc']['Insurer_Id']) === 46) {
                                        var ins_detail = 'edelweiss_data';
                                    }
                                    if ((getData[0]['_doc']['Insurer_Id']) === 17) {
                                        var ins_detail = 'sbigeneral_data';
                                    }
                                    var ins_data = JSON.parse(getData[0]['_doc']['Transaction_Data'][ins_detail]);
                                    ins_data['___dbmaster_insurer_vehicle_variant_name___'] = request[i];
                                    update_data['Transaction_Data.' + ins_detail ] = JSON.stringify(ins_data);
                                    update_data['Processed_Request.___dbmaster_insurer_vehicle_variant_name___'] = request[i];
                                    update_data['Erp_Qt_Request_Core.___pb_variant_name___'] = request[i];
                                } else {
                                    update_data['Erp_Qt_Request_Core.___' + i + '___'] = request[i];
                                }
                            }
                            console.log(update_data);
                            User_Data.update(arg, {$set: update_data}, function (err, numAffected) {
                                console.log('UserDataUpdated', err, numAffected);
                                if (err) {
                                    res.json({Status: 'Error', Msg: err.stack});
                                } else {
                                    userDataRes = getData[0]['_doc'];
                                    var endorsement_ticket_history = require('../models/endorsement_ticket_history');
                                    var endorsement_data = {
                                        "PB_CRN": parseInt(objRequest.crn),
                                        "Insurer_Id": parseInt(objRequest.insurer_id),
                                        "Product_Id": parseInt(objRequest.product_id),
                                        "Endorsement_data": JSON.stringify(objRequest),
                                        "Created_on": new Date(),
                                        "Modified_on": ""
                                    };
                                    console.log(JSON.stringify(objRequest));
                                    let endorsement_ticket_history_log = new endorsement_ticket_history(endorsement_data);
                                    endorsement_ticket_history_log.save(function (err, res1) {
                                        if (err) {
                                            res.json({Status: 'Error', Msg: err.stack});
                                        } else {
                                            if (userDataRes.hasOwnProperty('Pdf_Request') && userDataRes.Pdf_Request) {
                                                var pdf_request = userDataRes['Pdf_Request'];
                                                var args = {
                                                    data: pdf_request,
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        'client_key': userDataRes.Erp_Qt_Request_Core['___client_key___'],
                                                        'secret_key': userDataRes.Erp_Qt_Request_Core['___secret_key___']
                                                    }
                                                };
                                            } else {
                                                var args = {
                                                    data: {
                                                        "search_reference_number": userDataRes.Erp_Qt_Request_Core['___search_reference_number___'],
                                                        "api_reference_number": userDataRes.Verification_Request['api_reference_number'].split('_')[0],
                                                        "policy_number": userDataRes.Transaction_Data.policy_number,
                                                        "transaction_id": userDataRes.Transaction_Data.transaction_id,
                                                        "transaction_amount": userDataRes.Transaction_Data.transaction_amount,
                                                        "pg_reference_number_1": userDataRes.Transaction_Data.pg_reference_number_1,
                                                        "client_key": userDataRes.Erp_Qt_Request_Core['___client_key___'],
                                                        "secret_key": userDataRes.Erp_Qt_Request_Core['___secret_key___'],
                                                        "insurer_id": userDataRes.Erp_Qt_Request_Core['___insurer_id___'],
                                                        "email": request['email'],
                                                        "mobile": request['mobile'],
                                                        "method_type": "Pdf",
                                                        "execution_async": "no"
                                                    },
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        'client_key': userDataRes.Erp_Qt_Request_Core['___client_key___'],
                                                        'secret_key': userDataRes.Erp_Qt_Request_Core['___secret_key___']
                                                    }
                                                };
                                            }
//                                        var ins_name = {
//                                            "46": 'Edelweiss',
//                                            "17": 'SBI'
//                                        };
//                                        var email_arg = {
//                                            "crn": userDataRes.Erp_Qt_Request_Core['___crn___'],
//                                            "contact_name": request['contact_name'],
//                                            "email": request['email'],
//                                            "product_id": userDataRes.Erp_Qt_Request_Core['___product_id___']
//                                        };
                                            var Client = require('node-rest-client').Client;
                                            var client = new Client();
                                            client.post(config.environment.weburl + '/quote/pdf_initiate', args, function (data, response) {
                                                console.log(data);
                                                if (data.hasOwnProperty('Policy')) {
                                                    if (data['Policy']['pdf_status'] === "SUCCESS" && data['Policy']['policy_url'] !== "" && data['Policy']['policy_url'] !== undefined) {
//                                                    try {
                                                        //email process
                                                        /*
                                                         var objEmail = {
                                                         '___crn___': email_arg['crn'],
                                                         '___insurer_name___': ins_name[data['Insurer_Id']],
                                                         '___contact_name___': email_arg['contact_name'],
                                                         '___short_url___': data['Policy']['policy_url']
                                                         };
                                                         var fs = require('fs');
                                                         var email_data = '';
                                                         email_data = fs.readFileSync(appRoot + '/resource/email/Policy_Success.html').toString();
                                                         var objProduct = {
                                                         '1': 'Car',
                                                         '2': 'Health',
                                                         '10': 'TW',
                                                         '12': 'CV'
                                                         };
                                                         var product_short_name = objProduct[email_arg['product_id']];
                                                         var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + product_short_name + '] Successful Transaction for CRN : ' + email_arg['crn'];
                                                         email_data = email_data.replaceJson(objEmail);
                                                         var Email = require('../models/email');
                                                         var objModelEmail = new Email();
                                                         var arr_bcc = [config.environment.notification_email];
                                                         var emailto = email_arg['email'];
                                                         var email_agent = '';
                                                         objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), email_arg['crn'] - 0);
                                                         */
                                                        res.json({'Msg': 'Sucess', 'Data': data});
                                                        //email process end
//                                                    } catch (e) {
//                                                        console.error('Exception', 'Success Email', e);
//                                                    }
                                                    } else {
                                                        res.json({'Msg': 'Fail'});
                                                    }
                                                } else {
                                                    res.json({'Msg': 'Fail'});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            var data = getData[0]['_doc']['Erp_Qt_Request_Core'];
                            var qtdata = {};
                            var erpqt_data = {
                                "salutation": "",
                                "contact_name": "",
                                "first_name": "",
                                "middle_name": "",
                                "last_name": "",
                                "birth_date": "",
                                "email": "",
                                "mobile": "",
                                "permanent_address_1": "",
                                "permanent_address_2": "",
                                "permanent_address_3": "",
                                "is_reg_addr_comm_addr_same": "",
                                "communication_address_1": "",
                                "communication_address_2": "",
                                "communication_address_3": "",
                                "nominee_name": "",
                                "nominee_relation": "",
                                "nominee_birth_date": "",
                                "registration_no": "",
                                "registration_no_1": "",
                                "registration_no_2": "",
                                "registration_no_3": "",
                                "registration_no_4": "",
                                "engine_number": "",
                                "chassis_number": "",
                                "is_financed": "",
                                "financial_agreement_type": "",
                                "financial_institute_name": "",
                                "financial_institute_code": "",
                                "financial_institute_city": ""
                            };
                            for (var k in erpqt_data) {
                                qtdata['___' + k + '___'] = data['___' + k + '___'];
                            }
                            if ((getData[0]['_doc']['Insurer_Id']) === 46) {
                                var ins_detail = 'edelweiss_data';
                            }
                            if ((getData[0]['_doc']['Insurer_Id']) === 17) {
                                var ins_detail = 'sbigeneral_data';
                            }
                            if ((getData[0]['_doc']).hasOwnProperty('Transaction_Data') && (getData[0]['_doc'])['Transaction_Data'] && (getData[0]['_doc'])['Transaction_Data'].hasOwnProperty(ins_detail)) {
                                var insurer_data = JSON.parse((getData[0]['_doc'])['Transaction_Data'][ins_detail]);
                                console.log('log');
                                for (var j in insurer_data) {
                                    if ((j.toString()).includes("___dbmaster_insurer_vehicle"))
                                        qtdata[j] = insurer_data[j];
                                }

                            }
                            res.json(qtdata);
                        }
                    } else {
                        res.json({'msg': 'No data found'});
                    }
                }
            });
        } catch (err) {
            console.log(err);
            res.json({Status: 'Error', Msg: err.stack});
        }
    });
    app.post('/tickets/update_uploaded_file', LoadSession1, function (req, res, next) {
        try {
            let fields = req.fields;
            let files = req.files;
            let objRequest;
            objRequest = fields;
            if (objRequest && objRequest.session_id) {
                let Ticket_Id = objRequest["Ticket_Id"];
                let ticketDir = path.join(appRoot, "/tmp/ticketing/", Ticket_Id + "/Resolver");
                if (files && Object.keys(files).length !== 0) {
                    if (!fs.existsSync(ticketDir)) {
                        return res.status(404).send(`${ticketDir} - path does not exist`);
                    } else {
                        let file_name = "";
                        for (let i in files) {
                            file_name = i + "." + files[i].name.split('.')[files[i].name.split('.').length - 1];
                            let oldpath = files[i].path;
                            let pdf_sys_loc_horizon = appRoot + "/tmp/ticketing/" + Ticket_Id + "/Resolver/" + file_name;
                            let pdf_web_path_horizon = config.environment.downloadurl + "/ticketing/" + Ticket_Id + "/" + file_name;
                            let readFileData = fs.readFileSync(oldpath);
                            let writeFileData = fs.writeFile(pdf_sys_loc_horizon, readFileData);
                            let deletedFileData = fs.unlink(oldpath);
                            sleep(500);
                        }
                        res.send('File Uploaded Successfully.');
                    }
                } else {
                    return res.send("No Files to Upload.");
                }
            } else {
                return res.status(401).send(`Not Authorized.`);
            }
        } catch (err) {
            return res.send(err.stack);
        }
    });
    app.get('/tickets/my_tickets_in_excel', LoadSession, function (req, res) {
        try {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                try {
                    if (err)
                        throw err;
                    let user_details = db.collection('user_details');
                    let objRequestCore = {};
                    if (req.query && req.query !== {}) {
                        for (let k in req.query) {
                            objRequestCore[k] = req.query[k];
                        }
                    }
                    var productList = {
                        '1': 'CAR',
                        '2': 'HEALTH',
                        '4': 'TRAVEL',
                        '3': 'TERM',
                        '10': 'BIKE',
                        '12': 'CV'
                    };
                    let filter = {};
                    let ss_id = (objRequestCore["ss_id"] && objRequestCore["ss_id"] - 0) || 0;
                    if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
                    } else if ([118288, 12756, 17026, 8054, 7960, 125929, 127258, 8067].indexOf(req.obj_session.user.ss_id) > -1) {
                    } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                        let arr_ch_ssid = [];
                        if (req.obj_session.hasOwnProperty('users_assigned')) {
                            arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                        }
                        arr_ch_ssid.push(req.obj_session.user.ss_id);
                        channel = req.obj_session.user.role_detail.channel;
                        filter['$or'] = [
                            {'channel': channel},
                            {'ss_id': {$in: arr_ch_ssid}}
                        ];
                    } else {
                        if ([7814].indexOf(req.obj_session.user.ss_id) > -1 && objRequestCore["role_type"] === "mytickets") {

                        } else {
                            let arr_ssid = [];
                            if (req.obj_session.hasOwnProperty('users_assigned')) {
                                var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                                arr_ssid = combine_arr.split(',').filter(Number).map(Number);

                            }
                            arr_ssid.push(req.obj_session.user.ss_id);
                            //filter['ss_id'] = {$in: arr_ssid};
                            filter['$or'] = [
                                {'lead_assigned_ssid': {$in: arr_ssid}},
                                {'ss_id': {$in: arr_ssid}}
                            ];
                        }
                    }
            let objResponse = [];
            let mysort = "";
            let roleType = objRequestCore["role_type"];
            if (objRequestCore["Category"] !== "") {
                objCategory = objRequestCore["Category"].split(',');
            }
            ss_id = objRequestCore["ss_id"] - 0;

            var today = moment().utcOffset("+05:30").startOf('Day');
            var fromDate = moment(objRequestCore["from_date"] === "" ? today : objRequestCore["from_date"]).format("YYYY-MM-D");
            var toDate = moment(objRequestCore["to_date"] === "" ? today : objRequestCore["to_date"]).format("YYYY-MM-D");

            var arrFrom = fromDate.split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);

            var arrTo = toDate.split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);

            console.log('DateRange', 'from', dateFrom, 'to', dateTo);

            if (objRequestCore["search_by"] !== "CurrentDate") {
                if (objRequestCore["search_by"] === "ticketid") {
                    //filter["Ticket_Id"] = objRequest["search_byvalue"];
                    filter["Ticket_code"] = new RegExp(objRequestCore["search_byvalue"], 'i');
                } else if (objRequestCore["search_by"] === "CRN") {
                    //filter["CRN"] = parseInt(objRequest["search_byvalue"]);
                    filter = {"$or": [{"CRN": (objRequestCore["search_byvalue"]).toString()}, {"CRN": parseInt(objRequestCore["search_byvalue"])}]};
                } else if (objRequestCore["search_by"] === "Source") {
                filter["Source"] = new RegExp(objRequestCore["search_byvalue"], 'i');
                if(objRequestCore["search_byvalue"].includes('auto')){
                    filter["Status"] = "Open";
                }
            }else if (objRequestCore["search_by"] === "Category") {
                filter["Category"] = new RegExp(objRequestCore["search_byvalue"], 'i');
            }else if (objRequestCore["search_by"] === "Insurer_Name") {
                filter = {"Insurer_Id":objRequestCore["search_byvalue"] - 0};
            }else {
                    if (roleType === "tickets") {
                    } else {
                        filter["Category"] = {$in: objCategory};
//                        filter["Modified_On"] = {$gte: dateFrom, $lt: dateTo};
                    }
                    if (objRequestCore["status"] !== "") {
                        filter["Status"] = objRequestCore["status"];
                    }
                }
                mysort = {Modified_On: -1};
            } else {
                if (roleType === "tickets") {
                    filter["Created_On"] = {$gte: dateFrom, $lt: dateTo};
                } else {
                    filter["Category"] = {$in: objCategory};
                    filter["Modified_On"] = {$gte: dateFrom, $lt: dateTo};
                }
                if (objRequestCore["status"] !== "") {
                    filter["Status"] = objRequestCore["status"];
                }
            }
                    user_details.find(filter).sort({"Created_On": -1}).toArray(function (err, dbUserDataTickets) {
                        try {
                            if (err) {
                                res.send(err);
                            } else {
                                var excel = require('excel4node');
                                var workbook = new excel.Workbook();
                                var worksheet = workbook.addWorksheet('Sheet1');
                                var ff_file_name = "My_Tickets_List.xlsx";
                                var ff_loc_path_portal = appRoot + "/tmp/my_tickets_list_excel/" + ss_id + "/" + ff_file_name;
                                if (!fs.existsSync(appRoot + "/tmp/my_tickets_list_excel")) {
                                    fs.mkdirSync(appRoot + "/tmp/my_tickets_list_excel");
                                }
                                if (!fs.existsSync(appRoot + "/tmp/my_tickets_list_excel/" + ss_id)) {
                                    fs.mkdirSync(appRoot + "/tmp/my_tickets_list_excel/" + ss_id);
                                }
                                if (fs.existsSync(appRoot + "/tmp/my_tickets_list_excel/" + ss_id + "/" + ff_file_name)) {
                                    fs.unlinkSync(appRoot + "/tmp/my_tickets_list_excel/" + ss_id + "/" + ff_file_name);
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
                                var tickets_columns = [
                                    "Ticket_Id",
                                    "CRN",
                                    "Channel",
                                    "SubChannel",
                                    "Category",
                                    "SubCategory",
                                    "Product",
                                    "Insurer_Name",
                                    "Source",
                                    "Status",
                                    "Email_Id",
                                    "Ageing",
                                    "Close_Date",
                                    "Remark",
                                    "Created_By",
                                    "Created_On",
                                    "Modified_On"
                                ];
                                if (parseInt(dbUserDataTickets.length) > 0) {
                                    //row 1
                                    for (let i = 0; i < tickets_columns.length; i++) {
                                        worksheet.cell(1, i + 1).string(tickets_columns[i]).style(styleh);
                                    }
                                    //row 2
                                    for (var rowcount in dbUserDataTickets) {
                                        try {
                                            TicketData = dbUserDataTickets[rowcount];
                                            rowcount = parseInt(rowcount);
                                            for (let j = 0; j < tickets_columns.length; j++) {
                                                let curr_node = tickets_columns[j];
                                                console.log(curr_node);
                                                if (TicketData.hasOwnProperty("Ticket_code") && curr_node === 'Ticket_Id') {
                                                    worksheet.cell(rowcount + 2, j + 1).string(TicketData["Ticket_code"] ? (TicketData["Ticket_code"]).toString() : "NA");
                                                } else if (TicketData.hasOwnProperty("Insurer_Id") && curr_node === 'Insurer_Name') {
                                                    worksheet.cell(rowcount + 2, j + 1).string(TicketData["Insurer_Id"] ? (const_arr_insurer["Insurer_" + TicketData["Insurer_Id"]]).toString().toUpperCase() : "NA");
                                                } else if (TicketData.hasOwnProperty("Product") && curr_node === 'Product') {
                                                    worksheet.cell(rowcount + 2, j + 1).string(TicketData["Product"] ? (productList[TicketData["Product"]]).toString() : "NA");
                                                } else {
                                                    worksheet.cell(rowcount + 2, j + 1).string(TicketData.hasOwnProperty(curr_node) && TicketData[curr_node] ? (TicketData[curr_node]).toString() : "NA");
                                                }
                                            }
                                        } catch (e) {
                                            res.json({'msg': 'error-' + e.message});
                                        }
                                    }
                                    workbook.write(ff_loc_path_portal, function (err, stats) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            res.json({"Status": "Success", "Msg": config.environment.downloadurl + "/tickets/mytickets_list_excel/" + ss_id + "/" + ff_file_name, 'Filter': filter});
                                        }
                                    });
                                } else {
                                    for (let i = 0; i < tickets_columns.length; i++) {
                                        worksheet.cell(1, i + 1).string(tickets_columns[i]).style(styleh);
                                    }
                                    workbook.write(ff_loc_path_portal, function (err, stats) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            res.json({"Status": "Success", "Msg": config.environment.downloadurl + "/tickets/mytickets_list_excel/" + ss_id + "/" + ff_file_name, 'Filter': filter});
                                        }
                                    });
                                }
                            }
                            db.close();
                        } catch (e) {
                            console.error("Error - /my_tickets/tickets_in_excel", e.stack);
                            res.json({"Status": "Fail", "Msg": e.stack});
                        }
                    });
                } catch (e) {
                    console.error("Error - /my_tickets/tickets_in_excel", e.stack);
                    res.json({"Status": "Fail", "Msg": e.stack});
                }
            });
        } catch (e) {
            console.error("Error - /my_tickets/tickets_in_excel", e.stack);
            res.json({"Status": "Fail", "Msg": e.stack});
        }
    });
    app.get('/tickets/mytickets_list_excel/:ssid/:filename', function (req, res) {
        try {
            let ssid = req.params.ssid;
            let filename = req.params.filename;
            if (ssid && filename && ssid !== "" && filename !== "") {
                res.download(appRoot + '/tmp/my_tickets_list_excel/' + ssid + '/' + filename);
            } else {
                res.json({"Status": "Fail", "Msg": "SsId or Filename is missing"});
            }

        } catch (e) {
            console.error("Error - /tickets/mytickets_list_excel/", e.stack);
            res.json({"Status": "Fail", "Msg": e.stack});
        }
    });
};
function move(oldPath, ticketid, newname, doc_prefix, cb) {
    ensureExists(store_path + "/" + ticketid, 0777, function (err) {
        if (err) // handle folder creation error
            cb(err);
        else // we're all good
        {
            console.error("oldPath " + oldPath);
            getNewName(oldPath, newname, ticketid, doc_prefix, function (newFilePath) {
                fs.rename(oldPath, newFilePath, (err) => {
                    if (err)
                        cb(err);
                    //console.log('Rename complete!');
                    cb();
                });
                return newFilePath;
            });

        }
    });
//    getNewName(oldPath, newname, ticketid, function (newFilePath) {
//        fs.rename(oldPath, newFilePath, (err) => {
//            if (err)
//                cb(err);
//            //console.log('Rename complete!');
//            cb();
//        });
//    });


}

function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(path, mask, function (err) {
        if (err) {
            if (err.code == 'EEXIST')
                cb(null); // ignore the error if the folder already exists
            else
                cb(err); // something else went wrong
        } else
            cb(null); // successfully created folder
    });
}


function getNewName(oldPath, newname, ticketid, doc_prefix, cb) {
    var extension = oldPath.split(".");
    var filename = newname + '.' + extension[extension.length - 1];
    var newFilePath = store_path + "/" + ticketid + '/' + doc_prefix + filename;
    console.error("newFilePath " + newFilePath);
    cb(newFilePath);
}

function LoadSession(req, res, next) {
    try {
        var objRequestCore = req.body;
        if (req.method == "GET") {
            objRequestCore = req.query;
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
            } else if (posp_sources === 3) {
                if (user['Premium_Request'].hasOwnProperty('posp_erp_id') && (user['Premium_Request']['posp_erp_id'] - 0) > 0) { //posp_erp_id
                    client_key_val = 'ND-POSP';
                } else if (ss_id === 5) {
                    client_key_val = 'ND-FBA';
                } else {
                    client_key_val = 'ND-NON-POSP';
                }
            } else {
                if (user['Premium_Request']['posp_category'] === 'FOS') {
                    client_key_val = 'SM-FOS';
                } else if (user['Premium_Request']['posp_category'] === 'GS-FOS') {
                    client_key_val = 'GS-FOS';
                } else if (user['Premium_Request']['posp_category'] === 'RBS') {
                    client_key_val = 'RBS';
                } else {
                    client_key_val = 'PB-SS';
                }
            }
        } else if (user['Premium_Request']['user_source'] === 'tars') {
            client_key_val = 'BOT';
        }
    } catch (e) {
        console.error(e.stack);
    }
    return client_key_val;
}

function get_channel(channel) {
    var channel_key = "";
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

    channel_key = objSwitchUserType[channel];
    for (var i in objSwitchUserType) {
        for (var k in objSwitchUserType[i])
        {
            if (objSwitchUserType[i][k] === channel) {
                channel_key = i;
            }
        }

    }
    return channel_key;

}

function LoadSession1(req, res, next) {

    try {

        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var objRequestCore = fields;
            var objRequestCoreFiles = files;
            if (req.method == "GET") {
                objRequestCore = req.query;
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
                            req.fields = objRequestCore;
                            req.files = objRequestCoreFiles;
                            return next();
                        } else {
                            return res.status(401).json({'Msg': 'Session Expired.Not Authorized'});
                        }
                    }
                });
            } else {
                return next();
            }
        });
    } catch (e) {
        console.error('Exception', 'LoadSession', e.stack);
        return next();

    }
}

function movefilelocation(objfiles, NewTicket_Id, doc_prefix) {
    var objfile = {
        "file_1": null,
        "file_2": null,
        "file_3": null,
        "file_4": null};
    var objdata = {'UploadFiles': objfile};

    for (var i in objfiles) {
        if (i === "0") {
            doc_prefix = doc_prefix !== "" && doc_prefix !== undefined ? doc_prefix + "_" : "";
        }
        var source = objfiles[i]['path'];
        var DocName = objfiles[i]['originalFilename'].split('.')[0];
        var a = parseInt(i) + 1;
        DocName = DocName.split('.')[0].replace(DocName, NewTicket_Id + "_" + "file_" + a); // Added for document path
        var extension = source.split(".");
        console.error("source  " + source);
        console.error("DocName  " + DocName);
        var pdf_web_path_horizon = config.environment.downloadurl + "/ticketing/" + NewTicket_Id + '/' + doc_prefix + DocName + "." + extension[extension.length - 1];
        console.error("pdf_web_path_horizon  " + pdf_web_path_horizon);
        move(source, NewTicket_Id, DocName, doc_prefix, function (err) {

        });
        objdata.UploadFiles["file_" + a] = pdf_web_path_horizon;
    }

    console.log(objdata);
    var tickets = require('../models/ticket');
    tickets.update({'Ticket_Id': NewTicket_Id}, {$set: {"UploadFiles": objdata['UploadFiles']}}, function (err, numAffected) {
        console.log('TicketUpdated', err, numAffected);
        if (err) {
            objdata['Msg'] = err;
        } else {
            objdata['Msg'] = numAffected;
        }
    });

}

function sendmail(dbticket, Is_Customer = false) {
    var Email = require('../models/email');
    var objModelEmail = new Email();
    var environment = config.environment.name === 'Production' ? "" : "QA-";
    var productName = {
        1: "CAR",
        2: "HEALTH",
        10: "BIKE",
        12: "CV"
    };
    if (dbticket["CRN"] !== "" || dbticket["CRN"] !== null || dbticket["CRN"] !== undefined) {
        var subject = "[TICKET] " + dbticket['Ticket_code'] + " - " + dbticket["CRN"] + " " + environment + productName[dbticket["Product"]] + '-' + dbticket["Category"] + '-' + dbticket["SubCategory"];
    } else {
        var subject = "[TICKET] " + dbticket['Ticket_code'] + " " + environment + productName[dbticket["Product"]] + '-' + dbticket["Category"] + '-' + dbticket["SubCategory"];
    }

    var rm_emailid = dbticket !== null ? dbticket["RM_Email_Id"] : "";
    var cc = '';
    cc += rm_emailid !== "" ? ";" + rm_emailid : '';
    var mail_content = '<html><body>' +
            'Ticket is created.' +
            '<p></p>Ticket No - ' + dbticket['Ticket_code'] +
            '<p></p>CRN  - ' + dbticket["CRN"] +
            '<p></p>Status  - ' + dbticket["Status"] +
            '<p></p>Product  - ' + productName[dbticket["Product"]] +
            '<p></p>Remarks  - ' + dbticket["Remark"] +
            '<p></p>You will be notified once ticket is resolved.' +
            '<p></p>You can check ticket status in my ticket section.' +
            '</body></html>';
    var email_id;
    if (Is_Customer) {
        email_id = dbticket["Agent_Email_Id"];
    } else {
        email_id = dbticket['Agent_Email_Id'];
    }
    if (emailtocc.hasOwnProperty(dbticket["Category"])) {

        if (emailtocc[dbticket["Category"]][0]["to"] !== "")
        {
            email_id += "," + emailtocc[dbticket["Category"]][0]["to"];
        }
        if (emailtocc[dbticket["Category"]][0]["cc"] !== "")
        {
            cc += rm_emailid !== "" ? "," + rm_emailid : '' + emailtocc[dbticket["Category"]][0]["cc"];
        }
    }
    if (email_id !== null || email_id !== undefined) {
        objModelEmail.send('noreply@policyboss.com', email_id, subject, mail_content, cc, config.environment.notification_email, dbticket["CRN"]);
    }
}

function htmlEscape(remark) {
    var text = remark;
	let testData = "";
	try {
		if (text) {
			testData = text.replace(/&/g, '&amp;').
			replace(/</g, '&lt;').// it's not neccessary to escape >
			replace(/"/g, '&quot;').
			replace(/'/g, '&#039;');
		}
		return testData;
	} catch (e) {
		console.error('htmlEscape', e.stack);
		return testData;
	}
}
function validateSession(req, res, next) {
    try {
        var objRequestCore = req.body;
        if (req.method === "GET") {
            objRequestCore = req.query;
        }
        objRequestCore = JSON.parse(JSON.stringify(objRequestCore));
        if (objRequestCore.hasOwnProperty('session_id') && objRequestCore['session_id'] !== '') {
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
            return res.status(401).json({'Msg': 'ACCESS DENIED'});
        }
    } catch (e) {
        console.error('Exception', 'validateSession', e);
        return next();

    }
}