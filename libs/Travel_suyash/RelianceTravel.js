/* Author: Revati Ghadge
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
function RelianceTravel() {
}
util.inherits(RelianceTravel, Travel);
RelianceTravel.prototype.lm_request_single = {};
RelianceTravel.prototype.insurer_integration = {};
RelianceTravel.prototype.insurer_addon_list = [];
RelianceTravel.prototype.insurer = {};
RelianceTravel.prototype.insurer_date_format = 'dd/MM/yyyy';
//RelianceTravel.prototype.const_insurer_suminsured = [300000, 500000, 600000, 900000, 1000000, 1500000, 5000000, 10000000];


RelianceTravel.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
RelianceTravel.prototype.insurer_product_field_process_pre = function () {
    if (this.lm_request['method_type'] === 'Premium') {
        this.get_product_details(this.prepared_request['Plan_Code']);
        this.get_cover_id();
        this.prepared_request['member_1_gender2'] = this.lm_request['member_1_gender'] === "M" ? "Male" : "Female";
        this.processed_request['___member_1_gender2___'] = this.prepared_request['member_1_gender2'];
        if (this.lm_request['adult_count'] === 1) {
            var start_tag = "<!--SpouseDetail_Start-->";
            var end_tag = "<!--SpouseDetail_End-->";
            let addn_block = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
            this.method_content = this.method_content.replace(addn_block, '');
        }

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--KidsDetail_Start-->', '<!--KidsDetail_End-->', true);
        var txt_replace_with = "";
        if (this.lm_request['child_count'] > 0) {
            var member = 1;
            for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            }
            this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        } else {
            var start_tag = "<!--KidsDetail_Start-->";
            var end_tag = "<!--KidsDetail_End-->";
            let addn_block = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
            this.method_content = this.method_content.replace(addn_block, '');
        }
        var start_tag = "<Is" + this.prepared_request['Plan_Code'] + "Plan>";
        var end_tag = "</Is" + this.prepared_request['Plan_Code'] + "Plan>";
        let plan_tag = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
        let changed_tag = plan_tag.replace("false", "true");
        this.method_content = this.method_content.replace(plan_tag, changed_tag);
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        this.processed_request['___has_pemc___'] = false;
        this.processed_request['___critical_ped___'] = false;
        this.prepared_request['pemc_ids'] = "";
        this.get_product_details(this.prepared_request['dbmaster_plan_code']);
        this.get_cover_id();
        this.prepared_request['gender2'] = this.lm_request['gender'] === "M" ? "Male" : "Female";
        this.processed_request['___gender2___'] = this.prepared_request['gender2'];
        this.prepared_request['member_1_gender2'] = this.lm_request['member_1_gender'] === "M" ? "Male" : "Female";
        this.processed_request['___member_1_gender2___'] = this.prepared_request['member_1_gender2'];
        var member = 1;
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            if (this.lm_request['member_' + member + '_other_diseases'] !== "") {
                this.processed_request['___has_pemc___'] = true;
                this.prepared_request['pemc_ids'] = '307';
                this.processed_request['___member_' + member + '_takes_meds___'] = this.lm_request['member_' + member + '_takes_meds'];
                this.processed_request['___member_' + member + '_other_diseases___'] = this.lm_request['member_' + member + '_other_diseases'];
                this.processed_request['___member_' + member + '_suffering_since___'] = this.lm_request['member_' + member + '_suffering_since'];
            } else {
                this.processed_request['___member_' + member + '_takes_meds___'] = false;
                this.processed_request['___member_' + member + '_other_diseases___'] = '';
                this.processed_request['___member_' + member + '_suffering_since___'] = '';
            }
            this.get_member_relation(member);
            if (this.lm_request['member_' + member + '_ped'] !== '') {
                this.processed_request['___has_pemc___'] = true;
                this.get_pemc_details(this.lm_request['member_' + member + '_ped']);
            }
        }
        if (this.lm_request['adult_count'] === 1) {
            var start_tag = "<!--SpouseDetail_Start-->";
            var end_tag = "<!--SpouseDetail_End-->";
            let addn_block = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
            this.method_content = this.method_content.replace(addn_block, '');
        }

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--KidsDetail_Start-->', '<!--KidsDetail_End-->', true);
        var txt_replace_with = "";
        if (this.lm_request['child_count'] > 0) {
            for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                if (this.lm_request['member_' + member + '_other_diseases'] !== "") {
                    this.processed_request['___has_pemc___'] = true;
                    this.prepared_request['pemc_ids'] = '307';
                    this.processed_request['___member_' + member + '_takes_meds___'] = this.lm_request['member_' + member + '_takes_meds'];
                    this.processed_request['___member_' + member + '_other_diseases___'] = this.lm_request['member_' + member + '_other_diseases'];
                    this.processed_request['___member_' + member + '_suffering_since___'] = this.lm_request['member_' + member + '_suffering_since'];
                } else {
                    this.processed_request['___member_' + member + '_takes_meds___'] = false;
                    this.processed_request['___member_' + member + '_other_diseases___'] = '';
                    this.processed_request['___member_' + member + '_suffering_since___'] = '';
                }
                this.get_member_relation(member);
                if (this.lm_request['member_' + member + '_ped'] !== '') {
                    this.processed_request['___has_pemc___'] = true;
                    this.get_pemc_details(this.lm_request['member_' + member + '_ped']);
                }
            }
            this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        } else {
            var start_tag = "<!--KidsDetail_Start-->";
            var end_tag = "<!--KidsDetail_End-->";
            let addn_block = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
            this.method_content = this.method_content.replace(addn_block, '');
        }
        var start_tag = "<Is" + this.prepared_request['dbmaster_plan_code'] + "Plan>";
        var end_tag = "</Is" + this.prepared_request['dbmaster_plan_code'] + "Plan>";
        let plan_tag = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
        let changed_tag = plan_tag.replace("false", "true");
        this.method_content = this.method_content.replace(plan_tag, changed_tag);
        for (var key in this.lm_request) {
            if (key.indexOf('_type') > -1 && key.indexOf('question_') > -1) {
                var ques_detail = key.replace('_type', '_details');
                if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                    if (this.lm_request[ques_detail] === false) {
                        this.prepared_request[ques_detail] = false;
                        this.processed_request['___' + ques_detail + '___'] = false;
                    } else {
                        this.prepared_request[ques_detail] = true;
                        this.processed_request['___' + ques_detail + '___'] = true;
                    }
                } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                    this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                    this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                }
            }
        }
        this.processed_request['___pemc_ids___'] = this.prepared_request['pemc_ids'];
    }
    this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
    console.log(this.method_content);
};
RelianceTravel.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
    var obj_response_handler;
    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
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
RelianceTravel.prototype.insurer_product_field_process_post = function () {

};
RelianceTravel.prototype.insurer_product_api_post = function () {

};
RelianceTravel.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
//        Example POST method invocation 
        var Client = require('node-rest-client').Client;
        var client = new Client();
//        set content-type header and data as json in args parameter 
        var args = {
            data: docLog.Insurer_Request,
            headers: {"Content-Type": "application/xml"}
        };
        if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
            client.post(specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action, args, function (data, response) {
//                parsed response body as js object 
                console.log(data);
                var objResponseFull = {
                    'err': null,
                    'result': data,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        } else if (specific_insurer_object.method.Method_Calling_Type === 'GET') {
            function jsonToQueryString(json) {
                return '?' +
                        Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                            encodeURIComponent(json[key]);
                }).join('&');
            }
            var qs = jsonToQueryString(args.data);
            client.get(specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action + qs, function (data, response) {
//                parsed response body as js object 
                console.log(data);
                var objResponseFull = {
                    'err': null,
                    'result': null,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
RelianceTravel.prototype.premium_response_handler = function (objResponseJson) {
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null
        };
        var Error_Msg = 'NO_ERR';
        //check error start
        if (objResponseJson.hasOwnProperty('TravelDetails')) {
            var objPremiumService = objResponseJson['TravelDetails'];
            if (objPremiumService.hasOwnProperty('ErrorMessages')) {
                if (objPremiumService['ErrorMessages'] === '') {
                } else {
                    Error_Msg = objPremiumService['ErrorMessages'];
                }
            }
        } else {
            Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
        }

        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.get_const_premium_breakup();
            var objInsurerPremium = {};
            objPremiumService = objPremiumService['Premium'];
            var plan_id = objResponseJson['TravelDetails']['RiskDetails']['PlanName'];
            for (var key in objPremiumService) {
                if (typeof objPremiumService[key] !== 'Object' && objPremiumService[key] !== null) {
                    objInsurerPremium[key] = this.round2Precision(objPremiumService[key] - 0);
                }
            }
            if (objPremiumService.hasOwnProperty('LstTaxComponentDetails') && objPremiumService['LstTaxComponentDetails'].hasOwnProperty('TaxComponent')) {
                var service_component = objPremiumService['LstTaxComponentDetails']['TaxComponent'];
                objInsurerPremium[service_component[0]['TaxName']] = service_component[0]['Amount'] - 0;
                objInsurerPremium[service_component[1]['TaxName']] = service_component[1]['Amount'] - 0;
            }
            for (var key in this.premium_breakup_schema) {
                if (typeof this.premium_breakup_schema[key] === 'object') {
                    for (var subkey in this.premium_breakup_schema[key]) {
                        if (this.premium_breakup_schema[key][subkey] !== '' && this.premium_breakup_schema[key][subkey] !== 0) {
                            premium_breakup[key][subkey] = objInsurerPremium[this.premium_breakup_schema[key][subkey]];
                        }
                    }
                } else if (this.premium_breakup_schema[key] !== '' && this.premium_breakup_schema[key] !== 0) {
                    premium_breakup[key] = objInsurerPremium[this.premium_breakup_schema[key]];
                }
            }
            premium_breakup['service_tax'] = premium_breakup['tax']['CGST'] + premium_breakup['tax']['SGST'];
            premium_breakup['travel_insurance_si'] = this.prepared_request['travel_insurance_si_' + plan_id];
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['TraceID'];
        }

        objServiceHandler.Error_Msg = Error_Msg;
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
RelianceTravel.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('TravelDetails')) {
            var objPremiumService = objResponseJson['TravelDetails'];
            if (objPremiumService.hasOwnProperty('Policy'))
            {
                if (objPremiumService['Policy'].hasOwnProperty('ProposalNo') && objPremiumService['Policy']['ProposalNo'] !== '') {
                } else {
                    Error_Msg = JSON.stringify(objResponseJson['TravelDetails']['ErrorMessages']);
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson['TravelDetails']['ErrorMessages']);
            }
        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }

        if (this.processed_request['___question_901_details___'] === false) {
            Error_Msg = "This policy can be availed only by Citizen of India";
        } else if (this.processed_request['___critical_ped___'] === true) {
            Error_Msg = "Sorry, we cannot issue this policy online. There is a special underwriting approval required for the traveler in the given pre-existing diseases";
        }

        if (Error_Msg === 'NO_ERR') {
            var proposalAmt = Math.round(objResponseJson['TravelDetails']['Premium']['FinalPremium']);
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], proposalAmt);
            if (objPremiumVerification.Status) {
                var pg_data = {
                    'ProposalNo': objResponseJson['TravelDetails']['Policy']['ProposalNo'],
                    'UserID': this.prepared_request['insurer_integration_service_user'],
                    'ProposalAmount': proposalAmt,
                    'PaymentType': '1',
                    'Responseurl': this.const_payment.pg_ack_url,
					'CKYC': this.processed_request['___kyc_no___'],
                    'IsDocumentUpload': false,
                    'PanNo': this.processed_request['___pan___'],
                    'IsForm60': false
};
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'GET';
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['TravelDetails']['Policy']['ProposalNo'];
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
RelianceTravel.prototype.pg_response_handler = function () {
    try {

        //Success -> Output=1|9202272311012647|C531031700163|0|CCAvenue|R31031700154|Success|
        //Failure -> Output=0|| C514081505462|0|Billdesk|R311027381|Failure|authentication failed from bank
        //MismatchPremium -> Output=0|||1|CCavenue|R06041700079||Response Amount is not matching with the Premium to be paid.


        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get['Output'];
        var response = output.split('|');
        this.const_policy.transaction_id = response[2];
        if (output.indexOf('Success') > -1 && response[1] !== '') {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['ProposalAmount'];
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = response[1];
            this.const_policy.pg_reference_number_1 = response[5];
        } else if (output.indexOf('Success') > -1 && response[1] === '') {
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
};
RelianceTravel.prototype.verification_response_handler = function (objResponseJson) {
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

            var product_name = 'Travel';
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            if (config.environment.name === 'Production') {
                this.const_policy.policy_url = pdf_web_path_portal;
                var insurer_pdf_url = "https://rzonews.reliancegeneral.co.in:91/api/service/generatepolicyschedule/GeneratePolicyschedule?policyNo=" + this.const_policy.policy_number;
                try {
                    var http = require('https');
                    var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                    http.get(insurer_pdf_url, function (response) {
                        response.pipe(file_horizon);
                    });
                } catch (ep) {
                    console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
                }
            }
        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
};
RelianceTravel.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start RelianceTravel');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in RelianceTravel " + gender);
    if (this.lm_request["relation"] === '321' || this.lm_request["relation"] === '322') {
        this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? '319' : '1255';
        this.prepared_request['member_' + i + '_nominee_rel'] = this.lm_request['member_1_gender'] === 'M' ? '321' : '322';
    } else if (this.lm_request["relation"] === '319' || this.lm_request["relation"] === '1255') {
        this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? '321' : '322';
        this.prepared_request['member_' + i + '_nominee_rel'] = this.lm_request['member_1_gender'] === 'M' ? '319' : '1255';
    } else if (this.lm_request["relation"] === '320') {
        this.prepared_request['member_' + i + '_relation'] = '320';
        this.prepared_request['member_' + i + '_nominee_rel'] = '320';
        if (i >= 3) {
            this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? '321' : '322';
            this.prepared_request['member_' + i + '_nominee_rel'] = this.lm_request['member_1_gender'] === 'M' ? '319' : '1255';
        }
    } else if (this.lm_request["relation"] === '345' || this.lm_request["relation"] === '') {
        if (i >= 3) {
            this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? '321' : '322';
            this.prepared_request['member_' + i + '_nominee_rel'] = this.lm_request['member_1_gender'] === 'M' ? '319' : '1255';
        } else if (i === 1) {
            this.prepared_request['member_' + i + '_relation'] = '345';
            this.prepared_request['member_' + i + '_nominee_rel'] = this.lm_request["nominee_relation"];
        } else if (i === 2) {
            this.prepared_request['member_' + i + '_relation'] = '320';
            this.prepared_request['member_' + i + '_nominee_rel'] = '320';
        }
    }
    this.processed_request['___member_' + i + '_relation___'] = this.prepared_request['member_' + i + '_relation'];
    this.processed_request['___member_' + i + '_nominee_rel___'] = this.prepared_request['member_' + i + '_nominee_rel'];
    console.log(this.constructor.name, 'get_member_relation', 'End RelianceTravel');
};
RelianceTravel.prototype.get_pemc_details = function (pedArr) {
    for (let p = 0; p < pedArr.length; p++) {
        if (pedArr[p]['name'].includes("Other")) {
        } else {
            this.processed_request['___critical_ped___'] = true;
        }
    }
};
RelianceTravel.prototype.get_product_details = function (planCd) {
    var plans = [
        {'area': 'Asia', 'plan_id': 2820, 'cover_type': 'individual', 'trip_type': "SINGLE"},
        {'area': 'Europe', 'plan_id': 2833, 'cover_type': 'individual', 'trip_type': "SINGLE"},
        {'area': 'WorldWide', 'plan_id': 2817, 'cover_type': 'individual', 'trip_type': "SINGLE"},
        {'area': 'WWExUSCanada', 'plan_id': 2817, 'cover_type': 'individual', 'trip_type': "SINGLE"},
        {'area': 'WorldWide', 'plan_id': 2818, 'cover_type': 'floater', 'trip_type': "SINGLE"},
        {'area': 'WWExUSCanada', 'plan_id': 2818, 'cover_type': 'floater', 'trip_type': "SINGLE"},
        {'area': 'WorldWide', 'plan_id': 2837, 'cover_type': 'individual', 'trip_type': "MULTI"},
        {'area': 'WWExUSCanada', 'plan_id': 2837, 'cover_type': 'individual', 'trip_type': "MULTI"}
    ];
    var index = plans.findIndex(x => x.area === this.lm_request['travelling_to_area'] && x.cover_type === this.lm_request['travel_insurance_type']
                && x.trip_type === this.lm_request['trip_type']);
    this.processed_request['___product_code___'] = index === -1 ? "" : plans[index]['plan_id'];
    this.processed_request['___isUSACanada___'] = index > -1 && plans[index]['area'] === "WorldWide" ? true : false;
    if (this.lm_request['trip_type'] === "MULTI") {
        this.prepared_request['travel_insurance_si_' + planCd] = (planCd === "Standard") ? "$100000" : (planCd === "Plus") ? "$250000" : "$500000";
        this.processed_request['___travel_days___'] = 365;
        this.processed_request['___max_days___'] = this.lm_request['maximum_duration'];
    } else {
        if (this.lm_request['travelling_to_area'] === 'Asia') {
            this.prepared_request['travel_insurance_si_' + planCd] = (planCd === "Standard") ? "$25000" : "$30000";
        } else if (this.lm_request['travelling_to_area'] === 'Europe') {
            this.prepared_request['travel_insurance_si_' + planCd] = (planCd === "Standard") ? "€50000" : "€30000";
        } else {
            if (planCd === "Gold") {
                this.prepared_request['travel_insurance_si_' + planCd] = (this.lm_request['travel_insurance_type'] === "floater") ? "$100000" : "$250000";
            } else {
                this.prepared_request['travel_insurance_si_' + planCd] = (planCd === "Standard") ? "$50000" : (planCd === "Silver") ? "$100000" : "$500000";
            }
        }
        this.processed_request['___travel_days___'] = moment(this.lm_request['policy_end_date']).diff(this.lm_request['policy_start_date'], 'days');
        this.processed_request['___max_days___'] = '';
    }
};
RelianceTravel.prototype.get_cover_id = function () {
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];
    let cover_id = '';
    if (adult === 1) {
        if (child === 1) {
            cover_id = "317";
        }
        if (child === 2) {
            cover_id = "318";
        }
    } else {
        cover_id = '314';
        if (child === 1) {
            cover_id = "315";
        }
        if (child === 2) {
            cover_id = "316";
        }
    }
    this.processed_request['___coverage_id___'] = cover_id;
};
RelianceTravel.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('RelianceTravel is_valid_plan', 'start');
    if (lm_request['trip_type'] === "MULTI" && ['Basic', 'Silver', 'Gold', 'Platinum'].indexOf(planCode) > -1) {
        return false;
    } else if (lm_request['trip_type'] === "SINGLE" && ['Plus', 'Elite'].indexOf(planCode) > -1) {
        return false;
    } else {
        return true;
    }
};
RelianceTravel.prototype.premium_breakup_schema = {
    "tax": {
        "CGST": "CGST",
        "SGST": "SGST",
        "IGST": 0,
        "UTGST": 0
    },
    "net_premium": "NetPremium",
    "service_tax": 0,
    "final_premium": "FinalPremium"
};
module.exports = RelianceTravel;