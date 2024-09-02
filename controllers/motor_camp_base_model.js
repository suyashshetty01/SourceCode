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
var sleep = require('system-sleep');
var MongoClient = require('mongodb').MongoClient;
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var Vehicle = require('../models/vehicle');
var age = {
    'Age_1': 2014,
    'Age_2': 2015,
    'Age_3': 2016,
    'Age_4': 2017,
    'Age_5': 2018,
    'Age_6': 2019
};
var ncb_percent = {
    'Age_1': 0,
    'Age_2': 20,
    'Age_3': 25,
    'Age_4': 35,
    'Age_5': 45,
    'Age_6': 50
};
module.exports.controller = function (app) {
    app.get('/motor_camp_base_model/base_vehicles/:Start_Vehicle/:End_Vehicle', function (req, res) {
        let Start_Vehicle = req.params.Start_Vehicle - 0;
        let End_Vehicle = req.params.End_Vehicle - 0;

        try {
            Vehicle.find({Product_Id_New: 1, Is_Base: 'Yes', Vehicle_ID: {"$gte": Start_Vehicle, "$lte": End_Vehicle}}, function (err, vehicles) {
                if (err)
                {
                    res.send(err);
                } else
                {
                    let vehiclesMaster = this;
                    if (parseInt(vehicles.length) > 0) {

                        for (let i in vehicles) {
                            for (let j in age)
                            {
                                premiumInit(vehicles[i]._doc, j);
                            }
                        }
                        res.json({Status: 'Success', Msg: 'Data Updated Successfully'});
                    } else
                    {
                        res.json({Status: 'Success', Msg: 'No Vehicle details found for update'});
                    }
                }
            });
        } catch (err) {
            res.json({'Msg': 'error', Error_Msg: err});
        }
    });
    function premiumInit(vehiclesData, j) {
        var moment = require('moment');
        var current_date = new Date();
        var policy_expiry_year = moment(current_date).format('YYYY');
        var current_month = moment(current_date).format('MM');
        var Premium_Request = {
            "product_id": 1,
            "vehicle_id": vehiclesData.Vehicle_ID,
            "rto_id": 580,
            "vehicle_insurance_type": "renew",
            "vehicle_registration_date": age[j] + "-" + current_month + "-26", //"2019-03-26",//
            "vehicle_manf_date": age[j] + "-" + current_month + "-01", //"2019-03-01",//
            "policy_expiry_date": policy_expiry_year + "-" + current_month + "-30",
            "prev_insurer_id": 2,
            "vehicle_registration_type": "individual",
            "vehicle_ncb_current": ncb_percent[j].toString(),
            "is_claim_exists": "no",
            "method_type": "Premium",
            "execution_async": "yes",
            "electrical_accessory": 0,
            "non_electrical_accessory": 0,
            "registration_no": "MH-01-AA-1234",
            "is_llpd": "no",
            "is_antitheft_fit": "no",
            "is_external_bifuel": "no",
            "is_aai_member": "no",
            "external_bifuel_type": "",
            "external_bifuel_value": 0,
            "pa_owner_driver_si": "1500000",
            "is_pa_od": "yes",
            "is_having_valid_dl": "no",
            "is_opted_standalone_cpa": "yes",
            "pa_paid_driver_si": "0",
            "first_name": "",
            "mobile": "9999999999",
            "email": "",
            "crn": 0,
            "ss_id": 0,
            "client_id": 2,
            "fba_id": 0,
            "geo_lat": 0,
            "geo_long": 0,
            "agent_source": "",
            "app_version": "PolicyBoss.com",
            "vehicle_insurance_subtype": "1CH_0TP",
            "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
            "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
            "is_breakin": "no",
            "is_inspection_done": "no",
            "is_policy_exist": "yes",
            "is_financed": "no",
            "is_oslc": "no",
            "oslc_si": 0,
            "sub_fba_id": 0,
            "ip_city_state": "Mumbai_Maharashtra",
            "vehicle_make_name": vehiclesData.Make_Name,
            "vehicle_full": vehiclesData.Make_Name+'|'+vehiclesData.Model_Name+'|'+vehiclesData.Variant_Name+'|'+vehiclesData.Fuel_Name+'|'+vehiclesData.Cubic_Capacity,
            "rto_full": "MH02|Mumbai-Andheri|MAHARASHTRA|A",
            "policy_tenure": 1,
            "policy_od_tenure": 1,
            "policy_tp_tenure": 1,
            "client_name": "PolicyBoss",
            "udid": 0,
            "channel": "DIRECT",
            "subchannel": "DIRECT",
            "last_name": "",
            "quote_mode": "prefetch",
            "is_mobile_verified": "yes"
        };
        var args = {
            data: Premium_Request,
            headers: {
                "Content-Type": "application/json"
            }
        };
        var url_api = config.environment.weburl + '/quote/premium_initiate';
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.post(url_api, args, function (data, response) {
            console.log("Camp data - ", data);
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err1, db) {
                var vehicles = db.collection('vehicles');
                let myquery = {Vehicle_ID: data['Request'].vehicle_id};
                let arg = {};
                arg[j] = {
                    "Request_Unique_Id": data['Summary'].Request_Unique_Id
                };
                let newvalues = {$set: arg};
                vehicles.updateOne(myquery, newvalues, function (err, dbItems) {
                    if (err)
                    {
                        console.log('Error in update data');
                    } else
                    {
                        console.log('Data updated Successfully');
                    }
                });
            });
        });
    }
    ;

    app.get('/motor_camp_base_model/generate_quotes/:Start_Vehicle/:End_Vehicle', function (req, res) {
        let Start_Data_Id = req.params.Start_Vehicle - 0;
        let End_Data_Id = req.params.End_Vehicle - 0;
        try {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err1, db) {
                if (err1)
                    throw err1;
                var Quote_Gen_Lead = db.collection('quote_generation_leads');
                Quote_Gen_Lead.find({product_id: 1, Customer_Pb_Data_Id: {"$gte": Start_Data_Id, "$lte": End_Data_Id}, url: {$exists: false}}).toArray(function (err, vehicles) {
                    if (err)
                    {
                        res.send(err);
                    } else
                    {
                        let vehiclesMaster = this;
                        if (parseInt(vehicles.length) > 0) {
                            for (let i in vehicles) {
                                generate_quote(vehicles[i]);
                            }
                            res.json({Status: 'Success', Msg: 'Data Updated Successfully'});
                        } else
                        {
                            res.json({Status: 'Success', Msg: 'No Vehicle details found for update'});
                        }
                    }
                });

            });
        } catch (err) {
            res.json({'Msg': 'error', Error_Msg: err});
        }
    });
    function generate_quote(vehicles) {
        var moment = require('moment');
        var current_date = new Date();
        var policy_expiry_year = moment(current_date).format('YYYY');
        var policy_prev_year = moment(current_date).subtract(1, 'years').format('YYYY');
        var current_month = moment(current_date).format('MM');
        var Premium_Request = {
            "product_id": vehicles['product_id'],
            "vehicle_id": vehicles['Pb_Id'],
            "rto_id": vehicles['pb_rto_id'],
            "vehicle_insurance_type": "renew",
            "vehicle_registration_date": vehicles['vehicle_registration_date'], //"2019-03-26",//
            "vehicle_manf_date": vehicles['vehicle_manf_date'], //"2019-03-01",//
            "policy_expiry_date": vehicles['policy_expiry_date'],
            "prev_insurer_id": vehicles['prev_insurer_id'],
            "vehicle_registration_type": vehicles['vehicle_registration_type'],
            "vehicle_ncb_current": vehicles['vehicle_ncb_current'],
            "is_claim_exists": vehicles['is_claim_exists'],
            "method_type": "Premium",
            "execution_async": "yes",
            "electrical_accessory": 0,
            "non_electrical_accessory": 0,
            "registration_no": vehicles['registration_no'],
            "is_llpd": "no",
            "is_antitheft_fit": "no",
            "is_external_bifuel": "no",
            "is_aai_member": "no",
            "external_bifuel_type": "",
            "external_bifuel_value": 0,
            "pa_owner_driver_si": "1500000",
            "is_pa_od": vehicles['is_pa_od'],
            "is_having_valid_dl": "no",
            "is_opted_standalone_cpa": "yes",
            "pa_paid_driver_si": "0",
            "first_name": "",
            "mobile": "9999999999",
            "email": "",
            "crn": 0,
            "ss_id": vehicles['Ss_Id'],
            "client_id": 2,
            "fba_id": 0,
            "geo_lat": 0,
            "geo_long": 0,
            "agent_source": "",
            "app_version": "PolicyBoss.com",
            "vehicle_insurance_subtype": "1CH_0TP",
            "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
            "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
            "is_breakin": "no",
            "is_inspection_done": "no",
            "is_policy_exist": "yes",
            "is_financed": "no",
            "is_oslc": "no",
            "oslc_si": 0,
            "sub_fba_id": 0,
            "ip_city_state": "Mumbai_Maharashtra",
            "vehicle_make_name": vehicles['Make'],
            "vehicle_full": "",
            "rto_full": "",
            "policy_tenure": 1,
            "policy_od_tenure": 1,
            "policy_tp_tenure": 1,
            "client_name": "PolicyBoss",
            "udid": "",
            "channel": "DIRECT",
            "subchannel": "DIRECT",
            "last_name": "",
            "quote_mode": "prefetch",
            "is_mobile_verified": "yes",
            "is_renewal_proceed": "yes",
            "lead_type": "erp_lead",
            "lead_status": "pending",
            "erp_uid": 0,
            "utm_source": "LERP_Renewal",
            "erp_qt": vehicles['erp_qt'],
            "lead_id": vehicles['Customer_Pb_Data_Id']
        };
        var args = {
            data: Premium_Request,
            headers: {
                "Content-Type": "application/json"
            }
        };
        var url_api = config.environment.weburl + '/quote/premium_initiate';
        var Client = require('node-rest-client').Client;
        var client = new Client();
        var Pb_Data_Id = vehicles['Customer_Pb_Data_Id'];
        client.post(url_api, args, function (data, response) {
            console.log("Camp data - ", data);
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err1, db) {
                //var sleep = require('system-sleep');
                //sleep(2000);
                var Quote_Gen_Lead = db.collection('quote_generation_leads');
                var vehicles = db.collection('vehicles');
                let myquery = {Pb_Id: data['Request'].vehicle_id, Customer_Pb_Data_Id: Pb_Data_Id};
                var product_name = 'Car';
                var product_url = 'car-insurance';
                if (data.Request['product_id'] === 10) {
                    product_name = 'TW';
                    product_url = 'two-wheeler-insurance';
                }
                var quote_url = config.environment.portalurl + '/' + product_url + '/quotes?SID=' + data['Summary'].Request_Unique_Id + '&ClientID=2&utm_source=LERP_Renewal&erp_qt=' + data['Request'].erp_qt;
                var Client = require('node-rest-client').Client;
                var client = new Client();
                let quote_url_bitly = "";
                client.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(quote_url), function (data, response) {
                    console.log('Bitly-', data);
                    if (data && data.Short_Url !== "") {
                        quote_url_bitly = data.Short_Url;
                    }
                    let newvalues = {$set: {url: quote_url_bitly}};
                    Quote_Gen_Lead.updateOne(myquery, newvalues, function (err, dbItems) {
                        if (err)
                        {
                            console.log('Error in update data');
                        } else
                        {
                            console.log('Data updated Successfully');
                        }
                    });
                });
            });
        });
        var msg = "suceuss";
        return msg;
    }

    app.get('/motor_camp_base_model/premium_initiate/:product_id/:user_data_id/:insurance_subtype/:is_claim/:ncb_current?', function (req, res, next) {
        try {
            var objRequest = this;
            var Product_Id = req.params['product_id'];
            var User_Data_Id = req.params['user_data_id'] - 0;
            var Insurance_Subtype = req.params['insurance_subtype'];
            var Is_Claim = req.params['is_claim'];
            var NCB_Current = req.params['ncb_current'];
            var Lead = require(appRoot + '/models/leads');
            var objRequest_new = {
                "product_id": Product_Id,
                "user_data_id": User_Data_Id,
                "insurance_subtype": Insurance_Subtype,
                "is_claim": Is_Claim,
                "ncb_current": NCB_Current,
                "user_data": User_Data
            };
            objRequest = objRequest_new;
            var User_Data = require('../models/user_data');
            User_Data.find({User_Data_Id: User_Data_Id}, {_id: 0}, function (err, quote_data) {
                try {
                    if (err)
                        throw err;
                    //res.json(quote_data);
                    if (parseInt(quote_data.length) > 0) {

                        for (var quotecount in quote_data) {
                            var dbUserData = [];
                            dbUserData = quote_data[quotecount]._doc;
                            var Premium_Request = dbUserData.Premium_Request;
                            //Premium_Request['policy_expiry_date'] = moment(Erp_Qt_Request_Core['___policy_end_date___']).add(11, "days").format("YYYY-MM-DD");
                            Premium_Request['is_claim_exists'] = objRequest.is_claim;
                            Premium_Request['vehicle_ncb_current'] = objRequest.ncb_current;
                            Premium_Request['vehicle_insurance_subtype'] = objRequest.insurance_subtype;
                            Premium_Request['electrical_accessory'] = "0";
                            Premium_Request['non_electrical_accessory'] = "0";
                            Premium_Request['is_llpd'] = "no";
                            Premium_Request['is_breakin'] = "no";
                            Premium_Request['is_policy_exist'] = "yes";
                            Premium_Request['crn'] = "0";
                            Premium_Request['is_antitheft_fit'] = "no";
                            Premium_Request['voluntary_deductible'] = "0";
                            Premium_Request['is_aai_member'] = "no";
                            Premium_Request['pa_named_passenger_si'] = "0";
                            Premium_Request['pa_unnamed_passenger_si'] = "0";
                            Premium_Request['pa_unnamed_passenger_si'] = "0";
                            Premium_Request['original_crn'] = dbUserData['PB_CRN'];
                            Premium_Request['original_udid'] = dbUserData['User_Data_Id'];
                            var args = {
                                data: Premium_Request,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            var url_api = config.environment.weburl + '/quote/premium_initiate';
                            var Client = require('node-rest-client').Client;
                            var client = new Client();
                            client.post(url_api, args, function (data, response) {
                                console.log("renewal_quotes_schedule data - ", data);
                                console.log("renewal_quotes_schedule data - ", response);
                                res.json(data);
                            });
                        }
                    } else {
                        res.json({'msg': 'No Data Avilable'});
                    }
                } catch (e) {
                    console.log("renewal_quotes_schedule", e);
                    res.json(e);
                }
            });

        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }

    });


};

