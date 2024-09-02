/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var config = require('config');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Motor = require(appRoot + '/libs/Motor');
var fs = require('fs');
var moment = require('moment');

function BhartiAxaMotor() {

}
util.inherits(BhartiAxaMotor, Motor);


BhartiAxaMotor.prototype.insurer_integration = {};
BhartiAxaMotor.prototype.insurer_master = {};
BhartiAxaMotor.prototype.insurer_addon_list = [];
BhartiAxaMotor.prototype.insurer = {};
BhartiAxaMotor.prototype.insurer_date_format = 'yyyy-MM-dd';


BhartiAxaMotor.prototype.insurer_product_api_pre = function () {

};
BhartiAxaMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        if (this.lm_request['vehicle_registration_type'] === 'corporate') {
            if (this.lm_request['method_type'] === 'Proposal') {
                //this.prepared_request['first_name'] = this.lm_request['company_name'];
                //this.processed_request['___first_name___'] = this.prepared_request['first_name'];
                //this.prepared_request['email'] = this.lm_request['company_contact_person_email'];
                //this.processed_request['___email___'] = this.prepared_request['email'];
                //this.prepared_request['mobile'] = this.lm_request['company_contact_person_mobile'];
                //this.processed_request['___mobile___'] = this.prepared_request['mobile'];
                this.method_content = this.method_content.replace('___salutation___', '');
                this.method_content = this.method_content.replace('___first_name___', this.lm_request['company_name']);
                this.method_content = this.method_content.replace('___middle_name___', '');
                this.method_content = this.method_content.replace('___last_name___', '');
                this.method_content = this.method_content.replace('___gender___', '');
                this.method_content = this.method_content.replace('___marital___', '');
                this.method_content = this.method_content.replace('___birth_date___', '');
                this.method_content = this.method_content.replace('___nominee_name___', 'NA NA');
                this.method_content = this.method_content.replace('___nominee_age___', '0');
                this.method_content = this.method_content.replace('___nominee_relation___', 'NA');
                this.method_content = this.method_content.replace('___appointee_name___', '');
                this.method_content = this.method_content.replace('___appointee_relation___', '');
                this.method_content = this.method_content.replace('___occupation___', '0007');
                //this.method_content = this.method_content.replace('___email___', this.lm_request['company_contact_person_email']);
                //this.method_content = this.method_content.replace('___mobile___', this.lm_request['company_contact_person_mobile']);
                //this.method_content = this.method_content.replace('___gst_no___', this.lm_request['company_gst_no']);
            }
        }

        if (!this.lm_request.hasOwnProperty('vehicle_insurance_subtype')) {
            this.lm_request['vehicle_insurance_subtype'] = '1CH_0TP';
        }
        var obj_tenure = {
            '0CH_1TP': 1,
            '0CH_3TP': 3,
            '0CH_5TP': 5,
            '1OD_0TP': 1,
            '1CH_0TP': 1,
            '1CH_2TP': 3,
            '1CH_4TP': 5,
            '3CH_0TP': 3,
            '2CH_0TP': 2,
            '5CH_0TP': 5
        };
        var policy_tenure = obj_tenure[this.lm_request['vehicle_insurance_subtype']];
        this.method_content = this.method_content.toString().replace('___policy_tenure___', policy_tenure);

        /*if (this.prepared_request['vehicle_insurance_subtype'] == '1CH_0TP' || this.prepared_request['vehicle_insurance_subtype'] == '0CH_1TP') {
         this.method_content = this.method_content.toString().replace('<tns:RiskType>___vehicle_insurance_subtype_2___</tns:RiskType>', '<tns:RiskType>___product_id___</tns:RiskType>');
         }*/


        if ((this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) && (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP')) {
            if (this.lm_request['product_id'] === 1) {
                this.method_content = this.method_content.toString().replace('___vehicle_insurance_subtype_2___', 'PSO');
            }
            if (this.lm_request['product_id'] === 10) {
                this.method_content = this.method_content.toString().replace('___vehicle_insurance_subtype_2___', 'TSO');
            }
            if (this.lm_request['method_type'] === 'Premium') {
                this.prepared_request['tp_policy_tenure'] = ((parseInt(this.lm_request['product_id']) === 1) ? "3" : "5");
                this.processed_request['___tp_policy_tenure___'] = this.prepared_request['tp_policy_tenure'];
            }
            if (this.lm_request['method_type'] === 'Proposal') {
                this.lm_request['tp_start_date'] = moment(this.lm_request['tp_start_date'], "DD-MM-YYYY").format("YYYY-MM-DD");
                this.lm_request['tp_end_date'] = moment(this.lm_request['tp_end_date'], "DD-MM-YYYY").format("YYYY-MM-DD");

                this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                this.prepared_request['tp_start_date'] = this.lm_request['tp_start_date'];
                this.processed_request['___tp_start_date___'] = this.lm_request['tp_start_date'];
                this.prepared_request['tp_end_date'] = this.lm_request['tp_end_date'];
                this.processed_request['___tp_end_date___'] = this.lm_request['tp_end_date'];
                this.prepared_request['tp_policy_tenure'] = moment(this.lm_request['tp_end_date']).diff(this.lm_request['tp_start_date'], 'years');
                this.processed_request['___tp_policy_tenure___'] = this.prepared_request['tp_policy_tenure'];
            }
            this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Code'];
            this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
        } else {
            //if (this.lm_request['method_type'] === 'Proposal') {
            var posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--ODONLY_START-->', '<!--ODONLY_FINISH-->', false);
            this.method_content = this.method_content.replace(posp_request_data, '');
            //}
        }

        if (this.lm_request['product_id'] == '10') {
            var vehicle_insurance_subtype_3 = {
                "0CH_1TP": "FTW", "1CH_0TP": "FTW", "1OD_0TP": "TSO", "2CH_0TP": "LT2", "3CH_0TP": "LT3", "1CH_4TP": "L15", "5CH_0TP": "L55"
            };
            this.method_content = this.method_content.toString().replace('___vehicle_insurance_subtype_2___', vehicle_insurance_subtype_3[this.lm_request['vehicle_insurance_subtype']]);
        }

        //for TP only plan in renewal
        if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            this.method_content = this.method_content.toString().replace('___vehicle_expected_idv___', '0');
            this.method_content = this.method_content.toString().replace('<tns:CarDamageSelected>True</tns:CarDamageSelected>', '<tns:CarDamageSelected>False</tns:CarDamageSelected>');
        } else {
            this.method_content = this.method_content.toString().replace('<tns:CoverType>LO</tns:CoverType>', '');
        }

        //for posp case
        var posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--POS_CONFIG_START-->', '<!--POS_CONFIG_FINISH-->', false);
        if (this.lm_request['is_posp'] === 'yes') {
            var obj_replace = {
                '___posp_mobile_no___': '8356844187'
            };
            if (Object.keys(obj_replace).length > 0) {
                this.method_content = this.method_content.toString().replaceJson(obj_replace);
            }

            this.method_content = this.method_content.replace('___is_posp_2___', 'Y');
            for (var k in this.lm_request) {
                if (k.indexOf('posp_') === 0) {
                    this.method_content = this.method_content.replace('___' + k + '___', this.lm_request[k]);
                }
            }
        } else {
            this.method_content = this.method_content.replace(posp_request_data, '');
        }


        if (parseInt(this.prepared_request['dbmaster_insurer_vehicle_cubiccapacity']) < 100) {
            this.prepared_request['dbmaster_insurer_vehicle_cubiccapacity'] = '0' + this.prepared_request['dbmaster_insurer_vehicle_cubiccapacity'].toString();
            this.processed_request['___dbmaster_insurer_vehicle_cubiccapacity___'] = this.prepared_request['dbmaster_insurer_vehicle_cubiccapacity'].toString();
        }

        if (this.insurer_lm_request.hasOwnProperty('birth_date')) {
            var birth_date = this.insurer_lm_request['birth_date'].toString().replace(/\-/g, '');
            this.method_content = this.method_content.toString().replace('___birth_date___', birth_date);
        }


        /*
         *  <tns:PADriverSelected>___pa_paid_driver_si_2___</tns:PADriverSelected>
         <tns:CosumableCoverSelected>___addon_consumable_cover___</tns:CosumableCoverSelected>
         <tns:RoadsideAssistanceSelected>___addon_road_assist_cover___</tns:RoadsideAssistanceSelected>
         <tns:ZeroDepriciationSelected>___addon_zero_dep_cover___</tns:ZeroDepriciationSelected>
         <tns:InvoicePriceSelected>___addon_invoice_price_cover___</tns:InvoicePriceSelected>
         <tns:KeyReplacementSelected>___addon_key_lock_cover___</tns:KeyReplacementSelected>
         <tns:HospitalCashSelected>___addon_hospital_cash_cover___</tns:HospitalCashSelected>
         <tns:MedicalExpensesSelected>___addon_medical_expense_cover___</tns:MedicalExpensesSelected>
         <tns:AmbulanceChargesSelected>___addon_ambulance_charge_cover___</tns:AmbulanceChargesSelected>
         <tns:PAFamilyPremiumSelected>___pa_named_passenger_si_2___</tns:PAFamilyPremiumSelected>
         <tns:EngineGearBoxProtectionSelected>___addon_engine_protector_cover___</tns:EngineGearBoxProtectionSelected>
         <tns:HydrostaticLockSelected>___addon_hydrostatic_lock_cover___</tns:HydrostaticLockSelected>
         <tns:NoClaimBonusSameSlabSelected>___addon_ncb_protection_cover___</tns:NoClaimBonusSameSlabSelected>
         */
        var objZeroReplace = ['electrical_accessory', 'non_electrical_accessory', 'pa_owner_driver_si', 'pa_unnamed_passenger_si', 'pa_named_passenger_si', 'pa_paid_driver_si', 'voluntary_deductible'];

        for (var key1 in objZeroReplace) {
            key = objZeroReplace[key1];
            if (!this.lm_request.hasOwnProperty(key) || this.lm_request[key] === '' || (this.lm_request[key] - 0) < 1) {
                this.prepared_request[key] = '0';
                this.processed_request['___' + key + '___'] = '0';
            }
        }
        if (this.prepared_request.hasOwnProperty('vehicle_age_year') && this.prepared_request['vehicle_age_year'] !== '' && this.lm_request['vehicle_insurance_type'] === 'renew') {
            this.prepared_request['vehicle_age_year'] += 1;
            this.processed_request['___vehicle_age_year___'] += 1;
        }



        for (var addon_key in this.const_addon_master) {
            if (!this.lm_request.hasOwnProperty(addon_key)) {
                this.prepared_request[addon_key] = 'False';
                this.processed_request['___' + addon_key + '___'] = 'False';
            }
        }
        if (this.processed_request['___external_bifuel_value___'] - 0 > 0) {
            if (this.lm_request['external_bifuel_type'] === 'lpg') {
                this.processed_request['___dbmaster_insurer_vehicle_fueltype___'] = 'L';
            } else if (this.lm_request['external_bifuel_type'] === 'cng') {
                this.processed_request['___dbmaster_insurer_vehicle_fueltype___'] = 'C';
            }
        }
        if (this.lm_request.hasOwnProperty('oslc_si') || this.lm_request['product_id'] === 1) {
            this.method_content = this.method_content.toString().replace('___oslc_si___', this.lm_request['oslc_si']);
        }
        if (this.lm_request['product_id'] === 10) {
            this.method_content = this.method_content.toString().replace('___oslc_si___', '0');
        }
        if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') {
            this.prepared_request['is_pa_od'] = this.lm_request['is_pa_od'];
            this.processed_request['___is_pa_od___'] = this.prepared_request['is_pa_od'];
            if (this.lm_request['is_pa_od'] === 'yes') {
                this.method_content = this.method_content.replace('___is_pa_od_license___', 'Y');
            } else {
                this.method_content = this.method_content.replace('___is_pa_od_license___', 'N');
            }
        }

        if (((this.lm_request['product_id'] === 1 && (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1)) || (this.lm_request['product_id'] === 10)) && this.lm_request['is_policy_exist'] === 'no' && this.lm_request['is_breakin'] === 'yes') {
            this.method_content = this.method_content.replace('___is_claim_exists___', '1');
            this.method_content = this.method_content.replace('<tns:PolicyType>Comprehensive</tns:PolicyType>', '<tns:PolicyType></tns:PolicyType>');
            this.method_content = this.method_content.replace('___policy_expiry_date___', '1900-01-01');
            this.method_content = this.method_content.replace('___vehicle_ncb_next___', '0');
            if (this.lm_request['method_type'] === 'Proposal') {
                this.method_content = this.method_content.replace('___dbmaster_insurername___', '0');
                this.method_content = this.method_content.replace('___previous_policy_number___', '0');
            }
        }
        if (this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            this.method_content = this.method_content.toString().replace('___oslc_si___', '0');
            this.method_content = this.method_content.toString().replace('___is_oslc___', 'FALSE');
        }
        if (this.processed_request.hasOwnProperty('___insurer_customer_identifier___')) {
            this.method_content = this.method_content.toString().replace('___bhartiaxa_order_no___', this.processed_request['___insurer_customer_identifier___'].toString().split('-')[0]);
            this.method_content = this.method_content.toString().replace('___bhartiaxa_quote_no___', this.processed_request['___insurer_customer_identifier___'].toString().split('-')[1]);
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
BhartiAxaMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
BhartiAxaMotor.prototype.insurer_product_field_process_post = function () {

};
BhartiAxaMotor.prototype.insurer_product_api_post = function () {

};

BhartiAxaMotor.prototype.bhartiaxa_order_no = function () {
    console.log('bhartiaxa_order_no', this);
    var order_no = 'NA';
    try {
        if (this.prepared_request.hasOwnProperty('dbmaster_insurer_transaction_identifier')) {
            var arr_ident = this.prepared_request['dbmaster_insurer_transaction_identifier'].toString().split('-');
            order_no = arr_ident[0];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'bhartiaxa_order_no', ex);
    }
    return order_no;

    // this.prepared_request['dbmaster_insurer_transaction_identifier'];
//var Master_Db_List = this.insurer_master_object['insurer_id_' + Insurer_Id]['master_db_list'];
};
BhartiAxaMotor.prototype.bhartiaxa_quote_no = function () {
    console.log('bhartiaxa_quote_no', this);
    var quote_no = 'NA';
    try {
        if (this.prepared_request.hasOwnProperty('dbmaster_insurer_transaction_identifier')) {
            var arr_ident = this.prepared_request['dbmaster_insurer_transaction_identifier'].toString().split('-');
            quote_no = arr_ident[1];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'bhartiaxa_quote_no', ex);
    }
    return quote_no;
// this.prepared_request['dbmaster_insurer_transaction_identifier'];
//var Master_Db_List = this.insurer_master_object['insurer_id_' + Insurer_Id]['master_db_list'];
};

BhartiAxaMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        docLog.Insurer_Request = docLog.Insurer_Request.replace('<Sessio>', '<Session>');
        var args = {"SessionDoc": ""};
        args['SessionDoc'] = docLog.Insurer_Request;
        soap.createClient(specific_insurer_object.method_file_url, function (err, client) {
            client.serve(args, function (err1, result, raw, soapHeader) {
                //var premiumObj = result.tuple.old.serve.serve.Envelope.Body.processTPRequestResponse.response;
                if (err1) {

                    var objResponseFull = {
                        'err': err1,
                        'result': result,
                        'raw': raw,
                        'soapHeader': null,
                        'objResponseJson': null
                    };
                } else {
                    var premiumObj = result.tuple.old.serve.serve;
                    console.log('BhaartiResponse', premiumObj);
                    var objResponseFull = {
                        'err': err,
                        'result': result,
                        'raw': raw,
                        'soapHeader': null,
                        'objResponseJson': premiumObj
                    };
                }
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

            });
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
BhartiAxaMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson) {
            if (objResponseJson.hasOwnProperty('Gateway')) {
                Error_Msg = objResponseJson.Gateway.Authentication;
            } else {
                var objMainService = objResponseJson.Envelope.Body;

                if (objMainService.hasOwnProperty('processTPRequestResponse')) {
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('Error') && objMainService['processTPRequestResponse']['Error'] !== '') {
                        Error_Msg = 'LM_MSG::REQUEST_HAS_ISSUE_CHECK_PARAMETER';
                    }
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('response')) {
                        if (objResponseJson.Envelope.Body.processTPRequestResponse.response.hasOwnProperty('StatusMsg') && objResponseJson.Envelope.Body.processTPRequestResponse.response.StatusMsg.toString() !== 'Success') {
                            Error_Msg = objResponseJson.Envelope.Body.processTPRequestResponse.response.StatusMsg.toString();
                        }
                    }
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('response')) {
                        if (objResponseJson.Envelope.Body.processTPRequestResponse.response.hasOwnProperty('IDVMessage') && objResponseJson.Envelope.Body.processTPRequestResponse.response.IDVMessage.toString() !== '') {
                            Error_Msg = objResponseJson.Envelope.Body.processTPRequestResponse.response.IDVMessage.toString();
                        }
                    }
                } else {
                    var Error_Full_Text = objMainService.Fault.detail.FaultDetails[1]['FaultDetailString'].toString();
                    var Error_Start = Error_Full_Text.indexOf(':java.lang.Exception:') + 21;
                    var Error_Finish = Error_Full_Text.indexOf('</faultstring>');
                    Error_Msg = Error_Full_Text.substring(Error_Start, Error_Finish);
                }
            }
        } else {
            Error_Msg = "LM::RESPONSE_EMPTY";
        }


        if (Error_Msg === 'NO_ERR') {
            var objPremiumService = objResponseJson.Envelope.Body.processTPRequestResponse.response;
            var objInsurerPremium = {};
            var premium_breakup = this.get_const_premium_breakup();
            for (var keyCover in objPremiumService['PremiumSet']['Cover']) {
                var cover_name = objPremiumService['PremiumSet']['Cover'][keyCover]['Name'];
                Object.assign(objInsurerPremium, JSON.parse('{"' + cover_name + '":""}'));
                objInsurerPremium[cover_name] = objPremiumService['PremiumSet']['Cover'][keyCover];
            }

            var od_final = 0;
            for (var keyCover in this.premium_breakup_schema['own_damage']) {
                var bharti_key = this.premium_breakup_schema['own_damage'][keyCover];
                if (objInsurerPremium['CarDamage']['ExtraDetails']['BreakUp'].hasOwnProperty(bharti_key) && bharti_key !== '' && bharti_key !== 0) {
                    premium_breakup['own_damage'][keyCover] = objInsurerPremium['CarDamage']['ExtraDetails']['BreakUp'][bharti_key];
                    if (keyCover.indexOf('_disc') > -1) {
                        od_final -= (premium_breakup['own_damage'][keyCover] - 0);
                    } else {
                        od_final += (premium_breakup['own_damage'][keyCover] - 0);
                    }
                } else {
                    premium_breakup['own_damage'][keyCover] = 0;
                }
            }
            if ((objPremiumService['PremiumSet']['Discount'] - 0) !== 0) {
                var disc = objPremiumService['PremiumSet']['Discount'] - 0;
                var basic_od = objInsurerPremium['CarDamage']['ExtraDetails']['BreakUp']['BasicOD'] - 0;
                if (disc < 0) { // discount
                    disc = 0 - disc;
                    premium_breakup['own_damage']['od_disc'] = basic_od * disc / 100;
                } else { // loading
                    premium_breakup['own_damage']['od_loading'] = objInsurerPremium['CarDamage']['Premium'] - od_final;
                }
            }
            premium_breakup['liability']['tp_basic'] = objInsurerPremium['ThirdPartyLiability']['ExtraDetails']['BreakUp']['TP'];
            premium_breakup['liability']['tp_cover_owner_driver_pa'] = objInsurerPremium['PAOwnerDriver']['Premium'];
            if (objInsurerPremium['PAOwnerDriver']['Premium'] === 285) {
                premium_breakup['liability']['tp_cover_owner_driver_pa'] = 330;
            }
            premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = objInsurerPremium['PAFamily']['Premium'] - 0;
            premium_breakup['liability']['tp_cover_paid_driver_pa'] = objInsurerPremium['ThirdPartyLiability']['ExtraDetails']['BreakUp']['TPPD'];
            premium_breakup['liability']['tp_cover_paid_driver_ll'] = objInsurerPremium['ThirdPartyLiability']['ExtraDetails']['BreakUp']['LLDriver'];
            premium_breakup['liability']['tp_cng_lpg'] = objInsurerPremium['ThirdPartyLiability']['ExtraDetails']['BreakUp']['TPBiFuel'];
            if (objInsurerPremium.hasOwnProperty('OSLC')) {
                premium_breakup['liability']['tp_cover_outstanding_loan'] = parseInt(Math.round(objInsurerPremium['OSLC']['Premium']));
            } else {
                premium_breakup['liability']['tp_cover_outstanding_loan'] = 0;
            }

            for (var keyCover in this.premium_breakup_schema['addon']) {
                var bharti_key = this.premium_breakup_schema['addon'][keyCover];
                if (objInsurerPremium.hasOwnProperty(bharti_key)) {
                    premium_breakup['addon'][keyCover] = objInsurerPremium[bharti_key]['Premium'];
                } else {
                    premium_breakup['addon'][keyCover] = 0;
                }
            }
            //premium_breakup['addon']['addon_hydrostatic_lock_cover'] = objInsurerPremium['HYLC']['Premium'];
            premium_breakup['addon']['addon_final_premium'] = 0;
            var group_final_key, group_final = 0;
            for (var key in premium_breakup) {
                if (typeof premium_breakup[key] === 'object') {
                    group_final_key = '';
                    group_final = 0;
                    for (var sub_key in premium_breakup[key]) {
                        if (sub_key.indexOf('final_') > -1) {
                            group_final_key = sub_key;
                        } else {
                            premium_val = parseFloat(premium_breakup[key][sub_key]);
                            premium_breakup[key][sub_key] = premium_val;
                            if (sub_key.indexOf('_disc') > -1) {
                                group_final -= premium_val;
                            } else {
                                group_final += premium_val;
                            }
                        }
                        console.log(key, sub_key);
                    }
                    console.log(group_final_key);
                    premium_breakup[key][group_final_key] = group_final;
                }
            }


            premium_breakup['net_premium'] = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'] + premium_breakup['addon']['addon_final_premium'];
            premium_breakup['service_tax'] = premium_breakup['net_premium'] * 0.18;
            premium_breakup['final_premium'] = premium_breakup['net_premium'] + premium_breakup['service_tax'];

            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['OrderNo'] + '-' + objPremiumService['QuoteNo'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
    }
    return objServiceHandler;
};
BhartiAxaMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var Insurer_Id = specific_insurer_object['insurer_id'];
        var Master_Db_List = objProduct.insurer_master_object['insurer_id_' + Insurer_Id]['master_db_list'];
        var Insurer_Vehicle_ExShowRoom = Master_Db_List['vehicles']['insurer_db_master']['Insurer_Vehicle_ExShowRoom'];
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
            "Idv_Min": Math.round(Idv * 0.8),
            "Idv_Max": Math.round(Idv * 1.2),
            "Exshowroom": Insurer_Vehicle_ExShowRoom
        };
        this.insurer_vehicle_idv_handler(Db_Idv_Calculated, objProduct, Insurer_Object, specific_insurer_object);
        console.log('Finish', this.constructor.name, 'insurer_vehicle_idv', Db_Idv_Calculated);
        return Db_Idv_Calculated;
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', ex);

    }
};

