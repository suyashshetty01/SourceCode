/* 
 * Author : Chirag Modi
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Motor = require(appRoot + '/libs/Motor');
var fs = require('fs');
var config = require('config');

function AckoGeneral() {

}
util.inherits(AckoGeneral, Motor);

AckoGeneral.prototype.lm_request_single = {};
AckoGeneral.prototype.insurer_integration = {};
AckoGeneral.prototype.insurer_addon_list = [];
AckoGeneral.prototype.insurer = {};
AckoGeneral.prototype.insurer_date_format = 'YYYY-MM-DD';

//AckoGeneral.prototype.insurer_date_format = new Date();
//console.log()
AckoGeneral.prototype.insurer_product_api_pre = function () {

};
AckoGeneral.prototype.insurer_product_field_process_pre = function () {
    try {
        var objReplace = {
            'pa_owner_driver_si': '0',
            'pa_unnamed_passenger_si': '0',
            'pa_named_passenger_si': '0',
            'pa_paid_driver_si': '0',
            'dbmaster_insurer_vehicle_exshowroom': '0',
            'dbmaster_insurer_vehicle_insurer_bodytype': '0',
            'electrical_accessory': '0',
            'non_electrical_accessory': '0',
            'voluntary_deductible': '0',
            'is_antitheft_fit': 'False',
            "is_llpd": "True",
            "is_tppd": "false"
        };
        //for posp case
        var posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--POS_CONFIG_START-->', '<!--POS_CONFIG_FINISH-->', true);
        if (this.lm_request['is_posp'] === 'yes') {
            this.method_content = this.method_content.replace('<!--POS_CONFIG_START-->', '');
            this.method_content = this.method_content.replace('<!--POS_CONFIG_FINISH-->', '');
            /*var obj_posp = {
             '___email___': 'customercare@policyboss.com',
             '___mobile___': '8850766009',
             '___posp_mobile_no___': '8356844187'
             };*/
            var obj_posp = {
                '___posp_mobile_no___': '8356844187'
            };

            this.method_content = this.method_content.replaceJson(obj_posp);


            for (var k in this.lm_request) {
                if (k.indexOf('posp_') === 0) {
                    this.method_content = this.method_content.replace('___' + k + '___', this.lm_request[k]);
                }
            }
        } else {
            this.method_content = this.method_content.replace(posp_request_data, '');
        }

        if (this.lm_request['method_type'] === 'Proposal') {
            var posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--NO_NOMINEE_START-->', '<!--NO_NOMINEE_FINISH-->', true);
            if (this.lm_request['vehicle_registration_type'] === 'corporate') {
                this.method_content = this.method_content.replace(posp_request_data, '');
                this.method_content = this.method_content.replace('<!--NO_NOMINEE_START-->', '');
                this.method_content = this.method_content.replace('<!--NO_NOMINEE_FINISH-->', '');
                //this.prepared_request['first_name'] = this.lm_request['company_name'];
                //this.processed_request['___first_name___'] = this.prepared_request['first_name'];
                //this.prepared_request['email'] = this.lm_request['company_contact_person_email'];
                //this.processed_request['___email___'] = this.prepared_request['email'];
                //this.prepared_request['mobile'] = this.lm_request['company_contact_person_mobile'];
                //this.processed_request['___mobile___'] = this.prepared_request['mobile'];
                this.method_content = this.method_content.replace('___first_name___', this.lm_request['company_name']);
                this.method_content = this.method_content.replace('___middle_name___', '');
                this.method_content = this.method_content.replace('___last_name___', '');
                //this.method_content = this.method_content.replace('___nominee_name___', 'DOLLY GUPTA');
                //this.method_content = this.method_content.replace('___nominee_age___', '50');
                //this.method_content = this.method_content.replace('___nominee_relation___', 'wife');
                //this.method_content = this.method_content.replace('___email___', this.lm_request['company_contact_person_email']);
                //this.method_content = this.method_content.replace('___mobile___', this.lm_request['company_contact_person_mobile']);
                //this.method_content = this.method_content.replace('___gst_no___', this.lm_request['company_gst_no']);
            } else {
                this.method_content = this.method_content.replace('<!--NO_NOMINEE_START-->', '');
                this.method_content = this.method_content.replace('<!--NO_NOMINEE_FINISH-->', '');
                this.method_content = this.method_content.replace('___gst_no___', '');
            }
        }

        if (((this.lm_request['product_id'] === 1 && (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1)) || (this.lm_request['product_id'] === 10)) && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_policy_exist'] === 'no')
        {
            var d = new Date();
            d.setDate(d.getDate() - 90);
            var month = '' + (d.getMonth() + 1);
            var day = '' + d.getDate();
            var year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            var PPED = [year, month, day].join('-');
            this.method_content = this.method_content.replace('___policy_expiry_date___', PPED);
        }
        if (this.lm_request['product_id'] === 10 && (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP' || this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP')) {
            this.method_content = this.method_content.replace('___vehicle_insurance_subtype_2___', 'comprehensive');
        } else {
            this.method_content = this.method_content.replace('"tenure" : ___policy_od_tenure___,', '');
        }
        if (!(this.lm_request['method_type'] === 'Verification')) {
            //for tp

            this.method_content = this.method_content.replace(/___addon_package_name___/g, this.prepared_request['Plan_Code']);
            if (this.prepared_request['Plan_Name'] === 'TP') {
                this.method_content = this.method_content.replace('___vehicle_expected_idv___', "0");
            }
            if (parseInt(this.lm_request['electrical_accessory']) > 0) {
                this.method_content = this.method_content.replace('<!--electrical_accessory_start-->', "");
                this.method_content = this.method_content.replace('<!--electrical_accessory_end-->', "");
            } else {
                var txt_replace = this.find_text_btw_key(this.method_content, '<!--electrical_accessory_start-->', '<!--electrical_accessory_end-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
            }

            if (parseInt(this.lm_request['non_electrical_accessory']) > 0) {

                this.method_content = this.method_content.replace('<!--non_electrical_accessory_start-->', "");
                this.method_content = this.method_content.replace('<!--non_electrical_accessory_end-->', "");
            } else {
                var txt_replace = this.find_text_btw_key(this.method_content, '<!--non_electrical_accessory_start-->', '<!--non_electrical_accessory_end-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
            }
            if (parseInt(this.lm_request['pa_named_passenger_si']) > 0) {
                this.method_content = this.method_content.replace('<!--pa_named_passenger_si_start-->', "");
                this.method_content = this.method_content.replace('<!--pa_named_passenger_si_end-->', "");

            } else {
                var txt_replace = this.find_text_btw_key(this.method_content, '<!--pa_named_passenger_si_start-->', '<!--pa_named_passenger_si_end-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
            }


            if (parseInt(this.lm_request['pa_unnamed_passenger_si']) > 0) {
                this.method_content = this.method_content.replace('<!--pa_unnamed_passenger_si_start-->', "");
                this.method_content = this.method_content.replace('<!--pa_unnamed_passenger_si_end-->', "");
            } else {
                var txt_replace = this.find_text_btw_key(this.method_content, '<!--pa_unnamed_passenger_si_start-->', '<!--pa_unnamed_passenger_si_end-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }

            }

            if (parseInt(this.lm_request['pa_paid_driver_si']) > 0) {
                this.method_content = this.method_content.replace('<!--pa_paid_driver_si_start-->', "");
                this.method_content = this.method_content.replace('<!--pa_paid_driver_si_end-->', "");
            } else {
                var txt_replace = this.find_text_btw_key(this.method_content, '<!--pa_paid_driver_si_start-->', '<!--pa_paid_driver_si_end-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
            }
            if (parseInt(this.lm_request['pa_unnamed_passenger_si']) > 0) {
                this.method_content = this.method_content.replace('<!--pa_unnamed_passenger_si_start-->', "");
                this.method_content = this.method_content.replace('<!--pa_unnamed_passenger_si_end-->', "");
            } else {
                var txt_replace = this.find_text_btw_key(this.method_content, '<!--pa_unnamed_passenger_si_start-->', '<!--pa_unnamed_passenger_si_end-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
            }
            var const_addon_config = {
                'addon_zero_dep_cover': {
                    'start': '<!--is_Zero_Start-->',
                    'finish': '<!--is_Zero_END-->'
                },
                'addon_road_assist_cover': {
                    'start': '<!--is_RSA_Start-->',
                    'finish': '<!--is_RSA_END-->'
                },
                'is_llpd': {
                    'start': '<!--is_llpd_start-->',
                    'finish': '<!--is_llpd__end-->'
                },
                'addon_consumable_cover': {
                    'start': '<!--is_Consumables_Start-->',
                    'finish': '<!--is_Consumables_END-->'
                },
                'is_external_bifuel': {
                    'start': '<!--external_bio_fuel_kit_price_start-->',
                    'finish': '<!--external_bio_fuel_kit_price_end-->'
                }
            };


            if (this.prepared_request['product_id'] == '10') {
                for (var k in const_addon_config) {
                    var txt_replace = this.find_text_btw_key(this.method_content, const_addon_config[k]['start'], const_addon_config[k]['finish'], true);
                    if (txt_replace) {
                        this.method_content = this.method_content.replace(txt_replace, '');
                    }
                }
            } else {
                for (var k in const_addon_config) {
                    if (this.prepared_request[k] === "yes") {
                        this.method_content = this.method_content.replace(const_addon_config[k]['start'], "");
                        this.method_content = this.method_content.replace(const_addon_config[k]['finish'], "");

                    } else {
                        var txt_replace = this.find_text_btw_key(this.method_content, const_addon_config[k]['start'], const_addon_config[k]['finish'], true);
                        if (txt_replace) {
                            this.method_content = this.method_content.replace(txt_replace, '');
                        }
                    }
                }
            }

            var date_of_registration_year = this.lm_request["vehicle_registration_date"];
            // var year=date_of_registration_year.slice(4);

            var year = date_of_registration_year.substr(0, 4);
            this.prepared_request['registration_year'] = year;
            this.processed_request['___vehicle_registration_date_2___'] = year;
            this.prepared_request['vehicle_registration_date_2'] = year;
            //this.processed_request['___vehicle_registration_date___'] = year;
            //this.processed_request['___vehicle_registration_date___'] = year;
            console.log(this.method_content);
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.method_content = this.method_content.replace('"registration_year": ___vehicle_registration_date_2___,', '');
                this.method_content = this.method_content.replace('"registration_number": "___registration_no___",', '');
            }
            this.processed_request['___registration_no___'] = this.lm_request['registration_no'].replace(/\-/g, '');
            this.prepared_request['registration_no'] = this.processed_request['___registration_no___'];

        }


        if (this.lm_request['method_type'] === 'Proposal') {
            this.method_content = this.method_content.replace('___communication_pincode___', this.lm_request['communication_pincode']);
        }

        if (this.lm_request['method_type'] === 'Proposal' && this.lm_request['appointee_name'] === "") {
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--apointee_start-->', '<!--apointee_end-->', true);
            if (txt_replace) {
                this.method_content = this.method_content.replace(txt_replace, '');
            }

        } else {
            this.method_content = this.method_content.replace('<!--apointee_start-->', "");
            this.method_content = this.method_content.replace('<!--apointee_end-->', "");
        }

        if (this.lm_request['method_type'] === 'Proposal' && this.lm_request['financial_agreement_type'] == "0") {
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--financial_start-->', '<!--financial_end-->', true);
            if (txt_replace) {
                this.method_content = this.method_content.replace(txt_replace, '');
            }
        } else {
            this.method_content = this.method_content.replace('<!--financial_start-->', "");
            this.method_content = this.method_content.replace('<!--financial_end-->', "");
        }
        console.log(this.insurer_lm_request);
        console.log("*********" + this.method_content);
        var objRequest = this.insurer_lm_request;
        var obj_replace = {};
        for (var key in objReplace) {
            var value = objReplace[key];
            if (objRequest[key] === '' || objRequest[key] === '0' || !objRequest.hasOwnProperty(key)) {
                obj_replace['___' + key + '___'] = value;
            }
        }
        var objDefault = {
//        'dbmaster_insurer_rto_zone_code': 'A',
//        'dbmaster_insurer_rto_city_name': 'MUMBAI',
//        'dbmaster_previousinsurer_code': '8', //for icici
            'thankyouurl': this.pg_ack_url()
        };

        for (var key in objDefault) {
            this.prepared_request[key] = objDefault[key];
            this.processed_request['___' + key + '___'] = objDefault[key];
            /*
             if ((this.prepared_request.hasOwnProperty(key) && this.prepared_request[key] === "") || this.prepared_request.hasOwnProperty(key) === false) {
             
             }
             */
        }

        if (Object.keys(obj_replace).length > 0) {
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }
        this.method_content = this.method_content.replace(/\n|\t|\r/g, '');
        this.method_content = this.method_content.replace(/\s\s+/g, ' ');
        this.method_content = this.method_content.replace(/,]/g, ']');
        this.method_content = this.method_content.replace(/, ]/g, ']');
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
AckoGeneral.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
    if (specific_insurer_object.method.Method_Type === 'Idv') {
        obj_response_handler = this.idv_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
AckoGeneral.prototype.insurer_product_field_process_post = function () {

};
AckoGeneral.prototype.insurer_product_api_post = function () {

};
AckoGeneral.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;//
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');

        var Client = require('node-rest-client').Client;

        var client = new Client();
        if (specific_insurer_object.method.Method_Type === 'Proposal') {
            console.error("Acko Request Proposal::" + docLog.Insurer_Request);
        }
        console.log(docLog.Insurer_Request);
        var args = {
            data: docLog.Insurer_Request,
            headers: {"Content-Type": "application/json"}
        };
        console.log("acko--" + docLog.Insurer_Request);
        client.post(specific_insurer_object.method_file_url, args, function (data, response) {
            //console.log(data);
            /*var data = data.toString('ascii');
             console.log(data.toString('ascii'));
             //console.error('Acko',data);
             if (data.indexOf('{') > -1) {
             var objXml2Json = JSON.parse(data);
             var objResponseFull = {
             'err': null,
             'result': null,
             'raw': objXml2Json,
             'soapHeader': null,
             'objResponseJson': objXml2Json
             };
             } else {
             var objResponseFull = {
             'err': data,
             'result': null,
             'raw': data,
             'soapHeader': null,
             'objResponseJson': data
             };
             }*/

            var objResponseFull = {
                'err': null,
                'result': null,
                'raw': data,
                'soapHeader': null,
                'objResponseJson': data
            };

            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            if (specific_insurer_object.method.Method_Type === 'Idv') {
                objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
            }
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
AckoGeneral.prototype.idv_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);

        var Error_Msg = 'NO_ERR';
        //check error start

        //check error stop
        if (objResponseJson.hasOwnProperty('success') && objResponseJson.success === true) {
            var Idv_Breakup = this.get_const_idv_breakup();
            Idv_Breakup["Idv_Normal"] = Math.round(objResponseJson['result']['idv'] - 0);
            if (objResponseJson['result'].hasOwnProperty("min_idv")) {
                Idv_Breakup["Idv_Normal"] = Math.round((Math.round(objResponseJson['result']["min_idv"]) + Math.round(objResponseJson['result']["max_idv"])) / 2);
                Idv_Breakup["Idv_Min"] = Math.round(objResponseJson['result']["min_idv"]);
                Idv_Breakup["Idv_Max"] = Math.round(objResponseJson['result']["max_idv"]);
            } else {
                Idv_Breakup["Idv_Min"] = Math.round(Idv_Breakup["Idv_Normal"] * 0.95);
                Idv_Breakup["Idv_Max"] = Math.round(Idv_Breakup["Idv_Normal"] * 1.05);
            }
            Idv_Breakup["Exshowroom"] = 0;
            objServiceHandler.Premium_Breakup = Idv_Breakup;
            objServiceHandler.Insurer_Transaction_Identifier = '';



        } else {
            var Arr_Error_Msg = [];
            if (objResponseJson.hasOwnProperty('errors')) {
                for (var i in objResponseJson['errors']) {
                    if (objResponseJson['errors'][i].length > 0) {
                        Arr_Error_Msg.push(objResponseJson['errors'][i][0]['human']);
                    }
                }
            }
            if (Arr_Error_Msg.length > 0) {
                Error_Msg = Arr_Error_Msg.join(',');
            }

        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'idv_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
AckoGeneral.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('success') && objResponseJson['success'] == true)
        {

        } else {
            var Arr_Error_Msg = [];
            if (objResponseJson.hasOwnProperty('errors')) {
                for (var i in objResponseJson['errors']) {
                    if (objResponseJson['errors'][i].length > 0) {
                        Arr_Error_Msg.push(i + "::" + objResponseJson['errors'][i][0]['human'].toString());
                    }
                }
            }
            if (Arr_Error_Msg.length > 0) {
                Error_Msg = Arr_Error_Msg.join(',');
            }

        }
        //Checking IDV
        if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') === -1) {
            if (Error_Msg === 'NO_ERR' && this.prepared_request.hasOwnProperty('vehicle_expected_idv') && objResponseJson['result'].hasOwnProperty('idv')) {
                if (this.prepared_request['vehicle_expected_idv'] > 0 && (this.prepared_request['vehicle_expected_idv'] - 0) != (objResponseJson['result']['idv'] - 0)) {
                    Error_Msg = "LM_IDVMISMATCH_REQUEST_" + this.prepared_request['vehicle_expected_idv'] + "_RECEIVED_" + objResponseJson['result']['idv'].toString();
                }
            }
        }

        if (Error_Msg === 'NO_ERR') {
            var objInsurerPremiumJson = objResponseJson['result'];
            var plan_index = -1;
            //console.error('ACKODBG', this.processed_request['___addon_package_name___'], objInsurerPremiumJson['plan_selected']);
            for (var pi in objInsurerPremiumJson['plans']) {
                //console.error('ACKODBG_2', 'plan_id', objInsurerPremiumJson['plans'][pi]['plan_id']);
                if (objInsurerPremiumJson['plans'][pi]['plan_id'] == objInsurerPremiumJson['plan_selected']) {
                    plan_index = pi;
                    break;
                }
            }
            //console.error('ACKODBG_3', plan_index);
            var objPremiumService = objInsurerPremiumJson['plans'][plan_index]['discount'];
            console.log(JSON.stringify(objResponseJson['result']));
            for (var keyCover in objInsurerPremiumJson['plans'][plan_index]['covers']) {
                try {
                    var premium = objInsurerPremiumJson['plans'][plan_index]['covers'][keyCover]['premium'];
                    premium = (premium < 0) ? (0 - premium) : premium;
                    var cover_name = objInsurerPremiumJson['plans'][plan_index]['covers'][keyCover]['id'].toString();
                    //Object.assign(objPremiumService, JSON.parse('{"' + cover_name + '":""}'));
                    objPremiumService[cover_name] = this.round2Precision(premium - 0);
                } catch (e) {
                }
            }
            console.log(objPremiumService);
            var premium_breakup = this.get_const_premium_breakup();


            for (var key in this.premium_breakup_schema) {
                if (typeof this.premium_breakup_schema[key] === 'object') {
                    var group_final = 0, group_final_key = '';
                    for (var sub_key in this.premium_breakup_schema[key]) {
                        var premium_key = this.premium_breakup_schema[key][sub_key];
                        var premium_val = 0;
                        if (premium_key) {
                            premium_key = premium_key.toString().toLowerCase().replace(/ /g, '_');

                            if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                                premium_val = objPremiumService[premium_key];
                            }
                            premium_val = isNaN(premium_val) ? 0 : premium_val;
                            premium_breakup[key][sub_key] = premium_val;
                        }

                        if (sub_key.indexOf('_final_') > -1) {
                            group_final_key = sub_key;
                        } else if (sub_key.indexOf('_disc') > -1) {
                            group_final -= premium_val;
                        } else if (sub_key === "tp_cover_tppd") {
                            group_final -= premium_val;
                        } else {
                            group_final += premium_val;
                        }

                    }
                    premium_breakup[key][group_final_key] = group_final;

                } else {
                    var premium_key = this.premium_breakup_schema[key];
                    if (premium_key) {
                        premium_key = premium_key.toString().toLowerCase().replace(/ /g, '_');

                        var premium_val = 0;
                        if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                            premium_val = parseInt(objPremiumService[premium_key]['0']);
                        }
                        premium_val = isNaN(premium_val) ? 0 : premium_val;
                        premium_breakup[key] = premium_val;
                    }
                }
            }
            premium_breakup['net_premium'] = Math.round(objInsurerPremiumJson['plans'][plan_index]['net_premium'] - 0);
            premium_breakup['service_tax'] = Math.round(objInsurerPremiumJson['plans'][plan_index]['tax']['gst'] - 0);
            premium_breakup['final_premium'] = Math.round(objInsurerPremiumJson['plans'][plan_index]['gross_premium'] - 0);

            objServiceHandler.Premium_Breakup = premium_breakup;
            // objServiceHandler.Insurer_Transaction_Identifier = Customer.insurer_customer_identifier;

        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', ex, objServiceHandler);
    }
    return objServiceHandler;
};
AckoGeneral.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);

    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    try {
        var Error_Msg = 'NO_ERR';
        //console.error('ACKODBG1');
        if (objResponseJson.hasOwnProperty('success') && objResponseJson['success'] === true) {
            if (objResponseJson.result.hasOwnProperty('is_policy_ready_for_payment') && objResponseJson.result['is_policy_ready_for_payment'] == true) {

            } else {
                console.log("*********************************************************" + objResponseJson);
                Error_Msg = 'LM::is_policy_ready_for_payment::node_missing';
            }
        } else {
            var Arr_Error_Msg = [];
            if (objResponseJson.hasOwnProperty('errors')) {
                for (var i in objResponseJson['errors']) {
                    if (objResponseJson['errors'][i].length > 0) {
                        Arr_Error_Msg.push(i + "::" + objResponseJson['errors'][i][0]['human']);
                    }
                }
            }
            if (Arr_Error_Msg.length > 0) {
                Error_Msg = Arr_Error_Msg.join(',');
            }

        }

        if (Error_Msg === 'NO_ERR') {
            //console.error('ACKODBG', Error_Msg, objResponseJson.result['payment_link'], objResponseJson.result['quote_id']);
            var objInsurerPremiumJson = objResponseJson.result;
            var plan_index = -1;
            //console.error('ACKODBG', this.processed_request['___addon_package_name___'], objInsurerPremiumJson['plan_selected']);
            for (var pi in objInsurerPremiumJson['plans']) {
                //console.error('ACKODBG_2', 'plan_id', objInsurerPremiumJson['plans'][pi]['plan_id']);
                if (objInsurerPremiumJson['plans'][pi]['plan_id'] == objInsurerPremiumJson['plan_selected']) {
                    plan_index = pi;
                    break;
                }
            }
            //console.error('ACKODBG_3', plan_index);
            var is_idv_verified = false;
            if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                is_idv_verified = true;
            } else {
                var vehicle_expected_idv = (this.lm_request['vehicle_expected_idv'] - 0);
                var vehicle_received_idv = (objResponseJson['result']['idv'] - 0);
                is_idv_verified = (vehicle_expected_idv == vehicle_received_idv);
            }


            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], objResponseJson['result']['plans'][plan_index]['gross_premium']);
            if (is_idv_verified) {
                if (objPremiumVerification.Status) {
                    objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.result['quote_id'];//Insurer_Transaction_Identifier;

                    objServiceHandler.Payment.pg_data = {};
                    //objServiceHandler.Payment.pg_ack_url = this.pg_ack_url();
                    objServiceHandler.Payment.pg_url = objResponseJson.result['payment_link'];
                    objServiceHandler.Payment.pg_redirect_mode = 'GET';
                } else {
                    Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                }
            } else {
                Error_Msg = 'LM_IDV_MISMATCH_REQUEST_IDV_' + vehicle_expected_idv.toString() + '_RECEIVED_IDV_' + vehicle_received_idv.toString();
            }
        }
        //console.error('ACKODBG', objServiceHandler.Payment);
        objServiceHandler.Error_Msg = Error_Msg;
        //return objServiceHandler;
        //console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
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
AckoGeneral.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {

    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var objInsurerProduct = this;
        var Insurer_Id = specific_insurer_object['insurer_id'];

        var IdvMethod = this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Idv');
        specific_insurer_object.method = IdvMethod;
        if (specific_insurer_object.method.Service_File && fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
            specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
        } else {
            specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
        }
        var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + IdvMethod.Method_Request_File).toString();
        method_content = method_content.replace('___vehicle_expected_idv___', 0);
        var addon_package_name = '';
        if (this.prepared_request['product_id'] == 1) {
            addon_package_name = 'car_comprehensive';
        }
        if (this.prepared_request['product_id'] == 10) {
            addon_package_name = 'bike_comprehensive';
        }
        method_content = method_content.replace('___addon_package_name___', addon_package_name);
        this.method_content = method_content;
        this.insurer_product_field_process_pre();
        var request_replaced_data = this.method_content.replaceJson(this.processed_request);


        var logGuid = this.create_guid('ARN-');
        var docLog = {
            "Service_Log_Id": "",
            "Service_Log_Unique_Id": logGuid,
            "Request_Id": objProduct.docRequest.Request_Id,
            "User_Data_Id": objProduct.lm_request['udid'] - 0,
            "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
            "Insurer_Request": request_replaced_data,
            "Insurer_Response": "",
            "Insurer_Response_Core": "",
            "Premium_Breakup": null,
            "LM_Response": "",
            "Insurer_Transaction_Identifier": "",
            "Status": "pending",
            "Error_Code": "",
            "Is_Active": 1,
            "Created_On": new Date(),
            "Product_Id": objProduct.db_specific_product.Product_Id,
            "Insurer_Id": Insurer_Object.Insurer_ID,
            "Plan_Id": null,
            "Plan_Name": null,
            "Method_Type": "Idv",
            "Call_Execution_Time": 0
        };
        this.save_log(docLog);
        console.log('ServiceData');
        console.log(docLog.Insurer_Request);
        this.service_call(docLog, objProduct, Insurer_Object, specific_insurer_object);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', ex);
    }
};
AckoGeneral.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        var Error_Msg = 'NO_ERR';

        if (this.const_policy.pg_status === 'FAIL') {

        }
        if (this.const_policy.pg_status === 'SUCCESS') {
            if (objResponseJson['result'][0].status === 'VALID') {
                this.const_policy.transaction_status = 'SUCCESS';
                var product_name = 'CAR';
                if (this.lm_request['product_id'] === 10) {
                    product_name = 'TW';
                }
                this.const_policy.policy_number = objResponseJson['result'][0].policy_number;
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number.replace('/', '') + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                this.const_policy.policy_url = pdf_web_path_portal;


                var https = require('https');
                var insurer_pdf_url = objResponseJson['result'][0].document;
                try {
                    var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                    //var file_portal = fs.createWriteStream(pdf_sys_loc_portal);
                    var request = https.get(insurer_pdf_url, function (response) {
                        response.pipe(file_horizon);
                        //response.pipe(file_portal);
                    });
                } catch (ep) {
                    console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
                }
                this.const_policy.insurer_policy_url = insurer_pdf_url;
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
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
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
AckoGeneral.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    try {
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
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call', ex);
    }
};
AckoGeneral.prototype.pdf_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    try {
        var Error_Msg = 'NO_ERR';

        var objPremiumService = objResponseJson;
        if (!objPremiumService.hasOwnProperty('downloadFileResponse')) {
            Error_Msg = 'LM_EMPTY_RESPONSE';
        } else {
            objPremiumService = objPremiumService['downloadFileResponse']['return'];
            if (objPremiumService.hasOwnProperty('errorMsg')) {
                Error_Msg = objPremiumService['errorMsg'];
            }
        }

        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            if (objPremiumService.hasOwnProperty('downloadFileResponse') && objPremiumService['downloadFileResponse'] !== '') {
                var product_name = 'CAR';
                if (this.lm_request['product_id'] === 10) {
                    product_name = 'TW';
                }
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'] + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
                var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(objPremiumService['downloadFileResponse']['return']['bytes'], 'base64');
                fs.writeFileSync(pdf_sys_loc_horizon, binary);
                //fs.writeFileSync(pdf_sys_loc_portal, binary);
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
        return objServiceHandler;

    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex);
        objServiceHandler.Error_Msg = JSON.stringify(ex);
        return objServiceHandler;
    }

};
AckoGeneral.prototype.pg_response_handler = function () {
    try {
        var objInsurerProduct = this;
        this.const_policy.transaction_status = '';
        this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_get['quoteId'];

        if (objInsurerProduct.lm_request.pg_get['status'] === 'pass') {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = '';
            this.const_policy.pg_reference_number_1 = objInsurerProduct.lm_request.pg_get['policyId'];
        } else if (objInsurerProduct.lm_request.pg_get['status'] === 'fail') { // fail code
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};

AckoGeneral.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "own_damage",
        "od_elect_access": "electronic_accessories",
        "od_non_elect_access": "non_electronic_accessories",
        "od_cng_lpg": "bifuel_external",
        "od_disc_ncb": "ncb_discount",
        "od_disc_vol_deduct": "voluntary_deductible_discount",
        "od_disc_anti_theft": "anti_theft_discount",
        "od_disc_aai": "automobile_association_discount",
        "od_loading": "",
        "od_disc": "insurer_discount",
        //"od_disc_tppd": "tppd_discount",
        "od_final_premium": ""
    },
    "liability": {
        "tp_basic": "third_party_liability",
        "tp_cover_owner_driver_pa": "pa_owner_driver",
        "tp_cover_unnamed_passenger_pa": "pa_unnamed_passengers",
        "tp_cover_named_passenger_pa": "pa_named_passengers",
        "tp_cover_paid_driver_pa": "pa_paid_driver",
        "tp_cover_paid_driver_ll": "ll_paid_driver",
        "tp_cover_tppd": "tppd_discount",
        "tp_cng_lpg": "third_party_cng_lpg",
        "tp_final_premium": ""
    },
    "addon": {
        "addon_zero_dep_cover": "zero_depreciation",
        "addon_road_assist_cover": "rsa",
        "addon_ncb_protection_cover": null,
        "addon_engine_protector_cover": null,
        "addon_invoice_price_cover": null,
        "addon_key_lock_cover": null,
        "addon_consumable_cover": "consumables",
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": null,
        "addon_personal_belonging_loss_cover": null,
        "addon_inconvenience_allowance_cover": null,
        "addon_medical_expense_cover": null,
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": 0
    },
    "net_premium": "net_premium",
    "service_tax": "gst",
    "final_premium": "gross_premium"
};
module.exports = AckoGeneral;






