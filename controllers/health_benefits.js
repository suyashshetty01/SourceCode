/* Author: Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var sleep = require('system-sleep');
var fs = require('fs');
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var health_benefits = require('../models/health_benefit');
var health_advance_benefits = require('../models/health_advance_benefits');
var product = require('../models/product');
var benefits_key_value = require('../models/benefits_key_value');
module.exports.controller = function (app) {
    app.get('/benefits/:insurer_id/:plan_code/:cover_type/:health_insurance_si', function (req, res) {
        var plan_code = req.params.plan_code;
        var insurer_id = req.params.insurer_id;
        var cover_type = req.params.cover_type;
        var health_insurance_si = req.params.health_insurance_si;
//        if (insurer_id === "42") {
//            plan_code = "296";
//        }
//        if (insurer_id === "34") {
//            plan_code = "81";
//        }
        if (insurer_id === "46") {
            if (plan_code === '320' || plan_code === '321' || plan_code === '324' || plan_code === '325' || plan_code === '328' || plan_code === '329' || plan_code === '331') {
                plan_code = "314";
            }
            if (plan_code === '322' || plan_code === '326' || plan_code === '330') {
                plan_code = "315";
            }
            if (plan_code === '323' || plan_code === '327') {
                plan_code = "316";
            }
        }
        if (insurer_id === "21") {
            if (plan_code === '13' || plan_code === '20' || plan_code === '23') {
                plan_code = "9";
            }
            if (plan_code === '14' || plan_code === '21' || plan_code === '24') {
                plan_code = "10";
            }
            if (plan_code === '15' || plan_code === '22' || plan_code === '25') {
                plan_code = "11";
            }
            if (plan_code === '17' || plan_code === '26' || plan_code === '27') {
                plan_code = "16";
            }
        }

        health_benefits.find({$or: [{Cover_Type: null}, {Cover_Type: cover_type}], Insurer_Id: insurer_id, Plan_Code: plan_code}, function (err, HealthBenefit) {
            if (err)
                res.send(err);
            for (var i = 0; i < HealthBenefit.length; i++)
            {
                if (HealthBenefit[i]['_doc'].hasOwnProperty('Custom_Tag') && HealthBenefit[i]['_doc']['Custom_Tag'].hasOwnProperty('health_insurance_si') && HealthBenefit[i]['_doc']['Custom_Tag']['health_insurance_si'].hasOwnProperty(health_insurance_si))
                {
                    HealthBenefit[i]['_doc']['Benefit_Value'] = HealthBenefit[i]['_doc']['Custom_Tag']['health_insurance_si'][health_insurance_si];
                }
            }
            res.json(HealthBenefit);
        });
    });

    app.get('/health_benefits/advance_benefits/:insurer_id/:plan_code/:cover_type/:health_insurance_si', function (req, res) {
        try {
            var plan_code = JSON.parse(req.params.plan_code);
            var insurer_id = JSON.parse(req.params.insurer_id);
            var cover_type = req.params.cover_type;
            var health_insurance_si = req.params.health_insurance_si;
//        if (insurer_id === "42") {
//            plan_code = "296";
//        }
//        if (insurer_id === "34") {
//            plan_code = "81";
//        }
            if (insurer_id === "46") {
                if (plan_code === '320' || plan_code === '321' || plan_code === '324' || plan_code === '325' || plan_code === '328' || plan_code === '329' || plan_code === '331') {
                    plan_code = "314";
                }
                if (plan_code === '322' || plan_code === '326' || plan_code === '330') {
                    plan_code = "315";
                }
                if (plan_code === '323' || plan_code === '327') {
                    plan_code = "316";
                }
            }
            if (insurer_id === "21") {
                if (plan_code === '13' || plan_code === '20' || plan_code === '23') {
                    plan_code = "9";
                }
                if (plan_code === '14' || plan_code === '21' || plan_code === '24') {
                    plan_code = "10";
                }
                if (plan_code === '15' || plan_code === '22' || plan_code === '25') {
                    plan_code = "11";
                }
                if (plan_code === '17' || plan_code === '26' || plan_code === '27') {
                    plan_code = "16";
                }
            }

            health_advance_benefits.find({Insurer_Id: insurer_id, Plan_ID: plan_code, Insurance_Cover: health_insurance_si}, function (err, HealthBenefit) {
                if (err)
                    res.send(err);
                for (var i = 0; i < HealthBenefit.length; i++)
                {
                    if (HealthBenefit[i]['_doc'].hasOwnProperty('Custom_Tag') && HealthBenefit[i]['_doc']['Custom_Tag'].hasOwnProperty('health_insurance_si') && HealthBenefit[i]['_doc']['Custom_Tag']['health_insurance_si'].hasOwnProperty(health_insurance_si))
                    {
                        HealthBenefit[i]['_doc']['Benefit_Value'] = HealthBenefit[i]['_doc']['Custom_Tag']['health_insurance_si'][health_insurance_si];
                    }
                }
                res.json(HealthBenefit);
            });
        } catch (e) {
            console.log('error', e.stack);
            res.json(e.stack);
        }
    });

    app.get('/getNewbenefits/:insurer_id/:plan_id/:health_insurance_si', function (req, res) {
        var benefits = [];
        var plan_id = req.params.plan_id;
        var insurer_id = req.params.insurer_id;
        var health_insurance_si = req.params.health_insurance_si;
        var health_benefit_insurer = require('../models/health_benefits_insurer');
        health_benefit_insurer.find({$and: [{"SI": {"$in": ["All", health_insurance_si]}}, {"Insurer_Id": parseInt(insurer_id)}, {"Plan_Id": parseInt(plan_id)}]}, function (err, NewHealthBenefit) {
            if (err)
                res.send(err);
            for (var i = 0; i < NewHealthBenefit.length; i++)
            {
                if (NewHealthBenefit[i]['_doc'])
                {
                    benefits[i] = NewHealthBenefit[i]['_doc'];
                }
            }
            res.json(benefits);
        });
    });
    app.get('/InsurerDetails', function (req, res) {
        try {
            product.find({Product_Name: "Health Insurance"}, function (err, InsurerData) {
                if (err) {
                    res.send(err);
                } else {
                    var arr_premium_response = {
                        'Response': []
                    };
                    var res1 = [];
                    var AllResponse = InsurerData[0]._doc.Integration_List;
                    for (var i = 0; i < AllResponse.length; i++) {
                        if (AllResponse[i].Is_Active === 1) {
                            res1.push({
                                "Insurer_Id": AllResponse[i]['Insurer_ID'],
                                "Insurer_Name": AllResponse[i].Name.split('::')[0],
                                "Plan_List": AllResponse[i].Plan_List
                            });
                        }
                    }
                    for (var l = 0; l < res1.length; l++) {
                        for (var k = 0; k < res1[l].Plan_List.length; k++) {
                            res1[l].Plan_List = res1[l].Plan_List.filter(res => {
                                return res.Is_Active === true;
                            });
                        }
                    }
                    arr_premium_response['Response'] = res1;
                    res.json(arr_premium_response);
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });
    app.post('/admin_benefits', function (req, res) {

        try {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            var ObjRequest = req.body;
            if (ObjRequest.Insurer_Id !== undefined && ObjRequest.Plan_Id !== undefined && ObjRequest.SI !== undefined) {

                var health_benefit_insurer = require('../models/health_benefits_insurer');
                if (ObjRequest.SI === "All") {
                    filter["Insurer_Id"] = ObjRequest.Insurer_Id;
                    filter["Plan_Id"] = ObjRequest.Plan_Id;
                    filter["Plan_Name"] = ObjRequest.Plan_Name;
                    filter["SI"] = "All";
                    health_benefit_insurer.paginate(filter, optionPaginate).then(function (data) {
                        res.json(data);
                    });
                } else {
//                    filter["Insurer_Id"] = ObjRequest.Insurer_Id;
//                    filter["Plan_Id"] = ObjRequest.Plan_Id;
//                    filter["Plan_Name"] = ObjRequest.Plan_Name;
//                    filter["SI"] = ObjRequest.SI;
//                    health_benefit_insurer.paginate(filter, optionPaginate).then(function (data) {
//                        res.json(data);
//                    });
                    health_benefit_insurer.paginate({
                        $and: [
                            {"SI": {"$in": ["All", ObjRequest.SI]}},
                            {"Insurer_Id": parseInt(ObjRequest.Insurer_Id)},
                            {"Plan_Id": parseInt(ObjRequest.Plan_Id)}
                        ]
                    }, optionPaginate).then(function (data) {
                        res.json(data);
                    });
                }
            }
        } catch (e) {
            console.error(e);
            res.json({"Msg": "error"});
        }
    });
    app.post('/update_health_benefits_insurer', function (req, res) {
        objResponse = req.body;
        var exist = false;
        let data = {
            "Insurer_Id": parseInt(objResponse.Insurer_Id),
            "Plan_Id": parseInt(objResponse.Plan_Id),
            "Benefit_Key": objResponse.Benefit_Name,
            "Benefit_Value": objResponse.Edit_old_value,
            "SI": objResponse.Edit_old_si,
            "Score": parseInt(objResponse.Edit_old_score)
        };
        var argAll = {
            "Insurer_Id": parseInt(objResponse.Insurer_Id),
            "Plan_Id": parseInt(objResponse.Plan_Id),
            "Benefit_Key": objResponse.Benefit_Name,
            "SI": objResponse.Edit_SI
        };
        var existEntry = {
            "Insurer_Id": parseInt(objResponse.Insurer_Id),
            "Plan_Id": parseInt(objResponse.Plan_Id),
            "Benefit_Key": objResponse.Benefit_Name
        };
        var health_benefit_insurer = require('../models/health_benefits_insurer');
        health_benefit_insurer.find(existEntry, function (err, existEntryCheck) {
            if (err) {
                res.send(err);
            } else {
                for (var i = 0; i < existEntryCheck.length; i++) {
                    if (objResponse.Edit_SI === "All" && existEntryCheck[i]['_doc']['SI'] !== 'All') {
                        exist = true;
                    }
                }
                if (exist === true) {
                    health_benefit_insurer.remove(existEntry, function (err, removematch) {
                        if (err) {
                            res.send(err);
                        } else {
                            let Adddata = {
                                "Insurer_Id": parseInt(objResponse.Insurer_Id),
                                "Plan_Id": parseInt(objResponse.Plan_Id),
                                "Plan_Name": objResponse.Plan_Name,
                                "SI": objResponse.Edit_SI,
                                "Benefit_Key": objResponse.Benefit_Name,
                                "Benefit_Value": objResponse.Edit_Value,
                                "Score": parseInt(objResponse.Edit_Score)
                            };
                            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                                if (err)
                                    throw err;
                                var benefits_insurer = db.collection('health_benefits_insurers');
                                benefits_insurer.insertOne(Adddata, function (err, res1) {
                                    if (err) {
                                        res.json({'Msg': 'Fail'});
                                    } else {
                                        console.log('Successfully add in Health Benefits');
                                        res.json({'Msg': 'Success'});
                                    }
                                    db.close();
                                });
                            });
                        }
                    });
                } else {
                    health_benefit_insurer.find(argAll, function (err, getUpdateData) {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log(getUpdateData);
                            if (getUpdateData.length > 0) {
                                if (objResponse.Benefit_Name === objResponse.Benefit_Name && objResponse.Edit_old_si === objResponse.Edit_SI) {
                                    let updateData = {
                                        "Insurer_Id": parseInt(objResponse.Insurer_Id),
                                        "Plan_Id": parseInt(objResponse.Plan_Id),
                                        "Benefit_Key": objResponse.Benefit_Name,
                                        "Benefit_Value": objResponse.Edit_Value,
                                        "SI": objResponse.Edit_SI,
                                        "Score": parseInt(objResponse.Edit_Score)
                                    };
                                    health_benefit_insurer.aggregate([{$match: updateData}], function (err, matchData) {
                                        if (err) {
                                            res.send(err);
                                        } else {
                                            if (matchData.length > 0) {
                                                res.json({'Msg': 'Already Exist'});
                                            } else {
                                                let newData = {"Benefit_Value": objResponse.Edit_Value, "SI": objResponse.Edit_SI, "Score": parseInt(objResponse.Edit_Score)};
                                                health_benefit_insurer.update(data, {$set: newData}, function (err, updatedData) {
                                                    if (err) {
                                                        res.json({'Msg': 'Fail'});
                                                    } else {
                                                        console.log('Successfully updated in Health Benefits');
                                                        res.json({'Msg': 'Success'});
                                                    }
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    res.json({'Msg': 'Already Exist'});
                                }
                            } else {
                                let newData = {"Benefit_Value": objResponse.Edit_Value, "SI": objResponse.Edit_SI, "Score": parseInt(objResponse.Edit_Score)};
                                health_benefit_insurer.update(data, {$set: newData}, function (err, updatedData) {
                                    if (err) {
                                        res.json({'Msg': 'Fail'});
                                    } else {
                                        console.log('Successfully updated in Health Benefits');
                                        res.json({'Msg': 'Success'});
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });
    app.get('/benefits_key_value', function (req, res) {
        var benefits_master_data = [];
        var benefit_key_name = [];
        try {
            benefits_key_value.find({}, function (err, HealthBenefitMaster) {
                if (err)
                    res.send(err);
                for (var i = 0; i < HealthBenefitMaster.length; i++)
                {
                    if (HealthBenefitMaster[i].hasOwnProperty('_doc') && HealthBenefitMaster[i]['_doc'].hasOwnProperty('Key') && HealthBenefitMaster[i]['_doc'].hasOwnProperty('Value')) {
                        benefit_key_name.push(HealthBenefitMaster[i]['_doc']['Key']);
                        if (HealthBenefitMaster[i]['_doc']['Value'].length !== null) {
                            for (var j = 0; j < HealthBenefitMaster[i]['_doc']['Value'].length; j++) {

                                benefits_master_data.push({"Key": HealthBenefitMaster[i]['_doc']['Key'], "Value": HealthBenefitMaster[i]['_doc']['Value'][j]['Value'], "Score": HealthBenefitMaster[i]['_doc']['Value'][j]['Score']});
                            }
                        }
                    }
                }
                res.json({"Benfit_master_data": benefits_master_data, "Key": benefit_key_name});
            });
        } catch (e) {
            console.error(e);
            res.json({"Msg": "error"});
        }
    });
    app.get('/insurer_benefits_key_value', function (req, res) {
        var benefits_master_data = [];
        var benefit_key_name = [];
        try {
            benefits_key_value.find({}, function (err, HealthBenefitMaster) {
                if (err)
                    res.send(err);
                for (var i = 0; i < HealthBenefitMaster.length; i++)
                {
                    if (HealthBenefitMaster[i].hasOwnProperty('_doc') && HealthBenefitMaster[i]['_doc'].hasOwnProperty('Key') && HealthBenefitMaster[i]['_doc'].hasOwnProperty('Value')) {
                        if (HealthBenefitMaster[i]['_doc']['Value'].length > 0) {
                            benefit_key_name.push(HealthBenefitMaster[i]['_doc']['Key']);
                        }
                        if (HealthBenefitMaster[i]['_doc']['Value'].length !== null) {
                            for (var j = 0; j < HealthBenefitMaster[i]['_doc']['Value'].length; j++) {

                                benefits_master_data.push({"Key": HealthBenefitMaster[i]['_doc']['Key'], "Value": HealthBenefitMaster[i]['_doc']['Value'][j]['Value'], "Score": HealthBenefitMaster[i]['_doc']['Value'][j]['Score']});
                            }
                        }
                    }
                }
                res.json({"Benfit_master_data": benefits_master_data, "Key": benefit_key_name});
            });
        } catch (e) {
            console.error(e);
            res.json({"Msg": "error"});
        }
    });
    app.post('/add_benefits_key', function (req, res) {
        var keyname = req.body.AddKeyName;
        var keyvalue = req.body.AddKeyValue;
        var keyscore = req.body.AddKeyScore;
        let data = {"Key": keyname};
        let newData = {"Value": keyvalue, Score: keyscore};
        benefits_key_value.update(data, {$push: {"Value": {$each: [newData]}}}, function (err, updatedData) {
            if (err) {
                res.json({'Msg': 'Fail'});
            } else {
                console.log('Successfully Inserted in benefits_key_value');
                res.json({'Msg': 'Success'});
            }
        });
    });
    app.post('/update_benefits_value', function (req, res) {
        var benefit_name = req.body.Benefit_Name;
        var old_edit_value = req.body.old_Edit_Value;
        var new_edit_value = req.body.new_Edit_Value;
        var edit_score = req.body.Edit_Score;
        let data = {"Key": benefit_name, "Value.Value": old_edit_value};
        let newData = {"Value.$.Value": new_edit_value, "Value.$.Score": edit_score};
        benefits_key_value.update(data, {$set: newData}, function (err, updatedData) {
            if (err) {
                res.json({'Msg': 'Fail'});
            } else {
                console.log('Successfully updated in benefits_key_value');
                res.json({'Msg': 'Success'});
            }
        });
    });
    app.post('/add_benefit_insurer', function (req, res) {
        var arg = {};
        var Summary = {
            'Status': ''
        };
        var ins_id = req.body.Insurer_Id;
        var plan_id = req.body.Plan_Id;
        var plan_name = req.body.Plan_Name;
        var si = req.body.SI;
        var benefit_key = req.body.Benefit_Key;
        var benefit_value = req.body.Benefit_Value;
        var score = req.body.Score;
        var arg = {
            Insurer_Id: parseInt(ins_id),
            Plan_Id: parseInt(plan_id),
            Plan_Name: plan_name,
            SI: si,
            Benefit_Key: benefit_key,
            Benefit_Value: benefit_value,
            Score: parseInt(score)
        };
        var argAll = {
            Insurer_Id: parseInt(ins_id),
            Plan_Id: parseInt(plan_id),
            Plan_Name: plan_name,
            Benefit_Key: benefit_key
        };
        var health_benefit_insurer = require('../models/health_benefits_insurer');
        health_benefit_insurer.find(argAll, function (err, getAllData) {
            if (err) {
                res.send(err);
            } else {
                console.log(getAllData);
                if (getAllData.length > 0) {
                    for (var i = 0; i < getAllData.length; i++) {
                        if (getAllData[i]['_doc']['SI'] === "All") {
                            Summary.Status = 'Already Exist';
                        } else if (si === "All" && getAllData[i]['_doc']['SI'] !== "All") {
                            Summary.Status = 'Exist';
                        }
                    }
                    if (Summary.Status === "") {
                        var arg1 = {
                            Insurer_Id: parseInt(ins_id),
                            Plan_Id: parseInt(plan_id),
                            Plan_Name: plan_name,
                            SI: si,
                            Benefit_Key: benefit_key
                        };
                        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                            if (err)
                                throw err;
                            var health_benefit_insurer = require('../models/health_benefits_insurer');
                            health_benefit_insurer.find(arg1, function (err, dbBenefitData) {
                                if (err) {
                                    throw err;
                                } else {
                                    if (dbBenefitData.length === 0) {
                                        var benefits_insurer = db.collection('health_benefits_insurers');
                                        benefits_insurer.insertOne(arg, function (err, res1) {
                                            if (err) {
                                                Summary.Status = err;
                                            } else {
                                                Summary.Status = 'SUCCESS';
                                            }
                                            res.json(Summary);
                                            db.close();
                                        });
                                    } else {
                                        Summary.Status = 'Already Exist';
                                        res.json(Summary);
                                    }
                                }
                            });
                        });
                    } else {
                        res.json(Summary);
                    }
                } else {
                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                        if (err)
                            throw err;
                        var benefits_insurer = db.collection('health_benefits_insurers');
                        benefits_insurer.insertOne(arg, function (err, res1) {
                            if (err) {
                                Summary.Status = err;
                            } else {
                                Summary.Status = 'SUCCESS';
                            }
                            res.json(Summary);
                            db.close();
                        });
                    });
                }
            }
        });
    });
    app.get('/get_insurer/:product_id', function (req, res) {
        var product_id = parseInt(req.params.product_id);
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            if (err)
                throw err;
            var insurer = db.collection('insurer_product_plan_master');
            insurer.aggregate([{"$match": {Product_Id: {"$in": [product_id]}}},
                {"$group": {"_id": {Insurer_Name: "$Insurer_Name", Insurer_Id: "$Insurer_Id"}}},
                {"$sort": {Insurer_Name: 1, _id: 1}}]).toArray(function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(data);
                }
            });
        });
    });
    app.get('/get_plan/:product_id/:insurer_id', function (req, res) {
        var product_id = parseInt(req.params.product_id);
        var insurer_id = parseInt(req.params.insurer_id);
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            if (err)
                throw err;
            var insurer_plan = db.collection('insurer_product_plan_master');
            insurer_plan.aggregate([{"$match": {Product_Id: {"$in": [product_id]}, Insurer_Id: {"$in": [insurer_id]}}},
                {"$group": {"_id": {Plan_Name: "$Plan_Name", Plan_Id: "$Plan_Id"}}},
                {"$sort": {Plan_Name: 1, _id: 1}}]).toArray(function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(data);
                }
            });
        });
    });
    app.post('/getAdvisoryScore', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let objReq = req.body;
            let ScoreMaster = [];
            if (fs.existsSync(appRoot + "/tmp/cachemaster/advisory_score_master.log")) {
                var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/advisory_score_master.log").toString();
                ScoreMaster = JSON.parse(cache_content);
            } else {
                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                    if (err)
                        throw err;
                    let score_master = db.collection('health_benefits_score_master');
                    score_master.find({}, {_id: 0}).toArray(function (err, scoreMaster) {
                        if (err) {
                            res.send(err);
                        } else {
                            ScoreMaster = scoreMaster;
                            fs.writeFile(appRoot + "/tmp/cachemaster/advisory_score_master.log", JSON.stringify(scoreMaster), function (err) {
                                if (err) {
                                    return console.error(err);
                                }
                            });
                        }
                    });
                });
            }
            let insWeight = require('../resource/request_file/AdvisoryInsurerWeight.json');

            let request = {
                "search_reference_number": objReq.ref_no,
                "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW"
            };
            let args = {
                data: JSON.stringify(request),
                headers: {"Content-Type": "application/json;charset=utf-8"}
            };
            let url = ((config.environment.name === 'Production') ? 'https://horizon.policyboss.com:5443' : 'http://localhost:3000') + "/quote/premium_list_db";
            client.post(url, args, function (data1, response) {
                if (data1.hasOwnProperty('Response') && data1.Response.length > 0) {
                    let preferred_plans = [];
                    let ins_list = data1.Response;
                    let lm_request = data1.Summary['Request_Core'];
                    let existing_insurer = lm_request.existing_insurer_id;
                    let existing_plan = lm_request.existing_plan_id;
                    if (ins_list.length > 0) {
                        let index = ins_list.findIndex(x => x.Insurer_Id === existing_insurer);
                        if (index > -1) {
                            let plan_index = ins_list[index].Plan_List.findIndex(x => x.Plan_Id === existing_plan);
                            if (plan_index > -1) {
                                let insWtIndex = insWeight.findIndex(a => a.Insurer_Id === existing_insurer);
                                let scoringBenefits = [];
                                let url = "https://horizon.policyboss.com:5443/benefits/" + existing_insurer + "/" + existing_plan + "/" + lm_request.health_insurance_type + "/" + ins_list[index].Plan_List[plan_index].Sum_Insured;
                                client.get(url, function (data2, response) {
                                    if (data2.length > 0) {
                                        let total_score = 0;
                                        let final_advisory = 0;
                                        let basic_quote = 0;
                                        let wt_percent = insWeight[insWtIndex].Weightage_Percent / 100;
                                        for (let j = 0; j < data2.length; j++) {
                                            let objKey = ScoreMaster.findIndex(s => s['Feature Key'] === data2[j].Benefit_Key && s['Feature Value'] === data2[j].Benefit_Value);
                                            if (objKey > -1) {
                                                total_score += ScoreMaster[objKey]['FeatureWeightedScore'];
                                                final_advisory += ScoreMaster[objKey]['Feature Score'];
                                                scoringBenefits.push(data2[j]);
                                            }
                                        }
                                        basic_quote = Number((total_score * wt_percent).toFixed(1));
                                        final_advisory = Number(((final_advisory / 10) * wt_percent).toFixed(1));
                                        total_score = Number(total_score.toFixed(1));
                                        preferred_plans.push({"Existing_Plan": ins_list[index].Plan_List[plan_index], "Benefits": scoringBenefits, "Score": {"BasicScore": basic_quote, "Final_Advisory": final_advisory, "TotalScore": total_score}});
                                    }
                                });
                            }
                        }
                        for (let x = 0; x < ins_list.length; x++) {
                            let planScores = [];
                            if (x !== index) {
                                let insWtIndex = insWeight.findIndex(a => a.Insurer_Id === ins_list[x].Insurer_Id);
                                for (let k = 0; k < ins_list[x].Plan_List.length; k++) {
                                    let planBenefits = [];
                                    let url = "https://horizon.policyboss.com:5443/benefits/" + ins_list[x].Insurer_Id + "/" + ins_list[x].Plan_List[k].Plan_Id + "/" + lm_request.health_insurance_type + "/" + ins_list[x].Plan_List[0].Sum_Insured;
                                    client.get(url, function (data, response) {
                                        if (data.length > 0) {
                                            let total_score = 0;
                                            let final_advisory = 0;
                                            let basic_quote = 0;
                                            let wt_percent = insWeight[insWtIndex].Weightage_Percent / 100;
                                            for (let j = 0; j < data.length; j++) {
                                                let objKey = ScoreMaster.findIndex(s => s['Feature Key'].toUpperCase() === data[j].Benefit_Key.toUpperCase() && s['Feature Value'].toUpperCase() === data[j].Benefit_Value.toUpperCase());
                                                if (objKey > -1) {
                                                    total_score += ScoreMaster[objKey]['FeatureWeightedScore'];
                                                    final_advisory += ScoreMaster[objKey]['Feature Score'];
                                                    planBenefits.push(data[j]);
                                                }
                                            }
                                            basic_quote = Number((total_score * wt_percent).toFixed(1));
                                            final_advisory = Number(((final_advisory / 10) * wt_percent).toFixed(1));
                                            total_score = Number(total_score.toFixed(1));
                                            planScores.push({"plan_index": data[0].Plan_Code, "benefits": planBenefits, "score": {"BasicScore": basic_quote, "Final_Advisory": final_advisory, "TotalScore": total_score}});
                                        }
                                    });
                                }
                                sleep(500);
                                planScores.sort(function (a, b) {
                                    if (a.benefits['TotalScore'] < b.benefits['TotalScore']) {
                                        return 1;
                                    } else if (a.benefits['TotalScore'] > b.benefits['TotalScore']) {
                                        return -1;
                                    } else {
                                        return 0;
                                    }
                                });
                                if (planScores.length > 0) {
                                    let pushIndex = ins_list[x].Plan_List.findIndex(p => p.Plan_Id === parseInt(planScores[0].plan_index));
                                    if (pushIndex > -1)
                                        preferred_plans.push({"Recommended_Plan": ins_list[x].Plan_List[pushIndex], "Benefits": planScores[0].benefits, Score: planScores[0].score});
                                }
                            }
                        }
                    }
                    preferred_plans.push({"Summary": data1.Summary});
                    res.json(preferred_plans);
                }
            });
        } catch (ex) {
            console.error('Exception in Advisory Score-', ex);
        }
    });
    app.post('/getAdvisoryFilterScore', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let objReq = req.body;
            let filterBenefits = objReq.filter_benefits.split(",");
            let ScoreMaster = [];
            if (fs.existsSync(appRoot + "/tmp/cachemaster/advisory_score_master.log")) {
                var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/advisory_score_master.log").toString();
                ScoreMaster = JSON.parse(cache_content);
            } else {
                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                    if (err)
                        throw err;
                    let score_master = db.collection('health_benefits_score_master');
                    score_master.find({}, {_id: 0}).toArray(function (err, scoreMaster) {
                        if (err) {
                            res.send(err);
                        } else {
                            ScoreMaster = scoreMaster;
                            fs.writeFile(appRoot + "/tmp/cachemaster/advisory_score_master.log", JSON.stringify(scoreMaster), function (err) {
                                if (err) {
                                    return console.error(err);
                                }
                            });
                        }
                    });
                });
            }
            let insWeight = require('../resource/request_file/AdvisoryInsurerWeight.json');

            let request = {
                "search_reference_number": objReq.ref_no,
                "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW"
            };
            let args = {
                data: JSON.stringify(request),
                headers: {"Content-Type": "application/json;charset=utf-8"}
            };
            let url = ((config.environment.name === 'Production') ? 'https://horizon.policyboss.com:5443' : 'http://localhost:3000') + "/quote/premium_list_db";
            client.post(url, args, function (data1, response) {
                if (data1.hasOwnProperty('Response') && data1.Response.length > 0) {
                    let preferred_plans = [];
                    let ins_list = data1.Response;
                    let lm_request = data1.Summary['Request_Core'];
                    let existing_insurer = lm_request.existing_insurer_id;
                    let existing_plan = lm_request.existing_plan_id;
                    if (ins_list.length > 0) {
                        let index = ins_list.findIndex(x => x.Insurer_Id === existing_insurer);
                        if (index > -1) {
                            let plan_index = ins_list[index].Plan_List.findIndex(x => x.Plan_Id === existing_plan);
                            if (plan_index > -1) {
                                let insWtIndex = insWeight.findIndex(a => a.Insurer_Id === existing_insurer);
                                let scoringBenefits = [];
                                let url = "https://horizon.policyboss.com:5443/benefits/" + existing_insurer + "/" + existing_plan + "/" + lm_request.health_insurance_type + "/" + ins_list[index].Plan_List[plan_index].Sum_Insured;
                                client.get(url, function (data2, response) {
                                    if (data2.length > 0) {
                                        let total_score = 0;
                                        let final_advisory = 0;
                                        let basic_quote = 0;
                                        let wt_percent = insWeight[insWtIndex].Weightage_Percent / 100;
                                        for (let j = 0; j < data2.length; j++) {
                                            let objKey = ScoreMaster.findIndex(s => s['Feature Key'].toUpperCase() === data2[j].Benefit_Key.toUpperCase() && s['Feature Value'].toUpperCase() === data2[j].Benefit_Value.toUpperCase());
                                            if (objKey > -1) {
                                                for (let b = 0; b < filterBenefits.length; b++) {
                                                    if (filterBenefits[b].trim() === data2[j].Benefit_Key) {
                                                        total_score += ScoreMaster[objKey]['FeatureWeightedScore'];
                                                        final_advisory += ScoreMaster[objKey]['Feature Score'];
                                                    }
                                                }
                                                scoringBenefits.push(data2[j]);
                                            }
                                        }
                                        basic_quote = Number((total_score * wt_percent).toFixed(1));
                                        final_advisory = Number(((final_advisory / filterBenefits.length) * wt_percent).toFixed(1));
                                        total_score = Number(total_score.toFixed(1));
                                        preferred_plans.push({"Existing_Plan": ins_list[index].Plan_List[plan_index], "Benefits": scoringBenefits, "Score": {"BasicScore": basic_quote, "Final_Advisory": final_advisory, "TotalScore": total_score}});
                                    }
                                });
                            }
                        }
                        for (let x = 0; x < ins_list.length; x++) {
                            let planScores = [];
                            if (x !== index) {
                                let insWtIndex = insWeight.findIndex(a => a.Insurer_Id === ins_list[x].Insurer_Id);
                                for (let k = 0; k < ins_list[x].Plan_List.length; k++) {
                                    let planBenefits = [];
                                    let url = "https://horizon.policyboss.com:5443/benefits/" + ins_list[x].Insurer_Id + "/" + ins_list[x].Plan_List[k].Plan_Id + "/" + lm_request.health_insurance_type + "/" + ins_list[x].Plan_List[0].Sum_Insured;
                                    client.get(url, function (data, response) {
                                        if (data.length > 0) {
                                            let total_score = 0;
                                            let final_advisory = 0;
                                            let basic_quote = 0;
                                            let wt_percent = insWeight[insWtIndex].Weightage_Percent / 100;
                                            for (let j = 0; j < data.length; j++) {
                                                let objKey = ScoreMaster.findIndex(s => s['Feature Key'].toUpperCase() === data[j].Benefit_Key.toUpperCase() && s['Feature Value'].toUpperCase() === data[j].Benefit_Value.toUpperCase());
                                                if (objKey > -1) {
                                                    for (let b = 0; b < filterBenefits.length; b++) {
                                                        if (filterBenefits[b].trim() === data[j].Benefit_Key) {
                                                            total_score += ScoreMaster[objKey]['FeatureWeightedScore'];
                                                            final_advisory += ScoreMaster[objKey]['Feature Score'];
                                                        }
                                                    }
                                                    planBenefits.push(data[j]);
                                                }
                                            }
                                            basic_quote = Number((total_score * wt_percent).toFixed(1));
                                            final_advisory = Number(((final_advisory / filterBenefits.length) * wt_percent).toFixed(1));
                                            total_score = Number(total_score.toFixed(1));
                                            planScores.push({"plan_index": data[0].Plan_Code, "benefits": planBenefits, "score": {"BasicScore": basic_quote, "Final_Advisory": final_advisory, "TotalScore": total_score}});
                                        }
                                    });
                                }
                                sleep(500);
                                planScores.sort(function (a, b) {
                                    if (a.benefits['TotalScore'] < b.benefits['TotalScore']) {
                                        return 1;
                                    } else if (a.benefits['TotalScore'] > b.benefits['TotalScore']) {
                                        return -1;
                                    } else {
                                        return 0;
                                    }
                                });
                                if (planScores.length > 0) {
                                    let pushIndex = ins_list[x].Plan_List.findIndex(p => p.Plan_Id === parseInt(planScores[0].plan_index));
                                    if (pushIndex > -1)
                                        preferred_plans.push({"Recommended_Plan": ins_list[x].Plan_List[pushIndex], "Benefits": planScores[0].benefits, Score: planScores[0].score});
                                }
                            }
                        }
                    }
                    preferred_plans.push({"Summary": data1.Summary});
                    res.json(preferred_plans);
                }
            });
        } catch (ex) {
            console.error('Exception in Advisory filter Score-', ex);
        }
    });
    app.get('/getFinalAdvisory/:insurer_id/:plan_id/:health_si/:is_existing', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let insurer_id = parseInt(req.params.insurer_id);
            let plan_id = parseInt(req.params.plan_id);
            var health_si = req.params.health_si;
            let is_existing = req.params.is_existing;
            let ScoreMaster = [];
            let planBenefits = [];
            if (fs.existsSync(appRoot + "/tmp/cachemaster/advisory_score_master.log")) {
                var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/advisory_score_master.log").toString();
                ScoreMaster = JSON.parse(cache_content);
            } else {
                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                    if (err)
                        throw err;
                    let score_master = db.collection('health_benefits_score_master');
                    score_master.find({}, {_id: 0}).toArray(function (err, scoreMaster) {
                        if (err) {
                            res.send(err);
                        } else {
                            ScoreMaster = scoreMaster;
                            fs.writeFile(appRoot + "/tmp/cachemaster/advisory_score_master.log", JSON.stringify(scoreMaster), function (err) {
                                if (err) {
                                    return console.error(err);
                                }
                            });
                        }
                    });
                });
                sleep(500);
            }
            let insWeight = require('../resource/request_file/AdvisoryInsurerWeight.json');

            let final_advisory = 0;
            let insWtIndex = insWeight.findIndex(a => a.Insurer_Id === insurer_id);
            let url = "https://horizon.policyboss.com:5443/benefits/" + insurer_id + "/" + plan_id + "/undefined/" + health_si;
            client.get(url, function (data, response) {
                if (data.length > 0) {
                    let total_score = 0;
                    let wt_percent = insWeight[insWtIndex].Weightage_Percent / 100;
                    for (let j = 0; j < data.length; j++) {
                        let objKey = ScoreMaster.findIndex(s => s['Feature Key'].toUpperCase() === data[j].Benefit_Key.toUpperCase() && s['Feature Value'].toUpperCase() === data[j].Benefit_Value.toUpperCase());
                        if (objKey > -1) {
                            total_score += ScoreMaster[objKey]['FeatureWeightedScore'];
                            final_advisory += ScoreMaster[objKey]['Feature Score'];
                            planBenefits.push(data[j]);
                        }
                    }
                    let final_score = Number(((final_advisory / planBenefits.length) * wt_percent).toFixed(1));
                    final_advisory = final_score > 5 ? 5 : final_score;
                    total_score = Number(total_score.toFixed(1));
                    res.json({"Insurer_Id": insurer_id, "Plan_Id": plan_id, "Final_Advisory": final_advisory, "Is_Existing": is_existing, "Benefits": planBenefits});
                } else {
                    res.json({"Msg": "Not found"});
                }
            });
        } catch (ex) {
            console.error('Exception in Advisory Score-', ex);
        }
    });
    app.post('/getFilterFinalAdvisory', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let objReq = req.body;
            let filterBenefits = objReq.filter_benefits.split(",");
            let insurer_id = parseInt(objReq.insurer_id);
            let plan_id = parseInt(objReq.plan_id);
            var health_si = objReq.health_si;
            let is_existing = objReq.is_existing;
            let ScoreMaster = [];
            let planBenefits = [];
            if (fs.existsSync(appRoot + "/tmp/cachemaster/advisory_score_master.log")) {
                var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/advisory_score_master.log").toString();
                ScoreMaster = JSON.parse(cache_content);
            } else {
                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                    if (err)
                        throw err;
                    let score_master = db.collection('health_benefits_score_master');
                    score_master.find({}, {_id: 0}).toArray(function (err, scoreMaster) {
                        if (err) {
                            res.send(err);
                        } else {
                            ScoreMaster = scoreMaster;
                            fs.writeFile(appRoot + "/tmp/cachemaster/advisory_score_master.log", JSON.stringify(scoreMaster), function (err) {
                                if (err) {
                                    return console.error(err);
                                }
                            });
                        }
                    });
                });
                sleep(500);
            }
            let insWeight = require('../resource/request_file/AdvisoryInsurerWeight.json');

            let final_advisory = 0;
            let insWtIndex = insWeight.findIndex(a => a.Insurer_Id === insurer_id);
            let url = "https://horizon.policyboss.com:5443/benefits/" + insurer_id + "/" + plan_id + "/undefined/" + health_si;
            client.get(url, function (data, response) {
                if (data.length > 0) {
                    let total_score = 0;
                    let wt_percent = insWeight[insWtIndex].Weightage_Percent / 100;
                    for (let j = 0; j < data.length; j++) {
                        let objKey = ScoreMaster.findIndex(s => s['Feature Key'].toUpperCase() === data[j].Benefit_Key.toUpperCase() && s['Feature Value'].toUpperCase() === data[j].Benefit_Value.toUpperCase());
                        if (objKey > -1) {
                            for (let b = 0; b < filterBenefits.length; b++) {
                                if (filterBenefits[b].trim() === ScoreMaster[objKey]['Feature Key']) {
                                    total_score += ScoreMaster[objKey]['FeatureWeightedScore'];
                                    final_advisory += ScoreMaster[objKey]['Feature Score'];
                                }
                            }
                            planBenefits.push(data[j]);
                        }
                    }
                    let final_score = Number(((final_advisory / filterBenefits.length) * wt_percent).toFixed(1));
                    final_advisory = final_score > 5 ? 5 : final_score;
                    total_score = Number(total_score.toFixed(1));
                    res.json({"Insurer_Id": insurer_id, "Plan_Id": plan_id, "Final_Advisory": final_advisory, "Is_Existing": is_existing, "Benefits": planBenefits});
                } else {
                    res.json({"Msg": "Not found"});
                }
            });
        } catch (ex) {
            console.error('Exception in Advisory Score-', ex);
        }
    });
    app.post("/health_benefits/hdfc_health_rate_premium", function (req, res) {
        try {
            let objRequest = req.body;
            let moment = require("moment");
            let pincode_insurer = require('../models/pincode_insurer');
            let pincode = objRequest.hasOwnProperty("permanent_pincode") ? objRequest.permanent_pincode - 0 : "";
            let adult_count = objRequest.hasOwnProperty("adult_count") ? objRequest.adult_count - 0 : "";
            let child_count = objRequest.hasOwnProperty("child_count") ? objRequest.child_count - 0 : "";
            let health_insurance_si = objRequest.hasOwnProperty("health_insurance_si") ? objRequest.health_insurance_si - 0 : "";
            let policy_tenure = objRequest.hasOwnProperty("policy_tenure") ? objRequest.policy_tenure - 0 : "";
            let age = "";
            let temp_mem_count = adult_count + child_count;
            let member_count = adult_count + child_count;
            let member_premium = {};
            let tier_id = "";
            let args = {};
            let base_premium = 0;
            let premium_breakup = {};
            let health_rate_id_by_age = "";
            let temp_loop_id = [];
            let member_premium_rate = [];
            pincode_insurer.findOne({"Pincode": pincode, "Insurer_Id": 5}, function (err, pincode_ins) {
                if (err) {
                    res.json({"Status": "FAIL", "Msg": "Pincode details not available"});
                } else {
                    tier_id = pincode_ins && pincode_ins._doc && pincode_ins._doc.Tier_Id ? pincode_ins._doc.Tier_Id - 0 : "";
                    if (tier_id === "") {
                        res.json({"Status": "FAIL", "Msg": "Tier Id not available in given pincode"});
                    } else {
                        var i = 1;
                        for (i = 1; i <= member_count; i++) {
                            args = {};
                            let member_birth_date = moment().subtract(objRequest['member_' + i + '_age'], 'years').format('YYYY-MMM-DD');
                            age = objRequest.hasOwnProperty('member_' + i + '_age_in_months') && objRequest['member_' + i + '_age_in_months'] ? objRequest['member_' + i + '_age_in_months'] : get_member_age_in_month(member_birth_date);
                            args = {
                                "Insurer_Id": 5,
                                "SumInsured": health_insurance_si,
                                "Tier_Id": tier_id,
                                "Policy_Term_Year": policy_tenure,
                                "Min_AgeOfEldestMember_Months": {$lte: Math.round(age)},
                                "Max_AgeOfEldestMember_Months": {$gte: Math.round(age)}
                            };
                            console.log('Health rate request', JSON.stringify(args));
                            if (i === 1 && adult_count === 1 && child_count >= 1) {
                                temp_loop_id.push(i);
                                member_premium['member_' + i + '_age_in_month'] = age;
                                i++;
                                member_count++;
                            } else {
                                member_premium['member_' + i + '_age_in_month'] = age;
                                temp_loop_id.push(i);
                            }
                            let health_rate = require('../models/health_rate');
                            health_rate.find(args, function (err, dbHealthRate) {
                                if (err) {
                                    res.json({"Status": "FAIL", "Msg": `Health rates not available for age->${{age}}`});
                                } else {
                                    if (dbHealthRate && dbHealthRate.hasOwnProperty('0') && dbHealthRate['0'].hasOwnProperty('_doc')) {
                                        let health_rate_data = dbHealthRate[0]._doc;
                                        member_premium_rate.push(health_rate_data);
                                        if (temp_mem_count === member_premium_rate.length) {
                                            for (var m = 0; m < member_premium_rate.length; m++) {
                                                member_premium_rate.sort(function (a, b) {
                                                    if (a.Min_AgeOfEldestMember_Months < b.Min_AgeOfEldestMember_Months) {
                                                        return 1;
                                                    } else if (a.Min_AgeOfEldestMember_Months > b.Min_AgeOfEldestMember_Months) {
                                                        return -1;
                                                    } else {
                                                        return 0;
                                                    }
                                                });
                                            }
                                            for (var j in member_premium_rate) {
                                                if (parseInt(j) === 0) {
                                                    base_premium = member_premium_rate[j]['Premium'];
                                                    health_rate_id_by_age = member_premium_rate[j]['Insurer_HealthRate_Id'];
                                                } else {
                                                    base_premium += (member_premium_rate[j]['Premium'] / 2);
                                                }
                                            }
                                            premium_breakup['base_premium'] = base_premium;
                                            premium_breakup['service_tax'] = Math.round(premium_breakup['base_premium'] * 0.18);
                                            premium_breakup['final_premium'] = Math.round(premium_breakup['base_premium'] + premium_breakup['service_tax']);
                                            premium_breakup["tax"] = {};
                                            premium_breakup['tax']['CGST'] = Math.round(premium_breakup['service_tax'] / 2);
                                            premium_breakup['tax']['SGST'] = Math.round(premium_breakup['service_tax'] / 2);
                                            premium_breakup['net_premium'] = Math.round(premium_breakup['base_premium']);
                                            premium_breakup['insurer_health_rate_id'] = health_rate_id_by_age;
                                            res.json({"Status": "SUCCESS", "Data": premium_breakup});
                                        }
                                    } else {
                                        res.json({"Status": "FAIL", "Msg": "No Record Found"});
                                    }
                                }
                            });
                        }
                    }
                }
            });
        } catch (e) {
            console.error("/get_hdfc_health_rate_premium", e.stack);
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    function get_member_age_in_month(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        age = age * 12 + m;
        return age;
    }
    app.get('/health_benefits/hdfcRatesPincode/:insurer_id/:pincode', function (req, res) {
        try {
            let insurerId = req.params.insurer_id ? parseInt(req.params.insurer_id) : '';
            let pincode = req.params.pincode ? parseInt(req.params.pincode) : '';
            var pincodeInsurer = require('../models/pincode_insurer');
            pincodeInsurer.find({Pincode: pincode, Insurer_Id: insurerId}, (err, data) => {
                try {
                    if (data) {
                        res.json({'PincodeData': data});
                    }
                } catch (e) {
                    res.json({'Status': 'Fail', Msg: e.stack});
                }
            });
        } catch (e) {
            res.json({'Status': 'Fail', 'Msg': e.stack});
        }
    });
};