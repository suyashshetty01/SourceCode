/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var Vehicles_Insurer_Mapping = require('../models/vehicles_insurers_mapping');
module.exports.controller = function (app) {
    /**
     * a home page route
     */


    app.post('/vehicles_insurers_mappings/mapping', LoadSession, function (req, res) {
        var Vehicle = require('../models/vehicle');
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

    app.get('/vehicles_insurers_mappings/summary', function (req, res) {
        var product_id = parseInt(req.query['product_id']);
        var Is_Base = req.query['Is_Base'];
        var from = 0, to = 0;
        if (product_id === 1) {
            from = 0;
            to = 50000;
        } else {
            from = 50000;
            to = 100000;
        }
        var cond = {"Vehicle_ID": {"$gte": from, "$lte": to}};
        if (Is_Base !== '') {
            cond['Is_Base'] = Is_Base;
        }
        var agg = [
            {"$match": cond},
            {$group: {
                    _id: {Insurer_ID: "$Insurer_ID", Status_Id: "$Status_Id"},
                    InsurerStatusCount: {$sum: 1}
                }},
            {$project: {_id: 0, Insurer_ID: "$_id.Insurer_ID", Status_Id: "$_id.Status_Id", InsurerStatusCount: "$InsurerStatusCount"}},
            {$sort: {Insurer_ID: 1, 'InsurerStatusCount': -1}}
        ];

        Vehicles_Insurer_Mapping.aggregate(agg, function (err, vehicles) {
            if (err)
                res.send(err);

            res.json(vehicles);
        });

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
        console.error('Exception', 'LoadSession', e);
        return next();
    }
}
