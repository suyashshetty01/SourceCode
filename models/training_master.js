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

let training_masterSchema = new Schema({
    "Training_Id": Number,
    "Training_Type": String,
    "Training_Timing": String,
    "Section": Object,
    "Total_Number_Of_Questions": String,
    "Passing_marks": String,
    "Status":String,
    "Is_Active":{type:Boolean,default:true},
    "Created_On": {type: Date},
    "Modified_On": {type: Date}
});

training_masterSchema.plugin(mongoosePaginate);

training_masterSchema.plugin(autoIncrement.plugin, {model: 'training_master', field: 'Training_Id', startAt: 1});
let training_master = connection.model('training_master', training_masterSchema);
module.exports = training_master;
