/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Travel = require(appRoot + '/libs/Travel');
var fs = require('fs');
var config = require('config');
var moment = require('moment');
var crypto = require('crypto');
var sleep = require('system-sleep');
function TataAIGTravel() {
}
util.inherits(TataAIGTravel, Travel);
TataAIGTravel.prototype.lm_request_single = {};
TataAIGTravel.prototype.insurer_integration = {};
TataAIGTravel.prototype.insurer_addon_list = [];
TataAIGTravel.prototype.insurer = {};
TataAIGTravel.prototype.insurer_date_format = 'MM/DD/YYYY';
TataAIGTravel.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
TataAIGTravel.prototype.insurer_product_field_process_pre = function () {
    let member_count = this.lm_request['member_count'];
    let plan_id;
    let plan_code;
    if (this.lm_request['method_type'] === 'Proposal') {
        var returnUrl = this.pg_ack_url(11);
        this.prepared_request['return_url'] = returnUrl;
        this.processed_request['___return_url___'] = returnUrl;
    }
    if (this.lm_request['method_type'] === 'Customer') {
        if (this.lm_request['relation'] === 'self' || this.lm_request['relation'] === 'Self' || this.lm_request['relation'] === 'SELF') {
            this.prepared_request['___proposer_same_as_insured___'] = true;
            this.processed_request['___proposer_same_as_insured___'] = this.prepared_request['___proposer_same_as_insured___'];
        } else {
            this.prepared_request['___proposer_same_as_insured___'] = false;
            this.processed_request['___proposer_same_as_insured___'] = this.prepared_request['___proposer_same_as_insured___'];
        }
        this.prepared_request['___proposal_id___'] = this.insurer_master.service_logs.insurer_db_master.Insurer_Response.data[0]['proposal_id'];
        this.processed_request['___proposal_id___'] = this.prepared_request['___proposal_id___'];
        
          this.prepared_request['member_1_age_1'] = this.lm_request['member_1_age_1'];
        this.processed_request['___member_1_age_1___'] = this.prepared_request['member_1_age_1'];

        if (this.lm_request.hasOwnProperty('visiting_countries') && this.lm_request['visiting_countries']) {
            let countryArray = this.lm_request['visiting_countries'];
            let insRequestCountryArray = [];
            countryArray.forEach((country) => {
                insRequestCountryArray.push(country.item_text);
            });
            this.prepared_request['___visiting_countries___'] = insRequestCountryArray;
            this.processed_request['___visiting_countries___'] = this.prepared_request['___visiting_countries___'];
        }

        this.prepared_request['___gender___'] = this.lm_request['member_1_gender_text'];
        this.processed_request['___gender___'] = this.prepared_request['___gender___'].toLowerCase();

    }
    if (this.lm_request['method_type'] === 'Verification') {
        if (this.proposal_processed_request.hasOwnProperty('___insurer_customer_identifier___')) {
            this.prepared_request['payment_id'] = this.proposal_processed_request['___insurer_customer_identifier___'];
            this.processed_request['___payment_id___'] = this.prepared_request['payment_id'];
        }
    }
    if (this.lm_request['method_type'] == 'Premium') {
        plan_id = this.prepared_request['Plan_Id'];
        plan_code = this.prepared_request['Plan_Code'];
    } else {
        plan_id = this.prepared_request['dbmaster_pb_plan_id'];
        plan_code = this.prepared_request['dbmaster_pb_plan_code'];
    }
    let txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
    let txt_age_replace = this.find_text_btw_key(this.method_content, ' <!--InsurersAge_Start-->', ' <!--InsurersAge_End-->', true);
    let txt_replace_with = "";
    let txt_age_replace_with = "";
    let adultCount = this.lm_request['adult_count'];
    for (member = 1; member <= this.lm_request['adult_count']; member++) {
        txt_age_replace_with += txt_age_replace.replaceAll('___member_array', '___member_' + member).replaceAll('____member_count___', '_' + member);

        txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member).replaceAll('____member_count___', '_' + member);

        if (this.lm_request['method_type'] === 'Customer') {
            this.prepared_request['___member_' + member + '_gender___'] = this.lm_request['member_' + member + '_gender_text'];
            this.processed_request['___member_' + member + '_gender___'] = this.prepared_request['___member_' + member + '_gender___'].toLowerCase();

            if (this.lm_request['member_' + member + '_ped'] && typeof (this.lm_request['member_' + member + '_ped']) === "object") {
                this.prepared_request['___member_' + member + '_ped___'] = true;
                this.processed_request['___member_' + member + '_ped___'] = this.prepared_request['___member_' + member + '_ped___'];

                this.prepared_request['___member_' + member + '_ped_desc___'] = this.lm_request['member_' + member + '_other_diseases'];
                this.processed_request['___member_' + member + '_ped_desc___'] = this.prepared_request['___member_' + member + '_ped_desc___'];
            } else {
                this.prepared_request['___member_' + member + '_ped___'] = false;
                this.processed_request['___member_' + member + '_ped___'] = this.prepared_request['___member_' + member + '_ped___'];

                this.prepared_request['___member_' + member + '_ped_desc___'] = '';
                this.processed_request['___member_' + member + '_ped_desc___'] = this.prepared_request['___member_' + member + '_ped_desc___'];
            }
        }
    }
    for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
        txt_age_replace_with += txt_age_replace.replaceAll('___member_array', '___member_' + member).replaceAll('____member_count___', '_' + (adultCount + (member - 2)));
        txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        if (this.lm_request['method_type'] === 'Customer') {
            this.prepared_request['___member_' + member + '_gender___'] = this.lm_request['member_' + member + '_gender_text'].toLowerCase();
            this.processed_request['___member_' + member + '_gender___'] = this.prepared_request['___member_' + member + '_gender___'];

            if (this.lm_request['member_' + member + '_ped'] && typeof (this.lm_request['member_' + member + '_ped']) === "object") {
                this.prepared_request['___member_' + member + '_ped___'] = true;
                this.processed_request['___member_' + member + '_ped___'] = this.prepared_request['___member_' + member + '_ped___'];

                this.prepared_request['___member_' + member + '_ped_desc___'] = this.lm_request['member_' + member + '_other_diseases'];
                this.processed_request['___member_' + member + '_ped_desc___'] = this.prepared_request['___member_' + member + '_ped_desc___'];
            } else {
                this.prepared_request['___member_' + member + '_ped___'] = false;
                this.processed_request['___member_' + member + '_ped___'] = this.prepared_request['___member_' + member + '_ped___'];

                this.prepared_request['___member_' + member + '_ped_desc___'] = '';
                this.processed_request['___member_' + member + '_ped_desc___'] = this.prepared_request['___member_' + member + '_ped_desc___'];
            }
        }
    }

    if (this.method_content[0] !== '<') {// for json
        txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
        txt_age_replace_with = txt_age_replace_with.replaceAll('<!--InsurersAge_Start-->', "");
        let Total_Count
        if (this.lm_request['method_type'] == 'Premium') {
            Total_Count = member_count;
        } else if (this.lm_request['method_type'] == 'Customer') {
            Total_Count = member_count - 1;
        }
        for (var x = 1; x <= Total_Count; x++) {
            txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', ",");
        }
        txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', "");

        for (var x = 1; x <= member_count; x++) {
            txt_age_replace_with = txt_age_replace_with.replace('<!--InsurersAge_End-->', ",");
        }
        txt_age_replace_with = txt_age_replace_with.replace('<!--InsurersAge_End-->', "");
    }

    this.method_content = this.method_content.replace(txt_age_replace, txt_age_replace_with);
    this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
    this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, ",");
    this.method_content = this.method_content.replaceAll(",,", ",");

    this.prepared_request['___member_count___'] = this.lm_request['member_count'];
    this.processed_request['___member_count___'] = this.prepared_request['___member_count___'];
    this.prepared_request['___policy_end_date___'] = moment(this.lm_request['policy_end_date'], 'YYYY-MM-DD').format('MM/DD/YYYY');
    this.processed_request['___policy_end_date___'] = this.prepared_request['___policy_end_date___'];

    if (this.lm_request['trip_type'] === "MULTI") {
        this.processed_request['___policy_end_date___'] = moment(this.lm_request['policy_end_date']).subtract(1, 'days').format('MM/DD/YYYY');
    } else {
        this.processed_request['___travel_days___'] = moment(this.lm_request['policy_end_date']).diff(this.lm_request['policy_start_date'], 'days') + 1;
    }

    this.prepared_request['___trip_type___'] = this.lm_request['trip_type'] === 'SINGLE' ? 'Single Trip' : 'Multi Trip';
    this.processed_request['___trip_type___'] = this.prepared_request['___trip_type___'];
    let applicationdate = moment().format('MM/DD/YYYY');
    this.prepared_request['___application_date___'] = applicationdate;
    this.processed_request['___application_date___'] = this.prepared_request['___application_date___'];
    this.get_product_details(plan_code, this.lm_request['member_1_age']);
};
TataAIGTravel.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    return obj_response_handler;
};
TataAIGTravel.prototype.insurer_product_field_process_post = function () {

};
TataAIGTravel.prototype.insurer_product_api_post = function () {

};
TataAIGTravel.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        console.log(docLog.Insurer_Request);
        var Client = require('node-rest-client').Client;
        var xml2js = require('xml2js');
        var client = new Client();
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        var body = docLog.Insurer_Request;

        if (specific_insurer_object.method.Method_Type === 'Proposal') {
            docLog.Insurer_Request = docLog.Insurer_Request.replace("payment_moe", "payment_mode");
        }
        let args = {
            data: body,
            headers: {
                "x-api-key": "g8hoqi8TBA2mBpxgMohdTcWxAfv6JsJ6wLztOWm4"
            }
        };
        console.log(args);
        let tokenreq = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                "grant_type": "client_credentials",
                "scope": "https://api.iorta.in/write",
                "client_id": "5qdbqng8plqp1ko2sslu695n2g",
                "client_secret": "gki6eqtltmjj37gpqq0dt52dt651o079dn6mls62ptkvsa2b45c"
            }
        };
        let tokenUrl = 'https://uatapigw-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token';
        client.post(tokenUrl, tokenreq, function (data, response) {
            try {
                if (data && data.hasOwnProperty('access_token') && data['access_token']) {
                    let authToken = data['access_token'];
                    if (authToken) {
                        args.headers['Authorization'] = authToken;
                        if (specific_insurer_object.method.Method_Type !== 'Pdf') {
                            args.headers['Content-Type'] = "application/json";
                            console.log(args.data);
                            client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                                try {
                                    if (data) {
                                        console.log('TATA AIG Data', data);
                                        var objResponseFull = {
                                            'err': null,
                                            'result': data,
                                            'raw': data,
                                            'soapHeader': null,
                                            'objResponseJson': data
                                        };
                                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                            });
                        } else if (specific_insurer_object.method.Method_Type === 'Pdf') {
                            var encrypted_policy_id = objProduct.lm_request.encrypted_policyId;
                            client.get(specific_insurer_object['method']['Service_URL'] + encrypted_policy_id, args, function (data, response) {
                                console.log(data);
                                console.log(objResponseFull);
                                var objResponseFull = {
                                    'err': null,
                                    'result': data,
                                    'raw': JSON.stringify(docLog),
                                    'soapHeader': null,
                                    'objResponseJson': data
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            });
                        }
                    }
                }
            } catch (e) {
                console.log('Msg', e.stack);
            }
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
TataAIGTravel.prototype.premium_response_handler = function (objResponseJson) {
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null
        };
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('status') && objResponseJson.status === 200 && objResponseJson.hasOwnProperty('message_txt') && objResponseJson.message_txt.toLowerCase().includes("success")) {

        } else {
            Error_Msg = objResponseJson.hasOwnProperty('message_txt') ? objResponseJson.message_txt : objResponseJson;
        }
        if (Error_Msg === 'NO_ERR')
        {
            var premium_breakup = this.get_const_premium_breakup();
            var objPremiumService = objResponseJson['data'][0];
            var plan_code = objResponseJson['data'][0]['selected_plan'];
            premium_breakup['final_premium'] = Math.round(objPremiumService['total_premium']);
            premium_breakup['tax']['CGST'] = objPremiumService['cgst_amt'];
            premium_breakup['tax']['SGST'] = objPremiumService['sgst_amt'];
            premium_breakup['service_tax'] = premium_breakup['tax']['CGST'] + premium_breakup['tax']['SGST'];
            premium_breakup['net_premium'] = objPremiumService['gross_premium'];


            if (this.lm_request['travelling_to_area'] === 'Asia') {
                var si = {'Silver': '$50000', 'Gold': '$200000'};
                premium_breakup['travel_insurance_si'] = si[plan_code];
            } else {
                if (this.lm_request['trip_type'] === 'SINGLE') {
                    var si = {'Silver': '$50000', 'Silver Plus': '$100000', 'Gold': '$250000', 'Platinum': '$500000', 'Senior': '$50000', 'Silver with Family': '$50000', 'Silver Plus with Family': '$100000'};
                } else if (this.lm_request['trip_type'] === 'MULTI') {
                    var si = {'Annual Gold': '$250000', 'Annual Platinum': '$500000'};
                }
                premium_breakup['travel_insurance_si'] = si[plan_code] ? si[plan_code] : '';
            }
            objServiceHandler.Premium_Breakup = premium_breakup;
        }
        objServiceHandler.Error_Msg = Error_Msg;
        objServiceHandler.Insurer_Transaction_Identifier = objPremiumService["quote_no"];
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
};
TataAIGTravel.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('status') && objResponseJson.status === 200 && objResponseJson.hasOwnProperty('message_txt') && objResponseJson.message_txt.toLowerCase().includes("success")) {

        } else {
            Error_Msg = objResponseJson.hasOwnProperty('message_txt') ? objResponseJson.message_txt : objResponseJson;
        }

        if (Error_Msg === 'NO_ERR') {
            let payment_data = objResponseJson['data'];
            let proposalAmt = payment_data[0]['total_premium'];
            let objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], proposalAmt);
            var Customer = {};
            Customer = {
                'insurer_customer_identifier': objResponseJson["data"][0]["payment_id"],
                'insurer_customer_identifier_2': objResponseJson["data"][0]["proposal_no"]
            };
            if (objPremiumVerification.Status) {
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson["data"][0]["proposal_no"];
                objServiceHandler.Customer = Customer;
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
TataAIGTravel.prototype.proposal_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    try {
        console.log('Start', this.constructor.name, 'Initiate payment_response_handler', objResponseJson);
        var objResponseData = objResponseJson['data'];
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('status') && objResponseJson.status === 200 && objResponseJson.hasOwnProperty('message_txt') && objResponseJson.message_txt.toLowerCase().includes("success")) {

        } else {
            Error_Msg = objResponseJson.hasOwnProperty('message_txt') ? objResponseJson.message_txt : objResponseJson;
        }

        if (Error_Msg === 'NO_ERR') {
            let payment_data = JSON.parse(objResponseJson['data']);
            let pg_data = {
                pgiRequest: payment_data.pgiRequest
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_url = payment_data.url;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
        }
        objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request['insurer_customer_identifier_2'];
        objServiceHandler.Error_Msg = Error_Msg;
    } catch (e) {
        objServiceHandler.Error_Msg = 'LM::' + e.stack;
        console.error('Exception', this.constructor.name, 'proposal_response_handler', e.stack);
    }
    return objServiceHandler;
};
TataAIGTravel.prototype.pg_response_handler = function () {
    console.error('TataPgStart', this.constructor.name, 'pg_response_handler');
    try {
        let objInsurerProduct = this;
        var date = new Date();
        var Pay_Date = moment(date).format('DD-MM-YYYY');

        var objResponse = (objInsurerProduct.hasOwnProperty('const_payment_response') && objInsurerProduct.const_payment_response.hasOwnProperty('pg_get')) ? objInsurerProduct.const_payment_response.pg_get : false;
        console.error('TataPgdata', this.constructor.name, objResponse);

        if (objResponse) {
            var policy_status = (objResponse.hasOwnProperty('policy_no') && objResponse.policy_no !== "null") ? objResponse['policy_no'] : null;
            var proposal_status = (objResponse.hasOwnProperty('proposal_no') && objResponse.proposal_no !== "null") ? objResponse['proposal_no'] : null;

            if (policy_status !== null && proposal_status !== null) {
                console.error('TataPgStart', this.constructor.name, 'success');
                if (objResponse['policy_no'] !== "" && objResponse['policy_no'] !== null && objResponse['proposal_no'] !== "" && objResponse['proposal_no'] !== null) {
                    this.const_policy.pg_status = 'SUCCESS';
                    this.const_policy.transaction_status = 'SUCCESS';
                    this.const_policy.policy_number = objResponse['policy_no'];
                    this.const_policy.pg_reference_number_1 = objResponse['proposal_no'];
                    this.const_policy.pg_reference_number_2 = Pay_Date;
                    this.const_policy.transaction_id = objResponse['proposal_no'];
                    this.const_policy.transaction_amount = objInsurerProduct.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
                } else {
                    this.const_policy.pg_status = 'PAYPASS';
                    this.const_policy.transaction_status = 'PAYPASS';
                    this.const_policy.policy_number = "";
                    this.const_policy.pg_reference_number_1 = objResponse['proposal_no'];
                    this.const_policy.pg_reference_number_2 = Pay_Date;
                }
            } else {
                console.error('TataPgStart', this.constructor.name, 'fail');
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
                this.const_policy.policy_number = "";
                this.const_policy.pg_reference_number_1 = objResponse['proposal_no'];
                this.const_policy.pg_reference_number_2 = Pay_Date;
            }
        } else {
            console.error('TataPgStart', this.constructor.name, 'fail');
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
            this.const_policy.policy_number = "";
            this.const_policy.pg_reference_number_1 = objResponse['proposal_no'];
            this.const_policy.pg_reference_number_2 = Pay_Date;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
TataAIGTravel.prototype.verification_response_handler = function (objResponseJson) {
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
        if (this.const_policy.pg_status === 'FAIL') {

        }
        if (objInsurerProduct.const_policy.pg_status === 'SUCCESS') {
            //Recon API 
            console.error('TataVerStart', this.constructor.name, 'ver_success');
            if (objResponseJson.hasOwnProperty('status') && objResponseJson.status === 200 && objResponseJson.hasOwnProperty('message_txt') && objResponseJson.message_txt.toLowerCase().includes("success")) {
            } else {
                Error_Msg = objResponseJson.hasOwnProperty('message_txt') ? objResponseJson.message_txt : objResponseJson;
            }

            if (Error_Msg === 'NO_ERR') {
                if (objInsurerProduct.const_policy.policy_number !== '' && objResponseJson.hasOwnProperty("data") && objResponseJson.data && objResponseJson.data.hasOwnProperty("encrypted_policy_id") && objResponseJson.data.encrypted_policy_id) {
                    console.error('TataVerStart', this.constructor.name, 'policy_number', objInsurerProduct.const_policy['policy_number']);
                    this.const_policy.transaction_status = 'SUCCESS';
                    this.const_policy.policy_id = objResponseJson["data"]["policy_id"];
                    this.const_policy.encrypted_policy_id = objResponseJson["data"]["encrypted_policy_id"];
                    this.const_policy.encrypted_policy_no = objResponseJson["data"]["encrypted_policy_no"];

                    var pdf_file_name = this.constructor.name + '_Travel_' + objInsurerProduct.const_policy['policy_number'].replaceAll('/', '') + '.pdf';
                    pdf_file_name = this.constructor.name + '_Travel_' + objInsurerProduct.const_policy['policy_number'].replaceAll('-', '') + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    //var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path;

                    var args = {
                        data: {
                            "search_reference_number": objInsurerProduct.lm_request['search_reference_number'],
                            "api_reference_number": objInsurerProduct.lm_request['api_reference_number'],
                            "policy_number": objInsurerProduct.const_policy.policy_number,
                            "policyId": objResponseJson["data"]["policy_id"],
                            "encrypted_policyId": objResponseJson["data"]["encrypted_policy_id"],
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
                    this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);

                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
                this.const_policy.policy_number.transaction_identifier = objInsurerProduct.const_policy.transaction_id;
                objServiceHandler.Insurer_Transaction_Identifier = objInsurerProduct.const_policy.transaction_id;
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }

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
TataAIGTravel.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    try {
        var objInsurerProduct = this;
        objInsurerProduct.pdf_attempt++;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.post(url, args, function (data, response) {
            if (data.Error_Code !== '' || true) {
                if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                    var sleep = require('system-sleep');
                    sleep(600000);
                    objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
                }
            }
        });
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call', ex);
    }
};
TataAIGTravel.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (objResponseJson.hasOwnProperty('byteStream') && objResponseJson.byteStream && objResponseJson.hasOwnProperty('download') && objResponseJson.download) {
        } else {
            Error_Msg = objResponseJson.hasOwnProperty('message_txt') ? objResponseJson.message_txt : objResponseJson;
        }

        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.byteStream) {
                var product_name = 'Travel';
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'].replaceAll('/', '') + '.pdf';
                pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'].replaceAll('-', '') + '.pdf';
                var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
                var binary = new Buffer(objResponseJson.byteStream, 'base64');
                var sleep = require('system-sleep');
                sleep(10000);
                fs.writeFileSync(pdf_sys_loc, binary);
                policy.policy_url = pdf_web_path_portal;
                policy.pdf_status = 'SUCCESS';
            } else {
                policy.pdf_status = 'FAIL';
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.transaction_status = 'PAYPASS';
        }

        this.const_policy = policy;
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
TataAIGTravel.prototype.get_product_details = function (planCd, memberage) {
    var plans = [
//        Travel Guard
        {'area': 'WWExUSCanada', 'plan_code_txt': "Gold", 'plan_code': 'G', "plan_id": 1101, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WorldWide', 'plan_code_txt': "Gold", 'plan_code': 'G', "plan_id": 1101, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Platinum", 'plan_code': 'P', "plan_id": 1102, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WorldWide', 'plan_code_txt': "Platinum", 'plan_code': 'P', "plan_id": 1102, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Silver", 'plan_code': 'S', "plan_id": 1103, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WorldWide', 'plan_code_txt': "Silver", 'plan_code': 'S', "plan_id": 1103, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Silver with family", 'plan_code': 'SWF', "plan_id": 1104, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WorldWide', 'plan_code_txt': "Silver with family", 'plan_code': 'SWF', "plan_id": 1104, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Silver Plus", 'plan_code': 'SP', "plan_id": 1105, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WorldWide', 'plan_code_txt': "Silver Plus", 'plan_code': 'SP', "plan_id": 1105, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Silver Plus with family", 'plan_code': 'SPWF', "plan_id": 1106, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WorldWide', 'plan_code_txt': "Silver Plus with family", 'plan_code': 'SPWF', "plan_id": 1106, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Senior", "plan_id": 1107, 'plan_code': 'Senior', 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 71, 'max_age': 86, 'selected_product': 'Travel Guard'},
        {'area': 'WorldWide', 'plan_code_txt': "Senior", "plan_id": 1107, 'plan_code': 'Senior', 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 71, 'max_age': 86, 'selected_product': 'Travel Guard'},
//multi 
        {'area': 'WorldWide', 'plan_code_txt': "Annual Gold", 'plan_code': 'AG', "plan_id": 1108, 'max_duration': '30', 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 30", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WorldWide', 'plan_code_txt': "Annual Gold", 'plan_code': 'AG', "plan_id": 1108, 'max_duration': '45', 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 45", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard'},

        {'area': 'WWExUSCanada', 'plan_code_txt': "Annual Gold", 'plan_code': 'AG', "plan_id": 1108, 'max_duration': '30', 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 30", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Annual Gold", 'plan_code': 'AG', "plan_id": 1108, 'max_duration': '45', 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 45", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard'},

        {'area': 'WorldWide', 'plan_code_txt': "Annual Platinum", 'plan_code': 'AP', "plan_id": 1109, 'max_duration': '30', 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 30", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WorldWide', 'plan_code_txt': "Annual Platinum", 'plan_code': 'AP', "plan_id": 1109, 'max_duration': '45', 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 45", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard'},

        {'area': 'WWExUSCanada', 'plan_code_txt': "Annual Platinum", 'plan_code': 'AP', "plan_id": 1109, 'max_duration': '30', 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 30", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Annual Platinum", 'plan_code': 'AP', "plan_id": 1109, 'max_duration': '45', 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 45", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard'},
//Travel Guard Without Sublimit

        {'area': 'WWExUSCanada', 'plan_code_txt': "Gold", 'plan_code': 'G-SL', "plan_id": 1112, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 56, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WorldWide', 'plan_code_txt': "Gold", 'plan_code': 'G-SL', "plan_id": 1112, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 56, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Platinum", 'plan_code': 'P-SL', "plan_id": 1113, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 56, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WorldWide', 'plan_code_txt': "Platinum", 'plan_code': 'P-SL', "plan_id": 1113, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 56, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Silver", 'plan_code': 'S-SL', "plan_id": 1114, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 56, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WorldWide', 'plan_code_txt': "Silver", 'plan_code': 'S-SL', "plan_id": 1114, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 56, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Silver with family", 'plan_code': 'SWF-SL', "plan_id": 1115, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 56, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WorldWide', 'plan_code_txt': "Silver with family", 'plan_code': 'SWF-SL', "plan_id": 1115, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 56, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Silver Plus", 'plan_code': 'SP-SL', "plan_id": 1116, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 56, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WorldWide', 'plan_code_txt': "Silver Plus", 'plan_code': 'SP-SL', "plan_id": 1116, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 56, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Silver Plus with family", 'plan_code': 'SPWF-SL', "plan_id": 1117, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding AmerUSA/Canadaicas", 'min_age': 56, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WorldWide', 'plan_code_txt': "Silver Plus with family", 'plan_code': 'SPWF-SL', "plan_id": 1117, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 56, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Senior", 'plan_code': 'Senior-SL', 'trip_type': "SINGLE", "plan_id": 1118, 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 71, 'max_age': 86, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WorldWide', 'plan_code_txt': "Senior", 'plan_code': 'Senior-SL', 'trip_type': "SINGLE", "plan_id": 1118, 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 71, 'max_age': 86, 'selected_product': 'Travel Guard Without Sublimit'},
//multi 
        {'area': 'WorldWide', 'plan_code_txt': "Annual Gold", 'plan_code': 'AG-SL', 'max_duration': '30', "plan_id": 1119, 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 30", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WorldWide', 'plan_code_txt': "Annual Gold", 'plan_code': 'AG-SL', 'max_duration': '45', "plan_id": 1119, 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 45", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},

        {'area': 'WWExUSCanada', 'plan_code_txt': "Annual Gold", 'plan_code': 'AG-SL', 'max_duration': '30', "plan_id": 1119, 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 30", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Annual Gold", 'plan_code': 'AG-SL', 'max_duration': '45', "plan_id": 1119, 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 45", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},

        {'area': 'WorldWide', 'plan_code_txt': "Annual Platinum", 'plan_code': 'AP-SL', 'max_duration': '30', "plan_id": 1120, 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 30", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WorldWide', 'plan_code_txt': "Annual Platinum", 'plan_code': 'AP-SL', 'max_duration': '45', "plan_id": 1120, 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 45", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},

        {'area': 'WWExUSCanada', 'plan_code_txt': "Annual Platinum", 'plan_code': 'AP-SL', 'max_duration': '30', "plan_id": 1120, 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 30", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
        {'area': 'WWExUSCanada', 'plan_code_txt': "Annual Platinum", 'plan_code': 'AP-SL', 'max_duration': '45', "plan_id": 1120, 'trip_type': "MULTI", 'GeneralPurpose': "AN - Worldwide 1 - 45", 'min_age': 19, 'max_age': 71, 'selected_product': 'Travel Guard Without Sublimit'},
//Asia Guard

        {'area': 'Asia', 'plan_code_txt': "Gold", 'plan_code': 'G-Asia', "plan_id": 1110, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Excluding USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Asia Guard'},
        {'area': 'Asia', 'plan_code_txt': "Silver", 'plan_code': 'S-Asia', "plan_id": 1111, 'trip_type': "SINGLE", 'GeneralPurpose': "Worldwide Including USA/Canada", 'min_age': 0.5, 'max_age': 71, 'selected_product': 'Asia Guard'}
    ];
    if (this.lm_request['trip_type'] === "SINGLE") {
        var index = plans.findIndex(x => x.area === this.lm_request['travelling_to_area'] && x.trip_type === this.lm_request['trip_type'] && x.plan_code === planCd && x.min_age <= memberage && x.max_age > memberage);
        this.prepared_request['___selected_zone___'] = index === -1 ? "" : plans[index]['GeneralPurpose'];
        this.processed_request['___selected_zone___'] = index === -1 ? "" : this.prepared_request['___selected_zone___'];

        this.prepared_request['___selected_product___'] = index === -1 ? "" : plans[index]['selected_product'];
        this.processed_request['___selected_product___'] = index === -1 ? "" : this.prepared_request['___selected_product___'];

        this.prepared_request['___plan_code_txt___'] = index === -1 ? "" : plans[index]['plan_code_txt'];
        this.processed_request['___plan_code_txt___'] = index === -1 ? "" : this.prepared_request['___plan_code_txt___'];
    } else {
        var index = plans.findIndex(x => x.area === this.lm_request['travelling_to_area'] && x.trip_type === this.lm_request['trip_type'] && x.plan_code === planCd && x.max_duration === this.lm_request['maximum_duration']);
        this.prepared_request['___selected_zone___'] = index === -1 ? "" : plans[index]['GeneralPurpose'];
        this.processed_request['___selected_zone___'] = index === -1 ? "" : this.prepared_request['___selected_zone___'];

        this.prepared_request['___selected_product___'] = index === -1 ? "" : plans[index]['selected_product'];
        this.processed_request['___selected_product___'] = index === -1 ? "" : this.prepared_request['___selected_product___'];

        this.prepared_request['___plan_code_txt___'] = index === -1 ? "" : plans[index]['plan_code_txt'];
        this.processed_request['___plan_code_txt___'] = index === -1 ? "" : this.prepared_request['___plan_code_txt___'];
    }
};
TataAIGTravel.prototype.is_valid_plan = function (lm_request, planCode) {
    var total_days;
    total_days = moment(lm_request['policy_end_date']).diff(moment(lm_request['policy_start_date']), 'days') + 1; // getting two dates difference
    if (lm_request['travelling_to_area'] === 'Europe' || lm_request['travelling_to_area'] === 'Africa') {
        return false;
    } else if (lm_request['travelling_to_area'] === 'Asia' && ["G-Asia", "S-Asia"].indexOf(planCode) === -1) {
        return false;
    } else if (lm_request['travelling_to_area'] === 'Asia' && (lm_request['member_1_age'] <= 19 || lm_request['member_1_age'] > 71)) {
        return false;
    } else if (lm_request['travelling_to_area'] === 'WWExUSCanada' && ["G-Asia", "S-Asia"].indexOf(planCode) > -1) {
        return false;
    } else if (lm_request['travelling_to_area'] === 'Asia' && total_days > 14) {
        return false;
    } else if (lm_request['trip_type'] === "SINGLE" && ["AG", "AP", "AG-SL", "AP-SL"].indexOf(planCode) > -1) {
        return false;
    } else if ((lm_request['travelling_to_area'] === 'WorldWide') && ["G-Asia", "S-Asia"].indexOf(planCode) > -1) {
        return false;
    } else if (lm_request['trip_type'] === "MULTI" && ['60', '90'].includes(lm_request['maximum_duration'])) {
        return false;
    } else if (lm_request['travel_insurance_type'] === "individual" && ["SWF", "SPWF"].indexOf(planCode) > -1) {
        return false;
    } else if (lm_request['travel_insurance_type'] === "floater" && ["SWF", "SPWF"].indexOf(planCode) === -1) {
        return false;
    } else if (lm_request['trip_type'] === "MULTI" && ["AG", "AP", "AG-SL", "AP-SL"].indexOf(planCode) === -1) {
        return false;
    } else if (lm_request['trip_type'] === "SINGLE" && ["AG", "AP", "AG-SL", "AP-SL"].indexOf(planCode) > -1) {
        return false;
    } else if (lm_request['trip_type'] === "MULTI" && ["AG", "AG-SL", "AP", "AP-SL"].includes(planCode) && ['60', '90'].includes(lm_request['maximum_duration'])) {
        return false;
    } else if (lm_request['trip_type'] === "MULTI" && ["AG", "AP"].includes(planCode) && (lm_request['member_1_age'] <= 19 || lm_request['member_1_age'] > 71)) {
        return false;
    } else if (lm_request['trip_type'] === "MULTI" && ["AG-SL", "AP-SL"].includes(planCode) && (lm_request['member_1_age'] <= 56 || lm_request['member_1_age'] > 71)) {
        return false;
    } else if (lm_request['member_1_age'] < 70 && ["Senior", "Senior-SL"].indexOf(planCode) > -1) {
        return false;
    } else if (lm_request['trip_type'] === "SINGLE" && ["G", "P", "S", "SP", "SWF", "SPWF"].indexOf(planCode) > -1 && lm_request['member_1_age'] > 71) {
        return false;
    } else if (lm_request['trip_type'] === "SINGLE" && ["G-SL", "P-SL", "S-SL", "SP-SL", "SWF-SL", "SPWF-SL"].indexOf(planCode) > -1 && (lm_request['member_1_age'] <= 56 || lm_request['member_1_age'] > 71)) {
        return false;
    } else {
        return true;
    }
};
TataAIGTravel.prototype.encrypt = function (text) {
    var cipher = crypto.createCipher("aes-128-ecb", "#g%t8&(k$^");
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};
TataAIGTravel.prototype.premium_breakup_schema = {
    "net_premium": "NetPremium",
    "CGST": "CGST",
    "SGST": "SGST",
    "service_tax": "",
    "final_premium": "FinalPremium"
};
module.exports = TataAIGTravel;
