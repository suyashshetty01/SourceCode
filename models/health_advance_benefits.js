/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var health_advance_benefitSchema = new Schema({
    "Plan_ID" : Number,
    "Insurer_Id" : Number,
    "Insurer" : String,
    "Existing_Plan_Name" : String,
    "Plan_Name" : String,
    "Insurance_Cover" : String,
    "Restoration_Benefit" : String,
    "CoPay_Age_Limit" : Number,
    "Below_CoPayAge_Limit" : String,
    "After_CoPayAge_Limit" : String,
    "Free_Health_Checkup" : String,
    "Room_Rent_Filter" : String,
    "Room_Rent_Display" : String,
    "Room_Rent" : String,
    "ICU_Rent" : String,
    "Medical_Screening" : String,
    "NCB_Code" : Number,
    "NCB_Display" : String,
    "No_Claim_Bonus" : String,
    "Pre-Hospitalization_Expenses" : String,
    "Post_Hospitalization_Expenses" : String,
    "Pre-Existing_Diseases" : String,
    "Emergency_Ambulance" : String,
    "New_Born_Baby_Cover" : String,
    "Day_Care_Procedures" : String,
    "Initial_Waiting_Period" : String,
    "Specific_Waiting_Period" : String,
    "Free_Look_Period" : String,
    "Cashless_Hospital" : String,
    "Pregnancy_" : Object,
    "Worldwide_Coverage" : String
});

health_advance_benefitSchema.plugin(mongoosePaginate);
var health_advance_benefit = mongoose.model('health_advance_benefits', health_advance_benefitSchema);

// make this available to our users in our Node applications
module.exports = health_advance_benefit;


