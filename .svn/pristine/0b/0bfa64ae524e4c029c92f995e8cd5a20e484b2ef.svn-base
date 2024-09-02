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

function TataAIGMotor() {

}
util.inherits(TataAIGMotor, Motor);

TataAIGMotor.prototype.lm_request_single = {};
TataAIGMotor.prototype.insurer_integration = {};
TataAIGMotor.prototype.insurer_addon_list = [];
TataAIGMotor.prototype.insurer = {};
TataAIGMotor.prototype.pdf_attempt = 0;
TataAIGMotor.prototype.insurer_date_format = 'dd/MM/yyyy';


TataAIGMotor.prototype.insurer_product_api_pre = function () {

}
TataAIGMotor.prototype.insurer_product_field_process_pre = function () {

    if (!(this.lm_request['method_type'] === 'Verification')) {
        if (this.lm_request['non_electrical_accessory'] === '0') {
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--Non_ElectricalAccessiories_Start-->', '<!--Non_ElectricalAccessiories_End-->', true);
            if (txt_replace) {
                this.method_content = this.method_content.replace(txt_replace, '');
            }
        }
        if (this.lm_request['electrical_accessory'] === '0') {
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--ElectricalAccessiories_Start-->', '<!--ElectricalAccessiories_End-->', true);
            if (txt_replace) {
                this.method_content = this.method_content.replace(txt_replace, '');
            }
        }
        if (this.lm_request['is_claim_exists'] === 'yes') {
            var obj_replace = {
                "<PropPreviousPolicyDetails_ClaimAmount>0</PropPreviousPolicyDetails_ClaimAmount>": "<PropPreviousPolicyDetails_ClaimAmount>1</PropPreviousPolicyDetails_ClaimAmount>",
                "<PropPreviousPolicyDetails_NoOfClaims>0</PropPreviousPolicyDetails_NoOfClaims>": "<PropPreviousPolicyDetails_NoOfClaims>1</PropPreviousPolicyDetails_NoOfClaims>"
            };
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }

        this.prepared_request['addon_package_name'] = 'Optional';
        this.processed_request['___addon_package_name___'] = this.prepared_request['addon_package_name'];
        if (this.prepared_request['product_id'] === 10 && this.vehicle_age_year() > 4)
        {
            var addonreplace = {
                "addon_zero_dep_cover": "false",
                "addon_road_assist_cover": "false",
                "addon_ncb_protection_cover": "false",
                "addon_engine_protector_cover": "false",
                "addon_invoice_price_cover": "false",
            };
            for (var key in addonreplace) {
                var value = addonreplace[key];
                this.method_content = this.method_content.toString().replace('___' + key + '___', value);
            }
        }
    }
    if (this.lm_request['method_type'] === 'Verification' || this.lm_request['method_type'] === 'Pdf') {
        if (this.prepared_request.hasOwnProperty('dbmaster_insurer_transaction_identifier')) {
            var arr_ident = this.prepared_request['dbmaster_insurer_transaction_identifier'].toString().split('-');
            this.prepared_request['proposal_no'] = arr_ident[0];
            this.processed_request['___proposal_no___'] = arr_ident[0];
            this.prepared_request['customer_id'] = arr_ident[1];
            this.processed_request['___customer_id___'] = arr_ident[1];
        }
    }
    if (this.lm_request['method_type'] === 'Verification') {
        this.prepared_request['timestamp'] = moment().format('DD-MM-YYYY') + ' ' + moment().format('HH:mm:ss');
        this.processed_request['___timestamp___'] = this.prepared_request['timestamp']

        var objProduct = this;
        var x = 0;
        var User_Data = require(appRoot + '/models/user_data');
        User_Data.findOne({"Request_Unique_Id": objProduct.lm_request['search_reference_number']}, function (err, dbUserData) {
            if (dbUserData) {
                //process for pg_data
                var final_premium = dbUserData.Erp_Qt_Request_Core['___final_premium___'];
                var replacedata = {
                    '___final_premium___': final_premium
                };
                objProduct.method_content = objProduct.method_content.toString().replaceJson(replacedata);
                x = 1;
            }
        });
        var sleep = require('system-sleep');
        sleep(4000);

        this.method_content = objProduct.method_content.toString();
    }

    if (this.lm_request['vehicle_insurance_type'] === 'new') {
        this.method_content = this.method_content.replace('___registration_no_3___', 'AB');
        this.method_content = this.method_content.replace('___registration_no_4___', '1234');
    }
    if (this.lm_request['method_type'] === 'Premium') {
        if (this.lm_request['vehicle_expected_idv'] - 0 > 0) {
            this.method_content = this.method_content.replace('<PropRisks_LoadingNewCarRplacmnt>0</PropRisks_LoadingNewCarRplacmnt>', '<PropRisks_LoadingNewCarRplacmnt>' + this.lm_request['vehicle_expected_idv'] + '</PropRisks_LoadingNewCarRplacmnt>');
        } else {
            this.method_content = this.method_content.replace('<PropRisks_LoadingNewCarRplacmnt>0</PropRisks_LoadingNewCarRplacmnt>', '<PropRisks_LoadingNewCarRplacmnt>' + this.processed_request['___vehicle_expected_idv___'] + '</PropRisks_LoadingNewCarRplacmnt>');
        }
    }
	if (this.lm_request['method_type'] === 'Proposal') {
		for (var addon_key in this.const_addon_master) {
			if (!this.lm_request.hasOwnProperty(addon_key)) {
				this.prepared_request[addon_key] = 'false';
				this.processed_request['___' + addon_key + '___'] = 'false';
			}
		}
	}

}
TataAIGMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;

    var error_msg = 'NO_ERROR';
    var obj_response_handler;
    if (specific_insurer_object.method.Method_Type == 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type == 'Idv') {
        obj_response_handler = this.idv_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type == 'Proposal') {
        obj_response_handler = this.proposal_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type == 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    return obj_response_handler;

}
TataAIGMotor.prototype.insurer_product_field_process_post = function () {

}
TataAIGMotor.prototype.insurer_product_api_post = function () {

}
TataAIGMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;//
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        // var PostData = JSON.parse(docLog.Insurer_Request);

