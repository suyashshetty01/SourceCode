/* Author : Muskan
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let config = require('config');
let MongoClient = require('mongodb').MongoClient;
let mongoose = require('mongoose');
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
let integration_agreement = require('../models/integration_agreement');

module.exports.controller = function (app) {

    app.post('/integration_agreements/get_integration_agreement', function (req, res) {
        try {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: '',
                sort: {'Created_On': -1},
                lean: true
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                obj_pagination.paginate.limit = "100";
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            var document_master = require('../models/integration_agreement');
            document_master.paginate(filter, optionPaginate, function (err, dbAgreementData) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(dbAgreementData);
                }
            });
        } catch (e) {
            console.error(e.stack);
            res.json({"Msg": "error", 'Details': e.stack});
        }
    });

    app.post('/integration_agreements/add_integration_agreement', function (req, res) {
        try {
            let objRequest = req.body;
            let insurer_id = parseInt(objRequest.Insurer);
            let documentMaster = {};
            integration_agreement.find({"Insurer": insurer_id}, function (err, getDbData) {
                if (err) {
                    res.send(err);
                } else {
                    if (getDbData.length > 0) {
                        res.json({"Status": "Success", "Msg": "Already Exist"});
                    } else {
                        for (var key in objRequest) {
                            if (key === "Remark" || key === "Agreement_Signing_Date" || key === "NDA_Signing_Date") {
                                documentMaster[key] = objRequest[key];
                            } else {
                                documentMaster[key] = parseInt(objRequest[key]);
                            }
                        }
                        documentMaster["Modified_By"] = objRequest.Modified_By;
                        documentMaster["Created_By"] = objRequest.Created_By;
                        documentMaster["Created_On"] = new Date();
                        documentMaster["Modified_On"] = new Date();
                        documentMaster["Agreement_Signing_Date"] = objRequest.Agreement_Signing_Date;
                        documentMaster["NDA_Signing_Date"] = objRequest.NDA_Signing_Date;
                        let dbObj = new integration_agreement(documentMaster);
                        dbObj.save(function (err, data) {
                            if (err) {
                                res.json({"Status": "Fail", "Msg": err});
                            } else {
                                res.json({"Status": "Success", "Msg": data});
                            }
                        });
                    }
                }
            });
        } catch (ex) {
            console.error('Exception', 'integration_agreements service', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });

    app.post('/integration_agreements/update_integration_agreement_master', function (req, res) {
        try {
            let objRequest = req.body;
            let insurer_id = parseInt(objRequest.Insurer);
            let agreementMasterObj = {};
            for (var key in req.body) {
                if (key === "Insurer" || key === "Remark" || key === "Modified_By" || key === "Created_On" || key === "Agreement_Signing_Date" || key === "NDA_Signing_Date") {
                    agreementMasterObj[key] = objRequest[key];
                } else {
                    agreementMasterObj[key] = parseInt(objRequest[key]);
                }
            }
            agreementMasterObj['Modified_On'] = new Date();
            integration_agreement.update({'Insurer': insurer_id}, {$set: agreementMasterObj}, function (err, numAffected) {
                if (err) {
                    res.json({"Status": "Fail", "Msg": "Integration agreement master not updated."});
                } else {
                    res.json({"Status": "Success", "Msg": "Integration agreement master updated successfully."});
                }
            });
        } catch (ex) {
            console.error('Exception', 'update Integration agreement master service', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });

};