/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var product_share = require('../models/product_share');
var product_share_history = require('../models/product_share_history');

module.exports.controller = function (app) {
    app.post('/product_share/product_share_url', function (req, res) {
        try {
            var product_share = require('../models/product_share');
            var product_share_history = require('../models/product_share_history');
            var objReq = req.body;
            var ss_id = objReq['ss_id'] - 0;
            var fba_id = objReq['fba_id'] - 0;
            var sub_fba_id = objReq['sub_fba_id'] - 0;
            var product_id = objReq['product_id'] - 0;
            var product_name = "";
            var send_url, URL = "";
            var msg = "";
            if (product_id === 17)
            {
                msg = "Beat The Pandemic by choosing Corona Insurance along with wellness benefits such as Doctor on Call, Message Relay and more.\n\n";
                msg += "Ensure no unplanned medical event disrupts the safety of your family.\n\n";
                msg += "Stay Safe, Insure Online\n";
            }
            else if(product_id === 23)
            {
                msg = "Secure your good health via a health insurance offering hosp. Upto SI, 405 day care treatments, life long renewablity and much more.\n\n";
                msg += "No Medicals up to age 50.\n\n";
                msg += "Stay Safe, Stay Healthy, Stay Insured\n";
            }           
            else
            {
                msg = "Let's beat the threat of Corona Virus together, by minimizing risk from personal interactions.\n\n";
                msg += "In case you intend to purchase any insurance product, contact me or click here!\n\n";
                msg += "Stay Safe, Make Insurance Payments/ Purchase Online!\n";
            }
            if (ss_id === 0 || product_id === 0 || product_id === "") {
                res.json({'Msg': "Ss_id,Fba_id,Product_id is Required", 'URL': "", 'Status': "Failure"});
            } else
            {
                if (product_id === 1) {
                    product_name = "Car";
                    URL = "https://www.policyboss.com/car-insurance?utm_source=agent_campaign&utm_medium=" + ss_id + "_" + fba_id + "_" + sub_fba_id + "&utm_campaign=FMPCI";
                } else if (product_id === 10) {
                    product_name = "Bike";
                    URL = "https://www.policyboss.com/two-wheeler-insurance?utm_source=agent_campaign&utm_medium=" + ss_id + "_" + fba_id + "_" + sub_fba_id + "&utm_campaign=FMPTW";
                } else if (product_id === 2) {
                    product_name = "Health";
                    URL = "https://www.policyboss.com/Health/?utm_source=agent_campaign&utm_medium=" + ss_id + "_" + fba_id + "_" + sub_fba_id + "&utm_campaign=FMPHI";
                } else if (product_id === 12) {
                    product_name = "CV";
                    URL = "https://www.policyboss.com/commercial-vehicle-insurance/commercial-vehicle-insurance.html?utm_source=agent_campaign&utm_medium=" + ss_id + "_" + fba_id + "_" + sub_fba_id + "&utm_campaign=FMPCV";
                } else if (product_id === 17) {
                    product_name = "Corona Care";
                    URL = 'http://horizon.policyboss.com/wellness_product?ss_id=' + ss_id + '&fba_id=' + fba_id + '&sub_fba_id=' + sub_fba_id;
                }else if (product_id === 23) {
                    product_name = "Group Health Care";
                    URL = 'http://horizon.policyboss.com/kotak-group-health-care?ss_id=' + ss_id + '&fba_id=' + fba_id + '&sub_fba_id=' + sub_fba_id;
                }
				else if (product_id === 3) {
                    product_name = "Group Health Care";
                    URL = 'http://horizon.policyboss.com/hdfc-life-sanchay?ss_id=' + ss_id + '&fba_id=' + fba_id + '&sub_fba_id=' + sub_fba_id;
                }
				else if (product_id === 22) {
                    product_name = "Hospi Fund";
                    URL = "https://www.policyboss.com/Health/?utm_source=agent_campaign&utm_medium=" + ss_id + "_" + fba_id + "_" + sub_fba_id + "&utm_campaign=FMPHI";
                }
                var Client = require('node-rest-client').Client;
                var client = new Client();
                var bitlyURL;
                if (product_id === 17 || product_id === 23 || product_id === 3)
                {
                    bitlyURL = "https://api-ssl.bitly.com/v3/shorten?access_token=" + config.environment.bitly_access_token + '&longUrl=' + encodeURIComponent(URL);
                } else
                {
                    bitlyURL = config.environment.shorten_url + '?longUrl=' + encodeURIComponent(URL);
                }
                var pro_share = new product_share();
                product_share.find({"ss_id": ss_id, "fba_id": fba_id, "product_id": product_id}, function (err, dbData) {
                    if (dbData.length > 0) {
                        var count = parseInt(dbData[0]._doc['Share_Count']) + 1;
                        send_url = dbData[0]._doc['URL'];
                        var objProduct = {
                            "Share_Count": count,
                            "Modified_On": new Date()
                        };
                        product_share.update({"ss_id": ss_id, "fba_id": fba_id, "product_id": product_id}, {$set: objProduct}, function (err, objproduct_share) {
                            if (err) {
                                res.json({'Msg': err, 'URL': "", 'Status': "Failure"});
                            } else {
                                var objproduct_share_history = new product_share_history();
                                for (var key in req.body) {
                                    objproduct_share_history[key] = req.body[key];
                                }
                                objproduct_share_history.Created_On = new Date();
                                objproduct_share_history.Modified_On = new Date();
                                objproduct_share_history.URL = send_url;
                                objproduct_share_history.save(function (err1) {
                                    if (err1) {
                                        res.json({'Msg': err1, 'URL': "", 'Status': "Failure"});
                                    } else {
                                        res.json({'Msg': msg, 'URL': send_url, 'Status': "Success"});
                                    }
                                });
                            }
                        });
                    } else
                    {
                        client.get(bitlyURL, function (data, response) {
                            console.log('Bitly-', data);
                            if (product_id === 17 || product_id === 23 || product_id === 3)
                            {
                                if (data && data.status_code === 200) {
                                    send_url = data.data.url;
                                }
                            } else {
                                if (data && data.Short_Url !== "") {
                                    send_url = data.Short_Url;
                                }
                            }
                            for (var key in req.body) {
                                pro_share[key] = req.body[key];
                            }
                            pro_share.Created_On = new Date();
                            pro_share.Modified_On = new Date();
                            pro_share.Share_Count = 1;
                            pro_share.URL = send_url;
                            pro_share.save(function (err) {
                                if (err) {
                                    res.json({'Msg': err, 'URL': "", 'Status': "Failure"});
                                } else {
                                    var objproduct_share_history = new product_share_history();
                                    for (var key in req.body) {
                                        objproduct_share_history[key] = req.body[key];
                                    }
                                    objproduct_share_history.Created_On = new Date();
                                    objproduct_share_history.Modified_On = new Date();
                                    objproduct_share_history.URL = send_url;
                                    objproduct_share_history.save(function (err1) {
                                        if (err1) {
                                            res.json({'Msg': err1, 'URL': "", 'Status': "Failure"});
                                        } else {
                                            res.json({'Msg': msg, 'URL': send_url, 'Status': "Success"});
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
                //});
            }

        } catch (e) {
            res.json({'Msg': e, 'URL': "", 'Status': "Failure"});
        }
    });
};