/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let config = require('config');
let Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
let connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

let posp_api_logSchema = new Schema({
    "Api_Log_Id": Number,
    "User_Id": Number, 
    "Api_Url":String,
    "Doc_Type": String,
    "Name_On_PAN": String,
    "Linked_Aadhaar": String,
    "DOB": String,
    "Masked_Aadhaar": String,
	"Pan_Number" : String,
    "Api_Request": {type: Object, default: {}},
    "Api_Response": {type: Object, default: {}},
    "Status": String,  
    "Created_On": {type: Date}
   
});
posp_api_logSchema.pre('save', function (next) {
    let currentDate = new Date();
    this.Created_On = currentDate;
    this.Modified_On = currentDate;
    next();
});

posp_api_logSchema.plugin(mongoosePaginate);

posp_api_logSchema.plugin(autoIncrement.plugin, {model: 'posp_api_log', field: 'Api_Log_Id', startAt: 1});
let posp_api_log = connection.model('posp_api_log', posp_api_logSchema);
module.exports = posp_api_log;


