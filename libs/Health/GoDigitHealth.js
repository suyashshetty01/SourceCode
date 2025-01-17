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
function GoDigitHealth() {

}
util.inherits(GoDigitHealth, Health);
GoDigitHealth.prototype.lm_request_single = {};
GoDigitHealth.prototype.insurer_integration = {};
GoDigitHealth.prototype.insurer_addon_list = [];
GoDigitHealth.prototype.insurer = {};
GoDigitHealth.prototype.insurer_date_format = 'yyyy-MM-dd';
GoDigitHealth.prototype.const_insurer_suminsured = [100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000, 1000000, 1500000, 2000000, 2500000, 5000000, 10000000];
GoDigitHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
GoDigitHealth.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    this.processed_request['___enquiryId___'] = this.prepared_request['enquiryId'] = this.lm_request['crn'] + this.current_time();
    this.processed_request['___policyType___'] = this.prepared_request['health_insurance_type'] === "individual" ? "NONFLOATER" : "FLOATER";
    if (this.lm_request['method_type'] === 'Premium') {
        this.getCode(this.prepared_request['Plan_Id']);
        this.prepared_request['zone'] = this.insurer_master['zones']['pb_db_master'];
        this.processed_request['___zone___'] = this.prepared_request['zone'];
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_Relation(member);
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_Relation(member);
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
    }

    if (this.lm_request['method_type'] === 'Proposal') {
        this.getCode(this.prepared_request['dbmaster_plan_id']);
        this.prepared_request['zone'] = this.lm_request["zone"];
        this.processed_request['___zone___'] = this.prepared_request['zone'];
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        //console.log(txt_replace);
        var txt_replace_with = "";
        var questnId = ['RMPRE', 'RPTHR', 'RPDBE', 'RPAST', 'RPHPT', 'RPHLD', 'RPOGM', 'RPDIG', 'RPGYN', 'RPTBC', 'RPALC'];
        var covidId = {
            'RPCVI': ["RPCV1", "RPCV2", "RPCV3", "RPCV4", "RPCV5", "RPCV6"],
            'RPVCN': ["RPVC1", "RPVC2", "RPVC3", "RPVC4", "RPVC5", "RPVC6"],
            'RCOVI': [],
            'RPCVD': []
        };
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with === "" ? txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member) : txt_replace_with += "," + txt_replace.replaceAll('___member_array', '___member_' + member);
            this.processed_request['___member_' + member + '_gender_2___'] = this.prepared_request['member_' + member + '_gender'] === "M" ? "MALE" : "FEMALE";
            this.get_member_Relation(member);
            this.get_nominee_Relation(member);
            this.prepared_request['member_' + member + '_isPrimaryInsuredPerson'] = this.prepared_request['member_' + member + '_rel'] === 'SELF' ? true : false;
            this.processed_request['___member_' + member + '_isPrimaryInsuredPerson___'] = this.prepared_request['member_' + member + '_isPrimaryInsuredPerson'];
            this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
            this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];

            let medQuestn = '';
            //covid question
            for (var key in covidId) {
                if (key === "RPVCN") {
                    this.prepared_request['member_' + member + '_addQue_' + key] = (this.lm_request['member_' + member + '_additionalQue_1_subQue_' + key]).toString().toUpperCase();
                } else {
                    this.prepared_request['member_' + member + '_addQue_' + key] = (this.lm_request['member_' + member + '_question_' + key + '_details']).toString().toUpperCase();
                }
                this.processed_request['___member_' + member + '_addQue_' + key + '___'] = this.prepared_request['member_' + member + '_addQue_' + key];
                covidId[key].forEach(Id => {
                    if (this.lm_request['member_' + member + '_additionalQue_1_subQue_' + Id] === '') {
                        this.prepared_request['member_' + member + '_addQue_isApplicable_' + Id] = false;
                        this.processed_request['___member_' + member + '_addQue_isApplicable_' + Id + '___'] = false;
                        this.prepared_request['member_' + member + '_addQue_' + Id] = '';
                        this.processed_request['___member_' + member + '_addQue_' + Id + '___'] = '';
                        txt_replace_with = txt_replace_with.replace('"detailAnswer": "___member_' + member + '_addQue_' + Id + '___",', "");
                    } else {
                        this.prepared_request['member_' + member + '_addQue_isApplicable_' + Id] = true;
                        this.processed_request['___member_' + member + '_addQue_isApplicable_' + Id + '___'] = true;
                        this.prepared_request['member_' + member + '_addQue_' + Id] = this.lm_request['member_' + member + '_additionalQue_1_subQue_' + Id];
                        this.processed_request['___member_' + member + '_addQue_' + Id + '___'] = this.prepared_request['member_' + member + '_addQue_' + Id];
                        if (['RPCV1', 'RPCV4', 'RPCV5', 'RPCV6', 'RPVC2', 'RPVC3'].includes(Id)) {
                            this.prepared_request['member_' + member + '_addQue_' + Id] = moment(this.lm_request['member_' + member + '_additionalQue_1_subQue_' + Id], 'DD-MM-YYYY').format('YYYY-MM-DD');
                            this.processed_request['___member_' + member + '_addQue_' + Id + '___'] = this.prepared_request['member_' + member + '_addQue_' + Id];
//                            if (Id === "RPCV4" || Id === "RPCV5") {
//                                const today = moment();
//                                const someday = moment(this.prepared_request['member_' + member + '_addQue_' + Id] + ' 00:00Z');
//                                const diff = today.diff(someday, 'month');
//                                if (diff <= 6) {
//                                    this.prepared_request['reject'] = true;
//                                    this.processed_request['___reject___'] = true;
//                                }
//                            } else if (Id === "RPCV6") {
//                                const today = moment();
//                                const someday = moment(this.prepared_request['member_' + member + '_addQue_' + Id] + ' 00:00Z');
//                                const diff = today.diff(someday, 'month');
//                                if (diff <= 8) {
//                                    this.prepared_request['reject'] = true;
//                                    this.processed_request['___reject___'] = true;
//                                }
//                            }

                        }
                    }
                    console.log(Id);
                });
            }
            this.prepared_request['member_' + member + '_addQue_isApplicable_RPVCN'] = this.prepared_request['member_' + member + '_addQue_RPVCN'] === "TRUE" ? true : false;
            this.processed_request['___member_' + member + '_addQue_isApplicable_RPVCN___'] = this.prepared_request['member_' + member + '_addQue_isApplicable_RPVCN'];
            this.prepared_request['member_' + member + '_addQue_isApplicable_RCOVI'] = this.prepared_request['member_' + member + '_addQue_RCOVI'] === 'TRUE' ? true : false;
            this.processed_request['___member_' + member + '_addQue_isApplicable_RCOVI___'] = this.prepared_request['member_' + member + '_addQue_isApplicable_RCOVI'];
            this.prepared_request['member_' + member + '_addQue_isApplicable_RPCVD'] = this.prepared_request['member_' + member + '_addQue_RPCVD'] === 'TRUE' ? true : false;
            this.processed_request['___member_' + member + '_addQue_isApplicable_RPCVD___'] = this.prepared_request['member_' + member + '_addQue_isApplicable_RPCVD'];
            this.prepared_request['member_' + member + '_addQue_isApplicable_RPCVI'] = this.prepared_request['member_' + member + '_addQue_RPCVI'] === 'TRUE' ? true : false;
            this.processed_request['___member_' + member + '_addQue_isApplicable_RPCVI___'] = this.prepared_request['member_' + member + '_addQue_isApplicable_RPCVI'];
            for (i = 0; i <= questnId.length; i++) {
                if (this.prepared_request['member_' + member + '_question_' + questnId[i] + '_details'] === true) {
                    medQuestn += ",\n" + '{"questionCode": "' + questnId[i] + '", "answerType": "BOOLEAN", "isApplicable": true, "detailAnswer": "TRUE","subQuestions": []}';
                }
            }
            txt_replace_with = txt_replace_with.replace('<!--___member_' + member + '_medquestn-->', medQuestn);
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += "," + txt_replace.replaceAll('___member_array', '___member_' + member);
            this.processed_request['___member_' + member + '_gender_2___'] = this.prepared_request['member_' + member + '_gender'] === "M" ? "MALE" : "FEMALE";
            this.get_member_Relation(member);
            this.get_nominee_Relation(member);
            this.processed_request['___member_' + member + '_occupation___'] = 'OTHERS';
            this.prepared_request['member_' + member + '_isPrimaryInsuredPerson'] = this.prepared_request['member_' + member + '_rel'] === 'SELF' ? true : false;
            this.processed_request['___member_' + member + '_isPrimaryInsuredPerson___'] = this.prepared_request['member_' + member + '_isPrimaryInsuredPerson'];
            this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
            this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
            let medQuestn = '';
            //covid question
            for (var key in covidId) {
                if (key === "RPVCN") {
                    this.prepared_request['member_' + member + '_addQue_' + key] = (this.lm_request['member_' + member + '_additionalQue_1_subQue_' + key]).toString().toUpperCase();
                } else {
                    this.prepared_request['member_' + member + '_addQue_' + key] = (this.lm_request['member_' + member + '_question_' + key + '_details']).toString().toUpperCase();
                }
                this.processed_request['___member_' + member + '_addQue_' + key + '___'] = this.prepared_request['member_' + member + '_addQue_' + key];
                covidId[key].forEach(Id => {
                    if (this.lm_request['member_' + member + '_additionalQue_1_subQue_' + Id] === '') {
                        this.prepared_request['member_' + member + '_addQue_isApplicable_' + Id] = false;
                        this.processed_request['___member_' + member + '_addQue_isApplicable_' + Id + '___'] = false;
                        this.prepared_request['member_' + member + '_addQue_' + Id] = '';
                        this.processed_request['___member_' + member + '_addQue_' + Id + '___'] = '';
                        console.log('"detailAnswer": "___member_ ' + member + '_addQue_' + Id + '___",');
                        txt_replace_with = txt_replace_with.replace('"detailAnswer": "___member_' + member + '_addQue_' + Id + '___",', "");
                    } else {
                        this.prepared_request['member_' + member + '_addQue_isApplicable_' + Id] = true;
                        this.processed_request['___member_' + member + '_addQue_isApplicable_' + Id + '___'] = true;
                        this.prepared_request['member_' + member + '_addQue_' + Id] = this.lm_request['member_' + member + '_additionalQue_1_subQue_' + Id];
                        this.processed_request['___member_' + member + '_addQue_' + Id + '___'] = this.prepared_request['member_' + member + '_addQue_' + Id];
                        if (['RPCV1', 'RPCV4', 'RPCV5', 'RPCV6', 'RPVC2', 'RPVC3'].includes(Id)) {
                            this.prepared_request['member_' + member + '_addQue_' + Id] = moment(this.lm_request['member_' + member + '_additionalQue_1_subQue_' + Id], 'DD-MM-YYYY').format('YYYY-MM-DD');
                            this.processed_request['___member_' + member + '_addQue_' + Id + '___'] = this.prepared_request['member_' + member + '_addQue_' + Id];
//                            if (Id === "RPCV4" || Id === "RPCV5") {
//                                const today = moment();
//                                const someday = moment(this.prepared_request['member_' + member + '_addQue_' + Id] + ' 00:00Z');
//                                const diff = today.diff(someday, 'month');
//                                if (diff <= 6) {
//                                    this.prepared_request['reject'] = true;
//                                    this.processed_request['___reject___'] = true;
//                                }
//                            } else if (Id === "RPCV6") {
//                                const today = moment();
//                                const someday = moment(this.prepared_request['member_' + member + '_addQue_' + Id] + ' 00:00Z');
//                                const diff = today.diff(someday, 'month');
//                                if (diff <= 8) {
//                                    this.prepared_request['reject'] = true;
//                                    this.processed_request['___reject___'] = true;
//                                }
//                            }
                        }
                    }

                    console.log(Id);
                });
            }
            this.prepared_request['member_' + member + '_addQue_isApplicable_RPVCN'] = this.prepared_request['member_' + member + '_addQue_RPVCN'] === "TRUE" ? true : false;
            this.processed_request['___member_' + member + '_addQue_isApplicable_RPVCN___'] = this.prepared_request['member_' + member + '_addQue_isApplicable_RPVCN'];
            this.prepared_request['member_' + member + '_addQue_isApplicable_RCOVI'] = this.prepared_request['member_' + member + '_addQue_RCOVI'] === 'TRUE' ? true : false;
            this.processed_request['___member_' + member + '_addQue_isApplicable_RCOVI___'] = this.prepared_request['member_' + member + '_addQue_isApplicable_RCOVI'];
            this.prepared_request['member_' + member + '_addQue_isApplicable_RPCVD'] = this.prepared_request['member_' + member + '_addQue_RPCVD'] === 'TRUE' ? true : false;
            this.processed_request['___member_' + member + '_addQue_isApplicable_RPCVD___'] = this.prepared_request['member_' + member + '_addQue_isApplicable_RPCVD'];
            this.prepared_request['member_' + member + '_addQue_isApplicable_RPCVI'] = this.prepared_request['member_' + member + '_addQue_RPCVI'] === 'TRUE' ? true : false;
            this.processed_request['___member_' + member + '_addQue_isApplicable_RPCVI___'] = this.prepared_request['member_' + member + '_addQue_isApplicable_RPCVI'];
            for (i = 0; i <= questnId.length; i++) {
                if (this.prepared_request['member_' + member + '_question_' + questnId[i] + '_details'] === true) {
                    medQuestn += ",\n" + '{"questionCode": "' + questnId[i] + '", "answerType": "BOOLEAN", "isApplicable": true, "detailAnswer": "TRUE","subQuestions": []}';
                }
            }
            txt_replace_with = txt_replace_with.replace('<!--___member_' + member + '_medquestn-->', medQuestn);
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
    }
		var obj_posp_replace = {
		'___is_posp___': 'false',
		'___posp_mobile_no___': '',
		'___posp_agent_city___': '',
		'___posp_aadhar___': '',
		'___posp_first_name___': '',
		'___posp_last_name___': '',
		'___posp_pan_no___': ''

	};
	if (this.lm_request['is_posp'] === 'yes' && this.lm_request['health_insurance_si'] < 500001) {            
		obj_posp_replace = {
			'___is_posp___': 'true',
			'___posp_mobile_no___': '8356844187',
			'___posp_agent_city___': this.lm_request['posp_agent_city'],
			'___posp_aadhar___': this.lm_request['posp_aadhar'],
			'___posp_first_name___': this.lm_request['posp_first_name'],
			'___posp_last_name___': this.lm_request['posp_last_name'],
			'___posp_pan_no___': this.lm_request['posp_pan_no']
		};
	}
	this.method_content = this.method_content.toString().replaceJson(obj_posp_replace);
