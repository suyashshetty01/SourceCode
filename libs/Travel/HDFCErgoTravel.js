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
var request = require('request');
var moment = require('moment');
const { error } = require('console');
var xml2js = require('xml2js');
function HDFCErgoTravel() {

}
util.inherits(HDFCErgoTravel, Travel);
HDFCErgoTravel.prototype.insurer_date_format = 'yyyy-MM-dd';
//HDFCErgoTravel.prototype.const_insurer_suminsured = [100000, 200000, 300000, 400000, 500000];

HDFCErgoTravel.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
HDFCErgoTravel.prototype.insurer_product_field_process_pre = function () {

    try {

        let plan_type = {
            "2A+0C": "2 Adult",
            "0A+2C": "2 Children",
            "2A+1C": "2 Adult + 1 Child",
            "2A+2C": "2 Adult + 2 Children",
            "1A+2C": "1 Adult + 2 Children",
            "1A+1C": "1 Adult + 1 Child"
        };

        this.processed_request['___gender___'] = this.processed_request['___gender___'] === "M" ? "MALE" : "FEMALE";
        this.processed_request['___birth_date___'] = moment(this.processed_request['___birth_date___']).format("DD/MM/YYYY");

        this.prepared_request['custom_txnID'] = this.lm_request['method_type'] === "Premium" ? this.prepared_request['Plan_Name'].toUpperCase() + moment().unix() : this.prepared_request['dbmaster_pb_plan_name'].toUpperCase() + moment().unix(); //this.prepared_request['Plan_Name'].toUpperCase() + (crypto.randomBytes(6).toString('hex').slice(0, 6)).toUpperCase();
        this.processed_request['___custom_txnID___'] = this.prepared_request['custom_txnID'];

        this.processed_request['___trip_type___'] = this.lm_request['trip_type'] === "MULTI" ? "Family Floater" : "Single Trip";

        this.prepared_request['family_plan_type'] = this.lm_request['trip_type'] === "MULTI" ? plan_type[`${this.lm_request['adult_count']}A+${this.lm_request['child_count']}C`] : "";
        this.processed_request['___family_plan_type___'] = this.prepared_request['family_plan_type'];


        let pol_start = moment(this.lm_request['policy_start_date'], 'YYYY-MM-DD').format("DD/MM/YYYY");
        this.processed_request['___policy_start_date___'] = pol_start;
        this.processed_request['___proposalDate___'] = moment().format("DD/MM/YYYY");

        if (this.lm_request['trip_type'] === "MULTI" || this.lm_request['method_type'] === "Proposal") {
            let plan_with_amount = { "Gold": "Gold USD 100000", "Silver": "Silver USD 50000", "Platinum": "Platinum USD 200000", "Titanium": "Titanium USD 500000" };
            this.processed_request['___Plan_Name___'] = plan_with_amount[ this.prepared_request['dbmaster_pb_plan_name']];
        }

        var region_Id = { 'Asia': "Within Asia", 'WWExUSCanada': "Excl USA / Canada", 'WorldWide': "Inc USA / Canada  (Worldwide)", 'Europe': 4 };
        this.processed_request['___visiting_region___'] = region_Id[this.lm_request.travelling_to_area];

        let countries_arr = [];

        if (this.lm_request['method_type'] === "Verification") {
            console.log("verification");
        }

        if (this.lm_request['method_type'] === "Proposal") {
            this.lm_request['visiting_countries'].filter(e => countries_arr.push(e.item_text));
            this.prepared_request['visiting_countries'] = countries_arr.join();
            this.processed_request['___visiting_countries___'] = this.prepared_request['visiting_countries'];
        }
        var single_trip_req_json = this.find_text_btw_key(this.method_content.toString(), '<!--singleStart-->', '<!--singleEnd-->', true);
        var family_trip_req_json = this.find_text_btw_key(this.method_content.toString(), '<!--familyStart-->', '<!--familyEnd-->', true);
        if (this.processed_request['___trip_type___'] === "Single Trip") {
            this.method_content = this.method_content.replace(family_trip_req_json, '');
            this.method_content = this.method_content.replace('<!--singleStart-->', '');
            this.method_content = this.method_content.replace('<!--singleEnd-->', '');
            this.method_content = this.method_content.replace('<!--familyStart-->', '');
            this.method_content = this.method_content.replace('<!--familyEnd-->', '');
        } else {
            this.method_content = this.method_content.replace(single_trip_req_json, '');
            this.method_content = this.method_content.replace('<!--singleStart-->', '');
            this.method_content = this.method_content.replace('<!--singleEnd-->', '');
            this.method_content = this.method_content.replace('<!--familyStart-->', '');
            this.method_content = this.method_content.replace('<!--familyEnd-->', '');
        }

        var member_objects = this.find_text_btw_key(this.method_content.toString(), '<!--members_start-->', '<!--members_end-->', true);
        let object_mem = [];
        for (let i = 1; i <= parseInt(this.lm_request['adult_count']); i++) {
            this.processed_request['___member_' + i + '_birth_date___'] = moment(this.lm_request['member_' + i + '_birth_date']).format('DD/MM/YYYY');
            this.processed_request['___member_' + i + '_gender___'] = this.processed_request['___member_' + i + '_gender___'] === "F" ? "FEMALE" : "MALE";
            // `___member_${i}_first_name___ ___member_${i}_middle_name___ ___member_${i}_last_name___`,
            object_mem.push(
                {
                    "PropRisks_NameoftheInsured_Mandatary": "___member_" + i + "_first_name___" + (this.processed_request["___member_" + i + "_middle_name___"] === "" ? " " : " ___member_" + i + "_middle_name___ ") + "___member_" + i + "_last_name___",
                    "PropRisks_DateOfBirth": '___member_' + i + '_birth_date___',
                    "PropRisks_PassportNo_Mandatary": this.lm_request['method_type'] === 'Premium' ? "D123456" + i : "___member_" + i + "_passport___",
                    "PropRisks_Gender_Mandatary": this.lm_request['method_type'] === 'Premium' ? "MALE" : "___member_" + i + "_gender___",
                    "PropRisks_Relationship_Mandatary": this.lm_request['method_type'] === 'Premium' ? "Brother" : this.lm_request['member_' + i + '_insurerd_relation'],
                    "PropRisks_NomineeName_Mandatary": this.lm_request['method_type'] === 'Premium' ? "FGHFH" : this.lm_request['member_' + i + '_nominee_name'],
                    "PropRisks_NomineeRelationship_Mandatary": this.lm_request['method_type'] === 'Premium' ? "Brother" : this.lm_request['member_' + i + '_nominee_relation']
                }
            );
        }
        for (let i = 3; i <= parseInt(this.lm_request['child_count']) + 2; i++) {
            this.processed_request['___member_' + i + '_birth_date___'] = moment(this.lm_request['member_' + i + '_birth_date']).format('DD/MM/YYYY');
            this.processed_request['___member_' + i + '_gender___'] = this.processed_request['___member_' + i + '_gender___'] === "F" ? "FEMALE" : "MALE";
            // `___member_${i}_first_name___ ___member_${i}_middle_name___ ___member_${i}_last_name___`,
            object_mem.push(
                {
                    "PropRisks_NameoftheInsured_Mandatary": "___member_" + i + "_first_name___" + (this.processed_request["___member_" + i + "_middle_name___"] === "" ? " " : " ___member_" + i + "_middle_name___ ") + "___member_" + i + "_last_name___",
                    "PropRisks_DateOfBirth": '___member_' + i + '_birth_date___',
                    "PropRisks_PassportNo_Mandatary": this.lm_request['method_type'] === 'Premium' ? "H123456" + i : "___member_" + i + "_passport___",
                    "PropRisks_Gender_Mandatary": this.lm_request['method_type'] === 'Premium' ? "MALE" : "___member_" + i + "_gender___",
                    "PropRisks_Relationship_Mandatary": this.lm_request['method_type'] === 'Premium' ? "Dependent Daughter" : this.processed_request["___member_" + i + "_gender___"] === "MALE" ? "Dependent Son" : "Dependent Daughter",
                    "PropRisks_NomineeName_Mandatary": this.lm_request['method_type'] === 'Premium' ? "FGHFH" : this.lm_request['member_' + i + '_nominee_name'],
                    "PropRisks_NomineeRelationship_Mandatary": this.lm_request['method_type'] === 'Premium' ? "Brother" : this.lm_request['member_' + i + '_nominee_relation']
                }
            );
        }
        this.method_content = this.method_content.replace(member_objects, JSON.stringify(object_mem));
        this.method_content = this.method_content.replace('<!--members_start-->', '');
        this.method_content = this.method_content.replace('<!--members_end-->', '');



        console.log("method_content :::: ", this.method_content);
        console.log(this.processed_request);
        console.log('insurer_product_field_process_pre');
    } catch (e) {
        console.log("somthing went wrg in pre hdfc travel ", e.stack);
    }
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
            headers: {
                'SOURCE': 'LIB',
                'CHANNEL_ID': 'LIB0001',
                'PRODUCT_CODE': "2919",
                'CREDENTIAL': "64004C0047007A00580078004D003300510073006E0057004C004E003000440044003000630031004F0067003D003D00",
                'TRANSACTIONID': "TEST12345667"
            }
        };
        //specific_insurer_object.method_file_url
        client.get("https://accessuat.hdfcergo.com/cp/Integration/HEIIntegrationService/Integration/authenticate", args, function (data, response) {
            console.log(response.statusCode);
            let Token = data.hasOwnProperty("Authentication") && data.Authentication.Token !== null ? data.Authentication['Token'] : null;
            if (Token) {
                console.log("req body ::: ", docLog.Insurer_Request);
                let service_args = {
                    data: docLog.Insurer_Request,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        'SOURCE': 'LIB',
                        'CHANNEL_ID': 'LIB0001',
                        'PRODUCT_CODE': "2919",
                        'TOKEN': Token
                    }
                };
                console.log(specific_insurer_object.method_file_url);

                if (objInsurerProduct.lm_request['method_type'] === "Proposal") {
                    let proposal_obj = {};
                    let returnUrl = objInsurerProduct.pg_ack_url(5);


                    client.post(specific_insurer_object.method_file_url, service_args, function (proposaldata, response) {

                        let objData = JSON.stringify(proposaldata);
                        proposal_obj['proposal_res'] = proposaldata;
                        if (proposaldata.StatusCode === 200) {
                            let Chksumrequest = {
                                "TransactionNo": objInsurerProduct.prepared_request['custom_txnID'], //resObject.TransactionID ? resObject.TransactionID : "",
                                "TotalAmount": objInsurerProduct.lm_request['final_premium'], //resObject.Response_Data_OS.TotalPremium ? resObject.Response_Data_OS.TotalPremium : "",
                                "AppID": "10228",
                                "SubscriptionID": "S000000275",
                                "SuccessUrl": returnUrl,
                                "FailureUrl": returnUrl,
                                "Source": "POST"
                            };

                            var request_options = {
                                'method': 'POST',
                                'url': 'https://heapp21.hdfcergo.com/UAT/PaymentUtilitiesService/PaymentUtilities.asmx/GenerateRequestChecksum',
                                form: Chksumrequest,
                                'headers': {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            };
                            request(request_options, function (error, response) {
                                if (error) {
                                    proposal_obj['pay_request'] = Chksumrequest;
                                    proposal_obj['pay_response'] = error;
                                    objResponseFull = {
                                        'err': '',
                                        'result': proposal_obj,
                                        'raw': JSON.stringify(proposal_obj),
                                        'soapHeader': null,
                                        'objResponseJson': proposal_obj
                                    };
                                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                } else {

                                    xml2js.parseString(response.body, { explicitArray: false }, function (err, result) {
                                        if (err) {
                                            throw new Error(err);
                                        }
                                        const checksumValue = result.string;
                                        console.log('Checksum Value:', checksumValue);
                                        let dbHealthRate = result;

                                        proposal_obj['pay_request'] = Chksumrequest;
                                        proposal_obj['pay_response'] = dbHealthRate;
                                        objResponseFull = {
                                            'err': '',
                                            'result': proposal_obj,
                                            'raw': JSON.stringify(proposal_obj),
                                            'soapHeader': null,
                                            'objResponseJson': proposal_obj
                                        };
                                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                    });
                                }
                            });
                        } else {
                            let objResponseFull = {
                                'err': "",
                                'result': objData,
                                'raw': objData,
                                'soapHeader': null,
                                'objResponseJson': JSON.parse(objData)
                            };
                            objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        }


                    });


                } else {
                    client.post(specific_insurer_object.method_file_url, service_args, function (data, response) {

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
                }

            } else {
                throw "Token is null";
            }

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
        if (objDetails.StatusCode === 200 && objDetails.hasOwnProperty('Policy_Details') && objDetails.Policy_Details !== null && objDetails.Policy_Details !== '') {
            let objPlanDetails = objDetails['Policy_Details'];
            let premium_breakup = this.get_const_premium_breakup();
            // for (let p = 0; p < objPlanDetails.length; p++) {
            // if (objPlanDetails[p]['PlanName'].includes(objResponseJson['PlanName'])) {
            premium_breakup['net_premium'] = Number(objPlanDetails['NetPremium']);
            premium_breakup['service_tax'] = Number(objPlanDetails['ServiceTax']);
            premium_breakup['tax']['CGST'] = premium_breakup['ServiceTax'] / 2;
            premium_breakup['tax']['SGST'] = premium_breakup['ServiceTax'] / 2;
            premium_breakup['final_premium'] = Number(objPlanDetails['TotalPremium']);
            premium_breakup['travel_insurance_si'] = "$" + objPlanDetails['SumInsured'];
            objServiceHandler.Premium_Breakup = premium_breakup;
            //objServiceHandler.Insurer_Transaction_Identifier = objPlanDetails[p]['PlanName']['0'] + "|" + objPlanDetails[p]['RiskType']['0'];
            // break;
            // } else {
            // objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = "";
            // }
            // }
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
    let proposal_res = objResponseJson.hasOwnProperty("proposal_res") ? objResponseJson.proposal_res : null;
    let payment_res = objResponseJson.hasOwnProperty("pay_response") ? objResponseJson.pay_response : null;
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

        if (objResponseJson.hasOwnProperty("Error") && objResponseJson.Error !== "") {
            Error_Msg = objResponseJson.Error;
        } else {
            if (proposal_res !== null && proposal_res.StatusCode !== 200) {
                Error_Msg = "\u2726 " + proposal_res.Error;
            }
            if (!(payment_res !== null && payment_res.hasOwnProperty("string") && payment_res.string.hasOwnProperty("_"))) {
                Error_Msg += "\u2726 " + payment_res;
            }
        }

        if (Error_Msg === 'NO_ERR') {
            //            var merchant_key = ((config.environment.name === 'Production') ? '' : 'LANDMARK');
            //            var secret_token = ((config.environment.name === 'Production') ? '' : 'rH33FlSFavPvYHc+Bu5Fqg==');
            //            var transaction_no = objResponseJson.TransactionID; //"TEST1232311";// objResponseJson.Data.TransactionNo;
            //            var feature_id = 'S001';
            //
            //            var pg_data = {
            //                'trnsno': transaction_no,
            //                'FeatureID': feature_id
            //            };
            //            var hash_data = {// sha512(merchant_key|transaction_no|secret_token|feature_id);
            //                'merchant_key': merchant_key, 'trnsno': transaction_no, 'secret_token': secret_token, 'feature_id': feature_id
            //            };
            //            function jsonToQueryString(json) {
            //                return Object.keys(json).map(function (key) {
            //                    return json[key];
            //                }).join('|');
            //            }
            // <input type="hidden" name="Trnsno" value="107105012427373">
            // <input type="hidden" name="Amt" value="12140">
            // <input type="hidden" name="Appid" value="10228">
            // <input type="hidden" name="Subid" value="S000000275">
            // <input type="hidden" name="Surl" value="http://qa-horizon.policyboss.com/transaction-status/381207/1127373/69808">
            // <input type="hidden" name="Furl" value="http://qa-horizon.policyboss.com/transaction-status/381207/1127373/69808">
            // <input type="hidden" name="Src" value="POST">
            // <input type="hidden" name="Chksum" value="527214533">

            var pg_data = {
                "Trnsno": this.prepared_request['custom_txnID'], //resObject.TransactionID ? resObject.TransactionID : "",//resObject.trnsno, //
                "Amt": this.prepared_request['final_premium'], //resObject.Response_Data_OS.TotalPremium ? resObject.Response_Data_OS.TotalPremium : "", //21618.0,
                "Appid": "10228",
                "Subid": "S000000275",
                "Surl": this.const_payment.pg_ack_url, //"http://qa-horizon.policyboss.com/transaction-status/310389/1087948/51242",
                "Furl": this.const_payment.pg_ack_url, //"http://qa-horizon.policyboss.com/transaction-status/310389/1087948/51242",
                "Src": "POST",
                "Chksum": (payment_res.string._).trim()
            };
            console.log("PAY::: ", pg_data);
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = payment_res.string._;//pg_data['Trnsno'];

            var Proposal = {
                'insurer_proposal_identifier': payment_res.string._.toString()
            };
            objServiceHandler.proposal = Proposal;
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
        if (output.hasOwnProperty('hdnmsg')) {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_amount = this.proposal_processed_request['___final_premium___'];
            this.const_policy.transaction_id = output.hdnmsg;
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
            Error_Msg = objResponseJson.Data.Remark;
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

    if (lm_request['travelling_to_area'] === "Africa") { // for developement purpose removed this condition pls add once dev completed ::: || (lm_request['trip_type'] === 'MULTI' && (lm_request['travelling_to_area'] === "WWExUSCanada" || lm_request['member_count'] > 1)) || lm_request['child_count'] > 2 || lm_request['maximum_duration'] > 45
        return false;
    } else {
        return true;
    }
    console.log('HDFCErgoTravel is_valid_plan', 'End');
};

function generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRS0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset[randomIndex];
    }
    return result;
}

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