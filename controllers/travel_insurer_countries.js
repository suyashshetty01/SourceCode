/* Author : Kevin Monteiro
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var TravelCountries = require('../models/travel_insurer_country');
module.exports.controller = function (app) {
    app.get('/traveling_countries/:region/:insurer_id', function (req, res) {
        let region = req.params.region.toString();
        let insurer_id = Number(req.params.insurer_id);
        let filter = {'Insurer_Id': insurer_id, 'IsActive': 1};

        if (region === 'WWExUSCanada') {
            filter['is_UsCanada'] = 'No';
        } else if (region !== 'WorldWide') {
            var region_id = {'Asia': 1, 'Africa': 2, 'Europe': 5};
            filter['Region_ID'] = region_id[region];
        } else {
            if (insurer_id === 44) {
                filter['Region_ID'] = {"$nin": [1]};//Worldwide excluding Asia
            }
        }

        TravelCountries.find(filter, function (err, TravelingCountries) {
            if (err)
                res.send(err);

            res.json(TravelingCountries);
        }).sort({'Country': 1});
    });
};

