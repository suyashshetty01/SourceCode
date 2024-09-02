/* Author:Kevin Monteiro
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require("util");
var path = require("path");
var appRoot = path.dirname(path.dirname(require.main.filename));
var Travel = require(appRoot + "/libs/Travel");
var config = require("config");
var moment = require("moment");
var fs = require("fs");

function GoDigitTravel() {

}
util.inherits(GoDigitTravel, Travel);
GoDigitTravel.prototype.insurer_date_format = 'yyyy-MM-dd';
//GoDigitTravel.prototype.const_insurer_suminsured = [100000, 200000, 300000, 400000, 500000];

GoDigitTravel.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
GoDigitTravel.prototype.insurer_product_field_process_pre = function () {
    var member = 1;

    if (this.lm_request['method_type'] === 'Premium') {
        var destinationId = {"Asia": 4, "Africa": 3, "Europe": 3, "WorldWide": 2, "WWExUSCanada": 3};

        var args = {
            "Insurer_Id": 44,
            "Age_Start_in_Months": {$lte: this.lm_request["elder_member_age_in_months"]},
            "Age_End_in_Months": {$gte: this.lm_request["elder_member_age_in_months"]},
            "TravelDays": this.processed_request['___travel_days___'],
            "Destination_Id": destinationId[this.lm_request["travelling_to_area"]]
        };
        this.method_content = JSON.stringify(args);

    } else if (this.lm_request['method_type'] === 'Proposal') {
        //occupation
        let region_code = {"Asia": "ASA", "Africa": "ROW", "Europe": "ROW", "WWExUSCanada": "ROW", "WorldWide": "UCI"};
        this.prepared_request['region_code'] = region_code[this.lm_request.travelling_to_area];
        this.processed_request['___region_code___'] = this.prepared_request['region_code'];
        this.prepared_request['bookingId'] = this.lm_request['crn'] + moment().utcOffset("+05:30").format("HHmmss");
        this.processed_request['___bookingId___'] = this.prepared_request['bookingId'];
        this.prepared_request['travel_purpose'] = this.lm_request.otherDetailsData['0'].value;
        this.processed_request['___travel_purpose___'] = this.prepared_request['travel_purpose'];
        this.processed_request['___member_count___'] = this.lm_request['member_count'];
        this.prepared_request['state_code'] = this.get_state_code(this.lm_request['permanent_state']);
        this.processed_request['___state_code___'] = this.prepared_request['state_code'];
        var placeOfVisit = "";
        this.lm_request['visiting_countries'].forEach((country) => {
            placeOfVisit += country.item_id + ", ";
        });
        this.prepared_request['placeOfVisit'] = placeOfVisit.slice(0, -2);
        this.processed_request['___placeOfVisit___'] = this.prepared_request['placeOfVisit'];
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace_with === "" ? txt_replace.replaceAll('___member_array', '___member_' + member) : ",\n" + txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_relation(member);
            this.prepared_request['member_' + member + '_gender_2'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'ML' : 'FE';
            this.processed_request['___member_' + member + '_gender_2___'] = this.prepared_request['member_' + member + '_gender_2'];
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += ',\n' + txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_relation(member);
            this.prepared_request['member_' + member + '_gender_2'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'ML' : 'FE';
            this.processed_request['___member_' + member + '_gender_2___'] = this.prepared_request['member_' + member + '_gender_2'];
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");

    }
    console.log(this.method_content);
    console.log('insurer_product_field_process_pre');
};
GoDigitTravel.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
GoDigitTravel.prototype.insurer_product_field_process_post = function () {

};
GoDigitTravel.prototype.insurer_product_api_post = function () {

};
GoDigitTravel.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;

        if (specific_insurer_object.method.Method_Calling_Type === 'Database') { //premium
            var args = JSON.parse(this.method_content);
            args['InsurerProduct_Id'] = docLog['Plan_Code'];
            var Travel_Rate = require(appRoot + '/models/travel_rate');
            Travel_Rate.find(args, function (err, dbTravelRate) {
                console.log('Ins Res:: ', dbTravelRate);
                if (dbTravelRate !== null) {
                    var objResponseFull = {
                        'err': err,
                        'result': dbTravelRate,
                        'raw': JSON.stringify(dbTravelRate),
                        'soapHeader': null,
                        'objResponseJson': dbTravelRate
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                }
            });

        } else if (specific_insurer_object.method.Method_Calling_Type === 'POST') { //proposal
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var args = {
                data: docLog.Insurer_Request,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": objInsurerProduct.processed_request["___insurer_integration_service_user___"]
                }
            };
            client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                var objData = JSON.stringify(data);
                var objResponseFull = {
                    'err': null,
                    'result': objData,
                    'raw': objData,
                    'soapHeader': null,
                    'objResponseJson': JSON.parse(objData)
                };
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        } else {
            var Client = require('node-rest-client').Client;
            var client = new Client();
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
                        'raw': objData,
                        'soapHeader': null,
                        'objResponseJson': JSON.parse(objData)
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            } else { //pdf
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

GoDigitTravel.prototype.premium_response_handler = function (objResponseJson) {
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null
        };
        var Error_Msg = 'NO_ERR';
        if (objResponseJson !== null && objResponseJson['0'].hasOwnProperty('_doc')) {
            var objPremiumService = objResponseJson['0']['_doc'];
            if (objPremiumService.hasOwnProperty('Premium')) {
                var base_premium = (objPremiumService['Premium'] - 0);
                var premium_breakup = this.get_const_premium_breakup();
                premium_breakup['final_premium'] = Math.round(base_premium * this.lm_request['member_count']);
                premium_breakup['net_premium'] = Math.round(premium_breakup['final_premium'] / 1.18);
                premium_breakup['service_tax'] = premium_breakup['final_premium'] - premium_breakup['net_premium'];
                premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['travel_insurance_si'] = "$" + objPremiumService.SumInsured;
                objServiceHandler.Premium_Breakup = premium_breakup;
            } else {
                Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
            }
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
GoDigitTravel.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.lm_request['question_1_details'] === false) {
            Error_Msg = 'Traveler(s) need to be residents of India and the trip should be starting from India only';
        } else if (objResponseJson.status.code !== "200") {
            Error_Msg = objResponseJson.status.message;
        } else if (objResponseJson.hasOwnProperty('insuredPersons') && objResponseJson.insuredPersons[0].hasOwnProperty('paymentDetails')) {
            var proposal_amt = parseInt(objResponseJson.insuredPersons[0].paymentDetails.policyPremium);
            var prm_diff = proposal_amt > this.lm_request['final_premium'] ? proposal_amt - this.lm_request['final_premium'] : this.lm_request['final_premium'] - proposal_amt;
            if (prm_diff >= 5) {
                Error_Msg = "LM_Premium_Mismatch";
            }
        }

        if (Error_Msg === 'NO_ERR') {
            objServiceHandler.Payment.pg_url = objResponseJson.insuredPersons[0].paymentLink;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.insuredPersons[0].policyID;
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
GoDigitTravel.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get;
        if (output.hasOwnProperty('transactionNumber')) {
            var total_premium = this.insurer_master['service_logs']['insurer_db_master']['Insurer_Response']['insuredPersons']['0']['paymentDetails'].policyPremium;
            this.const_policy.policy_number = this.insurer_master['service_logs']['insurer_db_master']['Insurer_Response']['insuredPersons']['0']['policyID'];
            this.const_policy.transaction_id = output['transactionNumber'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.transaction_amount = total_premium;
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
GoDigitTravel.prototype.verification_response_handler = function (objResponseJson) {
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
                var pdf_file_name = this.constructor.name + '_Travel_' + this.const_policy.policy_number + '.pdf';
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
GoDigitTravel.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
GoDigitTravel.prototype.pdf_response_handler = function (objResponseJson) {
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
                var pdf_file_name = this.constructor.name + '_Travel_' + this.lm_request['policy_number'].replaceAll('/', '') + '.pdf';
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
GoDigitTravel.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start GoDigitTravel');
    var gender = this.lm_request['member_' + i + '_gender'];
    this.prepared_request['member_' + i + '_nominee_name'] = this.lm_request["contact_name"];
    //this.prepared_request['member_' + i + '_nominee_age'] = this.prepared_request["insured_age"];
    //this.prepared_request['member_' + i + '_nominee_dob'] = this.prepared_request["birth_date"];
    var proposer_rel = this.lm_request["relation"];
    var member_rel = '';
    var member_nominee_rel = '';

    // -:SELF, W:SPOUSE, S:SON, T:DAUGHTER, V:FATHER, M:MOTHER 

    if (proposer_rel === 'Son' || proposer_rel === 'Daughter') {
        member_rel = gender === 'M' ? 'Father' : 'Mother';
        //member_nominee_rel = this.lm_request['gender'] === 'M' ? 'S' : 'T';
    } else if (proposer_rel === 'Father' || proposer_rel === 'Mother') {
        member_rel = gender === 'M' ? 'Son' : 'Daughter';
        //member_nominee_rel = this.lm_request['gender'] === 'M' ? 'V' : 'M';
    } else if (proposer_rel === 'Spouse') {
        member_rel = 'Spouse';
       // member_nominee_rel = 'W';
        if (i >= 3) {
            member_rel = gender === 'M' ? 'Son' : 'Daughter';
            //member_nominee_rel = this.lm_request['gender'] === 'M' ? 'V' : 'M';
        }
    }

    if (proposer_rel === 'Self' || proposer_rel === '') {
        if (i >= 3) {
            member_rel = gender === 'M' ? 'Son' : 'Daughter';
            //member_nominee_rel = this.lm_request['member_1_gender'] === 'M' ? 'V' : 'M';
            //this.prepared_request['member_' + i + '_nominee_age'] = this.prepared_request['member_1_age'];
            //this.prepared_request['member_' + i + '_nominee_dob'] = this.prepared_request["member_1_birth_date"];
        } else if (i === 1) {
            member_rel = 'Self';
            //member_nominee_rel = this.lm_request["nominee_relation"];
            this.prepared_request['member_' + i + '_nominee_name'] = this.lm_request["nominee_name"];
            //this.prepared_request['member_' + i + '_nominee_age'] = this.prepared_request["nominee_age"];
            //this.prepared_request['member_' + i + '_nominee_dob'] = this.prepared_request["nominee_birth_date"];
        } else if (i === 2) {
            member_rel = 'Spouse';
            //member_nominee_rel = 'W';
        }
    }
    var mem_rel = {"Spouse": "W", "Son": "S", "Daughter": "T", "Father": "V", "Mother": "M"};
// -:SELF, W:SPOUSE, S:SON, T:DAUGHTER, V:FATHER, M:MOTHER
    this.prepared_request['member_' + i + '_relation'] = mem_rel[member_rel];
    this.processed_request['___member_' + i + '_relation___'] = mem_rel[member_rel];
    ;
    //this.prepared_request['member_' + i + '_nominee_rel'] = member_nominee_rel;
    //this.processed_request['___member_' + i + '_nominee_rel___'] = member_nominee_rel;
    this.processed_request['___member_' + i + '_nominee_name___'] = this.prepared_request['member_' + i + '_nominee_name'];
    //this.processed_request['___member_' + i + '_nominee_age___'] = this.prepared_request['member_' + i + '_nominee_age'];
    //this.processed_request['___member_' + i + '_nominee_dob___'] = this.prepared_request['member_' + i + '_nominee_dob'];
};
GoDigitTravel.prototype.get_state_code = function (stateName) {
    console.log('GoDigit state_code', 'start');
    var GoDigitState = [
        {'code': 1, 'state': 'Jammu And Kashmir'},
        {'code': 2, 'state': 'Himachal Pradesh'},
        {'code': 3, 'state': 'Punjab'},
        {'code': 4, 'state': 'Chandigarh'},
        {'code': 5, 'state': 'Uttarakhand'},
        {'code': 6, 'state': 'Haryana'},
        {'code': 7, 'state': 'Delhi'},
        {'code': 8, 'state': 'Rajasthan'},
        {'code': 9, 'state': 'Uttar Pradesh'},
        {'code': 10, 'state': 'Bihar'},
        {'code': 11, 'state': 'Sikkim'},
        {'code': 12, 'state': 'Arunachal Pradesh'},
        {'code': 13, 'state': 'Nagaland'},
        {'code': 14, 'state': 'Manipur'},
        {'code': 15, 'state': 'Mizoram'},
        {'code': 16, 'state': 'Tripura'},
        {'code': 17, 'state': 'Meghalaya'},
        {'code': 18, 'state': 'Assam'},
        {'code': 19, 'state': 'West Bengal'},
        {'code': 20, 'state': 'Jharkhand'},
        {'code': 21, 'state': 'Orissa'},
        {'code': 22, 'state': 'Chattisgarh'},
        {'code': 23, 'state': 'Madhya Pradesh'},
        {'code': 24, 'state': 'Gujarat'},
        {'code': 25, 'state': 'Daman & Diu'},
        {'code': 26, 'state': 'Dadra & Nagar Haveli'},
        {'code': 27, 'state': 'Maharashtra'},
        {'code': 29, 'state': 'Karnataka'},
        {'code': 30, 'state': 'Goa'},
        {'code': 31, 'state': 'Lakshadweep'},
        {'code': 32, 'state': 'Kerala'},
        {'code': 33, 'state': 'Tamil Nadu'},
        {'code': 34, 'state': 'Pondicherry'},
        {'code': 35, 'state': 'Andaman & Nicobar Islands'},
        {'code': 36, 'state': 'Telangana'},
        {'code': 37, 'state': 'Andhra Pradesh'}
    ];
    var index = GoDigitState.findIndex(x => x.state === stateName);
    if (index === -1) {
        return "";
    }
    return GoDigitState[index]['code'];
    console.log('GoDigit state_code', 'end');
};

GoDigitTravel.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('GoDigitTravel is_valid_plan', 'start');
    if (lm_request.trip_type === "MULTI" || lm_request['member_1_age_'] > 60 || (lm_request.travelling_to_area !== "Asia" && ["R7", "R8"].includes(planCode))) {
        return false;
    } else if (lm_request.travelling_to_area === "Asia" && (lm_request.travel_days > 60 || ["R3", "R4", "R5", "R6"].includes(planCode))) {
        return false;
    }
    return true;
    console.log('GoDigitTravel is_valid_plan', 'End');
};
GoDigitTravel.prototype.premium_breakup_schema = {
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
module.exports = GoDigitTravel;