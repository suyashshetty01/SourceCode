/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.db.connection + ':27017/' + config.db.name,{ useMongoClient: true}); // connect to our database

var cargos = require('../models/cargo');

module.exports.controller = function (app) {
    app.get('/cargotype', function (req, res) {
        cargos.find({}, function (err, data) {
            if (err)
                res.send(err);
            res.json(data);
        }); 
         
    });
};



