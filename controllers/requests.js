/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');

mongoose.connect(config.db.connection + ':27017/' + config.db.name,{ useMongoClient: true}); // connect to our database

var Request = require('../models/request');
module.exports.controller = function (app) {
    /**
     * a home page route
     */
    app.get('/requests/:Request_Id', function (req, res) {
        Request.findOne({Request_Id: parseInt(req.params.Request_Id)}, function (err, request) {
            if (err)
                res.send(err);

            res.json(request['_doc']);
        });
    });

    app.get('/requests/:Request_Id/:DB_Field_Name', function (req, res) {
        var DB_Field_Name = req.params.DB_Field_Name;
        Request.findOne({Request_Id: parseInt(req.params.Request_Id)}, function (err, request) {
            if (err)
                res.send(err);

            var content_type = '';
            if (typeof request['_doc'][DB_Field_Name] === 'string') {
                if (request['_doc'][DB_Field_Name].toString().indexOf('<') > -1) {
                    res.header('Content-Type', 'text/xml');
                    res.send( request['_doc'][DB_Field_Name]);
                } else if (request['_doc'][DB_Field_Name].toString().indexOf('{') === 0) {
                    //res.header('Content-Type', 'application/json');
                    var objJson = JSON.parse(request['_doc'][DB_Field_Name]);
                    var objField = JSON.stringify(objJson, undefined, 2);
                    res.send('<pre>' + objField + '</pre>');
                }
            } else {
                //res.header('Content-Type', 'application/json');
                var objField = JSON.stringify(request['_doc'][DB_Field_Name], undefined, 2);
                res.send('<pre>' + objField + '</pre>');
            }

        });
    });
    app.post('/requests', function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: '',
            sort: {'Request_Id': 'asc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);

        }




        Request.paginate(obj_pagination.filter, optionPaginate).then(function (requests) {
            console.log(obj_pagination.filter, optionPaginate, requests);
            res.json(requests);
        });
    });
    app.post('/requests/save', function (req, res) {
        var request = new Request();
        var base = new Base();
        for (var key in req.body) {
            request[key] = req.body[key];
        }

        // get the current date
        var currentDate = new Date();
        if (!req.body.Request_Id) {
            request.Created_On = currentDate;
            request.Is_Active = true;
        }
        request.Modified_On = currentDate;
        // any logic goes here
        console.log(request);
        request.save(function (err) {
            if (err) {
                res.send(err);
            }
            console.log('saved', request);
            res.json({message: 'Request created with Request_Id - ' + request.Secret_Key + ' :: ' + request.Request_Id + ' !'});
        });
    });
    app.get('/requests/view/:id', function (req, res) {

        Request.find(function (err, request) {
            if (err)
                res.send(err);

            res.json(request);
        });
    });
    app.delete('/delete/:id', function (req, res) {
        // any logic goes here
        res.render('requests/view');
    });
    /**
     * About page route
     */
    app.get('/login', function (req, res) {
// any logic goes here
        res.render('users/login')
    });
}
