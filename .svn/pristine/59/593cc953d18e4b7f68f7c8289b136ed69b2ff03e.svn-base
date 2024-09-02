/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Cycle = require(appRoot + '/libs/Cycle');
var fs = require('fs');
var config = require('config');
var moment = require('moment');

function DigitCycle() {

}
util.inherits(DigitCycle, Cycle);

DigitCycle.prototype.lm_request_single = {};
DigitCycle.prototype.insurer_integration = {};
DigitCycle.prototype.insurer_addon_list = [];
DigitCycle.prototype.insurer = {};
DigitCycle.prototype.pdf_attempt = 0;
DigitCycle.prototype.insurer_date_format = 'yyyy-MM-dd';


DigitCycle.prototype.insurer_product_api_pre = function () {
    console.log("insurer_product_api_pre");
};
DigitCycle.prototype.insurer_product_field_process_pre = function () {
    console.log("insurer_product_field_process_pre");
};
DigitCycle.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;

    var error_msg = 'NO_ERROR';
    var obj_response_handler;
    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
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
DigitCycle.prototype.insurer_product_field_process_post = function () {

};
DigitCycle.prototype.insurer_product_api_post = function () {

};
DigitCycle.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {

        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;//
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');

        var Client = require('node-rest-client').Client;
        var client = new Client();
        console.log("Digit Cycle service_call : ", specific_insurer_object.method.Method_Type, " :: ", docLog.Insurer_Request);
        var args = null;
        var service_method_url = '';

        //service_method_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action;
        client.post(config.environment.weburl, function (data, response) {
            // parsed response body as js object 
            console.log(data);
            // raw response 
            console.log(response);
            var objResponseFull = {
                'err': null,
                'result': data,
                'raw': '',
                'soapHeader': null,
                'objResponseJson': ''
            };
            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
DigitCycle.prototype.customer_response_handler = function (objResponseJson) {
    try {
        console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Payment': this.const_payment
        };
        var Error_Msg = 'NO_ERR';
        //check error start
        if (objResponseJson.hasOwnProperty('error')) {
            //check error stop
            if (objResponseJson['error']['errorCode'] === 0 || objResponseJson['error']['errorMessage'] === 'Success') {

            } else {
                Error_Msg = objResponseJson['error']['errorMessage'];
            }
        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }
        if (Error_Msg === 'NO_ERR') {
            //var thankyouurl = ((config.environment.name === 'Production') ? 'http://www.policyboss.com' : 'http://localhost:50111') + '/Payment/Transaction_Status?crn=' + this.lm_request['crn'];
            //var thankyouurl = 'http://localhost:50111/Payment/Transaction_Status/' + this.lm_request['crn'];
            var thankyouurl = this.const_payment.pg_ack_url;
            var application_id = objResponseJson['applicationId'];
            var policy_no = objResponseJson['policyNumber'];
            var pg_data = {
                'applicationId': application_id,
                'successReturnUrl': thankyouurl, //this.const_payment.pg_ack_url,
                'cancelReturnUrl': thankyouurl, //this.const_payment.pg_ack_url,
                'expiryHours': '48'
            };
            //   objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';

            var Customer = {
                'insurer_customer_identifier': objResponseJson.applicationId,
                'insurer_customer_identifier_1': thankyouurl,
                'insurer_customer_identifier_2': objResponseJson.enquiryId,
                'insurer_customer_identifier_3': objResponseJson.policyNumber,
                'final_premium_verified': objResponseJson.totalGrossPremium
                        //'insurer_customer_identifier_response': JSON.stringify(objResponseJson)
            };
            this.const_payment_response.final_premium = objResponseJson.totalGrossPremium;
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], this.const_payment_response.final_premium);
            if (objPremiumVerification.Status) {
                this.const_payment_response.pg_data = pg_data;
                objServiceHandler.Customer = Customer;
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.enquiryId;
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
DigitCycle.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };

    //this.response_object.enquiry_id = objResponseJson.enquiryId;
    var Error_Msg = 'NO_ERR';
    if (!this.lm_request.hasOwnProperty('Cycle_Vehicle_Price') || this.lm_request['Cycle_Vehicle_Price'] === undefined) {
        Error_Msg = 'Cycle_Vehicle_Price Error';
    }
    if (this.lm_request['Cycle_Vehicle_Price'] <= 0) {
        Error_Msg = 'Cycle_Vehicle_Price Zero';
    }
    try {

        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.const_premium_breakup;
            var basic = parseInt((parseInt(this.lm_request['Cycle_Vehicle_Price']) * 4.5) / 100);
            premium_breakup['basic_premium'] = basic;
            premium_breakup['pa_cover_premium'] = 150;
            premium_breakup['net_premium'] = parseInt(basic) + 150;
            premium_breakup['service_tax'] = Math.round(parseInt(premium_breakup['net_premium']) * 0.18);
            premium_breakup['final_premium'] = parseInt(premium_breakup['net_premium']) + parseInt(premium_breakup['service_tax']);
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['enquiryId'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
DigitCycle.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {

    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    var objInsurerProduct = this;
    var Insurer_Id = specific_insurer_object['insurer_id'];

    var IdvMethod = this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Idv');
    specific_insurer_object.method = IdvMethod;
    if (specific_insurer_object.method.Service_File && fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
        specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
    } else {
        specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
    }
    var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + IdvMethod.Method_Request_File).toString();
    method_content = method_content.replace('___lv_quote_no___', this.lv_quote_no());
    this.method_content = method_content.replace('___vehicle_expected_idv___', 0);
    for (var addon_key in this.const_addon_master) {
        this.method_content = this.method_content.replace('___' + addon_key + '___', 'false');
    }
    this.insurer_product_field_process_pre();
    var request_replaced_data = this.method_content.replaceJson(this.processed_request);

    var logGuid = this.create_guid('ARN-');
    var docLog = {
        "Service_Log_Id": "",
        "Service_Log_Unique_Id": logGuid,
        "Request_Id": objProduct.docRequest.Request_Id,
        "User_Data_Id": objProduct.lm_request['udid'] - 0,
        "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
        "Insurer_Request": request_replaced_data,
        "Insurer_Response": "",
        "Insurer_Response_Core": "",
        "Premium_Breakup": null,
        "LM_Response": "",
        "Insurer_Transaction_Identifier": "",
        "Status": "pending",
        "Error_Code": "",
        "Is_Active": 1,
        "Created_On": new Date(),
        "Product_Id": objProduct.db_specific_product.Product_Id,
        "Insurer_Id": Insurer_Object.Insurer_ID,
        "Plan_Id": null,
        "Plan_Name": null,
        "Method_Type": "Idv",
        "Call_Execution_Time": 0
    };
    this.save_log(docLog);
    console.log('ServiceData');
    console.log(docLog.Insurer_Request);

    this.service_call(docLog, objProduct, Insurer_Object, specific_insurer_object);
};

DigitCycle.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };

    try {
        var application_id = objResponseJson.toString();
        if (application_id != '' && application_id.indexOf('http') > -1) {

        } else {
            Error_Msg = 'LM_NO_VALID_PG_REDIRECT_URL';
        }
        if (Error_Msg === 'NO_ERR') {
            //var thankyouurl = ((config.environment.name === 'Production') ? 'http://www.policyboss.com' : 'http://qa.policyboss.com') + '/Payment/Transaction_Status?crn=' + this.lm_request['crn'];
            //var thankyouurl = 'http://localhost:50111/Payment/Transaction_Status/' + this.lm_request['crn'];
            objServiceHandler.Payment.pg_ack_url = this.const_payment.pg_ack_url; //thankyouurl;
            objServiceHandler.Payment.pg_data = "";
            objServiceHandler.Payment.pg_url = application_id;
            objServiceHandler.Payment.pg_redirect_mode = 'GET';
            objServiceHandler.Error_Msg = Error_Msg;
            objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request['insurer_customer_identifier_2'];
        }
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
DigitCycle.prototype.pg_response_handler = function () {
    ///msg=TRANS000000001||A12||MAM22661885141||AM2||4000.00||Canceled By User||0399
    //msg=TRANS000000001||A12||MAM22661885141||AM2||4000.00|| Success||0300
    //referenceid||partnercode||mcitnumber|| referencenum ||amount||msg||msgcode
    //SUCCESS if msgcode '0300'
    if (this.const_payment_response.pg_get.hasOwnProperty('transactionNumber')) {
        var msg = this.const_payment_response.pg_get['transactionNumber'];
        this.const_policy.pg_status = 'SUCCESS';
        this.const_policy.pg_reference_number_1 = msg;
        this.const_policy.transaction_id = msg;
        // this.prepared_request['transaction_Id'] =this.const_policy.pg_reference_number_1;
        //this.processed_request['___transaction_Id___'] = this.prepared_request['transaction_Id'];
    } else {
        this.const_policy.pg_status = 'FAIL';
        this.const_policy.transaction_status = 'FAIL';
    }
};
DigitCycle.prototype.verification_response_handler = function (objResponseJson) {
    try {
        /*
         {"email":"asdfasf@gmail.com",
         "mobile":"9845456465",
         "vanity_url_part":"godigit",
         "is_wallet_enabled":false,"findUser":true,
         "notifyUser":false,"txnId":"D-a0c64a5d6208"}: 
         */
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        var Error_Msg = 'NO_ERR';

        if (this.const_policy.pg_status === 'FAIL') {

        }
        if (this.const_policy.pg_status === 'SUCCESS') {
            console.error('DigitChk', objResponseJson);
            /*if (objResponseJson.hasOwnProperty('error')) {
             //check error stop
             if (objResponseJson['error']['errorCode'] === 0 || objResponseJson['error']['errorMessage'] === 'Success') {
             if (objResponseJson.contractStatus.status === "COMPLETE") {
             
             } else {
             Error_Msg = objResponseJson.contractStatus.status;
             }                    
             } else {
             Error_Msg = objResponseJson['error']['errorMessage'];
             }
             } else {
             Error_Msg = JSON.stringify(objResponseJson);
             }*/

            if (Error_Msg === 'NO_ERR') {
                //if (objResponseJson.hasOwnProperty('policyNumber') && objResponseJson['policyNumber'] !== '') {
                if (this.prepared_request['final_policy_number'] !== '') {
                    //var objPremiumService = objResponseJson;
                    //this.const_policy.policy_number = objPremiumService['policyNumber'];
                    this.const_policy.policy_number = this.prepared_request['final_policy_number'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'CAR';
                    if (this.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    //var pdf_web_path = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path;
                    // this.const_policy.policy_no = this.const_policy.policy_number;
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    var args = {
                        data: {
                            "search_reference_number": this.lm_request['search_reference_number'],
                            "api_reference_number": this.lm_request['api_reference_number'],
                            "policy_number": this.const_policy.policy_number,
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key'],
                            'insurer_id': this.lm_request['insurer_id'],
                            'crn': this.lm_request['crn'],
                            'method_type': 'Pdf',
                            'execution_async': 'no'
                        },
                        headers: {
                            "Content-Type": "application/json",
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key']
                        }
                    };
                    this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
                    /*
                     client.post(config.environment.weburl + '/quote/pdf_initiate', args, function (data, response) {
                     
                     });*/
                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        this.const_policy.transaction_status = 'PAYPASS';
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
DigitCycle.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    var objInsurerProduct = this;
    objInsurerProduct.pdf_attempt++;
    var Client = require('node-rest-client').Client;
    var client = new Client();
    client.post(url, args, function (data, response) {
        if (data.Error_Code !== '' || true) {
            if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                var sleep = require('system-sleep');
                sleep(60000);
                objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
            }
        }
    });
};
DigitCycle.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var policy = {
        'policy_url': null,
        'policy_number': this.lm_request['policy_number'],
        'pdf_status': null
    };
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objPremiumService = objResponseJson;
        let pdf_url = '';
        if (objPremiumService.hasOwnProperty('schedulePathHC') && objPremiumService.hasOwnProperty('schedulePath')) {
            if (this.lm_request['product_id'] === 12) {
                if (objPremiumService['schedulePath'] != "") {
                    pdf_url = objPremiumService['schedulePath'];
                } else {
                    Error_Msg = 'LM_schedulePath_Node_Empty';
                }
            } else {
                if (objPremiumService['schedulePathHC'] != "") {
                    objPremiumService['schedulePathHC'] = objPremiumService['schedulePathHC'].replace('\u003d', '=');
                    pdf_url = objPremiumService['schedulePathHC'];
                } else {
                    Error_Msg = 'LM_schedulePathHC_Node_Empty';
                }
            }
        } else {
            Error_Msg = 'LM_schedulePathHC_OR_schedulePath_Node_Missing';
        }

        if (Error_Msg === 'NO_ERR') {
            var product_name = 'CAR';
            if (this.lm_request['product_id'] === 10) {
                product_name = 'TW';
            }
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'] + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
            var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
            var https = require('https');
            var insurer_pdf_url = pdf_url;

            this.const_policy.insurer_policy_url = insurer_pdf_url;
            policy.policy_url = pdf_web_path_portal;
            policy.pdf_status = 'SUCCESS';
            try {
                var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                var request = https.get(insurer_pdf_url, function (response) {
                    response.pipe(file_horizon);
                });
            } catch (ep) {
                console.error('ExceptionPDF', this.constructor.name, 'pdf_response_handler', ep);
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.pdf_status = 'FAIL';
        }
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex);
    }
    objServiceHandler.Policy = policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
DigitCycle.prototype.vehicle_age_year = function () {
    var moment = require('moment');
    console.log('Start', this.constructor.name, 'vehicle_age_year');
    var vehicle_manf_date = this.lm_request['vehicle_manf_date'];
    var policy_start_date = this.policy_start_date();
    var age_in_year = moment(policy_start_date).diff(vehicle_manf_date, 'years');
    age_in_year = age_in_year + 1;
    console.log('Finish', this.constructor.name, 'vehicle_age_year', age_in_year);
    return age_in_year;
};
DigitCycle.prototype.lv_quote_no = function () {
    return this.create_guid('', 'numeric', 7);
};
DigitCycle.prototype.premium_breakup_schema = {
    "basic_premium": "Basic_Premium",
    "pa_cover_premium": "PA_Premium",
    "net_premium": "totalNetPremium",
    "service_tax": "PropPremiumCalculation_ServiceTax",
    "final_premium": "totalGrossPremium"
};
module.exports = DigitCycle;