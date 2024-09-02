/* Author:Kevin Monteiro
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
function HDFCErgoTravel() {

}
util.inherits(HDFCErgoTravel, Travel);
HDFCErgoTravel.prototype.insurer_date_format = 'yyyy-MM-dd';
//HDFCErgoTravel.prototype.const_insurer_suminsured = [100000, 200000, 300000, 400000, 500000];

HDFCErgoTravel.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
HDFCErgoTravel.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal') {
        var region_Id = {'Asia': 1, 'WWExUSCanada': 2, 'WorldWide': 3, 'Europe': 4};
        this.prepared_request['travelling_region_id'] = region_Id[this.lm_request.travelling_to_area];
        this.processed_request['___travelling_region_id___'] = this.prepared_request['travelling_region_id'];
        this.prepared_request['trip_type_id'] = this.lm_request.travel_insurance_type === 'individual' ? 1 : 2;
        this.processed_request['___trip_type_id___'] = this.prepared_request['trip_type_id'];
        this.processed_request['___adult_count___'] = this.prepared_request['trip_type_id'] === 1 ? 0 : this.lm_request.adult_count;
        this.processed_request['___child_count___'] = this.lm_request.child_count;
        this.processed_request['___maximum_duration___'] = this.lm_request['maximum_duration'];
        this.prepared_request['member_1_age_1'] = this.lm_request['member_1_age_1'];
        this.processed_request['___member_1_age_1___'] = this.prepared_request['member_1_age_1'];
        if (this.lm_request['trip_type'] === "MULTI") {
            this.processed_request['___travel_days___'] = '365';
            this.processed_request['___is_annual_multi_trip___'] = '1';
            this.processed_request['___trip_type_id___'] = this.prepared_request['trip_type_id'] = 1;
            this.processed_request['___policy_end_date___'] = moment(this.lm_request['policy_end_date']).subtract(1, 'days').format('YYYY-MM-DD');
        } else {
            this.processed_request['___travel_days___'] = moment(this.lm_request['policy_end_date']).diff(this.lm_request['policy_start_date'], 'days') + 1;
            this.processed_request['___is_annual_multi_trip___'] = '0';
        }
    }

    if (this.lm_request['method_type'] === 'Proposal') {
        this.processed_request['___service_tax___'] = this.lm_request['service_tax'];
        var placeOfVisit = "";
        this.lm_request['visiting_countries'].forEach((country) => {
            placeOfVisit += country.item_text + ",";
        });
        this.prepared_request['placeOfVisit'] = placeOfVisit.slice(0, -1);
        this.processed_request['___placeOfVisit___'] = this.prepared_request['placeOfVisit'];
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";

        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_relation(member);
            this.prepared_request['member_' + member + '_salutation'] = this.lm_request['member_' + member + '_salutation'];
            this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['member_' + member + '_salutation'];
            this.prepared_request['member_' + member + '_age_1'] = this.lm_request['member_' + member + '_age_1'];
            this.processed_request['___member_' + member + '_age_1___'] = this.prepared_request['member_' + member + '_age_1'];
            this.processed_request['___member_' + member + '_fullName___'] = this.lm_request['member_' + member + '_fullName'];
//            if (this.lm_request['member_' + member + '_ped'] !== '') {
//                var ped = "";
//                this.lm_request['member_' + member + '_ped'].forEach((illness) => {
//                    ped += illness.name + ", ";
//                });
//                this.prepared_request['member_' + member + '_illness'] = ped.slice(0, -2);
//            } else {
//                this.prepared_request['member_' + member + '_illness'] = 'None';
//                txt_replace_with = txt_replace_with.replace('"___member_' + member + '_illness___"', null);
//            }
//            this.processed_request['___member_' + member + '_illness___'] = this.prepared_request['member_' + member + '_illness'];
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_age_1'] = this.lm_request['member_' + member + '_age_1'];
            this.processed_request['___member_' + member + '_age_1___'] = this.prepared_request['member_' + member + '_age_1'];
            this.get_member_relation(member);
            if (this.prepared_request['member_' + member + '_age_1'] === 0) {
                this.processed_request['___member_' + member + '_age_1___'] = '0.' + moment(this.lm_request['policy_start_date']).diff(this.lm_request['member_' + member + '_birth_date'], 'months');
            }
            this.prepared_request['member_' + member + '_salutation'] = this.lm_request['member_' + member + '_salutation'];
            this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['member_' + member + '_salutation'];
            this.processed_request['___member_' + member + '_fullName___'] = this.lm_request['member_' + member + '_fullName'];

//            if (this.lm_request['member_' + member + '_ped'] !== '') {
//                var ped = "";
//                this.lm_request['member_' + member + '_ped'].forEach((illness) => {
//                    ped += illness.name + ", ";
//                });
//                this.prepared_request['member_' + member + '_illness'] = ped.slice(0, -2);
//            } else {
//                this.prepared_request['member_' + member + '_illness'] = 'None';
//                txt_replace_with = txt_replace_with.replace('"___member_' + member + '_illness___"', null);
//            }
//            this.processed_request['___member_' + member + '_illness___'] = this.prepared_request['member_' + member + '_illness'];
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
        this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
    } else if (this.lm_request['method_type'] === 'Verification') {
        this.prepared_request['unique_id'] = this.lm_request['crn'] + '_' + this.current_time();
        this.processed_request['___unique_id___'] = this.prepared_request['unique_id'];
    }
    console.log(this.method_content);
    console.log('insurer_product_field_process_pre');
};
HDFCErgoTravel.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
HDFCErgoTravel.prototype.insurer_product_field_process_post = function () {

};
HDFCErgoTravel.prototype.insurer_product_api_post = function () {

};
HDFCErgoTravel.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        let objInsurerProduct = this;
        let body = docLog.Insurer_Request;
        let Client = require('node-rest-client').Client;
        let client = new Client();
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        let args = {
            data: body,
            headers: {
                'MerchantKey': objInsurerProduct.processed_request["___insurer_integration_service_user___"],
                'SecretToken': objInsurerProduct.processed_request["___insurer_integration_service_password___"],
                'Content-Type': "application/json"
            }
        };
        client.post(specific_insurer_object.method_file_url, args, function (data, response) {
            //console.log(response.statusCode);
            let objData = JSON.stringify(data);
            let objResponseFull = {
                'err': null,
                'result': objData,
                'raw': objData,
                'soapHeader': null,
                'objResponseJson': JSON.parse(objData)
            };
            if (objInsurerProduct.lm_request['method_type'] === 'Premium') {
                objResponseFull['objResponseJson']['PlanName'] = docLog['Plan_Name'];
            }
            objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
HDFCErgoTravel.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    let objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    let Error_Msg = 'NO_ERR';
    try {
        let objDetails = objResponseJson;
        if (objDetails.Status === 200 && objDetails.hasOwnProperty('Data') && objDetails.Data !== null && objDetails.Data !== '') {
            let objPlanDetails = objDetails['Data'];
            let premium_breakup = this.get_const_premium_breakup();
            for (let p = 0; p < objPlanDetails.length; p++) {
                if (objPlanDetails[p]['PlanName'].includes(objResponseJson['PlanName'])) {
                    premium_breakup['net_premium'] = Number(objPlanDetails[p]['BasePemiumAmount']);
                    premium_breakup['service_tax'] = Number(objPlanDetails[p]['TaxAmount']);
                    premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                    premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                    premium_breakup['final_premium'] = Number(objPlanDetails[p]['TotalPremiumAmount']);
                    premium_breakup['travel_insurance_si'] = "$" + objPlanDetails[p]['SumInsured'];
                    objServiceHandler.Premium_Breakup = premium_breakup;
                    //objServiceHandler.Insurer_Transaction_Identifier = objPlanDetails[p]['PlanName']['0'] + "|" + objPlanDetails[p]['RiskType']['0'];
                    break;
                } else {
                    objServiceHandler.Premium_Breakup = premium_breakup;
                    objServiceHandler.Insurer_Transaction_Identifier = "";
                }
            }
        } else {
            if (objDetails.Status !== 200 && objDetails.hasOwnProperty('Message')) {
                Error_Msg = objDetails['Message'].toString();
            } else {
                Error_Msg = JSON.stringify(objDetails);
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        let Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
HDFCErgoTravel.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.lm_request['adult_count'] === 2) {
            if (this.lm_request['member_1_gender'] === 'M' && this.lm_request['member_1_age'] < 21) {
                Error_Msg = '\u2726 Age should be atleast 21 yrs for Married male ';
            } else if (this.lm_request['member_2_gender'] === 'M' && this.lm_request['member_2_age'] < 21) {
                Error_Msg = '\u2726 Age should be atleast 21 yrs for Married male ';
            }

            if (this.lm_request['relation'] === 'Spouse') {
                Error_Msg = Error_Msg === 'NO_ERR' ? '' : Error_Msg;
                Error_Msg += '\u2726 Please select correct Proposer Relationship';
            }
        }
        if (objResponseJson.Status !== 200 && objResponseJson.hasOwnProperty('Message')) {
            if (objResponseJson.hasOwnProperty('Message') && objResponseJson.Message !== '') {
                var resp_err = objResponseJson['Message'][0];
            } else {
                var resp_err = objResponseJson['Data'];
            }
            Error_Msg = Error_Msg === 'NO_ERR' ? '' : Error_Msg;
            for (var key of Object.keys(resp_err)) {
                Error_Msg += '\u2726 ' + key + " : " + resp_err[key] + ' ';
            }
        }

        if (Error_Msg === 'NO_ERR') {
            var merchant_key = this.processed_request["___insurer_integration_service_user___"];
            var secret_token = this.processed_request["___insurer_integration_service_password___"];
            var transaction_no = objResponseJson.Data.TransactionNo;
            var feature_id = 'S001';

            var pg_data = {
                'trnsno': transaction_no,
                'FeatureID': feature_id
            };
            var hash_data = {// sha512(merchant_key|transaction_no|secret_token|feature_id);
                'merchant_key': merchant_key, 'trnsno': transaction_no, 'secret_token': secret_token, 'feature_id': feature_id
            };
            function jsonToQueryString(json) {
                return Object.keys(json).map(function (key) {
                    return json[key];
                }).join('|');
            }
            var checksummsg = jsonToQueryString(hash_data);
            var checksumvalue = this.convert_to_sha512(checksummsg);
            pg_data['CheckSum'] = checksumvalue;
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = transaction_no;
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
HDFCErgoTravel.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_post;
        if (output.hasOwnProperty('hdmsg')) {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_amount = this.proposal_processed_request['___final_premium___'];
            this.const_policy.transaction_id = output.hdmsg;
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
HDFCErgoTravel.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };

        if (objResponseJson.Status === 200 && objResponseJson.Data.PaymentStatus === 'SPD') {//transaction success
            this.const_policy.policy_number = objResponseJson.Data.PolicyDetails[0].PolicyNo;
            this.const_policy.transaction_status = 'SUCCESS';
            var pdf_file_name = this.constructor.name + '_Travel_' + this.const_policy.policy_number + '.pdf';
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
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
            Error_Msg = objResponseJson.hasOwnProperty('Data') && objResponseJson['Data'] && objResponseJson['Data'].hasOwnProperty('Remark') && objResponseJson['Data']['Remark'] ? objResponseJson['Data']['Remark'] :Error_Msg ;
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
HDFCErgoTravel.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
HDFCErgoTravel.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        if (objResponseJson.hasOwnProperty('status')) {
            if (objResponseJson['status'] === '200' && objResponseJson.pdfbytes !== null) {
                var pdf_binary = objResponseJson['pdfbytes'];
            } else {
                Error_Msg = objResponseJson['ErrMsg'];
            }
        } else {
            Error_Msg = "PDF_MAIN_NODE_MISSING";
        }
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR' && pdf_binary !== '' && pdf_binary !== undefined) {
            var pdf_file_name = this.constructor.name + '_Travel_' + this.lm_request['policy_number'] + '.pdf';
            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            policy.policy_url = pdf_web_path_portal;
            var binary = new Buffer(pdf_binary, 'base64');
            fs.writeFileSync(pdf_sys_loc, binary);
            policy.pdf_status = 'SUCCESS';
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.pdf_status = 'FAIL';
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
HDFCErgoTravel.prototype.current_time = function () {
    var today = moment().utcOffset("+05:30");
    var current_time = moment(today).format("HH:mm:ss");
    current_time = current_time.replaceAll(":", "");
    return current_time;
};
HDFCErgoTravel.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start HDFCErgoTravel');
    var gender = this.lm_request['member_' + i + '_gender'];
    var proposer_rel = this.lm_request["relation"];
    var member_rel = '';
    var insured_type = '';
    console.log("Gender in HDFCErgoTravel:: " + gender);
    // 9:SELF, 1:SPOUSE, 2:SON, 3:DAUGHTER, 5:FATHER, 4:MOTHER 

    if (proposer_rel === 'Son' || proposer_rel === 'Daughter') {
        member_rel = gender === 'M' ? 'Father' : 'Mother';
        insured_type = member_rel;
    } else if (proposer_rel === 'Father' || proposer_rel === 'Mother') {
        member_rel = gender === 'M' ? 'Son' : 'Daughter';
        insured_type = 'Child ' + (i > 2 ? i - 2 : i);
    } else if (proposer_rel === 'Spouse') {
        member_rel = 'Spouse';
        insured_type = 'Spouse';
        if (i >= 3) {
            member_rel = gender === 'M' ? 'Son' : 'Daughter';
            insured_type = 'Child ' + (i - 2);
        }
    }

    if (proposer_rel === 'Self' || proposer_rel === '') {
        if (i >= 3) {
            member_rel = gender === 'M' ? 'Son' : 'Daughter';
            this.prepared_request['member_' + i + '_nominee_age'] = this.prepared_request['member_1_age'];
            insured_type = 'Child ' + (i - 2);
        } else if (i === 1) {
            member_rel = 'Self';
            insured_type = this.lm_request['member_count'] < 2 ? 'Traveller' : 'Me';
            this.prepared_request['member_' + i + '_nominee_name'] = this.lm_request["nominee_name"];
            this.prepared_request['member_' + i + '_nominee_age'] = this.prepared_request["nominee_age"];
        } else if (i === 2) {
            member_rel = 'Spouse';
            insured_type = 'Spouse';
        }
    }
    if (this.lm_request["travel_insurance_type"] === 'individual') {
        insured_type = 'Traveller';
    }

    this.prepared_request['member_' + i + '_relation'] = member_rel;
    this.processed_request['___member_' + i + '_relation___'] = member_rel;
    this.prepared_request['member_' + i + '_insured_type'] = insured_type;
    this.processed_request['___member_' + i + '_insured_type___'] = insured_type;
    this.get_nominee_relation(i);
};

/*
 HDFCErgoTravel.prototype.get_nominee_relation_old = function (i) {
 var proposer_rel = this.lm_request["relation"];
 var nominee_rel = this.lm_request["nominee_relation"];
 var gender = this.lm_request['member_' + i + '_gender'];
 var member_nom_rel = nominee_rel;
 if (proposer_rel === 'Self' || proposer_rel === 'Spouse') {
 if (i === 2) {
 if (nominee_rel === "Spouse") {
 member_nom_rel = "Spouse";
 } else if (nominee_rel === "Father") {
 member_nom_rel = "Father-in-Law";
 } else if (nominee_rel === "Mother") {
 member_nom_rel = "Mother-in-Law";
 }
 } else if (i > 2) {
 if (nominee_rel === "Spouse") {
 member_nom_rel = this.lm_request['gender'] === "M" ? "Mother" : "Father";
 } else if (nominee_rel === "Father") {
 member_nom_rel = "Grand Father";
 } else if (nominee_rel === "Mother") {
 member_nom_rel = "Grand Mother";
 } else if (nominee_rel === "Son") {
 member_nom_rel = gender === "M" ? "proposer_detail" : "Brother";
 } else if (nominee_rel === "Daughter") {
 member_nom_rel = gender === "F" ? "proposer_detail" : "Sister";
 }
 }
 } else if (proposer_rel === 'Son' || proposer_rel === 'Daughter') {
 if (i < 3) {
 if (nominee_rel === "Spouse") {
 member_nom_rel = "Others";
 } else if (nominee_rel === "Father") {
 member_nom_rel = gender === "M" ? "proposer_detail" : "Spouse";
 } else if (nominee_rel === "Mother") {
 member_nom_rel = gender === "F" ? "proposer_detail" : "Spouse";
 } else if (nominee_rel === "Son") {
 member_nom_rel = "Grand Son";
 } else if (nominee_rel === "Daughter") {
 member_nom_rel = "Grand Daughter";
 }
 }
 } else if (proposer_rel === 'Father' || proposer_rel === 'Mother') {
 if (i < 3) {
 if (nominee_rel === "Spouse") {
 member_nom_rel = proposer_rel === 'Father' ? "Mother" : "Father";
 } else if (nominee_rel === "Father") {
 member_nom_rel = "Grand Father";
 } else if (nominee_rel === "Mother") {
 member_nom_rel = "Grand Mother";
 }
 }
 }
 this.prepared_request['member_' + i + '_nominee_rel'] = member_nom_rel === "proposer_detail" ? proposer_rel : member_nom_rel;
 if (i > 2 && proposer_rel === 'Self' && member_nom_rel === "proposer_detail" && (nominee_rel === "Son" || nominee_rel === "Daughter")) {
 this.prepared_request['member_' + i + '_nominee_rel'] = this.lm_request['gender'] === "M" ? "Father" : "Mother";
 }
 this.processed_request['___member_' + i + '_nominee_rel___'] = this.prepared_request['member_' + i + '_nominee_rel'];
 this.processed_request['___member_' + i + '_nominee_name___'] = member_nom_rel === "proposer_detail" ? this.lm_request["contact_name"] : this.lm_request["nominee_name"];
 this.processed_request['___member_' + i + '_nominee_age___'] = member_nom_rel === "proposer_detail" ? this.prepared_request["insured_age"] : this.prepared_request["nominee_age"];
 };
 */
