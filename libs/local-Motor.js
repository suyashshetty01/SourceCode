/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var util = require('util');
var Base = require('../libs/Base');
var moment = require('moment');
var config = require('config');
var MongoClient = require('mongodb').MongoClient;

var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var fs = require('fs');
var mongojs = require('mongojs');
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);

function Motor() {

}
util.inherits(Motor, Base);
//Motor.prototype.__proto__ = Base.prototype;
Motor.prototype.product_field_list = [];
Motor.prototype.common_addon_list = [];
Motor.prototype.const_idv_breakup = {
    "Idv_Normal": null,
    "Idv_Min": null,
    "Idv_Max": null,
    "Exshowroom": null
};

Motor.prototype.const_premium_breakup = {
    "own_damage": {
        "od_basic": 0,
        "od_elect_access": 0,
        "od_non_elect_access": 0,
        "od_cng_lpg": 0,
        "od_disc_ncb": 0,
        "od_disc_vol_deduct": 0,
        "od_disc_anti_theft": 0,
        "od_disc_aai": 0,
        "od_disc_tppd": 0,
        "od_loading": 0,
        "od_disc": 0,
        "od_inspection_charge": 0,
        "od_final_premium": 0,
        "od_helmet_cover": 0
    },
    "liability": {
        "tp_basic": 0,
        "tp_cover_owner_driver_pa": 0,
        "tp_cover_additional_pa": 0,
        "tp_cover_unnamed_passenger_pa": 0,
        "tp_cover_named_passenger_pa": 0,
        "tp_cover_paid_driver_pa": 0,
        "tp_cover_paid_driver_ll": 0,
        "tp_cover_tppd": 0,
        "tp_cng_lpg": 0,
        "tp_final_premium": 0
    },
    "addon": {
        "addon_zero_dep_cover": 0,
        "addon_road_assist_cover": 0,
        "addon_ncb_protection_cover": 0,
        "addon_engine_protector_cover": 0,
        "addon_invoice_price_cover": 0,
        "addon_key_lock_cover": 0,
        "addon_consumable_cover": 0,
        "addon_daily_allowance_cover": 0,
        "addon_windshield_cover": 0,
        "addon_passenger_assistance_cover": 0,
        "addon_tyre_coverage_cover": 0,
        "addon_personal_belonging_loss_cover": 0,
        "addon_inconvenience_allowance_cover": 0,
        "addon_medical_expense_cover": 0,
        "addon_hospital_cash_cover": 0,
        "addon_ambulance_charge_cover": 0,
        "addon_rodent_bite_cover": 0,
        "addon_losstime_protection_cover": 0,
        "addon_hydrostatic_lock_cover": 0,
        "addon_guaranteed_auto_protection_cover": 0,
        "addon_accident_shield_cover": 0,
        "addon_final_premium": 0
    },
    "net_premium": 0,
    "service_tax": 0,
    "final_premium": 0
};


Motor.prototype.const_premium_master = {
    "own_damage": {
        "od_basic": 0,
        "od_loading": 0,
        "od_disc": 0
    },
    "liability": {
        "tp_basic": 0,
        "tp_cover_owner_driver_pa": 0,
        "tp_cng_lpg": 0
    }
};

Motor.prototype.const_premium_rate = {
    "own_damage": {
        "od_basic": 0,
        "od_elect_access": 0,
        "od_non_elect_access": 0,
        "od_cng_lpg": 0,
        "od_disc_ncb": 0,
        "od_disc_vol_deduct": 0,
        "od_disc_anti_theft": 0,
        "od_disc_aai": 0,
        "od_disc_tppd": 0,
        "od_loading": 0,
        "od_disc": 0,
        "od_helmet_cover": 0
    },
    "liability": {
        "tp_basic": 0,
        "tp_cover_owner_driver_pa": 0,
        "tp_cover_unnamed_passenger_pa": 0,
        "tp_cover_named_passenger_pa": 0,
        "tp_cover_paid_driver_pa": 0,
        "tp_cover_paid_driver_ll": 0,
        "tp_cng_lpg": 0
    },
    "addon": {
        "addon_zero_dep_cover": 0,
        "addon_road_assist_cover": 0,
        "addon_ncb_protection_cover": 0,
        "addon_engine_protector_cover": 0,
        "addon_invoice_price_cover": 0,
        "addon_key_lock_cover": 0,
        "addon_consumable_cover": 0,
        "addon_daily_allowance_cover": 0,
        "addon_windshield_cover": 0,
        "addon_passenger_assistance_cover": 0,
        "addon_tyre_coverage_cover": 0,
        "addon_personal_belonging_loss_cover": 0,
        "addon_inconvenience_allowance_cover": 0,
        "addon_medical_expense_cover": 0,
        "addon_hospital_cash_cover": 0,
        "addon_ambulance_charge_cover": 0,
        "addon_rodent_bite_cover": 0,
        "addon_losstime_protection_cover": 0,
        "addon_hydrostatic_lock_cover": 0,
        "addon_accident_shield_cover": 0

    }
};
Motor.prototype.const_addon_master = {
    "addon_zero_dep_cover": 0,
    "addon_road_assist_cover": 0,
    "addon_ncb_protection_cover": 0,
    "addon_engine_protector_cover": 0,
    "addon_invoice_price_cover": 0,
    "addon_key_lock_cover": 0,
    "addon_consumable_cover": 0,
    "addon_daily_allowance_cover": 0,
    "addon_windshield_cover": 0,
    "addon_passenger_assistance_cover": 0,
    "addon_tyre_coverage_cover": 0,
    "addon_personal_belonging_loss_cover": 0,
    "addon_inconvenience_allowance_cover": 0,
    "addon_medical_expense_cover": 0,
    "addon_hospital_cash_cover": 0,
    "addon_ambulance_charge_cover": 0,
    "addon_rodent_bite_cover": 0,
    "addon_losstime_protection_cover": 0,
    "addon_hydrostatic_lock_cover": 0,
    "addon_accident_shield_cover": 0,
    "addon_guaranteed_auto_protection_cover": 0
};
Motor.prototype.product_api_pre = function () {
    console.log(this.constructor.name + '::' + 'product_api_pre' + '::Start');
    var objLMRequest = this.lm_request;
    if (objLMRequest['vehicle_registration_type'] === 'individual') {
        if ((objLMRequest['pa_owner_driver_si'] - 0) === 0) {
            objLMRequest['pa_owner_driver_si'] = 1500000;
        }
    }

    /*objLMRequest['is_having_valid_dl'] = 'no';
     if (objLMRequest.hasOwnProperty('is_having_valid_dl') && objLMRequest['is_having_valid_dl'] != 'false') {
     objLMRequest['is_having_valid_dl'] = 'yes';
     }
     
     objLMRequest['is_opted_standalone_cpa'] = 'no';
     if (objLMRequest.hasOwnProperty('is_opted_standalone_cpa') && objLMRequest['is_opted_standalone_cpa'] != 'false') {
     objLMRequest['is_opted_standalone_cpa'] = 'yes';
     }*/


    if (objLMRequest['nominee_relation'] === "0") {
        objLMRequest['nominee_relation'] = "";
    }
    if (this.lm_request['method_type'] === 'Premium') {
        if ((objLMRequest['crn'] - 0) === 0) {
            //objLMRequest['is_llpd'] = 'yes';
        }
    }
    if (objLMRequest['vehicle_insurance_type'] === 'renew') {

        if (!objLMRequest.hasOwnProperty('policy_expiry_date') || objLMRequest['policy_expiry_date'] === '') {
            if (objLMRequest.hasOwnProperty('is_breakin') && objLMRequest['is_breakin'] === 'no') {
                objLMRequest['policy_expiry_date'] = this.todayDate();
            }
        }
        if (objLMRequest.hasOwnProperty('registration_no') && objLMRequest['registration_no'] !== '') {
            var registration_no = objLMRequest['registration_no'].toString().toUpperCase();
            objLMRequest['registration_no'] = registration_no;
            var Arr_Registration_No = registration_no.split('-');
            objLMRequest['registration_no_1'] = Arr_Registration_No[0];
            objLMRequest['registration_no_2'] = Arr_Registration_No[1];
            if (this.lm_request['method_type'] === 'Premium') {
                objLMRequest['registration_no_3'] = objLMRequest['registration_no_3'] || 'ZZ';
                objLMRequest['registration_no_4'] = objLMRequest['registration_no_4'] || '9999';
            } else {
                objLMRequest['registration_no_3'] = Arr_Registration_No[2];
                objLMRequest['registration_no_4'] = Arr_Registration_No[3];
            }
        }
    }
    if (objLMRequest['vehicle_insurance_type'] === 'new') {
        objLMRequest['policy_expiry_date'] = '';
        objLMRequest['prev_insurer_id'] = '';
        objLMRequest['is_claim_exists'] = 'yes';
        objLMRequest['vehicle_ncb_current'] = '0';

        if (objLMRequest.hasOwnProperty('registration_no') && objLMRequest['registration_no'] !== '') {
            var registration_no = objLMRequest['registration_no'];
            var Arr_Registration_No = registration_no.split('-');
            objLMRequest['registration_no_1'] = Arr_Registration_No[0];
            objLMRequest['registration_no_2'] = Arr_Registration_No[1];
            objLMRequest['registration_no_3'] = '';
            objLMRequest['registration_no_4'] = '';
        }
    }

    if (!objLMRequest.hasOwnProperty('is_external_bifuel') || objLMRequest['is_external_bifuel'] == '' || objLMRequest['is_external_bifuel'] == null) {
        objLMRequest['is_external_bifuel'] = 'no';
    }
    if (objLMRequest['is_external_bifuel'] == 'no') {
        objLMRequest['external_bifuel_value'] = '0';
    }
	if (objLMRequest['is_external_bifuel'] == 'yes') {
        objLMRequest['external_bifuel_type'] = objLMRequest['external_bifuel_type'].toLowerCase();
    }

    if (objLMRequest.hasOwnProperty('gst_no')) {
        if (objLMRequest['gst_no'] !== '') {
            var state_code = objLMRequest['gst_no'].substring(0, 2);
            var obj_gst_state = {
                '01': 'JAMMU & KASHMIR',
                '02': 'HIMACHAL PRADESH',
                '03': 'PUNJAB',
                '04': 'CHANDIGARH',
                '05': 'UTTARAKHAND',
                '06': 'HARYANA',
                '07': 'DELHI',
                '08': 'RAJASTHAN',
                '09': 'UTTAR PRADESH',
                '10': 'BIHAR',
                '11': 'SIKKIM',
                '12': 'ARUNACHAL PRADESH',
                '13': 'NAGALAND',
                '14': 'MANIPUR',
                '15': 'MIZORAM',
                '16': 'TRIPURA',
                '17': 'MEGHLAYA',
                '18': 'ASSAM',
                '19': 'WEST BENGAL',
                '20': 'JHARKHAND',
                '21': 'ODISHA',
                '22': 'CHHATTISGARH',
                '23': 'MADHYA PRADESH',
                '24': 'GUJARAT',
                '25': 'DAMAN AND DIU',
                '26': 'DADRA AND NAGAR HAVELI',
                '27': 'MAHARASHTRA',
                '28': 'ANDHRA PRADESH',
                '29': 'KARNATAKA',
                '30': 'GOA',
                '31': 'LAKSHWADEEP',
                '32': 'KERALA',
                '33': 'TAMIL NADU',
                '34': 'PUDUCHERRY',
                '35': 'ANDAMAN & NICOBAR ISLANDS',
                '36': 'TELANGANA',
            };
            var state = obj_gst_state[state_code];
            objLMRequest['gst_state'] = state;
        }
    }


//    if (!objLMRequest.hasOwnProperty('pa_owner_driver_si')) {
//        objLMRequest['pa_owner_driver_si'] = '0';
//
//    }
    if (objLMRequest.hasOwnProperty('pa_unnamed_passenger_si') && objLMRequest['pa_unnamed_passenger_si'] == '150000' ) {
        objLMRequest['pa_unnamed_passenger_si'] = '200000';
    }
//objLMRequest['vehicle_expected_idv'] = this.motor_vehicle_idv();
    if (objLMRequest['method_type'] == 'Proposal') {
        for (var key in this.const_addon_master) {
            if (objLMRequest.hasOwnProperty(key) === false) {
                objLMRequest[key] = 'no';
            }
        }
    }
    this.lm_request = objLMRequest;
    console.log(this.constructor.name + '::' + 'product_api_pre' + '::Finish');
}

