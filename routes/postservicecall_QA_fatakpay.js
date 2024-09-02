var express = require('express');
var config = require('config');
var bitly_access_token = config.environment.arr_bitly_access_token[Math.floor(Math.random() * config.environment.arr_bitly_access_token.length)];
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
var lazy_pay_log = require('../models/lazy_pay_log');
const crypto = require('crypto');
let Client = require('node-rest-client').Client;
let client = new Client();
var kyc_detail = require('../models/kyc_detail');
var kyc_history = require('../models/kyc_history');
//let sales_marketing_material = require('../models/sales_marketing_material');
//let sales_material_tracking = require('../models/sales_material_tracking'); 
var emailtocc = {
    "Product Input Page": {
        "Make Model Variant not available": [{
            "to": "quotesupport@policyboss.com",
            "cc": "techsupport@policyboss.com"
        }]
    },
    "Quotation": [{
        "to": "quotesupport@policyboss.com",
        "cc": "techsupport@policyboss.com"
    }],
    "Proposal": [{
        "to": "",
        "cc": "techsupport@policyboss.com"
    }],
    "Policy not received": [{
        "to": "jyoti.sharma@policyboss.com",
        "cc": "techsupport@policyboss.com;susanna.lobo@landmarkinsurance.in"
    }],
    "Post Sale Query": [{
        "to": "jyoti.sharma@policyboss.com",
        "cc": "techsupport@policyboss.com;susanna.lobo@landmarkinsurance.in"
    }],
    "Endorsement": [{
        "to": "jyoti.sharma@policyboss.com",
        "cc": "techsupport@policyboss.com;susanna.lobo@landmarkinsurance.in"
    }],
    "Claim Related": [{
        "to": "jyoti.sharma@policyboss.com",
        "cc": "techsupport@policyboss.com;susanna.lobo@landmarkinsurance.in"
    }],
    "Finmart": [{
        "to": "pramod.parit@policyboss.com",
        "cc": "techsupport@policyboss.com"
    }],
    "Received policy copy, CRN is not marked as sell": [{
        "to": "nikita.jadhav@policyboss.com;jyoti.sharma@policyboss.com",
        "cc": "techsupport@policyboss.com;susanna.lobo@landmarkinsurance.in"
    }],
    "Done payment but not received policy copy": [{
        "to": "jyoti.sharma@policyboss.com",
        "cc": "techsupport@policyboss.com;susanna.lobo@landmarkinsurance.in"
    }],
    "Sign up issue": [{
        "to": "",
        "cc": "techsupport@policyboss.com"
    }],
    "Login issue": [{
        "to": "",
        "cc": "techsupport@policyboss.com"
    }]
}

var store_path = appRoot + "/tmp/ticketing";
var mongojs = require('mongojs');
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './tmp/ticketing' });
const multipartMiddleware1 = multipart({ uploadDir: './tmp/kyc_documents' });
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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
    "Insurer_12": "NewIndia"
};
var emailtocc = {
    "Product Input Page": {
        "Make Model Variant not available": [{
            "to": "savio.lobo@landmarkinsurance.in,ashish.hatia@policyboss.com",
            "cc": "techsupport@policyboss.com"
        }]
    },
    "Quotation": [{
        "to": "quotesupport@policyboss.com",
        "cc": "techsupport@policyboss.com"
    }],
    "Proposal": [{
        "to": "",
        "cc": "techsupport@policyboss.com"
    }],
    "Policy not received": [{
        "to": "jyoti.sharma@policyboss.com",
        "cc": "techsupport@policyboss.com,susanna.lobo@landmarkinsurance.in"
    }],
    "Post Sale Query": [{
        "to": "jyoti.sharma@policyboss.com",
        "cc": "techsupport@policyboss.com,susanna.lobo@landmarkinsurance.in"
    }],
    "Endorsement": [{
        "to": "jyoti.sharma@policyboss.com",
        "cc": "techsupport@policyboss.com,susanna.lobo@landmarkinsurance.in"
    }],
    "Claim Related": [{
        "to": "jyoti.sharma@policyboss.com",
        "cc": "techsupport@policyboss.com,susanna.lobo@landmarkinsurance.in"
    }],
    "Finmart": [{
        "to": "pramod.parit@policyboss.com",
        "cc": "techsupport@policyboss.com"
    }],
    "Received policy copy, CRN is not marked as sell": [{
        "to": "nikita.jadhav@policyboss.com,jyoti.sharma@policyboss.com",
        "cc": "techsupport@policyboss.com,susanna.lobo@landmarkinsurance.in"
    }],
    "Done payment but not received policy copy": [{
        "to": "jyoti.sharma@policyboss.com",
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

router.post('/signuptest', function (req, res) {
    if (!req.body.id || !req.body.password) {
        res.status("400");
        res.send("Invalid details!");
    } else {
        Users.filter(function (user) {
            if (user.id === req.body.id) {
                res.render('signup', {
                    message: "User Already Exists! Login or choose another user id"
                });
            }
        });
        var newUser = { id: req.body.id, password: req.body.password };
        Users.push(newUser);
        req.session.user = newUser;
        res.send(req.session.user);
    }
});

router.post('/product_share/product_share_url', function (req, res) {
    try {
        var product_share = require('../models/product_share');
        var product_share_history = require('../models/product_share_history');
        var objReq = req.body;
        var ss_id = objReq['ss_id'] - 0;
        var fba_id = objReq['fba_id'] - 0;
        var sub_fba_id = objReq['sub_fba_id'] - 0;
        var product_id = objReq['product_id'] - 0;
        var product_name = "";
        var send_url, URL = "";
        var msg = "";
        if (product_id === 17) {
            msg = "Beat The Pandemic by choosing Corona Insurance along with wellness benefits such as Doctor on Call, Message Relay and more.\n\n";
            msg += "Ensure no unplanned medical event disrupts the safety of your family.\n\n";
            msg += "Stay Safe, Insure Online\n";
        } else if (product_id === 23) {
            msg = "Secure your good health via a health insurance offering hosp. Upto SI, 405 day care treatments, life long renewablity and much more.\n\n";
            msg += "No Medicals up to age 50.\n\n";
            msg += "Stay Safe, Stay Healthy, Stay Insured\n";
        } else {
            msg = "Let's beat the threat of Corona Virus together, by minimizing risk from personal interactions.\n\n";
            msg += "In case you intend to purchase any insurance product, contact me or click here!\n\n";
            msg += "Stay Safe, Make Insurance Payments/ Purchase Online!\n";
        }
        if (ss_id === 0 || product_id === 0 || product_id === "") {
            res.json({ 'Msg': "Ss_id,Fba_id,Product_id is Required", 'URL': "", 'Status': "Failure" });
        } else {
            if (product_id === 1) {
                product_name = "Car";
                URL = "https://www.policyboss.com/car-insurance?utm_source=agent_campaign&utm_medium=" + ss_id + "_" + fba_id + "_" + sub_fba_id + "&utm_campaign=FMPCI";
            } else if (product_id === 10) {
                product_name = "Bike";
                URL = "https://www.policyboss.com/two-wheeler-insurance?utm_source=agent_campaign&utm_medium=" + ss_id + "_" + fba_id + "_" + sub_fba_id + "&utm_campaign=FMPTW";
            } else if (product_id === 2) {
                product_name = "Health";
                URL = "https://www.policyboss.com/Health/?utm_source=agent_campaign&utm_medium=" + ss_id + "_" + fba_id + "_" + sub_fba_id + "&utm_campaign=FMPHI";
            } else if (product_id === 12) {
                product_name = "CV";
                URL = "https://www.policyboss.com/commercial-vehicle-insurance/commercial-vehicle-insurance.html?utm_source=agent_campaign&utm_medium=" + ss_id + "_" + fba_id + "_" + sub_fba_id + "&utm_campaign=FMPCV";
            } else if (product_id === 17) {
                product_name = "Corona Care";
                URL = 'http://horizon.policyboss.com/wellness_product?ss_id=' + ss_id + '&fba_id=' + fba_id + '&sub_fba_id=' + sub_fba_id;
            } else if (product_id === 23) {
                product_name = "Group Health Care";
                URL = 'http://horizon.policyboss.com/kotak-group-health-care?ss_id=' + ss_id + '&fba_id=' + fba_id + '&sub_fba_id=' + sub_fba_id;
            } else if (product_id === 3) {
                product_name = "Group Health Care";
                URL = ((config.environment.name === 'Production') ? 'http://horizon.policyboss.com/' : 'http://qa-horizon.policyboss.com/') + 'hdfc-life-sanchay?ss_id=' + ss_id + '&fba_id=' + fba_id + '&sub_fba_id=' + sub_fba_id;
            } else if (product_id === 22) {
                product_name = "Hospi Fund";
                URL = "https://www.policyboss.com/Health/?utm_source=agent_campaign&utm_medium=" + ss_id + "_" + fba_id + "_" + sub_fba_id + "&utm_campaign=FMPHI";
            }
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var bitlyURL;
            if (product_id === 17 || product_id === 23 || product_id === 3) {
                bitlyURL = "https://api-ssl.bitly.com/v3/shorten?access_token=" + config.environment.bitly_access_token + '&longUrl=' + encodeURIComponent(URL);
            } else {
                bitlyURL = config.environment.shorten_url + '?longUrl=' + encodeURIComponent(URL);
            }
            var pro_share = new product_share();
            product_share.find({ "ss_id": ss_id, "fba_id": fba_id, "product_id": product_id }, function (err, dbData) {
                if (dbData.length > 0) {
                    var count = parseInt(dbData[0]._doc['Share_Count']) + 1;
                    send_url = dbData[0]._doc['URL'];
                    var objProduct = {
                        "Share_Count": count,
                        "Modified_On": new Date()
                    };
                    product_share.update({ "ss_id": ss_id, "fba_id": fba_id, "product_id": product_id }, { $set: objProduct }, function (err, objproduct_share) {
                        if (err) {
                            res.json({ 'Msg': err, 'URL': "", 'Status': "Failure" });
                        } else {
                            var objproduct_share_history = new product_share_history();
                            for (var key in req.body) {
                                objproduct_share_history[key] = req.body[key];
                            }
                            objproduct_share_history.Created_On = new Date();
                            objproduct_share_history.Modified_On = new Date();
                            objproduct_share_history.URL = send_url;
                            objproduct_share_history.save(function (err1) {
                                if (err1) {
                                    res.json({ 'Msg': err1, 'URL': "", 'Status': "Failure" });
                                } else {
                                    res.json({ 'Msg': msg, 'URL': send_url, 'Status': "Success" });
                                }
                            });
                        }
                    });
                } else {
                    client.get(bitlyURL, function (data, response) {
                        console.log('Bitly-', data);
                        if (product_id === 17 || product_id === 23 || product_id === 3) {
                            if (data && data.status_code === 200) {
                                send_url = data.data.url;
                            }
                        } else {
                            if (data && data.Short_Url !== "") {
                                send_url = data.Short_Url;
                            }
                        }
                        for (var key in req.body) {
                            pro_share[key] = req.body[key];
                        }
                        pro_share.Created_On = new Date();
                        pro_share.Modified_On = new Date();
                        pro_share.Share_Count = 1;
                        pro_share.URL = send_url;
                        pro_share.save(function (err) {
                            if (err) {
                                res.json({ 'Msg': err, 'URL': "", 'Status': "Failure" });
                            } else {
                                var objproduct_share_history = new product_share_history();
                                for (var key in req.body) {
                                    objproduct_share_history[key] = req.body[key];
                                }
                                objproduct_share_history.Created_On = new Date();
                                objproduct_share_history.Modified_On = new Date();
                                objproduct_share_history.URL = send_url;
                                objproduct_share_history.save(function (err1) {
                                    if (err1) {
                                        res.json({ 'Msg': err1, 'URL': "", 'Status': "Failure" });
                                    } else {
                                        res.json({ 'Msg': msg, 'URL': send_url, 'Status': "Success" });
                                    }
                                });
                            }
                        });
                    });
                }
            });
            //});
        }

    } catch (e) {
        res.json({ 'Msg': e, 'URL': "", 'Status': "Failure" });
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
                res.json({ 'Msg': '', Status: 'Fail' });
            } else {
                res.json({ 'Msg': 'Saved Succesfully!!!', Status: 'Success' });
            }
        });


    } catch (errex) {
        res.json({ 'Msg': 'error', Error_Msg: errex.stack, Status: 'Fail' });
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
            res.json({ 'Status': "Failure" });
        } else {
            res.json({ 'Status': "Success" });
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
                res.json({ 'Status': "Failure" });
            } else {
                res.json({ 'Status': "Success" });
            }
        });
        //}
    } catch (e) {
        res.json({ 'Status': "Failure", 'Error': e });
    }
});
router.post('/lead_disposition_save', function (req, res) {
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
            if (fs.existsSync(path + fields["lead_id"])) {

            } else {
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
            // ss_id: req.obj_session.user.ss_id,
            Is_Latest: 1,
            // fba_id: req.obj_session.user.fba_id,
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
            res.json({ 'Msg': 'Fail' });

            console.log('File uploaded and moved!');
            var lead = require('../models/leads');
            var objData = {
                'lead_disposition': fields["dsp_status"],
                'lead_subdisposition': fields["dsp_substatus"],
                'lead_disposition_assigned_on': new Date()
            };
            lead.update({ 'Lead_Id': fields["lead_id"] }, { $set: objData }, { multi: false }, function (err, numAffected) {
            });
            res.json({ 'Msg': 'Success' });
        });
    });

});
router.get('/get_lead_disposition_data/:lead_id', function (req, res) {
    try {
        var lead_id = parseInt(req.params.lead_id);
        var lead_disposition = require('../models/lead_disposition');

        lead_disposition.find({ "Lead_Id": lead_id }, function (err, dblead) {
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

        lead_disposition.find({ "Lead_Id": lead_id }, function (err, dblead) {
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

        lead_allocations.find({ "Caller_Id": caller_id }, function (err, dblead) {
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
            select: 'Lead_Id Customer_Name Product_Id mobile policy_expiry_date Created_On Make_Name Model_Name Variant_Name VehicleCity_RTOCode lead_type lead_assigned_on lead_disposition_assigned_on lead_disposition lead_subdisposition',
            sort: { 'Created_On': -1 },
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
        if (ObjRequest.lead_assigned !== "" && ObjRequest.lead_assigned !== undefined) {
            filter["lead_assigned"] = ObjRequest.lead_assigned;
        }
        if (ObjRequest.lead_disposition !== "" && ObjRequest.lead_disposition !== undefined) {
            filter["lead_disposition"] = ObjRequest.lead_disposition;
        }
        if (ObjRequest.lead_subdisposition !== "" && ObjRequest.lead_subdisposition !== undefined) {
            filter["lead_subdisposition"] = ObjRequest.lead_subdisposition;
        }
        if (ObjRequest.lead_status !== "" && ObjRequest.lead_status !== undefined) {
            filter["lead_status"] = ObjRequest.lead_status;
        }
        if (ObjRequest.src_ssid !== "" && ObjRequest.src_ssid !== undefined) {
            filter["ss_id"] = ObjRequest.src_ssid;
        }
        if (ObjRequest.name !== "" && ObjRequest.name !== undefined) {
            filter["Customer_Name"] = new RegExp(req.body.name, 'i');
        }
        if (ObjRequest.mobile !== "" && ObjRequest.mobile !== undefined) {
            filter["mobile"] = req.body.mobile;
        }
        if (ObjRequest.src_crn !== "" && ObjRequest.src_crn !== undefined) {
            filter["PB_CRN"] = req.body.src_crn;
        }
        if (fromDate !== "" && toDate !== "") {
            filter["policy_expiry_date"] = { $gte: fromDate, $lt: toDate };

        }
        var lead = require('../models/leads');
        console.error('HorizonLeadList', filter, req.body);
        lead.paginate(filter, optionPaginate).then(function (user_datas) {
            res.json(user_datas);
        });
    } catch (e) {
        console.log(e);
        res.json({ 'Msg': 'error', 'Status': 'fail' });
    }
});

router.get('/create_lead_request/:lead_id', function (req, res, next) {
    var lead_id = parseInt(req.params.lead_id);
    var moment = require('moment');
    try {
        if (lead_id) {
            var lead = require('../models/leads');
            lead.findOne({ Lead_Id: lead_id }).exec(function (err, dblead) {
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
                    data1["is_policy_exist"] = "yes";
                } else {
                    data1["is_breakin"] = "no";
                    data1["is_policy_exist"] = "no";
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
        res.json({ 'Msg': 'error', 'Status': 'fail' });
    }
});

router.post('/get_variant', function (req, res, next) {
    try {
        var Product_Id_New = req.body['product_id'] - 0;
        var Insurer_ID = req.body['insurer_id'] - 0;
        var Insurer_Vehicle_Model_Name = req.body['model_name'];
        var Insurer_Vehicle_FuelType = req.body['fuel_type'];
        var Insurer_Vehicle_CubicCapacity = req.body['cubic_capacity'];
        var Insurer_Vehicle_Model_Code = req.body['model_code'] ? req.body['model_code'] : '';
        var args = { "Product_Id_New": Product_Id_New, "Insurer_ID": Insurer_ID, "Insurer_Vehicle_Model_Name": Insurer_Vehicle_Model_Name, "Insurer_Vehicle_CubicCapacity": Insurer_Vehicle_CubicCapacity, "Insurer_Vehicle_FuelType": Insurer_Vehicle_FuelType };
        var new_args = { "_id": 0, "Insurer_Vehicle_Code": 1, "Insurer_Vehicle_Variant_Name": 1, "Insurer_Vehicle_Variant_Code": 1, Insurer_Vehicle_CubicCapacity: 1 };
        if (Insurer_Vehicle_Model_Code) {
            args['Insurer_Vehicle_Model_Code'] = Insurer_Vehicle_Model_Code;
        }
        if (Insurer_ID == 17) {
            args['Insurer_Vehicle_CubicCapacity'] = args['Insurer_Vehicle_CubicCapacity'] - 0;
        }
        var Vehicles_Insurer = require('../models/vehicles_insurer');
        Vehicles_Insurer.find(args, new_args, function (err, dbData) {
            if (err) {
                res.json({ msg: 'fail', data: '' });
            } else {
                res.json({ msg: 'success', data: dbData });
            }
        });
    } catch (e) {
        res.json({ msg: 'fail', data: '', error: e });
    }
});



router.post('/raiseticket', multipartMiddleware, function (req, res, next) {
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
                                {
                                    "$group": {
                                        "_id": "$Ticket_Id",
                                        "docId": { "$last": "$_id" },
                                        "Ticket_Id": { "$last": "$Ticket_Id" },
                                        "Category": { "$last": "$Category" },
                                        "SubCategory": { "$last": "$SubCategory" },
                                        "From": { "$last": "$From" },
                                        "To": { "$last": "$To" },
                                        "Status": { "$last": "$Status" },
                                        "Created_by": { "$last": "$Created_by" },
                                        "Created_On": { "$last": "$Created_On" },
                                        "Modified_On": { "$last": "$Modified_On" },
                                        "CRN": { "$last": "$CRN" },
                                        "Mobile_No": { "$last": "$Mobile_No" },
                                        "Vehicle_No": { "$last": "$Vehicle_No" },
                                        "Remark": { "$last": "$Remark" },
                                        "ss_id": { "$last": "$ss_id" },
                                        "SubCategory_level2": { "$last": "$SubCategory_level2" },
                                        "Product": { "$last": "$Product" }
                                    }
                                },
                                // Then sort
                                { "$sort": { "Created_On": -1 } }

                            ];
                            console.log(agg);
                            //tickets.aggregate(agg, function (err1, dbTicket1) {
                            if (err1) {
                                throw err1;
                            } else {

                                tickets.find({ "$or": [{ "CRN": (objRequest.CRN).toString() }, { "CRN": parseInt(objRequest.CRN) }], "Category": objRequest.Category }).toArray(function (err, crn_cat_exist) {
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
                                        tickets.findOne({ "Ticket_Id": Ticket_id }, { sort: { "Modified_On": -1 } }, function (err, dbticket) {
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
                                                RM_Email_Id: dbticket !== null ? dbticket["RM_Email_Id"] : objRequest["rm_email_id"]
                                            };
                                            var filecount = 0;
                                            if (dbticket !== null) {
                                                var objticket = {};
                                                objticket['IsActive'] = 0;

                                                tickets.updateMany({ 'Ticket_Id': NewTicket_Id }, { $set: { "IsActive": 0 } }, function (err, numAffected) {
                                                    if (err) {
                                                        res.json({ Msg: 'Ticket_Not_Saved', Details: err });
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
                                                    //client.post(url_api, userdetails, function (data, response) {
                                                    //if (data.Status === "error") {
                                                    //throw err;
                                                    //} else {
                                                    //console.log(response);
                                                    //Upload documnent
                                                    if (file_obj.length > 0 && objRequest["Source"] === "policyboss") {
                                                        var objfile = {
                                                            "file_1": null,
                                                            "file_2": null,
                                                            "file_3": null,
                                                            "file_4": null
                                                        };
                                                        var objdata = { 'UploadFiles': objfile };
                                                        if (!fs.existsSync(appRoot + "/tmp/ticketing/" + NewTicket_Id)) {
                                                            fs.mkdirSync(appRoot + "/tmp/ticketing/" + NewTicket_Id);
                                                        }

                                                        var doc_prefix = "";
                                                        for (var i in file_obj) {
                                                            var data = file_obj[i].replace(/^data:image\/\w+;base64,/, "");
                                                            if (data === "") {
                                                                res1.json({ 'msg': 'Something Went Wrong' });
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
                                                        tickets.findAndModify({ 'Ticket_Id': NewTicket_Id }, [["Modified_On", -1]], { $set: objdata }, {}, function (err, numAffected) {
                                                            console.log('UserDataUpdated', err, numAffected);
                                                            if (err) {
                                                                objdata['Msg'] = err;
                                                            } else {
                                                                objdata['Msg'] = numAffected;

                                                            }
                                                        });
                                                    } else {
                                                        //movefilelocation(req.files.uploads, NewTicket_Id, objRequest["doc_prefix"]);
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
                                                        if (agentdetails.Email_Id !== "jyoti.sharma@policyboss.com") {
                                                            email_id += ";jyoti.sharma@policyboss.com";
                                                        }

                                                        cc += ";susanna.lobo@landmarkinsurance.in";
                                                    }
                                                    if (email_id !== null || email_id !== undefined) {
                                                        objModelEmail.send('noreply@policyboss.com', email_id, subject, mail_content, cc, config.environment.notification_email, objRequest["CRN"]);
                                                    }

                                                    if (Ticket_id === "") {
                                                        res.json({ 'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is created.', 'Created_On': moment(todayDate).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Insurer_Name': Insurer_name, 'Product_Name': objRequest['Product'] });
                                                    } else {
                                                        res.json({ 'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is updated.', 'Created_On': moment(todayDate).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Insurer_Name': Insurer_name, 'Product_Name': objRequest['Product'] });
                                                    }

                                                    //}
                                                    //});
                                                    //user_details end
                                                } else {
                                                    res.json({ 'Status': "Fail", 'Msg': "No Ticket raised" });
                                                }
                                                //console.log(res);
                                            });
                                        });
                                    } else {
                                        res.json({ 'Status': "exist", 'Msg': 'Ticket for this CRN under this category is already created' });
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
        res.json({ 'msg': 'error' });
    }
});

router.post('/admin_raiseticket', LoadSession1, function (req, res, next) {
    try {		 
        var product_id = 0;
        var fields = req.fields;
        var files = req.files;
        var objRequest;
        objRequest = fields;
		let ticket_remark = objRequest["txt_remark"];
		objRequest["txt_remark"] = htmlEscape(ticket_remark);
		console.error("objRequest Ticket", objRequest);
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
                    var offical_email_id;
                    if (req.obj_session.user.hasOwnProperty('profile') && req.obj_session.user.profile.hasOwnProperty('Official_Email') && req.obj_session.user.profile.Official_Email) {
                        offical_email_id = req.obj_session.user.profile.Official_Email;
                    } else {
                        offical_email_id = req.obj_session.user.email;
                    }
                    tickets.find({ "CRN": objRequest.CRN, "Category": objRequest.Category }).toArray(function (err, crn_cat_exist) {
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
                                tickets.findOne({ "Ticket_Id": Ticket_id }, { sort: { "Modified_On": -1 } }, function (err, dbticket) {
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
                                                user_details.update({ 'Ticket_code': Ticket_id }, { $set: objticket }, function (err, numAffected) {
                                                    console.log('user_detailsUpdate', err, numAffected);
                                                    //                                                    res.json({'Status': 'Updated'});
                                                });
                                            }

                                            //Upload documnent
                                            var objfile = {
                                                "file_1": null,
                                                "file_2": null,
                                                "file_3": null,
                                                "file_4": null
                                            };
                                            var objdata = { 'UploadFiles': objfile };
                                            if (files !== null) {
                                                if (!fs.existsSync(appRoot + "/tmp/ticketing/" + NewTicket_Id)) {
                                                    fs.mkdirSync(appRoot + "/tmp/ticketing/" + NewTicket_Id);
                                                }

                                                var pdf_file_name = "";

                                                for (var i in files) {
                                                    var doc_prefix = objRequest["doc_prefix"] !== "" ? objRequest["doc_prefix"] + "_" : "";
                                                    pdf_file_name = i + "." + files[i].name.split('.')[1];
                                                    var pdf_sys_loc_horizon = appRoot + "/tmp/ticketing/" + NewTicket_Id + "/" + doc_prefix + req.obj_session.user.ss_id + "_" + pdf_file_name;
                                                    var pdf_web_path_horizon = config.environment.downloadurl + "/ticketing/" + NewTicket_Id + "/" + doc_prefix + req.obj_session.user.ss_id + "_" + pdf_file_name;
                                                    objdata.UploadFiles[i] = pdf_web_path_horizon;
                                                    var oldpath = files[i].path;
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
                                                    sleep(1000);
                                                }
                                                tickets.update({ 'Ticket_Id': NewTicket_Id }, { $set: objdata }, function (err, numAffected) {
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
                                                if (objRequest["Category_Name"] === "Product Input Page") {
													try {
														if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"] !== "") {
															to += "," + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"];
														}
														if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"] !== "") {
															cc += objRequest["rm_email_id"] !== "" ? "," + objRequest["rm_email_id"] : '' + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"];
														}
													} catch (e) {
														console.error("/admin_raiseticket", e.stack);
													}
                                                } else {
													try {
														if (emailtocc[objRequest["Category_Name"]][0]["to"] !== "") {
															to += "," + emailtocc[objRequest["Category_Name"]][0]["to"];
														}
														if (emailtocc[objRequest["Category_Name"]][0]["cc"] !== "") {
															cc += objRequest["rm_email_id"] !== "" ? "," + objRequest["rm_email_id"] : '' + emailtocc[objRequest["Category_Name"]][0]["cc"];
														}
													} catch (e) {
														console.error("/admin_raiseticket", e.stack);
													}
                                                }
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
                                                res.json({ 'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is created.', 'Created_On': moment(objRequest["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), "Product_Name": product_name, 'Insurer_Name': Insurer_Name });
                                            } else {
                                                res.json({ 'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is updated.', 'Created_On': moment(objRequest["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), "Product_Name": product_name, 'Insurer_Name': Insurer_Name });
                                            }

                                        } else {
                                            //console.log(response);
                                        }

                                        ////console.log(res);
                                    });
                                });
                            } else {
                                res.json({ 'Status': "exist", 'Msg': 'Ticket for this CRN under this category is already created' });
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
router.get('/tickets/getCRNdetails/:CRN', function (req, res) {
    try {
        var CRN = req.params['CRN'];
        var user_data = require('../models/user_data');
        var ObjArrResponse = [];
        var objResponse = {};

        //MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
        user_data.find({ 'PB_CRN': CRN }).exec(function (err, dbUsers) {
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

router.post('/posp_enquiry', function (req, res) {
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
                res.json({ 'Msg': err1, 'Status': "Error" });
            } else {
                res.json({ 'Msg': "Data Inserted Successfully", 'Status': "Success", 'email': dbrespnse._doc["email"], 'mobile': dbrespnse._doc["mobile"] });
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
                    '<p>We have received POSP inquiry as following</p>' +
                    '<p></p>Name - ' + dbrespnse._doc["name"] +
                    '<p></p>Contact Number  - ' + dbrespnse._doc["mobile"] +
                    '<p></p>Email Id  - ' + dbrespnse._doc["email"] +
                    '<p></p>City  - ' + dbrespnse._doc["city_name"] +
                    '<p></p><p></p>Regards,' +
                    '<p></p>PolicyBoss' +
                    '</body></html>';
                let email_id = "st@policyboss.com;marketing@policyboss.com;srinivas@policyboss.com";
                objModelEmail.send('noreply@policyboss.com', email_id, subject, mail_content, '', config.environment.notification_email, '');
            }
        });
    } catch (e) {
        res.json({ 'Msg': e, 'Status': "Error" });
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
        Sync_Contact.update({ 'sync_contact_id': obj_RsaData['sync_contact_id'] }, { $set: obj_req }, function (err, numAffected) {
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
                Sync_Contact.update({ 'sync_contact_id': obj_RsaData['sync_contact_id'] }, { $set: obj_res }, function (err, numAffected) {
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
                Sync_Contact.update({ 'sync_contact_id': obj_RsaData['sync_contact_id'] }, { $set: obj_res }, function (err, numAffected) {
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
            sort: { 'Created_On': 1 },
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

        filter["ss_id"] = ObjRequest.ss_id - 0;

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
        res.json({ "Msg": "error" });
    }
});
router.post('/get_sync_match_data', LoadSession, function (req, res) {
    try {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: 'mobile name policy_expiry_date make model erp_qt rto_city registration_no Created_On',
            sort: { 'Created_On': 1 },
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
        res.json({ "Msg": "error" });
    }
});

router.post('/ticket/search11', function (req, res) {
    try {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: 'Ticket_code Product Category SubCategory From Created_On Modified_On Status CRN Remark Ageing Close_Date Agent_Email_Id',
            sort: { 'Created_On': -1 },
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
                    Condition = {
                        "ss_id": objRequest.ss_id - 0,
                        "Created_On": { $gte: dateFrom, $lt: dateTo }
                    };
                } else {
                    Condition = {
                        "Category": { $in: objCategory },
                        "Modified_On": { $gte: dateFrom, $lt: dateTo }
                    };
                }
                if (objRequest["status"] !== "") {
                    Condition["Status"] = objRequest["status"];
                }
            }
            mysort = { Modified_On: -1 };
        } else {
            if (roleType === "tickets") {
                Condition = {
                    "ss_id": objRequest.ss_id - 0,
                    "Created_On": { $gte: dateFrom, $lt: dateTo }
                };
            } else {
                Condition = {
                    "Category": { $in: objCategory },
                    "Modified_On": { $gte: dateFrom, $lt: dateTo }
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
        res.json({ 'msg': 'error' });
    }
});

router.post('/ticket/search890', function (req, res) {
    try {
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

        console.log('DateRange', 'from', dateFrom, 'to', dateTo);

        if (objRequest["search_by"] !== "CurrentDate") {
            if (objRequest["search_by"] === "ticketid") {
                //Condition["Ticket_Id"] = objRequest["search_byvalue"];
                Condition["Ticket_Id"] = new RegExp(objRequest["search_byvalue"], 'i');
            } else if (objRequest["search_by"] === "CRN") {
                Condition["CRN"] = parseInt(objRequest["search_byvalue"]);
            } else {
                if (roleType === "tickets") {
                    Condition = {
                        "ss_id": ss_id,
                        "Created_On": { $gte: dateFrom, $lt: dateTo }
                    };
                } else {
                    Condition = {
                        "Category": { $in: objCategory },
                        "Modified_On": { $gte: dateFrom, $lt: dateTo }
                    };
                }
                if (objRequest["status"] !== "") {
                    Condition["Status"] = objRequest["status"];
                }
            }
            mysort = { Modified_On: -1 };
        } else {
            if (roleType === "tickets") {
                Condition = {
                    "ss_id": ss_id,
                    "Created_On": { $gte: dateFrom, $lt: dateTo }
                };
            } else {
                Condition = {
                    "Category": { $in: objCategory },
                    "Modified_On": { $gte: dateFrom, $lt: dateTo }
                };
            }
            if (objRequest["status"] !== "") {
                Condition["Status"] = objRequest["status"];
            }
        }
        console.log(Condition);
        var agg = [
            // Group by the grouping key, but keep the valid values
            {
                "$group": {
                    "_id": "$Ticket_Id",
                    "docId": { "$last": "$_id" },
                    "Ticket_Id": { "$last": "$Ticket_Id" },
                    "Category": { "$last": "$Category" },
                    "SubCategory": { "$last": "$SubCategory" },
                    "channel": { "$last": "$channel" },
                    "subchannel": { "$last": "$subchannel" },
                    "From": { "$last": "$From" },
                    "To": { "$last": "$To" },
                    "Status": { "$last": "$Status" },
                    "Created_By": { "$last": "Created_By" },
                    "Created_On": { "$last": "$Created_On" },
                    "Modified_On": { "$last": "$Modified_On" },
                    "CRN": { "$last": "$CRN" },
                    "Mobile_No": { "$last": "$Mobile_No" },
                    "Vehicle_No": { "$last": "$Vehicle_No" },
                    "Remark": { "$last": "$Remark" },
                    "ss_id": { "$last": "$ss_id" },
                    "SubCategory_level2": { "$last": "$SubCategory_level2" },
                    "Product": { "$last": "$Product" },
                    "UploadFiles": { "$last": "$UploadFiles" },
                    "Agent_Email_Id": { "$last": "$Agent_Email_Id" }
                }
            },
            { "$match": Condition },
            // Then sort
            { "$sort": { "Modified_On": -1 } }
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
        res.json({ 'msg': 'error' });
    }
});

router.post('/sync_contacts/razor_payment_history', LoadSession, function (req, res) {
    try {
        var Base = require('../libs/Base');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: 'Lead_Count Total_Premium Email Mobile Name Transaction_Status Created_On Ss_Id Fba_ID Plan',
            sort: { 'Created_On': -1 },
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
        res.json({ "Msg": "error" });
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
            if (ss_id > 0 && ss_id !== 5) {
                for (var i in vcard) {
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
                                            if (exist_contact.indexOf(mobileno) > -1) {
                                                objRequest['name'] = name;
                                                objRequest['Modified_On'] = new Date();
                                                objRequest['raw_data'] = vcard[i];
                                                let myquery = { mobileno: mobileno, ss_id: ss_id };
                                                let newvalues = { $set: objRequest };
                                                Sync_Contact.update(myquery, newvalues, { multi: false }, function (err, numAffected) {
                                                    if (err) {
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


router.post('/tickets', LoadSession, function (req, res) {
    var objBase = new Base();
    var Ticket = require('../models/ticket');
    var obj_pagination = objBase.jqdt_paginate_process(req.body);

    var optionPaginate = {
        select: '',
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
    console.error('Filter', req.body);
    if (req.body['search[value]'] !== '' && req.body['search[value]'] !== undefined) {
        if (isNaN(req.body['search[value]'])) {
            filter = {
                $or: [
                    { 'Request_Unique_Id': new RegExp(req.body['search[value]'], 'i') },
                    { 'Posp_Unique_Id': new RegExp(req.body['search[value]'], 'i') },
                    { 'Method_Type': new RegExp(req.body['search[value]'], 'i') },
                    { 'Error_Code': new RegExp(req.body['search[value]'], 'i') }
                ]
            };
        } else {
            filter = { 'Product_Id': parseInt(req.body['Product_Id']) };
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
                filter['Last_Status'] = { $in: arr_last_status };
            }
        }
    }


    Ticket.paginate(filter, optionPaginate).then(function (posps) {
        console.log(obj_pagination.filter, optionPaginate, posps);
        res.json(posps);
    });
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

    let mail_content = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>CORP LEAD</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
    mail_content += objectToHtml(obj_content);
    mail_content += '</body></html>';

    var corp_lead = require('../models/corp_lead');
    let corp_lead_log = new corp_lead(arg);
    corp_lead_log.save(function (err, res1) {
        if (err) {
            res.json({ 'Status': 'Fail' });
        } else {
            if (res1.hasOwnProperty('_doc')) {
                var Email = require('../models/email');
                var objModelEmail = new Email();
                if (config.environment.name === 'Production') {
                    var to = "sagar.tejuja@landmarkinsurance.in,manish.hingorani@landmarkinsurance.in";
                    var cc = "marketing@policyboss.com";
                } else {
                    var to = "roshani.prajapati@policyboss.com";
                    var cc = "roshaniprajapati567@gmail.com,anuj.singh@policyboss.com";
                }
                var subject = "[CorpLeadId-" + res1['_doc']['Corp_Id'] + "]Product-" + res1['_doc']['Product'];
                objModelEmail.send('noreply@policyboss.com', to, subject, mail_content, cc, config.environment.notification_email);
                res.json({ 'Status': 'Success' });
            }
        }
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
        res.json({ msg: 'fail', url: '', error: e });
    }
});

router.get('/protectme_pdf/:UID', function (req, res, next) {
    try {
        var User_Data_Id = req.params['UID'] - 0;
        var protect_me_well = require('../models/protect_me_well_detail');
        protect_me_well.findOne({ "User_Data_Id": User_Data_Id }, function (err, dbData) {
            if (err) {
                res.json({ msg: 'fail', url: '' });
            } else {
                var url = dbData._doc.protect_me_link_url;
                res.json({ msg: 'success', url: url });
            }
        });
    } catch (e) {
        res.json({ msg: 'fail', url: '', error: e });
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
                    protect_me_well.findOne({ "User_Data_Id": User_Data_Id }, function (err, dbData) {
                        if (err) {

                        } else {
                            if (dbData) {
                                if (dbData._doc.hasOwnProperty('protect_me_link_url') && (dbData._doc["protect_me_link_url"] !== null || dbData._doc["protect_me_link_url"] !== "")) {
                                    return res.redirect(dbData._doc["protect_me_link_url"]);
                                } else {
                                    var obj_res = {};
                                    let obj_visted_history = {
                                        "ip_address": ip_address,
                                        "date_time": new Date()
                                    };
                                    obj_res["protect_me_link_history"] = obj_visted_history;
                                    protect_me_well.updateOne({ 'User_Data_Id': User_Data_Id }, { $set: { 'is_protect_me_visited': parseInt(dbData._doc["is_protect_me_visited"]) + 1 } }, function (err, numAffected) {
                                        console.log(err);
                                    });
                                    protect_me_well.updateOne({ 'User_Data_Id': User_Data_Id }, { $addToSet: obj_res }, function (err, numAffected) {
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
                                        res.json({ 'Msg': '', Status: 'Fail' });
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
router.post('/update_ticket', LoadSession1, function (req, res, next) {
    try {
        console.error("req.fields");
        console.error(req.fields);
        console.error("fields");
        console.error(fields);
        var fields = req.fields;
        var files = req.files;
        var objRequest;
        objRequest = fields;
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
            tickets.findOne({ "Ticket_Id": Ticket_id }, { sort: { "Modified_On": -1 } }, function (err, dbticket) {
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
                        user_details.update({ 'Ticket_code': Ticket_id }, { $set: objticket }, function (err, numAffected) {
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
                            if (dbticket["Category_Name"] === "Product Input Page") {
                                if (emailtocc[dbticket["Category_Name"]][dbticket["SubCategory"]][0]["to"] !== "") {
                                    to += "," + emailtocc[dbticket["Category_Name"]][dbticket["SubCategory"]][0]["to"];
                                }
                                if (emailtocc[dbticket["Category_Name"]][dbticket["SubCategory"]][0]["cc"] !== "") {
                                    cc += dbticket["RM_Email_Id"] !== "" ? "," + dbticket["RM_Email_Id"] : '' + emailtocc[dbticket["Category_Name"]][dbticket["SubCategory"]][0]["cc"];
                                }
                            } else {

                                if (emailtocc[dbticket["Category_Name"]][0]["to"] !== "") {
                                    to += "," + emailtocc[dbticket["Category_Name"]][0]["to"];
                                }
                                if (emailtocc[dbticket["Category_Name"]][0]["cc"] !== "") {
                                    cc += dbticket["RM_Email_Id"] !== "" ? "," + dbticket["RM_Email_Id"] : '' + emailtocc[dbticket["Category_Name"]][0]["cc"];
                                }
                            }
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
                            res.json({ 'Status': "Success", 'Ticket_Id': Ticket_id, 'CRN': dbticket["CRN"], 'Category': dbticket["Category"], 'SubCategory': dbticket["SubCategory"], 'Msg': 'Ticket is created.', 'Created_On': moment(dbticket["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(dbticket["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Product_name': product_name, 'Insurer_name': Insurer_Name });
                        } else {
                            res.json({ 'Status': "Success", 'Ticket_Id': Ticket_id, 'CRN': dbticket["CRN"], 'Category': dbticket["Category"], 'SubCategory': dbticket["SubCategory"], 'Msg': 'Ticket is updated.', 'Created_On': moment(dbticket["Created_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(dbticket["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Product_name': product_name, 'Insurer_name': Insurer_Name });
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
router.get('/tickets/getticketingSubCategory/:category/:product_id', function (req, res) {
    try {

        var obj = [];
        var category_id = req.params['category'] - 0;
        var productid = parseInt(req.params['product_id']);
        var cache_key = 'live_tickets_getticketingSubCategory_' + category_id + '_' + productid;
        var arr = {};
        if (productid !== null && productid !== "" && productid !== 0) {
            arr = {
                "Category_Id": category_id,
                "Product_Id": { $in: [productid] }
            };
        } else {
            arr = {
                "Category_Id": category_id
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
                            product: dbsubCategory[i]['Product_Id']
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
            arr["Product_Id"] = { $in: [productid] };
        }
        if (source !== null && source !== "" && source !== undefined) {
            arr["Display_Source"] = { $in: [source] };
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
router.post('/get_lms_data_list', function (req, res) {
    try {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: 'Product_name Sub_product_name Customer_name Mobile_no Created_On',
            sort: { 'Created_On': 1 },
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
        res.json({ "Msg": "error" });
    }
});
router.post('/lms_lead_save', function (req, res) {
    try {
        var lms_data = require('../models/lms_data');
        var objRequest = req.body;
        var Lead_Id = objRequest['Lead_Id'];
        if (Lead_Id !== null && Lead_Id !== "" && Lead_Id !== undefined) {
            lms_data.update({ 'Lead_Id': Lead_Id }, objRequest, function (err, numaffected) {
                res.json({ "Msg": "Lead Updated Successfully.", "Status": "Success" });
            });
        } else {
            var lms_dataobj = new lms_data(objRequest);
            lms_dataobj.save(function (err) {
                res.json({ "Msg": "Lead Created Successfully.", "Status": "Success" });
            });
        }
    } catch (e) {
        console.log(e);
        res.json({ "Msg": e, "Status": "Fail" });
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
        lms_sub_product_type.find({ lm_product_id: parseInt(req.params.product_type) }, function (err, dbSubProductData) {
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
            sort: { 'Created_On': 1 },
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
        res.json({ "Msg": e });
    }
});
router.get('/lms_forms_master/:product_type/:sub_product_type', function (req, res) {
    try {
        var product_id = parseInt(req.params['product_type']);
        var subproduct_id = parseInt(req.params['sub_product_type']);
        var Conditions = { "lms_product_id": { $in: [0, product_id] }, "lms_sub_product_id": { $in: [0, subproduct_id] } };
        var resultArray = {
            "basic": null
            , "full": null
            , "global": null
        };
        var basicmaster = [];
        var fullmaster = [];
        var globalmaster = [];
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            var lms_forms_master = db.collection('lms_forms_master').find(Conditions, { _id: 0 });
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
        res.json({ "Msg": e });
    }
});
router.get('/get_lms_lead_data/:lead_id', function (req, res) {
    try {
        var Lead_Id = req.params['lead_id'];
        var Condition = {};
        if (Lead_Id !== null || Lead_Id !== "") {
            Condition = { "Lead_Id": Lead_Id };
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
        res.json({ "Msg": e });
    }
});

router.post('/admin_inspection_list', LoadSession, function (req, res) {
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

router.post('/compare_quotes_pdf', function (req, res) {
    var objRequest = req.body;

    var fileshare = appRoot + "/resource/request_file/compare_quote.html";
    var formatted = moment(new Date()).format('DD-MM-YYYYh:mm:ss');
    var datetime = formatted.replace(/-/g, "");
    datetime = datetime.replace(/:/g, "");
    const now = new Date();
    var quotedate = moment(new Date()).format('YYYY-MM-DD');
    var pdf_file_path_policy = appRoot + '/tmp/' + objRequest.CRN + '.pdf';
    var sharePdfLink = config.environment.weburl + '/tmp/' + objRequest.CRN + '.pdf';
    var HTML_pdf_file_path_policy = appRoot + '/tmp/' + objRequest.CRN + '.html';
    //var html = fs.readFileSync('./resource/request_file/Finmart/TW_Web/Quote_Share.html', 'utf8');     //local path
    var html = fs.readFileSync(fileshare, 'utf8');
    var options = { format: 'Letter' };
    var share_div = "";
    var insurer_list = objRequest.insurer_list;

    //        var addondiv ='
    //                <div class="fieldv">
    //      <span >___addon_name___</span>
    //     <span>₹ ___addon_value___</span>
    //    </div>//


});

router.post('/ticket/getticketList', LoadSession, function (req, res) {
    try {

        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: 'Ticket_code channel subchannel Category SubCategory Product CRN Status From Created_By Created_On Modified_On Agent_Email_Id Remark Source',
            sort: { 'Modified_On': -1 },
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
        } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
            let arr_ch_ssid = [];
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
            let arr_ssid = [];
            if (req.obj_session.hasOwnProperty('users_assigned')) {
                var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                arr_ssid = combine_arr.split(',').filter(Number).map(Number);

            }
            arr_ssid.push(req.obj_session.user.ss_id);
            //filter['ss_id'] = {$in: arr_ssid};
            filter['$or'] = [
                { 'lead_assigned_ssid': { $in: arr_ssid } },
                { 'ss_id': { $in: arr_ssid } }
            ];
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
                filter = {};
                //filter["CRN"] = parseInt(objRequest["search_byvalue"]);
                filter = { "$or": [{ "CRN": (objRequest["search_byvalue"]).toString() }, { "CRN": parseInt(objRequest["search_byvalue"]) }] };
            } else if (objRequest["search_by"] === "Source") {
                filter = {};
                //filter["CRN"] = parseInt(objRequest["search_byvalue"]);
                filter["Source"] = new RegExp(objRequest["search_byvalue"], 'i');
            } else {
                if (roleType === "tickets") {
                    /* filter = {"ss_id": ss_id,
                     "Created_On": {$gte: dateFrom, $lt: dateTo}
                     };*/
                    //                    filter["Created_On"] = {$gte: dateFrom, $lt: dateTo};
                } else {
                    /* filter = {"Category": {$in: objCategory},
                     "Modified_On": {$gte: dateFrom, $lt: dateTo}
                     };*/
                    filter["Category"] = { $in: objCategory };
                    //filter["Modified_On"] = {$gte: dateFrom, $lt: dateTo};
                }
                if (objRequest["status"] !== "") {
                    filter["Status"] = objRequest["status"];
                }
            }
            mysort = { Modified_On: -1 };
        } else {
            if (roleType === "tickets") {
                /* filter = {"ss_id": ss_id,
                 "Created_On": {$gte: dateFrom, $lt: dateTo}
                 };*/
                filter["Created_On"] = { $gte: dateFrom, $lt: dateTo };
            } else {
                /*filter = {"Category": {$in: objCategory},
                 "Modified_On": {$gte: dateFrom, $lt: dateTo}
                 };*/
                filter["Category"] = { $in: objCategory };
                filter["Modified_On"] = { $gte: dateFrom, $lt: dateTo };
            }
            if (objRequest["status"] !== "") {
                filter["Status"] = objRequest["status"];
            }
        }
        console.log(filter);
        var user_details = require('../models/user_details');
        if (objRequest.hasOwnProperty('source')) {
            if (objRequest.source === "PolicyBoss") {
                user_details.find(filter).exec(function (err, dbtickets) {
                    res.json(dbtickets);
                });
            }
        } else {
            user_details.paginate(filter, optionPaginate).then(function (dbTicket) {
                res.json(dbTicket);
            });
        }

    } catch (err) {
        console.log(err.stack);
        return res.send({ 'msg': 'error' });
    }
});
router.post('/wallets/getAccountDetails', function (req, res) {
    try {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: 'agent_name Merchant_Id bank_account_no ifsc wallet_amount SS_ID FBA_ID Channel',
            sort: { 'Created_On': -1 },
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
        res.json({ 'msg': 'error' });
    }
});
router.post('/wallets/getTransactionDetails', function (req, res) {
    try {
        var objRequest = req.body;
        var filter = {
            "rzp_customer_id": objRequest["rzp_customer_id"]
        };
        if (objRequest["transaction_type"] == "CREDIT") {
            filter['transaction_type'] = { $in: ['CREDIT', 'ADD'] };
        } else {
            filter['transaction_type'] = { $in: ['DEBIT', 'DEDUCT'] };
        }
        console.log(filter);
        var rzp_wallet_history = require('../models/rzp_wallet_history');
        rzp_wallet_history.find(filter, function (err, dblmsData) {
            if (err) {
                throw err;
            } else {
                res.json({ 'msg': 'sucress', "data": dblmsData });
            }
        });
    } catch (err) {
        console.log(err);
        res.json({ 'msg': 'error' });
    }
});
router.post('/disposition/dialer_disposition_status_update', function (req, res) {
    try {
        var ObjRequest = req.body;
        var lead_disposition = require('../models/lead_disposition');
        var disposition_history = require('../models/disposition_history');
        var lead = require('../models/leads');

        lead_disposition.find({ User_Data_Id: ObjRequest["Cust_ID"] }, function (err, dblmsData) {
            if (err) {
                throw err;
            } else {
                if (Object.keys(dblmsData).length > 0) {
                    var Update_arg = {
                        Status: ObjRequest["Disposition"],
                        Sub_Status: ObjRequest["Sub_Disposition"],
                        Modified_On: new Date(),
                        Remark: ObjRequest["Call Remarks"],
                        Customer_Mobile: ObjRequest["mobile_number"],
                        Next_Call_Date: new Date(ObjRequest["Call_Back_Date"]),
                        Dialer_Request_Core: ObjRequest
                    };
                    lead_disposition.update({ 'User_Data_Id': ObjRequest["Cust_ID"] }, { $set: Update_arg }, { multi: false }, function (err, numAffected) {
                        if (err)
                            throw err;
                        res.json({ 'Msg': 'Success' });
                    });
                } else {
                    var arg = {
                        User_Data_Id: ObjRequest["Cust_ID"],
                        Status: ObjRequest["Disposition"],
                        Sub_Status: ObjRequest["Sub_Disposition"],
                        Created_On: new Date(),
                        Modified_On: new Date(),
                        Remark: ObjRequest["Call Remarks"],
                        Is_Latest: 1,
                        Customer_Mobile: ObjRequest["mobile_number"],
                        Next_Call_Date: new Date(ObjRequest["Call_Back_Date"]),
                        Dialer_Request_Core: ObjRequest
                    };
                    var dispositionObj = new lead_disposition(arg);
                    dispositionObj.save(function (err) {
                        console.error(err);
                        if (err)
                            throw err;

                        res.json({ 'Msg': 'Success' });
                    });
                }

                //Lead Update 

                var objLeadData = {
                    'lead_disposition': ObjRequest["Disposition"],
                    'lead_subdisposition': ObjRequest["Sub_Disposition"],
                    'lead_disposition_assigned_on': new Date()
                };
                lead.update({ 'User_Data_Id': ObjRequest["Cust_ID"] }, { $set: objLeadData }, { multi: false }, function (err, numAffected) {
                    if (err)
                        throw err;

                });
            }
        });
        //Lead End

        //Disposition history
        var objDispostion = {
            "UDID": ObjRequest["Cust_ID"],
            "PB_CRN": "",
            "Status": ObjRequest["Disposition"],
            "SubStatus": ObjRequest["Sub_Disposition"],
            "Created_On": new Date(),
            "Modified_On": new Date(),
            "Remark": ObjRequest["Call Remarks"],
            "ss_id": 0,
            "IsLatest": 1,
            "fba_id": 0,
            "User_Data": ObjRequest,
            "File_Name": ""
        };
        var disposition = new disposition_history(objDispostion);
        disposition.save(function (err) {
            console.error(err);
            if (err)
                throw err;

            res.json({ 'Msg': 'Success' });
        });
        //Disposition history End
    } catch (e) {
        console.error(e);
        res.json({ 'Msg': 'Fail', 'Error': e });

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
        res.json({ 'Msg': 'error', 'Status': 'fail' });
    }
});
router.post('/create_campaignPosp', function (req, res) {
    try {
        var ObjRequest = req.body;
        console.log("data = " + ObjRequest);
        var posp_reequipment_campaign = require('../models/posp_reequipment_campaign');
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            if (err)
                throw err;
            var obj = {
                "Campaign_name": ObjRequest.camp_name,
                "Description": ObjRequest.description,
                "Start_date": ObjRequest.start_date,
                "End_date": ObjRequest.end_date,
                "Status": "Active"
            };
            var campaigns_obj = new posp_reequipment_campaign(obj);
            campaigns_obj.save(function (err1) {
                if (err1)
                    res.json({ 'Msg': "Fail to add campaign" });
                else {
                    res.json({ 'Msg': "campaign added" });
                }
            });
        });
    } catch (e) {
        console.error(e);
        res.json({ 'Msg': 'Fail', 'Error': e });

    }
});
router.post('/update_pospEnquiry_data', function (req, res, next) {
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
                    res.json({ 'Status': "error" });
                } else {
                    res.json({ 'Status': "Success" });
                }
            });
        });
    } catch (err) {
        console.log(err);
        res.json({ 'msg': 'error' });
    }
});
router.post('/save_FOS_Data', function (req, res) {
    try {
        var ObjRequest = req.body;
        var fos_registration = require('../models/fos_onboarding');

        fos_registration.find({ ss_id: parseInt(ObjRequest["ss_id"]) }, function (err, dblmsData) {
            if (err) {
                throw err;
            } else {
                if (dblmsData.length > 0) {
                    res.json({ 'Msg': 'ss_id already exist', 'Status': 'error' });
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
                                res.json({ 'Msg': 'Data not added', 'Status': 'error' });
                            } else {
                                res.json({ 'Msg': 'Data Added Successfully', 'Status': 'Success' });
                            }
                        });
                    });
                }
            }
        });
    } catch (e) {
        console.error(e);
        res.json({ 'Msg': 'Fail', 'Error': e });
    }
});
router.post('/updateFOSStatus', function (req, res) {
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
        fos_registration.update({ ss_id: parseInt(ObjRequest["ss_id"]) }, { $set: obj }, function (err, dblmsData) {
            if (err) {
                res.json({ 'Msg': 'Fail to Update status', 'Status': 'error' });
            } else {
                res.json({ 'Msg': 'Status Updated', 'Status': 'success' });
            }
        });
    } catch (e) {
        console.error(e);
        res.json({ 'Msg': 'Fail', 'Error': e });
    }
});
router.post('/chola_pdf_initiate_service', LoadSession, function (req, res, next) {
    try {
        var Client = require('node-rest-client').Client;
        var client = new Client();
        var service_method_urlT = '';
        var Token = "";
        let obj_cred = {
            'grant_type': 'password',
            'username': "ptrn_lanmarkP",
            'password': "pt1L@Nm#krn"
        };
        var argsT = {
            data: obj_cred,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            }
        };
        argsT.headers.Authorization = 'Basic ' + new Buffer("OeShRu4AJFl0l1hB0wMMGd0s274a" + ':' + "vSksOzpnmbx28s5lKiMuRdCBtL8a").toString('base64');
        service_method_urlT = 'https://services.cholainsurance.com/endpoint/token';

        client.post(service_method_urlT, argsT, function (dataT) {
            console.log(dataT);
            Token = dataT["access_token"];
            var ObjRequest = req.body;
            var qs_url = ObjRequest.policy_url;
            /*
            const fetch = require('node-fetch');
            var myHeaders1 = new fetch.Headers();
            myHeaders1.append("Authorization", "Bearer " + Token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders1,
                redirect: 'follow'
            };
            var pdf_response, pdf_error, pdf_success;
            fetch(qs_url, requestOptions)
                .then(response => response.text())
                .then(result => pdf_success = result)
                .catch(error => pdf_error = error);
            sleep(2000);
             
            if (pdf_success === null || pdf_success === "" || pdf_success === undefined) {
                pdf_response = pdf_error;
            } else {
                pdf_response = pdf_success;
            }
            console.log(pdf_response);
            res.send(pdf_response);
             */

            var request = require('request');
            var PDFoptions = {
                'method': 'GET',
                'url': qs_url,
                'headers': {
                    "Authorization": "Bearer " + Token
                }
            };

            var pdf_response;
            request(PDFoptions, function (pdf_error, pdf_success) {
                if (pdf_error)
                    throw new Error(pdf_error);
                console.log(pdf_success.body);
                // pdf_success = JSON.parse(pdf_success.body)
                if (pdf_success === null || pdf_success === "" || pdf_success === undefined) {
                    pdf_response = pdf_error;
                } else {
                    if (typeof pdf_success.body === "object") {
                        pdf_response = JSON.stringify(pdf_success.body);
                    } else {
                        pdf_response = pdf_success.body;
                    }
                }
                res.send(pdf_response);
        });
        });
        sleep(1000);
    } catch (e) {
        console.error(e);
        res.json({'Msg': e.stack, 'Status': 'fail'});
    }
});
router.post('/finmart_raiseticket', function (req, res) {
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
                                    {
                                        "$group": {
                                            "_id": "$Ticket_Id",
                                            "docId": { "$last": "$_id" },
                                            "Ticket_Id": { "$last": "$Ticket_Id" },
                                            "Category": { "$last": "$Category" },
                                            "SubCategory": { "$last": "$SubCategory" },
                                            "From": { "$last": "$From" },
                                            "To": { "$last": "$To" },
                                            "Status": { "$last": "$Status" },
                                            "Created_by": { "$last": "$Created_by" },
                                            "Created_On": { "$last": "$Created_On" },
                                            "Modified_On": { "$last": "$Modified_On" },
                                            "CRN": { "$last": "$CRN" },
                                            "Mobile_No": { "$last": "$Mobile_No" },
                                            "Vehicle_No": { "$last": "$Vehicle_No" },
                                            "Remark": { "$last": "$Remark" },
                                            "ss_id": { "$last": "$ss_id" },
                                            "SubCategory_level2": { "$last": "$SubCategory_level2" },
                                            "Product": { "$last": "$Product" }
                                        }
                                    },
                                    // Then sort
                                    { "$sort": { "Created_On": -1 } }

                                ];
                                console.log(agg);
                                //tickets.aggregate(agg, function (err1, dbTicket1) {
                                if (err1) {
                                    throw err1;
                                } else {
                                    tickets.find({ "CRN": objRequest.CRN, "Category": objRequest.Category }).toArray(function (err, crn_cat_exist) {
                                        if ((crn_cat_exist.length === 0 && objRequest.CRN !== "") || (crn_cat_exist.length > 0 && objRequest.CRN === "")) {
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
                                            tickets.findOne({ "Ticket_Id": Ticket_id }, { sort: { "Modified_On": -1 } }, function (err, dbticket) {
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
                                                    CRN: dbticket !== null ? dbticket["CRN"] : objRequest["CRN"],
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
                                                    Agent_Email_Id: Is_Customer === true ? objRequest["Agent_Email"] : agentdetails.Email_Id,
                                                    Transaction_On: dbticket !== null ? dbticket['Transaction_On'] : objRequest["Transaction_On"],
                                                    Source: objRequest["Source"],
                                                    RM_Email_Id: dbticket !== null ? dbticket["RM_Email_Id"] : objRequest["rm_email_id"],
                                                    Agent_Name: dbticket !== null ? dbticket["Agent_Name"] : objRequest["Agent_Name"],
                                                    Pincode: dbticket !== null ? dbticket["Pincode"] : objRequest["Pincode"] - 0,
                                                    Insurer_Id: dbticket !== null ? dbticket["insurer_id"] : objRequest["Insurer_Id"] !== "" ? parseInt(objRequest["Insurer_Id"]) : ""
                                                };

                                                if (dbticket !== null) {
                                                    updateobjRequest = dbticket;
                                                    var objticket = {};
                                                    objticket['IsActive'] = 0;

                                                    tickets.updateMany({ 'Ticket_Id': NewTicket_Id }, { $set: { "IsActive": 0 } }, function (err, numAffected) {
                                                        if (err) {
                                                            res.json({ Msg: 'Ticket_Not_Saved', Details: err });
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
                                                                    Product: objRequest["Product"],
                                                                    Category: objRequest["Category"],
                                                                    Status: objRequest["Status"],
                                                                    Created_By: Is_Customer === true ? objRequest["Agent_Name"] : agentdetails.Emp_Name + ' (' + agentdetails.UID + ') ',
                                                                    Created_On: objRequest["Created_On"] === "" ? todayDate : objRequest["Created_On"],
                                                                    Modified_By: agentdetails.Emp_Id - 0,
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
                                                                    Agent_Name: objRequest["Agent_Name"],
                                                                    Pincode: objRequest["Pincode"] - 0,
                                                                    Transaction_On: objRequest["Transaction_On"],
                                                                    Insurer_Id: objRequest["Insurer_Id"],
                                                                    Agent_Email_Id: Is_Customer === true ? objRequest["Agent_Email"] : agentdetails.Email_Id
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
                                                            user_details.update({ 'Ticket_code': NewTicket_Id }, { $set: objticket }, function (err, numAffected) {
                                                                console.log('user_detailsUpdate', err, numAffected);
                                                            });
                                                        }
                                                        //user_details end
                                                        //mg  
                                                        if (objRequest['fileupload_flag'] === 'Multiple') {
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
                                                            var objdata = { 'UploadFiles': objfile };
                                                            console.log("objdata : ", objdata);
                                                            tickets.findAndModify({ 'Ticket_Id': NewTicket_Id }, [["Modified_On", -1]], { $set: objdata }, {}, function (err, numAffected) {
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
                                                                var objdata = { 'UploadFiles': objfile };

                                                                tickets.findAndModify({ 'Ticket_Id': NewTicket_Id }, [["Modified_On", -1]], { $set: objdata }, {}, function (err, numAffected) {
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

                                                        if (agentdetails.Email_Id !== null && agentdetails.Email_Id !== undefined) {
                                                            to = agentdetails.Email_Id;
                                                        } else if (Is_Customer) {
                                                            to = objRequest["Agent_Email"];
                                                        }

                                                        if (emailtocc.hasOwnProperty(objRequest["Category_Name"])) {
                                                            if (objRequest["Category_Name"] === "Product Input Page") {
                                                                if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"] !== "") {
                                                                    to += "," + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["to"];
                                                                }
                                                                if (emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"] !== "") {
                                                                    cc += rm_emailid !== "" ? "," + rm_emailid : '' + emailtocc[objRequest["Category_Name"]][objRequest["SubCategory"]][0]["cc"];
                                                                }
                                                            } else {

                                                                if (emailtocc[objRequest["Category_Name"]][0]["to"] !== "") {
                                                                    to += "," + emailtocc[objRequest["Category_Name"]][0]["to"];
                                                                }
                                                                if (emailtocc[objRequest["Category_Name"]][0]["cc"] !== "") {
                                                                    cc += rm_emailid !== "" ? "," + rm_emailid : '' + emailtocc[objRequest["Category_Name"]][0]["cc"];
                                                                }
                                                            }
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
                                                            // objModelEmail.send('noreply@policyboss.com', to, subject, mail_content, cc, config.environment.notification_email, crn);

                                                        }
                                                        if (Ticket_id === "") {
                                                            res.json({ 'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': objRequest["CRN"], 'Category': objRequest["Category"], 'SubCategory': objRequest["SubCategory"], 'Msg': 'Ticket is created.', 'Created_On': moment(todayDate).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(objRequest["Transaction_On"]).format("YYYY-MM-DD HH:mm:ss"), 'Insurer_Name': Insurer_Name, "Product_Name": objRequest["Product"] });
                                                        } else {
                                                            res.json({ 'Status': "Success", 'Ticket_Id': NewTicket_Id, 'CRN': crn, 'Category': category, 'SubCategory': subcategory, 'Msg': 'Ticket is updated.', 'Created_On': moment(Created_On).format("YYYY-MM-DD HH:mm:ss"), 'Transaction_On': moment(Transaction_On).format("YYYY-MM-DD HH:mm:ss"), 'Insurer_Name': Insurer_Name, "Product_Name": objRequest["Product"] });
                                                        }


                                                    } else {
                                                        res.json({ 'Status': "Fail", 'Msg': "No Ticket raised" });
                                                    }
                                                    //console.log(res);
                                                });
                                            });
                                        } else {
                                            res.json({ 'Status': "exist", 'Msg': 'Ticket for this CRN under this category is already created' });
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        res.json({ 'Status': "Fail", 'Msg': "Ss Id is 0" });
                    }
                });
            } else {
                res.json({ 'Status': "Fail", 'Msg': "" });
            }
        });
    } catch (err) {
        return res.send(err.stack);
    }
});
//service taken from posps controller
router.post('/posps', function (req, res) {
    var Posp = require('../models/posp');
    var objBase = new Base();
    var obj_pagination = objBase.jqdt_paginate_process(req.body);

    var optionPaginate = {
        select: '',
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
    console.error('Filter', req.body);
    if (req.body['search']['value'] !== '') {
        if (isNaN(req.body['search[value]'])) {
            filter = {
                $or: [
                    { 'Request_Unique_Id': new RegExp(req.body['search[value]'], 'i') },
                    { 'Posp_Unique_Id': new RegExp(req.body['search[value]'], 'i') },
                    { 'Method_Type': new RegExp(req.body['search[value]'], 'i') },
                    { 'Error_Code': new RegExp(req.body['search[value]'], 'i') }
                ]
            };
        } else {
            filter = { 'Product_Id': parseInt(req.body['Product_Id']) };
        }
    } else {
        filter = { 'Is_Active': true };
        if (req.body['page_action'] === 'ch_posp_list') {
            let obj_posp_channel_to_source = swap(config.channel.Const_POSP_Channel);
            filter['Sources'] = obj_posp_channel_to_source[req.obj_session.user.role_detail.channel];
        }
        if (req.body['page_action'] === 'posp_list') {
            //filter['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.POSP};
        }
        if (typeof req.body['Col_Name'] == 'string' && req.body['Col_Name'] !== '' && req.body['txtCol_Val'] !== '') {
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
                filter['Last_Status'] = { $in: arr_last_status };
            }
        }
    }


    Posp.paginate(filter, optionPaginate).then(function (posps) {
        console.log(obj_pagination.filter, optionPaginate, posps);
        res.json(posps);
    });
});

router.post('/lazy_pay_log/check_eligibility', function (req, res) {
    try {
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
        args = {
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
                res.json({ 'Response': data });
            }
        });
    } catch (err) {
        console.log(err);
        res.json({ 'Response': err.stack });
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
                    var ud_cond = { 'User_Data_Id': req.body.User_Data_Id };
                    User_Data.findOne(ud_cond, function (err, dbUserData) {
                        if (err) {

                        } else {
                            if (dbUserData) {
                                User_Data.update({ 'User_Data_Id': dbUserData['User_Data_Id'] }, { $set: { "Preferred_Plan_Data": Preferred_Data } }, function (err, numAffected) {
                                    console.log('UserDataPolicyDataUpdate', err, numAffected);
                                    res.json({ 'Msg': 'SUCCESS' });
                                });
                            } else {
                                res.json({ 'Msg': 'Udid_Not_Found' });
                            }
                        }
                    });
                } else {
                    res.json({ 'Msg': 'Not Authorized' });
                }
            }
        });
    } catch (e) {
        console.error('erp_health_journey', 'exception', e);
    }
});

router.post('/standalone_payments/customer_data', function (req, res) {
    try {
        var standalon_payment = require('../models/standalone_payment');
        let objReq = req.body;
        if (objReq && objReq.vehicle_reg_no) {
            standalon_payment.findOne({ 'vehicle_reg_no': objReq.vehicle_reg_no, 'status': 'Success' }, function (err, objDbData) {
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
                                var merchant_id = ((config.environment.name === 'Production') ? ((spData.insurer_id && spData.insurer_id == 17) ? '6867635' : '6756734') : '4825050');//SBI-6867635//Edelweiss-6756734
                                var amount = (((config.environment.testing_ssid).indexOf(parseInt(spData.QData.ss_id)) > -1) ? '2' : spData.premium_amount);//spData.premium_amount;
                                var productinfo = { paymentParts: [{ name: 'splitId1', merchantId: merchant_id, value: amount, commission: '0.00', description: 'splitId1 summary' }] };
                                var hashSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10';
                                var str = hashSequence.split('|');
                                var txnid = spData.vehicle_reg_no;
                                var hash_string = '';
                                for (var hash_var in str) {
                                    if (str[hash_var] === "key") {
                                        hash_string = hash_string + merchant_key;
                                        hash_string = hash_string + '|';
                                    } else if (str[hash_var] === "txnid") {
                                        hash_string = hash_string + txnid;
                                        hash_string = hash_string + '|';
                                    } else if (str[hash_var] === "amount") {
                                        hash_string = hash_string + amount;
                                        hash_string = hash_string + '|';
                                    } else if (str[hash_var] === "productinfo") {
                                        hash_string = hash_string + JSON.stringify(productinfo);
                                        hash_string = hash_string + '|';
                                    } else if (str[hash_var] === "firstname") {
                                        hash_string = hash_string + spData.name;
                                        hash_string = hash_string + '|';
                                    } else if (str[hash_var] === "email") {
                                        hash_string = hash_string + spData.email;
                                        hash_string = hash_string + '|';
                                    } else {
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
                                standalon_payment.update({ 'vehicle_reg_no': txnid, 'standalone_payment_id': spData.standalone_payment_id }, { $set: { 'pg_data': Payment } }, { multi: false }, function (err, numAffected) {

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
        standalon_payment.findOne({ 'vehicle_reg_no': reg_no, 'standalone_payment_id': pg_id }, function (err, dataSP) {
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
                    standalon_payment.update({ 'vehicle_reg_no': reg_no, 'standalone_payment_id': pg_id }, { $set: { 'pg_get': objRequset.pg_get, 'pg_post': objRequset.pg_post, 'status': status, Horizon_Status: pg_status } }, { multi: false }, function (err, numAffected) {
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
            standalon_payment.update({ 'vehicle_reg_no': reg_no, 'standalone_payment_id': pg_id }, { $set: req.body }, { multi: false }, function (err, numAffected) {
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
                score_master.find({}, { _id: 0 }).toArray(function (err, scoreMaster) {
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
                res.json({ "Insurer_Id": insurer_id, "Plan_Id": plan_id, "Final_Advisory": final_advisory, "Is_Existing": is_existing, "Benefits": planBenefits });
            } else {
                res.json({ "Msg": "Not found" });
            }
        });
    } catch (ex) {
        console.error('Exception in Filter Advisory Score-', ex);
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
                Session.findOne({ "_id": objRequestCore['session_id'] }, function (err, dbSession) {
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
                            return res.status(401).json({ 'Msg': 'Session Expired.Not Authorized' });
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
    return Object.keys(json).map(function (key) {
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
                Session.findOne({ "_id": objRequestCore['session_id'] }, function (err, dbSession) {
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
                            return res.status(401).json({ 'Msg': 'Session Expired.Not Authorized' });
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
        if (fs.existsSync(path + Corporate_Lead_Id)) {
        } else {
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
function movefilelocation(objfiles, NewTicket_Id, doc_prefix) {
    var objfile = {
        "file_1": null,
        "file_2": null,
        "file_3": null,
        "file_4": null
    };
    var objdata = { 'UploadFiles': objfile };

    for (var i in objfiles) {
        if (i === "0") {
            doc_prefix = doc_prefix !== "" && doc_prefix !== undefined ? doc_prefix + "_" : "";
        }
        var source = objfiles[i]['path'];
        var DocName = objfiles[i]['originalFilename'].split('.')[0];
        var extension = source.split(".");
        console.error("source  " + source);
        console.error("DocName  " + DocName);
        var pdf_web_path_horizon = config.environment.downloadurl + "/tmp/ticketing/" + NewTicket_Id + '/' + doc_prefix + DocName + "." + extension[extension.length - 1];
        console.error("pdf_web_path_horizon  " + pdf_web_path_horizon);
        move(source, NewTicket_Id, DocName, doc_prefix, function (err) {

        });
        var a = parseInt(i) + 1;
        objdata.UploadFiles["file_" + a] = pdf_web_path_horizon;
    }

    console.log(objdata);
    var tickets = require('../models/ticket');
    tickets.update({ 'Ticket_Id': NewTicket_Id }, { $set: { "UploadFiles": objdata['UploadFiles'] } }, function (err, numAffected) {
        console.log('TicketUpdated', err, numAffected);
        if (err) {
            objdata['Msg'] = err;
        } else {
            objdata['Msg'] = numAffected;
        }
    });

}
function move(oldPath, ticketid, newname, doc_prefix, cb) {
    ensureExists(store_path + "/" + ticketid, 0777, function (err) {
        if (err) // handle folder creation error
            cb(err);
        else // we're all good
        {
            console.error("oldPath " + oldPath)
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
        for (var k in objSwitchUserType[i]) {
            if (objSwitchUserType[i][k] === channel) {
                channel_key = i;
            }
        }

    }
    return channel_key;

}

function getNewName(oldPath, newname, ticketid, doc_prefix, cb) {
    var extension = oldPath.split(".");
    var filename = newname + '.' + extension[extension.length - 1];
    var newFilePath = store_path + "/" + ticketid + '/' + doc_prefix + filename;
    console.error("newFilePath " + newFilePath);
    cb(newFilePath);
}

function objectToHtml(objSummary) {
    var msg = '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Corp Lead</span><table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow: 1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  >';
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
router.post('/posp_callback', function (req, res) {
    try {
        var posp_callback = require('../models/posp_callback');
        posp_callback.find({ "Posp_Enquiry_Id": req.body.posp_enquiry_id }, function (err, data) {
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
                    posp_callback.update({ 'Posp_Enquiry_Id': req.body.posp_enquiry_id - 0 }, { $set: objFresh_Quote }, function (err, numAffected) {
                        console.log('msg - ' + numAffected);
                        res.json({ 'Msg': "Data Updated Successfully", 'Status': "Success" });
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
                            res.json({ 'Msg': err1, 'Status': "Error" });
                        } else {
                            res.json({ 'Msg': "Data Inserted Successfully", 'Status': "Success" });
                        }
                    });
                }

                var subject = "POSP Sheduled call back";
                var mail_content = '<html><body><p>Dear Team,</p><BR/><p>Please find the sheduled call back details for posp enquiry.</p>'
                    + '<p>Name - ' + req.body.name + '<br>Mobile - ' + req.body.mobile + '<br>Callback Time - ' + req.body.call_time + '<br>Remarks - ' + req.body.remark + '</p></body></html>';
                var Email = require('../models/email');
                var objModelEmail = new Email();
                if (config.environment.name === 'Production') {
                    var arrTo = ['anuj.singh@policyboss.com'];
                    var arrCc = ['ashish.hatia@policyboss.com'];
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
        res.json({ 'Msg': e.stack, 'Status': "Error" });
    }
});
router.post('/app_visitor/save_data', function (req, res) {
    let AppVisitors = require('../models/app_visitor');
    req.body.Created_On = new Date();
    req.body.Modified_On = new Date();
    let AppVisitors_data = new AppVisitors(req.body);
    AppVisitors_data.save(function (err, objDB) {
        if (err) {
            res.json({ 'Msg': err, 'Status': "Error" });
        } else {
            res.json({
                'Msg': "Data Inserted Successfully",
                'Status': "Success",
                "visitor_Id": objDB._doc.visitor_Id
            });
        }
    });
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
        AppVisitors.update(cond, { $set: objData }, function (err, numAffected) {
            if (err) {
                res.json({ 'Status': 'Fail', 'Msg': 'Error In Updation for Remove' + err });
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
router.post('/save_content_data', function (req, res) {
    try{
    var obj = {
        "Title": req.body['title'],
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
    var version_val = moment(current_date).format('DDMMYYYYkkmmss'); //ddmmyyyyhhmmss
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
    if (objData['Type'] === 'BLOG') {
            var blog_detail_file_path = appRoot + "/tmp/blog/blog-detail.html";
            var htmlBlogDetail = fs.readFileSync(blog_detail_file_path, 'utf8');
            var replaceBlogJsondata = {
                '___title___': objData.Title,
                '___category___': (objData.Category).toUpperCase().replaceAll("-"," "),
                '___blog_date___': moment(objData.Blog_Date).format('ll'),
                '___content___': objData.Content
            };
            objData.Content = htmlBlogDetail.toString().replaceJson(replaceBlogJsondata);
        }
    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
        if (err)
            throw err;
        var content_management = db.collection('content_managements');
        autoIncrement.getNextSequence(db, 'content_managements', function (err1, autoIndex) {
            if (err1)
                throw err;
            if (save_type === "save") {
                objData.Content_Id = autoIndex;
                content_management.insertOne(objData, function (err, data1) {
                    if (err) {
                        res.json({ 'Msg': 'Error in data save', Status: 'Fail' });
                    } else {
                        if (objData['Type'] === 'BLOG') {
                                let local_path = appRoot + "/tmp/" + "cms_urls.json";
                                if (fs.existsSync(local_path)) {
                                    fs.readFile(local_path, function (err, data) {
                                        if (err) {
                                            console.error('Exception while reading routes.json file');
                                        } else {
                                            try {
                                                let ob = JSON.parse(data.toString());
                                                //let url = "/" + objData['URL'];
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
                        content_management.update({ 'Status': 'Publish', 'URL': req.body['URL'] }, { $set: objFinal }, function (err, numAffected) {
                            if (err) {
                                res.json({ 'Msg': 'Error' });
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
                                        content_management.update(Newobj, { $set: objpublish }, function (err, numAffected) {
                                            if (err) {
                                                res.json({ 'Msg': 'Data not found, Please save data first' });
                                            } else {
                                                res.json({ 'Msg': 'Data Publish Succesfully !!!' });
                                            }
                                        });
                                    } else {
                                        res.json({ 'Msg': 'Error' });
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
                                content_management.update(Newobj, { $set: objpublish }, function (err, numAffected) {
                                    if (err) {
                                        res.json({ 'Msg': 'Data not found, Please save data first' });
                                    } else {
                                        res.json({ 'Msg': 'Data Publish Succesfully !!!' });
                                    }
                                });
                            } else {
                                res.json({ 'Msg': 'Data not found, Please save data first' });
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
                            content_management.update(findobj, { $set: objedit }, function (err, numAffected) {
                                if (err) {
                                    res.json({ 'Msg': 'Data Not Saved, Please Update Data Again' });
                                } else {
                                    res.json({ 'Msg': 'Data Saved Succesfully!!!', Status: 'Success' });
                                }
                            });
                        } else {
                            res.json({ 'Msg': 'Data Not Found' });
                        }
                    });
                } else {
                    content_management.insertOne(objData, function (err, data1) {
                        if (err) {
                            res.json({ 'Msg': 'Error in data save', Status: 'Fail' });
                        } else {
                            res.json({ 'Msg': 'Data Saved Succesfully!!!', Status: 'Success' });
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
                        content_management.update(editObj, { $set: objeditFinal }, function (err, numAffected) {
                            if (err) {
                                res.json({ 'Msg': 'Data not found, Please save data first' });
                            } else {
                                var obj = {
                                    "URL": req.body['URL'],
                                    "Title": req.body['title'],
                                    "Keywords": req.body['Keywords'],
                                    "Description": req.body['Description'],
                                    //"Content_Id" : parseInt(req.body['ContentId'])
                                    "Status": { $ne: "Archived" }
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
                                        content_management.update(updateNew, { $set: objpublish }, function (err, numAffected) {
                                            if (err) {
                                                res.json({ 'Msg': 'Data not found, Please save data first' });
                                            } else {
                                                res.json({ 'Msg': 'Data Publish Succesfully !!!' });
                                            }
                                        });
                                    } else {
                                        res.json({ 'Msg': 'Error' });
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
                                content_management.updateMany(obj, { $set: objArchived }, function (err, numAffected) {
                                    if (err) {
                                        res.json({ 'Msg': 'Data not found, Please save data first' });
                                    } else {
                                        obj['Content_Id'] = parseInt(req.body['ContentId']);
                                        var objpublish = {
                                            "Status": "Publish"
                                        };
                                        content_management.update(obj, { $set: objpublish }, function (err, numAffected) {
                                            if (err) {
                                                res.json({ 'Msg': 'Data not found, Please save data first' });
                                            } else {
                                                res.json({ 'Msg': 'Data Publish Succesfully !!!' });
                                            }
                                        });
                                    }
                                });
                            } else {
                                res.json({ 'Msg': 'Error' });
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
router.post('/getContentDetails', function (req, res) {
    try {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            //select: 'ss_id Draft_Data fba_id Is_Preview Is_Active Final_Data Status',
            sort: { 'Created_On': -1 },
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
        filter = {
            "ss_id": ss_id
        };
        console.log(filter);
        var content_management = require('../models/content_management');
        content_management.paginate(filter, optionPaginate).then(function (dbTicket) {
            res.json(dbTicket);
        });

    } catch (err) {
        console.log(err);
        res.json({ 'msg': 'error' });
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
                var html_file_path = appRoot + "/resource/request_file/CMS/content_management.html"; //for UAT
                var html_pdf_file_path = appRoot + "/resource/request_file/CMS/" + "Content_Management_" + data1[0].ss_id + "_" + data1[0].Content_Id + '.html';
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
                res.send({ html_pdf_file_path });
                //res.redirect(html_pdf_file_path);
            } else {
                res.json({ 'msg': 'Data not found, Please save data first' });
            }
        });
    });
});
router.post('/my_cart_list_1', function (req, res) {
    try {
        var Base = require('../libs/Base');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            sort: { 'Cart_Id': 1 }
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        var objRequest = req.body;
        var ss_id = objRequest["ss_id"] - 0;
        filter['Ss_Id'] = ss_id;
        filter['Payment_Status'] = "PAYMENT_PENDING";
        var add_to_cart = require('../models/add_to_cart');
        add_to_cart.paginate(filter, optionPaginate).then(function (dbCartData) {
            res.json(dbCartData);
        });
    } catch (e) {
        res.json(e);
    }
});
router.post('/inspection/bajaj_inspection_id', function (req, res) {

    let objrequest = req.body;
    try {
        let args = {
            pTransactionId: objrequest['pTransactionId'],
            pRegNoPart1: objrequest['pRegNoPart1'],
            pRegNoPart2: objrequest['pRegNoPart2'],
            pRegNoPart3: objrequest['pRegNoPart3'],
            pRegNoPart4: objrequest['pRegNoPart4'],
            pUserName: objrequest['pUserName'],
            pFlag: objrequest['pFlag'],
            pPinNumber_out: "",
            pPinStatus_out: "",
            pVchlDtlsObj_out: ""
        };

        const callingService = "http://webservicesint.bajajallianz.com:80/WebServicePolicy/WebServicePolicyPort?wsdl";

        let soap = require('soap');
        let xml2js = require('xml2js');
        soap.createClient(callingService, function (err, client) {
            client['pinProcessWs'](args, function (err1, result, raw, soapHeader) {

                if (result) {
                    if (result['pVchlDtlsObj_out']['stringval30'] === "PGNR_ALTD") {
                        var queryObj = {
                            "Product_Id": objrequest['product_id'],
                            "Insurer_Id": 1,
                            "Inspection_Id": result['pPinNumber_out'],
                            "UD_Id": objrequest['UD_Id'],
                            "Insurer_Request": JSON.stringify(objrequest),
                            "Insurer_Response": JSON.stringify(result),
                            "Status": "INSPECTION_SCHEDULED",
                            "Created_On": new Date(),
                            Modified_On: ''


                        };
                        var MongoClient = require('mongodb').MongoClient;
                        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                            if (err)
                                throw err;
                            var inspectionIdGeneration = db.collection('inspection_id_generation');
                            inspectionIdGeneration.insertOne(queryObj, function (err, res) {
                                if (err)
                                    throw err;
                            });
                        });
                    }
                    res.json(result);

                } else {
                    console.log("Error while genrating pin");
                }
            });

        });
    } catch (err) {
        console.log(err);
        res.json(err);
    }

});
router.post('/inspection/bajaj_inspection_id_status', function (req, res) {

    let objrequest = req.body;


    try {
        let args = {
            pRegNoPart1: "",
            pRegNoPart2: "",
            pRegNoPart3: "",
            pRegNoPart4: "",
            pPinList_out: "",
            pErrorMessage_out: "",
            pErrorCode_out: "",

        };
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            if (err)
                throw err;

            var user_datas = db.collection('user_datas');

            user_datas.findOne({ "PB_CRN": objrequest["PB_CRN"], "User_Data_Id": objrequest["User_Data_Id"], "Insurer_Id": objrequest["Insurer_Id"] }, function (err, response) {
                if (err) {
                    throw err;
                } else {
                    args['pRegNoPart1'] = response['Proposal_Request']['registration_no_1'];
                    args['pRegNoPart2'] = response['Proposal_Request']['registration_no_2'];
                    args['pRegNoPart3'] = response['Proposal_Request']['registration_no_3'];
                    args['pRegNoPart4'] = response['Proposal_Request']['registration_no_4'];

                    const callingService = "http://webservicesint.bajajallianz.com:80/WebServicePolicy/WebServicePolicyPort?wsdl";

                    let soap = require('soap');
                    let xml2js = require('xml2js');
                    soap.createClient(callingService, function (err, client) {
                        client['pinStatusWs'](args, function (err1, result, raw, soapHeader) {
                            if (result) {
                                if (result['pPinList_out']['WeoRecStrings10User']['stringval2'] === 'PIN_APPRD') {
                                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                                        if (err)
                                            throw err;

                                        var user_datas = db.collection('user_datas');
                                        var inspection_schedules = db.collection('inspection_schedules');

                                        inspection_schedules.findAndModify({ "PB_CRN": objrequest["PB_CRN"], "UD_Id": objrequest["User_Data_Id"], "Insurer_Id": objrequest["Insurer_Id"] }, [], { $set: { Status: "INSPECTION_APPROVED" } }, {}, function (err, response) {
                                            if (err)
                                                throw err;
                                        });

                                        user_datas.findAndModify({ "PB_CRN": objrequest["PB_CRN"], "User_Data_Id": objrequest["User_Data_Id"], "Insurer_Id": objrequest["Insurer_Id"] }, [], { $set: { "Premium_Request.is_inspection_done": "yes" } }, {}, function (err, response) {
                                            if (err)
                                                throw err;
                                        });
                                    });

                                }

                                res.send(result);

                            } else {
                                console.log("Error while checking pin status");
                            }
                        });

                    });

                }
            });
        });


    } catch (err) {
        console.log(err);
        res.json(err);
    }

});

router.post('/cart_payment', function (req, res) {
    try {
        var Payment = {};
        var merchant_key = ((config.environment.name === 'Production') ? 'o7LxX9fJ' : 'BC50nb');
        var salt = ((config.environment.name === 'Production') ? 'c6ob2Q7Wb4' : 'Bwxo1cPe');
        var merchant_id = ((config.environment.name === 'Production') ? '6756734' : '4825050');
        var amount = ((config.environment.name === 'Production') ? req.body.amount : "2");
        var pay_data = req.body.pay_data;
        let pay_data_string = '';
        for (let i = 0; i <= pay_data.length - 1; i++) {
            pay_data_string += pay_data[i].PB_CRN + "_" + pay_data[i].Proposal_Id + ",";
        }
        pay_data_string = pay_data_string.substring(0, pay_data_string.length - 1);
        console.log(pay_data_string);
        var productinfo = { paymentParts: [{ name: 'splitId1', merchantId: merchant_id, value: amount, commission: '0.00', description: 'splitId1 summary' }] };
        var hashSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10';
        var str = hashSequence.split('|');
        var txnid = Math.floor(Date.now() + Math.random() * 1000000000);
        var hash_string = '';
        for (var hash_var in str) {
            if (str[hash_var] === "key") {
                hash_string = hash_string + merchant_key;
                hash_string = hash_string + '|';
            } else if (str[hash_var] === "txnid") {
                hash_string = hash_string + txnid;
                hash_string = hash_string + '|';
            } else if (str[hash_var] === "amount") {
                hash_string = hash_string + amount;
                hash_string = hash_string + '|';
            } else if (str[hash_var] === "productinfo") {
                hash_string = hash_string + JSON.stringify(productinfo);
                hash_string = hash_string + '|';
            } else if (str[hash_var] === "firstname") {
                hash_string = hash_string + req.body.firstname;
                hash_string = hash_string + '|';
            } else if (str[hash_var] === "email") {
                hash_string = hash_string + req.body.email;
                hash_string = hash_string + '|';
            } else if (str[hash_var] === "udf1") {
                hash_string = hash_string + pay_data_string;
                hash_string = hash_string + '|';
            } else {
                hash_string = hash_string + '';
                hash_string = hash_string + '|';
            }
        }
        hash_string = hash_string + salt;
        console.log(hash_string);
        var crypto = require('crypto');
        var hash = crypto.createHash("sha512").update(hash_string).digest("hex").toLowerCase();
        var pg_data = {
            'firstname': req.body.firstname,
            'lastname': req.body.lastname,
            'surl': ((config.environment.name === 'Production') ? 'http://horizon.policyboss.com' : 'http://qa-horizon.policyboss.com') + '/cart_transaction/' + req.body.ss_id + '/success/' + txnid,
            'phone': req.body.mobile,
            'key': merchant_key,
            'hash': hash,
            'curl': ((config.environment.name === 'Production') ? 'http://horizon.policyboss.com' : 'http://qa-horizon.policyboss.com') + '/cart_transaction/' + req.body.ss_id + '/cancel/' + txnid,
            'furl': ((config.environment.name === 'Production') ? 'http://horizon.policyboss.com' : 'http://qa-horizon.policyboss.com') + '/cart_transaction/' + req.body.ss_id + '/fail/' + txnid,
            'txnid': txnid,
            'productinfo': JSON.stringify(productinfo),
            'amount': amount,
            'email': req.body.email,
            'udf1': pay_data_string,
            'SALT': salt,
            'service_provider': "payu_paisa"
        };
        Payment.pg_data = pg_data;
        Payment.pg_url = ((config.environment.name === 'Production') ? 'https://secure.payu.in/_payment' : 'https://test.payu.in/_payment');
        Payment.pg_redirect_mode = 'POST';
        res.json({
            Status: 'Success',
            Msg: Payment
        });
    } catch (e) {
        res.json(e);
    }
});
function execute_post(url, args) {
    let Client = require('node-rest-client').Client;
    let client = new Client();
    client.post(url, args, function (data, response) {
        console.error('/inspections.js execute_post() : ');
    });
}
router.post('/my_cart_pay', function (req, res) {
    try {
        let objReq = req.body;
        //let data = [];
        let crn = [];
        let proposal_Id = [];
        let data_string = req.body.payment_response.hasOwnProperty('udf1') ? req.body.payment_response.udf1 : "";
        if (data_string !== "") {
            data_string = data_string.split(',');
            data_string.forEach(element => {
                let obj = { 'PB_CRN': (element.split('_')[0] - 0), 'Proposal_Id': (element.split('_')[1] - 0) };
                //data.push(obj);
                crn.push(obj.PB_CRN);
                proposal_Id.push(obj.Proposal_Id);
            });
        }

        let cond = { "Payment_Status": { $in: ["PAYMENT_PENDING"] } };
        cond['Ss_Id'] = (objReq.hasOwnProperty('ss_id')) ? objReq.ss_id - 0 : 0;
        cond['PB_CRN'] = { $in: crn };
        cond['Proposal_Id'] = { $in: proposal_Id };
        console.log("my_cart_pay : cond : ", cond);
        //update Payment_Status to SUCCESS then run verification and pdf
        var add_to_cart = require('../models/add_to_cart');
        add_to_cart.find(cond).exec(function (err1, dbUsers) {
            if (err1) {
                res.send(err1);
            } else {
                try {
                    if (dbUsers.length > 0) {
                        console.error('Log', 'my_cart_pay no. of records fetched', dbUsers.length);
                        let objCSSummary = [];
                        for (let k in dbUsers) {
                            let temp_proposal_id = dbUsers[k]['_doc']['Proposal_Id'];
                            let temp_crn = dbUsers[k]['_doc']['PB_CRN'];
                            let temp_proposal_data = dbUsers[k]['_doc']['Proposal_Request_Core'];

                            let verification_request = {
                                "search_reference_number": temp_proposal_data.search_reference_number,
                                "api_reference_number": temp_proposal_data.api_reference_number,
                                "client_key": temp_proposal_data.client_key,
                                "secret_key": temp_proposal_data.secret_key,
                                "insurer_id": temp_proposal_data.insurer_id,
                                "method_type": "Verification",
                                "crn": temp_crn,
                                "ss_id": ((objReq.hasOwnProperty('ss_id')) ? objReq.ss_id - 0 : 0),
                                "execution_async": "no",
                                "pg_url": "http://qa-horizon.policyboss.com/transaction-status/" + temp_proposal_data.udid + "/" + temp_crn + "/" + temp_proposal_id,
                                "pg_get": {},
                                "pg_post": objReq.payment_response,
                                "pg_redirect_mode": "POST"
                            };
                            let args = {
                                data: verification_request,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            objCSSummary.push(temp_crn);
                            console.error('/postservicecall/my_cart_pay_status - POST calling Request : ', JSON.stringify(args));
                            let url_api = config.environment.weburl + '/postservicecall/my_cart_pay_status';
                            execute_post(url_api, args);
                            sleep(2000);
                        }
                        res.json(objCSSummary);
                    } else {
                        res.json({ '/my_cart_pay ': 'NO DATA AVAILABLE' });
                    }
                } catch (ex) {
                    console.error('Exception in my_cart_pay() for inspectionSchedules db details : ', ex);
                    res.send(ex, dbUsers);
                }
            }
        });
    } catch (e) {
        res.json({ 'Msg': "my_cart_pay - Exception", 'Status': "Failure" });
    }
});
router.post('/my_cart_pay_status', function (req, res) {
    let objInsurerProduct = req.body;
    let Error_Msg = "";
    let service_url = "";
    try {
        if (config.environment.name.toString() === 'Production') {
            service_url = "http://horizon.policyboss.com:5000/quote/verification_initiate";
        } else {
            //          service_url = "http://localhost:3000/quote/verification_initiate";
            service_url = "http://qa-horizon.policyboss.com:3000/quote/verification_initiate";
        }

        let args = {
            data: objInsurerProduct,
            headers: {
                "Content-Type": "application/json"
            }
        };

        let Client = require('node-rest-client').Client;
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        let client = new Client();
        client.post(service_url, args, function (data, response) {
            console.log('Service Response in my_cart_pay_status() : ', JSON.stringify(data));
            if (data) {
                console.error('my_cart_pay_status() /verification_initiate response : ', data);
                try {
                    var verification_status;
                    if (data['Error_Code'] === "") {
                        verification_status = "SUCCESS";
                    } else {
                        verification_status = "FAILURE";
                    }
                    var add_to_cart = require('../models/add_to_cart');
                    let today = new Date();
                    let proposal_id = objInsurerProduct['pg_url'].split('/').pop();
                    let myquery = { PB_CRN: objInsurerProduct['crn'], Ss_Id: objInsurerProduct['ss_id'], Proposal_Id: proposal_id - 0 };
                    let newvalues = { Payment_Status: verification_status, Modified_On: today };
                    add_to_cart.updateOne(myquery, newvalues, function (uperr, upres) {
                        if (uperr) {
                            Error_Msg = uperr;
                            throw uperr;
                        } else {
                            console.log("my_cart_pay_status() Status Updated for : ", objInsurerProduct['insurer_id'], ", CRN : ", objInsurerProduct['crn']);
                            console.log("my_cart_pay_status() : proposal_id : ", proposal_id, upres);
                        }
                    });
                } catch (ex4) {
                    Error_Msg = ex4;
                    console.error('Exception in my_cart_pay_status() for DB updating : ', ex4);
                }
            } else {
                console.error('Error in service my_cart_pay_status() : ', Error_Msg);
            }
        });
    } catch (e) {
        console.error('Exception in my_cart_pay_status() for mailing : ', e);
        res.json({ 'Status': e });
    }
});
router.post('/add_to_cart', function (req, res) {
    try {
        var obj = req.body;
        var ssid = ((isNaN(obj.ss_id)) ? 0 : parseInt(obj.ss_id));
        var Proposal_Request = obj['Summary'];
        var currentDate = new Date();
        var temp_cart_id = 0;
        var obj1 = {
            MyCart_Request: obj,
            Ss_Id: ssid,
            Payment_Status: "PAYMENT_PENDING",
            Service_Log_Unique_Id: Proposal_Request.Service_Log_Unique_Id_Core,
            Request_Unique_Id: Proposal_Request.Request_Unique_Id_Core,
            PB_CRN: ((isNaN(obj['Quote_Request']['crn'])) ? 0 : parseInt(obj['Quote_Request']['crn'])),
            Product_Id: obj['Summary']['Product_Id'],
            Insurer_Id: obj['Summary']['Insurer_Id'],
            Proposal_Id: obj.Proposal_Id,
            User_Data_Id: Proposal_Request.User_Data_Id,
            Created_On: currentDate,
            Modified_On: currentDate
        };

        var current_Insurer_Id = parseInt(obj1.Insurer_Id);
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            var arg = {
                "PB_CRN": parseInt(obj1.PB_CRN),
                "User_Data_Id": parseInt(obj1.User_Data_Id),
                "Insurer_Id": parseInt(obj1.Insurer_Id),
                "Product_Id": parseInt(obj1.Product_Id),
                "Request_Unique_Id": obj1.Request_Unique_Id,
                "Service_Log_Unique_Id": obj1.Service_Log_Unique_Id
            };

            try {
                User_Data.find(arg, function (err, getData) {
                    if (err) {
                        res.json({ Msg: err });
                    } else {
                        let Proposal_Request_Core = null;
                        if (getData.length > 0) {
                            Proposal_Request_Core = getData[0]['_doc']['Proposal_Request_Core'];
                            obj1.Proposal_Request_Core = Proposal_Request_Core;

                            if (err) {
                                console.log(err);
                                res.json({ Msg: err });
                            } else {
                                var add = require('../models/add_to_cart');
                                add.find({ "Ss_Id": ssid, "Insurer_Id": current_Insurer_Id, "Payment_Status": "PAYMENT_PENDING" }, function (err, addresponse) {
                                    if (err) {
                                        res.json(err);
                                    } else {
                                        if (addresponse.length > 0) {
                                            obj1.Cart_Id = addresponse[0]['_doc']['Cart_Id'];
                                            var AddToCart = db.collection('add_to_carts');
                                            AddToCart.insert(obj1, function (err, response) {
                                                if (err) {
                                                    res.json({ Msg: err });
                                                } else if (response.insertedCount !== 0) {
                                                    res.json({ Msg: "Success" });
                                                } else if (response.insertedCount === 0) {
                                                    res.json({ Msg: "Fail" });
                                                }
                                            });
                                        } else {
                                            var mysort = { Cart_Id: -1 };
                                            var add1 = db.collection('add_to_carts');
                                            add1.find({}, { _id: 0, Cart_Id: 1 }).sort(mysort).limit(1).toArray(function (err, result) {
                                                if (err) {
                                                    return res.json({ 'Msg': err });
                                                } else {
                                                    temp_cart_id = (result['length'] > 0) ? (result[0]['Cart_Id'] - 0) : 0;
                                                    temp_cart_id = temp_cart_id + 1;

                                                    var AddToCart = db.collection('add_to_carts');
                                                    obj1.Cart_Id = temp_cart_id;
                                                    AddToCart.insert(obj1, function (err, response) {
                                                        if (err) {
                                                            res.json({ Msg: err });
                                                        } else if (response.insertedCount !== 0) {
                                                            res.json({ Msg: "Success" });
                                                        } else if (response.insertedCount === 0) {
                                                            res.json({ Msg: "Fail" });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        } else {
                            res.json({ Msg: "Failed to Add to Cart" });
                        }
                    }
                });
            } catch (er) {
                console.log("/add_to_cart error2 " + er);
                res.json({ Msg: er });
            }
        });
    } catch (err) {
        console.log("/add_to_cart error1 " + err);
        res.json({ Msg: err });
    }
});
router.post('/remove_from_cart', function (req, res) {
    try {
        let obj = req.body;
        let add_to_cart = require('../models/add_to_cart');
        let cond = { 'Ss_Id': obj['Ss_Id'] - 0, 'PB_CRN': obj['PB_CRN'] - 0, 'Proposal_Id': obj['Proposal_Id'] - 0 };
        //console.log(cond);
        let dataUpdate = { "Payment_Status": "REMOVED" };
        add_to_cart.update(cond, { $set: dataUpdate }, function (err, numAffected) {
            if (err) {
                res.json({ 'Status': 'Fail', 'Msg': 'Error In Updation for Remove' + err });
            } else {
                if (numAffected && numAffected.nModified > 0) {
                    res.json({
                        Status: 'Success',
                        Msg: 'Data Updated Succesfully'
                    });
                } else {
                    res.json({
                        Status: 'Fail',
                        Msg: 'Data Not Updated'
                    });
                }
            }
        });
    } catch (er) {
        console.log("/remove_from_cart " + er);
    }
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
                res.json({ 'Status': 'Error', 'Msg': err.stack });
            } else {
                var arrCc = ['pramod.parit@policyboss.com'];
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

                objModelEmail.send('noreply@landmarkinsurance.co.in', arrTo.join(','), subject, mail_content, arrCc.join(','), '', '', '');
                res.json({ 'Status': 'Success', 'Msg': resdata.Visitor_Number });
            }
        });
    } catch (ex) {
        console.log("error:", ex);
        res.json({ 'Status': 'Error', 'Msg': ex.stack });
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
            "Service_Id": obj["ServiceId"],
            "Category_Type": obj["Category_Type"],
            "Nature_Of_Feedback_Complain": obj["Nature_Of_Feedback_Complain"],
            "Service_Claim_Type": obj["ServiceClaimType"],
            "Created_On": new Date(),
            "Modified_On": new Date()
        };

        var feedback_data = new feedback(args);
        feedback_data.save(function (err, resdata) {
            if (err) {
                res.json({ 'Status': 'Error', 'Msg': err.stack });
            } else {
                var feedId = resdata.FeedId;
                var _ServiceType = args['Nature_Of_Feedback_Complain'] === "ServiceRelated" ? "Service" : "Claim";
                feedback.update({ "FeedId": feedId }, { $set: { 'FeedbackId': "MUM-" + feedId + "-C" } }, function (err, objFeed) {
                    if (err) {
                        res.json({ 'Status': 'Error', 'Msg': err.stack });
                    } else {
                        res.json({ 'Status': 'Success', 'Msg': 'Data saved successfully', 'Feeback_Ref': "MUM-" + feedId + "-C" });
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

                            var arrBcc = ['customercare@policyboss.com', 'headcare@policyboss.com', 'pramod.parit@policyboss.com'];
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

                            var arrBcc = ['customercare@policyboss.com', 'headcare@policyboss.com', 'pramod.parit@policyboss.com'];
                            objModelEmail.send('noreply@landmarkinsurance.co.in', args['Email'], subject, mail_content, '', arrBcc.join(','), '', '');
                        }
                    }
                });
            }
        });
    } catch (ex) {
        res.json({ 'Status': 'Error', 'Msg': ex.stack });
    }
});
router.post('/claim_save_center', function (req, res) {
    try {
        var Email = require('../models/email');
        var objModelEmail = new Email();
        var data = req.body;
        console.log("claim data" + data);
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
                res.json({ 'Status': 'Error', 'Msg': err.stack });
            } else {
                var remark = "LANDMARK INSURANCE";
                var subject = "Claim Assistance Required For Policy Number : " + args['PolicyNumber'];

                var mail_content = '<html><body><p style="color:#fff;font-size:13px;font-family:Verdana;">Dear Claim Manager,<br /></p><BR/>'
                    + 'The following customer has applied for claim assistance through our website on date ' + args['LostDate'] + ':' + ' </br></br>'
                    + '<table><tr><td style =\""font-size:12px;line-height:1.5em;\""><b>Customer Details:</b></td></tr>'
                    + '<tr><td style="color:#DBFE6C;font-size:12px;font-family:Verdana;width:200px;">Customer Name - </td>'
                    + '<td style="color:#F0FF;font-size:14px;font-family:Verdana;">' + args['Customer_Name'] + '</td></tr>'
                    + '<tr><td style="color:#DBFE6C;font-size:12px;font-family:Verdana;width:60px;">Mobile No. - </td>'
                    + '<td style="color:#F0FF;font-size:14px;font-family:Verdana;">' + args['Contact_Mobile'] + '</td></tr>'
                    + '<tr><td style="color:#DBFE6C;font-size:12px;font-family:Verdana;width:60px;">Email  -</td> '
                    + '<td style="color:#F0FF;font-size:14px;font-family:Verdana;">' + args['Email_Id'] + '</td></tr>'
                    + '<tr><td><img src="https://policyboss.com/images/logo_email_quote.gif"><td/><tr/></table><br/><br/>'
                    + '<table><tr><td style =\""font-size:12px;line-height:1.5em;width:200px;\""><b>Claim Assistance  Details:</b></td></tr>'
                    //+ '<br><p style="padding-left:10px;padding-top:8px;font-size:15px;font-weight:bold;"><strong>Claim Assistance  Details:</strong></p>'
                    + '<tr><td style="color:#DBFE6C;font-size:12px;font-family:Verdana;width:150px;">Product ID - </td>'
                    + '<td style="color:#0FFF;font-size:14px;font-family:Verdana;">' + args['Product_name'] + '</td></tr>'
                    + '<tr><td style="color:#DBFE6C;font-size:12px;font-family:Verdana;width:60px;">Insurer Company - </td>'
                    + '<td style="color:#F0FF;font-size:14px;font-family:Verdana;">' + args['Insurer_Company'] + '</td></tr>'
                    + '<tr><td style="color:#DBFE6C;font-size:12px;font-family:Verdana;width:60px;">Policy Number  - </td>'
                    + '<td style="color:#FCFF;font-size:14px;font-family:Verdana;">' + args['PolicyNumber'] + '</td></tr>'
                    + '<tr><td style="color:#DBFE6C;font-size:12px;font-family:Verdana;width:150px;">LOSS Date  - </td>'
                    + '<td style="color:#FF0F;font-size:14px;font-family:Verdana;">' + args['LostDate'] + '<td/><tr/></table><br/>'
                    + '<p style="font-size:14px;padding-left:5px;padding-bottom:5px;font-family:Verdana">'
                    + '<span>BRIEF DETAIL OF LOSS : ' + args['Brief'] + '</span>.<br/>'
                    + '</p></body></html>';

                var arrTo = ['claims.mumbai@policyboss.com'];
                var arrCC = ['Shailendra.tewari@policyboss.com'];
                objModelEmail.send('noreply@landmarkinsurance.co.in ', arrTo.join(','), subject, mail_content, arrCC.join(','), '', '', '');
                res.json({ 'Status': 'Success', 'Msg': 'Data saved successfully' });
            }
        });
    } catch (ex) {
        res.json({ 'Status': 'Error', 'Msg': ex.stack });
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
                res.json({ 'Status': "Success", 'Msg': "emp_data Data inserted" });
            });
        });
    } catch (err) {
        console.log(err);
        res.json({ 'msg': 'error' });
    }
});
router.post('/kyc_details/save_kyc_details', function (req, res) {
    try {
        let ObjRequest = req.body;
        let crn = ObjRequest.crn - 0;
        let insurer_id = ObjRequest.insurer_id - 0;
        let udid = ObjRequest.udid - 0;
        let full_name = "";
        if (ObjRequest.Proposal_Request.contact_name && [4].indexOf(ObjRequest.product_id) > -1) {
            full_name = ObjRequest.Proposal_Request['contact_name'];
        } else {
            full_name = ObjRequest.Proposal_Request['middle_name'] === "" ? (ObjRequest.Proposal_Request['first_name'] + " " + ObjRequest.Proposal_Request['last_name']) : (ObjRequest.Proposal_Request['first_name'] + " " + ObjRequest.Proposal_Request['middle_name'] + " " + ObjRequest.Proposal_Request['last_name']);
        }
        let proposal_request = ObjRequest.hasOwnProperty('Proposal_Request') && ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : {};
        let query = {
            PB_CRN: crn,
            Document_ID: (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
            DOB: (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date,
            Insurer_Id: (req.body.insurer_id === undefined || req.body.insurer_id === "" || req.body.insurer_id === null) ? "" : req.body.insurer_id - 0,
            KYC_Status: { $nin: [null, "", "VERIFY_FAIL", "FETCH_FAIL", "KYC_UPDATE_FAIL", "VERIFY_SUCCESS"] },
            KYC_Number: { $nin: [null, ""] }
        };
        if (ObjRequest.insurer_id === 11) {
            query['Proposal_Id'] = (ObjRequest.Proposal_Id === undefined || ObjRequest.Proposal_Id === "" || ObjRequest.Proposal_Id === null) ? "" : ObjRequest.Proposal_Id;
        }
        if ([10, 6, 1].indexOf(ObjRequest.insurer_id) > -1) { //Royal,ICICI,Bajaj
            query['Quote_Id'] = (ObjRequest.Quote_Id === undefined || ObjRequest.Quote_Id === "" || ObjRequest.Quote_Id === null) ? "" : ObjRequest.Quote_Id;
        }
        kyc_history.findOne(query).sort({ Created_On: -1 }).exec((err, data) => {
            try {
                if (err) {
                    res.json({ "Msg": err, "Status": "FAIL" });
                } else {
                    if (data && data.hasOwnProperty('_doc') && data['_doc'].hasOwnProperty('KYC_Status') && data['_doc']['KYC_Status'] !== "VERIFY_FAIL" && data['_doc']['KYC_Status'] !== "FETCH_FAIL" && [2, 4, 13, 8].indexOf(ObjRequest.product_id) === -1 && [30].indexOf(ObjRequest.insurer_id) === -1) {
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
                        kyc_detail.update({ "PB_CRN": crn, "Insurer_Id": insurer_id }, { $set: kyc_details_updateObj }, function (err, db_update_kyc_detail) {
                            if (err) {
                                res.json({ "Msg": err, "Status": "FAIL" });
                            } else {
                                console.log('/kyc_details/save_kyc_details - kyc_details document updated')
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
                        kyc_detail.findOne({ 'PB_CRN': crn, 'Insurer_Id': insurer_id }).sort({ Modified_On: -1 }).exec(function (err, db_svae_kyc_detail) {
                            if (err) {
                                res.json({ "Msg": err, "Status": "FAIL" });
                            } else {
                                if (db_svae_kyc_detail) {
                                    kyc_detail.update({ "PB_CRN": crn, "Insurer_Id": insurer_id }, { $set: updateObj }, function (err, db_update_kyc_detail) {
                                        if (err) {
                                            res.json({ "Msg": err, "Status": "FAIL" });
                                        } else {
                                            let url_api = config.environment.weburl + '/postservicecall/kyc_details/search_kyc_details/' + (crn) + '/' + (udid) + '/' + (insurer_id);
                                            client.get(url_api, function (data, response) {
                                                if (data) {
                                                    kyc_mail_send(data.Msg);
                                                    res.json(data.Msg);
                                                } else {
                                                    res.json({ "Msg": "/search_kyc_details/ service issue", "Status": "FAIL" });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    let kyc_detail1 = new kyc_detail(saveObj);
                                    kyc_detail1.save(saveObj, function (err, users) {
                                        if (err) {
                                            res.json({ "Msg": err, "Status": "FAIL" });
                                        } else {
                                            let url_api = config.environment.weburl + '/postservicecall/kyc_details/search_kyc_details/' + (req.body.crn - 0) + '/' + (req.body.udid - 0) + '/' + (req.body.insurer_id - 0);
                                            client.get(url_api, function (data, response) {
                                                if (data) {
                                                    kyc_mail_send(data.Msg);
                                                    res.json(data.Msg);
                                                } else {
                                                    res.json({ "Msg": "/search_kyc_details/ service issue", "Status": "FAIL" });
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
                res.json({ "Msg": err.stack, "Status": "FAIL" });
            }
        });
    } catch (e1) {
        res.json({ "Msg": e1.stack, "Status": "FAIL" });
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
                '30': 'kotak_verify_kyc_details',
                '5': 'hdfc_verify_kyc_details',
                '10': 'royal_verify_kyc_details',
                '33': 'liberty_verify_kyc_details',
                '46': 'edelweiss_verify_kyc_details',
                '7': 'iffco_verify_kyc_details',
                '3': 'chola_verify_kyc_details',
                '4': 'future_verify_kyc_details',
                '9': 'reliance_verify_kyc_details',
                '11': 'tataaig_verify_kyc_details',
                '44': 'digit_verify_kyc_details',
                '6': 'icici_verify_kyc_details',
                '12': 'newindia_verify_kyc_details',
                '30': 'kotak_verify_kyc_details',
                '14': 'united_verify_kyc_details',
                '20': 'nivabupa_verify_kyc_details',
                '13': 'oriental_verify_kyc_details'
            };
            let insurer_api_name = tmp_url_api[verfiy_args.Insurer_Id];
            if ([9, 46].includes(verfiy_args.Insurer_Id - 0)) {
                insurer_api_name = 'webhook_verify_kyc_details';
            }
            //            if (get_db_kyc_details && get_db_kyc_details.Status === "FETCH_SUCCESS") {
            //                let data = {};
            //                data.KYC_Number = kyc_no;
            //                res.json({"Insurer": insurer_api_name, "Msg": data, "Status": "FETCH_SUCCESS"});
            //            } else 
            if ([5, 13].indexOf(parseInt(verfiy_args.Insurer_Id) > -1) || (get_db_kyc_details && get_db_kyc_details.Status === "FETCH_SUCCESS")) {
                let args = {
                    data: verfiy_args,
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                if (insurer_api_name === undefined) {
                    res.json({ "Msg": "KYC Process is Under Construction.....", "Status": "NEW" });
                } else {
                    let url_api = config.environment.weburl + '/kyc_details/' + insurer_api_name;
                    client.post(url_api, args, function (data, response) {
                        if (data) {
                            if (data.Msg && [30].indexOf(data.Msg.KYC_Insurer_ID) > -1 && data.Msg.KYC_Status === "VERIFY_SUCCESS") {
                                data.Msg.KYC_Response.CustomerJson = JSON.parse(data.Msg.KYC_Response.CustomerJson);
                                delete data.Msg.KYC_Response.CustomerJson.KYCPhoto;
                                data.Msg.KYC_Response.CustomerJson = JSON.stringify(data.Msg.KYC_Response.CustomerJson);
                                let update_user_data_args = {
                                    data: data.Msg.KYC_Response.CustomerJson,
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                };
                                client.post(config.environment.weburl + '/postservicecall/update_user_data/' + get_db_kyc_details['Msg']['User_Data_Id'] + '/' + data.Msg.KYC_PB_CRN + '/' + data.Msg.KYC_Insurer_ID, update_user_data_args, function (update_user_data_response) {
                                    console.log(`/update_user_data - ${JSON.stringify(update_user_data_response)}`);
                                    kyc_mail_send(data.Msg);
                                    res.json(data['Msg']);
                                });

                            } else {
                                kyc_mail_send(data.Msg);
                                res.json(data['Msg']);
                            }
                        } else {
                            res.json({ "Insurer": insurer_api_name, "Msg": "Verify service issue", "Status": "FAIL" });
                        }
                    });
                }
            } else {
                res.json({ "Msg": "/verifiy_kyc_details no details available", "Status": "FAIL" });
            }
        });
    } catch (e) {
        res.json({ "Msg": e.stack, "Status": "FAIL" });
    }
});
router.get('/kyc_details/search_kyc_details/:crn/:udid/:insurer_id', function (req, res) {
    try {
        let crn = (req.params.crn === undefined || req.params.crn === "" || req.params.crn === null) ? "" : req.params.crn - 0;
        let udid = (req.params.udid === undefined || req.params.udid === "" || req.params.udid === null) ? "" : req.params.udid - 0;
        let insurer_id = (req.params.insurer_id === undefined || req.params.insurer_id === "" || req.params.insurer_id === null) ? "" : req.params.insurer_id - 0;
        let tmp_url_api = {
            '1': 'bajaj_fetch_kyc_details',
            '30': 'kotak_fetch_kyc_details',
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
            '26': 'star_fetch_kyc_details',
            '20': 'nivabupa_fetch_kyc_details',
            '35': 'magma_fetch_kyc_details',
            '8': 'national_fetch_kyc_details',
            '13': 'oriental_fetch_kyc_details',
            '17': 'sbig_fetch_kyc_details'
        };
        let insurer_api_name = tmp_url_api[insurer_id];
        let kyc_detail = require('../models/kyc_detail');
        kyc_detail.find({ 'PB_CRN': crn, 'Insurer_Id': insurer_id }).sort({ Modified_On: -1 }).exec(function (err, data) {
            if (err) {
                res.json({ "Msg": err, "Status": "/kyc_details/search_kyc_details FAIL" });
            } else {
                if (data && data.length > 0) {
                    if (insurer_api_name === undefined) {
                        res.json({ "Msg": "KYC Process is Under Construction.....", "Status": "FAIL" });
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
                                    res.json({ "Insurer": insurer_api_name, "Msg": data.Msg, "Status": "SUCCESS" });
                                } else {
                                    res.json({ "Insurer": insurer_api_name, "Msg": data.Msg, "Status": "FAIL" }); // roshani
                                }
                            } else {
                                res.json({ "Insurer": insurer_api_name, "Msg": "Verify service issue", "Status": "FAIL" });
                            }
                        });
                    }
                } else {
                    res.json({ "Msg": 'KYC_DETAILS :: No Record Found', "Status": "NEW" });
                }
            }
        });
    } catch (e1) {
        res.json({ "Msg": e1.stack, "Status": "FAIL" });
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
            '5': 'hdfc_create_kyc_details',
            '26': 'star_create_kyc_details',
            '38': 'manipalcigna_create_kyc_details',
            '35': 'magma_create_kyc_details',
            '13': 'oriental_create_kyc_details',
            '18': 'shriram_create_kyc_details',
            '17': 'sbig_create_kyc_details',
            '11': 'tataaig_fetch_kyc_details',
        };
        let insurer_api_name = tmp_url_api[insurer_id];
        let tata_form_60 = ObjRequest.tata_form_60 || false;
        if (ObjRequest.insurer_id === 11 && tata_form_60 === true) {
            insurer_api_name = 'tataaig_form_60';
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
            doc.push({ 'doc_type': 'Doc1', 'doc_name': ObjRequest.Doc1_Name, 'doc_data': ObjRequest.Doc1 });
            Doc1_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID + "_" + insurer_id + "." + extension;
            if (insurer_id - 0 === 7) {
                Doc1_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID.split('_')[0] + "_" + insurer_id + "." + extension;
            }
            if (insurer_id - 0 === 26) {
                Doc1_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_Type + "_front_" + insurer_id + "." + extension;
            }
            if (insurer_id - 0 === 5) {
                Doc1_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID + "_" + insurer_id + "Front." + extension;
            }
            if (insurer_id - 0 === 38) {
                Doc1_path = "/tmp/kyc_documents/" + ObjRequest.Quote_Id + "_" + ObjRequest.Document_Type + "." + extension;
            }
        }
        if (ObjRequest.Doc2) {
            let extension = ObjRequest.Doc2_Name.split('.')[ObjRequest.Doc2_Name.split('.').length - 1];
            doc.push({ 'doc_type': 'Doc2', 'doc_name': ObjRequest.Doc2_Name, 'doc_data': ObjRequest.Doc2 });
            Doc2_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID + "_" + insurer_id + "." + extension;
            if (insurer_id - 0 === 7) {
                Doc2_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID.split('_')[1] + "_" + insurer_id + "." + extension;
            }
            if (insurer_id - 0 === 26) {
                Doc2_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_Type + "_back_" + insurer_id + "." + extension;
            }
            if (insurer_id - 0 === 5) {
                Doc2_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID + "_" + insurer_id + "Back." + extension;
            }
            if (insurer_id - 0 === 17) {
                Doc2_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Doc2_Name.split('.')[0] + "_" + insurer_id + "." + extension;
            }
			if (insurer_id - 0 === 38) {
                Doc2_path = "/tmp/kyc_documents/" + ObjRequest.Quote_Id + "_" + ObjRequest.Document_Type + "." + extension;
            }
        }
        if (ObjRequest.Doc3) {
            let extension = ObjRequest.Doc3_Name.split('.')[ObjRequest.Doc3_Name.split('.').length - 1];
            doc.push({ 'doc_type': 'Doc3', 'doc_name': ObjRequest.Doc3_Name, 'doc_data': ObjRequest.Doc3 });
            Doc3_path = "/tmp/kyc_documents/" + crn + "_" + ObjRequest.Document_ID + "_" + insurer_id + "." + extension;
            if (insurer_id - 0 === 26) {
                Doc3_path = "/tmp/kyc_documents/" + crn + "_profile_picture_" + insurer_id + "." + extension;
            }
			if (insurer_id - 0 === 38) {
                Doc3_path = "/tmp/kyc_documents/" + ObjRequest.Quote_Id + "_" + ObjRequest.Document_Type + "." + extension;
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
                        res.json({ "Msg": 'Document Unavailable', "Status": "SUCCESS" });
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
            res.json({ "Msg": err.stack, "Status": "FAIL" });
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
            'KYC_Full_Name': "",
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
        kyc_detail.findOne({ 'PB_CRN': crn, 'Insurer_Id': insurer_id }).sort({ Modified_On: -1 }).exec(function (err, db_svae_kyc_detail) {
            if (err) {
                res.json({ "Msg": err, "Status": "FAIL" });
            } else {
                if (db_svae_kyc_detail) {
                    kyc_detail.findOneAndUpdate({ "PB_CRN": crn, "Insurer_Id": insurer_id }, { $set: updateObj }, { new: true }, function (err, db_update_kyc_detail) {
                        if (err) {
                            res.json({ "Msg": err, "Status": "FAIL" });
                        } else {
                            if (insurer_api_name === undefined) {
                                res.json({ "Msg": "KYC Process is Under Construction.....", "Status": "FAIL" });
                            } else {
                                if (insurer_id === 17) {
                                    db_update_kyc_detail['_doc']['Father_name'] = ObjRequest['Father_Name'];
                                    db_update_kyc_detail['_doc']['DOB'] = ObjRequest['dob'];
                                }
                                let args = {
                                    data: db_update_kyc_detail['_doc'],
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }; //pls comment - issue - multiple records
                                let url_api = config.environment.weburl + '/kyc_details/' + insurer_api_name;
                                client.post(url_api, args, function (data, response) {
                                    if (data && data.hasOwnProperty('Msg')) {
                                        LM_Data.KYC_Number = data['Msg']['KYC_Number'] ? data['Msg']['KYC_Number'] : "NA";
                                        LM_Data.KYC_FullName = data['Msg']['KYC_FullName'] ? data['Msg']['KYC_FullName'] : "NA";
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
                                        res.json({ "Insurer": insurer_api_name, "Msg": "Create service issue", "Status": "FAIL" });
                                    }
                                });
                            }
                        }
                    });
                } else {
                    let kyc_detail1 = new kyc_detail(saveObj);
                    kyc_detail1.save(saveObj, function (err, data) {
                        if (err) {
                            res.json({ "Msg": err, "Status": "FAIL" });
                        } else {
                            if (insurer_api_name === undefined) {
                                res.json({ "Msg": "KYC Process is Under Construction.....", "Status": "FAIL" });
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
                                        LM_Data.KYC_FullName = data['Msg']['KYC_FullName'] ? data['Msg']['KYC_FullName'] : "NA";
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
                                        res.json({ "Insurer": insurer_api_name, "Msg": "Create service issue", "Status": "FAIL" });
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
        res.json({ "Msg": e1.stack, "Status": "FAIL" });
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
                res.json({ "Status": "Success", "Msg": "Bytes found", "Data": read_data });
            } else {
                res.json({ "Status": "Fail", "Msg": "No path found" });
            }

        } else {
            res.json({ "Status": "Fail", "Msg": "No path found" });
        }

    } catch (ex) {
        console.error("EXCEPTION_MAIL_POSP_DETAILS : " + ex.stack);
        res.json({ "Status": "Fail", "Msg": ex.stack });
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
                new_file_path.push(('/tmp/kyc_documents/' + (ObjRequest.crn + "_" + ObjRequest.document_id + "_" + ObjRequest.insurer_id) + '.' + extension).replace(/#| |"|'|`|%20|%22|%27|%2C/g, ''));
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
        let response = { "Msg": 'doc saved', "Data": res_data, "Status": "Success" };
        if (Object.keys(req.files).length == 0) {
            response.Status = "Fail";
            response.Msg = 'document not available';
        }
        let logResponse = {
            Response_Core: response,
            Date: new Date()
        };
        fs.appendFileSync(appRoot + "/tmp/policyboss_upload_doc_log/" + logFileName, JSON.stringify(logResponse), 'utf8');
        res.json(response);
    } catch (err) {
        let errRes = { "Msg": err.stack, "Status": "Fail" };
        console.error('UPDERROR-', errRes);
        let logRes = {
            Response_Core: errRes,
            Date: new Date()
        };
        fs.appendFileSync(appRoot + "/tmp/policyboss_upload_doc_log/" + logFileName, JSON.stringify(logRes), 'utf8');
        res.json(errRes);
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
            KYC_Number: { $nin: [null, ""] }
        };
        //        if(insurer_id !== 7){
        query['Document_ID'] = (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID;
        //        }
        kyc_detail.update({ "PB_CRN": crn, "Insurer_Id": insurer_id }, { $set: updateObj }, function (err, db_update_kyc_detail) {
            if (err) {
                res.json({ "Msg": err, "Status": "FAIL" });
            } else {
                kyc_history.findOne(query).exec((err, data) => {
                    try {
                        if (err) {
                            res.json({ "Msg": err, "Status": "FAIL" });
                        } else {
                            if (data && data.hasOwnProperty('_doc')) {
                                let LM_Data = {
                                    "KYC_Doc_No": (data['_doc'].hasOwnProperty('Document_ID')) ? (data['_doc']['Document_ID']) : "",
                                    "KYC_Number": (data['_doc'].hasOwnProperty('KYC_Number')) ? (data['_doc']['KYC_Number']) : "",
                                    "KYC_FullName": (data['_doc'].hasOwnProperty('KYC_Full_Name')) ? (data['_doc']['KYC_Full_Name']) : "",
                                    "KYC_Ref_No": (data['_doc'].hasOwnProperty('KYC_Ref_No')) ? (data['_doc']['KYC_Ref_No']) : "",
                                    "KYC_Redirect_URL": (data['_doc'].hasOwnProperty('KYC_URL')) ? (data['_doc']['KYC_URL']) : "",
                                    "KYC_Insurer_ID": (data['_doc'].hasOwnProperty('Insurer_Id')) ? (data['_doc']['Insurer_Id']) : "",
                                    "KYC_PB_CRN": (data['_doc'].hasOwnProperty('PB_CRN')) ? (data['_doc']['PB_CRN']) : "",
                                    "KYC_Status": (data['_doc'].hasOwnProperty('KYC_Status')) ? (data['_doc']['KYC_Status']) : ""
                                };
                                if (req.body.insurer_id - 0 === 8) {
                                    LM_Data.merchantId = data['_doc']['KYC_Response_Core']['result']['merchantData']['basicDetails']['executedRules']['0']['merchantId'];
                                    LM_Data.journeyType = data['_doc']['KYC_Response_Core']['result']['merchantData']['formData']['Radio'];
                                }
                                res.send(LM_Data);
                            } else {
                                let query2 = {
                                    PB_CRN: crn,
                                    Insurer_Id: (req.body.insurer_id === undefined || req.body.insurer_id === "" || req.body.insurer_id === null) ? "" : req.body.insurer_id - 0
                                };
                                if ([6].indexOf(insurer_id) > -1) {
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
                                    ]
                                } else {
                                    query2.$or = [
                                        {
                                            Document_ID: (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                                            DOB: (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date
                                        },
                                        {
                                            KYC_Status: 'CREATE_SUCCESS'
                                        }
                                    ]
                                }
                                kyc_history.findOne(query2).sort({ Created_On: -1 }).exec((err, data) => {
                                    try {
                                        if (err) {
                                            res.json({ "Msg": err, "Status": "FAIL" });
                                        } else {
                                            if (data && data.hasOwnProperty('_doc')) {
                                                if (data['_doc'].hasOwnProperty('KYC_Status') && data['_doc']['KYC_Status']) {
                                                    if (['FETCH_FAIL', 'VERIFY_FAIL'].indexOf(data['_doc']['KYC_Status']) > -1 && insurer_id - 0 !== 13) {
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
                                                            if(ObjRequest.vehicle_registration_type && ObjRequest.vehicle_registration_type == "corporate"){
                                                               lm_save_args['Proposal_Request']['vehicle_registration_type']  = ObjRequest.vehicle_registration_type;
                                                            }
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
                                                            res.json({ "Msg": err.stack, "Status": "FAIL" });
                                                        }
                                                    } else {
                                                        let LM_Data = {
                                                            "KYC_Doc_No": (data['_doc'].hasOwnProperty('Document_ID')) ? (data['_doc']['Document_ID']) : "",
                                                            "KYC_Number": (data['_doc'].hasOwnProperty('KYC_Number')) ? (data['_doc']['KYC_Number']) : "",
                                                            "KYC_FullName": (data['_doc'].hasOwnProperty('KYC_Full_Name')) ? (data['_doc']['KYC_Full_Name']) : "",
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
                                                res.json({ "Insurer": Insurer_Id, "Msg": "No Data Found", "Status": "FAIL" });
                                            }
                                        }
                                    } catch (err) {
                                        res.json({ "Msg": err.stack, "Status": "FAIL" });
                                    }
                                });
                            }
                        }
                    } catch (err) {
                        res.json({ "Msg": err.stack, "Status": "FAIL" });
                    }
                });
            }
        });
    } catch (err) {
        res.json({ "Msg": err.stack, "Status": "FAIL" });
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
            { "KYC_Status": "FETCH_SUCCESS", "FETCH_SUCCESS": "KYC-SEARCH", "Status": "KYC-INFO" },
            { "KYC_Status": "FETCH_FAIL", "FETCH_FAIL": "KYC-SEARCH", "Status": "FAIL" },
            { "KYC_Status": "FETCH_ERROR", "FETCH_ERROR": "KYC-SEARCH", "Status": "ERROR" },
            { "KYC_Status": "VERIFY_SUCCESS", "VERIFY_SUCCESS": "KYC-VERIFICATION", "Status": "KYC-INFO" },
            { "KYC_Status": "VERIFY_FAIL", "VERIFY_FAIL": "KYC-VERIFICATION", "Status": "FAIL" },
            { "KYC_Status": "VERIFY_ERROR", "VERIFY_ERROR": "KYC-VERIFICATION", "Status": "ERROR" },
            { "KYC_Status": "CREATE_SUCCESS", "CREATE_SUCCESS": "KYC-CREATE", "Status": "KYC-INFO" },
            { "KYC_Status": "CREATE_FAIL", "CREATE_FAIL": "KYC-CREATE", "Status": "FAIL" },
            { "KYC_Status": "CREATE_ERROR", "CREATE_ERROR": "KYC-CREATE", "Status": "ERROR" },
            { "KYC_Status": "UPDATE_SUCCESS", "UPDATE_SUCCESS": "KYC-UPDATE", "Status": "KYC-INFO" },
            { "KYC_Status": "UPDATE_FAIL", "UPDATE_FAIL": "KYC-UPDATE", "Status": "FAIL" },
            { "KYC_Status": "UPDATE_ERROR", "UPDATE_ERROR": "KYC-UPDATE", "Status": "ERROR" }
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
            let arrTo = ['roshani.prajapati@policyboss.com'];
            //let arrCc = ['anuj.singh@policyboss.com'];
            let arrBcc = [config.environment.notification_email];
            //objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, mail_content, '', arrBcc.join(','));
            objModelEmail.send('notifications@policyboss.com', arrBcc.join(','), sub, mail_content, '', '');
        }
    } catch (e) {
        console.error("Error in KYC mail send", e.stack);
    }
}
router.post('/future_requests/future_services', function (req, res) {
    try {
        let soap = require('soap');
        let xml2js = require('xml2js');
        let objRequest = JSON.parse(JSON.stringify(req.body));
        let method_type = objRequest.method_type ? objRequest.method_type : "";
        let method_file_url = objRequest.method_file_url ? objRequest.method_file_url : "";
        let method_action = objRequest.method_action ? objRequest.method_action : "";
        let request = objRequest.request ? objRequest.request : "";
        let builder = new xml2js.Builder();
        let xml_builder = builder.buildObject(request);
        let xml_request = xml_builder.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '');
        console.error("Future XML Request", xml_request);
        let args = {
            "Product": "Motor",
            "XML": xml_request
        };
        let objResponseFull = { 'err': null, 'result': null, 'raw': null, 'soapHeader': null, 'objResponseJson': null };
        soap.createClient(method_file_url, function (soap_err, soap_client) {
            try {
                if (soap_err) {
                    console.error('Exception in /future_services', soap_err);
                    objResponseFull['err'] = JSON.stringify(soap_err);
                    res.json({ "Msg": "Error", "Data": objResponseFull });
                } else {
                    soap_client.setEndpoint(method_file_url.split('?')['0']);
                    soap_client[method_action](args, function (soap_client_err, result, raw, soapHeader) {
                        console.error(soap_client_err, result, raw, soapHeader);
                        if (soap_client_err) {
                            console.error('Exception in /future_services', soap_client_err, request);
                            objResponseFull['err'] = JSON.stringify(soap_client_err);
                            objResponseFull['raw'] = raw;
                            res.json({ "Msg": "Error", "Data": objResponseFull });
                        } else {
                            if (method_type === "Pdf") {
                                objResponseFull['err'] = soap_err;
                                objResponseFull['result'] = result;
                                objResponseFull['raw'] = raw;
                                objResponseFull['soapHeader'] = soapHeader;
                                objResponseFull['objResponseJson'] = result;
                                res.json({ "Msg": "Success", "Data": objResponseFull });
                            } else {
                                let fliter_response = result['CreatePolicyResult'];
                                xml2js.parseString(fliter_response, { ignoreAttrs: true }, function (xml2js_err, objXml2Json) {
                                    if (xml2js_err) {
                                        console.error('Exception in /future_services', xml2js_err, request);
                                        objResponseFull['err'] = JSON.stringify(xml2js_err);
                                        res.json({ "Msg": "Error", "Data": objResponseFull });
                                    } else {
                                        objResponseFull['result'] = result;
                                        objResponseFull['raw'] = raw;
                                        objResponseFull['objResponseJson'] = objXml2Json;
                                        res.json({ "Msg": "Success", "Data": objResponseFull });
                                    }
                                });
                            }
                        }
                    });
                }
            } catch (ex) {
                console.error('Exception in /future_services', ex.stack, request);
                objResponseFull['err'] = JSON.stringify(ex.stack);
                res.json({ "Msg": "Error", "Data": objResponseFull });
            }
        });
    } catch (e) {
        console.error('Exception in future_services', e.stack);
        objResponseFull['err'] = JSON.stringify(e.stack);
        res.json({ "Msg": "Error", "Data": objResponseFull });
    }
});
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
router.post('/sales_marketings/sales_material_tracking', function (req, res) {
    try {
        let objRequest = req.body;
        objRequest.Created_On = new Date();
        let sales_material_tracking_data = new sales_material_tracking(req.body);
        sales_material_tracking_data.save(function (err, db_sales_material_tracking) {
            if (err) {
                res.json({ 'Status': "Fail", 'Msg': err });
            } else {
                res.json({ 'Status': "Success", 'Msg': "Data Inserted Successfully", "Data": db_sales_material_tracking });
            }
        });
    } catch (e) {
        res.json({ 'Status': "Error", 'Msg': e.stack });
    }

});
router.post('/sales_marketings/sales_material_data_insert', function (req, res) {
    try {
        let objRequest = req.body || {};
        objRequest.Uploaded_On = new Date();
        let sales_marketing_material_data = new sales_marketing_material(objRequest);
        sales_marketing_material_data.save(function (sales_marketing_material_err, db_sales_marketing_material) {
            if (sales_marketing_material_err) {
                res.json({ 'Status': "Fail", 'Msg': sales_marketing_material_err });
            } else {
                res.json({ 'Status': "Success", 'Msg': "Data Inserted Successfully", "Data": db_sales_marketing_material });
            }
        });
    } catch (e) {
        res.json({ 'Status': "Error", 'Msg': e.stack });
    }
});
router.post('/sales_marketings/fetch_all_sales_marketing_material', function (req, res) {
    try {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            sort: { 'Created_On': -1 },
            lean: true,
            page: 1,
            limit: 10
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        let filter = {};
        filter = obj_pagination.filter;
        sales_marketing_material.paginate(filter, optionPaginate).then(function (question_datas) {
            res.json(question_datas);
        });
    } catch (ex) {
        console.error('Exception', 'fetch_all_marketing', ex);
        res.json({ "Status": "Fail", "Msg": ex.stack });
    }
});
router.post('/sales_marketings/update_marketing_material', function (req, res) {
    try {
        let objRequest = req.body || {};
        let Material_Id = objRequest.Material_Id ? parseInt(objRequest.Material_Id) : "";
        let updateObj = {};
        for (var key in objRequest) {
            if (key === "Material_Id") {
                continue;
            } else {
                updateObj[key] = objRequest[key];
            }
        }
        let args = {
            "Material_Id": Material_Id
        };
        if (Material_Id !== "") {
            sales_marketing_material.update(args, { $set: updateObj }, function (update_sales_marketing_material_err, numAffected) {
                if (update_sales_marketing_material_err) {
                    res.json({ 'Status': "Fail", 'Msg': update_sales_marketing_material_err });
                } else {
                    res.json({ 'Status': "Success", 'Msg': "Updated Successfully" });
                }
            });
        } else {
            res.json({ "Status": "Fail", "Msg": "Material Id is missing." });
        }
    } catch (e) {
        res.json({ 'Status': "Error", 'Msg': e.stack });
    }

});
router.post('/update_user_data/:udid/:crn/:insurer_id', function (req, res) {
    try {
        let objRequest = req.body;
        let udid = req.params.udid ? req.params.udid : "";
        let crn = req.params.crn ? req.params.crn : "";
        let insurer_id = req.params.insurer_id ? req.params.insurer_id : "";
        let proposal = require('../models/proposal');
        let cond = {};
        let objProposal = {};
        let objProcessedRequest = {};
        let objErpQtRequest = {};
        let objProposalRequestCore = {};
        let objPaymentRequest = {};
        let userData = {};
        let pg_data = {};
        let kotakhash = "";
        if (udid !== "" && crn !== "" && insurer_id !== "") {
            cond['User_Data_Id'] = udid - 0;
            cond['PB_CRN'] = crn - 0;
            cond['Insurer_Id'] = insurer_id - 0;
            console.log(cond);
            User_Data.find(cond, function (err, dbuserdata) {
                if (err) {
                    res.json({ "Status": "Fail", "Msg": err });
                } else {
                    userData = dbuserdata.length > 0 ? dbuserdata[0]._doc : {};
                    pg_data = userData.Payment_Request.pg_data;
                    if (objRequest.hasOwnProperty('KYCFullName')) {
                        objRequest.KYCFullName = (objRequest.KYCFullName).toUpperCase();
                        try {
                            let arr_KYC_FullName = objRequest.KYCFullName.split(" ");
                            objProposal['first_name'] = arr_KYC_FullName[1];
                            objProposal['middle_name'] = arr_KYC_FullName.slice(2, arr_KYC_FullName.length - 1).join(" ");
                            objProposal['last_name'] = arr_KYC_FullName[arr_KYC_FullName.length - 1];
                            kotakhash = createKotakHash(objProposal['first_name'], pg_data);
                            /*
                             objProposalRequestCore['first_name'] = objProposal['first_name'];
                             objProposalRequestCore['middle_name'] = objProposal['middle_name'];
                             objProposalRequestCore['last_name'] = objProposal['last_name'];
                             
                             objErpQtRequest["___first_name___"] = objProposal['first_name'];
                             objErpQtRequest["___middle_name___"] = objProposal['middle_name'];
                             objErpQtRequest["___last_name___"] = objProposal['last_name'];
                             
                             objProcessedRequest["___first_name___"] = objProposal['first_name'];
                             objProcessedRequest["___middle_name___"] = objProposal['middle_name'];
                             objProcessedRequest["___last_name___"] = objProposal['last_name'];
                             */
                        } catch (e) {
                        }
                    }
                    /*
                     if (objRequest.hasOwnProperty('KYCPerAdd1') && objRequest.hasOwnProperty('KYCPerAdd2') && objRequest.hasOwnProperty('KYCPerAdd3')) {
                     objProposal['permanent_address_1'] = objRequest.KYCPerAdd1;
                     objProposal['permanent_address_2'] = objRequest.KYCPerAdd2;
                     objProposal['permanent_address_3'] = objRequest.KYCPerAdd3;
                     
                     objProposalRequestCore['permanent_address_1'] = objRequest.KYCPerAdd1;
                     objProposalRequestCore['permanent_address_2'] = objRequest.KYCPerAdd2;
                     objProposalRequestCore['permanent_address_3'] = objRequest.KYCPerAdd3;
                     
                     objErpQtRequest["___permanent_address_1___"] = objRequest.KYCPerAdd1;
                     objErpQtRequest["___permanent_address_2___"] = objRequest.KYCPerAdd2;
                     objErpQtRequest["___permanent_address_3___"] = objRequest.KYCPerAdd3;
                     
                     objProcessedRequest["___permanent_address_1___"] = objRequest.KYCPerAdd1;
                     objProcessedRequest["___permanent_address_2___"] = objRequest.KYCPerAdd2;
                     objProcessedRequest["___permanent_address_3___"] = objRequest.KYCPerAdd3;
                     }
                     */
                    proposal.update(cond, {
                        $set: {
                            "Proposal_Request.first_name": objProposal['first_name'],
                            "Proposal_Request.middle_name": objProposal['middle_name'],
                            "Proposal_Request.last_name": objProposal['last_name']
                        }
                    }, function (err, numAffected) {
                        if (err) {
                            res.json({ "Status": "Fail", "Msg": err });
                        } else {
                            User_Data.update(cond, {
                                $set: {
                                    "Proposal_Request_Core.first_name": objProposal['first_name'],
                                    "Proposal_Request_Core.middle_name": objProposal['middle_name'],
                                    "Proposal_Request_Core.last_name": objProposal['last_name'],
                                    "Proposal_Request.first_name": objProposal['first_name'],
                                    "Proposal_Request.middle_name": objProposal['middle_name'],
                                    "Proposal_Request.last_name": objProposal['last_name'],
                                    "Payment_Request.pg_data.firstname": objProposal['first_name'],
                                    "Payment_Request.pg_data.lastname": objProposal['last_name'],
                                    "Payment_Request.pg_data.hash": kotakhash,
                                    "Erp_Qt_Request_Core.___first_name___": objProposal["first_name"],
                                    "Erp_Qt_Request_Core.___middle_name___": objProposal["middle_name"],
                                    "Erp_Qt_Request_Core.___last_name___": objProposal["last_name"],
                                    "Processed_Request.___first_name___": objProposal["first_name"],
                                    "Processed_Request.___middle_name___": objProposal["middle_name"],
                                    "Processed_Request.___last_name___": objProposal["last_name"]
                                }
                            }, function (err, numAffected) {

                                if (err) {
                                    res.json({ "Status": "Fail", "Msg": err });
                                } else {
                                    res.json({ "Status": "Success", "Msg": numAffected });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.json({ "Status": "Fail", "Msg": "UDID or CRN or Insurer_Id is missing" });
        }

    } catch (e) {
        console.error("Error - /update_user_data", e.stack);
        res.json({ "Status": "Fail", "Msg": e.stack });
    }
});

router.post('/health_nivabupa/nivabupa_get_uw_form', function (req, res) {
    try {
        var niva_med_Que = require('../models/nivabupa_medical_question');
        let lm_request = req.body;
        let crn = req.body.crn;
        let prodVariant = "";
        let applicationId = '820000' + moment().format("HHmmss");
        let auth_key = config.environment.name === "Production" ? "RmtOpjWmK4FuDb-j3pqSuRSDCZbEXs0A16_koDGRl6E" : "RmtOpjWmK4FuDb-j3pqSuRSDCZbEXs0A16_koDGRl6E";
        client.get(config.environment.weburl + '/user_datas/detail_by_crn/' + crn, function (data, err) {
            if (data && data.Premium_Request) {
                console.log(data);
                let premReq = data.Premium_Request;
                if ((premReq['is_posp'] && premReq['is_posp'] == 'yes') || (premReq['ss_id'] && [7582,150262].indexOf(premReq['ss_id']) > -1)) {
                    if (premReq.hasOwnProperty('adult_count') && premReq.hasOwnProperty('child_count') && (premReq['adult_count'] - 0) + (premReq['child_count'] - 0) > 1) {
                        prodVariant = 'Floater_POS';
                    } else {
                        prodVariant = 'Individual_POS';
                    }
                }
            }
            niva_med_Que.find({"application_id": applicationId, "CRN": crn}, function (err, data) {
                if (err) {
                    res.json({"Msg": err, "Status": "FAIL"});
                } else {
                    if (data && data.length > 0 && data[0] && data[0].hasOwnProperty('_doc') && data[0]['_doc'].hasOwnProperty('redirect_url') && data[0]['_doc']['redirect_url']) {
                        res.json({'Status': 'Success', Response: data[0]['_doc']['Response_Core'], "Application": applicationId});
                    } else {
                        let insureds = [];
                        let today = moment().utcOffset("+05:30");
                        let current_time = moment(today).format("HH:mm:ss");
                        current_time = current_time.replaceAll(":", "");
                        let ins_no = current_time;
                        for (let i = 1; i <= lm_request['adult_count']; i++) {
                            let ins_mem_adult = {
                                "Insured_Name": lm_request['member_' + i + '_fullName'],
                                "Insured_No": '820' + ins_no + i,
                                "DOB": moment(lm_request['member_' + i + '_birth_date']).format('DD/MM/YYYY'),
                                "Gender": lm_request['member_' + i + '_gender'] === "M" ? "Male" : "Female",
                                "IsAdult": "Yes",
                                "Height": lm_request['member_' + i + '_height'] === "" ? 0 : lm_request['member_' + i + '_height'],
                                "Weight": lm_request['member_' + i + '_weight'] === "" ? 0 : lm_request['member_' + i + '_weight'],
                                "Waistline": "",
                                "Riders": lm_request.riders
                            };
                            insureds.push(ins_mem_adult);
                        }
                        for (let i = 3; i <= lm_request['child_count'] + 2; i++) {
                            let ins_mem_child = {
                                "Insured_Name": lm_request['member_' + i + '_fullName'],
                                "Insured_No": '820' + ins_no + i,
                                "DOB": moment(lm_request['member_' + i + '_birth_date']).format('DD/MM/YYYY'),
                                "Gender": lm_request['member_' + i + '_gender'] === "M" ? "Male" : "Female",
                                "IsAdult": "No", //lm_request['member_' + i + '_age'] > 18 ? "Yes" : "No",
                                "Height": lm_request['member_' + i + '_height'] === "" ? 0 : lm_request['member_' + i + '_height'],
                                "Weight": lm_request['member_' + i + '_weight'] === "" ? 0 : lm_request['member_' + i + '_weight'],
                                "Waistline": "",
                                "Riders": ""
                            };
                            insureds.push(ins_mem_child);
                        }


                        let data1 = {
                            "Application": applicationId,
                            "SourceSystemName": "Landmark",
                            "ProductName": 'ReAssure2.0',
                            "ProductVariant": prodVariant,
                            "ProductCode": lm_request.planCode,
                            "IsComboCase": "",
                            "PlanName": lm_request.planName ? lm_request.planName : 'NA',
                            "tele_type": "INSTANT_TELE/CHAT",
                            "tele_required": true,
                            "mobile_number": lm_request.mobile ? lm_request.mobile : '',
                            "proposer_name": lm_request.contact_name ? lm_request.contact_name : "",
                            "proposer_dob": lm_request.birth_date ? moment(lm_request.birth_date).format('DD/MM/YYYY') : "",
                            "proposer_gender": lm_request.gender_text ? lm_request.gender_text : "",
                            "Insureds": insureds
                        };
                        let args = {
                            data: JSON.stringify(data1),
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": auth_key,
                                "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5 (.NET CLR 3.5.30729)"
                            }
                        };
                        console.log('line******** 7101', data1);
                        var Client = require('node-rest-client').Client;
                        var client = new Client();
                        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                        let service_url = config.environment.name === 'Production' ? 'https://rules.nivabupa.com/api/v1/survey/get_uw_form' : 'https://rules1.nivabupa.com/api/v1/survey/get_uw_form';
                        client.post(service_url, args, function (data, response) {
                            try {
                                if (data.urls) {
                                    console.log('Status: Success\ndata: ', data.urls.url);
                                    //var niva_med = db.collection('nivabupa_medical_question');
                                    var niva_medQue = {};
                                    niva_medQue['Application_Id'] = applicationId;
                                    niva_medQue['PB_CRN'] = crn;
                                    niva_medQue['Method_Type'] = "Get UW FORM";
                                    niva_medQue['Insurer_Request'] = data1;
                                    niva_medQue['Insurer_Response'] = data;
                                    niva_medQue.Created_On = new Date();
                                    let niva_med_obj = new niva_med_Que(niva_medQue);
                                    niva_med_obj.save(niva_medQue, (err, res1) => {
                                        if (err) {
                                            res.json({Status: 'Error', Msg: err});
                                        } else {
                                            res.json({'Status': 'Success', Response: data, "Application": applicationId});
                                        }
                                    });
                                } else {
                                    res.json({'Status': 'Fail', data: data});
                                }
                            } catch (e) {
                                res.json({'Status': 'Fail', 'Msg': e.stack});
                            }
                        });
                    }
                }
            });
        });
    } catch (e) {
        res.json({ 'Status': 'Fail', 'Msg': e.stack });
    }
});
router.post('/health_nivabupa/nivabupa_final_result', function (req, res) {
    try {
        var niva_med_Que = require('../models/nivabupa_medical_question');
        let lm_request = req.body;
        let crn = req.body.crn;
        let applicationId = lm_request.applicationId;
        let auth_key = config.environment.name === "Production" ? "" : "RmtOpjWmK4FuDb-j3pqSuRSDCZbEXs0A16_koDGRl6E";
        //let data1 = {"application_id": applicationId};
        let args = {
            data: { "application_id": applicationId },
            //"application_id": applicationId,
            //data : JSON.stringify(data1),
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5 (.NET CLR 3.5.30729)",
                "Authorization": auth_key
            }
        };

        /******************* method 1 *******************/
        let Client = require('node-rest-client').Client;
        let client = new Client();
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        let data1 = args;
        let service_url = config.environment.name === 'Production' ? '' : 'https://rules1.nivabupa.com/api/v1/survey/final_result';
        client.post(service_url, args, function (data, response) {
            try {
                //data = {"final_result":{"members":[{"rule_pass":[{"non_std_no_uw":"no","icd_description":"","icd_code":"","member_reject":"","member_accept":"yes","ci_rider":"","manual_uv":"","comments":"","defer_days":"","defer":"","exclude_months":"","exclude":"","mer":"","loading_percent":"","loading":"","disease_rejected":"","accept_ped":"","disease_accept_std":"no","name":"999-0b) Reassure - Base - Accept STD","id":"10000241"},{"non_std_no_uw":"yes","icd_description":"","icd_code":"","member_reject":"","member_accept":"","ci_rider":"","manual_uv":"","comments":"","defer_days":"","defer":"","exclude_months":"","exclude":"","mer":"","loading_percent":"10","loading":"yes","disease_rejected":"","accept_ped":"","disease_accept_std":"","name":"999-68b) Reassure - BMI - 10% Load","id":"10000260"}],"diabetes_ped_tenure":0,"diabetes_ped":"no","htn_ped_tenure":0,"htn_ped":"no","htn_loading":"0","diabetes_loading":"0","loading_percent":"10","DM_reject":false,"result":"Loading","member_non_std_no_uw":true,"all_icd_codes":"","member_id":8201044581.0}],"MBR_RE_TAG2":null,"MBR_RE_TAG1":null,"MBR_RE_MUW":"No","application_non_std_no_uw":true,"application_result":"Loading","application_id":"820107301411"}};
                //data = data.toString();
                if (data.hasOwnProperty('final_result')) {
                    console.log("NivaBupa Final_result:", data);
                    res.json({ 'Status': 'Success', Response: data, "Application": applicationId });
                    var niva_medQue = {};
                    niva_medQue['Application_Id'] = applicationId;
                    niva_medQue['PB_CRN'] = crn;
                    niva_medQue['Method_Type'] = "final_result";
                    niva_medQue['Insurer_Request'] = data1;
                    niva_medQue['Insurer_Response'] = data;
                    niva_medQue.Created_On = new Date();
                    let niva_med_obj = new niva_med_Que(niva_medQue);
                    niva_med_obj.save(niva_medQue, (err, res1) => {
                        if (err) {
                            res.json({ Status: 'Error', Msg: err });
                        } else {
                            res.json({ 'Status': 'Success', Response: data, "Application": applicationId });
                        }
                    });
                } else {
                    res.json({ 'Status': 'Fail', Response: data.toString(), "Application": applicationId });
                }
            } catch (e) {
                res.json({ 'Status': 'Fail', 'Msg': e.stack });
            }
        });
    } catch (e) {
        res.json({ 'Status': 'Fail', 'Msg': e.stack });
    }
});

router.post('/kyc_eligibility_list', (req, res) => {
    try {
        const ObjRequest = req.body;
        const Client = require('node-rest-client').Client;
        const client = new Client();
        const save_kyc_details_req = ObjRequest;
        const { insurer_list } = ObjRequest;
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
        res.json({ "Msg": insurer_list_response, "Status": "SUCCESS" });
    } catch (err) {
        res.json({ "Msg": err.stack, "Status": "FAIL" });
    }
});
router.post('/kyc_eligibility_list_check', (req, res) => {
    try {
        const ObjRequest = req.body;
        const insurer_list_response = {};
        let proposal_request = ObjRequest.hasOwnProperty('Proposal_Request') && ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : {};
        let query = {
            PB_CRN: ObjRequest.crn,
            Document_ID: (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
            DOB: { $in: [((proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date), ((proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : moment(proposal_request.birth_date, 'DD/MM/YYYY').format('DD-MM-YYYY'))] },
            //            KYC_Status: {$nin: [null, "", "VERIFY_FAIL", "FETCH_FAIL", "KYC_UPDATE_FAIL", "VERIFY_SUCCESS"]},
            //            KYC_Number: {$nin: [null, ""]}
        };
        kyc_history.find(query).sort({ Created_On: -1 }).exec((err, data) => {
            try {
                if (err) {
                    res.json({ "Msg": err, "Status": "FAIL" });
                } else {
                    if (data.length > 0) {
                        data.forEach((insurer) => {
                            if (!insurer_list_response[insurer['_doc']['Insurer_Id']]) {
                                insurer_list_response[insurer['_doc']['Insurer_Id']] = insurer['_doc'];
                                if ([12].indexOf(insurer['_doc']['Insurer_Id']) > -1) {
                                    insurer_list_response[insurer['_doc']['Insurer_Id']]['KYC_Status'] = "FETCH_SUCCESS";
                                }
                            }
                        });
                    }
                    res.json({ "Msg": insurer_list_response, "Status": "SUCCESS" });
                }
            } catch (err) {
                res.json({ "Msg": err.stack, "Status": "FAIL" });
            }
        });
    } catch (err) {
        res.json({ "Msg": err.stack, "Status": "FAIL" });
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
            KYC_Status: { $nin: [null, "", "VERIFY_FAIL", "FETCH_FAIL", "KYC_UPDATE_FAIL"] }
        };
        kyc_history.findOne(query).sort({ Created_On: -1 }).exec((err, data) => {
            try {
                if (err) {
                    res.json({ "Msg": err, "Status": "FAIL" });
                } else {
                    if (data && data.hasOwnProperty('_doc')) {
                        if (data['_doc'].hasOwnProperty('KYC_Status') && data['_doc']['KYC_Status']) {
                            let LM_Data = {
                                "KYC_Doc_No": (data['_doc'].hasOwnProperty('Document_ID')) ? (data['_doc']['Document_ID']) : "",
                                "KYC_Number": (data['_doc'].hasOwnProperty('KYC_Number')) ? (data['_doc']['KYC_Number']) : "",
                                "KYC_FullName": (data['_doc'].hasOwnProperty('Full_Name')) ? (data['_doc']['Full_Name']) : "",
                                "KYC_Ref_No": (data['_doc'].hasOwnProperty('KYC_Ref_No')) ? (data['_doc']['KYC_Ref_No']) : "",
                                "KYC_Redirect_URL": (data['_doc'].hasOwnProperty('KYC_URL')) ? (data['_doc']['KYC_URL']) : "",
                                "KYC_Insurer_ID": (data['_doc'].hasOwnProperty('Insurer_Id')) ? (data['_doc']['Insurer_Id']) : "",
                                "KYC_PB_CRN": (data['_doc'].hasOwnProperty('PB_CRN')) ? (data['_doc']['PB_CRN']) : "",
                                "KYC_Status": (data['_doc'].hasOwnProperty('KYC_Status')) ? (data['_doc']['KYC_Status']) : "",
                                "KYC_Data": data['_doc']
                            };
                            res.send(LM_Data);
                        } else {
                            res.json({ "Insurer": insurer_id, "Msg": "No Data Found", "Status": "FAIL" });
                        }
                    } else {
                        res.json({ "Insurer": insurer_id, "Msg": "No Data Found", "Status": "FAIL" });
                    }
                }
            } catch (err) {
                res.json({ "Msg": err.stack, "Status": "FAIL" });
            }
        });
    } catch (err) {
        res.json({ "Msg": err.stack, "Status": "FAIL" });
    }
});

router.get('/getKycFormData/:crn', (req, res) => {
    try {
        kyc_history.find({ "PB_CRN": req.params.crn }).sort({ Created_On: -1 }).exec((err, data) => {
            if (err) {
                res.json({ "Msg": err, "Status": "FAIL" });
            }
            if (data.length > 0) {
                res.json({
                    "Status": "SUCCESS",
                    "Msg": {
                        "Name": data[0]['_doc']['Full_Name'] || "",
                        "DOB": data[0]['_doc']['DOB'] || "",
                        "Document_ID": data[0]['_doc']['Document_ID'] || "",
                        "Mobile": data[0]['_doc']['Mobile'] || "",
                        "Document_Type": data[0]['_doc']['Document_Type'] || ""
                    }
                });
            } else {
                res.json({ "Msg": "No Data Found", "Status": "FAIL" });
            }
        });
    } catch (err) {
        res.json({ "Msg": err, "Status": "FAIL" });
    }
});
router.post('/onboarding/upload_onboarding_documents', (req, res) => {
    try {
        let posp_user = require('../models/posp_users.js');
        let posp_document = require('../models/posp_document.js');
        let posp_doc_log = require('../models/posp_doc_log.js');
        let posp_api_log = require('../models/posp_api_log.js');
        let question_master = require('../models/question_master.js');
        let training_master = require('../models/training_master.js');
        let training_section_master = require('../models/training_section_master.js');
        console.error("POSP Profile Image LINE1 check1");
        let form = new formidable.IncomingForm();
        let posp_obj = {}, posp_doc_log_obj = {};
        let User_Id = 0, uploaded_len = 0;
        let doc_uploaded = "";
        let file_prefix = "", posp_email = "", nominee_relation = "";
        let posp_doc_name_obj = { "AADHAAR": "AadharCard_Front", "PAN": "PanCard", "QUALIFICATION": "Educational_Certificate", "POSP_ACC_DOC": "POSP_Cancel_Cheque", "NOMINEE_PAN_DOC": "Nominee_Pan_Card", "NOMINEE_ACC_DOC": "Nominee_Cancel_Cheque", "PROFILE": "Profile_Photo" };
        let doc_fields = { "PAN": ["Pan_No", "Name_On_PAN", "DOB_On_PAN"], "AADHAAR": ["Aadhar", "Name_On_Aadhar"], "POSP_ACC_DOC": ["Bank_Account_No", "Ifsc_Code", "Bank_Name", "Bank_Branch", "Name_as_in_Bank"], "NOMINEE_ACC_DOC": ["Nominee_Bank_Account_Number", "Nominee_Bank_Branch", "Nominee_Bank_Name", "Nominee_Ifsc_Code", "Nominee_Name_as_in_Bank"], "NOMINEE_PAN_DOC": ["Nominee_Pan", "Nominee_Name_On_Pan", "Nominee_DOB_On_Pan"] };
        let basic_fields = ["Mobile_Number", "Email_Id", "Gender", "Father_Name", "Nominee_Relationship"];
        let file_name_prefix = { "PAN": "PanCard_", "AADHAAR": "AadharCard_", "QUALIFICATION": "QualificationCertificate_", "POSP_ACC_DOC": "Posp_Bank_Account_", "NOMINEE_ACC_DOC": "Nominee_Bank_Account_", "PROFILE": "Profile_", "NOMINEE_PAN_DOC": "Nominee_Pan_Card_" };
        form.parse(req, function (err, fields, files) {
            let objRequest = fields;
            User_Id = objRequest.User_Id ? objRequest.User_Id : "";
            if (User_Id) {
                basic_fields.forEach((item) => {
                    objRequest.hasOwnProperty(item) ? posp_obj[item] = objRequest[item] : '';
                });
                let current_doc = doc_fields[objRequest["DocType"]];
                if (current_doc) {
                    current_doc.forEach((currentVal) => {
                        objRequest.hasOwnProperty(currentVal) ? posp_obj[currentVal] = objRequest[currentVal] : '';
                    });
                    if (objRequest["DocType"] === "PAN" || objRequest["DocType"] === "NOMINEE_PAN_DOC") {
                        let panType = objRequest["DocType"] === "PAN" ? "Name_On_PAN" : "Nominee_Name_On_Pan";
                        let namesArr = (objRequest[panType] !== "" && objRequest[panType] !== undefined && objRequest[panType] !== null) ? objRequest[panType].split(" ") : [];
                        if (namesArr.length > 0) {
                            objRequest["DocType"] === "PAN" ? posp_obj["First_Name"] = namesArr[0] : posp_obj["Nominee_First_Name"] = namesArr[0];
                            objRequest["DocType"] === "PAN" ? posp_obj["Middle_Name"] = namesArr[1] : posp_obj["Nominee_Middle_Name"] = namesArr[1];
                            objRequest["DocType"] === "PAN" ? posp_obj["Last_Name"] = namesArr[2] : posp_obj["Nominee_Last_Name"] = namesArr[2];
                            objRequest["DocType"] === "PAN" ? posp_obj["Birthdate"] = objRequest.DOB_On_PAN : "";
                        }

                    }
                }
                file_prefix = file_name_prefix[objRequest.DocType] + User_Id;
                var files = files;
                posp_user.find({ 'User_Id': User_Id }, function (posp_find_err, posp_find_res) {
                    if (posp_find_err)
                        res.json({ "Status": "FAIL", "Msg": posp_find_err });
                    if ((posp_find_res && posp_find_res.length > 0) || objRequest["Email_Id"] || objRequest["Nominee_Relationship"]) {
                        let posp_user_details = posp_find_res[0]._doc;
                        posp_email = posp_user_details.Email_Id;
                        nominee_relation = posp_user_details.Nominee_Relationship;
                        doc_uploaded = posp_user_details.Is_Document_Uploaded;
                        //posp_email ? uploaded_len++ : "";
                        //nominee_relation ? uploaded_len++ : "";
                        //Live profile 
                        if (objRequest.hasOwnProperty('Profile_Live_Photo')) {
                            var path = appRoot + "/tmp/onboarding_docs/";
                            var photo_file_name = "", Field_Name = "";
                            if (objRequest.hasOwnProperty('Profile_Live_Photo')) {
                                photo_file_name = "Profile_" + User_Id + '.png';
                                Field_Name = "Profile_Live_Photo";
                            }
                            var img1 = decodeURIComponent(objRequest[Field_Name]);
                            if (!fs.existsSync(appRoot + "/tmp/onboarding_docs/" + User_Id)) {
                                fs.mkdirSync(appRoot + "/tmp/onboarding_docs/" + User_Id);
                            }
                            var data = img1.replace(/^data:image\/\w+;base64,/, "");
                            if (data === "") {
                                res.json({ 'Status': "Fail", 'Msg': err });
                            } else {
                                var buf = new Buffer(data, 'base64');
                                fs.writeFile(path + User_Id + '/' + photo_file_name, buf);
                            }
                            var pdf_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + photo_file_name;
                            posp_doc_log_obj['Doc_URL'] = pdf_web_path_horizon;
                        }
                        console.error("POSP Profile Image LINE1 desktop1");
                        try {
                            if (objRequest.hasOwnProperty(posp_doc_name_obj[objRequest.DocType])) {
                                console.error("POSP Profile Image LINE1 desktop2");
                                let file_name = objRequest[posp_doc_name_obj[objRequest.DocType]];
                                let file_ext = file_name.split('.')[1];
                                if (objRequest.DocType === "PROFILE" && file_ext === 'pdf') {
                                    console.error("POSP Profile Image LINE1 desktop3");
                                    let name_arr = file_name.split('.');
                                    file_name = file_prefix + '.' + name_arr[name_arr.length - 1];
                                    let pdfPath = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
                                    let outputDir = appRoot + "/tmp/onboarding_docs/" + User_Id;
                                    console.error("POSP Profile Image LINE1 desktop", pdfPath, outputDir);
                                    convertPdfToImage(pdfPath, outputDir, User_Id);
                                    let file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
                                    let file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/Profile_" + User_Id + ".jpg";
                                    posp_doc_log_obj['Doc_URL'] = file_web_path_horizon;
                                } else {
                                    let file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
                                    let file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + file_name;
                                    posp_doc_log_obj['Doc_URL'] = file_web_path_horizon;
                                }


                            }
                        } catch (e) {
                            console.error("POSP Profile Image LINE1 desktop3545");
                        }
                        //Start Upload File
                        console.error("POSP Profile Image LINE1 desktop4");
                        if (JSON.stringify(files) !== "{}") {
                            if (!fs.existsSync(appRoot + "/tmp/onboarding_docs/" + User_Id)) {
                                fs.mkdirSync(appRoot + "/tmp/onboarding_docs/" + User_Id);
                            }
                            console.error("POSP Profile Image LINE1 desktop5");
                            for (let i in files) {
                                console.error("POSP Profile Image LINE1 desktop5");
                                let name_arr = files[i].name.split('.');
                                file_name = file_prefix + '.' + name_arr[name_arr.length - 1];
                                let file_ext = name_arr[name_arr.length - 1];
                                let file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
                                let file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + file_name;
                                console.error("POSP Profile Image LINE1 desktop6");
                                if (objRequest.DocType === "PROFILE" && file_ext === 'pdf') {
                                    let pdfPath = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
                                    let outputDir = appRoot + "/tmp/onboarding_docs/" + User_Id;
                                    console.error("POSP Profile Image LINE1 app", pdfPath, outputDir);
                                    convertPdfToImage(pdfPath, outputDir, User_Id);
                                    let file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
                                    let file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/Profile_" + User_Id + ".jpg";
                                    posp_doc_log_obj['Doc_URL'] = file_web_path_horizon;
                                } else {
                                    posp_doc_log_obj['Doc_URL'] = file_web_path_horizon;
                                    let oldpath = files[i].path;
                                    let read_data = fs.readFileSync(oldpath, {});
                                    fs.writeFileSync(file_sys_loc_horizon, read_data, {});
                                    fs.unlink(oldpath, function (err) {
                                        if (err)
                                            res.json({ 'Status': "Fail", 'Msg': "Error in deleting a file", "data": err });
                                    });
                                }
                            }
                        }

                        posp_doc_log_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                        posp_doc_log_obj['Status'] = "Pending";
                        posp_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");

                        if (objRequest["Email_Id"] || objRequest["Nominee_Relationship"]) {
                            posp_doc_log_obj = {};
                        }
                        posp_doc_log.update({ "User_Id": User_Id, "Doc_Type": objRequest["DocType"] }, { $set: posp_doc_log_obj }, function (update_posp_doc_log_err, update_posp_doc_log_res) {
                            if (update_posp_doc_log_err) {
                                res.json({ "Status": "FAIL", "Msg": update_posp_doc_log_err });
                            } else {
                                posp_doc_log.find({ "User_Id": User_Id }, function (posp_log_err, posp_log_res) {
                                    if (posp_log_err) {
                                        res.json({ "Status": "Fail", "Msg": posp_log_err });
                                    } else {
                                        if (posp_log_res.length > 0) {
                                            for (let i = 0; i < posp_log_res.length; i++) {
                                                let current_doc_log = posp_log_res[i]._doc;
                                                ["Verified", "Approved", "Pending"].includes(current_doc_log["Status"]) ? uploaded_len++ : uploaded_len;
                                            }
                                            let is_doc_uploaded = "No";
                                            uploaded_len === 7 ? (is_doc_uploaded = "Yes") : "";
                                            posp_obj["Is_Document_Uploaded"] = is_doc_uploaded;
                                            if (is_doc_uploaded === "Yes") {
                                                posp_obj["Last_Status"] = "Doc_Uploaded";
                                                posp_obj["Onboarding_Status"] = "Doc_Uploaded";
                                                posp_obj["Is_Document_Rejected"] = "No";
                                            }
                                        } else {
                                            if (!objRequest["Email_Id"] && !objRequest["Nominee_Relationship"]) {
                                                res.json({ "Status": "FAIL", "Msg": "Document log not updated." });
                                            }
                                        }
                                        posp_user.update({ 'User_Id': User_Id }, { $set: posp_obj }, function (update_posp_user_err, update_posp_user_res) {
                                            if (update_posp_user_err) {
                                                res.json({ "Status": "FAIL", "Msg": update_posp_user_err });
                                            } else {
                                                if (doc_uploaded === "No" && posp_obj.hasOwnProperty("Is_Document_Uploaded") && posp_obj["Is_Document_Uploaded"] === "Yes") {
                                                    client.get(config.environment.weburl + '/onboarding/send_verify_req_mail?ss_id=' + User_Id, {}, function (mail_data, mail_res) {
                                                        console.error('SEND_DOCUMENT_VERIFICATION_REQUEST_MAIL', 'Ss_Id: ' + User_Id);
                                                    });
                                                }
                                                res.json({ "Status": "Success", "Msg": "Document uploaded successfully." });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ "Status": "FAIL", "Msg": "Document log doesn't exist." });
                    }
                });
            } else {
                res.json({ "Status": "FAIL", "Msg": "User doesn't exist." });
            }
        });
    } catch (ex) {
        res.json({ "Status": "FAIL", "Msg": "Exception in Upload_Onboarding_Documents", "Error": ex.stack });
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
            posp_user.find({ "Ss_Id": Ss_Id }, function (err, dbresult) {
                if (err) {
                    res.json({ "Status": "Fail", "Msg": err });
                } else {
                    posp_document.find({ "User_Id": Ss_Id }, function (err, dbresult2) {
                        if (err) {
                            res.json({ "Status": "Fail", "Msg": err });
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
                                    if (posp_res.hasOwnProperty('user_type') && ["POSP", "FOS"].includes(posp_res.user_type)) {
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
                                            posp_res.POSP.hasOwnProperty("Is_IIB_Uploaded") ? args["Is_IIB_Uploaded"] = posp_res.POSP.Is_IIB_Uploaded : "No";
                                            posp_res.POSP.hasOwnProperty("POSP_UploadingDateAtIIB") ? args["POSP_UploadingDateAtIIB"] = posp_res.POSP.POSP_UploadingDateAtIIB : "";
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

                                            Posp_Name ? posp_doc["Name_On_PanCard"] = Posp_Name.toUpperCase() : "";
                                            Posp_Addr ? posp_doc["Address"] = Posp_Addr : "";
                                            req.body.hasOwnProperty("Email") ? Posp_Email = req.body.Email : "";
                                            if (Profile) {
                                                posp_doc["UploadedFiles"] = {
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

                                                posp_user.update({ "User_Id": Ss_Id }, { $set: args }, function (err, numAffected) {
                                                    if (err) {
                                                        res.json({ "Status": "Fail", "Msg": "Error while adding posp details", "data": err });
                                                    } else {
                                                        posp_document.update({ "User_Id": Ss_Id }, { $set: posp_doc }, function (err, numAffected) {
                                                            if (err) {
                                                                res.json({ "Status": "Fail", "Msg": "Error while adding posp document details", "data": err });
                                                            } else {
                                                                try {
                                                                    client.get(config.environment.weburl + "/posps/mssql/sync_training_date?ss_id=" + Ss_Id, {}, function (sync_training_date_data, sync_training_date_response) {
                                                                        console.error({ "Status": "Success", "Msg": "Postservicecall - sync_training_date called.", "Data": sync_training_date_data });
                                                                    });
                                                                } catch (ee) {
                                                                    console.error('sync_training_date Error', ee.stack);
                                                                }
                                                                res.json({ "Status": "Success", "Msg": "POSP details updated successfully", 'Ss_Id': Ss_Id });
                                                            }
                                                        });
                                                    }
                                                });
                                            } else {
                                                args["Is_Document_Uploaded"] = "Yes";
                                                args["Is_Doc_Verified"] = "Yes";
                                                args["Is_Doc_Approved"] = "Yes";
                                                args["Training_Status"] = "Started";
                                                args["Remaining_Hours"] = "30:00:00";
                                                args["Completed_Hours"] = "00:00:00";
                                                args["Certification_Datetime"] = null;
                                                //args["Training_Start_Date"] = new Date();
                                                args["Created_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                let posp_userobj = new posp_user(args);
                                                posp_userobj.save(function (err, dbresult2) {
                                                    if (err) {
                                                        res.json({ "Status": "Fail", "Msg": err });
                                                    } else {
                                                        try {
                                                            client.get(config.environment.weburl + "/posps/mssql/sync_training_date?ss_id=" + Ss_Id, {}, function (sync_training_date_data, sync_training_date_response) {
                                                                console.error({ "Status": "Success", "Msg": "Postservicecall - sync_training_date called.", "Data": sync_training_date_data });
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
                                                                res.json({ "Status": "Fail", "Msg": err });
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
                                                                    res.json({ "Status": "Success", "Msg": "Training scheduled successfully!!", 'Ss_Id': Ss_Id });
                                                                } else {
                                                                    res.json({ "Status": "Success", "Msg": "Training scheduled but mail not sent", 'Ss_Id': Ss_Id });
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            }//end
                                        } else {
                                            res.json({ "Status": "Fail", "Msg": "POSP details not found.", 'Ss_Id': Ss_Id });
                                        }
                                    } else {
                                        res.json({ "Status": "Fail", "Msg": "User type EMP not allowed.", 'Ss_Id': Ss_Id });
                                    }

                                } else {
                                    res.json({ "Status": "Fail", "Msg": "Training not scheduled.", 'Ss_Id': Ss_Id });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.json({ "Status": "Fail", "Msg": "Please provide valid Ss_Id." });
        }
        //            });
    } catch (ex) {
        console.error('Exception', 'Scheule POSP Training', ex);
        res.json({ "Status": "Fail", "Msg": ex.stack });
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

        online_content.findOne({ 'Search_Key': ObjRequest.search_key }).sort({ Modified_On: -1 }).exec(function (err, data) {
            if (err) {
                res.json({ "Msg": err, "Status": "FAIL" });
            } else {
                if (data) {
                    res.json({ status: "success", msg: data["_doc"]["Search_Content"] });
                } else {
                    request(options, function (error, response) {
                        if (error) {
                            res.json({ status: "fail", msg: error });
                        };
                        let ObjResponse = JSON.parse(response.body);
                        online_content_agrs.Chat_Gpt_Core_Response = ObjResponse || "";
                        if (ObjResponse && ObjResponse.choices && ObjResponse.choices[0] && ObjResponse.choices[0].message && ObjResponse.choices[0].message.content) {
                            online_content_agrs.Status = "success";
                            online_content_agrs.Search_Content = ObjResponse.choices[0].message.content;
                            res.json({ status: "success", msg: ObjResponse.choices[0].message.content });
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
        res.json({ status: "fail", msg: e.stack });
    }
});
//callers list services
router.post('/get_all_caller_list', function (req, res) {
    try {
        var Base = require('../libs/Base');
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            sort: { 'Created_On': -1 },
            lean: true,
            page: 1,
            limit: 10
        };
        let objRequest = req.body;
        //callers_list.find({},function())
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        if (objRequest["search_by"] === "Ss_Id") {
            filter["Ss_Id"] = objRequest["search_byvalue"];
        } else if (objRequest["search_by"] === "UID") {
            filter["UID"] = objRequest["search_byvalue"];
        }
        var callers_list = require('../models/callers_list');
        callers_list.paginate(filter, optionPaginate).then(function (dbcaller_list) {
            res.json(dbcaller_list);
        });
    } catch (error) {
        console.error('Error - /get_all_caller_list :', error);
        res.json({ 'Status': 'Fail', 'Msg': error.stack });
    }
});
router.get('/delete_callers_list', function (req, res) {
    try {
        var callerId = req.query["Caller_Id"] ? parseInt(req.query["Caller_Id"]) : "";
        // var uid = req.query["UID"] ? req.query["UID"] : "";
        var callers_list = require('../models/callers_list');
        if (callerId) {
            callers_list.deleteOne({ "Caller_Id": callerId }, function (err, numAffacted) {
                if (err) {
                    res.json({ 'Status': 'Fail', 'Msg': 'Error occurred while deleting record.' });
                } else {
                    if (numAffacted.deletedCount === 1) {
                        res.json({ "Status": "Success", "Msg": "Record deleted successfully." });
                    } else {
                        res.json({ 'Status': 'Fail', 'Msg': 'Record not found or already deleted.' });
                    }
                }
            });
        } else {
            res.json({ 'Status': 'Fail', 'Msg': 'Caller Id is missing.' });
        }
    } catch (error) {
        console.error('Error - /delete_callers_list :', error);
        res.json({ 'Status': 'Fail', 'Msg': error.stack });
    }
});
router.post('/update_callers_list', function (req, res) {
    try {
        var callerId = req.body.Caller_Id ? parseInt(req.body.Caller_Id) : "";
        var args = req.body.updateObj ? req.body.updateObj : {};
        args['Modified_On'] = new Date();
        if (callerId && args) {
            var callers_list = require('../models/callers_list');
            callers_list.update({ "Caller_Id": callerId }, { $set: args }, function (err, numAffected) {
                if (err) {
                    res.json({ 'Status': 'Fail', 'Msg': 'Error occurred while updating record.' + err });
                } else {
                    if (numAffected && numAffected.ok === 1) {
                        res.json({ "Status": "Success", "Msg": "Record updated successfully." });
                    } else {
                        res.json({ 'Status': 'Fail', 'Msg': 'Record not found.' });
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error - /update_callers_list :', error);
        res.json({ 'Status': 'Fail', 'Msg': error.stack });
    }
});
router.post('/add_new_caller', function (req, res) {
    try {
        var objRequest = req.body.caller ? req.body.caller : {};
        var uid = req.body.UID ? req.body.UID : "";
        var args = objRequest;
        args["Modified_On"] = new Date();
        args["Created_On"] = new Date();
        var callers_list = require('../models/callers_list');
        if (uid && args) {
            let caller_list = new callers_list(args);
            caller_list.save(function (err, dbresult2) {
                if (err) {
                    res.json({ "Status": "Fail", "Msg": err });
                } else {
                    if (dbresult2 && dbresult2.hasOwnProperty('_doc')) {
                        res.json({ "Status": "Success", "Msg": "Caller Saved Successfully.", "data": dbresult2 });
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error - /add_new_caller :', error);
        res.json({ 'Status': 'Fail', 'Msg': error.stack });
    }
});
router.get('/getBlogs', function (req, res) {
    try {
        var type = req.query.type || "BLOG";
        var content_management = require('../models/content_management');
        content_management.find({ Type: type, Is_Active: 1 }, { _id: 0 }).sort({ Created_On: -1 }).exec(function (err, blogs) {
            if (err) {
                res.send({ 'Status': "FAIL", 'Msg': err });
            } else {
                res.send({ 'Status': "SUCCESS", 'Msg': blogs });
            }
        });
    } catch (err) {
        res.send({ 'Status': "FAIL", 'Msg': err.stack });
    }
});
router.post('/royalsundaram_wrapper_api_https', function (req, res) {
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
            'accept': '*/*',
            'Connection': "close"
        }
    };
    console.error('insurer_service_url', service_url);
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    const https = require('https');
    const url = require('url');
    const q = url.parse(service_url, true);
    const options = {
        protocol: q.protocol,
        hostname: q.host,
        method: 'POST',
        path: q.pathname,
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        }
    };
    const request = https.request(options, (response) => {
        let data = '';
        console.error('RoyalSundaram wrapper LINE 1');
        response.on('data', (chunk) => {
            data = data + chunk.toString();
        });

        response.on('end', () => {
            const body = JSON.parse(data);
            console.error('RoyalSundaram wrapper LINE 2', body);
            res.send(body);
        });
    });

    request.on('error', (error) => {
        console.error(`Error on Get Request RoyalSundaram wrapper LINE 3 --> ${error}`);
        res.send(error);
    });
    request.write(JSON.stringify(ObjRequest));
    request.end();
});
router.post('/calculatePayout', function (req, res) {
    try {
        let objRequest = req.body || {};
        var request = require('request');
        let payout_model = require('../models/payouts');
        let payout_data = new payout_model();
        var response_obj = {};
        var req_obj = {
            "amount": objRequest.amount,//878777,
            "twVehicleTypeProductname": objRequest.twVehicleTypeProductname,//"Two Wheeler",
            "twInsurerInsCompany": objRequest.twInsurerInsCompany,//"ICICI LOMBARD GENERAL INSURANCE CO LTD",
            "twVehicleSubType": objRequest.twVehicleSubType,// "Scooter",
            "twPolicyType": objRequest.twPolicyType,//"1+5",
            "twBusinessType": objRequest.twBusinessType,//"New",
            "twVerticleName": objRequest.twVerticleName,//"HERO",
            "twVehicleCC": objRequest.twVehicleCC,//250,
            "twFuelType": objRequest.twFuelType,//"Petrol",
            "twNoClaimBonus": objRequest.twNoClaimBonus,//"",
            "twStateRto": objRequest.twStateRto//"RJ26"
        };
        var options = {
            'method': 'POST',
            'url': 'http://ec2-43-204-192-1.ap-south-1.compute.amazonaws.com:8080/api/v1/calculatePayout',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req_obj)
        };
        var now = new Date();
        payout_data.PB_CRN = objRequest.crn - 0;
        payout_data.User_Data_Id = objRequest.udid - 0;
        payout_data.Insurer_Id = objRequest.insurer_id - 0;
        payout_data.Created_On = now;
        payout_data.Request = req_obj;

        request(options, function (error, response) {
            if (error) {
                console.error(error);
                response_obj = { "Status": "Fail", "Msg": error };
            } else {
                response_obj = { "Status": "Success", "Msg": JSON.parse(response.body) };
            }
            payout_data.Point = response_obj.Msg[0].twCalculatedPo - 0;
            payout_data.Status = response_obj.Status;
            payout_data.Response = response_obj;
            payout_data.save(function (err, res2) {
                if (err) {
                    console.error('calculate_payout_logs', err);
                }
            });
            res.json(response_obj);
        });
    } catch (e) {
        res.json({ "Status": "Fail", "Msg": e.stack });
    }
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
router.post('/royalsundaramMotor_request_check_NIU', function (req, res) {
    var ObjRequest = req.body;
    var axios = require('axios');
    let tmpdata1 = JSON.stringify(ObjRequest);
    let tmpdata2 = tmpdata1.replace(/\\n/g, '');
    let tmpdata = tmpdata2.replace(/\\n/g, '');
    console.error("royalsundaramMotor_request_check Line 1", tmpdata);
    var post_request_config = {
        method: 'post',
        url: 'https://dtcdocstag.royalsundaram.in/Services/Product/GoodsCarryingVehicle/CalculatePremium',
        headers: {
            'Content-Type': "application/json",
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
        },
        data: tmpdata
    };
    console.error("royalsundaramMotor_request_check Line 2", post_request_config.data);
    axios(post_request_config)
        .then(function (response) {
            res.json(response.data);
        })
        .catch(function (error) {
            res.json(error);
        });

});

router.post('/royalsundaramMotor_request_check', function (req, res) {
    var ObjRequest = req.body;
    console.error('royalsundaramMotor_request_check one', req.headers);
    let method_type_class = req.headers.authorization;
    var method_type = method_type_class.split('_')[0];
    var vehicle_class = method_type_class.split('_')[1];
    var axios = require('axios');
    let tmpdata = ObjRequest;
    //let tmpdata1 = JSON.stringify(ObjRequest);
    //let tmpdata2 = tmpdata1.replace(/\\n/g, '');
    //let tmpdata = tmpdata2.replace(/\\n/g, '');
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
    console.error('royalsundaramMotor_request_check two', insurer_service_url);
    console.error("royalsundaramMotor_request_check three", tmpdata);
    var post_request_config = {
        method: 'post',
        url: insurer_service_url,
        headers: {
            "Content-Type": "application/json",
            Accept: '*/*',
            'Accept-Encoding': 'gzip, deflate',
            Connection: 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
        },
        data: tmpdata
    };
    console.error("royalsundaramMotor_request_check Four", post_request_config.data);
    axios(post_request_config)
        .then(function (response) {
            let objResponse = response.data;
            console.error("royalsundaramMotor_request_check_Roshani_1", objResponse);
            if (objResponse && objResponse.message && objResponse.name == "Error") {
                let service_url = "https://qa-horizon.policyboss.com:3443/postservicecall/royalsundaramMotor_request_check_call_again";
                let post_cv_args = {
                    data: ObjRequest,
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8",
                        "Authorization": method_type + '_' + vehicle_class
                    }
                };
                args = post_cv_args;
                console.error("royalsundaramMotor_request_check Five ", args);
                client.post(service_url, args, function (RoyalSundaramMotorData, response1) {
                    res.json(RoyalSundaramMotorData);
                });
            } else {
                res.json(response.data);
            }
        })
        .catch(function (error) {
            res.json(error);
        });

});
router.post('/royalsundaramMotor_request_check_call_again', function (req, res) {
    var ObjRequest = req.body;
    console.error('royalsundaramMotor_request_check_call_again Six', req.headers);
    let method_type_class = req.headers.authorization;
    var method_type = method_type_class.split('_')[0];
    var vehicle_class = method_type_class.split('_')[1];
    var axios = require('axios');
    let tmpdata = ObjRequest;
    //let tmpdata1 = JSON.stringify(ObjRequest);
    //let tmpdata2 = tmpdata1.replace(/\\n/g, '');
    //let tmpdata = tmpdata2.replace(/\\n/g, '');
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
    console.error('royalsundaramMotor_request_check_call_again Seven', insurer_service_url);
    console.error("royalsundaramMotor_request_check_call_again Eight", tmpdata);
    var post_request_config = {
        method: 'post',
        url: insurer_service_url,
        headers: {
            "Content-Type": "application/json",
            Accept: '*/*',
            'Accept-Encoding': 'gzip, deflate',
            Connection: 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
        },
        data: tmpdata
    };
    console.error("royalsundaramMotor_request_check_call_again Line 2", post_request_config.data);
    axios(post_request_config)
        .then(function (response) {
            let objResponse = response.data;
            console.error("royalsundaramMotor_request_check_Roshani_2", objResponse);
            if (objResponse && objResponse.message && objResponse.name == "Error") {
                let service_url = "https://qa-horizon.policyboss.com:3443/postservicecall/royalsundaramMotor_request_check";
                let post_cv_args = {
                    data: ObjRequest,
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8",
                        "Authorization": method_type + '_' + vehicle_class
                    }
                };
                args = post_cv_args;
                console.error("royalsundaramMotor_request_check eleven ", args);
                client.post(service_url, args, function (RoyalSundaramMotorData, response1) {
                    res.json(RoyalSundaramMotorData);
                });
            } else {
                res.json(response.data);
            }
        })
        .catch(function (error) {
            res.json(error);
        });

});

router.post('/web_engages/event_tracking', function (req, res) {
    try {
        let event_tracking_req = req.body;
        let event_tracking_api_url = "https://api.in.webengage.com/v1/accounts/in~~991991c1/events";
        let event_tracking_authorization = "Bearer be72c21c-c001-40e9-b49c-15ba4857a0de";
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
                        res.json({ "Status": "Success", "Msg": event_tracking_data.response.status });
                    } else {
                        res.json({ "Status": "Fail", "Msg": event_tracking_data.response.message });
                    }
                } else {
                    res.json({ "Status": "Fail", "Msg": "Response status is empty" });
                }
            } else {
                res.json({ "Status": "Fail", "Msg": "No Response Received" });
            }
        });
    } catch (e) {
        res.json({ "Status": "Fail", "Msg": e.stack });
    }

});
router.post('/web_engages/user_tracking', function (req, res) {
    try {
        let user_tracking_req = req.body;
        let product_id = user_tracking_req.product_id;
        let total_no_of_sales = user_tracking_req.total_sale;
        let sync_contact_days = user_tracking_req.sync_contact_days;
        let product_obj = {
            1: "Private Vehicle",
            2: "Health",
            9: "Life",
            10: "Two Wheeler",
            12: "Commercial Vehicle"
        };
        let user_tracking_req_data = {
            "userId": "policybosstesting@gmail.com",
            "attributes": {
            }
        };
        if (product_id) {
            user_tracking_req_data["attributes"]["Total " + product_obj[product_id] + " Insurance Sales"] = total_no_of_sales;
        } else if (sync_contact_days) {
            user_tracking_req_data["attributes"]["Last Sync Contact Done in Days"] = sync_contact_days;
        } else {
            user_tracking_req_data["attributes"]["Total Sales"] = total_no_of_sales;
        }
        let user_tracking_api_url = "https://api.in.webengage.com/v1/accounts/in~~991991c1/users";
        let user_tracking_authorization = "Bearer be72c21c-c001-40e9-b49c-15ba4857a0de";
        var user_tracking_args = {
            data: user_tracking_req_data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": user_tracking_authorization
            }
        };

        client.post(user_tracking_api_url, user_tracking_args, function (user_tracking_res_data, response) {
            if (user_tracking_res_data) {
                if (user_tracking_res_data.response.status) {
                    if (user_tracking_res_data.response.status === "queued") {
                        res.json({ "Status": "Success", "Msg": user_tracking_res_data.response.status });
                    } else {
                        res.json({ "Status": "Fail", "Msg": user_tracking_res_data.response.message });
                    }
                } else {
                    res.json({ "Status": "Fail", "Msg": "Response status is empty" });
                }

            } else {
                res.json({ "Status": "Fail", "Msg": "No Response Recieved" });
            }
        });



    } catch (e) {
        res.json({ "Status": "Fail", "Msg": e.stack });
    }

});
router.post('/personalAccident_benefits/benefits', function (req, res) {
    try {
        let reqObj = req.body;
        let plan_code = reqObj.hasOwnProperty('plan_id') ? JSON.parse(reqObj.plan_id) : '';
        let insurer_id = reqObj.hasOwnProperty('insurer_id') ? JSON.parse(reqObj.insurer_id) : '';
        let InsuredDetailsList = reqObj.InsuredDetailsList;
        let adult_count = reqObj.adult_count;
        let child_count = reqObj.child_count;
        let benefit_key = ['Accidental Death', 'Loss of two limbs/two eyes or one limb and one eye (PTD)', 'Loss of one limb or one eye (PTD)', 'Permanent Total Disablement (PTD)', 'Permanent Partial Disablement (PPD)'];
        let benefitValObj = {
            'Accidental Death': 100,
            'Loss of two limbs/two eyes or one limb and one eye (PTD)': 100,
            'Loss of one limb or one eye (PTD)': 50,
            'Permanent Total Disablement (PTD)': 100,
            'Permanent Partial Disablement (PPD)': 1 - 75 //From 1% to 75% as per policy conditions
        };
        let benefitObj = {
            "all_Carriage Of Dead Body": "Reimbursement of transportation of dead body to the place of residence up to `2500/-",
            "all_Education Grant": "Education fund of two children in case of death of the policyholder"
        };
        let childIndex = 2;
        let benefitVal;
        if (InsuredDetailsList && InsuredDetailsList.length > 0) {
            InsuredDetailsList.forEach((mem, index) => {
                childIndex++;
                if (mem.hasOwnProperty('TotalCapitalSI') && mem['TotalCapitalSI']) {
                    let totalCapSI = mem['TotalCapitalSI'];
                    benefit_key.forEach(key => {
                        if (index < adult_count) {
                            if (key === 'Permanent Partial Disablement (PPD)') {
                                benefitVal = (((totalCapSI - 0) * 1) / 100) + ' To ' + (((totalCapSI - 0) * 75) / 100);
                            } else {
                                benefitVal = ((totalCapSI - 0) * benefitValObj[key]) / 100;
                            }
                            benefitObj['member_' + (index + 1) + '_' + key] = benefitVal;
                        } else if (index < 2 + child_count) {
                            if (key == 'Permanent Partial Disablement (PPD)') {
                                benefitVal = (((totalCapSI - 0) * 1) / 100) + ' To ' + (((totalCapSI - 0) * 75) / 100);
                            } else {
                                benefitVal = ((totalCapSI - 0) * benefitValObj[key]) / 100;
                            }
                            benefitObj['member_' + (childIndex - adult_count) + '_' + key] = benefitVal;
                        }
                    });
                }
            });
        }
        res.json(benefitObj);
    } catch (e) {
        console.error('Msg - Error from personalAccident_benefits', e.stack);
        res.json({ 'Msg': 'Error from personalAccident_benefits', error: e.stack });
    }
});
router.post('/policyboss_upload_doc', function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        let ObjRequest;
        let new_file_path = "";
        var kyc_doc = true;
        var msg = "";
        var status = "";
        form.parse(req, function (err, fields, files) {
            ObjRequest = fields;
            if (ObjRequest && ObjRequest.document_id && ObjRequest.document_id.toLowerCase() === "posp") {
                kyc_doc = false;
            }
            var dir = kyc_doc ? (appRoot + "/tmp/kyc_documents/") : (appRoot + "/tmp/onboarding_docs/");
            let file_name_prefix = { "PAN": "PanCard_", "AADHAAR": "AadharCard_", "QUALIFICATION": "QualificationCertificate_", "POSP_ACC_DOC": "Posp_Bank_Account_", "NOMINEE_ACC_DOC": "Nominee_Bank_Account_", "PROFILE": "Profile_", "NOMINEE_PAN_DOC": "Nominee_Pan_Card_" };
            if (fs.existsSync(dir)) {
            } else {
                fs.mkdirSync(dir);
            }
            if (!kyc_doc) {
                if (fs.existsSync(appRoot + "/tmp/onboarding_docs/" + ObjRequest.crn)) {
                } else {
                    fs.mkdirSync(appRoot + "/tmp/onboarding_docs/" + ObjRequest.crn);
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
                        var file_sys_loc_horizon = appRoot + (kyc_doc ? (('/tmp/kyc_documents/' + (ObjRequest.crn + "_" + ObjRequest.document_id + "_" + ObjRequest.insurer_id)).replace(/#| |"|'|`|%20|%22|%27|%2C/g, '')) : ("/tmp/onboarding_docs/" + ObjRequest.crn + "/" + file_name_prefix[ObjRequest.document_type] + "" + ObjRequest.crn)) + '.' + extension;
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
                'crn': ObjRequest.crn,
                'document_id': ObjRequest.document_id,
                'document_type': ObjRequest.document_type,
                'insurer_id': ObjRequest.insurer_id,
                'file_path': new_file_path
            };
            const response = { "Msg": msg, "Data": res_data, "Status": status };
            res.json(response);
        });
    } catch (err) {
        let errRes = { "Msg": err.stack, "Status": "Fail" };
        res.json(errRes);
    }
});
router.get('/mobile_verification/add_mobile_verification', function (req, res) {
    try {
        var mobile_verification = require('../models/mobile_verification');
        var objReq = req.query || {};
        var ss_id = objReq['Ss_Id'] ? objReq['Ss_Id'] - 0 : 0;
        if (ss_id) {
            mobile_verification.find({ "Ss_Id": ss_id }, function (err, dbData) {
                if (err) {
                    res.json({ 'Msg': err, 'Status': "Fail" });
                } else {
                    if (dbData.length > 0) {
                        if (dbData && dbData[0]._doc && dbData[0]._doc['Status'] && dbData[0]._doc['Status'] == "Yes") {
                            res.json({ 'Msg': dbData[0]._doc, 'Status': "Success" });
                        } else {
                            res.json({ 'Msg': dbData[0]._doc, 'Status': "Fail" });
                        }
                    } else {
                        if (objReq.hasOwnProperty('Action') && objReq['Action'] === 'update') {
                            let args = {
                                "Ss_Id": ss_id,
                                "Mobile": objReq['Mobile'],
                                "Status": objReq['Status']
                            };
                            args['Created_On'] = new Date();
                            args['Modified_On'] = new Date();
                            mobile_verificationObj = new mobile_verification(args);
                            mobile_verificationObj.save(function (err) {
                                if (err) {
                                    res.json({ 'Msg': err, 'Status': "Fail" });
                                } else {
                                    res.json({ 'Msg': 'Saved Succesfully...', 'Status': "Success" });
                                }
                            });
                        } else {
                            res.json({ 'Msg': "Data Not Found.", 'Status': "Fail" });
                        }

                    }
                }
            });
        } else {
            res.json({ 'Msg': "Ss_Id Missing", 'Status': "Fail" });
        }

    } catch (e) {
        console.error('Exception - add_mobile_verification', e.stack);
        res.json({ 'Msg': e.stack, 'Status': "Fail" });
    }
});
router.post('/get_email_template_master', function (req, res) {
    try {
        let objBase = new Base();
        let obj_pagination = objBase.jqdt_paginate_process(req.body);
        let url_val = req.body.url;
        var fetch_type = req.body.fetch_type;

        var optionPaginate = {
            sort: { 'Created_On': -1 },
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
        var email_template_master = require('../models/email_template_master');
        email_template_master.paginate(filter, optionPaginate).then(function (dbEmailTemplate) {
            res.json(dbEmailTemplate);
        });

    } catch (err) {
        console.log(err);
        res.json({ 'msg': 'error' });
    }
});

router.post('/save_email_template_master', function (req, res) {
    try {
        var email_template_master = require('../models/email_template_master');
        var updateObj = {
            "Name": req.body['name'],
            "Content": req.body['content'],
            "Updated_By": req.body['updated_by'] - 0,
            "Modified_On": new Date()
        };
        var saveObj = {
            "Name": req.body['name'],
            "Content": req.body['content'],
            "Updated_By": req.body['updated_by'] - 0
        };
        var action = req.body['action'];
        if (action === 'save') {
            let email_template_masterObj = new email_template_master(saveObj);
            email_template_masterObj.save(function (err) {
                if (err) {
                    res.json({ 'Status': 'Fail', 'Msg': 'Error while saving email template master', 'Error': err });
                } else {
                    res.json({ 'Status': 'Success', 'Msg': saveObj, 'Error': '' });
                }
            });
        } else if (action === 'edit_save') {
            email_template_master.update({ "Email_Template_Id": req.body['email_template_id'] - 0 }, { $set: updateObj }, function (err, dbdate) {
                if (err) {
                    res.json({ 'Status': 'Fail', 'Msg': 'Error while updating email template master', 'Error': err });
                } else {
                    res.json({ 'Status': 'Success', 'Msg': 'Email Template Updated Successfully.', 'Error': '' });
                }
            });
        } else {
            res.json({ 'Status': 'Success', 'Msg': '', 'Error': '' });
        }
    } catch (ex) {
        console.error('Exception in - /save_email_template_master service', ex.stack);
        res.json({ 'Status': 'Fail', 'Msg': 'Exception in save_email_template_master service', 'Error': ex.stack });
    }
});

// Oriental Start
router.post('/kyc_details/oriental_token_generation', function (req, res) {
    try {
        let ObjRequest = req.body;
        let req_txt = {
            appId: "78d6mu",
            appKey: "0vkjfunmy3ei1cumhqz5",
            expiry: 300
        };
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
                if (data['result'].token) {
                    LM_Data['token'] = data['result'].token;
                    res.json({ "Insurer": "Oriental", "Msg": LM_Data, "Status": data.status });
                } else {
                    res.json({ "Insurer": "Oriental", "Msg": data.error, "Status": "FAIL" });
                }
            } catch (err) {
                res.json({ "Insurer": "Oriental", "Msg": err.stack, "Status": "FAIL" });
            }
        });
    } catch (e1) {
        res.json({ "Insurer": "Oriental", "Msg": e1.stack, "Status": "FAIL" });
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
        let kyc_create_request = ObjRequest['KYC_Request_Core'] || "";
        let kyc_create_response = ObjRequest['KYC_Response_Core'] || "";
        let insurer_response_data = kyc_create_response.hasOwnProperty('data') && kyc_create_response.data.hasOwnProperty('details') && kyc_create_response.data.details || (kyc_create_response.message ? kyc_create_response.message : "");
        ObjRequest['Full_Name'] = cust_name || "";
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
            "KYC_Number": ObjRequest.user_kyc_no || "",
            "KYC_FullName": insurer_response_data && insurer_response_data.hasOwnProperty('insuredName') ? insurer_response_data.insuredName : "",
            "KYC_Ref_No": insurer_response_data && insurer_response_data.hasOwnProperty('ckycNo') ? insurer_response_data.ckycNo : "",
            "KYC_Redirect_URL": ObjRequest['KYC_Redirect_URL'] ? ObjRequest['KYC_Redirect_URL'] : "",
            "KYC_Insurer_ID": ObjRequest.Insurer_Id ? ObjRequest.Insurer_Id : 13,
            "KYC_PB_CRN": ObjRequest.PB_CRN ? ObjRequest.PB_CRN : "",
            "KYC_Status": kyc_create_response.status === 200 ? "FETCH_SUCCESS" : (kyc_create_response.status === 201 ? "PENDING" : "FETCH_FAIL"),
            "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "PAN" : ObjRequest.Document_Type, //"PAN",
            "KYC_Request": kyc_create_request,
            "KYC_Response": kyc_create_response,
            "mobileNumber": ObjRequest.Mobile || "",
            "DOB": ObjRequest.DOB || "",
            "PAN": ObjRequest.pan || "",
            'Product_Id': (ObjRequest.Product_Id === undefined || ObjRequest.Product_Id === "" || ObjRequest.Product_Id === null) ? 0 : ObjRequest.Product_Id - 0,
            'User_Data_Id': udid || "",
            'Email': ObjRequest.Email || "",
            'Proposal_Id': ObjRequest.Proposal_Id || "",
            'ckyc_remarks': [200, 201].indexOf(kyc_create_response.status) > -1 ? "NA" : kyc_create_response.message
        };

        saveObj = {
            'Insurer_Id': insurer_id,
            'Search_Type': (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "PAN" : ObjRequest.Document_Type,
            'KYC_Number': ObjRequest.user_kyc_no || "",
            'Mobile': ObjRequest.Mobile || "",
            'PAN': ObjRequest.pan || "",
            'Aadhar': (proposal_request.aadhar === undefined || proposal_request.aadhar === "" || proposal_request.aadhar === null) ? "" : proposal_request.aadhar,
            'Document_Type': ObjRequest.Document_Type || "",
            'Document_ID': ObjRequest.Document_ID || "",
            "KYC_Status": kyc_create_response.status === 200 ? "FETCH_SUCCESS" : (kyc_create_response.status === 201 ? "PENDING" : "FETCH_FAIL"),
            'DOB': ObjRequest.DOB || "",
            'Created_On': new Date(),
            'Modified_On': new Date(),
            'User_Data_Id': udid,
            'Product_Id': (ObjRequest.Product_Id === undefined || ObjRequest.Product_Id === "" || ObjRequest.Product_Id === null) ? 0 : ObjRequest.Product_Id - 0,
            'Email': ObjRequest.Email || "",
            'PB_CRN': (ObjRequest.PB_CRN === undefined || ObjRequest.PB_CRN === "" || ObjRequest.PB_CRN === null) ? "" : ObjRequest.PB_CRN - 0,
            'Proposal_Request': proposal_request,
            'Proposal_Id': ObjRequest.hasOwnProperty('Proposal_Id') ? ObjRequest.Proposal_Id : "",
            'Quote_Id': ObjRequest.hasOwnProperty('Quote_Id') ? ObjRequest.Quote_Id : "",
            'KYC_URL': "",
            'KYC_Ref_No': insurer_response_data && insurer_response_data.ckycNo ? kyc_create_response.ckycNo : "",
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
// Oriental Finish
router.post('/save_blog_content_image', function (req, res) {
    try {
        form.parse(req, function (err, fields, files) {
            if (files.hasOwnProperty('file_1')) {
                var pdf_file_name = files['file_1'].name;
                pdf_file_name = pdf_file_name.split('.')[0].replace(/ /g, '') + "." + pdf_file_name.split('.')[1];
                var path = "/var/www/QA/blog_content\/" + fields['category'];
                var pdf_sys_loc_horizon = path + '/' + pdf_file_name;
                //pdf_web_path = config.environment.downloadurl + "/disposition/" + fields["lead_id"] + '/' + pdf_file_name;
                var oldpath = files.file_1.path;
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                }
                fs.readFile(oldpath, function (err, data) {
                    if (err) {
                        console.error('Read', err);
                        res.json({ 'Status': 'Fail', 'Msg': 'File Not Uploaded' });
                    }
                    console.log('File read!');
                    // Write the file
                    fs.writeFile(pdf_sys_loc_horizon, data, function (err) {
                        if (err) {
                            console.error('Write', err);
                            res.json({ 'Status': 'Fail', 'Msg': 'File Not Uploaded' });
                        } else {
                            res.json({ 'Status': 'Success', 'Msg': 'File Uploaded Successfully.' });
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
                res.json({ 'Status': 'Fail', 'Msg': 'File Missing' });
            }
        });
    } catch (ex) {
        console.error('Exception in - /save_blog_content_image', ex.stack);
        res.json({ 'Status': 'Fail', 'Msg': 'Exception occurs while saving blog content image', 'Error': ex.stack });
    }
});
function convertPdfToImage(pdfPath, outputPath, ss_id) {
    console.error('PDF converted to image successfully! LINE1');
    let pdfPoppler = require('pdf-poppler');
    let path = require('path'); // Import the 'path' module
    console.error('PDF converted to image successfully! LINE2');
    let pdfFileName = path.basename(pdfPath, path.extname(pdfPath)); // Get the PDF file name without extension
    let opts = {
        format: 'jpeg',
        out_dir: outputPath,
        out_prefix: pdfFileName, // Use the PDF file name as the output prefix
        page: null
    };
    try {
        pdfPoppler.convert(pdfPath, opts);
        console.error('PDF converted to image successfully! LINE3');
        setTimeout(() => {
            fs.rename(appRoot + "/tmp/onboarding_docs/" + ss_id + "/" + pdfFileName + "-1.jpg", appRoot + "/tmp/onboarding_docs/" + ss_id + "/Profile_" + ss_id + ".jpg", (err) => {
                if (err) {
                    console.error('Error renaming file:', err);
                } else {
                    console.log('File renamed successfully.');
                }
            });
        }, 500);
        console.error('PDF converted to image successfully! LINE4');
    } catch (error) {
        console.error('Error converting PDF to image:', error);
    }
}
function createKotakHash(first_name, pg_data) {
    var baseObj = new Base();
    var hash = "";
    var merchant_key = '';//'157487';//'an7rIU';
    var productinfo = '';
    var salt = '';//'8MUr8LS7';
    if (config.environment.name === 'Production') {
        merchant_key = 'si7yXM';
        productinfo = 'kotak';
        salt = 'pJnQiKCg';
    } else {
        merchant_key = 'an7rIU';
        productinfo = 'kotak';
        salt = '8MUr8LS7';
    }
    var hashSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10';
    var str = hashSequence.split('|');
    //    var strHash = baseObj.convert_to_sha512(baseObj.randomNumeric(10) + moment().format('MM-DD-YYYY h:mm a'));
    //    var txnid1 = strHash.toString().substring(0, 20).toLowerCase();
    var hash_string = '';
    for (var hash_var in str) {
        if (str[hash_var] === "key") {
            hash_string = hash_string + merchant_key;
            hash_string = hash_string + '|';
        } else if (str[hash_var] === "txnid") {
            hash_string = hash_string + pg_data.txnid;
            hash_string = hash_string + '|';
        } else if (str[hash_var] === "amount") {
            hash_string = hash_string + pg_data.amount;
            hash_string = hash_string + '|';
        } else if (str[hash_var] === "productinfo") {
            hash_string = hash_string + productinfo;
            hash_string = hash_string + '|';
        } else if (str[hash_var] === "firstname") {
            hash_string = hash_string + first_name;
            hash_string = hash_string + '|';
        } else if (str[hash_var] === "email") {
            hash_string = hash_string + pg_data.email;
            hash_string = hash_string + '|';
        } else if (str[hash_var] === "udf1") {
            hash_string = hash_string + 'M/s Landmark Insurance Brokers Pvt Ltd (Policy Boss)';
            hash_string = hash_string + '|';
        } else {
            hash_string = hash_string + '';
            hash_string = hash_string + '|';
        }
    }
    hash_string = hash_string + salt;
    console.log(hash_string);
    hash = baseObj.convert_to_sha512(hash_string).toLowerCase();
    return hash;
}

// Bajaj breakin Start 
router.post('/inspection/bajaj_inspection_id', function (req, res) {

    let objrequest = req.body;
    try {
        let args = {
            pTransactionId: objrequest['pTransactionId'],
            pRegNoPart1: objrequest['pRegNoPart1'],
            pRegNoPart2: objrequest['pRegNoPart2'],
            pRegNoPart3: objrequest['pRegNoPart3'],
            pRegNoPart4: objrequest['pRegNoPart4'],
            pUserName: objrequest['pUserName'],
            pFlag: objrequest['pFlag'],
            pPinNumber_out: "",
            pPinStatus_out: "",
            pVchlDtlsObj_out: ""
        };
        const callingService = "http://webservicesint.bajajallianz.com:80/WebServicePolicy/WebServicePolicyPort?wsdl";
        let soap = require('soap');
        let xml2js = require('xml2js');
        soap.createClient(callingService, function (err, client) {
            client['pinProcessWs'](args, function (err1, result, raw, soapHeader) {
                if (result) {
                    if (result['pVchlDtlsObj_out']['stringval30'] === "PGNR_ALTD") {
                        var queryObj = {
                            "Product_Id": objrequest['product_id'],
                            "Insurer_Id": 1,
                            "Inspection_Id": result['pPinNumber_out'],
                            "UD_Id": objrequest['UD_Id'],
                            "Insurer_Request": JSON.stringify(objrequest),
                            "Insurer_Response": JSON.stringify(result),
                            "Status": "INSPECTION_SCHEDULED",
                            "Created_On": new Date(),
                            Modified_On: ''
                        };
                        var MongoClient = require('mongodb').MongoClient;
                        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                            if (err)
                                throw err;
                            var inspectionIdGeneration = db.collection('inspection_id_generation');
                            inspectionIdGeneration.insertOne(queryObj, function (err, res) {
                                if (err)
                                    throw err;
                            });
                        });
                    }
                    res.json(result);
                } else {
                    console.log("Error while genrating pin");
                }
            });
        });
    } catch (err) {
        console.log(err);
        res.json(err);
    }

});

router.post('/inspection/bajaj_mail_inspection_status', function (req, res) {
    var inspection_schedule = require('../models/inspection_schedule');

    let objInsurerProduct = req.body;
    let payment_link = "";
    let short_url = "";
    let Error_Msg = "";
    let Inspection_Remarks = "Bajaj Allianz General Insurance Co. Ltd. has REJECTED";
    let Inspection_Status = "";
    let service_url = "";

    try {
        if (config.environment.name.toString() === 'Production') {

            service_url = "";
        } else {

            service_url = "http://webservicesint.bajajallianz.com:80/WebServicePolicy/WebServicePolicyPort?wsdl";
        }
        let args = {
            pRegNoPart1: "",
            pRegNoPart2: "",
            pRegNoPart3: "",
            pRegNoPart4: "",
            pPinList_out: "",
            pErrorMessage_out: "",
            pErrorCode_out: ""

        };
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            if (err)
                throw err;

            var user_datas = db.collection('user_datas');

            user_datas.findOne({ "PB_CRN": objInsurerProduct["PB_CRN"], "User_Data_Id": objInsurerProduct["UD_Id"], "Insurer_Id": objInsurerProduct["Insurer_Id"] }, function (err, response) {
                if (err) {
                    throw err;
                } else {
                    args['pRegNoPart1'] = response['Proposal_Request']['registration_no_1'];
                    args['pRegNoPart2'] = response['Proposal_Request']['registration_no_2'];
                    args['pRegNoPart3'] = response['Proposal_Request']['registration_no_3'];
                    args['pRegNoPart4'] = response['Proposal_Request']['registration_no_4'];

                    const callingService = service_url;

                    let soap = require('soap');
                    let xml2js = require('xml2js');
                    soap.createClient(callingService, function (err, client) {
                        client['pinStatusWs'](args, function (err1, result, raw, soapHeader) {
                            if (result) {
                                let email_template = '';
                                let email_sub_status = '';
                                let inspection_status_msg = '';
                                let bajaj_breakin_status = '';
                                //result['pPinList_out']['WeoRecStrings10User']['stringval2'] = 'PIN_APPRD'
                                if (result['pPinList_out']['WeoRecStrings10User']['stringval2'] === 'PIN_APPRD') {
                                    bajaj_breakin_status = 'PRE_INSPECTION_APPROVED';
                                    Inspection_Status = 'INSPECTION_APPROVED';
                                    email_template = 'Send_Inspection_Status.html';
                                    email_sub_status = 'Successful';
                                    Error_Msg = Inspection_Status;
                                }
                                else if (result['pPinList_out']['WeoRecStrings10User']['stringval2'] === 'PIN_RJTD') {
                                    bajaj_breakin_status = 'PRE_INSPECTION_DECLINED';
                                    Inspection_Status = 'INSPECTION_REJECTED';
                                    email_template = 'Send_Inspection_Status.html';
                                    email_sub_status = 'Unsuccessful';
                                    Error_Msg = Inspection_Status + " : " + Inspection_Remarks;
                                }
                                else if (result['pPinList_out']['WeoRecStrings10User']['stringval2'] === 'PGNR_ALTD') {
                                    bajaj_breakin_status = 'PRE_INSPECTION_PENDING';
                                    Inspection_Status = 'INSPECTION_SCHEDULED';
                                    email_template = 'Send_Inspection_Status.html';
                                    email_sub_status = 'NOT_CHECKED';
                                    Error_Msg = Inspection_Status + " : " + Inspection_Remarks;
                                }
                                else { };

                                if (Inspection_Status === 'INSPECTION_APPROVED' || Inspection_Status === 'INSPECTION_REJECTED') {
                                    try {
                                        let queryObj = {
                                            PB_CRN: parseInt(objInsurerProduct['PB_CRN']),
                                            UD_Id: parseInt(objInsurerProduct['UD_Id']),
                                            SL_Id: parseInt(objInsurerProduct['SL_Id']),
                                            Insurer_Id: 1,
                                            Request_Unique_Id: objInsurerProduct['Request_Unique_Id'],
                                            Service_Log_Unique_Id: objInsurerProduct['Service_Log_Unique_Id'],
                                            Inspection_Number: objInsurerProduct['Inspection_Id'],
                                            Status: bajaj_breakin_status,
                                            Insurer_Request: "URL : " + service_url + " Request : " + JSON.stringify(args),
                                            Insurer_Response: JSON.stringify(result),
                                            Service_Call_Status: 'complete',
                                            Created_On: new Date(),
                                            Modified_On: ''
                                        };
                                        let MongoClient = require('mongodb').MongoClient;
                                        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                let inspectionBreakins = db.collection('inspection_breakins');
                                                inspectionBreakins.insertOne(queryObj, function (err, inspectionBreakinsdb) {
                                                    if (err) {
                                                        throw err;
                                                    } else {
                                                        console.log("bajaj_mail_inspection_status() inspectionBreakinsdb : ", inspectionBreakinsdb.insertedCount, inspectionBreakinsdb.result);
                                                    }
                                                });
                                            }
                                        });
                                    } catch (ex4) {
                                        Error_Msg = ex4;
                                        console.error('Exception in bajaj_mail_inspection_status() for inspection_breakins DB updating : ', ex4);
                                    }
                                    try {
                                        let today = new Date();
                                        let myquery = { Inspection_Id: objInsurerProduct['Inspection_Id'], PB_CRN: objInsurerProduct['PB_CRN'], UD_Id: objInsurerProduct['UD_Id'] };
                                        let newvalues = { Insurer_Status: "CHECKED", Status: Inspection_Status, Modified_On: today };
                                        inspection_schedule.updateOne(myquery, newvalues, function (uperr, upres) {
                                            if (uperr) {
                                                Error_Msg = uperr;
                                                throw uperr;
                                            } else {
                                                console.log("bajaj_mail_inspection_status() BreakIn Status Updated for : ", objInsurerProduct['Inspection_Id'], ", UD_Id : ", objInsurerProduct['UD_Id']);
                                                console.log("bajaj_mail_inspection_status() : UD_Id : ", objInsurerProduct['UD_Id'], upres);
                                            }
                                        });
                                    } catch (ex4) {
                                        Error_Msg = ex4;
                                        console.error('Exception in bajaj_mail_inspection_status() for inspection_schedule DB updating : ', ex4);
                                    }

                                    let User_Data = require('../models/user_data');
                                    let ud_cond = { "User_Data_Id": objInsurerProduct['UD_Id'] };
                                    User_Data.findOne(ud_cond, function (err, dbUserData) {
                                        if (err) {
                                            console.error('Exception in bajaj_mail_inspection_status() : ', err);
                                        } else {
                                            dbUserData = dbUserData._doc;
                                            let myquery1 = {
                                                //"Last_Status": "INSPECTION_SUBMITTED",
                                                "User_Data_Id": dbUserData.User_Data_Id,
                                                "Request_Unique_Id": objInsurerProduct['Request_Unique_Id']
                                            };
                                            let newvalues1 = '';
                                            let Status_History = (dbUserData.hasOwnProperty('Status_History')) ? dbUserData.Status_History : [];
                                            Status_History.unshift({
                                                "Status": Inspection_Status,
                                                "StatusOn": new Date()
                                            });
                                            if (Inspection_Status === 'INSPECTION_REJECTED') {
                                                newvalues1 = {
                                                    "Last_Status": Inspection_Status,
                                                    "Status_History": Status_History,
                                                    "Inspection_Remarks": Inspection_Remarks,
                                                    "Premium_Request.is_inspection_done": "yes",
                                                    "Modified_On": new Date()
                                                }, {
                                                    upsert: false, multi: false
                                                };
                                                email_template = 'Send_Inspection_Status.html'; //'Send_UnSuccessful_Inspection.html';
                                                email_sub_status = 'Unsuccessful';
                                                Inspection_Remarks = ''; //Inspection_Remarks;
                                                Error_Msg = Inspection_Status + " : " + Inspection_Remarks;
                                            }
                                            if (Inspection_Status === 'INSPECTION_APPROVED') {
                                                newvalues1 = {
                                                    "Last_Status": Inspection_Status,
                                                    "Status_History": Status_History,
                                                    "Premium_Request.is_inspection_done": "yes",
                                                    "Modified_On": new Date()
                                                };
                                                email_template = 'Send_Inspection_Status.html';
                                                email_sub_status = 'Successful';
                                                Error_Msg = Inspection_Status;
                                            }

                                            User_Data.updateOne(myquery1, newvalues1, function (err, numAffected) {
                                                console.log('bajaj_mail_inspection_status() UserDataUpdated : ', err, numAffected);
                                            });

                                            if (Inspection_Status === 'INSPECTION_APPROVED') {
                                                //payment_link = config.environment.portalurl.toString() + '/car-insurance/proposal-summary/' + dbUserData['Premium_Request']['client_id'] + '/' + objInsurerProduct['Service_Log_Unique_Id'] + '_' + objInsurerProduct['SL_Id'] + '_' + objInsurerProduct['UD_Id'] + '/NonPOSP/0';
                                                payment_link = dbUserData && dbUserData.Proposal_Request_Core && dbUserData.Proposal_Request_Core.proposal_url ? dbUserData.Proposal_Request_Core.proposal_url : "";
                                                console.log("bajaj_mail_inspection_status() payment_link : ", payment_link);
                                            }

                                            let Client1 = require('node-rest-client').Client;
                                            let client1 = new Client1();
                                            client1.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(payment_link), function (urlData, urlResponse) {
                                                try {
                                                    if (Inspection_Status === 'INSPECTION_APPROVED' && urlData && urlData.Short_Url !== '') {
                                                        inspection_status_msg = 'Your Vehicle Inspection has been done successfully. Payment Link is : ';
                                                        short_url = urlData.Short_Url;
                                                        console.log("bajaj_mail_inspection_status() inspection_status_msg : ", inspection_status_msg);
                                                    }
                                                    if (Inspection_Status === 'INSPECTION_REJECTED') {
                                                        inspection_status_msg = 'Your Vehicle Inspection has been Rejected.';
                                                        short_url = "";
                                                        console.log("bajaj_mail_inspection_status() inspection_status_msg : ", inspection_status_msg);
                                                    }

                                                    let dataObj = dbUserData['Proposal_Request_Core'];
                                                    let objRequestCore = {
                                                        'customer_name': dataObj['first_name'] + ' ' + dataObj['last_name'],
                                                        'crn': dataObj['crn'],
                                                        'vehicle_text': dataObj['vehicle_text'],
                                                        'insurer_name': 'Bajaj Allianz General Insurance Co. Ltd.',
                                                        'insurance_type': 'RENEW - Breakin Case',
                                                        'inspection_id': objInsurerProduct['Inspection_Id'],
                                                        'final_premium': parseInt(dbUserData.Proposal_Request_Core['final_premium']),
                                                        'email_id': dataObj['email'],
                                                        'registration_no': dataObj['registration_no'],
                                                        'short_url': short_url,
                                                        'inspection_status_msg': inspection_status_msg
                                                    };
                                                    let processed_request = {};
                                                    for (let key in objRequestCore) {
                                                        if (typeof objRequestCore[key] !== 'object') {
                                                            processed_request['___' + key + '___'] = objRequestCore[key];
                                                        }
                                                    }
                                                    console.error('/bajaj_mail_inspection_status Breakin Email', Inspection_Status);
                                                    if (Inspection_Status === 'INSPECTION_APPROVED' || Inspection_Status === 'INSPECTION_REJECTED') {
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
                                                        if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
                                                            if (dbUserData.Premium_Request['posp_reporting_email_id'] !== 0) {
                                                                if (dbUserData.Premium_Request['posp_reporting_email_id'].indexOf('@') > -1) {
                                                                    arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                                                }
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
                                                        res.json({ 'Status': Error_Msg });
                                                    }
                                                } catch (e) {
                                                    console.error('Exception in bajaj_mail_inspection_status() for mailing : ', e);
                                                    res.json({ 'Status': e });
                                                }
                                            });
                                        }
                                    });

                                }
                            } else {
                                console.log('Error in service bajaj_mail_inspection_status() : ', Error_Msg);
                            }
                        });

                    });

                }
            });
        });
    } catch (e) {
        console.error('Exception in bajaj_mail_inspection_status() for mailing : ', e);
        res.json({ 'Status': e });
    }

});

router.post('/inspection/bajaj_inspection_status', function (req, res) {
    var inspection_schedule = require('../models/inspection_schedule');

    try {
        let cond = { "Status": { $in: ["INSPECTION_SCHEDULED"] } };
        cond['Insurer_Id'] = 1;
        console.log("bajaj_inspection_status : cond : ", cond);
        inspection_schedule.find(cond).exec(function (err1, dbUsers) {
            if (err1) {
                res.send(err1);
            } else {
                try {
                    if (dbUsers.length > 0) {
                        console.error('Log', 'bajaj_inspection_status no. of records fetched', dbUsers.length);
                        console.error('Log', 'bajaj_inspection_status', dbUsers);
                        let objCSSummary = [];
                        for (let k in dbUsers) {
                            let user = dbUsers[k]['_doc'];
                            let temp_crn = dbUsers[k]['_doc']['PB_CRN'];
                            let args = {
                                data: user,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            objCSSummary.push(temp_crn);
                            console.error('BAJAJ - /inspection/bajaj_mail_inspection_status - POST calling Request : ', JSON.stringify(args));
                            if (dbUsers[k]['_doc']['PB_CRN'] === req.body["PB_CRN"]) {
                                let url_api = config.environment.weburl + '/postservicecall/inspection/bajaj_mail_inspection_status';
                                let Client = require('node-rest-client').Client;
                                let client = new Client();
                                client.post(url_api, args, function (data, response) {
                                    console.error('/inspections.js execute_post() : ');
                                });
                                sleep(2000);
                            }
                        }
                        res.json(objCSSummary);
                    } else {
                        res.json({ '/bajaj_inspection_status ': 'NO DATA AVAILABLE' });
                    }
                } catch (ex) {
                    console.error('Exception in bajaj_inspection_status() for inspectionSchedules db details : ', ex);
                    res.send(ex, dbUsers);
                }
            }
        });
    } catch (e) {
        res.json({ 'Msg': "bajaj_inspection_status - Exception", 'Status': "Failure" });
    }
});
// Bajaj breakin Ends
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
                res.json({ "Status": "SUCCESS", "Msg": "RECORD FETCH SUCCESSFULLY", "Data": objResponse });
            } else {
                res.json({ "Status": "FAIL", "Msg": login_data });
            }
        } catch (e) {
            res.json({ "Status": "FAIL", "Msg": e.stack });
        }
    });
});

router.post('/sbig/decrypt', (req, res) => {
    var crypto = require('crypto');
    const SymKeyBase64 = 'CQuYCxIVNyTOt487084UPBMxhS0XxRE4';
    const ivBase64 = 'w6tmvKzUj6Rg';
    // Decode the base64-encoded key and IV
    const SymKey = Buffer.from(SymKeyBase64);
    const iv = Buffer.from(ivBase64);
    const epayload = req.body;

    if (!epayload || !epayload.ciphertext) {
        res.status(400).json({ error: 'Invalid payload structure' });
        return;
    }

    const ciphertextBase64 = epayload.ciphertext;
    console.log(typeof ciphertextBase64);

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

    res.json({ decryptedData: JSON.parse(originalPlainText) });
});
router.post('/add_company', function (req, res) {
    try {
        let obj_request = req.body;
        var company_master = require('../models/company_master');
        let company_master_data = new company_master();
        for (var key in obj_request) {
            company_master_data[key] = obj_request[key];
        }
        company_master_data.Created_On = new Date();
        company_master_data.Modified_On = new Date();

        company_master.find({'Company_Name': {'$regex': "^" + company_master_data.Company_Name + "$", '$options': 'i'}}, function (err, response) {
            if (response.length > 0) {
                res.json({"Status": "FAIL", "Msg": "Company Name Already Exists"});
            } else {
                company_master_data.save(function (err, response_date) {
                    if (err) {
                        res.json({"Status": "FAIL", "Msg": err});
                    } else {
                        res.json({"Status": "SUCCESS", "Msg": response_date});
                    }
                });
            }
        })

    } catch (e) {
        console.error('Exception in -/add_company', e.stack);
        res.json({"Status": "FAIL", "Msg": e.stack});
    }
});

router.post('/get_company_master_data', function (req, res) {
    try {
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
        var company_master = require('../models/company_master');
        company_master.paginate({}, optionPaginate).then(function (user_datas) {
            res.json(user_datas);
        });
    } catch (e) {
        console.error('Exception in -/get_company_master_data', e.stack);
        res.json({"Status": "FAIL", "Msg": e.stack});
    }
});
router.get('/tataAigMarine/getToken', function (req, res) {
	try {
    var request = require('request');

    var options = {
        'method': 'POST',
        'url': 'https://uatapigw-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'grant_type': 'client_credentials',
            "scope": "https://api.iorta.in/write",
            "client_id": "4dvjgdbs2bl516rl03jh5oli5j",
            "client_secret": "r7pigrbhnqpl69bn5rt7gko7333ej06d628ttgi95t3m9h8okqs"
        }
    };
    request(options, (error, response) => {
        if (error){
            throw new Error(error);
            res.status(500);
            res.send(error.stack)
        }
        else {
            let auth = JSON.parse(response.body);
            res.status(200);
            res.send({"token":auth.access_token})
        }
    });
	} catch (e) {
		res.send(e.stack)
	}
});
router.post('/inspection_status', function (req, res){
    try{
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
        inspection.findOne(condition, function(err, insp_data){
            if(err){
                res.send({Status : "FAIL", Data: "error in inspection " + err });
            } else if(insp_data){
                res.send({Status: "SUCCESS", Data: insp_data, Msg: insp_data.Status });
            } else{
                res.send({Status:"PENDING", Data: "Data Not Found!"});
            }
        })
    }catch(e){
        console.error("Exception in Inspection status ", e.stack);
        res.send({Status : "FAIL", Data: "error in inspection " + e.stack });
    }
});
router.get('/caller_assign_list/json_data', (req, res) => {
    try {
        let file_path = appRoot + "/tmp/lead_assign_caller.json";
        if (fs.existsSync(file_path)) {
            fs.readFile(file_path, "utf8", (err, jsonString) => {
                if (err) {
                    console.error("File read failed:", err);
                    res.json({'Status': 'Fail', 'Msg': err});
                }
                console.error("jsonString", jsonString);
                if (jsonString == "[]") {
                    res.json({'Status': 'Success', 'Msg': 'No data available'});
                } else {
                    var jsonData = typeof jsonString === 'string' ? JSON.parse(jsonString) : JSON.parse(JSON.stringify(jsonString));
                    res.json({'Status': 'Success', 'Msg': jsonData});
                }
            });
        } else {
            res.json({'Status': 'Fail', 'Msg': 'File Not Found'});
        }
    } catch (e) {
        console.error(e.stack);
        res.json({'Status': "Exception", 'Msg': e.stack});
    }
});
router.post('/caller_assign_list/add_language_state/:method', (req, res) => {
    try {
        let objRequest = req.params;
        let file_path = appRoot + "/tmp/lead_assign_caller.json";
        let ss_id = req.body.ss_id || "";
        let language = req.body.language || "";
        let state_allocation = req.body.state_allocation || "";
        let val;
        let s_data;
        if (fs.existsSync(file_path)) {
            fs.readFile(file_path, "utf8", (err, jsonString) => {
                if (err) {
                    console.log("File read failed:", err);
                    return res.json({'Status': 'Fail', 'Msg': err});
                } else {
                    try {
                        val = JSON.parse(jsonString);
                        for (let i = 0; i < val.length; i++) {
                            if (val[i].ss_id == ss_id) {
                                if (objRequest.method == 'language') {
                                    val[i].language.push(language);
                                    s_data = val[i];
                                    break;
                                } else {
                                    val[i].state_allocation.push(state_allocation);
                                    s_data = val[i];
                                    break;
                                }
                            }
                        }
                        fs.writeFile(file_path, JSON.stringify(val), (err) => {
                            if (err) {
                                console.error("Error writing JSON file:", err);
                                return res.json({'Status': 'Fail', 'Msg': 'Internal Server Error', 'Data': err});
                            }
                        });
                        res.json({"Status": "Success", 'Msg': 'Sync Successfully', 'Data': s_data});
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                        return res.json({'Status': 'Exception', 'Msg': e.stack});
                    }
                }
            });
        } else {
            res.json({'Status': 'Fail', 'Msg': 'File Not Found'});
        }
    } catch (e) {
        console.error("Unexpected error:", e);
        return res.json({'Status': 'Fail', 'Msg': e.stack});
    }
});
router.post('/caller_assign_list/update_service/:method/:ss_id', (req, res) => {
    try {
        let file_path = appRoot + "/tmp/lead_assign_caller.json";
        let ss_id = parseInt(req.params.ss_id);
        let oldLang = req.body.oldLang;
        let newLang = req.body.newLang;
        let oldState = req.body.oldState;
        let newState = req.body.newState;
        if (fs.existsSync(file_path)) {
            fs.readFile(file_path, "utf8", (err, jsonString) => {
                if (err) {
                    return res.json({'Status': 'Fail', 'Msg': err});
                } else {
                    try {
                        let jsondata = typeof jsonString === 'string' ? JSON.parse(jsonString) : JSON.parse(JSON.stringify(jsonString));
                        let objToUpdate = jsondata.find((item) => item.ss_id === ss_id);
                        if (objToUpdate) {
                            if (req.params.method === "language") {
                                let langIndex = objToUpdate.language.indexOf(oldLang);
                                if (langIndex > -1) {
                                    objToUpdate.language[langIndex] = newLang;
                                } else {
                                    return res.json({'Status': 'Fail', 'Msg': 'Old language not found in the object'});
                                }
                            } else if (req.params.method === "state") {
                                let stateIndex = objToUpdate.state_allocation.indexOf(oldState);
                                if (stateIndex > -1) {
                                    objToUpdate.state_allocation[stateIndex] = newState;
                                } else {
                                    return res.json({'Status': 'Fail', 'Msg': 'Old state not found in the object'});
                                }
                            } else {
                                return res.json({'Status': 'Fail', 'Msg': 'Invalid method'});
                            }
                            fs.writeFile(file_path, JSON.stringify(jsondata), (writeErr) => {
                                if (writeErr) {
                                    console.error('Error writing JSON file:', writeErr);
                                    return res.json({'Status': 'Fail', 'Msg': 'Internal Server Error'});
                                }
                                return res.json({'Status': 'Success', 'Msg': 'Update Caller List Successfully', 'Data': objToUpdate});
                            });
                        } else {
                            return res.json({'Status': 'Fail', 'Msg': 'Object with the given ID not found'});
                        }
                    } catch (e) {
                        return res.json({'Status': 'Exception', 'Msg': e.stack});
                    }
                }
            });
        } else {
            res.json({'Status': 'Fail', 'Msg': 'File Not Found'});
        }
    } catch (e) {
        return res.json({'Status': 'Exception', 'Msg': e.stack});
    }
});
router.post('/caller_assign_list/delete_state_allocation/:state', (req, res) => {
    try {
        let file_path = appRoot + "/tmp/lead_assign_caller.json";
        let f_data = req.body.F_data;
        let state = req.params.state;
        let Updated_res;
        let data = req.body.data;
        if (fs.existsSync(file_path)) {
            for (let i = 0; i < f_data.length; i++) {
                if (f_data[i].id == data[0].id) {
                    let index_remove = f_data[i].state_allocation.indexOf(state);
                    if (f_data[i].state_allocation.includes(state)) {
                        f_data[i].state_allocation.splice(index_remove, 1);
                        Updated_res = f_data[i];
                        break;
                    }
                }
            }
            fs.writeFile(file_path, JSON.stringify(f_data), (err) => {
                if (err) {
                    res.json({'Status': 'Fail', "Msg": err});
                } else {
                    res.json({"Status": 'Success', 'Msg': 'Deleted Successfully', "Data": Updated_res});
                }
            });
        } else {
            res.json({'Status': 'Fail', 'Msg': 'File Not Found'});
        }
    } catch (e) {
        res.json({'Status': 'Fail', 'Msg': e.stack});
    }
});
router.post('/caller_assign_list/delete_language/:lang', (req, res) => {
    try {
        let file_path = appRoot + "/tmp/lead_assign_caller.json";
        let f_data = req.body.F_data;
        let Updated_res;
        let data = req.body.data;
        if (fs.existsSync(file_path)) {
            for (let i = 0; i < f_data.length; i++) {
                if (f_data[i].id == data[0].id) {
                    if (f_data[i].language.includes(req.params.lang)) {
                        f_data[i].language.splice(f_data[i].language.indexOf(req.params.lang), 1);
                        Updated_res = f_data[i];
                        break;
                    }
                }
            }
            fs.writeFile(file_path, JSON.stringify(f_data), (err) => {
                if (err) {
                    res.json({'Status': 'Fail', 'Msg': err});
                } else {
                    res.json({'Status': 'Success', 'Data': Updated_res});
                }
            });
        } else {
            res.json({'Status': 'Fail', 'Msg': 'File Not Found'});
        }
    } catch (e) {
        res.json({'Status': "Fail", 'Msg': e.stack});
    }
});
router.post('/get_posp_enquiry_field_visitors',LoadSession,function (req, res,next) {
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
    }
    catch (e) {
        console.error('Exception', 'get_posp_enquiry_field_visitors', e.stack);
        res.json({"Status": "FAIL", "Msg": e.stack});
    }
});
router.get('/get_posp_enquiry_field_visitors/:visitor_id?', function (req, res) {
    try {
        let posp_enquiry_field_visitor = require('../models/posp_enquiry_field_visitor.js');
        let Visitor_Id = req.params.visitor_id - 0 || "";
        let args = {};
        if(Visitor_Id){
            args = {
                "Posp_Enquiry_Field_Visitor_ID":Visitor_Id
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
                        fs.writeFileSync(file_sys_loc_horizon, read_data, {});
                        fs.unlink(oldpath, function (err) {
                            if (err)
                                res.json({'Status': "Fail", 'Msg': "Error in deleting a file", "data": err});
                        });
                        enquiry_field_visitor_obj[formDocFields[i]] = file_web_path_horizon;
                    }
                }
                posp_enquiry_field_visitor.findOneAndUpdate({"Posp_Enquiry_Field_Visitor_ID":posp_Enquiry_Field_Visitor_ID}, {$set: enquiry_field_visitor_obj},{new:true},function (posp_update_err, posp_update_data) {
                    if (posp_update_err) {
                        res.json({"Status": "Fail", "Msg": posp_update_err});
                    } else {
                        res.json({"Status": "Success", "Msg":"Data Updated Successfully." , "Data": posp_update_data});
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
                                    res.json({"Status": "Success", "Msg":"Data Saved Successfully." ,"Data": posp_update_res});
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

//inspection status
router.post('/royalSundaram_update_inspection_status', function (req, res2, next) { 
    let responseObj = req.body;
    try {
                if (responseObj.hasOwnProperty('Request_Post') && responseObj['Request_Post'] != {}) { 
                    let royal_breakin_status = '';
                    let royal_pg_status = '';
                    let email_template = '';
                    let email_sub_status = '';
                    let inspection_status_msg = '';
                    let data = responseObj['Request_Post']?responseObj['Request_Post']:"";

                    if ((data.hasOwnProperty('Quote_id')) && data['Quote_id']!='' && (data.hasOwnProperty('VIRStatus')) &&  (data.hasOwnProperty('Premium')) &&  (data.hasOwnProperty('PaymentLink'))) {
                        if ((data.hasOwnProperty('VIRStatus')) && (data['VIRStatus'] === 'recommended') && (data['PaymentLink'] !== '')) {
                            royal_breakin_status = 'INSPECTION_APPROVED';
                            royal_pg_status = "TRANSACTION_PROCEED";
                            email_template = 'Send_Inspection_Status.html';
                            email_sub_status = 'Successful';
                            Error_Msg = royal_breakin_status;
                        } else if ((data.hasOwnProperty('VIRStatus')) && (data['VIRStatus'] === 'Not recommended')) {
                            royal_breakin_status = 'INSPECTION_REJECTED';
                            royal_pg_status = "TRANSACTION_FAILED"
                            email_template = 'Send_Inspection_Status.html'; //'Send_UnSuccessful_Inspection.html';
                            email_sub_status = 'Unsuccessful';
                            Error_Msg = royal_breakin_status + " : " + Inspection_Remarks;
                        } else {
                            Error_Msg = JSON.stringify(data);
                        }

                                let inspectionSchedules = require(appRoot + '/models/inspection_schedule');
                                let query = {Inspection_Id:data['Quote_id']};
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
                                    let newvalues = {Insurer_Status: "CHECKED", Status: royal_breakin_status ,Pg_Status: royal_pg_status ,Modified_On: today};
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
                                        payment_link = data['PaymentLink']?data['PaymentLink']:"";
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
                                                inspection_status_msg = 'Your Vehicle Inspection has been Rejected. REMARKS : ' + Inspection_Remarks;
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
                                                if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
//                                                    if (dbUserData.Premium_Request['posp_reporting_email_id'].indexOf('@') > -1) {
//                                                        arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
//                                                    }
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
                                              //  emailto = "pkanoagia@gmail.com";   need to remove while LIVE
                                                
                                                objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), dbUserData['PB_CRN']);
                                                res2.json({'Status': "SUCCESS","Msg": Error_Msg});
                                            }
                                            
                                          } catch (e) {
                                            console.error('Exception in royalSundaram_update_inspection_status() for mailing : ', e);
                                            res2.json({'Status': "FAIL","Msg": e});
                                          }
                                           });
                                }
                            });
                        } catch (ex2) {
                            console.error('Exception in royalSundaram_update_inspection_status() for User_Data db details : ', ex2);
                            res2.json({'Status': "FAIL","Msg": ex2});
                        }
                                        }
                                    });
                         } else {
                        Error_Msg = JSON.stringify(data);
                        res2.json({'Status': "FAIL","Msg": Error_Msg});
                    }
                } else {
                    Error_Msg = JSON.stringify(data);
                    res2.json({'Status': "FAIL","Msg": Error_Msg});
                }

    } catch (ex3) {
        console.error('Exception in royalSundaram_update_inspection_status() for User_Data db details : ', ex3);
        res2.json({'Status': "FAIL","Msg": ex3});
    }
});

// royal sundaram update pg data
router.get('/royalSundaram_update_pg_status', function (req, res) {
    try {
        var inspection_schedule = require('../models/inspection_schedule.js')
        let query  = {"Status": {$in: ["INSPECTION_APPROVED"]},"Insurer_Id":10};
            inspection_schedule.find(query, function (err1, dbUsers) {
                if (err1) {
                    res.json({'Status': "FAIL","Msg": err1});
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
    if (ObjRequest.service_url.includes("https")) {
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
    let request_royal = http.request(options, (response_royal) => {
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

router.post('/royalSundaram_update_transaction_status', function (req, res2, next) {
    let objInsurerProduct = req.body;
    let callingService = '';
    let Error_Msg = '';
    let args = {};

    try {
        if (config.environment.name.toString() === 'Production'){
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
                            if(data['quoteStatus'] ==="B" && data['paymentStatus'] === "Accepted"){
                                royalSundaram_pg_status = "TRANS_SUCCESS_WITH_POLICY";
                            }else if(data['quoteStatus'] ==="Q" ){
                                royalSundaram_pg_status = "TRANS_FAIL";
                            }else{
                                royalSundaram_pg_status = "PG_RETURNED";
                            };

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
                                        res2.json({'Status': "SUCCESS","Msg": "PG Updated Success"});
                                    });
                                }
                            });
                                
                        } catch (ex2) {
                            console.error('Exception in royalSundaram_update_transaction_status() for User_Data db details : ', ex2);
                            res2.json({'Status': "FAIL","Msg": ex2});
                        }
                    } else {
                        Error_Msg = JSON.stringify(data);
                        res2.json({'Status': "FAIL","Msg": Error_Msg});
                    }
                } else {
                    Error_Msg = JSON.stringify(data);
                    res2.json({'Status': "FAIL","Msg": Error_Msg});
                }
            });
        }
    } catch (ex3) {
        console.error('Exception in royalSundaram_update_transaction_status() for User_Data db details : ', ex3);
        res2.json({'Status': "FAIL","Msg": ex3});
    }
});
router.post('/PushData/SendMultipleLead', function (req, res) {
    let Client = require('node-rest-client').Client;
    let client = new Client();
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        let objRequest = req.body;
        let post_args = {
            data: objRequest,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        console.error('SendMultipleLead', objRequest);
        let serviceURL = 'http://10.0.0.205:9009/api/PushData/SendMultipleLead';
        client.post(serviceURL, post_args, (pushData, pushDataRes) => {
            if (pushData && pushData.ResultStatus && pushData.ResultStatus === 'Success') {
                res.send({'Status': 'SUCCESS', 'Msg': 'Data Received', 'Data': pushData});
            } else {
                res.send({'Status': 'FAIL', 'Msg': pushData});
            }
        });
    } catch (e) {
        res.send({'Status': 'FAIL', 'Msg': e.stack});
    }
});

router.get('/PushData/UpdateLeadStatus', function (req, res) {
    let Client = require('node-rest-client').Client;
    let client = new Client();
    let objRequest = req.query;
    let LeadId = objRequest.LeadId || "";
    let ServiceId = objRequest.ServiceId || "";
    let LeadStatus = objRequest.LeadStatus || "";
    try {
        console.error('UpdateLeadStatus', objRequest);
        let serviceURL = 'http://10.0.0.205:9009/api/PushData/UpdateLeadStatus?LeadId=' + LeadId + '&ServiceId=' + ServiceId + '&LeadStatus=' + LeadStatus;
        client.get(serviceURL, {}, (updateLeadData, updateLeadRes) => {
            if (updateLeadData && updateLeadData.Status === 'Success') {
                res.send({'Status': 'SUCCESS', 'Msg': 'Data Updated', 'Data': updateLeadData});
            } else {
                res.send({'Status': 'FAIL', 'Msg': updateLeadData});
            }
        });
    } catch (e) {
        res.send({'Status': 'FAIL', 'Msg': e.stack});
    }
});
router.post('/sbi_motor_pdf', function (req, res) {
    try {
        let objRequest = JSON.stringify(req.body);
        var SymKeyBase64 = 'CQuYCxIVNyTOt487084UPBMxhS0XxRE4';
        var ivBase64 = 'w6tmvKzUj6Rg';
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
                "X-IBM-Client-Id": '79de4de3-d258-43b8-a89a-f42924dddb46',
                "X-IBM-Client-Secret": 'lC0eU6gN3sM2mO3vY8xT2nS8sV0rM2xB4xL8uF1uD5lE8jJ1pY'
            }
        };
        if (config.environment.name === 'Production') {
            service_method_urlT = "";
            service_method_url = "";
        } else {
            service_method_urlT = "https://devapi.sbigeneral.in/cld/v1/token";
            service_method_url = "https://devapi.sbigeneral.in/ept/getPDFArgCd";
        }
        client.get(service_method_urlT, argsT, function (dataT, response) {
            console.error("/sbi_motor_pdf ERR_01", dataT);
            console.error("/sbi_motor_pdf ERR_02", response);
            Token = dataT["access_token"];//dataT["accessToken"];
            if (Token !== "") {
                var args = {
                    data: pdf_request,
                    headers: {
                        "Content-Type": "application/json",
                        //"Accept": "application/json",
                        "X-IBM-Client-Id": '79de4de3-d258-43b8-a89a-f42924dddb46',
                        "X-IBM-Client-Secret": 'lC0eU6gN3sM2mO3vY8xT2nS8sV0rM2xB4xL8uF1uD5lE8jJ1pY',
                        "Authorization": "Bearer " + Token
                    }
                };

                console.error("/sbi_motor_pdf ERR_03 :: ", args);
                console.error("/sbi_motor_pdf ERR_04 :: ", service_method_url);
                client.post(service_method_url, args, function (datapdf, response) {
                    console.error("/sbi_motor_pdf ERR_05 :: ", datapdf);
                    console.error("/sbi_motor_pdf ERR_06 :: ", response);
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
                    console.log(typeof ciphertextBase64);
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
                    console.log("originalPlainText", JSON.parse(originalPlainText));
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

let endorsementSubCategoryObj = {
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
}

router.post('/ticket/getEndorsementDetails', function (req, res) {
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
        filter["Status"] = "Open";
        filter["Category"] = req.body.Category;
    if(typeof req.body.SubCategory!=="undefined" && typeof req.body.Product!=="undefined" && typeof req.body.insurer_id!=="undefined"){
        filter["Product"] = parseInt(req.body.Product);
        filter["Insurer_Id"] = parseInt(req.body.insurer_id);
        filter["SubCategory"] = endorsementSubCategoryObj[req.body.SubCategory];
    }
        var days = (req.body.hasOwnProperty('days')) ? req.body.days - 0 : 1;
        const startOfMonth = moment().format('YYYY-MM-DD');
        const currentOfMonth = moment().format('YYYY-MM-DD');
        const startDate = new Date(startOfMonth + "T00:00:00Z");
        const currentDate = new Date(currentOfMonth + "T23:59:59Z");
        //filter["Created_On"] = {$gte: startDate, $lt: currentDate};
        console.error(filter);
        var user_details = require('../models/user_details');
        user_details.paginate(filter, optionPaginate).then(function (dbTicket) {
            res.json(dbTicket);
        });
    } catch (err) {
        console.error(err);
        res.json({'msg': 'error'});
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
                res.send(err);
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
                                    var ins_detail = "edelweiss_data";
                                }
                                if ((getData[0]['_doc']['Insurer_Id']) === 17) {
                                    var ins_detail = "sbigeneral_data";
                                }

                                var insurer_data = JSON.parse(getData[0]['_doc']['Transaction_Data'][ins_detail]);
                                insurer_data['___dbmaster_insurer_vehicle_variant_name___'] = request[i];
                                update_data['Transaction_Data.' + ins_detail] = JSON.stringify(insurer_data);
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
                                throw err;
                            } else {
                                userDataRes = getData[0]['_doc'];
                                var endorsement_ticket_history = require('../models/endorsement_ticket_history');
                                var endorsement_data = {
                                    "CRN": parseInt(objRequest.crn),
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
                                        res.json({'Status': 'Fail'});
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
                                        var ins_name = {
                                            "46": 'Edelweiss',
                                            "17": 'SBI'
                                        };
                                        var email_arg = {
                                            "crn": userDataRes.Erp_Qt_Request_Core['___crn___'],
                                            "contact_name": request['contact_name'],
                                            "email": request['email'],
                                            "product_id": userDataRes.Erp_Qt_Request_Core['___product_id___']
                                        };
                                        var Client = require('node-rest-client').Client;
                                        var client = new Client();
                                        client.post(config.environment.weburl + '/quote/pdf_initiate', args, function (data, response) {
                                            console.log(data);
                                            if (data.hasOwnProperty('Policy')) {
                                                if (data['Policy']['pdf_status'] === "SUCCESS" && data['Policy']['policy_url'] !== "" && data['Policy']['policy_url'] !== undefined) {
                                                    try {
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
                                                    } catch (e) {
                                                        console.error('Exception', 'Success Email', e);
                                                    }
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
                            var ins_detail = "edelweiss_data";
                        }
                        if ((getData[0]['_doc']['Insurer_Id']) === 17) {
                            var ins_detail = "sbigeneral_data";
                        }

                        if ((getData[0]['_doc']).hasOwnProperty('Transaction_Data') && (getData[0]['_doc'])['Transaction_Data'] && (getData[0]['_doc'])['Transaction_Data'].hasOwnProperty(ins_detail)) {
                            var insurer_Data = JSON.parse((getData[0]['_doc'])['Transaction_Data'][ins_detail]);
                            console.log('log');
                            for (var j in insurer_Data) {
                                if ((j.toString()).includes("___dbmaster_insurer_vehicle"))
                                    qtdata[j] = insurer_Data[j];
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
        res.json({'msg': 'error'});
    }
});

router.get('/ticket/getEndorsementList', (req, res) => {
    var filepath=appRoot+'/tmp/Endorsement_data/endorsement.json';
    try{
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
       
        
        res.json({"Status":"SUCCESS","Data":JSON.parse(data)});
    });
} catch(error){
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
}
});

router.post('/ticket/newendoUpdateUserDatas', function (req, res) {
    try {
        let userDataRes = "";
        var objRequest = req.body;
        var arg = {
            "PB_CRN": objRequest['crn'] - 0,
            "Last_Status": /.*TRANS_SUCCESS.*/
        };
        User_Data.find(arg, function (err, getData) {
            if (err) {
                res.json({Status: 'Error', Msg: err.stack});
            } else {
                if (getData.length > 0) {
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
                        "permanent_city": "",
                        "permanent_pincode": "",
                        "is_reg_addr_comm_addr_same": "",
                        "communication_address_1": "",
                        "communication_address_2": "",
                        "communication_address_3": "",
                        "communication_city": "",
                        "communication_pincode": "",
                        "nominee_name": "",
                        "nominee_first_name": "",
                        "nominee_last_name": "",
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
                        "financial_institute_city": "",
                        "policy_number":""
                    };
                    for (var k in erpqt_data) {
                        qtdata[k] = data['___' + k + '___'] ? data['___' + k + '___'] : "";
                    }
                    qtdata["policy_number"] = getData[0]['_doc']['Transaction_Data'] ? getData[0]['_doc']['Transaction_Data']['policy_number'] : "NA";
                    res.json(qtdata);
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
router.post("/fatakpay/eligibility_check_api_NIU", function (req, res) {
    try {
	    let fatakpay_details = require('../models/fatakpay_detail');
        let fatakpay_history = require('../models/fatakpay_history');
        req.body = JSON.parse(JSON.stringify(req.body));
        let objRequest = req.body;
		let dbg = objRequest.dbg || "no";
        let currentTimestamp = Date.now();
        let formattedDate = moment(currentTimestamp).format('YYYY-MM-DD HH:mm:ss');
        /* let auth_token_url = (config.environment.name === "Production") ? "https://uatonboardingapi.fatakpay.com/o/token/" : "https://uatonboardingapi.fatakpay.com/o/token/";
        let token_args = {
            data: {
                "client_id": (config.environment.name === "Production") ? "bHNrAqgdLy5aZ0d3GKtxRkNhAOxyMjTncl0Saeje" : "bHNrAqgdLy5aZ0d3GKtxRkNhAOxyMjTncl0Saeje",
                "username": (config.environment.name === "Production") ? "PolicyBoss" : "PolicyBoss",
                "password": (config.environment.name === "Production") ? "test@123" : "test@123",
                "grant_type": (config.environment.name === "Production") ? "password" : "password",
                "client_secret": (config.environment.name === "Production") ? "rsxT8aYZRLi3fKV2u6tNKm0UWcQRHQqgP9u4zM4qOV0zFDhFTsMqHXa84yfw8YVKJ8aGeopFh419kDahdRBc6CMG7wPro527U5Sxl9gMGVmGBp6OGrTFt5ZNC0z12O06" : "rsxT8aYZRLi3fKV2u6tNKm0UWcQRHQqgP9u4zM4qOV0zFDhFTsMqHXa84yfw8YVKJ8aGeopFh419kDahdRBc6CMG7wPro527U5Sxl9gMGVmGBp6OGrTFt5ZNC0z12O06"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }; */
        let auth_token_url = (config.environment.name === "Production") ? "https://uatonboardingapi.fatakpay.com/external-api/v1/create-user-token" : "https://uatonboardingapi.fatakpay.com/external-api/v1/create-user-token";
        let token_args = {
            data: {
                "username": (config.environment.name === "Production") ? "PolicyBossMerchant" : "PolicyBossMerchant",
                "password": (config.environment.name === "Production") ? "070939e365f9d6060fd2" : "070939e365f9d6060fd2"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        function jsonToQueryString(json) {
            return Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
        }
         var req_data = {
                "consent_timestamp": formattedDate,
                "mobile": (objRequest['mobile'] - 0),
                "first_name": objRequest['first_name'],
                "last_name": objRequest['last_name'],
                "email": objRequest['email'],
                "employment_type_id": objRequest['employment_type_id'],
                "pan": objRequest['pan'],
                "dob": moment(objRequest['dob'], "DD-MM-YYYY").format('YYYY-MM-DD'),
                "pincode": (objRequest['pincode'] - 0),
                "home_address": objRequest['home_address'], //data['communication_address_1'],
                "office_address": objRequest['office_address'],
                "emp_code": objRequest['emp_code'], // data not available - AB04589
                "purchase_amount": (objRequest['premium_amount'] - 0),
                "type_of_residence": objRequest['type_of_residence'], // data not available - Owned
                "company_name": objRequest['company_name'], // data not available - ANB
                "product_type": objRequest['product_type'],
                "consent": objRequest['consent']
            };
            var LM_Data = {
                "PB_CRN": parseInt(objRequest.crn),
                "User_Data_Id": parseInt(objRequest.udid),
                "Proposal_Id": parseInt(objRequest.proposal_id),
                "Insurer_Id": parseInt(objRequest.insurer_id),
                "Application_Loan_Id": null,
                "Premium_Amount": objRequest.premium_amount,
                "Request_Core": req_data,
                "Response_Core": null,
                "Tenure": 0,
                "Status": 'Pending',
                "RedirectURL": ""
            };
        token_args.data = jsonToQueryString(token_args.data);
        client.post(auth_token_url, token_args, function (auth_token_data, auth_token_response) {
            // if (auth_token_data.access_token) {
            //     let auth_token = auth_token_data.access_token || "";
            if (auth_token_data.success && auth_token_data.hasOwnProperty('data') && auth_token_data.data.token) {
                let auth_token = auth_token_data.data.token || "";
                let eligibility_check_url = (config.environment.name === "Production") ? "https://uatonboardingapi.fatakpay.com/external-api/v1/emi-insurance-eligibility" : "https://uatonboardingapi.fatakpay.com/external-api/v1/emi-insurance-eligibility";
                let eligibilty_args = {
                    data: req_data,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + auth_token
                    }
                };
                client.post(eligibility_check_url, eligibilty_args, function (eligibility_check_data, eligibility_check_response) {
                    let eligibility_response = eligibility_check_data;
					
					if (dbg === "yes") {
                            eligibility_response = {
                                "success" : true,
                                "status_code" : 200,
                                "message" : "You are eligible.",
                                "data" : {
                                    "eligibility_status" : true,
                                    "max_eligibility_amount" : 5797,
                                    "loan_application_id" : 45631,
                                    "max_amount" : null,
                                    "product_type" : "EMI",
                                    "eligibility_expiry_date" : "2024-05-31",
                                    "processing_fees" : 708,
                                    "min_interest" : "24",
                                    "max_interest" : "24",
                                    "scheduler" : [ 
                                        {
                                            "months" : 3,
                                            "emi_amount" : 2010.14,
                                            "bifurcation" : [ 
                                                {
                                                    "principal" : 1894.2,
                                                    "interest" : 115.94,
                                                    "emi_date" : "2024-07-05"
                                                }, 
                                                {
                                                    "principal" : 1932.08,
                                                    "interest" : 78.06,
                                                    "emi_date" : "2024-08-05"
                                                }, 
                                                {
                                                    "principal" : 1970.73,
                                                    "interest" : 39.41,
                                                    "emi_date" : "2024-09-05"
                                                }
                                            ]
                                        }, 
                                        {
                                            "months" : 6,
                                            "emi_amount" : 1034.91,
                                            "bifurcation" : [ 
                                                {
                                                    "principal" : 918.97,
                                                    "interest" : 115.94,
                                                    "emi_date" : "2024-07-05"
                                                }, 
                                                {
                                                    "principal" : 937.35,
                                                    "interest" : 97.56,
                                                    "emi_date" : "2024-08-05"
                                                }, 
                                                {
                                                    "principal" : 956.1,
                                                    "interest" : 78.81,
                                                    "emi_date" : "2024-09-05"
                                                }, 
                                                {
                                                    "principal" : 975.22,
                                                    "interest" : 59.69,
                                                    "emi_date" : "2024-10-05"
                                                }, 
                                                {
                                                    "principal" : 994.72,
                                                    "interest" : 40.19,
                                                    "emi_date" : "2024-11-05"
                                                }, 
                                                {
                                                    "principal" : 1014.64,
                                                    "interest" : 20.29,
                                                    "emi_date" : "2024-12-05"
                                                }
                                            ]
                                        }, 
                                        {
                                            "months" : 9,
                                            "emi_amount" : 710.22,
                                            "bifurcation" : [ 
                                                {
                                                    "principal" : 594.28,
                                                    "interest" : 115.94,
                                                    "emi_date" : "2024-07-05"
                                                }, 
                                                {
                                                    "principal" : 606.17,
                                                    "interest" : 104.05,
                                                    "emi_date" : "2024-08-05"
                                                }, 
                                                {
                                                    "principal" : 618.29,
                                                    "interest" : 91.93,
                                                    "emi_date" : "2024-09-05"
                                                }, 
                                                {
                                                    "principal" : 630.65,
                                                    "interest" : 79.57,
                                                    "emi_date" : "2024-10-05"
                                                }, 
                                                {
                                                    "principal" : 643.27,
                                                    "interest" : 66.95,
                                                    "emi_date" : "2024-11-05"
                                                }, 
                                                {
                                                    "principal" : 656.13,
                                                    "interest" : 54.09,
                                                    "emi_date" : "2024-12-05"
                                                }, 
                                                {
                                                    "principal" : 669.26,
                                                    "interest" : 40.96,
                                                    "emi_date" : "2025-01-05"
                                                }, 
                                                {
                                                    "principal" : 682.64,
                                                    "interest" : 27.58,
                                                    "emi_date" : "2025-02-05"
                                                }, 
                                                {
                                                    "principal" : 696.31,
                                                    "interest" : 13.93,
                                                    "emi_date" : "2025-03-05"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            };
                        }
						
                    let eligibility_response_json = {};
                    LM_Data['Response_Core'] = eligibility_response;
                    if(eligibility_response.status_code === 500) {
                        eligibility_response["Status"] = "FAIL";
                        eligibility_response['Msg'] = "Internal Server Error From Fatakpay eligibility_check_api";
                        eligibility_response_json = eligibility_response;
                    } else {
                        if (eligibility_response && eligibility_response.success && eligibility_response.success === true) {
                            eligibility_response_json["Status"] = "SUCCESS";
                                LM_Data['Application_Loan_Id'] = eligibility_response.data.loan_application_id  || "0";
                                eligibility_response_json["Msg"] = "DATA FETCH SUCCESSFULLY";
                                LM_Data['Tenure'] = eligibility_response['data']['tenure'];
                        } else {
                            eligibility_response_json["Status"] = "FAIL";
                            eligibility_response_json["Msg"] = "DATA NOT FOUND";
                        }
                        eligibility_response_json["Data"] = eligibility_response;
                    }  
					console.error("Fatakpay Details", LM_Data);
                    fatakpay_details.find({ PB_CRN: objRequest.crn, User_Data_Id: objRequest.udid }, function (err, fatakPay_data) {
                        if (err) {
                            console.error('Error in eligibility_check_api Service', err);
                        } else {
                            if (fatakPay_data.length > 0) {
                                if (eligibility_response_json["Status"] === 'SUCCESS') {
                                    fatakpay_details.updateOne({ PB_CRN: objRequest.crn, User_Data_Id: objRequest.udid }, { $set: { 'Status': 'ELIGIBLE', 'Modified_On': Date.now() } }, function (err, numAffected) {
                                        if (err) {
                                            console.error('Error in eligible api service', err);
                                        }
                                    });
                                }
                            } else {
                                LM_Data['Fatakpay_Status'] = eligibility_response['data'].hasOwnProperty('eligibility_status') && eligibility_response['data'].eligibility_status  === true ? "ELIGIBLE" : "PENDING";
                                let saveFatakpayDetails = new fatakpay_details(LM_Data);
                                saveFatakpayDetails.save(function (err, objDbFatakpayDetails) {
                                    if (err) {
                                        console.error('Error in eligibility_check_api service while storing data', err);
                                    }
                                });
                            }
                        }
                    });
                    try {
                        var today = moment().utcOffset("+05:30");
                        var today_str = moment(today).format("YYYYMMD");
                        fs.appendFile(appRoot + "/tmp/log/fatakpay_log_$" + today_str + ".log", JSON.stringify(objRequest, eligibility_response) + "\r\n", function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log("The file was saved!");
                        });
                    } catch (ex) {
                        console.error({ "Status": "FAIL", "Msg": "LOGS NOT CREATED", "Data": ex.stack });
                    }
                    LM_Data['Status'] = `Eligible_${eligibility_response_json["Status"]}`;
                    let saveFatakpayHistory = new fatakpay_history(LM_Data);
                    saveFatakpayHistory.save(function (err, objDbFatakpayHistory) {
                        if (err) {
                            console.error('Error in eligibility_check_api service while storing data in fatakpay history', err);
                        }
                    });
                    res.send(eligibility_response_json);
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "AUTH TOKEN NOT GENERATED", "Data": auth_token_data});
            }
        });
    } catch (ex) {
        res.json({"Status": "FAIL", "Msg": ex.stack});
    }
});

router.post("/fatakpay/eligibility_check_api", function (req, res) {
    try {
        let request = require('request');
        let fatakpay_details = require('../models/fatakpay_detail');
        let fatakpay_history = require('../models/fatakpay_history');
        req.body = JSON.parse(JSON.stringify(req.body));
        let objRequest = req.body;
        let dbg = objRequest.dbg || "no";
        let currentTimestamp = Date.now();
        let formattedDate = moment(currentTimestamp).format('YYYY-MM-DD HH:mm:ss');
        let auth_token_url = (config.environment.name === "Production") ? "https://uatonboardingapi.fatakpay.com/external-api/v1/create-user-token" : "https://uatonboardingapi.fatakpay.com/external-api/v1/create-user-token";
        let token_args = {
            data: {
                "username": (config.environment.name === "Production") ? "PolicyBossMerchant" : "PolicyBossMerchant",
                "password": (config.environment.name === "Production") ? "070939e365f9d6060fd2" : "070939e365f9d6060fd2"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        function jsonToQueryString(json) {
            return Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                        encodeURIComponent(json[key]);
            }).join('&');
        }
        var req_data = {
            "consent_timestamp": formattedDate,
            "mobile": (objRequest['mobile'] - 0),
            "first_name": objRequest['first_name'],
            "last_name": objRequest['last_name'],
            "email": objRequest['email'],
            "employment_type_id": objRequest['employment_type_id'],
            "pan": objRequest['pan'],
            "dob": moment(objRequest['dob'], "DD-MM-YYYY").format('YYYY-MM-DD'),
            "pincode": 400093,
            "home_address": objRequest['home_address'], //data['communication_address_1'],
            "office_address": objRequest['office_address'],
            "emp_code": objRequest['emp_code'], // data not available - AB04589
            "purchase_amount": (objRequest['premium_amount'] - 0),
            "type_of_residence": objRequest['type_of_residence'], // data not available - Owned
            "company_name": objRequest['company_name'], // data not available - ANB
            "product_type": objRequest['product_type'],
            "consent": objRequest['consent']
        };
        var LM_Data = {
            "PB_CRN": parseInt(objRequest.crn),
            "User_Data_Id": parseInt(objRequest.udid),
            "Proposal_Id": parseInt(objRequest.proposal_id),
            "Insurer_Id": parseInt(objRequest.insurer_id),
            "Application_Loan_Id": null,
            "Premium_Amount": objRequest.premium_amount,
            "Request_Core": req_data,
            "Response_Core": null,
            "Tenure": 0,
            "Status": 'Pending',
            "RedirectURL": ""
        };
        token_args.data = jsonToQueryString(token_args.data);
        request.post({ url: auth_token_url, form: token_args.data }, (auth_token_error, auth_token_response, auth_token_data) => {
            if (auth_token_error) {
                res.json({"Status": "FAIL", "Msg": "AUTH TOKEN NOT GENERATED", "Data": auth_token_error});
            } else {
                auth_token_data = JSON.parse(auth_token_data);
                if (auth_token_data.success && auth_token_data.hasOwnProperty('data') && auth_token_data.data.token) {
                    let auth_token = auth_token_data.data.token || "";
                    let eligibility_check_url = (config.environment.name === "Production") ? "https://uatonboardingapi.fatakpay.com/external-api/v1/emi-insurance-eligibility" : "https://uatonboardingapi.fatakpay.com/external-api/v1/emi-insurance-eligibility";
                    let eligibilty_args = {
                        data: req_data,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Token " + auth_token
                        }
                    };
                    client.post(eligibility_check_url, eligibilty_args, function (eligibility_check_data, eligibility_check_response) {
                        let eligibility_response = eligibility_check_data;
                        if (dbg === "yes") {
                            eligibility_response = {
                                "success" : true,
                                "status_code" : 200,
                                "message" : "You are eligible.",
                                "data" : {
                                    "eligibility_status" : true,
                                    "max_eligibility_amount" : 5797,
                                    "loan_application_id" : 45631,
                                    "max_amount" : null,
                                    "product_type" : "EMI",
                                    "eligibility_expiry_date" : "2024-05-31",
                                    "processing_fees" : 708,
                                    "min_interest" : "24",
                                    "max_interest" : "24",
                                    "scheduler" : [ 
                                        {
                                            "months" : 3,
                                            "emi_amount" : 2010.14,
                                            "bifurcation" : [ 
                                                {
                                                    "principal" : 1894.2,
                                                    "interest" : 115.94,
                                                    "emi_date" : "2024-07-05"
                                                }, 
                                                {
                                                    "principal" : 1932.08,
                                                    "interest" : 78.06,
                                                    "emi_date" : "2024-08-05"
                                                }, 
                                                {
                                                    "principal" : 1970.73,
                                                    "interest" : 39.41,
                                                    "emi_date" : "2024-09-05"
                                                }
                                            ]
                                        }, 
                                        {
                                            "months" : 6,
                                            "emi_amount" : 1034.91,
                                            "bifurcation" : [ 
                                                {
                                                    "principal" : 918.97,
                                                    "interest" : 115.94,
                                                    "emi_date" : "2024-07-05"
                                                }, 
                                                {
                                                    "principal" : 937.35,
                                                    "interest" : 97.56,
                                                    "emi_date" : "2024-08-05"
                                                }, 
                                                {
                                                    "principal" : 956.1,
                                                    "interest" : 78.81,
                                                    "emi_date" : "2024-09-05"
                                                }, 
                                                {
                                                    "principal" : 975.22,
                                                    "interest" : 59.69,
                                                    "emi_date" : "2024-10-05"
                                                }, 
                                                {
                                                    "principal" : 994.72,
                                                    "interest" : 40.19,
                                                    "emi_date" : "2024-11-05"
                                                }, 
                                                {
                                                    "principal" : 1014.64,
                                                    "interest" : 20.29,
                                                    "emi_date" : "2024-12-05"
                                                }
                                            ]
                                        }, 
                                        {
                                            "months" : 9,
                                            "emi_amount" : 710.22,
                                            "bifurcation" : [ 
                                                {
                                                    "principal" : 594.28,
                                                    "interest" : 115.94,
                                                    "emi_date" : "2024-07-05"
                                                }, 
                                                {
                                                    "principal" : 606.17,
                                                    "interest" : 104.05,
                                                    "emi_date" : "2024-08-05"
                                                }, 
                                                {
                                                    "principal" : 618.29,
                                                    "interest" : 91.93,
                                                    "emi_date" : "2024-09-05"
                                                }, 
                                                {
                                                    "principal" : 630.65,
                                                    "interest" : 79.57,
                                                    "emi_date" : "2024-10-05"
                                                }, 
                                                {
                                                    "principal" : 643.27,
                                                    "interest" : 66.95,
                                                    "emi_date" : "2024-11-05"
                                                }, 
                                                {
                                                    "principal" : 656.13,
                                                    "interest" : 54.09,
                                                    "emi_date" : "2024-12-05"
                                                }, 
                                                {
                                                    "principal" : 669.26,
                                                    "interest" : 40.96,
                                                    "emi_date" : "2025-01-05"
                                                }, 
                                                {
                                                    "principal" : 682.64,
                                                    "interest" : 27.58,
                                                    "emi_date" : "2025-02-05"
                                                }, 
                                                {
                                                    "principal" : 696.31,
                                                    "interest" : 13.93,
                                                    "emi_date" : "2025-03-05"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            };
                        }
                        let eligibility_response_json = {};
                        LM_Data['Response_Core'] = eligibility_response;
                        if (eligibility_response.status_code === 500) {
                            eligibility_response["Status"] = "FAIL";
                            eligibility_response['Msg'] = "Internal Server Error From Fatakpay eligibility_check_api";
                            eligibility_response_json = eligibility_response;
                        } else {
                            if (eligibility_response && eligibility_response.success && eligibility_response.success === true) {
                                eligibility_response_json["Status"] = "SUCCESS";
                                LM_Data['Application_Loan_Id'] = eligibility_response.data.loan_application_id;
                                eligibility_response_json["Msg"] = "DATA FETCH SUCCESSFULLY";
                                LM_Data['Tenure'] = eligibility_response['data']['tenure'];
                            } else {
                                eligibility_response_json["Status"] = "FAIL";
                                eligibility_response_json["Msg"] = "DATA NOT FOUND";
                            }
                            eligibility_response_json["Data"] = eligibility_response;
                        }
                        fatakpay_details.find({PB_CRN: objRequest.crn, User_Data_Id: objRequest.udid}, function (err, fatakPay_data) {
                            if (err) {
                                console.error('Error in eligibility_check_api Service', err);
                            } else {
                                if (fatakPay_data.length > 0) {
                                    if (eligibility_response_json["Status"] === 'SUCCESS') {
                                        fatakpay_details.updateOne({PB_CRN: objRequest.crn, User_Data_Id: objRequest.udid}, {$set: {'Fatakpay_Status': 'Eligible', 'Modified_On': Date.now()}}, function (err, numAffected) {
                                            if (err) {
                                                console.error('Error in eligible api service', err);
                                            }
                                        });
                                    }
                                } else {
                                    let saveDetails = {
                                        "PB_CRN": parseInt(objRequest.crn),
                                        "User_Data_Id": parseInt(objRequest.udid),
                                        "Proposal_Id": parseInt(objRequest.proposal_id),
                                        "Insurer_Id": parseInt(objRequest.insurer_id),
                                        "Application_Loan_Id": parseInt(eligibility_response.data.loan_application_id),
                                        "Premium_Amount": objRequest.premium_amount,
                                        "Tenure": 0,
                                        "Fatakpay_Status": 'PENDING',
                                        "RedirectURL": ""
                                    }
                                    saveDetails['Fatakpay_Status'] = eligibility_response['data'].hasOwnProperty('eligibility_status') && eligibility_response['data'].eligibility_status === true ? "ELIGIBLE" : "PENDING";
                                    let saveFatakpayDetails = new fatakpay_details(saveDetails);
                                    saveFatakpayDetails.save(function (err, objDbFatakpayDetails) {
                                        if (err) {
                                            console.error('Error in eligibility_check_api service while storing data', err);
                                        }
                                    });
                                }
                            }
                        });
                        try {
                            var today = moment().utcOffset("+05:30");
                            var today_str = moment(today).format("YYYYMMD");
                            fs.appendFile(appRoot + "/tmp/log/fatakpay_log_$" + today_str + ".log", JSON.stringify(objRequest, eligibility_response) + "\r\n", function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                                console.log("The file was saved!");
                            });
                        } catch (ex) {
                            console.error({"Status": "FAIL", "Msg": "LOGS NOT CREATED", "Data": ex.stack});
                        }
                        LM_Data['Status'] = `Eligible_${eligibility_response_json["Status"]}`;
                        let saveFatakpayHistory = new fatakpay_history(LM_Data);
                        saveFatakpayHistory.save(function (err, objDbFatakpayHistory) {
                            if (err) {
                                console.error('Error in eligibility_check_api service while storing data in fatakpay history', err);
                            }
                        });
                        res.send(eligibility_response_json);
                    });
                } else {
                    res.json({"Status": "FAIL", "Msg": "AUTH TOKEN NOT GENERATED", "Data": auth_token_data});
                }
            }
        })
    } catch (ex) {
        res.json({"Status": "FAIL", "Msg": ex.stack});
    }
});
router.post("/fatakpay/insurance_redirection", function (req, res) {
	let fatakpay_details = require('../models/fatakpay_detail');
	let fatakpay_history = require('../models/fatakpay_history');
    let objResponseSummary = {
        "Status": "",
        "Msg": "",
        "Data": ""
    };
    let redirect_response;
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        let objRequest = req.body;
        /* let auth_token_url = (config.environment.name === "Production") ? "https://uatonboardingapi.fatakpay.com/o/token/" : "https://uatonboardingapi.fatakpay.com/o/token/";
        let token_args = {
            data: {
                "client_id": (config.environment.name === "Production") ? "bHNrAqgdLy5aZ0d3GKtxRkNhAOxyMjTncl0Saeje" : "bHNrAqgdLy5aZ0d3GKtxRkNhAOxyMjTncl0Saeje",
                "username": (config.environment.name === "Production") ? "PolicyBoss" : "PolicyBoss",
                "password": (config.environment.name === "Production") ? "test@123" : "test@123",
                "grant_type": (config.environment.name === "Production") ? "password" : "password",
                "client_secret": (config.environment.name === "Production") ? "rsxT8aYZRLi3fKV2u6tNKm0UWcQRHQqgP9u4zM4qOV0zFDhFTsMqHXa84yfw8YVKJ8aGeopFh419kDahdRBc6CMG7wPro527U5Sxl9gMGVmGBp6OGrTFt5ZNC0z12O06" : "rsxT8aYZRLi3fKV2u6tNKm0UWcQRHQqgP9u4zM4qOV0zFDhFTsMqHXa84yfw8YVKJ8aGeopFh419kDahdRBc6CMG7wPro527U5Sxl9gMGVmGBp6OGrTFt5ZNC0z12O06"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }; */
        let auth_token_url = (config.environment.name === "Production") ? "https://uatonboardingapi.fatakpay.com/external-api/v1/create-user-token" : "https://uatonboardingapi.fatakpay.com/external-api/v1/create-user-token";
        let token_args = {
            data: {
                "username": (config.environment.name === "Production") ? "PolicyBossMerchant" : "PolicyBossMerchant",
                "password": (config.environment.name === "Production") ? "070939e365f9d6060fd2" : "070939e365f9d6060fd2"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        function jsonToQueryString(json) {
            return Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
        }
          var req_data = {
                "application": (objRequest['application'] - 0),
                "payment_link": objRequest['payment_link'],
                "tenure": (objRequest['tenure'] - 0)
            };
            var LM_Data = {
                "PB_CRN": parseInt(objRequest.crn),
                "User_Data_Id": parseInt(objRequest.udid),
                "Proposal_Id": parseInt(objRequest.proposal_id),
                "Insurer_Id": parseInt(objRequest.insurer_id),
                "Application_Loan_Id": objRequest['application'],
                "Premium_Amount": objRequest.premium_amount,
                "Request_Core": req_data,
                "Response_Core": null,
                "Tenure": objRequest['tenure'],
                "Status": '',
                "RedirectURL": ""
            };
        token_args.data = jsonToQueryString(token_args.data);
        client.post(auth_token_url, token_args, function (auth_token_data, auth_token_response) {
            // if (auth_token_data.access_token) {
            //     let auth_token = auth_token_data.access_token || "";
            if (auth_token_data.success && auth_token_data.hasOwnProperty('data') && auth_token_data.data.token) {
                let auth_token = auth_token_data.data.token || "";
                let insurance_redirect_url = (config.environment.name === "Production") ? "https://uatonboardingapi.fatakpay.com/external-api/v1/emi-insurance-redirection" : "https://uatonboardingapi.fatakpay.com/external-api/v1/emi-insurance-redirection";
                let insurance_redirect_request = {
                    data: req_data,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + auth_token
                    }
                };
                insurance_redirect_request.data = jsonToQueryString(insurance_redirect_request.data);
                client.post(insurance_redirect_url, insurance_redirect_request, function (insurance_redirect_data, insurance_redirect_response) {
                    redirect_response = insurance_redirect_data;
                    LM_Data['Response_Core'] = redirect_response
                    LM_Data['RedirectURL'] = redirect_response && redirect_response.data && redirect_response.data.redirection_url || "";
                    if (redirect_response['success'] && redirect_response['status_code'] == 200) {                        
                        fatakpay_details.find({PB_CRN: objRequest.crn, User_Data_Id: objRequest.udid}, function (err, fatakPay_data) {
                            if (err) {
                                console.error('Error in insurance_redirection Service', err);
                            } else {
                                fatakpay_details.updateOne({PB_CRN: objRequest.crn, User_Data_Id: objRequest.udid}, {$set: {'Status': 'REDIRECTED', 'RedirectURL': redirect_response['data']['redirection_url'], 'Modified_On': Date.now()}}, function (err, numAffected) {
                                    if (err) {
                                        console.error('Error in eligible api service', err);
                                    }
                                });
                            }
                        });
                        objResponseSummary['Status'] = "SUCCESS";
                        objResponseSummary['Msg'] = "Data Found";
                        objResponseSummary['Data'] = redirect_response;
                    } else {
                        fatakpay_details.updateOne({PB_CRN: objRequest.crn, User_Data_Id: objRequest.udid}, {$set: {'Status': 'Redirected_Fail', 'Modified_On': Date.now()}}, function (err, numAffected) {
                            if (err) {
                                console.error('Error in eligible api service', err);
                            }
                        });
                        objResponseSummary['Status'] = "FAIL";
                        objResponseSummary['Msg'] = "Data Not Found";
                        objResponseSummary['Data'] = redirect_response;
                    }
                    LM_Data['Status'] = `Redirected_${objResponseSummary['Status']}`;
                    let saveFatakpayHistory = new fatakpay_history(LM_Data);
                    saveFatakpayHistory.save(function (err, objDbFatakpayHistory) {
                        if (err) {
                            console.error('Error in insurance_redirection service while storing data in fatakpay history', err);
                        }
                    });
                    res.send(objResponseSummary);
                });
            } else {
                objResponseSummary['Status'] = "FAIL";
                objResponseSummary['Msg'] = "AUTH TOKEN NOT GENERATED";
                objResponseSummary['Data'] = auth_token_data;
                res.send(objResponseSummary);
            }
        });
    } catch (e) {
        console.error("Exception in /fatakpay/insurance_redirection", e.stack);
        res.send({'Status': 'FAIL', 'Msg': 'Exception in /fatakpay/insurance_redirection service', 'Data': e.stack});
    }
});
router.post("/brand_promotion/save_data", function (req, res) {
    var Brand_Promotion = require('../models/brand_promotion');
    let objResponseSummary = {
        "Status": "",
        "Msg": "",
        "Data": ""
    };
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        let objRequest = req.body;
        let currentTimestamp = Date.now();
        let formattedDate = moment(currentTimestamp).format('HH:mm:ss');
        var save_data = {
            "Mobile_Number": objRequest['mobile'],
            "Consent_Date": moment(currentTimestamp).format('DD-MM-YYYY'),
            "Consent_Timestamp": formattedDate,
            "IP_Address": req.pbIp || "",
            "Modified_On": Date.now(),
            "Product_Id": objRequest['product_id'],
            "Name": objRequest['name']
        };
        let saveBrandPromotion = new Brand_Promotion(save_data);
        saveBrandPromotion.save(function (err, objDbBrandPromotion) {
            if (err) {
                objResponseSummary['Status'] = 'FAIL';
                objResponseSummary['Data'] = err;
                objResponseSummary['Msg'] = 'Error in saving Data';
            } else {
                objResponseSummary['Status'] = 'SUCCESS';
                objResponseSummary['Data'] = objDbBrandPromotion;
                objResponseSummary['Msg'] = 'Data Saved Successfully';
            }
            res.send(objResponseSummary);
        });

    } catch (e) {
        res.send({'Status': 'FAIL', 'Msg': 'Exception in brand_promotion/save_data', 'Data': e.stack})
    }
});
router.get('/create/token', function (req, res) {
    let jwt_ACCESS_TOKEN = 'POLICYBOSS-QA-ACCESS-CNTP6NYE-SH1IS4DOVHB9';
    let jwt_ACCESS_TIME = '5s';
    try {
        let jwt = require('jsonwebtoken');
        let secret_key ='POLICYBOSS-QA-ACCESS-SECRET-CNTP6NYE-SH1IS4DOVHB9';
        let access_token = jwt.sign({ sub: secret_key }, jwt_ACCESS_TOKEN, { expiresIn: jwt_ACCESS_TIME });
        res.send({ 'Status': 'SUCCESS', 'access_token': access_token });
    } catch (err) {
        res.send({ 'Status': 'FAIL', 'Msg': 'Not able to generate token', 'Data': err.stack });
    }
});
router.post('/posp_pre_series/update', function (req, res) {
    let objSummary = {};
    try {
        var posp_pre_series = require('../models/posp_pre_series');
        req.body = JSON.parse(JSON.stringify(req.body));
        let objRequest = req.body;
        let is_allow = true;
        let arr_msg = [];
        let error_msg = "";
        let findQuery = {};
        if (objRequest && objRequest.user_id && objRequest.source) {
            findQuery['User_Id'] = objRequest.user_id - 0;
            let updateObj = {
                'Modified_On': moment().format('YYYY-MM-DDTHH:mm:ss')
            };
            if (objRequest.source === 'ACTIVATED') {
                if (objRequest && objRequest.activated_by) {
                    updateObj['is_activated'] = 'Yes';
                    updateObj['Activated_By'] = objRequest.activated_by - 0 || '';
                    updateObj['Activated_On'] = moment().format('YYYY-MM-DDTHH:mm:ss');
                    updateObj['Status'] = objRequest.source;
                    findQuery['is_activated'] = { $ne: 'Yes' };
                } else {
                    arr_msg.push("RM SS_ID :: MISSING");
                }
            } else if (objRequest.source === 'ONBOARDED') {
                updateObj['is_onboard'] = 'Yes';
                updateObj['Name'] = objRequest.name || '';
                updateObj['Email'] = objRequest.email || '';
                updateObj['Mobile'] = objRequest.mobile - 0 || '';
                updateObj['Ss_Id'] = objRequest.ss_id - 0 || '';
                updateObj['Status'] = objRequest.source;
                updateObj['Onboarded_On'] = moment().format('YYYY-MM-DDTHH:mm:ss');
                findQuery['is_onboard'] = { $ne: 'Yes' };
            } else if (objRequest.source === 'SALE') {
                updateObj['is_sale'] = 'Yes';
                updateObj['Status'] = objRequest.source;
            } else if (objRequest.source === "ONLOAD") {
                updateObj['utm_campaign'] = objRequest.utm_campaign || "";
                updateObj['utm_medium'] = objRequest.utm_medium || "";
                updateObj['utm_source'] = objRequest.utm_source || "";
                findQuery['utm_campaign'] = { $eq: "" };
                findQuery['utm_medium'] = { $eq: "" };
                findQuery['utm_source'] = { $eq: "" };
            } else {
                arr_msg.push("SOURCE :: INVALID");
            }
            if (arr_msg.length > 0) {
                is_allow = false;
                error_msg = arr_msg.join(", ");
            }
            if (is_allow) {
                posp_pre_series.findOneAndUpdate(findQuery, { $set: updateObj }, { new: true }, function (err, updatedPospPre) {
                    if (err) {
                        objSummary['Status'] = 'FAIL';
                        objSummary['Msg'] = 'RECORD NOT FOUND';
                        objSummary['Data'] = err;
                        res.json(objSummary);
                    } else {
                        if (updatedPospPre) {
                            if (objRequest.source === "ONLOAD") {
                                objSummary['Status'] = 'SUCCESS';
                                objSummary['Msg'] = 'RECORD SUCCESSFULLY UPDATED';
                                objSummary['Data'] = updatedPospPre;
                                res.json(objSummary);
                            } else {
                                let pospPreMailUpdate_req = {
                                    source: objRequest.source,
                                    user_id: objRequest.user_id,
                                    name: updatedPospPre.Name || '',
                                    mobile: updatedPospPre.Mobile || '',
                                    ss_id: updatedPospPre.Ss_Id || '',
                                    email: objRequest.email || updatedPospPre.Email,
                                    activated_by: objRequest.activated_by - 0 || updatedPospPre.Activated_By,
                                    created_on: updatedPospPre.Created_On || ''
                                };
                                let pospPreMailUpdate_args = {
                                    data: pospPreMailUpdate_req,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                };
                                client.post(config.environment.weburl + "/posp_pre_series/update_mail", pospPreMailUpdate_args, function (mail_data, mail_response) {
                                    if (mail_data && mail_data.Status === 'SUCCESS') {
                                        objSummary['Status'] = 'SUCCESS';
                                        objSummary['Msg'] = 'RECORD SUCCESSFULLY UPDATED AND MAILED';
                                        objSummary['Data'] = updatedPospPre;
                                        res.json(objSummary);
                                    } else {
                                        objSummary['Status'] = 'SUCCESS';
                                        objSummary['Msg'] = 'RECORD SUCCESSFULLY UPDATED BUT FAILED TO MAIL';
                                        objSummary['Data'] = updatedPospPre;
                                        res.json(objSummary);
                                    }
                                });
                            }
                        } else {
                            objSummary['Status'] = 'FAIL';
                            objSummary['Msg'] = 'RECORD NOT FOUND';
                            objSummary['Data'] = updatedPospPre;
                            res.json(objSummary);
                        }
                    }
                });
            } else {
                objSummary['Status'] = 'FAIL';
                objSummary['Msg'] = error_msg;
                objSummary['Data'] = "";
                res.json(objSummary);
            }
        } else {
            objSummary['Status'] = 'FAIL';
            objSummary['Msg'] = 'USER ID / SOURCE IS MISSING';
            objSummary['Data'] = objRequest;
            res.json(objSummary);
        }
    } catch (e) {
        objSummary['Status'] = 'FAIL';
        objSummary['Msg'] = 'EXCEPTION IN /update/posp_pre_series API';
        objSummary['Data'] = e.stack;
        res.json(objSummary);
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
                            'url': (config.environment.name === 'Production') ? 'https://foyer.tataaig.com/ckyc/submit-otp?product=motor' :'https://uatapigw.tataaig.com/ckyc/submit-otp?product=motor',
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
router.get("/tata_payment_initiate", function (req, res) {
    let objResponse = {
        "Status": "",
        "Msg": "",
        "Data": ""
    };
    try {
        var Client = require('node-rest-client').Client;
        var client = new Client();
        let objRequest = req.query;
        let proposal_id = objRequest.proposal_id && objRequest.proposal_id - 0 || "";
        if (proposal_id) {
            let user_data_id = "";
            let insurer_pg_request = "";
            let product_id = "";
            client.get(config.environment.weburl + "/user_datas/proposal/view/" + proposal_id, (proposal_data, proposal_res) => {
                if (proposal_data) {
                    user_data_id = proposal_data.User_Data_Id && proposal_data.User_Data_Id - 0 || "";
                    let lm_proposal_response = proposal_data.Proposal_Response;
                    let lm_proposal_request = proposal_data.Proposal_Request;
                    product_id = proposal_data.Product_Id || "";
                    let scope = "";
                    let client_id = "";
                    let client_secret = "";
                    let x_api_key = "";
                    let initiate_payment_url = "";
                    let token_obj = null;
                    let error_msg = null;
                    let token_service_url = "";

                    if (config.environment.name === 'Production') {
                        scope = "https://foyer.tataaig.com/write";
                        client_id = "54qqhf0pbk1jghrpajm8vjas8";
                        client_secret = "1lg9d2a3lrns333hgs5mdnd8or6l1iesd02qtofb8r3vgnc53asn";
                        x_api_key = "euo2LL5PEc8IvEGwjvAdO16r6MNskqpNQpKihMse";
                        initiate_payment_url = "https://foyer.tataaig.com/payment/online?product=motor";
                        token_service_url = "https://foyer-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token";
                    } else {
                        scope = "https://api.iorta.in/write";
                        token_service_url = "https://uatapigw-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token";
                        if ([1, 12].indexOf(lm_proposal_request.product_id) > -1) {
                            client_id = "5qdbqng8plqp1ko2sslu695n2g";
                            client_secret = "gki6eqtltmjj37gpqq0dt52dt651o079dn6mls62ptkvsa2b45c";
                            x_api_key = "g8hoqi8TBA2mBpxgMohdTcWxAfv6JsJ6wLztOWm4";
                            initiate_payment_url = "https://uatapigw.tataaig.com/payment/online?product=Motor";
                        } else if ([10].indexOf(lm_proposal_request.product_id) > -1) {
                            client_id = "4dvjgdbs2bl516rl03jh5oli5j";
                            client_secret = "gki6eqtltmjj37gpqq0dt52dt651o079dn6mls62ptkvsa2b45c";
                            x_api_key = "5QerRezeZs3PrVdLQu79c1v9Nsh5S7BOan26zc7P";
                            initiate_payment_url = "https://uatapigw.tataaig.com/payment/online?product=twmotor";
                        }
                    }

                    let product_name_obj = {
                        1: "Car",
                        10: "TW",
                        12: "Car"
                    };
                    let json_file_path = appRoot + "/resource/request_file/TataAIG_" + product_name_obj[product_id] + "_Payment.json";
                    let jsonPol = fs.readFileSync(json_file_path, 'utf8');
                    let objData = {
                        '___pan___': lm_proposal_request.pan || "",
                        '___payer_name___': lm_proposal_request.first_name + " " + lm_proposal_request.last_name,
                        '___email___': lm_proposal_request.email || "",
                        '___insurer_customer_identifier___': proposal_data.Insurer_Transaction_Identifier && proposal_data.Insurer_Transaction_Identifier.split('_')[0] || "",
                        '___return_url___': lm_proposal_response.Payment && lm_proposal_response.Payment.pg_ack_url || ""
                    };
                    jsonPol = jsonPol.replaceJson(objData);
                    jsonPol = jsonPol.replaceAll(/___(.*?)___/g, "");
                    insurer_pg_request = jsonPol;
                    console.log(insurer_pg_request);
                    let payment_log_obj = {
                        "PB_CRN": proposal_data.PB_CRN && proposal_data.PB_CRN - 0 || "",
                        "User_Data_Id": proposal_data.User_Data_Id && proposal_data.User_Data_Id - 0 || "",
                        "Proposal_Id": proposal_data.Proposal_Id && proposal_data.Proposal_Id - 0 || "",
                        "Created_On": (new Date()).toLocaleString(),
                        "Payment_Request": insurer_pg_request,
                        "Payment_Response": ""
                    };
                    token_obj = {
                        data: {
                            "grant_type": "client_credentials",
                            "scope": scope,
                            "client_id": client_id,
                            "client_secret": client_secret
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Accept': '*/*'
                        }
                    };
                    token_obj.data = jsonToQueryString(token_obj.data);
                    function jsonToQueryString(json) {
                        return  Object.keys(json).map(function (key) {
                            return encodeURIComponent(key) + '=' +
                                    encodeURIComponent(json[key]);
                        }).join('&');
                    }
                    client.post(token_service_url, token_obj, function (token_data, tokenError) {
                        if (token_data && token_data.access_token) {
                            let payment_args = {
                                data: insurer_pg_request,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': token_data.access_token,
                                    'x-api-key': x_api_key
                                }
                            };
                            client.post(initiate_payment_url, payment_args, function (initiate_payment_data, initiate_payment_res) {
                                payment_log_obj["Payment_Response"] = initiate_payment_data;
                                try {
                                    let today_str = moment().format("YYYY-MM-DD");
                                    fs.appendFile(appRoot + "/tmp/log/tata_payment_history_" + today_str + ".log", JSON.stringify(payment_log_obj) + "\r\n", function (err) {
                                        if (err) {
                                            console.error("Error in tata_insurer_payment_initiate API", err);
                                        }
                                    });
                                } catch (e) {
                                    console.error("Exception in tata_insurer_payment_initiate API", e.stack);
                                }
                                if (initiate_payment_data && initiate_payment_data.status && initiate_payment_data.status === 200 && initiate_payment_data.message_txt && initiate_payment_data.message_txt.toLowerCase().includes("success") && initiate_payment_data.data) {
                                    let insurer_pg_data = (typeof initiate_payment_data.data === 'string') && JSON.parse(initiate_payment_data.data) || initiate_payment_data.data;
                                    let find_data = {
                                        'User_Data_Id': user_data_id,
                                        'Insurer_Id': 11,
                                        'Proposal_Id': proposal_id
                                    };
                                    let update_data = {
                                        "Payment_Request.insurer_pg_request": JSON.stringify(JSON.parse(insurer_pg_request)),
                                        "Payment_Request.pg_url": insurer_pg_data.url,
                                        "Payment_Request.pg_redirect_mode": "POST",
                                        "Payment_Request.pg_data": {
                                            pgiRequest: insurer_pg_data.pgiRequest || ""
                                        }
                                    };
                                    var User_Data = require('../models/user_data');
                                    User_Data.findOneAndUpdate(find_data, {$set: update_data}, {new : true}, function (user_data_update_err, user_data_update_err_res) {
                                        if (user_data_update_err) {
                                            objResponse["Status"] = "FAIL";
                                            objResponse["Msg"] = "ERROR IN UPDATE USER DATA";
                                            objResponse["Data"] = user_data_update_err;
                                            res.json(objResponse);
                                        } else {
                                            let objResponseFull = {
                                                'err': null,
                                                'objResponseJson': initiate_payment_data,
                                                'proposal_confirm_url': lm_proposal_response.Payment && lm_proposal_response.Payment.proposal_confirm_url || ""
                                            };
                                            objResponse["Status"] = "SUCCESS";
                                            objResponse["Msg"] = "DATA FOUND SUCESSFULLY";
                                            objResponse["Data"] = objResponseFull;
                                            res.json(objResponse);
                                        }
                                    });
                                } else {
                                    error_msg = initiate_payment_data.message_txt || initiate_payment_data;
                                    let objResponseFull = {
                                        'err': error_msg,
                                        'objResponseJson': initiate_payment_data
                                    };
                                    objResponse["Status"] = "FAIL";
                                    objResponse["Msg"] = "ERROR IN PAYMENT API";
                                    objResponse["Data"] = objResponseFull;
                                    res.json(objResponse);
                                }
                            });
                        } else {
                            let objResponseFull = {
                                'err': null,
                                'objResponseJson': token_data
                            };
                            objResponse["Status"] = "FAIL";
                            objResponse["Msg"] = "ERROR IN TOKEN GENERATE";
                            objResponse["Data"] = objResponseFull;
                            res.json(objResponse);
                        }
                    });
                } else {
                    objResponse["Status"] = "FAIL";
                    objResponse["Msg"] = "NO RECORD FOUND IN USER DATA";
                    res.json(objResponse);
                }
            });
        } else {
            objResponse["Status"] = "FAIL";
            objResponse["Msg"] = "LM PROPOSAL ID MANDATORY";
            res.json(objResponse);
        }
    } catch (e) {
        objResponse["Status"] = "FAIL";
        objResponse["Msg"] = "EXCEPTION IN API";
        objResponse["Data"] = e.stack;
        res.json(objResponse);
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
        if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || [8048,7860].indexOf(req.obj_session.user.ss_id) > -1) {/** Ashustosh Sharma, Vishaka Kadam, Sachin Gavali and Aarya Utekar SsId's */
            if (req.obj_session.user.ss_id === 7860) { /** vishakha kadam for posp hindi ss_id */
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
            filter['last_assigned_to'] =  {$in: arr_ssid};
            console.log(arr_ssid);
            console.log(filter);
        };
        console.log(filter);
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
            if (objRequest.type === "source") {
                if (objRequest.search_byvalue && objRequest.search_byvalue !== "") {
                    if(objRequest.search_byvalue === "facebook"){
                        filter["Source"] = {"$in":["Facebook","facebook","fb_stroy"]};
                    }else{
                        filter["Source"] = new RegExp(objRequest.search_byvalue, 'i');
                    }
                }
            }
        }
		if (objRequest.date_type) {
			if(objRequest.date_type === 'entry_date'){
			   filter['Created_On'] =  {$gte: dateFrom, $lt: dateTo};
			}
			if(objRequest.date_type === 'next_call_date'){
			   filter['Next_Call_Date'] =  {$gte: dateFrom, $lt: dateTo};
			}
			if(objRequest.date_type === 'signup_date'){
			   filter['Signup_On'] =  {$gte: dateFrom, $lt: dateTo};
			}
			if(objRequest.date_type === 'pos_date'){
			   filter['Erpcode_On'] =  {$gte: dateFrom, $lt: dateTo};
			}			
		}
		if (objRequest.Recruitment_Status && typeof objRequest.Recruitment_Status !== "undefined") {
			if(objRequest.Recruitment_Status === 'SIGNUP_ONLY'){
			   filter['Ss_Id'] =  {"$exists" :true};
			   filter['Erp_Id'] =  {"$exists" :false};
			}
			if(objRequest.Recruitment_Status === 'POS_CODED'){
			   filter['Erp_Id'] =  {"$exists" :true};
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

   router.post('/fatakpay/web_razorpay_payment', function (req, res) {
    try {
        var objres = {};
        var razorpay_payment = require('../models/razorpay_payment');
        let fatakpay_details = require('../models/fatakpay_detail');
        let fatakpay_history = require('../models/fatakpay_history.js');
        let objRequest = JSON.parse(JSON.stringify(req.body));
        var razorpay_payment_data = new razorpay_payment(objRequest);
        razorpay_payment_data.Created_On = new Date();
        razorpay_payment_data.Modified_On = new Date();
        razorpay_payment_data.Transaction_Status = "Pending";
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.get(config.environment.weburl + "/user_datas/view/" + objRequest.udid, function (data, response) {
            if (data && data.length > 0) {
                data = data[0]['Proposal_Request'];
                razorpay_payment_data['Name'] = data['first_name'];
                razorpay_payment_data['Mobile'] = data['mobile'];
                razorpay_payment_data['Email'] = data['email'];
                razorpay_payment_data['Source'] = "FATAKPAY";
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
                                    let updateArgs = {
                                        "Transaction_Id": dbRequest[0]['_doc'].Transaction_Id - 0 + 1,
                                        "Tenure": (objRequest && objRequest.tenure) ? objRequest.tenure - 0 : 0,
                                        "Emi_Amount": (objRequest && objRequest.first_payment) ? objRequest.first_payment - 0 : 0,
                                        "Modified_On": Date.now()
                                    }
                                    fatakpay_history.update({"User_Data_Id": objRequest.udid}, {$set: updateArgs}, function (err, updatedDbData) {
                                        if (err) {
                                            res.json({"Status": "Fail", "Msg": "Error while adding fatakpat history", "data": err});
                                        } else {
                                            updateArgs["Razorpay_Status"] = "PG_REDIRECTED";
                                            updateArgs["Proposal_Confirm_Url"] = (objRequest && objRequest.proposal_confirm_url) ? objRequest.proposal_confirm_url : null;;;
                                            fatakpay_details.update({"User_Data_Id": objRequest.udid}, {$set: updateArgs}, function (err, updatedDbData) {
                                                if (err) {
                                                    res.json({"Status": "Fail", "Msg": "Error while adding fatakpat history", "data": err});
                                                } else {
                                                    objres = {
                                                        "MSG": "Congratulation !! Transaction data updated successfully. Kindly note your Transaction Id : " + (dbRequest[0]['_doc'].Transaction_Id - 0 + 1),
                                                        "Status": "Success",
                                                        "Transaction_Id": dbRequest[0]['_doc'].Transaction_Id - 0 + 1
                                                    };
                                                    res.json(objres);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                objres = {
                    "MSG": "Data not found.",
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
router.post("/fatakpay/eligibility_check_api", function (req, res) {
    try {
        let request = require('request');
        let fatakpay_details = require('../models/fatakpay_detail');
        let fatakpay_history = require('../models/fatakpay_history');
        req.body = JSON.parse(JSON.stringify(req.body));
        let objRequest = req.body;
        let dbg = objRequest.dbg || "no";
        let currentTimestamp = Date.now();
        let formattedDate = moment(currentTimestamp).format('YYYY-MM-DD HH:mm:ss');
        let auth_token_url = (config.environment.name === "Production") ? "https://uatonboardingapi.fatakpay.com/external-api/v1/create-user-token" : "https://uatonboardingapi.fatakpay.com/external-api/v1/create-user-token";
        let token_args = {
            data: {
                "username": (config.environment.name === "Production") ? "PolicyBossMerchant" : "PolicyBossMerchant",
                "password": (config.environment.name === "Production") ? "070939e365f9d6060fd2" : "070939e365f9d6060fd2"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        function jsonToQueryString(json) {
            return Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                        encodeURIComponent(json[key]);
            }).join('&');
        }
        var req_data = {
            "consent_timestamp": formattedDate,
            "mobile": (objRequest['mobile'] - 0),
            "first_name": objRequest['first_name'],
            "last_name": objRequest['last_name'],
            "email": objRequest['email'],
            "employment_type_id": objRequest['employment_type_id'],
            "pan": objRequest['pan'],
            "dob": moment(objRequest['dob'], "DD-MM-YYYY").format('YYYY-MM-DD'),
            "pincode": 400093,
            "home_address": objRequest['home_address'], //data['communication_address_1'],
            "office_address": objRequest['office_address'],
            "emp_code": objRequest['emp_code'], // data not available - AB04589
            "purchase_amount": (objRequest['premium_amount'] - 0),
            "type_of_residence": objRequest['type_of_residence'], // data not available - Owned
            "company_name": objRequest['company_name'], // data not available - ANB
            "product_type": objRequest['product_type'],
            "consent": objRequest['consent']
        };
        var LM_Data = {
            "PB_CRN": parseInt(objRequest.crn),
            "User_Data_Id": parseInt(objRequest.udid),
            "Proposal_Id": parseInt(objRequest.proposal_id),
            "Insurer_Id": parseInt(objRequest.insurer_id),
            "Application_Loan_Id": null,
            "Premium_Amount": objRequest.premium_amount,
            "Request_Core": req_data,
            "Response_Core": null,
            "Tenure": 0,
            "Status": 'Pending',
            "RedirectURL": ""
        };
        token_args.data = jsonToQueryString(token_args.data);
        request.post({ url: auth_token_url, form: token_args.data }, (auth_token_error, auth_token_response, auth_token_data) => {
            if (auth_token_error) {
                res.json({"Status": "FAIL", "Msg": "AUTH TOKEN NOT GENERATED", "Data": auth_token_error});
            } else {
                auth_token_data = JSON.parse(auth_token_data);
                if (auth_token_data.success && auth_token_data.hasOwnProperty('data') && auth_token_data.data.token) {
                    let auth_token = auth_token_data.data.token || "";
                    let eligibility_check_url = (config.environment.name === "Production") ? "https://uatonboardingapi.fatakpay.com/external-api/v1/emi-insurance-eligibility" : "https://uatonboardingapi.fatakpay.com/external-api/v1/emi-insurance-eligibility";
                    let eligibilty_args = {
                        data: req_data,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Token " + auth_token
                        }
                    };
                    client.post(eligibility_check_url, eligibilty_args, function (eligibility_check_data, eligibility_check_response) {
                        let eligibility_response = eligibility_check_data;
                        if (dbg === "yes") {
                            eligibility_response = {
                                "success" : true,
                                "status_code" : 200,
                                "message" : "You are eligible.",
                                "data" : {
                                    "eligibility_status" : true,
                                    "max_eligibility_amount" : 5797,
                                    "loan_application_id" : 45631,
                                    "max_amount" : null,
                                    "product_type" : "EMI",
                                    "eligibility_expiry_date" : "2024-05-31",
                                    "processing_fees" : 708,
                                    "min_interest" : "24",
                                    "max_interest" : "24",
                                    "scheduler" : [ 
                                        {
                                            "months" : 3,
                                            "emi_amount" : 2010.14,
                                            "bifurcation" : [ 
                                                {
                                                    "principal" : 1894.2,
                                                    "interest" : 115.94,
                                                    "emi_date" : "2024-07-05"
                                                }, 
                                                {
                                                    "principal" : 1932.08,
                                                    "interest" : 78.06,
                                                    "emi_date" : "2024-08-05"
                                                }, 
                                                {
                                                    "principal" : 1970.73,
                                                    "interest" : 39.41,
                                                    "emi_date" : "2024-09-05"
                                                }
                                            ]
                                        }, 
                                        {
                                            "months" : 6,
                                            "emi_amount" : 1034.91,
                                            "bifurcation" : [ 
                                                {
                                                    "principal" : 918.97,
                                                    "interest" : 115.94,
                                                    "emi_date" : "2024-07-05"
                                                }, 
                                                {
                                                    "principal" : 937.35,
                                                    "interest" : 97.56,
                                                    "emi_date" : "2024-08-05"
                                                }, 
                                                {
                                                    "principal" : 956.1,
                                                    "interest" : 78.81,
                                                    "emi_date" : "2024-09-05"
                                                }, 
                                                {
                                                    "principal" : 975.22,
                                                    "interest" : 59.69,
                                                    "emi_date" : "2024-10-05"
                                                }, 
                                                {
                                                    "principal" : 994.72,
                                                    "interest" : 40.19,
                                                    "emi_date" : "2024-11-05"
                                                }, 
                                                {
                                                    "principal" : 1014.64,
                                                    "interest" : 20.29,
                                                    "emi_date" : "2024-12-05"
                                                }
                                            ]
                                        }, 
                                        {
                                            "months" : 9,
                                            "emi_amount" : 710.22,
                                            "bifurcation" : [ 
                                                {
                                                    "principal" : 594.28,
                                                    "interest" : 115.94,
                                                    "emi_date" : "2024-07-05"
                                                }, 
                                                {
                                                    "principal" : 606.17,
                                                    "interest" : 104.05,
                                                    "emi_date" : "2024-08-05"
                                                }, 
                                                {
                                                    "principal" : 618.29,
                                                    "interest" : 91.93,
                                                    "emi_date" : "2024-09-05"
                                                }, 
                                                {
                                                    "principal" : 630.65,
                                                    "interest" : 79.57,
                                                    "emi_date" : "2024-10-05"
                                                }, 
                                                {
                                                    "principal" : 643.27,
                                                    "interest" : 66.95,
                                                    "emi_date" : "2024-11-05"
                                                }, 
                                                {
                                                    "principal" : 656.13,
                                                    "interest" : 54.09,
                                                    "emi_date" : "2024-12-05"
                                                }, 
                                                {
                                                    "principal" : 669.26,
                                                    "interest" : 40.96,
                                                    "emi_date" : "2025-01-05"
                                                }, 
                                                {
                                                    "principal" : 682.64,
                                                    "interest" : 27.58,
                                                    "emi_date" : "2025-02-05"
                                                }, 
                                                {
                                                    "principal" : 696.31,
                                                    "interest" : 13.93,
                                                    "emi_date" : "2025-03-05"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            };
                        }
                        let eligibility_response_json = {};
                        LM_Data['Response_Core'] = eligibility_response;
                        if (eligibility_response.status_code === 500) {
                            eligibility_response["Status"] = "FAIL";
                            eligibility_response['Msg'] = "Internal Server Error From Fatakpay eligibility_check_api";
                            eligibility_response_json = eligibility_response;
                        } else {
                            if (eligibility_response && eligibility_response.success && eligibility_response.success === true) {
                                eligibility_response_json["Status"] = "SUCCESS";
                                LM_Data['Application_Loan_Id'] = eligibility_response.data.loan_application_id;
                                eligibility_response_json["Msg"] = "DATA FETCH SUCCESSFULLY";
                                LM_Data['Tenure'] = eligibility_response['data']['tenure'];
                            } else {
                                eligibility_response_json["Status"] = "FAIL";
                                eligibility_response_json["Msg"] = "DATA NOT FOUND";
                            }
                            eligibility_response_json["Data"] = eligibility_response;
                        }
                        fatakpay_details.find({PB_CRN: objRequest.crn, User_Data_Id: objRequest.udid}, function (err, fatakPay_data) {
                            if (err) {
                                console.error('Error in eligibility_check_api Service', err);
                            } else {
                                if (fatakPay_data.length > 0) {
                                    if (eligibility_response_json["Status"] === 'SUCCESS') {
                                        fatakpay_details.updateOne({PB_CRN: objRequest.crn, User_Data_Id: objRequest.udid}, {$set: {'Fatakpay_Status': 'Eligible', 'Modified_On': Date.now()}}, function (err, numAffected) {
                                            if (err) {
                                                console.error('Error in eligible api service', err);
                                            }
                                        });
                                    }
                                } else {
                                    let saveDetails = {
                                        "PB_CRN": parseInt(objRequest.crn),
                                        "User_Data_Id": parseInt(objRequest.udid),
                                        "Proposal_Id": parseInt(objRequest.proposal_id),
                                        "Insurer_Id": parseInt(objRequest.insurer_id),
                                        "Application_Loan_Id": parseInt(eligibility_response.data.loan_application_id),
                                        "Premium_Amount": objRequest.premium_amount,
                                        "Tenure": 0,
                                        "Fatakpay_Status": 'PENDING',
                                        "RedirectURL": ""
                                    }
                                    saveDetails['Fatakpay_Status'] = eligibility_response['data'].hasOwnProperty('eligibility_status') && eligibility_response['data'].eligibility_status === true ? "ELIGIBLE" : "PENDING";
                                    let saveFatakpayDetails = new fatakpay_details(saveDetails);
                                    saveFatakpayDetails.save(function (err, objDbFatakpayDetails) {
                                        if (err) {
                                            console.error('Error in eligibility_check_api service while storing data', err);
                                        }
                                    });
                                }
                            }
                        });
                        try {
                            var today = moment().utcOffset("+05:30");
                            var today_str = moment(today).format("YYYYMMD");
                            fs.appendFile(appRoot + "/tmp/log/fatakpay_log_$" + today_str + ".log", JSON.stringify(objRequest, eligibility_response) + "\r\n", function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                                console.log("The file was saved!");
                            });
                        } catch (ex) {
                            console.error({"Status": "FAIL", "Msg": "LOGS NOT CREATED", "Data": ex.stack});
                        }
                        LM_Data['Status'] = `Eligible_${eligibility_response_json["Status"]}`;
                        let saveFatakpayHistory = new fatakpay_history(LM_Data);
                        saveFatakpayHistory.save(function (err, objDbFatakpayHistory) {
                            if (err) {
                                console.error('Error in eligibility_check_api service while storing data in fatakpay history', err);
                            }
                        });
                        res.send(eligibility_response_json);
                    });
                } else {
                    res.json({"Status": "FAIL", "Msg": "AUTH TOKEN NOT GENERATED", "Data": auth_token_data});
                }
            }
        });
    } catch (ex) {
        res.json({"Status": "FAIL", "Msg": ex.stack});
    }
});
router.post("/fatakpay/insurance_redirection", function (req, res) {
    let fatakpay_details = require('../models/fatakpay_detail');
    let fatakpay_history = require('../models/fatakpay_history');
    let objResponseSummary = {
        "Status": "",
        "Msg": "",
        "Data": ""
    };
    let redirect_response;
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        let objRequest = req.body;
        let utr_date_time_stamp = moment().toISOString();
        let auth_token_url = (config.environment.name === "Production") ? "https://uatonboardingapi.fatakpay.com/external-api/v1/create-user-token" : "https://uatonboardingapi.fatakpay.com/external-api/v1/create-user-token";
        let token_args = {
            data: {
                "username": (config.environment.name === "Production") ? "PolicyBossMerchant" : "PolicyBossMerchant",
                "password": (config.environment.name === "Production") ? "070939e365f9d6060fd2" : "070939e365f9d6060fd2"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        function jsonToQueryString(json) {
            return Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                        encodeURIComponent(json[key]);
            }).join('&');
        }
        var req_data = {
            "application": (objRequest['application'] - 0),
            "payment_link": objRequest['payment_link'],
            "tenure": (objRequest['tenure'] - 0)
//                "net_disbur_amt": objRequest['premium_amount'],
//                "utr_number": "CMS3875582698",
//                "utr_date_time_stamp": utr_date_time_stamp
        };
        var LM_Data = {
            "PB_CRN": parseInt(objRequest.crn),
            "User_Data_Id": parseInt(objRequest.udid),
            "Proposal_Id": parseInt(objRequest.proposal_id),
            "Insurer_Id": parseInt(objRequest.insurer_id),
            "Application_Loan_Id": objRequest['application'],
            "Premium_Amount": objRequest.premium_amount,
            "Request_Core": req_data,
            "Emi_Amount": (objRequest.first_payment) ? parseInt(objRequest.first_payment) : 0,
            "Transaction_Id": (objRequest.pb_tnx_id) ? parseInt(objRequest.pb_tnx_id) : 0,
            "Response_Core": null,
            "Tenure": (objRequest && objRequest.tenure) ? objRequest.tenure - 0 : 0,
            "Status": '',
            "RedirectURL": ""
        };
        token_args.data = jsonToQueryString(token_args.data);
        client.post(auth_token_url, token_args, function (auth_token_data, auth_token_response) {
            if (auth_token_data && auth_token_data.success && auth_token_data.hasOwnProperty('data') && auth_token_data.data.token) {
                let auth_token = auth_token_data.data.token || "";
                let insurance_redirect_url = (config.environment.name === "Production") ? "https://uatonboardingapi.fatakpay.com/external-api/v1/emi-insurance-redirection" : "https://uatonboardingapi.fatakpay.com/external-api/v1/emi-insurance-redirection";
                var request = require("request");
                var options = {
                    method: 'POST',
                    url: insurance_redirect_url,
                    headers: {
                                'content-type': 'multipart/form-data;',
                                "Authorization": "Token " + auth_token
                            },
                    formData: {
                                "application": (objRequest['application'] - 0),
                                "payment_link": objRequest['payment_link'],
                                "tenure": (objRequest['tenure'] - 0)
                            }
                };
                request(options, function (error, response, insurance_redirect_data) {
                    if (error) {
                        res.json({"Msg": error});
                    } else {
                        redirect_response = JSON.parse(insurance_redirect_data);
                        LM_Data['Response_Core'] = redirect_response;
                        LM_Data['RedirectURL'] = redirect_response && redirect_response.data && redirect_response.data.redirection_url || "";
                        if (redirect_response['success'] && redirect_response['status_code'] == 200) {
                            fatakpay_details.find({PB_CRN: objRequest.crn, User_Data_Id: objRequest.udid}, function (err, fatakPay_data) {
                                if (err) {
                                    console.error('Error in insurance_redirection Service', err);
                                } else {
                                    fatakpay_details.updateOne({PB_CRN: objRequest.crn, User_Data_Id: objRequest.udid}, {$set: {'Fatakpay_Status': 'Redirected', 'Transaction_Id': objRequest['pb_tnx_id'] - 0, 'RedirectURL': redirect_response['data']['redirection_url'], 'Modified_On': Date.now()}}, function (err, numAffected) {
                                        if (err) {
                                            console.error('Error in eligible api service', err);
                                        }
                                    });
                                }
                            });
                            objResponseSummary['Status'] = "SUCCESS";
                            objResponseSummary['Msg'] = "Data Found";
                            objResponseSummary['Data'] = redirect_response;
                        } else {
                            fatakpay_details.updateOne({PB_CRN: objRequest.crn, User_Data_Id: objRequest.udid}, {$set: {'Fatakpay_Status': 'Redirected_Fail', 'Transaction_Id': objRequest['pb_tnx_id'] - 0, 'Modified_On': Date.now()}}, function (err, numAffected) {
                                if (err) {
                                    console.error('Error in eligible api service', err);
                                }
                            });
                            objResponseSummary['Status'] = "FAIL";
                            objResponseSummary['Msg'] = "Data Not Found";
                            objResponseSummary['Data'] = redirect_response;
                        }
                        LM_Data['Status'] = `Redirected_${objResponseSummary['Status']}`;
                        let saveFatakpayHistory = new fatakpay_history(LM_Data);
                        saveFatakpayHistory.save(function (err, objDbFatakpayHistory) {
                            if (err) {
                                console.error('Error in insurance_redirection service while storing data in fatakpay history', err);
                            }
                        });
                        res.send(objResponseSummary);
                    }
                });
            } else {
                objResponseSummary['Status'] = "FAIL";
                objResponseSummary['Msg'] = "AUTH TOKEN NOT GENERATED";
                objResponseSummary['Data'] = auth_token_data;
                res.send(objResponseSummary);
            }
        });
    } catch (e) {
        console.error("Exception in /fatakpay/insurance_redirection", e.stack);
        res.send({'Status': 'FAIL', 'Msg': 'Exception in /fatakpay/insurance_redirection service', 'Data': e.stack});
    }
});
router.post("/fatakpay/callback", function (req, res) {
    let objSummary = {};
    try {
        let fatakpay_history = require('../models/fatakpay_history');
        var Client = require('node-rest-client').Client;
        var client = new Client();
        req.body = JSON.parse(JSON.stringify(req.body));
        let objRequest = req.body;
        let callbackReq = {
            "loan_application_id": objRequest.application_load_id ? (objRequest.application_load_id - 0) : 0,
            "net_disbur_amt": objRequest.premium_amount ? (objRequest.premium_amount - 0) : 0,
            "utr_number": objRequest.Utr_No ? objRequest.Utr_No : "", // "CMS3875582698",
            "utr_date_time_stamp": moment().toISOString()
        }
        let LM_Data = {
            "PB_CRN": parseInt(objRequest.crn),
            "User_Data_Id": parseInt(objRequest.udid),
            "Proposal_Id": objRequest.proposal_id ? parseInt(objRequest.proposal_id) : 0,
            "Insurer_Id": parseInt(objRequest.insurer_id),
            "Application_Loan_Id": objRequest['application'],
            "Premium_Amount": objRequest.premium_amount,
            "Request_Core": callbackReq,
            "Response_Core": null,
            "Tenure": objRequest['tenure'],
            "Status": 'CALLBACK_CALLED',
            "RedirectURL": ''
        };
        let updateArg = {
            'Status': '',
            'Response_Core': ''
        }
        let callbackURL = (config.environment.name === "Production") ? "" : "https://uatonboardingapi.fatakpay.com/external-api/v1/callback/policyboss/disbursement";
        let saveFatakpayHistory = new fatakpay_history(LM_Data);
        saveFatakpayHistory.save(function (err, objDbFatakpayHistory) {
            if (err) {
                console.error('Error in callback_api service while storing data in fatakpay history', err);
            } else {
                let args = {
                    data: callbackReq,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                client.post(callbackURL, args, function (callbackData, response) {
                    updateArg['Response_Core'] = callbackData;
                    if (callbackData && callbackData.success) {
                        updateArg['Status'] = 'CALLBACK_SUCCESS';
                        objSummary['Status'] = 'SUCCESS';
                        objSummary['Msg'] = 'DATA SUCCESSFULLY FETCHED';
                        objSummary['Data'] = callbackData;
                    } else {
                        updateArg['Status'] = 'CALLBACK_FAIL';
                        objSummary['Status'] = 'FAIL';
                        objSummary['Msg'] = callbackData['message'];
                        objSummary['Data'] = callbackData;
                    }
                    saveFatakpayHistory.findOneAndUpdate({User_Data_Id: (objRequest.udid - 0)}, {$set: updateArg}, function (err, updatedData) {
                        if (err) {
                            objSummary['Status'] = (callbackData && callbackData.success) ? 'SUCCESS' : 'FAIL';
                            objSummary['Msg'] = 'ERROR IN UPDATING DATABASE INSIDE CALLBACK API' + err;
                            objSummary['Data'] = callbackData;
                            res.send(objSummary);
                        } else {
                            res.send(objSummary);
                        }
                    });
                });
            }
        });
    } catch (err) {
        objSummary['Status'] = 'FAIL';
        objSummary['Msg'] = 'EXCEPTION IN /fatakpay/callback API';
        objSummary['Data'] = err.stack;
        res.send(objSummary);
    }
});
router.get("/fatakpay/redirecturl/", function(req, res) {
    let objSummary = {};
    try {
        let fatakpay_detail = require('../models/fatakpay_detail.js');
        req.body = JSON.parse(JSON.stringify(req.body));
        let query = {};
        if(req && req.query && req.query.source && req.query.source === "udid") {
            query['User_Data_Id'] = req.query.id;
        } else {
            query['Transaction_Id'] = req.query.id;
        }
        fatakpay_detail.findOne(query).exec(function (err, dbData) {
            if(err) {
                objSummary['Status'] = 'FAIL';
                objSummary['Msg'] = 'ERROR WHILE FETCHING DATA FROM DB';
                objSummary['Data'] = err;
                res.send(objSummary);
            } else {
                objSummary['Status'] = 'SUCCESS';
                objSummary['Msg'] = 'RECORED FETCHED SUCCESSFULLY';
                objSummary['Data'] = dbData;
                res.send(objSummary);
            }
        });
    } catch(err) {
        objSummary['Status'] = 'FAIL';
        objSummary['Msg'] = 'EXCEPTION IN /fatakpay/redirecturl';
        objSummary['Data'] = err.stack;
        res.send(objSummary);
    }
});
router.get('/token', function (req, res) {
    let objSummary = {};
    try {
        let appId = "pf5awl";
        let appKey = "z85vpyzlpiqz4b06k0bq";
        var request = require('request');
        var tokenReq_obj  = {
            "appId":appId,
            "appKey":appKey,
            "expiry":300
        };            
        var options = {
            'method': 'POST',
            'url': 'https://auth.hyperverge.co/login',
            'headers': {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(tokenReq_obj)
        };
        request(options, function (error, response) {
            if (error){
                objSummary['Status'] = "FAIL";
                objSummary['Msg'] = error;
                return res.json(objSummary);
            }
            objSummary['Status'] = 'SUCCESS';
            objSummary['Data'] = JSON.parse(response.body);
            res.json(objSummary);
        });
    } catch (ex) {
        objSummary['Status'] = "FAIL";
        objSummary['Msg'] = ex.stack;
        res.json(objSummary);
    }
});
router.post('/hyperver_log' , function(req,res){
    let objSummary = {};
    try{
        req.body = JSON.parse(JSON.stringify(req.body));
        var kyc_history = require('../models/kyc_history');
        let ObjRequest =  req.body || {};
        let kyc_histroy_log = {
            'PB_CRN': ObjRequest.PB_CRN ? ObjRequest.PB_CRN : "",
            'User_Data_Id': ObjRequest.User_Data_Id ? ObjRequest.User_Data_Id : "",
            'Insurer_Id': ObjRequest.Insurer_Id || '',
            'Product_Id': ObjRequest.Product_Id ? ObjRequest.Product_Id : "",
            'Document_Type': ObjRequest.Document_Type || "",
            'Document_ID': ObjRequest.Document_ID || "",
            'DOB': ObjRequest.DOB || "",
            'Full_Name': ObjRequest.full_name || "",
            'KYC_Full_Name': ObjRequest.KYC_FullName || "",
            'Mobile': ObjRequest.Mobile && ObjRequest.Mobile - 0 || "",
            'Email': ObjRequest.Email || "",
            'KYC_Number': ObjRequest.KYC_Number || "",
            'Search_Type':  ObjRequest.Search_Type || "",
            'KYC_Status': ObjRequest.KYC_Status || "",
            'Doc1': ObjRequest.Doc1 || "",
            'Doc1_Name': ObjRequest.Doc1_Name || "",
            'Doc2': ObjRequest.Doc2 || "",
            'Doc2_Name': ObjRequest.Doc2_Name || "",
            'Doc3': ObjRequest.Doc3 || "",
            'Doc3_Name': ObjRequest.Doc3_Name || "",
            'KYC_URL': ObjRequest.KYC_Redirect_URL || "",
            'KYC_Ref_No': ObjRequest.KYC_Ref_No || "",
            'Created_On': new Date(),
            'Modified_On': new Date(),
            'Proposal_Id': ObjRequest.Proposal_Id || "",
            'Quote_Id': ObjRequest.Quote_Id || "",
            'KYC_Request_Core': ObjRequest.kyc_request || "",
            'KYC_Response_Core': ObjRequest.kyc_response || "",
            'KYC_Company_Name': ObjRequest.KYC_Company_Name || "",
            'Error_Msg': ObjRequest.Error_Msg || "",
            'Call_At': ObjRequest.Call_At || "",
            'Error_Code': ''
        };
        var kyc_history = new kyc_history(kyc_histroy_log);
        kyc_history.save(kyc_histroy_log, function (err, kyc_history_data) {
            if (err) {
                objSummary['Status'] = "FAIL";
                objSummary['Msg'] = err;
                res.json(objSummary);
            } else {
                objSummary['Status'] = 'SUCCESS';
                objSummary['Msg'] = 'LOG SAVED SUCCESSFULLY';
                objSummary['Data'] = kyc_history_data;
                res.json(objSummary);
            }
        });
    }  catch (ex) {
        objSummary['Status'] = "FAIL";
        objSummary['Msg'] = ex.stack;
        res.json(objSummary);
    }
});
router.post("/fatakpay/get_fatakpay_data", function (req, res) {

    try {
        let fatakpay_detail = require('../models/fatakpay_detail');
        let Base = require('../libs/Base');
        let objBase = new Base();
        let obj_pagination = objBase.jqdt_paginate_process(req.body);
        let objReq = req.body || {};
        let filter = {};
        var optionPaginate = {
            sort: {'Created_On': -1},
            lean: true,
            page: 1,
            limit: 10
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page || null;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit) || null;
            filter = obj_pagination.filter || {};
        }

        if (objReq['Col_Name'] && objReq['Col_Name'] !== '' && objReq['txtCol_Val'] && objReq['txtCol_Val'] !== '') {
            if (['User_Data_Id', 'Proposal_Id', 'Application_Loan_Id', 'Transaction_Id','PB_CRN'].indexOf(objReq['Col_Name']) > -1) {
                filter[objReq['Col_Name']] = parseInt(objReq['txtCol_Val']);
            } else {
                filter[objReq['Col_Name']] = objReq['txtCol_Val'];
            }
        }
        if (objReq['Col_Fatakpay_Transaction_Status'] && objReq['Col_Fatakpay_Transaction_Status'] !== '') {
            filter['Transaction_Status'] = objReq['Col_Fatakpay_Transaction_Status'];
        }
        if (objReq['Col_EMI_Status'] && objReq['Col_EMI_Status'] !== '') {
            filter['EMI_Status'] = objReq['Col_EMI_Status'];
        }
        if (objReq['Product_Id'] && objReq['Product_Id'] !== '') {
            filter['Product_Id'] = parseInt(objReq['Product_Id']);
        }
        if (objReq['Insurer_Id'] && objReq['Insurer_Id'] !== '') {
            filter['Insurer_Id'] = parseInt(objReq['Insurer_Id']);
        }
        if (objReq['PB_CRN'] && objReq['PB_CRN'] !== '') {
            filter['PB_CRN'] = objReq['PB_CRN'];
        }
        if (objReq['transaction_start_date'] && objReq['transaction_start_date'] !== '' && objReq['transaction_end_date'] && objReq['transaction_end_date'] !== '') {
            var arrFrom = objReq['transaction_start_date'].split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);

            var arrTo = objReq['transaction_end_date'].split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);
            filter['Modified_On'] = {"$gte": dateFrom, "$lte": dateTo};
        }
        if (objReq['Premium_Amount'] && objReq['Premium_Amount'] !== '') {
            var min_finalpremium = objReq['Premium_Amount'].split('_')[0] || 0;
            var max_finalpremium = objReq['Premium_Amount'].split('_')[1] || 0;
            filter['Premium_Amount'] = {"$gte": min_finalpremium, "$lte": max_finalpremium};
        }
        fatakpay_detail.paginate(filter, optionPaginate).then(function (fatakpay_details_datas) {
            fatakpay_details_datas['Filter'] = filter;
            res.json(fatakpay_details_datas);
        });
    } catch (err) {
        res.json({"Status": "FAIL", "Msg": err.stack});
    }
});

function htmlEscape(remark) {
   var text = remark
   var testData = text.replace(/&/g, '&amp;').
     replace(/</g, '&lt;').  // it's not neccessary to escape >
     replace(/"/g, '&quot;').
     replace(/'/g, '&#039;');
     return testData;
}
module.exports = router;