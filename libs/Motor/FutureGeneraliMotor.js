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
function FutureGeneraliMotor() {

}
util.inherits(FutureGeneraliMotor, Motor);
FutureGeneraliMotor.prototype.lm_request_single = {};
FutureGeneraliMotor.prototype.insurer_integration = {};
FutureGeneraliMotor.prototype.insurer_addon_list = [];
FutureGeneraliMotor.prototype.insurer = {};
FutureGeneraliMotor.prototype.insurer_date_format = 'dd/MM/yyyy';
FutureGeneraliMotor.prototype.pdf_attempt = 0;
FutureGeneraliMotor.prototype.insurer_product_api_pre = function () {
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
FutureGeneraliMotor.prototype.insurer_product_field_process_pre = function () {
    console.log(this.constructor.name, 'insurer_product_field_process_pre', 'start');
    try {
        /*if (this.lm_request['product_id'] === 10 && this.lm_request['method_type'] === 'Verification') {
         this.method_content = this.proposal_processed_request['___dbmaster_insurer_request___'];
         }*/

        if (this.lm_request['method_type'] === 'Verification') {
            if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                this.method_content = this.method_content.toString().replace('___addon_flag___', 'N');
                this.method_content = this.method_content.toString().replace('<AddonReq>Y</AddonReq>', '<AddonReq>N</AddonReq>');
            }
            this.method_content = this.insurer_master['service_logs']['pb_db_master']['Insurer_Request'];
            var obj_replace = {
                "<Uid></Uid>": "<Uid>" + this.timestamp() + "</Uid>",
                "<UniqueTranKey></UniqueTranKey>": "<UniqueTranKey>___pg_reference_number_2___</UniqueTranKey>",
                "<TranRefNo></TranRefNo>": "<TranRefNo>___pg_reference_number_1___</TranRefNo>"
            };
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
            this.method_content = this.method_content.toString().replace('<ValidPUC>N</ValidPUC>', '<ValidPUC>Y</ValidPUC>');
        }

        this.prepared_request['timestamp'] = this.timestamp();
        this.processed_request['___timestamp___'] = this.prepared_request['timestamp'];
        this.method_content = this.method_content.replace('___timestamp___', this.prepared_request['timestamp']);

        if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
            if (this.lm_request['product_id'] === 1) {
                this.method_content = this.method_content.replace('<ContractType>___product_id___</ContractType>', '<ContractType>FVO</ContractType>');
                this.method_content = this.method_content.replace('<RiskType>___product_id___</RiskType>', '<RiskType>FVO</RiskType>');
                this.method_content = this.method_content.replace('<VehicleClass>___product_id___</VehicleClass>', '<VehicleClass>FPV</VehicleClass>');
                this.method_content = this.method_content.replace('<PolicyNo>___previous_policy_number___</PolicyNo>', '<PolicyNo>abc123</PolicyNo>');
            }

            this.prepared_request['is_pa_od'] = "N";
            this.processed_request['___is_pa_od___'] = this.prepared_request['is_pa_od'];
            this.method_content = this.method_content.replace('<!--OD_ONLY_START_2-->', '');
            this.method_content = this.method_content.replace('<!--OD_ONLY_FINISH_2-->', '');
            this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['InsurerName']; //this.Master_Details.tp_insurer['Insurer_Name'];
            this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];

            if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium') {
                this.prepared_request['tp_start_date'] = moment(this.prepared_request['pre_policy_start_date'], "YYYY-MM-DD").format("DD/MM/YYYY");
                this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
                this.prepared_request['tp_end_date'] = moment(this.prepared_request['policy_end_date'], "YYYY-MM-DD").format("DD/MM/YYYY");
                this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
            } else {
                this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                this.lm_request['tp_start_date'] = moment(this.lm_request['tp_start_date'], "DD-MM-YYYY").format("DD/MM/YYYY");
                this.lm_request['tp_end_date'] = moment(this.lm_request['tp_end_date'], "DD-MM-YYYY").format("DD/MM/YYYY");
                this.prepared_request['tp_start_date'] = this.lm_request['tp_start_date'];
                this.processed_request['___tp_start_date___'] = this.lm_request['tp_start_date'];
                this.prepared_request['tp_end_date'] = this.lm_request['tp_end_date'];
                this.processed_request['___tp_end_date___'] = this.lm_request['tp_end_date'];
            }
        } else {
            /*
             this.prepared_request['tp_insurer_code'] = "";
             this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
             this.prepared_request['tp_policy_number'] = "";
             this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
             this.prepared_request['tp_start_date'] = "";
             this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
             this.prepared_request['tp_end_date'] = "";
             this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
             this.method_content = this.method_content.replace('<TPPolicyEffdate>___tp_start_date___</TPPolicyEffdate>', '<TPPolicyEffdate></TPPolicyEffdate>');
             this.method_content = this.method_content.replace('<TPPolicyExpiryDate>___tp_end_date___</TPPolicyExpiryDate>', '<TPPolicyExpiryDate></TPPolicyExpiryDate>');
             */
            if (this.lm_request['is_pa_od'] === 'yes') {
                this.prepared_request['is_pa_od'] = "Y";
            } else {
                this.prepared_request['is_pa_od'] = "N";
            }
            this.processed_request['___is_pa_od___'] = this.prepared_request['is_pa_od'];
            var od_only_data_2 = this.find_text_btw_key(this.method_content.toString(), '<!--OD_ONLY_START_2-->', '<!--OD_ONLY_FINISH_2-->', false);
            this.method_content = this.method_content.replace(od_only_data_2, '');
            this.method_content = this.method_content.replace('<!--OD_ONLY_START_2-->', '');
            this.method_content = this.method_content.replace('<!--OD_ONLY_FINISH_2-->', '');
            //this.method_content = this.method_content.replace('<PANNo />', ''); 
        }

        //posp start
        if (this.lm_request['is_posp'] === 'yes' && false) {
            this.method_content = this.method_content.replace('___is_posp_2___', 'P');
            this.method_content = this.method_content.replace('___posp_pan_no___', this.lm_request['posp_pan_no']);
            this.method_content = this.method_content.replace('<ContractType>FVO</ContractType>', '<ContractType>PVO</ContractType>');
            if (parseInt(this.lm_request['product_id']) === 1 && this.lm_request['vehicle_insurance_subtype'] === '1CH_0TP') {
                this.method_content = this.method_content.replace('<ContractType>___product_id___</ContractType>', '<ContractType>PPV</ContractType>');
            }
            this.method_content = this.method_content.replace('<ContractType>F33</ContractType>', '<ContractType>P33</ContractType>');
            this.method_content = this.method_content.replace('<ContractType>F13</ContractType>', '<ContractType>P13</ContractType>');
        } else {
            this.method_content = this.method_content.replace('___is_posp_2___', '');
            this.method_content = this.method_content.replace('___posp_pan_no___', '');
        }
        //posp finish


        if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer') {
            if (this.lm_request['middle_name'] !== '') {
                this.method_content = this.method_content.replace('___last_name___', this.prepared_request['middle_name'] + ' ' + this.prepared_request['last_name']);
            } else {
                this.method_content = this.method_content.replace('___last_name___', this.prepared_request['last_name']);
            }

            if (this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "yes") {
                this.prepared_request['is_valid_pucc'] = "Y";
                this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];
            } else if (this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "no") {
                this.prepared_request['is_valid_pucc'] = "N";
                this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];
            } else {
                this.prepared_request['is_valid_pucc'] = "";
                this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];
            }
            // For Razorpay Wallet
            if (this.lm_request['method_type'] === 'Proposal' && this.lm_request.hasOwnProperty('pay_from')) {
                this.prepared_request['pay_from'] = "wallet";
                this.processed_request['___pay_from___'] = this.prepared_request['pay_from'];
            }
        }

        if (parseInt(this.lm_request['product_id']) === 1) {
            if (this.lm_request['is_external_bifuel'] === 'yes') {
                this.method_content = this.method_content.replace('<InbuiltKit>___is_external_bifuel___</InbuiltKit>', '<InbuiltKit>N</InbuiltKit>');
            }
            /*
             if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
             this.prepared_request['is_pa_od'] = "N";
             this.processed_request['___is_pa_od___'] = this.prepared_request['is_pa_od'];
             this.method_content = this.method_content.replace('<!--OD_ONLY_START_2-->', '');
             this.method_content = this.method_content.replace('<!--OD_ONLY_FINISH_2-->', '');
             this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
             this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
             this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Code'];//this.Master_Details.tp_insurer['Insurer_Name'];
             this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
             if (this.lm_request['method_type'] === 'Proposal') {
             this.lm_request['tp_start_date'] = moment(this.lm_request['tp_start_date'], "DD-MM-YYYY").format("DD/MM/YYYY");
             this.lm_request['tp_end_date'] = moment(this.lm_request['tp_end_date'], "DD-MM-YYYY").format("DD/MM/YYYY");
             this.prepared_request['tp_start_date'] = this.lm_request['tp_start_date'];
             this.processed_request['___tp_start_date___'] = this.lm_request['tp_start_date'];
             this.prepared_request['tp_end_date'] = this.lm_request['tp_end_date'];
             this.processed_request['___tp_end_date___'] = this.lm_request['tp_end_date'];
             }
             } else {
             if (this.lm_request['is_pa_od'] === 'yes') {
             this.prepared_request['is_pa_od'] = "Y";
             } else {
             this.prepared_request['is_pa_od'] = "N";
             }
             this.processed_request['___is_pa_od___'] = this.prepared_request['is_pa_od'];
             var od_only_data_2 = this.find_text_btw_key(this.method_content.toString(), '<!--OD_ONLY_START_2-->', '<!--OD_ONLY_FINISH_2-->', false);
             this.method_content = this.method_content.replace(od_only_data_2, '');
             this.method_content = this.method_content.replace('<!--OD_ONLY_START_2-->', '');
             this.method_content = this.method_content.replace('<!--OD_ONLY_FINISH_2-->', '');
             //this.method_content = this.method_content.replace('<PANNo />', ''); 
             }*/
        }

        //if (this.lm_request['vehicle_insurance_subtype'] !== '1CH_0TP' || this.lm_request['vehicle_insurance_subtype'] !== '1CH_4TP') {
        if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            this.prepared_request['vehicle_expected_idv'] = 0;
            this.processed_request['___vehicle_expected_idv___'] = 0;
            /* //As discussed with FG Team, allow discount in TP policy also.
             this.prepared_request['own_damage_disc_rate'] = 0;
             this.processed_request['___own_damage_disc_rate___'] = 0;
             this.method_content = this.method_content.toString().replace('<Discount>___own_damage_disc_rate___</Discount>', '');
             */
            if (this.lm_request['is_policy_exist'] === 'no' && parseInt(this.lm_request['product_id']) === 1) {
                var pyp_no = this.find_text_btw_key(this.method_content.toString(), '<!--PYP_START-->', '<!--PYP_FINISH-->', true);
                //this.method_content = this.method_content.replace(pyp_no, '');
                //this.method_content = this.method_content.replace('<!--PYP_START-->', '');
                //this.method_content = this.method_content.replace('<!--PYP_FINISH-->', '');
                this.method_content = this.method_content.replace('<UsedCar>N</UsedCar>', '<UsedCar>Y</UsedCar>');
                this.method_content = this.method_content.replace('<PurchaseDate />', '<PurchaseDate>___vehicle_registration_date___</PurchaseDate>');
                this.method_content = this.method_content.replace('<RollOver>___vehicle_insurance_type___</RollOver>', '<RollOver>N</RollOver>');


                this.method_content = this.method_content.toString().replace('___previous_policy_number___', '');
                this.method_content = this.method_content.toString().replace('___dbmaster_insurername___', '');
                this.method_content = this.method_content.toString().replace('___policy_expiry_date___', '');
                this.method_content = this.method_content.toString().replace('___dbmaster_previousinsurer_code___', '');
                this.method_content = this.method_content.toString().replace('___is_claim_exists___', 'Y');
                this.method_content = this.method_content.toString().replace('<NCBDeclartion>Y</NCBDeclartion>', '<NCBDeclartion>N</NCBDeclartion>');
                this.method_content = this.method_content.toString().replace('___vehicle_ncb_current___', '');
                this.method_content = this.method_content.toString().replace('___vehicle_insurance_type_2___', '');
            }
        }
        /*else {
         if (this.lm_request['is_claim_exists'] === 'yes') {
         this.method_content = this.method_content.toString().replace('<Discount>___own_damage_disc_rate___</Discount>', '<Discount>0</Discount>');
         }
         }*/

        if (parseInt(this.lm_request['product_id']) !== 12) {
            if (this.lm_request.hasOwnProperty('ss_id') && (this.lm_request['ss_id'] - 0) > 0) {
                this.prepared_request['insurer_integration_service_password'] = 'LANINS';
                this.processed_request['___insurer_integration_service_password___'] = 'LANINS';

                this.prepared_request['insurer_integration_agent_code'] = '60057104';
                this.processed_request['___insurer_integration_agent_code___'] = '60057104';

                //for rto code
                /*if (true || this.prepared_request['dbmaster_insurer_rto_city_code'] == '' || this.prepared_request['dbmaster_insurer_rto_city_code'] =='#N/A') {
                 this.prepared_request['insurer_integration_location_code'] = '2J';
                 this.processed_request['___insurer_integration_location_code___'] = '2J';
                 }
                 else{
                 this.prepared_request['insurer_integration_location_code'] = this.prepared_request['dbmaster_insurer_rto_city_code'];
                 this.processed_request['___insurer_integration_location_code___'] = this.prepared_request['dbmaster_insurer_rto_city_code'];
                 }
                 this.prepared_request['insurer_integration_location_code'] = '2J';
                 this.processed_request['___insurer_integration_location_code___'] = '2J';*/

                /*if (this.prepared_request['own_damage_disc_rate'] === -1) {
                 this.method_content = '<PolicyBoss>Declined in Discount Grid</PolicyBoss>';
                 }*/
            }
            /*this.prepared_request['insurer_integration_location_code'] = '2J';
             this.processed_request['___insurer_integration_location_code___'] = '2J';*/


            /*else {
             this.method_content = this.method_content.toString().replace('<Discount>___own_damage_disc_rate___</Discount>', '');
             }*/
        }

        if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Idv') {
            this.method_content = this.method_content.toString().replace('<Discount>___own_damage_disc_rate___</Discount>', '');
        }

        //for addons
        //var vehicle_age = this.vehicle_age_year();
        /*if (this.lm_request.hasOwnProperty('ss_id') && (this.lm_request['ss_id'] - 0) > 0 && vehicle_age < 5) {
         if (this.lm_request['addon_zero_dep_cover'] == 'yes' && (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer')) {
         this.prepared_request['addon_package_name'] = 'PLAN1';
         this.processed_request['___addon_package_name___'] = 'PLAN1';
         this.prepared_request['addon_flag'] = 'Y';
         this.processed_request['___addon_flag___'] = 'Y';
         } else if (this.prepared_request['addon_package_name'] === 'PLAN1' && (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Verification')) {
         this.prepared_request['addon_flag'] = 'Y';
         this.processed_request['___addon_flag___'] = 'Y';
         } else {
         this.prepared_request['addon_flag'] = 'N';
         this.processed_request['___addon_flag___'] = 'N';
         }
         } else */

        let customer_temp_flag = false;
        if ((this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') && this.processed_request.hasOwnProperty('___dbmaster_pb_plan_name___')) {
            if (this.processed_request['___dbmaster_pb_plan_name___'] !== '' && this.processed_request['___dbmaster_pb_plan_name___'] !== null && this.processed_request['___dbmaster_pb_plan_name___'] !== 'undefined') {
                customer_temp_flag = true;
            }
            if (this.processed_request['___dbmaster_plan_name___'] !== '' && this.processed_request['___dbmaster_plan_name___'] !== null && this.processed_request['___dbmaster_plan_name___'] !== 'undefined') {
                customer_temp_flag = true;
            }
            if (customer_temp_flag) {
                let plans_temp = null;
                if (config.environment.name === 'Production') {
                    if (parseInt(this.lm_request['product_id']) === 1) {
                        plans_temp = {'4': 'Basic', '53': 'ODOnly', '79': 'TPOnly', '108': 'STRSA', '109': 'STZDP', '110': 'ZDCNS', '111': 'ZDCNE', '112': 'ZDCNT', '113': 'ZDCET', '114': 'ZCETR', '115': 'STNCB', '116': 'STINC', '117': 'RSPBK'};
                    }
                    if (parseInt(this.lm_request['product_id']) === 10) {
                        plans_temp = {'4': 'Basic', '53': 'ODOnly', '79': 'TPOnly', '108': 'STRSA', '109': 'STZDP', '110': 'ZDCNS', '111': 'ZDCNE', '112': 'ZDCNT', '113': 'ZDCET', '114': 'ZCETR', '117': 'RSPBK'};
                    }
                } else {
                    if (parseInt(this.lm_request['product_id']) === 1) {
                        plans_temp = {'4': 'Basic', '53': 'ODOnly', '54': 'TPOnly', '108': 'STRSA', '109': 'STZDP', '110': 'ZDCNS', '111': 'ZDCNE', '112': 'ZDCNT', '113': 'ZDCET', '114': 'ZCETR', '115': 'STNCB', '116': 'STINC', '107': 'RSPBK'};
                    }
                    if (parseInt(this.lm_request['product_id']) === 10) {
                        plans_temp = {'4': 'Basic', '53': 'ODOnly', '54': 'TPOnly', '108': 'STRSA', '109': 'STZDP', '110': 'ZDCNS', '111': 'ZDCNE', '112': 'ZDCNT', '113': 'ZDCET', '114': 'ZCETR', '107': 'RSPBK'};
                    }
                }
                let plan_id_temp = this.insurer_master.service_logs.pb_db_master.Plan_Id;
                let pck_name = plans_temp[plan_id_temp];

                if (pck_name === 'Basic' || pck_name === 'ODOnly' || pck_name === 'TPOnly') {
                    pck_name = null;
                }

                if (pck_name !== '' && pck_name !== null && pck_name !== 'undefined') {
                    this.prepared_request['addon_package_name'] = pck_name;
                    this.processed_request['___addon_package_name___'] = pck_name;
                    this.prepared_request['addon_flag'] = 'Y';
                    this.processed_request['___addon_flag___'] = 'Y';
                } else {
                    this.prepared_request['addon_package_name'] = '';
                    this.processed_request['___addon_package_name___'] = '';
                    this.prepared_request['addon_flag'] = 'N';
                    this.processed_request['___addon_flag___'] = 'N';
                }
            } else {
                this.prepared_request['addon_package_name'] = '';
                this.processed_request['___addon_package_name___'] = '';
                this.prepared_request['addon_flag'] = 'N';
                this.processed_request['___addon_flag___'] = 'N';
            }
        } else {
            //if (customer_temp_flag || (this.lm_request.hasOwnProperty('ss_id') && (this.lm_request['ss_id'] - 0) > 0)) {
            if (this.lm_request.hasOwnProperty('ss_id') && (this.lm_request['ss_id'] - 0) > 0) {
                let plans_obj_7 = ['RSPBK', 'STRSA', 'STZDP', 'ZDCNS', 'ZDCNE'];
                let plans_obj_5 = [];
                let plans_obj_3 = ['ZCETR'];
                var check_age = false;

                if (parseInt(this.lm_request['product_id']) === 10) {
                    plans_obj_5 = ['ZDCNT', 'ZDCET'];
                }

                if (parseInt(this.lm_request['product_id']) === 1) {
                    plans_obj_5 = ['ZDCNT', 'ZDCET', 'STNCB', 'STINC'];
                }

                if (this.prepared_request['addon_package_name'] !== '') {
                    if ((plans_obj_7.indexOf(this.prepared_request['addon_package_name']) > -1)
                            || (plans_obj_5.indexOf(this.prepared_request['addon_package_name']) > -1)
                            || (plans_obj_3.indexOf(this.prepared_request['addon_package_name']) > -1)) {
                        check_age = true;
                    } else {
                        this.prepared_request['addon_package_name'] = '';
                        this.processed_request['___addon_package_name___'] = '';
                        this.prepared_request['addon_flag'] = 'N';
                        this.processed_request['___addon_flag___'] = 'N';
                    }

                    if (check_age === true) {
                        this.prepared_request['addon_flag'] = 'Y';
                        this.processed_request['___addon_flag___'] = 'Y';

                        if ((this.prepared_request['vehicle_age_year'] < 3) && ((plans_obj_7.indexOf(this.prepared_request['addon_package_name']) > -1) || (plans_obj_5.indexOf(this.prepared_request['addon_package_name']) > -1))) {
                            this.method_content = "";
                        } else if ((this.prepared_request['vehicle_age_year'] < 5) && (plans_obj_7.indexOf(this.prepared_request['addon_package_name']) > -1)) {
                            this.method_content = "";
                        } else if ((this.prepared_request['vehicle_age_year'] > 7) && ((plans_obj_7.indexOf(this.prepared_request['addon_package_name']) > -1) || (plans_obj_5.indexOf(this.prepared_request['addon_package_name']) > -1) || (plans_obj_3.indexOf(this.prepared_request['addon_package_name']) > -1))) {
                            this.method_content = "";
                        } else {
                        }
                    }
                } else {
                    this.prepared_request['addon_package_name'] = '';
                    this.processed_request['___addon_package_name___'] = '';
                    this.prepared_request['addon_flag'] = 'N';
                    this.processed_request['___addon_flag___'] = 'N';
                }
            } else {
                this.prepared_request['addon_package_name'] = '';
                this.processed_request['___addon_package_name___'] = '';
                this.prepared_request['addon_flag'] = 'N';
                this.processed_request['___addon_flag___'] = 'N';
            }
        }

        this.prepared_request['dbmaster_insurer_vehicle_fueltype'] = this.prepared_request['dbmaster_insurer_vehicle_fueltype'][0];
        this.processed_request['___dbmaster_insurer_vehicle_fueltype___'] = this.prepared_request['dbmaster_insurer_vehicle_fueltype'];

        if (parseInt(this.lm_request['product_id']) === 1) {
            this.prepared_request['dbmaster_insurer_vehicle_insurer_bodytype'] = 'SOLO';
            this.processed_request['___dbmaster_insurer_vehicle_insurer_bodytype___'] = this.prepared_request['dbmaster_insurer_vehicle_insurer_bodytype'];
        }
        if (parseInt(this.lm_request['product_id']) === 10) {
            this.prepared_request['dbmaster_insurer_vehicle_insurer_bodytype'] = 'BIKE';
            this.processed_request['___dbmaster_insurer_vehicle_insurer_bodytype___'] = this.prepared_request['dbmaster_insurer_vehicle_insurer_bodytype'];
        }

        var common_replace = {
            'electrical_accessory': '',
            'non_electrical_accessory': '',
            'pa_owner_driver_si': '',
            'pa_unnamed_passenger_si': '',
            'pa_named_passenger_si': '',
            'pa_paid_driver_si': '',
            'voluntary_deductible': '',
            'previous_policy_number': 'abc123'
        };

        for (var key in common_replace) {
            if (!this.insurer_lm_request.hasOwnProperty(key) || (this.insurer_lm_request[key] - 0) < 1 || this.insurer_lm_request[key] === '') {
                var value = common_replace[key];
                this.method_content = this.method_content.toString().replace('___' + key + '___', value);
            }
        }

        if (this.lm_request.hasOwnProperty('registration_no') && this.lm_request['registration_no'] !== '') {
            this.prepared_request['registration_no'] = this.lm_request['registration_no'].toString().replace(/\-/g, '');
            this.processed_request['___registration_no___'] = this.prepared_request['registration_no'];
        }
        if (parseInt(this.lm_request['product_id']) === 1) {
            if (this.lm_request['vehicle_insurance_type'] === 'renew' && config.environment.name !== 'Production') {
                this.prepared_request['dbmaster_previousinsurer_code'] = '40012604';
                this.processed_request['___dbmaster_previousinsurer_code___'] = '40012604';
                this.prepared_request['dbmaster_insurername'] = 'Bajaj Allianz General Insurance Co. Ltd.';
                this.processed_request['___dbmaster_insurername___'] = 'Bajaj Allianz General Insurance Co. Ltd.';
            }
        } else {
            if (this.lm_request['vehicle_insurance_type'] === 'renew' && config.environment.name !== 'Production' && this.lm_request['vehicle_insurance_subtype'] === '0CH_1TP') {
                this.prepared_request['dbmaster_previousinsurer_code'] = '40062645';
                this.processed_request['___dbmaster_previousinsurer_code___'] = '40062645';
                this.prepared_request['dbmaster_insurername'] = 'Bajaj Allianz General Insurance Co. Ltd.';
                this.processed_request['___dbmaster_insurername___'] = 'Bajaj Allianz General Insurance Co. Ltd.';
            }
        }
        // for cv changes start
        if (parseInt(this.lm_request['product_id']) === 12) {
            if (this.lm_request['method_type'] === 'Proposal') {
                if ((this.processed_request['___chassis_number___']).length < 17) {
                    var chassis_no_len = (this.processed_request['___chassis_number___']).length;
                    var add_zero = 17 - parseInt((this.processed_request['___chassis_number___']).length);
                    var num_zero = "";
                    if (add_zero > 0) {
                        for (var z = 0; z < add_zero; z++) {
                            num_zero += "0";
                        }
                    }
                    var chassis_no = (this.processed_request['___chassis_number___']);
                    chassis_no = num_zero + chassis_no;
                    this.prepared_request['chassis_number'] = chassis_no;
                    this.processed_request['___chassis_number___'] = chassis_no;
                }
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.method_content = this.method_content.toString().replace('___dbmaster_pb_insurer_name___', "");
                this.method_content = this.method_content.toString().replace('___dbmaster_pb_previousinsurer_pincode___', "");
                //this.method_content = this.method_content.toString().replace('___dbmaster_pb_previousinsurer_address___', "");
                for (var i = 1; i < 6; i++) {
                    this.method_content = this.method_content.toString().replace('___previousinsurer_address_' + i + '___', "");
                }
                this.method_content = this.method_content.toString().replace('___dbmaster_pb_insurer_code___', "");
                this.method_content = this.method_content.toString().replace('___dbmaster_pb_previousinsurer_pincode___', "");
                this.method_content = this.method_content.toString().replace('___registration_no___', "");
            }
            if (this.lm_request['___vehicle_insurance_subtype___'] === '0CH_1TP') {
                // this.method_content = this.method_content.toString().replace('___vehicle_expected_idv___', '0');
                this.method_content = this.method_content.toString().replace('___vehicle_ncb_next___', '0');

            }
            if (this.lm_request['vehicle_class'] === 'gcv')
            {
                if (this.lm_request['vehicle_sub_class'] === 'gcv_public_otthw') {
                    this.prepared_request['vehicle_class_3'] = 'O';
                    this.processed_request['___vehicle_class_3___'] = 'O';
                    this.prepared_request['vehicle_class_2'] = 'A1';
                    this.processed_request['___vehicle_class_2___'] = 'A1';
                } else if (this.lm_request['vehicle_sub_class'] === 'gcv_private_otthw') {
                    this.prepared_request['vehicle_class_3'] = 'O';
                    this.processed_request['___vehicle_class_3___'] = 'O';
                    this.prepared_request['vehicle_class_2'] = 'A2';
                    this.processed_request['___vehicle_class_2___'] = 'A2';
                } else if (this.lm_request['vehicle_sub_class'] === 'gcv_public_thwpc') {
                    this.prepared_request['vehicle_class_3'] = 'W';
                    this.processed_request['___vehicle_class_3___'] = 'W';
                    this.prepared_request['vehicle_class_2'] = 'A3';
                    this.processed_request['___vehicle_class_2___'] = 'A3';
                } else if (this.lm_request['vehicle_sub_class'] === 'gcv_private_thwpc') {
                    this.prepared_request['vehicle_class_3'] = 'W';
                    this.processed_request['___vehicle_class_3___'] = 'W';
                    this.prepared_request['vehicle_class_2'] = 'A4';
                    this.processed_request['___vehicle_class_2___'] = 'A4';
                }
            }
            if (this.lm_request['vehicle_class'] === 'pcv')
            {
                if (this.lm_request['vehicle_sub_class'] === 'pcv_fw_lt6pass') {
                    this.prepared_request['vehicle_class_3'] = 'O';
                    this.processed_request['___vehicle_class_3___'] = 'O';
                    this.prepared_request['vehicle_class_2'] = 'CA';
                    this.processed_request['___vehicle_class_2___'] = 'CA';
                } else if (this.lm_request['vehicle_sub_class'] === 'pcv_thw_lt6pass') {
                    this.prepared_request['vehicle_class_3'] = 'W';
                    this.processed_request['___vehicle_class_3___'] = 'W';
                    this.prepared_request['vehicle_class_2'] = 'CB';
                    this.processed_request['___vehicle_class_2___'] = 'CB';
                } else if (this.lm_request['vehicle_sub_class'] === 'pcv_fw_gt6pass') {
                    this.prepared_request['vehicle_class_3'] = 'O';
                    this.processed_request['___vehicle_class_3___'] = 'O';
                    this.prepared_request['vehicle_class_2'] = 'C2';
                    this.processed_request['___vehicle_class_2___'] = 'C2';
                } else if (this.lm_request['vehicle_sub_class'] === 'pcv_thw_between6to17pass') {
                    this.prepared_request['vehicle_class_3'] = 'W';
                    this.processed_request['___vehicle_class_3___'] = 'W';
                    this.prepared_request['vehicle_class_2'] = 'C3';
                    this.processed_request['___vehicle_class_2___'] = 'C3';
                } else if (this.lm_request['vehicle_sub_class'] === 'pcv_tw') {
                    this.prepared_request['vehicle_class_3'] = 'T';
                    this.processed_request['___vehicle_class_3___'] = 'T';
                    this.prepared_request['vehicle_class_2'] = 'C4';
                    this.processed_request['___vehicle_class_2___'] = 'C4';
                }
            }
        }
        // for cv changes end

        if (parseInt(this.lm_request['product_id']) !== 12) {
            if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer') {
                let objResponseJson = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response'];
                objResponseJson = objResponseJson['Root'];
                var objPremiumService = objResponseJson['Policy'][0];

                let insurer_breakup = {};
                for (let keyCover in objPremiumService['NewDataSet'][0]['Table1']) {
                    let premium_val = 0;
                    let insurer_key = objPremiumService['NewDataSet'][0]['Table1'][keyCover]['Type'][0].toString().replace(/ /g, '') + '-' + objPremiumService['NewDataSet'][0]['Table1'][keyCover]['Code'][0].toString().replace(/ /g, '_');

                    premium_val = objPremiumService['NewDataSet'][0]['Table1'][keyCover]['BOValue'][0] - 0;
                    premium_val = isNaN(premium_val) ? 0 : premium_val;
                    insurer_breakup[insurer_key] = premium_val;
                }
                let od_disc_load = insurer_breakup['OD-DISCPERC'];
                this.prepared_request['own_damage_disc_rate'] = od_disc_load;
                this.processed_request['___own_damage_disc_rate___'] = od_disc_load;
            }
        }

        /*if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Verification') {
         var LM_Custom_Request = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request'];
         if (LM_Custom_Request.hasOwnProperty('own_damage_disc_rate')) {
         this.prepared_request['own_damage_disc_rate'] = LM_Custom_Request['own_damage_disc_rate'];
         this.processed_request['___own_damage_disc_rate___'] = LM_Custom_Request['own_damage_disc_rate'];
         }
         }*/

        // for TW changes start
        if (parseInt(this.lm_request['product_id']) === 10) {
            /*if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
             this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Code']; //this.Master_Details.tp_insurer['Insurer_Name'];
             this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
             } else {
             this.prepared_request['tp_insurer_code'] = "";
             this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
             }
             
             if (this.lm_request['vehicle_insurance_subtype'] !== '1OD_0TP') {
             this.method_content = this.method_content.toString().replace('<PreviousInsurer>___dbmaster_insurername___</PreviousInsurer>', '<PreviousInsurer></PreviousInsurer>');
             this.method_content = this.method_content.toString().replace('<TPPolicyNumber>___tp_policy_number___</TPPolicyNumber>', '<TPPolicyNumber></TPPolicyNumber>');
             this.method_content = this.method_content.toString().replace('<TPPolicyNumber>abc123</TPPolicyNumber>', '<TPPolicyNumber></TPPolicyNumber>');
             this.method_content = this.method_content.toString().replace('<TPPolicyEffdate>___tp_start_date___</TPPolicyEffdate>', '<TPPolicyEffdate></TPPolicyEffdate>');
             this.method_content = this.method_content.toString().replace('<TPPolicyExpiryDate>___tp_end_date___</TPPolicyExpiryDate>', '<TPPolicyExpiryDate></TPPolicyExpiryDate>');
             }*/

            if (this.lm_request['vehicle_insurance_subtype'] === '0CH_1TP') {

                this.method_content = this.method_content.toString().replace('___product_id_2___', '');
                //this.method_content = this.method_content.toString().replace('___is_cpa_year___', '1');
                this.prepared_request['vehicle_insurance_subtype'] = 'LO';
                this.processed_request['___vehicle_insurance_subtype___'] = this.prepared_request['vehicle_insurance_subtype'];
                this.method_content = this.method_content.toString().replace('<CPAReq>___is_pa_od___</CPAReq>', '<CPAReq>N</CPAReq>');
            }

            if (this.lm_request['vehicle_insurance_subtype'] === '1CH_0TP') {

                this.method_content = this.method_content.toString().replace('___product_id_2___', '');
                //this.prepared_request['is_cpa_year'] = '1';
                //this.processed_request['___is_cpa_year___'] = this.prepared_request['is_cpa_year'];
                this.prepared_request['vehicle_insurance_subtype'] = 'CO';
                this.processed_request['___vehicle_insurance_subtype___'] = this.prepared_request['vehicle_insurance_subtype'];
                this.method_content = this.method_content.toString().replace('<CPAReq>___is_pa_od___</CPAReq>', '<CPAReq>N</CPAReq>');
            }

            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                if (this.lm_request['is_pa_od'] === 'yes' && this.lm_request.hasOwnProperty('cpa_tenure') && this.lm_request['cpa_tenure'] !== null && this.lm_request['cpa_tenure'] !== '' && this.lm_request['cpa_tenure'] !== undefined) {
                    if (parseInt(this.lm_request['cpa_tenure']) > 0) {
                        this.prepared_request['is_cpa_year'] = this.lm_request['cpa_tenure'];
                        this.processed_request['___is_cpa_year___'] = this.prepared_request['is_cpa_year'];
                        this.method_content = this.method_content.toString().replace('___is_cpa_year___', this.lm_request['cpa_tenure']);
                    } else {
                        this.prepared_request['is_cpa_year'] = 1;
                        this.processed_request['___is_cpa_year___'] = this.prepared_request['is_cpa_year'];
                        this.method_content = this.method_content.toString().replace('___is_cpa_year___', this.lm_request['cpa_tenure']);
                    }
                }

                if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
                    this.method_content = this.method_content.toString().replace(' <Address1>def</Address1>', ' <Address1></Address1>');
                    this.method_content = this.method_content.toString().replace('<Address2>def</Address2>', '<Address2></Address2>');
                    this.method_content = this.method_content.toString().replace('<Address3>def</Address3>', '<Address3></Address3>');
                    this.method_content = this.method_content.toString().replace('<Address4>def</Address4>', '<Address4></Address4>');
                    this.method_content = this.method_content.toString().replace('<Address5>def</Address5>', '<Address5></Address5>');
                    this.method_content = this.method_content.toString().replace('<PinCode>400053</PinCode>', '<PinCode></PinCode>');
                    this.method_content = this.method_content.toString().replace('<PolicyNo>abc123</PolicyNo>', '<PolicyNo></PolicyNo>');
                    this.method_content = this.method_content.toString().replace('<PreviousPolExpDt>___policy_expiry_date___</PreviousPolExpDt>', '<PreviousPolExpDt></PreviousPolExpDt>');
                }
            }

            if (this.lm_request['vehicle_insurance_subtype'] === '1CH_4TP' && this.lm_request['vehicle_insurance_type'] === 'new') {
                if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
                    this.prepared_request['vehicle_insurance_subtype'] = 'CO';
                    this.processed_request['___vehicle_insurance_subtype___'] = this.prepared_request['vehicle_insurance_subtype'];
                    this.prepared_request['policy_end_date'] = this.processed_request['___policy_end_date_extended___'];
                    this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];
                    this.method_content = this.method_content.toString().replace('<NCBDeclartion></NCBDeclartion>', '<NCBDeclartion>N</NCBDeclartion>');
                    this.method_content = this.method_content.toString().replace('<ClaimInExpiringPolicy>___is_claim_exists___</ClaimInExpiringPolicy>', ' <ClaimInExpiringPolicy>N</ClaimInExpiringPolicy>');
                }
                this.method_content = this.method_content.toString().replace('<RiskType>___product_id___</RiskType>', '<RiskType>F15</RiskType>');
                //this.method_content = this.method_content.toString().replace('<CPAYear>___is_cpa_year___</CPAYear>', '<CPAYear>5</CPAYear>');
                this.method_content = this.method_content.toString().replace('<VehicleClass>___product_id_2___</VehicleClass>', '<VehicleClass></VehicleClass>');
                this.method_content = this.method_content.toString().replace('<Cover>___vehicle_insurance_subtype___</Cover>', '<Cover>CO</Cover>');
                this.method_content = this.method_content.toString().replace('<ContractType>___product_id___</ContractType>', '<ContractType>F15</ContractType>');
                this.method_content = this.method_content.toString().replace('<VehicleClass>___product_id_2___</VehicleClass>', '<VehicleClass></VehicleClass>');
                this.method_content = this.method_content.toString().replace('<CPAReq>___is_pa_od___</CPAReq>', '<CPAReq>Y</CPAReq>');
                this.method_content = this.method_content.toString().replace('<PreviousPolExpDt>___policy_expiry_date___</PreviousPolExpDt>', '<PreviousPolExpDt></PreviousPolExpDt>');

                this.method_content = this.method_content.toString().replace('<PreviousInsurer>___tp_insurer_code___</PreviousInsurer>', '<PreviousInsurer></PreviousInsurer>');
                if (this.lm_request['method_type'] === 'Proposal') {

                    this.prepared_request['policy_end_date'] = moment(moment(this.prepared_request['policy_start_date']).add(5, "years")).subtract(1, "days").format('DD/MM/YYYY');
                    this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];

                    this.method_content = this.method_content.toString().replace('<RegistrationNo>___registration_no___</RegistrationNo>', '<RegistrationNo></RegistrationNo>');
                    this.method_content = this.method_content.toString().replace('<ValidPUC>___is_valid_pucc___</ValidPUC>', '<ValidPUC></ValidPUC>');
                    //this.method_content = this.method_content.toString().replace('<Address1>___dbmaster_pb_previousinsurer_address___</Address1>', '<Address1></Address1>');
                    //this.method_content = this.method_content.toString().replace('<Address2>___dbmaster_pb_previousinsurer_address___</Address2>', '<Address2></Address2>');
                    //this.method_content = this.method_content.toString().replace('<Address3>___dbmaster_pb_previousinsurer_address___</Address3>', '<Address3></Address3>');
                    for (var i = 1; i < 6; i++) {
                        this.method_content = this.method_content.toString().replace('___previousinsurer_address_' + i + '___', "");
                    }
                    this.method_content = this.method_content.toString().replace('<PinCode>___dbmaster_pb_previousinsurer_pincode___</PinCode>', '<PinCode></PinCode>');

                }
            }

            if (this.lm_request['vehicle_insurance_subtype'] === '0CH_5TP' && this.lm_request['vehicle_insurance_type'] === 'new') {
                if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
                    this.method_content = this.method_content.toString().replace('<NCBDeclartion></NCBDeclartion>', '<NCBDeclartion></NCBDeclartion>');
                }
                this.method_content = this.method_content.toString().replace('<ContractType>___product_id___</ContractType>', '<ContractType>F15</ContractType>');
                this.method_content = this.method_content.toString().replace('<RiskType>___product_id___</RiskType>', '<RiskType>F15</RiskType>');
                this.method_content = this.method_content.toString().replace('___product_id_2___', '');
                this.method_content = this.method_content.toString().replace('___policy_expiry_date___', '');
                //this.method_content = this.method_content.toString().replace('___is_cpa_year___', '5');
                this.method_content = this.method_content.toString().replace('<CPAReq>___is_pa_od___</CPAReq>', '<CPAReq>Y</CPAReq>');
                this.method_content = this.method_content.toString().replace('<PolicyNo>abc123</PolicyNo>', '<PolicyNo></PolicyNo>');
                this.method_content = this.method_content.toString().replace('<PinCode>400053</PinCode>', '<PinCode></PinCode>');
                this.method_content = this.method_content.toString().replace('<NCBInExpiringPolicy>___vehicle_ncb_current___</NCBInExpiringPolicy>', '<NCBInExpiringPolicy>N</NCBInExpiringPolicy>');
                this.method_content = this.method_content.toString().replace('<ClaimInExpiringPolicy>___is_claim_exists___</ClaimInExpiringPolicy>', ' <ClaimInExpiringPolicy>N</ClaimInExpiringPolicy>');
                this.prepared_request['vehicle_insurance_subtype'] = 'LO';
                this.processed_request['___vehicle_insurance_subtype___'] = this.prepared_request['vehicle_insurance_subtype'];
                this.prepared_request['policy_end_date'] = this.processed_request['___policy_end_date_extended___'];
                this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];

            }
            if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Verification') {
                this.method_content = this.method_content.toString().replace('___is_posp_2___', '');
                this.method_content = this.method_content.toString().replace('___posp_pan_no___', '');

                if (this.lm_request['vehicle_insurance_type'] === 'new') {


                    this.method_content = this.method_content.toString().replace('___dbmaster_pb_insurer_name___', "");
                    this.method_content = this.method_content.toString().replace('___dbmaster_pb_previousinsurer_pincode___', "");
                    //this.method_content = (this.method_content.toString().replace('___dbmaster_pb_previousinsurer_address___', ""));
                    for (var i = 1; i < 6; i++) {
                        this.method_content = this.method_content.toString().replace('___previousinsurer_address_' + i + '___', "");
                    }
                    this.method_content = this.method_content.toString().replace('___dbmaster_pb_insurer_code___', "");
                    this.method_content = this.method_content.toString().replace('___dbmaster_pb_previousinsurer_pincode___', "");
                    this.method_content = this.method_content.toString().replace('___registration_no___', "");
                    if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Verification') {
                        if (this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "yes") {
                            this.prepared_request['is_valid_pucc'] = "Y";
                            this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];
                        } else if (this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "no") {
                            this.prepared_request['is_valid_pucc'] = "N";
                            this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];
                        } else {
                            this.prepared_request['is_valid_pucc'] = "";
                            this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];
                        }
                        if (this.prepared_request['addon_package_name'] === 'PLAN1') {

                            this.prepared_request['addon_flag'] = 'Y';
                            this.processed_request['___addon_flag___'] = 'Y';
                        } else {

                            this.prepared_request['addon_flag'] = 'N';
                            this.processed_request['___addon_flag___'] = 'N';
                        }


                    }
                }

            }

            if (this.lm_request['method_type'] === 'Proposal') {
                if ((this.processed_request['___chassis_number___']).length < 17) {
                    var chassis_no_len = (this.processed_request['___chassis_number___']).length;
                    var add_zero = 17 - parseInt((this.processed_request['___chassis_number___']).length);
                    var num_zero = "";
                    if (add_zero > 0) {
                        for (var z = 0; z < add_zero; z++) {
                            num_zero += "0";
                        }
                    }
                    var chassis_no = (this.processed_request['___chassis_number___']);
                    chassis_no = num_zero + chassis_no;
                    this.prepared_request['chassis_number'] = chassis_no;
                    this.processed_request['___chassis_number___'] = chassis_no;
                }
            }

            this.prepared_request['dbmaster_insurer_rto_zone_code'] = this.processed_request['___dbmaster_pb_vehicletariff_zone___'];
            this.processed_request['___dbmaster_insurer_rto_zone_code___'] = this.prepared_request['dbmaster_insurer_rto_zone_code'];
            this.method_content = this.method_content.replace('<NCBDeclartion></NCBDeclartion>', '<NCBDeclartion>N</NCBDeclartion>');
            this.method_content = this.method_content.replace('<!--OD_ONLY_START_2-->', '');
            this.method_content = this.method_content.replace('<!--OD_ONLY_FINISH_2-->', '');
        }
        // for TW changes end
        var objtxt = '<Uid>' + this.timestamp() + '</Uid>';
        this.method_content = this.method_content.replace('___timestamp___', this.timestamp());
        this.method_content = this.method_content.replace('<Uid>___timestamp___</Uid>', objtxt);
        this.method_content = this.method_content.replace('<Uid></Uid>', objtxt);
        console.log(this.constructor.name, 'insurer_product_field_process_pre', 'finish');

        if (parseInt(this.lm_request['product_id']) === 1) {
            this.method_content = this.method_content.toString().replace('___is_cpa_year___', '');
            this.method_content = this.method_content.toString().replace('___product_id_2___', this.processed_request['___product_id___']);
        }
        if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Verification') {
            if (this.lm_request['is_policy_exist'] === 'no') {
                this.method_content = this.method_content.toString().replace('___dbmaster_pb_previousinsurer_pincode___', "");
                //this.method_content = this.method_content.toString().replace('___dbmaster_pb_previousinsurer_address___', "");
                for (var i = 1; i < 6; i++) {
                    this.method_content = this.method_content.toString().replace('___previousinsurer_address_' + i + '___', "");
                }
            }
        }

        if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer') {
            let prevInsAddress = this.prepared_request['dbmaster_pb_previousinsurer_address'];
            if (prevInsAddress.length > 30) {
                let address = {
                    address_1: '', address_2: '', address_3: '', address_4: '', address_5: ''
                };
                prevInsAddress = prevInsAddress.split(',');
                address.address_1 = (prevInsAddress.hasOwnProperty('0') ? (prevInsAddress[0] + ", ") : "") + (prevInsAddress.hasOwnProperty('1') ? (prevInsAddress[1] + ", ") : ""); //prevInsAddress[0] + ',' + prevInsAddress[1];
                address.address_2 = (prevInsAddress.hasOwnProperty('2') ? (prevInsAddress[2] + ", ") : "") + (prevInsAddress.hasOwnProperty('3') ? (prevInsAddress[3] + ", ") : ""); //prevInsAddress[2] + ',' + prevInsAddress[3];
                address.address_3 = (prevInsAddress.hasOwnProperty('4') ? (prevInsAddress[4] + ", ") : "") + (prevInsAddress.hasOwnProperty('5') ? (prevInsAddress[5] + ", ") : ""); //prevInsAddress[4] + ',' + prevInsAddress[5];
                address.address_4 = (prevInsAddress.hasOwnProperty('6') ? (prevInsAddress[6] + ", ") : "") + (prevInsAddress.hasOwnProperty('7') ? (prevInsAddress[7] + ", ") : ""); //prevInsAddress[6] + ',' + prevInsAddress[7];
                address.address_5 = (prevInsAddress.hasOwnProperty('8') ? (prevInsAddress[8] + ", ") : "") + (prevInsAddress.hasOwnProperty('9') ? (prevInsAddress[9] + ", ") : ""); //prevInsAddress[8] + ',' + prevInsAddress[9];

                if (address.address_5 === '') {
                    Object.keys(address).some((key, index, array) => {
                        if (address[key] === '') {
                            address[array[index - 1]] = address[array[index - 1]].slice(0, -2);
                            return true;
                        }
                    });
                } else {
                    address.address_5 = address.address_5.slice(0, -2);
                }

                this.prepared_request['previousinsurer_address_1'] = address.address_1;
                this.processed_request['___previousinsurer_address_1___'] = this.prepared_request['previousinsurer_address_1'];
                this.prepared_request['previousinsurer_address_2'] = address.address_2;
                this.processed_request['___previousinsurer_address_2___'] = this.prepared_request['previousinsurer_address_2'];
                this.prepared_request['previousinsurer_address_3'] = address.address_3;
                this.processed_request['___previousinsurer_address_3___'] = this.prepared_request['previousinsurer_address_3'];
                this.prepared_request['previousinsurer_address_4'] = address.address_4;
                this.processed_request['___previousinsurer_address_4___'] = this.prepared_request['previousinsurer_address_4'];
                this.prepared_request['previousinsurer_address_5'] = address.address_5;
                this.processed_request['___previousinsurer_address_5___'] = this.prepared_request['previousinsurer_address_5'];
            } else {
                this.processed_request['___previousinsurer_address_1___'] = this.prepared_request['dbmaster_pb_previousinsurer_address'];
                this.processed_request['___previousinsurer_address_2___'] = this.prepared_request['dbmaster_pb_previousinsurer_address'];
                this.processed_request['___previousinsurer_address_3___'] = "";
                this.processed_request['___previousinsurer_address_4___'] = "";
                this.processed_request['___previousinsurer_address_5___'] = "";
            }
        }

        /*if (this.lm_request['product_id'] === 10) {
         this.prepared_request['dbmaster_insurer_vehicle_insurer_bodytype'] = 'BIKE';
         this.processed_request['___dbmaster_insurer_vehicle_insurer_bodytype___'] = this.prepared_request['dbmaster_insurer_vehicle_insurer_bodytype'];
         }*/
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
FutureGeneraliMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    return obj_response_handler;
};
FutureGeneraliMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);

