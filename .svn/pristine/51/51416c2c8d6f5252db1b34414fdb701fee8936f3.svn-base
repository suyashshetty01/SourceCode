/* Chirag Modi
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

var scma = {
    'Posp_Id': Number,
    'Sms_Id': Number,
    'Name': String,
    'Mobile': String,
    'Email': String,
    'City': String,
    'Pincode': String,
    'Pan': String,
    'Status': {type: String, enum: ['Lead', 'Verified', 'Certified'], default: 'Lead'},
    'Source': {type: String, enum: ['Internal', 'External'], default: 'Internal'},
    'Is_Active': {type: Boolean, default: true},
    'Created_On': {type: Date},
    'Modified_On': {type: Date}
};
var pospSchema = new Schema();
pospSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
    if (!this.Posp_Id) {
        this.Created_On = currentDate;
    }
    this.Modified_On = currentDate;
    next();
});
pospSchema.plugin(mongoosePaginate);

pospSchema.plugin(autoIncrement.plugin, {model: 'Posp', field: 'Posp_Id', startAt: 1});
var Posp = connection.model('Posp', pospSchema);
module.exports = Posp;