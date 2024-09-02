/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Email = require('../models/email');
var Match_Point = require('../models/match_point');
var Client = require('node-rest-client').Client;
var client = new Client();
var const_free_lead = 25;
let matchpoint_data;
let vehicles_list;
let rtos_list;
let Account_Id;
let respns;
let ip_respns;
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
module.exports.controller = function (app) {
    app.get('/mtc/:account_id', function (req, res, next) {
        var account_id = (req.params.hasOwnProperty('account_id')) ? req.params['account_id'] : "";
        //var url_click = "https://www.google.com/"
        //return respns.redirect(url_click);
        Account_Id = account_id;
        Match_Point.find({'account_id': account_id}).limit(1).exec(function (err, datamtc) {
            if (datamtc[0]._doc.hasOwnProperty('is_matchpoint_issued') && datamtc[0]._doc['is_matchpoint_issued'] == 1) {
                res.send('Msg : MatchPoint already issued.');
            } else {
                respns = res;
                if (config.environment.name === 'Production') {
                    var url_mpgps = "admin.matchpointgps.in";
                } else {
                    var url_mpgps = "ut-admin01.do-blr.mpgps.aspade.in";
                }
                var request = require("request");
                var arg_data = {user_id: Account_Id};//'YUtwanNmYS9IUjVNSUFVMFk1RjJKZz09'
                var options = {method: 'POST',
                    url: 'https://' + url_mpgps + '/campaign/get_customer_details/',
                    headers:
                            {'postman-token': '40a6335b-0a36-2456-6ced-7de87ae7e66b',
                                'cache-control': 'no-cache',
                                authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiUE9MSUNZIEJPU1MifQ.pc3A1Zhjaicse47bQ2pNyrB_CB7uGDm_iarYGRz_aL0',
                                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'},
                    formData: arg_data};
                request(options, function (error, response, body) {
                    let objResponse = {
                        "account_id": Account_Id,
                        'customer_req': arg_data,
                        'is_matchpoint_issued': 0,
                        'customer_res': "",
                        'proposal_req': "",
                        'proposal_res': "",
                        'payment_req': "",
                        'payment_res': "",
                        "variant": "",
                        "model": "",
                        "place": "",
                        "cust_phoneno": "",
                        "policy_exp": "",
                        "registration_no": "",
                        "registration_date": "",
                        "fuel_type": "",
                        "cust_name": "",
                        "make": "",
                        "Created_On": new Date(),
                        "Modified_On": new Date()
                    };
                    if (error) {
                        res.send(error);
                        objResponse['matchpoint_res'] = error;
                        var matchpoint_data1 = new Match_Point(objResponse);
                        matchpoint_data1.save(function (err, objDB) {
                            if (err) {
                                console.error('Exception', 'match_point_Save_Err', err, objResponse);
                            }

                        });
                    } else {
                        console.log(body);
                        if (typeof body === 'string' || body instanceof String) {
                            body = JSON.parse(body);
                        }
                        matchpoint_data = body;
                        matchpoint_data['account_id'] = Account_Id;
                        call_rto();
                        call_vehicle();
                        let url_click = premium_initate();
                        //res.redirect(url_click);
                        //res.send(body);
                        objResponse['customer_res'] = body;
                        objResponse['variant'] = body['variant'];
                        objResponse['model'] = body['model'];
                        objResponse['place'] = body['place'];
                        objResponse['cust_phoneno'] = body['cust_phoneno'];
                        objResponse['policy_exp'] = body['policy_exp'];
                        objResponse['registration_no'] = body['registration_no'];
                        objResponse['registration_date'] = body['registration_date'];
                        objResponse['fuel_type'] = body['fuel_type'];
                        objResponse['cust_name'] = body['cust_name'];
                        objResponse['make'] = body['make'];
                        var matchpoint_data1 = new Match_Point(objResponse);
                        matchpoint_data1.save(function (err, objDB) {
                            if (err) {
                                console.error('Exception', 'match_point_Save_Err', err, objResponse);
                            }

                        });
                    }
                });
            }
        });
    });
    function call_vehicle() {
        client.get(config.environment.weburl + '/vehicles', {}, function (vehicles, response) {
            console.log('call_vehicle - ' + JSON.stringify(vehicles));
            if (vehicles) {
                vehicles_list = vehicles;
                premium_initate();
            }
        });
    }
    function call_rto() {
        client.get(config.environment.weburl + '/rtos/list', {}, function (rtos, response) {
            console.log('call_rto - ' + JSON.stringify(rtos));
            if (rtos) {
                rtos_list = rtos;
                premium_initate();
            }
        });
    }
    function premium_initate() {
        if (rtos_list && vehicles_list) {
            if (matchpoint_data.make !== "" && matchpoint_data.model !== "" && matchpoint_data.variant !== "") {
                var makeName = matchpoint_data.make.split(" ")[0].toUpperCase();
                var modelName = matchpoint_data.model.split(" ")[0].toUpperCase();
                var variantName = matchpoint_data.variant.split(" ")[0].toUpperCase();
                console.log(makeName, modelName, variantName);
                for (var i in vehicles_list) {
                    if (vehicles_list[i].Product_Id_New === 1 && vehicles_list[i].Fuel_Name == matchpoint_data.fuel_type.toUpperCase()) {
                        if (((vehicles_list[i].Make_Name).indexOf(makeName) > -1) || ((vehicles_list[i].Model_Name).indexOf(modelName) > -1) || ((vehicles_list[i].Variant_Name).indexOf(variantName) > -1)) {
                            console.log(vehicles_list[i].Vehicle_ID);
                            vehicleId = vehicles_list[i].Vehicle_ID;
                        }
                    }
                }
            } else if (matchpoint_data.make !== "" && matchpoint_data.model !== "") {
                var makeName = matchpoint_data.make.split(" ")[0].toUpperCase();
                var modelName = matchpoint_data.model.split(" ")[0].toUpperCase();
                console.log(makeName, modelName);
                //makeName = "JEEP";
                for (var i in vehicles_list) {
                    if (vehicles_list[i].Product_Id_New === 1 && vehicles_list[i].Fuel_Name == matchpoint_data.fuel_type.toUpperCase()) {
                        if (((vehicles_list[i].Make_Name).indexOf(makeName) > -1) || ((vehicles_list[i].Model_Name).indexOf(modelName) > -1)) {
                            console.log(vehicles_list[i].Vehicle_ID);
                            vehicleId = vehicles_list[i].Vehicle_ID;
                        }
                    }
                }
            } else {
                var makeName = matchpoint_data.make.split(" ")[0].toUpperCase();
                console.log(makeName);
                for (var i in vehicles_list) {
                    if (vehicles_list[i].Product_Id_New === 1 && ((vehicles_list[i].Make_Name).indexOf(makeName) > -1) && vehicles_list[i].Fuel_Name == matchpoint_data.fuel_type.toUpperCase()) {
                        console.log(vehicles_list[i].Vehicle_ID);
                        vehicleId = vehicles_list[i].Vehicle_ID;
                    }
                }
            }
            if (matchpoint_data.registration_no !== "") {
                var regCode = matchpoint_data.registration_no.substring(0, 2).toUpperCase() + matchpoint_data.registration_no.substring(2, 4);
                console.log(regCode);
                for (var j in rtos_list) {
                    if (rtos_list[j].VehicleCity_RTOCode == regCode) {
                        console.log(rtos_list[j].VehicleCity_Id);
                        rtoId = rtos_list[j].VehicleCity_Id;
                    }
                }
            } else if (matchpoint_data.place !== "") {
                var regPlace = matchpoint_data.place.split(" ")[0].toUpperCase();
                console.log(regPlace);
                for (var j in rtos_list) {
                    if ((rtos_list[j].RTO_City.toUpperCase()).indexOf(regPlace) > -1) {
                        console.log(rtos_list[j].VehicleCity_Id);
                        rtoId = rtos_list[j].VehicleCity_Id;
                    }
                }
            }
            var secret_key = "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW";
            var client_key = "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9";
            if (vehicleId != "" && rtoId != "") {
                var obj = {
                    "product_id": 1,
                    "vehicle_id": vehicleId,
                    "rto_id": rtoId,
                    "vehicle_insurance_type": "renew",
                    "vehicle_insurance_subtype": "1CH_0TP",
                    "vehicle_manf_date": moment(matchpoint_data.registration_date).format('YYYY-MM') + '-01',
                    "vehicle_registration_date": moment(matchpoint_data.registration_date).format('YYYY-MM-DD'),
                    "policy_expiry_date": moment(matchpoint_data.policy_exp).format('YYYY-MM-DD'), //moment(matchpoint_data.policy_exp).format('YYYY-MM-DD'),
                    "prev_insurer_id": 2,
                    "vehicle_registration_type": "individual",
                    "vehicle_ncb_current": "0",
                    "is_claim_exists": "no",
                    "method_type": "Premium",
                    "execution_async": "yes",
                    "electrical_accessory": "0",
                    "non_electrical_accessory": "0",
                    "registration_no": matchpoint_data.registration_no,
                    "is_llpd": "no",
                    "is_antitheft_fit": "no",
                    "voluntary_deductible": "0",
                    "is_external_bifuel": "no",
                    "is_aai_member": "no",
                    "external_bifuel_type": "",
                    "external_bifuel_value": "0",
                    "pa_owner_driver_si": 1500000,
                    "is_pa_od": "yes",
                    "is_having_valid_dl": "yes",
                    "is_opted_standalone_cpa": "no",
                    "pa_named_passenger_si": "0",
                    "pa_unnamed_passenger_si": "0",
                    "pa_paid_driver_si": "0",
                    "is_financed": "no",
                    "is_oslc": "no",
                    "oslc_si": 0,
                    "vehicle_expected_idv": 0,
                    "first_name": "TEST",
                    "middle_name": "M",
                    "last_name": "NAME",
                    "mobile": matchpoint_data.cust_phoneno,
                    "email": "lszzbd30ax@testpb.com",
                    "crn": 0,
                    "ss_id": 25678,
                    "fba_id": 76034,
                    "geo_lat": 0,
                    "geo_long": 0,
                    "agent_source": "",
                    "app_version": "PolicyBoss.com",
                    "search_reference_number": "",
                    "is_breakin": "no",
                    "is_inspection_done": "no",
                    "is_policy_exist": "yes",
                    "ip_city_state": "_",
                    "sub_fba_id": 0,
                    "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                    "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                    "vehicle_make_name": "",
                    "vehicle_full": "",
                    "rto_full": "",
                    "policy_tenure": 1,
                    "policy_od_tenure": 1,
                    "policy_tp_tenure": 1,
                    "client_id": 2,
                    "client_name": "PolicyBoss",
                    "udid": 2351578,
                    "idv_by_crn": "yes",
                    "posp_posp_id": 0,
                    "posp_fba_id": 0,
                    "posp_sm_posp_id": 0,
                    "posp_sm_posp_name": 0,
                    "posp_first_name": 0,
                    "posp_middle_name": 0,
                    "posp_last_name": 0,
                    "posp_email_id": 0,
                    "posp_agent_city": 0,
                    "posp_mobile_no": 0,
                    "posp_pan_no": 0,
                    "posp_aadhar": 0,
                    "posp_sources": 0,
                    "posp_ss_id": 0,
                    "posp_erp_id": 0,
                    "posp_last_status": 0,
                    "posp_gender": 0,
                    "posp_posp_category": 0,
                    "posp_reporting_agent_uid": 508389,
                    "posp_reporting_agent_name": "POLICY BOSS WEBSITE",
                    "posp_reporting_email_id": 0,
                    "posp_reporting_mobile_number": 0,
                    "posp_category": "PolicyBoss",
                    "erp_source": "FRESH-MTR",
                    "is_posp": "no",
                    "channel": "DIRECT",
                    "subchannel": "DIRECT",
                    "is_mobile_verified": "yes",
                    "utm_source": "matchpoint",
                    "utm_medium": matchpoint_data.account_id,
                    "utm_campaign": "matchpoint"
                };
                if (matchpoint_data.cust_name != "") {
                    var arrCustName = matchpoint_data.cust_name.split(' ');
                    if (arrCustName.length == 3) {
                        obj['first_name'] = arrCustName[0];
                        obj['middle_name'] = arrCustName[1];
                        obj['last_name'] = arrCustName[2];
                    } else {
                        obj['first_name'] = arrCustName[0];
                        obj['middle_name'] = "";
                        obj['last_name'] = arrCustName[1];
                    }
                }
                console.log(obj);
                var args = {
                    data: obj,
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                client.post(config.environment.weburl + '/quote/premium_initiate', args, function (data, matchpoint_data) {
                    console.log('premium_initiate - ' + data);
                    if (data.Summary) {
                        if (data.Summary.Request_Unique_Id) {
                            var url_click = config.environment.portalurl + "/car-insurance/quotes?SID=" + data.Summary.Request_Unique_Id + "&ClientID=2";
                            console.log('url_click - ' + url_click);
                            return respns.redirect(url_click);
                            //window.location.href = url_click;
                        }
                    }
                });
            }
        }
    }
    app.get('/match_point/history/:account_id/:ip_address', function (req, res, next) {
        var account_id = (req.params.hasOwnProperty('account_id')) ? req.params['account_id'] : "";
        var ipaddress = (req.params.hasOwnProperty('ip_address')) ? req.params['ip_address'] : "0.0.0.0";
        Match_Point.find({'account_id': account_id}).limit(1).exec(function (err, dataSync) {
            if (dataSync[0]) {
                try {
                    let obj_is_mtc_hist = {
                        "mtc_link_history": []
                    };
                    if (dataSync[0]._doc.hasOwnProperty('mtc_link_history')) {
                        dataSync[0]._doc['mtc_link_history'].push({"ipaddress": ipaddress, "date_time": new Date()});
                        obj_is_mtc_hist['mtc_link_history'] = dataSync[0]._doc['mtc_link_history'];
                    } else {
                        obj_is_mtc_hist['mtc_link_history'].push({"ipaddress": ipaddress, "date_time": new Date()});
                    }

                    Match_Point.update({'account_id': account_id}, {$set: obj_is_mtc_hist}, function (err, numAffected) {
                        console.log(err);
                    });
                } catch (e) {
                    console.error(e.stack);
                }
            }
            res.send('');
        });
    });

    app.get('/match_point/ip_address', function (req, res, next) {
        //var http = require('http');
        //ip_respns = req.connection.remoteAddress;
        var ip = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                (req.connection.socket ? req.connection.socket.remoteAddress : null);
        res.send(ip);
        /*http.get('http://bot.whatismyipaddress.com', function (res1, req) {
         res1.setEncoding('utf8');
         res1.on('data', function (chunk) {
         // You can process streamed parts here...
         ip_address = chunk;
         console.log(ip_address);
         ip_respns.send(ip_address);
         });
         });*/
    });
    app.get('/matchpoint_device_visitor/:PB_CRN', function (req, res, next) {
        var PB_CRN = (req.params.hasOwnProperty('PB_CRN')) ? (req.params['PB_CRN'] - 0) : 0;
        if (PB_CRN > 0) {
            var Matchpoint_Device_Visitor = require('../models/matchpoint_device_visitor');
            Matchpoint_Device_Visitor.findOne({'PB_CRN': PB_CRN}).exec(function (err, dbMatchpoint_Device_Visitor) {
                try {
                    if (dbMatchpoint_Device_Visitor) {
                        let Visited_History = dbMatchpoint_Device_Visitor._doc['Visited_History'];
                        Visited_History.unshift(new Date());
                        let Obj_Matchpoint_Device_Visitor = {
                            'Visited_Count': dbMatchpoint_Device_Visitor._doc['Visited_Count'] + 1,
                            'Visited_On': new Date(),
                            'Visited_History': Visited_History
                        };
                        Matchpoint_Device_Visitor.update({'PB_CRN': PB_CRN}, {$set: Obj_Matchpoint_Device_Visitor}, function (err, numAffected) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send('SUCCESS');
                            }
                        });
                    } else {
                        var mdv = new Matchpoint_Device_Visitor({
                            'PB_CRN': PB_CRN,
                            'Visited_Count': 1,
                            'Visited_On': new Date(),
                            'Created_On': new Date(),
                            'Visited_History': [new Date()]
                        });
                        mdv.save(function (err, objDB) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send('SUCCESS');
                            }
                        });
                    }
                } catch (e) {
                    res.send(e.stack);
                }
            });
        } else {
            res.send('EMPTY_CRN');
        }
    });

};