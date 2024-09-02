/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');
 app = express();

module.exports.controller = function(call){
    call.get('/service/myService/:name/:id?', function(req,res){
        console.log('service called');
        let name = req.params['name'];
        let id = req.params['id'];
        let product = req.query['product'];
        let premium = req.query['amount'];
    });

call.post('/service/sendDetails', function(req,res){
    var objReq = req.body;
    var q1 = req.query['name'];
    var param1 = req.params['code'];
    console.log(objReq);
});

};

