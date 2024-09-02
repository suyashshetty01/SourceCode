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
var moment = require('moment');
function AdityaBirlaHealth() {

}
util.inherits(AdityaBirlaHealth, Health);
AdityaBirlaHealth.prototype.lm_request_single = {};
AdityaBirlaHealth.prototype.insurer_integration = {};
AdityaBirlaHealth.prototype.insurer_addon_list = [];
AdityaBirlaHealth.prototype.insurer = {};
AdityaBirlaHealth.prototype.insurer_date_format = 'dd/MM/yyyy';
AdityaBirlaHealth.prototype.const_insurer_suminsured = [50000, 75000, 100000, 200000, 300000, 400000, 500000, , 600000, 700000, 800000, 900000, 1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000, 7500000, 10000000, 15000000, 20000000];
AdityaBirlaHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
AdityaBirlaHealth.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];
    if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
        this.prepared_request['health_insurance_type_2'] = "Individual";
        this.processed_request['___health_insurance_type_2___'] = "Individual";
    }
    if (this.lm_request['gender'] === "TM" || this.lm_request['gender'] === "TF") {
        this.prepared_request['gender'] = "T";
        this.processed_request['___gender___'] = "T";
    }
    this.processed_request['___reference_ID___'] = this.timestamp();
    this.processed_request['___creation_date_time___'] = (moment(new Date()).format('DD/MM/YYYY h:mm:ss a')).toUpperCase();
    this.processed_request['___TODID___'] = this.lm_request['crn'] + "" + this.timestamp();
    
    if (this.lm_request['method_type'] !== 'Verification') {
        if (((this.prepared_request['Plan_Id'] === 296) && this.lm_request['method_type'] === 'Premium') || this.prepared_request['dbmaster_plan_id'] === 295 || this.prepared_request['dbmaster_plan_id'] === 296) {
            this.prepared_request['product_code'] = "4226";
        } else {
            this.prepared_request['product_code'] = "6212";
        }
        this.processed_request['___product_code___'] = this.prepared_request['product_code'];
    }

    if (this.lm_request.hasOwnProperty('health_policy_type') && this.lm_request['health_policy_type'] === 'renew') {
        this.prepared_request['policy_number'] = this.lm_request['policy_no'];
        this.processed_request['___policy_number___'] = this.prepared_request['policy_number'];
        this.prepared_request['mobile'] = this.lm_request['mobile'];
        this.processed_request['___mobile___'] = this.prepared_request['mobile'];
    }
    if (this.lm_request['method_type'] === 'Premium') {
         this.processed_request['___task_id___'] = "Quotation";
        if (this.prepared_request['Plan_Id'] !== 296) {
            this.method['Service_URL'] = (config.environment.name !== 'Production') ? "/ABHICL_FullQuoteNSTP/Service1.svc/GenericFullQuote" : "";
        }
        for (member = 1; member <= adult; member++) {
            this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = member;
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['member_' + member + '_salutation'] = this.lm_request['member_' + member + '_gender'] === "M" ? "Mr" : (this.lm_request['member_' + member + '_gender'] === "F" ? "Miss" : "MX");
            this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['member_' + member + '_salutation'];
            this.get_optional_cover(member);
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.health_suminsured_selector(this.lm_request['member_' + member + '_si'] - 0, this.const_insurer_suminsured);
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['member_' + member + '_si'];
            } else {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
            }
            if (this.prepared_request['Plan_Id'] !== 296) {
                var cover_data = this.find_text_btw_key(this.method_content.toString(), '<!--cover_hide_Start-->', '<!--cover_hide_End-->', true);
                this.method_content = this.method_content.replace(cover_data, '');
            }
            if (this.prepared_request['Plan_Id'] === 296 && this.lm_request['health_insurance_si'] !== "500000") {
                var aru_cover_data = this.find_text_btw_key(this.method_content.toString(), '<!--aru_cover_hide_Start-->', '<!--aru_cover_hide_End-->', true);
                this.method_content = this.method_content.replace(aru_cover_data, '');
            }
        }
        for (member = 3; member <= child + 2; member++) {
            if (adult === 1) {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
            } else {
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
            }
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['member_' + member + '_salutation'] = this.lm_request['member_' + member + '_gender'] === "M" ? "Mr" : (this.lm_request['member_' + member + '_gender'] === "F" ? "Miss" : "MX");
            this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['member_' + member + '_salutation'];
            this.get_optional_cover(member);
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.health_suminsured_selector(this.lm_request['member_' + member + '_si'] - 0, this.const_insurer_suminsured);
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['member_' + member + '_si'];
            } else {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
            } 
            if (this.prepared_request['Plan_Id'] !== 295 && this.prepared_request['Plan_Id'] !== 296) {
                var cover_data = this.find_text_btw_key(this.method_content.toString(), '<!--cover_hide_Start-->', '<!--cover_hide_End-->', true);
                this.method_content = this.method_content.replace(cover_data, '');
            }
            if (this.prepared_request['Plan_Id'] === 296 && this.lm_request['health_insurance_si'] !== "500000") {
                var aru_cover_data = this.find_text_btw_key(this.method_content.toString(), '<!--aru_cover_hide_Start-->', '<!--aru_cover_hide_End-->', true);
                this.method_content = this.method_content.replace(aru_cover_data, '');
            }
        }

        if (this.lm_request.hasOwnProperty('health_policy_type') && this.lm_request['health_policy_type'] === "renew") {
            this.method['Method_Request_File'] = "AdityaBirla_Health_Renew_Premium.json";
            this.method['Service_URL'] = this.method['Renew_URL'];
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/' + this.method.Method_Request_File).toString();
            this.method_content = method_content;
        }
        if (this.prepared_request['Plan_Id'] === 295 || this.prepared_request['Plan_Id'] === 296) {
            this.method_content = this.method_content.replaceAll('<!--cover_hide_Start-->', "");
            this.method_content = this.method_content.replaceAll('<!--cover_hide_End-->', "");
            this.method_content = this.method_content.replaceAll('<!--aru_cover_hide_Start-->', "");
            this.method_content = this.method_content.replaceAll('<!--aru_cover_hide_End-->', "");
        }
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        if (this.lm_request['health_policy_type'] !== "renew") {
            if (this.prepared_request['dbmaster_plan_id'] === 296) {
                this.prepared_request['quote_number'] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']["ActiveAssureRes"]["PolCreationRespons"][0]["quoteNumber"][0];
                this.prepared_request['final-premium'] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['ActiveAssureRes']['PolCreationRespons'][0]['premiumDetails'][0]['Premium'][0]['FinalPremium'][0];
                this.prepared_request['gross-premium'] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['ActiveAssureRes']['PolCreationRespons'][0]['premiumDetails'][0]['Premium'][0]['GrossPremium'][0];
            } else {
                this.prepared_request['quote_number'] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']["ActiveHealthRes"]["PolCreationRespons"][0]["quoteNumber"][0];
                this.prepared_request['final-premium'] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']["ActiveHealthRes"]["PolCreationRespons"][0]['premiumDetails'][0]['Premium'][0]['FinalPremium'][0];
                this.prepared_request['gross-premium'] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']["ActiveHealthRes"]["PolCreationRespons"][0]['premiumDetails'][0]['Premium'][0]['GrossPremium'][0];
            }
            this.processed_request['___quote_number___'] = this.prepared_request['quote_number'];
            this.processed_request['___final-premium___'] = this.prepared_request['final-premium'];
            this.processed_request['___task_id___'] = "PolicyIssuance";
             
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
            var txt_replace_with = "";
            for (member = 1; member <= adult; member++) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
                this.prepared_request['member_' + member + '_salutation'] = (this.lm_request['member_' + member + '_gender'] === "M" || this.lm_request['member_' + member + '_gender'] === "F") ? this.lm_request['member_' + member + '_salutation'] : "MX";
                this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['member_' + member + '_salutation'];
                this.get_optional_cover(member);
                if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                    this.prepared_request['member_' + member + '_si'] = this.health_suminsured_selector(this.lm_request['member_' + member + '_si'] - 0, this.const_insurer_suminsured);
                    this.processed_request['___member_' + member + '_si___'] = this.prepared_request['member_' + member + '_si'];
                } else {
                    this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                    this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
                }
                var medQuestn_block = this.member_medical_question(member);
                txt_replace_with = txt_replace_with.replace('<!--___member_' + member + '_medquestn-->', medQuestn_block);
                if (this.prepared_request['dbmaster_plan_id'] !== 295 && this.prepared_request['dbmaster_plan_id'] !== 296) {
                    var cover_data = this.find_text_btw_key(txt_replace_with, '<!--cover_hide_Start-->', '<!--cover_hide_End-->', true);
                    txt_replace_with = txt_replace_with.replaceAll(cover_data , "");
                }
                if (this.prepared_request['dbmaster_plan_id'] === 296 && this.lm_request['health_insurance_si'] !== 500000) {
                    var aru_cover_data = this.find_text_btw_key(txt_replace_with, '<!--aru_cover_hide_Start-->', '<!--aru_cover_hide_End-->', true);
                    txt_replace_with = txt_replace_with.replaceAll(aru_cover_data , "");
                }
                
            }
            for (member = 3; member <= child + 2; member++) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
                this.prepared_request['member_' + member + '_salutation'] = (this.lm_request['member_' + member + '_gender'] === "M" || this.lm_request['member_' + member + '_gender'] === "F") ? this.lm_request['member_' + member + '_salutation'] : "MX";
                this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['member_' + member + '_salutation'];
                this.get_optional_cover(member);
                if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                    this.prepared_request['member_' + member + '_si'] = this.health_suminsured_selector(this.lm_request['member_' + member + '_si'] - 0, this.const_insurer_suminsured);
                    this.processed_request['___member_' + member + '_si___'] = this.prepared_request['member_' + member + '_si'];
                } else {
                    this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                    this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
                }
                var medQuestn_block = this.member_medical_question(member);
                txt_replace_with = txt_replace_with.replace('<!--___member_' + member + '_medquestn-->', medQuestn_block);

                if (adult === 1) {
                    this.prepared_request['member_' + member + '_inc'] = member - 1;
                    this.processed_request['___member_' + member + '_inc___'] = member - 1;
                } else {
                    this.prepared_request['member_' + member + '_inc'] = member;
                    this.processed_request['___member_' + member + '_inc___'] = member;
                }
                if (this.prepared_request['dbmaster_plan_id'] !== 295 && this.prepared_request['dbmaster_plan_id'] !== 296) {
                    var cover_data = this.find_text_btw_key(txt_replace_with, '<!--cover_hide_Start-->', '<!--cover_hide_End-->', true);
                    txt_replace_with = txt_replace_with.replaceAll(cover_data , "");
                }
                if (this.prepared_request['dbmaster_plan_id'] === 296 && this.lm_request['health_insurance_si'] !== 500000) {
                    var aru_cover_data = this.find_text_btw_key(txt_replace_with, '<!--aru_cover_hide_Start-->', '<!--aru_cover_hide_End-->', true);
                    txt_replace_with = txt_replace_with.replaceAll(aru_cover_data , "");
                }
            }
            if (this.method_content[0] !== '<') {// for json
                txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
                txt_replace_with = txt_replace_with.replaceAll('<!--cover_hide_Start-->', "");
                txt_replace_with = txt_replace_with.replace('<!--aru_cover_hide_Start-->', "");
                var Total_Count = this.lm_request['member_count'];
                for (var x = 1; x <= Total_Count - 1; x++) {
                    txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', ",");
                    txt_replace_with = txt_replace_with.replace('<!--cover_hide_End-->', "");
                    txt_replace_with = txt_replace_with.replace('<!--aru_cover_hide_Start-->', "");
                    txt_replace_with = txt_replace_with.replace('<!--aru_cover_hide_End-->', "");
                }
                txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', "");
                txt_replace_with = txt_replace_with.replace('<!--cover_hide_End-->', "");
                txt_replace_with = txt_replace_with.replace('<!--aru_cover_hide_End-->', "");
            }
            this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        } else {
            this.method['Method_Request_File'] = "AdityaBirla_Health_Renew_Proposal.json";
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/' + this.method.Method_Request_File).toString();
            this.method_content = method_content;
            this.prepared_request['proposer_name'] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['renewalCheck_Response']['response']['policyData']['Name_of_the_proposer'];
            this.processed_request['___proposer_name___'] = this.prepared_request['proposer_name'];

            var objMember = this['insurer_master']['service_logs']['pb_db_master']['Premium_Response']['Member_details'];
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
            var txt_replace_with = "";
            for (member = 1; member <= objMember.length; member++) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            }
            if (this.method_content[0] !== '<') {// for json
                txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
                var Total_Count = objMember.length;
                for (var x = 1; x <= Total_Count - 1; x++) {
                    txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', ",");
                }
                txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', "");
            }
            this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
            console.log(this.method_content);
            var objMember = this['insurer_master']['service_logs']['pb_db_master']['Premium_Response']['Member_details'];
            if (objMember.length > 0) {
                for (var i in objMember) {
                    var mem = parseInt(i) + 1;
                    this.processed_request['___member_' + mem + '_name___'] = objMember[i]['first_name'] + "  " + objMember[i]['last_name'];
                    this.processed_request['___member_' + mem + '_si___'] = objMember[i]['sum_insured'];
                }
            }
        }
    }
    if (this.lm_request['method_type'] === 'Verification') {
        this.processed_request['___task_id___'] = "PolicyIssuance";
        this.prepared_request['verification_plan_id'] = this['insurer_master']['service_logs']['pb_db_master']['LM_Custom_Request']['dbmaster_pb_plan_id'];
        if (this.prepared_request['verification_plan_id'] !== 296) {
            this.method['Service_URL'] = (config.environment.name !== 'Production') ? "/ABHICL_FullQuoteNSTP/Service1.svc/GenericFullQuote" : "";
        }
        this.method_content = this.insurer_master['service_logs']['pb_db_master']['Insurer_Request'];
        if (this.lm_request.hasOwnProperty('health_policy_type') && this.lm_request['health_policy_type'] === "renew") {
            var obj_replace = {
                '"Instrument_Number": ""': '"Instrument_Number": ' + '"' + this.lm_request['pg_post']['TxRefNo'] + '"'
            };
        } else {
            var obj_replace = {
                '"instrumentNumber": ""': '"instrumentNumber": ' + '"' + this.lm_request['pg_post']['TxRefNo'] + '"'
            };
        }
        this.method_content = this.method_content.toString().replaceJson(obj_replace);
    }
    var obj_quote_date = this.get_quote_date();
    this.prepared_request['get_quote_date'] = obj_quote_date;
    this.processed_request['___get_quote_date___'] = this.prepared_request['get_quote_date'];

    var obj_renewal_quote_date = this.renewal_get_quote_date();
    this.prepared_request['renewal_get_quote_date'] = obj_renewal_quote_date;
    this.processed_request['___renewal_get_quote_date___'] = this.prepared_request['renewal_get_quote_date'];

    var obj_member_type = this.get_member_type(adult, child, this.prepared_request['product_code']);
    this.prepared_request['get_member_type'] = obj_member_type;
    this.processed_request['___get_member_type___'] = this.prepared_request['get_member_type'];

    this.prepared_request['intermediary_code'] = ((config.environment.name === 'Production') ? '2101426' : '2200144'); //1600283
    this.processed_request['___intermediary_code___'] = this.prepared_request['intermediary_code'];
