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


var vehicles_insurerSchema = new Schema({    
    "Insurer_Vehicles_ID" : Number,
    "Insurer_ID" : Number,
    "Insurer_Vehicles_Code" : String,
    "Insurer_Vehicles_Make_Name" : String,
    "Insurer_Vehicles_Make_Code" : String,
    "Insurer_Vehicles_Model_Name" : String,
    "Insurer_Vehicles_Model_Code" : String,
    "Insurer_Vehicles_Variant_Name" : String,
    "Insurer_Vehicles_Variant_Code" : String,
    "Insurer_Vehicles_FuelType" : String,
    "Insurer_Vehicles_CubicCapacity" : Number,
    "Insurer_Vehicles_SeatingCapacity" : Number,
    "Insurer_Vehicles_ExShowRoom" : Number,
    "Insurer_Vehicles_Insurer_Segmant" : String,
    "Insurer_Vehicles_Insurer_BodyType" : String,
    "Is_Active" : Number,
    "Created_On" : String,
    "Product_Id_New" : Number,
    "PB_Make_Name" : String,
	"PRODUCT" : String,
	"CAPACITY_TYPE" : String,
	"MASTER CODE (IDV CODE)": String
});

// the schema is useless so far
// we need to create a model using it
vehicles_insurerSchema.plugin(mongoosePaginate);
//vehicles_insurerSchema.plugin(autoIncrement.plugin, {model: 'Client', field: 'Client_Id', startAt: 1});
var Vehicles_Insurer = mongoose.model('Vehicles_Insurer', vehicles_insurerSchema);
// make this available to our users in our Node applications
module.exports = Vehicles_Insurer;