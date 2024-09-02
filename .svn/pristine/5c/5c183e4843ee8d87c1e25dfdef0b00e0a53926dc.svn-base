/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.db.connection + ':27017/' + config.db.name,{ useMongoClient: true}); // connect to our database

var Discount_Request = require('../models/discount_request');
module.exports.controller = function (app) {
    app.post('/discount_requests/request', function (req, res) {
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        var args = {
            LM_CRN : objRequestCore['crn'],
            Request_Unique_Id : objRequestCore['search_reference_number'],
            Insurer_Id : objRequestCore['insurer_id'],
            Original_Discount : objRequestCore['original_discount'],
            Desired_Discount : objRequestCore['desired_discount']
        }
        var objDiscount_Request = new Discount_Request(args);
        objDiscount_Request.save(function (err, discount_requests) {
            if (err){
                res.send(err);
            }
            else{
                res.json({Msg:'success'});
            }            
        });
    });
};