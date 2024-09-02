/* 
 * MG08-02-2022
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
var student_demoSchema = new Schema({
    'Name': String,
    'Age': Number,
    'Mobile': Number,
    'Email': String,
    'Address': String,
    'Photo': Buffer
});
student_demoSchema.pre('save', function (next) {
    // get the current date
    next();
});
var student_demo = connection.model('student_Demo', student_demoSchema);

module.exports = student_demo;
