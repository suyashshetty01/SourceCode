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

function RelianceHealth() {

}
util.inherits(RelianceHealth, Health);

RelianceHealth.prototype.lm_request_single = {};
RelianceHealth.prototype.insurer_integration = {};
RelianceHealth.prototype.insurer_addon_list = [];
RelianceHealth.prototype.insurer = {};
RelianceHealth.prototype.insurer_date_format = 'dd/MM/yyyy';
RelianceHealth.prototype.const_insurer_suminsured = [300000, 500000, 600000, 900000, 1000000, 1500000, 5000000, 10000000];


RelianceHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {

    console.log('insurer_product_api_pre');
};
RelianceHealth.prototype.insurer_product_field_process_pre = function () {
    var obj_plan_id = this.get_plan_id(this.prepared_request['health_insurance_si']);
    this.prepared_request['health_insurance_si_2'] = obj_plan_id;
    this.processed_request['___health_insurance_si_2___'] = obj_plan_id;
    this.prepared_request['autherity_code'] = (config.environment.name !== 'Production') ? "51" : "";
    this.processed_request['___autherity_code___'] = this.prepared_request['autherity_code'];
    
    let tmp_method_content = this.method_content;

    if (this.lm_request['method_type'] === 'Premium') {
        if (this.prepared_request['Plan_Id'] === 111) {
            this.method['Method_Request_File'] = "Reliance_Health_Addon_Premium.xml";
            this.method['Service_URL'] = (config.environment.name !== 'Production') ? "https://rgipartners.reliancegeneral.co.in:9443/api/HealthInfinityAPIService/PremiumCalulationForHealthInfinity" : "https://rzonews.reliancegeneral.co.in:8443/api/HealthInfinityAPIService/PremiumCalulationForHealthInfinity";
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/' + this.method.Method_Request_File).toString();
            this.method_content = method_content;
            console.log(' Premium Health Infinity plan....' + this.method_content);
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
            var txt_replace_with = "";
            var member = 1;
            for (member = 1; member <= this.lm_request['adult_count']; member++) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                this.get_member_relation(member, this.prepared_request['Plan_Id']);
                this.prepared_request['member_' + member + '_gender_code'] = this.prepared_request['member_' + member + '_gender'] === "M" ? "0" : "1";
                this.processed_request['___member_' + member + '_gender_code___'] = this.prepared_request['member_' + member + '_gender_code'];
                this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['member_' + member + '_gender_code'] === '0' ? 'Mr.' : 'Mrs.';
                if ((this.prepared_request['member_' + member + '_age'] >= 21 && this.prepared_request['member_' + member + '_relation'] === "345") ||
                        (this.prepared_request['member_' + member + '_age'] >= 18 && this.prepared_request['member_' + member + '_relation'] === "320")) {
                    this.processed_request['___member_' + member + '_marital_status___'] = "1951";
                } else {
                    this.processed_request['___member_' + member + '_marital_status___'] = "1952";
                }
            }
            for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                console.log(txt_replace_with);
                this.prepared_request['member_' + member + '_gender_code'] = this.prepared_request['member_' + member + '_gender'] === "M" ? "0" : "1";
                this.processed_request['___member_' + member + '_gender_code___'] = this.prepared_request['member_' + member + '_gender_code'];
                this.get_member_relation(member, this.prepared_request['Plan_Id']);
                this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['member_' + member + '_gender_code'] === '0' ? 'Mr.' : 'Miss.';
                this.processed_request['___member_' + member + '_marital_status___'] = "1952";
            }
            if (this.lm_request['freeAddOnCover'] === 'no' || this.lm_request['freeAddOnCover'] === "Cover") {
                this.prepared_request['free_addon_cover'] = true;
                this.processed_request['___free_addon_cover___'] = this.prepared_request['free_addon_cover'];
                this.get_addon_details();
            } else {
                this.prepared_request['free_addon_cover'] = false;
                this.processed_request['___free_addon_cover___'] = this.prepared_request['free_addon_cover'];
                this.get_addon_details();
            }
            this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
            this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
            console.log(this.method_content);
        }
    }
	//for posp case
	if (tmp_method_content.indexOf('POS_CONFIG_START') > -1) {
		var posp_request_data = this.find_text_btw_key(tmp_method_content, '<!--POS_CONFIG_START-->', '<!--POS_CONFIG_FINISH-->', false);
		if (this.lm_request['is_posp'] === 'yes' && (this.prepared_request["health_insurance_si"] - 0) <= 500000) {
			tmp_method_content = tmp_method_content.replace('___posp_aadhar___', this.lm_request['posp_aadhar']);
			tmp_method_content = tmp_method_content.replace('___posp_pan_no___', this.lm_request['posp_pan_no']);
		} else {
			tmp_method_content = tmp_method_content.replace(posp_request_data, '');
		}
	}
    if (this.lm_request['method_type'] === 'Proposal') {
        if (this.prepared_request['dbmaster_plan_id'] === 111) {
            this.method['Method_Request_File'] = "Reliance_Health_Addon_Proposal.xml";
            this.method['Service_URL'] = (config.environment.name !== 'Production') ? "https://rgipartners.reliancegeneral.co.in:9443/api/HealthInfinityAPIService/ProposalCreationForHealth" : "https://rzonews.reliancegeneral.co.in:8443/api/HealthInfinityAPIService/ProposalCreationForHealth";
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/' + this.method.Method_Request_File).toString();
            this.method_content = method_content;
            console.log(' Proposal Health Infinity plan....' + this.method_content);
            this.processed_request['___gender___'] = this.prepared_request["gender"] === "M" ? "0" : "1";
            this.processed_request['___marital___'] = this.prepared_request['marital'] === "1955" ? "1994" : this.prepared_request['marital'];
            this.get_nominee_relation_id(this.prepared_request['nominee_relation']);
            var objno = {"1": "Mr.", "2": "Mrs.", "5": "Miss."};
            this.processed_request['___salutation___'] = objno[this.processed_request['___salutation___']];
            var nominee_sal = {"320": "Mrs.", "321": "Mr.", "322": "Miss.", "319": "Mr.", "1255": "Mrs."};
            this.prepared_request["nominee_salutation"] = nominee_sal[this.processed_request['___nominee_relation___']];
            this.processed_request['___nominee_salutation___'] = this.prepared_request["nominee_salutation"];
            this.get_addon_details();
            this.prepared_request["isNomineeSameasCommAddr"] = this.lm_request['same_as_for_nominee'] === true ? true : false;
            this.processed_request['___isNomineeSameasCommAddr___'] = this.prepared_request["isNomineeSameasCommAddr"];
        }
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            var txt = txt_replace.replaceAll('___member_array_inc___', member - 1);
            txt_replace_with += txt.replaceAll('___member_array', '___member_' + member);
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            var txt = txt_replace.replaceAll('___member_array_inc___', member - 1);
            txt_replace_with += txt.replaceAll('___member_array', '___member_' + member);
        }
        member = 1;
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            if (this.prepared_request['dbmaster_plan_id'] === 111) {
                this.prepared_request['member_' + member + '_gender'] === "M" ? this.processed_request['___member_' + member + '_gender___'] = "0" : this.processed_request['___member_' + member + '_gender___'] = "1";
                this.get_member_relation(member, this.prepared_request['dbmaster_plan_id']);
                this.get_member_salutation(member, this.prepared_request['member_' + member + '_salutation']);
                this.processed_request['___member_' + member + '_marital_status___'] = this.prepared_request['member_' + member + '_marital_status'] === "1955" ? "1994" : this.prepared_request['member_' + member + '_marital_status'];
                this.processed_request['___member_' + member + '_first_name___'] = this.processed_request['___member_' + member + '_first_name___'].toUpperCase();
                this.processed_request['___member_' + member + '_last_name___'] = this.processed_request['___member_' + member + '_last_name___'].toUpperCase();
                this.calculate_bmi(member);//BMI Calculate
            } else {
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member, this.prepared_request['dbmaster_plan_id']);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
                this.processed_request['___member_' + member + '_first_name___'] = this.processed_request['___member_' + member + '_first_name___'].toUpperCase();
                this.processed_request['___member_' + member + '_last_name___'] = this.processed_request['___member_' + member + '_last_name___'].toUpperCase();
            }
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            if (this.prepared_request['dbmaster_plan_id'] === 111) {
                this.prepared_request['member_' + member + '_gender'] === "M" ? this.processed_request['___member_' + member + '_gender___'] = "0" : this.processed_request['___member_' + member + '_gender___'] = "1";
                this.get_member_relation(member, this.prepared_request['dbmaster_plan_id']);
                this.get_member_salutation(member, this.prepared_request['member_' + member + '_salutation']);
                this.processed_request['___member_' + member + '_marital_status___'] = this.prepared_request['member_' + member + '_marital_status'] === "1955" ? "1994" : this.prepared_request['member_' + member + '_marital_status'];
                this.processed_request['___member_' + member + '_first_name___'] = this.processed_request['___member_' + member + '_first_name___'].toUpperCase();
                this.processed_request['___member_' + member + '_last_name___'] = this.processed_request['___member_' + member + '_last_name___'].toUpperCase();
                this.calculate_bmi(member);//BMI Calculate
            } else {
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member, this.prepared_request['dbmaster_plan_id']);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
                this.processed_request['___member_' + member + '_first_name___'] = this.processed_request['___member_' + member + '_first_name___'].toUpperCase();
                this.processed_request['___member_' + member + '_last_name___'] = this.processed_request['___member_' + member + '_last_name___'].toUpperCase();
            }
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
        console.log(this.method_content);
    }
};
RelianceHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
RelianceHealth.prototype.insurer_product_field_process_post = function () {

};
RelianceHealth.prototype.insurer_product_api_post = function () {

};
RelianceHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;//
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
//Example POST method invocation 
        var Client = require('node-rest-client').Client;

        var client = new Client();

