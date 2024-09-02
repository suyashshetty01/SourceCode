/*
 * Author : Chirag Modi 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var fieldSchema = new Schema({
    "Field_Name": String,
    "Insurer_ID": String,
    "Product_Id": String,
    "Field_Type": String,
    "Field_Value": String,
    "Field_Group": String,
    "Field_Category": String,
    "Field_Parent": String,
    "Field_Id": Number
});
var Field = mongoose.model('Field', fieldSchema);
// make this available to our users in our Node applications
module.exports = Field;