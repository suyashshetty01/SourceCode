/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var path = require('path');
var moment = require('moment');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
//const {fuzzy} = require("fast-fuzzy");
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var Vehicle = require('../models/vehicle');
var arr_ins = {1: "BajajAllianz", 2: "BhartiAxa", 3: "Cholamandalam MS", 4: "Future Generali", 5: "HDFCERGO", 6: "ICICILombard", 7: "IFFCOTokio", 8: "National Insurance", 9: "Reliance", 10: "RoyalSundaram", 11: "TataAIG", 12: "New India", 13: "Oriental", 14: "UnitedIndia", 15: "L&amp;T General", 16: "Raheja QBE", 17: "SBI General", 18: "Shriram General", 19: "UniversalSompo", 20: "Max Bupa", 21: "HDFC ERGO Health", 22: "DLF Pramerica", 23: "Bajaj Allianz", 24: "IndiaFirst", 25: "AEGON Religare", 26: "Star Health", 27: "Express BPO", 28: "HDFC Life", 29: "Bharti Axa", 30: "Kotak Mahindra", 31: "LIC India", 32: "Birla Sun Life", 33: "LibertyGeneral", 34: "Care Health", 35: "Magma HDI", 36: "Indian Health Organisation", 37: "TATA AIA", 38: "Manipal Cigna", 39: "ICICI Pru", 42: "Aditya Birla", 43: "Edelweiss Tokio Life", 44: "GoDigit", 45: "Acko", 46: "Edelweiss", 48: 'Kotak', 47: "DHFL", 100: "FastLaneVariantMapping", 101: "Landmark"};
module.exports.controller = function (app) {
    /**
     * a home page route
     */
    app.post('/vehicles/pospfilesave', function (req, res) {
        var filedata = req.body.DocumentContent;
        var filename = req.body.PBPOSPRequestID + '_' + req.body.DocumentName;
        var filepath = 'D://LM//PB//POSP//payout//';
        var http = require('http')
                , fs = require('fs')
                , options;

        fs.writeFile(filepath + filename, filedata, 'base64', function (err) {
            if (err) {
                res.json({'status': 'fail', 'err': err});
            } else {
                console.log('File saved.');
                res.json({'status': 'success', 'filename': filepath + filename});
            }
        });

    });
    app.get('/vehicles', function (req, res) {
        Vehicle.find(function (err, vehicles) {
            if (err)
                res.send(err);

            res.json(vehicles);
        });
    });
    app.get('/vehicles/make_model_list', function (req, res) {
        var agg = [
            {$group: {
                    _id: {Make_Name: "$Make_Name", Model_Name: "$Model_Name"}
                }},
            {$project: {_id: 0, Make_Name: "$_id.Make_Name", Model_Name: "$_id.Model_Name"}},
            {$sort: {'Make_Name': 1}}
        ];

        Vehicle.aggregate(agg, function (err, vehicles) {
            if (err)
                res.send(err);

            res.json(vehicles);
        });
        /*
         Vehicle.find({}, 'Vehicle_ID Make_Name Model_Name Variant_Name Fuel_Name Cubic_Capacity Seating_Capacity', function (err, vehicles) {
         if (err)
         res.send(err);
         
         
         res.json(vehicles);
         });
         */
    });
    app.post('/vehicles/list', function (req, res) {

        Vehicle.find({
            $or: [
                {'Make_Name': new RegExp(req.body['q'], 'i')},
                {'Model_Name': new RegExp(req.body['q'], 'i')},
                {'Variant_Name': new RegExp(req.body['q'], 'i')},
                {'Fuel_Name': new RegExp(req.body['q'], 'i')}
            ],
            $and: [{'Product_Id_New': parseInt(req.body['product_id'])}]
        }, function (err, vehicles) {
            if (err)
                res.send(err);
//
//            var listresponse = [];
//            for (var k in vehicles) {
//                listresponse.push({'id': vehicles[k]['Vehicle_ID'], 'label': vehicles[k]['Make_Name'] + ' ' + vehicles[k]['Model_Name'] + ' ' + vehicles[k]['Variant_Name'] + '( Fuel: ' + vehicles[k]['Fuel_Name'] + ', CC:' + vehicles[k]['Cubic_Capacity'] + ' )'})
//            }

            res.json(vehicles);
        });
//        Vehicle.find({$text: {$search: req.query['query']}}, {score: {$meta: "textScore"}}).sort({score: {$meta: 'textScore'}}).exec(function (err, vehicles) {
//            if (err)
//                res.send(err);
//
//            var listresponse = [];
//            for (var k in vehicles) {
//                listresponse.push({'id': vehicles[k]['Vehicle_ID'], 'label': vehicles[k]['Make_Name'] + ' ' + vehicles[k]['Model_Name'] + ' ' + vehicles[k]['Variant_Name'] + '( Fuel: ' + vehicles[k]['Fuel_Name'] + ', CC:' + vehicles[k]['Cubic_Capacity'] + ' )'})
//            }
//
//            res.json(listresponse);
//        });
    });

    app.get('/vehicles/make1/:product_id', function (req, res) {
        var product_id = parseInt(req.params.product_id);
        var from = 0, to = 0;
        if (product_id === 1) {
            from = 0;
            to = 50000;
        } else {
            from = 50000;
            to = 100000;
        }
        Vehicle.find().distinct('Make_Name', {}, function (err, vehicles) {
            if (err)
                res.send(err);

            res.json(vehicles);
        });
    });
    app.get('/vehicles/make/:product_id', function (req, res) {
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
            {"$match": {"Product_Id_New": product_id}},
            {$group: {
                    _id: {Make_Name: "$Make_Name"},
                    VehicleCount: {$sum: 1}
                }},
            {$project: {_id: 0, Make_Name: "$_id.Make_Name", VehicleCount: 1}},
            {$sort: {'Make_Name': 1}}
        ];

        Vehicle.aggregate(agg, function (err, vehicles) {
            if (err)
                res.send(err);

            res.json(vehicles);
        });

    });
    app.get('/vehicles/model/:product_id/:make_name', function (req, res) {
        var product_id = parseInt(req.params.product_id);
        var make_name = req.params.make_name;
        /* Vehicle.find().distinct('Model_Name', {'Make_Name': make_name}, function (err, vehicles) {
         if (err)
         res.send(err);
         
         res.json(vehicles);
         });*/
        var agg = [
            {"$match": {"Product_Id_New": product_id, 'Make_Name': make_name}},
            {$group: {
                    _id: {Model_Name: "$Model_Name"},
                    VehicleCount: {$sum: 1}
                }},
            {$project: {_id: 0, Make_Name: "$Make_Name", Model_Name: "$_id.Model_Name", VehicleCount: 1}},
            {$sort: {'Model_Name': 1}}
        ];

        Vehicle.aggregate(agg, function (err, vehicles) {
            if (err)
                res.send(err);

            res.json(vehicles);
        });
    });
    app.get('/vehicles/variant/:make_name/:model_name', function (req, res) {
        var make_name = req.params.make_name;
        var model_name = req.params.model_name;
        Vehicle.find({'Make_Name': make_name, 'Model_Name': model_name}).sort({'Variant_Name': 'asc'}).exec(function (err, vehicles) {
            if (err)
                res.send(err);

            res.json(vehicles);
        });
    });
    app.get('/vehicles/insurer_mapped_count_summary', function (req, res) {
        try {
            var Product_Id = req.query['Product_Id'] - 0;
            Vehicle.find({'Product_Id_New': Product_Id}).exec(function (err, vehicles) {
                try {
                    if (err)
                        res.send(err);

                    let obj_config_product = {
                        1: [1, 2, 4, 5, 6, 7, 9, 11, 12, 13, 14, 19, 30, 33, 44, 46, 47],
                        10: [1, 2, 3, 5, 6, 9, 11, 13, 17, 33, 44, 45, 47, 48],
                        12: [1, 4, 5, 19, 44]
                    };
                    let objVehicle_Mapping_Summary = {};
                    let objVehicle_Insurer_Count = {};
                    let objVehicle_Insurer_Base_Count = {};
                    let objVehicle_Insurer_Wise_Summary = {};
                    let Total_Vehicle = vehicles.length;
                    let Total_Base_Vehicle = 0;
                    for (let j of obj_config_product[Product_Id]) {
                        objVehicle_Insurer_Wise_Summary['Insurer_' + j] = {
                            'Insurer': arr_ins[j],
                            'All-Total': Total_Vehicle,
                            'All-Pending': 0,
                            'All-NotSupported': 0,
                            'All-Supported': 0,
                            'Base-Total': 0,
                            'Base-Pending': 0,
                            'Base-NotSupported': 0,
                            'Base-Supported': 0
                        };
                    }
                    obj_config_product[1] = ('Insurer_' + obj_config_product[1].join(',Insurer_')).split(',');
                    obj_config_product[10] = ('Insurer_' + obj_config_product[10].join(',Insurer_')).split(',');
                    obj_config_product[12] = ('Insurer_' + obj_config_product[12].join(',Insurer_')).split(',');

                    for (let k in vehicles) {
                        let Vehicle_ID = vehicles[k]._doc['Vehicle_ID'];
                        let Mapped_Insurer_Count = 0;
                        if (vehicles[k]._doc['Is_Base'] === 'Yes') {
                            Total_Base_Vehicle++;
                        }
                        for (let i in vehicles[k]._doc) {
                            if (i.indexOf('Insurer_') > -1 && objVehicle_Insurer_Wise_Summary.hasOwnProperty(i)) {
                                if (vehicles[k]._doc[i] !== null && vehicles[k]._doc[i].hasOwnProperty('Status_Id') && (vehicles[k]._doc[i]['Status_Id'] === 2 || vehicles[k]._doc[i]['Status_Id'] === 4)) {
                                    objVehicle_Insurer_Wise_Summary[i]['All-Supported']++;
                                    if (vehicles[k]._doc['Is_Base'] === 'Yes') {
                                        objVehicle_Insurer_Wise_Summary[i]['Base-Supported']++;
                                    }
                                }
                                if (vehicles[k]._doc[i] !== null && vehicles[k]._doc[i].hasOwnProperty('Status_Id') && vehicles[k]._doc[i]['Status_Id'] === 3) {
                                    objVehicle_Insurer_Wise_Summary[i]['All-NotSupported']++;
                                    if (vehicles[k]._doc['Is_Base'] === 'Yes') {
                                        objVehicle_Insurer_Wise_Summary[i]['Base-NotSupported']++;
                                    }
                                }
                            }
                            if (i.indexOf('Insurer_') > -1 && obj_config_product[Product_Id].indexOf(i) > -1 && vehicles[k]._doc[i] !== null && vehicles[k]._doc[i].hasOwnProperty('Status_Id') && (vehicles[k]._doc[i]['Status_Id'] === 2 || vehicles[k]._doc[i]['Status_Id'] === 4)) {
                                Mapped_Insurer_Count++;
                            }
                        }
                        objVehicle_Insurer_Count['Vehicle_' + Vehicle_ID] = Mapped_Insurer_Count;
                        if (vehicles[k]._doc['Is_Base'] === 'Yes') {
                            objVehicle_Insurer_Base_Count['Vehicle_' + Vehicle_ID] = Mapped_Insurer_Count;
                        }
                        if (req.query['op'] === 'UPDATE_MAPPED_INSURER') {
                            Vehicle.update({'Vehicle_ID': Vehicle_ID}, {$set: {'Mapped_Insurer_Count': Mapped_Insurer_Count}}, function (err, numAffected) {
                                if (err) {
                                    console.error('UPDATE_MAPPED_INSURER', err);
                                }
                            });
                        }
                    }
                    for (let i in objVehicle_Insurer_Wise_Summary) {
                        objVehicle_Insurer_Wise_Summary[i]['All-Pending'] = Total_Vehicle - (objVehicle_Insurer_Wise_Summary[i]['All-Supported'] + objVehicle_Insurer_Wise_Summary[i]['All-NotSupported']);
                        objVehicle_Insurer_Wise_Summary[i]['Base-Pending'] = Total_Base_Vehicle - (objVehicle_Insurer_Wise_Summary[i]['Base-Supported'] + objVehicle_Insurer_Wise_Summary[i]['Base-NotSupported']);
                        objVehicle_Insurer_Wise_Summary[i]['Base-Total'] = Total_Base_Vehicle;
                    }
                    let objVehicle_Insurer_Count_Summary = {};
                    for (let k in objVehicle_Insurer_Count) {
                        let Insurer_Count_Key = 'Vehicle_Mapped_With_' + objVehicle_Insurer_Count[k] + '_Insurer';
                        if (objVehicle_Insurer_Count_Summary.hasOwnProperty(Insurer_Count_Key) === false) {
                            objVehicle_Insurer_Count_Summary[Insurer_Count_Key] = {'Detail': Insurer_Count_Key, 'All-Count': 0, 'Base-Count': 0};
                        }
                        objVehicle_Insurer_Count_Summary[Insurer_Count_Key]['All-Count']++;
                        if (objVehicle_Insurer_Base_Count.hasOwnProperty(k)) {
                            objVehicle_Insurer_Count_Summary[Insurer_Count_Key]['Base-Count']++;
                        }
                    }
                    objVehicle_Mapping_Summary['objVehicle_Insurer_Count_Summary'] = objVehicle_Insurer_Count_Summary;
                    objVehicle_Mapping_Summary['objVehicle_Insurer_Wise_Summary'] = objVehicle_Insurer_Wise_Summary;


                    res.json(objVehicle_Mapping_Summary);
                } catch (e) {
                    res.send(e.stack);
                }
            });
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.get('/vehicles/single_insurer_mapped_count_summary', function (req, res) {
        try {
            var Product_Id = req.query['Product_Id'] - 0;
            var Insurer_Id = req.query['Insurer_Id'] - 0;
            Vehicle.find({'Product_Id_New': Product_Id}).select().exec(function (err, vehicles) {
                try {
                    if (err)
                        res.send(err);

                    let obj_config_product = {
                        1: [Insurer_Id],
                        10: [Insurer_Id],
                        12: [Insurer_Id]
                    };
                    let objVehicle_Insurer_Count = {};
                    let objVehicle_Insurer_Base_Count = {};
                    let objVehicle_Insurer_Wise_Summary = {};
                    let Total_Vehicle = vehicles.length;
                    let Total_Base_Vehicle = 0;
                    for (let j of obj_config_product[Product_Id]) {
                        objVehicle_Insurer_Wise_Summary['Insurer_' + j] = {
                            'Insurer': arr_ins[j],
                            'All-Total': Total_Vehicle,
                            'All-Pending': 0,
                            'All-NotSupported': 0,
                            'All-Supported': 0,
                            'Base-Total': 0,
                            'Base-Pending': 0,
                            'Base-NotSupported': 0,
                            'Base-Supported': 0
                        };
                    }
                    obj_config_product[1] = ('Insurer_' + obj_config_product[1].join(',Insurer_')).split(',');
                    obj_config_product[10] = ('Insurer_' + obj_config_product[10].join(',Insurer_')).split(',');
                    obj_config_product[12] = ('Insurer_' + obj_config_product[12].join(',Insurer_')).split(',');

                    for (let k in vehicles) {
                        let Vehicle_ID = vehicles[k]._doc['Vehicle_ID'];
                        let Mapped_Insurer_Count = 0;
                        if (vehicles[k]._doc['Is_Base'] === 'Yes') {
                            Total_Base_Vehicle++;
                        }
                        for (let i in vehicles[k]._doc) {
                            if (i.indexOf('Insurer_') > -1 && objVehicle_Insurer_Wise_Summary.hasOwnProperty(i)) {
                                if (vehicles[k]._doc[i] !== null && vehicles[k]._doc[i].hasOwnProperty('Status_Id') && (vehicles[k]._doc[i]['Status_Id'] === 2 || vehicles[k]._doc[i]['Status_Id'] === 4)) {
                                    objVehicle_Insurer_Wise_Summary[i]['All-Supported']++;
                                    if (vehicles[k]._doc['Is_Base'] === 'Yes') {
                                        objVehicle_Insurer_Wise_Summary[i]['Base-Supported']++;
                                    }
                                }
                                if (vehicles[k]._doc[i] !== null && vehicles[k]._doc[i].hasOwnProperty('Status_Id') && vehicles[k]._doc[i]['Status_Id'] === 3) {
                                    objVehicle_Insurer_Wise_Summary[i]['All-NotSupported']++;
                                    if (vehicles[k]._doc['Is_Base'] === 'Yes') {
                                        objVehicle_Insurer_Wise_Summary[i]['Base-NotSupported']++;
                                    }
                                }
                            }
                            if (i.indexOf('Insurer_') > -1 && obj_config_product[Product_Id].indexOf(i) > -1 && vehicles[k]._doc[i] !== null && vehicles[k]._doc[i].hasOwnProperty('Status_Id') && (vehicles[k]._doc[i]['Status_Id'] === 2 || vehicles[k]._doc[i]['Status_Id'] === 4)) {
                                Mapped_Insurer_Count++;
                            }
                        }
                        objVehicle_Insurer_Count['Vehicle_' + Vehicle_ID] = Mapped_Insurer_Count;
                        if (vehicles[k]._doc['Is_Base'] === 'Yes') {
                            objVehicle_Insurer_Base_Count['Vehicle_' + Vehicle_ID] = Mapped_Insurer_Count;
                        }
                    }
                    for (let i in objVehicle_Insurer_Wise_Summary) {
                        objVehicle_Insurer_Wise_Summary[i]['All-Pending'] = Total_Vehicle - (objVehicle_Insurer_Wise_Summary[i]['All-Supported'] + objVehicle_Insurer_Wise_Summary[i]['All-NotSupported']);
                        objVehicle_Insurer_Wise_Summary[i]['Base-Pending'] = Total_Base_Vehicle - (objVehicle_Insurer_Wise_Summary[i]['Base-Supported'] + objVehicle_Insurer_Wise_Summary[i]['Base-NotSupported']);
                        objVehicle_Insurer_Wise_Summary[i]['Base-Total'] = Total_Base_Vehicle;
                    }
                    res.json(objVehicle_Insurer_Wise_Summary);
                } catch (e) {
                    res.send(e.stack);
                }
            });
        } catch (e) {
            res.send(e.stack);
        }
    });

    app.post('/vehicles', function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: '',
            sort: {'Vehicle_Id': 'asc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);

        }




        Vehicle.paginate(obj_pagination.filter, optionPaginate).then(function (vehicles) {
            console.log(obj_pagination.filter, optionPaginate, vehicles);
            res.json(vehicles);
        });
    });
    app.post('/vehicles/mapping', function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: '',
            sort: {'Vehicle_Id': 'asc'},
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
        //console.error('Filter', req.body);
        if (req.body['search[value]'] !== '') {
            if (isNaN(req.body['search[value]'])) {
                filter = {
                    $or: [
                        {'Make_Name': new RegExp(req.body['search[value]'], 'i')},
                        {'Model_Name': new RegExp(req.body['search[value]'], 'i')},
                        {'Variant_Name': new RegExp(req.body['search[value]'], 'i')},
                        {'Fuel_Name': new RegExp(req.body['search[value]'], 'i')}
                    ],
                    $and: [
                        {'Product_Id_New': parseInt(req.body['Product_Id_New'])}
                    ]
                };
            } else {
                filter = {'Product_Id_New': parseInt(req.body['Product_Id_New']), 'Vehicle_ID': parseInt(req.body['search[value]'])};
            }
        } else {
            filter = {'Product_Id_New': parseInt(req.body['Product_Id_New'])};
            if (req.body['Vehicle_Id'] !== '') {
                filter['Vehicle_ID'] = parseInt(req.body['Vehicle_Id']);
            } else if (req.body['Model_Name'] !== '') {
                filter['Make_Name'] = req.body['Make_Name'];
                filter['Model_Name'] = req.body['Model_Name'];
            } else if (req.body['Make_Name'] !== '') {
                filter['Make_Name'] = req.body['Make_Name'];
            } else if (req.body['Is_Base'] !== '') {
                if (req.body['Is_Base'] === 'Yes') {
                    filter['Is_Base'] = req.body['Is_Base'];
                }
                if (req.body['Is_Base'] === 'No') {
                    filter['Is_Base'] = {$exists: false};
                }
                if (req.body['Is_Base'] === 'NA') {
                    filter['Base_Vehicle_ID'] = {$exists: false};
                }
            } else if (req.body['Mapped_Insurer_Count'] !== '') {
                filter['Mapped_Insurer_Count'] = req.body['Mapped_Insurer_Count'] - 0;
            }


            if (req.body['Insurer']) {
                var arr_Insurer = req.body['Insurer'].split('|');
                for (var k in arr_Insurer) {
                    if (parseInt(req.body['Status']) == 1) {
                        filter['Insurer_' + arr_Insurer[k]] = {$exists: false};
                    } else if (parseInt(req.body['Status']) == 5) {
                        filter['Insurer_' + arr_Insurer[k] + '.Is_Active'] = 1;
                    } else {
                        filter['Insurer_' + arr_Insurer[k] + '.Status_Id'] = parseInt(req.body['Status']);
                    }
                }
            }

        }
        Vehicle.paginate(filter, optionPaginate).then(function (vehicles) {
            //console.error(filter, optionPaginate, vehicles);
            res.json(vehicles);
            /*
             var arr_vehicle_id = [];
             for (var k in vehicles.docs) {
             arr_vehicle_id.push(vehicles.docs[k]['Vehicle_ID']);
             for (var k1 in arr_insurer) {
             vehicles.docs[k]['Insurer_' + k1] = {};
             }
             }
             console.log(arr_vehicle_id);
             var Vehicles_Insurers_Mapping = require('../models/vehicles_insurers_mapping');
             Vehicles_Insurers_Mapping.find({Vehicle_ID: {$in: arr_vehicle_id}}).exec(function (err, db_Vehicles_Insurers_Mappings) {
             if (err)
             {
             res.send(err);
             } else {
             console.error(db_Vehicles_Insurers_Mappings);
             for (var k in vehicles.docs) {
             var Vehicle_ID = vehicles.docs[k]['Vehicle_ID'];
             for (var k2 in db_Vehicles_Insurers_Mappings) {
             console.error(Vehicle_ID, '===', db_Vehicles_Insurers_Mappings[k2]['Vehicle_ID'], db_Vehicles_Insurers_Mappings[k2]['Insurer_ID']);
             if (Vehicle_ID == db_Vehicles_Insurers_Mappings[k2]['Vehicle_ID']) {
             var Insurer_ID = db_Vehicles_Insurers_Mappings[k2]['Insurer_ID'];
             console.error(Vehicle_ID, Insurer_ID);
             vehicles.docs[k]['Insurer_' + Insurer_ID] = db_Vehicles_Insurers_Mappings[k2];
             
             }
             }
             }
             
             }
             });
             */
        });
    });
    app.get('/vehicles/update_base_vehicle', function (req, res) {
        var Vehicle_ID = parseInt(req.query['Vehicle_ID']);
        var Base_Vehicle_ID = parseInt(req.query['Base_Vehicle_ID']);
        Vehicle.findOne({'Vehicle_ID': Base_Vehicle_ID}, function (err, dbBaseVehicle) {
            dbBaseVehicle = dbBaseVehicle._doc;
            if (dbBaseVehicle['Is_Base'] === 'Yes') {
                Vehicle.update({'Vehicle_ID': Vehicle_ID}, {$set: {'Base_Vehicle_ID': Base_Vehicle_ID}}, function (err, numAffected) {
                    if (err) {
                        console.error('UPDATE_MAPPED_INSURER', err);
                        res.send(err);
                    } else {
                        res.send('SUCCESS');
                    }
                });
            } else {
                res.send('INVALID_BASE_VEHICLE_ID');
            }
        });
    });
    app.post('/vehicles/save', function (req, res) {
        var objVehicle = {};
        var base = new Base();
        for (var key in req.body) {
            objVehicle[key] = req.body[key];
        }
        var currentDate = new Date();

        objVehicle['Modified_On'] = currentDate;
        objVehicle['Vehicle_ID'] = parseInt(objVehicle['Vehicle_ID']);
        if (objVehicle['Vehicle_ID'] > 0) {
            console.log(objVehicle);
            // any logic goes here
            Vehicle.findOne({'Vehicle_ID': objVehicle['Vehicle_ID']}, function (err, dbVehicle) {
                if (err) {

                } else {
                    if (dbVehicle) {
                        Vehicle.update({'Vehicle_ID': objVehicle['Vehicle_ID']}, {$set: objVehicle}, function (err, numAffected) {
                            if (err) {
                                res.json({Msg: 'Vehicle_Not_Found', Details: err});
                            } else {
                                res.json({Msg: 'Success_Created', Details: numAffected});
                            }
                        });
                    } else {
                        res.json({Msg: 'Vehicle_Not_Found', Details: objVehicle});
                    }
                }
            });

        } else {
            Vehicle.findOne({'Product_Id_New': parseInt(objVehicle['Product_Id_New'])}, null, {sort: {'Vehicle_ID': -1}}, function (err, dbVehicleOne) {
                console.log('lastvehicle', dbVehicleOne);
                if (dbVehicleOne) {
                    objVehicle['Vehicle_ID'] = dbVehicleOne._doc['Vehicle_ID'];
                    objVehicle['Created_On'] = currentDate;
                    console.log(objVehicle);
                    var vehicle = new Vehicle(objVehicle);
                    vehicle.save(function (err) {
                        if (err) {
                            res.json({Msg: 'Vehicle_Not_Updated', Details: err});
                        } else {
                            res.json({Msg: 'Success_Updated', Details: vehicle});
                        }
                    });
                }
            });

        }

    });
    app.get('/vehicles/view/:id', function (req, res) {

        Vehicle.find(function (err, vehicle) {
            if (err)
                res.send(err);

            res.json(vehicle);
        });
    });
    app.delete('/delete/:id', function (req, res) {
        // any logic goes here
        res.render('vehicles/view');
    });
    /**
     * About page route
     */
    app.get('/login', function (req, res) {
// any logic goes here
        res.render('users/login');
    });
    app.get('/vehicles/Model_list', function (req, res) {
        var product_id = parseInt(req.query['product_id']);
        var cache_key = 'live_vehicles_model_list_' + product_id;
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            var obj_cache_content = JSON.parse(cache_content);
            res.json(obj_cache_content);
        } else {
            var agg = [
                {$match: {Product_Id_New: product_id}},
                {$group: {
                        _id: {Model_ID: "$Model_ID", Make_Name: "$Make_Name", Model_Name: "$Model_Name"}
                    }},
                {$project: {_id: 0, Model_ID: "$_id.Model_ID", Make_Name: "$_id.Make_Name", Model_Name: "$_id.Model_Name"}},
                {$sort: {'Make_Name': 1, 'Model_Name': 1}}
            ];
            console.log(JSON.stringify(agg));
            Vehicle.aggregate(agg, function (err, vehicles) {

                if (err)
                {
                    res.send(err);
                } else {
                    for (var k in vehicles) {
                        vehicles[k]["vehicle_name"] = vehicles[k]["Make_Name"] + ", " + vehicles[k]["Model_Name"];
                    }
                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(vehicles), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    res.json(vehicles);
                }

            });
        }

        /*
         Vehicle.find({}, 'Vehicle_ID Make_Name Model_Name Variant_Name Fuel_Name Cubic_Capacity Seating_Capacity', function (err, vehicles) {
         if (err)
         res.send(err);
         
         
         res.json(vehicles);
         });
         */
    });

    app.get('/vehicles/Model_list_make', function (req, res) {
        var product_id = parseInt(req.query['product_id']);
        var make_name = req.query['make_name'];
        var cache_key = 'live_vehicles_model_list_make_' + product_id + '_' + make_name;
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            var obj_cache_content = JSON.parse(cache_content);
            res.json(obj_cache_content);
        } else {
            var agg = [
                {$match: {Product_Id_New: product_id, Make_Name: make_name}},
                {$group: {
                        _id: {Model_ID: "$Model_ID", Make_Name: "$Make_Name", Model_Name: "$Model_Name"}
                    }},
                {$project: {_id: 0, Model_ID: "$_id.Model_ID", Make_Name: "$_id.Make_Name", Model_Name: "$_id.Model_Name"}},
                {$sort: {'Model_ID': 1}}
            ];
            console.log(JSON.stringify(agg));
            Vehicle.aggregate(agg, function (err, vehicles) {

                if (err)
                {
                    res.send(err);
                } else {
                    for (var k in vehicles) {
                        vehicles[k]["vehicle_name"] = vehicles[k]["Make_Name"] + ", " + vehicles[k]["Model_Name"];
                    }
                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(vehicles), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    res.json(vehicles);
                }

            });
        }

        /*
         Vehicle.find({}, 'Vehicle_ID Make_Name Model_Name Variant_Name Fuel_Name Cubic_Capacity Seating_Capacity', function (err, vehicles) {
         if (err)
         res.send(err);
         
         
         res.json(vehicles);
         });
         */
    });

    app.get('/vehicles/Model_list_cv', function (req, res) {
        var product_id = parseInt(req.query['product_id']);
        var product_sub_type = parseInt(req.query['vehicle_class']);
        var product_sub_class_name = req.query['vehicle_subclass_name'] ? req.query['vehicle_subclass_name'] : '';
        var SubclassOfVehicle = {
            "gcv_public_otthw": "A1 Public Other than 3W",
            "gcv_public_thwpc": "A3 Public 3W",
            "pcv_fw_lt6pass": "C1A 4W",
            "pcv_thw_lt6pass": "C1B 3W",
            "pcv_fw_gt6pass": "C2 4W",
            "pcv_thw_between6to17pass": "C3 3W",
            "pcv_tw": "C4 2W"
        };
        var product_sub_class = SubclassOfVehicle[product_sub_class_name];

        var cache_key = 'live_vehicles_cv_model_list_' + product_id + '_' + product_sub_type;
        if (product_sub_class) {
            cache_key = cache_key + '_' + product_sub_class;
        }
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            var obj_cache_content = JSON.parse(cache_content);
            res.json(obj_cache_content);
        } else {
            let agg = [
                {$match: {Product_Id_New: product_id, Product_Sub_Category_Code: product_sub_type}},
                {$group: {
                        _id: {Model_ID: "$Model_ID", Make_Name: "$Make_Name", Model_Name: "$Model_Name"}
                    }},
                {$project: {_id: 0, Model_ID: "$_id.Model_ID", Make_Name: "$_id.Make_Name", Model_Name: "$_id.Model_Name"}},
                {$sort: {'Model_ID': 1}}
            ];
            if (product_sub_class) {
                agg = [
                    {$match: {Product_Id_New: product_id, Product_Sub_Category_Code: product_sub_type, Product_Sub_Category_Class_Name: product_sub_class}},
                    {$group: {_id: {Model_ID: "$Model_ID", Make_Name: "$Make_Name", Model_Name: "$Model_Name"}}},
                    {$project: {_id: 0, Model_ID: "$_id.Model_ID", Make_Name: "$_id.Make_Name", Model_Name: "$_id.Model_Name"}},
                    {$sort: {'Model_ID': 1}}
                ];
            }
            console.log(JSON.stringify(agg));
            Vehicle.aggregate(agg, function (err, vehicles) {

                if (err)
                {
                    res.send(err);
                } else {
                    for (var k in vehicles) {
                        if (product_id == 12) {
                            vehicles[k]["vehicle_name"] = vehicles[k]["Make_Name"] + ", " + vehicles[k]["Model_Name"];
                        } else {
                            vehicles[k]["vehicle_name"] = vehicles[k]["Make_Name"];
                        }
                    }
                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(vehicles), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    res.json(vehicles);
                }

            });
        }

        /*
         Vehicle.find({}, 'Vehicle_ID Make_Name Model_Name Variant_Name Fuel_Name Cubic_Capacity Seating_Capacity', function (err, vehicles) {
         if (err)
         res.send(err);
         res.json(vehicles);
         });
         */
    });

    app.get('/vehicles/make_list_cv', function (req, res) {
        var product_id = parseInt(req.query['product_id']);
        var product_sub_type = parseInt(req.query['vehicle_class']);
        var product_sub_class_name = req.query['vehicle_subclass_name'] ? req.query['vehicle_subclass_name'] : '';
        var SubclassOfVehicle = {
            "gcv_public_otthw": "A1 Public Other than 3W",
            "gcv_public_thwpc": "A3 Public 3W",
            "pcv_fw_lt6pass": "C1A 4W",
            "pcv_thw_lt6pass": "C1B 3W",
            "pcv_fw_gt6pass": "C2 4W",
            "pcv_thw_between6to17pass": "C3 3W",
            "pcv_tw": "C4 2W"
        };

        var product_sub_class = SubclassOfVehicle[product_sub_class_name];

        var cache_key = 'live_vehicles_cv_make_list_' + product_id + '_' + product_sub_type;
        if (product_sub_class) {
            cache_key = cache_key + '_' + product_sub_class;
        }
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            var obj_cache_content = JSON.parse(cache_content);
            res.json(obj_cache_content);
        } else {
            let agg = [
                {$match: {Product_Id_New: product_id, Product_Sub_Category_Code: product_sub_type}},
                {$group: {
                        _id: {Make_ID: "$Make_ID", Make_Name: "$Make_Name"}
                    }},
                {$project: {_id: 0, Make_ID: "$_id.Make_ID", Make_Name: "$_id.Make_Name"}},
                {$sort: {'Make_ID': 1}}
            ];
            if (product_sub_class) {
                agg = [
                    {$match: {Product_Id_New: product_id, Product_Sub_Category_Code: product_sub_type, Product_Sub_Category_Class_Name: product_sub_class}},
                    {$group: {_id: {Make_Name: "$Make_Name", "Vehicle_Image": "$Vehicle_Image"}}},
                    {$project: {_id: 0, Make_Name: "$_id.Make_Name", "Vehicle_Image": "$_id.Vehicle_Image"}},
                    {$sort: {'Make_Name': 1}}
                ];
            }
            console.log(JSON.stringify(agg));
            Vehicle.aggregate(agg, function (err, vehicles) {

                if (err)
                {
                    res.send(err);
                } else {
                    for (var k in vehicles) {
                        if (product_sub_class) {
                            vehicles[k]["vehicle_name"] = vehicles[k]["Make_Name"];
                            /*vehicles[k]["Vehicle_Image"] = vehicles[k]["Vehicle_Image"];*/
                        } else {
                            vehicles[k]["vehicle_name"] = vehicles[k]["Make_Name"] + ", " + vehicles[k]["Model_Name"];
                        }
                    }
                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(vehicles), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    res.json(vehicles);
                }

            });
        }
    });

    app.get('/vehicles/Fuel', function (req, res) {
        var model_id = parseInt(req.query['Model_ID']);
        Vehicle.find({'Model_ID': model_id}).distinct('Fuel_Name', function (error, dbFuels) {
            // ids is an array of all ObjectIds
            res.json(dbFuels);
        });
    });
    app.get('/vehicles/GetFuelVariant', function (req, res) {
        var model_id = parseInt(req.query['Model_ID']);
        var Product_Id_New = parseInt(req.query['Product_Id']);
        var make_name = req.query['make_name'];
        var objResponse = {
            FuelList: [],
            VariantList: []
        };
        var cache_key = 'live_vehicles_GetFuelVariant_' + model_id + '_' + Product_Id_New + '_' + make_name;
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            var obj_cache_content = JSON.parse(cache_content);
            res.json(obj_cache_content);
        } else {
            var arrFuels = [];
            var arrVehicles = [];
//            Vehicle.find({'Product_Id_New': Product_Id_New, 'Model_ID': model_id}, function (err, dbVehicles) {
            var agg = [
                {$match: {Product_Id_New: Product_Id_New, Model_ID: model_id, Make_Name: make_name}},
                {$sort: {'Variant_Name': 1}}
            ];
            console.log(JSON.stringify(agg));
            Vehicle.aggregate(agg, function (err, dbVehicles) {
                for (var k in dbVehicles) {
                    if (arrFuels.indexOf(dbVehicles[k]['Fuel_Name']) < 0) {
                        arrFuels.push(dbVehicles[k]['Fuel_Name']);
                    }
                    for (var k1 in dbVehicles[k]) {
                        if (k1.indexOf('Insurer_') > -1) {
                            dbVehicles[k][k1] = null;
                        }
                    }
                }
                objResponse['FuelList'] = arrFuels;
                objResponse['VariantList'] = dbVehicles;
                fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(objResponse), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                res.json(objResponse);
            });
        }
    });
    app.get('/vehicles/cv_beta_GetFuelVariant/:Model_ID/:Product_Id/:vehicle_class/:vehicle_Sub_Category_Class_Name/:Make_name', function (req, res) {
        var model_id = parseInt(req.params['Model_ID']);
        var Product_Id_New = parseInt(req.params['Product_Id']);
        let vehicle_class = req.params.vehicle_class - 0;
        let vehicle_Sub_Category_Class_Name = req.params.vehicle_Sub_Category_Class_Name;
        let make_name = req.params.Make_name;
        var objResponse = {
            FuelList: [],
            VariantList: []
        };
        var cache_key = 'live_vehicles_cv_GetFuelVariant_' + model_id + '_' + Product_Id_New + '_' + vehicle_class + '_' + vehicle_Sub_Category_Class_Name;
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            var obj_cache_content = JSON.parse(cache_content);
            res.json(obj_cache_content);
        } else {
            var arrFuels = [];
            var arrVehicles = [];
//            Vehicle.find({'Product_Id_New': Product_Id_New, 'Model_ID': model_id}, function (err, dbVehicles) {
            if (Product_Id_New === 12) {
                if (req.params.vehicle_class && vehicle_Sub_Category_Class_Name) {
                    var SubclassOfVehicle = {
                        "gcv_public_otthw": "A1 Public Other than 3W",
                        "gcv_public_thwpc": "A3 Public 3W",
                        "pcv_fw_lt6pass": "C1A 4W",
                        "pcv_thw_lt6pass": "C1B 3W",
                        "pcv_fw_gt6pass": "C2 4W",
                        "pcv_thw_between6to17pass": "C3 3W",
                        "pcv_tw": "C4 2W"
                    };
                    var product_sub_class = SubclassOfVehicle[vehicle_Sub_Category_Class_Name];
                }
            }
            var agg = [
                {$match: {Product_Id_New: Product_Id_New, Model_ID: model_id, Product_Sub_Category_Code: vehicle_class, Product_Sub_Category_Class_Name: product_sub_class, Make_Name: make_name}},
                {$sort: {'Variant_Name': 1}}
            ];
            console.log(JSON.stringify(agg));
            Vehicle.aggregate(agg, function (err, dbVehicles) {
                if (err) {
                    res.send(err);
                } else {
                    for (var k in dbVehicles) {
                        if (arrFuels.indexOf(dbVehicles[k]['Fuel_Name']) < 0) {
                            arrFuels.push(dbVehicles[k]['Fuel_Name']);
                        }
                        for (var k1 in dbVehicles[k]) {
                            if (k1.indexOf('Insurer_') > -1) {
                                dbVehicles[k][k1] = null;
                            }
                        }
                    }
                    objResponse['FuelList'] = arrFuels;
                    objResponse['VariantList'] = dbVehicles;
                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(objResponse), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    res.json(objResponse);
                }
            });
        }
    });

    app.get('/vehicles/beta_GetFuelVariant/:Model_ID/:Product_Id/:Make_name', function (req, res) {
        var model_id = parseInt(req.params['Model_ID']);
        var Product_Id_New = parseInt(req.params['Product_Id']);
        var make_name = req.params['Make_name'];
        var objResponse = {
            FuelList: [],
            VariantList: []
        };
        var cache_key = 'live_vehicles_GetFuelVariant_' + model_id + '_' + Product_Id_New + '_' + make_name;
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            var obj_cache_content = JSON.parse(cache_content);
            res.json(obj_cache_content);
        } else {
            var arrFuels = [];
            var arrVehicles = [];
//            Vehicle.find({'Product_Id_New': Product_Id_New, 'Model_ID': model_id}, function (err, dbVehicles) {
            var agg = [
                {$match: {Product_Id_New: Product_Id_New, Model_ID: model_id, Make_Name: make_name}},
                {$sort: {'Variant_Name': 1}}
            ];
            console.log(JSON.stringify(agg));
            Vehicle.aggregate(agg, function (err, dbVehicles) {
                for (var k in dbVehicles) {
                    if (arrFuels.indexOf(dbVehicles[k]['Fuel_Name']) < 0) {
                        arrFuels.push(dbVehicles[k]['Fuel_Name']);
                    }
                    if (dbVehicles[k]['Seating_Capacity'] && (dbVehicles[k]['Seating_Capacity'] - 0) > 5) {
                        dbVehicles[k]['Variant_Name'] += ' ' + dbVehicles[k]['Seating_Capacity'] + ' SEATER';
                    }
                    for (var k1 in dbVehicles[k]) {
                        if (k1.indexOf('Insurer_') > -1) {
                            dbVehicles[k][k1] = null;
                        }
                    }
                }
                objResponse['FuelList'] = arrFuels;
                objResponse['VariantList'] = dbVehicles;
                fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(objResponse), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                res.json(objResponse);
            });
        }
    });
    app.get('/vehicles/GetFuelVariant_cv', function (req, res) {
        var model_id = parseInt(req.query['Model_ID']);
        var Product_Id_New = parseInt(req.query['Product_Id']);
        var product_sub_type = parseInt(req.query['vehicle_class']);
        var objResponse = {
            FuelList: [],
            VariantList: []
        };
        var cache_key = 'live_vehicles_GetFuelVariant_cv_' + model_id + '_' + Product_Id_New;
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            var obj_cache_content = JSON.parse(cache_content);
            res.json(obj_cache_content);
        } else {
            var arrFuels = [];
            var arrVehicles = [];
            Vehicle.find({'Product_Id_New': Product_Id_New, 'Model_ID': model_id, 'Product_Sub_Category_Code': product_sub_type}, function (err, dbVehicles) {
                for (var k in dbVehicles) {
                    if (arrFuels.indexOf(dbVehicles[k]['Fuel_Name']) < 0) {
                        arrFuels.push(dbVehicles[k]['Fuel_Name']);
                    }
                    for (var k1 in dbVehicles[k]) {
                        if (k1.indexOf('Insurer_') > -1) {
                            dbVehicles[k][k1] = null;
                        }
                    }
                }
                objResponse['FuelList'] = arrFuels;
                objResponse['VariantList'] = dbVehicles;
                fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(objResponse), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                res.json(objResponse);
            });
        }
    });
    app.get('/vehicles/mapping_batch', function (req, res) {
        var objBase = new Base();
        var arr_insurer = {
            "47": "DHFL",
            "101": "ERP",
            "13": "Oriental",
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
            "30": "Kotak",
            "100": "FastLane",
            "46": "Edelweiss"
        };

        Vehicle.find({$and: [{'Insurer_2': {$exists: false}}, {'Insurer_33': {$exists: false}}]}).limit(500).exec(function (err, vehicles) {
            if (err) {
                res.send(err);
            }
            console.log(vehicles);
            var arr_vehicle_id = [];
            for (var k in vehicles) {
                arr_vehicle_id.push(vehicles[k]['Vehicle_ID']);
            }
            //console.log(arr_vehicle_id);
            var Vehicles_Insurers_Mapping = require('../models/vehicles_insurers_mapping');
            Vehicles_Insurers_Mapping.find({Vehicle_ID: {$in: arr_vehicle_id}}).exec(function (err, db_Vehicles_Insurers_Mappings) {
                if (err)
                {
                    res.send(err);
                } else {
                    //console.error(db_Vehicles_Insurers_Mappings);
                    var arr_vehicle_map = {};
                    for (var k in vehicles) {
                        var Vehicle_ID = parseInt(vehicles[k]['Vehicle_ID']);
                        arr_vehicle_map[Vehicle_ID] = {};
                        for (var k2 in db_Vehicles_Insurers_Mappings) {
                            //console.error(Vehicle_ID, '===', db_Vehicles_Insurers_Mappings[k2]['Vehicle_ID'], db_Vehicles_Insurers_Mappings[k2]['Insurer_ID']);
                            if (Vehicle_ID === parseInt(db_Vehicles_Insurers_Mappings[k2]['Vehicle_ID'])) {
                                var Insurer_ID = db_Vehicles_Insurers_Mappings[k2]['Insurer_ID'];
                                //console.error(Vehicle_ID, Insurer_ID);
                                //vehicles.docs[k]['Insurer_' + Insurer_ID] = db_Vehicles_Insurers_Mappings[k2];
                                arr_vehicle_map[Vehicle_ID]['Insurer_' + Insurer_ID] = {
                                    "Insurer_ID": db_Vehicles_Insurers_Mappings[k2]['Insurer_ID'],
                                    "Insurer_Vehicle_ID": db_Vehicles_Insurers_Mappings[k2]['Insurer_Vehicle_ID'],
                                    "Vehicle_ID": db_Vehicles_Insurers_Mappings[k2]['Vehicle_ID'],
                                    "Is_Active": db_Vehicles_Insurers_Mappings[k2]['Is_Active'],
                                    "Status_Id": db_Vehicles_Insurers_Mappings[k2]['Status_Id'],
                                    "Premium_Status": db_Vehicles_Insurers_Mappings[k2]['Premium_Status']
                                };
                            }
                        }
                        Vehicle.update({'Vehicle_ID': Vehicle_ID}, {$set: arr_vehicle_map[Vehicle_ID]}, function (err, numAffected) {
                            if (err) {
                                res.json({Msg: 'Vehicle_Not_Saved', Details: err});
                            } else {
                                //res.json({Msg: 'Success_Created', Details: numAffected});
                            }
                        });

                    }
                    res.json(arr_vehicle_map);
                }
            });
        });
    });

    app.get('/vehicles/getmodel_variant/:product_id/:make/:vehicle_class?', function (req, res) {
        var product_id = parseInt(req.params.product_id);
        var make_name = req.params.make;
        let vehicle_class = req.params.vehicle_class - 0;
        let match_data = {"Product_Id_New": product_id, 'Make_Name': make_name};
        if (product_id === 12) {
            if (req.params.vehicle_class) {
                match_data["Product_Sub_Category_Code"] = vehicle_class;
            }
        }
        var agg = [
            {"$match": match_data},
            {$group: {_id: "$Model_Name", "Model_ID": {"$first": "$Model_ID"}, Variantlist: {$push: {Variant_Name: "$Variant_Name", Vehicle_ID: "$Vehicle_ID", Fuel_Name: "$Fuel_Name"}}}},
            {$sort: {'Model_Name': 1, "_id": 1}}
        ];
        Vehicle.aggregate(agg, function (err, vehicles) {
            if (err)
                res.send(err);
            res.json(vehicles);
        });
    });

    app.get('/vehicles/cv_getmodel_variant/:product_id/:make/:vehicle_class/:vehicle_Sub_Category_Class_Name?', function (req, res) {
        var product_id = parseInt(req.params.product_id);
        var make_name = req.params.make;
        let vehicle_class = req.params.vehicle_class - 0;
        let vehicle_Sub_Category_Class_Name = req.params.vehicle_Sub_Category_Class_Name;
        let match_data = {"Product_Id_New": product_id, 'Make_Name': make_name};
        if (product_id === 12) {
            if (req.params.vehicle_class && vehicle_Sub_Category_Class_Name) {
                match_data["Product_Sub_Category_Code"] = vehicle_class;
                var SubclassOfVehicle = {
                    "gcv_public_otthw": "A1 Public Other than 3W",
                    "gcv_public_thwpc": "A3 Public 3W",
                    "pcv_fw_lt6pass": "C1A 4W",
                    "pcv_thw_lt6pass": "C1B 3W",
                    "pcv_fw_gt6pass": "C2 4W",
                    "pcv_thw_between6to17pass": "C3 3W",
                    "pcv_tw": "C4 2W"
                };
                var product_sub_class = SubclassOfVehicle[vehicle_Sub_Category_Class_Name];
                match_data["Product_Sub_Category_Class_Name"] = product_sub_class;
            }
        }
        var agg = [
            {"$match": match_data},
            {$group: {_id: "$Model_Name", "Model_ID": {"$first": "$Model_ID"}, Variantlist: {$push: {Variant_Name: "$Variant_Name", Vehicle_ID: "$Vehicle_ID", Fuel_Name: "$Fuel_Name"}}}},
            {$sort: {'Model_Name': 1, "_id": 1}}
        ];
        Vehicle.aggregate(agg, function (err, vehicles) {
            if (err)
                res.send(err);
            res.json(vehicles);
        });
    });
    app.get('/vehicles/getrto', function (req, res) {
        var Rto = require('../models/rto');
        var agg = [
            {$group: {_id: "$State_Id", "VehicleCity_RTOCode": {"$first": "$VehicleCity_RTOCode"}, "State_Name": {"$first": "$State_Name"}
                    , Rtolist: {$push: {RTO_City: "$RTO_City", VehicleTariff_Zone: "$VehicleTariff_Zone"
                            , VehicleCity_RTOCode: "$VehicleCity_RTOCode", VehicleCity_Id: "$VehicleCity_Id"}}}},
            {$sort: {'State_Name': 1}}
        ];
        Rto.aggregate(agg, function (err, rto) {
            if (err)
                res.send(err);
            res.json(rto);
        });
    });
    app.get('/vehicles/tree', function (req, res) {
        let vehicle_tree = {};
        Vehicle.find({'Product_Id_New': parseInt(req.query['product_id'])}).sort({'Make_Name': 1, 'Model_Name': 1, 'Fuel_ID': 1, 'Vehicle_ID': 1}).exec(function (err, vehicles) {
            if (err)
                res.send(err);

            try {
                for (var k in vehicles) {
                    try {
                        let Make_Ident = vehicles[k]['Make_Name'];
                        let Model_Ident = vehicles[k]['Model_Name'];
                        let Fuel_Ident = vehicles[k]['Fuel_Name'];
                        if (vehicle_tree.hasOwnProperty(Make_Ident) === false) {
                            vehicle_tree[Make_Ident] = {};
                        }
                        if (vehicle_tree[Make_Ident].hasOwnProperty(Model_Ident) === false) {
                            vehicle_tree[Make_Ident][Model_Ident] = {};
                        }
                        if (vehicle_tree[Make_Ident][Model_Ident].hasOwnProperty(Fuel_Ident) === false) {
                            vehicle_tree[Make_Ident][Model_Ident][Fuel_Ident] = [];
                        }

                        vehicle_tree[Make_Ident][Model_Ident][Fuel_Ident].push({
                            'Vehicle_Id': vehicles[k]['Vehicle_ID'],
                            'Vehicle_Name': vehicles[k]['Variant_Name'] + '::CC-' + vehicles[k]['Cubic_Capacity'] + ((vehicles[k]['Is_Base'] && vehicles[k]['Is_Base']) === 'Yes' ? '::Base' : '')
                        });
                    } catch (e) {
                        res.send(vehicles[k]['Vehicle_ID'] + '|' + vehicles[k]['Description'] + '|' + e.stack);
                    }
                }
                res.json(vehicle_tree);
            } catch (e) {
                res.send(e.stack);
            }
        });
    });
    app.get('/vehicles/mapping/get_availability', function (req, res) {
        let PB_Vehicle_Id = req.query['PB_Vehicle_Id'] || 0;
        let Mapping_Insurer_Id = req.query['Mapping_Insurer_Id'] || 0;
        let Ss_Id = req.query['Ss_Id'] || 0;
        PB_Vehicle_Id = parseInt(PB_Vehicle_Id);
        Mapping_Insurer_Id = parseInt(Mapping_Insurer_Id);
        let obj_vehicle_mapping = {
            'Status': 'PENDING',
            'Msg': '',
            'Pb_Vehicle': null,
            'Insurer_Vehicle_List': []
        };
        if (Ss_Id > 0 && PB_Vehicle_Id > 0 && Mapping_Insurer_Id > 0) {
            Vehicle.findOne({'Vehicle_ID': PB_Vehicle_Id}).exec(function (err, db_vehicle) {
                if (err)
                    res.send(err);

                try {
                    if (db_vehicle) {
                        let obj_vehicle = db_vehicle._doc;
                        if (obj_vehicle.hasOwnProperty('Insurer_' + Mapping_Insurer_Id) === false || (obj_vehicle.hasOwnProperty('Insurer_' + Mapping_Insurer_Id) && obj_vehicle['Insurer_' + Mapping_Insurer_Id]['Status_Id'] === 3)) {
                            let cc_slab = {
                                1: {
                                    'slab_1': {min: 0, max: 1000},
                                    'slab_2': {min: 1001, max: 1500},
                                    'slab_3': {min: 1501, max: 10000}
                                },
                                10: {
                                    'slab_1': {min: 0, max: 75},
                                    'slab_2': {min: 76, max: 150},
                                    'slab_3': {min: 151, max: 350},
                                    'slab_4': {min: 351, max: 5000}
                                }
                            };
                            let Pb_Make = obj_vehicle['Make_Name'] || '';
                            let Pb_Model = obj_vehicle['Model_Name'] || '';
                            let Pb_Fuel = obj_vehicle['Fuel_Name'] || '';
                            let Pb_CC = obj_vehicle['Cubic_Capacity'] || 0;
                            Pb_CC = Pb_CC - 0;
                            obj_vehicle_mapping.Pb_Vehicle = {
                                'Vehicle_ID': PB_Vehicle_Id,
                                'Make_Name': Pb_Make,
                                'Model_Name': Pb_Model,
                                'Variant_Name': obj_vehicle['Variant_Name'],
                                'Fuel_Name': Pb_Fuel,
                                'Cubic_Capacity': Pb_CC,
                                'Full_Name': Pb_Make + ' ' + Pb_Model + ' ' + obj_vehicle['Variant_Name'] + ' ' + Pb_Fuel + ' ' + Pb_CC
                            };

                            let insurer_cc_slab = null;
                            for (let k in cc_slab[obj_vehicle['Product_Id_New']]) {
                                let ind_cc_slab = cc_slab[obj_vehicle['Product_Id_New']][k];
                                if (Pb_CC >= ind_cc_slab['min'] && Pb_CC <= ind_cc_slab['max']) {
                                    insurer_cc_slab = ind_cc_slab;
                                    continue;
                                }
                            }
                            if ((Pb_CC - insurer_cc_slab['min']) > 200) {
                                insurer_cc_slab['min'] = Pb_CC - 200;
                            }
                            if ((insurer_cc_slab['max'] - Pb_CC) > 200) {
                                insurer_cc_slab['max'] = Pb_CC + 200;
                            }
                            obj_vehicle_mapping.Pb_Vehicle['Insurer_CC_Slab'] = insurer_cc_slab;
                            var Vehicles_Insurer = require('../models/vehicles_insurer');
                            let cond_vehicle_insurer = {
                                'Product_Id_New': obj_vehicle['Product_Id_New'],
                                'PB_Make_Name': Pb_Make,
                                'Insurer_ID': Mapping_Insurer_Id
                            };
                            Vehicles_Insurer.find(cond_vehicle_insurer).exec(function (err, db_vehicle_insurers) {
                                if (db_vehicle_insurers) {
                                    let obj_available_vehicle = {};
                                    for (let k in db_vehicle_insurers) {
                                        let ind_vehicle_insurers = db_vehicle_insurers[k]._doc;
                                        try {
                                            let full_insurer_name = ind_vehicle_insurers['Insurer_Vehicle_Make_Name'] + ' ' + ind_vehicle_insurers['Insurer_Vehicle_Model_Name'] + ' ' + ind_vehicle_insurers['Insurer_Vehicle_Variant_Name'] + ' ' + ind_vehicle_insurers['Insurer_Vehicle_FuelType'] + ' ' + 'CC-' + ind_vehicle_insurers['Insurer_Vehicle_CubicCapacity'].toString();
                                            full_insurer_name = full_insurer_name.toString().toLocaleUpperCase();
                                            let insurer_cc = ind_vehicle_insurers['Insurer_Vehicle_CubicCapacity'] || 0;
                                            insurer_cc = insurer_cc - 0;
                                            if (insurer_cc > 0 && insurer_cc >= insurer_cc_slab['min'] && insurer_cc <= insurer_cc_slab['max']) {
                                                if (full_insurer_name.indexOf(Pb_Fuel.toUpperCase()) > -1) {
                                                    if (full_insurer_name.indexOf(Pb_Model.toUpperCase()) > -1) {
                                                        obj_available_vehicle['Ins_' + ind_vehicle_insurers['Insurer_Vehicle_ID']] = {
                                                            'Full_Name': full_insurer_name,
                                                            'Insurer_Vehicle_ID': ind_vehicle_insurers['Insurer_Vehicle_ID']
                                                        };
                                                    }
                                                }
                                            }
                                        } catch (e) {
                                            obj_vehicle_mapping.Status = 'LOOP_EXCEPTION';
                                            obj_vehicle_mapping.Msg = ind_vehicle_insurers['Insurer_Vehicle_ID'] + '|' + e.stack;
                                            return res.json(obj_vehicle_mapping);
                                        }
                                    }
                                    let Source_String = obj_vehicle_mapping.Pb_Vehicle.Full_Name;
                                    let obj_match_vehicle = {};

                                    for (let i in obj_available_vehicle) {
                                        let indVehicle = obj_available_vehicle[i];
                                        let TargetString = indVehicle['Full_Name'];
//                                        let matchScore = fuzzy(Source_String, TargetString);
                                        let matchScore = (Source_String, TargetString);

                                        if (matchScore > 0) {
                                            obj_match_vehicle[i] = matchScore;
                                            obj_available_vehicle[i]['MatchScore'] = matchScore;
                                        }
                                    }
                                    if (Object.keys(obj_match_vehicle).length > 0) {
                                        obj_match_vehicle = sortObject(obj_match_vehicle);
                                        for (let i in obj_match_vehicle) {
                                            obj_vehicle_mapping.Insurer_Vehicle_List.push(obj_available_vehicle[i]);
                                        }
                                        obj_vehicle_mapping.Status = 'SUCCESS';
                                    } else {
                                        obj_vehicle_mapping.Status = 'NOT_MATCH_AVAILABLE';
                                    }

                                } else {
                                    obj_vehicle_mapping.Status = 'NOT_LIST_AVAILABLE';
                                }
                                return res.json(obj_vehicle_mapping);
                            });
                        } else {
                            obj_vehicle_mapping.Status = 'ALREADY_MAPPED';
                            return res.json(obj_vehicle_mapping);
                        }
                    } else {
                        obj_vehicle_mapping.Status = 'INVALID_VEHICLE';
                        return res.json(obj_vehicle_mapping);
                    }
                } catch (e) {
                    obj_vehicle_mapping.Status = 'MAIN_EXCEPTION';
                    obj_vehicle_mapping.Msg = e.stack;
                    return res.json(obj_vehicle_mapping);
                }
            });
        } else {
            obj_vehicle_mapping.Status = 'EMPTY_VEHICLE_INSURER';
            return res.json(obj_vehicle_mapping);
        }
    });
    app.get('/vehicles/:product_id', function (req, res) {
        var product_id = parseInt(req.params.product_id);
        //Vehicle.find({Product_Id_New: product_id}, function (err, vehicles) {
        Vehicle.find({Product_Id_New: product_id}, {"Vehicle_ID": 1, "Variant_Name": 1, "Model_ID": 1, "Cubic_Capacity": 1, "Vehicle_Image": 1, "Fuel_ID": 1, "Seating_Capacity": 1, "ExShoroomPrice": 1, "IsActive": 1, "CreatedOn": 1, "ModifyOn": 1, "IndirectVariant_Id": 1, "InHouseSS_Variant_Id": 1, "Product_Id_New": 1, "Make_Name": 1, "Model_Name": 1, "Fuel_Name": 1, "Description": 1, "Make_ID": 1, "Product_Sub_Category_Code": 1, "Capacity_Type": 1, "Gross_Vehicle_Weight": 1, "Product_Type": 1, "Product_Sub_Category_Class_CODE": 1, "Product_Sub_Category_Class_Name": 1, "Number_of_wheels": 1, "Insurer_Vehicle_Insurer_Segmant": 1, "Is_Base": 1}, function (err, vehicles) {
            if (err) {
                res.send(err);
            } else {
                res.json(vehicles);
            }
        });
    });

    app.get('/vehicles/vehicle_details/update_fastlane_sale', function (req, res, next) {
        //console.log('Start', this.constructor.name, 'quick_report');
        try {
            var obj_ud_cond = {};
            if (req.query.hasOwnProperty('udid') && req.query['udid'] && req.query['udid'] > 0) {
                let udid = req.query['udid'] - 0;
                obj_ud_cond = {
                    'Product_Id': {$in: [1, 10]},
                    'Premium_Request.vehicle_insurance_type': 'renew',
                    'User_Data_Id': udid,
                    "Last_Status": {"$in": ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}
                };
            } else {
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
                obj_ud_cond = {
                    'Product_Id': {$in: [1, 10]},
                    'Premium_Request.vehicle_insurance_type': 'renew',
                    "Modified_On": {"$gte": dateFrom, "$lte": dateTo},
                    "Last_Status": {"$in": ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}
                };
            }
            let User_Data = require('../models/user_data');
            let Vehicle_Detail = require('../models/vehicle_detail');
            let arr_crn_registration = [];
            User_Data.find(obj_ud_cond).select({'User_Data_Id': 1, 'PB_CRN': 1, 'Erp_Qt_Request_Core': 1, 'Proposal_Request_Core': 1}).exec(function (err, dbUserDatas) {
                if (err) {
                    return res.send(err);
                } else {
                    try {
                        if (dbUserDatas && dbUserDatas.length > 0) {
                            for (let objUd of dbUserDatas) {
                                try {
                                    objUd = objUd._doc;
                                    let reg_no = objUd['Proposal_Request_Core']['registration_no'] || '';
                                    let obj_ud_log = {
                                        'PB_CRN': objUd['PB_CRN'],
                                        'REG_NO': reg_no.toString().replace(/\-/g, '')
                                                //'qry' : "db.getCollection('vehicle_details').update{{'Registration_Number': '"+reg_no+"'},{\"$set\" : {'Sale_CRN' : "+objUd['PB_CRN']+"}});" 
                                    };

                                    if (reg_no !== '' && objUd['PB_CRN'] > 0) {
                                        arr_crn_registration.push(obj_ud_log);
                                        if (req.query['OP'] == 'EXECUTE') {
                                            let obj_UD_Reg = {'$set': {"Sale_CRN": obj_ud_log['PB_CRN']}};
                                            Vehicle_Detail.updateMany({'Registration_Number': obj_ud_log['REG_NO']}, obj_UD_Reg, function (err, dbUpdate_Vehicle_Detail) {
                                                console.log('updated in disposition');
                                                if (err) {
                                                    return res.send(err);
                                                }
                                            });
                                        }
                                    }

                                } catch (e) {
                                    res.send(objUd['PB_CRN'] + '====' + objUd['User_Data_Id'] + '====' + e.stack);
                                    break;
                                }

                            }
                        }
                        res.json(arr_crn_registration);
                    } catch (e) {
                        res.send(e.stack);
                    }
                }
            });
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.get('/vehicles/vehicle_details/fastlane_usage_summary', LoadSession, function (req, res, next) {
        //console.log('Start', this.constructor.name, 'quick_report');
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
                        {'Premium_Request.ss_id': {$in: arr_ch_ssid}}
                    ];
                    //filter['Premium_Request.channel'] = req.obj_session.user.role_detail.channel;
                }
                if (req.query['page_action'] === 'my_transaction' || req.query['page_action'] === 'ch_all_transaction') {
                    var arr_ssid = [];
                    if (req.obj_session.hasOwnProperty('users_assigned')) {
                        var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                        arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                    }
                    obj_cond['Ss_Id'] = req.obj_session.user.ss_id;
                    if (arr_ssid.length > 0) {
                        arr_ssid.push(req.obj_session.user.ss_id);
                        obj_cond['Ss_Id'] = {$in: arr_ssid};
                    }
                }
            }
            let Vehicle_Detail = require('../models/vehicle_detail');
            Vehicle_Detail.find(obj_cond).sort({'Created_On': 1}).select('-_id').exec(function (err, dbVehicle_Details) {
                if (dbVehicle_Details) {
                    try {
                        let obj_fastlane_summary = {
                            'fetching': {
                                'attempt': 0,
                                'received': 0,
                                'not_received': 0,
                                'matched': 0,
                                'mapping_found': 0,
                                'master_avail_matching_found': 0,
                                'master_not_avail_matching_found': 0,
                                'not_matched': 0,
                                'matched_sale_count': 0,
                                'not_matched_sale_count': 0
                            },
                            'channel': {
                                'total': {
                                    'search': 0,
                                    'sale': 0
                                }
                            },
                            'api_execution_time': {
                                'received': {
                                    'average_time': 0,
                                    'less_than_1_sec': 0,
                                    'between_1_and_5_sec': 0,
                                    'more_than_5_sec': 0,
                                    'total': 0
                                },
                                'not_received': {
                                    'average_time': 0,
                                    'less_than_1_sec': 0,
                                    'between_1_and_5_sec': 0,
                                    'more_than_5_sec': 0,
                                    'total': 0
                                }
                            }
                        };
                        for (let k in dbVehicle_Details) {
                            let vd = dbVehicle_Details[k]._doc;
                            obj_fastlane_summary['fetching']['attempt']++;
                            let flag = '';
                            if (vd['Error_Message'] === 'FASTLANE_DATA_NA_API') {
                                flag = 'not_received';
                                obj_fastlane_summary['fetching']['not_received']++;
                            } else {
                                vd['Channel'] = vd['Channel'].replace('-POSP', '').replace('-FOS', '');
                                flag = 'received';
                                obj_fastlane_summary['fetching']['received']++;
                                if (vd['Variant_Id'] > 0) {
                                    obj_fastlane_summary['fetching']['matched']++;
                                    if (vd['Match_Mode'] === 'MAPPING') {
                                        obj_fastlane_summary['fetching']['mapping_found']++;
                                    }
                                    if (vd['Match_Mode'] === 'FASTLANE_MAPPING_NA|LIKE_MATCH') {
                                        obj_fastlane_summary['fetching']['master_avail_matching_found']++;
                                    }
                                    if (vd['Match_Mode'] === 'FASTLANE_MASTER_NA|LIKE_MATCH') {
                                        obj_fastlane_summary['fetching']['master_not_avail_matching_found']++;
                                    }

                                    //channel summary
                                    if (obj_fastlane_summary['channel'].hasOwnProperty(vd['Channel']) === false) {
                                        obj_fastlane_summary['channel'][vd['Channel']] = {
                                            'search': 0,
                                            'sale': 0
                                        };
                                    }
                                    obj_fastlane_summary['channel']['total']['search']++;
                                    obj_fastlane_summary['channel'][vd['Channel']]['search']++;
                                    if (vd['Sale_CRN'] > 0) {
                                        obj_fastlane_summary['channel']['total']['sale']++;
                                        obj_fastlane_summary['channel'][vd['Channel']]['sale']++;
                                        obj_fastlane_summary['fetching']['matched_sale_count']++;
                                    }
                                } else {
                                    obj_fastlane_summary['fetching']['not_matched_sale_count']++;
                                    obj_fastlane_summary['fetching']['not_matched']++;
                                }
                            }
                            let slab = '';
                            vd['FastLane_Execution_Time'] = vd['FastLane_Execution_Time'] || 0;
                            vd['FastLane_Execution_Time'] = vd['FastLane_Execution_Time'] - 0;
                            if (vd['FastLane_Execution_Time'] < 1) {
                                slab = 'less_than_1_sec';
                            } else if (vd['FastLane_Execution_Time'] >= 1 && vd['FastLane_Execution_Time'] <= 5) {
                                slab = 'between_1_and_5_sec';
                            } else {
                                slab = 'more_than_5_sec';
                            }
                            obj_fastlane_summary['api_execution_time'][flag]['total'] += vd['FastLane_Execution_Time'];
                            obj_fastlane_summary['api_execution_time'][flag][slab]++;

                        }

                        obj_fastlane_summary['api_execution_time']['received']['average_time'] = (obj_fastlane_summary['api_execution_time']['received']['total'] / obj_fastlane_summary['fetching']['received']);
                        obj_fastlane_summary['api_execution_time']['received']['average_time'] = Math.round(obj_fastlane_summary['api_execution_time']['received']['average_time'] * 100) / 100;

                        obj_fastlane_summary['api_execution_time']['not_received']['average_time'] = (obj_fastlane_summary['api_execution_time']['not_received']['total'] / obj_fastlane_summary['fetching']['not_received']);
                        obj_fastlane_summary['api_execution_time']['not_received']['average_time'] = Math.round(obj_fastlane_summary['api_execution_time']['not_received']['average_time'] * 100) / 100;
                        if (false) {
                            var today_str = moment().format('YYYYMMDD_HHmmss');
                            let file_name = 'freshquotes_visitor_' + today_str;
                            file_name = file_name.toUpperCase();
                            let file_weburl = config.environment.downloadurl + "/report/" + file_name + '.csv';
                            let csv_file = appRoot + "/tmp/report/" + file_name + '.csv';
                            var ObjectsToCsv = require('objects-to-csv');
                            let csv = new ObjectsToCsv(arr_visitor);
                            csv.toDisk(csv_file);
                            var subject = '[' + config.environment.name.toString().toUpperCase() + '][REPORT]' + file_name;
                            var content_html = '<!DOCTYPE html><html><head><style>*,html,body{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>' + file_name + '</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                            content_html += '<div class="report" ><span>' + file_name + ' ( Count: ' + arr_visitor.length + ')</span><br>';
                            content_html += '<p><a href="' + file_weburl + '" target="_BLANK">' + file_weburl + '</a></p>';
                            var Email = require('../models/email');
                            var objModelEmail = new Email();
                            let arr_to = ['shah.kevin@landmarkinsurance.in', 'hiren.shah@landmarkinsurance.in,varun.kaushik@policyboss.com'];
                            if (req.query['email'] == 'yes') {
                                let arr_to = ['susheeltejuja@landmarkinsurance.in', 'shah.kevin@landmarkinsurance.in', 'hiren.shah@landmarkinsurance.in', 'varun.kaushik@policyboss.com'];
                                if (req.query['dbg'] == 'yes') {
                                    arr_to = ['chirag.modi@policyboss.com'];
                                }
                                objModelEmail.send('notifications@policyboss.com', arr_to.join(','), subject, content_html, '', config.environment.notification_email);
                            }
                            res.send(content_html);
                        }
                        if (req.hasOwnProperty('debug')) {
                            res.send('<pre>' + JSON.stringify(obj_fastlane_summary, undefined, 2) + '</pre>');
                        } else {
                            res.json(obj_fastlane_summary);
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
    app.get('/vehicles/get_most_searched/make_model', function (req, res) {
        try {
            let product_id = req.query['product_id'] || 0;
            product_id = product_id - 0;
            let fromDate = moment().subtract(1, 'month').format('YYYY-MM-DD');
            let toDate = moment().format('YYYY-MM-DD');

            let cache_key = 'vehicles_get_most_searched_make_model_' + product_id + '_' + toDate;
            if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
                let cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
                let obj_cache_content = JSON.parse(cache_content);
                res.json(obj_cache_content);
            } else {
                let cond_ud = {
                    'Product_Id': product_id,
                    'Premium_Request.ss_id': {"$gt": 0},
                    'Is_Last': 'yes'
                };

                let arrFrom = fromDate.split('-');
                let dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
                let arrTo = toDate.split('-');
                let dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
                dateTo.setDate(dateTo.getDate() + 1);
                cond_ud['Modified_On'] = {"$gte": dateFrom, "$lte": dateTo};

                let User_Data = require('../models/user_data');
                let aggr_ud = [
                    {"$match": cond_ud},
                    {"$group": {"_id": {"Make_Name": "$Master_Details.vehicle.Make_Name",
                                "Model_Name": "$Master_Details.vehicle.Model_Name",
                                "Model_ID": "$Master_Details.vehicle.Model_ID"
                            },
                            "Count_Make_Model": {"$sum": 1}
                        }},
                    {"$sort": {"Count_Make_Model": -1}}
                ];
                User_Data.aggregate(aggr_ud).exec(function (err, dbUDMakeModel) {
                    dbUDMakeModel = dbUDMakeModel || [];
                    try {
                        let arr_Preferred_Make_Model = [];
                        if (dbUDMakeModel.length > 0) {
                            for (let k in dbUDMakeModel) {
                                if (dbUDMakeModel[k]['_id']['Model_ID'] && (dbUDMakeModel[k]['_id']['Model_ID'] - 0) > 0) {
                                    arr_Preferred_Make_Model.push({
                                        'Make_Name': dbUDMakeModel[k]['_id']['Make_Name'],
                                        'Model_Name': dbUDMakeModel[k]['_id']['Model_Name'],
                                        'Model_ID': dbUDMakeModel[k]['_id']['Model_ID'] - 0,
                                        'Count_Make_Model': dbUDMakeModel[k]['Count_Make_Model']
                                    });
                                }
                                if (arr_Preferred_Make_Model.length == 10) {
                                    break;
                                }
                            }
                            fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(arr_Preferred_Make_Model), function (err) {});
                        }
                        res.json(arr_Preferred_Make_Model);
                    } catch (e) {
                        res.send(e.stack);
                    }
                });
            }

        } catch (e) {
            res.send(e.stack);
        }
    });
    app.get('/vehicles/get_preferred/make_model', function (req, res) {
        try {
            let ss_id = req.query['ss_id'] || 0;
            let product_id = req.query['product_id'] || 0;
            product_id = product_id - 0;
            ss_id = ss_id - 0;
            if (ss_id > 0) {
                let User_Data = require('../models/user_data');
                let aggr_ud = [
                    {$match: {'Premium_Request.ss_id': ss_id, 'Product_Id': product_id}},
                    {$group: {_id: {"Make_Name": "$Master_Details.vehicle.Make_Name",
                                "Model_Name": "$Master_Details.vehicle.Model_Name",
                                "Model_ID": "$Master_Details.vehicle.Model_ID"
                            },
                            "Count_Make_Model": {"$sum": 1}
                        }},
                    {"$sort": {"Count_Make_Model": -1}}
                ];
                User_Data.aggregate(aggr_ud).exec(function (err, dbUDMakeModel) {
                    dbUDMakeModel = dbUDMakeModel || [];
                    vehicles_get_preferred_make_model_callback(res, dbUDMakeModel, product_id);
                });
            } else {
                vehicles_get_preferred_make_model_callback(res, [], product_id);
            }
        } catch (e) {
            res.send(e.stack);
        }
    });
    function vehicles_get_preferred_make_model_callback(res, dbUDMakeModel, product_id) {
        let obj_const_preferred_make_model = {
            'Product_1': [],
            'Product_10': [],
            'Product_12': []
        };
        let Client = require('node-rest-client').Client;
        let client = new Client();
        client.get(config.environment.weburl + '/vehicles/get_most_searched/make_model?product_id=' + product_id, {}, function (fastlane_data, response) {
            try {
                if (fastlane_data) {
                    obj_const_preferred_make_model['Product_' + product_id] = fastlane_data;
                }
                let arr_Preferred_Make_Model = [];
                if (dbUDMakeModel.length > 0) {
                    for (let k in dbUDMakeModel) {
                        if (dbUDMakeModel[k]['_id']['Model_ID'] && (dbUDMakeModel[k]['_id']['Model_ID'] - 0) > 0) {
                            arr_Preferred_Make_Model.push({
                                'Make_Name': dbUDMakeModel[k]['_id']['Make_Name'],
                                'Model_Name': dbUDMakeModel[k]['_id']['Model_Name'],
                                'Model_ID': dbUDMakeModel[k]['_id']['Model_ID'] - 0,
                                'Count_Make_Model': dbUDMakeModel[k]['Count_Make_Model']
                            });
                        }
                        if (arr_Preferred_Make_Model.length == 6) {
                            break;
                        }
                    }
                }

                //obj_const_preferred_make_model
                let req_count = 6 - arr_Preferred_Make_Model.length;
                if (req_count > 0) {
                    for (let const_pref of obj_const_preferred_make_model['Product_' + product_id]) {
                        arr_Preferred_Make_Model.push({
                            'Make_Name': const_pref['Make_Name'],
                            'Model_Name': const_pref['Model_Name'],
                            'Model_ID': const_pref['Model_ID'] - 0,
                            'Count_Make_Model': 0
                        });
                        if (arr_Preferred_Make_Model.length == 6) {
                            break;
                        }
                    }
                }
                res.json(arr_Preferred_Make_Model);
            } catch (e) {
                res.send(e.stack);
            }
        });

    }
    app.get('/vehicles/vehicle_class/fastlane_reattemp', function (req, res, next) {
        let obj_vehicle_class_summary = {
            'status': null,
            'qry_fail': null,
            'qry_success': null,
            'total_fail': 0,
            'filter_success': 0,
            'filter_fail': 0,
            'reattempt_total': 0,
            'reattempt_fail': 0,
            'reattempt_success': 0,
            'filter_success_list': [],
            'filter_fail_list': {},
            'reattempt_fail_list': {},
            'reattempt_success_list': {},
            'crn_list': {}
        };
        try {
            let now = moment().utcOffset("+05:30");
            let fromDate = null;
            let toDate = null;
            fromDate = moment(now).subtract(4, 'hours');
            toDate = moment(now).subtract(1, 'hours');
            let cond_vehicle_class_fail = {
                'System_ReAttempt': {"$ne": 'yes'},
                'Status': 'FAIL',
                'PB_CRN': {"$gt": 0},
                "Created_On": {"$gte": fromDate, "$lte": toDate}
            };
            obj_vehicle_class_summary['qry_fail'] = cond_vehicle_class_fail;
            let Vehicle_Class = require('../models/vehicle_class');
            Vehicle_Class.distinct('Registration_Number', cond_vehicle_class_fail).exec(function (err, arr_Fail_Vehicle_Classes) {
                if (arr_Fail_Vehicle_Classes && arr_Fail_Vehicle_Classes.length > 0) {
                    obj_vehicle_class_summary['total_fail'] = arr_Fail_Vehicle_Classes.length;
                    let cond_vehicle_class_success = {
                        'Status': 'SUCCESS',
                        'Registration_Number': {"$in": arr_Fail_Vehicle_Classes}
                    };
                    obj_vehicle_class_summary['qry_success'] = cond_vehicle_class_success;
                    Vehicle_Class.distinct('Registration_Number', cond_vehicle_class_success).exec(function (err, arr_Success_Vehicle_Classes) {
                        try {
                            if (arr_Success_Vehicle_Classes && arr_Success_Vehicle_Classes.length > 0) {
                                obj_vehicle_class_summary['filter_success'] = arr_Success_Vehicle_Classes.length;
                                obj_vehicle_class_summary['filter_success_list'] = arr_Success_Vehicle_Classes;
                                let arr_unique_vehicle_number = [];
                                for (let fail_number of arr_Fail_Vehicle_Classes) {
                                    if (arr_Success_Vehicle_Classes.indexOf(fail_number) < 0) {
                                        arr_unique_vehicle_number.push(fail_number);
                                    }
                                }
                                obj_vehicle_class_summary['filter_fail'] = arr_unique_vehicle_number.length;
                                if (obj_vehicle_class_summary['filter_fail'] > 0) {
                                    Vehicle_Class.find({'PB_CRN': {"$gt": 0}, 'Registration_Number': {"$in": arr_unique_vehicle_number}, 'Status': 'FAIL'}).sort({'Created_On': -1}).exec(function (err, obj_Vehicle_Classes_PB_CRN) {
                                        let obj_crn_veh = {};
                                        for (let x in obj_Vehicle_Classes_PB_CRN) {
                                            obj_crn_veh[obj_Vehicle_Classes_PB_CRN[x]._doc['Registration_Number']] = obj_Vehicle_Classes_PB_CRN[x]._doc['PB_CRN'];
                                        }
                                        obj_vehicle_class_summary['filter_fail_list'] = obj_crn_veh;
                                        obj_vehicle_class_summary['url_list'] = [];
                                        if (req.query['op'] == 'EXECUTE') {
                                            let Client = require('node-rest-client').Client;
                                            for (let veh_num_reattempt in obj_crn_veh) {
                                                let client = new Client();
                                                let vc_url = config.environment.weburl + '/quote/fastlane/vehicle_class?System_ReAttempt=yes&PB_CRN=' + obj_crn_veh[veh_num_reattempt] + '&Registration_Number=' + veh_num_reattempt;

                                                let email_url = config.environment.weburl + '/user_datas/send_email/vehicle_class_available?PB_CRN=' + obj_crn_veh[veh_num_reattempt] + '&Registration_Number=' + veh_num_reattempt;

                                                client.get(vc_url, {}, function (fastlane_data, response) {
                                                    if (fastlane_data) {
                                                        if (fastlane_data['Status'] === 'SUCCESS') {
                                                            obj_vehicle_class_summary['url_list'].push({
                                                                "vc_url": vc_url,
                                                                'email_url': email_url
                                                            });
                                                            obj_vehicle_class_summary['reattempt_success_list'][fastlane_data['Registration_Number']] = obj_crn_veh[fastlane_data['Registration_Number']];
                                                            obj_vehicle_class_summary['reattempt_success']++;
                                                        }
                                                        if (fastlane_data['Status'] === 'FAIL') {
                                                            obj_vehicle_class_summary['reattempt_fail_list'][fastlane_data['Registration_Number']] = obj_crn_veh[fastlane_data['Registration_Number']];
                                                            obj_vehicle_class_summary['reattempt_fail']++;
                                                        }
                                                    }
                                                    obj_vehicle_class_summary['reattempt_total']++;
                                                    if (obj_vehicle_class_summary['reattempt_total'] == obj_vehicle_class_summary['filter_fail']) {
                                                        if (obj_vehicle_class_summary['reattempt_success'] > 0) {
                                                            if (req.query['email'] == 'YES') {
                                                                for (let h of obj_vehicle_class_summary['url_list']) {
                                                                    client.get(h['email_url'], {}, function (fastlane_data, response) {});
                                                                }
                                                            }
                                                        }
                                                        var sub = '[SCHEDULE]VEHICLE_CLASS_VERIFICATION::Total-' + obj_vehicle_class_summary['reattempt_total'] + ',Success-' + obj_vehicle_class_summary['reattempt_success'] + ',Fail-' + obj_vehicle_class_summary['reattempt_fail'] + '::' + moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
                                                        var email_data = '<html><body><h2><u>VEHICLE_CLASS_VERIFICATION</u><BR><pre>' + JSON.stringify(obj_vehicle_class_summary, undefined, 2) + '</pre></body></html>';
                                                        var Email = require('../models/email');
                                                        var objModelEmail = new Email();
                                                        objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                                                        res.send('<pre>' + JSON.stringify(obj_vehicle_class_summary, undefined, 2) + '</pre>');
                                                    }
                                                });
                                            }
                                        } else {
                                            res.send('<pre>' + JSON.stringify(obj_vehicle_class_summary, undefined, 2) + '</pre>');
                                        }
                                    });
                                } else {
                                    res.send('<pre>' + JSON.stringify(obj_vehicle_class_summary, undefined, 2) + '</pre>');
                                }
                            } else {
                                res.send('<pre>' + JSON.stringify(obj_vehicle_class_summary, undefined, 2) + '</pre>');
                            }
                        } catch (e) {
                            obj_vehicle_class_summary['status'] = e.stack;
                            res.send('<pre>' + JSON.stringify(obj_vehicle_class_summary, undefined, 2) + '</pre>');
                        }
                    });
                } else {
                    res.send('<pre>' + JSON.stringify(obj_vehicle_class_summary, undefined, 2) + '</pre>');
                }
            });
        } catch (e) {
            obj_vehicle_class_summary['status'] = e.stack;
            res.send('<pre>' + JSON.stringify(obj_vehicle_class_summary, undefined, 2) + '</pre>');
        }
    });

    app.post('/vehicles/get_vehicle_class_master', function (req, res) {
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
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            var ObjRequest = req.body;
            if (ObjRequest && ObjRequest.Vehicle_Class && ObjRequest.Vehicle_class !== null || ObjRequest.Vehicle_class !== undefined) {
                filter["Vehicle_Class"] = ObjRequest["Vehicle_Class"];
            }
            if (ObjRequest && ObjRequest.Product_Id && ObjRequest.Product_Id !== null || ObjRequest.Product_Id !== undefined) {
                filter["Product_Id"] = parseInt(ObjRequest["Product_Id"]);
            }
            var vehicle_class_master = require('../models/vehicle_class_master');
            vehicle_class_master.paginate(filter, optionPaginate, function (err, dbvehicleclassmaster) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(dbvehicleclassmaster);
                }
            });
        } catch (e) {
            console.error(e.stack);
            res.json({"Msg": "error", 'Details': e.stack});
        }
    });

    app.post('/vehicles/get_vehicle_details', function (req, res) {
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
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            var ObjRequest = req.body;
            if (ObjRequest && ObjRequest.RegNo && ObjRequest.RegNo !== null || ObjRequest.RegNo !== undefined) {
                filter["Registration_Number"] = new RegExp(ObjRequest["RegNo"], 'i');
            }
            if (ObjRequest && ObjRequest.Vehicle_Class_Core && ObjRequest.Vehicle_Class_Core !== null || ObjRequest.Vehicle_Class_Core !== undefined) {
                filter['$and'] = [
                    {Vehicle_Class_Core: {$exists: true}},
                    {Vehicle_Class_Core: new RegExp(ObjRequest["Vehicle_Class_Core"], 'i')}
                ];
            }
            var vehicle_detail = require('../models/vehicle_detail');
            vehicle_detail.paginate(filter, optionPaginate, function (err, dbvehicledetail) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(dbvehicledetail);
                }
            });
        } catch (e) {
            console.error(e.stack);
            res.json({"Msg": "error", 'Details': e.stack});
        }
    });

    app.post('/vehicles/get_rcocr_details', function (req, res) {
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
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            var ObjRequest = req.body;
            if (ObjRequest && ObjRequest.RegNo && ObjRequest.RegNo !== null || ObjRequest.RegNo !== undefined) {
                filter["Vehicle_No"] = new RegExp(ObjRequest["RegNo"], 'i');
            }
            if (ObjRequest && ObjRequest.Vehicle_Class && ObjRequest.Vehicle_Class !== null || ObjRequest.Vehicle_Class !== undefined) {
                filter["Vehicle_Class"] = ObjRequest["Vehicle_Class"];
            }
            var rc_ocr_detail = require('../models/rc_ocr_detail');
            rc_ocr_detail.paginate(filter, optionPaginate, function (err, dbrc) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(dbrc);
                }
            });
        } catch (e) {
            console.error(e.stack);
            res.json({"Msg": "error", 'Details': e.stack});
        }
    });

    app.post('/vehicles/get_vehicle_class', function (req, res) {
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
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            var ObjRequest = req.body;
            if (ObjRequest && ObjRequest.RegNo && ObjRequest.RegNo !== null || ObjRequest.RegNo !== undefined) {
                filter["Registration_Number"] = new RegExp(ObjRequest["RegNo"], 'i');
            }
            if (ObjRequest && ObjRequest.Vehicle_Class && ObjRequest.Vehicle_Class !== null || ObjRequest.Vehicle_Class !== undefined) {
                filter["Vehicle_Class"] = ObjRequest["Vehicle_Class"];
            }
            if (ObjRequest && ObjRequest.Vehicle_Class_Core && ObjRequest.Vehicle_Class_Core !== null || ObjRequest.Vehicle_Class_Core !== undefined) {
                filter["Vehicle_Class_Core"] = ObjRequest["Vehicle_Class_Core"];
            }
            var vehicle_class = require('../models/vehicle_class');
            vehicle_class.paginate(filter, optionPaginate, function (err, dbvehicleclass) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(dbvehicleclass);
                }
            });
        } catch (e) {
            console.error(e.stack);
            res.json({"Msg": "error", 'Details': e.stack});
        }
    });
    app.get('/vehicles/vehicle_class/batch_fastlane', function (req, res) {
        var vehicle_class = require('../models/vehicle_class');
        vehicle_class.find({
            'Vehicle_Class_Core': {"$exists": false},
            "Response.result.vehicle_class_description": {"$exists": true},
            'Status': 'SUCCESS',
            'DataVendor': 'ZOOP'}).sort({"Created_On": -1}).limit(5000).exec(function (err, dbvehicleclasses) {
            if (err) {
                res.json(err);
            } else {
                let arr_vc = [];
                for (let dbvehicleclass of dbvehicleclasses) {
                    try {
                        dbvehicleclass = dbvehicleclass._doc;
                        /*arr_vc.push({
                         'Vehicle_Class_Id' : dbvehicleclass['Vehicle_Class_Id'],
                         'Registration_Number' : dbvehicleclass['Registration_Number'],
                         'Vehicle_Class_Core' : dbvehicleclass['Response']['result'][0]['vehicle'][0]['vh_class_desc'].trim().toUpperCase(),
                         });*/
                        let vc_i = dbvehicleclass['Response']['result']['vehicle_class_description'].trim().toUpperCase();
                        arr_vc.push(dbvehicleclass['Vehicle_Class_Id'] + '=' + vc_i);
                        if (req.query['update'] == 'yes') {
                            vehicle_class.updateOne({'Vehicle_Class_Id': dbvehicleclass['Vehicle_Class_Id'], 'Vehicle_Class_Core': {"$exists": false}}, {$set: {'Vehicle_Class_Core': vc_i}}, function (err, numAffected) {});
                        }
                        /*
                         let vc = dbvehicleclass['Response'];
                         if(vc.indexOf('<vh_class_desc>') > -1){
                         let vc_i = vc.substring(vc.indexOf("<vh_class_desc>") + 15,vc.lastIndexOf("</vh_class_desc>"));
                         vc_i = vc_i.trim().toUpperCase();
                         arr_vc.push(dbvehicleclass['Vehicle_Class_Id']+ '='+vc_i);
                         if(req.query['update'] == 'yes'){
                         vehicle_class.updateOne({'Vehicle_Class_Id' : dbvehicleclass['Vehicle_Class_Id'],'Vehicle_Class_Core':{"$exists":false}}, {$set: { 'Vehicle_Class_Core' : vc_i}}, function (err, numAffected) {});
                         }
                         }*/

                    } catch (e) {
                        res.json({
                            "err": e.stack,
                            'd': dbvehicleclass
                        });
                    }
                }
                res.send('<pre>' + JSON.stringify(arr_vc, undefined, 2) + '</pre>');
                //res.send('<pre>' + arr_vc.length + '</pre>');


            }
        });
    });
    app.get('/vehicles/vehicle_details/batch_fastlane', function (req, res) {
        var vehicle_detail = require('../models/vehicle_detail');
        vehicle_detail.find({
            'Error_Message': '',
            'FastlaneResponse': new RegExp('<vh_class_desc>', 'i'),
            'Vehicle_Class_Core': {"$exists": false}
        }).sort({"Created_On": -1}).limit(5000).exec(function (err, dbvehicleclasses) {
            if (err) {
                res.json(err);
            } else {
                let arr_vc = [];
                for (let dbvehicleclass of dbvehicleclasses) {
                    try {
                        dbvehicleclass = dbvehicleclass._doc;
                        /*arr_vc.push({
                         'Vehicle_Class_Id' : dbvehicleclass['Vehicle_Class_Id'],
                         'Registration_Number' : dbvehicleclass['Registration_Number'],
                         'Vehicle_Class_Core' : dbvehicleclass['Response']['result'][0]['vehicle'][0]['vh_class_desc'].trim().toUpperCase(),
                         });*/
                        //let vc_i = dbvehicleclass['Response']['result'][0]['vehicle'][0]['vh_class_desc'][0].trim().toUpperCase();
                        let vc = dbvehicleclass['FastlaneResponse'];
                        if (vc.indexOf('<vh_class_desc>') > -1) {
                            let vc_i = vc.substring(vc.indexOf("<vh_class_desc>") + 15, vc.lastIndexOf("</vh_class_desc>"));
                            vc_i = vc_i.trim().toUpperCase();
                            if (vc_i && vc_i !== '') {
                                arr_vc.push(dbvehicleclass['Vehicle_Detail_Id'] + '=' + vc_i);
                                if (req.query['update'] == 'yes') {
                                    vehicle_detail.updateOne({'Vehicle_Detail_Id': dbvehicleclass['Vehicle_Detail_Id'], 'Vehicle_Class_Core': {"$exists": false}}, {$set: {'Vehicle_Class_Core': vc_i}}, function (err, numAffected) {});
                                }
                            }
                        }
                    } catch (e) {
                        res.json({
                            "err": e.stack,
                            'd': dbvehicleclass
                        });
                    }
                }
                res.send('<pre>' + JSON.stringify(arr_vc, undefined, 2) + '</pre>');
                //res.send('<pre>' + arr_vc.length + '</pre>');


            }
        });
    });
    app.post('/vehicles/update_vehicle_class_master', function (req, res) {
        try {
            let id = req.body.id ? req.body.id : "";
            let vehicle_class = req.body.Vehicle_Class ? req.body.Vehicle_Class : "";
            let vehicleClassMasterObj = {};
            for (var key in req.body) {
                if (key === "id" || key === 'Vehicle_Class') {
                    continue;
                } else {
                    if (key === 'Classified_Status' || key === 'Classified_On' || key === 'Category_Assigned_By') {
                        vehicleClassMasterObj[key] = req.body[key];
                    } else {
                        vehicleClassMasterObj[key] = parseInt(req.body[key]);
                    }
                }
            }
            vehicleClassMasterObj['Classified_On'] = new Date();
            if (id !== "") {
                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                    if (err)
                        throw err;
                    var vehicle_class_master = db.collection('vehicle_class_masters');
                    vehicle_class_master.update({'_id': ObjectID(id)}, {$set: vehicleClassMasterObj}, function (err, numAffected) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": "vehicle class master not updated."});
                        } else {
                            try {
                                let emailcontentObj = {
                                    'Is Car': vehicleClassMasterObj['Is_Car'] === 1 ? "YES" : "NO",
                                    'Is Tw': vehicleClassMasterObj['Is_Tw'] === 1 ? "YES" : "NO",
                                    'Is Miscellaneous': vehicleClassMasterObj['Is_Misc'] === 1 ? "YES" : "NO",
                                    'Is 4 Wheeler LESS THAN OR EQUAL TO 6 PASSENGERS': vehicleClassMasterObj['Is_Pcv_Fw_Lt6pass'] === 1 ? "YES" : "NO",
                                    'Is 3 Wheeler LESS THAN OR EQUAL TO 6 PASSENGERS': vehicleClassMasterObj['Is_Pcv_Thw_Lt6pass'] === 1 ? "YES" : "NO",
                                    'Is 4 Wheeler MORE THAN 6 PASSENGERS': vehicleClassMasterObj['Is_Pcv_Fw_Gt6pass'] === 1 ? "YES" : "NO",
                                    'Is 3 Wheeler BETWEEN 6 TO 17 PASSENGERS': vehicleClassMasterObj['Is_Pcv_Thw_Between6to17pass'] === 1 ? "YES" : "NO",
                                    'Is 2 Wheeler LESS THAN OR EQUAL TO 2 PASSENGERS': vehicleClassMasterObj['Is_Pcv_Tw'] === 1 ? "YES" : "NO",
                                    'Is Public Other than 3 Wheeler': vehicleClassMasterObj['Is_Gcv_Public_Otthw'] === 1 ? "YES" : "NO",
                                    'Is Public 3 Wheeler': vehicleClassMasterObj['Is_Gcv_Public_Thwpc'] === 1 ? "YES" : "NO",
                                    'Classified Status': vehicleClassMasterObj['Classified_Status'],
                                    'Category Assigned By': vehicleClassMasterObj['Category_Assigned_By'],
                                    'Classified On': vehicleClassMasterObj['Classified_On']
                                };

                                if (numAffected && numAffected.result && (numAffected.result.nModified === 1)) {
                                    let Email = require('../models/email');
                                    let objModelEmail = new Email();
                                    let subject = 'VEHICLE CLASS ASSIGNED - ' + vehicle_class;
                                    let mail_content = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>VEHICLE CLASS ASSIGNED</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                    //mail_content += objectToHtml(vehicleClassMasterObj);
                                    mail_content += objectToHtml(emailcontentObj);
                                    mail_content += '</body></html>';
                                    let sendTo = 'product@policyboss.com';
                                    //let cc = 'piyush9320@gmail.com';
                                    //from, to, sub, content, cc, bcc, crn, ss_id = 0config.environment.notification_email
                                    objModelEmail.send('noreply@policyboss.com', sendTo, subject, mail_content, '', config.environment.notification_email, '');
                                    res.json({"Status": "Success", "Msg": "vehicle class master updated successfully."});
                                } else {
                                    res.json({"Status": "Fail", "Msg": "vehicle class master not updated."});
                                }
                            } catch (ex) {
                                console.error('Exception', 'update vehicle class master service', ex);
                                res.json({"Status": "Fail", "Msg": ex.stack});
                            }
                        }
                        db.close();
                    });
                });
            } else {
                res.json({"Status": "Fail", "Msg": "vechicle class master id is missing."});
            }
        } catch (ex) {
            console.error('Exception', 'update vehicle class master service', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });

    app.get('/vehicles/get_allvehicleclass/:vehicleclass', function (req, res) {
        try {
            var vehicle_class = require('../models/vehicle_class');
            let Vehicle_Class = req.params.vehicleclass ? req.params.vehicleclass : "";
            if (Vehicle_Class && Vehicle_Class !== "") {
                vehicle_class.find({"Vehicle_Class_Core": Vehicle_Class}).sort({"Created_On": -1}).limit(10).exec(function (err, dbvehicleclass) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(dbvehicleclass);
                    }
                });
            }

        } catch (e) {
            console.error(e.stack);
            res.json({"Msg": "error", 'Details': e.stack});
        }
    });

    app.get('/vehicles/find_vehicle_class_master/:id', function (req, res) {
        try {
            let id = req.params.id ? req.params.id : "";
            if (id !== "") {
                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                    if (err)
                        throw err;
                    var vehicle_class_master = db.collection('vehicle_class_masters');
                    //                vehicle_class_master.find({'_id': ObjectID(id)} , function (err, dbresult) {
                    vehicle_class_master.find({'_id': ObjectID(id)}).toArray(function (err, dbresult) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            if (dbresult) {
                                res.send(dbresult);
                            }
                        }
                        db.close();
                    });
                });
            } else {
                res.json({"Status": "Fail", "Msg": "id is missing."});
            }
        } catch (ex) {
            console.error('Exception', 'find_vehicle_class_master', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });

    app.post('/vehicles/vehicle_class_master/find_by_vehicle_class', function (req, res) {
        try {
            let vehicle_class = req.body['vehicle_class'] || "";
            if (vehicle_class !== "") {
                var vehicle_class_master = require('../models/vehicle_class_master');
                vehicle_class_master.findOne({"Vehicle_Class": vehicle_class}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult) {
                            dbresult = dbresult._doc;
                            dbresult['Status'] = 'Success';
                            res.json(dbresult);
                        } else {
                            res.json({"Status": "Fail", "Msg": "No Record Available"});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Query params is mandatory."});
            }
        } catch (ex) {
            console.error('Exception', 'vehicle_class_master', ex.stack);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });

    app.get('/vehicles/vehicle_class_master/add_vehicle_class', function (req, res) {
        try {
            let vehicle_class_master = require('../models/vehicle_class_master');
            let vehicle_class = req.query.vehicle_class ? req.query.vehicle_class : "";
            if (vehicle_class !== "") {
                vehicle_class_master.find({"Vehicle_Class": vehicle_class}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            res.json({'Status': "Success", "Msg": vehicle_class + " is already in vehicle class master"});
                        } else {
                            let objdata = {
                                "Vehicle_Class": vehicle_class,
                                "Classified_On": "",
                                "Created_On": new Date()
                            };
                            var objModel = new vehicle_class_master(objdata);
                            objModel.save(function (err, dbData) {
                                if (err) {
                                    res.json({'Status': "Fail", "Msg": err});
                                } else {
                                    res.json({'Status': "Success", "Msg": "Vehicle Class Added Successfully.", "data": dbData});
                                }
                            });
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Vehicle Class is missing from Request."});
            }
        } catch (e) {
            res.json({'Status': "Fail", 'Error': e.stack});
        }
    });
    app.get('/vehicles/vehicle_class/performance_dashboard', function (req, res, next) {
        let obj_vehicle_class_summary = {
            'Vehicle_Class_Detail': {
                'ALL': {
                    'ATTEMPT': 0,
                    'SUCCESS': 0,
                    'SUCCESS_LIST': [],
                    'FAIL': 0,
                    'FAIL_LIST': [],
                    'LIST': [],
                    'SUCCESS_RATE': '',
                    'AVERAGE_TIME': '',
                    'TOTAL_TIME': 0
                },
                'FASTLANE': {
                    'ATTEMPT': 0,
                    'SUCCESS': 0,
                    'SUCCESS_LIST': [],
                    'FAIL': 0,
                    'FAIL_LIST': [],
                    'LIST': [],
                    'SUCCESS_RATE': '',
                    'AVERAGE_TIME': '',
                    'TOTAL_TIME': 0
                },
                'ZOOP': {
                    'ATTEMPT': 0,
                    'SUCCESS': 0,
                    'SUCCESS_LIST': [],
                    'FAIL': 0,
                    'FAIL_LIST': [],
                    'LIST': [],
                    'SUCCESS_RATE': '',
                    'AVERAGE_TIME': '',
                    'TOTAL_TIME': 0
                },
                'AADRILA': {
                    'ATTEMPT': 0,
                    'SUCCESS': 0,
                    'SUCCESS_LIST': [],
                    'FAIL': 0,
                    'FAIL_LIST': [],
                    'LIST': [],
                    'SUCCESS_RATE': '',
                    'AVERAGE_TIME': '',
                    'TOTAL_TIME': 0
                }
            },
            'Qry': null
        };
        try {
            let now = moment().utcOffset("+05:30");

            let fromDate = null;
            let toDate = null;
            let req_fromDate = null;
            let req_toDate = null;
            let type = req.query['type'] || 'TODAY';
            if (type === 'TODAY') {
                fromDate = moment(now).startOf('Day');
                toDate = moment(now).endOf('Day');
            } else if (type === 'DAILY') {
                fromDate = moment(now).subtract(1, 'day').startOf('Day');
                toDate = moment(now).subtract(1, 'day').endOf('Day');
            } else if (type === 'MONTHLY') {
                fromDate = moment(now).startOf('Month');
                toDate = moment(now).endOf('Month');
            } else if (type === 'CUSTOM') {
                let Req_From_Date = req.query['FromDate'] || '';
                let Req_To_Date = req.query['ToDate'] || '';
                if (Req_From_Date && Req_To_Date) {
                    fromDate = moment(Req_From_Date).utcOffset("+05:30").startOf('Day');
                    toDate = moment(Req_To_Date).utcOffset("+05:30").endOf('Day');
                }
            }
            if (fromDate && toDate) {

            } else {
                return res.send('Invalid Range');
            }

            let cond_vehicle_class = {
                "Created_On": {"$gte": fromDate, "$lte": toDate}
            };
            obj_vehicle_class_summary['Qry'] = cond_vehicle_class;
            let Vehicle_Class = require('../models/vehicle_class');
            let arr_vc_summary = [];
            Vehicle_Class.find(cond_vehicle_class).sort({"Created_On": -1, 'Status': -1}).exec(function (err, db_obj_Vehicle_Classes) {
                try {
                    obj_vehicle_class_summary['status'] = 'FAIL';
                    if (db_obj_Vehicle_Classes && db_obj_Vehicle_Classes.length > 0) {
                        for (let k in db_obj_Vehicle_Classes) {
                            let ind_vc = db_obj_Vehicle_Classes[k]._doc;
                            let identi = ind_vc['Registration_Number'] + '_' + ind_vc['DataVendor'];
                            let all_identi = ind_vc['Registration_Number'];


                            if (obj_vehicle_class_summary['Vehicle_Class_Detail'][ind_vc['DataVendor']]['LIST'].indexOf(identi) < 0 &&
                                    obj_vehicle_class_summary['Vehicle_Class_Detail'][ind_vc['DataVendor']]['SUCCESS_LIST'].indexOf(identi) < 0
                                    ) {
                                obj_vehicle_class_summary['Vehicle_Class_Detail'][ind_vc['DataVendor']][ind_vc['Status']]++;
                                obj_vehicle_class_summary['Vehicle_Class_Detail'][ind_vc['DataVendor']][ind_vc['Status'] + '_LIST'].push(identi);
                                obj_vehicle_class_summary['Vehicle_Class_Detail'][ind_vc['DataVendor']]['ATTEMPT']++;
                                obj_vehicle_class_summary['Vehicle_Class_Detail'][ind_vc['DataVendor']]['LIST'].push(identi);
                                obj_vehicle_class_summary['Vehicle_Class_Detail'][ind_vc['DataVendor']]['TOTAL_TIME'] += ind_vc['Call_Execution_Time'];


                            }
                            if (obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['LIST'].indexOf(all_identi) < 0 &&
                                    obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['SUCCESS_LIST'].indexOf(all_identi) < 0) {
                                obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL'][ind_vc['Status']]++;
                                obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL'][ind_vc['Status'] + '_LIST'].push(identi);
                                obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['ATTEMPT']++;
                                obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['LIST'].push(all_identi);
                                obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['TOTAL_TIME'] += ind_vc['Call_Execution_Time'];
                            }
                        }

                        if (obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['ATTEMPT'] > 0) {
                            obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['AVERAGE_TIME'] = Math.round(obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['TOTAL_TIME'] / obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['ATTEMPT']);

                            obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['SUCCESS_RATE'] = Math.round(obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['SUCCESS'] * 100 / obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['ATTEMPT']) + ' %';


                        }

                        if (obj_vehicle_class_summary['Vehicle_Class_Detail']['FASTLANE']['ATTEMPT'] > 0) {
                            obj_vehicle_class_summary['Vehicle_Class_Detail']['FASTLANE']['AVERAGE_TIME'] = Math.round(obj_vehicle_class_summary['Vehicle_Class_Detail']['FASTLANE']['TOTAL_TIME'] / obj_vehicle_class_summary['Vehicle_Class_Detail']['FASTLANE']['ATTEMPT']);
                            obj_vehicle_class_summary['Vehicle_Class_Detail']['FASTLANE']['SUCCESS_RATE'] = Math.round(obj_vehicle_class_summary['Vehicle_Class_Detail']['FASTLANE']['SUCCESS'] * 100 / obj_vehicle_class_summary['Vehicle_Class_Detail']['FASTLANE']['ATTEMPT']) + ' %';

                        }

                        if (obj_vehicle_class_summary['Vehicle_Class_Detail']['ZOOP']['ATTEMPT'] > 0) {
                            obj_vehicle_class_summary['Vehicle_Class_Detail']['ZOOP']['AVERAGE_TIME'] = Math.round(obj_vehicle_class_summary['Vehicle_Class_Detail']['ZOOP']['TOTAL_TIME'] / obj_vehicle_class_summary['Vehicle_Class_Detail']['ZOOP']['ATTEMPT']);
                            obj_vehicle_class_summary['Vehicle_Class_Detail']['ZOOP']['SUCCESS_RATE'] = Math.round(obj_vehicle_class_summary['Vehicle_Class_Detail']['ZOOP']['SUCCESS'] * 100 / obj_vehicle_class_summary['Vehicle_Class_Detail']['ZOOP']['ATTEMPT']) + ' %';


                        }


                        if (obj_vehicle_class_summary['Vehicle_Class_Detail']['AADRILA']['ATTEMPT'] > 0) {
                            obj_vehicle_class_summary['Vehicle_Class_Detail']['AADRILA']['AVERAGE_TIME'] = Math.round(obj_vehicle_class_summary['Vehicle_Class_Detail']['AADRILA']['TOTAL_TIME'] / obj_vehicle_class_summary['Vehicle_Class_Detail']['AADRILA']['ATTEMPT']);
                            obj_vehicle_class_summary['Vehicle_Class_Detail']['AADRILA']['SUCCESS_RATE'] = Math.round(obj_vehicle_class_summary['Vehicle_Class_Detail']['AADRILA']['SUCCESS'] * 100 / obj_vehicle_class_summary['Vehicle_Class_Detail']['AADRILA']['ATTEMPT']) + ' %';
                        }

                        if (req.query['mode'] == 'LITE') {
                            delete obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['LIST'];
                            delete obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['SUCCESS_LIST'];
                            delete obj_vehicle_class_summary['Vehicle_Class_Detail']['ALL']['FAIL_LIST'];

                            delete obj_vehicle_class_summary['Vehicle_Class_Detail']['FASTLANE']['LIST'];
                            delete obj_vehicle_class_summary['Vehicle_Class_Detail']['FASTLANE']['SUCCESS_LIST'];
                            delete obj_vehicle_class_summary['Vehicle_Class_Detail']['FASTLANE']['FAIL_LIST'];

                            delete obj_vehicle_class_summary['Vehicle_Class_Detail']['ZOOP']['LIST'];
                            delete obj_vehicle_class_summary['Vehicle_Class_Detail']['ZOOP']['SUCCESS_LIST'];
                            delete obj_vehicle_class_summary['Vehicle_Class_Detail']['ZOOP']['FAIL_LIST'];

                            delete obj_vehicle_class_summary['Vehicle_Class_Detail']['AADRILA']['LIST'];
                            delete obj_vehicle_class_summary['Vehicle_Class_Detail']['AADRILA']['SUCCESS_LIST'];
                            delete obj_vehicle_class_summary['Vehicle_Class_Detail']['AADRILA']['FAIL_LIST'];
                        }
                    }
                    res.send('<pre>' + JSON.stringify(obj_vehicle_class_summary, undefined, 2) + '</pre>');
                } catch (e) {
                    res.send(e.stack);
                }

            });
        } catch (e) {
            obj_vehicle_class_summary['status'] = e.stack;
            res.send('<pre>' + JSON.stringify(obj_vehicle_class_summary, undefined, 2) + '</pre>');
        }
    });

};
function sortObject(preObj) {
    var newO = {};
    Object.keys(preObj).sort(function (a, b) {
        return preObj[b] - preObj[a];
    }).map(key => newO[key] = preObj[key]);
    return newO;
}

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

function objectToHtml(objSummary) {
    var msg = '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Please find below details for vehicle class assigned</span><table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow: 1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  ><p></p>';
    var row_inc = 0;
    for (var k in objSummary) {
        if (row_inc === 0) {
            msg += '<tr>';
            msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01;text-align: left;">Details</th>';
            msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01;text-align: left;">Value</th>';
            msg += '</tr>';
        }
        msg += '<tr>';
        msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;" >' + k + '</td>';
        msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;" >' + objSummary[k] + '</td>';
        msg += '</tr>';
        row_inc++;
    }
    msg += '</table></div>';
    return msg;
}
