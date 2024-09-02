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

let question_masterSchema = new Schema({
    "Question_Id": Number,
    "Section_Id": Number,
    "Question_Name": String,
    "Section_Name": String,
    "OptionA": String,
    "OptionB": String,
    "OptionC":String,
    "OptionD":String,
    "Shuffle_All":Number,
    "Correct_Answer":String,
    "Is_Active":{type:Boolean,default:true},
    "Created_On": {type: Date,default: new Date()},
    "Modified_On": {type: Date,default: new Date()}
});

question_masterSchema.plugin(mongoosePaginate);

question_masterSchema.plugin(autoIncrement.plugin, {model: 'question_master', field: 'Question_Id', startAt: 1});
let question_master = connection.model('question_master', question_masterSchema);
module.exports = question_master;
