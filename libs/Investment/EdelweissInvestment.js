/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Motor = require(appRoot + '/libs/Investment');
var fs = require('fs');
var config = require('config');
var moment = require('moment');
var excel = require('excel4node');
function EdelweissInvestment() {

}
util.inherits(EdelweissInvestment, Motor);
EdelweissInvestment.prototype.insurer_date_format = 'DD-MM-YYYY';
EdelweissInvestment.prototype.insurer_product_field_process_pre = function () {
    console.log(this.constructor.name + '::' + 'product_api_pre' + '::Start');
    var objLMRequest = this.lm_request;

    this.prepared_request['gender'] = this.lm_request['gender'].replace(/\b[a-z]/g, (x) => x.toUpperCase());
    this.processed_request['___gender___'] = this.prepared_request['gender'];

    this.prepared_request['age'] = this.lm_request['age'];
    this.processed_request['___age___'] = this.prepared_request['age'];

    this.prepared_request['frequency'] = this.lm_request['frequency'].replace(/\b[a-z]/g, (x) => x.toUpperCase());
    this.processed_request['___frequency___'] = this.prepared_request['frequency'];

    //suminsured
    var SumAssured = 0;

    if (this.lm_request.hasOwnProperty('investment_amount')) {
        if (this.lm_request['investment_amount'] !== "") {
            if (this.lm_request['frequency'] === "monthly") {
                SumAssured = this.lm_request['investment_amount'] * 12;
            } else if (this.lm_request['frequency'] === "quarterly") {
                SumAssured = this.lm_request['investment_amount'] * 4;
            } else if (this.lm_request['frequency'] === "half-yearly") {
                SumAssured = this.lm_request['investment_amount'] * 2;
            } else if (this.lm_request['frequency'] === "yearly") {
                SumAssured = this.lm_request['investment_amount'] * 1;
            }
            this.prepared_request['SumAssured'] = SumAssured;
            this.processed_request['___SumAssured___'] = this.prepared_request['SumAssured'];
        }
    }

    //Other Insured
    this.prepared_request['LAfullname'] = this.lm_request["insured_fullname"];
    this.processed_request['___LAfullname___'] = this.prepared_request['LAfullname'];

    this.prepared_request['LAdOb'] = this.lm_request["insured_birth_date"];
    this.processed_request['___LAdOb___'] = this.prepared_request['LAdOb'];

    this.prepared_request['LAage'] = this.lm_request["insured_age"];
    this.processed_request['___LAage___'] = this.prepared_request['LAage'];

    this.prepared_request['LAgender'] = this.lm_request["insured_gender"];
    this.processed_request['___LAgender___'] = this.prepared_request['LAgender'];

    if (this.lm_request.hasOwnProperty('investing_for')) {
        if (this.lm_request['investing_for'] !== "myself") {
            this.prepared_request['LAProposerSame'] = false;
            this.processed_request['___LAProposerSame___'] = this.prepared_request['LAProposerSame'];
        } else {
//            this.prepared_request['LAfullname'] = this.lm_request["first_name"] + " " + this.lm_request["middle_name"] + " " + this.lm_request["last_name"];
//            this.processed_request['___LAfullname___'] = this.prepared_request['LAfullname'];
//
//            this.prepared_request['LAdOb'] = this.lm_request["birth_date"];
//            this.processed_request['___LAdOb___'] = this.prepared_request['LAdOb'];
//
//            this.prepared_request['LAage'] = this.lm_request["age"];
//            this.processed_request['___LAage___'] = this.prepared_request['LAage'];
//
//            this.prepared_request['LAgender'] = this.lm_request["gender"];
//            this.processed_request['___LAgender___'] = this.prepared_request['LAgender'];

            this.prepared_request['LAProposerSame'] = true;
            this.processed_request['___LAProposerSame___'] = this.prepared_request['LAProposerSame'];
        }
    }

    console.log(this.method_content);
};
EdelweissInvestment.prototype.insurer_product_api_pre = function () {
    console.log('insurer_product_api_pre');
};

