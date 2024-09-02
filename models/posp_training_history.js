/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let config = require('config');
let Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
//let connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

let posp_training_history_Schema = new Schema({
    "User_Id": Number,
    "Mobile_Number":String,
    "Training_Id" : Number,
    "Section_Id" : Number,
    "Section_Name" : String,
    "Start_Date_Time" :{type: Date},
    "End_Date_Time" : {type: Date},
    "Total_Time" :String,
    "Extension_Source" : String,
    "Created_On" :{type: Date},
    "Modified_On" : {type: Date},
    "Session": String,
    "IP_Address": String
});

posp_training_history_Schema.plugin(mongoosePaginate);

let posp_training_history = mongoose.model('posp_training_history', posp_training_history_Schema);
module.exports = posp_training_history;