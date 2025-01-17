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

function BajajAllianzMotor() {

}
util.inherits(BajajAllianzMotor, Motor);

BajajAllianzMotor.prototype.lm_request_single = {};
BajajAllianzMotor.prototype.insurer_integration = {};
BajajAllianzMotor.prototype.insurer_addon_list = [];
BajajAllianzMotor.prototype.insurer = {};
BajajAllianzMotor.prototype.insurer_date_format = 'DD-MMM-YYYY';


BajajAllianzMotor.prototype.insurer_product_api_pre = function () {

};
BajajAllianzMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        if ((this.lm_request['is_external_bifuel'] === 'yes' || this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "C") && (this.lm_request['product_id'] === 10 || this.lm_request['product_id'] === 1)) {
            this.method_content = "";
        }
        /*if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '1CH_4TP') {
         this.method_content = this.method_content.toString().replace('___policy_tenure___', '___policy_od_tenure___');
         }*/
        if (this.lm_request['vehicle_insurance_type'] === 'new' && [1, 10].indexOf(this.lm_request['product_id']) > -1 && this.lm_request['is_pa_od'] === 'yes') {
            if (this.lm_request.hasOwnProperty('cpa_tenure') && this.lm_request['cpa_tenure'] !== null && this.lm_request['cpa_tenure'] !== '' && this.lm_request['cpa_tenure'] !== undefined) {
                if (parseInt(this.lm_request['cpa_tenure']) > 0) {
                    this.method_content = this.method_content.toString().replace('___policy_tenure___', this.lm_request['cpa_tenure']);
                } else {
                    this.method_content = this.method_content.toString().replace('___policy_tenure___', 1);
                }
            } else {
                this.method_content = this.method_content.toString().replace('___policy_tenure___', 1);
            }
        }
        if (this.lm_request['is_tppd'] === 'yes' || this.prepared_request['is_tppd'] === 'yes' || this.processed_request['___is_tppd___'] === 'yes') {
            this.method_content = this.method_content.toString().replace('<!--TPPD_REQ-->', '<ns2:WeoMotGenParamUser><ns2:paramDesc>TPPD_RES</ns2:paramDesc><ns2:paramRef>TPPD_RES</ns2:paramRef></ns2:WeoMotGenParamUser>');
        }
        if (this.lm_request['method_type'] === 'Premium') {
            this.prepared_request['registration_no'] = "";
            this.processed_request['___registration_no___'] = this.prepared_request['registration_no_1'] + "-" + this.prepared_request['registration_no_2'];
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['method_type'] === 'Proposal') {
            this.prepared_request['registration_no'] = "NEW";
            this.processed_request['___registration_no___'] = "NEW";
        }
        if (this.lm_request['product_id'] === 12) {
            if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                this.method_content = this.method_content.toString().replace('___is_claim_exists___', '1');
            }
            if (this.lm_request['geographicalareaext'] === "no") {
                this.method_content = this.method_content.toString().replace('___Geographical_Extension___', 0);
            } else {
                this.method_content = this.method_content.toString().replace('___Geographical_Extension___', 1);
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['method_type'] === 'Proposal') {
                this.method_content = this.method_content.toString().replace('___dbmaster_previousinsurer_code___', 1);
            }
        }
        if (this.lm_request['vehicle_registration_type'] === 'corporate') {
            if (this.lm_request['method_type'] === 'Proposal') {
                //this.prepared_request['company_name'] = this.lm_request['company_name'];
                //this.processed_request['___company_name___'] = this.prepared_request['company_name'];
                //this.prepared_request['email'] = this.lm_request['company_contact_person_email'];
                //this.processed_request['___email___'] = this.prepared_request['email'];
                //this.prepared_request['mobile'] = this.lm_request['company_contact_person_mobile'];
                //this.processed_request['___mobile___'] = this.prepared_request['mobile'];
                this.method_content = this.method_content.replace('___salutation___', '');
                this.method_content = this.method_content.replace('___first_name___', this.lm_request['company_name']);
                this.method_content = this.method_content.replace('___middle_name___', '');
                this.method_content = this.method_content.replace('___last_name___', '');
                this.method_content = this.method_content.replace('___birth_date___', '');
                this.method_content = this.method_content.replace('___occupation___', '');
                //this.method_content = this.method_content.replace('___email___', this.lm_request['company_contact_person_email']);
                //this.method_content = this.method_content.replace('___mobile___', this.lm_request['company_contact_person_mobile']);
            }
        } else {
            this.method_content = this.method_content.replace('___company_name___', '');
        }

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
            'is_antitheft_fit': 'False'
        };
        console.log(this.insurer_lm_request);
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

        if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP" && this.lm_request['method_type'] === 'Proposal') {
            this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
            this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
            this.prepared_request['tp_policy_tenure'] = this.lm_request['saod_tp_tenure'];
            this.processed_request['___tp_policy_tenure___'] = this.prepared_request['tp_policy_tenure'];
            var tp_start_date = (this.lm_request['tp_start_date'].split("-"))[1] + '-' + (this.lm_request['tp_start_date'].split("-"))[0] + '-' + (this.lm_request['tp_start_date'].split("-"))[2];
            this.prepared_request['tp_start_date'] = this.date_format(tp_start_date, this.insurer_date_format);
            this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
            var tp_end_date = (this.lm_request['tp_end_date'].split("-"))[1] + '-' + (this.lm_request['tp_end_date'].split("-"))[0] + '-' + (this.lm_request['tp_end_date'].split("-"))[2];
            this.prepared_request['tp_end_date'] = this.date_format(tp_end_date, this.insurer_date_format);
            this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
            this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Code'];
            this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
            this.prepared_request['tp_policy_address'] = this.insurer_master.tp_insurer.pb_db_master['PreviousInsurer_Address'];
            this.processed_request['___tp_policy_address___'] = this.prepared_request['tp_policy_address'];
            var extcol36 = this.processed_request['___pre_policy_start_date___'] + "~" + this.processed_request['___tp_insurer_code___'] + "~" + this.processed_request['___tp_policy_address___'] + "~" + this.processed_request['___tp_policy_number___'] + "~" + this.processed_request['___tp_end_date___'] + "~0~" + this.processed_request['___tp_policy_tenure___'] + "~" + this.processed_request['___tp_start_date___'] + "~";
            console.log("jyoti bajaj extcol36 :", extcol36);
            this.prepared_request['tp_policy_details'] = extcol36;
            this.processed_request['___tp_policy_details___'] = this.prepared_request['tp_policy_details'];
            this.method_content = this.method_content.toString().replace('___tp_policy_details___', extcol36);
        } else {
            this.prepared_request['tp_policy_details'] = '';
            this.processed_request['___tp_policy_details___'] = this.prepared_request['tp_policy_details'];
            this.method_content = this.method_content.toString().replace('___tp_policy_details___', '');
        }

        if (this.lm_request['product_id'] == '10') {
            var vehicle_insurance_subtype_2 = {"1CH_0TP": "1802", "1OD_0TP": "1871", "0CH_1TP": "1806", "0CH_5TP": "NA", "1CH_4TP": "1826", "5CH_0TP": "NA", "2CH_0TP": "1843", "3CH_0TP": "1843"};
            this.prepared_request['vehicle_insurance_subtype_2'] = vehicle_insurance_subtype_2[this.lm_request['vehicle_insurance_subtype']];
            this.processed_request['___vehicle_insurance_subtype_2___'] = this.prepared_request['vehicle_insurance_subtype_2'];
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            this.prepared_request['policy_expiry_date'] = '';
            this.processed_request['___policy_expiry_date___'] = this.prepared_request['policy_expiry_date'];
        }

        if (this.lm_request['product_id'] == '1' && this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
            this.prepared_request['vehicle_insurance_subtype_2'] = "1870";
            this.processed_request['___vehicle_insurance_subtype_2___'] = this.prepared_request['vehicle_insurance_subtype_2'];
            this.method_content = this.method_content.toString().replace('<ns2:product4digitCode></ns2:product4digitCode>', '<ns2:product4digitCode>1870</ns2:product4digitCode>');
        }
        var policy_end_date = this.policy_end_date();

        var vehicle_age = this.vehicle_age_year();

        if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer') {
            if (this.prepared_request['dbmaster_pb_plan_name'] == 'Basic' || this.prepared_request['dbmaster_pb_plan_name'] == 'TP') {
                this.prepared_request['addon_package_name'] = '';
                this.processed_request['___addon_package_name___'] = '';
            } else {
                let arr_addon_package_name = {
                    'Drive_Assure_Economy': 'DRIVE_ASSURE_PACK',
                    'Drive_Assure_Economy_Plus': 'DRIVE_ASSURE_PACK_PLUS',
                    'Drive_Assure_Drivesmart_Premium': 'TELEMATICS_PREMIUM',
                    'Drive_Assure_Drivesmart_Prestige': 'TELEMATICS_PRESTIGE'
                };
                let addon_package_name = arr_addon_package_name[this.prepared_request['dbmaster_pb_plan_name']];
                this.prepared_request['addon_package_name'] = addon_package_name;
                this.processed_request['___addon_package_name___'] = addon_package_name;
            }
        }
        if (false && this.lm_request['method_type'] === 'Premium' && vehicle_age > 5 && this.prepared_request['dbmaster_pb_plan_name'] !== "") {
            this.method_content = '';
        }
        if (this.lm_request['method_type'] === 'Premium' && vehicle_age > 5 && this.prepared_request['Plan_Name'] !== "Basic" && (this.prepared_request['Plan_Name'] === "Drive_Assure_Pack" || this.prepared_request['Plan_Name'] === "Drive_Assure_Economy" || this.prepared_request['Plan_Name'] === "Drive_Assure_Economy_Plus" || this.prepared_request['Plan_Name'] === "Drive_Assure_Drivesmart_Premium" || this.prepared_request['Plan_Name'] === "Drive_Assure_Drivesmart_Prestige")) {
            this.method_content = 'PB_DECLINED';
        }
        if ((this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) && this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_policy_exist'] === 'no') {
            var moment = require('moment');
            this.method_content = this.method_content.replace('___is_claim_exists___', '1');
            this.method_content = this.method_content.replace('___previous_policy_number___', '');
            this.method_content = this.method_content.replace('___vehicle_ncb_current___', '');
            this.method_content = this.method_content.replace('___dbmaster_previousinsurer_code___', 0);
            this.method_content = this.method_content.replace('___policy_expiry_date___', (moment().subtract(91, "days").format("DD-MMM-YYYY")));

            var DayDiff = moment(this.processed_request['___policy_start_date___'], 'DD-MMM-YYYY').diff((moment().format('DD-MMM-YYYY')), 'days')
            if (DayDiff < 2) {
                if (this.prepared_request.hasOwnProperty('vehicle_insurance_subtype') && this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                    //this.method_content = this.method_content.replace('___policy_start_date___', (moment(this.processed_request['___policy_start_date___'], 'DD-MMM-YYYY').add(1, "days").format("DD-MMM-YYYY")));
                    //this.method_content = this.method_content.replace('___policy_end_date___', (moment(this.processed_request['___policy_end_date___'], 'DD-MMM-YYYY').add(1, "days").format("DD-MMM-YYYY")));
                    this.prepared_request['policy_start_date'] = (moment(this.processed_request['___policy_start_date___'], 'DD-MMM-YYYY').add(1, "days").format("DD-MMM-YYYY"));
                    this.processed_request['___policy_start_date___'] = this.prepared_request['policy_start_date'];
                    this.prepared_request['policy_end_date'] = (moment(this.processed_request['___policy_end_date___'], 'DD-MMM-YYYY').add(1, "days").format("DD-MMM-YYYY"));
                    this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];
                } else {
                    //this.method_content = this.method_content.replace('___policy_start_date___', (moment(this.processed_request['___policy_start_date___'], 'DD-MMM-YYYY').add(2, "days").format("DD-MMM-YYYY")));
                    //this.method_content = this.method_content.replace('___policy_end_date___', (moment(this.processed_request['___policy_end_date___'], 'DD-MMM-YYYY').add(2, "days").format("DD-MMM-YYYY")));
                    this.prepared_request['policy_start_date'] = (moment(this.processed_request['___policy_start_date___'], 'DD-MMM-YYYY').add(2, "days").format("DD-MMM-YYYY"));
                    this.processed_request['___policy_start_date___'] = this.prepared_request['policy_start_date'];
                    this.prepared_request['policy_end_date'] = (moment(this.processed_request['___policy_end_date___'], 'DD-MMM-YYYY').add(2, "days").format("DD-MMM-YYYY"));
                    this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];
                }
            }
        } else {
            this.method_content = this.method_content.toString().replace('___policy_end_date___', policy_end_date);
        }
        /*if (this.lm_request['is_pa_od'] === "no") {
         this.method_content = this.method_content.replace('___policy_tenure___', 0);
         }*/
        if (this.lm_request['is_pa_od'] === "yes") {
            this.method_content = this.method_content.replace('___pa_od_1___', '');
        } else {
            this.method_content = this.method_content.replace('___policy_tenure___', 0);
            if ((this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') && this.lm_request.hasOwnProperty('cpa_opt_reason')) {
                this.method_content = this.method_content.replace('___pa_od_1___', this.lm_request['cpa_opt_reason']);
            } else {
                this.method_content = this.method_content.replace('___pa_od_1___', 'DRVL');//ACPA
            }
        }

        //posp start date 14-June-21 Chirag Modi

        if (this.method_content.toString().indexOf('POS_CONFIG_START') > -1) {
            if ((this.lm_request['ss_id'] - 0) == 8105) {
                this.lm_request['is_posp'] = 'yes';
                this.lm_request['posp_pan_no'] = 'ATIPM8175G';
            }
            let posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--POS_CONFIG_START-->', '<!--POS_CONFIG_FINISH-->', false);
            if (this.lm_request['is_posp'] === 'yes') {
                this.method_content = this.method_content.replace('___posp_pan_no___', this.lm_request['posp_pan_no']);
            } else {
                this.method_content = this.method_content.replace(posp_request_data, '');
            }
        }

        if (this.lm_request['is_posp'] === 'yes') {
            //"userid": "webservice.pos@landmarkinsurance.com",
            //"password": "L@ndMark1118",
            this.prepared_request['insurer_integration_service_user'] = 'webservice.pos@landmarkinsurance.com';
            this.processed_request['___insurer_integration_service_user___'] = 'webservice.pos@landmarkinsurance.com';
            this.prepared_request['insurer_integration_service_password'] = 'L@ndMark1118';
            this.processed_request['___insurer_integration_service_password___'] = 'L@ndMark1118';
            this.method_content = this.method_content.replace('___insurer_integration_service_user___', 'webservice.pos@landmarkinsurance.com');
            this.method_content = this.method_content.replace('___insurer_integration_service_password___', 'L@ndMark1118');
        } else {
            //"userid": "webservice@landmarkinsurance.com",
            //"password": "August@22",
            this.prepared_request['insurer_integration_service_user'] = 'webservice@landmarkinsurance.com';
            this.processed_request['___insurer_integration_service_user___'] = 'webservice@landmarkinsurance.com';
            this.prepared_request['insurer_integration_service_password'] = 'August@22';
            this.processed_request['___insurer_integration_service_password___'] = 'August@22';
            this.method_content = this.method_content.replace('___insurer_integration_service_user___', 'webservice@landmarkinsurance.com');
            this.method_content = this.method_content.replace('___insurer_integration_service_password___', 'August@22');
        }

        //posp finish
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
BajajAllianzMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
    /*if (specific_insurer_object.method.Method_Type === 'Customer') {
     obj_response_handler = this.customer_response_handler(objResponseJson);
     }*/
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
BajajAllianzMotor.prototype.insurer_product_field_process_post = function () {

};
BajajAllianzMotor.prototype.insurer_product_api_post = function () {

};
BajajAllianzMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;//
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        // var PostData = JSON.parse(docLog.Insurer_Request);

//Example POST method invocation 
        var Client = require('node-rest-client').Client;

        var client = new Client();
        if ((this.lm_request['is_external_bifuel'] === 'yes' || this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "C") && this.lm_request['product_id'] !== 12) {
            objResponseFull = {
                'err': 'Executable only for Petrol and Diesel',
                'result': 'Executable only for Petrol and Diesel',
                'raw': null,
                'soapHeader': null,
                'objResponseJson': null
            };
            console.error('Exception', 'BajajAllianz', 'ServiceCall', 'Executable only for Petrol and Diesel');
            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
        } else {
            if (this.lm_request['product_id'] === 10 && (specific_insurer_object.method.Method_Type === 'Premium' || specific_insurer_object.method.Method_Type === 'Idv') && (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP' || this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP')) {
                docLog.Insurer_Request = docLog.Insurer_Request.replace('calculateMotorPremiumSig', 'calculatePremiumWrapper1843');
                docLog.Insurer_Request = docLog.Insurer_Request.replace('calculateMotorPremiumSig', 'calculatePremiumWrapper1843');
            }
// set content-type header and data as json in args parameter 
            console.log(docLog.Insurer_Request);
            var args = {
                data: docLog.Insurer_Request,
                headers: {"Content-Type": "text/xml"}
            };
            if (specific_insurer_object.method.Method_Type === 'Pdf') {
                args = {
                    data: docLog.Insurer_Request,
                    headers: {"Content-Type": "application/json"}
                };
                if (config.environment.name === 'Production') {
                    specific_insurer_object.method_file_url = 'http://webservices.bajajallianz.com/BjazDownloadPDFWs/policypdfdownload';
                } else {
                    specific_insurer_object.method_file_url = 'http://webservicesint.bajajallianz.com/BjazDownloadPDFWs/policypdfdownload';
                }
                //http://webservicesdev.bajajallianz.com/BjazDownloadPDFWs/policypdfdownload
            }
            client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                var objResponseFull = {};
                var strResp = '';
                var objXml2Json = '';
                try {
                    strResp = JSON.stringify(data);
                    console.error('Log', 'Exception', 'BajajService', data, strResp);

                    strResp = strResp.replace(/\$/g, 'attr');
                    strResp = strResp.replace(/typ:/g, '');
                    strResp = strResp.replace(/m:/g, '');
                    strResp = strResp.replace(/env:/g, '');
                    objXml2Json = JSON.parse(strResp);

                    objResponseFull = {
                        'err': null,
                        'result': null,
                        'raw': strResp,
                        'soapHeader': null,
                        'objResponseJson': (specific_insurer_object.method.Method_Type === 'Pdf') ? objXml2Json : objXml2Json['Envelope']['Body']
                    };
                } catch (ex) {
                    objResponseFull = {
                        'err': 'Invalid_Response',
                        'result': data,
                        'raw': strResp,
                        'soapHeader': null,
                        'objResponseJson': null
                    };
                    console.error('Exception', 'BajajAllianz', 'ServiceCall', ex, data, objXml2Json);
                }
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                if (specific_insurer_object.method.Method_Type === 'Idv') {
                    objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                }
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }


};
BajajAllianzMotor.prototype.idv_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);

        objError = objResponseJson['calculateMotorPremiumSigResponse']['pError_out'];


        var Error_Msg = 'NO_ERR';
        //check error start

        //check error stop
        if (objError === '') {
            if (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) {
                if (this.prepared_request['registration_no_1'] === "HP" && this.prepared_request['registration_no_2'] === "40") {
                    Error_Msg = 'Bajaj Allianz - RTO: HP - 40 is blocked';
                }
            }
            if (this.lm_request['product_id'] === 1) {
                if (parseInt(objResponseJson['calculateMotorPremiumSigResponse']['premiumDetailsOut_out']['totalIev']['_']) > 5000000) {
                    Error_Msg = 'Bajaj Allianz : IDV is more than 50 lacs SO NO QUOTES';
                }
            }
            if (Error_Msg === "NO_ERR") {
                var Idv_Breakup = this.get_const_idv_breakup();
                if (this.lm_request['product_id'] === 12) {
                    //Idv_Breakup["Idv_Normal"] = Math.round(objResponseJson['calculateMotorPremiumSigResponse']['premiumDetailsOut_out']['totalIev']['_'] - 0);
                    //Idv_Breakup["Idv_Min"] = Math.round(Idv_Breakup["Idv_Normal"] * 0.90);
                    //Idv_Breakup["Idv_Max"] = Math.round(Idv_Breakup["Idv_Normal"] * 1.10);
                    Idv_Breakup["Idv_Min"] = Math.round(objResponseJson['calculateMotorPremiumSigResponse']['premiumDetailsOut_out']['totalIev']['_'] - 0);
                    Idv_Breakup["Idv_Max"] = Math.floor(Idv_Breakup["Idv_Min"] * 1.10);
                    Idv_Breakup["Idv_Normal"] = Math.round((Idv_Breakup["Idv_Min"] + Idv_Breakup["Idv_Max"]) / 2);
                    Idv_Breakup["Exshowroom"] = 0;
                } else {
                    //we assume idv at 80% , so setting range from 80 min and 120 max
                    Idv_Breakup["Idv_Min"] = Math.round(objResponseJson['calculateMotorPremiumSigResponse']['premiumDetailsOut_out']['totalIev']['_'] - 0);
                    //Idv_Breakup["Idv_Normal"] = Math.round(Idv_Breakup["Idv_Min"] * 100 / 90);
                    //Idv_Breakup["Idv_Max"] = Math.floor(Idv_Breakup["Idv_Normal"] * 1.10);
                    Idv_Breakup["Idv_Max"] = Math.floor(Idv_Breakup["Idv_Min"] * 1.10);
                    Idv_Breakup["Idv_Normal"] = Math.round((Idv_Breakup["Idv_Min"] + Idv_Breakup["Idv_Max"]) / 2);
                    Idv_Breakup["Exshowroom"] = 0;
                }
                objServiceHandler.Premium_Breakup = Idv_Breakup;
                objServiceHandler.Insurer_Transaction_Identifier = '';
            }
        } else {
            Error_Msg = objError.WeoTygeErrorMessageUser.errText.toString();
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'idv_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
BajajAllianzMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        objError = objResponseJson['calculateMotorPremiumSigResponse']['pError_out'];
        var Error_Msg = 'NO_ERR';
        //check error start
        //check error start
        //check error stop
        if (objError !== '') {
            Error_Msg = objError['WeoTygeErrorMessageUser']['errText'];
        }
        if (this.lm_request['product_id'] === 12) {
            if (this.lm_request.hasOwnProperty('vehicle_class')) {
                if (this.lm_request['vehicle_class'] === "gcv") {
                    if (this.prepared_request.hasOwnProperty('dbmaster_insurer_vehicle_seatingcapacity')) {
                        if (this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity'] > 6) {
                            Error_Msg = "WE are not allowing Bus -Fail";
                        }
                    }
                }
            }
        }

        if (Error_Msg === 'NO_ERR') {
            var objPremiumService = {};
            //main summary
            var objInsurerPremiumJson = objResponseJson['calculateMotorPremiumSigResponse']['premiumDetailsOut_out'];
            for (var keyCover in objInsurerPremiumJson) {
                try {
                    var premium = objInsurerPremiumJson[keyCover]['_'];
                    premium = (premium < 0) ? (0 - premium) : premium;
                    var cover_name = keyCover.toString().toLowerCase().replace(/ /g, '_');
                    //Object.assign(objPremiumService, JSON.parse('{"' + cover_name + '":""}'));
                    objPremiumService[cover_name] = this.round2Precision(premium - 0);
                } catch (e) {
                }
            }
            //breakup
            var objInsurerPremiumJson = objResponseJson['calculateMotorPremiumSigResponse']['premiumSummeryList_out']['WeoMotPremiumSummaryUser'];
            for (var keyCover in objInsurerPremiumJson) {
                try {
                    if (objInsurerPremiumJson[keyCover]['paramDesc'] === "Basic Own Damage 1") {
                        objInsurerPremiumJson[keyCover]['paramDesc'] = "Basic Own Damage";
                    }
                    var premium = 0;
                    if (keyCover === "attr" && this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
                        if (!isNaN(objInsurerPremiumJson['od'] - 0)) {
                            premium += objInsurerPremiumJson['od'] - 0;
                        }
                        if (!isNaN(objInsurerPremiumJson['act'] - 0)) {
                            premium += objInsurerPremiumJson['act'] - 0;
                        }

                        premium = (premium < 0) ? (0 - premium) : premium;
                        var cover_name = objInsurerPremiumJson['paramDesc'].toString().toLowerCase().replace(/ /g, '_');
                        objPremiumService[cover_name] = this.round2Precision(premium - 0);
                    } else {
                        if (this.lm_request['product_id'] === 12 && objInsurerPremiumJson[keyCover] && objInsurerPremiumJson[keyCover]['paramRef'] && objInsurerPremiumJson[keyCover]['paramRef'] === 'CNG') {
                            var cover_name = objInsurerPremiumJson[keyCover]['paramDesc'].toString().toLowerCase().replace(/ /g, '_');
                            if (!isNaN(objInsurerPremiumJson[keyCover]['od'] - 0)) {
                                premium = 0;
                                premium += objInsurerPremiumJson[keyCover]['od'] - 0;
                                premium = (premium < 0) ? (0 - premium) : premium;
                                cover_name = objInsurerPremiumJson[keyCover]['paramDesc'].toString().toLowerCase().replace(/ /g, '_');
                                objPremiumService['od_' + cover_name] = this.round2Precision(premium - 0);
                            }
                            if (!isNaN(objInsurerPremiumJson[keyCover]['act'] - 0)) {
                                premium = 0;
                                premium += objInsurerPremiumJson[keyCover]['act'] - 0;
                                premium = (premium < 0) ? (0 - premium) : premium;
                                cover_name = objInsurerPremiumJson[keyCover]['paramDesc'].toString().toLowerCase().replace(/ /g, '_');
                                objPremiumService['tp_' + cover_name] = this.round2Precision(premium - 0);
                            }
                        } else {
                            if ((objInsurerPremiumJson[keyCover].hasOwnProperty('od')) && (!isNaN(objInsurerPremiumJson[keyCover]['od'] - 0))) {
                                premium += objInsurerPremiumJson[keyCover]['od'] - 0;
                            } else {
                                premium += objInsurerPremiumJson['od'] - 0;
                            }

                            if ((objInsurerPremiumJson[keyCover].hasOwnProperty('act')) && (!isNaN(objInsurerPremiumJson[keyCover]['act'] - 0))) {
                                premium += objInsurerPremiumJson[keyCover]['act'] - 0;
                            } else {
                                premium += objInsurerPremiumJson['act'] - 0;
                            }

                            premium = (premium < 0) ? (0 - premium) : premium;
                            var cover_name;//= objInsurerPremiumJson[keyCover]['paramDesc'].toString().toLowerCase().replace(/ /g, '_');
                            if (objInsurerPremiumJson[keyCover].hasOwnProperty('paramDesc')) {
                                cover_name = objInsurerPremiumJson[keyCover]['paramDesc'].toString().toLowerCase().replace(/ /g, '_');
                            } else {
                                cover_name = objInsurerPremiumJson['paramDesc'].toString().toLowerCase().replace(/ /g, '_');
                            }
                            objPremiumService[cover_name] = this.round2Precision(premium - 0);
                        }
                    }
                } catch (e) {
                }
            }
            var pDetariffObj_inout = objResponseJson['calculateMotorPremiumSigResponse']['pDetariffObj_inout'];
            if (pDetariffObj_inout && pDetariffObj_inout.hasOwnProperty('extCol22') && (pDetariffObj_inout['extCol22']['_'] - 0) > 0) { //loading
                objPremiumService['addloadprem'] += pDetariffObj_inout['extCol22']['_'] - 0;
            }

            console.log(objPremiumService);
            var premium_breakup = this.get_const_premium_breakup();

            if (this.lm_request['is_tppd'] === "yes" && objPremiumService['restrict_tppd'] > 0) {
                objPremiumService['basic_third_party_liability'] = objPremiumService['basic_third_party_liability'] + objPremiumService['restrict_tppd'];
            }

            for (var key in this.premium_breakup_schema) {
                if (typeof this.premium_breakup_schema[key] === 'object') {
                    var group_final = 0, group_final_key = '';
                    for (var sub_key in this.premium_breakup_schema[key]) {
                        if (this.lm_request['product_id'] === 12 && false) {
                            if (sub_key === 'od_disc' && objPremiumService.hasOwnProperty('commercial_discount')) {
                                this.premium_breakup_schema[key][sub_key] = "commercial discount";
                            }
                        }
                        if (sub_key === 'od_disc') {
                            if (objPremiumService.hasOwnProperty('commercial_discount')) {
                                this.premium_breakup_schema[key][sub_key] = "commercial discount";
                            }
                            if (objPremiumService.hasOwnProperty('commercial_discount3')) {
                                this.premium_breakup_schema[key][sub_key] = "commercial discount3";
                            }
                        }
                        var premium_key = this.premium_breakup_schema[key][sub_key];
                        var premium_val = 0;
                        if (premium_key) {
                            premium_key = premium_key.toString().toLowerCase().replace(/ /g, '_');
                            if (premium_key === "basic_own_damage_1") {
                                premium_key = "basic_own_damage";
                            }
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
                        } else if (sub_key === 'tp_cover_tppd') {
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

            premium_breakup['net_premium'] = Math.round(objPremiumService['netpremium'] - 0);
            premium_breakup['service_tax'] = Math.round(objPremiumService['servicetax'] - 0);
            premium_breakup['final_premium'] = Math.round(objPremiumService['finalpremium'] - 0);


            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['calculateMotorPremiumSigResponse']['pTransactionId_inout'];


        }
        objServiceHandler.Error_Msg = Error_Msg;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    return objServiceHandler;
};

/*
 BajajAllianzMotor.prototype.customer_response_handler = function (objResponseJson) {
 console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
 var objServiceHandler = {
 'Error_Msg': 'NO_ERR',
 'Insurer_Transaction_Identifier': null,
 'Premium_Breakup': null,
 'Customer': null
 };
 try {
 
 objError = objResponseJson['calculateMotorPremiumSigResponse']['pError_out'];
 var Error_Msg = 'NO_ERR';
 //check error start
 if (objError !== '') {
 Error_Msg = objError['WeoTygeErrorMessageUser']['errText'];
 }
 if (this.lm_request['product_id'] === 12) {
 if (this.lm_request.hasOwnProperty('vehicle_class')) {
 if (this.lm_request['vehicle_class'] === "gcv") {
 if (this.prepared_request.hasOwnProperty('dbmaster_insurer_vehicle_seatingcapacity')) {
 if (this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity'] > 6) {
 Error_Msg = "WE are not allowing Bus -Fail";
 }
 }
 }
 }
 }
 if (Error_Msg === 'NO_ERR') {
 var objInsurerPremiumJson = objResponseJson['calculateMotorPremiumSigResponse']['premiumSummeryList_out']['WeoMotPremiumSummaryUser'];
 var key_lock_premium = 0;
 for (var keyCover in objInsurerPremiumJson) {
 try {
 if (objInsurerPremiumJson[keyCover]['paramDesc'] === 'KEYS AND LOCKS REPLACEMENT COVER') {
 if (!isNaN(objInsurerPremiumJson[keyCover]['od'] - 0)) {
 key_lock_premium += objInsurerPremiumJson[keyCover]['od'] - 0;
 }
 if (!isNaN(objInsurerPremiumJson[keyCover]['act'] - 0)) {
 key_lock_premium += objInsurerPremiumJson[keyCover]['act'] - 0;
 }
 key_lock_premium = (key_lock_premium < 0) ? (0 - key_lock_premium) : key_lock_premium;
 key_lock_premium = Math.round(key_lock_premium + (key_lock_premium * 0.18));
 }
 } catch (e) {
 }
 }
 key_lock_premium = 0;
 var Customer = {
 'final_premium_verified': parseInt(objResponseJson['calculateMotorPremiumSigResponse']['premiumDetailsOut_out']['finalPremium']['_']) - key_lock_premium,
 'insurer_customer_identifier': objResponseJson['calculateMotorPremiumSigResponse']['pTransactionId_inout']
 };
 objServiceHandler.Customer = Customer;
 objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['calculateMotorPremiumSigResponse']['pTransactionId_inout'];
 }
 objServiceHandler.Error_Msg = Error_Msg;
 } catch (ex) {
 var Err = {
 'Type': 'LM',
 'Msg': ex.stack
 };
 objServiceHandler.Error_Msg = JSON.stringify(Err);
 console.error('Exception', this.constructor.name, 'customer_response_handler', objServiceHandler);
 }
 console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
 return objServiceHandler;
 };
 */
BajajAllianzMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);

    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {

        if (objResponseJson.hasOwnProperty('issuePolicyResponse')) {
            var objPremiumService = objResponseJson['issuePolicyResponse'];
            if (objPremiumService.hasOwnProperty('pError_out') && objPremiumService['pError_out'] !== '') {
                try {
                    if (objPremiumService['pError_out']['WeoTygeErrorMessageUser'].hasOwnProperty('errText')) {
                        Error_Msg = objPremiumService['pError_out']['WeoTygeErrorMessageUser']['errText'];
                    } else {
                        var msg = [];
                        for (var k in objPremiumService['pError_out']['WeoTygeErrorMessageUser']) {
                            msg.push(objPremiumService['pError_out']['WeoTygeErrorMessageUser'][k]['errText']);
                        }
                        Error_Msg = msg.join(' | ');
                    }
                } catch (e) {
                    Error_Msg = JSON.stringify(objPremiumService['pError_out']);
                }
            } else {
                var Insurer_Transaction_Identifier = objPremiumService['motExtraCover_inout']['extraField3']['_'];
                //var Insurer_Transaction_Identifier = objPremiumService['ppartId_out'];
                if (Insurer_Transaction_Identifier === this.prepared_request['dbmaster_insurer_transaction_identifier'] || true) {

                } else {
                    Error_Msg = 'LM_PREMIUM_PROPOSAL_INDENTIFIER_MISMATCH';
                }
            }
        } else {
            Error_Msg = 'LM_EMPTY_RESPONSE';
        }

        if (Error_Msg === 'NO_ERR') {
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], this.processed_request['___final_premium_verified___'], 10, 3);
            if (objPremiumVerification.Status) {
                var thankyouurl = ((config.environment.name === 'Production') ? 'http://www.policyboss.com' : 'http://qa.policyboss.com') + '/Payment/Transaction_Status?crn=' + this.lm_request['crn'];

                if (this.lm_request['product_id'] === 12) {
                    var pg_data = {
                        'requestId': objPremiumService['motExtraCover_inout']['extraField3']['_'],
                        'Username': this.prepared_request['insurer_integration_service_user'],
                        'sourceName': 'WS_MOTOR'
                    };
                } else {
                    var pg_data = {
                        'requestId': this.prepared_request['dbmaster_insurer_transaction_identifier'],
                        'Username': this.prepared_request['insurer_integration_service_user'],
                        'sourceName': 'WS_MOTOR'
                    };
                }

                //objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Insurer_Transaction_Identifier = Insurer_Transaction_Identifier;
                /*if (this.lm_request['product_id'] !== 12) {
                 if (config.environment.name !== 'Production' && objPremiumService.hasOwnProperty('ppolicyref_out')) {
                 Error_Msg = "Policy No: " + objPremiumService['ppolicyref_out'];
                 }
                 }*/
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
        console.error('Exception', this.constructor.name, 'proposal_response_handler', ex);
    }
    //console.error('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    //console.error('Finish', this.constructor.name, 'proposal_response_handler', objResponseJson);
    return objServiceHandler;
};
BajajAllianzMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    try {
        console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
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
        this.method_content = method_content;
        this.insurer_product_field_process_pre();
        var request_replaced_data = this.method_content.replaceJson(this.processed_request);


        var logGuid = this.create_guid('ARN-');
        var docLog = {
            "Service_Log_Id": "",
            "Service_Log_Unique_Id": logGuid,
            "Request_Id": objProduct.docRequest.Request_Id,
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
BajajAllianzMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objInsurerProduct = this;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {


        //this.pg_response_handler();
        if (objInsurerProduct.prepared_request.transaction_status === 'SUCCESS') {
            var args = {
                data: {
                    "search_reference_number": objInsurerProduct.lm_request['search_reference_number'],
                    "api_reference_number": objInsurerProduct.lm_request['api_reference_number'],
                    "policy_number": objInsurerProduct.prepared_request.policy_number,
                    'client_key': objInsurerProduct.lm_request['client_key'],
                    'secret_key': objInsurerProduct.lm_request['secret_key'],
                    'insurer_id': objInsurerProduct.lm_request['insurer_id'],
                    'email': objInsurerProduct.lm_request['email'],
                    'mobile': objInsurerProduct.lm_request['mobile'],
                    'method_type': 'Pdf',
                    'execution_async': 'no'
                },
                headers: {
                    "Content-Type": "application/json",
                    'client_key': objInsurerProduct.lm_request['client_key'],
                    'secret_key': objInsurerProduct.lm_request['secret_key']
                }
            };
            objInsurerProduct.const_policy.pdf_request = args.data;

            var product_name = 'CAR';
            if (objInsurerProduct.lm_request['product_id'] === 10) {
                product_name = 'TW';
            }
            if (objInsurerProduct.lm_request['product_id'] === 12) {
                product_name = 'CV';
            }
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + objInsurerProduct.prepared_request.policy_number.replace(/-/g, '') + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
            objInsurerProduct.const_policy.policy_url = pdf_web_path_portal;
            objInsurerProduct.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc_horizon);
            /*
             var http = require('https');
             
             var p_policy_reo = objInsurerProduct.prepared_request.policy_number.split('-')[4];
             var location_code = objInsurerProduct.prepared_request.policy_number.split('-')[2];
             
             var insurer_pdf_url = 'https://general.bajajallianz.com/BagicNxt/nb/getPolicyPdfRange.do?P_POLICY_REF=' + objInsurerProduct.prepared_request.policy_number + '&p_policy_reo=' + p_policy_reo + '&location_code=' + location_code + '&user_name=webservice@landmarkinsurance.com';
             
             objInsurerProduct.const_policy.insurer_policy_url = insurer_pdf_url;
             try {
             var https = require('https');
             var request = https.get(insurer_pdf_url, function (response) {
             if (response.statusCode == 200) {
             var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
             response.pipe(file_horizon);
             }
             });
             } catch (ep) {
             console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
             }
             */
        }
        objServiceHandler.Insurer_Transaction_Identifier = objInsurerProduct.prepared_request.transaction_id;
        objServiceHandler.Policy = objInsurerProduct.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex.stack);
    }
    return objServiceHandler;
};
BajajAllianzMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    try {
        var objInsurerProduct = this;
        objInsurerProduct.pdf_attempt++;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.post(url, args, function (data, response) {
            if (data.Error_Code !== '' || true) {
                /*if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                 var sleep = require('system-sleep');
                 sleep(600000);
                 objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
                 }*/
            }
        });
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call', ex.stack);
    }
};
BajajAllianzMotor.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var policy = {
        'policy_url': null,
        'policy_number': this.lm_request['policy_number'],
        'pdf_status': null
    };
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        let pdf_data = '';
        if (objResponseJson.hasOwnProperty('errorcode') || objResponseJson.hasOwnProperty('errormsg')) {
            if (objResponseJson['errorcode'] === null || objResponseJson['errormsg'] === "null") {
                if (objResponseJson.hasOwnProperty('fileByteObj') && objResponseJson['fileByteObj'] !== "") {
                    pdf_data = objResponseJson['fileByteObj'];
                } else {
                    Error_Msg = 'LM_fileByteObj_Node_Empty';
                }
            } else {
                Error_Msg = objResponseJson['errormsg'];
            }
        } else {
            Error_Msg = 'LM_Node_Missing';
        }

        if (Error_Msg === 'NO_ERR') {
            var product_name = 'CAR';
            if (this.lm_request['product_id'] === 10) {
                product_name = 'TW';
            }
            if (this.lm_request['product_id'] === 12) {
                product_name = 'CV';
            }
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'].replace(/-/g, '') + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
            var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
            var https = require('https');
            policy.policy_url = pdf_web_path_portal;
            policy.pdf_status = 'SUCCESS';
            try {
                var binary = new Buffer(pdf_data, 'base64');
                fs.writeFileSync(pdf_sys_loc_horizon, binary);
                let is_valid_policy = null;
                if (fs.existsSync(pdf_sys_loc_horizon) && pdf_sys_loc_horizon.indexOf('.pdf') > -1) {
                    let stats = fs.statSync(pdf_sys_loc_horizon);
                    let fileSizeInBytes = stats.size;
                    let fileSizeInKb = (fileSizeInBytes / 1024).toFixed(2);
                    if (fileSizeInKb > 10) {
                        is_valid_policy = true;
                        policy.pdf_status = 'SUCCESS';
                    } else {
                        fs.unlinkSync(pdf_sys_loc_horizon);
                        is_valid_policy = false;
                    }
                } else {
                    is_valid_policy = false;
                }
            } catch (ep) {
                console.error('ExceptionPDF', this.constructor.name, 'pdf_response_handler', ep.stack);
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.pdf_status = 'FAIL';
        }
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex.stack);
    }
    objServiceHandler.Policy = policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
