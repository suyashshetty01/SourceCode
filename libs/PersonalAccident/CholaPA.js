/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var PersonalAccident = require(appRoot + '/libs/PersonalAccident');
var fs = require('fs');
var config = require('config');
var sleep = require('system-sleep');
var moment = require('moment');
var xl = require('excel4node');
var MongoClient = require('mongodb').MongoClient;
function CholaPA() {

}
util.inherits(CholaPA, PersonalAccident);
CholaPA.prototype.lm_request_single = {};
CholaPA.prototype.insurer_integration = {};
CholaPA.prototype.insurer_addon_list = [];
CholaPA.prototype.insurer = {};
CholaPA.prototype.insurer_date_format = 'yyyy-MM-dd';
CholaPA.prototype.const_insurer_suminsured = [500000, 750000, 1000000, 1500000, 2000000, 2500000, 5000000, 7500000, 10000000, 15000000, 20000000];
CholaPA.prototype.insurer_product_api_pre = function () {
    console.log('insurer_product_api_pre');
};
CholaPA.prototype.insurer_product_field_process_pre = function () {

    if (this.lm_request['method_type'] === 'Premium') {
        var args = {
            "Insurer_Id": 3,
            "NumberOfAdults": this.lm_request['adult_count'],
            "NumberOfChildren": this.lm_request['child_count']
        };
        if (this.lm_request['pa_insurance_si'] !== 0) {
            args["SumInsured"] = this.lm_request['pa_insurance_si'] - 0;
        } else { 
            //order of conditions important
            if ((this.lm_request['member_1_monthly_income'] - 0) > (this.lm_request['car_value'] - 0)) {
                args["SumInsured"] = {"$lte": 5000000};
            }
            if (this.lm_request['member_1_occupation'] === "Housewife") {
                args["SumInsured"] = {"$lte": 2500000};
            }

            args["$or"] = [
                {"Min_IDV": {"$lte": this.lm_request['car_value'] - 0}},
                {"Min_Monthly_Income": {"$lte": this.lm_request['member_1_monthly_income'] - 0}}
            ];
        }

        this.method_content = JSON.stringify(args);
    } else if (this.lm_request['method_type'] === 'Proposal') {
        //prepared/processed for feed file
        if (this.prepared_request['dbmaster_pb_plan_id'] === 1111) {
            var plan_type = this.lm_request['member_count'] > 1 ? "Family Option - Self + Spouse + atmost 2 children" : "Self Option";
        } else {
            var plan_type = this.lm_request['member_count'] > 1 ? "Family Option - Self + Spouse + atmost 2 children with Hospital Daily Cash" : "Self Option with Hospital Daily Cash";
        }
        this.processed_request['___plan_type___'] = plan_type;
        this.prepared_request['plan_type'] = plan_type;

        var member = 1;
        var benefits = "";
        if (this.insurer_master.service_logs.pb_db_master.Premium_Breakup.hasOwnProperty('benefits') && Object.keys(this.insurer_master.service_logs.pb_db_master.Premium_Breakup.benefits).length > 0) {
            var benefits = this.insurer_master.service_logs.pb_db_master.Premium_Breakup.benefits;
            var weekly_benefits = benefits['Unique_Benefit_1'].split('-')[1];
            var broken_bones = benefits['Unique_Benefit_2'].split('-')[1];
            var hospital_daily_cash = benefits['Unique_Benefit_3'].split('-')[1];
            if (this.lm_request['child_count'] === 0) {
                var ambulance_charges = benefits['Unique_Benefit_4'].split('-')[1];
            } else {
                var child_tution_fees = benefits['Unique_Benefit_4'].split('-')[1];
            }
        }
        if (benefits !== "") {
            var benifit_accidental_death = this.lm_request['member_count'] > 1 ? benefits['Accidental_Death'].split(",") : benefits['Accidental_Death'];
            var benifit_permanent_total_disability = this.lm_request['member_count'] > 1 ? benefits['Permanent_Total_Disability'].split(",") : benefits['Permanent_Total_Disability'];
            var benifit_permanent_partial_disability = this.lm_request['member_count'] > 1 ? benefits['Permanent_Partial_Disability'].split(",") : benefits['Permanent_Partial_Disability'];
        }
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            this.prepared_request['member_' + member + '_gender_2'] = this.lm_request['member_' + member + '_gender'] === "M" ? "Male" : "Female";
            this.processed_request['___member_' + member + '_gender_2___'] = this.prepared_request['member_' + member + '_gender_2'];
            var rel = this.get_member_relation(member);
            this.prepared_request['member_' + member + '_relation'] = rel;
            this.processed_request['___member_' + member + '_relation___'] = rel;
            if (benefits !== "") {
                this.prepared_request['member_' + member + '_accidental_death'] = (this.lm_request['member_count'] === 1 ? benifit_accidental_death : (rel === "Self" ? benifit_accidental_death[0] : benifit_accidental_death[1]));
                this.processed_request['___member_' + member + '_accidental_death___'] = this.prepared_request['member_' + member + '_accidental_death'];
                this.prepared_request['member_' + member + '_permanent_total_disability'] = (this.lm_request['member_count'] === 1 ? benifit_permanent_total_disability : (rel === "Self" ? benifit_permanent_total_disability[0] : benifit_permanent_total_disability[1]));
                this.processed_request['___member_' + member + '_permanent_total_disability___'] = this.prepared_request['member_' + member + '_permanent_total_disability'];
                this.prepared_request['member_' + member + '_permanent_partial_disability'] = (this.lm_request['member_count'] === 1 ? benifit_permanent_partial_disability : (rel === "Self" ? benifit_permanent_partial_disability[0] : benifit_permanent_partial_disability[1]));
                this.processed_request['___member_' + member + '_permanent_partial_disability___'] = this.prepared_request['member_' + member + '_permanent_partial_disability'];
                this.prepared_request['member_' + member + '_weekly_benefits'] = weekly_benefits;
                this.processed_request['___member_' + member + '_weekly_benefits___'] = weekly_benefits;
                this.prepared_request['member_' + member + '_broken_bones'] = broken_bones;
                this.processed_request['___member_' + member + '_broken_bones___'] = broken_bones;
                this.prepared_request['member_' + member + '_broken_bones'] = broken_bones;
                this.processed_request['___member_' + member + '_broken_bones___'] = broken_bones;
                this.prepared_request['member_' + member + '_hospital_daily_cash'] = hospital_daily_cash;
                this.processed_request['___member_' + member + '_hospital_daily_cash___'] = hospital_daily_cash;
                this.prepared_request['member_' + member + '_ambulance_charges'] = "NA";
                this.processed_request['___member_' + member + '_ambulance_charges___'] = "NA";
//                if (this.lm_request['child_count'] === 0) {
//                    this.prepared_request['member_' + member + '_ambulance_charges'] = ambulance_charges;
//                    this.processed_request['___member_' + member + '_ambulance_charges___'] = ambulance_charges;
//                }

                this.prepared_request['member_' + member + '_transport_mortal_remains'] = "NA";
                this.processed_request['___member_' + member + '_transport_mortal_remains___'] = "NA";
                this.prepared_request['member_' + member + '_transport_benefits'] = "NA";
                this.processed_request['___member_' + member + '_transport_benefits___'] = "NA";
                this.prepared_request['member_' + member + '_modify_vehicle'] = "NA";
                this.processed_request['___member_' + member + '_modify_vehicle___'] = "NA";

            }

            //Nstp Reject Rules
//            if (["5", "7", "12", "13", "14", "15", "16", "17", "19"].includes(this.lm_request['member_' + member + "_occupation"])) {
//                this.prepared_request['reject'] = true;
//                this.processed_request['___reject___'] = true;
//            } else if (this.lm_request['member_' + member + '_relation_with_proposer'] === "SELF" && this.lm_request['member_' + member + '_occupation_text'] === "Housewives" && this.lm_request['pa_insurance_si'] - 0 > 2500000) {
//                this.prepared_request['reject'] = true;
//                this.processed_request['___reject___'] = true;
//            }else if(this.lm_request['member_' + member + '_question_1_details'] === true){
//                this.prepared_request['reject'] = true;
//                this.processed_request['___reject___'] = true;	
//            }
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            this.prepared_request['member_' + member + '_gender_2'] = this.lm_request['member_' + member + '_gender'] === "M" ? "Male" : "Female";
            this.processed_request['___member_' + member + '_gender_2___'] = this.prepared_request['member_' + member + '_gender_2'];
            var rel = this.get_member_relation(member);
            this.prepared_request['member_' + member + '_relation'] = rel;
            this.processed_request['___member_' + member + '_relation___'] = rel;
            if (benefits !== "") {
                this.prepared_request['member_' + member + '_accidental_death'] = this.lm_request['adult_count'] === 1 ? benifit_accidental_death[1] : benifit_accidental_death[2];
                this.processed_request['___member_' + member + '_accidental_death___'] = this.prepared_request['member_' + member + '_accidental_death'];
                this.prepared_request['member_' + member + '_permanent_total_disability'] = this.lm_request['adult_count'] === 1 ? benifit_permanent_total_disability[1] : benifit_permanent_total_disability[2];
                this.processed_request['___member_' + member + '_permanent_total_disability___'] = this.prepared_request['member_' + member + '_permanent_total_disability'];
                this.prepared_request['member_' + member + '_permanent_partial_disability'] = this.lm_request['adult_count'] === 1 ? benifit_permanent_partial_disability[1] : benifit_permanent_partial_disability[2];
                this.processed_request['___member_' + member + '_permanent_partial_disability___'] = this.prepared_request['member_' + member + '_permanent_partial_disability'];
                this.prepared_request['member_' + member + '_weekly_benefits'] = weekly_benefits;
                this.processed_request['___member_' + member + '_weekly_benefits___'] = weekly_benefits;
                this.prepared_request['member_' + member + '_broken_bones'] = broken_bones;
                this.processed_request['___member_' + member + '_broken_bones___'] = broken_bones;
                this.prepared_request['member_' + member + '_broken_bones'] = broken_bones;
                this.processed_request['___member_' + member + '_broken_bones___'] = broken_bones;
                this.prepared_request['member_' + member + '_hospital_daily_cash'] = hospital_daily_cash;
                this.processed_request['___member_' + member + '_hospital_daily_cash___'] = hospital_daily_cash;
                this.prepared_request['member_' + member + '_ambulance_charges'] = "NA";
                this.processed_request['___member_' + member + '_ambulance_charges___'] = "NA";
                this.prepared_request['member_' + member + '_transport_mortal_remains'] = "NA";
                this.processed_request['___member_' + member + '_transport_mortal_remains___'] = "NA";
                this.prepared_request['member_' + member + '_transport_benefits'] = "NA";
                this.processed_request['___member_' + member + '_transport_benefits___'] = "NA";
                this.prepared_request['member_' + member + '_modify_vehicle'] = "NA";
                this.processed_request['___member_' + member + '_modify_vehicle___'] = "NA";
            }

            //Nstp Reject Rules
//            if (["5", "7", "12", "13", "14", "15", "16", "17", "19"].includes(this.lm_request['member_' + member + "_occupation"])) {
//                this.prepared_request['reject'] = true;
//                this.processed_request['___reject___'] = true;
//            } else if (this.lm_request['member_' + member + '_relation_with_proposer'] === "SELF" && this.lm_request['member_' + member + '_occupation_text'] === "Housewives" && this.lm_request['pa_insurance_si'] - 0 > 2500000) {
//                this.prepared_request['reject'] = true;
//                this.processed_request['___reject___'] = true;
//            }else if(this.lm_request['member_' + member + '_question_1_details'] === true){
//                this.prepared_request['reject'] = true;
//                this.processed_request['___reject___'] = true;
//            }
        }

        //setting NA for non members benefits
        let setbenefitsNa = (memb) => {
            this.prepared_request['member_' + memb + '_accidental_death'] = "NA";
            this.processed_request['___member_' + memb + '_accidental_death___'] = "NA";
            this.prepared_request['member_' + memb + '_permanent_total_disability'] = "NA";
            this.processed_request['___member_' + memb + '_permanent_total_disability___'] = "NA";
            this.prepared_request['member_' + memb + '_permanent_partial_disability'] = "NA";
            this.processed_request['___member_' + memb + '_permanent_partial_disability___'] = "NA";
            this.prepared_request['member_' + memb + '_weekly_benefits'] = "NA";
            this.processed_request['___member_' + memb + '_weekly_benefits___'] = "NA";
            this.prepared_request['member_' + memb + '_broken_bones'] = "NA";
            this.processed_request['___member_' + memb + '_broken_bones___'] = "NA";
            this.prepared_request['member_' + memb + '_broken_bones'] = "NA";
            this.processed_request['___member_' + memb + '_broken_bones___'] = "NA";
            this.prepared_request['member_' + memb + '_hospital_daily_cash'] = "NA";
            this.processed_request['___member_' + memb + '_hospital_daily_cash___'] = "NA";
            this.prepared_request['member_' + memb + '_ambulance_charges'] = "NA";
            this.processed_request['___member_' + memb + '_ambulance_charges___'] = "NA";
            this.prepared_request['member_' + memb + '_transport_mortal_remains'] = "NA";
            this.processed_request['___member_' + memb + '_transport_mortal_remains___'] = "NA";
            this.prepared_request['member_' + memb + '_transport_benefits'] = "NA";
            this.processed_request['___member_' + memb + '_transport_benefits___'] = "NA";
            this.prepared_request['member_' + memb + '_modify_vehicle'] = "NA";
            this.processed_request['___member_' + memb + '_modify_vehicle___'] = "NA";
        };
        let mem = 2;
        if (this.lm_request['adult_count'] < 2) {
            mem = 2;
            setbenefitsNa(mem);
        }
        mem = this.lm_request['child_count'] + 3;
        for (mem; mem <= 4; mem++) {
            setbenefitsNa(mem);
        }
        /* start for Ambulance Hiring Charges */
        var temp_member_count = this.lm_request['adult_count'] + this.lm_request['child_count'];
        for (temp_member = 1; temp_member <= temp_member_count; temp_member++) {
            this.prepared_request['member_' + temp_member + '_ambulance_charges'] = "1,000";
            this.processed_request['___member_' + temp_member + '_ambulance_charges___'] = "1,000";
        }
        /* end for Ambulance Hiring Charges */
    }
    console.log(this.processed_request);
};
CholaPA.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
CholaPA.prototype.insurer_product_field_process_post = function () {

};
CholaPA.prototype.insurer_product_api_post = function () {

};
CholaPA.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var request = docLog.Insurer_Request;
        var service_method_url = '';
        console.log(request);
        var Client = require('node-rest-client').Client;
        var client = new Client();
        if (specific_insurer_object.method.Method_Type === 'Premium') {
            var args = JSON.parse(docLog["Insurer_Request"]);
            args['ProductPlan_Id'] = docLog['Plan_Id'];
            console.log(args);
            let PA_Rate = require(appRoot + '/models/personal_accident_rate');
            PA_Rate.find(args).sort({"SumInsured": -1}).limit(1).exec(function (err, dbPARate) {
                if (err)
                    throw err;
                if (dbPARate !== null) {
                    var objResponseFull = {
                        'err': err,
                        'result': dbPARate,
                        'raw': JSON.stringify(dbPARate),
                        'soapHeader': null,
                        'objResponseJson': dbPARate
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                }
            });
        } else {
            if (config.environment.hasOwnProperty('chola_pg_type') && config.environment.chola_pg_type === "rzrpay" && specific_insurer_object.method.Method_Type === 'Proposal') {
                var full_name = objInsurerProduct.lm_request['middle_name'] === "" ? (objInsurerProduct.lm_request['first_name'] + " " + objInsurerProduct.lm_request['last_name']) : (objInsurerProduct.lm_request['first_name'] + " " + objInsurerProduct.lm_request['middle_name'] + " " + objInsurerProduct.lm_request['last_name']);
                let body = {
                    "amount": objInsurerProduct['lm_request']['final_premium'] * 100,
				   //"amount": ([7582].indexOf(parseInt(objInsurerProduct['lm_request']['ss_id'])) > -1) ? 100 : objInsurerProduct['lm_request']['final_premium'] * 100,
                    "payment_capture": 1,
                    "currency": "INR",
                    "notes": {
                        "customer_name": full_name,
                        "payment_mode": "individual"
                    },
                    "transfers": [
                        {
                            "account": config.razor_pay.rzp_chola.account_id,
                            "amount": objInsurerProduct['lm_request']['final_premium'] * 100,
							//"amount": ([7582].indexOf(parseInt(objInsurerProduct['lm_request']['ss_id'])) > -1) ? 100 : objInsurerProduct['lm_request']['final_premium'] * 100,
                            "currency": "INR"
                        }
                    ]
                };
                var username = config.razor_pay.rzp_chola.username;
                var password = config.razor_pay.rzp_chola.password;
                var args1 = {
                    data: body,
                    headers: {"Content-Type": "application/json",
                        "Accept": "application/json",
                        'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                    }
                };
                console.log(JSON.stringify(args1));
                client.post(specific_insurer_object.method_file_url, args1, function (data, response) {
                    // parsed response body as js object 
                    console.log('Order Data', data);
                    var objResponseFull = {
                        'err': null,
                        'result': null,
                        'raw': JSON.stringify(data),
                        'soapHeader': null,
                        'objResponseJson': data
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            } else if (false && specific_insurer_object.method.Method_Type === 'Verification') {
                service_method_url = specific_insurer_object.method_file_url + objInsurerProduct.const_payment_response.pg_get.PayId;
                var username = config.razor_pay.rzp_chola.username;
                var secret_key = config.razor_pay.rzp_chola.password;
                args = {
                    headers: {
                        "Accept": "application/json",
                        'Authorization': 'Basic ' + new Buffer(username + ':' + secret_key).toString('base64')
                    }
                };
                client.get(service_method_url, args, function (data, response) {
                    // parsed response body as js object 
                    console.log(data);
                    // raw response 
                    console.log(response);
                    var objResponseFull = {
                        'err': null,
                        'result': data,
                        'raw': '',
                        'soapHeader': null,
                        'objResponseJson': data
                    };
                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            } else if (specific_insurer_object.method.Method_Type === 'Verification') {
                let obj_cred = {
                    'grant_type': 'password',
                    'username': "ptrn_lanmarkP",
                    'password': "pt1L@Nm#krn"
                };
                var argsT = {
                    data: obj_cred,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json"
                    }
                };
                if (config.environment.name === 'Production') {
                    argsT.headers.Authorization = 'Basic ' + new Buffer("h2r071FMRr7lAxiYxpZVeo2scUka" + ':' + "_GV2Yvmto847HlDVLIzf1myrSjwa").toString('base64');
                    token_generation_url = 'https://services.cholainsurance.com/endpoint/token';
                } else {
                    argsT.headers.Authorization = 'Basic ' + new Buffer("1380AJrPJsRDgDd2N8EX35yiEZ4a" + ':' + "JQPCDuM5PnWfm9c3RWerrfuIjCUa").toString('base64');
                    token_generation_url = 'https://developer.cholainsurance.com/endpoint/token';
                }
                client.post(token_generation_url, argsT, function (dataT, response) {
                    if (dataT.hasOwnProperty('access_token') && dataT["access_token"] !== '') {
                        var policy_generate_args = {
                            data: docLog.Insurer_Request,
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json"
                            }
                        };
                        policy_generate_args.headers.Authorization = 'Bearer Token ' + new Buffer(dataT["access_token"]);
                        service_method_url = specific_insurer_object.method_file_url;
                        client.post(service_method_url, policy_generate_args, function (data, response) {
                            var objResponseFull = {
                                'err': null,
                                'result': data,
                                'raw': '',
                                'soapHeader': null,
                                'objResponseJson': data
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        });
                    } else {
                        console.error('Chola PA token_generate API Error', JSON.stringify(dataT));
                        var objResponseFull = {
                            'err': null,
                            'result': null,
                            'raw': JSON.stringify(dataT),
                            'soapHeader': null,
                            'objResponseJson': dataT
                        };
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    }
                });
            } else { // pdf
                service_method_url = config.environment.weburl;
                client.get(service_method_url, function (data, response) {
                    // parsed response body as js object 
//                    console.log(data);
                    // raw response 
//                    console.log(response);
                    var objResponseFull = {
                        'err': null,
                        'result': data,
                        'raw': '',
                        'soapHeader': null,
                        'objResponseJson': data
                    };
                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            }
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
CholaPA.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        var objPremiumService = objResponseJson;
        if (objResponseJson !== null && objResponseJson.length > 0 && objResponseJson[0].hasOwnProperty('_doc')) {
            var objPremiumService = objResponseJson[0]['_doc'];
            if (objPremiumService.hasOwnProperty('Premium')) {
                var base_premium = (objPremiumService['Premium'] - 0);
                var premium_breakup = this.get_const_premium_breakup();
                premium_breakup['service_tax'] = base_premium * 0.18;
                premium_breakup['final_premium'] = Math.round(base_premium + premium_breakup['service_tax']);
                premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['net_premium'] = base_premium;
                premium_breakup['pa_insurance_si'] = objPremiumService['SumInsured'];
                let benefit_key = ['Accidental_Death', 'Permanent_Total_Disability', 'Permanent_Partial_Disability', 'Unique_Benefit_1', 'Unique_Benefit_2', 'Unique_Benefit_3', 'Unique_Benefit_4'];
                let benefitObj = {};
                benefit_key.forEach(key => {
                    benefitObj[key] = objPremiumService[key];
                });
                premium_breakup['benefits'] = benefitObj;
                objServiceHandler.Premium_Breakup = premium_breakup;
            } else {
                Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        //objServiceHandler.Insurer_Transaction_Identifier = objPremiumService.hasOwnProperty('correlationId') ? objPremiumService['correlationId'] : null;
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
CholaPA.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        var razorpay_response = objResponseJson;
        if ((razorpay_response.hasOwnProperty('status') && razorpay_response.hasOwnProperty('id') && razorpay_response['id'].includes('order_'))) {
        } else if (razorpay_response.hasOwnProperty('status') && razorpay_response['status'] !== 'created') {
            Error_Msg = 'Razorpay Order Not Created';
        } else {
            Error_Msg = 'Razorpay Order Not Created';
        }
//        if (this.prepared_request.hasOwnProperty('reject') && this.prepared_request['reject'] === true) {
//            Error_Msg = 'Not allowed due to Nstp rule';
//        }
        if (Error_Msg === 'NO_ERR') {
            var merchant_key = config.razor_pay.rzp_chola.username;
            var pg_data = {
                'key': merchant_key,
                'full_name': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                'return_url': this.const_payment.pg_ack_url,
                'phone': this.lm_request['mobile'],
                'orderId': razorpay_response["id"],
                'txnId': this.lm_request['udid'] + ',' + this.lm_request['crn'] + ',' + this.lm_request['proposal_id'] + ',' + this.lm_request['insurer_id'],
                'quoteId': "",
                'amount': this.lm_request['final_premium'],
                'email': this.lm_request['email'],
                'img_url': 'https://origin-cdnh.policyboss.com/website/Images/PolicyBoss-Logo.jpg',
                'pg_type': "rzrpay",
                'transfer_id': razorpay_response.hasOwnProperty('transfers') && razorpay_response['transfers'][0].hasOwnProperty('status') && razorpay_response['transfers'][0]['status'] === "created" ? razorpay_response['transfers'][0]['id'] : ""
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Payment.pg_url = "";
//            objServiceHandler.Insurer_Transaction_Identifier = razorpay_response.hasOwnProperty('transfers') && razorpay_response['transfers'][0].hasOwnProperty('status') && razorpay_response['transfers'][0]['status'] === "created" ? razorpay_response['transfers'][0]['id'] : "";
            objServiceHandler.Insurer_Transaction_Identifier = razorpay_response["id"];
        }
        objServiceHandler.Error_Msg = Error_Msg;
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
CholaPA.prototype.pg_response_handler = function () {
    try {
        var objInsurerProduct = this;
        var output = objInsurerProduct.const_payment_response.pg_get;
        if (objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response.pg_data.pg_type === "rzrpay") {
            if (output['Status'] === 'Success') {
                this.const_policy.transaction_amount = objInsurerProduct.const_payment_response.pg_data.amount;
                this.const_policy.pg_status = 'SUCCESS';
//                this.const_policy.pg_reference_number_1 = "";
                this.const_policy.pg_reference_number_1 = moment(this.proposal_processed_request['___current_date___'], 'YYYY-MM-DD').format("DD-MM-YYYY");
                this.const_policy.pg_reference_number_2 = output['OrderId'];
                this.const_policy.pg_reference_number_3 = objInsurerProduct.const_payment_response.pg_data['transfer_id'];
                this.const_policy.transaction_id = output['PayId'].toString();
                this.const_policy.policy_number = objInsurerProduct.const_payment_response.pg_data.quoteId;
                if (output.hasOwnProperty('Signature') && output.Signature) {
                    var secret_key = config.razor_pay.rzp_chola.password;
                    var gen_signature = this.encrypt_to_hmac_256(output['OrderId'] + '|' + output['PayId'], secret_key).toLowerCase();
                    if (gen_signature === output['Signature']) {//Razorpay verification
                        this.const_policy.pg_status = 'SUCCESS';
                        this.const_policy.transaction_status = 'SUCCESS';
                    } else {
                        this.const_policy.pg_status = 'FAIL';
                        this.const_policy.transaction_status = 'FAIL';
                    }
                } else {
                    this.const_policy.pg_status = 'SUCCESS';
                    this.const_policy.transaction_status = 'SUCCESS';
                }
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', e.stack);
    }
};
CholaPA.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objProduct = this;
        var data = objResponseJson;
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
        if (this.const_policy.pg_status === 'FAIL') {
        }
        if (data.hasOwnProperty('Status') && data['Status'] === 'SUCCESS') {
            if (data.hasOwnProperty('PolicyNumber') && data['PolicyNumber'] !== '') {
                objProduct.const_policy.policy_number = data['PolicyNumber'];
                objServiceHandler.Insurer_Transaction_Identifier = data['PolicyNumber'];
            } else {
                Error_Msg = "policy_No_Generate NA: " + JSON.stringify(data);
            }
        } else if (data.hasOwnProperty('Errormessage') && data.Errormessage.includes('policy is available')) {
            if (objProduct.Master_Details.User_Data.hasOwnProperty('Pdf_Request') && objProduct.Master_Details.User_Data['Pdf_Request'].policy_number !== '') {
                objProduct.const_policy.policy_number = objProduct.Master_Details.User_Data['Pdf_Request'].policy_number;
            } else {
                Error_Msg = "policyNo_generate API: " + JSON.stringify(data);
            }
        } else {
            Error_Msg =  JSON.stringify(data);
        }
        if (Error_Msg === 'NO_ERR' && this.const_policy.transaction_status === 'SUCCESS' && this.const_policy.policy_number !== "" && this.const_policy.policy_number !== null) { //
            var pdf_file_name = this.constructor.name + '_PA_POLICY_' + this.const_policy['policy_number'].replaceAll('/', '') + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            this.const_policy.policy_url = pdf_web_path_portal;
            this.const_policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "CholaPA_FeedFile_" + this.const_policy['policy_number'].replaceAll('/', '') + ".xlsx";
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
        }
        objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.policy_number;
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
CholaPA.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    var objInsurerProduct = this;
    objInsurerProduct.pdf_attempt++;
    var Client = require('node-rest-client').Client;
    var client = new Client();
    client.post(url, args, function (data, response) {
        if (data.Error_Code !== '' || true) {
            if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                var sleep = require('system-sleep');
//                sleep(60000);
                objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
            }
        }
    });
};
CholaPA.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objProduct = this;
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
            var policy_no = objProduct.lm_request['policy_number'].replaceAll('/', '');
            var pdf_file_name = this.constructor.name + '_PA_POLICY_' + policy_no + '.pdf';
            var html_file_name = this.constructor.name + '_PA_POLICY_' + policy_no + '.html';
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            var html_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + html_file_name;
            var html_file_path = appRoot + "/resource/request_file/PA_Chola_Pdf_Template.html"; //for UAT
            var pdf_file_path = appRoot + "/tmp/pdf/" + this.constructor.name + '_PA_POLICY_' + policy_no + '.pdf';
            var html_pdf_file_path = appRoot + "/tmp/pdf/" + this.constructor.name + '_PA_POLICY_' + policy_no + '.html';
            //console.log("pdf_file_path : ",pdf_file_path);
            policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "CholaPA_FeedFile_" + policy_no + ".xlsx";
            policy.policy_url = pdf_web_path_portal;
            var htmlPol = fs.readFileSync(html_file_path, 'utf8');

            var User_Data = require(appRoot + '/models/user_data');
            User_Data.findOne({"Request_Unique_Id": objProduct.lm_request['search_reference_number']}, function (err, dbUserData) {
                if (dbUserData) {
                    var Processed_Request = dbUserData._doc.Processed_Request;
                    var erp_request = dbUserData._doc.Erp_Qt_Request_Core;
                    var txt_replace_with = htmlPol.toString();
                    var txt_replace = '';
                    if (erp_request["___adult_count___"] !== 2) {
                        txt_replace = objProduct.find_text_btw_key(txt_replace_with, '<!--Member_2_start-->', '<!--Member_2_end-->', true);
                        txt_replace_with = txt_replace_with.replaceAll(txt_replace, "");
                    }
                    for (let i = erp_request["___child_count___"]; i < 3; i++) {
                        txt_replace = objProduct.find_text_btw_key(txt_replace_with, '<!--Member_' + (i + 3) + '_start-->', '<!--Member_' + (i + 3) + '_end-->', true);
                        txt_replace_with = txt_replace_with.replaceAll(txt_replace, "");
                    }
                    htmlPol = txt_replace_with;
                    //var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
                    var replacedata = {
                        '___policy_num___': objProduct.lm_request['policy_number'],
                        '___payment_id___': dbUserData._doc.Transaction_Data.pg_reference_number_3,
                        '___payment_time___': moment.unix(objProduct.insurer_master.service_logs.pb_db_master.Insurer_Response.created_at).format('HH:mm:ss'),
                        '___payment_dt___': moment(dbUserData._doc.Transaction_Data.pg_reference_number_1, 'DD-MM-YYYY').format("DD/MM/YYYY"),
                        '___mem_1_dob___': erp_request["___member_1_birth_date___"] ? moment(erp_request["___member_1_birth_date___"], 'YYYY-MM-DD').format("DD/MM/YYYY") : "",
                        '___mem_2_dob___': erp_request["___member_2_birth_date___"] ? moment(erp_request["___member_2_birth_date___"], 'YYYY-MM-DD').format("DD/MM/YYYY") : "",
                        '___mem_3_dob___': erp_request["___member_3_birth_date___"] ? moment(erp_request["___member_3_birth_date___"], 'YYYY-MM-DD').format("DD/MM/YYYY") : "",
                        '___mem_4_dob___': erp_request["___member_4_birth_date___"] ? moment(erp_request["___member_4_birth_date___"], 'YYYY-MM-DD').format("DD/MM/YYYY") : "",
                        '___mem_1_age___': objProduct.lm_request['member_1_age'],
                        '___mem_2_age___': objProduct.lm_request['member_2_age'] === -1 ? "" : objProduct.lm_request['member_2_age'],
                        '___mem_3_age___': objProduct.lm_request['member_3_age'] === -1 ? "" : objProduct.lm_request['member_3_age'],
                        '___mem_4_age___': objProduct.lm_request['member_4_age'] === -1 ? "" : objProduct.lm_request['member_4_age'],
                        '___policy_start_dt___': moment(erp_request['___policy_start_date___'], 'YYYY-MM-DD').format("DD/MM/YYYY"),
                        '___policy_end_dt___': moment(erp_request['___policy_end_date___'], 'YYYY-MM-DD').format("DD/MM/YYYY"),
                        '___date___': moment(erp_request['___current_date___'], 'YYYY-MM-DD').format("DD/MM/YYYY"),
                        '___net_premium___' : objProduct.rupees_format(erp_request['___premium_breakup_net_premium___']),
                        '___SGST___' : objProduct.rupees_format(erp_request['___premium_breakup_SGST___']),
                        '___CGST___' : objProduct.rupees_format(erp_request['___premium_breakup_CGST___']),
                        '___IGST___' : objProduct.rupees_format(erp_request['___premium_breakup_IGST___']),
                        '___kerala_flood_cess___' : objProduct.rupees_format(0),
                        '___gross_premium___' : objProduct.rupees_format(erp_request['___premium_breakup_final_premium___'])
                    };

                    htmlPol = htmlPol.toString().replaceJson(replacedata);
                    htmlPol = htmlPol.toString().replaceJson(Processed_Request);
                    htmlPol = htmlPol.toString().replaceJson(erp_request);
                    htmlPol = htmlPol.replaceAll(/___(.*?)___/g, "");
                    // console.log(htmlPol);
                    sleep(2000);
                    var request_html_file = fs.writeFileSync(html_pdf_file_path, htmlPol);
                    sleep(2000);
                    try {
                        var http = require('https');
                        console.log('PA::CholaPdfUrl');
                        //var insurer_pdf_url = "https://blog.policyboss.com/html2pdf.php?o=download&u=http://qa-horizon.policyboss.com:3000/pdf-files/policy/CholaPA_PA_POLICY_28260014745700000.html";
                        var insurer_pdf_url = config.environment.pdf_url + html_web_path_portal;
                        //var insurer_pdf_url = html_web_path_portal;//Local
                        var file_horizon = fs.createWriteStream(pdf_file_path);
                        var request_horizon = http.get(insurer_pdf_url, function (response) {
                            response.pipe(file_horizon);
                        });
                    } catch (ex1) {
                        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex1.stack);
                    }

                    //START Feed File Code=========================================================================================
                    try {
                        let wb = new xl.Workbook();
                        let ws = wb.addWorksheet('Sheet 1');
                        let styleh = wb.createStyle({font: {bold: true, size: 12}});
//                        //row 1- column headings
//                        ws.cell(1, 1).string('Proposal details:').style(styleh).ws.column(1).setWidth(30);
//                        ws.cell(1, 2).string('Values').style(styleh).ws.column(2).setWidth(40);
//
//                        // column 1
//                        ws.cell(2, 1).string('Chola MS Proposal No');
//                        ws.cell(3, 1).string('Office Location');
//                        ws.cell(4, 1).string('Transaction Type');
//                        ws.cell(5, 1).string('Proposal Date');
//                        ws.cell(6, 1).string('Policy Start Date');
//                        ws.cell(7, 1).string('Start Time');
//                        ws.cell(8, 1).string('Policy End Date');
//                        ws.cell(9, 1).string('Customer Type');
//                        ws.cell(10, 1).string('Customer / Proposar Name');
//                        ws.cell(11, 1).string('Address line 1');
//                        ws.cell(12, 1).string('Address line 2');
//                        ws.cell(13, 1).string('Area');
//                        ws.cell(14, 1).string('City');
//                        ws.cell(15, 1).string('State');
//                        ws.cell(16, 1).string('Pin code');
//                        ws.cell(17, 1).string('Email ID');
//                        ws.cell(18, 1).string('Mobile Number');
//                        ws.cell(19, 1).string('Intermediary Code');
//                        ws.cell(20, 1).string('Business Division');
//                        ws.cell(21, 1).string('Business Segment');
//                        ws.cell(22, 1).string('Plan Type');
//                        ws.cell(23, 1).string('*Insured Details:').style(styleh);
//                        ws.cell(24, 1).string('Insured Name');
//                        ws.cell(25, 1).string('Relationship');
//                        ws.cell(26, 1).string('Occupation');
//                        ws.cell(27, 1).string('Earning');
//                        ws.cell(28, 1).string('Annual Income');
//                        ws.cell(29, 1).string('Gender');
//                        ws.cell(30, 1).string('DOB');
//                        ws.cell(31, 1).string('Sum Insured');
//
//                        // column 2
//                        ws.cell(2, 2).string(erp_request["___proposal_id___"].toString());
//                        ws.cell(3, 2).string('Mumbai');
//                        ws.cell(4, 2).string("New");
//                        try {
//                            ws.cell(5, 2).string(moment(dbUserData._doc.Transaction_Data.pg_reference_number_1, 'DD-MM-YYYY').format("YYYY-MM-DD"));
//                        } catch (e) {
//                            ws.cell(5, 2).string("");
//                        }
//                        ws.cell(6, 2).string(erp_request["___policy_start_date___"].toString());
//                        ws.cell(7, 2).string("00:00:01");
//                        ws.cell(8, 2).string(erp_request["___policy_end_date___"].toString());
//                        ws.cell(9, 2).string("Individual");
//                        ws.cell(10, 2).string(erp_request["___contact_name___"]);
//                        ws.cell(11, 2).string(erp_request["___permanent_address_1___"] ? erp_request["___permanent_address_1___"] : "");
//                        ws.cell(12, 2).string(erp_request["___permanent_address_2___"] ? erp_request["___permanent_address_2___"] + " " + erp_request["___permanent_address_3___"] : "");
//                        ws.cell(13, 2).string((erp_request["___locality___"] ? erp_request["___locality___"] : "").toString());
//                        ws.cell(14, 2).string((erp_request["___district___"] ? erp_request["___district___"] : "").toString());
//                        ws.cell(15, 2).string(erp_request["___communication_state___"].toString());
//                        ws.cell(16, 2).string((erp_request["___permanent_pincode___"]).toString());
//                        ws.cell(17, 2).string(erp_request["___email___"]);
//                        ws.cell(18, 2).string(erp_request["___mobile___"].toString());
//                        ws.cell(19, 2).string(Processed_Request['___insurer_integration_agent_code___']);
//                        ws.cell(20, 2).string('MNI');
//                        ws.cell(21, 2).string('PL');
//                        ws.cell(22, 2).string(Processed_Request['___plan_type___'].toString());
//                        ws.cell(23, 2).string('');
//                        ws.cell(24, 2).string(erp_request["___member_1_fullName___"]);
//                        ws.cell(25, 2).string(Processed_Request["___member_1_relation___"]);
//                        ws.cell(26, 2).string(erp_request["___member_1_occupation_text___"]);
//                        ws.cell(27, 2).string((dbUserData._doc.Proposal_Request_Core.member_1_monthly_income - 0) > 0 ? "Yes" : "No");
//                        ws.cell(28, 2).string(((dbUserData._doc.Proposal_Request_Core.member_1_monthly_income - 0) * 12).toString());
//                        ws.cell(29, 2).string(erp_request["___member_1_gender___"] === "M" ? "Male" : "Female");
//                        ws.cell(30, 2).string(moment(erp_request["___member_1_birth_date___"]).format("DD-MM-YYYY"));
//                        ws.cell(31, 2).string((erp_request["___pa_insurance_si___"] ? erp_request["___pa_insurance_si___"] : "").toString());
//
//                        var last_cell_count = 31;
//                        if (erp_request["___adult_count___"] > 1) {
//                            ws.cell(++last_cell_count, 1).string('');
//                            ws.cell(last_cell_count, 2).string('');
//                            ws.cell(++last_cell_count, 1).string('Insured Name');
//                            ws.cell(last_cell_count, 2).string(erp_request["___member_2_fullName___"]);
//                            ws.cell(++last_cell_count, 1).string('Relationship');
//                            ws.cell(last_cell_count, 2).string(Processed_Request["___member_2_relation___"]);
//                            ws.cell(++last_cell_count, 1).string('Occupation');
//                            ws.cell(last_cell_count, 2).string(erp_request["___member_2_occupation_text___"]);
//
//                            ws.cell(++last_cell_count, 1).string('Earning');
//                            ws.cell(last_cell_count, 2).string((dbUserData._doc.Proposal_Request_Core.member_2_monthly_income - 0) > 0 ? "Yes" : "No");
//                            ws.cell(++last_cell_count, 1).string('Annual Income');
//                            ws.cell(last_cell_count, 2).string(((dbUserData._doc.Proposal_Request_Core.member_2_monthly_income - 0) * 12).toString());
//                            ws.cell(++last_cell_count, 1).string('Gender');
//                            ws.cell(last_cell_count, 2).string(erp_request["___member_2_gender___"] === "M" ? "Male" : "Female");
//                            ws.cell(++last_cell_count, 1).string('DOB');
//                            ws.cell(last_cell_count, 2).string(moment(erp_request["___member_2_birth_date___"]).format("DD-MM-YYYY"));
//                            ws.cell(++last_cell_count, 1).string('Sum Insured');
//                            ws.cell(last_cell_count, 2).string((erp_request["___pa_insurance_si___"]).toString());
//                        }
//                        if (erp_request["___child_count___"] > 0) {
//                            for (var member = 1; member <= erp_request["___child_count___"]; member++) {
//                                ws.cell(++last_cell_count, 1).string('');
//                                ws.cell(last_cell_count, 2).string('');
//                                ws.cell(++last_cell_count, 1).string('Insured Name');
//                                ws.cell(last_cell_count, 2).string(erp_request["___member_" + (member + 2) + "_fullName___"]);
//                                ws.cell(++last_cell_count, 1).string('Relationship');
//                                ws.cell(last_cell_count, 2).string(Processed_Request["___member_" + (member + 2) + "_relation___"]);
//                                ws.cell(++last_cell_count, 1).string('Occupation');
//                                ws.cell(last_cell_count, 2).string(erp_request["___member_" + (member + 2) + "_occupation_text___"] ? erp_request["___member_" + (member + 2) + "_occupation_text___"] : "");
//
//                                ws.cell(++last_cell_count, 1).string('Earning');
//                                ws.cell(last_cell_count, 2).string((dbUserData._doc.Proposal_Request_Core['member_' + (member + 2) + '_monthly_income'] - 0) > 0 ? "Yes" : "No");
//                                ws.cell(++last_cell_count, 1).string('Annual Income');
//                                ws.cell(last_cell_count, 2).string(((dbUserData._doc.Proposal_Request_Core['member_' + (member + 2) + '_monthly_income'] - 0) * 12).toString());
//                                ws.cell(++last_cell_count, 1).string('Gender');
//                                ws.cell(last_cell_count, 2).string(erp_request["___member_" + (member + 2) + "_gender___"] === "M" ? "Male" : "Female");
//                                ws.cell(++last_cell_count, 1).string('DOB');
//                                ws.cell(last_cell_count, 2).string(moment(erp_request["___member_" + (member + 2) + "_birth_date___"]).format("DD-MM-YYYY"));
//                                ws.cell(++last_cell_count, 1).string('Sum Insured');
//                                ws.cell(last_cell_count, 2).string((erp_request["___pa_insurance_si___"]).toString());
//                            }
//                        }
//                        ws.cell(++last_cell_count, 1).string('Nomiee details:').style(styleh);
//                        ws.cell(last_cell_count, 2).string('');
//                        ws.cell(++last_cell_count, 1).string('Assignee Name');
//                        ws.cell(last_cell_count, 2).string(erp_request["___nominee_name___"]);
//                        ws.cell(++last_cell_count, 1).string('Assignee Relationship');
//                        ws.cell(last_cell_count, 2).string(erp_request["___nominee_relation___"]);
//                        
//                        /* Start For Premium Details */
//                        ws.cell(++last_cell_count, 1).string('Premium details:').style(styleh);
//                        ws.cell(last_cell_count, 2).string('');
//                        ws.cell(++last_cell_count, 1).string('Net Premium');
//                        ws.cell(last_cell_count, 2).string(erp_request["___net_premium___"].toString());
//                        ws.cell(++last_cell_count, 1).string('GST');
//                        ws.cell(last_cell_count, 2).string(erp_request["___service_tax___"].toString());
//                        ws.cell(++last_cell_count, 1).string('Total Premium');
//                        ws.cell(last_cell_count, 2).string(erp_request["___final_premium___"].toString());
//                        /* End For Premium Details */
//                        
//                        /* Start For Payment details */
//                        ws.cell(++last_cell_count, 1).string('Payment details:').style(styleh);
//                        ws.cell(last_cell_count, 2).string('');
//                        ws.cell(++last_cell_count, 1).string('UTR Number');
//                        try {
//                            ws.cell(last_cell_count, 2).string(dbUserData._doc.Transaction_Data.pg_reference_number_3); // payment transfer id
//                        } catch (e) {
//                            ws.cell(last_cell_count, 2).string("");
//                        }
//                        ws.cell(++last_cell_count, 1).string('UTR Amount');
//                        ws.cell(last_cell_count, 2).string(erp_request["___final_premium___"].toString());
//                        ws.cell(++last_cell_count, 1).string('UTR Date');
//                        try {
//                            ws.cell(last_cell_count, 2).string(moment(dbUserData._doc.Transaction_Data.pg_reference_number_1, 'DD-MM-YYYY').format("YYYY-MM-DD"));
//                        } catch (e) {
//                            ws.cell(last_cell_count, 2).string("");
//                        }
//                        /* End For Payment details */
//                        
//                        /* Start For Policy Number */
//                        ws.cell(++last_cell_count, 1).string('Policy Number:').style(styleh);
//                        ws.cell(last_cell_count, 2).string(objProduct.lm_request['policy_number']);
//                        /* End For Policy Number */
//                        
//                        /* Start For Vehicle Details */
//                        ws.cell(++last_cell_count, 1).string('Vehicle Details:').style(styleh);
//                        ws.cell(last_cell_count, 2).string('');
//                        ws.cell(++last_cell_count, 1).string('Policy Number-Vehicle');
//                        ws.cell(last_cell_count, 2).string(erp_request.___policy_no___ ? erp_request["___policy_no___"].toString() : "");
//                        ws.cell(++last_cell_count, 1).string('Insurance Company');
//                        ws.cell(last_cell_count, 2).string(erp_request.___insurance_name___ ? ((erp_request["___insurance_name___"].toUpperCase()).toString()) : "");
//                        ws.cell(++last_cell_count, 1).string('IDV');
//                        ws.cell(last_cell_count, 2).string(erp_request.___idv___ ? erp_request["___idv___"].toString() : "");
//                        /* End For Vehicle Details */
                        
                        let ff_trf_id = "";
                        if (dbUserData._doc.hasOwnProperty('Transaction_Data') && dbUserData._doc.Transaction_Data && dbUserData._doc.Transaction_Data.pg_reference_number_3) {
                            ff_trf_id = dbUserData._doc.Transaction_Data.pg_reference_number_3;
                        } else {
                            try {
                                ff_trf_id = dbUserData._doc.Payment_Request.pg_data.transfer_id;
                            } catch (e) {
                                console.log("Razorpay transfer id not available");
                                ff_trf_id = "";
                            }
                        }
                        //row 1
                        ws.cell(1, 1).string('Chola MS Proposal No').style(styleh);
                        ws.cell(1, 2).string('Office Location').style(styleh);
                        ws.cell(1, 3).string('Transaction Type').style(styleh);
                        ws.cell(1, 4).string('Proposal Date').style(styleh);
                        ws.cell(1, 5).string('Policy Start Date').style(styleh);
                        ws.cell(1, 6).string('Start Time').style(styleh);
                        ws.cell(1, 7).string('Policy End Date').style(styleh);
                        ws.cell(1, 8).string('Customer Type').style(styleh);
                        ws.cell(1, 9).string('Customer / Proposar Name').style(styleh);
                        ws.cell(1, 10).string('Address line 1').style(styleh);
                        ws.cell(1, 11).string('Address line 2').style(styleh);
                        ws.cell(1, 12).string('Area').style(styleh);
                        ws.cell(1, 13).string('City').style(styleh);
                        ws.cell(1, 14).string('State').style(styleh);
                        ws.cell(1, 15).string('Pin code').style(styleh);
                        ws.cell(1, 16).string('Email ID').style(styleh);
                        ws.cell(1, 17).string('Mobile Number').style(styleh);
                        ws.cell(1, 18).string('Intermediary Code').style(styleh);
                        ws.cell(1, 19).string('Business Division').style(styleh);
                        ws.cell(1, 20).string('Business Segment').style(styleh);
                        ws.cell(1, 21).string('Plan Type').style(styleh);
                        var col_index = 21;
//                        var ff_member_count = erp_request["___adult_count___"] + erp_request["___child_count___"];
//                        for (ff_member = 1; ff_member <= ff_member_count; ff_member++) {
                        for (var i = 1; i <= 4; i++) {
                            ws.cell(1, col_index + 1).string('Insured Name').style(styleh);
                            ws.cell(1, col_index + 2).string('Relationship').style(styleh);
                            ws.cell(1, col_index + 3).string('Occupation').style(styleh);
                            ws.cell(1, col_index + 4).string('Earning').style(styleh);
                            ws.cell(1, col_index + 5).string('Annual Income').style(styleh);
                            ws.cell(1, col_index + 6).string('Gender').style(styleh);
                            ws.cell(1, col_index + 7).string('DOB').style(styleh);
                            ws.cell(1, col_index + 8).string('Sum Insured').style(styleh);
                            col_index += 8;
                        }
                        ws.cell(1, col_index + 1).string('Assignee Name').style(styleh);
                        ws.cell(1, col_index + 2).string('Assignee Relationship').style(styleh);
                        ws.cell(1, col_index + 3).string('Net Premium').style(styleh);
                        ws.cell(1, col_index + 4).string('GST').style(styleh);
                        ws.cell(1, col_index + 5).string('Total Premium').style(styleh);
                        ws.cell(1, col_index + 6).string('UTR Number').style(styleh);
                        ws.cell(1, col_index + 7).string('UTR Amount').style(styleh);
                        ws.cell(1, col_index + 8).string('UTR Date').style(styleh);
                        ws.cell(1, col_index + 9).string('Policy Number').style(styleh);
                        ws.cell(1, col_index + 10).string('Policy Number-Vehicle').style(styleh);
                        ws.cell(1, col_index + 11).string('Insurance Company').style(styleh);
                        ws.cell(1, col_index + 12).string('IDV').style(styleh);
                        ws.cell(1, col_index + 13).string('PB Unique ID').style(styleh);
                        
                        //row 2
//                        ws.cell(2, 1).string((erp_request["___proposal_id___"].toString()));
                        ws.cell(2, 1).string(ff_trf_id);
                        ws.cell(2, 2).string("Mumbai");
                        ws.cell(2, 3).string("New");
                        ws.cell(2, 4).string(moment(dbUserData._doc.Transaction_Data.pg_reference_number_1, 'DD-MM-YYYY').format("YYYY-MM-DD"));
                        ws.cell(2, 5).string(erp_request["___policy_start_date___"].toString());
                        ws.cell(2, 6).string("00:00:01");
                        ws.cell(2, 7).string(erp_request["___policy_end_date___"].toString());
                        ws.cell(2, 8).string("Individual");
                        ws.cell(2, 9).string(erp_request["___contact_name___"]);
                        ws.cell(2, 10).string(erp_request["___permanent_address_1___"] ? erp_request["___permanent_address_1___"] : "");
                        ws.cell(2, 11).string(erp_request["___permanent_address_2___"] ? erp_request["___permanent_address_2___"] + " " + erp_request["___permanent_address_3___"] : "");
                        ws.cell(2, 12).string((erp_request["___locality___"] ? erp_request["___locality___"] : "").toString());
                        ws.cell(2, 13).string((erp_request["___district___"] ? erp_request["___district___"] : "").toString());
                        ws.cell(2, 14).string(erp_request["___communication_state___"].toString());
                        ws.cell(2, 15).string((erp_request["___permanent_pincode___"]).toString());
                        ws.cell(2, 16).string(erp_request["___email___"]);
                        ws.cell(2, 17).string(erp_request["___mobile___"].toString());
                        ws.cell(2, 18).string(Processed_Request['___insurer_integration_agent_code___']);
                        ws.cell(2, 19).string('MNI');
                        ws.cell(2, 20).string('PL');
                        ws.cell(2, 21).string(Processed_Request['___plan_type___'].toString());
                        var index = 21;
                        
                        for (var adult = 1; adult <= 2; adult++) {
                            if (adult <= Processed_Request['___adult_count___']) {
                                ws.cell(2, index + 1).string(erp_request["___member_" + adult + "_fullName___"]);
                                ws.cell(2, index + 2).string(erp_request["___member_" + adult + "_relation___"]);
                                ws.cell(2, index + 3).string(erp_request["___member_" + adult + "_occupation_text___"]);
                                try {
                                    ws.cell(2, index + 4).string((dbUserData._doc.Proposal_Request_Core["member_" + adult + "_monthly_income"] - 0) > 0 ? "Yes" : "No");
                                } catch (e) {
                                    ws.cell(2, index + 4).string("");
                                } 
                                try {
                                   ws.cell(2, index + 5).string(((dbUserData._doc.Proposal_Request_Core["member_" + adult + "_monthly_income"] - 0) * 12).toString());
                                } catch (e) {
                                    ws.cell(2, index + 5).string("");
                                } 
                                ws.cell(2, index + 6).string(erp_request["___member_" + adult + "_gender___"] === "M" ? "Male" : "Female");
                                ws.cell(2, index + 7).string(moment(erp_request["___member_" + adult + "_birth_date___"]).format("DD-MM-YYYY"));
                                ws.cell(2, index + 8).string((erp_request["___pa_insurance_si___"] ? erp_request["___pa_insurance_si___"] : "").toString());
                                index += 8;
                            } else {
                                ws.cell(2, index + 1).string("");
                                ws.cell(2, index + 2).string("");
                                ws.cell(2, index + 3).string("");
                                ws.cell(2, index + 4).string("");
                                ws.cell(2, index + 5).string("");
                                ws.cell(2, index + 6).string("");
                                ws.cell(2, index + 7).string("");
                                ws.cell(2, index + 8).string("");
                                index += 8;
                            }
                        }
                        for (var child = 1; child <= 2; child++) {
                            if (child <= Processed_Request['___child_count___']) {
                                ws.cell(2, index + 1).string(erp_request["___member_" + (child + 2) + "_fullName___"]);
                                ws.cell(2, index + 2).string(erp_request["___member_" + (child + 2) + "_relation___"]);
                                ws.cell(2, index + 3).string(erp_request["___member_" + (child + 2) + "_occupation_text___"]);
                                try {
                                    ws.cell(2, index + 4).string((dbUserData._doc.Proposal_Request_Core["member_" + (child + 2) + "_monthly_income"] - 0) > 0 ? "Yes" : "No");
                                } catch (e) {
                                    ws.cell(2, index + 4).string("");
                                }
                                try {
                                    ws.cell(2, index + 5).string(((dbUserData._doc.Proposal_Request_Core["member_" + (child + 2) + "_monthly_income"] - 0) * 12).toString());
                                } catch (e) {
                                    ws.cell(2, index + 5).string("");
                                }
                                ws.cell(2, index + 6).string(erp_request["___member_" + (child + 2) + "_gender___"] === "M" ? "Male" : "Female");
                                ws.cell(2, index + 7).string(moment(erp_request["___member_" + (child + 2) + "_birth_date___"]).format("DD-MM-YYYY"));
                                ws.cell(2, index + 8).string((erp_request["___pa_insurance_si___"] ? erp_request["___pa_insurance_si___"] : "").toString());
                                index += 8;
                            } else {
                                ws.cell(2, index + 1).string("");
                                ws.cell(2, index + 2).string("");
                                ws.cell(2, index + 3).string("");
                                ws.cell(2, index + 4).string("");
                                ws.cell(2, index + 5).string("");
                                ws.cell(2, index + 6).string("");
                                ws.cell(2, index + 7).string("");
                                ws.cell(2, index + 8).string("");
                                index += 8;
                            }
                        }
                        ws.cell(2, index + 1).string(erp_request["___nominee_name___"]);
                        ws.cell(2, index + 2).string(erp_request["___nominee_relation___"]);
                        ws.cell(2, index + 3).string(erp_request["___net_premium___"].toString());
                        ws.cell(2, index + 4).string(erp_request["___service_tax___"].toString());
                        ws.cell(2, index + 5).string(erp_request["___final_premium___"].toString());
                        ws.cell(2, index + 6).string(ff_trf_id); // payment transfer id
                        ws.cell(2, index + 7).string(erp_request["___final_premium___"].toString());
                        ws.cell(2, index + 8).string(moment(dbUserData._doc.Transaction_Data.pg_reference_number_1, 'DD-MM-YYYY').format("YYYY-MM-DD"));
                        ws.cell(2, index + 9).string(objProduct.lm_request['policy_number']);
                        ws.cell(2, index + 10).string(erp_request.___policy_no___ ? erp_request["___policy_no___"].toString() : "");
                        ws.cell(2, index + 11).string(erp_request.___insurance_name___ ? ((erp_request["___insurance_name___"].toUpperCase()).toString()) : "");
                        ws.cell(2, index + 12).string(erp_request.___idv___ ? erp_request["___idv___"].toString() : "");
                        ws.cell(2, index + 13).string((erp_request.___proposal_id___ + "_" + erp_request.___crn___).toString());
                        
                        var ff_file_name = "CholaPA_FeedFile_" + policy_no + ".xlsx";
                        var ff_web_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;//local
                        if (config.environment.name === 'Production' || config.environment.name === 'QA') {
                            ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                        }
                        var ff_name_web_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                        wb.write(ff_name_web_path_portal);
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File of Chola Policy.</p>'
                                + '<BR><p>Policy Number : ' + objProduct.lm_request['policy_number'].replaceAll('/', '') + '</p><BR><p>Policy URL : ' + ff_web_path_portal + ' </p></body></html>';

                        var Email = require('../../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Chola Feed File:' + objProduct.lm_request['policy_number'].replaceAll('/', '');
                        if (config.environment.name === 'Production') {
//                            var arrTo = ['Krajesh1@cholams.murugappa.com'];
//                            var arrCc = ['manzoor@cholams.murugappa.com', 'sankarg@cholams.murugappa.com', 'ksharish@cholams.murugappa.com'];
//                            objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, arrCc.join(','), config.environment.notification_email, '');
                        } else if (config.environment.name === 'QA') {
//                            var arrTo = ['sankarg@cholams.murugappa.com'];
//                            var arrCc = ['anuj.singh@policyboss.com', 'ashish.hatia@policyboss.com'];
//                            objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, arrCc.join(','), config.environment.notification_email, ''); //UAT
                        } else {
                            var arrTo = ['roshani.prajapati@policyboss.com'];
                            objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, '', '', '');
                        }
                    } catch (err) {
                        console.error("PA::Chola FeedFile Error - " + err.stack);
                    }

                } else {
                    policy.pdf_status = 'FAIL';
                    console.log("No Data for SRN");
                }
            });
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
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
CholaPA.prototype.premium_breakup_schema = {
    "net_premium": "NetPremium",
    "tax": {
        "CGST": "CGST",
        "SGST": "SGST",
        "IGST": "IGST",
        "UGST": "UGST"
    },
    "benefits": {},
    "service_tax": 0,
    "final_premium": "GrossPremium"
};
CholaPA.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start ILH');
    let rel_with_proposer = this.lm_request['member_' + i + '_relation_with_proposer'];
//    console.log("Gender in CholaPA " + gender);
//    if (this.prepared_request["relation"] === 'SON' || this.prepared_request["relation"] === 'DAUGHTER') {
//        return(gender === 'M' ? 'FATHER' : 'MOTHER');
//    }
//    if (this.prepared_request["relation"] === 'FATHER' || this.prepared_request["relation"] === 'MOTHER') {
//        return(gender === 'M' ? 'SON' : 'DAUGHTER');
//    }
//    if (this.prepared_request["relation"] === 'SPOUSE') {
//        if (i >= 3) {
//            return(gender === 'M' ? 'SON' : 'DAUGHTER');
//        }
//        return 'SPOUSE';
//    }

    if (rel_with_proposer === 'SELF') {
        return 'Self';
    } else if (rel_with_proposer === 'SPOUSE') {
        return 'Spouse';
    } else {
        if (i >= 3) {
            return "Child " + (i - 2);
        }
    }
//    if (rel_with_proposer === 'SELF') {
//        if (i >= 3) {
//            return "Child " + (i - 2);
//        } else if (i === 1) {
//            return 'Self';
//        } else if (i === 2) {
//            return 'Spouse';
//        }
//    }
    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End CholaPA');
};
CholaPA.prototype.get_quote_date = function () {
    var moment = require('moment');
    var today = moment().utcOffset("+05:30");
    var quote_date = today.format('YYYY-MM-DD');
    return quote_date;
};
CholaPA.prototype.rupees_format = function (num) {
    if (num) {
        var curr = num.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR'
        });
        return curr;
    } else {
        return "";
    }
};
CholaPA.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('CholaPA is_valid_plan', 'start');
    if (lm_request['child_count'] > 2 || lm_request['member_1_age'] > 69) {
        return false;
    }
    return true;
    console.log('CholaPA is_valid_plan', 'End');
};
module.exports = CholaPA;