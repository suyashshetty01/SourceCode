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


var aadhar_detailSchema = new Schema({    
    "Aadhar_Number":Number,
    "Data":String,
    "Created_On":Date
});

aadhar_detailSchema.plugin(mongoosePaginate);
var Aadhar_Detail = mongoose.model('Aadhar_Detail', aadhar_detailSchema);
module.exports = Aadhar_Detail;