/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');

var Base = require('../libs/Base');
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var Email = require('../models/email');
var Email_Event = require('../models/email_event');
module.exports.controller = function (app) {
    app.post('/emails/search', function (req, res) {
        var objQuery = req.body;
        Email.find(objQuery, function (err, emails) {
            if (err)
                res.send(err);

            res.json(emails);
        });
    });
    app.post('/email_events/search', function (req, res) {
        var objQuery = req.body;
        Email_Event.find(objQuery, function (err, email_events) {
            if (err)
                res.send(err);

            res.json(email_events);
        });
    });
    app.post('/emails/inbox', LoadSession, function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: 'Policy_Email_Id Customer_Care_Email_Id Support_Email_Id PB_CRN From To Sub Created_On',
            sort: {'Created_On': 'desc'},
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
            if (req.body['Col_Name'] !== '' && req.body['txtCol_Val'] !== '') {
                filter[req.body['Col_Name']] = isNaN(req.body['txtCol_Val']) ? req.body['txtCol_Val'] : req.body['txtCol_Val'] - 0;
            }
            var Insurer_Email_Object = {
                "BajajAllianz": [],
                "BhartiAxa": ["Motor.Policy@bhartiaxa.com", "customer.service@bharti-axagi.co.in", "customer.service@bhartiaxa.com"],
                "Cholamandalam MS": [],
                "Future Generali": ["NCB-FG@futuregenerali.in", "fgcare@futuregenerali.in"],
                "HDFCERGO": ["Enetadvicemailing@hdfcbank.com", "NCBConfirmation@hdfcergo.com", "hdfcergo.service@hdfcergo.com", "no-reply@hdfcergo.com"],
                "ICICILombard": [],
                "IFFCOTokio": ["Deepak.Mandal@Iffcotokio.co.in", "noreply@iffcotokio.co.in"],
                "National Insurance": [],
                "Reliance": [],
                "RoyalSundaram": ["internet.marketing@royalsundaram.in", "no-reply@royalsundaram.in"],
                "TataAIG": [],
                "New India": ["info@newindia.co.in"],
                "Oriental": [],
                "UnitedIndia": [],
                "L&amp;T General": [],
                "Raheja QBE": [],
                "SBI General": [],
                "Shriram General": [],
                "UniversalSompo": ["customerservice@universalsompo.com"],
                "Max Bupa": [],
                "Apollo Munich": [],
                "DLF Pramerica": [],
                "Bajaj Allianz": [],
                "IndiaFirst": [],
                "AEGON Religare": [],
                "Star Health": ["jayashree.g@starhealth.in", "retail@starhealth.in"],
                "Express BPO": [],
                "HDFC Life": [],
                "Bharti Axa": ["Motor.Policy@bhartiaxa.com", "customer.service@bharti-axagi.co.in", "customer.service@bhartiaxa.com"],
                "Kotak Mahindra": [],
                "LIC India": [],
                "Birla Sun Life": [],
                "LibertyGeneral": ["HAT@libertyinsurance.in", "connect@libertyinsurance.in"],
                "Religare": [],
                "Magma HDI": [],
                "Indian Health Organisation": [],
                "TATA AIA": [],
                "Cigna TTK": [],
                "ICICI Pru": ["ankush.dhamija@iciciprulife.com"],
                "Aditya Birla": ["Commission.healthinsurance@adityabirlacapital.com", "Rupali.Singh2@adityabirlacapital.com", "communication.abh@adityabirlacapital.com"],
                "GoDigit": ["partner@godigit.com"],
                "Acko": ["broker@acko.com", "support@acko.com"],
                "Edelweiss": []
            };
            if (req.body['Sel_Insurer'] !== '') {
                if (Insurer_Email_Object[req.body['Sel_Insurer']].length > 0) {
                    filter['From'] = {$in: Insurer_Email_Object[req.body['Sel_Insurer']]};
                }
            }
        }
        let Inbox_Type = null;
        let Inbox_Type_Key = null;
        let Email_Inbox = null;
        Inbox_Type = req.body['Inbox_Type'];
        Inbox_Type_Key = req.body['Inbox_Type_Key'];
        if (Inbox_Type && Inbox_Type_Key) {
            Email_Inbox = require('../models/' + Inbox_Type);
            Email_Inbox.paginate(filter, optionPaginate).then(function (policy_emails) {
                res.json(policy_emails);
            });
        } else {
            res.send('NOT_VALID_REQUEST');
        }

    });

    app.post('/emails/inbox/view', function (req, res) {
        var Msg_Id = req.body['Msg_Id'] - 0;
        var Inbox_Type = req.body['Inbox_Type'];
        var Inbox_Type_Key = req.body['Inbox_Type_Key'];
        if (Msg_Id && Inbox_Type && Inbox_Type_Key) {
            var Email_Inbox = require('../models/' + Inbox_Type);
            var Cond = JSON.parse('{"' + Inbox_Type_Key + '"' + ':' + Msg_Id + '}');
            Email_Inbox.findOne(Cond, function (err, dbEmailInbox) {
                if (err)
                    res.send(err);

                res.json(dbEmailInbox);
            });
        } else {
            res.send('Input Error');
        }
    });
    app.get('/emails/view/:Email_Id', function (req, res) {
        var Email_Id = req.params.Email_Id;

        Email.find({'Email_Id': Email_Id}, function (err, email) {
            if (err)
                res.send(err);

            res.json(email);
        });
    });
    app.get('/emails/preview/:Email_Id', function (req, res) {
        var Email_Id = req.params.Email_Id - 0;

        Email.findOne({'Email_Id': Email_Id}, function (err, email) {
            if (err)
                res.send(err);
            if (email) {
                let content = email.Content;
                content = content.replace('<head>', '<head><meta name="viewport" content="width=device-width, initial-scale=1.0">');
                content = content.replace('"pboss.in', '"http://pboss.in');
                return res.send(content);
            } else {
                return res.send('<h1>INVALID EMAIL IDENTIFIER</h1>');
            }
        });
    });
    app.get('/emails/preview_by_sub', function (req, res) {
        var querystring = require('querystring');
        var Sub = req.query.hasOwnProperty('sub') ? querystring.unescape(req.query['sub']) : '';
        if (Sub !== '') {
            Email.findOne({'Sub': Sub}).sort({Email_Id: -1}).exec(function (err, email) {
                if (err)
                    res.send(err);
                if (email) {
                    let content = email.Content;
                    content = content.replace('<head>', '<head><meta name="viewport" content="width=device-width, initial-scale=1.0">');                    
                    return res.send(content);
                } else {
                    return res.send('<h1>INVALID EMAIL SUB</h1>');
                }
            });
        } else {
            return res.send('<h1>NO_SUB</h1>');
        }
    });
    app.post('/email/premium_breakup', function (req, res) {
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
