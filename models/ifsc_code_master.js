/* Author : Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var ifsc_code_masterSchema = new Schema({
    'IFSC_Code': String,
    'MICR_Code': String,
    'Bank_Name': String,
    'Branch': String,
    'City': String,
    'Center': String,
    'Bank_Address': String,
    'Created_On': Date,
    'Request_Core': Object,
    'Response_Core': Object
});
// we need to create a model using it
ifsc_code_masterSchema.plugin(mongoosePaginate);


ifsc_code_masterSchema.plugin(autoIncrement.plugin, {model: 'ifsc_code_master', field: 'IFSC_Code_Master_Id', startAt: 1});
var ifsc_code_master = mongoose.model('ifsc_code_master', ifsc_code_masterSchema);

// make this available to our users in our Node applications
module.exports = ifsc_code_master;