BhartiAxaMotor.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson) {
            if (objResponseJson.hasOwnProperty('Gateway')) {
                Error_Msg = objResponseJson.Gateway.Authentication;
            } else {
                var objMainService = objResponseJson.Envelope.Body;

                if (objMainService.hasOwnProperty('processTPRequestResponse')) {
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('Error') && objMainService['processTPRequestResponse']['Error'] !== '') {
                        Error_Msg = 'LM_MSG::REQUEST_HAS_ISSUE_CHECK_PARAMETER';
                    }
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('response')) {
                        if (objResponseJson.Envelope.Body.processTPRequestResponse.response.hasOwnProperty('StatusMsg') && objResponseJson.Envelope.Body.processTPRequestResponse.response.StatusMsg.toString() !== 'Success') {
                            Error_Msg = objResponseJson.Envelope.Body.processTPRequestResponse.response.StatusMsg.toString();
                        }
                    }
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('response')) {
                        if (objResponseJson.Envelope.Body.processTPRequestResponse.response.hasOwnProperty('IDVMessage') && objResponseJson.Envelope.Body.processTPRequestResponse.response.IDVMessage.toString() !== '') {
                            Error_Msg = objResponseJson.Envelope.Body.processTPRequestResponse.response.IDVMessage.toString();
                        }
                    }
                } else {
                    var Error_Full_Text = objMainService.Fault.detail.FaultDetails[1]['FaultDetailString'].toString();
                    var Error_Start = Error_Full_Text.indexOf(':java.lang.Exception:') + 21;
                    var Error_Finish = Error_Full_Text.indexOf('</faultstring>');
                    Error_Msg = Error_Full_Text.substring(Error_Start, Error_Finish);
                }
            }
        } else {
            Error_Msg = "LM::RESPONSE_EMPTY";
        }

        if (Error_Msg === 'NO_ERR') {
            var objPremiumService = objResponseJson.Envelope.Body.processTPRequestResponse.response;
            var objInsurerPremium = {};
            var premium_breakup = this.get_const_premium_breakup();
            for (var keyCover in objPremiumService['PremiumSet']['Cover']) {
                var cover_name = objPremiumService['PremiumSet']['Cover'][keyCover]['Name'];
                Object.assign(objInsurerPremium, JSON.parse('{"' + cover_name + '":""}'));
                objInsurerPremium[cover_name] = objPremiumService['PremiumSet']['Cover'][keyCover];
            }

            var od_final = 0;
            for (var keyCover in this.premium_breakup_schema['own_damage']) {
                var bharti_key = this.premium_breakup_schema['own_damage'][keyCover];
                if (objInsurerPremium['CarDamage']['ExtraDetails']['BreakUp'].hasOwnProperty(bharti_key) && bharti_key !== '' && bharti_key !== 0) {
                    premium_breakup['own_damage'][keyCover] = objInsurerPremium['CarDamage']['ExtraDetails']['BreakUp'][bharti_key];
                    if (keyCover.indexOf('_disc') > -1) {
                        od_final -= (premium_breakup['own_damage'][keyCover] - 0);
                    } else {
                        od_final += (premium_breakup['own_damage'][keyCover] - 0);
                    }
                } else {
                    premium_breakup['own_damage'][keyCover] = 0;
                }
            }
            if ((objPremiumService['PremiumSet']['Discount'] - 0) !== 0) {
                var disc = objPremiumService['PremiumSet']['Discount'] - 0;
                var basic_od = objInsurerPremium['CarDamage']['ExtraDetails']['BreakUp']['BasicOD'] - 0;
                if (disc < 0) { // discount
                    disc = 0 - disc;
                    premium_breakup['own_damage']['od_disc'] = basic_od * disc / 100;
                } else { // loading
                    premium_breakup['own_damage']['od_loading'] = objInsurerPremium['CarDamage']['Premium'] - od_final;
                }
            }
            premium_breakup['liability']['tp_basic'] = objInsurerPremium['ThirdPartyLiability']['ExtraDetails']['BreakUp']['TP'];
            premium_breakup['liability']['tp_cover_owner_driver_pa'] = objInsurerPremium['PAOwnerDriver']['Premium'];
            if (objInsurerPremium['PAOwnerDriver']['Premium'] === 285) {
                premium_breakup['liability']['tp_cover_owner_driver_pa'] = 330;
            }
            premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = objInsurerPremium['PAFamily']['Premium'] - 0;
            premium_breakup['liability']['tp_cover_paid_driver_pa'] = objInsurerPremium['ThirdPartyLiability']['ExtraDetails']['BreakUp']['TPPD'];
            premium_breakup['liability']['tp_cover_paid_driver_ll'] = objInsurerPremium['ThirdPartyLiability']['ExtraDetails']['BreakUp']['LLDriver'];
            premium_breakup['liability']['tp_cng_lpg'] = objInsurerPremium['ThirdPartyLiability']['ExtraDetails']['BreakUp']['TPBiFuel'];
            if (objInsurerPremium.hasOwnProperty('OSLC')) {
                premium_breakup['liability']['tp_cover_outstanding_loan'] = parseInt(Math.round(objInsurerPremium['OSLC']['Premium']));
            } else {
                premium_breakup['liability']['tp_cover_outstanding_loan'] = 0;
            }

            for (var keyCover in this.premium_breakup_schema['addon']) {
                var bharti_key = this.premium_breakup_schema['addon'][keyCover];
                if (objInsurerPremium.hasOwnProperty(bharti_key)) {
                    premium_breakup['addon'][keyCover] = objInsurerPremium[bharti_key]['Premium'];
                } else {
                    premium_breakup['addon'][keyCover] = 0;
                }
            }
            //premium_breakup['addon']['addon_hydrostatic_lock_cover'] = objInsurerPremium['HYLC']['Premium'];
            premium_breakup['addon']['addon_final_premium'] = 0;
            var group_final_key, group_final = 0;
            for (var key in premium_breakup) {
                if (typeof premium_breakup[key] === 'object') {
                    group_final_key = '';
                    group_final = 0;
                    for (var sub_key in premium_breakup[key]) {
                        if (sub_key.indexOf('final_') > -1) {
                            group_final_key = sub_key;
                        } else {
                            premium_val = parseFloat(premium_breakup[key][sub_key]);
                            premium_breakup[key][sub_key] = premium_val;
                            if (sub_key.indexOf('_disc') > -1) {
                                group_final -= premium_val;
                            } else {
                                group_final += premium_val;
                            }
                        }
                        console.log(key, sub_key);
                    }
                    console.log(group_final_key);
                    premium_breakup[key][group_final_key] = group_final;
                }
            }
            premium_breakup['addon']['addon_final_premium'] = 0;
            for (let k in premium_breakup['addon']) {
                if (k !== 'addon_final_premium') {
                    if (this.addon_processed_request.hasOwnProperty(k) && this.addon_processed_request[k].toLowerCase() === "true") {
                        premium_breakup['addon']['addon_final_premium'] += premium_breakup['addon'][k];
                    } else {
                        premium_breakup['addon'][k] = 0;
                    }
                }
            }

            premium_breakup['net_premium'] = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'] + premium_breakup['addon']['addon_final_premium'];
            premium_breakup['service_tax'] = premium_breakup['net_premium'] * 0.18;
            premium_breakup['final_premium'] = premium_breakup['net_premium'] + premium_breakup['service_tax'];

            objServiceHandler.Premium_Breakup = premium_breakup;
            var Customer = {
                'final_premium_verified': premium_breakup['final_premium'],
                'insurer_customer_identifier': objPremiumService['OrderNo'] + '-' + objPremiumService['QuoteNo']
            };
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['OrderNo'] + '-' + objPremiumService['QuoteNo'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
    }
    return objServiceHandler;
};
BhartiAxaMotor.prototype.customer_response_handler_niu = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson) {
            if (objResponseJson.hasOwnProperty('Gateway')) {
                Error_Msg = objResponseJson.Gateway.Authentication;
            } else {
                var objMainService = objResponseJson.Envelope.Body;

                if (objMainService.hasOwnProperty('processTPRequestResponse')) {
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('Error') && objMainService['processTPRequestResponse']['Error'] !== '') {
                        Error_Msg = 'LM_MSG::REQUEST_HAS_ISSUE_CHECK_PARAMETER';
                    }
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('response')) {
                        if (objResponseJson.Envelope.Body.processTPRequestResponse.response.hasOwnProperty('StatusMsg') && objResponseJson.Envelope.Body.processTPRequestResponse.response.StatusMsg.toString() !== 'Success') {
                            Error_Msg = objResponseJson.Envelope.Body.processTPRequestResponse.response.StatusMsg.toString();
                        }
                    }
                    if (objMainService['processTPRequestResponse'].hasOwnProperty('response')) {
                        if (objResponseJson.Envelope.Body.processTPRequestResponse.response.hasOwnProperty('IDVMessage') && objResponseJson.Envelope.Body.processTPRequestResponse.response.IDVMessage.toString() !== '') {
                            Error_Msg = objResponseJson.Envelope.Body.processTPRequestResponse.response.IDVMessage.toString();
                        }
                    }
                } else {
                    var Error_Full_Text = objMainService.Fault.detail.FaultDetails[1]['FaultDetailString'].toString();
                    var Error_Start = Error_Full_Text.indexOf(':java.lang.Exception:') + 21;
                    var Error_Finish = Error_Full_Text.indexOf('</faultstring>');
                    Error_Msg = Error_Full_Text.substring(Error_Start, Error_Finish);
                }
            }
        } else {
            Error_Msg = "LM::RESPONSE_EMPTY";
        }
        var addonCode = {
            "DEPC": "addon_zero_dep_cover",
            "RSAP": "addon_road_assist_cover",
            "NCBS": "addon_ncb_protection_cover",
            "EGBP": "addon_engine_protector_cover",
            "KEYC": "addon_key_lock_cover",
            "CONC": "addon_consumable_cover",
            "MEDI": "addon_medical_expense_cover",
            "HOSP": "addon_hospital_cash_cover",
            "AMBC": "addon_ambulance_charge_cover",
            "HYLC": "addon_hydrostatic_lock_cover",
            "INPC": "addon_invoice_price_cover"
        };

        if (Error_Msg === 'NO_ERR') {
            var objPremiumService = objResponseJson.Envelope.Body.processTPRequestResponse.response;
            var addon_price = 0;
            var addonCover = objPremiumService['PremiumSet']['Cover'];
            for (var key in addonCover) {
                if (addonCover[key]['Type'] === "Addon") {
                    if (this.addon_processed_request[addonCode[addonCover[key]['Name']]] !== "False") {
                        addon_price += ((addonCover[key]['Premium'] - 0) + ((addonCover[key]['Premium'] - 0) * 0.18));
                    }
                }
            }
            var Customer = {
                'final_premium_verified': parseInt(objPremiumService['PremiumSet']['PremiumDetails']['TotalPremium']) + parseInt(addon_price),
                'insurer_customer_identifier': objPremiumService['OrderNo'] + '-' + objPremiumService['QuoteNo']
            };
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['OrderNo'] + '-' + objPremiumService['QuoteNo'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
    }
    return objServiceHandler;
};
BhartiAxaMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';

    try {
        if (objResponseJson.hasOwnProperty('Gateway')) {
            Error_Msg = objResponseJson.Gateway.Authentication;
        } else {
            var objMainService = objResponseJson.Envelope.Body;
            if (objMainService.hasOwnProperty('processTPRequestResponse')) {
                if (objMainService['processTPRequestResponse'].hasOwnProperty('Error') && objMainService['processTPRequestResponse']['Error'] !== '') {
                    Error_Msg = 'LM_MSG::REQUEST_HAS_ISSUE_CHECK_PARAMETER';
                } else {
                    var objPremiumService = objMainService.processTPRequestResponse.response;
                    if (objPremiumService['StatusCode'] === '200') {
                        var proposalQuoteNumber = objPremiumService['QuoteNo'];
                        var quotationQuoteNumber = this.prepared_request['bhartiaxa_quote_no'];
                        //console.error('BAGI',proposalQuoteNumber,quotationQuoteNumber);
                        if (proposalQuoteNumber !== quotationQuoteNumber && false) {
                            Error_Msg = 'LM_MSG:Quote_Number_Mismatch_Premium_Proposal';
                        }
                    } else {
                        Error_Msg = objPremiumService['StatusMsg'];
                    }
                }
            } else {
                var Error_Full_Text = objMainService.Fault.detail.FaultDetails[1]['FaultDetailString'].toString();
                var Error_Start = Error_Full_Text.indexOf(':java.lang.Exception:') + 21;
                var Error_Finish = Error_Full_Text.indexOf('</faultstring>');
                Error_Msg = Error_Full_Text.substring(Error_Start, Error_Finish);
            }
        }

        if (Error_Msg === 'NO_ERR') {
            var objPremiumService = objResponseJson.Envelope.Body.processTPRequestResponse.response;
            var final_premium = objPremiumService.PremiumSet.PremiumDetails.TotalPremium - 0;
            var objPremiumVerification = this.premium_verification(this.processed_request['___final_premium_verified___'], final_premium, 55, 10);
            //var objPremiumVerification = this.premium_verification(this.processed_request['___final_premium___'], final_premium, 55, 10);
            if (objPremiumVerification.Status || objPremiumVerification.Diff_Amt === -53) {
                var objInsurerPremium = {};
                var premium_breakup = this.get_const_premium_breakup();
                var pg_data = {
                    'OrderNo': objPremiumService['OrderNo'],
                    'QuoteNo': objPremiumService['QuoteNo'],
                    'Channel': objPremiumService.SessionData.Channel,
                    'Product': 'MTR',
                    'Amount': (config.environment.name === 'Production') ? final_premium : 1,
                    'IsMobile': (this.lm_request.hasOwnProperty('is_mobile') && this.lm_request['is_mobile'] === 'yes') ? 'Y' : 'N'
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['OrderNo'] + '-' + objPremiumService['QuoteNo'];
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }


        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
BhartiAxaMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objInsurerProduct = this;
        let payment_response = objInsurerProduct.const_payment_response;

        //this.pg_response_handler();
        var product_name = 'CAR';
        if (objInsurerProduct.lm_request['product_id'] === 10) {
            product_name = 'TW';
        }
        if (objInsurerProduct.prepared_request.transaction_status === 'SUCCESS') {

            //for horizon
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + objInsurerProduct.prepared_request.policy_number + '.pdf';
            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;

            //for portal
            var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            objInsurerProduct.const_policy.policy_url = pdf_web_path_portal;

            //this.const_policy.policy_url = pdf_web_path;
            try {
                var https = require('https');
                var insurer_pdf_url = objInsurerProduct.prepared_request['insurer_integration_pdf_url'];
                var policy_link = objInsurerProduct.lm_request['pg_get']['link'].toString().toLowerCase();
                var policy_transaction_id = objInsurerProduct.find_text_btw_key(policy_link, '/reportfiles/', '.pdf', false);
                insurer_pdf_url = insurer_pdf_url.replace('___transaction_id___', policy_transaction_id);
                console.error('BhartiPdfUrl', insurer_pdf_url);

                var file_horizon = fs.createWriteStream(pdf_sys_loc);
                var request_horizon = https.get(insurer_pdf_url, function (response) {
                    response.pipe(file_horizon);
                });

                /*var file_portal = fs.createWriteStream(pdf_sys_loc_portal);
                 var request_portal = https.get(insurer_pdf_url, function (response) {
                 response.pipe(file_portal);
                 });*/
            } catch (ex1) {
                console.error('Exception', this.constructor.name, 'verification_response_handler', ex1);
            }
        }
        if (objInsurerProduct.prepared_request.transaction_status === 'PAYPASS') {
            //find method field
            try {
                var User_Data = require(appRoot + '/models/user_data');
                User_Data.findOne({"User_Data_Id": this.lm_request['udid']}, function (err, dbUserData) {
                    if (err) {

                    } else {
                        if (dbUserData) {
                            let ObjPayPass = {
                                'PB_CRN': dbUserData['PB_CRN'],
                                'Customer': dbUserData['Proposal_Request']['first_name'] + ' ' + dbUserData['Proposal_Request']['last_name'],
                                'Product': product_name,
                                'VehicleNumber': dbUserData["Proposal_Request_Core"]["registration_no"]
                            };
                            for (let k2 in payment_response['pg_get']) {
                                ObjPayPass[k2] = payment_response['pg_get'][k2];
                            }
                            var msg = '<!DOCTYPE html><html><head><title>PolicyBoss-Landmark Paypass Notification</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                            msg += '<div class="report"><span style="font-size:14px;font-family:\'Google Sans\' ,tahoma;">Dear Bharti Team,<BR>Following transaction is been received as Paypass (Payment Deducted but Policy Not Created).<BR>Following is transaction details. Please provide policy copy.<br>In case of query, Please write to techsupport@policyboss.com <br><br></span><table border="1" cellpadding="3" cellspacing="0" width="90%">';
                            for (let k3 in ObjPayPass) {
                                msg += '<tr><td  width="30%" style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #ffcc00">' + k3 + '</td><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">' + ObjPayPass[k3] + '&nbsp;</td></tr>';
                            }
                            msg += '</table></div></body></html>';

                            var Email = require(appRoot + '/models/email');
                            var objModelEmail = new Email();
                            var sub = '[BHARTIAXA-PAYPASS] CRN:' + dbUserData['PB_CRN'] + ' ORDERNO:' + payment_response['pg_get']['orderNo'];
                            let arr_to = ['nagendra.kotipati.dhruv@bhartiaxa.com', 'ranganayakulu.v.dhruv@bhartiaxa.com'];
                            let arr_cc = ['techsupport@policyboss.com', 'jyoti.sharma@policyboss.com', 'jolly.asija@policyboss.com', 'prachi.shah@bhartiaxa.com', 'satishkumar.singh@bhartiaxa.com'];
                            let arr_bcc = ['horizon.lm.notification@gmail.com'];
                            objModelEmail.send('notifications@policyboss.com', arr_to.join(','), sub, msg, arr_cc.join(','), arr_bcc.join(','), dbUserData['PB_CRN']);
                        }
                    }
                });
            } catch (ex2) {
                console.error('PaypassNotification', ex2);
            }


        }
        objServiceHandler.Insurer_Transaction_Identifier = objInsurerProduct.prepared_request.transaction_id;
        objServiceHandler.Policy = objInsurerProduct.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
        return objServiceHandler;

    } catch (ex) {
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
        return objServiceHandler;
    }
};
BhartiAxaMotor.prototype.pg_response_handler = function () {
    //SUCCESS- productID=MTR&orderNo=VDIR322143&amount=1.00&status=success&transactionRef=ASMP3550113781&policyNo=S8400917&link=/birt/reports/reportFiles/2125669477186659.pdf&emailId=spear.9@bharti-axagi.co.in&ID=
    //PAYPASS- productID=MTR&orderNo=VDJC084434&amount=00000001.00&status=payPass&txnRefNo=JIC45711886995
    //FAILURE- productID=MTR&orderNo=VDJC084434&amount=00000001.00&status=fail&transactionRef=JHMP5711944953&ID=
    console.log('Start', this.constructor.name, 'pg_response_handler');
    try {
        var objInsurerProduct = this;
        this.const_policy.transaction_status = '';
        if (objInsurerProduct.lm_request.pg_get['status'] === 'success') {
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = objInsurerProduct.lm_request.pg_get['policyNo'];
            this.const_policy.transaction_amount = objInsurerProduct.lm_request.pg_get['amount'];
            this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_get['transactionRef'];
        }
        if (objInsurerProduct.lm_request.pg_get['status'] === 'payPass') {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'PAYPASS';
            this.const_policy.transaction_amount = objInsurerProduct.lm_request.pg_get['amount'];
            this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_get['txnRefNo'];
        }
        if (objInsurerProduct.lm_request.pg_get['status'] === 'fail') {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
            this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_get['transactionRef'];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
    console.log('End', this.constructor.name, 'pg_response_handler');
};
BhartiAxaMotor.prototype.vehicle_age_year = function () {
    var age_in_year = 0;
    try {
        var moment = require('moment');
        console.log('Start', this.constructor.name, 'vehicle_age_year');
        var vehicle_manf_date = this.lm_request['vehicle_manf_date'];
        var policy_start_date = this.policy_start_date();
        age_in_year = moment(policy_start_date).diff(vehicle_manf_date, 'years');
        age_in_year = age_in_year + 1;
        console.log('Finish', this.constructor.name, 'vehicle_age_year', age_in_year);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'vehicle_age_year', ex);
        return age_in_year;
    }
    return age_in_year;
};

BhartiAxaMotor.prototype.insurer_dateFormat = function (date_txt) {
    console.log('Start', this.constructor.name, 'insurer_dateFormat');
    var dt_txt = "";
    try {
        dt_txt = date_txt.split("-");
        dt_txt = dt_txt[2] + "-" + dt_txt[1] + "-" + dt_txt[0];
        console.log("dt_txt : " + dt_txt);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_dateFormat', ex);
        return dt_txt;
    }
    return dt_txt;
};

BhartiAxaMotor.prototype.insurer_diffYears = function (edate_txt, sdate_txt) {
    var age_in_year = 0;
    try {
        var moment = require('moment');
        age_in_year = moment(edate_txt).diff(sdate_txt, 'years');
        /*var edt_txt = edate_txt.split("-");
         var sdt_txt = sdate_txt.split("-");
         var edate = moment([edt_txt[2], edt_txt[0], edt_txt[1]]);
         var sdate = moment([sdt_txt[2], sdt_txt[0], sdt_txt[1]]);
         var esdiff = edate.diff(sdate, 'years');       // 1*/
        //var bc = a.diff(b, 'years', true); // 1.75
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_diffYears', ex);
        return age_in_year;
    }
    return age_in_year;
};

BhartiAxaMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "BasicOD",
        "od_elect_access": "Accessory",
        "od_non_elect_access": '',
        "od_cng_lpg": "BiFuel",
        "od_disc_ncb": "NCB",
        "od_disc_vol_deduct": "ODDeductible",
        "od_disc_anti_theft": "AntiTheft",
        "od_disc_aai": '',
        "od_loading": '',
        "od_disc": '',
        "od_final_premium": ''
    },
    "liability": {
        "tp_basic": "ThirdPartyLiability_ExtraDetails_TP",
        "tp_cover_owner_driver_pa": "PAOwnerDriver_Premium",
        "tp_cover_unnamed_passenger_pa": "",
        "tp_cover_named_passenger_pa": "PAFamily_Premium",
        "tp_cover_paid_driver_pa": "ThirdPartyLiability_ExtraDetails_TPPD",
        "tp_cover_paid_driver_ll": "ThirdPartyLiability_ExtraDetails_LLDriver",
        "tp_cng_lpg": "ThirdPartyLiability_ExtraDetails_TPBiFuel",
        "tp_cover_outstanding_loan": "OSLC",
        "tp_final_premium": 0
    },
    "addon": {
        "addon_zero_dep_cover": "DEPC",
        "addon_road_assist_cover": "RSAP",
        "addon_ncb_protection_cover": "NCBS",
        "addon_engine_protector_cover": "EGBP",
        "addon_key_lock_cover": "KEYC",
        "addon_consumable_cover": "CONC",
        "addon_medical_expense_cover": "MEDI",
        "addon_hospital_cash_cover": "HOSP",
        "addon_ambulance_charge_cover": "AMBC",
        "addon_hydrostatic_lock_cover": "HYLC",
        "addon_invoice_price_cover": "INPC",
        "addon_final_premium": 0
    },
    "net_premium": 0,
    "service_tax": 0,
    "final_premium": 0
};
module.exports = BhartiAxaMotor;
