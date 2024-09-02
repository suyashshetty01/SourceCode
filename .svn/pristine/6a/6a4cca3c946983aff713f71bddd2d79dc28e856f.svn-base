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

function UnitedIndiaMotor() {

}
util.inherits(UnitedIndiaMotor, Motor);

UnitedIndiaMotor.prototype.lm_request_single = {};
UnitedIndiaMotor.prototype.insurer_integration = {};
UnitedIndiaMotor.prototype.insurer_addon_list = [];
UnitedIndiaMotor.prototype.insurer = {};
UnitedIndiaMotor.prototype.pdf_attempt = 0;
UnitedIndiaMotor.prototype.insurer_date_format = 'dd/MM/yyyy';


UnitedIndiaMotor.prototype.insurer_product_api_pre = function () {

};
UnitedIndiaMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        this.processed_request['___is_lpg___'] = 0;
        this.processed_request['___is_cng___'] = 0;
        this.prepared_request['timestamp'] = moment().format('DD-MM-YYYY') + ' ' + moment().format('HH:mm:ss');
        this.processed_request['___timestamp___'] = this.prepared_request['timestamp'];

        this.prepared_request['current_date'] = moment().format('DD/MM/YYYY');
        this.processed_request['___current_date___'] = this.prepared_request['current_date'];

        var vehicle_age = this.vehicle_age_month();
        if (vehicle_age >= 36) {
            this.processed_request['___addon_invoice_price_cover___'] = 'N';
        }
        if (vehicle_age >= 60) {
            this.processed_request['___addon_zero_dep_cover___'] = '0';
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            this.processed_request['___registration_no_1___'] = 'NEW';
            this.processed_request['___registration_no_2___'] = '';
            this.processed_request['___registration_no_3___'] = '';
            this.processed_request['___registration_no_4___'] = '';
            this.processed_request['___policy_expiry_date___'] = '';
        }
        if (this.lm_request['method_type'] === 'Premium') {
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.method_content = this.method_content.replace('<NUM_POLICY_NUMBER></NUM_POLICY_NUMBER>', '<NUM_POLICY_NUMBER></NUM_POLICY_NUMBER>');
            } else {
                this.method_content = this.method_content.replace('<NUM_POLICY_NUMBER></NUM_POLICY_NUMBER>', '<NUM_POLICY_NUMBER>' + this.randomString(10) + '</NUM_POLICY_NUMBER>');
            }
            //if (this.processed_request['___is_aai_member___'] == 'Y') {
            //this.method_content = this.method_content.replace('<TXT_AA_MEMBERSHIP_NAME></TXT_AA_MEMBERSHIP_NAME>', '<TXT_AA_MEMBERSHIP_NAME>dsfsd</TXT_AA_MEMBERSHIP_NAME>');
            //this.method_content = this.method_content.replace('<TXT_AA_MEMBERSHIP_NUMBER></TXT_AA_MEMBERSHIP_NUMBER>', '<TXT_AA_MEMBERSHIP_NUMBER>45252545</TXT_AA_MEMBERSHIP_NUMBER>');
            //}
        }
        if (this.lm_request['product_id'] == '1') {
            this.processed_request['___tppd_amount___'] = '750000';
        } else {
            this.processed_request['___tppd_amount___'] = '100000';
        }
        if (this.processed_request['___external_bifuel_value___'] - 0 > 0) {
            if (this.lm_request['external_bifuel_type'] === 'lpg') {
                this.method_content = this.method_content.replace('___bifuel_lpg___', this.processed_request['___external_bifuel_value___']);
                this.method_content = this.method_content.replace('___bifuel_cng___', '');
            } else if (this.lm_request['external_bifuel_type'] === 'cng') {
                this.method_content = this.method_content.replace('___bifuel_cng___', this.processed_request['___external_bifuel_value___']);
                this.method_content = this.method_content.replace('___bifuel_lpg___', '');
            }
        } else {
            this.method_content = this.method_content.replace('___bifuel_cng___', '');
            this.method_content = this.method_content.replace('___bifuel_lpg___', '');
        }
        if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'CNG') {
            this.processed_request['___is_cng___'] = -1;
        }
        if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'LPG') {
            this.processed_request['___is_lpg___'] = -1;
        }
        if (this.lm_request['method_type'] === 'Verification') {
            if (this.prepared_request.hasOwnProperty('dbmaster_insurer_transaction_identifier')) {
                var arr_ident = this.prepared_request['dbmaster_insurer_transaction_identifier'].toString().split('-');
                this.prepared_request['transaction_id'] = arr_ident[0];
                this.processed_request['___transaction_id___'] = arr_ident[0];
                this.prepared_request['reference_no'] = arr_ident[1];
                this.processed_request['___reference_no___'] = arr_ident[1];
            }

            this.prepared_request['current_date'] = moment().format('DD/MM/YYYY');
            this.processed_request['___current_date___'] = this.prepared_request['current_date'];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
UnitedIndiaMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
UnitedIndiaMotor.prototype.insurer_product_field_process_post = function () {

};
UnitedIndiaMotor.prototype.insurer_product_api_post = function () {

};
UnitedIndiaMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
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
            headers: {"Content-Type": "text/xml;charset=UTF-8"},
            "rejectUnauthorized": false
        };

        client.post(specific_insurer_object['method']['Service_URL'], args, function (data, response) {
            // parsed response body as js object 
            console.log(data);
            // raw response 
            console.log(response);

            var DataNodeKey = 'ns2:' + specific_insurer_object.method.Method_Action;
            var ServiceError = 'NA';

            if (data.hasOwnProperty('S:Envelope')) {
                if (data['S:Envelope'].hasOwnProperty('S:Body')) {
                    if (data['S:Envelope']['S:Body'].hasOwnProperty(DataNodeKey)) {
                        if (data['S:Envelope']['S:Body'][DataNodeKey].hasOwnProperty('return')) {

                        } else {
                            ServiceError = 'LM_NODE_MISSING_return';
                        }
                    } else {
                        ServiceError = 'LM_NODE_MISSING_' + DataNodeKey;
                    }
                } else {
                    ServiceError = 'LM_NODE_MISSING_S:Body';
                }
            } else {
                ServiceError = 'LM_NODE_MISSING_S:Envelope';
            }

            if (ServiceError == 'NA') {
                var ResponseXml = data['S:Envelope']['S:Body'][DataNodeKey]['return'];
                xml2js.parseString(ResponseXml, {ignoreAttrs: true}, function (err1, objResponseXml) {
                    if (err1) {
                        console.error('Exception', this.constructor.name, 'service_call', err1);
                    } else {
                        //data['S:Envelope']['S:Body']['ns2:calculatePremiumResponse']['return'] = objResponseXml;
                        console.log(objResponseXml);

                        var objResponseFull = {
                            'err': null,
                            'result': data,
                            'raw': objResponseXml,
                            'soapHeader': null,
                            'objResponseJson': objResponseXml
                        };

                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        if (specific_insurer_object.method.Method_Type === 'Idv') {
                            objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                        }
                    }
                });
            } else {
                var objResponseFull = {
                    'err': ServiceError,
                    'result': data,
                    'raw': data,
                    'soapHeader': null,
                    'objResponseJson': null
                };

                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            }
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }

};
UnitedIndiaMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
};
UnitedIndiaMotor.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    //check error start
    try {
        if (objResponseJson.hasOwnProperty('ROOT')) {
            //check error stop
            objResponseJson = objResponseJson['ROOT']['HEADER'][0];
            if ((objResponseJson['TXT_ERR_MSG'][0]) == '') {

            } else {
                Error_Msg = objResponseJson['TXT_ERR_MSG'][0];
            }
        } else {
            Error_Msg = 'LM_EMPTY_RESPONSE';
        }

        if (Error_Msg === 'NO_ERR') {
            var objLMPremium = {};
            var objInsurerPremium = {};
            var premium_breakup = this.get_const_premium_breakup();

            objInsurerPremium['od_disc'] = 0;

            var TXT_PRODUCT_USERDATA = objResponseJson['TXT_PRODUCT_USERDATA'][0]['WorkSheet'][0];
//Built in CNG - OD loading - OD  Built in CNG-TP Loading-TP Automobile Association Discount
            if (TXT_PRODUCT_USERDATA.hasOwnProperty('PropLoadingDiscount_Col')) {
                var PropLoadingDiscount_Col = TXT_PRODUCT_USERDATA['PropLoadingDiscount_Col'][0]['LoadingDiscount'];
                if (PropLoadingDiscount_Col != '') {
                    for (var keyCover in PropLoadingDiscount_Col) {
                        var cover_name = PropLoadingDiscount_Col[keyCover]['PropLoadingDiscount_Description'][0];
                        cover_name = cover_name.toString().toLowerCase().replace(/ - /g, '_').replace(/-/g, '_').replace(/ /g, '_');

                        Object.assign(objInsurerPremium, JSON.parse('{"' + cover_name + '":""}'));
                        objInsurerPremium[cover_name] = PropLoadingDiscount_Col[keyCover]['PropLoadingDiscount_EndorsementAmount'][0] - 0;

                    }
                }
            }

            if (TXT_PRODUCT_USERDATA.hasOwnProperty('PropRisks_Col')) {
                var PropRisks_Col = TXT_PRODUCT_USERDATA['PropRisks_Col'][0];
                if (PropRisks_Col != '') {
                    for (var keyCover in PropRisks_Col) {
                        for (var keyCover1 in PropRisks_Col[keyCover]) {
                            var cover_name = PropRisks_Col[keyCover][keyCover1]['PropRisks_CoverDetails_Col'][0]['Risks_CoverDetails'];
                            for (var keycover2 in cover_name) {
                                var cover_name_final = cover_name[keycover2]['PropCoverDetails_CoverGroups'][0];
                                cover_name_final = cover_name_final.toString().toLowerCase().replace(/ - /g, '_').replace(/-/g, '_').replace(/ /g, '_');
                                if (cover_name_final == 'cng_kit_od' || cover_name_final == 'lpg_kit_od' || cover_name_final == 'built_in_cng_od_loading_od' || cover_name_final == 'built_in_lpg_od_loading_od') {
                                    cover_name_final = 'cng_lpg_od';
                                }
                                if (cover_name_final == 'cng_kit_tp' || cover_name_final == 'lpg_kit_tp' || cover_name_final == 'built_in_cng_tp_loading_tp' || cover_name_final == 'built_in_lpg_tp_loading_tp') {
                                    cover_name_final = 'cng_lpg_tp';
                                }
                                Object.assign(objInsurerPremium, JSON.parse('{"' + cover_name_final + '":""}'));
                                objInsurerPremium[cover_name_final] = cover_name[keycover2]['PropCoverDetails_EndorsementAmount'][0] - 0;
                                if (cover_name_final === 'basic_od' || cover_name_final === 'non_electrical_accessories') {
                                    var od_disc = cover_name[keycover2]['PropCoverDetails_LoadingDiscount_Col'][0]['CoverDetails_LoadingDiscount'][0];
                                    objInsurerPremium['od_disc'] = objInsurerPremium['od_disc'] + (od_disc['PropLoadingDiscount_EndorsementAmount'][0] - 0);
                                }
                            }
                        }
                    }
                }
            }
            //Medical Expenses Personal Effect

            premium_breakup['own_damage']['od_basic'] = (objInsurerPremium.hasOwnProperty('basic_od')) ? objInsurerPremium['basic_od'] : 0;
            premium_breakup['own_damage']['od_elect_access'] = (objInsurerPremium.hasOwnProperty('electrical_or_electronic_accessories')) ? objInsurerPremium['electrical_or_electronic_accessories'] : 0;
            premium_breakup['own_damage']['od_non_elect_access'] = (objInsurerPremium.hasOwnProperty('non_electrical_accessories')) ? objInsurerPremium['non_electrical_accessories'] : 0;
            premium_breakup['own_damage']['od_disc_vol_deduct'] = (objInsurerPremium.hasOwnProperty('voluntary_excess_discount')) ? objInsurerPremium['voluntary_excess_discount'] : 0;
            premium_breakup['own_damage']['od_disc_anti_theft'] = (objInsurerPremium.hasOwnProperty('anti_theft_device_od')) ? objInsurerPremium['anti_theft_device_od'] : 0;
            premium_breakup['own_damage']['od_disc_ncb'] = (objInsurerPremium.hasOwnProperty('bonus_discount')) ? objInsurerPremium['bonus_discount'] : 0;
            premium_breakup['own_damage']['od_disc'] = (objInsurerPremium.hasOwnProperty('od_disc')) ? objInsurerPremium['od_disc'] : 0;
            premium_breakup['own_damage']['od_cng_lpg'] = (objInsurerPremium.hasOwnProperty('cng_lpg_od')) ? objInsurerPremium['cng_lpg_od'] : 0;
            premium_breakup['own_damage']['od_disc_aai'] = (objInsurerPremium.hasOwnProperty('automobile_association_discount')) ? objInsurerPremium['automobile_association_discount'] : 0;


            premium_breakup['liability']['tp_basic'] = (objInsurerPremium.hasOwnProperty('basic_tp')) ? objInsurerPremium['basic_tp'] : 0;
            premium_breakup['liability']['tp_cover_owner_driver_pa'] = (objInsurerPremium.hasOwnProperty('pa_owner_driver')) ? objInsurerPremium['pa_owner_driver'] : 0;
            premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = (objInsurerPremium.hasOwnProperty('personal_accident_cover_unnamed')) ? objInsurerPremium['personal_accident_cover_unnamed'] : 0;
            premium_breakup['liability']['tp_cover_paid_driver_ll'] = (objInsurerPremium.hasOwnProperty('ll_to_paid_driver_imt_28')) ? objInsurerPremium['ll_to_paid_driver_imt_28'] : 0;
            premium_breakup['liability']['tp_cover_paid_driver_pa'] = (objInsurerPremium.hasOwnProperty('pa_paid_drivers,_cleaners_and_conductors')) ? objInsurerPremium['pa_paid_drivers,_cleaners_and_conductors'] : 0;
            premium_breakup['liability']['tp_cng_lpg'] = (objInsurerPremium.hasOwnProperty('cng_lpg_tp')) ? objInsurerPremium['cng_lpg_tp'] : 0;

            premium_breakup['addon']['addon_zero_dep_cover'] = (objInsurerPremium.hasOwnProperty('nil_depreciation_without_excess')) ? objInsurerPremium['nil_depreciation_without_excess'] : 0;
            console.error('DBG', 'UNITED', this.prepared_request['is_claim_exists'], this.prepared_request['vehicle_ncb_next'], premium_breakup['addon']['addon_zero_dep_cover']);
            if (premium_breakup['addon']['addon_zero_dep_cover'] > 0 && this.prepared_request['is_claim_exists'] === 'no' && (this.prepared_request['vehicle_ncb_next'] - 0) > 0) {
                let vehicle_ncb_next = this.prepared_request['vehicle_ncb_next'] - 0;
                premium_breakup['addon']['addon_zero_dep_cover'] = premium_breakup['addon']['addon_zero_dep_cover'] * ((100 - vehicle_ncb_next) / 100);
                premium_breakup['own_damage']['od_disc_ncb'] = (premium_breakup['own_damage']['od_basic'] - premium_breakup['own_damage']['od_disc']) * (vehicle_ncb_next / 100);
            }
            premium_breakup['addon']['addon_invoice_price_cover'] = (objInsurerPremium.hasOwnProperty('return_to_invoice')) ? objInsurerPremium['return_to_invoice'] : 0;
            premium_breakup['addon']['addon_medical_expense_cover'] = (objInsurerPremium.hasOwnProperty('medical_expenses')) ? objInsurerPremium['medical_expenses'] : 0;
            premium_breakup['addon']['addon_personal_belonging_loss_cover'] = (objInsurerPremium.hasOwnProperty('personal_effect')) ? objInsurerPremium['personal_effect'] : 0;

            for (var key in premium_breakup) {
                if (typeof premium_breakup[key] === 'object') {
                    let final_amt = 0;
                    for (var sub_key in premium_breakup[key]) {
                        if (sub_key.indexOf('disc') > -1) {
                            final_amt -= (premium_breakup[key][sub_key] - 0);
                        } else {
                            final_amt += (premium_breakup[key][sub_key] - 0);
                        }
                    }
                    if (key === 'own_damage') {
                        premium_breakup['own_damage']['od_final_premium'] = final_amt;
                    }
                    if (key === 'liability') {
                        premium_breakup['liability']['tp_final_premium'] = final_amt;
                    }
                    if (key === 'addon') {
                        premium_breakup['addon']['addon_final_premium'] = final_amt;
                    }
                }
            }
            premium_breakup['net_premium'] = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'] + premium_breakup['addon']['addon_final_premium'];
            premium_breakup['service_tax'] = premium_breakup['net_premium'] * 0.18;
            premium_breakup['final_premium'] = premium_breakup['net_premium'] + premium_breakup['service_tax'];
            //premium_breakup['own_damage']['od_final_premium'] = objResponseJson['CUR_NET_OD_PREMIUM'][0] - premium_breakup['addon']['addon_zero_dep_cover'] - premium_breakup['addon']['addon_invoice_price_cover'] - premium_breakup['addon']['addon_medical_expense_cover'] - premium_breakup['addon']['addon_personal_belonging_loss_cover'] - 0;
            //premium_breakup['liability']['tp_final_premium'] = objResponseJson['CUR_NET_TP_PREMIUM'][0] - 0;



            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['TXT_TRANSACTION_ID'][0];

        }
        objServiceHandler.Error_Msg = Error_Msg;
    } catch (e) {
        var Err = {
            'Type': 'LM',
            'Msg': e.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    return objServiceHandler;
};
UnitedIndiaMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var objCurrent = this;
        var Insurer_Id = specific_insurer_object['insurer_id'];
        var Master_Db_List = objProduct.insurer_master_object['insurer_id_' + Insurer_Id]['master_db_list'];
        var Make_Name = Master_Db_List['vehicles']['insurer_db_master']['Insurer_Vehicle_Make_Name'];
        var Model_Name = Master_Db_List['vehicles']['insurer_db_master']['Insurer_Vehicle_Model_Name'];
        var Variant_Name = Master_Db_List['vehicles']['insurer_db_master']['Insurer_Vehicle_Variant_Name'];
        var Rto_Zone = objProduct['lm_request']['registration_no_1'];
        var vehicle_age = this.vehicle_age_year();
        var vehicle_age_month = this.vehicle_age_month();
        var age_slab = {
            'LESS_6': '6_Month_IDV',
            'BET_6_12': '6M-1_Year_IDV',
            '1': '1-2_Year_IDV',
            '2': '2-3_Year_IDV',
            '3': '3-4_Year_IDV',
            '4': '4-5_Year_IDV',
            '5': '5-6_Year_IDV',
            '6': '6-7_Year_IDV',
            '7': '7-8_Year_IDV',
            '8': '8-9_Year_IDV',
            '9': '9-10_Year_IDV'
        };

        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            if (err) {
            } else {
                var gicMaster = db.collection('gic_vehicles_masters');
                gicMaster.findOne({MAKE: Make_Name, MODEL_NAME: Model_Name, 'VARIANT': Variant_Name, STATE_CODE: Rto_Zone}, function (err, result) {
                    if (err) {
                    } else {
                        var Db_Idv_Calculated = {
                            "Idv_Normal": 0,
                            "Idv_Min": 0,
                            "Idv_Max": 0,
                            "Exshowroom": 0
                        };
                        if (result) {
                            var slab = '';
                            if (objProduct['lm_request']['vehicle_insurance_type'] === 'new') {
                                slab = '6_Month_IDV';
                            }
                            if (objProduct['lm_request']['vehicle_insurance_type'] === 'renew') {
                                if (vehicle_age_month < 6) {
                                    slab = '6_Month_IDV';
                                } else if (vehicle_age_month > 6 && vehicle_age_month < 12) {
                                    slab = '6M-1_Year_IDV';
                                } else {
                                    slab = age_slab[vehicle_age];
                                }
                            }
                            console.error('UNITEDDBG', slab, {MAKE: Make_Name, MODEL_NAME: Model_Name, 'VARIANT': Variant_Name, STATE_CODE: Rto_Zone}, result);
                            if (result.hasOwnProperty(slab)) {
                                var Idv = result[slab];
                                var Insurer_Vehicle_ExShowRoom = result['EX-SHOWROOM_PRICE'];
                                Db_Idv_Calculated['Idv_Normal'] = Idv;
                                Db_Idv_Calculated['Idv_Min'] = Math.round(Idv * 0.95);
                                Db_Idv_Calculated['Idv_Max'] = Math.round(Idv * 1.05);
                                Db_Idv_Calculated['Exshowroom'] = Insurer_Vehicle_ExShowRoom;
                            }
                        }
                        objCurrent.insurer_vehicle_idv_handler(Db_Idv_Calculated, objProduct, Insurer_Object, specific_insurer_object);
                        console.error('Finish', this.constructor.name, 'insurer_vehicle_idv', Db_Idv_Calculated);
                        return Db_Idv_Calculated;
                    }
                });
            }
        });

    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', ex);

    }
};

UnitedIndiaMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';

    try {
        if (objResponseJson.hasOwnProperty('ROOT')) {
            //check error stop
            objResponseJson = objResponseJson['ROOT']['HEADER'][0];
            if ((objResponseJson['TXT_ERR_MSG'][0]) == '') {

            } else {
                Error_Msg = objResponseJson['TXT_ERR_MSG'][0];
            }
        } else {
            Error_Msg = 'LM_EMPTY_RESPONSE';
        }
        if (Error_Msg === 'NO_ERR') {
            var objLMPremium = {};
            var transaction_id = objResponseJson['TXT_TRANSACTION_ID'][0];
            var reference_no = objResponseJson['NUM_REFERENCE_NUMBER'][0];
            var Received_Premium = objResponseJson['CUR_FINAL_TOTAL_PREMIUM'][0];
            var Requested_Premium = this.lm_request['final_premium'];
            var checksum_key = 'r2v4WtZszNi3';
            var objPremiumVerification = this.premium_verification(Requested_Premium, Received_Premium);
            var random_str = 'PB-' + transaction_id.toString() + '-' + this.randomString(5);
            if (objPremiumVerification.Status) {
                var pg_args = {
                    'MerchantID': 'UIILANDBRK',
                    'CustomerID': random_str.toString().toUpperCase(),
                    'NA': 'NA',
                    'TxnAmount': ((config.environment.name === 'Production') ? Received_Premium : '2.00'),
                    'NA1': 'NA',
                    'NA2': 'NA',
                    'NA3': 'NA',
                    'CurrencyType': 'INR',
                    'NA4': 'NA',
                    'TypeField1': 'R',
                    'SecurityID': 'uiilandbrk',
                    'NA5': 'NA',
                    'NA6': 'NA',
                    'TypeField2': 'F',
                    'Txtadditionalinfo1': 'NA',
                    'Txtadditionalinfo2': 'NA',
                    'Txtadditionalinfo3': 'NA',
                    'Txtadditionalinfo4': 'NA',
                    'Txtadditionalinfo5': 'NA',
                    'Txtadditionalinfo6': 'NA',
                    'Txtadditionalinfo7': 'NA',
                    'RU': this.const_payment.pg_ack_url
                };
                var arrPgVal = [];
                for (var k in pg_args) {
                    arrPgVal.push(pg_args[k]);
                }

                var msg = arrPgVal.join('|');
                var checksummsg = msg;
                var checksumvalue = this.encrypt_to_hmac_256(checksummsg, checksum_key);
                var pg_data = {
                    'msg': msg + '|' + checksumvalue
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = transaction_id + '-' + reference_no;
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    return objServiceHandler;
};
UnitedIndiaMotor.prototype.pg_response_handler = function () {
    //msg=UIILANDBRK|GR201804050000022225|LCIT6195505370|NA|2.00|CIT|NA|NA|INR|DIRECT|NA|NA|0.00|06-04-2018 00:01:49|0399|NA|NA|NA|NA|NA|NA|NA|NA|NA|Canceled By User|30D2C282F2FA0379E70C9C0902B0140BFF6149D7CBA923BCB5E8B3D124A52363
    //SUCCESS if msgcode '0300'
    try {
        var objInsurerProduct = this;
        var msg = objInsurerProduct.lm_request.pg_post['msg'];
        var str = msg.split('|');
        this.const_policy.transaction_status = '';
        this.const_policy.transaction_id = str[2];
        if (msg.indexOf('|0300|') > -1) {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_amount = str[4];
            this.const_policy.pg_reference_number_1 = str[2];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', e);
    }
};
UnitedIndiaMotor.prototype.verification_response_handler = function (objResponseJson) {
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
            if (objResponseJson.hasOwnProperty('ROOT')) {
                //check error stop
                objResponseJson = objResponseJson['ROOT']['HEADER'][0];
                if ((objResponseJson['TXT_ERR_MSG'][0]) == '') {

                } else {
                    Error_Msg = objResponseJson['TXT_ERR_MSG'][0];
                }
            } else {
                Error_Msg = 'LM_EMPTY_RESPONSE';
            }

            if (Error_Msg === 'NO_ERR') {
                if (objResponseJson.hasOwnProperty('TXT_NEW_POLICY_NUMBER') && objResponseJson['TXT_NEW_POLICY_NUMBER'][0] !== '') {
                    this.const_policy.policy_number = objResponseJson['TXT_NEW_POLICY_NUMBER'][0];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'CAR';
                    if (this.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number + '.pdf';
                    var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;

                    var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;

                    var https = require('https');
                    var insurer_pdf_url = objResponseJson['SCHEDULE'][0];
                    this.const_policy.insurer_policy_url = insurer_pdf_url;
                    try {
                        var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                        //var file_portal = fs.createWriteStream(pdf_sys_loc_portal);
                        var request = https.get(insurer_pdf_url, function (response) {
                            console.error('PDFComplete', insurer_pdf_url);
                            response.pipe(file_horizon);
                            //response.pipe(file_portal);
                        });
                    } catch (ep) {
                        console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
                    }
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
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
    objServiceHandler.Policy = this.const_policy;
    console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    return objServiceHandler;
};
UnitedIndiaMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "CUR_BASIC_OD_PREMIUM", //when PropCoverDetails_CoverGroups = Own Damage
        "od_elect_access": "",
        "od_non_elect_access": "",
        "od_cng_lpg": "",
        "od_disc_ncb": "",
        "od_disc_vol_deduct": "",
        "od_disc_anti_theft": "",
        "od_disc_aai": "",
        "od_loading": "",
        "od_disc": "",
        "od_final_premium": "CUR_FINAL_NET_OD_PREMIUM"
    },
    "liability": {
        "tp_basic": "",
        "tp_cover_owner_driver_pa": "",
        "tp_cover_unnamed_passenger_pa": "",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "",
        "tp_cover_paid_driver_ll": "",
        "tp_cng_lpg": "",
        "tp_final_premium": ""
    },
    "addon": {
        "addon_zero_dep_cover": "",
        "addon_road_assist_cover": "", ///when PropCoverDetails_CoverGroups = RoadSide Assist
        "addon_ncb_protection_cover": "",
        "addon_engine_protector_cover": "",
        "addon_invoice_price_cover": "",
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
    "net_premium": "CUR_NET_FINAL_PREMIUM",
    "service_tax": "PropPremiumCalculation_ServiceTax",
    "final_premium": "CUR_FINAL_TOTAL_PREMIUM"
};
module.exports = UnitedIndiaMotor;






