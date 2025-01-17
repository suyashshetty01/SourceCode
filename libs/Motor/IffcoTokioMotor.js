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

function IffcoTokioMotor() {

}
util.inherits(IffcoTokioMotor, Motor);

IffcoTokioMotor.prototype.lm_request_single = {};
IffcoTokioMotor.prototype.insurer_integration = {};
IffcoTokioMotor.prototype.insurer_addon_list = [];
IffcoTokioMotor.prototype.insurer = {};
IffcoTokioMotor.prototype.insurer_master = {};
IffcoTokioMotor.prototype.insurer_date_format = 'MM/dd/yyyy';


IffcoTokioMotor.prototype.insurer_product_api_pre = function () {

};
IffcoTokioMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        var objZeroReplace = ['electrical_accessory', 'non_electrical_accessory'];
        console.log(this.insurer_lm_request);
        this.prepared_request['crn'] = this.insurer_lm_request['crn'];
        this.processed_request['___crn___'] = this.prepared_request['crn'];

        this.prepared_request['timestamp'] = this.timestamp();
        this.processed_request['___timestamp___'] = this.prepared_request['timestamp'];

        var objRequest = this.insurer_lm_request;
        var obj_replace = {};
        objZeroReplace.forEach(function (element) {
            console.log(element.toString());
            if (objRequest[element] === '' || objRequest[element] === '0') {
                obj_replace['___' + element + '___'] = '0';
            }
        });

        var ch_flag = ((parseInt(((this.lm_request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
        if (this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && ch_flag && (parseInt(this.prepared_request['vehicle_age_year']) > 10)) {
            this.method_content = "";
        }
        if (this.lm_request['method_type'] === 'Proposal' && this.lm_request['registration_no_1'] === "DL") {
            if (this.lm_request['registration_no_3'].toString().length > 2 && this.lm_request['registration_no_2'].split('')[0] == "0") {
                let reg_no_2 = this.lm_request['registration_no_2'].toString();
                let reg_no_3 = this.lm_request['registration_no_3'].toString();
                let reg_no_2_temp = reg_no_2.replace('0', '');
                let reg_no_3_temp = reg_no_3.split('');
                reg_no_2 = reg_no_2_temp + reg_no_3_temp[0];
                reg_no_3 = reg_no_3_temp[1] + reg_no_3_temp[2];
                this.prepared_request['registration_no_2'] = reg_no_2;
                this.processed_request['___registration_no_2___'] = this.prepared_request['registration_no_2'];
                this.prepared_request['registration_no_3'] = reg_no_3;
                this.processed_request['___registration_no_3___'] = this.prepared_request['registration_no_3'];
            }
        }
        if (this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && ch_flag) {
            var someStartDate = new Date(this.prepared_request['policy_start_date']);
            someStartDate.setDate(someStartDate.getDate() + 2);
            var startDateFormated = (someStartDate.toISOString().substr(0, 10)).split('-');
            var start_date = startDateFormated[1] + '/' + startDateFormated[2] + '/' + startDateFormated[0];
            this.prepared_request['policy_start_date'] = start_date;
            this.processed_request['___policy_start_date___'] = this.prepared_request['policy_start_date'];

            var someEndDate = new Date(this.prepared_request['policy_end_date']);
            someEndDate.setDate(someEndDate.getDate() + 2);
            var endDateFormated = (someEndDate.toISOString().substr(0, 10)).split('-');
            var end_date = endDateFormated[1] + '/' + endDateFormated[2] + '/' + endDateFormated[0];
            this.prepared_request['policy_end_date'] = end_date;
            this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];

            if (this.lm_request['is_policy_exist'] === "no") {
                this.prepared_request['policy_expiry_date'] = '';
                this.processed_request['___policy_expiry_date___'] = this.prepared_request['policy_expiry_date'];
                this.processed_request['___vehicle_ncb_current___'] = '0';
                this.processed_request['___vehicle_ncb_next___'] = '0';
                this.processed_request['___premium_breakup_od_disc_ncb___'] = '0';
            }

            if (this.lm_request['method_type'] === 'Proposal') {
                if (this.prepared_request.hasOwnProperty('communication_state')) {
                    if (this.prepared_request['communication_state'] === "MAHARASHTRA") {
                        this.prepared_request['communication_state_code'] = 'MAH';
                        this.processed_request['___communication_state_code___'] = this.prepared_request['communication_state_code'];
                    }
                }
                if (this.lm_request['is_inspection_done'] === 'no') {
                    var customer_name = "";
                    var vehicle_registration_number = "";
                    if (this.lm_request['middle_name'] !== '') {
                        customer_name = this.prepared_request['first_name'] + ' ' + this.prepared_request['middle_name'] + ' ' + this.prepared_request['last_name'];
                    } else {
                        customer_name = this.prepared_request['first_name'] + ' ' + this.prepared_request['last_name'];
                    }
                    vehicle_registration_number = this.lm_request['registration_no_1'] + this.lm_request['registration_no_2'] + this.lm_request['registration_no_3'] + this.lm_request['registration_no_4'];
                    var args = {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": "Bearer " + this.prepared_request['insurer_integration_service_user']
                        },
                        url: this.method['Service_URL'],
                        form: {
                            customer_name: customer_name,
                            customer_phone_number: this.prepared_request['mobile'],
                            vehicle_number: vehicle_registration_number,
                            vehicle_type: '4-wheeler',
                            purpose_of_inspection: 'break_in',
                            quote_number: '',
                            inspection_number: this.prepared_request['crn'],
                            chassis_number: this.prepared_request['chassis_number'],
                            engine_number: this.prepared_request['engine_number']
                        }
                    };
                    this.method_content = JSON.stringify(args);
                }
                if (this.lm_request['is_inspection_done'] === 'yes') {
                    this.prepared_request['inspection_date'] = this.lm_request['iffco_inspection_date'];
                    this.processed_request['___inspection_date___'] = this.prepared_request['inspection_date'];
                    //this.prepared_request['inspection_id'] = this.lm_request['insurer_transaction_identifier'];
                    this.prepared_request['inspection_id'] = this.lm_request['iffco_inspection_id'];
                    this.processed_request['___inspection_id___'] = this.prepared_request['inspection_id'];
                    if (this.lm_request['is_policy_exist'] === "yes") {
                        var breakin_days = parseInt(this.noOfDaysDifference(this.lm_request['policy_expiry_date']));
                        if (breakin_days > 90) {
                            this.prepared_request['is_policy_exist_2'] = 'Y';
                            this.processed_request['___is_policy_exist_2___'] = this.prepared_request['is_policy_exist_2'];
                        } else {
                            this.prepared_request['is_policy_exist_2'] = 'N';
                            this.processed_request['___is_policy_exist_2___'] = this.prepared_request['is_policy_exist_2'];
                        }
                    } else {
                        this.prepared_request['is_policy_exist_2'] = 'Y';
                        this.processed_request['___is_policy_exist_2___'] = this.prepared_request['is_policy_exist_2'];
                        this.prepared_request['pre_policy_start_date'] = '';
                        this.processed_request['___pre_policy_start_date___'] = this.prepared_request['pre_policy_start_date'];
                        this.prepared_request['dbmaster_previousinsurer_code'] = '';
                        this.processed_request['___dbmaster_previousinsurer_code___'] = this.prepared_request['dbmaster_previousinsurer_code'];
                        this.prepared_request['previous_policy_number'] = '';
                        this.processed_request['___previous_policy_number___'] = this.prepared_request['previous_policy_number'];
                    }
                    this.method_content = this.method_content.replace('___inspection_date___', this.processed_request['___inspection_date___']);
                    this.method_content = this.method_content.replace('___inspection_id___', this.processed_request['___inspection_id___']);
                    this.method_content = this.method_content.replace('___is_policy_exist_2___', this.processed_request['___is_policy_exist_2___']);
                    this.method_content = this.method_content.replace('<!--INSPECTION_START-->', '');
                    this.method_content = this.method_content.replace('<!--INSPECTION_FINISH-->', '');
                }
            }
        } else {
            if (this.lm_request['method_type'] === 'Proposal') {
                var txt_replace1 = this.find_text_btw_key(this.method_content, '<!--INSPECTION_START-->', '<!--INSPECTION_FINISH-->', true);
                if (txt_replace1) {
                    this.method_content = this.method_content.replace(txt_replace1, '');
                }
            }
        }

        if (this.lm_request['vehicle_registration_type'] === 'corporate') {
            this.method_content = this.method_content.replace('___vehicle_registration_type___', 'C');

            if (this.lm_request['method_type'] === 'Proposal') {
                var company_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--INDIVIDUAL_START-->', '<!--INDIVIDUAL_FINISH-->', false);
                this.method_content = this.method_content.replace(company_request_data, '');

                this.prepared_request['company_name'] = this.lm_request['company_name'];
                this.processed_request['___company_name___'] = this.prepared_request['company_name'];
                this.prepared_request['email'] = this.lm_request['company_contact_person_email'];
                this.processed_request['___email___'] = this.prepared_request['email'];
                this.prepared_request['mobile'] = this.lm_request['company_contact_person_mobile'];
                this.processed_request['___mobile___'] = this.prepared_request['mobile'];
                this.method_content = this.method_content.replace('___nominee_name___', 'DOLLY GUPTA');
                this.method_content = this.method_content.replace('___nominee_relation___', 'Spouse');
                this.method_content = this.method_content.replace('___salutation___', '');
                this.method_content = this.method_content.replace('___first_name___', '');
                this.method_content = this.method_content.replace('___middle_name___', '');
                this.method_content = this.method_content.replace('___last_name___', '');
                this.method_content = this.method_content.replace('___birth_date___', '');
                this.method_content = this.method_content.replace('___occupation___', '');
                this.method_content = this.method_content.replace('___gst_no___', this.lm_request['company_gst_no']);
                this.method_content = this.method_content.replace('___email___', this.lm_request['company_contact_person_email']);
                this.method_content = this.method_content.replace('___mobile___', this.lm_request['company_contact_person_mobile']);
            }
        } else {
            this.method_content = this.method_content.replace('___vehicle_registration_type___', '');
            this.method_content = this.method_content.replace('<CorporateClient>Y</CorporateClient>', '');
        }

        if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
            if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal') {
                this.method_content = this.method_content.replace('<q1:type />', '<q1:type>OD</q1:type>');
                var txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Coverage_PA_OD_Start-->', '<!--Coverage_PA_OD_End-->', true);
                if (txt_replace1) {
                    this.method_content = this.method_content.replace(txt_replace1, '');
                }
                var txt_replace2 = this.find_text_btw_key(this.method_content, '<!--Coverage_TPPD_TW_Start-->', '<!--Coverage_TPPD_TW_End-->', true);
                if (txt_replace2) {
                    this.method_content = this.method_content.replace(txt_replace2, '');
                }
                var txt_replace3 = this.find_text_btw_key(this.method_content, '<!--Coverage_LLPD_TW_Start-->', '<!--Coverage_LLPD_TW_End-->', true);
                if (txt_replace3) {
                    this.method_content = this.method_content.replace(txt_replace3, '');
                }
                var txt_replace4 = this.find_text_btw_key(this.method_content, '<!--Coverage_PA_UNNamed_Start-->', '<!--Coverage_PA_UNNamed_End-->', true);
                if (txt_replace4) {
                    this.method_content = this.method_content.replace(txt_replace4, '');
                }
            }
            if (this.lm_request['method_type'] === 'Proposal') {
                this.method_content = this.method_content.replace('___premium_breakup_tp_final_premium___', '0');
                this.method_content = this.method_content.replace('___premium_breakup_tp_cng_lpg___', '');
                this.method_content = this.method_content.replace('___premium_breakup_tp_basic___', '');
                this.method_content = this.method_content.replace('<policyType>___product_id___</policyType>', '<PolicyType>OD</PolicyType>');
                this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                this.prepared_request['tp_start_date'] = this.insurer_dateFormat(this.lm_request['tp_start_date']);
                this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
                this.prepared_request['tp_end_date'] = this.insurer_dateFormat(this.lm_request['tp_end_date']);
                this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
                this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Code'];
                this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
            }
        } else {
            var txt_replace1 = this.find_text_btw_key(this.method_content, '<!--ODONLY_START-->', '<!--ODONLY_FINISH-->', true);
            if (txt_replace1) {
                this.method_content = this.method_content.replace(txt_replace1, '');
            }
        }

        if (this.lm_request['method_type'] === 'Proposal') {
            if (this.lm_request['middle_name'] !== '') {
                this.method_content = this.method_content.replace('___first_name___', this.lm_request['first_name'] + " " + this.lm_request['middle_name']);
            }
            var obj_premium_breakup = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup'];
            if (this.lm_request['addon_zero_dep_cover'] === 'no') {
                for (var k in obj_premium_breakup['addon']) {
                    obj_premium_breakup['addon'][k] = 0;
                }
                obj_premium_breakup['net_premium'] = obj_premium_breakup['own_damage']['od_final_premium'] + obj_premium_breakup['liability']['tp_final_premium'];
                obj_premium_breakup['service_tax'] = (obj_premium_breakup['net_premium'] * 0.18).toFixed(2);
                obj_premium_breakup['final_premium'] = obj_premium_breakup['net_premium'] + obj_premium_breakup['service_tax'];

                var txt_replace = this.find_text_btw_key(this.method_content, '<!--addon_zero_dep_cover_start-->', '<!--addon_zero_dep_cover_end-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
            }
            for (var k in obj_premium_breakup) {
                if (typeof obj_premium_breakup[k] === 'object') {
                    for (var k1 in obj_premium_breakup[k]) {
                        if (k1.indexOf('_disc') > -1) {
                            obj_replace['___premium_breakup_' + k1 + '___'] = (0 - obj_premium_breakup[k][k1]).toFixed(2);
                        } else {
                            obj_replace['___premium_breakup_' + k1 + '___'] = (obj_premium_breakup[k][k1]).toFixed(2);
                        }
                    }
                } else {
                    obj_replace['___premium_breakup_' + k + '___'] = obj_premium_breakup[k];
                }
            }

            obj_replace['___premium_breakup_gross_premium___'] = obj_premium_breakup['liability']['tp_final_premium'] + obj_premium_breakup['addon']['addon_final_premium'] + obj_premium_breakup['own_damage']['od_final_premium'];
            var servicetax = (obj_premium_breakup['liability']['tp_final_premium'] + obj_premium_breakup['addon']['addon_final_premium'] + obj_premium_breakup['own_damage']['od_final_premium']) * 0.18;
            obj_replace['___premium_breakup_service_tax___'] = servicetax;
            obj_replace['___premium_breakup_final_premium___'] = obj_premium_breakup['liability']['tp_final_premium'] + obj_premium_breakup['addon']['addon_final_premium'] + obj_premium_breakup['own_damage']['od_final_premium'] + servicetax;

            var getMotorPremiumReturn = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['getMotorPremiumReturn'][0];
            obj_replace['___premium_breakup_od_loading___'] = getMotorPremiumReturn['discountLoading'][0];
            obj_replace['___final_premium___'] = getMotorPremiumReturn['premiumPayable'][0];
            this.prepared_request['vehicle_expected_idv_2'] = this.prepared_request['vehicle_expected_idv'] + parseInt(this.lm_request['electrical_accessory']) + parseInt(this.lm_request['non_electrical_accessory']) + parseInt(this.lm_request['external_bifuel_value']);
            this.processed_request['___vehicle_expected_idv_2___'] = this.prepared_request['vehicle_expected_idv_2'];

            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.prepared_request['registration_no_1'] = 'NEW';
                this.processed_request['___registration_no_1___'] = 'NEW';
                this.prepared_request['registration_no_2'] = '';
                this.processed_request['___registration_no_2___'] = '';
                this.prepared_request['registration_no_3'] = '';
                this.processed_request['___registration_no_3___'] = '';
                this.prepared_request['registration_no_4'] = '0001';
                this.processed_request['___registration_no_4___'] = '0001';
            }

            if (this.lm_request['addon_zero_dep_cover'] === 'yes' && parseInt(this.prepared_request['addon_zero_dep_cover_amt']) > 0) {
                this.processed_request['___addon_zero_dep_cover_amt___'] = this.prepared_request['addon_zero_dep_cover_amt'];
            } else {
                this.processed_request['___addon_zero_dep_cover_amt___'] = "";
            }
        }

        if (Object.keys(obj_replace).length > 0) {
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }

        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--vehicle_ncb_current_start-->', '<!--vehicle_ncb_current_finish-->', true);
            if (txt_replace) {
                this.method_content = this.method_content.replace(txt_replace, '');
            }
        }
        if (this.lm_request['product_id'] === 10) {
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--Coverage_LLPD_TW_Start-->', '<!--Coverage_LLPD_TW_End-->', true);
            if (txt_replace) {
                this.method_content = this.method_content.replace(txt_replace, '');
            }
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--Coverage_CNG_TW_Start-->', '<!--Coverage_CNG_TW_End-->', true);
            if (txt_replace) {
                this.method_content = this.method_content.replace(txt_replace, '');
            }
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--Coverage_CNG_TW_Val_Start-->', '<!--Coverage_CNG_TW_Val_End-->', true);
            if (txt_replace) {
                this.method_content = this.method_content.replace(txt_replace, '');
            }
        }

        /*let addon_zd_age = this.vehicle_age_year();
         if (addon_zd_age < 6) {
         if (this.lm_request['addon_zero_dep_cover'] === 'yes') {
         } else {
         this.method_content = this.method_content.replace('<attr1></attr1>', '');
         }
         } else {
         this.method_content = this.method_content.replace('<q1:attr1></q1:attr1>', '');
         if (this.lm_request['addon_zero_dep_cover'] === 'yes') {
         this.method_content = this.method_content.replace('<attr1></attr1>', '');
         }
         }*/
        //console.log('IFFCO Tokio - addon_zd_age : ', this.method_content);

        if (this.processed_request['___external_bifuel_value___'] - 0 > 0) {
            this.prepared_request['external_bifuel_type_2'] = 'N';
            this.processed_request['___external_bifuel_type_2___'] = this.prepared_request['external_bifuel_type_2'];
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--Coverage_CNG_TW_Start-->', '<!--Coverage_CNG_TW_End-->', true);
            if (txt_replace) {
                this.method_content = this.method_content.replace(txt_replace, '');
            }
        } else {
            this.prepared_request['external_bifuel_value'] = '0';
            this.processed_request['___external_bifuel_value___'] = '0';
            if (['LPG', 'CNG'].indexOf(this.prepared_request['dbmaster_pb_fuel_name']) > -1) {
                this.prepared_request['external_bifuel_type_2'] = 'Y';
                this.processed_request['___external_bifuel_type_2___'] = this.prepared_request['external_bifuel_type_2'];
                var txt_replace = this.find_text_btw_key(this.method_content, '<!--Coverage_CNG_TW_Val_Start-->', '<!--Coverage_CNG_TW_Val_End-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
            } else {
                var txt_replace = this.find_text_btw_key(this.method_content, '<!--Coverage_CNG_TW_Start-->', '<!--Coverage_CNG_TW_End-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
                var txt_replace = this.find_text_btw_key(this.method_content, '<!--Coverage_CNG_TW_Val_Start-->', '<!--Coverage_CNG_TW_Val_End-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
            }
        }
        if (this.lm_request['method_type'] === 'Verification') {
            var reg_no_new = "", engine_no_5 = "";
            var objString = this.insurer_master.service_logs.insurer_db_master.Insurer_Request;
            var xml2js = require('xml2js');
            xml2js.parseString(objString, {ignoreAttrs: true}, function (err, objXml2Json) {
                if (objXml2Json) {
                    reg_no_new = objXml2Json['Request']['Vehicle']['0']['RegistrationNumber1']['0'] + objXml2Json['Request']['Vehicle']['0']['RegistrationNumber2']['0'] + objXml2Json['Request']['Vehicle']['0']['RegistrationNumber3']['0'] + objXml2Json['Request']['Vehicle']['0']['RegistrationNumber4']['0'];
                    engine_no_5 = objXml2Json['Request']['Vehicle']['0']['EngineNumber']['0'];
                    engine_no_5 = engine_no_5.substr((engine_no_5.length - 5), engine_no_5.length);
                }
            });
            this.prepared_request['reg_no_new'] = reg_no_new;
            this.processed_request['___reg_no_new___'] = this.prepared_request['reg_no_new'];
            this.prepared_request['engine_no_5'] = engine_no_5;
            this.processed_request['___engine_no_5___'] = this.prepared_request['engine_no_5'];
        }
        if (this.lm_request['method_type'] === 'Pdf') {
            this.method_content = this.method_content.replace('___mobile___', this.lm_request['mobile']);
            if (config.environment.name === 'Production') {
                this.method_content = this.method_content.replace('___policy_number___', this.lm_request['policy_number']);
                this.method_content = this.method_content.replace('___registration_no___', this.lm_request['reg_no_new']);
                this.method_content = this.method_content.replace('___engine_number___', this.lm_request['engine_no_5']);
            } else {
                this.method_content = this.method_content.replace('___policy_number___', 'M0003066');
                this.method_content = this.method_content.replace('___registration_no___', 'MH05DF3434');
                this.method_content = this.method_content.replace('___engine_number___', '43535');
            }
            console.log(this.method_content);
        }
        //posp start date 7-June-21 Chirag Modi
        if (this.lm_request['method_type'] === 'Proposal' && this.method_content.toString().indexOf('POS_CONFIG_START') > -1) {
            let posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--POS_CONFIG_START-->', '<!--POS_CONFIG_FINISH-->', false);
            if (this.lm_request['is_posp'] === 'yes') {
                this.method_content = this.method_content.replace('___posp_pan_no___', this.lm_request['posp_pan_no']);
            } else {
                this.method_content = this.method_content.replace(posp_request_data, '');
            }
        }
        //posp finish
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
IffcoTokioMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
IffcoTokioMotor.prototype.insurer_product_field_process_post = function () {

};
IffcoTokioMotor.prototype.insurer_product_api_post = function () {

};
IffcoTokioMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;//
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        var http = require('http');
        var https = require('https');
        let ch_flag = ((parseInt(((objProduct.lm_request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
        if (objProduct.lm_request['product_id'] === 1 && objProduct.lm_request['is_breakin'] === 'yes' && ch_flag && (parseInt(this.prepared_request['vehicle_age_year']) > 10)) {
            console.error("IFFCO_motor_validations : Vehicle age more than 10 years.");
            var objResponseFull = {
                'err': ["IFFCO_motor_validations : Vehicle age more than 10 years."],
                'result': ["IFFCO_motor_validations : Vehicle age more than 10 years."],
                'raw': null,
                'soapHeader': null,
                'objResponseJson': ["IFFCO_motor_validations : Vehicle age more than 10 years."]
            };
            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
        } else {
            var body = docLog.Insurer_Request;
            console.log(body);
            body = body.replace("<?xml versio='1.0' encoding='utf-8'?>", "<?xml version='1.0' encoding='utf-8'?>");
            body = body.replace("soapev", "soapenv");
            /*
             {
             "Method_Name": "IffcoTokio_Car_IDV",
             "Method_Action": "getVehicleIdv",
             "Method_Request_File": "IffcoTokio_Car_IDV.xml",
             "Method_Calling_Type": "SOAP",
             "WSDL_URL": null,
             "Service_URL": "/portaltest/services/IDVWebService",
             "Service_URL_Live": "/ptnrportal/services/IDVWebService",
             "Service_File": null,
             "Checkpoint_URL": null,
             "Service_User": "",
             "Service_Password": "",
             "Is_Active": 0.0,
             "Method_Type": "Idv",
             "Product_Id": 1.0,
             "Insurer_Id": 7.0
             },
             */
            if (objProduct.lm_request['method_type'] === "Proposal") {
                if (objProduct.lm_request['product_id'] === 1 && objProduct.lm_request['is_breakin'] === 'yes' && objProduct.prepared_request['Plan_Name'] !== 'TP' && objProduct.lm_request['is_inspection_done'] === 'no') {
                    console.log('IffcoTokioMotor service_call for pvt. car breakin inspection');
                    var args = JSON.parse(objInsurerProduct.method_content_replaced);
                    console.log('Method :: ', specific_insurer_object.method.Method_Type, 'Breakin Create Lead Request :: ', args);
                    const request = require('request');
                    request.post(args, function (err, httpResponse, body) {
                        console.log(JSON.stringify(body));
                        console.log(err);
                        var objResponseFull = {
                            'err': err,
                            'result': JSON.parse(body),
                            'raw': body,
                            'soapHeader': null,
                            'objResponseJson': JSON.parse(body)
                        };
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                }
                /*else {
                 var data = objInsurerProduct.method_content_replaced;
                 var objResponseFull = {
                 'err': null,
                 'result': JSON.parse(data),
                 'raw': data,
                 'soapHeader': null,
                 'objResponseJson': JSON.parse(data)
                 };
                 var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                 }*/
                } else {
                if (config.environment.name === 'Production') {
                    http = https;
                    var postRequest = {
                        host: 'www.online.iffcotokio.co.in', //"220.227.8.74",
                        path: specific_insurer_object.method_file_url,
                        //port: 443,
                        method: "POST",
                        "rejectUnauthorized": false,
                        headers: {
                            'Cookie': "cookie",
                            'Content-Type': 'text/xml',
                            'Content-Length': Buffer.byteLength(body),
                            "SOAPAction": ""
                        }
                    };
                } else {
                    http = https;
                    var postRequest = {
                        host: "220.227.8.74",
                        path: specific_insurer_object.method_file_url,
                        method: "POST",
                        "rejectUnauthorized": false,
                        headers: {
                            'Cookie': "cookie",
                            'Content-Type': 'text/xml',
                            'Content-Length': Buffer.byteLength(body),
                            "SOAPAction": ""
                        }
                    };
                }

                console.error('IffcoService', postRequest);
                var buffer = "";
                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                var req = http.request(postRequest, function (res) {

                    console.log(res.statusCode);
                    var buffer = "";
                    res.on("data", function (data) {
                        buffer = buffer + data;
                    });
                    res.on("end", function (data) {
//                        var parse = require('xml-parser');
                        console.log(buffer);

                        var fliter_response = buffer.replace(/ns1:/g, '');
                        fliter_response = fliter_response.replace(/ns2:/g, '');
                        //temp
                        // var contents = fs.readFileSync(appRoot + '/resource/request_file/IFFCO_TEST_RESPONSE.xml', 'utf8');
                        // console.log(contents);
                        // fliter_response = contents;
                        // fliter_response = fliter_response.replace(/ns1:/g, '');
                        // fliter_response = fliter_response.replace(/ns2:/g, '');
                        //
                        xml2js.parseString(fliter_response, {ignoreAttrs: true}, function (err, objXml2Json) {
                            console.log(objXml2Json);

                            if (err) {
                                console.error('IffcoTokio', 'service_call', 'xml2jsonerror', err);
                                var objResponseFull = {
                                    'err': err,
                                    'result': data,
                                    'raw': fliter_response,
                                    'soapHeader': null,
                                    'objResponseJson': fliter_response
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

                            } else {
                                if (specific_insurer_object.method.Method_Type === 'Idv') {
                                    var objResponseFull = {
                                        'err': null,
                                        'result': data,
                                        'raw': JSON.stringify(objXml2Json),
                                        'soapHeader': null,
                                        'objResponseJson': objXml2Json['soapenv:Envelope']['soapenv:Body'][0]['getVehicleIdvResponse'][0]
                                    };

                                } else if (specific_insurer_object.method.Method_Type === 'Pdf') {
                                    var objResponseFull = {
                                        'err': null,
                                        'result': data,
                                        'raw': JSON.stringify(objXml2Json),
                                        'soapHeader': null,
                                        'objResponseJson': objXml2Json['soapenv:Envelope']['soapenv:Body'][0]['downloadPolicyCopyResponse'][0]
                                    };

                                } else {
                                    //console.error('ITGIADDON',objXml2Json['soapenv:Envelope']['soapenv:Body']);
                                    if (objXml2Json['soapenv:Envelope']['soapenv:Body'][0].hasOwnProperty('getMotorPremiumResponse')) {
                                        var objResponseFull = {
                                            'err': null,
                                            'result': data,
                                            'raw': JSON.stringify(objXml2Json),
                                            'soapHeader': null,
                                            'objResponseJson': objXml2Json['soapenv:Envelope']['soapenv:Body'][0]['getMotorPremiumResponse'][0]
                                        };
                                    } else {
                                        var objResponseFull = {
                                            'err': 'LM_NODE_MISSING_getMotorPremiumResponse',
                                            'result': data,
                                            'raw': JSON.stringify(objXml2Json),
                                            'soapHeader': null,
                                            'objResponseJson': objXml2Json
                                        };
                                    }
                                }
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                if (specific_insurer_object.method.Method_Type === 'Idv') {
                                    objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                                }
                            }
                            console.log(objXml2Json);
                        });
                    });
                });

                req.on('error', function (e) {
                    console.error('problem with request: ' + e.message);
                });

                req.write(body);
                req.end();
            }
        }
    } catch (e) {
        console.error('Exception    ', this.constructor.name, 'service_call', e);
    }
    /*     
     var args = JSON.parse(docLog.Insurer_Request);     
     soap.createClient(specific_insurer_object.method_file_url, function (err, client) {
     client[specific_insurer_object.method.Method_Action](args[specific_insurer_object.method.Method_Action], function (err, result, raw, soapHeader) {
     console.log('response');
     console.log(raw);
     console.log(result);
     if (err) {
     console.log(this.constructor.name, 'service_call', 'xml2jsonerror', err);
     } else {    
     }
     var objResponseFull = {
     'err': err,
     'result': result,
     'raw': raw,
     'soapHeader': soapHeader,
     'objResponseJson': result
     };
     if (specific_insurer_object.method.Method_Type == 'Idv') {
     objInsurerProduct.insurer_vehicle_idv_handler(objResponseFull, objProduct, Insurer_Object, specific_insurer_object);
     } else {
     objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
     }
     });
     });
     */
};

IffcoTokioMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        var objService = objResponseJson['getVehicleIdvReturn'][0];
        var Error_Msg = 'NO_ERR';
        if (objService.hasOwnProperty('error')) {
            if (objService['error']['0']['errorMessage']['0'] !== '') {
                Error_Msg = objService['error']['0']['errorMessage']['0'];
            }
        }
        if (objService.hasOwnProperty('erorMessage')) {
            if (objService['erorMessage']['0'] !== '') {
                Error_Msg = objService['erorMessage']['0'];
            }
        }

        var Idv_Breakup = this.get_const_idv_breakup();
        if (Error_Msg === 'NO_ERR') {
            Idv_Breakup["Idv_Normal"] = parseInt(objService['idv'][0]);
            Idv_Breakup["Idv_Min"] = parseInt(objService['minimumIdvAllowed'][0]);
            Idv_Breakup["Idv_Max"] = parseInt(objService['maximumIdvAllowed'][0]);
            Idv_Breakup["Exshowroom"] = 0;

            objServiceHandler.Premium_Breakup = Idv_Breakup;
            objServiceHandler.Insurer_Transaction_Identifier = '';
        }
        objServiceHandler.Error_Msg = Error_Msg;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'idv_response_handler', objServiceHandler);
    }
    console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
    return objServiceHandler;
};
IffcoTokioMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        var Error_Msg = 'NO_ERR';
        var objPremiumService = objResponseJson['getMotorPremiumReturn'][0];
        var objPremiumService_1 = objResponseJson['getMotorPremiumReturn'][1];

        if (!objPremiumService.hasOwnProperty('error')) {
            var premium_breakup = this.get_const_premium_breakup();
            for (var key in this.premium_breakup_schema) {
                if (typeof this.premium_breakup_schema[key] === 'object') {
                    var group_final = 0, group_final_key = '';
                    for (var sub_key in this.premium_breakup_schema[key]) {
                        if (sub_key === 'tp_cng_lpg' || sub_key === 'od_cng_lpg') {
                            if (this.processed_request['___external_bifuel_value___'] - 0 > 0) {
                                if (key === 'liability' && sub_key === 'tp_cng_lpg') {
                                    this.premium_breakup_schema[key]['tp_cng_lpg'] = 'CNG Kit';
                                }
                                if (key === 'own_damage' && sub_key === 'od_cng_lpg') {
                                    this.premium_breakup_schema[key]['od_cng_lpg'] = 'CNG Kit';
                                }
                            } else {
                                if (['LPG', 'CNG'].indexOf(this.prepared_request['dbmaster_pb_fuel_name']) > -1) {
                                    if (key === 'liability' && sub_key === 'tp_cng_lpg') {
                                        this.premium_breakup_schema[key]['tp_cng_lpg'] = 'CNG Kit Company Fit';
                                    }
                                    if (key === 'own_damage' && sub_key === 'od_cng_lpg') {
                                        this.premium_breakup_schema[key]['od_cng_lpg'] = 'CNG Kit Company Fit';
                                    }
                                }
                            }
                        }
                        var premium_key = this.premium_breakup_schema[key][sub_key];
                        var premium_val = 0;
                        if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                            premium_val = objPremiumService[premium_key]['0'] - 0;
                        } else {
                            for (var keyCover in objPremiumService['coveragePremiumDetail']) {
                                if (premium_key === objPremiumService['coveragePremiumDetail'][keyCover]['coverageName']['0']) {
                                    if (sub_key.indexOf('od_') > -1) {
                                        coverageKey = 'odPremium';
                                    } else {
                                        coverageKey = 'tpPremium';
                                    }
                                    premium_val = objPremiumService['coveragePremiumDetail'][keyCover][coverageKey]['0'].replace(/\-/g, '') - 0;
                                    break;
                                }
                            }
                        }
                        if (key === "addon") {
                            if (objPremiumService_1) {
                                if (premium_key && objPremiumService_1.hasOwnProperty(premium_key)) {
                                    premium_val = objPremiumService_1[premium_key]['0'] - 0;
                                } else {
                                    for (var keyCover in objPremiumService_1['coveragePremiumDetail']) {
                                        if (premium_key === objPremiumService_1['coveragePremiumDetail'][keyCover]['coverageName']['0']) {
                                            if (sub_key.indexOf('od_') > -1) {
                                                coverageKey = 'odPremium';
                                            } else {
                                                coverageKey = 'tpPremium';
                                            }
                                            if (sub_key === "addon_zero_dep_cover") {
                                                if (this.vehicle_age_year() < 5.8) {
                                                    premium_val = objPremiumService_1['coveragePremiumDetail'][keyCover]['coveragePremium']['0'].replace(/\-/g, '') - 0;
                                                } else {
                                                    premium_val = 0;
                                                }
                                            } else {
                                                premium_val = objPremiumService_1['coveragePremiumDetail'][keyCover]['coveragePremium']['0'].replace(/\-/g, '') - 0;
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        premium_val = isNaN(premium_val) ? 0 : premium_val;
                        premium_val = (premium_val < 0) ? (0 - premium_val) : premium_val;
                        premium_breakup[key][sub_key] = premium_val;
                        if (sub_key.indexOf('final_') > -1) {
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
                    var premium_val = 0;
                    if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                        premium_val = objPremiumService[premium_key]['0'] - 0;
                    }
                    premium_val = isNaN(premium_val) ? 0 : premium_val;
                    premium_breakup[key] = premium_val;
                }
            }
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = '';
        } else {
            Error_Msg = JSON.stringify(objPremiumService['error']['0']);
        }
        objServiceHandler.Error_Msg = Error_Msg;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    return objServiceHandler;
};
IffcoTokioMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var objInsurerProduct = this;
        var Insurer_Id = specific_insurer_object['insurer_id'];
        /*var lm_idv_request = this.lm_request;
         lm_idv_request['insurer_id'] = Insurer_Id;
         lm_idv_request['method_type'] = 'Idv';
         lm_idv_request['execution_async'] = 'no';
         var Base = require(appRoot + '/libs/Base');
         var objBase = new Base();
         objBase.request_id = this.create_guid('SRN-');
         objBase.response_object = objProduct.response_object;
         objBase.request_process_handler = 'this.insurer_vehicle_idv_handler(\'' + this.docRequest.Request_Unique_Id + '\');';
         objBase.request_process(lm_idv_request);
         */

        var IdvMethod = this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Idv');
        specific_insurer_object.method = IdvMethod;
        if (fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
            specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
        } else {
            specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
        }
        var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + IdvMethod.Method_Request_File).toString();
        var request_replaced_data = method_content.replaceJson(this.processed_request);

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
IffcoTokioMotor.prototype.insurer_vehicle_idv_handler_bakc = function (objBreakup, objProduct, Insurer_Object, specific_insurer_object) {
    try {
        var objInsurerProduct = this;
        var Db_Idv_Item = {
            "Motor_Premiums_Idv_Id": "",
            "Insurer_Id": parseInt(objInsurerProduct.insurer_id),
            "Vehicle_Id": parseInt(objInsurerProduct.lm_request['vehicle_id']),
            "Rto_Id": parseInt(objInsurerProduct.lm_request['rto_id']),
            "Vehicle_Age_Month": objInsurerProduct.vehicle_age_slab_month(),
            "Idv_Normal": objBreakup.Idv_Normal,
            "Idv_Min": objBreakup.Idv_Min,
            "Idv_Max": objBreakup.Idv_Max,
            "Exshowroom": objBreakup.Exshowroom,
            "Created_On": new Date()
        };
        var PremiumMethod = this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Premium');
        specific_insurer_object.method = PremiumMethod;
        if (fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
            specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
        } else {
            specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
        }
        objInsurerProduct.save_to_db('motor_premiums_idvs', Db_Idv_Item);
        objInsurerProduct.motor_vehicle_idv_handler(objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv_handler_bakc', ex);
    }
    console.log('Finish', this.constructor.name, 'insurer_vehicle_idv_handler_bakc', Db_Idv_Item);
};
IffcoTokioMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    try {
        var breakin_inspection_id = '';
        var Error_Msg = 'NO_ERR';
        if (Error_Msg === 'NO_ERR') {
            if (this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.prepared_request['Plan_Name'] !== 'TP' && this.lm_request['is_inspection_done'] === 'no') {
                if (objResponseJson.hasOwnProperty("status") && objResponseJson["status"] === "success") {
                    if (objResponseJson.hasOwnProperty("case_id") && objResponseJson["case_id"] !== "" && objResponseJson["case_id"] !== null) {
                        breakin_inspection_id = objResponseJson["case_id"].toString();
                        objServiceHandler.Insurer_Transaction_Identifier = breakin_inspection_id;

                        if (breakin_inspection_id !== '') {
                            var myobj = {
                                PB_CRN: parseInt(this.lm_request['crn']),
                                UD_Id: this.lm_request['udid'],
                                SL_Id: this.lm_request['slid'],
                                Insurer_Id: 7,
                                Request_Unique_Id: this.processed_request['___dbmaster_pb_request_unique_id___'],
                                Service_Log_Unique_Id: this.processed_request['___dbmaster_pb_service_log_unique_id___'],
                                Inspection_Id: breakin_inspection_id,
                                Status: 'INSPECTION_SCHEDULED',
                                Created_On: new Date(),
                                Modified_On: ''
                            };

                            try {
                                var MongoClient = require('mongodb').MongoClient;
                                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                                    if (err)
                                        throw err;
                                    var inspectionSchedules = db.collection('inspection_schedules');
                                    inspectionSchedules.insertOne(myobj, function (err, res) {
                                        if (err)
                                            throw err;
                                    });
                                });
                            } catch (ex3) {
                                console.error('Exception', this.constructor.name, 'proposal_response_handler', e);
                            }

                            var objRequestCore = {
                                'customer_name': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                                'crn': this.lm_request['crn'],
                                'vehicle_text': this.lm_request['vehicle_text'],
                                'insurer_name': 'IFFCO Tokio General Insurance Co. Ltd.',
                                'insurance_type': 'RENEW - Breakin Case',
                                'inspection_id': breakin_inspection_id,
                                'final_premium': Math.round(this.lm_request['final_premium']),
                                'inspection_label': "*Note",
                                'inspection_link': 'IFFCO Tokio General Insurance Co. Ltd. will contact you.'
                            };

                            try {
                                var email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Breakin.html').toString();
                                var User_Data = require(appRoot + '/models/user_data');
                                var ud_cond = {"User_Data_Id": this.lm_request.udid - 0};
                                var emailto = this.lm_request['email'];

                                User_Data.findOne(ud_cond, function (err, dbUserData) {
                                    if (err) {
                                        console.error('Exception', err);
                                    } else {
                                        objRequestCore['registration_no'] = dbUserData.Proposal_Request_Core['registration_no'];
                                        var processed_request = {};
                                        for (var key in objRequestCore) {
                                            if (typeof objRequestCore[key] !== 'object') {
                                                processed_request['___' + key + '___'] = objRequestCore[key];
                                            }
                                        }
                                        email_data = email_data.replaceJson(processed_request);

                                        var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Vehicle Inspection Request CRN : ' + dbUserData['PB_CRN'];
                                        var Email = require(appRoot + '/models/email');
                                        var objModelEmail = new Email();
                                        var email_agent = '';
                                        if (dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                            email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                                        }
                                        //var arr_bcc = ['horizon.lm.notification@gmail.com'];
                                        //var arr_bcc = ['horizonlive.2019@gmail.com'];
                                        var arr_bcc = [config.environment.notification_email];
                                        if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== 0 && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
                                            if (dbUserData.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                                arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                            }
                                        }
                                        if (config.environment.name === 'Production') {
                                            if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                                                if ((dbUserData.Premium_Request['posp_sources'] - 0) === 1) {
                                                    arr_bcc.push('transactions@magicfinmart.com');//finmart-dc 
                                                }
                                            }
                                        }
                                        objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), dbUserData['PB_CRN']);
                                    }
                                });
                            } catch (ex2) {
                                console.error('Exception while sending inspection schedule email', this.constructor.name, 'proposal_response_handler', ex2);
                            }
                        } else {
                            Error_Msg = 'Inspection Id not found proposal_response_handler';
                        }
                    } else {
                        Error_Msg = JSON.stringify(objResponseJson);
                    }
                } else {
                    Error_Msg = JSON.stringify(objResponseJson);
                }
            } else {
                objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request['timestamp'].toString();
            }
            console.log("PG_DATA XML REQUEST : ", this.method_content_replaced);
            var pg_data = {
                'XML_DATA': this.method_content_replaced,
                'RESPONSE_URL': ((config.environment.name === 'Production') ? 'http://horizon.policyboss.com/transaction-status' : 'http://qa-horizon.policyboss.com/transaction-status/'),
                'PARTNER_CODE': this.prepared_request['insurer_integration_agent_code'],
                'UNIQUE_QUOTEID': this.prepared_request['timestamp'].toString()
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            //objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request['timestamp'].toString();
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
IffcoTokioMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objInsurerProduct = this;
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        var Error_Msg = 'NO_ERR';

        if (Error_Msg === 'NO_ERR') {
            if (objInsurerProduct.const_policy.policy_number !== '') {
                if (objInsurerProduct.const_policy.transaction_status === 'SUCCESS') {
                    var args = {
                        data: {
                            "search_reference_number": objInsurerProduct.lm_request['search_reference_number'],
                            "api_reference_number": objInsurerProduct.lm_request['api_reference_number'],
                            "policy_number": objInsurerProduct.const_policy.policy_number,
                            'client_key': objInsurerProduct.lm_request['client_key'],
                            'secret_key': objInsurerProduct.lm_request['secret_key'],
                            'insurer_id': objInsurerProduct.lm_request['insurer_id'],
                            'email': objInsurerProduct.lm_request['email'],
                            'mobile': objInsurerProduct.lm_request['mobile'],
                            'method_type': 'Pdf',
                            'execution_async': 'no',
                            'reg_no_new': objInsurerProduct.prepared_request['reg_no_new'],
                            'engine_no_5': objInsurerProduct.prepared_request['engine_no_5']
                        }
                    };
                    this.const_policy.pdf_request = args.data;

                    var product_name = 'CAR';
                    if (objInsurerProduct.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    var pdf_file_name = objInsurerProduct.constructor.name + '_' + product_name + '_' + objInsurerProduct.const_policy.policy_number.toString() + '.pdf';
                    var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;//pdf_web_path_portal;

                    this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc_horizon);
                }
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }
        }
        objServiceHandler.Insurer_Transaction_Identifier = objInsurerProduct.const_policy.transaction_id;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    objServiceHandler.Policy = objInsurerProduct.const_policy;
    objServiceHandler.Error_Msg = Error_Msg;
    console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    return objServiceHandler;
};
IffcoTokioMotor.prototype.pg_response_handler = function () {
    //ITGIResponse=PCP|053342|87521818|9804.81|SUCCESSFULLY_SUBMITTED_IN_P400|33264_MPT9
    //ITGIResponse=PCP|495098|null|10526|Transaction_Declined|1508154120861
    try {
        var objInsurerProduct = this;
        var ITGIResponse = objInsurerProduct.const_payment_response.pg_get['ITGIResponse'];
        var str = ITGIResponse.split('|');
        this.const_policy.transaction_status = '';
        this.const_policy.transaction_id = str[1];
        if (ITGIResponse.indexOf('SUCCESSFULLY') > -1 || ITGIResponse.indexOf('FAILED_TO_UPDATE_IN_SIEBEL') > -1) {
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = str[2];
            this.const_policy.transaction_amount = str[3];
        } else {
            this.const_policy.pg_message = str[4];
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
IffcoTokioMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    try {
        var objInsurerProduct = this;
        objInsurerProduct.pdf_attempt++;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.post(url, args, function (data, response) {
            if (data.Error_Code !== '' || true) {
                if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                    var sleep = require('system-sleep');
                    sleep(60000);
                    objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
                }
            }
        });
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call', ex);
    }
};
IffcoTokioMotor.prototype.pdf_response_handler = function (objResponseJson) {
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
        var objPremiumService = objResponseJson;
        let pdf_url = '';
        if (!objPremiumService['downloadPolicyCopyReturn']['0'].hasOwnProperty('status')) {
            Error_Msg = JSON.stringify(objPremiumService);
        } else {
            if (objPremiumService['downloadPolicyCopyReturn']['0']['status']['0'] === 'Valid') {
                if (objPremiumService['downloadPolicyCopyReturn']['0'].hasOwnProperty('url') && objPremiumService['downloadPolicyCopyReturn']['0']['url'] !== '') {
                    pdf_url = objPremiumService['downloadPolicyCopyReturn']['0']['url']['0'];
                }
            } else {
                Error_Msg = JSON.stringify(objPremiumService);
            }
        }

        if (Error_Msg === 'NO_ERR') {
            if (pdf_url !== '') {
                var product_name = 'CAR';
                if (this.lm_request['product_id'] === 10) {
                    product_name = 'TW';
                }
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'] + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                var http = require('http');
                var insurer_pdf_url = pdf_url;

                this.const_policy.insurer_policy_url = insurer_pdf_url;
                policy.policy_url = pdf_web_path_portal;
                policy.pdf_status = 'SUCCESS';
                try {
                    var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                    var request = http.get(insurer_pdf_url, function (response) {
                        response.pipe(file_horizon);
                    });
                } catch (ep) {
                    console.error('ExceptionPDF', this.constructor.name, 'pdf_response_handler', ep);
                }
                objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
            } else {
                policy.pdf_status = 'FAIL';
                policy.transaction_status = 'PAYPASS';
            }
        } else {
            policy.pdf_status = 'FAIL';
            policy.transaction_status = 'PAYPASS';
        }
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex);
    }
    objServiceHandler.Policy = policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
IffcoTokioMotor.prototype.insurer_dateFormat = function (date_txt) {
    var dt_txt = '';
    try {
        console.log('Start', this.constructor.name, 'insurer_dateFormat');
        dt_txt = date_txt.split("-");
        dt_txt = dt_txt[1] + "/" + dt_txt[0] + "/" + dt_txt[2];
        console.log("dt_txt : " + dt_txt);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_dateFormat', ex);
        return dt_txt;
    }
    return dt_txt;
};
IffcoTokioMotor.prototype.noOfDaysDifference = function (dateText) {
    var diffDays;
    try {
        var now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        var selectedDate = new Date(dateText);
        var timeDiff = Math.abs(selectedDate.getTime() - now.getTime());
        diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'noOfDaysDifference', ex);
        return diffDays;
    }
    return diffDays;
};
IffcoTokioMotor.prototype.vehicle_age_year = function () {
    var age_in_year = 0;
    try {
        var vehicle_registration_date = this.lm_request['vehicle_registration_date'];
        var policy_start_date = this.prepared_request['policy_start_date'];
        var date1 = new Date(policy_start_date);
        var date2 = new Date(vehicle_registration_date); //mm/dd/yyyy
        var diff_date = date1 - date2;
        var num_years = diff_date / 31536000000;
        var num_months = (diff_date % 31536000000) / 2628000000;
        var num_days = ((diff_date % 31536000000) % 2628000000) / 86400000;
        age_in_year = Math.floor(num_years);
        var age_in_days = Math.floor(num_days);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'vehicle_age_year', ex);
        return age_in_year;
    }
    return age_in_year;
};
IffcoTokioMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": 'IDV Basic',
        "od_elect_access": 'Electrical Accessories',
        "od_non_elect_access": 'Cost of Accessories',
        "od_cng_lpg": 'CNG Kit',
        "od_disc_ncb": 'No Claim Bonus',
        "od_disc_vol_deduct": 'Voluntary Excess',
        "od_disc_anti_theft": 'null', //'Anti-Theft',
        "od_disc_aai": 'null', //'AAI Discount',
        "od_loading": 'null',
        "od_disc": 'null', //'discountLoadingAmt',
        "od_final_premium": 'totalODPremium'
    },
    "liability": {
        "tp_basic": 'IDV Basic',
        "tp_cover_owner_driver_pa": 'PA Owner / Driver',
        "tp_cover_unnamed_passenger_pa": 'PA to Passenger',
        "tp_cover_named_passenger_pa": '',
        "tp_cover_paid_driver_pa": 'TPPD',
        "tp_cover_paid_driver_ll": 'Legal Liability to Driver',
        "tp_cng_lpg": 'CNG Kit',
        "tp_final_premium": 'totalTPPremium'
    },
    "addon": {
        "addon_zero_dep_cover": "Depreciation Waiver",
        "addon_road_assist_cover": null,
        "addon_ncb_protection_cover": null,
        "addon_engine_protector_cover": '',
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
    "net_premium": 'totalPremimAfterDiscLoad',
    "service_tax": 'serviceTax',
    "final_premium": 'premiumPayable'
};
module.exports = IffcoTokioMotor;
