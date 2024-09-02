/* Author : Kevin Monteiro
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

module.exports.controller = function (app) {
    app.get('/highway_delite/save_data', function (req, res) {
        let HighwayDelites = require('../models/highway_delite');
        req.query.Created_On =  new Date();
        req.query.Modified_On =  new Date();
        req.query.query_string = req.url.split("?")[1];
        let HighwayDelites_data = new HighwayDelites(req.query);
        HighwayDelites_data.save(function (err, objDB) {
            if (err) {
                res.send(err);
            } else {
                res.send('SUCCESS');
            }
        });
    });
};