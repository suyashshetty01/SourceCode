/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var fm_log = require('../models/fm_log');
module.exports.controller = function (app) {
    app.post('/fm_logs/save_fm_logs', function (req, res) {
        var fmlog = new fm_log();
        try {
        for (var key in req.body)
        {
            fmlog[key] = req.body[key];
        }
        fmlog.Created_On = new Date();
        fmlog.save(function (err)
        {
            if (err)
            {
                res.json({Status: 'Error', Msg: err});
            } 
            else 
            {
                res.json({Status: 'Success', Msg: 'Data Updated Successfully'});
            }
        });
    }catch(e){
        res.json({Status: 'Error', Msg: e});
    }

    });
};
