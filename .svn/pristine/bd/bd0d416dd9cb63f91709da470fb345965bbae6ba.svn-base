/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
let mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');

let no_dues_Schema = new Schema({
    "Employee_Name": String,
    "Employee_UID": Number,
    "Employee_Code": Number,
    "Designation": String,
    "Reporting_Manager_Name": String,
    "Form_Submitted_Date": String,
    "Location": String,
    "Department": String,
    "Head_Of_Department": String,
    "Date_Of_Joining": Date,
    "Resignation_Date": Date,
    "LWD": String,
    "Created_On": Date,
    "Modified_On": Date,
    "Created_By": String,
    "Verified_By_Supervisor": Number, 
    "Supervisor_Status": String,
    "Verified_By_IRDA": Number,
    "IRDA_Status": String,
    "Verified_By_Administration": Number,
    "Administration_Status": String,
    "Verified_By_IT": Number,
    "IT_Status": String,
    "Verified_By_Finance": Number,
    "Finance_Status": String,
    "Verified_By_Human_Resource": Number,
    "Human_Resource_Status": String,
    "Status": String
});

no_dues_Schema.plugin(mongoosePaginate);
no_dues_Schema.plugin(autoIncrement.plugin, {model: 'no_dues_data', field: 'No_Dues_ID', startAt: 1});
let No_Dues_Data = mongoose.model('No_Dues_Data', no_dues_Schema);

module.exports = No_Dues_Data;




