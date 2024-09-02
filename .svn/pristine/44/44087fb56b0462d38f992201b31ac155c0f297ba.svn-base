/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');
var Promise = require('promise');

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var marine_warranty = require('../models/marine_warranty');
module.exports.controller = function (app) {
    app.get('/marine_warranty/marine_warranty/:insurer_id/:plan_code/:commodity', function (req, res) {
        var plan_code = req.params.plan_code;
        var insurer_id = req.params.insurer_id - 0;
        var commodity = req.params.commodity;
        marine_warranty.find({Insurer_Id: insurer_id, Plan_Code: plan_code,Commodity:commodity}, function (err, warranty) {
            if (err)
                res.send(err);
            res.json(warranty);
        });

    });
};

