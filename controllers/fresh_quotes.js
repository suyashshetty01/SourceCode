/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var moment = require('moment');
var sleep = require('system-sleep');
var mongojs = require('mongojs');
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
var MongoClient = require('mongodb').MongoClient;
var Fresh_Quote = require('../models/fresh_quote');
var Fresh_Quote_Job = require('../models/fresh_quote_job');
const csv = require('csv-parser');
const fs = require('fs');
var Client = require('node-rest-client').Client;
var client = new Client();
let erpqt_respns;
let rq_res;
let erpqt_req;
let listData;
const {fuzzy} ="";// require("fast-fuzzy");
/*var Const_Make_Erp_PB = {
 'SKODA' : 
 'TOYOTA'
 'MARUTI'
 'HYUNDAI'
 'BMW'
 'RENAULT'
 'AUDI'
 'HONDA'
 'TATA'  
 };*/
module.exports.controller = function (app) {
    app.get('/fq_NIA/:Short_Code', function (req, res) {
        let Short_Code = req.params.Short_Code;
        Fresh_Quote.findOne({'Short_Code': Short_Code}).sort({'Fresh_Quote_Id': -1}).exec(function (err, dbFresh_Quote) {
            if (err) {
                res.send(err);
            } else {
                try {
                    if (dbFresh_Quote) {
                        dbFresh_Quote = dbFresh_Quote._doc;
                        let Visited_History = dbFresh_Quote.hasOwnProperty('Visited_History') ? dbFresh_Quote.Visited_History : [];
                        Visited_History.unshift(new Date());
                        let Visited_Count = dbFresh_Quote.Visited_Count + 1;
                        let objFresh_Quote = {
                            'Visited_History': Visited_History,
                            'Visited_Count': Visited_Count,
                            'Visited_On': new Date()
                        };
                        var url_click = 'https://www.policyboss.com/car-insurance/quotes?SID=' + dbFresh_Quote['Url'] + '&ClientID=2&utm_source=LERP_FRESH&utm_campaign=' + dbFresh_Quote['Ss_Id'] + '_0_0&utm_medium=' + dbFresh_Quote['Fresh_Quote_Id'];
                        var Client = require('node-rest-client').Client;
                        var client = new Client();
                        var today = moment().utcOffset("+05:30");
                        var erp_today_str = moment(today).format("YYYYMMDD_HHmmss");
                        var erp_api_visitor = 'http://ci.landmarkerp.com/RBServices.svc/PBVisitorStatus?QT=' + dbFresh_Quote['Erp_Qt'] + '&PBPageURL=' + encodeURIComponent(url_click) + '&VisitorStatus=QUOTE&VisitDate=' + erp_today_str;
                        client.get(erp_api_visitor, {}, function (dataRest, response) {
                            var today = moment().utcOffset("+05:30");
                            var today_str = moment(today).format("YYYYMMD");
                            var objRequest = {
                                'on': today,
                                'res': dataRest,
                                'url': erp_api_visitor,
                                'fqid': dbFresh_Quote['Fresh_Quote_Id']
                            };
                            fs.appendFile(appRoot + "/tmp/log/quote_visitor_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                        });
                        Fresh_Quote.update({'Fresh_Quote_Id': dbFresh_Quote.Fresh_Quote_Id}, {$set: objFresh_Quote}, function (err, numAffected) {
                            return res.redirect(url_click);
                        });
                    } else {
                        return res.send('Invalid URL Code');
                    }
                } catch (e) {
                    return res.send(e.stack);
                }
            }
        });
    });
    app.post('/evq/update', function (req, res) {
        let objReq = req.body;
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
    app.get('/evq_get/:Erp_Qt', function (req, res, next) {
        let Erp_Qt = (req.params.hasOwnProperty('Erp_Qt')) ? req.params['Erp_Qt'] : "";
        if (Erp_Qt === "" || Erp_Qt === null) {
            res.send('ERPQt Missing');
        } else {
            if (Erp_Qt.toString().toLowerCase().indexOf('qt') !== 0) {
                if (Erp_Qt.slice(-1) === "=") {
                    Erp_Qt = new Buffer(Erp_Qt, 'base64');
                    Erp_Qt = Erp_Qt.toString();
                    if (Erp_Qt.toString().toLowerCase().indexOf('qt') === 0) {

                    } else {
                        res.send('ERPQt Missing');
                    }
                } else {
                    res.send('ERPQt Missing');
                }
            }
            if (Erp_Qt.toString().toLowerCase().indexOf('Qt') !== 0) {
                Erp_Qt = Erp_Qt.toString().toUpperCase();
            }
            let fq_cond = {'Erp_Qt': Erp_Qt, 'Visited_Source': 'ERP'};
            Fresh_Quote.findOne(fq_cond).sort({'Fresh_Quote_Id': -1, "Created_On": -1}).exec(function (err, dbFresh_Quote) {
                if (err) {

                } else {
                    res.json(dbFresh_Quote);
                }
            });
        }
    });
    app.get('/fresh_quotes/qtdetails/:Erp_Qt', function (req, res, next) {
        let Erp_Qt = (req.params.hasOwnProperty('Erp_Qt')) ? req.params['Erp_Qt'] : "";
        if (Erp_Qt === "" || Erp_Qt === null) {
            res.send('ERPQt Missing');
        } else {
            if (Erp_Qt.toString().toLowerCase().indexOf('qt') !== 0) {
                if (Erp_Qt.slice(-1) === "=") {
                    Erp_Qt = new Buffer(Erp_Qt, 'base64');
                    Erp_Qt = Erp_Qt.toString();
                    if (Erp_Qt.toString().toLowerCase().indexOf('qt') === 0) {

                    } else {
                        res.send('ERPQt Missing');
                    }
                } else {
                    res.send('ERPQt Missing');
                }
            }
            if (Erp_Qt.toString().toLowerCase().indexOf('Qt') !== 0) {
                Erp_Qt = Erp_Qt.toString().toUpperCase();
            }
            let fq_cond = {'Erp_Qt': Erp_Qt, 'Visited_Source': 'ERP'};
            Fresh_Quote.findOne(fq_cond).sort({'Fresh_Quote_Id': -1, "Created_On": -1}).exec(function (err, dbFresh_Quote) {
                if (err) {

                } else {
                    res.json(dbFresh_Quote);
                }
            });
        }
    });
    app.get('/fresh_quotes/get_qt_details/:erp_qt', function (req, res, next) {
        let Erp_Qt = (req.params.hasOwnProperty('erp_qt')) ? req.params['erp_qt'] : "";
        if (Erp_Qt === "" || Erp_Qt === null) {
            res.send('ERPQt Missing');
        } else {
            if (Erp_Qt.toString().toLowerCase().indexOf('qt') !== 0) {
                if (Erp_Qt.slice(-1) === "=") {
                    Erp_Qt = new Buffer(Erp_Qt, 'base64');
                    Erp_Qt = Erp_Qt.toString();
                    if (Erp_Qt.toString().toLowerCase().indexOf('qt') === 0) {

                    } else {
                        res.send('ERPQt Missing');
                    }
                } else {
                    res.send('ERPQt Missing');
                }
            }
            if (Erp_Qt.toString().toLowerCase().indexOf('Qt') !== 0) {
                Erp_Qt = Erp_Qt.toString().toUpperCase();
            }
            let fq_cond = {'Erp_Qt': Erp_Qt, 'Visited_Source': 'ERP'};
            let fqdata_cond = {'Vehicle_Id': 1, 'Rto_Id': 1, '_id': 0, 'Row_Data.ClientName':1,'Row_Data.RTO_Full':1,'Row_Data.Vehicle_Full':1};
            Fresh_Quote.findOne(fq_cond, fqdata_cond).sort({'Fresh_Quote_Id': -1, "Created_On": -1}).exec(function (err, dbFresh_Quote) {
                if (err) {

                } else {
                    res.json(dbFresh_Quote);
                }
            });
        }
    });
    app.get('/fresh_quotes/posp_confirmation_process/:erp_qt/:rto_id/:vehicle_id/:is_claim_exists/:vehicle_ncb_current', function (req, res, next) {
        try {
            let Erp_Qt = (req.params.hasOwnProperty('erp_qt')) ? req.params['erp_qt'] : "";
            let Rto_Id = (req.params.hasOwnProperty('rto_id')) ? req.params['rto_id'] : "";
            let Veh_Id = (req.params.hasOwnProperty('vehicle_id')) ? req.params['vehicle_id'] : "";
            let Claim_Exist = (req.params.hasOwnProperty('is_claim_exists')) ? req.params['is_claim_exists'] : "";
            let Current_Ncb = (req.params.hasOwnProperty('vehicle_ncb_current')) ? req.params['vehicle_ncb_current'] : "";
            if (Erp_Qt === "" || Erp_Qt === null) {
                res.send({'Msg': 'Fail', 'Desc': 'erp_qt Missing'});
            } else if (Rto_Id === "" || Rto_Id === null) {
                res.send({'Msg': 'Fail', 'Desc': 'rto_id Missing'});
            } else if (Veh_Id === "" || Veh_Id === null) {
                res.send({'Msg': 'Fail', 'Desc': 'vehicle_id Missing'});
            } else if (Claim_Exist === "" || Claim_Exist === null) {
                res.send({'Msg': 'Fail', 'Desc': 'is_claim_exists Missing'});
            } else if (Current_Ncb === "" || Current_Ncb === null) {
                res.send({'Msg': 'Fail', 'Desc': 'vehicle_ncb_current Missing'});
            } else {
                let Client = require('node-rest-client').Client;
                let client = new Client();
                client.get(config.environment.weburl + '/fresh_quotes/qtdetails/' + Erp_Qt, function (qtRes) {
                    if (qtRes && ((qtRes.Vehicle_Id && qtRes.Vehicle_Id > 0) || (qtRes.Rto_Id && qtRes.Rto_Id > 0)) && qtRes.Row_Data) {
                        let is_breakin = 'no';
                        let reg1, reg2, reg3, reg4, lastdigit, first_name = "", middle_name = "", last_name = "";
                        let Registration_Num = qtRes['Registration_No'];
                        let breakindate = moment().format("YYYY-MM-DD");
                        if (moment(breakindate).isSameOrAfter(qtRes['Row_Data']['policy_expiry_date'])) {
                            is_breakin = 'yes';
                        }
                        if (Registration_Num.includes('-')) {
                            Registration_Num = Registration_Num.replace(/-/g, "");
                        } else if (Registration_Num && [9, 10, 11].indexOf(Registration_Num.length) > -1) {
                            Registration_Num = Registration_Num.toUpperCase();
                            let lastfour = Registration_Num.substr(Registration_Num.length - 4);
                            lastdigit = lastfour.match(/\d/g);
                            lastdigit = lastdigit.join("");
                            if (lastdigit.toString().length < 4) {
                                let lastdigitnumber = lastdigit - 0;
                                let lastdigitpadzero = this.pad(lastdigitnumber, 4);
                                Registration_Num = Registration_Num.replace(lastdigit, lastdigitpadzero);
                            }
                            if (Registration_Num.length === 11) {
                                Registration_Num = Registration_Num.substring(0, 2) + '-' + Registration_Num.substring(2, 4) + '-' + Registration_Num.substring(4, 7) + '-' + Registration_Num.substring(7, 11);
                            }
                            if (Registration_Num.length === 10) {
                                Registration_Num = Registration_Num.substring(0, 2) + '-' + Registration_Num.substring(2, 4) + '-' + Registration_Num.substring(4, 6) + '-' + Registration_Num.substring(6, 10);
                            }
                            if (Registration_Num.length === 9) {
                                Registration_Num = Registration_Num.substring(0, 2) + '-' + Registration_Num.substring(2, 4) + '-' + Registration_Num.substring(4, 5) + '-' + Registration_Num.substring(5, 9);
                            }
                        } else {
                            let reg_no_all = (qtRes['Rto_Code']).split('');
                            reg1 = reg_no_all[0] + reg_no_all[1];
                            reg2 = reg_no_all[2] + reg_no_all[3];
                            reg3 = "AA";
                            reg4 = "1234";
                            Registration_Num = reg1 + '-' + reg2 + '-' + reg3 + '-' + reg4;
                        }
                        if (qtRes['Row_Data']['ClientName'] !== "") {
                            let namearray = qtRes['Row_Data']['ClientName'].split(" ");
                            for (let i = 2; i < namearray.length; i++) {
                                middle_name = namearray[i - 1];
                            }
                            first_name = qtRes['Row_Data']['ClientName'].split(' ')[0];
                            last_name = namearray.length == 1 ? "" : namearray[namearray.length - 1];
                        }
                        let data = {
                            "product_id": 1,
                            "vehicle_id": Veh_Id,
                            "rto_id": Rto_Id,
                            "vehicle_insurance_type": "renew",
                            "vehicle_insurance_subtype": "1CH_0TP",
                            "vehicle_manf_date": qtRes['Row_Data']['MfgYear'] + '-' + moment().format("MM") + '-01',
                            "vehicle_registration_date": qtRes['Row_Data']['MfgYear'] + '-' + moment().format("MM-DD"),
                            "policy_expiry_date": qtRes['Row_Data']['policy_expiry_date'],
                            'is_breakin': is_breakin,
                            "prev_insurer_id": 2,
                            "vehicle_registration_type": "individual",
                            "vehicle_ncb_current": Current_Ncb,
                            "is_claim_exists": Claim_Exist,
                            "method_type": "Premium",
                            "execution_async": "yes",
                            "electrical_accessory": "0",
                            "non_electrical_accessory": "0",
                            "registration_no": Registration_Num,
                            "is_llpd": "no",
                            "is_antitheft_fit": "no",
                            "voluntary_deductible": "0",
                            "is_external_bifuel": "no",
                            "is_aai_member": "no",
                            "external_bifuel_type": "",
                            "external_bifuel_value": "0",
                            "pa_owner_driver_si": "0",
                            "is_pa_od": "no",
                            "is_having_valid_dl": "no",
                            "is_opted_standalone_cpa": "yes",
                            "pa_named_passenger_si": "0",
                            "pa_unnamed_passenger_si": "0",
                            "pa_paid_driver_si": "0",
                            "is_financed": "no",
                            "is_oslc": "no",
                            "oslc_si": 0,
                            "vehicle_expected_idv": 0,
                            "first_name": first_name,
                            "middle_name": middle_name,
                            "last_name": last_name,
                            "mobile": qtRes['Row_Data']['Phone'] ? qtRes['Row_Data']['Phone'] - 0 : "",
                            "email": qtRes['Row_Data']['EMail'] ? qtRes['Row_Data']['EMail'] : "",
                            "crn": 0,
                            "ss_id": 0,
                            "fba_id": 0,
                            "geo_lat": 0,
                            "geo_long": 0,
                            "agent_source": "",
                            "app_version": "PolicyBoss.com",
                            "search_reference_number": "",
                            "is_inspection_done": "no",
                            "is_policy_exist": "yes",
                            "ip_city_state": "_",
                            "sub_fba_id": 0,
                            "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                            "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                            "client_id": 2,
                            "is_mobile_verified": "yes",
                            "is_verified_quote": "yes",
                            "utm_source": "LERP_FRESH",
                            "utm_medium": qtRes['Erp_Qt'],
                            "utm_campaign": qtRes['Fresh_Quote_Id'],
                            "erp_qt": qtRes['Erp_Qt'],
                            "Campaign_Name": "webquote",
                            "campaign_source" : "new_campaign_design"
                        };
                        //res.json({'Msg': 'Success', 'Desc': data});
                        let args = {
                            data: data,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        client.post(config.environment.weburl + '/quote/premium_initiate', args, function (efqdata, response) {
                            if(efqdata.Summary){
                                if(efqdata.Summary.Request_Unique_Id){
                                    res.json({'Msg': 'Success', 'Desc': efqdata});
                                }else{
                                    res.json({'Msg': 'Fail', 'Desc': efqdata});
                                }
                            }else{
                                res.json({'Msg': 'Fail', 'Desc': efqdata});
                            }
                        });
                    } else {
                        res.json({'Msg': 'Fail', 'Desc': qtRes});
                    }
                });

            }
        } catch (ex) {
            console.error('/fresh_quotes/quote/create/ error : ' + ex.stack);
            res.json({'Msg': 'Error', 'Desc': ex.stack});
        }
    });
    app.get('/efq/:Erp_Qt', function (req, res) { // earlier evq now efq
        let Erp_Qt = (req.params.hasOwnProperty('Erp_Qt')) ? req.params['Erp_Qt'] : "";
        if (Erp_Qt === "" || Erp_Qt === null) {
            res.send('ERPQt Missing');
        } else {
            if (Erp_Qt.toString().toLowerCase().indexOf('qt') !== 0) {
                if (Erp_Qt.slice(-1) === "=") {
                    Erp_Qt = new Buffer(Erp_Qt, 'base64');
                    Erp_Qt = Erp_Qt.toString();
                    if (Erp_Qt.toString().toLowerCase().indexOf('qt') === 0) {

                    } else {
                        res.send('ERPQt Missing');
                    }
                } else {
                    res.send('ERPQt Missing');
                }
            }
            if (Erp_Qt.toString().toLowerCase().indexOf('Qt') !== 0) {
                Erp_Qt = Erp_Qt.toString().toUpperCase();
            }
            var start_date = new Date();
            var days = (req.query.hasOwnProperty('days')) ? req.query.days - 0 : 30;
            start_date.setDate(start_date.getDate() - days);
            start_date.setHours(00, 00, 00, 000);
            var end_date = new Date();
            end_date.setDate(end_date.getDate() + 0);
            end_date.setHours(00, 00, 00, 000);
            let fq_cond = {'Erp_Qt': Erp_Qt, 'Visited_Source': 'ERP', 'Created_On': {$gte: start_date, $lt: end_date}};
            //let fq_cond = {'Erp_Qt': Erp_Qt, 'Visited_Source': 'ERP'};
            Fresh_Quote.findOne(fq_cond).sort({'Fresh_Quote_Id': -1}).exec(function (err, dbFresh_Quote) {
                if (err) {
                    res.send(err);
                } else {
                    try {
                        if (dbFresh_Quote) {
                            dbFresh_Quote = dbFresh_Quote._doc;
                            if (Erp_Qt.toString().toLowerCase().indexOf('qt') === 0) {
                                if (dbFresh_Quote.hasOwnProperty('quote_url') && dbFresh_Quote.quote_url !== "") {
                                    var today = moment().utcOffset("+05:30");
                                    var erp_today_str = moment(today).format("YYYYMMDD_HHmmss");
                                    let erp_api_visitor = 'http://ci.landmarkerp.com/RBServices.svc/PBVisitorStatus?QT=' + dbFresh_Quote['Erp_Qt'] + '&PBPageURL=' + encodeURIComponent(dbFresh_Quote.quote_url) + '&VisitorStatus=QUOTE&VisitDate=' + erp_today_str;
                                    client.get(erp_api_visitor, {}, function (dataRest, response) {
                                        var today = moment().utcOffset("+05:30");
                                        var today_str = moment(today).format("YYYYMMD");
                                        var objRequest = {
                                            'on': today,
                                            'ref': req.headers || 'NA',
                                            'res': dataRest,
                                            'url': erp_api_visitor,
                                            'fqid': dbFresh_Quote['Fresh_Quote_Id']
                                        };
                                        fs.appendFile(appRoot + "/tmp/log/quote_visitor_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                        });
                                    });
                                    return res.redirect(dbFresh_Quote.quote_url);
                                } else {
                                    erpqt_respns = res;
                                    let Visited_History = dbFresh_Quote.hasOwnProperty('Visited_History') ? dbFresh_Quote.Visited_History : [];
                                    Visited_History.unshift(new Date());
                                    let Visited_Count = dbFresh_Quote.hasOwnProperty('Visited_Count') ? dbFresh_Quote.Visited_Count + 1 : 1;
                                    let objFresh_Quote = {
                                        'Visited_History': Visited_History,
                                        'Visited_Count': Visited_Count,
                                        'Visited_On': new Date(),
                                        'is_verified_quote': "no",
                                        'quote_url': ''
                                    };
                                    //res.json(dbFresh_Quote);
                                    Fresh_Quote.update({'Fresh_Quote_Id': dbFresh_Quote.Fresh_Quote_Id}, {$set: objFresh_Quote}, function (err, numAffected) {
                                        res.redirect(config.environment.portalurl + "/Motor/quotes?QT=" + Erp_Qt);
                                    });
                                }
                            }
                        } else {
                            client.get('http://ci.landmarkerp.com/RBServices.svc/GetPBVisitorData?QTNo=' + Erp_Qt + '&Token=UnVwZWVCb3NzU2VydmljZXMxNDEwMjA=', {}, function (erpqt, response) {
                                console.log('call_PBVisitorData - ' + JSON.stringify(erpqt));
                                if (erpqt['GetPBVisitorDataResult'] && erpqt['GetPBVisitorDataResult'][0]) {
                                    erpqt = erpqt['GetPBVisitorDataResult'][0];
                                    let Visited_History = [];
                                    Visited_History.unshift(new Date());
                                    let Visited_Count = 1;
                                    let obj_fresh_quote = {
                                        'Fresh_Quote_Job_Id': 178,
                                        'Camp_Name': 'Fresh_Dec_20',
                                        'Make': erpqt['Make'],
                                        'Model': erpqt['Model'],
                                        'Variant': erpqt['SubModel'],
                                        'Fuel': erpqt['FuelType'],
                                        'Cubic_Capacity': erpqt['CC'],
                                        'Rto_Code': erpqt['rto_code'],
                                        'Registration_No': erpqt['RegistrationNo'],
                                        'Erp_Qt': erpqt['QTNo'].toString().toUpperCase(),
                                        'Manf_Year': erpqt['MfgYear'],
                                        'Vehicle_Id': 0, //(erpqt['PBID'] !== '' && erpqt['PBID'] !== 0) ? erpqt['PBID'] : 0,
                                        'Base_Vehicle_Id': 0,
                                        'Rto_Id': 0,
                                        'Vehicle_Age': 0,
                                        'Ss_Id': erpqt.hasOwnProperty(erpqt['agent_uid']) ? erpqt[erpqt['agent_uid']] : 0,
                                        'Status': 'UPLOADED', // UPLOADED , VALIDATED , REJECTED, VERIFIED , MATCHED , NOTMATCHED , SURLCREATED                        
                                        'Created_On': new Date(),
                                        'Modified_On': new Date(),
                                        'Row_Data': erpqt,
                                        'Visited_History': Visited_History,
                                        'Visited_Count': Visited_Count,
                                        'Visited_On': new Date(),
                                        'Visited_Source': "ERP",
                                        'is_verified_quote': "no",
                                        'quote_url': ''
                                    };
                                    let objModelFresh_Quote = new Fresh_Quote(obj_fresh_quote);
                                    objModelFresh_Quote.save(function (err, objDbFresh_Quote) {
                                        if (err) {
                                            return res.send(err);
                                        } else
                                        {
                                            obj_fresh_quote.Fresh_Quote_Id = objDbFresh_Quote.Fresh_Quote_Id;
                                            let args = {
                                                data: {
                                                    "Make": (obj_fresh_quote.Make).toUpperCase(),
                                                    "Model": (obj_fresh_quote.Model).toUpperCase(),
                                                    "Variant": (obj_fresh_quote.Variant).toUpperCase(),
                                                    "Fuel": (obj_fresh_quote.Fuel).toUpperCase(),
                                                    "Cubic_Capacity": obj_fresh_quote.Cubic_Capacity,
                                                    "Rto_Code": obj_fresh_quote.Row_Data.rto_code !== "" ? obj_fresh_quote.Row_Data.rto_code : "",
                                                    "Rto_City": obj_fresh_quote.Row_Data.rto_city !== "" ? obj_fresh_quote.Row_Data.rto_city : "",
                                                    "Rto_State": obj_fresh_quote.Row_Data.rto_state !== "" ? obj_fresh_quote.Row_Data.rto_state : ""
                                                },
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            };
                                            console.log('erp_vehicle_match request ' + args.data);
                                            client.post(config.environment.weburl + '/erp_vehicle_match', args, function (veh1, res1) {
                                                if (veh1 && veh1.Vehicle_Matched && veh1.Vehicle_Matched === "yes" && veh1.RTO_Matched && veh1.RTO_Matched === "yes") {
                                                    obj_fresh_quote['Vehicle_Id'] = veh1.Vehicle_ID - 0;
                                                    obj_fresh_quote['Rto_Id'] = veh1.RTO_ID - 0;
                                                    //res.json(obj_fresh_quote);
                                                    let rto_codeTemp = obj_fresh_quote.Rto_Code !== "" ? obj_fresh_quote.Rto_Code : veh1.RTO_Full.split(' ')[0];
                                                    Fresh_Quote.update({'Fresh_Quote_Id': obj_fresh_quote.Fresh_Quote_Id}, {$set: {"Vehicle_Id": veh1.Vehicle_ID - 0, "Rto_Id": veh1.RTO_ID - 0, "Row_Data.Vehicle_Full": veh1.Vehicle_Full, "Row_Data.RTO_Full": veh1.RTO_Full, "Rto_Code": rto_codeTemp}}).sort({'Fresh_Quote_Id': -1}).exec(function (err, numAffected) {
                                                        console.log(numAffected);
                                                        res.redirect(config.environment.portalurl + "/Motor/quotes?QT=" + Erp_Qt);
                                                    });
                                                } else {
                                                    res.redirect(config.environment.portalurl + "/Motor/car_insurance?utm_source=LERP_FRESH&utm_medium=" + Erp_Qt + "&utm_campaign=0");
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    let url_click = config.environment.portalurl + "/Motor/car_insurance?utm_source=LERP_FRESH&utm_medium=" + Erp_Qt + "&utm_campaign=0";
                                    console.log('url_click - ' + url_click);
                                    res.redirect(url_click);
                                    //res.send({"Status": "Error", "MSG": "ERP Data Not Available"});
                                }
                            });
                        }
                    } catch (e) {
                        return res.send(e.stack);
                    }
                }
            });
        }
    });
    app.get('/efq_NIU/:Erp_Qt', function (req, res) { // on visitor allocation
        let Erp_Qt = (req.params.hasOwnProperty('Erp_Qt')) ? req.params['Erp_Qt'] : "";
        if (Erp_Qt === "" || Erp_Qt === null) {
            res.send('ERPQt Missing');
        } else {
            if (Erp_Qt.toString().toLowerCase().indexOf('qt') !== 0) {
                if (Erp_Qt.slice(-1) === "=") {
                    Erp_Qt = new Buffer(Erp_Qt, 'base64');
                    Erp_Qt = Erp_Qt.toString();
                    if (Erp_Qt.toString().toLowerCase().indexOf('qt') === 0) {

                    } else {
                        res.send('ERPQt Missing');
                    }
                } else {
                    res.send('ERPQt Missing');
                }
            }
            let fq_cond = {'Erp_Qt': Erp_Qt, 'Visited_Source': 'ERP'};
            Fresh_Quote.findOne(fq_cond).sort({'Fresh_Quote_Id': -1}).exec(function (err, dbFresh_Quote) {
                if (err) {
                    res.send(err);
                } else {
                    try {
                        if (dbFresh_Quote) {
                            dbFresh_Quote = dbFresh_Quote._doc;
                            if (Erp_Qt.toString().toLowerCase().indexOf('qt') === 0) {
                                if (dbFresh_Quote.hasOwnProperty('quote_url') && dbFresh_Quote.quote_url !== "") {
                                    var today = moment().utcOffset("+05:30");
                                    var erp_today_str = moment(today).format("YYYYMMDD_HHmmss");
                                    let erp_api_visitor = 'http://ci.landmarkerp.com/RBServices.svc/PBVisitorStatus?QT=' + dbFresh_Quote['Erp_Qt'] + '&PBPageURL=' + encodeURIComponent(dbFresh_Quote.quote_url) + '&VisitorStatus=QUOTE&VisitDate=' + erp_today_str;
                                    client.get(erp_api_visitor, {}, function (dataRest, response) {
                                        var today = moment().utcOffset("+05:30");
                                        var today_str = moment(today).format("YYYYMMD");
                                        var objRequest = {
                                            'on': today,
                                            'ref': req.headers || 'NA',
                                            'res': dataRest,
                                            'url': erp_api_visitor,
                                            'fqid': dbFresh_Quote['Fresh_Quote_Id']
                                        };
                                        fs.appendFile(appRoot + "/tmp/log/quote_visitor_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                        });
                                    });
                                    return res.redirect(dbFresh_Quote.quote_url);
                                } else if (false && dbFresh_Quote.hasOwnProperty('Rto_Code') && dbFresh_Quote.Rto_Code === "" && dbFresh_Quote.hasOwnProperty('Registration_No') && dbFresh_Quote.Registration_No === "") {
                                    return res.send('RTO data not avilable');
                                } else if (dbFresh_Quote.hasOwnProperty('Base_Vehicle_Id') && dbFresh_Quote.Base_Vehicle_Id === "" && dbFresh_Quote.hasOwnProperty('Vehicle_Id') && dbFresh_Quote.Vehicle_Id === "") {
                                    return res.send('Vehicle data not avilable');
                                } else {
                                    erpqt_respns = res;
                                    let Visited_History = dbFresh_Quote.hasOwnProperty('Visited_History') ? dbFresh_Quote.Visited_History : [];
                                    Visited_History.unshift(new Date());
                                    let Visited_Count = dbFresh_Quote.hasOwnProperty('Visited_Count') ? dbFresh_Quote.Visited_Count + 1 : 1;
                                    let objFresh_Quote = {
                                        'Visited_History': Visited_History,
                                        'Visited_Count': Visited_Count,
                                        'Visited_On': new Date(),
                                        'is_verified_quote': "no",
                                        'quote_url': ''
                                    };
                                    erpqt_req = dbFresh_Quote;
                                    client.get(config.environment.weburl + '/rtos/list', {}, function (rtos, response) {
                                        console.log('call_rto - ' + JSON.stringify(rtos));
                                        if (rtos) {
                                            premium_initate(dbFresh_Quote, rtos, req, '', res);
                                            Fresh_Quote.update({'Fresh_Quote_Id': dbFresh_Quote.Fresh_Quote_Id}, {$set: objFresh_Quote}, function (err, numAffected) {

                                            });
                                        } else {
                                            return res.send('RTO data not avilable');
                                        }
                                    });
                                }
                            }
                        } else {
                            client.get('http://ci.landmarkerp.com/RBServices.svc/GetPBVisitorData?QTNo=' + Erp_Qt + '&Token=UnVwZWVCb3NzU2VydmljZXMxNDEwMjA=', {}, function (erpqt, response) {
                                console.log('call_PBVisitorData - ' + JSON.stringify(erpqt));
                                if (erpqt['GetPBVisitorDataResult'] && erpqt['GetPBVisitorDataResult'][0]) {
                                    erpqt = erpqt['GetPBVisitorDataResult'][0];
                                    let Visited_History = [];
                                    Visited_History.unshift(new Date());
                                    let Visited_Count = 1;
                                    let obj_fresh_quote = {
                                        'Fresh_Quote_Job_Id': 178,
                                        'Camp_Name': 'Fresh_Dec_20',
                                        'Make': erpqt['Make'],
                                        'Model': erpqt['Model'],
                                        'Variant': erpqt['SubModel'],
                                        'Fuel': erpqt['FuelType'],
                                        'Cubic_Capacity': erpqt['CC'],
                                        'Rto_Code': erpqt['rto_code'],
                                        'Registration_No': erpqt['RegistrationNo'],
                                        'Erp_Qt': erpqt['QTNo'],
                                        'Manf_Year': erpqt['MfgYear'],
                                        'Vehicle_Id': 0, //(erpqt['PBID'] !== '' && erpqt['PBID'] !== 0) ? erpqt['PBID'] : 0,
                                        'Base_Vehicle_Id': 0,
                                        'Rto_Id': 0,
                                        'Vehicle_Age': 0,
                                        'Ss_Id': erpqt.hasOwnProperty(erpqt['agent_uid']) ? erpqt[erpqt['agent_uid']] : 0,
                                        'Status': 'UPLOADED', // UPLOADED , VALIDATED , REJECTED, VERIFIED , MATCHED , NOTMATCHED , SURLCREATED                        
                                        'Created_On': new Date(),
                                        'Modified_On': new Date(),
                                        'Row_Data': erpqt,
                                        'Visited_History': Visited_History,
                                        'Visited_Count': Visited_Count,
                                        'Visited_On': new Date(),
                                        'Visited_Source': "ERP",
                                        'is_verified_quote': "no",
                                        'quote_url': ''
                                    };
                                    let objModelFresh_Quote = new Fresh_Quote(obj_fresh_quote);
                                    objModelFresh_Quote.save(function (err, objDbFresh_Quote) {
                                        if (err) {
                                            return res.send(err);
                                        } else
                                        {
                                            obj_fresh_quote.Fresh_Quote_Id = objDbFresh_Quote.Fresh_Quote_Id;
                                            client.get(config.environment.weburl + '/rtos/list', {}, function (rtos, response) {
                                                var args = {
                                                    data: {
                                                        "Make": (obj_fresh_quote.Make).toUpperCase(),
                                                        "Model": (obj_fresh_quote.Model).toUpperCase(),
                                                        "Variant": (obj_fresh_quote.Variant).toUpperCase(),
                                                        "Fuel": (obj_fresh_quote.Fuel).toUpperCase(),
                                                        "Cubic_Capacity": obj_fresh_quote.Cubic_Capacity
                                                    },
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    }
                                                };
                                                client.post(config.environment.weburl + '/fresh_quotes/match_vehicle', args, function (veh1, res1) {
                                                    if (veh1 && veh1.Status && veh1.Status === "VEHICLE_MATCHED") {
                                                        obj_fresh_quote['Vehicle_Id'] = veh1.Vehicle_ID - 0;
                                                        premium_initate(obj_fresh_quote, rtos, req, erpqt, res);
                                                        Fresh_Quote.update({'Fresh_Quote_Id': obj_fresh_quote.Fresh_Quote_Id}, {$set: {"Vehicle_Id": veh1.Vehicle_ID - 0}}).sort({'Fresh_Quote_Id': -1}).exec(function (err, numAffected) {
                                                        });
                                                    } else {
                                                        let url_click = config.environment.portalurl + "/car-insurance?utm_source=LERP_FRESH&utm_medium=" + Erp_Qt + "&utm_campaign=0";
                                                        console.log('url_click - ' + url_click);
                                                        res.redirect(url_click);
                                                    }
                                                });
                                            });
                                        }
                                    });
                                } else {
                                    let url_click = config.environment.portalurl + "/car-insurance?utm_source=LERP_FRESH&utm_medium=" + Erp_Qt + "&utm_campaign=0";
                                    console.log('url_click - ' + url_click);
                                    res.redirect(url_click);
                                    //res.send({"Status": "Error", "MSG": "ERP Data Not Available"});
                                }
                            });
                        }
                    } catch (e) {
                        return res.send(e.stack);
                    }
                }
            });

        }
    });
    app.get('/fq/:Erp_Qt', function (req, res) {
        let Erp_Qt = (req.params.hasOwnProperty('Erp_Qt')) ? req.params['Erp_Qt'] : "";
        if (Erp_Qt === "" || Erp_Qt === null) {
            res.send('ERPQt Missing');
        } else {
            let fq_cond = {'Short_Code': Erp_Qt};
            if (Erp_Qt.toString().toLowerCase().indexOf('qt') === 0) {
                fq_cond = {'Erp_Qt': Erp_Qt};
            }
            Fresh_Quote.findOne(fq_cond).sort({'Fresh_Quote_Id': -1}).exec(function (err, dbFresh_Quote) {
                if (err) {
                    res.send(err);
                } else {
                    try {
                        if (dbFresh_Quote) {
                            dbFresh_Quote = dbFresh_Quote._doc;
                            if (dbFresh_Quote.hasOwnProperty('quote_url') && dbFresh_Quote.quote_url !== "") {
                                var today = moment().utcOffset("+05:30");
                                var erp_today_str = moment(today).format("YYYYMMDD_HHmmss");
                                let erp_api_visitor = 'http://ci.landmarkerp.com/RBServices.svc/PBVisitorStatus?QT=' + dbFresh_Quote['Erp_Qt'] + '&PBPageURL=' + encodeURIComponent(dbFresh_Quote.quote_url) + '&VisitorStatus=QUOTE&VisitDate=' + erp_today_str;
                                client.get(erp_api_visitor, {}, function (dataRest, response) {
                                    var today = moment().utcOffset("+05:30");
                                    var today_str = moment(today).format("YYYYMMD");
                                    var objRequest = {
                                        'on': today,
                                        'ref': req.headers || 'NA',
                                        'res': dataRest,
                                        'url': erp_api_visitor,
                                        'fqid': dbFresh_Quote['Fresh_Quote_Id']
                                    };
                                    fs.appendFile(appRoot + "/tmp/log/quote_visitor_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
                                        if (err) {
                                            return console.log(err);
                                        }
                                    });
                                });
                                return res.redirect(dbFresh_Quote.quote_url);
                            } else if (false && dbFresh_Quote.hasOwnProperty('Rto_Code') && dbFresh_Quote.Rto_Code === "" && dbFresh_Quote.hasOwnProperty('Registration_No') && dbFresh_Quote.Registration_No === "") {
                                return res.send('RTO data not avilable');
                            } else if (dbFresh_Quote.hasOwnProperty('Base_Vehicle_Id') && dbFresh_Quote.Base_Vehicle_Id === "" && dbFresh_Quote.hasOwnProperty('Vehicle_Id') && dbFresh_Quote.Vehicle_Id === "") {
                                return res.send('Vehicle data not avilable');
                            } else {
                                erpqt_respns = res;
                                let Visited_History = dbFresh_Quote.hasOwnProperty('Visited_History') ? dbFresh_Quote.Visited_History : [];
                                Visited_History.unshift(new Date());
                                let Visited_Count = dbFresh_Quote.hasOwnProperty('Visited_Count') ? dbFresh_Quote.Visited_Count + 1 : 1;
                                let objFresh_Quote = {
                                    'Visited_History': Visited_History,
                                    'Visited_Count': Visited_Count,
                                    'Visited_On': new Date(),
                                    'is_verified_quote': "no",
                                    'quote_url': ''
                                };
                                erpqt_req = dbFresh_Quote;
                                client.get(config.environment.weburl + '/rtos/list', {}, function (rtos, response) {
                                    console.log('call_rto - ' + JSON.stringify(rtos));
                                    if (rtos) {
                                        if (dbFresh_Quote.Erp_Qt.toString().toLowerCase().indexOf('qt') === 0) {

                                            client.get('http://ci.landmarkerp.com/RBServices.svc/GetPBVisitorData?QTNo=' + dbFresh_Quote.Erp_Qt + '&Token=UnVwZWVCb3NzU2VydmljZXMxNDEwMjA=', {}, function (erpqt, response) {
                                                console.log('call_PBVisitorData - ' + JSON.stringify(erpqt));
                                                if (erpqt['GetPBVisitorDataResult'] && erpqt['GetPBVisitorDataResult'][0]) {
                                                    erpqt = erpqt['GetPBVisitorDataResult'][0];
                                                    premium_initate(dbFresh_Quote, rtos, req, erpqt, res);
                                                } else {
                                                    premium_initate(dbFresh_Quote, rtos, req, '', res);
                                                    //return erpqt_respns.send('PB Visitor data not avilable');
                                                }


                                            });
                                        } else {
                                            premium_initate(dbFresh_Quote, rtos, req, '', res);
                                        }
                                        Fresh_Quote.update({'Fresh_Quote_Id': dbFresh_Quote.Fresh_Quote_Id}, {$set: objFresh_Quote}, function (err, numAffected) {

                                        });
                                    } else {
                                        return res.send('RTO data not avilable');
                                    }
                                });
                                //call_rto();
                            }
                        } else {
                            return res.send('Invalid Erp Qt');
                        }
                    } catch (e) {
                        return res.send(e.stack);
                    }
                }
            });
        }
    });
    app.post('/erp_vehicle_match', function (req, res, next) {
        let mv = {};
        mv['Make'] = req.body.Make;
        mv['Model'] = req.body.Model;
        mv['Variant'] = req.body.Variant;
        mv['Cubic_Capacity'] = req.body.Cubic_Capacity;
        mv['Fuel'] = req.body.Fuel;
        mv['Rto_Code'] = req.body.Rto_Code;
        mv['Rto_City'] = req.body.Rto_City;
        mv['Rto_State'] = req.body.Rto_State;
        try {
            let Vehicle = require('../models/vehicle');
            let make_erp_list = fs.readFileSync(appRoot + '/resource/request_file/ERP_Vehicle_Make.json').toString();
            make_erp_list = JSON.parse(make_erp_list);
            let vehrtoMatchSummary = {
                'Vehicle_ID': 0,
                'Vehicle_Full': '',
                'RTO_ID': 0,
                'RTO_Full': '',
                'Vehicle_Matched': '',
                'RTO_Matched': '',
                'Remark': ''
            };
            let obj_rto_vehicle = {
                'make_vehicle': '',
                'city_rto': '',
                'code_rto': ''
            };
            //console.log('dbVehicles -> ' + dbVehicles);
            if (make_erp_list && make_erp_list[mv['Make']] && make_erp_list[mv['Make']] !== "") {
                //console.log('dbVehicles -> ' + dbVehicles[0]['PB_Make_Name']);
                obj_rto_vehicle.make_vehicle = (make_erp_list[mv['Make']]);
                Vehicle.find({'Product_Id_New': 1, 'Make_Name': obj_rto_vehicle.make_vehicle}).exec(function (err, dbVehicles) {
                    let arr_vehicles_full = {};
                    let obj_make_vehicle = obj_rto_vehicle.make_vehicle;
                    let fq = mv;
                    if (dbVehicles && dbVehicles.length > 0) {
                        for (let k in dbVehicles) {
                            arr_vehicles_full[dbVehicles[k]._doc['Vehicle_ID']] = dbVehicles[k]._doc;
                        }
                        console.log(JSON.stringify(arr_vehicles_full));
                        console.log(JSON.stringify(obj_make_vehicle));
                        let Matched_Score = 0;
                        let Source_String = '';
                        let arr_Source_String_Key = ['Make', 'Model', 'Variant', 'Fuel', 'Cubic_Capacity'];
                        let arr_Source_String = [];
                        for (let i in arr_Source_String_Key) {
                            if (fq[arr_Source_String_Key[i]] && fq[arr_Source_String_Key[i]] !== '') {
                                arr_Source_String.push(fq[arr_Source_String_Key[i]]);
                            }
                        }
                        Source_String = arr_Source_String.join(' ');
                        let obj_match_vehicle = {};
                        let obj_match_vehicle_full = {};
                        let match_vehicle_id = 0;
                        let match_vehicle_full = '';
                        for (let i in arr_vehicles_full) {
                            let indVehicle = arr_vehicles_full[i];
                            let TargetString = indVehicle['Make_Name'] + ' ' + indVehicle['Model_Name'] + ' ' + indVehicle['Variant_Name'] + ' ' + indVehicle['Fuel_Name'] + ' ' + indVehicle['Cubic_Capacity'];
                            let matchScore = fuzzy(Source_String, TargetString);
                            if (matchScore > 0) {
                                obj_match_vehicle[indVehicle['Vehicle_ID']] = matchScore;
                                obj_match_vehicle_full[indVehicle['Vehicle_ID']] = {
                                    'matchScore': matchScore,
                                    'TargetString': TargetString
                                };
                            }
                        }
                        if (Object.keys(obj_match_vehicle).length > 0) {
                            obj_match_vehicle = sortObject(obj_match_vehicle);
                            let Matched_Score_Temp = 0;
                            for (let v in obj_match_vehicle) {
                                Matched_Score_Temp = obj_match_vehicle[v];
                                if ((Matched_Score_Temp > Matched_Score)) {
                                    Matched_Score = obj_match_vehicle[v];
                                    match_vehicle_id = v;
                                    match_vehicle_full = obj_match_vehicle_full[v]['TargetString'];
                                }
                            }
                        }
                        if (Matched_Score > 0.5) {
                            vehrtoMatchSummary.Vehicle_Matched = 'yes';
                            vehrtoMatchSummary.Vehicle_ID = match_vehicle_id;
                            vehrtoMatchSummary.Vehicle_Full = match_vehicle_full;
                        } else {
                            vehrtoMatchSummary.Vehicle_Matched = 'no';
                        }
                        //RTO
                        let Rto = require('../models/rto');
                        Rto.find({}).exec(function (err, dbRto) {
                            if (dbRto && dbRto.length > 0) {
                                let arr_rto_full = {};
                                console.log('dbRto' + dbRto);
                                let Matched_Score_Rto = 0;
                                for (let n in dbRto) {
                                    arr_rto_full[dbRto[n]._doc['VehicleCity_Id']] = dbRto[n]._doc;
                                }
                                let SourceStringRto = fq['Rto_Code'] + ' ' + fq['Rto_City'] + ' ' + fq['Rto_State'];
                                let obj_match_rto = {};
                                let obj_match_rto_full = {};
                                let match_rto_id = 0;
                                let match_rto_full = 0;
                                for (let j in arr_rto_full) {
                                    let indRto = arr_rto_full[j];
                                    let TargetStringRto = indRto['VehicleCity_RTOCode'] + ' ' + (indRto['RTO_City']).toUpperCase() + ' ' + (indRto['State_Name']).toUpperCase();
                                    let matchScore = fuzzy(SourceStringRto, TargetStringRto);
                                    if (matchScore > 0) {
                                        obj_match_rto[indRto['VehicleCity_Id']] = matchScore;
                                        obj_match_rto_full[indRto['VehicleCity_Id']] = {
                                            'matchScore': matchScore,
                                            'TargetString': TargetStringRto
                                        };
                                    }
                                }
                                if (Object.keys(obj_match_rto).length > 0) {
                                    obj_match_rto = sortObject(obj_match_rto);
                                    let Matched_Score_Rto_Temp = 0;
                                    for (let x in obj_match_rto) {
                                        Matched_Score_Rto_Temp = obj_match_rto[x];
                                        if ((Matched_Score_Rto_Temp > Matched_Score_Rto)) {
                                            Matched_Score_Rto = obj_match_rto[x];
                                            match_rto_id = x;
                                            match_rto_full = obj_match_rto_full[x]['TargetString'];
                                        }
                                    }
                                }
                                if (Matched_Score_Rto > 0.5) {
                                    vehrtoMatchSummary.RTO_Matched = 'yes';
                                    vehrtoMatchSummary.RTO_ID = match_rto_id;
                                    vehrtoMatchSummary.RTO_Full = match_rto_full;
                                } else {
                                    vehrtoMatchSummary.RTO_Matched = 'no';
                                }
                            } else {
                                vehrtoMatchSummary.RTO_Matched = 'no';
                            }
                            res.json(vehrtoMatchSummary);
                        });
                    } else {
                        vehrtoMatchSummary.Vehicle_Matched = 'no';
                        res.json(vehrtoMatchSummary);
                    }
                });
            } else {
                vehrtoMatchSummary.Vehicle_Matched = 'no';
                res.json(vehrtoMatchSummary);
            }
        } catch (e) {
            vehrtoMatchSummary.Vehicle_Matched = 'no';
            vehrtoMatchSummary.Remark = e.stack;
            res.json(vehrtoMatchSummary);
            //console.error('erp_vehicle_match error' + e.stack);
        }
    });
    function premium_initate(dbFresh_Quote, erpqt_rto, req, erpqt) {
        if (erpqt_rto) {
            let vehicleId = dbFresh_Quote.hasOwnProperty('Vehicle_Id') ? dbFresh_Quote.Vehicle_Id : dbFresh_Quote.Base_Vehicle_Id;
            let rtoId = 580;
            let regCode = 'MH02';
            if (dbFresh_Quote.Row_Data.hasOwnProperty('rto_code') && dbFresh_Quote.Row_Data.rto_code !== '') {
                for (let j in erpqt_rto) {
                    if (erpqt_rto[j].hasOwnProperty('VehicleCity_RTOCode') && erpqt_rto[j].VehicleCity_RTOCode.toString().toLowerCase().indexOf(dbFresh_Quote.Row_Data.rto_code.toString().toLowerCase()) > -1) {
                        rtoId = erpqt_rto[j].VehicleCity_Id;
                        regCode = erpqt_rto[j].VehicleCity_RTOCode;
                        break;
                    }
                }
            } else if (dbFresh_Quote.Row_Data.hasOwnProperty('rto_city') && dbFresh_Quote.Row_Data.rto_city !== '') {
                for (let j in erpqt_rto) {
                    if (erpqt_rto[j].hasOwnProperty('RTO_City') && erpqt_rto[j].RTO_City.toString().toLowerCase().indexOf(dbFresh_Quote.Row_Data.rto_city.toString().toLowerCase()) > -1) {
                        rtoId = erpqt_rto[j].VehicleCity_Id;
                        regCode = erpqt_rto[j].VehicleCity_RTOCode;
                        break;
                    }
                }
            }
            dbFresh_Quote.Registration_No = (dbFresh_Quote.Registration_No !== "") ? dbFresh_Quote.Registration_No : regCode.substring(0, 2) + '-' + regCode.substring(2) + '-ZZ-9999';
            let reg_date = (dbFresh_Quote.Row_Data['vehicle_registration_date'] !== '') ? dbFresh_Quote.Row_Data['vehicle_registration_date'] : dbFresh_Quote.Manf_Year;
            reg_date = reg_date === undefined ? (dbFresh_Quote.Row_Data['MfgYear'] ? dbFresh_Quote.Row_Data['MfgYear'] : moment().subtract(1, 'years').format('YYYY')) + "-" + moment().format('MM-DD') : reg_date;
            let veh_age = (moment().utcOffset("+05:30")).diff(moment(reg_date, 'YYYY-MM-DD'), 'years');
            let ncb = {
                0: 0,
                1: 20,
                2: 25,
                3: 35,
                4: 45,
                5: 50
            };
            let ncb_current = veh_age > 5 ? 50 : ncb[veh_age];
            let expiry_date = dbFresh_Quote.Row_Data.policy_expiry_date;
            if (moment(dbFresh_Quote.Row_Data.policy_expiry_date, 'DD-MM-YYYY', true).isValid()) {
                expiry_date = moment(dbFresh_Quote.Row_Data.policy_expiry_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
            }
            let first_name = "";
            let last_name = "";
            let middle_name = "";
            if (dbFresh_Quote.Row_Data.ClientName) {
                let name = dbFresh_Quote.Row_Data.ClientName;
                let tmpName = name.split(" ");
                if (tmpName.length > 2) {
                    first_name = tmpName[0];
                    last_name = tmpName[2];
                    middle_name = tmpName[1];
                } else {
                    first_name = tmpName[0];
                    last_name = tmpName[1];
                }
            }

            let obj = {
                "product_id": 1,
                "vehicle_id": vehicleId,
                "rto_id": rtoId,
                "vehicle_insurance_type": "renew",
                "vehicle_insurance_subtype": "1CH_0TP",
                "vehicle_manf_date": dbFresh_Quote.Manf_Year,
                "vehicle_registration_date": reg_date,
                "policy_expiry_date": expiry_date,
                "prev_insurer_id": 2,
                "vehicle_registration_type": "individual",
                "vehicle_ncb_current": (dbFresh_Quote.Row_Data['vehicle_ncb_current'] !== '') ? (dbFresh_Quote.Row_Data['vehicle_ncb_current'] === undefined ? 0 : dbFresh_Quote.Row_Data['vehicle_ncb_current']) : ncb_current,
                //"is_claim_exists": (dbFresh_Quote.Row_Data['is_claim_exists'] !== '') ? (dbFresh_Quote.Row_Data['is_claim_exists'] === undefined ? "yes" : dbFresh_Quote.Row_Data['is_claim_exists']) : 'no',
                "is_claim_exists": 'no',
                "method_type": "Premium",
                "execution_async": "yes",
                "electrical_accessory": "0",
                "non_electrical_accessory": "0",
                "registration_no": dbFresh_Quote.Registration_No,
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
                "first_name": first_name,
                "middle_name": middle_name,
                "last_name": last_name,
                "mobile": (dbFresh_Quote.Row_Data.Phone) ? (dbFresh_Quote.Row_Data.Phone).split('/')[0] - 0 : 9999999999,
                "email": (dbFresh_Quote.Row_Data.EMail) ? (dbFresh_Quote.Row_Data.EMail).split('/')[0] : "",
                "crn": 0,
                "ss_id": dbFresh_Quote.Ss_Id,
                "fba_id": 0,
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
                "policy_tenure": 1,
                "policy_od_tenure": 1,
                "policy_tp_tenure": 1,
                "client_id": 2,
                "client_name": "PolicyBoss",
                "udid": 0,
                "idv_by_crn": "yes",
                "erp_source": "FRESH-MTR",
                "is_posp": "no",
                "channel": "DIRECT",
                "subchannel": "DIRECT",
                "is_mobile_verified": "yes",
                "is_verified_quote": "yes",
                "utm_source": "LERP_FRESH",
                "utm_medium": dbFresh_Quote.Erp_Qt,
                "utm_campaign": dbFresh_Quote.Fresh_Quote_Id,
                "erp_qt": dbFresh_Quote.Erp_Qt
            };
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
                        //let url_click = config.environment.portalurl + "/car-insurance/quotes?SID=" + data.Summary.Request_Unique_Id + "&ClientID=2";
                        let url_click = config.environment.portalurl + "/Motor/quotes?SID=" + data.Summary.Request_Unique_Id + "&ClientID=2";
                        console.log('url_click - ' + url_click);
                        let objFresh_Quote_URL = {
                            'quote_url': url_click
                        };
                        Fresh_Quote.update({'Fresh_Quote_Id': dbFresh_Quote.Fresh_Quote_Id}, {$set: objFresh_Quote_URL}, function (err, numAffected) {
                            //return res.redirect(url_click);
                        });
                        var Client = require('node-rest-client').Client;
                        var client = new Client();
                        var today = moment().utcOffset("+05:30");
                        var erp_today_str = moment(today).format("YYYYMMDD_HHmmss");
                        let erp_api_visitor = 'http://ci.landmarkerp.com/RBServices.svc/PBVisitorStatus?QT=' + dbFresh_Quote['Erp_Qt'] + '&PBPageURL=' + encodeURIComponent(url_click) + '&VisitorStatus=QUOTE&VisitDate=' + erp_today_str;
                        client.get(erp_api_visitor, {}, function (dataRest, response) {
                            var today = moment().utcOffset("+05:30");
                            var today_str = moment(today).format("YYYYMMD");
                            let objRequest = {
                                'on': today,
                                'ref': req.headers || 'NA',
                                'res': dataRest,
                                'url': erp_api_visitor,
                                'fqid': dbFresh_Quote.Fresh_Quote_Id
                            };
                            fs.appendFile(appRoot + "/tmp/log/quote_visitor_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                        });
                        let sleep = require('system-sleep');
                        //sleep(2000);
                        return obj_res.redirect(url_click);
                    }
                }
            });
        } else {
            return obj_res.send('RTO data not avilable');
        }
    }
    app.post('/fq/lead_allocation', function (req, res) {
        try {
            var Fresh_Quote = require('../models/fresh_quote');
            var objRequest = req.body;
            var Fresh_Quote_Id = objRequest['Fresh_Quote_Id'];
            var Campaign_Name = objRequest['Campaign_Name'];
            var url_api = config.environment.weburl + '/get_allocation_list/webquote';
            var Client = require('node-rest-client').Client;
            var client = new Client();
            client.get(url_api, function (data, response) {
                listData = data;
                var myquery = {Fresh_Quote_Id: Fresh_Quote_Id - 0};
                var newvalues = {$set: {lead_assigned: data.uid, lead_assigned_name: data.name, lead_assigned_on: new Date(), Modified_On: new Date()}};
                Fresh_Quote.updateOne(myquery, newvalues, function (e, resp) {
                    if (e) {
                        console.log(e);
                        res.json({"Msg": e});
                    } else {
                        res.json({"Msg": "Success"});
                    }
                });
            });
        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });
    app.get('/efq/get/:Erp_Qt', function (req, res) {
        let Erp_Qt = (req.params.hasOwnProperty('Erp_Qt')) ? req.params['Erp_Qt'] : "";
        Fresh_Quote.findOne({'Erp_Qt': Erp_Qt}).sort({'Erp_Qt': -1}).exec(function (err, dbFresh_Quote) {
            if (err) {
                res.send(err);
            } else {
                try {
                    if (dbFresh_Quote) {
                        dbFresh_Quote = dbFresh_Quote._doc;
                        res.send(dbFresh_Quote);
                    } else {
                        return res.send('Invalid Erp Qt');
                    }
                } catch (e) {
                    return res.send(e.stack);
                }
            }
        });
    });
    app.get('/efq/vehicles/:makeName', function (req, res) {
        var Vehicle = require('../models/vehicle');
        var Make_Name = (req.params.hasOwnProperty('makeName')) ? req.params['makeName'] : "";
        //Vehicle.find({'Product_Id_New': 1, Make_Name: new RegExp(Make_Name, 'i') }, {Vehicle_ID: 1, Variant_Name: 1, Cubic_Capacity: 1, Make_Name: 1, Model_Name: 1, Fuel_Name: 1}, function (err, dbVehicle) {
        Vehicle.find({'Product_Id_New': 1}, {Vehicle_ID: 1, Variant_Name: 1, Cubic_Capacity: 1, Make_Name: 1, Model_Name: 1, Fuel_Name: 1}, function (err, dbVehicle) {
            if (err) {
                res.send(err);
            } else {
                try {
                    if (dbVehicle) {
                        var dbVehiclearr = [];
                        for (var i in dbVehicle) {
                            var ObjJson = {"Make_Name": dbVehicle[i]._doc['Make_Name'],
                                "Model_ID": dbVehicle[i]._doc['Model_ID'],
                                "Model_Name": dbVehicle[i]._doc['Model_Name'],
                                "vehicle_name": dbVehicle[i]._doc['Make_Name'] + " " + dbVehicle[i]._doc['Model_Name'] + " " + dbVehicle[i]._doc['Variant_Name'],
                                "Fuel_Name": dbVehicle[i]._doc['Fuel_Name'],
                                "Variant_Name": dbVehicle[i]._doc['Variant_Name'],
                                "Cubic_Capacity": dbVehicle[i]._doc['Cubic_Capacity'],
                                "Vehicle_ID": dbVehicle[i]._doc['Vehicle_ID']
                            };
                            dbVehiclearr.push(ObjJson);
                        }
                        res.send(dbVehiclearr);
                    } else {
                        res.send('vehicles data not avilable');
                    }
                } catch (e) {
                    res.send(e.stack);
                }
            }
        });
    });
    app.post('/efq/update_erpqt_url', function (req, res) {
        var erpqt_id = (req.body.hasOwnProperty('erpqt_id')) ? req.body['erpqt_id'] : "";
        var url_click = (req.body.hasOwnProperty('url')) ? req.body['url'] : "";
        let objFresh_Quote_URL = {
            'quote_url': config.environment.portalurl + url_click,
            'is_verified_quote': 'yes'
        };
        Fresh_Quote.update({'Erp_Qt': erpqt_id}, {$set: objFresh_Quote_URL}, function (err, numAffected) {
            return res.redirect('success');
        });
    });

    app.get('/rq/:SRN_UDID', function (req, res) {
        var Const_Product = {
            '1': 'Car',
            '2': 'Health',
            '4': 'Travel',
            '3': 'Term',
            '10': 'TW',
            '12': 'CV',
            '17': 'CoronaCare',
            '18': 'CyberSecurity'
        };
        let SRN_UDID = (req.params.hasOwnProperty('SRN_UDID')) ? req.params['SRN_UDID'] : "";
        if (SRN_UDID === "" || SRN_UDID === null) {
            res.send('SRN UDID Missing');
        } else {
            var Lead = require('../models/leads');
            let UDID = SRN_UDID.split('_')[1];
            Lead.findOne({'User_Data_Id': UDID - 0, "renewal_data.Erp_Qt_Request_Core": {$exists: true}}).sort({'Modified_On': -1}).exec(function (err, dbFresh_Data) {
                if (err) {
                    res.send(err);
                } else {
                    try {
                        if (dbFresh_Data) {
                            dbFresh_Data = dbFresh_Data._doc;
                            let Visited_History = dbFresh_Data.hasOwnProperty('Visited_History') ? dbFresh_Data.Visited_History : [];
                            Visited_History.unshift(new Date());
                            let Visited_Count = dbFresh_Data.hasOwnProperty('Visited_Count') ? dbFresh_Data.Visited_Count + 1 : 1;
                            let objFresh_Quote = {
                                'Visited_History': Visited_History,
                                'Visited_Count': Visited_Count,
                                'Visited_On': new Date()
                            };
                            Lead.update({'User_Data_Id': dbFresh_Data.User_Data_Id - 0}, {$set: objFresh_Quote}, function (err, numAffected) {
                                console.log('msg - ' + numAffected);
                            });
                            if (dbFresh_Data.hasOwnProperty('quote_url') && dbFresh_Data.quote_url !== "") {
                                res.redirect(dbFresh_Data.quote_url);
                            } else {
                                let dbFresh_Data_ERP = dbFresh_Data.renewal_data.Erp_Qt_Request_Core;
                                //res.send(dbFresh_Data);
                                rq_res = res;
                                let obj_ncb = {
                                    0: 20,
                                    20: 25,
                                    25: 35,
                                    35: 45,
                                    45: 50,
                                    50: 50
                                };
                                let obj = {
                                    "product_id": dbFresh_Data_ERP['___product_id___'],
                                    "vehicle_id": dbFresh_Data_ERP['___vehicle_id___'],
                                    "rto_id": dbFresh_Data_ERP['___rto_id___'],
                                    "vehicle_insurance_type": "renew",
                                    "vehicle_registration_date": dbFresh_Data_ERP['___vehicle_registration_date___'],
                                    "vehicle_manf_date": dbFresh_Data_ERP['___vehicle_manf_date___'],
                                    "policy_expiry_date": dbFresh_Data_ERP['___policy_end_date___'],
                                    "prev_insurer_id": dbFresh_Data_ERP['___insurer_id___'],
                                    "vehicle_registration_type": dbFresh_Data_ERP['___vehicle_registration_type___'],
                                    "vehicle_ncb_current": dbFresh_Data_ERP['___is_claim_exists___'] === "yes" ? 0 : obj_ncb[dbFresh_Data_ERP['___vehicle_ncb_current___']],
                                    "is_claim_exists": dbFresh_Data_ERP['___is_claim_exists___'],
                                    "method_type": "Premium",
                                    "execution_async": "yes",
                                    "electrical_accessory": dbFresh_Data_ERP['___electrical_accessory___'],
                                    "non_electrical_accessory": dbFresh_Data_ERP['___non_electrical_accessory___'],
                                    "registration_no": dbFresh_Data_ERP['___registration_no___'],
                                    "is_llpd": dbFresh_Data_ERP['___is_llpd___'],
                                    "is_antitheft_fit": dbFresh_Data_ERP['___is_antitheft_fit___'],
                                    "is_external_bifuel": dbFresh_Data_ERP['___is_external_bifuel___'],
                                    "is_aai_member": dbFresh_Data_ERP['___is_aai_member___'],
                                    "external_bifuel_type": dbFresh_Data_ERP['___external_bifuel_type___'],
                                    "external_bifuel_value": dbFresh_Data_ERP['___external_bifuel_value___'],
                                    "pa_owner_driver_si": 0,
                                    "is_pa_od": "no",
                                    "is_having_valid_dl": "no",
                                    "is_opted_standalone_cpa": "yes",
                                    "pa_paid_driver_si": dbFresh_Data_ERP['___pa_paid_driver_si___'],
                                    "first_name": dbFresh_Data_ERP['___first_name___'],
                                    "mobile": dbFresh_Data_ERP['___mobile___'],
                                    "email": dbFresh_Data_ERP['___email___'],
                                    "crn": 0,
                                    "ss_id": dbFresh_Data_ERP['___ss_id___'],
                                    "client_id": 2,
                                    "fba_id": dbFresh_Data_ERP['___fba_id___'],
                                    "geo_lat": dbFresh_Data_ERP['___geo_lat___'],
                                    "geo_long": dbFresh_Data_ERP['___geo_long___'],
                                    "agent_source": dbFresh_Data_ERP['___agent_source___'],
                                    "app_version": dbFresh_Data_ERP['___app_version___'],
                                    "vehicle_insurance_subtype": "1CH_0TP",
                                    "secret_key": dbFresh_Data_ERP['___secret_key___'],
                                    "client_key": dbFresh_Data_ERP['___client_key___'],
                                    "is_breakin": "no",
                                    "is_fastlane_rto": "no",
                                    "is_inspection_done": "no",
                                    "is_policy_exist": "yes",
                                    "is_financed": "no",
                                    "is_oslc": "no",
                                    "oslc_si": 0,
                                    "sub_fba_id": dbFresh_Data_ERP['___sub_fba_id___'],
                                    "ip_city_state": dbFresh_Data_ERP['___ip_city_state___'],
                                    "last_name": dbFresh_Data_ERP['___last_name___'],
                                    "middle_name": dbFresh_Data_ERP['___middle_name___'],
                                    "og_crn": dbFresh_Data_ERP['___crn___'],
                                    "og_udid": dbFresh_Data_ERP['___udid___'],
                                    "is_mobile_verified": "yes",
                                    "is_verified_quote": "no",
                                    "utm_source": "ONLINE_RENEWAL",
                                    "utm_medium": dbFresh_Data_ERP['___udid___'],
                                    "utm_campaign": dbFresh_Data_ERP['___udid___']
                                };
                                var args = {
                                    data: obj,
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                };
                                client.post(config.environment.weburl + '/quote/premium_initiate', args, function (data, matchpoint_data) {
                                    console.log('premium_initiate - ' + data);
                                    if (data.Summary) {
                                        if (data.Summary.Request_Unique_Id)
                                        {
                                            var product_name = "car-insurance";
                                            if (data.Request && data.Request.product_id && data.Request.product_id == 10) {
                                                product_name = "two-wheeler-insurance";
                                            }
                                            let url_click = config.environment.portalurl + "/" + product_name + "/quotes?SID=" + data.Summary.Request_Unique_Id + "&ClientID=2";
                                            console.log('url_click - ' + url_click);
                                            Lead.update({'User_Data_Id': data.Request.og_udid - 0}, {$set: {"quote_url": url_click}}, function (err, numAffected) {
                                            });
                                            try {
                                                //send visit email start
                                                let is_agent_email_valid = false;
                                                if ((dbFresh_Data_ERP['___ss_id___'] - 0) > 0) {
                                                    if (data.Request.hasOwnProperty('posp_email_id') && data.Request['posp_email_id'] && data.Request['posp_email_id'].toString().indexOf('@') > -1) {
                                                        is_agent_email_valid = true;
                                                    }
                                                }
                                                if (is_agent_email_valid) {
                                                    let msg = "Dear ___AGENT_NAME___,\n\
\n\
Your customer named , ___CUSTOMER_NAME___, has visited on PolicyBoss prepared Quotation link from SMS regarding Policy Renewal.\n\
\n\
The customer details are as below.\n\
CRN : ___PB_CRN___\n\
Last Year CRN : ___PREV_PB_CRN___\n\
Product : ___PRODUCT__\n\
Vehicle : ___VEHICLE__\n\
Policy Expiry On : ___EXPIRY_DATE___\n\
Quote Link Visited On : ___VISIT_ON___\n\
\n\
Kindly contact the customer to fulfill the policy renewal requirement.\n\
\n\
Team,\n\
PolicyBoss";
                                                    let obj_email_visit = {
                                                        '___AGENT_NAME___': dbFresh_Data_ERP['___posp_first_name___'] + ' ' + dbFresh_Data_ERP['___posp_last_name___'],
                                                        '___CUSTOMER_NAME___': dbFresh_Data_ERP['___contact_name___'],
                                                        '___PB_CRN___': data.Request.crn,
                                                        '___PREV_PB_CRN___': dbFresh_Data_ERP['___crn___'],
                                                        '___PRODUCT__': Const_Product[dbFresh_Data_ERP['___product_id___']],
                                                        '___VEHICLE__': dbFresh_Data_ERP['___vehicle_full___'].replace(/\|/g, ','),
                                                        '___EXPIRY_DATE___': dbFresh_Data_ERP['___policy_end_date___'],
                                                        '___VISIT_ON___': (new Date()).toLocaleString()
                                                    };
                                                    for (var s in obj_email_visit) {
                                                        msg = msg.replace(s, obj_email_visit[s]);
                                                    }
                                                    msg = msg.replace(/\n/g, '<BR>');
                                                    var subject = '[RENEWAL-VISIT] Customer visits on Renewal Quote Link CRN : ' + data.Request.crn;
                                                    var content_html = '<!DOCTYPE html><html><head><style>*,html,body{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>' + subject + '</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                    content_html += '<p>' + msg + '</p>';
                                                    content_html += '</body></html>';
                                                    var Email = require('../models/email');
                                                    var objModelEmail = new Email();
                                                    let arr_to = data.Request['posp_email_id'];
                                                    let arr_cc = '';
                                                    if (data.Request.hasOwnProperty('posp_reporting_email_id') && data.Request['posp_reporting_email_id'] && data.Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                                        arr_cc = data.Request['posp_reporting_email_id'];
                                                    }
                                                    objModelEmail.send('notifications@policyboss.com', arr_to, subject, content_html, arr_cc, config.environment.notification_email, data.Request.crn);
                                                }
                                            } catch (e) {
                                                console.error('EXCEPTION', 'RQ_VISIT_EMAIL_ERR', e.stack);
                                            }
                                            //send visit email stop
                                            return rq_res.redirect(url_click);
                                        } else {
                                            return rq_res.send(data.Summary);
                                        }
                                    } else {
                                        return rq_res.send(data);
                                    }

                                });
                            }
                        } else {
                            return res.send('Invalid SRN UDID');
                        }
                    } catch (e) {
                        return res.send(e.stack);
                    }
                }
            });
        }
    });

    app.post('/lms_lead_create', function (req, res) {
        try {
            var User_Data = require('../models/user_data');
            let objRequest = req.body;
            let ud_cond;
            if (objRequest['crn'] && objRequest['crn'] - 0 > 0) {
                ud_cond = {"PB_CRN": objRequest['crn'] - 0, "Last_Status": {$in: ["TRANS_SUCCESS_WO_POLICY", "TRANS_SUCCESS_WITH_POLICY"]}};
            }
            if (objRequest['udid'] && objRequest['udid'] - 0 > 0) {
                ud_cond = {"User_Data_Id": objRequest['udid'] - 0, "Last_Status": {$in: ["TRANS_SUCCESS_WO_POLICY", "TRANS_SUCCESS_WITH_POLICY"]}};
            }
            listData = objRequest;
            User_Data.findOne(ud_cond, function (err, dbUserData) {
                if (err) {
                    console.error('Exception', err);
                }
                if (dbUserData._doc) {
                    var Lead = require('../models/leads');
                    dbUserData = dbUserData._doc;
                    let arg = {
                        "PB_CRN": dbUserData['PB_CRN'],
                        "User_Data_Id": dbUserData['User_Data_Id'],
                        "ss_id": dbUserData['Erp_Qt_Request_Core']['___ss_id___'],
                        "fba_id": dbUserData['Erp_Qt_Request_Core']['___fba_id___'],
                        "channel": "DIRECT",
                        "Created_On": new Date(),
                        "Modified_On": new Date(),
                        "Product_Id": dbUserData['Erp_Qt_Request_Core']['___product_id___'],
                        "previous_policy_number": "",
                        "prev_policy_start_date": "",
                        "policy_expiry_date": dbUserData['Erp_Qt_Request_Core']['___policy_expiry_date___'],
                        "engine_number": "",
                        "chassis_number": "",
                        "company_name": "",
                        "Customer_Name": dbUserData['Erp_Qt_Request_Core']['___first_name___'] + " " + dbUserData['Erp_Qt_Request_Core']['___last_name___'],
                        "Customer_Address": "",
                        "mobile": dbUserData['Erp_Qt_Request_Core']['___mobile___'],
                        "mobile2": "",
                        "vehicle_insurance_type": "renew",
                        "issued_by_username": "",
                        "registration_no": dbUserData['Erp_Qt_Request_Core']['___registration_no___'],
                        "nil_dept": "",
                        "rti": "",
                        "Make_Name": dbUserData['Erp_Qt_Request_Core']['___vehicle_full___'].split('|')[0],
                        "Model_ID": "",
                        "Model_Name": dbUserData['Erp_Qt_Request_Core']['___vehicle_full___'].split('|')[1],
                        "Variant_Name": dbUserData['Erp_Qt_Request_Core']['___vehicle_full___'].split('|')[2],
                        "Vehicle_ID": dbUserData['Erp_Qt_Request_Core']['___vehicle_id___'],
                        "Fuel_ID": "",
                        "Fuel_Name": dbUserData['Erp_Qt_Request_Core']['___vehicle_full___'].split('|')[3],
                        "RTO_City": dbUserData['Erp_Qt_Request_Core']['___rto_full___'].split('|')[1],
                        "RTO_State": dbUserData['Erp_Qt_Request_Core']['___rto_full___'].split('|')[2],
                        "VehicleCity_Id": dbUserData['Erp_Qt_Request_Core']['___rto_id___'],
                        "VehicleCity_RTOCode": dbUserData['Erp_Qt_Request_Core']['___rto_full___'].split('|')[0],
                        "vehicle_registration_date": dbUserData['Erp_Qt_Request_Core']['___vehicle_registration_date___'],
                        "vehicle_manf_date": dbUserData['Erp_Qt_Request_Core']['___vehicle_manf_date___'],
                        "prev_insurer_id": dbUserData['Erp_Qt_Request_Core']['prev_insurer_id___'],
                        "vehicle_ncb_current": dbUserData['Erp_Qt_Request_Core']['___vehicle_ncb_current___'],
                        "is_claim_exists": dbUserData['Erp_Qt_Request_Core']['___is_claim_exists___'],
                        "is_renewal_proceed": "no",
                        "lead_type": listData.lead_type,
                        "camp_type": listData.lead_type,
                        "camp_name": listData.campagin_name,
                        "lead_status": "pending",
                        "renewal_data": dbUserData['Erp_Qt_Request_Core']['___policy_expiry_date___'],
                        'agent_details': ""
                    };
                    var objLead = new Lead(arg);
                    objLead.save(function (err, objDbUserData) {
                        if (err)
                            throw err;
                        console.log('msg - Data Enterd');
                        res.json({"Msg": "Success", "Lead_Id": objDbUserData.Lead_Id});
                    });
                }
            });
        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });
    app.post('/fq/lead_create', function (req, res) {
        try {
            let objRequest = req.body;
            let Lead = require('../models/leads');
            let User_Data = require('../models/user_data');
            let Campaign_Name = objRequest['Campaign_Name'];
            let PB_CRN = objRequest['crn'];
            let Erp_QT = objRequest['utm_medium'] ? ((objRequest['utm_medium']).toString().toLowerCase().indexOf('qt') === 0 ? objRequest['utm_medium'] : "") : "";
            let User_Data_Id = objRequest['udid'];
            console.error('lead_create-start');
            let start_date = new Date();
            let days = (req.query.hasOwnProperty('days')) ? req.query.days - 0 : 30;
            start_date.setDate(start_date.getDate() - days);
            start_date.setHours(00, 00, 00, 000).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
            let end_date = new Date();
            end_date.setDate(end_date.getDate() + 1);
            end_date.setHours(00, 00, 00, 000).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
            let leadCon = {'PB_CRN': PB_CRN - 0, 'Created_On': {$gte: start_date, $lt: end_date}};
            if (Erp_QT !== "") {
                leadCon = {'renewal_data.utm_medium': Erp_QT, 'Created_On': {$gte: start_date, $lt: end_date}};
            }
            Lead.findOne(leadCon, {_id: 0}, function (err, edata) {
                console.error('lead_create-err', err);
                if (err)
                    throw err;
                if (edata !== null && edata._doc && (edata._doc['agent_details'] && edata._doc['agent_details']['uid'] && edata._doc['agent_details']['uid'] - 0 > 0)) {
                    //console.log('msg - Data Already Avilable');
                    let Client = require('node-rest-client').Client;
                    let client = new Client();
                    listData = edata._doc['agent_details'];
                    let arg = {
                        "PB_CRN": objRequest['crn'],
                        "User_Data_Id": objRequest['udid'],
                        "ss_id": listData.ss_id,
                        "fba_id": objRequest['fba_id'],
                        "channel": "DIRECT",
                        "Created_On": new Date(),
                        "Modified_On": new Date(),
                        "Product_Id": objRequest['product_id'],
                        "previous_policy_number": "",
                        "prev_policy_start_date": "",
                        "policy_expiry_date": objRequest['policy_expiry_date'],
                        "engine_number": "",
                        "chassis_number": "",
                        "company_name": "",
                        "Customer_Name": objRequest['first_name'] + " " + objRequest['last_name'],
                        "Customer_Address": "",
                        "mobile": objRequest['mobile'],
                        "mobile2": "",
                        "vehicle_insurance_type": "renew",
                        "issued_by_username": "",
                        "registration_no": objRequest['registration_no'],
                        "nil_dept": "",
                        "rti": "",
                        "Make_Name": objRequest['vehicle_full'].split('|')[0],
                        "Model_ID": "",
                        "Model_Name": objRequest['vehicle_full'].split('|')[1],
                        "Variant_Name": objRequest['vehicle_full'].split('|')[2],
                        "Vehicle_ID": objRequest['vehicle_id'],
                        "Fuel_ID": "",
                        "Fuel_Name": objRequest['vehicle_full'].split('|')[3],
                        "RTO_City": objRequest['rto_full'].split('|')[1],
                        "RTO_State": objRequest['rto_full'].split('|')[2],
                        "VehicleCity_Id": objRequest['rto_id'],
                        "VehicleCity_RTOCode": objRequest['rto_full'].split('|')[0],
                        "vehicle_registration_date": objRequest['vehicle_registration_date'],
                        "vehicle_manf_date": objRequest['vehicle_manf_date'],
                        "prev_insurer_id": objRequest['prev_insurer_id'],
                        "vehicle_ncb_current": objRequest['vehicle_ncb_current'],
                        "is_claim_exists": objRequest['is_claim_exists'],
                        "is_renewal_proceed": "no",
                        "lead_type": "website",
                        "lead_status": "pending",
                        "renewal_data": objRequest,
                        "lead_assigned_uid": listData.uid,
                        "lead_assigned_name": listData.name,
                        "lead_assigned_ssid": listData.ss_id,
                        "lead_assigned_on": new Date(),
                        'agent_details': listData
                    };
                    let objLead = new Lead(arg);
                    let argUserData = {
                        "lead_assigned_uid": listData.uid,
                        "lead_assigned_name": listData.name,
                        "lead_assigned_ssid": listData.ss_id,
                        "lead_assigned_on": new Date(),
                        'agent_details': listData
                    };

                    objLead.save(function (err, objDbUserData) {
                        if (err)
                            throw err;
                        res.json({"Msg": "Success", "Lead_Id": objDbUserData['Lead_Id']});
                        console.log('msg - Data Enterd');
                    });
                    User_Data.updateOne({PB_CRN: PB_CRN - 0, User_Data_Id: User_Data_Id - 0}, argUserData, function (err1, updateData) {
                        if (err1)
                        {
                            console.log('UserDataUpdated', err, updateData);
                        } else
                        {
                            res.json({'Msg': 'Success'});
                        }
                    });

                } else {
                    let url_api = config.environment.weburl + '/get_allocation_list/webquote';
                    let Client = require('node-rest-client').Client;
                    let client = new Client();
                    client.get(url_api, function (data, response) {
                        listData = data;
                        if (listData && listData.hasOwnProperty('uid') && listData.uid - 0 > 0) {
                            let arg = {
                                "PB_CRN": objRequest['crn'],
                                "User_Data_Id": objRequest['udid'],
                                "ss_id": listData.ss_id,
                                "fba_id": objRequest['fba_id'],
                                "channel": "DIRECT",
                                "Created_On": new Date(),
                                "Modified_On": new Date(),
                                "Product_Id": objRequest['product_id'],
                                "previous_policy_number": "",
                                "prev_policy_start_date": "",
                                "policy_expiry_date": objRequest['policy_expiry_date'],
                                "engine_number": "",
                                "chassis_number": "",
                                "company_name": "",
                                "Customer_Name": objRequest['first_name'] + " " + objRequest['last_name'],
                                "Customer_Address": "",
                                "mobile": objRequest['mobile'],
                                "mobile2": "",
                                "vehicle_insurance_type": "renew",
                                "issued_by_username": "",
                                "registration_no": objRequest['registration_no'],
                                "nil_dept": "",
                                "rti": "",
                                "Make_Name": objRequest['vehicle_full'].split('|')[0],
                                "Model_ID": "",
                                "Model_Name": objRequest['vehicle_full'].split('|')[1],
                                "Variant_Name": objRequest['vehicle_full'].split('|')[2],
                                "Vehicle_ID": objRequest['vehicle_id'],
                                "Fuel_ID": "",
                                "Fuel_Name": objRequest['vehicle_full'].split('|')[3],
                                "RTO_City": objRequest['rto_full'].split('|')[1],
                                "RTO_State": objRequest['rto_full'].split('|')[2],
                                "VehicleCity_Id": objRequest['rto_id'],
                                "VehicleCity_RTOCode": objRequest['rto_full'].split('|')[0],
                                "vehicle_registration_date": objRequest['vehicle_registration_date'],
                                "vehicle_manf_date": objRequest['vehicle_manf_date'],
                                "prev_insurer_id": objRequest['prev_insurer_id'],
                                "vehicle_ncb_current": objRequest['vehicle_ncb_current'],
                                "is_claim_exists": objRequest['is_claim_exists'],
                                "is_renewal_proceed": "no",
                                "lead_type": "website",
                                "lead_status": "pending",
                                "renewal_data": objRequest,
                                "lead_assigned_uid": listData.uid - 0,
                                "lead_assigned_name": listData.name,
                                "lead_assigned_ssid": listData.ss_id - 0,
                                "lead_assigned_on": new Date(),
                                'agent_details': listData
                            };
                            let objLead = new Lead(arg);
                            let argUserData = {
                                "lead_assigned_uid": listData.uid - 0,
                                "lead_assigned_name": listData.name,
                                "lead_assigned_ssid": listData.ss_id - 0,
                                "lead_assigned_on": new Date(),
                                'agent_details': listData
                            };

                            objLead.save(function (err, objDbUserData) {
                                if (err)
                                    throw err;
                                res.json({"Msg": "Success", "Lead_Id": objDbUserData['Lead_Id']});
                                console.log('msg - Data Enterd');
                            });
                            User_Data.updateOne({PB_CRN: PB_CRN - 0, User_Data_Id: User_Data_Id - 0}, {"$set": argUserData}, function (err1, updateData) {
                                if (err1)
                                {
                                    console.error('Exception', 'UserDataUpdated', err1, updateData);
                                }
                            });
                        } else {
                            res.json({"Msg": "Fail", "Lead_Id": objDbUserData['Lead_Id']});
                        }
                    });
                }
            });
        } catch (e) {
            console.log(e);
            console.error('lead_create-e', e);
            res.json({"Msg": e});
        }
    });
    app.post('/fresh_quotes/dialer_data/lead_create', function (req, res) {
        try {
            let objRequest = req.body;
            let Lead = require('../models/leads');
            let User_Data = require('../models/user_data');
            let Campaign_Name = objRequest['Campaign_Name'];
            let PB_CRN = objRequest['crn'];
             let Erp_QT = objRequest['utm_medium'] ? ((objRequest['utm_medium']).toString().toLowerCase().indexOf('qt') === 0 ? objRequest['utm_medium'] : "") : "";
            let User_Data_Id = objRequest['udid'];
            console.error('lead_create-start');
            let start_date = new Date();
            let days = (req.query.hasOwnProperty('days')) ? req.query.days - 0 : 30;
            start_date.setDate(start_date.getDate() - days);
            start_date.setHours(00, 00, 00, 000).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
            let end_date = new Date();
            end_date.setDate(end_date.getDate() + 1);
            end_date.setHours(00, 00, 00, 000).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
            let leadCon = {'PB_CRN': PB_CRN - 0, 'Created_On': {$gte: start_date, $lt: end_date}};
            if (Erp_QT !== "") {
                leadCon = {'renewal_data.utm_medium': Erp_QT, 'Created_On': {$gte: start_date, $lt: end_date}};
            }
            Lead.findOne(leadCon, {_id: 0}, function (err, edata) {
                console.error('lead_create-err', err);
                if (err)
                    throw err;
                if (edata !== null && edata._doc && edata._doc['agent_details'] && edata._doc['agent_details']['uid'] && edata._doc['agent_details']['uid'] - 0 > 0) {
                    //console.log('msg - Data Already Avilable');
                    let Client = require('node-rest-client').Client;
                    let client = new Client();
                    listData = edata._doc['agent_details'];
                    let arg = {
                        "PB_CRN": objRequest['crn'],
                        "User_Data_Id": objRequest['udid'],
                        "ss_id": listData.ss_id,
                        "fba_id": objRequest['fba_id'],
                        "channel": "DIRECT",
                        "Created_On": new Date(),
                        "Modified_On": new Date(),
                        "Product_Id": objRequest['product_id'],
                        "previous_policy_number": "",
                        "prev_policy_start_date": "",
                        "policy_expiry_date": objRequest['policy_expiry_date'],
                        "engine_number": "",
                        "chassis_number": "",
                        "company_name": "",
                        "Customer_Name": objRequest['first_name'] + " " + objRequest['last_name'],
                        "Customer_Address": "",
                        "mobile": objRequest['mobile'],
                        "mobile2": "",
                        "vehicle_insurance_type": "renew",
                        "issued_by_username": "",
                        "registration_no": objRequest['registration_no'],
                        "nil_dept": "",
                        "rti": "",
                        "Make_Name": objRequest['vehicle_full'].split('|')[0],
                        "Model_ID": "",
                        "Model_Name": objRequest['vehicle_full'].split('|')[1],
                        "Variant_Name": objRequest['vehicle_full'].split('|')[2],
                        "Vehicle_ID": objRequest['vehicle_id'],
                        "Fuel_ID": "",
                        "Fuel_Name": objRequest['vehicle_full'].split('|')[3],
                        "RTO_City": objRequest['rto_full'].split('|')[1],
                        "RTO_State": objRequest['rto_full'].split('|')[2],
                        "VehicleCity_Id": objRequest['rto_id'],
                        "VehicleCity_RTOCode": objRequest['rto_full'].split('|')[0],
                        "vehicle_registration_date": objRequest['vehicle_registration_date'],
                        "vehicle_manf_date": objRequest['vehicle_manf_date'],
                        "prev_insurer_id": objRequest['prev_insurer_id'],
                        "vehicle_ncb_current": objRequest['vehicle_ncb_current'],
                        "is_claim_exists": objRequest['is_claim_exists'],
                        "is_renewal_proceed": "no",
                        "lead_type": "website",
                        "lead_status": "pending",
                        "renewal_data": objRequest,
                        "lead_assigned_uid": listData.uid,
                        "lead_assigned_name": listData.name,
                        "lead_assigned_ssid": listData.ss_id,
                        "lead_assigned_on": new Date(),
                        'agent_details': listData
                    };
                    let objLead = new Lead(arg);
                    let argUserData = {
                        "lead_assigned_uid": listData.uid,
                        "lead_assigned_name": listData.name,
                        "lead_assigned_ssid": listData.ss_id,
                        "lead_assigned_on": new Date(),
                        'agent_details': listData
                    };

                    objLead.save(function (err, objDbUserData) {
                        if (err)
                            throw err;
                        try {
                            let Client = require('node-rest-client').Client;
                            let client = new Client();
                            let leadUrl = "http://10.0.0.205:9021//api/leadpush/BulkImport";
                            let leadArgs = [{
                                    "Phone_Number1": objDbUserData['mobile'],
                                    "Phone_Number2": objDbUserData['mobile2'] ? objDbUserData['mobile2'] : "",
                                    "Cust_ID": objDbUserData['User_Data_Id'],
                                    "Service_ID": "7", //hardcoded
                                    "Product": objDbUserData['Product_Id'] === 1 ? "Car" : "test",
                                    "Source": "Source",
                                    "Make": objDbUserData['Make_Name'],
                                    "IDV": objDbUserData['vehicle_expected_idv'] ? objDbUserData['vehicle_expected_idv'] : "0F",
                                    "Age": "",
                                    "Income": "",
                                    "City": objDbUserData['RTO_City']
                                }];
                            var args = {
                                data: leadArgs,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            client.post(leadUrl, args, function (leadRes) {
                                if (leadRes && leadRes.ResultStatus && leadRes.ResultStatus === "Success") {
                                    res.json({'Msg': 'Success', 'leadRes': leadRes});
                                } else {
                                    res.json({'Msg': 'Fail', 'leadRes': leadRes});
                                }
                            });
                        } catch (ex) {
                            res.json({'Msg': 'Error', 'leadRes': ''});
                        }
                        //res.json({"Msg": "Success", "Lead_Id": objDbUserData['Lead_Id']});
                        console.log('msg - Data Enterd');
                    });
                    User_Data.updateOne({PB_CRN: PB_CRN - 0, User_Data_Id: User_Data_Id - 0}, argUserData, function (err1, updateData) {
                        if (err1)
                        {
                            console.log('UserDataUpdated', err, updateData);
                        } else
                        {
                            //res.json({'Msg': 'Success', 'leadRes':leadRes});
                        }
                    });

                } else {
                    let url_api = config.environment.weburl + '/get_allocation_list/webquote';
                    let Client = require('node-rest-client').Client;
                    let client = new Client();
                    client.get(url_api, function (data, response) {
                        listData = data;
                        if (listData && listData.hasOwnProperty('uid') && listData.uid - 0 > 0) {
                            let arg = {
                                "PB_CRN": objRequest['crn'],
                                "User_Data_Id": objRequest['udid'],
                                "ss_id": listData.ss_id,
                                "fba_id": objRequest['fba_id'],
                                "channel": "DIRECT",
                                "Created_On": new Date(),
                                "Modified_On": new Date(),
                                "Product_Id": objRequest['product_id'],
                                "previous_policy_number": "",
                                "prev_policy_start_date": "",
                                "policy_expiry_date": objRequest['policy_expiry_date'],
                                "engine_number": "",
                                "chassis_number": "",
                                "company_name": "",
                                "Customer_Name": objRequest['first_name'] + " " + objRequest['last_name'],
                                "Customer_Address": "",
                                "mobile": objRequest['mobile'],
                                "mobile2": "",
                                "vehicle_insurance_type": "renew",
                                "issued_by_username": "",
                                "registration_no": objRequest['registration_no'],
                                "nil_dept": "",
                                "rti": "",
                                "Make_Name": objRequest['vehicle_full'].split('|')[0],
                                "Model_ID": "",
                                "Model_Name": objRequest['vehicle_full'].split('|')[1],
                                "Variant_Name": objRequest['vehicle_full'].split('|')[2],
                                "Vehicle_ID": objRequest['vehicle_id'],
                                "Fuel_ID": "",
                                "Fuel_Name": objRequest['vehicle_full'].split('|')[3],
                                "RTO_City": objRequest['rto_full'].split('|')[1],
                                "RTO_State": objRequest['rto_full'].split('|')[2],
                                "VehicleCity_Id": objRequest['rto_id'],
                                "VehicleCity_RTOCode": objRequest['rto_full'].split('|')[0],
                                "vehicle_registration_date": objRequest['vehicle_registration_date'],
                                "vehicle_manf_date": objRequest['vehicle_manf_date'],
                                "prev_insurer_id": objRequest['prev_insurer_id'],
                                "vehicle_ncb_current": objRequest['vehicle_ncb_current'],
                                "is_claim_exists": objRequest['is_claim_exists'],
                                "is_renewal_proceed": "no",
                                "lead_type": "website",
                                "lead_status": "pending",
                                "renewal_data": objRequest,
                                "lead_assigned_uid": listData.uid - 0,
                                "lead_assigned_name": listData.name,
                                "lead_assigned_ssid": listData.ss_id - 0,
                                "lead_assigned_on": new Date(),
                                'agent_details': listData
                            };
                            let objLead = new Lead(arg);
                            let argUserData = {
                                "lead_assigned_uid": listData.uid - 0,
                                "lead_assigned_name": listData.name,
                                "lead_assigned_ssid": listData.ss_id - 0,
                                "lead_assigned_on": new Date(),
                                'agent_details': listData
                            };

                            objLead.save(function (err, objDbUserData) {
                                if (err)
                                    throw err;
                                try {
                                    let Client = require('node-rest-client').Client;
                                    let client = new Client();
                                    let leadUrl = "http://10.0.0.205:9021//api/leadpush/BulkImport";
                                    let leadArgs = [{
                                            "Phone_Number1": objDbUserData['mobile'],
                                            "Phone_Number2": objDbUserData['mobile2'] ? objDbUserData['mobile2'] : "",
                                            "Cust_ID": objDbUserData['User_Data_Id'],
                                            "Service_ID": "7", //hardcoded
                                            "Product": objDbUserData['Product_Id'] === 1 ? "Car" : "test",
                                            "Source": "Source",
                                            "Make": objDbUserData['Make_Name'],
                                            "IDV": objDbUserData['vehicle_expected_idv'] ? objDbUserData['vehicle_expected_idv'] : "0F",
                                            "Age": "",
                                            "Income": "",
                                            "City": objDbUserData['RTO_City']
                                        }];
                                    var args = {
                                        data: leadArgs,
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    };
                                    client.post(leadUrl, args, function (leadRes) {
                                        if (leadRes && leadRes.ResultStatus && leadRes.ResultStatus === "Success") {
                                            res.json({'Msg': 'Success', 'leadRes': leadRes});
                                        } else {
                                            res.json({'Msg': 'Fail', 'leadRes': leadRes});
                                        }
                                    });
                                } catch (ex) {
                                    res.json({'Msg': 'Error', 'leadRes': ''});
                                }
                                //res.json({"Msg": "Success", "Lead_Id": objDbUserData['Lead_Id']});
                                console.log('msg - Data Enterd');
                            });
                            User_Data.updateOne({PB_CRN: PB_CRN - 0, User_Data_Id: User_Data_Id - 0}, {"$set": argUserData}, function (err1, updateData) {
                                if (err1)
                                {
                                    console.error('Exception', 'UserDataUpdated', err1, updateData);
                                }
                            });
                        } else {
                            res.json({"Msg": "Fail", "Lead_Id": objDbUserData['Lead_Id']});
                        }
                    });
                }
            });
        } catch (e) {
            console.log(e);
            console.error('lead_create-e', e);
            res.json({"Msg": e});
        }
    });
    app.post('/lms/lead_allocation', function (req, res) {
        try {
            var Lead = require('../models/leads');
            var objRequest = req.body;
            var Lead_Id = objRequest['Lead_Id'];
            var Lead_Assigned = objRequest['Lead_Assigned'];
            var Lead_Assigned_Name = objRequest['Lead_Assigned_Name'];
            var myquery = {Lead_Id: Lead_Id - 0};
            var newvalues = {$set: {lead_assigned: Lead_Assigned - 0, Lead_Assigned_Name: Lead_Assigned_Name, lead_assigned_on: new Date(), Modified_On: new Date()}};
            Lead.updateOne(myquery, newvalues, function (e, resp) {
                if (e) {
                    console.log(e);
                    res.json({"Msg": e});
                } else {
                    res.json({"Msg": "Success"});
                }
            });
        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });

    app.post('/fresh_quotes/list', function (req, res, next) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: '',
            sort: {'Visited_On': 'desc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 20
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }

        var filter = obj_pagination.filter;
        if (req.body['Is_Visitor'] === 'yes') {
            filter['Visited_Count'] = {'$gt': 0};
        }
        console.error('fresh_quotes_list', filter, req.body);
        Fresh_Quote.paginate(filter, optionPaginate).then(function (db_Fresh_Quote) {
            //console.error('UserDataSearch', filter, optionPaginate, user_datas);
            res.json(db_Fresh_Quote);
        });
    });
    app.get('/fresh_quotes/sales_historic_summary', function (req, res, next) {
        try {
            let report_type = (req.query.hasOwnProperty('report_type') && req.query['report_type'] !== '') ? req.query['report_type'] : 'NOP';
            var yesterday = moment().add(-1, 'days').utcOffset("+05:30").endOf('Day');
            var weekstart = moment().utcOffset("+05:30").startOf('week');
            weekstart = moment(weekstart).add(1, 'days');
            let obj_sale_historic = {
                'TODAY': {
                    'start': moment().utcOffset("+05:30").startOf('day'),
                    'end': moment().utcOffset("+05:30").endOf('day'),
                    'count': null
                },
                'YESTERDAY': {
                    'start': moment().add(-1, 'days').utcOffset("+05:30").startOf('day'),
                    'end': moment().add(-1, 'days').utcOffset("+05:30").endOf('day'),
                    'count': null
                },
                'WEEKLY': {
                    'start': weekstart,
                    'end': yesterday,
                    'count': null
                },
                'MONTHLY': {
                    'start': moment().utcOffset("+05:30").startOf('month'),
                    'end': yesterday,
                    'count': null
                },
                'QUARTERLY': {
                    'start': moment().utcOffset("+05:30").startOf('quarter'),
                    'end': yesterday,
                    'count': null
                },
                'YEARLY': {
                    'start': moment('2020-04-01').utcOffset("+05:30").startOf('day'),
                    'end': yesterday,
                    'count': null
                },
                'ALL': {
                    'start': moment('2017-04-01').utcOffset("+05:30").startOf('day'),
                    'end': yesterday,
                    'count': null
                }
            };
            let cond_ud = {};
            let db_cache_key = 'sale_historic';
            if (req.query.hasOwnProperty('page_action') && req.query['page_action'] !== '') {
                if (req.query['page_action'] === 'all_daily') {
                    db_cache_key += '_all_daily';
                } else if (req.query['page_action'] === 'ch_all_daily') {
                    var arr_ch_ssid = [];
                    if (req.obj_session.hasOwnProperty('users_assigned')) {
                        arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                    }
                    arr_ch_ssid.push(req.obj_session.user.ss_id);
                    channel = req.obj_session.user.role_detail.channel;
                    cond_ud = {
                        "$or": [
                            {'Premium_Request.channel': channel},
                            {'Premium_Request.ss_id': {$in: arr_ch_ssid}}
                        ]
                    };
                    db_cache_key += '_ch_all_daily_' + channel;
                } else if (req.query['page_action'] === 'my_daily') {
                    var arr_ssid = [];
                    if (req.obj_session.hasOwnProperty('users_assigned')) {
                        var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                        arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                        cond_ud['Premium_Request.ss_id'] = {$in: arr_ssid};
                    }
                    arr_ssid.push(req.obj_session.user.ss_id);
                    cond_ud['Premium_Request.ss_id'] = {$in: arr_ssid};
                }
                cond_ud = {};
                //cond_ud['Visitor_Count'] = {'$gt': 0};
                for (let k in obj_sale_historic) {
                    cond_ud['Visited_On'] = {'$gte': obj_sale_historic[k]['start'], '$lte': obj_sale_historic[k]['end']};
                    Fresh_Quote.count(cond_ud).exec(function (err, dbUsersCount) {
                        if (err) {
                            return res.send(err);
                        } else {
                            obj_sale_historic[k]['count'] = dbUsersCount || 0;
                            fresh_quote_historic_handler(obj_sale_historic, req, res);
                        }
                    });
                }
            }
        } catch (Ex) {
            console.error('Exception', 'sales_summary', Ex.stack);
            res.send(Ex.stack);
        }
    });
    function fresh_quote_historic_handler(obj_sale_historic, req, res) {
        let all_done = true;
        for (let k in obj_sale_historic) {
            if (obj_sale_historic[k]['count'] === null) {
                all_done = false;
                break;
            }
        }
        if (all_done === true) {
            res.json(obj_sale_historic);
        }
    }

    app.get('/fresh_quotes/visitor_report', function (req, res, next) {
        //console.log('Start', this.constructor.name, 'quick_report');
        try {
            var today = moment().utcOffset("+05:30").startOf('Day');
            if (req.query.hasOwnProperty('type') && req.query['type'] == 'daily') {
                var yesterday = moment(today).add(-1, 'days').format("YYYY-MM-DD");
                req.query['datefrom'] = yesterday;
                req.query['dateto'] = yesterday;
            }
            var arrFrom = req.query['datefrom'].split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
            var arrTo = req.query['dateto'].split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);
            var obj_cond = {
                "Visited_On": {"$gte": dateFrom, "$lte": dateTo}
            };
            Fresh_Quote.find(obj_cond).sort({'Visited_On': 1}).select('-_id').exec(function (err, dbFresh_Quotes) {
                if (dbFresh_Quotes) {
                    try {
                        let arr_visitor = [];
                        for (let k in dbFresh_Quotes) {
                            let fq = dbFresh_Quotes[k]._doc;
                            arr_visitor.push({
                                'Fresh_Quote_Id': fq['Fresh_Quote_Id'],
                                'Erp_Qt': fq['Erp_Qt'],
                                'Erp_Uid': fq['Row_Data']['Erp_Uid'],
                                'Visited_On': fq['Visited_On'].toLocaleString(),
                            });
                        }
                        var today_str = moment().format('YYYYMMDD_HHmmss');
                        let file_name = 'freshquotes_visitor_' + today_str;
                        file_name = file_name.toUpperCase();
                        let file_weburl = config.environment.downloadurl + "/report/" + file_name + '.csv';
                        let csv_file = appRoot + "/tmp/report/" + file_name + '.csv';
                        var ObjectsToCsv = require('objects-to-csv');
                        let csv = new ObjectsToCsv(arr_visitor);
                        csv.toDisk(csv_file);
                        var subject = '[' + config.environment.name.toString().toUpperCase() + '][REPORT]' + file_name;
                        var content_html = '<!DOCTYPE html><html><head><style>*,html,body{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>' + file_name + '</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                        content_html += '<div class="report" ><span>' + file_name + ' ( Count: ' + arr_visitor.length + ')</span><br>';
                        content_html += '<p><a href="' + file_weburl + '" target="_BLANK">' + file_weburl + '</a></p>';
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        let arr_to = ['shah.kevin@landmarkinsurance.in', 'hiren.shah@landmarkinsurance.in,varun.kaushik@policyboss.com'];
                        if (req.query['email'] == 'yes') {
                            let arr_to = ['susheeltejuja@landmarkinsurance.in', 'shah.kevin@landmarkinsurance.in', 'hiren.shah@landmarkinsurance.in', 'varun.kaushik@policyboss.com'];
                            if (req.query['dbg'] == 'yes') {
                                arr_to = ['chirag.modi@policyboss.com'];
                            }
                            objModelEmail.send('notifications@policyboss.com', arr_to.join(','), subject, content_html, '', config.environment.notification_email);
                        }
                        res.send(content_html);
                    } catch (e) {
                        return res.send(e.stack);
                    }
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.post('/fresh_quotes/fresh_quote_job/list', function (req, res) {
        Fresh_Quote_Job.find({}).select({'_id': -1}).sort({'Fresh_Quote_Job_Id': -1}).select('-_id').exec(function (err, dbFresh_Quote_Jobs) {
            if (err) {
                res.send(err);
            } else {
                res.json(dbFresh_Quote_Jobs);
            }
        });
    });
    app.post('/fresh_quotes/list', function (req, res) {
        Fresh_Quote.find({'Fresh_Quote_Job_Id': req.body['Fresh_Quote_Job_Id'] - 0}).sort({'Fresh_Quote_Id': 1}).select('-_id').exec(function (err, dbFresh_Quotes) {
            if (err) {
                res.send(err);
            } else {
                res.json(dbFresh_Quotes);
            }
        });
    });
    app.post('/fresh_quotes/csv_generate', function (req, res) {
        Fresh_Quote.find({'Fresh_Quote_Job_Id': req.body['Fresh_Quote_Job_Id'], 'Status': 'QUOTE_FOUND'}).select('-_id Fresh_Quote_Id Erp_Qt Registration_No Short_Code').exec(function (err, dbFresh_Quotes) {
            try {
                if (err) {

                } else {
                    let quote_file = 'export_fresh_quote_' + moment().utcOffset("+05:30").format('YYYYMMDD_HHmmss') + '.csv';
                    let quote_file_sys_path = appRoot + "/tmp/fresh_quote/" + quote_file;
                    let quote_file_web_path = config.environment.downloadurl + "/fresh_quote/" + quote_file;
                    let csv_header = [];
                    let first_row = dbFresh_Quotes[0]._doc;
                    let csv_data = [];
                    csv_header.push({id: 'Fresh_Quote_Id', title: 'Fresh_Quote_Id'});
                    csv_header.push({id: 'Erp_Qt', title: 'Erp_Qt'});
                    csv_header.push({id: 'Registration_No', title: 'Registration_No'});
                    csv_header.push({id: 'Short_Url', title: 'Short_Url'});
                    for (let k in dbFresh_Quotes) {
                        let ind_dbFresh_Quotes = dbFresh_Quotes[k]._doc;
                        ind_dbFresh_Quotes['Short_Url'] = 'pboss.in/fq/' + ind_dbFresh_Quotes['Short_Code'];
                        delete ind_dbFresh_Quotes['Short_Code'];
                        csv_data.push(ind_dbFresh_Quotes);
                    }
                    var createCsvWriter = require('csv-writer').createObjectCsvWriter;
                    var csvWriter = createCsvWriter({
                        path: quote_file_sys_path,
                        header: csv_header
                    });
                    csvWriter
                            .writeRecords(csv_data)
                            .then(() => res.json({
                                    'Status': 'SUCCESS',
                                    'Download_Url': quote_file_web_path
                                }));
                }
            } catch (e) {
                res.json({
                    'Status': 'FAIL',
                    'Msg': e.stack,
                    'Download_Url': ''
                });
            }
        });
    });
    app.post('/fresh_quotes/create_short_url/progress', function (req, res, next) {
        let Total_Count = req.body['Count'] - 0;
        Fresh_Quote.count({'Fresh_Quote_Job_Id': req.body['Fresh_Quote_Job_Id'], 'Status': 'QUOTE_FOUND'}).exec(function (err, cntShortUrl) {
            if (err) {

            } else {
                res.json({
                    'Status': 'SUCCESS',
                    'Total': Total_Count,
                    'Url_Processed': cntShortUrl
                });
            }
        });
    });
    app.post('/fresh_quotes/import/progress', function (req, res, next) {
        let Total_Count = req.body['Total_Count'] - 0;
        Fresh_Quote.count({'Fresh_Quote_Job_Id': req.body['Fresh_Quote_Job_Id'] - 0}).exec(function (err, cntFresh_Quote) {
            if (err) {

            } else {
                res.json({
                    'Status': 'SUCCESS',
                    'Total_Count': Total_Count,
                    'Completed_Count': cntFresh_Quote
                });
            }
        });
    });
    app.post('/fresh_quotes/match_url', pre_validate, function (req, res, next) {
        var Vehicle = require('../models/vehicle');
        Vehicle.find({'Product_Id_New': 1}).exec(function (err, dbVehicles) {
            let arr_vehicles_lite = {};
            let arr_vehicles_full = {};
            let obj_make_vehicle = {};
            if (dbVehicles) {
                for (let k in dbVehicles) {
                    let indVehicle = dbVehicles[k]._doc;
                    if (indVehicle['Is_Base'] === 'Yes') {
                        arr_vehicles_lite[indVehicle['Vehicle_ID']] = indVehicle;
                        let Make_Name = indVehicle['Make_Name'].toString().trim();
                        if (obj_make_vehicle.hasOwnProperty(Make_Name) === false) {
                            obj_make_vehicle[Make_Name] = [];
                        }
                        obj_make_vehicle[Make_Name].push(indVehicle);
                    }
                    arr_vehicles_full[indVehicle['Vehicle_ID']] = indVehicle;
                }
            }
            Fresh_Quote.find({'Fresh_Quote_Job_Id': req.Fresh_Quote_Job['Fresh_Quote_Job_Id'], 'Status': 'UPLOADED'}).select('-Row_Data').sort({'Fresh_Quote_Id': 1}).limit(req.body['Limit'] - 0).exec(function (err, dbFreshQuotes) {
                if (err) {

                }
                if (dbFreshQuotes) {
                    let arr_process_summary = {
                        'MAKE_NOT_FOUND': [],
                        'VEHICLE_MATCHED': [],
                        'VEHICLE_NOT_MATCHED': [],
                        'QUOTE_FOUND': [],
                        'QUOTE_NOT_FOUND': [],
                        'EXCEPTION': []
                    };
                    for (let k in dbFreshQuotes) {
                        let arr_update_fq = {};
                        let fq = dbFreshQuotes[k]._doc;
                        let matched_vehicle_id = 0;
                        let matched_base_vehicle_id = 0;
                        let Status = 'PENDING';
                        let Remark = '';
                        let Quote_Id = null;
                        let Matched_Score = 0;
                        let Vehicle_Age = 0;
                        try {
                            let source_year = moment(fq['Manf_Year']).format('YYYY');
                            Vehicle_Age = moment().format('YYYY') - source_year;
                            if (fq['Vehicle_Id'] > 0 && false) {
                                matched_vehicle_id = fq['Vehicle_Id'];
                                matched_base_vehicle_id = arr_vehicles_full[matched_vehicle_id]['Base_Vehicle_ID'];
                                Matched_Score = 2;
                            }

                            if (obj_make_vehicle.hasOwnProperty(fq['Make'])) {
                                let Source_String = '';
                                let arr_Source_String_Key = ['Make', 'Model', 'Fuel', 'Cubic_Capacity'];
                                let arr_Source_String = [];
                                for (let i in arr_Source_String_Key) {
                                    if (fq[arr_Source_String_Key[i]] && fq[arr_Source_String_Key[i]] !== '') {
                                        arr_Source_String.push(fq[arr_Source_String_Key[i]]);
                                    }
                                }
                                Source_String = arr_Source_String.join(' ');
                                let obj_match_vehicle = {};
                                let obj_match_vehicle_full = {};
                                let default_vehicle_id = 0;
                                let default_base_vehicle_id = 0;
                                for (let i in obj_make_vehicle[fq['Make']]) {
                                    let indVehicle = obj_make_vehicle[fq['Make']][i];
                                    if (indVehicle.hasOwnProperty('Age_' + Vehicle_Age) && default_vehicle_id === 0) {
                                        default_vehicle_id = indVehicle['Vehicle_ID'];
                                        default_base_vehicle_id = indVehicle['Base_Vehicle_ID'];
                                    }
                                    let TargetString = indVehicle['Make_Name'] + ' ' + indVehicle['Model_Name'] + ' ' + indVehicle['Fuel_Name'] + ' ' + indVehicle['Cubic_Capacity'];
                                    let matchScore = fuzzy(Source_String, TargetString);
                                    if (matchScore > 0) {
                                        obj_match_vehicle[indVehicle['Vehicle_ID'] + '_' + indVehicle['Base_Vehicle_ID']] = matchScore;
                                        obj_match_vehicle_full[indVehicle['Vehicle_ID'] + '_' + indVehicle['Base_Vehicle_ID']] = {
                                            'matchScore': matchScore,
                                            'TargetString': TargetString
                                        };
                                    }
                                }


                                if (Object.keys(obj_match_vehicle).length > 0) {
                                    obj_match_vehicle = sortObject(obj_match_vehicle);
                                    let match_score_key = Object.keys(obj_match_vehicle)[0];
                                    let arr_matched_vehicle_id = match_score_key.split('_');
                                    matched_base_vehicle_id = arr_matched_vehicle_id[1];
                                    matched_vehicle_id = arr_matched_vehicle_id[0];
                                    Matched_Score = obj_match_vehicle[match_score_key];
                                }
                                var today = moment().utcOffset("+05:30");
                                var today_str = moment(today).format("YYYYMMD");
                                var objRequest = {
                                    'fqid': fq['Fresh_Quote_Id'],
                                    'Source_String': Source_String,
                                    'Matched_Score': Matched_Score,
                                    'obj_match_vehicle': obj_match_vehicle_full
                                };
                                fs.appendFile(appRoot + "/tmp/log/vehicle_match_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                });
                                if (matched_base_vehicle_id > 0) {
                                    Status = 'VEHICLE_MATCHED';
                                    if (arr_vehicles_lite[matched_vehicle_id].hasOwnProperty('Age_' + Vehicle_Age) && arr_vehicles_lite[matched_vehicle_id]['Age_' + Vehicle_Age]) {
                                        Status = 'QUOTE_FOUND';
                                        Quote_Id = arr_vehicles_lite[matched_vehicle_id]['Age_' + Vehicle_Age]['Request_Unique_Id'];
                                    } else {
                                        //check for any slab
                                        let arr_slab = [1, 2, 3, 4, 5, 6];
                                        for (let j in arr_slab) {
                                            let Age_Iteration = arr_slab[j];
                                            if (arr_vehicles_lite[matched_base_vehicle_id].hasOwnProperty('Age_' + Age_Iteration) && arr_vehicles_lite[matched_base_vehicle_id]['Age_' + Age_Iteration]) {
                                                Status = 'QUOTE_FOUND';
                                                Quote_Id = arr_vehicles_lite[matched_base_vehicle_id]['Age_' + Age_Iteration]['Request_Unique_Id'];
                                                break;
                                            }
                                        }

                                        //check for any vehicle any slab of make
                                        if (Quote_Id === null && default_vehicle_id > 0) {
                                            Quote_Id = arr_vehicles_lite[default_vehicle_id]['Age_' + Vehicle_Age]['Request_Unique_Id'];
                                            Status = 'QUOTE_FOUND';
                                        }

                                        if (Quote_Id === null) {
                                            Status = 'QUOTE_NOT_FOUND';
                                        }
                                        //Status = 'QUOTE_NOT_FOUND';
                                    }
                                } else {
                                    Status = 'VEHICLE_NOT_MATCHED';
                                }
                            } else {
                                Status = 'MAKE_NOT_FOUND';
                            }


                        } catch (e) {
                            Status = 'EXCEPTION';
                            Remark = e.stack;
                            //return res.send('Match_Process--' + matched_vehicle_id + '--' + matched_base_vehicle_id + '--' + e.stack);
                        }
                        if (arr_process_summary.hasOwnProperty(Status) === false) {
                            arr_process_summary[Status] = [];
                        }
                        arr_process_summary[Status].push({
                            'Fresh_Quote_Id': fq['Fresh_Quote_Id'],
                            'Erp_Qt': fq['Erp_Qt'],
                            'Status': Status,
                            'Vehicle_Id': matched_vehicle_id,
                            'Base_Vehicle_Id': matched_base_vehicle_id,
                            'Vehicle_Age': Vehicle_Age,
                            'Matched_Score': Matched_Score,
                            'Remark': Remark
                        });
                        arr_update_fq = {
                            'Status': Status,
                            'Vehicle_Id': matched_vehicle_id,
                            'Base_Vehicle_Id': matched_base_vehicle_id,
                            'Vehicle_Age': Vehicle_Age,
                            'Matched_Score': Matched_Score,
                            'Url': Quote_Id,
                            'Short_Code': '',
                            'Modified_On': new Date(),
                            'Remark': Remark
                        };
                        if (Status === 'QUOTE_FOUND') {
                            arr_update_fq['Short_Code'] = randomStr(8);
                            arr_update_fq['Visited_Count'] = 0;
                            arr_update_fq['Visited_History'] = [];
                        }
                        Fresh_Quote.update({'Fresh_Quote_Id': fq['Fresh_Quote_Id']}, {$set: arr_update_fq}, function (err, numAffected) {

                        });
                    }

                    let Process_Count = req.Fresh_Quote_Job.Process_Count + dbFreshQuotes.length;
                    let Vehicle_Matched_Count = req.Fresh_Quote_Job.Vehicle_Matched_Count + arr_process_summary['QUOTE_FOUND'].length + arr_process_summary['QUOTE_NOT_FOUND'].length;
                    let Quote_Found_Count = req.Fresh_Quote_Job.Quote_Found_Count + arr_process_summary['QUOTE_FOUND'].length;
                    let obj_fresh_quote_job = {
                        'Status': 'PROCESSED', // UPLOADED , VALIDATED , REJECTED, VERIFIED , MATCHED , NOTMATCHED , SURLCREATED
                        'Process_Count': Process_Count,
                        'Vehicle_Matched_Count': Vehicle_Matched_Count,
                        'Quote_Found_Count': Quote_Found_Count,
                        'Quote_Summary': {}, //arr_process_summary
                        'Modified_On': new Date()
                    };
                    Fresh_Quote_Job.update({'Fresh_Quote_Job_Id': req.body['Fresh_Quote_Job_Id']}, {$set: obj_fresh_quote_job}, function (err, objDbFresh_Quote_Job) {
                        return res.json({
                            'Status': 'PROCESSED', // UPLOADED , VALIDATED , REJECTED, VERIFIED , MATCHED , NOTMATCHED , SURLCREATED
                            'Upload_Count': req.Fresh_Quote_Job.Upload_Count,
                            'Process_Count': Process_Count,
                            'Vehicle_Matched_Count': Vehicle_Matched_Count,
                            'Quote_Found_Count': Quote_Found_Count,
                            //'Quote_Summary': arr_process_summary,
                            'Modified_On': new Date()
                        });
                    });
                }
            });
        });
    });
    function pre_validate(req, res, next) {
        var User = require('../models/user');
        console.error('Agent_Summary', 'User');
        req.body['Fresh_Quote_Job_Id'] = req.body['Fresh_Quote_Job_Id'] - 0;
        Fresh_Quote_Job.findOne({'Fresh_Quote_Job_Id': req.body['Fresh_Quote_Job_Id']}, function (err, dbFresh_Quote_Job) {
            if (dbFresh_Quote_Job) {
                req.Fresh_Quote_Job = dbFresh_Quote_Job._doc;
                User.find({}, function (err, dbUsers) {
                    if (dbUsers) {
                        let obj_users = {};
                        for (let k in dbUsers) {
                            let user = dbUsers[k]._doc;
                            let UID = user['UID'] - 0;
                            let Ss_Id = user['Ss_Id'] - 0;
                            if (obj_users.hasOwnProperty(UID) === false && Ss_Id !== 0) {
                                //obj_agent_summary['PBS']['Total_List'].push(UID);
                                obj_users[UID] = Ss_Id;
                            }
                        }
                        req.users = obj_users;
                        return next();
                    }
                });
            }
        });
    }
    app.post('/fresh_quotes/match_vehicle', function (req, res, next) {
        mv['Make'] = req.body.Make;
        mv['Model'] = req.body.Model;
        mv['Variant'] = req.body.Variant;
        mv['Cubic_Capacity'] = req.body.Cubic_Capacity;
        mv['Fuel'] = req.body.Fuel;
        var Vehicle = require('../models/vehicle');
        Vehicle.find({'Product_Id_New': 1}).exec(function (err, dbVehicles) {
            let arr_vehicles_lite = {};
            let arr_vehicles_full = {};
            let obj_make_vehicle = {};
            var vehMatchSummary = {
                'Vehicle_ID': 0,
                'Status': ''
            };
            let fq = mv;
            //fq['Make'] = "HONDA";
            //fq['Model'] = "CITY";
            //fq['Variant'] = "V CVT PETROL";
            //fq['Cubic_Capacity'] = 1497;
            //fq['Fuel'] = "Petrol";
            if (dbVehicles) {
                for (let k in dbVehicles) {
                    let indVehicle = dbVehicles[k]._doc;
                    if (indVehicle['Is_Base'] === 'Yes') {
                        arr_vehicles_lite[indVehicle['Vehicle_ID']] = indVehicle;
                        let Make_Name = indVehicle['Make_Name'].toString().trim();
                        if (obj_make_vehicle.hasOwnProperty(Make_Name) === false) {
                            obj_make_vehicle[Make_Name] = [];
                        }
                        obj_make_vehicle[Make_Name].push(indVehicle);
                    }
                    arr_vehicles_full[indVehicle['Vehicle_ID']] = indVehicle;
                }
            }
            if (dbVehicles) {
                let arr_process_summary = {
                    'MAKE_NOT_FOUND': [],
                    'VEHICLE_MATCHED': [],
                    'VEHICLE_NOT_MATCHED': [],
                    'QUOTE_FOUND': [],
                    'QUOTE_NOT_FOUND': [],
                    'EXCEPTION': []
                };
                let arr_update_fq = {};
                let matched_vehicle_id = 0;
                let matched_base_vehicle_id = 0;
                let Status = 'PENDING';
                let Remark = '';
                let Quote_Id = null;
                let Matched_Score = 0;
                let Vehicle_Age = 0;
                try {
                    let source_year = moment(fq['Manf_Year']).format('YYYY');
                    Vehicle_Age = moment().format('YYYY') - source_year;
                    if (fq['Vehicle_Id'] > 0 && false) {
                        matched_vehicle_id = fq['Vehicle_Id'];
                        matched_base_vehicle_id = arr_vehicles_full[matched_vehicle_id]['Base_Vehicle_ID'];
                        Matched_Score = 2;
                    }

                    if (obj_make_vehicle.hasOwnProperty(fq['Make'])) {
                        let Source_String = '';
                        let arr_Source_String_Key = ['Make', 'Model', 'Fuel', 'Cubic_Capacity'];
                        let arr_Source_String = [];
                        for (let i in arr_Source_String_Key) {
                            if (fq[arr_Source_String_Key[i]] && fq[arr_Source_String_Key[i]] !== '') {
                                arr_Source_String.push(fq[arr_Source_String_Key[i]]);
                            }
                        }
                        Source_String = arr_Source_String.join(' ');
                        let obj_match_vehicle = {};
                        let obj_match_vehicle_full = {};
                        let default_vehicle_id = 0;
                        let default_base_vehicle_id = 0;
                        for (let i in obj_make_vehicle[fq['Make']]) {
                            let indVehicle = obj_make_vehicle[fq['Make']][i];
                            if (indVehicle.hasOwnProperty('Age_' + Vehicle_Age) && default_vehicle_id === 0) {
                                default_vehicle_id = indVehicle['Vehicle_ID'];
                                default_base_vehicle_id = indVehicle['Base_Vehicle_ID'];
                            }
                            let TargetString = indVehicle['Make_Name'] + ' ' + indVehicle['Model_Name'] + ' ' + indVehicle['Fuel_Name'] + ' ' + indVehicle['Cubic_Capacity'];
                            let matchScore = fuzzy(Source_String, TargetString);
                            if (matchScore > 0) {
                                obj_match_vehicle[indVehicle['Vehicle_ID'] + '_' + indVehicle['Base_Vehicle_ID']] = matchScore;
                                obj_match_vehicle_full[indVehicle['Vehicle_ID'] + '_' + indVehicle['Base_Vehicle_ID']] = {
                                    'matchScore': matchScore,
                                    'TargetString': TargetString
                                };
                            }
                        }


                        if (Object.keys(obj_match_vehicle).length > 0) {
                            obj_match_vehicle = sortObject(obj_match_vehicle);
                            let match_score_key = Object.keys(obj_match_vehicle)[0];
                            let arr_matched_vehicle_id = match_score_key.split('_');
                            matched_base_vehicle_id = arr_matched_vehicle_id[1];
                            matched_vehicle_id = arr_matched_vehicle_id[0];
                            Matched_Score = obj_match_vehicle[match_score_key];
                        }
                        var today = moment().utcOffset("+05:30");
                        var today_str = moment(today).format("YYYYMMD");
                        var objRequest = {
                            'fqid': fq['Fresh_Quote_Id'],
                            'Source_String': Source_String,
                            'Matched_Score': Matched_Score,
                            'obj_match_vehicle': obj_match_vehicle_full
                        };
                        fs.appendFile(appRoot + "/tmp/log/vehicle_match_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                        if (matched_base_vehicle_id > 0) {
                            vehMatchSummary.Status = 'VEHICLE_MATCHED';
                            vehMatchSummary.Vehicle_ID = matched_base_vehicle_id;
                        } else {
                            vehMatchSummary.Status = 'VEHICLE_NOT_MATCHED';
                        }
                    } else {
                        vehMatchSummary.Status = 'MAKE_NOT_FOUND';
                    }
                    res.json(vehMatchSummary);
                } catch (e) {
                    Status = 'EXCEPTION';
                    Remark = e.stack;
                    vehMatchSummary.Status = 'MATCH_ERR';
                    res.json(vehMatchSummary);
                    //return res.send('Match_Process--' + matched_vehicle_id + '--' + matched_base_vehicle_id + '--' + e.stack);
                }

            }

        });
    });

    app.post('/fresh_quotes/validate', pre_validate, function (req, res, next) {
        try {
            let import_file = req.Fresh_Quote_Job['Data_File'];
            let import_file_path = appRoot + "/tmp/fresh_quote/" + import_file;
            let op = (req.query.hasOwnProperty('op') && req.query['op'] !== '') ? req.query['op'] : 'NA';
            //pbid	make	model	submodel	RTO_City	State_Name	VehicleCity_RTOCode	RegistrationNo	
            //qRegistrationDate	MfgYear	ExpiryDate	LastYrInsCompany	NoClaimBonus	is_claim_exists	employee_uid	
            //product_id	pa_owner_driver_si	is_pa_od	PkSrNo	ERP_ Submodel_ID	ERP Policy Category

            let syncSummary = {
                'Status': 'PENDING',
                'Details': {},
                'Msg': ''
            };
            if (op === 'VALIDATE' || op === 'IMPORT') {
                let arr_fresh_quote = [];
                //let arr_mendate_field = ['Make', 'Erp_Qt', 'Manf_Year', 'Erp_Uid'];
                let arr_mendate_field = ['Make', 'Erp_Qt', 'Manf_Year'];
                req.body = JSON.parse(JSON.stringify(req.body));
                let obj_data_validation = {
                    'Total': 0,
                    'Valid': 0,
                    'InValid': 0,
                    'Empty_Make': 0,
                    'Empty_Manf_Year': 0,
                    'Empty_Erp_Qt': 0,
                    'Empty_Erp_Uid': 0
                };
                if (op === 'IMPORT') {
                    syncSummary['Status'] = 'SUCCESS';
                    syncSummary['Details']['Valid'] = req.body['Total_Count'];
                    syncSummary['Msg'] = 'Data import is Started';
                    res.json(syncSummary);
                }
                var obj_csv_schema = {
                    'Manf_Year': 'vehicle_manf_date',
                    'Make': 'Make',
                    'Model': 'Model',
                    'Variant': 'SubModel',
                    'Fuel': 'Fuel',
                    'Cubic_Capacity': 'Cubic_Capacity',
                    'Rto_Code': 'RTO_Code',
                    'Registration_No': 'registration_no',
                    'Vehicle_Id': 'PBID',
                    'Rto_City': 'RTO_city',
                    'Rto_State': 'RTO_State',
                    'Erp_Uid': 'agent_uid',
                    'Erp_Qt': 'erp_qt'
                };
                var arr_csv_schema = Object.keys(obj_csv_schema);
                fs.createReadStream(import_file_path)
                        .pipe(csv())
                        .on('data', (row) => {
                            //console.log(row);
                            for (let k  of arr_csv_schema) {
                                if (row.hasOwnProperty(k) === false) {
                                    row[k] = '';
                                }
                            }
                            /*for (let k  in obj_csv_schema) {
                             let v = obj_csv_schema[k];
                             if (row.hasOwnProperty(v)) {
                             row[k] = row[v];
                             } else {
                             row[k] = '';
                             }
                             }*/
                            obj_data_validation['Total']++;
                            let is_data_valid = true;
                            for (let k in arr_mendate_field) {
                                if (row[arr_mendate_field[k]] === '') {
                                    is_data_valid = false;
                                    obj_data_validation['Empty_' + arr_mendate_field[k]]++;
                                }
                            }
                            if (is_data_valid) {
                                obj_data_validation['Valid']++;
                                let t_date = moment(row['Manf_Year'], 'DD-MM-YYYY', true);
                                if (t_date.isValid()) {
                                    row['Manf_Year'] = moment(row['Manf_Year'], 'DD-MM-YYYY').format('YYYY-MM-DD');
                                }

                                let obj_fresh_quote = {
                                    'Fresh_Quote_Job_Id': req.Fresh_Quote_Job['Fresh_Quote_Job_Id'],
                                    'Camp_Name': req.body['Camp_Name'],
                                    'Make': row['Make'],
                                    'Model': row['Model'],
                                    'Variant': row['Variant'],
                                    'Fuel': row['Fuel'],
                                    'Cubic_Capacity': row['Cubic_Capacity'],
                                    'Rto_Code': row['Rto_Code'],
                                    'Registration_No': row['Registration_No'],
                                    'Erp_Qt': row['Erp_Qt'],
                                    'Manf_Year': row['Manf_Year'],
                                    'Vehicle_Id': (row['Vehicle_Id'] !== '' && row['Vehicle_Id'] !== 0) ? row['Vehicle_Id'] : 0,
                                    'Base_Vehicle_Id': 0,
                                    'Rto_Id': 0,
                                    'Vehicle_Age': 0,
                                    'Ss_Id': req.users.hasOwnProperty(row['Erp_Uid']) ? req.users[row['Erp_Uid']] : 0,
                                    'Status': 'UPLOADED', // UPLOADED , VALIDATED , REJECTED, VERIFIED , MATCHED , NOTMATCHED , SURLCREATED                        
                                    'Created_On': new Date(),
                                    'Modified_On': new Date(),
                                    'Row_Data': row
                                };
                                arr_fresh_quote.push(obj_fresh_quote);
                                if (op === 'IMPORT') {

                                    let objModelFresh_Quote = new Fresh_Quote(obj_fresh_quote);
                                    objModelFresh_Quote.save(function (err, objDbFresh_Quote) {
                                        if (err) {
                                            return res.send(err);
                                        }
                                    });
                                    /*if ((req.body['Total_Count'] - 0) % obj_data_validation['Valid'] === 0) {
                                     sleep(2000);
                                     }*/
                                }
                            } else {
                                obj_data_validation['InValid']++;
                            }
                        })
                        .on('end', () => {
                            console.log('CSV file successfully processed');
                            if (op === 'IMPORT') {
                                let obj_fresh_quote_job = {
                                    'Status': 'UPLOADED', // UPLOADED , VALIDATED , REJECTED, VERIFIED , MATCHED , NOTMATCHED , SURLCREATED
                                    'File_Data_Count': obj_data_validation['Total'],
                                    'Upload_Count': obj_data_validation['Valid'],
                                    'Validation_Summary': obj_data_validation,
                                    'Modified_On': new Date()
                                };
                                Fresh_Quote_Job.update({'Fresh_Quote_Job_Id': req.body['Fresh_Quote_Job_Id']}, {$set: obj_fresh_quote_job}, function (err, objDbFresh_Quote_Job) {
                                    syncSummary['Status'] = 'SUCCESS';
                                    syncSummary['Msg'] = 'Data is Saved';
                                    syncSummary['Details'] = obj_data_validation;
                                    //res.json(syncSummary);
                                });
                            }
                            if (op === 'VALIDATE') {
                                syncSummary['Status'] = 'SUCCESS';
                                syncSummary['Msg'] = 'Data is validated';
                                syncSummary['Details'] = obj_data_validation;
                                res.json(syncSummary);
                            }

                        });
            } else {
                res.json({'Status': 'ERR', 'Msg': 'OP_MISSING'});
            }
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.post('/fresh_quotes/upload', function (req, res) {
        let obj_status = {
            'Status': 'pending',
            'Msg': 'pending'
        };
        try {
            var formidable = require('formidable');
            var form = new formidable.IncomingForm();
            var fs = require('fs');
            form.parse(req, function (err, fields, files) {
                var source_path = files.files_fresh_quote.path;
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
                            let quote_file = 'fresh_quote_' + moment().utcOffset("+05:30").format('YYYYMMDD_HHmmss') + '.csv';
                            let quote_file_sys_path = appRoot + "/tmp/fresh_quote/" + quote_file;
                            // Write the file
                            fs.writeFile(quote_file_sys_path, data, function (err) {
                                if (err) {
                                    obj_status['Status'] = 'ERR_FILE_WRITE';
                                    obj_status['Msg'] = err;
                                    res.json(obj_status);
                                } else {
                                    let obj_fresh_quote_job = {
                                        'Camp_Name': fields['Camp_Name'],
                                        'Status': 'UPLOADED', // UPLOADED , VALIDATED , REJECTED, VERIFIED , MATCHED , NOTMATCHED , SURLCREATED
                                        'Data_File': quote_file,
                                        'Quote_File': '',
                                        'File_Data_Count': 0,
                                        'Upload_Count': 0,
                                        'Process_Count': 0,
                                        'Vehicle_Matched_Count': 0,
                                        'Quote_Found_Count': 0,
                                        'Created_On': new Date(),
                                        'Modified_On': new Date()
                                    };
                                    if (typeof req.body['Fresh_Quote_Job_Id'] !== 'undefined' && req.body['Fresh_Quote_Job_Id'] > 0) {
                                        Fresh_Quote_Job.update({'Fresh_Quote_Job_Id': req.body['Fresh_Quote_Job_Id']}, {$set: obj_fresh_quote_job}, function (err, objDbFresh_Quote_Job) {
                                            obj_status['Status'] = 'SUCCESS';
                                            obj_status['Msg'] = quote_file;
                                            obj_status['Fresh_Quote_Job_Id'] = objDbFresh_Quote_Job['Fresh_Quote_Job_Id'];
                                            res.json(obj_status);
                                        });
                                    } else {
                                        var objModelFresh_Quote_Job = new Fresh_Quote_Job(obj_fresh_quote_job);
                                        objModelFresh_Quote_Job.save(function (err, objDbFresh_Quote_Job) {
                                            obj_status['Status'] = 'SUCCESS';
                                            obj_status['Msg'] = quote_file;
                                            obj_status['Fresh_Quote_Job_Id'] = objDbFresh_Quote_Job['Fresh_Quote_Job_Id'];
                                            res.json(obj_status);
                                        });
                                    }
                                }
                            });
                        }

                    } catch (e) {
                        obj_status['Status'] = 'EXCEPTION';
                        obj_status['Msg'] = e.stack;
                        res.json(obj_status);
                    }
                });
            });
        } catch (e) {
            obj_status['Status'] = 'EXCEPTION';
            obj_status['Msg'] = e.stack;
            res.json(obj_status);
        }
    });
    app.post('/fresh_quotes/globalassure/upload', function (req, res) {
        let obj_status = {
            'Status': 'pending',
            'Msg': 'pending'
        };
        try {
            var formidable = require('formidable');
            var form = new formidable.IncomingForm();
            var fs = require('fs');
            form.parse(req, function (err, fields, files) {
                var source_path = files.files_global_mis.path;
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
                            let quote_file = 'fresh_quote_' + moment().utcOffset("+05:30").format('YYYYMMDD_HHmmss') + '.csv';
                            let quote_file_sys_path = appRoot + "/tmp/fresh_quote/" + quote_file;
                            // Write the file
                            fs.writeFile(quote_file_sys_path, data, function (err) {
                                if (err) {
                                    obj_status['Status'] = 'ERR_FILE_WRITE';
                                    obj_status['Msg'] = err;
                                    res.json(obj_status);
                                } else {
                                    obj_status['Status'] = 'SUCCESS';
                                    obj_status['Msg'] = quote_file;
                                    res.json(obj_status);
                                }
                            });
                        }
                    } catch (e) {
                        obj_status['Status'] = 'EXCEPTION';
                        obj_status['Msg'] = e.stack;
                        res.json(obj_status);
                    }
                });
            });
        } catch (e) {
            obj_status['Status'] = 'EXCEPTION';
            obj_status['Msg'] = e.stack;
            res.json(obj_status);
        }
    });
    app.post('/fresh_quotes/globalassure/process', function (req, res, next) {
        try {
            let import_file = req.body['Data_File'];
            let op = (req.query.hasOwnProperty('op') && req.query['op'] !== '') ? req.query['op'] : 'NA';
            let import_file_path = appRoot + "/tmp/fresh_quote/" + import_file;
            let syncSummary = {
                'Status': 'PENDING',
                'Details': {},
                'Msg': ''
            };
            let obj_data_validation = {
                'Total': 0,
                'Valid': 0,
                'TRANS_SUCCESS_WITH_POLICY': 0,
                'PROPOSAL_SUBMIT': 0,
                'TRANS_FAIL': 0,
                'POLICY_CANCELLED': 0,
                'Summary': []
            };
            let obj_mis_schema = {
                "first_name": "FirstName",
                "middle_name": "MiddleName",
                "last_name": "LastName",
                "birth_date": "InsuredDOB",
                "email": "EmailID",
                "mobile": "CustomerMobileNo",
                "gender": "InsuredGender",
                "permanent_address_1": "PermanentAddress1",
                "permanent_address_2": "PermanentAddress2",
                "permanent_address_3": "PermanentAddress3",
                "permanent_pincode": "",
                "communication_address_1": "PermanentAddress1",
                "communication_address_2": "PermanentAddress2",
                "communication_address_3": "PermanentAddress3",
                "communication_pincode": "",
                "city_name": "PermanentCity",
                "state_name": "PermanentState",
                "net_premium": "",
                "final_premium": "TotalPlanAmount",
                "service_tax": "GST (18%)",
                "nominee_name": "NomineeName",
                "nominee_birth_date": "NomineeDOB",
                "nominee_relation_text": "NomineeRelationship",
                "nominee_relation": "NomineeRelationship",
                "nominee_gender": "NomineeGender",
                "erp_plan_name": "Plan",
                "policy_number": "CertificateNo",
                "transaction_id": "PaymentReferenceNo",
                "udid": 'PId',
                "policy_start_date": 'CoverStartDate',
                "policy_end_date": 'CoverEndDate',
                "member_1_first_name": "FirstName",
                "member_1_middle_name": "MiddleName",
                "member_1_last_name": "LastName",
                "member_1_birth_date": "InsuredDOB",
                "member_1_gender": "InsuredGender",
                "member_1_nominee_rel": "NomineeRelationship",
                "partner_payment_status": "CertificateStatus"
            };
            let User_Data = require(appRoot + '/models/user_data');
            fs.createReadStream(import_file_path)
                    .pipe(csv())
                    .on('data', (row) => {
                        //console.log(row);
                        try {
                            obj_data_validation['Total']++;
                            let is_data_valid = false;
                            let ud_data = {};
                            for (let k in obj_mis_schema) {
                                let row_field_val = row[obj_mis_schema[k]];
                                if (k.indexOf('gender') > -1) {
                                    row_field_val = (row_field_val == 'Male') ? 'M' : 'F';
                                }
                                if (k.indexOf('_date') > -1 && row_field_val !== '') {
                                    let dt_format = 'YYYY-MM-DD';
                                    row_field_val = row_field_val.split(' ')[0];
                                    if (moment(row_field_val, 'DD-MM-YYYY', true).isValid()) {
                                        dt_format = 'DD-MM-YYYY';
                                    }
                                    if (moment(row_field_val, 'DD-MMMM-YYYY', true).isValid()) {
                                        dt_format = 'DD-MMMM-YYYY';
                                    }
                                    if (moment(row_field_val, 'DD/MM/YYYY', true).isValid()) {
                                        dt_format = 'DD/MM/YYYY';
                                    }
                                    row_field_val = moment(row_field_val, dt_format).format('YYYY-MM-DD');
                                }
                                ud_data[k] = row_field_val;
                            }
                            if (ud_data['udid'] > 0) {
                                ud_data['udid'] = ud_data['udid'] - 0;
                                is_data_valid = true;
                            }
                            if (is_data_valid) {
                                ud_data["contact_name"] = ud_data['first_name'] + ' ' + ud_data['middle_name'] + ' ' + ud_data['last_name'];
                                ud_data["contact_name"] = ud_data["contact_name"].replace('  ', ' ');
                                ud_data['original_mis'] = row;
                                ud_data['health_insurance_type'] = 'individual';
                                let arr_permanent_pincode = ud_data['permanent_address_2'].split(' ');
                                if (arr_permanent_pincode.length > 0 && arr_permanent_pincode[arr_permanent_pincode.length - 1] !== '' && isNaN(arr_permanent_pincode[arr_permanent_pincode.length - 1]) === false) {
                                    ud_data['permanent_pincode'] = arr_permanent_pincode[arr_permanent_pincode.length - 1];
                                }
                                let arr_communication_pincode = ud_data['communication_address_2'].split(' ');
                                if (arr_communication_pincode.length > 0 && arr_communication_pincode[arr_communication_pincode.length - 1] !== '' && isNaN(arr_communication_pincode[arr_communication_pincode.length - 1]) === false) {
                                    ud_data['communication_pincode'] = arr_communication_pincode[arr_communication_pincode.length - 1];
                                }
                                let arr_si = ['25', '50', '100', '200'];
                                for (let j in arr_si) {
                                    if (row['Plan'].indexOf(arr_si[j]) > -1) {
                                        ud_data['health_insurance_si'] = arr_si[j] + '000';
                                        break;
                                    }
                                }
                                ud_data['adult_count'] = 1;
                                ud_data['child_count'] = 0;
                                ud_data['policy_tenure'] = 1;
                                let Last_Status = '';
                                if (ud_data['partner_payment_status'] === 'Payment Entry') {
                                    Last_Status = 'TRANS_SUCCESS_WITH_POLICY';
                                }
                                if (ud_data['partner_payment_status'] === 'Pending Payment') {
                                    Last_Status = 'TRANS_FAIL';
                                }
                                if (ud_data['partner_payment_status'] === 'Certificate Cancelled') {
                                    Last_Status = 'POLICY_CANCELLED';
                                }
                                //ud_data['erp_source'] = 'FRESH-NM';
                                ud_data['service_tax'] = Math.round(ud_data['service_tax']);
                                ud_data['final_premium'] = Math.round(ud_data['final_premium']);
                                ud_data['net_premium'] = (ud_data['final_premium'] - 0) - (ud_data['service_tax'] - 0);
                                ud_data['Last_Status'] = Last_Status;
                                obj_data_validation[Last_Status]++;
                                obj_data_validation['Summary'].push(ud_data);
                                obj_data_validation['Valid']++;
                                let ud_cond = {
                                    "User_Data_Id": ud_data['udid'],
                                    'Product_Id': 17,
                                    'Last_Status': {$in: ['BUY_NOW_CUSTOMER', 'PROPOSAL_SUBMIT', 'TRANS_FAIL']}
                                };
                                User_Data.findOne(ud_cond, function (err, dbUserData) {
                                    if (err) {
                                        console.error('Exception', err);
                                    }
                                    if (dbUserData) {
                                        let ud_status = {
                                            'Status': 'PENDING',
                                            'Msg': ''
                                        };
                                        try {
                                            dbUserData = dbUserData._doc;
                                            let Premium_Request = dbUserData['Premium_Request'];
                                            for (let i in ud_data) {
                                                if (typeof ud_data[i] !== 'object') {
                                                    Premium_Request[i] = ud_data[i];
                                                }
                                            }
                                            let Proposal_Request_Core = Premium_Request;
                                            Proposal_Request_Core['original_mis'] = ud_data['original_mis'];
                                            let Erp_Qt_Request_Core = {};
                                            for (let i in  Premium_Request) {
                                                Erp_Qt_Request_Core['___' + i + '___'] = Premium_Request[i];
                                            }
                                            Erp_Qt_Request_Core['___salutation_text___'] = (Erp_Qt_Request_Core['___gender___'] == 'M') ? 'MR' : 'MRS';
                                            Erp_Qt_Request_Core['___communication_city___'] = Erp_Qt_Request_Core['___city_name___'];
                                            Erp_Qt_Request_Core['___pan___'] = '';
                                            Erp_Qt_Request_Core['___erp_product_id___'] = 1;
                                            Erp_Qt_Request_Core['___erp_product_name___'] = 'Health';
                                            Erp_Qt_Request_Core['___nominee_age___'] = moment().diff(Erp_Qt_Request_Core['___nominee_birth_date___'], 'years');
                                            let arr_nominee = Erp_Qt_Request_Core['___nominee_name___'].split(' ');
                                            Erp_Qt_Request_Core['___nominee_first_name___'] = arr_nominee[0];
                                            Erp_Qt_Request_Core['___nominee_last_name___'] = (typeof arr_nominee[1] !== 'undefined') ? arr_nominee[1] : '';
                                            Erp_Qt_Request_Core['___current_date___'] = Erp_Qt_Request_Core['___policy_start_date___'];
                                            Erp_Qt_Request_Core['___erp_posp_product___'] = 2;
                                            Erp_Qt_Request_Core['___remarks___'] = '';
                                            Erp_Qt_Request_Core['___tp_other___'] = '0';
                                            Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___'] = '0';
                                            Erp_Qt_Request_Core['___member_1_height___'] = '0';
                                            Erp_Qt_Request_Core['___member_1_weight___'] = '0';
                                            Erp_Qt_Request_Core['___erp_is_posp___'] = 'NONPOSP';
                                            Erp_Qt_Request_Core['___erp_qt___'] = '';
                                            Erp_Qt_Request_Core['___elite_flag___'] = 0;
                                            Erp_Qt_Request_Core['___insurerco_name___'] = 'RELIANCE GENERAL INSURANCE CO LTD';
                                            let plan_code = '';
                                            if (Erp_Qt_Request_Core['___erp_plan_name___'].indexOf('Gold') > -1) {
                                                Erp_Qt_Request_Core['___erp_plan_name___'] = 'Covid-19 Gold';
                                            }
                                            if (Erp_Qt_Request_Core['___erp_plan_name___'].indexOf('Silver') > -1) {
                                                Erp_Qt_Request_Core['___erp_plan_name___'] = 'Covid-19 Silver';
                                            }
                                            if (Erp_Qt_Request_Core['___erp_plan_name___'].indexOf('Platinum') > -1) {
                                                Erp_Qt_Request_Core['___erp_plan_name___'] = 'Covid-19 Platinum';
                                            }
                                            if (Erp_Qt_Request_Core['___erp_plan_name___'].indexOf('Titanium') > -1) {
                                                Erp_Qt_Request_Core['___erp_plan_name___'] = 'Covid-19 Titanium';
                                            }
                                            Erp_Qt_Request_Core['___erp_business_group___'] = 'Global Assure';
                                            var Status_History = (dbUserData.hasOwnProperty('Status_History')) ? dbUserData.Status_History : [];
                                            Status_History.unshift({
                                                "Status": Last_Status,
                                                "StatusOn": new Date()
                                            });
                                            var objUserData = {
                                                'Last_Status': Last_Status,
                                                'Status_History': Status_History,
                                                'Premium_Request': Premium_Request,
                                                'Proposal_Request': Proposal_Request_Core,
                                                'Proposal_Request_Core': Proposal_Request_Core,
                                                'Erp_Qt_Request_Core': Erp_Qt_Request_Core
                                            };
                                            if (Last_Status === 'TRANS_SUCCESS_WITH_POLICY') {
                                                let policy_number = objUserData['Erp_Qt_Request_Core']['___policy_number___'];
                                                let insurer_pdf_url = 'https://rsa.globalassure.com/Temp/PDF/' + objUserData['Erp_Qt_Request_Core']['___policy_number___'] + '.pdf';
                                                objUserData['ERP_CS'] = 'PENDING';
                                                let pdf_file_name = 'Reliance_CoronaCare_' + policy_number + '.pdf';
                                                let pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                                                let pdf_web_path_horizon = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                                                objUserData['Transaction_Data'] = {
                                                    "policy_url": pdf_web_path_horizon,
                                                    "pg_debit_document_url": '',
                                                    "pg_debit_statement_url": '',
                                                    "policy_number": objUserData['Erp_Qt_Request_Core']['___policy_number___'],
                                                    "policy_id": '',
                                                    "transaction_status": 'SUCCESS',
                                                    "pg_status": 'SUCCESS',
                                                    "transaction_id": objUserData['Erp_Qt_Request_Core']['___transaction_id___'],
                                                    "transaction_amount": objUserData['Erp_Qt_Request_Core']['___final_premium___'],
                                                    "pg_reference_number_1": objUserData['Erp_Qt_Request_Core']['___transaction_id___'],
                                                    "pg_reference_number_2": '',
                                                    "pg_reference_number_3": '',
                                                    'insurer_pdf_url': insurer_pdf_url
                                                };
                                                if (op == 'EXECUTE') {
                                                    var https = require('https');
                                                    var request = https.get(insurer_pdf_url, function (response) {
                                                        if (response.statusCode == 200) {
                                                            var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                                                            response.pipe(file_horizon);
                                                        }
                                                    });
                                                }
                                            }
                                            if (Last_Status === 'TRANS_FAIL') {
                                                objUserData['Transaction_Data'] = {
                                                    "policy_url": '',
                                                    "pg_debit_document_url": '',
                                                    "pg_debit_statement_url": '',
                                                    "policy_number": '',
                                                    "policy_id": '',
                                                    "transaction_status": 'FAIL',
                                                    "pg_status": 'FAIL',
                                                    "transaction_id": objUserData['Erp_Qt_Request_Core']['___transaction_id___'],
                                                    "transaction_amount": objUserData['Erp_Qt_Request_Core']['___final_premium___'],
                                                    "pg_reference_number_1": objUserData['Erp_Qt_Request_Core']['___transaction_id___'],
                                                    "pg_reference_number_2": '',
                                                    "pg_reference_number_3": '',
                                                    'insurer_pdf_url': ''
                                                };
                                            }
                                            if (op == 'EXECUTE') {
                                                User_Data.update({'User_Data_Id': dbUserData.User_Data_Id}, {$set: objUserData}, function (err, numAffected) {
                                                    console.log('UserDataUpdated', err, numAffected);
                                                });
                                                ud_status.Status = 'STATUS';
                                            }
                                        } catch (e) {
                                            ud_status.Status = 'EXCEPTION';
                                            ud_status.Msg = e.stack;
                                        }
                                        var today = moment().utcOffset("+05:30");
                                        var today_str = moment(today).format("YYYYMMD");
                                        ud_status['row'] = row;
                                        ud_status['ud_data'] = ud_data;
                                        ud_status['objUserData'] = objUserData;
                                        fs.appendFile(appRoot + "/tmp/log/global_mis_" + today_str + ".log", JSON.stringify(ud_status) + "\r\n", function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                        });
                                    }
                                });
                            } else {
                                obj_data_validation['InValid']++;
                            }
                        } catch (e) {
                            res.send(e.stack);
                        }
                    })
                    .on('end', () => {
                        console.log('CSV file successfully processed');
                        syncSummary['Status'] = 'SUCCESS';
                        syncSummary['Msg'] = 'Data is validated';
                        syncSummary['Details'] = obj_data_validation;
                        res.json(syncSummary);
                    });
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.post('/fresh_quotes/html/upload', function (req, res) {
        let obj_status = {
            'Status': 'pending',
            'Msg': 'pending',
            'File_Name': ''
        };
        try {
            var formidable = require('formidable');
            var form = new formidable.IncomingForm();
            var fs = require('fs');
            form.parse(req, function (err, fields, files) {
                var source_path = files.files_html.path;
                fs.readFile(source_path, function (err, data) {
                    try {
                        if (err)
                        {
                            obj_status['Status'] = 'ERR_FILE_READ';
                            obj_status['Msg'] = err;
                            res.json(obj_status);
                        } else {
                            console.log('File read!');
                            let html_file = 'html2pdf_' + moment().utcOffset("+05:30").format('YYYYMMDD_HHmmss') + '.html';
                            let quote_file_sys_path = "/var/www/Production/hcdn/html/pdftool/" + html_file;
                            // Write the file
                            fs.writeFile(quote_file_sys_path, data, function (err) {
                                if (err) {
                                    obj_status['Status'] = 'ERR';
                                    obj_status['Msg'] = err;
                                    res.json(obj_status);
                                } else {
                                    obj_status['Status'] = 'SUCCESS';
                                    obj_status['Msg'] = html_file;
                                    res.json(obj_status);
                                }
                            });
                        }
                    } catch (e) {
                        obj_status['Status'] = 'EXCEPTION';
                        obj_status['Msg'] = e.stack;
                        res.json(obj_status);
                    }
                });
            });
        } catch (e) {
            obj_status['Status'] = 'EXCEPTION';
            obj_status['Msg'] = e.stack;
            res.json(obj_status);
        }
    });
    app.get('/get_allocation_list/:campaign_name', function (req, res, next) {
        try {
            var Lead = require('../models/leads');
            let campaign_name = req.params['campaign_name'];
            let file_name = appRoot + "/resource/request_file/campaign_list.json";
            let campaignJSON = fs.readFileSync(file_name, 'utf8');
            let objArr = JSON.parse(campaignJSON);
            let objcampaign = {};
            let objcampaign_temp = [];
            for (var i in objArr) {
                if (campaign_name === i) {
                    objcampaign = objArr[i]["uid"];
                    for (var k in objcampaign) {
                        var agent = {
                            "uid": objcampaign[k].split('-')[0],
                            "name": objcampaign[k].split('-')[1],
                            "ss_id": objcampaign[k].split('-')[2]
                        };
                        objcampaign_temp.push(agent);
                    }
                }
            }
            rq_res = res;
            rq_res['objcampaign_temp'] = objcampaign_temp;
            if (objcampaign_temp.length > 0) {
                Lead.findOne({'lead_type': 'website', "agent_details.ss_id": {$exists: true}}).sort({'Lead_Id': -1}).exec(function (err, db_Data) {
                    if (err) {
                        rq_res.json({msg: 'fail', error: err});
                    } else {
                        console.log(db_Data + rq_res);
                        let indexCamp = 0;
                        if (db_Data._doc) {
                            db_Data = db_Data._doc;
                            var objcampaign_temp = rq_res['objcampaign_temp'];
                            for (var i in objcampaign_temp) {
                                if (objcampaign_temp[i]['ss_id'] == db_Data['lead_assigned_ssid']) {
                                    indexCamp = i;
                                }
                            }
                            if (indexCamp == (objcampaign_temp.length - 1) || indexCamp === 0) {
                                rq_res.json(objcampaign_temp[0]);
                            } else {
                                rq_res.json(objcampaign_temp[(indexCamp - 0) + 1]);
                            }
                        } else {
                            rq_res.json({msg: 'fail', error: db_Data._doc});
                        }
                    }
                });
            } else {
                res.json({msg: 'fail', error: objcampaign_temp});
            }
        } catch (e) {
            res.json({msg: 'fail', error: e.stack});
            /*var Email = require('../models/email');
             var objModelEmail = new Email();
             var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Get Allocation List';
             email_body = '<html><body><p>Hi,</p><BR/><p>Please find below error for get_allocation_list service.</p>'
             + '<BR><p>Error : ' + e.stack + ' </p></body></html>';
             var arrTo = [config.environment.notification_email, 'anuj.singh@policyboss.com', 'ashish.hatia@policyboss.com', 'chirag.modi@policyboss.com'];
             if (config.environment.name === 'Production') {
             objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, '', '', ''); //UAT
             }
             var SmsLog = require('../models/sms_log');
             var objSmsLog = new SmsLog();
             var customer_msg = "HORIZON-ALLOCATION-LIST\n\---------------\n\ Hi ,\n\Please find error for \n\get_allocation_list service. \n\ Error : " + e.stack;
             objSmsLog.send_sms('9619160851', customer_msg, 'METHOD_ERR_MSG'); //Anuj
             objSmsLog.send_sms('7208803933', customer_msg, 'METHOD_ERR_MSG'); //Ashish
             objSmsLog.send_sms('7666020532', customer_msg, 'METHOD_ERR_MSG'); //Chirag
             */
        }
    });
    app.get('/get_allocation_list_Old/:campaign_name', function (req, res, next) {
        try {
            let campaign_name = req.params['campaign_name'];
            let file_name = appRoot + "/resource/request_file/campaign_list.json";
            let campaignJSON = fs.readFileSync(file_name, 'utf8');
            let objArr = JSON.parse(campaignJSON);
            let uid_return = "";
            let uid_return_new = "";
            let objcampaign = {};
            for (var i in objArr) {
                if (campaign_name === i) {
                    objcampaign = objArr[i];
                    uid_return = objcampaign["uid"][objcampaign['count']];
                    uid_return_new = uid_return;
                    if (typeof uid_return === "string") {
                        uid_return_new = uid_return;
                        uid_return = uid_return.split('-')[0] - 0;
                    }
                    objArr[i]['count'] = objcampaign['count'] + 1;
                    if (objcampaign["uid"].length === objcampaign['count']) {
                        objArr[i]['count'] = 0;
                    }
                }
            }
            let json = JSON.stringify(objArr);
            fs.writeFile(file_name, json);
            if (typeof uid_return_new === "string") {
                res.json({uid: uid_return, name: uid_return_new.split('-')[1], ss_id: uid_return_new.split('-')[2]});
            } else {
                res.json({uid: uid_return_new});
            }
        } catch (e) {
            res.json({msg: 'fail', url: '', error: e.stack});
        }
    });
    app.get('/fresh_quotes/caller_performance_report', LoadSession, function (req, res, next) {
        //console.log('Start', this.constructor.name, 'quick_report');
        try {
            var report_type = req.query['report_type'] || 'DAILY';
            var op = req.query['op'] || '';
            if (op === 'DOWNLOAD') {
                if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.uid == '114504') {

                } else {
                    return res.send('Access_Denied');
                }
            }
            var today = moment().utcOffset("+05:30").startOf('Day');
            var yesterday = moment(today).add(-1, 'days');
            let day_interval = -1;
            let StartDate;
            let EndDate;
            if (report_type === 'DAILY' || report_type === 'WEEKLY') {
                if (report_type === 'DAILY') {
                    day_interval = -1;
                }
                if (report_type === 'WEEKLY') {
                    day_interval = -7;
                }
                StartDate = moment().add(day_interval, 'days').utcOffset("+05:30").startOf('Day');
                EndDate = moment(yesterday).utcOffset("+05:30").endOf('Day');
            }
            if (report_type === 'CUSTOM') {
                var dateto = req.query['dateto'] || '';
                var datefrom = req.query['datefrom'] || '';
                if (dateto !== '' && datefrom !== '') {
                    StartDate = moment(datefrom).utcOffset("+05:30").startOf('Day');
                    EndDate = moment(dateto).utcOffset("+05:30").endOf('Day');
                } else {
                    res.send('Invalid date range');
                }
            }
            var ud_disposed_cond = {
                "Created_On": {"$gte": StartDate, "$lte": EndDate},
                "Premium_Request.utm_source": "LERP_FRESH",
                //"Premium_Request.mobile": {"$ne": 9999999999},
                //"lead_assigned_uid": {"$gt": 0}
            };
            /*var disposed_agg = [
             {"$match": ud_disposed_cond},
             {"$group": {
             "_id": {"Disposition_Status": "$Disposition_Status", "Disposition_SubStatus": "$Disposition_SubStatus"},
             "Disposed_Count": {"$sum": 1}
             }},
             {"$project": {"_id": 0, "Disposition_Status": "$_id.Disposition_Status", "Disposition_SubStatus": "$_id.Disposition_SubStatus", "Disposed_Count": 1}},
             {"$sort": {"Disposition_SubStatus": 1}}
             ];*/
            let User_Data = require(appRoot + '/models/user_data');
            User_Data.find(ud_disposed_cond).select('PB_CRN Premium_Request User_Data_Id Created_On Modified_On Disposition_Status Disposition_SubStatus Disposition_Modified_On lead_assigned_uid lead_assigned_name lead_assigned_on Lead_Call_Back_Time').sort({'Created_On': 1}).exec(function (err, dbUser_Data_List) {
                if (err) {
                    return res.send(err);
                }
                if (dbUser_Data_List) {
                    try {
                        let arr_disposed = [];
                        let lead_allocated_count = 0;
                        let lead_created_count = dbUser_Data_List.length;
                        let obj_disposition_summary = {};
                        let arr_disposition_summary = [];
                        let obj_caller_summary = {};
                        let arr_caller_summary = [];
                        let obj_expiry_summary = {};
                        let arr_expiry_summary = [];
                        let obj_make_summary = {};
                        let arr_make_summary = [];
                        for (let k in dbUser_Data_List) {
                            let fq = dbUser_Data_List[k]._doc;
                            if (fq.hasOwnProperty('lead_assigned_uid') && fq['lead_assigned_uid'] > 0 && fq['Premium_Request']['mobile'] !== 9999999999) {
                                lead_allocated_count++;
                                let uid = fq['lead_assigned_uid'];
                                let caller = fq['lead_assigned_name'].replace(/ /g, '_');
                                let expiry_on = fq['Premium_Request']['policy_expiry_date'];
                                let make = fq['Premium_Request']['vehicle_full'].split('|')[0];
                                //for caller
                                if (obj_caller_summary.hasOwnProperty(uid) === false) {
                                    obj_caller_summary[uid] = {
                                        'Caller': caller,
                                        'UID': uid,
                                        'Allocate_Count': 0,
                                        'Dispose_Count': 0
                                    };
                                }
                                obj_caller_summary[uid]['Allocate_Count']++;
                                //for expiry
                                if (obj_expiry_summary.hasOwnProperty(expiry_on) === false) {
                                    obj_expiry_summary[expiry_on] = {
                                        'Expiry_On': expiry_on,
                                        'Allocate_Count': 0,
                                        'Dispose_Count': 0
                                    };
                                }
                                obj_expiry_summary[expiry_on]['Allocate_Count']++;
                                //for make
                                if (obj_make_summary.hasOwnProperty(make) === false) {
                                    obj_make_summary[make] = {
                                        'Make': make,
                                        'Allocate_Count': 0,
                                        'Dispose_Count': 0
                                    };
                                }
                                obj_make_summary[make]['Allocate_Count']++;
                                if (fq.hasOwnProperty('Disposition_SubStatus') && fq['Disposition_SubStatus'] !== '') {
                                    let disp = fq['Disposition_Status'];
                                    let sub_disp = fq['Disposition_SubStatus'];
                                    let disp_ident = disp + '-' + sub_disp;
                                    disp_ident = disp_ident.replace(/ /g, '_');
                                    //for disposition
                                    if (obj_disposition_summary.hasOwnProperty(disp_ident) === false) {
                                        obj_disposition_summary[disp_ident] = {
                                            'Disposition': disp,
                                            'Sub_Disposition': sub_disp,
                                            'Count': 0
                                        };
                                    }
                                    obj_disposition_summary[disp_ident]['Count']++;
                                    //for caller                                
                                    obj_caller_summary[uid]['Dispose_Count']++;
                                    //for expiry
                                    obj_expiry_summary[expiry_on]['Dispose_Count']++;
                                    //for make
                                    obj_make_summary[make]['Dispose_Count']++;
                                    arr_disposed.push({
                                        'User_Data_Id': fq['User_Data_Id'],
                                        'PB_CRN': fq['PB_CRN'],
                                        'Erp_Qt': fq['Premium_Request']['erp_qt'],
                                        //'Customer': fq['Premium_Request']['first_name'] + ' ' + fq['Premium_Request']['last_name'],
                                        'Make': fq['Premium_Request']['vehicle_full'].split('|')[0],
                                        'Model': fq['Premium_Request']['vehicle_full'].split('|')[1],
                                        'Variant': fq['Premium_Request']['vehicle_full'].split('|')[2],
                                        'Rto': fq['Premium_Request']['rto_full'].split('|')[0],
                                        'Expiry_On': fq['Premium_Request']['policy_expiry_date'],
                                        'Disposition_Status': fq['Disposition_Status'],
                                        'Disposition_SubStatus': fq['Disposition_SubStatus'],
                                        'Lead_Assigned_To': fq['lead_assigned_name'],
                                        'Lead_Assigned_UID': fq['lead_assigned_uid'],
                                        'Created_On': fq['Created_On'].toLocaleString(),
                                        'Lead_Assigned_On': fq['lead_assigned_on'].toLocaleString(),
                                        'Disposition_On': fq['Disposition_Modified_On'].toLocaleString(),
                                        'Next_CallBack_On': fq['Lead_Call_Back_Time'] ? fq['Lead_Call_Back_Time'].toLocaleString() : 'NA'
                                    });
                                }
                            }
                        }
                        //disposition
                        for (var k in obj_disposition_summary) {
                            arr_disposition_summary.push(obj_disposition_summary[k]);
                        }
                        arr_disposition_summary.sort(function (a, b) {
                            return b.Count - a.Count;
                        });
                        //caller
                        for (var k in obj_caller_summary) {
                            arr_caller_summary.push(obj_caller_summary[k]);
                        }
                        arr_caller_summary.sort(function (a, b) {
                            return b.Allocate_Count - a.Allocate_Count;
                        });
                        //expiry
                        for (var k in obj_expiry_summary) {
                            arr_expiry_summary.push(obj_expiry_summary[k]);
                        }
                        arr_expiry_summary.sort(function (a, b) {
                            return b.Allocate_Count - a.Allocate_Count;
                        });

                        //make
                        for (var k in obj_make_summary) {
                            arr_make_summary.push(obj_make_summary[k]);
                        }
                        arr_make_summary.sort(function (a, b) {
                            return b.Allocate_Count - a.Allocate_Count;
                        });
                        var today_str = moment().format('YYYYMMDD_HHmmss');
                        let file_name = 'visitor_disposition_' + today_str;
                        file_name = file_name.toUpperCase();
                        let file_weburl = config.environment.downloadurl + "/report/" + file_name + '.csv';
                        let csv_file = appRoot + "/tmp/report/" + file_name + '.csv';
                        var ObjectsToCsv = require('objects-to-csv');
                        let csv = new ObjectsToCsv(arr_disposed);
                        csv.toDisk(csv_file);
                        if (op === 'DOWNLOAD') {
                            return res.json({
                                'URL': file_weburl
                            });
                        } else {
                            var subject = '[REPORT][CAMPAIGN-DAILY] ' + file_name;
                            var content_html = '<!DOCTYPE html><html><head><style>*,html,body{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>' + file_name + '</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                            content_html += '<div class="report" >';
                            content_html += '<span>LEAD CREATED COUNT : ' + lead_created_count + '</span><br>';
                            content_html += '<span>LEAD ALLOCATED COUNT : ' + lead_allocated_count + '</span><br>';
                            content_html += '<span>LEAD DISPOSED COUNT : ' + arr_disposed.length + '</span><br>';
                            content_html += '<p><a href="' + file_weburl + '" target="_BLANK">DOWNLOAD DISPOSED DATA</a></p>';
                            content_html += '</div><br>';
                            content_html += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">SUB DISPOSITION SUMMARY</span>';
                            content_html += arr_object_to_table(arr_disposition_summary);
                            content_html += '</div><br>';
                            content_html += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">CALLER DISPOSITION SUMMARY</span>';
                            content_html += arr_object_to_table(arr_caller_summary);
                            content_html += '</div><br>';
                            content_html += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">EXPIRY SUMMARY</span>';
                            content_html += arr_object_to_table(arr_expiry_summary);
                            content_html += '</div><br>';
                            content_html += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">MAKE SUMMARY</span>';
                            content_html += arr_object_to_table(arr_make_summary);
                            content_html += '</div><br>';
                            content_html += '</body></html>';
                            var Email = require('../models/email');
                            var objModelEmail = new Email();
                            if (req.query['email'] === 'yes') {
                                let arr_to = ['susheeltejuja@landmarkinsurance.in', 'varun.kaushik@policyboss.com', 'amish.aggarwal@policyboss.com', 'kevin.menezes@policyboss.com', 'chirag.modi@policyboss.com'];
                                if (req.query['dbg'] === 'yes') {
                                    arr_to = ['chirag.modi@policyboss.com'];
                                }
                                objModelEmail.send('notifications@policyboss.com', arr_to.join(','), subject, content_html, '', config.environment.notification_email);
                                res.send(content_html);
                            }
                            if (req.query['json'] === 'yes') {
                                res.json(arr_disposition_summary);
                            }
                            if (req.query['html'] === 'yes') {
                                res.send(content_html);
                            }
                        }
                    } catch (e) {
                        return res.send(e.stack);
                    }
                } else {
                    res.json(ud_disposed_cond);
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/fresh_quotes/caller_performance_report_NIU', function (req, res, next) {
        //console.log('Start', this.constructor.name, 'quick_report');
        try {
            var today_start = moment().utcOffset("+05:30").startOf('Day');
            var today_end = moment().utcOffset("+05:30").endOf('Day');
            var yesterday_start = moment().add(-1, 'days').utcOffset("+05:30").startOf('Day');
            var yesterday_end = moment().add(-1, 'days').utcOffset("+05:30").endOf('Day');
            var today = moment().utcOffset("+05:30").startOf('Day');
            var ud_disposed_cond = {
                "Created_On": {"$gte": yesterday_start, "$lte": yesterday_end},
                "Premium_Request.utm_source": "LERP_FRESH",
                "Premium_Request.mobile": {"$ne": 9999999999},
                "lead_assigned_uid": {"$gt": 1}
            };
            var disposed_agg = [
                {"$match": ud_disposed_cond},
                {"$group": {
                        "_id": {"Disposition_Status": "$Disposition_Status", "Disposition_SubStatus": "$Disposition_SubStatus"},
                        "Disposed_Count": {"$sum": 1}
                    }},
                {"$project": {"_id": 0, "Disposition_Status": "$_id.Disposition_Status", "Disposition_SubStatus": "$_id.Disposition_SubStatus", "Disposed_Count": 1}},
                {"$sort": {"Disposition_SubStatus": 1}}
            ];
            let User_Data = require(appRoot + '/models/user_data');
            User_Data.find(ud_disposed_cond).select('PB_CRN Premium_Request User_Data_Id Created_On Modified_On Disposition_Status Disposition_SubStatus Disposition_Modified_On lead_assigned_uid lead_assigned_name lead_assigned_on Lead_Call_Back_Time').sort({'Created_On': 1}).exec(function (err, dbUser_Data_List) {
                if (err) {
                    return res.send(err);
                }
                if (dbUser_Data_List) {
                    try {
                        let arr_disposed = [];
                        let lead_allocated_count = dbUser_Data_List.length;
                        let obj_disposition_summary = {};
                        let arr_disposition_summary = [];
                        let obj_caller_summary = {};
                        let arr_caller_summary = [];
                        let obj_expiry_summary = {};
                        let arr_expiry_summary = [];
                        let obj_make_summary = {};
                        let arr_make_summary = [];
                        for (let k in dbUser_Data_List) {
                            let fq = dbUser_Data_List[k]._doc;
                            if (fq.hasOwnProperty('Disposition_SubStatus') && fq['Disposition_SubStatus'] !== '') {
                                let uid = fq['lead_assigned_uid'];
                                let disp = fq['Disposition_Status'];
                                let sub_disp = fq['Disposition_SubStatus'];
                                let caller = fq['lead_assigned_name'].replace(/ /g, '_');
                                let expiry_on = fq['Premium_Request']['policy_expiry_date'];
                                let disp_ident = disp + '-' + sub_disp;
                                let make = fq['Premium_Request']['vehicle_full'].split('|')[0];
                                disp_ident = disp_ident.replace(/ /g, '_');
                                //for disposition
                                if (obj_disposition_summary.hasOwnProperty(disp_ident) === false) {
                                    obj_disposition_summary[disp_ident] = {
                                        'Disposition': disp,
                                        'Sub_Disposition': sub_disp,
                                        'Count': 0
                                    };
                                }
                                obj_disposition_summary[disp_ident]['Count']++;
                                //for caller
                                if (obj_caller_summary.hasOwnProperty(uid) === false) {
                                    obj_caller_summary[uid] = {
                                        'Caller': caller,
                                        'UID': uid,
                                        'Count': 0
                                    };
                                }
                                obj_caller_summary[uid]['Count']++;
                                //for expiry
                                if (obj_expiry_summary.hasOwnProperty(expiry_on) === false) {
                                    obj_expiry_summary[expiry_on] = {
                                        'Expiry_On': expiry_on,
                                        'Count': 0
                                    };
                                }
                                obj_expiry_summary[expiry_on]['Count']++;
                                //for make
                                if (obj_make_summary.hasOwnProperty(make) === false) {
                                    obj_make_summary[make] = {
                                        'Make': make,
                                        'Count': 0
                                    };
                                }
                                obj_make_summary[make]['Count']++;
                                arr_disposed.push({
                                    'User_Data_Id': fq['User_Data_Id'],
                                    'PB_CRN': fq['PB_CRN'],
                                    'Erp_Qt': fq['Premium_Request']['erp_qt'],
                                    //'Customer': fq['Premium_Request']['first_name'] + ' ' + fq['Premium_Request']['last_name'],
                                    'Make': fq['Premium_Request']['vehicle_full'].split('|')[0],
                                    'Model': fq['Premium_Request']['vehicle_full'].split('|')[1],
                                    'Variant': fq['Premium_Request']['vehicle_full'].split('|')[2],
                                    'Rto': fq['Premium_Request']['rto_full'].split('|')[0],
                                    'Expiry_On': fq['Premium_Request']['policy_expiry_date'],
                                    'Disposition_Status': fq['Disposition_Status'],
                                    'Disposition_SubStatus': fq['Disposition_SubStatus'],
                                    'Lead_Assigned_To': fq['lead_assigned_name'],
                                    'Lead_Assigned_UID': fq['lead_assigned_uid'],
                                    'Created_On': fq['Created_On'].toLocaleString(),
                                    'Lead_Assigned_On': fq['lead_assigned_on'].toLocaleString(),
                                    'Disposition_On': fq['Disposition_Modified_On'].toLocaleString(),
                                    'Next_CallBack_On': fq['Lead_Call_Back_Time'] ? fq['Lead_Call_Back_Time'].toLocaleString() : 'NA'
                                });
                            }
                        }
                        //disposition
                        for (var k in obj_disposition_summary) {
                            arr_disposition_summary.push(obj_disposition_summary[k]);
                        }
                        arr_disposition_summary.sort(function (a, b) {
                            return b.Count - a.Count;
                        });
                        //caller
                        for (var k in obj_caller_summary) {
                            arr_caller_summary.push(obj_caller_summary[k]);
                        }
                        arr_caller_summary.sort(function (a, b) {
                            return b.Count - a.Count;
                        });
                        //expiry
                        for (var k in obj_expiry_summary) {
                            arr_expiry_summary.push(obj_expiry_summary[k]);
                        }
                        arr_expiry_summary.sort(function (a, b) {
                            return b.Count - a.Count;
                        });

                        //make
                        for (var k in obj_make_summary) {
                            arr_make_summary.push(obj_make_summary[k]);
                        }
                        arr_make_summary.sort(function (a, b) {
                            return b.Count - a.Count;
                        });
                        var today_str = moment().format('YYYYMMDD_HHmmss');
                        let file_name = 'visitor_disposition_' + today_str;
                        file_name = file_name.toUpperCase();
                        let file_weburl = config.environment.downloadurl + "/report/" + file_name + '.csv';
                        let csv_file = appRoot + "/tmp/report/" + file_name + '.csv';
                        var ObjectsToCsv = require('objects-to-csv');
                        let csv = new ObjectsToCsv(arr_disposed);
                        csv.toDisk(csv_file);
                        var subject = '[REPORT][CAMPAIGN-DAILY] ' + file_name;
                        var content_html = '<!DOCTYPE html><html><head><style>*,html,body{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>' + file_name + '</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                        content_html += '<div class="report" >';
                        content_html += '<span>LEAD ALLOCATED COUNT : ' + lead_allocated_count + '</span><br>';
                        content_html += '<span>LEAD DISPOSED COUNT : ' + arr_disposed.length + '</span><br>';
                        content_html += '<p><a href="' + file_weburl + '" target="_BLANK">DOWNLOAD DISPOSED DATA</a></p>';
                        content_html += '</div><br>';
                        content_html += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">SUB DISPOSITION SUMMARY</span>';
                        content_html += arr_object_to_table(arr_disposition_summary);
                        content_html += '</div><br>';
                        content_html += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">CALLER DISPOSITION SUMMARY</span>';
                        content_html += arr_object_to_table(arr_caller_summary);
                        content_html += '</div><br>';
                        content_html += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">EXPIRY SUMMARY</span>';
                        content_html += arr_object_to_table(arr_expiry_summary);
                        content_html += '</div><br>';
                        content_html += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">MAKE SUMMARY</span>';
                        content_html += arr_object_to_table(arr_make_summary);
                        content_html += '</div><br>';
                        content_html += '</body></html>';
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        if (req.query['email'] === 'yes') {
                            let arr_to = ['susheeltejuja@landmarkinsurance.in', 'varun.kaushik@policyboss.com', 'amish.aggarwal@policyboss.com', 'kevin.menezes@policyboss.com', 'chirag.modi@policyboss.com'];
                            if (req.query['dbg'] === 'yes') {
                                arr_to = ['chirag.modi@policyboss.com'];
                            }
                            objModelEmail.send('notifications@policyboss.com', arr_to.join(','), subject, content_html, '', config.environment.notification_email);
                            res.send(content_html);
                        }
                        if (req.query['json'] === 'yes') {
                            res.json(arr_disposition_summary);
                        }
                        if (req.query['html'] === 'yes') {
                            res.send(content_html);
                        }
                    } catch (e) {
                        return res.send(e.stack);
                    }
                } else {
                    res.json(ud_disposed_cond);
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
};
function sortObject(preObj) {
    var newO = {};
    Object.keys(preObj).sort(function (a, b) {
        return preObj[b] - preObj[a]
    }).map(key => newO[key] = preObj[key]);
    return newO;
}
function randomStr(len) {
    let arr_random = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans +=
                arr_random[Math.floor(Math.random() * arr_random.length)];
    }
    return ans;
}
function arr_object_to_table(arr_object) {
    let tblHtml = '<table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:         1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%">';
    let inc = 0;
    for (let k in arr_object) {
        if (inc === 0) {
            tblHtml += '<tr>';
            for (let k1 in arr_object[0]) {
                tblHtml += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01">' + k1 + '</th>';
            }
            tblHtml += '</tr>';
        }
        tblHtml += '<tr>';
        for (let k1 in arr_object[k]) {
            tblHtml += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;" align="center">' + arr_object[k][k1] + '</td>';
        }
        tblHtml += '</tr>';
        inc++;
    }
    tblHtml += '</table>';
    return tblHtml;
}
function LoadSession(req, res, next) {
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
            return next();
        }
    } catch (e) {
        console.error('Exception', 'GetReportingAssignedAgent', e);
        return next();

    }
}


