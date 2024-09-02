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

function BhartiAxaTravel() {
}
util.inherits(BhartiAxaTravel, Travel);

BhartiAxaTravel.prototype.lm_request_single = {};
BhartiAxaTravel.prototype.insurer_integration = {};
BhartiAxaTravel.prototype.insurer_addon_list = [];
BhartiAxaTravel.prototype.insurer = {};
BhartiAxaTravel.prototype.insurer_date_format = 'YYYY-MM-DD';
//BhartiAxaTravel.prototype.const_insurer_suminsured = [200000, 300000, 500000];


BhartiAxaTravel.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
BhartiAxaTravel.prototype.insurer_product_field_process_pre = function () {
    this.processed_request['___crn___'] = this.lm_request['crn'];
    this.get_product_details();
    this.get_family_type();
    if (this.lm_request['method_type'] === 'Premium') {
        this.prepared_request['timestamp'] = moment().format('ddd, DD MMM YYYY');
        this.processed_request['___timestamp___'] = this.prepared_request['timestamp'];
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            this.get_member_age(member);
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            this.get_member_age(member);
        }
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        this.prepared_request['timestamp'] = moment().format("ddd, DD MMM YYYY HH:mm:ss");
        this.processed_request['___timestamp___'] = this.prepared_request['timestamp'];
        this.processed_request['___member_has_ped___'] = "N";
        let log = this['insurer_master']['service_logs']['pb_db_master']['Insurer_Response'];
        this.processed_request['___order_number___'] = log.Envelope.Body.processTPRequestResponse.response.OrderNo;
        this.processed_request['___quote_number___'] = log.Envelope.Body.processTPRequestResponse.response.QuoteNo;

        this.prepared_request['proposer_age'] = moment(this.prepared_request['current_date']).diff(this.lm_request['birth_date'], 'years');
        this.processed_request['___proposer_age___'] = this.prepared_request['proposer_age'];
        this.prepared_request['nominee_age'] = moment(this.prepared_request['current_date']).diff(this.lm_request['nominee_birth_date'], 'years');
        this.processed_request['___nominee_age___'] = this.prepared_request['nominee_age'];

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_age(member);
            this.get_member_relation(member);
            if (this.prepared_request['member_' + member + '_ped'] !== "") {
                this.processed_request['___member_has_ped___'] = "Y";
            }
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_age(member);
            this.get_member_relation(member);
            if (this.prepared_request['member_' + member + '_ped'] !== "") {
                this.processed_request['___member_has_ped___'] = "Y";
            }
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        for (var key in this.lm_request) {
            if (key.indexOf('_type') > -1 && key.indexOf('question_') > -1) {
                var ques_detail = key.replace('_type', '_details');
                if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                    if (this.lm_request[ques_detail] === false) {
                        this.prepared_request[ques_detail] = 'N';
                        this.processed_request['___' + ques_detail + '___'] = 'N';
                    } else {
                        this.prepared_request[ques_detail] = 'Y';
                        this.processed_request['___' + ques_detail + '___'] = 'Y';
                    }
                } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                    this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                    this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                }
            }
        }
    }
    this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
};
BhartiAxaTravel.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
BhartiAxaTravel.prototype.insurer_product_field_process_post = function () {

};
BhartiAxaTravel.prototype.insurer_product_api_post = function () {

};
BhartiAxaTravel.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        var soap = require('soap');

        var args = {"SessionDoc": ""};
        console.log(docLog.Insurer_Request);
        args['SessionDoc'] = docLog.Insurer_Request;
