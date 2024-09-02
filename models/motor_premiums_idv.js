/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var motor_premiums_idvSchema = new Schema({
    "Motor_Premiums_Idv_Id": Number,
    "PB_CRN": Number,
    "User_Data_Id": Number,
    "Request_Unique_Id": String,
    "Insurer_Id": Number,
    "Vehicle_Id": Number,
    "Rto_Id": Number,
    "Vehicle_Age_Month": Number,
    "Vehicle_Age_Slab": Number,
    "Idv_Normal": Number,
    "Idv_Min": Number,
    "Idv_Max": Number,
    "Exshowroom": Number,
    "Premium_Breakup": Object,
    "Premium_Rate": Object,
    "Addon": Object,
    "Coverage": Object,
    'Idv_By_CRN': String,
    "Created_On": Date
});

motor_premiums_idvSchema.pre('save', function (next) {
});
// the schema is useless so far
// we need to create a model using it
motor_premiums_idvSchema.plugin(mongoosePaginate);
var Motor_Premiums_Idv = mongoose.model('Motor_Premiums_Idv', motor_premiums_idvSchema);
module.exports = Motor_Premiums_Idv;