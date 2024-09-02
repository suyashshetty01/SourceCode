/* Piyush
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');

var industryCategory_Schema = new Schema({
    "Category_Id": Number,
    "Category_Name": String,
    "Category_Code": Number,
    "Is_Active": Number,
    "Created_On": Date,
    "Modified_On": Date
// the schema is useless so far
// we need to create a model using it
});
industryCategory_Schema.plugin(mongoosePaginate);
industryCategory_Schema.plugin(autoIncrement.plugin, {model: 'industry_category', field: 'Category_Id', startAt: 1});
var industry_category = mongoose.model('industry_category', industryCategory_Schema);


// make this available to our users in our Node applications
module.exports = industry_category;