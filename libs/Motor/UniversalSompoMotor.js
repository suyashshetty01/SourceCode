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

function UniversalSompoMotor() {

}
util.inherits(UniversalSompoMotor, Motor);

UniversalSompoMotor.prototype.lm_request_single = {};
UniversalSompoMotor.prototype.insurer_integration = {};
UniversalSompoMotor.prototype.insurer_addon_list = [];
UniversalSompoMotor.prototype.insurer = {};
UniversalSompoMotor.prototype.insurer_date_format = 'dd/MM/yyyy';


UniversalSompoMotor.prototype.insurer_product_api_pre = function () {


};
UniversalSompoMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        var objReplace = {
            'pa_owner_driver_si': '0',
            'pa_unnamed_passenger_si': '0',
            'pa_named_passenger_si': '0',
            'pa_paid_driver_si': '0',
            //'dbmaster_insurer_vehicle_exshowroom': '0',
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
        if (Object.keys(obj_replace).length > 0) {
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }

        if (this.method.Method_Type == 'Idv') {
            var idv_replace = {
                "addon_zero_dep_cover": "False",
                "addon_road_assist_cover": "False",
                "addon_ncb_protection_cover": "False",
                "addon_engine_protector_cover": "False",
                "addon_invoice_price_cover": "False",
                "addon_key_lock_cover": "False",
                "addon_consumable_cover": "False",
                "addon_daily_allowance_cover": "False",
                "addon_windshield_cover": "False",
                "addon_passenger_assistance_cover": "False",
                "addon_tyre_coverage_cover": "False",
                "addon_personal_belonging_loss_cover": "False",
                "addon_inconvenience_allowance_cover": "False",
                "addon_medical_expense_cover": "False",
                "addon_hospital_cash_cover": "False",
                "addon_ambulance_charge_cover": "False",
                "addon_rodent_bite_cover": "False",
                "addon_losstime_protection_cover": "False",
                "addon_hydrostatic_lock_cover": "False"
            };
            for (var key in idv_replace) {
                var value = idv_replace[key];
                this.method_content = this.method_content.toString().replace('___' + key + '___', value);
            }
        }
        if (true) {
            for (var addon_key in this.const_addon_master) {
                if (!this.prepared_request.hasOwnProperty(addon_key)) {
                    this.prepared_request[addon_key] = 'False';
                    this.processed_request['___' + addon_key + '___'] = 'False';
                }
            }

            /*var objDefault = {
             //            'dbmaster_insurername': 'Cholamandalam MS General Insurance Co. Ltd.',
             'dbmaster_insurer_rto_city_name': 'NASHIK',
             'dbmaster_insurer_rto_zone_code': 'B',
             'dbmaster_insurer_rto_city_code': ''
             };
             
             for (var key in objDefault) {
             this.prepared_request[key] = objDefault[key];
             this.processed_request['___' + key + '___'] = objDefault[key];
             
             }*/
        }
        if (this.insurer_lm_request['pa_unnamed_passenger_si'] > 0) {
            //this.prepared_request['pa_unnamed_passenger_si'] = (this.insurer_lm_request['pa_unnamed_passenger_si']) * (this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity']);
            this.processed_request['___pa_unnamed_passenger_si___'] = this.prepared_request['pa_unnamed_passenger_si'];
        }

        if (this.lm_request['product_id'] === 10) {
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--Not for TW Start-->', '<!--Not for TW End-->', true);
            if (txt_replace) {
                this.method_content = this.method_content.replace(txt_replace, '');
            }
        }
        if (this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
            this.method_content = this.method_content.replace('<DocumentType>Quotation</DocumentType>', '<DocumentType>Proposal</DocumentType>');
            this.prepared_request['insurer_integration_agent_code'] = '20000053';
            this.processed_request['___insurer_integration_agent_code___'] = this.prepared_request['insurer_integration_agent_code'];
            this.prepared_request['insurer_integration_location_code'] = '30000055';
            this.processed_request['___insurer_integration_location_code___'] = this.prepared_request['insurer_integration_location_code'];
            this.prepared_request['product_id_2'] = 'Private Car - OD';
            this.processed_request['___product_id_2___'] = this.prepared_request['product_id_2'];
            this.prepared_request['product_id_4'] = '2398';
            this.processed_request['___product_id_4___'] = this.prepared_request['product_id_4'];
            this.prepared_request['vehicle_insurance_type_2'] = 'Renewals';
            this.processed_request['___vehicle_insurance_type_2___'] = this.prepared_request['vehicle_insurance_type_2'];
            var od_only_data = this.find_text_btw_key(this.method_content.toString(), '<!--OD_ONLY_START-->', '<!--OD_ONLY_FINISH-->', false);
            this.method_content = this.method_content.replace(od_only_data, '');
            this.method_content = this.method_content.replace('<!--OD_ONLY_START-->', '');
            this.method_content = this.method_content.replace('<!--OD_ONLY_FINISH-->', '');
            var od_only_data_2 = this.find_text_btw_key(this.method_content.toString(), '<!--OD_ONLY_START_2-->', '<!--OD_ONLY_FINISH_2-->', false);
            this.method_content = this.method_content.replace(od_only_data_2, '');
            this.method_content = this.method_content.replace('<!--OD_ONLY_START_2-->', '');
            this.method_content = this.method_content.replace('<!--OD_ONLY_FINISH_2-->', '');
            this.method_content = this.method_content.replace('<Roo', '<Root>');
            this.method_content = this.method_content.replace('<Root>t', '<Root>');
            this.method_content = this.method_content.replace('<Root>>', '<Root>');
            this.method_content = this.method_content.replace('<Authentiation>', '<Authentication>');
            if (this.lm_request['voluntary_deductible'] === "" || this.lm_request['voluntary_deductible'] === null || this.lm_request['voluntary_deductible'] === "undefined") {
                this.prepared_request['voluntary_deductible'] = "0";
                this.processed_request['___voluntary_deductible___'] = this.prepared_request['voluntary_deductible'];
            } else {
                this.prepared_request['voluntary_deductible_2'] = "True";
                this.processed_request['___voluntary_deductible_2___'] = this.prepared_request['voluntary_deductible_2'];
            }
        } else {
            this.method_content = this.method_content.replace('<!--OD_ONLY_START-->', '');
            this.method_content = this.method_content.replace('<!--OD_ONLY_FINISH-->', '');
            this.method_content = this.method_content.replace('<!--OD_ONLY_START_2-->', '');
            this.method_content = this.method_content.replace('<!--OD_ONLY_FINISH_2-->', '');
        }
        if (this.lm_request['product_id'] === 12) {
            if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                this.prepared_request['vehicle_expected_idv'] = 0;
                this.processed_request['___vehicle_expected_idv___'] = 0;
                var txt_ignore = this.find_text_btw_key(this.method_content, '<!--RequestHide_Start0-->', '<!--RequestHide_End0-->', true);
                var txt_ignore_with = "";
                this.method_content = this.method_content.replace(txt_ignore, txt_ignore_with);
                var txt_ignore = this.find_text_btw_key(this.method_content, '<!--RequestHide_Start1-->', '<!--RequestHide_End1-->', true);
                var txt_ignore_with = "";
                this.method_content = this.method_content.replace(txt_ignore, txt_ignore_with);
                var txt_ignore = this.find_text_btw_key(this.method_content, '<!--RequestHide_Start2-->', '<!--RequestHide_End2-->', true);
                var txt_ignore_with = "";
                this.method_content = this.method_content.replace(txt_ignore, txt_ignore_with);

            } else {
                this.method_content = this.method_content.replace('<!--RequestHide_Start0-->', '');
                this.method_content = this.method_content.replace('<!--RequestHide_End0-->', '');
                this.method_content = this.method_content.replace('<!--RequestHide_Start1-->', '');
                this.method_content = this.method_content.replace('<!--RequestHide_End1-->', '');
                this.method_content = this.method_content.replace('<!--RequestHide_Start2-->', '');
                this.method_content = this.method_content.replace('<!--RequestHide_End2-->', '');
            }
            if (['LPG', 'CNG'].indexOf(this.prepared_request['dbmaster_pb_fuel_name']) > -1) {
                this.prepared_request['external_bifuel_type_2'] = 'True';
                this.processed_request['___external_bifuel_type_2___'] = this.prepared_request['external_bifuel_type_2'];
            } else {
                this.prepared_request['external_bifuel_type_2'] = 'False';
                this.processed_request['___external_bifuel_type_2___'] = this.prepared_request['external_bifuel_type_2'];
            }
            if (this.lm_request.hasOwnProperty('emp_pa')) {
                if (this.lm_request['emp_pa'] === "yes") {
                    this.method_content = this.method_content.replace('___emp_pa___', 'True');
                    this.method_content = this.method_content.replace('___emp_pa_no___', '1');
                } else {
                    this.method_content = this.method_content.replace('___emp_pa___', 'False');
                    this.method_content = this.method_content.replace('___emp_pa_no___', '0');
                }
            } else {
                this.method_content = this.method_content.replace('___emp_pa___', 'False');
                this.method_content = this.method_content.replace('___emp_pa_no___', '0');
            }
            if (this.insurer_lm_request['vehicle_class'] === 'pcv') {
                if (this.lm_request['vehicle_insurance_subtype'] === '1CH_0TP') {
                    this.prepared_request['vehicle_insurance_subtype'] = "2314";
                    this.processed_request['___vehicle_insurance_subtype___'] = this.prepared_request['vehicle_insurance_subtype'];
                    this.prepared_request['vehicle_insurance_subtype_2'] = "PASSENGER CARRYING VEHICLE";
                    this.processed_request['___vehicle_insurance_subtype_2___'] = this.prepared_request['vehicle_insurance_subtype_2'];
                }
            }
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
            for (var k in this.lm_request) {
                if (k.indexOf('posp_') === 0) {
                    this.method_content = this.method_content.replace('___' + k + '___', this.lm_request[k]);
                }
            }
        } else {
            this.method_content = this.method_content.replace(posp_request_data, '');
        }
        //this.prepared_request['vehicle_color'] = objRequest['vehicle_color'].toString().replace(' ','');
        //this.processed_request['___vehicle_color___'] = this.prepared_request['vehicle_color'];
        this.method_content = this.method_content.replace('<Authentiction>', '<Authentication>');

        if (this.method.Method_Type === 'Proposal' && this.lm_request['product_id'] === 1) {
            let own_damage_disc_rate = '';

            try {
                console.error('DBG', 'SOMPOODDISC', this.insurer_master['service_logs']['insurer_db_master']['Premium_Rate']['own_damage']['od_disc']);
                let od_basic = this.insurer_master['service_logs']['insurer_db_master']['Premium_Breakup']['own_damage']['od_basic'];
                let od_disc = this.insurer_master['service_logs']['insurer_db_master']['Premium_Breakup']['own_damage']['od_disc'];
                let od_disc_rate = Math.round((od_disc / od_basic) * 100);
                own_damage_disc_rate = this.insurer_master['service_logs']['insurer_db_master']['Premium_Rate']['own_damage']['od_disc'] - 0;
                if (od_disc_rate !== own_damage_disc_rate) {
                    own_damage_disc_rate = od_disc_rate;
                }
            } catch (e) {
                console.error('Exception', 'SOMPOODDISC', e.stack);
                own_damage_disc_rate = '';
            }
            if (isNaN(own_damage_disc_rate) === false && own_damage_disc_rate > 0) {
                own_damage_disc_rate = own_damage_disc_rate.toString();
            }
            this.method_content = this.method_content.replace('___own_damage_disc_rate___', own_damage_disc_rate);
            this.method_content = this.method_content.replace('___own_damage_disc_rate___', own_damage_disc_rate);
        }

        if (this.lm_request['method_type'] === 'Proposal') {
            if (this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "yes") {
                this.prepared_request['pucc_number'] = this.lm_request['pucc_number'];
                this.processed_request['___pucc_number___'] = this.prepared_request['pucc_number'];
                this.prepared_request['pucc_end_date'] = this.lm_request['pucc_end_date'].replaceAll('-', '/');
                this.processed_request['___pucc_end_date___'] = this.prepared_request['pucc_end_date'];
                this.prepared_request['pucc_center'] = this.processed_request['___dbmaster_insurer_rto_city_name___'];
                this.processed_request['___pucc_center___'] = this.prepared_request['pucc_center'];
            } else if (this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "no") {
                this.prepared_request['pucc_number'] = "";
                this.processed_request['___pucc_number___'] = this.prepared_request['pucc_number'];
                this.prepared_request['pucc_end_date'] = "";
                this.processed_request['___pucc_end_date___'] = this.prepared_request['pucc_end_date'];
                this.prepared_request['pucc_center'] = "";
                this.processed_request['___pucc_center___'] = this.prepared_request['pucc_center'];
                //this.method_content = this.method_content.replace("<PUCCenter Name='PUCCenter' Value='___dbmaster_insurer_rto_city_name___'/>", "<PUCCenter Name='PUCCenter' Value=''/>");
            } else {
            }
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
UniversalSompoMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
    return obj_response_handler;

};
UniversalSompoMotor.prototype.insurer_product_field_process_post = function () {

};
UniversalSompoMotor.prototype.insurer_product_api_post = function () {

};


UniversalSompoMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
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
        console.log('UniversalSompoMotor Request ---> ' + docLog.Insurer_Request);
        var args = {
            strXdoc: docLog.Insurer_Request
        };

        soap.createClient(specific_insurer_object.method.Service_URL, function (err, client) {
            try {
                client[specific_insurer_object.method.Method_Action](args, function (err1, result, raw, soapHeader) {
                    console.log(result);
                    if (err1) {
                        console.error('UniversalSompoMotor', 'service_call', 'exception', err1);
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
                                console.error('UniversalSompoMotor', 'service_call', 'xml2jsonerror', err2);
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
                                if (specific_insurer_object.method.Method_Type === 'Idv') {
                                    objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                                }

                            }
                        });
                    }

                });
            } catch (e) {
                console.error('Exception', this.constructor.name, 'service_call', e);
            }
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }

};
UniversalSompoMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {

        var Error_Msg = 'NO_ERR';
        try {
            if (objResponseJson.hasOwnProperty('commBRIDGEFusionMOTORResult')) {
                objError = objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Errors'][0]['ErrDescription'][0];
                if (objError !== '' && objError !== "Authentication Success") {
                    Error_Msg = objError;
                }
            } else {
                Error_Msg = 'LM_MAIN_commBRIDGEFusionMOTORResult_NODE_NA';
            }
        } catch (ex) {
            Error_Msg = JSON.stringify(ex);
        }
        if (this.insurer_lm_request['vehicle_class'] === 'pcv' && this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            Error_Msg = 'For PCV TP Not Allowed';
        }
        //check error start

        if (Error_Msg === 'NO_ERR') {
            var Idv_Breakup = this.get_const_idv_breakup();
            Idv_Breakup["Idv_Normal"] = Math.round(objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Product'][0]['Risks'][0]['VehicleIDV'][0]['attr']['Value'] - 0);
            Idv_Breakup["Exshowroom"] = Math.round(objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Product'][0]['Risks'][0]['VehicleExShowroomPrice'][0]['attr']['Value'] - 0);
            Idv_Breakup["Idv_Min"] = Math.round(Idv_Breakup["Idv_Normal"] * 0.85);
            Idv_Breakup["Idv_Max"] = Math.round(Idv_Breakup["Idv_Normal"] * 1.15);


            objServiceHandler.Premium_Breakup = Idv_Breakup;
            objServiceHandler.Insurer_Transaction_Identifier = '';

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
UniversalSompoMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);

    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    //objResponseJson['ResponseXML']['UWProductServiceResult']['UWOperationResult']['GetUserData']['TotalSI']
    try {


        var Error_Msg = 'NO_ERR';
        //check error start

        //check error stop
        try {
            if (objResponseJson.hasOwnProperty('commBRIDGEFusionMOTORResult')) {
                objError = objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Errors'][0]['ErrDescription'][0];
                if (objError !== '' && objError !== "Authentication Success") {
                    Error_Msg = objError;
                }
            } else {
                Error_Msg = 'LM_MAIN_commBRIDGEFusionMOTORResult_NODE_NA';
            }
        } catch (ex) {
            Error_Msg = JSON.stringify(ex);
        }


        if (Error_Msg === 'NO_ERR') {
            var objMainPremiumJson = objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Product'][0]['Risks'][0]['Risk'][0]['RisksData'][0];
            var objPremiumJson = objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Product'][0]['PremiumCalculation'][0];

            var objCoverDetails = objMainPremiumJson['CoverDetails'][0]['Covers'][0]['CoversData'];
            if (this.lm_request['product_id'] === 12) {
                if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                    var objAddonCoverDetails = objMainPremiumJson['AddonCoverDetails'][0]['AddonCovers'][0];
                    var objTariffDiscountDetails = [];
                }
            } else {
                var objAddonCoverDetails = objMainPremiumJson['AddonCoverDetails'][0]['AddonCovers'][0]['AddonCoversData'];
                var objTariffDiscountDetails = objMainPremiumJson['De-tariffDiscounts'][0]['De-tariffDiscountGroup'][0]['De-tariffDiscountGroupData'];
            }
            var objOtherDiscountDetails = objMainPremiumJson['OtherDiscounts'][0]['OtherDiscountGroup'][0]['OtherDiscountGroupData'];

            var objPremiumService = {};

            var objCombinePremiumService = [objCoverDetails, objAddonCoverDetails, objTariffDiscountDetails, objOtherDiscountDetails];

            for (var keyC in objCombinePremiumService) {
                for (var keyCover in objCombinePremiumService[keyC]) {
                    try {
                        var indPrem = objCombinePremiumService[keyC][keyCover];
                        var premium = indPrem['Premium'][0]['attr']['Value'];
                        var key = '';
                        if (indPrem.hasOwnProperty('CoverGroups')) {
                            cover_key = 'CoverGroups';

                        }
                        if (indPrem.hasOwnProperty('Description')) {
                            cover_key = 'Description';

                        }
                        if (indPrem.hasOwnProperty('AddonCoverGroups')) {
                            cover_key = 'AddonCoverGroups';

                        }
                        cover_name = indPrem[cover_key][0]['attr']['Value'];

                        cover_name = cover_name.toString().toLowerCase().replace(/ /g, '_');
                        //Object.assign(objPremiumService, JSON.parse('{"' + cover_name + '":""}'));
                        objPremiumService[cover_name] = this.round2Precision(premium - 0);
                        //console.log(cover_name, premium);
                    } catch (e) {
                        console.error('Exception', this.constructor.name, 'premium_response_handler', e);
                    }
                }
            }
            console.log(objPremiumService);
            var premium_breakup = this.get_const_premium_breakup();

            var objInsurerPremium = {};



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

            premium_breakup['net_premium'] = Math.round(objPremiumJson['NetPremium'][0]['attr']['Value'] - 0);
            premium_breakup['service_tax'] = Math.round(objPremiumJson['ServiceTax'][0]['attr']['Value'] - 0);
            premium_breakup['final_premium'] = Math.round(objPremiumJson['TotalPremium'][0]['attr']['Value'] - 0);


            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Customer'][0]['PosPolicyNo'][0];
            console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        }
        objServiceHandler.Error_Msg = Error_Msg;

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
UniversalSompoMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
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
        this.method_content = method_content;
        this.method = IdvMethod;
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
UniversalSompoMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';

    try {
        objError = objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Errors'][0]['ErrDescription'][0];
        if (objError !== '' && objError !== "Authentication Success") {
            Error_Msg = objError;
        }

        if (Error_Msg === 'NO_ERR') {
            var objPremiumJson = objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Product'][0]['PremiumCalculation'][0];
            var net_premium = Math.round(objPremiumJson['NetPremium'][0]['attr']['Value'] - 0);
            var service_tax = Math.round(objPremiumJson['ServiceTax'][0]['attr']['Value'] - 0);
            var final_premium = Math.round(objPremiumJson['TotalPremium'][0]['attr']['Value'] - 0);
            var vehicle_expected_idv = (this.lm_request['vehicle_expected_idv'] - 0);
            var vehicle_received_idv = Math.round(objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Product'][0]['Risks'][0]['VehicleIDV'][0]['attr']['Value'] - 0);
            var od_disc_amt = 0;
            try {
                od_disc_amt = Math.round(objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Product'][0]['Risks'][0]['Risk'][0]['RisksData'][0]['De-tariffDiscounts'][0]['De-tariffDiscountGroup'][0]['De-tariffDiscountGroupData'][0]['Premium'][0]['attr']['Value'] - 0);
            } catch (e) {
            }
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], final_premium);
            if (vehicle_expected_idv == vehicle_received_idv) {
                if (objPremiumVerification.Status) {
                    var pg_data = {
                        'PosPolicyNo': objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Customer'][0]['PosPolicyNo'][0],
                        'FinalPremium': this.lm_request['final_premium'],
                        'Src': 'WA',
                        'SubSrc': this.prepared_request['insurer_integration_agent_code']
                    };
                    objServiceHandler.Payment.pg_data = pg_data;
                    objServiceHandler.Payment.pg_redirect_mode = 'GET';
                    //objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Customer'][0]['WAURN'][0];
                    objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['commBRIDGEFusionMOTORResult']['Root']['Customer'][0]['PosPolicyNo'][0];
                } else {
                    let diff_wo_gst = Math.round((objPremiumVerification.Diff_Percentage - 0) / 1.18);
                    diff_wo_gst = (diff_wo_gst < 0) ? 0 - diff_wo_gst : diff_wo_gst;
                    this.prepared_request['own_damage_disc_rate'] = this.prepared_request['own_damage_disc_rate'] - 0;
                    console.error('DBG', this.constructor.name, 'diff_wo_gst', diff_wo_gst, 'own_damage_disc_rate', this.prepared_request['own_damage_disc_rate']);
                    if (this.prepared_request['own_damage_disc_rate'] > 0 && od_disc_amt === 0) {
                        Error_Msg = 'LM_OWN_DAMAGE_DISCOUNT_NOT_PROVIDED_' + JSON.stringify(objPremiumVerification);
                    } else {
                        Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                    }
                }
            } else {
                Error_Msg = 'LM_IDV_MISMATCH_REQUEST_IDV_' + vehicle_expected_idv.toString() + '_RECEIVED_IDV_' + vehicle_received_idv.toString();
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);


    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex.stack)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
UniversalSompoMotor.prototype.verification_response_handler = function (objResponseJson) {
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
        if (objInsurerProduct.const_policy.transaction_status === 'SUCCESS') {
            var product_name = 'CAR';
            if (objInsurerProduct.lm_request['product_id'] === 10) {
                product_name = 'TW';
            }
            var pdf_file_name = objInsurerProduct.constructor.name + '_' + product_name + '_' + objInsurerProduct.const_policy.policy_number + '.pdf';
            pdf_file_name = pdf_file_name.replace(/\//g, '');
            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            this.const_policy.policy_url = pdf_web_path_portal;

            try {
                var https = require('https');
                var insurer_pdf_url = objInsurerProduct.const_policy.insurer_pdf_url;

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
        objServiceHandler.Insurer_Transaction_Identifier = objInsurerProduct.const_policy.transaction_id;
        objServiceHandler.Policy = objInsurerProduct.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;

};
UniversalSompoMotor.prototype.pg_response_handler = function () {
    try {
        //MSG:MerchantID|QuoteID|WAURNNo|PolicyNo|TxnAmount|AdditionalInfo0|TxnDate|ErrorCode|TxnDescription|DownloadLinkURL|AdditionalInfo1|AdditionalInfo2|AdditionalInfo3|AdditionalInfo4|AdditionalInfo5|
        //MSG:SOMPOGINS|50547209|LSBI6204660199|USGI/WEBAG/0148520/00/000|00009723.00|01|09-04-2018 09:50:26|1001|Payment successfully.|http://www.usgi.co.in/WAPDF/WAPDFGenerat.aspx?QuoteID=hKfeur_N0Kk10j-SOjMIDQ==|NA|NA|NA|NA|NA
        //MSG:SOMPOGINS|QUID000059|3414909965|2311/50122343/01/B00|4842.00|NA|21-01-201516:20:35|1001|Paymentsuccessfully|www.google.com|NA|NA|NA|NA|NA
        var objInsurerProduct = this;
        var Output = objInsurerProduct.const_payment_response.pg_get['MSG'];
        var str = Output.split('|');
        this.const_policy.transaction_status = '';
        this.const_policy.transaction_id = str[2];
        if (objInsurerProduct.const_payment_response.pg_get['MSG'].indexOf('1001') > -1) {
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = str[3];
            this.const_policy.transaction_amount = str[4];
            this.const_policy.insurer_pdf_url = str[9];
        } else {
            this.const_policy.pg_message = str[8];
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
UniversalSompoMotor.prototype.pdf_response_handler = function () {

};

UniversalSompoMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "Basic OD",
        "od_elect_access": "ELECTRICAL ACCESSORY OD",
        "od_non_elect_access": "NON ELECTRICAL ACCESSORY OD",
        "od_cng_lpg": "CNGLPG KIT OD",
        "od_disc_ncb": "No claim bonus",
        "od_disc_vol_deduct": "Voluntary deductable",
        "od_disc_anti_theft": "Antitheft device discount",
        "od_disc_aai": "Automobile Association discount",
        "od_loading": "", //doubt De-tariff Loading
        "od_disc": "De-tariff Discount",
        "od_final_premium": ""
    },
    "liability": {
        "tp_basic": "Basic TP",
        "tp_cover_owner_driver_pa": "PA COVER TO OWNER DRIVER",
        "tp_cover_unnamed_passenger_pa": "UNNAMED PA COVER TO PASSENGERS",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "",
        "tp_cover_paid_driver_ll": "LEGAL LIABILITY TO PAID DRIVER",
        "tp_cng_lpg": "CNGLPG KIT TP",
        "tp_cover_emp_pa": "PA COVER TO EMPLOYEES OF INSURED",
        "tp_final_premium": ""
    },
    "addon": {
        "addon_zero_dep_cover": "Nil Depreciation Waiver cover",
        "addon_road_assist_cover": "ROAD SIDE ASSISTANCE FREEDOM",
        "addon_ncb_protection_cover": null,
        "addon_engine_protector_cover": "",
        "addon_invoice_price_cover": "RETURN TO INVOICE",
        "addon_key_lock_cover": "KEY REPLACEMENT",
        "addon_consumable_cover": "COST OF CONSUMABLES",
        "addon_daily_allowance_cover": "DAILY CASH ALLOWANCE",
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
        "addon_hydrostatic_lock_cover": "HYDROSTATIC LOCK COVER",
        "addon_final_premium": 0 //AddOnCoverDetails Premium
    },
    "net_premium": "",
    "service_tax": "",
    "final_premium": ""//TotalPremium- nildippremium
};
module.exports = UniversalSompoMotor;






