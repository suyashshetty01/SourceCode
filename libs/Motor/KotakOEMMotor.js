/* 
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
var moment = require('moment');
var excel = require('excel4node');
var xml2js = require('xml2js');
function KotakOEMMotor() {

}
util.inherits(KotakOEMMotor, Motor);
KotakOEMMotor.prototype.lm_request_single = {};
KotakOEMMotor.prototype.insurer_integration = {};
KotakOEMMotor.prototype.insurer_addon_list = [];
KotakOEMMotor.prototype.insurer = {};
KotakOEMMotor.prototype.pdf_attempt = 0;
KotakOEMMotor.prototype.insurer_date_format = 'YYYY-MM-DD';
KotakOEMMotor.prototype.insurer_product_api_pre = function () {
};
KotakOEMMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            this.prepared_request['vehicle_expected_idv'] = 0;
            this.processed_request['___vehicle_expected_idv___'] = 0;
        }
        if (this.vehicle_age_year() <= 5) {
            if ((parseInt(this.processed_request['___dbmaster_insurer_vehicle_cubiccapacity___']) <= 150) && (this.processed_request['___dbmaster_insurer_vehicle_make_name___'] !== "BAJAJ" && this.processed_request['___dbmaster_insurer_vehicle_model_name___'] !== "PULSAR")) {
                this.prepared_request['od_disc_perc'] = 50;
                this.processed_request['___od_disc_perc___'] = 50;
            } else if ((parseInt(this.processed_request['___dbmaster_insurer_vehicle_cubiccapacity___']) > 150) && (this.processed_request['___dbmaster_insurer_vehicle_make_name___'] === "TVS" || this.processed_request['___dbmaster_insurer_vehicle_make_name___'] === "HERO" || this.processed_request['___dbmaster_insurer_vehicle_make_name___'] === "HONDA" || this.processed_request['___dbmaster_insurer_vehicle_make_name___'] === "HERO MOTOCORP"))
            {
                this.prepared_request['od_disc_perc'] = 50;
                this.processed_request['___od_disc_perc___'] = 50;
            } else {
                this.prepared_request['od_disc_perc'] = 0;
                this.processed_request['___od_disc_perc___'] = 0;
            }
            //Vehicle age is allowed only upto 5 Years for Two Wheeler.
        } else {
            this.prepared_request['od_disc_perc'] = 0;
            this.processed_request['___od_disc_perc___'] = 0;
        }
        if (this.lm_request.hasOwnProperty('od_disc_perc') && this.lm_request['od_disc_perc'] > 0) {
            this.prepared_request['od_disc_perc'] = this.lm_request['od_disc_perc'];
            this.processed_request['___od_disc_perc___'] = this.lm_request['od_disc_perc'];
        }
        if (this.lm_request['method_type'] === 'Premium') {
            var cubic_capacity = parseInt(this.processed_request['___dbmaster_insurer_vehicle_cubiccapacity___']);
            var vehicle_age = this.vehicle_age_year();
            var rto_zone = this.processed_request['___dbmaster_pb_vehicletariff_zone___'];
            var vehicle_cc_slab_1 = 0;
            var vehicle_age1 = 0;
            var arr_cc_1 = [150, 350, 2000];
            var arr_age = [5, 10, 20];
            for (var k in arr_cc_1) {
                if (cubic_capacity < arr_cc_1[k]) {
                    vehicle_cc_slab_1 = arr_cc_1[k];
                    break;
                }
            }
            for (var k in arr_age) {
                if (vehicle_age < arr_age[k]) {
                    vehicle_age1 = arr_age[k];
                    break;
                }
            }
            var obj_basicod = [
                {'zone': 'A', 'vehicle_age': 5, 'cubic_capacity': 150, 'premium_rate': 1.708},
                {'zone': 'A', 'vehicle_age': 10, 'cubic_capacity': 150, 'premium_rate': 1.793},
                {'zone': 'A', 'vehicle_age': 20, 'cubic_capacity': 150, 'premium_rate': 1.836},
                {'zone': 'A', 'vehicle_age': 5, 'cubic_capacity': 350, 'premium_rate': 1.793},
                {'zone': 'A', 'vehicle_age': 10, 'cubic_capacity': 350, 'premium_rate': 1.883},
                {'zone': 'A', 'vehicle_age': 20, 'cubic_capacity': 350, 'premium_rate': 1.928},
                {'zone': 'A', 'vehicle_age': 5, 'cubic_capacity': 2000, 'premium_rate': 1.879},
                {'zone': 'A', 'vehicle_age': 10, 'cubic_capacity': 2000, 'premium_rate': 1.973},
                {'zone': 'A', 'vehicle_age': 20, 'cubic_capacity': 2000, 'premium_rate': 2.020},
                {'zone': 'B', 'vehicle_age': 5, 'cubic_capacity': 150, 'premium_rate': 1.676},
                {'zone': 'B', 'vehicle_age': 10, 'cubic_capacity': 150, 'premium_rate': 1.760},
                {'zone': 'B', 'vehicle_age': 20, 'cubic_capacity': 150, 'premium_rate': 1.802},
                {'zone': 'B', 'vehicle_age': 5, 'cubic_capacity': 350, 'premium_rate': 1.760},
                {'zone': 'B', 'vehicle_age': 10, 'cubic_capacity': 350, 'premium_rate': 1.848},
                {'zone': 'B', 'vehicle_age': 20, 'cubic_capacity': 350, 'premium_rate': 1.892},
                {'zone': 'B', 'vehicle_age': 5, 'cubic_capacity': 2000, 'premium_rate': 1.844},
                {'zone': 'B', 'vehicle_age': 10, 'cubic_capacity': 2000, 'premium_rate': 1.936},
                {'zone': 'B', 'vehicle_age': 20, 'cubic_capacity': 2000, 'premium_rate': 1.982}
            ];
            var index = obj_basicod.findIndex(x => x.zone === rto_zone && x.cubic_capacity === vehicle_cc_slab_1 && x.vehicle_age === vehicle_age1);
            this.prepared_request['od_tarrif_rate'] = obj_basicod[index]['premium_rate'];
            this.processed_request['___od_tarrif_rate___'] = this.prepared_request['od_tarrif_rate'];
            if (this.lm_request['vehicle_insurance_subtype'] === '5CH_0TP') {

                var Insurer_Id = this['insurer_id'];
                var Insurer_Vehicle_ExShowRoom = this.prepared_request['dbmaster_pb_exshoroomprice'];
                var Vehicle_Depreciation_Range = {
                    'Age_0': '5',
                    'Age_1': '15',
                    'Age_2': '20',
                    'Age_3': '30',
                    'Age_4': '40',
                    'Age_5': '50',
                    'Age_6': '55',
                    'Age_7': '60',
                    'Age_8': '65',
                    'Age_9': '70',
                    'Age_10': '75',
                    'Age_11': '80',
                    'Age_12': '85'
                };
                var Idv = 0;
                if (Insurer_Vehicle_ExShowRoom != '') {
                    var Vehicle_Age_Year = this.vehicle_age_year();
                    if (Vehicle_Age_Year < 1) {
                        Vehicle_Age_Year = 1;
                    } else if (Vehicle_Age_Year > 12) {
                        Vehicle_Age_Year = null;
                    }

                    var Applied_Year = Vehicle_Age_Year - 1;
                    var Idv_2 = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + (parseInt(Applied_Year) + 1)]) / 100);
                    var Idv_3 = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + (parseInt(Applied_Year) + 2)]) / 100);
                    var Idv_4 = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + (parseInt(Applied_Year) + 3)]) / 100);
                    var Idv_5 = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + (parseInt(Applied_Year) + 4)]) / 100);
                }

                this.prepared_request['vehicle_normal_idv_2'] = Idv_2;
                this.processed_request['___vehicle_normal_idv_2___'] = Idv_2;
                this.prepared_request['vehicle_normal_idv_3'] = Idv_3;
                this.processed_request['___vehicle_normal_idv_3___'] = Idv_3;
                this.prepared_request['vehicle_normal_idv_4'] = Idv_4;
                this.processed_request['___vehicle_normal_idv_4___'] = Idv_4;
                this.prepared_request['vehicle_normal_idv_5'] = Idv_5;
                this.processed_request['___vehicle_normal_idv_5___'] = Idv_5;
            }

        }

        if (this.lm_request['method_type'] === 'Verification' || this.lm_request['method_type'] === 'Proposal') {
            this.prepared_request['vehicle_normal_idv_2'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_2'];
            this.processed_request['___vehicle_normal_idv_2___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_2'];
            this.prepared_request['vehicle_normal_idv_3'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_3'];
            this.processed_request['___vehicle_normal_idv_3___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_3'];
            this.prepared_request['vehicle_normal_idv_4'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_4'];
            this.processed_request['___vehicle_normal_idv_4___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_4'];
            this.prepared_request['vehicle_normal_idv_5'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_5'];
            this.processed_request['___vehicle_normal_idv_5___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_5'];
            // For wallet
            if (this.lm_request['method_type'] === 'Proposal') {
                if (this.lm_request.hasOwnProperty('pay_from')) {
                    this.prepared_request['pay_from'] = "wallet";
                    this.processed_request['___pay_from___'] = this.prepared_request['pay_from'];
                }
            }
        }
        if (this.lm_request['is_breakin'] === 'yes') {
            var someStartDate = new Date(this.prepared_request['policy_start_date']);
            someStartDate.setDate(someStartDate.getDate() + 2);
            var startDateFormated = (someStartDate.toISOString().substr(0, 10)).split('-');
            var start_date = startDateFormated[0] + '-' + startDateFormated[1] + '-' + startDateFormated[2];
            this.prepared_request['policy_start_date'] = start_date;
            this.processed_request['___policy_start_date___'] = this.prepared_request['policy_start_date'];

            var someEndDate = new Date(this.prepared_request['policy_end_date']);
            someEndDate.setDate(someEndDate.getDate() + 2);
            var endDateFormated = (someEndDate.toISOString().substr(0, 10)).split('-');
            var end_date = endDateFormated[0] + '-' + endDateFormated[1] + '-' + endDateFormated[2];
            this.prepared_request['policy_end_date'] = end_date;
            this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];

            if (this.lm_request['is_policy_exist'] === "no") {
                this.prepared_request['policy_expiry_date'] = '';
                this.processed_request['___policy_expiry_date___'] = this.prepared_request['policy_expiry_date'];
            }
            if (this.lm_request['is_claim_exists'] === "no") {
                if (this.lm_request['breakin_days'] > 87) {
                    this.lm_request['vehicle_ncb_current'] = "0";
                    this.prepared_request['vehicle_ncb_current'] = "0";
                    this.processed_request['___vehicle_ncb_current___'] = this.prepared_request['vehicle_ncb_current'];
                    this.prepared_request['vehicle_ncb_next'] = "0";
                    this.processed_request['___vehicle_ncb_next___'] = this.prepared_request['vehicle_ncb_next'];
                }
            }
        }

        if (this.lm_request['method_type'] === 'Verification') {
            if (this.lm_request['crn'] == 4491914) {
                this.method_content = this.method_content.replace('___tax___', parseInt(this.Master_Details['User_Data']['Erp_Qt_Request_Core']['___tax___']));
                this.method_content = this.method_content.replaceJson(this.Master_Details['User_Data']['Erp_Qt_Request_Core']);
            }
            if (this.processed_request['___pg_reference_number_1___'] !== null) {
                var res_year = (this.processed_request['___pg_reference_number_1___']).split("-");
                var res_date = res_year[2].split(" ");
                var date = res_year[0] + "-" + res_year[1] + "-" + res_date[0];
                this.prepared_request['pg_reference_number_1'] = date;
                this.processed_request['___pg_reference_number_1___'] = date;
            }
            if (this.lm_request['engine_number']) {
                this.method_content = this.method_content.replace('___engine_number___', this.lm_request['engine_number']);
            }
            if (this.lm_request['chassis_number']) {
                this.method_content = this.method_content.replace('___chassis_number___', this.lm_request['chassis_number']);
            }
            if (this.lm_request['policy_number']) {
                this.method_content = this.method_content.replace('___policy_no___', this.lm_request['policy_number']);
            } else if (this.processed_request['___pg_reference_number_1___'] !== null) {
                this.method_content = this.method_content.replace('___policy_no___', moment(this.processed_request['___pg_reference_number_1___'], 'YYYY-MM-DD').format("YYMMDD") + this.lm_request['crn']);
            } else {
                this.method_content = this.method_content.replace('___policy_no___', moment().format("YYMMDD") + this.lm_request['crn']);
            }
            this.method_content = this.method_content.replace('___transaction_amount___', parseInt(this.processed_request['___transaction_amount___']));
            this.method_content = this.method_content.replace('___od_final_premium___', parseInt(this.insurer_lm_request['od_final_premium']));
            this.method_content = this.method_content.replace('___tp_final_premium___', parseInt(this.insurer_lm_request['tp_final_premium']));
            this.method_content = this.method_content.replace('___salutation___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['salutation']);
            this.method_content = this.method_content.replace('___first_name___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['first_name']);
            this.method_content = this.method_content.replace('___middle_name___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['middle_name']);
            this.method_content = this.method_content.replace('___last_name___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['last_name']);
            this.method_content = this.method_content.replace('___engine_number___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['engine_number']);
            this.method_content = this.method_content.replace('___chassis_number___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['chassis_number']);
            this.method_content = this.method_content.replace('___vehicle_expected_idv___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_expected_idv']);
            this.method_content = this.method_content.replace('___tax___', parseInt(this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['tax']));
            this.method_content = this.method_content.replace('___net_premium___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['net_premium']);
            this.method_content = this.method_content.replace('___registration_no_1___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['registration_no_1']);
            this.method_content = this.method_content.replace('___registration_no_2___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['registration_no_2']);
            this.method_content = this.method_content.replace('___registration_no_3___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['registration_no_3']);
            this.method_content = this.method_content.replace('___registration_no_4___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['registration_no_4']);
            this.method_content = this.method_content.replace('___addon_zero_dep_cover___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_zero_dep_cover']);
            this.method_content = this.method_content.replace('___addon_engine_protector_cover___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_engine_protector_cover']);
            this.method_content = this.method_content.replace('___addon_consumable_cover___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_consumable_cover']);

        }
        if (this.lm_request['method_type'] === 'Pdf') {
            this.processed_request['___policy_number___'] = this.lm_request['policy_number'];
            this.processed_request['___transaction_id___'] = (this.lm_request.hasOwnProperty('transaction_pg') && this.lm_request['transaction_pg'].includes('pay_')) ? this.lm_request['transaction_pg'] : isNaN(this.lm_request['transaction_id']) ? this.lm_request['transaction_pg'] : this.lm_request['transaction_id'];
            this.processed_request['___pg_reference_number_1___'] = this.lm_request['pg_reference_number_1'];
            this.processed_request['___first_name__'] = this.lm_request['first_name'];
            var bitmap = fs.readFileSync(appRoot + "/tmp/pdf/" + this.lm_request['pdf_binary_data_file']);
            var pdf_binary_data = Buffer.from(bitmap).toString('base64');
            this.processed_request['___pdf_binary_data___'] = pdf_binary_data;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
KotakOEMMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;
    var error_msg = 'NO_ERROR';
    var obj_response_handler;
    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Idv') {
        obj_response_handler = this.idv_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Proposal') {
        obj_response_handler = this.proposal_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Customer') {
        obj_response_handler = this.customer_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Status') {
        obj_response_handler = this.status_response_handler(objResponseJson);
    }
    return obj_response_handler;
};
KotakOEMMotor.prototype.insurer_product_field_process_post = function () {

    console.log("insurer_product_api_post");
};
KotakOEMMotor.prototype.insurer_product_api_post = function () {

    console.log("insurer_product_api_post");
};
KotakOEMMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {

        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id; //
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        var Client = require('node-rest-client').Client;
        var client = new Client();
        console.log("KotakOEMMotor service_call : ", specific_insurer_object.method.Method_Type, " :: ", docLog.Insurer_Request);
        var args = null;
        var service_method_url = '';
        //service_method_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action;
        if (specific_insurer_object.method.Method_Type === 'Verification' || specific_insurer_object.method.Method_Type === 'Pdf') {
            if (specific_insurer_object.method.Method_Type === 'Pdf') {
                //args =  docLog.Insurer_Request;
                var xml2js = require('xml2js');
                var body = docLog.Insurer_Request;
                var pdfUrl = specific_insurer_object.method.Service_URL;
                if (config.environment.name === 'Production') {
                    var http = require('https');
                    var host = (pdfUrl.split('//')[1]).split('/')[0];
                } else {
                    var http = require('http');
                    var host = (pdfUrl.split('//')[1]).split('/')[0];
                }
                var postRequest = {
                    host: host,
                    path: specific_insurer_object.method.Service_URL,
                    method: "POST",
                    "rejectUnauthorized": false,
                    headers: {
                        'Content-Type': 'text/xml',
                        'Content-Length': Buffer.byteLength(docLog.Insurer_Request),
                        "SOAPAction": specific_insurer_object.method.Method_Action
                    }
                };
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
                                if (objInsurerProduct.lm_request['method_type'] === 'Premium') {
                                    objResponseFull['objResponseJson']['actualPlanName'] = docLog['Plan_Name'];
                                }
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            }
                        });
                    });
                });
                req.on('error', function (e) {
                    console.error('problem with request: ' + e.message);
                });
                req.write(docLog.Insurer_Request);
                req.end();

            } else {
                if (objInsurerProduct.lm_request['policy_number'] && objInsurerProduct.lm_request['bank_ref_num']) {
                    client.post(config.environment.weburl, function (data, response) {
// parsed response body as js object 
                        console.log(data);
                        // raw response 
                        console.log(response);
                        data = {
                            "PartnerIntegrationOutput": {
                                "PolicyNo": [
                                    objInsurerProduct.lm_request['policy_number']
                                ],
                                "TransactionID": [
                                    objInsurerProduct.lm_request['bank_ref_num']
                                ],
                                "ProposalStatus": [
                                    "1"
                                ],
                                "ErrCode": [
                                    {
                                        "attr": {
                                            "xsi:nil": "true"
                                        }
                                    }
                                ],
                                "ErrMsg": [
                                    ""
                                ]
                            }
                        };
                        var objResponseFull = {
                            'err': null,
                            'result': data,
                            'raw': data,
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        if (specific_insurer_object.method.Method_Type === 'Idv') {
                            objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                        }
                    });
                } else {
                    args = {
                        Partner_integrationXML: docLog.Insurer_Request
                    };
                    console.log('Final-Request->' + docLog.Insurer_Request);
                    soap.createClient(specific_insurer_object.method.Service_URL, function (err, client) {
                        client[specific_insurer_object.method.Method_Action](args, function (err1, result, raw, soapHeader) {
                            console.error('KotakOEMMotor', 'service_call', err1, result);
                            if (err1) {
                                console.error('KotakOEMMotor', 'service_call', 'exception', err1);
                                var objResponseFull = {
                                    'err': err1,
                                    'result': result,
                                    'raw': raw,
                                    'soapHeader': soapHeader,
                                    'objResponseJson': null
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            } else {
                                if (objInsurerProduct.method.Method_Type === "Pdf") {
                                    result = result.GetSignPolicyPDFResult;
                                    var objResponseFull = {
                                        'err': err1,
                                        'result': result,
                                        'raw': raw,
                                        'soapHeader': soapHeader,
                                        'objResponseJson': result
                                    };
                                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                } else {
                                    result = result.SavePartner_integrationResult;
                                    xml2js.parseString(result, function (err2, objXml2Json) {
                                        var objResponseFull = {
                                            'err': err,
                                            'result': objXml2Json,
                                            'raw': raw,
                                            'soapHeader': soapHeader,
                                            'objResponseJson': objXml2Json
                                        };
                                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                    });
                                }
                            }
                        });
                    });
                }
            }
        } else if (specific_insurer_object.method.Method_Type === "Status") {
            let order_id = specific_insurer_object.master_db_list.service_logs.pb_db_master.LM_Custom_Request.pg_reference_number_2;
            var username = config.razor_pay.rzp_kotak.username;
            var password = config.razor_pay.rzp_kotak.password;
            var args1 = {
                headers: {"Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                }
            };
            let service_url = specific_insurer_object.method_file_url + order_id + '/payments';
            client.get(service_url, args1, function (data, response) {
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
        } else {
            var args = {};
            var service_method_url = config.environment.weburl;
            if ((config.environment.hasOwnProperty('kotak_pg_type') && config.environment.kotak_pg_type === "rzrpay") && specific_insurer_object.method.Method_Type === 'Proposal' && !objInsurerProduct.lm_request.hasOwnProperty('pay_from')) {
                let body = {
                    "amount": objInsurerProduct['lm_request']['final_premium'] * 100, //[7582].indexOf(parseInt(objInsurerProduct['lm_request']['ss_id'])) > -1 ? (1 * 100) : objInsurerProduct['lm_request']['final_premium'] * 100
                    "payment_capture": 1,
                    "currency": "INR",
                    "transfers": [
                        {
                            "account": config.razor_pay.rzp_kotak.account_id,
                            "amount": objInsurerProduct['lm_request']['final_premium'] * 100, //[7582].indexOf(parseInt(objInsurerProduct['lm_request']['ss_id'])) > -1 ? (1 * 100) : objInsurerProduct['lm_request']['final_premium'] * 100
                            "currency": "INR"
                        }
                    ]
                };
                console.log(JSON.stringify(body));
                var username = config.razor_pay.rzp_kotak.username;
                var password = config.razor_pay.rzp_kotak.password;
                args = {
                    data: body,
                    headers: {"Content-Type": "application/json",
                        "Accept": "application/json",
                        'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                    }
                };
                service_method_url = specific_insurer_object.method.Service_URL;
                var today = moment().utcOffset("+05:30");
                var cache_time = moment(today).format("HHMMSSSS");
                var cache_key = 'live_razorpay_log_' + moment(today).format("DDMMYYYY");
                if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
                    var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
                    var obj_cache_content = JSON.parse(cache_content);
                    obj_cache_content[cache_time] = {
                        'url': service_method_url,
                        'body': args
                    };
                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(obj_cache_content), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                } else {
                    var objReq = {};
                    objReq[cache_time] = {
                        'url': service_method_url,
                        'body': args
                    };
                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(objReq), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                }
            }
            client.post(service_method_url, args, function (data, response) {
                // parsed response body as js object 
                console.log(JSON.stringify(data));
                // raw response 
                console.log(response);
                var objResponseFull = {
                    'err': null,
                    'result': null,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                var today = moment().utcOffset("+05:30");
                var cache_time = moment(today).format("HHMMSSSS");
                var cache_key = 'live_razorpay_log_' + moment(today).format("DDMMYYYY");
                if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
                    var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
                    var obj_cache_content = cache_content ? JSON.parse(cache_content) : "";
                    obj_cache_content[cache_time] = {
                        'response': data
                    };
                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(obj_cache_content), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                } else {
                    var objReq = {};
                    objReq[cache_time] = {
                        'response': data
                    };
                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(objReq), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
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
KotakOEMMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
};
KotakOEMMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    //var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';

    try {
        if (this.vehicle_age_year() >= 10) {
            Error_Msg = 'Vehicle age is allowed only upto 9.99 Years for Two Wheeler.';
        }

        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.get_const_premium_breakup();
            var cubic_capacity = parseInt(this.processed_request['___dbmaster_insurer_vehicle_cubiccapacity___']);
            var idv = parseInt(this.processed_request['___vehicle_expected_idv___']);
            var tp_basic = 0;
            var vehicle_cc_slab = 0;
            var arr_cc = [76, 151, 351, 2000];
            for (var k in arr_cc) {
                if (cubic_capacity < arr_cc[k]) {
                    vehicle_cc_slab = arr_cc[k];
                    break;
                }
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                var obj_cubic_capacity = {
                    'Cc_76': 1045,
                    'Cc_151': 3285,
                    'Cc_351': 5453,
                    'Cc_2000': 13034
                };
            } else {
                var obj_cubic_capacity = {
                    'Cc_76': 482,
                    'Cc_151': 752,
                    'Cc_351': 1193,
                    'Cc_2000': 2323
                };
            }
            var od_tariff_rate = this.processed_request['___od_tarrif_rate___']; //obj_basicod[index]['premium_rate'];
            var tp_basic = obj_cubic_capacity['Cc_' + vehicle_cc_slab];
            var od_basic_rate = 0;
            var od_disc_rate = 0;
            var od_basic_final = 0;
            var idv_2 = 0;
            var od_basic_rate_2 = 0;
            var od_disc_rate_2 = 0;
            var idv_3 = 0;
            var od_basic_rate_3 = 0;
            var od_disc_rate_3 = 0;
            var idv_4 = 0;
            var od_basic_rate_4 = 0;
            var od_disc_rate_4 = 0;
            var idv_5 = 0;
            var od_basic_rate_5 = 0;
            var od_disc_rate_5 = 0;
            var od_tenure = parseInt(this.lm_request['policy_od_tenure']);
            var tp_tenure = parseInt(this.lm_request['policy_tp_tenure']);
            var od_disc_slab = parseInt(this.prepared_request['od_disc_perc']);
            if (this.lm_request['vehicle_insurance_subtype'] === '5CH_0TP') {

                idv_2 = parseInt(this.processed_request['___vehicle_normal_idv_2___']);
                idv_3 = parseInt(this.processed_request['___vehicle_normal_idv_3___']);
                idv_4 = parseInt(this.processed_request['___vehicle_normal_idv_4___']);
                idv_5 = parseInt(this.processed_request['___vehicle_normal_idv_5___']);
                od_basic_rate = parseInt((od_tariff_rate * idv) / 100);
                od_basic_rate_2 = parseInt((od_tariff_rate * idv_2) / 100);
                od_basic_rate_3 = parseInt((od_tariff_rate * idv_3) / 100);
                od_basic_rate_4 = parseInt((od_tariff_rate * idv_4) / 100);
                od_basic_rate_5 = parseInt((od_tariff_rate * idv_5) / 100);
                od_disc_rate = parseInt((od_basic_rate * od_disc_slab) / 100);
                od_disc_rate_2 = parseInt((od_basic_rate_2 * od_disc_slab) / 100);
                od_disc_rate_3 = parseInt((od_basic_rate_3 * od_disc_slab) / 100);
                od_disc_rate_4 = parseInt((od_basic_rate_4 * od_disc_slab) / 100);
                od_disc_rate_5 = parseInt((od_basic_rate_5 * od_disc_slab) / 100);
            } else {
                od_basic_rate = parseInt((od_tariff_rate * idv) / 100);
                od_disc_rate = parseInt((od_basic_rate * od_disc_slab) / 100);
            }
            if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                od_basic_final = 0;
            } else {
                od_basic_final = parseInt((od_tenure * od_basic_rate) - (od_tenure * od_disc_rate));
            }
            if (this.lm_request['vehicle_insurance_subtype'] === '5CH_0TP') {
                premium_breakup['own_damage']['od_basic'] = parseInt(od_basic_rate + od_basic_rate_2 + od_basic_rate_3 + od_basic_rate_4 + od_basic_rate_5);
                premium_breakup['own_damage']['od_disc'] = parseInt(od_disc_rate + od_disc_rate_2 + od_disc_rate_3 + od_disc_rate_4 + od_disc_rate_5);
            } else {
                if (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP') {
                    premium_breakup['own_damage']['od_basic'] = 1.8 * od_basic_rate;
                    premium_breakup['own_damage']['od_disc'] = 1.8 * od_disc_rate;
                } else if (this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                    premium_breakup['own_damage']['od_basic'] = 2.5 * od_basic_rate;
                    premium_breakup['own_damage']['od_disc'] = 2.5 * od_disc_rate;
                } else {
                    premium_breakup['own_damage']['od_basic'] = od_tenure * od_basic_rate;
                    premium_breakup['own_damage']['od_disc'] = od_tenure * od_disc_rate;
                }
            }
            premium_breakup['own_damage']['od_disc_ncb'] = parseInt((parseInt(this.prepared_request['vehicle_ncb_next']) * ((premium_breakup['own_damage']['od_basic'] - 0) - (premium_breakup['own_damage']['od_disc'] - 0))) / 100);
            premium_breakup['own_damage']['od_elect_access'] = od_tenure * parseInt((this.lm_request['electrical_accessory'] * 4) / 100);
            premium_breakup['own_damage']['od_non_elect_access'] = od_tenure * parseInt((this.lm_request['non_electrical_accessory'] * od_tariff_rate) / 100);
            premium_breakup['own_damage']['od_final_premium'] = parseInt(premium_breakup['own_damage']['od_basic'] + premium_breakup['own_damage']['od_elect_access'] + premium_breakup['own_damage']['od_non_elect_access']
                    - premium_breakup['own_damage']['od_disc'] - premium_breakup['own_damage']['od_disc_ncb']);
            if (this.lm_request['vehicle_insurance_subtype'] !== '1OD_0TP') {
                if (this.lm_request['vehicle_insurance_type'] === 'new') {
                    premium_breakup['liability']['tp_basic'] = (tp_basic - 0);
                } else {
                    premium_breakup['liability']['tp_basic'] = (tp_tenure - 0) * (tp_basic - 0);
                }
                if (this.lm_request['is_pa_od'] === 'yes') {
                    if (this.lm_request['vehicle_insurance_type'] === 'renew') {
                        if (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP' || this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                            premium_breakup['liability']['tp_cover_owner_driver_pa'] = (tp_tenure - 0) * 330;
                        } else {
                            premium_breakup['liability']['tp_cover_owner_driver_pa'] = 330;
                        }
                    } else {
                        if (this.lm_request['vehicle_insurance_subtype'] === '5CH_0TP') {
                            premium_breakup['liability']['tp_cover_owner_driver_pa'] = 1500;
                        } else {
                            premium_breakup['liability']['tp_cover_owner_driver_pa'] = 0;
                        }
                    }
                } else {
                    premium_breakup['liability']['tp_cover_owner_driver_pa'] = 0;
                }
                if (this.lm_request['pa_unnamed_passenger_si'] === "0" || this.lm_request['pa_unnamed_passenger_si'] === undefined) {
                    premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = 0;
                } else {
                    //var pa_unnamed_psngr = parseFloat((parseInt(this.lm_request['pa_unnamed_passenger_si']) * 0.05) / 100);
                    //premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = tp_tenure * parseFloat(pa_unnamed_psngr * parseFloat(this.prepared_request['dbmaster_pb_seating_capacity']));
                    premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = 0;
                }
                if (this.lm_request.hasOwnProperty('is_tppd') && this.lm_request['is_tppd'] === "yes") {//&& this.lm_request['vehicle_insurance_subtype'] === '0CH_1TP'
                    premium_breakup['liability']['tp_cover_tppd'] = tp_tenure * 50;
                } else {
                    premium_breakup['liability']['tp_cover_tppd'] = 0;
                }
                //premium_breakup['liability']['tp_cover_outstanding_loan'] = 0;
                premium_breakup['liability']['tp_final_premium'] = parseInt(premium_breakup['liability']['tp_basic'] + premium_breakup['liability']['tp_cover_owner_driver_pa'] + premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] - premium_breakup['liability']['tp_cover_tppd']);
            }
            //Addon
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                premium_breakup['addon']['addon_zero_dep_cover'] = od_tenure * parseInt((0.30 * idv) / 100);
                premium_breakup['addon']['addon_consumable_cover'] = od_tenure * parseInt((0.10 * idv) / 100);
                premium_breakup['addon']['addon_engine_protector_cover'] = od_tenure * parseInt((0.15 * idv) / 100);
                //premium_breakup['addon']['addon_personal_belonging_loss_cover'] = this.lm_request['policy_od_tenure'] * 84.75;
            }
            premium_breakup['net_premium'] = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'] + premium_breakup['addon']['addon_final_premium'];
            if (this.processed_request['___registration_no_1___'] === "KL") {
                //var State_Cess_Amount = ((1 / 100) * premium_breakup['net_premium']).toFixed(2);
                var State_Cess_Amount = 0;
            } else {
                var State_Cess_Amount = 0;
            }
            premium_breakup['service_tax'] = Math.round((premium_breakup['net_premium'] * 0.18) + (State_Cess_Amount - 0));
            premium_breakup['final_premium'] = premium_breakup['net_premium'] + premium_breakup['service_tax'];
            objServiceHandler.Premium_Breakup = premium_breakup;
            console.log('premium breakup' + JSON.stringify(premium_breakup));
            objServiceHandler.Insurer_Transaction_Identifier = 'Complete';
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
KotakOEMMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {

    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var Insurer_Id = specific_insurer_object['insurer_id'];
        var Master_Db_List = objProduct.insurer_master_object['insurer_id_' + Insurer_Id]['master_db_list'];
        var Insurer_Vehicle_ExShowRoom = Master_Db_List['vehicles']['pb_db_master']['ExShoroomPrice'];
        var Vehicle_Depreciation_Range = {
            'Age_0': '5',
            'Age_1': '15',
            'Age_2': '20',
            'Age_3': '30',
            'Age_4': '40',
            'Age_5': '50',
            'Age_6': '55',
            'Age_7': '60',
            'Age_8': '65',
            'Age_9': '70',
            'Age_10': '75',
            'Age_11': '80',
            'Age_12': '85'
        };
        var Idv = 0;
        if (Insurer_Vehicle_ExShowRoom != '') {
            var Vehicle_Age_Year = this.vehicle_age_year();
            if (Vehicle_Age_Year < 1) {
                Vehicle_Age_Year = 0;
            } else if (Vehicle_Age_Year > 10) {
                Vehicle_Age_Year = null;
            }

            var Applied_Year = Vehicle_Age_Year - 0;
            Idv = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + Applied_Year]) / 100);
        }
        var Db_Idv_Calculated = {
            "Idv_Normal": Idv,
            "Idv_Min": Math.round(Idv * 0.9),
            "Idv_Max": Math.round(Idv * 1.10),
            "Exshowroom": Insurer_Vehicle_ExShowRoom
        };
        this.insurer_vehicle_idv_handler(Db_Idv_Calculated, objProduct, Insurer_Object, specific_insurer_object);
        console.log('Finish', this.constructor.name, 'insurer_vehicle_idv', Db_Idv_Calculated);
        return Db_Idv_Calculated;
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', ex);
    }
};
KotakOEMMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };

    var Error_Msg = 'NO_ERR';
    try {
        if (this.lm_request['vehicle_insurance_type'] === "new" && (this.prepared_request['chassis_number']).length !== 17) {
            Error_Msg = "For New Buisness Chassis Number Should be 17 Charater.";
        }
        if ((config.environment.hasOwnProperty('kotak_pg_type') && config.environment.kotak_pg_type === "rzrpay") && !this.lm_request.hasOwnProperty('pay_from')) {
            if ((objPremiumService.hasOwnProperty('status') && objPremiumService.hasOwnProperty('id') && objPremiumService['id'].includes('order_'))) {
            } else if (objPremiumService.hasOwnProperty('status') && objPremiumService['status'] !== 'created') {
                Error_Msg = 'Razorpay Order Not Created';
            } else {
                Error_Msg = 'Razorpay Order Not Created';
            }
        }
        /*
         var merchant_key = 'BC50nb';
         var salt = 'Bwxo1cPe';
         var merchant_id = '4825050';
         var final_premium = this.lm_request['final_premium'];
         */if (Error_Msg === 'NO_ERR') {
            var strHash = this.convert_to_sha512(this.randomNumeric(10) + moment().format('MM-DD-YYYY h:mm a'));
            var txnid1 = strHash.toString().substring(0, 20).toLowerCase();

            if (config.environment.hasOwnProperty('kotak_pg_type') && config.environment.kotak_pg_type === "rzrpay" && !this.lm_request.hasOwnProperty('pay_from')) {
                var merchant_key = config.razor_pay.rzp_kotak.username;
                var razorpay_response = objPremiumService;
                var pg_data = {
                    'key': merchant_key,
                    'full_name': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                    'return_url': this.const_payment.pg_ack_url, //'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'], //this.const_payment.pg_ack_url, //
                    'phone': this.lm_request['mobile'],
                    'orderId': razorpay_response["id"],
                    'txnId': this.lm_request['udid'] + ',' + this.lm_request['crn'] + ',' + this.lm_request['proposal_id'] + ',' + this.lm_request['insurer_id'],
                    'quoteId': txnid1,
                    'amount': this.lm_request['final_premium'], //[7582].indexOf(parseInt(this.lm_request['ss_id'])) > -1 ? (1 * 100) : this.lm_request['final_premium']
                    'email': this.lm_request['email'],
                    'img_url': 'https://www.policyboss.com/Health/assets/images/PolicyBoss-Logo.jpg',
                    'pg_type': "rzrpay",
                    'transfer_id': razorpay_response.hasOwnProperty('transfers') && razorpay_response['transfers'][0].hasOwnProperty('status') && razorpay_response['transfers'][0]['status'] === "created" ? razorpay_response['transfers'][0]['id'] : ""
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_order = objPremiumService;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Payment.pg_url = "";
                objServiceHandler.Insurer_Transaction_Identifier = '';
            } else if (this.lm_request.hasOwnProperty('pay_from') && this.lm_request['pay_from'] === 'wallet') {
                var pg_data = {
                    'ss_id': this.lm_request['ss_id'],
                    'crn': this.lm_request['crn'],
                    'User_Data_Id': this.lm_request['udid'],
                    'product_id': this.lm_request['product_id'],
                    'premium_amount': ([819, 8067].indexOf(parseInt(this.lm_request['ss_id'])) > -1) ? 1 : this.lm_request['final_premium'],
                    'customer_name': this.lm_request['first_name'] + " " + this.lm_request['last_name'],
                    'txnid': txnid1
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'GET';
                objServiceHandler.Payment.pg_url = ((config.environment.name !== 'Production') ? "http://qa.policyboss.com/TransactionDetail_Form/index.html" : "");
            } else {
                var merchant_key = ((config.environment.name === 'Production') ? 'si7yXM' : 'an7rIU');
                var productinfo = 'kotak';
                var final_premium = this.lm_request['final_premium'];
                var salt = ((config.environment.name === 'Production') ? 'pJnQiKCg' : '8MUr8LS7');
                var hashSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10';
                var str = hashSequence.split('|');
                var hash_string = '';
                for (var hash_var in str) {
                    if (str[hash_var] === "key")
                    {
                        hash_string = hash_string + merchant_key;
                        hash_string = hash_string + '|';
                    } else if (str[hash_var] === "txnid")
                    {
                        hash_string = hash_string + txnid1;
                        hash_string = hash_string + '|';
                    } else if (str[hash_var] === "amount")
                    {
                        hash_string = hash_string + final_premium;
                        hash_string = hash_string + '|';
                    } else if (str[hash_var] === "productinfo")
                    {
                        hash_string = hash_string + productinfo;
                        hash_string = hash_string + '|';
                    } else if (str[hash_var] === "firstname")
                    {
                        hash_string = hash_string + this.lm_request['first_name'];
                        hash_string = hash_string + '|';
                    } else if (str[hash_var] === "email")
                    {
                        hash_string = hash_string + this.lm_request['email'];
                        hash_string = hash_string + '|';
                    } else
                    {
                        hash_string = hash_string + '';
                        hash_string = hash_string + '|';
                    }
                }
                hash_string = hash_string + salt;
                var hash1 = this.convert_to_sha512(hash_string).toLowerCase();
                console.log('hash_string -- >' + hash_string);

                var pg_data = {
                    'firstname': this.lm_request['first_name'],
                    'lastname': this.lm_request['last_name'],
                    'surl': this.const_payment.pg_ack_url, //'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'], //
                    'phone': this.lm_request['mobile'],
                    'key': merchant_key,
                    'hash': hash1,
                    'curl': this.const_payment.pg_ack_url, //'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'], //
                    'furl': this.const_payment.pg_ack_url, //'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'], //
                    'txnid': txnid1,
                    'productinfo': productinfo,
                    'amount': final_premium,
                    'email': this.lm_request['email']
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = txnid1;//objPremiumService['vQuoteId'] + '-' + objPremiumService['vWorkFlowID'];
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
}
KotakOEMMotor.prototype.pg_response_handler_NIU2110 = function () {

    try {
        var objInsurerProduct = this;
        var output = this.const_payment_response.pg_post;
        //this.const_policy.transaction_id = output['mihpayid'];
        if (output['status'] === 'success') {
            this.const_policy.transaction_amount = output['amount'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.pg_reference_number_1 = output['addedon'];
            this.const_policy.pg_reference_number_2 = output['mihpayid'];
            this.const_policy.transaction_id = output['bank_ref_num'];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
KotakOEMMotor.prototype.pg_response_handler = function () {
    try {
        let objInsurerProduct = this;
        let output;
        if (objInsurerProduct.const_payment_response.hasOwnProperty('pg_data') && objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response.pg_data.pg_type === "rzrpay") {
            output = objInsurerProduct.const_payment_response.pg_get;
        } else {
            output = objInsurerProduct.lm_request.pg_post;
        }
        //this.const_policy.transaction_id = output['mihpayid'];
        if (objInsurerProduct.const_payment_response.hasOwnProperty('pg_data') && objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response.pg_data.pg_type === "rzrpay") {
            if (output['Status'] === 'Success') {
                this.const_policy.transaction_amount = objInsurerProduct.const_payment_response.pg_data.amount;
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.pg_reference_number_1 = this.proposal_processed_request['___current_date___'];
//                this.const_policy.pg_reference_number_2 = output['OrderId'];
                this.const_policy.pg_reference_number_2 = objInsurerProduct.const_payment_response.pg_data.transfer_id;
                this.const_policy.transaction_id = output['PayId'].toString();
                this.const_policy.policy_number = objInsurerProduct.const_payment_response.pg_data.quoteId;
                if (output.hasOwnProperty('Signature') && output.Signature) {
                    var secret_key = config.razor_pay.rzp_kotak.password;
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
        } else if (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === 'wallet') {
            if (output['status'] === 'Success') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_id = output['txnid'].toString();
                this.const_policy.transaction_amount = output['amount'];//amount
                this.const_policy.pg_reference_number_1 = this.proposal_processed_request['___current_date___'];
                this.const_policy.pg_reference_number_2 = output['order_id'];//
                this.const_policy.policy_number = objInsurerProduct.const_payment_response.pg_data.txnid;
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else {
            if (output['status'] === 'success') {
                this.const_policy.transaction_amount = output['amount'];
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.pg_reference_number_1 = output['addedon'];
                this.const_policy.pg_reference_number_2 = output['mihpayid'];
                this.const_policy.transaction_id = output['bank_ref_num'];
            } else if (output['status'] === 'failure') {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
                this.const_policy.pg_message = output['field9'];
            }
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex.stack);
    }
};

KotakOEMMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    var pdf = require('html-pdf');
    try {
        var sub = "";
        var Email = require('../../models/email');
        var objModelEmail = new Email();
        var product_name = 'CAR';
        if (this.lm_request['product_id'] === 10) {
            product_name = 'TW';
        }
        if (this.lm_request['product_id'] === 12) {
            product_name = 'CV';
        }
        if (this.const_policy.pg_status === 'FAIL') {

        }
        if (this.const_policy.pg_status === 'SUCCESS') {
            if (objResponseJson && objResponseJson.hasOwnProperty('PartnerIntegrationOutput')) {
                if (objResponseJson.PartnerIntegrationOutput.hasOwnProperty('PolicyNo') && objResponseJson.PartnerIntegrationOutput.hasOwnProperty('TransactionID') && objResponseJson.PartnerIntegrationOutput.hasOwnProperty('ProposalStatus')) {
                    if (objResponseJson.PartnerIntegrationOutput['ProposalStatus'][0] === "1") {
                        this.const_policy.policy_number = objResponseJson.PartnerIntegrationOutput['PolicyNo'][0];
                    } else {
                        Error_Msg = objResponseJson.PartnerIntegrationOutput['ErrMsg'][0];
                    }
                } else {
                    Error_Msg = objResponseJson.PartnerIntegrationOutput['ErrMsg'][0];
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }
            if (Error_Msg === 'NO_ERR') {
                this.const_policy.kotakoem_data = JSON.stringify(this['processed_request']);
                var policy_number = this.const_policy.policy_number;
                policy_number = policy_number.replace("/", "");
                this.const_policy.transaction_status = 'SUCCESS';
                if (this.lm_request['product_id'] === 10)
                {
                    this.const_policy.transaction_id = objResponseJson.PartnerIntegrationOutput['TransactionID'][0];
                    var product_name = 'CAR';
                    if (this.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    var policy_number = this.const_policy.policy_number.toString().replace('/', '');
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + policy_number + '.pdf';
                    var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
                    //var pdf_web_path_portal = config.environment.portalurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;
                    if (this.lm_request.hasOwnProperty('vehicle_insurance_subtype') && this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                        this.const_policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "KotakOEMMotor_FeedFile_" + policy_number + "_TP.csv";
                    } else {
                        this.const_policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "KotakOEMMotor_FeedFile_" + policy_number + "_RO_NB.csv";
                    }
                    var policysample = {
                        "1CH_0TP": "",
                        "0CH_1TP": "",
                        "2CH_0TP": "2",
                        "3CH_0TP": "3",
                        "1CH_4TP": "14"
                    };

                    var html_file_path = appRoot + "/resource/request_file/kotak_sample" + policysample[this.lm_request['vehicle_insurance_subtype']] + "_html.html";
                    var pdf_file_path = appRoot + "/tmp/pdf/KotakOEM_TW_temp" + policy_number + ".pdf";
                    //var pdf_file_path = appRoot + "/tmp/pdf/" + this.constructor.name + '_' + product_name + '_POLICY_' + policy_number + '.pdf';
                    var htmlPol = fs.readFileSync(html_file_path, 'utf8');
                    var pdf_tmp_file_name = "KotakOEM_TW_temp" + policy_number + ".pdf";

                    var User_Data = require(appRoot + '/models/user_data');
                    var objProduct = this;

                    User_Data.findOne({"Request_Unique_Id": this.lm_request['search_reference_number']}, function (err, dbUserData) {
                        var objInsurerProduct = this;
                        var state_code = {
                            "ANDAMAN-NICOBAR": "35",
                            "ANDHRA PRADESH": "37",
                            "ARUNACHAL PRADESH": "12",
                            "ASSAM": "18",
                            "BIHAR": "10",
                            "CHANDIGARH": "4",
                            "CHHATTISGARH": "22",
                            "DADRA & NAGAR HAVELI": "26",
                            "DAMAN & DIU": "25",
                            "DELHI": "7",
                            "GOA	": "30",
                            "GUJARAT": "24",
                            "HARYANA": "6",
                            "HIMACHAL PRADESH": "2",
                            "JAMMU KASHMIR": "1",
                            "JHARKHAND": "20",
                            "KARNATAKA": "29",
                            "KERALA": "32",
                            "LAKSHADWEEP": "31",
                            "MADHYA PRADESH": "23",
                            "MAHARASHTRA": "27",
                            "MANIPUR": "14",
                            "MEGHALAYA": "17",
                            "MIZORAM": "15",
                            "NAGALAND": "13",
                            "ORISSA": "21",
                            "PONDICHERRY": "34",
                            "PUNJAB": "3",
                            "RAJASTHAN": "8",
                            "SIKKIM": "11",
                            "TAMILNADU": "33",
                            "TRIPURA": "16",
                            "UTTAR PRADESH": "9",
                            "UTTARAKHAND": "5",
                            "WEST BENGAL": "19",
                            "TELANGANA": "36"
                        };
                        var Vehicle_Depreciation_Range = {
                            'Age_0': '5',
                            'Age_1': '15',
                            'Age_2': '20',
                            'Age_3': '30',
                            'Age_4': '40',
                            'Age_5': '50',
                            'Age_6': '55',
                            'Age_7': '60',
                            'Age_8': '65',
                            'Age_9': '70',
                            'Age_10': '75',
                            'Age_11': '80',
                            'Age_12': '85'
                        };

                        var Vehicle_Age_Year = objProduct.vehicle_age_year();
                        var Insurer_Vehicle_ExShowRoom = parseInt(dbUserData['Processed_Request']['___dbmaster_pb_exshoroomprice___']);
                        var Idv_2 = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + (parseInt(Vehicle_Age_Year) + 1)]) / 100);
                        var Idv_3 = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + (parseInt(Vehicle_Age_Year) + 2)]) / 100);

                        var Processed_Request = {
                            '___dbmaster_insurer_vehicle_make_name___': dbUserData['Processed_Request']['___dbmaster_insurer_vehicle_make_name___'],
                            '___dbmaster_insurer_vehicle_model_name___': dbUserData['Processed_Request']['___dbmaster_insurer_vehicle_model_name___'],
                            '___dbmaster_insurer_vehicle_variant_name___': dbUserData['Processed_Request']['___dbmaster_insurer_vehicle_variant_name___'],
                            '___dbmaster_insurer_rto_city_name___': dbUserData['Processed_Request']['___dbmaster_insurer_rto_city_name___'],
                            '___dbmaster_insurer_vehicle_cubiccapacity___': dbUserData['Processed_Request']['___dbmaster_insurer_vehicle_cubiccapacity___'],
                            '___dbmaster_insurer_vehicle_seatingcapacity___': dbUserData['Processed_Request']['___dbmaster_insurer_vehicle_seatingcapacity___'],
                            '___total_deductible___': 1000 + parseInt(dbUserData.Erp_Qt_Request_Core['___voluntary_deductible___'])
                        };

                        if (dbUserData) {
                            //process for pg_data
                            //var Processed_Request = dbUserData.Processed_Request;
                            var Erp_Qt_Request_Core = dbUserData.Erp_Qt_Request_Core;
                            var objaddon = {

                            };
                            var PolicyTPTenure = 0;
                            var PolicyODTenure = 0;
                            var BreakinDay = 0;
                            if (Erp_Qt_Request_Core['___is_breakin___'] === "yes") {
                                BreakinDay = 2;
                            }
                            if (parseInt(Erp_Qt_Request_Core['___policy_tp_tenure___']) > 1) {
                                PolicyTPTenure = parseInt(Erp_Qt_Request_Core['___policy_tp_tenure___']) - 1;
                            }
                            if (parseInt(Erp_Qt_Request_Core['___policy_od_tenure___']) > 1) {
                                PolicyODTenure = parseInt(Erp_Qt_Request_Core['___policy_od_tenure___']) - 1;
                            }
                            var qr_text = 'Policy Number: ' + objProduct.const_policy.policy_number.toString() + '+Customer Name:' + Erp_Qt_Request_Core['___first_name___'] + ' ' + Erp_Qt_Request_Core['___middle_name___'] + ' ' + Erp_Qt_Request_Core['___last_name___'] + '+Engine no:' + Erp_Qt_Request_Core['___engine_number___'] + '+Chassis Number:' + Erp_Qt_Request_Core['___chassis_number___'] + '+Vehicle Number:' + Erp_Qt_Request_Core['___registration_no___'] + '+Policy Start date:' + moment(Erp_Qt_Request_Core['___policy_start_date___']).format("DD/MM/YYYY") + "00:00" + '+Policy end date:' + moment(Erp_Qt_Request_Core['___policy_end_date___']).format("DD/MM/YYYY") + "23:59";
                            var qr_url = 'https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=' + encodeURI(qr_text) + '&chld=L|1&choe=UTF-8';
                            var qr_url1 = 'https://chart.googleapis.com/chart?chs=40x40&cht=qr&chl=' + encodeURI(pdf_web_path_portal) + '&chld=L|1&choe=UTF-8';

                            var replacedata = {
                                '___qr_url___': qr_url,
                                '___total_idv_2___': Idv_2,
                                '___total_idv_3___': Idv_3,
                                '___qr_url1___': qr_url1,
                                '___show_paod___': (Erp_Qt_Request_Core['___is_pa_od___'] === "yes" && Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'] > 0) ? "" : "display:none;",
                                '___pa_od_si___': (Erp_Qt_Request_Core['___is_pa_od___'] === "yes" && Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'] > 0) ? "15,00,000" : "0",
                                '___show_tppd___': (Erp_Qt_Request_Core['___is_tppd___'] === "yes" && Erp_Qt_Request_Core['___premium_breakup_tp_cover_tppd___'] > 0) ? "" : "display:none;",
                                '___damage_tppd___': (Erp_Qt_Request_Core['___is_tppd___'] === "yes" && Erp_Qt_Request_Core['___premium_breakup_tp_cover_tppd___'] > 0) ? "6,000" : "1,00,000",
                                '___premium_breakup_addon_engine_protector_cover___': Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "no" ? "0" : Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'],
                                '___premium_breakup_addon_consumable_cover___': Erp_Qt_Request_Core['___addon_consumable_cover___'] === "no" ? "0" : Erp_Qt_Request_Core['___premium_breakup_addon_consumable_cover___'],
                                '___premium_breakup_addon_zero_dep_cover___': Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "no" ? "0" : Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'],
                                '___gst_show___': state_code[Erp_Qt_Request_Core['___communication_state___']] === "7" ? "style='display:none;'" : "",
                                '___cs_gst_show___': state_code[Erp_Qt_Request_Core['___communication_state___']] === "7" ? "" : "style='display:none;'",
                                '___tp_uin_show___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'].indexOf('0CH') > -1 ? "display:none;" : "",
                                '___od_uin_show___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'].indexOf('0CH') > -1 ? "" : "display:none;",
                                '___display_ncb_block___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'].indexOf('0CH') > -1 ? "none;" : "block;",
                                '___premium_breakup_od_final_premium___': Erp_Qt_Request_Core['___premium_breakup_od_final_premium___'] + Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___'],
                                '___registration_no___': Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "new" ? "NEW" : Erp_Qt_Request_Core['___registration_no___'],
                                "___permanent_state_cd___": state_code[Erp_Qt_Request_Core['___permanent_state___']],
                                '___policy_start_date___': moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(BreakinDay)).format("DD/MM/YYYY"),
                                '___policy_end_date___': moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(BreakinDay)).add('years', parseInt(PolicyTPTenure)).format("DD/MM/YYYY"),
                                '___od_policy_start_date___': moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(BreakinDay)).format("DD/MM/YYYY"),
                                '___od_policy_end_date___': moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(BreakinDay)).add('years', parseInt(PolicyODTenure)).format("DD/MM/YYYY"),
                                '___tp_policy_start_date___': moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(BreakinDay)).format("DD/MM/YYYY"),
                                '___tp_policy_end_date___': moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(BreakinDay)).add('years', parseInt(PolicyTPTenure)).format("DD/MM/YYYY"),
                                '___policy_start_date_1___': moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(BreakinDay)).format("DD/MM/YYYY"),
                                '___policy_end_date_1___': moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(BreakinDay)).format("DD/MM/YYYY"),
                                '___policy_start_date_2___': moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(BreakinDay)).add('years', 1).format("DD/MM/YYYY"),
                                '___policy_end_date_2___': moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(BreakinDay)).add('years', 1).format("DD/MM/YYYY"),
                                '___policy_start_date_3___': moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(BreakinDay)).add('years', 2).format("DD/MM/YYYY"),
                                '___policy_end_date_3___': moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(BreakinDay)).add('years', 2).format("DD/MM/YYYY"),
                                "___applicable_imt___": objProduct.applicable_imt(Erp_Qt_Request_Core),
                                '___vehicle_insurance_subtype_3___': objProduct.processed_request['___vehicle_insurance_subtype_3___'] ? objProduct.processed_request['___vehicle_insurance_subtype_3___'] : '(Liability Only Policy)',
                                '___pg_reference_number_1___': moment(objProduct.processed_request['___pg_reference_number_1___']).format("DD/MM/YYYY"),
                                '___stamp_date_1___': moment(objProduct.processed_request['___pg_reference_number_1___']).format("DD-MMM-YYYY").split('-')[0],
                                '___stamp_date_2___': moment(objProduct.processed_request['___pg_reference_number_1___']).format("DD-MMM-YYYY").split('-')[1],
                                '___stamp_date_3___': moment(objProduct.processed_request['___pg_reference_number_1___']).format("DD-MMM-YYYY").split('-')[2],
                                '___pg_reference_number_2___': objProduct.processed_request['___pg_reference_number_2___'],
                                '___transaction_id___': objProduct.processed_request['___transaction_id___'],
                                '___basic_tp_including_tppd___': (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_basic___'] - 0) + (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_paid_driver_pa___'] - 0),
                                '___policy_number___': objProduct.const_policy.policy_number.toString(),
                                '___total_idv___': (dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'] - 0) + (dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'] - 0) + (dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'] - 0),
                                '___total_basic_od___': (dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_basic___'] - 0) - (dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc___'] - 0),
                                '___cgst___': Math.round((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 2),
                                '___sgst___': Math.round((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 2)

                            };
                            for (var addon in objProduct.addon_processed_request) {
                                objaddon['___' + addon + '_amt___'] = 'NA';
                                if (objProduct.prepared_request[addon + '_amt'] - 0 > 0) {
                                    objaddon['___' + addon + '_amt___'] = objProduct.prepared_request[addon + '_amt'] - 0;
                                }
                            }
                            htmlPol = htmlPol.toString().replaceJson(replacedata);
                            htmlPol = htmlPol.toString().replaceJson(objaddon);
                            htmlPol = htmlPol.toString().replaceJson(Processed_Request);
                            htmlPol = htmlPol.toString().replaceJson(Erp_Qt_Request_Core);
                            console.log("KotakMotor HTML :: ");
                            console.log(htmlPol);
                            var html_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + "KotakOEM_TW_" + policy_number + ".html";
                            var html_pdf_file_path = appRoot + "/tmp/pdf/KotakOEM_TW_" + policy_number + ".html";

                            var options = {
                                "format": "A4",
                                "border": {"top": "5mm", "right": "5mm", "bottom": "3mm", "left": "5mm"},
                                "timeout": 50000
                            };
                            var sleep = require('system-sleep');
                            sleep(2000);
                            var fs = require('fs');
                            var request_html_file = fs.writeFileSync(html_pdf_file_path, htmlPol);
                            sleep(2000);
                            try {
                                var http = require('http');
                                console.log('PdfUrl');
                                //var insurer_pdf_url = "http://qa.policyboss.com:3000/html2pdf?o=download&u=http://qa-horizon.policyboss.com:3000/tmp/invoice/123.html";
                                //var insurer_pdf_url = "http://qa.policyboss.com:3000/html2pdf?o=download&u=http://qa-horizon.policyboss.com:3000/pdf-files/policy/KotakOEM_TW_LPB2006221015374.html";
                                var insurer_pdf_url = config.environment.pdf_url + html_web_path_portal;
                                var file_horizon = fs.createWriteStream(pdf_file_path);
                                var request_horizon = http.get(insurer_pdf_url, function (response) {
                                    response.pipe(file_horizon);

                                    //pdf.create(htmlPol, options).toFile(pdf_file_path, function (err, res) {
                                    //if (err)
                                    //return console.log(err);
                                    //else {
                                    //var bitmap = fs.readFileSync(pdf_file_path);
                                    //var pdf_binary_data = Buffer.from(bitmap).toString('base64');                                    

                                    //fs.writeFileSync(html_pdf_file_path, htmlPol);

                                    var args = {
                                        data: {
                                            "search_reference_number": objProduct.lm_request['search_reference_number'],
                                            "api_reference_number": objProduct.lm_request['api_reference_number'],
                                            "policy_number": objProduct.const_policy.policy_number,
                                            "transaction_id": objProduct.const_policy.transaction_id,
                                            "transaction_pg": objProduct.const_policy.transaction_id,
                                            "pg_reference_number_1": objProduct.const_policy.pg_reference_number_1,
                                            "pg_reference_number_2": objProduct.const_policy.pg_reference_number_2,
                                            "pdf_binary_data_file": pdf_tmp_file_name,
                                            'client_key': objProduct.lm_request['client_key'],
                                            'secret_key': objProduct.lm_request['secret_key'],
                                            'insurer_id': objProduct.lm_request['insurer_id'],
                                            'email': objProduct.lm_request['email'],
                                            'mobile': objProduct.lm_request['mobile'],
                                            'method_type': 'Pdf',
                                            'execution_async': 'no'
                                        },
                                        headers: {
                                            "Content-Type": "application/json",
                                            'client_key': objProduct.lm_request['client_key'],
                                            'secret_key': objProduct.lm_request['secret_key']
                                        }
                                    };
                                    objProduct.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc_portal);
                                    //}
                                    //console.log(res);
                                });
                            } catch (ex1) {
                                console.error('Exception', this.constructor.name, 'verification_response_handler', ex1);
                            }

