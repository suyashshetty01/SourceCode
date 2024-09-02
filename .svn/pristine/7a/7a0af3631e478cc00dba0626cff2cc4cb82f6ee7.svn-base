var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var document_details_Schema= new Schema({
	"Document_Id" : Number,
	"Document_Type" : String,
	"Product_Id" : Number,
	"PB_CRN" : Number,
	"Status" : String,
	"Doc1" : String,
	"Doc2" : String,
	"Created_On" : Date,
	"Modified_On" : Date
});
document_details_Schema.plugin(mongoosePaginate);
var document_details = mongoose.model('document_details',document_details_Schema);
module.exports = document_details;