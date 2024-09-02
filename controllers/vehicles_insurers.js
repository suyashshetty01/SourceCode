/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');

var fs = require('fs');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var Vehicles_Insurer = require('../models/vehicles_insurer');
module.exports.controller = function (app) {
    /**
     * a home page route
     */

    app.get('/vehicles_insurers', function (req, res) {
        Vehicles_Insurer.find(function (err, vehicles_insurers) {
            if (err)
                res.send(err);

            res.json(vehicles_insurers);
        });
    });

    app.post('/vehicles_insurers/list', function (req, res) {
        var cache_key = 'vehicles_insurers_list_Product_Id_New_' + req.body['Product_Id_New'] + '_Insurer_ID' + req.body['Insurer_ID'] + 'PB_Make_Name_' + req.body['PB_Make_Name'].replace(/ /g, '');
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            var obj_cache_content = JSON.parse(cache_content);
            res.json(obj_cache_content);
        } else {
            Vehicles_Insurer.find(
                    {
                        'Product_Id_New': parseInt(req.body['Product_Id_New']),
                        'Insurer_ID': parseInt(req.body['Insurer_ID'], ''),
                        'PB_Make_Name': req.body['PB_Make_Name']
                    }, {'PRODUCT': 0, 'CAPACITY_TYPE': 0, 'MASTER CODE (IDV CODE)': 0}
            , function (err, vehicles_insurers) {
                if (err)
                    res.send(err);

                var response_data = {'data': vehicles_insurers};
                fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(response_data), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                res.json(response_data);
            });
        }
    });
    app.post('/vehicles_insurers', function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: '',
            sort: {'Insurer_Vehicle_ID': 'asc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);

        }


        if (req.body['search'] != '') {
            var filter = {
                $or: [
                    {'Insurer_Vehicles_Make_Name': new RegExp(req.body['search'], 'i')},
                    {'Insurer_Vehicles_Model_Name': new RegExp(req.body['search'], 'i')},
                    {'Insurer_Vehicles_Variant_Name': new RegExp(req.body['search'], 'i')},
                    {'Insurer_Vehicles_FuelType': new RegExp(req.body['search'], 'i')}
                ],
                $and: [obj_pagination.filter]
            };
        } else {
            var filter = obj_pagination.filter;
        }
        Vehicles_Insurer.paginate(filter, optionPaginate).then(function (vehicles_insurers) {
            console.log(obj_pagination.filter, optionPaginate, vehicles_insurers);
            res.json(vehicles_insurers);
        });
    });
    app.get('/vehicles_insurers/total_vehicles/:product_id', function (req, res) {
        var product_id = parseInt(req.params.product_id);
        var agg = [
            {"$match": {"Product_Id_New": product_id}},
            {$group: {
                    _id: {Insurer_ID: "$Insurer_ID"},
                    Insurer_Vehicle_Count: {$sum: 1}
                }},
            {$project: {_id: 0, Insurer_ID: "$_id.Insurer_ID", Insurer_Vehicle_Count: "$Insurer_Vehicle_Count"}},
            {$sort: {Insurer_ID: 1, 'Insurer_Vehicle_Count': -1}}
        ];

        Vehicles_Insurer.aggregate(agg, function (err, vehicles) {
            if (err)
                res.send(err);
            var ObjCount = {
                'PB': 0,
                'Insurer': {}
            };
            var Vehicle = require('../models/vehicle');
            Vehicle.count({"Product_Id_New": product_id}, function (err, c) {
                ObjCount.PB = c;
                ObjCount.Insurer = vehicles;
                res.json(ObjCount);
            });
        });
    });


}
