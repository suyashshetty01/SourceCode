/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var travel_benefitSchema = new Schema({
    'Insurer_Id': Number,
    'Insurer_Name': String,
    'Trip_Type': String,
    "Sum_Insured": String,
    "Plan_Id": Number,
    "Plan_Name": String,
    "Travel_Insurance_Type": String,
    "Geographical": String,
    "Geographical_Code": String,
    "Benefit_List":Object
});

travel_benefitSchema.plugin(mongoosePaginate);
var travel_benefits = mongoose.model('travel_benefits', travel_benefitSchema);


module.exports = travel_benefits;