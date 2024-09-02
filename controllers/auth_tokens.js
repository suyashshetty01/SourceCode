/* Author : Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let config = require('config');
let mongoose = require('mongoose');
let auth_tokens = require('../models/auth_token');
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

module.exports.controller = function (app) {
    app.post('/auth_tokens/generate_web_auth_token', function (req, res) {
        try {
            let ObjRequest = req.body;
            let ss_id = ObjRequest.ss_id ? ObjRequest.ss_id : '';
            let device_id = ObjRequest.device_id ? ObjRequest.device_id : '';
            let user_agent = ObjRequest.user_agent ? ObjRequest.user_agent : '';
            let auth_token = "";
            let find_data = {
                "SS_ID": ss_id,
                "Device_ID": device_id,
                "User_Agent": user_agent,
                "Status": "Pending",
                "Created_On": {$gte: new Date(new Date().getTime() - 1000 * 60 * 60)} // within one hours generated record
            };
            auth_tokens.find(find_data, function (err, dbData) {
                if (err) {
                    res.json({'Status': 'FAIL', 'Msg': err, 'Token': ''});
                } else {
                    if (dbData.length > 0) {
                        res.json({'Status': 'SUCCESS', 'Msg': 'User Already Login', 'Data': dbData[0]._doc, 'Token': dbData[0]._doc.Auth_Token});
                    } else {
                        auth_token = generateToken();
                        let save_data = {
                            "SS_ID": ss_id,
                            "Device_ID": device_id,
                            "Auth_Token": auth_token,
                            "User_Agent": user_agent,
                            "Created_On": new Date(),
                            "Validate_On": "",
                            "Status": "Pending",
                            "Request_Core": ObjRequest
                        };
                        let saveAuthTokens = new auth_tokens(save_data);
                        saveAuthTokens.save(function (err, dbTokenSave) {
                            if (dbTokenSave && dbTokenSave._doc) {
                                if (err) {
                                    res.json({'Status': 'FAIL', 'Msg': err, 'Token': ''});
                                } else {
                                    res.json({'Status': 'SUCCESS', 'Msg': 'Token Generated successfully', 'Data': dbTokenSave._doc, 'Token': dbTokenSave._doc['Auth_Token']});
                                }
                            } else {
                                res.json({'Status': 'FAIL', 'Msg': "Token Not Generated", 'Token': ''});
                            }
                        });
                    }
                }
            });
        } catch (e) {
            res.json({'Status': 'FAIL', 'Msg': e.stack, 'Token': ''});
        }
    });
    app.post('/auth_tokens/verify_web_auth_token', function (req, res) {
        try {
            let ObjRequest = req.body;
            let auth_token = ObjRequest['auth_token'];
            let user_agent = ObjRequest['user_agent'];
            let find_data = {
                Auth_Token: auth_token,
//                User_Agent: user_agent,
                "Created_On": {$gte: new Date(new Date().getTime() - 1000 * 60 * 60)}
            };
            auth_tokens.find(find_data, function (err, dbData) {
                if (err) {
                    res.json({'Status': 'FAIL', 'Msg': err, 'Token': ''});
                } else {
                    if (dbData && dbData.hasOwnProperty('0') && dbData[0].hasOwnProperty('_doc')) {
                        res.json({'Status': 'SUCCESS', 'Msg': 'Token Verify successfully', 'Data': dbData[0]['_doc'], 'Token': dbData[0]['_doc']['Auth_Token']});
                    } else {
                        res.json({'Status': 'FAIL', 'Msg': 'Token Expire/Token Mismatch', 'Token': ''});
                    }
                }
            });
        } catch (e) {
            res.json({'Status': 'FAIL', 'Msg': e.stack, 'Token': ''});
        }
    });
    app.get('/auth_tokens/get_auth_token_details/:auth_token', function (req, res) {
        try {
            let auth_token = req.params['auth_token'];
            auth_tokens.find({"Auth_Token": auth_token}, function (err, dbData) {
                if (err) {
                    res.json({'Status': 'FAIL', 'Msg': err});
                } else {
                    if (dbData && dbData.hasOwnProperty('0') && dbData[0].hasOwnProperty('_doc')) {
                        res.json({'Status': 'SUCCESS', 'Msg': 'Token Details Get successfully', 'Data': dbData[0]['_doc']});
                    } else {
                        res.json({'Status': 'FAIL'});
                    }
                }
            });
        } catch (e) {
            res.json({'Status': 'FAIL', 'Msg': e.stack});
        }
    });
    app.get('/auth_tokens/update_auth_token_details/:auth_token', function (req, res) {
        try {
            let auth_token = req.params['auth_token'];
            let update_arg = {
                "Status": "Login",
                "Validate_On": new Date()
            };
            auth_tokens.update({'Auth_Token': auth_token}, {$set: update_arg}, function (err, numAffected) {
                if (err) {
                    res.json({'Status': 'FAIL', 'Msg': err});
                } else {
                    res.json({'Status': 'SUCCESS', 'Msg': 'Token Details Updated successfully'});
                }
            });
        } catch (e) {
            res.json({'Status': 'FAIL', 'Msg': e.stack});
        }
    });
    app.get('/auth_tokens/expireToken', function (req, res, next) {
        try {
            var arg = {
                "Status": "Pending",
                "Created_On": {$lte: new Date(new Date().getTime() - 1000 * 60 * 60)}
            };
            auth_tokens.remove(arg, function (err, result) {
                if (err) {
                    res.json({Msg: 'Error'});
                } else {
                    res.json({Msg: 'Success'});
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });
    function generateToken() {
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let token = '';
        let length = 4;
        for (var i = length; i > 0; --i) {
            token += chars[Math.floor(Math.random() * chars.length)];
        };
        token += (Math.random().toString()).slice(-2);
        auth_tokens.find({"Auth_Token": token}).exec(function (err, dbToken) {
            if (err)
                throw err;
            if (dbToken > 0) {
                generateToken();
            }
        });
        return token;
    }
};