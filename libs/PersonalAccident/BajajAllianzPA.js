/* Author: Aniket Singh
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var PA = require(appRoot + '/libs/PersonalAccident');
var fs = require('fs');
var config = require('config');
var moment = require('moment');
var sleep = require('system-sleep');

function BajajAllianzPA() {

}
util.inherits(BajajAllianzPA, PA);

BajajAllianzPA.prototype.lm_request_single = {};
BajajAllianzPA.prototype.insurer_integration = {};
BajajAllianzPA.prototype.const_insurer_suminsured = [500000,1000000, 1500000, 2000000, 2500000, 5000000, 7500000, 10000000, 15000000, 20000000];
BajajAllianzPA.prototype.insurer_addon_list = [];
BajajAllianzPA.prototype.insurer = {};
BajajAllianzPA.prototype.insurer_date_format = 'DD-MMM-YYYY';


BajajAllianzPA.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
BajajAllianzPA.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    this.get_plan_area(this.prepared_request['Plan_Id']);
    this.prepared_request['member_count'] = this.lm_request['member_count'];
    this.processed_request['___member_count___'] = this.prepared_request['member_count'];
    this.prepared_request['member_combo'] = this.lm_request['child_count']? + this.lm_request['adult_count'] +'A':this.lm_request['adult_count'] +'A+'+this.lm_request['child_count']+'C';
    this.processed_request['___member_combo___'] = this.prepared_request['member_combo'];
    this.prepared_request['member_add_flag'] = this.lm_request['member_count']>1?'Y':'N';
    this.processed_request['___member_add_flag___'] = this.prepared_request['member_add_flag'];
     if (this.lm_request['method_type'] === 'Verification') {
         console.log('Verification');
     }
     if (this.lm_request['method_type'] === 'Pdf') {
         console.log('Pdf');
     }

    this.processed_request['___pa_insurance_si___'] = this.prepared_request['pa_insurance_si'];
   let txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
    let txt_replace2 = this.find_text_btw_key(this.method_content, '<!--InsurersDetail2_Start-->', '<!--InsurersDetail2_End-->', true);
    let txt_replace3 = this.find_text_btw_key(this.method_content, '<!--InsurersDetail3_Start-->', '<!--InsurersDetail3_End-->', true);
    let txt_replace_with = "";
    let txt_replace_with2 = "";
    let txt_replace_with3 = "";
        
    if (this.lm_request['method_type'] === 'Premium') {
        this.get_plan_area(this.prepared_request['Plan_Id']);
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with3 += txt_replace3.replaceAll('___member_array', '___member_' + member);
             txt_replace_with2 += txt_replace2.replaceAll('___member_array', '___member_' + member);
             txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
//            this.processed_request['___member_' + member + '_gender___'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'M' : 'F';
            this.get_member_relation(member);
                this.processed_request['___member_' + member + '_age___'] = this.lm_request['member_' + member + '_age'];
                this.processed_request['___member_' + member + '_monthly_income___'] = this.lm_request['member_' + member + '_monthly_income'];
                this.processed_request['___member_' + member + '_birth_date___'] =  moment(this.lm_request['member_' + member + '_birth_date']).format('DD-MMM-YYYY');
                
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with3 += txt_replace3.replaceAll('___member_array', '___member_' + member);
            txt_replace_with2 += txt_replace2.replaceAll('___member_array', '___member_' + member);
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
//            this.processed_request['___member_' + member + '_gender___'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'M' : 'F';
            this.get_member_relation(member);
                this.processed_request['___member_' + member + '_age___'] = this.lm_request['member_' + member + '_age'];
                this.processed_request['___member_' + member + '_monthly_income___'] = this.lm_request['member_' + member + '_monthly_income'];
                this.processed_request['___member_' + member + '_birth_date___'] = moment(this.lm_request['member_' + member + '_birth_date']).format('DD-MMM-YYYY');

        }
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        this.get_plan_area(this.lm_request['Plan_Id']);
//        this.prepared_request['polcov52'] = this.lm_request['member_count']>1?'FltOption1':'IndOption1';
//        this.processed_request['___polcov52___'] = this.prepared_request['polcov52'];
        var returnUrl = this.pg_ack_url(1);
        if (config.environment.name === 'Development') {
            returnUrl = 'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
        }
        this.prepared_request['return_url'] = returnUrl;
        this.processed_request['___return_url___'] = returnUrl;
        txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        txt_replace2 = this.find_text_btw_key(this.method_content, '<!--InsurersDetail2_Start-->', '<!--InsurersDetail2_End-->', true);
        txt_replace3 = this.find_text_btw_key(this.method_content, '<!--InsurersDetail3_Start-->', '<!--InsurersDetail3_End-->', true);
        txt_replace_with = "";
        txt_replace_with2 = "";
        txt_replace_with3 = "";
          for (member = 1; member <= this.lm_request['adult_count']; member++) {
              txt_replace_with3 += txt_replace3.replaceAll('___member_array', '___member_' + member);
             txt_replace_with2 += txt_replace2.replaceAll('___member_array', '___member_' + member);
             txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.processed_request['___member_' + member + '_gender___'] = this.lm_request['member_' + member + '_gender'];
            this.get_member_relation(member);
            this.calculate_bmi(member);
            this.processed_request['___member_' + member + '_question_1_details___'] = this.lm_request['member_' + member + '_question_1_details']===true?'1':'0';
            this.processed_request['___member_' + member + '_rc___'] = this.lm_request['member_' + member + '_rc'];
            this.processed_request['___member_' + member + '_occupation___'] = this.lm_request['member_' + member + '_occupation'];
            this.processed_request['___member_' + member + '_height___'] = this.lm_request['member_' + member + '_height'];
            this.processed_request['___member_' + member + '_weight___'] = this.lm_request['member_' + member + '_weight'];
                this.processed_request['___member_' + member + '_age___'] = this.lm_request['member_' + member + '_age'];
                this.processed_request['___member_' + member + '_fullName___'] = this.lm_request['member_' + member + '_fullName'];
                this.processed_request['___member_' + member + '_monthly_income___'] = this.lm_request['member_' + member + '_monthly_income'];
                this.processed_request['___member_' + member + '_birth_date___'] =  moment(this.lm_request['member_' + member + '_birth_date']).format('DD-MMM-YYYY');
                
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with3 += txt_replace3.replaceAll('___member_array', '___member_' + member);
            txt_replace_with2 += txt_replace2.replaceAll('___member_array', '___member_' + member);
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.processed_request['___member_' + member + '_gender___'] = this.lm_request['member_' + member + '_gender'];
            this.get_member_relation(member);
            this.calculate_bmi(member);
            this.processed_request['___member_' + member + '_question__1__details___'] = this.lm_request['member_' + member + '__question__1__details']===true?'1':'0';
            this.processed_request['___member_' + member + '_occupation___'] = this.lm_request['member_' + member + '_occupation'];
            this.processed_request['___member_' + member + '_height___'] = this.lm_request['member_' + member + '_height'];
            this.processed_request['___member_' + member + '_weight___'] = this.lm_request['member_' + member + '_weight'];
                this.processed_request['___member_' + member + '_age___'] = this.lm_request['member_' + member + '_age'];
                this.processed_request['___member_' + member + '_fullName___'] = this.lm_request['member_' + member + '_fullName'];
                this.processed_request['___member_' + member + '_monthly_income___'] = this.lm_request['member_' + member + '_monthly_income'];
                this.processed_request['___member_' + member + '_birth_date___'] = moment(this.lm_request['member_' + member + '_birth_date']).format('DD-MMM-YYYY');

        }
  
        }

    if (this.method_content[0] !== '<') {// for json
            txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
             txt_replace_with2 = txt_replace_with2.replaceAll('<!--InsurersDetail2_Start-->', "");
             txt_replace_with3 = txt_replace_with3.replaceAll('<!--InsurersDetail3_Start-->', "");
            var Total_Count = this.lm_request['member_count'];
            for (var x = 1; x <= Total_Count - 1; x++) {
                txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', ",");
                txt_replace_with2 = txt_replace_with2.replace('<!--InsurersDetail2_End-->', ",");
                txt_replace_with3 = txt_replace_with3.replace('<!--InsurersDetail3_End-->', ",");
            }
            txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', "");
            txt_replace_with2 = txt_replace_with2.replace('<!--InsurersDetail2_End-->', "");
            txt_replace_with3 = txt_replace_with3.replace('<!--InsurersDetail3_End-->', "");
        }
    this.method_content = this.method_content.replace(txt_replace3, txt_replace_with3);
    this.method_content = this.method_content.replace(txt_replace2, txt_replace_with2);
    this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
};
BajajAllianzPA.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
BajajAllianzPA.prototype.insurer_product_field_process_post = function () {

};
BajajAllianzPA.prototype.insurer_product_api_post = function () {

};
BajajAllianzPA.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var body = docLog.Insurer_Request;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        
            var args = {
                data: body,
                headers: {
                    "Content-Type": "application/json"
                }
            };
        console.log(args);
            client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                console.log('data', data);
                var objData = JSON.stringify(data);
                console.log(objData);
                if (specific_insurer_object.method.Method_Type === 'Premium') {
                objInsurerProduct[`plan_id_${docLog['Plan_Id']}`] = data['transactionid'];
            }
                var objResponseFull = {
                    'err': null,
                    'result': objData,
                    'raw': objData,
                    'soapHeader': null,
                    'objResponseJson': JSON.parse(objData)
                };
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
            
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

BajajAllianzPA.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        if(objResponseJson.hasOwnProperty('error')){
             Error_Msg = objResponseJson['error'];
        }else if (objResponseJson.hasOwnProperty('errorcoderes') && objResponseJson['errorcoderes'] !== "0") {
            Error_Msg = objResponseJson['errorlistres'][0]['errtext'];
        } else if (objResponseJson.hasOwnProperty('errorlistres') && objResponseJson['errorlistres'][0]['errtext'] !== "Executed successfully.") {
            Error_Msg = objResponseJson['errorlistres'][0]['errtext'];
        } else if (objResponseJson.hasOwnProperty('genpremdtls') && objResponseJson['genpremdtls']['totalpremium'] === "0") {
            Error_Msg = 'LM_MSG::PREMIUM_NULL';
        }else if (objResponseJson.hasOwnProperty('message') && objResponseJson['message']){
            Error_Msg = objResponseJson['message'];
        }
        if (Error_Msg === 'NO_ERR')
        {
            var objPremiumService = objResponseJson['genpremdtls'];
            var premium_breakup = this.get_const_premium_breakup();
//            var plan_name = objResponseJson['genpremdtls']['ptravelplan'];
            premium_breakup['final_premium'] = objPremiumService['netpremium']-0;
            premium_breakup['service_tax'] = objPremiumService['servicetaxamt']-0;
//            premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
//            premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['net_premium'] = objPremiumService['basepremium']-0;
            premium_breakup['pa_insurance_si'] = this.processed_request['___pa_insurance_si___']-0;
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['transactionid'];
             let benefitObj = {};
             let benefit_key;
            if(this.hasOwnProperty('plan_id_100') && this['plan_id_100'] === objResponseJson.transactionid){
               benefit_key = ['Accidental_Death']
            }else{
               benefit_key = ['Accidental_Death', 'Permanent_Total_Disability', 'Permanent_Partial_Disability']
            }
           

            benefit_key.forEach(key => {
                benefitObj[key] = this.processed_request['___pa_insurance_si___'] - 0;
            });
            premium_breakup['benefits'] = benefitObj;
            objServiceHandler.Premium_Breakup = premium_breakup;
        }
        

        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
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
BajajAllianzPA.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if(objResponseJson.hasOwnProperty('error')){
             Error_Msg = objResponseJson['error'];
        } else if (objResponseJson.hasOwnProperty('errorcoderes') && objResponseJson['errorcoderes'] !== "0") {
            Error_Msg = objResponseJson['errorlistres'][0]['errtext'];
        } else if ( objResponseJson.hasOwnProperty('errorlistres') && objResponseJson['errorlistres'][0]['errtext'] !== "Process executed sucessfully") {
            Error_Msg = objResponseJson['errorlistres'][0]['errtext'];
        } else if (!objResponseJson.hasOwnProperty('transactionid') || objResponseJson['transactionid'] === "") {
            Error_Msg = "LM_MSG::REQUEST_ID_MISSING";
        }else if (objResponseJson.hasOwnProperty('message') && objResponseJson['message']){
            Error_Msg = objResponseJson['message'];
        }

        if (Error_Msg === 'NO_ERR') {
            var proposalAmt = objResponseJson['genpremdtlsres']['finalpremium'];
            objServiceHandler.Payment.pg_url = objResponseJson['policydtls']['remarks'];
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['transactionid'] ? objResponseJson['transactionid'] : "";


            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], proposalAmt);
            if (objPremiumVerification.Status) {
//                var pg_data = {};

            } else if (objPremiumVerification.Is_PG_Allowed) {
                var pg_data = {
                    'amount': proposalAmt - 0
                };
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
        }
        objServiceHandler.Payment.pg_data = pg_data;
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
BajajAllianzPA.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get;
//        var output = {
//            txn: 'U1230000754500',
//            status: 'success',
//            amt: 1406.00,
//            quoteno: '11-8428-0003244472-00'
//        }
        if (output['status'] === 'success') {
            this.const_policy.transaction_amount = output['amt'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'SUCCESS';
//            this.const_policy.policy_number = output['referenceno'];
            this.const_policy.pg_reference_number_1 = output['quoteno'];
            this.const_policy.transaction_id = output['txn'];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
};
BajajAllianzPA.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.const_policy.pg_status === 'SUCCESS' && objResponseJson.hasOwnProperty('error_msg') && ['Policy Issued Sucessfully','Policy Already Issued for this Transaction Id'].includes(objResponseJson['error_msg'])) {
            if (Error_Msg === 'NO_ERR') {
                if (objResponseJson.hasOwnProperty('policy_ref') && objResponseJson['policy_ref'] ) {
                    this.const_policy.policy_number = objResponseJson['policy_ref'];
                    this.const_policy.transaction_substatus = "IF";
                    var pdf_file_name = this.constructor.name + '_PA_' + this.const_policy['policy_number'].replaceAll('-', '') + '.pdf';
                    var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;
                    try {
                        var args = {
                            data: {
                                "search_reference_number": this.lm_request['search_reference_number'],
                                "api_reference_number": this.lm_request['api_reference_number'],
                                "policy_number": this.const_policy.policy_number,
                                'client_key': this.lm_request['client_key'],
                                'secret_key': this.lm_request['secret_key'],
                                'insurer_id': this.lm_request['insurer_id'],
                                'email': this.lm_request['email'],
                                'mobile': this.lm_request['mobile'],
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
                    this.const_policy.transaction_status = 'PAYPASS';
                }
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }

            objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
        }else{
            Error_Msg = objResponseJson.hasOwnProperty('error_msg')?objResponseJson['error_msg']:'Error in Verification';
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

BajajAllianzPA.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    var objInsurerProduct = this;
    objInsurerProduct.pdf_attempt++;
    var Client = require('node-rest-client').Client;
    var client = new Client();
    client.post(url, args, function (data, response) {
        console.log("Pdf initiate");
        if (data.Error_Code !== '' || true) {
            if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                var sleep = require('system-sleep');
                sleep(6000);
                objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
            }
        }
    });
};
BajajAllianzPA.prototype.pdf_response_handler = function (objResponseJson) {
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
            if (objResponseJson.hasOwnProperty('fileByteObj') && objResponseJson['fileByteObj'] && objResponseJson.errormsg === 'SUCCESS') {
                var pdf_file_name = this.constructor.name + '_PA_' + this.lm_request['policy_number'].replaceAll('-', '') + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(objResponseJson['fileByteObj'], 'base64');
                fs.writeFileSync(pdf_sys_loc_horizon, binary);
                policy.policy_url = pdf_web_path_portal;
                policy.pdf_status = 'SUCCESS';
            } else {
                policy.pdf_status = 'FAIL';
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
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
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
        objServiceHandler.Policy = this.const_policy;
    }
    return objServiceHandler;
};
BajajAllianzPA.prototype.get_plan_si = function (plan_name) {
   
//    var index = plans.findIndex(x => x.Plan_Name === plan_name);
//    return index === -1 ? "" : plans[index]['SI'];
};
BajajAllianzPA.prototype.get_plan_area = function (plan_id) {
    if(plan_id === 100){
        this.processed_request['___pa_insurance_si_death___'] = this.processed_request['___pa_insurance_si___'];
         this.processed_request['___pa_insurance_si_ptd__'] = ""
         this.processed_request['___pa_insurance_si_ppd__'] = "";
    }else{
         this.processed_request['___pa_insurance_si_death___'] = this.prepared_request['pa_insurance_si'];
         this.processed_request['___pa_insurance_si_ptd__'] = this.prepared_request['pa_insurance_si'];
         this.processed_request['___pa_insurance_si_ppd__'] = this.prepared_request['pa_insurance_si'];
    }
//    var index = plans.findIndex(x => x.Region === travel_area && x.plan_id === plan_id);
//    this.processed_request['___areaname___'] = index === -1 ? "" : plans[index]['area'];
};
BajajAllianzPA.prototype.calculate_bmi = function (i) {
    var height = this.lm_request['member_' + i + '_height'];
    
    var weight = this.lm_request['member_' + i + '_weight'];

    var bmi = Math.round((weight / height / height) * 10000);
    this.prepared_request['member_' + i + '_bmi'] = bmi;
    this.processed_request['___member_' + i + '_bmi___'] = bmi;

};
BajajAllianzPA.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('BajajAllianzPA is_valid_plan', 'start');
 
    return true;
    
   
};
BajajAllianzPA.prototype.get_member_relation = function (i) {
    if (this.lm_request["relation"] === 'Self' || this.lm_request["relation"] === '' || this.lm_request["relation"] === undefined) {
        if (i >= 3) {
            this.prepared_request['member_' + i + '_relation'] = 'SON';
            this.processed_request['___member_'+ i + '_selfcoveredflag___'] = 'N';
        } else if (i === 1) {
            this.prepared_request['member_' + i + '_relation'] = 'SELF';
            this.processed_request['___member_'+ i + '_selfcoveredflag___'] = 'Y';
        } else if (i === 2) {
            this.prepared_request['member_' + i + '_relation'] = 'SPOUSE';
            this.processed_request['___member_'+ i + '_selfcoveredflag___'] = 'N';
        }
    }
    this.processed_request['___member_' + i + '_relation___'] = this.prepared_request['member_' + i + '_relation'];
};
BajajAllianzPA.prototype.premium_breakup_schema = {
    "net_premium": "premium",
    "CGST": "CGST",
    "SGST": "SGST",
    "service_tax": "serviceTax",
    "final_premium": "totalPremium"
};
module.exports = BajajAllianzPA;