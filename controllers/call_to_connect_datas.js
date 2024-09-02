/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
module.exports.controller = function (app) {
 app.get('/click_to_call/:PB_CRN/:Source', function (req, res, next) {
        let PB_CRN = (req.params.hasOwnProperty('PB_CRN')) ? (req.params['PB_CRN'] - 0) : 0;
        let Source = (req.params.hasOwnProperty('Source')) ? req.params['Source'] : 'PB';
        if (PB_CRN > 0) {
            var Call_To_Connect = require('../models/call_to_connect_data');
            Call_To_Connect.findOne({'PB_CRN': PB_CRN,'Source':Source}).exec(function (err, dbCall_To_Connect) {
                try {
                    if (dbCall_To_Connect) {
                        let Visited_History = dbCall_To_Connect._doc['Visited_History'];
                        Visited_History.unshift(new Date());
                        let Obj_Call_To_Connect = {
                            'Visited_Count': dbCall_To_Connect._doc['Visited_Count'] + 1,
                            'Visited_On': new Date(),
                            'Visited_History': Visited_History
                        };
                        Call_To_Connect.update({'PB_CRN': PB_CRN,'Source':Source}, {$set: Obj_Call_To_Connect}, function (err, numAffected) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send('SUCCESS');
                            }
                        });
                    } else {
                        var ctc = new Call_To_Connect({
                            'PB_CRN': PB_CRN,
                            'Source' : Source,
                            'Visited_Count': 1,
                            'Visited_On': new Date(),
                            'Created_On': new Date(),
                            'Visited_History': [new Date()]
                        });
                        ctc.save(function (err, objDB) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send('SUCCESS');
                            }
                        });
                    }
                } catch (e) {
                    res.send(e.stack);
                }
            });
        } else {
            res.send('EMPTY_CRN');
        }
    });   
};

