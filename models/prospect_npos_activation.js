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

let prospect_npos_activationSchema = new Schema({
    "Ss_Id": Number,
    "Erp_Id": {type: String, default: ""},
    "Is_Loyalty_Activated": {type: String, default: "No"},
    "Is_PA": {type: String, default: "No"},
    "Is_RSA": {type: String, default: "No"},
    "Is_Rodent": {type: String, default: "No"},
    "Is_Tyre": {type: String, default: "No"},
    "Is_Practo": {type: String, default: "No"},
    "Is_Other": {type: String, default: "No"},
    "Lead_Assigned_To": {type: String, default: ""},
    "Motor_Policy_Details": {type: Object, default: {}},
    "Health_Policy_Details": {type: Object, default: {}},
    "Other_Policy_Details": {type: Object, default: {}},
    "Created_On": {type: Date, default: ""},
    "Modified_On": {type: Date, default: ""}
});


prospect_npos_activationSchema.plugin(mongoosePaginate);

prospect_npos_activationSchema.plugin(autoIncrement.plugin, {model: 'prospect_npos_activation', field: 'Prospect_Npos_Activation_Id', startAt: 1});
let prospect_npos_activation = connection.model('prospect_npos_activation', prospect_npos_activationSchema);
module.exports = prospect_npos_activation;

