/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');

var rc_ocr_Schema = new Schema({
    "Rc_Ocr_Id": Number,
    "Vehicle_No": String,
    "Doc1_Url": String,
    "Doc2_Url": String,
    "Vehicle_Class": String,
    "Make": String,
    "Model": String,
    "Status": String,
    "Request_Core": String,
    "Response_Core": String,
    "Created_On": Date,
    "Modified_On": Date
});

// the schema is useless so far
// we need to create a model using it
rc_ocr_Schema.plugin(mongoosePaginate);
rc_ocr_Schema.plugin(autoIncrement.plugin, {model: 'Rc_ocr', field: 'Rc_Ocr_Id', startAt: 1});
var rc_ocr_data = mongoose.model('Rc_ocr_detail', rc_ocr_Schema);

// make this available to our users in our Node applications
module.exports = rc_ocr_data;


