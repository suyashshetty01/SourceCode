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

let online_endorsement_schema = new Schema({
    "Endorsement_Id": Number,
    "Ticket_Id": String,
    "CRN": Number,
    "Insurer_Id": {type: Number},
    "Product_Id": {type: Number},
    "Category": {type: String, default: ""},
    "Sub_Category": {type: String, default: ""},
    "Status": {type: String, default: "Pending"},
    "Insurer_Request": {type: Object},
    "Insurer_Response": {type: Object},
    "Created_On": {type: Date, default: ""},
    "Modified_On": {type: Date, default: ""}
});


online_endorsement_schema.plugin(mongoosePaginate);

online_endorsement_schema.plugin(autoIncrement.plugin, {model: 'online_endorsement', field: 'Endorsement_Id', startAt: 1});
let online_endorsement = connection.model('online_endorsement', online_endorsement_schema);
module.exports = online_endorsement;