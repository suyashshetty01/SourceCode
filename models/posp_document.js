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

let posp_document_Schema = new Schema({
    "Posp_Document_Id": Number,
    "User_Id": Number,
    "Email": {type: String, default: ""},
    "Mobile_Number": {type: String, default: ""},
    "Gender" :{type: String, default: ""},
    "Name_On_PanCard": {type: String, default: ""},
    "DOB_On_PanCard": {type: String, default: ""},
    "PanCard_Number": {type: String, default: ""},
    "Father_Name": {type: String, default:""},    
    "Name_On_AadharCard": {type: String, default: ""},
    "AadharCard_Number": {type: String, default: ""},
    "Address": {type: String, default: ""},
    "UploadedFiles": {type: Object, default: {}},
    "BankDetails": {type: Object, default: {}},
    "NomineeDetails": {type: Object, default: {}},
    "Created_On": {type: Date},
    "Modified_On": {type: Date}
});
posp_document_Schema.pre('save', function (next) {
    let currentDate = new Date();
    this.Created_On = currentDate;
    this.Modified_On = currentDate;
    next();
});

posp_document_Schema.plugin(mongoosePaginate);

posp_document_Schema.plugin(autoIncrement.plugin, {model: 'posp_document', field: 'Posp_Document_Id', startAt: 1});
let posp_document = connection.model('posp_document', posp_document_Schema);
module.exports = posp_document;