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
function UniversalSompoHealth() {

}
util.inherits(UniversalSompoHealth, Health);
UniversalSompoHealth.prototype.lm_request_single = {};
UniversalSompoHealth.prototype.insurer_integration = {};
UniversalSompoHealth.prototype.insurer_addon_list = [];
UniversalSompoHealth.prototype.insurer = {};
UniversalSompoHealth.prototype.insurer_date_format = 'dd/MM/yyyy';
UniversalSompoHealth.prototype.const_insurer_suminsured = [100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000];
UniversalSompoHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
UniversalSompoHealth.prototype.insurer_product_field_process_pre = function () {

    if (this.lm_request['method_type'] === 'Premium') {
        var args = {
            "ProductPlan_Id": this.processed_request['___Plan_Id___'],
            "NumberOfAdults": this.lm_request["adult_count"],
            "NumberOfChildren": this.lm_request["child_count"],
            "SumInsured": this.prepared_request["health_insurance_si"] - 0,
            "Min_AgeOfEldestMember_Months": {$lte: this.lm_request["elder_member_age_in_months"]},
            "Max_AgeOfEldestMember_Months": {$gt: this.lm_request["elder_member_age_in_months"]},
            "Policy_Term_Year": 1
        };
        this.method_content = JSON.stringify(args);
    }

    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];
    if (this.lm_request['method_type'] === 'Proposal') {

        this.prepared_request["service_tax"] = this.lm_request["service_tax"];
        this.processed_request["___service_tax___"] = this.prepared_request["service_tax"];
        this.prepared_request["district"] = this.lm_request["district"];
        this.processed_request["___district___"] = this.prepared_request["district"];

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_insured_type'] = "Adult";
            this.processed_request['___member_' + member + '_insured_type___'] = "Adult";
            this.calculate_bmi(member);//BMI Calculate
        }
        for (member = 3; member <= child + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_insured_type'] = "Child";
            this.processed_request['___member_' + member + '_insured_type___'] = "Child";
            this.calculate_bmi(member);//BMI Calculate
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);


        this.method_content = this.method_content.replaceAll('<!--InsurersDetail_Start-->', "");
        this.method_content = this.method_content.replaceAll('<!--InsurersDetail_End-->', "");

        //Question details
        //adult
        for (member = 1; member <= adult; member++) {
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = 'N';
                            this.processed_request['___' + ques_detail + '___'] = 'N';
                            if (ques_detail.includes('1903')) {
                                this.processed_request['___' + ques_detail + '___'] = '80';
                            }
                            if (ques_detail.includes('1904')) {
                                this.processed_request['___' + ques_detail + '___'] = '100';
                            }
                            if (ques_detail.includes('1905')) {
                                this.processed_request['___' + ques_detail + '___'] = '70';
                            }
                            if (ques_detail.includes('1906')) {
                                this.processed_request['___' + ques_detail + '___'] = '160';
                            }

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

        //child

        for (member = 3; member <= child + 2; member++) {
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = 'N';
                            this.processed_request['___' + ques_detail + '___'] = 'N';
                            if (ques_detail.includes('1903')) {
                                this.processed_request['___' + ques_detail + '___'] = '82';
                            }
                            if (ques_detail.includes('1904')) {
                                this.processed_request['___' + ques_detail + '___'] = '102';
                            }
                            if (ques_detail.includes('1905')) {
                                this.processed_request['___' + ques_detail + '___'] = '72';
                            }
                            if (ques_detail.includes('1906')) {
                                this.processed_request['___' + ques_detail + '___'] = '165';
                            }

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

    }
    var obj_quote_date = this.get_quote_date();
    this.prepared_request['get_quote_date'] = obj_quote_date;
    this.processed_request['___get_quote_date___'] = this.prepared_request['get_quote_date'];

    var obj_member_type = this.get_member_type(adult, child);
    this.prepared_request['get_member_type'] = obj_member_type;
    this.processed_request['___get_member_type___'] = this.prepared_request['get_member_type'];
//    console.log(this.processed_request);

//for posp case
    var posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--POS_CONFIG_START-->', '<!--POS_CONFIG_FINISH-->', false);
    if (this.lm_request['is_posp'] === 'yes' && (this.prepared_request["health_insurance_si"] - 0) < 500000) {
        var obj_replace = {
            '___posp_mobile_no___': '8356844187'
        };
        if (Object.keys(obj_replace).length > 0) {
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }
        for (var k in this.lm_request) {
            if (k.indexOf('posp_') === 0) {
                this.method_content = this.method_content.replace('___' + k + '___', this.lm_request[k]);
            }
        }
    } else {
        this.method_content = this.method_content.replace(posp_request_data, '');
    }
    console.log(this.method_content);
};
UniversalSompoHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;
    var error_msg = 'NO_ERROR';

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
UniversalSompoHealth.prototype.insurer_product_field_process_post = function () {

};
UniversalSompoHealth.prototype.insurer_product_api_post = function () {

};

UniversalSompoHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('ServiceCall');
    try {
        var objInsurerProduct = this;
        if (specific_insurer_object.method.Method_Calling_Type === 'Database') {
            var args = JSON.parse(this.method_content);
            args['ProductPlan_Id'] = docLog['Plan_Id'];
            var Health_Rate = require(appRoot + '/models/health_rate');
            Health_Rate.findOne(args, function (err, dbHealthRate) {
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
        } else if (specific_insurer_object.method.Method_Calling_Type === 'SOAP') {
            var soap = require('soap');
            var body = docLog.Insurer_Request;
            var xml2js = require('xml2js');
            if (this.method.Method_Type === 'Proposal') {
                var args = {
                    strXdoc: body
                };
                console.log(body);
            }
            soap.createClient(specific_insurer_object.method.Service_URL, function (err, client) {
                client[specific_insurer_object.method.Method_Action](args, function (err1, result, raw, soapHeader) {
                    console.log(result);
                    if (err1) {
                        console.error('UniversalSompoHealth', 'service_call', 'exception', err1);
                        var objResponseFull = {
                            'err': err1,
                            'result': result,
                            'raw': raw,
                            'soapHeader': soapHeader,
                            'objResponseJson': null
                        };
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    } else {
                        var objResponseJson = {};
                        var objResponseJsonKey = Object.keys(result);
                        var processedXml = 0;

                        xml2js.parseString(result[objResponseJsonKey[0]], function (err2, objXml2Json) {
                            processedXml++;
                            if (err2) {
                                console.error('UniversalSompoHealth', 'service_call', 'xml2jsonerror', err2);
                                var objResponseFull = {
                                    'err': err2,
                                    'result': result,
                                    'raw': raw,
                                    'soapHeader': soapHeader,
                                    'objResponseJson': null
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

                            } else {
                                var strResp = JSON.stringify(objXml2Json);
                                console.log(strResp);
                                strResp = strResp.replace(/\$/g, 'attr');
                                console.log(strResp);
                                var objXml2Json = JSON.parse(strResp);
                                objResponseJson[objResponseJsonKey[0]] = objXml2Json;

                                var objResponseFull = {
                                    'err': null,
                                    'result': result,
                                    'raw': raw,
                                    'soapHeader': soapHeader,
                                    'objResponseJson': objResponseJson
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

                            }
                        });
                    }
                });
            });
        }

    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }

};

UniversalSompoHealth.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
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
                var net_premium = objPremiumService['Premium'];
                if (this.lm_request["policy_tenure"] === 2) {
                    net_premium = (net_premium * 2 * 0.95);
                } else if (this.lm_request["policy_tenure"] === 3) {
                    net_premium = (net_premium * 3 * 0.925);
                }
                var premium_breakup = this.get_const_premium_breakup();
                premium_breakup['net_premium'] = net_premium - 110;
                premium_breakup['service_tax'] = Math.round((premium_breakup['net_premium'] - 0) * 0.18);
                premium_breakup['final_premium'] = Math.round(premium_breakup['net_premium'] + premium_breakup['service_tax']);
                premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                objServiceHandler.Premium_Breakup = premium_breakup;

            } else {
                Error_Msg = 'LM_MAIN_MISSING_NODE_NA';
            }
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['HealthRate_Id'];
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
UniversalSompoHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    if (objResponseJson.hasOwnProperty('commBRIDGEFusionHEALTHResult')) {
        objError = objResponseJson['commBRIDGEFusionHEALTHResult']['Root']['Errors'][0]['ErrorCode'][0];
        if (objError !== '0') {
            Error_Msg = objResponseJson['commBRIDGEFusionHEALTHResult']['Root']['Errors'][0]['ErrDescription'][0];
        }
    } else {
        Error_Msg = 'LM_MAIN_commBRIDGEFusionHEALTHResult_NODE_NA';
    }
    try {
        if (Error_Msg === 'NO_ERR') {
            var pg_data = {
                'PosPolicyNo': objResponseJson['commBRIDGEFusionHEALTHResult']['Root']['Customer'][0]['PosPolicyNo'][0],
                'FinalPremium': this.lm_request['final_premium'],
                'Src': 'WA',
                'SubSrc': this.prepared_request['insurer_integration_agent_code']
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'GET';
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['commBRIDGEFusionHEALTHResult']['Root']['Customer'][0]['PosPolicyNo'][0];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', ex);
    }
    return objServiceHandler;
};
UniversalSompoHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        var Error_Msg = 'NO_ERR';

        //this.pg_response_handler();
        if (this.const_policy.transaction_status === 'SUCCESS') {
            var pdf_file_name = this.constructor.name + '_Health_' + this.const_policy.policy_number + '.pdf';
            pdf_file_name = pdf_file_name.replace(/\//g, '');
            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            this.const_policy.policy_url = pdf_web_path_portal;

            try {
                var https = require('https');
                var insurer_pdf_url = this.const_policy.insurer_pdf_url;

                var file_horizon = fs.createWriteStream(pdf_sys_loc);
                var request_horizon = https.get(insurer_pdf_url, function (response) {
                    response.pipe(file_horizon);
                });
            } catch (ex1) {
                console.error('Exception', this.constructor.name, 'verification_response_handler', ex1);
            }


            /*if(this.const_policy.hasOwnProperty('insurer_pdf_url') && this.const_policy){
             this.const_policy.policy_url = this.const_policy.insurer_pdf_url;
             } */
        }
        objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
    return objServiceHandler;

};
UniversalSompoHealth.prototype.pg_response_handler = function () {
    try {
        var Output = this.const_payment_response.pg_get['MSG'];
        var str = Output.split('|');
        this.const_policy.transaction_status = '';
        this.const_policy.transaction_id = str[2];
        if (this.const_payment_response.pg_get['MSG'].indexOf('1001') > -1) {
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = str[3];
            this.const_policy.transaction_amount = str[4];
            this.const_policy.insurer_pdf_url = str[9];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
UniversalSompoHealth.prototype.get_quote_date = function () {
    console.log(this.constructor.name, 'quote_date');
    var today = moment().format('DD/MM/YYYY');
    return today;
};
UniversalSompoHealth.prototype.current_time = function () {
    var today = moment().utcOffset("+05:30");
    var current_time = moment(today).format("HH:mm:ss");
    current_time = current_time.replaceAll(":", "");
    return current_time;
};

UniversalSompoHealth.prototype.get_member_relation = function (i) {
    var gender = this.lm_request['member_' + i + '_gender'];
    if (this.prepared_request["relation"] === 'Son' || this.prepared_request["relation"] === 'Daughter') {
        return(gender === 'M' ? 'Father' : 'Mother');
    }
    if (this.prepared_request["relation"] === 'Mother' || this.prepared_request["relation"] === 'Father') {
        return(gender === 'M' ? 'Son' : 'Daughter');
    }
    if (this.prepared_request["relation"] === 'Spouse') {
        return 'Spouse';
    }
    if (this.prepared_request["relation"] === 'Self' || this.prepared_request["relation"] === '') {
        if (i >= 3) {
            return(gender === 'M' ? 'Son' : 'Daughter');
        } else if (i === 1) {
            return 'Self';
        } else if (i === 2) {
            return 'Spouse';
        }
    }

    return '';
};



UniversalSompoHealth.prototype.get_member_type = function (adult, child) {
    var member_type;
    if (adult === 1) {
        member_type = '1 Adult';
        if (child === 1) {
            member_type = '1 Adult + 1 Child';
        } else if (child === 2) {
            member_type = '1 Adult + 2 Child';
        } else if (child === 3) {
            member_type = '1 Adult + 3 Child';
        } else if (child === 4) {
            member_type = '1 Adult + 4 Child';
        }
    } else if (adult === 2) {
        member_type = '2 Adult';
        if (child === 1) {
            member_type = '2 Adult + 1 Child';
        } else if (child === 2) {
            member_type = '2 Adult + 2 Child';
        } else if (child === 3) {
            member_type = '2 Adult + 3 Child';
        } else if (child === 4) {
            member_type = '2 Adult + 4 Child';
        }
    }
    return member_type;
};

UniversalSompoHealth.prototype.calculate_bmi = function (i) {
    var height = this.prepared_request['member_' + i + '_height'];
    var weight = this.prepared_request['member_' + i + '_weight'];

    var bmi = Math.round((weight / height / height) * 10000);
    this.prepared_request['member_' + i + '_bmi'] = bmi;
    this.processed_request['___member_' + i + '_bmi___'] = bmi;

};
UniversalSompoHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('UniversalSompoHealth is_valid_plan', 'start');
    var index = -1;
    var Plans = [
        {'code': "Basic", 'min_si': 99000, 'max_si': 200000},
        {'code': "Essential", 'min_si': 250000, 'max_si': 500000},
        {'code': "Privilege", 'min_si': 550000, 'max_si': 1000000}
    ];
    index = Plans.findIndex(x => x.code === planCode
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('UniversalSompoHealth is_valid_plan', 'End');
};
UniversalSompoHealth.prototype.premium_breakup_schema = {
    "base_premium": "basePremium",
    "net_premium": "premium",
    "service_tax": "serviceTax",
    "SBC": "SBC",
    "KKC": "KKC",
    "gross_premium": "grossPremium",
    "final_premium": "totalPremium"
};
module.exports = UniversalSompoHealth;