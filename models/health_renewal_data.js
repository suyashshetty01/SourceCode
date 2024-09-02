/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');


var health_renewal_dataSchema = new Schema({    
    "Insurer_Id" : Number,
    "Product_Id" : Number,
    "Insurer_Request" : Object,
    "Insurer_Response" : Object,
    "Policy_No" : String,
    "Mobile_No" : Number,
    "Customer_Name" :String,
    "Created_On" : Date,
    "Modified_On" : Date,
    "Status" : String
});
health_renewal_dataSchema.plugin(mongoosePaginate);
health_renewal_dataSchema.plugin(autoIncrement.plugin, {model: 'health_renewal_data', field: 'Quote_Id', startAt: 1001});

var health_renewal_data = mongoose.model('Health_Renewal_Data', health_renewal_dataSchema);
module.exports = health_renewal_data;