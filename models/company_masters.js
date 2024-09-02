/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


let mongoose = require('mongoose');
let autoIncrement = require('mongoose-plugin-autoinc');
let Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

let company_master_Schema = new Schema({
    Company_Name: String,
    Agent_Name: {type: String, default: ""},
    Created_On: Date,
    Modified_On: Date,
    Ss_Id: {type: Number, default: 0},
    Erp_Id: {type: Number, default: 0},
    City: {type: String, default: ""},
    RM: {type: String, default: ""},
    RM_UID: {type: Number, default: 0},
    RM_Branch: {type: String, default: ""},
    Sub_Vertical: {type: String, default: ""},
    User_Type : {type: String, default: ""}
});

company_master_Schema.plugin(mongoosePaginate);
company_master_Schema.plugin(autoIncrement.plugin, {
    model: 'company_master',
    field: 'Company_Master_Id',
    startAt: 1
});

let Company_Master = mongoose.model('company_master', company_master_Schema);

module.exports = Company_Master;