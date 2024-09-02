var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var posp_pre_series_Schema = new Schema({
    "Erp_Id": Number,
    "Ss_Id": { type: Number, default: '' },
    "Fba_Id": { type: Number, default: '' },
    "Name": { type: String, default: '' },
    "Email": { type: String, default: '' },
    "Mobile": Number,
    "Remark": { type: String, default: '' },
    "Is_Activated": { type: String, default: 'No' },
    "Is_Onboarded": { type: String, default: 'No' },
    "Is_Sale": { type: String, default: 'No' },
    "Status": { type: String, default: '' },
    "Activated_By_SSID": Number,
    "Activated_By_UID" : Number,
    "Product_Id":Number,
    "Activated_On": Date,
    "Onboarded_On": Date,
    "Modified_On": Date,
    "Created_On": { type: Date, default: new Date() },
    "Type_Of_Store": { type: String, default: '' },
    "Store_Name" : { type: String, default: '' },
    "QR_URL": { type: String, default: '' },
    "Profile_URL": { type: String, default: '' },
    "Is_QR_Uploaded": { type: String, default: '' },
    "Is_Profile_Uploaded": { type: String, default: '' },
    "Geo_Longitude" : { type: String, default: '' },
    "Geo_Latitude" : { type: String, default: '' }    
});

posp_pre_series_Schema.plugin(mongoosePaginate);
posp_pre_series_Schema.plugin(autoIncrement.plugin, { model: 'Posp_Pre_Series', field: 'Posp_Pre_Series_Id', startAt: 1 });
var Posp_Pre_Series = mongoose.model('Posp_Pre_Series', posp_pre_series_Schema);

// make this available to our users in our Node applications
module.exports = Posp_Pre_Series;