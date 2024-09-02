/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var otp = require('../models/otp');
var Email = require('../models/email');
var objModelEmail = new Email();

module.exports.controller = function (app) {
    app.get('/mygetservice/:id?',(req,res)=>{
        let id;
        id = req.params.id;
    });
};


