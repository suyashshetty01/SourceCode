var express = require('express');
var config = require('config');
//var bitly_access_token = config.environment.arr_bitly_access_token[Math.floor(Math.random() * config.environment.arr_bitly_access_token.length)];
//var geoip = require('geoip-lite');
var sleep = require('system-sleep');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
const objMongoDB = null;
var path = require('path');
const bodyParser = require('body-parser');
var appRoot = path.dirname(path.dirname(require.main.filename));
var sess;
var Users = [];
var fs = require('fs');
var matchPointReqformidable;
var account_id;
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
    "Insurer_48": "KotakOEM",
    "Insurer_7": "IffcoTokio",
    "Insurer_12": "NewIndia",
    "Insurer_17": "SBIGeneral"
};
var router = express.Router();
function reg_no_format(Registration_Num) {
    try {
        if ([9, 10, 11].indexOf(Registration_Num.length) > -1) {
            var lastfour = Registration_Num.substr(Registration_Num.length - 4);
            var lastdigit = lastfour.match(/\d/g);
            lastdigit = lastdigit.join("");
            if (lastdigit.toString().length < 4) {
                var lastdigitnumber = lastdigit - 0;
                var lastdigitpadzero = pad(lastdigitnumber, 4);
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
        }
    } catch (e) {
        console.error('Exception', 'reg_no_format', e.stack);
    }
    return Registration_Num;
}
function isCurrentFutureDate(dateText) {
    var selectedDate = new Date(dateText);
    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0, 0);
    if (selectedDate < now) {
        return false;
    } else {
        return true;
    }
}
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function noOfDaysDifference(dateText) {
    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    var selectedDate = new Date(dateText);
    var timeDiff = Math.abs(selectedDate.getTime() - now.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
}
function vehicle_ncb_next(Premium_Request) {
    var vehicle_ncb_next_val = '0';
    if (Premium_Request['vehicle_insurance_type'] === 'renew') {
        if (Premium_Request.hasOwnProperty('is_claim_exists')) {
            if (Premium_Request['is_claim_exists'] === 'yes') {
                vehicle_ncb_next_val = '0';
            } else {
                var current_ncb = Premium_Request['vehicle_ncb_current'];
                var ncb_slab = ["0", "20", "25", "35", "45", "50"];
                var current_ncb_index = ncb_slab.indexOf(current_ncb);
                var next_ncb_index = (current_ncb_index == (ncb_slab.length - 1)) ? current_ncb_index : (current_ncb_index + 1);
                console.log(this.constructor.name, 'vehicle_ncb_next', 'Finish');
                vehicle_ncb_next_val = ncb_slab[next_ncb_index];
            }
            var d = new Date(),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            var todayDate = [year, month, day].join('-');
            var days_diff = moment(todayDate).diff(Premium_Request['policy_expiry_date'], 'days');
            //for expired case
            if (days_diff > 90) {
                vehicle_ncb_next_val = '0';
            }
        }
    }
    return vehicle_ncb_next_val;
}
router.post('/login', (req, res) => {
    sess = req.session;
    sess.email = req.body.email;
    res.end('done');
});
router.get('/getSession', (req, res) => {
    sess = req.session;
    if (sess.email) {
        res.send(sess.email);
    }
    res.send(sess.email);
});
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.send(err);
            ;
        }
        res.send('Logout');
    });
});
router.post('/signup', function (req, res) {
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
/* GET users listing. */
function tars_process(objRequestCore) {

    try {
        var arr_month = ['Month', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (objRequestCore['product_id'] == '1' || objRequestCore['product_id'] == '10') {
            if (objRequestCore['first_name'] != '') {
                var arr_name = objRequestCore['first_name'].split(' ');
                objRequestCore['first_name'] = arr_name[0];
                if (arr_name.length > 1) {
                    objRequestCore['last_name'] = arr_name[arr_name.length - 1];
                }
                if (arr_name.length > 2) {
                    objRequestCore['middle_name'] = arr_name[1];
                }
            }
            if (objRequestCore['vehicle_registration_date'] != '') {
                var arr_reg = objRequestCore['vehicle_registration_date'].split('-');
                arr_reg = arr_reg.reverse();
                var index_month = arr_month.indexOf(arr_reg[1]);
                arr_reg[1] = (index_month < 10) ? '0' + index_month.toString() : index_month.toString();
                objRequestCore['vehicle_registration_date'] = arr_reg.join('-');
            }
            if (objRequestCore['vehicle_manf_date'] != '') {
                var arr_reg = objRequestCore['vehicle_manf_date'].split('-');
                arr_reg = arr_reg.reverse();
                var index_month = arr_month.indexOf(arr_reg[1]);
                arr_reg[1] = (index_month < 10) ? '0' + index_month.toString() : index_month.toString();
                objRequestCore['vehicle_manf_date'] = arr_reg.join('-');
            }
            if (objRequestCore['policy_expiry_date'] != '') {
                var arr_reg = objRequestCore['policy_expiry_date'].split('-');
                arr_reg = arr_reg.reverse();
                var index_month = arr_month.indexOf(arr_reg[1]);
                arr_reg[1] = (index_month < 10) ? '0' + index_month.toString() : index_month.toString();
                objRequestCore['policy_expiry_date'] = arr_reg.join('-');
            }
            if (objRequestCore['car_name'] != '') {
                var arr_veh = objRequestCore['car_name'].split('(');
                objRequestCore['vehicle_text'] = arr_veh[0];
                var arr_veh_detail = arr_veh[1].replace(')', '').split(',');
                var vehicle_id = parseInt(arr_veh_detail[1].split(':')[1]);
                objRequestCore['vehicle_id'] = vehicle_id;
            }
            if (objRequestCore['prev_insurer_name'] != '') {
                var arr_insurer = objRequestCore['prev_insurer_name'].split(' (');
                objRequestCore['prev_insurer_text'] = arr_insurer[0];
                var arr_insurer_detail = arr_insurer[1].replace(')', '').split(',');
                var prev_insurer_id = parseInt(arr_insurer_detail[0].split(':')[1]);
                objRequestCore['prev_insurer_id'] = prev_insurer_id;
            }
            if (objRequestCore['reg_name'] != '') {
                var arr_reg = objRequestCore['reg_name'].split(' (');
                objRequestCore['rto_text'] = arr_reg[0];
                var arr_reg_detail = arr_reg[1].replace(')', '').split(',');
                var rto_id = parseInt(arr_reg_detail[1].split(':')[1]);
                var rto_code = arr_reg_detail[0].split(':')[1];
                var reg_number = rto_code.substring(0, 2) + '-' + rto_code.substring(2) + '-AA-1234';
                objRequestCore['rto_id'] = rto_id;
                if (objRequestCore['registration_no'] == '') {
                    objRequestCore['registration_no'] = reg_number;
                }
            }
            if (objRequestCore.hasOwnProperty('vehicle_insurance_subtype') === false) {
                if (objRequestCore['vehicle_insurance_type'] == "renew") {
                    objRequestCore['vehicle_insurance_subtype'] = '1CH_0TP';
                }
                if (objRequestCore['vehicle_insurance_type'] == "new" && (objRequestCore['product_id'] - 0) == 1) {
                    objRequestCore['vehicle_insurance_subtype'] = '1CH_2TP';
                }
                if (objRequestCore['vehicle_insurance_type'] == "new" && (objRequestCore['product_id'] - 0) == 10) {
                    objRequestCore['vehicle_insurance_subtype'] = '1CH_4TP';
                }
            }
        }
        if (objRequestCore['product_id'] == '2') {
            var arr_family = objRequestCore['family_combination'].toString().split('');
            var adult_count = parseInt(arr_family[0]);
            var child_count = (typeof arr_family[2] != 'undefined') ? parseInt(arr_family[2]) : 0;
            objRequestCore['adult_count'] = adult_count;
            objRequestCore['child_count'] = child_count;
            var arr_mone_dob = objRequestCore['member_1_birth_date'].split('-');
            arr_mone_dob = arr_mone_dob.reverse();
            var index_month = arr_month.indexOf(arr_mone_dob[1]);
            arr_mone_dob[1] = (index_month < 10) ? '0' + index_month.toString() : index_month.toString();
            objRequestCore['member_1_birth_date'] = arr_mone_dob.join('-');
            objRequestCore['health_insurance_type'] = 'individual';
            if (adult_count > 1) {
                arr_mone_dob[0] = parseInt(arr_mone_dob[0]) + 3;
                objRequestCore['member_2_birth_date'] = arr_mone_dob.join('-');
                objRequestCore['member_2_gender'] = (objRequestCore['member_1_gender'] == 'M') ? 'F' : 'M';
                objRequestCore['health_insurance_type'] = 'floater';
            }
            if (child_count > 0) {
                objRequestCore['health_insurance_type'] = 'floater';
                var year = moment().format('YYYY');
                year = parseInt(year);
                arr_mone_dob[0] = year - 10;
                objRequestCore['member_3_birth_date'] = arr_mone_dob.join('-');
                objRequestCore['member_3_gender'] = 'M';
                if (child_count > 1) {
                    arr_mone_dob[0] = year - 8;
                    objRequestCore['member_4_birth_date'] = arr_mone_dob.join('-');
                    objRequestCore['member_4_gender'] = 'F';
                }
                if (child_count > 2) {
                    arr_mone_dob[0] = year - 6;
                    objRequestCore['member_5_birth_date'] = arr_mone_dob.join('-');
                    objRequestCore['member_5_gender'] = 'M';
                }
                if (child_count > 3) {
                    arr_mone_dob[0] = year - 4;
                    objRequestCore['member_6_birth_date'] = arr_mone_dob.join('-');
                    objRequestCore['member_6_gender'] = 'F';
                }
            }
            if (objRequestCore['city_id'] !== '') {
                objRequestCore['city_full'] = objRequestCore['city_id'];
                var arr_data = objRequestCore['city_id'].split(' (');
                var arr_data_1 = objRequestCore['city_id'].split(' ');
                objRequestCore['city_name'] = arr_data_1[0];
                var arr_detail = arr_data[1].replace(')', '').split(',');
                var data_id = parseInt(arr_detail[0].split(':')[1]);
                objRequestCore['city_id'] = parseInt(data_id);
                objRequestCore['permanent_pincode'] = 400001;
            }
        }
        console.error('Tars', objRequestCore);
    } catch (ex) {
        console.error('Tars', objRequestCore, ex);
    }
    return objRequestCore;
}
function master_process(req, res, next) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var objRequestCore = req.body;
    if (objRequestCore['user_source'] === 'tars') {
        objRequestCore = tars_process(objRequestCore);
    }
    req.master = {};
    let arr_numberic_id = ['ss_id', 'product_id', 'vehicle_id', 'rto_id', 'prev_insurer_id', 'tp_insurer_id', 'fba_id', 'erp_uid'];
    for (let k in arr_numberic_id) {
        if (objRequestCore.hasOwnProperty(arr_numberic_id[k])) {
            objRequestCore[arr_numberic_id[k]] = objRequestCore[arr_numberic_id[k]] - 0;
        }
    }
    if (objRequestCore.hasOwnProperty('ss_id') === false && objRequestCore.hasOwnProperty('erp_uid') && objRequestCore['erp_uid'] > 0) {
        req.master['agent'] = null;
    }
    if (objRequestCore.hasOwnProperty('ss_id') && objRequestCore['ss_id'] > 0) {
        if (objRequestCore['ss_id'] === 5) {
            var arr_msg = ['SS_ID_NOT_CREATED', 'FBAID : ' + objRequestCore['fba_id'], 'Please contact TechSupport'];
            var sub = '[' + config.environment.name.toString().toUpperCase() + ']ALERT-ACCESS_DENIED-SS_ID_NOT_CREATED-FBAID : ' + objRequestCore['fba_id'];
            email_data = '<html><body><h2><u>Error Details</u><BR>' + arr_msg.join('<BR>') + '</h2><p>Request</p><pre>' + JSON.stringify(objRequestCore, undefined, 2) + '</pre></body></html>';
            var Email = require('../models/email');
            var objModelEmail = new Email();
            var arrTo = ['pramod.parit@policyboss.com', 'vikas.nerkar@policyboss.com', 'techsupport@policyboss.com'];
            objModelEmail.send('noreply@policyboss.com', arrTo.join(','), sub, email_data, '', config.environment.notification_email, '');
            return res.json({'Msg': arr_msg.join('<br>'), 'Details': arr_msg, 'Status': 'VALIDATION'});
        } else {
            req.master['agent'] = null;
        }
    }
    if ([1, 10, 12].indexOf(objRequestCore['product_id']) > -1) {
        if (objRequestCore.hasOwnProperty('vehicle_id') && objRequestCore['vehicle_id'] > 0) {
            req.master['vehicle'] = null;
        }
        if (objRequestCore.hasOwnProperty('rto_id') && objRequestCore['rto_id'] > 0) {
            req.master['rto'] = null;
        }
        if (objRequestCore['vehicle_insurance_type'] === "renew" && objRequestCore['prev_insurer_id'] > 0) {
            req.master['prev_insurer'] = null;
        }
    }
    if ([1, 10].indexOf(objRequestCore['product_id']) > -1) {
        if (objRequestCore['vehicle_insurance_type'] === "renew" && objRequestCore['vehicle_insurance_subtype'] === "1OD_0TP" && objRequestCore['tp_insurer_id'] > 0) {
            req.master['tp_insurer'] = null;
        }
    }

    if (Object.keys(req.master).length > 0)
    {
        //start master process
        if (req.master.hasOwnProperty('vehicle')) {
            var Vehicle = require('../models/vehicle');
            Vehicle.findOne({"Vehicle_ID": objRequestCore['vehicle_id']}, '-_id -_v -Age_1 -Age_2 -Age_3 -Age_4 -Age_5 -Age_6', function (err, dbVehicle) {
                if (err) {
                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'VehicleFind', err);
                } else {
                    if ([1, 7582, 7601, 20414, 7960, 7844].indexOf(objRequestCore['ss_id'] - 0) > -1 || true) {
                        if (dbVehicle) {
                            dbVehicle = dbVehicle._doc;
                            var Client = require('node-rest-client').Client;
                            var client = new Client();
                            client.get(config.environment.weburl + '/quote/vehicles/base_master?base_vehicle_id=' + dbVehicle['Base_Vehicle_ID'], {}, function (data, response) {
                                console.error('Base_Master_Details', dbVehicle['Base_Vehicle_ID'], data);
                                try {
                                    if (data) {
                                        for (let k in const_arr_insurer) {
                                            let is_insurer_mappped = false;
                                            if (dbVehicle.hasOwnProperty(k) && dbVehicle[k]['Is_Active'] === 1 && (dbVehicle[k]['Insurer_Vehicle_ID'] - 0) > 0) {
                                                is_insurer_mappped = true;
                                            }
                                            if (is_insurer_mappped === false) {
                                                if (data.hasOwnProperty(k) && data[k]['Is_Active'] === 1 && (data[k]['Insurer_Vehicle_ID'] - 0) > 0) {
                                                    data[k]['Is_Base_Vehicle_Matched'] = 'yes';
                                                    dbVehicle[k] = data[k];
                                                }
                                            }
                                            console.error('Base_Master_Details', k, is_insurer_mappped, data.hasOwnProperty(k) ? 'DataYes' : 'DataNo', dbVehicle.hasOwnProperty(k) ? 'VehYes' : 'VehNo');
                                        }
                                        console.error('Base_Master_Details', 'Processed', dbVehicle);
                                    }
                                } catch (e) {
                                    console.error('Base_Master_Details', e.stack);
                                }
                                req.master.vehicle = dbVehicle;
                                master_process_handler(req, res, next);
                            });
                        } else {
                            req.master.vehicle = 'NA';
                            master_process_handler(req, res, next);
                        }
                    } else {
                        if (dbVehicle) {
                            req.master.vehicle = {};
                            dbVehicle = dbVehicle._doc;
                            req.master.vehicle = dbVehicle;
                        } else {
                            req.master.vehicle = 'NA';
                        }
                        master_process_handler(req, res, next);
                    }
                }
            });
        }
        if (req.master.hasOwnProperty('rto')) {
            var Rto = require('../models/rto');
            Rto.findOne({"VehicleCity_Id": objRequestCore['rto_id']}, '-_id -_v', function (err, dbRto) {
                if (err) {
                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'RtoFind', err);
                } else {
                    if (dbRto) {
                        req.master.rto = {};
                        dbRto = dbRto._doc;
                        req.master.rto = dbRto;
                        /*var arr_rto_key = ["VehicleCity_Id", "State_Id", "VehicleTariff_Zone", "VehicleCity_RTOCode", "RTO_City", "IsActive", "CreatedOn", "ERP_RegionName", "ERP_RegionID", "State_Name"];
                         for (let k in dbRto) {
                         if (arr_rto_key.indexOf(k) > -1) {
                         let key_name = 'master_rto_' + k.toString().toLowerCase();
                         req.master.rto[key_name] = dbRto[k];
                         master_process_handler(req, res, next);
                         }
                         }*/
                    } else {
                        req.master.rto = 'NA';
                    }
                    master_process_handler(req, res, next);
                }
            });
        }
        if (req.master.hasOwnProperty('prev_insurer')) {
            var Insurer = require('../models/insurer');
            Insurer.findOne({
                "Insurer_ID": objRequestCore['prev_insurer_id']
            }, function (err, dbPBInsurer) {
                if (err) {
                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'PBInsurer_Find', err);
                } else {
                    if (dbPBInsurer) {
                        req.master.prev_insurer = {};
                        dbPBInsurer = dbPBInsurer._doc;
                        req.master.prev_insurer = dbPBInsurer;
                    } else {
                        req.master.prev_insurer = 'NA';
                    }
                    master_process_handler(req, res, next);
                }
            });
        }
        if (req.master.hasOwnProperty('tp_insurer')) {
            var Insurer = require('../models/insurer');
            Insurer.findOne({
                "Insurer_ID": objRequestCore['tp_insurer_id']
            }, function (err, dbPBTPInsurer) {
                if (err) {
                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'PBTPInsurer_Find', err);
                } else {
                    if (dbPBTPInsurer) {
                        req.master.tp_insurer = {};
                        dbPBTPInsurer = dbPBTPInsurer._doc;
                        req.master.tp_insurer = dbPBTPInsurer;
                    } else {
                        req.master.tp_insurer = 'NA';
                    }
                    master_process_handler(req, res, next);
                }
            });
        }
        if (req.master.hasOwnProperty('agent')) {
            if (objRequestCore.hasOwnProperty('ss_id') && objRequestCore['ss_id'] > 0) {
                var Client = require('node-rest-client').Client;
                var client = new Client();
                client.get(config.environment.weburl + '/posps/dsas/view/' + objRequestCore['ss_id'], {}, function (data, response) {
                    if (data['status'] === 'SUCCESS') {
                        req.master.agent = data;
                    } else {
                        req.master.agent = 'NA';
                    }
                    master_process_handler(req, res, next);
                });
            } else {
                if (objRequestCore.hasOwnProperty('erp_uid') && objRequestCore['erp_uid'] > 0) {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    client.get(config.environment.weburl + '/posps/emp/viewbyuid/' + objRequestCore['erp_uid'], {}, function (data, response) {
                        if (data['status'] === 'SUCCESS') {
                            req.master.agent = data;
                            req.body['ss_id'] = data['EMP']['Emp_Id'];
                            req.body['fba_id'] = data['EMP']['FBA_ID'];
                        } else {
                            req.master.agent = 'NA';
                        }
                        master_process_handler(req, res, next);
                    });
                }
            }
        }
    } else {
        return next();
    }
}
function master_process_handler(req, res, next) {
    req.body = JSON.parse(JSON.stringify(req.body));
    let is_complete = false;
    for (let master_key in req.master) {
        if (req.master[master_key] === null) {
            is_complete = false;
            break;
        } else {
            is_complete = true;
        }
    }
    if (is_complete) {
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        var objRequestCore = req.body;
        var sub = '';
        var arr_msg = [];
        if (req.master.hasOwnProperty('agent') && req.master['agent'] === 'NA') {
            if (objRequestCore.hasOwnProperty('erp_uid') && objRequestCore['erp_uid'] > 0) {
                sub = '[' + config.environment.name.toString().toUpperCase() + ']ALERT-REQUEST_VALIDATION-EMPLOYEE_UID_NOT_CREATED';
                arr_msg = ['EMPLOYEE_UID_NOT_CREATED'];
            } else {
                sub = '[' + config.environment.name.toString().toUpperCase() + ']ALERT-REQUEST_VALIDATION-SS_ID_NOT_SYNC';
                arr_msg = ['SS_ID_NOT_SYNC'];
            }
            email_data = '<html><body><h2><u>Error Details</u><BR>' + arr_msg.join('<BR>') + '</h2><p>Request</p><pre>' + JSON.stringify(req.body, undefined, 2) + '</pre></body></html>';
            var Email = require('../models/email');
            var objModelEmail = new Email();
            objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
            return objBase.response_object.json({'Msg': 'Not Valid Request', 'Details': arr_msg, 'Status': 'VALIDATION'});
        }
        if ([1, 10, 12].indexOf(objRequestCore['product_id']) > -1) {
            if (req.master.vehicle === 'NA') {
                var arr_msg = ['Invalid Vehicle ID ' + req.body['vehicle_id']];
                var sub = '[' + config.environment.name.toString().toUpperCase() + ']ALERT-REQUEST_VALIDATION-INVALID_VEHICLE';
                email_data = '<html><body><h2><u>Error Details</u><BR>' + arr_msg.join('<BR>') + '</h2><p>Request</p><pre>' + JSON.stringify(req.body, undefined, 2) + '</pre></body></html>';
                var Email = require('../models/email');
                var objModelEmail = new Email();
                objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                return objBase.response_object.json({'Msg': 'Not Valid Request', 'Details': arr_msg, 'Status': 'VALIDATION'});
            } else if (req.master.rto === 'NA') {
                var arr_msg = ['Invalid Rto ID ' + req.body['rto_id']];
                var sub = '[' + config.environment.name.toString().toUpperCase() + ']ALERT-REQUEST_VALIDATION-INVALID_RTO';
                email_data = '<html><body><h2><u>Error Details</u><BR>' + arr_msg.join('<BR>') + '</h2><p>Request</p><pre>' + JSON.stringify(req.body, undefined, 2) + '</pre></body></html>';
                var Email = require('../models/email');
                var objModelEmail = new Email();
                objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                return objBase.response_object.json({'Msg': 'Not Valid Request', 'Details': arr_msg, 'Status': 'VALIDATION'});
            } else {
                req.body['vehicle_make_name'] = req.master.vehicle['Make_Name'];
                req.body['vehicle_full'] = req.master.vehicle['Make_Name'] + '|' + req.master.vehicle['Model_Name'] + '|' + req.master.vehicle['Variant_Name'] + '|' + req.master.vehicle['Fuel_Name'] + '|' + req.master.vehicle['Cubic_Capacity'];
                req.body['rto_full'] = req.master.rto['VehicleCity_RTOCode'] + '|' + req.master.rto['RTO_City'] + '|' + req.master.rto['State_Name'] + '|' + req.master.rto['VehicleTariff_Zone'];
            }
        }
        return next();
    }
}
function policy_viewed_call_back(objMatchPoint) {
    try {
        console.log(JSON.stringify(objMatchPoint));
        var matchpointObj = [];
        account_id = objMatchPoint.Premium_Request.utm_medium;
        var matchpointObjRes = objMatchPoint.Premium_List.Response;
        for (var m in matchpointObjRes)
        {
            var matchpointObjIns = {
                'ad_ons': {}
            };
            if (matchpointObjRes[m]['Error_Code'] == "") {
                matchpointObjIns['company_name'] = matchpointObjRes[m].Insurer.Insurer_Name;
                matchpointObjIns['idv_range'] = matchpointObjRes[m].LM_Custom_Request.vehicle_expected_idv;
                matchpointObjIns['policy_amount'] = matchpointObjRes[m].Premium_Breakup.final_premium;
                if (matchpointObjRes[m].Addon_List) {
                    if (matchpointObjRes[m].Addon_List['addon_zero_dep_cover'] > 0) {
                        matchpointObjIns['ad_ons']['zero_depreciation'] = matchpointObjRes[m].Addon_List.addon_zero_dep_cover;
                    }
                    if (matchpointObjRes[m].Addon_List['addon_ncb_protection_cover'] > 0) {
                        matchpointObjIns['ad_ons']['ncb_protection'] = matchpointObjRes[m].Addon_List.addon_ncb_protection_cover;
                    }
                    if (matchpointObjRes[m].Addon_List['addon_engine_protector_cover'] > 0) {
                        matchpointObjIns['ad_ons']['engine_protection'] = matchpointObjRes[m].Addon_List.addon_engine_protector_cover;
                    }
                    if (matchpointObjRes[m].Addon_List['addon_invoice_price_cover'] > 0) {
                        matchpointObjIns['ad_ons']['invoice_price'] = matchpointObjRes[m].Addon_List.addon_invoice_price_cover;
                    }
                    if (matchpointObjRes[m].Addon_List['addon_consumable_cover'] > 0) {
                        matchpointObjIns['ad_ons']['consumables'] = matchpointObjRes[m].Addon_List.addon_consumable_cover;
                    }
                }
                matchpointObj.push(matchpointObjIns);
            }
        }
        console.log(JSON.stringify(matchpointObj));
        if (config.environment.name === 'Production') {
            var url_mpgps = "admin.matchpointgps.in";
        } else {
            var url_mpgps = "ut-admin01.do-blr.mpgps.aspade.in";
        }
        var request = require("request");
        var arg_data = {user_id: account_id, //'enFDVEc2UGJXeDJickNib3JZcklwQT09',//
            premium: objMatchPoint.Premium_List.Summary.Premium_Min + ' - ' + objMatchPoint.Premium_List.Summary.Premium_Max,
            cust_ref_no: objMatchPoint.PB_CRN,
            insurers: matchpointObj};
        var options = {method: 'POST',
            url: 'https://' + url_mpgps + '/campaign/policy_viewed_call_back/',
            headers:
                    {'postman-token': '705065af-f5a6-eab1-c5d9-b84a58599dcd',
                        'cache-control': 'no-cache',
                        'content-type': 'application/json',
                        authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiUE9MSUNZIEJPU1MifQ.pc3A1Zhjaicse47bQ2pNyrB_CB7uGDm_iarYGRz_aL0'},
            body: arg_data,
            json: true};
        matchPointReq = arg_data;
        request(options, function (error, response, body) {
            if (error)
                throw new Error(error);
            console.log(body);
            var Match_Point = require('../models/match_point');
            Match_Point.update({'account_id': account_id}, {$set: {'proposal_req': matchPointReq, 'proposal_res': {'status_code': body}}}, {multi: false}, function (err, numAffected) {
            });
        });
    } catch (ex) {
        console.error('policy_viewed_call_back', objMatchPoint, ex);
    }
    //return objRequestCore;
}
function policy_transact_call_back(objMatchPoint) {
    try {
        console.log(JSON.stringify(objMatchPoint));
        var matchpointObj = [];
        account_id = objMatchPoint.Premium_Request.utm_medium;
        var matchpointObjErp = objMatchPoint.Erp_Qt_Request_Core;
        var matchpointObjPro = objMatchPoint.Processed_Request;
        var matchpointObjIns = {
            'user_id': account_id, //'enFDVEc2UGJXeDJickNib3JZcklwQT09',//
            'plan_name': const_arr_insurer['Insurer_' + objMatchPoint.Insurer_Id],
            'service_log_id': matchpointObjPro['___dbmaster_service_log_id___'],
            'car_model': matchpointObjErp['___vehicle_full___'],
            'rto': matchpointObjErp['___rto_full___'],
            'idv': matchpointObjErp['___vehicle_expected_idv___'],
            'cust_ref_no': matchpointObjErp['___crn___'],
            'od_premium': {},
            'td_premium': {},
            'add_ons': {},
            'net_premium': matchpointObjErp['___premium_breakup_net_premium___'],
            'gst_tax': matchpointObjErp['___premium_breakup_service_tax___'],
            'policy_copy': ''
        };
        if (matchpointObjErp) {
            if (matchpointObjErp['___premium_breakup_od_final_premium___'] > 0) {
                matchpointObjIns['od_premium']['total'] = matchpointObjErp['___premium_breakup_od_final_premium___'];
            }
            if (matchpointObjErp['___premium_breakup_od_basic___'] > 0) {
                matchpointObjIns['od_premium']['basic_od'] = matchpointObjErp['___premium_breakup_od_basic___'];
            }
            if (matchpointObjErp['___premium_breakup_tp_final_premium___'] > 0) {
                matchpointObjIns['td_premium']['total'] = matchpointObjErp['___premium_breakup_tp_final_premium___'];
            }
            if (matchpointObjErp['___premium_breakup_tp_basic___'] > 0) {
                matchpointObjIns['td_premium']['basic_td'] = matchpointObjErp['___premium_breakup_tp_basic___'];
            }
            if (matchpointObjErp['___premium_breakup_tp_cover_owner_driver_pa___'] > 0) {
                matchpointObjIns['td_premium']['pa_owner_driver'] = matchpointObjErp['___premium_breakup_tp_cover_owner_driver_pa___'];
            }
            if (matchpointObjErp['___addon_zero_dep_cover___'] === "yes" && matchpointObjErp['___premium_breakup_addon_zero_dep_cover___'] > 0) {
                matchpointObjIns['add_ons']['zero_depreciation'] = matchpointObjErp['___premium_breakup_addon_zero_dep_cover___'];
            }
            if (matchpointObjErp['___addon_ncb_protection_cover___'] === "yes" && matchpointObjErp['___premium_breakup_addon_ncb_protection_cover___'] > 0) {
                matchpointObjIns['add_ons']['ncb_protection'] = matchpointObjErp['___premium_breakup_addon_ncb_protection_cover___'];
            }
            if (matchpointObjErp['___addon_engine_protector_cover___'] === "yes" && matchpointObjErp['___premium_breakup_addon_engine_protector_cover___'] > 0) {
                matchpointObjIns['add_ons']['engine_protection'] = matchpointObjErp['___premium_breakup_addon_engine_protector_cover___'];
            }
            if (matchpointObjErp['___addon_invoice_price_cover___'] === "yes" && matchpointObjErp['___premium_breakup_addon_invoice_price_cover___'] > 0) {
                matchpointObjIns['add_ons']['invoice_price'] = matchpointObjErp['___premium_breakup_addon_invoice_price_cover___'];
            }
            if (matchpointObjErp['___addon_consumable_cover___'] === "yes" && matchpointObjErp['___premium_breakup_addon_consumable_cover___'] > 0) {
                matchpointObjIns['add_ons']['consumables'] = matchpointObjErp['___premium_breakup_addon_consumable_cover___'];
            }
        }
        console.log(JSON.stringify(matchpointObj));
        if (config.environment.name === 'Production') {
            var url_mpgps = "admin.matchpointgps.in";
        } else {
            var url_mpgps = "ut-admin01.do-blr.mpgps.aspade.in";
        }
        var request = require("request");
        var options = {method: 'POST',
            url: 'https://' + url_mpgps + '/campaign/policy_transact_call_back/',
            headers:
                    {'postman-token': 'a86d79a0-d0ca-f0e4-825d-f002c3c38e76',
                        'cache-control': 'no-cache',
                        'content-type': 'application/json',
                        authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiUE9MSUNZIEJPU1MifQ.pc3A1Zhjaicse47bQ2pNyrB_CB7uGDm_iarYGRz_aL0'},
            body: matchpointObjIns,
            json: true};
        matchPointReq = matchpointObjIns;
        request(options, function (error, response, body) {
            if (error)
                throw new Error(error);
            console.log(body);
            var Match_Point = require('../models/match_point');
            Match_Point.update({'account_id': account_id}, {$set: {'payment_req': matchPointReq, 'payment_res': {'status_code': body}, 'is_matchpoint_issued': 1}}, {multi: false}, function (err, numAffected) {
            });
        });
    } catch (ex) {
        console.error('policy_transact_call_back', objMatchPoint, ex);
    }
    //return objRequestCore;
}


router.post('/premium_initiate', master_process, function (req, res, next) {
    try {
        console.log(JSON.stringify(req.body));
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        if ((parseInt(objRequestCore['product_id']) === 1) && (objRequestCore['vehicle_insurance_subtype'] === '3CH_0TP')) {
            res.json({'Msg': 'Invalid Request'});
        } else if ((parseInt(objRequestCore['product_id']) === 10) && (objRequestCore['vehicle_insurance_subtype'] === '5CH_0TP')) {
            res.json({'Msg': 'Invalid Request'});
        } else {
            if (objRequestCore['product_id'] == 3) {

            }
            var today = moment().utcOffset("+05:30");
            var token = moment(today).format("YYMMDD_HHmmss");
            /*if (objRequestCore.hasOwnProperty('ip_address') && objRequestCore['ip_address'] !== '' && objRequestCore.hasOwnProperty('ip_city_state') === false) {
             var geo = geoip.lookup(objRequestCore['ip_address']);
             objRequestCore['ip_city_state'] = geo['city'] + '_' + geo['region'];
             }*/

            if (objRequestCore['app_version'] == "2.0" || objRequestCore['app_version'] == "") {
                objRequestCore['app_version'] = 'PolicyBoss.com';
            }

            //validation
            for (var k in objRequestCore) {
                if (k.indexOf('email') > -1 && objRequestCore.hasOwnProperty(k) && objRequestCore[k] !== null) {
                    objRequestCore[k] = objRequestCore[k].toString().toLowerCase();
                }
                if (k.indexOf('_id') > -1 && k !== 'device_id') {
                    objRequestCore[k] = parseInt(objRequestCore[k]);
                }
                if (k !== 'quick_quote') {
                    if (objRequestCore[k] === 'true' || objRequestCore[k] === true) {
                        objRequestCore[k] = 'yes';
                    }
                    if (objRequestCore[k] === 'false' || objRequestCore[k] === false) {
                        objRequestCore[k] = 'no';
                    }
                }
            }
            if (objRequestCore['product_id'] == 4) {
                if (objRequestCore['crn'] == 0) {
                    objRequestCore['crn'] = objRequestCore['existing_customer_reference_id'] - 0;
                }
            }
            for (let k in objRequestCore) {
                if (k.indexOf('_date') > -1 && objRequestCore[k] && objRequestCore[k].toString().indexOf('-') > -1) {
                    let t_date = moment(objRequestCore[k], 'DD-MM-YYYY', true);
                    if (t_date.isValid()) {
                        let arr_date = objRequestCore[k].split('-');
                        arr_date = arr_date.reverse();
                        objRequestCore[k] = arr_date.join('-');
                    }
                }
            }
            var arr_msg = [];
            //check for valid date
            for (let k in objRequestCore) {
                if (k.indexOf('_date') > -1 && objRequestCore[k] && objRequestCore[k].toString().indexOf('-') > -1) {
                    var t_date = moment(objRequestCore[k], 'YYYY-MM-DD', true);
                    if (t_date.isValid() === false) {
                        arr_msg.push(k + '::' + objRequestCore[k] + ' is invalid date');
                    }
                }
            }
            if ([1, 10, 12].indexOf(objRequestCore['product_id']) > -1) {
                var arr_mandatory = {
                    "product_id": 1,
                    "vehicle_id": 1386,
                    "rto_id": 243,
                    "vehicle_insurance_type": "renew",
                    "vehicle_insurance_subtype": "1CH_0TP",
                    "vehicle_manf_date": "2015-02-01",
                    "vehicle_registration_date": "2015-03-06"
                };
                for (var k in arr_mandatory) {
                    if (!objRequestCore[k]) {
                        arr_msg.push(k + ' is empty');
                    }
                }
                if ((objRequestCore['prev_insurer_id'] - 0) > 0 && objRequestCore['is_policy_exist'] == "") {
                    objRequestCore['is_policy_exist'] = "yes";
                }

                if (objRequestCore['vehicle_insurance_type'] === "renew" && objRequestCore['is_breakin'] === "no" && objRequestCore['policy_expiry_date'] !== "" && isCurrentFutureDate(objRequestCore['policy_expiry_date']) === false)
                {
                    objRequestCore['is_breakin'] = "yes";
                }

                if (objRequestCore['vehicle_insurance_type'] === "renew" && objRequestCore['is_breakin'] === "no")
                {
                    if (objRequestCore['policy_expiry_date'] === "" && objRequestCore['is_policy_exist'] === "yes")
                    {
                        arr_msg.push('policy_expiry_date is empty');
                    } else if (objRequestCore['prev_insurer_id'] === 0)
                    {
                        arr_msg.push('previous insurer is mandatory for Non-Breakin Rollover or Renewal');
                    } else {
                        if (objRequestCore['product_id'] === 1) {
                            if (isCurrentFutureDate(objRequestCore['policy_expiry_date'])) {

                            } else {
                                arr_msg.push('Car policy is expired.policy_expiry_date is already passed');
                            }
                        }
                    }
                }
                if (objRequestCore['vehicle_insurance_type'] === "new")
                {
                    if (objRequestCore.hasOwnProperty('vehicle_insurance_subtype') === false) {
                        arr_msg.push('New policy is not allowed without subtype');
                    }
                }
                if (objRequestCore['vehicle_insurance_type'] === "renew" && objRequestCore['registration_no'] !== "") {
                    if (objRequestCore['registration_no'].indexOf('-') > -1) {
                        var arr_registration_no = objRequestCore['registration_no'].split('-');
                        if (arr_registration_no[0] == '') {
                            arr_msg.push('registration_no is wrong format');
                        }
                    } else if ([9, 10, 11].indexOf(objRequestCore['registration_no'].length) > -1) {
                        objRequestCore['registration_no'] = reg_no_format(objRequestCore['registration_no']);
                    } else {
                        arr_msg.push('registration_no is wrong format');
                    }
                }

                if (objRequestCore['client_key'].toString().indexOf('CLIENT-WF4GWODI') > -1 && objRequestCore['app_version'] != 'PolicyBoss.com') {
                    if ((objRequestCore['ss_id'] - 0) > 0 && (objRequestCore['fba_id'] - 0) > 0) {

                    } else {
                        arr_msg.push('ss_id or fba_id is blank for logged in agent');
                    }
                }
                if (objRequestCore['client_key'].toString().indexOf('CLIENT-GLF2SRA5') > -1 && objRequestCore['app_version'] == 'LERP') {
                    if ((objRequestCore['ss_id'] - 0) > 0) {

                    } else {
                        arr_msg.push('ss_id or fba_id is blank for logged in agent');
                    }
                }
                if (objRequestCore['method_type'] === 'Premium'
                        || objRequestCore['method_type'] === 'Proposal' || objRequestCore['method_type'] === 'Customer') {
                    if (objRequestCore.hasOwnProperty('vehicle_insurance_type') && objRequestCore['vehicle_insurance_type'] === 'renew') {
                        if (objRequestCore['is_breakin'] === 'yes') {
                            //objRequestCore['is_breakin'] = 'yes';
                            if (objRequestCore['is_policy_exist'] === 'yes') {
                                objRequestCore['breakin_days'] = noOfDaysDifference(objRequestCore['policy_expiry_date']);
                            } else {
                                objRequestCore['breakin_days'] = 90;
                            }
                        }
                        if (objRequestCore['is_claim_exists'] === 'yes') {
                            objRequestCore['vehicle_ncb_current'] = '0';
                        }
                        if (objRequestCore['policy_expiry_date'] !== '') {
                            var days_to_expire = moment(objRequestCore['policy_expiry_date']).endOf('day').diff(moment().startOf('day'), 'days');
                            if (days_to_expire > 90) {
                                arr_msg.push('Expiry Date beyond 90 days is not allowed');
                            }
                        }
                    }
                }
                if (objRequestCore['product_id'] == 1 || objRequestCore['product_id'] == 10 || objRequestCore['product_id'] == 12) {
                    if (objRequestCore['method_type'] === 'Premium') {
                        var is_pa_opt = false;
                        if ((objRequestCore['product_id'] === 10 && objRequestCore['vehicle_insurance_subtype'].indexOf('0CH') > -1) || config.environment.name !== 'Production') {
                            is_pa_opt = true;
                        }
                        if ((objRequestCore.hasOwnProperty('ui_source') && objRequestCore['ui_source'] === 'quick_tw_journey') || (objRequestCore.hasOwnProperty('agent_source') && objRequestCore['agent_source'] === 'quick_tw_journey')) {
                            is_pa_opt = true;
                        }
                        if (is_pa_opt === false) {
                            objRequestCore["is_pa_od"] = "yes";
                            objRequestCore["is_having_valid_dl"] = "yes";
                            objRequestCore["is_opted_standalone_cpa"] = "no";
                            objRequestCore["pa_owner_driver_si"] = 1500000;
                        }
                    }
                    if (!objRequestCore.hasOwnProperty('vehicle_insurance_subtype')) {
                        objRequestCore['vehicle_insurance_subtype'] = '1CH_0TP';
                    }
                    var obj_tenure = {
                        '0CH_1TP': 1,
                        '0CH_3TP': 3,
                        '0CH_5TP': 5,
                        '1CH_0TP': 1,
                        '1OD_0TP': 1,
                        '2CH_0TP': 2,
                        '1CH_2TP': 3,
                        '1CH_4TP': 5,
                        '3CH_0TP': 3,
                        '5CH_0TP': 5
                    };
                    var obj_od_tenure = {
                        '0CH_1TP': 0,
                        '0CH_3TP': 0,
                        '0CH_5TP': 0,
                        '1CH_0TP': 1,
                        '1OD_0TP': 1,
                        '2CH_0TP': 2,
                        '1CH_2TP': 1,
                        '1CH_4TP': 1,
                        '3CH_0TP': 3,
                        '5CH_0TP': 5
                    };
                    var obj_tp_tenure = {
                        '0CH_1TP': 1,
                        '0CH_3TP': 3,
                        '0CH_5TP': 5,
                        '1CH_0TP': 1,
                        '1OD_0TP': 0,
                        '2CH_0TP': 2,
                        '1CH_2TP': 3,
                        '1CH_4TP': 5,
                        '3CH_0TP': 3,
                        '5CH_0TP': 5
                    };
                    objRequestCore['policy_tenure'] = obj_tenure[objRequestCore['vehicle_insurance_subtype']];
                    objRequestCore['policy_od_tenure'] = obj_od_tenure[objRequestCore['vehicle_insurance_subtype']];
                    objRequestCore['policy_tp_tenure'] = obj_tp_tenure[objRequestCore['vehicle_insurance_subtype']];
                }
            }
            if (arr_msg.length > 0) {
                arr_msg.unshift('TOKEN-' + token);
                var sub = '[' + config.environment.name.toString().toUpperCase() + '][TOKEN-' + token + ']ERR-VALIDATION';
                email_data = '<html><body><h2>Vehicle : ' + objRequestCore['registration_no'] + '</h2><h2><u>Error Details</u><BR>' + arr_msg.join('<BR>') + '</h2><p>Request</p><pre>' + JSON.stringify(objRequestCore, undefined, 2) + '</pre></body></html>';
                var Email = require('../models/email');
                var objModelEmail = new Email();
                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                return res.json({'Msg': 'Not Valid Request', 'Details': arr_msg, 'Status': 'VALIDATION'});
            }
            if (arr_msg.length === 0) {
                var Client = require('node-rest-client').Client;
                var objClient = new Client();
                objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {
                    if (data) {
                        if (data.hasOwnProperty(objRequestCore.client_key) &&
                                objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                                data[objRequestCore.client_key]['Is_Active'] === true) {
                            var client = data[objRequestCore.client_key];
                            var Base = require(appRoot + '/libs/Base');
                            var objBase = new Base();
                            var clientDetails = client;
                            console.log("Client_Details", clientDetails);
                            objBase.client_id = clientDetails.Client_Id;
                            objBase.request_unique_id = objBase.create_guid('SRN-');
                            objBase['Master_Details'] = req.hasOwnProperty('master') ? req.master : {};
                            objBase.response_object = res;
                            objRequestCore.client_id = clientDetails.Client_Id;
                            objRequestCore.client_name = clientDetails.Client_Name;
                            console.log('Client_Id', objBase.client_id, clientDetails.Client_Id);
                            if ((objRequestCore['product_id'] - 0) == 3) {
                                console.error('Term_Premium_Initiate', objRequestCore);
                            }
                            if ((objRequestCore['product_id'] - 0) == 4) {
                                console.error('Travel_Premium_Initiate', objRequestCore);
                            }
                            var crn = 0;
                            if (objRequestCore.hasOwnProperty('crn') && objRequestCore['crn'] > 0) {
                                crn = objRequestCore['crn'] - 0;
                            }

                            var User_Data = require('../models/user_data');
                            var objUserData = {
                                "Request_Unique_Id": objBase.request_unique_id,
                                "Client_Id": objBase.client_id,
                                "Product_Id": objRequestCore['product_id'],
                                "Premium_Request": objRequestCore,
                                "Premium_Response": "",
                                "Master_Details": req.hasOwnProperty('master') ? req.master : {},
                                "PB_CRN": crn,
                                "ERP_QT": "",
                                "ERP_CS": "",
                                "Last_Status": "SEARCH",
                                "Is_Last": "yes",
                                "Status_History": [{
                                        "Status": "SEARCH",
                                        "StatusOn": new Date()
                                    }]
                            };
                            var objModelUserData = new User_Data(objUserData);
                            let temp_udid;
                            objModelUserData.save(function (err, objDbUserData) {
                                if (err) {
                                    console.error('objDbPospSave', 'user_data_not_save', err);
                                } else {
                                    objBase['udid'] = objDbUserData.User_Data_Id;
                                    temp_udid = objDbUserData.User_Data_Id;
                                    objRequestCore['udid'] = objDbUserData.User_Data_Id;
                                    objRequestCore['ss_id'] = objRequestCore['ss_id'] - 0;
                                    objRequestCore['fba_id'] = objRequestCore['fba_id'] - 0;
                                    var ObjCrn = {
                                        'Product_Id': objDbUserData.Product_id,
                                        'User_Data_Id': objDbUserData.User_Data_Id,
                                        'Crn_Request': objRequestCore,
                                        'PB_Crn_Request': {}
                                    };
                                    var args = {
                                        data: ObjCrn,
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    };
                                    if (objRequestCore['crn'] && objRequestCore['crn'] - 0 > 0) {
                                        updateCRN_LastStatus(objRequestCore['crn'], temp_udid);
                                    }
                                    var Client = require('node-rest-client').Client;
                                    var client = new Client();
                                    client.post(config.pb_config.horizon_api_crn_url, args, function (crndata, response) {
                                        let api_crn = crndata['Crn'] - 0;
                                        let api_crn_unique_id = crndata['Crn_Unique_Id'];
                                        objRequestCore['crn'] = api_crn;
                                        let customer_reference_number = api_crn_unique_id + '_' + api_crn;

                                        objRequestCore['idv_by_crn'] = 'yes';
                                        if (api_crn > 0) {
                                            if (objRequestCore['execution_async'] == 'no') {
                                                var response_version = '1.0';
                                                if (typeof objRequestCore['response_version'] != 'undefined') {
                                                    response_version = objRequestCore['response_version'];
                                                }
                                                objBase.request_process_handler = 'this.premium_list_db(\'' + objBase.request_unique_id + '\',' + objBase.client_id + ',\'' + response_version + '\');';
                                                objBase.request_process(objRequestCore);
                                            }
                                            if (objRequestCore['execution_async'] == 'yes') {
                                                objBase.request_process_handler = 'this.premium_initiate_handler(\'' + api_crn_unique_id + '\',' + api_crn + ',' + objRequestCore['product_id'] + ');';
                                                objBase.request_process(objRequestCore);
                                            }

                                            if (objRequestCore['mobile'] && objRequestCore['mobile'] !== "9999999999" && objRequestCore['crn'] && objRequestCore['crn'] - 0 > 0 && objRequestCore['utm_source'] && objRequestCore['utm_source'] === "LERP_FRESH") {
                                                leadCreate_UserData(objRequestCore);
                                            }
                                        } else {
                                            return res.json({'Msg': 'CRN_NOT_CREATED', 'Details': 'CRN_NOT_CREATED', 'Status': 'VALIDATION'});
                                        }
                                    });
                                    //leadCreate_UserData(objRequestCore);
                                }
                            });
                        } else {
                            res.json({'Msg': 'Not Authorized'});
                        }
                    }
                });
            }
        }
    } catch (ex) {
        console.error('Premium_Initiate', ex, req.body);
    }
});
function leadCreate_UserData(objRequestCore) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    var is_lerp_fresh = false;
    if (objRequestCore['crn'] && objRequestCore['crn'] - 0 > 0 && objRequestCore['utm_source'] && objRequestCore['utm_source'] === "LERP_FRESH") {
        is_lerp_fresh = true;
    }
    if (is_lerp_fresh) {
        objRequestCore['Campaign_Name'] = "webquote";
        var args = {
            data: objRequestCore,
            headers: {
                "Content-Type": "application/json"
            }
        };
        client.post(config.environment.weburl + '/fq/lead_create', args, function (crndata, response) {
        });
    }
}
function updateCRN_LastStatus(CRN, UDID) {
    var User_Data = require('../models/user_data');
    User_Data.updateMany({'PB_CRN': CRN, 'User_Data_Id': {$ne: UDID}}, {$set: {"Is_Last": "no"}}, function (err, numAffected) {
        if (err) {
            //res.json({Msg: 'updateCRN_LastStatus', Details: err});
        } else {
            //res.json({Msg: 'Success_Created', Details: numAffected});
        }
    });
}
;
router.post('/premium_list_db', function (req, res, next) {
    console.log('Start', 'premium_list_db', req.body);
    var objRequestCore = req.body;
    objRequestCore = srn_arn_handler(objRequestCore);
    var is_valid_request = false;
    if (objRequestCore.hasOwnProperty('search_reference_number') && objRequestCore.search_reference_number && objRequestCore.search_reference_number.toString().indexOf('SRN') > -1) {
        is_valid_request = true;
    }
    if (is_valid_request) {
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        var Client = require('node-rest-client').Client;
        var objClient = new Client();
        objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {
            if (data) {
                if (data.hasOwnProperty(objRequestCore.client_key) &&
                        objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                        data[objRequestCore.client_key]['Is_Active'] === true) {
                    var client = data[objRequestCore.client_key];
                    //console.log("Client_Details", clientDetails);
                    var clientDetails = client;
                    objBase.client_id = clientDetails.Client_Id;
                    if (clientDetails.Client_Id == 3) {
                        // console.error('DBGOVER', 'premium_list_db', objRequestCore.search_reference_number);
                    }
                    objBase.request_unique_id = objRequestCore.search_reference_number;
                    objBase.udid = objRequestCore.udid;
                    objBase.response_object = res;
                    var response_version = '2.0';
                    if (typeof objRequestCore['response_version'] != 'undefined') {
                        response_version = objRequestCore['response_version'];
                    }

                    objBase.premium_list_db(objBase.request_unique_id, objBase.client_id, response_version);
                } else {
                    res.json({'Msg': 'Not Authorized'});
                }
            }
            console.log('Finish', 'premium_list_db');
        });
        console.log('Waiting', 'premium_list_db');
    } else {
        var today = moment().utcOffset("+05:30");
        var today_str = moment(today).format("YYYYMMD");
        var objRequest = {
            'dt': today.toLocaleString(),
            'resp': req.body
        };
        fs.appendFile(appRoot + "/tmp/error/validation_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        res.json({'Msg': 'Not Valid Request', 'Request': req.body});
    }
});
router.post('/premium_summary', function (req, res, next) {
    console.log('Start', 'premium_summary');
    var objRequestCore = req.body;
    objRequestCore = srn_arn_handler(objRequestCore);
    var Base = require(appRoot + '/libs/Base');
    var objBase = new Base();
    var Client = require('node-rest-client').Client;
    var objClient = new Client();
    objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {
        if (data.hasOwnProperty(objRequestCore.client_key) &&
                objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                data[objRequestCore.client_key]['Is_Active'] === true) {
            var client = data[objRequestCore.client_key];
            //console.log("Client_Details", clientDetails);
            var clientDetails = client;
            objBase.client_id = clientDetails.Client_Id;
            objBase.request_unique_id = objRequestCore.search_reference_number;
            objBase.udid = objRequestCore.udid;
            objBase.response_object = res;
            objBase.premium_summary();
        } else {
            res.json({'Msg': 'Not Authorized'});
        }
        console.log('Finish', 'premium_summary');
    });
    console.log('Waiting', 'premium_summary');
});
router.post('/api_log_summary', function (req, res, next) {
    console.error('Start', 'api_log_summary', req.body);
    var objRequestCore = req.body;
    objRequestCore = srn_arn_handler(objRequestCore);
    var Base = require(appRoot + '/libs/Base');
    var objBase = new Base();
    var Client = require('node-rest-client').Client;
    var objClient = new Client();
    objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {

        if (data.hasOwnProperty(objRequestCore.client_key) &&
                objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                data[objRequestCore.client_key]['Is_Active'] === true) {
            var client = data[objRequestCore.client_key];
            //console.log("Client_Details", clientDetails);
            var clientDetails = client;
            console.log("Client_Details", clientDetails);
            objBase.client_id = clientDetails.Client_Id;
            objBase.service_log_unique_id = objRequestCore.api_reference_number;
            objBase.udid = objRequestCore.udid;
            objBase.slid = objRequestCore.slid;
            objBase.response_object = res;
            objBase.api_log_summary();
        } else {
            res.json({'Msg': 'Not Authorized'});
        }
        console.log('Finish', 'api_log_summary');
    });
    console.log('Waiting', 'api_log_summary');
});
router.post('/proposal_details', function (req, res, next) {
    console.error('Start', 'proposal_details', req.body);
    var objRequestCore = req.body;
    objRequestCore = srn_arn_handler(objRequestCore);
    var Client = require('node-rest-client').Client;
    var objClient = new Client();
    objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {

        if (data.hasOwnProperty(objRequestCore.client_key) &&
                objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                data[objRequestCore.client_key]['Is_Active'] === true) {

            var client = data[objRequestCore.client_key];
            //console.log("Client_Details", clientDetails);
            var clientDetails = client;
            console.log("Client_Details", clientDetails);
            let Base = require(appRoot + '/libs/Base');
            let objBase = new Base();
            objBase.client_id = clientDetails.Client_Id;
            objBase.service_log_unique_id = objRequestCore.api_reference_number;
            objBase.udid = objRequestCore.udid;
            objBase.slid = objRequestCore.slid;
            objRequestCore.Proposal_Id = objRequestCore.Proposal_Id - 0;
            objBase.response_object = res;
            objBase.proposal_details(objRequestCore.Proposal_Id);
        } else {
            res.json({'Msg': 'Not Authorized'});
        }
        console.log('Finish', 'api_log_summary');
    });
    console.log('Waiting', 'api_log_summary');
});
function NIU_validate_proposal(req, res, next) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var objRequestCore = req.body;
    if ([1, 10, 12].indexOf(objRequestCore['product_id'] - 0) > -1) {
        var User_Data = require(appRoot + '/models/user_data');
        var today = moment().utcOffset("+05:30").startOf('Day');
        var fromDate = moment(today).subtract(6, 'months').format("YYYY-MM-D");
        var toDate = moment(today).format("YYYY-MM-D");
        var arrFrom = fromDate.split('-');
        var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 1, arrFrom[2] - 0);
        var arrTo = toDate.split('-');
        var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 1, arrTo[2] - 0);
        dateTo.setDate(dateTo.getDate() + 1);
        var ud_cond = {
            "Erp_Qt_Request_Core.___engine_number___": objRequestCore['engine_number'],
            "Erp_Qt_Request_Core.___chassis_number___": objRequestCore['chassis_number'],
            "Modified_On": {"$gte": dateFrom, "$lte": dateTo},
            "Last_Status": {$in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}
        };
        User_Data.count(ud_cond, function (err, dbUserDataCount) {
            if (err) {
                return res.send(err);
            } else {
                if (dbUserDataCount > 0) {
                    let err_msg = 'Policy is already issued in last 6 month(s) with Engine and Chassis Number.<br>Kindly check details.';
                    var sub = '[' + (config.environment.name.toString().toUpperCase()) + '] PROPOSAL_DECLINED , CRN : ' + objRequestCore['crn'];
                    email_data = '<html><body><h2>ERR : ' + err_msg + '</h2><p>CustomerName : ' + objRequestCore['first_name'] + ' ' + objRequestCore['last_name'] + '<br>AgentName : ' + objRequestCore['posp_first_name'] + ' ' + objRequestCore['posp_last_name'] + '<br>Engine-Chassis : ' + objRequestCore['engine_number'] + ' - ' + objRequestCore['chassis_number'] + '</p></body></html>';
                    var Email = require('../models/email');
                    var objModelEmail = new Email();
                    objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                    return res.json({'Msg': err_msg, 'Status': 'VALIDATION'});
                } else {
                    return next();
                }
            }
        });
    } else {
        return next();
    }
}
router.post('/proposal_initiate', validateCustomerEmail, function (req, res, next) {
    try {
        console.error('Start', 'proposal_initiate', req.body);
        var today = moment().utcOffset("+05:30");
        var today_str = moment(today).format("YYYYMMD");
        if (req.body.vehicle_insurance_subtype === '1OD_0TP') {
            if (req.body.hasOwnProperty('tp_insurer_id') && (parseInt(req.body.tp_insurer_id) > 0)) {
            } else {
                req.body.tp_insurer_id = req.body.prev_insurer_id;
            }
        }
        var objRequest = {
            'dt': today.toLocaleString(),
            'resp': req.body
        };
        fs.appendFile(appRoot + "/tmp/log/proposal_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        req.body = JSON.parse(JSON.stringify(req.body));

        if ((parseInt(req.body['product_id']) === 1) && (req.body['vehicle_insurance_subtype'] === '3CH_0TP')) {
            res.json({'Msg': 'Invalid Request'});
        } else if ((parseInt(req.body['product_id']) === 10) && (req.body['vehicle_insurance_subtype'] === '5CH_0TP')) {
            res.json({'Msg': 'Invalid Request'});
        } else {
            if (req.body.hasOwnProperty('agent_mobile')) {
                req.body['lm_agent_mobile'] = req.body['agent_mobile'];
            }
            if (req.body.hasOwnProperty('whatsapp_mobile') && req.body.whatsapp_mobile !== "") {
                var is_agent = "no";
                var is_customer = "no";
                req.body.ss_id === "0" || req.body.ss_id === 0 ? is_customer = "yes" : is_agent = "yes";


                var WhatsappDataObj = {
                    Customer_Name: req.body.hasOwnProperty('first_name') ? req.body.first_name + " " + req.body.last_name : req.body.contact_name,
                    Customer_Email: req.body.email,
                    User_Data_Id: parseInt(req.body.udid),
                    Whatsapp_No: parseInt(req.body.whatsapp_mobile),
                    PB_CRN: parseInt(req.body.crn),
                    Mobile_No: parseInt(req.body.mobile),
                    IsCustomer: is_customer,
                    IsAgent: is_agent,
                    Insurer_Id: parseInt(req.body.insurer_id),
                    Product_Id: parseInt(req.body.product_id),
                    ip_address: (parseInt(req.body.product_id) === 2 || parseInt(req.body.product_id) === 18) ? req.body.customer_ip_address : req.body.ip_address,
                    Created_On: new Date(),
                    Modified_On: new Date()
                };
                var customer_whatsapp = require('../models/customer_whatsapp');
                var objcustomer_whatsapp = new customer_whatsapp(WhatsappDataObj);
                objcustomer_whatsapp.save(function (err1) {
                    if (err1) {
                        throw err1;
                    } else {
                    }
                });
            }

            var objRequestCore = req.body;
            objRequestCore = srn_arn_handler(objRequestCore);
            var objRequestCoreOrig = req.body;
            objRequestCoreOrig = srn_arn_handler(objRequestCoreOrig);
            /*for (var k in objRequestCore) {
             if (!isNaN(objRequestCore[k])) {
             objRequestCore[k] = parseInt(objRequestCore[k]);
             }		
             }*/
            for (var k in objRequestCore) {
                if (k.indexOf('_id') > -1 && k !== 'device_id') {
                    objRequestCore[k] = parseInt(objRequestCore[k]);

                }
            }
            if ((objRequestCore['last_name'] === "" && objRequestCore['insurer_id'] === 4) || (objRequestCore['last_name'] === "" && objRequestCore['insurer_id'] === 47)) {
                res.json({'Msg': 'Please Enter Last Name', 'Status': 'VALIDATION'});
            } else {
                var Base = require(appRoot + '/libs/Base');
                var objBase = new Base();
                if (objRequestCore.hasOwnProperty('prev_insurer_id') && (objRequestCore['prev_insurer_id'] - 0) > 0 && objRequestCore['is_policy_exist'] === '') {
                    objRequestCore['is_policy_exist'] = "yes";
                }
                var Client = require('node-rest-client').Client;
                var objClient = new Client();
                objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {
                    if (data) {
                        if (data.hasOwnProperty(objRequestCore.client_key) &&
                                objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                                data[objRequestCore.client_key]['Is_Active'] === true) {
                            var client = data[objRequestCore.client_key];
                            //console.log("Client_Details", clientDetails);
                            var dbClient = client;
                            var Request = require('../models/request');
                            Request.findOne({"Request_Unique_Id": objRequestCore.search_reference_number}, function (errRequest, dbRequest) {
                                if (errRequest) {
                                    var err = {'Msg': 'DB_ERROR', 'Err': errRequest};
                                    console.error(err);
                                    res.json(err);
                                } else {
                                    if (dbRequest) {
                                        var clientDetails = dbClient;
                                        var Prepared_Request = {};
                                        console.log("Client_Details", clientDetails);
                                        if (clientDetails) {
                                            for (var k in clientDetails) {
                                                if (['Client_Id', 'Platform', 'Client_Name'].indexOf(k) > -1) {
                                                    Prepared_Request[k.toString().toLowerCase()] = clientDetails[k];
                                                }
                                            }
                                        }
                                        console.log('OriginalRequest', objRequestCore);
                                        if (dbRequest._doc.Request_Core) {
                                            for (var k in dbRequest._doc.Request_Core) {
                                                Prepared_Request[k] = dbRequest._doc.Request_Core[k];
                                            }
                                        }
                                        for (var k in objRequestCore) {
                                            Prepared_Request[k] = objRequestCore[k];
                                        }
                                        Prepared_Request['final_premium'] = Math.round(Prepared_Request['final_premium'] - 0);
                                        objBase.client_id = clientDetails.Client_Id;
                                        objBase.request_unique_id = Prepared_Request.search_reference_number;
                                        objBase.service_log_unique_id = Prepared_Request.api_reference_number;
                                        objBase['Master_Details'] = req.hasOwnProperty('master') ? req.master : {};
                                        objBase.response_object = res;
                                        console.log('Client_Id', objBase.client_id, clientDetails.Client_Id);
                                        var dbUserData = req.User_Data;
                                        console.log('dbUserData', dbUserData);
                                        if (dbUserData.Premium_Request.hasOwnProperty('utm_source')) {
                                            if (dbUserData.Premium_Request['utm_source'] == "matchpoint") {
                                                policy_viewed_call_back(dbUserData);
                                            }
                                        }
                                        var arr_sale = ['TRANS_SUCCESS_WITH_POLICY', 'TRANS_SUCCESS_WO_POLICY', 'TRANS_PAYPASS'];
                                        var Last_Status = dbUserData.Last_Status;
                                        console.error('Proposal_Initiate', 'ValidateClosure', Last_Status, arr_sale.indexOf(Last_Status));
                                        if (arr_sale.indexOf(Last_Status) > -1) {
                                            console.error('Proposal_Initiate_Check', objRequestCore);
                                            res.json({'Msg': 'Transaction Already Closed'});
                                        } else {
                                            Prepared_Request['insurer_transaction_identifier'] = dbUserData['Insurer_Transaction_Identifier'];
                                            objRequestCoreOrig['insurer_transaction_identifier'] = dbUserData['Insurer_Transaction_Identifier'];
                                            var ObjUser_Data = {
                                                'Insurer_Id': objRequestCoreOrig['insurer_id'] - 0,
                                                'Proposal_Request_Core': objRequestCoreOrig,
                                                'Proposal_Id': objRequestCoreOrig['proposal_id'] - 0
                                            };
                                            var User_Data = require('../models/user_data');
                                            User_Data.update({'User_Data_Id': dbUserData['User_Data_Id']}, {$set: ObjUser_Data}, function (err, numAffected) {
                                                if (err) {
                                                    console.error('Exception', 'Proposal_Initiate_Save_Err', err);
                                                } else {
                                                    if (objRequestCore['execution_async'] == 'no') {
                                                        objBase.request_process(Prepared_Request);
                                                    }
                                                    if (objRequestCore['execution_async'] == 'yes') {
                                                        objBase.request_process_handler = 'this.proposal_summary(\'' + objBase.request_unique_id + '\',' + objBase.client_id + ');';
                                                        objBase.request_process(Prepared_Request);
                                                    }
                                                }
                                            });

                                        }


                                        //objBase.request_process_handler = 'this.proposal_handler();';
                                        //objBase.request_process(Prepared_Request);
                                    } else {
                                        res.json({'Msg': 'Invalid_API_SEARCH_IDENTIFIER', "Request_Unique_Id": objRequestCore.search_reference_number});
                                    }
                                }
                            });
                        } else {
                            res.json({'Msg': 'Not Authorized'});
                        }
                    }
                });
            }
        }
    } catch (Ex) {
        console.error('Exception', 'Proposal_Initiate', Ex);
        res.json(Ex);
    }
});
router.post('/health_renewal_initiate', master_process, function (req, res, next) {
    try {
        console.error('health_renewal_initiate', 'Log', req.body);
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        var Client = require('../models/client');
        Client.findOne({"Secret_Key": objRequestCore.secret_key, "Client_Unique_Id": objRequestCore.client_key}, function (errClient, client) {
            if (errClient) {
                res.json({'Msg': 'DB_ERROR'});
            } else {
                if (client) {
                    var Base = require(appRoot + '/libs/Base');
                    var objBase = new Base();
                    var clientDetails = client;
                    console.log("Client_Details", clientDetails);
                    objBase['Master_Details'] = req.hasOwnProperty('master') ? req.master : {};
                    objBase.client_id = clientDetails.Client_Id;
                    objBase.request_unique_id = objBase.create_guid('SRN-');
                    objBase.response_object = res;
                    objRequestCore.client_id = clientDetails.Client_Id;
                    objRequestCore.client_name = clientDetails.Client_Name;
                    console.log('Client_Id', objBase.client_id, clientDetails.Client_Id);
                    var crn = 0;
                    if (objRequestCore.hasOwnProperty('crn') && objRequestCore['crn'] > 0) {
                        crn = objRequestCore['crn'] - 0;
                    }

                    var User_Data = require('../models/user_data');
                    var objUserData = {
                        "Request_Unique_Id": objBase.request_unique_id,
                        "Client_Id": objBase.client_id,
                        "Product_Id": objRequestCore['product_id'],
                        "Premium_Request": objRequestCore,
                        "Premium_Response": "",
                        "Master_Details": req.hasOwnProperty('master') ? req.master : {},
                        "PB_CRN": crn,
                        "ERP_QT": "",
                        "ERP_CS": "",
                        "Last_Status": "SEARCH",
                        "Status_History": [{
                                "Status": "SEARCH",
                                "StatusOn": new Date()
                            }]
                    };
                    var objModelUserData = new User_Data(objUserData);
                    objModelUserData.save(function (err, objDbUserData) {
                        if (err) {
                            console.error('objDbPospSave', 'user_data_not_save', err);
                        } else {
                            objBase['udid'] = objDbUserData.User_Data_Id;
                            objBase.response_object = res;
                            if (objRequestCore['execution_async'] == 'yes') {
                                objBase.request_process_handler = 'this.health_renewal_initiate_handler();';
                                objBase.request_process(objRequestCore);
                            }
                        }
                    });
                } else {
                    res.json({'Msg': 'Not Authorized'});
                }
            }
        });
    } catch (e) {
        console.error('health_renewal_initiate', 'exception', e);
    }
});
router.post('/proposal_status_initiate', function (req, res, next) {
    try {
        console.error('proposal_status_initiate', 'Log', req.body);
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        var Client = require('node-rest-client').Client;
        var objClient = new Client();
        objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {
            if (data) {
                if (data.hasOwnProperty(objRequestCore.client_key) &&
                        objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                        data[objRequestCore.client_key]['Is_Active'] === true) {
                    var client = data[objRequestCore.client_key];
                    //console.log("Client_Details", clientDetails);
                    var dbClient = client;
                    objBase.response_object = res;
                    objBase.request_process(objRequestCore);
                } else {
                    res.json({'Msg': 'Not Authorized'});
                }
            }
        });
    } catch (e) {
        console.error('Verification_Initiated', 'exception', e);
    }
});
router.post('/verification_initiate', function (req, res, next) {
    try {
        console.error('Verification_Initiated', 'Log', req.body);
        var today = moment().utcOffset("+05:30");
        var today_str = moment(today).format("YYYYMMD");
        var objRequest = {
            'dt': today.toLocaleString(),
            'resp': req.body
        };
        fs.appendFile(appRoot + "/tmp/log/verification_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        objRequestCore = srn_arn_handler(objRequestCore);
        for (var k in objRequestCore) {
            if (k.indexOf('_id') > -1 && k !== 'device_id') {
                objRequestCore[k] = parseInt(objRequestCore[k]);
            }
        }
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        var Client = require('node-rest-client').Client;
        var objClient = new Client();
        objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {
            if (data) {
                if (data.hasOwnProperty(objRequestCore.client_key) &&
                        objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                        data[objRequestCore.client_key]['Is_Active'] === true) {
                    var client = data[objRequestCore.client_key];
                    //console.log("Client_Details", clientDetails);
                    var dbClient = client;
                    var Request = require('../models/request');
                    Request.findOne({"Request_Unique_Id": objRequestCore.search_reference_number}, function (errRequest, dbRequest) {
                        if (errRequest) {
                            res.json({'Msg': 'DB_ERROR'});
                        }
                        if (dbRequest) {
                            var clientDetails = dbClient;
                            console.log("Client_Details", clientDetails);
                            console.log('OriginalRequest', objRequestCore);
                            var Prepared_Request = {};
                            if (clientDetails) {
                                for (var k in clientDetails) {
                                    if (['Client_Id', 'Platform', 'Client_Name'].indexOf(k) > -1) {
                                        Prepared_Request[k.toString().toLowerCase()] = clientDetails[k];
                                    }
                                }
                            }
                            if (dbRequest._doc.Request_Core) {
                                for (var k in dbRequest._doc.Request_Core) {
                                    Prepared_Request[k] = dbRequest._doc.Request_Core[k];
                                }
                            }
                            for (var k in objRequestCore) {
                                Prepared_Request[k] = objRequestCore[k];
                            }

                            var User_Data = require('../models/user_data');
                            var ud_cond = {'Request_Unique_Id': objRequestCore.search_reference_number};
                            if (objRequestCore.udid > 0) {
                                ud_cond = {"User_Data_Id": objRequestCore.udid - 0};
                            }

                            User_Data.findOne(ud_cond, function (err, dbUserData) {
                                if (err) {

                                } else {
                                    var arr_sale = ['TRANS_SUCCESS_WITH_POLICY', 'TRANS_SUCCESS_WO_POLICY', 'TRANS_PAYPASS'];
                                    dbUserData = dbUserData._doc;
                                    if (dbUserData) {
                                        if (dbUserData.Premium_Request.hasOwnProperty('utm_source')) {
                                            if (dbUserData.Premium_Request['utm_source'] == "matchpoint") {
                                                policy_transact_call_back(dbUserData);
                                            }
                                        }
                                        if (dbUserData.hasOwnProperty('Erp_Qt_Request_Core')) {
                                            var final_premium = dbUserData.Erp_Qt_Request_Core['___final_premium___'] - 0;
                                            Prepared_Request.final_premium = final_premium;
                                            if ([1, 10, 12].indexOf(dbUserData.Product_Id) > -1) {
                                                Prepared_Request.od_final_premium = dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_final_premium___'];
                                                Prepared_Request.tp_final_premium = dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_final_premium___'];
                                                Prepared_Request.addon_final_premium = dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___'];
                                            }
                                            console.error('tatachk', final_premium);
                                        }
                                        Prepared_Request.crn = dbUserData.PB_CRN;
                                        var Last_Status = dbUserData.Last_Status;
                                        //console.error('UserDataSave', 'ValidateClosure', Last_Status, arr_sale.indexOf(Last_Status));
                                        if (arr_sale.indexOf(Last_Status) > -1) {
                                            console.error('Verification_Initiated_Check', objRequestCore);
                                            res.json({'Msg': 'Transaction Already Closed'});
                                        } else {
                                            var pg_data = {
                                                "pg_url": Prepared_Request.pg_url,
                                                "pg_get": Prepared_Request.pg_get,
                                                "pg_post": Prepared_Request.pg_post,
                                                "pg_redirect_mode": Prepared_Request.pg_redirect_mode
                                            };
                                            var ObjUser_Data = {
                                                'Payment_Response': pg_data,
                                                'Verification_Request': req.body,
                                                'Last_Status': 'PG_RETURNED'
                                            };
                                            var User_Data = require('../models/user_data');
                                            User_Data.update({'User_Data_Id': dbUserData['User_Data_Id']}, ObjUser_Data, function (err, numAffected) {
                                                console.log('UserDataPolicyDataUpdate', err, numAffected);
                                            });
                                            req.master = dbUserData.hasOwnProperty('Master_Details') ? dbUserData.Master_Details : {};
                                            objBase['Master_Details'] = req.hasOwnProperty('master') ? req.master : {};
                                            objBase['Master_Details']['User_Data'] = dbUserData;
                                            objBase.client_id = clientDetails.Client_Id;
                                            objBase.request_unique_id = Prepared_Request.search_reference_number;
                                            objBase.service_log_unique_id = Prepared_Request.api_reference_number;
                                            objBase.proposal_processed_request = dbUserData.Processed_Request;
                                            objBase.response_object = res;
                                            objBase.const_payment_response.pg_url = Prepared_Request.pg_url;
                                            objBase.const_payment_response.pg_get = Prepared_Request.pg_get;
                                            objBase.const_payment_response.pg_post = Prepared_Request.pg_post;
                                            objBase.const_payment_response.pg_redirect_mode = Prepared_Request.pg_redirect_mode;
                                            if (dbUserData.hasOwnProperty('Payment_Request') && dbUserData['Payment_Request'].hasOwnProperty('pg_data')) {
                                                objBase.const_payment_response.pg_data = dbUserData['Payment_Request']['pg_data'];
                                            }
                                            console.log('Client_Id', objBase.client_id, clientDetails.Client_Id);
                                            //objBase.request_process_handler = 'this.proposal_handler();';
                                            objBase.request_process(Prepared_Request);
                                        }
                                    } else {
                                        res.json({'Msg': 'Transaction_Not_Found'});
                                    }
                                }
                            });
                        } else {
                            res.json({'Msg': 'Invalid_API_SEARCH_IDENTIFIER'});
                        }
                    });
                } else {
                    res.json({'Msg': 'Not Authorized'});
                }
            }
        });
    } catch (e) {
        console.error('Verification_Initiated', 'exception', e);
    }
});
router.post('/pdf_initiate', function (req, res, next) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var objRequestCore = req.body;
    objRequestCore = srn_arn_handler(objRequestCore);
    for (var k in objRequestCore) {
        if (k.indexOf('_id') > -1 && k !== 'device_id') {
            objRequestCore[k] = parseInt(objRequestCore[k]);
        }
    }
    var Base = require(appRoot + '/libs/Base');
    var objBase = new Base();
    var Client = require('node-rest-client').Client;
    var objClient = new Client();
    objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {
        if (data) {
            if (data.hasOwnProperty(objRequestCore.client_key) &&
                    objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                    data[objRequestCore.client_key]['Is_Active'] === true) {
                var client = data[objRequestCore.client_key];
                //console.log("Client_Details", clientDetails);
                var dbClient = client;
                var Request = require('../models/request');
                Request.findOne({"Request_Unique_Id": objRequestCore.search_reference_number}, function (errRequest, dbRequest) {
                    if (errRequest) {
                        res.json({'Msg': 'DB_ERROR'});
                    }
                    if (dbRequest) {
                        try {
                            var User_Data = require('../models/user_data');
                            var ud_cond = {'Request_Unique_Id': objRequestCore.search_reference_number};
                            if (objRequestCore.udid > 0) {
                                ud_cond = {"User_Data_Id": objRequestCore.udid - 0};
                            }
                            User_Data.findOne(ud_cond, function (err, dbUserData) {
                                if (err) {

                                } else {
                                    if (dbUserData) {
                                        dbUserData = dbUserData._doc;
                                        var ObjUser_Data = {
                                            'Pdf_Request': req.body
                                        };
                                        var User_Data = require('../models/user_data');
                                        User_Data.update({'User_Data_Id': dbUserData['User_Data_Id']}, ObjUser_Data, function (err, numAffected) {
                                            if (err) {
                                                console.error('Exception', 'PDF_UserDataPolicyDataUpdate', err, numAffected);
                                            }
                                        });
                                        var clientDetails = dbClient;
                                        var Prepared_Request = {};
                                        if (clientDetails) {
                                            for (var k in clientDetails) {
                                                if (['Client_Id', 'Platform', 'Client_Name'].indexOf(k) > -1) {
                                                    Prepared_Request[k.toString().toLowerCase()] = clientDetails[k];
                                                }
                                            }
                                        }

                                        if (dbRequest._doc.Request_Core) {
                                            for (var k in dbRequest._doc.Request_Core) {
                                                Prepared_Request[k] = dbRequest._doc.Request_Core[k];
                                            }
                                        }
                                        for (var k in objRequestCore) {
                                            Prepared_Request[k] = objRequestCore[k];
                                        }

                                        objBase.client_id = dbUserData.Client_Id;
                                        objBase.request_unique_id = dbUserData['Request_Unique_Id'];
                                        objBase.service_log_unique_id = Prepared_Request.api_reference_number;
                                        objBase.udid = dbUserData['User_Data_Id'];
                                        req.master = dbUserData.hasOwnProperty('Master_Details') ? dbUserData.Master_Details : {};
                                        objBase['Master_Details'] = req.hasOwnProperty('master') ? req.master : {};
                                        objBase.response_object = res;
                                        //objBase.request_process_handler = 'this.proposal_handler();';
                                        objBase.request_process(Prepared_Request);
                                    }
                                }
                            });
                        } catch (e) {
                            res.json({'Msg': e.stack});
                        }

                    } else {
                        res.json({'Msg': 'Invalid_API_SEARCH_IDENTIFIER'});
                    }
                });
            } else {
                res.json({'Msg': 'Not Authorized'});
            }
        }
    });
});
router.post('/coverage_initiate', function (req, res, next) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var objRequestCore = req.body;
    objRequestCore = srn_arn_handler(objRequestCore);
    for (var k in objRequestCore) {
        if (k.indexOf('_id') > -1 && k !== 'device_id') {
            objRequestCore[k] = parseInt(objRequestCore[k]);
        }
    }
    var Base = require(appRoot + '/libs/Base');
    var objBase = new Base();
    var Client = require('node-rest-client').Client;
    var objClient = new Client();
    objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {
        if (data) {
            if (data.hasOwnProperty(objRequestCore.client_key) &&
                    objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                    data[objRequestCore.client_key]['Is_Active'] === true) {
                var client = data[objRequestCore.client_key];
                //console.log("Client_Details", clientDetails);
                var dbClient = client;
                var User_Data = require('../models/user_data');
                var ud_cond = {'Request_Unique_Id': objRequestCore.search_reference_number};
                if (objRequestCore.udid > 0) {
                    ud_cond = {"User_Data_Id": objRequestCore.udid - 0};
                }
                User_Data.findOne(ud_cond, function (err, dbUserData) {
                    if (err) {
                    }

                    if (dbUserData) {
                        dbUserData = dbUserData._doc;
                        objBase.client_id = dbUserData.Client_Id;
                        objBase.request_unique_id = objRequestCore.search_reference_number;
                        objBase.service_log_unique_id = objRequestCore.api_reference_number;
                        objBase.udid = dbUserData['User_Data_Id'];
                        req.master = dbUserData.hasOwnProperty('Master_Details') ? dbUserData.Master_Details : {};
                        objBase['Master_Details'] = req.hasOwnProperty('master') ? req.master : {};
                        objBase.response_object = res;
                        objBase.request_process(objRequestCore);
                    }
                });
            } else {
                res.json({'Msg': 'Not Authorized'});
            }
        }
    });
});
router.post('/customer_initiate', function (req, res, next) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var objRequestCore = req.body;
    objRequestCore = srn_arn_handler(objRequestCore);
    for (var k in objRequestCore) {
        if (k.indexOf('_id') > -1 && k !== 'device_id' && k !== 'insurer_transaction_identifier') {
            objRequestCore[k] = parseInt(objRequestCore[k]);
        }
    }
    var Base = require(appRoot + '/libs/Base');
    var objBase = new Base();
    var Client = require('node-rest-client').Client;
    var objClient = new Client();
    objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {
        if (data) {
            if (data.hasOwnProperty(objRequestCore.client_key) &&
                    objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                    data[objRequestCore.client_key]['Is_Active'] === true) {
                var client = data[objRequestCore.client_key];
                //console.log("Client_Details", clientDetails);
                var dbClient = client;
                var User_Data = require('../models/user_data');
                var ud_cond = {'Request_Unique_Id': objRequestCore.search_reference_number};
                if (objRequestCore.udid > 0) {
                    ud_cond = {"User_Data_Id": objRequestCore.udid - 0};
                }

                User_Data.findOne(ud_cond, function (err, dbUserData) {
                    if (err) {

                    } else {
                        var arr_sale = ['TRANS_SUCCESS_WITH_POLICY', 'TRANS_SUCCESS_WO_POLICY', 'TRANS_PAYPASS'];
                        dbUserData = dbUserData._doc;
                        if (dbUserData) {
                            var clientDetails = dbClient;
                            objBase.client_id = clientDetails.Client_Id;
                            objBase.request_unique_id = objRequestCore.search_reference_number;
                            objBase.udid = objRequestCore.udid;
                            objBase.service_log_unique_id = objRequestCore.api_reference_number;
                            req.master = dbUserData.hasOwnProperty('Master_Details') ? dbUserData.Master_Details : {};
                            objBase['Master_Details'] = req.hasOwnProperty('master') ? req.master : {};
                            objBase.response_object = res;
                            console.log('Client_Id', objBase.client_id, clientDetails.Client_Id);
                            //objBase.request_process_handler = 'this.proposal_handler();';
                            objBase.request_process(objRequestCore);
                        }
                    }
                });
            } else {
                res.json({'Msg': 'Not Authorized'});
            }
        }
    });
});
router.post('/update_status', function (req, res, next) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var objRequestCore = req.body;
    for (var k in objRequestCore) {
        if (k.indexOf('_id') > -1 && k !== 'device_id') {
            objRequestCore[k] = parseInt(objRequestCore[k]);
        }
    }
    var Base = require(appRoot + '/libs/Base');
    var objBase = new Base();
    var Client = require('node-rest-client').Client;
    var objClient = new Client();
    objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {
        if (data) {
            if (data.hasOwnProperty(objRequestCore.client_key) &&
                    objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                    data[objRequestCore.client_key]['Is_Active'] === true) {
                var client = data[objRequestCore.client_key];
                //console.log("Client_Details", clientDetails);
                var dbClient = client;
                var Request = require('../models/request');
                Request.findOne({"Request_Unique_Id": objRequestCore.search_reference_number}, function (errRequest, dbRequest) {
                    if (errRequest) {
                        res.json({'Msg': 'DB_ERROR'});
                    } else {
                        if (dbRequest) {
                            var clientDetails = dbClient;
                            console.log("Client_Details", clientDetails);
                            var Prepared_Request = {};
                            if (clientDetails) {
                                for (var k in clientDetails) {
                                    if (['Client_Id', 'Platform', 'Client_Name'].indexOf(k) > -1) {
                                        Prepared_Request[k.toString().toLowerCase()] = clientDetails[k];
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    });
});
router.post('/save_user_data', function (req, res, next) {
    console.log('Start', 'save_user_data');
    var objRequestCore = req.body;
    objRequestCore = srn_arn_handler(objRequestCore);
    var Base = require(appRoot + '/libs/Base');
    var objBase = new Base();
    var Client = require('node-rest-client').Client;
    var objClient = new Client();
    objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {

        if (data.hasOwnProperty(objRequestCore.client_key) &&
                objRequestCore.secret_key === data[objRequestCore.client_key]['Secret_Key'] &&
                data[objRequestCore.client_key]['Is_Active'] === true) {
            var client = data[objRequestCore.client_key];
            //console.log("Client_Details", clientDetails);
            var clientDetails = client;
            console.log("Client_Details", clientDetails);
            var User_Data = require('../models/user_data');
            var data_type = '';
            data_type = objRequestCore.data_type;
            //delete objRequestCore.data_type;

            var ud_cond = {'Request_Unique_Id': objRequestCore.search_reference_number};
            if (objRequestCore.udid > 0) {
                ud_cond = {"User_Data_Id": objRequestCore.udid - 0};
            }

            User_Data.findOne(ud_cond, function (err, objDbUserData) {
                var arr_sale = ['TRANS_SUCCESS_WITH_POLICY', 'TRANS_SUCCESS_WO_POLICY', 'TRANS_PAYPASS'];
                if (objDbUserData) {
                    var Last_Status = objDbUserData.Last_Status;
                    //console.error('UserDataSave', 'ValidateClosure', Last_Status, arr_sale.indexOf(Last_Status));
                    if (arr_sale.indexOf(Last_Status) > -1) {
                        res.json({'Msg': 'Transaction Already Closed'});
                    } else {
                        var User_Data = require('../models/user_data');
                        var objUserData = {};
                        var Status_History = (objDbUserData.Status_History) ? objDbUserData.Status_History : [];
                        if (objRequestCore.hasOwnProperty('api_reference_number')) {
                            objUserData.Service_Log_Unique_Id = objRequestCore.api_reference_number;
                        }
                        if (objRequestCore.hasOwnProperty('insurer_id')) {
                            objUserData.Insurer_Id = objRequestCore.insurer_id;
                        }
                        if (data_type === 'status') {
                            if (objRequestCore.hasOwnProperty('ss_id') && objRequestCore['ss_id'] > 0) {
                                Last_Status = 'BUY_NOW_AGENT';
                            } else {
                                Last_Status = 'BUY_NOW_CUSTOMER';
                            }
                        }
                        if (['addon', 'addon_quote', 'addon_proposal_agent', 'addon_proposal_customer'].indexOf(data_type) > -1) {
                            var Addon_Request = {};
                            data_type = (data_type == 'addon') ? 'addon_quote' : data_type;
                            for (var k in objRequestCore) {
                                if (k.toString().indexOf('addon') > -1) {
                                    Addon_Request[k] = objRequestCore[k];
                                }
                            }
                            if (Addon_Request.hasOwnProperty('addon_standalone') === false) {
                                Addon_Request = {
                                    'addon_standalone': Addon_Request,
                                    'addon_package': {}
                                };
                            }

                            objUserData.Addon_Request = Addon_Request;
                            //objUserData.Premium_Summary = objDbUserData.Premium_Summary;
                            //objUserData.Premium_Summary.Addon_Request = Addon_Request;
                            Last_Status = data_type.toUpperCase() + '_APPLY';
                        }
                        if (data_type === 'proposal') {
                            if (objRequestCore.hasOwnProperty('ss_id') && objRequestCore['ss_id'] > 0) {
                                Last_Status = 'PROPOSAL_SAVE_AGENT';
                            } else {
                                Last_Status = 'PROPOSAL_SAVE_CUSTOMER';
                            }
                            var whitelist_key = ["aadhar", "birth_date", "registration_no", "first_name", "last_name", "middle_name", "mobile", "email", "gender", "pan", "permanent_address_1", "permanent_address_2", "permanent_address_3", "permanent_pincode", "communication_address_1", "communication_address_2", "communication_address_3", "communication_pincode", "engine_number", "chassis_number", "previous_policy_number", "registration_no_1", "registration_no_2", "registration_no_3", "registration_no_4", "is_financed", "nominee_name", "nominee_birth_date", "nominee_first_name", "nominee_last_name", "lm_agent_name", "lm_agent_id", "contact_name", "insured_name", "description_Of_Cargo", "invoice_number", "invoice_date", "description_Of_Packing", "city", "is_email_optional"];
                            if (objRequestCore.hasOwnProperty('registration_no') === false && objRequestCore.hasOwnProperty('registration_no_1') === false) {
                                objRequestCore['registration_no'] = objRequestCore['registration_no_1'] + '-' + objRequestCore['registration_no_2'] + '-' + objRequestCore['registration_no_3'] + '-' + objRequestCore['registration_no_4'];
                            }


                            var Common_Proposal_Request = {};
                            if (objDbUserData.Proposal_Request) {
                                for (var k in objDbUserData.Proposal_Request) {
                                    Common_Proposal_Request[k] = objDbUserData.Proposal_Request[k];
                                }
                            }
                            for (var k in objRequestCore) {
                                if (whitelist_key.indexOf(k) > -1) {
                                    Common_Proposal_Request[k] = objRequestCore[k];
                                }
                            }

                            var Insurer_Proposal_Request = {};
                            var Proposal_History = [];
                            if (objDbUserData.Proposal_History && objDbUserData.Proposal_History.length > 0) {
                                Proposal_History = objDbUserData.Proposal_History;
                                var sel_index = -1;
                                for (var k in objDbUserData.Proposal_History) {
                                    var ind_req = objDbUserData.Proposal_History[k];
                                    //console.error('UserDataSave', 'loop', objRequestCore['insurer_id'], ind_req['Insurer_Id']);
                                    if (ind_req['Insurer_Id'] == objRequestCore['insurer_id'] && ind_req.hasOwnProperty('Form_Data')) {
                                        Insurer_Proposal_Request = ind_req['Form_Data'];
                                        sel_index = k;
                                        break;
                                    }
                                }
                            }
                            //console.error('UserDataSave', objRequestCore['insurer_id'], sel_index);
                            for (var k in objRequestCore) {
                                if (whitelist_key.indexOf(k) < 0) {
                                    Insurer_Proposal_Request[k] = objRequestCore[k];
                                }
                            }

                            var ind_proposal = {
                                'Service_Log_Unique_Id': objRequestCore.api_reference_number,
                                'Insurer_Id': objRequestCore['insurer_id'],
                                'Form_Data': Insurer_Proposal_Request
                            };
                            if (objDbUserData.Proposal_History && objDbUserData.Proposal_History.length > 0 && sel_index > -1) {
                                Proposal_History[sel_index] = ind_proposal;
                            } else {
                                Proposal_History.push(ind_proposal);
                            }

                            objUserData.Proposal_History = Proposal_History;
                            objUserData.Proposal_Request = Common_Proposal_Request;
                        }
                        if (data_type === 'payment') {
                            objUserData.Payment_Response = objRequestCore;
                        }
                        Status_History.unshift({
                            "Status": Last_Status,
                            "StatusOn": new Date()
                        });
                        objUserData.Last_Status = Last_Status;
                        objUserData.Status_History = Status_History;
                        objUserData.Modified_On = new Date();
                        User_Data.update({'User_Data_Id': objDbUserData.User_Data_Id}, objUserData, function (err, numAffected) {
                            console.log('UserDataUpdated', err, numAffected);
                            res.json({'Msg': 'Data saved', 'Id': objDbUserData.User_Data_Id});
                        });
                    }
                } else {
                    res.json({'Msg': 'Invalid search_reference_number'});
                }
            });
        } else {
            res.json({'Msg': 'Not Authorized'});
        }
        console.log('Finish', 'api_log_summary');
    });
    console.log('Waiting', 'api_log_summary');
});
router.get('/qrcode', function (req, res, next) {
    console.log('Start', 'api_log_summary');
    var url = req.query['url'];
    fs = require('fs');
    var ObjQr = {
        'chl': url,
        'chld': 'L|4',
        'choe': 'UTF-8',
        'chs': '150x150',
        'cht': 'qr'
    };
    var qs = '';
    for (var k in ObjQr) {
        qs += k + '=' + encodeURIComponent(ObjQr[k]) + '&';
    }

    res.send('http://chart.googleapis.com/chart?' + qs);
});
router.get('/pospcall', function (req, res, next) {
    console.log('Start', 'api_log_summary');
    //var url = req.query['url'];// Download the Node helper library from twilio.com/docs/node/install
    // These vars are your accountSid and authToken from twilio.com/user/account
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    var accountSid = 'AC6db2ac1a9f9a45299f88b394cd9f3b33';
    var authToken = "a718ca7e422b2d792b8f39a044252371";
    var client = require('twilio')(accountSid, authToken);
    client.calls.create({
        url: "https://demo.twilio.com/docs/voice.xml",
        to: "+919798192909",
        from: "+918369351516"
    }, function (err, call) {
        process.stdout.write(call.sid);
    });
});
router.post('/lerplogin2', function (req, res, next) {
    var request = require("request");
    var cookieJar = request.jar();
    var credential = {UserName: req.body.username, Password: req.body.password}
    var options = {method: 'POST',
        url: 'http://202.131.96.98:8099/Account/Login',
        /*headers:
         {
         'content-type': 'application/json'},*/
        //body: credential, //{UserName: '107700', Password: 'A@1'},
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
            'Cookie': '',
            'Accept': '/',
            'Connection': 'keep-alive'},
        form: credential,
        //json: true,
        followAllRedirects: true,
        jar: cookieJar
    };
    request(options, function (errorOut, responseOut, bodyOut) {
        var rawcookies = responseOut.headers['set-cookie'];
        console.error(responseOut.headers, rawcookies);
        //http://www.policyboss.com/PolicyEntry/PolicyEntryList
        request.get({
            url: "http://202.131.96.98:8099/PolicyEntry/PolicyEntryList",
            header: responseOut.headers
        }, function (error, response, body) {
            // The full html of the authenticated page



            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            var objLogin = {
                'status': '',
                'login_status': '',
                'name': '',
                'email': '',
                'mobile': ''
            };
            if (body.indexOf('Password is incorrect') > -1) {
                objLogin.login_status = 'fail';
            } else {
                objLogin.login_status = 'success';
            }
            var fs = require('fs');
            var today = new Date();
            var erpLoginRequest = {
                'dt': today.toISOString(),
                'credential': credential,
                'login': objLogin,
                'resp': body
            };
            var log_file_name = today.toISOString().substring(0, 10).toString().replace(/-/g, '');
            fs.appendFile(appRoot + "/tmp/log/erp_" + log_file_name + ".log", JSON.stringify(erpLoginRequest), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
            res.send(body);
        });
    });
});
router.post('/lerplogin', function (req, res, next) {
    var request = require("request");
    var cookieJar = request.jar();
    var credential = {UserName: req.body.username, Password: req.body.password}
    var options = {method: 'POST',
        url: 'http://202.131.96.98:8099/Account/Login',
        headers: {
            'content-type': 'application/json'},
        body: credential,
        json: true,
        followAllRedirects: true
    };
    request(options, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        var objLogin = {
            'status': '',
            'login_status': '',
            'name': '',
            'email': '',
            'mobile': ''
        };
        if (body.indexOf('Password is incorrect') > -1) {
            objLogin.login_status = 'fail';
        } else {
            objLogin.login_status = 'success';
        }
        var fs = require('fs');
        var today = new Date();
        var erpLoginRequest = {
            'dt': today.toISOString(),
            'credential': credential,
            'login': objLogin,
            'resp': body
        };
        var log_file_name = today.toISOString().substring(0, 10).toString().replace(/-/g, '');
        fs.appendFile(appRoot + "/tmp/log/erp_" + log_file_name + ".log", JSON.stringify(erpLoginRequest), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        res.json(objLogin);
    });
});
router.post('/landmarkuid', function (req, res, next) {
    var request = require("request");
    /*
     var options = {method: 'POST',
     url: 'http://landmarktimes.policyboss.com/EIS/Utilities/Search_UID.php',
     headers:
     {'postman-token': '2c5a29d7-6383-312e-6ebe-90a27d3957f3',
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'},
     formData: {Search: 'Chirag', GO: 'GO'}};
     
     request(options, function (error, response, body) {
     if (error)
     throw new Error(error);
     
     console.log(body);
     });
     */

    var request = require('request');
    // Set the headers
    var headers = {
        'Content-Type': 'text/html; charset=UTF-8'
    };
    // Configure the request
    var options = {
        url: 'http://landmarktimes.policyboss.com/EIS/Utilities/Search_UID.php',
        method: 'POST',
        headers: headers,
        form: {'Search': req.body.search, GO: 'GO'}
    };
    // Start the request
    request(options, function (error, response, body) {
        var fs = require('fs');
        if (!error && response.statusCode == 200) {
            // Print out the response body
            var today = new Date();
            var erpLoginRequest = {
                'dt': today.toISOString(),
                'resp': body
            };
            var log_file_name = today.toISOString().substring(0, 10).toString().replace(/-/g, '');
            fs.appendFile(appRoot + "/tmp/log/lmtimes_" + log_file_name + ".log", JSON.stringify(erpLoginRequest), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
            var dataAPi = body.toString().replace(/\r?\n|\r/g, '');
            console.log(body)
        }
        res.send(body);
    });
});
router.get('/pospcallnexmo', function (req, res, next) {
    var pospagent_name = req.query.pospagent_name;
    var pospagent_mobile = req.query.pospagent_mobile;
    if (pospagent_mobile.toString().length === 10) {
        pospagent_mobile = '91' + pospagent_mobile;
    }
    var pospcustomer_name = req.query.pospcustomer_name;
    var pospcustomer_mobile = req.query.pospcustomer_mobile;
    if (pospcustomer_mobile.toString().length === 10) {
        pospcustomer_mobile = '91' + pospcustomer_mobile;
    }
    var query_string = 'pospagent_name=' + encodeURI(pospagent_name) + '&pospagent_mobile=' + pospagent_mobile + '&pospcustomer_name=' + encodeURI(pospcustomer_name) + '&pospcustomer_mobile=' + pospcustomer_mobile;
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    console.log('Start', 'api_log_summary');
    fs = require('fs');
    const Nexmo = require('nexmo');
    var private_key = fs.readFileSync(appRoot + '/resource/request_file/private.key').toString();
    const nexmo = new Nexmo({
        apiKey: '3e5c4e53',
        apiSecret: '07c80fa0428c80d5',
        applicationId: '3268a51f-050b-4813-84c8-56ea85dcc2cf',
        privateKey: private_key
    });
    nexmo.calls.create({
        to: [{
                type: 'phone',
                number: pospcustomer_mobile
            }],
        from: {
            type: 'phone',
            number: pospagent_mobile
        },
        answer_url: ["http://qa-horizon.policyboss.com:3000/quote/nexmo_answer?" + query_string]
    }, (err, response) => {
        if (err) {
            console.error(err);
            res.json({"Msg": "Error"});
        } else {
            console.log(response);
            res.json({"Msg": "Success"});
        }
    });
});
router.get('/nexmo_answer', function (req, res, next) {
    var pospagent_name = req.query.pospagent_name;
    var pospagent_mobile = req.query.pospagent_mobile;
    if (pospagent_mobile.toString().length === 10) {
        pospagent_mobile = '91' + pospagent_mobile;
    }
    var pospcustomer_name = req.query.pospcustomer_name;
    var pospcustomer_mobile = req.query.pospcustomer_mobile;
    if (pospcustomer_mobile.toString().length === 10) {
        pospcustomer_mobile = '91' + pospcustomer_mobile;
    }
    fs = require('fs');
    var str_caller = fs.readFileSync(appRoot + '/resource/request_file/call_sales.json').toString();
    var objReplace = {
        '___pospagent_name___': pospagent_name,
        '___pospagent_mobile___': pospagent_mobile,
        '___pospcustomer_name___': pospcustomer_name,
        '___pospcustomer_mobile___': pospcustomer_mobile
    };
    str_caller = str_caller.replaceJson(objReplace);
    var objSale = JSON.parse(str_caller);
    console.log('nexmo_answer');
    res.json(objSale);
});
router.post('/nexmo_event', function (req, res, next) {
    console.log('nexmo_answer');
    res.send('This is premium request');
});
router.post('/emailsendgrid', function (req, res, next) {
    try {
        console.log('emailsendgrid');
        // using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

        var fromEmail = req.body.from;
        var toEmail = req.body.to;
        var bccEmail = req.body.bcc;
        var ccEmail = (req.body.hasOwnProperty('cc')) ? req.body.cc : '';
        var subject = req.body.sub; //'Sending with SendGrid is Fun';
        var content = req.body.content;
        var crnEmail = '';
        //Payment Request For CRN
        var EmailType = 'other';
        if (subject.indexOf('Payment Request For') > -1) {
            EmailType = 'LINK';
        }
        if (subject.indexOf('Successful online payment transaction. Customer Reference Number') > -1) {
            EmailType = 'SALE';
        }
        if (subject.indexOf('-Proposal-') > -1) {
            EmailType = 'SUBMIT';
        }

        var pb_crn = 0;
        console.error('SGEmail', EmailType, req.body);
        if (req.body.hasOwnProperty('crn')) {
            crnEmail = req.body.crn;
            pb_crn = crnEmail;
        } else {
            var ProductName = '';
            var Product_Id = 0;
            var Client_Id = 0;
            if (content.indexOf('Travel') > -1) {
                ProductName = 'Travel';
                Product_Id = 4;
            }
            if (content.indexOf('Corona') > -1) {
                ProductName = 'Corona Care';
                Product_Id = 17;
            }
            if (content.indexOf('vehicle') > -1) {
                ProductName = 'Car';
                Product_Id = 1;
            }
            if (subject.indexOf('Term') > -1) {
                ProductName = 'Term';
                Product_Id = 3;
                ccEmail = bccEmail;
            }

            if (EmailType === 'SALE' && [1, 2, 10].indexOf(Product_Id) > -1) {
                res.send('Email Not Processed');
            } else {
                if (EmailType == 'SALE') {
                    var arrSub = subject.toString().split(':');
                    pb_crn = parseInt(arrSub[arrSub.length - 1].toString().replace(' ', ''));
                    crnEmail = pb_crn;
                    var Email = require('../models/email');
                    ccEmail = 'payments@policyboss.com';
                    bccEmail = config.environment.notification_email;
                    var objModelEmail = new Email();
                    objModelEmail.send('customercare@policyboss.com', toEmail, subject, content, ccEmail, bccEmail, crnEmail);
                    var User_Data = require('../models/user_data');
                    User_Data.findOne({"PB_CRN": pb_crn, 'Product_Id': 4}, function (err, dbUserData) {
                        if (err) {
                            res.send(err);
                        } else {
                            var User_Data = require('../models/user_data');
                            if (dbUserData) {
                                //dbUserData = dbUserData;
                                var Status_History = dbUserData.Status_History;
                                Status_History.unshift({
                                    "Status": "TRANS_SUCCESS_WO_POLICY",
                                    "StatusOn": new Date()
                                });
                                var objUserData = {
                                    "Last_Status": "TRANS_SUCCESS_WO_POLICY",
                                    "Modified_On": new Date(),
                                    "Status_History": Status_History,
                                    "Transaction_Data": {
                                        "policy_url": '',
                                        "pg_debit_document_url": '',
                                        "pg_debit_statement_url": '',
                                        "policy_number": '',
                                        "policy_id": '',
                                        "transaction_status": 'SUCCESS',
                                        "pg_status": 'SUCCESS',
                                        "transaction_id": '',
                                        "transaction_amount": dbUserData['Erp_Qt_Request_Core']['___final_premium___'],
                                        "pg_reference_number_1": '',
                                        "pg_reference_number_2": '',
                                        "pg_reference_number_3": ''
                                    }
                                };
                                console.error('', 'Log', objUserData);
                                User_Data.update({'User_Data_Id': dbUserData.User_Data_Id}, {$set: objUserData}, function (err, numAffected) {
                                    console.log('UserDataUpdated', err, numAffected);
                                });
                            }
                        }
                    });
                } else if ((EmailType == 'LINK' || EmailType == 'SUBMIT') && (Product_Id == 4 || Product_Id == 3)) {
                    var arrSub = subject.toString().split(':');
                    pb_crn = parseInt(arrSub[arrSub.length - 1].toString().replace(' ', ''));
                    crnEmail = pb_crn;
                    console.error('EMAILCRN', pb_crn);
                    if (subject.toString().toUpperCase().indexOf('FINMART') > -1) {
                        Client_Id = 3;
                    } else {
                        Client_Id = 2;
                    }

                    var Base = require(appRoot + '/libs/Base');
                    var objBase = new Base();
                    if (EmailType == 'LINK' && Product_Id == 4) {
                        bccEmail = config.environment.notification_email;
                        subject = '[' + (config.environment.name.toString() === 'Production' ? (Client_Id == 3 ? 'Finmart' : "PolicyBoss") : config.environment.name.toString().toUpperCase()) + '][' + ProductName + '] Payment Request for CRN : ' + pb_crn;
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        objModelEmail.send(fromEmail, toEmail, subject, content, ccEmail, bccEmail, crnEmail);
                        var User_Data = require('../models/user_data');
                        User_Data.findOne({"PB_CRN": pb_crn}, function (err, dbUserData) {
                            if (err) {
                                res.send(err);
                            } else {
                                var User_Data = require('../models/user_data');
                                if (dbUserData) {
                                    //dbUserData = dbUserData;
                                    var Status_History = dbUserData.Status_History;
                                    Status_History.unshift({
                                        "Status": "PROPOSAL_LINK_SENT",
                                        "StatusOn": new Date()
                                    });
                                    var objUserData = {
                                        "Last_Status": "PROPOSAL_LINK_SENT",
                                        "Modified_On": new Date(),
                                        "Status_History": Status_History
                                    };
                                    console.error('', 'Log', objUserData);
                                    User_Data.update({'PB_CRN': dbUserData.PB_CRN}, {$set: objUserData}, function (err, numAffected) {
                                        console.log('UserDataUpdated', err, numAffected);
                                    });
                                }
                            }
                        });
                    }
                    if (EmailType == 'SUBMIT') {
                        try {
                            toEmail = config.environment.notification_email;
                            ccEmail = '';
                            bccEmail = '';
                            var Email = require('../models/email');
                            var objModelEmail = new Email();
                            objModelEmail.send(fromEmail, toEmail, subject, content, ccEmail, bccEmail, crnEmail);
                            var User_Data = require('../models/user_data');
                            User_Data.findOne({"PB_CRN": pb_crn}, function (err, dbUserData) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    //dbUserData = dbUserData._doc;
                                    try {
                                        var Base = require(appRoot + '/libs/Base');
                                        var objBase = new Base();
                                        content = content.replace('Policy Details', 'Insurance Details');
                                        content = content.replace('ContactName', 'Customer Name');
                                        content = content.replace('Customer Name:', 'Customer Name :');
                                        var email_data = objBase.find_text_btw_key(content, '<fieldset> <legend><b>Insurance Details</b>:</legend>', '</fieldset>', false);
                                        arr_term_data_sms = email_data.split('<br/>');
                                        var obj_err_sms = {};
                                        if (arr_term_data_sms.length > 0) {
                                            var obj_email_data = {};
                                            for (var k in arr_term_data_sms) {
                                                var tmpsmsdata = arr_term_data_sms[k].split(' : ');
                                                obj_email_data[tmpsmsdata[0].toString().toLowerCase().replace(' ', '_')] = tmpsmsdata[1];
                                            }
                                            var SmsLog = require('../models/sms_log');
                                            var objsmsLog = new SmsLog();
                                            var dt = new Date();
                                            var arr_name = [];
                                            arr_name = obj_email_data['customer_name'].toString().split(' ');
                                            obj_err_sms = {
                                                '___business_source___': (Client_Id == 3 ? 'Finmart' : "PolicyBoss"),
                                                '___crn___': crnEmail,
                                                '___product___': ProductName,
                                                '___agent_name___': dbUserData['Premium_Request']['posp_first_name'] + ' ' + dbUserData['Premium_Request']['posp_last_name'],
                                                '___agent_mobile___': dbUserData['Premium_Request']['posp_mobile_no'],
                                                '___customer_name___': obj_email_data['customer_name'],
                                                '___mobile___': 0,
                                                '___plan_name___': obj_email_data['planname'],
                                                '___sum_insured___': obj_email_data['sum_assured'],
                                                '___final_premium___': obj_email_data['premium'],
                                                '___method_type___': 'Proposal',
                                                '___insurerco_name___': obj_email_data['insurername'],
                                                '___application_number___': obj_email_data['application_number'],
                                                '___link_sent_on___': '',
                                                '___proposal_attempt_cnt___': 0,
                                                '___current_dt___': dt.toLocaleString()
                                            };
                                            obj_err_sms['___first_name___'] = arr_name[0];
                                            obj_err_sms['___last_name___'] = arr_name[arr_name.length - 1];
                                            obj_err_sms['___middle_name___'] = '';
                                            if (arr_name.length > 2) {
                                                obj_err_sms['___middle_name___'] = arr_name[1];
                                            }
                                            var agent_mobile = dbUserData['Premium_Request']['posp_mobile_no'];
                                            var proposal_attempt_cnt = 0;
                                            var link_sent_on = '';
                                            var proposal_link_cnt = 0;
                                            for (var k in dbUserData.Status_History) {
                                                if (dbUserData.Status_History[k]['Status'] == 'PROPOSAL_LINK_SENT') {
                                                    proposal_link_cnt++;
                                                    if (link_sent_on == '') {
                                                        link_sent_on = (new Date(dbUserData.Status_History[k]['StatusOn'])).toLocaleString();
                                                    }
                                                }
                                                if (dbUserData.Status_History[k]['Status'] == 'PROPOSAL_SUBMIT') {
                                                    proposal_attempt_cnt++;
                                                }
                                            }
                                            proposal_attempt_cnt++;
                                            obj_err_sms['___link_sent_on___'] = link_sent_on;
                                            obj_err_sms['___proposal_attempt_cnt___'] = proposal_attempt_cnt;
                                            obj_err_sms['___proposal_link_cnt___'] = proposal_link_cnt;
                                            var proposal_ack_data = objsmsLog.proposalSubmitAckMsgTerm(obj_err_sms);
                                            console.error('TermSMS', obj_err_sms, proposal_ack_data);
                                            objsmsLog.send_sms(agent_mobile, proposal_ack_data, 'PROPOSAL_ACK_MSG', dbUserData['PB_CRN']);
                                        }
                                        var User_Data = require('../models/user_data');
                                        var Status_History = dbUserData.Status_History;
                                        var Proposal_Request = dbUserData.Premium_Request;
                                        for (var k in obj_err_sms) {
                                            var k1 = k.replace(/___/g, '');
                                            if (obj_err_sms[k]) {
                                                Proposal_Request[k1] = obj_err_sms[k];
                                            }
                                        }
                                        var Erp_Qt_Request_Core = {};
                                        for (var k in Proposal_Request) {
                                            Erp_Qt_Request_Core['___' + k + '___'] = Proposal_Request[k];
                                        }

                                        Status_History.unshift({
                                            "Status": (subject.indexOf('INFO') > -1) ? "PROPOSAL_SUBMIT" : "PROPOSAL_EXCEPTION",
                                            "StatusOn": new Date()
                                        });
                                        var objUserData = {
                                            "Last_Status": (subject.indexOf('INFO') > -1) ? "PROPOSAL_SUBMIT" : "PROPOSAL_EXCEPTION",
                                            "Modified_On": new Date(),
                                            "Status_History": Status_History,
                                            'Proposal_Request': Proposal_Request
                                        };
                                        if (subject.indexOf('INFO') > -1) {
                                            objUserData.Erp_Qt_Request_Core = Erp_Qt_Request_Core;
                                        }
                                        console.error('PROPOSALHEALTHTERM', 'Log', objUserData);
                                        User_Data.update({"User_Data_Id": dbUserData['User_Data_Id']}, {$set: objUserData}, function (err, numAffected) {
                                            console.log('UserDataUpdated', err, numAffected);
                                        });
                                    } catch (e) {
                                        console.error('HealthSubmit', 'Exception', e);
                                    }

                                }
                            });
                        } catch (e) {
                            console.error('HealthSale', 'Exception', e);
                        }
                    }
                } else {
                    var Email = require('../models/email');
                    var objModelEmail = new Email();
                    objModelEmail.send(fromEmail, toEmail, subject, content, ccEmail, bccEmail, crnEmail);
                }
            }
        }
        //var content = new helper.Content('text/plain', 'and easy to do anywhere, even with Node.js');
        //'This is my first email sent by Sendgrid for PolicyBoss even with Node.js'
    } catch (e) {
        console.error('Exception', 'sendgrid', e);
    }
    res.send('Email Processed');
});
router.get('/erp_data_by_reg', function (req, res, next) {
    console.log('erp_data_by_reg');
    var Erp_Data = require('../models/erp_data');
    var objModelErp_Data = new Erp_Data();
    objModelErp_Data.Response = res;
    objModelErp_Data.get_erp_data_by_reg_number(req.query.reg_no, 1);
//res.send('Email Processed');
});
router.get('/pdf', function (req, res, next) {
    var fs = require('fs');
    console.log('erp_data_by_reg');
    var binary = '';
    //binary = new Buffer(binary).toString('base64');
    //new Buffer("SGVsbG8gV29ybGQ=", 'base64').toString('ascii')
    binary = new Buffer(binary, 'base64');
    console.log(binary);
    var pdf_file_name = 'LV' + '_' + '1111111111111111' + '.pdf';
    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
    var pdf_web_path = config.environment.weburl + "/tmp/pdf/" + pdf_file_name;
    fs.writeFileSync(pdf_sys_loc, binary);
    res.send(pdf_web_path);
});
router.get('/pdfurl', function (req, res, next) {
    var fs = require('fs');
    console.log('erp_data_by_reg');
    var binary = '';
    var http = require('http');
    var fs = require('fs');
    var pdf_file_name = 'LV' + '_' + '1111111111111111' + '.pdf';
    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
    var pdf_web_path = config.environment.weburl + "/tmp/pdf/" + pdf_file_name;
    var file = fs.createWriteStream(pdf_sys_loc);
    var request = http.get("http://qa-horizon.policyboss.com:3000/pdf/LibertyVideoconMotor_TW_201240040117100096600000.pdf", function (response) {
        response.pipe(file);
        res.send(pdf_web_path);
    });
});
router.get('/moment', function (req, res, next) {
    console.log('Welcome to Landmark Motor API');
    //var momenttimezone = require('moment-timezone');
    //moment().utcOffset("+05:30").format();
    var msg = moment().utcOffset("+05:30").format();
    console.log(msg, moment().utcOffset("+05:30").startOf('Day'));
    console.log(new Date());
    console.log(new Date(Date.now()).toISOString());
    console.log(new Date(moment().utcOffset("+05:30").format()));
    // console.log(moment.utcOffset("+05:30").toDate());
    res.send(msg);
});
router.get('/motor', function (req, res, next) {
    var Motor = require('../libs/Motor');
    console.log('Welcome to Landmark Motor API');
    res.send('This is premium request');
});
router.post('/health', function (req, res, next) {
    var Health = require('../libs/Health');
    console.log('Welcome to Landmark Health API');
    res.send('This is premium request');
});
router.post('/travel', function (req, res, next) {
    var Travel = require('../libs/Travel');
    console.log('Welcome to Landmark Travel API');
    res.send('This is premium request');
});
router.post('/pages', function (req, res, next) {
    var Travel = require('../libs/Travel');
    console.log('Welcome to Landmark Travel API');
    res.send('This is premium request');
});
router.post('/erp_pdf1', function (req, res, next) {
    var Base = require(appRoot + '/libs/Base');
    var objBase = new Base();
    objBase.lm_request = req.body;
    objBase.erp_cs_doc_data_prepare(req.body.policy_file_name, req.body.erp_cs, req.body.posp_reporting_agent_uid);
    res.send('erp_pdf');
});
router.post('/erp_pdf', function (req, res, next) {
    var Base = require(appRoot + '/libs/Base');
    var objBase = new Base();
    req.body = JSON.parse(JSON.stringify(req.body));
    objBase.lm_request = req.body;
    var User_Data = require('../models/user_data');
    var ud_cond = {'Request_Unique_Id': objBase.lm_request.search_reference_number};
    if (objBase.lm_request.hasOwnProperty('udid') && objBase.lm_request.udid > 0) {
        ud_cond = {"User_Data_Id": objBase.lm_request.udid - 0};
    }
    ud_cond['ERP_CS_DOC'] = 'PENDING';
    ud_cond['ERP_CS'] = new RegExp('CS', 'i');
    if (objBase.lm_request['search_reference_number']) {
        User_Data.findOne(ud_cond, function (err, dbUserData) {
            if (err) {
                res.json({Msg: 'DB_Err'});
            } else {
                if (dbUserData) {
                    objBase.lm_request['client_id'] = dbUserData.Client_Id;
                    objBase.lm_request['client_name'] = dbUserData.Premium_Request['client_name'];
                    objBase.lm_request['crn'] = dbUserData.PB_CRN;
                    var policy_file_full_path = dbUserData._doc['Transaction_Data']['policy_url'];
                    var arr_policy_file_name = policy_file_full_path.split('/');
                    var policy_file_name = arr_policy_file_name[arr_policy_file_name.length - 1];
                    var erp_cs = dbUserData._doc['ERP_CS'];
                    var posp_reporting_agent_uid = dbUserData._doc['Erp_Qt_Request_Core']['___posp_reporting_agent_uid___'];
                    var obj_erp_data = dbUserData._doc['Erp_Qt_Request_Core'];
                    var transaction_data = dbUserData.Transaction_Data;
                    objBase.lm_request['product_id'] = dbUserData.Product_Id;
                    objBase.lm_request['client_name'] = dbUserData.Premium_Request['client_name'];
                    objBase.lm_request['crn'] = dbUserData.PB_CRN;
                    if (transaction_data && transaction_data.transaction_status === 'SUCCESS') {
                        for (var k in transaction_data) {
                            obj_erp_data['___pg_' + k.toString().toLowerCase() + '___'] = (transaction_data[k]) ? transaction_data[k] : 0;
                        }
                    }
                    var ObjUser_Data = {
                        'ERP_CS_DOC': 'INPROGRESS'
                    };
                    var User_Data = require('../models/user_data');
                    User_Data.update({'User_Data_Id': dbUserData._doc['User_Data_Id'], 'ERP_CS_DOC': 'PENDING'}, {$set: ObjUser_Data}, function (err, numAffected) {
                        if (err) {
                            console.error('Exception', 'erp_cs', 'user_data_cs_doc_update', err, numAffected);
                            res.send(err);
                        } else {
                            if ((numAffected.nModified - 0) > 0) {
                                var policy_data_status = objBase.erp_cs_doc_data_prepare(policy_file_name, erp_cs, posp_reporting_agent_uid, dbUserData._doc['Erp_Qt_Request_Core']);
                                res.json(policy_data_status);
                            } else {
                                return res.send('UD_INPROGRESS_NOT_UPDATED');
                            }
                        }
                    });
                } else {
                    res.json({Msg: 'No_User_Data'});
                }
            }
        });
    } else {
        res.json({Msg: 'No_SRN'});
    }

});
router.get('/mssql', function (req, res, next) {
    var sql = require("mssql");
    sql.close();
    // config for your database   

    // connect to your database
    sql.connect(config.pospsqldb, function (err) {
        if (err) {
            console.error(err);
        }
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        request.query('select * from Posp_Details', function (err, recordset) {
            if (err) {
                console.error(err);
            }
            // send records as a response
            var Posp = require('../models/posp');
            Posp.remove({}, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    var pospFieldSchema = {
                        "Aadhar": "Aadhar",
                        "Account_Type": "Account_Type",
                        "AgentCity": "Agent_City",
                        "Already_posp": "Already_Posp",
                        "Bank_Account_No": "Bank_Account_No",
                        "Bank_Branch": "Bank_Branch",
                        "Bank_Name": "Bank_Name",
                        "Created_On": "Birthdate",
                        "DOB": "Created_On",
                        "Document_Name": "Document_Name",
                        "Document_Type": "Document_Type",
                        "Education": "Education",
                        "Email_ID": "Email_Id",
                        "ERP_ID": "Erp_Id",
                        "Experience": "Experience",
                        "Father_Name": "Father_Name",
                        "FBAID": "Fba_Id",
                        "First_Name": "First_Name",
                        "Gender": "Gender",
                        "IFSC_Code": "Ifsc_Code",
                        "Income": "Income",
                        "IsActive": "Is_Active",
                        "Last_Name": "Last_Name",
                        "Last_Status": "Last_Status",
                        "legal_case": "Legal_case",
                        "MICR_Code": "Micr_Code",
                        "Middle_Name": "Middle_Name",
                        "Mobile_No": "Mobile_No",
                        "Modified_On": "Modified_On",
                        "Name_as_in_Bank": "Name_as_in_Bank",
                        "Nominee_Aadhar": "Nominee_Aadhar",
                        "Nominee_AccountType": "Nominee_Account_Type",
                        "Nominee_BankAccountNumber": "Nominee_Bank_Account_Number",
                        "Nominee_BankBranch": "Nominee_Bank_Branch",
                        "Nominee_BankCity": "Nominee_Bank_City",
                        "Nominee_BankName": "Nominee_Bank_Name",
                        "Nominee_FirstName": "Nominee_First_Name",
                        "Nominee_Gender": "Nominee_Gender",
                        "Nominee_IFSCCode": "Nominee_Ifsc_Code",
                        "Nominee_LastName": "Nominee_Last_Name",
                        "Nominee_MICRCode": "Nominee_Micr_Code",
                        "Nominee_MiddleName": "Nominee_Middle_Name",
                        "Nominee_PAN": "Nominee_Name_as_in_Bank",
                        "Nominee_Relationship": "Nominee_Pan",
                        "NomineeName_as_in_Bank": "Nominee_Relationship",
                        "PAN_No": "Pan_No",
                        "Permanant_Add1": "Permanant_Add1",
                        "Permanant_Add2": "Permanant_Add2",
                        "Permanant_Add3": "Permanant_Add3",
                        "Permanant_City": "Permanant_City",
                        "Permanant_Landmark": "Permanant_Landmark",
                        "Permanant_Pincode": "Permanant_Pincode",
                        "Permanant_State": "Permanant_State",
                        "Posp_Category": "Posp_Category",
                        "POSP_ID": "Posp_Id",
                        "Present_Add1": "Present_Add1",
                        "Present_Add2": "Present_Add2",
                        "Present_Add3": "Present_Add3",
                        "Present_City": "Present_City",
                        "Present_Landmark": "Present_Landmark",
                        "Present_Pincode": "Present_Pincode",
                        "Present_State": "Present_State",
                        "Reporting_Agent_Name": "Reporting_Agent_Name",
                        "Reporting_Agent_UID": "Reporting_Agent_Uid",
                        "ServiceTaxNumber": "Service_Tax_Number",
                        "SM_POSP_ID": "Sm_Posp_Id",
                        "SM_POSP_Name": "Sm_Posp_Name",
                        "Sources": "Sources",
                        "SS_ID": "Ss_Id",
                        "Status_Remark": "Status_Remark",
                        "Telephone_No": "Telephone_No",
                        "Reporting_Email_ID": "Reporting_Email_ID",
                        "Reporting_Mobile_Number": "Reporting_Mobile_Number",
                        "IsFOS": "IsFOS"
                    };
                    var arrPosp = [];
                    for (var k in recordset.recordset) {
                        var objPosp = {};
                        for (var k1 in recordset.recordset[k]) {
                            var mngKey = pospFieldSchema[k1];
                            objPosp[mngKey] = recordset.recordset[k][k1];
                        }
                        arrPosp.push(objPosp);
                    }
                    var syncPospSummary = {
                        'Count_Push': arrPosp.length,
                        'Count_Saved': 0,
                        //'Record' : arrPosp[0],
                        'Status': ''
                    };
                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                        // Get the collection
                        var colPosps = db.collection('posps');
                        colPosps.insertMany(arrPosp, function (err, r) {
                            if (err) {
                                syncPospSummary.Status = err;
                            } else {
                                syncPospSummary.Count_Saved = r.insertedCount;
                                syncPospSummary.Status = 'SUCCESS';
                            }
                            var msg = '<!DOCTYPE html><html><head><title>Proposal Report</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                            msg += '<div class="report"><span  style="font-family:tahoma;font-size:14px;">Error&nbsp;Details</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                            for (var k3 in syncPospSummary) {
                                msg += '<tr><td  width="20%" style="font-size:12px;font-family:tahoma;background-color: #ffcc00">' + k3 + '</td><td  width="78%" style="font-family:tahoma;font-size:14px;">' + syncPospSummary[k3] + '&nbsp;</td></tr>';
                            }
                            msg += '</table></div><br><br>';
                            var Email = require('../models/email');
                            var objModelEmail = new Email();
                            var sub = '[' + config.environment.name.toString().toUpperCase() + '-' + ((syncPospSummary.Count_Saved > 0) ? 'INFO' : 'ERR') + ']';
                            var today = moment().format("D-MMM-YYYY");
                            sub = 'VENDOR_SYNC_MONGO::' + today.toString();
                            objModelEmail.send('customercare@policyboss.com', config.environment.notification_email, sub, msg, '', '');
                            res.json(syncPospSummary);
                            db.close();
                        });
                    });
                }
            });
            //res.send(recordset);
        });
    });
});
router.get('/error_reprocess', function (req, res, next) {
    var Error = require('../models/error');
    Error.find(function (errError, dbErrors) {
        if (errError) {

        } else {
            if (dbErrors) {
                for (var k in dbErrors) {
                    console.log(dbErrors[k]._doc);
                    var objErr = dbErrors[k]._doc;
                    var ServiceLog = require('../models/service_log');
                    for (var j in objErr.Error_Identifier) {
                        var jsonErr = {
                            'Error_Code': 'LM002',
                            'Insurer_Response_Core': new RegExp(objErr.Error_Identifier[j], 'i')
                        };
                        var jsonUp = {
                            $set: {
                                'Error_Code': objErr.Error_Code
                            }
                        };
                        ServiceLog.find(jsonErr, function (errServiceLog, dbServiceLog) {
                            console.log('ServiceLogSearch', errServiceLog, dbServiceLog.length);
                        });
                        ServiceLog.update(jsonErr, jsonUp, {multi: true}, function (err, numAffected) {
                            console.log('ServiceLogUpdate', err, numAffected)
                        });
                    }
                }
            }
        }
    });
});
router.get('/email_read', function (req, res, next) {
    var Client = require('node-poplib-gowhich').Client;
    var policy_number = req.query['pol_num'];
    var quote_number = req.query['quote_num'];
    var customer_email = req.query['customer_email'];
    var insurer_id = req.query['insurer_id'];
    var file_name = req.query['file_name'];
    var fs = require('fs');
    var client = new Client({
        hostname: 'pop.rediffmailpro.com',
        port: 110,
        tls: false,
        mailparser: true,
        username: 'onlinepolicy@policyboss.com',
        password: 'P@l!cyB@ss@1'
    });
    client.connect(function () {
        try {
            console.log('Client_connect');
            client.count(function (err, count) {
                console.log(count);
                var arrRet = [];
                var startRange = (count < 30) ? count : 30;
                var lmt = count - startRange + 1;
                for (var k = lmt; k <= count; k++) {
                    arrRet.push(k);
                }
                console.log(arrRet);
                client.retrieve(arrRet, function (err, messages) {
                    console.log('Client_connect', 'err', err);
                    console.log('Client_connect', 'messages', messages.length);
                    //console.log(messages);
                    var today = new Date();
                    var log_file_name = today.toISOString().substring(0, 10).toString().replace(/-/g, '');
                    var ArrMsg = [];
                    var objInsurerEmail = {
                        '2': 'customer.service@bharti-axagi.co.in', //BhartiAxa
                        '10': 'no-reply@royalsundaram.in', // RoyalSundaram
                        '7': ' noreply@iffcotokio.co.in', // IffcoTokio
                    };
                    var is_found = false;
                    messages.forEach(function (message) {
                        var objMsg = {
                            'sub': message.subject,
                            'date': message.date,
                            'from': message.from[0].address
                        }
                        ArrMsg.push(objMsg);
                        console.log(objMsg, policy_number);
                        if (insurer_id == 10) {
                            if (objMsg.sub.toString().indexOf(quote_number) > -1) {
                                is_found = true;
                            }
                        }
                        if (is_found == true) {
                            if (message.attachments.length > 0) {
                                var fs = require('fs');
                                for (var att in message.attachments) {
                                    if (message.attachments[att].fileName.toString().toLowerCase().indexOf('pdf') > -1) {
                                        var attach_sys_path = appRoot + "/tmp/pdf/" + file_name;
                                        console.log(message.attachments[att].content);
                                        fs.writeFileSync(attach_sys_path, message.attachments[att].content);
                                    }
                                }
                                fs.appendFile(appRoot + "/tmp/log/email_" + log_file_name + ".log", JSON.stringify(message, undefined, 2), function (err) {
                                    if (err) {
                                        //return console.log(err);
                                    }
                                    console.log("The file was saved!");
                                });
                            }
                        }

                    });
                    res.json(ArrMsg);
                    client.quit();
                });
            });
        } catch (e) {
            console.log(e);
        }

    })
});
router.get('/erp_doc', function (req, res, next) {
    var fs = require('fs');
    var Posp = require('../models/posp');
    Posp.find({}, function (err, dbPosps) {
        if (dbPosps) { // for posp agent
            for (var k in dbPosps) {
                var indPosp = dbPosps[k];
                if ((indPosp._doc['Erp_Id'] - 0) > 0) {
                    //console.error('renamed', indPosp._doc['Ss_Id'], indPosp._doc['Erp_Id']);
                    if (fs.existsSync('D:\\Production\\posp.policyboss.com\\Posp_Documents\\' + indPosp._doc['Ss_Id'])) {
                        console.error('exists');
                        fs.rename('D:\\Production\\posp.policyboss.com\\Posp_Documents\\' + indPosp._doc['Ss_Id'], 'D:\\Production\\posp.policyboss.com\\Posp_Documents\\' + indPosp._doc['Erp_Id'], function (err) {
                            if (err) {
                                console.error('not_renamed', indPosp._doc['Ss_Id'], indPosp._doc['Erp_Id']);
                            } else {
                                console.error('renamed', indPosp._doc['Ss_Id'], indPosp._doc['Erp_Id']);
                            }

                        });
                    } else {
                        console.error('not_exists', indPosp._doc['Ss_Id']);
                    }
                }
            }

        }


    });
});
router.post('/send_payment_link_term', authenticateRoute, function (req, res, next) {
    try {
        console.error('Start', this.constructor.name, 'send_payment_link_term', req.body);
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        var dbClient = req.client;
        var pb_crn = objRequestCore['crn'] - 0;
        var User_Data = require('../models/user_data');
        User_Data.findOne({"PB_CRN": pb_crn}).sort({'Modified_On': -1}).exec(function (err, dbUserData) {
            if (err) {
                res.send(err);
            } else {
                var User_Data = require('../models/user_data');
                if (dbUserData) {
                    var obj_insurer = {
                        "HDFC Life Insurance Co. Ltd.": 28,
                        "Tata AIA Life Insurance Company Ltd": 37,
                        "ICICI Prudential Life Insurance Pvt.Ltd.": 39,
                        "Edelweiss Tokio Life Insurance Company Ltd": 43
                    };
                    var Insurer_Id = obj_insurer[objRequestCore['InsurerName']];
                    //dbUserData = dbUserData;
                    objRequestCore['agent_name'] = dbUserData['Premium_Request']['posp_first_name'] + ' ' + dbUserData['Premium_Request']['posp_last_name'];
                    objRequestCore['agent_mobile'] = dbUserData['Premium_Request']['posp_mobile_no'];
                    objRequestCore['email'] = objRequestCore['ContactEmail'];
                    objRequestCore['final_premium'] = objRequestCore['NetPremium'] - 0;
                    objRequestCore['insurer_id'] = Insurer_Id;
                    objRequestCore['payment_link'] = objRequestCore['payLink'];
                    objRequestCore['salutation_text'] = objRequestCore['Sault'];
                    objRequestCore['contact_name'] = objRequestCore['ContactName'];
                    objRequestCore['product_name'] = 'Term Insurance';
                    objRequestCore['reminder'] = 0;
                    var _request = {};
                    for (var key in objRequestCore) {
                        _request['___' + key + '___'] = objRequestCore[key];
                    }

                    var Status_History = dbUserData.Status_History;
                    Status_History.unshift({
                        "Status": "PROPOSAL_LINK_SENT",
                        "StatusOn": new Date()
                    });
                    var objUserData = {
                        "Last_Status": "PROPOSAL_LINK_SENT",
                        "Modified_On": new Date(),
                        "Status_History": Status_History,
                        "Link_Request": objRequestCore,
                        "Proposal_Request": objRequestCore,
                        "Proposal_Request_Core": objRequestCore,
                        "Erp_Qt_Request_Core": _request,
                        "Insurer_Id": Insurer_Id
                    };
                    User_Data.update({'User_Data_Id': dbUserData['User_Data_Id']}, {$set: objUserData}, function (err, numAffected) {
                        if (err) {
                            console.error('send_payment_link_term', 'UserDataUpdated', err, numAffected);
                        }
                    });
                    var emailto = objRequestCore['ContactEmail'].toString().toLowerCase();
                    //var email_agent = objRequestCore['agent_email'].toString();

                    var product_short_name = 'Term';
                    var product_full_name = 'Term Insurance';
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    //console.error('BitlyToken', bitly_access_token);
                    client.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(objRequestCore['payment_link']), function (data, response) {
                        if (data && data.Short_Url !== '') {
                            var short_url = data.Short_Url;
                            try {
                                _request['___short_url___'] = short_url;
                                var SmsLog = require('../models/sms_log');
                                var objsmsLog = new SmsLog();
                                var sms_data = '';
                                if (dbUserData.Premium_Request['channel'] === 'CC') {
                                    sms_data = objsmsLog.proposalLinkMsgCallCenter(_request);
                                } else {
                                    sms_data = objsmsLog.proposalLinkMsg(_request);
                                }
                                var reminder = 0;
                                if (reminder > 0) {

                                } else {
                                    sms_data = sms_data.replace('Reminder : 0', '');
                                }
                                var arr_sms_receiver = [];
                                arr_sms_receiver.push(_request['___phone_no___']); // customer mobile													
                                arr_sms_receiver.push(objRequestCore['agent_mobile']); // agent mobile
                                if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_mobile_number') && dbUserData.Premium_Request['posp_reporting_mobile_number'] > 0) {
                                    arr_sms_receiver.push(dbUserData.Premium_Request['posp_reporting_mobile_number']);
                                }
                                if (dbUserData.Premium_Request.hasOwnProperty('posp_sub_fba_mobile_no') && dbUserData.Premium_Request['posp_sub_fba_mobile_no'] > 0) {
                                    arr_sms_receiver.push(dbUserData.Premium_Request['posp_sub_fba_mobile_no']);
                                }
                                for (var k = 0; k < arr_sms_receiver.length; k++) {
                                    objsmsLog.send_sms(arr_sms_receiver[k], sms_data, 'PROPOSAL_LINK_SENT', dbUserData['PB_CRN']);
                                }
                                console.error("PaymentLinkSms", arr_sms_receiver);
                                //get QR code                                    
                                var ObjQr = {
                                    'chl': short_url,
                                    'chld': 'L|4',
                                    'choe': 'UTF-8',
                                    'chs': '150x150',
                                    'cht': 'qr'
                                };
                                var qs = '';
                                for (var k in ObjQr) {
                                    qs += k + '=' + encodeURIComponent(ObjQr[k]) + '&';
                                }
                                _request['___qr_source___'] = "http://chart.googleapis.com/chart?" + qs;
                                //send mail
                                var email_data = ''
                                if (dbUserData.Premium_Request['posp_sources'] > 0) {
                                    email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Term_POSP.html').toString();
                                } else {
                                    email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Term.html').toString();
                                }
                                console.error('TERMEMAILDATA', _request);
                                var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + "]")) + '[' + product_short_name + '] Payment Request for CRN : ' + pb_crn.toString();
                                email_data = email_data.replaceJson(_request);
                                var Email = require('../models/email');
                                var arr_bcc = [config.environment.notification_email];
                                if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] != '' && dbUserData.Premium_Request['posp_reporting_email_id'] != null) {
                                    if (dbUserData.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                        arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                    }
                                }
                                if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] != null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
                                    arr_bcc.push(dbUserData['Premium_Request']['posp_sub_fba_email']);
                                }
                                if (config.environment.name === 'Production') {
                                    if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                                        if ((dbUserData.Premium_Request['posp_sources'] - 0) == 1) {
                                            arr_bcc.push('transactions.1920@gmail.com'); //finmart-dc  
                                        }
                                    }
                                }
                                var agentemail = '';
                                if (dbUserData.Premium_Request.hasOwnProperty('posp_email_id') && dbUserData.Premium_Request['posp_email_id'] != '' && dbUserData.Premium_Request['posp_email_id'] != null) {
                                    if (dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                        agentemail = dbUserData.Premium_Request['posp_email_id'];
                                    }
                                }
                                var objModelEmail = new Email();
                                objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, agentemail, arr_bcc.join(','), objRequestCore['crn']);
                            } catch (e) {
                                console.error('TERMEMAILERROR', e);
                            }
                        } else {

                            var sub = '[' + config.environment.name.toString().toUpperCase() + '-ERR]SHORTEN_ERROR';
                            email_data = '<html><body>TOKEN - ' + bitly_access_token + '<p>Data</p><pre>' + JSON.stringify(data, undefined, 2) + '</pre></body></html>';
                            var Email = require('../models/email');
                            var objModelEmail = new Email();
                            objModelEmail.send('customercare@policyboss.com', config.environment.notification_email, sub, email_data, '', '', 0);
                        }
                    });
                }
            }
        });
        console.log('Finish', this.constructor.name, 'send_payment_link');
    } catch (e) {
        console.error('Exception', 'send_payment_link', e);
    }
    res.json({
        'Msg': 'Data saved',
        'Status': 'SUCCESS'
    });
});
router.post('/send_payment_link_investment', authenticateRoute, function (req, res, next) {
    try {
        console.log('Start', this.constructor.name, 'send_payment_link_investment');
        console.error('send_payment_link_investment', req.body);
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        var pb_crn = objRequestCore['crn'] - 0;
        var dbClient = req.client;
        var objUserData = {
            "Request_Unique_Id": objBase.create_guid('SRN-'),
            "Product_Id": 5,
            "Client_Id": dbClient._doc.Client_Id,
            "Premium_Request": {
                'email': objRequestCore['ContactEmail']
            },
            "PB_CRN": objRequestCore['crn'],
            "ERP_QT": "",
            "ERP_CS": "",
            "Last_Status": "SEARCH",
            "Status_History": [{
                    "Status": "SEARCH",
                    "StatusOn": new Date()
                }]
        };
        var User_Data = require('../models/user_data');
        var objModelUserData = new User_Data(objUserData);
        objModelUserData.save(function (err, objDbUserData) {
            console.error('EmailSend', 'LinkSaveRequest', objDbUserData);
            if (err) {
                console.error('objDbPospSave', 'LinkSaveRequest', err);
            } else {
                var emailto = objRequestCore['ContactEmail'].toString();
//var email_agent = objRequestCore['agent_email'].toString();

                var product_short_name = 'Investment';
                var product_full_name = 'Investment';
                var _request = {};
                for (var key in objRequestCore) {
                    _request['___' + key + '___'] = objRequestCore[key];
                }

                var Short_Url = require('../models/short_url');
                var objModelShortUrl = new Short_Url({
                    'Long_Url': objRequestCore['payLink'],
                    'Short_Url': ''
                });
                objModelShortUrl.save(function (err, objDBShortURL) {
                    var Short_Url_Id = objDBShortURL.Short_Url_Id;
                    var args = {
                        data: {
                            "longUrl": objRequestCore['payLink']
                        },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    };
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    //console.error('BitlyToken', bitly_access_token);
                    client.get('https://api-ssl.bitly.com/v3/shorten?access_token=' + bitly_access_token + '&longUrl=' + encodeURIComponent(objRequestCore['payLink']), function (data, response) {
                        console.log(data);
                        if (data && data.status_code === 200) {
                            var short_url = data.data.url;
                            Short_Url.update({
                                'Short_Url_Id': Short_Url_Id
                            }, {
                                'Short_Url': short_url
                            }, function (err, objDBShortURL) {
                                try {
                                    _request['___short_url___'] = short_url;
                                    //sms code to be excuted
                                    //                                var SmsLog = require('../models/sms_log');
                                    //                                var objsmsLog = new SmsLog();
                                    //                                var sms_data = objsmsLog.proposalLinkMsg(_request);
                                    //                                objsmsLog.send_sms(_request['___phone_no___'], sms_data, 'PROPOSAL_LINK_SENT'); //mobile_no, sms_log_content, sms_log_type

                                    //get QR code                                    
                                    var ObjQr = {
                                        'chl': short_url,
                                        'chld': 'L|4',
                                        'choe': 'UTF-8',
                                        'chs': '150x150',
                                        'cht': 'qr'
                                    };
                                    var qs = '';
                                    for (var k in ObjQr) {
                                        qs += k + '=' + encodeURIComponent(ObjQr[k]) + '&';
                                    }
                                    _request['___qr_source___'] = "http://chart.googleapis.com/chart?" + qs;
                                    //send mail
                                    var fs = require('fs');
                                    var email_data = ''
                                    if (dbClient._doc.Client_Id == 3) {
                                        email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Investment_POSP.html').toString();
                                    } else {
                                        email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Investment.html').toString();
                                    }
                                    console.error('TERMEMAILDATA', _request);
                                    var sub = '[' + (config.environment.name.toString() === 'Production' ? (dbClient._doc.Client_Id == 2 ? 'PolicyBoss' : "Finmart") : config.environment.name.toString().toUpperCase()) + '][' + product_short_name + '] Payment Request for CRN : ' + pb_crn.toString();
                                    email_data = email_data.replaceJson(_request);
                                    var Email = require('../models/email');
                                    var objModelEmail = new Email();
                                    objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, '', config.environment.notification_email, objRequestCore['crn']);
                                } catch (e) {
                                    console.error('TERMEMAILERROR', e);
                                }
                            });
                        } else {
                            var fs = require('fs');
                            var email_data = ''
                            if (dbClient._doc.Client_Id == 3) {
                                email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Investment_POSP.html').toString();
                            } else {
                                email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Investment.html').toString();
                            }
                            console.error('TERMEMAILDATA', _request);
                            var sub = '[' + (config.environment.name.toString() === 'Production' ? (dbClient._doc.Client_Id == 2 ? 'PolicyBoss' : "Finmart") : config.environment.name.toString().toUpperCase()) + '][' + product_short_name + '] Payment Request for CRN : ' + pb_crn.toString();
                            email_data = email_data.replaceJson(_request);
                            var Email = require('../models/email');
                            var objModelEmail = new Email();
                            objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, '', config.environment.notification_email, objRequestCore['crn']);
                            var sub = '[' + config.environment.name.toString().toUpperCase() + '-ERR]SHORTEN_ERROR';
                            email_data = '<html><body>TOKEN - ' + bitly_access_token + '<p>Data</p><pre>' + JSON.stringify(data, undefined, 2) + '</pre><p>Response</p><pre>' + JSON.stringify(response, undefined, 2) + '</pre></body></html>';
                            var Email = require('../models/email');
                            var objModelEmail = new Email();
                            objModelEmail.send('customercare@policyboss.com', '', sub, email_data, '', config.environment.notification_email);
                        }
                    });
                });
                var objUserData = {
                    'Last_Status': null,
                    'Status_History': null
                };
                var Status_History = (objDbUserData.hasOwnProperty('Status_History')) ? objDbUserData.Status_History : [];
                var Last_Status = 'PROPOSAL_LINK_SENT';
                Status_History.unshift({
                    "Status": Last_Status,
                    "StatusOn": new Date()
                });
                objUserData.Last_Status = Last_Status;
                objUserData.Status_History = Status_History;
                objUserData.Modified_On = new Date();
                User_Data.update({
                    'User_Data_Id': objDbUserData.User_Data_Id
                }, objUserData, function (err, numAffected) {
                    console.log('UserDataUpdated', err, numAffected);
                    res.json({
                        'Msg': 'Data saved',
                        'Id': objDbUserData.User_Data_Id
                    });
                });
            }
        });
        console.log('Finish', this.constructor.name, 'send_payment_link');
    } catch (e) {
        console.error('Exception', 'send_payment_link', e);
    }
});
router.post('/send_payment_link', validateCustomerEmail, function (req, res, next) {
    try {
        console.log('Start', this.constructor.name, 'send_payment_link');
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
//var sub = '';
        objRequestCore = srn_arn_handler(objRequestCore);
        let mode = 'REGULAR';
        var dbUserData = req.User_Data;
        var Link = require('../models/link');
        let reminder = 0;
        let Link_Id = objRequestCore.hasOwnProperty('link_id') ? (objRequestCore['link_id'] - 0) : 0;
        if (Link_Id > 0) {
            try {
                Link.findOne({"Link_Id": Link_Id}, function (err, dbLink) {
                    if (dbLink) {
                        dbLink = dbLink._doc;
                        reminder = dbLink['Reminder'] + 1;
                        objRequestCore['reminder'] = reminder;
                        objRequestCore['link_id'] = dbLink['Link_Id'];
                        let Reminder_History = dbLink.Reminder_History;
                        Reminder_History.unshift({
                            "StatusOn": new Date()
                        });
                        let objLinkData = {
                            'Reminder': reminder,
                            'Reminder_History': Reminder_History,
                            'Modified_On': new Date()
                        };
                        Link.update({'Link_Id': dbLink['Link_Id']}, {$set: objLinkData}, {multi: false}, function (err, numAffected) {
                            send_payment_link_handler(reminder, objRequestCore, dbUserData, res);
                        });
                    }
                });
            } catch (e) {
                res.send(e.stack);
            }
        } else {
            try {
                var today = moment().utcOffset("+05:30").startOf('Day');
                var T_PLUS_15 = moment(today).add(15, 'days').format("YYYY-MM-DD");
                if (dbUserData['Product_Id'] === 2) {
                    dbUserData.Premium_Request['policy_expiry_date'] = T_PLUS_15;
                    objRequestCore['policy_expiry_date'] = T_PLUS_15;
                }
                objRequestCore['link_validity_date'] = T_PLUS_15;
//check if link already sent finish

                let objLink = {
                    'Insurer_Id': objRequestCore['insurer_id'] - 0,
                    'Product_Id': dbUserData['Product_Id'],
                    'PB_CRN': dbUserData['PB_CRN'],
                    'User_Data_Id': dbUserData['User_Data_Id'],
                    'Service_Log_Id': objRequestCore['slid'],
                    'Payment_Request': objRequestCore,
                    'Premium_Request': dbUserData.Premium_Request,
                    'Premium': objRequestCore['final_premium'],
                    'Expiry_Date': dbUserData.Premium_Request.hasOwnProperty('policy_expiry_date') ? dbUserData.Premium_Request['policy_expiry_date'] : null,
                    'Link_Validity_Date': objRequestCore['link_validity_date'],
                    'Reminder': 0,
                    'Mode': mode,
                    'Reminder_History': [],
                    'Status': 'LINK',
                    'Created_On': new Date(),
                    'Modified_On': new Date()
                };
                var objModelLink = new Link(objLink);
                objModelLink.save(function (err, objDbLink) {
                    if (objDbLink) {
                        objRequestCore['link_id'] = objDbLink['Link_Id'];
                        send_payment_link_handler(reminder, objRequestCore, dbUserData, res);
                    } else {
                        console.error('Exception', 'send_payment_link_1', err, objRequestCore);
                        return res.json({'Msg': err, 'Status': 'FAIL'});
                    }
                });
            } catch (ex) {
                console.error('send_payment_link_1', ex, objRequestCore);
                return res.json({'Msg': ex.stack, 'Status': 'FAIL'});
            }
        }
        console.log('Finish', this.constructor.name, 'send_payment_link');
    } catch (e) {
        console.error('Exception', 'send_payment_link', e, objRequestCore);
        return res.json({'Msg': e.stack, 'Status': 'FAIL'});
    }
});
function send_payment_link_handler(reminder, objRequestCore, dbUserData, res) {

    if (objRequestCore.hasOwnProperty('agent_name') === false) {
        objRequestCore['agent_name'] = '';
    }
    var emailto = objRequestCore['customer_email'].toString().toLowerCase();
    var email_agent = '';
    if ((dbUserData.Premium_Request['ss_id'] - 0) > 0) {
        email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
        objRequestCore['agent_mobile'] = dbUserData.Premium_Request['posp_mobile_no'].toString();
        objRequestCore['agent_name'] = dbUserData.Premium_Request['posp_first_name'].toString();
        if (dbUserData.Premium_Request['posp_last_name'] !== null) {
            objRequestCore['agent_name'] += ' ' + dbUserData.Premium_Request['posp_last_name'].toString();
        }
    }
    email_agent = email_agent.toLowerCase();

    var objProduct = {
        '1': 'Car',
        '2': 'Health',
        '4': 'Travel',
        '10': 'TW',
        '12': 'CV',
        '17': 'CoronaCare',
        '18': 'CyberSecurity'
    };
    var objProduct_Full = {
        '1': 'Car',
        '2': 'Health',
        '4': 'Travel',
        '10': 'Two Wheeler',
        '12': 'Commercial-Vehicle',
        '17': 'Corona Care',
        '18': 'Cyber Security'
    };
    var product_short_name = objProduct[dbUserData['Product_Id']];
    var product_full_name = objProduct_Full[dbUserData['Product_Id']];
    objRequestCore['payment_link'] = objRequestCore['payment_link'].toString().replace('undefined', 'https://www.policyboss.com');
    objRequestCore['final_premium'] = Math.round(objRequestCore['final_premium'] - 0);
    var _request = {
        '___link_id___': objRequestCore['link_id'],
        '___contact_name___': objRequestCore['contact_name'],
        '___agent_name___': objRequestCore['agent_name'].toString().toTitleCase(),
        '___crn___': objRequestCore['crn'],
        '___product_name___': product_full_name,
        '___insurer_name___': objRequestCore['insurer_name'],
        '___final_premium___': objRequestCore['final_premium'],
        '___payment_link___': objRequestCore['payment_link'],
        '___agent_mobile___': objRequestCore['agent_mobile'],
        '___phone_no___': objRequestCore['phone_no'],
        '___salutation_text___': objRequestCore['salutation_text'].toString().toTitleCase(),
        '___insurance_type___': objRequestCore['insurance_type'],
        '___reminder___': reminder,
        '___link_validity_date___': moment(objRequestCore['link_validity_date'] + "T00:00:01").format('LL')
    };

    if (dbUserData.Premium_Request['is_claim_exists'] === "no") {
        var ncb_next = vehicle_ncb_next(dbUserData.Premium_Request);
        _request["___claim___"] = ncb_next + "%";
    } else {
        _request["___claim___"] = "Claim Exists";
    }

    if (isNaN(dbUserData.Premium_Request['voluntary_deductible']) === false) {
        if (parseInt(dbUserData.Premium_Request['voluntary_deductible']) === 0) {
            _request["___voluntary_deductible___"] = "No";
        } else {
            _request["___voluntary_deductible___"] = dbUserData.Premium_Request['voluntary_deductible'] + " INR";
        }
    } else {
        _request["___voluntary_deductible___"] = "No";
    }

    _request['___agent_name___'] = _request['___agent_name___'].replace('Null', '');
    _request["___sub___"] = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + ((reminder > 0) ? ('[Reminder:' + reminder + ']') : '') + '[' + product_short_name + '] Payment Request for CRN : ' + dbUserData['PB_CRN'] + ', LinkId : ' + objRequestCore['link_id'];
    if (dbUserData['Product_Id'] === 1 || dbUserData['Product_Id'] === 10 || dbUserData['Product_Id'] === 12) {
        var days_to_expire = 'New';
        _request["___policy_expiry_date___"] = 'NA';
        _request["___registration_no___"] = 'NA';
        _request["___vehicle_text___"] = objRequestCore['vehicle_text'];
        //_request["___registration_no___"] = objRequestCore['registration_no'];
        if (dbUserData.Premium_Request['vehicle_insurance_type'] === 'renew') {
            var policy_expiry_date = moment(dbUserData.Premium_Request['policy_expiry_date'] + "T00:00:01").format('LL');
            _request["___policy_expiry_date___"] = policy_expiry_date;
            days_to_expire = moment(dbUserData.Premium_Request['policy_expiry_date']).endOf('day').diff(moment().startOf('day'), 'days');
            if (isCurrentFutureDate(dbUserData.Premium_Request['policy_expiry_date'])) {

                if (days_to_expire === 1) {
                    days_to_expire = 'Expire Tomorrow';
                }
                if (days_to_expire === 0) {
                    days_to_expire = 'Expire Today';
                }
                if (days_to_expire > 1) {
                    days_to_expire = 'Expire in ' + days_to_expire + ' days';
                }
            } else {
                days_to_expire = 'Expired Earlier';
            }
            //_request["___registration_no___"] = dbUserData.Premium_Request['registration_no'];
            _request["___registration_no___"] = dbUserData.Proposal_Request['registration_no_1'] + '-' + dbUserData.Proposal_Request['registration_no_2'] + '-' + dbUserData.Proposal_Request['registration_no_3'] + '-' + dbUserData.Proposal_Request['registration_no_4'];
            _request["___registration_no___"] = _request["___registration_no___"].toString().toUpperCase();
        }
        _request["___sub___"] = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + ((reminder > 0) ? ('[Reminder:' + reminder + ']') : '') + '[' + product_short_name + '][' + days_to_expire + '] Payment Request CRN : ' + dbUserData['PB_CRN'] + ', LinkId : ' + objRequestCore['link_id'];
    }
    if (dbUserData['Product_Id'] === 2 || dbUserData['Product_Id'] === 18 || dbUserData['Product_Id'] === 4) {
        _request["___plan_name___"] = objRequestCore['plan_name'];
        var ss_id = dbUserData.Premium_Request['ss_id'];
        objRequestCore['payment_link'] = objRequestCore['payment_link'].toString().replace('ss_id=' + ss_id, 'ss_id=0');
    }

    var Client = require('node-rest-client').Client;
    var client = new Client();
    //console.error('BitlyToken', bitly_access_token);
    client.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(objRequestCore['payment_link']), function (data, response) {
        try {
            if (data && data.Short_Url !== '') {
                var short_url = data.Short_Url;
                try {
                    _request['___short_url___'] = short_url;
                    //saving to db 
                    //sms
                    var SmsLog = require('../models/sms_log');
                    var objsmsLog = new SmsLog();
                    var sms_data = '';
                    if (dbUserData.Premium_Request['channel'] === 'CC') {
                        sms_data = objsmsLog.proposalLinkMsgCallCenter(_request);
                    } else {
                        sms_data = objsmsLog.proposalLinkMsg(_request);
                    }
                    if (reminder > 0) {

                    } else {
                        sms_data = sms_data.replace('Reminder : 0', '');
                    }
                    var arr_sms_receiver = [];
                    arr_sms_receiver.push(_request['___phone_no___']); // customer mobile													
                    arr_sms_receiver.push(objRequestCore['agent_mobile']); // agent mobile
                    if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_mobile_number') && dbUserData.Premium_Request['posp_reporting_mobile_number'] > 0) {
                        arr_sms_receiver.push(dbUserData.Premium_Request['posp_reporting_mobile_number']);
                    }
                    if (dbUserData.Premium_Request.hasOwnProperty('posp_sub_fba_mobile_no') && dbUserData.Premium_Request['posp_sub_fba_mobile_no'] > 0) {
                        arr_sms_receiver.push(dbUserData.Premium_Request['posp_sub_fba_mobile_no']);
                    }
                    for (var k = 0; k < arr_sms_receiver.length; k++) {
                        objsmsLog.send_sms(arr_sms_receiver[k], sms_data, 'PROPOSAL_LINK_SENT', dbUserData['PB_CRN']);
                    }

                    //get QR code                                    
                    var ObjQr = {
                        'chl': short_url,
                        'chld': 'L|4',
                        'choe': 'UTF-8',
                        'chs': '150x150',
                        'cht': 'qr'
                    };
                    var qs = '';
                    for (var k in ObjQr) {
                        qs += k + '=' + encodeURIComponent(ObjQr[k]) + '&';
                    }
                    _request['___qr_source___'] = "http://chart.googleapis.com/chart?" + qs;
                    //send mail
                    var fs = require('fs');
                    var email_data = '';
                    if (dbUserData['Product_Id'] == 1 || dbUserData['Product_Id'] == 10 || dbUserData['Product_Id'] == 12) {
                        if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_POSP.html').toString();
                        } else {
                            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link.html').toString();
                        }

                    }
                    if (dbUserData['Product_Id'] == 2) {
                        if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Health_POSP.html').toString();
                        } else {
                            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Health.html').toString();
                        }

                    }
                    if (dbUserData['Product_Id'] == 17) {
                        if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_CoronaCare_POSP.html').toString();
                        } else {
                            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_CoronaCare.html').toString();
                        }

                    }
                    if (dbUserData['Product_Id'] === 18) {
                        if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Cyber_POSP.html').toString();
                        } else {
                            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Cyber.html').toString();
                        }

                    }
                    if (dbUserData['Product_Id'] === 4) {
                        if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Travel_POSP.html').toString();
                        } else {
                            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Travel.html').toString();
                        }

                    }
                    var sub = _request["___sub___"];
                    email_data = email_data.replaceJson(_request);
                    var Email = require('../models/email');
                    var objModelEmail = new Email();
                    var arr_bcc = [config.environment.notification_email];
                    if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] != '' && dbUserData.Premium_Request['posp_reporting_email_id'] != null) {
                        if (dbUserData.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                            arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                        }
                    }
                    if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] != null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
                        arr_bcc.push(dbUserData['Premium_Request']['posp_sub_fba_email']);
                    }
                    objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), dbUserData['PB_CRN']);
                    //update status as PROPOSAL_LINK_SENT
                    if (reminder > 0) {
                        var objUserData = {
                            'Status_History': null
                        };
                        var Status_History = (dbUserData.hasOwnProperty('Status_History')) ? dbUserData.Status_History : [];
                        var Last_Status = 'REMINDER_LINK_SENT';
                        Status_History.unshift({
                            "Status": Last_Status,
                            "Long_Url": objRequestCore['payment_link'],
                            "Short_Url": short_url,
                            "Form_Data": _request,
                            "StatusOn": new Date()
                        });
                        objUserData.Status_History = Status_History;
                    } else {
                        var objUserData = {
                            'Last_Status': null,
                            'Status_History': null,
                            'Link_Request': _request,
                            'Link_Id': objRequestCore['link_id']
                        };
                        var Status_History = (dbUserData.hasOwnProperty('Status_History')) ? dbUserData.Status_History : [];
                        var Last_Status = 'PROPOSAL_LINK_SENT';
                        Status_History.unshift({
                            "Status": Last_Status,
                            "Long_Url": objRequestCore['payment_link'],
                            "Short_Url": short_url,
                            "Form_Data": _request,
                            "StatusOn": new Date()
                        });
                        objUserData.Last_Status = Last_Status;
                        objUserData.Status_History = Status_History;
                        objUserData.Modified_On = new Date();
                    }

                    var User_Data = require('../models/user_data');
                    User_Data.update({
                        'User_Data_Id': dbUserData.User_Data_Id
                    }, {$set: objUserData}, function (err, numAffected) {
                        res.json({
                            'Msg': 'Data saved',
                            'Id': dbUserData.User_Data_Id,
                            'Status': 'SUCCESS',
                            'Payment_Link': short_url
                        });
                    });

                } catch (ex3) {
                    console.error('send_payment_link_3', ex3, objRequestCore);
                    res.json({
                        'Msg': ex3.stack,
                        'Id': dbUserData.User_Data_Id,
                        'Status': 'FAIL'
                    });
                }
            } else {
                //console.error('Exception', 'BitlyError', objRequestCore['payment_link'], data);
                var sub = '[' + config.environment.name.toString().toUpperCase() + '-ERR]SHORTEN_ERROR';
                email_data = '<html><body>TOKEN - ' + bitly_access_token + '<p>Data</p><pre>' + objRequestCore['payment_link'] + '</pre><p>Response</p></body></html>';
                var Email = require('../models/email');
                var objModelEmail = new Email();
                objModelEmail.send('customercare@policyboss.com', config.environment.notification_email, sub, email_data, '', '');
                return res.json({'Msg': 'Shorten_URL_Err', 'Status': 'FAIL'});
            }
        } catch (ex1) {
            console.error('send_payment_link_2', ex1, objRequestCore);
            return res.json({'Msg': ex1.stack, 'Status': 'FAIL'});
        }
    });
}
router.get('/sync_vehicle', function (req, res, next) {
    res.json({'Msg': 'Mapping_Discontinued'});
    if (false) {
        var sync_type = req.query['sync_type'];
        var sql = require("mssql");
        sql.close();
        // config for your database   

        // connect to your database
        sql.connect(config.portalsqldb, function (err) {
            if (err) {
                console.error(err);
            }
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            // send records as a response
            var modelName = '';
            var collectionName = '';
            if (sync_type === 'Master') {
                tableName = 'Insurer_Vehicle_Master';
                modelName = 'vehicles_insurer';
                collectionName = 'vehicles_insurers';
            } else if (sync_type === 'Mapping') {
                tableName = 'Insurer_Vehicle_Mapping';
                modelName = 'vehicles_insurers_mapping';
                collectionName = 'vehicles_insurers_mappings';
            } else if (sync_type === 'Variant') {
                tableName = 'Variant';
                modelName = 'vehicle';
                collectionName = 'vehicles';
            }
            console.error(sync_type);
            request.query('select * from ' + tableName, function (err, recordset) {
                if (err) {
                    console.error(err);
                } else {
                    var vehicle = require('../models/' + modelName);
                    vehicle.remove({}, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            var vehicleMasterFieldSchema = {};
                            if (sync_type === 'Master') {
                                vehicleMasterFieldSchema = {
                                    "Insurer_Vehicle_ID": "Insurer_Vehicle_ID",
                                    "Insurer_ID": "Insurer_ID",
                                    "Insurer_Vehicle_Code": "Insurer_Vehicle_Code",
                                    "Insurer_Vehicle_Make_Name": "Insurer_Vehicle_Make_Name",
                                    "Insurer_Vehicle_Make_Code": "Insurer_Vehicle_Make_Code",
                                    "Insurer_Vehicle_Model_Name": "Insurer_Vehicle_Model_Name",
                                    "Insurer_Vehicle_Model_Code": "Insurer_Vehicle_Model_Code",
                                    "Insurer_Vehicle_Variant_Name": "Insurer_Vehicle_Variant_Name",
                                    "Insurer_Vehicle_Variant_Code": "Insurer_Vehicle_Variant_Code",
                                    "Insurer_Vehicle_FuelType": "Insurer_Vehicle_FuelType",
                                    "Insurer_Vehicle_CubicCapacity": "Insurer_Vehicle_CubicCapacity",
                                    "Insurer_Vehicle_SeatingCapacity": "Insurer_Vehicle_SeatingCapacity",
                                    "Insurer_Vehicle_ExShowRoom": "Insurer_Vehicle_ExShowRoom",
                                    "Insurer_Vehicle_Insurer_Segmant": "Insurer_Vehicle_Insurer_Segmant",
                                    "Insurer_Vehicle_Insurer_BodyType": "Insurer_Vehicle_Insurer_BodyType",
                                    "IsActive": "Is_Active",
                                    "Created_On": "Created_On",
                                    "Product_Id_New": "Product_Id_New",
                                    "PB_Make_Name": "PB_Make_Name"
                                };
                            }
                            if (sync_type === 'Mapping') {
                                vehicleMasterFieldSchema = {
                                    "Insurer_Vehicle_Mapping_ID": "Insurer_Vehicle_Mapping_ID",
                                    "Insurer_ID": "Insurer_ID",
                                    "Insurer_Vehicle_ID": "Insurer_Vehicle_ID",
                                    "Variant_ID": "Vehicle_ID",
                                    "IsActive": "Is_Active",
                                    "Created_On": "Created_On",
                                    "Status_Id": "Status_Id",
                                    "Premium_Status": "Premium_Status"
                                };
                            }
                            if (sync_type === 'Variant') {
                                vehicleMasterFieldSchema = {
                                    "Variant_ID": "Vehicle_ID",
                                    "Variant_Name": "Variant_Name",
                                    "Model_ID": "Model_ID",
                                    "Cubic_Capacity": "Cubic_Capacity",
                                    "Vehicle_Image": "Vehicle_Image",
                                    "Fuel_ID": "Fuel_ID",
                                    "Seating_Capacity": "Seating_Capacity",
                                    "ExShoroomPrice": "ExShoroomPrice",
                                    "IsActive": "Is_Active",
                                    "CreatedOn": "CreatedOn",
                                    "ModifyOn": "ModifyOn",
                                    "IndirectVariant_Id": "IndirectVariant_Id",
                                    "InHouseSS_Variant_Id": "InHouseSS_Variant_Id",
                                    "Product_Id_New": "Product_Id_New",
                                    "Make_Name": "Make_Name",
                                    "Model_Name": "Model_Name",
                                    "Fuel_Name": "Fuel_Name"
                                };
                            }
                            console.log('vehicleMasterFieldSchema');
                            var arrVehicle = [];
                            for (var k in recordset.recordset) {
                                var objVehicle = {};
                                for (var k1 in recordset.recordset[k]) {
                                    var mngKey = vehicleMasterFieldSchema[k1];
                                    objVehicle[mngKey] = isNaN(recordset.recordset[k][k1]) ? recordset.recordset[k][k1].toString().trim() : (recordset.recordset[k][k1] - 0);
                                }
                                arrVehicle.push(objVehicle);
                            }
                            console.log('data pushed');
                            var syncVehicleMasterSummary = {
                                'Count_Push': arrVehicle.length,
                                'Count_Saved': 0,
                                //'Record' : arrPosp[0],
                                'Status': ''
                            };
                            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                                // Get the collection
                                var colVehicle = db.collection(collectionName);
                                colVehicle.insertMany(arrVehicle, function (err, r) {
                                    if (err) {
                                        syncVehicleMasterSummary.Status = err;
                                    } else {
                                        syncVehicleMasterSummary.Count_Saved = r.insertedCount;
                                        syncVehicleMasterSummary.Status = 'SUCCESS';
                                    }
                                    console.log('count saved');
                                    var msg = '<!DOCTYPE html><html><head><title>Proposal Report</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                    msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">Error&nbsp;Details</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                    for (var k3 in syncVehicleMasterSummary) {
                                        msg += '<tr><td  width="20%" style="font-size:14px;font-family:tahoma;background-color: #ffcc00">' + k3 + '</td><td  width="78%" style="font-family:tahoma;font-size:14px;">' + syncVehicleMasterSummary[k3] + '&nbsp;</td></tr>';
                                    }
                                    msg += '</table></div><br><br>';
                                    var Email = require('../models/email');
                                    var objModelEmail = new Email();
                                    var sub = '[' + config.environment.name.toString().toUpperCase() + '-' + ((syncVehicleMasterSummary.Count_Saved > 0) ? 'INFO' : 'ERR') + ']';
                                    var today = moment().format("D-MMM-YYYY");
                                    sub += 'VEHICLE_' + sync_type + '_SYNC_MONGO::' + today.toString();
                                    objModelEmail.send('customercare@policyboss.com', config.environment.notification_email, sub, msg, '', '');
                                    res.json(syncVehicleMasterSummary);
                                    db.close();
                                });
                            });
                        }
                    });
                }
                //res.send(recordset);
            });
        });
    }

});
router.post('/transaction_status_add', function (req, res, next) {
    try {
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        var User_Data = require('../models/user_data');
        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        var fs = require('fs');
        form.parse(req, function (err, fields, files) {
            console.error(fields);
            console.error(files);
            let User_Data_Id = fields['User_Data_Id'] - 0;
            if (User_Data_Id) {
                User_Data.findOne({"User_Data_Id": User_Data_Id}, function (err, dbUserData) {
                    if (err) {
                        res.json({Msg: 'DB_Err'});
                    } else {
                        let objUserData = {};
                        let Msg = 'NA';
                        try {
                            let is_transaction_valid = false;
                            if (dbUserData) {
                                dbUserData = dbUserData._doc;
                                if (dbUserData.hasOwnProperty('Insurer_Id') && dbUserData.Insurer_Id !== null) {
                                    is_transaction_valid = true;
                                } else {
                                    Msg = 'Proposal_Not_Submitted';
                                }
                            } else {
                                Msg = 'Data_Empty';
                            }

                            if (is_transaction_valid) {
                                let Last_Status = fields['Last_Status'];
                                let Pre_Last_Status = dbUserData['Last_Status'];
                                let Status_History = (dbUserData.hasOwnProperty('Status_History')) ? dbUserData.Status_History : [];
                                let Action = 'YTD';
                                let ERP_CS = (dbUserData.hasOwnProperty('ERP_CS') && dbUserData['ERP_CS'] !== '' && dbUserData['ERP_CS'] !== null) ? dbUserData['ERP_CS'] : 'PENDING';
                                let policy_number = fields['policy_number'];
                                let product_id = dbUserData['Product_Id'];
                                let insurer_id = dbUserData['Insurer_Id'].toString();
                                var objPg = {
                                    "policy_url": null,
                                    "pg_debit_document_url": null,
                                    "policy_number": null,
                                    "policy_id": null,
                                    "transaction_status": null,
                                    "pg_status": null,
                                    "transaction_id": null,
                                    "transaction_amount": null,
                                    "pg_reference_number_1": null,
                                    "pg_reference_number_2": null,
                                    "pg_reference_number_3": null,
                                    "remark": null
                                };
                                for (var k in objPg) {
                                    if (fields.hasOwnProperty(k) && fields[k]) {
                                        objPg[k] = fields[k];
                                    }
                                }
                                if (fields.hasOwnProperty('dbg')) {
                                    objPg['dbg'] = 'yes';
                                }
                                var today = moment().utcOffset("+05:30");
                                var dt = today.toLocaleString();
                                objPg['Transaction_Date'] = dbUserData.Modified_On;
                                objPg['Dropoff_Action_Date'] = dt;
                                if (Last_Status === 'TRANS_SUCCESS_WITH_POLICY') {
                                    if (Pre_Last_Status === 'TRANS_SUCCESS_WO_POLICY') {
                                        Action = 'MANUAL_POLICY';
                                    } else if (Pre_Last_Status === 'TRANS_PAYPASS') {
                                        Action = 'MANUAL_SALE_POLICY';
                                    } else {
                                        Action = 'MANUAL_SALE_POLICY';
                                    }
                                }
                                if (Last_Status === 'TRANS_SUCCESS_WO_POLICY') {
                                    Action = 'MANUAL_SALE';
                                }

                                Status_History.unshift({
                                    "Status": Last_Status,
                                    "Pre_Last_Status": Pre_Last_Status,
                                    "Action": Action,
                                    "StatusOn": new Date()
                                });
                                objUserData = {
                                    'ERP_CS': ERP_CS,
                                    'Last_Status': Last_Status,
                                    'Status_Mode': 'MANUAL',
                                    'Transaction_Data': objPg,
                                    'Status_History': Status_History
                                };
                                if (dbUserData.hasOwnProperty('ERP_ENTRY') === false) {
                                    //objUserData['ERP_CS'] = 'PENDING';
                                    objUserData['ERP_ENTRY'] = 'PENDING';
                                }

                                var msg = '<html><h1>New Data</h1><pre>' + JSON.stringify(objUserData, undefined, 2) + '</pre><br><h1>Old Data</h1><pre>' + JSON.stringify(dbUserData, undefined, 2) + '</pre></html>';
                                var sub = '[' + (config.environment.name.toString() === 'Production' ? 'PolicyBoss' : config.environment.name.toString().toUpperCase()) + '] Transaction Manual Reconsilation CRN : ' + dbUserData.PB_CRN;
                                var Email = require('../models/email');
                                var objModelEmail = new Email();
                                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, msg, '', '');
                                objUserData.Transaction_Data = objPg;
                                if (Last_Status === 'TRANS_SUCCESS_WITH_POLICY' || Last_Status === 'REPORTED_SALE') {
                                    if (files.hasOwnProperty('policy_file')) { // for policy copy
                                        //var pdf_file_name = objInsuranceProduct[insurer_id] + product_class + '_' + product_name + '_' + policy_number.toString().trim().replace(/\//g, '') + '.pdf';
                                        var pdf_file_name = objBase.create_policy_file_name(policy_number, insurer_id, product_id);
                                        var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                                        var pdf_web_path_horizon = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                                        objUserData.Transaction_Data['policy_url'] = pdf_web_path_horizon;
                                        var oldpath = files.policy_file.path;
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
                                                console.log('File uploaded and moved!');
                                                console.log('File written!');
                                                User_Data.update({'User_Data_Id': User_Data_Id}, {$set: objUserData}, function (err, numAffected) {
                                                    console.log('UserDataUpdated', err, numAffected);
                                                    if (err) {
                                                        objUserData['Msg'] = err;
                                                    } else {
                                                        objUserData['Msg'] = numAffected;
                                                        transaction_status_add_cb(Last_Status, dbUserData);
                                                    }
                                                    res.json(objUserData);
                                                });
                                                console.log('File uploaded and moved!');
                                            });
                                            // Delete the file
                                            fs.unlink(oldpath, function (err) {
                                                if (err)
                                                    throw err;
                                                console.log('File deleted!');
                                            });
                                        });
                                    }
                                } else if (Last_Status === 'TRANS_SUCCESS_WO_POLICY') {
                                    User_Data.update({'User_Data_Id': User_Data_Id}, {$set: objUserData}, function (err, numAffected) {
                                        console.error('UserDataUpdated', err, numAffected);
                                        if (err) {
                                            objUserData['Msg'] = err;
                                        } else {
                                            objUserData['Msg'] = numAffected;
                                            transaction_status_add_cb(Last_Status, dbUserData);
                                        }
                                    });
                                } else if (Last_Status === 'TRANS_PAYPASS_MANUAL' || Last_Status === 'REPORTED_PAYMENT') {
                                    if (files.hasOwnProperty('pg_debit_document')) { // for policy copy
                                        var arr_file_ext = files.pg_debit_document.name.split('.');
                                        var file_ext = arr_file_ext[arr_file_ext.length - 1];
                                        var pg_debit_document_file_name = 'pg_debit_document_' + dbUserData['PB_CRN'] + '_' + moment().format('YYYYMMDD_HHmmss') + '.' + file_ext;
                                        var pg_debit_document_sys_loc_horizon = appRoot + "/tmp/pg_ack/" + pg_debit_document_file_name;
                                        var pg_debit_document_web_path_horizon = config.environment.downloadurl + "/pg_ack/" + pg_debit_document_file_name;
                                        objUserData.Transaction_Data['pg_debit_document_url'] = pg_debit_document_web_path_horizon;
                                        var oldpath = files.pg_debit_document.path;
                                        fs.readFile(oldpath, function (err, data) {
                                            if (err)
                                            {
                                                console.error('Read', err);
                                            }
                                            console.log('File read!');
                                            // Write the file
                                            fs.writeFile(pg_debit_document_sys_loc_horizon, data, function (err) {
                                                if (err)
                                                {
                                                    console.error('Write', err);
                                                }
                                                User_Data.update({'User_Data_Id': User_Data_Id}, {$set: objUserData}, function (err, numAffected) {
                                                    console.log('UserDataUpdated', err, numAffected);
                                                    if (err) {
                                                        objUserData['Msg'] = err;
                                                    } else {
                                                        objUserData['Msg'] = numAffected;
                                                        transaction_status_add_cb(Last_Status, dbUserData);
                                                    }
                                                    res.json(objUserData);
                                                });
                                            });
                                            // Delete the file
                                            fs.unlink(oldpath, function (err) {
                                                if (err)
                                                    throw err;
                                                console.log('File deleted!');
                                            });
                                        });
                                    } else {
                                        objUserData['Msg'] = 'PG_DOC_MISSING';
                                        res.json(objUserData);
                                    }
                                } else if (Last_Status === 'TRANS_FAIL') {
                                    User_Data.update({'User_Data_Id': User_Data_Id}, {$set: objUserData}, function (err, numAffected) {
                                        console.error('UserDataUpdated', err, numAffected);
                                        if (err) {
                                            objUserData['Msg'] = err;
                                        } else {
                                            objUserData['Msg'] = numAffected;
                                            transaction_status_add_cb(Last_Status, dbUserData);
                                        }
                                        res.json(objUserData);
                                    });
                                }
                                try {
                                    if (['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY'].indexOf(Last_Status) > -1 && dbUserData['PB_CRN'] > 0 && dbUserData['User_Data_Id'] > 0) {
                                        var Client = require('node-rest-client').Client;
                                        var client = new Client();
                                        client.get(config.environment.weburl + '/report/process_already_closed?ud=' + dbUserData['User_Data_Id'], {}, function (data, response) {});
                                    }
                                } catch (e) {
                                    console.error('ALREADY_PROCESS', 'Exception', e);
                                }
                                console.error('UserDataUpdatedDBG', User_Data_Id, objUserData);
                            } else {
                                objUserData['Msg'] = Msg;
                                res.json(objUserData);
                            }
                        } catch (ex) {
                            console.error('Exception', 'Transaction_Add', ex);
                            objUserData['Msg'] = JSON.stringify(ex);
                            res.json(objUserData);
                        }
                    }
                });
            }
        });
    } catch (e) {
        console.error('Exception', 'Transaction_Add', e);
        res.send(e.stack);
    }
});
function transaction_status_add_cb(Last_Status, dbUserData) {
    try {
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        if (Last_Status === 'TRANS_SUCCESS_WITH_POLICY' || Last_Status === 'TRANS_SUCCESS_WO_POLICY') {
            objBase.send_policy_upload_notification(dbUserData['User_Data_Id']);
        }
        if (Last_Status === 'TRANS_PAYPASS_MANUAL') {

            var tmpuser = dbUserData;
            var Email = require('../models/email');
            var objModelEmail = new Email();
            var objProduct = {
                '1': 'Car',
                '2': 'Health',
                '4': 'Travel',
                '3': 'Term',
                '10': 'TW',
                '12': 'CV',
                '13': 'Marine',
                '17': 'Corona Care',
                '18': 'Cyber Security'
            };
            var product_short_name = objProduct[tmpuser['Product_Id']];
            var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + product_short_name + '] POLICY_MANUAL_RECONSILATION CRN : ' + tmpuser['PB_CRN'];
            var arr_to = [];
            var arr_bcc = [config.environment.notification_email];
            var arr_cc = [];
            var contentSms_Log = "\n\
POLICY_RECONCILATION\n\
-------------------\n\
Transaction is manually reconsiled as status - " + Last_Status + ".\n\
CRN: " + tmpuser['PB_CRN'] + "\n\
Agent: " + tmpuser['Erp_Qt_Request_Core']['___posp_first_name___'] + ' ' + tmpuser['Erp_Qt_Request_Core']['___posp_last_name___'] + "\n\
Customer: " + tmpuser['Erp_Qt_Request_Core']['___first_name___'] + ' ' + tmpuser['Erp_Qt_Request_Core']['___last_name___'] + "\n\
Product: " + product_short_name + "";
            var email_body = contentSms_Log.replace(/\n/g, '<BR>');
            var email_data = '<!DOCTYPE html><html><head><title>POLICY_RECONCILATION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
            email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">POLICY_RECONCILATION_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
            email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">' + email_body + '&nbsp;</td></tr>';
            email_data += '</table></div><br></body></html>';
            if (tmpuser['Product_Id'] === 2) {
                arr_bcc.push('apaar.kasliwal@landmarkinsurance.in'); //apaar
            }
            if (tmpuser['Premium_Request']['ss_id'] - 0 > 0) {
                if (tmpuser['Premium_Request'].hasOwnProperty('posp_email_id') && tmpuser['Premium_Request']['posp_email_id'] != null && tmpuser['Premium_Request']['posp_email_id'].toString().indexOf('@') > -1) {
                    arr_to.push(tmpuser['Premium_Request']['posp_email_id']);
                }
                if (tmpuser['Premium_Request'].hasOwnProperty('posp_reporting_email_id') && tmpuser['Premium_Request']['posp_reporting_email_id'] != null && tmpuser['Premium_Request']['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                    arr_cc.push(tmpuser['Premium_Request']['posp_reporting_email_id']);
                }
                if (tmpuser['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && tmpuser['Premium_Request']['posp_sub_fba_email'] != null && tmpuser['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
                    arr_cc.push(tmpuser['Premium_Request']['posp_sub_fba_email']);
                }
                if (config.environment.name === 'Production') {
                    if ((tmpuser['Premium_Request']['posp_sources'] - 0) > 0) {
                        if ((tmpuser['Premium_Request']['posp_sources'] - 0) === 1) {
                            arr_bcc.push('transactions.1920@gmail.com'); //finmart-dc                                                                     
                        }
                    }
                }
            } else {
                arr_to.push('chirag.modi@policyboss.com');
            }
            if (arr_to.length) {
                objModelEmail.send('notifications@policyboss.com', arr_to.join(','), sub, email_data, arr_cc.join(','), arr_bcc.join(','), tmpuser['PB_CRN']);
            }
        }
        if (Last_Status === 'REPORTED_SALE' || Last_Status === 'REPORTED_PAYMENT' || Last_Status === 'TRANS_FAIL') {
            let msg = '';
            if (Last_Status === 'REPORTED_SALE') {
                msg = 'Online Team will verify uploaded policy details. After verification, This transaction will be marked to \"SALE\" or \"REJECTED\".';
            }
            if (Last_Status === 'REPORTED_PAYMENT') {
                msg = 'Online Team will verify uploaded PG details. Same will be shared with Insurer to get Policy schedule. Once policy / status is received from insurer then, This transaction will be marked to \"SALE\" or \"REJECTED\".';
            }

            var tmpuser = dbUserData;
            var Email = require('../models/email');
            var objModelEmail = new Email();
            var objProduct = {
                '1': 'Car',
                '2': 'Health',
                '4': 'Travel',
                '3': 'Term',
                '10': 'TW',
                '12': 'CV',
                '17': 'Corona Care',
                '18': 'Cyber Security'
            };
            var product_short_name = objProduct[tmpuser['Product_Id']];
            var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + ((tmpuser['Transaction_Data']['dbg'] === 'yes') ? "[DBG]" : "") + '[' + product_short_name + '] PG_DROPOFF_CLOSURE_REQUEST CRN : ' + tmpuser['PB_CRN'];
            var arr_to = [];
            var arr_bcc = [config.environment.notification_email];
            var arr_cc = [];
            var contentSms_Log = "\n\
PG_DROPOFF_CLOSURE_REQUEST\n\
--------------------------\n\
In following transaction, POSP / Customer has marked Payment Gateway Dropoff with status - <U><B>" + Last_Status + "</B></U>. \n\
" + msg + "\n\n\
CRN: " + tmpuser['PB_CRN'] + "\n\
Agent: " + tmpuser['Erp_Qt_Request_Core']['___posp_first_name___'] + ' ' + tmpuser['Erp_Qt_Request_Core']['___posp_last_name___'] + "\n\
Customer: " + tmpuser['Erp_Qt_Request_Core']['___first_name___'] + ' ' + tmpuser['Erp_Qt_Request_Core']['___last_name___'] + "\n\
Transaction_Date: " + tmpuser['Modified_On'].toLocaleString() + "\n\
Dropoff_Action_Date: " + tmpuser['Transaction_Data']['Dropoff_Action_Date'] + "\n\
Product: " + product_short_name + "\n\
Remark: " + tmpuser['Transaction_Data']['remark'];
            var email_body = contentSms_Log.replace(/\n/g, '<BR>');
            var email_data = '<!DOCTYPE html><html><head><title>POLICY_RECONCILATION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
            email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">POLICY_RECONCILATION_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
            email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">' + email_body + '&nbsp;</td></tr>';
            email_data += '</table></div><br></body></html>';
            if (tmpuser['Transaction_Data']['dbg'] === 'yes') {
                arr_to.push('chirag.modi@policyboss.com');
            } else {
                arr_to.push('techsupport@policyboss.com');
                if (tmpuser['Premium_Request']['ss_id'] - 0 > 0) {

                    if (tmpuser['Premium_Request'].hasOwnProperty('posp_email_id') && tmpuser['Premium_Request']['posp_email_id'] != null && tmpuser['Premium_Request']['posp_email_id'].toString().indexOf('@') > -1) {
                        arr_to.push(tmpuser['Premium_Request']['posp_email_id']);
                    }
                    if (tmpuser['Premium_Request'].hasOwnProperty('posp_reporting_email_id') && tmpuser['Premium_Request']['posp_reporting_email_id'] != null && tmpuser['Premium_Request']['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                        arr_cc.push(tmpuser['Premium_Request']['posp_reporting_email_id']);
                    }
                    if (tmpuser['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && tmpuser['Premium_Request']['posp_sub_fba_email'] != null && tmpuser['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
                        arr_cc.push(tmpuser['Premium_Request']['posp_sub_fba_email']);
                    }
                    if (config.environment.name === 'Production') {
                        if ((tmpuser['Premium_Request']['posp_sources'] - 0) > 0) {
                            if ((tmpuser['Premium_Request']['posp_sources'] - 0) === 1) {
                                arr_bcc.push('transactions.1920@gmail.com'); //finmart-dc                                                                     
                            }
                        }
                    }
                }
            }

            if (arr_to.length) {
                objModelEmail.send('notifications@policyboss.com', arr_to.join(','), sub, email_data, arr_cc.join(','), arr_bcc.join(','), tmpuser['PB_CRN']);
            }
        }
    } catch (e) {
        console.error('Exception', 'Notification_Transaction_RECONCILATION', e);
    }
}
router.post('/erp_cs', function (req, res, next) {
    try {
        var fs = require('fs');
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        objBase.lm_request = JSON.parse(JSON.stringify(req.body));
        var User_Data = require('../models/user_data');
        var ud_cond = {'Request_Unique_Id': objBase.lm_request.search_reference_number};
        if (objBase.lm_request.hasOwnProperty('udid') && objBase.lm_request.udid > 0) {
            ud_cond = {
                "User_Data_Id": objBase.lm_request.udid - 0,
                "Product_Id": {$in: [1, 2, 10, 12, 17, 4]},
                "Last_Status": {$in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}
            };
        }
        if (objBase.lm_request['search_reference_number']) {
            User_Data.findOne(ud_cond, function (err, dbUserData) {
                if (err) {
                    res.json({Msg: 'DB_Err'});
                }
                if (dbUserData) {            //process for pg_data
                    try {
                        console.log('data_avail');
                        dbUserData = dbUserData._doc;
                        var is_cspending = false;
                        if (dbUserData.hasOwnProperty('ERP_CS') && dbUserData['ERP_CS'] != null) {
                            if (['PENDING', 'TRYAGAIN', 'EXCEPTION'].indexOf(dbUserData['ERP_CS'].toString()) > -1 || dbUserData['ERP_CS'].indexOf('VALIDATION') > -1) {
                                is_cspending = true;
                            }
                            if (dbUserData['ERP_CS'].toString() === 'INPROGRESS') {
                                return res.json({'Msg': 'CS_IN_PROGRESS'});
                            }
                            if (dbUserData['ERP_CS'].toString().indexOf('CS') > -1) {
                                return res.json({'Msg': 'CS_ALREDY_CREATED'});
                            }
                        } else {
                            is_cspending = true;
                        }

                        if (is_cspending) {
                            var Service_Log = require('../models/service_log');
                            Service_Log.findOne({"Service_Log_Id": dbUserData['Proposal_Request_Core']['slid'] - 0}, function (err, dbService_Log) {
                                try {
                                    if (err || dbService_Log === null) {
                                        return res.send('SLID NOT FOUND' + err);
                                    }

                                    var obj_erp_data = {};
                                    if (dbUserData.hasOwnProperty('Erp_Qt_Request_Core')) {
                                        obj_erp_data = dbUserData.Erp_Qt_Request_Core;
                                    } else {
                                        dbService_Log = dbService_Log._doc;
                                        var productId = dbUserData["Product_Id"];
                                        var objProduct;
                                        if ([1, 10, 12].indexOf(productId) > -1) {
                                            var Motor = require('../libs/Motor');
                                            objProduct = new Motor();
                                        } else if (productId === 2) {
                                            var Health = require('../libs/Health');
                                            objProduct = new Health();
                                        } else if (productId === 13) {
                                            var Marine = require('../libs/Marine');
                                            objProduct = new Marine();
                                        } else if (productId === 15) {
                                            var Cycle = require('../libs/Cycle');
                                            objProduct = new Cycle();
                                        } else if (productId === 16) {
                                            var CancerCare = require('../libs/CancerCare');
                                            objProduct = new CancerCare();
                                        } else if (productId === 5) {
                                            var Investment = require('../libs/Investment');
                                            objProduct = new Investment();
                                        } else if (productId === 18) {
                                            var CyberSecurity = require('../libs/CyberSecurity');
                                            objProduct = new CyberSecurity();
                                        } else if (productId === 4) {
                                            var Travel = require('../libs/Travel');
                                            objProduct = new Travel();
                                        }
                                        objProduct.insurer_master = {
                                            'vehicles': {'pb_db_master': dbUserData['Master_Details']['vehicle']},
                                            'rtos': {'pb_db_master': dbUserData['Master_Details']['rto']},
                                            'service_logs': {'pb_db_master': dbService_Log}
                                        };
                                        objProduct.lm_request = dbUserData.Proposal_Request_Core;
                                        objProduct.lm_request['no_erp_data'] = 'yes';
                                        objProduct.lm_request['product_id'] = productId;

                                        objProduct.lm_request['current_date'] = moment(dbUserData.Modified_On).format("YYYY-MM-DD");
                                        objProduct.lm_request['policy_start_date'] = dbService_Log['LM_Custom_Request']['policy_start_date'];
                                        objProduct.lm_request['policy_end_date'] = dbService_Log['LM_Custom_Request']['policy_end_date'];


                                        for (let k in objProduct.lm_request) {
                                            if (k.indexOf('_date') > -1) {
                                                let t_date_1 = moment(objProduct.lm_request[k], 'DD/MM/YYYY', true);
                                                if (t_date_1.isValid()) {
                                                    objProduct.lm_request[k] = moment(objProduct.lm_request[k], 'DD/MM/YYYY').format('YYYY-MM-DD');
                                                }
                                            }
                                        }
                                        if ([1, 10, 12].indexOf(productId) > -1) {
                                            obj_erp_data = objProduct.motor_erp_qt_data_prepare('QT');
                                        } else if (productId === 2) {
                                            obj_erp_data = objProduct.health_erp_qt_data_prepare('QT');
                                        } else if (productId === 13) {
                                            obj_erp_data = objProduct.marine_erp_qt_data_prepare('QT');
                                        } else if (productId === 15) {
                                            obj_erp_data = objProduct.cycle_erp_qt_data_prepare('QT');
                                        } else if (productId === 16) {
                                            obj_erp_data = objProduct.cancercare_erp_qt_data_prepare('QT');
                                        } else if (productId === 5) {
                                            obj_erp_data = objProduct.investment_erp_qt_data_prepare('QT');
                                        } else if (productId === 18) {
                                            obj_erp_data = objProduct.cyber_erp_qt_data_prepare('QT');
                                        } else if (productId === 4) {
                                            obj_erp_data = objProduct.travel_erp_qt_data_prepare('QT');
                                        }
                                    }

                                    /*obj_erp_data['___current_date___'] = moment(dbUserData.Modified_On).format("YYYY-MM-DD");
                                     obj_erp_data['___policy_start_date___'] = dbService_Log['LM_Custom_Request']['policy_start_date'];
                                     obj_erp_data['___policy_end_date___'] = dbService_Log['LM_Custom_Request']['policy_end_date'];
                                     */
                                    if (obj_erp_data.hasOwnProperty('___external_bifuel_value___') && (obj_erp_data['___external_bifuel_value___'] - 0) == '0') {
                                        obj_erp_data['___external_bifuel_value___'] = 0;
                                    }
                                    obj_erp_data['___posp_reporting_agent_uid___'] = obj_erp_data['___posp_reporting_agent_uid___'] - 0;

                                    for (let k in obj_erp_data) {
                                        if (obj_erp_data[k] == null) {
                                            obj_erp_data[k] = 0;
                                        } else if (k.indexOf('_date') > -1) {
                                            let t_date_1 = moment(obj_erp_data[k], 'DD/MM/YYYY', true);
                                            if (t_date_1.isValid()) {
                                                obj_erp_data[k] = moment(obj_erp_data[k], 'DD/MM/YYYY').format('YYYY-MM-DD');
                                            }
                                        }
                                    }
                                    var transaction_data = dbUserData.Transaction_Data;
                                    objBase.lm_request['product_id'] = dbUserData.Product_Id;
                                    objBase.lm_request['client_id'] = dbUserData.Client_Id;
                                    objBase.lm_request['client_name'] = dbUserData.Premium_Request['client_name'];
                                    objBase.lm_request['crn'] = dbUserData.PB_CRN;
                                    if (transaction_data && transaction_data.transaction_status === 'SUCCESS') {
                                        for (let k in transaction_data) {
                                            obj_erp_data['___pg_' + k.toString().toLowerCase() + '___'] = (transaction_data[k]) ? transaction_data[k] : 0;
                                        }
                                        if (obj_erp_data['___pg_policy_number___'] === 0) {
                                            obj_erp_data['___pg_policy_number___'] = '';
                                        }

                                        obj_erp_data['___premium_breakup_net_premium___'] = Math.round(obj_erp_data['___net_premium___'] - 0);
                                        obj_erp_data['___premium_breakup_final_premium___'] = Math.round(obj_erp_data['___final_premium___'] - 0);
                                        if (dbUserData.Product_Id == 2 || dbUserData.Product_Id == 17) {
                                            obj_erp_data['___premium_breakup_service_tax___'] = Math.round(obj_erp_data['___service_tax___'] - 0);
                                            if (obj_erp_data.hasOwnProperty('___communication_address_1___') === false) {
                                                obj_erp_data['___communication_address_1___'] = obj_erp_data['___permanent_address_1___'];
                                                obj_erp_data['___communication_address_2___'] = obj_erp_data['___permanent_address_2___'];
                                                obj_erp_data['___communication_address_3___'] = obj_erp_data['___permanent_address_3___'];
                                                obj_erp_data['___communication_pincode___'] = obj_erp_data['___permanent_pincode___'];
                                                obj_erp_data['___communication_city___'] = obj_erp_data['___district___'];
                                            }
                                            if (dbUserData.Product_Id == 17) {
                                                obj_erp_data['___erp_source___'] = 'FRESH-NM';
                                            }
                                        }
                                        if (obj_erp_data['___posp_agent_city___'] === '' || obj_erp_data['___posp_agent_city___'] === null || obj_erp_data['___posp_agent_city___'] == '0') {
                                            obj_erp_data['___posp_agent_city___'] = 'Mumbai';
                                        }
                                        if (dbUserData.Product_Id == 1 || dbUserData.Product_Id == 10) {
                                            if (obj_erp_data.hasOwnProperty('___erp_policy_category___') === false) {
                                                var obj_policy_category = {
                                                    '0CH_1TP': 'PRIVATE - 1 YEAR TP',
                                                    '0CH_3TP': 'PRIVATE - 3 YEAR TP',
                                                    '0CH_5TP': 'PRIVATE - 5 Year TP',
                                                    '1CH_0TP': 'PRIVATE',
                                                    '1OD_0TP': 'PRIVATE - 1 YEAR OD',
                                                    '1CH_2TP': 'PRIVATE - 1 YEAR OD AND 3 YEAR TP',
                                                    '1CH_4TP': 'PRIVATE - 1 Year OD and 5 Year TP',
                                                    '2CH_0TP': 'PRIVATE - 2 YEAR OD AND 2 YEAR TP',
                                                    '3CH_0TP': 'PRIVATE - 3 YEAR OD AND 3 YEAR TP',
                                                    '5CH_0TP': 'Private - 5 Year OD and 5 Year TP'
                                                };
                                                obj_erp_data['___erp_policy_category___'] = obj_policy_category[obj_erp_data['___vehicle_insurance_subtype___']];
                                            }
                                            obj_erp_data['___premium_breakup_service_tax___'] = Math.round(obj_erp_data['___tax___'] - 0);
                                            var addon_final_premium = 0;
                                            for (var k in obj_erp_data) {
                                                if (k.indexOf('addon_') > -1 && k.indexOf('_amt') > -1) {
                                                    addon_final_premium += obj_erp_data[k] - 0;
                                                }
                                            }
                                            var other_liability = obj_erp_data['___premium_breakup_tp_cover_named_passenger_pa___'] + obj_erp_data['___premium_breakup_tp_cover_paid_driver_pa___'] + obj_erp_data['___premium_breakup_tp_cover_paid_driver_ll___'];
                                            obj_erp_data['___tp_other___'] = other_liability;
                                            obj_erp_data['___premium_breakup_addon_final_premium___'] = Math.round(addon_final_premium);
                                            if (obj_erp_data.hasOwnProperty('___nominee_age___') === false) {
                                                objBase.lm_request['nominee_birth_date'] = obj_erp_data['___nominee_birth_date___'];
                                                console.error('LM_Request', objBase.lm_request);
                                                obj_erp_data['___nominee_age___'] = objBase.nominee_age(obj_erp_data['___nominee_birth_date___']);
                                            }
                                        }
                                        var erp_cs_xml = objBase.erp_request_xml_prepare(obj_erp_data, 'CS');
                                        if (dbUserData.Product_Id == 17 && dbUserData.Insurer_Id == 9) {
                                            erp_cs_xml = erp_cs_xml.replace('BusinessGroup>LANDMARK', 'BusinessGroup>Global Assure');
                                        }
                                        console.log('data_avail', obj_erp_data, req.body, erp_cs_xml);
                                        if (req.body['op'] === 'preview') {
                                            var cs_xml_preview_file = appRoot + "/tmp/log/cs_request_" + objBase.lm_request['search_reference_number'] + '.xml';
                                            //fs.writeFileSync(cs_xml_preview_file, erp_cs_xml);
                                            res.send(erp_cs_xml);
                                        }
                                        if (req.body['op'] == 'execute') {
                                            var ObjUser_Data = {
                                                'ERP_CS': 'INPROGRESS'
                                            };
                                            var User_Data = require('../models/user_data');
                                            User_Data.update({'User_Data_Id': dbUserData['User_Data_Id']}, {$set: ObjUser_Data}, function (err, numAffected) {
                                                console.error('DBG', 'erp_cs', 'user_data_cs_update', err, numAffected);
                                                if (err) {
                                                    return res.send(err);
                                                } else {
                                                    if ((numAffected.nModified - 0) > 0) {
                                                        objBase.erp_process_service_call(erp_cs_xml, 'CS', obj_erp_data);
                                                        return res.send(erp_cs_xml);
                                                    } else {
                                                        return res.send('UD_INPROGRESS_NOT_UPDATED');
                                                    }
                                                }
                                            });
                                        }
                                    } else {
                                        res.send('CS_TRANS_DATA_NOT_SUCCESS');
                                    }
                                } catch (ex) {
                                    console.error('Exception', ex.stack);
                                    res.send(ex.stack);
                                }
                            });
                        } else {
                            res.send('CS_NOT_PENDING');
                        }
                    } catch (ex) {
                        console.error('Exception', ex.stack);
                        res.send(ex.stack);
                    }
                } else {
                    res.send('DATA_NOT_IN_CS_CRITERIA');
                }
            });
        }
    } catch (ex) {
        console.error('Exception', 'erp_cs', ex.stack);
        res.send(ex.stack);
    }
});
router.get('/sync_fastlane', function (req, res, next) {
    var sql = require("mssql");
    sql.close();
    // config for your database   

    // connect to your database
    sql.connect(config.portalsqldb, function (err) {
        if (err) {
            console.error(err);
        }
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        request.query('Select C.RTO_City,FR.Regn_No,FR.Fastlane_Response,FR.FastLane_Id,FR.State_cd,FR.Rto_cd,FR.Chasis_no,FR.Eng_no,FR.Regn_dt,FR.Purchase_dt,D.Generation_Year,V.* from FastLaneRegistrationDetails FR inner join FastLaneVariantMapping D on FR.Vehicle_cd=D.Unique_Id inner join Variant V on D.Variant_Id=V.Variant_ID inner join Vehicle_City_Master C on c.VehicleCity_Id=FR.Rto_cd  where V.Variant_ID >0 and Rto_cd>0', function (err, recordset) {
            if (err) {
                console.error(err);
            }
            // send records as a response
            var vehicle_details = require('../models/vehicle_detail');
            vehicle_details.remove({}, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    var fastlane_schema = {
                        "FastlaneResponse": "Fastlane_Response",
                        "Variant_Id": "Variant_ID",
                        "Model_ID": "Model_ID",
                        "Fuel_ID": "Fuel_ID",
                        "Make_Name": "Make_Name",
                        "Model_Name": "Model_Name",
                        "Fuel_Type": "Fuel_Name",
                        "Seating_Capacity": "Seating_Capacity",
                        "Cubic_Capacity": "Cubic_Capacity",
                        "Manufacture_Year": "Generation_Year",
                        "Registration_Number": "Regn_No",
                        "Chassis_Number": "Chasis_no",
                        "Engin_Number": "Eng_no",
                        "Registration_Date": "Regn_dt",
                        "FastLaneId": "FastLane_Id",
                        "Purchase_Date": "Purchase_dt",
                        "VehicleCity_Id": "Rto_cd",
                        "RTO_Code": "Rto_cd",
                        "RTO_Name": "RTO_City",
                        "Variant_Name": "Variant_Name"
                    };
                    var arrFastlane = [];
                    for (var k in recordset.recordset) {
                        var objFastlane = {};
                        objFastlane['Vehicle_Detail_Id'] = parseInt(k) + 1;
                        for (var k1 in fastlane_schema) {
                            var mngKey = fastlane_schema[k1];
                            if (k1.includes('_Date')) {
                                objFastlane[k1] = moment(recordset.recordset[k][mngKey], "DD/MM/YYYY").format('DD/MM/YYYY');
                            } else {
                                objFastlane[k1] = isNaN(recordset.recordset[k][mngKey]) ? recordset.recordset[k][mngKey] : (recordset.recordset[k][mngKey] - 0);
                            }
                        }
                        arrFastlane.push(objFastlane);
                    }
                    console.log('data pushed');
                    var syncFastlaneSummary = {
                        'Count_Push': arrFastlane.length,
                        'Count_Saved': 0,
                        //'Record' : arrPosp[0],
                        'Status': ''
                    };
                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                        // Get the collection
                        var colPosps = db.collection('vehicle_details');
                        colPosps.insertMany(arrFastlane, function (err, r) {
                            if (err) {
                                syncFastlaneSummary.Status = err;
                            } else {
                                syncFastlaneSummary.Count_Saved = r.insertedCount;
                                syncFastlaneSummary.Status = 'SUCCESS';
                            }
                            var msg = '<!DOCTYPE html><html><head><title>FastLane Report</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                            msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">Error&nbsp;Details</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                            for (var k3 in syncFastlaneSummary) {
                                msg += '<tr><td  width="20%" style="font-size:14px;font-family:tahoma;background-color: #ffcc00">' + k3 + '</td><td  width="78%" style="font-family:tahoma;font-size:14px;">' + syncFastlaneSummary[k3] + '&nbsp;</td></tr>';
                            }
                            msg += '</table></div><br><br>';
                            var Email = require('../models/email');
                            var objModelEmail = new Email();
                            var sub = '[' + config.environment.name.toString().toUpperCase() + '-' + ((syncFastlaneSummary.Count_Saved > 0) ? 'INFO' : 'ERR') + ']';
                            var today = moment().format("D-MMM-YYYY");
                            sub += 'FASTLANE_SYNC_MONGO::' + today.toString();
                            objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, msg, '', '');
                            res.json(syncFastlaneSummary);
                            db.close();
                        });
                    });
                }
            });
            //res.send(recordset);
        });
    });
});

router.post('/vehicle_info', function (req, res, next) {
    console.log('Start', 'FastLane');
    var objRequestCore = req.body;
    var Base = require(appRoot + '/libs/Base');
    var objBase = new Base();
    var Client = require('../models/client');
    Client.findOne({"Secret_Key": objRequestCore.secret_key, "Client_Unique_Id": objRequestCore.client_key}, function (err, client) {
        if (err) {
            res.send(err);
        }
        if (client) {
            var clientDetails = client;
            console.log("Client_Details", clientDetails);
            objBase.client_id = clientDetails.Client_Id;
            //objBase.service_log_unique_id = objRequestCore.api_reference_number;//where do we get this from and what's use
            objBase.response_object = res;
            objBase.vehicle_info(objRequestCore.RegistrationNumber.toString().toUpperCase());
        } else {
            res.json({'Msg': 'Not Authorized'});
        }
        console.log('Finish', 'FastLane');
    });
    console.log('Waiting', 'FastLane');
});

router.get('/vehicle_info_eligibility/:registration_number/:cubic_capacity?/:insurer_id?/:product_id?', function (req, res, next) {
    try {
        let RegistrationNumber = req.params['registration_number'] ? req.params['registration_number'] : '';
        let InsurerId = (req.params['insurer_id'] && req.params['insurer_id'] - 0) ? req.params['insurer_id'] - 0 : 0;
        let ProductId = (req.params['product_id'] && req.params['product_id'] - 0) ? req.params['product_id'] - 0 : 0;
        let CubicCapacity = (req.params['cubic_capacity'] && req.params['cubic_capacity'] - 0) ? req.params['cubic_capacity'] - 0 : 0;
        this.InsurerId = InsurerId;
        this.ProductId = ProductId;
        this.CubicCapacity = CubicCapacity;
        this.Registration_Number = RegistrationNumber;
        if (RegistrationNumber !== '') {
            var Rtos_Insurer = require('../models/rtos_insurer');
            RegistrationNumber = reg_no_format(RegistrationNumber);
            RegistrationNumber = RegistrationNumber.split('-');
            var ud_cond = {'Insurer_ID': InsurerId, 'Insurer_Rto_Code': RegistrationNumber[0] + RegistrationNumber[1]};
            Rtos_Insurer.findOne(ud_cond, function (err, dbRtoData) {
                try {
                    if (err) {
                        res.json({
                            Status: 'Error',
                            Msg: err
                        });
                    } else {
                        if (dbRtoData && dbRtoData._doc) {
                            var args = {
                                data: {
                                    "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                                    "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                                    "RegistrationNumber": Registration_Number,
                                    "product_id": 10,
                                    "ss_id": 0,
                                    "source": "2.0"
                                },
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            var url_api = config.environment.weburl + '/quote/vehicle_info';
                            var Client = require('node-rest-client').Client;
                            var client = new Client();
                            client.post(url_api, args, function (data, response) {
                                try {
                                    console.log(data);
                                    if (data && data.status && data.status === 'Success') {
                                        var regDate = moment((data.RegistrationDate), 'DD-MM-YYYY');
                                        var policyDate = moment().add(1, 'days');
                                        var diffInMinutes = policyDate.diff(regDate, 'years');
                                        if (data.RegistrationDate && diffInMinutes <= 15) {
                                            if (data.Vehicle_Class && data.Vehicle_Class === '2W') {
                                                var isCC = false;
                                                var CC = (data.Cubic_Capacity && isNaN(data.Cubic_Capacity) === false && (data.Cubic_Capacity - 0) > 0) ? (data.Cubic_Capacity - 0) : 0;
                                                var vehicle_cc_slab = 0;
                                                var arr_cc = [75, 150, 350, 3000];
                                                for (var k in arr_cc) {
                                                    if (CC < arr_cc[k]) {
                                                        vehicle_cc_slab = arr_cc[k];
                                                        break;
                                                    }
                                                }
                                                if (vehicle_cc_slab == CubicCapacity) {
                                                    isCC = true;
                                                }
                                                if (CC > 0 && isCC) {
                                                    var Vehicles_Insurer = require('../models/vehicles_insurer');
                                                    var ud_cond = {'Insurer_ID': InsurerId, 'Product_Id_New': ProductId, 'Insurer_Vehicle_Code': data.Variant_Id};
                                                    Vehicles_Insurer.findOne(ud_cond, function (err, dbRtoData) {
                                                        if (err) {
                                                            res.json({
                                                                Status: 'Error',
                                                                Msg: err
                                                            });
                                                        } else {
                                                            if (dbRtoData && dbRtoData._doc) {
                                                                res.json({
                                                                    Status: 'Success',
                                                                    Msg: 'Vehicle Eligible'
                                                                });
                                                            } else {
                                                                res.json({
                                                                    Status: 'Fail',
                                                                    Msg: 'Vehicle Not Mapped'
                                                                });
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    res.json({
                                                        Status: 'Fail',
                                                        Msg: 'Selected CC is wrong. Vehicle is ' + (data.Cubic_Capacity) + ' CC'
                                                    });
                                                }
                                            } else {
                                                res.json({
                                                    Status: 'Fail',
                                                    Msg: 'Selected vehicle number is belonged to wrong vehicle class.'
                                                });
                                            }
                                        } else {
                                            res.json({
                                                Status: 'Fail',
                                                Msg: 'Vehicle age is allowed only upto 15 Years for Two Wheeler.'
                                            });
                                        }
                                    } else {
                                        res.json({
                                            Status: 'Fail',
                                            Msg: 'Vehicle Info Service Data Not Available'
                                        });
                                    }
                                } catch (e) {
                                    res.json({
                                        Status: 'Error',
                                        Msg: e.stack
                                    });
                                }
                            });
                        } else {
                            res.json({
                                Status: 'Fail',
                                Msg: 'RTO Not Mapped'
                            });
                        }
                    }
                } catch (e) {
                    res.json({
                        Status: 'Error',
                        Msg: e.stack
                    });
                }
            });
        } else {
            res.json({
                Status: 'Fail',
                Msg: 'Please Provide Valid Registration Number or Insurer Id'
            });
        }
    } catch (e) {
        res.json({
            Status: 'Error',
            Msg: e.stack
        });
    }
});
router.post('/vehicle_info_eligibility', function (req, res, next) {
    try {
        let RegistrationNumber = req.body['registration_number'] ? req.body['registration_number'] : '';
        let app_version = req.body['app_version'] ? req.body['app_version'] : '2.0';
        let SS_ID = (req.body['ss_id'] && req.body['ss_id'] - 0) ? req.body['ss_id'] - 0 : 0;
        let Fba_Id = (req.body[''] && req.body['fba_id'] - 0) ? req.body['fba_id'] - 0 : 0;
        let ProductId = (req.body['product_id'] && req.body['product_id'] - 0) ? req.body['product_id'] - 0 : 0;
        let CubicCapacity = (req.body['cubic_capacity'] && req.body['cubic_capacity'] - 0) ? req.body['cubic_capacity'] - 0 : 0;
        let visitor_id = (req.body['visitor_id'] && req.body['visitor_id'] - 0) ? req.body['visitor_id'] - 0 : 0;
        this.SS_ID = SS_ID;
        this.Fba_Id = Fba_Id;
        this.visitor_id = visitor_id;
        this.ProductId = ProductId;
        this.CubicCapacity = CubicCapacity;
        this.Registration_Number = RegistrationNumber;
        this.app_version = app_version;
        if (RegistrationNumber !== '') {
            var args = {
                data: {
                    "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                    "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                    "RegistrationNumber": Registration_Number,
                    "product_id": 10,
                    "ss_id": SS_ID,
                    "source": app_version
                },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            var url_api = config.environment.weburl + '/quote/vehicle_info';
            var Client = require('node-rest-client').Client;
            var client = new Client();
            client.post(url_api, args, function (data, response) {
                try {
                    console.log(data);
                    if (data && data.status && data.status === 'Success') {
                        var regDate = moment((data.RegistrationDate), 'DD-MM-YYYY');
                        var policyDate = moment().add(1, 'days');
                        var diffInMinutes = policyDate.diff(regDate, 'years');
                        if (data.RegistrationDate && diffInMinutes <= 15) {
                            if (data.Vehicle_Class && data.Vehicle_Class === '2W') {

                                var CC = (data.Cubic_Capacity && isNaN(data.Cubic_Capacity) === false && (data.Cubic_Capacity - 0) > 0) ? (data.Cubic_Capacity - 0) : 0;
                                var vehicle_cc_slab = 0;
                                var arr_cc = [75, 150, 350, 3000];
                                for (var k in arr_cc) {
                                    if (CC < arr_cc[k]) {
                                        vehicle_cc_slab = arr_cc[k];
                                        break;
                                    }
                                }
                                this.Cubic_Capacity = CC;
                                if (CC > 0) {
                                    var args = {
                                        data: {
                                            'product_id': 10,
                                            'vehicle_id': data.VariantId ? data.VariantId : "0",
                                            'rto_id': data.CityofRegitrationId ? data.CityofRegitrationId : "0",
                                            'vehicle_insurance_type': "renew",
                                            'vehicle_registration_date': data.RegistrationDate ? moment(data.RegistrationDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "",
                                            'vehicle_manf_date': data.RegistrationDate ? moment(data.RegistrationDate, "DD-MM-YYYY").format("YYYY-MM") + "-01" : "",
                                            'policy_expiry_date': '', //moment().format("YYYY-MM-DD"),
                                            'prev_insurer_id': "1",
                                            'vehicle_registration_type': "individual",
                                            'vehicle_ncb_current': "0",
                                            'is_claim_exists': "yes",
                                            'method_type': "Premium",
                                            'execution_async': "yes",
                                            'electrical_accessory': 0,
                                            'non_electrical_accessory': 0,
                                            'registration_no': Registration_Number,
                                            'vehicle_reg_no': Registration_Number,
                                            'is_llpd': "no",
                                            'is_antitheft_fit': "no",
                                            'is_external_bifuel': "no",
                                            'is_aai_member': "no",
                                            'external_bifuel_type': "",
                                            'external_bifuel_value': 0,
                                            'pa_owner_driver_si': "0",
                                            'is_pa_od': "yes",
                                            'is_tppd': "yes",
                                            'is_having_valid_dl': "no",
                                            'is_opted_standalone_cpa': "yes",
                                            'chassis_number': data.Chassis_Number,
                                            'engine_number': data.Engin_Number,
                                            'pa_paid_driver_si': "0",
                                            'first_name': '',
                                            'last_name': "",
                                            'middle_name': "",
                                            'mobile': '',
                                            'email': '',
                                            'crn': "0",
                                            'visitor_id': visitor_id ? visitor_id : 0,
                                            'ss_id': SS_ID ? SS_ID : 0,
                                            'client_id': 2,
                                            'fba_id': Fba_Id ? Fba_Id : 0,
                                            'geo_lat': 0,
                                            'geo_long': 0,
                                            'agent_source': "quick_tw_journey",
                                            'ui_source': "quick_tw_journey",
                                            'app_version': app_version,
                                            'vehicle_insurance_subtype': "0CH_1TP",
                                            'secret_key': "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                                            'client_key': "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                                            'is_breakin': "yes",
                                            'is_inspection_done': "no",
                                            'is_policy_exist': "no",
                                            'is_financed': "no",
                                            'is_oslc': "no",
                                            'oslc_si': 0,
                                            'sub_fba_id': 0,
                                            'ip_city_state': "_",
                                            'is_fastlane_rto': "yes",
                                            'insurer_selected': '5,17,46,48',
                                            'utm_source': "quick_tw_journey"
                                        },
                                        headers: {
                                            "Content-Type": "application/json",
                                        }
                                    };
                                    var Client = require('node-rest-client').Client;
                                    var client = new Client();
                                    client.post(config.environment.weburl + '/quote/premium_initiate', args, function (data, response) {
                                        if (data && data.Summary && data.Summary.Request_Unique_Id) {
                                            setTimeout(function () {
                                                var args = {
                                                    data: {
                                                        'search_reference_number': data.Summary.Request_Unique_Id,
                                                        'secret_key': data.Request.secret_key,
                                                        'client_key': data.Request.client_key,
                                                    },
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    }
                                                };
                                                var Client = require('node-rest-client').Client;
                                                var client = new Client();
                                                client.post(config.environment.weburl + '/quote/premium_list_db', args, function (data, response) {
                                                    if (data.Msg === "Not Authorized") {
                                                        res.json({
                                                            Status: 'Fail',
                                                            Msg: 'Not Authorized'
                                                        });
                                                    } else {
                                                        if (data && data.Response && data.Response.length > 0) {
                                                            console.log(data);
                                                            console.log(data.Response);
                                                            let arrObjInsurer = [];
                                                            for (var ins in data.Response) {
                                                                if (data.Response[ins].Error_Code === "") {
                                                                    let objInsurer = {
                                                                        'Insurer_Id': data.Response[ins].Insurer_Id,
                                                                        'Service_Unique_Id': data.Response[ins].Service_Log_Unique_Id,
                                                                        'Request_Unique_Id': data.Summary.Request_Unique_Id,
                                                                        'Insurer_Logo_Name': data.Response[ins].Insurer.Insurer_Logo_Name,
                                                                        'Cubic_Capacity': Cubic_Capacity,
                                                                        'TP_Premium': data.Response[ins].Premium_Breakup.liability.tp_basic,
                                                                        'PAOD_Premium': data.Response[ins].Premium_Breakup.liability.tp_cover_owner_driver_pa,
                                                                        'TPPD_Premium': data.Response[ins].Premium_Breakup.liability.tp_cover_tppd,
                                                                        'Service_Tax': data.Response[ins].Premium_Breakup.service_tax,
                                                                        'Net_Premium': data.Response[ins].Premium_Breakup.net_premium,
                                                                        'Final_Premium': data.Response[ins].Premium_Breakup.final_premium

                                                                    };
                                                                    arrObjInsurer.push(objInsurer);
                                                                }
                                                            }
                                                            if (arrObjInsurer.length > 0) {
                                                                res.json({
                                                                    Status: 'Success',
                                                                    Msg: arrObjInsurer,
                                                                    Data: data
                                                                });
                                                            } else {
                                                                res.json({
                                                                    Status: 'Fail',
                                                                    Msg: 'Quotes not available'
                                                                });
                                                            }
                                                        } else {
                                                            res.json({
                                                                Status: 'Fail',
                                                                Msg: 'Quotes not available for selected vehicle registartion no'
                                                            });
                                                        }
                                                    }
                                                });
                                            }, 2000);//0 Second
                                        } else {
                                            res.json({
                                                Status: 'Fail',
                                                Msg: data
                                            });
                                        }
                                    });
                                } else {
                                    res.json({
                                        Status: 'Fail',
                                        Msg: 'Cubic Capacity is zero'
                                    });
                                }
                            } else {
                                res.json({
                                    Status: 'Fail',
                                    Msg: 'Selected vehicle number is belonged to wrong vehicle class.'
                                });
                            }
                        } else {
                            res.json({
                                Status: 'Fail',
                                Msg: 'Vehicle age is allowed only upto 15 Years for Two Wheeler.'
                            });
                        }
                    } else {
                        res.json({
                            Status: 'Fail',
                            Msg: 'Vehicle Info Service Data Not Available'
                        });
                    }
                } catch (e) {
                    res.json({
                        Status: 'Error',
                        Msg: e.stack
                    });
                }
            });
        } else {
            res.json({
                Status: 'Fail',
                Msg: 'Please Provide Valid Registration Number'
            });
        }
    } catch (e) {
        res.json({
            Status: 'Error',
            Msg: e.stack
        });
    }
});


router.post('/save_pg_log', function (req, res, next) {
    try {
        var objResponse = {
            "Proposal_Id": req.body['Proposal_Id'] - 0,
            "Pg_Get": req.body['pg_get'],
            "Pg_Post": req.body['pg_post'],
            "Pg_Url": req.body['pg_url'],
            "Referer": req.body['referer'],
            "PB_CRN": req.body['crn'] - 0,
            "User_Data_Id": req.body['user_data_id'] - 0,
            "Created_On": new Date()
        };
        req.body = JSON.parse(JSON.stringify(req.body));
        var request_str = JSON.stringify(req.body, undefined, 2);
        var Email = require('../models/email');
        var objModelEmail = new Email();
        var pg_return = 'PG';
        if (objResponse['Proposal_Id'] > 0) {
            pg_return += '_INFO';
            pg_return += (req.body['session'] === 'expired') ? '_EXP' : '_NOTEXP';
        } else {
            pg_return += '_ERR';
            pg_return += (req.body['session'] === 'expired') ? '_EXP' : '_NOTEXP';
        }
        var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + ((req.body['crn']) ? 'INFO' : 'ERR') + '][Proposal:' + req.body['Proposal_Id'] + ']' + ' ' + pg_return + ' CRN : ' + req.body['crn'];
        var today = moment().format('YYYY-MM-DD_HH:mm:ss');
        sub += ' :: ' + today.toString();
        var arr_to = [config.environment.notification_email];
        var arr_cc = [];
        var arr_bcc = [];
        var email_body = "PG_RETURN<br>-------------------<br>On : " + today + '<br><pre>' + request_str + '</pre>';
        var email_data = '<!DOCTYPE html><html><head><title>PG_RETURN_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
        email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">PG_RETURN_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
        email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">' + email_body + '&nbsp;</td></tr>';
        email_data += '</table></div><br></body></html>';
        objModelEmail.send('notifications@policyboss.com', arr_to.join(','), sub, email_data, arr_cc.join(','), arr_bcc.join(','), req.body['crn'] - 0);
        if (objResponse['Proposal_Id'] > 0) {
            let objProposal = {
                'Status': 'PGRETURN',
                'Payment_Response': req.body,
                'Modified_On': new Date()
            };
            var Proposal = require('../models/proposal');
            Proposal.update({'Proposal_Id': objResponse['Proposal_Id'], 'Payment_Response': {$exists: false}}, {$set: objProposal}, function (err, numAffected) {
                if (err) {
                    res.json({
                        'Status': 'FAIL',
                        'Detail': err
                    });
                } else {
                    res.json({
                        'Status': 'SUCCESS',
                        'Detail': '',
                        'Pg_Data_Id': objResponse['Proposal_Id']
                    });
                }

            });
        }

        var PgData = require('../models/pg_data');
        var objModelPgData = new PgData(objResponse);
        objModelPgData.save(function (err, objPgData) {
            if (err) {

            } else {

            }
        });
    } catch (e) {
        console.error('Pg_Data', e);
        res.json({'Msg': e});
    }
});
router.post('/agent_summary', function (req, res, next) {
    var objRequestCore = req.body;
    var objResponse = {
        'list': [],
        'error': ""
    };
    var Client = require('../models/client');
    try {
        var User_Data = require('../models/user_data');
        User_Data.find({"Premium_Request.ss_id": objRequestCore['ss_id'] - 0, 'Last_Status': "TRANS_SUCCESS_WITH_POLICY"}).exec(function (err, dbUser_Datas) {
            if (err) {
                res.send(err);
            } else {
                var agent_detail_list = [];
                for (var k in dbUser_Datas) {
                    agent_detail_list.push(dbUser_Datas[k]._doc);
                }
                objResponse['list'] = agent_detail_list;
                res.json(objResponse);
            }
        });
    } catch (e) {
        objResponse['Error'] = e.toString();
        res.json(objResponse);
    }
});
router.post('/save_aadhar_detail', function (req, res, next) {
    try {
        var objResponse = {
            "Aadhar_Number": parseInt(req.body['aadhar']),
            "Data": req.body['data'],
            "Created_On": new Date()
        };
        var AadharDetail = require('../models/aadhar_detail');
        var objModelAadharDetail = new AadharDetail(objResponse);
        objModelAadharDetail.save(function (err, objAadharDetail) {
            if (err) {
                res.json({'Msg': 'AadharDetail Inserted'});
            } else {
                res.json({'Msg': 'AadharDetail Insertion Failed'});
            }
        });
    } catch (e) {
        console.error('AadharDetail', e);
    }
});
router.post('/save_quote_lead', function (req, res, next) {
    var Base = require(appRoot + '/libs/Base');
    var objBase = new Base();
    var ack_no = objBase.randomString(8);
    ack_no = ack_no.toUpperCase();
    try {
        var objResponse = {
            "Name": req.body['name'],
            "Mobile": parseInt(req.body['mobile']),
            "Email": req.body['email'],
            "Registration_Number": req.body['reg_no'],
            "Rto": req.body['rto'],
            "Request_Log_Id": ack_no,
            "Created_On": new Date()
        };
        var QuoteLead = require('../models/quote_lead');
        var objModelQuoteLead = new QuoteLead(objResponse);
        objModelQuoteLead.save(function (err, objQuoteLead) {
            if (err) {
                res.json({'Msg': 'Failed'});
            } else {
                res.json({'Msg': ack_no});
            }
        });
    } catch (e) {
        console.error('QuoteLead', e);
    }
});
router.post('/save_customer_details', function (req, res, next) {
    try {
        console.log('save_customer_details', 'start', req.body);
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        var objRequestCore = req.body;
        objRequestCore = srn_arn_handler(objRequestCore);
        var srn = objRequestCore['search_reference_number'];
        var objData = {};
        var arrCustomerkey = ['first_name', 'middle_name', 'last_name', 'email', 'mobile'];
        for (var k in arrCustomerkey) {
            if (objRequestCore[arrCustomerkey[k]] !== '' && objRequestCore[arrCustomerkey[k]] !== null) {
                objData[arrCustomerkey[k]] = objRequestCore[arrCustomerkey[k]];
            }
        }
        if (srn) {
            var vehicle_id = 0;
            var User_Data = require('../models/user_data');
            User_Data.findOne({"Request_Unique_Id": srn}, function (err, dbUserData) {
                if (err) {

                } else {
                    if (dbUserData) {
                        var Premium_Request = dbUserData['Premium_Request'];
                        for (var k in objData) {
                            Premium_Request[k] = objData[k];
                        }

                        if (Premium_Request['channel'] === 'DIRECT' && (Premium_Request['product_id'] === 1 || Premium_Request['product_id'] === 10)) {
                            Premium_Request['is_mobile_verified'] = 'yes';
                        }
                        var ObjUser_Data = {
                            'Premium_Request': Premium_Request
                        };
                        objBase.dialer_lead_push(Premium_Request);
                        var User_Data = require('../models/user_data');
                        User_Data.update({'User_Data_Id': dbUserData._doc['User_Data_Id']}, {$set: ObjUser_Data}, function (err, numAffected) {
                            console.log('save_customer_details', 'user_data', err, numAffected);
                        });
                    }
                }
            });
            var Request = require('../models/request');
            Request.findOne({"Request_Unique_Id": srn}, function (err, dbRequest) {
                if (err) {

                } else {
                    if (dbRequest) {
                        var Request_Core = dbRequest['Request_Core'];
                        for (var k in objData) {
                            Request_Core[k] = objData[k];
                        }
                        var ObjRequest = {
                            'Request_Core': Request_Core
                        };
                        var Request = require('../models/request');
                        Request.update({'Request_Unique_Id': srn}, {$set: ObjRequest}, function (err, numAffected) {
                            console.log('save_customer_details', 'request', err, numAffected);
                        });
                        if (false && (Request_Core['product_id'] == 1 || Request_Core['product_id'] == 10 || Request_Core['product_id'] == 12)) {
                            if ((config.environment.name.toString().toUpperCase()) === 'LIVE') {
                                vehicle_id = Request_Core['vehicle_id'];
                                if (vehicle_id !== null && vehicle_id !== '') {
                                    var Vehicle = require('../models/vehicle');
                                    Vehicle.findOne({"Vehicle_ID": vehicle_id}, function (err1, dbRequest1) {
                                        if (err1) {

                                        } else {
                                            if (dbRequest1) {
                                                var customer_name = '';
                                                if (objData.hasOwnProperty('first_name')) {
                                                    customer_name = objData['first_name'];
                                                }
                                                if (objData.hasOwnProperty('middle_name')) {
                                                    customer_name = customer_name + ' ' + objData['middle_name'];
                                                }
                                                if (objData.hasOwnProperty('last_name')) {
                                                    customer_name = customer_name + ' ' + objData['last_name'];
                                                }
                                                if (objData.hasOwnProperty('email') && objData['email'] !== null && objData['email'] !== '')
                                                {
                                                    var email_data = '<html><body><h3>Hello ' + customer_name +
                                                            ',</h3><p>Name : ' + customer_name +
                                                            '</p><p>Mobile : ' + objData['mobile'] +
                                                            '</p><p>Email Id : ' + objData['email'] +
                                                            '</p><p>Vehicle : ' + dbRequest1['_doc']['Description'] +
                                                            '</p><p>Previous Policy Expiry Date : ' + Request_Core['policy_expiry_date'] +
                                                            '</p><p>UD Id : ' + Request_Core['udid'] +
                                                            '</p></body></html>';
                                                    var Email = require('../models/email');
                                                    var objModelEmail = new Email();
                                                    var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Customer Details';
                                                    objModelEmail.send('noreply@landmarkinsurance.co.in', objData['email'], sub, email_data, '', '', '');
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            });
            res.json({'Msg': 'Success'});
        } else {
            console.log('save_customer_details', 'srn_not_found', srn);
            res.json({'Msg': 'srn_not_found'});
        }
    } catch (e) {
        console.error('save_customer_details', e);
    }
});
router.post('/send_quote_link', function (req, res, next) {
    try {
        console.log('Start', this.constructor.name, 'send_quote_link');
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        var Client = require('../models/client');
        Client.findOne({"Secret_Key": objRequestCore.secret_key, "Client_Unique_Id": objRequestCore.client_key}, function (errClient, dbClient) {
            if (errClient) {
                res.send(errClient);
            } else if (dbClient) {
                var User_Data = require('../models/user_data');
                User_Data.findOne({"Request_Unique_Id": objRequestCore['search_reference_number']}, function (err, dbUserData) {
                    if (err) {
                        res.send(err);
                    } else {
                        dbUserData = dbUserData._doc;
                        var Premium_Request = dbUserData['Premium_Request'];
                        var product_name = dbUserData['Product_Id'] === 1 ? 'CarInsuranceIndia' : 'TwoWheelerInsurance';
                        var quote_url = config.environment.portalurl.toString();
                        //quote_url += product_name + '/QuotePageNew?SID=' + objRequestCore['search_reference_number'].toString() + '&ClientID=' + dbClient._doc.Client_Id.toString();
                        //http://www.policyboss.com/ASRCarContinuation?SID=SRN-FP5PDWNS-H1VV-XUW0-AELY-8X0C9GUDZA7J&ClientID=2
                        quote_url += '/ASRCarContinuation?SID=' + objRequestCore['search_reference_number'].toString() + '&ClientID=' + dbClient._doc.Client_Id.toString();
                        var Vehicle = require('../models/vehicle');
                        Vehicle.findOne({"Vehicle_ID": Premium_Request['vehicle_id']}, function (errVehicle, dbVehicle) {
                            if (errVehicle) {

                            } else {
                                var dbVehicle = dbVehicle._doc;
                                var _request = {
                                    '___product_name___': dbUserData['Product_Id'] === 1 ? 'Car' : 'Bike',
                                    '___make_model___': (dbVehicle['Make_Name'] + ' ' + dbVehicle['Model_Name']).toString().toTitleCase(),
                                    '___payment_link___': objRequestCore['payment_link'],
                                    '___agent_mobile___': objRequestCore['agent_mobile'],
                                    '___registration_no___': objRequestCore['registration_no'],
                                    '___phone_no___': objRequestCore['mobile']
                                };
                                if (objRequestCore.hasOwnProperty('email') && Premium_Request['email'] !== null && dbClient._doc.Client_Id !== 4 && false) {
                                    var emailto = "";
                                    var email_agent = objRequestCore['agent_email'].toString();
                                    var fs = require('fs');
                                    var email_data = fs.readFileSync(appRoot + '/resource/email/Send_Quote_Link.html').toString();
                                    if (dbClient._doc.Client_Id == 3) {
                                        email_data = fs.readFileSync(appRoot + '/resource/email/Send_Quote_Link_POSP.html').toString();
                                    }
                                    var sub = '[' + (config.environment.name.toString() === 'Production' ? (dbClient._doc.Client_Id == 2 ? 'PolicyBoss' : "Finmart") : config.environment.name.toString().toUpperCase()) + '] Payment Request for Customer' + dbUserData['PB_CRN'];
                                    email_data = email_data.replaceJson(_request);
                                    var Email = require('../models/email');
                                    var objModelEmail = new Email();
                                    objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, config.environment.notification_email, dbUserData['PB_CRN']);
                                }
                                //send sms
                                var smsMsg = "";
                                var ShortUrl = require('../models/short_url');
                                var objSmsUrl = new ShortUrl();
                                objSmsUrl.quote_link_sent(quote_url, _request);
                                //update status as PROPOSAL_LINK_SENT
                                var objUserData = {
                                    'Last_Status': null,
                                    'Status_History': null
                                };
                                var Status_History = (dbUserData.hasOwnProperty('Status_History')) ? dbUserData.Status_History : [];
                                var Last_Status = 'QUOTE_LINK_SENT';
                                Status_History.unshift({
                                    "Status": Last_Status,
                                    "StatusOn": new Date()
                                });
                                objUserData.Last_Status = Last_Status;
                                objUserData.Status_History = Status_History;
                                objUserData.Modified_On = new Date();
                                User_Data.update({'User_Data_Id': dbUserData.User_Data_Id}, objUserData, function (err, numAffected) {
                                    console.log('UserDataUpdated', err, numAffected);
                                    res.json({'Msg': 'Data saved', 'Id': dbUserData.User_Data_Id});
                                });
                            }
                        });
                    }
                });
            }
        });
        console.log('Finish', this.constructor.name, 'send_quote_link');
    } catch (e) {
        console.error('Exception', 'send_payment_link', e);
    }

});
router.post('/customer_data_0710_NIU', function (req, res, next) {
    return res.send('DENIED');
});
router.post('/send_policyboss_link', function (req, res, next) {
    try {
        console.log('Start', this.constructor.name, 'send_quote_link');
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        var Client = require('../models/client');
        Client.findOne({"Secret_Key": objRequestCore.secret_key, "Client_Unique_Id": objRequestCore.client_key}, function (errClient, dbClient) {
            try {
                if (errClient) {
                    res.send(errClient);
                } else if (dbClient) {
                    var site_url = config.environment.portalurl.toString();
                    var SmsLog = require('../models/sms_log');
                    var objSmsLog = new SmsLog();
                    var Msg = objSmsLog.siteLinkMsg({'___site_url___': site_url});
                    objSmsLog.send_sms(objRequestCore['mobile'], Msg, 'Site_Link');
                    res.json({'Msg': 'Sms Sent'});
                }
            } catch (ex) {
                res.json({'Msg': 'Error! ' + ex.toString()});
            }
        });
        console.log('Finish', this.constructor.name, 'send_quote_link');
    } catch (e) {
        console.error('Exception', 'send_payment_link', e);
        res.json({'Msg': e.toString()});
    }
});
router.get('/rilservice', function (req, res, next) {
    try {
        var is_authorized = false;
        if (req.headers.hasOwnProperty('token')) {
            if (req.headers['token'] == 'P0licyB0ss') {
                is_authorized = true;
            }
        }
        if (is_authorized) {
            var http = require('http');
            var fs = require('fs');
            var body = fs.readFileSync(appRoot + '/resource/request_file/ril_policy.xml').toString();
            body = body.replace('___vehicle_number___', req.query['vehicle_number']);
            var postRequest = {
                host: "xpas.reliancegeneral.co.in",
                path: "/RGI_ELITE_Service/RGICL_Policy_Service_ELITE.svc",
                method: "POST",
                "rejectUnauthorized": false,
                headers: {
                    'Cookie': "cookie",
                    'Content-Type': 'text/xml',
                    'Content-Length': Buffer.byteLength(body),
                    "SOAPAction": "http://RGICL_Policy_Service.ServiceContracts/22/2014/IRGICL_Policy_Service_ELITE/GetPolicyDetailforRSA"
                }
            };
            var buffer = "";
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
            var httpreq = http.request(postRequest, function (httpres) {
                console.log(httpres.statusCode);
                var buffer = "";
                httpres.on("data", function (data) {
                    buffer = buffer + data;
                });
                httpres.on("end", function (data) {
                    res.send(buffer);
                });
            });
            httpreq.on('error', function (e) {
                console.error('problem with request: ' + e.message);
                res.send(e);
            });
            httpreq.write(body);
            httpreq.end();
        } else {
            res.send('Un-Authorized');
        }
    } catch (e) {
        res.send(e);
    }
});
router.get('/starhealth_pincode/:pincode', function (request, response, next) {
    var https = require('https');
    console.log('Start', 'starhealth_pincode');
    var pincode = parseInt(request.params.pincode);
    var hostname = ((config.environment.name === 'Production') ? "ig.starhealth.in" : "igsan.starhealth.in");
    var apikey = ((config.environment.name === 'Production') ? "af2d561cd6644c34bb8fc61926da5e8f" : "53ab886c7c7e88d8e2f7a12872888b32");
    var secretkey = ((config.environment.name === 'Production') ? "5aedbe3f7f1048bd81b60a31ef2e011b" : "c68ba59148d7012f352e7efdadffd06f");
    var getPath = {
        host: hostname,
        path: "/api/policy/city/details?APIKEY=" + apikey + "&SECRETKEY=" + secretkey + "&pincode=" + pincode,
        method: "GET"
    };
    var req = https.get(getPath, function (res) {
        console.log("status ", res.statusCode);
        var body = "";
        res.on('data', function (data) {
            console.log('data came');
            body += data;
        });
        res.on('end', function () {
            var parse = {};
            if (body.includes('<')) {
                parse = body;
            } else {
                parse = JSON.parse(body);
            }
            console.log(body);
            response.send(body);
        });
    });
    req.on('error', function (e) {
        console.log('Problem with request: ' + e.message);
    });
});
router.get('/starhealth_area/:pincode/:city', function (request, response, next) {
    var https = require('https');
    console.log('Start', 'starhealth_area');
    var pincode = parseInt(request.params.pincode);
    var cityId = parseInt(request.params.city);
    var hostname = ((config.environment.name === 'Production') ? "ig.starhealth.in" : "igsan.starhealth.in");
    var apikey = ((config.environment.name === 'Production') ? "af2d561cd6644c34bb8fc61926da5e8f" : "53ab886c7c7e88d8e2f7a12872888b32");
    var secretkey = ((config.environment.name === 'Production') ? "5aedbe3f7f1048bd81b60a31ef2e011b" : "c68ba59148d7012f352e7efdadffd06f");
    var getPath = {
        host: hostname,
        path: "/api/policy/address/details?APIKEY=" + apikey + "&SECRETKEY=" + secretkey + "&pincode=" + pincode + "&city_id=" + cityId,
        method: "GET"
    };
    var req = https.get(getPath, function (res) {
        console.log("status ", res.statusCode);
        var body = "";
        res.on('data', function (data) {
            console.log('data came');
            body += data;
        });
        res.on('end', function () {
            var parse = {};
            if (body.includes('<')) {
                parse = body;
            } else {
                parse = JSON.parse(body);
            }
            console.log(body);
            response.send(body);
        });
    });
    req.on('error', function (e) {
        console.log('Problem with request: ' + e.message);
    });
});
router.get('/lvhealth_pincode/:pincode', function (request, response, next) {
    var http = ((config.environment.name === 'Production') ? require('https') : require('http'));
    var xml2js = require('xml2js');
    console.log('Start', 'liberty_pincode');
    var pincode = parseInt(request.params.pincode);
    var hostname = ((config.environment.name === 'Production') ? "api.libertyinsurance.in" : "168.87.83.118");
    var pathname = ((config.environment.name === 'Production') ? "/Health/Service.svc/ws_GetPinCode/" : "/HBWs_IMDPortal/Service.svc/ws_GetPinCode/");
    var getPath = {
        host: hostname,
        path: pathname + pincode,
        method: "GET"
    };
    var req = http.get(getPath, function (res) {
        console.log("status ", res.statusCode);
        var body = "";
        res.on('data', function (data) {
            console.log('data came');
            body += data;
        });
        res.on('end', function () {
            xml2js.parseString(body, {ignoreAttrs: true}, function (err, objXml2Json) {
                body = objXml2Json;
            });
            body = JSON.parse(body['string']);
            console.log(body);
            response.send(body);
        });
    });
    req.on('error', function (e) {
        console.error('Exception', 'lvhealth_pincode', e);
    });
});
function authenticateRoute(req, res, next) {
    var objRequestCore = req.body;
    var Client = require('../models/client');
    Client.findOne({"Secret_Key": objRequestCore.secret_key, "Client_Unique_Id": objRequestCore.client_key}, function (err, client) {
        if (err) {
            res.send(err);
        } else {
            if (client) {
                req.client = client;
                return next();
            } else {
                return res.status(401).json({'Msg': 'Not Authorized'});
            }
        }
    });
}
function validateCustomerEmail_Handler(obj_validation, req, res, next) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var objRequestCore = req.body;
    var sub = '';
    var email_data = '';
    var emailto = '';
    var Email = require('../models/email');
    var objModelEmail = new Email();
    if (req.User_Data['Product_Id'] === 5 || req.User_Data['Product_Id'] === 16 || req.User_Data['Product_Id'] === 17 || req.User_Data['Product_Id'] === 18 || req.User_Data['Product_Id'] === 4) {
        emailto = req.User_Data['Premium_Request']['email'].toString().toLowerCase();
    } else if (req.User_Data['Product_Id'] === 2 && req.User_Data['Premium_Request'].hasOwnProperty('health_policy_type')) {
        if (req.User_Data['Premium_Request']['health_policy_type'] === "renew" && req.User_Data['Premium_Response']['Member_details'][0]['email'] !== "") {
            emailto = req.User_Data['Premium_Response']['Member_details'][0]['email'].toString().toLowerCase();
        } else {
            emailto = "policybosstesting@gmail.com";
        }
    } else {
        emailto = req.User_Data['Proposal_Request']['email'].toString().toLowerCase();
        var customer_mobile = req.User_Data['Proposal_Request']['mobile'];
    }
    if (obj_validation['mobile_validation'] !== 'PENDING' &&
            obj_validation['regno_validation'] !== 'PENDING' &&
            obj_validation['enginechassis_validation'] !== 'PENDING' &&
            obj_validation['renewal_validation'] !== 'PENDING' &&
            obj_validation['proposal_list'] !== 'PENDING') {
        /*if (obj_validation['mobile_validation'] === 'FAIL') {
            sub = '[' + (config.environment.name.toString().toUpperCase()) + '][VALIDATION] MOBILE_REUSED , CRN : ' + objRequestCore['crn'];
            email_data = '<html><body><h2>More than 3 policies are not allowed to issued in last 3 month(s) through same mobile : ' + customer_mobile + '. Kindly provide different Mobile.</h2><p>Request</p><pre>' + JSON.stringify(objRequestCore, undefined, 2) + '</pre></p></body></html>';
            //objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
            return res.json({'Msg': 'More than 3 policies are not allowed to issued in last 3 month(s) through same mobile : ' + customer_mobile + '. Kindly provide different Mobile.', 'Status': 'VALIDATION'});
        }*/
//        if (obj_validation['regno_validation'] === 'FAIL') {
//            sub = '[' + (config.environment.name.toString().toUpperCase()) + '][VALIDATION] REGNO_REUSED , CRN : ' + objRequestCore['crn'];
//            email_data = '<html><body><h2>Policy is already issued on Vehicle Number in Last 9 Month(s). Kindly check.</h2><p>Request</p><pre>' + JSON.stringify(objRequestCore, undefined, 2) + '</pre></p></body></html>';
//            //objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
//            return res.json({'Msg': 'Policy is already issued on Vehicle Number. Kindly check.', 'Status': 'VALIDATION'});
//        }
        if (obj_validation['enginechassis_validation'] === 'FAIL') {
            sub = '[' + (config.environment.name.toString().toUpperCase()) + '][VALIDATION] ENGINE_CHASSIS_REUSED , CRN : ' + objRequestCore['crn'];
            email_data = '<html><body><h2>Policy is already issued on same engine or chassis Number in last 9 month(s). Kindly check.</h2><p>Request</p><pre>' + JSON.stringify(objRequestCore, undefined, 2) + '</pre></p></body></html>';
            //objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
            return res.json({'Msg': 'Policy is already issued on same engine or chassis Number in last 6 month(s). Kindly check.', 'Status': 'VALIDATION'});
        }
        if (objRequestCore['method_type'] === 'Proposal') {
//save proposal history start
            try {
                if (obj_validation['proposal_list'] === 'FAIL') {
                    sub = '[' + (config.environment.name.toString().toUpperCase()) + '][VALIDATION] PROPOSAL_SUBMIT_COUNT , CRN : ' + objRequestCore['crn'];
                    email_data = '<html><body><h2>Proposal is already submitted more than 15 times. Kindly check.</h2><p>Request</p><pre>' + JSON.stringify(objRequestCore, undefined, 2) + '</pre></p></body></html>';
                    objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                    return res.json({'Msg': 'Proposal is already submitted more than 15 times. Kindly search again with new CRN and generate payment link.', 'Status': 'VALIDATION'});
                } else {
                    let dbUserData = req.User_Data;
                    let objProposal = {
                        'Insurer_Id': objRequestCore['insurer_id'] - 0,
                        'Product_Id': dbUserData['Product_Id'],
                        'PB_CRN': dbUserData['PB_CRN'],
                        'User_Data_Id': dbUserData['User_Data_Id'],
                        'Ip_Address': (objRequestCore.hasOwnProperty('ip_address')) ? objRequestCore['ip_address'] : '',
                        'Premium': objRequestCore['final_premium'] - 0,
                        'Status': 'PENDING',
                        'Created_On': new Date()
                    };
                    var Proposal = require('../models/proposal');
                    var objModelProposal = new Proposal(objProposal);
                    objModelProposal.save(function (err, objDbProposal) {

                        if (err) {
                            console.error('Exception', 'Proposal_Save_Err', err);
                        } else {
                            objRequestCore['proposal_id'] = objDbProposal.Proposal_Id;
                            req.body = objRequestCore;
                            return next();
                        }
                    });
                }
            } catch (e) {
                console.error('Exception', 'ProposalHistorySave', e);
            }

            ///save proposal history finish
        } else {
            return next();
        }
    }
}
function validateCustomerEmail(req, res, next) {
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        objRequestCore = srn_arn_handler(objRequestCore);
        var User_Data = require('../models/user_data');
        var ud_cond = {'Request_Unique_Id': objRequestCore.search_reference_number};
        if (objRequestCore.udid > 0) {
            ud_cond = {"User_Data_Id": objRequestCore.udid - 0};
        }
        User_Data.findOne(ud_cond, function (err, dbUserData) {
            dbUserData = dbUserData._doc;
            req.User_Data = dbUserData;
            req.master = dbUserData.hasOwnProperty('Master_Details') ? dbUserData.Master_Details : {};
            req.master['proposals'] = [];



            // var sub = '[RESTRICTION]' + +' ADITYA_BIRLA_HEALTH  , CRN : ' + objRequestCore['crn'];
            // email_data = '<html><body><p>Customer Email : ' + objRequestCore['crn'] + '<br></p></body></html>';
            // var Email = require('../models/email');
            // var objModelEmail = new Email();
            //  objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
            //  return res.json({'Msg': 'This transaction belongs to discontinued Aditya Birla Health Product. Kindly create fresh quatation.<BR>CRN : ' + //objRequestCore['crn'], 'Status': 'VALIDATION'});

//check if agent or rm email is reused start
            if (dbUserData['Product_Id'] === 5 || dbUserData['Product_Id'] === 18) {
                var emailto = dbUserData['Premium_Request']['email'].toString().toLowerCase();
            } else {
                if (dbUserData.hasOwnProperty('Proposal_Request')) {
                    var emailto = dbUserData['Proposal_Request']['email'].toString().toLowerCase();
                }
            }
            if (objRequestCore.hasOwnProperty('customer_email')) {
                emailto = objRequestCore['customer_email'];
            }

            var email_agent = '';
            var email_rm = '';
            var mobile_agent = 0;
            var mobile_rm = 0;
            if (dbUserData['Product_Id'] === 5 || dbUserData['Product_Id'] === 18) {
                var mobile_customer = dbUserData['Premium_Request']['mobile'] - 0;
            } else {
                var mobile_customer = dbUserData['Proposal_Request']['mobile'];
            }
            let obj_validation = {
                'email_validation': 'PENDING',
                'mobile_validation': 'PENDING',
                'regno_validation': 'PENDING',
                'enginechassis_validation': 'PENDING',
                'renewal_validation': 'PENDING',
                'proposal_list': 'PENDING'
            };
            if (dbUserData.Premium_Request['ss_id'] > 0) {
                email_agent = (dbUserData.Premium_Request['posp_email_id'] !== null) ? dbUserData.Premium_Request['posp_email_id'].toString() : '';
                email_agent = email_agent.toLowerCase();
                objRequestCore['agent_mobile'] = (dbUserData.Premium_Request['posp_mobile_no'] !== null) ? dbUserData.Premium_Request['posp_mobile_no'].toString() : 0;
                mobile_agent = (dbUserData.Premium_Request['posp_mobile_no'] !== null) ? dbUserData.Premium_Request['posp_mobile_no'].toString() : 0;
                mobile_rm = (dbUserData.Premium_Request['posp_reporting_mobile_number'] !== null) ? dbUserData.Premium_Request['posp_reporting_mobile_number'].toString() : 0;
                objRequestCore['agent_name'] = dbUserData.Premium_Request['posp_first_name'].toString();
                if (dbUserData.Premium_Request['posp_last_name'] !== null) {
                    objRequestCore['agent_name'] += ' ' + dbUserData.Premium_Request['posp_last_name'].toString();
                }
            }
            if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== null && dbUserData.Premium_Request['posp_reporting_email_id'] !== 0) {
                if (dbUserData.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                    email_rm = dbUserData.Premium_Request['posp_reporting_email_id'].toString().toLowerCase();
                }
            }



            //check for agent email used as customer email
            if (emailto === email_agent || emailto === email_rm) {
                var sub = '[' + (config.environment.name.toString().toUpperCase()) + ']' + ((emailto === email_agent) ? 'AGENT' : 'RM') + '_EMAIL_USED , CRN : ' + objRequestCore['crn'];
                email_data = '<html><body><p>Customer Email : ' + emailto + '<br>Agent Email : ' + email_agent + '<br>RM Email : ' + email_rm + '<br></p></body></html>';
                var Email = require('../models/email');
                var objModelEmail = new Email();
                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                if (emailto === email_agent) {
                    return res.json({'Msg': 'POSP or CSE email can not be used for Customer Email. Kindly provide different EmailId.<BR>CRN : ' + objRequestCore['crn'], 'Status': 'VALIDATION'});
                }
                if (emailto === email_rm) {
                    return res.json({'Msg': 'RM\'s email can not be used for Customer Email. Kindly provide different EmailId.<BR>CRN : ' + objRequestCore['crn'], 'Status': 'VALIDATION'});
                }
            } else {
                obj_validation['email_validation'] = 'PASS';
            }

            if (mobile_customer === mobile_agent || mobile_customer === mobile_rm) {
                var sub = '[' + (config.environment.name.toString().toUpperCase()) + ']' + ((mobile_customer === mobile_agent) ? 'AGENT' : 'RM') + '_MOBILE_USED , CRN : ' + objRequestCore['crn'];
                email_data = '<html><body><p>Customer Mobile : ' + emailto + '<br>Agent Mobile : ' + email_agent + '<br>RM Mobile : ' + email_rm + '<br></p></body></html>';
                var Email = require('../models/email');
                var objModelEmail = new Email();
                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                if (mobile_customer === mobile_agent) {
                    return res.json({'Msg': 'POSP or CSE Mobile Number can not be used for Customer Mobile.<br> Kindly provide different Mobile.<BR>CRN : ' + objRequestCore['crn'], 'Status': 'VALIDATION'});
                }
                if (mobile_customer === mobile_rm) {
                    return res.json({'Msg': 'RM\'s mobile can not be used for Customer Mobile.<br> Kindly provide different Mobile.<BR>CRN : ' + objRequestCore['crn'], 'Status': 'VALIDATION'});
                }
            }

            //check if agent or rm email is reused finish

            req.body['customer_email'] = emailto;
            if ([1, 10, 12].indexOf(dbUserData['Product_Id']) > -1) {
                if (dbUserData['Premium_Request']['vehicle_insurance_type'] === "renew") {
                    obj_validation['regno_validation'] = 'PENDING';
                }
                if (dbUserData['Premium_Request']['vehicle_insurance_type'] === "new") {
                    obj_validation['regno_validation'] = 'PASS';
                }

                if (objRequestCore['method_type'] === 'Proposal' && (objRequestCore['engine_number'] !== "" || objRequestCore['chassis_number'] !== "")) {
                    obj_validation['enginechassis_validation'] = 'PENDING';
                } else {
                    obj_validation['enginechassis_validation'] = 'PASS';
                }

            } else {
                obj_validation['enginechassis_validation'] = 'PASS';
                obj_validation['regno_validation'] = 'PASS';
                obj_validation['renewal_validation'] = 'PASS';
            }

            if (emailto === 'policybosstesting@gmail.com' || objRequestCore['method_type'] === 'Proposal') {
                obj_validation['email_validation'] = 'PASS';
            }

            var today = moment().utcOffset("+05:30").startOf('Day');
            var fromDate = null;
            var arrFpg_order_responserom = null;
            var dateFrom = null;
            var toDate = moment(today).format("YYYY-MM-D");
            var arrTo = toDate.split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);
            if (obj_validation['regno_validation'] === 'PASS' && obj_validation['email_validation'] === 'PASS' && obj_validation['enginechassis_validation'] === 'PASS') {
                validateCustomerEmail_Handler(obj_validation, req, res, next);
            }
            if (obj_validation['renewal_validation'] === 'PENDING') {
                var toDateRenewal = moment(today).subtract(9, 'months').format("YYYY-MM-D");
                var arrToRenewal = toDateRenewal.split('-');
                var dateToRenewal = new Date(arrToRenewal[0] - 0, arrToRenewal[1] - 1, arrToRenewal[2] - 0);
                var fromDateRenewal = moment(today).subtract(14, 'months').format("YYYY-MM-D");
                var arrFromRenewal = fromDateRenewal.split('-');
                var dateFromRenewal = new Date(arrFromRenewal[0] - 0, arrFromRenewal[1] - 1, arrFromRenewal[2] - 0);
                var User_Data = require(appRoot + '/models/user_data');
                var reg_no = dbUserData.Proposal_Request['registration_no_1'] + '-' + dbUserData.Proposal_Request['registration_no_2'] + '-' + dbUserData.Proposal_Request['registration_no_3'] + '-' + dbUserData.Proposal_Request['registration_no_4'];
                var ud_cond = {
                    "Erp_Qt_Request_Core.___registration_no___": reg_no,
                    "Modified_On": {"$gte": dateFromRenewal, "$lte": dateToRenewal},
                    "Last_Status": {$in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}
                };
                User_Data.findOne(ud_cond, function (err, dbUserData) {
                    if (err) {
                        res.send(err);
                    } else {
                        console.error('LOG', 'validateCustomerEmail', dbUserData, ud_cond);
                        if (dbUserData) {
                            dbUserData = dbUserData._doc;
                            req.body['renewal_crn_udid'] = dbUserData['PB_CRN'] + '_' + dbUserData['User_Data_Id'];
                            obj_validation['renewal_validation'] = 'PASS';
                        } else {
                            obj_validation['renewal_validation'] = 'FAIL';
                        }
                        validateCustomerEmail_Handler(obj_validation, req, res, next);
                    }
                });
            }
            if (obj_validation['mobile_validation'] === 'PENDING') {
                fromDate = moment(today).subtract(3, 'months').format("YYYY-MM-D");
                arrFrom = fromDate.split('-');
                dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 1, arrFrom[2] - 0);
                var User_Data = require(appRoot + '/models/user_data');
                var ud_cond = {
                    "Erp_Qt_Request_Core.___mobile___": mobile_customer,
                    "Modified_On": {"$gte": dateFrom, "$lte": dateTo},
                    "Last_Status": {$in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}
                };
                User_Data.count(ud_cond, function (err, dbUserDataCount) {
                    if (err) {
                        res.send(err);
                    } else {
                        console.error('LOG', 'validateCustomerEmail', emailto, dbUserDataCount, ud_cond);
                        if (dbUserDataCount > 3) {
                            obj_validation['mobile_validation'] = 'FAIL';
                        } else {
                            obj_validation['mobile_validation'] = 'PASS';
                        }
                        validateCustomerEmail_Handler(obj_validation, req, res, next);
                    }
                });
            }
            if (obj_validation['enginechassis_validation'] === 'PENDING') {
                fromDate = moment(today).subtract(9, 'months').format("YYYY-MM-D");
                arrFrom = fromDate.split('-');
                dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 1, arrFrom[2] - 0);
                var User_Data = require(appRoot + '/models/user_data');
                var ud_cond = {
                    "Erp_Qt_Request_Core.___engine_number___": objRequestCore['engine_number'],
                    "Erp_Qt_Request_Core.___chassis_number___": objRequestCore['chassis_number'],
                    "Modified_On": {"$gte": dateFrom, "$lte": dateTo},
                    "Last_Status": {$in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}
                };
                User_Data.count(ud_cond, function (err, dbUserDataCount) {
                    if (err) {
                        res.send(err);
                    } else {
                        console.error('LOG', 'validateCustomerEmail', emailto, dbUserDataCount, ud_cond);
                        if (dbUserDataCount > 0) {
                            obj_validation['enginechassis_validation'] = 'FAIL';
                        } else {
                            obj_validation['enginechassis_validation'] = 'PASS';
                        }
                        validateCustomerEmail_Handler(obj_validation, req, res, next);
                    }
                });
            }
            if (obj_validation['proposal_list'] === 'PENDING') {

                let Proposal = require('../models/proposal');
                let proposal_cond = {
                    "Insurer_Id": objRequestCore['insurer_id'] - 0,
                    "User_Data_Id": objRequestCore['udid'],
                    "Status": objRequestCore['insurer_id'] === "16" ? {$in: ['EXCEPTION', 'PROPOSAL', 'PENDING']} : 'PROPOSAL',
                    "Insurer_Transaction_Identifier": {$exists: true}
                };
                console.error('DBG', "Proposal_List", proposal_cond);
                Proposal.find(proposal_cond).select(['Proposal_Id', 'Insurer_Transaction_Identifier', 'Service_Log_Id', 'Service_Log_Unique_Id']).sort({'Proposal_Id': -1}).exec(function (err, dbProposals) {
                    if (err) {
                        res.send(err);
                    } else {
                        if (dbProposals.length > 0) {
                            if (dbProposals.length < 16) {
                                let arr_proposal = [];
                                for (let k in dbProposals) {
                                    arr_proposal.push(dbProposals[k]._doc);
                                }
                                req.master['proposals'] = arr_proposal;
                                obj_validation['proposal_list'] = 'PASS';
                                if (objRequestCore['insurer_id'] === "16" && dbProposals[0]._doc.Insurer_Transaction_Identifier.includes("first_call")) {
                                    req.body['is_call_time'] = dbProposals[0]._doc.Insurer_Transaction_Identifier;
                                }
                            } else {
                                obj_validation['proposal_list'] = 'FAIL';
                            }
                        } else {
                            obj_validation['proposal_list'] = 'PASS';
                        }
                        validateCustomerEmail_Handler(obj_validation, req, res, next);
                    }
                });
            }
            if (obj_validation['regno_validation'] === 'PENDING') {
                fromDate = moment(today).subtract(9, 'months').format("YYYY-MM-D");
                arrFrom = fromDate.split('-');
                dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 1, arrFrom[2] - 0);
                var User_Data = require(appRoot + '/models/user_data');
                var reg_no = dbUserData.Proposal_Request['registration_no_1'] + '-' + dbUserData.Proposal_Request['registration_no_2'] + '-' + dbUserData.Proposal_Request['registration_no_3'] + '-' + dbUserData.Proposal_Request['registration_no_4'];
                var ud_cond = {
                    "Erp_Qt_Request_Core.___registration_no___": reg_no,
                    "Modified_On": {"$gte": dateFrom, "$lte": dateTo},
                    "Last_Status": {$in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}
                };
                User_Data.count(ud_cond, function (err, dbUserDataCount) {
                    if (err) {
                        res.send(err);
                    } else {
                        console.error('LOG', 'validateCustomerEmail', emailto, dbUserDataCount, ud_cond);
                        if (dbUserDataCount > 0) {
                            obj_validation['regno_validation'] = 'FAIL';
                        } else {
                            obj_validation['regno_validation'] = 'PASS';
                        }
                        validateCustomerEmail_Handler(obj_validation, req, res, next);
                    }
                });
            }
        });
        //
    } catch (e) {
        console.error('Exception', 'validateCustomerEmail', e);
    }
}
router.get('/aws_build_qa', function (req, res, next) {
    try {
        console.log('Start', this.constructor.name, 'aws_build_qa');
        var SmsLog = require('../models/sms_log');
        var objSmsLog = new SmsLog();
        var Msg = 'AWS_QA_BUILD\n=========\n' + moment().format('YYYY-MM-DDTHH:mm:ss');
        objSmsLog.send_sms('9619160851', Msg, 'Aws_Build');
        res.json({'Msg': 'Sms Sent'});
        console.log('Finish', this.constructor.name, 'send_quote_link');
    } catch (e) {
        console.error('Exception', 'send_payment_link', e);
        res.json({'Msg': e.toString()});
    }
});
function srn_arn_handler(objRequestCore) {
    try {
        //console.error('Log','SRNDBG',typeof objRequestCore,objRequestCore);
        objRequestCore = JSON.parse(JSON.stringify(objRequestCore));
        //email process
        var arr_capital_key = ["email", "first_name", "last_name", "middle_name", "pan", "permanent_address_1", "permanent_address_2", "permanent_address_3", "permanent_pincode", "communication_address_1", "communication_address_2", "communication_address_3", "nominee_name", "nominee_first_name", "nominee_last_name", "lm_agent_name"];
        for (var k1 in arr_capital_key) {
            var k = arr_capital_key[k1];
            if (objRequestCore.hasOwnProperty(k) && objRequestCore[k] !== null) {
                if (k.indexOf('email') > -1) {
                    objRequestCore[k] = objRequestCore[k].toString().toLowerCase();
                } else {
                    objRequestCore[k] = objRequestCore[k].toString().toUpperCase();
                }
            }
        }
        //email process

        if (objRequestCore.hasOwnProperty('search_reference_number')) {
            objRequestCore.search_reference_number = unescape(objRequestCore.search_reference_number);
            if (objRequestCore.search_reference_number.indexOf('_') > -1) {
                var arr_srn = objRequestCore.search_reference_number.split('_');
                objRequestCore.search_reference_number = arr_srn[0];
                objRequestCore.udid = arr_srn[1] - 0;
            }
        }
        if (objRequestCore.hasOwnProperty('api_reference_number')) {
            objRequestCore.api_reference_number = unescape(objRequestCore.api_reference_number);
            if (objRequestCore.api_reference_number.indexOf('_') > -1) {
                var arr_arn = objRequestCore.api_reference_number.split('_');
                //console.error('arn_handler', arr_arn);
                objRequestCore.api_reference_number = arr_arn[0];
                objRequestCore.slid = arr_arn[1] - 0;
                objRequestCore.udid = arr_arn[2] - 0;
            }
        }

        if (objRequestCore.hasOwnProperty('udid')) {
            objRequestCore.udid = objRequestCore.udid - 0;
        }
        if (objRequestCore.hasOwnProperty('slid')) {
            objRequestCore.slid = objRequestCore.slid - 0;
        }


    } catch (e) {
        console.error('Exception', 'srn_arn_handler', e, objRequestCore);
    }
    return objRequestCore;
}
router.get('/getPincodes', function (req, res) {
    var cache_key = 'pincodes';
    if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
        var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
        var obj_cache_content = JSON.parse(cache_content);
        res.json(obj_cache_content);
    } else {
        var Pincode = require('../models/pincode');
        Pincode.find({}, function (err, Pin) {
            if (err)
                res.send(err);
            fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(Pin), function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            res.json(Pin);
        });
    }
});
router.post('/send_email_link', function (req, res, next) {
    var objResponse = req.body;
    var To = objResponse['To'];
    var From = objResponse['From'];
    var Subject = objResponse['Subject'];
    var Msg = objResponse['messageBody'];
    try {
        var Email = require('../models/email');
        var objModelEmail = new Email();
        objModelEmail.send(From, To, Subject, Msg, '', '');
        res.json({'Msg': 'Email Sent'});
    } catch (e) {
        console.error('Exception', 'send_email_link', e);
        res.json({'Msg': 'Email Not Sent'});
    }

});
router.post('/hdfcergo_breakin_data', function (req, res2, next) {
    var not_verified_result = JSON.parse(JSON.stringify(req.body));
    var UD_Id = not_verified_result['udid'] - 0;
    var PB_CRN = not_verified_result['PB_CRN'] - 0;
    var Status = not_verified_result['Status'];
    var Proposal_Number = not_verified_result['PGTransNo'];
    var Agent_Code = not_verified_result['AgentCode'];
    console.log('Proposal_Number :', Proposal_Number, '- Agent_Code :', Agent_Code);
    var args = {
        AgentCode: Agent_Code,
        PGTransNo: Proposal_Number //'MT1902048737T'
    };
    var callingService = '';
    if (config.environment.name.toString() === 'Production')
    {
        callingService = 'https://hewspool.hdfcergo.com/motorcp/service.asmx?WSDL';
    } else {
        callingService = 'http://202.191.196.210/uat/onlineproducts/newmotorcp/service.asmx?WSDL';
    }
    var Error_Msg = '';
    var soap = require('soap');
    var xml2js = require('xml2js');
    soap.createClient(callingService, function (err, client) {
        client['GetBreakinInspectionStatus'](args, function (err1, result, raw, soapHeader) {
            if (err1) {
                console.error('HDFCErgoMotor', 'service_call', 'exception', err1);
                var objResponseFull = {
                    'err': err1,
                    'result': result,
                    'raw': raw,
                    'soapHeader': soapHeader,
                    'objResponseJson': null
                };
                console.error('HDFCErgo Check BreakInStatus service response :', objResponseFull);
            } else
            {
                var objResponseJson = {};
                var objResponseJsonLength = Object.keys(result).length;
                var processedXml = 0;
                for (var key in result)
                {
                    var keyJsonObj = JSON.parse('{"' + key + '":{}}');
                    Object.assign(objResponseJson, keyJsonObj);
                    xml2js.parseString(result[key], function (err2, objXml2Json) {
                        processedXml++;
                        if (err2) {
                            console.error('HDFCErgoMotor', 'service_call', 'xml2jsonerror', err2);
                            var objResponseFull = {
                                'err': err2,
                                'result': result,
                                'raw': raw,
                                'soapHeader': soapHeader,
                                'objResponseJson': null
                            };
                            console.error('HDFCErgo BreakInStatus - xml2js Exception :', objResponseFull);
                        } else {
                            objResponseJson[key] = objXml2Json;
                            if (processedXml === objResponseJsonLength) {
                                var objResponseFull = {
                                    'result': result,
                                    'raw': raw,
                                    'soapHeader': soapHeader,
                                    'objResponseJson': objResponseJson
                                };
                                //log
                                var today = moment().utcOffset("+05:30");
                                var today_str = moment(today).format("YYYYMMD");
                                var objRequest = {
                                    'dt': today.toLocaleString(),
                                    'req': Proposal_Number,
                                    'resp': objResponseJson
                                };
                                fs.appendFile(appRoot + "/tmp/log/hdfc_inspection_response_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    console.log("The file was saved!");
                                });
                                //log
                                if (objResponseJson.hasOwnProperty('GetBreakinInspectionStatusResult')) {
                                    if (objResponseJson['GetBreakinInspectionStatusResult'].hasOwnProperty(['BreakinDTO'])) {
                                        if (objResponseJson['GetBreakinInspectionStatusResult']['BreakinDTO'].hasOwnProperty(['BreakInStatus'])) {
                                            var hdfcergo_breakin_status = '';
                                            var user_data_status = '';
                                            var email_template = '';
                                            var email_sub_status = '';
                                            var insurer_inspection_status = objResponseJson['GetBreakinInspectionStatusResult']['BreakinDTO']['BreakInStatus']['0'];
                                            if (insurer_inspection_status === 'RECOMMENDED' || insurer_inspection_status === 'NOT RECOMMENDED' || insurer_inspection_status === 'ISSUED')
                                            {
                                                if (insurer_inspection_status === 'RECOMMENDED') {
                                                    hdfcergo_breakin_status = 'INSPECTION_APPROVED';
                                                    user_data_status = 'INSPECTION_APPROVED';
                                                    email_template = 'Send_Inspection_Status.html';//'Send_Successful_Inspection.html';
                                                    email_sub_status = 'Successful';
                                                }
                                                if (insurer_inspection_status === 'NOT RECOMMENDED') {
                                                    hdfcergo_breakin_status = 'INSPECTION_REJECTED';
                                                    user_data_status = 'INSPECTION_REJECTED';
                                                    email_template = 'Send_UnSuccessful_Inspection.html';
                                                    email_sub_status = 'Unsuccessful';
                                                }
                                                if (insurer_inspection_status === 'ISSUED') {
                                                    hdfcergo_breakin_status = 'POLICY_ISSUED';
                                                    user_data_status = 'INSPECTION_POLICY_ISSUED';
                                                    email_template = '';
                                                    email_sub_status = '';
                                                }
                                                var hdfcergo_breakin_db = require(appRoot + '/models/hdfcergo_breakin');
                                                var date = new Date();
                                                var myquery = {Proposal_Number: Proposal_Number};
                                                var newvalues = {$set: {Status: hdfcergo_breakin_status, Modified_On: date}};
                                                hdfcergo_breakin_db.updateOne(myquery, newvalues, function (err, numaffected) {
                                                    if (err) {
                                                        throw err;
                                                    } else {
                                                        console.log("HDFCErgo : BreakInStatus Updated for:Verified", Proposal_Number);
                                                        console.log("HDFCErgo : UD_Id : ", UD_Id);
                                                    }
                                                });
                                                if (insurer_inspection_status === 'ISSUED') {
                                                    var myquery = {
                                                        'PB_CRN': PB_CRN,
                                                        'Proposal_Number': {'$ne': Proposal_Number}
                                                    };
                                                    var newvalues = {$set: {Status: 'CLOSED', Modified_On: date}};
                                                    hdfcergo_breakin_db.update(myquery, newvalues, {multi: true}, function (err, numaffected) {
                                                        if (err) {
                                                            throw err;
                                                        } else {
                                                            console.log("HDFCErgo : BreakInStatus Updated for:Verified", Proposal_Number);
                                                            console.log("HDFCErgo : UD_Id : ", UD_Id);
                                                        }
                                                    });
                                                }

                                                try {
                                                    var User_Data = require(appRoot + '/models/user_data');
                                                    var ud_cond = {
                                                        "User_Data_Id": UD_Id,
                                                        'Last_Status': {"$nin": ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}
                                                    };
                                                    User_Data.findOne(ud_cond, function (err, dbUserData) {
                                                        if (err) {
                                                            console.error('Exception', err);
                                                        } else {
                                                            if (dbUserData) {
                                                                dbUserData = dbUserData._doc;
                                                                var objUserData = {
                                                                    'Last_Status': null,
                                                                    'Status_History': null
                                                                };
                                                                var Status_History = (dbUserData.hasOwnProperty('Status_History')) ? dbUserData.Status_History : [];
                                                                Status_History.unshift({
                                                                    "Status": user_data_status,
                                                                    "StatusOn": new Date()
                                                                });
                                                                objUserData.Last_Status = user_data_status;
                                                                objUserData.Status_History = Status_History;
                                                                objUserData.Modified_On = new Date();
                                                                User_Data.update({'User_Data_Id': dbUserData.User_Data_Id}, {$set: objUserData}, function (err, numAffected) {
                                                                    console.log('UserDataUpdated', err, numAffected);
                                                                });
                                                                var dataObj = dbUserData['Proposal_Request_Core'];
                                                                var payment_link = '';
                                                                var inspection_status_msg = '';
                                                                var short_url = '';
                                                                if (insurer_inspection_status === 'RECOMMENDED' && Status === 'INSPECTION_SCHEDULED' && hdfcergo_breakin_status === 'INSPECTION_APPROVED') {
                                                                    //payment_link = config.environment.portalurl.toString() + '/car-insurance/buynow/' + dbUserData['Premium_Request']['client_id'] + '/' + dbUserData['Service_Log_Unique_Id'] + '_' + dbUserData['Proposal_Request_Core']['slid'] + '_' + dbUserData['Proposal_Request_Core']['udid'] + '/NonPOSP/0';
                                                                    //payment_link = dbUserData['Payment_Request']['proposal_confirm_url'];
                                                                    payment_link = 'https://netinsure.hdfcergo.com/onlineproducts/MotorOnline/BreakIn/SearchQuote.aspx?QuoteNo=' + Proposal_Number;
                                                                    console.log("hdfcergo_breakin_data() payment_link : ", payment_link);
                                                                }
                                                                let Client1 = require('node-rest-client').Client;
                                                                let client1 = new Client1();
                                                                client1.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(payment_link), function (urlData, urlResponse) {
                                                                    if (insurer_inspection_status === 'RECOMMENDED' && urlData && urlData.Short_Url !== '') {
                                                                        inspection_status_msg = 'Your Vehicle Inspection has been done successfully. Payment Link is : ';
                                                                        short_url = urlData.Short_Url;
                                                                        console.log("hdfcergo_breakin_data() inspection_status_msg : ", inspection_status_msg, short_url);
                                                                    }
                                                                    if (insurer_inspection_status === 'NOT RECOMMENDED' && urlData && urlData.Short_Url !== '') {
                                                                        inspection_status_msg = 'Your Vehicle Inspection has been Rejected.';
                                                                        short_url = '';
                                                                        console.log("hdfcergo_breakin_data() inspection_status_msg : ", inspection_status_msg);
                                                                    }
                                                                    var objRequestCore = {
                                                                        'customer_name': dataObj['first_name'] + ' ' + dataObj['last_name'],
                                                                        'crn': dataObj['crn'],
                                                                        'vehicle_text': dataObj['vehicle_text'],
                                                                        'insurer_name': 'HDFC ERGO GENERAL INSURANCE COMPANY LTD.',
                                                                        'insurance_type': 'RENEW - Breakin Case',
                                                                        'inspection_id': Proposal_Number,
                                                                        'final_premium': dbUserData['Payment_Request']['pg_data']['TxnAmount'],
                                                                        'email_id': dataObj['email'],
                                                                        'registration_no': dbUserData.Proposal_Request['registration_no_1'] + '-' + dbUserData.Proposal_Request['registration_no_2'] + '-' + dbUserData.Proposal_Request['registration_no_3'] + '-' + dbUserData.Proposal_Request['registration_no_4'],
                                                                        'short_url': short_url,
                                                                        'inspection_status_msg': inspection_status_msg
                                                                    };
                                                                    var processed_request = {};
                                                                    for (var key in objRequestCore) {
                                                                        if (typeof objRequestCore[key] !== 'object') {
                                                                            processed_request['___' + key + '___'] = objRequestCore[key];
                                                                        }
                                                                    }
                                                                    console.error('Breakin Email', Status, hdfcergo_breakin_status);
                                                                    if ((insurer_inspection_status === 'RECOMMENDED' || insurer_inspection_status === 'NOT RECOMMENDED') && Status === 'INSPECTION_SCHEDULED' && hdfcergo_breakin_status === 'INSPECTION_APPROVED') {
                                                                        var email_data = fs.readFileSync(appRoot + '/resource/email/' + email_template).toString();
                                                                        email_data = email_data.replaceJson(processed_request);
                                                                        var emailto = dataObj['email'];
                                                                        var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification ' + email_sub_status + ' CRN : ' + dataObj['crn'];
                                                                        var Email = require(appRoot + '/models/email');
                                                                        var objModelEmail = new Email();
                                                                        var email_agent = '';
                                                                        if (dbUserData.Premium_Request['posp_email_id'] !== 0 && dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                                                            email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                                                                        }
                                                                        var arr_bcc = [config.environment.notification_email];
                                                                        if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
                                                                            if (dbUserData.Premium_Request['posp_reporting_email_id'] !== 0 && dbUserData.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                                                                arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                                                            }
                                                                        }
                                                                        if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] !== 0 && dbUserData['Premium_Request']['posp_sub_fba_email'] !== null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
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
                                                                    }
                                                                    if (insurer_inspection_status === 'ISSUED') {
                                                                        var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification "' + insurer_inspection_status + '" CRN : ' + dbUserData['PB_CRN'];
                                                                        var Email = require(appRoot + '/models/email');
                                                                        var objModelEmail = new Email();
                                                                        var email_data = '<!DOCTYPE html><html><head><title>INSPECTION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                                        email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">INSPECTION_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                                                        email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;"><pre>';
                                                                        for (var k in objRequestCore) {
                                                                            email_data += k + ':' + objRequestCore[k] + '<br/>';
                                                                        }
                                                                        email_data += '</pre></td></tr>';
                                                                        email_data += '</table></div><br></body></html>';
                                                                        var arr_bcc = [config.environment.notification_email];
                                                                        objModelEmail.send('noreply@policyboss.com', 'notifications@policyboss.com', sub, email_data, '', arr_bcc.join(','), dbUserData['PB_CRN']);
                                                                    }
                                                                });
                                                            }

                                                        }
                                                    });
                                                } catch (ex2) {
                                                    console.error('Exception in hdfcergo_breakin_data() for User_Data db details : ', ex2);
                                                }
                                            } else {
                                                if (insurer_inspection_status !== '' && insurer_inspection_status !== 'CASE NOT DONE') {
                                                    Error_Msg = JSON.stringify(objResponseFull);
                                                    /*var hdfcergo_breakin = require(appRoot + '/models/hdfcergo_breakin');
                                                     var date = new Date();
                                                     var myquery = {Proposal_Number: Proposal_Number};
                                                     var newvalues = {$set: {Status: insurer_inspection_status, Modified_On: date}};
                                                     hdfcergo_breakin.updateOne(myquery, newvalues, function (err, res) {
                                                     if (err) {
                                                     throw err;
                                                     } else {
                                                     //res2.json(res);
                                                     console.log("HDFCErgo : BreakInStatus Updated for:Issued", Proposal_Number);
                                                     }
                                                     });
                                                     */

                                                    var User_Data = require(appRoot + '/models/user_data');
                                                    var ud_cond = {"User_Data_Id": UD_Id};
                                                    User_Data.findOne(ud_cond, function (err, dbUserData) {
                                                        if (err) {
                                                            console.error('Exception', err);
                                                        } else {


                                                            dbUserData = dbUserData._doc;
                                                            var dataObj = dbUserData['Proposal_Request_Core'];
                                                            var objRequestCore = {
                                                                'customer_name': dataObj['first_name'] + ' ' + dataObj['last_name'],
                                                                'crn': dataObj['crn'],
                                                                'vehicle_text': dataObj['vehicle_text'],
                                                                'insurer_name': 'HDFC ERGO GENERAL INSURANCE COMPANY LTD.',
                                                                'insurance_type': 'RENEW - Breakin Case',
                                                                'inspection_id': Proposal_Number,
                                                                'final_premium': dbUserData['Payment_Request']['pg_data']['TxnAmount'],
                                                                'email_id': dataObj['email'],
                                                                'registration_no': dbUserData.Proposal_Request['registration_no_1'] + '-' + dbUserData.Proposal_Request['registration_no_2'] + '-' + dbUserData.Proposal_Request['registration_no_3'] + '-' + dbUserData.Proposal_Request['registration_no_4'],
                                                                'insurer_inspection_status': insurer_inspection_status
                                                            };
                                                            var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification "' + insurer_inspection_status + '" CRN : ' + dbUserData['PB_CRN'];
                                                            var Email = require(appRoot + '/models/email');
                                                            var objModelEmail = new Email();
                                                            var email_data = '<!DOCTYPE html><html><head><title>INSPECTION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                            email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">INSPECTION_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                                            email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;"><pre>';
                                                            for (var k in objRequestCore) {
                                                                email_data += k + ':' + objRequestCore[k] + '<br/>';
                                                            }
                                                            email_data += '</pre></td></tr>';
                                                            email_data += '</table></div><br></body></html>';
                                                            objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', dbUserData['PB_CRN']);
                                                        }
                                                    });
                                                }
                                                console.error('HDFCErgo : BreakInStatus for', Proposal_Number, ':', objResponseJson['GetBreakinInspectionStatusResult']['BreakinDTO']['BreakInStatus']['0']);
                                            }
                                        } else {
                                            Error_Msg = JSON.stringify(objResponseFull);
                                            console.error('HDFCErgo : GetBreakinInspectionStatusResult.BreakinDTO.BreakInStatus node not found');
                                        }
                                    } else {
                                        Error_Msg = JSON.stringify(objResponseFull);
                                        console.error('HDFCErgo : GetBreakinInspectionStatusResult.BreakinDTO node not found');
                                    }
                                } else {
                                    Error_Msg = JSON.stringify(objResponseFull);
                                    console.error('HDFCErgo : GetBreakinInspectionStatusResult node not found');
                                }
                            }
                        }
                    });
                }
            }
        });
    });
    res2.json({'Status': 'Initiated'});
});
router.post('/photos_upload_hr', function (req, res) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var path = appRoot + "/tmp/HR_Photo/";
    var objRequestCore = req.body;
    var uid = objRequestCore.uid;
    var photo_file_name = uid + '.png';
    var img1 = decodeURIComponent(objRequestCore.img1);
    try {
        if (fs.existsSync(path + uid)) {
            photo_file_name = uid + '_new.png';
            console.log(uid + ' - Folder Already Exist');
            var data = img1.replace(/^data:image\/\w+;base64,/, "");
            if (data === "") {
                res.json({'msg': 'Something Went Wrong'});
            } else {
                var buf = new Buffer(data, 'base64');
                fs.writeFile(path + uid + '/' + photo_file_name, buf);
            }
            //res.json({'msg': 'Success'});
        } else {
            fs.mkdirSync(path + uid);
            console.log(uid + ' - Folder Created');
            var data = img1.replace(/^data:image\/\w+;base64,/, "");
            if (data === "") {
                res.json({'msg': 'Something Went Wrong'});
            } else {
                var buf = new Buffer(data, 'base64');
                fs.writeFile(path + uid + '/' + photo_file_name, buf);
            }
            //res.json({'msg': 'Success'});
        }
        var pdf_web_path_horizon = config.environment.weburl + "/HR_Photo/" + uid + "/" + photo_file_name;
        var email_data = '<html><body>' +
                '<p></p>UD Id : ' + uid +
                '<p></p>Photo  : ' + pdf_web_path_horizon +
                '</body></html>';
        var Email = require('../models/email');
        var objModelEmail = new Email();
        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Photo Upload';
        objModelEmail.send('noreply@landmarkinsurance.co.in', config.environment.notification_email, sub, email_data, '', '', '');
    } catch (err) {

        console.log(err);
    }
});
router.post('/update_inspection_status', function (req, res, next) {
    console.log('Start', 'update_inspection_status');
    var crn = req.body.crn;
    var srn = req.body.srn;
    var inspectValue = req.body.inspectValue;
    var Last_Status = '';
    var Inspection_Remarks = '';
    if (inspectValue === 'Reinspect') {
        Last_Status = 'INSPECTION_REINSPECTION';
        if (req.body.hasOwnProperty('remarks')) {
            Inspection_Remarks = req.body.remarks;
        }
    } else if (inspectValue === 'Approve') {
        Last_Status = 'INSPECTION_APPROVED';
        if (req.body.hasOwnProperty('remarks')) {
            Inspection_Remarks = req.body.remarks;
        }
        //generate new inspection id
        //send mail to customer & agent
        //send proposal link to customer
        //start payment according to Insurer        
    } else if (inspectValue === 'Reject') {
        Inspection_Remarks = req.body.remarks;
        Last_Status = 'INSPECTION_REJECTED';
    } else {
        Last_Status = 'INSPECTION_EXCEPTION';
    }

    try {
        var User_Data = require('../models/user_data');
        var today = new Date();
        var myquery = {PB_CRN: crn, Last_Status: "INSPECTION_SUBMITTED"};
        var newvalues = '';
        if (inspectValue === 'Reject') {
            newvalues = {Last_Status: Last_Status, Inspection_Remarks: Inspection_Remarks, Modified_On: today}, {upsert: false, multi: false};
        } else if (inspectValue === 'Approve') {
            if (Inspection_Remarks !== "") {
                newvalues = {Last_Status: Last_Status, "Premium_Request.is_inspection_done": "yes", Modified_On: today, Inspection_Remarks: Inspection_Remarks}, {upsert: false, multi: false};
            } else {
                newvalues = {Last_Status: Last_Status, "Premium_Request.is_inspection_done": "yes", Modified_On: today};
            }
        } else {
            if (Inspection_Remarks !== "") {
                newvalues = {Last_Status: Last_Status, Inspection_Remarks: Inspection_Remarks, Modified_On: today}, {upsert: false, multi: false};
            } else {
                newvalues = {Last_Status: Last_Status, Modified_On: today};
            }
        }
        User_Data.updateOne(myquery, newvalues, function (err1, res1) {
            if (err1) {
                throw err1;
                //res.send(err1);
            } else {
                //res.json(res1);
                console.log("update_inspection_status Updated for : ", Last_Status, "CRN :", crn, (inspectValue === "Reject" ? "Rejection Remarks : " + Inspection_Remarks : ""));
                var ud_cond = {"PB_CRN": crn, Request_Unique_Id: srn};
                User_Data.findOne(ud_cond, function (err2, dbUserData) {
                    if (err2) {
                        throw err2;
                        //res.send(err2);
                        console.error('update_inspection_status find query Exception :', err2);
                    } else {
                        var insurer_name = '';
                        var insurer_id = dbUserData['_doc']['Insurer_Id'];
                        //var Insurer = require('../models/insurer');
                        /*Insurer.findOne({"Insurer_ID": insurer_id}, function (err3, dbPBInsurer) {
                         if (err3) {
                         console.error('update_inspection_status get insurer name by insurer_id Error :', err3);
                         } else {
                         if (dbPBInsurer) {
                         insurer_name = dbPBInsurer._doc.Insurer_Name;
                         } else {
                         console.error('update_inspection_status get insurer name by insurer_id Error : No Records found');
                         }
                         }
                         });*/
                        var fs = require('fs');
                        var responseStatus = 'pending';
                        if (inspectValue === 'Approve') {
                            if (insurer_id === 9) {
                                try {
                                    var Client = require('node-rest-client').Client;
                                    var client = new Client();
                                    var body = fs.readFileSync(appRoot + '/resource/request_file/Reliance_Car_Update_Lead.xml').toString();
                                    var Erp_Qt_Request_Core = dbUserData['_doc']['Erp_Qt_Request_Core'];
                                    body = body.replaceJson(Erp_Qt_Request_Core);
                                    var today = new Date();
                                    var dd = today.getDate();
                                    var mm = today.getMonth() + 1;
                                    var yyyy = today.getFullYear();
                                    var hh = today.getHours();
                                    var mn = today.getMinutes();
                                    var ss = today.getSeconds();
                                    if (dd < 10) {
                                        dd = '0' + dd;
                                    }
                                    if (mm < 10) {
                                        mm = '0' + mm;
                                    } else if (mm > 12) {
                                        mm = '01';
                                    }
                                    if (hh < 10) {
                                        hh = '0' + hh;
                                    }
                                    if (mn < 10) {
                                        mn = '0' + mn;
                                    }
                                    if (ss < 10) {
                                        ss = '0' + ss;
                                    }
                                    var inspection_date = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mn + ':' + ss;
                                    body = body.replace('___inspection_date___', inspection_date);
                                    body = body.replace('___inspection_id___', dbUserData['_doc']['Insurer_Transaction_Identifier']);
                                    var args = {
                                        data: body,
                                        headers: {"Content-Type": "text/xml"}
                                    };
                                    console.log("Update Lead Reliance BODY :: ", args['data']);
                                    var service_method_url = '';
                                    if (config.environment.name.toString() === 'Production') {
                                        service_method_url = '';
                                    } else {
                                        service_method_url = 'http://rgiclservices.reliancegeneral.co.in/Inspection_Lead_Production_UAT/Service.asmx?op=UpdateLead';
                                    }
                                    var parseString = require('xml2js').parseString;
                                    var objResponseJson = null;
                                    var objResponseData = null;
                                    var arrObjRespStatus = null;
                                    client.post(service_method_url, args, function (data, response) {
                                        objResponseData = data.toString();
                                        console.log(objResponseData);
                                        parseString(objResponseData, function (err, result) {
                                            if (err) {
                                                console.log("Reliance Self-Inspection Update Lead : Failed to parse : Exception : ", err);
                                            }
                                            objResponseJson = result;
                                            console.log(result);
                                        });
                                        if (objResponseJson['soap:Envelope']['soap:Body']['0']['UpdateLeadResponse']['0'].hasOwnProperty('UpdateLeadResult')) {
                                            var objResp = objResponseJson['soap:Envelope']['soap:Body']['0']['UpdateLeadResponse']['0']['UpdateLeadResult']['0'];
                                            var arrObjResp = objResp.split('|');
                                            arrObjRespStatus = arrObjResp[0].trim();
                                            if (arrObjRespStatus === '1') {
                                                responseStatus = "complete";
                                                console.log("Reliance Self-Inspection Update Lead Success");
                                            } else {
                                                responseStatus = "failed";
                                                console.log("Reliance Self-Inspection Update Lead Failure");
                                            }
                                        } else {
                                            responseStatus = "failed";
                                            console.log("Reliance Self-Inspection Update Lead - UpdateLeadResult - Node not found");
                                        }

                                        try {
                                            var queryObj = {
                                                PB_CRN: parseInt(crn),
                                                UD_Id: dbUserData['_doc']['User_Data_Id'],
                                                SL_Id: dbUserData['_doc']['Proposal_Request_Core']['slid'],
                                                Insurer_Id: 9,
                                                Request_Unique_Id: dbUserData['_doc']['Request_Unique_Id'],
                                                Service_Log_Unique_Id: dbUserData['_doc']['Service_Log_Unique_Id'],
                                                Inspection_Number: dbUserData['_doc']['Insurer_Transaction_Identifier'],
                                                Status: 'INSPECTION_APPROVED',
                                                Insurer_Request: args['data'],
                                                Insurer_Response: objResponseData,
                                                Service_Call_Status: responseStatus,
                                                Created_On: new Date(),
                                                Modified_On: ''
                                            };
                                            var MongoClient = require('mongodb').MongoClient;
                                            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                                                if (err)
                                                    throw err;
                                                var inspectionBreakins = db.collection('inspection_breakins');
                                                inspectionBreakins.insertOne(queryObj, function (err, res) {
                                                    if (err)
                                                        throw err;
                                                });
                                            });
                                            /*var inspectionBreakins = require('../models/inspection_breakin');
                                             inspectionBreakins.insertOne(queryObj, function (err, res) {
                                             if (err)
                                             throw err;
                                             });*/

                                            var inspection_status_msg = '';
                                            var sub = '';
                                            if (responseStatus === 'complete' && inspectValue === 'Approve') {
                                                sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Vehicle Inspection Approved CRN : ' + dbUserData['_doc']['Proposal_Request_Core']['crn'];
                                                inspection_status_msg = 'Your Vehicle Inspection has been done successfully. Payment Link is : ' + config.environment.portalurl.toString() + '/car-insurance/buynow/' + dbUserData['_doc']['Premium_Request']['client_id'] + '/' + dbUserData['_doc']['Service_Log_Unique_Id'] + '_' + dbUserData['_doc']['Proposal_Request_Core']['slid'] + '_' + dbUserData['_doc']['Premium_Request']['udid'] + '/NonPOSP/0';
                                                var dataObj = dbUserData['_doc']['Proposal_Request_Core'];
                                                var objRequestCore = {
                                                    'customer_name': dataObj['first_name'] + ' ' + dataObj['last_name'],
                                                    'crn': dataObj['crn'],
                                                    'vehicle_text': dataObj['vehicle_text'],
                                                    'insurer_name': insurer_name,
                                                    'insurance_type': 'RENEW - Breakin Case',
                                                    'inspection_id': dbUserData['_doc']['Insurer_Transaction_Identifier'],
                                                    'final_premium': Math.round(dbUserData['_doc']['Proposal_Request_Core']['final_premium']),
                                                    'email_id': dataObj['email'],
                                                    'registration_no': dataObj['registration_no'],
                                                    'inspection_status_msg': inspection_status_msg
                                                };
                                                var processed_request = {};
                                                for (var key in objRequestCore) {
                                                    if (typeof objRequestCore[key] !== 'object') {
                                                        processed_request['___' + key + '___'] = objRequestCore[key];
                                                    }
                                                }
                                                var email_data = fs.readFileSync(appRoot + '/resource/email/Send_Inspection_Status.html').toString();
                                                email_data = email_data.replaceJson(processed_request);
                                                var emailto = dataObj['email'];
                                                var Email = require(appRoot + '/models/email');
                                                var objModelEmail = new Email();
                                                var email_agent = '';
                                                if (dbUserData._doc.Premium_Request['posp_email_id'] !== null && dbUserData._doc.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                                    email_agent = dbUserData._doc.Premium_Request['posp_email_id'].toString();
                                                }
                                                var arr_bcc = [config.environment.notification_email];
                                                if (dbUserData._doc.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData._doc.Premium_Request['posp_reporting_email_id'] != '' && dbUserData._doc.Premium_Request['posp_reporting_email_id'] != null) {
                                                    if (dbUserData._doc.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                                        arr_bcc.push(dbUserData._doc.Premium_Request['posp_reporting_email_id']);
                                                    }
                                                }
                                                if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] != null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
                                                    arr_bcc.push(dbUserData['Premium_Request']['posp_sub_fba_email']);
                                                }
                                                if (config.environment.name === 'Production') {
                                                    if ((dbUserData._doc.Premium_Request['posp_sources'] - 0) > 0) {
                                                        if ((dbUserData._doc.Premium_Request['posp_sources'] - 0) === 1) {
                                                            arr_bcc.push('transactions.1920@gmail.com'); //finmart-dc 
                                                        }
                                                    }
                                                }
                                                objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), dataObj['crn']);
                                                res.json({'msg': 'Mail Sent Successfully'});
                                            } else {
                                                res.json({'msg': 'Service Failed to Approve'});
                                            }
                                        } catch (e) {
                                            console.error('Exception reliance_inspection_update inspection_breakins', e);
                                        }
                                    });
                                } catch (ex) {
                                    console.error('Exception reliance_inspection_update', ex);
                                    res.send({'msg': 'Mail Failure'});
                                }
                            }
                        }

                        if (inspectValue === 'Reinspect' || inspectValue === 'Reject') {
                            var inspection_status_msg = '';
                            var sub = '';
                            if (inspectValue === 'Reinspect') {
                                sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Vehicle Inspection Re-inspection CRN : ' + dbUserData['_doc']['Proposal_Request_Core']['crn'];
                                if (Inspection_Remarks != "") {
                                    inspection_status_msg = 'Your Vehicle requires Reinspection. Reinspection Link is : ' + config.environment.portalurl + '/inspect_approve/inspect.html?ARN=' + dbUserData['_doc']['Service_Log_Unique_Id'] + '</BR>REMARKS : ' + Inspection_Remarks;
                                } else {
                                    inspection_status_msg = 'Your Vehicle requires Reinspection. Reinspection Link is : ' + config.environment.portalurl + '/inspect_approve/inspect.html?ARN=' + dbUserData['_doc']['Service_Log_Unique_Id'];
                                }

                            } else if (inspectValue === 'Reject') {
                                sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Vehicle Inspection Rejected CRN : ' + dbUserData['_doc']['Proposal_Request_Core']['crn'];
                                inspection_status_msg = 'Your Vehicle Inspection has been Rejected. REMARKS : ' + Inspection_Remarks;
                            }

                            var dataObj = dbUserData['_doc']['Proposal_Request_Core'];
                            var objRequestCore = {
                                'customer_name': dataObj['first_name'] + ' ' + dataObj['last_name'],
                                'crn': dataObj['crn'],
                                'vehicle_text': dataObj['vehicle_text'],
                                'insurer_name': insurer_name,
                                'insurance_type': 'RENEW - Breakin Case',
                                'inspection_id': dbUserData['_doc']['Insurer_Transaction_Identifier'],
                                'final_premium': Math.round(dbUserData['_doc']['Proposal_Request_Core']['final_premium']),
                                'email_id': dataObj['email'],
                                'inspection_status_msg': inspection_status_msg
                            };
                            var processed_request = {};
                            for (var key in objRequestCore) {
                                if (typeof objRequestCore[key] !== 'object') {
                                    processed_request['___' + key + '___'] = objRequestCore[key];
                                }
                            }
                            var email_data = fs.readFileSync(appRoot + '/resource/email/Send_Inspection_Status.html').toString();
                            email_data = email_data.replaceJson(processed_request);
                            var emailto = dataObj['email'];
                            var Email = require(appRoot + '/models/email');
                            var objModelEmail = new Email();
                            var email_agent = '';
                            if (dbUserData._doc.Premium_Request['posp_email_id'] !== null && dbUserData._doc.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                email_agent = dbUserData._doc.Premium_Request['posp_email_id'].toString();
                            }
                            var arr_bcc = [config.environment.notification_email];
                            if (dbUserData._doc.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData._doc.Premium_Request['posp_reporting_email_id'] != '' && dbUserData._doc.Premium_Request['posp_reporting_email_id'] != null) {
                                if (dbUserData._doc.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                    arr_bcc.push(dbUserData._doc.Premium_Request['posp_reporting_email_id']);
                                }
                            }
                            if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] != null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
                                arr_bcc.push(dbUserData['Premium_Request']['posp_sub_fba_email']);
                            }
                            if (config.environment.name === 'Production') {
                                if ((dbUserData._doc.Premium_Request['posp_sources'] - 0) > 0) {
                                    if ((dbUserData._doc.Premium_Request['posp_sources'] - 0) === 1) {
                                        arr_bcc.push('transactions.1920@gmail.com'); //finmart-dc 
                                    }
                                }
                            }
                            objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), dataObj['crn']);
                            res.json({'msg': 'Mail Sent Successfully'});
                        }
                    }
                });
            }
        });
    } catch (err) {
        console.log("Exception in update_inspection_status : ", err);
        res.send({'msg': 'Exception'});
    }
});
router.post('/save_img', function (req, res) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var path = appRoot + "/tmp/inspection/";
    var objRequestCore = req.body;
    var crn = objRequestCore.crn;
    var arn = objRequestCore.arn;
    var img1 = decodeURIComponent(objRequestCore.img1);
    var img2 = decodeURIComponent(objRequestCore.img2);
    var img3 = decodeURIComponent(objRequestCore.img3);
    var img4 = decodeURIComponent(objRequestCore.img4);
    var img5 = decodeURIComponent(objRequestCore.img5);
    var img6 = decodeURIComponent(objRequestCore.img6);
    var img7 = decodeURIComponent(objRequestCore.img7);
    var imgobj = {
        "img1": img1,
        "img2": img2,
        "img3": img3,
        "img4": img4,
        "img5": img5,
        "img6": img6,
        "img7": img7
    };
    function imageName(imgnumber) {
        var obj_imgname = [
            {'imgnum': 'img1', 'img_name': 'front_side'},
            {'imgnum': 'img2', 'img_name': 'right_side'},
            {'imgnum': 'img3', 'img_name': 'back_side'},
            {'imgnum': 'img4', 'img_name': 'left_side'},
            {'imgnum': 'img5', 'img_name': 'under_hood_with_engine'},
            {'imgnum': 'img6', 'img_name': 'chassis_number'},
            {'imgnum': 'img7', 'img_name': 'odometer'}
        ];
        var index = obj_imgname.findIndex(x => x.imgnum === imgnumber);
        if (index === -1) {
            return "Unkown";
        }
        return obj_imgname[index]['img_name'];
    }
    try {
        if (fs.existsSync(path + crn)) {
            console.log(crn + ' - Folder Already Exist');
            for (var i in imgobj) {
                var data = imgobj[i].replace(/^data:image\/\w+;base64,/, "");
                if (data === "") {
                    res.json({'msg': 'Something Went Wrong'});
                } else {
                    var buf = new Buffer(data, 'base64');
                    fs.writeFile(path + crn + '/' + imageName(i) + ' - new.png', buf);
                }
            }
        } else {
            fs.mkdirSync(path + crn);
            console.log(crn + ' - Folder Created');
            for (var i in imgobj) {
                var data = imgobj[i].replace(/^data:image\/\w+;base64,/, "");
                if (data === "") {
                    res.json({'msg': 'Something Went Wrong'});
                } else {
                    var buf = new Buffer(data, 'base64');
                    fs.writeFile(path + crn + '/' + imageName(i) + '.png', buf);
                }
            }
        }
        try {
            var User_Data = require('../models/user_data');
            var today = new Date();
            var myquery = {PB_CRN: crn, Service_Log_Unique_Id: arn};
            var newvalues = {Last_Status: "INSPECTION_SUBMITTED", Modified_On: today};
            User_Data.updateOne(myquery, newvalues, function (err1, res1) {
                if (err1) {
                    throw err1;
                    res.send(err1);
                } else {
                    res.json(res1);
                    console.log("save_img - Updated INSPECTION_SUBMITTED for", "CRN :", crn);
                }
            });
            try {
                var email_data = fs.readFileSync(appRoot + '/resource/email/Send_Breakin_Notification_Approver.html').toString();
                var emailto = '';
                var User_Data = require(appRoot + '/models/user_data');
                User_Data.findOne({PB_CRN: crn}, function (err, dbUserData) {
                    if (err) {
                        console.error('Exception in send notification mail to inspection approver', err);
                    } else {
                        var objRequestCore = {
                            'customer_name': dbUserData.Proposal_Request['first_name'] + ' ' + dbUserData.Proposal_Request['last_name'],
                            'crn': crn,
                            'udid': dbUserData.Proposal_Request_Core['udid'],
                            'vehicle_text': dbUserData.Proposal_Request_Core['vehicle_text'],
                            'insurance_type': 'RENEW - Breakin Case',
                            'inspection_id': dbUserData['Insurer_Transaction_Identifier'],
                            'final_premium': dbUserData.Proposal_Request_Core['final_premium'],
                            'registration_no': dbUserData.Proposal_Request['registration_no_1'] + '-' + dbUserData.Proposal_Request['registration_no_2'] + '-' + dbUserData.Proposal_Request['registration_no_3'] + '-' + dbUserData.Proposal_Request['registration_no_4']
                        };
                        var processed_request = {};
                        for (var key in objRequestCore) {
                            if (typeof objRequestCore[key] !== 'object') {
                                processed_request['___' + key + '___'] = objRequestCore[key];
                            }
                        }
                        email_data = email_data.replaceJson(processed_request);
                        var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Vehicle Inspection Photos uploaded CRN : ' + dbUserData['PB_CRN'];
                        var Email = require(appRoot + '/models/email');
                        var objModelEmail = new Email();
                        emailto = 'chirag.modi@policyboss.com';
                        objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, '', '', crn);
                    }
                });
            } catch (ex2) {
                console.error('Exception  in send notification mail to inspection approver', ex2);
            }
        } catch (e) {
            console.log("Failed to update after inspection photo upload : Exception : ", e);
        }
        res.json({'msg': 'success'});
    } catch (err) {
        console.log(err);
        res.json({'msg': 'error'});
    }
});
router.get('/get_inspection_images/:CRN', function (req, res) {
    var path = appRoot + "/tmp/inspection/";
    var crn = req.params['CRN'];
    var imgobj = null;
    try {
        if (fs.existsSync(path + crn)) {
            var imgPath = config.environment.downloadurl + "/inspection/" + crn;
            imgobj = {
                "img1": imgPath + "/front_side.png",
                "img2": imgPath + "/right_side.png",
                "img3": imgPath + "/back_side.png",
                "img4": imgPath + "/left_side.png",
                "img5": imgPath + "/under_hood_with_engine.png",
                "img6": imgPath + "/chassis_number.png",
                "img7": imgPath + "/odometer.png"
            };
            res.json({'msg': 'success', 'result': imgobj});
        } else {
            res.json({'msg': 'error'});
        }
    } catch (err) {
        console.log(err);
        res.json({'msg': 'error'});
    }
});
router.get('/gmc_employee_claim/:UDID', function (req, res) {

    var UDID = (req.params['UDID']);
    try {
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            var emp_gmc_claim = db.collection('emp_gmc_claim');
            //var emp_gmc_claim = require('../models/emp_gmc_claim');
            emp_gmc_claim.find({"UID": UDID}).toArray(function (err, dbEmployee_GMC_Claim) {
                if (err) {
                    throw err;
                } else {
                    res.json(dbEmployee_GMC_Claim);
                }

            });
        });
    } catch (err) {
        console.log(err);
        res.json({'msg': 'error'});
    }

});
//router.post('/global_assured', function (req, res) {
//    var ObjSummary = req.body;
//    var Client = require('node-rest-client').Client;
//    var client = new Client();
//    var URL = "http://13.67.94.159:81/api/rsa/IssueCertificate";
//    var CRN = ObjSummary.CRN;
//
//
//    try {
//        var User_Data = require('../models/user_data');
//        User_Data.findOne({"PB_CRN": CRN}, function (err, dbUserData) {
//            var LastStatus = dbUserData['Last_Status'];
//            console.log(dbUserData);
//            if (LastStatus == "TRANS_SUCCESS_WITH_POLICY") {
//                var arg = {
//                    "Product": ObjSummary.Product,
//                    "VehicleType": ObjSummary.VehicleType,
//                    "Make": ObjSummary.Make,
//                    "Model": ObjSummary.Model,
//                    "Plan": ObjSummary.Plan,
//                    "CertificateStartDate": ObjSummary.CertificateStartDate,
//                    "EngineNo": ObjSummary.EngineNo,
//                    "ChassisNo": ObjSummary.ChassisNo,
//                    "RegistrationNo": ObjSummary.RegistrationNo,
//                    "CustomerFirstName": ObjSummary.CustomerFirstName,
//                    "CustomerLastName": ObjSummary.CustomerLastName,
//                    "CustomerEmail": ObjSummary.CustomerEmail,
//                    "CustomerContact": ObjSummary.CustomerContact,
//                    "State": ObjSummary.State,
//                    "City": ObjSummary.City,
//                    "PermanentAddress": ObjSummary.PermanentAddress,
//                    "PermanentAddress2": ObjSummary.PermanentAddress2,
//                    "UserId": ObjSummary.UserId
//                }
//                client.get(URL, arg, function (data, response) {
//                    console.log(data);
//
//                });
//            }
//
//        });
//    } catch (err) {
//        console.log(err);
//        res.json({'msg': 'error'});
//    }
//});

router.post('/get_emp_gmc_year_data', function (req, res) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var objRequestCore = req.body;
    var udid = objRequestCore.udid;
    var year_data = objRequestCore.year;
    var emp_gmc_db = require(appRoot + '/models/emp_gmc');
    try {
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            var Employee_GMC = db.collection('emp_gmc');
            Employee_GMC.find({"UID": udid, "Year": year_data}).toArray(function (err, dbEmployee_GMC) {
                if (err) {
                    throw err;
                } else {
                    if (dbEmployee_GMC.length > 0) {
                        var year1 = dbEmployee_GMC[0]['Year'];
                        res.json(dbEmployee_GMC);
                    }

                }
            });
        });
    } catch (err) {

        console.log(err);
        res.json('Error');
    }
});
router.get('/get_ssid_by_uid/:uid', function (req, res) {
    var Employee = require('../models/employee');
    var uid = req.params['uid'] - 0;
    if (uid > 0) {
        Employee.findOne({"Emp_Code": uid}, function (err, dbEmployee) {
            if (dbEmployee) {
                dbEmployee = dbEmployee._doc;
                var obj_emp = {
                    'uid': dbEmployee['Emp_Code'],
                    'ss_id': dbEmployee['Emp_Id'],
                    'emp_name': dbEmployee['Emp_Name']
                };
                res.json(obj_emp);
            } else {
                res.send('ERR_NO_DETAIL');
            }
        });
    } else {
        res.send('ERR_NO_UID');
    }
}
);
router.get('/erp_insurer_master', function (req, res) {
    var cache_key = 'erp_insurer';
    if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
        var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
        var obj_cache_content = JSON.parse(cache_content);
        res.json(obj_cache_content);
    } else {
        var Insurerco_ID = require('../models/prev_insurer');
        Insurerco_ID.find({
            "Insurer_ID": 101
        }, function (insurer_err, dbPrev_Insurers) {
            let obj_erp_insurer = {};
            for (let k in dbPrev_Insurers) {
                obj_erp_insurer['INS_' + dbPrev_Insurers[k]._doc['PreviousInsurer_Id']] = dbPrev_Insurers[k]._doc;
            }
            fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(obj_erp_insurer), function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            res.json(obj_erp_insurer);
        });
    }
});
router.get('/erp_insurer_master', function (req, res) {
    var cache_key = 'erp_insurer';
    if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
        var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
        var obj_cache_content = JSON.parse(cache_content);
        res.json(obj_cache_content);
    } else {
        var Insurerco_ID = require('../models/prev_insurer');
        Insurerco_ID.find({
            "Insurer_ID": 101
        }, function (insurer_err, dbPrev_Insurers) {
            let obj_erp_insurer = {};
            for (let k in dbPrev_Insurers) {
                obj_erp_insurer['INS_' + dbPrev_Insurers[k]._doc['PreviousInsurer_Id']] = dbPrev_Insurers[k]._doc;
            }
            fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(obj_erp_insurer), function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            res.json(obj_erp_insurer);
        });
    }
});
router.get('/error_master', function (req, res) {
    var cache_key = 'error_master_' + moment().format('YYYYMMDD');
    if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
        var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
        var obj_cache_content = JSON.parse(cache_content);
        res.json(obj_cache_content);
    } else {
        var Error = require('../models/error');
        Error.find(function (err, dbErrors) {
            if (err) {
                res.json([]);
            } else {
                let arr_Error = [];
                for (let k in dbErrors) {
                    arr_Error.push(dbErrors[k]._doc);
                }
                fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(arr_Error), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                res.json(arr_Error);
            }
        });
    }
});
router.get('/fields/:Product_Id/:Insurer_Id', function (req, res) {
    let Product_Id = req.params.Product_Id.toString();
    let Insurer_Id = req.params.Insurer_Id.toString();
    var cache_key = 'fields_product_' + Product_Id + '_insurer_' + Insurer_Id;
    if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
        var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
        var obj_cache_content = JSON.parse(cache_content);
        res.json(obj_cache_content);
    } else {
        var search_condition = JSON.parse('{"Product_Id":"' + Product_Id + '","Insurer_ID":"' + Insurer_Id + '"}');
        var Field = require('../models/field');
        Field.find(search_condition, function (err, dbFields) {
            if (err) {
                res.json([]);
            } else {
                let arr_Field = [];
                for (let k in dbFields) {
                    arr_Field.push(dbFields[k]._doc);
                }
                fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(arr_Field), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                res.json(arr_Field);
            }
        });
    }
});
router.get('/cache/Insurer', function (req, res) {
    let cache_key = 'live_insurer';
    let is_cache = (req.query.hasOwnProperty('is_cache') && req.query['is_cache'] == 'no') ? false : true;
    if (is_cache && fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
        var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
        var obj_cache_content = JSON.parse(cache_content);
        res.json(obj_cache_content);
    } else {
        var Insurer = require('../models/insurer');
        Insurer.find({}, function (err, dbInsurers) {
            if (err) {
                return console.dir(err);
            }
            let InsurerMaster = {};
            for (var k in dbInsurers) {
                InsurerMaster['Insurer_' + dbInsurers[k]['Insurer_ID']] = dbInsurerItems[k];
            }
            fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(InsurerMaster), function (err) {
                if (err) {
                    return console.error(err);
                }
            });
        });
    }
});
router.get('/cache/product/:Product_Id', function (req, res) {
    let Product_Id = req.params.Product_Id.toString();
    let cache_key = 'product_' + Product_Id;
    Product_Id = Product_Id - 0;
    let is_cache = (req.query.hasOwnProperty('is_cache') && req.query['is_cache'] == 'no') ? false : true;
    if (is_cache && fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
        var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
        var obj_cache_content = JSON.parse(cache_content);
        res.json(obj_cache_content);
    } else {
        var arr_product_id = [Product_Id, 101];
        if (Product_Id === 10 || Product_Id === 12) {
            arr_product_id.push(1); // car product id
        }
        let search_product_condition = {
            "Product_Id": {
                "$in": arr_product_id
            }
        };
        var Product = require('../models/product');
        Product.find(search_product_condition, function (err, dbProducts) {
            if (err) {
                res.json([]);
            } else {
                let arr_product = [];
                for (let k in dbProducts) {
                    arr_product.push(dbProducts[k]._doc);
                }
                fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(arr_product), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                res.json(arr_product);
            }
        });
    }
});
router.post('/horizon_crn_create', function (req, res) {
    try {
        console.error('horizon_crn_create', req.body);
        var Crn = require('../models/crn');
        req.body = JSON.parse(JSON.stringify(req.body));
        var objCrn = req.body;
        objCrn.Crn_Request['crn'] = objCrn.Crn_Request['crn'] - 0;
        if (objCrn.Crn_Request['crn'] > 0) {
            Crn.update({'Crn_Id': objCrn.Crn_Request['crn']}, {$set: {'Crn_Request': objCrn.Crn_Request}}, function (err, numAffected) {
                console.log('UserDataCRNUpdate', err, numAffected);
            });
            res.send(objCrn.Crn_Request['crn'].toString());
        } else {
            objCrn['Created_On'] = new Date();
            var objModelCrn = new Crn(objCrn);
            objModelCrn.save(function (err, objDbCrn) {
                if (err) {
                    console.error('horizon_crn_create', 'crn_not_save', err);
                    res.send(err);
                } else {
                    var ObjUser_Data = {'PB_CRN': objDbCrn._doc.Crn_Id};
                    var User_Data = require('../models/user_data');
                    User_Data.update({'User_Data_Id': objCrn.User_Data_Id}, {$set: ObjUser_Data}, function (err, numAffected) {
                        console.log('UserDataCRNUpdate', err, numAffected);
                    });
                    var Crn_Id = objDbCrn._doc.Crn_Id;
                    res.send(Crn_Id.toString());
                }

            });
        }
    } catch (e) {
        console.error('horizon_crn_create', 'exception', e);
        res.send(e.stack);
    }
});
router.get('/go_digit_corona/:udid', function (req, res) {
    var user_data_id = parseInt(req.params.udid);
    var modify_date = new Date();
    var User_Data = require('../models/user_data');
    if (user_data_id > 0)
    {
        User_Data.find({'User_Data_Id': user_data_id}, function (err, objdata) {
            if (err)
            {
                res.json({'Msg': 'Error'});
            } else
            {
                var objCorona = require('../libs/CoronaCare');
                objdata[0]['_doc']['Premium_Request']['policy_start_date'] = objCorona.prototype.policy_start_date();
                objdata[0]['_doc']['Premium_Request']['policy_end_date'] = objCorona.prototype.policy_start_date();
                let Proposal_Request = objdata[0]['_doc']['Premium_Request'];
                let Erp_Qt_Request = objdata[0]['_doc']['Premium_Request'];
                let Erp_Qt_Request_Core = {};
                for (var i in Erp_Qt_Request)
                {
                    let node = '___' + i + '___';
                    Erp_Qt_Request_Core[node] = Erp_Qt_Request[i];
                }
                let dbUserData = objdata[0]['_doc'];
                var Status_History = (dbUserData.Status_History) ? dbUserData.Status_History : [];
                Status_History.unshift({
                    "Status": 'PROPOSAL_SUBMIT',
                    "StatusOn": new Date()
                });
                let Proposal_Request_Core = objdata[0]['_doc']['Premium_Request'];
                let myquery = {'User_Data_Id': user_data_id};
                let arg = {
                    'Erp_Qt_Request_Core': Erp_Qt_Request_Core,
                    'Proposal_Request_Core': Proposal_Request_Core,
                    'Proposal_Request': Proposal_Request
                };
                let newvalues = {
                    'Last_Status': 'PROPOSAL_SUBMIT',
                    'Modified_On': modify_date,
                    'Status_History': Status_History,
                    'Insurer_Id': 44,
                    $set: arg
                };
                try {
                    let objProposal = {
                        'Insurer_Id': 44,
                        'Product_Id': 17,
                        'PB_CRN': objdata[0]['_doc']['PB_CRN'],
                        'User_Data_Id': objdata[0]['_doc']['User_Data_Id'],
                        'Ip_Address': '',
                        'Premium': objdata[0]['_doc']['Premium_Request']['final_premium'] - 0,
                        'Status': 'PROPOSAL_SUBMIT',
                        'Created_On': new Date(),
                        'Modified_On': new Date()
                    };
                    var Proposal = require('../models/proposal');
                    var objModelProposal = new Proposal(objProposal);
                    objModelProposal.save(function (err, objDbProposal) {
                        if (err) {
                            console.error('Exception', 'Proposal_Save_Err', err);
                        } else {
                            return next();
                        }
                    });
                } catch (e) {
                    console.error('Exception', 'ProposalHistorySave', e);
                }
                User_Data.updateOne(myquery, newvalues, function (err1, updateData) {
                    if (err1)
                    {
                        console.log('UserDataUpdated', err, updateData);
                    } else
                    {
                        res.json({'Msg': 'Success'});
                    }


                });
            }
        });
    } else
    {
        res.json({'Msg': 'Data not found for User Data Id 0'});
    }
});
router.get('/proposal_submit_notification', function (req, res) {
    try {
        var Base = require(appRoot + '/libs/Base');
        var objBase = new Base();
        var User_Data = require('../models/user_data');
        User_Data.findOne({"User_Data_Id": objBase.lm_request['udid'] - 0}, function (err, dbUserData) {
            if (err) {

            } else {
                if (dbUserData) {
                    dbUserData = dbUserData._doc;
                    var agent_name = 'Direct Customer';
                    var agent_mobile = 0;
                    if (dbUserData.Premium_Request['ss_id'] > 0) {
                        agent_name = dbUserData.Premium_Request['posp_first_name'] + ' ' + dbUserData.Premium_Request['posp_last_name'];
                        agent_mobile = dbUserData.Premium_Request['posp_mobile_no'];
                    }
                    if (!isNaN(dbUserData.Premium_Request['lm_agent_mobile']) && dbUserData.Premium_Request['lm_agent_mobile'] > 0) {
                        agent_mobile = dbUserData.Premium_Request['lm_agent_mobile'];
                    }
                    if (dbUserData.Premium_Request['lm_agent_name'] != '') {
                        agent_name = dbUserData.Premium_Request['lm_agent_name'];
                    }
                    var SmsLog = require('../models/sms_log');
                    var objsmsLog = new SmsLog();
                    var obj_err_sms = {
                        '___business_source___': dbUserData.Premium_Request['client_name'],
                        '___crn___': dbUserData.Premium_Request['crn'],
                        '___product___': productName,
                        '___agent_name___': agent_name,
                        '___posp_sub_fba_name___': '',
                        '___posp_sub_fba_mobile_no___': 0,
                        '___agent_mobile___': agent_mobile,
                        '___first_name___': dbUserData.Premium_Request['first_name'],
                        '___last_name___': dbUserData.Premium_Request['last_name'],
                        '___mobile___': dbUserData.Premium_Request['mobile'],
                        '___final_premium___': dbUserData.Premium_Request['final_premium'],
                        '___method_type___': dbUserData.Premium_Request['method_type'],
                        '___insurerco_name___': clsProduct,
                        '___link_sent_on___': '',
                        '___proposal_attempt_cnt___': 0,
                        '___current_dt___': dt.toLocaleString()
                    };
                    if (dbUserData._doc['PB_CRN'] > 0) {
                        let Obj_Link = {
                            'Status': 'PROPOSAL',
                            'Modified_On': new Date()
                        };
                        var Link = require('../models/link');
                        Link.update({
                            'PB_CRN': dbUserData._doc['PB_CRN'],
                            'Insurer_Id': objBase.lm_request['insurer_id'] - 0
                        }, {$set: Obj_Link}, function (err, numAffected) {
                            //console.log('UserDataPolicyDataUpdate', err, numAffected);
                        });
                    }
                    var proposal_attempt_cnt = 0;
                    var link_sent_on = '';
                    var proposal_link_cnt = 0;
                    for (var k in dbUserData.Status_History) {
                        if (dbUserData.Status_History[k]['Status'] == 'PROPOSAL_LINK_SENT') {
                            proposal_link_cnt++;
                            if (link_sent_on == '') {
                                link_sent_on = (new Date(dbUserData.Status_History[k]['StatusOn'])).toLocaleString();
                            }
                        }
                        if (dbUserData.Status_History[k]['Status'] == 'PROPOSAL_SUBMIT') {
                            proposal_attempt_cnt++;
                        }
                    }
                    proposal_attempt_cnt++;
                    if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_id') && dbUserData['Premium_Request']['posp_sub_fba_id'] > 0) {
                        obj_err_sms['___posp_sub_fba_name___'] = dbUserData['Premium_Request']['posp_sub_fba_name'];
                        obj_err_sms['___posp_sub_fba_mobile_no___'] = dbUserData['Premium_Request']['posp_sub_fba_mobile_no'];
                    }


                    obj_err_sms['___link_sent_on___'] = link_sent_on;
                    obj_err_sms['___proposal_attempt_cnt___'] = proposal_attempt_cnt;
                    obj_err_sms['___proposal_link_cnt___'] = proposal_link_cnt;
                    obj_err_sms['___ip_address___'] = objBase.lm_request['ip_address'];
                    obj_err_sms['___proposal_id___'] = objBase.lm_request['proposal_id'];
                    var proposal_ack_data = objsmsLog.proposalSubmitAckMsg(obj_err_sms);
                    proposal_ack_data = proposal_ack_data.replace('SubFba: (Mob:0)\n', '');
                    if (objBase.lm_request['product_id'] == '2') {
                        //objsmsLog.send_sms('9833341817', proposal_ack_data, 'PROPOSAL_ACK_MSG', dbUserData['PB_CRN']);//Soman
                    }
                    if (agent_mobile > 0) {
                        objsmsLog.send_sms(agent_mobile, proposal_ack_data, 'PROPOSAL_ACK_MSG', dbUserData['PB_CRN']);
                    }
                    if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_mobile_no') && dbUserData['Premium_Request']['posp_sub_fba_mobile_no'] > 0) {
                        objsmsLog.send_sms(dbUserData['Premium_Request']['posp_sub_fba_mobile_no'], proposal_ack_data, 'PROPOSAL_ACK_MSG', dbUserData['PB_CRN']);
                    }
                    if ((dbUserData['Premium_Request']["posp_sources"] - 0) > 0) {

                    }
                    //email notification process
                    try {
                        if (dbUserData['Premium_Request']['ss_id'] - 0 > 0) {
                            var objProduct = {
                                '1': 'Car',
                                '2': 'Health',
                                '4': 'Travel',
                                '10': 'TW',
                                '12': 'CV',
                                '18': 'CyberSecurity'
                            };
                            var product_short_name = objProduct[dbUserData['Product_Id']];
                            var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + product_short_name + '][Attempt:' + proposal_attempt_cnt + '][PROPOSAL:' + objBase.lm_request['proposal_id'] + '] REDIRECT_TO_PG - CRN : ' + dbUserData['PB_CRN'];
                            var arr_to = [];
                            var arr_bcc = [config.environment.notification_email];
                            var arr_cc = [];
                            var email_body = proposal_ack_data.replace(/\n/g, '<BR>');
                            var email_data = '<!DOCTYPE html><html><head><title>PROPOSAL_SUBMIT_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                            email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">PROPOSAL_SUBMIT_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                            email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">' + email_body + '&nbsp;</td></tr>';
                            email_data += '</table></div><br></body></html>';
                            if (dbUserData['Premium_Request'].hasOwnProperty('posp_email_id') && dbUserData['Premium_Request']['posp_email_id'] != null && dbUserData['Premium_Request']['posp_email_id'].toString().indexOf('@') > -1) {
                                arr_to.push(dbUserData['Premium_Request']['posp_email_id']);
                            }
                            if (dbUserData['Premium_Request'].hasOwnProperty('posp_reporting_email_id') && dbUserData['Premium_Request']['posp_reporting_email_id'] != null && dbUserData['Premium_Request']['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                arr_cc.push(dbUserData['Premium_Request']['posp_reporting_email_id']);
                            }
                            if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] != null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
                                arr_cc.push(dbUserData['Premium_Request']['posp_sub_fba_email']);
                            }
                            if (config.environment.name === 'Production') {
                                if ((dbUserData['Premium_Request']['posp_sources'] - 0) > 0) {
                                    if ((dbUserData['Premium_Request']['posp_sources'] - 0) == 1) {
                                        arr_bcc.push('transactions.1920@gmail.com'); //finmart-dc
                                    }
                                }
                            }
                            if (arr_to.length) {
                                objModelEmail.send('notifications@policyboss.com', arr_to.join(','), sub, email_data, arr_cc.join(','), arr_bcc.join(','), dbUserData['PB_CRN']);
                            }
                        }
                    } catch (e) {
                        console.error('Exception', 'Notification_RM_Proposal_Team', e);
                    }



                }
            }
        });
    } catch (ex) {
        console.error('MethodErrSMS', ex);
    }
});
router.get('/getBreakinLocations/:Insurer_Id/:Pincode', function (req, res) {
    var Insurer_Id = parseInt(req.params.Insurer_Id);
    var Pincode = parseInt(req.params.Pincode);
    var Pincode_Insurer = require('../models/pincode_insurer');
    Pincode_Insurer.find({Insurer_Id: Insurer_Id, Pincode: Pincode}, function (err, Pin) {
        if (err) {
            //Pin["Msg"]="Failure";
            //Pin["Msg"]=err;
            res.send(err);
        } else {
            Pin["Msg"] = "Success";
            //res.json(Pin);
        }
        res.json(Pin);
    });
});
router.get('/vehicles/base_master', function (req, res) {
    var base_vehicle_id = req.query['base_vehicle_id'] - 0;
    if (base_vehicle_id > 0) {
        var cache_key = 'vehicles_base_master';

        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            var obj_cache_content = JSON.parse(cache_content);
            return res.json(obj_cache_content[base_vehicle_id]);
        } else {
            var Vehicle = require('../models/vehicle');
            Vehicle.find({'Is_Base': 'Yes'}).select('-_id -_v').exec(function (err, dbVehicles) {
                var obj_all_vehicle = {};
                if (err) {
                    return res.send(err);
                }
                if (dbVehicles) {
                    for (let k in dbVehicles) {
                        obj_all_vehicle[dbVehicles[k]._doc['Vehicle_ID']] = dbVehicles[k]._doc;
                    }

                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(obj_all_vehicle), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });

                    return res.json(obj_all_vehicle[base_vehicle_id]);
                }
            });
        }
    } else {
        return res.json({});
    }

});

router.post('/iciciLombard_update_inspection_status', function (req, res2, next) {
    let objInsurerProduct = req.body;
    let dealNo = "", callingService = '', Error_Msg = '', Inspection_Remarks = '';
    let args = {};
    let body = {};

    try {
        if (config.environment.name.toString() === 'Production') {
            dealNo = 'DL-3001/2511179';
            callingService = 'https://app9.icicilombard.com/ILServices/Motor/v1/Breakin/ClearInspectionStatus';
        } else {
            dealNo = 'DEAL-3001-0206164';//'DL-3001/1488439';
            callingService = 'https://cldilbizapp02.cloudapp.net:9001/ILServices/motor/v1/Breakin/ClearInspectionStatus';
        }

        let Icici_Token = require(appRoot + '/models/icici_token');
        Icici_Token.findOne({'Product_Id': 1}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
            if (err) {
                console.error('/iciciLombard_update_inspection_status Icici Token not Found', err);
                Error_Msg = err;
            } else {
                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                //let dbIciciToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZCN0FDQzUyMDMwNUJGREI0RjcyNTJEQUVCMjE3N0NDMDkxRkFBRTEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJhM3JNVWdNRnY5dFBjbExhNnlGM3pBa2ZxdUUifQ.eyJuYmYiOjE1OTEwOTIyNDIsImV4cCI6MTU5MTA5NTg0MiwiaXNzIjoiaHR0cHM6Ly9jbGRpbGJpemFwcDAyLmNsb3VkYXBwLm5ldDo5MDAxL2NlcmJlcnVzIiwiYXVkIjpbImh0dHBzOi8vY2xkaWxiaXphcHAwMi5jbG91ZGFwcC5uZXQ6OTAwMS9jZXJiZXJ1cy9yZXNvdXJjZXMiLCJlc2JwYXltZW50Il0sImNsaWVudF9pZCI6InJvLnBvbGljeWJvc3MiLCJzdWIiOiI0MmM5ZDY0MC02ZTQ2LTQwN2QtYmZjNi0yOWJhZDUwYmU0MDIiLCJhdXRoX3RpbWUiOjE1OTEwOTIyNDIsImlkcCI6ImxvY2FsIiwic2NvcGUiOlsiZXNicGF5bWVudCJdLCJhbXIiOlsiY3VzdG9tIl19.oqA_VkX0IhBT4Q3lL1x9du0nuIRQVRyw8AxTCOgekQqiFg3JbUGQ451QFWFaDbHJatpRDP0n6daXHm-Z_Cj8fMhsDDXwFo-4w4UVTs7VpQoLCj8pMEfM9OtSI0ujfn52qUsH_0XJwtUDlZv2eFHCzSyhu-bWPVLS7CBfRepKnc7Rp4on1JANJHJ3o2atY4PNvDIukHF4Mqu6bncJ4y9-hoek8bOkobsJFtK_DNlvl0nYJnBirBsB_nC87sbiwWxy3wd3UP5HBKxLrpqz3B8PNwmBls7t4jcoXLxYluI5xhnIabKhlkRc06NDmUT9ODBoRYlZZzV6SWvVQY9Q2PjV4A";
                console.log('iciciLombard_update_inspection_status() dbIciciToken from DB : ', dbIciciToken);
                body = {
                    "InspectionId": objInsurerProduct['Inspection_Id'],
                    "DealNo": dealNo,
                    "ReferenceDate": objInsurerProduct['Reference_Date'],
                    "InspectionStatus": "OK",
                    "CorrelationId": objInsurerProduct['Correlation_Id'],
                    "ReferenceNo": objInsurerProduct['Reference_No']
                };
                args = {
                    data: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": "Bearer " + dbIciciToken['Token']
                    }
                };
                console.error('iciciLombard_update_inspection_status Request :: ', JSON.stringify(args));

                let Client = require('node-rest-client').Client;
                let client = new Client();
                client.post(callingService, args, function (data, response) {
                    console.error('ICICI Lombard - ClearInspectionStatus service - Response : ', JSON.stringify(data));
                    if (data) {
                        let iciciLombard_breakin_status = '';
                        let email_template = '';
                        let email_sub_status = '';
                        let inspection_status_msg = '';
                        //data['statusMessage'] = 'Success';
                        //data['vehicleInspectionStatus'] = 'PASS';
                        if ((data.hasOwnProperty('statusMessage')) && (data['statusMessage'] === 'Success')) {
                            if ((data.hasOwnProperty('vehicleInspectionStatus')) && (data['vehicleInspectionStatus'] === 'PASS')) {
                                iciciLombard_breakin_status = 'INSPECTION_APPROVED';
                                email_template = 'Send_Inspection_Status.html';
                                email_sub_status = 'Successful';
                                Error_Msg = iciciLombard_breakin_status;
                            } else if ((data.hasOwnProperty('vehicleInspectionStatus')) && (data['vehicleInspectionStatus'] === 'FAIL')) {
                                iciciLombard_breakin_status = 'INSPECTION_REJECTED';
                                email_template = 'Send_Inspection_Status.html'; //'Send_UnSuccessful_Inspection.html';
                                email_sub_status = 'Unsuccessful';
                                Inspection_Remarks = data['message'];
                                Error_Msg = iciciLombard_breakin_status + " : " + Inspection_Remarks;
                            } else {
                                Error_Msg = JSON.stringify(data);
                            }

                            try {
                                let queryObj = {
                                    PB_CRN: parseInt(objInsurerProduct['PB_CRN']),
                                    UD_Id: parseInt(objInsurerProduct['UD_Id']),
                                    SL_Id: parseInt(objInsurerProduct['SL_Id']),
                                    Insurer_Id: 6,
                                    Request_Unique_Id: objInsurerProduct['Request_Unique_Id'],
                                    Service_Log_Unique_Id: objInsurerProduct['Service_Log_Unique_Id'],
                                    Inspection_Number: objInsurerProduct['Inspection_Id'],
                                    Status: iciciLombard_breakin_status,
                                    Insurer_Request: args,
                                    Insurer_Response: data,
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
                                                console.log("iciciLombard_update_inspection_status() inspectionBreakinsdb : ", inspectionBreakinsdb.insertedCount, inspectionBreakinsdb.result);
                                            }
                                        });
                                    }
                                });
                            } catch (ex4) {
                                Error_Msg = ex4;
                                console.error('Exception in iciciLombard_update_inspection_status() for inspection_schedule DB updating : ', ex4);
                            }

                            try {
                                console.log('path :: ', appRoot, '/models/inspection_schedule');
                                let inspectionSchedules = require(appRoot + '/models/inspection_schedule');
                                let today = new Date();
                                let myquery = {Inspection_Id: objInsurerProduct['Inspection_Id'], PB_CRN: objInsurerProduct['PB_CRN'], UD_Id: objInsurerProduct['UD_Id']};
                                let newvalues = {Insurer_Status: "CHECKED", Status: iciciLombard_breakin_status, Modified_On: today};
                                inspectionSchedules.updateOne(myquery, newvalues, function (uperr, upres) {
                                    if (uperr) {
                                        Error_Msg = uperr;
                                        throw uperr;
                                    } else {
                                        console.log("IciciLombardMotor iciciLombard_update_inspection_status() BreakIn Status Updated for : ", objInsurerProduct['Inspection_Id'], ", UD_Id : ", objInsurerProduct['UD_Id']);
                                        console.log("IciciLombardMotor : UD_Id : ", objInsurerProduct['UD_Id'], upres);
                                    }
                                });
                            } catch (ex4) {
                                Error_Msg = ex4;
                                console.error('Exception in iciciLombard_update_inspection_status() for inspection_schedule DB updating : ', ex4);
                            }

                            try {
                                let User_Data = require(appRoot + '/models/user_data');
                                let ud_cond = {"User_Data_Id": objInsurerProduct['UD_Id']};
                                User_Data.findOne(ud_cond, function (err, dbUserData) {
                                    if (err) {
                                        console.error('Exception in iciciLombard_update_inspection_status() : ', err);
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
                                            "Status": iciciLombard_breakin_status,
                                            "StatusOn": new Date()
                                        });
                                        if (iciciLombard_breakin_status === 'INSPECTION_REJECTED') {
                                            newvalues1 = {
                                                "Last_Status": iciciLombard_breakin_status,
                                                "Status_History": Status_History,
                                                "Inspection_Remarks": data['message'],
                                                "Premium_Request.is_inspection_done": "yes",
                                                "Modified_On": new Date()
                                            }, {upsert: false, multi: false};
                                        }
                                        if (iciciLombard_breakin_status === 'INSPECTION_APPROVED') {
                                            newvalues1 = {
                                                "Last_Status": iciciLombard_breakin_status,
                                                "Status_History": Status_History,
                                                "Premium_Request.is_inspection_done": "yes",
                                                "Modified_On": new Date()
                                            };
                                        }

                                        User_Data.updateOne(myquery1, newvalues1, function (err, numAffected) {
                                            console.log('iciciLombard_update_inspection_status() UserDataUpdated : ', err, numAffected);
                                        });

                                        let payment_link = "";
                                        if (iciciLombard_breakin_status === 'INSPECTION_APPROVED') {
                                            payment_link = config.environment.portalurl.toString() + '/car-insurance/buynow/' + dbUserData['Premium_Request']['client_id'] + '/' + objInsurerProduct['Service_Log_Unique_Id'] + '_' + objInsurerProduct['SL_Id'] + '_' + objInsurerProduct['UD_Id'] + '/NonPOSP/0';
                                            console.log("iciciLombard_update_inspection_status() payment_link : ", payment_link);
                                        }

                                        let Client2 = require('node-rest-client').Client;
                                        let client2 = new Client2();
                                        client2.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(payment_link), function (urlData, urlResponse) {
                                            try {
                                                var short_url_value = "";
                                                if (iciciLombard_breakin_status === 'INSPECTION_APPROVED' && urlData && urlData.Short_Url !== '') {
                                                    inspection_status_msg = 'Your Vehicle Inspection has been done successfully. Payment Link is : ';
                                                    console.log("iciciLombard_update_inspection_status() inspection_status_msg : ", inspection_status_msg);
                                                    short_url_value = urlData.Short_Url;
                                                }
                                                if (iciciLombard_breakin_status === 'INSPECTION_REJECTED') {
                                                    inspection_status_msg = 'Your Vehicle Inspection has been Rejected. REMARKS : ' + Inspection_Remarks;
                                                    console.log("iciciLombard_update_inspection_status() inspection_status_msg : ", inspection_status_msg);
                                                    short_url_value = "";
                                                }
                                                let dataObj = dbUserData['Proposal_Request_Core'];
                                                let objRequestCore = {
                                                    'customer_name': dataObj['first_name'] + ' ' + dataObj['last_name'],
                                                    'crn': dataObj['crn'],
                                                    'vehicle_text': dataObj['vehicle_text'],
                                                    'insurer_name': 'ICICI LOMBARD GENERAL INSURANCE CO. LTD.',
                                                    'insurance_type': 'RENEW - Breakin Case',
                                                    'inspection_id': objInsurerProduct['Inspection_Id'],
                                                    'final_premium': dbUserData.Proposal_Request_Core['final_premium'],
                                                    'email_id': dataObj['email'],
                                                    'registration_no': dbUserData['registration_no'],
                                                    'inspection_status_msg': inspection_status_msg,
                                                    'short_url': short_url_value
                                                };
                                                let processed_request = {};
                                                for (let key in objRequestCore) {
                                                    if (typeof objRequestCore[key] !== 'object') {
                                                        processed_request['___' + key + '___'] = objRequestCore[key];
                                                    }
                                                }
                                                console.error('Breakin Email', iciciLombard_breakin_status);
                                                if (iciciLombard_breakin_status === 'INSPECTION_APPROVED' || iciciLombard_breakin_status === 'INSPECTION_REJECTED') {
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
                                                    if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] != '' && dbUserData.Premium_Request['posp_reporting_email_id'] != null) {
                                                        if (dbUserData.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                                            arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                                        }
                                                    }
                                                    if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] != null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
                                                        arr_bcc.push(dbUserData['Premium_Request']['posp_sub_fba_email']);
                                                    }
                                                    if (config.environment.name === 'Production') {
                                                        if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                                                            if ((dbUserData.Premium_Request['posp_sources'] - 0) === 1) {
                                                                arr_bcc.push('transactions.1920@gmail.com');//finmart-dc 
                                                            }
                                                        }
                                                    }
                                                    objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), dbUserData['PB_CRN']);
                                                    res2.json({'Status': Error_Msg});
                                                }
                                            } catch (e) {
                                                console.error('Exception in iciciLombard_update_inspection_status() for mailing : ', e);
                                                res2.json({'Status': e});
                                            }
                                        });
                                    }
                                });
                            } catch (ex2) {
                                console.error('Exception in iciciLombard_update_inspection_status() for User_Data db details : ', ex2);
                                res2.json({'Status': ex2});
                            }
                        } else {
                            Error_Msg = JSON.stringify(data);
                            res2.json({'Status': Error_Msg});
                        }
                    } else {
                        Error_Msg = JSON.stringify(data);
                        res2.json({'Status': Error_Msg});
                    }
                });
            }
        });
    } catch (ex3) {
        console.error('Exception in iciciLombard_update_inspection_status() for User_Data db details : ', ex3);
        res2.json({'Status': ex3});
    }
    //res2.json({'Status': Error_Msg});
});

router.get('/edelweiss/proposal', function (req, res) {
    let Product_Id = req.query['Product_Id'] - 0;
    let CRN = req.query['CRN'] - 0;
    let policy_number = 600000001;
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
        if (err)
            throw err;
        var edelweissMaster = db.collection('edelweiss_policy_master');
        var mysort = {Policy_Number: -1};
        edelweissMaster.find({}, {_id: 0, Policy_Number: 1}).sort(mysort).limit(1).toArray(function (err, result) {
            if (err)
            {
                return res.json({'status': 'ERR', 'msg': err});
            } else {
                policy_number = (result['length'] > 0) ? (result[0]['Policy_Number'] - 0) : 600000000;
                policy_number = policy_number + 1;
                var date = moment().format('YYYY-MM-DD HH:mm:ss');
                let myobj = {
                    "Created_On": new Date(),
                    "Policy_Number": policy_number.toString(),
                    "CRN": CRN,
                    "Product_Id": Product_Id
                };
                if (req.query['dbg'] === 'yes') {
                    return res.json({'status': 'SUCCESS', 'msg': 'SUCCESS', 'policy_number': policy_number});
                } else {
                    edelweissMaster.insertOne(myobj, function (err, resDB) {
                        if (err)
                        {
                            return res.json({'status': 'ERR', 'msg': err});
                        } else {
                            return res.json({'status': 'SUCCESS', 'msg': 'SUCCESS', 'policy_number': policy_number});
                        }
                    });
                }
            }
        });
    });
});

router.get('/sbigeneral/proposal', function (req, res) {
    let Product_Id = req.query['Product_Id'] - 0;
    let CRN = req.query['CRN'] - 0;
    let policy_number = 'SBI00001';
    let policyNo;
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
        if (err)
            throw err;
        var sbiMaster = db.collection('sbi_motor_policy');
        var mysort = {Created_On: -1, Policy_Number: -1};
        sbiMaster.find({}, {_id: 0, Policy_Number: 1}).sort(mysort).limit(1).toArray(function (err, result) {
            if (err)
            {
                return res.json({'status': 'ERR', 'msg': err});
            } else {
                policy_number = (result['length'] > 0) ? (result[0]['Policy_Number'].split('SBI')[1] - 0) : 0;
                policyNo = policy_number;
                if (policyNo >= 9 && policyNo < 99) {
                    policy_number = "SBI000" + (policyNo + 1).toString();
                } else if (policyNo >= 99 && policyNo < 999) {
                    policy_number = "SBI00" + (policyNo + 1).toString();
                } else if (policyNo >= 999 && policyNo < 9999) {
                    policy_number = "SBI0" + (policyNo + 1).toString();
                } else if (policyNo >= 9999) {
                    policy_number = "SBI" + (policyNo + 1).toString();
                } else {
                    policy_number = "SBI0000" + (policyNo + 1).toString();
                }
                var date = moment().format('YYYY-MM-DD HH:mm:ss');
                let myobj = {
                    "Created_On": new Date(),
                    "Policy_Number": policy_number.toString(),
                    "CRN": CRN,
                    "Product_Id": Product_Id
                };
                if (req.query['dbg'] === 'yes') {
                    return res.json({'status': 'SUCCESS', 'msg': 'SUCCESS', 'policy_number': policy_number});
                } else {
                    sbiMaster.insertOne(myobj, function (err, resDB) {
                        if (err)
                        {
                            return res.json({'status': 'ERR', 'msg': err});
                        } else {
                            return res.json({'status': 'SUCCESS', 'msg': 'SUCCESS', 'policy_number': policy_number});
                        }
                    });
                }
            }
        });
    });
});
/*
router.get('/is_allow_add_cart/:ss_id?', (req, res) => {//is_allow_add_cart
    var ss_id = req.params['ss_id'] - 0;
    //var is_allow_cart_pay = require('../models/is_allow_cart_pay');
    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
        var is_allow = db.collection('is_allow_cart_pay');
        is_allow.findOne({'ss_id': ss_id}, function (err, response) {
            if (err)
                throw(err);
            if (response) {
                if (response.Is_Active == 1) {
                    res.json({Msg: 'Success'});
                }
            } else {
                res.json({Msg: 'Fail'});
            }
        });
    });
});
*/
router.post('/is_allow_add_cart', (req, res) => {//is_allow_add_cart
    try {
        var data = req.body;
        var ss_id = data['ss_id'] - 0;
        var Service_Log_Unique_Id = data['arn'];
        //var is_allow_cart_pay = require('../models/is_allow_cart_pay');
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            var is_allow = db.collection('is_allow_cart_pay');
            var is_added = db.collection('add_to_carts');
            is_allow.findOne({'ss_id': ss_id}, function (err, response) {
                if (err)
                    throw(err);
                if (response) {
                    if (response.Is_Active == 1) {
                        is_added.findOne({'Service_Log_Unique_Id': Service_Log_Unique_Id}, function (err, response) {
                            if (err)
                                throw(err);
                            if (response == null) {
                                res.json({Msg: 'Success'});
                            } else {
                                res.json({Msg: 'Fail'});
                            }
                        });

                    }
                } else {
                    res.json({Msg: 'Fail'});
                }
            });
        });
    }
    catch (e) {
        console.error('Exception in is_allow_add_cart() : ', e.stack);
        res.json({'Status': e.stack});
    }
});
module.exports = router;

