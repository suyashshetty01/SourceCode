/* Author: Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var health_benefitSchema = new Schema({
    'DC_Plan_Name': String,
    'Insurer_Name': String,
    'Benefit_Key': String,
    "Benefit_Value": String,
    "Plan_Code": String,
    "Plan_Name": String,
    "Insurer_Id": String,
    "Cover_Type": String
});

// the schema is useless so far
// we need to create a model using it
health_benefitSchema.plugin(mongoosePaginate);
var health_benefit = mongoose.model('health_benefits', health_benefitSchema);

// make this available to our users in our Node applications
module.exports = health_benefit;