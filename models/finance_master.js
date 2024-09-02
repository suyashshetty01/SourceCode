/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var obj_schema = {
    "Financier_Id":  Number,
    "Financier_Name": String,
    "Financier_Code":  String,
    "Insurer_ID" : Number,
    "Isactive": Boolean,
    "Created_On" : Date
};

var financeSchema = new Schema(obj_schema);
// the schema is useless so far
// we need to create a model using it
financeSchema.plugin(mongoosePaginate);
var Finance_master = mongoose.model('finance_master', financeSchema);

// make this available to our users in our Node applications
module.exports = Finance_master;