// set content-type header and data as json in args parameter 
        soap.createClient(specific_insurer_object.method_file_url, function (err, client) {
            client.serve(args, function (err1, result, raw, soapHeader) {
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
                    premiumObj['PlanCode'] = (objInsurerProduct.lm_request['trip_type'] === "MULTI" ? docLog['Plan_Name'] : docLog['Plan_Code']);
                    console.log('BhartiResponse', premiumObj);
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
BhartiAxaTravel.prototype.premium_response_handler = function (objResponseJson) {
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);

        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null
        };
        var Error_Msg = 'NO_ERR';
        //check error start
        if (objResponseJson.hasOwnProperty('Gateway')) {
            Error_Msg = objResponseJson.Gateway.Authentication;
        } else {
            if (objResponseJson.hasOwnProperty('Envelope') && objResponseJson['Envelope'].hasOwnProperty('Body')) {
                var objMainService = objResponseJson.Envelope.Body;
                if (objMainService.hasOwnProperty('processTPRequestResponse')) {
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('Error') && objMainService['processTPRequestResponse']['Error'] !== '') {
                        Error_Msg = 'LM_MSG::REQUEST_HAS_ISSUE_CHECK_PARAMETER';
                    }
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('response')) {
                        if (objMainService.processTPRequestResponse.response.hasOwnProperty('ErrorDescription') && objMainService.processTPRequestResponse.response.ErrorDescription !== '') {
                            Error_Msg = objMainService.processTPRequestResponse.response.ErrorDescription;
                        }
                    }
                } else {
                    if (objMainService.hasOwnProperty('Fault')) {
                        Error_Msg = JSON.stringify(objMainService.Fault);
                    } else {
                        Error_Msg = JSON.stringify(objMainService);
                    }
                }
            } else {
                Error_Msg = 'LM_MSG::MAIN_NODE_MISSING';
            }
        }

        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.get_const_premium_breakup();
            var objPremiumService = objMainService.processTPRequestResponse.response.PremiumSet.tuple;
            let plan_code = objResponseJson.PlanCode;
            for (var key in objPremiumService) {
                if ((objPremiumService[key]['old']['PlanSet'].PlanName).includes(plan_code)) {
                    premium_breakup['net_premium'] = Number(objPremiumService[key]['old']['PlanSet'].Premium);
                    premium_breakup['service_tax'] = Number(objPremiumService[key]['old']['PlanSet'].ServiceTax);
                    premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                    premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                    premium_breakup['final_premium'] = Number(objPremiumService[key]['old']['PlanSet'].PremiumPayable);
                    premium_breakup['travel_insurance_si'] = (this.processed_request['___travel_type___'] === "SCH" ? "€" : "$") + objPremiumService[key]['old']['PlanSet'].SumInsured;
                    objServiceHandler.Premium_Breakup = premium_breakup;
                }
            }
            objServiceHandler.Insurer_Transaction_Identifier = objMainService.processTPRequestResponse.response.QuoteNo;
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
BhartiAxaTravel.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    try {

        var Error_Msg = 'NO_ERR';
        if (this.processed_request['___member_has_ped___'] === "Y") {
            Error_Msg = "Regret, policy cannot be issued online in-case insured members have PED";
        } else if (objResponseJson.hasOwnProperty('Gateway')) {
            Error_Msg = objResponseJson.Gateway.Authentication;
        } else {
            if (objResponseJson.hasOwnProperty('Envelope') && objResponseJson['Envelope'].hasOwnProperty('Body')) {
                var objMainService = objResponseJson.Envelope.Body;
                if (objMainService.hasOwnProperty('processTPRequestResponse')) {
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('Error') && objMainService['processTPRequestResponse']['Error'] !== '') {
                        Error_Msg = 'LM_MSG::REQUEST_HAS_ISSUE_CHECK_PARAMETER';
                    }
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('response')) {
                        if (objMainService.processTPRequestResponse.response.hasOwnProperty('ErrorDescription') && objMainService.processTPRequestResponse.response.ErrorDescription !== '') {
                            Error_Msg = objMainService.processTPRequestResponse.response.ErrorDescription;
                        }
                    }
                } else {
                    if (objMainService.hasOwnProperty('Fault')) {
                        Error_Msg = JSON.stringify(objMainService.Fault.faultstring);
                    } else {
                        Error_Msg = JSON.stringify(objMainService);
                    }
                }
            } else {
                Error_Msg = 'LM_MSG::MAIN_NODE_MISSING';
            }
        }
        if (Error_Msg === 'NO_ERR') {

            var objPremiumService = objMainService.processTPRequestResponse.response.PremiumSet.tuple;
            let plan_code = this.prepared_request['dbmaster_plan_code'];
            let final_premium = 0;
            for (var key in objPremiumService) {
                if ((objPremiumService[key]['old']['PlanSet'].PlanName).includes(plan_code)) {
                    final_premium = Number(objPremiumService[key]['old']['PlanSet'].PremiumPayable);
                }
            }
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], final_premium);
            if (objPremiumVerification.Status) {
                var pg_data = {
                    "OrderNo": objMainService.processTPRequestResponse.response.OrderNo,
                    "QuoteNo": objMainService.processTPRequestResponse.response.QuoteNo,
                    "Channel": objMainService.processTPRequestResponse.response.Session.SessionData.Channel,
                    "Product": "STR",
                    "Amount": (config.environment.name === 'Production') ? final_premium : 1,
                    "IsMobile": "N"
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = objMainService.processTPRequestResponse.response.QuoteNo;
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
BhartiAxaTravel.prototype.pg_response_handler = function () {
    try {
        //SUCCESS- productID=STR&orderNo=VDIR322143&amount=1.00&status=success&transactionRef=ASMP3550113781&policyNo=S8400917&link=/birt/reports/reportFiles/2125669477186659.pdf&emailId=spear.9@bharti-axagi.co.in&ID=
        //PAYPASS- productID=STR&orderNo=VDJC084434&amount=1.00&status=payPass&txnRefNo=JIC45711886995
        //FAILURE- productID=STR&orderNo=VDJC084434&amount=1.00&status=fail&transactionRef=JHMP5711944953&ID=
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get;
        if (output['status'] === 'success') {
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = output['policyNo'];
            this.const_policy.transaction_amount = output['amount'];
            this.const_policy.transaction_id = output['transactionRef'];
        }
        if (output['status'] === 'payPass') {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'PAYPASS';
            this.const_policy.transaction_amount = output['amount'];
            this.const_policy.transaction_id = output['txnRefNo'];
        }
        if (output['status'] === 'fail') {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
            this.const_policy.transaction_id = output['transactionRef'];
        }
        console.log('End', this.constructor.name, 'pg_response_handler');
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
BhartiAxaTravel.prototype.verification_response_handler = function (objResponseJson) {
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

            var pdf_file_name = this.constructor.name + '_Travel_' + this.const_policy.policy_number + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            this.const_policy.policy_url = pdf_web_path_portal;

            var insurer_pdf_url = this.prepared_request['insurer_integration_pdf_url'];
            insurer_pdf_url = insurer_pdf_url.replace('___policy_number___', this.const_policy.policy_number);
            this.const_policy.insurer_policy_url = insurer_pdf_url;

            var https = require('https');
            try {
                var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                https.get(insurer_pdf_url, function (response) {
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
BhartiAxaTravel.prototype.get_product_details = function () {
    let plans = [
        {'area': 'Asia', 'geo_extn': 3, 'travel_type': 'NON_SCH', 'trip_type': "SINGLE"},
        {'area': 'Europe', 'geo_extn': 4, 'travel_type': 'SCH', 'trip_type': "SINGLE"},
        {'area': 'WorldWide', 'geo_extn': 1, 'travel_type': 'NON_SCH', 'trip_type': "SINGLE"},
        {'area': 'WWExUSCanada', 'geo_extn': 2, 'travel_type': 'NON_SCH', 'trip_type': "SINGLE"},
        {'area': 'WorldWide', 'geo_extn': 1, 'travel_type': 'NA', 'trip_type': "MULTI"},
        {'area': 'WWExUSCanada', 'geo_extn': 2, 'travel_type': 'NA', 'trip_type': "MULTI"}
    ];
    let index = plans.findIndex(x => x.area === this.lm_request['travelling_to_area'] && x.trip_type === this.lm_request['trip_type']);
    this.processed_request['___trip_type___'] = this.lm_request['trip_type'] === "MULTI" ? "A" : "S";
    this.processed_request['___client_type___'] = this.lm_request['travel_insurance_type'] === "floater" ? "Family" : "Individual";
    this.processed_request['___cover_type___'] = this.lm_request['travel_insurance_type'] === "floater" ? "F" : "I";
    this.processed_request['___travel_type___'] = index === -1 ? "" : plans[index]['travel_type'];
    this.processed_request['___geo_extension___'] = index === -1 ? "" : plans[index]['geo_extn'];
    if (this.lm_request['trip_type'] === "MULTI") {
        this.processed_request['___travel_days___'] = '365';
        this.processed_request['___max_days___'] = this.lm_request['maximum_duration'];
    } else {
        this.processed_request['___travel_days___'] = moment(this.lm_request['policy_end_date']).diff(this.lm_request['policy_start_date'], 'days');
        this.processed_request['___max_days___'] = '';
    }
};
BhartiAxaTravel.prototype.get_family_type = function () {
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];
    let cover_id = '';
    if (adult === 1) {
        cover_id = "S";
        if (child === 1) {
            cover_id = "SC";
        }
        if (child === 2) {
            cover_id = "S2C";
        }
    } else {
        cover_id = 'SS';
        if (child === 1) {
            cover_id = "SSC";
        }
        if (child === 2) {
            cover_id = "SS2C";
        }
    }
    this.processed_request['___family_type___'] = cover_id;
};
BhartiAxaTravel.prototype.get_member_age = function (i) {
    this.processed_request['___member_' + i + '_age___'] = moment(this.prepared_request['current_date']).diff(this.lm_request['member_' + i + '_birth_date'], 'years');
};
BhartiAxaTravel.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start BhartiAxaTravel');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in BhartiAxaTravel " + gender);
    if (this.lm_request["relation"] === 'Mother' || this.lm_request["relation"] === 'Father') {
        this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? 'Son' : 'Daughter';
    } else if (this.lm_request["relation"] === 'Son' || this.lm_request["relation"] === 'Daughter') {
        this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? 'Father' : 'Mother';
    } else if (this.lm_request["relation"] === 'Spouse') {
        this.prepared_request['member_' + i + '_relation'] = 'Spouse';
        if (i >= 3) {
            this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? 'Son' : 'Daughter';
        }
    } else if (this.lm_request["relation"] === 'Self' || this.lm_request["relation"] === '') {
        if (i >= 3) {
            this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? 'Son' : 'Daughter';
        } else if (i === 1) {
            this.prepared_request['member_' + i + '_relation'] = 'Self';
        } else if (i === 2) {
            this.prepared_request['member_' + i + '_relation'] = 'Spouse';
        }
    }
    this.processed_request['___member_' + i + '_relation___'] = this.prepared_request['member_' + i + '_relation'];
    console.log(this.constructor.name, 'get_member_relation', 'End BhartiAxaTravel');
};
BhartiAxaTravel.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('BhartiAxaTravel is_valid_plan', 'start');
    if (lm_request['trip_type'] === "MULTI" && ['Basic', 'Silver', 'Gold', 'Regular', 'Essential'].indexOf(planCode) > -1) {
        return false;
    } else if (lm_request['trip_type'] === "SINGLE" && ['MultiSilver', 'MultiGold', 'MultiPlatinum'].indexOf(planCode) > -1) {
        return false;
    } else {
        return true;
    }
};
BhartiAxaTravel.prototype.premium_breakup_schema = {
    "net_premium": "NetPremium",
    "CGST": "CGST",
    "SGST": "SGST",
    "service_tax": "",
    "final_premium": "FinalPremium"
};
module.exports = BhartiAxaTravel;