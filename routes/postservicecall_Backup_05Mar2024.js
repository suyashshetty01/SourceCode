var express = require('express');
var config = require('config');
//var bitly_access_token = config.environment.arr_bitly_access_token[Math.floor(Math.random() * config.environment.arr_bitly_access_token.length)];
var geoip = require('geoip-lite');
var sleep = require('system-sleep');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
const objMongoDB = null;
var path = require('path');
const bodyParser = require('body-parser');
var appRoot = path.dirname(path.dirname(require.main.filename));
var sess;
var Users = [];
var Sync_Contact = require('../models/sync_contact');
let obj_RsaData;
var autoIncrement = require("mongodb-autoincrement");
var post_sale = ["Policy not received", "Post Sale Query", "Endorsement", "Claim Related", "Received policy copy, CRN is not marked as sell", "Done payment but not received policy copy"];
var Base = require('../libs/Base');
var fs = require('fs');
var router = express.Router();
var https = require('https');
var corp_lead = require('../models/corporate_lead');
var formidable = require('formidable');
var form = new formidable.IncomingForm();
var User_Data = require('../models/user_data');
var ObjectID = require('mongodb').ObjectID;
var kyc_detail = require('../models/kyc_detail');
var kyc_history = require('../models/kyc_history');
var Client = require('node-rest-client').Client;
var client = new Client();
var XLSX = require('excel4node');
const  multipart = require('connect-multiparty');
const  multipartMiddleware1 = multipart({uploadDir: './tmp/kyc_documents'});
let zoop_api_key = "4RNA4S6-XWKM659-G7BR4MY-SHHTHHR";
let zoop_api_appid = "61d8162ba81661001db34ab9";
//let zoop_api_key = "9SAEK1C-DDTM8AV-PYPQY55-WDHK7RV";
//let zoop_api_appid = "6188a4b66a9887001d8df630";
let zoop_doc_args = {
    data: {},
    headers: {
        'Content-Type': 'application/json',
        "api-key": zoop_api_key,
        "app-id": zoop_api_appid
    }
};
router.post('/signuptest', function (req, res) {
    if (!req.body.id || !req.body.password) {
        res.status("400");
        res.send("Invalid details!");
    } else {
        Users.filter(function (user) {
            if (user.id === req.body.id) {
                res.render('signup', {
                    message: "User Already Exists! Login or choose another user id"});
            }
        });
        var newUser = {id: req.body.id, password: req.body.password};
        Users.push(newUser);
        req.session.user = newUser;
        res.send(req.session.user);
    }
});
router.post('/empdata/upload_emp_data', function (req, res, next) {
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
    let file_excel = fileName;
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

router.post('/save_lead_tele_support', function (req, res) {
    try {
        var objRequest = req.body;
        var lead_tele_support = require('../models/lead_tele_support');

        var objlead_tele_support = new lead_tele_support();
        for (var key in req.body) {
            objlead_tele_support[key] = req.body[key];
        }
        objlead_tele_support.Created_On = new Date();
        objlead_tele_support.Modified_On = new Date();
        objlead_tele_support.save(function (err1) {
            if (err1) {
                res.json({'Msg': '', Status: 'Fail'});
            } else {
                res.json({'Msg': 'Saved Succesfully!!!', Status: 'Success'});
            }
        });


    } catch (errex) {
        res.json({'Msg': 'error', Error_Msg: errex.stack, Status: 'Fail'});
    }
});

router.post('/online_agreement', function (req, res) {
    var online_agreement = require('../models/sync_contact_agreement');
    var objonline_agreement = new online_agreement();
    for (var key in req.body) {
        objonline_agreement[key] = req.body[key];
    }
    objonline_agreement.Created_On = new Date();
    objonline_agreement.Modified_On = new Date();
    objonline_agreement.save(function (err1) {
        if (err1) {
            res.json({'Status': "Failure"});
        } else {
            res.json({'Status': "Success"});
        }
    });
});


router.post('/lead_allocation', function (req, res) {
    var lead_allocation = require('../models/lead_allocation');
    //var objdata = new lead_allocation();
    var ObjRequest = req.body.request_json;

    var objArray = [];
    try {
        //for (var i in  ObjRequest) {
        var objdata = {};
        //for (var key in ObjRequest[i]) {
        for (var key in ObjRequest) {
            if (key === "Lead_Id" || key === "Caller_Id") {
                objdata[key] = parseInt(ObjRequest[key]);
            } else {
                objdata[key] = ObjRequest[key];
            }

        }
        objdata.Created_On = new Date();
        objdata.Modified_On = new Date();
        //objArray.push(objdata);
        var objModel = new lead_allocation(objdata);
        objModel.save(function (err, objDbUserData) {
            if (err) {
                res.json({'Status': "Failure"});
            } else {
                res.json({'Status': "Success"});
            }
        });
        //}
    } catch (e) {
        res.json({'Status': "Failure", 'Error': e});
    }
});
router.post('/lead_disposition_save', LoadSession, function (req, res) {
    var lead_disposition = require('../models/lead_disposition');

    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    var fs = require('fs');
    form.parse(req, function (err, fields, files) {
        console.log(fields);
        var pdf_web_path = "";
        if (files.hasOwnProperty('disposition_file')) {

            var pdf_file_name = files['disposition_file'].name;
            var path = appRoot + "/tmp/disposition/";
            var pdf_sys_loc_horizon = path + fields["lead_id"] + '/' + pdf_file_name;
            pdf_web_path = config.environment.downloadurl + "/disposition/" + fields["lead_id"] + '/' + pdf_file_name;
            var oldpath = files.disposition_file.path;
            if (fs.existsSync(path + fields["lead_id"]))
            {

            } else
            {
                fs.mkdirSync(path + fields["lead_id"]);
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
        var arg = {
            Lead_Id: fields["lead_id"],
            Status: fields["dsp_status"],
            Sub_Status: fields["dsp_substatus"],
            Created_On: new Date(),
            Modified_On: new Date(),
            Remark: fields["dsp_remarks"],
            ss_id: req.obj_session.user.ss_id,
            Is_Latest: 1,
            fba_id: req.obj_session.user.fba_id,
            File_Name: pdf_web_path,
            Lead_Status: fields["Lead_Status"],
            Customer_Name: fields["Customer_Name"],
            Customer_Mobile: fields["Customer_Mobile"],
            Policy_Expiry_Date: fields["Policy_expiry_date"],
            Next_Call_Date: fields["Next_Call_Date"]
        };
        var dispositionObj = new lead_disposition(arg);
        dispositionObj.save(function (err) {
            if (err)
                throw err;

            console.log('File uploaded and moved!');
            res.json({'Msg': 'Success'});
        });
    });

});
router.get('/get_lead_disposition_data/:lead_id', function (req, res) {
    try {
        var lead_id = parseInt(req.params.lead_id);
        var lead_disposition = require('../models/lead_disposition');

        lead_disposition.find({"Lead_Id": lead_id}, function (err, dblead) {
            if (err) {
                res.json(err);
            } else {
                res.json(dblead);
            }
        });

    } catch (e) {
    }
});
router.get('/get_lead_disposition_data/:lead_id', function (req, res) {
    try {
        var lead_id = parseInt(req.params.lead_id);
        var lead_disposition = require('../models/lead_disposition');

        lead_disposition.find({"Lead_Id": lead_id}, function (err, dblead) {
            if (err) {
                res.json(err);
            } else {
                res.json(dblead);
            }
        });

    } catch (e) {
    }
});
router.get('/get_lead_allocation/:udid', function (req, res) {
    try {
        var caller_id = parseInt(req.params.udid);
        var lead_allocations = require('../models/lead_allocation');

        lead_allocations.find({"Caller_Id": caller_id}, function (err, dblead) {
            if (err) {
                res.json(err);
            } else {
                res.json(dblead);
            }
        });

    } catch (e) {

    }


});
router.post('/get_lead_data', LoadSession, function (req, res, next) {
    try {

        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: 'Lead_Id Customer_Name Product_Id mobile policy_expiry_date Created_On Make_Name Model_Name Variant_Name VehicleCity_RTOCode lead_type',
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

        var ObjRequest = req.body;

        filter["ss_id"] = ObjRequest.ss_id - 0;
        filter["fba_id"] = ObjRequest.fba_id - 0;

        var fromDate = ObjRequest["from_date"] !== undefined ? ObjRequest["from_date"] : "";
        var toDate = ObjRequest["to_date"] !== undefined ? ObjRequest["to_date"] : "";

        if (ObjRequest.lead_type !== "" && ObjRequest.lead_type !== undefined) {
            filter["lead_type"] = ObjRequest.lead_type;
        }
        if (ObjRequest.name !== "" && ObjRequest.name !== undefined) {
            filter["Customer_Name"] = "/" + req.body.name + "/";
        }
        if (ObjRequest.mobile !== "" && ObjRequest.mobile !== undefined) {
            filter["mobile"] = req.body.mobile;
        }
        if (fromDate !== "" && toDate !== "") {
            filter["policy_expiry_date"] = {$gte: fromDate, $lt: toDate};

        }
        var lead = require('../models/leads');
        console.error('HorizonLeadList', filter, req.body);
        lead.paginate(filter, optionPaginate).then(function (user_datas) {
            res.json(user_datas);
        });
    } catch (e) {
        console.log(e);
        res.json({'Msg': 'error', 'Status': 'fail'});
    }
});

router.get('/create_lead_request/:lead_id', function (req, res, next) {
    var lead_id = parseInt(req.params.lead_id);
    var moment = require('moment');
    try {
        if (lead_id) {
            var lead = require('../models/leads');
            lead.findOne({Lead_Id: lead_id}).exec(function (err, dblead) {
                console.log(dblead);
                var ObjLead = dblead._doc;
                var data1 = {
                    "product_id": ObjLead.Product_Id,
                    "vehicle_id": ObjLead.Vehicle_ID,
                    "rto_id": ObjLead.VehicleCity_Id,
                    "vehicle_insurance_type": ObjLead.vehicle_insurance_type === "R" ? "renew" : "new",
                    "vehicle_manf_date": ObjLead.vehicle_manf_date,
                    "vehicle_registration_date": ObjLead.vehicle_registration_date,
                    "policy_expiry_date": ObjLead.policy_expiry_date,
                    "prev_insurer_id": ObjLead.prev_insurer_id,
                    "vehicle_registration_type": "individual",
                    "vehicle_ncb_current": ObjLead.vehicle_ncb_current,
                    "is_claim_exists": ObjLead.is_claim_exists,
                    "method_type": "Premium",
                    "execution_async": "yes",
                    "electrical_accessory": 0,
                    "non_electrical_accessory": 0,
                    "registration_no": ObjLead.registration_no,
                    "is_llpd": "no",
                    "is_antitheft_fit": "no",
                    "voluntary_deductible": 0,
                    "is_external_bifuel": 0,
                    "is_aai_member": "no",
                    "external_bifuel_type": "no",
                    "external_bifuel_value": 0,
                    "pa_owner_driver_si": "1500000",
                    "is_having_valid_dl": "no",
                    "is_pa_od": "yes",
                    "is_opted_standalone_cpa": "yes",
                    "pa_named_passenger_si": 0,
                    "pa_unnamed_passenger_si": 0,
                    "pa_paid_driver_si": 0,
                    "vehicle_expected_idv": 0,
                    "vehicle_insurance_subtype": "1CH_0TP",
                    "first_name": ObjLead.Customer_Name.split(' ')[0],
                    "middle_name": ObjLead.Customer_Name.split(' ').length > 2 ? ObjLead.Customer_Name.split(' ')[1] : "",
                    "last_name": ObjLead.Customer_Name.split(' ').length === 3 ? ObjLead.Customer_Name.split(' ')[2] : ObjLead.Customer_Name.split(' ')[1],
                    "email": "",
                    "mobile": ObjLead.mobile,
                    "crn": "",
                    "ss_id": ObjLead.ss_id,
                    "fba_id": ObjLead.fba_id,
                    "geo_lat": 0,
                    "geo_long": 0,
                    "agent_source": "",
                    "ip_address": "",
                    "app_version": "",
                    "mac_address": "",
                    "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                    "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                    "is_financed": "no",
                    "is_oslc": "no",
                    "oslc_si": 0,
                    "is_inspection_done": "no"
                };
                if (ObjLead.vehicle_insurance_type === "R") {
                    var expiry_date = ObjLead.policy_expiry_date.split('-');
                    // var expiry_date_new = expiry_date[2] + "-" + expiry_date[1] + "-" + expiry_date[0];
                    var selectedDate = new Date(expiry_date);
                    var now = new Date();
                    now.setHours(0);
                    now.setMinutes(0);
                    now.setSeconds(0, 0);
                    if (selectedDate < now) {
                        data1["is_breakin"] = "yes";
                    } else {
                        data1["is_breakin"] = "no";
                    }
                    data1[ "is_policy_exist"] = "yes";
                } else {
                    data1["is_breakin"] = "no";
                    data1[ "is_policy_exist"] = "no";
                }
                var args = {
                    data: data1,
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                var url_api = config.environment.weburl + '/quote/premium_initiate';
                var Client = require('node-rest-client').Client;
                var client = new Client();
                client.post(url_api, args, function (data, response) {
                    console.log(data);
                    res.json(data);
                });

            });
        }
    } catch (e) {
        console.log(e);
        res.json({'Msg': 'error', 'Status': 'fail'});
    }
});
router.post('/raiseticket', function (req, res, next) {
    try {
        var objRequest = req.body;
        var product_id = 0;
        var path = appRoot + "/tmp/ticketing/";
        var Ticket_id = objRequest["Ticket_Id"];
        var isticket_created;
        var Is_Customer = objRequest['Is_Customer'] === undefined ? false : objRequest['Is_Customer'];
        console.log(objRequest);
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
                                        RM_Email_Id: dbticket !== null ? dbticket["RM_Email_Id"] : objRequest["rm_email_id"]

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
                                                    "Modified_By": agentdetails.Emp_Id
                                                },
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            };

                                            var url_api = config.environment.weburl + '/tickets/user_details';
                                            var Client = require('node-rest-client').Client;
                                            var client = new Client();
                                            // client.post(url_api, userdetails, function (data, response) {
                                            // if (data.Status === "error") {
                                            //  throw err;
                                            //} else {
                                            //console.log(response);
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
                                            cc += rm_emailid !== "" ? ";" + rm_emailid : '';
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
                                            if (objRequest["Category"] === "Quotation") {
                                                email_id += ";quotesupport@policyboss.com";
                                            }
                                            if (post_sale.indexOf(objRequest["Category"]) >= 0) {
                                                if (agentdetails.Email_Id !== "rohit.rajput@policyboss.com") {
                                                    email_id += ";rohit.rajput@policyboss.com";
                                                }

                                                cc += ";susanna.lobo@landmarkinsurance.in";
                                            }
                                            if (email_id !== null || email_id !== undefined) {
                                                objModelEmail.send('noreply@policyboss.com', email_id, subject, mail_content, cc, config.environment.notification_email, objRequest["CRN"]);
                                            }

                                            if (Ticket_id === "") {
                                                res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is created.', 'Created_On': moment(todayDate).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss")});
                                            } else {
                                                res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is updated.', 'Created_On': moment(todayDate).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss")});
                                            }

                                            // }
                                            //});
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
    } catch (err) {
        console.log(err);
        res.json({'msg': 'error'});
    }
});

router.post('/admin_raiseticket', LoadSession1, function (req, res, next) {
    try {
        var product_id = 0;
        var fields = req.fields;
        var files = req.files;
        var objRequest;
        objRequest = fields;

        var Ticket_id = objRequest["Ticket_Id"];
        if (objRequest["Product"] === "CAR") {
            product_id = 1;
        } else if (objRequest["Product"] === "BIKE") {
            product_id = 10;
        } else if (objRequest["Product"] === "HEALTH") {
            product_id = 2;
        } else if (objRequest["Product"] === "CV") {
            product_id = 12;
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

                    if (Ticket_id === "") {
                        //create new ticket id.
                        NewTicket_Id = objRequest["Product"].substring(0, 2).toString().toUpperCase() + objRequest["Category_Name"].substring(0, 2).toString().toUpperCase() + autoIndex;
                        isticket_created = 1;
                    } else {
                        NewTicket_Id = Ticket_id;
                        isticket_created = 0;
                    }
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
                            CRN: dbticket !== null ? dbticket["CRN"] : objRequest["CRN"],
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
                            Agent_Email_Id: dbticket !== null ? dbticket['Agent_Email_Id'] : req.obj_session.user.email,
                            Transaction_On: dbticket !== null ? dbticket["Transaction_On"] : objRequest["Transaction_On"],
                            Source: objRequest["Source"],
                            RM_Email_Id: objRequest["rm_email_id"]
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
                                            CRN: objRequest["CRN"],
                                            Mobile_No: objRequest["Mobile_No"],
                                            Vehicle_No: objRequest["Vehicle_No"],
                                            Remark: objRequest["txt_remark"],
                                            ss_id: req.obj_session.user.ss_id,
                                            CRN_owner: objRequest["CRN_owner"],
                                            fba_id: req.obj_session.user.fba_id,
                                            CRN_fba_id: objRequest["CRN_fba_id"],
                                            channel: objRequest["channel"],
                                            subchannel: objRequest["subchannel"],
                                            Agent_Email_Id: req.obj_session.user.email,
                                            Transaction_On: objRequest["Transaction_On"],
                                            Source: objRequest["Source"],
                                            RM_Email_Id: objRequest["rm_email_id"]
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
                                        "Status": dbticket['Status'],
                                        "Modified_On": todayDate
                                    };
                                    user_details.update({'Ticket_code': Ticket_id}, {$set: objticket}, function (err, numAffected) {
                                        console.log('user_detailsUpdate', err, numAffected);
                                        res.json({'Status': 'Updated'});
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
                                        pdf_file_name = i + "." + files[i].name.split('.').pop();
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
                                }

                                var Email = require('../models/email');
                                var objModelEmail = new Email();
                                var environment = config.environment.name === 'Production' ? "" : "QA-";
                                var cc = 'techsupport@policyboss.com';
                                cc += objRequest["rm_email_id"] !== "" ? ";" + objRequest["rm_email_id"] : '';
                                var to = "";
                                if (req.obj_session.user.email !== null || req.obj_session.user.email !== undefined) {
                                    to = req.obj_session.user.email;
                                }
                                if (objRequest["Category_Name"] === "Quotation") {
                                    to += ";quotesupport@policyboss.com";
                                }
                                if (post_sale.indexOf(objRequest["Category_Name"]) >= 0) {
                                    if (req.obj_session.user.email !== "rohit.rajput@policyboss.com") {
                                        to += ";rohit.rajput@policyboss.com";
                                    }
                                    cc += ";susanna.lobo@landmarkinsurance.in";
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
                                if (req.obj_session.user.email !== null || req.obj_session.user.email !== undefined) {
                                    objModelEmail.send('noreply@policyboss.com', to, subject, mail_content, cc, config.environment.notification_email, objRequest["CRN"]);
                                }

                                if (Ticket_id === "") {
                                    res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is created.', 'Created_On': moment(objRequest["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss")});
                                } else {
                                    res.json({'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is updated.', 'Created_On': moment(objRequest["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss")});
                                }

                            } else {
                                //console.log(response);
                            }

                            ////console.log(res);
                        });
                    });
                }
            });
        });

        //res.json({'Status': "Inserted Succefully"});
    } catch (err) {
        console.log(err);
        console.error("catch" + err);
        res.json({'msg': 'error'});
    }
});
router.post('/rsa_data', function (req, res, next) {
    try {
        let sync_contact_id = (req.body.hasOwnProperty('sync_contact_id')) ? req.body['sync_contact_id'] - 0 : 0;
        let ipaddress = (req.body.hasOwnProperty('ip_address')) ? req.body['ip_address'] : "0.0.0.0";
        let reg_no = (req.body.hasOwnProperty('reg_no')) ? req.body['reg_no'] : "";
        let name = (req.body.hasOwnProperty('name')) ? req.body['name'] : "";
        let mobile_no = (req.body.hasOwnProperty('mobile_no')) ? req.body['mobile_no'] : "";
        let email = (req.body.hasOwnProperty('email')) ? req.body['email'] : "";
        let state_city = (req.body.hasOwnProperty('state_city')) ? req.body['state_city'] : "";
        obj_RsaData = {
            "sync_contact_id": sync_contact_id,
            "ipaddress": ipaddress,
            "reg_no": reg_no,
            "name": name,
            "mobile_no": mobile_no,
            "email": email,
            "state_city": state_city
        };
        let obj_req = {
            "rsa_request": {
                "TransactionID": "12345",
                "Token": "globsjks_%qwrwr",
                "UserID": "Z2F1cmF2LmFyb3JhQGdsb2JhbGFzc3VyZS5jb20=",
                "Password": "QXNzaXN0QDEyMw==",
                "CustomerName": name,
                "CustomerEmail": email,
                "MobileNo": mobile_no,
                "RegistrationNo": reg_no,
                "State": state_city.split('_')[0].replace(/-/g, ' '),
                "City": state_city.split('_')[1].replace(/-/g, ' ')
            },
            "is_rsa_issued": 0
        };
        Sync_Contact.update({'sync_contact_id': obj_RsaData['sync_contact_id']}, {$set: obj_req}, function (err, numAffected) {
            console.log(err);
        });
        var args = {
            data: obj_req['rsa_request'],
            headers: {
                "Content-Type": "application/json"
            }
        };
        console.log(obj_req['rsa_request']);
        //sync_contact_id = sync_contact_id;
        var url_api = 'https://uatrsa.globalassure.com/API/RSA/APISaveCertificate';
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.post(url_api, args, function (data, response) {
            console.log(data);
            let obj_res = {
                "rsa_response": {},
                "is_rsa_issued": 0
            };
            obj_res['rsa_response'] = data;
            if (data.status === "Success") {
                obj_res['is_rsa_issued'] = 1;
                Sync_Contact.update({'sync_contact_id': obj_RsaData['sync_contact_id']}, {$set: obj_res}, function (err, numAffected) {
                    console.log(err);
                });
                obj_res['err'] = 0;
                var pdf_file_name = "RSA_" + data.CertificateNo + ".pdf"
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(data.CertificateFile, 'base64');
                fs.writeFileSync(pdf_sys_loc_horizon, binary);
                obj_res['rsa_response']['CertificateFile'] = pdf_web_path_portal;
                var Email = require('../models/email');
                var objModelEmail = new Email();
                var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com - RSA Certificate Number:' + data.CertificateNo;
                email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of RSA Certificate File.</p>'
                        + '<BR><p>Certificate Number : ' + data.CertificateNo + '</p><BR><p>RSA Certificate File: ' + pdf_web_path_portal + ' </p></body></html>';
                var arrTo = ['narayan.tilve@Kotak.com', 'prathmesh.hode@Kotak.com', 'kgi.operations@Kotak.com', 'nikita.naik@Kotak.com'];
                var arrCc = ['abhijeet.pendharkar@Kotak.com', 'atish.sonawane@Kotak.com', 'pranab.chavan@kotak.com', 'Jayesh.Kerkar@kotak.com', 'rohan.talla@Kotak.com', 'gaurav.dhuri@Kotak.com'];
                if (config.environment.name === 'Production') {
                    //objModelEmail.send('noreply@landmarkinsurance.co.in', arrTo.join(','), sub, email_body, arrCc.join(','), config.environment.notification_email, ''); //UAT
                } else {
                    objModelEmail.send('noreply@landmarkinsurance.co.in', obj_RsaData['email'], sub, email_body, '', '', '');
                }
            } else {
                Sync_Contact.update({'sync_contact_id': obj_RsaData['sync_contact_id']}, {$set: obj_res}, function (err, numAffected) {
                    console.log(err);
                });
                obj_res['err'] = 1;
            }
            res.send(obj_res);
            ////Sync_Contact.update({'sync_contact_id': sync_contact_id_new}, {$set: obj_is_rsa_camp}, function (err, numAffected) {
            //console.log(data);
            //});
        });
    } catch (e) {
        let obj_res = {
            'err': 1,
            'err_list': e.stack
        };
        res.send(obj_res);
    }

});

router.post('/get_sync_all_data', LoadSession, function (req, res) {
    try {

        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: 'mobileno name Created_On ss_id',
            sort: {'Created_On': 1},
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
        var ObjRequest = req.body;

        filter[ "ss_id"] = ObjRequest.ss_id - 0;

        if (req.body.mobileno !== undefined) {
            filter["mobileno"] = req.body.mobileno;
        }
        var sync_contact_erp_data = require('../models/sync_contact');
        console.error('HorizonSaleSearch', filter, req.body);
        sync_contact_erp_data.paginate(filter, optionPaginate).then(function (user_datas) {
            //console.error('UserDataSearch', filter, optionPaginate, user_datas);
            res.json(user_datas);
        });
    } catch (e) {
        console.error(e);
        res.json({"Msg": "error"});
    }
});
router.post('/get_sync_match_data', LoadSession, function (req, res) {
    try {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: 'mobile name policy_expiry_date make model erp_qt rto_city registration_no Created_On',
            sort: {'Created_On': 1},
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);

        }
        var filter = obj_pagination.filter;

        var ObjRequest = req.body;

        filter["ss_id"] = ObjRequest.ss_id - 0;
        filter["fba_id"] = ObjRequest.fba_id - 0;
        filter["Is_Lead_Created"] = 1;

        if (req.body.mobile !== undefined) {
            filter["mobile"] = req.body.mobile;
        }
        var sync_contact_erp_data = require('../models/sync_contact_erp_data');
        console.error('HorizonSaleSearch', filter, req.body);
        sync_contact_erp_data.paginate(filter, optionPaginate).then(function (user_datas) {
            //console.error('UserDataSearch', filter, optionPaginate, user_datas);
            res.json(user_datas);
        });
    } catch (e) {
        console.error(e);
        res.json({"Msg": "error"});
    }
});

router.post('/ticket/search11', function (req, res) {
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
        res.json({'msg': 'error'});
    }
});

router.post('/ticket/search', function (req, res) {
    var myModel = require('../models/tickets');
    const options = {
        page: 1,
        limit: 10
    };
    let aggregate = myModel.aggregate();
    var objRequest = req.body;
    var objResponse = [];
    var mysort = "";
    var roleType = objRequest["role_type"];
    if (objRequest["Category"] !== "") {
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
    if (objRequest["search_by"] !== "CurrentDate") {
        if (objRequest["search_by"] === "ticketid") {
            //Condition["Ticket_Id"] = objRequest["search_byvalue"];
            Condition["Ticket_Id"] = new RegExp(objRequest["search_byvalue"], 'i');
        } else if (objRequest["search_by"] === "CRN") {
            Condition["CRN"] = parseInt(objRequest["search_byvalue"]);
        } else {
            if (roleType === "tickets") {
                Condition = {"ss_id": ss_id
                            //"Created_On": {$gte: dateFrom, $lt: dateTo}
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
            Condition = {"ss_id": ss_id
                        //"Created_On": {$gte: dateFrom, $lt: dateTo}
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
    aggregate.match(Condition)
            .group({
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
            }).sort({"Modified_On": -1});


    myModel.aggregatePaginate(aggregate, options)
            .then(function (value) {
                console.log(value.docs, value.pages, value.total);
                res.json(value);
            })
            .catch(function (err) {
                console.err(err);
            });
});
router.post('/sync_contacts/online_agreement', function (req, res) {
    var online_agreement = require('../models/sync_contact_agreement');
    req.body = JSON.parse(JSON.stringify(req.body));
    var objonline_agreement = new online_agreement();
    for (var key in req.body) {
        objonline_agreement[key] = req.body[key];
    }
    objonline_agreement.Created_On = new Date();
    objonline_agreement.Modified_On = new Date();
    objonline_agreement.save(function (err1) {
        if (err1) {
            res.json({'Status': "Failure", "data": req.body});
        } else {
            res.json({'Status': "Success", "data": req.body});
        }
    });
});
router.post('/sync_contacts/save_lead_tele_support', function (req, res) {
    try {
        var lead_tele_support = require('../models/lead_tele_support');
        req.body = JSON.parse(JSON.stringify(req.body));
        var objlead_tele_support = new lead_tele_support();
        for (var key in req.body) {
            objlead_tele_support[key] = req.body[key];
        }
        objlead_tele_support.Created_On = new Date();
        objlead_tele_support.Modified_On = new Date();
        objlead_tele_support.save(function (err1) {
            if (err1) {
                res.json({'Msg': '', Status: 'Fail'});
            } else {
                res.json({'Msg': 'Saved Succesfully!!!', Status: 'Success'});
            }
        });
    } catch (errex) {
        res.json({'Msg': 'error', Error_Msg: errex.stack, Status: 'Fail'});
    }
});
router.post('/sync_contacts/save_tele_support', function (req, res) {
    try {
        var lead_tele_support = require('../models/lead_tele_support');
        req.body = JSON.parse(JSON.stringify(req.body));
        var objlead_tele_support = new lead_tele_support();
        for (var key in req.body) {
            objlead_tele_support[key] = req.body[key];
        }
        objlead_tele_support.Created_On = new Date();
        objlead_tele_support.Modified_On = new Date();
        objlead_tele_support.save(function (err1) {
            if (err1) {
                res.json({'Msg': '', Status: 'Fail'});
            } else {
                res.json({'Msg': 'Saved Succesfully!!!', Status: 'Success'});
            }
        });
    } catch (errex) {
        res.json({'Msg': errex.stack, Status: 'Fail'});
    }
});
router.post('/sync_contacts/razor_payment_history', LoadSession, function (req, res) {
    try {
        var Base = require('../libs/Base');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: 'Lead_Count Total_Premium Email Mobile Name Transaction_Status Created_On Ss_Id Fba_ID Plan',
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

        var ObjRequest = req.body;

        filter["Ss_Id"] = req.obj_session.user.ss_id;
        filter["Fba_ID"] = req.obj_session.user.fba_id;
        filter["Transaction_Status"] = "Success";
        if (req.body.name !== undefined) {
            filter["Name"] = new RegExp(req.body.name, 'i');
        }

        var razorpay_payment = require('../models/razorpay_payment');
        console.error('Horizonrazorpay_payment', filter, req.body);
        razorpay_payment.paginate(filter, optionPaginate).then(function (razorpay_payment) {
            //console.error('UserDataSearch', filter, optionPaginate, user_datas);
            res.json(razorpay_payment);
        });
    } catch (e) {
        console.error(e);
        res.json({"Msg": "error"});
    }
});
router.post('/sync_contact_import', agent_details_pre_form, function (req, res) {
    try {
        const vCardFiles = req.files['sync_file'].path;//appRoot + "/tmp/" + "2020-08-19 12-36-59.vcf";   
        var vcard = require('vcard-json');
        var sync_contact = require('../models/sync_contact');
        var syncPospSummary = {
            'Message': '',
            'Status': '',
            'StatusNo': 0,
            'Inserted_Count': 0
        };

        let syncContact = [];
        var ss_id = req.agent['EMP'].Emp_Id;
        var fba_id = req.agent['EMP'].FBA_ID;
        var mobile_list = [];
        var exist_contact = [];

        vcard.parseVcardFile(vCardFiles, function (err, vcard) {
            console.log(vcard);
            if (ss_id > 0 && ss_id !== 5)
            {
                for (var i in vcard)
                {
                    if (vcard[i].phone.length > 0) {
                        for (var j in vcard[i].phone) {
                            mobile_list.push(vcard[i].phone[j].value.replace(/-/g, '').slice(-10));
                        }
                    }
                }
                var cond = {
                    "mobileno": {
                        "$in": mobile_list
                    },
                    'ss_id': ss_id
                };

                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err1, db) {
                    var sync_contacts = db.collection('sync_contacts');
                    sync_contacts.find(cond).toArray(function (err2, dbItems) {
                        if (err2) {
                            syncPospSummary.Message = err2;
                            syncPospSummary.Status = 'Error';
                            syncPospSummary.StatusNo = 1;
                            res.json(syncPospSummary);
                        } else {
                            for (let i in dbItems) {
                                exist_contact.push(dbItems[i]['mobileno']);
                            }
                            for (var i in vcard) {
                                try {

                                    for (var j in vcard[i].phone) {
                                        var objRequest = {};
                                        let mobileno = vcard[i].phone[j].value.replace(/-/g, '').slice(-10).toString();
                                        let name = vcard[i].fullname.toString();
                                        var index = syncContact.findIndex(x => x.mobileno === mobileno);
                                        var is_duplicate = "";
                                        if (syncContact.length > 0 && index > 0) {
                                            is_duplicate = syncContact[index]['mobileno'];
                                        }
                                        if (is_duplicate === "") {
                                            if (exist_contact.indexOf(mobileno) > -1)
                                            {
                                                objRequest['name'] = name;
                                                objRequest['Modified_On'] = new Date();
                                                objRequest['raw_data'] = vcard[i];
                                                let myquery = {mobileno: mobileno, ss_id: ss_id};
                                                let newvalues = {$set: objRequest};
                                                Sync_Contact.update(myquery, newvalues, {multi: false}, function (err, numAffected) {
                                                    if (err)
                                                    {
                                                        console.error('Exception', 'Contact_Sync_Save_Err', err);
                                                    }
                                                });

                                            } else {
                                                objRequest['mobileno'] = mobileno;
                                                objRequest['name'] = name;
                                                objRequest['ss_id'] = ss_id;
                                                objRequest['fba_id'] = fba_id;
                                                objRequest['channel'] = req.agent['channel'];
                                                objRequest['Created_On'] = new Date();
                                                objRequest['Modified_On'] = new Date();
                                                objRequest['Short_Code'] = randomString(10);
                                                objRequest['raw_data'] = vcard[i];
                                                objRequest['source'] = "horizon";
                                                syncContact.push(objRequest);
                                            }
                                        }
                                    }
                                } catch (e) {
                                    console.error('Exception', 'sync_contact', 'data_process_loop', e.stack);
                                }
                            }
                        }
                        if (syncContact.length > 0) {
                            sync_contact.insertMany(syncContact, function (err, users) {
                                if (err) {
                                    syncPospSummary.Message = err;
                                    syncPospSummary.Status = 'Error';
                                    syncPospSummary.StatusNo = 1;
                                    syncPospSummary.Inserted_Count = users.length;
                                    res.json(syncPospSummary);
                                } else {
                                    syncPospSummary.Message = 'Contact Added Successfully.';
                                    syncPospSummary.Status = 'success';
                                    syncPospSummary.StatusNo = 0;
                                    syncPospSummary.Inserted_Count = users.length;
                                    res.json(syncPospSummary);
                                }
                            });
                        } else {
                            syncPospSummary.Message = 'No record added';
                            syncPospSummary.Status = 'Error';
                            syncPospSummary.StatusNo = 1;
                            syncPospSummary.Inserted_Count = 0;
                            res.json(syncPospSummary);
                        }
                    });
                });
            }
        });
    } catch (e) {
        console.error(e);
    }
});
router.post('/sync_contacts/save_update_sync_contact_master', (req, res) => {
    try {
        let Contact_Master = require('../models/contact_master');
        let objRequest = req.body;
        let objRequestCore = {};
        for (let i in objRequest) {
            objRequestCore[i] = (objRequest[i] !== undefined && objRequest[i] !== null && objRequest[i] !== "") ? objRequest[i] : "";
        }
        Contact_Master.find({'Mobile_No': objRequest.Mobile_No - 0}, function (save_contact_master_err, save_contact_master) {
            if (save_contact_master_err) {
                res.json({"Status": "Fail", "Msg": save_contact_master_err});
            } else {
                if (save_contact_master.length > 0) {
                    let update_args = {};
                    update_args['Modified_On'] = new Date();
                    update_args['Last_Sync_Ss_Id'] = objRequestCore['Last_Sync_Ss_Id'];
                    update_args['$inc'] = {'Sync_Count': 1};
//                        let update_args = {$set: update_data, $inc: {'Sync_Count': 1}};
                    Contact_Master.update({"Mobile_No": objRequest.Mobile_No - 0}, update_args, function (update_contact_master_err, update_contact_master) {
                        if (update_contact_master_err) {
                            res.json({"Status": "Fail", "Msg": update_contact_master_err});
                        } else {
                            res.json({"Status": "Success", "Msg": 'Data Updated Successfully'});
                        }
                    });
                } else {
                    objRequestCore['Created_On'] = new Date();
                    objRequestCore['Modified_On'] = new Date();
                    objRequestCore['Sync_Count'] = 1;
                    contact_master = new Contact_Master(objRequestCore);
                    contact_master.save(function (contact_master_err, db_contact_master) {
                        if (contact_master_err) {
                            res.json({"Status": "Fail", "Msg": contact_master_err});
                        } else {
                            res.json({"Status": "Success", "Msg": 'Data Save Successfully', "Data": db_contact_master});
                        }
                    });
                }
            }
        });
    } catch (err) {
        console.error('Exception', '/sync_contacts/save_sync_contact_master', err.stack);
        res.json({"Status": "Fail", "Msg": err.stack});
    }
});
router.post('/health_insurance_campaign', function (req, res) {
    try {
        let health_insurance_campaign = require('../models/health_insurance_campaign');
        var Email = require('../models/email');
        var objModelEmail = new Email();
        var data = req.body;

        var args = {
            "Name": data['Name'],
            "Mobile": data['Mobile'],
            "Date_of_birth": data['Date_of_birth'],
            "Type_Of_Insurance": data['Type_Of_Insurance'],
            "Created_On": new Date(),
            "Modified_On": new Date()
        };

        var health_campaign = new health_insurance_campaign(args);
        health_campaign.save(function (err, resdata) {
            if (err) {
                res.json({'Status': 'Error', 'Msg': err.stack});
            } else {
                if (config.environment.name === 'Production') {
                    var arrTo = ['marketing@policyboss.com'];
                    var arrCc = [];
                    var arrBcc = [config.environment.notification_email];
                } else {
                    var arrTo = ['ashish.hatia@policyboss.com'];
                    var arrCc = [];
                    var arrBcc = [config.environment.notification_email];
                }
                var subject = "Health Insurance Campaign Customer Data";
                var mail_content = '<html> <body>Dear Team,<br /><p> Please find the Customer details</p><br/><br/>'
                        + '<table><tr><td style =\""font-size:12px;line-height:1.5em;\""><fieldset> <legend><b>Customer Details</b>:</legend><br/>'
                        + '<p>Name - ' + args['Name']
                        + '<br>Mobile - ' + args['Mobile']
                        + '<br>Date Of Birth : ' + args['Date_of_birth']
                        + '<br>Type Of Insurance : ' + args['Type_Of_Insurance']
                        + '</fieldset><td/><tr/></table><br/><br/>'
                        + 'Regards,<br />policyboss.com<br />'
                        + 'Landmark Insurance Brokers Pvt. Ltd.<br /><b>Address</b> '
                        + ': Ground Floor & First Floor,<br/>'
                        + ' E-Shape Building, Ashok Silk Mills Compound,'
                        + '<br/> 202 L.B.S Marg, Ghatkopar (West), Mumbai- 400 086';

                objModelEmail.send('noreply@landmarkinsurance.co.in', arrTo.join(','), subject, mail_content, arrCc.join(','), arrBcc.join(','), '');
                res.json({'Status': 'Success', 'Msg': resdata.Visitor_Number});
            }
        });
    } catch (ex) {
        console.log("error:", ex);
        res.json({'Status': 'Error', 'Msg': ex.stack});
    }
});
router.post('/ticket/endoUpdateUserDatas', function (req, res) {
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

router.post('/tickets', LoadSession, function (req, res) {
    var objBase = new Base();
    var Ticket = require('../models/ticket');
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
    if (req.body['search[value]'] !== '' && req.body['search[value]'] !== undefined) {
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
            filter['ss_id'] = req.obj_session.user.ss_id - 0;
//                if (req.obj_session.hasOwnProperty('users_assigned')) {
//                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
//                    var arr_ssid = combine_arr.split(',').filter(Number).map(Number);
//                    filter['ss_id'] = {$in: arr_ssid};
//                } else {
//                    filter['ss_id'] = req.obj_session.user.ss_id - 0;
//                }
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
                    arr_last_status.push(objStatusSummary[req.body['Last_Status_Group']][k].toString())
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

function agent_details_pre_form(req, res, next) {
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var ss_id = 0;
        if (fields.hasOwnProperty('ss_id') && fields['ss_id'] > 0) {
            ss_id = fields['ss_id'] - 0;
        }

        if (ss_id > 0) {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id.toString(), {}, function (data, response) {
                if (data['status'] === 'SUCCESS') {
                    req.agent = data;
                    req.files = files;
                } else {
                    //res.send('AGENT_NOT_EXIST<br>' + '<pre>' + JSON.stringify(req.query, undefined, 2) + '</pre>');
                }
                return next();
            });
        } else {
            return next();
        }
    });
}


router.post('/protectme_pre_submission', function (req, res, next) {
    try {
        var objRequest = req.body;
        var filehtml = appRoot + "/resource/request_file/Protect_Me_Well/protectmewell-pre-submission.html";
        var html2 = fs.readFileSync(filehtml, 'utf8');
        var replacedata = {
            '___customer_name___': objRequest.customer_name,
            '___redirection_link___': "horizon.policyboss.com:5000/pmw/" + objRequest

        };
        html2 = html2.toString().replaceJson(replacedata);

        var Email = require('../models/email');
        var objModelEmail = new Email();
        let subject = "Protect Me Well";
        let to = objRequest.email;
        let crn = objRequest.crn;
        objModelEmail.send('noreply@policyboss.com', to, subject, html2, "", config.environment.notification_email, crn);

    } catch (e) {
        res.json({msg: 'fail', url: '', error: e});
    }
});

router.get('/protectme_pdf/:UID', function (req, res, next) {
    try {
        var User_Data_Id = req.params['UID'] - 0;
        var protect_me_well = require('../models/protect_me_well_detail');
        protect_me_well.findOne({"User_Data_Id": User_Data_Id}, function (err, dbData) {
            if (err) {
                res.json({msg: 'fail', url: ''});
            } else {
                var url = dbData._doc.protect_me_link_url;
                res.json({msg: 'success', url: url});
            }
        });
    } catch (e) {
        res.json({msg: 'fail', url: '', error: e});
    }
});

router.get('/pmw/:pmw_id', function (req, res, next) {
    try {
        let pmw_id = req.params['pmw_id'];
        let User_Data_Id = pmw_id.split("_")[0] - 0;
        //let SRN = pmw_id.split("_")[1];
        let protect_me_well = require('../models/protect_me_well_detail');
        var http = require('http');
        var Client = require('node-rest-client').Client;
        var client = new Client();
        let ip_address = "";
        var url_click = config.environment.name === 'Production' ? "https://www.policyboss.com/ProtectMeWell/?pmwid=" + pmw_id : "http://qa.policyboss.com/ProtectMeWell/?pmwid=" + pmw_id;
        http.get('http://bot.whatismyipaddress.com', function (res1, req) {
            res1.setEncoding('utf8');
            res1.on('data', function (chunk) {
                // You can process streamed parts here...
                ip_address = chunk;
                console.log(ip_address);
            });

            client.get(config.environment.weburl + '/user_datas/view/' + User_Data_Id, function (data, err) {
                if (data.length > 0) {
                    data = data['0'];
                    console.log(data);
                    var age = calculateAge(new Date(data["Proposal_Request_Core"]["birth_date"]));
                    console.log("age=====" + age);
                    var objData = {
                        "User_Data_Id": data["User_Data_Id"],
                        "Request_Unique_Id": data["Request_Unique_Id"],
                        "Name": data["Proposal_Request_Core"]["first_name"] + " " + data["Proposal_Request_Core"]["middle_name"] + " " + data["Proposal_Request_Core"]["last_name"],
                        "Mobile": data["Proposal_Request_Core"]["mobile"],
                        "Email": data["Proposal_Request_Core"]["email"],
                        "Age": age,
                        "DOB": data["Proposal_Request_Core"]["birth_date"],
                        "Address": data["Proposal_Request_Core"]["permanent_address_1"] + " " + data["Proposal_Request_Core"]["permanent_address_2"] + " " + data["Proposal_Request_Core"]["permanent_address_3"] + " " + data["Proposal_Request_Core"]["locality"] + " " + data["Proposal_Request_Core"]["permanent_pincode"] + " " + data["Proposal_Request_Core"]["district"],
                        "is_protect_me_visited": 1,
                        "is_protect_issued": 0,
                        "Created_On": new Date(),
                        "Modified_On": new Date()
                    };
                    protect_me_well.findOne({"User_Data_Id": User_Data_Id}, function (err, dbData) {
                        if (err) {

                        } else {
                            if (dbData)
                            {
                                if (dbData._doc.hasOwnProperty('protect_me_link_url') && (dbData._doc["protect_me_link_url"] !== null || dbData._doc["protect_me_link_url"] !== ""))
                                {
                                    return res.redirect(dbData._doc["protect_me_link_url"]);
                                } else
                                {
                                    var obj_res = {};
                                    let obj_visted_history = {
                                        "ip_address": ip_address,
                                        "date_time": new Date()
                                    };
                                    obj_res["protect_me_link_history"] = obj_visted_history;
                                    protect_me_well.updateOne({'User_Data_Id': User_Data_Id}, {$set: {'is_protect_me_visited': parseInt(dbData._doc["is_protect_me_visited"]) + 1}}, function (err, numAffected) {
                                        console.log(err);
                                    });
                                    protect_me_well.updateOne({'User_Data_Id': User_Data_Id}, {$addToSet: obj_res}, function (err, numAffected) {
                                        console.log(err);
                                        return res.redirect(url_click);
                                    });
                                }
                            } else {
                                let obj_visted_history = [{
                                        "ip_address": ip_address,
                                        "date_time": new Date()
                                    }];
                                objData["protect_me_link_history"] = obj_visted_history;

                                protect_me_well.insertMany(objData, function (err, users) {
                                    if (err) {
                                        res.json({'Msg': '', Status: 'Fail'});
                                    } else {
                                        console.log(url_click);
                                        return res.redirect(url_click);
                                        //res.json({'Msg': 'Saved Succesfully!!!', Status: 'Success'});
                                    }
                                });
                            }
                        }
                    });
                }

            });
        });
    } catch (e) {
        res.send(e.stack);
    }
});

router.get('/getprotectmedata/:UID', function (req, res, next) {
    var User_Data_Id = req.params['UID'] - 0;
    var Client = require('node-rest-client').Client;
    var client = new Client();
    client.get(config.environment.weburl + '/user_datas/view/' + User_Data_Id, function (data, err) {
        if (data.length > 0) {
            data = data['0'];
            var age = calculateAge(new Date(data["Proposal_Request_Core"]["birth_date"]));
            return res.json({
                "User_Data_Id": data["User_Data_Id"],
                "Name": data["Proposal_Request_Core"]["first_name"] + " " + data["Proposal_Request_Core"]["middle_name"] + " " + data["Proposal_Request_Core"]["last_name"],
                "Mobile": data["Proposal_Request_Core"]["mobile"],
                "Email": data["Proposal_Request_Core"]["email"],
                "Age": age,
                "DOB": data["Proposal_Request_Core"]["birth_date"],
                "Gender": data["Proposal_Request_Core"]["gender"],
                "Marital": data["Proposal_Request_Core"]["marital"],
                "Location": data["Proposal_Request_Core"]["permanent_city"]
            });
        }
    });
});

router.get('/getticketing_category/:product_id/:source?', function (req, res) {
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
        res.json({'msg': 'error'});
    }
});
router.post('/get_lms_data_list', function (req, res) {
    try {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: 'Product_name Sub_product_name Customer_name Mobile_no Created_On',
            sort: {'Created_On': 1},
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        if (req.body.mobile !== undefined) {
            filter["Mobile_no"] = parseInt(req.body.mobile);
        }
        if (req.body.customerName !== undefined) {
            filter["Customer_name"] = req.body.customerName;
        }
        if (req.body.Product_type !== undefined && req.body.Product_type !== "-- Select Product Type --") {
            filter["Product_name"] = req.body.Product_type;
        }
        if (req.body.SubProduct_type !== undefined && req.body.SubProduct_type !== "-- Select Sub-Product Type --") {
            filter["Sub_product_name"] = req.body.SubProduct_type;
        }
        var lms_data = require('../models/lms_data');
        console.error('HorizonSaleSearch', filter, req.body);
        lms_data.paginate(filter, optionPaginate).then(function (user_datas) {
            //console.error('UserDataSearch', filter, optionPaginate, user_datas);
            res.json(user_datas);
        });
    } catch (e) {
        console.error(e);
        res.json({"Msg": "error"});
    }
});
router.post('/lms_lead_save', function (req, res) {
    try {
        var lms_data = require('../models/lms_data');
        var objRequest = req.body;
        var Lead_Id = objRequest['Lead_Id'];
        if (Lead_Id !== null && Lead_Id !== "" && Lead_Id !== undefined) {
            lms_data.update({'Lead_Id': Lead_Id}, objRequest, function (err, numaffected) {
                res.json({"Msg": "Lead Updated Successfully.", "Status": "Success"});
            });
        } else {
            var lms_dataobj = new lms_data(objRequest);
            lms_dataobj.save(function (err) {
                res.json({"Msg": "Lead Created Successfully.", "Status": "Success"});
            });
        }
    } catch (e) {
        console.log(e);
        res.json({"Msg": e, "Status": "Fail"});
    }
});

router.get('/lms_product_types', function (req, res) {
    var lms_product_type = require('../models/lms_product_type');
    lms_product_type.find(function (err, dbProductData) {
        if (err) {

        } else {
            if (dbProductData) {
                console.log(dbProductData);
                res.send(dbProductData);
            }
        }
    });
});

router.get('/lms_sub_product_types/:product_type', function (req, res) {
    var lms_sub_product_type = require('../models/lms_sub_product_type');
    if (req.params.product_type) {
        lms_sub_product_type.find({lm_product_id: parseInt(req.params.product_type)}, function (err, dbSubProductData) {
            if (err) {

            } else {
                if (dbSubProductData) {
                    console.log(dbSubProductData);
                    res.send(dbSubProductData);
                }
            }
        });
    } else {
        res.send('Invalid Product Type');
    }
});
router.post('/lms_lead_datas', function (req, res) {
    try {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: 'Lead_Id Customer_name Mobile_no Email Product_name Sub_product_name Status Product_id Sub_product_id',
            sort: {'Created_On': 1},
            lean: true,
            page: 1,
            limit: 10
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        if (req.body.Created_by !== undefined) {
            filter["Created_by"] = req.body.Created_by;
        }
        if (req.body.mobile !== undefined) {
            filter["Mobile_no"] = parseInt(req.body.mobile);
        }
        if (req.body.customerName !== undefined) {
            filter["Customer_name"] = req.body.customerName;
        }
        if (req.body.Product_type !== undefined && req.body.Product_type !== "-- Select Product Type --") {
            filter["Product_name"] = req.body.Product_type;
        }
        if (req.body.SubProduct_type !== undefined && req.body.SubProduct_type !== "-- Select Sub-Product Type --") {
            filter["Sub_product_name"] = req.body.SubProduct_type;
        }
        var lms_datas = require('../models/lms_data');

        lms_datas.paginate(filter, optionPaginate).then(function (lms_datas) {
            res.json(lms_datas);
        });
    } catch (e) {
        console.log(e);
        res.json({"Msg": e});
    }
});
router.get('/lms_forms_master/:product_type/:sub_product_type', function (req, res) {
    try {
        var product_id = parseInt(req.params['product_type']);
        var subproduct_id = parseInt(req.params['sub_product_type']);
        var Conditions = {"lms_product_id": {$in: [0, product_id]}, "lms_sub_product_id": {$in: [0, subproduct_id]}};
        var resultArray = {"basic": null
            , "full": null
            , "global": null};
        var basicmaster = [];
        var fullmaster = [];
        var globalmaster = [];
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            var lms_forms_master = db.collection('lms_forms_master').find(Conditions, {_id: 0});
            lms_forms_master.forEach(function (doc, err) {

                if (doc.form_category === "basic") {
                    basicmaster.push(doc);
                } else if (doc.form_category === "full") {
                    fullmaster.push(doc);
                } else {
                    globalmaster.push(doc);
                }

            }, function () {
                resultArray["basic"] = basicmaster;
                resultArray["full"] = fullmaster;
                resultArray["global"] = globalmaster;
                res.json(resultArray);
            });
        });

    } catch (e) {
        console.log(e);
        res.json({"Msg": e});
    }
});
router.get('/get_lms_lead_data/:lead_id', function (req, res) {
    try {
        var Lead_Id = req.params['lead_id'];
        var Condition = {};
        if (Lead_Id !== null || Lead_Id !== "") {
            Condition = {"Lead_Id": Lead_Id};
        }

        var lms_datas = require('../models/lms_data');
        lms_datas.find(Condition, function (err, dblmsData) {
            if (err) {

            } else {
                if (dblmsData) {
                    console.log(dblmsData);
                    res.send(dblmsData);
                }
            }
        });
    } catch (e) {
        console.log(e);
        res.json({"Msg": e});
    }
});

router.post('/admin_inspection_list', LoadSession, function (req, res) {
    try {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: 'Product_Id PB_CRN Request_Unique_Id Report_Summary Premium_Request Premium_Summary Proposal_Request Last_Status Created_On Modified_On Client_Id Transaction_Data Erp_Qt_Request_Core Status_History Insurer_Id User_Data_Id Transaction_Data ERP_CS Service_Log_Unique_Id Proposal_History Premium_List',
            sort: {'Modified_On': -1},
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
                    {'channel': channel},
                    {'ss_id': {$in: arr_ch_ssid}}
                ];
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);

                }
                arr_ssid.push(req.obj_session.user.ss_id);
                filter['ss_id'] = {$in: arr_ssid};
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
                Condition['Last_Status'] = {$in: ObjSummaryCondition['QUOTE']};
            }
            if (Type === 'APPLICATION') {
                Condition['Last_Status'] = {$in: ObjSummaryCondition['APPLICATION']};
            }
            if (Type === 'SELL') {
                Condition['Last_Status'] = {$in: ObjSummaryCondition['COMPLETE']};
            }
            if (Type === 'INSPECTION' && (Ss_Id !== 822)) {
                Condition['Last_Status'] = {$in: ObjSummaryCondition['INSPECTION']};
            }

            if (Type === 'INSPECTION' && (Ss_Id === 822)) {
                Condition['Last_Status'] = {$in: ObjSummaryCondition['INSPECTION_SUBMITTED']};
            }
            if (Type === 'PENDING_PAYMENT') {
                Condition['Last_Status'] = {$in: ObjSummaryCondition['PENDING_PAYMENT']};
            }
            if (Type === 'SENDLINK') {
                Condition['Last_Status'] = {$in: ObjSummaryCondition['SENDLINK']};
            }
            if (Type === 'PROPOSALSUBMIT') {
                Condition['Last_Status'] = {$in: ObjSummaryCondition['PROPOSALSUBMIT']};
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
            res.json({'msg': 'ss_id is empty'});
        }
    } catch (e) {
        console.error('Exception', 'QuickList', e);
    }
});
router.post('/erp_health_journey', function (req, res, next) {
    try {
        var Client = require('node-rest-client').Client;
        var objClient = new Client();
        objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {
            if (data) {
                if (data.hasOwnProperty(req.body.client_key) && req.body.secret_key === data[req.body.client_key]['Secret_Key'] && data[req.body.client_key]['Is_Active'] === true) {
                    var Preferred_Data = {
                        'User_Data_Id': req.body.User_Data_Id,
                        'Plan_Name': req.body.Plan_Name,
                        'Plan_Id': req.body.Plan_Id,
                        'Insurer_Id': req.body.Insurer_Id,
                        'Insurer_Name': req.body.Insurer_Name,
                        'Preferred_On': new Date()
                    };
                    var User_Data = require('../models/user_data');
                    var ud_cond = {'User_Data_Id': req.body.User_Data_Id};
                    User_Data.findOne(ud_cond, function (err, dbUserData) {
                        if (err) {

                        } else {
                            if (dbUserData) {
                                User_Data.update({'User_Data_Id': dbUserData['User_Data_Id']}, {$set: {"Preferred_Plan_Data": Preferred_Data}}, function (err, numAffected) {
                                    console.log('UserDataPolicyDataUpdate', err, numAffected);
                                    res.json({'Msg': 'SUCCESS'});
                                });
                            } else {
                                res.json({'Msg': 'Udid_Not_Found'});
                            }
                        }
                    });
                } else {
                    res.json({'Msg': 'Not Authorized'});
                }
            }
        });
    } catch (e) {
        console.error('erp_health_journey', 'exception', e);
    }
});
router.post('/getAdvisoryScore', function (req, res) {
    try {
        let Client = require('node-rest-client').Client;
        let client = new Client();
        let objReq = req.body;
        let ScoreMaster = [];
        if (fs.existsSync(appRoot + "/tmp/cachemaster/advisory_score_master.log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/advisory_score_master.log").toString();
            ScoreMaster = JSON.parse(cache_content);
        } else {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                if (err)
                    throw err;
                let score_master = db.collection('health_benefits_score_master');
                score_master.find({}, {_id: 0}).toArray(function (err, scoreMaster) {
                    if (err) {
                        res.send(err);
                    } else {
                        ScoreMaster = scoreMaster;
                        fs.writeFile(appRoot + "/tmp/cachemaster/advisory_score_master.log", JSON.stringify(scoreMaster), function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                    }
                });
            });
        }
        let insWeight = require('../resource/request_file/AdvisoryInsurerWeight.json');

        let request = {
            "search_reference_number": objReq.ref_no,
            "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
            "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW"
        };
        let args = {
            data: JSON.stringify(request),
            headers: {"Content-Type": "application/json;charset=utf-8"}
        };
        let url = ((config.environment.name === 'Production') ? 'https://horizon.policyboss.com:5443' : 'http://localhost:3000') + "/quote/premium_list_db";
        client.post(url, args, function (data1, response) {
            if (data1.hasOwnProperty('Response') && data1.Response.length > 0) {
                let preferred_plans = [];
                let ins_list = data1.Response;
                let lm_request = data1.Summary['Request_Core'];
                let existing_insurer = lm_request.existing_insurer_id;
                let existing_plan = lm_request.existing_plan_id;
                if (ins_list.length > 0) {
                    let index = ins_list.findIndex(x => x.Insurer_Id === existing_insurer);
                    if (index > -1) {
                        let plan_index = ins_list[index].Plan_List.findIndex(x => x.Plan_Id === existing_plan);
                        if (plan_index > -1) {
                            let insWtIndex = insWeight.findIndex(a => a.Insurer_Id === existing_insurer);
                            let scoringBenefits = [];
                            let url = "https://horizon.policyboss.com:5443/benefits/" + existing_insurer + "/" + existing_plan + "/" + lm_request.health_insurance_type + "/" + ins_list[index].Plan_List[plan_index].Sum_Insured;
                            client.get(url, function (data2, response) {
                                if (data2.length > 0) {
                                    let total_score = 0;
                                    let final_advisory = 0;
                                    let basic_quote = 0;
                                    let wt_percent = insWeight[insWtIndex].Weightage_Percent / 100;
                                    for (let j = 0; j < data2.length; j++) {
                                        let objKey = ScoreMaster.findIndex(s => s['Feature Key'] === data2[j].Benefit_Key && s['Feature Value'] === data2[j].Benefit_Value);
                                        if (objKey > -1) {
                                            total_score += ScoreMaster[objKey]['FeatureWeightedScore'];
                                            final_advisory += ScoreMaster[objKey]['Feature Score'];
                                            scoringBenefits.push(data2[j]);
                                        }
                                    }
                                    basic_quote = Number((total_score * wt_percent).toFixed(1));
                                    final_advisory = Number(((final_advisory / 10) * wt_percent).toFixed(1));
                                    total_score = Number(total_score.toFixed(1));
                                    preferred_plans.push({"Existing_Plan": ins_list[index].Plan_List[plan_index], "Benefits": scoringBenefits, "Score": {"BasicScore": basic_quote, "Final_Advisory": final_advisory, "TotalScore": total_score}});
                                }
                            });
                        }
                    }
                    for (let x = 0; x < ins_list.length; x++) {
                        let planScores = [];
                        if (x !== index) {
                            let insWtIndex = insWeight.findIndex(a => a.Insurer_Id === ins_list[x].Insurer_Id);
                            for (let k = 0; k < ins_list[x].Plan_List.length; k++) {
                                let planBenefits = [];
                                let url = "https://horizon.policyboss.com:5443/benefits/" + ins_list[x].Insurer_Id + "/" + ins_list[x].Plan_List[k].Plan_Id + "/" + lm_request.health_insurance_type + "/" + ins_list[x].Plan_List[0].Sum_Insured;
                                client.get(url, function (data, response) {
                                    if (data.length > 0) {
                                        let total_score = 0;
                                        let final_advisory = 0;
                                        let basic_quote = 0;
                                        let wt_percent = insWeight[insWtIndex].Weightage_Percent / 100;
                                        for (let j = 0; j < data.length; j++) {
                                            let objKey = ScoreMaster.findIndex(s => s['Feature Key'].toUpperCase() === data[j].Benefit_Key.toUpperCase() && s['Feature Value'].toUpperCase() === data[j].Benefit_Value.toUpperCase());
                                            if (objKey > -1) {
                                                total_score += ScoreMaster[objKey]['FeatureWeightedScore'];
                                                final_advisory += ScoreMaster[objKey]['Feature Score'];
                                                planBenefits.push(data[j]);
                                            }
                                        }
                                        basic_quote = Number((total_score * wt_percent).toFixed(1));
                                        final_advisory = Number(((final_advisory / 10) * wt_percent).toFixed(1));
                                        total_score = Number(total_score.toFixed(1));
                                        planScores.push({"plan_index": data[0].Plan_Code, "benefits": planBenefits, "score": {"BasicScore": basic_quote, "Final_Advisory": final_advisory, "TotalScore": total_score}});
                                    }
                                });
                            }
                            sleep(500);
                            planScores.sort(function (a, b) {
                                if (a.benefits['TotalScore'] < b.benefits['TotalScore']) {
                                    return 1;
                                } else if (a.benefits['TotalScore'] > b.benefits['TotalScore']) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                            if (planScores.length > 0) {
                                let pushIndex = ins_list[x].Plan_List.findIndex(p => p.Plan_Id === parseInt(planScores[0].plan_index));
                                if (pushIndex > -1)
                                    preferred_plans.push({"Recommended_Plan": ins_list[x].Plan_List[pushIndex], "Benefits": planScores[0].benefits, Score: planScores[0].score});
                            }
                        }
                    }
                }
                preferred_plans.push({"Summary": data1.Summary});
                res.json(preferred_plans);
            }
        });
    } catch (ex) {
        console.error('Exception in Advisory Score-', ex);
    }
});
router.post('/getAdvisoryFilterScore', function (req, res) {
    try {
        let Client = require('node-rest-client').Client;
        let client = new Client();
        let objReq = req.body;
        let filterBenefits = objReq.filter_benefits.split(",");
        let ScoreMaster = [];
        if (fs.existsSync(appRoot + "/tmp/cachemaster/advisory_score_master.log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/advisory_score_master.log").toString();
            ScoreMaster = JSON.parse(cache_content);
        } else {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                if (err)
                    throw err;
                let score_master = db.collection('health_benefits_score_master');
                score_master.find({}, {_id: 0}).toArray(function (err, scoreMaster) {
                    if (err) {
                        res.send(err);
                    } else {
                        ScoreMaster = scoreMaster;
                        fs.writeFile(appRoot + "/tmp/cachemaster/advisory_score_master.log", JSON.stringify(scoreMaster), function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                    }
                });
            });
        }
        let insWeight = require('../resource/request_file/AdvisoryInsurerWeight.json');

        let request = {
            "search_reference_number": objReq.ref_no,
            "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
            "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW"
        };
        let args = {
            data: JSON.stringify(request),
            headers: {"Content-Type": "application/json;charset=utf-8"}
        };
        let url = ((config.environment.name === 'Production') ? 'https://horizon.policyboss.com:5443' : 'http://localhost:3000') + "/quote/premium_list_db";
        client.post(url, args, function (data1, response) {
            if (data1.hasOwnProperty('Response') && data1.Response.length > 0) {
                let preferred_plans = [];
                let ins_list = data1.Response;
                let lm_request = data1.Summary['Request_Core'];
                let existing_insurer = lm_request.existing_insurer_id;
                let existing_plan = lm_request.existing_plan_id;
                if (ins_list.length > 0) {
                    let index = ins_list.findIndex(x => x.Insurer_Id === existing_insurer);
                    if (index > -1) {
                        let plan_index = ins_list[index].Plan_List.findIndex(x => x.Plan_Id === existing_plan);
                        if (plan_index > -1) {
                            let insWtIndex = insWeight.findIndex(a => a.Insurer_Id === existing_insurer);
                            let scoringBenefits = [];
                            let url = "https://horizon.policyboss.com:5443/benefits/" + existing_insurer + "/" + existing_plan + "/" + lm_request.health_insurance_type + "/" + ins_list[index].Plan_List[plan_index].Sum_Insured;
                            client.get(url, function (data2, response) {
                                if (data2.length > 0) {
                                    let total_score = 0;
                                    let final_advisory = 0;
                                    let basic_quote = 0;
                                    let wt_percent = insWeight[insWtIndex].Weightage_Percent / 100;
                                    for (let j = 0; j < data2.length; j++) {
                                        let objKey = ScoreMaster.findIndex(s => s['Feature Key'].toUpperCase() === data2[j].Benefit_Key.toUpperCase() && s['Feature Value'].toUpperCase() === data2[j].Benefit_Value.toUpperCase());
                                        if (objKey > -1) {
                                            for (let b = 0; b < filterBenefits.length; b++) {
                                                if (filterBenefits[b].trim() === data2[j].Benefit_Key) {
                                                    total_score += ScoreMaster[objKey]['FeatureWeightedScore'];
                                                    final_advisory += ScoreMaster[objKey]['Feature Score'];
                                                }
                                            }
                                            scoringBenefits.push(data2[j]);
                                        }
                                    }
                                    basic_quote = Number((total_score * wt_percent).toFixed(1));
                                    final_advisory = Number(((final_advisory / filterBenefits.length) * wt_percent).toFixed(1));
                                    total_score = Number(total_score.toFixed(1));
                                    preferred_plans.push({"Existing_Plan": ins_list[index].Plan_List[plan_index], "Benefits": scoringBenefits, "Score": {"BasicScore": basic_quote, "Final_Advisory": final_advisory, "TotalScore": total_score}});
                                }
                            });
                        }
                    }
                    for (let x = 0; x < ins_list.length; x++) {
                        let planScores = [];
                        if (x !== index) {
                            let insWtIndex = insWeight.findIndex(a => a.Insurer_Id === ins_list[x].Insurer_Id);
                            for (let k = 0; k < ins_list[x].Plan_List.length; k++) {
                                let planBenefits = [];
                                let url = "https://horizon.policyboss.com:5443/benefits/" + ins_list[x].Insurer_Id + "/" + ins_list[x].Plan_List[k].Plan_Id + "/" + lm_request.health_insurance_type + "/" + ins_list[x].Plan_List[0].Sum_Insured;
                                client.get(url, function (data, response) {
                                    if (data.length > 0) {
                                        let total_score = 0;
                                        let final_advisory = 0;
                                        let basic_quote = 0;
                                        let wt_percent = insWeight[insWtIndex].Weightage_Percent / 100;
                                        for (let j = 0; j < data.length; j++) {
                                            let objKey = ScoreMaster.findIndex(s => s['Feature Key'].toUpperCase() === data[j].Benefit_Key.toUpperCase() && s['Feature Value'].toUpperCase() === data[j].Benefit_Value.toUpperCase());
                                            if (objKey > -1) {
                                                for (let b = 0; b < filterBenefits.length; b++) {
                                                    if (filterBenefits[b].trim() === data[j].Benefit_Key) {
                                                        total_score += ScoreMaster[objKey]['FeatureWeightedScore'];
                                                        final_advisory += ScoreMaster[objKey]['Feature Score'];
                                                    }
                                                }
                                                planBenefits.push(data[j]);
                                            }
                                        }
                                        basic_quote = Number((total_score * wt_percent).toFixed(1));
                                        final_advisory = Number(((final_advisory / filterBenefits.length) * wt_percent).toFixed(1));
                                        total_score = Number(total_score.toFixed(1));
                                        planScores.push({"plan_index": data[0].Plan_Code, "benefits": planBenefits, "score": {"BasicScore": basic_quote, "Final_Advisory": final_advisory, "TotalScore": total_score}});
                                    }
                                });
                            }
                            sleep(500);
                            planScores.sort(function (a, b) {
                                if (a.benefits['TotalScore'] < b.benefits['TotalScore']) {
                                    return 1;
                                } else if (a.benefits['TotalScore'] > b.benefits['TotalScore']) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                            if (planScores.length > 0) {
                                let pushIndex = ins_list[x].Plan_List.findIndex(p => p.Plan_Id === parseInt(planScores[0].plan_index));
                                if (pushIndex > -1)
                                    preferred_plans.push({"Recommended_Plan": ins_list[x].Plan_List[pushIndex], "Benefits": planScores[0].benefits, Score: planScores[0].score});
                            }
                        }
                    }
                }
                preferred_plans.push({"Summary": data1.Summary});
                res.json(preferred_plans);
            }
        });
    } catch (ex) {
        console.error('Exception in Advisory filter Score-', ex);
    }
});
router.get('/pdf_initiate_bajaj_insurer', function (req, res) {
    try {
        let user_data = require('../models/user_data');
        let CRN_list_1 = [5125241, 5138401, 5139113, 5137706, 5136654, 5136476, 5139122, 5138198, 5138508, 5138660, 5138729, 5142485, 5141976, 5137445, 5142696, 5136215, 5146641, 5142834, 5140759, 5121985, 5132473, 5140259, 5145396, 5147074, 5143323, 5145107, 5143523, 5149216, 5147692, 5141331, 5148811, 5148259, 5146437, 5149593, 5149784, 5151784, 5141361, 5151011, 5141424, 5150570, 5151423, 5155148, 5152627, 5151276, 5151094, 5151870, 5142973, 5153505, 5153626, 5155232, 5153390, 5155582, 5153043, 5154230, 5154500, 5153165, 5157008, 5156197, 5155924, 5148104, 5156970, 5156500, 5157877, 5156510, 5158096, 5158414, 5161092, 5156926, 5156327, 5143685, 5159355, 5159139, 5159687, 5160201, 5156845, 5153898, 5154964, 5159118, 5159295, 5159785, 5152856, 5161526, 5162458, 5162535, 5163065, 5163404, 5162453, 5163850, 5161545, 5162396, 5161223, 5162314, 5163306, 5163529, 5157232, 5165488, 5165340, 5164067, 5159896, 5154070, 5164259, 5164363, 5164018, 5167080, 5167187, 5169389, 5166238, 5164642, 5167478, 5154894, 5167009, 5169489, 5170362, 5171989, 5167409, 5169139, 5165139, 5171431, 5158578, 5167407, 5167365, 5171379, 5171464, 5156878, 5172324, 5168478, 5171512, 5172649, 5170798, 5172977, 5171473, 5171533, 5125780, 5171295, 5171489, 5170954, 5172196, 5144986, 5167646, 5173011, 5157704, 5171770];
        let CRN_list = [5079871, 5086742, 5080413];

        let ud_cond = {
            'Insurer_Id': 1,
            'Last_Status': {$in: ['TRANS_SUCCESS_WITH_POLICY', 'TRANS_SUCCESS_WO_POLICY']},
            'PB_CRN': {$in: CRN_list}
        };
        if (req.query['live'] === 'yes') {
            ud_cond = {
                'Insurer_Id': 1,
                'Last_Status': {$in: ['TRANS_SUCCESS_WITH_POLICY', 'TRANS_SUCCESS_WO_POLICY']},
                'PB_CRN': {$in: CRN_list_1}
            };
        }
        user_data.find(ud_cond, function (err, dblead) {
            try {
                if (err) {
                    console.error('pdf_initiate_bajaj_insurer_2' + err);
                    res.json({Status: "error", msg: err});
                } else {
                    if (dblead.length > 0) {
                        var Client = require('node-rest-client').Client;

                        let url_api = config.environment.weburl + '/quote/pdf_initiate';
                        let arr_processed = [];
                        for (let j in dblead) {
                            let client = new Client();
                            let user = dblead[j]._doc;

                            let policy_number = user.Transaction_Data.policy_number;

                            let args = {
                                data: {},
                                headers: {
                                    "Content-Type": "application/json",
                                    "secret_key": user['Premium_Request']['secret_key'],
                                    "client_key": user['Premium_Request']['client_key']
                                }
                            };
                            if (user.hasOwnProperty('Pdf_Request') === false && user.hasOwnProperty('Verification_Request')) {
                                args['data'] = {
                                    "api_reference_number": user['Verification_Request']['api_reference_number'],
                                    "search_reference_number": user['Request_Unique_Id'] + "_" + user['User_Data_Id'],
                                    "policy_number": policy_number,
                                    "secret_key": user['Premium_Request']['secret_key'],
                                    "client_key": user['Premium_Request']['client_key'],
                                    "insurer_id": user.Insurer_Id,
                                    "crn": user['PB_CRN'],
                                    "method_type": "Pdf",
                                    "execution_async": "no",
                                    "udid": user['User_Data_Id']
                                };
                                arr_processed.push(user['PB_CRN'] + ':::' + user.Modified_On.toLocaleString());
                            }

                            if (false) {
                                arr_processed.push(user['PB_CRN']);
                                args['data'] = user.Pdf_Request;
                                args['data']['udid'] = user['User_Data_Id'];
                            }
                            client.post(url_api, args, function (data, response) {});
                        }
                        res.json({Status: "Success", 'list': arr_processed, 'cnt': arr_processed.length, 'total': dblead.length});
                    } else {
                        res.json({Status: "Data not Found"});
                    }
                }
            } catch (e) {
                console.error('pdf_initiate_bajaj_insurer_1' + e.stack);
                res.json({Status: "exception", msg: e.stack});
            }
        });
    } catch (e) {
        console.error('pdf_initiate_bajaj_insurer_1' + e.stack);
        res.json({Status: "failed", msg: e.stack});
    }
});

router.post('/standalone_payments/customer_data', function (req, res) {
    try {
        var standalon_payment = require('../models/standalone_payment');
        let objReq = req.body;
        if (objReq && objReq.vehicle_reg_no) {
            standalon_payment.findOne({'vehicle_reg_no': objReq.vehicle_reg_no, 'status': 'Success'}, function (err, objDbData) {
                if (err) {
                    res.json({
                        Status: 'Error',
                        Msg: err.stack
                    });
                } else {
                    if (objDbData && objDbData.status && objDbData.status === "Success") {
                        res.json({
                            Status: 'Fail',
                            Msg: 'Payment Already Completed'
                        });
                    } else {
                        if (objDbData && objDbData._doc) {
                            objDbData['cc'] = objReq.cc;
                            objDbData['premium_amount'] = objReq.premium_amount;
                            objDbData['name'] = objReq.name;
                            objDbData['mobile'] = objReq.mobile;
                            objDbData['email'] = objReq.email;
                            objDbData['address'] = objReq.address;
                            objDbData['Modefied_On'] = new Date();
                            objDbData['insurer_id'] = objReq.insurer_id;
                            objReq = objDbData;
                        } else {
                            objReq.status = 'Pending';
                            objReq.product_id = 10;
                            objReq.Created_On = new Date();
                            objReq.Modefied_On = new Date();
                        }
                        var spObj = new standalon_payment(objReq);
                        spObj.save(function (err, spData) {
                            if (err) {
                                res.json({
                                    Status: 'Error',
                                    Msg: err.stack
                                });
                            }
                            if (spData && spData._doc) {
                                var Payment = {};
                                var merchant_key = ((config.environment.name === 'Production') ? 'o7LxX9fJ' : 'BC50nb');
                                var salt = ((config.environment.name === 'Production') ? 'c6ob2Q7Wb4' : 'Bwxo1cPe');
                                var merchant_id = ((config.environment.name === 'Production') ? '6867635' : '4825050');//SBI Credentials 6867635
                                var amount = (((config.environment.testing_ssid).indexOf(parseInt(spData.QData.ss_id)) > -1) ? '2' : spData.premium_amount);//spData.premium_amount;
                                var productinfo = {paymentParts: [{name: 'splitId1', merchantId: merchant_id, value: amount, commission: '0.00', description: 'splitId1 summary'}]};
                                var hashSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10';
                                var str = hashSequence.split('|');
                                var txnid = spData.vehicle_reg_no;
                                var hash_string = '';
                                for (var hash_var in str) {
                                    if (str[hash_var] === "key")
                                    {
                                        hash_string = hash_string + merchant_key;
                                        hash_string = hash_string + '|';
                                    } else if (str[hash_var] === "txnid")
                                    {
                                        hash_string = hash_string + txnid;
                                        hash_string = hash_string + '|';
                                    } else if (str[hash_var] === "amount")
                                    {
                                        hash_string = hash_string + amount;
                                        hash_string = hash_string + '|';
                                    } else if (str[hash_var] === "productinfo")
                                    {
                                        hash_string = hash_string + JSON.stringify(productinfo);
                                        hash_string = hash_string + '|';
                                    } else if (str[hash_var] === "firstname")
                                    {
                                        hash_string = hash_string + spData.name;
                                        hash_string = hash_string + '|';
                                    } else if (str[hash_var] === "email")
                                    {
                                        hash_string = hash_string + spData.email;
                                        hash_string = hash_string + '|';
                                    } else
                                    {
                                        hash_string = hash_string + '';
                                        hash_string = hash_string + '|';
                                    }
                                }
                                hash_string = hash_string + salt;
                                var crypto = require('crypto');
                                var hash = crypto.createHash("sha512").update(hash_string).digest("hex").toLowerCase();
                                var pg_data = {
                                    'firstname': spData.name,
                                    'lastname': '',
                                    'surl': ((config.environment.name === 'Production') ? 'http://horizon.policyboss.com' : 'http://qa-horizon.policyboss.com') + '/standalone_payment_status/' + txnid + '/' + spData.standalone_payment_id, //
                                    'phone': spData.mobile,
                                    'key': merchant_key,
                                    'hash': hash,
                                    'curl': ((config.environment.name === 'Production') ? 'http://horizon.policyboss.com' : 'http://qa-horizon.policyboss.com') + '/standalone_payment_status/' + txnid + '/' + spData.standalone_payment_id, //
                                    'furl': ((config.environment.name === 'Production') ? 'http://horizon.policyboss.com' : 'http://qa-horizon.policyboss.com') + '/standalone_payment_status/' + txnid + '/' + spData.standalone_payment_id, //
                                    'txnid': txnid,
                                    'productinfo': JSON.stringify(productinfo),
                                    'amount': amount,
                                    'email': spData.email,
                                    'SALT': salt,
                                    'service_provider': "payu_paisa"
                                };
                                Payment.pg_data = pg_data;
                                Payment.pg_url = ((config.environment.name === 'Production') ? 'https://secure.payu.in/_payment' : 'https://test.payu.in/_payment');
                                Payment.pg_redirect_mode = 'POST';
                                standalon_payment.update({'vehicle_reg_no': txnid, 'standalone_payment_id': spData.standalone_payment_id}, {$set: {'pg_data': Payment}}, {multi: false}, function (err, numAffected) {

                                });
                                res.json({
                                    Status: 'Success',
                                    Msg: Payment
                                });
                            } else {
                                res.json({
                                    Status: 'Fail',
                                    Msg: spData
                                });
                            }
                        });
                    }
                }
            });
        } else {
            res.json({
                Status: 'Fail',
                Msg: ''
            });
        }
    } catch (e) {
        res.json({
            Status: 'Error',
            Msg: e.stack
        });
    }

});
router.post('/standalone_payments/pg', function (req, res) {
    try {
        let objReq = req.body;
        let reg_no = objReq.reg_no;
        let pg_id = objReq.pg_id - 0;

        this.objReq = objReq;
        var standalon_payment = require('../models/standalone_payment');
        standalon_payment.findOne({'vehicle_reg_no': reg_no, 'standalone_payment_id': pg_id}, function (err, dataSP) {
            try {
                if (dataSP && dataSP._doc && dataSP._doc.hasOwnProperty('Horizon_Status') && (dataSP._doc['Horizon_Status'] === "PAYMENT_SUCCESS" || dataSP._doc['Horizon_Status'] === "FASTLANE_DONE"
                        || dataSP._doc['Horizon_Status'] === "PREMIUM_SEARCH" || dataSP._doc['Horizon_Status'] === "PREMIUM_EXCEPTION" || dataSP._doc['Horizon_Status'] === "PREMIUM_SUCCESS"
                        || dataSP._doc['Horizon_Status'] === "PROPOSAL_EXCEPTION" || dataSP._doc['Horizon_Status'] === "PROPOSAL_SUCCESS" || dataSP._doc['Horizon_Status'] === "VERIFICATION_EXCEPTION"
                        || dataSP._doc['Horizon_Status'] === "VERIFICATION_SUCCESS" || dataSP._doc['Horizon_Status'] === "TRANS_SUCCESS_WO_POLICY" || dataSP._doc['Horizon_Status'] === "TRANS_SUCCESS_WITH_POLICY")) {
                    res.json({
                        Status: 'Success',
                        Msg: ''
                    });
                } else {
                    var objRequset = this.objReq;
                    var reg_no = objRequset.reg_no;
                    var pg_id = objRequset.pg_id - 0;
                    var status = 'Fail';
                    var pg_status = "PAYMENT_FAIL";
                    if (objRequset && objRequset.pg_post && objRequset.pg_post.status && objRequset.pg_post.status === "success") {
                        pg_status = "PAYMENT_SUCCESS";
                        status = 'Success';
                    }
                    standalon_payment.update({'vehicle_reg_no': reg_no, 'standalone_payment_id': pg_id}, {$set: {'pg_get': objRequset.pg_get, 'pg_post': objRequset.pg_post, 'status': status, Horizon_Status: pg_status}}, {multi: false}, function (err, numAffected) {
                        if (err) {
                            res.json({
                                Status: 'Error',
                                Msg: err.stack
                            });
                        } else {
                            if (numAffected && numAffected.nModified > 0) {
                                res.json({
                                    Status: 'Success',
                                    Msg: numAffected
                                });
                            } else {
                                res.json({
                                    Status: 'Fail',
                                    Msg: numAffected
                                });
                            }
                        }
                    });
                }

            } catch (e) {
                res.json({
                    Status: 'Error',
                    Msg: e.stack
                });
            }
        });
    } catch (e) {
        res.json({
            Status: 'Error',
            Msg: e.stack
        });
    }

});
router.post('/standalone_payments/save_logs', function (req, res) {
    try {
        var pg_id = req.body['standalone_payment_id'] ? req.body['standalone_payment_id'] - 0 : 0;
        var reg_no = req.body['vehicle_reg_no'] ? req.body['vehicle_reg_no'] : "";
        req.body['Modefied_On'] = new Date();
        if (isNaN(pg_id) === false && pg_id > 0 && reg_no !== "") {
            if (req.body && req.body.is_fastlane === false && req.body.email) {
                var Email = require('../models/email');
                var objModelEmail = new Email();
                var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-' + reg_no + ' EDELWEISS TWO WHEELER SATP QUICK ';
                email_body = '<html><body><p>Hi,</p><BR/><p>Please find the below URL to fill the rquired data to proceed further</p>'
                        + '<BR><p>URL : ' + (config.environment.portalurl) + '/TwoWheeler/vehicleDetails.html?pg_id=' + pg_id + ' </p></body></html>';
                objModelEmail.send('noreply@policyboss.com', req.body.email, sub, email_body, '', '', ''); //UAT
            }
            var standalon_payment = require('../models/standalone_payment');
            standalon_payment.update({'vehicle_reg_no': reg_no, 'standalone_payment_id': pg_id}, {$set: req.body}, {multi: false}, function (err, numAffected) {
                if (err) {
                    res.json({
                        Status: 'Error',
                        Msg: err.stack
                    });
                } else {
                    if (numAffected && numAffected.nModified > 0) {
                        res.json({
                            Status: 'Success',
                            Msg: numAffected
                        });
                    } else {
                        res.json({
                            Status: 'Fail',
                            Msg: numAffected
                        });
                    }
                }
            });
        } else {
            res.json({
                Status: 'Fail',
                Msg: pg_id
            });
        }
    } catch (e) {
        res.json({
            Status: 'Error',
            Msg: e.stack
        });
    }
});

router.post('/getFilterFinalAdvisory', function (req, res) {
    try {
        let Client = require('node-rest-client').Client;
        let client = new Client();
        let objReq = req.body;
        let filterBenefits = objReq.filter_benefits.split(",");
        let insurer_id = parseInt(objReq.insurer_id);
        let plan_id = parseInt(objReq.plan_id);
        var health_si = objReq.health_si;
        let is_existing = objReq.is_existing;
        let ScoreMaster = [];
        let planBenefits = [];
        if (fs.existsSync(appRoot + "/tmp/cachemaster/advisory_score_master.log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/advisory_score_master.log").toString();
            ScoreMaster = JSON.parse(cache_content);
        } else {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                if (err)
                    throw err;
                let score_master = db.collection('health_benefits_score_master');
                score_master.find({}, {_id: 0}).toArray(function (err, scoreMaster) {
                    if (err) {
                        res.send(err);
                    } else {
                        ScoreMaster = scoreMaster;
                        fs.writeFile(appRoot + "/tmp/cachemaster/advisory_score_master.log", JSON.stringify(scoreMaster), function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                    }
                });
            });
            sleep(500);
        }
        let insWeight = require('../resource/request_file/AdvisoryInsurerWeight.json');

        let final_advisory = 0;
        let insWtIndex = insWeight.findIndex(a => a.Insurer_Id === insurer_id);
        let url = "https://horizon.policyboss.com:5443/benefits/" + insurer_id + "/" + plan_id + "/undefined/" + health_si;
        client.get(url, function (data, response) {
            if (data.length > 0) {
                let total_score = 0;
                let wt_percent = insWeight[insWtIndex].Weightage_Percent / 100;
                for (let j = 0; j < data.length; j++) {
                    let objKey = ScoreMaster.findIndex(s => s['Feature Key'].toUpperCase() === data[j].Benefit_Key.toUpperCase() && s['Feature Value'].toUpperCase() === data[j].Benefit_Value.toUpperCase());
                    if (objKey > -1) {
                        for (let b = 0; b < filterBenefits.length; b++) {
                            if (filterBenefits[b].trim() === ScoreMaster[objKey]['Feature Key']) {
                                total_score += ScoreMaster[objKey]['FeatureWeightedScore'];
                                final_advisory += ScoreMaster[objKey]['Feature Score'];
                            }
                        }
                        planBenefits.push(data[j]);
                    }
                }
                let final_score = Number(((final_advisory / filterBenefits.length) * wt_percent).toFixed(1));
                final_advisory = final_score > 5 ? 5 : final_score;
                total_score = Number(total_score.toFixed(1));
                res.json({"Insurer_Id": insurer_id, "Plan_Id": plan_id, "Final_Advisory": final_advisory, "Is_Existing": is_existing, "Benefits": planBenefits});
            } else {
                res.json({"Msg": "Not found"});
            }
        });
    } catch (ex) {
        console.error('Exception in Filter Advisory Score-', ex);
    }
});

router.post('/save_content_data', function (req, res) {
    try {
        var obj = {
            "Title": req.body['title'],
            "Blog_Title": req.body['blog_title'],
            "URL": req.body['URL'],
            "Content": req.body['Content'],
            "Keywords": req.body['Keywords'],
            "Description": req.body['Description'],
            "Ui_Version": req.body['ui_version'],
            "Type": req.body['Type'],
            "Category": req.body['Category'],
            "Author": req.body['Author'],
            "Blog_Date": req.body['Blog_Date'],
            "Source": req.body['Source'],
            "Image": req.body['Image']
        };
        var save_type;
        var current_date = new Date();
        var version_val = moment(current_date).format('DDMMYYYYkkmmss');  //ddmmyyyyhhmmss
        var objData = {
            "ss_id": parseInt(req.body['ss_id']),
            "fba_id": parseInt(req.body['fba_id']),
            "Created_On": current_date,
            "Modified_On": current_date,
            "Created_By": parseInt(req.body['ss_id']),
            "Is_Active": 1,
            "Is_Preview": 1,
            "Version": parseInt(version_val),
            "Title": req.body['title'],
            "Blog_Title": req.body['blog_title'],
            "URL": req.body['URL'],
            "Content": req.body['Content'],
            "Keywords": req.body['Keywords'],
            "Description": req.body['Description'],
            "Ui_Version": req.body['ui_version'],
            "Type": req.body['Type'],
            "Category": req.body['Category'],
            "Author": req.body['Author'],
            "Source": req.body['Source'],
            "Image": req.body['Image'],
            "Blog_Date": req.body['Blog_Date'] ? new Date(req.body['Blog_Date']) : ""
        };
        if (req.body['data_val'] === "save" || req.body['data_val'] === "edit_save") {
            objData['Status'] = "Draft";
        } else if (req.body['data_val'] === "publish") {
            objData['Status'] = "Publish";
        }
        save_type = req.body['data_val'];
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            if (err)
                throw err;
            var content_management = db.collection('content_managements');
            autoIncrement.getNextSequence(db, 'content_managements', function (err1, autoIndex) {
                if (err1)
                    throw err;
                if (save_type === "save") {
                    objData.Content_Id = autoIndex;
                    if (objData['Type'] === 'BLOG') {
                        var blog_detail_file_path = appRoot + "/tmp/blog/blog-detail.html";
                        var htmlBlogDetail = fs.readFileSync(blog_detail_file_path, 'utf8');
                        let categoryTitleCase = (objData.Category).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        var replaceBlogJsondata = {
                            '___title___': objData.Blog_Title,
                            '___category___': objData.Category,
                            '___category_titlecase___': categoryTitleCase,
                            '___blog_date___': (objData.Blog_Date && objData.Blog_Date !== "" ? moment(objData.Blog_Date).format('ll') : ""),
                            '___content___': objData.Content,
                            '___author_source___': (objData.Author ? "Author" : objData.Source ? "Source" : ""),
                            '___author_source_value___': (objData.Author ? objData.Author : objData.Source ? objData.Source : ""),
                            '___img_url___': objData.Image ? objData.Image : ""
                        };
                        objData.Content = htmlBlogDetail.toString().replaceJson(replaceBlogJsondata);
                    }
                    content_management.insertOne(objData, function (err, data1) {
                        try {
                            if (err) {
                                res.json({'Msg': 'Error in data save', Status: 'Fail'});
                            } else {
                                if (objData['Type'] === 'BLOG') {
                                    let local_path = appRoot + "/tmp/" + "cms_urls.json";
                                    if (fs.existsSync(local_path)) {
                                        fs.readFile(local_path, function (err, data) {
                                            if (err) {
                                                console.error('Exception while reading cms_urls.json file');
                                            } else {
                                                try {
                                                    let ob = JSON.parse(data.toString());
                                                    let url = objData['URL'];
                                                    let newurl = ""
                                                    if (url.indexOf('UI22') > -1 || url.indexOf('ui22') > -1) {
                                                        let n = url.split('/');
                                                        url = "/" + n.slice(1).join('/');
                                                    }
                                                    ob['routes'].push(url);
                                                    fs.writeFile(local_path, JSON.stringify(ob), function (err, response) {
                                                        if (err) {
                                                            console.error('Exception while writing cms_urls.json file');
                                                        }
                                                    });
                                                } catch (ex) {
                                                    console.error("Exception while writing in cms_urls.json", ex.stack);
                                                }
                                            }
                                        });
                                    }
                                    res.json({'Msg': 'Data Saved Succesfully!!!', Status: 'Success'});
                                } else {
                                    res.json({'Msg': 'Data Saved Succesfully!!!', Status: 'Success'});
                                }
                            }
                        } catch (ex) {
                            console.error("Exception in /save_content_data", ex.stack);
                            res.json({'Msg': 'Data Saved Succesfully!!!', Status: 'Success'});
                        }
                    });
                } else if (save_type === "publish") {
                    var obj = {
                        //"ss_id": parseInt(req.body['ss_id']),
                        "Status": "Publish",
                        "URL": req.body['URL']
                    };
                    content_management.find(obj).toArray(function (err, data1) {
                        if (data1.length > 0) {
                            var objFinal = {
                                "Status": "Archived"
                            };
                            content_management.update({'Status': 'Publish', 'URL': req.body['URL']}, {$set: objFinal}, function (err, numAffected) {
                                if (err) {
                                    res.json({'Msg': 'Error'});
                                } else {
                                    var Newobj = {
                                        "URL": req.body['URL'],
                                        "Title": req.body['title'],
                                        "Keywords": req.body['Keywords'],
                                        "Description": req.body['Description']
                                    };
                                    content_management.find(Newobj).toArray(function (err, data1) {
                                        if (data1.length > 0) {
                                            var objpublish = {
                                                "Status": "Publish"
                                            };
                                            content_management.update(Newobj, {$set: objpublish}, function (err, numAffected) {
                                                if (err) {
                                                    res.json({'Msg': 'Data not found, Please save data first'});
                                                } else {
                                                    res.json({'Msg': 'Data Publish Succesfully !!!'});
                                                }
                                            });
                                        } else {
                                            res.json({'Msg': 'Error'});
                                        }
                                    });
                                }
                            });
                        } else {
                            var Newobj = {
                                "URL": req.body['URL'],
                                "Title": req.body['title'],
                                "Keywords": req.body['Keywords'],
                                "Description": req.body['Description']
                            };
                            content_management.find(Newobj).toArray(function (err, data1) {
                                if (data1.length > 0) {
                                    var objpublish = {
                                        "Status": "Publish"
                                    };
                                    content_management.update(Newobj, {$set: objpublish}, function (err, numAffected) {
                                        if (err) {
                                            res.json({'Msg': 'Data not found, Please save data first'});
                                        } else {
                                            res.json({'Msg': 'Data Publish Succesfully !!!'});
                                        }
                                    });
                                } else {
                                    res.json({'Msg': 'Data not found, Please save data first'});
                                }
                            });
                        }
                    });
                } else if (save_type === "edit_save") {
                    objData.Content_Id = autoIndex;
                    if (req.body['old_status_val'] == "Draft") {
                        var findobj = {
                            "URL": req.body['old_url_val'],
                            "Content_Id": parseInt(req.body['ContentId'])
                        };
                        content_management.find(findobj).toArray(function (err, data1) {
                            if (data1.length > 0) {
                                var objedit = {
                                    "Title": req.body['title'],
                                    "URL": req.body['URL'],
                                    "UI_Source": "UI22",
                                    "Content": req.body['Content'],
                                    "Keywords": req.body['Keywords'],
                                    "Description": req.body['Description'],
                                    "Type": req.body['Type'],
                                    "Category": req.body['Category'],
                                    "Author": req.body['Author'],
                                    "Source": req.body['Source'],
                                    "Image": req.body['Image'],
                                    "Blog_Date": req.body['Blog_Date'] ? new Date(req.body['Blog_Date']) : ""

                                };
                                if (req.body['Content'] !== data1[0]['Content']) {
                                    objedit["Version"] = parseInt(version_val);
                                }
                                content_management.update(findobj, {$set: objedit}, function (err, numAffected) {
                                    if (err) {
                                        res.json({'Msg': 'Data Not Saved, Please Update Data Again'});
                                    } else {
                                        res.json({'Msg': 'Data Saved Succesfully!!!', Status: 'Success'});
                                    }
                                });
                            } else {
                                res.json({'Msg': 'Data Not Found'});
                            }
                        });
                    } else {
                        content_management.insertOne(objData, function (err, data1) {
                            if (err) {
                                res.json({'Msg': 'Error in data save', Status: 'Fail'});
                            } else {
                                res.json({'Msg': 'Data Saved Succesfully!!!', Status: 'Success'});
                                /*var obj = {
                                 //"ss_id": parseInt(req.body['ss_id']),
                                 "URL": req.body['old_url_val']
                                 };
                                 content_management.find(obj).toArray (function (err, data1) {
                                 if (data1.length > 0) {
                                 var objeditsave = {
                                 "Status" : "Draft"
                                 };
                                 content_management.updateMany({'URL': req.body['old_url_val']}, {$set: objeditsave}, function (err, numAffected) {
                                 if (err) {
                                 res.json({'Msg': 'Data not found, Please save data first'});
                                 }else{
                                 res.json({'Msg': 'Data Saved Succesfully!!!', Status: 'Success'});
                                 }
                                 });
                                 } else {
                                 res.json({'Msg': ''});
                                 }
                                 });*/
                            }
                        });
                    }
                } else if (save_type === "edit_publish") {
                    var obj = {
                        "Status": "Publish",
                        "URL": req.body['old_url_val']
                    };
                    content_management.find(obj).toArray(function (err, data1) {
                        if (data1.length > 0) {
                            var objeditFinal = {
                                "Status": "Archived"
                            };
                            var editObj = {
                                "Status": "Publish",
                                "URL": req.body['old_url_val']
                            };
                            content_management.update(editObj, {$set: objeditFinal}, function (err, numAffected) {
                                if (err) {
                                    res.json({'Msg': 'Data not found, Please save data first'});
                                } else {
                                    var obj = {
                                        "URL": req.body['URL'],
                                        "Title": req.body['title'],
                                        "Keywords": req.body['Keywords'],
                                        "Description": req.body['Description'],
                                        //"Content_Id" : parseInt(req.body['ContentId'])
                                        "Status": {$ne: "Archived"}
                                    };
                                    content_management.find(obj).toArray(function (err, data1) {
                                        if (data1.length > 0) {
                                            var objpublish = {
                                                "Status": "Publish"
                                            };
                                            var updateNew = {
                                                "Content_Id": data1[0]['Content_Id'],
                                                "URL": req.body['URL'],
                                                "Title": req.body['title']
                                            };
                                            content_management.update(updateNew, {$set: objpublish}, function (err, numAffected) {
                                                if (err) {
                                                    res.json({'Msg': 'Data not found, Please save data first'});
                                                } else {
                                                    res.json({'Msg': 'Data Publish Succesfully !!!'});
                                                }
                                            });
                                        } else {
                                            res.json({'Msg': 'Error'});
                                        }
                                    });
                                }
                            });
                        } else {
                            var obj = {
                                "URL": req.body['URL'],
                                "Title": req.body['title'],
                                "Keywords": req.body['Keywords'],
                                "Description": req.body['Description']
                            };
                            content_management.find(obj).toArray(function (err, data1) {
                                if (data1.length > 0) {
                                    var objArchived = {
                                        "Status": "Archived"
                                    };
                                    content_management.updateMany(obj, {$set: objArchived}, function (err, numAffected) {
                                        if (err) {
                                            res.json({'Msg': 'Data not found, Please save data first'});
                                        } else {
                                            obj['Content_Id'] = parseInt(req.body['ContentId']);
                                            var objpublish = {
                                                "Status": "Publish"
                                            };
                                            content_management.update(obj, {$set: objpublish}, function (err, numAffected) {
                                                if (err) {
                                                    res.json({'Msg': 'Data not found, Please save data first'});
                                                } else {
                                                    res.json({'Msg': 'Data Publish Succesfully !!!'});
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    res.json({'Msg': 'Error'});
                                }
                            });
                        }
                    });
                }
            });
        });
    } catch (ex) {
        console.error("Exception in /save_content_data", ex.stack);
        res.json({'Msg': 'Exception !!!', Status: 'Fail', "Error": ex.stack});
    }
});
router.get('/get_cms_urls', function (req, res) {
    try {
        let local_path = appRoot + "/tmp/" + "cms_urls.json";
        if (fs.existsSync(local_path)) {
            fs.readFile(local_path, function (err, data) {
                if (err) {
                    console.error('Exception while reading cms_urls.json file');
                } else {
                    try {
                        let ob = JSON.parse(data.toString());
                        res.json({'Msg': 'File Found', Status: 'Success', 'data': ob});
                    } catch (ex) {
                        console.error("Exception while Fetching cms_urls.json", ex.stack);
                    }
                }
            });
        } else {
            res.json({'Msg': 'File Not Found', Status: 'Success'});
        }

    } catch (ex) {
        console.error("Exception in /get_cms_urls", ex.stack);
        res.json({'Msg': 'Exception !!!', Status: 'Fail', "Error": ex.stack});
    }

});
router.post('/getContentDetails', function (req, res) {
    try
    {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            //select: 'ss_id fba_id Ui_Version Is_Preview Is_Active Status Title URL Content Keywords Description Content_Id',
//            sort: {'Created_On': -1},
            sort: {},
            lean: true,
            page: 1,
            limit: 10
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var objRequest = req.body;
        var filter = obj_pagination.filter;
        var ss_id = parseInt(objRequest["ss_id"]);
        if ([1450].indexOf(ss_id) > -1) {/** for santosh sir marketing team */
            filter['$or'] = [
                {'Status': 'Publish'},
                {'Status': 'UnPublish'}
            ];
        } else {
            filter = {
                //"ss_id": ss_id,
                "Status": "Publish"
            };
        }
        if (req.body && req.body.order && req.body.order.length > 0) {
            var orderColumnIndex = req.body.order[0].column;
            var orderDirection = req.body.order[0].dir;
            var columnName = ['Action', 'ss_id', 'Type', 'Category', 'Title', 'URL', 'Keywords', 'Description', 'Status', 'Author', 'Source', 'Image'];
            var column = columnName[orderColumnIndex];
            if (orderColumnIndex == 0) {
                var databaseColumnIndex = "Created_On";
                optionPaginate.sort[databaseColumnIndex] = -1;
            } else {
                databaseColumnIndex = column;
                optionPaginate.sort[databaseColumnIndex] = (orderDirection === 'asc') ? 1 : -1;

            }
        }else{
           optionPaginate.sort['Created_On'] = -1; 
        }

        if (req && req.body && req.body.search_by && req.body.search_by !== '') {
            if ((['Type', 'Category', 'Title', 'URL'].indexOf(req.body.search_by) > -1) && (req.body.search_byvalue && req.body.search_byvalue !== '')) {
                filter[req.body.search_by] = new RegExp(req.body['search_byvalue'], 'i');
            }

        }
        var content_management = require('../models/content_management');
        content_management.paginate(filter, optionPaginate).then(function (dbCMS) {
            res.json(dbCMS);
        });

    } catch (err) {
        console.error(err.stack);
        res.json({'msg': 'error'});
    }
});
router.post('/get_review_data', function (req, res) {
    var objData = {
        "ss_id": parseInt(req.body['ss_id']),
        "Draft_Data.Title": req.body['title']
    };
    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
        if (err)
            throw err;
        var content_management = db.collection('content_managements');
        content_management.find(objData).toArray(function (err, data1) {
            if (data1.length > 0) {
                var fs = require('fs');
                var appRoot = path.dirname(path.dirname(require.main.filename));
                var html_file_path = appRoot + "/CMS/content_management.html"; //for UAT
                var html_pdf_file_path = appRoot + "/CMS/" + "Content_Management_" + data1[0].ss_id + "_" + data1[0].Content_Id + '.html';
                var htmlPol = fs.readFileSync(html_file_path, 'utf8');
                var replacecorporatedata = {
                    '___title_val___': data1[0].Draft_Data.Title,
                    '___header_val___': data1[0].Draft_Data.Header,
                    '___name_val___': data1[0].Draft_Data.name,
                    '___mobile___': data1[0].Draft_Data.mobile,
                    '___email___': data1[0].Draft_Data.email
                };
                htmlPol = htmlPol.toString().replaceJson(replacecorporatedata);

                var request_html_file = fs.writeFileSync(html_pdf_file_path, htmlPol);
                res.send({html_pdf_file_path});
                //res.redirect(html_pdf_file_path);
            } else {
                res.json({'msg': 'Data not found, Please save data first'});
            }
        });
    });
});

router.get('/get_campaign_data', function (req, res) {
    var campaign = require('../models/posp_reequipment_campaign');
    campaign.find(function (err, obj) {
        if (err) {
        } else {
            res.json(obj);
        }
    });
});

router.post('/update_posp_enquiry', function (req, res, next) {
    var objRequest = req.body;
    var camp_id = objRequest["campaign_id"];
    let file = "";
    let file_ext = "";
    var sleep = require('system-sleep');
    var fs = require('fs');
    var path1 = require('path');
    var MongoClient = require('mongodb').MongoClient;
    var appRoot = path1.dirname(path1.dirname(require.main.filename));
    let path = appRoot + "/tmp/posp_enquiry_data";
    file = decodeURIComponent(objRequest["file"]);
    file_ext = objRequest["file_ext"];
    let fileName = path + '/posp_enquiry_data.' + file_ext;
    var data = file.replace(/^data:image\/\w+;base64,/, "");
    if (data === "") {
    } else {
        let buf = new Buffer(data, 'base64');
        fs.writeFile(fileName, buf);
    }
    sleep(5000);
    let file_excel = appRoot + "/tmp/posp_enquiry_data/posp_enquiry_data." + file_ext;
    let XLSX = require('xlsx');
    let workbook = XLSX.readFile(file_excel);
    let sheet_name_list = workbook.SheetNames;
    var requestObj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    try {
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            var posp_enquiry = db.collection('posp_enquiries');
            if (requestObj.length > 0) {
                for (var k in requestObj) {
                    requestObj[k]["Source"] = "POSP-WEB";
                    requestObj[k]["Campgin_Id"] = parseInt(camp_id);
                }
            }
            console.log(requestObj);
            posp_enquiry.insertMany(requestObj, function (err, res1) {
                if (err) {
                    res.json({'Status': "error"});
                } else {
                    res.json({'Status': "Success"});
                }
            });
        });
    } catch (err) {
        console.log(err);
        res.json({'msg': 'error'});
    }
});

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

function LoadSession_formidable(req, res, next) {

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
        console.error('Exception', 'LoadSession', e);
        return next();

    }
}
function randomString(length, chars) {
    chars = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
function jsonToQueryString(json) {
    return  Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
    }).join('&');
}
function stringToQueryJSON(json) {
    var jsonstring = decodeURIComponent(json);

    return JSON.parse(jsonstring);
}



function calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
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
        console.error('Exception', 'LoadSession', e);
        return next();

    }
}
function file_saved(files, Corporate_Lead_Id) {
    // files

    let file_name = "";
    if (files.hasOwnProperty('Floater_Location_list')) {

        file_name = files['Floater_Location_list'].name;
        let path = appRoot + "/tmp/corporate_lead/";
        let pdf_sys_loc_horizon = path + Corporate_Lead_Id + '/' + file_name;
        let oldpath = files['Floater_Location_list'].path;
        console.error('pdf_sys_loc_horizon_lms', pdf_sys_loc_horizon);
        console.error('oldpath_lms', oldpath);
        if (fs.existsSync(path + Corporate_Lead_Id))
        {
        } else
        {
            fs.mkdirSync(path + Corporate_Lead_Id);
        }
        fs.readFile(oldpath, function (err, data) {
            if (err) {
                console.error('Read', err);
            }
            console.log('File read!');
            console.error('File read_lms');
            // Write the file
            fs.writeFile(pdf_sys_loc_horizon, data, function (err) {
                if (err) {
                    console.error('Write', err);
                } else {
                    console.error('Writefile');
                }
            });
            // Delete the file
            fs.unlink(oldpath, function (err) {
                if (err)
                    throw err;
                console.log('File deleted!');
                console.error('File deleted_lms');
            });
        });



    }
    return file_name;
}
function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}
router.post('/app_visitor/save_data', function (req, res) {
    try {
        let AppVisitors = require('../models/app_visitor');
        let AppVisitors_history = require('../models/app_visitor_history');
        req.body.Created_On = new Date();
        req.body.Modified_On = new Date();
        req.body.Last_Activity_On = new Date();
        let AppVisitors_data = new AppVisitors(req.body);
        AppVisitors_data.save(function (err, objDB) {
            if (err) {
                res.json({'Msg': err, 'Status': "Error"});
            } else {
                if (req.body.hasOwnProperty('Last_Visited_Url')) {
                    let visitor_history = {
                        "visitor_Id": objDB._doc.visitor_Id,
                        "visited_url": req.body.Last_Visited_Url,
                        "visited_on": new Date(),
                        "device_type": req.body.device_type,
                        "user_agent": req.body.user_agent
                    };
                    let app_visit_hist = new AppVisitors_history(visitor_history);
                    app_visit_hist.save(function (err, objVisitHistory) {
                        if (err) {
                            res.json({'Msg': err, 'Status': "Error"});
                        } else {
                            console.log("Success");
                        }
                    });
                }
                res.json({
                    'Msg': "Data Inserted Successfully",
                    'Status': "Success",
                    "visitor_Id": objDB._doc.visitor_Id
                });
            }
        });
    } catch (e) {
        res.send(e.stack);
    }
});


router.post('/app_visitor/update_data/:visitorId', (req, res) => {
    try {
        let id = req.params.visitorId - 0;
        let AppVisitors = require('../models/app_visitor');
        let lastVisitedUrl = req.body.Last_Visited_Url;
        let ss_id = (req.body['ss_id'] === undefined ? '' : parseInt(req.body['ss_id']));
        let fba_id = (req.body['fba_id'] === undefined ? '' : parseInt(req.body['fba_id']));
        let app_type = (req.body['app_type'] === undefined ? '' : req.body['app_type']);
        let device_type = (req.body['device_type'] === undefined ? '' : req.body['device_type']);
        let user_agent = (req.body['user_agent'] === undefined ? '' : req.body['user_agent']);
        let objData = {
            "Modified_On": new Date(),
            "Last_Activity_On": new Date(),
            "Last_Visited_Url": lastVisitedUrl,
            "ss_id": ss_id,
            "fba_id": fba_id,
            "app_type": app_type,
            "device_type": device_type,
            "user_agent": user_agent
        };
        let cond = {
            "visitor_Id": id
        };
        AppVisitors.update(cond, {$set: objData}, function (err, numAffected) {
            if (err) {
                res.json({'Status': 'Fail', 'Msg': 'Error In Updation for Remove' + err});
            } else {
                if (numAffected && numAffected.nModified > 0) {
                    res.json({
                        Status: 'Success',
                        Msg: 'Visitor Updated Succesfully'
                    });
                } else {
                    res.json({
                        Status: 'Fail',
                        Msg: 'Visitor Not Updated'
                    });
                }
            }
        });
    } catch (e) {
        res.send(e.stack);
    }
});


router.post('/app_visitor_history/save_data', function (req, res) {
    try {
        let AppVisitors = require('../models/app_visitor_history');
        let visitor_data = req.body;
        visitor_data.visited_on = new Date();
        visitor_data.visitor_Id = req.body.visitor_Id - 0;
        let AppVisitors_data = new AppVisitors(visitor_data);
        AppVisitors_data.save(function (err, objDB) {
            if (err) {
                res.json({'Msg': err, 'Status': "Error"});
            } else {
                res.json({
                    'Msg': "Data Inserted Successfully in Visitor History",
                    'Status': "Success",
                    "visitor_Id": objDB._doc.visitor_Id
                });
            }
        });
    } catch (e) {
        res.send(e.stack);
    }
});
router.post('/fetch_pospEnquiry_data', LoadSession, function (req, res, next) {
    try {
        var Base = require('../libs/Base');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var objRequest = req.body;

        var optionPaginate = {
            select: 'Posp_Enquiry_Id name mobile email city_name pan last_enquiry_on last_assigned_to last_assigned_by last_assigned_on aadhaar Created_On Disposition_Status Sub_Status Next_Call_Date Disposition_On IIB_Status IIB_Screenshot IIB_Status_On Ss_Id Signup_On Erp_Id Erpcode_On utm_campaign utm_medium utm_source Source',
            sort: {'Created_On': -1},
            lean: true,
            page: 1,
            limit: 10
        };

        var today = moment().utcOffset("+05:30").startOf('Day');
        var fromDate = moment(objRequest.start_date === "" ? today : objRequest.start_date).format("YYYY-MM-D");
        var toDate = moment(objRequest.end_date === "" ? today : objRequest.end_date).format("YYYY-MM-D");

        var arrFrom = fromDate.split('-');
        var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);

        var arrTo = toDate.split('-');
        var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
        dateTo.setDate(dateTo.getDate() + 1);

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.ss_id === 8048 || req.obj_session.user.ss_id === 7860) {
            if (req.obj_session.user.ss_id === 7860) { /** vishakha kadam ss_id for source posp hindi */
                filter['Source'] = 'POSP_Hindi';
            }
        } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
            let arr_ch_ssid = [];
            if (req.obj_session.hasOwnProperty('users_assigned')) {
                arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
            }
            arr_ch_ssid.push(req.obj_session.user.ss_id);
            channel = req.obj_session.user.role_detail.channel;
            filter['$or'] = [
                {'last_assigned_to': {$in: arr_ch_ssid}}
            ];
            console.log(arr_ch_ssid);
        } else {
            let arr_ssid = [];
            if (req.obj_session.hasOwnProperty('users_assigned')) {
                var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                arr_ssid = combine_arr.split(',').filter(Number).map(Number);
            }
            arr_ssid.push(req.obj_session.user.ss_id);
            filter['last_assigned_to'] = {$in: arr_ssid};
            console.log(arr_ssid);
            console.log(filter);
        }
        ;


        var lead = require('../models/posp_enquiry');
        console.error('HorizonPOSPEnquiry', filter, req.body);

        if (objRequest.type) {
            if (objRequest.type === "ss_id") {
                if (objRequest.search_byvalue && objRequest.search_byvalue !== "") {
                    filter["last_assigned_to"] = objRequest.search_byvalue - 0;
                }
            }
            if (objRequest.type === "name") {
                if (objRequest.search_byvalue && objRequest.search_byvalue !== "") {
                    filter["name"] = new RegExp(objRequest.search_byvalue, 'i');
                }
            }
        }
        if (objRequest.date_type) {
            if (objRequest.date_type === 'entry_date') {
                filter['Created_On'] = {$gte: dateFrom, $lt: dateTo};
            }
            if (objRequest.date_type === 'next_call_date') {
                filter['Next_Call_Date'] = {$gte: dateFrom, $lt: dateTo};
            }
            if (objRequest.date_type === 'signup_date') {
                filter['Signup_On'] = {$gte: dateFrom, $lt: dateTo};
            }
            if (objRequest.date_type === 'pos_date') {
                filter['Erpcode_On'] = {$gte: dateFrom, $lt: dateTo};
            }
        }
        if (objRequest.Recruitment_Status && typeof objRequest.Recruitment_Status !== "undefined") {
            if (objRequest.Recruitment_Status === 'SIGNUP_ONLY') {
                filter['Ss_Id'] = {"$exists": true};
                filter['Erp_Id'] = {"$exists": false};
            }
            if (objRequest.Recruitment_Status === 'POS_CODED') {
                filter['Erp_Id'] = {"$exists": true};
            }
        }
        console.log(dateFrom, dateTo);

        lead.paginate(filter, optionPaginate).then(function (user_datas) {
            res.json(user_datas);
        });
    } catch (e) {
        console.error(e);
        res.json({'Msg': e.stack, 'Status': 'fail'});
    }
});

router.post('/create_campaign', function (req, res) {
    try {
        var ObjRequest = req.body;
        console.log("data = " + ObjRequest);
        var posp_reequipment_campaign = require('../models/posp_reequipment_campaign');
//        var MongoClient = require('mongodb').MongoClient;
//        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
//            if (err)
//                throw err;
        var obj = {
            "Campaign_name": ObjRequest.camp_name,
            "Description": ObjRequest.description,
            "Start_date": ObjRequest.start_date,
            "End_date": ObjRequest.end_date,
            "Status": "Active",
            "ss_id": parseInt(ObjRequest.ss_id),
            "fba_id": parseInt(ObjRequest.fba_id),
            "Created_On": new Date(),
            "Modified_On": new Date()
        };
        var campaigns_obj = new posp_reequipment_campaign(obj);
        campaigns_obj.save(function (err1) {
            if (err1)
                res.json({'Msg': "Fail to add campaign"});
            else {
                res.json({'Msg': "campaign added"});
            }
        });
//        });
    } catch (e) {
        console.error(e);
        res.json({'Msg': 'Fail', 'Error': e});

    }
});
router.post('/saveFosData', function (req, res) {
    try {
        var ObjRequest = req.body;
        var fos_registration = require('../models/fos_onboarding');

        fos_registration.find({ss_id: parseInt(ObjRequest["ss_id"])}, function (err, dblmsData) {
            if (err) {
                throw err;
            } else {
                if (dblmsData.length > 0) {
                    res.json({'Msg': 'ss_id already exist', 'Status': 'error'});
                } else {
                    var arg = {
                        'Full_Name': ObjRequest['name'],
                        'Mobile': parseInt(ObjRequest['mobile']),
                        'Email': ObjRequest['email'],
                        'Pan': ObjRequest['pan'],
                        'Aadhar': parseInt(ObjRequest['aadhar']),
                        'Gst': ObjRequest['gst'],
                        'Address_1': ObjRequest['address_1'],
                        'Address_2': ObjRequest['address_2'],
                        'Address_3': ObjRequest['address_3'],
                        'Pincode': parseInt(ObjRequest['pincode']),
                        'City': ObjRequest['city'],
                        'State': ObjRequest['state'],
                        'Account_No': parseInt(ObjRequest['accountNo']),
                        "IFSC_Code": ObjRequest['IFSCCode'],
                        "MICR_Code": parseInt(ObjRequest['MICRCode']),
                        "Bank_Name": ObjRequest['bankName'],
                        "Branch": ObjRequest['branch'],
                        "Bank_City": ObjRequest['bankCity'],
                        "Account_Type": ObjRequest['account'],
                        "Pan_Card": ObjRequest['pancard'],
                        "Aadhar_Card_Front": ObjRequest['aadharcardfront'],
                        "Aadhar_Card_Back": ObjRequest['Aadharcardback'],
                        "Cancelled_Chq": ObjRequest['cancelledchq'],
                        "Gst_Certification": ObjRequest['gstcertification'],
                        "ss_id": parseInt(ObjRequest['ss_id']),
                        "level": "Level1",
                        "status": "Waiting for approved"
                    };
                    var MongoClient = require('mongodb').MongoClient;
                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                        if (err)
                            throw err;
                        var fos_registrations = db.collection('fos_onboardings');
                        fos_registrations.insertOne(arg, function (err, result) {
                            if (err) {
                                res.json({'Msg': 'Data not added', 'Status': 'error'});
                            } else {
                                res.json({'Msg': 'Data Added Successfully', 'Status': 'Success'});
                            }
                        });
                    });
                }
            }
        });
    } catch (e) {
        console.error(e);
        res.json({'Msg': 'Fail', 'Error': e});
    }
});
router.post('/update_fos_status', function (req, res) {
    try {
        var ObjRequest = req.body;
        var fos_registration = require('../models/fos_onboarding');
        var chech_level;
        if (ObjRequest["approver_level"] === "Level2") {
            chech_level = "Level2";
        } else {
            chech_level = ObjRequest["level"];
        }
        var obj = {
            "level": chech_level,
            "status": ObjRequest["status"]
        };
        fos_registration.update({ss_id: parseInt(ObjRequest["ss_id"])}, {$set: obj}, function (err, dblmsData) {
            if (err) {
                res.json({'Msg': 'Fail to Update status', 'Status': 'error'});
            } else {
                res.json({'Msg': 'Status Updated', 'Status': 'success'});
            }
        });
    } catch (e) {
        console.error(e);
        res.json({'Msg': 'Fail', 'Error': e});
    }
});
router.post('/get_posp_lead_data', LoadSession, function (req, res, next) {
    try {
        var Base = require('../libs/Base');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: 'Campgin_name Enqiry_name Mobile Email Date',
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        console.error('HorizonLeadList', filter, req.body);
        var ObjRequest = req.body;

        if (ObjRequest.camp_Name !== "" && ObjRequest.camp_Name !== undefined) {
            filter["Campgin_name"] = ObjRequest.camp_Name;
        }

        var lead = require('../models/posp_lead');
        console.error('HorizonPOSPList', filter, req.body);
        lead.paginate(filter, optionPaginate).then(function (user_datas) {
            res.json(user_datas);
        });
    } catch (e) {
        console.error(e);
        res.json({'Msg': 'error', 'Status': 'fail'});
    }
});
router.post('/fetch_pospLead_data', LoadSession, function (req, res, next) {
    try {
        var Base = require('../libs/Base');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: 'Campgin_name Enqiry_name Mobile Email Date',
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        console.error('HorizonLeadList', filter, req.body);
        var ObjRequest = req.body;

        if (ObjRequest.camp_Name !== "" && ObjRequest.camp_Name !== undefined) {
            filter["Campgin_name"] = ObjRequest.camp_Name;
        }

        var lead = require('../models/posp_lead');
        console.error('HorizonPOSPList', filter, req.body);
        lead.paginate(filter, optionPaginate).then(function (user_datas) {
            res.json(user_datas);
        });
    } catch (e) {
        console.error(e);
        res.json({'Msg': 'error', 'Status': 'fail'});
    }
});
router.post('/wallets/save_csv', function (req, res) {
    try {
        let args = {
            headers: {
                "Content-Type": "application/json"
            },
            data: req.body
        };
        var Client = require('node-rest-client').Client;
        var client = new Client();
        let url_api = config.environment.weburl + "/postservicecall/wallets/getTransactionDetails";
        client.post(url_api, args, function (data, response) {
            //console.log(data);
            if (data && data.hasOwnProperty('data') && data.data.length > 0) {
                try {
                    //var date = moment().format('DDMMYYYY');
                    var ff_file_name = req.body.rzp_customer_id + "_" + req.body.transaction_type + ".csv";
                    var ff_loc_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                    var ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                    var csvjson = require('csvjson');
                    var writeFile = require('fs').writeFile;
                    var fs = require('fs');
                    var data_list = [];
                    for (var rowcount in data.data) {
                        var data_Obj = [];
                        data_Obj = data.data[rowcount];
                        let data_csv = {
                            "Payment Id ": data_Obj['rzp_payment_id'],
                            "Amount": data_Obj['transaction_amount'],
                            "Date": moment(data_Obj['Created_On']).format('DD/MM/YYYY')
                        }
                        if (req.body.transaction_type == 'DEBIT') {
                            data_csv["CRN"] = data_Obj['PB_CRN'];
                            data_csv["Engine No."] = (data_Obj.Engine_number ? data_Obj.Engine_number : 'Not Available');
                            data_csv["Chassis No."] = (data_Obj.Chassis_number ? data_Obj.Chassis_number : 'Not Available');
                            data_csv["Status"] = data_Obj.Status;
                            data_csv["Remark"] = (data_Obj.Status === 'FAIL' ? (data_Obj.rzp_payment_response && data_Obj.rzp_payment_response.error && data_Obj.rzp_payment_response.error.description) : '');
                        }
                        data_list.push(data_csv);
                    }
                    var finalTxs = [];
                    for (let i = 0; i <= data_list.length; i++) {
                        finalTxs.push(data_list[i]);
                    }
                    const csvData = csvjson.toCSV(finalTxs, {
                        headers: 'key'
                    });
                    writeFile(ff_loc_path_portal, csvData, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log('Success!');
                    });
                    res.json({'Status': 1, 'Msg': ff_web_path_portal});
                } catch (er) {
                    res.json({'Status': 0, 'Msg': er.stack});
                }
            } else {
                res.json({Status: 0, Msg: `No Data Available`});
            }
        });
    } catch (ex) {
        res.json({'Status': 0, 'Msg': ex.stack});
    }
});

router.post('/wallets/getAccountDetails', function (req, res) {
    try
    {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: 'agent_name Merchant_Id bank_account_no ifsc wallet_amount SS_ID FBA_ID Channel daily_limit wallet_otp_number',
            sort: {'Created_On': -1},
            lean: true,
            page: 1,
            limit: 10
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var objRequest = req.body;
        var filter = obj_pagination.filter;
        //ss_id = objRequest["ss_id"] - 0;
        filter = {
            //"SS_ID": ss_id
        };
        console.log(filter);
        var agent_wallet = require('../models/agent_wallet');
        agent_wallet.paginate(filter, optionPaginate).then(function (dbTicket) {
            res.json(dbTicket);
        });

    } catch (err) {
        console.log(err);
        res.json({'msg': 'error', 'Error_Msg': err.stack});
    }
});
router.post('/wallets/getTransactionDetails', function (req, res) {
    try
    {
        var objRequest = req.body;
        var filter = {
            "rzp_customer_id": objRequest["rzp_customer_id"]
                    //"Status": "SUCCESS"
        };
        if (objRequest["transaction_type"] === "CREDIT") {
            filter['transaction_type'] = {$in: ['CREDIT', 'ADD']};
            filter['Status'] = "SUCCESS";
        } else {
            filter['transaction_type'] = {$in: ['DEBIT', 'DEDUCT']};
        }
        console.log(filter);
        var rzp_wallet_history = require('../models/rzp_wallet_history');
        rzp_wallet_history.find(filter).sort({"Created_On": -1}).exec(function (err, dblmsData) {
            if (err) {
                throw err;
            } else {
                res.json({'msg': 'success', "data": dblmsData});
            }
        });
    } catch (err) {
        console.log(err);
        res.json({'msg': 'error', 'Error_Msg': err.stack});
    }
});
router.post('/wallets/getTransactionDetails_horizon', function (req, res) {
    try
    {
        var objRequest = req.body;
        var filter = {
            "rzp_customer_id": objRequest["rzp_customer_id"]
        };
        if (objRequest["transaction_type"] === "CREDIT") {
            filter['transaction_type'] = {$in: ['CREDIT', 'ADD']};
        } else {
            filter['transaction_type'] = {$in: ['DEBIT', 'DEDUCT']};
        }
        console.log(filter);
        var rzp_wallet_history = require('../models/rzp_wallet_history');
        rzp_wallet_history.find(filter).sort({"Created_On": -1}).exec(function (err, dblmsData) {
            if (err) {
                throw err;
            } else {
                res.json({'msg': 'success', "data": dblmsData});
            }
        });
    } catch (err) {
        console.log(err);
        res.json({'msg': 'error', 'Error_Msg': err.stack});
    }
});
router.get('/GetInsurancePlans', function (req, res) {
    try {
        let product_id = req.query.Product_Id;
        let insurer_id = req.query.Insurer_Id;
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            if (err)
                throw err;
            let website_downloads = db.collection('website_downloads');
            website_downloads.find({"Insurer_ID": insurer_id, Product_Id: product_id}).toArray(function (err, data) {
                if (err) {
                    res.json({'Status': 'Error', 'Msg': err});
                } else {
                    res.json({"Status": "Success", "Msg": data});
                }

            });
        });
    } catch (e) {
        console.log("error:", ex);
        res.json({'Status': 'Error', 'Msg': ex.stack});
    }
});

router.get('/sendbrochure', function (req, res) {
    try {
        var Email = require('../models/email');
        var objModelEmail = new Email();
        var remark = "LANDMARK INSURANCE";
        var subject = req.query.product_name + "-" + req.query.insurer_name + "-" + req.query.plan_name + " Download links";
        let tbl = "<html><body>"
                + "<table class='table table-striped table-bordered'><tbody>"
                + "<p><b>Dear Customer,</b></p>"
                + "<p>   </p>"
                + "<p>Please find below " + req.query.product_name + " Plan as requested by you.</p>"
                + "<p><b>Insurer Name: </b>" + req.query.insurer_name + "</p>"
                + "<p><b>Plan Name: </b>" + req.query.plan_name + "</p>"
        if (req.query.brochure_link && req.query.brochure_link !== "") {
            tbl = tbl + "<p><b>Brochure Download Link:   </b>" + req.query.brochure_link + " </p>"
        }
        if (req.query.pro_wording_link && req.query.pro_wording_link !== "") {
            tbl = tbl + "<p><b>Policy Wording Link:   </b>" + req.query.pro_wording_link + " </p>"
        }
        if (req.query.pro_form_link && req.query.pro_form_link !== "") {
            tbl = tbl + "<p><b>Proposal Form Link:    </b>" + req.query.pro_form_link + " </p>"
        }
        tbl = tbl + "<p><b>Thanks and Regards,</b></p>"
                + remark
                + "</table>"
                + "</body></html>"
        var arrTo = [req.query.emailId];
        //var arrCC = ['Shailendra.tewari@policyboss.com'];
        //var arrCC=['piyush.singh@policyboss.com','rohit.rajput@policyboss.com']
        objModelEmail.send('noreply@landmarkinsurance.co.in ', arrTo.join(','), subject, tbl, '', '', '', '');
        res.json({'Status': 'Success', 'Msg': 'Data saved successfully'});

    } catch (ex) {
        console.log("error:", ex);
        res.json({'Status': 'Error', 'Msg': ex.stack});
    }
});
router.post('/lazy_pay_log/check_eligibility', function (req, res) {
    try {
        var crypto = require('crypto');
        let Client = require('node-rest-client').Client;
        let client = new Client();
        var lazy_pay_log = require('../models/lazy_pay_log');
        var gender = req.body.gender === "M" ? "male" : req.body.gender === "F" ? "female" : "other";
        var request_page = req.body.request_page === "quote" ? "quote" : "proposal";
        if (request_page === "quote") {
            var line1 = req.body.city;
            var line2 = req.body.state;
            var pincode = req.body.pincode.toString();
        } else {
            var line1 = req.body.permanent_address_1 + " " + req.body.permanent_address_2 + " " + req.body.permanent_address_3;
            var line2 = req.body.city_name + "," + req.body.state_name;
            var pincode = req.body.permanent_pincode;
        }
        var db_arg = {
            'PB_CRN': parseInt(req.body.crn),
            'User_Data_Id': parseInt(req.body.udid),
            'Customer Name': req.body.contact_name,
            "Customer_Mobile": parseInt(req.body.mobile),
            "PAN_Card": req.body.pan,
            "Date_of_Birth": req.body.birth_date,
            "Request_Page": request_page,
            "Status": "",
            "LazyPay_Request": "",
            "LazyPay_Response": "",
            "LazyPay_Request_Core": "",
            "Created_On": new Date(),
            "Modified_On": ""
        };

        const str_content = req.body.mobile.toString() + req.body.final_premium.toString() + "INR";//<mobile+amount+currency>
//                    const key = (config.environment.name !== 'Production' ? "898816000f6073d5789e67356a713862d5ffdcf7" : ""); //old
        const key = (config.environment.name !== 'Production' ? "73017b15be7d5954adb1182c59caa8b49c84f9d8" : "c7e6f6f7c28fc11ed1ac2176c13b68bcd9e6d318"); //new

        const hash = crypto.createHmac('sha1', key)
                .update(str_content)
                .digest('hex');
        console.log('LazyPay signature : ', hash);
        let args = {
            headers: {
                "Content-Type": "application/json",
//                            "accessKey": (config.environment.name !== 'Production' ? "BI2HN64L6JLMSY0NYFJ3" : ""), //old
                "accessKey": (config.environment.name !== 'Production' ? "P6K6A03MS039NA5MHSOK" : "OYAAE1M92CW5MMAH65IR"), //new
                "signature": hash
            },
            data: {
                "userDetails": {
                    "firstName": req.body.first_name,
                    "middleName": req.body.middle_name,
                    "lastName": req.body.last_name,
                    "mobile": req.body.mobile.toString(),
                    "pan": req.body.pan,
                    "dob": req.body.birth_date,
                    "gender": gender,
                    "email": req.body.email,
                    "address": {
                        "line1": line1,
                        "line2": line2,
                        "pincode": pincode
                    }
                },
                "amount": {
                    "value": req.body.final_premium.toString(),
                    "currency": "INR"
                },
                "cbpConsent": {
                    "value": true,
                    "consentTime": moment().utc().format("YYYY-MM-DD HH:mm:ss")
                }
            }
        };
        let url = (config.environment.name !== 'Production' ? "https://sboxapi.lazypay.in" : "https://api.lazypay.in") + "/api/lazypay/cof/v0/eligibility";
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        db_arg.LazyPay_Request = JSON.stringify(args.data); // store request
        db_arg.LazyPay_Request_Core = JSON.stringify(args); // store all request
        client.post(url, args, function (data) {
            if (data) {
                if (data.hasOwnProperty('isEligible') && data['isEligible'] === true) {
                    db_arg.Status = "Success";
                } else {
                    db_arg.Status = "Fail";
                }
                db_arg.LazyPay_Response = JSON.stringify(data);
                let add_lazy_pay_log = new lazy_pay_log(db_arg);
                add_lazy_pay_log.save(function (err, res1) {
                    if (err) {
                        console.log("Failed");
                    } else {
                        console.log("Inserted Sucessfully");
                    }
                });
                res.json({'Response': data});
            }
        });
    } catch (err) {
        console.log(err);
        res.json({'Response': err.stack});
    }
});

router.post('/email/premium_breakup', function (req, res) {
    try {
        console.log('Start', this.constructor.name, 'premium_breakup');
        var fs = require('fs');
        var path = require('path');
        var appRoot = path.dirname(path.dirname(require.main.filename));
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        var processed_request = {};
        for (var key in objRequestCore) {
            if (typeof objRequestCore[key] !== 'object') {
                processed_request['___' + key + '___'] = objRequestCore[key];
            }
        }
        var email_data = fs.readFileSync(appRoot + '/resource/email/PremiumBreakup_Details.html').toString();
        email_data = email_data.replaceJson(processed_request);

        //od damage
        var txt_replace_od = objBase.find_text_btw_key(email_data, '<!-- oddamage start -->', '<!-- oddamage end -->', true);
        var txt_replace_od_with = "";
        for (var key in objRequestCore) {
            if (key.indexOf('owndamage_') > -1 && (objRequestCore[key].replace(/,+/g, '')).toString() - 0 > 0) {
                var addon_text = txt_replace_od.replace('___od_name___', key.replace('owndamage_', '').replace(/_/g, ' '));
                txt_replace_od_with += addon_text.replace('___od_value___', objRequestCore[key]);
            }
        }
        email_data = email_data.replace(txt_replace_od, txt_replace_od_with);


        //od damage
        var txt_replace_tp = objBase.find_text_btw_key(email_data, '<!-- tpdamage start-->', '<!-- tpdamage end-->', true);
        var txt_replace_tp_with = "";
        for (var key in objRequestCore) {
            if (key.indexOf('libprem_') > -1 && (objRequestCore[key].replace(/,+/g, '')).toString() - 0 > 0) {
                var addon_text = txt_replace_tp.replace('___tp_name___', key.replace('libprem_', '').replace(/_/g, ' '));
                txt_replace_tp_with += addon_text.replace('___tp_value___', objRequestCore[key]);
            }
        }
        email_data = email_data.replace(txt_replace_tp, txt_replace_tp_with);


        if (objRequestCore['addonfinal'] - 0 <= 0) {
            var txt_replace = objBase.find_text_btw_key(email_data, '<!-- Addon Start-->', '<!-- Addon End-->', true);
            email_data = email_data.replace(txt_replace, "");
        } else {
            var txt_replace = objBase.find_text_btw_key(email_data, '<!-- Addon list Start-->', '<!-- Addon list End-->', true);
            var txt_replace_with = "";
            for (var key in objRequestCore) {
                if (key.indexOf('addon_') > -1) {
                    var addon_text = txt_replace.replace('___addon_name___', key.replace('addon_', ''));
                    txt_replace_with += addon_text.replace('___addon_value___', objRequestCore[key]);
                }
            }
            email_data = email_data.replace(txt_replace, txt_replace_with);
        }
        var Email = require('../models/email');
        var objModelEmail = new Email();
        var sub = "[POLICYBOSS] Premium Breakup Details";
        objModelEmail.send('noreply@landmarkinsurance.co.in', objRequestCore['ContactEmail'], sub, email_data, '', '');
        res.send({'Msg': 'Success'});
    } catch (e) {
        res.send({'Msg': 'Failure: ' + e.toString()});
    }
    console.log(processed_request, email_data);
});

router.post('/email/share_quote', function (req, res) {
    try {
        console.log('Start', this.constructor.name, 'premium_breakup');
        var fs = require('fs');
        var path = require('path');
        var appRoot = path.dirname(path.dirname(require.main.filename));
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        var processed_request = {};
        for (var key in objRequestCore) {
            if (typeof objRequestCore[key] !== 'object') {
                processed_request['___' + key + '___'] = objRequestCore[key];
            }
        }
        if (objRequestCore['is_addon_selected']) {
            processed_request['___net_premium___'] = objRequestCore['net_premium_with_addon'];
            processed_request['___service_tax___'] = objRequestCore['service_tax_with_addon'];
            processed_request['___final_premium___'] = objRequestCore['final_premium_with_addon'];
        }
        var email_data = fs.readFileSync(appRoot + '/resource/email/PremiumBreakup_Details_Health.html').toString();
        email_data = email_data.replaceJson(processed_request);

        if (objRequestCore['is_addon_selected']) {
            var txt_replace = objBase.find_text_btw_key(email_data, '<!-- Addon list Start-->', '<!-- Addon list End-->', true);
            var txt_replace_with = "";
            let addons = objRequestCore.addon_selected_fullname;
            for (var key in addons) {
                var addon_text = txt_replace.replace('___addon_name___', key);
                txt_replace_with += addon_text.replace('___addon_value___', Math.round(addons[key]));
            }
            email_data = email_data.replace(txt_replace, txt_replace_with);
        } else {
            var txt_replace = objBase.find_text_btw_key(email_data, '<!-- Addon Start-->', '<!-- Addon End-->', true);
            email_data = email_data.replace(txt_replace, "");
        }
        var Email = require('../models/email');
        var objModelEmail = new Email();
        var sub = "[POLICYBOSS] Premium Breakup Details";
        objModelEmail.send('noreply@landmarkinsurance.co.in', objRequestCore['ContactEmail'], sub, email_data, '', '');
        res.send({'Msg': 'Success'});
    } catch (e) {
        res.send({'Msg': 'Failure: ' + e.toString()});
    }
    console.log(processed_request, email_data);
});

router.post('/quote_download_history', function (req, res) {
    var Summary = {
        'Status': ''
    };
    var ss_id = req.body.ss_id;
    var datetime = req.body.datetime;
    var pdf_file_name = req.body.pdf_file_name;
    var crn = req.body.crn;
    var product_id = req.body.product_id;
    var udid = req.body.udid;
    var quote_download_history = require('../models/quote_download_history');
    quote_download_history.find({}, function (err, getAllData) {
        if (err) {
            res.send(err);
        } else {
            var arg = {
                Download_History_Id: parseInt(getAllData.length + 1),
                ss_id: parseInt(ss_id),
                Date_Time: datetime,
                Pdf_File_Name: parseInt(pdf_file_name),
                PB_CRN: parseInt(crn),
                Product_Id: parseInt(product_id),
                User_Data_Id: parseInt(udid)
            };
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                if (err)
                    throw err;
                var quote_download_history = db.collection('quote_download_historys');
                quote_download_history.insertOne(arg, function (err, res1) {
                    if (err) {
                        Summary.Status = err;
                    } else {
                        Summary.Status = 'SUCCESS';
                    }
                    res.json(Summary);
                    db.close();
                });
            });
        }
    });
});
router.post('/ContactUs', function (req, res) {
    try {
        var contactus = require('../models/contactus');
        var Email = require('../models/email');
        var objModelEmail = new Email();
        var data = req.body;

        var args = {
            "Name": data['ContactName'],
            "Mobile": data['ContactMobile'],
            "City": data['ContactCity'],
            "Info_About": data['ContactselectCity'],
            "Comment": data['Contactcomment'],
            "Created_On": new Date(),
            "Modified_On": new Date()
        };

        var contact = new contactus(args);
        contact.save(function (err, resdata) {
            if (err) {
                res.json({'Status': 'Error', 'Msg': err.stack});
            } else {
                var arrCc = ['marketing@policyboss.com', 'st@policyboss.com', 'pramod.parit@policyboss.com'];
                var arrTo = ['enquiry@policyboss.com'];
                var remark = "LANDMARK INSURANCE";
                var subject = "Contact Us Customer Data";
                var mail_content = '<html> <body>Dear Team,<br /><p> Please find the Customer details</p><br/><br/>'
                        + '<table><tr><td style =\""font-size:12px;line-height:1.5em;\""><fieldset> <legend><b>Customer Details</b>:</legend><br/>'
                        + '<p>Name - ' + args['Name'] + '<br>Mobile - ' + args['Mobile']
                        + '<br>City : ' + args['City']
                        + '<br>Product : ' + args['Info_About']
                        + '<br>Comments : ' + args['Comment']
                        + '</fieldset><td/><tr/></table><br/><br/>'
                        + 'Regards,<br />policyboss.com<br />'
                        + 'Landmark Insurance Brokers Pvt. Ltd.<br /><b>Address</b> '
                        + ': Ground Floor & First Floor,<br/>'
                        + ' E-Shape Building, Ashok Silk Mills Compound,'
                        + '<br/> 202 L.B.S Marg, Ghatkopar (West), Mumbai- 400 086';

                objModelEmail.send('noreply@landmarkinsurance.co.in', arrTo.join(','), subject, mail_content, arrCc.join(','), config.environment.notification_email, '', '');
                res.json({'Status': 'Success', 'Msg': resdata.Visitor_Number});
            }
        });
    } catch (ex) {
        console.log("error:", ex);
        res.json({'Status': 'Error', 'Msg': ex.stack});
    }
});
router.post('/evq/update', function (req, res) {
    let objReq = req.body;
    var Fresh_Quote = require('../models/fresh_quote');
    if (objReq.hasOwnProperty('Erp_Qt') === "" || objReq.Erp_Qt === null) {
        res.send('ERPQt Missing');
    } else {
        if (objReq.Erp_Qt.toString().toLowerCase().indexOf('Qt') !== 0) {
            objReq.Erp_Qt = objReq.Erp_Qt.toString().toUpperCase();
        }
        let efq_cond = {'Erp_Qt': objReq.Erp_Qt, 'Fresh_Quote_Id': objReq.Fq_Qt_Id, 'Visited_Source': 'ERP'};
        let efq_ud_cond = {'quote_url': objReq.Erp_Qt_Url, 'is_verified_quote': 'yes'};
        Fresh_Quote.update(efq_cond, {$set: efq_ud_cond}, function (err, numAffected) {
            console.log(numAffected);
            res.json('ERPQt Success');
        });
    }
});

router.post('/vehicles_insurers_mappings/mapping', LoadSession, function (req, res) {
    var Vehicle = require('../models/vehicle');
    var Vehicles_Insurer_Mapping = require('../models/vehicles_insurers_mapping');
    if (req.body['Insurer_ID'] != '' && req.body['Vehicle_ID'] != '') {
        Vehicles_Insurer_Mapping.remove(
                {
                    'Insurer_ID': parseInt(req.body['Insurer_ID']),
                    'Vehicle_ID': parseInt(req.body['Vehicle_ID'])
                }
        , function (err) {
            if (err) {

            } else {
                console.log('Vehicles_Insurer_Mapping-deleted');
                //1 - Remove_Mapping,  2- Assign_Mapping, 3- Not_Supported, 4-Nearer_Match
                var status_id = parseInt(req.body['Status_Id']);
                if (status_id != 1) {
                    if ([2, 4].indexOf(status_id) > -1) {
                        var objMap = {
                            'Insurer_ID': parseInt(req.body['Insurer_ID']),
                            'Insurer_Vehicle_ID': parseInt(req.body['Insurer_Vehicle_ID']),
                            'Vehicle_ID': parseInt(req.body['Vehicle_ID']),
                            'Is_Active': 1,
                            'Created_On': new Date(),
                            'Status_Id': parseInt(req.body['Status_Id']),
                            'Premium_Status': 1
                        };
                    } else if (status_id == 3) {
                        var objMap = {
                            'Insurer_ID': parseInt(req.body['Insurer_ID']),
                            'Insurer_Vehicle_ID': null,
                            'Vehicle_ID': parseInt(req.body['Vehicle_ID']),
                            'Is_Active': 0,
                            'Created_On': new Date(),
                            'Status_Id': parseInt(req.body['Status_Id']),
                            'Premium_Status': 1
                        };
                    }
                    var objModelVehiclesInsurerMapping = new Vehicles_Insurer_Mapping(objMap);
                    objModelVehiclesInsurerMapping.save(function (err, objDbVehicles_Insurer_Mapping) {
                        if (err) {
                            console.error('objDbVehicles_Insurer_Mapping', 'Vehicles_Insurer_Mapping_Save', err);
                            res.json({Msg: err});
                        } else {
                            var ObjVehicle = {};
                            ObjVehicle['Insurer_' + parseInt(req.body['Insurer_ID'])] = objMap;
                            Vehicle.update({'Vehicle_ID': parseInt(req.body['Vehicle_ID'])}, {$set: ObjVehicle}, function (err, numAffected) {
                                let obj_status = {
                                    2: 'EXACT',
                                    3: 'NOTSUPPORTED',
                                    4: 'NEAR'
                                };
                                req.body['Mapped_By'] = req.obj_session ? req.obj_session.user.fullname : ('Mapped by SSID:' + req.body['ss_id']);
                                let obj_email = {
                                    'from': 'noreply@policyboss.com',
                                    'to': 'savio.lobo@landmarkinsurance.in',
                                    'sub': '[MAPPING]' + req.body['Insurer_Name'] + ' : ' + obj_status[req.body['Status_Id'] - 0] + ' : ' + req.body['Vehicle_Name'].toString().replace(/::/g, '-'),
                                    'content': '<html><body><h1>Mapping Details</h1><pre>' + JSON.stringify(req.body, undefined, 2) + '</pre></body></html>'
                                };
                                var Email = require('../models/email');
                                var objModelEmail = new Email();
                                objModelEmail.send(obj_email.from, obj_email.to, obj_email.sub, obj_email.content, '', config.environment.notification_email);

                                if (err) {
                                    res.json({Msg: 'Vehicle_Not_Saved', Details: err, Data: objDbVehicles_Insurer_Mapping});
                                } else {
                                    res.json({Msg: 'Success', Data: objDbVehicles_Insurer_Mapping});
                                    //res.json({Msg: 'Success_Created', Details: numAffected});
                                }
                            });
                            //console.error('objDbVehicles_Insurer_Mapping', 'Vehicles_Insurer_Mapping_Save', err);
                            //res.json({Msg: 'Success', Data: objDbVehicles_Insurer_Mapping});
                        }
                    });
                } else {
                    res.json({Msg: 'Success'});
                }
            }
        });
    } else {
        res.json({Msg: 'Insurer_ID and Vehicle_ID are missing'});
    }
});

router.post('/feedback', function (req, res) {
    try {
        var Email = require('../models/email');
        var objModelEmail = new Email();
        var obj = JSON.parse(JSON.stringify(req.body));
        var feedback = require('../models/feedback');
        args = {
            "FeedbackId": obj["feedback_id"],
            "ComplaintId": obj["complain_id"],
            "Name": obj["Name"],
            "Email": obj["Email"],
            "Mobile": obj["Mobile"],
            "Policy_No": obj["Policy_No"],
            "Message": obj["Message"],
            "Service_Id": obj["Service_Id"],
            "Category_Type": obj["Category_Type"],
            "Nature_Of_Feedback_Complain": obj["Nature_Of_Feedback_Complain"],
            "Service_Claim_Type": obj["Service_Claim_Type"],
            "Created_On": new Date(),
            "Modified_On": new Date()
        };

        var feedback_data = new feedback(args);
        feedback_data.save(function (err, resdata) {
            if (err) {
                res.json({'Status': 'Error', 'Msg': err.stack});
            } else {
                var feedId = resdata.FeedId;
                var _ServiceType = args['Nature_Of_Feedback_Complain'] === "ServiceRelated" ? "Service" : "Claim";
                feedback.update({"FeedId": feedId}, {$set: {'FeedbackId': "MUM-" + feedId + "-C"}}, function (err, objFeed) {
                    if (err) {
                        res.json({'Status': 'Error', 'Msg': err.stack});
                    } else {
                        res.json({'Status': 'Success', 'Msg': 'Data saved successfully', 'Feeback_Ref': "MUM-" + feedId + "-C"});
                        if (args['Category_Type'] === "Feedback") {
                            var subject = "Thank You for your feedback. Your Feedback\ " + _ServiceType + " ID is : MUM-" + feedId + '-C';
                            var mail_content = '<html><body><p>Dear ' + args['Name'] + ',</p>'
                                    + '<p>Thank You for sharing your feedback with us.</p></br>'
                                    + '<p>Our customer care team will evaluate the details shared by you & will reach out to you for further '
                                    + 'inputs(if required).</br>We value your Patronage and Your Feedback reference number is <b> '
                                    + 'MUM-' + feedId + '-C.</b></br>'
                                    + '<table><tr><td style =\""font-size:12px;line-height:1.5em;\""><fieldset> <legend><b>Customer Details</b>:</legend><br/>'
                                    + 'Name : ' + args['Name'] + '<br/>'
                                    + 'Email : ' + args['Email'] + '<br/>'
                                    + 'Mobile : ' + args['Mobile'] + '<br/>'
                                    + 'FeedBack : ' + _ServiceType + ' : ' + args['Message'] + '<br/>'
                                    + '</fieldset><td/><tr/></table><br/><br/>'
                                    + 'Regards,<br/>'
                                    + 'Team Customer Care <br/>'
                                    + 'Landmark Insurance Brokers Pvt. Ltd.<br/>'
                                    + '<b> Contact</b> : 18004194199 <br/>'
                                    + '<img src="https://policyboss.com/images/POSP/policyboss.png"><br/><br/>'
                                    + '</p></body></html>';

                            var arrBcc = ['customercare@policyboss.com', 'headcare@policyboss.com', 'pramod.parit@policyboss.com', config.environment.notification_email];
                            objModelEmail.send('noreply@landmarkinsurance.co.in', args['Email'], subject, mail_content, '', arrBcc.join(','), '', '');
                        }
                        if (args['Category_Type'] === "Complaint") {
                            var subject = "Thank You for your Complaint. Your Complaint\ " + _ServiceType + " ID is : MUM-" + feedId + "-C";
                            var mail_content = '<html><body><p>Dear ' + args['Name'] + ' ,</p>'
                                    + '<p>Thank You for sharing your concern with us.</br>'
                                    + 'Our customer care executive reach out to you within 24 working hours to understand it better and resolve it as per your satisfaction<br>'
                                    + 'Your Complaint ID is <b> MUM-' + feedId + '-C</b></br>'
                                    + 'Use it for future reference.</br></br>'
                                    + '<table><tr><td style =\""font-size:12px;line-height:1.5em;\""><fieldset> <legend><b>Customer Details</b>:</legend><br/>'
                                    + 'Name : ' + args['Name'] + '<br/>'
                                    + 'Email : ' + args['Email'] + '<br/>'
                                    + 'Mobile : ' + args['Mobile'] + '<br/>'
                                    + 'FeedBack : ' + _ServiceType + ' : ' + args['Message'] + '<br/>'
                                    + '</fieldset><td/><tr/></table><br/><br/>'
                                    + 'Regards,<br/>'
                                    + 'Team Customer Care <br/>'
                                    + 'Landmark Insurance Brokers Pvt. Ltd.<br/>'
                                    + '<b> Contact</b> : 18004194199 <br/>'
                                    + '<img src="https://policyboss.com/images/POSP/policyboss.png"><br/><br/>'
                                    + '</p></body></html>';

                            var arrBcc = ['marketing@policyboss.com', 'st@policyboss.com', 'customercare@policyboss.com', 'headcare@policyboss.com', 'pramod.parit@policyboss.com', config.environment.notification_email];
                            objModelEmail.send('noreply@landmarkinsurance.co.in', args['Email'], subject, mail_content, '', arrBcc.join(','), '', '');
                        }
                    }
                });
            }
        });
    } catch (ex) {
        res.json({'Status': 'Error', 'Msg': ex.stack});
    }
});
router.post('/claim_save_center', function (req, res) {
    try {
        var Email = require('../models/email');
        var objModelEmail = new Email();
        var data = req.body;
        //console.log("claim data" + data);
        var claim_intimitation = require('../models/claim_intimitation');
        args = {
            "PolicyNumber": data["PolicyNumber"],
            "Product_ID": data["Product_ID"],
            "Product_name": data["product_name"],
            "Customer_Name": data["Customer_Name"],
            "Contact_Mobile": data["Contact_Mobile"],
            "Email_Id": data["Email_Id"],
            "Insurer_Id": data["Insurer_ID"],
            "Insurer_Company": data["Insurer_name"],
            "LostDate": data["LostDate"],
            "Brief": data["Remarks"],
            "ProductInsuranceMapping_Id": "",
            "IsActive": 1,
            "Other_Contact_No": "", //data["Other_Contact_No"],
            "CreatedBy": "", //data["CreatedBy"],
            "Claim_Source_Master_ID": "", //data["Claim_Source_Master_ID"],
            "Created_On": new Date(),
            "Modified_On": new Date()
        };

        var claim = new claim_intimitation(args);
        claim.save(function (err, resdata) {
            if (err) {
                res.json({'Status': 'Error', 'Msg': err.stack});
            } else {
                var remark = "LANDMARK INSURANCE";
                var subject = "Claim Assistance Required For Policy Number : " + args['PolicyNumber'];

                var mail_content = '<html><body><p style="font-size:13px;font-family:Verdana;">Dear Claim Manager,<br /></p><BR/>'
                        + 'The following customer has applied for claim assistance through our website on date ' + args['LostDate'] + ':' + ' </br></br>'
                        + '<table><tr><td style =\""font-size:12px;line-height:1.5em;\""><b>Customer Details:</b></td></tr>'
                        + '<tr><td style="font-size:12px;font-family:Verdana;width:200px;">Customer Name - </td>'
                        + '<td style="font-size:14px;font-family:Verdana;">' + args['Customer_Name'] + '</td></tr>'
                        + '<tr><td style="font-size:12px;font-family:Verdana;width:60px;">Mobile No. - </td>'
                        + '<td style="font-size:14px;font-family:Verdana;">' + args['Contact_Mobile'] + '</td></tr>'
                        + '<tr><td style="font-size:12px;font-family:Verdana;width:60px;">Email  -</td> '
                        + '<td style="font-size:14px;font-family:Verdana;">' + args['Email_Id'] + '</td></tr>'
                        + '<tr><td><img src="https://policyboss.com/images/logo_email_quote.gif"><td/><tr/></table><br/><br/>'
                        + '<table><tr><td style =\""font-size:12px;line-height:1.5em;width:200px;\""><b>Claim Assistance  Details:</b></td></tr>'
                        //+ '<br><p style="padding-left:10px;padding-top:8px;font-size:15px;font-weight:bold;"><strong>Claim Assistance  Details:</strong></p>'
                        + '<tr><td style="font-size:12px;font-family:Verdana;width:150px;">Product ID - </td>'
                        + '<td style="font-size:14px;font-family:Verdana;">' + args['Product_name'] + '</td></tr>'
                        + '<tr><td style="font-size:12px;font-family:Verdana;width:60px;">Insurer Company - </td>'
                        + '<td style="font-size:14px;font-family:Verdana;">' + args['Insurer_Company'] + '</td></tr>'
                        + '<tr><td style="font-size:12px;font-family:Verdana;width:60px;">Policy Number  - </td>'
                        + '<td style="font-size:14px;font-family:Verdana;">' + args['PolicyNumber'] + '</td></tr>'
                        + '<tr><td style="font-size:12px;font-family:Verdana;width:150px;">LOSS Date  - </td>'
                        + '<td style="font-size:14px;font-family:Verdana;">' + args['LostDate'] + '<td/><tr/></table><br/>'
                        + '<p style="font-size:14px;padding-left:5px;padding-bottom:5px;font-family:Verdana">'
                        + '<span>BRIEF DETAIL OF LOSS : ' + args['Brief'] + '</span>.<br/>'
                        + '</p></body></html>';

                var arrTo = ['claims.mumbai@policyboss.com'];
                var arrCC = ['marketing@policyboss.com', 'product@policyboss.com', 'st@policyboss.com'];
                objModelEmail.send('noreply@policyboss.com', arrTo.join(','), subject, mail_content, arrCC.join(','), config.environment.notification_email, '', '');
                res.json({'Status': 'Success', 'Msg': 'Data saved successfully'});
            }
        });
    } catch (ex) {
        res.json({'Status': 'Error', 'Msg': ex.stack});
    }
});
router.post('/postservicecall/inspection/iffco_breakin_data', function (req, res) {
    try {
        console.error('iffco_breakin_data', req.body);
        let cond = {
            "PB_CRN": req.body.CustomerReferenceID,
            "Service_Log_Unique_Id": (req.body.api_reference_number.split("_"))[0],
            "Request_Unique_Id": (req.body.search_reference_number.split("_"))[0],
            "Status": "INSPECTION_APPROVED"
        };
        var inspection_schedule = require('../models/inspection_schedule');
        inspection_schedule.find(cond, function (err, dbUsers) {
            if (err) {
                res.send(err);
            } else {
                let inspection_id = dbUsers['0']['_doc']['Inspection_Id'];
                let dbUsers1 = JSON.parse(dbUsers['0']['_doc']['Insurer_Request']);
                let inspection_date = "";
                if ((dbUsers1.hasOwnProperty('inspectionDate')) && dbUsers1['inspectionDate'] !== "" && dbUsers1['inspectionDate'] !== null) {
                    inspection_date = dbUsers1['inspectionDate'].split(" ");
                    inspection_date = getMonthFromString(inspection_date[1]) + "/" + inspection_date[2] + "/" + inspection_date[5];
                    console.log(inspection_date);
                    res.json({'Msg': 'Success', 'inspection_date': inspection_date, 'inspection_id': inspection_id});
                } else {
                    res.json({'Msg': 'Inspection Date was not found.'});
                }
            }
        });
    } catch (e) {
        console.error('iffco_breakin_data', 'exception', e);
        res.send(e.stack);
    }
});

function getMonthFromString(mon) {
    let d = Date.parse(mon + "1, 2012");
    if (!isNaN(d)) {
        let mm = new Date(d).getMonth() + 1;
        if (mm < 10) {
            mm = "0" + mm;
        }
        return mm;
    }
    return -1;
}
router.post('/tickets/search', function (req, res) {
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

router.post('/posp_enquiry', function (req, res) {
    try
    {
        let posp_enquiry = require('../models/posp_enquiry');
        let posp_assigned_history = require('../models/posp_assigned_history');
        let objRequestCore = req.body;
        objRequestCore = JSON.parse(JSON.stringify(objRequestCore));
        let mobile_number = objRequestCore.hasOwnProperty("mobile") && (!isNaN(objRequestCore.mobile)) ? objRequestCore.mobile : "";
        if (mobile_number !== "") {
            posp_enquiry.find({"mobile": mobile_number}, function (posp_enq_err, posp_enq_dbdata) {
                if (posp_enq_err) {
                    res.json({'Msg': posp_enq_err, 'Status': "Fail"});
                } else {
                    if (posp_enq_dbdata && posp_enq_dbdata.length > 0) {
                        //update
                        let updateObj = {};
                        //let lead_assign_ss_id = [16114, 7685, 114118, 64496, 8067];
                        //let temp_random = Math.floor(Math.random() * lead_assign_ss_id.length);
                        //let random_lead_assign_ss_id = lead_assign_ss_id[temp_random];
                        let data = posp_enq_dbdata[0]._doc;
                        for (var key in objRequestCore) {
                            updateObj[key] = objRequestCore[key];
                        }
                        updateObj.Modified_On = new Date();
                        updateObj.last_enquiry_on = new Date();
                        updateObj.Source = objRequestCore.hasOwnProperty('Source') ? objRequestCore.Source : data.Source;
                        //updateObj.last_assigned_to = random_lead_assign_ss_id;
                        //updateObj.last_assigned_by = objRequestCore.hasOwnProperty('ss_id') ? objRequestCore.ss_id : data['last_assigned_by'];
                        updateObj.last_enquiry_on = new Date();
                        posp_enquiry.update({'mobile': mobile_number}, {$set: updateObj}, function (posp_enq_upate_err, numAffected) {
                            if (posp_enq_upate_err) {
                                res.json({'Msg': posp_enq_upate_err, 'Status': "Fail"});
                            } else {
                                if (numAffected && numAffected.nModified === 1) {
                                    //save to history
//                                    let args = {
//                                        "mobile": data['mobile'],
//                                        "name": data['name'],
//                                        "pan": data['pan'],
//                                        "aadhaar": data['aadhaar'],
//                                        "last_assigned_by": updateObj['last_assigned_by'],
//                                        "last_assigned_to": updateObj['last_assigned_to'],
//                                        "last_assigned_on": updateObj['last_enquiry_on'],
//                                        "Created_On": new Date(),
//                                        "Modified_On": new Date()
//                                    };
//                                    let posp_assigned_historyObj = new posp_assigned_history(args);
//                                    posp_assigned_historyObj.save(function (err, dbdata) {});
                                    res.json({'Msg': "Updated Successfully.", 'Status': "Success"});
                                    var Email = require('../models/email');
                                    var objModelEmail = new Email();
                                    let subject = 'POSP Inquiry - ' + data["name"] + ' - InquiryId : ' + data.Posp_Enquiry_Id;
                                    let mail_content = '<html><body>' +
                                            'Dear Team,' +
                                            '<p>We have received POSP enquiry as following</p>' +
                                            '<p></p>Name - ' + data["name"] +
                                            '<p></p>Contact Number  - ' + data["mobile"] +
                                            '<p></p>Email Id  - ' + data["email"] +
                                            '<p></p>City  - ' + data["city_name"] +
                                            '<p></p><p></p>Regards,' +
                                            '<p></p>PolicyBoss' +
                                            '</body></html>';
                                    let email_id = "marketing@policyboss.com";
                                    objModelEmail.send('noreply@policyboss.com', email_id, subject, mail_content, '', config.environment.notification_email, '');
                                } else {
                                    res.json({'Msg': "Already Updated.", 'Status': "Success"});
                                }
                            }
                        });
                    } else {
                        //insert
//                        client.get(config.environment.weburl + '/postservicecall/posp_enquires/get_lead_assigned', {}, function (data2, response2) {
                        try {
                            let random_lead_assign_ss_id = "";
                            let lead_assign_ss_id = [];
                            if (objRequestCore.Source && objRequestCore.Source === "DATACOMP") {
                                lead_assign_ss_id = [
                                    {"Ss_Id": 12649, "UID": 112453, "Name": "Sachin Bhausaheb Gavali"},
                                    {"Ss_Id": 32178, "UID": 114960, "Name": "Rohitkumar Kureel"},
                                    {"Ss_Id": 134428, "UID": 117844, "Name": "PRINCEKUMAR ABDHESHKUMAR SINGH"}
                                ];
                            } else {
                                lead_assign_ss_id = [
                                    {"Ss_Id": 32178, "UID": 114960, "Name": "Rohitkumar Kureel"},
                                    {"Ss_Id": 144619, "UID": 118884, "Name": "Sachin Bhausaheb Gavali"},
									{"Ss_Id": 144618, "UID": 118883, "Name": "Aarya Utekar"},
                                    {"Ss_Id": 114128, "UID": 115451, "Name": "Chandan Rajeshwar Ram"},
                                    {"Ss_Id": 31444, "UID": 114860, "Name": "Aaradhya Ajay Kamble"},
                                    {"Ss_Id": 124053, "UID": 116462, "Name": "Sejal Anil Padwal"},
                                    {"Ss_Id": 126615, "UID": 116762, "Name": "Shubham Kundan Mahadik"},
                                    {"Ss_Id": 128895, "UID": 116956, "Name": "Aarti Nandlal Yadav"},
                                    {"Ss_Id": 130044, "UID": 117053, "Name": "Priti Shridhar Kadam"},
                                    {"Ss_Id": 130045, "UID": 117054, "Name": "Anzali Santosh Gupta"},
                                    {"Ss_Id": 130378, "UID": 117101, "Name": "Sanjayani Dattaram Budar"},
                                    {"Ss_Id": 130376, "UID": 117099, "Name": "Nehalaxmi Sudalai Moopanar"},
                                    {"Ss_Id": 120750, "UID": 116019, "Name": "Mahek Hakim Shaikh"},
                                    {"Ss_Id": 134876, "UID": 117933, "Name": "Shukla Jaya Dinesh"},
                                    {"Ss_Id": 134975, "UID": 117958, "Name": "Manali Deepak Gaikwad"},
                                    {"Ss_Id": 128509, "UID": 116922, "Name": "Sarita Maggan Chauhan"},
                                    {"Ss_Id": 136218, "UID": 118149, "Name": "Sana Imamali Qureshi"},
                                    {"Ss_Id": 134683, "UID": 117879, "Name": "Jyoti Subhash Kanojiya"},
                                    {"Ss_Id": 135141, "UID": 117987, "Name": "Renuka Balappa Jogi"},
                                    {"Ss_Id": 134457, "UID": 117860, "Name": "Sanjit Sanjeev More"},
                                    {"Ss_Id": 130637, "UID": 117137, "Name": "Amankumar Jagannath Prajapati"},
                                    {"Ss_Id": 134061, "UID": 117773, "Name": "Tehsin Afaque Shaikh"},
                                    {"Ss_Id": 131050, "UID": 117233, "Name": "Reshma Mohammad Mukuim Khan"},
                                    {"Ss_Id": 131045, "UID": 117228, "Name": "Ajit Kumar"},
                                    {"Ss_Id": 131044, "UID": 117227, "Name": "Yadav Ankit Laxmi Shankar"},
                                    {"Ss_Id": 131483, "UID": 117317, "Name": "Aditya Dinesh Hate"},
                                    {"Ss_Id": 135873, "UID": 118108, "Name": "Diwakar Gokul Bhagwat"},
                                    {"Ss_Id": 136124, "UID": 118130, "Name": "Priya Pradeep Poyrekar"},
                                    {"Ss_Id": 136822, "UID": 118246, "Name": "Priyanka Bindaram Baheliya"},
                                    {"Ss_Id": 136823, "UID": 118247, "Name": "Mohammed Sameer Shaikh"},
                                    {"Ss_Id": 131046, "UID": 117229, "Name": "Arbaz Malik Tehsildar"},
                                    {"Ss_Id": 131047, "UID": 117230, "Name": "Sabiya Khan"},
                                    {"Ss_Id": 131042, "UID": 117225, "Name": "Sarvesh Bajirao Kashid"},
                                    {"Ss_Id": 133312, "UID": 117636, "Name": "Varsha Manoj Bidlan"},
                                    {"Ss_Id": 136824, "UID": 118248, "Name": "Roshani Rajendra Giri"}
                                ];
                            }
                            let temp_random = Math.floor(Math.random() * lead_assign_ss_id.length);
                            //random_lead_assign_ss_id = lead_assign_ss_id[temp_random][(Object.keys(lead_assign_ss_id[temp_random]))[0]]+" ("+(Object.keys(lead_assign_ss_id[temp_random]))[0] + ")";//lead_assign_ss_id[temp_random];
                            random_lead_assign_ss_id = lead_assign_ss_id[temp_random]["Ss_Id"];
                            var posp_enquiry_data = new posp_enquiry();
                            for (var key in objRequestCore) {
                                posp_enquiry_data[key] = objRequestCore[key];
                            }
                            posp_enquiry_data.Status = "Active";
                            posp_enquiry_data.Created_On = new Date();
                            posp_enquiry_data.Modified_On = new Date();
                            posp_enquiry_data.last_enquiry_on = new Date();
                            posp_enquiry_data.last_assigned_to = random_lead_assign_ss_id;
                            posp_enquiry_data.last_assigned_by = 0;
                            posp_enquiry_data.last_assigned_on = new Date();
                            posp_enquiry_data.Source = objRequestCore.hasOwnProperty('Source') ? objRequestCore.Source : "";
                            posp_enquiry_data.save(function (err1, dbrespnse) {
                                if (err1) {
                                    res.json({'Msg': err1, 'Status': "Error"});
                                } else {
                                    //iib check start
                                    try {
                                        if (objRequestCore["pan"] !== "" && dbrespnse.Posp_Enquiry_Id > 0) {
                                            let Obj_Iib = {
                                                "IIB_Status": "",
                                                "IIB_Status_On": new Date(),
                                                "IIB_Screenshot": ""
                                            };
                                            objRequestCore["pan"] = objRequestCore["pan"].toUpperCase();
                                            client.get(config.environment.weburl + '/app_visitor/pos_iib_automation/search?txt_pan=' + objRequestCore["pan"], function (iib_data, iib_response) {
                                                if (iib_data && iib_data["status"] == "SUCCESS" && iib_data["data"]) {
                                                    Obj_Iib["IIB_Status"] = iib_data["data"]["STATUS"] || "NA";
                                                    Obj_Iib["IIB_Screenshot"] = iib_data["data"]["SCREENSHOT"] || "NA";
                                                    posp_enquiry.update({"Posp_Enquiry_Id": dbrespnse.Posp_Enquiry_Id}, {$set: Obj_Iib}, function (err, doc) {

                                                    });
                                                }
                                            });
                                        }
                                    } catch (e) {
                                        console.error("Inquiry_IIB", e.stack);
                                    }
                                    //iib check finish
                                    //save to history									
                                    let args = {
                                        "Posp_Enquiry_Id": dbrespnse['Posp_Enquiry_Id'],
                                        "mobile": dbrespnse['mobile'],
                                        "name": dbrespnse['name'],
                                        "pan": dbrespnse['pan'],
                                        "aadhaar": dbrespnse['aadhaar'],
                                        "last_assigned_by": dbrespnse['last_assigned_by'],
                                        "last_assigned_to": dbrespnse['last_assigned_to'],
                                        "last_assigned_on": dbrespnse['last_enquiry_on'],
                                        "Created_On": new Date(),
                                        "Modified_On": new Date()
                                    };
                                    let posp_assigned_historyObj = new posp_assigned_history(args);
                                    posp_assigned_historyObj.save(function (err, dbdata) {});
                                    res.json({'Msg': "Data Inserted Successfully", 'Status': "Success"});
                                    var Email = require('../models/email');
                                    var objModelEmail = new Email();
                                    let subject;
                                    if (req.body.hasOwnProperty("Source") && req.body.Source) {
                                        subject = '[' + req.body.Source + '] - ' + 'POSP Inquiry - ' + dbrespnse._doc["name"] + ' - InquiryId : ' + dbrespnse.Posp_Enquiry_Id;
                                    } else {
                                        subject = 'POSP Inquiry - ' + dbrespnse._doc["name"] + ' - InquiryId : ' + dbrespnse.Posp_Enquiry_Id;
                                    }
                                    let mail_content = '<html><body>' +
                                            'Dear Team,' +
                                            '<p>We have received POSP enquiry as following</p>' +
                                            '<p></p>Name - ' + dbrespnse._doc["name"] +
                                            '<p></p>Contact Number  - ' + dbrespnse._doc["mobile"] +
                                            '<p></p>Email Id  - ' + dbrespnse._doc["email"] +
                                            '<p></p>City  - ' + dbrespnse._doc["city_name"] +
                                            '<p></p><p></p>Regards,' +
                                            '<p></p>PolicyBoss' +
                                            '</body></html>';
                                    let email_id = "st@policyboss.com;marketing@policyboss.com";
                                    objModelEmail.send('noreply@policyboss.com', email_id, subject, mail_content, '', config.environment.notification_email, '');
                                }
                            });
                        } catch (e) {
                            res.json({'Msg': e.stack, 'Status': "Fail"});
                        }
//                        });
                    }
                }
            });
        } else {
            res.json({'Msg': "Mobile Number Missing.", 'Status': "Fail"});
        }
    } catch (e) {
        res.json({'Msg': e, 'Status': "Fail"});
    }
});

router.post('/add_corp_lead', function (req, res) {
    var contact_name = req.body.contact_name;
    var mobile = req.body.mobile;
    var email = req.body.email;
    var product = req.body.product;
    var message = req.body.message;
    var ip_address = req.body.ip_address === undefined ? "" : req.body.ip_address;
    var search_parameter = req.body.search_parameter === undefined ? "" : ((Object.keys(req.body.search_parameter).length === 0) ? "" : req.body.search_parameter);

    var arg = {
        Contact_Name: contact_name,
        Mobile_No: parseInt(mobile),
        Email_Id: email,
        Product: product,
        Message: message,
        IP_Address: ip_address,
        Created_On: new Date(),
        Search_Parameter: search_parameter
    };
    let obj_content = {
        Contact_Name: contact_name,
        Mobile_No: mobile,
        Email_Id: email,
        Remarks: message
    };

    let mail_content = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>CORP LEAD</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>Corp Lead';
    mail_content += objectToHtml(obj_content);
    mail_content += '</body></html>';

    var corp_lead = require('../models/corp_lead');
    let corp_lead_log = new corp_lead(arg);
    corp_lead_log.save(function (err, res1) {
        if (err) {
            res.json({'Status': 'Fail'});
        } else {
            if (res1.hasOwnProperty('_doc')) {
                var Email = require('../models/email');
                var objModelEmail = new Email();
                if (config.environment.name === 'Production') {
                    var to = "sagar.tejuja@landmarkinsurance.in,manish.hingorani@landmarkinsurance.in";
                    var cc = "st@policyboss.com,marketing@policyboss.com";
                } else {
                    var to = config.environment.notification_email;
                    var cc = "anuj.singh@policyboss.com";
                }
                var subject = "[CorpLeadId-" + res1['_doc']['Corp_Id'] + "]Product-" + res1['_doc']['Product'];
                objModelEmail.send('noreply@policyboss.com', to, subject, mail_content, cc, '');
                res.json({'Status': 'Success'});
            }
        }
    });
});


router.post('/ibuddy_assigned', function (req, res) {
    try {
        let ibuddy_assign_history = require('../models/ibuddy_assign_history');
        let objibuddy_assign_history = new ibuddy_assign_history();
        for (let key in req.body) {
            objibuddy_assign_history[key] = req.body[key];
        }
        objibuddy_assign_history.Created_On = new Date();
        objibuddy_assign_history.Modified_On = new Date();
        objibuddy_assign_history.save(function (err, resdata) {
            if (err) {
                res.json({'Status': 'Error', 'Msg': err.stack});
            } else {
                res.json({'Status': 'Success', 'Msg': "ibuddy assigned successfully"});
            }
        });
    } catch (ex) {
        console.log("error:", ex);
        res.json({'Status': 'Error', 'Msg': ex.stack});
    }
});

function objectToHtml(objSummary) {
    var msg = '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;"></span><table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow: 1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  >';
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

router.post('/get_all_document', function (req, res) {
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
            $or: [{"Status": "UPLOADED"}, {"Status": "PENDING"}]
        };
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
router.post('/capture_proposal_summary', function (req, res) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var path = appRoot + "/tmp/proposal_summary/";
    var objRequestCore = req.body;
    var crn = objRequestCore.crn;
    var udid = objRequestCore.udid;
    var photo_file_name = crn + '_' + udid + '.png';
    var screenshot = decodeURIComponent(objRequestCore.screenshot);
    try {
        var data = screenshot.replace(/^data:image\/\w+;base64,/, "");
        if (data === "") {
            res.json({'status': 'falied', 'msg': 'No image available'});
        } else {
            var buf = new Buffer(data, 'base64');
            fs.writeFile(path + photo_file_name, buf);
            res.json({'status': 'success', 'msg': 'Screen shot captured succesfully'});
        }
    } catch (err) {
        console.log(err);
        res.json({'status': 'falied', 'msg': err});
    }
});
router.post('/verify_web_auth_token', function (req, res) {
    try {
        let ObjRequest = req.body;
        let auth_token = ObjRequest['auth_token'];
        let user_agent = ObjRequest['user_agent'];
        let auth_tokens = require('../models/auth_token');
        let find_data = {
            Auth_Token: auth_token,
//                User_Agent: user_agent,
            "Created_On": {$gte: new Date(new Date().getTime() - 1000 * 60 * 60)}
        };
        auth_tokens.find(find_data, function (err, dbData) {
            if (err) {
                res.json({'Status': 'FAIL', 'Msg': err, 'Token': ''});
            } else {
                if (dbData && dbData.hasOwnProperty('0') && dbData[0].hasOwnProperty('_doc')) {
                    res.json({'Status': 'SUCCESS', 'Msg': 'Token Verify successfully', 'Data': dbData[0]['_doc'], 'Token': dbData[0]['_doc']['Auth_Token']});
                } else {
                    res.json({'Status': 'FAIL', 'Msg': 'Token Expire/Token Mismatch', 'Token': ''});
                }
            }
        });
    } catch (e) {
        res.json({'Status': 'FAIL', 'Msg': e.stack, 'Token': ''});
    }
});
router.post('/get_vehicle_details', function (req, res) {
    try {
        var Base = require('../libs/Base');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: '',
            sort: {'Created_On': -1},
            lean: true
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        var ObjRequest = req.body;
        if (ObjRequest && ObjRequest.RegNo && ObjRequest.RegNo !== null || ObjRequest.RegNo !== undefined) {
            filter["Registration_Number"] = new RegExp(ObjRequest["RegNo"], 'i');
        }
        var vehicle_detail = require('../models/vehicle_detail');
        vehicle_detail.paginate(filter, optionPaginate, function (err, dbvehicledetail) {
            if (err) {
                res.json(err);
            } else {
                res.json(dbvehicledetail);
            }
        });
    } catch (e) {
        console.error(e.stack);
        res.json({"Msg": "error", 'Details': e.stack});
    }
});

router.post('/get_rcocr_details', function (req, res) {
    try {
        var Base = require('../libs/Base');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: '',
            sort: {'Created_On': -1},
            lean: true
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        var ObjRequest = req.body;
        if (ObjRequest && ObjRequest.RegNo && ObjRequest.RegNo !== null || ObjRequest.RegNo !== undefined) {
            filter["vehicle_no"] = new RegExp(ObjRequest["RegNo"], 'i');
        }
        if (ObjRequest && ObjRequest.Vehicle_Class && ObjRequest.Vehicle_Class !== null || ObjRequest.Vehicle_Class !== undefined) {
            filter["vehicle_class"] = ObjRequest["Vehicle_Class"];
        }
        var rc_ocr_detail = require('../models/rc_ocr_detail');
        rc_ocr_detail.paginate(filter, optionPaginate, function (err, dbrc) {
            if (err) {
                res.json(err);
            } else {
                res.json(dbrc);
            }
        });
    } catch (e) {
        console.error(e.stack);
        res.json({"Msg": "error", 'Details': e.stack});
    }
});

router.post('/get_vehicle_class', function (req, res) {
    try {
        var Base = require('../libs/Base');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: '',
            sort: {'Created_On': -1},
            lean: true
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        var ObjRequest = req.body;
        if (ObjRequest && ObjRequest.RegNo && ObjRequest.RegNo !== null || ObjRequest.RegNo !== undefined) {
            filter["Registration_Number"] = new RegExp(ObjRequest["RegNo"], 'i');
        }
        if (ObjRequest && ObjRequest.Vehicle_Class && ObjRequest.Vehicle_Class !== null || ObjRequest.Vehicle_Class !== undefined) {
            filter["Vehicle_Class"] = ObjRequest["Vehicle_Class"];
        }
        var vehicle_class = require('../models/vehicle_class');
        vehicle_class.paginate(filter, optionPaginate, function (err, dbvehicleclass) {
            if (err) {
                res.json(err);
            } else {
                res.json(dbvehicleclass);
            }
        });
    } catch (e) {
        console.error(e.stack);
        res.json({"Msg": "error", 'Details': e.stack});
    }
});

router.post('/get_vehicle_class_master', function (req, res) {
    try {
        var Base = require('../libs/Base');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: '',
            sort: {'Created_On': -1},
            lean: true
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        var ObjRequest = req.body;
        if (ObjRequest && ObjRequest.Vehicle_Class && ObjRequest.Vehicle_class !== null || ObjRequest.Vehicle_class !== undefined) {
            filter["Vehicle_Class"] = ObjRequest["Vehicle_Class"];
        }
        if (ObjRequest && ObjRequest.Product_Id && ObjRequest.Product_Id !== null || ObjRequest.Product_Id !== undefined) {
            filter["Product_Id"] = parseInt(ObjRequest["Product_Id"]);
        }
        var vehicle_class_master = require('../models/vehicle_class_master');
        vehicle_class_master.paginate(filter, optionPaginate, function (err, dbvehicleclassmaster) {
            if (err) {
                res.json(err);
            } else {
                res.json(dbvehicleclassmaster);
            }
        });
    } catch (e) {
        console.error(e.stack);
        res.json({"Msg": "error", 'Details': e.stack});
    }
});

router.post('/update_vehicle_class_master', function (req, res) {
    try {
        let id = req.body.id ? req.body.id : "";
        let vehicleClassMasterObj = {};
        for (var key in req.body) {
            if (key === "id") {
                continue;
            } else {
                vehicleClassMasterObj[key] = req.body[key];
            }
        }
        vehicleClassMasterObj['Classified_On'] = new Date();
        if (id !== "") {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                if (err)
                    throw err;
                var vehicle_class_master = db.collection('vehicle_class_masters');
                vehicle_class_master.update({'_id': ObjectID(id)}, {$set: vehicleClassMasterObj}, function (err, numAffected) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": "vehicle class master not updated."});
                    } else {
                        if (numAffected && numAffected.result && (numAffected.result.nModified === 1)) {
                            res.json({"Status": "Success", "Msg": "vehicle class master updated successfully."});
                        }
                    }
                    db.close();
                });
            });
        } else {
            res.json({"Status": "Fail", "Msg": "vechicle class master id is missing."});
        }
    } catch (ex) {
        console.error('Exception', 'update vehicle class master service', ex);
        res.json({"Status": "Fail", "Msg": ex.stack});
    }
});

router.get('/get_allvehicleclass/:vehicleclass', function (req, res) {
    try {
        var vehicle_class = require('../models/vehicle_class');
        let Vehicle_Class = req.params.vehicleclass ? req.params.vehicleclass : "";
        if (Vehicle_Class && Vehicle_Class !== "") {
            vehicle_class.find({"Vehicle_Class_Core": Vehicle_Class}, function (err, dbvehicleclass) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(dbvehicleclass);
                }
            });
        }


    } catch (e) {
        console.error(e.stack);
        res.json({"Msg": "error", 'Details': e.stack});
    }
});
router.post('/no_dues_data/add_approver_details', function (req, res) {
    try {
        let no_dues_data = require('../models/no_dues_data');
        let no_dues_history = require('../models/no_dues_history');
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
router.post('/kyc_details/save_kyc_details', function (req, res) {
    try {
        let ObjRequest = req.body;
        let crn = ObjRequest.crn - 0;
        let insurer_id = ObjRequest.insurer_id - 0;
        let udid = ObjRequest.udid - 0;
        let full_name = ObjRequest.Proposal_Request['middle_name'] === "" ? (ObjRequest.Proposal_Request['first_name'] + " " + ObjRequest.Proposal_Request['last_name']) : (ObjRequest.Proposal_Request['first_name'] + " " + ObjRequest.Proposal_Request['middle_name'] + " " + ObjRequest.Proposal_Request['last_name']);
        let proposal_request = ObjRequest.hasOwnProperty('Proposal_Request') && ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : {};
        let query = {
            PB_CRN: crn,
            Document_ID: (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
            DOB: (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date,
            Insurer_Id: (req.body.insurer_id === undefined || req.body.insurer_id === "" || req.body.insurer_id === null) ? "" : req.body.insurer_id - 0,
            KYC_Status: {$nin: [null, "", "VERIFY_FAIL", "FETCH_FAIL", "KYC_UPDATE_FAIL", "VERIFY_SUCCESS"]},
            KYC_Number: {$nin: [null, ""]}
        };
        if (ObjRequest.insurer_id === 11) {
            query['Proposal_Id'] = (ObjRequest.Proposal_Id === undefined || ObjRequest.Proposal_Id === "" || ObjRequest.Proposal_Id === null) ? "" : ObjRequest.Proposal_Id;
        }
        if ([10, 6, 1].indexOf(ObjRequest.insurer_id) > -1) { //Royal,ICICI,Bajaj
            query['Quote_Id'] = (ObjRequest.Quote_Id === undefined || ObjRequest.Quote_Id === "" || ObjRequest.Quote_Id === null) ? "" : ObjRequest.Quote_Id;
        }
        kyc_history.findOne(query).sort({Created_On: -1}).exec((err, data) => {
            try {
                if (err) {
                    res.json({"Msg": err, "Status": "FAIL"});
                } else {
                    if (data && data.hasOwnProperty('_doc') && data['_doc'].hasOwnProperty('KYC_Status') && data['_doc']['KYC_Status'] !== "VERIFY_FAIL" && data['_doc']['KYC_Status'] !== "FETCH_FAIL" && [2, 4, 13].indexOf(ObjRequest.product_id) === -1 && [30].indexOf(ObjRequest.insurer_id) === -1) {
                        let kyc_details_updateObj = {
                            'Search_Type': (ObjRequest.search_type === undefined || ObjRequest.search_type === "" || ObjRequest.search_type === null) ? "" : ObjRequest.search_type,
                            'Document_Type': (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,
                            'Document_ID': (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                            'Modified_On': new Date(),
                            'Proposal_Request': proposal_request,
                            'Full_Name': (data['_doc'].hasOwnProperty('KYC_Full_Name') && data['_doc']['KYC_Full_Name']) ? data['_doc']['KYC_Full_Name'] : full_name,
                            'proposal_page_url': ObjRequest.hasOwnProperty('proposal_url') ? ObjRequest.proposal_url : "",
                            'User_Data_Id': udid
                        };
                        kyc_detail.update({"PB_CRN": crn, "Insurer_Id": insurer_id}, {$set: kyc_details_updateObj}, function (err, db_update_kyc_detail) {
                            if (err) {
                                res.json({"Msg": err, "Status": "FAIL"});
                            } else {
                                console.log('/kyc_details/save_kyc_details - kyc_details document updated');
                            }
                        });
                        let LM_Data = {
                            "KYC_Doc_No": (data['_doc'].hasOwnProperty('Document_ID')) ? (data['_doc']['Document_ID']) : "",
                            "KYC_Number": (data['_doc'].hasOwnProperty('KYC_Number')) ? (data['_doc']['KYC_Number']) : "",
                            "KYC_FullName": (data['_doc'].hasOwnProperty('KYC_Full_Name')) ? (data['_doc']['KYC_Full_Name']) : (data['_doc'].hasOwnProperty('Full_Name')) ? (data['_doc']['Full_Name']) : "",
                            "KYC_Ref_No": (data['_doc'].hasOwnProperty('KYC_Ref_No')) ? (data['_doc']['KYC_Ref_No']) : "",
                            "KYC_Redirect_URL": (data['_doc'].hasOwnProperty('KYC_URL')) ? (data['_doc']['KYC_URL']) : "",
                            "KYC_Insurer_ID": (data['_doc'].hasOwnProperty('Insurer_Id')) ? (data['_doc']['Insurer_Id']) : "",
                            "KYC_PB_CRN": (data['_doc'].hasOwnProperty('PB_CRN')) ? (data['_doc']['PB_CRN']) : "",
                            "KYC_Status": (data['_doc'].hasOwnProperty('KYC_Status')) ? (data['_doc']['KYC_Status']) : ""
                        };
                        res.send(LM_Data);
                    } else {
                        let saveObj = {
                            'Insurer_Id': insurer_id,
//            'PAN_Doc': "",
//            'Aadhar_Doc': "",
                            'Search_Type': (ObjRequest.search_type === undefined || ObjRequest.search_type === "" || ObjRequest.search_type === null) ? "" : ObjRequest.search_type,
                            'KYC_Number': "",
                            'Mobile': (proposal_request.mobile === undefined || proposal_request.mobile === "" || proposal_request.mobile === null) ? "" : proposal_request.mobile - 0,
//            'PAN': (proposal_request.pan === undefined || proposal_request.pan === "" || proposal_request.pan === null) ? "" : proposal_request.pan,
//            'Aadhar': (proposal_request.aadhar === undefined || proposal_request.aadhar === "" || proposal_request.aadhar === null) ? "" : proposal_request.aadhar,
                            'Document_Type': (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,
                            'Document_ID': (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                            'KYC_Status': "PENDING",
                            'DOB': (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date,
                            'Created_On': new Date(),
                            'Modified_On': new Date(),
                            'User_Data_Id': udid,
                            'Product_Id': (ObjRequest.product_id === undefined || ObjRequest.product_id === "" || ObjRequest.product_id === null) ? 0 : ObjRequest.product_id - 0,
                            'Email': (proposal_request.email === undefined || proposal_request.email === "" || proposal_request.email === null) ? "" : proposal_request.email,
                            'PB_CRN': (ObjRequest.crn === undefined || ObjRequest.crn === "" || ObjRequest.crn === null) ? "" : ObjRequest.crn - 0,
                            'Proposal_Request': proposal_request,
                            'Proposal_Id': ObjRequest.hasOwnProperty('Proposal_Id') ? ObjRequest.Proposal_Id : "",
                            'Quote_Id': ObjRequest.hasOwnProperty('Quote_Id') ? ObjRequest.Quote_Id : "",
                            'KYC_URL': "",
                            'KYC_Ref_No': "",
                            'Full_Name': full_name,
                            'KYC_Full_Name': "",
                            'proposal_page_url': ObjRequest.hasOwnProperty('proposal_url') ? ObjRequest.proposal_url : "",
                            'service_log_id': proposal_request.hasOwnProperty('slid') ? proposal_request.slid : ""
                        };
                        let updateObj = {
//            'PAN_Doc': "",
//            'Aadhar_Doc': "",
                            'Search_Type': (ObjRequest.search_type === undefined || ObjRequest.search_type === "" || ObjRequest.search_type === null) ? "" : ObjRequest.search_type,
                            'KYC_Number': "",
                            'Mobile': (proposal_request.mobile === undefined || proposal_request.mobile === "" || proposal_request.mobile === null) ? "" : proposal_request.mobile - 0,
//            'PAN': (proposal_request.pan === undefined || proposal_request.pan === "" || proposal_request.pan === null) ? "" : proposal_request.pan,
//            'Aadhar': (proposal_request.aadhar === undefined || proposal_request.aadhar === "" || proposal_request.aadhar === null) ? "" : proposal_request.aadhar,
                            'Document_Type': (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,
                            'Document_ID': (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
//            'KYC_Status': "PENDING",
                            'DOB': (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date,
                            'Modified_On': new Date(),
                            'Email': (proposal_request.email === undefined || proposal_request.email === "" || proposal_request.email === null) ? "" : proposal_request.email,
                            'Proposal_Request': proposal_request,
                            'Proposal_Id': ObjRequest.hasOwnProperty('Proposal_Id') ? ObjRequest.Proposal_Id : "",
                            'Quote_Id': ObjRequest.hasOwnProperty('Quote_Id') ? ObjRequest.Quote_Id : "",
                            'KYC_URL': "",
                            'KYC_Ref_No': "",
                            'Full_Name': full_name,
                            'KYC_Full_Name': "",
                            'proposal_page_url': ObjRequest.hasOwnProperty('proposal_url') ? ObjRequest.proposal_url : "",
                            'service_log_id': proposal_request.hasOwnProperty('slid') ? proposal_request.slid : "",
                            'User_Data_Id': udid
                        };
                        kyc_detail.findOne({'PB_CRN': crn, 'Insurer_Id': insurer_id}).sort({Modified_On: -1}).exec(function (err, db_svae_kyc_detail) {
                            if (err) {
                                res.json({"Msg": err, "Status": "FAIL"});
                            } else {
                                if (db_svae_kyc_detail) {
                                    kyc_detail.update({"PB_CRN": crn, "Insurer_Id": insurer_id}, {$set: updateObj}, function (err, db_update_kyc_detail) {
                                        if (err) {
                                            res.json({"Msg": err, "Status": "FAIL"});
                                        } else {
                                            let url_api = config.environment.weburl + '/postservicecall/kyc_details/search_kyc_details/' + (crn) + '/' + (udid) + '/' + (insurer_id);
                                            client.get(url_api, function (data, response) {
                                                if (data) {
                                                    kyc_mail_send(data.Msg);
                                                    res.json(data.Msg);
                                                } else {
                                                    res.json({"Msg": "/search_kyc_details/ service issue", "Status": "FAIL"});
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    let kyc_detail1 = new kyc_detail(saveObj);
                                    kyc_detail1.save(saveObj, function (err, users) {
                                        if (err) {
                                            res.json({"Msg": err, "Status": "FAIL"});
                                        } else {
                                            let url_api = config.environment.weburl + '/postservicecall/kyc_details/search_kyc_details/' + (req.body.crn - 0) + '/' + (req.body.udid - 0) + '/' + (req.body.insurer_id - 0);
                                            client.get(url_api, function (data, response) {
                                                if (data) {
                                                    kyc_mail_send(data.Msg);
                                                    res.json(data.Msg);
                                                } else {
                                                    res.json({"Msg": "/search_kyc_details/ service issue", "Status": "FAIL"});
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            } catch (err) {
                res.json({"Msg": err.stack, "Status": "FAIL"});
            }
        });
    } catch (e1) {
        res.json({"Msg": e1.stack, "Status": "FAIL"});
    }
});
router.get('/kyc_details/verifiy_kyc_details/:crn/:insurer_id/:kyc_no', function (req, res) {
    try {
        let kyc_no = req.params['kyc_no'];
        client.get(config.environment.weburl + '/kyc_details/get_kyc_status/' + req.params.crn + '/' + req.params.insurer_id, {}, function (get_db_kyc_details, response) {
            let verfiy_args = get_db_kyc_details['Msg'];
            verfiy_args['user_kyc_no'] = kyc_no;
            verfiy_args['Verify_Search_Type'] = "VERIFY";
            let tmp_url_api = {
                '1': 'bajaj_verify_kyc_details',
                '5': 'hdfc_fetch_kyc_details',
                '10': 'royal_verify_kyc_details',
                '33': 'liberty_verify_kyc_details',
                '7': 'iffco_verify_kyc_details',
                '3': 'chola_verify_kyc_details',
                '4': 'future_verify_kyc_details',
                '11': 'tataaig_verify_kyc_details',
                '44': 'digit_verify_kyc_details',
                '6': 'icici_verify_kyc_details',
                '12': 'newindia_verify_kyc_details',
                '30': 'kotak_verify_kyc_details',
                '14': 'united_verify_kyc_details'
            };
            let insurer_api_name;
            if ([9, 46].includes(verfiy_args.Insurer_Id - 0)) {
                insurer_api_name = 'webhook_verify_kyc_details';
            } else {
                insurer_api_name = tmp_url_api[verfiy_args.Insurer_Id];
            }
//            if (get_db_kyc_details && get_db_kyc_details.Status === "FETCH_SUCCESS") {
//                let data = {};
//                data.KYC_Number = kyc_no;
//                res.json({"Insurer": insurer_api_name, "Msg": data, "Status": "FETCH_SUCCESS"});
//            } else 
            if ([5].indexOf(parseInt(verfiy_args.Insurer_Id) > -1) || (get_db_kyc_details && get_db_kyc_details.Status === "FETCH_SUCCESS")) {
                let args = {
                    data: verfiy_args,
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                if (insurer_api_name === undefined) {
                    res.json({"Msg": "KYC Process is Under Construction.....", "Status": "NEW"});
                } else {
                    let url_api = config.environment.weburl + '/kyc_details/' + insurer_api_name;
                    client.post(url_api, args, function (data, response) {
                        if (data) {
                            kyc_mail_send(data.Msg);
                            res.json(data['Msg']);
                        } else {
                            res.json({"Insurer": insurer_api_name, "Msg": "Verify service issue", "Status": "FAIL"});
                        }
                    });
                }
            } else {
                res.json({"Msg": "/verifiy_kyc_details no details available", "Status": "FAIL"});
            }
        });
    } catch (e) {
        res.json({"Msg": e.stack, "Status": "FAIL"});
    }
});
router.get('/kyc_details/search_kyc_details/:crn/:udid/:insurer_id', function (req, res) {
    try {
        let crn = (req.params.crn === undefined || req.params.crn === "" || req.params.crn === null) ? "" : req.params.crn - 0;
        let udid = (req.params.udid === undefined || req.params.udid === "" || req.params.udid === null) ? "" : req.params.udid - 0;
        let insurer_id = (req.params.insurer_id === undefined || req.params.insurer_id === "" || req.params.insurer_id === null) ? "" : req.params.insurer_id - 0;
        let tmp_url_api = {
            '1': 'bajaj_fetch_kyc_details',
            '5': 'hdfc_fetch_kyc_details',
            '10': 'royal_fetch_kyc_details',
            '33': 'liberty_fetch_kyc_details',
            '46': 'edelweiss_fetch_kyc_details',
            '7': 'iffco_fetch_kyc_details',
            '3': 'chola_fetch_kyc_details',
            '4': 'future_fetch_kyc_details',
            '9': 'reliance_fetch_kyc_details',
            '11': 'tataaig_fetch_kyc_details',
            '44': 'digit_fetch_kyc_details',
            '6': 'icici_fetch_kyc_details',
            '12': 'newindia_fetch_kyc_details',
            '30': 'kotak_fetch_kyc_details',
            '14': 'united_fetch_kyc_details',
            '35': 'magma_fetch_kyc_details',
            '17': 'sbig_fetch_kyc_details'
        };
        let insurer_api_name = tmp_url_api[insurer_id];
        let kyc_detail = require('../models/kyc_detail');
        kyc_detail.find({'PB_CRN': crn, 'Insurer_Id': insurer_id}).sort({Modified_On: -1}).exec(function (err, data) {
            if (err) {
                res.json({"Msg": err, "Status": "/kyc_details/search_kyc_details FAIL"});
            } else {
                if (data && data.length > 0) {
                    if (insurer_api_name === undefined) {
                        res.json({"Msg": "KYC Process is Under Construction.....", "Status": "FAIL"});
                    } else {
                        let args = {
                            data: data[0]['_doc'],
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }; //pls comment - issue - multiple records
                        let url_api = config.environment.weburl + '/kyc_details/' + insurer_api_name;
                        client.post(url_api, args, function (data, response) {
                            if (data) {
                                if (data.Status === "FETCH_SUCCESS") {
                                    res.json({"Insurer": insurer_api_name, "Msg": data.Msg, "Status": "SUCCESS"});
                                } else {
                                    res.json({"Insurer": insurer_api_name, "Msg": data.Msg, "Status": "FAIL"}); // roshani
                                }
                            } else {
                                res.json({"Insurer": insurer_api_name, "Msg": "Verify service issue", "Status": "FAIL"});
                            }
                        });
                    }
                } else {
                    res.json({"Msg": 'KYC_DETAILS :: No Record Found', "Status": "NEW"});
                }
            }
        });
    } catch (e1) {
        res.json({"Msg": e1.stack, "Status": "FAIL"});
    }
});
router.post('/kyc_details/create_kyc_details', function (req, res) {
    try {
        let ObjRequest = req.body;
        let crn = (req.body.crn === undefined || req.body.crn === "" || req.body.crn === null) ? "" : req.body.crn - 0;
        let udid = (req.body.udid === undefined || req.body.udid === "" || req.body.udid === null) ? "" : req.body.udid - 0;
        let insurer_id = (req.body.insurer_id === undefined || req.body.insurer_id === "" || req.body.insurer_id === null) ? "" : req.body.insurer_id - 0;
        let full_name = ObjRequest.Proposal_Request['middle_name'] === "" ? (ObjRequest.Proposal_Request['first_name'] + " " + ObjRequest.Proposal_Request['last_name']) : (ObjRequest.Proposal_Request['first_name'] + " " + ObjRequest.Proposal_Request['middle_name'] + " " + ObjRequest.Proposal_Request['last_name']);
        let proposal_request = ObjRequest.hasOwnProperty('Proposal_Request') && ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : {};
        let tmp_url_api = {
            '7': 'iffco_create_kyc_details',
            '1': 'bajaj_create_kyc_details',
            '44': 'digit_create_kyc_details',
            '6': 'icici_create_kyc_details',
            '11': 'tataaig_fetch_kyc_details',
            '5': 'hdfc_create_kyc_details',
            '35': 'magma_create_kyc_details',
            '38': 'manipalcigna_create_kyc_details',
            '17': 'sbig_create_kyc_details'
        };
        let tata_form_60 = ObjRequest.tata_form_60 || false;
        let insurer_api_name = tmp_url_api[insurer_id];
        if (ObjRequest.insurer_id === 11 && tata_form_60 === true) {
            insurer_api_name = 'tataaig_form_60'
        }
        let kyc_detail = require('../models/kyc_detail');
        /* IMAGE SAVE START */
        let path = appRoot + "/tmp/kyc_documents";
        let doc = [];
        let Doc1_path = '';
        let Doc2_path = '';
        let Doc3_path = '';
        if (ObjRequest.Doc1) {
            let extension = ObjRequest.Doc1_Name.split('.')[ObjRequest.Doc1_Name.split('.').length - 1];
            doc.push({'doc_type': 'Doc1', 'doc_name': ObjRequest.Doc1_Name, 'doc_data': ObjRequest.Doc1});
            Doc1_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID + "_" + insurer_id + "." + extension;
            if (insurer_id - 0 === 7) {
                Doc1_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID.split('_')[0] + "_" + insurer_id + "." + extension;
            }
            if (insurer_id - 0 === 5) {
                Doc1_path = `/tmp/kyc_documents/${crn}_${ObjRequest.Document_ID}_${insurer_id}Front.${extension}`;
            }
            if (insurer_id - 0 === 38) {
                Doc1_path = "/tmp/kyc_documents/" + ObjRequest.Quote_Id + "_" + ObjRequest.Document_Type + "." + extension;
        }
        } else {
            Doc1_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID + "_" + insurer_id + ".jpg";
            if (insurer_id - 0 === 7) {
                Doc1_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID.split('_')[0] + "_" + insurer_id + ".jpg";
        }
            if (insurer_id - 0 === 5) {
                Doc1_path = `/tmp/kyc_documents/${crn}_${ObjRequest.Document_ID}_${insurer_id}Front.jpg`;
            }
            if (insurer_id - 0 === 38) {
                Doc1_path = "/tmp/kyc_documents/" + ObjRequest.Quote_Id + "_" + ObjRequest.Document_Type + ".jpg";
            }
            if (!fs.existsSync(appRoot + Doc1_path)) {
                Doc1_path = "";
            }
        }
        if (ObjRequest.Doc2) {
            let extension = ObjRequest.Doc2_Name.split('.')[ObjRequest.Doc2_Name.split('.').length - 1];
            doc.push({'doc_type': 'Doc2', 'doc_name': ObjRequest.Doc2_Name, 'doc_data': ObjRequest.Doc2});
            Doc2_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID + "_" + insurer_id + "." + extension;
            if (insurer_id - 0 === 7) {
                Doc2_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID.split('_')[1] + "_" + insurer_id + "." + extension;
            }
            if (insurer_id - 0 === 5) {
                Doc2_path = `/tmp/kyc_documents/${crn}_${ObjRequest.Document_ID}_${insurer_id}Back.${extension}`;
            }
            if (insurer_id - 0 === 17) {
                Doc2_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Doc2_Name.split('.')[0] + "_" + insurer_id + "." + extension;
            }
            if (insurer_id - 0 === 38) {
                Doc2_path = "/tmp/kyc_documents/" + ObjRequest.Quote_Id + "_" + ObjRequest.Document_Type + "." + extension;
        }
        }else {
            Doc2_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID + "_" + insurer_id + ".jpg";
            if (insurer_id - 0 === 7) {
                Doc2_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID.split('_')[1] + "_" + insurer_id + ".jpg";
        }
            if (insurer_id - 0 === 5) {
                Doc2_path = `/tmp/kyc_documents/${crn}_${ObjRequest.Document_ID}_${insurer_id}Back.jpg`;
            }
            if (insurer_id - 0 === 17) {
                Doc2_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Doc2_Name.split('.')[0] + "_" + insurer_id + ".jpg";
            }
            if (insurer_id - 0 === 38) {
                Doc2_path = "/tmp/kyc_documents/" + ObjRequest.Quote_Id + "_" + ObjRequest.Document_Type + ".jpg";
            }
            if (!fs.existsSync(appRoot + Doc2_path)) {
                Doc2_path = "";
            }
        }
        if (ObjRequest.Doc3) {
            let extension = ObjRequest.Doc3_Name.split('.')[ObjRequest.Doc3_Name.split('.').length - 1];
            doc.push({'doc_type': 'Doc3', 'doc_name': ObjRequest.Doc3_Name, 'doc_data': ObjRequest.Doc3});
            Doc3_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID + "_" + insurer_id + "." + extension;
            
            if (insurer_id - 0 === 38) {
                Doc3_path = "/tmp/kyc_documents/" + ObjRequest.Quote_Id + "_" + ObjRequest.Document_Type + "." + extension;
        }
        } else {
            Doc3_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID + "_" + insurer_id + ".jpg";
            if (insurer_id - 0 === 38) {
                Doc3_path = "/tmp/kyc_documents/" + ObjRequest.Quote_Id + "_" + ObjRequest.Document_Type + ".jpg";
        }
            if (!fs.existsSync(appRoot + Doc3_path)) {
                Doc3_path = "";
            }
        }
        try {
            for (var i = 0; i < doc.length; i++) {
                var doc_decoded = decodeURIComponent(doc[i]['doc_data']);
                if (!fs.existsSync(appRoot + "/tmp/kyc_documents")) {
                    fs.mkdirSync(appRoot + "/tmp/kyc_documents");
                }
                if (fs.existsSync(path)) {
                    var data = doc_decoded.replace(/^data:image\/\w+;base64,/, "");
                    if (data === "") {
                        res.json({"Msg": 'Document Unavailable', "Status": "SUCCESS"});
                    } else {
                        var buf = new Buffer(data, 'base64');
                        if (doc[i]['doc_type'] === "Doc1") {
                            fs.writeFileSync(appRoot + Doc1_path, buf);
                        } else if (doc[i]['doc_type'] === "Doc2") {
                            fs.writeFileSync(appRoot + Doc2_path, buf);
                        } else {
                            fs.writeFileSync(appRoot + Doc3_path, buf);
                        }
                    }
                }
            }
        } catch (err) {
            res.json({"Msg": err.stack, "Status": "FAIL"});
        }
        /* IMAGE SAVE END */
        let LM_Data = {
            "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
            "KYC_Number": "",
            "KYC_FullName": "",
            "KYC_Ref_No": "",
            "KYC_Redirect_URL": "",
            "KYC_Insurer_ID": ObjRequest.insurer_id,
            "KYC_PB_CRN": ObjRequest.crn,
            "KYC_Status": "",
            "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type, //"PAN",
            "KYC_Request": "",
            "KYC_Response": "",
            "ckyc_remarks": ""
        };
        let saveObj = {
            'Insurer_Id': insurer_id,
            'Doc1': Doc1_path,
            'Doc2': Doc2_path,
            'Doc3': Doc3_path,
            'Doc1_Name': (ObjRequest.Doc1_Name === undefined || ObjRequest.Doc1_Name === "" || ObjRequest.Doc1_Name === null) ? "" : ObjRequest.Doc1_Name,
            'Doc2_Name': (ObjRequest.Doc2_Name === undefined || ObjRequest.Doc2_Name === "" || ObjRequest.Doc2_Name === null) ? "" : ObjRequest.Doc2_Name,
            'Doc3_Name': (ObjRequest.Doc3_Name === undefined || ObjRequest.Doc3_Name === "" || ObjRequest.Doc3_Name === null) ? "" : ObjRequest.Doc3_Name,
            'Search_Type': (ObjRequest.search_type === undefined || ObjRequest.search_type === "" || ObjRequest.search_type === null) ? "" : ObjRequest.search_type,
            'KYC_Number': "",
            'Mobile': (proposal_request.mobile === undefined || proposal_request.mobile === "" || proposal_request.mobile === null) ? "" : proposal_request.mobile - 0,
            'Document_Type': (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,
            'Document_ID': (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
            'KYC_Status': "PENDING",
            'DOB': (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date,
            'Created_On': new Date(),
            'Modified_On': new Date(),
            'User_Data_Id': udid,
            'Product_Id': (ObjRequest.product_id === undefined || ObjRequest.product_id === "" || ObjRequest.product_id === null) ? 0 : ObjRequest.product_id - 0,
            'Email': (proposal_request.email === undefined || proposal_request.email === "" || proposal_request.email === null) ? "" : proposal_request.email,
            'PB_CRN': (ObjRequest.crn === undefined || ObjRequest.crn === "" || ObjRequest.crn === null) ? "" : ObjRequest.crn - 0,
            'Proposal_Request': proposal_request,
            'Proposal_Id': ObjRequest.hasOwnProperty('Proposal_Id') ? ObjRequest.Proposal_Id : "",
            'Quote_Id': ObjRequest.hasOwnProperty('Quote_Id') ? ObjRequest.Quote_Id : "",
            'KYC_URL': "",
            'Full_Name': full_name,
            'KYC_Full_Name': ""
        };
        let updateObj = {
            'Doc1': Doc1_path,
            'Doc2': Doc2_path,
            'Doc3': Doc3_path,
            'Doc1_Name': (ObjRequest.Doc1_Name === undefined || ObjRequest.Doc1_Name === "" || ObjRequest.Doc1_Name === null) ? "" : ObjRequest.Doc1_Name,
            'Doc2_Name': (ObjRequest.Doc2_Name === undefined || ObjRequest.Doc2_Name === "" || ObjRequest.Doc2_Name === null) ? "" : ObjRequest.Doc2_Name,
            'Doc3_Name': (ObjRequest.Doc3_Name === undefined || ObjRequest.Doc3_Name === "" || ObjRequest.Doc3_Name === null) ? "" : ObjRequest.Doc3_Name,
            'Document_Type': (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,
            'Document_ID': (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
            'Search_Type': (ObjRequest.search_type === undefined || ObjRequest.search_type === "" || ObjRequest.search_type === null) ? "" : ObjRequest.search_type,
            'KYC_Number': "",
            'Mobile': (proposal_request.mobile === undefined || proposal_request.mobile === "" || proposal_request.mobile === null) ? "" : proposal_request.mobile - 0,
            'DOB': (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date,
            'Modified_On': new Date(),
            'Email': (proposal_request.email === undefined || proposal_request.email === "" || proposal_request.email === null) ? "" : proposal_request.email,
            'Proposal_Request': proposal_request,
            'Proposal_Id': ObjRequest.hasOwnProperty('Proposal_Id') ? ObjRequest.Proposal_Id : "",
            'Quote_Id': ObjRequest.hasOwnProperty('Quote_Id') ? ObjRequest.Quote_Id : "",
            'KYC_URL': "",
            'Full_Name': full_name,
            'KYC_Full_Name': ""
        };
        kyc_detail.findOne({'PB_CRN': crn, 'Insurer_Id': insurer_id}).sort({Modified_On: -1}).exec(function (err, db_svae_kyc_detail) {
            if (err) {
                res.json({"Msg": err, "Status": "FAIL"});
            } else {
                if (db_svae_kyc_detail) {
                    kyc_detail.findOneAndUpdate({"PB_CRN": crn, "Insurer_Id": insurer_id}, {$set: updateObj}, {new : true}, function (err, db_update_kyc_detail) {
                        if (err) {
                            res.json({"Msg": err, "Status": "FAIL"});
                        } else {
                            if (insurer_api_name === undefined) {
                                res.json({"Msg": "KYC Process is Under Construction.....", "Status": "FAIL"});
                            } else {
                                if (insurer_id === 17) {
                                    db_update_kyc_detail['_doc']['Father_name'] = ObjRequest['Father_Name'];
                                }
                                let args = {
                                    data: db_update_kyc_detail['_doc'],
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }; //pls comment - issue - multiple records
                                let url_api = config.environment.weburl + '/kyc_details/' + insurer_api_name;
                                client.post(url_api, args, function (data, response) {
                                    if (insurer_id === 17) {
                                        res.json({"Insurer": "SBIG", "Status": "SAVED", "KYC_Status": "MANUAL_PENDING"});
                                    } else if (data && data.hasOwnProperty('Msg')) {
                                        LM_Data.KYC_Number = data['Msg']['KYC_Number'] ? data['Msg']['KYC_Number'] : "NA";
                                        LM_Data.KYC_FullName = data['Msg']['KYC_Full_Name'] ? data['Msg']['KYC_Full_Name'] : (data['Msg']['KYC_FullName'] ? data['Msg']['KYC_FullName'] : "NA");
                                        LM_Data.KYC_Ref_No = data['Msg']['KYC_Ref_No'] ? data['Msg']['KYC_Ref_No'] : "NA";
                                        LM_Data.KYC_Redirect_URL = data['Msg']['KYC_Redirect_URL'] ? data['Msg']['KYC_Redirect_URL'] : "NA";
                                        LM_Data.KYC_Status = data['Msg']['KYC_Status'] ? data['Msg']['KYC_Status'] : "NA";
                                        LM_Data.KYC_Request = data['Msg']['KYC_Request'] ? data['Msg']['KYC_Request'] : "NA";
                                        LM_Data.KYC_Response = data['Msg']['KYC_Response'] ? data['Msg']['KYC_Response'] : "NA";
                                        LM_Data.ckyc_remarks = data['Msg']['KYC_Response'] ? data['Msg']['KYC_Response'] : "NA";
                                        kyc_mail_send(LM_Data);
                                        res.json(data['Msg']);
                                    } else {
                                        LM_Data.KYC_Status = 'CREATE_FAIL';
                                        kyc_mail_send(LM_Data);
                                        res.json({"Insurer": insurer_api_name, "Msg": "Create service issue", "Status": "FAIL"});
                                    }
                                });
                            }
                        }
                    });
                } else {
                    let kyc_detail1 = new kyc_detail(saveObj);
                    kyc_detail1.save(saveObj, function (err, data) {
                        if (err) {
                            res.json({"Msg": err, "Status": "FAIL"});
                        } else {
                            if (insurer_api_name === undefined) {
                                res.json({"Msg": "KYC Process is Under Construction.....", "Status": "FAIL"});
                            } else {
                                let args = {
                                    data: data['_doc'],
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }; //pls comment - issue - multiple records
                                let url_api = config.environment.weburl + '/kyc_details/' + insurer_api_name;
                                client.post(url_api, args, function (data, response) {
                                    if (data && data.hasOwnProperty('Msg')) {
                                        LM_Data.KYC_Number = data['Msg']['KYC_Number'] ? data['Msg']['KYC_Number'] : "NA";
                                        LM_Data.KYC_FullName = data['Msg']['KYC_Full_Name'] ? data['Msg']['KYC_Full_Name'] : (data['Msg']['KYC_FullName'] ? data['Msg']['KYC_FullName'] : "NA");
                                        LM_Data.KYC_Ref_No = data['Msg']['KYC_Ref_No'] ? data['Msg']['KYC_Ref_No'] : "NA";
                                        LM_Data.KYC_Redirect_URL = data['Msg']['KYC_Redirect_URL'] ? data['Msg']['KYC_Redirect_URL'] : "NA";
                                        LM_Data.KYC_Status = data['Msg']['KYC_Status'] ? data['Msg']['KYC_Status'] : "NA";
                                        LM_Data.KYC_Request = data['Msg']['KYC_Request'] ? data['Msg']['KYC_Request'] : "NA";
                                        LM_Data.KYC_Response = data['Msg']['KYC_Response'] ? data['Msg']['KYC_Response'] : "NA";
                                        LM_Data.ckyc_remarks = data['Msg']['KYC_Response'] ? data['Msg']['KYC_Response'] : "NA";
                                        kyc_mail_send(LM_Data);
                                        res.json(data['Msg']);
                                    } else {
                                        LM_Data.KYC_Status = 'CREATE_FAIL';
                                        kyc_mail_send(LM_Data);
                                        res.json({"Insurer": insurer_api_name, "Msg": "Create service issue", "Status": "FAIL"});
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    } catch (e1) {
        LM_Data.KYC_Status = 'CREATE_ERROR';
        kyc_mail_send(LM_Data);
        res.json({"Msg": e1.stack, "Status": "FAIL"});
    }
});

router.post('/kyc_details/check_kyc_details', function (req, res) {
    try {
        let ObjRequest = req.body;
        let crn = ObjRequest.crn - 0;
        let insurer_id = ObjRequest.insurer_id - 0;
        let proposal_request = ObjRequest.hasOwnProperty('Proposal_Request') && ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : {};
        let Insurer_Id = req.body.insurer_id;
        let full_name = ObjRequest.Proposal_Request['middle_name'] === "" ? (ObjRequest.Proposal_Request['first_name'] + " " + ObjRequest.Proposal_Request['last_name']) : (ObjRequest.Proposal_Request['first_name'] + " " + ObjRequest.Proposal_Request['middle_name'] + " " + ObjRequest.Proposal_Request['last_name']);
        let updateObj = {
            'Mobile': (proposal_request.mobile === undefined || proposal_request.mobile === "" || proposal_request.mobile === null) ? "" : proposal_request.mobile - 0,
            'DOB': (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date,
            'Modified_On': new Date(),
            'Email': (proposal_request.email === undefined || proposal_request.email === "" || proposal_request.email === null) ? "" : proposal_request.email,
            'Proposal_Request': proposal_request,
            'Proposal_Id': ObjRequest.hasOwnProperty('Proposal_Id') ? ObjRequest.Proposal_Id : "",
            'Quote_Id': ObjRequest.hasOwnProperty('Quote_Id') ? ObjRequest.Quote_Id : "",
            'Full_Name': full_name,
            'proposal_page_url': ObjRequest.hasOwnProperty('proposal_url') ? ObjRequest.proposal_url : "",
            'service_log_id': proposal_request.hasOwnProperty('slid') ? proposal_request.slid : ""
        };
        let query = {
            PB_CRN: crn,
            Insurer_Id: (req.body.insurer_id === undefined || req.body.insurer_id === "" || req.body.insurer_id === null) ? "" : req.body.insurer_id - 0,
            KYC_Status: 'VERIFY_SUCCESS',
            DOB: (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date,
            KYC_Number: {$nin: [null, ""]}
        };
//        if(insurer_id !== 7){
        query['Document_ID'] = (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID;
//        }
        kyc_detail.update({"PB_CRN": crn, "Insurer_Id": insurer_id}, {$set: updateObj}, function (err, db_update_kyc_detail) {
            if (err) {
                res.json({"Msg": err, "Status": "FAIL"});
            } else {
                kyc_history.findOne(query).exec((err, data) => {
                    try {
                        if (err) {
                            res.json({"Msg": err, "Status": "FAIL"});
                        } else {
                            if (data && data.hasOwnProperty('_doc')) {
                                let LM_Data = {
                                    "KYC_Doc_No": (data['_doc'].hasOwnProperty('Document_ID')) ? (data['_doc']['Document_ID']) : "",
                                    "KYC_Number": (data['_doc'].hasOwnProperty('KYC_Number')) ? (data['_doc']['KYC_Number']) : "",
                                    "KYC_FullName": (data['_doc'].hasOwnProperty('KYC_Full_Name') && data['_doc']['KYC_Full_Name']) ? data['_doc']['KYC_Full_Name'] : ((data['_doc'].hasOwnProperty('Full_Name')) ? (data['_doc']['Full_Name']) : ""),
                                    "KYC_Ref_No": (data['_doc'].hasOwnProperty('KYC_Ref_No')) ? (data['_doc']['KYC_Ref_No']) : "",
                                    "KYC_Redirect_URL": (data['_doc'].hasOwnProperty('KYC_URL')) ? (data['_doc']['KYC_URL']) : "",
                                    "KYC_Insurer_ID": (data['_doc'].hasOwnProperty('Insurer_Id')) ? (data['_doc']['Insurer_Id']) : "",
                                    "KYC_PB_CRN": (data['_doc'].hasOwnProperty('PB_CRN')) ? (data['_doc']['PB_CRN']) : "",
                                    "KYC_Status": (data['_doc'].hasOwnProperty('KYC_Status')) ? (data['_doc']['KYC_Status']) : ""
                                };
                                res.send(LM_Data);
                            } else {
                                let query2 = {
                                    PB_CRN: crn,
                                    Insurer_Id: (req.body.insurer_id === undefined || req.body.insurer_id === "" || req.body.insurer_id === null) ? "" : req.body.insurer_id - 0
                                };
                                if ([6, 5].indexOf(insurer_id) > -1) {
                                    query2.$or = [
                                        {
                                            Document_ID: (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                                            DOB: (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date
                                        },
                                        {
                                            KYC_Status: 'CREATE_SUCCESS'
                                        },
                                        {
                                            KYC_Status: 'VERIFY_SUCCESS'
                                        }
                                    ];
                                } else {
                                    query2.$or = [
                                        {
                                            Document_ID: (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                                            DOB: (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date
                                        },
                                        {
                                            KYC_Status: 'CREATE_SUCCESS'
                                        }
                                    ];
                                }
                                kyc_history.findOne(query2).sort({Created_On: -1}).exec((err, data) => {
                                    try {
                                        if (err) {
                                            res.json({"Msg": err, "Status": "FAIL"});
                                        } else {
                                            if (data && data.hasOwnProperty('_doc')) {
                                                if (data['_doc'].hasOwnProperty('KYC_Status') && data['_doc']['KYC_Status']) {
                                                    if (['FETCH_FAIL', 'VERIFY_FAIL'].indexOf(data['_doc']['KYC_Status']) > -1) {
                                                        try {
                                                            let lm_save_args = {
                                                                "insurer_id": insurer_id - 0,
                                                                "crn": data['_doc'].PB_CRN - 0,
                                                                "user_kyc_no": "",
                                                                "udid": data['_doc'].User_Data_Id - 0,
                                                                "product_id": data['_doc'].Product_Id - 0,
                                                                "Proposal_Request": ObjRequest.Proposal_Request,
//                                                              "Quote_Id": kyc_dbUserData._doc['Processed_Request']['___insurer_customer_identifier___'],
                                                                "Quote_Id": data['_doc'].Quote_Id ? data['_doc'].Quote_Id : "",
                                                                "Proposal_Id": data['_doc'].Proposal_Id, //kyc_proposal_data._doc.Insurer_Transaction_Identifier,
                                                                "search_type": data['_doc'].Document_Type,
                                                                "Document_Type": data['_doc'].Document_Type, //"PAN",
                                                                "Document_ID": data['_doc'].Document_ID,
                                                                "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                                                                "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
                                                            };
                                                            if (data['_doc'].hasOwnProperty('Mobile') && data['_doc']['Mobile']) {
                                                                lm_save_args['mobile'] = data['_doc']['Mobile'];
                                                            }
                                                            if (ObjRequest.hasOwnProperty('proposal_url') && ObjRequest['proposal_url']) {
                                                                lm_save_args['proposal_url'] = ObjRequest['proposal_url'];
                                                            }
                                                            let Client = require('node-rest-client').Client;
                                                            let client = new Client();
                                                            let args = {
                                                                data: lm_save_args,
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                }
                                                            };
                                                            let url_api = config.environment.weburl + '/postservicecall/kyc_details/save_kyc_details';
                                                            client.post(url_api, args, function (save_kyc_details_data, response) {
                                                                if (save_kyc_details_data) {
                                                                    res.send(save_kyc_details_data);
                                                                }
                                                            });
                                                        } catch (err) {
                                                            res.json({"Msg": err.stack, "Status": "FAIL"});
                                                        }
                                                    } else {
                                                        let LM_Data = {
                                                            "KYC_Doc_No": (data['_doc'].hasOwnProperty('Document_ID')) ? (data['_doc']['Document_ID']) : "",
                                                            "KYC_Number": (data['_doc'].hasOwnProperty('KYC_Number')) ? (data['_doc']['KYC_Number']) : "",
                                                            "KYC_FullName": (data['_doc'].hasOwnProperty('KYC_Full_Name') && data['_doc']['KYC_Full_Name']) ? data['_doc']['KYC_Full_Name'] : ((data['_doc'].hasOwnProperty('Full_Name')) ? (data['_doc']['Full_Name']) : ""),
                                                            "KYC_Ref_No": (data['_doc'].hasOwnProperty('KYC_Ref_No')) ? (data['_doc']['KYC_Ref_No']) : "",
                                                            "KYC_Redirect_URL": (data['_doc'].hasOwnProperty('KYC_URL')) ? (data['_doc']['KYC_URL']) : "",
                                                            "KYC_Insurer_ID": (data['_doc'].hasOwnProperty('Insurer_Id')) ? (data['_doc']['Insurer_Id']) : "",
                                                            "KYC_PB_CRN": (data['_doc'].hasOwnProperty('PB_CRN')) ? (data['_doc']['PB_CRN']) : "",
                                                            "KYC_Status": (data['_doc'].hasOwnProperty('KYC_Status')) ? (data['_doc']['KYC_Status']) : ""
                                                        };
                                                        res.send(LM_Data);
                                                    }
                                                }
                                            } else {
                                                res.json({"Insurer": Insurer_Id, "Msg": "No Data Found", "Status": "FAIL"});
                                            }
                                        }
                                    } catch (err) {
                                        res.json({"Msg": err.stack, "Status": "FAIL"});
                                    }
                                });
                            }
                        }
                    } catch (err) {
                        res.json({"Msg": err.stack, "Status": "FAIL"});
                    }
                });
            }
        });
    } catch (err) {
        res.json({"Msg": err.stack, "Status": "FAIL"});
    }
});
function kyc_mail_send(kyc_details) {
    try {
        let kyc_data = kyc_details;
        let kyc_status = kyc_details.KYC_Status;
        let index = -1;
        let arr_ins = {
            1: "BajajAllianz",
            2: "BhartiAxa",
            3: "Cholamandalam MS",
            4: "Future Generali",
            5: "HDFCERGO",
            6: "ICICILombard",
            7: "IFFCOTokio",
            8: "National Insurance",
            9: "Reliance",
            10: "RoyalSundaram",
            11: "TataAIG",
            12: "New India",
            13: "Oriental",
            14: "UnitedIndia",
            15: "L&amp;T General",
            16: "Raheja QBE",
            17: "SBI General",
            18: "Shriram General",
            19: "UniversalSompo",
            20: "Max Bupa",
            21: "Apollo Munich",
            22: "DLF Pramerica",
            23: "Bajaj Allianz",
            24: "IndiaFirst",
            25: "AEGON Religare",
            26: "Star Health",
            27: "Express BPO",
            28: "HDFC Life",
            29: "Bharti Axa",
            30: "Kotak Mahindra",
            31: "LIC India",
            32: "Birla Sun Life",
            33: "LibertyGeneral",
            34: "Religare",
            35: "Magma HDI",
            36: "Indian Health Organisation",
            37: "TATA AIA",
            38: "Cigna Manipal",
            39: "ICICI Pru",
            42: "Aditya Birla",
            44: "GoDigit",
            45: "Acko",
            46: "Edelweiss",
            47: "DHFL",
            48: "Kotak Mahindra OEM"
        };
        let KYC_SMS_Obj = [
            {"KYC_Status": "FETCH_SUCCESS", "FETCH_SUCCESS": "KYC-SEARCH", "Status": "KYC-INFO"},
            {"KYC_Status": "FETCH_FAIL", "FETCH_FAIL": "KYC-SEARCH", "Status": "FAIL"},
            {"KYC_Status": "FETCH_ERROR", "FETCH_ERROR": "KYC-SEARCH", "Status": "ERROR"},
            {"KYC_Status": "VERIFY_SUCCESS", "VERIFY_SUCCESS": "KYC-VERIFICATION", "Status": "KYC-INFO"},
            {"KYC_Status": "VERIFY_FAIL", "VERIFY_FAIL": "KYC-VERIFICATION", "Status": "FAIL"},
            {"KYC_Status": "VERIFY_ERROR", "VERIFY_ERROR": "KYC-VERIFICATION", "Status": "ERROR"},
            {"KYC_Status": "CREATE_SUCCESS", "CREATE_SUCCESS": "KYC-CREATE", "Status": "KYC-INFO"},
            {"KYC_Status": "CREATE_FAIL", "CREATE_FAIL": "KYC-CREATE", "Status": "FAIL"},
            {"KYC_Status": "CREATE_ERROR", "CREATE_ERROR": "KYC-CREATE", "Status": "ERROR"},
            {"KYC_Status": "UPDATE_SUCCESS", "UPDATE_SUCCESS": "KYC-UPDATE", "Status": "KYC-INFO"},
            {"KYC_Status": "UPDATE_FAIL", "UPDATE_FAIL": "KYC-UPDATE", "Status": "FAIL"},
            {"KYC_Status": "UPDATE_ERROR", "UPDATE_ERROR": "KYC-UPDATE", "Status": "ERROR"}
        ];
        index = KYC_SMS_Obj.findIndex(x => x.KYC_Status === kyc_status);
        if (index > -1) {
            let Email = require('../models/email');
            let objModelEmail = new Email();
            let sub = '[' + KYC_SMS_Obj[index][kyc_status] + '] ' + arr_ins[kyc_data.KYC_Insurer_ID].toUpperCase() + '-' + KYC_SMS_Obj[index]['Status'] + " CRN : " + kyc_data.KYC_PB_CRN + " " + kyc_data.KYC_Search_Type + " : " + kyc_data.KYC_Doc_No;
            let kyc_number = "NA";
            if (["FETCH_SUCCESS", "VERIFY_SUCCESS", "CREATE_SUCCESS", "UPDATE_SUCCESS"].indexOf(KYC_SMS_Obj[index]["KYC_Status"]) > -1) {
                kyc_number = kyc_data.KYC_Number ? kyc_data.KYC_Number : "NA";
            }
            let mail_content = '<html><body>' +
                    'KYC Details' +
                    '<p></p>CRN  - ' + kyc_data.KYC_PB_CRN +
                    '<p></p>Insurer  - ' + arr_ins[kyc_data.KYC_Insurer_ID].toUpperCase() +
                    '<p></p>Document Type  - ' + kyc_data.KYC_Search_Type +
                    '<p></p>Document Id  - ' + kyc_data.KYC_Doc_No +
                    '<p></p>KYC Number  - ' + kyc_number +
                    '<p></p>Request  - ' + JSON.stringify(kyc_data.KYC_Request) +
                    '<p></p>Response  - ' + JSON.stringify(kyc_data.KYC_Response) +
                    '</body></html>';
            //let arrTo = ['roshani.prajapati@policyboss.com'];
            //let arrCc = ['anuj.singh@policyboss.com'];
            let arrTo = [config.environment.notification_email];
            objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, mail_content, '', '');
        }
    } catch (e) {
        console.error("Error in KYC mail send", e.stack);
    }
}
router.post('/kyc_details/kyc_mail_send', function (req, res) {
    try {
        if (req.body.hasOwnProperty('KYC_Status') && req.body.KYC_Status) {
            if (req.body.KYC_Status === "KYC_UPDATE_SUCCESS") {
                req.body.KYC_Status = "UPDATE_SUCCESS";
            }
            if (req.body.KYC_Status === "KYC_UPDATE_FAIL") {
                req.body.KYC_Status = "UPDATE_FAIL";
            }
        }
        kyc_mail_send(req.body);
        res.send('kyc_mail_send invoked');
    } catch (err) {
        console.log('/kyc_mail_send ', err.stack);
        res.send(err.stack);
    }
});

router.post('/employee_list_paginate', LoadSession, function (req, res) {
    try {
        var users = require('../models/user');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var selected_column = 'UID Employee_Name Company Branch Designation Dept_Short_Name Dept_Segment Direct_Reporting_UID Phone Email Official_Email Ss_Id New_Vertical New_SubVertical Vertical Sub_Vertical Reporting_One Reporting_Two Is_App_Installed Is_Contact_Sync';
        var optionPaginate = {
            select: selected_column,
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);

        }
        var filter = obj_pagination.filter;
        var arr_ssid = [];
        //var selected_column = 'UID EMP_ID Employee_Name Company Branch Designation Dept_Short_Name Dept_Segment Direct_Reporting_UID DOJ Phone Email Official_Email Ss_Id';
        filter['UID'] = {$nin: [100001, 100192]};
        if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {

        } else if (req.obj_session.hasOwnProperty('users_assigned') && req.obj_session.users_assigned.hasOwnProperty('Team')) {
            filter['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.CSE};
        } else {
            filter['Ss_Id'] = {$in: req.obj_session.user.ss_id};
        }

        users.paginate(filter, optionPaginate).then(function (dbusers) {
            try {
                return res.json(dbusers);
                /*if (dbusers.docs.length > 0) {
                 let arr_uid = [];
                 for (let emp of dbusers.docs) {
                 arr_uid.push(emp['Direct_Reporting_UID']);
                 }
                 users.find({'UID': {$in: arr_uid}}).exec(function (err, dbUsers_Filtered) {
                 try {
                 let obj_emp = {};
                 for (let k in dbUsers_Filtered) {
                 let emp = dbUsers_Filtered[k]._doc;
                 obj_emp[emp['UID']] = emp['Employee_Name'];
                 }
                 for (let i in dbusers.docs) {
                 let UID = dbusers.docs[i]['Direct_Reporting_UID'];
                 dbusers.docs[i]["Reporting_Name"] = obj_emp[UID];
                 }
                 res.json(dbusers);
                 } catch (ex) {
                 console.log("error:", ex);
                 res.json({'Status': 'Error', 'Msg': ex.stack, 'Data': dbusers});
                 }
                 });
                 } else {
                 res.json(dbusers);
                 }*/

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

router.get('/employee_list', LoadSession, function (req, res) {
    try {
        var users = require('../models/user');
        var filter = {};
        var arr_ssid = [];
        var selected_column = 'UID Employee_Name Company Branch Designation Dept_Short_Name Dept_Segment Direct_Reporting_UID Email Official_Email Ss_Id New_Vertical New_SubVertical Vertical Sub_Vertical Reporting_One Reporting_Two Is_App_Installed Is_Contact_Sync VH_HOD_Name DOJ RH_Name';
        filter['UID'] = {$nin: [100001, 100192]};
        var today = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-D');
        var arrFrom = today.split('-');
        var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
        var arrTo = today.split('-');
        var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
        dateTo.setDate(dateTo.getDate() + 1);
        let cond_login = {
            "login_time": {"$gte": dateFrom, "$lte": dateTo}
        };
        if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {

        } else if (req.obj_session.hasOwnProperty('users_assigned') && req.obj_session.users_assigned.hasOwnProperty('Team')) {
            filter['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.CSE};
            cond_login ['ss_id'] = filter['Ss_Id'];
        } else {
            filter['Ss_Id'] = {$in: req.obj_session.user.ss_id};
            cond_login ['ss_id'] = filter['Ss_Id'];
        }

        users.find(filter).select(selected_column).exec(function (err, dbusers) {
            try {
                var Login = require('../models/logins');
                Login.distinct('ss_id', cond_login).exec(function (err, Arr_Logins) {
                    for (let k in dbusers) {
                        dbusers[k]._doc['DOJ'] = moment(dbusers[k]._doc['DOJ']).format("YYYY-MM");
                        dbusers[k]._doc['Is_Login_Today'] = (Arr_Logins.indexOf(dbusers[k]._doc['Ss_Id']) > -1) ? 'YES' : 'NO';
                    }
                    return res.json(dbusers);
                });

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

router.post('/tax_lead/save_tax_lead', function (req, res) {
    try {
        let Tax_Lead = require('../models/tax_lead');
        let Email = require('../models/email');
        let objModelEmail = new Email();
        let tax_lead_data = new Tax_Lead();
        for (let key in req.body) {
            tax_lead_data[key] = req.body[key];
        }
        tax_lead_data.Status = "Active";
        tax_lead_data.Created_On = new Date();
        tax_lead_data.Modified_On = new Date();
        tax_lead_data.save(function (tax_lead_err, tax_lead_response) {
            if (tax_lead_err) {
                res.json({'Msg': tax_lead_err, 'Status': "Error"});
            } else {
                res.json({'Msg': "Data Inserted Successfully", 'Status': "Success"});
                let subject = 'Tax Lead - ' + tax_lead_response._doc["name"] + ' - TaxLeadId : ' + tax_lead_response.Tax_Lead_Id;

                let mail_content = '<html><body>' +
                        'Dear Team,' +
                        '<p>We have received tax lead as following</p>' +
                        '<p></p>Name - ' + tax_lead_response._doc["name"] +
                        '<p></p>Contact Number  - ' + tax_lead_response._doc["mobile"] +
                        '<p></p>Email Id  - ' + tax_lead_response._doc["email"] +
                        '<p></p><p></p>Regards,' +
                        '<p></p>PolicyBoss' +
                        '</body></html>';

                objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, subject, mail_content, '', '', '');
                //objModelEmail.send('noreply@policyboss.com', "nilam.bhagde@policyboss.com", subject, mail_content, '', '', '');

            }
        });

    } catch (e) {
        res.json({"Status": "Error", "Msg": e.stack});
    }
});

router.post('/sync_contacts/get_sync_contact_tags', LoadSession, function (req, res) {
    try {

        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            lean: true,
            page: 1,
            limit: 10
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);

        }
        var filter = obj_pagination.filter;
        var sync_contact_tag = require('../models/sync_contact_tag');
        sync_contact_tag.paginate(filter, optionPaginate).then(function (dbsynctag) {
            res.json(dbsynctag);
        });
    } catch (e) {
        console.log(e);
        res.json({'Msg': e, 'Status': 'fail'});
    }
});

router.post('/sync_contacts/save_sync_contact_tags', LoadSession, function (req, res) {
    try {
        var sync_contact_tag = require('../models/sync_contact_tag');
        let name = req.body.name ? req.body.name : "";
        let type = req.body.type ? req.body.type : "";
        ;
        let ssid = req.body.ssid ? req.body.ssid : "";
        ;
        let args = {
            "Name": name,
            "Type_Of_Tag": type,
            "Created_By": ssid
        };
        args['Created_On'] = new Date();
        args['Modified_On'] = new Date();
        let sync_contact_doc = new sync_contact_tag(args);
        sync_contact_doc.save(function (err, dbsynccontact) {
            if (err) {
                res.json({"Status": "Fail", "Msg": err});
            } else {
                res.json({"Status": "Success", "Msg": dbsynccontact});
            }
        });
    } catch (e) {
        console.log(e);
        res.json({'Msg': e, 'Status': 'fail'});
    }
});

router.post('/sync_contacts/update_sync_contact_tags', LoadSession, function (req, res) {
    try {
        let sync_tag = require('../models/sync_contact_tag');
        let id = req.body.id ? req.body.id - 0 : "";
        let keywords = req.body.keywords ? req.body.keywords : [];
        //var ssid = req.body.ssid ? req.body.ssid -0 : "";
        let objTag = {
            "Keywords": keywords
        };
        objTag['Modified_On'] = new Date();
        sync_tag.update({"Sync_Contact_Tag_Id": id}, {$set: objTag}, function (err, numAffected) {
            if (err) {
                res.json({"Status": "Fail", "Msg": err});
            } else {
                res.json({"Status": "Success", "Msg": "updated successfully"});
            }
        });
    } catch (e) {
        console.log(e);
        res.json({'Msg': e, 'Status': 'fail'});
    }
});
router.post('/sync_contacts/sync_contact_telesupport', function (req, res, next) {
    try {
        let Lead = require('../models/leads');
        let Email = require('../models/email');
        let objModelEmail = new Email();
        let Client = require('node-rest-client').Client;
        let client = new Client();
        let objRequest = req.body;
        let ss_id = objRequest.ss_id ? objRequest.ss_id - 0 : "";
        let selected_lead_arr = objRequest['selected_lead'];
        let lead_assign_ss_id = [16114, 7685, 114118, 64496, 8067];
        let temp_random = Math.floor(Math.random() * lead_assign_ss_id.length);
        let random_lead_assign_ss_id = lead_assign_ss_id[temp_random];
        let query = {ss_id: ss_id, lead_assigned_ssid: {$nin: [null]}};
        let sync_agent_details = {};
        client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id, {}, function (sync_agent_data, sync_agent_response) {
            sync_agent_details = sync_agent_data;
            if (sync_agent_details && sync_agent_details['status'] === 'SUCCESS') {
                Lead.find(query).sort({Created_On: -1}).exec(function (lead_err, db_lead_data) {
                    if (lead_err) {
                        res.json({'Status': 'Fail', 'Msg': lead_err});
                    } else {
                        let lead_update_query;
                        let assigned_agent_id = "";
                        if (db_lead_data && db_lead_data.length > 0) {
                            let db_lead_ss_id = db_lead_data[0]['_doc']['lead_assigned_ssid'];
                            lead_update_query = {'$set': {lead_assigned_ssid: db_lead_ss_id}};
                            assigned_agent_id = db_lead_ss_id - 0;
                        } else {
                            lead_update_query = {'$set': {lead_assigned_ssid: random_lead_assign_ss_id - 0}};
                            assigned_agent_id = random_lead_assign_ss_id - 0;
                        }
                        Lead.updateMany({Lead_Id: {'$in': selected_lead_arr}}, lead_update_query, function (update_lead_err, db_update_lead_data) {
                            if (update_lead_err) {
                                res.json({'Status': 'Fail', 'Msg': update_lead_err});
                            } else {
                                Lead.find({Lead_Id: {$in: selected_lead_arr}}, {_id: 0, Lead_Id: 1, Customer_Name: 1, ERP_QT: 1}).exec(function (lead_by_lead_id_err, db_lead_by_lead_id) {
                                    if (lead_by_lead_id_err) {
                                        res.json({'Status': 'Fail', 'Msg': lead_by_lead_id_err});
                                    } else {
                                        let get_lead_by_lead_id = db_lead_by_lead_id;
                                        client.get(config.environment.weburl + '/posps/dsas/view/' + assigned_agent_id, {}, function (assigned_agent_id_data, assigned_agent_id_response) {
                                            if (assigned_agent_id_data && assigned_agent_id_data['status'] === 'SUCCESS') {
                                                let mail_content = "";
                                                let tableHeading = ['Lead ID', 'Lead Name', 'QT Number'];
//                                              let tableRow = ['Lead_Id', 'Customer_Name', 'ERP_QT']; 
                                                mail_content += '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                mail_content += '<p style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Dear ' + assigned_agent_id_data['EMP']['Emp_Name'] + ',<br><br>';
                                                mail_content += 'Please find below list assigned to you by ' + sync_agent_details['EMP']['Emp_Name'] + '.<br><br>';
                                                //mail_content += '<table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="50%">';
                                                /*mail_content += '<tr>';
                                                 for (var th in tableHeading) {
                                                 mail_content += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01;text-align:center;"  align="center">' + tableHeading[th] + '</th>';
                                                 }
                                                 mail_content += '</tr>';*/
                                                /*for (let x = 0; x < get_lead_by_lead_id.length; x++) {
                                                 mail_content = mail_content + '<tr><td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;;text-align:center;" align="center">' + get_lead_by_lead_id[x]['_doc']["Lead_Id"] + '</td>'
                                                 + '<td style=style="font-size:12px;font-family:\'Google Sans\' ,tahoma;;text-align:center;" align="center">' + get_lead_by_lead_id[x]['_doc']["Customer_Name"] + '</td>'
                                                 + '<td style=style="font-size:12px;font-family:\'Google Sans\' ,tahoma;;text-align:center;" align="center">' + (get_lead_by_lead_id[x]['_doc'] && get_lead_by_lead_id[x]['_doc'].ERP_QT ? get_lead_by_lead_id[x]['_doc']["ERP_QT"] : "NA") + '</td></tr>';
                                                 }
                                                 mail_content += '</table></body></html>';*/
                                                var excel = require('excel4node');
                                                var date = moment().format('DDMMYYYY') + "_" + moment().format('HHmmss') + "_" + assigned_agent_id_data['EMP']['Emp_Id'];
                                                var ff_file_name = "sync_contact_telesupport_" + date + ".xlsx";
                                                var ff_loc_path_portal = appRoot + "/tmp/sync_contact_telesupport/" + ff_file_name;
                                                var ff_web_path_portal = config.environment.downloadurl + "/tmp/sync_contact_telesupport/" + ff_file_name;
                                                var workbook = new excel.Workbook();
                                                var worksheet = workbook.addWorksheet('Sheet 1');
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
                                                if (parseInt(get_lead_by_lead_id.length) > 0) {
                                                    //row 1
                                                    worksheet.cell(1, 1).string('Lead ID').style(styleh);
                                                    worksheet.cell(1, 2).string('Lead Name').style(styleh);
                                                    worksheet.cell(1, 3).string('QT Number').style(styleh);
                                                    //row 2
                                                    for (var rowcount in get_lead_by_lead_id) {
                                                        try {
                                                            let leadArray = [];
                                                            rowcount = parseInt(rowcount);
                                                            leadArray = get_lead_by_lead_id[rowcount]._doc;
                                                            worksheet.cell(rowcount + 2, 1).string(leadArray["Lead_Id"] ? (leadArray["Lead_Id"]).toString() : "");
                                                            worksheet.cell(rowcount + 2, 2).string(leadArray["Customer_Name"] ? (leadArray["Customer_Name"]).toString() : "");
                                                            worksheet.cell(rowcount + 2, 3).string(leadArray["ERP_QT"] ? (leadArray["ERP_QT"]).toString() : "NA");
                                                        } catch (e) {
                                                            console.log("create_telesupport_sync_data_feedfile", e.message);
                                                            res.json({'msg': 'error-' + e.message});
                                                        }
                                                    }
                                                    workbook.write(ff_loc_path_portal);
                                                    mail_content = mail_content + 'Download Link :&nbsp;' + '<a href="' + ff_web_path_portal + '">' + ff_web_path_portal + '</a>';
                                                } else {
                                                    mail_content = mail_content + 'No Data Available.<br><br>';
                                                    //mail_content = mail_content + 'Download Link :&nbsp;'+ '<a href="'+ff_web_path_portal+'">'+ff_web_path_portal+'</a>'; 
                                                }
                                                let to = ['roshani.prajapati@policyboss.com']; // assigned_agent_id_data['EMP']['Email_Id'];
                                                let subject = "Sync Contact lead assigned by SSID: " + sync_agent_details['EMP']['Emp_Id'];
                                                objModelEmail.send('notifications@policyboss.com', to.join(','), subject, mail_content, '', '');

                                                let sync_agent_mail_content = "";
                                                let sync_agent_to = ['roshani.prajapati@policyboss.com']; // sync_agent_details['EMP']['Email_Id'];
                                                let sync_agent_subject = "[Caller Lead Assigned] - SS_ID - " + assigned_agent_id_data['EMP']['Emp_Id'];
                                                sync_agent_mail_content = "Dear " + sync_agent_details['EMP']['Emp_Name'] + ',\n\n';
                                                sync_agent_mail_content += "Lead assigned successfully to caller " + assigned_agent_id_data['EMP']['Emp_Name'];
                                                objModelEmail.send('notifications@policyboss.com', sync_agent_to.join(','), sync_agent_subject, sync_agent_mail_content, '', '');
                                                res.json({'Status': 'Success', 'Msg': 'Data Updated Successfully', 'Data': {assigned_ss_id: assigned_agent_id}});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                res.json({'Status': 'Fail', 'Msg': 'No details available by ss_id - ' + ss_id});
            }
        });
    } catch (err) {
        res.json({'Status': 'Fail', 'Msg': err.stack});
    }
});

router.post('/onboarding/schedule_posp_training', function (req, res) {
    try {
//            let form = new formidable.IncomingForm();
//            form.parse(req, function (err, fields, files) {
        let posp_user = require('../models/posp_users.js');
        let posp_document = require('../models/posp_document.js');
        let Email = require('../models/email');
        let client = new Client();
        let Posp_Email = "", Posp_Addr = "", posp_doc = {};
        let Ss_Id = req.body.Ss_Id ? parseInt(req.body.Ss_Id) : "";
        let Mail_Send_Flag = req.body.Send_Mail ? req.body.Send_Mail : "Yes";
        let rm_email = "", cc_arr = [];
        let Profile = "";
        if (Ss_Id) {
            posp_user.find({"Ss_Id": Ss_Id}, function (err, dbresult) {
                if (err) {
                    res.json({"Status": "Fail", "Msg": err});
                } else {
                    posp_document.find({"User_Id": Ss_Id}, function (err, dbresult2) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            if (dbresult2.length > 0) {
                                let data = dbresult2[0]._doc;
                                posp_doc = {
                                    "BankDetails": data.BankDetails,
                                    "NomineeDetails": data.NomineeDetails
                                };
                            } else {
                                posp_doc = {
                                    "BankDetails": {},
                                    "NomineeDetails": {}
                                };
                            }
                            req.body.hasOwnProperty("Profile_Photo") ? Profile = req.body['Profile_Photo'] : "";
                            let args = {
                                "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                            };
                            client.get(config.environment.weburl + '/posps/dsas/view/' + Ss_Id, {}, function (posp_res, posp_res_data) {

//                                 client.get('http://www.policyboss.com:5000/posps/dsas/view/' + Ss_Id, {}, function (posp_res, posp_res_data) {
                                if (posp_res && posp_res.hasOwnProperty('status') && posp_res.status === "SUCCESS") {
                                    if (posp_res.hasOwnProperty('user_type') && ["POSP"].includes(posp_res.user_type)) {
                                        if (posp_res.hasOwnProperty('POSP') && posp_res.POSP !== "NA") {
                                            posp_res.POSP.hasOwnProperty("TrainingStartDate") && posp_res.POSP.TrainingStartDate ? args["Training_Start_Date"] = posp_res.POSP.TrainingStartDate : args["Training_Start_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                            posp_res.POSP.hasOwnProperty("Posp_Id") ? args["Posp_Id"] = posp_res.POSP.Posp_Id : "";
                                            posp_res.POSP.hasOwnProperty("Mobile_No") ? (args["Mobile_Number"] = posp_res.POSP.Mobile_No, posp_doc["Mobile_Number"] = posp_res.POSP.Mobile_No) : "";
                                            posp_res.POSP.hasOwnProperty("Ss_Id") ? (args["User_Id"] = posp_res.POSP.Ss_Id, args["Ss_Id"] = posp_res.POSP.Ss_Id, posp_doc["User_Id"] = posp_res.POSP.Ss_Id) : "";
                                            posp_res.POSP.hasOwnProperty("Fba_Id") ? args["Fba_Id"] = posp_res.POSP.Fba_Id : "";
                                            posp_res.POSP.hasOwnProperty("Sm_Posp_Id") ? args["Sm_Posp_Id"] = posp_res.POSP.Sm_Posp_Id : "";
                                            posp_res.POSP.hasOwnProperty("Sm_Posp_Name") ? args["Sm_Posp_Name"] = posp_res.POSP.Sm_Posp_Name : "";
                                            posp_res.POSP.hasOwnProperty("First_Name") ? args["First_Name"] = posp_res.POSP.First_Name : "";
                                            posp_res.POSP.hasOwnProperty("Middle_Name") ? args["Middle_Name"] = posp_res.POSP.Middle_Name : "";
                                            posp_res.POSP.hasOwnProperty("Last_Name") ? args["Last_Name"] = posp_res.POSP.Last_Name : "";
                                            posp_res.POSP.hasOwnProperty("Father_Name") ? args["Father_Name"] = posp_res.POSP.Father_Name : "";
                                            posp_res.POSP.hasOwnProperty("Email_Id") ? (args["Email_Id"] = posp_res.POSP.Email_Id, posp_doc["Email"] = posp_res.POSP.Email_Id, Posp_Email = posp_res.POSP.Email_Id) : "";
                                            posp_res.POSP.hasOwnProperty("Agent_City") ? args["Agent_City"] = posp_res.POSP.Agent_City : "";
                                            posp_res.POSP.hasOwnProperty("Telephone_No") ? args["Telephone_No"] = posp_res.POSP.Telephone_No : "";
                                            posp_res.POSP.hasOwnProperty("Mobile_No") ? args["Mobile_No"] = posp_res.POSP.Mobile_No : "";
                                            posp_res.POSP.hasOwnProperty("Education") ? args["Education"] = posp_res.POSP.Education : "";
                                            posp_res.POSP.hasOwnProperty("Birthdate") ? (args["Birthdate"] = posp_res.POSP.Birthdate, posp_doc["DOB_On_PanCard"] = posp_res.POSP.Birthdate) : "";
                                            posp_res.POSP.hasOwnProperty("Permanant_Add1") && posp_res.POSP.Permanant_Add1 ? args["Permanant_Add1"] = posp_res.POSP.Permanant_Add1.trim() : "";
                                            posp_res.POSP.hasOwnProperty("Permanant_Add3") && posp_res.POSP.Permanant_Add3 ? args["Permanant_Add3"] = posp_res.POSP.Permanant_Add3.trim() : "";
                                            posp_res.POSP.hasOwnProperty("Permanant_Add2") && posp_res.POSP.Permanant_Add2 ? args["Permanant_Add2"] = posp_res.POSP.Permanant_Add2.trim() : "";
                                            posp_res.POSP.hasOwnProperty("Permanant_Landmark") ? args["Permanant_Landmark"] = posp_res.POSP.Permanant_Landmark : "";
                                            posp_res.POSP.hasOwnProperty("Permanant_Pincode") ? args["Permanant_Pincode"] = posp_res.POSP.Permanant_Pincode : "";
                                            posp_res.POSP.hasOwnProperty("Permanant_City") && posp_res.POSP.Permanant_City ? args["Permanant_City"] = posp_res.POSP.Permanant_City.trim() : "";
                                            posp_res.POSP.hasOwnProperty("Permanant_State") && posp_res.POSP.Permanant_State ? args["Permanant_State"] = posp_res.POSP.Permanant_State.trim() : "";
                                            posp_res.POSP.hasOwnProperty("Present_Add1") && posp_res.POSP.Present_Add1 ? args["Present_Add1"] = posp_res.POSP.Present_Add1.trim() : "";
                                            posp_res.POSP.hasOwnProperty("Present_Add2") && posp_res.POSP.Present_Add2 ? args["Present_Add2"] = posp_res.POSP.Present_Add2.trim() : "";
                                            posp_res.POSP.hasOwnProperty("Present_Add3") && posp_res.POSP.Present_Add3 ? args["Present_Add3"] = posp_res.POSP.Present_Add3.trim() : "";
                                            posp_res.POSP.hasOwnProperty("Present_Landmark") ? args["Present_Landmark"] = posp_res.POSP.Present_Landmark : "";
                                            posp_res.POSP.hasOwnProperty("Present_Pincode") ? args["Present_Pincode"] = posp_res.POSP.Present_Pincode : "";
                                            posp_res.POSP.hasOwnProperty("Present_City") && posp_res.POSP.Present_City ? args["Present_City"] = posp_res.POSP.Present_City.trim() : "";
                                            posp_res.POSP.hasOwnProperty("Present_State") && posp_res.POSP.Present_State ? args["Present_State"] = posp_res.POSP.Present_State.trim() : "";
                                            posp_res.POSP.hasOwnProperty("Pan_No") ? (args["Pan_No"] = posp_res.POSP.Pan_No, posp_doc["PanCard_Number"] = posp_res.POSP.Pan_No) : "";
                                            posp_res.POSP.hasOwnProperty("Aadhar") ? (args["Aadhar"] = posp_res.POSP.Aadhar, posp_doc["AadharCard_Number"] = posp_res.POSP.Aadhar) : "";
                                            posp_res.POSP.hasOwnProperty("Experience") ? args["Experience"] = posp_res.POSP.Experience : "";
                                            posp_res.POSP.hasOwnProperty("Income") ? args["Income"] = posp_res.POSP.Income : "";
                                            posp_res.POSP.hasOwnProperty("Already_Posp") ? args["Already_Posp"] = posp_res.POSP.Already_Posp : "No";
                                            posp_res.POSP.hasOwnProperty("Legal_case") ? args["Legal_case"] = posp_res.POSP.Legal_case : "No";
                                            posp_res.POSP.hasOwnProperty("Bank_Account_No") ? (args["Bank_Account_No"] = posp_res.POSP.Bank_Account_No, posp_doc["BankDetails"]["Bank_Account_No"] = posp_res.POSP.Bank_Account_No) : "";
                                            posp_res.POSP.hasOwnProperty("Account_Type") ? (args["Account_Type"] = posp_res.POSP.Account_Type, posp_doc["BankDetails"]["Account_Type"] = posp_res.POSP.Account_Type) : "";
                                            posp_res.POSP.hasOwnProperty("Ifsc_Code") ? (args["Ifsc_Code"] = posp_res.POSP.Ifsc_Code, posp_doc["BankDetails"]["IFSC_Code"] = posp_res.POSP.Ifsc_Code) : "";
                                            posp_res.POSP.hasOwnProperty("Micr_Code") ? (args["Micr_Code"] = posp_res.POSP.Micr_Code, posp_doc["BankDetails"]["Micr_Code"] = posp_res.POSP.Micr_Code) : "";
                                            posp_res.POSP.hasOwnProperty("Bank_Name") ? (args["Bank_Name"] = posp_res.POSP.Bank_Name, posp_doc["BankDetails"]["Bank_Name"] = posp_res.POSP.Bank_Name) : "";
                                            posp_res.POSP.hasOwnProperty("Bank_Branch") ? (args["Bank_Branch"] = posp_res.POSP.Bank_Branch, posp_doc["BankDetails"]["Bank_Branch"] = posp_res.POSP.Bank_Branch) : "";
                                            posp_res.POSP.hasOwnProperty("Sources") ? args["Sources"] = posp_res.POSP.Sources : "";
                                            posp_res.POSP.hasOwnProperty("Last_Status") ? args["Last_Status"] = posp_res.POSP.Last_Status : "";
                                            posp_res.POSP.hasOwnProperty("Status_Remark") ? args["Status_Remark"] = posp_res.POSP.Status_Remark : "";
                                            posp_res.POSP.hasOwnProperty("Document_Name") ? args["Document_Name"] = posp_res.POSP.Document_Name : "";
                                            posp_res.POSP.hasOwnProperty("Document_Type") ? args["Document_Type"] = posp_res.POSP.Document_Type : "";
                                            posp_res.POSP.hasOwnProperty("Service_Tax_Number") ? args["Service_Tax_Number"] = posp_res.POSP.Service_Tax_Number : "NA";
                                            posp_res.POSP.hasOwnProperty("Nominee_Aadhar") ? (args["Nominee_Aadhar"] = posp_res.POSP.Nominee_Aadhar, posp_doc["NomineeDetails"]["Nominee_Aadhar"] = posp_res.POSP.Nominee_Aadhar) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Account_Type") ? (args["Nominee_Account_Type"] = posp_res.POSP.Nominee_Account_Type, posp_doc["NomineeDetails"]["Nominee_Account_Type"] = posp_res.POSP.Nominee_Account_Type) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Bank_Account_Number") ? (args["Nominee_Bank_Account_Number"] = posp_res.POSP.Nominee_Bank_Account_Number, posp_doc["NomineeDetails"]["Nominee_Bank_Account_No"] = posp_res.POSP.Nominee_Bank_Account_Number) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Bank_Branch") ? (args["Nominee_Bank_Branch"] = posp_res.POSP.Nominee_Bank_Branch, posp_doc["NomineeDetails"]["Nominee_Bank_Branch"] = posp_res.POSP.Nominee_Bank_Branch) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Bank_City") ? (args["Nominee_Bank_City"] = posp_res.POSP.Nominee_Bank_City, posp_doc["NomineeDetails"]["Nominee_Bank_City"] = posp_res.POSP.Nominee_Bank_City) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Bank_Name") ? (args["Nominee_Bank_Name"] = posp_res.POSP.Nominee_Bank_Name, posp_doc["NomineeDetails"]["Nominee_Bank_Name"] = posp_res.POSP.Nominee_Bank_Name) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_First_Name") ? (args["Nominee_First_Name"] = posp_res.POSP.Nominee_First_Name, posp_doc["NomineeDetails"]["Nominee_First_Name"] = posp_res.POSP.Nominee_First_Name) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Middle_Name") ? (args["Nominee_Middle_Name"] = posp_res.POSP.Nominee_Middle_Name, posp_doc["NomineeDetails"]["Nominee_Middle_Name"] = posp_res.POSP.Nominee_Middle_Name) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Ifsc_Code") ? (args["Nominee_Ifsc_Code"] = posp_res.POSP.Nominee_Ifsc_Code, posp_doc["NomineeDetails"]["Nominee_IFSC_Code"] = posp_res.POSP.Nominee_Ifsc_Code) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Last_Name") ? (args["Nominee_Last_Name"] = posp_res.POSP.Nominee_Last_Name, posp_doc["NomineeDetails"]["Nominee_Last_Name"] = posp_res.POSP.Nominee_Last_Name) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Micr_Code") ? (args["Nominee_Micr_Code"] = posp_res.POSP.Nominee_Micr_Code, posp_doc["NomineeDetails"]["Nominee_Micr_Code"] = posp_res.POSP.Nominee_Micr_Code) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Name_as_in_Bank") ? (args["Nominee_Name_as_in_Bank"] = posp_res.POSP.Nominee_Name_as_in_Bank, posp_doc["NomineeDetails"]["Nominee_Name_on_Account"] = posp_res.POSP.Nominee_Name_as_in_Bank) : "";
                                            posp_res.POSP.hasOwnProperty("Is_Active") ? args["Is_Active"] = posp_res.POSP.Is_Active : false;
                                            posp_res.POSP.hasOwnProperty("Ss_Id") ? args["Ss_Id"] = posp_res.POSP.Ss_Id : "";
                                            posp_res.POSP.hasOwnProperty("Erp_Id") ? args["Erp_Id"] = posp_res.POSP.Erp_Id : "";
                                            posp_res.POSP.hasOwnProperty("Gender") ? (args["Gender"] = posp_res.POSP.Gender, posp_doc["Gender"] = posp_res.POSP.Gender) : "";
                                            posp_res.POSP.hasOwnProperty("Name_as_in_Bank") ? (args["Name_as_in_Bank"] = posp_res.POSP.Name_as_in_Bank, posp_doc["BankDetails"]["Name_on_Account"] = posp_res.POSP.Name_as_in_Bank) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Gender") ? (args["Nominee_Gender"] = posp_res.POSP.Nominee_Gender, posp_doc["NomineeDetails"]["Nominee_Gender"] = posp_res.POSP.Nominee_Gender) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Relationship") ? (args["Nominee_Relationship"] = posp_res.POSP.Nominee_Relationship, posp_doc["NomineeDetails"]["Nominee_Relationship"] = posp_res.POSP.Nominee_Relationship) : "";
                                            posp_res.POSP.hasOwnProperty("Nominee_Pan") ? (args["Nominee_Pan"] = posp_res.POSP.Nominee_Pan, posp_doc["NomineeDetails"]["Nominee_Pan_Number"] = posp_res.POSP.Nominee_Pan) : "";
                                            posp_res.POSP.hasOwnProperty("Posp_Category") ? args["Posp_Category"] = posp_res.POSP.Posp_Category : "";
                                            posp_res.POSP.hasOwnProperty("Reporting_Agent_Name") ? args["Reporting_Agent_Name"] = posp_res.POSP.Reporting_Agent_Name : args["Reporting_Agent_Name"] = "";
                                            posp_res.POSP.hasOwnProperty("Reporting_Agent_Uid") ? args["Reporting_Agent_Uid"] = posp_res.POSP.Reporting_Agent_Uid : "";
                                            posp_res.POSP.hasOwnProperty("Training_UserLog") ? args["Training_UserLog"] = posp_res.POSP.Training_UserLog : "";
                                            //  posp_res.POSP.hasOwnProperty("Certification_Datetime") ? args["Certification_Datetime"] = posp_res.POSP.Certification_Datetime : "";
                                            posp_res.POSP.hasOwnProperty("Reporting_Email_ID") && posp_res.POSP.Reporting_Email_ID ? args["Reporting_Email_ID"] = (posp_res.POSP.Reporting_Email_ID) : args["Reporting_Email_ID"] = "";
                                            posp_res.POSP.hasOwnProperty("Reporting_Mobile_Number") ? args["Reporting_Mobile_Number"] = posp_res.POSP.Reporting_Mobile_Number : args["Reporting_Mobile_Number"] = "";
                                            posp_res.POSP.hasOwnProperty("POSP_UploadedtoIIB") ? args["POSP_UploadedtoIIB"] = posp_res.POSP.POSP_UploadedtoIIB : "";

                                            if (posp_res.POSP.POSP_UploadingDateAtIIB && ["NA"].indexOf(posp_res.POSP.POSP_UploadingDateAtIIB) === -1) {
                                                args["POSP_UploadingDateAtIIB"] = posp_res.POSP.POSP_UploadingDateAtIIB;
                                                args["Is_IIB_Uploaded"] = "Yes";
                                            }
                                            posp_res.POSP.hasOwnProperty("POSP_DeActivatedtoIIB") ? args["POSP_DeActivatedtoIIB"] = posp_res.POSP.POSP_DeActivatedtoIIB : "";
                                            posp_res.POSP.hasOwnProperty("POSP_DeActivatedDateAtIIB") ? args["POSP_DeActivatedDateAtIIB"] = posp_res.POSP.POSP_DeActivatedDateAtIIB : "";
                                            posp_res.POSP.hasOwnProperty("FOS_Code") ? args["FOS_Code"] = posp_res.POSP.FOS_Code : "";
                                            posp_res.POSP.hasOwnProperty("ERPID_CreatedDate") ? args["ERPID_CreatedDate"] = posp_res.POSP.ERPID_CreatedDate : "";
                                            posp_res.POSP.hasOwnProperty("IsFOS") ? args["IsFOS"] = posp_res.POSP.IsFOS : "";
                                            posp_res.POSP.hasOwnProperty("RegAmount") ? (args["RegAmount"] = posp_res.POSP.RegAmount, args["Package_Amount"] = posp_res.POSP.RegAmount) : 0;
                                            posp_res.POSP.hasOwnProperty("Channel") ? args["Channel"] = posp_res.POSP.Channel : "";
                                            posp_res.POSP.hasOwnProperty("Recruitment_Status") ? args["Recruitment_Status"] = posp_res.POSP.Recruitment_Status : "";
                                            posp_res.POSP.hasOwnProperty("Is_Contact_Sync") ? args["Is_Contact_Sync"] = posp_res.POSP.Is_Contact_Sync : 0;
                                            posp_res.POSP.hasOwnProperty("Is_Paid") ? args["Is_Paid"] = posp_res.POSP.Is_Paid : 0;
                                            posp_res.POSP.hasOwnProperty("Paid_On") ? args["Paid_On"] = posp_res.POSP.Paid_On : "";
                                            posp_res.POSP.hasOwnProperty("Cust_Id") ? args["Cust_Id"] = posp_res.POSP.Cust_Id : 0;
                                            posp_res.POSP.hasOwnProperty("Posp_Onboarding_Photo") ? Profile = posp_res.POSP.Posp_Onboarding_Photo : "";

                                            rm_email = posp_res.POSP.Reporting_Email_ID ? posp_res.POSP.Reporting_Email_ID : "";
                                            rm_email ? cc_arr.push(rm_email) : "";
                                            let Posp_Name = "";
                                            if (args["First_Name"] && args["Middle_Name"] && args["Last_Name"]) {
                                                Posp_Name = args["First_Name"] + " " + args["Middle_Name"] + " " + args["Last_Name"];
                                            } else if (args["First_Name"] && args["Last_Name"]) {
                                                Posp_Name = args["First_Name"] + " " + args["Last_Name"];
                                            } else if (args["First_Name"]) {
                                                Posp_Name = args["First_Name"];
                                            }
                                            if (args["Permanant_Add1"] || args["Permanant_Add2"] || args["Permanant_Add3"]) {
                                                Posp_Addr = (args["Permanant_Add1"] ? args["Permanant_Add1"] : "") + ", " + (args["Permanant_Add2"] ? args["Permanant_Add2"] : "") + ", " + (args["Permanant_Add3"] ? args["Permanant_Add3"] : "") + ", " + (args["Permanant_City"] ? args["Permanant_City"] : "") + ", " + (args["Permanant_State"] ? args["Permanant_State"] : "") + ", " + (args["Permanant_Pincode"] ? args["Permanant_Pincode"] : "");
                                            } else if (args["Present_Add1"] || args["Present_Add2"] || args["Present_Add3"]) {
                                                Posp_Addr = (args["Present_Add1"] ? args["Present_Add1"] : "") + ", " + (args["Present_Add2"] ? args["Present_Add2"] : "") + ", " + (args["Present_Add3"] ? args["Present_Add3"] : "") + ", " + (args["Present_City"] ? args["Present_City"] : "") + ", " + (args["Present_State"] ? args["Present_State"] : "") + ", " + (args["Present_Pincode"] ? args["Present_Pincode"] : "");
                                            }

                                            Posp_Name ? posp_doc ["Name_On_PanCard"] = Posp_Name.toUpperCase() : "";
                                            Posp_Addr ? posp_doc ["Address"] = Posp_Addr : "";
                                            req.body.hasOwnProperty("Email") ? Posp_Email = req.body.Email : "";
                                            if (Profile) {
                                                posp_doc["UploadedFiles" ] = {
                                                    "UploadedFiles": {
                                                        "Profile_Photo": Profile
                                                    }
                                                };
                                            }
                                            /*try {
                                             client.get(config.environment.weburl + "/posps/mssql/sync_training_date?ss_id=" + Ss_Id , {}, function (sync_training_date_data, sync_training_date_response) {
                                             console.error({"Status": "Success", "Msg": "Postservicecall - sync_training_date called.", "Data": sync_training_date_data});
                                             });
                                             } catch (ee) {
                                             console.error('sync_training_date Error', ee.stack);
                                             }*/
                                            if (dbresult.length > 0) {
                                                let training_start_date = dbresult[0]._doc.Training_Start_Date;
                                                training_start_date ? args["Training_Start_Date"] = training_start_date : "";


                                                try {
                                                    client.get(config.environment.weburl + "/posps/mssql/sync_training_date?ss_id=" + Ss_Id, {}, function (sync_training_date_data, sync_training_date_response) {
                                                        console.error({"Status": "Success", "Msg": "Postservicecall - sync_training_date called.", "Data": sync_training_date_data});
                                                    });
                                                } catch (ee) {
                                                    console.error('sync_training_date Error', ee.stack);
                                                }
                                                res.json({"Status": "Success", "Msg": "POSP details updated successfully", 'Ss_Id': Ss_Id});


                                            } else {
                                                //args["Is_Document_Uploaded"] = "Yes";
                                                //args["Is_Doc_Verified"] = "Yes";
                                                //args["Is_Doc_Approved"] = "Yes";
                                                args["Approved_Mail_Sent"] = "No";
                                                args["Verified_Mail_Sent"] = "No";
                                                args["POSP_UploadingDateAtIIB"] = "";
                                                args["Is_Doc_Approved"] = "No";
                                                args["Is_Invoice_Generated"] = "No";
                                                args["Is_Certificate_Generated"] = "No";
                                                args["Is_Appointment_Letter_Generated"] = "No";
                                                args["Is_Doc_Verified"] = "No";
                                                args["IIB_Uploaded_Ack"] = "No";
                                                args["Is_IIB_Uploaded"] = "No";
                                                args["Is_Document_Rejected"] = "No";
                                                args["Is_Document_Uploaded"] = "No";
                                                args["Is_Training_Completed"] = "No";
                                                args["Payment_Status"] = "Pending";
                                                args["Is_Mail_Sent"] = 2;
                                                args["Training_Status"] = "Started";
                                                args["Remaining_Hours"] = "30:00:00";
                                                args["Completed_Hours"] = "00:00:00";
                                                args["Certification_Datetime"] = null;
                                                args["Training_Status"] = "Started";
                                                args["Remaining_Hours"] = "30:00:00";
                                                args["Completed_Hours"] = "00:00:00";
                                                args["Certification_Datetime"] = null;
                                                //args["Training_Start_Date"] = new Date();
                                                //args["Created_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                if (posp_res.POSP.Created_On && posp_res.POSP.Created_On != 'NA') {
                                                    args["Created_On"] = posp_res.POSP.Created_On;
                                                } else {
                                                    args["Created_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                }
                                                let posp_userobj = new posp_user(args);
                                                posp_userobj.save(function (err, dbresult2) {
                                                    if (err) {
                                                        res.json({"Status": "Fail", "Msg": err});
                                                    } else {
                                                        try {
                                                            client.get(config.environment.weburl + "/posps/mssql/sync_training_date?ss_id=" + Ss_Id, {}, function (sync_training_date_data, sync_training_date_response) {
                                                                console.error({"Status": "Success", "Msg": "Postservicecall - sync_training_date called.", "Data": sync_training_date_data});
                                                            });
                                                        } catch (ee) {
                                                            console.error('sync_training_date Error', ee.stack);
                                                        }
                                                        if (Profile) {
                                                            posp_doc["UploadedFiles"] = {
                                                                "UploadedFiles": {
                                                                    "Profile_Photo": Profile
                                                                }
                                                            };
                                                        } else {
                                                            posp_doc["UploadedFiles"] = {
                                                                "UploadedFiles": {
                                                                    "Profile_Photo": ""
                                                                }
                                                            };
                                                        }
                                                        let posp_documentObj = new posp_document(posp_doc);
                                                        posp_documentObj.save(function (err, data) {
                                                            if (err) {
                                                                res.json({"Status": "Fail", "Msg": err});
                                                            } else {

                                                                if (Posp_Email && Mail_Send_Flag === "Yes") {
                                                                    let objModelEmail = new Email();
                                                                    var email_data = '';
                                                                    let objMail = {
                                                                        '___posp_name___': Posp_Name,
                                                                        '___total_training_time___': "30 Hours - General & Life Insurance",
                                                                        '___training_start_date___': moment(args["Training_Start_Date"], "YYYY-MM-DDTHH:mm:ss[Z]").format("DD-MM-YYYY"),
                                                                        '___relation_manager_name___': args["Reporting_Agent_Name"],
                                                                        '___relation_manager_contact___': args["Reporting_Mobile_Number"],
                                                                        '___reporting_email_id___': args["Reporting_Email_ID"],
                                                                        '___short_url___': "https://www.policyboss.com/posp-training-dashboard"
                                                                    };
                                                                    email_data = fs.readFileSync(appRoot + '/resource/request_file/Posp_Training_Schedule_Mail.html').toString();
                                                                    email_data = email_data.replaceJson(objMail);
                                                                    objModelEmail.send('noreply@policyboss.com', Posp_Email, "[POSP-ONBOARDING] POSP TRAINING SCHEDULE : : SSID-" + Ss_Id, email_data, cc_arr.join(';'), 'horizonlive.2020@gmail.com', '');
                                                                    res.json({"Status": "Success", "Msg": "Training scheduled successfully!!", 'Ss_Id': Ss_Id});
                                                                } else {
                                                                    res.json({"Status": "Success", "Msg": "Training scheduled but mail not sent", 'Ss_Id': Ss_Id});
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            }//end
                                        } else {
                                            res.json({"Status": "Fail", "Msg": "POSP details not found.", 'Ss_Id': Ss_Id});
                                        }
                                    } else {
                                        res.json({"Status": "Fail", "Msg": "User type EMP not allowed.", 'Ss_Id': Ss_Id});
                                    }

                                } else {
                                    res.json({"Status": "Fail", "Msg": "Training not scheduled.", 'Ss_Id': Ss_Id});
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.json({"Status": "Fail", "Msg": "Please provide valid Ss_Id."});
        }
//            });
    } catch (ex) {
        console.error('Exception', 'Scheule POSP Training', ex);
        res.json({"Status": "Fail", "Msg": ex.stack});
    }
});
router.post('/sync_contacts/web_razorpay_payment', function (req, res) {
    try {
        var objres = {};
        var razorpay_payment = require('../models/razorpay_payment');
        let objRequest = {};
        for (var key in req.body)
        {
            objRequest[key] = req.body[key];
        }
        var razorpay_payment_data = new razorpay_payment(objRequest);
        razorpay_payment_data.Created_On = new Date();
        razorpay_payment_data.Modified_On = new Date();
        razorpay_payment_data.Transaction_Status = "Pending";
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.get(config.environment.weburl + "/posps/dsas/view/" + razorpay_payment_data['_doc'].Ss_Id, function (data, response) {
            if (data && data.status === "SUCCESS") {
                razorpay_payment_data['Name'] = data.EMP.Emp_Name;
                razorpay_payment_data['Mobile'] = data.EMP.Mobile_Number;
                razorpay_payment_data['Email'] = data.EMP.Email_Id;
                razorpay_payment.find({}).sort({"Transaction_Id": -1}).limit(1).exec(function (err1, dbRequest) {
                    if (err1) {

                    } else {
                        razorpay_payment_data.save(function (err) {
                            if (err) {
                                objres = {
                                    "MSG": err,
                                    "Status": "Fail",
                                    "Transaction_Id": "0"
                                };
                                res.json(objres);
                            } else {
                                if (dbRequest.length === 0) {
                                    objres = {
                                        "MSG": "Congratulation !! Transaction data updated successfully. Kindly note your Transaction Id : 1",
                                        "Status": "Success",
                                        "Transaction_Id": 1
                                    };
                                    res.json(objres);
                                } else {
                                    objres = {
                                        "MSG": "Congratulation !! Transaction data updated successfully. Kindly note your Transaction Id : " + (dbRequest[0]['_doc'].Transaction_Id - 0 + 1),
                                        "Status": "Success",
                                        "Transaction_Id": dbRequest[0]['_doc'].Transaction_Id - 0 + 1
                                    };
                                    res.json(objres);
                                }
                            }
                        });
                    }
                });
            } else {
                objres = {
                    "MSG": "POSP data not found.",
                    "Status": "Fail",
                    "Transaction_Id": "0"
                };
                res.json(objres);
            }
        });
    } catch (e) {
        objres = {
            "MSG": e.stack,
            "Status": "Fail",
            "Transaction_Id": "0"
        };
        res.json(objres);
    }
});

router.get('/dsas_without_pagination', LoadSession, function (req, res) {
    try {
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            try {
                if (err)
                    throw err;
                var employees = db.collection('employees');
                var objRequestCore = {};
                if (req.query && req.query !== {}) {
                    for (let k in req.query) {
                        objRequestCore[k] = req.query[k];
                    }
                }
                let ssid = objRequestCore.ss_id;
                var filter = {};
                filter = {'IsActive': 1};
                let obj_dsa_role = {
                    'SM': 29,
                    'GS': 34,
                    'DC': 39,
                    'EM': 41
                };
                let objSource = {
                    29: "SM",
                    34: "GS",
                    38: "SG",
                    39: "DC",
                    41: "EM",
                    43: "LA",
                    51: "RURBAN"
                };
                if (objRequestCore && objRequestCore.hasOwnProperty('search') && objRequestCore.hasOwnProperty('value') && objRequestCore['search']['value'] !== '') {
                    if (isNaN(objRequestCore['search']['value'])) {
                        filter = {
                            $or: [
                                {'Request_Unique_Id': new RegExp(objRequestCore['search']['value'], 'i')},
                                {'Employee_Unique_Id': new RegExp(objRequestCore['search']['value'], 'i')},
                                {'Method_Type': new RegExp(objRequestCore['search']['value'], 'i')},
                                {'Error_Code': new RegExp(objRequestCore['search']['value'], 'i')}
                            ]
                        };
                    } else {
                        filter = {'Product_Id': parseInt(objRequestCore['Product_Id'])};
                    }
                } else {
                    filter['Role_ID'] = 0;
                    if (objRequestCore['page_action'] === 'ch_dsa_list' && req.obj_session.user.role_detail.title === "ChannelHead") {
                        filter['Role_ID'] = obj_dsa_role[req.obj_session.user.role_detail.channel];
                    }

                    if (objRequestCore['page_action'] === 'dsa_list' && req.obj_session.hasOwnProperty('users_assigned') && req.obj_session.users_assigned.hasOwnProperty('Team')) {
                        filter['Emp_Id'] = {$in: req.obj_session.users_assigned.Team.DSA};
                        filter['Role_ID'] = {$in: [29, 34, 39, 41]};
                    }
                    if (objRequestCore['page_action'] === 'all_dsa_list') {
                        filter['Role_ID'] = {$in: [29, 34, 39, 41]};
                    }

                    if ((objRequestCore['page_action'] === 'ch_cse_list' || req.body['page_action'] === 'cse_list') && req.obj_session.hasOwnProperty('users_assigned') && req.obj_session.users_assigned.hasOwnProperty('Team')) {
                        //console.error('Employee', '/dsas', req.obj_session.users_assigned.Team.CSE);
                        filter['Emp_Id'] = {$in: req.obj_session.users_assigned.Team.CSE};
                        filter['Role_ID'] = 23;
                    }
                    if (objRequestCore['page_action'] === 'all_cse_list') {
                        filter['Role_ID'] = 23;
                    }

                    if (objRequestCore['Col_Name'] !== '' && objRequestCore['txtCol_Val'] !== '') {
                        filter[objRequestCore['Col_Name']] = (isNaN(objRequestCore['txtCol_Val']) === false) ? objRequestCore['txtCol_Val'] - 0 : objRequestCore['txtCol_Val'];
                    }
                }
                employees.find(filter).sort({"Modified_On": -1}).toArray(function (err, dbPosps) {
                    try {
                        if (err) {
                            res.send(err);
                        } else {
                            var excel = require('excel4node');
                            var workbook = new excel.Workbook();
                            var worksheet = workbook.addWorksheet('Sheet 1');
                            var ff_file_name = "All_Dsa_List.xlsx";
                            var ff_loc_path_portal = appRoot + "/tmp/dsa_list/" + ssid + "/" + ff_file_name;
                            if (!fs.existsSync(appRoot + "/tmp/dsa_list/" + ssid)) {
                                fs.mkdirSync(appRoot + "/tmp/dsa_list/" + ssid);
                            }
                            if (fs.existsSync(appRoot + "/tmp/dsa_list/" + ssid + "/" + ff_file_name)) {
                                fs.unlinkSync(appRoot + "/tmp/dsa_list/" + ssid + "/" + ff_file_name);
                            }
                            var excel_Columns = ["Ss_Id", "Fba_Id", "Name", "Pan", "SourceName", "Branch", "VendorCode", "Reporting"];
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
                                for (let i = 0; i < excel_Columns.length; i++) {
                                    worksheet.cell(1, i + 1).string(excel_Columns[i]).style(styleh);
                                }
                                //row 2
                                for (var rowcount in dbPosps) {
                                    try {
                                        PospData = dbPosps[rowcount];
                                        rowcount = parseInt(rowcount);
                                        worksheet.cell(rowcount + 2, 1).string(PospData.hasOwnProperty("Emp_Id") && PospData["Emp_Id"] ? (PospData["Emp_Id"]).toString() : "");
                                        worksheet.cell(rowcount + 2, 2).string(PospData.hasOwnProperty("FBA_ID") && PospData["FBA_ID"] ? (PospData["FBA_ID"]).toString() : "");
                                        worksheet.cell(rowcount + 2, 3).string(PospData.hasOwnProperty("Emp_Name") && PospData["Emp_Name"] ? (PospData["Emp_Name"]).toString().trim() : "");
                                        worksheet.cell(rowcount + 2, 4).string(PospData.hasOwnProperty("Pan") && PospData["Pan"] ? (PospData["Pan"]).toString() : "");
                                        worksheet.cell(rowcount + 2, 5).string(PospData.hasOwnProperty("Role_ID") && PospData["Role_ID"] ? (objSource[PospData["Role_ID"]]).toString() : "");
                                        worksheet.cell(rowcount + 2, 6).string(PospData.hasOwnProperty("Branch") && PospData["Branch"] ? (PospData["Branch"]).toString() : "");
                                        worksheet.cell(rowcount + 2, 7).string(PospData.hasOwnProperty("VendorCode") && PospData["VendorCode"] ? (PospData["VendorCode"]).toString() : "");
                                        worksheet.cell(rowcount + 2, 8).string(PospData.hasOwnProperty("Reporting_UID_Name") && PospData.hasOwnProperty("UID") ? (PospData['Reporting_UID_Name'] + '(UID#' + PospData['UID'] + ')').toString().toUpperCase() : "");
                                    } catch (e) {
                                        res.json({'msg': 'error-' + e.message});
                                    }
                                }
                                //console.log(worksheet)
                                //workbook.write(ff_loc_path_portal);
                                workbook.write(ff_loc_path_portal, function (err, stats) {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        //res.download(ff_loc_path_portal);
                                        res.json({"Status": "Success", "Msg": config.environment.downloadurl + "/postservicecall/dsa_list/" + ssid + "/" + ff_file_name});
                                    }
                                });
                            } else {
                                for (let i = 0; i < excel_Columns.length; i++) {
                                    worksheet.cell(1, i + 1).string(excel_Columns[i]).style(styleh);
                                }
                                workbook.write(ff_loc_path_portal, function (err, stats) {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        //res.download(ff_loc_path_portal);
                                        res.json({"Status": "Success", "Msg": config.environment.downloadurl + "/postservicecall/dsa_list/" + ssid + "/" + ff_file_name});
                                    }
                                });
                            }
                            //res.download(ff_loc_path_portal);
                        }
                        db.close();
                    } catch (e) {
                        console.error("Error - /dsas_without_pagination", e.stack);
                        res.json({"Status": "Fail", "Msg": e.stack});
                    }
                });
            } catch (e) {
                console.error("Error - /dsas_without_pagination", e.stack);
                res.json({"Status": "Fail", "Msg": e.stack});
            }
        });

    } catch (e) {
        console.error("Error - /dsas_without_pagination", e.stack);
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});
router.post('/sync_contact_dashboard_lead_count', agent_details_pre, function (req, res, next) {
    try {
        let Ss_Id = req.body.ss_id - 0;
        let Fba_Id = req.body.fba_id - 0;
        let sync_contact_erp_data = require('../models/sync_contact_erp_data');
        Sync_Contact.find({ss_id: Ss_Id, fba_id: Fba_Id}, function (err, dbSync_Contacts) {
            let contact_res = {
                "available_leads": 0
            };
            if (dbSync_Contacts.length > 0) {

                const getMonths = (fromDate, toDate) => {
                    const fromYear = moment(fromDate, 'DD-MM-YYYY').year();
                    const fromMonth = moment(fromDate, 'DD-MM-YYYY').month();
                    const toYear = moment(toDate, 'DD-MM-YYYY').year();
                    const toMonth = moment(toDate, 'DD-MM-YYYY').month();
                    const months = [];

                    for (let year = fromYear; year <= toYear; year++) {
                        let monthNum = year === fromYear ? fromMonth : 0;
                        const monthLimit = year === toYear ? toMonth : 11;

                        for (; monthNum <= monthLimit; monthNum++) {
                            let month = monthNum + 1;
                            months.push(moment(month, 'MM').format('MMM'));
                        }
                    }
                    return months;
                };
                const monthsArray = getMonths(req.body.startDate, req.body.endDate);

                sync_contact_erp_data.find({ss_id: Ss_Id, fba_id: Fba_Id, 'product': 'MOTOR', 'Is_Valid': 1, Is_Lead_Created: 0, policy_expiry_month: {$in: monthsArray}}).exec(function (err, dbSync_contact_erp_datas) {
                    if (err) {
                        res.send(err);
                    }
                    let startDate = moment(req.body.startDate, "DD-MM-YYYY").format("DD-MM-" + moment().year());
                    let endDate = moment(req.body.endDate, "DD-MM-YYYY").format("DD-MM-" + moment().year());
                    if (((moment(req.body.startDate, "DD-MM-YYYY").month() - 0) + 1) > ((moment(req.body.endDate, "DD-MM-YYYY").month() - 0) + 1)) {
                        startDate = moment(req.body.endDate, "DD-MM-YYYY").format("DD-MM-" + moment().year());
                        endDate = moment(req.body.startDate, "DD-MM-YYYY").format("DD-MM-" + moment().year());
                    }
                    for (let j = 0; j < dbSync_contact_erp_datas.length; j++) {
                        if (moment(dbSync_contact_erp_datas[j]['_doc']['policy_expiry_date'], "YYYY-MM-DD").set('year', moment().year()).isBetween(moment(startDate, "DD-MM-YYYY"), moment(endDate, "DD-MM-YYYY"), "days", "[]")) {
                            contact_res['available_leads']++;
                        }
                    }
                    res.json(contact_res);
                });
            } else {
                res.json(contact_res);
            }
        });
    } catch (e) {
        return res.send(e.stack);
    }
});
router.get('/dsa_list/:ssid/:filename', function (req, res) {
    try {
        let ssid = req.params.ssid;
        let filename = req.params.filename;
        if (ssid && filename && ssid !== "" && filename !== "") {
            res.download(appRoot + '/tmp/dsa_list/' + ssid + '/' + filename);
        } else {
            res.json({"Status": "Fail", "Msg": "SsId or Filename is missing"});
        }

    } catch (e) {
        console.error("Error - /download_posp_excel", e.stack);
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});
router.post('/sales_material_tracking', function (req, res) {
    try {
        let sales_material_tracking = require('../models/sales_material_tracking');
        let objRequest = req.body;
        objRequest.Created_On = new Date();
        let sales_material_tracking_data = new sales_material_tracking(req.body);
        sales_material_tracking_data.save(function (err, db_sales_material_tracking) {
            if (err) {
                res.json({'Status': "Fail", 'Msg': err});
            } else {
                res.json({'Status': "Success", 'Msg': "Data Inserted Successfully", "Data": db_sales_material_tracking});
            }
        });
    } catch (e) {
        res.json({'Status': "Error", 'Msg': e.stack});
    }
});
router.post("/get_file_bytes_by_path", function (req, res) {
    try {
        let objReq = req.body;
        objReq = JSON.parse(JSON.stringify(objReq));
        let path = objReq.path ? objReq.path : "";
        let ss_id = objReq.ss_id ? objReq.ss_id : "";
        if (path && ss_id) {
            if (fs.existsSync(appRoot + "/tmp/onboarding_docs/" + ss_id)) {
                let read_data = fs.readFileSync(appRoot + path, {});
                res.json({"Status": "Success", "Msg": "Bytes found", "Data": read_data});
            } else {
                res.json({"Status": "Fail", "Msg": "No path found"});
            }
        } else {
            res.json({"Status": "Fail", "Msg": "No path found"});
        }
    } catch (ex) {
        console.error("Exception in getting file bytes : " + ex.stack);
        res.json({"Status": "Fail", "Msg": ex.stack});
    }
});
router.post('/policyboss_upload_doc', function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        let ObjRequest;
        let new_file_path = "";
        let kyc_doc = true;
        let msg = "";
        let status = "";
        form.parse(req, function (err, fields, files) {
            ObjRequest = fields;
            let crndata = ObjRequest.crn.replace(/#| |"|'|`|%20|%22|%27|%2C/g, '');
            let document_type_data = ObjRequest.document_type.replace(/#| |"|'|`|%20|%22|%27|%2C/g, '');
            if (ObjRequest && ObjRequest.document_id && ObjRequest.document_id.toLowerCase().includes("posp")) {
                kyc_doc = false;
            }
            var dir = kyc_doc ? (appRoot + "/tmp/kyc_documents/") : (appRoot + "/tmp/onboarding_docs/");
            let file_name_prefix = {"PAN": "PanCard_", "AADHAAR": "AadharCard_", "AADHAAR_BACK": "AadharCardBack_", "OTHER": "Certificate_", "QUALIFICATION": "QualificationCertificate_", "POSP_ACC_DOC": "Posp_Bank_Account_", "NOMINEE_ACC_DOC": "Nominee_Bank_Account_", "PROFILE": "Profile_", "NOMINEE_PAN_DOC": "Nominee_Pan_Card_"};
            if (fs.existsSync(dir)) {
            } else {
                fs.mkdirSync(dir);
            }
            if (!kyc_doc) {
                if (fs.existsSync(appRoot + "/tmp/onboarding_docs/" + crndata)) {
                } else {
                    fs.mkdirSync(appRoot + "/tmp/onboarding_docs/" + crndata);
                }
            }
            for (let i in files) {
                if (files[i] !== null && files[i] !== "" && files[i] !== undefined) {
                    let name_arr = files[i].name.split('.');
                    var extension = name_arr[name_arr.length - 1];
                    if (!kyc_doc) {
                        if (!["jpg", "jpeg", "pdf", "png"].includes(extension)) {
                            msg = "Extension not allowed.";
                            status = "Fail";
                        }
                    }
                    if (status !== "Fail") {
                        var file_sys_loc_horizon = "";
                        if (kyc_doc) {
                            file_sys_loc_horizon = appRoot + ('/tmp/kyc_documents/' + (crndata + "_" + ObjRequest.document_id + "_" + ObjRequest.insurer_id)).replace(/#| |"|'|`|%20|%22|%27|%2C/g, '') + '.' + extension;
                            if (ObjRequest.insurer_id - 0 === 7) {
                                file_sys_loc_horizon = appRoot + ("/tmp/kyc_documents/" + crndata + "_" + ObjRequest.document_id.split('_')[0] + "_" + ObjRequest.insurer_id).replace(/#| |"|'|`|%20|%22|%27|%2C/g, '') + "." + extension;
                                if(fs.existsSync(file_sys_loc_horizon)){
                                   file_sys_loc_horizon =  appRoot + ("/tmp/kyc_documents/" + crndata + "_" + ObjRequest.document_id.split('_')[1] + "_" + ObjRequest.insurer_id).replace(/#| |"|'|`|%20|%22|%27|%2C/g, '') + "." + extension; 
                                }
                            }
                            if (ObjRequest.insurer_id - 0 === 5) {
                                file_sys_loc_horizon = appRoot + ("/tmp/kyc_documents/" + crndata + "_" + ObjRequest.document_id + "_" + ObjRequest.insurer_id).replace(/#| |"|'|`|%20|%22|%27|%2C/g, '') + "Front." + extension;
                                if(fs.existsSync(file_sys_loc_horizon)){
                                    file_sys_loc_horizon = appRoot + ("/tmp/kyc_documents/" + crndata + "_" + ObjRequest.document_id + "_" + ObjRequest.insurer_id).replace(/#| |"|'|`|%20|%22|%27|%2C/g, '') + "Back." + extension;
                                }
                            }
                        } else {
                            file_sys_loc_horizon = appRoot + ("/tmp/onboarding_docs/" + crndata + "/" + file_name_prefix[document_type_data] + "" + crndata) + '.' + extension;
                        }
//                      appRoot + (kyc_doc ? (('/tmp/kyc_documents/' + (crndata + "_" + ObjRequest.document_id + "_" + ObjRequest.insurer_id)).replace(/#| |"|'|`|%20|%22|%27|%2C/g, '')) : ("/tmp/onboarding_docs/" + crndata + "/" + file_name_prefix[document_type_data] + "" + crndata)) + '.' + extension;
                        
                        let oldpath = files[i].path;
                        new_file_path = file_sys_loc_horizon;
                        var read_data = fs.readFileSync(oldpath, {});
                        fs.writeFileSync(file_sys_loc_horizon, read_data, {});
                        fs.unlink(oldpath, function (err) {
                            if (err)
                                console.err(err);
                            console.log('File deleted!');
                        });
                        msg = "Document saved successfully";
                        status = "Success";
                    }
                }
            }
            const res_data = {
                'crn': crndata,
                'document_id': ObjRequest.document_id,
                'document_type': document_type_data,
                'insurer_id': ObjRequest.insurer_id,
                'file_path': new_file_path
            };
            const response = {"Msg": msg, "Data": res_data, "Status": status};
            res.json(response);
        });
    } catch (err) {
        let errRes = {"Msg": err.stack, "Status": "Fail"};
        res.json(errRes);
    }
});
router.post('/policyboss_upload_doc_NIU', multipartMiddleware1, function (req, res) {
    try {
        let ObjRequest = req.body;
        let new_file_path = [];
        let logRequest = {
            Request_Core: ObjRequest,
            Date: new Date()
        };
        if (!fs.existsSync(appRoot + "/tmp/policyboss_upload_doc_log")) {
            fs.mkdirSync(appRoot + "/tmp/policyboss_upload_doc_log");
        }
        var logFileName = ObjRequest.crn + '_Doclog';
        fs.appendFileSync(appRoot + "/tmp/policyboss_upload_doc_log/" + logFileName, "--------------------------------" + JSON.stringify(logRequest) + "\n", 'utf8');

        for (let i = 1; i <= Object.keys(req.files).length; i++) {
            if (req.files["file_" + i] !== null && req.files["file_" + i] !== "" && req.files["file_" + i] !== undefined) {
                let original_file_path = req.files["file_" + i].path.replaceAll('//', '/');
                var extension = req.files["file_" + (i - 0)].originalFilename.split('.');
                extension = extension[extension.length - 1];
                new_file_path.push('/tmp/kyc_documents/' + (ObjRequest.crn + "_" + ObjRequest.document_id + "_" + ObjRequest.insurer_id) + '.' + extension);
                fs.renameSync(appRoot + '/' + original_file_path, appRoot + new_file_path[(i - 0) - 1]);
            }
        }
        let res_data = {
            'crn': ObjRequest.crn,
            'document_id': ObjRequest.document_id,
            'document_type': ObjRequest.document_type,
            'insurer_id': ObjRequest.insurer_id,
            'file_path': new_file_path.join(' , ')
        };
        let response = {"Msg": 'doc saved', "Data": res_data, "Status": "Success"};
        let logResponse = {
            Response_Core: response,
            Date: new Date()
        };
        fs.appendFileSync(appRoot + "/tmp/policyboss_upload_doc_log/" + logFileName, JSON.stringify(logResponse), 'utf8');
        res.json(response);
    } catch (err) {
        let errRes = {"Msg": err.stack, "Status": "FAIL"};
        let logRes = {
            Response_Core: errRes,
            Date: new Date()
        };
        fs.appendFileSync(appRoot + "/tmp/policyboss_upload_doc_log/" + logFileName, JSON.stringify(logRes), 'utf8');
        res.json(errRes);
    }
});
router.post('/royalsundaram_policy_download', royalPolicyDownload, function (req, res) {
    try {
        let request = req.body;
        if (request && request.pdf_response) {
            res.send({'Msg': "Success", "Data": request.pdf_response});
        } else {
            res.send({'Msg': "Fail", "Data": request});
        }
    } catch (e) {
        res.send({'Msg': "Error", "Data": e.stack});
    }
});
router.post('/poc_share_history', function (req, res) {
    let poc_share_history = require('../models/poc_share_history');
    let objReq = req.body;
    objReq.Created_On = new Date();
    objReq.Modified_On = new Date();
    let poc_share_history1 = new poc_share_history(objReq);
    poc_share_history1.save(function (err, data) {
        if (err) {
            res.send({'Status': 'Sucess', 'Msg': err});
        }
        res.json({'Status': 'Sucess', Data: {'Doc_id': data._doc.poc_share_history_id}});
    });
});
router.post('/poc_share_history_update', function (req, res) {
    let poc_share_history = require('../models/poc_share_history');
    let objReq = req.body;
    objReq.Modified_On = new Date();
    poc_share_history.update({poc_share_history_id: objReq.Doc_id}, {$set: {Status: objReq.Status || "Pending"}}, function (err, data) {
        if (err) {
            res.send({'Status': 'Sucess', 'Msg': err});
        }
        res.json({'Status': 'Sucess', 'Msg': `Status Updated`});
    });
});
router.post('/get_sub_vertical_detail', (req, res) => {
    try {
        let Users = require('../models/user');
        var reqObj = req.body;
        let MasterData = [];
        let resObj = {
            "Message": "Success",
            "Status": "Success",
            "StatusNo": 0,
            "MasterData": MasterData
        }
        let Cond_User = {
            "Sub_Vertical": reqObj.Sub_Vertical
        };
        if (reqObj.Sub_Vertical == "Direct") {
            Cond_User = {
                "Sub_Vertical": {
                    "$in": [
                        "Corporate",
                        "Customer_Service",
                        "Health Fresh",
                        "Health Renewal",
                        "Motor Fresh",
                        "Motor Renewals",
						"Travel",
						"Digital"
                    ]
                }
            };
        }
        Cond_User["Official_Email"] = {"$ne": "-"};
        Users.find(Cond_User).sort({'Employee_Name': 1}).exec(function (err, data) {
            if (err) {
                resObj['Status'] = 'Fail';
                resObj['Message'] = err.stack
                res.json(resObj);
            }
            if (data.length > 0) {
                data.forEach((user) => {
                    let Arr_Employee_Name = user['_doc']['Employee_Name'].split(' ');
                    Employee_Name = (Arr_Employee_Name.length > 1) ? (Arr_Employee_Name[0] + " " + Arr_Employee_Name[Arr_Employee_Name.length - 1]) : Arr_Employee_Name[0];
                    MasterData.push({
                        "Uid": user['_doc']['UID'],
                        "EmployeeName": Employee_Name + '-' + user['_doc']['UID'] + '-' + user['_doc']['Branch']
                    })
                });
                resObj['MasterData'] = MasterData;
                res.json(resObj);
            } else {
                resObj['Message'] = "No Data Found";
                res.json(resObj);
            }
        });
    } catch (err) {
        resObj['Status'] = 'Fail';
        resObj['Message'] = err.stack
        res.json(resObj);
    }
});

router.post('/kyc_eligibility_list', call_zoop, (req, res) => {
    try {
        const ObjRequest = req.body;
        const Client = require('node-rest-client').Client;
        const client = new Client();
        const save_kyc_details_req = ObjRequest;
        const {insurer_list} = ObjRequest;
        const insurer_list_response = {};
        insurer_list.forEach((insurer_id) => {
            insurer_list_response[insurer_id] = 'Pending';
            save_kyc_details_req.insurer_id = insurer_id;
            save_kyc_details_req.Quote_Id = "";
            if (ObjRequest.Quote_Id_Object && ObjRequest.Quote_Id_Object[insurer_id]) {
                save_kyc_details_req['Quote_Id'] = ObjRequest.Quote_Id_Object[insurer_id];
            }
            let url_api = `${config.environment.weburl}/postservicecall/kyc_details/save_kyc_details`;
            let args = {
                data: save_kyc_details_req,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(url_api, args);
        });
        res.json({"Msg": insurer_list_response, "Status": "SUCCESS"});
    } catch (err) {
        res.json({"Msg": err.stack, "Status": "FAIL"});
    }
});
router.post('/kyc_eligibility_list_check',call_zoop, (req, res) => {
    try {
        const ObjRequest = req.body;
        const insurer_list_response = {};
        let proposal_request = ObjRequest.hasOwnProperty('Proposal_Request') && ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : {};
        let query = {
            PB_CRN: ObjRequest.crn,
            Document_ID: (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
            DOB: {$in: [((proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date), ((proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : moment(proposal_request.birth_date, 'DD/MM/YYYY').format('DD-MM-YYYY'))]}
//            KYC_Status: {$nin: [null, "", "VERIFY_FAIL", "FETCH_FAIL", "KYC_UPDATE_FAIL", "VERIFY_SUCCESS"]},
//            KYC_Number: {$nin: [null, ""]}
        };
        kyc_history.find(query).sort({Created_On: -1}).exec((err, data) => {
            try {
                if (err) {
                    res.json({"Msg": err, "Status": "FAIL"});
                } else {
                    if (data.length > 0) {
                        data.forEach((insurer) => {
                            if (!insurer_list_response[insurer['_doc']['Insurer_Id']]) {
                                insurer_list_response[insurer['_doc']['Insurer_Id']] = insurer['_doc'];
                                if ([12, 13].indexOf(insurer['_doc']['Insurer_Id']) > -1) {
                                    insurer_list_response[insurer['_doc']['Insurer_Id']]['KYC_Status'] = "FETCH_SUCCESS";
                                }
                            }
                        });
                    }
                    res.json({"Msg": insurer_list_response, "Status": "SUCCESS"});
                }
            } catch (err) {
                res.json({"Msg": err.stack, "Status": "FAIL"});
            }
        });
    } catch (err) {
        res.json({"Msg": err.stack, "Status": "FAIL"});
    }
});

router.post('/kyc_details/get_kyc_details', function (req, res) {
    try {
        let ObjRequest = req.body;
        let crn = ObjRequest.crn - 0;
        let insurer_id = ObjRequest.insurer_id - 0;
        let query = {
            PB_CRN: crn,
            Insurer_Id: (req.body.insurer_id === undefined || req.body.insurer_id === "" || req.body.insurer_id === null) ? "" : req.body.insurer_id - 0,
            KYC_Status: {$nin: [null, "", "VERIFY_FAIL", "FETCH_FAIL", "KYC_UPDATE_FAIL"]}
        };
        kyc_history.findOne(query).sort({Created_On: -1}).exec((err, data) => {
            try {
                if (err) {
                    res.json({"Msg": err, "Status": "FAIL"});
                } else {
                    if (data && data.hasOwnProperty('_doc')) {
                        if (data['_doc'].hasOwnProperty('KYC_Status') && data['_doc']['KYC_Status']) {
                            let LM_Data = {
                                "KYC_Doc_No": (data['_doc'].hasOwnProperty('Document_ID')) ? (data['_doc']['Document_ID']) : "",
                                "KYC_Number": (data['_doc'].hasOwnProperty('KYC_Number')) ? (data['_doc']['KYC_Number']) : "",
                                "KYC_FullName": (data['_doc'].hasOwnProperty('KYC_Full_Name') && data['_doc']['KYC_Full_Name']) ? data['_doc']['KYC_Full_Name'] : ((data['_doc'].hasOwnProperty('Full_Name')) ? (data['_doc']['Full_Name']) : ""),
                                "KYC_Ref_No": (data['_doc'].hasOwnProperty('KYC_Ref_No')) ? (data['_doc']['KYC_Ref_No']) : "",
                                "KYC_Redirect_URL": (data['_doc'].hasOwnProperty('KYC_URL')) ? (data['_doc']['KYC_URL']) : "",
                                "KYC_Insurer_ID": (data['_doc'].hasOwnProperty('Insurer_Id')) ? (data['_doc']['Insurer_Id']) : "",
                                "KYC_PB_CRN": (data['_doc'].hasOwnProperty('PB_CRN')) ? (data['_doc']['PB_CRN']) : "",
                                "KYC_Status": (data['_doc'].hasOwnProperty('KYC_Status')) ? (data['_doc']['KYC_Status']) : "",
                                "KYC_Data": data['_doc'],
                                "KYC_Document_Type": (data['_doc'].hasOwnProperty('Document_Type')) ? (data['_doc']['Document_Type']) : ""
                            };
                            res.send(LM_Data);
                        } else {
                            res.json({"Insurer": insurer_id, "Msg": "No Data Found", "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": insurer_id, "Msg": "No Data Found", "Status": "FAIL"});
                    }
                }
            } catch (err) {
                res.json({"Msg": err.stack, "Status": "FAIL"});
            }
        });
    } catch (err) {
        res.json({"Msg": err.stack, "Status": "FAIL"});
    }
});

router.get('/getKycFormData/:crn', (req, res) => {
    try {
        let PB_CRN = req.params.crn || 0;
        PB_CRN = PB_CRN - 0;
        if (PB_CRN > 0) {
            kyc_history.findOne({"PB_CRN": PB_CRN}).sort({"Created_On": -1}).exec((err, data) => {
                if (err) {
                    res.json({"Msg": err, "Status": "FAIL"});
                }
                if (data) {
                    data = data._doc;
                    return res.json({"Status": "SUCCESS",
                        "Msg": {
                            "Name": data['Full_Name'] || "",
                            "DOB": data['DOB'] || "",
                            "Document_ID": data['Document_ID'] || "",
                            "Mobile": data['Mobile'] || "",
                            'Document_Type': data['Document_Type'] || ""
                        }
                    });
                } else {
                    return res.json({"Msg": "No Data Found", "Status": "FAIL"});
                }
            });
        } else {
            return res.json({"Msg": "No Data Found", "Status": "FAIL"});
        }
    } catch (err) {
        return res.json({"Msg": err, "Status": "FAIL"});
    }
});
router.post('/app_service_log', function (req, res) {
    try {
        var App_Service_Log = require('../models/app_service_log');
        req.body = JSON.parse(JSON.stringify(req.body));
        var Obj_App_Service_Log_Model = new App_Service_Log();
        for (var key in req.body) {
            Obj_App_Service_Log_Model[key] = req.body[key];
        }
        Obj_App_Service_Log_Model.Created_On = new Date();
        Obj_App_Service_Log_Model.save(function (err1) {
            if (err1) {
                res.json({'Msg': err1, Status: 'Fail'});
            } else {
                res.json({'Msg': 'Saved Succesfully!!!', Status: 'Success'});
            }
        });
    } catch (err) {
        res.json({"Msg": err.stack, "Status": "FAIL"});
    }
});
router.post('/assigned_reassigned_ssid_to_posp_enquiry', function (req, res, next) {
    try {
        let posp_assigned_history = require('../models/posp_assigned_history');
        let posp_enquiry = require('../models/posp_enquiry');
        let objRequest = req.body;
        objRequest = JSON.parse(JSON.stringify(objRequest));
        let new_lead_assign_ss_id = "";
        let last_assigned_by_name = "";
        client.get(config.environment.weburl + '/posps/dsas/view/' + objRequest.ss_id, {}, function (data1, response1) {
            try {
                if (data1 && data1.hasOwnProperty('status') && data1.status === "SUCCESS") {
                    last_assigned_by_name = (data1['EMP']['Emp_Name'] + " (" + data1['EMP']['Emp_Code'] + ")");
                    client.get(config.environment.weburl + '/postservicecall/posp_enquires/get_lead_assigned', {}, function (data2, response2) {
                        try {
                            let lead_assign_ss_id = [];
                            if (data2 && data2.hasOwnProperty('Status') && data2.Status === "Success") {
                                if (objRequest.hasOwnProperty('action') && objRequest.action && objRequest.action !== "") {
                                    new_lead_assign_ss_id = objRequest.assigned_ssid - 0;
                                } else {
                                    for (let i = 0; i < data2['Msg'].length; i++) {
                                        if (data2['Msg'][i].hasOwnProperty('last_assigned_to') && data2['Msg'][i]['last_assigned_to'] && data2['Msg'][i]['last_assigned_to'] !== "") {
                                            lead_assign_ss_id.push(data2['Msg'][i]['last_assigned_to']);
                                        }
                                    }
                                    let filtered_ss_id = lead_assign_ss_id.filter(function (ssid) {
                                        if (ssid == objRequest.last_assigned_to) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    });
                                    let temp_random = Math.floor(Math.random() * filtered_ss_id.length);
                                    new_lead_assign_ss_id = filtered_ss_id[temp_random];
                                }

                                let updateObj = {
                                    "last_assigned_by": last_assigned_by_name,
                                    "last_assigned_to": new_lead_assign_ss_id,
                                    "last_assigned_on": new Date()
                                };
                                posp_enquiry.update({'mobile': objRequest.mobile}, {$set: updateObj}, function (err, numAffected) {
                                    if (err) {
                                        res.json({"Status": "Fail", "Msg": err});
                                    } else {
                                        let args = {
                                            "Posp_Enquiry_Id": objRequest['Posp_Enquiry_Id'],
                                            "mobile": objRequest['mobile'],
                                            "name": objRequest['name'],
                                            "pan": objRequest['pan'],
                                            "aadhaar": objRequest['aadhaar'],
                                            "last_assigned_by": updateObj['last_assigned_by'],
                                            "last_assigned_to": updateObj['last_assigned_to'],
                                            "last_assigned_on": updateObj['last_assigned_on'],
                                            "Created_On": new Date(),
                                            "Modified_On": new Date()
                                        };
                                        let posp_assigned_historyObj = new posp_assigned_history(args);
                                        posp_assigned_historyObj.save(function (err, dbdata) {
                                            if (err) {
                                                res.json({"Status": "Fail", "Msg": err});
                                            } else {
                                                res.json({"Status": "Success", "Msg": dbdata._doc});
                                            }
                                        });
                                    }
                                });

                            } else {
                                res.json({'Msg': 'No Data From - /postservicecall/posp_enquires/get_lead_assigned', 'Status': 'Fail'});
                            }
                        } catch (e) {
                            console.error(e.stack);
                            res.json({'Msg': 'Error in - /assigned_reassigned_ssid_to_posp_enquiry', 'Status': 'Fail'});
                        }
                    });
                } else {
                    res.json({'Msg': 'No Data From - /posps/dsas/view/' + objRequest.ss_id, 'Status': 'Fail'});
                }
            } catch (e) {
                console.error(e.stack);
                res.json({'Msg': 'Error in - /assigned_reassigned_ssid_to_posp_enquiry', 'Status': 'Fail'});
            }
        });
    } catch (e) {
        console.error(e.stack);
        res.json({'Msg': 'Error in - /assigned_reassigned_ssid_to_posp_enquiry', 'Status': 'Fail'});
    }
});
router.post("/onboarding/update_doc_status", function (req, res) {
    try {
        let posp_user = require('../models/posp_users.js');
        let body = req.body;
        let verification_data = {};
        let post_args = {
            data: {},
            headers: {
                "Content-Type": "application/json"
            }
        };
        for (let key in body) {
            verification_data[key] = body[key] && body[key] !== undefined ? body[key] : "";
        }
        var rejected_documents = [];
        var Approver_Type = verification_data["Approver_Type"];
        var Ss_Id = verification_data.User_Id;
        var doc_rej_obj = {
            "User_Id": Ss_Id,
            "Email": verification_data.Email,
            "Status": []
        };
        var Msg = "";
        var total_doc_verified = 0, total_doc_approved = 0, total_doc_rejected = 0;
        var approver_obj = {"Approver": {"Approve": "Approved", "Reject": "A-Reject", "Ss_Id": "Approver_Ss_Id", "Date": "Approved_On_Date"}, "Verifier": {"Approve": "Verified", "Reject": "V-Reject", "Ss_Id": "Verifier_Ss_Id", "Date": "Verified_On_Date"}};
        var documents = {
            PAN: {"Status": verification_data["PanCard_Status"], "Remark": verification_data["PanCard_Reject_Reason"]},
            AADHAAR: {"Status": verification_data["AadharCard_Status"], "Remark": verification_data["AadharCard_Reject_Reason"]},
            QUALIFICATION: {"Status": verification_data["Qualification_Certificate_Status"], "Remark": verification_data["Qualification_Certificate_Reject_Reason"]},
            PROFILE: {"Status": verification_data["Profile_Status"], "Remark": verification_data["Profile_Reject_Reason"]},
            POSP_ACC_DOC: {"Status": verification_data["PospBankAccount_Status"], "Remark": verification_data["PospBank_Reject_Reason"]},
            NOMINEE_ACC_DOC: {"Status": verification_data["NomineeBankAccount_Status"], "Remark": verification_data["NomineeBank_Reject_Reason"]},
            NOMINEE_PAN_DOC: {"Status": verification_data["Nominee_Pan_Status"], "Remark": verification_data["Nominee_Pan_Reject_Reason"]}
        };
        if (verification_data.User_Id && Approver_Type) {
            Object.keys(documents).find(key => {
                let doc_log_args = {};
                if (Approver_Type === "Approver") {
                    doc_log_args["Approver_Ss_Id"] = verification_data.Approver_Ss_Id;
                    doc_log_args["Approved_On_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                } else {
                    doc_log_args["Verifier_Ss_Id"] = verification_data.Verifier_Ss_Id;
                    doc_log_args["Verified_On_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                }
                doc_log_args["User_Id"] = verification_data.User_Id;
                doc_log_args["Mobile_Number"] = verification_data.Mobile_Number;
                doc_log_args["Fba_Id"] = verification_data.Fba_Id;
                doc_log_args["Doc_Type"] = key;
                doc_log_args["Status"] = approver_obj[Approver_Type][documents[key]["Status"]];
                doc_log_args["Remark"] = documents[key]["Remark"];
                if (["A-Reject", "V-Reject"].includes(doc_log_args["Status"])) {
                    rejected_documents.push({
                        "Doc_Type": key,
                        "Reject_Reason": doc_log_args["Remark"],
                        "Reject_Remark": doc_log_args["Status"]
                    });
                    total_doc_rejected++;
                } else {
                    doc_log_args["Status"] === "Approved" ? (total_doc_approved++) : (doc_log_args["Status"] === "Verified" ? total_doc_verified++ : "");
                }
                post_args["data"] = doc_log_args;
                client.post(config.environment.weburl + "/onboarding/update_doc_log", post_args, function (data, response) {
                });
            });
            if (rejected_documents.length > 0) {
                doc_rej_obj["Status"] = rejected_documents;
                post_args["data"] = {'data': doc_rej_obj};
                client.post(config.environment.weburl + "/onboarding/send_doc_rejection_mail", post_args, function (data, response) {
                });
            }
            let posp_args = {
                "Is_Document_Rejected": "No"
            };
            if (total_doc_verified === 7) {
                posp_args["Is_Doc_Verified"] = "Yes";
                posp_args["Onboarding_Status"] = "Doc_Verified";
                Msg = "Documents Verified Successfully";
            } else if (total_doc_approved === 7) {
                posp_args["Is_Doc_Approved"] = "Yes";
                posp_args["Is_Doc_Verified"] = "Yes";
                posp_args["Onboarding_Status"] = "Doc_Approved";
                Msg = "Documents Approved Successfully";
            } else {
                posp_args["Is_Document_Rejected"] = "Yes";
                Msg = "Documents status updated successfully";
            }
            posp_user.update({"User_Id": Ss_Id}, {$set: posp_args}, function (posp_update_err, posp_update_res) {
                if (posp_update_err) {
                    res.json({"Status": "Fail", "Msg": posp_update_err});
                } else {
                    res.json({"Status": "Success", "Msg": Msg});
                }
            });
        } else {
            res.json({"Status": "FAIL", "Msg": "Please provide valid Ss_Id / approver details."});
        }
    } catch (ex) {
        res.json({"Status": "FAIL", "Msg": ex.stack});
    }
});
router.get('/posp_enquires/get_lead_assigned', function (req, res) { // roshani 20-06-2023
    try {
        let posp_enquiry = require('../models/posp_enquiry');
        let arr_Cond = [
            {$group: {
                    _id: {last_assigned_to: "$last_assigned_to"},
                    assign_count: {$sum: 1}
                }},
            {$project: {_id: 0, last_assigned_to: "$_id.last_assigned_to", assign_count: 1}},
            {$sort: {'assign_count': 1}}
        ];
        posp_enquiry.aggregate(arr_Cond).exec(function (posp_enquiry_err, posp_enquiry_data) {
            if (posp_enquiry_err) {
                res.json({"Status": "Fail", "Msg": posp_enquiry_err});
            } else {
                if (posp_enquiry_data.length > 0) {
                    res.json({"Status": "Success", "Msg": posp_enquiry_data});
                } else {
                    res.json({"Status": "Fail", "Msg": "No Records Found"});
                }
            }
        });
    } catch (e) {
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});
router.get('/get_leads_pending_status/:ss_id', function (req, res) {
    try {
        let ss_id = req.params && req.params.ss_id ? req.params.ss_id : "";
        if (ss_id !== "") {
            let today = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
            let toDayDate = today.split('-');
            let today_date = moment(new Date(toDayDate[0] - 0, toDayDate[1] - 0 - 1, toDayDate[2] - 0)).format("YYYY-MM-DD");
            let filter = {};
            filter['ss_id'] = ss_id - 0;
            filter['policy_expiry_date'] = {$gt: today_date};
            console.log(today_date);
            console.log(filter);
            //{"Created_On": {$gte: dateFrom, $lt: dateTo}}
            let leads = require('../models/leads');
            leads.find(filter, function (dbleadlist_err, dblead_data) {
                if (dbleadlist_err) {
                    res.json({'Status': 'Fail', 'Msg': dbleadlist_err});
                } else {
                    let count = dblead_data.length;
                    res.json({"Status": "Success", "Leads_Pending": count});
                }
            });
        } else {
            res.json({'Status': 'Fail', 'Msg': 'Ss_Id is missing.'});
        }

    } catch (e) {
        console.error(e.stack);
        res.json({'Msg': e.stack, 'Status': 'Fail'});
    }
});
function royalPolicyDownload(req, res, next) {
    try {
        let objRequest = req.body;
        let quoteId = objRequest.quoteId ? objRequest.quoteId : "";
        let proposerDob = objRequest.proposerDob ? objRequest.proposerDob : "";
        let expiryDate = objRequest.expiryDate ? objRequest.expiryDate : "";
        let Client = require('node-rest-client').Client;
        let client = new Client();
        let service_url = "https://www.royalsundaram.in/Services/Mailer/DownloadPdf?quoteId=" + quoteId + "&force=true&proposerDob=" + proposerDob + "&expiryDate=" + expiryDate;
        client.get(service_url, function (pdf_data, pdf_res) {
            console.error(pdf_data);
            req.body['pdf_response'] = pdf_data;
            return next();
        });
    } catch (e) {
        return next();
    }
}
function agent_details_pre(req, res, next) {
    var ss_id = 0;
    if (req.query.hasOwnProperty('ss_id') && req.query['ss_id'] > 0) {
        ss_id = req.query['ss_id'] - 0;
    } else {
        if (typeof req.body['ssid'] !== 'undefined' && req.body['ssid'] > 0) {
            ss_id = req.body['ssid'] - 0;
        }
    }

    if (req.params.hasOwnProperty('ss_id') && (req.params.ss_id - 0) > 0) {
        ss_id = req.params.ss_id - 0;
    }

    if (ss_id > 0) {
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id.toString(), {}, function (data, response) {
            if (data['status'] === 'SUCCESS') {
                req.agent = data;
            } else {
                //res.send('AGENT_NOT_EXIST<br>' + '<pre>' + JSON.stringify(req.query, undefined, 2) + '</pre>');
            }
            return next();
        });
    } else {
        return next();
    }
}

router.post('/assign_lead_by_erp_to_uid', LoadSession, function (req, res) {
    try {
        let posp_enquiry = require('../models/posp_enquiry');
        let posp_assigned_history = require('../models/posp_assigned_history');
        let objectRequest = req.body;

        posp_enquiry.find({"Posp_Enquiry_Id": {"$in": objectRequest.erp_data}}, function (err, fetch_values) {
            if (err) {
                res.json({"Status": "Fail", "Msg": err});
            } else {

                var user_fetched_data = fetch_values;
                var erp_array = [];
                let posp_lead_history = {};
                // res.json({"Status": "Fail", "Msg": fetch_values});
                for (var j = 0; j < user_fetched_data.length; j++) {
                    if ((objectRequest.erp_data).includes(user_fetched_data[j].Posp_Enquiry_Id.toString())) {
                        posp_lead_history = {
                            "Posp_Enquiry_Id": user_fetched_data[j].Posp_Enquiry_Id,
                            "mobile": user_fetched_data[j].mobile,
                            "name": user_fetched_data[j].name,
                            "pan": user_fetched_data[j].pan,
                            "aadhaar": user_fetched_data[j].aadhaar,
                            "last_assigned_by": user_fetched_data[j].last_assigned_by,
                            "last_assigned_to": objectRequest.to_ssid,
                            "last_assigned_on": user_fetched_data[j].last_assigned_on,
                            "Created_On": new Date(),
                            "Modified_On": new Date()
                        };
                        erp_array.push(posp_lead_history);
                    }
                }
                // var filter = {status:'active'}
                // var erp_array = user_fetched_data.reverse();
                console.log(erp_array);
                posp_assigned_history.insertMany(erp_array, function (err, updated_data) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        res.json({"Status": "Success", "Msg": updated_data});
                        console.log(updated_data);
                    }
                });

            }

        });
        posp_enquiry.updateMany({"Posp_Enquiry_Id": {"$in": objectRequest.erp_data}}, {"$set": {"last_assigned_to": objectRequest.to_ssid}}, function (ss_id_err, ss_id_data) {
            if (ss_id_err) {
                res.json({"Status": "Fail", "Msg": ss_id_err});
            } else {
                res.json({"Status": "Success", "Msg": ss_id_data});
            }
        });
    } catch (e) {
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});

router.post('/iib_pan_history', function (req, res) {
    var iib_activity = require('../models/iib_activitie');
    try {
        let objRequest = req.body;
        if (objRequest["Ss_Id"]) {
            iib_activity.findOne({Ss_Id: objRequest["Ss_Id"]}, function (err, iibactivitydata) {
                if (err) {
                    res.send({
                        status: "FAIL", msg: "error while finding data with Ss_Id " + objRequest["Ss_Id"], error: err.stack
                    });
                } else {
                    if (!iibactivitydata) {
                        let iib_activity_data = new iib_activity(objRequest);
                        iib_activity_data.save();
                        res.send({
                            status: 'SUCCESS',
                            iibactivitydata: objRequest
                        });
                    } else {
                        iib_activity.updateOne({Ss_Id: objRequest["Ss_Id"]}, {$set: objRequest}, function (err, updatedData) {
                            if (err) {
                                res.send({
                                    status: "FAIL", msg: "error while updating", error: err.stack
                                });
                            } else {
                                res.send({
                                    status: 'SUCCESS',
                                    msg: "Ss_Id already exists, So updation has been done on Ss_Id " + objRequest["Ss_Id"],
                                    pre_data: iibactivitydata,
                                    updated_data: objRequest
                                });
                            }
                        });
                    }
                }
            });
        } else {
            res.send({
                status: "FAIL", msg: "Empty data not allowed.."
            })
        }
    } catch (e) {
        res.send({
            status: "FAIL", error: e.stack
        })
    }
});
router.post('/royalsundaramMotor_request_check', function (req, res) {
    let Client = require('node-rest-client').Client;
    let client = new Client();
    var ObjRequest = req.body;
    let tmpdata = ObjRequest;
    try {
        console.error("royalsundaramMotor_request_check Line 1", tmpdata);
        let insurer_service_url = "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/CalculatePremium";
        var post_request_config = {
            data: tmpdata,
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            }
        };
        console.error("royalsundaramMotor_request_check Line 2", post_request_config.data);
        client.post(insurer_service_url, post_request_config, function (CalculatePremium_data, response) {
            res.json(CalculatePremium_data);
        });
    } catch (ex) {
        res.json(ex.stack);
    }
});
router.post('/car_info_lead', (req, res) => {
    try {
        let objectRequest = req.body;
        let Client = require('node-rest-client').Client;
        let client = new Client();
        let Product_Detail = "";
        let Location = "";
        let Expiry_Date = "";
        if ([1, 10, 12].indexOf(objectRequest['product_id']) > -1) {
            Product_Detail = "MANF-" + objectRequest['vehicle_manf_date'].split('-')[0] + '::' + objectRequest['vehicle_insurance_subtype'] + '::' + objectRequest['vehicle_full'].split("|")[0] + '::' + objectRequest['vehicle_full'].split("|")[1] + '::ID-' + objectRequest['vehicle_id'];
            Location = objectRequest['rto_full'].split("|")[0] + '::' + objectRequest['rto_full'].split("|")[1] + '::ID-' + objectRequest['rto_id'];
        } else if ([2].indexOf(objectRequest['Product_Id']) > -1) {
            Product_Detail = objectRequest['health_insurance_type'] + '|' + objectRequest['health_insurance_si'];
            Location = objectRequest['city_name'] + ',' + objectRequest['permanent_pincode'];
        } else if ([4].indexOf(objectRequest['Product_Id']) > -1) {
            Product_Detail = objectRequest['trip_type'] + '|' + objectRequest['travel_insurance_type'] + '|Member-' + objectRequest['member_count'];
            Location = objectRequest['travelling_to_area'];
        }
        if (objectRequest.policy_expiry_date) {
            Expiry_Date = moment(new Date(objectRequest['policy_expiry_date'])).format('D-MMM-YY');
        }
        ;
        var api_url = "https://policyboss.bitrix24.in/rest/2/fuiywb2evfxvo7b5/crm.deal.add.json" +
                "?FIELDS[CATEGORY_ID]=14" + //This is constant
                "&FIELDS[COMPANY_ID]=198" + //This is constant
                "&FIELDS[COMMENTS]=" +
                "&FIELDS[ASSIGNED_BY_ID]=" + (objectRequest.bitrix_id || "") +
                "&FIELDS[UF_CRM_1692251765623]=" + objectRequest.crn + //Pass CRN here
                "&FIELDS[UF_CRM_1692251780209]=" + //+ objectRequest.method_name+ //Pass ACTION_DETAILS here
                "&FIELDS[UF_CRM_1692251810427]=" + objectRequest.product_name + //Pass Product here
                "&FIELDS[UF_CRM_1692251906132]=" + objectRequest.owner_type + //Pass Owner Type here
                "&FIELDS[UF_CRM_1692251915886]=SEARCH" + //Pass STATUS here
                "&FIELDS[UF_CRM_1692251987184]=" + //Pass Progress here
                "&FIELDS[UF_CRM_1692252006332]=" + Product_Detail + //Pass Product details
                "&FIELDS[UF_CRM_1692252016612]=" + Location + //Pass Location
                "&FIELDS[UF_CRM_1692252030069]=" + (Expiry_Date || "") + //Pass Expiry Date
                "&FIELDS[UF_CRM_1692252131883]=" + (objectRequest.utm_source || "") + //Pass utm_source
                "&FIELDS[CONTACT_ID]=12" + //This is constant
                "&FIELDS[UF_CRM_1692959395577]=" + (objectRequest.customer_name || "") + //Pass customer name here
                "&FIELDS[UF_CRM_1692959520873] =" + (objectRequest.mobile || "") + //Pass customer's contact number here
                "&FIELDS[UF_CRM_1693205467749]=" + (objectRequest.quote_url || "");//Pass quotation link here;
        client.get(api_url, function (car_info_data, response) {
            var now = new Date();
            var bitrixObj_Log = {
                data: {
                    PB_CRN: objectRequest.crn,
                    Request: api_url,
                    Response: car_info_data,
                    Error: null,
                    Modified_On: now,
                    Created_On: now
                },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(config.environment.weburl + '/postservicecall/save/bitrix_data', bitrixObj_Log, function (bitrix_data, response) {
                if (bitrix_data.status === "SUCCESS") {
                    console.log('Bitrix Logs Saved');
                } else {
                    console.error('Bitrix Logs Error');
                }
            });
            res.json({"Status": "Success", "Msg": car_info_data});
        });
    } catch (e) {
        var now = new Date();
        var bitrixObj_Log = {
            data: {
                PB_CRN: objectRequest.crn,
                Request: api_url || "",
                Response: null,
                Error: e.stack,
                Modified_On: now,
                Created_On: now
            },
            headers: {
                "Content-Type": "application/json"
            }
        };
        client.post(config.environment.weburl + '/postservicecall/save/bitrix_data', bitrixObj_Log, function (bitrix_data, response) {
            if (bitrix_data.status === "SUCCESS") {
                console.log('Bitrix Logs Saved');
            } else {
                console.error('Bitrix Logs Error');
            }
        });
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});
router.post('/save/bitrix_data', function (req, res) {
    try {
        let objRequest = req.body;
        const bitrix_log = require('../models/bitrix_log');
        let bitrix_data = new bitrix_log(objRequest);
        bitrix_data.save();
        res.send({status: "SUCCESS"});
    } catch (e) {
        res.send({status: "FAIL", error: e.stack});
    }
});
router.post('/royalsundaram_wrapper_api_https', function (req, res) {
    req.body = JSON.parse(JSON.stringify(req.body));
    let ObjRequest = req.body;
    let method_type_class = req.query;
    let method_type = method_type_class['method_type'];
    let vehicle_class = method_type_class['vehicle_class'];
    let tmpdata = ObjRequest;
    let ObjServiceURL_gcv = {
        "Idv": "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/CalculatePremium",
        "Premium": "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/CalculatePremium",
        "Customer": "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/UpdateVehicleDetails",
        "Proposal": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/GProposalService"
    };
    let ObjServiceURL_pcv = {
        "Idv": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/CalculatePremium",
        "Premium": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/CalculatePremium",
        "Customer": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/UpdateVehicleDetails",
        "Proposal": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/GProposalService"
    };
    let service_url = "";
    service_url = (vehicle_class === "gcv") ? ObjServiceURL_gcv[method_type] : ObjServiceURL_pcv[method_type];
    let args = {
        data: JSON.stringify(tmpdata),
        headers: {
            "Content-Type": "application/json",
            'accept': '*/*',
            'Connection': "close"
        }
    };
    console.error('insurer_service_url', service_url);
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    let https = require('https');
    let url = require('url');
    let q = url.parse(service_url, true);
    let options = {
        protocol: q.protocol,
        hostname: q.host,
        method: 'POST',
        path: q.pathname,
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        }
    };
    let obj_royal_log = {
        "get": req.query,
        "post": req.body,
        "option": options,
        "response": "",
        "error": ""
    }
    let request_royal = https.request(options, (response_royal) => {
        let data_royal = '';
        console.error('RoyalSundaram wrapper LINE 1');
        response_royal.on('data', (chunk) => {
            data_royal = data_royal + chunk.toString();
        });

        response_royal.on('end', () => {
            let res_body = JSON.parse(data_royal);
            //console.error('RoyalSundaram wrapper LINE 2', body);
            obj_royal_log["response"] = res_body;
            res.json(obj_royal_log);
        });
    });

    request_royal.on('error', (error) => {
        obj_royal_log["error"] = error;
        res.json(obj_royal_log);
    });
    request_royal.write(JSON.stringify(ObjRequest));
    request_royal.end();
});
router.post('/royalsundaram_wrapper_api_client', function (req, res) {
    let ObjRequest = req.body;
    let method_type_class = req.query;
    let method_type = method_type_class['method_type'];
    let vehicle_class = method_type_class['vehicle_class'];
    let tmpdata = ObjRequest;
    let ObjServiceURL_gcv = {
        "Idv": "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/CalculatePremium",
        "Premium": "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/CalculatePremium",
        "Customer": "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/UpdateVehicleDetails",
        "Proposal": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/GProposalService"
    };
    let ObjServiceURL_pcv = {
        "Idv": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/CalculatePremium",
        "Premium": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/CalculatePremium",
        "Customer": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/UpdateVehicleDetails",
        "Proposal": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/GProposalService"
    };
    let service_url = "";
    service_url = vehicle_class === "gcv" ? ObjServiceURL_gcv[method_type] : ObjServiceURL_pcv[method_type];
    let args = {
        data: JSON.stringify(tmpdata),
        headers: {
            "Content-Type": "application/json",
            'accept': '*/*'
        }
    };
    console.error('insurer_service_url', service_url);
    let Client = require('node-rest-client').Client;
    let client = new Client();
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    client.post(service_url, args, function (data, response) {
        try {
            return res.send(data);
        } catch (e) {
            return res.send(e.stack);
        }
    });
});
router.post('/royalsundaram_wrapper_api_axios', function (req, res) {
    var ObjRequest = req.body;
    let method_type_class = req.query;
    var method_type = method_type_class['method_type'];
    var vehicle_class = method_type_class['vehicle_class'];
    var axios = require('axios');
    let tmpdata = ObjRequest;
    let ObjServiceURL_gcv = {
        "Idv": "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/CalculatePremium",
        "Premium": "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/CalculatePremium",
        "Customer": "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/UpdateVehicleDetails",
        "Proposal": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/GProposalService"
    };
    let ObjServiceURL_pcv = {
        "Idv": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/CalculatePremium",
        "Premium": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/CalculatePremium",
        "Customer": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/UpdateVehicleDetails",
        "Proposal": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/GProposalService"
    };
    let insurer_service_url = "";
    insurer_service_url = vehicle_class === "gcv" ? ObjServiceURL_gcv[method_type] : ObjServiceURL_pcv[method_type];
    var post_request_config = {
        method: 'post',
        url: insurer_service_url,
        headers: {
            "Content-Type": "application/json",
            'accept': '*/*'
        },
        data: tmpdata
    };
    axios(post_request_config)
            .then(function (response) {
                res.json(response.data);
            })
            .catch(function (error) {
                res.json(error);
            });

});
router.post('/royalsundaram_wrapper_api_request', function (req, res) {
    let ObjRequest = req.body;
    let method_type_class = req.query;
    let method_type = method_type_class['method_type'];
    let vehicle_class = method_type_class['vehicle_class'];
    let tmpdata = ObjRequest;
    let ObjServiceURL_gcv = {
        "Idv": "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/CalculatePremium",
        "Premium": "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/CalculatePremium",
        "Customer": "https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/UpdateVehicleDetails",
        "Proposal": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/GProposalService"
    };
    let ObjServiceURL_pcv = {
        "Idv": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/CalculatePremium",
        "Premium": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/CalculatePremium",
        "Customer": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/UpdateVehicleDetails",
        "Proposal": "https://dtcdocstag.royalsundaram.in/Services/Product/PassengerCarryingVehicle/GProposalService"
    };
    let service_url = "";
    service_url = vehicle_class === "gcv" ? ObjServiceURL_gcv[method_type] : ObjServiceURL_pcv[method_type];
    let args = {
        data: JSON.stringify(tmpdata),
        headers: {
            "Content-Type": "application/json",
            'accept': '*/*'
        }
    };
    console.error('insurer_service_url', service_url);
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    let request = require('request');
    let options = {
        'method': 'POST',
        'url': service_url,
        'headers': {
            "Content-Type": "application/json",
            'accept': '*/*'
        },
        body: JSON.stringify(tmpdata)
    };
    request(options, function (error, data) {
        if (error) {
            return res.send(error);
        } else {
            try {
                return res.send(data.body);
            } catch (e) {
                return res.send(e.stack);
            }
        }
    });
});
router.post('/onboarding/update_posp_details', function (req, res) {
    let posp_user = require('../models/posp_users.js');
    try {
        let User_Id = "";
        let tab_name = "";
        var posp_details = ["First_Name", "Middle_Name", "Last_Name", "Name_On_PAN", "Pan_No", "Aadhar", "Education", "Nominee_Relationship", "Birthdate", "DOB_On_PAN", "Name_On_Aadhar", "Bank_Account_No", "Ifsc_Code", "Name_as_in_Bank", "Nominee_Pan", "Nominee_Name_On_Pan", "Nominee_DOB_On_Pan", "Nominee_Name_as_in_Bank", "Nominee_Bank_Account_Number", "Nominee_Ifsc_Code", "Present_Add1", "Present_Add2", "Present_Add3", "Present_Pincode", "Present_City", "Present_State", "Permanant_Add1", "Permanant_Add2", "Permanant_Add3", "Permanant_Pincode", "Permanant_City", "Permanant_State"];
        var basic_fields = ["User_Id", "Mobile_Number", "Email_Id", "First_Name", "Middle_Name", "Last_Name", "Gender", "Agent_City", "Telephone_No", "Education", "Birthdate", "Father_Name", "Present_Add1", "Present_Add2", "Present_Add3", "Present_Landmark", "Present_State", "Present_City", "Present_Pincode", "Permanant_Add1", "Permanant_Add2", "Permanant_Add3", "Permanant_Landmark", "Permanant_State", "Permanant_City", "Reporting_Agent_Uid", "Reporting_Agent_Name", "Reporting_Email_ID", "Reporting_Mobile_Number"];
        var posp_fields = ["Pan_No", "Name_On_PAN", "DOB_On_PAN", "Aadhar", "Name_On_Aadhar", "Education", "Name_as_in_Bank", "Account_Type", "Bank_Account_No", "Ifsc_Code", "Micr_Code", "Bank_Name", "Bank_Branch"];
        var nom_fields = ["Nominee_First_Name", "Nominee_Middle_Name", "Nominee_Last_Name", "Nominee_Pan", "Nominee_Name_On_Pan", "Nominee_DOB_On_Pan", "Nominee_Aadhar", "Nominee_Relationship", "Nominee_Gender", "Nominee_Name_as_in_Bank", "Nominee_Account_Type", "Nominee_Bank_Account_Number", "Nominee_Ifsc_Code", "Nominee_Micr_Code", "Nominee_Bank_Name", "Nominee_Bank_Branch", "Nominee_Bank_City"];
        var dataFields = {"BASIC_INFO": basic_fields, "POSP_DETAILS": posp_fields, "NOMINEE_DETAILS": nom_fields, 'POSP': posp_details};
        var updatedObj = {};
        let objRequest = req.body.posp ? req.body.posp : {};
        console.log("objRequest", objRequest);
        if (Object.keys(objRequest).length > 0) {
            User_Id = objRequest.User_Id ? objRequest.User_Id : "";
            tab_name = objRequest.tab_name ? objRequest.tab_name : "";
            console.log(User_Id, tab_name);
            let fields_to_update = [];
            if (User_Id !== "") {
                if (objRequest.hasOwnProperty("bulk_update") && objRequest.bulk_update === "Yes") {
                    fields_to_update.push(dataFields["BASIC_INFO"], dataFields["POSP_DETAILS"], dataFields["NOMINEE_DETAILS"]);
                    for (let i = 0; i < 3; i++) {
                        fields_to_update[i].forEach((item) => {
                            if (objRequest[item]) {
                                updatedObj[item] = objRequest[item];
                            }
                        });
                    }
                    delete updatedObj["Reporting_Agent_Uid"];
                } else {
                    if (tab_name) {
                        fields_to_update = dataFields[tab_name];
                        fields_to_update.forEach((item) => {
                            if (objRequest[item]) {
                                updatedObj[item] = objRequest[item];
                            }
                        });
                    }
                }
                console.log(updatedObj);
                posp_user.update({'User_Id': User_Id}, {$set: updatedObj}, {runValidators: true}, function (err, numAffected) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        res.json({"Status": "Success", "Msg": 'POSP details updated successfully'});
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Unsufficient details to update data."});
            }
        } else {
            res.json({"Status": "Fail", "Msg": "Data not found."});
        }
    } catch (ex) {
        res.json({"Status": "Fail", "Msg": ex.stack});
    }
});
router.get('/fetchposps_enquiry_without_pagination', LoadSession, function (req, res, next) {

    try {
        var objRequestCore = {};
        var filter = {};
        let finalArr = {};
        var user_ss_id = req.obj_session.user.ss_id;
        var main_arr = [
            {"Ss_Id": 32178, "UID": 114960, "Name": "Rohitkumar Kureel"},
            {"Ss_Id": 12649, "UID": 112453, "Name": "Sachin Bhausaheb Gavali"},
            {"Ss_Id": 114128, "UID": 115451, "Name": "Chandan Rajeshwar Ram"},
            {"Ss_Id": 31444, "UID": 114860, "Name": "Aaradhya Ajay Kamble"},
            {"Ss_Id": 124053, "UID": 116462, "Name": "Sejal Anil Padwal"},
            {"Ss_Id": 126615, "UID": 116762, "Name": "Shubham Kundan Mahadik"},
            {"Ss_Id": 128895, "UID": 116956, "Name": "Aarti Nandlal Yadav"},
            {"Ss_Id": 130044, "UID": 117053, "Name": "Priti Shridhar Kadam"},
            {"Ss_Id": 130045, "UID": 117054, "Name": "Anzali Santosh Gupta"},
            {"Ss_Id": 130378, "UID": 117101, "Name": "Sanjayani Dattaram Budar"},
            {"Ss_Id": 130376, "UID": 117099, "Name": "Nehalaxmi Sudalai Moopanar"},
            {"Ss_Id": 120750, "UID": 116019, "Name": "Mahek Hakim Shaikh"},
            {"Ss_Id": 134876, "UID": 117933, "Name": "Shukla Jaya Dinesh"},
            {"Ss_Id": 134975, "UID": 117958, "Name": "Manali Deepak Gaikwad"},
            {"Ss_Id": 128509, "UID": 116922, "Name": "Sarita Maggan Chauhan"},
            {"Ss_Id": 136218, "UID": 118149, "Name": "Sana Imamali Qureshi"},
            {"Ss_Id": 134683, "UID": 117879, "Name": "Jyoti Subhash Kanojiya"},
            {"Ss_Id": 135141, "UID": 117987, "Name": "Renuka Balappa Jogi"},
            {"Ss_Id": 134457, "UID": 117860, "Name": "Sanjit Sanjeev More"},
            {"Ss_Id": 130637, "UID": 117137, "Name": "Amankumar Jagannath Prajapati"},
            {"Ss_Id": 134061, "UID": 117773, "Name": "Tehsin Afaque Shaikh"},
            {"Ss_Id": 131050, "UID": 117233, "Name": "Reshma Mohammad Mukuim Khan"},
            {"Ss_Id": 131045, "UID": 117228, "Name": "Ajit Kumar"},
            {"Ss_Id": 131044, "UID": 117227, "Name": "Yadav Ankit Laxmi Shankar"},
            {"Ss_Id": 131483, "UID": 117317, "Name": "Aditya Dinesh Hate"},
            {"Ss_Id": 135873, "UID": 118108, "Name": "Diwakar Gokul Bhagwat"},
            {"Ss_Id": 136124, "UID": 118130, "Name": "Priya Pradeep Poyrekar"},
            {"Ss_Id": 136822, "UID": 118246, "Name": "Priyanka Bindaram Baheliya"},
            {"Ss_Id": 136823, "UID": 118247, "Name": "Mohammed Sameer Shaikh"},
            {"Ss_Id": 131046, "UID": 117229, "Name": "Arbaz Malik Tehsildar"},
            {"Ss_Id": 131047, "UID": 117230, "Name": "Sabiya Khan"},
            {"Ss_Id": 131042, "UID": 117225, "Name": "Sarvesh Bajirao Kashid"},
            {"Ss_Id": 133312, "UID": 117636, "Name": "Varsha Manoj Bidlan"},
            {"Ss_Id": 136824, "UID": 118248, "Name": "Roshani Rajendra Giri"}
        ];

        for (let i = 0; i < main_arr.length; i++) {
            finalArr[main_arr[i].Ss_Id - 0] = {};
            finalArr[main_arr[i].Ss_Id]["UID"] = main_arr[i].UID - 0;
            finalArr[main_arr[i].Ss_Id]["Name"] = main_arr[i].Name;
        }
        if (req.query && req.query !== {}) {
            for (let k in req.query) {
                objRequestCore[k] = req.query[k];
            }
        }

        var today = moment().utcOffset("+05:30").startOf('Day');
        var fromDate = moment(objRequestCore.daterange_start_date === "" ? today : objRequestCore.daterange_start_date).format("YYYY-MM-D");
        var toDate = moment(objRequestCore.daterange_end_date === "" ? today : objRequestCore.daterange_end_date).format("YYYY-MM-D");

        var arrFrom = fromDate.split('-');
        var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);

        var arrTo = toDate.split('-');
        var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
        dateTo.setDate(dateTo.getDate() + 1);

        if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.ss_id === 8048) {
        } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
            let arr_ch_ssid = [];
            if (req.obj_session.hasOwnProperty('users_assigned')) {
                arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
            }
            arr_ch_ssid.push(req.obj_session.user.ss_id);
            channel = req.obj_session.user.role_detail.channel;
            filter['$or'] = [
                {'last_assigned_to': {$in: arr_ch_ssid}}
            ];
            console.log(arr_ch_ssid);
        } else {
            let arr_ssid = [];
            if (req.obj_session.hasOwnProperty('users_assigned')) {
                var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                arr_ssid = combine_arr.split(',').filter(Number).map(Number);
            }
            arr_ssid.push(req.obj_session.user.ss_id);
            filter['last_assigned_to'] = {$in: arr_ssid};
            console.log(arr_ssid);
            console.log(filter);
        }
        ;
        if (objRequestCore.type) {
            if (objRequestCore.type === "ss_id") {
                if (objRequestCore.search_byvalue && objRequestCore.search_byvalue !== "") {
                    filter["last_assigned_to"] = objRequestCore.search_byvalue - 0;
                }
            }
            if (objRequestCore.type === "name") {
                if (objRequestCore.search_byvalue && objRequestCore.search_byvalue !== "") {
                    filter["name"] = new RegExp(objRequestCore.search_byvalue, 'i');
                }
            }
        }
        if (objRequestCore.date_type) {
            if (objRequestCore.date_type === 'entry_date') {
                filter['Created_On'] = {$gte: dateFrom, $lt: dateTo};
            }
            if (objRequestCore.date_type === 'next_call_date') {
                filter['Next_Call_Date'] = {$gte: dateFrom, $lt: dateTo};
            }
            if (objRequestCore.date_type === 'signup_date') {
                filter['Signup_On'] = {$gte: dateFrom, $lt: dateTo};
            }
            if (objRequestCore.date_type === 'pos_date') {
                filter['Erpcode_On'] = {$gte: dateFrom, $lt: dateTo};
            }
        }
        if (objRequestCore.Recruitment_Status && typeof objRequestCore.Recruitment_Status !== "undefined") {
            if (objRequestCore.Recruitment_Status === 'SIGNUP_ONLY') {
                filter['Ss_Id'] = {"$exists": true};
                filter['Erp_Id'] = {"$exists": false};
            }
            if (objRequestCore.Recruitment_Status === 'POS_CODED') {
                filter['Erp_Id'] = {"$exists": true};
            }
        }
        console.log(dateFrom, dateTo);
        var posp_enquiries_lead = require('../models/posp_enquiry');
        posp_enquiries_lead.find(filter, function (err, user_data) {
            if (err) {
                res.json({"Status": "Fail", "Msg": err});
            } else {
                var db_excel_data = user_data;
                var excel = require('excel4node');
                var workbook = new excel.Workbook();
                var worksheet = workbook.addWorksheet('Sheet1');
                var ff_file_name = "All_Posp_Enquiry_Lead_List.xlsx";
                var ff_loc_path_portal = appRoot + "/tmp/posp_enquiry_excel/" + user_ss_id + '/' + ff_file_name;
                if (!fs.existsSync(appRoot + "/tmp/posp_enquiry_excel/" + user_ss_id)) {
                    fs.mkdirSync(appRoot + "/tmp/posp_enquiry_excel/" + user_ss_id);
                }
                if (fs.existsSync(appRoot + "/tmp/posp_enquiry_excel/" + user_ss_id + "/" + ff_file_name)) {
                    fs.unlinkSync(appRoot + "/tmp/posp_enquiry_excel/" + user_ss_id + "/" + ff_file_name);
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

                if (user_data.length > 0) {
                    worksheet.cell(1, 1).string('Enquiry_Id').style(styleh);
                    worksheet.cell(1, 2).string('Name').style(styleh);
                    worksheet.cell(1, 3).string('Mobile').style(styleh);
                    worksheet.cell(1, 4).string('Email').style(styleh);
                    worksheet.cell(1, 5).string('City_Name').style(styleh);
                    worksheet.cell(1, 6).string('PanCard_No').style(styleh);
                    worksheet.cell(1, 7).string('AadharCard_No').style(styleh);
                    worksheet.cell(1, 8).string('Last_Enquiry_On').style(styleh);
                    worksheet.cell(1, 9).string('Last_Assigned_By').style(styleh);
                    worksheet.cell(1, 10).string('Last_Assigned_To').style(styleh);
                    worksheet.cell(1, 11).string('Last_Assigned_On').style(styleh);
                    worksheet.cell(1, 12).string('Created_On').style(styleh);
                    worksheet.cell(1, 13).string('Disposition_Status').style(styleh);
                    worksheet.cell(1, 14).string('Sub_Status').style(styleh);
                    worksheet.cell(1, 15).string('Next_Call_Date').style(styleh);
                    worksheet.cell(1, 16).string('Disposition_On').style(styleh);



                    for (var rowcount in user_data) {
                        try {
                            Posp_lead_Data = user_data[rowcount];
                            rowcount = parseInt(rowcount);
                            worksheet.cell(rowcount + 2, 1).string(Posp_lead_Data.Posp_Enquiry_Id ? (Posp_lead_Data.Posp_Enquiry_Id).toString() : "");
                            worksheet.cell(rowcount + 2, 2).string(Posp_lead_Data.name ? Posp_lead_Data.name : "");
                            worksheet.cell(rowcount + 2, 3).string(Posp_lead_Data.mobile ? Posp_lead_Data.mobile : "");
                            worksheet.cell(rowcount + 2, 4).string(Posp_lead_Data.email ? Posp_lead_Data.email : "");
                            worksheet.cell(rowcount + 2, 5).string(Posp_lead_Data.city_name ? Posp_lead_Data.city_name : "");
                            worksheet.cell(rowcount + 2, 6).string(Posp_lead_Data.pan ? Posp_lead_Data.pan : "");
                            worksheet.cell(rowcount + 2, 7).string(Posp_lead_Data.aadhaar ? Posp_lead_Data.aadhaar.toString() : "");
                            worksheet.cell(rowcount + 2, 8).string(Posp_lead_Data.last_enquiry_on ? new Date(Posp_lead_Data.last_enquiry_on).toLocaleString() : "NA");
                            worksheet.cell(rowcount + 2, 9).string(Posp_lead_Data.last_assigned_by ? Posp_lead_Data.last_assigned_by : "NA");
                            worksheet.cell(rowcount + 2, 10).string(Posp_lead_Data.last_assigned_on ? new Date(Posp_lead_Data.last_assigned_on).toLocaleString() : "NA");
                            worksheet.cell(rowcount + 2, 11).string(finalArr[Posp_lead_Data.last_assigned_to] ? finalArr[Posp_lead_Data.last_assigned_to].Name + ' (' + finalArr[Posp_lead_Data.last_assigned_to].UID + ')' : "NA");
                            worksheet.cell(rowcount + 2, 12).string(Posp_lead_Data.Created_On ? new Date(Posp_lead_Data.Created_On).toLocaleString() : "NA");
                            worksheet.cell(rowcount + 2, 13).string(Posp_lead_Data.Disposition_Status ? Posp_lead_Data.Disposition_Status + " ( " + Posp_lead_Data.Sub_Status + " )" : "NA");
                            worksheet.cell(rowcount + 2, 14).string("NA");
                            worksheet.cell(rowcount + 2, 15).string(Posp_lead_Data.Next_Call_Date ? new Date(Posp_lead_Data.Next_Call_Date).toLocaleString() : "NA");
                            worksheet.cell(rowcount + 2, 16).string(Posp_lead_Data.Disposition_On ? new Date(Posp_lead_Data.Disposition_On).toLocaleString() : "NA");
                        } catch (e) {
                            res.json({'msg': 'error-' + e.message, 'data': user_data[rowcount]});
                        }
                    }

                    workbook.write(ff_loc_path_portal, function (err, stats) {
                        if (err) {
                            console.error(err);
                        } else {
//                                res.download(ff_loc_path_portal);
                            //res.json({"Status": "Success", "Msg": domain + "/posp_list/" + ssid + "/" + ff_file_name});
                            res.json({"Status": "Success", "Msg": config.environment.downloadurl + "/postservicecall/posp_enquiry_excel/" + user_ss_id + '/' + ff_file_name});
                        }
                    });
                } else {
                    worksheet.cell(1, 1).string('Enquiry_Id').style(styleh);
                    worksheet.cell(1, 2).string('Name').style(styleh);
                    worksheet.cell(1, 3).string('Mobile').style(styleh);
                    worksheet.cell(1, 4).string('Email').style(styleh);
                    worksheet.cell(1, 5).string('City_Name').style(styleh);
                    worksheet.cell(1, 6).string('PanCard_No').style(styleh);
                    worksheet.cell(1, 7).string('AadharCard_No').style(styleh);
                    worksheet.cell(1, 8).string('Last_Enquiry_On').style(styleh);
                    worksheet.cell(1, 9).string('Last_Assigned_By').style(styleh);
                    worksheet.cell(1, 10).string('Last_Assigned_To').style(styleh);
                    worksheet.cell(1, 11).string('Last_Assigned_On').style(styleh);
                    worksheet.cell(1, 12).string('Created_On').style(styleh);
                    worksheet.cell(1, 13).string('Disposition_Status').style(styleh);
                    worksheet.cell(1, 14).string('Sub_Status').style(styleh);
                    worksheet.cell(1, 15).string('Next_Call_Date').style(styleh);
                    worksheet.cell(1, 16).string('Disposition_On').style(styleh);

                    workbook.write(ff_loc_path_portal, function (err, stats) {
                        if (err) {
                            console.error(err);
                        } else {
//                                res.download(ff_loc_path_portal);
                            //res.json({"Status": "Success", "Msg": domain + "/posp_list/" + ssid + "/" + ff_file_name});
                            res.json({"Status": "Success", "Msg": config.environment.downloadurl + "/postservicecall/posp_enquiry_excel/" + user_ss_id + '/' + ff_file_name});
                        }
                    });
                }
            }

        });





    } catch (e) {
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});


router.get('/posp_enquiry_excel/:ssid/:filename', function (req, res) {
    try {
        let ssid = req.params.ssid;
        let filename = req.params.filename;
        if (ssid && filename && ssid !== "" && filename !== "") {
            res.download(appRoot + '/tmp/posp_enquiry_excel/' + ssid + '/' + filename);
        } else {
            res.json({"Status": "Fail", "Msg": "SsId or Filename is missing"});
        }

    } catch (e) {
        console.error("Error - /download_posp_excel", e.stack);
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});

router.post('/reassign_ssid_by_uid_to_uid', function (req, res) {
    try {
        var objectRequest_body = req.body;
        var posp_enquiries_model = require('../models/posp_enquiry');

        posp_enquiries_model.updateMany({'last_assigned_to': parseInt(objectRequest_body.from_ssid)}, {$set: {'last_assigned_to': parseInt(objectRequest_body.to_ssid)}}, function (err, data) {
            if (err) {
                res.json({"Status": "Fail", "Msg": err});
            } else {
                res.json({"Status": "Success", "Msg": data});
            }
        });
    } catch (e) {
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});
router.get('/get_vehicle_data/:vehicle_id', function (req, res) {
    try {
        const Vehicles = require('../models/vehicle');
        Vehicles.findOne({Vehicle_ID: req.params.vehicle_id}, function (err, dbVehicles) {
            if (err) {
                res.json({"Status": "Fail", "Msg": err});
            }
            if (dbVehicles) {
                res.json({"Status": "Success", "Msg": dbVehicles});
            } else {
                res.json({"Status": "Fail", "Msg": "No Data Found"});
            }
        });
    } catch (e) {
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});
router.post('/health_lead', function (req, res) {
    try {
        var ObjRequest = req.body;
        var health_lead = require('../models/health_lead');
        let lead_caller_arr = fs.readFileSync(appRoot + "/tmp/lead_assign_health.json", {encoding: 'utf8', flag: 'r'});
        let lead_caller_arr_shuffled = shuffle(JSON.parse(lead_caller_arr));
        var current_date = new Date();
        var health_lead_args = {
            'Created_On': current_date,
            'Modified_On': current_date,
            'Name': ObjRequest.name,
            'Date_Of_Birth': ObjRequest.dob,
            'Mobile': ObjRequest.mobile,
            'Email': ObjRequest.email,
            "City_Name": ObjRequest.city_name,
            "City_Id": ObjRequest.city_id,
            "State": ObjRequest.state,
            "Cover_Type": ObjRequest.cover_type,
            "Sum_Insured": ObjRequest.sum_insured,
            "Proposal_Type": ObjRequest.proposal_type,
            "Lead_Assigned_Uid": lead_caller_arr_shuffled[0]['uid'],
            "Lead_Assigned_Name": lead_caller_arr_shuffled[0]['name'],
            "Lead_Assigned_Ssid": lead_caller_arr_shuffled[0]['ss_id'],
            "Lead_Assigned_On": current_date
        };
        let health_lead_save = new health_lead(health_lead_args);
        health_lead_save.save(function (err, res1) {
            if (err) {
                console.error('health_lead_save', err);
                res.json({'Status': 'Fail', 'Msg': err});
            } else {
                res.json({'Status': 'Success', 'Msg': 'Lead Created Successfully'});
            }
        });
    } catch (e) {
        res.json({'Status': 'Fail', 'Msg': e.stack});
    }
});
router.post("/onboarding/zoop_pan_verification-NIU", function (req, res) {
    try {
        console.error("Nilam POSP Check LINE 0", req.body);
        req.body = JSON.parse(JSON.stringify(req.body));
        console.error("Nilam POSP Check LINE 1", req.body);
        var User_Id = req.body.User_Id;
        var Pan_Number = (req.body.Pan_Number).toString();
        var docType = req.body.Doc_Type ? req.body.Doc_Type : "";
        let zoop_url = "https://live.zoop.one/api/v1/in/identity/pan/lite";
        let api_key = "4RNA4S6-XWKM659-G7BR4MY-SHHTHHR";
        let api_appid = "61d8162ba81661001db34ab9";
        let zoop_doc_args = {
            data: {"data": {
                    "customer_pan_number": Pan_Number,
                    "consent": "Y",
                    "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
                }},
            headers: {
                'Content-Type': 'application/json',
                "api-key": api_key,
                "app-id": api_appid
            }
        };
        let api_log_args = {
            data: {
                'User_Id': User_Id,
                'Doc_Type': docType,
                'Api_Url': zoop_url,
                'Api_Request': zoop_doc_args
            },
            headers: {
                "Content-Type": "application/json"
            }
        };
        console.error("Nilam POSP Check LINE 2", api_log_args);
        client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
            console.error("Nilam POSP Check LINE 3", zoopdata);
            if (zoopdata && zoopdata["result"]) {
                api_log_args["data"]["Status"] = "Success";
            } else {
                api_log_args["data"]["Status"] = "Fail";
            }
            api_log_args["data"]["Api_Response"] = zoopdata;
            client.post(config.environment.weburl + '/onboarding/update_api_log', api_log_args, function (update_api_log_data, update_api_log_res) {
                console.error("Nilam POSP Check LINE 4", update_api_log_data);
                if (update_api_log_data.Status === "Success") {
                    res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                } else {
                    res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                }
            });
        });
    } catch (ex) {
        res.json({"Status": "Fail", "Msg": ex.stack});
    }
});
router.post('/fetch_healthEnquiry_lead', LoadSession, function (req, res, next) {
    try {
        let objRequest = req.body || {};
        var Base = require('../libs/Base');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            //select: 'Health_Lead_Id Name Date_Of_Birth Mobile Email City_Name State Last_Enquiry_On Last_Assigned_To Last_Assigned_By Last_Assigned_On Created_On Modified_On Disposition_Status Disposition_Sub_Status Next_Call_Date Disposition_On',
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
        console.error("fetch_healthEnquiry_lead - objRequest - ", objRequest);
        /*
         if (objRequest.hasOwnProperty('search_by')) {
         if (objRequest["search_by"] === "ss_id") {
         objRequest["search_byvalue"] = (objRequest.hasOwnProperty("search_byvalue") && objRequest["search_byvalue"] !== "") ? objRequest["search_byvalue"] : "";
         filter["last_assigned_to"] = new RegExp(objRequest["search_byvalue"], 'i');
         }
         }
         */
        if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
        } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
            let arr_ch_ssid = [];
            if (req.obj_session.hasOwnProperty('users_assigned')) {
                arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
            }
            arr_ch_ssid.push(req.obj_session.user.ss_id);
            channel = req.obj_session.user.role_detail.channel;
            filter['$or'] = [
                {'Lead_Assigned_Ssid': {$in: arr_ch_ssid}}
            ];
        } else {
            let arr_ssid = [];
            if (req.obj_session.hasOwnProperty('users_assigned')) {
                var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                arr_ssid = combine_arr.split(',').filter(Number).map(Number);
            }
            arr_ssid.push(req.obj_session.user.ss_id);
            filter['Lead_Assigned_Ssid'] = {$in: arr_ssid};
        }
        ;
        let health_lead = require('../models/health_lead');
        health_lead.paginate(filter, optionPaginate).then(function (dbHealthLeads) {
            res.json(dbHealthLeads);
        });
    } catch (e) {
        console.error(e);
        res.json({'Msg': e.stack, 'Status': 'fail'});
    }
});
router.get('/user_disposition_history_by_enquiryId', function (req, res) {
    var user_Disposition = require('../models/posp_disposition');
    user_Disposition.aggregate([{$group: {_id: "$Disposition_Id", connected: {$sum: {$cond: [{$eq: ["$Status", "Connected"]}, 1, 0]}}, notConnected: {$sum: {$cond: [{$eq: ["$Status", "Not Connected"]}, 1, 0]}}}}, {$addFields: {totalCount: {$add: ["$connected", "$notConnected"]}}}], function (err, user_data_res) {
        if (!err) {
            if (user_data_res.length > 0) {
                res.json({"Status": 'Success', "Data": user_data_res});
            } else {
                res.json({"Status": 'Fail', "Msg": "No Record Found."});
            }
        }
    });
});
router.post('/healthlead_user_disposition_save', function (req, res) {
    try {
        var user_disposition = require('../models/posp_disposition'); //change to posp_disposition while giving on live
        var health_lead = require('../models/health_lead');
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
                    Disposition_Sub_Status: fields["dsp_substatus"],
                    Disposition_On: new Date(),
                    Next_Call_Date: fields["Next_Call_Date"]
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
                    //res.json({'Msg': 'Success'});
                    health_lead.update({Health_Lead_Id: parseInt(arg.Disposition_Id)}, {$set: updated_arg}, function (err, dblmsData) {
                        if (err) {
                            res.json({'Msg': err, 'Status': 'error'});
                        } else {
                            res.json({'Msg': 'Success', 'Status': 'Success'});
                        }
                    });
                });
            } catch (e) {
                res.json({"Status": "Error", "Msg": e.stack});
            }
        });
    } catch (e) {
        res.json({"Status": "Error", "Msg": e.stack});
    }
});
router.get('/get_user_disposition_data/:id', function (req, res) {
    try {
        var id = parseInt(req.params.id);
        var user_disposition = require('../models/posp_disposition');//change to posp_disposition on live
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
router.post('/calculatePayout', function (req, res) {
    try {
        let objRequest = req.body || {};
        var User_Data_Id = objRequest['udid'] - 0;
        var request = require('request');
        var Client = require('node-rest-client').Client;
        var client = new Client();
        let payout_model = require('../models/payout');
        let payout_data = new payout_model();
        var crn;
        const insurer_name = {
            1: "Bajaj Allianz",
            3: "Cholamandalam",
            4: "Future Generali",
            44: "Go Digit",
            5: "HDFC ERGO",
            6: "ICICI Lombard",
            7: "IFFCO Tokio",
            30: "Kotak Mahindra",
            33: "Liberty",
            35: "Magma HDI",
            8: "National",
            12: "New India",
            13: "Oriental",
            9: "Reliance",
            10: "Royal Sundaram",
            17: "SBI",
            18: "Shriram",
            11: "TATA AIG",
            14: "United",
            19: "Universal Sompo",
            46: "Zuno",
            45: "Acko",
            16: "Raheja"
        };
        const product_sub_category_obj = {
            "GCV 4 WHEELERS - Comprehensive": 9,
            "GCV 3 WHEELERS - Comprehensive": 10,
            "PCV 3 WHEELERS - Comprehensive": 11,
            "GCV 4 WHEELERS - STP": 24,
            "GCV 3 WHEELERS - STP": 25,
            "PCV 3 WHEELERS - STP": 26
        };
        client.get(config.environment.weburl + '/user_datas/view/' + User_Data_Id, function (data, err) {
            if (data.length > 0) {
                client.get("https://origin-cdnh.policyboss.com/website/UI22/json/car-insurance/payout.json", function (admin_user_data, admin_user_err) {
                    try {
                        let admin_user_ss_id = admin_user_data.ss_id || [];
                        data = data['0'];
                        crn = data.PB_CRN;
                        var plan = "Comprehensive";
                        if (data['Premium_Request']['vehicle_insurance_subtype'].includes("CH") && !(data['Premium_Request']['vehicle_insurance_subtype'].includes("0CH"))) {
                            plan = "Comprehensive";
                        } else if (data['Premium_Request']['vehicle_insurance_subtype'].includes("0CH")) {
                            plan = "STP";
                        }
                        var nil_dep = false;
                        var engine_protect = false;
                        var premium_od = 0;
                        var premium_add_on = 0;
                        var premium_tp = 0;
                        var tp_cng_lpg = 0;
                        var tp_cover_owner_driver_pa = 0;
                        var service_tax = 0;
                        var final_premium = 0;
                        if (data.Addon_Request && data.Addon_Request.addon_standalone) {
                            nil_dep = data.Addon_Request.addon_standalone.addon_zero_dep_cover && data.Addon_Request.addon_standalone.addon_zero_dep_cover === "yes";
                            engine_protect = data.Addon_Request.addon_standalone.addon_engine_protector_cover && data.Addon_Request.addon_standalone.addon_engine_protector_cover === "yes";
                        }
                        if (data.Premium_List && data.Premium_List.Response && data.Premium_List.Response.length > 1) {
                            for (var i = 0; i < data.Premium_List.Response.length; i++) {
                                if (data.Premium_List.Response[i]["Insurer_Id"] == objRequest['insurer_id'] && data.Premium_List.Response[i]["Premium_Breakup"]) {
                                    const premiumBreakup = data.Premium_List.Response[i]["Premium_Breakup"];
                                    premium_od = premiumBreakup["own_damage"]["od_final_premium"].toFixed(2);
                                    premium_tp = premiumBreakup["liability"]["tp_final_premium"].toFixed(2);
                                    tp_cng_lpg = premiumBreakup["liability"]["tp_cng_lpg"].toFixed(2);
                                    tp_cover_owner_driver_pa = premiumBreakup["liability"]["tp_cover_owner_driver_pa"].toFixed(2);
                                    service_tax = premiumBreakup["service_tax"].toFixed(2);
                                    final_premium = premiumBreakup["final_premium"].toFixed(2);
                                    if (data.Addon_Request && Object.keys(data.Addon_Request.addon_standalone).length > 0) {
                                        for (var h = 0; h < Object.keys(data.Addon_Request.addon_standalone).length; h++) {
                                            const addonKey = Object.keys(data.Addon_Request.addon_standalone)[h];
                                            if (data.Premium_List.Response[i]["Addon_List"][addonKey]) {
                                                premium_add_on += data.Premium_List.Response[i]["Addon_List"][addonKey];
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        var pos_agent = 1;
                const product_sub_category = product_sub_category_obj[`${data['Premium_Request']["vehicle_class"].toUpperCase()} ${data['Master_Details']['vehicle']['Insurer_Vehicle_Insurer_Segmant']} - ${plan}`] || product_sub_category_obj[`${data['Premium_Request']["vehicle_class"].toUpperCase()} ${data['Master_Details']['vehicle']['Number_of_wheels']} WHEELERS - ${plan}`];
                        var agent_id = data['Premium_List']['Summary']['Request_Core']['posp_erp_id'] || data['Premium_List']['Summary']['Request_Core']['posp_reporting_agent_uid'];
                        if (agent_id == 0) {
                            pos_agent = 4;
                        }
                        var suffix = "0";
                        for (var z = 1; z < (agent_id).toString().length - 1; z++) {
                            suffix += 0;
                        }
                        agent_id = agent_id ? ((agent_id.toString())[0] + suffix) : undefined;
                        const req_obj = {
                            "requester_code": "HZN",
                            "lead_entry_id": data.PB_CRN,
                            "agent_id": agent_id, //"616548",
                            "pos_product": false,
                            "pos_agent": pos_agent,
                            "risk_start_date": data["Premium_List"]["Summary"]["Request_Product"]["policy_start_date"], //"2023-08-30",
                            "payment_platform": 2,
                            "policy_no": "0",
                            "insurer_vertical": "Agency",
                            "insurer_name": insurer_name[objRequest['insurer_id']], //"HDFC ERGO",
                    "product_sub_category": product_sub_category, //9,
                            "rto_code": data['Master_Details']['rto']['VehicleCity_RTOCode'], //"MH02",
                            "manufacturing_year": data['Premium_Request']['vehicle_manf_date'].split("-")[0], //2020,
                            "registration_date": data['Premium_Request']['vehicle_registration_date'], //"2019-01-01",
                            "make": data['Master_Details']["vehicle"]["Make_Name"], //"AUDI",
                            "model": data['Master_Details']["vehicle"]["Model_Name"], //"A4",
                            "fuel": data['Master_Details']["vehicle"]["Fuel_Name"], //"Petrol",
                            "cc_kw_gvw": data['Master_Details']["vehicle"]["Gross_Vehicle_Weight"], //"1590",
                            "seating_capacity": data['Master_Details']["vehicle"]["Seating_Capacity"], //3,
                            "ncb": data['Premium_Request']["vehicle_ncb_current"], //25,
                            "pa_owner_driver": data['Premium_Request']["is_pa_od"] === "yes" ? true : false, //true,
                            "nil_dep": nil_dep, //false,
                            "engine_protect": engine_protect, //false,
                            "tariff_discount": 0, //60,
                            "premium_od": premium_od, //"22708.00",
                            "premium_add_on": premium_add_on.toFixed(2), //"18103.00",
                            "premium_tp": premium_tp, //"7890.00",
                            "premium_cng": tp_cng_lpg, //"0.00",
                            "premium_pa_owner_driver": tp_cover_owner_driver_pa, //"375.00",
                            "premium_pa_passenger": "0.00",
                            "premium_others": "0.00", //"50.00",
                            "premium_tax": service_tax, //"1499.00",
                            "premium_total": final_premium//"48157.00"
                        };
                        const options = {
                            'method': 'POST',
                            'url': 'http://pbnext.policyboss.com/api/motor-payout/',
                            'headers': {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(req_obj)
                        };
                        let valid_payout_call = false;

                        if (data.Master_Details && data.Master_Details.agent && data.Master_Details.agent.HR && data.Master_Details.agent.HR.Vertical && data.Master_Details.agent.HR.Vertical.includes("POSP")) {
                            valid_payout_call = true;
                        }
                        if (data.Premium_Request && data.Premium_Request.ss_id && (admin_user_ss_id.indexOf(data.Premium_Request.ss_id) > -1)) {
                            valid_payout_call = true;
                        }
                        if (data.Premium_Request && data.Premium_Request.ss_id && ([1, 10].indexOf(data.Premium_Request.product_id) > -1) && data.Premium_Request.is_posp === "yes") {
                            if (data.Premium_Request && data.Premium_Request.vehicle_insurance_subtype && (["1CH_0TP", "1OD_0TP", "0CH_1TP"].indexOf(data.Premium_Request.vehicle_insurance_subtype) > -1)) {
                                valid_payout_call = true;
                            }
                        }
                        if (valid_payout_call) {
                            request(options, function (error, response) {
                                let response_obj;
                                if (error) {
                                    console.error(error);
                                    response_obj = {"Status": "Fail", "Msg": error, Request: req_obj, Response: {}};
                                } else {
                                    var Msg = JSON.parse(response.body);
                                    if (Msg.payable_rate) {
                                        let Payout = Msg.payable_rate + "% on " + Msg.od_or_net;
                                        response_obj = {"Status": "Success", Payout: Payout, Request: req_obj, Response: Msg};
                                    } else {
                                        response_obj = {"Status": "Fail", "Msg": Msg, Request: req_obj, Response: Msg};
                                    }
                                }
                                try {
                                    const logFileName = "payout_log_" + moment().format("YYYY-MM-DD");
                                    const logRequest = {
                                        Request: req_obj,
                                        Response: Msg,
                                        Date: moment().format("YYYY-MM-DD HH:mm:ss"),
                                        PB_CRN: crn
                                    };
                                    fs.appendFile(appRoot + "/tmp/log/" + logFileName, "--------------------------------" + JSON.stringify(logRequest, null, 2) + "\n", 'utf8');
                                } catch (err) {
                                    console.error('calculatePayout', err.stack);
                                }
                                res.json(response_obj);
                            });
                        } else {
                            res.json({"Status": "Fail", "Msg": "Access denied for Payout API Call"});
                        }
                    } catch (e) {
                        res.json({"Status": "Fail", "Msg": e.stack});
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "No data found"});
            }
        });
    } catch (e) {
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});

router.post('/calculatePayoutCarTw', function (req, res) {
    try {
        let request = require('request');
        let insurer_name = {
            1: "BAJAJ ALLIANZ GENERAL INSURANCE CO LTD",
            3: "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LTD",
            4: "FUTURE GENERALI INDIA INSURANCE COMPANY LTD",
            44: "GO DIGIT GENERAL INSURANCE LTD",
            5: "HDFC ERGO GENERAL INSURANCE CO LTD",
            6: "ICICI LOMBARD GENERAL INSURANCE CO LTD",
            7: "IFFCO-TOKIO GENERAL INSURANCE CO LTD",
            30: "KOTAK MAHINDRA GENERAL INSURANCE CO LTD",
            33: "LIBERTY GENERAL INSURANCE LTD",
            35: "MAGMA HDI GENERAL INSURANCE CO LTD",
            8: "NATIONAL INSURANCE CO LTD",
            12: "THE NEW INDIA ASSURANCE CO LTD",
            13: "THE ORIENTAL INSURANCE CO LTD",
            9: "RELIANCE GENERAL INSURANCE CO LTD",
            10: "ROYAL SUNDARAM GENERAL INSURANCE COMPANY LIMITED",
            17: "SBI GENERAL INSURANCE CO LTD",
            18: "SHRIRAM GENERAL INSURANCE COMPANY LTD",
            11: "TATA AIG GENERAL INSURANCE CO LTD",
            14: "UNITED INDIA INSURANCE CO LTD",
            19: "UNIVERSAL SOMPO GENERAL INSURANCE CO LTD",
            46: "ZUNO GENERAL INSURANCE LTD",
            45: "ACKO GENERAL INSURANCE LIMITED",
            16: "RAHEJA QBE GENERAL INSURANCE CO LTD"
        };
        let plan_obj = {
            '1CH_0TP': '1+1',
            '1CH_2TP': '1+3',
            '0CH_1TP': 'STP',
            '1CH_4TP': '1+5',
            '1OD_0TP': 'SAOD'
        };
        let objRequest = req.body || {};
        let User_Data_Id = objRequest['udid'] - 0;
        let response_obj;
        let crn;
        let payout_model = require('../models/payout');
        let payout_data = new payout_model();
        let getOptions = {
            'method': 'GET',
            'url': config.environment.weburl + '/user_datas/view/' + User_Data_Id,
            'headers': {
            }
        };
        let product_id;
        let product_name = {
            1: 'CAR',
            10: 'TW',
            12: 'CV'
        };
        let Payout;
        let final_premium;
        let vehicle_insurance_subtype;

        request(getOptions, function (err, data) {
            try {
                if (data && JSON.parse(data.body).length > 0) {
                    client.get("https://origin-cdnh.policyboss.com/website/UI22/json/car-insurance/payout.json", function (admin_user_data, admin_user_err) {
                        try {
                            let admin_user_ss_id = admin_user_data.ss_id || [];
                            data = JSON.parse(data.body)['0'];
                            crn = data.PB_CRN;
                            vehicle_insurance_subtype = data['Premium_Request']['vehicle_insurance_subtype'];
                            var plan = plan_obj[vehicle_insurance_subtype];
                            var premium_od = 0;
                            var premium_add_on = 0;
                            var premium_tp = 0;
                            var tariff = 0;
                            let isNcbApplied = true;
                            let isCpaApplied = true;
                            let isZeroDipApplied = false;
                            if (data.Premium_List && data.Premium_List.Response && data.Premium_List.Response.length > 1) {
                                for (var i = 0; i < data.Premium_List.Response.length; i++) {
                                    if (data.Premium_List.Response[i]["Insurer_Id"] == objRequest['insurer_id'] && data.Premium_List.Response[i]["Premium_Breakup"]) {
                                        let premiumBreakup = data.Premium_List.Response[i]["Premium_Breakup"];
                                        final_premium = premiumBreakup['final_premium'];
                                        let premiumRate = data.Premium_List.Response[i]["Premium_Rate"];
                                        premium_od = premiumBreakup["own_damage"]["od_final_premium"].toFixed(2);
                                        premium_tp = premiumBreakup["liability"]["tp_final_premium"].toFixed(2);
                                        isNcbApplied = premiumBreakup.own_damage && premiumBreakup.own_damage.od_disc_ncb > 0 ? false : true;
                                        isCpaApplied = premiumBreakup.liability && premiumBreakup.liability.tp_cover_owner_driver_pa > 0 ? false : true;
                                        try {
                                            if (data.Premium_List.Response[i]["Addon_List"] && data.Premium_List.Response[i]["Addon_List"].addon_zero_dep_cover && data.Premium_List.Response[i]["Addon_List"].addon_zero_dep_cover > 0) {
                                                isZeroDipApplied = true;
                                            }
                                        } catch (e) {
                                            console.error("Error in calculatePayoutCarTw isZeroDipApplied", e.stack);
                                        }
                                        /*if (premiumRate && premiumRate["own_damage"] && premiumRate["own_damage"]["pb_od_disc"]) {
                                         tariff = premiumRate["own_damage"]["pb_od_disc"].toFixed(2);
                                         }*/
                                        if (data.Addon_Request && data.Addon_Request.addon_standalone && Object.keys(data.Addon_Request.addon_standalone).length > 0) {
                                            for (var h = 0; h < Object.keys(data.Addon_Request.addon_standalone).length; h++) {
                                                const addonKey = Object.keys(data.Addon_Request.addon_standalone)[h];
                                                if (data.Premium_List.Response[i]["Addon_List"] && data.Premium_List.Response[i]["Addon_List"][addonKey]) {
                                                    premium_add_on += data.Premium_List.Response[i]["Addon_List"][addonKey];
                                                }
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                            let fuel = (data['Master_Details'] && data['Master_Details']["vehicle"] && data['Master_Details']["vehicle"]["Fuel_Name"]) ? data['Master_Details']["vehicle"]["Fuel_Name"] : "";
                            let vehicle_cc = Math.round(data['Master_Details']["vehicle"]["Cubic_Capacity"] - 0);
                            let product_sub_type;
                            product_id = data['Premium_Request']["product_id"];
                            if (product_id == 1) {
                                product_sub_type = 'Car';
                            } else if (product_id == 10) {
                                product_sub_type = data['Master_Details']["vehicle"]["Vehicle_Segmant"] === "Scooter" ? "Scooter" : "Bike";
                            } else if (product_id == 12) {
                                product_sub_type = 'COMMERCIAL';
                                if (data['Master_Details']["vehicle"]["Product_Type"] && data['Master_Details']["vehicle"]["Product_Type"].toUpperCase() === "GCV") {
                                    vehicle_cc = Math.round(data['Master_Details']["vehicle"]["Gross_Vehicle_Weight"] - 0);
                                }
                            }

                            payout_model.findOne({User_Data_Id: User_Data_Id, Insurer_Id: objRequest['insurer_id'], Status: "Success", Call_At: objRequest.Call_At, "Request.addonpremium": Math.round(premium_add_on)}).sort({_id: -1}).exec((err, db_data) => {
                                if (err) {
                                    console.error('payout', err);
                                }
                                if (db_data && db_data['_doc']) {
                                    db_data = db_data['_doc'];
                                }
                                if (db_data && objRequest.Call_At !== "PROPOSAL") {
                                    let payout_amount = db_data && db_data.Point ? db_data['Point'] : 0;
                                    response_obj = {
                                        "Status": "Success", 
                                        "Payout": payout_amount,
                                        "calculated_payin_amount": db_data.Payin_Amount,
                                        "calculated_payout_percentage": db_data.Payout_Percentage,
                                        "calculated_payin_percentage": db_data.Payin_Percentage
//                                        Request: db_data['Request'], 
//                                        Response: db_data['Response']
                                    };
                                    if(objRequest.Call_At === "QUOTE")
                                        response_obj.Quote_Payout_Id = db_data.Payout_Id;
                                    if(objRequest.Call_At === "PROPOSAL"){
                                        response_obj.Proposal_Payout_Id = db_data.Payout_Id;
                                        response_obj.Quote_Payout_Id = db_data.Quote_Payout_Id;
                                    }
                                    res.json(response_obj);
                                } else {
                                    let req_obj = {
                                        "insurance_company": insurer_name[objRequest['insurer_id']], //"FUTURE GENERALI INDIA INSURANCE COMPANY LTD",
                                        "rto": data['Master_Details']['rto']['VehicleCity_RTOCode'], //"MH01",
                                        "yearOfMake": data['Premium_Request']['vehicle_manf_date'].split("-")[0] - 0, //2023,
                                        "vehicle_cc": vehicle_cc, //125,
                                        "tarriff": Math.round(tariff - 0 || 0),
                                        "make_model": data['Master_Details']["vehicle"]["Make_Name"] + " " + data['Master_Details']["vehicle"]["Model_Name"], //hero honda splendor",
                                        "fuel_type": fuel.slice(0, 1).toUpperCase() + fuel.slice(1).toLowerCase(), //"Petrol",
                                        "policy_type": plan, //"1+1",
                                        "product_name": product_id == 10 ? "Two Wheeler" : "Motor", //"Two Wheeler",
                                        "product_sub_type": product_sub_type,
                                        "odpremium": Math.round(premium_od - 0 || 0), //3714,
                                        "addonpremium": Math.round(premium_add_on - 0 || 0), //28885,
                                        "tppremium": Math.round(premium_tp - 0 || 0), //257
                                        "isNcbApplied": isNcbApplied,
                                        "isCpaApplied": isCpaApplied,
                                        "isZeroDipApplied": isZeroDipApplied
                                    };
                                    let options = {
                                        'method': 'POST',
                                        'url': config.environment.payout_url, //'http://pbgridapis-backend.ap-south-1.elasticbeanstalk.com/api/payout',
                                        'headers': {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(req_obj)
                                    };
                                    let valid_payout_call = false;
                                    let allowed_policy_type = admin_user_data.policy_type && admin_user_data.policy_type[product_id] || [];
                                    if (data.Master_Details && data.Master_Details.agent && data.Master_Details.agent.HR && data.Master_Details.agent.HR.Vertical && data.Master_Details.agent.HR.Vertical.includes("POSP")) {
                                        if (data.Premium_Request && data.Premium_Request.vehicle_insurance_subtype && (allowed_policy_type.indexOf(data.Premium_Request.vehicle_insurance_subtype) > -1)) {
                                            valid_payout_call = true;
                                        }
                                    }
                                    if (data.Premium_Request && data.Premium_Request.ss_id && (admin_user_ss_id.indexOf(data.Premium_Request.ss_id) > -1)) {
                                        valid_payout_call = true;
                                    }
                                    if (data.Premium_Request && data.Premium_Request.ss_id && data.Premium_Request.is_posp === "yes") {
                                        if (data.Premium_Request && data.Premium_Request.vehicle_insurance_subtype && (allowed_policy_type.indexOf(data.Premium_Request.vehicle_insurance_subtype) > -1)) {
                                            valid_payout_call = true;
                                        }
                                    }
									if(data.Premium_Request && data.Premium_Request.ss_id && data.Premium_Request.is_posp === "yes" && data.Premium_Request.posp_erp_id && data.Premium_Request.posp_erp_id.toString()[0] == 9)
									{
										valid_payout_call = false;
									}
                                    if (valid_payout_call && plan) {
                                        request(options, function (error, response) {
                                            if (error) {
                                                console.error(error);
                                                response_obj = {"Status": "Fail",
                                                    "Msg": error
//                                                    Request: req_obj, 
//                                                    Response: {}
                                                };
                                            } else {
                                                var Msg = JSON.parse(response.body);
                                                if (Msg.status && Msg.status === true && Msg.data && Msg.data.hasOwnProperty("calculated_payout_amount") && Msg.data.calculated_payout_amount > -1) {
                                                    Payout = Msg.data.calculated_payout_amount;
                                                    response_obj = {
                                                        "Status": "Success",
                                                        "Payout": Payout,
                                                        "calculated_payin_amount": Msg.data.calculated_payin_amount,
                                                        "calculated_payout_percentage": Msg.data.calculated_payout_percentage,
                                                        "calculated_payin_percentage": Msg.data.calculated_payin_percentage
//                                                        Request: req_obj, 
//                                                        Response: Msg
                                                    };
                                                } else {
                                                    response_obj = {
                                                        "Status": "Fail",
                                                        "Msg": Msg
//                                                        Request: req_obj, 
//                                                        Response: Msg
                                                    };
                                                }
                                            }
                                            try {
                                                let logFileName = `payout_log_${moment().format("YYYY-MM-DD")}`;
                                                let logRequest = {
                                                    "Request": req_obj,
                                                    "Response": Msg,
                                                    "Date": moment().format("YYYY-MM-DD HH:mm:ss"),
                                                    "PB_CRN": crn,
                                                    "UDID": User_Data_Id,
                                                    "Call_At": objRequest.Call_At
                                                };
                                                fs.appendFile(appRoot + "/tmp/log/" + logFileName, "--------------------------------" + JSON.stringify(logRequest, null, 2) + "\n", 'utf8');
                                            } catch (err) {
                                                console.error('calculatePayout', err.stack);
                                            }
                                            payout_data.Product_Id = product_id - 0;
                                            payout_data.PB_CRN = data.PB_CRN - 0;
                                            payout_data.User_Data_Id = objRequest.udid - 0;
                                            payout_data.Insurer_Id = objRequest.insurer_id - 0;
                                            payout_data.Created_On = new Date();
                                            payout_data.Request = req_obj;
                                            payout_data.Point = Msg && Msg.data && Msg.data.calculated_payout_amount ? Msg.data.calculated_payout_amount : 0;
                                            payout_data.Status = response_obj.Status;
                                            payout_data.Response = Msg;
                                            payout_data.Insurance_Company = req_obj.insurance_company;
                                            payout_data.Rto = req_obj.rto;
                                            payout_data.YearOfMake = req_obj.yearOfMake;
                                            payout_data.Vehicle_Cc = req_obj.vehicle_cc;
                                            payout_data.Tarriff = req_obj.tarriff;
                                            payout_data.Make_Model = req_obj.make_model;
                                            payout_data.Fuel_Type = req_obj.fuel_type;
                                            payout_data.Policy_Type = req_obj.policy_type;
                                            payout_data.Product_Name = req_obj.product_name;
                                            payout_data.Product_Sub_Type = req_obj.product_sub_type;
                                            payout_data.Odpremium = req_obj.odpremium;
                                            payout_data.Addonpremium = req_obj.addonpremium;
                                            payout_data.Tppremium = req_obj.tppremium;
                                            payout_data.Call_At = objRequest.Call_At;
                                            payout_data.Is_NCB_Applied = isNcbApplied;
                                            payout_data.Is_CPA_Applied = isCpaApplied;
                                            payout_data.Is_ZD_Applied = isZeroDipApplied;
                                            payout_data.Ss_Id = objRequest.ss_id || (data && data.Premium_Request && data.Premium_Request.ss_id ? data.Premium_Request.ss_id : 0);
                                            payout_data.Payin_Amount = Msg && Msg.data && Msg.data.calculated_payin_amount ? Msg.data.calculated_payin_amount : 0;
                                            payout_data.Payout_Percentage = Msg && Msg.data && Msg.data.calculated_payout_percentage ? Msg.data.calculated_payout_percentage : 0;
                                            payout_data.Payin_Percentage = Msg && Msg.data && Msg.data.calculated_payin_percentage ? Msg.data.calculated_payin_percentage : 0;
                                            //Mail
                                            if (objRequest.Call_At === "PROPOSAL") {
                                                try {
                                                    payout_data.Proposal_Id = data.Proposal_Id;
                                                    payout_model.findOne({User_Data_Id: User_Data_Id, Insurer_Id: objRequest['insurer_id'], Call_At: "QUOTE"}).sort({_id: -1}).exec((err, quote_payout) => {
                                                        var Email = require('../models/email');
                                                        var objModelEmail = new Email();
                                                        let payout_status;
                                                        
                                                        if(quote_payout){
                                                            payout_data.Quote_Payout = quote_payout.Point;
                                                            payout_data.Quote_On = quote_payout.Created_On;
                                                            payout_data.Quote_Payout_Id = quote_payout.Payout_Id;
                                                            payout_data.Quote_Payout_Status = quote_payout.Status;
                                                            response_obj.Quote_Payout_Id = quote_payout.Payout_Id;
                                                        }
                                                        if (response_obj.Status === "Success") {
                                                            if (quote_payout && quote_payout.Status === "Success") {
                                                                if (quote_payout.Point && quote_payout.Point > Payout) {
                                                                    if (Payout === 0) {
                                                                        payout_status = "REMOVED";//Payout at proposal is 0
                                                                    } else {
                                                                        payout_status = "DECREASE";//Payout at proposal is less than quote
                                                                    }
                                                                } else if (quote_payout.Point && quote_payout.Point < Payout) {
                                                                    if (quote_payout.Point === 0) {
                                                                        payout_status = "ADDED";//Payout at quote is 0
                                                                    } else {
                                                                        payout_status = "INCREASE";  //Payout at proposal is more than quote
                                                                    }
                                                                } else {
                                                                    payout_status = "MATCH";  //Payout at proposal is same as quote
                                                                }
                                                            } else {
                                                                payout_status = "AVAIL-P";  //Payout only available at proposal (Failed at quote)
                                                            }
                                                        } else {
                                                            if (quote_payout.Status !== "Success") {
                                                                payout_status = "NA"; //Payout Failed
                                                            } else {
                                                                payout_status = "AVAIL-Q";  //Payout only available at quote (Failed at proposal)
                                                            }
                                                        }
                                                        payout_data.Payout_Verification_Status = payout_status;
                                                        let emailFrom = 'noreply@policyboss.com';
                                                        let emailTo = [config.environment.notification_email];
                                                        let cc = "";
                                                        let arrBcc = [];
                                                        if (payout_status === "MATCH") {
                                                            emailTo = [config.environment.notification_email];
                                                            arrBcc = [];
                                                        }
                                                        let quote_status = quote_payout.Status === "Success" ? "Q-SUCCESS" : "Q-FAIL";
                                                        let proposal_status = response_obj.Status === "Success" ? "P-SUCCESS" : "P-FAIL";
                                                        let subject = "[Payout-" + product_name[product_id] + "] Status-" + payout_status + ", " + quote_status + ", " + proposal_status + " " + crn;
                                                        let pb_plan_name = {
                                                            "0CH_1TP": "TP Only",
                                                            "1OD_0TP": "OD Only",
                                                            "1CH_0TP": "Comprehensive",
                                                            "0CH_3TP": "TP (3 Yr)",
                                                            "1CH_2TP": "OD (1 Yr) + TP (3 Yr)",
                                                            "2CH_0TP": "Comprehensive (2 Yr)",
                                                            "3CH_0TP": "Comprehensive (3 Yr)",
                                                            "0CH_5TP": "TP (5 Yr)",
                                                            "1CH_4TP": "OD (1 Yr) + TP (5 Yr)"
                                                        };

                                                        let obj_content = {
                                                            "CRN": crn,
                                                            "Payout at quote": (((quote_payout && quote_payout.Point) ? quote_payout.Point : "") + " " + (quote_payout.Status === "Success" ? "<br>" : "NA<br>")),
                                                            "Payout at proposal": (response_obj.Status === "Success" ? Payout : "NA"),
                                                            "Quote Date": moment(quote_payout.Created_On, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"),
                                                            "Proposal Date": moment(payout_data.Created_On).format("YYYY-MM-DD HH:mm:ss"),
                                                            "Insurer Name": insurer_name[objRequest['insurer_id']],
                                                            "Product": product_name[product_id],
                                                            "Premium": final_premium,
                                                            "Policy Type": pb_plan_name[vehicle_insurance_subtype] || vehicle_insurance_subtype
                                                        };

                                                        let mail_content = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title></title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>Dear Team,<br><br>Please find below payout details.<br><br> ';
                                                        mail_content += objectToHtml(obj_content);
                                                        mail_content += '</body></html>';

                                                        if (emailFrom && emailTo && subject && mail_content) {
                                                            objModelEmail.send(emailFrom, emailTo.join(','), subject, mail_content, cc ? cc : '', arrBcc ? arrBcc.join(',') : '', '');
                                                        } else {
                                                            console.error('calculate_payout_mail - Validation Error');
                                                        }
                                                    });
                                                } catch (e) {
                                                    console.error('calculate_payout_mail', e.stack);
                                                }
                                            }

                                            payout_data.save(function (err, res2) {
                                                if (err) {
                                                    console.error('calculate_payout_logs', err);
                                                }
                                                if(res2 && res2.Payout_Id){
                                                    if(objRequest.Call_At === "QUOTE")
                                                        response_obj.Quote_Payout_Id = res2.Payout_Id;
                                                    if(objRequest.Call_At === "PROPOSAL")
                                                        response_obj.Proposal_Payout_Id = res2.Payout_Id;
                                                }
                                            res.json(response_obj);
                                        });
                                        });
                                    } else {
                                        if (!plan) {
                                            res.json({"Status": "Fail", "Msg": "Plan not available"});
                                        } else {
                                            res.json({"Status": "Fail", "Msg": "Access denied for Payout API Call"});
                                        }
                                    }
                                }
                            });
                        } catch (e) {
                            res.json({"Status": "Fail", "Msg": e.stack});
                        }
                    });
                } else {
                    res.json({"Status": "Fail", "Msg": "No data found"});
                }
            } catch (e) {
                res.json({"Status": "Fail", "Msg": e.stack});
            }
        });
    } catch (e) {
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});

router.post('/online_contents_search', (req, res) => {
    try {
        let ObjRequest = req.body;
        var request = require('request');
        let online_content = require('../models/online_content');
        let online_content_agrs = {
            'Created_On': new Date(),
            'Modified_On': new Date(),
            'Status': "fail",
            'Search_Key': ObjRequest.search_key || "",
            'Search_Content': "",
            'Chat_Gpt_Core_Response': "",
            'Product_Id': ObjRequest.product_id
        };
        var args = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": ObjRequest.search_key//"HDFC ERGO CAR INSURANCE ZERO DEPRECIATION"
                }
            ],
            "temperature": 0.7
        };
        var options = {
            'method': 'POST',
            'url': 'https://api.openai.com/v1/chat/completions',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify(args)
        };

        online_content.findOne({'Search_Key': ObjRequest.search_key, 'Status': 'success'}).sort({Modified_On: -1}).exec(function (err, data) {
            if (err) {
                res.json({"Msg": err, "Status": "FAIL"});
            } else {
                if (data) {
                    res.json({status: "success", msg: data["_doc"]["Search_Content"], created_on: data["_doc"]["Created_On"]});
                } else {
                    request(options, function (error, response) {
                        if (error) {
                            res.json({status: "fail", msg: error});
                        }
                        ;
                        let ObjResponse = JSON.parse(response.body);
                        online_content_agrs.Chat_Gpt_Core_Response = ObjResponse || "";
                        if (ObjResponse && ObjResponse.choices && ObjResponse.choices[0] && ObjResponse.choices[0].message && ObjResponse.choices[0].message.content) {
                            online_content_agrs.Status = "success";
                            online_content_agrs.Search_Content = ObjResponse.choices[0].message.content;
                            res.json({status: "success", msg: ObjResponse.choices[0].message.content, created_on: online_content_agrs["Created_On"]});
                        }
                        let online_content_save = new online_content(online_content_agrs);
                        online_content_save.save(function (err, res1) {
                            if (err) {
                                console.error('online_content_save', err);
                            }
                        });
                    });
                }
            }
        });
    } catch (e) {
        res.json({status: "fail", msg: e.stack});
    }
});

router.post('/feedback_save', function (req, res) {
    try {
        let reqObj = req.body;
        var posp_feedback = require('../models/posp_feedback');
        posp_feedback.find({"Ss_Id": reqObj.Ss_Id}, (err, data) => {
            if (err) {
                res.json({'Msg': err, 'Status': "Fail"});
            } else {
                if (data && data.length > 0) {
                    if (data[0]._doc['Status'] && data[0]._doc['Status'] === "Success") {
                        res.json({'Msg': "Feedback already submitted", 'Status': "Success"});
                    } else {
                        reqObj.Modified_On = new Date();
                        posp_feedback.update({"Ss_Id": reqObj.Ss_Id}, {$set: reqObj}, function (err, data) {
                            if (err) {
                                res.json({'Msg': err, 'Status': "Fail"});
                            } else {
                                res.json({'Msg': "Updated", 'Status': "Success"});
                            }
                        });
                    }
                } else {
                    var obj_posp_feedback = new posp_feedback(reqObj);
                    obj_posp_feedback.Created_On = new Date();
                    obj_posp_feedback.Modified_On = new Date();
                    obj_posp_feedback.save(obj_posp_feedback, function (err, data) {
                        if (err) {
                            res.json({'Msg': err, 'Status': "Fail"});
                        } else {
                            res.json({'Msg': "Saved", 'Status': "Success"});
                        }
                    });
                }
            }
        });
    } catch (err) {
        let errRes = {"Msg": err.stack, "Status": "Fail"};
        res.json(errRes);
    }
});

router.post('/onboarding/posp_training_history/status/:Ss_Id', (req, res) => {
    try {
        var Client = require('node-rest-client').Client;
        var client = new Client();
        let ss_id = req.params.Ss_Id ? req.params.Ss_Id - 0 : "";
        if (ss_id) {
            let training_history_url = config.environment.weburl + "/onboarding/update_training_histories?Ss_Id=" + ss_id;
            client.get(training_history_url, {}, (training_history_url_data, training_history_url_response) => {
                let reqObj = {
                    "emailTo": "noreply@policyboss.com",
                    "emailFrom": "roshani.prajapati@policyboss.com",
                    "subject": "[POSP-ONBOARDING] POSP TRAINING INCOMPLETE & POSP EXAM DUE : : SSID-" + ss_id,
                    "content": JSON.stringify(training_history_url_data)
                };
                if (training_history_url_data.Status === 'Success') {
                    reqObj["subject"] = "[POSP-ONBOARDING] POSP TRAINING COMPLETE & POSP EXAM DUE : : SSID-" + ss_id;
                }
                let args = {
                    data: JSON.stringify(reqObj),
                    headers: {
                        "Content-Type": "application/json",
                        "accept": '*/*'
                    }
                };
                client.post(config.environment.weburl + '/postservicecall/send/email/post', args, (sendEmailData, response) => {
                    res.json(sendEmailData);
                });
            });
        } else {
            res.json({Status: "Fail", Msg: "Ss_Id Is MANDATORY"});
        }
    } catch (e) {
        res.json({Status: "Fail", Msg: 'Not getting any response', error: e.stack});
    }
});

router.post('/send/email/post', (req, res) => {
    try {
        var Email = require('../models/email');
        var objModelEmail = new Email();
        let {emailFrom, emailTo, cc, subject, content} = req.body;
        let arrBcc = [config.environment.notification_email, 'roshani.prajapati@policyboss.com'];
        if (emailFrom && emailTo && subject && content) {
            objModelEmail.send(emailFrom, emailTo, subject, content, cc ? cc : '', arrBcc ? arrBcc.join(',') : '', '');
            res.json({Status: 'Success', Msg: 'Email Sent Successfully...'});
        } else {
            res.json({Status: 'Fail', Msg: 'Validation Error'});
        }
    } catch (e) {
        res.json({Status: 'Fail', Msg: e.stack});
    }
});

router.post('/web_engages/event_tracking', function (req, res) {
    try {
        let event_tracking_req = req.body;
        let event_tracking_api_url = "https://api.in.webengage.com/v1/accounts/in~aa13173a/events";
        let event_tracking_authorization = "Bearer dd9a50e2-489c-4e86-a02f-226757cbe459";
        var event_tracking_args = {
            data: event_tracking_req,
            headers: {
                "Content-Type": "application/json",
                "Authorization": event_tracking_authorization
            }
        };

        client.post(event_tracking_api_url, event_tracking_args, function (event_tracking_data, response) {
            if (event_tracking_data) {
                if (event_tracking_data.response.status) {
                    if (event_tracking_data.response.status === "queued") {
                        res.json({"Status": "Success", "Msg": event_tracking_data.response.status});
                    } else {
                        res.json({"Status": "Fail", "Msg": event_tracking_data.response.message});
                    }
                } else {
                    res.json({"Status": "Fail", "Msg": "Response status is empty"});
                }
            } else {
                res.json({"Status": "Fail", "Msg": "No Response Received"});
            }
        });
    } catch (e) {
        res.json({"Status": "Failed", "Msg": e.stack});
    }

});
router.post('/web_engages/user_tracking', function (req, res) {
    try {
        let user_tracking_req = req.body;
        let user_tracking_api_url = "https://api.in.webengage.com/v1/accounts/in~aa13173a/users";
        let user_tracking_authorization = "Bearer dd9a50e2-489c-4e86-a02f-226757cbe459";
        var user_tracking_args = {
            data: user_tracking_req,
            headers: {
                "Content-Type": "application/json",
                "Authorization": user_tracking_authorization
            }
        };

        client.post(user_tracking_api_url, user_tracking_args, function (user_tracking_res_data, response) {
            if (user_tracking_res_data) {
                if (user_tracking_res_data.response.status) {
                    if (user_tracking_res_data.response.status === "queued") {
                        res.json({"Status": "Success", "Msg": user_tracking_res_data.response.status});
                    } else {
                        res.json({"Status": "Fail", "Msg": user_tracking_res_data.response.message});
                    }
                } else {
                    res.json({"Status": "Fail", "Msg": "Response status is empty"});
                }

            } else {
                res.json({"Status": "Fail", "Msg": "No Response Recieved"});
            }
        });



    } catch (e) {
        res.json({"Status": "Failed", "Msg": e.stack});
    }

});
router.post('/otp_login', function (req, res) {
    try {
        let Employee = require('../models/employee');
        let Posp = require('../models/posp');
        let Client = require("node-rest-client").Client;
        let client = new Client();
        let objRequest = req.body;
        let search_value = objRequest.login_id || '';
        search_value = search_value.trim();
        let search_type = "";
        let mobilepattern = new RegExp('^[6-9]{1}[0-9]{9}$');
        if (search_value) {
            if (search_value.startsWith('5')) {
                search_type = "MISP";
            } else if (search_value.length === 10 && mobilepattern.test(search_value)) {
                search_type = "Mobile_No";
            } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(search_value)) {
                search_type = "Email_Id";
            } else if (search_value.length === 6) {
                if (search_value.startsWith('1')) {
                    search_type = "EMP";
                } else if (search_value.startsWith('6')) {
                    search_type = "POSP";
                } else if (search_value.startsWith('7')) {
                    search_type = "FOS";
                } else if (search_value.startsWith('9')) {
                    search_type = "C-POSP";
                }
            }
        } else {
            res.json({'Status': 'FAIL', 'Msg': 'SERACH VALUE IS BLANK'});
        }
        if (search_value && search_type) {
            let find_query = {};
            if (search_type === "EMP") {
                find_query = {
                    'Emp_Code': search_value - 0
                };
            } else if (['POSP', 'FOS', 'C-POSP', 'MISP'].indexOf(search_type) > -1) {
                find_query = {
                    'Erp_Id': search_value
                };
            } else if (search_type === "Mobile_No") {
                find_query = {
                    'Mobile_Number': parseInt(search_value)
                };
            } else if (search_type === "Email_Id") {
                find_query = {
                    'Email_Id': search_value
                };
            }
            let objResponse = {
                'Name': '',
                'Mobile_No': '',
                'Ss_Id': '',
                'OTP_Status': ''
            };
            Employee.findOne(find_query, function (err, employee) {
                if (err) {
                    res.json({'Status': 'FAIL', 'Msg': err});
                } else {
                    let employee_data = employee;
                    if (employee_data && employee_data._doc && employee_data._doc.Emp_Id && employee_data._doc.Mobile_Number && employee_data._doc.Emp_Name) {
                        objResponse['Name'] = employee._doc.Emp_Name;
                        objResponse['Mobile_No'] = employee._doc.Mobile_Number;
                        objResponse['Ss_Id'] = employee._doc.Emp_Id;
                        client.get(config.environment.weburl + '/generateOTP_New/' + objResponse['Mobile_No'] + '/LOGIN-OTP', {}, function (generate_otp_data, generate_otp_response) {
                            if (generate_otp_data && generate_otp_data.Msg && generate_otp_data.Msg === "Success") {
                                objResponse['OTP_Status'] = "SUCCESS";
                                res.json({'Status': 'SUCCESS', 'Msg': objResponse});
                            } else {
                                objResponse['OTP_Status'] = "FAIL";
                                res.json({'Status': 'SUCCESS', 'Msg': objResponse});
                            }
                        });
                    } else {
                        if (['POSP', 'FOS', 'C-POSP', 'MISP'].indexOf(search_type) > -1) {
                            Posp.findOne(find_query, function (posp_err, posp_db_data) {
                                if (posp_err) {
                                    res.json({'Status': 'FAIL', 'Msg': posp_err});
                                } else {
                                    if (posp_db_data) {
                                        let posp_data = posp_db_data._doc;
                                        objResponse['Name'] = posp_data.First_Name;
                                        objResponse['Mobile_No'] = posp_data.Mobile_No;
                                        objResponse['Ss_Id'] = posp_data.Ss_Id;
                                        client.get(config.environment.weburl + '/generateOTP_New/' + objResponse['Mobile_No'] + '/LOGIN-OTP', {}, function (generate_otp_data, generate_otp_response) {
                                            if (generate_otp_data && generate_otp_data.Msg && generate_otp_data.Msg === "Success") {
                                                objResponse['OTP_Status'] = "SUCCESS";
                                                res.json({'Status': 'SUCCESS', 'Msg': objResponse});
                                            } else {
                                                objResponse['OTP_Status'] = "FAIL";
                                                res.json({'Status': 'SUCCESS', 'Msg': objResponse});
                                            }
                                        });
                                    } else {
                                        res.json({'Status': 'FAIL', 'Msg': 'NO RECORED AVAILABLE IN POSP'});
                                    }
                                }
                            });
                        } else {
                            res.json({'Status': 'FAIL', 'Msg': 'USER IN EMP NOT AVAILABLE & USER SEARCH TYPE NOT AVAILABLE'});
                        }
                    }
                }
            });
        } else {
            res.json({'Status': 'FAIL', 'Msg': 'SEARCH VALUE IS INVALID'});
        }
    } catch (e) {
        res.json({'Status': 'FAIL', 'Msg': e.stack});
    }
});
router.post('/reliance_vehicle_search', function (req, res) {
    try {
        let objRequest = req.body;
        let ss_id = objRequest.ss_id || '';
        let registration_number = objRequest.registration_number || '';
        let emp_name = objRequest.employee_name || '';
        let dbg = objRequest.dbg || "no";
        if (registration_number && ss_id && emp_name) {
            let MongoClient = require('mongodb').MongoClient;
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (db_err, db_data) {
                if (db_err) {
                    res.send({'Status': 'FAIL', 'Msg': 'ERROR IN CONNECT DATABASE', 'Data': db_err});
                } else {
                    let Reliance_Vehicle = db_data.collection('reliance_vehicle');
                    Reliance_Vehicle.find({"VehicleNo": registration_number}).toArray(function (reliance_vehicle_err, reliance_vehicle_data) {
                        if (reliance_vehicle_err) {
                            res.send({'Status': 'FAIL', 'Msg': 'ERROR WHEN FIND DETAILS', 'Data': reliance_vehicle_err});
                        } else {
                            if (reliance_vehicle_data && reliance_vehicle_data.length > 0) {
                                let arrTo = ['ishaq.shaikh@policyboss.com', 'harish.m@landmarkinsurance.in'];
                                let arrBcc = [config.environment.notification_email];
                                let subject = '[' + config.environment.name.toString().toUpperCase() + ']-PolicyBoss.com-REGISTRATION NUMBER SEARCH FOR ' + registration_number;
                                let mail_content = `<html>
                                            <body>
                                                <p>Dear Team,</p>
                                                <p>The Registration Number - <strong>${registration_number}</strong>,  Searched by ${emp_name}(${ss_id}).</p>
                                            </body>
                                            </html>`;
                                let Email = require('../models/email');
                                let objModelEmail = new Email();
                                if (dbg === 'yes') {
                                    objModelEmail.send('notifications@policyboss.com', 'roshani.prajapati@policyboss.com', subject, mail_content, '', '', '');
                                } else {
                                    objModelEmail.send('notifications@policyboss.com', arrTo.join(','), subject, mail_content, '', arrBcc.join(','), '');
                                }
                                res.send({'Status': 'SUCCESS', 'Msg': 'MAIL SEND SUCCESSFULLY', 'Data': reliance_vehicle_data});
                            } else {
                                res.send({'Status': 'FAIL', 'Msg': 'NO RECORD FOUND FROM VEHICLE DETAILS', 'Data': reliance_vehicle_data});
                            }
                        }
                    });
                }
            });
        } else {
            res.send({'Status': 'FAIL', 'Msg': 'MANDATORY PARAMETER IS MISSING'});
        }
    } catch (err) {
        res.send({'Status': "FAIL", 'Msg': err.stack});
    }
});
router.post('/payouts/get_all_payouts', function (req, res) {
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
            if ((['Make_Model', 'Product_Name', 'Product_Sub_Type'].indexOf(req.body.search_by) > -1) && (req.body.search_byvalue && req.body.search_byvalue !== '')) {
                filter[req.body.search_by] = new RegExp(req.body['search_byvalue'], 'i');
            } else if ((['User_Data_Id', 'PB_CRN', 'Insurer_Id'].indexOf(req.body.search_by) > -1) && (req.body.search_byvalue && req.body.search_byvalue !== '')) {
                filter[req.body.search_by] = req.body['search_byvalue'] - 0;
            } else {

            }
        }

        var payouts = require('../models/payout');
        payouts.paginate(filter, optionPaginate).then(function (user_datas) {
            res.json(user_datas);
        });
    } catch (ex) {
        console.error("Exception in - /payouts/get_all_payouts", ex.stack);
        res.json({'Status': 'Error', 'Msg': ex.stack});
    }
});
router.post('/webengage_user_service_call', function (req, res) {
    try {
        let user_objRequest = req.body;
        let posp_user_email = user_objRequest.posp_email || "";
        let user_request_type = user_objRequest.request_type || "";
        let user_request_data = user_objRequest.request_data || "";
        console.error("DBG", "WEBENGAGE REQUEST for User", "EVENT", user_request_data, user_request_type, posp_user_email);
        let user_tracking_api_url = "https://api.in.webengage.com/v1/accounts/in~aa13173a/users";
        let user_tracking_authorization = "Bearer dd9a50e2-489c-4e86-a02f-226757cbe459";
        let user_tracking_req = {
            "userId": posp_user_email,
            "attributes": {}
        };
        if (user_request_type === "EXAM_PASS") {
            user_tracking_req['attributes']['POSP Certification Completed'] = true;
        }
        if (user_request_type === "RM_UPDATED") {
            user_tracking_req['attributes']['Business Vertical'] = user_request_data.Business_Vertical || "";
            user_tracking_req['attributes']['Business Sub-Vertical'] = user_request_data.Sub_Vertical || "";
            user_tracking_req['attributes']['Channel'] = user_request_data.Channel || "";
            user_tracking_req['attributes']['Reporting Manager Name'] = user_request_data.Reporting_Manager_Name || "";
        }
        let user_tracking_args = {
            data: user_tracking_req,
            headers: {
                "Content-Type": "application/json",
                "Authorization": user_tracking_authorization
            }
        };
        var today = moment().utcOffset("+05:30");
        var today_str = moment(today).format("YYYYMMD");
        var file_log_objRequest = {
            'dt': today.toLocaleString(),
            'resp': req.body
        };
        try {
            fs.appendFile(appRoot + "/tmp/log/webengage_user_request_" + today_str + ".log", user_request_type, JSON.stringify(user_tracking_args) + "\r\n", function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        } catch (ex1) {
            console.log("The file was saved!", ex1.stack);
        }
        let obj_user_tracking_response = {};
        //console.error("DBG","WEBENGAGE REQUEST for User","EVENT",user_tracking_args,user_request_type,posp_user_email);
        client.post(user_tracking_api_url, user_tracking_args, function (user_tracking_data, response) {
            if (user_tracking_data && user_tracking_data.response.status && user_tracking_data.response.status === "queued") {
                obj_user_tracking_response["Status"] = "SUCCESS";
                obj_user_tracking_response["Msg"] = user_tracking_data;
            } else {
                obj_user_tracking_response["Status"] = "FAIL";
            }
            obj_user_tracking_response["Msg"] = user_tracking_data;
            res.send(obj_user_tracking_response);
        });
    } catch (e) {
        res.json({"Status": "FAIL", "Msg": e.stack});
    }
});
router.post('/webengage_service_call', function (req, res) {
    try {
        let objRequest = req.body;
        let posp_email = objRequest.posp_email || "";
        let request_type = objRequest.request_type || "";
        let request_data = objRequest.request_data || "";
        let event_tracking_api_url = "https://api.in.webengage.com/v1/accounts/in~aa13173a/events";
        let event_tracking_authorization = "Bearer dd9a50e2-489c-4e86-a02f-226757cbe459";
        let event_tracking_req = {
            "userId": posp_email,
            "eventName": "",
            "eventData": {}
        };
        var today = moment().utcOffset("+05:30");
        var today_str = moment(today).format("YYYYMMD");
        var file_log_objRequest = {
            'dt': today.toLocaleString(),
            'resp': req.body
        };
        try {
            fs.appendFile(appRoot + "/tmp/log/webengage_pb_get_request_" + today_str + ".log", request_type, JSON.stringify(file_log_objRequest) + "\r\n", function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        } catch (ex2) {
            console.log("Webengage the file was saved!", ex2.stack);
        }
        //console.error("DBG","WEBENGAGE REQUEST for User","EVENT",request_data,request_type,posp_email);
        let user_event_args = {
            data: {
                "posp_email": posp_email,
                "request_type": request_type,
                "request_data": request_data
            },
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            if (["EXAM_PASS", "RM_UPDATED"].indexOf(request_type) > -1) {
                client.post(config.environment.weburl + '/postservicecall/webengage_user_service_call', user_event_args, function (user_tracking, response) {
                    console.error("User Tracking API Call", request_type, user_tracking);
                });
            }
        } catch (ex) {
            console.error("User Tracking API Call", request_type, ex.stack);
        }
        let request_type_obj = {
            "PAYMENT_LINK": "POSP No Generated",
            "TRAINING_LINK": "Training Scheduled",
            "EXAM_LINK": "Training Completed",
            "DOCUMENT_REJECTED": "Document Rejected",
            "IIB_UPLOAD_REQUEST": "Document Approved",
            "PAYMENT_DONE": "Onboarding Payment Completed",
            "SIGNUP": "Registration Successful",
            "Onboarding_Payment_Canceled": "Onboarding Payment Canceled",
            "Onboarding_Payment_Initiated": "Onboarding Payment Initiated",
            "PAYMENT_NOT_DONE": "Onboarding Payment Failed",
            "Onboarding_Payment_Paypass": "Onboarding Payment Paypass",
            "RM_UPDATED": "Relationship Manager Assigned",
            "EXAM_PASS": "Exam Status",
            "ERP_CODE": "ERP Code Generated",
            "IIB_UPLOADED": "IIB Data Upload Completed",
            "Weekly_Activity_Summary": "Weekly Activity Summary",
            "Monthly_Activity_Summary": "Monthly Activity Summary"
        };
        event_tracking_req['eventName'] = request_type_obj[request_type];
        if (request_type === "PAYMENT_LINK") {
            event_tracking_req['eventData']['POSP Number'] = request_data.POSP_Number || 0;
            event_tracking_req['eventData']['Payable Amount'] = request_data.Payable_Amount || 0;
            event_tracking_req['eventData']['Payment Link'] = request_data.Payment_Link || "";
        }
        if (request_type === "TRAINING_LINK") {
            event_tracking_req['eventData']['Training Start Date'] = request_data.Training_Start_Date || "";
            event_tracking_req['eventData']['Training Category'] = request_data.Training_Category || "";
            event_tracking_req['eventData']['Training Duration in hours'] = request_data.Training_Duration_in_hours || 0;
            event_tracking_req['eventData']['Training Link'] = request_data.Training_Link || "";
            event_tracking_req['eventData']['Relationship Manager'] = request_data.Relationship_Manager_Name || "";
            event_tracking_req['eventData']['Relationship Manager Contact'] = request_data.Relationship_Manager_Contact || "";
            event_tracking_req['eventData']['Reporting Email ID'] = request_data.Reporting_Email_ID || "";
        }
        if (request_type === "EXAM_LINK") {
            event_tracking_req['eventData']['Exam Link'] = request_data.Exam_Link || "";
        }
        if (request_type === "DOCUMENT_REJECTED") {
            event_tracking_req['eventData']['Stage'] = request_data.Stage || "";
            event_tracking_req['eventData']['Document Type'] = request_data.Document_Type || "";
        }
        if (request_type === "IIB_UPLOAD_REQUEST") {
            event_tracking_req['eventData']['Stage'] = request_data.Stage || "";
            event_tracking_req['eventData']['Document Type'] = request_data.Document_Type || "";
        }
        if (request_type === "PAYMENT_DONE") {
            event_tracking_req['eventData']['Customer Name'] = request_data.Customer_Name || "";
            event_tracking_req['eventData']['Name'] = request_data.Platform_Name || "";
            event_tracking_req['eventData']['Invoice URL'] = request_data.Invoice_URL || "";
            event_tracking_req['eventData']['Payable Amount'] = request_data.Payable_Amount || 0;
        }
        if (request_type === "EXAM_PASS") {
            event_tracking_req['eventData']['Status'] = request_data.Status || "";
            event_tracking_req['eventData']['Certificate URL'] = request_data.Certificate_URL || "";
        }
        if (request_type === "SIGNUP") {
            event_tracking_req['eventData']['Login ID'] = request_data.Login_ID || "";
            event_tracking_req['eventData']['Password'] = request_data.Password || "";
        }
        if (request_type === "Onboarding_Payment_Canceled") {
            event_tracking_req['eventData']['Customer Name'] = request_data.Customer_Name || "";
            event_tracking_req['eventData']['Name'] = request_data.Platform_Name || "";
            event_tracking_req['eventData']['Payable Amount'] = request_data.Payable_Amount || 0;
            event_tracking_req['eventData']['Payment Link'] = request_data.Payment_Link || "";
        }
        if (request_type === "Onboarding_Payment_Initiated") {
            event_tracking_req['eventData']['Customer Name'] = request_data.Customer_Name || "";
            event_tracking_req['eventData']['Name'] = request_data.Platform_Name || "";
            event_tracking_req['eventData']['Payable Amount'] = request_data.Payable_Amount || 0;
            event_tracking_req['eventData']['Payment Link'] = request_data.Payment_Link || "";
        }
        if (request_type === "PAYMENT_NOT_DONE") {
            event_tracking_req['eventData']['Customer Name'] = request_data.Customer_Name || "";
            event_tracking_req['eventData']['Name'] = request_data.Platform_Name || "";
            event_tracking_req['eventData']['Payable Amount'] = request_data.Payable_Amount || 0;
            event_tracking_req['eventData']['Payment Link'] = request_data.Payment_Link || "";
        }
        if (request_type === "Onboarding_Payment_Paypass") {
            event_tracking_req['eventData']['Customer Name'] = request_data.Customer_Name || "";
            event_tracking_req['eventData']['Name'] = request_data.Platform_Name || "";
            event_tracking_req['eventData']['Payable Amount'] = request_data.Payable_Amount || 0;
        }
        if (request_type === "RM_UPDATED") {
            event_tracking_req['eventData']['Channel'] = request_data.Channel || "";
            event_tracking_req['eventData']['Relationship Manager Name'] = request_data.Relationship_Manager_Name || "";
            event_tracking_req['eventData']['Relationship Manager Contact'] = request_data.Relationship_Manager_Contact || "";
            event_tracking_req['eventData']['Reporting Email ID'] = request_data.Reporting_Email_ID || "";
            event_tracking_req['eventData']['Business Vertical'] = request_data.Business_Vertical || "";
            event_tracking_req['eventData']['Sub-Vertical'] = request_data.Sub_Vertical || "";
        }
        if (request_type === "IIB_UPLOADED") {
            event_tracking_req['eventData']['Appointement Letter'] = request_data.Appointment_Letter_Link || "";
        }
        if (request_type === "Weekly_Activity_Summary") {
            event_tracking_req['eventData']['Total Health Sales'] = request_data.Weekly_Total_Health_Sales || 0;
            event_tracking_req['eventData']['Total Health Sale Premium'] = request_data.Weekly_Total_Health_Sales_Premium || 0;
            event_tracking_req['eventData']['Total Motor Car Sales'] = request_data.Weekly_Total_Motor_Car_Sales || 0;
            event_tracking_req['eventData']['Total Motor Car Premium'] = request_data.Weekly_Total_Motor_Car_Premium || 0;
            event_tracking_req['eventData']['Total Life Ins Sales'] = request_data.Weekly_Total_Life_Ins_Sales || 0;
            event_tracking_req['eventData']['Total Life Ins Premium'] = request_data.Weekly_Total_Life_Ins_Premium || 0;
        }
        if (request_type === "Monthly_Activity_Summary") {
            event_tracking_req['eventData']['Total Health Sales'] = request_data.Monthly_Total_Health_Sales || 0;
            event_tracking_req['eventData']['Total Health Sale Premium'] = request_data.Monthly_Total_Health_Sale_Premium || 0;
            event_tracking_req['eventData']['Total Motor Car Sales'] = request_data.Monthly_Total_Motor_Car_Sales || 0;
            event_tracking_req['eventData']['Total Motor Car Premium'] = request_data.Monthly_Total_Motor_Car_Premium || 0;
            event_tracking_req['eventData']['Total Life Ins Sales'] = request_data.Monthly_Total_Life_Ins_Sales || 0;
            event_tracking_req['eventData']['Total Life Ins Premium'] = request_data.Monthly_Total_Life_Ins_Premium || 0;
        }
        if (request_type === "ERP_CODE") {
            event_tracking_req['eventData']['ERP Code'] = request_data.ERP_Code || "";
        }
        let event_tracking_args = {
            data: event_tracking_req,
            headers: {
                "Content-Type": "application/json",
                "Authorization": event_tracking_authorization
            }
        };
        try {
            fs.appendFile(appRoot + "/tmp/log/webengage_pb_make_request_" + today_str + ".log", request_type, JSON.stringify(event_tracking_args) + "\r\n", function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        } catch (ex3)
        {
            console.log("Webengage the file was saved!", ex3.stack);
        }
        let obj_tracking_response = {};
        client.post(event_tracking_api_url, event_tracking_args, function (event_tracking_data, response) {
            if (event_tracking_data && event_tracking_data.response.status && event_tracking_data.response.status === "queued") {
                obj_tracking_response["Status"] = "SUCCESS";
                obj_tracking_response["Msg"] = event_tracking_data;
                try {
                    if (request_type === "SIGNUP") {
                        let event_tracking_args2 = {
                            data: {
                                "posp_email": posp_email,
                                "request_type": "TRAINING_LINK",
                                "request_data": {
                                    "Training_Start_Date": request_data.Training_Start_Date ? new Date(request_data.Training_Start_Date).toISOString() : "",
                                    "Training_Category": request_data.Training_Category || "",
                                    "Training_Duration_in_hours": request_data.Training_Duration_in_hours || 0,
                                    "Training_Link": request_data.Training_Link || "",
                                    "Relationship_Manager_Name": request_data.Relationship_Manager_Name || "",
                                    "Relationship_Manager_Contact": request_data.Relationship_Manager_Contact || "",
                                    "Reporting_Email_ID": request_data.Reporting_Email_ID || ""
                                }
                            },
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        client.post(config.environment.weburl + '/postservicecall/webengage_service_call', event_tracking_args2, function (event_tracking_data2, response) {
                            if (event_tracking_data2 && event_tracking_data2.response.status && event_tracking_data2.response.status === "queued") {
                                console.error("Event Tracking API Call", request_type, event_tracking_data2);
                                try {
                                    if (request_type === "SIGNUP") {
                                        let event_tracking_args3 = {
                                            data: {
                                                "posp_email": posp_email,
                                                "request_type": "PAYMENT_LINK",
                                                "request_data": {
                                                    "POSP_Number": request_data.POSP_Number,
                                                    "Payable_Amount": request_data.Payable_Amount,
                                                    "Payment_Link": request_data.Payment_Link
                                                }
                                            },
                                            headers: {
                                                "Content-Type": "application/json"
                                            }
                                        };
                                        client.post(config.environment.weburl + '/postservicecall/webengage_service_call', event_tracking_args3, function (event_tracking_data3, response) {
                                            console.error("Event Tracking API Call", request_type, event_tracking_data3);
                                        });
                                    }
                                } catch (ex) {
                                    console.error("Event Tracking API Call", request_type, ex.stack);
                                }
                            }
                        });
                    }
                } catch (ex) {
                    console.error("Event Tracking API Call", request_type, ex.stack);
                }
            } else {
                obj_tracking_response["Status"] = "FAIL";
            }
            obj_tracking_response["Msg"] = event_tracking_data;
            res.send(obj_tracking_response);
        });
    } catch (e) {
        res.json({"Status": "FAIL", "Msg": e.stack});
    }
});

router.get('/getBlogs', function (req, res) {
    try {
        var type = req.query.type || "BLOG";
        var content_management = require('../models/content_management');
        content_management.find({Type: type, Is_Active: 1, Status: 'Publish'}, {_id: 0}).sort({Blog_Date: -1}).exec(function (err, blogs) {
            if (err) {
                res.send({'Status': "FAIL", 'Msg': err});
            } else {
                res.send({'Status': "SUCCESS", 'Msg': blogs});
            }
        });
    } catch (err) {
        console.error("/getBlogs - ", err.stack);
        res.send({'Status': "FAIL", 'Msg': err.stack});
    }

});

//CMS - Blog image save
router.post('/save_blog_content_image', function (req, res) {
    try {
        form.parse(req, function (err, fields, files) {
            if (files.hasOwnProperty('file_1')) {
                var pdf_file_name = files['file_1'].name;
                pdf_file_name = pdf_file_name.split('.')[0].replace(/ /g, '') + "." + pdf_file_name.split('.')[1];
                var path = "/var/www/Production/hcdn/website/UI22/images/blog_images/";
                var pdf_sys_loc_horizon = path + pdf_file_name;
                var oldpath = files.file_1.path;
                if (!fs.existsSync(path))
                {
                    fs.mkdirSync(path);
                }
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
                        } else {
                            res.json({'Status': 'Success', 'Msg': 'File Uploaded Successfully.'});
                        }
                    });
                    // Delete the file
                    fs.unlink(oldpath, function (err) {
                        if (err)
                            throw err;
                        console.log('File deleted!');
                    });
                });
            } else {
                res.json({'Status': 'Fail', 'Msg': 'File Missing'});
            }
        });
    } catch (ex) {
        console.error('Exception in - /save_blog_content_image', ex.stack);
        res.json({'Status': 'Fail', 'Msg': 'Exception occurs while saving blog content image', 'Error': ex.stack});
    }
});
router.get('/posp_iib_event_tracking', function (req, res) {
    try {
        let objRequest = req.query;
        let posp_ss_id = objRequest.ss_id ? objRequest.ss_id - 0 : "";
        if (posp_ss_id) {
            client.get('https://horizon.policyboss.com:5443/posps/dsas/view/' + posp_ss_id, function (posp_data, response) {
                if (posp_data) {
                    if (posp_data.POSP && posp_data.POSP.Email_Id) {
                        let we_event_tracking_args = {
                            data: {
                                "posp_email": posp_data.POSP.Email_Id,
                                "request_type": 'IIB_UPLOADED',
                                "request_data": {
                                    "Appointment_Letter_Link": "http://download.policyboss.com/onboarding_appointments/" + posp_ss_id + "/AppointmentLetter_" + posp_ss_id + ".pdf"
                                }
                            },
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        let posp_response_obj = {};
                        try {
                            client.post(config.environment.weburl + '/postservicecall/webengage_service_call', we_event_tracking_args, function (we_event_tracking_data, response) {
                                if (we_event_tracking_data && we_event_tracking_data.Status && we_event_tracking_data.Status === "SUCCESS") {
                                    posp_response_obj["Status"] = "SUCCESS";
                                } else {
                                    posp_response_obj["Status"] = "FAIL";
                                }
                                posp_response_obj["Msg"] = we_event_tracking_data;
                                console.error("Posp Event Tracking API Call", "IIB_UPLOADED", we_event_tracking_data);
                                res.json(posp_response_obj);
                            });
                        } catch (e) {
                            res.json({"Status": "Exception", "Msg": e.stack});
                        }
                    } else {
                        res.json({"Status": "Fail", "Msg": "Email Id Is Mandatory"});
                    }
                } else {
                    res.json({"Status": "Fail", "Msg": "No Record Found"});
                }
            });
        } else {
            res.json({"Status": "Fail", "Msg": "Search Parameter Is Missing"});
        }
    } catch (e) {
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});
router.post('/auth_tokens/auth_login', function (req, res) {
    req.body = JSON.parse(JSON.stringify(req.body));
    let objRequest = req.body;
    let obj_login = {
        "UserName": objRequest.username,
        "Password": objRequest.password,
        "pwd": objRequest.password,
        "IpAdd": "180.179.132.185"
    };
    let post_args = {
        data: obj_login,
        headers: {
            "Content-Type": "application/json",
            'Username': config.pb_config.api_crn_user,
            'Password': config.pb_config.api_crn_pass
        }
    };
    let Client = require('node-rest-client').Client;
    let client = new Client();
    let objResponse = {};
    client.post(config.pb_config.api_login_url, post_args, function (login_data, login_response) {
        try {
            if (login_data && login_data.Result && login_data.Result === "Success" && login_data.SuppAgentId) {
                objResponse['SS_ID'] = login_data.SuppAgentId || "";
                objResponse['Mobile_No'] = login_data.MobiNumb1 || "";
                objResponse['Email_ID'] = login_data.EmailID || "";
                res.json({"Status": "SUCCESS", "Msg": "RECORD FETCH SUCCESSFULLY", "Data": objResponse});
            } else {
                res.json({"Status": "FAIL", "Msg": login_data});
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
});
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}
router.post('/store/rs_form60', (req, res) => {
    let objRequest = req.body;
    let path = appRoot + "/tmp/royal_form60";
    let Doc_Path = `/tmp/royal_form60/${objRequest.crn}_${objRequest.udid}.${objRequest.Form60_Name.split('.')[1]}`;
    if (!fs.existsSync(appRoot + "/tmp/royal_form60")) {
        fs.mkdirSync(appRoot + "/tmp/royal_form60");
    }
    if (fs.existsSync(path)) {
        var doc_decoded = decodeURIComponent(objRequest['doc_data']);
        var data = doc_decoded.replace(/^data:image\/\w+;base64,/, "");
        if (data === "") {
            res.json({"Msg": 'Document Unavailable', "Status": "FAIL"});
        } else {
            var buf = new Buffer(data, 'base64');
            fs.writeFileSync(appRoot + Doc_Path, buf);
            res.json({"Msg": 'Document Uploaded', "Status": "SUCCESS"});
        }
    }
});

router.post('/kyc_details/tataaig_verify_otp_details', (req, res) => {
    try {
        var request = require('request');
        let objRequest = req.body;
        let tokenservice_url = ((config.environment.name === 'Production') ? 'https://foyer-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token' : 'https://uatapigw-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token');
        let grant_type = ((config.environment.name === 'Production') ? 'client_credentials' : 'client_credentials');
        let scope = ((config.environment.name === 'Production') ? 'https://foyer.tataaig.com/write' : 'https://api.iorta.in/write');
        let client_id = ((config.environment.name === 'Production') ? '14rs1d1nbr70qu2rq3jlc9tu5m' : '5qdbqng8plqp1ko2sslu695n2g');
        let client_secret = ((config.environment.name === 'Production') ? '2usb6cl1os1cvplu507kbeasvjb0bl7193e08dojnosd2ouvmod' : 'gki6eqtltmjj37gpqq0dt52dt651o079dn6mls62ptkvsa2b45c');

        if (objRequest && objRequest.Product_Id && parseInt(objRequest.Product_Id) !== 10) {
            client_id = ((config.environment.name === 'Production') ? '54qqhf0pbk1jghrpajm8vjas8' : '5qdbqng8plqp1ko2sslu695n2g');
            client_secret = ((config.environment.name === 'Production') ? '1lg9d2a3lrns333hgs5mdnd8or6l1iesd02qtofb8r3vgnc53asn' : 'gki6eqtltmjj37gpqq0dt52dt651o079dn6mls62ptkvsa2b45c');
        }
        var auth_options = {
            'method': 'POST',
            'url': tokenservice_url,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                'grant_type': grant_type,
                'scope': scope,
                'client_id': client_id,
                'client_secret': client_secret
            }
        };
        request(auth_options, function (error, response) {
            if (error) {
                res.json({"Insurer": "TATA_AIG", "Msg": error, "Status": "FAIL"});
            }
            var token_data = JSON.parse(response.body);
            if (token_data.hasOwnProperty("access_token") && token_data.access_token) {
                token = token_data.access_token;
                try {
                    if (token) {
                        var requestObj = {
                            "req_id": objRequest.req_id, //"pan_80626fd18915509a57773837186bb8cf:67bfd5ce9d093c6e094cc629a1324622c22e7a09b5c5e8e17227fdedbdae77be",
                            "proposal_no": objRequest.proposal_no, //"PR/23/6100537700",
                            "id_type": objRequest.id_type, //"AADHAAR",
                            "id_num": objRequest.id_num, //"719909918811",
                            "client_id": objRequest.client_id, //"aadhaar_v2_pnxzpzpClvwjRfaieBxb",
                            "otp": objRequest.otp
                        };
                        var options = {
                            'method': 'POST',
                            'url': 'https://foyer.tataaig.com/ckyc/submit-otp?product=motor',
                            'headers': {
                                'content-type': 'application/json',
                                'Authorization': token,
                                'x-api-key': ((config.environment.name === 'Production') ? 'Xt4dW7poXZ9i7nI7xnTG21GuR7LtjlO27p1Tgflz' : 'g8hoqi8TBA2mBpxgMohdTcWxAfv6JsJ6wLztOWm4')
                            },
                            body: JSON.stringify(requestObj)

                        };
                        request(options, function (error, response) {
                            if (error) {
                                res.json({"Insurer": "TATA_AIG", "Msg": error, "Status": "FAIL"});
                            }
                            var otp_response = JSON.parse(response.body);
                            if (otp_response && otp_response.status === 200 && otp_response.message_txt === "Verification Successful") {
                                res.json({"Insurer": "TATA_AIG", "Msg": otp_response, "Status": "SUCCESS"});
                            } else {
                                res.json({"Insurer": "TATA_AIG", "Msg": otp_response, "Status": "FAIL"});
                            }
                        });
                    } else {
                        res.json({"Insurer": "TATA_AIG", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                    }
                } catch (e2) {
                    res.json({"Insurer": "TATA_AIG", "Msg": e2.stack, "Status": "FAIL"});
                }
            } else {
                res.json({"Insurer": "TATA_AIG", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
            }
        });
    } catch (e2) {
        res.json({"Insurer": "TATA_AIG", "Msg": e2.stack, "Status": "FAIL"});
    }
});
router.post("/renewal", renewal_recalculate, (req, res) => {
    try {
        var reqObj = req.body;
        var proposal_req = reqObj.proposal_req;
        proposal_req["agent_source"] = 0;
        proposal_req["client_key"] = "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9";
        proposal_req["secret_key"] = "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW";
        proposal_req["data_type"] = "proposal";
        proposal_req["method_name"] = "/quote/save_user_data";
        var save_user_data_args = {
            data: proposal_req,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        };
        var product_route = {
            1: '/car-insurance',
            10: '/two-wheeler-insurance',
            12: '/commercial-vehicle-insurance'
        };
        save_user_data_args["data"]["insurer_id"] = proposal_req["prev_insurer_id"];
        client.post(config.environment.weburl + "/quote/save_user_data", save_user_data_args, (save_user_data_response) => {
            if (save_user_data_response && save_user_data_response['Msg'] === "Data saved") {

                if (proposal_req["source"] === "PBRenewal") {
                    if ([11, 12, 16, 30, 44].indexOf(proposal_req.insurer_id) < 0) {
                        var api_log_summary_args = {
                            data: {
                                api_reference_number: proposal_req["api_reference_number"],
                                secret_key: 'SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW',
                                client_key: 'CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9'
                            },
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            }
                        };
                        client.post(config.environment.weburl + "/quote/api_log_summary", api_log_summary_args, (api_log_summary_res) => {
                            var transIdentidier = api_log_summary_res && api_log_summary_res['Summary'] ? api_log_summary_res['Summary']['Insurer_Transaction_Identifier'] : "";
                            var vehicle_registration_type = api_log_summary_res && api_log_summary_res.Quote_Request ? api_log_summary_res.Quote_Request.vehicle_registration_type : "";
                            var kyc_req = {data: {
                                    insurer_id: proposal_req.insurer_id,
                                    crn: proposal_req.crn,
                                    udid: proposal_req.udid,
                                    product_id: proposal_req.product_id,
                                    Proposal_Request: proposal_req,
                                    Quote_Id: transIdentidier || "", //this.summary['Summary'].hasOwnProperty('Insurer_Transaction_Identifier')? this.summary['Summary']['Insurer_Transaction_Identifier']: "",
                                    Proposal_Id: '',
                                    search_type: proposal_req.kyc_document_type || "PAN",
                                    vehicle_registration_type: vehicle_registration_type,
                                    proposal_url: "https://www.policyboss.com" + product_route[proposal_req.product_id] + "/proposal-summary?ClientID=2&ARN=" + reqObj.arn + "&POSP=NonPOSP&SsID=" + proposal_req["ss_id"],
                                    Document_ID: proposal_req.kyc_document_id ? proposal_req.kyc_document_id.toUpperCase() : proposal_req.pan,
                                    Document_Type: proposal_req.kyc_document_type || "PAN"
                                },
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            client.post(config.environment.weburl + "/postservicecall/kyc_details/save_kyc_details", kyc_req, (save_kyc_details_res) => {
                                if (save_kyc_details_res && save_kyc_details_res['KYC_Status'] && save_kyc_details_res['KYC_Status'].includes("SUCCESS")) {
                                    res.json({"Status": "Success", "Msg": {"Proposal_Url": "https://www.policyboss.com" + product_route[proposal_req.product_id] + "/proposal-summary?ClientID=2&ARN=" + reqObj.arn + "&POSP=NonPOSP&SsID=" + proposal_req["ss_id"]}});
                                } else {
                                    res.json({"Status": "Success", "Msg": {"Proposal_Url": "https://www.policyboss.com" + product_route[proposal_req.product_id] + "/proposal?ClientID=2&ARN=" + reqObj.arn + "&POSP=NonPOSP&SsID=" + proposal_req["ss_id"]}});
                                }
                            });
                        });
                    } else {
                        res.json({"Status": "Success", "Msg": {"Proposal_Url": "https://www.policyboss.com" + product_route[proposal_req.product_id] + "/proposal-summary?ClientID=2&ARN=" + reqObj.arn + "&POSP=NonPOSP&SsID=" + proposal_req["ss_id"]}});
                    }
                } else {
                    res.json({"Status": "Success", "Msg": {"Proposal_Url": "https://www.policyboss.com" + product_route[proposal_req.product_id] + "/proposal?ClientID=2&ARN=" + reqObj.arn + "&POSP=NonPOSP&SsID=" + proposal_req["ss_id"]}});
                }
            } else {
                res.json({"Status": "Fail", "Msg": save_user_data_response});
            }
        });
    } catch (e) {
        res.json({"Status": "Fail", "Msg": e.stack});
    }
});

router.post("/renewal_call_premium_list_db", (req, res) => {
    try {
        var start = moment(new Date());
        var reqBody = req.body;
        var premium_list_db_args = {
            data: reqBody.premium_list_db_args,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };
        client.post(config.environment.weburl + "/quote/premium_list_db", premium_list_db_args, (premium_list_db_res) => {
            if (premium_list_db_res) {
                if (premium_list_db_res['Response']) {
                    var insurer_list = premium_list_db_res['Response'];
                    var insurer_data;
                    for (var i = 0; i < insurer_list.length; i++) {
                        if (insurer_list[i]['Insurer_Id'] === reqBody.req.proposal_req["prev_insurer_id"]) {
                            insurer_data = insurer_list[i];
                            break;
                        }
                    }
                    if (insurer_data) {
                        if (insurer_data.Premium_Breakup && insurer_data.Premium_Breakup.hasOwnProperty('net_premium') && insurer_data.Premium_Breakup.net_premium) {
                            if (insurer_data['Service_Log_Unique_Id']) {
                                res.json({Status: "Success", Msg: premium_list_db_res});
                            } else {
                                res.json({Status: "Fail", Msg: "Application reference number not generated"});
                            }
                        } else {
                            res.json({Status: "Fail", Msg: insurer_data['Error_Msg']});
                        }
                    } else {
                        var now = moment(new Date());
                        var duration = moment.duration(now.diff(start));
                        duration = moment.duration(now.diff(start));
                        duration.asMinutes();
                        if (duration.asMinutes() > 1) {
                            res.json({Status: "Fail", Msg: "Unable to fetch previous year policy insurer quotes, please compare quotes with another insurer or connect with customer care team."});
                        } else {
                            setTimeout(() => {
                                client.post(config.environment.weburl + "/quote/premium_list_db", premium_list_db_args, (premium_list_db_res) => {
                                    if (premium_list_db_res) {
                                        if (premium_list_db_res['Response']) {
                                            var insurer_list = premium_list_db_res['Response'];
                                            var insurer_data;
                                            for (var i = 0; i < insurer_list.length; i++) {
                                                if (insurer_list[i]['Insurer_Id'] === reqBody.req.proposal_req["prev_insurer_id"]) {
                                                    insurer_data = insurer_list[i];
                                                    break;
                                                }
                                            }
                                            if (insurer_data) {
                                                if (insurer_data.Premium_Breakup && insurer_data.Premium_Breakup.hasOwnProperty('net_premium') && insurer_data.Premium_Breakup.net_premium) {
                                                    if (insurer_data['Service_Log_Unique_Id']) {
                                                        res.json({Status: "Success", Msg: premium_list_db_res});
                                                    } else {
                                                        res.json({Status: "Fail", Msg: "Application reference number not generated"});
                                                    }
                                                } else {
                                                    res.json({Status: "Fail", Msg: insurer_data['Error_Msg']});
                                                }
                                            } else {
                                                var now = moment(new Date());
                                                var duration = moment.duration(now.diff(start));
                                                duration = moment.duration(now.diff(start));
                                                duration.asMinutes();
                                                if (duration.asMinutes() > 1) {
                                                    res.json({Status: "Fail", Msg: "Unable to fetch previous year policy insurer quotes, please compare quotes with another insurer or connect with customer care team."});
                                                } else {
                                                    setTimeout(() => {
                                                        client.post(config.environment.weburl + "/quote/premium_list_db", premium_list_db_args, (premium_list_db_res) => {
                                                            if (premium_list_db_res) {
                                                                if (premium_list_db_res['Response']) {
                                                                    var insurer_list = premium_list_db_res['Response'];
                                                                    var insurer_data;
                                                                    for (var i = 0; i < insurer_list.length; i++) {
                                                                        if (insurer_list[i]['Insurer_Id'] === reqBody.req.proposal_req["prev_insurer_id"]) {
                                                                            insurer_data = insurer_list[i];
                                                                            break;
                                                                        }
                                                                    }
                                                                    if (insurer_data) {
                                                                        if (insurer_data.Premium_Breakup && insurer_data.Premium_Breakup.hasOwnProperty('net_premium') && insurer_data.Premium_Breakup.net_premium) {
                                                                            if (insurer_data['Service_Log_Unique_Id']) {
                                                                                res.json({Status: "Success", Msg: premium_list_db_res});
                                                                            } else {
                                                                                res.json({Status: "Fail", Msg: "Application reference number not generated"});
                                                                            }
                                                                        } else {
                                                                            res.json({Status: "Fail", Msg: insurer_data['Error_Msg']});
                                                                        }
                                                                    } else {
                                                                        var now = moment(new Date());
                                                                        var duration = moment.duration(now.diff(start));
                                                                        duration = moment.duration(now.diff(start));
                                                                        duration.asMinutes();
                                                                        if (duration.asMinutes() > 1) {
                                                                            res.json({Status: "Fail", Msg: "Unable to fetch previous year policy insurer quotes, please compare quotes with another insurer or connect with customer care team."});
                                                                        } else {
                                                                            setTimeout(() => {
                                                                                client.post(config.environment.weburl + "/quote/premium_list_db", premium_list_db_args, (premium_list_db_res) => {
                                                                                    if (premium_list_db_res) {
                                                                                        if (premium_list_db_res['Response']) {
                                                                                            var insurer_list = premium_list_db_res['Response'];
                                                                                            var insurer_data;
                                                                                            for (var i = 0; i < insurer_list.length; i++) {
                                                                                                if (insurer_list[i]['Insurer_Id'] === reqBody.req.proposal_req["prev_insurer_id"]) {
                                                                                                    insurer_data = insurer_list[i];
                                                                                                    break;
                                                                                                }
                                                                                            }
                                                                                            if (insurer_data) {
                                                                                                if (insurer_data.Premium_Breakup && insurer_data.Premium_Breakup.hasOwnProperty('net_premium') && insurer_data.Premium_Breakup.net_premium) {
                                                                                                    if (insurer_data['Service_Log_Unique_Id']) {
                                                                                                        res.json({Status: "Success", Msg: premium_list_db_res});
                                                                                                    } else {
                                                                                                        res.json({Status: "Fail", Msg: "Application reference number not generated"});
                                                                                                    }
                                                                                                } else {
                                                                                                    res.json({Status: "Fail", Msg: insurer_data['Error_Msg']});
                                                                                                }
                                                                                            } else {
                                                                                                var now = moment(new Date());
                                                                                                var duration = moment.duration(now.diff(start));
                                                                                                duration = moment.duration(now.diff(start));
                                                                                                duration.asMinutes();
                                                                                                if (duration.asMinutes() > 1) {
                                                                                                    res.json({Status: "Fail", Msg: "Unable to fetch previous year policy insurer quotes, please compare quotes with another insurer or connect with customer care team."});
                                                                                                } else {
                                                                                                    setTimeout(() => {
                                                                                                        client.post(config.environment.weburl + "/quote/premium_list_db", premium_list_db_args, (premium_list_db_res) => {
                                                                                                            if (premium_list_db_res) {
                                                                                                                if (premium_list_db_res['Response']) {
                                                                                                                    var insurer_list = premium_list_db_res['Response'];
                                                                                                                    var insurer_data;
                                                                                                                    for (var i = 0; i < insurer_list.length; i++) {
                                                                                                                        if (insurer_list[i]['Insurer_Id'] === reqBody.req.proposal_req["prev_insurer_id"]) {
                                                                                                                            insurer_data = insurer_list[i];
                                                                                                                            break;
                                                                                                                        }
                                                                                                                    }
                                                                                                                    if (insurer_data) {
                                                                                                                        if (insurer_data.Premium_Breakup && insurer_data.Premium_Breakup.hasOwnProperty('net_premium') && insurer_data.Premium_Breakup.net_premium) {
                                                                                                                            if (insurer_data['Service_Log_Unique_Id']) {
                                                                                                                                res.json({Status: "Success", Msg: premium_list_db_res});
                                                                                                                            } else {
                                                                                                                                res.json({Status: "Fail", Msg: "Application reference number not generated"});
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            res.json({Status: "Fail", Msg: insurer_data['Error_Msg']});
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        res.json({Status: "Fail", Msg: "Unable to fetch previous year policy insurer quotes, please compare quotes with another insurer or connect with customer care team."});
                                                                                                                    }
                                                                                                                }
                                                                                                            } else {
                                                                                                                res.json({Status: "Fail", Msg: "premium_list_db - no response"});
                                                                                                            }
                                                                                                        });
                                                                                                    }, 30000);
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    } else {
                                                                                        res.json({Status: "Fail", Msg: "premium_list_db - no response"});
                                                                                    }
                                                                                });
                                                                            }, 10000);
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                res.json({Status: "Fail", Msg: "premium_list_db - no response"});
                                                            }
                                                        });
                                                    }, 10000);
                                                }
                                            }
                                        }
                                    } else {
                                        res.json({Status: "Fail", Msg: "premium_list_db - no response"});
                                    }
                                });
                            }, 10000);
                        }
                    }
                }
            } else {
                res.json({Status: "Fail", Msg: "premium_list_db - no response"});
            }
        });
    } catch (e) {
        res.json({Status: "Fail", Msg: "Error - " + e.stack});
    }
});

router.post('/notification-auth-token', (req, res) => {
    try {
        let Notification_Auth_Token = require('../models/notification_auth_token.js');
        req.body = JSON.parse(JSON.stringify(req.body));
        let reqObj = req.body;
        let Save_Notification_Auth_Token = new Notification_Auth_Token(reqObj);
        Save_Notification_Auth_Token.save((notificationObj_err, notificationObj_data) => {
            if (notificationObj_err) {
                res.send({Status: 'FAIL', Msg: "ERROR IN SAVE DATA"});
            } else {
                res.send({Status: 'SUCCESS', Msg: "DATA INSERT SUCCESSFULLY", Data: notificationObj_data});
            }
        });
    } catch (e) {
        res.json({Status: 'FAIL', 'Msg': e.stack});
    }
});
router.get('/user_datas/fetch_agent_name', function (req, res) {
    try {
        let ss_id = req.query.ss_id || 0;
        let objSummary = {
            "Data": {},
            "Status": "",
            "Msg": ""
        };
        if (ss_id) {
            client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id, {}, function (dsa_data, dsa_res) {
                try {
                    var dsa_data = dsa_data;
                    if (dsa_data && dsa_data.status && dsa_data.status === "SUCCESS") {
                        let agent_name = "";
                        let agent_city = "";
                        let sub_vertical = "";
                        let obj_RM = dsa_data.RM || {};
                        if (obj_RM && obj_RM.rm_details) {
                            sub_vertical = obj_RM.rm_details.sub_vertical || "";
                        }
                        if (dsa_data.user_type && dsa_data.user_type === 'POSP') {
                            if (dsa_data.POSP.Middle_Name) {
                                agent_name = (dsa_data.POSP.First_Name && dsa_data.POSP.First_Name.trim() || "") + " " + dsa_data.POSP.Middle_Name && dsa_data.POSP.Middle_Name.trim() + " " + (dsa_data.POSP.Last_Name && dsa_data.POSP.Last_Name.trim() || "");
                            } else {
                                agent_name = (dsa_data.POSP.First_Name && dsa_data.POSP.First_Name.trim() || "") + " " + (dsa_data.POSP.Last_Name && dsa_data.POSP.Last_Name.trim() || "");
                            }
                            agent_city = dsa_data['POSP'].Agent_City || "";
                        } else {
                            agent_name = (dsa_data.EMP && dsa_data.EMP.Emp_Name && dsa_data.EMP.Emp_Name.trim()) || "";
                            agent_city = (dsa_data.HR && dsa_data.HR.Branch) || "";
                        }
                        agent_name = agent_name.trim();
                        agent_name = agent_name.toUpperCase();
                        objSummary["Data"]['agent_name'] = agent_name;
                        objSummary["Data"]['agent_city'] = agent_city;
                        objSummary["Data"]['sub_vertical'] = sub_vertical;
                        objSummary["Data"]['dsa_view_data'] = dsa_data;
                        objSummary["Status"] = "SUCCESS";
                        objSummary["Msg"] = "RECORD FOUND";
                        res.json(objSummary);
                    } else {
                        objSummary["Status"] = "FAIL";
                        objSummary["Msg"] = "NO DATA FOUND IN DSA API";
                        res.json(objSummary);
                    }
                } catch (e) {
                    objSummary["Status"] = "FAIL";
                    objSummary["Msg"] = "EXCEPTION IN DSA API";
                    objSummary["Data"] = e.satck;
                    res.json(objSummary);
                }
            });
        } else {
            objSummary["Status"] = "FAIL";
            objSummary["Msg"] = "SS_ID MANDATORY";
            res.json(objSummary);
        }
    } catch (e) {
        res.json({'Status': 'FAIL', 'Msg': "EXCEPTION IN MAIN API"});
    }
});

router.post('/renewal_update_user_data', (req, res) => {
    try {
        let reqObj = req.body;
        let udid = reqObj.udid;
        let UpdateObj = {
            "Premium_List.Summary.Request_Core.show_quote_initiate": reqObj.show_quote_initiate,
            "Premium_List.Summary.Request_Core.renewal_initiate": reqObj.renewal_initiate
        };
        User_Data.updateOne({User_Data_Id: udid}, UpdateObj, (err, data) => {
            if (err) {
                console.log(err);
                res.send({"Status": "FAIL", "Msg": err});
            }
            if (data && data.nModified > 0) {
                res.send({"Status": "SUCCESS", "Msg": "Data Updated"});
            } else {
                res.send({"Status": "FAIL", "Msg": "Update Failed"});
            }
        });
    } catch (e) {
        res.send({"Status": "FAIL", "Msg": e.stack});
    }
});

router.post('/get_posp_enquiry_field_visitors', LoadSession, function (req, res, next) {
    try {
        let posp_enquiry_field_visitor = require('../models/posp_enquiry_field_visitor.js');
        var Base = require('../libs/Base');
        var objBase = new Base();
        var optionPaginate = {
            sort: {'Created_On': -1},
            lean: true,
            page: 1,
            limit: 10
        };
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
        } else if (req.obj_session.hasOwnProperty('users_assigned') && req.obj_session.users_assigned.hasOwnProperty('Team')) {
            let arr_ssid = [];
            var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
            arr_ssid = combine_arr.split(',').filter(Number).map(Number);
            arr_ssid.push(req.obj_session.user.ss_id);
            filter['Created_by'] = {$in: arr_ssid};
        } else {
            filter['Created_by'] = {$in: req.obj_session.user.ss_id};
        }

        posp_enquiry_field_visitor.paginate(filter, optionPaginate).then(function (posp_enquiry_field_visitors) {
            res.json(posp_enquiry_field_visitors);
        });
    } catch (e) {
        console.error('Exception', 'get_posp_enquiry_field_visitors', e.stack);
        res.json({"Status": "FAIL", "Msg": e.stack});
    }
});
router.get('/get_posp_enquiry_field_visitors/:visitor_id?', function (req, res) {
    try {
        let posp_enquiry_field_visitor = require('../models/posp_enquiry_field_visitor.js');
        let Visitor_Id = req.params.visitor_id - 0 || "";
        let args = {};
        if (Visitor_Id) {
            args = {
                "Posp_Enquiry_Field_Visitor_ID": Visitor_Id
            };
        }
        posp_enquiry_field_visitor.find(args, function (posp_enquiry_field_visitor_err, posp_enquiry_field_visitor_data) {
            if (posp_enquiry_field_visitor_err) {
                res.json({"Status": "Fail", "Msg": "Visitor not found"});
            } else {
                if (posp_enquiry_field_visitor_data.length > 0) {
                    res.json({"Status": "Success", "Msg": "Visitors Found", "data": posp_enquiry_field_visitor_data});
                } else {
                    res.json({"Status": "Fail", "Msg": "Visitor doesn't exist.", "data": {}});
                }
            }
        });
    } catch (Ex) {
        console.error('Exception', 'get_posp_enquiry_field_visitors', Ex.stack);
        res.json({"Status": "Fail", "Msg": Ex.stack});
    }
});
router.post('/update_pospEnquiryFieldVisit', function (req, res) {
    try {
        let posp_enquiry_field_visitor = require('../models/posp_enquiry_field_visitor.js');
        let form = new formidable.IncomingForm();
        let file_prefix = "";
        let posp_Enquiry_Field_Visitor_ID = "";
        let file_name_prefix = {
            "Profile": "Visitor_Profile",
            "Client": "Client_Profile",
            "VisitorDoc": {"PAN": "Visitor_PanCard", "VisitingCard": "Visitor_Visiting_Card"},
            "ClientDoc": {"PAN": "Client_PanCard", "AADHAAR": "Client_Aadhar_Card"}
        };
        let formDocFields = {"Profile": "Visitor_Profile_Photo_URL", "Client": "Client_Profile_Photo_URL", "VisitorDoc": "Visitor_Doc_URL", "ClientDoc": "Client_Doc_URL"};
        var enquiry_field_visitor_obj = {};
        form.parse(req, function (err, fields, files) {
            var objRequestFields = fields;
            Object.keys(objRequestFields).find(key => {
                enquiry_field_visitor_obj[key] = objRequestFields[key];
            });
            var objRequestFiles = files;
            if (!fs.existsSync(appRoot + "/tmp/posp_enquiry_field_visitors")) {
                fs.mkdirSync(appRoot + "/tmp/posp_enquiry_field_visitors");
            }
            if (objRequestFields.Posp_Enquiry_Field_Visitor_ID) {
                enquiry_field_visitor_obj["Modified_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                posp_Enquiry_Field_Visitor_ID = objRequestFields.Posp_Enquiry_Field_Visitor_ID;
                if (objRequestFiles !== undefined && JSON.stringify(objRequestFiles) !== "{}") {
                    for (let i in objRequestFiles) {
                        let name_arr = objRequestFiles[i].name.split('.');
                        file_prefix = file_name_prefix[i];
                        if (i === "VisitorDoc" || i === "ClientDoc") {
                            let doc_type = "";
                            if (i === "VisitorDoc") {
                                doc_type = objRequestFields.Visitor_Doc_Type;
                            } else {
                                doc_type = objRequestFields.Client_Doc_Type;
                            }
                            file_prefix = file_name_prefix[i][doc_type];
                        }

                        let file_name = file_prefix + '.' + name_arr[name_arr.length - 1];
                        let file_sys_loc_horizon = appRoot + "/tmp/posp_enquiry_field_visitors/" + posp_Enquiry_Field_Visitor_ID + "/" + file_name;
                        let file_web_path_horizon = config.environment.downloadurl + "/postservicecall/download/posp_enquiry_field_visitors/" + posp_Enquiry_Field_Visitor_ID + "/" + file_name;

                        let oldpath = objRequestFiles[i].path;
                        let read_data = fs.readFileSync(oldpath, {});
                        try {
                            fs.writeFileSync(file_sys_loc_horizon, read_data, {});
                        } catch (ex) {
                            res.json({"Status": "Fail", "Msg": ex.stack});
                        }
                        fs.unlink(oldpath, function (err) {
                            if (err)
                                res.json({'Status': "Fail", 'Msg': "Error in deleting a file", "data": err});
                        });
                        enquiry_field_visitor_obj[formDocFields[i]] = file_web_path_horizon;
                    }
                }
                posp_enquiry_field_visitor.findOneAndUpdate({"Posp_Enquiry_Field_Visitor_ID": posp_Enquiry_Field_Visitor_ID}, {$set: enquiry_field_visitor_obj}, {new : true}, function (posp_update_err, posp_update_data) {
                    if (posp_update_err) {
                        res.json({"Status": "Fail", "Msg": posp_update_err});
                    } else {
                        res.json({"Status": "Success", "Msg": "Data Updated Successfully.", "Data": posp_update_data});
                    }
                });
            } else {
                enquiry_field_visitor_obj["Created_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                enquiry_field_visitor_obj["Modified_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                let posp_enquiryFieldVisit_obj = new posp_enquiry_field_visitor(enquiry_field_visitor_obj);
                posp_enquiryFieldVisit_obj.save().then(function (equiryFields_save_res) {
                    let data = equiryFields_save_res._doc;
                    let visitor_id = data.Posp_Enquiry_Field_Visitor_ID || "";
                    if (visitor_id) {
                        if (objRequestFiles !== undefined && JSON.stringify(objRequestFiles) !== "{}") {
                            if (!fs.existsSync(appRoot + "/tmp/posp_enquiry_field_visitors/" + visitor_id)) {
                                fs.mkdirSync(appRoot + "/tmp/posp_enquiry_field_visitors/" + visitor_id);
                            }
                            let update_field_visitor_obj = {};
                            for (let i in objRequestFiles) {
                                let name_arr = objRequestFiles[i].name.split('.');
                                file_prefix = file_name_prefix[i];
                                if (i === "VisitorDoc" || i === "ClientDoc") {
                                    let doc_type = "";
                                    if (i === "VisitorDoc") {
                                        doc_type = objRequestFields.Visitor_Doc_Type;
                                    } else {
                                        doc_type = objRequestFields.Client_Doc_Type;
                                    }
                                    file_prefix = file_name_prefix[i][doc_type];
                                }

                                let file_name = file_prefix + '.' + name_arr[name_arr.length - 1];
                                let file_sys_loc_horizon = appRoot + "/tmp/posp_enquiry_field_visitors/" + visitor_id + "/" + file_name;
                                let file_web_path_horizon = config.environment.downloadurl + "/postservicecall/download/posp_enquiry_field_visitors/" + visitor_id + "/" + file_name;

                                let oldpath = objRequestFiles[i].path;
                                let read_data = fs.readFileSync(oldpath, {});
                                fs.writeFileSync(file_sys_loc_horizon, read_data, {});
                                fs.unlink(oldpath, function (err) {
                                    if (err)
                                        res.json({'Status': "Fail", 'Msg': "Error in deleting a file", "data": err});
                                });
                                update_field_visitor_obj[formDocFields[i]] = file_web_path_horizon;
                            }
                            posp_enquiry_field_visitor.findOneAndUpdate({"Posp_Enquiry_Field_Visitor_ID": visitor_id}, {$set: update_field_visitor_obj}, {new : true}, function (posp_update_err, posp_update_res) {
                                if (posp_update_err) {
                                    res.json({"Status": "Fail", "Msg": posp_update_err});
                                } else {
                                    res.json({"Status": "Success", "Msg": "Data Saved Successfully.", "Data": posp_update_res});
                                }
                            });
                        } else {
                            res.json({"Status": "Success", "Msg": "Files not uploaded."});
                        }
                    }
                }).catch(function (equiryFields_save_err) {
                    res.json({"Status": "Fail", "Msg": equiryFields_save_err});
                });
            }
        });
    } catch (ex) {
        console.error('Exception', 'update_pospEnquiryFieldVisit', ex.stack);
        res.json({"Status": "Fail", "Msg": ex.stack});
    }
});
router.get('/download/posp_enquiry_field_visitors/:folder/:file', function (req, res) {
    let urlpath = req.url;
    let folder = req.params.folder;
    let file = req.params.file;
    res.sendFile(path.join(appRoot + '/tmp/posp_enquiry_field_visitors/' + folder + '/' + file));
});

function renewal_recalculate(req, res, next) {
    try {
        var reqObj = req.body;
        if (reqObj.recalculate) {
            var premium_args = {
                data: reqObj.proposal_req,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            };
            client.post(config.environment.weburl + '/quote/premium_initiate', premium_args, (premium_initiate_res) => {
                try {
                    if (premium_initiate_res.hasOwnProperty('Status') && premium_initiate_res['Status'] === "VALIDATION") {
                        res.json({"Status": "Fail", "Msg": premium_initiate_res['Details']});
                    } else {
                        if (premium_initiate_res && premium_initiate_res.Summary && premium_initiate_res.Summary.Request_Unique_Id) {
                            var srn = premium_initiate_res['Summary']['Request_Unique_Id'];
                            reqObj.proposal_req["search_reference_number"] = srn;
                            var call_premium_list_db_args = {
                                data: {
                                    "premium_list_db_args": {
                                        "search_reference_number": srn,
                                        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                                        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
                                    },
                                    "req": reqObj
                                },
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json"
                                }
                            };
                            client.post(config.environment.weburl + "/postservicecall/renewal_call_premium_list_db", call_premium_list_db_args, (premium_list_db_res) => {
                                if (premium_list_db_res) {
                                    if (premium_list_db_res['Status'] && premium_list_db_res['Status'] === "Success") {
                                        var insurer_list = premium_list_db_res['Msg']['Response'];
                                        var insurer_data;
                                        for (var i = 0; i < insurer_list.length; i++) {
                                            if (insurer_list[i]['Insurer_Id'] === reqObj.proposal_req["prev_insurer_id"]) {
                                                insurer_data = insurer_list[i];
                                                break;
                                            }
                                        }
                                        if (insurer_data) {
                                            if (insurer_data.Premium_Breakup && insurer_data.Premium_Breakup.hasOwnProperty('net_premium') && insurer_data.Premium_Breakup.net_premium) {
                                                if (insurer_data['Service_Log_Unique_Id']) {
                                                    reqObj.arn = insurer_data['Service_Log_Unique_Id'];
                                                    reqObj.proposal_req.arn = insurer_data['Service_Log_Unique_Id'];
                                                    reqObj.proposal_req.api_reference_number = insurer_data['Service_Log_Unique_Id'];
                                                    next();
                                                } else {
                                                    res.json({Status: "Fail", Msg: "Application reference number not generated", "Data": {"srn": srn}});
                                                }
                                            } else {
                                                res.json({Status: "Fail", Msg: insurer_data['Error_Msg'], "Data": {"srn": srn}});
                                            }
                                        } else {
                                            res.json({Status: "Fail", Msg: "Unable to fetch previous year policy insurer quotes, please compare quotes with another insurer or connect with customer care team.", "Data": {"srn": srn}});
                                        }
                                    } else {
                                        res.json({Status: "Fail", Msg: premium_list_db_res['Msg'] || "premium_list_db  - no response", "Data": {"srn": srn}});
                                    }
                                } else {
                                    res.json({Status: "Fail", Msg: "premium_list_db - no response"});
                                }
                            });
                        } else {
                            res.json({Status: "Fail", Msg: JSON.stringify(premium_initiate_res.Msg) || "INVALID REQUEST"});
                        }
                    }
                } catch (e) {
                    res.json({Status: "Fail", Msg: "Error /premium_initiate - " + e.stack});
                }
            });
        } else {
            next();
        }
    } catch (e) {
        res.json({Status: "Fail", Msg: "Error - " + e.stack});
    }
}

router.post('/wrapper_api_https', function (req, res) {
    req.body = JSON.parse(JSON.stringify(req.body));
    let ObjRequest = req.body;
    let method_type_class = req.query;
    let insurer_name = method_type_class.insurer_name;
    let method_type = method_type_class.method_type;
    let username = method_type_class.username;
    let password = method_type_class.password;
    let tmpdata = ObjRequest;
    let ObjServiceURL = "";
    let service_url = "";
    let product_id = ObjRequest.product_id;
    let request_core = ObjRequest.request_core;
    if (product_id === 19) {
        tmpdata = request_core;
        service_url = ObjRequest.service_url;
        username = ObjRequest.username;
        password = ObjRequest.password;
    } else {
        ObjServiceURL = {
            "Idv": "https://qnb.godigit.com/digit/motor-insurance/services/integration/v2/quickquote?isUserSpecialDiscountOpted=false",
            "Premium": "https://qnb.godigit.com/digit/motor-insurance/services/integration/v2/quickquote?isUserSpecialDiscountOpted=false",
            "Customer": "https://qnb.godigit.com/digit/motor-insurance/services/integration/v2/quote?isUserSpecialDiscountOpted=false",
            "Proposal": "https://prod-digitpaymentgateway.godigit.com/DigitPaymentGateway/rest/insertPaymentOnline/EB/Motor"
        };
        service_url = ObjServiceURL[method_type];
    }
    let args = {
        data: JSON.stringify(tmpdata),
        headers: {
            "Content-Type": "application/json",
            'accept': '*/*',
            'Connection': "close"
        }
    };
    console.error('insurer_service_url', service_url);
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    let https = require('https');
    let http = require('http');
    let post_http = "";
    if (ObjRequest.service_url && ObjRequest.service_url.includes("https")) {
        post_http = https;
    } else {
        post_http = http;
    }
    let url = require('url');
    let q = url.parse(service_url, true);
    let options = {
        protocol: q.protocol,
        hostname: q.host,
        method: 'POST',
        path: q.pathname,
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
        }
    };
    let obj_royal_log = {
        "get": req.query,
        "post": req.body,
        "option": options,
        "response": "",
        "error": ""
    };
    let request_royal = post_http.request(options, (response_royal) => {
        let data_royal = '';
        console.error(insurer_name + 'wrapper LINE 1');
        response_royal.on('data', (chunk) => {
            data_royal = data_royal + chunk.toString();
        });

        response_royal.on('end', () => {
            let res_body = data_royal;
            obj_royal_log["response"] = res_body;
            res.json(obj_royal_log);
        });
    });
    request_royal.on('error', (error) => {
        obj_royal_log["error"] = error;
        res.json(obj_royal_log);
    });
    request_royal.write(JSON.stringify(tmpdata));
    request_royal.end();
}); 
router.post('/kyc_details/oriental_token_generation', function (req, res) {
    try {
        let ObjRequest = req.body;
        let req_txt = "";
        if (config.environment.name === 'Production') {
            req_txt = {
                appId: "c68gtb",
                appKey: "4ctkxz1mbq7mktsw4ehp",
                expiry: 300
            };
        } else {
            req_txt = {
                appId: "78d6mu",
                appKey: "0vkjfunmy3ei1cumhqz5",
                expiry: 300
            };
        }
        let args = {
            data: JSON.stringify(req_txt),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        let LM_Data = {
            "transactionId": ObjRequest.Quote_ID ? ObjRequest.Quote_ID : '',
            "workflowId": "portal_kyc_flow"
        };
        var Client = require('node-rest-client').Client;
        var client = new Client();
        let oriental_create_kyc_service_url = ((config.environment.name === 'Production') ? 'https://auth.hyperverge.co/login' : 'https://auth.hyperverge.co/login');
        client.post(oriental_create_kyc_service_url, args, function (data, response) {
            try {
                //Save Token Logs
                let log_data = {
                    "Insurer_API": "Token",
                    "Request": LM_Data,
                    "Response": data,
                    "UDID": ObjRequest['api_reference_number'] ? ObjRequest['api_reference_number'].split('_')[2] : "",
                    "PB_CRN": ObjRequest['PB_CRN'] ? ObjRequest['PB_CRN'] : ""
                };
                let args = {
                    data: JSON.stringify(log_data),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                };
                client.post(config.environment.weburl + '/postservicecall/oriental_save_log', args, function (ObjRequest, response) {
                    try {
                        console.error({"Insurer": "Oriental", "Msg": "file save Successfully", "Status": "SUCCESS"});
                    } catch (e1) {
                        console.error({"Insurer": "Oriental", "Msg": e1.stack, "Status": "FAIL"});
                    }
                });
                //Save Token Logs End

                if (data['result'].token) {
                    LM_Data['token'] = data['result'].token;
                    res.json({"Insurer": "Oriental", "Msg": LM_Data, "Status": data.status});
                } else {
                    res.json({"Insurer": "Oriental", "Msg": data.error, "Status": "FAIL"});
                }
            } catch (err) {
                res.json({"Insurer": "Oriental", "Msg": err.stack, "Status": "FAIL"});
            }
        });
    } catch (e1) {
        res.json({"Insurer": "Oriental", "Msg": e1.stack, "Status": "FAIL"});
    }
});
router.post("/kyc_details/oriental_fetch_kyc_details", function (req, res) {
    try {
        var ObjRequest = req.body;
        let proposal_request = ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : "";
        let insurer_id = ObjRequest.Insurer_Id ? ObjRequest.Insurer_Id : 13;
        let LM_Data = {};
        let saveObj = {};
        let crn = ObjRequest.PB_CRN ? ObjRequest.PB_CRN : "";
        let udid = ObjRequest.User_Data_Id ? ObjRequest.User_Data_Id : "";
        let cust_name = "";
        var Client = require('node-rest-client').Client;
        var client = new Client();
        if (proposal_request.middle_name === undefined || proposal_request.middle_name === "" || proposal_request.middle_name === null) {
            cust_name = (proposal_request.first_name === undefined || proposal_request.first_name === "" || proposal_request.first_name === null ? "" : proposal_request.first_name) + " " + (proposal_request.last_name === undefined || proposal_request.last_name === "" || proposal_request.last_name === null ? "" : proposal_request.last_name);
        } else {
            cust_name = (proposal_request.first_name === undefined || proposal_request.first_name === "" || proposal_request.first_name === null ? "" : proposal_request.first_name) + " " +
                    (proposal_request.middle_name === undefined || proposal_request.middle_name === "" || proposal_request.middle_name === null ? "" : proposal_request.middle_name) + " " + (proposal_request.last_name === undefined || proposal_request.last_name === "" || proposal_request.last_name === null ? "" : proposal_request.last_name);
        }
        let kyc_create_request = ObjRequest.hasOwnProperty('KYC_Request_Core') ? ObjRequest['KYC_Request_Core'] : "";
        let kyc_create_response = ObjRequest['KYC_Response_Core'];
        let insurer_response_data = kyc_create_response.hasOwnProperty('details') ? kyc_create_response['details'] : "";
        //saving logs

        let log_data = {
            "Insurer_API": "Verify",
            "Request": kyc_create_request,
            "Response": kyc_create_response,
            "UDID": ObjRequest['User_Data_Id'],
            "PB_CRN": ObjRequest['PB_CRN'] ? ObjRequest['PB_CRN'] : ""
        };
        let args_data = {
            data: JSON.stringify(log_data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };
        client.post(config.environment.weburl + '/postservicecall/oriental_save_log', args_data, function (ObjRequest, response) {
            try {
                console.error({"Insurer": "Oriental", "Msg": "file save Successfully", "Status": "SUCCESS"});
            } catch (e1) {
                console.error({"Insurer": "Oriental", "Msg": e1.stack, "Status": "FAIL"});
            }
        });

        LM_Data = {
            "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
            "KYC_Number": insurer_response_data && insurer_response_data.hasOwnProperty('ckycNo') ? insurer_response_data.ckycNo : "",
            "KYC_FullName": insurer_response_data && insurer_response_data.hasOwnProperty('insuredName') ? insurer_response_data.insuredName : "",
            "KYC_Ref_No": insurer_response_data && insurer_response_data.hasOwnProperty('ckycNo') ? insurer_response_data.ckycNo : "",
            "KYC_Redirect_URL": ObjRequest['KYC_Redirect_URL'] ? ObjRequest['KYC_Redirect_URL'] : "",
            "KYC_Insurer_ID": ObjRequest.Insurer_Id ? ObjRequest.Insurer_Id : 13,
            "KYC_PB_CRN": ObjRequest.PB_CRN ? ObjRequest.PB_CRN : "",
            "KYC_Status": kyc_create_response.status === "auto_approved" ? "FETCH_SUCCESS" : "FETCH_FAIL",
            "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "PAN" : ObjRequest.Document_Type, //"PAN",
            "KYC_Request": kyc_create_request,
            "KYC_Response": kyc_create_response,
            "mobileNumber": insurer_response_data && insurer_response_data.hasOwnProperty('mobileNo') ? insurer_response_data.mobileNo : "",
            "DOB": insurer_response_data && insurer_response_data.hasOwnProperty('dob') ? insurer_response_data.dob : "",
            "PAN": insurer_response_data && insurer_response_data.hasOwnProperty('individualPAN') ? insurer_response_data.individualPAN : "",
            'Product_Id': (ObjRequest.Product_Id === undefined || ObjRequest.Product_Id === "" || ObjRequest.Product_Id === null) ? 0 : ObjRequest.Product_Id - 0,
            'User_Data_Id': udid,
            'Email': (proposal_request.email === undefined || proposal_request.email === "" || proposal_request.email === null) ? "" : proposal_request.email,
            'Proposal_Id': ObjRequest.hasOwnProperty('Proposal_Id') ? ObjRequest.Proposal_Id : "",
            'ckyc_remarks': ObjRequest.KYC_Response_Core && ObjRequest.KYC_Response_Core.status === "auto_approved" ? "NA" : ObjRequest.KYC_Response_Core.status,
            'Error_Msg':ObjRequest.KYC_Response_Core && ObjRequest.KYC_Response_Core.status === "auto_approved" ? "" : ObjRequest.KYC_Response_Core.status
        };

        saveObj = {
            'Insurer_Id': insurer_id,
            'Search_Type': (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "PAN" : ObjRequest.Document_Type,
            'KYC_Number': insurer_response_data && insurer_response_data.hasOwnProperty('ckycNo') ? insurer_response_data.ckycNo : "",
            'Mobile': (proposal_request.mobile === undefined || proposal_request.mobile === "" || proposal_request.mobile === null) ? "" : proposal_request.mobile - 0,
            'PAN': (proposal_request.pan === undefined || proposal_request.pan === "" || proposal_request.pan === null) ? "" : proposal_request.pan,
            'Aadhar': (proposal_request.aadhar === undefined || proposal_request.aadhar === "" || proposal_request.aadhar === null) ? "" : proposal_request.aadhar,
            'Document_Type': (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,
            'Document_ID': (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
            'KYC_Status': kyc_create_response.status === "auto_approved" ? "FETCH_SUCCESS" : "FETCH_FAIL",
            'DOB': insurer_response_data && insurer_response_data.hasOwnProperty('dob') ? insurer_response_data.dob : "",
            'Created_On': new Date(),
            'Modified_On': new Date(),
            'User_Data_Id': udid,
            'Product_Id': (ObjRequest.Product_Id === undefined || ObjRequest.Product_Id === "" || ObjRequest.Product_Id === null) ? 0 : ObjRequest.Product_Id - 0,
            'Email': (proposal_request.email === undefined || proposal_request.email === "" || proposal_request.email === null) ? "" : proposal_request.email,
            'PB_CRN': (ObjRequest.PB_CRN === undefined || ObjRequest.PB_CRN === "" || ObjRequest.PB_CRN === null) ? "" : ObjRequest.PB_CRN - 0,
            'Proposal_Request': proposal_request,
            'Proposal_Id': ObjRequest.hasOwnProperty('Proposal_Id') ? ObjRequest.Proposal_Id : "",
            'Quote_Id': ObjRequest.hasOwnProperty('Quote_Id') ? ObjRequest.Quote_Id : "",
            'KYC_URL': "",
            'KYC_Ref_No': kyc_create_response && kyc_create_response.ckycNo ? kyc_create_response.ckycNo : "",
            'Full_Name': cust_name,
            'KYC_Full_Name': insurer_response_data && insurer_response_data.hasOwnProperty('insuredName') ? insurer_response_data.insuredName : cust_name,
            'proposal_page_url': ObjRequest.hasOwnProperty('proposal_url') ? ObjRequest.proposal_url : "",
            'service_log_id': proposal_request.hasOwnProperty('slid') ? proposal_request.slid : ""
        };

        kyc_detail.findOne({'PB_CRN': crn, 'Insurer_Id': insurer_id}).sort({Modified_On: -1}).exec(function (err, db_save_kyc_detail) {
            if (err) {
                res.json({"Msg": err, "Status": "FAIL"});
            } else {
                if (db_save_kyc_detail) {
                    let req_txt = {
                        "ObjRequest": ObjRequest ? ObjRequest : "",
                        "LM_Data": LM_Data ? LM_Data : "",
                        "kyc_create_request": kyc_create_request ? kyc_create_request : "",
                        "kyc_create_response": kyc_create_response ? kyc_create_response : ""
                    };
                    let args = {
                        data: JSON.stringify(req_txt),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        }
                    };
                    let url_api = config.environment.weburl + '/kycdetails/update_kyc_log';
                    client.post(url_api, args, function (data, response) {
                        try {
                            res.json({"Insurer": "Oriental", "Msg": LM_Data, "Status": LM_Data['KYC_Status']});
                        } catch (e1) {
                            console.error({"Insurer": "Oriental", "Msg": e1.stack, "Status": "FAIL"});
                            res.json({"Insurer": "Oriental", "Msg": LM_Data, "Status": LM_Data['KYC_Status']});
                        }
                    });
                } else {
                    let kyc_detail1 = new kyc_detail(saveObj);
                    kyc_detail1.save(saveObj, function (err, users) {
                        if (err) {
                            res.json({"Msg": err, "Status": "FAIL"});
                        } else {
                            let req_txt = {
                                "ObjRequest": ObjRequest ? ObjRequest : "",
                                "LM_Data": LM_Data ? LM_Data : "",
                                "kyc_create_request": kyc_create_request ? kyc_create_request : "",
                                "kyc_create_response": kyc_create_response ? kyc_create_response : ""

                            };
                            let args = {
                                data: JSON.stringify(req_txt),
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json"
                                }
                            };
                            let url_api = config.environment.weburl + '/kycdetails/update_kyc_log';
                            client.post(url_api, args, function (data, response) {
                                try {
                                    res.json({"Insurer": "Oriental", "Msg": LM_Data, "Status": LM_Data['KYC_Status']});
                                } catch (e1) {
                                    console.error({"Insurer": "Oriental", "Msg": e1.stack, "Status": "FAIL"});
                                    res.json({"Insurer": "Oriental", "Msg": LM_Data, "Status": LM_Data['KYC_Status']});
                                }
                            });
                        }
                    });
                }
            }
        });
    } catch (error) {
        res.json({"Insurer": "Oriental", "Msg": error.stack, "Status": "FAIL"});
    }
});

router.post("/oriental_save_log", function (req, res) {
    try {
        ObjRequest = req.body;
        //saving log file for Oriental KYC
        let log_data = {
            "Insurer_Api": ObjRequest['Insurer_API'],
            "Request": ObjRequest['Request'],
            "Response": ObjRequest['Response'],
            "PB_CRN": ObjRequest.PB_CRN ? ObjRequest.PB_CRN : "",
            "UDID": ObjRequest.UDID ? ObjRequest.UDID : "",
            "Created_On": new Date()
        };
        var logFilePath = appRoot + "/tmp/log/Oriental_KYC.log";// + today_str + ".log";
        var logData = JSON.stringify(log_data) + "\n-------------------------------------------\r\n";
        fs.appendFile(logFilePath, logData, function (err) {
            if (err) {
                return res.json({"Insurer": "Oriental", "Msg": err.stack, "Status": "FAIL"});
            }
            res.json({"Insurer": "Oriental", "Msg": "Oriental File Saved", "Status": "SUCCESS"});
        });
    } catch (error) {
        res.json({"Insurer": "Oriental", "Msg": error.stack, "Status": "FAIL"});
    }
});

router.post('/inspection_status', function (req, res) {
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        let objRequest = req.body;
        var inspection = require('../models/inspection_schedule');
        let condition = {
            PB_CRN: objRequest.PB_CRN,
            UD_Id: objRequest.UD_Id,
            Registration_No: objRequest.Registration_no,
            Chassis_No: objRequest.Chassis_no,
            Engine_No: objRequest.Engine_no
        };
        inspection.findOne(condition, function (err, insp_data) {
            if (err) {
                res.send({Status: "FAIL", Msg: "error in inspection " + err});
            } else if (insp_data) {
                res.send({Status: "SUCCESS", Msg: insp_data});
            } else {
                res.send({Status: "PENDING", Msg: "Data Not Found!"});
            }
        });
    } catch (e) {
        console.error("Exception in Inspection status ", e.stack);
        res.send({Status: "FAIL", Msg: "error in inspection " + e.stack});
    }
    ;
});

router.post('/motor_renewal_lead_logs', function (req, res) {
    try {
        let objRequest = req.body;
        let motor_renewal_lead = require('../models/motor_renewal_lead');
        var motor_renewal_lead_data = new motor_renewal_lead();
        for (var key in objRequest) {
            motor_renewal_lead_data[key] = objRequest[key];
        }
        motor_renewal_lead_data.Created_On = new Date();
        motor_renewal_lead_data.Modified_On = new Date();

        motor_renewal_lead_data.save(function (err1) {
            if (err1) {
                res.json({'Msg': '', Status: 'FAIL'});
            } else {
                res.json({'Msg': 'Saved Succesfully!!!', Status: 'SUCCESS'});
            }
        });
    } catch (err) {
        res.json({"Msg": err.stack, "Status": "FAIL"});
    }


});

router.get('/call_online_renewal_policy/:reg_no', function (req, res) {
    try {
        let reqQuery = req.query;
        let request_query_string = "";
        request_query_string = jsonToQueryString(reqQuery);
        request_query_string = request_query_string ? ("?" + request_query_string) : "";
        let reg_no = req.params.reg_no;
        client.get(config.environment.weburl + '/online_renewal_policy/' + reg_no + request_query_string, function (data, response) {
            res.json(data);
        });
    } catch (err) {
        res.json({"Msg": err.stack, "Status": "FAIL"});
    }
});

//royal inspection status
router.post('/royalSundaram_update_inspection_status', function (req, res2, next) {
    let responseObj = req.body;
    try {
        if (responseObj.hasOwnProperty('Request_Post') && responseObj['Request_Post'] !== "") {
            let royal_breakin_status = '';
            let email_template = '';
            let email_sub_status = '';
            let inspection_status_msg = '';
            let data = responseObj['Request_Post'] ? responseObj['Request_Post'] : "";

            if ((data.hasOwnProperty('Quote_id')) && data['Quote_id'] !== '' && (data.hasOwnProperty('VIRStatus')) && (data.hasOwnProperty('Premium')) && (data.hasOwnProperty('PaymentLink'))) {
                if ((data.hasOwnProperty('VIRStatus')) && (data['VIRStatus'] === 'recommended') && (data['PaymentLink'] !== '')) {
                    royal_breakin_status = 'INSPECTION_APPROVED';
                    email_template = 'Send_Inspection_Status.html';
                    email_sub_status = 'Successful';
                    Error_Msg = royal_breakin_status;
                } else if ((data.hasOwnProperty('VIRStatus')) && (data['VIRStatus'] === 'Not recommended')) {
                    royal_breakin_status = 'INSPECTION_REJECTED';
                    email_template = 'Send_Inspection_Status.html'; //'Send_UnSuccessful_Inspection.html';
                    email_sub_status = 'Unsuccessful';
                    Error_Msg = royal_breakin_status;
                } else {
                    Error_Msg = JSON.stringify(data);
                }

                let inspectionSchedules = require(appRoot + '/models/inspection_schedule');
                let query = {Inspection_Id: data['Quote_id']};
                inspectionSchedules.findOne(query, function (err, objInsurerProduct) {
                    if (err) {
                        throw err;
                    } else {
                        let queryObj = {
                            PB_CRN: parseInt(objInsurerProduct['PB_CRN']),
                            UD_Id: parseInt(objInsurerProduct['UD_Id']),
                            SL_Id: parseInt(objInsurerProduct['SL_Id']),
                            Insurer_Id: 10,
                            Request_Unique_Id: objInsurerProduct['Request_Unique_Id'],
                            Service_Log_Unique_Id: objInsurerProduct['Service_Log_Unique_Id'],
                            Inspection_Number: objInsurerProduct['Inspection_Id'],
                            Status: royal_breakin_status,
                            Insurer_Request: data,
                            Insurer_Response: data,
                            Service_Call_Status: 'complete',
                            Created_On: new Date(),
                            Modified_On: ''
                        };
                        // insert data in inspection breakin
                        let inspectionBreakin = require(appRoot + '/models/inspection_breakin');
                        let inspectionBreakins = new inspectionBreakin(queryObj);
                        inspectionBreakins.save(function (err, inspectionBreakinsdb) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("royalSundaram_update_inspection_status() inspectionBreakinsdb : ", inspectionBreakinsdb.insertedCount, inspectionBreakinsdb.result);
                            }
                        });

                        // update data in inspection schedule
                        try {
                            let today = new Date();
                            let myquery = {Inspection_Id: objInsurerProduct['Inspection_Id'], PB_CRN: objInsurerProduct['PB_CRN'], UD_Id: objInsurerProduct['UD_Id']};
                            let newvalues = {Insurer_Status: "CHECKED", Status: royal_breakin_status, Modified_On: today};
                            var inspection_schedule = require('../models/inspection_schedule');
                            inspection_schedule.updateOne(myquery, newvalues, function (uperr, upres) {
                                if (uperr) {
                                    Error_Msg = uperr;
                                    throw uperr;
                                } else {
                                    console.log("royalSundaram_update_inspection_status() BreakIn Status Updated for : ", objInsurerProduct['Inspection_Id'], ", UD_Id : ", objInsurerProduct['UD_Id']);
                                    console.log(" RoyalMotor : UD_Id : ", objInsurerProduct['UD_Id'], upres);
                                }
                            });
                        } catch (ex4) {
                            Error_Msg = ex4;
                            console.error('Exception in royalSundaram_update_inspection_status() for inspection_schedule DB updating : ', ex4);
                        }

                        try {
                            let User_Data = require(appRoot + '/models/user_data');
                            let ud_cond = {"User_Data_Id": objInsurerProduct['UD_Id']};
                            User_Data.findOne(ud_cond, function (err, dbUserData) {
                                if (err) {
                                    console.error('Exception in  royalSundaram_update_inspection_status() : ', err);
                                } else {
                                    dbUserData = dbUserData._doc;
                                    let myquery1 = {
                                        "User_Data_Id": dbUserData.User_Data_Id,
                                        "Request_Unique_Id": objInsurerProduct['Request_Unique_Id']
                                    };
                                    let newvalues1 = '';
                                    let Status_History = (dbUserData.hasOwnProperty('Status_History')) ? dbUserData.Status_History : [];
                                    Status_History.unshift({
                                        "Status": royal_breakin_status,
                                        "StatusOn": new Date()
                                    });

                                    newvalues1 = {
                                        "Last_Status": royal_breakin_status,
                                        "Status_History": Status_History,
                                        "Premium_Request.is_inspection_done": "yes",
                                        "Modified_On": new Date()
                                    }, {upsert: false, multi: false};


                                    User_Data.updateOne(myquery1, newvalues1, function (err, numAffected) {
                                        console.log('royalSundaram_update_inspection_status() UserDataUpdated : ', err, numAffected);
                                    });

                                    let payment_link = "";
                                    if (royal_breakin_status === 'INSPECTION_APPROVED') {
                                        payment_link = data['PaymentLink'] ? data['PaymentLink'] : "";
                                        console.log("royalSundaram_update_inspection_status() payment_link : ", payment_link);
                                    }
                                    let Client2 = require('node-rest-client').Client;
                                    let client2 = new Client2();
                                    client2.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(payment_link), function (urlData, urlResponse) {
                                        try {
                                            let short_url_value = "";
                                            if (royal_breakin_status === 'INSPECTION_APPROVED' && payment_link && payment_link !== '') {
                                                inspection_status_msg = 'Your Vehicle Inspection has been done successfully. Payment Link is : ';
                                                short_url_value = urlData.Short_Url;
                                                console.log("royalSundaram_update_inspection_status() inspection_status_msg : ", inspection_status_msg, short_url_value);
                                            }
                                            if (royal_breakin_status === 'INSPECTION_REJECTED') {
                                                inspection_status_msg = 'Your Vehicle Inspection has been Rejected. REMARKS';
                                                console.log("royalSundaram_update_inspection_status() inspection_status_msg : ", inspection_status_msg);
                                                short_url_value = "";
                                            }
                                            let dataObj = dbUserData['Proposal_Request_Core'];
                                            let objRequestCore = {
                                                'customer_name': dataObj['first_name'] + ' ' + dataObj['last_name'],
                                                'crn': dataObj['crn'],
                                                'vehicle_text': dataObj['vehicle_text'],
                                                'insurer_name': 'Royal GENERAL INSURANCE CO. LTD.',
                                                'insurance_type': 'RENEW - Breakin Case',
                                                'inspection_id': objInsurerProduct['Inspection_Id'],
                                                'final_premium': dbUserData.Proposal_Request_Core['final_premium'],
                                                'email_id': dataObj['email'],
                                                'registration_no': dbUserData['Insurer_Transaction_Identifier'],
                                                'inspection_status_msg': inspection_status_msg,
                                                'short_url': short_url_value
                                            };
                                            let processed_request = {};
                                            for (let key in objRequestCore) {
                                                if (typeof objRequestCore[key] !== 'object') {
                                                    processed_request['___' + key + '___'] = objRequestCore[key];
                                                }
                                            }
                                            console.error('Breakin Email', royal_breakin_status);
                                            if (royal_breakin_status === 'INSPECTION_APPROVED' || royal_breakin_status === 'INSPECTION_REJECTED') {
                                                let email_data = fs.readFileSync(appRoot + '/resource/email/' + email_template).toString();
                                                email_data = email_data.replaceJson(processed_request);
                                                let emailto = dataObj['email'];
                                                let sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification ' + email_sub_status + ' CRN : ' + dataObj['crn'];
                                                let Email = require(appRoot + '/models/email');
                                                let objModelEmail = new Email();
                                                let email_agent = '';
                                                if (dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                                    email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                                                }
                                                let arr_bcc = [config.environment.notification_email];
                                                if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== 0 && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
                                                    if (dbUserData.Premium_Request['posp_reporting_email_id'].indexOf('@') > -1) {
                                                        arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                                    }
                                                }
                                                if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] !== null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
                                                    arr_bcc.push(dbUserData['Premium_Request']['posp_sub_fba_email']);
                                                }
                                                if (config.environment.name === 'Production') {
                                                    if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                                                        if ((dbUserData.Premium_Request['posp_sources'] - 0) === 1) {
                                                            arr_bcc.push('transactions.1920@gmail.com'); //finmart-dc 
                                                        }
                                                    }
                                                }
                                                objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), dbUserData['PB_CRN']);
                                                res2.json({'Status': "SUCCESS", "Msg": Error_Msg});
                                            }
                                        } catch (e) {
                                            console.error('Exception in royalSundaram_update_inspection_status() for mailing : ', e);
                                            res2.json({'Status': "FAIL", "Msg": e});
                                        }
                                    });
                                }
                            });
                        } catch (ex2) {
                            console.error('Exception in royalSundaram_update_inspection_status() for User_Data db details : ', ex2);
                            res2.json({'Status': "FAIL", "Msg": ex2});
                        }
                    }
                });
            } else {
                Error_Msg = JSON.stringify(data);
                res2.json({'Status': "FAIL", "Msg": Error_Msg});
            }
        } else {
            Error_Msg = JSON.stringify(data);
            res2.json({'Status': "FAIL", "Msg": Error_Msg});
        }

    } catch (ex3) {
        console.error('Exception in royalSundaram_update_inspection_status() for User_Data db details : ', ex3);
        res2.json({'Status': "FAIL", "Msg": ex3});
    }
});

// royal sundaram update pg data
router.get('/royalSundaram_update_pg_status', function (req, res) {
    try {
        var inspection_schedule = require('../models/inspection_schedule.js');
        let query = {"Status": {$in: ["INSPECTION_APPROVED"]}, "Insurer_Id": 10};
        inspection_schedule.find(query, function (err1, dbUsers) {
            if (err1) {
                res.json({'Status': "FAIL", "Msg": err1});
            } else {
                if (dbUsers.length > 0) {
                    for (let index = 0; index < dbUsers.length; index++) {
                        let user = dbUsers[index]['_doc'];
                        let args = {
                            data: user,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        console.error('Royal Sundaram - /postservicecall/royalSundaram_update_transaction_status - POST calling Request : ', JSON.stringify(args));
                        let url_api = config.environment.weburl + '/postservicecall/royalSundaram_update_transaction_status';
                        execute_post(url_api, args);
                    }
                } else {
                    res.json({'/royalSundaram_update_transaction_status ': 'NO DATA AVAILABLE'});
                }
            }
        });
        res.json({'Msg': "Status Updated Successfully", 'Status': "Success"});


    } catch (e) {
        res.json({'Msg': "Error to Update and read Data", 'Status': "Failure"});
    }
});

router.post('/royalSundaram_update_transaction_status', function (req, res2, next) {
    let objInsurerProduct = req.body;
    let callingService = '';
    let Error_Msg = '';
    let args = {};

    try {
        if (config.environment.name.toString() === 'Production') {
            callingService = ``;
        } else {
            callingService = `https://dtcdocstag.royalsundaram.in/Services/TransactionHistoryService/QuoteDetails?quoteId=${objInsurerProduct['Inspection_Id']}`;
        }
        if (!callingService) {
        } else {
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
            console.error('royalSundaram_update_transaction_status Request :: ', JSON.stringify(args));

            let Client = require('node-rest-client').Client;
            let client = new Client();
            client.get(callingService, function (dataRes, response) {
                console.error('Royal Sundaram - royalSundaram_update_transaction_status - ClearInspectionStatus service - Response : ', JSON.stringify(dataRes));
                if (dataRes && dataRes.hasOwnProperty('data')) {
                    let royalSundaram_pg_status = '';
                    let data = dataRes["data"];

                    if ((data.hasOwnProperty('quoteStatus')) && (data['quoteStatus'] !== '' && objInsurerProduct && objInsurerProduct.hasOwnProperty("Inspection_Id") && objInsurerProduct['Inspection_Id'] !== null)) {
                        try {
                            var today = moment().utcOffset("+05:30");
                            var today_str = moment(today).format("YYYYMMDD");
                            var logFilePath = appRoot + "/tmp/log/royalSundaram_transactionDetails_" + today_str + ".log";
                            var logData = JSON.stringify(dataRes) + "\r\n";
                            fs.appendFile(logFilePath, logData, function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                                console.log("The file was saved!");
                            });
                            if (data['quoteStatus'] === "B" && data['paymentStatus'] === "Accepted") {
                                royalSundaram_pg_status = "TRANS_SUCCESS_WITH_POLICY";
                            } else if (data['quoteStatus'] === "Q") {
                                royalSundaram_pg_status = "TRANS_FAIL";
                            } else {
                                royalSundaram_pg_status = "PG_RETURNED";
                            }
                            ;

                            let User_Data = require(appRoot + '/models/user_data');
                            let ud_cond = {"User_Data_Id": objInsurerProduct['UD_Id']};
                            User_Data.findOne(ud_cond, function (err, dbUserData) {
                                if (err) {
                                    console.error('Exception in royalSundaram_update_transaction_status() : ', err);
                                } else {
                                    dbUserData = dbUserData._doc;
                                    let myquery1 = {
                                        "User_Data_Id": dbUserData.User_Data_Id,
                                        "Request_Unique_Id": objInsurerProduct['Request_Unique_Id']
                                    };
                                    let newvalues1 = '';
                                    let Status_History = (dbUserData.hasOwnProperty('Status_History')) ? dbUserData.Status_History : [];
                                    Status_History.unshift({
                                        "Status": royalSundaram_pg_status,
                                        "StatusOn": new Date()
                                    });

                                    newvalues1 = {
                                        "Last_Status": royalSundaram_pg_status,
                                        "Status_History": Status_History,
                                        "Modified_On": new Date()
                                    }, {
                                        upsert: false, multi: false
                                    };

                                    User_Data.updateOne(myquery1, newvalues1, function (err, numAffected) {
                                        console.log('royalSundaram_update_transaction_status() UserDataUpdated : ', err, numAffected);
                                        res2.json({'Status': "SUCCESS", "Msg": "PG Updated Success"});
                                    });
                                }
                            });

                        } catch (ex2) {
                            console.error('Exception in royalSundaram_update_transaction_status() for User_Data db details : ', ex2);
                            res2.json({'Status': "FAIL", "Msg": ex2});
                        }
                    } else {
                        Error_Msg = JSON.stringify(data);
                        res2.json({'Status': "FAIL", "Msg": Error_Msg});
                    }
                } else {
                    Error_Msg = JSON.stringify(data);
                    res2.json({'Status': "FAIL", "Msg": Error_Msg});
                }
            });
        }
    } catch (ex3) {
        console.error('Exception in royalSundaram_update_transaction_status() for User_Data db details : ', ex3);
        res2.json({'Status': "FAIL", "Msg": ex3});
    }
});

/** Coins Related API's Start*/

router.post('/sync_contacts/assign_coins_to_lead', function (req, res) {
    try {
        const agent_coin = require('../models/agent_coin');
        console.error('body - ', req.body);
        let hr_employee = require('../models/hr_employee');
        let agent_coin_query = {
            'Ss_Id': (req.body.ss_id && req.body.ss_id - 0) || 0
        };
        let agent_coin_save = {
            'Ss_Id': (req.body.ss_id && req.body.ss_id - 0) || 0,
            'Total_Coins': (req.body.total_coins && req.body.total_coins) || 0,
            'Total_Purchase': (req.body.total_coins && req.body.total_coins) || 0,
            'Total_Spend': 0,
            "Created_On": new Date(),
            "Modified_On": new Date()
        };
        agent_coin.find(agent_coin_query, function (db_agent_coin_err, db_agent_coin_data) {
            try {
                if (db_agent_coin_err) {
                    res.json({'Status': 'FAIL', 'Msg': 'ERROR IN AGENT COIN COLLECTION WHILE FETCHING DATA', 'Data': db_agent_coin_err});
                } else {
                    if (db_agent_coin_data.length > 0) {
                        res.json({'Status': 'SUCCESS', 'Msg': 'ALREADY ASSIGNED COINS TO LEAD', 'Data': db_agent_coin_data});
                    } else {
                        agent_coin_save_obj = new agent_coin(agent_coin_save);
                        agent_coin_save_obj.save((db_agent_coin__save_err, db_agent_coin_save_data) => {
                            console.error('db_agent_coin_save_data - ', db_agent_coin_save_data);
                            if (db_agent_coin__save_err) {
                                res.json({'Status': 'FAIL', 'Msg': 'DB ERROR WHILE SAVING', 'Data': db_agent_coin__save_err});
                            } else {
                                res.json({'Status': 'SUCCESS', 'Msg': 'COINS ASSIGNED TO LEAD SUCCESSFULLY', 'Data': db_agent_coin_save_data});
                            }
                        });
                    }
                }
            } catch (ex) {
                console.error('Exception in -/sync_contacts/assign_coins_to_lead', ex.stack);
                res.json({'Status': 'FAIL', 'Msg': 'EXCEPTION WHILE ASSIGNING COINS TO LEADS', 'Data': ex.stack});
            }
        });
    } catch (ex) {
        console.error('Exception in -/sync_contacts/assign_coins_to_lead', ex.stack);
        res.json({'Status': 'FAIL', 'Msg': 'EXCEPTION WHILE ASSIGNING COINS TO LEADS', 'Data': ex.stack});
    }
});

router.get('/sync_contacts/get_coins_details/:ss_id', function (req, res) {
    try {
        const agent_coin = require('../models/agent_coin');
        let ss_id = req.params.ss_id - 0 || 0;
        if (ss_id && !isNaN(ss_id)) {
            agent_coin.find({'Ss_Id': ss_id}, '-_id -__v', function (db_agentcoin_err, db_agentcoin_data) {
                if (db_agentcoin_err) {
                    res.json({'Status': 'FAIL', 'Msg': 'ERROR IN WHILE FETCHING DETAILS', 'Data': db_agentcoin_err});
                } else {
                    res.json({'Status': 'SUCCESS', 'Msg': 'AGENTS COINS DETAILS FETCHED SUCCESSFULLY', 'Data': db_agentcoin_data});
                }
            });
        } else {
            res.json({'Status': 'FAIL', 'Msg': 'SSID MISSING', 'Data': ''});
        }
    } catch (ex) {
        console.error('Exception in -/sync_contacts/get_coins_details', ex.stack);
        res.json({'Status': 'FAIL', 'Msg': 'EXCEPTION IN FETCHING COINS DETAILS', 'Data': ex.stack});
    }
});

router.get('/sync_contacts/get_coins_consumed_details/:ss_id', function (req, res) {
    try {
        const agent_coin = require('../models/agent_coin');
        let ss_id = req.params.ss_id - 0 || 0;
        if (ss_id && !isNaN(ss_id)) {
            agent_coin.find({'Ss_Id': ss_id}, '-_id -__v', function (db_agentcoin_err, db_agentcoin_data) {
                if (db_agentcoin_err) {
                    res.json({'Status': 'FAIL', 'Msg': 'ERROR IN WHILE FETCHING CONSUMED DETAILS', 'Data': db_agentcoin_err});
                } else {
                    let res_obj = {
                        'Total_Coins': db_agentcoin_data[0]['Total_Coins'],
                        'Total_Spend': db_agentcoin_data[0]['Total_Spend']
                    };
                    res.json({'Status': 'SUCCESS', 'Msg': 'AGENTS COINS CONSUMED DETAILS FETCHED SUCCESSFULLY', 'Data': res_obj});
                }
            });
        } else {
            res.json({'Status': 'FAIL', 'Msg': 'SSID MISSING', data: ''});
        }
    } catch (ex) {
        console.error('Exception in -/sync_contacts/get_coins_consumed_details', ex.stack);
        res.json({'Status': 'FAIL', 'Msg': 'EXCEPTION IN FETCHING COINS DETAILS', 'Data': ex.stack});
    }
});

router.get('/sync_contacts/fetch_agent_coins_details', function (req, res) {
    try {
        const agent_coin = require('../models/agent_coin');
        let ss_id = req.query.ss_id || 0;
        let objSummary = {
            "Data": {},
            "Status": "",
            "Msg": ""
        };
        if (ss_id && !isNaN(ss_id)) {
            client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id, {}, function (dsa_data, dsa_res) {
                try {
                    var dsa_data = dsa_data;
                    if (dsa_data && dsa_data.status && dsa_data.status === "SUCCESS") {
                        let agent_name = "";
                        let agent_mobile = "";
                        let agent_email = "";
                        if (dsa_data.user_type && dsa_data.user_type === 'POSP') {
                            if (dsa_data.POSP.Middle_Name) {
                                agent_name = (dsa_data.POSP.First_Name && dsa_data.POSP.First_Name.trim() || "") + " " + dsa_data.POSP.Middle_Name && dsa_data.POSP.Middle_Name.trim() + " " + (dsa_data.POSP.Last_Name && dsa_data.POSP.Last_Name.trim() || "");
                            } else {
                                agent_name = (dsa_data.POSP.First_Name && dsa_data.POSP.First_Name.trim() || "") + " " + (dsa_data.POSP.Last_Name && dsa_data.POSP.Last_Name.trim() || "");
                            }
                            agent_email = dsa_data['POSP'].Email_Id || "";
                            agent_mobile = dsa_data['POSP'].Mobile_No || "";
                        } else {
                            agent_name = (dsa_data.EMP && dsa_data.EMP.Emp_Name && dsa_data.EMP.Emp_Name.trim()) || "";
                            agent_email = dsa_data['EMP'].Email_Id || "";
                            agent_mobile = dsa_data['EMP'].Mobile_Number || "";
                        }
                        agent_name = agent_name.trim();
                        agent_name = agent_name.toUpperCase();
                        objSummary["Data"]['ss_id'] = ss_id;
                        objSummary["Data"]['agent_name'] = agent_name;
                        objSummary["Data"]['agent_mobile'] = agent_mobile;
                        objSummary["Data"]['agent_email'] = agent_email;
                        agent_coin.find({'Ss_Id': ss_id}, '-_id -__v', function (db_agentcoin_err, db_agentcoin_data) {
                            if (db_agentcoin_err) {
                                objSummary["Status"] = "FAIL";
                                objSummary["Msg"] = "ERROR WHILE FETCHING COINS DETAILS";
                                objSummary["Data"] = db_agentcoin_err;
                                res.json(objSummary);
                            } else {
                                if (db_agentcoin_data.length > 0) {
                                    objSummary["Data"]['total_coins'] = (db_agentcoin_data && db_agentcoin_data[0].Total_Coins) || 0;
                                    objSummary["Data"]['total_coins_spent'] = (db_agentcoin_data && db_agentcoin_data[0].Total_Spend) || 0;
                                    //objSummary["Data"]['total_lead_count'] = (db_agentcoin_data && db_agentcoin_data[0].Total_Lead_Count) || 0;
                                    //objSummary["Data"]['lead_buy_count'] = (db_agentcoin_data && db_agentcoin_data[0].Lead_Buy_Count) || 0;
                                    objSummary["Status"] = "SUCCESS";
                                    objSummary["Msg"] = "AGENTS COINS DETAILS FETCHED SUCCESSFULLY";
                                } else {
                                    objSummary["Data"]['total_coins'] = 0;
                                    objSummary["Data"]['total_coins_spent'] = 0;
                                    //objSummary["Data"]['total_lead_count'] =  0;
                                    //objSummary["Data"]['lead_buy_count'] =  0;
                                    objSummary["Status"] = "FAIL";
                                    objSummary["Msg"] = "AGENTS COINS DETAILS NOT FOUND";
                                }
                                res.json(objSummary);
                            }
                        });
                    } else {
                        objSummary["Status"] = "FAIL";
                        objSummary["Msg"] = "NO DATA FOUND IN DSA API";
                        res.json(objSummary);
                    }
                } catch (e) {
                    objSummary["Status"] = "FAIL";
                    objSummary["Msg"] = "EXCEPTION IN DSA API";
                    objSummary["Data"] = e.satck;
                    res.json(objSummary);
                }
            });
        } else {
            objSummary["Status"] = "FAIL";
            objSummary["Msg"] = "SS_ID MANDATORY";
            res.json(objSummary);
        }
    } catch (e) {
        objSummary["Status"] = "FAIL";
        objSummary["Msg"] = "EXCEPTION IN -/fetch_agent_coins_details";
        objSummary["Data"] = e.satck;
        res.json(objSummary);
    }
});

router.post('/sync_contacts/update_lead_count', function (req, res) {
    try {
        const agent_coin = require('../models/agent_coin');
        const agent_coin_history = require('../models/agent_coin_history');
        const objRequest = req.body || {};
        const ss_id = (objRequest.ss_id && objRequest.ss_id - 0) || 0;
        const transaction_id = (objRequest.transaction_id && objRequest.transaction_id - 0) || 0;
        if (ss_id && !isNaN(ss_id)) {
            let agent_coin_query = {
                'Ss_Id': ss_id,
                'Transaction_Id': transaction_id
            };
            let objSummary = {
                "Data": {},
                "Status": "",
                "Msg": ""
            };
            let agent_coin_update = {
                'Total_Coins': ((objRequest.total_coins && objRequest.total_coins - 0) - (objRequest.lead_buy_coins && objRequest.lead_buy_coins - 0))
            };
            let agent_coin_history_save = {
                'Ss_Id': ss_id,
                'Total_Coins': ((objRequest.total_coins && objRequest.total_coins - 0) - (objRequest.lead_buy_coins && objRequest.lead_buy_coins - 0)),
                'Total_Spend': (objRequest.lead_buy_coins && objRequest.lead_buy_coins - 0),
                'Created_On': new Date(),
                'Modified_On': new Date(),
                'Transaction_Id': transaction_id
            };
            agent_coin.find(agent_coin_query, function (agent_coin_err, agent_coin_data) {
                if (agent_coin_err) {
                    objSummary["Status"] = "FAIL";
                    objSummary["Msg"] = "ERROR OCCURRED WHILE FINDING DATA IN AGENT COINS COLLECTION";
                    res.json(objSummary);
                } else {
                    if (agent_coin_data.length > 0) {
                        let agentCointPrevData = agent_coin_data[0]['Total_Spend'];
                        agent_coin_update['Total_Spend'] = agentCointPrevData + (objRequest.lead_buy_coins && objRequest.lead_buy_coins - 0);
                        agent_coin.update(agent_coin_query, {$set: agent_coin_update}, function (update_buy_lead_err, update_buy_lead_data) {
                            if (update_buy_lead_err) {
                                objSummary["Status"] = "FAIL";
                                objSummary["Msg"] = "ERROR OCCURRED WHILE UPDATING DATA IN AGENT COINS COLLECTION";
                                res.json(objSummary);
                            } else {
                                if (update_buy_lead_data && update_buy_lead_data.nModified === 1) {
                                    let agent_coin_history_obj = new agent_coin_history(agent_coin_history_save);
                                    agent_coin_history_obj.save(function (agent_coin_history_err, agent_coin_history_data) {
                                        if (agent_coin_history_err) {
                                            objSummary["Status"] = "FAIL";
                                            objSummary["Msg"] = "ERROR OCCURED WHILE SAVING IN AGENT COINS HISTORIES COLLECTION";
                                            objSummary["Data"] = agent_coin_history_err;
                                            res.json(objSummary);
                                        } else {
                                            objSummary["Status"] = "SUCCESS";
                                            objSummary["Msg"] = "COIN COUNTS UPDATED SUCCESSFULLY";
                                            objSummary["Data"] = agent_coin_history_data;
                                            res.json(objSummary);
                                        }
                                    });
                                } else {
                                    objSummary["Status"] = "SUCCESS";
                                    objSummary["Msg"] = "COINS COUNTS ALREADY UPDATED";
                                    res.json(objSummary);
                                }
                            }
                        });
                    }
                }
            });
        } else {
            objSummary["Status"] = "FAIL";
            objSummary["Msg"] = "SS_ID MANDATORY";
            res.json(objSummary);
        }
    } catch (ex) {
        console.error('Exception in -/buy_leads_with_coins', ex.stack);
        objSummary["Status"] = "FAIL";
        objSummary["Msg"] = "EXCEPTION WHILE BUYING LEADS";
        objSummary["Data"] = ex.stack;
        res.json(objSummary);
    }
});

router.post('/sync_contacts/buy_leads_with_coins', function (req, res) {
    try {
        const agent_coin = require('../models/agent_coin');
        const agent_coin_history = require('../models/agent_coin_history');
        const objRequest = req.body || {};
        const ss_id = (objRequest.ss_id && objRequest.ss_id - 0) || 0;
        const transaction_id = (objRequest.transaction_id && objRequest.transaction_id - 0) || 0;
        if (ss_id && !isNaN(ss_id)) {
            let agent_coin_query = {
                'Ss_Id': ss_id
            };
            let objSummary = {
                "Data": {},
                "Status": "",
                "Msg": ""
            };
            let agent_coin_update = {
                'Total_Coins': ((objRequest.total_coins && objRequest.total_coins - 0) - (objRequest.lead_buy_coins && objRequest.lead_buy_coins - 0)),
                'Transaction_Id': transaction_id
            };
            let agent_coin_history_save = {
                'Ss_Id': ss_id,
                'Total_Coins': ((objRequest.total_coins && objRequest.total_coins - 0) - (objRequest.lead_buy_coins && objRequest.lead_buy_coins - 0)),
                'Total_Spend': (objRequest.lead_buy_coins && objRequest.lead_buy_coins - 0),
                'Created_On': new Date(),
                'Modified_On': new Date(),
                'Transaction_Id': transaction_id
            };
            agent_coin.find(agent_coin_query, function (agent_coin_err, agent_coin_data) {
                if (agent_coin_err) {
                    objSummary["Status"] = "FAIL";
                    objSummary["Msg"] = "ERROR OCCURRED WHILE FINDING DATA IN AGENT COINS COLLECTION";
                    res.json(objSummary);
                } else {
                    let agentCointPrevData = agent_coin_data[0]['Total_Spend'];
                    agent_coin_update['Total_Spend'] = agentCointPrevData + (objRequest.lead_buy_coins && objRequest.lead_buy_coins - 0);
                    agent_coin.update(agent_coin_query, {$set: agent_coin_update}, function (update_buy_lead_err, update_buy_lead_data) {
                        if (update_buy_lead_err) {
                            objSummary["Status"] = "FAIL";
                            objSummary["Msg"] = "ERROR OCCURRED WHILE UPDATING DATA IN AGENT COINS COLLECTION";
                            objSummary["Data"] = update_buy_lead_err;
                            /*
                             client.get(config.environment.weburl + '/razorpay_payment/update_coin_transaction_status/' + transaction_id + '/' + 'Fail' + '/' + 'AGENT_COIN', {}, function (data, response) {});
                             */
                            res.json(objSummary);
                        } else {
                            if (update_buy_lead_data && update_buy_lead_data.nModified === 1) {
                                let agent_coin_history_obj = new agent_coin_history(agent_coin_history_save);
                                agent_coin_history_obj.save(function (agent_coin_history_err, agent_coin_history_data) {
                                    if (agent_coin_history_err) {
                                        objSummary["Status"] = "FAIL";
                                        objSummary["Msg"] = "ERROR OCCURED WHILE SAVING IN AGENT COINS HISTORIES COLLECTION";
                                        objSummary["Data"] = agent_coin_history_err;
                                        res.json(objSummary);
                                    } else {
                                        objSummary["Status"] = "SUCCESS";
                                        objSummary["Msg"] = "BUY LEAD COUNTS UPDATED SUCCESSFULLY";
                                        objSummary["Data"] = agent_coin_history_data;
                                        /*
                                         client.get(config.environment.weburl + '/razorpay_payment/update_coin_transaction_status/' + transaction_id + '/' + 'Success' + '/' + 'AGENT_COIN', {}, function (data, response) {
                                         if (data && data.Status === 'Success') {
                                         res.json(objSummary);
                                         } else {
                                         objSummary["Msg"] = "BUY LEAD COUNTS UPDATED SUCCESSFULLY BUT NOT UPDATED IN RAZORPAY PAYMENTS";
                                         res.json(objSummary);
                                         }
                                         });
                                         */
                                        res.json(objSummary);
                                    }
                                });
                            } else {
                                objSummary["Status"] = "SUCCESS";
                                objSummary["Msg"] = "BUY LEAD COUNTS ALREADY UPDATED";
                                res.json(objSummary);
                            }
                        }
                    });
                }
            });
        } else {
            objSummary["Status"] = "FAIL";
            objSummary["Msg"] = "SS_ID MANDATORY";
            res.json(objSummary);
        }
    } catch (ex) {
        console.error('Exception in -/buy_leads_with_coins', ex.stack);
        objSummary["Status"] = "FAIL";
        objSummary["Msg"] = "EXCEPTION WHILE BUYING LEADS";
        objSummary["Data"] = ex.stack;
        res.json(objSummary);
    }
});

/** Coins Related API's End*/

router.get("/bitrix_user_account/:ss_id", (req, res) => {
    try {
        const ss_id = req.params.ss_id - 0;
        const users = require("../models/user");
        const Client = require("node-rest-client").Client;
        const client = new Client();
        let dialler_required = req.query['dialler_required'];
        users.findOne({"Ss_Id": ss_id}, (db_err, db_data) => {
            if (db_err) {
                return res.json({"Status": "Fail", "Msg": db_err.stack});
            }
            if (db_data && db_data.hasOwnProperty('_doc')) {
                let data = db_data["_doc"];
                try {
                    const bitrix_api_string = "https://policyboss.bitrix24.in/rest/2/bqxnlr7j2jba3fye/user.add.json?" +
                            "ACTIVE=1" +
                            "&NAME=" + data["Employee_Name"] + //Horizon
                            "&LAST_NAME=" + (data["Employee_Name"] ? (data["Employee_Name"].split(" ")[data["Employee_Name"].split(" ").length - 1]) : "") + //Test User
                            "&EMAIL=" + data["Official_Email"] + //email@testemail.com
                            "&PERSONAL_GENDER=" + //M
                            "&PERSONAL_BIRTHDAY=" + //08/06/1984
                            "&WORK_PHONE=" + data["Phone"] + //+9199999888811
                            "&WORK_POSITION=" + data["Designation"] + //Test Position
                            "&UF_EMPLOYMENT_DATE=" + (data["DOJ"] ? (moment(data["DOJ"], "YYYY-MM-DD").format("DD/MM/YYYY")) : "") + //06/12/2023
                            "&UF_USR_1692532179035=" + data["UID"] + //Horizon_UID
                            "&UF_DEPARTMENT=" + data["Dept_Segment"] + //1
                            "&UF_USR_1702020928840=" + data["Vertical"] + //Vertical Name
                            "&UF_USR_1702020943553=" + data["Sub_Vertical"] + //Sub-Vertical Name
                            "&UF_USR_1702020954388=" + data["Reporting_One"] + //Reporting to Name
                            "&[UF_USR_1703670445256]=" + //<1527 or 1529> ~ < Yes  or No> User required or not?
                            "&[UF_USR_1703670478853]=" + (dialler_required ? (dialler_required === "Yes" ? 1531 : 1533) : ""); //<1531 or 1533> ~ < Yes  or No> Dialler required or not?
                    client.get(bitrix_api_string, (bitrix_res, bitrix_err) => {
                        try {
                            if (bitrix_res && bitrix_res.result) {
                                //insert/update employee_bitrix_mapping
                                const employee_bitrix_mapping = require("../models/employee_bitrix_mapping");
                                employee_bitrix_mapping.findOne({"Ss_Id": data["Ss_Id"]}, (err, data1) => {
                                    if (data1) {
                                        const update_data = {
                                            "Bitrix_Id": bitrix_res["result"],
                                            "Modified_On": new Date()
                                        };
                                        employee_bitrix_mapping.updateOne({"Ss_Id": data["Ss_Id"]}, {$set: update_data}, (err, data1) => {
                                            if (err) {
                                                console.log("employee_bitrix_mapping update error - ", err);
                                            }
                                        });
                                    } else {
                                        const insert_data = {
                                            "Ss_Id": data["Ss_Id"],
                                            "Bitrix_Id": bitrix_res["result"]
                                        };
                                        const employee_bitrix_mapping1 = new employee_bitrix_mapping(insert_data);
                                        employee_bitrix_mapping1.save((err, data1) => {
                                            if (err) {
                                                console.log("employee_bitrix_mapping save error - ", err);
                                            }
                                        });
                                    }
                                });
                            }
                            //create log
                            const logRequest = {
                                Request: bitrix_api_string,
                                Response: bitrix_res || "",
                                Date: moment().format("YYYY-MM-DD HH:mm:ss")
                            };
                            fs.appendFile(appRoot + "/tmp/log/bitrix_log", "\n-------------------------------------------\n" + JSON.stringify(logRequest, null, 2) + "\n", 'utf8');

                            res.send(bitrix_res);
                        } catch (err) {
                            res.json({"Status": "Fail", "Msg": err.stack});
                        }
                    });
                } catch (err1) {
                    res.json({"Status": "Fail", "Msg": err1.stack});
                }
            } else {
                res.json({"Status": "Fail", "Msg": "No data found for ss_id - " + ss_id});
            }
        });
    } catch (err2) {
        res.json({"Status": "Fail", "Msg": err2.stack});
    }
});

function execute_post(url, args) {
    let Client = require('node-rest-client').Client;
    let client = new Client();
    client.post(url, args, function (data, response) {
        console.error('/inspections.js execute_post() : ');
    });
}

router.post('/sbig/decrypt', (req, res) => {
    try {
        var crypto = require('crypto');
        const SymKeyBase64 = 'RrRaL75IL0svVZW8yiDcin3sEM4iE8eQ';
        const ivBase64 = 'rVGOux4F38k3';
        // Decode the base64-encoded key and IV
        const SymKey = Buffer.from(SymKeyBase64);
        const iv = Buffer.from(ivBase64);
        const epayload = req.body;

        if (!epayload || !epayload.ciphertext) {
            res.status(400).json({error: 'Invalid payload structure'});
            return;
        }

        const ciphertextBase64 = epayload.ciphertext;
//        console.log(typeof ciphertextBase64);

        // const iv = Buffer.from(ivBase64, 'base64');
        const ciphertext = Buffer.from(ciphertextBase64, 'base64');
        // const SymKey = Buffer.from(SymKeyBase64, 'base64');

        const tag = ciphertext.slice(ciphertext.length - 16); // Assuming a 128-bit tag (16 bytes)
        const data = ciphertext.slice(0, ciphertext.length - 16);

        // Create a decipher
        const decipher = crypto.createDecipheriv('aes-256-gcm', SymKey, iv);
        decipher.setAuthTag(tag);

        // Decrypt the data
        let originalPlainText = decipher.update(data, null, 'utf8');
        originalPlainText += decipher.final('utf8');
//        console.log("originalPlainText", JSON.parse(originalPlainText));

        res.json({decryptedData: JSON.parse(originalPlainText)});
    } catch (err) {
        res.json({"Status": "Fail", "Msg": err.stack});
    }
});
router.post('/health/manipal_cigna_lm_service', function (req, res) {
    try {
        console.error("/health/manipal_cigna_lm_service", req.body);
        let objRequest = req.body;
        let post_request = objRequest['insurer_request'];
        let method_type = objRequest['method_type'];
        let service_url = objRequest['service_url'];
        let app_key = objRequest['app_key'];
        let app_id = objRequest['app_id'];
        let application_ServiceURL = objRequest['method_type'] === "Premium" ? objRequest['application_ServiceURL'] : "";
        let application_app_key = objRequest['method_type'] === "Premium" ? objRequest['application_app_key'] : "";
        let application_app_id = objRequest['method_type'] === "Premium" ? objRequest['application_app_id'] : "";
        let request = require('request');        
        let lm_response = {};
        let args = {
            data: post_request,
            headers: {
                "app_key": app_key,
                "app_id": app_id,
                "Content-Type": "application/json",
                "Accept": "*/*"
            }
        };
        if (method_type === "Proposal") {
            args["headers"]["Action-Type"] = "VALIDATE";
        }
        let Client = require('node-rest-client').Client;
        let client = new Client();
        let client1 = new Client();
        let moment = require("moment");
        let StartDate = moment(new Date());
        if (method_type === "Pdf") {
            let pdfName = objRequest['method_action'] === 'POST' ? post_request["PolicyNumber"] : objRequest['insurer_request'];
            let pdf_file_name = 'ManipalCigna_Health_' + pdfName + '.pdf';
            let pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            let pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
            
            if (objRequest['method_action'] === 'POST') {
                let options = {
                    'url': service_url,
                    'body': JSON.stringify(post_request),
                    'headers': {
                        "app_key": app_key,
                        "app_id": app_id,
                        "Content-Type": "application/json",
                        "Accept": "*/*"
                    }
                };
                
                request.post(options, function (error, response, responseBody) {
                    if (error) {
                        console.error('/health/manipal_cigna_lm_service PDF Error:', error);
                    } else {
                        try {
                            const parsedResponse = JSON.parse(responseBody);
                            if (parsedResponse.status === 'Fail') {
                                console.error('/health/manipal_cigna_lm_service Pdf API Error:', parsedResponse.Message);
                            } else {
                                const pdfContent = Buffer.from(parsedResponse.ContentElements, 'base64');
                                fs.writeFileSync(pdf_sys_loc, pdfContent);
                                console.error('/health/manipal_cigna_lm_service PDF saved to:' + pdf_sys_loc);
                                response['pdf_sys_loc'] = pdf_sys_loc;
                                response['pdf_web_path'] = pdf_web_path;
                                lm_response = {"Response": response.toString(), "Response_Core": response};
                                res.json(lm_response);
                            }
                        } catch (err) {
                            console.error('Error parsing or handling the response:', err);
                        }
                    }
                });
            } else {
                let options = {
                    'method': 'GET',
                    'url': service_url,
                    'headers': {
                        "app_key": app_key,
                        "app_id": app_id
                    }
                };
                try {
                    request.get(options)
                    .on('response', function (response) {
                        let EndDate = moment(new Date());
                        let Call_Execution_Time = EndDate.diff(StartDate);
                        if (response.statusCode === 200) {
                            response.pipe(fs.createWriteStream(pdf_sys_loc))
                                .on('finish', function () {
                                    console.error('Manipal Cigna File has been successfully generated!');
                                    response['pdf_sys_loc'] = pdf_sys_loc;
                                    response['pdf_web_path'] = pdf_web_path;
                                    lm_response = {"Response": response.toString(), "Response_Core": response, "Call_Execution_Time": Call_Execution_Time};
                                    res.json(lm_response);
                                })
                                .on('error', function (error) {
                                    console.error('/health/manipal_cigna_lm_service PDF Error writing the file:', error);
                                });
                        } else {
                            console.error('Error downloading the PDF:', response.statusCode);
                        }
                    })
                    .on('error', function (error) {
                        let EndDate = moment(new Date());
                        let Call_Execution_Time = EndDate.diff(StartDate);
                        console.error('/health/manipal_cigna_lm_service Error downloading the PDF:', error);
                        lm_response = {"Response": error.toString(), "Response_Core": error, "Call_Execution_Time": Call_Execution_Time};
                        res.json(lm_response);
                    });

                } catch (err) {
                    console.error('Error parsing or handling the response:', err);
                }
            }//pdf GET
        } else {
            try{
                client.post(service_url, args, function (data, response) {
                    let EndDate = moment(new Date());
                    let Call_Execution_Time = EndDate.diff(StartDate);
                    Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
                    /** changes for application number service**/
                    if (method_type === "Premium") {
                        let gen_url = application_ServiceURL;
                        var args_gen = {
                            headers: {
                                "app_key": application_app_key,
                                "app_id": application_app_id
                            }};
                        client1.get(gen_url, args_gen, function (data1, response1) {
                            if (data1.hasOwnProperty('applicationNumber')) {
                                data['applicationNumber'] = data1;
                                lm_response = {"Response": data.toString(), "Response_Core": data, "Call_Execution_Time": Call_Execution_Time};
                                res.json(lm_response);
                            }
                        }).on('error', function (err) {
                            console.error('Manipal Cigna Postservicecall Error LINE 1', err);
                            res.json({"status": "Fail", "Msg": err.stack});
                        });
                    } else {
                        lm_response = {"Response": data.toString(), "Response_Core": data, "Call_Execution_Time": Call_Execution_Time};
                        res.json(lm_response);
                    }
                }).on('error', function (err) {
                    console.error('Manipal Cigna Postservicecall Error LINE 2', err);
                    res.json({"status": "Fail", "Msg": err.stack});
                });
            } catch (err) {
                console.error('Error parsing or handling the response:', err);
            }
        }
    } catch (e) {
        res.json({"status": "Fail", "Msg": e.stack});
    }
});

router.post('/sbi_motor_pdf', function (req, res) {
    try {
        let objRequest = JSON.stringify(req.body);
        var SymKeyBase64 = 'RrRaL75IL0svVZW8yiDcin3sEM4iE8eQ';//'CQuYCxIVNyTOt487084UPBMxhS0XxRE4';
        var ivBase64 = 'rVGOux4F38k3';//'w6tmvKzUj6Rg';
        var SymKey = Buffer.from(SymKeyBase64);
        var iv = Buffer.from(ivBase64);
        var crypto = require('crypto');
        let jsonData = req.body;
        const resp = JSON.stringify(jsonData);
        const cipher = crypto.createCipheriv('aes-256-gcm', SymKey, iv);
        const encryptedData = Buffer.concat([cipher.update(resp, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();
        const cipherText = Buffer.concat([encryptedData, tag]);
        const base64CipherText = cipherText.toString('base64');
        let pdf_request = {
            "ciphertext": `${base64CipherText}=`
        };
        //var pdf_request = this.encryptSBIG(docLog.Insurer_Request);
        var Token = "";
        var service_method_urlT = '', service_method_url = '';
        var argsT = {
            method: 'GET',
            headers: {
                //"Content-Type": "application/json",
                //"Accept": "application/json",
                "X-IBM-Client-Id": 'a0aec6b67c3d2191694c36976f1af1d9',//'79de4de3-d258-43b8-a89a-f42924dddb46',
                "X-IBM-Client-Secret": 'e05a0baed24a30f84dcb229c842c680e'//'lC0eU6gN3sM2mO3vY8xT2nS8sV0rM2xB4xL8uF1uD5lE8jJ1pY'
            }
        };
        if (config.environment.name === 'Production') {
            service_method_urlT = "https://api.sbigeneral.in/cld/v1/token";
            service_method_url = "https://api.sbigeneral.in/ept/getPDFArgCd";
        } else {
            service_method_urlT = "https://devapi.sbigeneral.in/cld/v1/token";
            service_method_url = "https://devapi.sbigeneral.in/ept/getPDFArgCd";
        }
        client.get(service_method_urlT, argsT, function (dataT, response) {
            //console.error("/sbi_motor_pdf ERR_01", dataT);
            //console.error("/sbi_motor_pdf ERR_02", response);
            Token = dataT["access_token"];//dataT["accessToken"];
            if (Token !== "") {
                var args = {
                    data: pdf_request,
                    headers: {
                        "Content-Type": "application/json",
                        //"Accept": "application/json",
                        "X-IBM-Client-Id": 'a0aec6b67c3d2191694c36976f1af1d9',//'79de4de3-d258-43b8-a89a-f42924dddb46',
                        "X-IBM-Client-Secret": 'e05a0baed24a30f84dcb229c842c680e',//'lC0eU6gN3sM2mO3vY8xT2nS8sV0rM2xB4xL8uF1uD5lE8jJ1pY',
                        "Authorization": "Bearer " + Token
                    }
                };

                //console.error("/sbi_motor_pdf ERR_03 :: ", args);
                //console.error("/sbi_motor_pdf ERR_04 :: ", service_method_url);
                client.post(service_method_url, args, function (datapdf, response) {
                    //console.error("/sbi_motor_pdf ERR_05 :: ", datapdf);
                    //console.error("/sbi_motor_pdf ERR_06 :: ", response);
                    //var crypto = require('crypto');
                    //const SymKeyBase64 = 'CQuYCxIVNyTOt487084UPBMxhS0XxRE4';
                    //const ivBase64 = 'w6tmvKzUj6Rg';
                    // Decode the base64-encoded key and IV
                    //const SymKey = Buffer.from(SymKeyBase64);
                    //const iv = Buffer.from(ivBase64);
                    const epayload = datapdf;
                    let result;

                    if (!epayload || !epayload.ciphertext) {
                        result = {error: 'Invalid payload structure'};
                        //return result;
                    }

                    const ciphertextBase64 = epayload.ciphertext;
                    //console.log(typeof ciphertextBase64);
                    // const iv = Buffer.from(ivBase64, 'base64');
                    const ciphertext = Buffer.from(ciphertextBase64, 'base64');
                    // const SymKey = Buffer.from(SymKeyBase64, 'base64');
                    const tag = ciphertext.slice(ciphertext.length - 16); // Assuming a 128-bit tag (16 bytes)
                    const data = ciphertext.slice(0, ciphertext.length - 16);
                    // Create a decipher
                    const decipher = crypto.createDecipheriv('aes-256-gcm', SymKey, iv);
                    decipher.setAuthTag(tag);
                    // Decrypt the data
                    let originalPlainText = decipher.update(data, null, 'utf8');
                    originalPlainText += decipher.final('utf8');
                    //console.log("originalPlainText", JSON.parse(originalPlainText));
                    result = {decryptedData: JSON.parse(originalPlainText)};
                    //return result;
                    res.send({Status: "SUCCESS", Data: result});
                });
            } else {
                res.send({Status: "FAIL", Data: "error in /sbi_motor_pdf " + dataT});
            }
        });
    } catch (e) {
        console.error("Exception in /sbi_motor_pdf ", e.stack);
        res.send({Status: "FAIL", Data: "error in /sbi_motor_pdf " + e.stack});
    }
});

router.post("/kyc_details/kyc_last_status", (req, res) => {
    try {
        let ObjRequest = req.body;
        let udid = ObjRequest.udid && ObjRequest.udid - 0 || "";
        if (udid && ObjRequest.birth_date && ObjRequest.insurer_id) {
            let query = {
                User_Data_Id: udid,
                DOB: (ObjRequest.birth_date === undefined || ObjRequest.birth_date === "" || ObjRequest.birth_date === null) ? "" : ObjRequest.birth_date,
                Insurer_Id: (ObjRequest.insurer_id === undefined || ObjRequest.insurer_id === "" || ObjRequest.insurer_id === null) ? "" : ObjRequest.insurer_id - 0
            };

            kyc_history.findOne(query).sort({Created_On: -1}).exec((err, kyc_data) => {
                if (err) {
                    console.error("kyc_last_status - ", err);
                    res.json({"Status": "FAIL", "Msg": err});
                } else {
                    let kyc_details = kyc_data && kyc_data.hasOwnProperty('_doc') && kyc_data._doc ? kyc_data['_doc'] : kyc_data;
                    if (["", null, undefined].indexOf(kyc_details) === -1) {
                        res.json({"Status": "SUCCESS", "Msg": kyc_details});
                    } else {
                        res.json({"Status": "FAIL", "Msg": "Data Not Found"});
                    }
                }
            });
        } else {
            res.json({"Status": "FAIL", "Msg": "Data Not Found"});
        }
    } catch (err) {
        res.json({"Status": "FAIL", "Msg": err.stack});
    }
});
router.get('/user_datas/brokerage_mail_send', function (req, res) {
    try {
        let objRequest = req.query || "";
        let user_data_id = objRequest.user_data_id && objRequest.user_data_id - 0 || "";
        let insurer_id = objRequest.insurer_id && objRequest.insurer_id - 0 || "";
        let method_type = objRequest.method_type && objRequest.method_type || "";
        let proposal_id = objRequest.proposal_id && objRequest.proposal_id - 0 || "";
        let policy_no = objRequest.policy_no && objRequest.policy_no || "";
        let objResponseSummary = {
            "Status": "",
            "Msg": "",
            "Data": ""
        };
        let method_type_obj = {
            "quote": "QUOTE",
            "proposal": "PROPOSAL",
            "sale": "PROPOSAL"
        };
        let insurer_name = {
            1: "BAJAJ ALLIANZ GENERAL INSURANCE CO LTD",
            3: "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LTD",
            4: "FUTURE GENERALI INDIA INSURANCE COMPANY LTD",
            44: "GO DIGIT GENERAL INSURANCE LTD",
            5: "HDFC ERGO GENERAL INSURANCE CO LTD",
            6: "ICICI LOMBARD GENERAL INSURANCE CO LTD",
            7: "IFFCO-TOKIO GENERAL INSURANCE CO LTD",
            30: "KOTAK MAHINDRA GENERAL INSURANCE CO LTD",
            33: "LIBERTY GENERAL INSURANCE LTD",
            35: "MAGMA HDI GENERAL INSURANCE CO LTD",
            8: "NATIONAL INSURANCE CO LTD",
            12: "THE NEW INDIA ASSURANCE CO LTD",
            13: "THE ORIENTAL INSURANCE CO LTD",
            9: "RELIANCE GENERAL INSURANCE CO LTD",
            10: "ROYAL SUNDARAM GENERAL INSURANCE COMPANY LIMITED",
            17: "SBI GENERAL INSURANCE CO LTD",
            18: "SHRIRAM GENERAL INSURANCE COMPANY LTD",
            11: "TATA AIG GENERAL INSURANCE CO LTD",
            14: "UNITED INDIA INSURANCE CO LTD",
            19: "UNIVERSAL SOMPO GENERAL INSURANCE CO LTD",
            46: "ZUNO GENERAL INSURANCE LTD",
            45: "ACKO GENERAL INSURANCE LIMITED",
            16: "RAHEJA QBE GENERAL INSURANCE CO LTD"
        };
        let obj_plan_full_name = {
            "STP": "TP Only",
            "SAOD": "OD Only",
            "1+1": "Comprehensive",
            "1+3": "OD (1 Yr) + TP (3 Yr)",
            "1+5": "OD (1 Yr) + TP (5 Yr)"
        };
        let find_args = {
            "User_Data_Id": user_data_id,
            "Insurer_Id": insurer_id,
            "Call_At": method_type_obj[method_type] || ""
        };
        client.get(config.environment.weburl + '/user_datas/view/' + user_data_id, function (user_data, user_data_err) {
            if (user_data && user_data.length > 0) {
                let user_data_response = "";
                let premium_request = "";
                let posp_full_name = "";
                user_data_response = user_data[0];
                premium_request = user_data_response.Premium_Request;
                let vehicle_ncb_current = premium_request.vehicle_ncb_current || "";
                let posp_first_name = premium_request.posp_first_name && (premium_request.posp_first_name).trim() || "";
                let posp_middle_name = premium_request.posp_middle_name && (premium_request.posp_middle_name).trim() || "";
                let posp_last_name = premium_request.posp_last_name && (premium_request.posp_last_name).trim() || "";
                if (posp_middle_name) {
                    posp_full_name = posp_first_name + " " + posp_middle_name + " " + posp_last_name;
                } else {
                    posp_full_name = posp_first_name + " " + posp_last_name;
                }
                let Payouts = require('../models/payout');
                Payouts.find(find_args).exec(function (payouts_err, payouts_data) {
                    if (payouts_data && payouts_data.length > 0) {
                        let payouts_db_response = payouts_data[0]['_doc'];
                        let obj_policy_type_name = obj_plan_full_name[payouts_db_response.Policy_Type] || "";
                        let policy_type = obj_policy_type_name + " (" + payouts_db_response.Policy_Type + ")";
                        let mail_obj = {
                            "CRN": payouts_db_response.PB_CRN || 0,
                            "Insurer": payouts_db_response.Insurer_Id && insurer_name[payouts_db_response.Insurer_Id] || "",
                            "Product": payouts_db_response.Product_Name || "",
                            "Product_Sub_Type": payouts_db_response.Product_Sub_Type || "",
                            "Policy_Type": policy_type || "",
                            "RTO": payouts_db_response.Rto || "",
                            "Make_Model": payouts_db_response.Make_Model || "",
                            "Fuel": payouts_db_response.Fuel_Type || "",
                            "CC": payouts_db_response.Vehicle_Cc || "",
                            "NCB": vehicle_ncb_current || 0,
                            "Make_Year": payouts_db_response.YearOfMake || "",
                            "Tariff_Rate": payouts_db_response.Tarriff || 0,
                            "Zero_Depreciation": (payouts_db_response.Is_ZD_Applied && payouts_db_response.Is_ZD_Applied) === true ? "Yes" : "No",
                            "CPA": (payouts_db_response.Is_CPA_Applied && payouts_db_response.Is_CPA_Applied) === true ? "No" : "Yes",
                            "OD_Premium": payouts_db_response.Odpremium && rupessFormat(payouts_db_response.Odpremium) || 0,
                            "Add_On_Premium": payouts_db_response.Addonpremium && rupessFormat(payouts_db_response.Addonpremium) || 0,
                            "TP_Premium": payouts_db_response.Tppremium && rupessFormat(payouts_db_response.Tppremium) || 0,
                            "POSP_Full_Name": posp_full_name,
                            "POSP_Email_Id": premium_request.posp_email_id || "",
                            "Brokerage_Amount": payouts_db_response.Point && rupessFormat(Math.round(payouts_db_response.Point)) || 0
                        };
                        let sub = "";
                        let email_template_name = "";
                        if (method_type === "quote") {
                            sub = "Potential Brokerage | Quote Confirmation " + mail_obj["CRN"];
                            email_template_name = "Brokerage_Quote_Confirmation";
                        } else if (method_type === "proposal") {
                           sub = "Potential Brokerage | Proposal Confirmation " + mail_obj["CRN"];
                           mail_obj["Proposal_ID"] = proposal_id;
                           email_template_name = "Brokerage_Proposal_Confirmation";
                        } else if (method_type === "sale") {
                           sub = "Brokerage for Policy Sale | Policy No. " + mail_obj["Policy_No"];
                           mail_obj["Policy_No"] = policy_no;
                           email_template_name = "Brokerage_Policy_Sale";
                        }
                        let mail_obj_replace = {};
                        for (let key in mail_obj) {
                            mail_obj_replace["___" + key + "___"] = mail_obj[ key];
                        }
                        try {
                            let fs = require('fs');
                            let email_data = '';
                            email_data = fs.readFileSync(appRoot + '/resource/email/' + email_template_name +'.html').toString();
                            email_data = email_data.replaceJson(mail_obj_replace);
                            console.log(email_data);
                            let Email = require('../models/email');
                            let arr_bcc = [config.environment.notification_email];
                            let email_to = ["roshani.prajapati@policyboss.com", "ashish.hatia@policyboss.com"];
                            let objModelEmail = new Email();
                            objModelEmail.send('noreply@policyboss.com', email_to.join(','), sub, email_data, '', arr_bcc.join(','), '');
                        } catch (e) {
                            console.error('Exception', 'Success Email', e.stack);
                        }
                        objResponseSummary["Status"] = "SUCCESS";
                        objResponseSummary["Msg"] = "Brokerage Quote Confirmation Mail Send Successfully";
                        objResponseSummary["Data"] = mail_obj;
                        res.json(objResponseSummary);
                    } else {
                        objResponseSummary["Status"] = "FAIL";
                        objResponseSummary["Msg"] = "Payout Details Not Found";
                        objResponseSummary["Data"] = payouts_err;
                        res.json(objResponseSummary);
                    }
                });
            } else {
                objResponseSummary["Status"] = "FAIL";
                objResponseSummary["Msg"] = "User Details Not Found";
                res.json(objResponseSummary);
            }
        });
    } catch (e) {
        res.json({"Status": "EXCEPTION", "Msg": "Exception in /user_datas/brokerage_quote_confirmation API", "Data": e.stack});
    }
});
router.post('/updatePayoutData', function (req, res) {
    try {
        let objReq = req.body;
        let payout_id = objReq.proposal_payout_id;
        let proposal_id = objReq.proposal_id;
        let last_status = objReq.last_status;
        let find_db_query;
        let update_db_query;
        if (last_status && proposal_id) {
            find_db_query = {"Proposal_Id": proposal_id};
            update_db_query = {$set: {"Last_Status": last_status}};
        } else {
            find_db_query = {"Payout_Id": payout_id};
            update_db_query = {$set: {"Proposal_Id": proposal_id}};
        }
        let payout_model = require('../models/payout');
        if (proposal_id && (payout_id || last_status)) {
            payout_model.update(find_db_query, update_db_query, function (err, data) {
                if (err) {
                    console.error("Payout Proposal_Id Update - " + err.stack);
                    res.json({"Status": "FAIL", "Msg": err.stack});
                } else {
                    res.json({"Status": "SUCCESS", "Msg": "Data Updated"});
                }
            });
        } else {
            res.json({"Status": "FAIL", "Msg": "proposal_id and proposal_payout_id or last_status is mandatory"});
        }
    } catch (e) {
        console.error("Payout Proposal_Id Update - " + e.stack);
        res.json({"Status": "EXCEPTION", "Msg": "Exception in -updatePayoutProposalId", "Data": e.stack});
    }
});
router.get('/tataAigMarine/getToken', function (req, res) {
    try {
        var request = require('request');
        var options = {
            'method': 'POST',
            'url': ((config.environment.name === 'Production') ? "https://foyer-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token" : "https://uatapigw-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token"),
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                'grant_type': 'client_credentials',
                "scope": ((config.environment.name === 'Production') ? "https://foyer.tataaig.com/write" : "https://api.iorta.in/write"), //"https://api.iorta.in/write",
                "client_id": ((config.environment.name === 'Production') ? "12u0gfolm1lmmtrumqlfbkqb8u" : "4dvjgdbs2bl516rl03jh5oli5j"), // "4dvjgdbs2bl516rl03jh5oli5j",
                "client_secret": ((config.environment.name === 'Production') ? "o2kiv3jrs1gl316jf3h6816sfc5505resccu73rdajl6l72gbj2" : "r7pigrbhnqpl69bn5rt7gko7333ej06d628ttgi95t3m9h8okqs") //"r7pigrbhnqpl69bn5rt7gko7333ej06d628ttgi95t3m9h8okqs"
            }
        };
        request(options, (error, response) => {
            if (error) {
                throw new Error(error);
                res.status(500);
                res.send(error.stack);
            } else {
                let auth = JSON.parse(response.body);
                res.status(200);
                res.send({"token": auth.access_token});
            }
        });
    } catch (e) {
        res.json({"Status": "EXCEPTION", "Msg": "Exception in -/tataAigMarine/getToken", "Data": e.stack});
    }
});
router.post('/kyc_details/get_kyc_logs', LoadSession, function (req, res) {
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
        if (req.obj_session && req.obj_session.user && req.obj_session.user.role_detail && req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {

        }
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
            if ((['Document_Type', 'Document_ID', 'KYC_Status'].indexOf(req.body.search_by) > -1) && (req.body.search_byvalue && req.body.search_byvalue !== '')) {
                filter[req.body.search_by] = new RegExp(req.body['search_byvalue'], 'i');
            } else if ((['User_Data_Id', 'PB_CRN', 'Insurer_Id'].indexOf(req.body.search_by) > -1) && (req.body.search_byvalue && req.body.search_byvalue !== '')) {
                filter[req.body.search_by] = req.body['search_byvalue'] - 0;
            } else {

            }
        }
		if (req && req.body && req.body.KYC_Status && req.body.KYC_Status !== '') {
            filter['KYC_Status'] = req.body.KYC_Status;
        }
        var kyc_history_logs = require('../models/kyc_history');
        kyc_history_logs.paginate(filter, optionPaginate).then(function (user_datas) {
            res.json(user_datas);
        });
    } catch (ex) {
        console.error("Exception in - /kyc_details/get_kyc_logs", ex.stack);
        res.json({'Status': 'Error', 'Msg': ex.stack});
    }
});
function rupessFormat(num) {
    if (num) {
        var curr = num.toLocaleString();
        return curr;
    } else {
        return "";
    }
}
function call_zoop(req, res, next) {
    try {
        var objReq = req.body;
        if ((objReq.Proposal_Request && objReq.Proposal_Request.pan) || objReq.Document_Type === "PAN") {
            var pan_number = objReq.Proposal_Request.pan || objReq.Document_ID;
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': 'https://horizon.policyboss.com:5443/kyc_details/zoop_pan_pro',//config.environment.weburl + '/postservicecall/kyc_details/zoop_pan_pro',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "Pan_Number": pan_number
                })

            };
            request(options, function (error, response) {
                if (error) {
                    console.error("call_zoop - ", error);
                }
                
                if (response){
                    response = response.body ? JSON.parse(response.body) : response.body;
                    if(response.Status === "Success" && response.data) {
                        if (response.data.result) {
                            let result = response.data.result;
                            if (result.user_dob && moment(result.user_dob, "DD-MM-YYYY").isValid()) {
                                req.body.Proposal_Request.birth_date = moment(response.data.result.user_dob, "DD-MM-YYYY").format("DD/MM/YYYY");
                            }
                            if (result.user_full_name_split) {
                                req.body.Proposal_Request.first_name = result.user_full_name_split[0] || objReq.Proposal_Request.first_name;
                                req.body.Proposal_Request.middle_name = result.user_full_name_split[1] || objReq.Proposal_Request.middle_name;
                                req.body.Proposal_Request.last_name = result.user_full_name_split[2] || objReq.Proposal_Request.last_name;
                            }
                            if (result.user_gender) {
                                req.body.Proposal_Request.gender = result.user_gender;
                            }
                        }
                    }
                }
                next();
            });
        } else {
            next();
        }
    } catch (err) {
        console.log("call_zoop Exception - ", err.stack);
        next();
    }
}

module.exports = router;