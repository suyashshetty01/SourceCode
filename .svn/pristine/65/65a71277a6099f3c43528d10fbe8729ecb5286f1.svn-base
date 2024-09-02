/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var lms_data = require('../models/lms_data');
var Base = require('../libs/Base');
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database


module.exports.controller = function (app) {
    app.get('/lms_product_types', function (req, res) {
        var lms_product_type = require('../models/lms_product_type');
        lms_product_type.find(function (err, dbProductData) {
            if (err) {

            } else {
                if (dbProductData) {
                    console.log(dbProductData);
                    res.send(dbProductData);
                }
            }
        });
    });

    app.get('/lms_sub_product_types/:product_type', function (req, res) {
        var lms_sub_product_type = require('../models/lms_sub_product_type');
        if (req.params.product_type) {
            lms_sub_product_type.find({lm_product_id: parseInt(req.params.product_type)}, function (err, dbSubProductData) {
                if (err) {

                } else {
                    if (dbSubProductData) {
                        console.log(dbSubProductData);
                        res.send(dbSubProductData);
                    }
                }
            });
        } else {
            res.send('Invalid Product Type');
        }
    });

    app.post('/lms_lead_save', function (req, res) {
        try {
            var objRequest = req.body;
            var Lead_Id = objRequest['Lead_Id'];
            if (Lead_Id !== null && Lead_Id !== "" && Lead_Id !== undefined) {
                objRequest['Modified_On'] = new Date();
                lms_data.update({'Lead_Id': Lead_Id}, objRequest, function (err, numaffected) {
                    res.json({"Msg": "Lead Updated Successfully.", "Status": "Success"});
                });
            } else {
                var lms_dataobj = new lms_data(objRequest);
                lms_dataobj.save(function (err) {
                    res.json({"Msg": "Lead Created Successfully.", "Status": "Success"});
                });
            }
        } catch (e) {
            console.log(e);
            res.json({"Msg": e, "Status": "Fail"});
        }
    });
    
    app.post('/lms_lead_datas', function (req, res) {
        try {
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: 'Lead_Id Customer_name Mobile_no Email Product_name Sub_product_name Status Product_id Sub_product_id',
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            if (req.body.Created_by !== undefined) {
                filter["Created_by"] = req.body.Created_by;
            }
            if (req.body.mobile !== undefined) {
                filter["Mobile_no"] = parseInt(req.body.mobile);
            }
            if (req.body.customerName !== undefined) {
                filter["Customer_name"] = req.body.customerName;
            }
            if (req.body.Product_type !== undefined && req.body.Product_type !== "-- Select Product Type --") {
                filter["Product_name"] = req.body.Product_type;
            }
            if (req.body.SubProduct_type !== undefined && req.body.SubProduct_type !== "-- Select Sub-Product Type --") {
                filter["Sub_product_name"] = req.body.SubProduct_type;
            }
            var lms_datas = require('../models/lms_data');

            lms_datas.paginate(filter, optionPaginate).then(function (lms_datas) {
                res.json(lms_datas);
            });
        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });

    app.get('/lms_forms_master/:product_type/:sub_product_type', function (req, res) {
        try {
            var product_id = parseInt(req.params['product_type']);
            var subproduct_id = parseInt(req.params['sub_product_type']);
            var Conditions = {"lms_product_id": {$in: [0, product_id]}, "lms_sub_product_id": {$in: [0, subproduct_id]}};
            var resultArray = {"basic": null
                , "full": null
                , "global": null};
            var basicmaster = [];
            var fullmaster = [];
            var globalmaster = [];
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                var lms_forms_master = db.collection('lms_forms_master').find(Conditions, {_id: 0});
                lms_forms_master.forEach(function (doc, err) {

                    if (doc.form_category === "basic") {
                        basicmaster.push(doc);
                    } else if (doc.form_category === "full") {
                        fullmaster.push(doc);
                    } else {
                        globalmaster.push(doc);
                    }

                }, function () {
                    resultArray["basic"] = basicmaster;
                    resultArray["full"] = fullmaster;
                    resultArray["global"] = globalmaster;
                    res.json(resultArray);
                });
            });

        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });

    app.post('/lms_lead_datas', function (req, res) {
        try {
            var lms_datas = require('../models/lms_data');
            lms_datas.find(function (err, dblmsData) {
                if (err) {

                } else {
                    if (dblmsData) {
                        console.log(dblmsData);
                        res.send(dblmsData);
                    }
                }
            });
        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });
    
    app.get('/get_lms_lead_data/:lead_id', function (req, res) {
        try {
            var Lead_Id = req.params['lead_id'];
            var Condition = {};
            if (Lead_Id !== null || Lead_Id !== "") {
                Condition = {"Lead_Id": Lead_Id};
            }

            var lms_datas = require('../models/lms_data');
            lms_datas.find(Condition, function (err, dblmsData) {
                if (err) {

                } else {
                    if (dblmsData) {
                        console.log(dblmsData);
                        res.send(dblmsData);
                    }
                }
            });
        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });
};