Motor.prototype.product_field_process_pre = function () {

}
Motor.prototype.product_response_handler = function (objResponseJson, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object) {
    console.log('Start', this.constructor.name, 'product_response_handler');
    try {
        var objProductResponse = objInsurerProduct.insurer_product_response_handler(objResponseJson, objProduct, Insurer_Object, specific_insurer_object);
        if (objProductResponse.Error_Msg == 'NO_ERR') {
            if (specific_insurer_object.method.Method_Type === 'Premium') {
                var od_basic = objProductResponse.Premium_Breakup.own_damage.od_basic - 0;
                var tp_basic = objProductResponse.Premium_Breakup.liability.tp_basic - 0;
                if (objProduct.lm_request.vehicle_insurance_subtype === "1OD_0TP")
                {
                    if (od_basic < 0) {
                        objProductResponse.Error_Msg = 'LM_MSG::INSURER_OD_ZERO';
                    }
                } else {
                    if (od_basic < 0 || tp_basic < 100) {
                        objProductResponse.Error_Msg = 'LM_MSG::INSURER_OD_TP_ZERO';
                    }
                }
            }
        }

        if (objProductResponse.Error_Msg == 'NO_ERR') {
            if (specific_insurer_object.method.Method_Type === 'Premium') {
                //process premium rates
                var Premium_Rate = this.get_const_rate_breakup();
                Premium_Rate.own_damage.od_basic = this.round2Precision((objProductResponse.Premium_Breakup.own_damage.od_basic / objInsurerProduct.prepared_request['vehicle_expected_idv']) * 100);
                Premium_Rate.own_damage.od_elect_access = this.round2Precision((objProductResponse.Premium_Breakup.own_damage.od_elect_access / objInsurerProduct.prepared_request['electrical_accessory']) * 100);
                Premium_Rate.own_damage.od_non_elect_access = this.round2Precision((objProductResponse.Premium_Breakup.own_damage.od_non_elect_access / objInsurerProduct.prepared_request['non_electrical_accessory']) * 100);
                Premium_Rate.own_damage.od_helmet_cover = this.round2Precision((objProductResponse.Premium_Breakup.own_damage.od_helmet_cover / objInsurerProduct.prepared_request['helmet_cover']) * 100);
                Premium_Rate.own_damage.od_cng_lpg = this.round2Precision((objProductResponse.Premium_Breakup.own_damage.od_cng_lpg / objInsurerProduct.prepared_request['external_bifuel_value']) * 100);
                if ([2, 7].indexOf(specific_insurer_object.method.Insurer_Id) > -1) {
                    Premium_Rate.own_damage.od_disc_ncb = this.round2Precision((objProductResponse.Premium_Breakup.own_damage.od_disc_ncb / objProductResponse.Premium_Breakup.own_damage.od_basic) * 100);
                } else {
                    Premium_Rate.own_damage.od_disc_ncb = this.round2Precision((objProductResponse.Premium_Breakup.own_damage.od_disc_ncb / (objProductResponse.Premium_Breakup.own_damage.od_basic - objProductResponse.Premium_Breakup.own_damage.od_disc)) * 100);

                }
                Premium_Rate.own_damage.od_disc_ncb = this.vehicle_ncb_next();
                var final_od = objProductResponse.Premium_Breakup.own_damage.od_basic - objProductResponse.Premium_Breakup.own_damage.od_disc_ncb - objProductResponse.Premium_Breakup.own_damage.od_disc_anti_theft - objProductResponse.Premium_Breakup.own_damage.od_disc_aai;
                if ([4, 9, 12, 33, 11, 14, 19].indexOf(specific_insurer_object.method.Insurer_Id) > -1) {
                    Premium_Rate.own_damage.od_disc = Math.round((objProductResponse.Premium_Breakup.own_damage.od_disc / objProductResponse.Premium_Breakup.own_damage.od_basic) * 100);
                } else {
                    Premium_Rate.own_damage.od_disc = Math.round((objProductResponse.Premium_Breakup.own_damage.od_disc / final_od) * 100);
                }
                Premium_Rate.own_damage.od_loading = this.round2Precision((objProductResponse.Premium_Breakup.own_damage.od_loading / final_od) * 100);

                for (var key in Premium_Rate.addon) {
                    Premium_Rate.addon[key] = this.round2Precision((objProductResponse.Premium_Breakup.addon[key] / objInsurerProduct.prepared_request['vehicle_expected_idv']) * 100);
                }

                objProductResponse.Premium_Rate = Premium_Rate;


                //process for premium mastet
                DbCollectionName = 'motor_premiums_idvs';
                var Premium_Breakup = this.const_premium_master;
                for (var key  in this.const_premium_master) {
                    if (typeof this.const_premium_master[key] === 'object') {
                        for (var subkey  in this.const_premium_master[key]) {
                            Premium_Breakup[key][subkey] = objProductResponse.Premium_Breakup[key][subkey];
                        }
                    }
                }

                Premium_Breakup['net_premium'] = Premium_Breakup['own_damage']['od_final_premium'] + Premium_Breakup['liability']['tp_final_premium'];
                Premium_Breakup['service_tax'] = Premium_Breakup['net_premium'] * 0.18;
                Premium_Breakup['final_premium'] = Premium_Breakup['net_premium'] + Premium_Breakup['service_tax'];
                var Addon = objProductResponse.Premium_Breakup['addon'];
                var addon_final_premium = Addon['addon_final_premium'];
                delete Addon['addon_final_premium'];
                var SearchCriteria = {
                    "Insurer_Id": parseInt(specific_insurer_object['insurer_id']),
                    "Vehicle_Id": parseInt(objInsurerProduct.lm_request['vehicle_id']),
                    "Rto_Id": parseInt(objInsurerProduct.lm_request['rto_id']),
                    "Vehicle_Age_Month": objInsurerProduct.vehicle_age_month(),
                    "Vehicle_Age_Slab": objInsurerProduct.vehicle_age_slab_month(),
                    "Idv_By_CRN": 'no'
                };
                if (objInsurerProduct.lm_request['idv_by_crn'] === 'yes') {
                    SearchCriteria = {
                        "Insurer_Id": parseInt(specific_insurer_object['insurer_id']),
                        "PB_CRN": parseInt(objInsurerProduct.lm_request['crn']),
                        "Idv_By_CRN": 'yes'
                    };
                    //console.error('DBG', 'idv_by_crn', SearchCriteria);
                }
                var ObjDocument = {
                    "Premium_Breakup": Premium_Breakup,
                    "Addon": Addon,
                    "Premium_Rate": Premium_Rate
                };
                this.save_to_db(DbCollectionName, {$set: ObjDocument}, SearchCriteria);
                Object.assign(Addon, {'addon_final_premium': addon_final_premium});

            }
            if (specific_insurer_object.method.Method_Type === 'Coverage') {
                DbCollectionName = 'motor_premiums_idvs';
                var SearchCriteria = {
                    "Insurer_Id": parseInt(specific_insurer_object['insurer_id']),
                    "Vehicle_Id": parseInt(objInsurerProduct.lm_request['vehicle_id']),
                    "Rto_Id": parseInt(objInsurerProduct.lm_request['rto_id']),
                    "Vehicle_Age_Month": objInsurerProduct.vehicle_age_month(),
                    "Idv_By_CRN": 'no'
                };
                if (objInsurerProduct.lm_request['idv_by_crn'] === 'yes') {
                    SearchCriteria = {
                        "Insurer_Id": parseInt(specific_insurer_object['insurer_id']),
                        "PB_CRN": parseInt(objInsurerProduct.lm_request['crn']),
                        "Idv_By_CRN": 'yes'
                    };
                    console.error('DBG', 'idv_by_crn', SearchCriteria);
                }
                var ObjDocument = {
                    "Coverage": objProductResponse.Coverage
                };
                this.save_to_db(DbCollectionName, {$set: ObjDocument}, SearchCriteria);
            }
        }
        console.log('Finish', this.constructor.name, 'product_response_handler');
        return objProductResponse;
    } catch (e) {
        console.error('Exception', e);
    }

}
Motor.prototype.product_field_process_post = function () {

}
Motor.prototype.product_api_post = function () {

}
Motor.prototype.motor_pb_crn_create = function (lm_request, client_id, request_unique_id, user_data_id) {

    var crn_data = {
        "ProductID": lm_request.product_id,
        "CarType": (lm_request['vehicle_insurance_type'] === 'renew') ? 'RENEW' : 'NEW',
        "Variant_ID": lm_request['vehicle_id'],
        "VehicleCity_Id": lm_request.rto_id,
        "CNG_LPG_Kit": (lm_request['is_external_bifuel'] === 'yes') ? 1 : 0,
        "DateofPurchaseofCar": this.date_format(lm_request['vehicle_registration_date'], 'dd/MM/yyyy'),
        "OwnerDOB": this.date_format(lm_request['birth_date'], 'dd/MM/yyyy'),
        "ElectricalAccessories": lm_request['electrical_accessory'],
        "IsAntiTheftDevice": (lm_request['is_antitheft_fit'] === 'yes') ? 1 : 0,
        "AutomobileAssociationName": 1,
        "HaveNCBCertificate": (lm_request['is_claim_exists'] === 'yes') ? 1 : 0,
        "NonElectricalAccessories": lm_request['non_electrical_accessory'],
        "PeronalAccidentCoverforDriver": (lm_request['is_llpd'] === 'yes') ? 1 : 0,
        "PersonalCoverPassenger": (lm_request.hasOwnProperty('pa_unnamed_passenger_si') && lm_request['pa_unnamed_passenger_si'] !== '') ? (lm_request['pa_unnamed_passenger_si'] - 0) : 0,
        "ProfessionofOwner": 0,
        "VehicleRegisteredName": null,
        "VoluntaryDeduction": lm_request['voluntary_deductible'],
        "IDVinExpiryPolicy": lm_request['vehicle_expected_idv'],
        "NoClaimBonusPercent": (lm_request.hasOwnProperty('vehicle_ncb_current') && lm_request['vehicle_ncb_current'] !== '') ? (lm_request['vehicle_ncb_current'] - 0) : 0,
        "PolicyExpiryDate": this.date_format(lm_request['policy_expiry_date'], 'dd/MM/yyyy'),
        "PreviousInsurer": lm_request['prev_insurer_id'],
        "IDV": (lm_request.hasOwnProperty('vehicle_expected_idv') && lm_request['vehicle_expected_idv'] !== '') ? (lm_request['vehicle_expected_idv'] - 0) : 0,
        "Existing_CustomerReferenceID": (lm_request.hasOwnProperty('crn') && lm_request['crn'] !== '') ? lm_request['crn'] : 0,
        "QuickCallLead_Id": 1,
        "ManufacturingYear": this.date_format(lm_request['manufacture_date'], 'yyyy'),
        "AutomobileAssociationMembership_Name": "",
        "AutomobileAssociationMembershipNumber": "",
        "AutomobileMembershipExpiryDate": "07/12/1981",
        "SupportsAgentID": (lm_request.hasOwnProperty('ss_id') && lm_request['ss_id'] !== '') ? (lm_request['ss_id'] - 0) : 0,
        "ManufacturingMonth": this.date_format(lm_request['manufacture_date'], 'MM'),
        "ContactName": lm_request.first_name + " " + lm_request.last_name,
        "ContactEmail": lm_request.email,
        "ContactMobile": lm_request.mobile,
        "ClientId": client_id,
        "SRN": request_unique_id,
        "QTNumber": (lm_request.hasOwnProperty('lerp_qt_number') && lm_request['lerp_qt_number'] !== '') ? lm_request['lerp_qt_number'] : '',
        "SessionId": (lm_request.hasOwnProperty('pb_session_id') && lm_request['pb_session_id'] !== '') ? lm_request['pb_session_id'] : '',
        "OwnerDriverPersonalAccidentCover": (lm_request.hasOwnProperty('pa_owner_driver_si') && lm_request['pa_owner_driver_si'] !== '') ? (lm_request['pa_owner_driver_si'] - 0) : 100000,
        "NamedPersonalAccidentCover": (lm_request.hasOwnProperty('pa_named_passenger_si') && lm_request['pa_named_passenger_si'] !== '') ? (lm_request['pa_named_passenger_si'] - 0) : 0,
        "RegistrationNumber": (lm_request.hasOwnProperty('registration_no') && lm_request['registration_no'] !== '') ? lm_request['registration_no'].toString().replace(/\-/g, '') : ''
    };
    var args = {
        data: crn_data,
        headers: {
            "Content-Type": "application/json",
            'Username': config.pb_config.api_crn_user,
            'Password': config.pb_config.api_crn_pass
        }
    };
    var Client = require('node-rest-client').Client;
    var client = new Client();
    //console.log('args', args);
    var moment = require('moment');
    var StartDate = moment(new Date());
    client.post(config.pb_config.api_crn_url, args, function (data, response) {
        var EndDate = moment(new Date());
        var Call_Execution_Time = EndDate.diff(StartDate);
        Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
        var is_email = false;
        if (data > 0) {
            if (Call_Execution_Time > 3)
            {
                is_email = true;
            }
            var Request = require('../models/request');
            Request.findOne({"Request_Unique_Id": request_unique_id}, function (err, dbRequest) {
                if (err) {

                } else {
                    if (dbRequest) {
                        var ObjRequest = {
                            'PB_CRN': data
                        };
                        var Request = require('../models/request');
                        Request.update({'Request_Id': dbRequest._doc['Request_Id']}, ObjRequest, function (err, numAffected) {
                            console.log('RequestCRNUpdate', err, numAffected);
                        });
                    }
                }
            });
            var ObjUser_Data = {'PB_CRN': data};
            var User_Data = require('../models/user_data');
            User_Data.update({'User_Data_Id': user_data_id}, {$set: ObjUser_Data}, function (err, numAffected) {
                console.log('UserDataCRNUpdate', err, numAffected);
            });
        } else {
            is_email = true;
        }

        if (is_email)
        {
            //console.error("PB_CRN_LOG", crn_data, data);

            var sub = '[' + config.environment.name.toString().toUpperCase() + '-' + ((data > 0) ? 'INFO' : 'ERR') + '][MOTOR]CRN_';
            sub += (lm_request.hasOwnProperty('crn') && (lm_request['crn'] - 0) > 0) ? 'UPDATE' : 'CREATE';
            sub += '::Exec_Time-' + Call_Execution_Time + '_SEC';
            var msg = '<!DOCTYPE html><html><head><title>Proposal Report</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';

            msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">CRN&nbsp;Request</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
            msg += '<tr><td  width="78%" style="font-family:tahoma;font-size:14px;"><pre>' + JSON.stringify(crn_data, undefined, 2) + '</pre></td></tr>';

            msg += '</table></div><br><br>';
            msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">CRN&nbsp;Response</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
            msg += '<tr><td  width="78%" style="font-family:tahoma;font-size:14px;"><pre>' + JSON.stringify(data, undefined, 2) + '</pre></td></tr>';

            msg += '</table></div>';
            msg += '</body></html>';

            var Email = require('../models/email');
            var objModelEmail = new Email();
            objModelEmail.send('noreply@landmarkinsurance.co.in', 'horizon.lm.notification@gmail.com', sub, msg, '', '');
        }
    });
}
Motor.prototype.motor_pb_crn_create_NIU = function (lm_request, client_id, request_unique_id, user_data_id) {

    var crn_data = {
        "ProductID": lm_request.product_id,
        "CarType": (lm_request['vehicle_insurance_type'] === 'renew') ? 'RENEW' : 'NEW',
        "Variant_ID": lm_request['vehicle_id'],
        "VehicleCity_Id": lm_request.rto_id,
        "CNG_LPG_Kit": (lm_request['is_external_bifuel'] === 'yes') ? 1 : 0,
        "DateofPurchaseofCar": this.date_format(lm_request['vehicle_registration_date'], 'dd/MM/yyyy'),
        "OwnerDOB": this.date_format(lm_request['birth_date'], 'dd/MM/yyyy'),
        "ElectricalAccessories": lm_request['electrical_accessory'],
        "IsAntiTheftDevice": (lm_request['is_antitheft_fit'] === 'yes') ? 1 : 0,
        "AutomobileAssociationName": 1,
        "HaveNCBCertificate": (lm_request['is_claim_exists'] === 'yes') ? 1 : 0,
        "NonElectricalAccessories": lm_request['non_electrical_accessory'],
        "PeronalAccidentCoverforDriver": (lm_request['is_llpd'] === 'yes') ? 1 : 0,
        "PersonalCoverPassenger": (lm_request.hasOwnProperty('pa_unnamed_passenger_si') && lm_request['pa_unnamed_passenger_si'] !== '') ? (lm_request['pa_unnamed_passenger_si'] - 0) : 0,
        "ProfessionofOwner": 0,
        "VehicleRegisteredName": null,
        "VoluntaryDeduction": lm_request['voluntary_deductible'],
        "IDVinExpiryPolicy": lm_request['vehicle_expected_idv'],
        "NoClaimBonusPercent": (lm_request.hasOwnProperty('vehicle_ncb_current') && lm_request['vehicle_ncb_current'] !== '') ? (lm_request['vehicle_ncb_current'] - 0) : 0,
        "PolicyExpiryDate": this.date_format(lm_request['policy_expiry_date'], 'dd/MM/yyyy'),
        "PreviousInsurer": lm_request['prev_insurer_id'],
        "IDV": (lm_request.hasOwnProperty('vehicle_expected_idv') && lm_request['vehicle_expected_idv'] !== '') ? (lm_request['vehicle_expected_idv'] - 0) : 0,
        "Existing_CustomerReferenceID": (lm_request.hasOwnProperty('crn') && lm_request['crn'] !== '') ? lm_request['crn'] : 0,
        "QuickCallLead_Id": 1,
        "ManufacturingYear": this.date_format(lm_request['manufacture_date'], 'yyyy'),
        "AutomobileAssociationMembership_Name": "",
        "AutomobileAssociationMembershipNumber": "",
        "AutomobileMembershipExpiryDate": "07/12/1981",
        "SupportsAgentID": (lm_request.hasOwnProperty('ss_id') && lm_request['ss_id'] !== '') ? (lm_request['ss_id'] - 0) : 0,
        "ManufacturingMonth": this.date_format(lm_request['manufacture_date'], 'MM'),
        "ContactName": lm_request.first_name + " " + lm_request.last_name,
        "ContactEmail": lm_request.email,
        "ContactMobile": lm_request.mobile,
        "ClientId": client_id,
        "SRN": request_unique_id,
        "QTNumber": (lm_request.hasOwnProperty('lerp_qt_number') && lm_request['lerp_qt_number'] !== '') ? lm_request['lerp_qt_number'] : '',
        "SessionId": (lm_request.hasOwnProperty('pb_session_id') && lm_request['pb_session_id'] !== '') ? lm_request['pb_session_id'] : '',
        "OwnerDriverPersonalAccidentCover": (lm_request.hasOwnProperty('pa_owner_driver_si') && lm_request['pa_owner_driver_si'] !== '') ? (lm_request['pa_owner_driver_si'] - 0) : 100000,
        "NamedPersonalAccidentCover": (lm_request.hasOwnProperty('pa_named_passenger_si') && lm_request['pa_named_passenger_si'] !== '') ? (lm_request['pa_named_passenger_si'] - 0) : 0,
        "RegistrationNumber": (lm_request.hasOwnProperty('registration_no') && lm_request['registration_no'] !== '') ? lm_request['registration_no'].toString().replace(/\-/g, '') : ''
    };
    var ObjCrn = {
        'Product_Id': lm_request.product_id,
        'User_Data_Id': user_data_id,
        'Crn_Request': lm_request,
        'PB_Crn_Request': crn_data
    };
    var args = {
        data: ObjCrn,
        headers: {
            "Content-Type": "application/json",
            'Username': config.pb_config.api_crn_user,
            'Password': config.pb_config.api_crn_pass
        }
    };
    var Client = require('node-rest-client').Client;
    var client = new Client();
    //console.log('args', args);
    var moment = require('moment');
    var StartDate = moment(new Date());
    client.post(config.pb_config.horizon_api_crn_url, args, function (data, response) {
        var EndDate = moment(new Date());
        var Call_Execution_Time = EndDate.diff(StartDate);
        Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
        var is_email = false;
        data = data - 0;
        if (data > 0) {
            if (Call_Execution_Time > 3)
            {
                is_email = true;
            }
            var Request = require('../models/request');
            Request.findOne({"Request_Unique_Id": request_unique_id}, function (err, dbRequest) {
                if (err) {

                } else {
                    if (dbRequest) {
                        var ObjRequest = {
                            'PB_CRN': data
                        };
                        var Request = require('../models/request');
                        Request.update({'Request_Id': dbRequest._doc['Request_Id']}, ObjRequest, function (err, numAffected) {
                            console.log('RequestCRNUpdate', err, numAffected);
                        });
                    }
                }
            });
            var ObjUser_Data = {'PB_CRN': data};
            var User_Data = require('../models/user_data');
            User_Data.update({'User_Data_Id': user_data_id}, {$set: ObjUser_Data}, function (err, numAffected) {
                console.log('UserDataCRNUpdate', err, numAffected);
            });
        } else {
            is_email = true;
        }

        if (is_email)
        {
            //console.error("PB_CRN_LOG", crn_data, data);

            var sub = '[' + config.environment.name.toString().toUpperCase() + '-' + ((data > 0) ? 'INFO' : 'ERR') + '][MOTOR]CRN_';
            sub += (lm_request.hasOwnProperty('crn') && (lm_request['crn'] - 0) > 0) ? 'UPDATE' : 'CREATE';
            sub += '::Exec_Time-' + Call_Execution_Time + '_SEC';
            var msg = '<!DOCTYPE html><html><head><title>Proposal Report</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';

            msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">CRN&nbsp;Request</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
            msg += '<tr><td  width="78%" style="font-family:tahoma;font-size:14px;"><pre>' + JSON.stringify(crn_data, undefined, 2) + '</pre></td></tr>';

            msg += '</table></div><br><br>';
            msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">CRN&nbsp;Response</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
            msg += '<tr><td  width="78%" style="font-family:tahoma;font-size:14px;"><pre>' + JSON.stringify(data, undefined, 2) + '</pre></td></tr>';

            msg += '</table></div>';
            msg += '</body></html>';

            var Email = require('../models/email');
            var objModelEmail = new Email();
            objModelEmail.send('noreply@landmarkinsurance.co.in', 'horizon.lm.notification@gmail.com', sub, msg, '', '');
        }
    });
}


