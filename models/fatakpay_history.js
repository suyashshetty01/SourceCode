var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var fatakpay_history_schema = new Schema({
    "Fatakpay_History_Id": Number,
    "PB_CRN": Number,
    "User_Data_Id": Number,
    "Proposal_Id": Number,
    "Insurer_Id": Number,
    "Application_Loan_Id": Number,
    "Ss_Id": Number,
    "Premium_Amount": Number,
    "Emi_Amount": Number,
    "Request_Core": Object,
    "Response_Core": Object,
    "Tenure": Number,
    "EMI_Status": String,
    "Transaction_Status" : String,
    "PAN": String,
    "RedirectURL": String,
    "Transaction_Id": Number,
    "Created_On": {
        type: Date,
        default: Date.now
    },
    "Modified_On": Date
});

fatakpay_history_schema.plugin(mongoosePaginate);
fatakpay_history_schema.plugin(autoIncrement.plugin, { model: 'fatakpay_history', field: 'Fatakpay_History_Id', startAt: 1 });
var fatakpay_history = mongoose.model('fatakpay_history', fatakpay_history_schema);

module.exports = fatakpay_history;