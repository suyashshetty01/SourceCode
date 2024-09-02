/* Author: Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var sleep = require('system-sleep');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
let hcq = require('../models/health_campaign');
const fs = require('fs');
var Client = require('node-rest-client').Client;
var client = new Client();
let erpqt_respns;
module.exports.controller = function (app) {
    app.get('/send_health_cross_sell_code/:udid', function (req, res) {
        let udid = (req.params.hasOwnProperty('udid')) ? parseInt(req.params['udid']) : "";
        if (udid === "" || udid === null) {
            res.send('udid Missing');
        } else {
            var User_Data = require(appRoot + '/models/user_data');
            let find_cond = {'User_Data_Id': udid};
            User_Data.findOne(find_cond).sort({'Created_On': -1}).exec(function (err, dbData) {
                if (err) {
                    res.send(err);
                } else {
                    try {
                        if (dbData) {
                            let data = dbData._doc;
                            let short_code = data['Request_Unique_Id'].substring(data['Request_Unique_Id'].length - 4, data['Request_Unique_Id'].length);
                            short_code = short_code + '_' + udid;
                            let obj_HCQ = {
                                'PB_CRN': data.PB_CRN,
                                'UDID': udid,
                                'Visited_Count': 0,
                                'Is_Visited': false,
                                'Short_Code_Id': short_code,
                                'Short_Url': '',
                                'Raw_Data': data.Erp_Qt_Request_Core,
                                'Quote_Url': '',
                                'Created_On': new Date(),
                                'Modified_On': ''
                            };
                            var obj_HCQuote = new hcq(obj_HCQ);
                            obj_HCQuote.save(function (err, res) {
                                if (err) {
                                    throw err;
                                } else {
                                    let SmsLog = require('../models/sms_log');
                                    let objSmsLog = new SmsLog();
                                    let click_url = config.environment.weburl + '/hcq/' + short_code;
                                    let customer_name = data.Erp_Qt_Request_Core['___contact_name___'];
                                    let customer_msg = "Hello " + customer_name + ", please check the following link - " + click_url;
                                    if (data.Erp_Qt_Request_Core['___mobile___'] !== '') {
                                        objSmsLog.send_sms(data.Erp_Qt_Request_Core['___mobile___'], customer_msg, 'health_cross_sell', '');
                                    }
                                }
                            });
                        } else {
                            return res.send('Data not found');
                        }
                    } catch (e) {
                        return res.send(e.stack);
                    }
                }
            });
        }
    }
    );
    app.get('/hcq/:Unique_Id', function (req, res) {
        let unique_id = (req.params.hasOwnProperty('Unique_Id')) ? req.params['Unique_Id'] : "";
        if (unique_id === "" || unique_id === null) {
            res.send('Unique_Id Missing');
        } else {
            let hcq_cond = {'Short_Code_Id': unique_id};
            hcq.findOne(hcq_cond).sort({'Health_Campaign_Id': -1}).exec(function (err, dbHcq) {
                if (err) {
                    res.send(err);
                } else {
                    try {
                        if (dbHcq) {
                            dbHcq = dbHcq._doc;

                            if (dbHcq.hasOwnProperty('Quote_Url') && dbHcq.Quote_Url !== "") {
                                return res.redirect(dbHcq.quote_url);
                            } else {
                                erpqt_respns = res;
                                let Pincode = require('../models/pincode');
                                let Visited_Count = dbHcq.hasOwnProperty('Visited_Count') ? dbHcq.Visited_Count + 1 : 1;
                                let obj_HCQ = {
                                    'Visited_Count': Visited_Count,
                                    'Is_Visited': true,
                                    'Modified_On': new Date()
                                };
                                erp_qt_req = dbHcq['Raw_Data'];
                                let pin_code = parseInt(erp_qt_req['___permanent_pincode___']);
                                Pincode.findOne({'Pincode': pin_code}, function (err, Pin) {
                                    if (err) {
                                        return err;
                                    } else {
                                        premium_initate_health(erp_qt_req, Pin['_doc'], dbHcq.Health_Campaign_Id);
                                        hcq.update({'Health_Campaign_Id': dbHcq.Health_Campaign_Id}, {$set: obj_HCQ}, function (err, numAffected) {
                                        });
                                    }
                                });
                            }
                        } else {
                            return res.send('Invalid Unique_Id');
                        }
                    } catch (e) {
                        return res.send(e.stack);
                    }
                }
            });
        }
    });
    app.post('/erp_health_journey', function (req, res, next) {
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
};
function premium_initate_health(db_HCQuote, pin_details, hcq_id) {
    if (pin_details) {
        let obj = {
            "city_id": pin_details['City_Id'],
            "city_name": pin_details['City'],
            "permanent_pincode": pin_details['Pincode'],
            "health_insurance_si": "500000",
            "adult_count": 2,
            "child_count": 1,
            "elder_mem_age": 30,
            "eldest_mem_gender": "M",
            "contact_name": db_HCQuote['___contact_name___'],
            "mobile": db_HCQuote['___mobile___'],
            "email": db_HCQuote['___email___'],
            "policy_tenure": 1,
            "product_id": 2,
            "PremiumwithAddon": 0,
            "addon_uar": "no",
            "addon_ncb": "no",
            "addon_dsi": "no",
            "addon_cbb": "no",
            "addon_rmw": "no",
            "addon_hdc": "no",
            "addon_aru": "no",
            "addon_ursi": "no",
            "addon_sncp": "no",
            "addon_ca": "no",
            "addon_ci": "no",
            "addon_Hdc": "no",
            "addon_Pa": "no",
            "addon_protector": "no",
            "addon_cover": "no",
            "addon_time": "no",
            "addon_global": "no",
            "freeAddOnCover": "no",
            "multi_individual": "no",
            "state_name": pin_details['State'],
            "State_Code": pin_details['State_Code'],
            "zone": pin_details['ZONECD'],
            "member_1_gender": "M",
            "member_2_gender": "F",
            "member_3_gender": "M",
            "member_4_gender": "",
            "member_5_gender": "",
            "member_6_gender": "",
            "member_1_age": 30,
            "member_2_age": 28,
            "member_3_age": 5,
            "member_4_age": -1,
            "member_5_age": -1,
            "member_6_age": -1,
            "method_type": "Premium",
            "health_insurance_type": "floater",
            "execution_async": "yes",
            "crn": 0,
            "ss_id": 0,
            "agent_source": "0",
            "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
            "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
            "fba_id": "",
            "ip_address": db_HCQuote['___ip_address___'],
            "geo_lat": db_HCQuote['___geo_lat___'],
            "geo_long": db_HCQuote['___geo_long___'],
            "app_version": "PolicyBoss.com",
            "quick_quote": true,
            "insurer_selected": "",
            "topup_applied": "none"
        };
        console.log("HCQ premium initiate - ", obj);
        var args = {
            data: obj,
            headers: {
                "Content-Type": "application/json"
            }
        };
        client.post(config.environment.weburl + '/quote/premium_initiate', args, function (data, res) {
            console.log('premium_initiate response - ' + data);
            if (data.Summary) {
                if (data.Summary.Request_Unique_Id) {
                    let url_click = config.environment.portalurl + "/Health/quotes?SID=" + data.Summary.Request_Unique_Id + "&ClientID=2";
                    console.log('HCQ url_click - ' + url_click);
                    let obj_HCQuote = {
                        'Quote_Url': url_click,
                        'Modified_On': new Date()
                    };
                    hcq.update({'Health_Campaign_Id': hcq_id}, {$set: obj_HCQuote}, function (err, numAffected) {
                    });
                    return erpqt_respns.redirect(url_click);
                } else {
                    console.error('Exception', 'data not found');
                }
            } else {
                console.error('Exception', 'data not found');
            }
        });
    } else {
        return erpqt_respns.send('Pincode not available');
    }
}   