/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
//autoIncrement.initialize(connection);

var cancer_care_health_rateSchema = new Schema({
    "ProductPlan_Id": Number,
    "Premium": Number
});

cancer_care_health_rateSchema.plugin(mongoosePaginate);
var Cancer_care_health_rate = connection.model('Cancer_care_health_rate', cancer_care_health_rateSchema);
module.exports = Cancer_care_health_rate;


