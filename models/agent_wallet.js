/* Author: Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var agent_walletSchema = new Schema({
    "SS_ID": Number,
    "FBA_ID": Number,
    "EMP_ID": Number,
    "Channel": String,
    "agent_name": String,
    "agent_mobile": String,
    "agent_email": String,
    "Merchant_Id": String,
    "creation_request": Object,
    "creation_response": Object,
    "ifsc": String,
    "bank_account_no": String,
    "virtual_account_id": String,
    "virtual_acnt_request": Object,
    "virtual_acnt_response": Object,
    "wallet_amount": Number,
    "daily_limit" : Number,
    "wallet_otp_number": String,
    "Creator_SSID": Number,
    "Created_On": Date,
    "Modified_On": Date,
    "Last_Deposit_Date": Date,
    "Last_Transact_Date": Date,
    "IsActive": Number
});
// we need to create a model using it
agent_walletSchema.plugin(mongoosePaginate);


//agent_walletSchema.plugin(autoIncrement.plugin, {model: "Agent_Wallet", field: "Transaction_Id", startAt: 1});
var Agent_Wallet = mongoose.model("Agent_Wallet", agent_walletSchema);

// make this available to our users in our Node applications
module.exports = Agent_Wallet;