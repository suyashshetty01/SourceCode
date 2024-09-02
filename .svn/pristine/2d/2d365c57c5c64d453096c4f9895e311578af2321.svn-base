/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.db.connection + ':27017/' + config.db.name,{ useMongoClient: true}); // connect to our database

var commodities = require('../models/commodity');

module.exports.controller = function (app) {
    app.get('/getCommodities', function (req, res) {
        commodities.find({}, function (err, data) {
            if (err)
                res.send(err);
            res.json(data);
        }); 
         
    });
    
    
    
      app.get('/getCommodityByCode/:Code', function (req, res) {
        var Code = req.params.Code;
        commodities.find({"Code": Code}, function (err, commodity) {
            if (err)
                res.send(err);
            res.json(commodity);
        });
    });
};



