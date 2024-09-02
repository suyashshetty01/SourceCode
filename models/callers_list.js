/* Dhananjay
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');
let config = require('config');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');
let connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

var callers_list_Schema = new Schema({
    'Caller_Id': Number,
    'Ss_Id': Number,
    'UID': Number,
    'Name': String,
    'Added_By_Name':String,
    'Added_By_UID':Number,
    'Last_Modified_By': {type:String,default :""},
    'Created_On': {type: Date},
    'Modified_On': {type: Date}
// the schema is useless so far
// we need to create a model using it
});
callers_list_Schema.plugin(mongoosePaginate);
callers_list_Schema.plugin(autoIncrement.plugin, {model: 'callers_list' ,field: 'Caller_Id', startAt: 1});
var callers_list = connection.model('callers_list', callers_list_Schema);


// make this available to our users in our Node applications
module.exports = callers_list;