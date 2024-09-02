/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var Sync_Contact = require('../models/sync_contact');
var protect_me_well = require('../models/protect_me_well_detail');
var appRoot = path.dirname(path.dirname(require.main.filename));

var https = require('https');
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
module.exports.controller = function (app) {
    app.post('/protectmewell_initiate', function (req, res, next) {
        try {
            console.error("protect_me_initiate");
            //console.error(req.fields);
            console.error(req.body);
            var condition = {};
            if(req.body.source_type === "pb") {
                condition["User_Data_Id"] = req.body.udid;
            }
            if(req.body.source_type === "lead") {
                condition["Lead_Id"] = req.body.short_code;
            }
            if(req.body.source_type === "direct") {
                condition["User_Data_Id"] = 0;
            }

            let User_Data_Id = parseInt(req.body.udid);
            let data = req.body;
            console.error("protect_me_initiate_data");
            console.error(data);
            console.log(JSON.stringify(req.body));
            var protect_me_well = require('../models/protect_me_well_detail');
            var Client = require('node-rest-client').Client;
            var client = new Client();

            let ObjResponse1 = {};
            let ObjResponse2 = {};
            let obj_response;
            let ip_address = data.ip_address;

            let customer_name = data["name"];
            let customer_mobile = data["mobile"];
            let customer_email = data["email"];
            let objRequest1 = {
                "name": data["name"],
                "email": data["email"],
                "mobile": data["mobile"],
                "gender": data["gender"],
                "location": data["location"],
                "starting_age": data["starting_age"],
                "education": data["education"],
                "marital_status": data["marital_status"],
                "retirement_age": data["retirement_age"],
                "mother_age": data["mother_age"],
                "father_age": data["father_age"],
                "spouse_age": data["spouse_age"],
                "mother_dependent": data["mother_dependent"],
                "father_dependent": data["father_dependent"],
                "spouse_dependent": data["spouse_dependent"],
                "occupation_self": data["occupation_self"],
                "home_purchase_age": data["home_purchase_age"],
                "annual_income_self": data["annual_income_self"],
                "annual_income_spouse": data["annual_income_spouse"],
                "annual_income_other": data["annual_income_other"],
                "current_household_expenses": data["current_household_expenses"],
                "current_investment_for_retirement": data["current_investment_for_retirement"],
                "home_owned": data["home_owned"],
                "home_loan_availed": data["home_loan_availed"],
                "other_loans_availed": data["other_loans_availed"],
                "total_financial_assets": data["total_financial_assets"],
                "total_real_estate_assets": data["total_real_estate_assets"],
                "occupation_spouse": data["occupation_spouse"],
                "dependent_children": data["dependent_children"],
                "dependent_children_ages": data["dependent_children_ages"],
                "dependent_parents": data["dependent_parents"],
                "agree": data["agree"]
            };
            let arg =
                    {
                        headers: {'X-API-KEY': '1ccf9d6c4ef087ee54c43ba8f2b0651d'}
                    };
            obj_response = objRequest1;
            objRequest1 = jsonToQueryString(objRequest1);
            console.error("protect_me_initiate_objRequest1");
            console.error(objRequest1);
            
            let obj_visted_history = {
                "ip_address": ip_address,
                "date_time": new Date()
            };
            client.get("https://api.protectmewell.com/index.php/api/v1/get_recommendation" + "?" + objRequest1, arg, function (data, response) {

                ObjResponse1 = data;
                console.error(ObjResponse1);
                console.error(objRequest1);
                if (ObjResponse1.status === 200 && ObjResponse1.message === "Success") {
                    var service_method_url = "https://api.protectmewell.com/index.php/api/v1/get_pdf_url";
                    try {
                        const request = require('request');
                        request.post({
                            url: service_method_url,
                            headers: {'X-API-KEY': '1ccf9d6c4ef087ee54c43ba8f2b0651d'},
                            form: {
                                hash: ObjResponse1.data.hash

                            }
                        }, function (err, httpResponse, body) {
                            console.error(body);
                            console.error(err);
                            ObjResponse2 = JSON.parse(body);
                            if (ObjResponse2.status === 200 && ObjResponse2.message === "Success") {
                                //Store in tmp
                                let pdf_sys_loc = appRoot + "/tmp/pdf/" + ObjResponse2.data['pdf_url'].split('/').pop() + '.pdf';

                                let pdf_location = config.environment.downloadurl + "/tmp/pdf/" + ObjResponse2.data['pdf_url'].split('/').pop() + '.pdf';
                                let file_horizon = fs.createWriteStream(pdf_sys_loc);
                                //var file_portal = fs.createWriteStream(pdf_sys_loc);  //local
                                let request = https.get(ObjResponse2.data['pdf_url'], function (response) {
                                    response.pipe(file_horizon);
                                    // response.pipe(file_portal); //local


                                    //end
                                    protect_me_well.findOne(condition, function (err, dbData) {
                                        if (err) {
                                        } else {
                                            if (dbData)
                                            {
                                                let obj_res = {};
                                                obj_res["protect_me_link_history"] = obj_visted_history;

                                                console.log("objRequest2" + JSON.stringify(obj_response));

                                                let obj_req = {"protect_me_link_url": pdf_location,
                                                    "Quote_Service": {
                                                        "Request": obj_response,
                                                        "Response": ObjResponse1
                                                    },
                                                    "PDF_Service": {
                                                        "Request": {
                                                            "hash": ObjResponse1.data.hash
                                                        }
                                                        ,
                                                        "Response": ObjResponse2
                                                    },
                                                    "is_protect_issued": 1,
                                                    "Modified_On": new Date()
                                                };
                                                console.log(User_Data_Id + "----User_Data_Id");
                                                protect_me_well.updateOne(condition, {$set: obj_req}, function (err, numAffected) {
                                                    console.log(err);
                                                    console.log(numAffected + "----set1");
                                                });
                                                protect_me_well.updateOne(condition, {$addToSet: obj_res}, function (err, numAffected) {
                                                    //console.log(err);
                                                    //console.log(numAffected + "----set2");
                                                    res.json({"msg": "success", "url": pdf_location});
                                                });
                                                if(req.body.source_type === "lead") {
                                                    let obj_data ={
                                                        "Email": data["email"],
                                                        "Age": data["starting_age"],
                                                        "Address": data["location"],
                                                        "Gender": data["gender"],
                                                        "Marital_Status": data["marital_status"]
                                                    };
                                                    protect_me_well.updateOne(condition, {$set: obj_data}, function (err, numAffected) {
                                                        console.log(err);
                                                        console.log(numAffected + "----set1");
                                                    });
                                                }
                                            }else{
                                                let directdata = {
                                                    "Name": data["name"],
                                                    "Email": data["email"],
                                                    "Mobile": data["mobile"],
                                                    "Age": data["starting_age"],
                                                    "Modified_On": new Date(),
                                                    "Created_On": new Date(),
                                                    "is_protect_me_visited": 1,
                                                    "is_protect_issued": 0,
                                                    "Address": data["location"],
                                                    "Gender": data["gender"],
                                                    "Marital_Status": data["marital_status"]
                                                };                                                
                                                
                                                directdata["protect_me_link_history"] = obj_visted_history;
                                                var quote_data = {
                                                    "Request": obj_response,
                                                    "Response": ObjResponse1
                                                };
                                                var pdf_data = {
                                                    "Request": {
                                                        "hash": ObjResponse1.data.hash
                                                    },
                                                    "Response": ObjResponse2
                                                };
                                                directdata['protect_me_link_url'] = pdf_location;
                                                directdata['is_protect_issued'] = 1;
                                                directdata['PDF_Service'] = pdf_data;
                                                directdata['Quote_Service'] = quote_data;
                                                directdata['Source_Type'] = "direct";
                                                protect_me_well.insertMany(directdata, function (err, users) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        console.log(users);
                                                        res.json({"msg": "success", "url": pdf_location});
                                                    }
                                                });
                                            }
                                            
                                            var SmsLog = require('../models/sms_log');
                                            var objsmsLog = new SmsLog();
                                            let dt = new Date();
                                            let obj_err_sms = {
                                                '___customer_name___': customer_name,
                                                '___customer_mobile___': customer_mobile,
                                                '___protect_me_well_link___': pdf_location,
                                                '___current_dt___': dt.toLocaleString()
                                            };
                                            let sms_data = objsmsLog.protect_me_well(obj_err_sms);
                                            objsmsLog.send_sms('7208803933', sms_data, 'POLBOS-PROTECT-ME-WELL'); //Ashish
                                            objsmsLog.send_sms('7666020532', sms_data, 'POLBOS-PROTECT-ME-WELL');//Chirag
                                            objsmsLog.send_sms('9619160851', sms_data, 'POLBOS-PROTECT-ME-WELL'); //Anuj
                                            objsmsLog.send_sms(customer_mobile, sms_data, 'POLBOS-PROTECT-ME-WELL'); //Customer

                                            //Email 
                                            var filehtml = appRoot + "/resource/request_file/ProtectMeWell/protectmewell-post-submission.html";
                                            var html = fs.readFileSync(filehtml, 'utf8');
                                            var replacedata = {
                                                '___protect_me_well_link___': pdf_location,
                                                '___customer_name___': obj_response.name,
                                                '___term_cover___': ObjResponse1.data.recommended_portfolio.term_plan['tp_cover_size'] === "Not Required" ? ObjResponse1.data.recommended_portfolio.term_plan['tp_cover_size'] : "&#8377; " + ObjResponse1.data.recommended_portfolio.term_plan['tp_cover_size'],
                                                '___term_duration___': ObjResponse1.data.recommended_portfolio.term_plan['tp_duration'] === "Not Applicable" ? ObjResponse1.data.recommended_portfolio.term_plan['tp_duration'] : ObjResponse1.data.recommended_portfolio.term_plan['tp_duration'] + " Y",
                                                '___term_start_at___': ObjResponse1.data.recommended_portfolio.term_plan['tp_start'] === "Not Applicable" ? ObjResponse1.data.recommended_portfolio.term_plan['tp_start'] : "&#8377; " + ObjResponse1.data.recommended_portfolio.term_plan['tp_start'],
                                                '___retirement_cover___': ObjResponse1.data.recommended_portfolio.annuity_funds['af_corpus'] === "Not Required" ? ObjResponse1.data.recommended_portfolio.annuity_funds['af_corpus'] : "&#8377; " + ObjResponse1.data.recommended_portfolio.annuity_funds['af_corpus'],
                                                '___retirement_monthly___': "&#8377; " + ObjResponse1.data.recommended_portfolio.annuity_funds['tp_dumonthly_investmentration'],
                                                '___retirement_start_at___': ObjResponse1.data.recommended_portfolio.annuity_funds['af_start_age'] === "Not Applicable" ? ObjResponse1.data.recommended_portfolio.annuity_funds['af_start_age'] : ObjResponse1.data.recommended_portfolio.annuity_funds['af_start_age'] + " Y",
                                                '___critical_cover___': "&#8377; " + ObjResponse1.data.recommended_portfolio.critical_illness['ci_cover_size'],
                                                '___critical_duration___': ObjResponse1.data.recommended_portfolio.critical_illness['ci_duration'] + " Y",
                                                '___medical_cover___': "&#8377; " + ObjResponse1.data.recommended_portfolio.health_insurance['hi_annual_health_cover'],
                                                '___medical_duration___': ""
                                            };
                                            html = html.toString().replaceJson(replacedata);

                                            var Email = require('../models/email');
                                            var objModelEmail = new Email();
                                            let sub = 'Insurance Portfolio Report';
                                            console.error(html);
                                            let bcc = config.environment.notification_email;
                                            objModelEmail.send('customercare@policyboss.com', customer_email, sub, html, '', bcc, '');
                                            
                                        }
                                    });
                                });
                            }
                        });
                    } catch (e) {
                        console.error(e);
                        res.json({"msg": "fail", "url": "", "User_Data_Id": "", "error": "Service Fail2"});
                    }
                } else {
                    res.json({"msg": "fail", "url": "", "User_Data_Id": "", "error": "Service Fail1"});
                }
            });

        } catch (e) {
            console.error(e);
            res.json({"msg": "fail", "url": "", "User_Data_Id": "", error: e});
        }
    });

    app.get('/protectme_pdf/:UID', function (req, res, next) {
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

    app.get('/pmw/:pmw_id', function (req, res, next) {
        try {
            let pmw_id = req.params['pmw_id'];
            let User_Data_Id = pmw_id.split("_")[0] - 0;
            //let SRN = pmw_id.split("_")[1];
            let protect_me_well = require('../models/protect_me_well_detail');
            var http = require('http');
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let ip_address = "";
            var url_click = config.environment.name === 'Production' ? "https://www.policyboss.com/ProtectMeWell/?pmwid=" + pmw_id + "&source_type=pb" : "http://qa.policyboss.com/ProtectMeWell/?pmwid=" + pmw_id + "&source_type=pb";

            protect_me_well.findOne({"User_Data_Id": User_Data_Id}, function (err, dbData) {
                if (err) {

                } else {
                    if (dbData)
                    {
                        if (dbData._doc.hasOwnProperty('protect_me_link_url') && (dbData._doc["protect_me_link_url"] !== null || dbData._doc["protect_me_link_url"] !== ""))
                        {
                            return res.redirect(dbData._doc["protect_me_link_url"]);
                        } else {
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
                                    "Address": data["Proposal_Request_Core"]["permanent_address_1"] + " " + data["Proposal_Request_Core"]["permanent_address_2"] + " " + data["Proposal_Request_Core"]["permanent_address_3"] + " " + data["Proposal_Request_Core"]["permanent_city"] + " " + data["Proposal_Request_Core"]["permanent_pincode"] + " " + data["Proposal_Request_Core"]["permanent_state"],
                                    "is_protect_me_visited": 1,
                                    "is_protect_issued": 0,
                                    "Created_On": new Date(),
                                    "Modified_On": new Date(),
                                    "Source_Type": "pb",
                                    "Gender": data["Proposal_Request_Core"]["gender"],
                                    "Marital_Status": data["Proposal_Request_Core"]["marital_text"]
                                };
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
                        });
                    }
                }
            });

        } catch (e) {
            res.send(e.stack);
        }
    });
    
    app.post('/pre_send_protectme_link', function (req, res, next) {
        try {
            let data = req.body;
            let shortcode = req.body.srn.split('-').pop();
            let crn = req.body.crn;

            let return_url = "http://pboss.in/pmw/" + data.udid + "_" + shortcode;
            var filehtml = appRoot + "/resource/request_file/ProtectMeWell/protectmewell-pre-submission.html";
            var html = fs.readFileSync(filehtml, 'utf8');
            var replacedata = {
                '___customer_name___': data.name,
                '___redirection_link___': return_url,
                '___click_to_call_link___': "http://horizon.policyboss.com/click_to_call/" + crn + "/Protectmewell"
            };
            html = html.toString().replaceJson(replacedata);

            var Email = require('../models/email');
            var objModelEmail = new Email();
            let sub = 'Size up your Insurance Portfolio "The Right Way" - Transparently';
            let bcc = config.environment.notification_email;
            objModelEmail.send('customercare@policyboss.com', data.email, sub, html, '', bcc, crn);
        } catch (e) {
            res.send(e.stack);
        }
    });
    
    app.get('/pw/:lead_id', function (req, res, next) {
        try {
            let LeadId = req.params['lead_id'];
            let protect_me_well = require('../models/protect_me_well_detail');
            var http = require('http');
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let ip_address = "";
            var url_click = config.environment.name === 'Production' ? "https://www.policyboss.com/ProtectMeWell/?pmwid=" + LeadId + "&source_type=lead" : "http://qa.policyboss.com/ProtectMeWell/?pmwid=" + LeadId + "&source_type=lead";

            protect_me_well.findOne({"Lead_Id": LeadId}, function (err, dbData) {
                if (err) {

                } else {
                    if (dbData)
                    {
                        if (dbData._doc.hasOwnProperty('protect_me_link_url') && (dbData._doc["protect_me_link_url"] !== null || dbData._doc["protect_me_link_url"] !== ""))
                        {
                            return res.redirect(dbData._doc["protect_me_link_url"]);
                        } else {
                            var obj_res = {};
                            let obj_visted_history = {
                                "ip_address": ip_address,
                                "date_time": new Date()
                            };
                            obj_res["protect_me_link_history"] = obj_visted_history;
                            protect_me_well.updateOne({'Lead_Id': LeadId}, {$set: {'is_protect_me_visited': parseInt(dbData._doc["is_protect_me_visited"]) + 1}}, function (err, numAffected) {
                                console.log(err);
                            });
                            protect_me_well.updateOne({'Lead_Id': LeadId}, {$addToSet: obj_res}, function (err, numAffected) {
                                console.log(err);
                                return res.redirect(url_click);
                            });
                        }
                    } else {
                        Sync_Contact.find({Short_Code: LeadId}, function (err, dbSync_Contacts) {
                            console.log(dbSync_Contacts);
                            if (dbSync_Contacts.length > 0) {                                 
                                 var objData = {
                                    "Name": dbSync_Contacts[0]._doc.erp_core_response[0].ClientName,
                                    "Mobile": dbSync_Contacts[0]._doc.mobileno,
                                    "is_protect_me_visited": 1,
                                    "is_protect_issued": 0,
                                    "Created_On": new Date(),
                                    "Modified_On": new Date(),
                                    "Lead_Id":LeadId,
                                    "Source_Type": "lead"
                                };
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
                                    }
                                });
                            }
                        });
                    }
                }
            });

        } catch (e) {
            res.send(e.stack);
        }
    });
       
    app.get('/getDataOnFormLoad/:code/:ip_address/:source_type?', function (req, res, next) {
        var code = req.params['code'];
        let ip_address = req.params['ip_address'] !== undefined ? req.params['ip_address'] : "";
        let sourceType = req.params['source_type'];
        var condition = {};
        if(sourceType === "pb") {
            condition["User_Data_Id"] = parseInt(code);
        }else {
            condition["Lead_Id"] = code;
        }
        protect_me_well.find(condition, function (err, dbSync_Contacts) {
           try {
               console.log(dbSync_Contacts);
               if (dbSync_Contacts.length > 0) { 
                return res.json({
                    "Name": dbSync_Contacts[0]._doc.Name,
                    "Mobile": dbSync_Contacts[0]._doc.Mobile,
                    "Email": dbSync_Contacts[0]._doc.Email === undefined ? "" : dbSync_Contacts[0]._doc.Email,
                    "Age": dbSync_Contacts[0]._doc.Age === undefined ? "" : dbSync_Contacts[0]._doc.Age,
                    "DOB": dbSync_Contacts[0]._doc.DOB === undefined ? "" : dbSync_Contacts[0]._doc.DOB,
                    "Gender": dbSync_Contacts[0]._doc.Gender === undefined ? "" : dbSync_Contacts[0]._doc.Gender,
                    "Marital": dbSync_Contacts[0]._doc.Marital_Status === undefined ? "" : dbSync_Contacts[0]._doc.Marital_Status,                    
                    "Location": dbSync_Contacts[0]._doc.Address === undefined ? "" : dbSync_Contacts[0]._doc.Address,
                    "IP_address": ip_address                    
                });
               }
           } catch (e) {
           }
       });
    });
};
function calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
function jsonToQueryString(json) {
    return  Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
    }).join('&');
}