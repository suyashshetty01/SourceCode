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

//var vehicle_api_logSchema = new Schema({
//    'FastLane_Request' : String,
//    'FastLane_Response' :String,
//    'CreatedOn' : Date,
//    'IsActive' : Number
//})
var vehicle_detailsSchema = new Schema({
    'Variant_Id': Number,
    'Model_ID': Number,
    'Fuel_ID': Number,
    'Make_Name': String,
    'Model_Name': String,
    'Fuel_Type': String,
    'Variant_Name':String,
    'Seating_Capacity': Number,
    'Cubic_Capacity': String,
    'Manufacture_Year': Number,
    'Color': String,
    'Registration_Number': String,
    'Chassis_Number': String,
    'Engin_Number': String,
    'Registration_Date': String,
    'Purchase_Date': String,
    'VehicleCity_Id': Number,
    'RTO_Code': Number,
    'RTO_Name': String ,
    'FastlaneResponse': String,
    'Error_Message':String,
    'CreatedOn' : {type: Date}
});

vehicle_detailsSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
    if (!this.Vehicle_Detail_Id) {
        this._doc.Created_On = currentDate;
    }
    next();
});

vehicle_detailsSchema.plugin(mongoosePaginate);
vehicle_detailsSchema.plugin(autoIncrement.plugin, {model: 'Vehicle_Detail', field: 'Vehicle_Detail_Id', startAt: 1});
//var Vehicle_API_Log = mongoose.model('vehicle_api_logSchema',vehicle_api_logSchema);
var Vehicle_Detail = mongoose.model('Vehicle_Detail', vehicle_detailsSchema);
module.exports = Vehicle_Detail;
//module.exports = Vehicle_API_Log;
 