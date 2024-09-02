/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var Rtos_Insurer = require('../models/rtos_insurer');
module.exports.controller = function (app) {
    /**
     * a home page route
     */

    app.get('/rtos_insurers/all', function (req, res) {
        Rtos_Insurer.find(
                {}
        , function (err, rtos_insurers) {
            if (err)
                res.send(err);

            //log email
            var msg = '<!DOCTYPE html><html><head><title>RTO_INSURER</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';

            msg += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">RTO_INSURER</span><table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:         1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  >';
            var row_inc = 0;
            var arr_head = [];
            for (var k in rtos_insurers) {
                if (row_inc === 0) {
                    msg += '<tr>';
                    for (var k_head in rtos_insurers[k]._doc) {
                        msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01">' + k_head + '</th>';
                        arr_head.push(k_head);
                    }
                    msg += '</tr>';
                }
                msg += '<tr>';
                for (var k_row in k_head) {
                    
                    msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;" align="center">' + rtos_insurers[k]._doc[k_row] + '</td>';

                }
                for (var k_row in rtos_insurers[k]._doc) {
                    
                    msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;" align="center">' + rtos_insurers[k]._doc[k_row] + '</td>';

                }
                msg += '</tr>';
                row_inc++;
            }
            msg += '</table></div>';
            res.send(msg);
        });
    });

    app.get('/rtos_insurers/list', function (req, res) {
        Rtos_Insurer.find(
                {'Insurer_ID': parseInt(req.query['Insurer_ID'])}
        , function (err, rtos_insurers) {
            if (err)
                res.send(err);
            res.json({'data': rtos_insurers});
        });
    });
//    app.post('/vehicles_insurers', function (req, res) {
//        var objBase = new Base();
//        var obj_pagination = objBase.jqdt_paginate_process(req.body);
//
//        var optionPaginate = {
//            select: '',
//            sort: {'Insurer_Vehicle_ID': 'asc'},
//            //populate: null,
//            lean: true,
//            page: 1,
//            limit: 10
//        };
//
//        if (obj_pagination) {
//            optionPaginate['page'] = obj_pagination.paginate.page;
//            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
//
//        }
//
//
//        if (req.body['search'] != '') {
//            var filter = {
//                $or: [
//                    {'Insurer_Vehicles_Make_Name': new RegExp(req.body['search'], 'i')},
//                    {'Insurer_Vehicles_Model_Name': new RegExp(req.body['search'], 'i')},
//                    {'Insurer_Vehicles_Variant_Name': new RegExp(req.body['search'], 'i')},
//                    {'Insurer_Vehicles_FuelType': new RegExp(req.body['search'], 'i')}
//                ],
//                $and: [obj_pagination.filter]
//            };
//        } else {
//            var filter = obj_pagination.filter;
//        }
//        Vehicles_Insurer.paginate(filter, optionPaginate).then(function (vehicles_insurers) {
//            console.log(obj_pagination.filter, optionPaginate, vehicles_insurers);
//            res.json(vehicles_insurers);
//        });
//    });

};
