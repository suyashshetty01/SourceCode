var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');
var prospect_posp_erp_schema = new Schema({
    "Prospect_Posp_Id": Number,
    "Ss_Id": Number,
    "Fba_Id": Number,
    "Erp_Id": String,
    "Mobile_No": String,
    "Product_Id":Number,
    "Erp_Qt":String,
    "YOM" : String,
    "SubModel" : String,
    "RegistrationNo" : String,
    "RegistrationDate" : String,
    "RTO_State" :String,
    "RTO_City" : String,
    "ProductName" : String,
    "Phone" : String,
    "Model" : String,
    "ManufacturingDate" : String,
    "Make" : String,
    "InsuranceType" : String,
    "ExpiryDate" : String,
    "ClientName" : String,
    "City" : String,
    "Created_On": Date,
    "Modified_On": Date
});
prospect_posp_erp_schema.plugin(mongoosePaginate);
prospect_posp_erp_schema.plugin(autoIncrement.plugin, {model: 'prospect_posp_erps', field: 'Prospect_Posp_Id', startAt: 1});
var prospect_posp_erps = mongoose.model('prospect_posp_erps', prospect_posp_erp_schema);
module.exports = prospect_posp_erps;