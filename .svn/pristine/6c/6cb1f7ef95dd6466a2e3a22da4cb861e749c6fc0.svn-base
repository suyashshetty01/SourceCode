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

var emp_data_Schema = new Schema({
    "Employee_Code": String,
    "Name": String,
    "Branch": String,
    "Effective_Date":Date,
    "Designation":String,
    "Letter_to_be_Issued":String,
    "Basic": Number,
    "HRA": Number,
    "Other_Allow": Number,
    "Leave_Travel_Allowance": Number,
    "Gratuity": Number,
    "Advance_Statutory_Bonus": Number,
    "Fuel_Reimbursement": Number,
    "Drivers_Salary_Reimbursement": Number,
    "Mobile_Reimbursement": Number,
    "Prof_Development": Number,
    "Meal_Allowance": Number,
    "Performance_Reward": Number,
    "Business_Expense_Reimbursement": Number,
    "Lease_Car_Expense": Number,
    "Gross_Salary": Number,
    "Employer_PF": Number,
    "Employer_ESIC": Number,
    "Performance_Variable": Number,
    "CTC": Number,
    "Letter": String
});
// the schema is useless so far
// we need to create a model using it
emp_data_Schema.plugin(mongoosePaginate);
var emp_data = mongoose.model('emp_data', emp_data_Schema);

// make this available to our users in our Node applications
module.exports = emp_data;

