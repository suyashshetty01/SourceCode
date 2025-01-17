/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Health = require(appRoot + '/libs/Health');
var fs = require('fs');
var config = require('config');

function BhartiAxaHealth() {

}
util.inherits(BhartiAxaHealth, Health);

BhartiAxaHealth.prototype.lm_request_single = {};
BhartiAxaHealth.prototype.insurer_integration = {};
BhartiAxaHealth.prototype.insurer_addon_list = [];
BhartiAxaHealth.prototype.insurer = {};
BhartiAxaHealth.prototype.insurer_date_format = 'yyyy-MM-dd';
BhartiAxaHealth.prototype.const_insurer_suminsured = [200000, 300000, 500000];


BhartiAxaHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    
    console.log('insurer_product_api_pre');
}
BhartiAxaHealth.prototype.insurer_product_field_process_pre = function () {
    console.log('insurer_product_field_process_pre');
    if (this.lm_request['adult_count'] == 1) {
        this.prepared_request['family_type_code'] = 'S';
        this.processed_request['___family_type_code___'] = 'S';
    }
    if (this.lm_request['adult_count'] == 2) {
        this.prepared_request['family_type_code'] = 'SS';
        this.processed_request['___family_type_code___'] = 'SS';
    }
    if (this.lm_request['child_count']==1) {
        this.prepared_request['family_type_code'] = 'SSC';
        this.processed_request['___family_type_code___'] = 'SSC';
    }
    if (this.lm_request['child_count']== 2) {
        this.prepared_request['family_type_code'] = 'SS2C';
        this.processed_request['___family_type_code___'] = 'SS2C';
    }
}
BhartiAxaHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;

    var error_msg = 'NO_ERROR';
    var obj_response_handler;

    if (specific_insurer_object.method.Method_Type == 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type == 'Proposal') {
        obj_response_handler = this.proposal_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type == 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type == 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    return obj_response_handler;

}
BhartiAxaHealth.prototype.insurer_product_field_process_post = function () {

}
BhartiAxaHealth.prototype.insurer_product_api_post = function () {

}
BhartiAxaHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;//
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');  
//Example POST method invocation 
        var Client = require('node-rest-client').Client;

        var client = new Client();
         process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// set content-type header and data as json in args parameter 
     var args = {"SessionDoc": ""};
        args['SessionDoc'] = docLog.Insurer_Request;
        soap.createClient(specific_insurer_object.method_file_url, function (err, client) {
                client.serve(args, function (err1, result, raw, soapHeader) {
                //var premiumObj = result.tuple.old.serve.serve.Envelope.Body.processTPRequestResponse.response;
                if (err1) {

                    var objResponseFull = {
                        'err': err1,
                        'result': result,
                        'raw': raw,
                        'soapHeader': null,
                        'objResponseJson': null
                    };
                } else {
                    var premiumObj = result.tuple.old.serve.serve;
//                    console.log('BhaartiResponse', premiumObj);
                    var objResponseFull = {
                        'err': err,
                        'result': result,
                        'raw': raw,
                        'soapHeader': null,
                        'objResponseJson': premiumObj
                    };
                }
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

            });
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

BhartiAxaHealth.prototype.premium_response_handler = function (objResponseJson) {
    try {
//        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);

        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null
        };
        var Error_Msg = 'NO_ERR';
        //check error start
        if (objResponseJson.hasOwnProperty('HealthDetails')) {
            var objPremiumService = objResponseJson['HealthDetails'];
            if (objPremiumService.hasOwnProperty('ErrorMessages')) {
                if (objPremiumService['ErrorMessages']['ErrMessages'] === '') {
                } else {
                    Error_Msg = objPremiumService['ErrorMessages']['ErrMessages'];
                }
            }
        } else {
            Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
        }
        
        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.get_const_premium_breakup();
            var objInsurerPremium = {};
            objPremiumService = objPremiumService['Premium'];
            for (var key in objPremiumService) {
                if (typeof objPremiumService[key] !== 'Object' && objPremiumService[key] != null) {
                    objInsurerPremium[key] = this.round2Precision(objPremiumService[key] - 0);
                }                
            }
            var service_component = objPremiumService['LstTaxComponentDetails']['TaxComponentHealth'];
            objInsurerPremium[service_component[0]['TaxName']] = service_component[0]['Amount'] - 0;
            objInsurerPremium[service_component[1]['TaxName']] = service_component[1]['Amount'] - 0;
            
            for (var key in this.premium_breakup_schema) {
                if (this.premium_breakup_schema[key] !== '' && this.premium_breakup_schema[key] !== 0) {
                    premium_breakup[key] = objInsurerPremium[this.premium_breakup_schema[key]];
                } else {
                    premium_breakup[key] = 0;
                }
            }
            premium_breakup['service_tax'] = premium_breakup['CGST'] + premium_breakup['SGST']; 
            
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['TraceID'];
        }

        objServiceHandler.Error_Msg = Error_Msg;
//        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'premium_response_handler', ex);
    }
}
BhartiAxaHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Payment': this.const_payment
        };
    try {
        
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('MotorPolicy')) {
            var objPremiumService = objResponseJson['MotorPolicy'];
            if (!(objPremiumService['ErrorMessages'] === '')) {
                Error_Msg = objPremiumService['ErrorMessages'];
            }
        } else {
            Error_Msg = objPremiumService;
        }
        if (Error_Msg === 'NO_ERR') {
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], objPremiumService['FinalPremium']);
            if (objPremiumVerification.Status) {
                var thankyouurl = ((config.environment.name === 'Production') ? 'http://www.policyboss.com' : 'http://qa.policyboss.com') + '/TwoWheelerInsurance/RelianceMotorNewPremiumResponse?ARN=' + this.lm_request['api_reference_number'];
                var pg_data = {
                    'ProposalNo': objResponseJson['MotorPolicy']['ProposalNo'],
                    'userID': this.prepared_request['insurer_integration_service_user'],
                    'ProposalAmount': objPremiumVerification.Proposal_Amt,
                    'PaymentType': '1',
                    'Responseurl': this.const_payment.pg_ack_url
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'GET';
                objServiceHandler.Insurer_Transaction_Identifier = '';
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
        }
        //this.const_policy.transaction_amount=   
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
        

    } catch (ex) {
        objServiceHandler.Error_Msg = JSON.stringify(ex);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', ex);
    }
    return objServiceHandler;
}
BhartiAxaHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        var Error_Msg = 'NO_ERR';

        if (this.const_policy.transaction_status === 'SUCCESS') {//transaction success

            var product_name = 'CAR';
            if (this.lm_request['product_id'] === 10) {
                product_name = 'TW';
            }
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;

            var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
            var pdf_web_path_portal = config.environment.portalurl + config.pb_config.pdf_web_loc + pdf_file_name;
            this.const_policy.policy_url = pdf_web_path_portal;

            var http = require('http');
            var insurer_pdf_url = this.prepared_request['insurer_integration_pdf_url'];
            insurer_pdf_url = insurer_pdf_url.replace('___policy_number___', this.const_policy.policy_number);
            insurer_pdf_url = insurer_pdf_url.replace('___product_id___', this.prepared_request['product_id']);
            try {
                var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                var file_portal = fs.createWriteStream(pdf_sys_loc_portal);
                var request = http.get(insurer_pdf_url, function (response) {
                    response.pipe(file_horizon);
                    response.pipe(file_portal);
                });
            } catch (ep) {
                console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
            }
        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
        return objServiceHandler;

    } catch (ex) {
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
}
BhartiAxaHealth.prototype.pg_response_handler = function () {
    try {
        //Success -> Output=1|9202272311012647|C531031700163|0|CCAvenue|R31031700154|Success|
        //Failure -> Output=0|| C514081505462|0|Billdesk|R311027381|Failure|authentication failed from bank
        //MismatchPremium -> Output=0|||1|CCavenue|R06041700079||Response Amount is not matching with the Premium to be paid.


        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get['Output'];
        var response = output.split('|');
        this.const_policy.transaction_status = '';
        this.const_policy.transaction_id = response[2];
        if (output.indexOf('Success') > -1 && response[1] != '') {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['ProposalAmount'];
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = response[1];
            this.const_policy.pg_reference_number_1 = response[5];
        } else if (output.indexOf('Success') > -1 && response[1] == '') {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['ProposalAmount'];
            this.const_policy.transaction_status = 'PAYPASS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = response[1];
        } else if (output.indexOf('Failure') > -1) {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
}
BhartiAxaHealth.prototype.member_above21 = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('member_above21', 'start');
    var member_above21 = 0;
    for(var x in this.lm_request) {
        if (x.indexOf('_age_in_months') > -1 && this.lm_request[x] >= 252) {
            member_above21++;
        }
    }    
    console.log('member_above21', 'finish');
    return member_above21;
};
BhartiAxaHealth.prototype.member_below21 = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('member_below21', 'start');
    var member_below21 = 0;    
    for(var x in this.lm_request) {
        if (x.indexOf('_age_in_months') > -1 && this.lm_request[x] < 252) {
            member_below21++;
        }
    } 
    console.log('member_below21', 'finish');
    return member_below21;
};
BhartiAxaHealth.prototype.premium_breakup_schema = {    
    "net_premium": "NetPremium",
    "CGST":"CGST",
    "SGST":"SGST",
    "service_tax": "",    
    "final_premium": "FinalPremium"
};
module.exports = BhartiAxaHealth;