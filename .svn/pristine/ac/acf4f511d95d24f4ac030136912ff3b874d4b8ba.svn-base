/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');


var quote_leadSchema = new Schema({
    "Name": String,
    "Mobile": Number,
    "Email": String,
    "Registration_Number": String,
    "Rto": String,
    "Request_Log_Id": String,
    "Created_On": Date
});

quote_leadSchema.plugin(mongoosePaginate);
var Quote_Lead = mongoose.model('Quote_Lead', quote_leadSchema);
module.exports = Quote_Lead;