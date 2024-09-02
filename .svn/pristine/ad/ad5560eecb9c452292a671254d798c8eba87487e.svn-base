/* Author: Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
module.exports.controller = function (app) {
    app.post('/quote_download_history', function (req, res) {
        var Summary = {
            'Status': ''
        };
        var ss_id = req.body.ss_id;
        var datetime = req.body.datetime;
        var pdf_file_name = req.body.pdf_file_name;
        var crn = req.body.crn;
        var product_id = req.body.product_id;
        var udid = req.body.udid;
        var quote_download_history = require('../models/quote_download_history');
        quote_download_history.find({}, function (err, getAllData) {
            if (err) {
                res.send(err);
            } else {
                var arg = {
                    Download_History_Id: parseInt(getAllData.length + 1),
                    ss_id: parseInt(ss_id),
                    Date_Time: datetime,
                    Pdf_File_Name: parseInt(pdf_file_name),
                    PB_CRN: parseInt(crn),
                    Product_Id: parseInt(product_id),
                    User_Data_Id: parseInt(udid)
                };
                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                    if (err)
                        throw err;
                    var quote_download_history = db.collection('quote_download_historys');
                    quote_download_history.insertOne(arg, function (err, res1) {
                        if (err) {
                            Summary.Status = err;
                        } else {
                            Summary.Status = 'SUCCESS';
                        }
                        res.json(Summary);
                        db.close();
                    });
                });
            }
        });
    });
};