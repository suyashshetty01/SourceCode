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

let training_section_masterSchema = new Schema({
    "Section_Id": Number,
    "Training_Id": Number,
    "Section_Name": String,
    "Number_Of_Questions":String,
    "Is_Active":{type:Boolean,default:true},
    "Created_On": {type: Date},
    "Modified_On": {type: Date}
});

training_section_masterSchema.plugin(mongoosePaginate);

training_section_masterSchema.plugin(autoIncrement.plugin, {model: 'training_section_master', field: 'Section_Id', startAt: 1});
let training_section_master = connection.model('training_section_master', training_section_masterSchema);
module.exports = training_section_master;


