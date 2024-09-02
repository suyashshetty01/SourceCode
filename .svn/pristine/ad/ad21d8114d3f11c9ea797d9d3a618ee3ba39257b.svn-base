/* Author: Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var hospital_lists = require('../models/hospital_list');
module.exports.controller = function (app) {
    app.get('/hospital_lists/:insurer_id/:pincode/:city_id?/:state_id?', function (req, res) {
        var pincode = (req.params.pincode).toString();
        var insurer_id = (req.params.insurer_id).toString();
        var city_id = (req.params.city_id).toString();
        var state_id = parseInt(req.params.state_id);
        var query = {};
        query['Insurer_' + insurer_id] = 'YES';

        hospital_lists.find(query, {_id: 0}).exec(function (err, TotalHospital) {
            if (err)
                res.send(err);
            var pincode_hosp = [];
            var city_hosp = [];
            var state_hosp = [];
            for (var i in  TotalHospital) {
                if (pincode === TotalHospital[i]['_doc']['Pincode']) {
                    pincode_hosp.push(TotalHospital[i]);
                }
                if (city_id === TotalHospital[i]['_doc']['CITY_ID']) {
                    city_hosp.push(TotalHospital[i]);
                }
                if (state_id === TotalHospital[i]['_doc']['STATE_ID']) {
                    state_hosp.push(TotalHospital[i]);
                }
            }

            res.json({
                'summary': {
                    'pincode_hospitals_count': pincode_hosp.length,
                    'city_hospitals_count': city_hosp.length,
                    'state_hospitals_count': state_hosp.length,
                    'all_hospitals_count': TotalHospital.length
                },
                'pincode_hospitals': pincode_hosp,
                'city_hospitals': city_hosp,
                'state_hospitals': state_hosp,
                'all_hospitals': TotalHospital
            });
        });

    });
};