BajajAllianzMotor.prototype.pg_response_handler = function () {
    try {
        //Return URL => policyref=OG-14-121212&p_pay_status=Y
        //Return URL => p_pay_status=Y
        //Return URL => p_pay_status=N
        var objInsurerProduct = this;
        this.const_policy.transaction_status = '';


        if (objInsurerProduct.lm_request.pg_post.hasOwnProperty('request_id')) {
            this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_post['request_id'];
        } else if (objInsurerProduct.lm_request.pg_get.hasOwnProperty('requestId')) {
            this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_get['requestId'];
        }

        if (objInsurerProduct.lm_request.pg_post.hasOwnProperty('policyref') && objInsurerProduct.lm_request.pg_post.hasOwnProperty('p_pay_status')) {
            if (objInsurerProduct.lm_request.pg_post['p_pay_status'] === 'Y' && objInsurerProduct.lm_request.pg_post['policyref'].indexOf('OG') > -1) {
                this.const_policy.transaction_status = 'SUCCESS';
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.policy_number = objInsurerProduct.lm_request.pg_post['policyref'];
            } else if (objInsurerProduct.lm_request.pg_post['p_pay_status'] === 'Y') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_status = 'PAYPASS';
            } else if (objInsurerProduct.lm_request.pg_post['p_pay_status'] === 'N') {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else if (objInsurerProduct.lm_request.pg_get.hasOwnProperty('policyref') && objInsurerProduct.lm_request.pg_get.hasOwnProperty('p_pay_status')) {
            if (objInsurerProduct.lm_request.pg_get['p_pay_status'] === 'Y' && objInsurerProduct.lm_request.pg_get['policyref'].indexOf('OG') > -1) {
                this.const_policy.transaction_status = 'SUCCESS';
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.policy_number = objInsurerProduct.lm_request.pg_get['policyref'];
            } else if (objInsurerProduct.lm_request.pg_get['p_pay_status'] === 'Y') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_status = 'PAYPASS';
            } else if (objInsurerProduct.lm_request.pg_get['p_pay_status'] === 'N') {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};

BajajAllianzMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "Basic Own Damage 1",
        "od_elect_access": "Electrical Accessories",
        "od_non_elect_access": "Non-Electrical Accessories",
        "od_cng_lpg": "OD CNG / LPG Unit (IMT.25)",
        "od_disc_ncb": "ncbAmt",
        "od_disc_vol_deduct": "",
        "od_disc_anti_theft": "",
        "od_disc_aai": "",
        "od_loading": "addLoadPrem", //addLoadPrem 
        "od_disc": "Commercial Discount3",
        "od_disc_own_premises": "",
        "od_final_premium": "totalOdPremium"
    },
    "liability": {
        "tp_basic": "Basic Third Party Liability",
        "tp_cover_owner_driver_pa": "PA Cover For Owner-Driver",
        "tp_cover_unnamed_passenger_pa": "",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "",
        "tp_cover_paid_driver_ll": "",
        "tp_cover_tppd": "Restrict TPPD",
        "tp_cng_lpg": "TP CNG / LPG Unit (IMT.25)",
        "tp_cover_imt23": "",
        "tp_cover_fairing_paying_passenger": "",
        "tp_cover_non_fairing_paying_passenger": "",
        "tp_basic_other_use": "",
        "tp_cover_emp_pa": "",
        "tp_final_premium": "totalActPremium"
    },
    "addon": {
        "addon_zero_dep_cover": "Depreciation Shield",
        "addon_road_assist_cover": "24x7 SPOT ASSISTANCE",
        "addon_ncb_protection_cover": null,
        "addon_engine_protector_cover": "Engine Protector",
        "addon_invoice_price_cover": null,
        "addon_key_lock_cover": "KEYS AND LOCKS REPLACEMENT COVER",
        "addon_consumable_cover": "Consumable Expenses",
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": null,
        "addon_personal_belonging_loss_cover": "Personal Baggage Cover",
        "addon_inconvenience_allowance_cover": "Conveyance Benefit",
        "addon_medical_expense_cover": null,
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_accident_shield_cover": "Accident Sheild",
        "addon_final_premium": 0
    },
    "net_premium": "netPremium",
    "service_tax": "serviceTax",
    "final_premium": "finalPremium"
};
BajajAllianzMotor.prototype.policy_end_date = function () {
    console.log('Start', this.constructor.name, 'policy_end_date');
    var pol_end_date;
    try {
        pol_end_date = new Date();
        var moment = require('moment');
        var policy_tenure_tmp = 1;
        if (this.lm_request.hasOwnProperty('policy_tenure') && (this.lm_request['policy_tenure'] - 0) > 0) {
            policy_tenure_tmp = (this.lm_request['policy_tenure'] - 0);
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            pol_end_date.setDate(pol_end_date.getDate() - 1);
            pol_end_date.setFullYear(pol_end_date.getFullYear() + policy_tenure_tmp);
        }
        if (this.lm_request['vehicle_insurance_type'] === 'renew') {
            var days_diff = moment(this.todayDate()).diff(this.lm_request['policy_expiry_date'], 'days');
            //for expired case
            if (days_diff > 0) {
                var today_date = new Date(this.todayDate());
                pol_end_date.setFullYear(today_date.getFullYear() + policy_tenure_tmp);
            } else { // for not expired case
                var expiry_date = new Date(this.lm_request['policy_expiry_date']);
                var pol_end_date = expiry_date;
                pol_end_date.setFullYear(expiry_date.getFullYear() + policy_tenure_tmp);
            }
        }
        pol_end_date = this.date_format(pol_end_date, this.insurer_date_format);
        console.log('Finish', this.constructor.name, 'policy_end_date', pol_end_date);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'policy_end_date', ex);
        return pol_end_date;
    }
    return pol_end_date;
};
module.exports = BajajAllianzMotor;






