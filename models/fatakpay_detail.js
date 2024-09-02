var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var fatakpay_details_schema = new Schema({
    "Fatakpay_Detail_Id": Number,
    "PB_CRN": Number,
    "User_Data_Id": Number,
    "Proposal_Id": Number,
    "Ss_Id": Number,
    "Insurer_Id": Number,
    "Application_Loan_Id": Number,
    "Premium_Amount": Number,
    "Emi_Amount": Number,
    "Tenure": Number,
    "PAN": String,
    "Payment_Link": String,
    "Installment": String,
    "Installment_On": Date,
    "Installment_Amt": Number,
    "EMI_Status": String,
    "Transaction_Status": String,
    "Proposal_Confirm_Url": String,
    "Proposal_Url": String,
    "RedirectURL": String,
    "Pay_Id": String,
    "Transaction_Id": Number,
    "Installment_Details": Object,
    "Created_On": {
        type: Date,
        default: Date.now
    },
    "Modified_On": {
        type: Date,
        default: Date.now
    }
});

fatakpay_details_schema.plugin(mongoosePaginate);
fatakpay_details_schema.plugin(autoIncrement.plugin, { model: 'fatakpay_details', field: 'Fatakpay_Detail_Id', startAt: 1 });
var fatakpay_details = mongoose.model('fatakpay_details', fatakpay_details_schema);

module.exports = fatakpay_details;