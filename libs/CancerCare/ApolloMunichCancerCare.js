/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Health = require(appRoot + '/libs/CancerCare');
var config = require('config');
var fs = require('fs');
var moment = require('moment');

function ApolloMunichCancerCare() {

}
util.inherits(ApolloMunichCancerCare, Health);
ApolloMunichCancerCare.prototype.insurer_date_format = 'YYYY-MM-DD';
ApolloMunichCancerCare.prototype.const_insurer_suminsured = [500000, 1000000, 1500000, 2000000, 2500000, 5000000, 10000000, 25000000, 500000000];


ApolloMunichCancerCare.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
ApolloMunichCancerCare.prototype.insurer_product_field_process_pre = function () {
    if (this.lm_request['method_type'] === 'Premium') {
        var args = {
            "ProductPlan_Id": this.processed_request['___Plan_Id___'],
            "NumberOfAdults": 1,
            "NumberOfChildren": 0,
            "SumInsured": this.prepared_request["cancer_care_si"] - 0,
            "Min_AgeOfEldestMember_Months": {$lte: this.lm_request["elder_member_age_in_months"]},
            "Max_AgeOfEldestMember_Months": {$gt: this.lm_request["elder_member_age_in_months"]},
            "Policy_Term_Year": this.lm_request["policy_tenure"],
            "Gender": this.lm_request["gender"] === 'M' ? 'MALE' : 'FEMALE',
            "category": this.lm_request["is_smoker"] === 'No' ? 'NON SMOKER' : 'SMOKER'
        };
        console.log("-----Premium----", args);
        this.method_content = JSON.stringify(args);
    }
    if (this.lm_request['method_type'] === 'Customer') {
       
        this.prepared_request['height'] = this.lm_request['height'];
        this.processed_request['___height___'] = this.prepared_request['height'];
        this.prepared_request['weight'] = this.lm_request['weight'];
        this.processed_request['___weight___'] = this.prepared_request['weight'];
        this.prepared_request["gender"] = this.lm_request["gender"] === "M" ? 1 : 2;
        this.processed_request["___gender___"] = this.prepared_request["gender"];
   
        var member_1_birth_date = moment(this.lm_request['member_1_birth_date'], "MM-DD-YYYY").format('YYYY-MM-DD');
        this.prepared_request['member_1_birth_date'] = member_1_birth_date;
        this.processed_request['___member_1_birth_date___'] = this.prepared_request['member_1_birth_date'];
        this.prepared_request["member_1_age"] = this.lm_request['member_1_age'];
        this.processed_request["___member_1_age___"] = this.prepared_request["member_1_age"];
        var state_code = (this.lm_request['communication_state_code'].length === 1 ? "00" : "0") + this.lm_request['communication_state_code'];
//      var district_code = (this.lm_request['communication_district_code'].length === 1 ? "00" : "0") + this.lm_request['communication_district_code'];
//      this.prepared_request['communication_district_code'] = district_code;
//      this.processed_request['___communication_district_code___'] = this.prepared_request['communication_district_code'];
        this.prepared_request['communication_state_code'] = state_code;
        this.processed_request['___communication_state_code___'] = this.prepared_request['communication_state_code'];

        this.prepared_request['member_1_nominee_name'] = this.lm_request['member_1_nominee_name'];
        this.processed_request['___member_1_nominee_name___'] = this.prepared_request['member_1_nominee_name'];
        this.processed_request['___member_1_nominee_rel___'] = this.lm_request['member_1_nominee_rel'];

        this.prepared_request['annual_income'] = this.lm_request['annual_income'];
        this.processed_request['___annual_income___'] = this.prepared_request['annual_income'];
        this.processed_request['___smoker_flag___'] = this.lm_request['is_smoker'] === 'Yes' ? 'true' : 'false';
        this.processed_request['___service_tax___'] = this.lm_request['service_tax'];

        this.prepared_request['relation'] = this.lm_request['relation'];
        var status = "";
        var gender = this.lm_request['member_1_gender'];
        status = this.prepared_request['relation'];
        this.processed_request['___proposer_relationship_code___'] = this.member_relation_code(status);
        status = this.prepared_request['nominee_relation'];
        this.processed_request['___nominee_code___'] = this.member_relation_code(status);
        this.processed_request['___member_relationship_code___'] = this.member_relation_code(status, gender);

    }
    if (this.lm_request['method_type'] === 'Proposal') {
        //var returnUrl = 'http://qa-horizon.policyboss.com/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'];
        var returnUrl = 'http://localhost:7000' + '/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn']+ '/' + this.lm_request['proposal_id'];
        this.prepared_request['return_url'] = returnUrl;
        this.processed_request['___return_url___'] = this.prepared_request['return_url'];
    }
    console.log('insurer_product_field_process_pre');
};
ApolloMunichCancerCare.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;
    var error_msg = 'NO_ERROR';
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
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
ApolloMunichCancerCare.prototype.insurer_product_field_process_post = function () {

};
ApolloMunichCancerCare.prototype.insurer_product_api_post = function () {

};
ApolloMunichCancerCare.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        if (specific_insurer_object.method.Method_Calling_Type === 'Database') {
            var args = JSON.parse(this.method_content);
            args['ProductPlan_Id'] = docLog['Plan_Id'];
            var Cancer_Care_Health_Rate = require(appRoot + '/models/cancer_care_health_rate');
            Cancer_Care_Health_Rate.findOne(args, function (err, dbHealthRate) {
                console.log(dbHealthRate);
                if (dbHealthRate !== null) {
                    var objResponseFull = {
                        'err': err,
                        'result': dbHealthRate,
                        'raw': JSON.stringify(dbHealthRate),
                        'soapHeader': null,
                        'objResponseJson': dbHealthRate
                    };
                    objResponseFull['objResponseJson']['PlanId'] = docLog['Plan_Id'];
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                }
            });
        } else if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
            var objInsurerProduct = this;
            var xml2js = require('xml2js');
            var body = docLog.Insurer_Request;
            var http = require('http');
            var postRequest = {
                host: 'b2buat.apollomunichinsurance.com',
                path: specific_insurer_object.method.Service_URL, //port: 443,
                method: "POST",
                "rejectUnauthorized": false,
                headers: {
                    'Content-Type': 'text/xml',
                    'Content-Length': Buffer.byteLength(body),
                    "SOAPAction": 'http://www.apollomunichinsurance.com/B2BService' + specific_insurer_object.method.Method_Action
                }
            };
            console.error('ApolloMunich ', postRequest);
            var buffer = "";
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
            var req = http.request(postRequest, function (res) {

                console.log(res.statusCode);
                var buffer = "";
                res.on("data", function (data) {
                    buffer = buffer + data;
                });
                res.on("end", function (data) {
                    // var parse = JSON.parse(buffer);
                    console.log(buffer);

                    var objReplace = {
                        's:': '',
                        'a:': ''
                    };
                    var fliter_response = buffer.replaceJson(objReplace);
                    xml2js.parseString(fliter_response, {ignoreAttrs: true}, function (err, objXml2Json) {
                        console.log(objXml2Json);
                        if (err) {
                            console.error('Exception', this.constructor.name, 'service_call', err);
                        } else {
                            var objResponseFull = {
                                'err': null,
                                'result': objXml2Json,
                                'raw': objXml2Json,
                                'soapHeader': null,
                                'objResponseJson': objXml2Json
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        }
                    });
                });
            });
            req.on('error', function (e) {
                console.error('problem with request: ' + e.message);
            });
            req.write(body);
            req.end();
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
ApolloMunichCancerCare.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        if (objResponseJson !== null && objResponseJson.hasOwnProperty('_doc')) {
            var objPremiumService = objResponseJson['_doc'];
            if (objPremiumService.hasOwnProperty('Premium')) {
                var premium_breakup = this.get_const_premium_breakup();
//                premium_breakup['service_tax'] = (objPremiumService['Premium'] - 0) * 0.18;
//                premium_breakup['final_premium'] = objPremiumService['Premium'];
//                premium_breakup['net_premium'] = premium_breakup['final_premium'] - premium_breakup['service_tax'];
//                premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
//                premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['net_premium'] = Math.round(objPremiumService['Premium']);
                premium_breakup['service_tax'] = Math.round(objPremiumService['Premium'] * 0.18);
                premium_breakup['final_premium'] = Math.round(premium_breakup['net_premium'] + premium_breakup['service_tax']);
                objServiceHandler.Premium_Breakup = premium_breakup;


            } else {
                Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', ex);
    }
    return objServiceHandler;
};
ApolloMunichCancerCare.prototype.customer_response_handler = function (objResponseJson) {
    console.log('ApolloMunichCancerCare', this.constructor.name, 'customer_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    try {
        if (objResponseJson["Envelope"]["Body"]["0"].hasOwnProperty('ProposalCaptureResponse')) {
        } else if (objResponseJson["Envelope"]["Body"]["0"]["Fault"]["0"].hasOwnProperty('detail')) {
            var show_err_data = objResponseJson["Envelope"]["Body"]["0"]["Fault"]["0"]["detail"]["0"]["ArrayOfValidationDetail"]["0"]["ValidationDetail"]["0"]["Message"];

            if (show_err_data["ValidationDetail"].hasOwnProperty('0')) {
                Error_Msg = show_err_data["ValidationDetail"]['0']["Message"]['0'];
            }
            if (show_err_data["ValidationDetail"].hasOwnProperty('1')) {
                if (Error_Msg !== '') {
                    Error_Msg += " / " + show_err_data["ValidationDetail"]['1']["Message"]['0'];
                } else {
                    Error_Msg = show_err_data["ValidationDetail"]['1']["Message"]['0'];
                }
            }
            if (show_err_data["ValidationDetail"].hasOwnProperty('2')) {
                if (Error_Msg !== '') {
                    Error_Msg += " / " + show_err_data["ValidationDetail"]['2']["Message"]['0'];
                } else {
                    Error_Msg = show_err_data["ValidationDetail"]['2']["Message"]['0'];
                }
            }
            if (show_err_data["ValidationDetail"].hasOwnProperty('3')) {
                if (Error_Msg !== '') {
                    Error_Msg += " / " + show_err_data["ValidationDetail"]['3']["Message"]['0'];
                } else {
                    Error_Msg = show_err_data["ValidationDetail"]['3']["Message"]['0'];
                }
            }
        } else if (objResponseJson["Envelope"]["Body"]["0"].hasOwnProperty("Fault")) {
            Error_Msg = objResponseJson["Envelope"]["Body"]["0"]["Fault"]["0"]["faultstring"]["0"];
        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }
        Error_Msg = (this.prepared_request.hasOwnProperty('isNSTP') && this.prepared_request['isNSTP'] === 'yes') ? "Insured member(s) are not eligible" : Error_Msg;

        if (Error_Msg === 'NO_ERR') {
            var Customer = {
                'insurer_customer_identifier': objResponseJson["Envelope"]["Body"]["0"]["ProposalCaptureResponse"]["0"]["ProposalCaptureResult"]["0"]
            };
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson["Envelope"]["Body"]["0"]["ProposalCaptureResponse"]["0"]["ProposalCaptureResult"]["0"];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', ex);
    }
    return objServiceHandler;
};
ApolloMunichCancerCare.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('ApolloMunichCancerCare', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    try {
        if (objResponseJson["Envelope"]["Body"]["0"].hasOwnProperty('PaymentDetailsResponse')) {

        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }
        if (Error_Msg === 'NO_ERR') {
            var pg_data = {
                'PaymentId': objResponseJson["Envelope"]["Body"]["0"]["PaymentDetailsResponse"]["0"]["PaymentDetailsResult"]["0"]["PaymentId"]["0"],
                'ProposalId': objResponseJson["Envelope"]["Body"]["0"]["PaymentDetailsResponse"]["0"]["PaymentDetailsResult"]["0"]["ProposalId"]["0"],
                'Responseurl': this.const_payment.pg_ack_url//this.prepared_request['return_url']
            };
            objServiceHandler.Payment.pg_data = pg_data;
            this.const_payment_response.pg_data = pg_data;
            var pgUrl = objResponseJson["Envelope"]["Body"]["0"]["PaymentDetailsResponse"]["0"]["PaymentDetailsResult"]["0"]["PaymentUrl"]["0"];
            if (pgUrl.includes("http//")) {
                pgUrl = pgUrl.replace(/http/g, 'http:');
            } else if (pgUrl.includes("https//")) {
                pgUrl = pgUrl.replace(/https/g, 'https:');
            }
            objServiceHandler.Insurer_Transaction_Identifier = pg_data.ProposalId;
            objServiceHandler.Payment.pg_url = pgUrl;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
ApolloMunichCancerCare.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response['pg_post'];
        if (output.hasOwnProperty('ResponseCode') && output['ResponseCode'] === '0') {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
            this.const_policy.transaction_id = output['TransactionId'];
            this.const_policy.pg_status = "SUCCESS";
            this.const_policy.policy_number = output['ProposalId'];
            this.const_policy.policy_id = output['ApplicationNo'];
            this.const_policy.pg_reference_number_1 = output['PaymentId'];
            this.const_policy.pg_reference_number_2 = output['MerchantRefNo'];
        } else {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
ApolloMunichCancerCare.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    try {
        if (this.const_policy.pg_status === 'FAIL') {

        } else {
            if (objResponseJson["Envelope"]["Body"][0]["VerifyTransactionResponse"][0].hasOwnProperty('VerifyTransactionResult'))
            {
                var paymentStatus = objResponseJson["Envelope"]["Body"][0]["VerifyTransactionResponse"][0]["VerifyTransactionResult"][0];
                if (paymentStatus === '0') {//transaction success
                    this.const_policy.pg_status = 'SUCCESS';
                    this.const_policy.transaction_status = 'SUCCESS';
                    var pdf_file_name = this.constructor.name + '_CANCERCARE_' + this.prepared_request.policy_number + '.pdf';
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;
                } else
                {
                    this.const_policy.transaction_status = 'FAIL';
                    this.const_policy.pg_status = 'FAIL';
                }
            } else
            {
                this.const_policy.transaction_status = 'FAIL';
                this.const_policy.pg_status = 'FAIL';
                Error_Msg = JSON.stringify(objResponseJson);
            }
        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
    return objServiceHandler;
};
ApolloMunichCancerCare.prototype.member_relation_code = function (status, gender) {
    console.log(this.constructor.name, 'member_relation_code', ' Start Apollo');
    console.log("Gender in Apollo: " + gender);
    if (status === '17' || status === '20' && gender === "") {
        return status === 'Daughter' ? '17' : '20';
    } else if (status === '17' || status === '20' && gender !== "") {
        return(gender === 'M' ? '4' : '5');
    }
    if (status === 'Father' || status === 'Mother' && gender === "") {
        return status === 'Father' ? '4' : '5';
    } else if (status === '4' || status === '5' && gender !== "") {
        return(gender === 'M' ? '4' : '5');
    }
    if (status === '15' || status === '14' && gender === "") {
        return status === 'Husband' ? '15' : '14';
    } else if (status === '15' || status === '14' && gender !== "") {
        return(gender === 'M' ? '15' : '14');
    }
    if (status === '1' || status === '') {
        return 1;
    }
    console.log(this.constructor.name, 'member_relation_code', 'End Apollo');
};
ApolloMunichCancerCare.prototype.marital_status_code = function () {
    var status = this.lm_request['member_1_marital_status'];
    if (status === 'Married') {
        return 1;
    } else if (status === 'Widowed') {
        return 3;
    } else if (status === 'Divorced') {
        return 4;
    } else if (status === 'Separated') {
        return 5;
    } else {
        return 2;
    }
};

ApolloMunichCancerCare.prototype.marital_status_code = function () {
    var status = this.lm_request['member_1_marital_status'];
    if (status === 'Married') {
        return 1;
    } else if (status === 'Widowed') {
        return 3;
    } else if (status === 'Divorced') {
        return 4;
    } else if (status === 'Separated') {
        return 5;
    } else {
        return 2;
    }
};
//ApolloMunichCancerCare.prototype.get_format_date = function () {
//    console.log(this.constructor.name, 'member_1_birth_date');
//    var date = moment(lm_request['member_1_birth_date'], "MM-DD-YYYY").format('YYYY-MM-DD');
//    
////    var date = this.lm_request["member_1_birth_date"];
////    date = date.split("-").reverse().join("-");
////  // var date2 = date.format('YYYY-MM-DD');
//    return date;
//};
//ApolloMunichCancerCare.prototype.GetAge= function (member_1_birth_date) {
//    var member_1_age;
//    var timediff = Math.abs(Date.now() - Number(new Date(member_1_birth_date)));
//    member_1_age = Math.floor((timediff / (1000 * 3600 * 24)) / 365);
//    return member_1_age;
//  };

module.exports = ApolloMunichCancerCare;