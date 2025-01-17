/* Author : Muskan
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var kyc_Webhook_History_Schema = new Schema({
    "Created_On": String,
    "Ip_Address": String,
    "Full_Url": String,
    "Request_Get": Object,
    "Request_Post": Object,
    "Insurer_Id": Number,
    "PB_CRN": Number,
    "Modified_On": Date
});
kyc_Webhook_History_Schema.plugin(mongoosePaginate);
var kyc_webhook_history = mongoose.model('kyc_webhook_history', kyc_Webhook_History_Schema);
module.exports = kyc_webhook_history;

