/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');



////mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
mongoose.Promise = global.Promise;
//mongoose.connect(config.db.connection + ':27017/' + config.db.name,{ useMongoClient: true}); // connect to our database

var Smartquote = require('../models/smartquote');
module.exports.controller = function (app) {
    /**
     * a home page route
     */
    app.post('/smartquotes/flprocess', function (req, res) {
        var from = parseInt(req.body.from) - 1;
        var to = parseInt(req.body.to) + 1;
        Smartquote.find({"CRN": 0}).limit(10).exec(function (err, smartquotes) {
            if (err)
                res.send(err);

            var SQ = {
                "VehicleNo": null,
                "CustomerReferenceID": null,
                "ProductID": 1,
                "ExShowRoomPrice": 0,
                "ExpectedIDV": 0,
                "IDVinExpiryPolicy": 0,
                "DateofPurchaseofCar": "2016-06-10",
                "VD_Amount": 0,
                "PACoverValue": 0,
                "VehicleCity_Id": 580,
                "Profession_Id": 6,
                "ValueOfElectricalAccessories": 0,
                "ValueOfNonElectricalAccessories": 0,
                "ValueOfBiFuelKit": 0,
                "CurrentNCB": 0,
                "IsClaimInExpiringPolicy": false,
                "ApplyAntiTheftDiscount": false,
                "ApplyAutomobileAssociationDiscount": false,
                "AutomobileAssociationName": "",
                "AutomobileMembershipExpiryDate": "",
                "AutomobileAssociationMembershipNumber": "",
                "PaidDriverCover": false,
                "OwnerDOB": null,
                "Preveious_Insurer_Id": 0,
                "ManufacturingYear": 2016,
                "PolicyExpiryDate": '2017-06-09',
                "VehicleRegisteredName": 1,
                "Variant_ID": 690,
                "RegistrationNumber": "",
                "PlaceofRegistration": "",
                "VehicleType": "1",
                "Existing_CustomerReferenceID": "",
                "ContactName": "sagar",
                "ContactEmail": "",
                "ContactMobile": "",
                "LandmarkEmployeeCode": "",
                "SupportsAgentID": 123,
                "SessionID": "59e979ed-dfc7-4d79-9f28-d427a554917e",
                "SourceType": "APP",
                "InsurerIDArray": ""
            };

            var Client = require('node-rest-client').Client;
            var client = new Client();

            for (var k in smartquotes) {
                var SmartQuote = SQ;
                SmartQuote['Variant_ID'] = smartquotes[k]['Variant_ID'];
                var args = {
                    data: SmartQuote,
                    headers: {
                        "Content-Type": "application/json",
                        'Username': 'test',
                        'Password': 'test@123',
                        'Variant_ID': smartquotes[k]['Variant_ID']
                    }
                };
                client.post('http://vehicleinfo.policyboss.com/api/smartquotes', args, function (data, response) {
                    // parsed response body as js object
                    var Variant_Id = response['req']['_headers']['variant_id'];
                    console.log('full', Variant_Id, data);

                    var InsurerMaster = {
                        'Ins_2': 'Bharti',
                        'Ins_9': 'Reliance',
                        'Ins_33': 'Liberty',
                        'Ins_7': 'Iffco',
                        'Ins_4': 'FG'
                    };

                    var smartquote = {'SQ': data, 'CRN': data[0]['CustomerReferenceID']};

                    var arr_ins = [];
                    for (var j in data) {
                        var Insurer_Id = data[j]['InsurerId'];
                        if (data[j]['QuoteStatus'] === 'Success' && arr_ins.indexOf(Insurer_Id) < 0) {
                            arr_ins.push(Insurer_Id);
                        }
                        smartquote[k][InsurerMaster['Ins_' + Insurer_Id]] = 1;
                    }
                    smartquote[k]['Cnt'] = arr_ins.length;

                    // any logic goes here
                    //console.log(smartquote);
                    Smartquote.findOneAndUpdate({'Variant_ID': Variant_Id}, smartquote, function (err, objSmartquote) {
                        if (err) {
                            //res.send(err);
                            console.log('err', err);
                        } else {
                            console.log('saved');
                        }
                    });
                });
            }
            res.json(smartquotes);
        });

        /*Smartquote.find({}function (err, smartquotes) {
         if (err)
         res.send(err);
         
         res.json(smartquotes);
         });*/
    });

    app.post('/smartquotes/save', function (req, res) {
        var smartquote = new Smartquote();
        var base = new Base();
        for (var key in req.body) {
            smartquote[key] = req.body[key];
        }

        // get the current date
        var currentDate = new Date();
        if (!req.body.Smartquote_Id) {
            smartquote.Created_On = currentDate;
            smartquote.Is_Active = true;
        }
        smartquote.Modified_On = currentDate;
        // any logic goes here
        console.log(smartquote);
        smartquote.save(function (err) {
            if (err) {
                res.send(err);
            }
            console.log('saved', smartquote);
            res.json({message: 'Smartquote created with Smartquote_Id - ' + smartquote.Secret_Key + ' :: ' + smartquote.Smartquote_Id + ' !'});
        });
    });
    app.get('/smartquotes/view/:id', function (req, res) {

        Smartquote.find(function (err, smartquote) {
            if (err)
                res.send(err);

            res.json(smartquote);
        });
    });
    app.delete('/delete/:id', function (req, res) {
        // any logic goes here
        res.render('smartquotes/view');
    });
    /**
     * About page route
     */
    app.get('/login', function (req, res) {
        // any logic goes here
        res.render('users/login')
    });

}
