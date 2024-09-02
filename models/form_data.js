/* Ravi
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');
var config = require('config');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

var form_dataSchema = new Schema({
    'Vehicle_Name':String,
    'Rto_Name':String,
    'date':String,
    'Full_Name':String,
    'Mobile':String,
    'Email':String,
    'Plan':String
});

var exportForm =  connection.model('Form_Data',form_dataSchema);
module.exports = exportForm;
