/* Author: Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');

var lazy_pay_policySchema = new Schema({
    "PB_CRN": Number,
    "UDID": Number,
    "Insurer_Id": Number,
    "Policy_No": String,
    "lazy_Pay_Insurer_Request": Object,
    "lazy_Pay_Insurer_Response": Object,
    "Created_on": Date
});

lazy_pay_policySchema.plugin(mongoosePaginate);
lazy_pay_policySchema.plugin(autoIncrement.plugin, {model: 'lazy_pay_policy', field: 'LazyPay_Id', startAt: 1});
var lazy_pay_policy = mongoose.model('lazy_pay_policys', lazy_pay_policySchema);
module.exports = lazy_pay_policy;