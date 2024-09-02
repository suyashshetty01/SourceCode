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

let posp_doc_logSchema = new Schema({
    "Doc_Log_Id": Number,
    "User_Id": Number,
    "Mobile_Number": {type: String , default : ""},
    "Uploaded_By_Ss_Id": {type: String , default : ""},
    "Verified_On_Date":{type: Date, default : ""},
    "Approved_On_Date":{type: Date, default : ""},
    "Verifier_Ss_Id": {type: String , default : ""},
    "Approver_Ss_Id": {type: String , default : ""},
    "Verified_By_API": {type: String , default : "No"},
    "Fba_Id": {type: String , default : ""},
    "Doc_Type": {type: String , default : ""},
    "Status": {type: String , default : ""},
    "Prev_Approval_Status": {type: String , default : ""},
    "Remark":{type: String , default : ""},
    "Doc_URL":{type: String , default : ""},
    "Created_On": {type: Date, default : ""},
    "Modified_On": {type: Date, default : ""}
});


posp_doc_logSchema.plugin(mongoosePaginate);

posp_doc_logSchema.plugin(autoIncrement.plugin, {model: 'posp_doc_log', field: 'Doc_Log_Id', startAt: 1});
let posp_doc_log = connection.model('posp_doc_log', posp_doc_logSchema);
module.exports = posp_doc_log;

