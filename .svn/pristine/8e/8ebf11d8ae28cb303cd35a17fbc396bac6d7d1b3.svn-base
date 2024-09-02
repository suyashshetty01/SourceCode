/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Marine = require(appRoot + '/libs/Marine');
var fs = require('fs');
var config = require('config');

function RelianceMarine() {

}
util.inherits(RelianceMarine, Marine);

RelianceMarine.prototype.lm_request_single = {};
RelianceMarine.prototype.insurer_integration = {};
RelianceMarine.prototype.insurer_addon_list = [];
RelianceMarine.prototype.insurer = {};
RelianceMarine.prototype.insurer_date_format = 'dd/mm/yyyy';
RelianceMarine.prototype.const_insurer_suminsured = [500000, 700000, 1000000];

RelianceMarine.prototype.insurer_product_api_pre = function () {

};

RelianceMarine.prototype.insurer_product_field_process_pre = function () {
    console.log('insurer_product_api_pre');
    if (this.lm_request['method_type'] === 'Proposal') {

        this.prepared_request['communication_district_code'] = this.insurer_master['pincodes']['pb_db_master']['District_Code'];
        this.processed_request['___communication_district_code___'] = this.prepared_request['communication_district_code'];

        this.prepared_request['communication_city_code'] = this.insurer_master['pincodes']['pb_db_master']['City_Id'];
        this.processed_request['___communication_city_code___'] = this.prepared_request['communication_city_code'];

        this.prepared_request['communication_state_code'] = this.insurer_master['pincodes']['pb_db_master']['State_Code'];
        this.processed_request['___communication_state_code___'] = this.prepared_request['communication_state_code'];
        
        this.prepared_request['communication_address_2'] = this.insurer_master['pincodes']['pb_db_master']['City'] + " "+ this.insurer_master['pincodes']['pb_db_master']['Pincode'];
        this.processed_request['___communication_address_2___'] = this.prepared_request['communication_address_2'];

         this.prepared_request['communication_address_3'] = this.insurer_master['pincodes']['pb_db_master']['State'];
        this.processed_request['___communication_address_3___'] = this.prepared_request['communication_address_3'];
        
        this.prepared_request['invoice_date'] = this.date_format(this.lm_request['invoiceDate'], 'dd/MM/yyyy');
        this.processed_request['___invoice_date___'] = this.prepared_request['invoice_date'];

        this.prepared_request['invoice_number'] = this.lm_request['invoiceNumber'];
        this.processed_request['___invoice_number___'] = this.prepared_request['invoice_number'];
    }
};

RelianceMarine.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
    var obj_response_handler;

    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Customer') {
        obj_response_handler = this.customer_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Proposal') {
        obj_response_handler = this.proposal_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
RelianceMarine.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    console.log(docLog.Insurer_Request);
    var Client = require('node-rest-client').Client;

    var client = new Client();
    try {
        var objInsurerProduct = this;
        var args = null;
        var service_method_url = '';
        args = {
            data: docLog.Insurer_Request,
            headers: {"Content-Type": "application/xml"}
        };

        specific_insurer_object.method_file_url = "http://szuat.reliancegeneral.co.in:7443/API/Marine/";
        service_method_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action;


        client.post(service_method_url, args, function (data, response) {
            // parsed response body as js object 
            console.log(data);
            // raw response 
            //console.log(response);
            var objResponseFull = {
                'err': null,
                'result': data,
                'raw': JSON.stringify(data),
                'soapHeader': null,
                'objResponseJson': data
            };
            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            if (specific_insurer_object.method.Method_Type === 'Idv') {
                objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
            }
        });

    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

RelianceMarine.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);

        if (objResponseJson.hasOwnProperty('MarineDetails')) {
            var objPremiumService = objResponseJson['MarineDetails'];
            if (objPremiumService.hasOwnProperty('ContainsValidationErrors')) {
                if (objPremiumService['ContainsValidationErrors'] === "false") {
                } else {
                    Error_Msg = objPremiumService['ValidationErrors'];
                }
            }
        } else {
            Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
        }
        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.get_const_premium_breakup();
            var totaltax = 0;
            for (var itax in objPremiumService['PremiumSummary']['TaxComponentDetails']['TaxComponent']) {
                totaltax = totaltax + Number(objPremiumService['PremiumSummary']['TaxComponentDetails']['TaxComponent'][itax]['Amount']);
            }
            premium_breakup['base_premium'] = objPremiumService['PremiumSummary']['BasicPremiumINR'];
            premium_breakup['net_premium'] = objPremiumService['PremiumSummary']['NetPremiumINR'];
            premium_breakup['service_tax'] = objPremiumService['PremiumSummary']['TaxComponentDetails']['TaxComponent']['Amount'];
            premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['final_premium'] = Math.round(objPremiumService['PremiumSummary']['FinalPremium']);
            premium_breakup['WarSRCCorSRCCInlandPremiumINR'] = Math.round(objPremiumService['PremiumSummary']['WarSRCCorSRCCInlandPremiumINR']);
            premium_breakup['StampDutyINR'] = objPremiumService['PremiumSummary']['StampDutyINR'];

            objServiceHandler.Premium_Breakup = premium_breakup;
        }
        objServiceHandler.Insurer_Transaction_Identifier = objPremiumService.hasOwnProperty('correlationId') ? objPremiumService['correlationId'] : null;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', ex);
    }
    return objServiceHandler;
};


