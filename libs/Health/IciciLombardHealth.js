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
var sleep = require('system-sleep');
var MongoClient = require('mongodb').MongoClient;
function IciciLombardHealth() {

}
util.inherits(IciciLombardHealth, Health);
IciciLombardHealth.prototype.lm_request_single = {};
IciciLombardHealth.prototype.insurer_integration = {};
IciciLombardHealth.prototype.insurer_addon_list = [];
IciciLombardHealth.prototype.insurer = {};
IciciLombardHealth.prototype.insurer_date_format = 'yyyy-MM-dd';
IciciLombardHealth.prototype.const_insurer_suminsured = [300000, 400000, 500000, 700000, 1000000, 1500000, 2000000, 2500000, 5000000];
IciciLombardHealth.prototype.insurer_product_api_pre = function () {
    console.log('insurer_product_api_pre');
};
IciciLombardHealth.prototype.insurer_product_field_process_pre = function () {
    if (this.lm_request['method_type'] === 'Premium') {
        const uuidv4 = require('uuid/v4');
        var uuid = uuidv4();
        console.log('IciciLombardHealth uuid4: ' + uuid);
        this.prepared_request['correlationCode'] = this.prepared_request.hasOwnProperty('correlationCode') ? this.prepared_request['correlationCode'] : uuid;
        this.processed_request['___correlationCode___'] = this.prepared_request['correlationCode'];
        this.prepared_request['gst_state'] = this.lm_request['state_name'];
        this.processed_request['___gst_state___'] = (this.prepared_request['gst_state']).toUpperCase();
        if (this.lm_request.hasOwnProperty('is_hospi') && this.lm_request['is_hospi'] === "yes") {
            this.prepared_request['plan_code'] = ((config.environment.name === 'Production') ? 16079 : 10528);
            this.processed_request['___plan_code___'] = this.prepared_request['plan_code'];
            if (this.lm_request['adult_count'] === 0 && this.lm_request['child_count'] > 0) {
                this.processed_request['___insured_dob___'] = this.processed_request['___member_3_birth_date___'];
            } else {
                this.processed_request['___insured_dob___'] = this.processed_request['___member_1_birth_date___'];
            }
            this.prepared_request['quote_date'] = this.get_quote_date();
            this.processed_request['___quote_date___'] = this.prepared_request['quote_date'];
            var subProductCode = ((config.environment.name === 'Production') ? 6001 : 1008);
            this.prepared_request['sub_product_code'] = subProductCode;
            this.processed_request['___sub_product_code___'] = subProductCode;
            if (this.prepared_request['Plan_Id'] === 16079) {
                this.method['Method_Request_File'] = "ICICILombard_Health_Hospi_Premium.json";
                this.method['Service_URL'] = (config.environment.name === 'Production') ? "https://app9.icicilombard.com/ILServices/Misc/v1/General/Quote/Create" : "https://cldilbizapp02.cloudapp.net:9001/ilservices/misc/v1/Zerotat/Quote/Create";
                var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/' + this.method.Method_Request_File).toString();
                this.method_content = method_content;
                if (this.lm_request.hasOwnProperty('opted_covers') && !this.lm_request['opted_covers'].includes("|")) {
                    if (this.lm_request['opted_covers'].includes("Accidental")) {
                        var obj_replace = [{
                                "CoverName": "Accidental Hospitalization Cash Benefit",
                                "CoverSI": this.lm_request['per_day_si'],
                                "Column1": this.lm_request['policy_cover']
                            }];
                    } else {
                        var obj_replace = [{
                                "CoverName": "Hospitalization Cash Benefit",
                                "CoverSI": this.lm_request['per_day_si'],
                                "Column1": this.lm_request['policy_cover']
                            }];
                    }
                } else {
                    var obj_replace = [{
                            "CoverName": "Hospitalization Cash Benefit",
                            "CoverSI": this.lm_request['per_day_si'],
                            "Column1": this.lm_request['policy_cover']
                        },
                        {
                            "CoverName": "Accidental Hospitalization Cash Benefit",
                            "CoverSI": this.lm_request['per_day_si'],
                            "Column1": this.lm_request['policy_cover']
                        }];
                }

                this.method_content = this.method_content.replaceAll("___cover_opted___", JSON.stringify(obj_replace));
                console.log(this.method_content);
            }
        } else {
            this.getSubProduct(this.prepared_request['Plan_Id']);
            this.getPlanDetails(this.prepared_request['Plan_Id']);
        }
    } else if (this.lm_request['method_type'] === 'Customer') {
        const uuidv4 = require('uuid/v4');
        var uuid = uuidv4();
        console.log('IciciLombardHealth uuid4: ' + uuid);
        this.prepared_request['correlationCode'] = uuid;
        this.processed_request['___correlationCode___'] = this.prepared_request['correlationCode'];

        if (this.lm_request.hasOwnProperty('is_hospi') && this.lm_request['is_hospi'] === 'yes') {
            var subProductCode = ((config.environment.name === 'Production') ? 6001 : 1008);
            this.prepared_request['sub_product_code'] = subProductCode;
            this.processed_request['___sub_product_code___'] = subProductCode;
            this.prepared_request['plan_code'] = ((config.environment.name === 'Production') ? 16079 : 10528);
            this.processed_request['___plan_code___'] = this.prepared_request['plan_code'];
            var obj_premium_breakup = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup'];

            this.prepared_request['proposal_date'] = this.get_quote_date();
            this.processed_request['___proposal_date___'] = this.prepared_request['proposal_date'];
            this.method['Method_Request_File'] = "ICICILombard_Health_Hospi_Customer.json";
            this.method['Service_URL'] = (config.environment.name === 'Production') ? "https://app9.icicilombard.com/ILServices/Misc/v1/General/Proposal/Create" : "https://cldilbizapp02.cloudapp.net:9001/ilservices/misc/v1/Zerotat/Proposal/Create";
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/' + this.method.Method_Request_File).toString();
            this.method_content = method_content;
            if (this.lm_request.hasOwnProperty('opted_covers') && !this.lm_request['opted_covers'].includes("|")) {
                if (this.lm_request['opted_covers'].includes("Accidental")) {
                    var obj_replace = [{
                            "CoverDescription": "Accidental Hospitalization Cash Benefit",
                            "SumInsured": (this.lm_request['per_day_si']).toString(),
                            "Column1": this.lm_request['policy_cover'],
                            "column2": null,
                            "column3": null,
                            "column4": null,
                            "column5": null
                        }];
                } else {
                    var obj_replace = [{
                            "CoverDescription": "Hospitalization Cash Benefit",
                            "SumInsured": (this.lm_request['per_day_si']).toString(),
                            "Column1": this.lm_request['policy_cover'],
                            "column2": null,
                            "column3": null,
                            "column4": null,
                            "column5": null
                        }];
                }
            } else {
                var obj_replace = [{
                        "CoverDescription": "Hospitalization Cash Benefit",
                        "SumInsured": (this.lm_request['per_day_si']).toString(),
                        "Column1": this.lm_request['policy_cover'],
                        "Applicability80D": null
                    },
                    {
                        "CoverDescription": "Accidental Hospitalization Cash Benefit",
                        "SumInsured": (this.lm_request['per_day_si']).toString(),
                        "Column1": this.lm_request['policy_cover'],
                        "Applicability80D": null
                    }];
            }

            this.method_content = this.method_content.replaceAll("___cover_opted___", JSON.stringify(obj_replace));
            console.log(this.method_content);

            this.prepared_request["service_tax"] = Math.round(obj_premium_breakup["service_tax"]);
            this.processed_request["___service_tax___"] = this.prepared_request["service_tax"];
            this.prepared_request["net_premium"] = (this.processed_request["___final_premium___"] - this.processed_request["___service_tax___"]);
            this.processed_request["___net_premium___"] = this.prepared_request["net_premium"];
        } else {
            var channelCode = ((config.environment.name === 'Production') ? 1 : 10002);
            this.prepared_request['channel_code'] = channelCode;
            this.processed_request['___channel_code___'] = channelCode;
            this.getSubProduct(this.prepared_request['dbmaster_pb_plan_id']);
            this.getPlanDetails(this.prepared_request['dbmaster_pb_plan_id']);
        }
        var member = 1;
        var adult = this.lm_request['adult_count'];
        var child = this.lm_request['child_count'];
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.getHeight(member);
            this.processed_request['___member_' + member + '_PEDIllness___'] = '';
            for (var i = 1; i <= 12; i++) {
                if (this.lm_request['member_' + member + '_question_' + i + '_details'] === true) {
                    (this.processed_request['___member_' + member + '_PEDIllness___'] === '') ? this.prepared_request['member_' + member + '_PEDIllness'] = i : this.prepared_request['member_' + member + '_PEDIllness'] += ',' + i;
                    this.processed_request['___member_' + member + '_PEDIllness___'] = this.prepared_request['member_' + member + '_PEDIllness'];
                }
            }
            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "0";
                            this.processed_request['___' + ques_detail + '___'] = "0";
                        } else {
                            this.prepared_request[ques_detail] = "1";
                            this.processed_request['___' + ques_detail + '___'] = "1";
                            this.prepared_request['isNSTP'] = 'yes';
                            this.processed_request['___isNSTP___'] = 'yes';
                        }
                    }
                }
            }
        }

        for (member = 3; member <= child + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.getHeight(member);
            this.processed_request['___member_' + member + '_PEDIllness___'] = '';
            for (var i = 1; i <= 12; i++) {
                if (this.lm_request['member_' + member + '_question_' + i + '_details'] === true) {
                    (this.processed_request['___member_' + member + '_PEDIllness___'] === '') ? this.prepared_request['member_' + member + '_PEDIllness'] = i : this.prepared_request['member_' + member + '_PEDIllness'] += ',' + i;
                    this.processed_request['___member_' + member + '_PEDIllness___'] = this.prepared_request['member_' + member + '_PEDIllness'];
                }
            }
            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "0";
                            this.processed_request['___' + ques_detail + '___'] = "0";
                        } else {
                            this.prepared_request[ques_detail] = "1";
                            this.processed_request['___' + ques_detail + '___'] = "1";
                            this.prepared_request['isNSTP'] = 'yes';
                            this.processed_request['___isNSTP___'] = 'yes';
                        }
                    }
                }
            }
        }
        if (this.lm_request.hasOwnProperty('is_hospi') && this.lm_request['is_hospi'] === 'yes') {
            if (this.lm_request['adult_count'] === 0 && this.lm_request['child_count'] > 0) {
                if (this.processed_request.hasOwnProperty('___member_3_middle_name___') && this.processed_request['___member_3_middle_name___'] !== "") {
                    this.processed_request['___insured_name___'] = this.processed_request['___member_3_first_name___'] + ' ' + this.processed_request['___member_3_middle_name___'] + ' ' + this.processed_request['___member_3_last_name___'];
                } else {
                    this.processed_request['___insured_name___'] = this.processed_request['___member_3_first_name___'] + ' ' + this.processed_request['___member_3_last_name___'];
                }
                this.processed_request['___insured_dob___'] = this.processed_request['___member_3_birth_date___'];
                this.processed_request['___insured_gender___'] = this.processed_request['___member_3_gender_2___'];
                this.processed_request['___insured_relation___'] = this.processed_request['___member_3_relation___'];
            } else {
                if (this.processed_request.hasOwnProperty('___member_1_middle_name___') && this.processed_request['___member_1_middle_name___'] !== "") {
                    this.processed_request['___insured_name___'] = this.processed_request['___member_1_first_name___'] + ' ' + this.processed_request['___member_1_middle_name___'] + ' ' + this.processed_request['___member_1_last_name___'];
                } else {
                    this.processed_request['___insured_name___'] = this.processed_request['___member_1_first_name___'] + ' ' + this.processed_request['___member_1_last_name___'];
                }
                this.processed_request['___insured_dob___'] = this.processed_request['___member_1_birth_date___'];
                this.processed_request['___insured_gender___'] = this.processed_request['___member_1_gender_2___'];
                this.processed_request['___insured_relation___'] = this.processed_request['___member_1_relation___'];
            }
        }
        if (this.method_content[0] !== '<') {// for json
            txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
            var Total_Count = this.lm_request['member_count'];
            for (var x = 1; x <= Total_Count - 1; x++) {
                txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', ",");
            }
            txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', "");
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
    } else if (this.lm_request['method_type'] === 'Proposal') {
        this.prepared_request['proposal_date'] = this.get_quote_date();
        this.processed_request['___proposal_date___'] = this.prepared_request['proposal_date'];

        var appId = ((config.environment.name === 'Production') ? 19 : 56);
        this.prepared_request['app_id'] = appId;
        this.processed_request['___app_id___'] = appId;
        var returnUrl = this.pg_ack_url(6);
        if (config.environment.name === 'Development') {
            returnUrl = 'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
        }
        this.prepared_request['return_url'] = returnUrl;
        this.processed_request['___return_url___'] = returnUrl;
        this.processed_request['___proposal_number___'] = this.prepared_request['insurer_customer_identifier'].split('|')[0];
        this.processed_request['___customer_id___'] = this.prepared_request['insurer_customer_identifier'].split('|')[1];
        this.prepared_request['check_for_initiate'] = JSON.parse(this.prepared_request['insurer_customer_identifier_2'].split('|')[1]);
        this.prepared_request['initiate_req_res'] = this.prepared_request['insurer_customer_identifier_2'].split('|')[2];
        this.prepared_request['insurer_customer_identifier_2'] = JSON.parse(this.prepared_request['insurer_customer_identifier_2'].split('|')[0]);
        this.processed_request['___insurer_customer_identifier_2___'] = this.prepared_request['insurer_customer_identifier_2'];
    } else if (this.lm_request['method_type'] === 'Verification') {
        this.prepared_request['payment_date'] = this.proposal_processed_request['___proposal_date___'];
        this.processed_request['___payment_date___'] = this.prepared_request['payment_date'];
        if (this.lm_request.hasOwnProperty('is_hospi') && this.lm_request['is_hospi'] === 'yes') {
            var dealId = ((config.environment.name === 'Production') ? "DL-4150/6958334" : "DL-4150/1488450");
            this.method_content = this.method_content.replaceAll("___insurer_integration_agent_code___", dealId);
            this.processed_request['___transaction_amount___'] = Number(this.prepared_request['transaction_amount']);
        }
    }
    console.log(this.processed_request);
};
IciciLombardHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
IciciLombardHealth.prototype.insurer_product_field_process_post = function () {

};
IciciLombardHealth.prototype.insurer_product_api_post = function () {

};
IciciLombardHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var request = docLog.Insurer_Request;
//        console.log(request);
        var product_id = (this.lm_request.hasOwnProperty('is_hospi') && this.lm_request["is_hospi"] === "yes") ? 22 : 2;
        var Icici_Token = require('../../models/icici_token');
        Icici_Token.findOne({Product_Id: product_id}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
            if (err) {
//                console.log('Icici Token not Found Health', err);
            } else {
                if (specific_insurer_object.method.Method_Type === 'Premium' || specific_insurer_object.method.Method_Type === 'Customer') {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                    if (objInsurerProduct.lm_request.hasOwnProperty('is_hospi') && objInsurerProduct.lm_request["is_hospi"] === "yes") {
                        var access_key = dbIciciToken['Token'];
                        console.error('hospi token', access_key);
                        var body = JSON.parse(docLog.Insurer_Request);
                        var args = {
                            data: JSON.stringify(body),
                            headers: {"Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": "Bearer " + access_key
                            }
                        };
//                        console.log(JSON.stringify(args));
//                        console.log(specific_insurer_object.method.Service_URL);
                        client.post(specific_insurer_object.method.Service_URL, args, function (data, response) {
                            // parsed response body as js object 
                            console.error('HOSPI response', JSON.stringify(data));
                            var objResponseFull = {
                                'err': null,
                                'result': null,
                                'raw': JSON.stringify(data),
                                'soapHeader': null,
                                'objResponseJson': data
                            };
                            objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        });
                    } else {
                        var access_key = dbIciciToken['Token'];
                        console.error('token', access_key);
                        var body = JSON.parse(request);
                        var args = {
                            data: JSON.stringify(body),
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": "Bearer " + access_key
                            }
                        };
//                        console.log(JSON.stringify(args));
//                        console.log(specific_insurer_object.method.Service_URL);
                        client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                            // parsed response body as js object 
                            console.error('ICICI Data', JSON.stringify(data));
                            var objResponseFull = {
                                'err': null,
                                'result': null,
                                'raw': JSON.stringify(data),
                                'soapHeader': null,
                                'objResponseJson': data
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
//                            console.log('ICICI serviceBreakup', serviceBreakup);
                        });
                    }
                } else if (specific_insurer_object.method.Method_Type === 'Proposal') {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    var username = ((config.environment.name !== 'Production') ? 'PolicyBossApp' : 'Landmark');
                    var password = ((config.environment.name !== 'Production') ? 'P0L!cy80$$@pp' : 'Landmark');
                    var body = JSON.parse(request);
                    var args = {
                        data: JSON.stringify(body),
                        headers: {"Content-Type": "application/json",
                            "Accept": "application/json",
                            'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                        }
                    };
                    console.log(JSON.stringify(args));
                    client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                        // parsed response body as js object 
                        console.log('ICICI Data', data.toString());
                        var objResponseFull = {
                            'err': null,
                            'result': null,
                            'raw': JSON.stringify(data),
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                } else if (specific_insurer_object.method.Method_Type === 'Verification') {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                    if (objProduct.proposal_processed_request.hasOwnProperty('___insurer_customer_identifier_2___') && objProduct.proposal_processed_request['___insurer_customer_identifier_2___'] === true) {
                        var args = {
                            data: {
                                'grant_type': 'password',
                                'username': ((config.environment.name !== 'Production') ? 'policyboss' : 'landmark'),
                                'password': ((config.environment.name !== 'Production') ? 'pol!cyboss' : 'l@n&M@rk'),
                                'scope': 'esbpayment',
                                'client_id': ((config.environment.name !== 'Production') ? 'ro.policyboss' : 'ro.landmark'),
                                'client_secret': ((config.environment.name !== 'Production') ? 'pol!cybossCLi3nt' : 'ro.l@n&M@rkcL!3nt')
                            },
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        };
                        function jsonToQueryString(json) {
                            return  Object.keys(json).map(function (key) {
                                return encodeURIComponent(key) + '=' +
                                        encodeURIComponent(json[key]);
                            }).join('&');
                        }
                        args.data = jsonToQueryString(args.data);
                        var tokenservice_url = config.icici_health_auth.auth_url;
                        console.error('token data', JSON.stringify(args));
                        console.error(tokenservice_url);
                        client.post(tokenservice_url, args, function (data, response) {
                            // parsed response body as js object 
                            console.error('token', JSON.stringify(data));
                            var access_key = data['access_token'];
                            var body = JSON.parse(docLog.Insurer_Request);
                            var args = {
                                data: JSON.stringify(body),
                                headers: {"Content-Type": "application/json",
                                    "Accept": "application/json",
                                    "Authorization": "Bearer " + access_key
                                }
                            };
                            console.log(JSON.stringify(args));
                            client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                                // parsed response body as js object 
                                console.error('verification response', JSON.stringify(data));
                                console.log('ICICI Data', data.toString());
                                var objResponseFull = {
                                    'err': null,
                                    'result': null,
                                    'raw': JSON.stringify(data),
                                    'soapHeader': null,
                                    'objResponseJson': data
                                };
                                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            });
                        });
                    } else {
                        var username = ((config.environment.name !== 'Production') ? 'PolicyBossApp' : 'Landmark');
                        var password = ((config.environment.name !== 'Production') ? 'P0L!cy80$$@pp' : 'Landmark');
                        var args1 = {
                            headers: {
                                "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
                            }
                        };
                        var body = JSON.parse(docLog.Insurer_Request);
                        var qa_url = 'https://ilesb01.insurancearticlez.com/pgi/api/transaction/TransactionEnquiry?TransactionIdForPG=' + body['PaymentEntry']['onlineDAEntry']['TransactionId'];
                        var live_url = 'https://paygate.icicilombard.com/pgi/api/transaction/transactionenquiry?TransactionIdForPG=' + body['PaymentEntry']['onlineDAEntry']['TransactionId'];
                        client.get(config.environment.name === 'Production' ? live_url : qa_url, args1, function (data, response) {
                            console.log('ICICI tranaction Data', JSON.stringify(data));
                            if (data['Status'] === 0) {

                                var args = {
                                    data: {
                                        'grant_type': 'password',
                                        'username': ((config.environment.name !== 'Production') ? 'policyboss' : 'landmark'),
                                        'password': ((config.environment.name !== 'Production') ? 'pol!cyboss' : 'l@n&M@rk'),
                                        'scope': 'esbpayment',
                                        'client_id': ((config.environment.name !== 'Production') ? 'ro.policyboss' : 'ro.landmark'),
                                        'client_secret': ((config.environment.name !== 'Production') ? 'pol!cybossCLi3nt' : 'ro.l@n&M@rkcL!3nt')
                                    },
                                    headers: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    }
                                };
                                function jsonToQueryString(json) {
                                    return  Object.keys(json).map(function (key) {
                                        return encodeURIComponent(key) + '=' +
                                                encodeURIComponent(json[key]);
                                    }).join('&');
                                }
                                args.data = jsonToQueryString(args.data);
                                var tokenservice_url = config.icici_health_auth.auth_url;
                                console.error('token data', JSON.stringify(args));
                                console.error(tokenservice_url);
                                client.post(tokenservice_url, args, function (data, response) {
                                    // parsed response body as js object 
                                    console.error('token', JSON.stringify(data));
                                    var access_key = data['access_token'];
                                    var body = JSON.parse(docLog.Insurer_Request);
                                    var args = {
                                        data: JSON.stringify(body),
                                        headers: {"Content-Type": "application/json",
                                            "Accept": "application/json",
                                            "Authorization": "Bearer " + access_key
                                        }
                                    };
                                    console.log(JSON.stringify(args));
                                    client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                                        // parsed response body as js object 
                                        console.error('verification response', JSON.stringify(data));
                                        console.log('ICICI Data', data.toString());
                                        var objResponseFull = {
                                            'err': null,
                                            'result': null,
                                            'raw': JSON.stringify(data),
                                            'soapHeader': null,
                                            'objResponseJson': data
                                        };
                                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                    });
                                });
                            }
                        });
                    }
                } else if (specific_insurer_object.method.Method_Type === 'Pdf') {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                    var args = {
                        data: {
                            'grant_type': 'password',
                            'username': ((config.environment.name !== 'Production') ? 'policyboss' : 'landmark'),
                            'password': ((config.environment.name !== 'Production') ? 'pol!cyboss' : 'l@n&M@rk'),
                            'scope': 'esbgeneric',
                            'client_id': ((config.environment.name !== 'Production') ? 'ro.policyboss' : 'ro.landmark'),
                            'client_secret': ((config.environment.name !== 'Production') ? 'pol!cybossCLi3nt' : 'ro.l@n&M@rkcL!3nt')
                        },
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    };
                    function jsonToQueryString(json) {
                        return  Object.keys(json).map(function (key) {
                            return encodeURIComponent(key) + '=' +
                                    encodeURIComponent(json[key]);
                        }).join('&');
                    }
                    args.data = jsonToQueryString(args.data);
                    var tokenservice_url = config.icici_health_auth.auth_url;
                    console.error('token data', JSON.stringify(args));
                    console.error(tokenservice_url);
                    client.post(tokenservice_url, args, function (data, response) {
                        console.error('token', JSON.stringify(data));
                        var access_key = data['access_token'];
                        var args = {
                            headers: {
                                "Authorization": "Bearer " + access_key
                            }
                        };
                        console.log(JSON.stringify(args));
                        var qs = '?policyNo=' + objInsurerProduct.processed_request["___policy_number___"];
                        client.get(specific_insurer_object.method_file_url + qs, args, function (data, response) {
                            // parsed response body as js object 
                            console.log("PDF data - ", data);
                            // raw response 
//                            console.log(response);
                            var objResponseFull = {
                                'err': null,
                                'result': data,
                                'raw': JSON.stringify(data),
                                'soapHeader': null,
                                'objResponseJson': data
                            };
                            objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        });
                    });
                }
            }
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
IciciLombardHealth.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
//        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        var objPremiumService = objResponseJson;
        if (objPremiumService['status'] === true) {
            if (objPremiumService.hasOwnProperty('statusMessage') && objPremiumService['statusMessage'] === "Failed") {
                Error_Msg = objPremiumService['message'];
            }
        } else if (objPremiumService.hasOwnProperty('message')) {
            Error_Msg = objPremiumService['message'];
        } else {
            Error_Msg = objPremiumService;
        }
        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.get_const_premium_breakup();
            premium_breakup['base_premium'] = objPremiumService['basicPremium'].toFixed(2);
            premium_breakup['net_premium'] = objPremiumService['basicPremium'].toFixed(2);
            premium_breakup['service_tax'] = objPremiumService['totalTax'].toFixed(2);
            premium_breakup['final_premium'] = Math.round(objPremiumService['totalPremium']);
            if (this.lm_request.hasOwnProperty('is_hospi') && this.lm_request['is_hospi'] === 'yes') {
                premium_breakup['hospicash'] = {};
                var hospi_details = objPremiumService['productDetails']['planDetails']['0']['riskSIComponentDetails']['0'].coverDetails;
                for (var i = 0; i < hospi_details.length; i++) {
                    var serv_tax = hospi_details[i].coverPremium * 0.18;
                    var tot_premium = serv_tax + hospi_details[i].coverPremium;
                    premium_breakup['hospicash'][i] = hospi_details[i].coverName + "|" + Math.round(tot_premium);
                }
            }
            objServiceHandler.Premium_Breakup = premium_breakup;
        }
        objServiceHandler.Error_Msg = Error_Msg;
        objServiceHandler.Insurer_Transaction_Identifier = objPremiumService.hasOwnProperty('correlationId') ? objPremiumService['correlationId'] : null;
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
IciciLombardHealth.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('status')) {
            if (objResponseJson['statusMessage'] === "Failed") {
                Error_Msg = objResponseJson['message'];
            } else if (objResponseJson['status'] === true || objResponseJson['status'] === 'SUCCESS') {
                var proposal_amt = parseInt(objResponseJson['gctotalpremium']);
                var prm_diff = proposal_amt > this.lm_request['final_premium'] ? proposal_amt - this.lm_request['final_premium'] : this.lm_request['final_premium'] - proposal_amt;
                if (prm_diff >= 5) {
                    Error_Msg = "LM_Premium_Mismatch";
                }
            } else {
                Error_Msg = objResponseJson['message'];
            }
        } else {
            Error_Msg = 'LM_MSG:PROPOSAL_MAIN_NODE_MISSING';
        }
        Error_Msg = (this.lm_request['is_hospi'] === "yes" && this.prepared_request['isNSTP'] === 'yes') ? "Insured member(s) are not eligible" : Error_Msg;

        if (Error_Msg === 'NO_ERR') {

            if (this.lm_request['is_hospi'] !== "yes" && (this.prepared_request['isNSTP'] === 'yes' || this.lm_request['member_1_age'] > 45 || this.prepared_request['health_insurance_si'] > 1000000)) {
                var myobj = {
                    PB_CRN: parseInt(this.lm_request['crn']),
                    UDID: this.lm_request['udid'],
                    Request_Unique_Id: this.lm_request['search_reference_number'],
                    Service_Log_Unique_Id: this.lm_request['api_reference_number'],
                    Customer_Email: this.lm_request['email'],
                    Inspection_Id: objResponseJson['proposalNumber'],
                    Proposal_Number: "",
                    Original_Premium: this.lm_request['final_premium'],
                    Revised_Premium: "",
                    Insurer_Id: 6,
                    Status: "NSTP",
                    Last_Status: "",
                    Created_On: new Date(),
                    Modified_On: ''
                };
                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                    if (err)
                        throw err;
                    var health_nstp = db.collection('health_nstp_cases');
                    health_nstp.insertOne(myobj, function (err, res) {
                        if (err)
                            throw err;
                    });
                });
            }
            var check_for_eligibility = false;
            var check_for_initiate = false;
            var initiate_response = {};
            if (this.lm_request.hasOwnProperty('is_lazypay_emi') && this.lm_request['is_lazypay_emi'] === true) {
                let Client = require('node-rest-client').Client;
                let client = new Client();

                var args = {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: this.lm_request
                };
                var proposal_req = {
                    "lm_request": this.lm_request,
                    "pg_ack_url": this.const_payment.pg_ack_url
                };
                client.post(config.environment.weburl + '/lazy_pay_log/check_eligibility', args, function (data, response) {
                    if (data.hasOwnProperty('Response')) {
                        if (data['Response'].hasOwnProperty('status') && (data['Response']['status'] === 400 || data['Response']['status'] === 404 || data['Response']['status'] === 500)) {
                            console.error('LazyPay eligibility- ', JSON.stringify(data));
                            Error_Msg = data['Response'].hasOwnProperty('message') ? data['Response']['message'] : JSON.stringify(data['Response']);
                            check_for_eligibility = false;
                        } else {
                            if (data['Response'].hasOwnProperty('isEligible') && data['Response']['isEligible'] === true) {
                                check_for_eligibility = true;
                                let Client = require('node-rest-client').Client;
                                let client = new Client();
                                var occ_obj = {"0": "home-maker", "1": "student", "2": "salaried", "3": "self-employed", "8": "home-maker", "9": "retired", "11": "self-employed"};
                                var occupation = occ_obj[proposal_req['lm_request']['member_1_occupation']];
                                var args1 = {
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    data: {
                                        "request": proposal_req['lm_request'],
                                        "return_url": proposal_req['pg_ack_url'],
                                        "occupation": occupation
                                    }
                                };
                                client.post(config.environment.weburl + '/lazy_pay_log/pg_initiate', args1, function (data, response) {
                                    if (data) {
                                        if (data['Response'].hasOwnProperty('status') && (data['Response']['status'] === 400 || data['Response']['status'] === 404)) {
                                            Error_Msg = data['Response']['message'];
                                            check_for_initiate = false;
                                        } else if (data['Response'].hasOwnProperty('redirectUrl') && data['Response']['redirectUrl'] !== "" && data['Response']['redirectUrl'] !== null) {
                                            check_for_initiate = true;
                                            initiate_response = JSON.stringify(data);
                                        } else {
                                            check_for_initiate = false;
                                            Error_Msg = data['Response'].hasOwnProperty('message') ? data['Response']['message'] : JSON.stringify(data['Response']);
                                        }
                                    } else {
                                        Error_Msg = 'LM_MSG:LAZYPAY_INITIATE_MAIN_NODE_MISSING';
                                    }
                                });
                            } else {
                                check_for_eligibility = false;
                                Error_Msg = data['Response'].hasOwnProperty('message') ? data['Response']['message'] : JSON.stringify(data['Response']);
                            }
                        }
                    } else {
                        Error_Msg = 'LM_MSG:LAZYPAY_ELIGIBILITY_MAIN_NODE_MISSING';
                    }
                });
                sleep(18000);
            }
            var Customer = {
                'insurer_customer_identifier': objResponseJson['proposalNumber'] + "|" + objResponseJson['customerId'],
                'insurer_customer_identifier_2': check_for_eligibility + "|" + check_for_initiate + "|" + initiate_response,
                'insurer_customer_identifier_3': this.prepared_request['correlationCode']
            };
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = Customer['insurer_customer_identifier_3'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
IciciLombardHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        //check error start
        if (objResponseJson.includes("Unable") || objResponseJson.includes("exists")) {
            Error_Msg = objResponseJson;
        }

        if (this.lm_request.hasOwnProperty('is_lazypay_emi') && this.lm_request['is_lazypay_emi'] === true && Error_Msg === 'NO_ERR') {
            if (this.prepared_request['insurer_customer_identifier_2'] === false && this.lm_request['is_lazypay_emi'] === true) {
                Error_Msg = "You are not eligible for the LazyPay EMI offer at this moment. Thanks for showing your interest.";
            } else if (this.prepared_request['check_for_initiate'] === false && this.lm_request['is_lazypay_emi'] === true) {
                Error_Msg = "You are not eligible for the LazyPay EMI offer at this moment. Thanks for showing your interest.";
            } else if (this.prepared_request['insurer_customer_identifier_2'] === true && this.lm_request['is_lazypay_emi'] === true) {
                let initiate_data = JSON.parse(this.prepared_request['initiate_req_res']);
                objServiceHandler.Payment.pg_url = initiate_data['Response']['redirectUrl'];
                objServiceHandler.Payment.pg_data = initiate_data['Request']['data'];
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = initiate_data['Response']['token'];
            }
        }
        if (Error_Msg === 'NO_ERR' && this.lm_request['is_lazypay_emi'] !== true) {
            var transaction_id = objResponseJson;
            var pg_data = {
                'transactionId': transaction_id
            };
//            objServiceHandler.Payment.pg_url += "?transactionId=" + transaction_id;
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'GET';
            objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request['dbmaster_insurer_transaction_identifier'];
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
IciciLombardHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        if (this.proposal_processed_request.hasOwnProperty('___insurer_customer_identifier_2___') && this.proposal_processed_request['___insurer_customer_identifier_2___'] === true) {
            var output = this.const_payment_response.pg_get;
            this.const_policy.transaction_id = this.proposal_processed_request['___insurer_customer_identifier_3___'];
            if (output['status'] === 'success' && output['lpTxnId'] !== "" && output['lpTxnId'] !== undefined) {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_amount = this.proposal_processed_request['___final_premium___'];
                this.const_policy.policy_id = this.proposal_processed_request['___proposal_number___'];
                this.const_policy.pg_reference_number_1 = this.const_payment_response.pg_data.merchantTxnId;
                this.const_policy.pg_reference_number_2 = config.environment.name === 'Production' ? "99992202" : "ICICILUAT";
                this.const_policy.pg_reference_number_3 = this.proposal_processed_request['___customer_id___'];
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else {
            var output = this.const_payment_response.pg_post;
            this.const_policy.transaction_id = output['TransactionId'];
            if (output['Success'] === 'True') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_amount = output['Amount'];
                this.const_policy.policy_id = output['AdditionalInfo3'];
                this.const_policy.pg_reference_number_1 = output['AuthCode'];
                this.const_policy.pg_reference_number_2 = output['MerchantId'];
                this.const_policy.pg_reference_number_3 = output['AdditionalInfo2'];
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
IciciLombardHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        if (this.const_policy.pg_status === 'FAIL') {
        }
        if (this.const_policy.pg_status === 'SUCCESS') {

            if (!objResponseJson.hasOwnProperty('status')) {
                Error_Msg = 'LM_EMPTY_RESPONSE';
            } else {
                if (objResponseJson['status'] === true) {
                    var paymentTagResponse = objResponseJson['paymentTagResponse']['paymentTagResponseList'][0];
                    if (paymentTagResponse['status'] === 'SUCCESS') {
                        if (paymentTagResponse.hasOwnProperty('policyNo') && paymentTagResponse['policyNo'] !== '' && paymentTagResponse['policyNo'] !== null && paymentTagResponse['policyNo'] !== '0') {
                            this.const_policy.policy_number = paymentTagResponse['policyNo'];
                        } else if (paymentTagResponse.hasOwnProperty('coverNoteNo') && paymentTagResponse['coverNoteNo'] !== "") {
                            this.const_policy.policy_id = paymentTagResponse['coverNoteNo'];
                        } else {
                            Error_Msg = paymentTagResponse['errorText'] !== "" ? paymentTagResponse['errorText'] : "LM_POLICY_NUMBER_NA";
                        }
                    } else {
                        Error_Msg = paymentTagResponse['status'];
                    }
                } else {
                    Error_Msg = objResponseJson['statusMessage'];
                }
            }

            if (Error_Msg === 'NO_ERR') {
                this.const_policy.transaction_status = 'SUCCESS';
                if (this.const_policy.policy_number !== '' && this.const_policy.policy_number !== null && this.const_policy.policy_number !== undefined) {
                    this.const_policy.transaction_substatus = "IF";
                    var pdf_file_name = this.constructor.name + '_' + 'Health' + '_' + this.const_policy.policy_number.toString().replaceAll('/', '') + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path;
                    var args = {
                        data: {
                            "search_reference_number": this.lm_request['search_reference_number'],
                            "api_reference_number": this.lm_request['api_reference_number'],
                            "policy_number": this.const_policy.policy_number,
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key'],
                            'insurer_id': this.lm_request['insurer_id'],
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
                    if (this.proposal_processed_request.hasOwnProperty('___insurer_customer_identifier_2___') && this.proposal_processed_request['___insurer_customer_identifier_2___'] === true) {
                        var lazypay_arg = {
                            'crn': this.lm_request['crn'],
                            'udid': this.lm_request['udid'],
                            'insurer_id': this.lm_request['insurer_id'],
                            'policy_number': this.const_policy.policy_number,
                            'mobile': this.lm_request['mobile'],
                            'final_premium': this.lm_request['final_premium'],
                            'token': this.const_payment_response.pg_get['token']
                        };
                        this.lazypay_update_policy_no(config.environment.weburl + '/lazy_pay_log/policy_number', lazypay_arg);
                    }
                } else {
                    this.const_policy.transaction_substatus = "UW";
                    let og_proposal_number = this.processed_request['___policy_id___'];
                    let crn = this.lm_request['crn'];
                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                        if (err)
                            throw err;
                        let health_nstp = db.collection('health_nstp_cases');
                        health_nstp.updateMany({'PB_CRN': crn, 'Inspection_Id': {$ne: og_proposal_number}}, {$set: {'Status': "CLOSED"}}, function (err, numAffected) {
                            if (err)
                                throw err;
                            else {
                                console.log("Updated NSTP-", numAffected.modifiedCount);
                            }
                        });
                    });
                }
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }

            objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
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
        return objServiceHandler;
    }
};
IciciLombardHealth.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
};
IciciLombardHealth.prototype.lazypay_update_policy_no = function (url, args) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    var args1 = {
        data: args,
        headers: {
            "Content-Type": "application/json"
        }
    };
    client.post(url, args1, function (data, response) {

    });
};
IciciLombardHealth.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson) {

                var pdf_file_name = this.constructor.name + '_Health_' + this.lm_request['policy_number'].replaceAll('/', '') + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(objResponseJson, 'base64');
                fs.writeFileSync(pdf_sys_loc_horizon, binary);
                policy.policy_url = pdf_web_path_portal;
                policy.pdf_status = 'SUCCESS';
            } else {
                policy.pdf_status = 'FAIL';
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.transaction_status = 'PAYPASS';
        }
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
IciciLombardHealth.prototype.premium_breakup_schema = {
    "net_premium": "NetPremium",
    "tax": {
        "CGST": "CGST",
        "SGST": "SGST",
        "IGST": "IGST",
        "UGST": "UGST"
    },
    "service_tax": 0,
    "final_premium": "GrossPremium"
};
IciciLombardHealth.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start ILH');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in IciciLombardHealth " + gender);
    if (this.prepared_request["relation"] === 'SON' || this.prepared_request["relation"] === 'DAUGHTER') {
        return(gender === 'M' ? 'FATHER' : 'MOTHER');
    }
    if (this.prepared_request["relation"] === 'FATHER' || this.prepared_request["relation"] === 'MOTHER') {
        return(gender === 'M' ? 'SON' : 'DAUGHTER');
    }
    if (this.prepared_request["relation"] === 'SPOUSE') {
        if (i >= 3) {
            return(gender === 'M' ? 'SON' : 'DAUGHTER');
        }
        return 'SPOUSE';
    }
    if (this.prepared_request["relation"] === 'SELF') {
        if (i >= 3) {
            return(gender === 'M' ? 'SON' : 'DAUGHTER');
        } else if (i === 1) {
            return 'SELF';
        } else if (i === 2) {
            return 'SPOUSE';
        }
    }
    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End IciciLombardHealth');
};
IciciLombardHealth.prototype.getSubProduct = function (planId) {
    var CHI_Sub_Product = [
        {'id': 17020, 'uat_code': 1056, 'prod_code': 1225},
        {'id': 17021, 'uat_code': 1057, 'prod_code': 1226},
        {'id': 17022, 'uat_code': 1058, 'prod_code': 1227},
        {'id': 17023, 'uat_code': 1059, 'prod_code': 1228}
    ];
    let index = CHI_Sub_Product.findIndex(x => x.id === planId);
    if (config.environment.name === 'Production') {
        this.prepared_request['sub_product_code'] = (index === -1 ? '' : CHI_Sub_Product[index]['prod_code']);
    } else {
        this.prepared_request['sub_product_code'] = (index === -1 ? '' : CHI_Sub_Product[index]['uat_code']);
    }
    this.processed_request['___sub_product_code___'] = this.prepared_request['sub_product_code'];
};
IciciLombardHealth.prototype.getPlanDetails = function (planId) {
    let index = -1;
    var CHI_Plans = [
        {'id': 17020, 'uat_code': 10967, 'prod_code': 19238, 'tenure': 1, 'adult_count': 0, 'child_count': 1, 'plan_name': 'HSH_Individual_Child_1Year'},
        {'id': 17020, 'uat_code': 10968, 'prod_code': 19239, 'tenure': 1, 'adult_count': 1, 'child_count': 0, 'plan_name': 'HSH_Individual_Adult_1Year'},
        {'id': 17020, 'uat_code': 10969, 'prod_code': 19293, 'tenure': 1, 'adult_count': 2, 'child_count': 0, 'plan_name': 'HSH_2Adults_1Year'},
        {'id': 17020, 'uat_code': 10970, 'prod_code': 19294, 'tenure': 1, 'adult_count': 2, 'child_count': 1, 'plan_name': 'HSH_2Adults_1Child_1Year'},
        {'id': 17020, 'uat_code': 10971, 'prod_code': 19240, 'tenure': 1, 'adult_count': 2, 'child_count': 2, 'plan_name': 'HSH_2Adults_2Child_1Year'},
        {'id': 17020, 'uat_code': 10972, 'prod_code': 19241, 'tenure': 1, 'adult_count': 2, 'child_count': 3, 'plan_name': 'HSH_2Adults_3Child_1Year'},
        {'id': 17020, 'uat_code': 10973, 'prod_code': 19242, 'tenure': 1, 'adult_count': 1, 'child_count': 1, 'plan_name': 'HSH_1Adult_1Child_1Year'},
        {'id': 17020, 'uat_code': 10974, 'prod_code': 19243, 'tenure': 1, 'adult_count': 1, 'child_count': 2, 'plan_name': 'HSH_1Adult_2Child_1Year'},
        {'id': 17020, 'uat_code': 10975, 'prod_code': 19244, 'tenure': 2, 'adult_count': 0, 'child_count': 1, 'plan_name': 'HSH_Individual_Child_2Years'},
        {'id': 17020, 'uat_code': 10976, 'prod_code': 19245, 'tenure': 2, 'adult_count': 1, 'child_count': 0, 'plan_name': 'HSH_Individual_Adult_2Years'},
        {'id': 17020, 'uat_code': 10977, 'prod_code': 19246, 'tenure': 2, 'adult_count': 2, 'child_count': 0, 'plan_name': 'HSH_2Adults_2Years'},
        {'id': 17020, 'uat_code': 10978, 'prod_code': 19296, 'tenure': 2, 'adult_count': 2, 'child_count': 1, 'plan_name': 'HSH_2Adults_1Child_2Years'},
        {'id': 17020, 'uat_code': 10979, 'prod_code': 19247, 'tenure': 2, 'adult_count': 2, 'child_count': 2, 'plan_name': 'HSH_2Adults_2Child_2Years'},
        {'id': 17020, 'uat_code': 10980, 'prod_code': 19248, 'tenure': 2, 'adult_count': 2, 'child_count': 3, 'plan_name': 'HSH_2Adults_3Child_2Years'},
        {'id': 17020, 'uat_code': 10981, 'prod_code': 19249, 'tenure': 2, 'adult_count': 1, 'child_count': 1, 'plan_name': 'HSH_1Adult_1Child_2Years'},
        {'id': 17020, 'uat_code': 10982, 'prod_code': 19250, 'tenure': 2, 'adult_count': 1, 'child_count': 2, 'plan_name': 'HSH_1Adult_2Child_2Years'},
        {'id': 17020, 'uat_code': 10983, 'prod_code': 19251, 'tenure': 3, 'adult_count': 0, 'child_count': 1, 'plan_name': 'HSH_Individual_Child_3Years'},
        {'id': 17020, 'uat_code': 10984, 'prod_code': 19252, 'tenure': 3, 'adult_count': 1, 'child_count': 0, 'plan_name': 'HSH_Individual_Adult_3Years'},
        {'id': 17020, 'uat_code': 10985, 'prod_code': 19253, 'tenure': 3, 'adult_count': 2, 'child_count': 0, 'plan_name': 'HSH_2Adults_3Years'},
        {'id': 17020, 'uat_code': 10986, 'prod_code': 19254, 'tenure': 3, 'adult_count': 2, 'child_count': 1, 'plan_name': 'HSH_2Adults_1Child_3Years'},
        {'id': 17020, 'uat_code': 19087, 'prod_code': 19255, 'tenure': 3, 'adult_count': 2, 'child_count': 2, 'plan_name': 'HSH_2Adults_2Child_3Years'},
        {'id': 17020, 'uat_code': 10988, 'prod_code': 19256, 'tenure': 3, 'adult_count': 2, 'child_count': 3, 'plan_name': 'HSH_2Adults_3Child_3Years'},
        {'id': 17020, 'uat_code': 10989, 'prod_code': 19257, 'tenure': 3, 'adult_count': 1, 'child_count': 1, 'plan_name': 'HSH_1Adult_1Child_3Years'},
        {'id': 17020, 'uat_code': 10990, 'prod_code': 19258, 'tenure': 3, 'adult_count': 1, 'child_count': 2, 'plan_name': 'HSH_1Adult_2Child_3Years'},
        {'id': 17021, 'uat_code': 10991, 'prod_code': 19311, 'tenure': 1, 'adult_count': 0, 'child_count': 1, 'plan_name': 'SHP_Individual_Child_1Year'},
        {'id': 17021, 'uat_code': 10992, 'prod_code': 19313, 'tenure': 1, 'adult_count': 1, 'child_count': 0, 'plan_name': 'SHP_Individual_Adult_1Year'},
        {'id': 17021, 'uat_code': 10993, 'prod_code': 19314, 'tenure': 1, 'adult_count': 2, 'child_count': 0, 'plan_name': 'SHP_2Adults_1Year'},
        {'id': 17021, 'uat_code': 10994, 'prod_code': 19315, 'tenure': 1, 'adult_count': 2, 'child_count': 1, 'plan_name': 'SHP_2Adults_1Child_1Year'},
        {'id': 17021, 'uat_code': 10995, 'prod_code': 19316, 'tenure': 1, 'adult_count': 2, 'child_count': 2, 'plan_name': 'SHP_2Adults_2Child_1Year'},
        {'id': 17021, 'uat_code': 10996, 'prod_code': 19318, 'tenure': 1, 'adult_count': 2, 'child_count': 3, 'plan_name': 'SHP_2Adults_3Child_1Year'},
        {'id': 17021, 'uat_code': 10997, 'prod_code': 19320, 'tenure': 1, 'adult_count': 1, 'child_count': 1, 'plan_name': 'SHP_1Adult_1Child_1Year'},
        {'id': 17021, 'uat_code': 10998, 'prod_code': 19322, 'tenure': 1, 'adult_count': 1, 'child_count': 2, 'plan_name': 'SHP_1Adult_2Child_1Year'},
        {'id': 17021, 'uat_code': 10999, 'prod_code': 19324, 'tenure': 2, 'adult_count': 0, 'child_count': 1, 'plan_name': 'SHP_Individual_Child_2Year'},
        {'id': 17021, 'uat_code': 11000, 'prod_code': 19325, 'tenure': 2, 'adult_count': 1, 'child_count': 0, 'plan_name': 'SHP_Individual_Adult_2Year'},
        {'id': 17021, 'uat_code': 11001, 'prod_code': 19327, 'tenure': 2, 'adult_count': 2, 'child_count': 0, 'plan_name': 'SHP_2Adults_2Year'},
        {'id': 17021, 'uat_code': 11002, 'prod_code': 19328, 'tenure': 2, 'adult_count': 2, 'child_count': 1, 'plan_name': 'SHP_2Adults_1Child_2Year'},
        {'id': 17021, 'uat_code': 11003, 'prod_code': 19330, 'tenure': 2, 'adult_count': 2, 'child_count': 2, 'plan_name': 'SHP_2Adults_2Child_2Year'},
        {'id': 17021, 'uat_code': 11004, 'prod_code': 19332, 'tenure': 2, 'adult_count': 2, 'child_count': 3, 'plan_name': 'SHP_2Adults_3Child_2Year'},
        {'id': 17021, 'uat_code': 11005, 'prod_code': 19333, 'tenure': 2, 'adult_count': 1, 'child_count': 1, 'plan_name': 'SHP_1Adult_1Child_2Year'},
        {'id': 17021, 'uat_code': 11006, 'prod_code': 19334, 'tenure': 2, 'adult_count': 1, 'child_count': 2, 'plan_name': 'SHP_1Adult_2Child_2Year'},
        {'id': 17021, 'uat_code': 11007, 'prod_code': 19335, 'tenure': 3, 'adult_count': 0, 'child_count': 1, 'plan_name': 'SHP_Individual_Child_3Year'},
        {'id': 17021, 'uat_code': 11008, 'prod_code': 19337, 'tenure': 3, 'adult_count': 1, 'child_count': 0, 'plan_name': 'SHP_Individual_Adult_3Year'},
        {'id': 17021, 'uat_code': 11009, 'prod_code': 19338, 'tenure': 3, 'adult_count': 2, 'child_count': 0, 'plan_name': 'SHP_2Adults_3Year'},
        {'id': 17021, 'uat_code': 11010, 'prod_code': 19339, 'tenure': 3, 'adult_count': 2, 'child_count': 1, 'plan_name': 'SHP_2Adults_1Child_3Year'},
        {'id': 17021, 'uat_code': 11011, 'prod_code': 19340, 'tenure': 3, 'adult_count': 2, 'child_count': 2, 'plan_name': 'SHP_2Adults_2Child_3Year'},
        {'id': 17021, 'uat_code': 11012, 'prod_code': 19342, 'tenure': 3, 'adult_count': 2, 'child_count': 3, 'plan_name': 'SHP_2Adults_3Child_3Year'},
        {'id': 17021, 'uat_code': 11013, 'prod_code': 19343, 'tenure': 3, 'adult_count': 1, 'child_count': 1, 'plan_name': 'SHP_1Adult_1Child_3Year'},
        {'id': 17021, 'uat_code': 11014, 'prod_code': 19344, 'tenure': 3, 'adult_count': 1, 'child_count': 2, 'plan_name': 'SHP_1Adult_2Child_3Year'},
        {'id': 17022, 'uat_code': 11015, 'prod_code': 19346, 'tenure': 1, 'adult_count': 0, 'child_count': 1, 'plan_name': 'EL_Individual_Child_1Year'},
        {'id': 17022, 'uat_code': 11016, 'prod_code': 19347, 'tenure': 1, 'adult_count': 1, 'child_count': 0, 'plan_name': 'EL_Individual_Adult_1Year'},
        {'id': 17022, 'uat_code': 11017, 'prod_code': 19348, 'tenure': 1, 'adult_count': 2, 'child_count': 0, 'plan_name': 'EL_2Adults_1Year'},
        {'id': 17022, 'uat_code': 11018, 'prod_code': 19349, 'tenure': 1, 'adult_count': 2, 'child_count': 1, 'plan_name': 'EL_2Adults_1Child_1Year'},
        {'id': 17022, 'uat_code': 11019, 'prod_code': 19350, 'tenure': 1, 'adult_count': 2, 'child_count': 2, 'plan_name': 'EL_2Adults_2Child_1Year'},
        {'id': 17022, 'uat_code': 11020, 'prod_code': 19351, 'tenure': 1, 'adult_count': 2, 'child_count': 3, 'plan_name': 'EL_2Adults_3Child_1Year'},
        {'id': 17022, 'uat_code': 11021, 'prod_code': 19352, 'tenure': 1, 'adult_count': 1, 'child_count': 1, 'plan_name': 'EL_1Adult_1Child_1Year'},
        {'id': 17022, 'uat_code': 11022, 'prod_code': 19353, 'tenure': 1, 'adult_count': 1, 'child_count': 2, 'plan_name': 'EL_1Adult_2Child_1Year'},
        {'id': 17022, 'uat_code': 11023, 'prod_code': 19354, 'tenure': 2, 'adult_count': 0, 'child_count': 1, 'plan_name': 'EL_Individual_Child_2Year'},
        {'id': 17022, 'uat_code': 11024, 'prod_code': 19355, 'tenure': 2, 'adult_count': 1, 'child_count': 0, 'plan_name': 'EL_Individual_Adult_2Year'},
        {'id': 17022, 'uat_code': 11025, 'prod_code': 19356, 'tenure': 2, 'adult_count': 2, 'child_count': 0, 'plan_name': 'EL_2Adults_2Year'},
        {'id': 17022, 'uat_code': 11026, 'prod_code': 19357, 'tenure': 2, 'adult_count': 2, 'child_count': 1, 'plan_name': 'EL_2Adults_1Child_2Year'},
        {'id': 17022, 'uat_code': 11027, 'prod_code': 19358, 'tenure': 2, 'adult_count': 2, 'child_count': 2, 'plan_name': 'EL_2Adults_2Child_2Year'},
        {'id': 17022, 'uat_code': 11028, 'prod_code': 19359, 'tenure': 2, 'adult_count': 2, 'child_count': 3, 'plan_name': 'EL_2Adults_3Child_2Year'},
        {'id': 17022, 'uat_code': 11029, 'prod_code': 19360, 'tenure': 2, 'adult_count': 1, 'child_count': 1, 'plan_name': 'EL_1Adult_1Child_2Year'},
        {'id': 17022, 'uat_code': 11030, 'prod_code': 19361, 'tenure': 2, 'adult_count': 1, 'child_count': 2, 'plan_name': 'EL_1Adult_2Child_2Year'},
        {'id': 17022, 'uat_code': 11031, 'prod_code': 19362, 'tenure': 3, 'adult_count': 0, 'child_count': 1, 'plan_name': 'EL_Individual_Child_3Year'},
        {'id': 17022, 'uat_code': 11032, 'prod_code': 19363, 'tenure': 3, 'adult_count': 1, 'child_count': 0, 'plan_name': 'EL_Individual_Adult_3Year'},
        {'id': 17022, 'uat_code': 11033, 'prod_code': 19364, 'tenure': 3, 'adult_count': 2, 'child_count': 0, 'plan_name': 'EL_2Adults_3Year'},
        {'id': 17022, 'uat_code': 11034, 'prod_code': 19365, 'tenure': 3, 'adult_count': 2, 'child_count': 1, 'plan_name': 'EL_2Adults_1Child_3Year'},
        {'id': 17022, 'uat_code': 11035, 'prod_code': 19366, 'tenure': 3, 'adult_count': 2, 'child_count': 2, 'plan_name': 'EL_2Adults_2Child_3Year'},
        {'id': 17022, 'uat_code': 11036, 'prod_code': 19367, 'tenure': 3, 'adult_count': 2, 'child_count': 3, 'plan_name': 'EL_2Adults_3Child_3Year'},
        {'id': 17022, 'uat_code': 11037, 'prod_code': 19368, 'tenure': 3, 'adult_count': 1, 'child_count': 1, 'plan_name': 'EL_1Adult_1Child_3Year'},
        {'id': 17022, 'uat_code': 11038, 'prod_code': 19369, 'tenure': 3, 'adult_count': 1, 'child_count': 2, 'plan_name': 'EL_1Adult_2Child_3Year'},
        {'id': 17023, 'uat_code': 11039, 'prod_code': 19379, 'tenure': 1, 'adult_count': 0, 'child_count': 1, 'plan_name': 'ELP_Individual_Child_1Year'},
        {'id': 17023, 'uat_code': 11040, 'prod_code': 19381, 'tenure': 1, 'adult_count': 1, 'child_count': 0, 'plan_name': 'ELP_Individual_Adult_1Year'},
        {'id': 17023, 'uat_code': 11041, 'prod_code': 19383, 'tenure': 1, 'adult_count': 2, 'child_count': 0, 'plan_name': 'ELP_2Adults_1Year'},
        {'id': 17023, 'uat_code': 11042, 'prod_code': 19385, 'tenure': 1, 'adult_count': 2, 'child_count': 1, 'plan_name': 'ELP_2Adults_1Child_1Year'},
        {'id': 17023, 'uat_code': 11043, 'prod_code': 19386, 'tenure': 1, 'adult_count': 2, 'child_count': 2, 'plan_name': 'ELP_2Adults_2Child_1Year'},
        {'id': 17023, 'uat_code': 11044, 'prod_code': 19388, 'tenure': 1, 'adult_count': 2, 'child_count': 3, 'plan_name': 'ELP_2Adults_3Child_1Year'},
        {'id': 17023, 'uat_code': 11045, 'prod_code': 19390, 'tenure': 1, 'adult_count': 1, 'child_count': 1, 'plan_name': 'ELP_1Adult_1Child_1Year'},
        {'id': 17023, 'uat_code': 11046, 'prod_code': 19392, 'tenure': 1, 'adult_count': 1, 'child_count': 2, 'plan_name': 'ELP_1Adult_2Child_1Year'},
        {'id': 17023, 'uat_code': 11047, 'prod_code': 19394, 'tenure': 2, 'adult_count': 0, 'child_count': 1, 'plan_name': 'ELP_Individual_Child_2Year'},
        {'id': 17023, 'uat_code': 11048, 'prod_code': 19396, 'tenure': 2, 'adult_count': 1, 'child_count': 0, 'plan_name': 'ELP_Individual_Adult_2Year'},
        {'id': 17023, 'uat_code': 11049, 'prod_code': 19397, 'tenure': 2, 'adult_count': 2, 'child_count': 0, 'plan_name': 'ELP_2Adults_2Year'},
        {'id': 17023, 'uat_code': 11050, 'prod_code': 19398, 'tenure': 2, 'adult_count': 2, 'child_count': 1, 'plan_name': 'ELP_2Adults_1Child_2Year'},
        {'id': 17023, 'uat_code': 11051, 'prod_code': 19401, 'tenure': 2, 'adult_count': 2, 'child_count': 2, 'plan_name': 'ELP_2Adults_2Child_2Year'},
        {'id': 17023, 'uat_code': 11052, 'prod_code': 19402, 'tenure': 2, 'adult_count': 2, 'child_count': 3, 'plan_name': 'ELP_2Adults_3Child_2Year'},
        {'id': 17023, 'uat_code': 11053, 'prod_code': 19404, 'tenure': 2, 'adult_count': 1, 'child_count': 1, 'plan_name': 'ELP_1Adult_1Child_2Year'},
        {'id': 17023, 'uat_code': 11054, 'prod_code': 19406, 'tenure': 2, 'adult_count': 1, 'child_count': 2, 'plan_name': 'ELP_1Adult_2Child_2Year'},
        {'id': 17023, 'uat_code': 11055, 'prod_code': 19408, 'tenure': 3, 'adult_count': 0, 'child_count': 1, 'plan_name': 'ELP_Individual_Child_3Year'},
        {'id': 17023, 'uat_code': 11056, 'prod_code': 19410, 'tenure': 3, 'adult_count': 1, 'child_count': 0, 'plan_name': 'ELP_Individual_Adult_3Year'},
        {'id': 17023, 'uat_code': 11057, 'prod_code': 19411, 'tenure': 3, 'adult_count': 2, 'child_count': 0, 'plan_name': 'ELP_2Adults_3Year'},
        {'id': 17023, 'uat_code': 11058, 'prod_code': 19413, 'tenure': 3, 'adult_count': 2, 'child_count': 1, 'plan_name': 'ELP_2Adults_1Child_3Year'},
        {'id': 17023, 'uat_code': 11059, 'prod_code': 19414, 'tenure': 3, 'adult_count': 2, 'child_count': 2, 'plan_name': 'ELP_2Adults_2Child_3Year'},
        {'id': 17023, 'uat_code': 11060, 'prod_code': 19416, 'tenure': 3, 'adult_count': 2, 'child_count': 3, 'plan_name': 'ELP_2Adults_3Child_3Year'},
        {'id': 17023, 'uat_code': 11061, 'prod_code': 19418, 'tenure': 3, 'adult_count': 1, 'child_count': 1, 'plan_name': 'ELP_1Adult_1Child_3Year'},
        {'id': 17023, 'uat_code': 11062, 'prod_code': 19421, 'tenure': 3, 'adult_count': 1, 'child_count': 2, 'plan_name': 'ELP_1Adult_2Child_3Year'}
    ];
    index = CHI_Plans.findIndex(x => x.id === planId && x.child_count === this.lm_request['child_count']
                && x.adult_count === this.lm_request['adult_count'] && x.tenure === this.lm_request['policy_tenure']);

    this.prepared_request['dbmaster_pb_plan_name'] = (index === -1 ? '' : CHI_Plans[index]['plan_name']);
    if (config.environment.name === 'Production') {
        this.prepared_request['plan_code'] = (index === -1 ? '' : CHI_Plans[index]['prod_code']);
        this.processed_request['___dbmaster_pb_plan_name___'] = this.prepared_request['dbmaster_pb_plan_name'];
    } else {
        this.prepared_request['plan_code'] = (index === -1 ? '' : CHI_Plans[index]['uat_code']);
        this.processed_request['___dbmaster_pb_plan_name___'] = this.prepared_request['dbmaster_pb_plan_name'].includes("HSH_") ? this.prepared_request['dbmaster_pb_plan_name'] + "_N" : this.prepared_request['dbmaster_pb_plan_name'];
    }
    this.processed_request['___plan_code___'] = this.prepared_request['plan_code'];
};
IciciLombardHealth.prototype.get_quote_date = function () {
    var moment = require('moment');
    var today = moment().utcOffset("+05:30");
    var quote_date = today.format('YYYY-MM-DD');
    return quote_date;
};
IciciLombardHealth.prototype.getHeight = function (member) {
    var hieghtInCm = this.prepared_request['member_' + member + '_height'];
    var realFeet = ((hieghtInCm * 0.393700) / 12);
    var feet = Math.floor(realFeet);
    var inches = Math.round((realFeet - feet) * 12);
    if (inches === 12) {
        feet += 1;
        inches = 0;
    }
    this.prepared_request['member_' + member + '_HeightInFt'] = feet;
    this.processed_request['___member_' + member + '_HeightInFt___'] = this.prepared_request['member_' + member + '_HeightInFt'];
    this.prepared_request['member_' + member + '_HeightInInch'] = inches;
    this.processed_request['___member_' + member + '_HeightInInch___'] = this.prepared_request['member_' + member + '_HeightInInch'];
};
IciciLombardHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('IciciLombardHealth is_valid_plan', 'start');
    var index = -1;
    var ILPlans = [];
    let age = true;
    let memberCount = true;
    if(lm_request.hasOwnProperty('adult_count') && lm_request.hasOwnProperty('child_count')){
        if((lm_request['adult_count'] === 1 && lm_request['child_count'] === 3) || (lm_request['adult_count'] === 2 && lm_request['child_count'] === 4)){
            memberCount = false;
        }
    }
    if (lm_request.hasOwnProperty('is_hospi') && lm_request['is_hospi'] === "yes") {
        age = this.lm_request['member_1_age'] > 55 ? false : true;
        ILPlans = [
            {'id': 16079, 'code': 10528, 'adult_count': lm_request['adult_count'], 'child_count': lm_request['child_count']}
        ];
    } else {
        ILPlans = [
            {'id': 17020, 'code': 10935, 'adult_count': lm_request['adult_count'], 'child_count': lm_request['child_count']},
            {'id': 17021, 'code': 10936, 'adult_count': lm_request['adult_count'], 'child_count': lm_request['child_count']},
            {'id': 17022, 'code': 10937, 'adult_count': lm_request['adult_count'], 'child_count': lm_request['child_count']},
            {'id': 17023, 'code': 10938, 'adult_count': lm_request['adult_count'], 'child_count': lm_request['child_count']}
        ];
    }

    index = ILPlans.findIndex(x => age === true && x.child_count === lm_request['child_count']
                && x.adult_count === lm_request['adult_count'] && x.code === planCode && memberCount === true);
    return (index > -1 ? true : false);
    console.log('IciciLombardHealth is_valid_plan', 'End');
};
module.exports = IciciLombardHealth;