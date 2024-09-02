/* Piyush Singh | 06th June 2024
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global global */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
let mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = global.Promise;

let posp_product_enquiry_Schema = new Schema({
    "Ss_Id": Number,
    "Name": String,
    "Mobile": String,
    "Email": String,
    "City_Name": String,
    "State": String,
    "Pan": String,
    "Is_Product_Enquired": {type: String, enum: ['Yes', 'No']},
    "Is_Active": {type: Number, enum: [1, 0]},
    "Source": String,
    "Lead_Assigned_Uid": Number,
    "Lead_Assigned_SsId": Number,
    "Lead_Assigned_Name": String,
    "Last_Assigned_On": Date,
    "Disposition_Status": String,
    "Sub_Status": String,
    "Next_Call_Date": Date,
    "Disposition_On": Date,
    "Created_On": Date,
    "Modified_On": Date
});

// we need to create a model using it
posp_product_enquiry_Schema.plugin(mongoosePaginate);
posp_product_enquiry_Schema.plugin(autoIncrement.plugin, {model: 'Posp_Product_Enquiry', field: 'Posp_Product_Enq_Id', startAt: 1});
let Posp_Product_Enquiry = mongoose.model('Posp_Product_Enquiry', posp_product_enquiry_Schema);

module.exports = Posp_Product_Enquiry;