/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var wining_wheel_reward = require('../models/wining_wheel_reward');
module.exports.controller = function (app) {
    app.post('/wining_wheel_rewards/generate_wining_wheel_reward', function (req, res) {
        try
        {
            var objBody = req.body;
            var todayDate = new Date();
            var objRequest = {
                "Name": objBody.name,
                "Mobile": objBody.mobile,
                "Pincode": objBody.pincode,
                "Product": objBody.product,
                "Annual_Expense": objBody.annual_expense,
                "Remarks": objBody.remarks,
                "Created_On": todayDate,
                "Modified_On": todayDate
            };
            var wining_wheel_reward = require('../models/wining_wheel_reward');
            var rewards_dataobj = new wining_wheel_reward(objRequest);
            wining_wheel_reward.findOne({"Mobile": objBody.mobile}, function (err, dbRewardData) {
                if (err) {

                } else {
                    if (dbRewardData === null) {
                        rewards_dataobj.save(function (err) {
                            if (err)
                            {
                                res.json({"Status": "Error", "Msg": err});
                            } else
                            {
                                res.json({"Status": "Success", "Msg": "Thank you"});
                            }
                        });
                    } else {
                        res.json({"Status": "Success", "Msg": "Mobile number already exists!"});
                    }
                }
            });
        } catch (e) {
            console.log(e);
            res.json(res.json({"Status": "Error", "Msg": e}));
        }

    });
};