//    for(var key in objPremiumService){
//        if()
//    }
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        var Error_Msg = 'NO_ERR';
        objResponseJson = objResponseJson['Root'];
        //check error stop
        if (objResponseJson.hasOwnProperty('Policy')) {
            var objPremiumService = objResponseJson['Policy'][0];
            //check error start
            if (objPremiumService.hasOwnProperty('Status') && objPremiumService['Status'][0] === 'Successful') {
                var Idv_Breakup = this.get_const_idv_breakup();
                Idv_Breakup["Idv_Normal"] = Math.round(objResponseJson['Policy'][0]['VehicleIDV'] - 0);
                Idv_Breakup["Idv_Min"] = Math.round(Idv_Breakup["Idv_Normal"] * 0.90);
                Idv_Breakup["Idv_Max"] = Math.round(Idv_Breakup["Idv_Normal"] * 1.20);
                Idv_Breakup["Exshowroom"] = 0;
                objServiceHandler.Premium_Breakup = Idv_Breakup;
                objServiceHandler.Insurer_Transaction_Identifier = '';
                objServiceHandler.Error_Msg = Error_Msg;
                console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
            } else {
                if (objPremiumService.hasOwnProperty('ErrorMessage')) {
                    Error_Msg = objPremiumService['ErrorMessage'][0].toString();
                }
            }
        } else {
            if (objResponseJson.hasOwnProperty('ValidationError')) {
                Error_Msg = objResponseJson['ValidationError'][0].toString();
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;

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
FutureGeneraliMotor.prototype.insurer_product_field_process_post = function () {


};
FutureGeneraliMotor.prototype.insurer_product_api_post = function () {

};
FutureGeneraliMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id; //
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        //Example POST method invocation 
        var Client = require('node-rest-client').Client;
        var client = new Client();
        // set content-type header and data as json in args parameter 
        console.error('FGR', docLog.Insurer_Request);
        var objtxt = '<Uid>' + this.timestamp() + '</Uid>';
        docLog.Insurer_Request = docLog.Insurer_Request.replace('___timestamp___', this.timestamp());
        docLog.Insurer_Request = docLog.Insurer_Request.replace('<Uid>___timestamp___</Uid>', objtxt);
        docLog.Insurer_Request = docLog.Insurer_Request.replace('<Uid></Uid>', objtxt);
        var args = null;

        //if (specific_insurer_object.method.Method_Type === 'Pdf' && this.lm_request['product_id'] === 12)
        if (specific_insurer_object.method.Method_Type === 'Pdf') {
            if (config.environment.name === 'Production') {
                args = {
                    PolicyNumber: this.lm_request['policy_number'],
                    UserID: 'LANINS',
                    Password: 'LANINS@123'
                };
            } else {
                args = {
                    PolicyNumber: this.lm_request['policy_number'],
                    UserID: 'webagg',
                    Password: 'webagg@123'
                };
            }
            soap.createClient(specific_insurer_object.method.Service_URL, function (err, client) {
                client[specific_insurer_object.method.Method_Action](args, function (err1, result, raw, soapHeader) {
                    console.error('FutureGeneraliMotor', 'service_call', err1, result);
                    if (err1) {
                        console.error('FutureGeneraliMotor', 'service_call', 'exception', err1, docLog.Insurer_Request);
                        var objResponseFull = {
                            'err': err1,
                            'result': result,
                            'raw': raw,
                            'soapHeader': soapHeader,
                            'objResponseJson': null
                        };
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
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
                });
            });
        } else {
            if (specific_insurer_object.method.Method_Type === 'Idv') {
                docLog.Insurer_Request = (docLog.Insurer_Request).replace('<AddonReq>Y</AddonReq>', '<AddonReq>N</AddonReq>');
                docLog.Insurer_Request = (docLog.Insurer_Request).replace('<CoverCode>bike_tp</CoverCode>', '<CoverCode></CoverCode>');
                docLog.Insurer_Request = (docLog.Insurer_Request).replace('<CoverCode>bike_comprehensive</CoverCode>', '<CoverCode></CoverCode>');
            }
            docLog.Insurer_Request = docLog.Insurer_Request.replace(/>\s*/g, '>');  // Replace "> " with ">"
            docLog.Insurer_Request = docLog.Insurer_Request.replace(/\s*</g, '<');  // Replace "< " with "<"
            args = {
                "Product": "Motor",
                "XML": docLog.Insurer_Request
            };
            //specific_insurer_object.method_file_url = 'http://online.futuregenerali.in/BO/Service.svc?wsdl'; //live
            soap.createClient(specific_insurer_object.method_file_url, function (err, client) {
                try {
                    if (err) {
                        console.error('Exception', this.constructor.name, 'service_call', err, docLog.Insurer_Request);
                    } else {
                        client.setEndpoint(specific_insurer_object.method_file_url.split('?')['0']);
                        client[specific_insurer_object.method.Method_Action](args, function (err1, result, raw, soapHeader) {
                            console.log(err1, result, raw, soapHeader);
                            if (err1) {
                                console.error('Exception', this.constructor.name, 'service_call', err1, docLog.Insurer_Request);
                                var objResponseFull = {
                                    'err': JSON.stringify(err1),
                                    'result': null,
                                    'raw': raw,
                                    'soapHeader': null,
                                    'objResponseJson': null
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

                            } else {
                                var parse = require('xml-parser');
                                var fliter_response = result['CreatePolicyResult'];
                                xml2js.parseString(fliter_response, {ignoreAttrs: true}, function (err2, objXml2Json) {
                                    //var objXml2Json = JSON.parse(JSON.stringify(objXml2Json));
                                    if (err2) {
                                        console.error('Exception', this.constructor.name, 'service_call', err2, docLog.Insurer_Request);
                                    } else {
                                        var objResponseFull = {
                                            'err': null,
                                            'result': result,
                                            'raw': raw,
                                            'soapHeader': null,
                                            'objResponseJson': objXml2Json
                                        };
                                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                        if (specific_insurer_object.method.Method_Type === 'Idv') {
                                            objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                                        }

                                    }
                                });
                            }
                        });
                    }
                } catch (e) {
                    console.error('Exception', this.constructor.name, 'service_call', e.stack, docLog.Insurer_Request);

                }
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e.stack, docLog.Insurer_Request);
    }
};
FutureGeneraliMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);

//    for(var key in objPremiumService){
//        if()
//    }
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };

    var Error_Msg = 'NO_ERR';
    try {
        objResponseJson = objResponseJson['Root'];
        if (objResponseJson.hasOwnProperty('Policy')) {
            var objPremiumService = objResponseJson['Policy'][0];
            //check error start
            if (objPremiumService.hasOwnProperty('Status')) {
                //check error stop
                var objLMPremium = {};
                var is_loading_disc = '';
                var tpBasic = 0;
                if (objPremiumService['Status'][0] === 'Successful') {
                    //process insurer schema
                    var insurer_breakup = {};
                    var imt23Cover = 0;
                    var otherUseCover = 0;
                    if (parseInt(this.lm_request['product_id']) === 12 && this.lm_request['vehicle_class'] === 'gcv') {
                        for (var odCover in objPremiumService['NewDataSet'][0]['Table1']) {
                            if (objPremiumService['NewDataSet'][0]['Table1'][odCover]['Code'][0] === "IMT23") {
                                imt23Cover = objPremiumService['NewDataSet'][0]['Table1'][odCover]['BOValue'][0];
                            }
                            if (objPremiumService['NewDataSet'][0]['Table1'][odCover]['Code'][0] === "USE") {
                                otherUseCover = objPremiumService['NewDataSet'][0]['Table1'][odCover]['BOValue'][0];
                            }
                        }
                    }
                    for (var keyCover in objPremiumService['NewDataSet'][0]['Table1']) {
                        var premium_val = 0;
                        var insurer_key = objPremiumService['NewDataSet'][0]['Table1'][keyCover]['Type'][0].toString().replace(/ /g, '') + '-' + objPremiumService['NewDataSet'][0]['Table1'][keyCover]['Code'][0].toString().replace(/ /g, '_');
                        if (insurer_key === 'OD-LOADDISC') {
                            if (objPremiumService['NewDataSet'][0]['Table1'][keyCover]['BOValue'][0] !== '') {
                                var od_disc_load_amt = 0;
                                var od_disc_amt = 0;
                                var od_disc_amt1 = 0;
                                if (parseInt(this.lm_request['product_id']) === 12) {
                                    if (this.lm_request['vehicle_class'] === 'gcv') {
                                        od_disc_amt = this.round2Precision(objPremiumService['NewDataSet'][0]['Table1'][keyCover]['BOValue'][0].replace(/\-/g, '') - 0);
                                        od_disc_amt1 = Math.round(parseInt(imt23Cover) + parseInt(otherUseCover));
                                        od_disc_amt = od_disc_amt - od_disc_amt1;
                                        //od_disc_load_amt = od_disc_amt - od_disc_amt1;
                                        od_disc_load_amt = od_disc_amt;
                                    }
                                } else {
                                    od_disc_load_amt = this.round2Precision(objPremiumService['NewDataSet'][0]['Table1'][keyCover]['BOValue'][0].replace(/\-/g, '') - 0);
                                }
                                if (objPremiumService['NewDataSet'][0]['Table1'][keyCover]['BOValue'][0].indexOf('--') > -1) {
                                    is_loading_disc = 'DISC';
                                } else {
                                    is_loading_disc = 'LOAD';
                                }
                            }
                        }
                        if (parseInt(this.lm_request['product_id']) === 12) {
                            if (this.lm_request['vehicle_class'] === 'gcv') {
                                if (insurer_key === "TP-IDV") {
                                    tpBasic = this.round2Precision(objPremiumService['NewDataSet'][0]['Table1'][keyCover]['BOValue'][0].replace(/\-/g, '') - 0);
                                    var covrAmt = Math.round(parseInt(imt23Cover) + parseInt(otherUseCover));
                                    tpBasic = tpBasic - covrAmt;
                                }
                            }
                        }
                        premium_val = this.round2Precision(objPremiumService['NewDataSet'][0]['Table1'][keyCover]['BOValue'][0].replace(/\-/g, '') - 0);
                        premium_val = isNaN(premium_val) ? 0 : premium_val;
                        insurer_breakup[insurer_key] = premium_val;
                        if (parseInt(this.lm_request['product_id']) === 12) {
                            if (this.lm_request['vehicle_class'] === 'gcv') {
                                if (insurer_key === "TP-IDV") {
                                    if (tpBasic !== 0) {
                                        insurer_breakup[insurer_key] = tpBasic;
                                    }
                                }
                            }
                        }
                    }
                    insurer_breakup['PB_OD_FINAL'] = insurer_breakup['OD-Gross_Premium'] ? insurer_breakup['OD-Gross_Premium'] : 0;
                    if (insurer_breakup.hasOwnProperty('OD-MOTADON') && insurer_breakup['OD-MOTADON'] > 0) {
                        insurer_breakup['PB_OD_FINAL'] = insurer_breakup['PB_OD_FINAL'] - insurer_breakup['OD-MOTADON'];
                    }
                    console.error('LOG', 'FGDBG', 'insurer_breakup', insurer_breakup);
                    //process pb schema
                    var premium_breakup = this.get_const_premium_breakup();
                    var new_premium_val = 0;
                    for (var key in this.premium_breakup_schema) {
                        if (typeof this.premium_breakup_schema[key] === 'object') {
                            for (var sub_key in this.premium_breakup_schema[key]) {
                                var premium_key = this.premium_breakup_schema[key][sub_key];
                                var premium_val = 0;
                                if (insurer_breakup.hasOwnProperty(premium_key)) {
                                    premium_val = insurer_breakup[premium_key];
                                }
                                premium_breakup[key][sub_key] = premium_val;
                                if (insurer_breakup.hasOwnProperty(premium_key)) {
                                    if (premium_key === "OD-RSPBK") {
                                        new_premium_val = premium_val / 3;
                                    } else if (premium_key === "OD-STRSA") {
                                        new_premium_val = premium_val;
                                    } else if (premium_key === "OD-STZDP") {
                                        new_premium_val = premium_val;
                                    } else if (premium_key === "OD-ZDCNS") {
                                        new_premium_val = premium_val / 2;
                                    } else if (premium_key === "OD-ZDCNE") {
                                        new_premium_val = premium_val / 3;
                                    } else if (premium_key === "OD-ZDCNT") {
                                        new_premium_val = premium_val / 3;
                                    } else if (premium_key === "OD-ZDCET") {
                                        premium_breakup[key][sub_key] = 0;
                                        new_premium_val = premium_val / 4;
                                    } else if (premium_key === "OD-ZCETR") {
                                        new_premium_val = premium_val / 5;
                                    } else if (premium_key === "OD-STNCB") {
                                        new_premium_val = premium_val;
                                    } else if (premium_key === "OD-STINC") {
                                        new_premium_val = premium_val;
                                    }
                                }
                            }
                        }
                    }

                    if (insurer_breakup.hasOwnProperty("OD-RSPBK")) {
                        premium_breakup["addon"]["addon_road_assist_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_personal_belonging_loss_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_key_lock_cover"] = new_premium_val;
                    }
                    if (insurer_breakup.hasOwnProperty("OD-STRSA")) {
                        premium_breakup["addon"]["addon_road_assist_cover"] = new_premium_val;
                    }
                    if (insurer_breakup.hasOwnProperty("OD-STZDP")) {
                        premium_breakup["addon"]["addon_zero_dep_cover"] = new_premium_val;
                    }
                    if (insurer_breakup.hasOwnProperty("OD-ZDCNS")) {
                        premium_breakup["addon"]["addon_zero_dep_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_consumable_cover"] = new_premium_val;
                    }
                    if (insurer_breakup.hasOwnProperty("OD-ZDCNE")) {
                        premium_breakup["addon"]["addon_zero_dep_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_consumable_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_engine_protector_cover"] = new_premium_val;
                    }
                    if (insurer_breakup.hasOwnProperty("OD-ZDCNT")) {
                        premium_breakup["addon"]["addon_zero_dep_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_consumable_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_tyre_coverage_cover"] = new_premium_val;
                    }
                    if (insurer_breakup.hasOwnProperty("OD-ZDCET")) {
                        premium_breakup["addon"]["addon_zero_dep_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_consumable_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_engine_protector_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_tyre_coverage_cover"] = new_premium_val;
                    }
                    if (insurer_breakup.hasOwnProperty("OD-ZCETR")) {
                        premium_breakup["addon"]["addon_zero_dep_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_consumable_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_engine_protector_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_tyre_coverage_cover"] = new_premium_val;
                        premium_breakup["addon"]["addon_invoice_price_cover"] = new_premium_val;
                    }
                    if (insurer_breakup.hasOwnProperty("OD-STNCB") && parseInt(this.lm_request['product_id']) === 1) {
                        premium_breakup["addon"]["addon_ncb_protection_cover"] = new_premium_val;
                    }
                    if (insurer_breakup.hasOwnProperty("OD-STINC") && parseInt(this.lm_request['product_id']) === 1) {
                        premium_breakup["addon"]["addon_inconvenience_allowance_cover"] = new_premium_val;
                    }

                    premium_breakup['own_damage']['od_loading'] = 0;
                    premium_breakup['own_damage']['od_disc'] = 0;
                    if (is_loading_disc === 'DISC') {
                        premium_breakup['own_damage']['od_disc'] = od_disc_load_amt;
                    }
                    if (is_loading_disc === 'LOAD') {
                        premium_breakup['own_damage']['od_loading'] = od_disc_load_amt;
                    }
                    if (tpBasic !== 0) {
                        premium_breakup['liability']['tp_basic'] = tpBasic;
                    }
                    console.error('LOG', 'FGDBG', 'premium_breakup', premium_breakup);

                    for (var key in premium_breakup) {
                        if (typeof premium_breakup[key] === 'object') {
                            var group_final = 0, group_final_key = '', premium_val = 0;
                            for (var sub_key in premium_breakup[key]) {
                                premium_val = premium_breakup[key][sub_key];
                                if (sub_key.indexOf('final_') > -1) {
                                    group_final_key = sub_key;
                                } else if (sub_key.indexOf('_disc') > -1) {
                                    group_final -= premium_val;
                                } else {
                                    group_final += premium_val;
                                }
                            }
                            premium_breakup[key][group_final_key] = group_final;
                            /*if (group_final_key.indexOf('addon_') < 0) {
                             premium_breakup[key][group_final_key] = group_final;
                             }*/
                        }

                    }
                    var objPremiumVerification = this.premium_verification(premium_breakup['own_damage']['od_final_premium'], insurer_breakup['PB_OD_FINAL']);
                    //for cv changes start

                    if (parseInt(this.lm_request['product_id']) === 12) {
                        objPremiumVerification.Status = true;
                    }
                    //for cv changes end

                    if (objPremiumVerification.Status || this.lm_request['vehicle_insurance_subtype'] === '0CH_1TP') {
                        if (parseInt(this.lm_request['product_id']) === 12) {
                            if (this.lm_request['vehicle_class'] === 'gcv') {
                                var tp_tax = 0;
                                var od_tax = 0;
                                var netPremium = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'] + premium_breakup['addon']['addon_final_premium'];
                                //var fnlNetPrm = netPremium - (netPremium * 0.18);
                                //premium_breakup['net_premium'] = this.round2Precision(netPremium - (netPremium * 0.18));
                                premium_breakup['net_premium'] = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'] + premium_breakup['addon']['addon_final_premium'];
                                tp_tax = this.round2Precision(insurer_breakup['TP-ServTax']);
                                if (insurer_breakup.hasOwnProperty('OD-ServTax')) {
                                    od_tax = this.round2Precision(insurer_breakup['OD-ServTax']);
                                }
                                premium_breakup['service_tax'] = (parseInt(tp_tax) + parseInt(od_tax));
                                //premium_breakup['service_tax'] = this.round2Precision(premium_breakup['net_premium'] * 0.18);
                                premium_breakup['final_premium'] = this.round2Precision(premium_breakup['net_premium'] + premium_breakup['service_tax']);
                            }
                        } else {
                            premium_breakup['net_premium'] = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'] + premium_breakup['addon']['addon_final_premium'];
                            premium_breakup['service_tax'] = this.round2Precision(premium_breakup['net_premium'] * 0.18);
                            premium_breakup['final_premium'] = this.round2Precision(premium_breakup['net_premium'] + premium_breakup['service_tax']);
                        }
                    } else {
                        Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                    }
                    objServiceHandler.Premium_Breakup = premium_breakup;
                    objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request['timestamp'];
                } else {
                    if (objPremiumService.hasOwnProperty('ErrorMessage')) {
                        Error_Msg = objPremiumService['ErrorMessage'][0].toString();
                    }
                }
            } else {
                Error_Msg = JSON.stringify(objPremiumService);
            }
        } else {
            if (objResponseJson.hasOwnProperty('ValidationError')) {
                Error_Msg = objResponseJson['ValidationError'][0].toString();
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }
        }
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', ex, objServiceHandler);
    }
    objServiceHandler.Error_Msg = Error_Msg;
    console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    return objServiceHandler;
};
FutureGeneraliMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {

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
        method_content = method_content.replace('<Discount>___own_damage_disc_rate___</Discount>', '');
        method_content = method_content.toString().replace('___vehicle_ncb_next___', '0');
        method_content = method_content.toString().replace('___is_claim_exists___', 'Y');
        this.method_content = method_content.toString().replace('___vehicle_ncb_current___', '0');

        this.insurer_product_field_process_pre();
        this.processed_request['___addon_flag___'] = 'N';
        this.processed_request['___addon_package_name___'] = '';
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

FutureGeneraliMotor.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);

//    for(var key in objPremiumService){
//        if()
//    }
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };

    var Error_Msg = 'NO_ERR';
    try {
        objResponseJson = objResponseJson['Root'];
        if (objResponseJson.hasOwnProperty('Policy')) {
            var objPremiumService = objResponseJson['Policy'][0];
            //check error start
            if (objPremiumService.hasOwnProperty('Status')) {
                //check error stop
                if (objPremiumService['Status'][0] === 'Successful') {

                } else {
                    if (objPremiumService.hasOwnProperty('ErrorMessage')) {
                        Error_Msg = objPremiumService['ErrorMessage'][0].toString();
                    }
                }
            } else {
                Error_Msg = JSON.stringify(objPremiumService);
            }
        } else {
            if (objResponseJson.hasOwnProperty('ValidationError')) {
                Error_Msg = objResponseJson['ValidationError'][0].toString();
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }
        }

        if (Error_Msg === 'NO_ERR') {
            var premium_val = 0;
            for (var keyCover in objPremiumService['NewDataSet'][0]['Table1']) {
                var insurer_key = objPremiumService['NewDataSet'][0]['Table1'][keyCover]['Code'][0].toString().replace(/ /g, '_');
                if (insurer_key === 'PrmDue') {
                    premium_val += this.round2Precision(objPremiumService['NewDataSet'][0]['Table1'][keyCover]['BOValue'][0].replace(/\-/g, '') - 0);
                }
            }
            var Customer = {
                'final_premium_verified': premium_val
            };
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = "";
        }
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', objServiceHandler);
    }
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};

FutureGeneraliMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);

    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';

    try {
        var transaction_id = 'PB' + this.lm_request['crn'];
        var payment_option = 3;
        var objPremiumVerification;
        if (parseInt(this.lm_request['product_id']) === 12) {
            transaction_id = this.prepared_request['timestamp'];
        }

        if (Error_Msg === 'NO_ERR') {
            if (parseInt(this.lm_request['product_id']) === 12) {
                objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], this.processed_request['___final_premium_verified___'], 15, 15);
            } else {
                objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], this.processed_request['___final_premium_verified___'], 10, 3);
            }
            if (objPremiumVerification.Status) {
                if (this.lm_request.hasOwnProperty('pay_from') && this.lm_request['pay_from'] === 'wallet') {
                    var pg_data = {
                        'ss_id': this.lm_request['ss_id'],
                        'crn': this.lm_request['crn'],
                        'User_Data_Id': this.lm_request['udid'],
                        'product_id': this.lm_request['product_id'],
                        'premium_amount': this.lm_request['final_premium'],
                        'customer_name': this.lm_request['first_name'] + " " + this.lm_request['last_name'],
                        'txnid': this.lm_request['udid'] + ',' + this.lm_request['crn'] + ',' + this.lm_request['proposal_id'] + ',' + this.lm_request['insurer_id'],
                        'pg_type': "wallet"
                    };
                    objServiceHandler.Payment.pg_data = pg_data;
                    objServiceHandler.Payment.pg_redirect_mode = 'POST';
                    objServiceHandler.Payment.pg_url = ((config.environment.name === 'Production') ? "https://www.policyboss.com/wallet-confirm" : "http://qa.policyboss.com/TransactionDetail_Form/index.html") + "?udid=" + this.lm_request['udid'];
                    objServiceHandler.Insurer_Transaction_Identifier = "";
                } else {
                    var pg_data = {
                        'TransactionID': transaction_id,
                        'PaymentOption': payment_option,
                        'ResponseURL': this.const_payment.pg_ack_url,
                        'ProposalNumber': this.lm_request['crn'],
                        'PremiumAmount': this.processed_request['___final_premium_verified___'],
                        'UserIdentifier': this.prepared_request['insurer_integration_agent_code'],
                        'UserId': this.prepared_request['insurer_integration_service_user'],
                        'FirstName': this.processed_request['___first_name___'],
                        'LastName': this.processed_request['___last_name___'],
                        'Mobile': this.processed_request['___mobile___'],
                        'Email': this.processed_request['___email___']
                    };

                    objServiceHandler.Payment.pg_data = pg_data;
                    objServiceHandler.Payment.pg_redirect_mode = 'POST';
                    objServiceHandler.Insurer_Transaction_Identifier = 'PB' + this.lm_request['crn'];
                }
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
FutureGeneraliMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    let objInsurerProduct = this;
    let objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    try {
        var Error_Msg = 'NO_ERR';
        if (objInsurerProduct.prepared_request.pg_status === 'FAIL') {

        }
        if (objInsurerProduct.prepared_request.pg_status === 'SUCCESS') {
            try {
                if (parseInt(this.lm_request['product_id']) === 12) {
                    if (objResponseJson.hasOwnProperty('Root')) {
                        if (objResponseJson['Root'].hasOwnProperty('Status')) {
                            if (objResponseJson['Root']['Status'][0] !== 'Successful') {
                                Error_Msg = objResponseJson['Root']['ValidationError'][0];
                            }
                        } else {
                            if (objResponseJson['Root'].hasOwnProperty('Client')) {
                                if (objResponseJson['Root']['Client'][0]['Status'][0] !== 'Successful') {
                                    Error_Msg = objResponseJson['Root']['Client'][0]['ErrorMessage'][0];
                                }
                            }
                            if (objResponseJson['Root'].hasOwnProperty('Receipt')) {
                                if (objResponseJson['Root']['Receipt'][0]['Status'][0] !== 'Successful') {
                                    Error_Msg = objResponseJson['Root']['Receipt'][0]['ErrorMessage'][0];
                                }
                            }
                            if (objResponseJson['Root'].hasOwnProperty('Policy')) {
                                if (objResponseJson['Root']['Policy'][0]['Status'][0] !== 'Successful') {
                                    Error_Msg = objResponseJson['Root']['Policy'][0]['ErrorMessage'][0];
                                }
                            }
                        }
                    }
                }

                /*if (this.lm_request['product_id'] === 1) {
                 if (objResponseJson.hasOwnProperty('Root')) {
                 if (objResponseJson['Root'].hasOwnProperty('Status')) {
                 if (objResponseJson['Root']['Status'][0] !== 'Successful') {
                 Error_Msg = objResponseJson['Root']['Error'][0];
                 }
                 }
                 }
                 }*/
                if (parseInt(this.lm_request['product_id']) === 10 || parseInt(this.lm_request['product_id']) === 1) {
                    if (objResponseJson.hasOwnProperty('Root')) {
                        if (objResponseJson['Root'].hasOwnProperty('Status')) {
                            if (objResponseJson['Root']['Status'][0] !== 'Successful') {
                                Error_Msg = objResponseJson['Root']['Error'][0];
                            }
                        }

                        if (objResponseJson['Root'].hasOwnProperty('Policy')) {
                            if (objResponseJson['Root']['Policy'][0]['Status'][0] !== 'Successful') {
                                if (objResponseJson['Root']['Policy'][0].hasOwnProperty('ErrorMessage')) {
                                    Error_Msg = objResponseJson['Root']['Policy'][0]['ErrorMessage'][0];
                                } else if (objResponseJson['Root']['Policy'][0].hasOwnProperty('Message')) {
                                    Error_Msg = objResponseJson['Root']['Policy'][0]['Message'][0];
                                }
                            }
                        }
                        if (objResponseJson['Root'].hasOwnProperty('Receipt')) {
                            if (objResponseJson['Root']['Receipt'][0]['Status'][0] !== 'Successful') {
                                Error_Msg = objResponseJson['Root']['Receipt'][0]['ErrorMessage'][0];
                            }
                        }
                        if (objResponseJson['Root'].hasOwnProperty('Client')) {
                            if (objResponseJson['Root']['Client'][0]['Status'][0] !== 'Successful') {
                                Error_Msg = objResponseJson['Root']['Client'][0]['ErrorMessage'][0];
                            }
                        }
                    }
                }
            } catch (e) {
                console.error('Exception', this.constructor.name, 'verification_response_handler', e);
                Error_Msg = JSON.stringify(objResponseJson);
            }

            if (Error_Msg === 'NO_ERR') {
                let policyStatus = '';
                let clientStatus = '';
                let receiptStatus = '';
                let clientError = '';
                let policyError = '';
                let receiptError = '';

                objResponseJson = objResponseJson['Root'];
                clientStatus = objResponseJson['Client'][0]['Status'][0];
                receiptStatus = objResponseJson['Receipt'][0]['Status'][0];
                policyStatus = objResponseJson['Policy'][0]['Status'][0];
                clientError = objResponseJson['Client'][0]['ErrorMessage'][0];
                receiptError = objResponseJson['Receipt'][0]['ErrorMessage'][0];
                policyError = objResponseJson['Policy'][0]['ErrorMessage'][0];

                if (clientStatus === 'Successful' && receiptStatus === 'Successful' && policyStatus === 'Successful') {
                    this.const_policy.transaction_status = 'SUCCESS';
                }

                if (policyStatus === "Successful") {
                    this.const_policy.policy_number = objResponseJson['Policy'][0]['PolicyNo'][0];
                    this.const_policy.pg_status = 'SUCCESS';

                    var args = {
                        data: {
                            "search_reference_number": this.lm_request['search_reference_number'],
                            "api_reference_number": this.lm_request['api_reference_number'],
                            "policy_number": this.const_policy.policy_number,
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key'],
                            'insurer_id': this.lm_request['insurer_id'],
                            'crn': this.lm_request['crn'],
                            'email': this.lm_request['email'],
                            'mobile': this.lm_request['mobile'],
                            'method_type': 'Pdf',
                            'execution_async': 'no',
                            'pdf_userid': 'webagg',
                            'pdf_password': 'webagg@123'
                        },
                        headers: {
                            "Content-Type": "application/json",
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key']
                        }
                    };
                    this.const_policy.pdf_request = args.data;

                    var product_name = 'CAR';
                    if (parseInt(this.lm_request['product_id']) === 10) {
                        product_name = 'TW';
                    }
                    if (parseInt(this.lm_request['product_id']) === 12) {
                        product_name = 'CV';
                    }
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number.toString() + '.pdf';

                    // var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    //var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path;
                    // var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var sleep = require('system-sleep');
                    //sleep(9000);
                    this.pdf_call_new(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);

                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }

                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['Receipt'][0]['ReceiptNo'][0];
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }
        }
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        this.const_policy.transaction_status = 'PAYPASS';
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex.stack);

    }
    objServiceHandler.Policy = this.const_policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
