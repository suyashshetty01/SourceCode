/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * Author : Piyush
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var claim_intimitation_Schema = new Schema({

    "Claim_Intimation_ID": Number,
    "PolicyNumber": String,
    "Product_ID": Number,
    "Insurer_ID": Number,
    "Remarks": String,
    "ProductInsuranceMapping_Id": String,
    "Customer_Name": String,
    "Email_Id": String,
    "Contact_Mobile": String,
    "IsActive": Number,
    "LostDate": Date,
    "Other_Contact_No": String,
    "CreatedBy": String,
    "Claim_Source_Master_ID": Number,
    "Created_On": Date,
    "Modified_On": Date
});

// the schema is useless so far
// we need to create a model using it

claim_intimitation_Schema.plugin(mongoosePaginate);
claim_intimitation_Schema.plugin(autoIncrement.plugin, {model: 'claim_intimitation_Schema', field: 'Claim_Intimation_ID', startAt: 100});
var claim_intimitation = mongoose.model('claim_intimitation', claim_intimitation_Schema);

// make this available to our users in our Node applications
module.exports = claim_intimitation;


