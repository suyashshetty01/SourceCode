/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.db.connection + ':27017/' + config.db.name,{ useMongoClient: true}); // connect to our database

var packing_descriptions = require('../models/packing_description');

module.exports.controller = function (app) {
    app.get('/getPackingdescription/:insurerid?', function (req, res) {
        let insurer_id = req.params.insurerid ? req.params.insurerid : "";
        let filter={};
        if(insurer_id !== ""){
            //filter['Insurer_Id'] = insurer_id;
            filter['$or']=[{"Insurer_ID":insurer_id},{"Insurer_ID":parseInt(insurer_id)}];
        }
        packing_descriptions.find(filter, function (err, data) {
            if (err)
                res.send(err);
            console.log("data");
            console.log(data);
            res.json(data);
        }); 
         
    });
};