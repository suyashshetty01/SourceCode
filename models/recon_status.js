/* 
 * Author : Khushbu Gite 20/03/2020
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');


var status_Schema = new Schema({ 
    "Recon_Reference_Number":String,
    "udid":Number,
    "Transaction_status" : String,
    "Product_Id" :Number,
    "Insurer_Id" :Number,
    "Request"  : Object,
    "Response"  : Object,
    "PG_data" : Object,
    "Created_On":Date,
    "Modified_On":Date
});

// the schema is useless so far
// we need to create a model using it
status_Schema.plugin(mongoosePaginate);

var status_Schema = mongoose.model('Recon_Status', status_Schema);

// make this available to our users in our Node applications
module.exports = status_Schema;