//                    options = {};
//                    pdf.create(htmlPol, options).then((pdf) => pdf.toFile(pdf_file_path));
                            //START Feed File Code=========================================================================================
                            if (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_subtype___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'].indexOf('0CH') > -1) {
                                var ff_file_name = "KotakOEMMotor_FeedFile_" + policy_number + "_TP.csv";
                            } else {
                                var ff_file_name = "KotakOEMMotor_FeedFile_" + policy_number + "_RO_NB.csv";
                            }
                            var ff_web_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                            if (config.environment.name === 'Production' || config.environment.name === 'QA') {
                                ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                            }
                            var ff_name_web_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;

                            var OccupationCode = {
                                "BUSINESS": "1",
                                "SALARIED": "2",
                                "PROFESSIONAL": "3",
                                "STUDENT": "4",
                                "HOUSEWIFE": "5",
                                "RETIRED": "6",
                                "OTHERS": "7"
                            };
                            var nominee_dob = dbUserData.Erp_Qt_Request_Core['___nominee_birth_date___'].split("-");
                            var User_Data = require(appRoot + '/models/user_data');
                            var csvjson = require('csvjson');
                            var writeFile = require('fs').writeFile;
                            var fs = require('fs');
                            var data_list = [];
                            if (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'].indexOf('0CH') > -1) {
                                var data_csv = {
                                    "Unique ID": dbUserData.Erp_Qt_Request_Core['___crn___'],
                                    "Customer ID": "",
                                    "Customer Type": objProduct.processed_request['___vehicle_registration_type___'],
                                    "Title": dbUserData.Erp_Qt_Request_Core['___salutation___'],
                                    "First Name": dbUserData.Erp_Qt_Request_Core['___first_name___'],
                                    "Middle Name": dbUserData.Erp_Qt_Request_Core['___middle_name___'],
                                    "Last Name": dbUserData.Erp_Qt_Request_Core['___last_name___'],
                                    "Company Name": "",
                                    "Contact Person": "",
                                    "Date of Birth (DD/MM/YYYY)": moment(dbUserData.Erp_Qt_Request_Core['___birth_date___']).format("DD/MM/YYYY"),
                                    "Email ID": dbUserData.Erp_Qt_Request_Core['___email___'],
                                    "Mobile": dbUserData.Erp_Qt_Request_Core['___mobile___'],
                                    "Gender": dbUserData.Erp_Qt_Request_Core['___gender___'] === "F" ? "Female" : "Male",
                                    "Marital Status": dbUserData.Erp_Qt_Request_Core['___marital_text___'],
                                    "Occupation": OccupationCode[dbUserData.Erp_Qt_Request_Core['___occupation___']],
                                    "Pan Card/ TAN Nos": dbUserData.Erp_Qt_Request_Core['___pan___'],
                                    "ID Proof": "3",
                                    "Proof ID Detail": "99999",
                                    "eIA Account Nos": "",
                                    "Kotak Group Employee": "",
                                    "Organization Name": "",
                                    "Employee Number": "",
                                    "Are you Kotak Group Customer": "",
                                    "Kotak Organization Name": "",
                                    "Kotak Group CRN": "",
                                    "Parent Customer ID": "",
                                    "Address Line 1": dbUserData.Erp_Qt_Request_Core['___communication_address_1___'],
                                    "Address Line 2": dbUserData.Erp_Qt_Request_Core['___communication_address_2___'],
                                    "Address Line 3": dbUserData.Erp_Qt_Request_Core['___communication_address_3___'],
                                    "Landmark": "",
                                    "pincode": dbUserData.Erp_Qt_Request_Core['___communication_pincode___'],
                                    "Bank Name": "",
                                    "Bank A/C No": "",
                                    "IFSC Code": "",
                                    "Business Type": "Liability Only",
                                    "Source Type": "Aggregator",
                                    "IMD_FU_Flag": "P",
                                    "IMD code": "3159270000",
                                    "FU code": "",
                                    "IMD location code": "0004",
                                    "Lead Generator": "",
                                    "Partner Application No": objProduct.const_policy.policy_number.toString(),
                                    "Partner Application Date": objProduct.processed_request['___pg_reference_number_1___'],
                                    "Branch Inward Number": "",
                                    "Branch Inward Date": "",
                                    "Policy Term": dbUserData.Erp_Qt_Request_Core['___policy_tenure___'],
                                    "Policy Start Date": moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(BreakinDay)).format("DD/MM/YYYY"),
                                    "Policy Start Time": "00:00",
                                    "Policy Expiry Date": moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(BreakinDay)).add('years', parseInt(PolicyTPTenure)).format("DD/MM/YYYY"),
                                    "Policy Expiry Time": "23:59",
                                    "Service Tax Applicable": "No",
                                    "ST Exemption Reason": "",
                                    "NoPIP_Flag": dbUserData.Erp_Qt_Request_Core['___is_policy_exist___'] === "yes" ? "Yes" : "No", //Yes/No
                                    "PYP Type": "Comprehensive",
                                    "PYPPolicyNo": dbUserData.Erp_Qt_Request_Core['___previous_policy_number___'],
                                    "PYPInsurer": objProduct.processed_request['___dbmaster_previousinsurer_code___'],
                                    "PYP Address": objProduct.processed_request['___dbmaster_pb_previousinsurer_address___'],
                                    "PYP_Policy_Tenure": "Annual",
                                    "PYP_StartDate": objProduct.processed_request['___pre_policy_start_date___'],
                                    "PYP_End_Date": objProduct.processed_request['___policy_expiry_date___'],
                                    "Previous_NCB": dbUserData.Erp_Qt_Request_Core['___vehicle_ncb_current___'],
                                    "Total_Claim_Count": "No Claim",
                                    "RTO location": dbUserData.Erp_Qt_Request_Core['___registration_no_1___'] + dbUserData.Erp_Qt_Request_Core['___registration_no_2___'],
                                    "Make": objProduct.processed_request['___dbmaster_insurer_vehicle_make_code___'].toString(),
                                    "Model": objProduct.processed_request['___dbmaster_insurer_vehicle_model_code___'].toString(),
                                    "Variant": objProduct.processed_request['___dbmaster_insurer_vehicle_variant_code___'].toString(),
                                    "Engine No": dbUserData.Erp_Qt_Request_Core['___engine_number___'].toString(),
                                    "Chassis No": dbUserData.Erp_Qt_Request_Core['___chassis_number___'].toString(),
                                    "Registration Number - Others": "",
                                    "RegistrationNos": dbUserData.Erp_Qt_Request_Core['___registration_no_1___'] + dbUserData.Erp_Qt_Request_Core['___registration_no_2___'] + dbUserData.Erp_Qt_Request_Core['___registration_no_3___'] + dbUserData.Erp_Qt_Request_Core['___registration_no_4___'],
                                    "Year of Manufacturer": dbUserData.Erp_Qt_Request_Core['___vehicle_manf_year___'],
                                    "Date of Registration/ Invoice": objProduct.processed_request['___vehicle_registration_date___'],
                                    "External CNG/LPG kit (Yes/No)": "No",
                                    "Type of Policyholder": "Individual Owner",
                                    "Special Condtion": "",
                                    "Main Driver": "Self - Owner Driver",
                                    "InsuredhasDrivingLicense": "Yes",
                                    "Driver_First_Name": "",
                                    "Driver_Last_Name": "",
                                    "Driver_Age": "",
                                    "PA to OD": dbUserData.Erp_Qt_Request_Core['___is_pa_od___'] === "yes" ? "Yes" : "No",
                                    "NomineeName": dbUserData.Erp_Qt_Request_Core['___nominee_name___'],
                                    "NomineeDOB(DD/MM/YYYY)": nominee_dob[2] + '/' + nominee_dob[1] + '/' + nominee_dob[0],
                                    "Relationship": dbUserData.Erp_Qt_Request_Core['___nominee_relation___'] === "Aunt" ? "Aunty" : dbUserData.Erp_Qt_Request_Core['___nominee_relation___'],
                                    "PAOwnDriverAppointeeName": "",
                                    "PAOwnDriverAppointeeRelation": "",
                                    "LL_NoOfPaidDriver": "",
                                    "LL_NoPaidDriver_Employee": "",
                                    "PAtoUnnamed_Pillion_SI_Per Person_IMT_18": "",
                                    "NoOfUnname_Pillion": "",
                                    "PAtoPaidDriver_SI_Per_Person": "",
                                    "NoofPaidDriver_PA": "",
                                    "PAtoUnnmaed_Persons_IMT_16": "",
                                    "NoofUnnamed_persons": "",
                                    "IsBangladeshCovered": "",
                                    "IsBhutanCovered": "",
                                    "IsMaldivesCovered": "",
                                    "IsNepalCovered": "",
                                    "IsPakistanCovered": "",
                                    "IsSriLankaCovered": "",
                                    "ExtTPPD": (dbUserData.Erp_Qt_Request_Core['___is_tppd___'] === "yes" && dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_tppd___'] > 0) ? "Yes" : "No",
                                    "Financier_Name": dbUserData.Erp_Qt_Request_Core['___financial_institute_name___'],
                                    "Financier_Agreement_Type": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'],
                                    "Financier Address": dbUserData.Erp_Qt_Request_Core['___financial_institute_city___'],
                                    "Loan Account Nos": "",
                                    "File Nos": "",
                                    "TotalTPPremium": dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_final_premium___'].toString(),
                                    "Net Premium": dbUserData.Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString(),
                                    "Service Tax/ Sales Tax": dbUserData.Erp_Qt_Request_Core['___premium_breakup_service_tax___'].toString(),
                                    "Total Premium": dbUserData.Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                                    "Pre inspection Number": "",
                                    "Preinspection Date & time": "",
                                    "Inspection Agency": "",
                                    "Preinspection Status": "",
                                    "Receipt number": "",
                                    "Mode of Entry": "",
                                    "Payment Mode": "Payment Aggregator",
                                    "Payer Type": "Customer",
                                    "Customer ID (Parent)": "",
                                    "Intermediary ID (Parent)": "",
                                    "Receipt Relationship": "",
                                    "Receipt Amount": dbUserData.Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                                    "Is GBM Receipt?": "No",
                                    "GBM Reference NO": "",
                                    "Cheque Number/Transaction Reference No/DD No": objProduct.processed_request['___pg_reference_number_2___'],
                                    "Cheque Date/DD/Transaction Date": objProduct.processed_request['___pg_reference_number_1___'],
                                    "Merchant ID": "",
                                    "Receipt IFSC Code": "",
                                    "Receipt Bank Name": "",
                                    "Bank Location": "",
                                    "Branch Name": "",
                                    "Cheque Type": "",
                                    "House Bank": "",
                                    "CD No": "",
                                    "GST Number": "",
                                    "PRODUCT_TYPE": objProduct.processed_request['___vehicle_insurance_subtype_2___'],
                                    "PA_OD_TENURE": ""//dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'].toString() === "new" ? "1" : dbUserData.Erp_Qt_Request_Core['___policy_tp_tenure___'].toString()
                                };

                            } else {
                                var data_csv = {
                                    "Unique ID": dbUserData.Erp_Qt_Request_Core['___crn___'],
                                    "Customer ID": "",
                                    "Customer Type": objProduct.processed_request['___vehicle_registration_type___'],
                                    "Title": dbUserData.Erp_Qt_Request_Core['___salutation___'],
                                    "First Name": dbUserData.Erp_Qt_Request_Core['___first_name___'],
                                    "Middle Name": dbUserData.Erp_Qt_Request_Core['___middle_name___'],
                                    "Last Name": dbUserData.Erp_Qt_Request_Core['___last_name___'],
                                    "Company Name": "",
                                    "Contact Person": "",
                                    "Date of Birth (DD/MM/YYYY)": moment(dbUserData.Erp_Qt_Request_Core['___birth_date___']).format("DD/MM/YYYY"),
                                    "Email ID": dbUserData.Erp_Qt_Request_Core['___email___'],
                                    "Mobile": dbUserData.Erp_Qt_Request_Core['___mobile___'],
                                    "Gender": dbUserData.Erp_Qt_Request_Core['___gender___'] === "F" ? "Female" : "Male",
                                    "Marital Status": dbUserData.Erp_Qt_Request_Core['___marital_text___'],
                                    "Occupation": OccupationCode[dbUserData.Erp_Qt_Request_Core['___occupation___']],
                                    "Pan Card/ TAN Nos": dbUserData.Erp_Qt_Request_Core['___pan___'],
                                    "ID Proof": "3",
                                    "Proof ID Detail": "999999",
                                    "eIA Account Nos": "",
                                    "Kotak Group Employee": "",
                                    "Organization Name": "",
                                    "Employee Number": "",
                                    "Are you Kotak Group Customer": "",
                                    "Kotak Organization Name": "",
                                    "Kotak Group CRN": "",
                                    "Parent Customer ID": "",
                                    "Address Line 1": dbUserData.Erp_Qt_Request_Core['___communication_address_1___'],
                                    "Address Line 2": dbUserData.Erp_Qt_Request_Core['___communication_address_2___'],
                                    "Address Line 3": dbUserData.Erp_Qt_Request_Core['___communication_address_3___'],
                                    "Landmark": "",
                                    "pincode": dbUserData.Erp_Qt_Request_Core['___communication_pincode___'],
                                    "Bank Name": "",
                                    "Bank A/C No": "",
                                    "IFSC Code": "",
                                    "Business Type": objProduct.processed_request['___vehicle_insurance_type___'],
                                    "Source Type": "Aggregator",
                                    "IMD_FU_Flag": "P",
                                    "IMD code": "3159270000",
                                    "FU code": "",
                                    "IMD location code": "0004",
                                    "Lead Generator": "",
                                    "Partner Application No": objProduct.const_policy.policy_number.toString(),
                                    "Partner Application Date": objProduct.processed_request['___pg_reference_number_1___'],
                                    "Branch Inward Number": "",
                                    "Branch Inward Date": "",
                                    "Policy Term": dbUserData.Erp_Qt_Request_Core['___policy_tenure___'],
                                    "Policy Start Date": moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(BreakinDay)).format("DD/MM/YYYY"),
                                    "Policy Start Time": "00:00",
                                    "Policy Expiry Date": moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(BreakinDay)).add('years', parseInt(PolicyTPTenure)).format("DD/MM/YYYY"),
                                    "Policy Expiry Time": "23:59",
                                    "Service Tax Applicable": "No",
                                    "ST Exemption Reason": "",
                                    "NoPIP_Flag": dbUserData.Erp_Qt_Request_Core['___is_policy_exist___'] === "yes" ? "Yes" : "No", //Yes/No
                                    "PYP Type": "Comprehensive",
                                    "PYPPolicyNo": dbUserData.Erp_Qt_Request_Core['___previous_policy_number___'],
                                    "PYPInsurer": objProduct.processed_request['___dbmaster_previousinsurer_code___'],
                                    "PYP Address": objProduct.processed_request['___dbmaster_pb_previousinsurer_address___'],
                                    "PYP_Policy_Tenure": "Annual",
                                    "PYP_StartDate": objProduct.processed_request['___pre_policy_start_date___'],
                                    "PYP_End_Date": objProduct.processed_request['___policy_expiry_date___'],
                                    "NCB Flag (Y_N)": dbUserData.Erp_Qt_Request_Core['___is_claim_exists___'] === "yes" ? "No" : "Yes", //Yes/No
                                    "Previous_NCB": dbUserData.Erp_Qt_Request_Core['___vehicle_ncb_current___'],
                                    "Total_Claim_Count": "No Claim",
                                    "Claim Free Years": "",
                                    "RTO location": dbUserData.Erp_Qt_Request_Core['___registration_no_1___'] + dbUserData.Erp_Qt_Request_Core['___registration_no_2___'],
                                    "Make": objProduct.processed_request['___dbmaster_insurer_vehicle_make_code___'].toString(),
                                    "Model": objProduct.processed_request['___dbmaster_insurer_vehicle_model_code___'].toString(),
                                    "Variant": objProduct.processed_request['___dbmaster_insurer_vehicle_variant_code___'].toString(),
                                    "Engine No": dbUserData.Erp_Qt_Request_Core['___engine_number___'].toString(),
                                    "Chassis No": dbUserData.Erp_Qt_Request_Core['___chassis_number___'].toString(),
                                    "Registration Number - Others": "",
                                    "RegistrationNos": dbUserData.Erp_Qt_Request_Core['___registration_no_1___'] + dbUserData.Erp_Qt_Request_Core['___registration_no_2___'] + dbUserData.Erp_Qt_Request_Core['___registration_no_3___'] + dbUserData.Erp_Qt_Request_Core['___registration_no_4___'],
                                    "Year of Manufacturer": dbUserData.Erp_Qt_Request_Core['___vehicle_manf_year___'],
                                    "Date of Registration/ Invoice": objProduct.processed_request['___vehicle_registration_date___'],
                                    "First_Veh_IDV": dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString(),
                                    "ElectricAccIDV": dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString(),
                                    "NonElectricAccIDV": dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString(),
                                    "CNG/LPG kit Value": dbUserData.Erp_Qt_Request_Core['___external_bifuel_value___'].toString() === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___external_bifuel_value___'].toString(),
                                    "Loss of Accessories": "",
                                    "Type_Of_Policy_holder": "Individual Owner",
                                    "Cross_Sell_Discount": "",
                                    "Policy_No_Cross_Sell": "",
                                    "Credit_Scrore": "",
                                    "Market Movement": "0",
                                    "Return to Invoice": dbUserData.Erp_Qt_Request_Core['___addon_invoice_price_cover___'],
                                    "Depreciation Cover": dbUserData.Erp_Qt_Request_Core['___addon_zero_dep_cover___'],
                                    "Engine Protect": dbUserData.Erp_Qt_Request_Core['___addon_engine_protector_cover___'],
                                    "Consumable Cover": dbUserData.Erp_Qt_Request_Core['___addon_consumable_cover___'],
                                    "IsAntiTheftAttached": "",
                                    "Discount for Opting Soft Copy": "",
                                    "Voluntary_Deductible_Policy": "",
                                    "Voluntary_Deductible_Dep_Waiver": "",
                                    "Special Condtion": "",
                                    "Main Driver": "Self - Owner Driver",
                                    "InsuredhasDrivingLicense": "Yes",
                                    "Driver_First_Name": "NA",
                                    "Driver_Last_Name": "",
                                    "Driver_Age": "NA",
                                    "PA to OD": dbUserData.Erp_Qt_Request_Core['___is_pa_od___'] === "yes" ? "Yes" : "No",
                                    "NomineeName": dbUserData.Erp_Qt_Request_Core['___nominee_name___'],
                                    "NomineeDOB(DD/MM/YYYY)": nominee_dob[2] + '/' + nominee_dob[1] + '/' + nominee_dob[0],
                                    "Relationship": dbUserData.Erp_Qt_Request_Core['___nominee_relation___'] === "Aunt" ? "Aunty" : dbUserData.Erp_Qt_Request_Core['___nominee_relation___'],
                                    "PAOwnDriverAppointeeName": "",
                                    "PAOwnDriverAppointeeRelation": "",
                                    "LL_NoOfPaidDriver": "",
                                    "LL_NoPaidDriver_Employee": "",
                                    "PAtoUnnamed_Pillion_SI_Per Person": "",
                                    "NoOfUnnamed": "",
                                    "PAtoPaidDriver_SI_Per_Person": "",
                                    "NoofPaidDriver_PA": "",
                                    "LL_NoOfPersons": "",
                                    "LL_NoOfPersons_SI_Per_Person": "",
                                    "IsBangladeshCovered": "",
                                    "IsBhutanCovered": "",
                                    "IsMaldivesCovered": "",
                                    "IsNepalCovered": "",
                                    "IsPakistanCovered": "",
                                    "IsSriLankaCovered": "",
                                    "ExtTPPD": (dbUserData.Erp_Qt_Request_Core['___is_tppd___'] === "yes" && dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_tppd___'] > 0) ? "Yes" : "No",
                                    "Financier_Name": dbUserData.Erp_Qt_Request_Core['___financial_institute_name___'],
                                    "Financier_Agreement_Type": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'],
                                    "Financier Address": dbUserData.Erp_Qt_Request_Core['___financial_institute_city___'],
                                    "Loan Account Nos": "",
                                    "File Nos": "",
                                    "TotalODPremium": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_final_premium___'] + dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___']).toString(),
                                    "TotalTPPremium": dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_final_premium___'].toString(),
                                    "Net Premium": dbUserData.Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString(),
                                    "Service Tax/ Sales Tax": dbUserData.Erp_Qt_Request_Core['___premium_breakup_service_tax___'].toString(),
                                    "Total Premium": dbUserData.Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                                    "Pre inspection Number": "",
                                    "Preinspection Date & time": "",
                                    "Inspection Agency": "",
                                    "Preinspection Status": "",
                                    "Receipt number": "",
                                    "Mode of Entry": "",
                                    "Payment Mode": "Payment Aggregator",
                                    "Payer Type": "Customer",
                                    "Customer ID (Parent)": "",
                                    "Intermediary ID (Parent)": "",
                                    "Receipt Relationship": "",
                                    "Receipt Amount": dbUserData.Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                                    "Is GBM Receipt?": "NO",
                                    "GBM Reference NO": "",
                                    "Cheque Number/Transaction Reference No/DD No": objProduct.processed_request['___pg_reference_number_2___'],
                                    "Cheque Date/DD/Transaction Date": objProduct.processed_request['___pg_reference_number_1___'],
                                    "Merchant ID": "",
                                    "Receipt IFSC Code": "",
                                    "Receipt Bank Name": "",
                                    "Bank Location": "",
                                    "Branch Name": "",
                                    "Cheque Type": "",
                                    "House Bank": "",
                                    "GSTIN": "",
                                    "PA_OD_TENURE": "", //dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'].toString() === "new" ? "1" : dbUserData.Erp_Qt_Request_Core['___policy_tp_tenure___'].toString(),
                                    "PRODUCT_TYPE": objProduct.processed_request['___vehicle_insurance_subtype_2___']
                                };
                            }
                            data_list.push(data_csv);
                            var txs = JSON.parse(JSON.stringify(data_list));
                            finalTxs = [];
                            for (let i = 0; i <= data_list.length; i++) {
                                finalTxs.push(data_list[i]);
                            }
                            const csvData = csvjson.toCSV(finalTxs, {
                                headers: 'key'
                            });
                            writeFile(ff_name_web_path_portal, csvData, (err) => {
                                if (err) {
                                    console.log(err); // Do something to handle the error or just throw it
                                }
                                console.log('Success!');
                            });
                            var Email = require('../../models/email');
                            var objModelEmail = new Email();
                            var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy KotakOEM TW Feed File:' + policy_number;
                            email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File of KotakOEM TW Policy.</p>'
                                    + '<BR><p>Policy Number : ' + policy_number + '</p><BR><p>Feed File: ' + ff_web_path_portal + ' </p></body></html>';
                            var arrTo = ['narayan.tilve@Kotak.com', 'prathmesh.hode@Kotak.com', 'kgi.operations@Kotak.com', 'nikita.naik@Kotak.com'];
                            var arrCc = ['abhijeet.pendharkar@Kotak.com', 'atish.sonawane@Kotak.com', 'pranab.chavan@kotak.com', 'Jayesh.Kerkar@kotak.com', 'rohan.talla@Kotak.com', 'gaurav.dhuri@Kotak.com'];
                            if (config.environment.name === 'Production') {
                                //objModelEmail.send('noreply@landmarkinsurance.co.in', arrTo.join(','), sub, email_body, arrCc.join(','), config.environment.notification_email, ''); //UAT
                            } else if (config.environment.name === 'QA') {
                                //objModelEmail.send('noreply@landmarkinsurance.co.in', 'atish.sonawane@Kotak.com', sub, email_body, '', '', '');
                            } else {
                                //objModelEmail.send('noreply@landmarkinsurance.co.in', 'atish.sonawane@Kotak.com', sub, email_body, '', '', '');
                            }

