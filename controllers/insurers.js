/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var fs = require('fs');
var Insurer = require('../models/insurer');
module.exports.controller = function (app) {
    /**
     * a home page route
     */
    app.get('/insurers', function (req, res) {
        Insurer.find(function (err, insurers) {
            if (err)
                res.send(err);

            res.json(insurers);
        });
    });
    app.get('/insurers/list', function (req, res) {
        Insurer.find().select('Insurer_ID Insurer_Code').exec(function (err, insurers) {
            if (err)
                res.send(err);

            res.json(insurers);
        });
    });
    app.get('/insurers/view/:id', function (req, res) {

        Insurer.find(function (err, insurer) {
            if (err)
                res.send(err);

            res.json(insurer);
        });
    });
    
    app.get('/insurers/getPrevInsurer/:product_id', function (req, res) {
        var product_id = parseInt(req.params['product_id']);
        var insurerList = {};
        var cache_key = 'live_previous_insurer_list_' + product_id;
        if(fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")){
            var list_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            var cache_list_content = JSON.parse(list_content);
            res.json(cache_list_content);
        }else{
             Insurer.find({Product_Id: {$in : [product_id]}}).select(['Insurer_ID', 'Insurer_Code']).sort({'Insurer_Name': 1}).exec(function (err, insurer_data) {
                try {
                    if (err)
                        throw err;
                    if (insurer_data.length > 0) {
                        for (var inscount in insurer_data) {
                            var insurerListData = [];
                            insurerListData = insurer_data[inscount]._doc;
                            insurerList[inscount] = {
                                "insurer_id" : insurerListData.Insurer_ID,
                                "insurer_name" :insurerListData.Insurer_Code
                            };
                        }
                    }
                    console.log(JSON.stringify(insurerList));
                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(insurerList), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    res.json(insurerList);                
                }catch (e) {
                    console.log("Previous insurer service", e);
                    res.json(e);
                }
            });
        }   
    });
    
     app.get('/insurers/insurer_type', (req, res) => {
        try {
            let objRequest = req.query || "";
            let Insurer = require('../models/insurer');
            if (objRequest.insurer_type) {
                let insurer_type = objRequest.insurer_type;
                let find_args = {
                    "Insurer_Type": insurer_type
                };
                Insurer.find(find_args).select('Insurer_Code Insurer_ID').exec(function (insurer_err, insurers_data) {
                    if (insurer_err) {
                        res.json({"Status": "FAIL", "Msg": "Details Fetch FAIL", "Data": insurer_err});
                    } else {
                        res.json({"Status": "SUCCESS", "Msg": "Details Fetch Successfully", "Data": insurers_data});
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "Insyrer Type Is Mandatory"});
            }
        } catch (err) {
            res.json({"Status": 'EXCEPTION', "Msg": "Exception in /insurers/posp-profile-page API", "Data": err.stack});
        }
    });

};

   
