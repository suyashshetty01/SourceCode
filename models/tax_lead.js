
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');


var tax_lead_Schema = new Schema({
    "name": String,
    "email": String,
    "mobile": String,
    "date_of_birth": Date,
    "annual_premium": Number,
    "premium_pay_year": Number,
    "years_tax_free": Number,
    "Status": String,
    "Created_On": Date,
    "Modified_On": Date,
    "search_parameter": JSON,
    "Source": String,
    "Campgin_Id": Number,
    "utm_source": String,
    "utm_medium": String,
    "utm_campaign": String
});

// the schema is useless so far
// we need to create a model using it
tax_lead_Schema.plugin(mongoosePaginate);
tax_lead_Schema.plugin(autoIncrement.plugin, {model: 'Tax_Lead', field: 'Tax_Lead_Id', startAt: 1});
var Tax_Lead = mongoose.model('Tax_Lead', tax_lead_Schema);

// make this available to our users in our Node applications
module.exports = Tax_Lead;