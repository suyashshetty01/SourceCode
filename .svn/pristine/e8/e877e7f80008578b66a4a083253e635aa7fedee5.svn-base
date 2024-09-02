/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var config = require('config');
//var mongoose = require('mongoose');
var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var path = require('path');
var fs = require('fs');
var appRoot = path.dirname(path.dirname(require.main.filename));


////mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
//mongoose.Promise = global.Promise;
//mongoose.connect(config.db.connection + ':27017/' + config.db.name,{ useMongoClient: true}); // connect to our database

var Client = require('../models/client');
module.exports.controller = function (app) {
    /**
     * a home page route
     */
    app.get('/clients', function (req, res) {
        var cache_key = 'clients';
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            var obj_cache_content = JSON.parse(cache_content);
            res.json(obj_cache_content);
        } else {
            Client.find(function (err, clients) {
                if (err)
                    res.send(err);
                
                let obj_clients = {};
                for (let k in clients) {
                    obj_clients[clients[k]._doc['Client_Unique_Id']] = clients[k]._doc;
                }
                fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(obj_clients), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                res.json(obj_clients);
            });
        }
    });
    app.post('/clients', function (req, res) {
        //var filter = req.body.filter;
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            //select: 'Client_Name Client_Unique_Id Platform Role Integration_Type Premium_Source Is_Active Modified_On',
            sort: {'Created_On': 'asc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 1
        };

        if (obj_pagination) {
            var optionSort = {};

            if (obj_pagination.sort_key) {
                optionSort[sort_key] = pagination.sort_dir;
                optionPaginate['sort'] = optionSort;
            }
            optionPaginate['page'] = obj_pagination.page;
            optionPaginate['limit'] = obj_pagination.limit;

        }



        Client.paginate(obj_pagination.filter, optionPaginate).then(function (clients) {
            var data_respose = {
                "draw": 1,
                "recordsTotal": 0,
                "recordsFiltered": 0,
                "data": []
            };
            data_respose['recordsTotal'] = clients.total;
            data_respose['recordsFiltered'] = clients.limit;
            data_respose['data'] = clients.docs;
            /*for (var k in clients.docs) {
             var t_arr = [];
             var t_obj = clients.docs[k];
             console.log(t_obj);
             for (var key in t_obj) {
             if (key != '_id' && key != 'id') {
             t_arr.push(t_obj[key]);
             }
             }
             data_respose['data'].push(t_arr);
             }*/
            res.json(data_respose);
        });
        /*
         Client.find(function (err, clients) {
         if (err)
         res.send(err);
         
         res.json(clients);
         });
         */
    });
    app.post('/clients/save', function (req, res) {
        var client = new Client();
        var base = new Base();
        client.Client_Name = req.body.Client_Name;
        client.Platform = req.body.Platform;
        client.Integration_Type = req.body.Integration_Type;
        client.Premium_Source = req.body.Premium_Source;
        client.Role = req.body.Role;


        client.Client_Unique_Id = base.create_guid('CLIENT-');
        client.Secret_Key = base.create_guid('SECRET-');

        // get the current date
        var currentDate = new Date();
        if (!req.body.Client_Id) {
            client.Created_On = currentDate;
            client.Is_Active = true;
        }
        client.Modified_On = currentDate;
        // any logic goes here
        console.log(client);
        client.save(function (err) {
            if (err) {
                res.send(err);
            }
            console.log('saved', client);
            res.json({message: 'Client created with Client_Id - ' + client.Secret_Key + ' :: ' + client.Client_Id + ' !'});
        });
    });
    app.get('/clients/view/:id', function (req, res) {

        Client.find(function (err, client) {
            if (err)
                res.send(err);

            res.json(client);
        });
    });
    app.delete('/delete/:id', function (req, res) {
        // any logic goes here
        res.render('clients/view');
    });
    /**
     * About page route
     */
    app.get('/login', function (req, res) {
        // any logic goes here
        res.render('users/login')
    });

}