FutureGeneraliMotor.prototype.pg_response_handler = function () {
    //WS_P_ID=TP033508&TID=PB91773&PGID=403993715516544908&Premium=19344.00&Response=Success
    //WS_P_ID=TC230460&TID=PB465175&PGID=9691239181773110&Premium=19862&Response=Success 
    //WS_P_ID=TP063910&TID=PB325719&PGID=403993715520362360&Premium=20165.00&Response=Success
    try {
        var objInsurerProduct = this;
        console.error('Start', objInsurerProduct.constructor.name, 'pg_response_handler', objInsurerProduct.const_policy);
        if (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === 'wallet') {
            let output = objInsurerProduct.const_payment_response.pg_post;
            if (output['status'] === 'Success') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_status = 'SUCCESS';
                this.const_policy.transaction_amount = output['amount'];
                try {
                    this.const_policy.pg_reference_number_1 = output['transfer_id'].replace(/_/g, '');
                } catch (error) {
                    this.const_policy.pg_reference_number_1 = "";
                    console.error('Start', objInsurerProduct.constructor.name, 'transfer_id not getting error from wallet', error.stack);
                }
                this.const_policy.pg_reference_number_2 = objInsurerProduct.lm_request['crn'];// output['OrderId'];
                this.const_policy.transaction_id = output['txnid']; // pay_id
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else if (objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response.pg_data.pg_type === "rzrpay") {
            let output = objInsurerProduct.const_payment_response.pg_get;
            if (output['Status'] === 'Success') {
                this.const_policy.transaction_amount = objInsurerProduct.const_payment_response.pg_data.amount;
                this.const_policy.pg_status = 'SUCCESS';
                try {
                    this.const_policy.pg_reference_number_1 = objInsurerProduct.const_payment_response.pg_data.transfer_id.replace(/_/g, '');
                } catch (error) {
                    this.const_policy.pg_reference_number_1 = "";
                    console.error('Start', objInsurerProduct.constructor.name, 'transfer_id not getting error from razorpay', error.stack);
                }
                this.const_policy.pg_reference_number_2 = objInsurerProduct.lm_request['crn'];
                this.const_policy.transaction_id = output['PayId'].toString();
                if (output.hasOwnProperty('Signature') && output.Signature) {
                    var secret_key = config.razor_pay.rzp_sbi.password;
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
        } else {
            objInsurerProduct.const_policy.transaction_status = '';
            objInsurerProduct.const_policy.transaction_id = objInsurerProduct.const_payment_response.pg_get['TID'];
            if (objInsurerProduct.const_payment_response.pg_get['Response'] === 'Success') {
                objInsurerProduct.const_policy.pg_status = 'SUCCESS';
                objInsurerProduct.const_policy.transaction_amount = objInsurerProduct.const_payment_response.pg_get['Premium'];
                objInsurerProduct.const_policy.pg_reference_number_1 = objInsurerProduct.const_payment_response.pg_get['PGID'];
                objInsurerProduct.const_policy.pg_reference_number_2 = objInsurerProduct.const_payment_response.pg_get['WS_P_ID'];
            } else {
                objInsurerProduct.const_policy.pg_status = 'FAIL';
                objInsurerProduct.const_policy.transaction_status = 'FAIL';
            }
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
FutureGeneraliMotor.prototype.pdf_call_new = function (url, args, pdf_sys_loc) {
    console.log('Start', this.constructor.name, 'pdf_call_new', url, args, pdf_sys_loc);
    try {
        let objInsurerProduct = this;
        objInsurerProduct.pdf_attempt++;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.post(url, args, function (data, response) {
            if (data.Error_Code !== '' || true) {
                if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                    var sleep = require('system-sleep');
                    sleep(9000);
                    objInsurerProduct.pdf_call_new(args, pdf_sys_loc);
                }
            }
        });
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call_new', ex);
    }
    //console.log("FutureGeneraliMotor pdf_call_new objInsurerProduct.pdf_attempt :: ", objInsurerProduct.pdf_attempt);
};
FutureGeneraliMotor.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        /*var objPremiumService = objResponseJson;
         if (objPremiumService.hasOwnProperty('Status')) {
         if (objPremiumService['Status'][0] === '0') {
         Error_Msg = objPremiumService['ErrorMessage'][0];
         }
         } else {
         Error_Msg = JSON.stringify(objPremiumService);
         }*/
        var objPremiumService = objResponseJson;
        if (objPremiumService.hasOwnProperty('GetPDFResult')) {
            if (objPremiumService['GetPDFResult'] !== '') {
                if (objPremiumService['GetPDFResult']['diffgram']['DocumentElement']['PDF'].hasOwnProperty('Msg') && objPremiumService['GetPDFResult']['diffgram']['DocumentElement']['PDF']['Msg'] !== "") {
                    Error_Msg = objPremiumService['GetPDFResult']['diffgram']['DocumentElement']['PDF']['Msg'];
                }
            }
        }
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson !== '') {
                var product_name = 'Car';
                if (parseInt(this.lm_request['product_id']) === 12) {
                    product_name = 'CV';
                }
                if (parseInt(this.lm_request['product_id']) === 10) {
                    product_name = 'TW';
                }
                var policy_number = this.lm_request['policy_number'].toString().replace('/', '_');
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + policy_number + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
                var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                // var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(objResponseJson['GetPDFResult']['diffgram']['DocumentElement']['PDF']['PDFBytes'], 'base64');
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
        this.const_policy = policy;
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
FutureGeneraliMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "OD-IDV",
        "od_elect_access": "OD-EAV",
        "od_non_elect_access": "OD-NEAV",
        "od_cng_lpg": "OD-CNG",
        "od_disc_ncb": "OD-NCB",
        "od_disc_vol_deduct": "OD-VD",
        "od_disc_anti_theft": "OD-THF",
        "od_disc_aai": "OD-AAI",
        "od_loading": "OD-LOADDISC",
        "od_disc": "OD-LOADDISC", //loading discount was assigned , no seoparate tag for it 
        "od_disc_own_premises": "",
        "od_final_premium": ""//no specific tag it is calculated from tags = ( OD-Gross Premium) -( OD-MOTADON)
    },
    "liability": {
        "tp_basic": "TP-IDV",
        "tp_cover_owner_driver_pa": "TP-CPA",
        "tp_cover_unnamed_passenger_pa": "TP-APA",
        "tp_cover_named_passenger_pa": "", //not available
        "tp_cover_paid_driver_pa": "", //Not available
        "tp_cover_paid_driver_ll": "TP-LLDE",
        "tp_cng_lpg": "TP-CNG",
        "tp_cover_imt23": "OD-IMT23",
        "tp_cover_fairing_paying_passenger": "",
        "tp_cover_non_fairing_paying_passenger": "TP-LLNF",
        "tp_basic_other_use": "OD-USE",
        "tp_cover_emp_pa": "TP-LLOE",
        "tp_final_premium": "TP-Gross_Premium"
    },
    "addon": {// add on amount is received in tag OD-MOTADON and only one cover is covered in one call
        //"addon_zero_dep_cover": "OD-PLAN1",
        "addon_zero_dep_cover": "OD-STZDP",
        //"addon_road_assist_cover": "OD-PLAN2",
        "addon_road_assist_cover": "OD-STRSA",
        "addon_ncb_protection_cover": "OD-STNCB",
        "addon_engine_protector_cover": "OD-ZDCNE",
        "addon_invoice_price_cover": "OD-ZCETR",
        "addon_key_lock_cover": "OD-ZDCET",
        "addon_consumable_cover": "OD-ZDCNS",
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": "OD-ZDCNT",
        "addon_personal_belonging_loss_cover": "OD-RSPBK",
        "addon_inconvenience_allowance_cover": "OD-STINC",
        "addon_medical_expense_cover": null,
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": ""
    },
    "net_premium": "", //obtained by adding tags (OD-Gross Premium)+(TP-Gross Premium)
    "service_tax": "", //obtained by adding tags (OD-ServTax)+(TP-ServTax)(OD-ServTax)+(TP-ServTax)Gross Premium + ServTax
    "final_premium": ""
};
module.exports = FutureGeneraliMotor;






