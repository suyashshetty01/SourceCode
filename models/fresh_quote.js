/*
 * Author : Revati Ghadge 
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
var fresh_quoteSchema = new Schema({
    'Fresh_Quote_Job_Id': Number,
    'Camp_Name': String,
    'Make': String,
    'Model': String,
    'Variant': String,
    'Fuel': String,
    'Cubic_Capacity': Number,
    'Rto_Code': String,
    'Registration_No': String,
    'Erp_Qt': String,
    'Manf_Year': String,
    'Vehicle_Id': Number,
    'Erp_Uid': Number,
    'Ss_Id': Number,
    'Fba_Id': Number,
    'Base_Vehicle_Id': Number,
    'Rto_Id': Number,
    'Vehicle_Age': Number,
    'Matched_Score': Number,
    'Status': String, // UPLOADED , VALIDATED , REJECTED, VERIFIED , MATCHED , NOTMATCHED , SURLCREATED
    'Remark': String,
    'Short_Code': String,
    'is_verified_quote': String,
    'quote_url': String,
    'Visited_History': [],
    'Visited_On': Date,
    'Visited_Count': Number,
	'Visited_Source' : String,
    'Row_Data': Object,
    'Url': String,
    'History': [{}],
    'Created_On': Date,
    'Modified_On': Date
});
// we need to create a model using it
fresh_quoteSchema.plugin(mongoosePaginate);


fresh_quoteSchema.plugin(autoIncrement.plugin, {model: 'Fresh_Quote', field: 'Fresh_Quote_Id', startAt: 1});
var Fresh_Quote = mongoose.model('Fresh_Quote', fresh_quoteSchema);

// make this available to our users in our Node applications
module.exports = Fresh_Quote;