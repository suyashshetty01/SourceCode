/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');

mongoose.connect(config.db.connection + ':27017/' + config.db.name,{ useMongoClient: true}); // connect to our database

var Rtos_Insurer_Mapping = require('../models/rtos_insurers_mapping');
module.exports.controller = function (app) {
    /**
     * a home page route
     */


    app.post('/rtos_insurers_mappings/mapping', function (req, res) {
        var Rto = require('../models/rto');
        if (req.body['Insurer_ID'] != '' && req.body['Rto_ID'] != '') {
            Rtos_Insurer_Mapping.remove(
                    {
                        'Insurer_ID': parseInt(req.body['Insurer_ID']),
                        'Rto_ID': parseInt(req.body['Rto_ID'])
                    }
            , function (err) {
                if (err) {

                } else {
                    console.log('Rtos_Insurer_Mapping-deleted');
                    //1 - Remove_Mapping,  2- Assign_Mapping, 3- Not_Supported, 4-Nearer_Match
                    var status_id = parseInt(req.body['Status_Id']);
                    if (status_id != 1) {
                        if (status_id == 2) {
                            var objMap = {
                                'Insurer_ID': parseInt(req.body['Insurer_ID']),
                                'Insurer_Rto_ID': parseInt(req.body['Insurer_Rto_ID']),
                                'Rto_ID': parseInt(req.body['Rto_ID']),
                                'Is_Active': 1,
                                'Created_On': new Date(),
                                'Status_Id': parseInt(req.body['Status_Id']),
                                'Premium_Status': 1
                            };
                        } else if (status_id == 3) {
                            var objMap = {
                                'Insurer_ID': parseInt(req.body['Insurer_ID']),
                                'Insurer_Rto_ID': null,
                                'Rto_ID': parseInt(req.body['Rto_ID']),
                                'Is_Active': 0,
                                'Created_On': new Date(),
                                'Status_Id': parseInt(req.body['Status_Id']),
                                'Premium_Status': 1
                            };
                        }
                        var objModelRtosInsurerMapping = new Rtos_Insurer_Mapping(objMap);
                        objModelRtosInsurerMapping.save(function (err, objDbRtos_Insurer_Mapping) {
                            if (err) {
                                console.error('objDbRtos_Insurer_Mapping', 'Rtos_Insurer_Mapping_Save', err);
                                res.json({Msg: err});
                            } else {
                                var ObjRto = {};
                                ObjRto['Insurer_' + parseInt(req.body['Insurer_ID'])] = objMap;
                                Rto.update({'VehicleCity_Id': parseInt(req.body['Rto_ID'])}, {$set: ObjRto}, function (err, numAffected) {
                                    if (err) {
                                        //res.json({Msg: 'Vehicle_Not_Saved', Details: err});
                                    } else {
                                        //res.json({Msg: 'Success_Created', Details: numAffected});
                                    }
                                });
                                console.error('objDbRtos_Insurer_Mapping', 'Rtos_Insurer_Mapping_Save', err);
                                res.json({Msg: 'Success', Data: objDbRtos_Insurer_Mapping});
                            }
                        });
                    } else {
                        res.json({Msg: 'Success'});
                    }
                }
            });
        } else {
            res.json({Msg: 'Insurer_ID and Rto_ID are missing'});
        }
    });

}