RelianceMarine.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objProposalService = objResponseJson.MarineDetails;
        console.log("obj->");
        console.log(objResponseJson);
        if (objProposalService.ContainsValidationErrors === "true" || objProposalService.hasOwnProperty("ErrorMessages")) {
            Error_Msg = objResponseJson;
        }
        if (objResponseJson)
            if (Error_Msg === 'NO_ERR') {
                var objPremiumService = objProposalService.PremiumSummary;
                var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], objPremiumService['FinalPremium']);
                if (objPremiumVerification.Status) {
                    var pg_data = {
                        'ProposalNo': objProposalService['Policy']['ProposalNo'],
                        'userID': "100002", //this.prepared_request['email'],
                        'ProposalAmount': objPremiumVerification.Proposal_Amt,
                        'PaymentType': '1',
                        'Responseurl': this.const_payment.pg_ack_url //'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id']  
                    };
                    objServiceHandler.Payment.pg_data = pg_data;
                    objServiceHandler.Payment.pg_redirect_mode = 'GET';
                    objServiceHandler.Insurer_Transaction_Identifier = objProposalService['Policy']['ProposalNo'];
                } else {
                    Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                }
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
RelianceMarine.prototype.pg_response_handler = function () {
    try {
//Success -> Output=1|9202272311012647|C531031700163|0|CCAvenue|R31031700154|Success|
//Failure -> Output=0|| C514081505462|0|Billdesk|R311027381|Failure|authentication failed from bank
//MismatchPremium -> Output=0|||1|CCavenue|R06041700079||Response Amount is not matching with the Premium to be paid.

        var objInsurerProduct = this;
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = objInsurerProduct.lm_request.pg_get['Output'];
        var response = output.split('|');
        this.const_policy.transaction_status = '';
        this.const_policy.transaction_id = response[2];
        if (response[0].trim() === "1") {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['ProposalAmount'];
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = response[1];
            this.const_policy.pg_reference_number_1 = response[5];

        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
};
RelianceMarine.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objInsurerProduct = this;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objInsurerProduct.const_policy.pg_status === 'FAIL') {

        }
        if (objInsurerProduct.const_policy.pg_status === 'SUCCESS') {


            if (Error_Msg === 'NO_ERR') {
                if (objInsurerProduct.const_policy.policy_number !== '') {
                    console.error('Start', this.constructor.name, 'policy_number', objInsurerProduct.const_policy['policy_number']);
                    //this.const_policy.policy_number = objResponseJson['policyno'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'MARINE';
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + objInsurerProduct.const_policy['policy_number'].replaceAll('/', '') + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    objInsurerProduct.const_policy.policy_url = pdf_web_path;


                    var args = {
                        data: {
                            "search_reference_number": objInsurerProduct.lm_request['search_reference_number'],
                            "api_reference_number": objInsurerProduct.lm_request['api_reference_number'],
                            "policy_number": objInsurerProduct.const_policy.policy_number,
                            'client_key': objInsurerProduct.lm_request['client_key'],
                            'secret_key': objInsurerProduct.lm_request['secret_key'],
                            'insurer_id': objInsurerProduct.lm_request['insurer_id'],
                            'method_type': 'Pdf',
                            'execution_async': 'no'
                        },
                        headers: {
                            "Content-Type": "application/json",
                            'client_key': objInsurerProduct.lm_request['client_key'],
                            'secret_key': objInsurerProduct.lm_request['secret_key']
                        }
                    };
                    objInsurerProduct.const_policy.verification_request = args.data;

                    var http = require('http');
                    var insurer_pdf_url = objInsurerProduct.prepared_request['insurer_integration_pdf_url'];
                    insurer_pdf_url = insurer_pdf_url.replace('___policy_number___', objInsurerProduct.const_policy.policy_number);
                    insurer_pdf_url = insurer_pdf_url.replace('___product_code___', "24SV");
                    this.const_policy.insurer_policy_url = insurer_pdf_url;
                    try {
                        console.error('TataVerStart', this.constructor.name, 'pdf', pdf_sys_loc);
                        var file_horizon = fs.createWriteStream(pdf_sys_loc);
                        var request = http.get(insurer_pdf_url, function (response) {
                            response.pipe(file_horizon);
                        });
                    } catch (ep) {
                        console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep.stack);
                    }
                    //End                   
                } else {
                    objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
                }
            } else {
                objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
            }
            objServiceHandler.Insurer_Transaction_Identifier = objInsurerProduct.const_policy.transaction_id;
        }
        objServiceHandler.Policy = objInsurerProduct.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};

function jsonToQueryString(json) {
    return  Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
    }).join('&');
}
module.exports = RelianceMarine;