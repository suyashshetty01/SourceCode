/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var appRoot = path.dirname(path.dirname(require.main.filename));

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var Pb_Employee = require('../models/pb_employee');
var User = require('../models/user');

module.exports.controller = function (app) {
    app.get('/pb_employees/list', function (req, res, next) {
        var today = moment().utcOffset("+05:30").startOf('Day');
        let current_date = moment(today).format("YYYYMMDD");

        if (req.query.hasOwnProperty('q') && req.query['q'] !== '') {
            let condi = {'Employee_Name': new RegExp(req.query['q'], 'i')};
            if (isNaN(req.query['q']) === false) {
                condi = {'UID': req.query['q'] - 0};
            }
            User.find(condi, {}, function (err, users) {
                if (err)
                    res.send(err);


                var Posp = require('../models/posp');
                let condi_posp = {"Sources": {$in: ['13', '14', '15', '16', '17', '18']}, 'Erp_Id': {$ne: ''}, 'Is_Active': true};
                if (isNaN(req.query['q']) === false) {
                    condi_posp['Erp_Id'] = req.query['q'].toString();
                } else {
                    condi_posp['$or'] = [
                        {'First_Name': new RegExp(req.query['q'], 'i')},
                        {'Last_Name': new RegExp(req.query['q'], 'i')}
                    ];
                }
                Posp.find(condi_posp).select('Ss_Id First_Name Last_Name Mobile_No Email_Id Sources Agent_City Erp_Id').exec(function (err, dbPosp) {
                    if (dbPosp && dbPosp.length > 0) {
                        for (let k in dbPosp) {
                            if (dbPosp[k]._doc['Erp_Id'] && dbPosp[k]._doc['Erp_Id'] != '' && dbPosp[k]._doc['Erp_Id'].split('')[0] == '4') {
                                users.push({
                                    'Employee_Name': dbPosp[k]._doc['First_Name'] + ' ' + dbPosp[k]._doc['Last_Name'],
                                    'UID': dbPosp[k]._doc['Erp_Id'],
                                    'Phone': dbPosp[k]._doc['Mobile_No'] || '',
                                    'Official_Email': dbPosp[k]._doc['Email_Id'] || '',
                                    'Ss_Id': dbPosp[k]._doc['Ss_Id']
                                });
                            }
                        }
                    }
                    res.json(users);
                });
            });
        } else {
            var cache_key = 'live_pb_employees_list_' + current_date;
            if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
                var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
                var obj_cache_content = JSON.parse(cache_content);
                res.json(obj_cache_content);
            } else {
                User.find({}, function (err, users) {
                    if (err)
                        res.send(err);

                    /*
                     * Branch: "Mumbai_G"
                     Company: "LIBPL"
                     DOJ: "2019-07-29"
                     Dept_Segment: "Low"
                     Dept_Short_Name: "CC_Auto"
                     Designation: "Executive"
                     Direct_Reporting_UID: 105697
                     Email: "roshanikori49@gmail.com"
                     Employee_Name: "Roshini Kaliprasad Kori"
                     Official_Email: null
                     Phone: 8928826485
                     Ss_Id: 14470
                     UID: 113178
                     
                     */
                    var Posp = require('../models/posp');
                    Posp.find({"Sources": {$in: ['13', '14', '15', '16', '17', '18']}, 'Erp_Id': {$ne: ''}, 'Is_Active': true}).select('Ss_Id First_Name Last_Name Mobile_No Email_Id Sources Agent_City Erp_Id').exec(function (err, dbPosp) {
                        for (let k in dbPosp) {
                            if (dbPosp[k]._doc['Erp_Id'] && dbPosp[k]._doc['Erp_Id'] != '' && dbPosp[k]._doc['Erp_Id'].split('')[0] == '4') {
                                users.push({
                                    'Employee_Name': dbPosp[k]._doc['First_Name'] + ' ' + dbPosp[k]._doc['Last_Name'],
                                    'UID': dbPosp[k]._doc['Erp_Id'],
                                    'Phone': dbPosp[k]._doc['Mobile_No'] || '',
                                    'Official_Email': dbPosp[k]._doc['Email_Id'] || '',
                                    'Ss_Id': dbPosp[k]._doc['Ss_Id'],
                                });
                            }
                        }
                        fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(users), function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                        res.json(users);
                    });

                });
            }
        }

    });


}