Motor.prototype.vehicle_ncb_next = function () {
    console.log(this.constructor.name, 'vehicle_ncb_next', 'Start');
    var vehicle_ncb_next_val = '0';

    if (this.lm_request['vehicle_insurance_type'] === 'renew') {
        if (this.lm_request.hasOwnProperty('is_claim_exists')) {
            if (this.lm_request['is_claim_exists'] === 'yes') {
                vehicle_ncb_next_val = '0';
            } else {
                var current_ncb = this.lm_request['vehicle_ncb_current'];
                var ncb_slab = ["0", "20", "25", "35", "45", "50"];
                var current_ncb_index = ncb_slab.indexOf(current_ncb);
                var next_ncb_index = (current_ncb_index == (ncb_slab.length - 1)) ? current_ncb_index : (current_ncb_index + 1);
                console.log(this.constructor.name, 'vehicle_ncb_next', 'Finish');
                vehicle_ncb_next_val = ncb_slab[next_ncb_index];
            }

            var days_diff = moment(this.todayDate()).diff(this.lm_request['policy_expiry_date'], 'days');
            //for expired case
            if (days_diff > 90) {
                vehicle_ncb_next_val = '0';
            }
        }
    }
    console.log(this.constructor.name, 'vehicle_ncb_next', 'Finish');
    return vehicle_ncb_next_val;
}
Motor.prototype.policy_start_date = function () {
    console.log(this.constructor.name, 'policy_start_date', 'Start');
    var pol_start_date = new Date();
    if (this.lm_request['vehicle_insurance_type'] == 'new') {

    }
    if (this.lm_request['vehicle_insurance_type'] == 'renew') {
        if (this.lm_request['is_policy_exist'] == 'no') {
            var d = new Date();
            d.setDate(d.getDate() - 90);
            var month = '' + (d.getMonth() + 1);
            var day = '' + d.getDate();
            var year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            this.lm_request['policy_expiry_date'] = [year, month, day].join('-');
        }
        var days_diff = moment(this.todayDate()).diff(this.lm_request['policy_expiry_date'], 'days');
		let day_added = 2;
        if(this.lm_request['product_id'] == 12  && this.lm_request['vehicle_insurance_subtype'] && this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1){
            day_added = 1;
        }
        //for expired case
        if (days_diff > 0) {
            var today_date = new Date(this.todayDate());
            pol_start_date.setDate(today_date.getDate() + day_added);
        } else { // for not expired case
            var expiry_date = new Date(this.lm_request['policy_expiry_date']);
            var pol_start_date = expiry_date;
            pol_start_date.setDate(expiry_date.getDate() + 1);
        }
    }
    pol_start_date = this.date_format(pol_start_date, 'yyyy-MM-dd');
    console.log(this.constructor.name, 'policy_start_date', 'Finish', pol_start_date);
    return pol_start_date;
}
Motor.prototype.policy_end_date_extended = function () {
    console.log('Start', this.constructor.name, 'policy_end_date');
    var pol_end_date = new Date();
    var policy_tenure = 1;
    if (this.lm_request.hasOwnProperty('policy_tenure') && (this.lm_request['policy_tenure'] - 0) > 0) {
        policy_tenure = (this.lm_request['policy_tenure'] - 0);
    }
    if (this.lm_request['vehicle_insurance_type'] === 'new') {
        pol_end_date.setDate(pol_end_date.getDate() - 1);
        pol_end_date.setFullYear(pol_end_date.getFullYear() + policy_tenure);
    }
    if (this.lm_request['vehicle_insurance_type'] === 'renew') {
        var days_diff = moment(this.todayDate()).diff(this.lm_request['policy_expiry_date'], 'days');
        //for expired case
        if (days_diff > 0) {
            var today_date = new Date(this.todayDate());
            pol_end_date.setDate(pol_end_date.getDate() + 1);
            //pol_end_date.setDate(today_date.getDate() + 1);
            pol_end_date.setFullYear(today_date.getFullYear() + policy_tenure);
        } else { // for not expired case
            var expiry_date = new Date(this.lm_request['policy_expiry_date']);
            var pol_end_date = expiry_date;
            pol_end_date.setFullYear(expiry_date.getFullYear() + policy_tenure);
        }
    }
    pol_end_date = this.date_format(pol_end_date, 'yyyy-MM-dd');
    console.log('Finish', this.constructor.name, 'policy_end_date', pol_end_date);
    return pol_end_date;
}
Motor.prototype.policy_end_date = function () {
    console.log('Start', this.constructor.name, 'policy_end_date');
    var pol_end_date = new Date();
    var policy_tenure = 1;
    if (this.lm_request['vehicle_insurance_type'] === 'new') {
        pol_end_date.setDate(pol_end_date.getDate() - 1);
        pol_end_date.setFullYear(pol_end_date.getFullYear() + policy_tenure);
    }
    if (this.lm_request['vehicle_insurance_type'] === 'renew') {
        var days_diff = moment(this.todayDate()).diff(this.lm_request['policy_expiry_date'], 'days');
        //for expired case
        if (days_diff > 0) {
            var today_date = new Date(this.todayDate());
            pol_end_date.setDate(pol_end_date.getDate() + 1);
            //pol_end_date.setDate(today_date.getDate() + 1);
            pol_end_date.setFullYear(today_date.getFullYear() + policy_tenure);
        } else { // for not expired case
            var expiry_date = new Date(this.lm_request['policy_expiry_date']);
            var pol_end_date = expiry_date;
            pol_end_date.setFullYear(expiry_date.getFullYear() + policy_tenure);
        }
    }
    pol_end_date = this.date_format(pol_end_date, 'yyyy-MM-dd');
    console.log('Finish', this.constructor.name, 'policy_end_date', pol_end_date);
    return pol_end_date;
}
Motor.prototype.pre_policy_start_date = function () {
    console.log(this.constructor.name, 'pre_policy_start_date', 'Start');
    var pre_pol_start_date;
    if (this.lm_request['vehicle_insurance_type'] == 'new') {
        pre_pol_start_date = '';
    }
    if (this.lm_request['vehicle_insurance_type'] == 'renew') {
        var expiry_date = new Date(this.lm_request['policy_expiry_date']);
        var pre_pol_start_date = expiry_date;
        pre_pol_start_date.setDate(expiry_date.getDate() + 1);
        pre_pol_start_date.setFullYear(expiry_date.getFullYear() - 1);
        pre_pol_start_date = this.date_format(pre_pol_start_date, 'yyyy-MM-dd');
    }
    console.log(this.constructor.name, 'pre_policy_start_date', 'Finish', pre_pol_start_date);
    return pre_pol_start_date;
}
Motor.prototype.vehicle_age_year = function () {
    console.log('Start', this.constructor.name, 'vehicle_age_year');
    var vehicle_manf_date = this.lm_request['vehicle_manf_date'];
    var policy_start_date = this.policy_start_date();
    var age_in_year = moment(policy_start_date).diff(vehicle_manf_date, 'years');
    console.log('Finish', this.constructor.name, 'vehicle_age_year', age_in_year);
    return age_in_year;
}
Motor.prototype.vehicle_age_month = function () {
    console.log('Start', this.constructor.name, 'pre_policy_start_date');
    if (this.hasOwnProperty('insurer_id') && (this['insurer_id'] - 0) === 16) {
        var vehicle_registration_date = this.lm_request['vehicle_registration_date'];
        var policy_start_date = this.policy_start_date();
        var reg_date = new Date(vehicle_registration_date);
        var pst_date = new Date(policy_start_date);
        var diff_date1 = reg_date - pst_date;
        var num_years1 = diff_date1 / 31536000000;
        var num_months1 = (diff_date1 % 31536000000) / 2628000000;
        var num_days1 = ((diff_date1 % 31536000000) % 2628000000) / 86400000;
        var age_in_year1 = Math.abs(Math.floor(num_years1));
        var age_in_days1 = Math.abs(Math.floor(num_days1));
        var age_in_month1 = Math.abs(Math.floor(num_months1));
        if (age_in_year1 <= 0) {
            age_in_month1 = age_in_month1 + 12;
        } else if (age_in_month1 === 0 && age_in_days1 === 0) {
            age_in_month1 = (age_in_year1 * 12);
        } else {
            age_in_month1 = age_in_month1 + ((age_in_year1 - 1) * 12);
        }
        age_in_month1 = Math.trunc(age_in_month1);
        return age_in_month1;
        console.log('Finish', this.constructor.name, 'vehicle_age_month', age_in_month1);
    } else {
        var vehicle_manf_date = this.lm_request['vehicle_manf_date'];
        var policy_start_date = this.policy_start_date();
        var age_in_month = moment(policy_start_date).diff(vehicle_manf_date, 'months');
        return age_in_month;
        console.log('Finish', this.constructor.name, 'vehicle_age_month', age_in_month);
    }
}
Motor.prototype.vehicle_manf_year = function () {
    console.log('Start', this.constructor.name, 'vehicle_manf_year');
    var vehicle_manf_date = this.lm_request['vehicle_manf_date'];
    var manf_year = this.date_format(vehicle_manf_date, 'yyyy');
    console.log('Finish', this.constructor.name, 'vehicle_manf_year', manf_year);
    return manf_year;
}
Motor.prototype.vehicle_age_slab_month = function () {
    console.log('Start', this.constructor.name, 'vehicle_age_slab_month');

    var age_in_month = this.vehicle_age_month();
    var Const_Vehicle_Age_Slab = {
        'Month_3': 3,
        'Month_6': 6,
        'Month_9': 9,
        'Month_12': 12,
        'Month_18': 18,
        'Month_24': 24,
        'Month_30': 30,
        'Month_36': 36,
        'Month_42': 42,
        'Month_48': 48,
        'Month_54': 54,
        'Month_60': 60,
        'Month_72': 72,
        'Month_84': 84,
        'Month_96': 96,
        'Month_108': 108,
        'Month_120': 120,
        'Month_132': 132,
        'Month_144': 144,
        'Month_156': 156,
        'Month_168': 168,
        'Month_180': 180
    };
    var age_slab = 0;
    for (var key in Const_Vehicle_Age_Slab) {
        if (Const_Vehicle_Age_Slab[key] < age_in_month) {
            age_slab = Const_Vehicle_Age_Slab[key];
        } else {
            break;
        }
    }
    console.log('Finish', this.constructor.name, 'vehicle_age_slab_month', age_slab);
    return age_slab;
}
Motor.prototype.vehicle_idv = function () {
    console.log(this.constructor.name, 'vehicle_idv', 'Start');

    console.log(this.constructor.name, 'vehicle_idv', 'Finish', 400000);
    return '400000';
}