// set content-type header and data as json in args parameter 
        var args = {
            data: docLog.Insurer_Request,
            headers: {"Content-Type": "application/xml"}
        };
        if ((docLog['Plan_Id'] === 111 && docLog['Method_Type'] === 'Premium') || (docLog['LM_Custom_Request']['dbmaster_pb_plan_id'] === 111 && docLog['Method_Type'] !== 'Pdf')) {
            client.post(specific_insurer_object.method.Service_URL, args, function (data, response) {
                console.log(data);
                var objResponseFull = {
                    'err': null,
                    'result': data,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        } else if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
            client.post(specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action, args, function (data, response) {
                // parsed response body as js object 
                console.log(data);
                // raw response 
                // console.log(response);
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
                // parsed response body as js object 
                console.log(data);
                // raw response 
                console.log(response);
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

RelianceHealth.prototype.premium_response_handler = function (objResponseJson) {
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        var discount = 0;
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
            var plan_id = objResponseJson['HealthDetails']['RiskDetails']['PlanID'];
            if (plan_id !== "48") {
                if (this.lm_request['health_insurance_type'] === 'floater') {
                    if (this.lm_request['member_count'] >= 4) {
                        discount = 0.10;
                    } else if (this.lm_request['member_count'] > 1) {
                        discount = 0.05;
                    }
                }
                if (this.lm_request['child_count'] > 0) {
                    for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
                        if (this.lm_request['member_' + member + '_gender'] === 'F') {
                            discount = 0.05;
                            break;
                        }
                    }
                }
            }


            var objInsurerPremium = {};
            objPremiumService = objPremiumService['Premium'];
            for (var key in objPremiumService) {
                if (typeof objPremiumService[key] !== 'Object' && objPremiumService[key] !== null) {
                    objInsurerPremium[key] = this.round2Precision(objPremiumService[key] - 0);
                }
            }
            var service_component = objPremiumService['LstTaxComponentDetails']['TaxComponentHealth'];
            objInsurerPremium[service_component[0]['TaxName']] = service_component[0]['Amount'] - 0;
            objInsurerPremium[service_component[1]['TaxName']] = service_component[1]['Amount'] - 0;

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
            if (premium_breakup['final_premium'] !== 0 && discount !== 0) {
                premium_breakup['discount'] = Math.round(premium_breakup['final_premium'] * discount);
                premium_breakup['final_premium'] -= premium_breakup['discount'];
            }
            premium_breakup['service_tax'] = premium_breakup['tax']['CGST'] + premium_breakup['tax']['SGST'];

            //For Health-Infinity Addons
            premium_breakup['addon']['addon_cover'] = Math.round((premium_breakup['final_premium'] * 0.075));
            premium_breakup['addon']['addon_time'] = Math.round((premium_breakup['final_premium'] * 0.075));
            premium_breakup['addon']['addon_global'] = Math.round((premium_breakup['final_premium'] * 0.075));

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
RelianceHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('HealthDetails')) {
            var objPremiumService = objResponseJson['HealthDetails'];
            if (objPremiumService.hasOwnProperty('Policy'))
            {
                if (objPremiumService['Policy'].hasOwnProperty('ProposalNo') && objPremiumService['Policy']['ProposalNo'] !== '') {
                } else {
                    Error_Msg = JSON.stringify(objResponseJson['HealthDetails']['ErrorMessages']['ErrMessages']);
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson['HealthDetails']['ErrorMessages']['ErrMessages']);
            }
        } else {
            Error_Msg = JSON.stringify(objPremiumService);
        }
        var member = 1;
        var count = this.prepared_request['member_count'];
        for (member = 1; member <= count + 1; member++)
        {
            if (this.prepared_request['member_' + member + '_age'] >= 5 && this.prepared_request['member_' + member + '_age'] <= 10 && this.prepared_request['member_' + member + '_bmi'] > 25) {
                Error_Msg = "One of child member having age between 5 to 10 and BMI > 25.";
            } else if (this.prepared_request['member_' + member + '_age'] > 10 && this.prepared_request['member_' + member + '_age'] <= 15 && this.prepared_request['member_' + member + '_bmi'] > 30) {
                Error_Msg = "One of child member having age between 11 to 15 and BMI > 30.";
            } else if (this.prepared_request['member_' + member + '_age'] >= 16 && this.prepared_request['member_' + member + '_age'] <= 18 && this.prepared_request['member_' + member + '_bmi'] > 35) {
                Error_Msg = "One of child member having age between 16 to 18 and BMI > 35.";
            } else if (this.prepared_request['member_' + member + '_age'] > 18 && this.prepared_request['member_' + member + '_bmi'] > 37) {
                Error_Msg = "One of adult member having age greater than 18 and BMI > 37.";
            }
        }
//        if (this.prepared_request['health_insurance_si'] === 5000000 || this.prepared_request['health_insurance_si'] === 10000000) {
//            Error_Msg = "As health check is applicable for one/more members, our expert representative will call to guide you with the further process or you can also contact us directly on +91 22 48903009 .";
//        }
        if (Error_Msg === 'NO_ERR') {
            var proposalAmt = objResponseJson['HealthDetails']['Premium']['FinalPremium'];

//            if(this.lm_request['adult_count'] === 1 && this.lm_request['member_1_gender'] === 'F') {
//                if(this.lm_request['member_1_marital_status'] !== 1951) {
//                    discount = 0.05;
//                }
//            }
            var plan_id = objResponseJson['HealthDetails']['RiskDetails']['PlanID'];
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], proposalAmt);
            if (objPremiumVerification.Status) {
                var pg_data = {
                    'ProposalNo': objResponseJson['HealthDetails']['Policy']['ProposalNo'],
                    'userID': this.prepared_request['insurer_integration_service_user'],
                    'ProposalAmount': objPremiumVerification.Proposal_Amt,
                    'PaymentType': '1',
                    'Responseurl': this.const_payment.pg_ack_url,
                    'CKYC': this.processed_request['___kyc_no___'],
                    'IsDocumentUpload': false,
                    'PanNo': this.processed_request['___pan___'],
                    'IsForm60': false
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'GET';
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['HealthDetails']['Policy']['ProposalNo'];
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
RelianceHealth.prototype.verification_response_handler = function (objResponseJson) {
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

            var product_name = 'Health';
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            this.const_policy.policy_url = pdf_web_path_portal;

            var http = require('https');
            if (this.proposal_processed_request['___dbmaster_pb_plan_id___'] === 111) {
                var insurer_pdf_url = this.prepared_request['insurer_integration_pdf_url'];
                insurer_pdf_url = insurer_pdf_url.replace('___policy_number___', this.const_policy.policy_number);
                insurer_pdf_url = insurer_pdf_url.replace('___product_id___', this.prepared_request['product_id']);
            } else {
                var insurer_pdf_url = "https://rzonews.reliancegeneral.co.in:8443/api/HealthInfinityAPIService/GeneratePolicyschedule?policyNo=" + this.const_policy.policy_number;
            }
            try {
                var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                http.get(insurer_pdf_url, function (response) {
                    response.pipe(file_horizon);
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
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
};
RelianceHealth.prototype.pg_response_handler = function () {
    try {

        //Success -> Output=1|9202272311012647|C531031700163|0|CCAvenue|R31031700154|Success|
        //Failure -> Output=0|| C514081505462|0|Billdesk|R311027381|Failure|authentication failed from bank
        //MismatchPremium -> Output=0|||1|CCavenue|R06041700079||Response Amount is not matching with the Premium to be paid.


        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get['Output'];
        var response = output.split('|');
        this.const_policy.transaction_status = '';
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
RelianceHealth.prototype.member_above21 = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('member_above21', 'start');
    var member_above21 = 0;
    for (var x in this.lm_request) {
        if (x.indexOf('_age_in_months') > -1 && x.indexOf('elder_member_age_in_months') === -1 && this.lm_request[x] >= 252) {
            member_above21++;
        }
    }
    console.log('member_above21', 'finish');
    return member_above21;
};
RelianceHealth.prototype.member_below21 = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('member_below21', 'start');
    var member_below21 = 0;
    for (var x in this.lm_request) {
        if (x.indexOf('_age_in_months') > -1 && x.indexOf('elder_member_age_in_months') === -1 && this.lm_request[x] < 252) {
            member_below21++;
        }
    }
    console.log('member_below21', 'finish');
    return member_below21;
};
RelianceHealth.prototype.get_member_salutation = function (i, sal) {
    console.log(this.constructor.name, 'get_member_salutaion', ' Start RelianceHealth');
    var objno = {"1": "Mr.", "2": "Mrs.", "5": "Miss."};
    this.prepared_request['member_' + i + '_salutation'] = objno[sal];
    this.processed_request['___member_' + i + '_salutation___'] = this.prepared_request['member_' + i + '_salutation'];
    console.log(this.constructor.name, 'get_member_salutaion', ' Start RelianceHealth');
};
RelianceHealth.prototype.get_member_relation = function (i, plan_id) {
    console.log(this.constructor.name, 'get_member_relation', ' Start RelianceHealth');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in RelianceHealth " + gender);
    if (plan_id === 112) {
        if (this.prepared_request["relation"] === '1988' || this.prepared_request["relation"] === '1989') {
            return (gender === 'M' ? '319' : '1255');
        } else if (this.prepared_request["relation"] === '1987' || this.prepared_request["relation"] === '1986') {
            return(gender === 'M' ? '321' : '322');
        } else if (this.prepared_request["relation"] === '320') {
            if (i >= 3) {
                return(gender === 'M' ? '1988' : '1989');
            }
            return '320';
        } else if (this.prepared_request["relation"] === '345' || this.prepared_request["relation"] === '') {
            if (i >= 3) {
                return(gender === 'M' ? '1988' : '1989');
            } else if (i === 1) {
                return '345';
            } else if (i === 2) {
                return '320';
            }
        }
    } else {
        if (this.prepared_request["relation"] === '1988' || this.prepared_request["relation"] === '1989') {
            this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? '319' : '1255';
        } else if (this.prepared_request["relation"] === '1987' || this.prepared_request["relation"] === '1986') {
            this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? '321' : '322';
        } else if (this.prepared_request["relation"] === '320') {
            if (i >= 3) {
                this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? '321' : '322';
            }
            this.prepared_request['member_' + i + '_relation'] = '320';
        } else if (this.prepared_request["relation"] === '345' || this.prepared_request["relation"] === '') {
            if (i >= 3) {
                this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? '321' : '322';
            } else if (i === 1) {
                this.prepared_request['member_' + i + '_relation'] = '345';
            } else if (i === 2) {
                this.prepared_request['member_' + i + '_relation'] = '320';
            }
        }
        this.processed_request['___member_' + i + '_relation___'] = this.prepared_request['member_' + i + '_relation'];
        var rel = this.processed_request['___member_' + i + '_relation___'];
        var objno = {"345": "Self", "320": "Spouse", "321": "Son", "322": "Daughter", "319": "Father", "1255": "Mother"};
        if (["345", "320", "321", "322", "319", "1255"].includes(rel)) {
            this.prepared_request['member_' + i + '_relation_name'] = objno[rel];
            this.processed_request['___member_' + i + '_relation_name___'] = this.prepared_request['member_' + i + '_relation_name'];
        }
    }
    console.log(this.constructor.name, 'get_member_relation', 'End RelianceHealth');
};
RelianceHealth.prototype.get_addon_details = function () {
    if (this.lm_request['addon_cover'] === 'yes') {
        this.prepared_request['chargable_addon_cover'] = true;
        this.processed_request['___chargable_addon_cover___'] = this.prepared_request['chargable_addon_cover'];
    } else {
        this.prepared_request['chargable_addon_cover'] = false;
        this.processed_request['___chargable_addon_cover___'] = this.prepared_request['chargable_addon_cover'];
    }
    if (this.lm_request['addon_time'] === 'yes') {
        this.prepared_request['chargable_addon_time'] = true;
        this.processed_request['___chargable_addon_time___'] = this.prepared_request['chargable_addon_time'];
    } else {
        this.prepared_request['chargable_addon_time'] = false;
        this.processed_request['___chargable_addon_time___'] = this.prepared_request['chargable_addon_time'];
    }
    if (this.lm_request['addon_global'] === 'yes') {
        this.prepared_request['chargable_addon_global'] = true;
        this.processed_request['___chargable_addon_global___'] = this.prepared_request['chargable_addon_global'];
    } else {
        this.prepared_request['chargable_addon_global'] = false;
        this.processed_request['___chargable_addon_global___'] = this.prepared_request['chargable_addon_global'];
    }
    if (this.lm_request['freeAddOnCover'] === "Time") {
        this.prepared_request['free_addon_time'] = true;
        this.processed_request['___free_addon_time___'] = this.prepared_request['free_addon_time'];
    } else {
        this.prepared_request['free_addon_time'] = false;
        this.processed_request['___free_addon_time___'] = this.prepared_request['free_addon_time'];
    }
    if (this.lm_request['freeAddOnCover'] === "Global") {
        this.prepared_request['free_addon_global'] = true;
        this.processed_request['___free_addon_global___'] = this.prepared_request['free_addon_global'];
    } else {
        this.prepared_request['free_addon_global'] = false;
        this.processed_request['___free_addon_global___'] = this.prepared_request['free_addon_global'];
    }
    if (this.lm_request['method_type'] === "Proposal") {
         this.lm_request['freeAddOnCover'] = "Cover"
        if (this.lm_request['freeAddOnCover'] === "Cover") {
            this.prepared_request['free_addon_cover'] = true;
            this.processed_request['___free_addon_cover___'] = this.prepared_request['free_addon_cover'];
        } else {
            this.prepared_request['free_addon_cover'] = false;
            this.processed_request['___free_addon_cover___'] = this.prepared_request['free_addon_cover'];
        }
    }

};
RelianceHealth.prototype.get_nominee_relation_id = function (id) {
    var objno = {"320": "320", "1988": "321", "1989": "322", "1986": "319", "1987": "1255"};
    this.processed_request['___nominee_relation___'] = objno[id];
};
RelianceHealth.prototype.calculate_bmi = function (i) {
    var height = this.prepared_request['member_' + i + '_height'];
    var weight = this.prepared_request['member_' + i + '_weight'];

    var bmi = Math.round((weight / height / height) * 10000);
    this.prepared_request['member_' + i + '_bmi'] = bmi;
    this.processed_request['___member_' + i + '_bmi___'] = bmi;

};
RelianceHealth.prototype.get_plan_id = function (selected_si) {
    console.log('plan_id', 'start');
    var plans = [
        {'sum_ins': 300000, 'plan_id': 1},
        {'sum_ins': 600000, 'plan_id': 1},
        {'sum_ins': 900000, 'plan_id': 1},
        {'sum_ins': 1200000, 'plan_id': 2},
        {'sum_ins': 1500000, 'plan_id': 2},
        {'sum_ins': 1800000, 'plan_id': 2}
    ];
    var index = plans.findIndex(x => x.sum_ins === selected_si - 0);
    if (index === -1) {
        return "";
    }
    return plans[index]['plan_id'];
    console.log('plan_id', 'end');
};
RelianceHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('RelianceHealth is_valid_plan', 'start');
    var index = -1;
    var si = true;
    var age = true;
    if (planCode === "Gain" && parseInt(lm_request['health_insurance_si']) === 500000) {
        si = false;
    }
    if (planCode === "Infinity" && (parseInt(lm_request['health_insurance_si']) === 600000 || parseInt(lm_request['health_insurance_si']) === 900000)) {
        si = false;
    }
    if ((planCode === "Infinity" && lm_request['member_1_age'] > 65)) {
        age = false;
    }
    var Reliance_Plans = [
        {'code': "Infinity", 'min_si': 290000, 'max_si': 10000000},
        {'code': "Gain", 'min_si': 290000, 'max_si': 900000}
    ];
    index = Reliance_Plans.findIndex(x => x.code === planCode && si === true && age === true
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('RelianceHealth is_valid_plan', 'End');
};
RelianceHealth.prototype.premium_breakup_schema = {
    "addon": {
        "addon_cover": 0,
        "addon_time": 0,
        "addon_global": 0,
        "addon_final_premium": 0
    },
    "net_premium": "NetPremium",
    "tax": {
        "CGST": "CGST",
        "SGST": "SGST",
        "IGST": 0,
        "UTGST": 0
    },
    "service_tax": 0,
    "final_premium": "FinalPremium",
    "discount": 0
};
module.exports = RelianceHealth;