//END Feed File Code============================================================================================
                        }
                    });
                }
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }
        }
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    objServiceHandler.Policy = this.const_policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
KotakOEMMotor.prototype.applicable_imt = function (objResponseJson) {
    var objResponseJson = objResponseJson;
    var apllied_imt = "22";
    try {
        if (objResponseJson['___is_claim_exists___'] === "no") {
            apllied_imt = apllied_imt + ',GR 27';
        }
        if (objResponseJson['___is_tppd___'] === "yes" && objResponseJson['___premium_breakup_tp_cover_tppd___'] > 0) {
            apllied_imt = apllied_imt + ',20';
        }
        if (objResponseJson['___financial_agreement_type___'] === "Hire Purchase") {
            apllied_imt = apllied_imt + ',5';
        }
        if (objResponseJson['___financial_agreement_type___'] === "Lease agreement") {
            apllied_imt = apllied_imt + ',6';
        }
        if (objResponseJson['___financial_agreement_type___'] === "Hypothecation") {
            apllied_imt = apllied_imt + ',7';
        }
        if (objResponseJson['___premium_breakup_tp_cover_owner_driver_pa___'] > 0) {
            apllied_imt = apllied_imt + ',15';
        }
        if (objResponseJson['___premium_breakup_tp_cover_paid_driver_pa___'] > 0) {
            apllied_imt = apllied_imt + ',17';
        }
        if (objResponseJson['___premium_breakup_od_elect_access___'] > 0) {
            apllied_imt = apllied_imt + ',24';
        }
        if (objResponseJson['___premium_breakup_tp_cng_lpg___'] > 0) {
            apllied_imt = apllied_imt + ',25';
        }
        if (objResponseJson['___premium_breakup_tp_cover_paid_driver_ll___'] > 0) {
            apllied_imt = apllied_imt + ',28';
        }
        if (objResponseJson['___premium_breakup_tp_cover_unnamed_passenger_pa___'] > 0) {
            apllied_imt = apllied_imt + ',16';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'applicable_imt', ex);
        return apllied_imt;
    }
    return apllied_imt;
};
KotakOEMMotor.prototype.pdf_call = function (url, args, pdf_sys_loc_portal) {
    try {
        var objInsurerProduct = this;
        objInsurerProduct.pdf_attempt++;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.post(url, args, function (data, response) {
            if (data.Error_Code !== '' || true) {
                if (!fs.existsSync(pdf_sys_loc_portal) && objInsurerProduct.pdf_attempt < 11) {
                    var sleep = require('system-sleep');
                    sleep(600000);
                    objInsurerProduct.pdf_call(url, args, pdf_sys_loc_portal);
                }
            }
        });
        console.log("objInsurerProduct.pdf_attempt :: ", objInsurerProduct.pdf_attempt);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call', ex);
    }
};
KotakOEMMotor.prototype.pdf_call_new = function (args, pdf_sys_loc_portal) {
    try {
        var htmldata = JSON.parse(JSON.stringify(args));
        var url = config.environment.weburl + '/report/kotak_motor_save';
        //var url='http://horizon.policyboss.com:5000/report/kotak_motor_save';    
        console.log('KotakMotor pdf_call_new');
        var objInsurerProduct = this;
        objInsurerProduct.pdf_attempt++;
        var Client = require('node-rest-client').Client;
        var client = new Client();

        var argsObj = {
            data: htmldata,
            headers: {
                "Content-Type": "application/json"
            }
        };

        client.post(url, argsObj, function (data, response) {
            if (data.Error_Code !== '' || true) {
                if (!fs.existsSync(pdf_sys_loc_portal) && objInsurerProduct.pdf_attempt < 11) {
                    var sleep = require('system-sleep');
                    sleep(600000);
                    objInsurerProduct.pdf_call_new(args, pdf_sys_loc_portal);
                }
            }
        });
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call_new', ex);
    }
    console.log("KotakMotor pdf_call_new objInsurerProduct.pdf_attempt :: ", objInsurerProduct.pdf_attempt);
};
KotakOEMMotor.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';

    try {
        var objPremiumService = objResponseJson['Envelope']['Body'][0]['GetSignPolicyPDFResponse'][0]['GetSignPolicyPDFResult'][0];
        if (objPremiumService.hasOwnProperty('Status')) {
            if (objPremiumService['Status'][0] === '0') {
                Error_Msg = objPremiumService['ErrorMessage'][0];
            }
        } else {
            Error_Msg = JSON.stringify(objPremiumService);
        }
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            if (objPremiumService.hasOwnProperty('PolicyPDF') && objPremiumService['PolicyPDF'][0] !== '') {
                var product_name = 'CAR';
                if (this.lm_request['product_id'] === 10) {
                    product_name = 'TW';
                }
                var policy_number = this.lm_request['policy_number'].toString().replace('/', '');
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + policy_number + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(objPremiumService['PolicyPDF'][0], 'base64');
                fs.writeFileSync(pdf_sys_loc_horizon, binary);
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

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);

        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex);

    }
    return objServiceHandler;
};
KotakOEMMotor.prototype.status_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'status_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Recon_Reference_Number': null,
        'Data': null,
        'Pg_Status': null
    };
    try {
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('error')) {
            Error_Msg = JSON.stringify(objResponseJson);
        } else if (objResponseJson.hasOwnProperty('count') && objResponseJson.count < 1 || objResponseJson.items.length < 1) {
            Error_Msg = JSON.stringify(objResponseJson);
        } else {
            var objserviceResponse = objResponseJson.items[0];
        }
        let pg_get = {
            "Status": "Fail",
            "PayId": "",
            "OrderId": ""
        };
        if (Error_Msg === 'NO_ERR' && objserviceResponse.hasOwnProperty('status') && objserviceResponse['status'] === "captured") {
            objServiceHandler['Data'] = objResponseJson;
            objServiceHandler['Pg_Status'] = "SUCCESS";
            objServiceHandler['Recon_Reference_Number'] = '';
            pg_get['Status'] = 'Success';
            pg_get['PayId'] = objserviceResponse['id'];
            pg_get['OrderId'] = objserviceResponse['order_id'];
            objServiceHandler['pg_get'] = pg_get;
        } else {
            objServiceHandler['Data'] = objResponseJson;
            objServiceHandler['Recon_Reference_Number'] = '';
            objServiceHandler['Pg_Status'] = "FAIL";
            objServiceHandler['pg_get'] = pg_get;
        }
        objServiceHandler['Error_Msg'] = Error_Msg;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };

        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'status_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
