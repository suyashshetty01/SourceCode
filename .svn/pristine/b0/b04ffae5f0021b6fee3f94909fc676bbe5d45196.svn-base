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
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var Rto = require('../models/rto');
module.exports.controller = function (app) {
    /**
     * a home page route
     */
    app.get('/rtos', function (req, res) {
        Rto.find(function (err, rtos) {
            if (err)
                res.send(err);

            res.json(rtos);
        });
    });
    app.get('/rtos/make_model_list', function (req, res) {
        var agg = [
            {$group: {
                    _id: {Make_Name: "$Make_Name", Model_Name: "$Model_Name"}
                }},
            {$project: {_id: 0, Make_Name: "$_id.Make_Name", Model_Name: "$_id.Model_Name"}},
            {$sort: {'Make_Name': 1}}
        ];

        Rto.aggregate(agg, function (err, rtos) {
            if (err)
                res.send(err);

            res.json(rtos);
        });
        /*
         Rto.find({}, 'Rto_ID Make_Name Model_Name Variant_Name Fuel_Name Cubic_Capacity Seating_Capacity', function (err, rtos) {
         if (err)
         res.send(err);
         
         
         res.json(rtos);
         });
         */
    });
    app.get('/rtos/list', function (req, res) {
        var cache_key = 'live_rtos_list';
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cache/" + cache_key + ".log").toString();
            var obj_cache_content = JSON.parse(cache_content);
            res.json(obj_cache_content);
        } else {
            Rto.find({
                $or: [
                    {'VehicleCity_RTOCode': new RegExp(req.query['q'], 'i')},
                    {'RTO_City': new RegExp(req.query['q'], 'i')}
                ]
            }, {"IsActive": 1, "RTO_City": 1, "State_Id": 1, "State_Name": 1, "VehicleCity_Id": 1, "VehicleTariff_Zone": 1, "VehicleCity_RTOCode": 1, "_id": 0}, function (err, rtos) {
                if (err) {
                    res.send(err);
                }
                fs.writeFile(appRoot + "/tmp/cache/" + cache_key + ".log", JSON.stringify(rtos), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                res.json(rtos);
            });
        }
//        Rto.find({$text: {$search: req.query['query']}}, {score: {$meta: "textScore"}}).sort({score: {$meta: 'textScore'}}).exec(function (err, rtos) {
//            if (err)
//                res.send(err);
//
//            var listresponse = [];
//            for (var k in rtos) {
//                listresponse.push({'id': rtos[k]['Rto_ID'], 'label': rtos[k]['Make_Name'] + ' ' + rtos[k]['Model_Name'] + ' ' + rtos[k]['Variant_Name'] + '( Fuel: ' + rtos[k]['Fuel_Name'] + ', CC:' + rtos[k]['Cubic_Capacity'] + ' )'})
//            }
//
//            res.json(listresponse);
//        });
    });

    app.get('/rtos/make1/:product_id', function (req, res) {
        var product_id = parseInt(req.params.product_id);
        var from = 0, to = 0;
        if (product_id === 1) {
            from = 0;
            to = 50000;
        } else {
            from = 50000;
            to = 100000;
        }
        Rto.find().distinct('Make_Name', {}, function (err, rtos) {
            if (err)
                res.send(err);

            res.json(rtos);
        });
    });
    app.get('/rtos/make/:product_id', function (req, res) {
        var product_id = parseInt(req.params.product_id);
        var from = 0, to = 0;
        if (product_id === 1) {
            from = 0;
            to = 50000;
        } else {
            from = 50000;
            to = 100000;
        }
        ;
        var agg = [
            {"$match": {"Rto_ID": {"$gte": from, "$lte": to}}},
            {$group: {
                    _id: {Make_Name: "$Make_Name"},
                    RtoCount: {$sum: 1}
                }},
            {$project: {_id: 0, Make_Name: "$_id.Make_Name", RtoCount: 1}},
            {$sort: {'Make_Name': 1}}
        ];

        Rto.aggregate(agg, function (err, rtos) {
            if (err)
                res.send(err);

            res.json(rtos);
        });

    });
    app.get('/rtos/model/:make_name', function (req, res) {
        var make_name = req.params.make_name;
        Rto.find().distinct('Model_Name', {'Make_Name': make_name}, function (err, rtos) {
            if (err)
                res.send(err);

            res.json(rtos);
        });
//        Rto.distinct('Model_Name', {'Make_Name': make_name}, function (err, rtos) {
//            if (err)
//                res.send(err);
//
//            res.json(rtos);
//        });
    });
    app.get('/rtos/variant/:make_name/:model_name', function (req, res) {
        var make_name = req.params.make_name;
        var model_name = req.params.model_name;
        Rto.find({'Make_Name': make_name, 'Model_Name': model_name}).sort({'Variant_Name': 'asc'}).exec(function (err, rtos) {
            if (err)
                res.send(err);

            res.json(rtos);
        });
    });
    app.post('/rtos', function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: '',
            sort: {'Rto_Id': 'asc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);

        }




        Rto.paginate(obj_pagination.filter, optionPaginate).then(function (rtos) {
            console.log(obj_pagination.filter, optionPaginate, rtos);
            res.json(rtos);
        });
    });
    app.post('/rtos/save', function (req, res) {
        var rto = new Rto();
        var base = new Base();
        for (var key in req.body) {
            rto[key] = req.body[key];
        }

        // get the current date
        var currentDate = new Date();
        if (!req.body.Rto_Id) {
            rto.Created_On = currentDate;
            rto.Is_Active = true;
        }
        rto.Modified_On = currentDate;
        // any logic goes here
        console.log(rto);
        rto.save(function (err) {
            if (err) {
                res.send(err);
            }
            console.log('saved', rto);
            res.json({message: 'Rto created with Rto_Id - ' + rto.Secret_Key + ' :: ' + rto.Rto_Id + ' !'});
        });
    });
    app.get('/rtos/view/:id', function (req, res) {

        Rto.find(function (err, rto) {
            if (err)
                res.send(err);

            res.json(rto);
        });
    });
    app.delete('/delete/:id', function (req, res) {
        // any logic goes here
        res.render('rtos/view');
    });
    /**
     * About page route
     */
    app.get('/login', function (req, res) {
// any logic goes here
        res.render('users/login')
    });
    app.get('/rtos/Rto_list', function (req, res) {
        var RTO_CodeDiscription = req.query['RTO_CodeDiscription'];
        var agg = [
            {$match: {RTO_CodeDiscription: new RegExp(RTO_CodeDiscription, 'i')}},
            {$group: {
                    _id: {VehicleCity_Id: "$VehicleCity_Id", VehicleCity_RTOCode: "$VehicleCity_RTOCode", RTO_City: "$RTO_City", State_Name: "$State_Name", RTO_CodeDiscription: "$RTO_CodeDiscription"}
                }},
            {$project: {_id: 0, VehicleCity_Id: "$_id.VehicleCity_Id", VehicleCity_RTOCode: "$_id.VehicleCity_RTOCode", RTO_City: "$_id.RTO_City", State_Name: "$_id.State_Name", RTO_CodeDiscription: "$_id.RTO_CodeDiscription"}},
            {$sort: {'VehicleCity_Id': 1}}
        ];
        //console.log(JSON.stringify(agg));
        Rto.aggregate(agg, function (err, Rtos) {

            if (err)
            {
                res.send(err);
            } else {
                res.json(Rtos);
            }

        });
        /*
         Vehicle.find({}, 'VehicleCity_Id Make_Name Model_Name Variant_Name Fuel_Name Cubic_Capacity Seating_Capacity', function (err, rtos) {
         if (err)
         res.send(err);
         
         
         res.json(rtos);
         });
         */
    });

    app.post('/rtos/mapping', function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: '',
            sort: {'VehicleCity_Id': 'asc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);

        }
        var arr_insurer = {
            "Ins_47": "DHFL",
            "Ins_101": "ERP",
            "2": "Bharti",
            "4": "FutureGenerali",
            "7": "IffcoTokio",
            "9": "Reliance",
            "10": "RoyalSundaram",
            "12": "NewIndia",
            "19": "UniversalSompo",
            "33": "LibertyVideocon",
            "1": "Bajaj",
            "5": "HdfcErgo",
            "6": "IciciLombard",
            "11": "TataAIG",
            "30": "Kotak"
        };
        var filter = obj_pagination.filter;
        console.error('Filter', req.body);
        if (req.body['search[value]'] !== '') {
            if (isNaN(req.body['search[value]'])) {
                filter = {
                    $or: [
                        {'VehicleCity_RTOCode': new RegExp(req.body['search[value]'], 'i')},
                        {'RTO_City': new RegExp(req.body['search[value]'], 'i')},
                        {'State_Name': new RegExp(req.body['search[value]'], 'i')},
                        {'VehicleTariff_Zone': new RegExp(req.body['search[value]'], 'i')}
                    ]
                };
            } else {
                filter = {'VehicleCity_Id': parseInt(req.body['search[value]'])};
            }
        } else {
            filter = {};
            if (req.body['VehicleCity_RTOCode'] !== '') {
                filter['VehicleCity_RTOCode'] = req.body['VehicleCity_RTOCode'];
            } else if (req.body['State_Name'] !== '') {
                filter['State_Name'] = req.body['State_Name'];
            } else if (req.body['RTO_City'] !== '') {
                filter['RTO_City'] = req.body['RTO_City'];
            }

            if (req.body['Insurer']) {
                var arr_Insurer = req.body['Insurer'].split('|');
                for (var k in arr_Insurer) {
                    if (parseInt(req.body['Status']) == 1) {
                        filter['Insurer_' + arr_Insurer[k] + '.Rto_ID'] = {$exists: false};
                    } else if (parseInt(req.body['Status']) == 2) {
                        filter['Insurer_' + arr_Insurer[k] + '.Rto_ID'] = {$exists: true};
                    } else if (parseInt(req.body['Status']) == 3) {
                        filter['Insurer_' + arr_Insurer[k] + '.Status_Id'] = parseInt(req.body['Status']);
                    }
                }
            }

        }
        Rto.paginate(filter, optionPaginate).then(function (rtos) {
            console.error(filter, optionPaginate, rtos);
            res.json(rtos);
        });
    });
    app.get('/rtos/mapping_batch', function (req, res) {
        var objBase = new Base();
        var arr_insurer = {
            "47": "DHFL",
            "101": "ERP",
            "11": "TataAIG",
            "2": "Bharti",
            "4": "FutureGenerali",
            "7": "IffcoTokio",
            "9": "Reliance",
            "10": "RoyalSundaram",
            "12": "NewIndia",
            "19": "UniversalSompo",
            "33": "LibertyVideocon",
            "1": "Bajaj",
            "5": "HdfcErgo",
            "6": "IciciLombard",
            "30": "Kotak"
        };

        Rto.find({}).limit(100).exec(function (err, rtos) {
            if (err) {
                res.send(err);
            }
            console.error('rtos', rtos);
            var arr_rtocity_id = [];
            for (var k in rtos) {
                arr_rtocity_id.push(rtos[k]['VehicleCity_Id']);
            }
            //console.log(arr_rtocity_id);
            //console.error('arr_rtocity_id', arr_rtocity_id);
            var Rtos_Insurers_Mapping = require('../models/rtos_insurers_mapping');
            Rtos_Insurers_Mapping.find({Rto_ID: {$in: arr_rtocity_id}}).exec(function (err, db_Rtos_Insurers_Mappings) {
                if (err)
                {
                    res.send(err);
                } else {
                    //console.error('db_Rtos_Insurers_Mappings', db_Rtos_Insurers_Mappings);
                    var arr_rto_map = {};
                    for (var k in rtos) {
                        var VehicleCity_Id = parseInt(rtos[k]['VehicleCity_Id']);
                        arr_rto_map[VehicleCity_Id] = {};
                        for (var k2 in db_Rtos_Insurers_Mappings) {
                            //console.error(VehicleCity_Id, '===', db_Rtos_Insurers_Mappings[k2]['VehicleCity_Id'], db_Rtos_Insurers_Mappings[k2]['Insurer_ID']);
                            if (VehicleCity_Id === parseInt(db_Rtos_Insurers_Mappings[k2]['Rto_ID'])) {
                                var Insurer_ID = db_Rtos_Insurers_Mappings[k2]['Insurer_ID'];
                                console.error(VehicleCity_Id, Insurer_ID);
                                //rtos.docs[k]['Insurer_' + Insurer_ID] = db_Rtos_Insurers_Mappings[k2];
                                /*
                                 * "Is_Active": Number,
                                 "Created_On": Date,
                                 "Status_Id": Number,
                                 "Premium_Status": Number
                                 * 
                                 */

                                arr_rto_map[VehicleCity_Id]['Insurer_' + Insurer_ID] = {
                                    "Insurer_Rto_Mapping_ID": db_Rtos_Insurers_Mappings[k2]['Insurer_Rto_Mapping_ID'],
                                    "Rto_ID": db_Rtos_Insurers_Mappings[k2]['Rto_ID'],
                                    "Insurer_Rto_ID": db_Rtos_Insurers_Mappings[k2]['Insurer_Rto_ID'],
                                    "Insurer_ID": db_Rtos_Insurers_Mappings[k2]['Insurer_ID'],
                                    "Is_Active": db_Rtos_Insurers_Mappings[k2]['Is_Active'],
                                    "Created_On": db_Rtos_Insurers_Mappings[k2]['Created_On'],
                                    "Premium_Status": db_Rtos_Insurers_Mappings[k2]['Premium_Status'],
                                    "Status_Id": db_Rtos_Insurers_Mappings[k2]['Status_Id']
                                };
                            }
                        }
                        Rto.update({'VehicleCity_Id': VehicleCity_Id}, {$set: arr_rto_map[VehicleCity_Id]}, function (err, numAffected) {
                            if (err) {
                                console.error({Msg: 'Vehicle_Not_Saved', Details: err});
                                res.send(err);
                            } else {
                                //res.json({Msg: 'Success_Created', Details: numAffected});
                            }
                        });

                    }
                    //res.json(arr_rto_map);
                }
            });
        });
    });
    app.get('/rtos/rto_code', function (req, res) {
        Rto.find().distinct('VehicleCity_RTOCode', {}, function (err, rtos) {
            if (err)
                res.send(err);

            res.json(rtos);
        });
    });
    app.get('/rtos/rto_city', function (req, res) {
        Rto.find().distinct('RTO_City', {}, function (err, rtos) {
            if (err)
                res.send(err);

            res.json(rtos);
        });
    });
    app.get('/rtos/rto_state', function (req, res) {
        Rto.find().distinct('State_Name', {}, function (err, rtos) {
            if (err)
                res.send(err);

            res.json(rtos);
        });
    });
    app.get('/rtos/rto_zone', function (req, res) {
        Rto.find().distinct('VehicleTariff_Zone', {}, function (err, rtos) {
            if (err)
                res.send(err);

            res.json(rtos);
        });
    });

};
