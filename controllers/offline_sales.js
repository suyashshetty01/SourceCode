/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var offline_sale = require('../models/offline_sale');
module.exports.controller = function (app) {
    app.post('/offline_sale', function (req, res) {
        try {
            var objres = {};
            var offline_sale = require('../models/offline_sale');
            offline_sale_data = new offline_sale();
            for (var key in req.body)
            {
                offline_sale_data[key] = req.body[key];
            }
            offline_sale_data.Created_On = new Date();
            offline_sale_data.Modified_On = new Date();
            offline_sale.find({}).sort({"Offline_Sale_Id": -1}).limit(1).exec(function (err1, dbRequest) {
                if (err1)
                {

                } else
                {
                    offline_sale_data.save(function (err) {
                        let offline_sale_id = 0;
                        if (dbRequest.length === 0)
                        {
                            offline_sale_id = 1;
                        } else
                        {
                            offline_sale_id = dbRequest;
                        }
                        if (err) {
                            objres = {
                                "MSG": err,
                                "Status": "0",
                                "Offline_Sale_Id": "0"
                            };
                            res.json(objres);
                        } else {
                            objres = {
                                "MSG": "Congratulation !! offline sale data updated successfully. Kindly note offline sale id: " + (offline_sale_id[0]['_doc'].Offline_Sale_Id - 0 + 1),
                                "Status": "1",
                                "Offline_Sale_Id": offline_sale_id[0]['_doc'].Offline_Sale_Id - 0 + 1
                            };
                            res.json(objres);
                        }
                    });
                }
            });
        } catch (e) {
            objres = {
                "MSG": e,
                "Status": "0",
                "Offline_Sale_Id": "0"
            };
            res.json(objres);
        }
});
};