//    console.log(this.method_content);
//start for kyc
    if (this.lm_request['method_type'] === 'Proposal' && this.lm_request.hasOwnProperty('doc_url') && this.lm_request['doc_url']) {
        var filepath = fs.readFileSync(appRoot + this.lm_request['doc_url']);
        var docConvert = Buffer.from(filepath).toString('base64');
        this.prepared_request['photo_doc'] = docConvert;
        this.processed_request['___photo_doc___'] = this.prepared_request['photo_doc'];
    }
    //end for kyc
};
GoDigitHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
    var obj_response_handler;
    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    } else if (specific_insurer_object.method.Method_Type === 'Proposal') {
        obj_response_handler = this.proposal_response_handler(objResponseJson);
    } else if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    } else if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    return obj_response_handler;
};
GoDigitHealth.prototype.insurer_product_field_process_post = function () {

};
GoDigitHealth.prototype.insurer_product_api_post = function () {

};
GoDigitHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
            if ((docLog['Method_Type'] === 'Premium' && docLog['Plan_Id'] === 157) || this.prepared_request['dbmaster_pb_plan_id'] === 157) {//arogya
                var auth_key = config.environment.name === 'Production' ? "O4UGQFSXQ2AESNIYCE4G2LE0H6ZY14PP" : "KHEWEND1J87QO4C7COC2JRW8EI3XQTSB";
            } else {
                var auth_key = objInsurerProduct.processed_request["___insurer_integration_service_user___"];
            }
            var args = {
                data: docLog.Insurer_Request,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": auth_key
                }
            };
            client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                var objData = JSON.stringify(data);
                var objResponseFull = {
                    'err': null,
                    'result': objData,
                    'raw': data,
                    'soapHeader': null,
                    'objResponseJson': JSON.parse(objData)
                };
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        } else {
            if (specific_insurer_object.method.Method_Type === 'Verification') {
                var policyNo = objInsurerProduct.processed_request['___policy_number___'];
                var url = specific_insurer_object.method_file_url + policyNo;
                docLog.Insurer_Request = url;
                var args = {
                    headers: {'Authorization': objInsurerProduct.processed_request["___insurer_integration_service_user___"]}
                };
                client.get(url, args, function (data, response) {
                    var objData = JSON.stringify(data);
                    var objResponseFull = {
                        'err': null,
                        'result': objData,
                        'raw': data,
                        'soapHeader': null,
                        'objResponseJson': JSON.parse(objData)
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            } else {//pdf
                var url = this.lm_request['insurer_policy_url'];
                docLog.Insurer_Request = url;
                client.get(url, function (data, response) {
                    var objData = JSON.stringify(data);
                    var objResponseFull = {
                        'err': null,
                        'result': objData,
                        'raw': data,
                        'soapHeader': null,
                        'objResponseJson': JSON.parse(objData)
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            }
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
GoDigitHealth.prototype.premium_response_handler = function (objResponseJson) {
//    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.error.errorCode !== 200) {
            Error_Msg = objResponseJson.error.errorMessage;
        }

        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.hasOwnProperty('premium')) {
                var premium_breakup = this.get_const_premium_breakup();
                premium_breakup['final_premium'] = objResponseJson.premium['grossPremium'].slice(4);
                premium_breakup['base_premium'] = objResponseJson.premium['basePremium'].slice(4);
                premium_breakup['net_premium'] = objResponseJson.premium['netPremium'].slice(4);
                premium_breakup['service_tax'] = objResponseJson.premium['totalTax'].slice(4);
                objServiceHandler.Premium_Breakup = premium_breakup;
            } else {
                Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
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
GoDigitHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('error')) {
            if (objResponseJson.error.errorCode !== 200 || objResponseJson['policyStatus'] === "DECLINED") {
                Error_Msg = objResponseJson.error.errorMessage;
            }
        } else {
            Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
        }
//        if (this.prepared_request.hasOwnProperty('reject') && this.prepared_request['reject'] === true) {
//            Error_Msg = 'Decline based on UW criteria';
//        }
        if (Error_Msg === 'NO_ERR') {
            objServiceHandler.Payment.pg_url = objResponseJson['paymentLink'];
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['policyNumber'];
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
GoDigitHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get;
        if (output.hasOwnProperty('transactionNumber') && output.hasOwnProperty('policyNumber')) {
            var total_premium = this.insurer_master['service_logs']['insurer_db_master']['Insurer_Response']['premium'].grossPremium;
            this.const_policy.policy_number = output['policyNumber'];
            this.const_policy.transaction_id = output['transactionNumber'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.transaction_amount = total_premium.split(' ')[1];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
GoDigitHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var insurer_pdf_url = (objResponseJson.hasOwnProperty('schedulePath') && objResponseJson['schedulePath'] !== '') ? objResponseJson['schedulePath'] : '';
        if (this.const_policy.transaction_status === 'SUCCESS') {
            if (Error_Msg === 'NO_ERR' && insurer_pdf_url !== '') {
                this.const_policy.transaction_substatus = 'IF';
                var pdf_file_name = this.constructor.name + '_Health_' + this.const_policy.policy_number + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                this.const_policy.policy_url = pdf_web_path_portal;
                this.const_policy.insurer_policy_url = insurer_pdf_url;
                try {
                    var args = {
                        data: {
                            "search_reference_number": this.lm_request['search_reference_number'],
                            "api_reference_number": this.lm_request['api_reference_number'],
                            "policy_number": this.const_policy.policy_number,
                            "insurer_policy_url": this.const_policy.insurer_policy_url,
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
                    this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc_horizon);
                } catch (ep) {
                    console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
                }
            } else {
                this.const_policy.transaction_substatus = 'UW';
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
GoDigitHealth.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
GoDigitHealth.prototype.pdf_response_handler = function (objResponseJson) {
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
                var binary = new Buffer(objResponseJson['data'], 'base64');
                fs.writeFileSync(pdf_sys_loc_horizon, binary);
                policy.policy_url = pdf_web_path_portal;
                policy.pdf_status = 'SUCCESS';
            } else {
                policy.pdf_status = 'FAIL';
            }
        }
        objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
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
GoDigitHealth.prototype.getCode = function (plancode) {
    var codes = {
        plan_155: {'subInsurance': 'HLCP', 'nonABS': 'LMCL1', 'coverType1': 48717, 'coverType2': 48718, 'contract_coverType': 48737}, //Exclusive Care
        plan_156: {'subInsurance': 'P1A85', 'nonABS': 'P1A85', 'coverType1': 48717, 'coverType2': 48718, 'contract_coverType': 48737}, //Super Care
        plan_157: {'subInsurance': 'AROGY', 'nonABS': 'AROG1', 'coverType1': 49965, 'coverType2': 49966, 'contract_coverType': 48734}   //Plus1-Arogya Sanjeevani
    };

    this.prepared_request['subInsuranceProductCode'] = codes["plan_" + plancode].subInsurance;
    this.prepared_request['nonABSProductCode'] = codes["plan_" + plancode].nonABS;
    this.prepared_request['coverType1'] = codes["plan_" + plancode].coverType1;
    this.prepared_request['coverType2'] = codes["plan_" + plancode].coverType2;
    this.prepared_request['contract_coverType'] = codes["plan_" + plancode].contract_coverType;

    this.processed_request['___subInsuranceProductCode___'] = this.prepared_request['subInsuranceProductCode'];
    this.processed_request['___nonABSProductCode___'] = this.prepared_request['nonABSProductCode'];
    this.processed_request['___coverType1___'] = this.prepared_request['coverType1'];
    this.processed_request['___coverType2___'] = this.prepared_request['coverType2'];
    this.processed_request['___contract_coverType___'] = this.prepared_request['contract_coverType'];
    this.prepared_request["imd"] = config.environment.name === 'Production' ? (plancode === 157 ? 1047235 : 1002272) : 1000295;
    this.processed_request['___imd___'] = this.prepared_request["imd"];
};
GoDigitHealth.prototype.get_member_Relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start GoDigit');
    var gender = this.lm_request['member_' + i + '_gender'];
    var proposer_rel = this.prepared_request["relation"];
    var member_rel;
    if (proposer_rel === 'SELF' || proposer_rel === '') {
        if (i >= 3) {
            member_rel = gender === 'M' ? 'SON' : 'DAUGHTER';
        } else if (i === 1) {
            member_rel = 'SELF';
        } else if (i === 2) {
            member_rel = gender === 'F' ? 'WIFE' : 'HUSBAND';
        }
    } else if (proposer_rel === 'DAUGHTER' || proposer_rel === 'SON') {
        member_rel = gender === 'M' ? 'FATHER' : 'MOTHER';
    } else if (proposer_rel === 'FATHER' || proposer_rel === 'MOTHER') {
        member_rel = gender === 'M' ? 'SON' : 'DAUGHTER';
    } else if (proposer_rel === 'WIFE' || proposer_rel === 'HUSBAND') {
        member_rel = gender === 'M' ? 'HUSBAND' : 'WIFE';
    }
    this.prepared_request['member_' + i + '_rel'] = member_rel;
    this.processed_request['___member_' + i + '_rel___'] = member_rel;
    console.log(this.constructor.name, 'get_member_relation', 'End GoDigit');
};
GoDigitHealth.prototype.get_nominee_Relation = function (i) {
    var member_nom_rel, member_nom_fname, member_nom_lname, member_nom_dob;
    if (i > 1) {
        if (this.lm_request["member_" + i + "_age"] >= 18) {
            member_nom_rel = 'SELF';
            member_nom_fname = this.lm_request["member_" + i + "_first_name"];
            member_nom_lname = this.lm_request["member_" + i + "_last_name"];
            member_nom_dob = this.lm_request["member_" + i + "_birth_date"];
        } else {
            if (this.prepared_request['member_' + i + '_rel'] === "SON" || this.prepared_request['member_' + i + '_rel'] === "DAUGHTER") {
                member_nom_rel = this.lm_request["gender"] === "M" ? "FATHER" : "MOTHER";
            }
            member_nom_fname = this.lm_request["first_name"];
            member_nom_lname = this.lm_request["last_name"];
            member_nom_dob = this.lm_request["birth_date"];
        }
    } else {
        if (this.lm_request["relation"] === "SELF") {
            member_nom_rel = this.lm_request["nominee_relation"];
            member_nom_fname = this.lm_request["nominee_first_name"];
            member_nom_lname = this.lm_request["nominee_last_name"];
            member_nom_dob = this.lm_request["nominee_birth_date"];
        } else {
            member_nom_fname = this.lm_request["nominee_first_name"];
            member_nom_lname = this.lm_request["nominee_last_name"];
            member_nom_dob = this.lm_request["nominee_birth_date"];
            if (this.lm_request["nominee_relation"] === "SELF") {
                member_nom_rel = this.prepared_request['member_1_relation'];
                member_nom_fname = this.lm_request["first_name"];
                member_nom_lname = this.lm_request["last_name"];
                member_nom_dob = this.lm_request["birth_date"];
            } else if (this.lm_request["relation"] === "SON" || this.lm_request["relation"] === "DAUGHTER") {
                if (["SON", "DAUGHTER", "HUSBAND", "WIFE"].includes(this.lm_request["nominee_relation"])) {
                    member_nom_rel = "OTHER";
                } else {
                    if (this.lm_request["member_1_gender"] === "M") {
                        member_nom_rel = this.lm_request["nominee_relation"] === "FATHER" ? "SELF" : "WIFE";
                    } else {
                        member_nom_rel = this.lm_request["nominee_relation"] === "FATHER" ? "HUSBAND" : "SELF";
                    }
                }
            } else if (this.lm_request["relation"] === "FATHER" || this.lm_request["relation"] === "MOTHER") {
                if (this.lm_request["nominee_relation"] === "HUSBAND") {
                    member_nom_rel = "FATHER";
                } else if (this.lm_request["nominee_relation"] === "WIFE") {
                    member_nom_rel = "MOTHER";
                } else if (this.lm_request["nominee_relation"] === "SON") {
                    member_nom_rel = this.lm_request["member_1_gender"] === "M" ? "SELF" : "BROTHER";
                } else if (this.lm_request["nominee_relation"] === "DAUGHTER") {
                    member_nom_rel = this.lm_request["member_1_gender"] === "F" ? "SELF" : "SISTER";
                } else {
                    member_nom_rel = this.lm_request["nominee_relation"] === "FATHER" ? "GRAND_FATHER" : "GRAND_MOTHER";
                }
            } else if (this.lm_request["relation"] === "HUSBAND" || this.lm_request["relation"] === "WIFE") {
                if (["SON", "DAUGHTER", "WIFE", "HUSBAND"].includes(this.lm_request["nominee_relation"])) {
                    member_nom_rel = this.lm_request["nominee_relation"];
                } else if (this.lm_request["relation"] === "FATHER" || this.lm_request["relation"] === "MOTHER") {
                    member_nom_rel = this.lm_request["relation"] + "_IN_LAW";
                }
            }
        }
    }

    this.prepared_request['member_' + i + '_nominee_rel'] = member_nom_rel;
    this.processed_request['___member_' + i + '_nominee_rel___'] = member_nom_rel;
    this.processed_request['___member_' + i + '_nominee_fname___'] = member_nom_fname;
    this.processed_request['___member_' + i + '_nominee_lname___'] = member_nom_lname;
    this.processed_request['___member_' + i + '_nominee_dob___'] = member_nom_dob;
};
GoDigitHealth.prototype.current_time = function () {
    var today = moment().utcOffset("+05:30");
    var current_time = moment(today).format("HHmmss");
    return current_time;
};
GoDigitHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('GoDigitHealth is_valid_plan', 'start');
    var index = -1;
    var age = true;
    if (planCode === "Plus1" && lm_request['member_1_age'] > 60) {
        age = false;
    }
    var Plans = [
        {'code': "Exclusive", 'min_si': 199000, 'max_si': 10000000},
        {'code': "Super", 'min_si': 199000, 'max_si': 10000000},
        {'code': "Plus1", 'min_si': 99000, 'max_si': 500000}
    ];
    index = Plans.findIndex(x => x.code === planCode && age === true
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('GoDigitHealth is_valid_plan', 'End');
};
GoDigitHealth.prototype.premium_breakup_schema = {
    "base_premium": "basePremium",
    "net_premium": "premium",
    "service_tax": "serviceTax",
    "gross_premium": "grossPremium",
    "final_premium": "totalPremium"
};
module.exports = GoDigitHealth;