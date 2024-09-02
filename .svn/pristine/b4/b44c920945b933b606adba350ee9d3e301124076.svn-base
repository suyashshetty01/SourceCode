/* Author: Roshni Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

var health_benefit_insurerSchema = new Schema({
    "Insurer_Id": Number,
    "Plan_Id": Number,
    "Plan_Name": String,
    "SI": String,
    'Benefit_Key': String,
    "Benefit_Value": String,
    "Score": Number
});

health_benefit_insurerSchema.plugin(mongoosePaginate);
var health_benefit_insurer = connection.model('health_benefits_insurers', health_benefit_insurerSchema);
module.exports = health_benefit_insurer;
