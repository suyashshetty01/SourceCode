var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Health = require(appRoot + '/libs/Health');
var config = require('config');
var fs = require('fs');
var moment = require('moment');
var sleep = require('system-sleep');
function SBIGeneralHealth() {
}
util.inherits(SBIGeneralHealth, Health);
SBIGeneralHealth.prototype.lm_request_single = {};
SBIGeneralHealth.prototype.insurer_integration = {};
SBIGeneralHealth.prototype.insurer_addon_list = [];
SBIGeneralHealth.prototype.insurer = {};
SBIGeneralHealth.prototype.insurer_date_format = 'yyyy-MM-dd';
SBIGeneralHealth.prototype.const_insurer_suminsured = [100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 600000, 700000, 800000, 900000, 1000000,
    1100000, 1200000, 1300000, 1400000, 1500000, 1600000, 1700000, 1800000, 1900000, 2000000, 2100000, 2200000,
    2300000, 2400000, 2500000, 2600000, 2700000, 2800000, 2900000, 3000000, 3100000, 3200000, 3300000, 3400000,
    3500000, 3600000, 3700000, 3800000, 3900000, 4000000, 4100000, 4200000, 4300000, 4400000, 4500000, 4600000,
    4700000, 4800000, 4900000, 5000000];
SBIGeneralHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
SBIGeneralHealth.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];
    this.prepared_request['timestamp'] = this.timestamp();
    this.processed_request['___timestamp___'] = this.prepared_request['timestamp'];
    this.prepared_request['transactionTimestamp'] = this.current_time();
    this.processed_request['___transactionTimestamp___'] = this.prepared_request['transactionTimestamp'];
    this.prepared_request['pre_exist_disease'] = 'N';
    this.processed_request['___pre_exist_disease___'] = 'N';
    this.processed_request['___policy_start_date___'] = new moment().format('YYYY-MM-DDThh:mm:ss');
    this.processed_request['___policy_end_date___'] = this.expiry_date(this.prepared_request["current_date"]);
    var policy_type = (this.lm_request['health_insurance_type'] === 'individual') ? '1' : '3';
    this.prepared_request["isInsured"] = this.prepared_request["relation"] === '1' ? '1' : '0';
    this.processed_request['___isInsured___'] = this.prepared_request["isInsured"];
    this.prepared_request['policy_type'] = policy_type;
    this.processed_request['___policy_type___'] = policy_type;
    var obj_member_type = this.get_member_type(this.prepared_request['Plan_Id']);
    this.prepared_request['get_member_type'] = obj_member_type;
    this.processed_request['___get_member_type___'] = this.prepared_request['get_member_type'];
    this.prepared_request['agreement_code'] = ((config.environment.name !== 'Production') ? '102359' : '48218');//PRELIVE-102359
    this.processed_request['___agreement_code___'] = this.prepared_request['agreement_code'];
    if (this.lm_request['method_type'] === 'Premium') {
        var obj_si = this.health_insurance_si_2(this.prepared_request['Plan_Code'], this.prepared_request['health_insurance_si']);
        this.prepared_request['health_insurance_si_2'] = obj_si;
        this.processed_request['___health_insurance_si_2___'] = this.prepared_request['health_insurance_si_2'];
        if (this.prepared_request['Plan_Id'] === 1704) {
            this.prepared_request['additional_children'] = child > 3 ? '1' : '0';
            this.processed_request['___additional_children___'] = this.prepared_request['additional_children'];
            this.method['Method_Request_File'] = "SBIGeneral_Sanjeevani_Health_Premium.json";
            this.method['Service_URL'] = (config.environment.name !== 'Production') ? "https://devapi.sbigeneral.in/cld/v1/quickquote/ASAN001" : "https://api.sbigeneral.in/cld/v1/quickquote/ASAN001";
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/' + this.method.Method_Request_File).toString();
            this.method_content = method_content;
            console.log('Arogya Sanjeevani plan....' + this.method_content);
        }
        if (this.processed_request['___health_insurance_type___'] === 'individual' && this.processed_request['___adult_count___'] === 1) {
            var family_floater_cat = this.find_text_btw_key(this.method_content.toString(), '<!--FamilyFloaterCat_Start-->', '<!--FamilyFloaterCat_End-->', true);
            this.method_content = this.method_content.replace(family_floater_cat, '');
        }
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_rel'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_rel___'] = this.prepared_request['member_' + member + '_rel'];
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_rel'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_rel___'] = this.prepared_request['member_' + member + '_rel'];
        }
        if (this.method_content[0] !== '<') {
            txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
            var Total_Count = this.lm_request['member_count'];
            for (var x = 1; x <= Total_Count - 1; x++) {
                txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', ",");
            }
            txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', "");
        }
        this.method_content = this.method_content.replace('<!--FamilyFloaterCat_Start-->', "");
        this.method_content = this.method_content.replace('<!--FamilyFloaterCat_End-->', "");
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
    }

    if (this.lm_request['method_type'] === 'Customer') {
        var obj_si = this.health_insurance_si_2(this.prepared_request['dbmaster_pb_plan_code'], this.prepared_request['health_insurance_si']);
        this.prepared_request['health_insurance_si_2'] = obj_si;
        this.processed_request['___health_insurance_si_2___'] = this.prepared_request['health_insurance_si_2'];
        var obj_member_type = this.get_member_type(this.prepared_request['dbmaster_plan_id']);
        this.prepared_request['get_member_type'] = obj_member_type;
        this.processed_request['___get_member_type___'] = this.prepared_request['get_member_type'];
        if (this.prepared_request['dbmaster_plan_id'] === 1704) {
            this.prepared_request['additional_children'] = child > 3 ? '1' : '0';
            this.processed_request['___additional_children___'] = this.prepared_request['additional_children'];
            this.method['Method_Request_File'] = "SBIGeneral_Sanjeevani_Health_Customer.json";
            this.method['Service_URL'] = (config.environment.name !== 'Production') ? "https://devapi.sbigeneral.in/cld/v1/fullquote/ASAN001" : "https://api.sbigeneral.in/cld/v1/fullquote/ASAN001";
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/' + this.method.Method_Request_File).toString();
            this.method_content = method_content;
            console.log('Proposal Arogya Sanjeevani plan....' + this.method_content);
        }
        if (this.processed_request['___health_insurance_type___'] === 'individual' && this.processed_request['___adult_count___'] === 1) {
            var family_floater_cat = this.find_text_btw_key(this.method_content.toString(), '<!--FamilyFloaterCat_Start-->', '<!--FamilyFloaterCat_End-->', true);
            this.method_content = this.method_content.replace(family_floater_cat, '');
        }
        console.log('Removed node....' + this.method_content);
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_rel'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_rel___'] = this.prepared_request['member_' + member + '_rel'];
            if (this.processed_request['___member_' + member + '_rel___'] === '3' || this.processed_request['___member_' + member + '_rel___'] === '4') {
                this.processed_request['___member_' + member + '_occupation___'] = '847';
            }
            this.prepared_request['member_' + member + '_qualification'] = this.lm_request['member_' + member + '_qualification'];
            this.processed_request['___member_' + member + '_qualification___'] = this.prepared_request['member_' + member + '_qualification'];
            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = '0';
                            this.processed_request['___' + ques_detail + '___'] = '0';
                            if (ques_detail.includes('1704')) {
                                this.processed_request['___' + key + '___'] = '';
                            }
                        } else {
                            this.prepared_request[ques_detail] = '1';
                            this.processed_request['___' + ques_detail + '___'] = '1';

                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        if (ques_detail.includes('1704')) {
                            this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                            this.processed_request['___' + key + '___'] = this.prepared_request[ques_detail];
                            this.processed_request['___' + ques_detail + '___'] = '1';
                        } else {
                            this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                            this.processed_request['___' + ques_detail + '___'] = this.prepared_request[ques_detail];
                        }
                    }
                }
            }
            if ((this.prepared_request['member_' + member + '_question_1704_details']) !== '0' || (this.prepared_request['member_' + member + '_question_1705_details']) !== '0' ||
                    (this.prepared_request['member_' + member + '_question_1706_details']) === '1' || (this.prepared_request['member_' + member + '_question_1707_details']) === '1') {
                this.processed_request['___pre_exist_disease___'] = 'Yes';
            }
        }
        for (member = 3; member <= child + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_rel'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_rel___'] = this.prepared_request['member_' + member + '_rel'];
            if (this.processed_request['___member_' + member + '_rel___'] === '3' || this.processed_request['___member_' + member + '_rel___'] === '4') {
                this.processed_request['___member_' + member + '_occupation___'] = '847';
            }
            this.prepared_request['member_' + member + '_qualification'] = this.lm_request['member_' + member + '_qualification'];
            this.processed_request['___member_' + member + '_qualification___'] = this.prepared_request['member_' + member + '_qualification'];
            this.processed_request['___member_' + member + '_occupation___'] = '847';
            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = '0';
                            this.processed_request['___' + ques_detail + '___'] = '0';
                            if (ques_detail.includes('1704')) {
                                this.processed_request['___' + key + '___'] = '';
                            }
                        } else {
                            this.prepared_request[ques_detail] = '1';
                            this.processed_request['___' + ques_detail + '___'] = '1';

                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        if (ques_detail.includes('1704')) {
                            this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                            this.processed_request['___' + key + '___'] = this.prepared_request[ques_detail];
                            this.processed_request['___' + ques_detail + '___'] = '1';
                        } else {
                            this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                            this.processed_request['___' + ques_detail + '___'] = this.prepared_request[ques_detail];
                        }
                    }
                }
            }
            if ((this.prepared_request['member_' + member + '_question_1704_details']) !== '0' || (this.prepared_request['member_' + member + '_question_1705_details']) !== '0' ||
                    (this.prepared_request['member_' + member + '_question_1706_details']) === '1' || (this.prepared_request['member_' + member + '_question_1707_details']) === '1') {
                this.processed_request['___pre_exist_disease___'] = 'Yes';
            }
        }
        console.log('Customer Request.........' + this.method_content);
        if (this.method_content[0] !== '<') {// for json
            txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
            var Total_Count = this.lm_request['member_count'];
            for (var x = 1; x <= Total_Count - 1; x++) {
                txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', ",");
            }
            txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', "");
        }
        this.lm_request['insurer_transaction_identifier'] === undefined ? this.method_content = this.method_content.replace('<!--qutation_no-->', ' ') : this.method_content = this.method_content.replace('<!--qutation_no-->', '"QuotationNo": ' + '"' + this.lm_request['insurer_transaction_identifier'] + '",');
        this.method_content = this.method_content.replace('<!--FamilyFloaterCat_Start-->', "");
        this.method_content = this.method_content.replace('<!--FamilyFloaterCat_End-->', "");
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        console.log('After hide node.....' + this.method_content);
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        this.prepared_request["crn"] = this.lm_request["crn"];
        this.processed_request["___crn___"] = this.prepared_request["crn"];
        this.prepared_request["amount_in_ps"] = (this.prepared_request['insurer_customer_identifier_2'] * 100);
        this.processed_request["___amount_in_ps___"] = this.prepared_request["amount_in_ps"];
    }
    if (this.lm_request['method_type'] === 'Verification') {
        this.prepared_request['pay_id'] = this.lm_request['pg_get']['PayId'];
        this.processed_request['___pay_id___'] = this.prepared_request['pay_id'];
        var final_amoumt = this.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['amount'];
        var obj_replace = {
            '"Amount": ""': '"Amount": ' + '"' + final_amoumt + '"'
        };
        this.method_content = this.method_content.toString().replaceJson(obj_replace);
    }
};
SBIGeneralHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
SBIGeneralHealth.prototype.insurer_product_field_process_post = function () {
};
SBIGeneralHealth.prototype.insurer_product_api_post = function () {
};
SBIGeneralHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');
    try {
        let objInsurerProduct = this;
        let body = docLog.Insurer_Request;
        let Client = require('node-rest-client').Client;
        let client = new Client();
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        let auth_url = (config.environment.name !== 'Production') ? "https://devapi.sbigeneral.in/cld/v1/token" : "https://api.sbigeneral.in/cld/v1/token";
        if (specific_insurer_object.method.Method_Type === 'Pdf') {
            sleep(30000);
        }
        if (specific_insurer_object.method.Method_Type === 'Proposal') {
            var username = ((config.environment.name !== 'Production') ? 'rzp_test_TNM7NAj5tr8DiY' : 'rzp_live_8Ny7DUm4i5cGqL');
            var password = ((config.environment.name !== 'Production') ? 'ihcTD8qpM1ruxnS8L1OI8TFq' : 'hqcKvSP0AUSGH75sCufo5BRO');
            var args1 = {
                data: JSON.parse(body),
                headers: {"Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                }
            };
//            console.log(JSON.stringify(args1));
            client.post(specific_insurer_object.method_file_url, args1, function (data, response) {
                // parsed response body as js object 
//                console.log('Order Data', data.toString());
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
            var args = {
                headers: {
                    "X-IBM-Client-Id": objInsurerProduct.processed_request["___insurer_integration_service_user___"],
                    "X-IBM-Client-Secret": objInsurerProduct.processed_request["___insurer_integration_service_password___"],
                    "Content-Type": "application/json"
                }
            };
            client.get(auth_url, args, function (data, response) {
                let AuthKey = data['access_token'];
                if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
                    var args = {
                        data: body,
                        headers: {
                            "Content-Type": "application/json",
                            "X-IBM-Client-Id": objInsurerProduct.processed_request["___insurer_integration_service_user___"],
                            "X-IBM-Client-Secret": objInsurerProduct.processed_request["___insurer_integration_service_password___"],
                            "Authorization": "Bearer " + AuthKey
                        }
                    };
                }
                if ((docLog['Plan_Id'] === 1704 && docLog['Method_Type'] === 'Premium') || (docLog['LM_Custom_Request']['dbmaster_pb_plan_id'] === 1704 && docLog['Method_Type'] !== 'Pdf')) {
//                    console.log('PLAN :: ' + docLog.Plan_Name, '\n' + body);
                    client.post(specific_insurer_object.method.Service_URL, args, function (data, response) {
//                        console.log(response.statusCode);
                        let objData = JSON.stringify(data);
                        let objResponseFull = {
                            'err': null,
                            'result': objData,
                            'raw': objData,
                            'soapHeader': null,
                            'objResponseJson': JSON.parse(objData)
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                } else if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
//                    console.log('PLAN :: ' + docLog.Plan_Name, '\n' + body);
                    client.post(specific_insurer_object.method_file_url, args, function (data, response) {
//                        console.log(response.statusCode);
                        let objData = JSON.stringify(data);
                        let objResponseFull = {
                            'err': null,
                            'result': objData,
                            'raw': objData,
                            'soapHeader': null,
                            'objResponseJson': JSON.parse(objData)
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                } else if (specific_insurer_object.method.Method_Type === 'Pdf') {
                    var args = {
                        headers: {
                            "X-IBM-Client-Id": objInsurerProduct.processed_request["___insurer_integration_service_user___"],
                            "X-IBM-Client-Secret": objInsurerProduct.processed_request["___insurer_integration_service_password___"],
                            "Authorization": "Bearer " + AuthKey,
                            "Content-Type": "application/json"
                        }
                    };
//                    console.log(JSON.stringify(args));
                    var qs = '?policyNumber=' + objInsurerProduct.processed_request["___policy_number___"];
                    client.get(specific_insurer_object.method_file_url + qs, args, function (data, response) {
                        var objResponseFull = {
                            'err': null,
                            'result': data,
                            'raw': JSON.stringify(data),
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                }
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
SBIGeneralHealth.prototype.premium_response_handler = function (objResponseJson) {
//    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('messages')) {
            if (objResponseJson['messages'][0]['code'] !== '') {
                Error_Msg = objResponseJson['messages'][0]['message'];
            }
        } else if (objResponseJson.hasOwnProperty('traceId')) {
            Error_Msg = objResponseJson['message'];
        } else if (objResponseJson.hasOwnProperty('httpCode')) {
            Error_Msg = objResponseJson['moreInformation'];
        }
        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.get_const_premium_breakup();
            premium_breakup['net_premium'] = objResponseJson['BeforeVatPremium'];
            premium_breakup['gross_premium'] = objResponseJson['GrossPremium'];
            premium_breakup['service_tax'] = objResponseJson['TGST'];
            premium_breakup['final_premium'] = Math.round(objResponseJson['DuePremium']);
            objServiceHandler.Premium_Breakup = premium_breakup;
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
SBIGeneralHealth.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    var error = '';
    try {
        if (objResponseJson.hasOwnProperty('messages')) {
            if (objResponseJson['messages'][0]['code'] !== '') {
                Error_Msg = objResponseJson['messages'][0]['message'];
            }
        } else if (objResponseJson.hasOwnProperty('traceId')) {
            Error_Msg = objResponseJson['message'];
        }
        if (objResponseJson['UnderwritingResult']['Status'] !== 'Success') {
            Error_Msg = "Proposal Rejected";
            if (objResponseJson['UnderwritingResult'].hasOwnProperty('MessageList')) {
                var message_list = objResponseJson['UnderwritingResult']['MessageList'];
                for (var i in message_list) {
                    error = objResponseJson['UnderwritingResult']['MessageList'][i]['Message'] + '\t';
                    if (error.includes("Obesity")) {
                        Error_Msg = "Member BMI category is Obesity";
                    } else if (error.includes("Underweight")) {
                        Error_Msg = "Member BMI category is Underweight";
                    } else if (error.includes("Overweight")) {
                        Error_Msg = "Member BMI category is Overweight";
                    } else {
                        Error_Msg = error;
                    }
                }
            }
        }
        if (this.processed_request['___pre_exist_disease___'] === 'Yes') {
            Error_Msg = "Regret, policy cannot be issued online. Please contact nearest SBIG branch.";
        }
        if (Error_Msg === 'NO_ERR') {
            var Customer = {
                'insurer_customer_identifier': objResponseJson['PolicyObject'].QuotationNo,
                'insurer_customer_identifier_2': objResponseJson['PolicyObject'].DuePremium
            };
            objServiceHandler.Customer = Customer;
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
SBIGeneralHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('status') && objResponseJson['status'] === 'created') {
        } else {
            Error_Msg = JSON.stringify(objResponseJson["error"]);
        }
        if (Error_Msg === 'NO_ERR') {
            var merchant_key = ((config.environment.name === 'Production') ? 'rzp_live_8Ny7DUm4i5cGqL' : 'rzp_test_TNM7NAj5tr8DiY');
            var pg_data = {
                'key': merchant_key,
                'full_name': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                'return_url': this.const_payment.pg_ack_url,
                'phone': this.lm_request['mobile'],
                'orderId': objResponseJson["id"],
                'txnId': objResponseJson['receipt'],
                'quoteId': this.prepared_request['insurer_customer_identifier'],
                'amount': this.prepared_request['insurer_customer_identifier_2'],
                'email': this.lm_request['email'],
                'img_url': 'https://www.policyboss.com/Images/insurer_logo/SBI_General.png',
                'agrmnt_code': this.prepared_request['agreement_code']
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request['insurer_customer_identifier'];
        }
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
SBIGeneralHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        let Client = require('node-rest-client').Client;
        let client = new Client();
        var objInsurerProduct = this;
        var secret_key = ((config.environment.name === 'Production') ? 'hqcKvSP0AUSGH75sCufo5BRO' : 'ihcTD8qpM1ruxnS8L1OI8TFq');
        var output = this.const_payment_response.pg_get;
        if (output.hasOwnProperty('Status') && output['Status'] === 'Success') {
            var gen_signature = this.encrypt_to_hmac_256(output['OrderId'] + '|' + output['PayId'], secret_key).toLowerCase();
            this.const_policy.transaction_id = output['PayId'];
            this.const_policy.pg_reference_number_1 = output['OrderId'];
            this.const_policy.pg_reference_number_2 = output['Signature'];
            if (gen_signature === output['Signature']) {//Razorpay verification
                var username = ((config.environment.name !== 'Production') ? 'rzp_test_TNM7NAj5tr8DiY' : 'rzp_live_8Ny7DUm4i5cGqL');
                var args = {
                    headers: {
                        "Accept": "application/json",
                        'Authorization': 'Basic ' + new Buffer(username + ':' + secret_key).toString('base64')
                    }
                };
                client.get("https://api.razorpay.com/v1/payments/" + output['PayId'], args, function (data, response) {
                    // parsed response body as js object 
                    console.log('RazorPay Status', JSON.stringify(data));
                    if (data['status'] === "captured") {
                        objInsurerProduct.const_policy.pg_status = 'SUCCESS';
                        objInsurerProduct.const_policy.transaction_status = 'SUCCESS';
                    } else {
                        objInsurerProduct.const_policy.pg_status = 'FAIL';
                        objInsurerProduct.const_policy.transaction_status = 'FAIL';
                    }
                });
                sleep(3000);
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
SBIGeneralHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        if (objResponseJson.hasOwnProperty('traceId')) {
            Error_Msg = objResponseJson['message'];
        }
        if (this.const_policy.pg_status === 'FAIL') {
        }
        if (this.const_policy.pg_status === 'SUCCESS') {
            if (objResponseJson.hasOwnProperty('PolicyNo')) {
                this.const_policy.policy_number = objResponseJson['PolicyNo'];
            } else {
                Error_Msg = (Error_Msg === 'NO_ERR') ? "LM_POLICY_NUMBER_NA" : Error_Msg;
            }
            if (Error_Msg === 'NO_ERR') {
                this.const_policy.transaction_status = 'SUCCESS';
                if (this.const_policy.policy_number !== '' && this.const_policy.policy_number !== null && this.const_policy.policy_number !== undefined) {
                    this.const_policy.transaction_substatus = "IF";
                    var pdf_file_name = this.constructor.name + '_' + 'Health' + '_' + this.const_policy.policy_number + '.pdf';
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
                } else {
                    this.const_policy.transaction_substatus = "UW";
                }
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }

            objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
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
SBIGeneralHealth.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
SBIGeneralHealth.prototype.pdf_response_handler = function (objResponseJson) {
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
        if (objResponseJson.hasOwnProperty('getPolicyDocumentResponseBody')) {
            var bufferData = objResponseJson['getPolicyDocumentResponseBody']['payload']['URL'];
            if (bufferData.length < 2) {
                Error_Msg = objResponseJson['getPolicyDocumentResponseBody']['payload']['URL'][0];
            }
        }
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson) {
                var pdfData = objResponseJson['getPolicyDocumentResponseBody']['payload']['URL'][1];
                var pdf_file_name = this.constructor.name + '_Health_' + this.lm_request['policy_number'] + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(pdfData, 'base64');
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
SBIGeneralHealth.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start SBIGeneralHealth');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in SBIGeneralHealth " + gender);
    if (this.prepared_request["relation"] === '3' || this.prepared_request["relation"] === '4') {
        return(gender === 'M' ? '5' : '6');
    }
    if (this.prepared_request["relation"] === '6' || this.prepared_request["relation"] === '5') {
        return(gender === 'M' ? '3' : '4');
    }
    if (this.prepared_request["relation"] === '2') {
        return '2';
    }
    if (this.prepared_request["relation"] === '1' || this.prepared_request["relation"] === '') {
        if (i >= 3) {
            return(gender === 'M' ? '3' : '4');
        } else if (i === 1) {
            return '1';
        } else if (i === 2) {
            return '2';
        }
    }
    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End SBIGeneralHealth');
};
Health.prototype.expiry_date = function (date) {
    console.log('Start', this.constructor.name, 'policy_expiry_date');
    if (this.lm_request.hasOwnProperty('policy_tenure') && this.lm_request['policy_tenure'] > 0) {
        end_date = moment(date).add(this.lm_request['policy_tenure'], 'year').format('YYYY-MM-DD');
        var pol_end_date = moment(end_date).subtract(1, 'd').format('YYYY-MM-DD');
    }
    console.log('Finish', this.constructor.name, 'expiry_date', pol_end_date);
    return pol_end_date;
};
SBIGeneralHealth.prototype.get_member_type = function (planid) {
    console.log('SBIGeneralHealth health', 'start');
    var index = -1;
    var get_plan_type = -1;
    var ff_plan = [
        {'id': 1701, 'code': 0, 'adult_count': 1, 'child_count': 0},
        {'id': 1701, 'code': 1, 'adult_count': 2, 'child_count': 0},
        {'id': 1701, 'code': 2, 'adult_count': 2, 'child_count': 1},
        {'id': 1701, 'code': 3, 'adult_count': 2, 'child_count': 2},
        {'id': 1701, 'code': 4, 'adult_count': 1, 'child_count': 1},
        {'id': 1701, 'code': 5, 'adult_count': 1, 'child_count': 2},
        {'id': 1704, 'code': '', 'adult_count': 1, 'child_count': 0},
        {'id': 1704, 'code': 2, 'adult_count': 1, 'child_count': 1},
        {'id': 1704, 'code': 3, 'adult_count': 1, 'child_count': 2},
        {'id': 1704, 'code': 4, 'adult_count': 1, 'child_count': 3},
        {'id': 1704, 'code': 4, 'adult_count': 1, 'child_count': 4},
        {'id': 1704, 'code': 5, 'adult_count': 2, 'child_count': 0},
        {'id': 1704, 'code': 6, 'adult_count': 2, 'child_count': 1},
        {'id': 1704, 'code': 7, 'adult_count': 2, 'child_count': 2},
        {'id': 1704, 'code': 8, 'adult_count': 2, 'child_count': 3},
        {'id': 1704, 'code': 8, 'adult_count': 2, 'child_count': 4}

    ];
    if (planid === 1701) {
        index = ff_plan.findIndex(x => x.child_count === this.lm_request['child_count']
                    && x.adult_count === this.lm_request['adult_count'] && x.id === planid);
    } else {
        index = ff_plan.findIndex(x => x.child_count === this.lm_request['child_count']
                    && x.adult_count === this.lm_request['adult_count']
                    && x.id === planid);
    }
    get_plan_type = (index === -1 ? '' : ff_plan[index]['code']);
    return get_plan_type;
    console.log('SBIGeneralHealth get_plan', 'End');
};
SBIGeneralHealth.prototype.current_time = function () {
    var date = new moment().format('DD-MMM-YYYY-hh:mm:ss');
    return date;
};
SBIGeneralHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('SBIGeneralHealth is_valid_plan', 'start');
    var index = -1;
    var member_type = true;
    var age = true;
    var si = true;
    if (planCode === "OPDH001" && ((lm_request['adult_count'] === 1 || lm_request['adult_count'] === 2) && (lm_request['child_count'] === 3 || lm_request['child_count'] === 4))) {
        member_type = false;
    }
    if (((planCode === "ASAN001" || planCode === "OPDH001") && lm_request['member_1_age'] > 55)) {
        age = false;
    }
    if (planCode === "OPDH001" && (parseInt(lm_request['health_insurance_si']) === 150000 || parseInt(lm_request['health_insurance_si']) === 250000)) {
        si = false;
    }
    var SBI_Plans = [
        {'code': "OPDH001", 'min_si': 99000, 'max_si': 300000},
        {'code': "HNIH001", 'min_si': 990000, 'max_si': 3000000},
        {'code': "TOPUPH1", 'min_si': 99000, 'max_si': 5000000},
        {'code': "ASAN001", 'min_si': 99000, 'max_si': 500000}
    ];
    index = SBI_Plans.findIndex(x => x.code === planCode && member_type === true && age === true && si === true
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('SBIGeneralHealth is_valid_plan', 'End');
};
SBIGeneralHealth.prototype.health_insurance_si_2 = function (plan_Code, si) {
    console.log('health_insurance_si_2', 'start');
    var mediclaim = [
        {'code': '1', 'sum_ins': 100000, 'plan_code': 'ASAN001'},
        {'code': '2', 'sum_ins': 150000, 'plan_code': 'ASAN001'},
        {'code': '3', 'sum_ins': 200000, 'plan_code': 'ASAN001'},
        {'code': '4', 'sum_ins': 250000, 'plan_code': 'ASAN001'},
        {'code': '5', 'sum_ins': 300000, 'plan_code': 'ASAN001'},
        {'code': '6', 'sum_ins': 350000, 'plan_code': 'ASAN001'},
        {'code': '7', 'sum_ins': 400000, 'plan_code': 'ASAN001'},
        {'code': '8', 'sum_ins': 450000, 'plan_code': 'ASAN001'},
        {'code': '9', 'sum_ins': 500000, 'plan_code': 'ASAN001'},
        {'code': '51', 'sum_ins': 100000, 'plan_code': 'OPDH001'},
        {'code': '52', 'sum_ins': 200000, 'plan_code': 'OPDH001'},
        {'code': '53', 'sum_ins': 300000, 'plan_code': 'OPDH001'}

    ];
    var index = mediclaim.findIndex(x => x.sum_ins === si - 0 && x.plan_code === plan_Code);
    if (index === -1) {
        return "";
    }
    return mediclaim[index]['code'];
    console.log('health_insurance_si_2', 'end');
};
SBIGeneralHealth.prototype.premium_breakup_schema = {
    "net_premium": "BeforeVatPremium",
    "service_tax": "serviceTax",
    "SBC": "SBC",
    "KKC": "KKC",
    "gross_premium": "GrossPremium",
    "final_premium": "DuePremium"
};
module.exports = SBIGeneralHealth;