/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var mongojs = require('mongojs');
var path = require('path');
var fs = require('fs');
var appRoot = path.dirname(path.dirname(require.main.filename));
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
var objBase = new Base();
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var Short_Url = require('../models/short_url');
module.exports.controller = function (app) {
    /**
     * a home page route
     */
    app.get('/sl/:Short_Url_Code', function (req, res) {
        var Short_Url_Code = req.params.Short_Url_Code;
        Short_Url.findOne({Short_Url_Code: Short_Url_Code}, function (err, dbShort_Url) {
            if (err)
                res.send(err);

            if (dbShort_Url) {
                var dbShort_Url = dbShort_Url['_doc'];
                var Visited_History = dbShort_Url.hasOwnProperty('Visited_History') ? dbShort_Url.Visited_History : [];
                var Visited_Count = dbShort_Url.hasOwnProperty('Visited_Count') ? dbShort_Url.Visited_Count : 0;
                Visited_History.unshift({
                    'Visited_On': new Date()
                });
                Short_Url.update({'Short_Url_Id': dbShort_Url.Short_Url_Id}, {$set: {'Visited_On': new Date(), 'Visited_Count': Visited_Count + 1, 'Visited_History': Visited_History}}, function (err, objDBShortURL) {
                    return res.redirect(dbShort_Url['Long_Url']);
                });
            } else {
                return res.send('<h1>Invalid URL</h1>');
            }
        });
    });
    app.get('/short_url/create', function (req, res) {
        var longUrl;
        if (req.query.hasOwnProperty('longUrl') && req.query['longUrl']) {
            longUrl = req.query['longUrl'];
        } else {
            return res.json({'Status': 'ERR', 'msg': 'No Long URL'});
        }
        var shortUrlCode = shortid.generate();
        shortUrlCode = shortUrlCode.replace(/\_/g, '8');
        shortUrlCode = shortUrlCode.replace(/\-/g, '9');
        var objModelShortUrl = new Short_Url({
            'Long_Url': longUrl,
            'Short_Url_Code': shortUrlCode,
            'Short_Url': 'pboss.in/sl/' + shortUrlCode,
            'Created_On': new Date()
        });
        objModelShortUrl.save(function (err, objDBShortURL) {
            if (err) {
                res.send(err);
            } else {
                res.json({
                    'Long_Url': longUrl,
                    'Short_Url': 'pboss.in/sl/' + shortUrlCode
                });
            }
        });
    });
}
