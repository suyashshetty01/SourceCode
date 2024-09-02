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

var industrySubCategory_Schema = new Schema({
    "SubCategory_Id": Number,
    "SubCategory_Name": String,
    "SubCategory_Code": Number,
    "Category_Code": Number,
    "Is_Active": Number,
    "Created_On": Date,
    "Modified_On": Date
// the schema is useless so far
// we need to create a model using it
});
industrySubCategory_Schema.plugin(mongoosePaginate);
industrySubCategory_Schema.plugin(autoIncrement.plugin, {model: 'industry_subcategory', field: 'SubCategory_Id', startAt: 1});
var industry_subcategory = mongoose.model('industry_subcategory', industrySubCategory_Schema);


// make this available to our users in our Node applications
module.exports = industry_subcategory;