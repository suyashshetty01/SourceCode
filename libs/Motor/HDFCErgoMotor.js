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

function HDFCErgoMotor() {

}
util.inherits(HDFCErgoMotor, Motor);

HDFCErgoMotor.prototype.lm_request_single = {};
HDFCErgoMotor.prototype.insurer_integration = {};
HDFCErgoMotor.prototype.insurer_addon_list = [];
HDFCErgoMotor.prototype.insurer = {};
HDFCErgoMotor.prototype.insurer_date_format = 'dd/MM/yyyy';


HDFCErgoMotor.prototype.insurer_product_api_pre = function () {
    console.log('Jyoti :: HDFCErgoMotor insurer_product_api_pre()');
};

HDFCErgoMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        if (this.lm_request.hasOwnProperty('registration_no') && this.lm_request['registration_no'] !== '') {
            /*if (this.lm_request['product_id'] === 10 && this.lm_request['method_type'] === 'Proposal' && (['ELECTRIC'].indexOf(this.prepared_request['dbmaster_insurer_vehicle_fueltype']) > -1)) {
             this.method_content = this.method_content.replace('___registration_no___', 'ELC');
             }*/
            if (this.lm_request['product_id'] === 10 && this.lm_request['method_type'] === 'Proposal' && (['ELECTRIC'].indexOf(this.prepared_request['dbmaster_insurer_vehicle_fueltype']) > -1)) {
                if ((this.lm_request['vehicle_insurance_type'] === 'new') || (this.lm_request['vehicle_insurance_type'] === 'renew' && parseInt(this.prepared_request['dbmaster_insurer_vehicle_cubiccapacity']) < 250)) {
                    this.method_content = this.method_content.replace('___registration_no___', 'ELC');
                }
            }

            var registration_no = this.lm_request['registration_no'];
            var Arr_Registration_No = registration_no.split('-');
            if (Arr_Registration_No[1].toString().length === 1) {
                Arr_Registration_No[1] = '0' + Arr_Registration_No[1].toString();
                this.lm_request['registration_no'] = Arr_Registration_No.join('-');
                this.prepared_request['registration_no'] = Arr_Registration_No.join('-');
                this.processed_request['___registration_no___'] = Arr_Registration_No.join('-');
                this.lm_request['registration_no_2'] = Arr_Registration_No[1];
                this.prepared_request['registration_no_2'] = Arr_Registration_No[1];
                this.processed_request['___registration_no_2___'] = Arr_Registration_No[1];
            }
        }
        if (this.lm_request['vehicle_registration_type'] !== 'corporate') {
            this.prepared_request['vehicle_registration_type_2'] = (this.lm_request['is_pa_od'] === 'yes') ? "1" : "0";
            this.processed_request['___vehicle_registration_type_2___'] = this.prepared_request['vehicle_registration_type_2'];
        }
        var obj_replace = {};
        var ch_flag = ((parseInt(((this.lm_request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
        if (['LPG', 'CNG'].indexOf(this.prepared_request['dbmaster_insurer_vehicle_fueltype']) > -1) {
            if (this.lm_request['is_external_bifuel'] === 'yes') {
                this.prepared_request['is_external_bifuel_2'] = 'Y';
                this.processed_request['___is_external_bifuel_2___'] = this.prepared_request['is_external_bifuel_2'];
                this.prepared_request['is_external_bifuel_3'] = 'N';
                this.processed_request['___is_external_bifuel_3___'] = this.prepared_request['is_external_bifuel_3'];
            } else {
                this.prepared_request['is_external_bifuel_2'] = 'N';
                this.processed_request['___is_external_bifuel_2___'] = this.prepared_request['is_external_bifuel_2'];
                this.prepared_request['is_external_bifuel_3'] = 'Y';
                this.processed_request['___is_external_bifuel_3___'] = this.prepared_request['is_external_bifuel_3'];
                if (this.lm_request['method_type'] === 'Proposal') {
                    this.prepared_request['is_external_bifuel_2'] = 'Y';
                    this.processed_request['___is_external_bifuel_2___'] = this.prepared_request['is_external_bifuel_2'];
                }
            }
        } else {
            this.prepared_request['is_external_bifuel_2'] = 'N';
            this.processed_request['___is_external_bifuel_2___'] = this.prepared_request['is_external_bifuel_2'];
            this.prepared_request['is_external_bifuel_3'] = 'N';
            this.processed_request['___is_external_bifuel_3___'] = this.prepared_request['is_external_bifuel_3'];
        }

        if ((['PETROL'].indexOf(this.prepared_request['dbmaster_insurer_vehicle_fueltype']) > -1) && (this.lm_request['is_external_bifuel'] === 'yes')) {
            this.prepared_request['is_external_bifuel_2'] = 'Y';
            this.processed_request['___is_external_bifuel_2___'] = this.prepared_request['is_external_bifuel_2'];
            this.prepared_request['is_external_bifuel_3'] = 'N';
            this.processed_request['___is_external_bifuel_3___'] = this.prepared_request['is_external_bifuel_3'];
        }

        //if (this.lm_request['method_type'] === 'Proposal' && (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP' || this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP' || this.lm_request['vehicle_insurance_subtype'] === '5CH_0TP')) {
        this.prepared_request['policy_end_date'] = this.policy_end_date_2();
        this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];
        //}
        if (this.prepared_request['Plan_Name'] === 'Basic') {
            this.processed_request['___Plan_Name___'] = '';
        }
        /*if (this.lm_request['method_type'] === 'Proposal' && this.lm_request['vehicle_registration_type'] !== 'corporate') {
         if (this.lm_request['middle_name'] !== '') {
         this.method_content = this.method_content.replace('___first_name___', this.lm_request['first_name'] + " " + this.lm_request['middle_name']);
         }
         }*/
        if (this.lm_request['product_id'] === 10 && (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal') && ch_flag) {
            this.method_content = this.method_content.replace('<AddOnCovers>', '');
            this.method_content = this.method_content.replace('<is_ncb_protection>___addon_ncb_protection_cover___</is_ncb_protection>', '');
            this.method_content = this.method_content.replace('<is_engine_gear_box_protection>___addon_engine_protector_cover___</is_engine_gear_box_protection>', '');
            this.method_content = this.method_content.replace('<is_cost_of_consumable>___addon_consumable_cover___</is_cost_of_consumable>', '');
            this.method_content = this.method_content.replace('<is_loss_of_use_down_protection>___addon_losstime_protection_cover___</is_loss_of_use_down_protection>', '');
            this.method_content = this.method_content.replace('</AddOnCovers>', '');
        }
        if (this.lm_request['method_type'] === 'Idv' && this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_policy_exist'] === 'no')
        {
            this.method_content = this.method_content.replace('<typeofbusiness>___vehicle_insurance_type___</typeofbusiness>', '');
            this.method_content = this.method_content.replace('<prev_policy_end_date>___policy_expiry_date___</prev_policy_end_date>', '');
        }
        //CV Start
        if (this.insurer_lm_request['product_id'] === 12) {
            this.method_content = this.method_content.replace('___dbmaster_insurer_rto_city_code___', '___dbmaster_insurer_rto_custom_' + this.prepared_request['dbmaster_product_sub_category_code'] + this.prepared_request['dbmaster_product_sub_category_class'] + '___');
            if (this.insurer_lm_request['vehicle_class'] === 'gcv') {
                this.method_content = this.method_content.replace('___own_premises___', '0');
                if (config.environment.name.toString() === 'Production')
                {
                    this.prepared_request['insurer_integration_agent_code'] = 'CVC00016';
                    this.processed_request['___insurer_integration_agent_code___'] = 'CVC00016';
                    this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'CVC00016');
                } else {
                    this.prepared_request['insurer_integration_agent_code'] = 'CVC00019';
                    this.processed_request['___insurer_integration_agent_code___'] = 'CVC00019';
                    this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'CVC00019');
                }
            }
            if (this.insurer_lm_request['vehicle_class'] === 'pcv') {
                if (config.environment.name.toString() === 'Production')
                {
                    this.prepared_request['insurer_integration_agent_code'] = 'CVC00015';
                    this.processed_request['___insurer_integration_agent_code___'] = 'CVC00015';
                    this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'CVC00015');
                } else {
                    this.prepared_request['insurer_integration_agent_code'] = 'CVC00018';
                    this.processed_request['___insurer_integration_agent_code___'] = 'CVC00018';
                    this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'CVC00018');
                }
            }
        }
        //CV End
        //-----//-----
        //TP Only Start
        if (!ch_flag) {
            if (this.lm_request['method_type'] === 'Premium') {
                this.method['Method_Request_File'] = "HDFCErgo_TP_Premium.xml";
                if (config.environment.name.toString() === 'Production')
                {
                    this.method['Service_URL'] = "https://hewspool.hdfcergo.com/wscalculate/tppremiumservice.asmx?WSDL";
                } else {
                    this.method['Service_URL'] = "http://202.191.196.210/UAT/OnlineProducts/WSCalculate/TPPremiumService.asmx?WSDL";
                }
                var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + this.method.Method_Request_File).toString();
                this.method_content = method_content;
            }
            if (this.lm_request['method_type'] === 'Proposal') {
                this.method['Method_Request_File'] = "HDFCErgo_TP_Proposal.xml";
                if (config.environment.name.toString() === 'Production')
                {
                    //this.method['Service_URL'] = (this.lm_request['product_id'] === 10) ? "https://hepgw.hdfcergo.com/TWWS/service.asmx?WSDL" : "https://hewspool.hdfcergo.com/motorcp/tpliabilityservice.asmx?wsdl";
                    this.method['Service_URL'] = "https://hewspool.hdfcergo.com/motorcp/tpliabilityservice.asmx?wsdl";
                } else {
                    this.method['Service_URL'] = "http://202.191.196.210/UAT/OnlineProducts/NewTPCP/TPLiabilityService.asmx?WSDL";
                }
                var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + this.method.Method_Request_File).toString();
                this.method_content = method_content;
                if (this.insurer_lm_request['product_id'] === 10) {
                    this.method['Method_Request_File'] = "xmlstring";
                }

                if (this.lm_request['nominee_relation_text'] === 'Spouse' || this.prepared_request['nominee_relation_text'] === 'Sibling') {
                    var rel_txt = this.lm_request['nominee_relation_text'].split("");
                    this.method_content = this.method_content.replace('___nominee_relation_text___', (rel_txt[0] + rel_txt[1]).toUpperCase());
                } else {
                    var rel_txt = this.lm_request['nominee_relation_text'].split("");
                    this.method_content = this.method_content.replace('___nominee_relation_text___', rel_txt.length > 0 ? (rel_txt[0]).toUpperCase() : '');
                }
                //To Do the changes in proposal page for date formate - TP Only  
                if (this.lm_request['vehicle_registration_type'] !== 'corporate') {
                    this.method_content = this.method_content.replace('___birth_date___', this.get_tp_date(this.prepared_request['birth_date']));
                }
                this.method_content = this.method_content.replace('___vehicle_manf_date___', this.get_tp_date(this.prepared_request['vehicle_manf_date']));
                this.method_content = this.method_content.replace('___vehicle_registration_date___', this.get_tp_date(this.prepared_request['vehicle_registration_date']));
                if (this.lm_request.hasOwnProperty('ui_source') && this.lm_request['ui_source'] === 'quick_tw_journey') {
                    this.prepared_request['final_premium'] = Math.round((this.prepared_request['net_premium'] - 0) + (this.prepared_request['tax'] - 0));
                    this.processed_request['___final_premium___'] = this.prepared_request['final_premium'];
                }
            }

            if (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) {
                if (this.lm_request['is_tppd'] === 'yes') {
                    this.method_content = this.method_content.replace('___is_tppd___', 'Y');
                } else {
                    this.method_content = this.method_content.replace('___is_tppd___', 'N');
                }
            } else {
                this.method_content = this.method_content.replace('___is_tppd___', 'N');
            }
            if (this.insurer_lm_request['product_id'] === 1) {
                if (config.environment.name.toString() === 'Production')
                {
                    this.prepared_request['insurer_integration_agent_code'] = 'TPC00063';
                    this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'TPC00063');
                } else {
                    this.prepared_request['insurer_integration_agent_code'] = 'TPC00026';
                    this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'TPC00026');
                }
                this.processed_request['___insurer_integration_agent_code___'] = this.prepared_request['insurer_integration_agent_code'];
                //this.method_content = this.method_content.replace('___dbmaster_pb_product_sub_category_class_code___', '');
                this.method_content = this.method_content.replace('___dbmaster_product_sub_category_class___', '');
            }
            if (this.insurer_lm_request['product_id'] === 10) {
                if (config.environment.name.toString() === 'Production')
                {
                    this.prepared_request['insurer_integration_agent_code'] = 'TPC00063';
                    this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'TPC00063');
                } else {
                    //this.prepared_request['insurer_integration_agent_code'] = 'TPC00027';
                    this.prepared_request['insurer_integration_agent_code'] = 'TPC00050';
                    this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'TPC00050');
                }
                this.processed_request['___insurer_integration_agent_code___'] = this.prepared_request['insurer_integration_agent_code'];
                //this.method_content = this.method_content.replace('___dbmaster_pb_product_sub_category_class_code___', '');
                this.method_content = this.method_content.replace('___dbmaster_product_sub_category_class___', '');
            }
            if (this.insurer_lm_request['product_id'] === 12) {
                this.method_content = this.method_content.replace('___dbmaster_insurer_rto_city_code___', '___dbmaster_insurer_rto_custom_' + this.prepared_request['dbmaster_product_sub_category_code'] + this.prepared_request['dbmaster_product_sub_category_class'] + '___');
                if (this.insurer_lm_request['vehicle_class'] === 'gcv') {
                    if (config.environment.name.toString() === 'Production')
                    {
                        this.prepared_request['insurer_integration_agent_code'] = 'TPC00103'; //'TPD00053';
                        this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'TPC00103');
                    } else {
                        this.prepared_request['insurer_integration_agent_code'] = 'TPC00021';
                        this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'TPC00021');
                    }
                    this.processed_request['___insurer_integration_agent_code___'] = this.prepared_request['insurer_integration_agent_code'];
                    this.method_content = this.method_content.replace('___product_code___', '2317');
                    this.method_content = this.method_content.replace('___pa_paid_driver_si_num___', '0');
                }
                if (this.insurer_lm_request['vehicle_class'] === 'pcv') {
                    if (config.environment.name.toString() === 'Production')
                    {
                        this.prepared_request['insurer_integration_agent_code'] = 'TPC00103'; //'TPD00053';
                        this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'TPC00103');
                    } else {
                        this.prepared_request['insurer_integration_agent_code'] = 'TPC00020';
                        this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'TPC00020');
                    }
                    this.processed_request['___insurer_integration_agent_code___'] = this.prepared_request['insurer_integration_agent_code'];
                    this.method_content = this.method_content.replace('___product_code___', '2313');
                    this.method_content = this.method_content.replace('___pa_paid_driver_si_num___', '0');
                }
            }
            if (this.lm_request['method_type'] === 'Proposal') {
                if (this.lm_request['vehicle_insurance_type'] === 'new' || this.lm_request['is_policy_exist'] === 'no') {
                    this.prepared_request['policy_expiry_date'] = '01-Jan-1900';
                    this.processed_request['___policy_expiry_date___'] = this.prepared_request['policy_expiry_date'];
                    this.prepared_request['pre_policy_start_date'] = '01-Jan-1900';
                    this.processed_request['___pre_policy_start_date___'] = this.prepared_request['pre_policy_start_date'];
                } else {
                    this.prepared_request['policy_expiry_date'] = this.insurer_dateFormat2(this.prepared_request['policy_expiry_date']);
                    this.processed_request['___policy_expiry_date___'] = this.prepared_request['policy_expiry_date'];
                    this.prepared_request['pre_policy_start_date'] = this.insurer_dateFormat2(this.prepared_request['pre_policy_start_date']);
                    this.processed_request['___pre_policy_start_date___'] = this.prepared_request['pre_policy_start_date'];
                }
                if (config.environment.name.toString() === 'Production') {
                    if (this.prepared_request['dbmaster_previousinsurer_code'] === 'LIBERTYVIDEOCON') {
                        this.processed_request['___dbmaster_previousinsurer_code___'] = 'LibertyVideocon';
                    }
                    if (this.prepared_request['dbmaster_previousinsurer_code'] === 'MAGMAHDI') {
                        this.processed_request['___dbmaster_previousinsurer_code___'] = 'MagmaHDI';
                    }
                }
            }
        }
        //TP Only End

        if (this.lm_request['is_claim_exists'] === 'yes') {
            this.method_content = this.method_content.replace('___is_claim_exists___', '0');
            this.method_content = this.method_content.replace('___vehicle_ncb_current___', '0');
            this.method_content = this.method_content.replace('___vehicle_ncb_next___', '0');
        }

        if (this.lm_request['method_type'] === 'Proposal' && this.lm_request['vehicle_registration_type'] !== 'corporate') {
            if (this.lm_request['middle_name'] !== '') {
                console.log(this.method_content);
                this.method_content = this.method_content.replace('___first_name___', this.lm_request['first_name'] + " " + this.lm_request['middle_name']);
                console.log(this.method_content);
            }
        }

        if (this.lm_request['vehicle_registration_type'] === 'corporate') {
            if (this.lm_request['method_type'] === 'Proposal') {
                var company_request_data1 = this.find_text_btw_key(this.method_content.toString(), '<!--NO_NOMINEE_START-->', '<!--NO_NOMINEE_FINISH-->', false);
                this.method_content = this.method_content.replace(company_request_data1, '');
                var company_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--IND_START-->', '<!--IND_FINISH-->', false);
                this.method_content = this.method_content.replace(company_request_data, '');
                this.prepared_request['salutation'] = 'M/S';
                this.processed_request['___salutation___'] = this.prepared_request['salutation'];
                this.method_content = this.method_content.replace('___first_name___', this.lm_request['company_name']);
                if (this.lm_request['middle_name'] !== '') {
                    this.method_content = this.method_content.replace('___last_name___', this.prepared_request['first_name'] + ' ' + this.prepared_request['middle_name'] + ' ' + this.prepared_request['last_name']);
                } else {
                    this.method_content = this.method_content.replace('___last_name___', this.prepared_request['first_name'] + ' ' + this.prepared_request['last_name']);
                }

                if (!ch_flag) {
                    //this.method_content = this.method_content.replace('___gender_2___', '');
                    this.method_content = this.method_content.replace('___birth_date___', '');
                } else {
                    this.method_content = this.method_content.replace('___gender_2___', '');
                    this.method_content = this.method_content.replace('___birth_date___', '01/01/1900');
                }
            }
        }

        if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
            this.method_content = this.method_content.replace('<policy_type>C</policy_type>', '<policy_type>ODOnly</policy_type>');
            if (this.lm_request['method_type'] === 'Proposal') {
                this.method_content = this.method_content.replace('<Policy_Type>C</Policy_Type>', '<Policy_Type>ODOnly</Policy_Type>');
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
            this.method_content = this.method_content.replace('<tp_end_date>___policy_end_date___</tp_end_date>', '');
            if (this.lm_request['method_type'] === 'Proposal') {
                var posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--ODONLY_START-->', '<!--ODONLY_FINISH-->', false);
                this.method_content = this.method_content.replace(posp_request_data, '');
            }
        }

        if (this.insurer_lm_request['product_id'] === 10) {
            if (config.environment.name.toString() === 'Production')
            {
                this.method_content = this.method_content.replace('___dbmaster_insurer_rto_city_code___', '___dbmaster_insurer_rto_code___');
            } else {
                this.method_content = this.method_content.replace('___dbmaster_insurer_rto_city_code___', '11206');
            }
        }

        if (this.lm_request['vehicle_insurance_type'] === 'new' || this.lm_request['is_policy_exist'] === 'no') {
            this.prepared_request['policy_expiry_date'] = '01/01/1900';
            this.processed_request['___policy_expiry_date___'] = this.prepared_request['policy_expiry_date'];
            this.prepared_request['pre_policy_start_date'] = '01/01/1900';
            this.processed_request['___pre_policy_start_date___'] = this.prepared_request['pre_policy_start_date'];
        }

        if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal')
        {
            this.prepared_request['policy_od_tenure'] = this.lm_request['policy_od_tenure'];
            this.processed_request['___policy_od_tenure___'] = this.prepared_request['policy_od_tenure'];

            /*if (this.lm_request['vehicle_registration_type'] !== 'corporate' || this.prepared_request['pa_unnamed_passenger_si'] === '' || this.prepared_request['pa_unnamed_passenger_si'] === '0') {
             this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity'] = "0";
             this.processed_request['___dbmaster_insurer_vehicle_seatingcapacity___'] = this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity'];
             }*/

            //suraj
            if (this.lm_request['vehicle_registration_type'] === 'corporate' && this.lm_request['pa_paid_driver_si'] !== "0") {
                this.prepared_request['no_of_emp_corp_pa_paid_driver'] = this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity'];
                this.processed_request['___no_of_emp_corp_pa_paid_driver___'] = this.prepared_request['no_of_emp_corp_pa_paid_driver'];
            } else {
                this.prepared_request['no_of_emp_corp_pa_paid_driver'] = "0";
                this.processed_request['___no_of_emp_corp_pa_paid_driver___'] = this.prepared_request['no_of_emp_corp_pa_paid_driver'];
            }
            if (this.prepared_request['pa_unnamed_passenger_si'] === '' || this.prepared_request['pa_unnamed_passenger_si'] === '0') {
                this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity'] = "0";
                this.processed_request['___dbmaster_insurer_vehicle_seatingcapacity___'] = this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity'];
            }
            //suraj

            if ((this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10 || this.lm_request['product_id'] === 12) && this.lm_request['is_breakin'] === 'yes')
            {
                if (this.lm_request['is_policy_exist'] === 'no') {
                    if (this.lm_request['product_id'] === 1) {
                        this.method_content = this.method_content.replace('___vehicle_insurance_type___', 'Used Car');
                    }
                    this.method_content = this.method_content.replace('___is_claim_exists___', '0');
                    if (this.lm_request['method_type'] === 'Proposal') {
                        this.method_content = this.method_content.replace('<Data2/>', '<Data2>' + this.processed_request['___vehicle_registration_date___'] + '</Data2>');
                        this.method_content = this.method_content.replace('___dbmaster_previousinsurer_code___', '0');
                        this.method_content = this.method_content.replace('___previous_policy_number___', '0');
                        this.method_content = this.method_content.replace('<IsZeroDept_RollOver>___addon_zero_dep_cover___</IsZeroDept_RollOver>', '<IsZeroDept_RollOver>0</IsZeroDept_RollOver>');
                    }
                    if (this.lm_request['method_type'] === 'Premium') {
                        this.method_content = this.method_content.replace('___vehicle_ncb_current___', '0');
                    }
                }

                if (ch_flag && this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_policy_exist'] === 'no')
                {
                    var dt = new Date();
                    var dd = dt.getDate();
                    var mm = dt.getMonth() + 1;
                    var yyyy = dt.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    } else if (mm > 12) {
                        mm = '01';
                    }
                    var start_date = dd + '/' + mm + '/' + yyyy;
                    this.prepared_request['policy_start_date'] = start_date;
                    this.processed_request['___policy_start_date___'] = this.prepared_request['policy_start_date'];
                    var pol_end_date = new Date();
                    pol_end_date.setFullYear(pol_end_date.getFullYear() + 1);
                    pol_end_date.setDate(pol_end_date.getDate() - 1);
                    var edd = pol_end_date.getDate();
                    var emm = pol_end_date.getMonth() + 1;
                    var eyyyy = pol_end_date.getFullYear();
                    if (edd < 10) {
                        edd = '0' + edd;
                    }
                    if (emm < 10) {
                        emm = '0' + emm;
                    } else if (emm > 12) {
                        emm = '01';
                    }
                    var end_date = edd + '/' + emm + '/' + eyyyy;
                    this.prepared_request['policy_end_date'] = end_date;
                    this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];
                } else {
                    var dt = new Date();
                    dt.setDate(dt.getDate() + 1);
                    var dd = dt.getDate();
                    var mm = dt.getMonth() + 1;
                    var yyyy = dt.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    } else if (mm > 12) {
                        mm = '01';
                    }
                    var start_date = dd + '/' + mm + '/' + yyyy;
                    this.prepared_request['policy_start_date'] = start_date;
                    this.processed_request['___policy_start_date___'] = this.prepared_request['policy_start_date'];
                    /*var p_e_d = "";
                     if (!(this.prepared_request['policy_end_date'] === "" || this.prepared_request['policy_end_date'] === null)) {
                     var pedd = (this.prepared_request['policy_end_date']).split("/");
                     p_e_d = pedd[2] + "-" + pedd[1] + "-" + pedd[0];
                     }
                     
                     if (p_e_d !== "") {
                     var edt = new Date(p_e_d);
                     edt.setDate(edt.getDate() - 1);
                     var edd = edt.getDate();
                     var emm = edt.getMonth() + 1;
                     var eyyyy = edt.getFullYear();
                     if (edd < 10) {
                     edd = '0' + edd;
                     }
                     if (emm < 10) {
                     emm = '0' + emm;
                     } else if (emm > 12) {
                     emm = '01';
                     }
                     var end_date = edd + '/' + emm + '/' + eyyyy;
                     this.prepared_request['policy_end_date'] = end_date;
                     this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];
                     }*/
                }
            }
        }

        if ((this.prepared_request['policy_start_date'] === '01/03/2020' && this.prepared_request['policy_end_date'] === '01/03/2021') || (this.prepared_request['policy_start_date'] === '2020-03-01' && this.prepared_request['policy_end_date'] === '01/03/2021')) {
            this.method_content = this.method_content.replace('___policy_end_date___', '28/02/2021');
        }
        if ((this.prepared_request['policy_start_date'] === '01/03/2023' && this.prepared_request['policy_end_date'] === '28/02/2024') || (this.prepared_request['policy_start_date'] === '2023-03-01' && this.prepared_request['policy_end_date'] === '28/02/2024')) {
            this.method_content = this.method_content.replace('___policy_end_date___', '29/02/2024');
        }
        if (this.lm_request['method_type'] === 'Proposal') {
            this.prepared_request['cust_age'] = this.get_cust_age();
            this.processed_request['___cust_age___'] = this.prepared_request['cust_age'];
            this.prepared_request['nominee_relation_text'] = this.lm_request['nominee_relation_text'];
            this.processed_request['___nominee_relation_text___'] = this.prepared_request['nominee_relation_text'];
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.prepared_request['dbmaster_previousinsurer_code'] = '0';
                this.processed_request['___dbmaster_previousinsurer_code___'] = this.prepared_request['dbmaster_previousinsurer_code'];
                this.prepared_request['registration_no'] = 'NEW';
                this.processed_request['___registration_no___'] = this.prepared_request['registration_no'];
            }
            /*
             this.processed_request['___net_premium___'] = Math.round(this.processed_request['___net_premium___']);
             this.processed_request['___tax___'] = Math.round(this.processed_request['___tax___']);
             this.processed_request['___final_premium___'] = Math.round(this.processed_request['___final_premium___']);
             */
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
            console.log(this.method_content);
            if (this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.lm_request['vehicle_insurance_type'] === 'renew' && ch_flag) {
                this.prepared_request['breakin_location_code'] = this.lm_request['breakin_location_code'];
                this.processed_request['___breakin_location_code___'] = this.prepared_request['breakin_location_code'];
                this.method_content = this.method_content.replace('___breakin_location_code___', this.lm_request['breakin_location_code']);
            } else {
                this.method_content = this.method_content.replace('___breakin_location_code___', '');
            }

            let addon_selected = false;
            if (this.lm_request['product_id'] === 10) {
                var addonCover = this.addon_processed_request;
                for (var key in addonCover) {
                    if (addonCover[key] === "1") {
                        addon_selected = true;
                        break;
                    }
                }
            }

            if (this.lm_request['product_id'] === 10 && addon_selected) {
                this.processed_request['___net_premium___'] = Math.round(this.processed_request['___net_premium___']);
                this.processed_request['___tax___'] = Math.round(this.processed_request['___tax___']);
                this.processed_request['___final_premium___'] = Math.round(this.processed_request['___final_premium___']);
            } else {
                if (this.lm_request.hasOwnProperty('is_premium_revised') && this.lm_request['is_premium_revised'] === "yes") {
                    this.method_content = this.method_content.replace('___net_premium___', Math.round(this.processed_request['___net_premium___']));
                    this.method_content = this.method_content.replace('___tax___', Math.round(this.processed_request['___tax___']));
                    this.method_content = this.method_content.replace('___final_premium___', Math.round(this.processed_request['___final_premium___']));
                } else {
                    this.prepared_request['net_premium'] = this.insurer_master.service_logs.insurer_db_master.Insurer_Response.getPremiumResult.PREMIUMOUTPUT.NUM_NET_PREMIUM['0'];
                    this.prepared_request['tax'] = this.insurer_master.service_logs.insurer_db_master.Insurer_Response.getPremiumResult.PREMIUMOUTPUT.NUM_SERVICE_TAX['0'];
                    this.prepared_request['final_premium'] = this.insurer_master.service_logs.insurer_db_master.Insurer_Response.getPremiumResult.PREMIUMOUTPUT.NUM_TOTAL_PREMIUM['0'];
                    this.processed_request['___net_premium___'] = this.insurer_master.service_logs.insurer_db_master.Insurer_Response.getPremiumResult.PREMIUMOUTPUT.NUM_NET_PREMIUM['0'];
                    this.processed_request['___tax___'] = this.insurer_master.service_logs.insurer_db_master.Insurer_Response.getPremiumResult.PREMIUMOUTPUT.NUM_SERVICE_TAX['0'];
                    this.processed_request['___final_premium___'] = this.insurer_master.service_logs.insurer_db_master.Insurer_Response.getPremiumResult.PREMIUMOUTPUT.NUM_TOTAL_PREMIUM['0'];
                    this.method_content = this.method_content.replace('___net_premium___', Math.round(this.prepared_request['net_premium']));
                    this.method_content = this.method_content.replace('___tax___', Math.round(this.prepared_request['tax']));
                    this.method_content = this.method_content.replace('___final_premium___', Math.round(this.prepared_request['final_premium']));
                }
            }
        }

        if (Object.keys(obj_replace).length > 0) {
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }

        if (this.lm_request['method_type'] === 'Verification') {
            //this.method_content = this.insurer_master['service_logs']['pb_db_master']['Insurer_Request'];
        }
        //posp start date 9-June-21 Chirag Modi
        if (this.method_content.toString().indexOf('POS_CONFIG_START') > -1) {
            let posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--POS_CONFIG_START-->', '<!--POS_CONFIG_FINISH-->', false);
            if (this.lm_request['is_posp'] === 'yes' && this.lm_request.hasOwnProperty('posp_insurer_5') && this.lm_request['posp_insurer_5'] !== null && this.lm_request['posp_insurer_5'].toString() === 'Yes') {
                if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP' || this.lm_request['vehicle_insurance_subtype'] === '1CH_0TP') {
                    this.method_content = this.method_content.replace('<POSPCCode>___posp_pan_no___</POSPCCode>', '<POSPCode>' + this.lm_request['posp_pan_no'] + '</POSPCode>');
                } else {
                    this.method_content = this.method_content.replace('<POSPCCode>___posp_pan_no___</POSPCCode>', '<POSPCOde>' + this.lm_request['posp_pan_no'] + '</POSPCOde>');
                }
            } else {
                this.method_content = this.method_content.replace(posp_request_data, '');
            }
        }
        //posp finish

        /*if (this.lm_request['method_type'] === 'Proposal' && ch_flag && this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === "yes" && this.lm_request['is_inspection_done'] === "yes") {
         this.method_content = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['insurer_customer_identifier'];
         }*/
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
HDFCErgoMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
    /*if (specific_insurer_object.method.Method_Type === 'Customer') {
     obj_response_handler = this.customer_response_handler(objResponseJson);
     }*/
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
HDFCErgoMotor.prototype.insurer_product_field_process_post = function () {

};
HDFCErgoMotor.prototype.insurer_product_api_post = function () {

};
HDFCErgoMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        var args = null;
        docLog.Insurer_Request = docLog.Insurer_Request.replace('<<', '<');
        //docLog.Insurer_Request = docLog.Insurer_Request.replace('xmlmotorpolicy', '<xmlmotorpolicy>');
        //docLog.Insurer_Request = docLog.Insurer_Request.replace('</<xmlmotorpolicy>>', '</xmlmotorpolicy>');
        docLog.Insurer_Request = docLog.Insurer_Request.replace('<xmlmotorpolic>', '<xmlmotorpolicy>');
        var temp_ch_flag = ((parseInt(((this.lm_request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
        /*if (specific_insurer_object.method.Method_Type === 'Customer' && temp_ch_flag && this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === "yes" && this.lm_request['is_inspection_done'] === "yes") {
         args = {
         AgentCode: this.processed_request['___insurer_integration_agent_code___'],
         PGTransNo: objInsurerProduct.lm_request.insurer_transaction_identifier //'MT1902048737T'
         };
         } else */if (specific_insurer_object.method.Method_Type === 'Proposal' && temp_ch_flag && this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === "yes" && this.lm_request['is_inspection_done'] === "yes") {
            args = {
                str: this.method_content,
                VehicleClassCode: this.method_processed_request['product_id']
            };
        } else {
            if (this.method_processed_request['product_id'] === '37' && specific_insurer_object.method.Method_Type === 'Proposal'
                    && (this.prepared_request['Plan_Name'] !== 'TP') && false) {
                args = {
                    NewTWCPURL: docLog.Insurer_Request,
                    VehicleClassCode: this.method_processed_request['product_id']
                };
            } else if (specific_insurer_object.method.Method_Type === 'Pdf') {
                args = {
                    PolicyNo: objInsurerProduct['lm_request']['policy_number'],
                    AgentCode: objInsurerProduct.processed_request['___insurer_integration_agent_code___']//'TWC00098'//
                };
            } else {
                args = {
                    str: docLog.Insurer_Request,
                    VehicleClassCode: this.method_processed_request['product_id']
                };
            }
        }

        //Changes for CV -- Start
        if (this.insurer_lm_request['product_id'] === 12) {
            if (this.insurer_lm_request['vehicle_class'] === 'gcv') {
                var args = {
                    str: docLog.Insurer_Request,
                    VehicleClassCode: '24'
                };
            } else if (this.insurer_lm_request['vehicle_class'] === 'pcv') {
                var args = {
                    str: docLog.Insurer_Request,
                    VehicleClassCode: '41'
                };
            } else {
                var args = {
                    str: docLog.Insurer_Request,
                    VehicleClassCode: this.prepared_request['product_id']
                };
            }
            specific_insurer_object.method_file_url = specific_insurer_object.method.Service_URL;
        }
        //Changes for CV -- End

        if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            specific_insurer_object.method_file_url = specific_insurer_object.method.Service_URL;
            if (this.insurer_lm_request['product_id'] === 10 && specific_insurer_object.method.Method_Type === 'Proposal') {
                this.method['Method_Request_File'] = "xmlstring";
                specific_insurer_object.method.Method_Action = this.method['Method_Request_File'];
            }
        }

        console.log("HDFCErgoMotor :: service_call for - ", specific_insurer_object.method.Method_Type);
        console.log(args);
        /*if (this.lm_request['product_id'] === 10 && specific_insurer_object.method.Method_Type === 'Premium' && (this.prepared_request['Plan_Name'] === 'TP' || this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP' || this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP')) {
         specific_insurer_object.method.Method_Action = "getPremiumMultiYear";
         }*/
        //if (this.lm_request['product_id'] === 10 && specific_insurer_object.method.Method_Type === 'Premium' && this.prepared_request['Plan_Name'] === 'TP' && (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP' || this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP')) {
        if (this.lm_request['product_id'] === 10 && specific_insurer_object.method.Method_Type === 'Premium' && (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP' || this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP')) {
            specific_insurer_object.method.Method_Action = "getPremiumMultiYear";
        }
        let is_service_call = false;
        if (this.lm_request['vehicle_insurance_type'] === 'renew' && (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) && (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium') && (this.lm_request['vehicle_insurance_subtype'] === "1CH_0TP" || this.lm_request['vehicle_insurance_subtype'] === "0CH_1TP")) {
            if (this.lm_request['is_tp_policy_exists'] === "yes") {
                console.error('HDFCErgoMotor', 'service_call', 'SAOD policy can only be issued for this case.');
                is_service_call = false;
                var LMerr = {
                    'err': 'SAOD policy can only be issued for this case.'
                };
                var objResponseFull = {
                    'err': LMerr,
                    'result': LMerr,
                    'raw': null,
                    'soapHeader': null,
                    'objResponseJson': LMerr
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            } else {
                is_service_call = true;
            }
        } else {
            is_service_call = true;
        }

        if (is_service_call) {
            //soap.createClient(specific_insurer_object.method_file_url, function (err, client) {
            console.error('HDFCErgoMotor', 'service_call', 'dbgexp', 'Service_URL', specific_insurer_object.method.Service_URL,
                    'Method_Action', specific_insurer_object.method.Method_Action, 'args', args);
            soap.createClient(specific_insurer_object.method.Service_URL, function (err, client) {
                client[specific_insurer_object.method.Method_Action](args, function (err1, result, raw, soapHeader) {
                    var api_error_status = (err1 || result === null || typeof result === 'undefined') ? 'HDFC_API_ERR' : 'HDFC_API_OK';
                    if (specific_insurer_object.method.Method_Action === 'GetPSSPDFInBytes') {
                        console.error('HDFCErgoMotor', 'CRN', objInsurerProduct.lm_request['crn'], api_error_status, 'service_call', err1, specific_insurer_object.method.Service_URL, result);
                    }
                    if (err1 || result === null || typeof result === 'undefined') {
                        //console.error('HDFCErgoMotor', 'service_call', 'exception', err1);
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
                        var objResponseJsonLength = Object.keys(result).length;
                        var processedXml = 0;
                        for (var key in result) {
                            var keyJsonObj = JSON.parse('{"' + key + '":{}}');
                            Object.assign(objResponseJson, keyJsonObj);
                            if (result[key].indexOf('<') === 0) {
                                xml2js.parseString(result[key], function (err2, objXml2Json) {
                                    processedXml++;
                                    if (err2) {
                                        //console.error('HDFCErgoMotor', 'service_call', 'xml2jsonerror', err2);
                                        var objResponseFull = {
                                            'err': err2,
                                            'result': result,
                                            'raw': raw,
                                            'soapHeader': soapHeader,
                                            'objResponseJson': null
                                        };
                                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                    } else {
                                        objResponseJson[key] = objXml2Json;
                                        if (processedXml === objResponseJsonLength) {
                                            var objResponseFull = {
                                                'err': err,
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
                                    }
                                });
                            } else {
                                var objResponseFull = {
                                    'err': err,
                                    'result': result,
                                    'raw': raw,
                                    'soapHeader': soapHeader,
                                    'objResponseJson': result
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            }
                        }
                    }
                });
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e.stack);
    }

};
HDFCErgoMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objService = objResponseJson['getIDVResult'];
        if (!objService.hasOwnProperty('error')) {
            if (this.insurer_lm_request['product_id'] === 12) { //For Product_ID = 12/CV 
                if (objResponseJson['getIDVResult']['IDV']['OUTPUTMESSAGE'][0] === 'NA') {
                    var Idv_Breakup = this.get_const_idv_breakup();
                    Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson['getIDVResult']['IDV']['IDV_AMOUNT_VEH'][0]);
                    Idv_Breakup["Idv_Min"] = parseInt(objResponseJson['getIDVResult']['IDV']['IDV_AMOUNT_VEH_MIN'][0]);
                    Idv_Breakup["Idv_Max"] = parseInt(objResponseJson['getIDVResult']['IDV']['IDV_AMOUNT_VEH_MAX'][0]);
                    Idv_Breakup["Exshowroom"] = parseInt(objResponseJson['getIDVResult']['IDV']['EXSHOWROOMPRICE_VEH'][0]);
                    objServiceHandler.Premium_Breakup = Idv_Breakup;
                    objServiceHandler.Insurer_Transaction_Identifier = '';
                } else {
                    Error_Msg = objResponseJson['getIDVResult']['IDV']['OUTPUTMESSAGE'][0];
                }

            } else {
                if (objResponseJson['getIDVResult']['IDV']['outputmessage'][0] === '') {
                    var Idv_Breakup = this.get_const_idv_breakup();
                    Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson['getIDVResult']['IDV']['idv_amount'][0]);
                    Idv_Breakup["Idv_Min"] = parseInt(objResponseJson['getIDVResult']['IDV']['idv_amount_min'][0]);
                    Idv_Breakup["Idv_Max"] = parseInt(objResponseJson['getIDVResult']['IDV']['idv_amount_max'][0]);
                    Idv_Breakup["Exshowroom"] = parseInt(objResponseJson['getIDVResult']['IDV']['exshowroomPrice'][0]);
                    objServiceHandler.Premium_Breakup = Idv_Breakup;
                    objServiceHandler.Insurer_Transaction_Identifier = '';
                } else {
                    Error_Msg = objResponseJson['getIDVResult']['IDV']['outputmessage'][0];
                }
            }

            if (Error_Msg == '') {
                Error_Msg = 'PB_IDV_NA';
            }
        } else {
            Error_Msg = objService;
        }
        console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'idv_response_handler', ex);
    }
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
HDFCErgoMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objInsurerProduct = this;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'objPremiumService': null
    };
    try {
        var objPremiumService = '';
        if (this.insurer_lm_request['product_id'] === 10 && this.lm_request['vehicle_insurance_type'] === 'renew' && (this.prepared_request['Plan_Name'] !== 'TP' && this.lm_request['vehicle_insurance_subtype'] !== '1OD_0TP')) {
            if (this.lm_request['vehicle_insurance_subtype'] === '1CH_0TP') {
                objPremiumService = objResponseJson['getPremiumResult']['PREMIUMOUTPUT'];
            }
            if (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP') {
                objPremiumService = objResponseJson['getPremiumMultiYearResult']['ROOT']['PREMIUMOUTPUT']['1'];
            }
            if (this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                objPremiumService = objResponseJson['getPremiumMultiYearResult']['ROOT']['PREMIUMOUTPUT']['2'];
            }
        } else {
            let main_node = '';
            if (objResponseJson['getPremiumResult'].hasOwnProperty('PREMIUMOUTPUT')) {
                main_node = 'PREMIUMOUTPUT';
            }
            if (objResponseJson['getPremiumResult'].hasOwnProperty('premiumoutput')) {
                main_node = 'premiumoutput';
            }

            if (main_node === '') {
                if (objResponseJson['getPremiumResult'].hasOwnProperty('TXT_ERROR_MSG')) {
                    objPremiumService = objResponseJson['getPremiumResult'];
                    if (typeof objPremiumService['TXT_ERROR_MSG']['0'] !== 'undefined') {
                        Error_Msg = objPremiumService['TXT_ERROR_MSG']['0'];
                    } else {
                        Error_Msg = objPremiumService['TXT_ERROR_MSG'];
                    }
                } else if (objResponseJson['getPremiumResult'].hasOwnProperty('TXT_ERR_MSG')) {
                    objPremiumService = objResponseJson['getPremiumResult'];
                    if (Array.isArray(objPremiumService['TXT_ERR_MSG'])) {
                        Error_Msg = objPremiumService['TXT_ERR_MSG']['0'];
                    } else {
                        Error_Msg = objPremiumService['TXT_ERR_MSG'];
                    }
                } else {
                    Error_Msg = objResponseJson['getPremiumResult'];
                }
            } else {
                if (this.insurer_lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_type'] === 'new' && (this.prepared_request['Plan_Name'] !== 'TP')) {
                    if (this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                        objPremiumService = objResponseJson['getPremiumResult'][main_node]['PARENT']['1'];
                    }
                    if (this.lm_request['vehicle_insurance_subtype'] === '1CH_2TP') {
                        objPremiumService = objResponseJson['getPremiumResult'][main_node]['PARENT']['0'];
                    }
                } else if (this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['is_breakin'] === 'yes') {
                    if (this.lm_request['breakin_days'] >= 90 || (this.prepared_request['Plan_Name'] === 'TP')) {
                        objPremiumService = objResponseJson['getPremiumResult'][main_node];
                    } else {
                        objPremiumService = objResponseJson['getPremiumResult'][main_node]['PARENT']['0'];
                    }
                } else {
                    objPremiumService = objResponseJson['getPremiumResult'][main_node];
                }
            }
        }

        if (Error_Msg === 'NO_ERR') {
            if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {// For TP
                if (objPremiumService.hasOwnProperty('TXT_ERROR_MSG')) {
                    if (objPremiumService['TXT_ERROR_MSG']['0'] === '') {
                        var premium_breakup = this.get_const_premium_breakup();
                        if (Error_Msg === 'NO_ERR') {
                            if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                                premium_breakup['liability']['tp_basic'] = objPremiumService['NUM_TP_PREMIUM']['0'];
                                premium_breakup['liability']['tp_cover_owner_driver_pa'] = objPremiumService['NUM_PA_OWNER_DRIVER']['0'];
                                premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = objPremiumService['NUM_UNNAMED_PASGR']['0'];
                                premium_breakup['liability']['tp_cover_named_passenger_pa'] = objPremiumService['NUM_NAMED_PASGR']['0'];
                                premium_breakup['liability']['tp_cover_paid_driver_pa'] = objPremiumService['NUM_PA_PAID_DRIVER']['0'];
                                premium_breakup['liability']['tp_cover_paid_driver_ll'] = objPremiumService['NUM_NOOFLLDRIVERS']['0'];
                                //premium_breakup['liability']['tp_cng_lpg'] = objPremiumService['NUM_EX_LPG_CNGKIT']['0'];

                                if (['LPG', 'CNG'].indexOf(this.prepared_request['dbmaster_insurer_vehicle_fueltype']) > -1) {
                                    if (this.lm_request['is_external_bifuel'] === 'yes') {
                                        premium_breakup['liability']['tp_cng_lpg'] = objPremiumService['NUM_EX_LPG_CNGKIT']['0'];
                                    } else {
                                        premium_breakup['liability']['tp_cng_lpg'] = objPremiumService['NUM_IB_LPG_CNGKIT']['0'];
                                    }
                                } else {
                                    premium_breakup['liability']['tp_cng_lpg'] = objPremiumService['NUM_EX_LPG_CNGKIT']['0'];
                                }
                                if ((['PETROL'].indexOf(this.prepared_request['dbmaster_insurer_vehicle_fueltype']) > -1) && (this.lm_request['is_external_bifuel'] === 'yes')) {
                                    premium_breakup['liability']['tp_cng_lpg'] = objPremiumService['NUM_EX_LPG_CNGKIT']['0'];
                                }

                                if (this.lm_request['is_tppd'] === 'yes') {
                                    premium_breakup['liability']['tp_cover_tppd'] = objPremiumService['NUM_TPPD_AMT']['0'];
                                }
                                premium_breakup['liability']['tp_cover_emp_pa'] = objPremiumService['NUM_NOOFLLEMPLOYEE']['0'];
                                //premium_breakup['liability']['tp_final_premium'] = objPremiumService['NUM_NET_PREMIUM']['0'];
                                /*
                                 premium_breakup['net_premium'] = objPremiumService['NUM_NET_PREMIUM']['0'];
                                 premium_breakup['service_tax'] = objPremiumService['NUM_SERVICE_TAX']['0'];
                                 premium_breakup['final_premium'] = objPremiumService['NUM_TOTAL_PREMIUM']['0'];
                                 */
                                premium_breakup['addon']['addon_final_premium'] = 0;
                                let group_final_key = '';
                                let group_final = 0;
                                for (let key in premium_breakup) {
                                    if (typeof premium_breakup[key] === 'object') {
                                        group_final_key = '';
                                        group_final = 0;
                                        for (let sub_key in premium_breakup[key]) {
                                            if (sub_key.indexOf('final_') > -1) {
                                                group_final_key = sub_key;
                                            } else {
                                                if ((premium_breakup[key][sub_key] - 0) > 0) {
                                                    premium_val = parseFloat(premium_breakup[key][sub_key]);
                                                    premium_breakup[key][sub_key] = premium_val;
                                                    if (sub_key.indexOf('_disc') > -1) {
                                                        group_final -= premium_val;
                                                    } else if (sub_key === 'tp_cover_tppd') {
                                                        group_final -= premium_val;
                                                    } else {
                                                        group_final += premium_val;
                                                    }
                                                }
                                            }

                                        }
                                        premium_breakup[key][group_final_key] = group_final;
                                    }
                                }
                                premium_breakup['net_premium'] = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'] + premium_breakup['addon']['addon_final_premium'];
                                premium_breakup['service_tax'] = premium_breakup['net_premium'] * 0.18;
                                premium_breakup['final_premium'] = premium_breakup['net_premium'] + premium_breakup['service_tax'];

                            }
                            objServiceHandler.Premium_Breakup = premium_breakup;
                            objServiceHandler.objPremiumService = objPremiumService;
                            //objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['getPremiumResult']['PREMIUMOUTPUT']['GUID'];
                        }
                    } else {
                        Error_Msg = objPremiumService['TXT_ERROR_MSG']['0'] || objPremiumService['TXT_ERROR_MSG'];
                    }
                }
            } else {
                if (objPremiumService.hasOwnProperty('TXT_ERR_MSG')) {
                    if (objPremiumService['TXT_ERR_MSG']['0'] === '') {
                        var premium_breakup = this.get_const_premium_breakup();
                        if (Error_Msg === 'NO_ERR') {
                            for (var key in this.premium_breakup_schema) {
                                if (this.lm_request['product_id'] === 12) {
                                    var IMT23_1 = parseFloat(objPremiumService['NUM_INCLUSION_IMT23_AMT_OD'][0]) + parseFloat(objPremiumService['NUM_INCLUSION_IMT23_AMT_CNG'][0]);
                                    var IMT23_2 = parseFloat(objPremiumService['NUM_INCLUS_IMT23_AMT_ELEC'][0]) + parseFloat(objPremiumService['NUM_INCLUS_IMT23_AMT_NELEC'][0]);
                                    var IMT23 = IMT23_1 + IMT23_2;
                                    premium_breakup['liability']['tp_cover_imt23'] = IMT23;
                                    var PRIVATE_USE = parseFloat(objPremiumService['NUM_PRIVATE_USE_AMOUNT_OD'][0]) + parseFloat(objPremiumService['NUM_PRIVATE_USE_AMOUNT_TP'][0]);
                                    premium_breakup['liability']['tp_basic_other_use'] = PRIVATE_USE;
                                    var OWN_PREMISES_1 = parseFloat(objPremiumService['LIMITED_OWN_PREMISES_AMT_BOD'][0]) + parseFloat(objPremiumService['LIMITED_OWN_PREMISES_AMT_TP'][0]) + parseFloat(objPremiumService['LIMITE_OWN_PREMISE_AMT_CNGOD'][0]);
                                    var OWN_PREMISES_2 = parseFloat(objPremiumService['LIMITED_OWN_PREMISE_AMT_EOD'][0]) + parseFloat(objPremiumService['LIMITED_OWN_PREMISE_AMT_NEOD'][0]);
                                    var OWN_PREMISES = OWN_PREMISES_1 + OWN_PREMISES_2;
                                    premium_breakup['own_damage']['od_disc_own_premises'] = OWN_PREMISES;
                                }
                                if (typeof this.premium_breakup_schema[key] === 'object') {
                                    var group_final = 0, group_final_key = '';
                                    for (var sub_key in this.premium_breakup_schema[key]) {
                                        var premium_key = this.premium_breakup_schema[key][sub_key];
                                        var premium_val = 0;
                                        if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                                            premium_val = parseInt(objPremiumService[premium_key]['0']);
                                        }
                                        premium_val = isNaN(premium_val) ? 0 : premium_val;
                                        premium_breakup[key][sub_key] = premium_val;
                                        if (sub_key.indexOf('final_') > -1) {
                                            group_final_key = sub_key;
                                        } else if (sub_key.indexOf('_disc') > -1) {
                                            group_final -= premium_val;
                                        } else if (sub_key === 'tp_cover_tppd') {
                                            group_final -= premium_val;
                                        } else if (sub_key.indexOf('_imt23') > -1) {
                                            if (objPremiumService.hasOwnProperty('NUM_INCLUSION_IMT23_AMT_OD') || objPremiumService.hasOwnProperty('NUM_INCLUSION_IMT23_AMT_CNG') || objPremiumService.hasOwnProperty('NUM_INCLUS_IMT23_AMT_ELEC') || objPremiumService.hasOwnProperty('NUM_INCLUS_IMT23_AMT_NELEC')) {
                                                group_final += Math.round(parseFloat(objPremiumService['NUM_INCLUSION_IMT23_AMT_OD'][0]) + parseFloat(objPremiumService['NUM_INCLUSION_IMT23_AMT_CNG'][0]) + parseFloat(objPremiumService['NUM_INCLUS_IMT23_AMT_ELEC'][0]) + parseFloat(objPremiumService['NUM_INCLUS_IMT23_AMT_NELEC'][0]));
                                            }
                                        } else {
                                            group_final += premium_val;
                                        }
                                    }
                                    premium_breakup[key][group_final_key] = group_final;
                                } else {
                                    var premium_key = this.premium_breakup_schema[key];
                                    var premium_val = 0;
                                    if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                                        premium_val = parseInt(objPremiumService[premium_key]['0']);
                                    }
                                    premium_val = isNaN(premium_val) ? 0 : premium_val;
                                    premium_breakup[key] = premium_val;
                                }
                                //up
                            }
                            if (parseInt(this.lm_request['product_id']) === 1 || parseInt(this.lm_request['product_id']) === 10) {
                                premium_breakup['net_premium'] = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'] + premium_breakup['addon']['addon_final_premium'];
                                premium_breakup['service_tax'] = premium_breakup['net_premium'] * 0.18;
                                premium_breakup['final_premium'] = premium_breakup['net_premium'] + premium_breakup['service_tax'];
                            }
                            objServiceHandler.Premium_Breakup = premium_breakup;
                            objServiceHandler.objPremiumService = objPremiumService;
                            if ((objInsurerProduct.prepared_request['vehicle_ncb_next'] - 0) > 0 && objServiceHandler.Premium_Breakup['own_damage']['od_disc_ncb'] === 0) {
                                Error_Msg = 'LM_NCB_NOT_RECEIVED';
                            }
                            //objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['getPremiumResult']['PREMIUMOUTPUT']['GUID'];
                        }
                    } else {
                        Error_Msg = objPremiumService['TXT_ERR_MSG']['0'] || objPremiumService['TXT_ERROR_MSG'];
                    }
                }
            }
        }
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', ex.stack);
    }
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
HDFCErgoMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var objInsurerProduct = this;
        var Insurer_Id = specific_insurer_object['insurer_id'];
        var IdvMethod = this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Idv');
        specific_insurer_object.method = IdvMethod;
        if (fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
            specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
        } else {
            specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
        }
        var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + IdvMethod.Method_Request_File).toString();
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
        this.service_call(docLog, objProduct, Insurer_Object, specific_insurer_object);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', ex);
    }
};
/*
 HDFCErgoMotor.prototype.customer_response_handler = function (objResponseJson) {
 console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
 var Error_Msg = 'NO_ERR';
 var objServiceHandler = {
 'Error_Msg': 'NO_ERR',
 'Insurer_Transaction_Identifier': null,
 'Premium_Breakup': null,
 'Payment': this.const_payment
 };
 try {
 if (objResponseJson.hasOwnProperty('GetBreakinProposalDataFinalPremiumResult')) {
 if (objResponseJson['GetBreakinProposalDataFinalPremiumResult'].hasOwnProperty('BreakinDTO')) {
 if (objResponseJson['GetBreakinProposalDataFinalPremiumResult']['BreakinDTO'].hasOwnProperty('ERR_MSG')) {
 Error_Msg = objResponseJson['GetBreakinProposalDataFinalPremiumResult']['BreakinDTO']['ERR_MSG'][0];
 } else {
 Error_Msg = objResponseJson['GetBreakinProposalDataFinalPremiumResult']['BreakinDTO'];
 }
 }
 } else {
 Error_Msg = "LM_GetBreakinProposalDataFinalPremiumResult_Node_Empty";
 }
 
 if (Error_Msg === 'NO_ERR') {
 if (this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.prepared_request['Plan_Name'] !== 'TP' && this.lm_request['is_inspection_done'] === 'yes') {
 var objCustomerData = JSON.parse(objResponseJson);
 var Customer = {
 'insurer_customer_identifier': objCustomerData
 };
 objServiceHandler.Customer = Customer;
 objServiceHandler.Insurer_Transaction_Identifier = objCustomerData.enquiryId;
 }
 }
 objServiceHandler.Error_Msg = Error_Msg;
 console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
 } catch (ex) {
 var Err = {
 'Type': 'LM',
 'Msg': ex.stack
 };
 objServiceHandler.Error_Msg = JSON.stringify(Err);
 console.error('Exception', this.constructor.name, 'customer_response_handler', ex);
 
 }
 return objServiceHandler;
 };
 */
HDFCErgoMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    try {
        if (this.insurer_lm_request['product_id'] === 1) {
            if (objResponseJson.hasOwnProperty('xmlstringResult')) {
                objResponseJson = objResponseJson['xmlstringResult'];
                if (objResponseJson['WsResult']['WsResultSet'][0]['WsStatus'][0] === "1") {
                    Error_Msg = objResponseJson['WsResult']['WsResultSet'][0]['WsMessage'][0];
                }
                //if ((objResponseJson['WsResult']['WsResultSet'][0]['WsStatus'][0] !== "1") && (this.lm_request['product_id'] === 1) && (this.lm_request['vehicle_insurance_type'] === 'renew') && (this.lm_request['is_breakin'] === 'yes'))
                if ((objResponseJson['WsResult']['WsResultSet'][0]['WsStatus'][0] !== "1") && this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_inspection_done'] === 'no' && (['1CH_0TP', '1OD_0TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1))
                {
                    var proposalno = objResponseJson['WsResult']['WsResultSet'][0]['WsMessage'][0];
                    if (proposalno !== '') {
                        var myobj = {
                            PB_CRN: parseInt(this.lm_request['crn']),
                            UD_Id: this.lm_request['udid'],
                            SL_Id: this.lm_request['slid'],
                            Request_Unique_Id: this.processed_request['___dbmaster_pb_request_unique_id___'],
                            Service_Log_Unique_Id: this.processed_request['___dbmaster_pb_service_log_unique_id___'],
                            Agent_Code: this.processed_request['___insurer_integration_agent_code___'],
                            Proposal_Number: proposalno,
                            Status: 'INSPECTION_SCHEDULED',
                            Registration_No: this.lm_request['registration_no'], //"MH-02-GG-5464",
                            Chassis_No: this.lm_request['chassis_number'],
                            Engine_No: this.lm_request['engine_number'],
                            Created_On: new Date(),
                            Modified_On: ''
                        };
                        var MongoClient = require('mongodb').MongoClient;
                        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                            if (err)
                                throw err;
                            var hdfcErgoBreakinId = db.collection('hdfcergo_breakins');
                            hdfcErgoBreakinId.insertOne(myobj, function (err, res) {
                                if (err)
                                    throw err;
                            });
                        });
                    } else {
                        Error_Msg = 'Inspection Id not found proposal_response_handler';
                    }
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }
        }

        if ((this.insurer_lm_request['product_id'] === 10)) {
            if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                if (objResponseJson.hasOwnProperty('xmlstringResult')) {
                    objResponseJson = objResponseJson['xmlstringResult'];
                    if (objResponseJson['WsResult']['WsResultSet'][0]['WsStatus'][0] === "1") {
                        Error_Msg = objResponseJson['WsResult']['WsResultSet'][0]['WsMessage'][0];
                    }
                } else {
                    Error_Msg = JSON.stringify(objResponseJson);
                }
            } else {
                if (objResponseJson.hasOwnProperty('GenerateTWTransNoResult')) {
                    objResponseJson = objResponseJson['GenerateTWTransNoResult'];
                    if (objResponseJson['WsResult']['WsResultSet'][0]['WsStatus'][0] === "1") {
                        Error_Msg = objResponseJson['WsResult']['WsResultSet'][0]['WsMessage'][0];
                    }
                } else {
                    Error_Msg = JSON.stringify(objResponseJson);
                }
            }
        }

        if (this.insurer_lm_request['product_id'] === 12) {
            if (objResponseJson.hasOwnProperty('xmlstringResult')) {
                objResponseJson = objResponseJson['xmlstringResult'];
                if (objResponseJson['WsResult']['WsResultSet'][0]['WsStatus'][0] === "1") {
                    Error_Msg = objResponseJson['WsResult']['WsResultSet'][0]['WsMessage'][0];
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }
        }

        if (Error_Msg.indexOf('Total Premium provided is incorrect') > -1) {
            let final_premium = this.find_text_btw_key(Error_Msg.toString(), '| Total Amount Payable : ', ' ||', false);
            final_premium = final_premium - 0;
            var objPremiumVerification = this.premium_verification(this.prepared_request['final_premium'], final_premium, 0, 0);
            if (objPremiumVerification.Status) {

            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
            //objServiceHandler.Payment.Premium_Verification = objPremiumVerification;
        }

        if (Error_Msg === 'NO_ERR') {
            var additionalInfo2Value = "";
            if (this.insurer_lm_request['product_id'] === 1) {
                additionalInfo2Value = "MOT";
            }
            if (this.insurer_lm_request['product_id'] === 10) {
                additionalInfo2Value = "TW";
            }
            if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {// For TP
                additionalInfo2Value = "MOTLP";
            }
            var proposalno = objResponseJson['WsResult']['WsResultSet'][0]['WsMessage'][0];
            //Motor Breakin Payment URL : http://202.191.196.210/UAT/OnlineProducts/MotorOnlineBreakin/TIM.aspx
            var pg_data = null;
            if ((this.insurer_lm_request['product_id'] === 12) && (this.prepared_request['Plan_Name'] !== 'TP')) {
                pg_data = {
                    'CustomerId': proposalno,
                    'TxnAmount': Math.round(this.lm_request['final_premium']),
                    'hdnPayMode': 'CC', //DD
                    'hndEMIMode': 'FULL',
                    'UserName': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                    'UserMailId': this.lm_request['email'],
                    'ProducerCd': this.prepared_request['insurer_integration_agent_code'] + '-' + proposalno
                };
            } else {
                pg_data = {
                    'CustomerId': proposalno,
                    'TxnAmount': Math.round(this.lm_request['final_premium']),
                    'AdditionalInfo1': 'NB',
                    'AdditionalInfo2': additionalInfo2Value,
                    'AdditionalInfo3': '1',
                    'hdnPayMode': 'CC', //DD
                    'UserName': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                    'UserMailId': this.lm_request['email'],
                    'ProductCd': additionalInfo2Value,
                    'ProducerCd': this.prepared_request['insurer_integration_agent_code'] + '-' + proposalno,
                    'ReturnURL': this.const_payment.pg_ack_url
                };
            }
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = proposalno;
            if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {// For TP
                if (config.environment.name.toString() === 'Production')
                {
                    objServiceHandler.Payment.pg_url = 'https://www.hdfcergo.com/OnlineProducts/MotorTPLOnline/TIM.aspx';
                } else {
                    objServiceHandler.Payment.pg_url = 'http://202.191.196.210/UAT/OnlineProducts/MotorTPLonline/TIM.aspx';
                }
            }

            if (this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_inspection_done'] === 'no' && (this.prepared_request['Plan_Name'] !== 'TP'))
            {
                var objRequestCore = {
                    'customer_name': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                    'crn': this.lm_request['crn'],
                    'vehicle_text': this.lm_request['vehicle_text'],
                    'insurer_name': 'HDFC ERGO GENERAL INSURANCE COMPANY LTD.',
                    'insurance_type': 'RENEW - Breakin Case',
                    'inspection_id': proposalno,
                    'final_premium': Math.round(this.lm_request['final_premium']),
                    'inspection_label': "*Note",
                    'inspection_link': 'HDFC ERGO GENERAL INSURANCE COMPANY LTD. will contact you.'
                };
                try {
                    var email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Breakin.html').toString();
                    var User_Data = require(appRoot + '/models/user_data');
                    var ud_cond = {"User_Data_Id": this.lm_request.udid - 0};
                    var emailto = this.lm_request['email'];
                    console.error('DBG', 'HDFCBreakin', ud_cond);
                    User_Data.findOne(ud_cond, function (err, dbUserData) {
                        try {
                            if (err) {
                                console.error('Exception', err);
                            } else {
                                console.error('DBG', 'HDFCBreakin', 'STEP1', dbUserData.User_Data_Id);
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
                                if (dbUserData.Premium_Request['posp_email_id'] !== 0 && dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                    email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                                }
                                var arr_bcc = [config.environment.notification_email];
                                if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== 0 && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
                                    if (dbUserData.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                        arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                    }
                                }
                                if (config.environment.name === 'Production') {
                                    if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                                        if ((dbUserData.Premium_Request['posp_sources'] - 0) === 1) {
                                            arr_bcc.push('transactions@magicfinmart.com'); //finmart-dc 
                                        }
                                    }
                                }
                                console.error('DBG', 'HDFCBreakin', 'STEP2', emailto, sub, email_data, email_agent, arr_bcc.join(','), dbUserData['PB_CRN']);
                                objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), dbUserData['PB_CRN']);
                            }
                        } catch (ex3) {
                            console.error('Exception', this.constructor.name, 'proposal_response_handler', 'breakin_email', ex3.stack);
                        }
                    });
                } catch (ex2) {
                    console.error('Exception', this.constructor.name, 'proposal_response_handler', ex2);
                }
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
    return objServiceHandler;
};
HDFCErgoMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.error('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
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
            //objInsurerProduct.prepared_request.policy_number = objPremiumService['PolicyNumber'];
            objInsurerProduct.const_policy.transaction_status = 'SUCCESS';
            var product_name = 'CAR';
            if (objInsurerProduct.lm_request['product_id'] === 10) {
                product_name = 'TW';
            }
            //var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.processed_request['___pg_reference_number_1___'] + '.pdf';
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + objInsurerProduct.prepared_request.policy_number + '.pdf';
            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
            objInsurerProduct.const_policy.policy_url = pdf_web_path;
            var Client = require('node-rest-client').Client;
            var client = new Client();
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
            objInsurerProduct.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
            objServiceHandler.Insurer_Transaction_Identifier = objInsurerProduct.prepared_request.transaction_id;
        }
        objServiceHandler.Policy = objInsurerProduct.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
