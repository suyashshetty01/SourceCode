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

var Campaign = require('../models/campaign');
module.exports.controller = function (app) {
    /**
     * a home page route
     */
    app.post('/campaigns/process_regnumber', function (req, res) {
        var reg = req.body.reg;
        var email = req.body.email;

        var args = {
            data: {'registrationnumber': reg},
            headers: {
                "Content-Type": "application/json",
                'Username': 'PBApi',
                'Password': 'PB@123%!'
            }
        };

        var Client = require('node-rest-client').Client;
        var client = new Client();
        //console.log('args', args);
        client.post('http://vehicleinfo.policyboss.com/api/vehicleinfo', args, function (data, response) {
            // parsed response body as js object
            var CampaignId = response['req']['_headers']['campaignid'];
            console.log('full', CampaignId, data);

            var campaign = {'FLData': null, 'FLResponse': null, 'FLStatus': 0, 'PBVehicleId': 0};
            campaign['FLData'] = data;
            var FLStatus = 2; //fail
            if (data.hasOwnProperty('FastlaneResponse') && data['ErrorMessage'] === '') {
                FLStatus = 1;
                campaign['FLResponse'] = JSON.parse(data['FastlaneResponse']);
            }
            campaign['FLStatus'] = FLStatus;
            campaign['PBVehicleId'] = 0;
            if (data.hasOwnProperty('Variant_Id') && data['Variant_Id'] > 0) {
                campaign['PBVehicleId'] = data['Variant_Id'];
            }

            // any logic goes here

        });
    });

    app.post('/campaigns/flprocess', function (req, res) {
        var from = parseInt(req.body.from) - 1;
        var to = parseInt(req.body.to) + 1;
        Campaign.find({'FLStatus': 0}).where('CampaignId').gt(from).lt(to).exec(function (err, campaigns) {
            if (err)
                res.send(err);


            var Client = require('node-rest-client').Client;
            var client = new Client();

            for (var k in campaigns) {
                var args = {
                    data: {'registrationnumber': campaigns[k]['RegistrationNo']},
                    headers: {
                        "Content-Type": "application/json",
                        'Username': 'PBApi',
                        'Password': 'PB@123%!',
                        'CampaignId': campaigns[k]['CampaignId']
                    }
                };
                //console.log('args', args);
                client.post('http://vehicleinfo.policyboss.com/api/vehicleinfo', args, function (data, response) {
                    // parsed response body as js object
                    var CampaignId = response['req']['_headers']['campaignid'];
                    console.log('full', CampaignId, data);

                    var campaign = {'FLData': null, 'FLResponse': null, 'FLStatus': 0, 'PBVehicleId': 0};
                    campaign['FLData'] = data;
                    var FLStatus = 2; //fail
                    if (data.hasOwnProperty('FastlaneResponse') && data['ErrorMessage'] === '') {
                        FLStatus = 1;
                        campaign['FLResponse'] = JSON.parse(data['FastlaneResponse']);
                    }
                    campaign['FLStatus'] = FLStatus;
                    campaign['PBVehicleId'] = 0;
                    if (data.hasOwnProperty('Variant_Id') && data['Variant_Id'] > 0) {
                        campaign['PBVehicleId'] = data['Variant_Id'];
                    }
                    // any logic goes here
                    //console.log(campaign);
                    Campaign.findOneAndUpdate({'CampaignId': CampaignId}, campaign, function (err, objCampaign) {
                        if (err) {
                            //res.send(err);
                            console.log('err', err);
                        } else {
                            //console.log('objCampaign',objCampaign);
                            console.log('saved');
                            /*if (objCampaign.hasOwnProperty('CampaignId')) {
                             console.log('saved', objCampaign['CampaignId']);
                             }
                             else{
                             console.log('not-saved');
                             }*/
                        }
                    });
                });
            }

            res.json(campaigns);
        });

        /*Campaign.find({}function (err, campaigns) {
         if (err)
         res.send(err);
         
         res.json(campaigns);
         });*/
    });

    app.post('/campaigns/save', function (req, res) {
        var campaign = new Campaign();
        var base = new Base();
        for (var key in req.body) {
            campaign[key] = req.body[key];
        }

        // get the current date
        var currentDate = new Date();
        if (!req.body.Campaign_Id) {
            campaign.Created_On = currentDate;
            campaign.Is_Active = true;
        }
        campaign.Modified_On = currentDate;
        // any logic goes here
        console.log(campaign);
        campaign.save(function (err) {
            if (err) {
                res.send(err);
            }
            console.log('saved', campaign);
            res.json({message: 'Campaign created with Campaign_Id - ' + campaign.Secret_Key + ' :: ' + campaign.Campaign_Id + ' !'});
        });
    });
    app.get('/campaigns/view/:id', function (req, res) {

        Campaign.find(function (err, campaign) {
            if (err)
                res.send(err);

            res.json(campaign);
        });
    });
    app.delete('/delete/:id', function (req, res) {
        // any logic goes here
        res.render('campaigns/view');
    });
    /**
     * About page route
     */
    app.get('/login', function (req, res) {
        // any logic goes here
        res.render('users/login')
    });

    app.post('/term_lifeinsurance_campaigns', function (req, res) {
        try {
            var term_Campaign = require('../models/term_campaign');
            var term_life = new term_Campaign();
            for (var key in req.body) {
                term_life[key] = req.body[key];
            }
            term_life.Created_On = new Date();
            term_life.save(function (err) {
                if (err) {
                   res.json({'Status': "Fail", 'Msg': "Error"});
                }
                console.log('saved', term_life);
                res.json({'Status': "Success", 'Msg': "Term Life Campaign created successfully."});
            });

        } catch (e) {

        }
    });

}
