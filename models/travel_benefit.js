/* 
 * mg30-04-2022
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.promise = global.Promise;

var travel_benefitSchema = new Schema({
    'Insurer_Id' : Number,
    'Insurer-Name' : String,
    'Plan_Id' : Number,
    'Plan_Name' : String,
    'Travel_Insurance_Type' : String,
    'Trip_Type' : String,
    'Sum_Insured' : String,
    'Geographical' : String,
    'Geographical_Code' : String,
    'Benefits_List' : Object
});

var travel_benefit = mongoose.model('travel_benefits', travel_benefitSchema);

module.exports = travel_benefit;