KotakOEMMotor.prototype.vehicle_age_year1 = function () {
    var moment = require('moment');
    var vehicle_manf_date = this.lm_request['vehicle_manf_date'];
    var policy_start_date = this.policy_start_date();
    var age_in_year = moment(policy_start_date).diff(vehicle_manf_date, 'years');
    var age_in_month = moment(policy_start_date).diff(vehicle_manf_date, 'months');
    if (age_in_month > 6) {
        age_in_year = age_in_year + 1;
    }
    return age_in_year;
}
KotakOEMMotor.prototype.lv_quote_no = function () {
    return this.create_guid('', 'numeric', 7);
}

KotakOEMMotor.prototype.get_vehicle_fueltype = function (vehicle_fueltype) {
    console.log('get vehicle fueltype', 'start');
    var obj_vehicle_fueltype = [
        {'fuel': 'Petrol', 'value': 'MFT1'},
        {'fuel': 'PETROL', 'value': 'MFT1'},
        {'fuel': 'Diesel', 'value': 'MFT2'},
        {'fuel': 'DIESEL', 'value': 'MFT2'},
        {'fuel': 'CNG', 'value': 'MFT3'},
        {'fuel': 'LPG', 'value': 'MFT5'},
        {'fuel': 'Battery', 'value': 'MFT6'}
    ];
    var index = obj_vehicle_fueltype.findIndex(x => x.fuel === vehicle_fueltype);
    if (index === -1) {
        return "MFT99";
    }
    return obj_vehicle_fueltype[index]['value'];
    console.log('get vehicle fueltype', 'End');
};
KotakOEMMotor.prototype.get_vehicle_bodytype = function (bodyType) {
    console.log('get vehicle bodytype', 'start');
    var obj_bodytype = [
        {'body_type': 'SEDAN', 'body_code': 'BD2'},
        {'body_type': 'HATCHBACK', 'body_code': 'BD4'},
        {'body_type': 'CLOSED', 'body_code': '11'},
        {'body_type': 'JEEP', 'body_code': 'BD6'},
        {'body_type': 'VAN', 'body_code': 'BD5'},
        {'body_type': 'SALOON', 'body_code': 'BD1'}
    ];
    var index = obj_bodytype.findIndex(x => x.body_type === bodyType);
    if (index === -1) {
        return "BD7";
    }
    return obj_bodytype[index]['body_code'];
    console.log('get vehicle bodytype', 'End');
};
KotakOEMMotor.prototype.get_voluntary_deductible = function (voluntary_deduct) {
    console.log('get voluntary deductible', 'start');
    var obj_voluntary_deductible = [
        {'deductible': 500, 'value': 'TWVE2'},
        {'deductible': 750, 'value': 'TWVE3'},
        {'deductible': 1000, 'value': 'TWVE4'},
        {'deductible': 1500, 'value': 'TWVE5'},
        {'deductible': 3000, 'value': 'TWVE6'},
        {'deductible': 2500, 'value': 'PCVE2'},
        {'deductible': 5000, 'value': 'PCVE3'},
        {'deductible': 7500, 'value': 'PCVE4'},
        {'deductible': 15000, 'value': 'PCVE5'}
    ];
    var index = obj_voluntary_deductible.findIndex(x => x.deductible === voluntary_deduct);
    if (index === -1) {
        return (this.lm_request['product_id'] === 10 ? 'TWVE1' : 'PCVE1');
//        return "PCVE1";
    }
    return obj_voluntary_deductible[index]['value'];
    console.log('get vehicle deductible', 'End');
};
KotakOEMMotor.prototype.vehicle_age_year = function () {
    var vehicle_registration_date = this.lm_request['vehicle_registration_date'];
    var policy_start_date = this.prepared_request['policy_start_date'];
    var date1 = new Date(policy_start_date);
    var date2 = new Date(vehicle_registration_date); //mm/dd/yyyy
    var diff_date = date1 - date2;
    var num_years = diff_date / 31536000000;
    var num_months = (diff_date % 31536000000) / 2628000000;
    var num_days = ((diff_date % 31536000000) % 2628000000) / 86400000;
    var age_in_year = Math.floor(num_years);
    var age_in_days = Math.floor(num_days);
    return age_in_year;
}
KotakOEMMotor.prototype.premium_breakup_schema = {

    "own_damage": {
        "od_basic": "MOT-CVR-001", //when PropCoverDetails_CoverGroups = Own Damage
        "od_elect_access": "MOT-CVR-002", //need to calculate
        "od_non_elect_access": "", //not given by insurer 
        "od_cng_lpg": "", //yet to check
        "od_disc_ncb": "MOT-DIS-310",
        "od_disc_vol_deduct": "MOT-DIS-004",
        "od_disc_anti_theft": "MOT-DIS-002",
        "od_disc_aai": "MOT-DIS-005",
        "od_loading": "",
        "od_disc": "MOT-DLR-IMT",
        "od_final_premium": "OD_PREMIUM"//NetODPremium
    },
    "liability": {
        "tp_basic": "MOT-CVR-007", ////when PropCoverDetails_CoverGroups = Basic TP  including TPPD premium
        "tp_cover_owner_driver_pa": "MOT-CVR-010", //when PropCoverDetails_CoverGroups = Owner Driver
        "tp_cover_unnamed_passenger_pa": "MOT-CVR-012",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_tppd": '',
        "tp_cover_paid_driver_pa": "", //NA
        "tp_cover_paid_driver_ll": "MOT-CVR-015", //this is included in tp_basic
        "tp_cng_lpg": "MOT-CVR-008",
        "tp_final_premium": "TP_PREMIUM"
    },
    "addon": {
        "addon_zero_dep_cover": "MOT-CVR-150",
        "addon_road_assist_cover": "", ///when PropCoverDetails_CoverGroups = RoadSide Assist
        "addon_ncb_protection_cover": "",
        "addon_engine_protector_cover": "MOT-CVR-EPC",
        "addon_invoice_price_cover": "MOT-CVR-070",
        "addon_key_lock_cover": "",
        "addon_consumable_cover": "",
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": "",
        "addon_personal_belonging_loss_cover": "",
        "addon_inconvenience_allowance_cover": null,
        "addon_medical_expense_cover": null,
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": 0
    },
    "net_premium": "totalNetPremium",
    "service_tax": "service_tax",
    "final_premium": "final_premium"
};
module.exports = KotakOEMMotor;