HDFCErgoTravel.prototype.get_nominee_relation = function (i) {
    var proposer_rel = this.lm_request["relation"];
    var nominee_rel = this.lm_request["nominee_relation"];
    var gender = this.lm_request['member_' + i + '_gender'];
    var member_nom_rel = nominee_rel;

    if (i > 1) {
        if (proposer_rel === 'Self' || proposer_rel === 'Spouse') {
            if (i === 2) {
                if (nominee_rel === "Spouse") {
                    member_nom_rel = "proposer_detail";
                } else if (nominee_rel === "Father") {
                    member_nom_rel = "Father-in-Law";
                } else if (nominee_rel === "Mother") {
                    member_nom_rel = "Mother-in-Law";
                }
            } else if (i > 2) {
                if (nominee_rel === "Spouse") {
                    member_nom_rel = this.lm_request['gender'] === "M" ? "Mother" : "Father";
                } else if (nominee_rel === "Father") {
                    member_nom_rel = "Grand Father";
                } else if (nominee_rel === "Mother") {
                    member_nom_rel = "Grand Mother";
                } else if (nominee_rel === "Son") {
                    member_nom_rel = gender === "M" ? "proposer_detail" : "Brother";
                } else if (nominee_rel === "Daughter") {
                    member_nom_rel = gender === "F" ? "proposer_detail" : "Sister";
                }
            }
        } else if (proposer_rel === 'Son' || proposer_rel === 'Daughter') {
            if (i < 3) {
                if (nominee_rel === "Spouse") {
                    member_nom_rel = "proposer_detail";
                } else if (nominee_rel === "Father") {
                    member_nom_rel = gender === "M" ? "proposer_detail" : "Spouse";
                } else if (nominee_rel === "Mother") {
                    member_nom_rel = gender === "F" ? "proposer_detail" : "Spouse";
                } else if (nominee_rel === "Son") {
                    member_nom_rel = "Grand Son";
                } else if (nominee_rel === "Daughter") {
                    member_nom_rel = "Grand Daughter";
                }
            }
        } else if (proposer_rel === 'Father' || proposer_rel === 'Mother') {
            if (i < 3) {
                if (nominee_rel === "Spouse") {
                    member_nom_rel = proposer_rel === 'Father' ? "Mother" : "Father";
                } else if (nominee_rel === "Father") {
                    member_nom_rel = "Grand Father";
                } else if (nominee_rel === "Mother") {
                    member_nom_rel = "Grand Mother";
                }
            }
        }
    }

    this.prepared_request['member_' + i + '_nominee_rel'] = member_nom_rel === "proposer_detail" ? proposer_rel : member_nom_rel;
    if (i > 2 && proposer_rel === 'Self' && member_nom_rel === "proposer_detail" && (nominee_rel === "Son" || nominee_rel === "Daughter")) {
        this.prepared_request['member_' + i + '_nominee_rel'] = this.lm_request['gender'] === "M" ? "Father" : "Mother";
    }
    if (i === 2 && proposer_rel === "Self" && nominee_rel === "Spouse") {
        this.prepared_request['member_' + i + '_nominee_rel'] = 'Spouse';
    }
    this.processed_request['___member_' + i + '_nominee_rel___'] = this.prepared_request['member_' + i + '_nominee_rel'];
    this.processed_request['___member_' + i + '_nominee_name___'] = member_nom_rel === "proposer_detail" ? this.lm_request["contact_name"] : this.lm_request["nominee_name"];
    this.processed_request['___member_' + i + '_nominee_age___'] = member_nom_rel === "proposer_detail" ? this.prepared_request["insured_age"] : this.prepared_request["nominee_age"];
};
HDFCErgoTravel.prototype.get_member_age = function (i) {
    //var today = moment().utcOffset("+05:30");
    this.prepared_request['member_' + i + '_age_1'] = moment(this.lm_request['policy_start_date']).diff(this.lm_request['member_' + i + '_birth_date'], 'years');
    this.processed_request['___member_' + i + '_age_1___'] = this.prepared_request['member_' + i + '_age_1'];
};
HDFCErgoTravel.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('HDFCErgoTravel is_valid_plan', 'start');
    for (var member = 1; member <= lm_request['adult_count']; member++) {
        lm_request['member_' + member + '_age_1'] = moment(lm_request['policy_start_date']).diff(lm_request['member_' + member + '_birth_date'], 'years');
        if (lm_request['member_' + member + '_age_1'] > 70) {
            return false;
        }
    }
    for (member = 3; member <= lm_request['child_count'] + 2; member++) {
        lm_request['member_' + member + '_age_1'] = moment(lm_request['policy_start_date']).diff(lm_request['member_' + member + '_birth_date'], 'years');
    }

    if (lm_request['travelling_to_area'] === "Africa" || (lm_request['trip_type'] === 'MULTI' && (lm_request['travelling_to_area'] === "WWExUSCanada" || lm_request['member_count'] > 1)) || lm_request['child_count'] > 2 || lm_request['maximum_duration'] > 45) {
        return false;
    } else {
        return true;
    }
    console.log('HDFCErgoTravel is_valid_plan', 'End');
};
HDFCErgoTravel.prototype.premium_breakup_schema = {
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
module.exports = HDFCErgoTravel;