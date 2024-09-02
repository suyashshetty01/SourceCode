/* Manish Anand
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
//autoIncrement.initialize(connection);

var marine_premiumSchema = new Schema({
    "Insurer_Id": Number,
//    "Sum_Insured": Number,
    "City_Id": Number,
    "Premium_Breakup": {},
    'Created_On': {type: Date}
},{collection: 'marine_premiums'});
marine_premiumSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
    if (!this.Marine_Premium_Id) {
        this._doc.Created_On = currentDate;
    }
    next();
});
marine_premiumSchema.plugin(mongoosePaginate);
marine_premiumSchema.plugin(autoIncrement.plugin, {model: 'Marine_Premium', field: 'Marine_Premium_Id', startAt: 1});
//var Vehicle_API_Log = mongoose.model('vehicle_api_logSchema',vehicle_api_logSchema);
var Marine_Premium = mongoose.model('Marine_Premium', marine_premiumSchema);
module.exports = Marine_Premium;