/*
 * Author : Khushbu Gite 19-03-2020
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 *
 * 
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var insurer_posp_Schema = new Schema({
"Insurer_Posp_Id" : Number,
    "PAN" : String,
    "ss_id" : Number,
    "Insurer_5" : String,
    "Insurer_7" : String,
    "Insurer_11" : String,
    "IsActive" : Boolean	
});
insurer_posp_Schema.plugin(mongoosePaginate);
var Insurer_Posp = mongoose.model('Insurer_Posp', insurer_posp_Schema);
// make this available to our users in our Node applications
module.exports = Insurer_Posp;