//    console.log(this.processed_request);
//    console.log('AB-' + this.lm_request['method_type'], this.method_content);
};
AdityaBirlaHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
AdityaBirlaHealth.prototype.insurer_product_field_process_post = function () {

};
AdityaBirlaHealth.prototype.insurer_product_api_post = function () {

};
AdityaBirlaHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');
    try {
        var objInsurerProduct = this;
//        console.log(docLog.Insurer_Request);
        var body = docLog.Insurer_Request;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        var https = require('https');
        var xml2js = require('xml2js');
        var stripPrefix = require('xml2js').processors.stripPrefix;
        if (this.lm_request.hasOwnProperty('health_policy_type') && this.lm_request['health_policy_type'] === "renew") {
            var args = {
                data: body,
                headers: {
                    "Content-Type": "application/json"
                }
            };
        }
        if (this.lm_request.hasOwnProperty('health_policy_type') && this.lm_request['health_policy_type'] === "renew") {
            var service_url = specific_insurer_object.method.Renew_URL;
            client.post(service_url, args, function (data, response) {
//                console.log(response.statusCode);
//                console.log('data', data);
                var objData = JSON.stringify(data);
                var objReplace = {
                    'ns0:': '', ':ns0': ''
                };
                var filter_response = objData.replaceJson(objReplace);
                var objResponseFull = {
                    'err': null,
                    'result': filter_response,
                    'raw': filter_response,
                    'soapHeader': null,
                    'objResponseJson': JSON.parse(filter_response)
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });

        } else {
            if ((docLog['Plan_Id'] === 296 && docLog['Method_Type'] === 'Premium') || this.prepared_request['verification_plan_id'] === 296 && docLog['Method_Type'] === 'Verification') {
                var service_url = specific_insurer_object.method_file_url;
            } else {
                var service_url = specific_insurer_object.method.Service_URL;
            }
            var client_id = (config.environment.name !== 'Production') ? "b9794570-a8c6-4150-80a4-c0ba74e8ef46" : "";
            var client_secret = (config.environment.name !== 'Production') ? "O4eXSdzl9WelU7a6fXhFZyAlfKHWLTNwjlIw7nV0" : "";
            var auth_url = (config.environment.name !== 'Production') ? "/ABHICL_OAuth/Service1.svc/accessToken" : "";
            var host_url = (config.environment.name !== 'Production') ? "esbuat.adityabirlahealth.com" : "";
            var auth_body = {
                "Metadata": {
                    "Sender": {
                        "LogicalID": "Policy Boss",
                        "TaskID": this.processed_request['___task_id___'],
                        "ReferenceID": this.processed_request['___reference_ID___'],
                        "CreationDateTime": this.processed_request['___creation_date_time___'],
                        "TODID": this.processed_request['___TODID___']
                    }
                },
                "client_id": client_id,
                "client_secret": client_secret,
                "grant_type": "client_credentials"
            };
            var auth_post_Request = {
                host: host_url,
                path: auth_url,
                port: '',
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Content-Length': Buffer.byteLength(JSON.stringify(auth_body))
                }
            };
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
            var req = https.request(auth_post_Request, function (res) {
//                console.log(res.statusCode);
                var buffer = "";
                res.on("data", function (data) {
                    buffer = buffer + data;
                });
                res.on("end", function (data) {
//                    console.log(buffer);
                    xml2js.parseString(buffer, {tagNameProcessors: [stripPrefix]}, function (err, response) {
                        if (err)
                            throw err;
                        else {
                            var postRequest = {
                                host: host_url,
                                path: service_url,
                                port: '',
                                method: "POST",
                                headers: {
                                    'Content-Type': "application/json",
                                    'Authorization': response['AccessToken_Response']['access_token'][0],
                                    'Content-Length': Buffer.byteLength(body)
                                }
                            };
                            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                            var req = https.request(postRequest, function (res) {
//                                console.log(res.statusCode);
                                var buffer = "";
                                res.on("data", function (data) {
                                    buffer = buffer + data;
                                });
                                res.on("end", function (data) {
//                                    console.log(buffer);
                                    xml2js.parseString(buffer, {tagNameProcessors: [stripPrefix]}, function (err, objXml2Json) {
                                        var objResponseFull = {
                                            'err': err,
                                            'result': buffer,
                                            'raw': buffer,
                                            'soapHeader': null,
                                            'objResponseJson': objXml2Json
                                        };
                                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                    });
                                });
                            });
                            req.on('error', function (e) {
                                console.error('problem with request: ' + e.message);
                            });
                            req.write(body);
                            req.end();
                        }
                    });
                });
            });
            req.on('error', function (e) {
                console.error('problem with request: ' + e.message);
            });
            req.write(JSON.stringify(auth_body));
            req.end();
        } 
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
AdityaBirlaHealth.prototype.premium_response_handler = function (objResponseJson) {
//    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Premium_Response': {'Member_details': "",
            'Nominee_details': "",
            'Addon': ""
        }

    };
    var Error_Msg = 'NO_ERR';
    try {
        var objPremiumService = objResponseJson;

        if (this.lm_request.hasOwnProperty('health_policy_type') && this.lm_request['health_policy_type'] === "renew") {
            objPremiumService = objResponseJson['renewalCheck_Response'];
            if (objPremiumService.hasOwnProperty("error")) {
                if (objPremiumService['error']["ErrorCode"] === "00") {
                    Error_Msg = "NO_ERR";
                } else {
                    Error_Msg = objPremiumService['error']["ErrorMessage"];
                }
            }
            if (Error_Msg === 'NO_ERR')
            {
                var premium_breakup = this.get_const_premium_breakup();
                premium_breakup['final_premium'] = Number(objPremiumService["response"]["policyData"]["premium"]["Renewal_Gross_Premium"]);
                premium_breakup['gross_premium'] = Number(objPremiumService["response"]["policyData"]["premium"]["Renewal_Gross_Premium"]);
                premium_breakup['net_premium'] = Number(objPremiumService["response"]["policyData"]["premium"]["Renewal_Net_Premium"]);
                //premium_breakup['tax']['IGST'] = Number(objPremiumService["response"]["policyData"]["premium"]["Renewal_Tax_Details"]['Tax_Amount']);
                if (objPremiumService["response"]["policyData"]["premium"]["Renewal_Tax_Details"].hasOwnProperty('Tax_Type')) {
                    premium_breakup['tax']['IGST'] = Number(objPremiumService["response"]["policyData"]["premium"]["Renewal_Tax_Details"]['Tax_Amount']);
                    premium_breakup['service_tax'] = premium_breakup['tax']['IGST'];
                } else {
                    premium_breakup['tax']['CGST'] = Number(objPremiumService["response"]["policyData"]["premium"]["Renewal_Tax_Details"][1]['Tax_Amount']);
                    premium_breakup['tax']['SGST'] = Number(objPremiumService["response"]["policyData"]["premium"]["Renewal_Tax_Details"][0]['Tax_Amount']);
                    premium_breakup['service_tax'] = premium_breakup['tax']['CGST'] + premium_breakup['tax']['SGST'];
                }
                objServiceHandler.Premium_Breakup = premium_breakup;
                var objmembers = [];
                if (objPremiumService['response']['policyData']['Sum_insured_type'] === "Individual") {
                    var Member_detail = objPremiumService['response']['policyData']['Members'];
                    var obj = {
                        "first_name": Member_detail['Name'].split(" ")[0],
                        "middle_name": Member_detail['Name'].split(" ").length > 2 ? Member_detail['Name'].split(" ")[1] : "",
                        "last_name": Member_detail['Name'].split(" ").length > 2 ? Member_detail['Name'].split(" ")[2] : Member_detail['Name'].split(" ")[1],
                        "sum_insured": Member_detail['SumInsured'],
                        "upsell_suminsured": Member_detail['Upsell_SumInsured'],
                        "healthReturn": Member_detail['healthReturn'],
                        "birthdate": Member_detail['DoB'],
                        "gender": Member_detail['Gender'] === "M" ? "Male" : "Female",
                        "email": Member_detail['Email'],
                        "mobile_number": Member_detail['Mobile_Number'],
                        "relation": Member_detail['Relation'],
                        "Chronic": Member_detail['Chronic']
                    };
                    objmembers.push(obj);
                } else {

                    for (var i in objPremiumService['response']['policyData']['Members']) {
                        var Member_detail = objPremiumService['response']['policyData']['Members'][i];
                        var obj = {
                            "first_name": Member_detail['Name'].split(" ")[0],
                            "middle_name": Member_detail['Name'].split(" ").length > 2 ? Member_detail['Name'].split(" ")[1] : "",
                            "last_name": Member_detail['Name'].split(" ").length > 2 ? Member_detail['Name'].split(" ")[2] : Member_detail['Name'].split(" ")[1],
                            "sum_insured": Member_detail['SumInsured'],
                            "upsell_suminsured": Member_detail['Upsell_SumInsured'],
                            "healthReturn": Member_detail['healthReturn'],
                            "birthdate": Member_detail['DoB'],
                            "gender": Member_detail['Gender'] === "M" ? "Male" : "Female",
                            "email": Member_detail['Email'],
                            "mobile_number": Member_detail['Mobile_Number'],
                            "relation": Member_detail['Relation'],
                            "Chronic": Member_detail['Chronic']
                        };
                        objmembers.push(obj);
                    }
                }

                objServiceHandler.Premium_Response['Nominee_details']['nominee_name'] = objPremiumService['response']['policyData']['Nominee_Details']['Nominee_Name'];
                objServiceHandler.Premium_Response['Nominee_details']['nominee_address'] = objPremiumService['response']['policyData']['Nominee_Details']['Nominee_Address'];
                objServiceHandler.Premium_Response['Nominee_details']['nominee_contact'] = objPremiumService['response']['policyData']['Nominee_Details']['Nominee_Contact_No'];
                objServiceHandler.Premium_Response['Member_details'] = objmembers;
            }
        } else {
            //check error start
            if (objResponseJson.hasOwnProperty("ActiveAssureRes") || objResponseJson.hasOwnProperty("ActiveHealthRes")) {
                if (objResponseJson.hasOwnProperty("ActiveAssureRes")) {
                    var response = objResponseJson['ActiveAssureRes'];
                } else {
                    var response = objResponseJson['ActiveHealthRes'];
                }
                if (response.hasOwnProperty("PolCreationRespons")) {
                    if (response["PolCreationRespons"][0].hasOwnProperty('premiumDetails')) {
                    } else {
                        Error_Msg = JSON.stringify(objPremiumService);
                    }
                    if (response["PolCreationRespons"][0]['premiumDetails'][0]['Premium'][0]['FinalPremium'][0] === "") {
                        Error_Msg = "LM_NODE_MISSING_PremiumDetails";
                    }
                    if (response["ReceiptCreationResponse"][0]['errorMessage'][0] !== "Sucess ") {
                        Error_Msg = response["ReceiptCreationResponse"][0]['errorMessage'][0];
                    }
                } else {
                    Error_Msg = 'LM_NODE_MISSING_PolCreationRespons';
                }
            } else {
                Error_Msg = 'LM_NODE_MAIN_MISSING';
            }
            if (Error_Msg === 'NO_ERR')
            {
                var premium_breakup = this.get_const_premium_breakup();
                premium_breakup['final_premium'] = Number(response["PolCreationRespons"][0]["premiumDetails"][0]["Premium"][0]["FinalPremium"][0]);
                premium_breakup['gross_premium'] = Number(response["PolCreationRespons"][0]["premiumDetails"][0]["Premium"][0]["GrossPremium"][0]);
                premium_breakup['base_premium'] = Number(response["PolCreationRespons"][0]["premiumDetails"][0]["Premium"][0]["BasePremium"][0]);
                premium_breakup['net_premium'] = Number(response["PolCreationRespons"][0]["premiumDetails"][0]["Premium"][0]["NetPremium"][0]);
                premium_breakup['tax']['CGST'] = premium_breakup['net_premium'] * 0.09;
                premium_breakup['tax']['SGST'] = premium_breakup['net_premium'] * 0.09;
                premium_breakup['service_tax'] = premium_breakup['tax']['CGST'] + premium_breakup['tax']['SGST'];
                premium_breakup['SBC'] = Number(response["PolCreationRespons"][0]["premiumDetails"][0]["Premium"][0]["SBC"][0]);
                premium_breakup['KKC'] = Number(response["PolCreationRespons"][0]["premiumDetails"][0]["Premium"][0]["KKC"][0]);
                if (response["PolCreationRespons"][0]['productCode'][0] === "4226") {
                    //Any Room upgrade Addon
                    var aru_base_amt = premium_breakup['base_premium'] * 0.10;
                    var aru_serv_tax = aru_base_amt * 0.18;
                    premium_breakup['addon']['addon_aru'] = aru_base_amt + aru_serv_tax;

//Unlimited Reload of sum insured
                    var ursi_basic_rate = this.ursi_health_rate(this.processed_request) - 0;
                    var ursi_base_amt = premium_breakup['base_premium'] * ursi_basic_rate;
                    var ursi_basic_rate_service_tax = ursi_base_amt * 0.18;
                    premium_breakup['addon']['addon_ursi'] = ursi_base_amt - 0 + ursi_basic_rate_service_tax;
//Super NCB
                    var sncb_basic_rate = this.sncb_health_rate(this.processed_request) - 0;
                    var sncb_base_amt = premium_breakup['base_premium'] * sncb_basic_rate;
                    var sncb_basic_rate_service_tax = sncb_base_amt * 0.18;
                    premium_breakup['addon']['addon_sncp'] = sncb_base_amt - 0 + sncb_basic_rate_service_tax;
                }
                objServiceHandler.Premium_Breakup = premium_breakup;
            }

        }
        objServiceHandler.Error_Msg = Error_Msg;
//        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
AdityaBirlaHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.lm_request.hasOwnProperty('health_policy_type') && this.lm_request['health_policy_type'] === "renew")
        {
            var returnUrl = this.const_payment.pg_ack_url;
            var sourceCode = ((config.environment.name === 'Production') ? 'LNIB0013' : 'LNIB0001');
            var txnId = this.current_time();
            var pg_data = {
                'Email': this.lm_request['email'],
                'PhoneNo': this.lm_request['mobile'],
                'SourceCode': sourceCode,
                'OrderAmount': this.lm_request['final_premium'],
                'Currency': 'INR',
                'secSignature': 'fed47b72baebd4f5f98a3536b8537dc4e17f60beeb98c77c97dadc917004b3bb',
                'QuoteId': this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['renewalCheck_Response']["Renew_Info"]["Renewed_Policy_Proposal_Number"],
                'SubCode': 'RJ009',
                'GrossPremium': this.lm_request['final_premium'],
                'FinalPremium': this.lm_request['final_premium'],
                'SourceTxnId': this.lm_request['crn'] + txnId,
                'PaymentGatewayName': 'HDFC Pay-U Massmarket',
                'TerminalID': '76006448',
                'ReturnURL': returnUrl

            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = "";
        } else {
            var returnUrl = this.const_payment.pg_ack_url;
            var sourceCode = ((config.environment.name === 'Production') ? 'LNIB0013' : 'LNIB0001');
            var txnId = this.current_time();
            var pg_data = {
                'Email': this.lm_request['email'],
                'PhoneNo': this.lm_request['mobile'],
                'SourceCode': sourceCode,
                'OrderAmount': this.prepared_request['final-premium'], //this.lm_request['final_premium'],
                'Currency': 'INR',
                'secSignature': 'fed47b72baebd4f5f98a3536b8537dc4e17f60beeb98c77c97dadc917004b3bb',
                'ReturnURL': returnUrl,
                'QuoteId': this.prepared_request['quote_number'],
                'SubCode': 'RJ009',
                'GrossPremium': this.prepared_request['gross-premium'],
                'FinalPremium': this.prepared_request['final-premium'],
                'SourceTxnId': this.lm_request['crn'] + txnId,
                'PaymentGatewayName': 'HDFC Pay-U Massmarket',
                'TerminalID': '76006448'
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request['quote_number'];
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
AdityaBirlaHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.lm_request.hasOwnProperty('health_policy_type') && this.lm_request['health_policy_type'] === "renew") {
            var objPremiumService = objResponseJson['renewalPolicyGeneration_Response'];
            objResponseJson = objPremiumService;
            if (this.const_policy.pg_status === 'FAIL') {
            }
            if (this.const_policy.pg_status === 'SUCCESS') {
                if (objResponseJson.hasOwnProperty("error")) {
                    if (objResponseJson['error']["ErrorCode"] !== "00") {
                        Error_Msg = objResponseJson['error']["ErrorMessage"];
                    }
                    if (Error_Msg === 'NO_ERR') {
                        this.const_policy.transaction_status = 'SUCCESS';
                        this.const_policy.policy_number = objResponseJson['response']['New_PolicyNumber'];
                        this.const_policy.policy_id = objResponseJson['response']['Receipt_No'];
                    }
                }
            }
        } else {
            if (this.const_policy.pg_status === 'FAIL') {
            }
            if (this.const_policy.pg_status === 'SUCCESS') {
                if(objResponseJson.hasOwnProperty("ActiveAssureRes") || objResponseJson.hasOwnProperty("ActiveHealthRes")){
                    if (objResponseJson.hasOwnProperty("ActiveAssureRes")) {
                        var response = objResponseJson['ActiveAssureRes'];
                    } else {
                        var response = objResponseJson['ActiveHealthRes'];
                    }
                    if (response.hasOwnProperty("PolCreationRespons")) {
                        if (response["PolCreationRespons"][0].hasOwnProperty('stpflag') && response["PolCreationRespons"][0].hasOwnProperty('policyStatus')) {
                        } else {
                            Error_Msg = 'LM_NODE_MISSING_policyStatus';
                        }
                    } else {
                        Error_Msg = 'LM_NODE_MISSING_PolCreationRespons';
                    }

                    if (response.hasOwnProperty('ReceiptCreationResponse')) {
                        if (response['ReceiptCreationResponse'][0].hasOwnProperty('errorMessage')) {
                            if (response['ReceiptCreationResponse'][0]['errorMessage'][0] !== "Sucess ") {
                                Error_Msg = response['ReceiptCreationResponse'][0]['errorMessage'][0];
                            }
                        }
                    }
                } else {
                    Error_Msg = 'LM_MAIN_NODE_MISSING';
                }



                if (Error_Msg === 'NO_ERR')
                {
                    this.const_policy.transaction_status = 'SUCCESS';
                    if (objResponseJson.hasOwnProperty("ActiveAssureRes") || objResponseJson.hasOwnProperty("ActiveHealthRes")) {
                        if (objResponseJson.hasOwnProperty("ActiveAssureRes")) {
                            var response = objResponseJson['ActiveAssureRes'];
                        } else {
                            var response = objResponseJson['ActiveHealthRes'];
                        }
                        if (response['PolCreationRespons'][0]['stpflag'][0] === 'STP') {
                            this.const_policy.transaction_substatus = "IF";
                            this.const_policy.policy_number = response['PolCreationRespons'][0]['policyNumber'][0];
                            this.const_policy.policy_id = response['ReceiptCreationResponse'][0]['ReceiptNumber'][0];
                            var pdf_file_name = this.constructor.name + '_Health_' + this.const_policy.policy_number.toString().replaceAll('-', '') + '.pdf';
                            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                            this.const_policy.policy_url = pdf_web_path_portal;
                        } else if (response['PolCreationRespons'][0]['stpflag'][0] === 'NSTP') {
                            if (response['PolCreationRespons'][0]['policyStatus'][0] === 'ME') {
                                this.const_policy.transaction_substatus = "ME";
                            } else {
                                this.const_policy.transaction_substatus = "UW";
                            }
                        } else {
                            this.const_policy.transaction_status = 'PAYPASS';
                        }
                    }
                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
            }

        }
        objServiceHandler.Policy = this.const_policy;
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

AdityaBirlaHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_post;
        this.const_policy.transaction_status = '';
        this.const_policy.transaction_id = output['merchantTxnId'];
        if (output['TxStatus'] === "success") {
            this.const_policy.transaction_amount = output['amount'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.pg_reference_number_1 = output['TxRefNo'];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
AdityaBirlaHealth.prototype.get_quote_date = function () {
    console.log(this.constructor.name, 'quote_date');
    var today = moment().format('DD/MM/YYYY');
    return today;
};
AdityaBirlaHealth.prototype.renewal_get_quote_date = function () {
    console.log(this.constructor.name, 'quote_date');
    var today = moment().format('MM/DD/YYYY');
    return today;
};
AdityaBirlaHealth.prototype.current_time = function () {
    var today = moment().utcOffset("+05:30");
    var current_time = moment(today).format("HH:mm:ss");
    current_time = current_time.replaceAll(":", "");
    return current_time;
};
AdityaBirlaHealth.prototype.get_member_type = function (adult, child, product_code) {
    var member_type;
    if (product_code === "4226") {
        if (adult === 1) {
            member_type = 'M739';
            if (child === 1) {
                member_type = 'M735';
            } else if (child === 2) {
                member_type = 'M736';
            } else if (child === 3) {
                member_type = 'M737';
            } else if (child === 4) {
                member_type = 'M738';
            }
        } else if (adult === 2) {
            member_type = 'M740';
            if (child === 1) {
                member_type = 'M731';
            } else if (child === 2) {
                member_type = 'M732';
            } else if (child === 3) {
                member_type = 'M733';
            } else if (child === 4) {
                member_type = 'M734';
            }
        }
    } else {
        if (adult === 1) {
            member_type = 'AH01';
            if (child === 1) {
                member_type = 'AH03';
            } else if (child === 2) {
                member_type = 'AH06';
            } else if (child === 3) {
                member_type = 'AH10';
            }else if (child === 4) {
                member_type = '';
            }
        } else if (adult === 2) {
            member_type = 'AH02';
            if (child === 1) {
                member_type = 'AH14';
            } else if (child === 2) {
                member_type = 'AH19';
            } else if (child === 3) {
                member_type = 'AH34';
            }else if (child === 4) {
                member_type = '';
            }
        }
    }
    return member_type;
};
AdityaBirlaHealth.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start ABH');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in ABH " + gender);
    if (this.prepared_request["relation"] === 'R003' || this.prepared_request["relation"] === 'R004') {
        return((gender === 'M' || gender === 'TM') ? 'R006' : 'R005');
    }
    if (this.prepared_request["relation"] === 'R005' || this.prepared_request["relation"] === 'R006') {
        return((gender === 'M' || gender === 'TM') ? 'R003' : 'R004');
    }
    if (this.prepared_request["relation"] === 'R002') {
        return 'R002';
    }
    if (this.prepared_request["relation"] === 'R001' || this.prepared_request["relation"] === '') {
        if (i >= 3) {
            return((gender === 'M' || gender === 'TM') ? 'R003' : 'R004');
        } else if (i === 1) {
            return 'R001';
        } else if (i === 2) {
            return 'R002';
        }
    }

    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End ABH');
};
AdityaBirlaHealth.prototype.get_optional_cover = function (member) {
    if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal')
    {
        if (this.lm_request['addon_aru'] === 'yes')
        {
            this.prepared_request['member_' + member + '_anyroom_upgrade'] = '0';
            this.processed_request['___member_' + member + '_anyroom_upgrade___'] = this.prepared_request['member_' + member + '_anyroom_upgrade'];
        } else
        {
            this.prepared_request['member_' + member + '_anyroom_upgrade'] = '1';
            this.processed_request['___member_' + member + '_anyroom_upgrade___'] = this.prepared_request['member_' + member + '_anyroom_upgrade'];
        }

        if (this.lm_request['addon_ursi'] === 'yes')
        {
            this.prepared_request['member_' + member + '_unlimited_reload'] = '0';
            this.processed_request['___member_' + member + '_unlimited_reload___'] = this.prepared_request['member_' + member + '_unlimited_reload'];
        } else
        {
            this.prepared_request['member_' + member + '_unlimited_reload'] = '1';
            this.processed_request['___member_' + member + '_unlimited_reload___'] = this.prepared_request['member_' + member + '_unlimited_reload'];
        }

        if (this.lm_request['addon_sncp'] === 'yes')
        {
            this.prepared_request['member_' + member + '_super_ncb'] = '0';
            this.processed_request['___member_' + member + '_super_ncb___'] = this.prepared_request['member_' + member + '_super_ncb'];
        } else
        {
            this.prepared_request['member_' + member + '_super_ncb'] = '1';
            this.processed_request['___member_' + member + '_super_ncb___'] = this.prepared_request['member_' + member + '_super_ncb'];
        }
    }
};
AdityaBirlaHealth.prototype.get_member_age = function (birthdate) {
    console.log(this.constructor.name, 'get_member_birth_date', 'Start');
    var date = birthdate;
    if (date !== '') {
        return moment().diff(date, 'years');
    }
    return 0;
    console.log(this.constructor.name, 'get_member_birth_date', 'End');
};
AdityaBirlaHealth.prototype.ursi_health_rate = function (processed_request) {
    try
    {
        var age = this.processed_request['___elder_member_age___'];
        var si = this.processed_request['___health_insurance_si___'];

        if (age > 5 && age <= 45)
        {
            age = 45;
        }
        if (age > 45)
        {
            age = 46;
        }

        var ursi_rate = {
            'Age_45': {
                'sum_300000': 0.16,
                'sum_400000': 0.16,
                'sum_500000': 0.07,
                'sum_700000': 0.07,
                'sum_1000000': 0.07,
                'sum_1500000': 0.07,
                'sum_2000000': 0.07,
                'sum_2500000': 0.07,
                'sum_3000000': 0.07,
                'sum_4000000': 0.07,
                'sum_5000000': 0.05,
                'sum_7500000': 0.04,
                'sum_10000000': 0.04,
                'sum_15000000': 0.04,
                'sum_20000000': 0.04
            },
            'Age_46': {
                'sum_300000': 0.22,
                'sum_400000': 0.22,
                'sum_500000': 0.14,
                'sum_700000': 0.14,
                'sum_1000000': 0.14,
                'sum_1500000': 0.14,
                'sum_2000000': 0.14,
                'sum_2500000': 0.14,
                'sum_3000000': 0.14,
                'sum_4000000': 0.14,
                'sum_5000000': 0.09,
                'sum_7500000': 0.09,
                'sum_10000000': 0.09,
                'sum_15000000': 0.09,
                'sum_20000000': 0.09
            }

        };
        var ursi_health_rate = ursi_rate['Age_' + age]['sum_' + si];
        return ursi_health_rate;
    } catch (e)
    {
        console.error('Exception', this.constructor.name, 'ursi_rate', e);
    }
    console.log("Finish", this.constructor.name, 'ursi_rate', processed_request);
};

AdityaBirlaHealth.prototype.sncb_health_rate = function (processed_request) {
    try
    {
        var age = this.processed_request['___elder_member_age___'];
        var si = this.processed_request['___health_insurance_si___'];

        if (age > 5 && age <= 45)
        {
            age = 45;
        }
        if (age > 45)
        {
            age = 46;
        }

        var sncb_rate = {
            'Age_45': {
                'sum_300000': 0.25,
                'sum_400000': 0.20,
                'sum_500000': 0.10,
                'sum_700000': 0.10,
                'sum_1000000': 0.10,
                'sum_1500000': 0.10,
                'sum_2000000': 0.10,
                'sum_2500000': 0.10,
                'sum_3000000': 0.10,
                'sum_4000000': 0.10,
                'sum_5000000': 0.07,
                'sum_7500000': 0.07,
                'sum_10000000': 0.07,
                'sum_15000000': 0.07,
                'sum_20000000': 0.07
            },
            'Age_46': {
                'sum_300000': 0.35,
                'sum_400000': 0.30,
                'sum_500000': 0.20,
                'sum_700000': 0.20,
                'sum_1000000': 0.20,
                'sum_1500000': 0.20,
                'sum_2000000': 0.20,
                'sum_2500000': 0.20,
                'sum_3000000': 0.20,
                'sum_4000000': 0.20,
                'sum_5000000': 0.15,
                'sum_7500000': 0.15,
                'sum_10000000': 0.15,
                'sum_15000000': 0.15,
                'sum_20000000': 0.15
            }

        };
        var sncb_health_rate = sncb_rate['Age_' + age]['sum_' + si];
        return sncb_health_rate;
    } catch (e)
    {
        console.error('Exception', this.constructor.name, 'sncb_rate', e);
    }
    console.log("Finish", this.constructor.name, 'sncb_rate', processed_request);
};
AdityaBirlaHealth.prototype.member_medical_question = function (member) {
    let medicalquestion = '';
    if (this.prepared_request['product_code'] === "4226") {
        var arr_questnId = ['Q100', 'Q101', 'Q102', 'Q103', 'Q104', 'Q105', 'Q106', 'Q107', 'Q108', 'Q109'];
        for (i = 0; i <= arr_questnId.length - 1; i++) {
            if (this.prepared_request['member_' + member + '_question_' + arr_questnId[i] + '_details'] !== false) {
                this.prepared_request['question_answer'] = "1";
                if ([0].indexOf(i) > -1) {
                    medicalquestion === '' ? medicalquestion = "\n\t\t" + '{"QuestionCode": "' + arr_questnId[i] + '","Answer": "' + this.prepared_request['question_answer'] + '", "remarks": ""}'
                            : medicalquestion += ",\n\t\t" + '{"QuestionCode": "' + arr_questnId[i] + '","Answer": "' + this.prepared_request['question_answer'] + '", "remarks": ""}';
                    console.log(medicalquestion);
                } else {
                    medicalquestion === '' ? medicalquestion = "\n\t\t" + '{"QuestionCode": "' + arr_questnId[i] + '","Answer": "' + this.prepared_request['question_answer'] + '", "remarks": "' + this.prepared_request['member_' + member + '_question_' + arr_questnId[i] + '_details'] + '"}'
                            : medicalquestion += ",\n\t\t" + '{"QuestionCode": "' + arr_questnId[i] + '","Answer": "' + this.prepared_request['question_answer'] + '", "remarks": "' + this.prepared_request['member_' + member + '_question_' + arr_questnId[i] + '_details'] + '"}';
                    console.log(medicalquestion);
                }
            }
        }
    } else {
        var arr_questnId = ['I003', 'I004', 'Q014', 'Q015', 'Q016', 'Q101', 'Q105', 'Q202', 'Q204', 'Q205', 'Q206', 'Q207', 'Q208', 'Q209', 'Q210', 'Q211', 'Q212', 'Q213', 'Q228', 'Q241', 'Q244', 'Q245'];
        for (i = 0; i <= arr_questnId.length - 1; i++) {
            if (this.prepared_request['member_' + member + '_question_' + arr_questnId[i] + '_details'] !== false) {
                this.prepared_request['question_answer'] = "1";
                if ([0, 1].indexOf(i) > -1) {
                    medicalquestion === '' ? medicalquestion = "\n\t\t" + '{"QuestionCode": "' + arr_questnId[i] + '","Answer": "' + this.prepared_request['question_answer'] + '", "remarks": ""}'
                            : medicalquestion += ",\n\t\t" + '{"QuestionCode": "' + arr_questnId[i] + '","Answer": "' + this.prepared_request['question_answer'] + '", "remarks": ""}';
                    console.log(medicalquestion);
                } else {
                    medicalquestion === '' ? medicalquestion = "\n\t\t" + '{"QuestionCode": "' + arr_questnId[i] + '","Answer": "' + this.prepared_request['question_answer'] + '", "remarks": "' + this.prepared_request['member_' + member + '_question_' + arr_questnId[i] + '_details'] + '"}'
                            : medicalquestion += ",\n\t\t" + '{"QuestionCode": "' + arr_questnId[i] + '","Answer": "' + this.prepared_request['question_answer'] + '", "remarks": "' + this.prepared_request['member_' + member + '_question_' + arr_questnId[i] + '_details'] + '"}';
                    console.log(medicalquestion);
                }
            }
        }
    }
    if (this.prepared_request['product_code'] === "4226") {
        var personalhabit = ['1252', '1253', '1254', '1237', '1238', '1239'];
    } else {
        var personalhabit = ['1252', '1237', '1253', '1238', '1254', '1239'];
    }
    for (i = 0; i <= personalhabit.length - 1; i++) { //alcohol, tobacco, smoking details
        if (this.prepared_request['member_' + member + '_question_' + personalhabit[i] + '_details'] === false) {
            this.prepared_request['member_' + member + '_question_' + personalhabit[i] + '_details'] = '0';
            this.processed_request['___member_' + member + '_question_' + personalhabit[i] + '_details___'] = '0';
        }
    }
    return medicalquestion;
};
AdityaBirlaHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('AdityBirla Health is_valid_plan', 'start');
    var index = -1;
    var si = true;
    var age = true;
    var member_type = true;
    if ((planCode === "4226100002" || planCode === "4226100001") && (parseInt(lm_request['health_insurance_si']) === 600000 || parseInt(lm_request['health_insurance_si']) === 800000 || parseInt(lm_request['health_insurance_si']) === 900000)) {
        si = false;
    }
    if ((planCode === "6212100001" || planCode === "6212100003" || planCode === "6212100004" || planCode === "6212100002") && (parseInt(lm_request['health_insurance_si']) === 7500000)) {
        si = false;
    }
    if ((planCode === "6212100001" || planCode === "6212100003" || planCode === "6212100004" || planCode === "6212100002") && lm_request['member_1_age'] > 65) {
        age = false;
    }
    var Adity_Plans = [
        {'code': "4226100002", 'min_si': 290000, 'max_si': 20000000},
        {'code': "4226100001", 'min_si': 290000, 'max_si': 20000000},
        {'code': "6212100001", 'min_si': 190000, 'max_si': 20000000},
        {'code': "6212100003", 'min_si': 190000, 'max_si': 20000000},
        {'code': "6212100004", 'min_si': 49000, 'max_si': 10000000},
        {'code': "6212100002", 'min_si': 990000, 'max_si': 20000000}
    ];
    index = Adity_Plans.findIndex(x => x.code === planCode && si === true && age === true && member_type === true
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('AdityBirla Health is_valid_plan', 'End');
};
AdityaBirlaHealth.prototype.premium_breakup_schema = {
    "addon": {
        "addon_aru": 0,
        "addon_ursi": 0,
        "addon_sncp": 0,
        "addon_final_premium": 0
    },
    "base_premium": "basePremium",
    "net_premium": "premium",
    "service_tax": "serviceTax",
    "SBC": "SBC",
    "KKC": "KKC",
    "gross_premium": "grossPremium",
    "final_premium": "totalPremium"
};
AdityaBirlaHealth.prototype.memberdetails_schema = {
    "name": "Name",
    "sum_insured": "SumInsured",
    "upsell_suminsured": "Upsell_SumInsured",
    "healthReturn": "healthReturn",
    "birthdate": "DoB",
    "gender": "Gender",
    "email": "Email",
    "mobile_number": "Mobile_Number",
    "relation": "Relation",
    "Chronic": "Chronic"

};
module.exports = AdityaBirlaHealth;