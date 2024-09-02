/*
 * Author : Chirag Modi 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 *
 * 
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var obj_schema = {
    "VehicleCity_Id": {type: Number, required: true},
    "VehicleCity_RTOCode": {type: String, required: true},
    "RTO_City": {type: String, required: true},
    "IsActive": Boolean
};
var arr_insurer = {
	"3": "Chola",
	"47": "DHFL",
	"101": "ERP",
	"16": "RahejaQBE",
	"46": "Edelweiss",
	"45": "Acko",
	"44": "Digit",
	"14": "United",
    "11": "TataAIG",
    "2": "Bharti",
    "4": "FutureGenerali",
    "7": "IffcoTokio",
    "9": "Reliance",
    "10": "RoyalSundaram",
    "12": "NewIndia",
    "19": "UniversalSompo",
    "33": "LibertyVideocon",
    "1": "Bajaj",
    "5": "HdfcErgo",
    "6": "IciciLombard",
    "30": "Kotak",
	"13": "Oriental"
};
for (var k in arr_insurer) {
    obj_schema['Insurer_' + k] = {};
}

var rtoSchema = new Schema(obj_schema);



// the schema is useless so far
// we need to create a model using it
rtoSchema.plugin(mongoosePaginate);
var Rto = mongoose.model('Rto', rtoSchema);

// make this available to our users in our Node applications
module.exports = Rto;