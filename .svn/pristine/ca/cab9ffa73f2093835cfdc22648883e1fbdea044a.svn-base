/*
 * Author : Somanshu Singh 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 *
 * 
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);


var standalone_paymentSchema = new Schema({
    'standalone_payment_id': Number,
    'vehicle_reg_no': String,
    'QData':Object,
	'channel_type': String,
    'cc': Number,
    'premium_amount': Number,
    'name': String,
    'mobile': Number,
    'insurer_id': Number,
    'email': String,
    'address': String,
    'status': String,
    'Horizon_Status': String,
    'verification_request': Object,
    'fastlane_data': Object,
    'premium_request': Object,
    'premium_initiate': Object,
    'proposal_initiate': Object,
    'verification_initiate': Object,
    'pg_data':Object,
    'pg_get': Object,
    'pg_post': Object,
    'insurer_id': Number,
    'product_id': Number,
    'Created_On': {type: Date},
    'Modefied_On': {type: Date},
    'vehicle_details': Object
});
standalone_paymentSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
    if (!this.Short_Url_Id) {
        this.Created_On = currentDate;
    }
    next();
});
// the schema is useless so far
// we need to create a model using it
standalone_paymentSchema.plugin(mongoosePaginate);
standalone_paymentSchema.plugin(autoIncrement.plugin, {model: 'Standalone_Payment', field: 'standalone_payment_id', startAt: 1});
var Standalone_Payment = mongoose.model('Standalone_Payment', standalone_paymentSchema);

// make this available to our users in our Node applications
module.exports = Standalone_Payment;