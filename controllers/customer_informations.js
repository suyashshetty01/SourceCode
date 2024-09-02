/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var customer_information = require('../models/customer_information');
module.exports.controller = function (app) {
    app.post('/customer_information/set_customer_information', function (req, res) {
        var objres = {
            CreateCustomerResult: {}
        };
        try
        {
            var customer_info = new customer_information();
            customer_info.fm_request = req.body;
            for (var key in req.body)
            {
                customer_info[key] = req.body[key];
            }
            customer_info.Created_On = new Date();
            customer_info.Modified_On = new Date();
            customer_information.find({}).sort({"Customer_Info_Id": -1}).limit(1).exec(function (err1, dbRequest) {
                if (err1)
                {

                } else
                {
                    customer_info.save(function (err) {
                        var customer_id = 0;
                        if (dbRequest.length === 0)
                        {
                            customer_id = 1;
                        } else
                        {
                            customer_id = dbRequest;
                        }
                        if (err) {
                            objres['CreateCustomerResult'] = {
                                "MSG": err,
                                "Status": "0",
                                "CustID": "0"
                            };
                            res.json(objres);
                        } else {
                            objres['CreateCustomerResult'] = {
                                "MSG": "Congratulation !! customer created successfully. Kindly note customer id: " + (customer_id[0]['_doc'].Customer_Info_Id -0 +1),
                                "Status": "1",
                                "CustID": customer_id[0]['_doc'].Customer_Info_Id -0 +1
                            };
                            res.json(objres);
                        }
                    });
                }
            });
        } catch (ex)
        {
            objres['CreateCustomerResult'] = {
                "MSG": ex,
                "Status": "0",
                "CustID": "0"
            };
            res.json(objres);
        }
    });
};
