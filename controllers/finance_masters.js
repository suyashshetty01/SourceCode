/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var path = require('path');
var fs = require('fs');
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var finance = require('../models/finance_master');

module.exports.controller = function (app) {

    app.get('/get_finance_master/:insurer_id', function (req, res) {
        try {
            var Insurer_id = parseInt(req.params.insurer_id);
            var cache_key = 'live_get_finance_master_' + Insurer_id;
            if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
                var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
                var obj_cache_content = JSON.parse(cache_content);
                res.json(obj_cache_content);
            } else {
                finance.find({"Insurer_ID": Insurer_id}, function (err, dbdata) {
                    if (err) {
                        res.json(err);
                    } else {
                         fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(dbdata), function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                        res.json(dbdata);
                    }
                });
            }

        } catch (e) {

        }
    });
};