HDFCErgoMotor.prototype.pg_response_handler_ver2 = function () {
    console.error('Log', this.constructor.name, 'pg_response_handler', this.const_payment_response);
    let objInsurerProduct = this;
    let obj_policy = {
        'policy_url': null,
        'policy_number': null,
        'policy_id': null,
        'transaction_status': null,
        'pg_status': null,
        'transaction_id': null,
        'transaction_amount': null,
        "pg_reference_number_1": null,
        "pg_reference_number_2": null,
        "pg_reference_number_3": null,
        'verification_request': null
    };
    try {
        if (objInsurerProduct.lm_request.pg_redirect_mode === 'GET') {
            if (objInsurerProduct.lm_request.pg_get.hasOwnProperty('Msg') && objInsurerProduct.lm_request.pg_get['Msg'].indexOf('Success') > -1) {
                obj_policy.pg_status = 'SUCCESS';
                if (objInsurerProduct.lm_request.pg_get['PolicyNo'] !== '') {
                    obj_policy.transaction_status = 'SUCCESS';
                    obj_policy.policy_number = objInsurerProduct.lm_request.pg_get['PolicyNo'];
                    obj_policy.pg_reference_number_1 = objInsurerProduct.lm_request.pg_get['PolicyNo'];
                } else {
                    obj_policy.transaction_status = 'PAYPASS';
                }
                obj_policy.transaction_amount = parseInt(objInsurerProduct.lm_request.pg_get['Amt']);
                obj_policy.transaction_id = objInsurerProduct.lm_request.pg_get['ProposalNo'];
            } else if (objInsurerProduct.lm_request.pg_get.hasOwnProperty('Msg') && objInsurerProduct.lm_request.pg_get['Msg'].indexOf('Success') < 0) {
                obj_policy.pg_message = objInsurerProduct.lm_request.pg_get['Msg'];
                obj_policy.pg_status = 'FAIL';
                obj_policy.transaction_status = 'FAIL';
                obj_policy.transaction_id = objInsurerProduct.lm_request.pg_get['ProposalNo'];
            } else {
                obj_policy.pg_status = 'FAIL';
                obj_policy.transaction_status = 'FAIL';
                obj_policy.transaction_id = objInsurerProduct.lm_request.pg_get['ProposalNo'];
            }
        }

        if (objInsurerProduct.lm_request.pg_redirect_mode === 'POST') {
            var msg = objInsurerProduct.lm_request.pg_post['hdmsg'];
            var str = msg.split('|');
            obj_policy.transaction_id = str[2];
            if (msg.indexOf('|0300|') > -1)
            {
                obj_policy.pg_status = 'SUCCESS';
                obj_policy.transaction_status = 'SUCCESS';
                obj_policy.policy_number = objInsurerProduct.lm_request.pg_post['txtPGCustCode'];
                obj_policy.pg_reference_number_1 = objInsurerProduct.lm_request.pg_post['txtPGCustCode'];
            } else {
                obj_policy.pg_status = 'FAIL';
                obj_policy.transaction_status = 'FAIL';
            }
        }
    } catch (ex) {
        obj_policy.exception = ex.stack;
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex.stack);
    }
    return obj_policy;
};
HDFCErgoMotor.prototype.pg_response_handler = function () {
    console.error('Log', this.constructor.name, 'pg_response_handler', this.const_payment_response);
    try {
        let objInsurerProduct = this;
        let obj_policy = {};
        if (objInsurerProduct.lm_request.pg_redirect_mode === 'GET') {
            if (objInsurerProduct.lm_request.pg_get.hasOwnProperty('Msg') && objInsurerProduct.lm_request.pg_get['Msg'].indexOf('Success') > -1) {
                this.const_policy.pg_status = 'SUCCESS';
                if (objInsurerProduct.lm_request.pg_get['PolicyNo'] !== '') {
                    this.const_policy.transaction_status = 'SUCCESS';
                    this.const_policy.policy_number = objInsurerProduct.lm_request.pg_get['PolicyNo'];
                    this.const_policy.pg_reference_number_1 = objInsurerProduct.lm_request.pg_get['PolicyNo'];
                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
                this.const_policy.transaction_amount = parseInt(objInsurerProduct.lm_request.pg_get['Amt']);
                this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_get['ProposalNo'];
            } else if (objInsurerProduct.lm_request.pg_get.hasOwnProperty('Msg') && objInsurerProduct.lm_request.pg_get['Msg'].indexOf('Success') < 0) {
                this.const_policy.pg_message = objInsurerProduct.lm_request.pg_get['Msg'];
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
                this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_get['ProposalNo'];
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
                this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_get['ProposalNo'];
            }
        }

        if (objInsurerProduct.lm_request.pg_redirect_mode === 'POST') {
            var msg = objInsurerProduct.lm_request.pg_post['hdmsg'];
            var str = msg.split('|');
            this.const_policy.transaction_id = str[2];
            if (msg.indexOf('|0300|') > -1)
            {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_status = 'SUCCESS';
                this.const_policy.policy_number = objInsurerProduct.lm_request.pg_post['txtPGCustCode'];
                this.const_policy.pg_reference_number_1 = objInsurerProduct.lm_request.pg_post['txtPGCustCode'];
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        }
        console.error('Log', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
HDFCErgoMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
HDFCErgoMotor.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    try {

        var Error_Msg = 'NO_ERR';
        var objPremiumService = objResponseJson;
        if (objPremiumService !== '' && objPremiumService !== null) {
            if (objPremiumService.hasOwnProperty('GetPSSPDFInBytesResult') && objPremiumService['GetPSSPDFInBytesResult'] !== '') {

            } else {
                Error_Msg = objPremiumService;
            }
        } else {
            Error_Msg = "LM_EMPTY_RESPONSE";
        }

        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            if (objPremiumService.hasOwnProperty('GetPSSPDFInBytesResult') && objPremiumService['GetPSSPDFInBytesResult'] !== '') {
                var product_name = 'CAR';
                if (this.lm_request['product_id'] === 10) {
                    product_name = 'TW';
                }
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'] + '.pdf';
                var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
                var binary = new Buffer(objPremiumService['GetPSSPDFInBytesResult'], 'base64');
                fs.writeFileSync(pdf_sys_loc, binary);
                policy.policy_url = pdf_web_path_portal;
                policy.pdf_status = 'SUCCESS';
            } else {
                policy.pdf_status = 'FAIL';
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.transaction_status = 'PAYPASS';
        }
        this.const_policy = policy;
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
HDFCErgoMotor.prototype.get_tp_date = function (datechange) {
    console.log('HDFCErgoMotor get_tp_date', 'start');
    let formatted_date = '';
    try {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        let current_datetime = datechange.split("-");
        formatted_date = current_datetime[2] + "-" + months[(parseInt(current_datetime[1]) - 1)] + "-" + current_datetime[0];
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'get_tp_date', ex);
        return formatted_date;
    }
    return formatted_date;
};
HDFCErgoMotor.prototype.get_cust_age = function () {
    console.log('HDFCErgoMotor get_cust_age', 'start');
    try {
        if (this.prepared_request['insured_age'] <= 35) {
            return 'Up to 35';
        } else if (this.prepared_request['insured_age'] > 45) {
            return 'More Than 45';
        } else {
            return '35 to 45';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'get_cust_age', ex);
    }
};
HDFCErgoMotor.prototype.policy_end_date_2 = function () {
    console.log('Start', this.constructor.name, 'policy_end_date_2');
    var pol_end_date = '';
    var policy_tenure = 1;
//    if (this.lm_request.hasOwnProperty('policy_tenure') && (this.lm_request['policy_tenure'] - 0) > 0) {
//        policy_tenure = (this.lm_request['policy_tenure'] - 0);
//    }
//end date for : 1ch+0tp = 1 year, 0ch+1tp = 1 year, 1ch+2tp = 1year, 1ch+4tp = 1 year, 2ch+0tp = 2 years, 3ch+0tp = 3 years, 5ch+0tp = 5 years
    try {
        pol_end_date = new Date();
        if (this.lm_request.hasOwnProperty('policy_od_tenure') && (this.lm_request['policy_od_tenure'] - 0) > 0) {
            policy_tenure = (this.lm_request['policy_od_tenure'] - 0);
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
                //pol_end_date.setDate(pol_end_date.getDate() + 1);
                //pol_end_date.setDate(today_date.getDate() + 1);
                pol_end_date.setFullYear(today_date.getFullYear() + policy_tenure);
            } else { // for not expired case
                var expiry_date = new Date(this.lm_request['policy_expiry_date']);
                var pol_end_date = expiry_date;
                pol_end_date.setFullYear(expiry_date.getFullYear() + policy_tenure);
            }
        }
        pol_end_date = this.date_format(pol_end_date, this.insurer_date_format);
        console.log('Finish', this.constructor.name, 'policy_end_date', pol_end_date);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'policy_end_date_2', ex);
        return pol_end_date;
    }
    return pol_end_date;
};
HDFCErgoMotor.prototype.insurer_dateFormat = function (date_txt) {
    console.log('Start', this.constructor.name, 'insurer_dateFormat');
    var dt_txt = '';
    try {
        dt_txt = date_txt.split("-");
        dt_txt = dt_txt[0] + "/" + dt_txt[1] + "/" + dt_txt[2];
        console.log("dt_txt : " + dt_txt);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_dateFormat', ex);
        return dt_txt;
    }
    return dt_txt;
};
HDFCErgoMotor.prototype.insurer_dateFormat2 = function (date_txt) {
    console.log('Start', this.constructor.name, 'insurer_dateFormat2');
    var expiry_date = '';
    try {
        var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        expiry_date = new Date(date_txt);
        var dd = expiry_date.getDate();
        if (dd < 10) {
            dd = '0' + dd;
        }

        var mmm = monthNames[expiry_date.getMonth()];
        var yyyy = expiry_date.getFullYear();
        expiry_date = dd + "-" + mmm + "-" + yyyy;
        console.log("expiry_date : " + expiry_date);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_dateFormat2', ex);
        return expiry_date;
    }
    return expiry_date;
};
HDFCErgoMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": 'NUM_BASIC_OD_PREMIUM',
        "od_elect_access": 'NUM_ELEC_ACC_PREM',
        "od_non_elect_access": 'NUM_NON_ELEC_ACC_PREM',
        "od_cng_lpg": 'NUM_LPG_CNGKIT_OD_PREM',
        "od_disc_ncb": 'NUM_NCB_PREM',
        "od_disc_vol_deduct": null,
        "od_disc_anti_theft": null,
        "od_disc_aai": null,
        "od_loading": null,
        "od_disc": 'NUM_OTHER_DISCOUNT_PREM',
        "od_disc_own_premises": "",
        "od_final_premium": 0
    },
    "liability": {
        "tp_basic": 'NUM_TP_RATE',
        "tp_cover_owner_driver_pa": 'NUM_PA_COVER_OWNER_DRVR',
        "tp_cover_unnamed_passenger_pa": 'NUM_UNNAMED_PA_PREM',
        "tp_cover_named_passenger_pa": 'NUM_NAMED_PA_PREM',
        "tp_cover_paid_driver_pa": 'NUM_PA_PAID_DRVR_PREM',
        "tp_cover_paid_driver_ll": 'NUM_LL_PAID_DRIVER',
        "tp_cng_lpg": 'NUM_LPG_CNGKIT_TP_PREM',
        "tp_cover_tppd": 'NUM_TPPD_AMT',
        "tp_cover_imt23": "",
        "tp_cover_fairing_paying_passenger": "NUM_FPP_PREMIUM",
        "tp_cover_non_fairing_paying_passenger": "NUM_NFPP_PREMIUM",
        "tp_basic_other_use": "",
        "tp_cover_emp_pa": "NUM_EMP_OF_INSRD_PREM",
        "tp_final_premium": 0
    },
    "addon": {
        "addon_zero_dep_cover": 'NUM_ZERO_DEPT_PREM',
        "addon_road_assist_cover": 'NUM_EMR_ASST_PREM',
        "addon_ncb_protection_cover": 'NUM_NCB_PROT_PREM',
        "addon_engine_protector_cover": 'NUM_ENG_GRBX_PREM',
        "addon_invoice_price_cover": 'NUM_RTI_PREM',
        "addon_key_lock_cover": "NUM_EMR_ASST_WIDER_PREM",
        "addon_consumable_cover": 'NUM_COST_CONSUMABLE_PREM',
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
        "addon_losstime_protection_cover": 'NUM_LOSS_USE_PREM',
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": 0
    },
    "net_premium": 'NUM_NET_PREMIUM',
    "service_tax": 'NUM_SERVICE_TAX',
    "final_premium": 'NUM_TOTAL_PREMIUM'
};
module.exports = HDFCErgoMotor;