EdelweissInvestment.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
    console.log("EdelweissInvestment  insurer_product_response_handler");
    var obj_response_handler;
    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Idv') {
        obj_response_handler = this.idv_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Proposal') {
        obj_response_handler = this.proposal_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Customer') {
        obj_response_handler = this.customer_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    return obj_response_handler;
};

EdelweissInvestment.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('Start', this.constructor.name, 'premium_response_handler');
    try {
        console.log(this.method_content);
        console.log(docLog.Insurer_Request);
        var objInsurerProduct = this;
        var Client = require('node-rest-client').Client;
        var client = new Client();

        var service_method_url = '';
        var body = JSON.parse(docLog.Insurer_Request);
        var args = {
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        };
        service_method_url = specific_insurer_object.method_file_url;
        client.post(service_method_url, args, function (data, response) {
            if (data)
                console.log(data);
            console.log(response);
            var objResponseFull = {
                'err': null,
                'result': null,
                'raw': JSON.stringify(docLog),
                'soapHeader': null,
                'objResponseJson': data
            };
            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            console.log('EdelweissInvestment serviceBreakup', serviceBreakup);
        });
    } catch (err) {

    }
};

EdelweissInvestment.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objPremiumService = objResponseJson;
        if (objResponseJson.hasOwnProperty("error")) {
            if (objResponseJson.error !== "") {
                Error_Msg = objResponseJson.error;
            }
        }
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson['message'] === "success") {
                var premium_breakup = {};
                premium_breakup['premium'] = objResponseJson['premium'];
                premium_breakup['maturity4'] = objResponseJson['maturity4'];
                premium_breakup['maturity8'] = objResponseJson['maturity8'];
                premium_breakup['pdf'] = objResponseJson['pdf'];
            }

        }
        objServiceHandler.Error_Msg = Error_Msg;
        objServiceHandler.Premium_Breakup = premium_breakup;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', ex);
    }
    return  objServiceHandler;
};

EdelweissInvestment.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (Error_Msg === 'NO_ERR') {
            var returnUrl = (config.environment.name === 'Development') ? 'http://localhost:50111/Payment/Transaction_Status' : this.const_payment.pg_ack_url;
            var data = [{
                    "WPModel": {
                        "PAge": parseInt(this.lm_request['age']),
                        "P_DOB":  moment(new Date(this.lm_request['birth_date'])).format("DD-MM-YYYY"),
                        "PGender": this.lm_request['gender'],
                        "PTobacco_Consumer": "No",
                        "ProposerName": this.lm_request['customer_name'],
                        "ProposerEmail": this.lm_request['email'],
                        "ProposerMobileNo": this.lm_request['mobile'],
                        "LA": this.lm_request['investing_for'],
                        "LAAge": parseInt(this.lm_request['insured_age']),
                        "LA_DOB": moment(new Date(this.lm_request['insured_birth_date'])).format("DD-MM-YYYY"),
                        "LAGender": this.lm_request['insured_gender'],
                        "LATobacco_Consumer": "No",
                        "LAName": this.lm_request['insured_fullname'],
                        "LAEmail": this.lm_request['email'],
                        "LAMobileNo": this.lm_request['mobile'],
                        "LARising": "N",
                        "Frequency": this.lm_request['frequency'],
                        "Premium": this.lm_request['final_premium'],
                        "IAMOUNT": this.lm_request['final_premium'],
                        "PT": "20",
                        "-PPT": 20,
                        "IStrategy": "Self-managed Strategy",
                        "fundEquity": "100",
                        "fundTop": "0",
                        "fundBond": "0",
                        "fundManaged": "0",
                        "fundMid": "0",
                        "TransID": ""
                    }
                }]
            console.log(JSON.stringify(data));
            var pg_data = {
                'hdnwealthplusdata': JSON.stringify(data),
                'hdneId': this.lm_request['email'],
                'hdnpno': this.lm_request['mobile'],
                'src': "A5A015",
                'hdntabindex': "2"
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_url = "https://www.edelweisstokio.in/wealth-plus/buy";
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = '';
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', ex);
    }
    return objServiceHandler;
};

module.exports = EdelweissInvestment;