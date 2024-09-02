/* Author: Dipali Revanwar
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var offline_batch = require('../models/offline_batch');
var offline_transaction = require('../models/offline_transaction');
var config = require('config');
var MongoClient = require('mongodb').MongoClient;
module.exports.controller = function (app) {
    app.get('/get_offline_batches_data', function (req, res) {
        try {
            let start_date = new Date();
            let FromDate = req.query['FromDate'];
            let ToDate = req.query['ToDate'];
            let Product_id;
            let InsurerId;
            let obj = {
                "Start_Date": start_date,
                "Service_Type": "full data",
                "Created_On": new Date(),
                "Modefied_On": new Date()
            };
            try {
                var Client = require('node-rest-client').Client;
                var client = new Client();
                client.get('http://lerpci.policyboss.com/RBServices.svc/GetHorizonReportData?FromDate=' + FromDate + '&ToDate=' + ToDate, {}, function (data, response) {
                    if (data) {
                        var end_time = new Date();
                        //data = {"GetHorizonReportDataResult":[{"AgentID":703402,"AgentName":"SHYAM KUMAR KHATOD","BusinessClass":"Prmium Personal Guard","Category":"Individual","EntryType":"Rnwl","Error":"","FinalPremium":2095,"ID":4207325,"InsCompanyName":"BAJAJ ALLIANZ GENERAL INSURANCE CO LTD","Mode":"NEFT","NetPremium":1775,"ProductName":"P A","ServiceTax":320,"SumAssured":1000000,"UID":104010,"inceptionDate":"19 Aug 2022"},{"AgentID":609712,"AgentName":"RAJI T","BusinessClass":"","Category":"Private - 1 Year OD and 5 Year TP","EntryType":"Fresh","Error":"","FinalPremium":4916,"ID":4207399,"InsCompanyName":"KOTAK MAHINDRA GENERAL INSURANCE CO LTD","Mode":"NEFT","NetPremium":4166,"ProductName":"TWO WHEELER","ServiceTax":750,"SumAssured":67371,"UID":116775,"inceptionDate":"04 Sep 2022"},{"AgentID":715211,"AgentName":"LESLIE LAWRENCE AZAVEDO","BusinessClass":"Health Guard Individual","Category":"Individual","EntryType":"Rnwl","Error":"","FinalPremium":21344,"ID":4207452,"InsCompanyName":"BAJAJ ALLIANZ GENERAL INSURANCE CO LTD","Mode":"NEFT","NetPremium":18088,"ProductName":"HEALTH","ServiceTax":3256,"SumAssured":400000,"UID":113218,"inceptionDate":"07 Sep 2022"}]};
                        var time_start = start_date;
                        var time_end = end_time;
                        let resp = data['GetHorizonReportDataResult'];
                        if (resp) {
                            time_start.setHours(start_date.getHours(), start_date.getMinutes(), start_date.getSeconds(), 0);
                            time_end.setHours(end_time.getHours(), end_time.getMinutes(), end_time.getSeconds(), 0);

                            var diff = time_end - time_start; // millisecond
                            obj['End_Date'] = end_time;
                            obj['Data_Count'] = resp.length;
                            obj['Service_Excecution_Time'] = diff + " ms";
                            obj['Execustion_Status'] = "successful";

                            offline_batch.insertMany(obj, function (err, users) {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log("Successfully data added in offline Batch");
                                    let transactionObj = [];
                                    let batchId;
                                    var mysort = {Batch_Id: -1};
                                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err2, db) {
                                        if (err2) {
                                            throw err2;
                                        } else {
                                            let batches_collection = db.collection('offline_batches');
                                            batches_collection.find({}, {Batch_Id: 1}).sort(mysort).limit(1).toArray(function (er, result) {
                                                if (er) {
                                                    throw er;
                                                } else {
                                                    batchId = result[0]['Batch_Id'];
                                                    for (let x in resp) {
                                                        if (resp[x]['ProductName'] == "Motor") {
                                                            Product_id = 1;
                                                        } else if (resp[x]['ProductName'] == "TWO WHEELER") {
                                                            Product_id = 10;
                                                        } else if (resp[x]['ProductName'] == "NON MOTOR") {
                                                            Product_id = "";
                                                        } else if (resp[x]['ProductName'] == "HEALTH") {
                                                            Product_id = 2;
                                                        } else if (resp[x]['ProductName'] == "P A") {
                                                            Product_id = 8;
                                                        } else if (resp[x]['ProductName'] == "TOP-UP") {
                                                            Product_id = 2;
                                                        } else if (resp[x]['ProductName'] == "TRAVEL") {
                                                            Product_id = 4;
                                                        } else if (resp[x]['ProductName'] == "SUPER TOP-UP") {
                                                            Product_id = 2;
                                                        }
                                                        var InsurerNameList = {
                                                            "BAJAJ ALLIANZ GENERAL INSURANCE CO LTD": 1,
                                                            "KOTAK MAHINDRA GENERAL INSURANCE CO LTD": 30,
                                                            "HDFC ERGO GENERAL INSURANCE CO LTD": 5,
                                                            "ROYAL SUNDARAM GENERAL INSURANCE COMPANY LIMITED": 10,
                                                            "ICICI LOMBARD GENERAL INSURANCE CO LTD": 6,
                                                            "RELIANCE GENERAL INSURANCE CO LTD": 9,
                                                            "MAGMA HDI GENERAL INSURANCE CO LTD": 35,
                                                            "TATA AIG GENERAL INSURANCE CO LTD": 11,
                                                            "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LTD": 3,
                                                            "CARE HEALTH INSURANCE LIMITED": 34,
                                                            "NIVA BUPA HEALTH INSURANCE COMPANY LIMITED": 20,
                                                            "STAR HEALTH AND ALLIED INSURANCE COMPANY LIMITED": 26,
                                                            "LIBERTY GENERAL INSURANCE LTD": 33,
                                                            "FUTURE GENERALI INDIA INSURANCE COMPANY LTD": 4,
                                                            "ADITYA BIRLA HEALTH INSURANCE COMPANY LIMITED": 42
                                                        };
                                                        if (InsurerNameList[resp[x]['InsCompanyName']] !== undefined) {
                                                            InsurerId = InsurerNameList[resp[x]['InsCompanyName']];
                                                        } else {
                                                            InsurerId = 0;
                                                        }

                                                        let transObj = {
                                                            "Batch_Id": batchId,
                                                            "ss_id": resp[x]['AgentID'],
                                                            "Product_Id": Product_id,
                                                            "Product_Name": resp[x]['ProductName'],
                                                            "Insurer_Id": InsurerId,
                                                            "Created_On": new Date(),
                                                            "Modefied_On": new Date(),
                                                            "AgentID": resp[x]['AgentID'],
                                                            "AgentName": resp[x]['AgentName'],
                                                            "BusinessClass": resp[x]['BusinessClass'],
                                                            "Category": resp[x]['Category'],
                                                            "EntryType": resp[x]['EntryType'],
                                                            "Error": resp[x]['Error'],
                                                            "FinalPremium": resp[x]['FinalPremium'],
                                                            "ID": resp[x]['ID'],
                                                            "InsCompanyName": resp[x]['InsCompanyName'],
                                                            "Mode": resp[x]['Mode'],
                                                            "NetPremium": resp[x]['NetPremium'],
                                                            "ProductName": resp[x]['ProductName'],
                                                            "ServiceTax": resp[x]['ServiceTax'],
                                                            "SumAssured": resp[x]['SumAssured'],
                                                            "UID": resp[x]['UID'],
                                                            "inceptionDate": resp[x]['inceptionDate']
                                                        };
                                                        transactionObj.push(transObj);
                                                    }
                                                    offline_transaction.insertMany(transactionObj, function (err1, users) {
                                                        if (err1) {
                                                            throw err1;
                                                        } else {
                                                            console.log("Successfully added in offline transactions");
                                                            res.send("Successfully data added in offline transactions");
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            res.send("No getting proper response from GetHorizonReportData Service");
                        }
                    }
                });
            } catch (e) {
                console.log(e);
            }
        } catch (e1) {
            console.log(e1);
        }
    });
};