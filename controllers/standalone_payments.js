/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');
var moment = require('moment');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));

mongoose.Promise = global.Promise;
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
var standalon_payment = require('../models/standalone_payment');
module.exports.controller = function (app) {
    app.post('/standalone_payments/customer_data', function (req, res) {
        try {
            var standalon_payment = require('../models/standalone_payment');
            let objReq = req.body;
            if (objReq) {
                standalon_payment.findOne({'vehicle_reg_no': objReq.vehicle_reg_no}, function (err, objDbData) {
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
                                objDbData['insurer_id'] = objReq.insurer_id;
                                objDbData['Modefied_On'] = new Date();
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
                                    var merchant_id = ((config.environment.name === 'Production') ? '6756734' : '4825050');
                                    var amount = spData.premium_amount;
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
    app.post('/standalone_payments/pg', function (req, res) {
        try {
            let objReq = req.body;
            let reg_no = objReq.reg_no;
            let pg_id = objReq.pg_id - 0;

            this.objReq = objReq;
            var standalon_payment = require('../models/standalone_payment');
            standalon_payment.findOne({'vehicle_reg_no': reg_no, 'standalone_payment_id': pg_id}, function (err, dataSP) {
                try {
                    if (dataSP && dataSP._doc && dataSP._doc.hasOwnProperty('Horizon_Status') && (dataSP._doc['Horizon_Status'] === "PAYMENT_SUCCESS" || dataSP._doc['Horizon_Status'] === "FASTLANE_DONE"
                            || dataSP._doc['Horizon_Status'] === "PREMIUM_INITIATE" || dataSP._doc['Horizon_Status'] === "PROPOSAL_INITIATE" || dataSP._doc['Horizon_Status'] === "VERIFICATION_INITIATE")) {
                        res.json({
                            Status: 'Success',
                            Msg: ''
                        });
                    } else {
                        var objRequset = this.objReq;
                        var reg_no = objRequset.reg_no;
                        var pg_id = objRequset.pg_id - 0;
                        var pg_status = "PAYMENT_FAIL";
                        if (objRequset && objRequset.pg_post && objRequset.pg_post.status && objRequset.pg_post.status === "success") {
                            pg_status = "PAYMENT_SUCCESS";
                        }
                        standalon_payment.update({'vehicle_reg_no': reg_no, 'standalone_payment_id': pg_id}, {$set: {'pg_get': objRequset.pg_get, 'pg_post': objRequset.pg_post, 'status': 'Success', Horizon_Status: pg_status}}, {multi: false}, function (err, numAffected) {
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
    app.get('/standalone_payments/data/:pg_id', function (req, res) {
        try {
            var pg_id = req.params['pg_id'] ? req.params['pg_id'] - 0 : 0;
            if (isNaN(pg_id) === false && pg_id > 0) {
                var standalon_payment = require('../models/standalone_payment');
                standalon_payment.findOne({'standalone_payment_id': pg_id}, function (err, dbSP) {
                    if (err) {
                        res.json({
                            Status: 'Error',
                            Msg: err.stack
                        });
                    } else {
                        if (dbSP) {
                            res.json({
                                Status: 'Success',
                                Msg: dbSP
                            });
                        } else {
                            res.json({
                                Status: 'Fail',
                                Msg: 'pg id is not valid'
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
    app.post('/standalone_payments/save_logs', function (req, res) {
        try {
            var pg_id = req.body['standalone_payment_id'] ? req.body['standalone_payment_id'] - 0 : 0;
            var reg_no = req.body['vehicle_reg_no'] ? req.body['vehicle_reg_no'] : "";
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
    app.get('/standalone_payments/registration_no/:registration_no', function (req, res) {
        try {
            var User_Data = require(appRoot + '/models/user_data');
            var month = (req.query.hasOwnProperty('month')) ? req.query.month - 0 : 9;
            var start_date = moment().subtract(month, "months").format('YYYY-MM-DD');
            start_date = new Date(start_date + "T06:00:00Z");
            var end_date = moment().format('YYYY-MM-DD');
            end_date = new Date(end_date + "T05:59:59Z");
            var reg_no = (req.params.hasOwnProperty('registration_no')) ? req.params.registration_no : "";
            var ud_cond = {
                "Erp_Qt_Request_Core.___registration_no___": reg_no,
                "Modified_On": {"$gte": start_date, "$lte": end_date},
                "Last_Status": {$in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}
            };
            User_Data.findOne(ud_cond, function (err, dbUserData) {
                if (err) {
                    res.json({
                        Status: 'Error',
                        Msg: err.stack
                    });
                } else {
                    if (dbUserData) {
                        res.json({
                            Status: 'Success',
                            Msg: ''
                        });
                    } else {
                        res.json({
                            Status: 'Fail',
                            Msg: ''
                        });
                    }
                }
            });
        } catch (e) {
            res.json({
                Status: 'Error',
                Msg: e.stack
            });
        }
    });
    app.get('/standalone_payments/uw_guideline/:insurer_id', function (req, res) {
        try {
            var insurer_id = (req.params.hasOwnProperty('insurer_id')) ? req.params.insurer_id : "46";
            var fs = require('fs');
            fs.readFile(appRoot + '/resource/request_file/Edelweiss_TW_TopCity_Guidelines.json', "utf8", (err, data) => {
                if (err) {
                    res.json({
                        Status: 'Error',
                        Msg: err
                    });
                }
                if (data) {
                    res.json({
                        Status: 'Success',
                        Msg: data
                    });
                } else {
                    res.json({
                        Status: 'Fail',
                        Msg: ''
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
    app.get('/standalone_payments/summary', LoadSession, function (req, res) {
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
                "Created_On": {"$gte": dateFrom, "$lte": dateTo}
            };
            if (typeof req.query['page_action'] !== 'undefined') {
                if (req.obj_session.user.role_detail.role.indexOf('ProductAdmin') > -1) {
                    obj_cond['Product_Id'] = {$in: req.obj_session.user.role_detail.product};
                }
                if (req.query['page_action'] === 'all_transaction') {

                }
                if (req.query['page_action'] === 'ch_all_transaction' && false) {
                    var arr_ch_ssid = [];
                    var arr_ch_list = [];
                    if (req.obj_session.hasOwnProperty('users_assigned')) {
                        arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                    }
                    arr_ch_ssid.push(req.obj_session.user.ss_id);
                    arr_ch_list = req.obj_session.user.role_detail.channel_transaction;
                    obj_cond['$or'] = [
                        {'Premium_Request.channel': {$in: arr_ch_list}},
                        {'QData.ss_id': {$in: arr_ch_ssid}}
                    ];
                    //filter['Premium_Request.channel'] = req.obj_session.user.role_detail.channel;
                }
                if (req.query['page_action'] === 'my_transaction' || req.query['page_action'] === 'ch_all_transaction') {
                    var arr_ssid = [];
                    if (req.obj_session.hasOwnProperty('users_assigned')) {
                        var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                        arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                    }
                    obj_cond['QData.ss_id'] = req.obj_session.user.ss_id.toString();
                    if (arr_ssid.length > 0) {
                        arr_ssid.push(req.obj_session.user.ss_id);
                        obj_cond['Ss_Id'] = {$in: arr_ssid};
                    }
                }
            }
            standalon_payment.find(obj_cond).sort({'Created_On': 1}).select('-_id').exec(function (err, dbStandalon_Payments) {
                if (dbStandalon_Payments) {
                    try {
                        let obj_express_summary = {
                            'attempt': 0,
                            'payment_fail': 0,
                            'payment_dropoff': 0,
                            'policy': 0,
                            'policy_pending': 0
                        };
                        obj_express_summary['attempt'] = dbStandalon_Payments.length;
                        for (let k in dbStandalon_Payments) {
                            let sp = dbStandalon_Payments[k]._doc;
                            if (sp['status'] == 'Success') {
                                if (sp['Horizon_Status'] == 'TRANS_SUCCESS_WO_POLICY' || sp['Horizon_Status'] == 'TRANS_SUCCESS_WITH_POLICY') {
                                    obj_express_summary['policy']++;
                                } else {
                                    obj_express_summary['policy_pending']++;
                                }
                            }
                            if (sp['status'] == 'Fail') {
                                obj_express_summary['payment_fail']++;
                            }
                            if (sp['status'] == 'Pending') {
                                obj_express_summary['payment_dropoff']++;
                            }
                        }
                        if (req.hasOwnProperty('debug')) {
                            res.send('<pre>' + JSON.stringify(obj_express_summary, undefined, 2) + '</pre>');
                        } else {
                            res.json(obj_express_summary);
                        }
                    } catch (e) {
                        return res.send(e.stack);
                    }
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
};

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