Motor.prototype.motor_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    var objInsurerProduct = this;
    console.log(this.constructor.name, 'motor_vehicle_idv', 'Start', specific_insurer_object);
    var Idv = 0;

    //find method field
    var Db_Coll_Request = myDb.collection('motor_premiums_idvs');
    var Search_Criteria = {};
    Search_Criteria = {
        "Insurer_Id": parseInt(specific_insurer_object['insurer_id']),
        "Vehicle_Id": parseInt(objInsurerProduct.lm_request['vehicle_id']),
        "Rto_Id": parseInt(objInsurerProduct.lm_request['rto_id']),
        "Vehicle_Age_Month": objInsurerProduct.vehicle_age_month(),
        "Idv_By_CRN": 'no'
    };
    if (objInsurerProduct.lm_request['idv_by_crn'] === 'yes') {
        Search_Criteria = {
            "Insurer_Id": parseInt(specific_insurer_object['insurer_id']),
            "PB_CRN": parseInt(objInsurerProduct.lm_request['crn']),
            "Idv_By_CRN": 'yes'
        };
        console.error('DBG', 'idv_by_crn', Search_Criteria);
    }
    //console.error(this.constructor.name, 'motor_vehicle_idv', 'Search_Criteria', Search_Criteria);
    Db_Coll_Request.findOne(Search_Criteria, function (err, Db_Idv_Item) {
        if (Db_Idv_Item) {
            //console.error('motor_vehicle_idv', 'IDV from DB',Db_Idv_Item);
            if (objInsurerProduct.lm_request.hasOwnProperty('vehicle_expected_idv') && (objInsurerProduct.lm_request['vehicle_expected_idv'] - 0) > 0) {
                console.log('Expected IDV in Request');
                var Idv_Validated = objInsurerProduct.motor_check_idv_range(Db_Idv_Item, objInsurerProduct.lm_request['vehicle_expected_idv']);
                Idv = Idv_Validated;
                Db_Idv_Item['Idv_Validated'] = Idv;
            } else {
                console.log(this.constructor.name, 'motor_vehicle_idv', 'Not Expected IDV in Request');
                Idv = Db_Idv_Item.Idv_Min + 100; // Chirag Changed 10 Sep
                //Idv = Db_Idv_Item.Idv_Normal;
                Db_Idv_Item['Idv_Validated'] = Idv;
            }
            objInsurerProduct.motor_vehicle_idv_handler(objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
        } else {
            console.log(this.constructor.name, 'motor_vehicle_idv', 'NO IDV from DB');
            objInsurerProduct.insurer_vehicle_idv(objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback);
        }
    });
    console.log(this.constructor.name, 'motor_vehicle_idv', 'Finish');
    //return idv;
};
Motor.prototype.insurer_vehicle_idv_handler = function (objBreakup, objProduct, Insurer_Object, specific_insurer_object) {
    try {
        var Db_Idv_Item = {};
        var objInsurerProduct = this;
        if (objBreakup) {
            if (objBreakup.hasOwnProperty('Idv_Normal') && objBreakup.Idv_Normal > 0) {
                //console.error('CRN_DEBUG', objProduct.docRequest.Request_Unique_Id, specific_insurer_object, objInsurerProduct.lm_request);
                Db_Idv_Item = {
                    "Motor_Premiums_Idv_Id": "",
                    "PB_CRN": objProduct.docRequest.PB_CRN,
                    "User_Data_Id": parseInt(objInsurerProduct.lm_request['udid']),
                    "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                    "Insurer_Id": parseInt(specific_insurer_object['insurer_id']),
                    "Vehicle_Id": parseInt(objInsurerProduct.lm_request['vehicle_id']),
                    "Rto_Id": parseInt(objInsurerProduct.lm_request['rto_id']),
                    "Vehicle_Age_Month": objInsurerProduct.vehicle_age_month(),
                    "Vehicle_Age_Slab": objInsurerProduct.vehicle_age_slab_month(),
                    "Idv_Normal": objBreakup.Idv_Normal,
                    "Idv_Min": objBreakup.Idv_Min,
                    "Idv_Max": objBreakup.Idv_Max,
                    "Exshowroom": objBreakup.Exshowroom,
                    "Premium_Breakup": null,
                    "Premium_Rate": null,
                    "Addon": null,
                    "Coverage": null,
                    "Idv_By_CRN": objInsurerProduct.lm_request['idv_by_crn'] === 'yes' ? 'yes' : 'no',
                    "Created_On": new Date()
                };
                specific_insurer_object['idv_master'] = Db_Idv_Item;
                var PremiumMethod = this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Premium');
                specific_insurer_object.method = PremiumMethod;
                if (fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
                    specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
                } else {
                    specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
                }
                var User_Data = require('../models/user_data');
                User_Data.findOne({"Request_Unique_Id": objProduct.docRequest.Request_Unique_Id}, function (err, dbUserData) {
                    if (err) {

                    } else {
                        if (dbUserData) {
                            Db_Idv_Item.PB_CRN = dbUserData._doc['PB_CRN'];
                            objInsurerProduct.save_to_db('motor_premiums_idvs', Db_Idv_Item);
                        }
                    }
                });

            }

        }
        objInsurerProduct.motor_vehicle_idv_handler(objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
        console.log('Finish', this.constructor.name, 'insurer_vehicle_idv', Db_Idv_Item);
    } catch (e) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', e);
    }
};
Motor.prototype.motor_vehicle_idv_handler = function (objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {

    var objInsurerProduct = this;
    var Error_Code = '';

    if (Db_Idv_Item) {
        if (Db_Idv_Item.hasOwnProperty('Idv_Validated') && Db_Idv_Item.Idv_Validated > 0) {
            Idv = Db_Idv_Item.Idv_Validated;
        } else if (Db_Idv_Item.hasOwnProperty('Idv_Min') && Db_Idv_Item.Idv_Min > 0) {
            //update on 10-sep Chirag
			if (Db_Idv_Item.Idv_Min === Db_Idv_Item.Idv_Max) {
			Idv = Db_Idv_Item.Idv_Min;
        } else {
				Idv = Db_Idv_Item.Idv_Min + 100;
			}            
        } else {
            Error_Code = 'LM006';
        }
    } else {
        Error_Code = 'LM006';
    }

    if (Error_Code === '') {
        console.log('check', Insurer_Object.Insurer_ID, Idv, Db_Idv_Item.Idv_Min, Db_Idv_Item.Idv_Max, Db_Idv_Item.Idv_Normal);
        var Insurer_Idv = {
            'vehicle_expected_idv': Idv,
            'vehicle_min_idv': Db_Idv_Item.Idv_Min,
            'vehicle_max_idv': Db_Idv_Item.Idv_Max,
            'vehicle_normal_idv': Db_Idv_Item.Idv_Normal,
            'motor_premiums_idv_id': Db_Idv_Item.Motor_Premiums_Idv_Id
        };
        Insurer_Object['Insurer_Idv'] = Insurer_Idv;

        objInsurerProduct.prepared_request['vehicle_expected_idv'] = Idv;
        objInsurerProduct.prepared_request['vehicle_min_idv'] = Db_Idv_Item.Idv_Min;
        objInsurerProduct.prepared_request['vehicle_max_idv'] = Db_Idv_Item.Idv_Max;
        objInsurerProduct.prepared_request['vehicle_normal_idv'] = Db_Idv_Item.Idv_Normal;
        objInsurerProduct.prepared_request['motor_premiums_idv_id'] = Db_Idv_Item.Motor_Premiums_Idv_Id;

        objInsurerProduct.processed_request['___vehicle_expected_idv___'] = Idv;
        objInsurerProduct.processed_request['___motor_premiums_idv_id___'] = Db_Idv_Item.Motor_Premiums_Idv_Id;
        objInsurerProduct.prepared_request['dbmaster_insurer_vehicle_exshowroom'] = Db_Idv_Item.Exshowroom;
        objInsurerProduct.processed_request['___dbmaster_insurer_vehicle_exshowroom___'] = Db_Idv_Item.Exshowroom;

        objInsurerProduct.prepared_request['addon_zero_dep_cover_rate'] = 0;
        objInsurerProduct.processed_request['___addon_zero_dep_cover_rate___'] = 0;
        var Discount_Request = require('../models/discount_request');
        Discount_Request.findOne({"PB_CRN": objInsurerProduct.lm_request['crn'] - 0, 'Insurer_Id': Insurer_Object.Insurer_ID - 0}, null, {sort: {Created_On: -1}}, function (err, dbDiscount_Request) {
            if (err) {

            } else {
                objInsurerProduct.prepared_request['own_damage_disc_rate'] = 65;
                objInsurerProduct.processed_request['___own_damage_disc_rate___'] = 65;
                if ((objInsurerProduct.lm_request['ss_id'] - 0) > -1) {
                    objInsurerProduct.prepared_request['own_damage_disc_rate'] = 70;
                    objInsurerProduct.processed_request['___own_damage_disc_rate___'] = 70;
                }
                /*if (objInsurerProduct.lm_request['vehicle_full'].indexOf('MARUTI') > -1) {
                 objInsurerProduct.prepared_request['own_damage_disc_rate'] = 45;
                 objInsurerProduct.processed_request['___own_damage_disc_rate___'] = 45;
                 }*/
                
				if (objInsurerProduct.lm_request['vehicle_full'].indexOf('MARUTI') > -1) {
                    let OD_DISC = 40;
                    try {
                        if (fs.existsSync(appRoot + "/resource/request_file/United_OD_Discount_Maruti.json")) {
                            let od_maruti = fs.readFileSync(appRoot + "/resource/request_file/United_OD_Discount_Maruti.json").toString();
                            od_maruti = JSON.parse(od_maruti);
                            for (let k in od_maruti) {
                                let fuel = od_maruti[k]['Fuel'];
                                let model = od_maruti[k]['Model'].toString().toUpperCase();
                                if (objInsurerProduct.lm_request['vehicle_full'].indexOf(model) > -1 && objInsurerProduct.lm_request['vehicle_full'].indexOf(fuel) > -1) {
                                    let vehicle_age = objInsurerProduct.vehicle_age_year();
                                    if (objInsurerProduct.lm_request['vehicle_insurance_type'] === 'new') {
                                        OD_DISC = od_maruti[k]['New'];
                                    } else {                                        
                                        if (vehicle_age === 1) {
                                            OD_DISC = od_maruti[k]['1st'];
                                        } else {
                                            OD_DISC = od_maruti[k]['2nd+'];
                                        }
                                    }
                                    //console.error('DBG', 'UNITED_DISC', 'LOOP', OD_DISC, vehicle_age, fuel, model, objInsurerProduct.lm_request['crn'], objInsurerProduct.lm_request['vehicle_full']);
                                    break;
                                }
                            }
                        }
                        //console.error('DBG', 'UNITED_DISC', 'DISC_FINAL', OD_DISC, objInsurerProduct.lm_request['crn'], objInsurerProduct.lm_request['vehicle_full']);
                    } catch (e) {
                        console.error('ERR', 'UNITED_DISC', e.stack);
                    }
                    objInsurerProduct.prepared_request['own_damage_disc_rate'] = OD_DISC;
                    objInsurerProduct.processed_request['___own_damage_disc_rate___'] = OD_DISC;
                }
                if (dbDiscount_Request) {
                    if (dbDiscount_Request._doc['Desired_Discount'] > 0) {
                        objInsurerProduct.prepared_request['own_damage_disc_rate'] = dbDiscount_Request._doc['Desired_Discount'];
                        objInsurerProduct.processed_request['___own_damage_disc_rate___'] = dbDiscount_Request._doc['Desired_Discount'];
                    }
                }


                if (objInsurerProduct.lm_request.hasOwnProperty('policy_od_tenure') &&
                        objInsurerProduct.lm_request['policy_od_tenure'] > 0 &&
                        typeof objInsurerProduct.insurer_vehicle_coverage === "function" &&
                        (objInsurerProduct.lm_request['method_type'] === 'Premium' ||
                                (objInsurerProduct.lm_request['method_type'] === 'Proposal' && objInsurerProduct.lm_request['addon_zero_dep_cover'] === 'yes')
                                )
                        ) {
                    var rate = '0.65';
                    /*if (Db_Idv_Item.Coverage && Db_Idv_Item.Coverage.hasOwnProperty('addon_zero_dep_cover') && false) {
                     if (Db_Idv_Item.Coverage.hasOwnProperty('addon_zero_dep_cover')) {
                     if (Db_Idv_Item.Coverage.addon_zero_dep_cover && Db_Idv_Item.Coverage.addon_zero_dep_cover.hasOwnProperty('rate')) {
                     rate = Db_Idv_Item.Coverage.addon_zero_dep_cover.rate;
                     }
                     }
                     objInsurerProduct.prepared_request['addon_zero_dep_cover_rate'] = rate;
                     objInsurerProduct.processed_request['___addon_zero_dep_cover_rate___'] = rate;
                     objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
                     //Error_Code = 'LM007';
                     
                     }*/
                    if (objInsurerProduct.lm_request['method_type'] === 'Proposal') {
                        if (objInsurerProduct.lm_request.hasOwnProperty('addon_zero_dep_cover_rate')) {
                            rate = objInsurerProduct.lm_request['addon_zero_dep_cover_rate'];
                        }
                        objInsurerProduct.prepared_request['addon_zero_dep_cover_rate'] = rate;
                        objInsurerProduct.processed_request['___addon_zero_dep_cover_rate___'] = rate;
                        var package_secureplus_rate = '0';
                        var package_securepremium_rate = '0';
                        if (Db_Idv_Item.hasOwnProperty('Coverage') && Db_Idv_Item.Coverage !== null) {
                            if (Db_Idv_Item.Coverage.hasOwnProperty('Secure_Plus') && Db_Idv_Item.Coverage.Secure_Plus.hasOwnProperty('rate')) {
                                package_secureplus_rate = Db_Idv_Item.Coverage.Secure_Plus.rate;
                            }
                            if (Db_Idv_Item.Coverage.hasOwnProperty('Secure_Premium') && Db_Idv_Item.Coverage.Secure_Premium.hasOwnProperty('rate')) {
                                package_securepremium_rate = Db_Idv_Item.Coverage.Secure_Premium.rate;
                            }
                        }
                        objInsurerProduct.prepared_request['package_secureplus_rate'] = package_secureplus_rate;
                        objInsurerProduct.processed_request['___package_secureplus_rate___'] = package_secureplus_rate;
                        objInsurerProduct.prepared_request['package_securepremium_rate'] = package_securepremium_rate;
                        objInsurerProduct.processed_request['___package_securepremium_rate___'] = package_securepremium_rate;
                        objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
                    } else {
                        var Client = require('node-rest-client').Client;
                        var client = new Client();
                        var coverage_request = {};
                        for (var k in objInsurerProduct.lm_request) {
                            coverage_request[k] = objInsurerProduct.lm_request[k];
                        }
                        coverage_request['vehicle_expected_idv'] = objInsurerProduct.prepared_request['vehicle_expected_idv'];
                        coverage_request.method_type = 'Coverage';
                        coverage_request.execution_async = 'no';
                        coverage_request.search_reference_number = objProduct.docRequest.Request_Unique_Id;
                        coverage_request.insurer_id = Insurer_Object.Insurer_ID;
                        //coverage_request.addon_package_name = 'Basic';
                        var args = {
                            data: coverage_request,
                            headers: {
                                "Content-Type": "application/json",
                                'client_key': objInsurerProduct.lm_request['client_key'],
                                'secret_key': objInsurerProduct.lm_request['secret_key']
                            }
                        };
                        client.post(config.environment.weburl + '/quote/coverage_initiate', args, function (data, response) {
                            var addon_zero_dep_cover_rate = '0';
                            var package_secureplus_rate = '0';
                            var package_securepremium_rate = '0';
                            if (data.Error_Code === '') {
                                if (typeof data.Coverage.addon_zero_dep_cover !== 'undefined' && typeof data.Coverage.addon_zero_dep_cover.rate !== 'undefined') {
                                    addon_zero_dep_cover_rate = data.Coverage.addon_zero_dep_cover.rate;
                                }
                                if (data.Coverage.hasOwnProperty('Secure_Plus') && typeof data.Coverage.Secure_Plus.rate !== 'undefined') {
                                    package_secureplus_rate = data.Coverage.Secure_Plus.rate;
                                }
                                if (data.Coverage.hasOwnProperty('Secure_Premium') && typeof data.Coverage.Secure_Premium.rate !== 'undefined') {
                                    package_securepremium_rate = data.Coverage.Secure_Premium.rate;
                                }
                            }
                            objInsurerProduct.prepared_request['addon_zero_dep_cover_rate'] = addon_zero_dep_cover_rate;
                            objInsurerProduct.processed_request['___addon_zero_dep_cover_rate___'] = addon_zero_dep_cover_rate;
                            objInsurerProduct.prepared_request['package_secureplus_rate'] = package_secureplus_rate;
                            objInsurerProduct.processed_request['___package_secureplus_rate___'] = package_secureplus_rate;
                            objInsurerProduct.prepared_request['package_securepremium_rate'] = package_securepremium_rate;
                            objInsurerProduct.processed_request['___package_securepremium_rate___'] = package_securepremium_rate;
                            objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
                        });
                    }
                } else if (Insurer_Object.Insurer_ID == 4 && false) {
                    //find method field
                    var dbCollFgDisc = myDb.collection('fg_discounts');
                    //console.error('FGDISCDBG',objInsurerProduct.prepared_request['dbmaster_insurer_vehicle_code'],objInsurerProduct.prepared_request['dbmaster_insurer_rto_city_code']);
                    dbCollFgDisc.findOne({"VehCode": objInsurerProduct.prepared_request['dbmaster_insurer_vehicle_code'], 'Branch': objInsurerProduct.prepared_request['dbmaster_insurer_rto_city_code'].toString()}, function (err, dbFg_Discount) {
                        if (err) {
                            //console.error('FGDISCDBG', 'ERR', err);
                        } else {
                            //console.error('FGDISCDBG', dbFg_Discount);
                            var od_disc_rate = 0;
                            if (dbFg_Discount)
                            {
                                var Age_Vehicle = objInsurerProduct.prepared_request['vehicle_age_year'];
                                if (dbFg_Discount.hasOwnProperty('Age_' + Age_Vehicle) && (dbFg_Discount['Age_' + Age_Vehicle] - 0) > 0) {
                                    od_disc_rate = dbFg_Discount['Age_' + Age_Vehicle] - 0;
                                }
                            }
                            objInsurerProduct.prepared_request['own_damage_disc_rate'] = od_disc_rate;
                            objInsurerProduct.processed_request['___own_damage_disc_rate___'] = od_disc_rate;
                            objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
                        }
                    });
                } else if (Insurer_Object.Insurer_ID == 46) {
                    //find method field
                    var age_slab = {
                        '0': 'Upto_6_Month',
                        '1': 'Upto_1_Year',
                        '2': 'Upto_2_Year',
                        '3': 'Upto_3_Year',
                        '4': 'Upto_4_Year',
                        '5': 'Upto_5_Year',
                        '6': 'Upto_6_Year',
                        '7': 'Upto_7_Year',
                        '8': 'Upto_8_Year',
                        '9': 'Upto_9_Year',
                        '10': 'Upto_10_Year',
                        '11': 'Above_10_Year',
                        '12': 'Above_10_Year',
                        '13': 'Above_10_Year',
                        '14': 'Above_10_Year',
                        '15': 'Above_10_Year'
                    };
                    var dbCollEdDisc = myDb.collection('edelweiss_discounts');
                    dbCollEdDisc.findOne({"MASTER_CODE": objInsurerProduct.prepared_request['dbmaster_insurer_vehicle_code'], 'CITY': objInsurerProduct.prepared_request['dbmaster_insurer_rto_district_code'].toString()}, function (err, dbEd_Discount) {
                        if (err) {
                            //console.error('FGDISCDBG', 'ERR', err);
                        } else {
                            //console.error('FGDISCDBG', dbEd_Discount);
                            var od_disc_rate = 0;
                            if (dbEd_Discount)
                            {
                                var Age_Vehicle = objInsurerProduct.prepared_request['vehicle_age_year'];
                                var slab = age_slab[Age_Vehicle];
                                if (dbEd_Discount.hasOwnProperty(slab)) {
                                    od_disc_rate = dbEd_Discount[slab] - 0;
                                }
                            }
                            objInsurerProduct.prepared_request['own_damage_disc_rate'] = od_disc_rate;
                            objInsurerProduct.processed_request['___own_damage_disc_rate___'] = od_disc_rate;
                            objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
                        }
                    });
                } else if (Insurer_Object.Insurer_ID == 17) {
                    //find method field
                    var moment = require('moment');
                    var vehAgeDay = moment(objInsurerProduct.prepared_request['policy_start_date'], "YYYY-MM-DD").diff(moment(objInsurerProduct.prepared_request['vehicle_registration_date'], "YYYY-MM-DD"), 'days');
                    var vehAgeDay_Start = 0;
                    var vehAgeDay_End = 0;
                    if (vehAgeDay >= 0 && vehAgeDay <= 183) {
                        vehAgeDay_Start = 0;
                        vehAgeDay_End = 183;
                    } else if (vehAgeDay >= 184 && vehAgeDay <= 1094) {
                        vehAgeDay_Start = 184;
                        vehAgeDay_End = 1094;
                    } else if (vehAgeDay >= 1095 && vehAgeDay <= 1824) {
                        vehAgeDay_Start = 1095;
                        vehAgeDay_End = 1824;
                    } else if (vehAgeDay >= 1825 && vehAgeDay <= 2919) {
                        vehAgeDay_Start = 1825;
                        vehAgeDay_End = 2919;
                    } else if (vehAgeDay >= 2920 && vehAgeDay <= 4379) {
                        vehAgeDay_Start = 2920;
                        vehAgeDay_End = 4379;
                    } else if (vehAgeDay >= 4380 && vehAgeDay <= 18250) {
                        vehAgeDay_Start = 4380;
                        vehAgeDay_End = 18250;
                    }
                    var dbCollSBIDisc = myDb.collection('sbi_tw_discount_master');
                    dbCollSBIDisc.findOne({"Make_ID": objInsurerProduct.prepared_request['dbmaster_insurer_vehicle_make_code'], "Model_ID": objInsurerProduct.prepared_request['dbmaster_insurer_vehicle_model_code'], 'RTO_Cluster': objInsurerProduct.prepared_request['dbmaster_insurer_rto_state_code'].toString(), "Age_Para1": vehAgeDay_Start, "Age_Para2": vehAgeDay_End}, function (err, dbEd_Discount) {
                        if (err) {
                            //console.error('FGDISCDBG', 'ERR', err);
                        } else {
                            //console.error('FGDISCDBG', dbEd_Discount);
                            var od_disc_rate = 0;
                            if (dbEd_Discount)
                            {
                                if (dbEd_Discount.hasOwnProperty('Tariff_Discount')) {
                                    od_disc_rate = dbEd_Discount['Tariff_Discount'] - 0;
                                } else {
                                    od_disc_rate = 0;
                                }
                            } else {
                                od_disc_rate = 0;
                            }
                            objInsurerProduct.prepared_request['own_damage_disc_rate'] = od_disc_rate;
                            objInsurerProduct.processed_request['___own_damage_disc_rate___'] = od_disc_rate;
                            objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
                        }
                    });
                } else {
                    objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
                }
            }
        });
    }

    if (Error_Code !== '') {
        var logGuid = objInsurerProduct.create_guid('ARN-');
        var docLog = {
            "Service_Log_Id": "",
            "Service_Log_Unique_Id": logGuid,
            "Request_Id": objProduct.docRequest.Request_Id,
            "User_Data_Id": objProduct.lm_request['udid'] - 0,
            "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
            "PB_CRN": objProduct.docRequest.PB_CRN,
            "Client_Id": objProduct.docRequest.Client_Id,
            "LM_Custom_Request": objInsurerProduct.prepared_request,
            "Status": "complete",
            "Error_Code": Error_Code,
            "Is_Active": 1,
            "Created_On": new Date(),
            "Product_Id": objProduct.db_specific_product.Product_Id,
            "Insurer_Id": Insurer_Object.Insurer_ID,
            "Method_Type": "Premium",
            "Call_Execution_Time": 0
        };
        objInsurerProduct.save_log(docLog);
    }
};

Motor.prototype.get_const_premium_breakup = function () {
    console.log('Start', this.constructor.name, 'get_const_premium_breakup');
    var premium_breakup = this.const_premium_breakup;
    for (var key in premium_breakup) {
        if (typeof premium_breakup[key] === 'object') {
            for (var sub_key in premium_breakup[key]) {
                premium_breakup[key][sub_key] = 0;
            }
        } else {
            premium_breakup[key] = 0;
        }
    }
    return premium_breakup;
};
Motor.prototype.get_const_rate_breakup = function () {
    console.log('Start', this.constructor.name, 'get_const_rate_breakup');
    var rate_breakup = this.const_premium_rate;
    for (var key in rate_breakup) {
        if (typeof rate_breakup[key] === 'object') {
            for (var sub_key in rate_breakup[key]) {
                rate_breakup[key][sub_key] = 0;
            }
        } else {
            rate_breakup[key] = 0;
        }
    }
    return rate_breakup;
};
Motor.prototype.get_const_idv_breakup = function () {
    console.log('Start', this.constructor.name, 'get_const_idv_breakup');
    var idv_breakup = this.const_idv_breakup;
    for (var key in idv_breakup) {
        if (typeof idv_breakup[key] === 'object') {
            for (var sub_key in idv_breakup[key]) {
                idv_breakup[key][sub_key] = 0;
            }
        } else {
            idv_breakup[key] = 0;
        }
    }
    return idv_breakup;
};
Motor.prototype.motor_check_idv_range = function (Db_Idv, Expected_Idv) {
    console.log('Start', this.constructor.name, 'motor_check_idv_range', Db_Idv, Expected_Idv);
    var Validated_Idv = 0;

    if (Expected_Idv <= Db_Idv.Idv_Max && Expected_Idv >= Db_Idv.Idv_Min) {
        Validated_Idv = Expected_Idv;
    } else {
        if (Expected_Idv > Db_Idv.Idv_Max) {
            Validated_Idv = Db_Idv.Idv_Max;
        }
        if (Expected_Idv < Db_Idv.Idv_Min) {
            Validated_Idv = Db_Idv.Idv_Min;
        }
    }

    console.log("Finish", this.constructor.name, 'motor_check_idv_range', Validated_Idv);
    return Validated_Idv;
};
Motor.prototype.motor_report_handler = function (objMaster) {
    console.log('Start', this.constructor.name, 'motor_report_handler');

    try {
        var objMotor = this;

        var objReportFull = [];
        var objReportInvalid = [];
        var is_all_master_processed = false;
        for (var k in objMaster) {
            if (objMaster[k]) {
                is_all_master_processed = true;
            } else {
                is_all_master_processed = false;
                break;
            }
        }
        if (is_all_master_processed === true) {
            //console.log(objMaster.rtos);
            var user_data = require('../models/user_data');
            var today = moment().utcOffset("+05:30").startOf('Day');
            var tomorrow = moment(today).add(1, 'days');
            var yesterday = moment(today).add(-1, 'days');
            var week = moment(today).add(-7, 'days');
            var month = moment(today).add(-30, 'days');
            user_data.find({
                'Product_Id': {$in: [1, 10]},
                "Created_On": {$gt: week.toDate()},
                "Report_Summary": null
            }).exec(function (err, dbUsers) {
                if (!err) {
                    var objSingleReport = {
                        'client': null,
                        'agent': null,
                        'executive': null,
                        'agent_city': null,
                        'product': null,
                        'vehicle_make': null,
                        'vehicle_model': null,
                        'vehicle_full': null,
                        'cc': null,
                        'fuel': null,
                        'rto_code': null,
                        'zone': null,
                        'rto_state': null,
                        'existing_insurer': null,
                        'vehicle_age_month': null,
                        'vehicle_age_year': null,
                        'claim': null,
                        'ncb': null,
                        'ins_type': null
                    };
                    var objProduct = {
                        'prod_1': 'Car',
                        'prod_10': 'TW'
                    }
                    for (var k in dbUsers) {
                        try {
                            user = dbUsers[k]._doc;
                            var Premium_Request = dbUsers[k]._doc['Premium_Request'];
                            objMotor.lm_request = Premium_Request;
                            var indClient = objMaster.clients['client_' + Premium_Request.secret_key];
                            var indVeh = objMaster.vehicles['veh_' + Premium_Request.vehicle_id];
                            var indRto = objMaster.rtos['rto_' + Premium_Request.rto_id];
                            var indInsurer = null;
                            if (Premium_Request.hasOwnProperty('prev_insurer_id') && Premium_Request.prev_insurer_id > 0) {
                                indInsurer = objMaster.insurers['ins_' + Premium_Request.prev_insurer_id];
                            }
                            var cc_slab = '';
                            if (Premium_Request.product_id == 1) {
                                if ((indVeh['Cubic_Capacity'] - 0) < 1000) {
                                    cc_slab = 'Less_than_1000cc';
                                }
                                if ((indVeh['Cubic_Capacity'] - 0) >= 1000 && (indVeh['Cubic_Capacity'] - 0) < 1500) {
                                    cc_slab = '1000cc_to_1500cc';
                                }
                                if ((indVeh['Cubic_Capacity'] - 0) >= 1500) {
                                    cc_slab = 'More_than_1500cc';
                                }
                            }
                            if (Premium_Request.product_id == 10) {
                                if ((indVeh['Cubic_Capacity'] - 0) < 150) {
                                    cc_slab = 'Less_than_150cc';
                                }
                                if ((indVeh['Cubic_Capacity'] - 0) >= 150 && (indVeh['Cubic_Capacity'] - 0) < 350) {
                                    cc_slab = '150_to_350cc';
                                }
                                if ((indVeh['Cubic_Capacity'] - 0) >= 350) {
                                    cc_slab = 'More_than_350cc';
                                }
                            }

                            var expiry_slab = '';


                            var objSingleReport = {
                                'srn': user['Request_Unique_Id'],
                                'client': indClient['Client_Name'],
                                'agent': (indClient['Client_Id'] == 3) ? Premium_Request.posp_first_name + ' ' + Premium_Request.posp_last_name : '',
                                'executive': (indClient['Client_Id'] == 3) ? Premium_Request.posp_reporting_agent_name : '',
                                'agent_city': (indClient['Client_Id'] == 3) ? Premium_Request.posp_agent_city : '',
                                'product': objProduct['prod_' + Premium_Request['product_id']],
                                'vehicle_make': indVeh['Make_Name'],
                                'vehicle_model': indVeh['Model_Name'],
                                'vehicle_full': indVeh['Make_Name'] + '::' + indVeh['Model_Name'] + '::' + indVeh['Variant_Name'],
                                'cc': indVeh['Cubic_Capacity'],
                                'cc_slab': cc_slab,
                                'fuel': indVeh['Fuel_Name'],
                                'rto_code': indRto['VehicleCity_RTOCode'],
                                'zone': indRto['VehicleCity_RTOCode'],
                                'rto_city': indRto['RTO_City'],
                                'rto_state': indRto['VehicleCity_RTOCode'].toString().substr(0, 2),
                                'existing_insurer': (indInsurer) ? indInsurer['Insurer_Code'] : '',
                                'vehicle_age_month': objMotor.vehicle_age_month(),
                                'vehicle_age_slab_month': objMotor.vehicle_age_slab_month(),
                                'vehicle_age_year': objMotor.vehicle_age_year(),
                                'expiry_slab': '',
                                'expiry': Premium_Request['vehicle_expiry_date'],
                                'claim': Premium_Request['is_claim_exists'],
                                'ncb': Premium_Request['vehicle_ncb_current'],
                                'ins_type': Premium_Request['vehicle_insurance_type']
                            };
                            var ObjUser_Data = {
                                'Report_Summary': objSingleReport
                            };
                            var User_Data = require('../models/user_data');
                            User_Data.update({'User_Data_Id': user['User_Data_Id']}, ObjUser_Data, function (err, numAffected) {
                                console.log('UserDataCRNUpdate', err, numAffected);
                            });
                            objReportFull.push(objSingleReport);
                        } catch (ex1) {
                            objReportInvalid.push(Premium_Request);
                            console.error("Exception", 'loop', ex1);
                        }
                    }
                    //console.error(objReportInvalid);
                    console.log('DataCount', objReportFull.length);
                    console.log('Invalid', objReportInvalid.length);

                    objMotor.response.json(objReportFull);
                }
            });
        }
        console.log("Finish", this.constructor.name, 'motor_report_handler');
    } catch (ex) {
        console.error("Exception", this.constructor.name, 'motor_report_handler', ex);
    }
    console.log("Finish", this.constructor.name, 'motor_report_handler');

};
Motor.prototype.motor_tariff_rate = function (processed_request) {
    try {
        console.log('Start', this.constructor.name, 'motor_tariff_rate', processed_request);
        var vehicle_age = processed_request['___vehicle_age_year___'];
        var zone_code = processed_request['___dbmaster_insurer_rto_zone_code___'];
        var idv = parseInt(processed_request['___vehicle_expected_idv___']);
        var cubic_capacity = parseInt(processed_request['___dbmaster_insurer_vehicle_cubiccapacity___']);
        var product_id = processed_request['___product_id___'];
        var vehicle_age_slab = 0;
        var arr_age = [5, 10, 15];
        for (var k in arr_age) {
            if (vehicle_age < arr_age[k]) {
                vehicle_age_slab = arr_age[k];
                break;
            }
        }
        var vehicle_cc_slab = 0;
        var arr_cc = [150, 350, 2000];
        for (var k in arr_cc) {
            if (cubic_capacity < arr_cc[k]) {
                vehicle_cc_slab = arr_cc[k];
                break;
            }
        }
        var obj_motor_tariff_rate = {
            'Product_10': {
                'Age_5': {
                    'Zone_A': {
                        'Cc_150': 1.708,
                        'Cc_350': 1.793,
                        'Cc_2000': 1.879
                    },
                    'Zone_B': {
                        'Cc_150': 1.676,
                        'Cc_350': 1.760,
                        'Cc_2000': 1.844
                    }
                },
                'Age_10': {'Zone_A': {
                        'Cc_150': 1.793,
                        'Cc_350': 1.883,
                        'Cc_2000': 1.973
                    },
                    'Zone_B': {
                        'Cc_150': 1.760,
                        'Cc_350': 1.848,
                        'Cc_2000': 1.936,
                    }},
                'Age_15': {'Zone_A': {
                        'Cc_150': 1.836,
                        'Cc_350': 1.928,
                        'Cc_2000': 2.020,
                    },
                    'Zone_B': {
                        'Cc_150': 1.802,
                        'Cc_350': 1.892,
                        'Cc_2000': 1.982,
                    }},
            },
            'Product_1': {

            }
        };
        var motor_tariff_rate = obj_motor_tariff_rate['Product_' + product_id]['Age_' + vehicle_age_slab]['Zone_' + zone_code]['Cc_' + vehicle_cc_slab];
        return motor_tariff_rate;
    } catch (e) {
        console.error('Exception', this.constructor.name, 'motor_tariff_rate', e);
    }

    console.log("Finish", this.constructor.name, 'motor_tariff_rate', processed_request);

};
Motor.prototype.premium_list_db = function (dbRequestItem, request_unique_id = '', client_id = 0, response_version = '1.0') {
    console.log(this.constructor.name, 'premium_list', 'Start');
    var objMotor = this;
    if (request_unique_id) {
        objMotor.client_id = client_id;
        objMotor.request_unique_id = request_unique_id;
    }
    var Combine_Data = {
        'Request': null,
        'Log': null,
        'Idv': null,
        'Insurer': null,
        'User_Data': null
    };
    var moment = require('moment');
    var StartDateRequest = moment(new Date()), StartDateLog = moment(new Date()), StartDateIdv = moment(new Date()), StartDateInsurer = moment(new Date()), StartDateUser_Data = moment(new Date());
    var Combine_Time = {
        'Request': {'Time': 0},
        'Log': {'Time': 0},
        'Idv': {'Time': 0},
        'Insurer': {'Time': 0},
        'User_Data': {'Time': 0}
    };

    //find method field
    var User_Data = require('../models/user_data');
    User_Data.findOne({"User_Data_Id": objMotor.udid - 0}, function (err, dbUserData) {
        if (err) {

        } else {
            if (dbUserData) {
                var EndDateUser_Data = moment(new Date());
                var Call_Execution_Time_User_Data = EndDateUser_Data.diff(StartDateUser_Data);
                Call_Execution_Time_User_Data = Math.round((Call_Execution_Time_User_Data * 0.001) * 100) / 100;
                Combine_Time.User_Data.Time = Call_Execution_Time_User_Data;

                Combine_Data.User_Data = dbUserData;
                objMotor.premium_list_db_handler(Combine_Data, response_version, Combine_Time);
            }
        }
    });

    //find method field
    if (dbRequestItem) {
        Combine_Data.Request = dbRequestItem;
        var dbCollPremiums = myDb.collection('motor_premiums_idvs');
        var Search_Criteria = {
            'Vehicle_Id': dbRequestItem.Request_Product.vehicle_id,
            'Rto_Id': dbRequestItem.Request_Product.rto_id,
            'Vehicle_Age_Month': dbRequestItem.Request_Product.vehicle_age_month,
            "Idv_By_CRN": 'no'
        };
        if (dbRequestItem.Request_Product['idv_by_crn'] === 'yes') {
            Search_Criteria = {
                "PB_CRN": parseInt(dbRequestItem.Request_Product['crn']),
                "Idv_By_CRN": 'yes'
            };
            console.error('DBG', 'idv_by_crn', Search_Criteria);
        }

        dbCollPremiums.find(Search_Criteria).toArray(function (err, dbIdvItems) {
            if (err) {
                return console.dir(err);
            }
            var EndDateIdv = moment(new Date());
            var Call_Execution_Time_Idv = EndDateIdv.diff(StartDateIdv);
            Call_Execution_Time_Idv = Math.round((Call_Execution_Time_Idv * 0.001) * 100) / 100;
            Combine_Time.Idv.Time = Call_Execution_Time_Idv;

            Combine_Data.Idv = dbIdvItems;
            objMotor.premium_list_db_handler(Combine_Data, response_version, Combine_Time);
        });

        var dbCollLog = myDb.collection('service_logs');
        var cond_service_logs = {'Request_Id': dbRequestItem.Request_Id};
        if (response_version == '1.0') {
            cond_service_logs = {'Request_Unique_Id': dbRequestItem.Request_Unique_Id};
        }
        dbCollLog.find(cond_service_logs).sort({Plan_Id: 1}).toArray(function (err, dbLogItems) {
            if (err) {
                return console.dir(err);
            }
            var EndDateLog = moment(new Date());
            var Call_Execution_Time_Log = EndDateLog.diff(StartDateLog);
            Call_Execution_Time_Log = Math.round((Call_Execution_Time_Log * 0.001) * 100) / 100;
            Combine_Time.Log.Time = Call_Execution_Time_Log;

            Combine_Data.Log = dbLogItems;
            objMotor.premium_list_db_handler(Combine_Data, response_version, Combine_Time);
        });
        let cache_key = 'live_insurer';
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            let cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            let obj_cache_content = JSON.parse(cache_content);
            Combine_Data.Insurer = obj_cache_content;
            objMotor.premium_list_db_handler(Combine_Data, response_version, Combine_Time);

        } else {
            var dbCollInsurer = myDb.collection('insurers');
            dbCollInsurer.find().toArray(function (err, dbInsurerItems) {
                if (err) {
                    return console.dir(err);
                }
                let InsurerMaster = {};
                for (var k in dbInsurerItems) {
                    InsurerMaster['Insurer_' + dbInsurerItems[k]['Insurer_ID']] = dbInsurerItems[k];
                }
                let EndDateInsurer = moment(new Date());
                let Call_Execution_Time_Insurer = EndDateInsurer.diff(StartDateInsurer);
                Call_Execution_Time_Insurer = Math.round((Call_Execution_Time_Insurer * 0.001) * 100) / 100;
                Combine_Time.Insurer.Time = Call_Execution_Time_Insurer;
                fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(InsurerMaster), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                Combine_Data.Insurer = InsurerMaster;
                objMotor.premium_list_db_handler(Combine_Data, response_version, Combine_Time);
            });
        }
    }
    console.log(this.constructor.name, 'premium_list', 'Finish');
}
Motor.prototype.premium_list_db_handler = function (Db_Data_Object, response_version = '1.0', Combine_Time) {
    console.log('Start', 'premium_list_db_handler');
    if (Db_Data_Object.Request && Db_Data_Object.Log && Db_Data_Object.Idv && Db_Data_Object.Insurer && Db_Data_Object.User_Data) {
        //console.error('Log', 'PremiumListDBG', Combine_Time);
        if (response_version === '1.0') {
            this.premium_list_db_handler_version_1(Db_Data_Object);
        }
        if (response_version === '2.0') {
            this.premium_list_db_handler_version_2(Db_Data_Object);
        }
    }
    console.log('Start', 'premium_list_db_handler');
};
Motor.prototype.premium_list_db_handler_version_1 = function (Db_Data_Object) {
    console.log('Start', 'premium_list_db_handler');

    var objMotor = this;
    var arr_premium_response = {
        'Summary': null,
        'Response': []
    };
    arr_premium_response.Summary = Db_Data_Object.Request;

    var actual_time = 0;
    var dbLogItems = Db_Data_Object.Log;
    var Arr_Idv_Min = [], Arr_Idv_Max = [];
    var Common_Addon_List = {};

    var Response_Type = 'QUOTE';
    if (Db_Data_Object.Request.Client_Id == 4) {
        Response_Type = 'QUOTE'
    } else {
        Response_Type = 'FULL';
    }
    var inc = 0;
    for (var k in dbLogItems) {
        if (Db_Data_Object.Request.Client_Id == 5 && dbLogItems[k]['Method_Type'] !== 'Premium') {
            continue;
        }
        if (dbLogItems[k]['Status'] !== 'complete') {
            continue;
        }
        if (dbLogItems[k]['Error_Code'] !== "" && Response_Type === 'QUOTE') {
            continue;
        } else {
            console.log('Prem', dbLogItems[k]['Error_Code']);
        }

        var Filtered_Request = objMotor.insurer_request_filter(dbLogItems[k]['LM_Custom_Request']);
        arr_premium_response['Response'][inc] = {
            "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
            "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'],
            "Method_Type": dbLogItems[k]['Method_Type'],
            "Insurer_Transaction_Identifier": dbLogItems[k]['Insurer_Transaction_Identifier'],
            "Error_Code": dbLogItems[k]['Error_Code'],
            "Created_On": dbLogItems[k]['Created_On'],
            "Product_Id": dbLogItems[k]['Product_Id'],
            "Insurer_Id": dbLogItems[k]['Insurer_Id'],
            "Status": dbLogItems[k]['Status'],
            "Plan_Id": dbLogItems[k]['Plan_Id'],
            "Plan_Name": dbLogItems[k]['Plan_Name'],
            "LM_Custom_Request": Filtered_Request,
            "Premium_Breakup": (dbLogItems[k]['Error_Code'] === "") ? dbLogItems[k]['Premium_Breakup'] : null,
            "Insurer": Db_Data_Object.Insurer['Insurer_' + dbLogItems[k]['Insurer_Id']],
            "Call_Execution_Time": dbLogItems[k]['Call_Execution_Time']
        };
        if (dbLogItems[k]['Error']) {
            arr_premium_response['Response'][inc]['Error'] = dbLogItems[k]['Error'];
        }

        //adddon process
        if (dbLogItems[k]['Error_Code'] === "" && dbLogItems[k].hasOwnProperty('Premium_Breakup')) {
            if (dbLogItems[k]['Premium_Breakup']) {
                var Addon = dbLogItems[k]['Premium_Breakup']['addon'];
                for (var key in Addon) {
                    if (key.indexOf('final') < 0 && (Addon[key] - 0) > 0) {
                        var Addon_Amt = Math.round(Addon[key] - 0);
                        if (!Common_Addon_List.hasOwnProperty(key)) {
                            Common_Addon_List[key] = {
                                'min': 0,
                                'max': 0
                            };
                        }
                        if (Addon_Amt < Common_Addon_List[key]['min'] || Common_Addon_List[key]['min'] === 0) {
                            Common_Addon_List[key]['min'] = Addon_Amt;
                        }


                        if (Addon_Amt > Common_Addon_List[key]['max'] || Common_Addon_List[key]['max'] === 0) {
                            Common_Addon_List[key]['max'] = Addon_Amt;
                        }
                    }
                }
            }
        }

        Arr_Idv_Min.push(Filtered_Request['vehicle_min_idv']);
        Arr_Idv_Max.push(Filtered_Request['vehicle_max_idv']);

        actual_time += dbLogItems[k]['Call_Execution_Time'];
        inc++;
    }
    arr_premium_response.Summary['vehicle_min_idv'] = Math.min.apply(null, Arr_Idv_Min);
    arr_premium_response.Summary['vehicle_max_idv'] = Math.max.apply(null, Arr_Idv_Max);
    arr_premium_response.Summary['Actual_Time'] = actual_time;
    arr_premium_response.Summary['Common_Addon'] = Common_Addon_List;

    objMotor.response_object.json(arr_premium_response);

    console.log('Finish', 'premium_list_db_handler');
};
Motor.prototype.premium_list_db_handler_version_2 = function (Db_Data_Object) {
    var objMotor = this;
    var arr_premium_response = {
        'Error': null,
        'Summary': null,
        'Response': [],
        'Addon_Request': (Db_Data_Object.User_Data.hasOwnProperty('Addon_Request')) ? Db_Data_Object.User_Data.Addon_Request : {}
    };
    try {
        console.log('Start', 'premium_list_db_handler_version_2');

        arr_premium_response.Summary = Db_Data_Object.Request;
		arr_premium_response.Summary.Inprogress_Insurer = {};		
        arr_premium_response.Summary.Request_Unique_Id_Core = Db_Data_Object.Request.Request_Unique_Id;
        arr_premium_response.Summary.Request_Unique_Id = Db_Data_Object.Request.Request_Unique_Id + "_" + Db_Data_Object.User_Data.User_Data_Id;

        var actual_time = 0;
        var dbLogItems = Db_Data_Object.Log;
        var Arr_Idv_Min = [], Arr_Idv_Max = [];
        var Common_Addon_List = {};

        var Response_Type = 'FULL';
        if (Db_Data_Object.Request.Client_Id == 4 || Db_Data_Object.Request.Client_Id == 6) {
            Response_Type = 'QUOTE';
        }
        var All_Insurer_Addon = {};
        var All_Response = {};
        var All_Error = {};
        var All_Log = {};
        var Insurer_Completion_Summary = {};
        var premium_list = [];
        var insurer_cnt = 0;
        let Insurer_Success_Count = 0;
        let Plan_Success_Count = 0;
        let obj_plan_basic = {};
        arr_premium_response['Error_Master'] = {
            'LM001': 'Insurer System Exception',
            'LM002': 'Un-classified Error',
            'LM003': 'Vehicle Not Mapped',
            'LM004': 'RTO Not Mapped',
            'LM005': 'Previous Insurer Not Supported',
            'LM006': 'Vehicle Idv Not available',
            'LM008': 'Vehicle Not Supported By Insurer',
            'LM009': 'Vehicle UW Restriction',
            'LM010': 'RTO UW Restriction',
            'LM013': 'Vehicle RTO UW Restriction',
            'LM271': 'Invalid Vehicle Detail in Insurer Master',
            'LM298': 'Previous Insurer Not Supported',
            'LM215': '10 Years old vehicle not Supported',
			'LM276': 'WRONG OD DISCOUNT',
			'LM283': 'Comprehensive policy Validation on Registration Date'
        };
        let obj_idv_error = {};
        for (let k in dbLogItems) {
            if (dbLogItems[k]['Method_Type'] === 'Idv' && dbLogItems[k]['Error_Code'] !== '' && arr_premium_response['Error_Master'].hasOwnProperty(dbLogItems[k]['Error_Code']) === true) {
                obj_idv_error['Insurer_' + dbLogItems[k]['Insurer_Id']] = arr_premium_response['Error_Master'][dbLogItems[k]['Error_Code']];
            }
            if (dbLogItems[k]['Method_Type'] !== 'Premium') {
                continue;
            }
            if (arr_premium_response.Summary.Request_Core.hasOwnProperty('user_source') && arr_premium_response.Summary.Request_Core.user_source == 'tars') {
                if (dbLogItems[k]['Error_Code'] !== "") {
                    continue;
                }
            }
            let Insurer_Id = dbLogItems[k]['Insurer_Id'] || 0;
			Insurer_Id = Insurer_Id -0;



            //Process insurer completion summary start
            if (typeof Insurer_Completion_Summary['Insurer_' + dbLogItems[k]['Insurer_Id']] === 'undefined') {
                Insurer_Completion_Summary['Insurer_' + dbLogItems[k]['Insurer_Id']] = {'Total': 0, 'Completed': 0, 'Status': 'pending'};
            }
            if (dbLogItems[k]['Status'] === 'complete') {
                Insurer_Completion_Summary['Insurer_' + dbLogItems[k]['Insurer_Id']]['Completed']++;
            }
            Insurer_Completion_Summary['Insurer_' + dbLogItems[k]['Insurer_Id']]['Total']++;
            //Process insurer completion summary end

			
            if (dbLogItems[k]['Status'] === 'pending' && dbLogItems[k]['Error_Code'] === "" && arr_premium_response.Summary.Inprogress_Insurer.hasOwnProperty('Insurer_' + Insurer_Id) === false) {
				arr_premium_response.Summary.Inprogress_Insurer['Insurer_' + Insurer_Id] = Db_Data_Object.Insurer['Insurer_' + Insurer_Id];
			}
            if (dbLogItems[k]['Status'] === 'complete') {
                if (dbLogItems[k]['Error_Code'] === "" && dbLogItems[k]['Premium_Breakup']) {
                    Plan_Success_Count++;
                    if (typeof All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] === 'undefined') {
                        insurer_cnt++;
                        Insurer_Success_Count++;
                        if (dbLogItems[k]['Insurer_Id'] === 10 && (dbLogItems[k]['Method_Type'] === "Idv" || dbLogItems[k]['Method_Type'] === "Premium") && dbLogItems[k]['LM_Custom_Request']['vehicle_expected_idv'] > 0) {
                            dbLogItems[k]['LM_Custom_Request']['vehicle_expected_idv'] = objMotor.idv_changes_royal_sundaram(dbLogItems[k]);
                        }
                        var Filtered_Request = objMotor.insurer_request_filter(dbLogItems[k]['LM_Custom_Request']);
                        All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] = {
                            "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                            "Service_Log_Unique_Id_Core": dbLogItems[k]['Service_Log_Unique_Id'],
                            "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'] + '_' + dbLogItems[k]['Service_Log_Id'] + '_' + Db_Data_Object.User_Data.User_Data_Id,
                            "Insurer_Id": dbLogItems[k]['Insurer_Id'],
                            "Insurer": Db_Data_Object.Insurer['Insurer_' + dbLogItems[k]['Insurer_Id']],
                            "Premium_Breakup": dbLogItems[k]['Premium_Breakup'],
                            "Premium_Rate": (dbLogItems[k].hasOwnProperty('Premium_Rate')) ? dbLogItems[k]['Premium_Rate'] : null,
                            "Addon_List": {},
                            "Addon_Mode": (dbLogItems[k].hasOwnProperty('Addon_Mode')) ? dbLogItems[k]['Addon_Mode'] : 'ALACARTE',
                            "Plan_List": [],
                            "LM_Custom_Request": Filtered_Request,
                            'Completion_Summary': null,
                            'Error_Code': dbLogItems[k]['Error_Code']

                        };
                        obj_plan_basic['Insurer_' + Insurer_Id] = {
                            'Basic': dbLogItems[k]['Premium_Breakup']['own_damage']
                        };

                    } else if (obj_plan_basic.hasOwnProperty('Insurer_' + Insurer_Id)) {
                        obj_plan_basic['Insurer_' + Insurer_Id][dbLogItems[k]['Plan_Name']] = dbLogItems[k]['Premium_Breakup']['own_damage'];
                        }

                    var plan_len = All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Plan_List'].length;

                    var Addon = dbLogItems[k]['Premium_Breakup']['addon'];
                    var Plan_Name = dbLogItems[k]['Plan_Name'];
                    var Plan_Addon = {};
                    try {
                        if ([6, 44].indexOf(Insurer_Id) > -1) { //digit , icici
                            if (Addon.hasOwnProperty('addon_zero_dep_cover') && Addon['addon_zero_dep_cover'] > 0) {
                                let zd_amt = Addon['addon_zero_dep_cover'];
                                let od_final_diff = obj_plan_basic['Insurer_' + Insurer_Id][Plan_Name]['od_final_premium'] - obj_plan_basic['Insurer_' + Insurer_Id]['Basic']['od_final_premium'];
                                console.error('DBG', 'diff_od_rate', 'motor', Insurer_Id, zd_amt, od_final_diff);
                                if (zd_amt > 0 && od_final_diff > 0) {
                                    Addon['addon_zero_dep_cover'] = zd_amt + od_final_diff;
                                }
                            }
                        }
                    } catch (e) {
                        console.error('Exception', 'diff_od_rate', 'motor', Insurer_Id, e.stack);
                    }

                    for (let key in Addon) {
                        if (key.indexOf('final') < 0 && (Addon[key] - 0) > 0) {
                            let Addon_Amt = Math.round(Addon[key] - 0);
                            if (Addon_Amt > 0 && dbLogItems[k]['Insurer_Id'] == 13 && key === 'addon_zero_dep_cover' && All_Response['Insurer_13']['Premium_Breakup']['own_damage']['od_loading'] > 0) {
                                Addon_Amt = Addon_Amt - All_Response['Insurer_13']['Premium_Breakup']['own_damage']['od_loading'] * 1.18;
                            }
                            Plan_Addon[key] = Addon_Amt;
                            //console.log(key,Addon_Amt);
                            All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Addon_List'][key] = Addon_Amt;
                            if (!Common_Addon_List.hasOwnProperty(key)) {
                                Common_Addon_List[key] = {
                                    'min': 0,
                                    'max': 0
                                };
                            }
                            if (Addon_Amt < Common_Addon_List[key]['min'] || Common_Addon_List[key]['min'] === 0) {
                                Common_Addon_List[key]['min'] = Addon_Amt;
                            }
                            if (Addon_Amt > Common_Addon_List[key]['max'] || Common_Addon_List[key]['max'] === 0) {
                                Common_Addon_List[key]['max'] = Addon_Amt;
                            }
                            //dbLogItems[k]['Premium_Breakup']['addon'][key] = 0;
                        }
                    }


                    
                        dbLogItems[k]['Premium_Breakup']['net_premium'] = (dbLogItems[k]['Premium_Breakup']['own_damage']['od_final_premium'] - 0) + (dbLogItems[k]['Premium_Breakup']['liability']['tp_final_premium'] - 0);
                    
                    dbLogItems[k]['Premium_Breakup']['service_tax'] = dbLogItems[k]['Premium_Breakup']['net_premium'] * 0.18;
                    dbLogItems[k]['Premium_Breakup']['final_premium'] = Math.round(dbLogItems[k]['Premium_Breakup']['net_premium'] + dbLogItems[k]['Premium_Breakup']['service_tax']);
                    if (dbLogItems[k]['Premium_Breakup']['final_premium'] > 0) {
                        premium_list.push(dbLogItems[k]['Premium_Breakup']['final_premium']);
                    }
                    All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Plan_List'][plan_len] = {
                        "Plan_Id": dbLogItems[k]['Plan_Id'],
                        "Plan_Name": dbLogItems[k]['Plan_Name'],
                        "Plan_Schema": dbLogItems[k]['Plan_Addon_List'],
                        "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                        "Service_Log_Unique_Id_Core": dbLogItems[k]['Service_Log_Unique_Id'],
                        "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'] + '_' + dbLogItems[k]['Service_Log_Id'] + '_' + Db_Data_Object.User_Data.User_Data_Id,
                        "Insurer_Transaction_Identifier": dbLogItems[k]['Insurer_Transaction_Identifier'],
                        'Plan_Addon_Breakup': Plan_Addon,
                        'Plan_Addon_Premium': dbLogItems[k]['Premium_Breakup']['addon']['addon_final_premium'],
						'Full_Premium_Breakup' : dbLogItems[k]['Premium_Breakup']
                    };
                    delete dbLogItems[k]['Premium_Breakup']['addon'];
                    Arr_Idv_Min.push(dbLogItems[k]['LM_Custom_Request']['vehicle_min_idv']);
                    Arr_Idv_Max.push(dbLogItems[k]['LM_Custom_Request']['vehicle_max_idv']);
                    actual_time += dbLogItems[k]['Call_Execution_Time'];
                } else {
                    if (arr_premium_response['Error_Master'].hasOwnProperty(dbLogItems[k]['Error_Code']) === true) {
                        if (typeof All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] === 'undefined') {
                            insurer_cnt++;
                            All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] = {
                                "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                                "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'],
                                "Insurer_Id": dbLogItems[k]['Insurer_Id'],
                                "Insurer": Db_Data_Object.Insurer['Insurer_' + dbLogItems[k]['Insurer_Id']],
                                "Premium_Breakup": null,
                                "Addon_List": {},
                                "Plan_List": [],
                                "LM_Custom_Request": null,
                                'Completion_Summary': null,
                                'Error_Code': dbLogItems[k]['Error_Code'],
                                'Error_Msg': arr_premium_response['Error_Master'][dbLogItems[k]['Error_Code']] || ''
                            };
                            if (dbLogItems[k]['Error_Code'] === 'LM006') {
                                let idv_error = obj_idv_error['Insurer_' + dbLogItems[k]['Insurer_Id']] || 'Not in Master';
                                All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Error_Msg'] = All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Error_Msg'] + ' - ' + idv_error;
                        }
                    }
                     }
                }
            }

        }
        var Final_All_Response = [];
        for (var k in All_Response) {
            if (Insurer_Completion_Summary.hasOwnProperty('Insurer_' + All_Response[k]['Insurer_Id'])) {
                if (Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']].Total > 0 && Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']].Total === Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']].Completed) {
                    Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']].Status = 'complete';
                }
				
                All_Response[k]['Completion_Summary'] = Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']];
            }
			if(arr_premium_response.Summary.Inprogress_Insurer.hasOwnProperty('Insurer_' + All_Response[k]['Insurer_Id'])){
				delete arr_premium_response.Summary.Inprogress_Insurer['Insurer_' + All_Response[k]['Insurer_Id']];
			}
            Final_All_Response.push(All_Response[k]);
        }

        arr_premium_response['Response'] = Final_All_Response;
        arr_premium_response.Summary['Created_On'] = (new Date(arr_premium_response.Summary['Created_On'])).toLocaleString();
        arr_premium_response.Summary['vehicle_min_idv'] = Math.min.apply(null, Arr_Idv_Min) || 0;
        arr_premium_response.Summary['vehicle_max_idv'] = Math.max.apply(null, Arr_Idv_Max) || 0;
        arr_premium_response.Summary['Actual_Time'] = actual_time;
        arr_premium_response.Summary['Idv_Min'] = Math.min.apply(null, Arr_Idv_Min) || 0;
        arr_premium_response.Summary['Idv_Max'] = Math.max.apply(null, Arr_Idv_Max) || 0;
        arr_premium_response.Summary['Premium_Min'] = Math.min.apply(null, premium_list);
        arr_premium_response.Summary['Premium_Max'] = Math.max.apply(null, premium_list);
        arr_premium_response.Summary['Insurer_Cnt'] = insurer_cnt;
        arr_premium_response.Summary['Insurer_Success_Count'] = Insurer_Success_Count;
        arr_premium_response.Summary['Plan_Success_Count'] = Plan_Success_Count;
        arr_premium_response.Summary['Actual_Time'] = actual_time;
        arr_premium_response.Summary['Common_Addon'] = Common_Addon_List;
        arr_premium_response.Summary['Last_Status'] = Db_Data_Object['User_Data'].Last_Status;

        //pref insurer list------------ START---> Khushbu Gite 22/10/2020 
        if (arr_premium_response.Summary['Request_Core']['product_id'] === 1 || arr_premium_response.Summary['Request_Core']['product_id'] === 10) {
            var prefhtml = fs.readFileSync(appRoot + "/resource/request_file/PreferredInsurerList.json", 'utf8');
            var prefJSON = JSON.parse(prefhtml);
            var pref_arr = [];
            var fuel = "";
            var cc = "";
            var vehicle_ins_type = arr_premium_response.Summary['Request_Core']['vehicle_insurance_subtype'];
            var productid = arr_premium_response.Summary['Request_Core']['product_id'];
            var claim = arr_premium_response.Summary['Request_Core']['is_claim_exists'] === "yes" ? "ncb_yes" : "ncb_no";
            if (productid === 10) {
                fuel = arr_premium_response.Summary['Request_Core']['vehicle_full'].split('|')[3].toLowerCase() === "petrol" ? "petrol" : "other";
                cc = parseInt(arr_premium_response.Summary['Request_Core']['vehicle_full'].split('|')[4]) > 200 ? "highend" : "other";
            } else {
                fuel = arr_premium_response.Summary['Request_Core']['vehicle_full'].split('|')[3].toLowerCase() === "diesel" ? "diesel" : "other";
                cc = parseInt(arr_premium_response.Summary['Request_Core']['vehicle_full'].split('|')[4]) > 2000 ? "highend" : "other";
            }
            var objJson = prefJSON[productid];
            if (vehicle_ins_type === "1OD_0TP") {
                pref_arr = objJson["saod"];
            } else {
                pref_arr = objJson[cc][fuel][claim];
            }
            arr_premium_response.Summary['Prefered_Insurer_list'] = pref_arr;
        }

        // END

        if (Db_Data_Object.User_Data._doc.hasOwnProperty('Addon_Request')) {
            arr_premium_response.Summary.Addon_Request = Db_Data_Object.User_Data._doc.Addon_Request;
        }

        var ObjUser_Data = {
            'Premium_List': arr_premium_response,
            'Insurer_Success_Count': Insurer_Success_Count,
            'Plan_Success_Count': Plan_Success_Count
        };
        var User_Data = require('../models/user_data');
        User_Data.update({'User_Data_Id': objMotor.udid - 0}, {$set: ObjUser_Data}, function (err, numAffected) {
            console.log('premium_db_list', 'user_data', err, numAffected);
        });

    } catch (e) {
        console.error('Exception', 'premium_list_db_handler_version_2', e);
        arr_premium_response.Error = e.stack;
    }
    objMotor.response_object.json(arr_premium_response);
};
Motor.prototype.idv_changes_royal_sundaram = function (Db_Data_Object) {
    var objMotor = this;
    var arr_premium_response = {
        'Error': null,
        'Summary': null,
        'Response': []
    };
    try {
        console.log('Start', 'idv_changes_royal_sundaram');
        var ch_flag = ((parseInt(((Db_Data_Object.LM_Custom_Request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
        if (ch_flag || Db_Data_Object.LM_Custom_Request['Plan_Name'] === "OD") {
            var first_step_flag = false;
            if (parseInt(Db_Data_Object.LM_Custom_Request['vehicle_expected_idv']) === parseInt(Db_Data_Object.LM_Custom_Request['vehicle_max_idv'])) {
                first_step_flag = true;
            }
            if (parseInt(Db_Data_Object.LM_Custom_Request['vehicle_expected_idv']) === parseInt(Db_Data_Object.LM_Custom_Request['vehicle_min_idv'])) {
                first_step_flag = true;
            }
            if (first_step_flag) {
                return (parseInt(Db_Data_Object.LM_Custom_Request['vehicle_expected_idv']));
            } else {
                if (parseInt(Db_Data_Object.LM_Custom_Request['vehicle_expected_idv']) !== parseInt(Db_Data_Object.LM_Custom_Request['vehicle_normal_idv'])) {
                    var inc_dec_amount = '';
                    var inc_dec_percent = '';
                    var increase_flag = false;
                    var next_step_flag = false;
                    if ((parseInt(Db_Data_Object.LM_Custom_Request['vehicle_expected_idv']) > parseInt(Db_Data_Object.LM_Custom_Request['vehicle_normal_idv'])) 
                            && (parseInt(Db_Data_Object.LM_Custom_Request['vehicle_expected_idv']) <= parseInt(Db_Data_Object.LM_Custom_Request['vehicle_max_idv']))) {
                        increase_flag = true;
                        next_step_flag = true;
                        inc_dec_amount = parseInt(Db_Data_Object.LM_Custom_Request['vehicle_expected_idv']) - parseInt(Db_Data_Object.LM_Custom_Request['vehicle_normal_idv']);
                        inc_dec_percent = parseInt(inc_dec_amount) / parseInt(Db_Data_Object.LM_Custom_Request['vehicle_normal_idv']) * 100;
                    }
                    if ((parseInt(Db_Data_Object.LM_Custom_Request['vehicle_expected_idv']) < parseInt(Db_Data_Object.LM_Custom_Request['vehicle_normal_idv'])) 
                            && (parseInt(Db_Data_Object.LM_Custom_Request['vehicle_expected_idv']) >= parseInt(Db_Data_Object.LM_Custom_Request['vehicle_min_idv']))) {
                        increase_flag = false;
                        next_step_flag = true;
                        inc_dec_amount = parseInt(Db_Data_Object.LM_Custom_Request['vehicle_normal_idv']) - parseInt(Db_Data_Object.LM_Custom_Request['vehicle_expected_idv']);
                        inc_dec_percent = parseInt(inc_dec_amount) / parseInt(Db_Data_Object.LM_Custom_Request['vehicle_normal_idv']) * 100;
                    }
                    if (next_step_flag) {
                        var check_result = (inc_dec_percent - Math.floor(inc_dec_percent)) !== 0;
                        if (check_result) {
                            inc_dec_percent = parseInt(inc_dec_percent);
                            var percent_multiple = '';
                            if (increase_flag === true) {
                                percent_multiple = (inc_dec_percent / 100) + 1;
                                return (parseInt(parseInt(Db_Data_Object.LM_Custom_Request['vehicle_normal_idv']) * percent_multiple));
                            } else {
                                percent_multiple = (inc_dec_percent / 100);
                                return ((parseInt(Db_Data_Object.LM_Custom_Request['vehicle_normal_idv'])) - (parseInt(parseInt(Db_Data_Object.LM_Custom_Request['vehicle_normal_idv']) * percent_multiple)));
                            }
                        } else {
                            return (parseInt(Db_Data_Object.LM_Custom_Request['vehicle_expected_idv']));
                        }
                    }
                } else {
                    return (parseInt(Db_Data_Object.LM_Custom_Request['vehicle_expected_idv']));
                }
            }
        }
    } catch (e) {
        console.error('Exception', 'idv_changes_royal_sundaram', e);
        arr_premium_response.Error = e.stack;
    }
};
module.exports = Motor;

