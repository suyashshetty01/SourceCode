/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var PincodeInsurer = require('../models/pincode_insurer');
module.exports.controller = function (app) {
    app.get('/pincode/:pincode/:insurer_id', function (req, res) {
        var pincode = parseInt(req.params.pincode);
        var insurer_id = parseInt(req.params.insurer_id);
        var product_id = parseInt(req.query.product_id);
        var pin_con = {};
        if (insurer_id === 42 || insurer_id === 26)
        {
            insurer_id = 9;
        }
        if (product_id && (product_id === 1 || product_id === 10 || product_id === 12) && (insurer_id === 17 || insurer_id === 16 || insurer_id === 18)) {
            pin_con = {
                "Pincode": pincode,
                "Insurer_Id": insurer_id,
                "Product_Id": 1
            };
        } else if (product_id && (product_id === 1 || product_id === 10 || product_id === 12) && insurer_id === 44) {
            pin_con = {
                "Pincode": pincode,
                "Insurer_Id": insurer_id
            };
        } else if (isNaN(product_id) && (insurer_id === 16 || insurer_id === 17)) {
            pin_con = {
                "Pincode": pincode,
                "Insurer_Id": insurer_id,
                "Product_Id": 2
            };
        } else if (product_id === 10 && insurer_id === 48) {
            insurer_id = 33;
            pin_con = {
                "Pincode": pincode,
                "Insurer_Id": insurer_id,
                "Product_Id": {$exists: false}
            };
        } else if (insurer_id === 6) {
            pin_con = {
                "Insurer_Id": insurer_id,
                "Product_Id": {$exists: false}
            };
        } else {
            pin_con = {
                "Pincode": pincode,
                "Insurer_Id": insurer_id,
                "Product_Id": {$exists: false}
            };
        }
        PincodeInsurer.find(pin_con, function (err, PincodeInsurer) {
            if (err)
                res.send(err);

            res.json(PincodeInsurer);
        });
    });

    app.get('/city/:insurer_id', function (req, res) {
        var insurer_id = parseInt(req.params.insurer_id);
        let city_cond = {};
        if (insurer_id === 16 || insurer_id === 17) {
            city_cond = {
                "Insurer_Id": insurer_id,
                "Product_Id": 2
            };
        } else {
            city_cond = {
                "Insurer_Id": insurer_id
            };
        }
        PincodeInsurer.find(city_cond, function (err, PincodeInsurer) {
            if (err)
                res.send(err);
            res.json(PincodeInsurer);
        });
    });

    app.get('/getPinDetails/:pincode', function (req, res) {
        var pin = parseInt(req.params.pincode);
        var Pincode = require('../models/pincode');
        Pincode.findOne({"Pincode": pin}, function (err, Pin) {
            if (err)
                res.send(err);
            res.json(Pin);
        });
    });
};