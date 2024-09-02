
/*
 * Author : Khushbu Gite 
 * Date: 03-06-2019 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var lead_Schema = new Schema({
    "PB_CRN": Number,
    "User_Data_Id": Number,
    "ss_id": Number,
    "fba_id": Number,
    "channel": String,
    "Created_On": {type: Date},
    "Modified_On": {type: Date},
    "Product_Id": Number,
    "previous_policy_number": String,
    "prev_policy_start_date": String,
    "policy_expiry_date": String,
    "engine_number": String,
    "chassis_number": String,
    "company_name": String,
    "Customer_Name": String,
    "Customer_Address": String,
    "mobile": Number,
    "mobile2": Number,
    "vehicle_insurance_type": String,
    "issued_by_username": String,
    "registration_no": String,
    "nil_dept": String,
    "rti": String,
    "Make_Name": String,
    "Model_ID": Number,
    "Model_Name": String,
    "Variant_Name": String,
    "Vehicle_ID": Number,
    "Fuel_ID": Number,
    "Fuel_Name": String,
    "RTO_City": String,
    "RTO_State": String,
    "VehicleCity_Id": Number,
    "VehicleCity_RTOCode": String,
    "vehicle_registration_date": String,
    "vehicle_manf_date": String,
    "prev_insurer_id": Number,
    "vehicle_ncb_current": Number,
    "is_claim_exists": String,
    "is_renewal_proceed": String,
    "lead_type": String,
    "lead_status": String,
    "renewal_data": Object,
    'agent_details': Object,
    'lead_assigned_uid': Number,
    'lead_assigned_name': String,
	'lead_assigned_ssid': Number,
    'lead_assigned_on': {type: Date},
    'camp_type': String,
    'camp_name': String,
    'quote_url': String,
    'Visited_History': [],
    'Visited_On': Date,
    'Visited_Count': Number,
    "lead_disposition" :String,
    "lead_subdisposition":String,
    "lead_disposition_assigned_on": {type: Date}
});
// the schema is useless so far
// we need to create a model using it
lead_Schema.plugin(mongoosePaginate);
lead_Schema.plugin(autoIncrement.plugin, {model: 'leads', field: 'Lead_Id', startAt: 450});
var leads = mongoose.model('leads', lead_Schema);

// make this available to our users in our Node applications
module.exports = leads;

