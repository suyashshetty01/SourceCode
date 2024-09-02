/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let mongoose = require('mongoose');
let config = require('config');
let Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
let mongoosePaginate = require('mongoose-paginate');
let connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

let posp_temp_answerSchema = new Schema({
    'User_Id': Number,
    'Question_Id': Number,
    'Section_Id':Number,
    'Selected_Ans': {type: String,default:""},
    'Correct_Ans': {type: String,default:""},
    'result': Number,
    'Created_On': {type: Date},
    'Modified_On': {type: Date}
});

posp_temp_answerSchema.plugin(mongoosePaginate);

let posp_temp_answer = connection.model('posp_temp_answer', posp_temp_answerSchema);
module.exports = posp_temp_answer;


