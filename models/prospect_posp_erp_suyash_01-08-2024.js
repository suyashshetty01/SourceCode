var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');
var prospect_posp_erp_schema = new Schema({
    "Prospect_Posp_ID": Number,
    "Ss_Id": Number,
    "Fba_Id": Number,
    "Erp_Id": String,
    "Mobile_No": String,
    "Erp_Qt":String,
    "Request": String,
    "Response": Object,
    "Created_On": Date,
    "Modified_On": Date
});
prospect_posp_erp_schema.plugin(mongoosePaginate);
prospect_posp_erp_schema.plugin(autoIncrement.plugin, {model: 'prospect_posp_erps', field: 'Prospect_Posp_ID', startAt: 1});
var prospect_posp_erps = mongoose.model('prospect_posp_erps', prospect_posp_erp_schema);
module.exports = prospect_posp_erps;