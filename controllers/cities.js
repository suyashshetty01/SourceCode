/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var City = require('../models/city');
module.exports.controller = function (app) {
    app.get('/cities/list', function (req, res) {
        City.find({}, {City_ID: 1, City_Name: 1, pincode: 1, State_Name: 1, State_ID: 1, '_id': false}, function (err, cities) {
            if (err)
                res.send(err);
            res.json(cities);
        });
    });
    app.get('/cities/city_master_list', function (req, res) {
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err1, db) {
            var city_masters = db.collection('city_master');
            city_masters.find({},{City_ID: 1, City_Name: 1,State_Name: 1, State_ID: 1, '_id': false}).toArray(function (err, cities) {
                if (err)
                    res.send(err);
                    res.json(cities);
            });
        });
    });
};
