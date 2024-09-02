
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');


var posp_enquiry_filed_visitors_Schema = new Schema({
    "Name":{type: String, default: ""},
    "Email": {type: String, default: ""},
    "Mobile_No": {type: Number},
    "Address": {type: String, default: ""},
    "Client_Doc_Type": {type: String, default: ""},
    "Client_Doc_URL": {type: String, default: ""},
    "Visitor_Doc_Type": {type: String, default: ""},
    "Visitor_Doc_URL": {type: String, default: ""},
    "Client_Profile_Photo_URL": {type: String, default: ""},
    "Visitor_Profile_Photo_URL": {type: String, default: ""},
    "Status": {type: String, default: "Pending"},
    "Created_by": {type: Number},
    "Created_On": {type: Date},
    "Modified_On": {type: Date}
});

// the schema is useless so far
// we need to create a model using it
posp_enquiry_filed_visitors_Schema.plugin(mongoosePaginate);
posp_enquiry_filed_visitors_Schema.plugin(autoIncrement.plugin, {model: 'posp_enquiry_field_visitor', field: 'Posp_Enquiry_Field_Visitor_ID', startAt: 1});
var posp_enquiry_field_visitors = mongoose.model('posp_enquiry_field_visitors', posp_enquiry_filed_visitors_Schema);

// make this available to our users in our Node applications
module.exports = posp_enquiry_field_visitors;