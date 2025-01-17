/* 
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
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true});

var travel_benefit = require('../models/travel_benefits');
 
module.exports.controller = function (app) {
    app.get('/travel_benefit/benefit/:insurer_id/:plan_id/:geo_area/:travel_ins_type', (req, res) => {
        try {
            var insurer_id = req.params.insurer_id - 0;
            var plan_id = req.params.plan_id - 0;
            var geo_area = req.params.geo_area;
            var insurance_type = (req.params.travel_ins_type);
            insurance_type = insurance_type[0].toUpperCase() + insurance_type.slice(1);
            const criteria = {
                "Insurer_Id": insurer_id,
                "Plan_Id": plan_id,
                "Geographical_Code": {'$regex': geo_area},
                Travel_Insurance_Type: {'$regex': insurance_type}
            };

            travel_benefit.find(criteria, function (err, dbtravel_benefits) {
                if (err)
                    throw err;
                if (dbtravel_benefits.length > 0) {
                    if (dbtravel_benefits[0]['_doc'].hasOwnProperty('Benefit_List')) {
                        dbtravel_benefits = dbtravel_benefits[0]['_doc']['Benefit_List'];
                        console.log(dbtravel_benefits);
                        res.json(dbtravel_benefits);
                    }
                } else {
                    res.json(dbtravel_benefits);
                }
            });
        } catch (e) {
            console.log('Error', e.stack);
        }
    });
};