//Example POST method invocation 
        var Client = require('node-rest-client').Client;

        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

        var client = new Client();

// set content-type header and data as json in args parameter 
        console.log(docLog.Insurer_Request);
        var args = {
            data: docLog.Insurer_Request,
            headers: {"Content-Type": "application/xml"},
            "rejectUnauthorized": false
        };

        client.post(specific_insurer_object['method']['Service_URL'], args, function (data, response) {
            // parsed response body as js object 
            console.log(data.toString());

            data = data.toString();
            var parse = require('xml-parser');
            console.log(data);
            var objReplace = {
                'soap:': '',
                'ns2:': '',
                'ns3:': '',
                'ns4:': '',
                'ns7:': ''
            };
            var fliter_response = data.replaceJson(objReplace);
            xml2js.parseString(fliter_response, {ignoreAttrs: true}, function (err, objXml2Json) {
                console.log(objXml2Json);
                if (err) {
                    console.error('Exception', this.constructor.name, 'service_call', err);
                } else {
                    try {
                        if (specific_insurer_object.method.Method_Type === 'Verification' || specific_insurer_object.method.Method_Type === 'Pdf') {
                            var objResponseFull = {
                                'err': null,
                                'result': data,
                                'raw': data,
                                'soapHeader': null,
                                'objResponseJson': objXml2Json
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        } else {
                            var DataNodeKey = specific_insurer_object.method.Method_Action + 'Response';
                            if (objXml2Json['Envelope']['Body'][0].hasOwnProperty(DataNodeKey)) {
                                if (objXml2Json['Envelope']['Body'][0][DataNodeKey][0].hasOwnProperty('ResponseXML')) {
                                    var ResponseXml = objXml2Json['Envelope']['Body'][0][DataNodeKey][0]['ResponseXML'][0];
                                    xml2js.parseString(ResponseXml, {ignoreAttrs: true}, function (err1, objResponseXml) {
                                        if (err1) {
                                            console.error('Exception', this.constructor.name, 'service_call', err1);
                                        } else {
                                            objXml2Json['Envelope']['Body'][0][DataNodeKey][0]['ResponseXML'] = objResponseXml;
                                            console.log(objResponseXml);

                                            var objResponseFull = {
                                                'err': null,
                                                'result': data,
                                                'raw': data,
                                                'soapHeader': null,
                                                'objResponseJson': objXml2Json
                                            };

                                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                            if (specific_insurer_object.method.Method_Type === 'Idv') {
                                                objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                                            }
                                        }
                                    });
                                } else {
                                    var objResponseFull = {
                                        'err': objXml2Json['Envelope']['Body'][0][DataNodeKey][0]['ErrorText'][0],
                                        'result': data,
                                        'raw': data,
                                        'soapHeader': null,
                                        'objResponseJson': null
                                    };

                                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                }
                            }
                        }
                    } catch (e) {
                        console.error('Exception', this.constructor.name, 'service_call', e);
                    }
                }

            });
            // raw response 

        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }

};
TataAIGMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    objResponseJson = objResponseJson['Envelope']['Body'][0]['createQuoteResponse'][0];
    //objResponseJson['ResponseXML']['UWProductServiceResult']['UWOperationResult']['GetUserData']['TotalSI']
    var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    //check error start
    if (objResponseJson.hasOwnProperty('ErrorText')) {
        //check error stop
        if (objResponseJson['ErrorText'][0] === '') {
            var premium_breakup = this.const_premium_breakup;
            if (Error_Msg === 'NO_ERR') {
                var Idv_Breakup = this.const_idv_breakup;
                if (Error_Msg === 'NO_ERR') {
                    var IdvDataNode = '';
                    if (this.prepared_request['product_id'] === 10) {
                        IdvDataNode = 'PropRisks_IDVOfTheVehicle_Mandatary';
                    } else {
                        IdvDataNode = 'PropRisks_IDVofthevehicle';
                    }
                    Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson['ResponseXML']['UWProductServiceResult']['UWOperationResult'][0]['GetUserData'][0][IdvDataNode][0] - 0);
                    Idv_Breakup["Idv_Min"] = parseInt(Idv_Breakup["Idv_Normal"] * 0.90);
                    Idv_Breakup["Idv_Max"] = parseInt(Idv_Breakup["Idv_Normal"] * 1.10);
                    Idv_Breakup["Exshowroom"] = 0;

                    objServiceHandler.Premium_Breakup = Idv_Breakup;
                    objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['QuotationNumber'][0];
                }
            } else {
                Error_Msg = objResponseJson['ErrorText'];
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
        return objServiceHandler;
    }
}
TataAIGMotor.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        objResponseJson = objResponseJson['Envelope']['Body'][0]['createQuoteResponse'][0];


        var Error_Msg = 'NO_ERR';
        //check error start
        if (objResponseJson.hasOwnProperty('ErrorText')) {
            //check error stop
            if (objResponseJson['ErrorText'][0] === '') {
                var jsonPremium = JSON.stringify(objResponseJson);
                if (this.prepared_request['product_id'] === 1) {
                    if (jsonPremium.indexOf('Transaction Declined - Moratorium vehicle') > -1) {
                        Error_Msg = 'Transaction Declined - Moratorium vehicle';
                    }
                }
                if (Error_Msg === 'NO_ERR') {
                    var objInsurerPremium = {};
                    var objInsurerAddon = {};
                    var premium_breakup = this.get_const_premium_breakup();
                    var GetUserData = objResponseJson['ResponseXML']['UWProductServiceResult']['UWOperationResult'][0]['GetUserData'][0];
                    var UWOperationResult = objResponseJson['ResponseXML']['UWProductServiceResult']['UWOperationResult'][0];
                    var objPremiumService = GetUserData['PropRisks_Col'][0]['Risks'][0]['PropRisks_CoverDetails_Col'][0]['Risks_CoverDetails'];
                    var GetUserData = objResponseJson['ResponseXML']['UWProductServiceResult']['UWOperationResult'][0]['GetUserData'][0];
                    var LoadingDiscount = GetUserData['PropLoadingDiscount_Col'][0]['LoadingDiscount'];
                    var UWOperationResult = objResponseJson['ResponseXML']['UWProductServiceResult']['UWOperationResult'][0];

//                    if (GetUserData.hasOwnProperty('PropRisks_CNGLPGkitValue'))
//                    {
//                        premium_breakup['own_damage']['od_cng_lpg'] = GetUserData['PropRisks_CNGLPGkitValue'][0] - 0;
//                        premium_breakup['own_damage']['tp_cng_lpg'] = GetUserData['PropRisks_CNGLPGkitValue'][0] - 0;
//                    }
                    premium_breakup['own_damage']['od_final_premium'] = GetUserData['PropPremiumCalculation_NetODPremium'][0] - 0;
                    premium_breakup['liability']['tp_final_premium'] = GetUserData['PropPremiumCalculation_NetTPPremium'][0] - 0;


                    premium_breakup['net_premium'] = Math.round(UWOperationResult['NetPremium'][0]) - 0;
                    premium_breakup['service_tax'] = 2 * Math.round(premium_breakup['net_premium'] * 0.09);//UWOperationResult['ServiceTax'][0] - 0;
                    premium_breakup['final_premium'] = premium_breakup['net_premium'] + premium_breakup['service_tax'];//UWOperationResult['TotalPremium'][0] - 0;

//                    //process for od and tp
                    var od_full_tariff = 0;
                    var od_final_tariff = 0;
                    var od_disc_tariff = 0;
                    var idv_response = 0;
                    for (var keyCover in objPremiumService) {
                        var cover_name = objPremiumService[keyCover]['PropCoverDetails_CoverGroups'][0];
                        cover_name = cover_name.toString().toLowerCase().replace(/ /g, '_');
                        Object.assign(objInsurerPremium, JSON.parse('{"' + cover_name + '":""}'));
                        objInsurerPremium[cover_name] = objPremiumService[keyCover]['PropCoverDetails_EndorsementAmount'][0] - 0;
                        if (cover_name == 'own_damage') {
                            od_full_tariff = objPremiumService[keyCover]['PropCoverDetails_BaseTariffRate'][0] - 0;
                            od_final_tariff = objPremiumService[keyCover]['PropCoverDetails_FinalRate'][0] - 0;
                            idv_response = objPremiumService[keyCover]['PropCoverDetails_DifferentialSI'][0] - 0;
                            od_disc_tariff = od_full_tariff - od_final_tariff;
                        }
                    }
                    // process for addon
                    for (var k in GetUserData['PropRisks_Col'][0]['Risks']) {
                        var objAddonInsurer = GetUserData['PropRisks_Col'][0]['Risks'][k]['PropRisks_CoverDetails_Col'][0]['Risks_CoverDetails'];
                        for (var keyCover in objAddonInsurer) {
                            var cover_name = objAddonInsurer[keyCover]['PropCoverDetails_CoverGroups'][0];
                            cover_name = cover_name.toString().toLowerCase().replace(/ /g, '_');
                            Object.assign(objInsurerPremium, JSON.parse('{"' + cover_name + '":""}'));
                            objInsurerPremium[cover_name] = objAddonInsurer[keyCover]['PropCoverDetails_EndorsementAmount'][0] - 0;
                        }
                    }
                    //process for loading discount
                    for (var keyCover in LoadingDiscount) {
                        var cover_name = LoadingDiscount[keyCover]['PropLoadingDiscount_Description'][0];
                        cover_name = cover_name.toString().toLowerCase().replace(/ /g, '_');
                        Object.assign(objInsurerPremium, JSON.parse('{"' + cover_name + '":""}'));
                        objInsurerPremium[cover_name] = LoadingDiscount[keyCover]['PropLoadingDiscount_EndorsementAmount'][0] - 0;
                    }
                    console.error("TataBreakup", objInsurerPremium);
                    //var od_nec_amt = GetUserData['PropRisks_NCPrm'][0] - 0;
                    //var od_nec_amt = objInsurerPremium['own_damage'];
                    premium_breakup['own_damage']['od_basic'] = idv_response * (od_full_tariff / 100);
                    premium_breakup['own_damage']['od_disc'] = idv_response * (od_disc_tariff / 100);

                    if ((GetUserData['PropRisks_NonElectricalAccessories'][0] - 0) > 0) {
                        //premium_breakup['own_damage']['od_non_elect_access'] = od_nec_amt - premium_breakup['own_damage']['od_basic'];
                    }

                    var total_Addon_Premium = 0.0;
                    var od_disc_covers_premium = 0.0;
                    if (objInsurerPremium.hasOwnProperty('road_side_assistance') && this.processed_request['___addon_road_assist_cover___'] === 'true') {
                        premium_breakup['addon']['addon_road_assist_cover'] = 116;
                        //total_Addon_Premium = total_Addon_Premium + premium_breakup['addon']['addon_road_assist_cover'];
                    }
                    if (objInsurerPremium.hasOwnProperty('no_claim_bonus_ncb_protection')) {
                        premium_breakup['addon']['addon_ncb_protection_cover'] = objInsurerPremium['no_claim_bonus_ncb_protection'];
                        total_Addon_Premium = total_Addon_Premium + premium_breakup['addon']['addon_ncb_protection_cover'];
                    }
                    if (objInsurerPremium.hasOwnProperty('return_to_invoice')) {
                        premium_breakup['addon']['addon_invoice_price_cover'] = objInsurerPremium['return_to_invoice'];
                        total_Addon_Premium = total_Addon_Premium + premium_breakup['addon']['addon_invoice_price_cover'];
                    }
                    if (objInsurerPremium.hasOwnProperty('depreciation_reimbursement')) {
                        premium_breakup['addon']['addon_zero_dep_cover'] = objInsurerPremium['depreciation_reimbursement'];
                        total_Addon_Premium = total_Addon_Premium + premium_breakup['addon']['addon_zero_dep_cover'];
                    }
                    if (objInsurerPremium.hasOwnProperty('key_replacement')) {
                        premium_breakup['addon']['addon_key_lock_cover'] = objInsurerPremium['key_replacement'];
                        total_Addon_Premium = total_Addon_Premium + premium_breakup['addon']['addon_key_lock_cover'];
                    }
                    if (objInsurerPremium.hasOwnProperty('engine_secure')) {
                        premium_breakup['addon']['addon_engine_protector_cover'] = objInsurerPremium['engine_secure'];
                        total_Addon_Premium = total_Addon_Premium + premium_breakup['addon']['addon_engine_protector_cover'];
                    }
                    if (objInsurerPremium.hasOwnProperty('consumable_expense')) {
                        premium_breakup['addon']['addon_consumable_cover'] = objInsurerPremium['consumable_expense'];
                        total_Addon_Premium = total_Addon_Premium + premium_breakup['addon']['addon_consumable_cover'];
                    }
                    if (objInsurerPremium.hasOwnProperty('tyre_secure')) {
                        premium_breakup['addon']['addon_tyre_coverage_cover'] = objInsurerPremium['tyre_secure'];
                        total_Addon_Premium = total_Addon_Premium + premium_breakup['addon']['addon_tyre_coverage_cover'];
                    }
                    if (objInsurerPremium.hasOwnProperty('loss_of_personal_belonging')) {
                        premium_breakup['addon']['addon_personal_belonging_loss_cover'] = objInsurerPremium['loss_of_personal_belonging'];
                        total_Addon_Premium = total_Addon_Premium + premium_breakup['addon']['addon_personal_belonging_loss_cover'];
                    }

                    premium_breakup['own_damage']['od_elect_access'] = (objInsurerPremium.hasOwnProperty('electrical_od')) ? objInsurerPremium['electrical_od'] : 0;
                    premium_breakup['own_damage']['od_disc_ncb'] = (objInsurerPremium.hasOwnProperty('no_claim_bonus')) ? objInsurerPremium['no_claim_bonus'] : 0;
                    premium_breakup['liability']['tp_basic'] = objInsurerPremium['basic_tp__including_tppd_premium'];
                    premium_breakup['liability']['tp_cover_owner_driver_pa'] = objInsurerPremium['owner_driver'];
                    premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = (objInsurerPremium.hasOwnProperty('unnamed_passengers_personal_account')) ? objInsurerPremium['unnamed_passengers_personal_account'] : 0;
                    premium_breakup['liability']['tp_cover_paid_driver_ll'] = (objInsurerPremium.hasOwnProperty('paid_driver_cleaner_conductor')) ? objInsurerPremium['paid_driver_cleaner_conductor'] : 0;
                    premium_breakup['liability']['tp_cover_paid_driver_pa'] = (objInsurerPremium.hasOwnProperty('personal_accident_imt_17')) ? objInsurerPremium['personal_accident_imt_17'] : 0;

                    premium_breakup['own_damage']['od_disc_vol_deduct'] = (objInsurerPremium.hasOwnProperty('voluntary_excess')) ? objInsurerPremium['voluntary_excess'] : 0;
                    premium_breakup['own_damage']['od_disc_anti_theft'] = (objInsurerPremium.hasOwnProperty('discount_for_anti-theft_devices')) ? objInsurerPremium['discount_for_anti-theft_devices'] : 0;
                    premium_breakup['own_damage']['od_disc_aai'] = (objInsurerPremium.hasOwnProperty('automobile_association_discount')) ? objInsurerPremium['automobile_association_discount'] : 0;

                    if (GetUserData.hasOwnProperty('PropRisks_CNGLPGkitValue'))
                    {
                        premium_breakup['own_damage']['od_cng_lpg'] = (objInsurerPremium.hasOwnProperty('cng_kit_od')) ? objInsurerPremium['cng_kit_od'] : 0;
                        premium_breakup['liability']['tp_cng_lpg'] = (objInsurerPremium.hasOwnProperty('cng_kit_tp')) ? objInsurerPremium['cng_kit_tp'] : 0;
                    }

//                    if (total_Addon_Premium > 0) {
//                        premium_breakup['own_damage']['od_final_premium'] = premium_breakup['own_damage']['od_final_premium'] - total_Addon_Premium;
//                    } else {
                    od_disc_covers_premium += premium_breakup['own_damage']['od_cng_lpg'] + premium_breakup['own_damage']['od_elect_access'] - premium_breakup['own_damage']['od_disc_ncb'] - premium_breakup['own_damage']['od_disc_aai'] - premium_breakup['own_damage']['od_disc_vol_deduct'] - premium_breakup['own_damage']['od_disc_anti_theft'] - premium_breakup['own_damage']['od_disc'] - 0;
                    premium_breakup['own_damage']['od_final_premium'] = premium_breakup['own_damage']['od_basic'] + od_disc_covers_premium - 0;
//                    }
                    objServiceHandler.Premium_Breakup = premium_breakup;
                    objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['QuotationNumber'][0];
                }

            } else {
                Error_Msg = objResponseJson['ErrorText'][0];
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        console.error('Exception', this.constructor.name, 'idv_response_handler', e);
        objServiceHandler.Error_Msg = JSON.stringify(e);
        return objServiceHandler;
    }
}
TataAIGMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {

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
    method_content = method_content.replace('___lv_quote_no___', this.lv_quote_no());
    this.method_content = method_content.replace('___vehicle_expected_idv___', 0);
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
};

TataAIGMotor.prototype.proposal_response_handler = function (objResponseJson) {
    try {
        console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
        objResponseJson = objResponseJson['Envelope']['Body'][0]['saveProposalResponse'][0];

        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Payment': this.const_payment
        };
        var Error_Msg = 'NO_ERR';
        //check error start
        if (objResponseJson.hasOwnProperty('ErrorText')) {
            //check error stop
            if (objResponseJson['ErrorText'][0] === '') {
                var ProposalNo = objResponseJson['ResponseXML']['UWProductServiceResult']['UWOperationResult'][0]['ProposalNo'][0];
            } else {
                Error_Msg = objResponseJson['ErrorText'][0];
            }
        }
       if (Error_Msg === 'NO_ERR') {
            var proposalPremium=objResponseJson['ResponseXML']['UWProductServiceResult']['UWOperationResult'][0]['TotalPremium'][0];
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], proposalPremium);
            if (objPremiumVerification.Status) {
                var transaction_id = objResponseJson['ResponseXML']['UWProductServiceResult']['UWOperationResult'][0]['ConfWFHelper'][0]['WFSystemID'][0].substring(1);
                var customer_id = objResponseJson['ResponseXML']['UWProductServiceResult']['UWOperationResult'][0]['GetUserData'][0]['PropCustomerDtls_CustomerID_Mandatary'][0];
                var pg_url = this.const_payment.pg_url;
                var hashkey = '67H571iF5ol7q1n8';
                var pg_data = {
                    'vendorcode': 'TPOLIBOS',
                    'referencenum': transaction_id,
                    'amount': ((config.environment.name === 'Production') ? this.lm_request['final_premium'] : '1.00'),
                    'productcode': this.processed_request['___product_id___'],
                    'action': 'action',
                    'producercode': this.prepared_request['insurer_integration_location_code']
                };

                function jsonToQueryString(json) {
                    return '?' +
                            Object.keys(json).map(function (key) {
                        return encodeURIComponent(key) + '=' +
                                encodeURIComponent(json[key]);
                    }).join('&');
                }
                var qs = jsonToQueryString(pg_data);
                var checksummsg = pg_url + qs + hashkey;
                var checksumvalue = this.convert_to_md5(checksummsg);
                pg_data['hash'] = checksumvalue;

                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = ProposalNo + "-" + customer_id;
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        console.error('Exception', this.constructor.name, 'premium_response_handler', e);
    }

}
TataAIGMotor.prototype.pg_response_handler = function () {
    ///msg=TRANS000000001||A12||MAM22661885141||AM2||4000.00||Canceled By User||0399
    //msg=TRANS000000001||A12||MAM22661885141||AM2||4000.00|| Success||0300
    //referenceid||partnercode||mcitnumber|| referencenum ||amount||msg||msgcode
    //SUCCESS if msgcode '0300'
    var msg = this.const_payment_response.pg_get['msg'];
    var str = msg.split('||');
    this.const_policy.transaction_status = '';
    this.const_policy.transaction_id = str[0];
    if (msg.indexOf('||0300') > -1 || msg.indexOf('Success') > -1) {
        this.const_policy.pg_status = 'SUCCESS';
        this.const_policy.transaction_amount = parseInt(str[4], 10);
        this.const_policy.pg_reference_number_1 = str[0];
        this.const_policy.pg_reference_number_2 = str[1];
        this.const_policy.pg_reference_number_3 = str[2];
    } else {
        this.const_policy.pg_status = 'FAIL';
        this.const_policy.transaction_status = 'FAIL';
        this.const_policy.transaction_amount = parseInt(str[4], 10);
        this.const_policy.pg_reference_number_1 = str[0];
        this.const_policy.pg_reference_number_2 = str[1];
        this.const_policy.pg_reference_number_3 = str[2];
    }
}
TataAIGMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
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
            if (!objResponseJson.hasOwnProperty('Envelope')) {
                Error_Msg = 'LM_EMPTY_RESPONSE';
            } else {
                objResponseJson = objResponseJson['Envelope']['Body'][0];
                if (objResponseJson.hasOwnProperty('PaymentEntryCumPolicyGenResponse')) {
                    var objPremiumService = objResponseJson['PaymentEntryCumPolicyGenResponse'][0]['return'][0];
                    if (objPremiumService['ErrorCode'][0] !== '0') {
                        Error_Msg = objPremiumService['ErrorMsg'][0];
                    }
                } else {
                    Error_Msg = JSON.stringify(objResponseJson);
                }
            }

            if (Error_Msg === 'NO_ERR') {
                if (objPremiumService.hasOwnProperty('PolicyNo') && objPremiumService['PolicyNo'][0] !== '') {
                    this.const_policy.policy_number = objPremiumService['PolicyNo'][0];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'CAR';
                    if (this.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path = config.environment.portalurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path;

                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    var args = {
                        data: {
                            "search_reference_number": this.lm_request['search_reference_number'],
                            "api_reference_number": this.lm_request['api_reference_number'],
                            "policy_number": this.const_policy.policy_number,
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key'],
                            'insurer_id': this.lm_request['insurer_id'],
                            'method_type': 'Pdf',
                            'execution_async': 'no'
                        },
                        headers: {
                            "Content-Type": "application/json",
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key']
                        }
                    };
                    this.const_policy.verification_request = args.data;
                    //this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
                    /*
                     client.post(config.environment.weburl + '/quote/pdf_initiate', args, function (data, response) {
                     
                     });*/
                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        console.error('Exception', this.constructor.name, 'verification_response_handler', e);
    }
}
TataAIGMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
}
TataAIGMotor.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        var Error_Msg = 'NO_ERR';

        var objPremiumService = objResponseJson;
        if (!objPremiumService.hasOwnProperty('Envelope')) {
            Error_Msg = 'LM_EMPTY_RESPONSE';
        } else {
            objPremiumService = objPremiumService['Envelope']['Body'][0];
            if (objPremiumService.hasOwnProperty('getPolicyDocumentForPortalResponse')) {
                objPremiumService = objPremiumService['getPolicyDocumentForPortalResponse'][0];
                if (objPremiumService['objServiceResult'][0]['UserData'][0]['ErrorText'][0] !== '') {
                    Error_Msg = objPremiumService['objServiceResult'][0]['UserData'][0]['ErrorText'][0];
                }
            } else {
                Error_Msg = JSON.stringify(objPremiumService);
            }
        }

        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            if (objPremiumService.hasOwnProperty('GetPolicyDocumentForPortalResult') && objPremiumService['GetPolicyDocumentForPortalResult'] !== '') {
                var product_name = 'CAR';
                if (this.lm_request['product_id'] === 10) {
                    product_name = 'TW';
                }
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'] + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
                var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
                var pdf_web_path_portal = config.environment.portalurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(objPremiumService['GetPolicyDocumentForPortalResult'][0], 'base64');
                fs.writeFileSync(pdf_sys_loc_horizon, binary);
                fs.writeFileSync(pdf_sys_loc_portal, binary);
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

    }

}
TataAIGMotor.prototype.lv_quote_no = function () {
    return this.create_guid('', 'numeric', 7);
}
TataAIGMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "PropCoverDetails_Premium", //when PropCoverDetails_CoverGroups = Own Damage
        "od_elect_access": "Electrical OD",
        "od_non_elect_access": "",
        "od_cng_lpg": "",
        "od_disc_ncb": "No Claim Bonus",
        "od_disc_vol_deduct": "",
        "od_disc_anti_theft": "Discount for Anti-Theft Devices",
        "od_disc_aai": "",
        "od_loading": "",
        "od_disc": "",
        "od_final_premium": "PropPremiumCalculation_NetODPremium "//NetODPremium
    },
    "liability": {
        "tp_basic": "PropCoverDetails_Premium", ////when PropCoverDetails_CoverGroups = Basic TP  including TPPD premium
        "tp_cover_owner_driver_pa": "PropCoverDetails_Premium", //when PropCoverDetails_CoverGroups = Owner Driver
        "tp_cover_unnamed_passenger_pa": "Unnamed Passengers Personal Account",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "",
        "tp_cover_paid_driver_ll": "Paid Driver cleaner conductor", //this is included in tp_basic
        "tp_cng_lpg": "",
        "tp_final_premium": "PropPremiumCalculation_NetTPPremium"
    },
    "addon": {
        "addon_zero_dep_cover": null,
        "addon_road_assist_cover": "RoadSide Assist", ///when PropCoverDetails_CoverGroups = RoadSide Assist
        "addon_ncb_protection_cover": "No Claim Bonus NCB Protection",
        "addon_engine_protector_cover": "",
        "addon_invoice_price_cover": null,
        "addon_key_lock_cover": null,
        "addon_consumable_cover": null,
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
    "net_premium": "PropPremiumCalculation_NetPremium",
    "service_tax": "PropPremiumCalculation_ServiceTax",
    "final_premium": "PropPremiumCalculation_TotalPremium"
};
module.exports = TataAIGMotor;






