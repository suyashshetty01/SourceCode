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

var health_premiumSchema = new Schema({
    "Insurer_Id": Number,
    "Sum_Insured": Number,
    "City_Id": Number,
    "Eldest_Member_Age": Number,
    "Eldest_Member_Age_Slab": Number,
    "Premium_Breakup": {},
    'Created_On': {type: Date}
},{collection: 'health_premiums'});
health_premiumSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
    if (!this.Health_Premium_Id) {
        this._doc.Created_On = currentDate;
    }
    next();
});
health_premiumSchema.plugin(mongoosePaginate);
health_premiumSchema.plugin(autoIncrement.plugin, {model: 'Health_Premium', field: 'Health_Premium_Id', startAt: 1});
//var Vehicle_API_Log = mongoose.model('vehicle_api_logSchema',vehicle_api_logSchema);
var Health_Premium = mongoose.model('Health_Premium', health_premiumSchema);
module.exports = Health_Premium;