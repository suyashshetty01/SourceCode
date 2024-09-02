var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var smartquoteSchema = new Schema({
    "Variant_ID": {type: Number},
    "Make_name": {type: String},
    "Model_name": {type: String},
    "Variant_name": {type: String},
    "Seating_Capacity": {type: Number},
    "ExShoroomPrice": {type: String},
    "Fuel_Name": {type: String},
    "Cubic_Capacity": {type: String},
    "Bharti": {type: Number},
    "Reliance": {type: Number},
    "Liberty": {type: Number},
    "Iffco": {type: Number},
    "FG": {type: Number},
    "CRN": {type: Number},
    "Cnt": {type: Number}
});
var Smartquote = mongoose.model('Smartquote', smartquoteSchema);
module.exports = Smartquote;