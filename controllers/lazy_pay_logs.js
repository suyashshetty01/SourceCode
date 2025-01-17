/* Author: Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var moment = require('moment');
var lazy_pay_log = require('../models/lazy_pay_log');
var lazy_pay_policy = require('../models/lazy_pay_policy');
const bodyParser = require('body-parser');
const crypto = require('crypto');
let Client = require('node-rest-client').Client;
let client = new Client();
let Lazypay_credentials = {
    6: {
        "production": {
            "access_key": "OYAAE1M92CW5MMAH65IR",
            "secret_key": "c7e6f6f7c28fc11ed1ac2176c13b68bcd9e6d318"
        },
        "uat": {
            "access_key": "P6K6A03MS039NA5MHSOK",
            "secret_key": "73017b15be7d5954adb1182c59caa8b49c84f9d8"
        }
    },
    34: {
        "production": {
            "access_key": "FZNP3MXIOASU6IQABO0D",
            "secret_key": "54b40f2805866301005f4409e52073a6d0a06f68"
        },
        "uat": {
            "access_key": "9GL1J1Y54ZKXIRORPMFN",
            "secret_key": "c7e6f6f7c28fc11ed1ac2176c13b68bcd9e6d318"
        }
    }
};
let environment = config.environment.name === 'Production' ? "production" : "uat";

module.exports.controller = function (app) {
    app.post('/lazy_pay_log/check_eligibility', function (req, res) {
        try {
            var gender = req.body.gender === "M" ? "male" : req.body.gender === "F" ? "female" : "other";
            var request_page = req.body.request_page === "quote" ? "quote" : "proposal";
            if (request_page === "quote") {
                var line1 = req.body.city;
                var line2 = req.body.state;
                var pincode = req.body.pincode.toString();
            } else {
                var line1 = req.body.permanent_address_1 + " " + req.body.permanent_address_2 + " " + req.body.permanent_address_3;
                var line2 = req.body.city_name + "," + req.body.state_name;
                var pincode = req.body.permanent_pincode;
            }
            var db_arg = {
                'PB_CRN': parseInt(req.body.crn),
                'User_Data_Id': parseInt(req.body.udid),
                'Customer Name': req.body.contact_name,
                "Customer_Mobile": parseInt(req.body.mobile),
                "PAN_Card": req.body.pan,
                "Date_of_Birth": req.body.birth_date,
                "Request_Page": request_page,
                "Status": "",
                "LazyPay_Request": "",
                "LazyPay_Response": "",
                "LazyPay_Request_Core": "",
                "Created_On": new Date(),
                "Modified_On": ""
            };

            const str_content = req.body.mobile.toString() + req.body.final_premium.toString() + "INR";//<mobile+amount+currency>
//                    const key = (config.environment.name !== 'Production' ? "898816000f6073d5789e67356a713862d5ffdcf7" : ""); //old
            const key = Lazypay_credentials[(req.body.insurer_id - 0)][environment].secret_key;
//            const key = (config.environment.name !== 'Production' ? "fcb16de88ca043302f61ea1cee8953e3e87c6e46" : "c7e6f6f7c28fc11ed1ac2176c13b68bcd9e6d318"); //new

            const hash = crypto.createHmac('sha1', key)
                    .update(str_content)
                    .digest('hex');
            console.log('LazyPay signature : ', hash);
            args = {
                headers: {
                    "Content-Type": "application/json",
//                            "accessKey": (config.environment.name !== 'Production' ? "BI2HN64L6JLMSY0NYFJ3" : ""), //old
//                    "accessKey": (config.environment.name !== 'Production' ? "9GL1J1Y54ZKXIRORPMFN" : "OYAAE1M92CW5MMAH65IR"), //new
                    "accessKey": Lazypay_credentials[req.body.insurer_id][environment].access_key, //new
                    "signature": hash
                },
                data: {
                    "userDetails": {
                        "firstName": req.body.first_name,
                        "middleName": req.body.middle_name,
                        "lastName": req.body.last_name,
                        "mobile": req.body.mobile.toString(),
                        "pan": req.body.pan,
                        "dob": req.body.birth_date,
                        "gender": gender,
                        "email": req.body.email,
                        "address": {
                            "line1": line1,
                            "line2": line2,
                            "pincode": pincode
                        }
                    },
                    "amount": {
                        "value": req.body.final_premium.toString(),
                        "currency": "INR"
                    },
                    "cbpConsent": {
                        "value": true,
                        "consentTime": moment().utc().format("YYYY-MM-DD HH:mm:ss")
                    }
                }
            };
            let url = (config.environment.name !== 'Production' ? "https://sboxapi.lazypay.in" : "https://api.lazypay.in") + "/api/lazypay/cof/v0/eligibility";
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
            db_arg.LazyPay_Request = JSON.stringify(args.data); // store request
            db_arg.LazyPay_Request_Core = JSON.stringify(args); // store all request
            client.post(url, args, function (data) {
                if (data) {
                    if (data.hasOwnProperty('isEligible') && data['isEligible'] === true) {
                        db_arg.Status = "Success";
                    } else {
                        db_arg.Status = "Fail";
                    }
                    db_arg.LazyPay_Response = JSON.stringify(data);
                    let add_lazy_pay_log = new lazy_pay_log(db_arg);
                    add_lazy_pay_log.save(function (err, res1) {
                        if (err) {
                            console.log("Failed");
                        } else {
                            console.log("Inserted Sucessfully");
                        }
                    });
                    res.json({'Response': data});
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'Response': err.stack});
        }
    });
    app.post('/lazy_pay_log/pg_initiate', function (req, res) {
        try {
            var request = req.body.request;
            var db_arg = {
                'PB_CRN': parseInt(request.crn),
                'User_Data_Id': parseInt(request.udid),
                'Customer Name': request.contact_name,
                "Customer_Mobile": parseInt(request.mobile),
                "PAN_Card": request.pan,
                "Date_of_Birth": request.birth_date,
                "Request_Page": "initiate",
                "Status": "",
                "LazyPay_Request": "",
                "LazyPay_Response": "",
                "LazyPay_Request_Core": "",
                "Created_On": new Date(),
                "Modified_On": "",
                "Call_Execution_Time": 0
            };
            var gender = request.gender === "M" ? "male" : request.gender === "F" ? "female" : "other";
            var merchantTxnId = new Date().getTime().toString();
            var marital_status = request.marital.toLowerCase();
            var insurer = request.insurer_id === 34 ? 'CARE' : 'ICICI';
            if (request.insurer_id === 34) {
                marital_status = request.marital === 'M' ? 'married' : 'single';
            }
            var com_address = request.permanent_address_1 + " " + request.permanent_address_2 + " " + request.permanent_address_3;
            const str_content = request.mobile.toString() + request.final_premium.toString() + "INR";//<mobile+amount+currency>
//        const key = (config.environment.name !== 'Production' ? "898816000f6073d5789e67356a713862d5ffdcf7" : ""); //old
//            const key = (config.environment.name !== 'Production' ? "fcb16de88ca043302f61ea1cee8953e3e87c6e46" : "c7e6f6f7c28fc11ed1ac2176c13b68bcd9e6d318"); //new
            const key = Lazypay_credentials[(request.insurer_id-0)][environment].secret_key;
            const hash = crypto.createHmac('sha1', key)
                    .update(str_content)
                    .digest('hex');
            console.log('LazyPay signature : ', hash);
            args = {
                headers: {
                    "Content-Type": "application/json",
//                "accessKey": (config.environment.name !== 'Production' ? "BI2HN64L6JLMSY0NYFJ3" : ""), //old
//                    "accessKey": (config.environment.name !== 'Production' ? "9GL1J1Y54ZKXIRORPMFN" : "OYAAE1M92CW5MMAH65IR"), //new
                    "accessKey": Lazypay_credentials[(request.insurer_id-0)][environment].access_key,
                    "signature": hash
                },
                data: {
                    "userDetails": {
                        "address": {
                            "line1": com_address,
                            "line2": request.city_name + "," + request.state_name,
                            "pincode": request.permanent_pincode.toString()
                        },
                        "dob": request.birth_date,
                        "email": request.email,
                        "firstName": request.first_name,
                        "gender": gender,
                        "lastName": request.last_name,
                        "maritalStatus": marital_status,
                        "middleName": request.middle_name,
                        "mobile": request.mobile.toString(),
                        "pan": request.pan,
                        "employmentType": req.body.occupation,
                        "fatherName": request.father_name
                    },
                    "amount": {
                        "value": request.final_premium.toString(),
                        "currency": "INR"
                    },
                    "cbpConsent": {
                        "value": true,
                        "consentTime": moment().utc().format("YYYY-MM-DD HH:mm:ss")
                    },
                    "customParams": {
                        "settleWith": insurer,
                        "productType": "Insurance"
                    },
                    "merchantTxnId": merchantTxnId,
                    "backUrl": req.body.return_url,
                    "notifyUrl": req.body.return_url
                }
            };

            db_arg.LazyPay_Request = JSON.stringify(args.data); // store request
            db_arg.LazyPay_Request_Core = JSON.stringify(args); // store all request
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let url = (config.environment.name !== 'Production' ? "https://sboxapi.lazypay.in" : "https://api.lazypay.in") + "/api/lazypay/cof/v0/initiate";
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
            client.post(url, args, function (data) {
                if (data) {
                    if (data.hasOwnProperty('redirectUrl') && data['redirectUrl'] !== "" && data['redirectUrl'] !== null) {
                        db_arg.Status = "Success";
                    } else {
                        db_arg.Status = "Fail";
                    }
                    db_arg.LazyPay_Response = JSON.stringify(data);
                    db_arg.Call_Execution_Time = complete_response(db_arg.Created_On);
                    let add_lazy_pay_log = new lazy_pay_log(db_arg);
                    add_lazy_pay_log.save(function (err, res1) {
                        if (err) {
                            console.log("Failed");
                        } else {
                            console.log("Inserted Sucessfully");
                        }
                    });
                    res.json({'Request': args, 'Response': data});
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'Response': err.stack});
        }
    });
    function complete_response(Created_On) {
        var StartDate = moment(Created_On);
        var EndDate = moment(new Date());
        var Call_Execution_Time = EndDate.diff(StartDate);// get the difference in milliseconds
        Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
        console.log("Time Taken to execute =" + Call_Execution_Time + "seconds");
        return Call_Execution_Time;
    }
    app.post('/lazy_pay_log/policy_number', function (req, res) {
        try {
            var db_arg = {
                "PB_CRN": req.body.crn,
                "UDID": req.body.udid,
                "Insurer_Id": req.body.insurer_id,
                "Policy_No": req.body.policy_number,
                "Created_on": new Date()
            };
            const str_content = req.body.mobile.toString() + req.body.final_premium.toString() + "INR";//<mobile+amount+currency>
//        const key = (config.environment.name !== 'Production' ? "898816000f6073d5789e67356a713862d5ffdcf7" : ""); //old
//            const key = (config.environment.name !== 'Production' ? "fcb16de88ca043302f61ea1cee8953e3e87c6e46" : "c7e6f6f7c28fc11ed1ac2176c13b68bcd9e6d318"); //new
            const key = Lazypay_credentials[(req.body.insurer_id - 0)][environment].secret_key;

            const hash = crypto.createHmac('sha1', key)
                    .update(str_content)
                    .digest('hex');
            console.log('LazyPay signature : ', hash);

            var args = {
                headers: {
                    "signature": hash,
//                "accessKey": (config.environment.name !== 'Production' ? "BI2HN64L6JLMSY0NYFJ3" : ""), //old
//                    "accessKey": (config.environment.name !== 'Production' ? "9GL1J1Y54ZKXIRORPMFN" : "OYAAE1M92CW5MMAH65IR"), //new
                    "accessKey": Lazypay_credentials[(req.body.insurer_id - 0)][environment].access_key,
                    "Token": req.body.token,
                    "Content-Type": "application/json"
                },
                data: {
                    "policyNo": req.body.policy_number
                }
            };
            db_arg.lazy_Pay_Insurer_Request = JSON.stringify(args);
            let url = (config.environment.name !== 'Production' ? "https://sboxapi.lazypay.in" : "https://api.lazypay.in") + "/api/lazypay/cof/v0/update-policy-no";
            client.post(url, args, function (data) {
                if (data) {
                    db_arg.lazy_Pay_Insurer_Response = JSON.stringify(data);
                    let lazy_pay_policy_db = new lazy_pay_policy(db_arg);
                    lazy_pay_policy_db.save(function (err, res1) {
                        if (err) {
                            console.log("Failed");
                            res.json({'Msg': 'Failed'});
                        } else {
                            console.log("Inserted Successfully");
                            res.json({'Msg': 'Success'});
                        }
                    });
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'Response': err.stack});
        }
    });
    app.get('/lazy_pay_log/getDetails/:search', function (req, res) {
        try {
            var search = req.params['search'];
            if (search.includes('PAN_')) {
                var pan_no = search.split('_')[1];
                var filter = {PAN_Card: pan_no};
            } else {
                var crn = (search.split('_')[1]) - 0;
                var filter = {PB_CRN: crn};
            }
            lazy_pay_log.find(filter, function (err, dblazyPay) {
                if (err) {
                    res.json({'Response': err.stack});
                } else {
                    res.json({'Msg': 'Success', 'Response': dblazyPay});
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'Response': err.stack});
        }
    });
    app.post('/lazy_pay_log', function (req, res) {
        try {
            let objReq = req.body;
            var db_arg = {
                'PB_CRN': parseInt(objReq.crn),
                'User_Data_Id': parseInt(objReq.udid),
                'Customer Name': objReq.contact_name,
                "Customer_Mobile": parseInt(objReq.mobile),
                "PAN_Card": objReq.pan.toUpperCase(),
                "Date_of_Birth": objReq.birth_date,
                "Request_Page": "",
                "Status": "",
                "LazyPay_Request": "",
                "LazyPay_Response": "",
                "LazyPay_Request_Core": "",
                "Created_On": new Date(),
                "Modified_On": ""
            };
            var gender = objReq.gender === "M" ? "male" : objReq.gender === "F" ? "female" : "other";
            var occ_obj = {"0": "home-maker", "1": "student", "2": "salaried", "3": "self-employed", "8": "home-maker", "9": "retired", "11": "self-employed"};
            var occupation = occ_obj[objReq.occupation];
            const str_content = objReq.mobile.toString() + objReq.final_premium.toString() + "INR";//<mobile+amount+currency>
//                    const key = (config.environment.name !== 'Production' ? "898816000f6073d5789e67356a713862d5ffdcf7" : ""); //old
            const key = (config.environment.name !== 'Production' ? "73017b15be7d5954adb1182c59caa8b49c84f9d8" : "c7e6f6f7c28fc11ed1ac2176c13b68bcd9e6d318"); //new

            const hash = crypto.createHmac('sha1', key)
                    .update(str_content)
                    .digest('hex');
            console.log('LazyPay signature : ', hash);
            let eligibility_req = {
                headers: {
                    "Content-Type": "application/json",
//                            "accessKey": (config.environment.name !== 'Production' ? "BI2HN64L6JLMSY0NYFJ3" : ""), //old
                    "accessKey": (config.environment.name !== 'Production' ? "9GL1J1Y54ZKXIRORPMFN" : "OYAAE1M92CW5MMAH65IR"), //new
                    "signature": hash
                },
                data: {
                    "userDetails": {
                        "firstName": objReq.first_name,
                        "middleName": objReq.middle_name,
                        "lastName": objReq.last_name,
                        "mobile": objReq.mobile.toString(),
                        "pan": objReq.pan.toUpperCase(),
                        "dob": objReq.birth_date,
                        "gender": gender,
                        "email": objReq.email,
                        "address": {
                            "line1": objReq.address1 + ", " + objReq.address2 + ", " + objReq.address3,
                            "line2": objReq.city + ", " + objReq.state,
                            "pincode": objReq.pincode.toString()
                        }
                    },
                    "amount": {
                        "value": objReq.final_premium.toString(),
                        "currency": "INR"
                    },
                    "cbpConsent": {
                        "value": true,
                        "consentTime": moment().utc().format("YYYY-MM-DD HH:mm:ss")
                    }
                }
            };
            console.log(JSON.stringify(eligibility_req));
            let url = (config.environment.name !== 'Production' ? "https://sboxapi.lazypay.in" : "https://api.lazypay.in") + "/api/lazypay/cof/v0/eligibility";
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
            db_arg.LazyPay_Request = JSON.stringify(eligibility_req.data); // store request
            db_arg.LazyPay_Request_Core = JSON.stringify(eligibility_req); // store all request
            client.post(url, eligibility_req, function (eligibility_res) {
                if (eligibility_res) {
                    db_arg.Request_Page = "proposal";
                    if (eligibility_res.hasOwnProperty('isEligible') && eligibility_res['isEligible'] === true) {
                        db_arg.Status = "Success";
                        var merchantTxnId = new Date().getTime().toString();
                        let initiate_req = {
                            headers: {
                                "Content-Type": "application/json",
                                "accessKey": (config.environment.name !== 'Production' ? "9GL1J1Y54ZKXIRORPMFN" : "OYAAE1M92CW5MMAH65IR"), //new
                                "signature": hash
                            },
                            data: {
                                "userDetails": {
                                    "address": {
                                        "line1": objReq.address1 + ", " + objReq.address2 + ", " + objReq.address3,
                                        "line2": objReq.city + ", " + objReq.state,
                                        "pincode": objReq.pincode
                                    },
                                    "dob": objReq.birth_date,
                                    "email": objReq.email,
                                    "firstName": objReq.first_name,
                                    "gender": gender,
                                    "lastName": objReq.last_name,
                                    "maritalStatus": objReq.marital.toLowerCase(),
                                    "middleName": objReq.middle_name,
                                    "mobile": objReq.mobile.toString(),
                                    "pan": objReq.pan.toUpperCase(),
                                    "employmentType": occupation,
                                    "fatherName": objReq.father_name
                                },
                                "amount": {
                                    "value": objReq.final_premium.toString(),
                                    "currency": "INR"
                                },
                                "cbpConsent": {
                                    "value": true,
                                    "consentTime": moment().utc().format("YYYY-MM-DD HH:mm:ss")
                                },
                                "customParams": {
                                    "settleWith": "ICICI",
                                    "productType": "Insurance"
                                },
                                "merchantTxnId": merchantTxnId,
                                "backUrl": objReq.return_url,
                                "notifyUrl": objReq.return_url
                            }
                        };
                        console.log(JSON.stringify(initiate_req));
                        let url = (config.environment.name !== 'Production' ? "https://sboxapi.lazypay.in" : "https://api.lazypay.in") + "/api/lazypay/cof/v0/initiate";
                        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                        client.post(url, initiate_req, function (initiate_res) {
                            if (initiate_res) {
                                db_arg.LazyPay_Request = JSON.stringify(initiate_req.data); // store request
                                db_arg.LazyPay_Request_Core = JSON.stringify(initiate_req); // store all request
                                db_arg.Request_Page = "initiate";
                                if (initiate_res.hasOwnProperty('redirectUrl') && initiate_res['redirectUrl'] !== "" && initiate_res['redirectUrl'] !== null) {
                                    db_arg.Status = "Success";
                                } else {
                                    db_arg.Status = "Fail";
                                }
                                db_arg.LazyPay_Response = JSON.stringify(initiate_res);
                                let add_lazy_pay_log = new lazy_pay_log(db_arg);
                                add_lazy_pay_log.save(function (err, res1) {
                                    if (err) {
                                        res.json({Status: 'Error', Msg: err.stack});
                                    }
                                });
                                if (db_arg.Status === "Success") {
                                    res.json({'Status': db_arg.Status, 'Response': initiate_res});
                                } else {
                                    res.json({'Status': db_arg.Status, 'Request': initiate_req, 'Response': initiate_res});
                                }

                            }
                        });
                    } else {
                        db_arg.Status = "Fail";
                    }
                    db_arg.LazyPay_Response = JSON.stringify(eligibility_res);
                    let add_lazy_pay_log = new lazy_pay_log(db_arg);
                    add_lazy_pay_log.save(function (err, res1) {
                        if (err) {
                            res.json({Status: 'Error', Msg: err.stack});
                        }
                    });
                    if (db_arg.Status === "Fail") {
                        res.json({'Status': db_arg.Status, 'Request': eligibility_req, 'Response': eligibility_res});
                    }
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'Response': err.stack});
        }
    });
};