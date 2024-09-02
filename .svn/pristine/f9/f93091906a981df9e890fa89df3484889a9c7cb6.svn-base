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
function NewIndiaMotor() {

}
util.inherits(NewIndiaMotor, Motor);

NewIndiaMotor.prototype.lm_request_single = {};
NewIndiaMotor.prototype.insurer_integration = {};
NewIndiaMotor.prototype.insurer_addon_list = [];
NewIndiaMotor.prototype.insurer = {};
NewIndiaMotor.prototype.insurer_date_format = 'dd/MM/yyyy';


NewIndiaMotor.prototype.insurer_product_api_pre = function () {
    /*
     * 1	Petrol
     2	Diesel
     3	CNG
     4	LPG
     5	Bifuel
     6	Battery
     0	None
     7	NA
     
     */
//    this.insurer_lm_request['fuel_code'] = 
//    specific_insurer_object['prepared_request'][]


    console.log('insurer_product_api_pre');
};
NewIndiaMotor.prototype.insurer_product_field_process_pre = function () {
    console.log(this.constructor.name, 'insurer_product_field_process_pre', 'start');
    try {
        var obj_replace = {};
        if (this.insurer_lm_request['vehicle_insurance_type'] === 'new') {
            obj_replace['___policy_expiry_date___'] = '01/01/0001';
            obj_replace['___dbmaster_previousinsurer_address___'] = '';
        }
        var objZeroReplace = ['pa_owner_driver_si', 'pa_unnamed_passenger_si', 'pa_named_passenger_si', 'pa_paid_driver_si'];
        console.log(this.insurer_lm_request);
        var objRequest = this.insurer_lm_request;
        objZeroReplace.forEach(function (element) {
            console.log(element.toString());
            if (objRequest[element] === '' || objRequest[element] === '0' || objRequest[element] === undefined) {
                obj_replace['___' + element + '___'] = '0';
            }
        });
        if (Object.keys(obj_replace).length > 0) {
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }
        this.prepared_request['dbmaster_insurername'] = 'Cholamandalam MS General Insurance Co. Ltd.';
        this.processed_request['___dbmaster_insurername___'] = this.prepared_request['dbmaster_insurername'];

        this.prepared_request['dbmaster_insurer_rto_zone_code'] = 'A';
        this.processed_request['___dbmaster_insurer_rto_zone_code___'] = this.prepared_request['dbmaster_insurer_rto_zone_code'];
        if ((this.insurer_lm_request['vehicle_age_month'] - 0) > 34) {
            this.method_content = this.method_content.replace('___addon_package_name___', 'PACKAGE');
        }
        if (this.lm_request['method_type'] === 'Proposal') {
            this.prepared_request['addon_package_name'] = 'PACKAGE';
            this.processed_request['___addon_package_name___'] = 'PACKAGE';
            var obj_addon = ['addon_zero_dep_cover', 'addon_ncb_protection_cover', 'addon_engine_protector_cover', 'addon_invoice_price_cover'];
            for (var x in obj_addon) {
                if (this.lm_request.hasOwnProperty(obj_addon[x]) && this.lm_request[obj_addon[x]] === 'yes') {
                    this.prepared_request['addon_package_name'] = 'ENHANCEMENTCOVER';
                    this.processed_request['___addon_package_name___'] = 'ENHANCEMENTCOVER';
                }
            }
        }
        if (['LPG', 'CNG'].indexOf(this.prepared_request['dbmaster_insurer_vehicle_fueltype']) > -1) {
            this.prepared_request['external_bifuel_value_2'] = 'Y';
            this.processed_request['___external_bifuel_value_2___'] = this.prepared_request['external_bifuel_value_2'];
        } else {
            this.prepared_request['external_bifuel_value_2'] = 'N';
            this.processed_request['___external_bifuel_value_2___'] = this.prepared_request['external_bifuel_value_2'];
        }
        if (this.processed_request['___external_bifuel_value___'] - 0 > 0) {
            if (this.lm_request['external_bifuel_type'] == 'lpg') {
                this.method_content = this.method_content.replace('___dbmaster_insurer_vehicle_fueltype___', 'LPG' + this.processed_request['___dbmaster_insurer_vehicle_fueltype___']);
            } else if (this.lm_request['external_bifuel_type'] == 'cng') {
                this.method_content = this.method_content.replace('___dbmaster_insurer_vehicle_fueltype___', 'CNG' + this.processed_request['___dbmaster_insurer_vehicle_fueltype___']);
            }
        }
        if (this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') {
            //this.method_content = this.method_content.replace('___email___', 'onlinepolicy@policyboss.com');
        }
        if (this.lm_request['method_type'] === 'Proposal') {
            var Premium_Rate = this.insurer_master['service_logs']['pb_db_master']['Premium_Rate'];
            this.prepared_request['own_damage_disc_rate'] = Premium_Rate['own_damage']['od_disc'];
            this.processed_request['___own_damage_disc_rate___'] = Premium_Rate['own_damage']['od_disc'];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
    console.log(this.constructor.name, 'insurer_product_field_process_pre', 'finish');
};
NewIndiaMotor.prototype.insurer_product_field_process_post = function () {

};
NewIndiaMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
NewIndiaMotor.prototype.insurer_product_field_process_post = function () {

};
NewIndiaMotor.prototype.insurer_product_api_post = function () {

};
NewIndiaMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;//
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');



        //Example POST method invocation 
        var Client = require('node-rest-client').Client;

        var client = new Client({'user': Insurer_Object.Service_User, 'password': Insurer_Object.Service_Password});

        // set content-type header and data as json in args parameter 
        console.log(docLog.Insurer_Request);
        var args = {
            data: docLog.Insurer_Request,
            headers: {
                "Content-Type": "text/xml"
            }
        };

        client.post(specific_insurer_object.method_file_url, args, function (data, response) {
            try {

                var strResp = JSON.stringify(data);
                console.log(strResp);
                strResp = strResp.replace(/\$/g, 'attr');
                strResp = strResp.replace(/typ:/g, '');
                strResp = strResp.replace(/m:/g, '');
                strResp = strResp.replace(/env:/g, '');
                var objXml2Json = JSON.parse(strResp);
                var objResponseFull = {
                    'err': null,
                    'result': null,
                    'raw': JSON.stringify(objXml2Json),
                    'soapHeader': null,
                    'objResponseJson': objXml2Json
                };
                if (strResp.indexOf('faultcode') > -1) {
                    objResponseFull.err = objXml2Json;
                }

                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            } catch (e) {
                console.error('Exception', 'NewIndia', 'service_call', e);
            }
        }).on('error', function (err) {
            var objResponseFull = {
                'err': err,
                'result': null,
                'raw': null,
                'soapHeader': null,
                'objResponseJson': null
            };
            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

            console.log('something went wrong on the request', err.request.options);
        });



    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

NewIndiaMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';

    try {
        if (!objResponseJson.hasOwnProperty('Envelope')) {
            Error_Msg = 'LM_EMPTY_RESPONSE';
        } else {
            objResponseJson = objResponseJson['Envelope']['Body'];
            if (objResponseJson.hasOwnProperty('calculatePremiumMasterResponseElement')) {
                var objPremiumService = objResponseJson['calculatePremiumMasterResponseElement'];
                if (objPremiumService.hasOwnProperty('PRetErr')) {
                    if (objPremiumService['PRetCode'] !== '0') {
                        Error_Msg = JSON.stringify(objPremiumService['PRetErr']);
                    }
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }
        }

        //check error start

        if (Error_Msg === 'NO_ERR') {
            var objPremiumService = objResponseJson['calculatePremiumMasterResponseElement'];
            var objLMPremium = {};
            var premium_breakup = this.const_premium_breakup;

            for (var key in this.premium_breakup_schema) {
                if (typeof this.premium_breakup_schema[key] === 'object') {
                    var group_final = 0, group_final_key = '';
                    for (var sub_key in this.premium_breakup_schema[key]) {
                        var premium_key = this.premium_breakup_schema[key][sub_key];
                        var premium_val = 0;

                        for (var keyCover in objPremiumService['properties']) {
                            if (premium_key == objPremiumService['properties'][keyCover]['name']) {
                                premium_val = this.round2Precision(objPremiumService['properties'][keyCover]['value'] - 0);
                                //premium_val = isNaN(premium_val) ? 0 : premium_val;
                                break;
                            }
                        }
                        premium_breakup[key][sub_key] = premium_val;
                        if (sub_key.indexOf('final') > -1) {
                            group_final_key = sub_key;
                        } else if (sub_key.indexOf('_disc') > -1) {
                            group_final -= premium_val;
                        } else {
                            group_final += premium_val;
                        }
                    }
                    if (group_final_key.indexOf('addon_') < 0 && false) {
                        premium_breakup[key][group_final_key] = group_final;
                    }

                } /*else {
                 var premium_key = this.premium_breakup_schema[key];
                 var premium_val = 0;
                 for (var keyCover in objPremiumService['properties']) {
                 if (premium_key == objPremiumService['properties'][keyCover]['name']) {
                 premium_val = this.round2Precision(objPremiumService['properties'][keyCover]['value']);
                 premium_val = isNaN(premium_val) ? 0 : premium_val;
                 break;
                 }
                 }
                 premium_breakup[key] = premium_val;
                 }*/
                premium_breakup['net_premium'] = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'] + premium_breakup['addon']['addon_final_premium'];
                premium_breakup['service_tax'] = this.round2Precision(premium_breakup['net_premium'] * 0.18);
                premium_breakup['final_premium'] = this.round2Precision(premium_breakup['net_premium'] + premium_breakup['service_tax']);
            }

            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = '';

        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        console.error('Exception', this.constructor.name, 'premium_response_handler', e);
        return objServiceHandler;
    }
};
NewIndiaMotor.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';

    try {
        if (!objResponseJson.hasOwnProperty('Envelope')) {
            Error_Msg = 'LM_EMPTY_RESPONSE';
        } else {
            objResponseJson = objResponseJson['Envelope']['Body'];
            if (objResponseJson.hasOwnProperty('createPolicyHol_GenResponseElement')) {
                var objPremiumService = objResponseJson['createPolicyHol_GenResponseElement'];
                if (objPremiumService.hasOwnProperty('PRetErr')) {
                    if (objPremiumService['PRetCode'] !== '0') {
                        Error_Msg = objPremiumService['PRetErr'].toString();
                    } else if (objPremiumService['partyCode'] === '') {
                        Error_Msg = 'LM_CUSTOMER_NOT_CREATE_NO_ERR_RECEIVED';
                    }
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }
        }
        if (Error_Msg === 'NO_ERR') {
            var Customer = {
                'insurer_customer_identifier': objPremiumService['partyCode']
            };
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['partyCode'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        console.error('Exception', this.constructor.name, 'customer_response_handler', e);
        return objServiceHandler;
    }
};
NewIndiaMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';

    try {
        if (!objResponseJson.hasOwnProperty('Envelope')) {
            Error_Msg = 'LM_EMPTY_RESPONSE';
        } else {
            objResponseJson = objResponseJson['Envelope']['Body'];
            if (objResponseJson.hasOwnProperty('SaveQuote_ApproveProposalResponseElement')) {
                var objPremiumService = objResponseJson['SaveQuote_ApproveProposalResponseElement'];
                if (objPremiumService.hasOwnProperty('PRetErr')) {
                    if (objPremiumService['PRetErr'].indexOf('Proposal Approved') === -1) {
                        Error_Msg = objPremiumService['PRetErr'];
                    } else if (objPremiumService['quoteNo'] === '') {
                        Error_Msg = 'LM_QUOTE_NUM_NOT_CREATE_NO_ERR_RECEIVED';
                    }
                }
            }
        }
        if (Error_Msg === 'NO_ERR') {
            var objLMPremium = {};
            var Received_Premium = objPremiumService['netPremium'];
            var Requested_Premium = this.lm_request['final_premium'];
            var objPremiumVerification = this.premium_verification(Requested_Premium, Received_Premium);
            if (objPremiumVerification.Status) {
                var thankyouurl = ((config.environment.name === 'Production') ? 'http://www.policyboss.com' : 'http://qa.policyboss.com') + '/Payment/Transaction_Status?crn=' + this.lm_request['crn'];
                var checksum_key = '7FdCx3Kh6Frs';
                var pg_args = {
                    'MerchantID': 'NEWINDINSW',
                    'CustomerID': 'PB-' + this.lm_request['crn'] + '-' + this.randomString(5),
                    'NA': 'NA',
                    'TxnAmount': Received_Premium,
                    'NA1': 'NA',
                    'NA2': 'NA',
                    'NA3': 'NA',
                    'CurrencyType': 'INR',
                    'NA4': 'NA',
                    'TypeField1': 'R',
                    'SecurityID': 'LANDMARK-NA',
                    'NA5': 'NA',
                    'NA6': 'NA',
                    'TypeField2': 'F',
                    'Txtadditionalinfo1': 'NIA_LANDMARK',
                    'Txtadditionalinfo2': 'NA',
                    'Txtadditionalinfo3': 'NA',
                    'Txtadditionalinfo4': 'NA',
                    'Txtadditionalinfo5': 'NA',
                    'Txtadditionalinfo6': 'NA',
                    'Txtadditionalinfo7': objPremiumService['policyId'],
                    'RU': this.const_payment.pg_ack_url
                };
                var arrPgVal = [];
                for (var k in pg_args) {
                    arrPgVal.push(pg_args[k]);
                }

                var msg = arrPgVal.join('|');
                var checksummsg = msg + '|' + checksum_key;
                var checksumvalue = this.convert_to_sha256(checksummsg);
                var pg_data = {
                    'msg': msg + '|' + checksumvalue,
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['quoteNo'];
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        console.error('Exception', this.constructor.name, 'premium_response_handler', e);
        return objServiceHandler;
    }
};
NewIndiaMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var Insurer_Id = specific_insurer_object['insurer_id'];
        var Master_Db_List = objProduct.insurer_master_object['insurer_id_' + Insurer_Id]['master_db_list'];
        var Insurer_Vehicle_ExShowRoom = '';
        if (Master_Db_List.hasOwnProperty('vehicles') && Master_Db_List['vehicles'] !== null) {
            Insurer_Vehicle_ExShowRoom = Master_Db_List['vehicles']['insurer_db_master']['Insurer_Vehicle_ExShowRoom'];
        }
        var Vehicle_Depreciation_Range = {
            'Age_0': '5',
            'Age_1': '15',
            'Age_2': '20',
            'Age_3': '30',
            'Age_4': '40',
            'Age_5': '50',
            'Age_6': '55',
            'Age_7': '59',
            'Age_8': '64',
            'Age_9': '67',
            'Age_10': '70'
        };
        var Idv = 0;
        if (Insurer_Vehicle_ExShowRoom !== '') {
            var Vehicle_Age_Year = this.vehicle_age_year();
            if (Vehicle_Age_Year < 1) {
                Vehicle_Age_Year = 1;
            } else if (Vehicle_Age_Year > 11) {
                Vehicle_Age_Year = 10;
            }

            var Applied_Year = Vehicle_Age_Year - 1;
            Idv = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + Applied_Year]) / 100);
        }
        var Db_Idv_Calculated = {
            "Idv_Normal": Idv,
            "Idv_Min": Math.round(Idv * 0.9),
            "Idv_Max": Math.round(Idv * 1.10),
            "Exshowroom": Insurer_Vehicle_ExShowRoom
        };
        this.insurer_vehicle_idv_handler(Db_Idv_Calculated, objProduct, Insurer_Object, specific_insurer_object);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', ex);
    }
    console.log('Finish', this.constructor.name, 'insurer_vehicle_idv', Db_Idv_Calculated);
    return Db_Idv_Calculated;
};
NewIndiaMotor.prototype.verification_response_handler_NIU = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.const_policy.pg_status === 'FAIL') {

        }
        if (this.const_policy.pg_status === 'SUCCESS') {
            if (!objResponseJson.hasOwnProperty('Envelope')) {
                Error_Msg = 'LM_EMPTY_RESPONSE';
            } else {
                objResponseJson = objResponseJson['Envelope']['Body'];
                var objPremiumService = objResponseJson['collectpremium_IssuepolResponseElement'];
                if (objPremiumService.hasOwnProperty('PRetErr')) {
                    if (objPremiumService['PRetErr'].indexOf('Proposal Issued') > -1) {
                        if (objPremiumService['policyNo'] == '') {
                            Error_Msg = 'LM_POLICY_NUM_NOT_CREATED_WITHOUT_ERR';
                        }
                    } else {
                        Error_Msg = objPremiumService['PRetErr'];
                    }
                }
            }
            if (Error_Msg === 'NO_ERR') {
                if (objPremiumService.hasOwnProperty('policyNo') && objPremiumService['policyNo'] !== '') {
                    this.const_policy.policy_number = objPremiumService['policyNo'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'CAR';
                    if (this.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;


                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    var args = {
                        data: {
                            "search_reference_number": this.lm_request['search_reference_number'],
                            "api_reference_number": this.lm_request['api_reference_number'],
                            "policy_number": this.const_policy.policy_number.toString(),
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key'],
                            'insurer_id': this.lm_request['insurer_id'],
                            'pg_reference_number_2': this.const_policy.pg_reference_number_2.toString(),
                            'method_type': 'Pdf',
                            'execution_async': 'no'
                        },
                        headers: {
                            "Content-Type": "application/json",
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key']
                        }
                    };
                    client.post(config.environment.weburl + '/quote/pdf_initiate', args, function (data, response) {

                    });

                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }
            this.const_policy.policy_id = objPremiumService['policy_id'];
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['PaymentID'];
        }
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
}
NewIndiaMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    var objInsurerProduct = this;
    try {
        if (objInsurerProduct.const_policy.pg_status === 'FAIL') {
            this.const_policy.transaction_status = 'FAIL';
        }
        if (objInsurerProduct.const_policy.pg_status === 'SUCCESS') {
            if (!objResponseJson.hasOwnProperty('Envelope')) {
                Error_Msg = 'LM_EMPTY_RESPONSE';
            } else {
                objResponseJson = objResponseJson['Envelope']['Body'];
                var objPremiumService = objResponseJson['collectpremium_IssuepolResponseElement'];
                if (objPremiumService.hasOwnProperty('PRetErr')) {
                    if (objPremiumService['PRetErr'].indexOf('Proposal Issued') > -1) {
                        if (objPremiumService['policyNo'] == '') {
                            Error_Msg = 'LM_POLICY_NUM_NOT_CREATED_WITHOUT_ERR';
                        }
                    } else {
                        Error_Msg = objPremiumService['PRetErr'];
                    }
                }
            }
            if (Error_Msg === 'NO_ERR') {
                if (objPremiumService.hasOwnProperty('policyNo') && objPremiumService['policyNo'] !== '') {
                    this.const_policy.policy_number = objPremiumService['policyNo'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'CAR';
                    if (this.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    var pdf_file_name = objInsurerProduct.constructor.name + '_' + product_name + '_' + objInsurerProduct.const_policy.policy_number + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;


                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    var args = {
                        data: {
                            "search_reference_number": objInsurerProduct.lm_request['search_reference_number'] + '_' + objInsurerProduct.lm_request['udid'],
                            "api_reference_number": objInsurerProduct.lm_request['api_reference_number'] + '_' + objInsurerProduct.lm_request['slid'] + '_' + objInsurerProduct.lm_request['udid'],
                            "policy_number": objInsurerProduct.const_policy.policy_number.toString(),
                            'client_key': objInsurerProduct.lm_request['client_key'],
                            'secret_key': objInsurerProduct.lm_request['secret_key'],
                            'insurer_id': objInsurerProduct.lm_request['insurer_id'],
                            'pg_reference_number_2': objInsurerProduct.const_policy.pg_reference_number_2.toString(),
                            'method_type': 'Pdf',
                            'execution_async': 'no'
                        },
                        headers: {
                            "Content-Type": "application/json",
                            'client_key': objInsurerProduct.lm_request['client_key'],
                            'secret_key': objInsurerProduct.lm_request['secret_key']
                        }
                    };
                    client.post(config.environment.weburl + '/quote/pdf_initiate', args, function (data, response) {

                    });

                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }
            //this.const_policy.policy_id = objPremiumService['policy_id'];
            //objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['PaymentID'];
        }
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    objServiceHandler.Policy = objInsurerProduct.const_policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
NewIndiaMotor.prototype.pg_response_handler = function () {
    //msg-->MERCHANTID|ARP1023411|MSBI0412001668|NA|00007094.00|SBI|22270726|NA|INR|NA|NA|NA|NA|12-12-2004 16:08:56|0300|NA|AGGR|RohitPatil|test@billdesk.com|9800000000|NA|NA|NA|NA|NA|FB9A73C04EDFDB11805619C6720BB2F7680CDF85CFA46FDF8BB2F7680CDF

    //checksum validation to be done later  .. If checksum is valid update payment status PENDING to SUCCESS if authstatus is 300 otherwise FAILURE

//“0300” Success Successful Transaction
//“0399” Invalid Authentication at Bank Cancel Transaction
//“NA” Invalid Input in the Request Message Cancel Transaction
//“0002” BillDesk is waiting for Response from Bank Cancel Transaction
//“0001” Error at BillDesk Cancel Transaction
    try {
        this.const_policy.pg_status = 'FAIL';
        this.const_policy.transaction_status = 'FAIL';
        var objInsurerProduct = this;
        var msg = objInsurerProduct.lm_request.pg_post['msg'];
        var str = msg.split('|');
        this.const_policy.transaction_status = '';
        this.const_policy.transaction_id = str[2];
        if (msg.indexOf('|0300|') > -1) {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_amount = str[4];
            this.const_policy.pg_reference_number_1 = str[2];
            this.const_policy.pg_reference_number_2 = str[22]; // policy_id
        } else
        {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
            this.const_policy.pg_message = str[24];
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e.stack);
    }
};
NewIndiaMotor.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var policy = {
        'policy_url': null,
        'insurer_policy_url': null,
        'policy_number': this.lm_request['policy_number'],
        'pdf_status': null
    };
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null,
        'Policy': null
    };
    try {
        var Error_Msg = 'NO_ERR';

        if (!objResponseJson.hasOwnProperty('Envelope')) {
            Error_Msg = 'LM_EMPTY_RESPONSE';
        } else {
            objResponseJson = objResponseJson['Envelope']['Body'];
            var objPremiumService = objResponseJson['fetchDocumentNameResponseElement'];
            console.error('NIAPDF', objResponseJson);
            if (objPremiumService.hasOwnProperty('docs') && objPremiumService['docs'] !== '') {
                var DocumentIdToView = '';
                console.error('NIA', objPremiumService['docs']);
                for (var k in objPremiumService['docs']) {
                    if (objPremiumService['docs'][k]['name'].indexOf('POLICY_DOCUMENT_') > -1) {
                        DocumentIdToView = objPremiumService['indexType'][k]['index'];
                        break;
                    }
                }
                if (DocumentIdToView === '') {
                    Error_Msg = 'LM_DocumentIdToView_EMPTY';
                }
            } else {
                Error_Msg = 'LM_POLICY_DOCS_NODE_NA';
            }
        }

        if (Error_Msg === 'NO_ERR') {
            var product_name = 'CAR';
            if (this.lm_request['product_id'] === 10) {
                product_name = 'TW';
            }

            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'].replace('/', '') + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            policy.policy_url = pdf_web_path_portal;

            var insurer_pdf_url = '';
            if (config.environment.name === 'Production') {
                insurer_pdf_url = 'https://b2b.newindia.co.in/omnidocs/integration/foldView/viewDocsMain.jsp';
            } else {
                insurer_pdf_url = 'https://uatapps.newindia.co.in/omnidocs/Bancs_ONLINE_PORTAL/doclist.jsp';
            }
            insurer_pdf_url += '?Application=IIMSONLINE&FolderName=' + this.lm_request['policy_number'] + '&DocumentIdToView=' + DocumentIdToView;
            var https = require('https');
            var request = https.get(insurer_pdf_url, function (response) {
                if (response.statusCode == 200) {
                    var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                    response.pipe(file_horizon);
                }
            });
            policy.insurer_policy_url = insurer_pdf_url;
            policy.pdf_status = 'SUCCESS';
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        }
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);

    } catch (e) {
        objServiceHandler.Error_Msg = e.stack;
        objServiceHandler.Policy = policy;
        console.error('Exception', this.constructor.name, 'customer_response_handler', e);
        return objServiceHandler;
    }
    return objServiceHandler;
};
NewIndiaMotor.prototype.nia_policy_excess = function () {
    console.log('nia_policy_excess', 'start');
    var nia_policy_excess_amt = 0;
    try {
        if (parseInt(this.prepared_request['dbmaster_insurer_vehicle_cubiccapacity']) < 1500) {
            nia_policy_excess_amt = 1000;
        } else {
            nia_policy_excess_amt = 2000;
        }
        console.log('nia_policy_excess', 'finish', nia_policy_excess_amt);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'nia_policy_excess', ex);
        return nia_policy_excess_amt;
    }
    return nia_policy_excess_amt;

};
NewIndiaMotor.prototype.nia_total_idv = function () {
    console.log('nia_total_idv', 'start');
    var nia_total_idv_amt = 0;
    try {
        var arr_key_total = [
            'vehicle_expected_idv',
            'electrical_accessory',
            'non_electrical_accessory',
            'external_bifuel_value'
        ];
        for (var k in arr_key_total) {
            var val_access = parseInt(this.insurer_lm_request[arr_key_total[k]]);
            val_access = isNaN(val_access) ? 0 : val_access;
            nia_total_idv_amt += val_access;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'nia_total_idv', ex);
        return nia_total_idv_amt;
    }
    console.log('nia_total_idv', 'finish', nia_total_idv_amt);
    return nia_total_idv_amt;

};
NewIndiaMotor.prototype.nia_total_accessories = function () {
    console.log('nia_total_accessories', 'start');
    var nia_total_accessories_amt = 0;
    try {
        var arr_key_total = [
            'electrical_accessory',
            'non_electrical_accessory',
            'external_bifuel_value'
        ];
        for (var k in arr_key_total) {
            var val_access = parseInt(this.insurer_lm_request[arr_key_total[k]]);
            val_access = isNaN(val_access) ? 0 : val_access;
            nia_total_accessories_amt += val_access;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'nia_total_accessories', ex);
        return nia_total_accessories_amt;
    }
    console.log('nia_total_accessories', 'finish', nia_total_accessories_amt);
    return nia_total_accessories_amt;

};
NewIndiaMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "Basic OD Premium_IMT",
        "od_elect_access": "IMT Rate Additional Premium for Electrical fitting",
        "od_non_elect_access": "IMT Rate Additional Premium for Non-Electrical fitting",
        "od_cng_lpg": "Additional OD Premium for CNG/LPG",
        "od_disc_ncb": "(#)Total NCB Discount",
        "od_disc_vol_deduct": "(#)Calculated Voluntary Deductible Discount",
        "od_disc_anti_theft": "(#)Calculated Discount for Anti-Theft Devices",
        "od_disc_aai": "",
        "od_loading": "Additional Loading on OD Premium",
        "od_disc": "OD Premium Discount Amount",
        "od_final_premium": "(#)Total OD Premium"
    },
    "liability": {
        "tp_basic": "Basic TP Premium",
        "tp_cover_owner_driver_pa": "Compulsory PA Premium for Owner Driver",
        "tp_cover_unnamed_passenger_pa": "PA premium for UnNamed/Hirer/Pillion Persons",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "PA premium for Paid Drivers And Others",
        "tp_cover_paid_driver_ll": "Legal Liability Premium for Paid Driver",
        "tp_cng_lpg": "Additional TP Premium for CNG/LPG",
        "tp_final_premium": "(#)Total TP Premium"
    },
    "addon": {
        //"addon_zero_dep_cover": 'Premium for enhancement cover',
        "addon_zero_dep_cover": 'Premium for nil depreciation cover',
        "addon_road_assist_cover": null,
        "addon_ncb_protection_cover": "NCB Protection Cover Premium",
        "addon_engine_protector_cover": "Engine Protect Cover Premium",
        "addon_invoice_price_cover": "Return to Invoice Cover Premium",
        "addon_key_lock_cover": null,
        "addon_consumable_cover": null,
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": null,
        "addon_personal_belonging_loss_cover": "Loss of Content Cover Premium",
        "addon_inconvenience_allowance_cover": null,
        "addon_medical_expense_cover": null,
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": ""
    },
    "net_premium": "(#)Premium",
    "service_tax": "Service Tax",
    "final_premium": "Net Total Premium"
};
module.exports = NewIndiaMotor;






