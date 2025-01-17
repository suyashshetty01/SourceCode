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
var moment = require('moment');
var config = require('config');

function IciciLombardMotor() {}
util.inherits(IciciLombardMotor, Motor);
IciciLombardMotor.prototype.lm_request_single = {};
IciciLombardMotor.prototype.insurer_integration = {};
IciciLombardMotor.prototype.insurer_addon_list = [];
IciciLombardMotor.prototype.insurer = {};
IciciLombardMotor.prototype.insurer_date_format = 'yyyy-MM-dd';
IciciLombardMotor.prototype.insurer_product_api_pre = function () {
    console.log('insurer_product_api_pre');
};
IciciLombardMotor.prototype.insurer_product_field_process_pre = function () {
    console.log(this.constructor.name, 'insurer_product_field_process_pre', 'start');
    try {
        if (this.lm_request['method_type'] === 'Proposal') {
            this.prepared_request['financial_institute_city'] = this.lm_request.hasOwnProperty('financial_institute_city') ? this.lm_request['financial_institute_city'] : '';
            this.processed_request['___financial_institute_city___'] = this.prepared_request['icici_transaction_id'];
            if (this.lm_request.hasOwnProperty('pay_from')) {
                this.prepared_request['pay_from'] = "wallet";
                this.processed_request['___pay_from___'] = this.prepared_request['pay_from'];
            }
        }
        if (this.lm_request['method_type'] === 'Status') {
            //please add pre code here for status method
            if ((this.lm_request['method_type'] === 'Status') && this.insurer_master && this.insurer_master['service_logs'] && this.insurer_master['service_logs']['insurer_db_master'] && this.insurer_master['service_logs']['insurer_db_master']['LM_Custom_Request'] && this.insurer_master['service_logs']['insurer_db_master']['LM_Custom_Request']['insurer_customer_identifier']) {
                this.prepared_request['icici_transaction_id'] = this.insurer_master['service_logs']['insurer_db_master']['LM_Custom_Request']['insurer_customer_identifier'];
                this.processed_request['___icici_transaction_id___'] = this.prepared_request['icici_transaction_id'];
            }
        } else {
            const uuidv4 = require('uuid/v4');
            this.prepared_request['timestamp'] = uuidv4();
            this.processed_request['___timestamp___'] = this.prepared_request['timestamp'];
            var ch_flag = ((parseInt(((this.lm_request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);

            if (parseInt(this.lm_request['electrical_accessory']) > 49999 || parseInt(this.lm_request['non_electrical_accessory'] > 49999)) {
                this.method_content = "";
            }

            if (this.lm_request['method_type'] === 'Idv') {
                this.method_content = this.method_content.replace('manufacturrcode', 'manufacturercode');
            }

            /*if (this.lm_request['vehicle_registration_type'] !== "corporate" && this.lm_request['method_type'] === 'Proposal') {
             var cmp_replace = this.find_text_btw_key(this.method_content, '<!--gst_details_start-->', ',<!--gst_details_end-->', true);
             if (cmp_replace) {
             this.method_content = this.method_content.replace(cmp_replace, '"GSTDetails":null,');
             }
             } else {
             this.method_content = this.method_content.replace('<!--gst_details_start-->', '');
             this.method_content = this.method_content.replace('<!--gst_details_end-->', '');
             }*/

            if (this.lm_request['method_type'] === 'Proposal') {
                if (this.processed_request['___gst_no___'] !== "" && this.processed_request['___gst_no___'] !== null) {
                    this.method_content = this.method_content.replace('<!--gst_details_start-->', '');
                    this.method_content = this.method_content.replace('<!--gst_details_end-->', '');
                } else {
                    var cmp_replace = this.find_text_btw_key(this.method_content, '<!--gst_details_start-->', ',<!--gst_details_end-->', true);
                    if (cmp_replace) {
                        this.method_content = this.method_content.replace(cmp_replace, '"GSTDetails":null,');
                    }
                }
            }

            if (this.lm_request['vehicle_registration_type'] === "corporate" && this.lm_request['method_type'] === 'Proposal') {
                var nomi_replace = this.find_text_btw_key(this.method_content, '<!--nominee_details_start-->', ',<!--nominee_details_end-->', true);
                if (nomi_replace) {
                    this.method_content = this.method_content.replace(nomi_replace, '"NomineeDetails":null,');
                }
            } else {
                this.method_content = this.method_content.replace('<!--nominee_details_start-->', '');
                this.method_content = this.method_content.replace('<!--nominee_details_end-->', '');
            }

            if (this.lm_request['vehicle_insurance_type'] === 'new' && this.prepared_request['addon_zero_dep_cover'] === "yes") {
                if (parseInt(this.lm_request['product_id']) === 10) {
                    (config.environment.name === 'Production') ? this.method_content = this.method_content.replace('___addon_zero_dep_cover___', 'Silver') : this.method_content = this.method_content.replace('___addon_zero_dep_cover___', 'Silver TW');
                }
                if (parseInt(this.lm_request['product_id']) === 1) {
                    (config.environment.name === 'Production') ? this.method_content = this.method_content.replace('___addon_zero_dep_cover___', 'ZD') : this.method_content = this.method_content.replace('___addon_zero_dep_cover___', 'Silver PVT');
                }
            }

            if ((config.environment.name.toString() !== 'Production') && (parseInt(this.lm_request['product_id']) === 1) && (this.lm_request['vehicle_insurance_subtype'] !== '1OD_0TP') && this.lm_request['is_breakin'] === 'yes' && ch_flag) {
                this.prepared_request['insurer_integration_account_code'] = "DEAL-3001-0206164";
                this.processed_request['___insurer_integration_account_code___'] = this.prepared_request['insurer_integration_account_code'];
            }

            if ((config.environment.name.toString() !== 'Production') && this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
                if (parseInt(this.lm_request['product_id']) === 1) {
                    this.prepared_request['insurer_integration_account_code'] = "DL-3001/1485413";
                    this.processed_request['___insurer_integration_account_code___'] = this.prepared_request['insurer_integration_account_code'];
                }
                if (parseInt(this.lm_request['product_id']) === 10) {
                    this.prepared_request['insurer_integration_account_code'] = "DL-3005/1483341";
                    this.processed_request['___insurer_integration_account_code___'] = this.prepared_request['insurer_integration_account_code'];
                }
            }
            if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP' && (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal')) {
                this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                if (this.lm_request['method_type'] === 'Proposal') {
                    var tp_start_date = (this.lm_request['tp_start_date']).split('-');
                    this.prepared_request['tp_start_date'] = tp_start_date[2] + "-" + tp_start_date[1] + "-" + tp_start_date[0];
                    this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
                    var tp_end_date = (this.lm_request['tp_end_date']).split('-');
                    this.prepared_request['tp_end_date'] = tp_end_date[2] + "-" + tp_end_date[1] + "-" + tp_end_date[0];
                    this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
                    this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Code'];
                    this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
                }
                var txt_replace = this.find_text_btw_key(this.method_content, ',<!--ODONLY_START-->', '<!--ODONLY_FINISH-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
                this.method_content = this.method_content.replace('<!--ODONLY_START-->', '');
                this.method_content = this.method_content.replace('<!--ODONLY_FINISH-->', '');
            } else {
                var txt_replace = this.find_text_btw_key(this.method_content.toString(), '<!--ODONLY_START-->', '<!--ODONLY_FINISH-->', false);
                this.method_content = this.method_content.replace(txt_replace, '');
                this.method_content = this.method_content.replace('<!--ODONLY_START-->', '');
                this.method_content = this.method_content.replace('<!--ODONLY_FINISH-->', '');
            }

            if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal')
            {
                this.prepared_request['is_pa_od'] = (this.lm_request['is_pa_od'] === 'yes') ? true : false;
                this.processed_request['___is_pa_od___'] = this.prepared_request['is_pa_od'];
                this.prepared_request['is_having_valid_dl'] = (this.prepared_request['is_pa_od'] === true) ? false : true;
                this.processed_request['___is_having_valid_dl___'] = this.prepared_request['is_having_valid_dl'];

                if (this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['is_policy_exist'] === 'yes') {
                    this.prepared_request['is_policy_exist_2'] = 'false';
                    this.processed_request['___is_policy_exist_2___'] = this.prepared_request['is_policy_exist_2'];
                } else {
                    this.prepared_request['is_policy_exist_2'] = 'true';
                    this.processed_request['___is_policy_exist_2___'] = this.prepared_request['is_policy_exist_2'];
                }
                if (this.prepared_request['insurer_customer_identifier']) {
                    this.prepared_request['icici_transaction_id'] = this.prepared_request['insurer_customer_identifier'];
                    this.processed_request['___icici_transaction_id___'] = this.prepared_request['icici_transaction_id'];
                }
            }

            if (!ch_flag) {
                if (this.lm_request['method_type'] === 'Premium') {
                    if (parseInt(this.lm_request['product_id']) === 1) {
                        if (config.environment.name.toString() === 'Production') {
                            this.method['Service_URL'] = "https://app9.icicilombard.com/ilservices/motor/v1/Quote/PvtCarTP";
                        } else {
                            this.method['Service_URL'] = "https://ilesbsanity.insurancearticlez.com/ilservices/motor/v1/Quote/PvtCarTP";
                        }
                    }
                    if (parseInt(this.lm_request['product_id']) === 10) {
                        if (config.environment.name.toString() === 'Production') {
                            this.method['Service_URL'] = "https://app9.icicilombard.com/ilservices/motor/v1/Quote/TwoWheelerTP";
                        } else {
                            this.method['Service_URL'] = "https://ilesbsanity.insurancearticlez.com/ilservices/motor/v1/Quote/TwoWheelerTP";
                        }
                    }
                }

                if (this.lm_request['method_type'] === 'Proposal') {
                    if (parseInt(this.lm_request['product_id']) === 1) {
                        if (config.environment.name.toString() === 'Production') {
                            this.method['Service_URL'] = "https://app9.icicilombard.com/ILServices/motor/V1/Proposal/PvtCarTP";
                        } else {
                            this.method['Service_URL'] = "https://ilesbsanity.insurancearticlez.com/ILServices/motor/V1/Proposal/PvtCarTP";
                        }
                    }

                    if (parseInt(this.lm_request['product_id']) === 10) {
                        if (config.environment.name.toString() === 'Production') {
                            this.method['Service_URL'] = "https://app9.icicilombard.com/ilservices/motor/v1/Proposal/TwoWheelerTP";
                        } else {
                            this.method['Service_URL'] = "https://ilesbsanity.insurancearticlez.com/ILServices/motor/V1/Proposal/PvtCarTP";
                        }
                    }
                }
                if (this.lm_request['vehicle_insurance_type'] === "new") {
                    this.prepared_request['policy_end_date'] = this.processed_request['___policy_end_date_extended___'];
                    this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];
                }
                if (this.lm_request['is_policy_exist'] === 'no') {
                    var txt_replace = this.find_text_btw_key(this.method_content, '<!--previous insurer details start-->', '<!--previous insurer details end-->', true);
                    if (txt_replace) {
                        this.method_content = this.method_content.replace(txt_replace, '');
                    }
                }

                if (config.environment.name.toString() === 'Production') {
                    if (parseInt(this.lm_request['product_id']) === 1) {
                        (config.environment.name === 'Production') ? this.prepared_request['insurer_integration_account_code'] = "DL-3001/A/6721235" : this.prepared_request['insurer_integration_account_code'] = "DL-3005/A/5516355";
                    }
                    if (parseInt(this.lm_request['product_id']) === 10) {
                        this.prepared_request['insurer_integration_account_code'] = "DL-3005/A/8215619";
                    }
                } else {
                    this.prepared_request['insurer_integration_account_code'] = "DL-3005/A/1486448";
                }
                this.processed_request['___insurer_integration_account_code___'] = this.prepared_request['insurer_integration_account_code'];
            }

            if (this.lm_request['method_type'] === 'Customer' && (parseInt(this.lm_request['product_id']) === 1) && this.lm_request['is_breakin'] === 'yes' && ch_flag) {
                if (this.lm_request['is_inspection_done'] === 'no') {
                    if (config.environment.name.toString() === 'Production')
                    {
                        this.method['Service_URL'] = "https://app9.icicilombard.com/ILServices/Motor/v1/Breakin/CreateBreakinID";
                    } else {
                        this.method['Service_URL'] = "https://ilesbsanity.insurancearticlez.com/ILServices/Motor/v1/Breakin/CreateBreakinID";
                    }

                    var method_content = fs.readFileSync(appRoot + '/resource/request_file/IciciLombard_Car_Create_Lead.json').toString();
                    this.method_content = method_content;
                    this.prepared_request['breakin_days'] = this.lm_request['breakin_days'];
                    this.processed_request['___breakin_days___'] = this.prepared_request['breakin_days'];
                }
                if (this.lm_request['is_inspection_done'] === 'yes') {
                    this.prepared_request['icici_proposal_number'] = ((this.lm_request['insurer_transaction_identifier']).split("-"))[0];
                    this.processed_request['___icici_proposal_number___'] = this.prepared_request['icici_proposal_number'];
                    this.lm_request['icici_proposal_number'] = this.prepared_request['icici_proposal_number'];
                    this.prepared_request['icici_customer_id'] = ((this.lm_request['insurer_transaction_identifier']).split("-"))[1];
                    this.processed_request['___icici_customer_id___'] = this.prepared_request['icici_customer_id'];
                    this.lm_request['icici_customer_id'] = this.prepared_request['icici_customer_id'];
                }
            }
            if (this.lm_request['vehicle_insurance_type'] === "renew") {
                if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                    this.prepared_request['previous_insurance_type'] = "Bundled Package Policy";
                    this.processed_request['___previous_insurance_type___'] = this.prepared_request['previous_insurance_type'];
                } else {
                    this.prepared_request['previous_insurance_type'] = "Comprehensive Package";
                    this.processed_request['___previous_insurance_type___'] = this.prepared_request['previous_insurance_type'];
                }
            }
            if (this.lm_request['vehicle_insurance_type'] === "new") {
                this.method_content = this.method_content.replace('___registration_no_1______registration_no_2______registration_no_3______registration_no_4___', 'NEW');
            }
            if ((parseInt(this.lm_request['product_id']) === 1) && this.lm_request['is_breakin'] === 'yes' && ch_flag) {
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
            }
            if (this.lm_request['method_type'] === 'Proposal' && (parseInt(this.lm_request['product_id']) === 1) && this.lm_request['is_breakin'] === 'yes' && ch_flag && this.lm_request['is_inspection_done'] === 'yes') {
                this.method_content = "";
                this.processed_request['___insurer_customer_identifier___'] = this.prepared_request['insurer_customer_identifier'];
                this.processed_request['___insurer_customer_identifier___'] = this.prepared_request['insurer_customer_identifier'];
            }

            if (this.lm_request['is_claim_exists'] === 'yes') {
                this.method_content = this.method_content.replace('___addon_zero_dep_cover___', '');
                this.method_content = this.method_content.replace('___totalnoofodclaims___', 1);
                this.method_content = this.method_content.replace('___noofclaimsonPreviousPolicy___', 1);
            } else {
                this.method_content = this.method_content.replace('___totalnoofodclaims___', 0);
                this.method_content = this.method_content.replace('___noofclaimsonPreviousPolicy___', 0);
            }
            if (this.lm_request['pa_unnamed_passenger_si'] - 0 > 0)
            {
                if (this.lm_request['pa_unnamed_passenger_si'] === "150000")
                {
                    this.processed_request['___pa_unnamed_passenger_si_2___'] = "true";
                }
                this.processed_request['___pa_unnamed_passenger_si___'] = (this.lm_request['pa_unnamed_passenger_si'] - 0) * (this.processed_request['___dbmaster_insurer_vehicle_seatingcapacity___'] - 0);
                this.prepared_request['pa_unnamed_passenger_si'] = this.processed_request['___pa_unnamed_passenger_si___'];
            }
            this.prepared_request['dbmaster_insurer_vehicle_fueltype'] = this.prepared_request['dbmaster_insurer_vehicle_fueltype'][0];
            this.processed_request['___dbmaster_insurer_vehicle_fueltype___'] = this.prepared_request['dbmaster_insurer_vehicle_fueltype'];
            this.prepared_request['is__bifuel_lpg'] = 'false';
            this.prepared_request['is__bifuel_cng'] = 'false';
            this.processed_request['___is__bifuel_lpg___'] = this.prepared_request['is__bifuel_lpg'];
            this.processed_request['___is__bifuel_cng___'] = this.prepared_request['is__bifuel_cng'];
            if (this.processed_request['___external_bifuel_value___'] - 0 > 0) {
                if (this.lm_request['external_bifuel_type'] === 'lpg') {
                    this.method_content = this.method_content.replace('___is__bifuel_lpg___', 'true');
                } else if (this.lm_request['external_bifuel_type'] === 'cng') {
                    this.method_content = this.method_content.replace('___is__bifuel_cng___', 'true');
                }
            }
            if (this.lm_request['is_claim_exists'] === 'yes') {
                //this.method_content = this.method_content.replace('___addon_zero_dep_cover___', '');
                this.method_content = this.method_content.replace('___totalnoofodclaims___', 1);
                this.method_content = this.method_content.replace('___noofclaimsonPreviousPolicy___', 1);
            } else {
                this.method_content = this.method_content.replace('___totalnoofodclaims___', 0);
                this.method_content = this.method_content.replace('___noofclaimsonPreviousPolicy___', 0);
            }

            /*if (this.processed_request['___gst_state___'] === '') {
             this.prepared_request['gst_state'] = 'MAHARASHTRA';
             this.processed_request['___gst_state___'] = 'MAHARASHTRA';
             }*/

            if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal') {
                if (this.processed_request['___dbmaster_insurer_rto_city_name___']) {
                    var state_temp = this.processed_request['___dbmaster_insurer_rto_city_name___'].split("-");
                    state_temp = state_temp[0];
                    state_temp = (state_temp === "TAMILNADU" ? "TAMIL NADU" : state_temp);
                    this.prepared_request['gst_state'] = state_temp;
                    this.processed_request['___gst_state___'] = state_temp;
                }
            }
            if (this.lm_request.hasOwnProperty('is_tppd')) {
                if (this.lm_request['is_tppd'] === 'yes') {
                    this.prepared_request['tppd_amount'] = '6000';
                    this.processed_request['___tppd_amount___'] = this.prepared_request['tppd_amount'];
                } else {
                    this.prepared_request['tppd_amount'] = "0";
                    this.processed_request['___tppd_amount___'] = this.prepared_request['tppd_amount'];
                }
            } else {
                this.prepared_request['tppd_amount'] = "0";
                this.processed_request['___tppd_amount___'] = this.prepared_request['tppd_amount'];
            }

            if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium') {
                this.processed_request['___dbmaster_insurer_vehicle_exshowroom___'] = this.icicilombard_idv_calculation();
            }
            if (this.lm_request['method_type'] === 'Proposal') {
                this.processed_request['___dbmaster_insurer_vehicle_exshowroom___'] = this.insurer_master['service_logs']['insurer_db_master']['Insurer_Response']['generalInformation']['showRoomPrice'];
                if (parseInt(this.lm_request['product_id']) === 10) {
                    this.prepared_request['timestamp'] = this.insurer_master.service_logs.pb_db_master.LM_Custom_Request.timestamp;
                    this.processed_request['___timestamp___'] = this.prepared_request['timestamp'];
                }
            }
            if (this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') {
                if (this.lm_request['middle_name'] !== '') {
                    this.method_content = this.method_content.replace('___first_name___ ___last_name___', this.prepared_request['first_name'] + ' ' + this.prepared_request['middle_name'] + ' ' + this.prepared_request['last_name']);
                }
            }
            if (this.lm_request['method_type'] === 'Verification') {
                var proposal_date = moment(this.insurer_master['service_logs']['insurer_db_master']['Created_On']).format('YYYY-MM-DD');
                this.prepared_request['proposal_date'] = proposal_date;
                this.processed_request['___proposal_date___'] = this.prepared_request['proposal_date'];
                if ((!ch_flag) && (this.lm_request['vehicle_insurance_subtype'] !== '1OD_0TP')) {
                    if (config.environment.name.toString() === 'Production') {
                        if (parseInt(this.lm_request['product_id']) === 1) {
                            (config.environment.name === 'Production') ? this.prepared_request['insurer_integration_account_code'] = "DL-3001/A/6721235" : this.prepared_request['insurer_integration_account_code'] = "DL-3005/A/5516355";
                        }
                        if (parseInt(this.lm_request['product_id']) === 10) {
                            this.prepared_request['insurer_integration_account_code'] = "DL-3005/A/8215619";
                        }
                    } else {
                        this.prepared_request['insurer_integration_account_code'] = "DL-3005/A/1486448";
                    }
                    this.processed_request['___insurer_integration_account_code___'] = this.prepared_request['insurer_integration_account_code'];
                }

                if ((parseInt(this.lm_request['product_id']) === 1) && this.lm_request['is_breakin'] === 'yes' && ch_flag) {
                    //this.prepared_request['policy_id'] = this.prepared_request['pg_reference_number_5'];
                    //this.processed_request['___policy_id___'] = this.prepared_request['pg_reference_number_5'];
                    if (isNaN(this.prepared_request['pg_reference_number_5']) || isNaN(this.prepared_request['pg_reference_number_4'])) {
                        let master_data = this.Master_Details;
                        if (master_data.hasOwnProperty('User_Data')) {
                            if (master_data.User_Data.hasOwnProperty('Status_History')) {
                                if (master_data.User_Data.Status_History.length > 0) {
                                    var i = master_data.User_Data.Status_History.length;
                                    for (var j = 0; j < i; j++) {
                                        var str = master_data.User_Data.Status_History[j]['Status'];
                                        if (str === "INSPECTION_SCHEDULED") {
                                            let objStr = master_data.User_Data.Status_History[j];
                                            if (objStr.hasOwnProperty('Data')) {
                                                if (objStr.Data.hasOwnProperty('pg_data')) {
                                                    if (objStr.Data.pg_data.hasOwnProperty('transactionId')) {
                                                        let strTransactionId = objStr.Data.pg_data.transactionId.split('-');
                                                        if (strTransactionId.length === 3) {
                                                            this.prepared_request['pg_reference_number_4'] = strTransactionId['1'];
                                                            this.processed_request['___pg_reference_number_4___'] = this.prepared_request['pg_reference_number_4'];
                                                            this.prepared_request['policy_id'] = strTransactionId['0'];
                                                            this.processed_request['___policy_id___'] = this.prepared_request['policy_id'];
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        this.prepared_request['policy_id'] = this.prepared_request['pg_reference_number_5'];
                        this.processed_request['___policy_id___'] = this.prepared_request['pg_reference_number_5'];
                    }
                } else {
                    //if(parseInt(this.lm_request['product_id']) === 1){
                    if (this.prepared_request.hasOwnProperty('dbmaster_insurer_transaction_identifier')) {
                        var arr_ident = this.prepared_request['dbmaster_insurer_transaction_identifier'].toString().split('-');
                        this.prepared_request['policy_id'] = arr_ident[0];
                        this.processed_request['___policy_id___'] = arr_ident[0];
                        this.prepared_request['pg_reference_number_4'] = arr_ident[1];
                        this.processed_request['___pg_reference_number_4___'] = arr_ident[1];

                        /* for number customer id & proposal id */
                        if ((this.proposal_processed_request.hasOwnProperty('___pay_from___') && this.proposal_processed_request['___pay_from___'] === 'wallet') || (this.hasOwnProperty('const_payment_response') && this.const_payment_response.hasOwnProperty('pg_data') && this.const_payment_response.pg_data.hasOwnProperty('pg_type') && this.const_payment_response.pg_data.pg_type === "rzrpay")) {
                            this.prepared_request['policy_id'] = this.proposal_processed_request['___rzrpay_proposal_no___'];
                            this.processed_request['___policy_id___'] = this.proposal_processed_request['___rzrpay_proposal_no___'];
                            this.prepared_request['pg_reference_number_4'] = this.proposal_processed_request['___rzrpay_customer_id___'];
                            this.processed_request['___pg_reference_number_4___'] = this.proposal_processed_request['___rzrpay_customer_id___'];
                        }
                    }
                    //}
                }
                if (parseInt(this.lm_request['product_id']) === 10) {
                    this.prepared_request['timestamp'] = this.insurer_master.service_logs.pb_db_master.LM_Custom_Request.timestamp;
                    this.processed_request['___timestamp___'] = this.prepared_request['timestamp'];
                }
            }

            if (this.lm_request['method_type'] === 'Pdf') {
                this.prepared_request['correlationId'] = this.lm_request['correlationId'];
                this.processed_request['___correlationId___'] = this.prepared_request['correlationId'];
                //this.prepared_request['insurer_integration_account_code'] = this.lm_request['DealId'];
                //this.processed_request['___insurer_integration_account_code___'] = this.prepared_request['insurer_integration_account_code'];
                this.prepared_request['policy_number'] = this.lm_request['policy_number'];
                this.processed_request['___policy_number___'] = this.prepared_request['policy_number'];
                //this.prepared_request['mobile'] = this.lm_request['mobile'];
                //this.processed_request['___mobile___'] = this.prepared_request['mobile'];
                this.prepared_request['customerId'] = this.lm_request['customerId'];
                this.processed_request['___customerId___'] = this.prepared_request['customerId'];
                this.method_content = this.method_content.replace('CrrelationId', 'CorrelationId');
            }

            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.processed_request['___registration_no_1___'] = 'new';
                this.processed_request['___registration_no_2___'] = '';
                this.processed_request['___registration_no_3___'] = '';
                this.processed_request['___registration_no_4___'] = '';

                var txt_replace = this.find_text_btw_key(this.method_content, '<!--previous insurer details start-->', '<!--previous insurer details end-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
            } else {
                if (([10].indexOf(this.lm_request['product_id']) > -1) && this.lm_request['is_policy_exist'] === 'no') {
                    var txt_replace = this.find_text_btw_key(this.method_content, '<!--previous insurer details start-->', '<!--previous insurer details end-->', true);
                    if (txt_replace) {
                        this.method_content = this.method_content.replace(txt_replace, '');
                    }
                } else {
                    this.method_content = this.method_content.replace('<!--previous insurer details start-->', '');
                    this.method_content = this.method_content.replace('<!--previous insurer details end-->', '');
                }
            }
            if (this.lm_request['is_financed'] === 'no') {
                var txt_replace = this.find_text_btw_key(this.method_content, '<!--financier details start-->', '<!--financier details end-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
            } else {
                this.method_content = this.method_content.replace('<!--financier details start-->', '');
                this.method_content = this.method_content.replace('<!--financier details end-->', '');
            }

            if (parseInt(this.lm_request['product_id']) === 1) {
                this.prepared_request['electrical_accessory_2'] = false;
                this.processed_request['___electrical_accessory_2___'] = this.prepared_request['electrical_accessory_2'];
                this.prepared_request['non_electrical_accessory_2'] = false;
                this.processed_request['___non_electrical_accessory_2___'] = this.prepared_request['non_electrical_accessory_2'];
            }

            //Beneli condtion for exshowrrom price
            if (this.insurer_master.vehicles.insurer_db_master['PB_Make_Name'] === "BENELLI") {
                if (this.insurer_master.vehicles.insurer_db_master['PB_Make_Name'] === "BENELLI" && this.lm_request['vehicle_insurance_type'] === "new") {
                    this.processed_request['___dbmaster_insurer_vehicle_exshowroom___'] = this.prepared_request['dbmaster_insurer_vehicle_exshowroom'];
                } else {
                    this.prepared_request['dbmaster_insurer_vehicle_exshowroom'] = "0";
                    this.processed_request['___dbmaster_insurer_vehicle_exshowroom___'] = this.prepared_request['dbmaster_insurer_vehicle_exshowroom'];
                }
            }

            if (parseInt(this.lm_request['product_id']) === 10) {
                //if (this.prepared_request['dbmaster_pb_cubic_capacity'] - 0 >= 350) {
                var is_benelli = false;
                if (this.insurer_master.vehicles.insurer_db_master['PB_Make_Name'] === "BENELLI" && this.lm_request['vehicle_insurance_type'] === "new" && (this.prepared_request['dbmaster_pb_cubic_capacity'] - 0) >= 350) {
                    is_benelli = true;
                }
                if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium' && (this.prepared_request['dbmaster_pb_cubic_capacity'] - 0) >= 350 && !is_benelli)
                {
                    this.method_content = "";
                } else {
                    if (this.lm_request.hasOwnProperty('policy_od_tenure')) {
                        this.prepared_request['policy_od_tenure'] = this.lm_request['policy_od_tenure'];
                        this.processed_request['___policy_od_tenure___'] = this.lm_request['policy_od_tenure'];
                    }
                    this.method_content = this.method_content.replace('___dbmaster_insurer_rto_city_code___', '___dbmaster_insurer_rto_code___');
                    //Benelli Exshowrrom price
                    if (this.insurer_master.vehicles.insurer_db_master['PB_Make_Name'] === "BENELLI") {
                        if (this.insurer_master.vehicles.insurer_db_master['PB_Make_Name'] === "BENELLI" && this.lm_request['vehicle_insurance_type'] === "new") {
                            //this.prepared_request['dbmaster_insurer_vehicle_exshowroom'] = this.prepared_request['dbmaster_insurer_vehicle_exshowroom'];
                            this.processed_request['___dbmaster_insurer_vehicle_exshowroom___'] = this.prepared_request['dbmaster_insurer_vehicle_exshowroom'];
                        } else {
                            this.prepared_request['dbmaster_insurer_vehicle_exshowroom'] = "0";
                            this.processed_request['___dbmaster_insurer_vehicle_exshowroom___'] = this.prepared_request['dbmaster_insurer_vehicle_exshowroom'];
                        }
                    }

                    this.method_content = this.method_content.replace('___addon_road_assist_cover___', '___addon_road_assist_cover_2___');
                    this.method_content = this.method_content.replace('___addon_zero_dep_cover___', '___addon_zero_dep_cover_2___');
                    this.method_content = this.method_content.replace('___addon_consumable_cover___', false);
                    this.method_content = this.method_content.replace('___is_llpd___', false);
                }
            }
            if (this.method_content.indexOf('CorrelatioId') > -1) {
                this.method_content = this.method_content.replace('CorrelatioId', 'CorrelationId');
            }
            if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') {
                if (this.lm_request['is_policy_exist'] === 'no') {
                    var txt_replace = this.find_text_btw_key(this.method_content, '<!--previous insurer details start-->', '<!--previous insurer details end-->', true);
                    if (txt_replace) {
                        this.method_content = this.method_content.replace(txt_replace, '');
                    }
                }
            }
        }
        if (([10].indexOf(this.lm_request['product_id']) > -1)) {
            if (this.processed_request['___policy_expiry_date___'] && this.processed_request['___policy_start_date___']) {
                var days_diff = moment(this.processed_request['___policy_start_date___']).diff(this.processed_request['___policy_expiry_date___'], 'days');
                //for breakin > 90 days
                if (days_diff > 90) {
                    this.method_content = this.method_content.replace('"BonusOnPreviousPolicy": "___vehicle_ncb_current___",', '"BonusOnPreviousPolicy": "0",');
                }
            }
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
    console.log(this.constructor.name, 'insurer_product_field_process_pre', 'finish');
};
IciciLombardMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
    if (specific_insurer_object.method.Method_Type === 'Status') {
        obj_response_handler = this.status_response_handler(objResponseJson);
    }
    return obj_response_handler;
};
IciciLombardMotor.prototype.insurer_product_field_process_post = function () {};
IciciLombardMotor.prototype.insurer_product_api_post = function () {};
IciciLombardMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id; //
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        var soap = require('soap');
        var xml2js = require('xml2js');
        const http = require('http');

        var Client = require('node-rest-client').Client;
        var client = new Client();
        var MongoClient = require('mongodb').MongoClient;
        var objProduct = this;
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

        if (specific_insurer_object.method.Method_Type === 'Pdf') {
            try {
                let token_user = (config.environment.name !== 'Production') ? 'landmark' : 'Landmark';
                let token_pass = (config.environment.name !== 'Production') ? 'l@n!m@$k' : 'l@n&M@rk';
                let token_client_id = (config.environment.name !== 'Production') ? 'ro.landmark' : 'ro.landmark';
                let token_secret = (config.environment.name !== 'Production') ? 'ro.l@n!m@$k' : 'ro.l@n&M@rkcL!3nt';
                let obj_cred = {
                    'grant_type': 'password',
                    'username': token_user,
                    'password': token_pass,
                    'scope': 'esbpolicypdf',
                    'client_id': token_client_id,
                    'client_secret': token_secret
                };

                let tokenservice_url = '';
                if (config.environment.name === 'Production') {
                    tokenservice_url = "https://app9.icicilombard.com/Cerberus/connect/token";
                } else {
                    tokenservice_url = "https://ilesbsanity.insurancearticlez.com/cerberus/connect/token";
                }
                let pdftokenargs = {
                    data: obj_cred,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                };
                function jsonToQueryString(json) {
                    return  Object.keys(json).map(function (key) {
                        return encodeURIComponent(key) + '=' +
                                encodeURIComponent(json[key]);
                    }).join('&');
                }
                pdftokenargs.data = jsonToQueryString(pdftokenargs.data);

                let Client1 = require('node-rest-client').Client;
                let client1 = new Client1();
                client1.post(tokenservice_url, pdftokenargs, function (data1, response1) {
                    if (data1) {
                        docLog.Insurer_Request = (docLog.Insurer_Request).replace('CrrelationId', 'CorrelationId');
                        let args = {
                            data: docLog.Insurer_Request,
                            headers: {"Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": "Bearer " + data1['access_token']
                            }
                        };
                        console.error('Exception', 'icici_pdf', docLog.Insurer_Request);
                        var Client3 = require('node-rest-client').Client;
                        var client3 = new Client3();
                        client3.post(specific_insurer_object.method_file_url, args, function (pdfdata, pdfresponse) {
                            // parsed response body as js object 
                            if (pdfdata) {
                                console.error('jyoti icici pdf response', JSON.stringify(pdfdata));
                                console.log('ICICI Data', pdfdata.toString());
                                var objResponseFull = {
                                    'err': null,
                                    'result': null,
                                    'raw': JSON.stringify(pdfdata),
                                    'soapHeader': null,
                                    'objResponseJson': pdfdata
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            } else {
                                console.error('Exception : pdf response : pdfdata : ', pdfdata);
                                console.error('Exception : pdf response : pdfresponse : ', pdfresponse);
                            }
                        });
                    } else {
                        console.error('Exception : pdf token response data1 : ', data1);
                        console.error('Exception : pdf token response response1 : ', response1);
                    }
                });
            } catch (e) {
                console.error('Exception : pdf token : ', e);
            }
        } else if (specific_insurer_object.method.Method_Type === 'Verification') {
            let token_user = (config.environment.name === 'Production') ? 'landmark' : 'policyboss';
            let token_pass = (config.environment.name === 'Production') ? 'l@n&M@rk' : 'pol!cyboss';
            let token_client_id = (config.environment.name === 'Production') ? 'ro.landmark' : 'ro.policyboss';
            //let token_secret = (config.environment.name === 'Production') ? 'ro.l@n&M@rkcL!3nt' : 'l@n&M@rk';
            let token_secret = (config.environment.name === 'Production') ? 'ro.l@n&M@rkcL!3nt' : 'pol!cybossCLi3nt';
            let obj_cred = {
                'grant_type': 'password',
                'username': token_user,
                'password': token_pass,
                'scope': 'esbpayment',
                'client_id': token_client_id,
                'client_secret': token_secret
            };

            var username = objInsurerProduct.prepared_request['insurer_integration_service_user'];
            var password = objInsurerProduct.prepared_request['insurer_integration_service_password'];
            if ((objInsurerProduct.const_payment_response.hasOwnProperty('pg_data') && objInsurerProduct.const_payment_response['pg_data'].hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response['pg_data']['pg_type'] === "rzrpay") || (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === "wallet")) {
                try {
                    /*let pay_id = "";
                     if (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === "wallet") {
                     pay_id = objInsurerProduct.const_payment_response.pg_post.txnid;
                     } else {
                     pay_id = objInsurerProduct.const_payment_response.pg_get.PayId;
                     }
                     let order_verify_url = "https://api.razorpay.com/v1/payments/" + pay_id;
                     var rzp_username = config.razor_pay.rzp_icici.username;
                     var rzp_secret_key = config.razor_pay.rzp_icici.password;
                     var rzp_args = {
                     headers: {
                     "Accept": "application/json",
                     'Authorization': 'Basic ' + new Buffer(rzp_username + ':' + rzp_secret_key).toString('base64')
                     }
                     };
                     client.get(order_verify_url, rzp_args, function (rzp_data, response) {
                     if (rzp_data && rzp_data.hasOwnProperty('status') && rzp_data['status'] === "captured") { */
                    var tokenservice_url = '';
                    if (product_id === 10) {
                        if (objInsurerProduct.prepared_request['Plan_Name'] === "TP" || objInsurerProduct.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                            tokenservice_url = config.icici_health_auth.auth_url;
                        } else {
                            tokenservice_url = config.icici_auth.auth_url;
                        }
                    } else {
                        tokenservice_url = config.icici_health_auth.auth_url;
                    }
                    var args = {
                        data: obj_cred,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    };
                    function jsonToQueryString(json) {
                        return  Object.keys(json).map(function (key) {
                            return encodeURIComponent(key) + '=' +
                                    encodeURIComponent(json[key]);
                        }).join('&');
                    }
                    args.data = jsonToQueryString(args.data);
                    console.error('token data', JSON.stringify(args));
                    console.error(tokenservice_url);
                    var Client1 = require('node-rest-client').Client;
                    var client1 = new Client1();
                    client1.post(tokenservice_url, args, function (data1, response1) {
                        if (data1) {
                            console.error('token', JSON.stringify(data1));
                            var access_key = data1['access_token'];
                            docLog.Insurer_Request = (docLog.Insurer_Request).replace('CrrelationId', 'CorrelationId');
                            var args2 = {
                                data: docLog.Insurer_Request,
                                headers: {"Content-Type": "application/json",
                                    "Accept": "application/json",
                                    "Authorization": "Bearer " + access_key
                                }
                            };

                            console.log(JSON.stringify(args2));
                            var Client2 = require('node-rest-client').Client;
                            var client2 = new Client2();
                            client2.post(specific_insurer_object.method_file_url, args2, function (data2, response2) {
                                // parsed response body as js object 
                                if (data2) {
                                    console.error('verification response', JSON.stringify(data2));
                                    console.log('ICICI Data', data2.toString());
                                    var objResponseFull = {
                                        'err': null,
                                        'result': null,
                                        'raw': JSON.stringify(data2),
                                        'soapHeader': null,
                                        'objResponseJson': data2
                                    };
                                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                } else {
                                    console.error('Exception : verification token response : data2 : ', data2);
                                    console.error('Exception : verification token response : response2 : ', response2);
                                }
                            });
                        } else {
                            console.error('Exception : verification token response : data1 : ', data1);
                            console.error('Exception : verification token response : response1 : ', response1);
                        }
                    });
                    /*} else {
                     console.error('verification reconcile response', JSON.stringify(rzp_data));
                     console.log('Razorpay payment verification Data', rzp_data.toString());
                     var objResponseFull = {
                     'err': null,
                     'result': null,
                     'raw': JSON.stringify(rzp_data),
                     'soapHeader': null,
                     'objResponseJson': rzp_data
                     };
                     var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                     }
                     });*/
                } catch (ex) {
                    console.error('Razorpay Service Call Error: ', this.constructor.name, ex);
                }
            } else {
                var args1 = {
                    headers: {
                        "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
                    }
                };
                var body = JSON.parse(docLog.Insurer_Request);
                //var qs_url = 'https://ilesb.southindia.cloudapp.azure.com/PGI/API/Transaction/TransactionEnquiry?TransactionIdForPG=' + body['PaymentEntry']['onlineDAEntry']['TransactionId'];
                var qs_url = 'https://ilesb01.insurancearticlez.com/pgi/api/transaction/TransactionEnquiry?TransactionIdForPG=' + body['PaymentEntry']['onlineDAEntry']['TransactionId'];
                var live_url = 'https://paygate.icicilombard.com/pgi/api/transaction/transactionenquiry?TransactionIdForPG=' + body['PaymentEntry']['onlineDAEntry']['TransactionId'];
                client.get(config.environment.name === 'Production' ? live_url : qs_url, args1, function (data, response) {
                    if (data) {
                        console.log('ICICI tranaction Data', data.toString());
                        var status = data['Status'];
                        if (status === 0) {
                            var tokenservice_url = '';
                            if (product_id === 10) {
                                if (objInsurerProduct.prepared_request['Plan_Name'] === "TP" || objInsurerProduct.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                                    tokenservice_url = config.icici_health_auth.auth_url;
                                } else {
                                    tokenservice_url = config.icici_auth.auth_url;
                                }
                            } else {
                                tokenservice_url = config.icici_health_auth.auth_url;
                            }
                            var args = {
                                data: obj_cred,
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                }
                            };
                            function jsonToQueryString(json) {
                                return  Object.keys(json).map(function (key) {
                                    return encodeURIComponent(key) + '=' +
                                            encodeURIComponent(json[key]);
                                }).join('&');
                            }
                            args.data = jsonToQueryString(args.data);
                            console.error('token data', JSON.stringify(args));
                            console.error(tokenservice_url);
                            var Client1 = require('node-rest-client').Client;
                            var client1 = new Client1();
                            client1.post(tokenservice_url, args, function (data1, response1) {
                                // parsed response body as js object 
                                if (data1) {
                                    console.error('token', JSON.stringify(data1));
                                    var access_key = data1['access_token'];
                                    //var body1 = JSON.parse(docLog.Insurer_Request);
                                    //var body2 = JSON.parse((docLog.Insurer_Request).replace('CorrelatioId', 'CorrelationId'));
                                    //docLog.Insurer_Request = (docLog.Insurer_Request).replace('CorrelatioId', 'CorrelationId');
                                    var args2 = {
                                        data: docLog.Insurer_Request, //JSON.stringify(body2),
                                        headers: {"Content-Type": "application/json",
                                            "Accept": "application/json",
                                            "Authorization": "Bearer " + access_key
                                        }
                                    };

                                    console.log(JSON.stringify(args2));
                                    var Client2 = require('node-rest-client').Client;
                                    var client2 = new Client2();
                                    client2.post(specific_insurer_object.method_file_url, args2, function (data2, response2) {
                                        // parsed response body as js object 
                                        if (data2) {
                                            console.error('verification response', JSON.stringify(data2));
                                            console.log('ICICI Data', data2.toString());
                                            var objResponseFull = {
                                                'err': null,
                                                'result': null,
                                                'raw': JSON.stringify(data2),
                                                'soapHeader': null,
                                                'objResponseJson': data2
                                            };
                                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                        } else {
                                            console.error('Exception : verification token response : data2 : ', data2);
                                            console.error('Exception : verification token response : response2 : ', response2);
                                        }
                                    });
                                } else {
                                    console.error('Exception : verification token response : data1 : ', data1);
                                    console.error('Exception : verification token response : response1 : ', response1);
                                }
                            });
                        } else {
                            console.error('verification reconcile response', JSON.stringify(data));
                            console.log('ICICI Data', data.toString());
                            data.request = (config.environment.name === 'Production' ? live_url : qs_url);
                            var objResponseFull = {
                                'err': null,
                                'result': null,
                                'raw': JSON.stringify(data),
                                'soapHeader': null,
                                'objResponseJson': data
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        }
                    } else {
                        console.error('Exception : verification reconcile response : data : ', data);
                        console.error('Exception : verification reconcile response : response : ', response);
                    }
                });
            }
        } else if (specific_insurer_object.method.Method_Type === 'Idv') {
            try {
                var Icici_Token = require('../../models/icici_token');
                Icici_Token.findOne({'Product_Id': 500}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
                    if (err) {
                        console.error('Icici IDV Token not Found', err);
                    } else {
                        //console.error('ICICITOKENDBG', dbIciciToken);
                        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                        if (objProduct.prepared_request['Plan_Name'] !== 'TP') {
                            docLog.Insurer_Request = docLog.Insurer_Request.replace('manufacturrcode', 'manufacturercode');
                            var args = {
                                data: docLog.Insurer_Request,
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json",
                                    "Authorization": "Bearer " + dbIciciToken['Token']
                                }
                            };
                            console.log(JSON.stringify(args));
                            client.post(specific_insurer_object.method.Service_URL, args, function (data, response) {
                                // parsed response body as js object 
                                if (data) {
                                    console.log('ICICI Data', JSON.stringify(data));
                                    var objResponseFull = {
                                        'err': null,
                                        'result': null,
                                        'raw': JSON.stringify(data),
                                        'soapHeader': null,
                                        'objResponseJson': data
                                    };
                                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                    objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                                } else {
                                    console.error('Exception : ', specific_insurer_object.method.Method_Type, ' IDV response : data : ', data);
                                    console.error('Exception : ', specific_insurer_object.method.Method_Type, ' IDV response : response : ', response);
                                }
                            });
                        }
                    }
                });
            } catch (ex) {
                console.error('Exception for getting IDV Token from DB : ', this.constructor.name, ex);
            }
        } else if (specific_insurer_object.method.Method_Type === 'Status') {
            var args1 = {
                headers: {
                    "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
                }
            };
            //args1['headers']['Authorization'] = "Basic " + new Buffer('Landmark' + ':' + 'Landmark').toString('base64');
            client.get(specific_insurer_object['method']['Service_URL'] + this.prepared_request['icici_transaction_id'], args1, function (data, response) {
                console.log(data);
                var objResponseFull = {
                    'err': null,
                    'result': null,
                    'raw': data,
                    'soapHeader': null,
                    'objResponseJson': data
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

            });
        } else {
            try {
                var Icici_Token = require('../../models/icici_token');
                Icici_Token.findOne({'Product_Id': 1}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
                    if (err) {
                        console.error('Icici Token not Found', err);
                    } else {
                        //console.error('ICICITOKENDBG', dbIciciToken);
                        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                        if (specific_insurer_object.method.Method_Type === 'Customer') {
                            var args = {};
                            if (objProduct.lm_request['product_id'] === 1 && objProduct.lm_request['is_breakin'] === 'yes' && objProduct.prepared_request['Plan_Name'] !== 'TP' && objProduct.lm_request['is_inspection_done'] === 'no') {
                                console.log('customer call for pvt. car breakin inspection');
                                if (config.environment.name.toString() === 'Production')
                                {
                                    specific_insurer_object.method_file_url = "https://app9.icicilombard.com/ILServices/Motor/v1/Breakin/CreateBreakinID";
                                } else {
                                    specific_insurer_object.method_file_url = "https://ilesbsanity.insurancearticlez.com/ILServices/Motor/v1/Breakin/CreateBreakinID";
                                }
                                console.log("docLog.Insurer_Request : ", docLog.Insurer_Request);
                                args = {
                                    data: docLog.Insurer_Request, //JSON.stringify(JSON.parse(docLog.Insurer_Request)),
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                        "Authorization": "Bearer " + dbIciciToken['Token']
                                    }
                                };
                                console.log('Method :: ', specific_insurer_object.method.Method_Type, 'Breakin Create Lead Request :: ', JSON.stringify(args));
                            } else {
                                const uuidv1 = require('uuid/v1');
                                var transaction_id = uuidv1(); //objInsurerProduct.prepared_request['dbmaster_insurer_transaction_identifier'];//
                                var username = objInsurerProduct.prepared_request['insurer_integration_service_user'];
                                var password = objInsurerProduct.prepared_request['insurer_integration_service_password'];
                                var body = {};
                                if (objProduct.lm_request['product_id'] === 1 && objProduct.lm_request['is_breakin'] === 'yes' && objProduct.prepared_request['Plan_Name'] !== 'TP') {
                                    body = {
                                        'TransactionId': transaction_id,
                                        'Amount': ((config.environment.name === 'Production') ? objInsurerProduct.lm_request['final_premium'] : '2.00'),
                                        'ApplicationId': ((config.environment.name === 'Production') ? '19' : '31'),
                                        'ReturnURL': objInsurerProduct.pg_ack_url(), //'http://localhost:7000/transaction-status/' + objInsurerProduct.lm_request['udid'] + '/' + objInsurerProduct.lm_request['crn'] + '/' + objInsurerProduct.lm_request['proposal_id'], //((config.environment.name === 'Production') ? 'http://horizon.policyboss.com/transaction-status/' : 'http://qa-horizon.policyboss.com/transaction-status/') + objInsurerProduct.lm_request['udid'] + '/' + objInsurerProduct.lm_request['crn'],//
                                        'AdditionalInfo1': objInsurerProduct.lm_request['icici_proposal_number'],
                                        'AdditionalInfo2': objInsurerProduct.lm_request['icici_customer_id'],
                                        'AdditionalInfo3': objInsurerProduct.lm_request['registration_no_1'] + objInsurerProduct.lm_request['registration_no_2'] + objInsurerProduct.lm_request['registration_no_3'] + objInsurerProduct.lm_request['registration_no_4'],
                                        'AdditionalInfo4': objInsurerProduct.lm_request['mobile']
                                    };
                                } else {
                                    body = {
                                        'TransactionId': transaction_id,
                                        'Amount': objInsurerProduct.lm_request['final_premium'], //((config.environment.name === 'Production') ? objInsurerProduct.lm_request['final_premium'] : '2.00'),
                                        'ApplicationId': ((config.environment.name === 'Production') ? '19' : '31'),
                                        'ReturnURL': objInsurerProduct.pg_ack_url(), //'http://localhost:7000/transaction-status/' + objInsurerProduct.lm_request['udid'] + '/' + objInsurerProduct.lm_request['crn'] + '/' + objInsurerProduct.lm_request['proposal_id'], //((config.environment.name === 'Production') ? 'http://horizon.policyboss.com/transaction-status/' : 'http://qa-horizon.policyboss.com/transaction-status/') + objInsurerProduct.lm_request['udid'] + '/' + objInsurerProduct.lm_request['crn'],//
                                        'AdditionalInfo1': 'INR'
                                    };
                                }
                                args = {
                                    data: JSON.stringify(body),
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                        'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                                    }
                                };
                            }
                            console.log(JSON.stringify(args));
                            client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                                // parsed response body as js object 
                                if (data) {
                                    if (objProduct.lm_request['product_id'] === 1 && objProduct.lm_request['is_breakin'] === 'yes' && objProduct.lm_request['is_inspection_done'] === 'no' && objProduct.prepared_request['Plan_Name'] !== 'TP') {
                                        console.log('ICICI Data', JSON.stringify(data));
                                    } else {
                                        console.log('ICICI Data', data.toString());
                                    }

                                    var objResponseFull = {
                                        'err': null,
                                        'result': null,
                                        'raw': JSON.stringify(data),
                                        'soapHeader': null,
                                        'objResponseJson': data
                                    };
                                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                } else {
                                    console.error('Exception : Customer response : data : ', data);
                                    console.error('Exception : Customer response : response : ', response);
                                }
                            });
                        } /*else if (specific_insurer_object.method.Method_Type === 'Pdf') {
                         //var body = JSON.parse(docLog.Insurer_Request);
                         docLog.Insurer_Request = (docLog.Insurer_Request).replace('"policyNo" "', '"policyNo": "');
                         console.error('Exception', 'icici_pdf', docLog.Insurer_Request);
                         var args = {
                         headers: {"Content-Type": "application/json",
                         "Authorization": "Bearer " + dbIciciToken['Token']
                         }
                         };
                         
                         var qs = '?policyNo=' + objProduct.lm_request['policy_number'];
                         client.get(specific_insurer_object.method_file_url + qs, args, function (data, response) {
                         // parsed response body as js object 
                         if (data) {
                         console.log(data);
                         var objResponseFull = {
                         'err': null,
                         'result': data,
                         'raw': JSON.stringify(data),
                         'soapHeader': null,
                         'objResponseJson': data
                         };
                         var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                         } else {
                         console.error('Exception : PDF response : data : ', data);
                         console.error('Exception : PDF response : response : ', response);
                         }
                         });
                         }*/ else {
                            if (objProduct.lm_request['method_type'] === 'Proposal' && objProduct.lm_request['product_id'] === 1 && objProduct.lm_request['is_breakin'] === 'yes' && objProduct.prepared_request['Plan_Name'] !== 'TP' && objProduct.lm_request['is_inspection_done'] === 'yes') {
                                console.log('Proposal call after Car Inspection is done successfully : ', objProduct.prepared_request['insurer_customer_identifier']);
                                var data = objProduct.prepared_request['insurer_customer_identifier'];
                                var objResponseFull = {
                                    'err': null,
                                    'result': data,
                                    'raw': data,
                                    'soapHeader': null,
                                    'objResponseJson': data
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            } else {
                                //var body = JSON.parse(docLog.Insurer_Request);
                                var args = {
                                    data: docLog.Insurer_Request, //JSON.stringify(body),
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                        "Authorization": "Bearer " + dbIciciToken['Token']
                                    }
                                };
                                console.log(JSON.stringify(args));
                                client.post(specific_insurer_object.method.Service_URL, args, function (data, response) {
                                    // parsed response body as js object 
                                    if (data) {
                                        console.log('ICICI Data', JSON.stringify(data));
                                        var objResponseFull = {
                                            'err': null,
                                            'result': null,
                                            'raw': JSON.stringify(data),
                                            'soapHeader': null,
                                            'objResponseJson': data
                                        };
                                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                        if (specific_insurer_object.method.Method_Type === 'Idv') {
                                            objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                                        }
                                    } else {
                                        console.error('Exception : ', specific_insurer_object.method.Method_Type, ' response : data : ', data);
                                        console.error('Exception : ', specific_insurer_object.method.Method_Type, ' response : response : ', response);
                                    }
                                });
                            }
                        }
                    }
                });
            } catch (ex) {
                console.error('Exception for getting Token from DB : ', this.constructor.name, ex);
            }
        }

    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
IciciLombardMotor.prototype.icicilombard_idv_calculation = function () {
    console.log('icicilombard_idv_calculation', this);
    var icici_exshowroom = 0;
    try {
        if (this.prepared_request['vehicle_expected_idv'] - 0 > 0) {
            var expected_idv = parseInt(this.prepared_request['vehicle_expected_idv']);
            var normal_idv = parseInt(this.prepared_request['vehicle_normal_idv']);
            var exshowroom = parseInt(this.prepared_request['dbmaster_insurer_vehicle_exshowroom']);
            let idv_depreciation_rate = Math.round((normal_idv / exshowroom) * 100);
            icici_exshowroom = Math.round((100 / idv_depreciation_rate) * expected_idv);
            //icici_exshowroom = exshowroom;
        } else {
            icici_exshowroom = parseInt(this.prepared_request['dbmaster_insurer_vehicle_exshowroom']);
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'icicilombard_idv_calculation', ex.stack);
    }
    return icici_exshowroom;
};
IciciLombardMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('status')) {
            //check error stop
            /*if (objResponseJson['status'] === 'Success') {
             var Idv_Breakup = this.const_idv_breakup;
             Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson['generalInformation']['depriciatedIDV'] - 0);
             Idv_Breakup["Idv_Min"] = parseInt(Idv_Breakup["Idv_Normal"] * 1);
             Idv_Breakup["Idv_Max"] = parseInt(Idv_Breakup["Idv_Normal"] * 1);
             Idv_Breakup["Exshowroom"] = parseInt(objResponseJson['generalInformation']['showRoomPrice'] - 0);
             
             objServiceHandler.Premium_Breakup = Idv_Breakup;
             objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['correlationId'];
             } else {
             Error_Msg = objResponseJson['message'];
             }*/
            if (objResponseJson['status'] === true) {
                var Idv_Breakup = this.const_idv_breakup;
                let idv_depreciation_rate = 100 - (objResponseJson['minexshowroomdeviationlimit'] - 0);
                Idv_Breakup["Idv_Min"] = parseInt(objResponseJson["minidv"] - 0);
                Idv_Breakup["Idv_Max"] = parseInt(objResponseJson["maxidv"] - 0);
                Idv_Breakup["Idv_Normal"] = parseInt((objResponseJson['minidv'] - 0) * 100 / idv_depreciation_rate);
                if (objResponseJson['vehiclesellingprice'] > 0) {
                    Idv_Breakup["Exshowroom"] = parseInt(objResponseJson['vehiclesellingprice'] - 0);
                } else {
                    let dep_rate = 1 - objResponseJson["idvdepreciationpercent"];
                    Idv_Breakup["Exshowroom"] = Math.round(Idv_Breakup["Idv_Normal"] / dep_rate);
                }
                //Idv_Breakup["Exshowroom"] = parseInt((objResponseJson['maximumprice'] + objResponseJson['minimumprice']) / 2);

                /*
                 Idv_Breakup["Idv_Min"] = parseInt(objResponseJson["minidv"] - 0);
                 Idv_Breakup["Idv_Max"] = parseInt(objResponseJson["minidv"] - 0);
                 Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson["minidv"] - 0);
                 Idv_Breakup["Exshowroom"] = parseInt(objResponseJson['minimumprice'] - 0);
                 */
                objServiceHandler.Premium_Breakup = Idv_Breakup;
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['correlationId'];
            } else {
                Error_Msg = objResponseJson['message'];
            }
            objServiceHandler.Error_Msg = Error_Msg;
            console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
        } else {
            Error_Msg = Error_Msg = JSON.stringify(objResponseJson);
            objServiceHandler.Error_Msg = Error_Msg;
            console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
        }
    } catch (e) {
        objServiceHandler.Error_Msg = e;
        console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
IciciLombardMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objPremiumService = objResponseJson;

    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('status')) {
            if (objResponseJson['status'].indexOf('Success') > -1) {
                var car_breakin_flag = false;
                var car_breakin_value = parseInt((this.lm_request['vehicle_insurance_subtype'].split('CH'))[0]);
                if (this.prepared_request['Plan_Name'] === 'TP')
                {
                    car_breakin_flag = true;
                } else if ((parseInt(this.lm_request['product_id']) === 1) && car_breakin_value === 1 && this.lm_request['is_breakin'] === 'yes') {
                    car_breakin_flag = true;
                } else {
                    if ((objResponseJson.hasOwnProperty('isQuoteDeviation') && objResponseJson['isQuoteDeviation'] === false)
                            && (objResponseJson.hasOwnProperty('breakingFlag') && objResponseJson['breakingFlag'] === false)
                            && (objResponseJson.hasOwnProperty('isApprovalRequired') && objResponseJson['isApprovalRequired'] === false)) {
                        car_breakin_flag = true;
                    } else {
                        car_breakin_flag = false;
                    }
                }

                if (car_breakin_flag) {
                    var premium_breakup = this.get_const_premium_breakup();
                    for (var key in this.premium_breakup_schema) {
                        if (typeof this.premium_breakup_schema[key] === 'object') {
                            var subobjPremiumService = objPremiumService['riskDetails'];
                            for (var sub_key in this.premium_breakup_schema[key]) {
                                var premium_key = this.premium_breakup_schema[key][sub_key];
                                var premium_val = 0;
                                if (premium_key && subobjPremiumService.hasOwnProperty(premium_key)) {
                                    premium_val = subobjPremiumService[premium_key];
                                }
                                premium_val = isNaN(premium_val) ? 0 : premium_val;
                                premium_val = (premium_val < 0) ? (0 - premium_val) : premium_val;
                                premium_breakup[key][sub_key] = premium_val;
                            }
                        } else {
                            var premium_key = this.premium_breakup_schema[key];
                            var premium_val = 0;
                            if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                                premium_val = objPremiumService[premium_key];
                            }
                            premium_val = isNaN(premium_val) ? 0 : premium_val;
                            premium_breakup[key] = premium_val;
                        }
                    }
                    var group_final = 0, total_addon_premium = 0;
                    for (var key in premium_breakup) {
                        if ((['own_damage', 'addon'].indexOf(key) > -1) && typeof premium_breakup[key] === 'object') {
                            var premium_val = 0;
                            for (var sub_key in premium_breakup[key]) {
                                premium_val = premium_breakup[key][sub_key];
                                if (sub_key.indexOf('_disc') > -1) {
                                    group_final -= premium_val;
                                } else if (sub_key.indexOf('addon_') > -1) {
                                    group_final += premium_val;
                                    total_addon_premium += premium_val;
                                } else {
                                    group_final += premium_val;
                                }
                            }
                        }
                    }

                    premium_breakup['liability']['tp_final_premium'] = objPremiumService['totalLiabilityPremium'] - 0;

                    if (this.prepared_request['Plan_Name'] === 'TP') {
                        premium_breakup['own_damage']['od_disc_ncb'] = group_final - 0;
                        premium_breakup['own_damage']['od_final_premium'] = group_final - 0;
                        objServiceHandler.Premium_Breakup = premium_breakup;
                    } else if ((this.prepared_request['Plan_Name'] !== 'TP')) {
                        premium_breakup['own_damage']['od_disc_ncb'] = group_final - objPremiumService['totalOwnDamagePremium'] - 0;
                        premium_breakup['own_damage']['od_final_premium'] = group_final - total_addon_premium - premium_breakup['own_damage']['od_disc_ncb'] - 0;
                        objServiceHandler.Premium_Breakup = premium_breakup;
                    }
                    objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['correlationId'];
                } else {
                    objResponseJson['PolicyBoss_Remarks'] = "Either of these - isQuoteDeviation, breakingFlag, isApprovalRequired - is having flag as true. Hence Blocked.";
                    Error_Msg = JSON.stringify(objResponseJson);
                }
            } else {
                Error_Msg = objResponseJson['message'];
            }
        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        objServiceHandler.Error_Msg = e;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        return objServiceHandler;
    }
};
IciciLombardMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var IdvMethod = this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Idv');
        specific_insurer_object.method = IdvMethod;
        if (specific_insurer_object.method.Service_File && fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
            specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
        } else {
            specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
        }
        var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + IdvMethod.Method_Request_File).toString();
        var objReplace = {
            '___addon_invoice_price_cover___': 'False',
            '___addon_zero_dep_cover___': '',
            '___addon_personal_belonging_loss_cover___': '',
            '___addon_road_assist_cover___': '',
            '___addon_road_assist_cover_6_TW___': 'True',
            '___addon_consumable_cover___': 'False',
            '___addon_key_lock_cover___': '',
            '___addon_engine_protector_cover___': 'False'
        };

        this.method_content = method_content.replaceJson(objReplace);
        this.insurer_product_field_process_pre();
        console.log(method_content);
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
IciciLombardMotor.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if ((parseInt(this.lm_request['product_id']) === 1) && this.lm_request['is_breakin'] === 'yes' && this.prepared_request['Plan_Name'] !== 'TP' && this.lm_request['is_inspection_done'] === 'no') {
            if (objResponseJson.hasOwnProperty('status')) {
                if (objResponseJson['status'] === 'Success') {
                    if (objResponseJson.hasOwnProperty('brkId') && objResponseJson['brkId'] !== '') {
                    } else {
                        Error_Msg = 'Inspection Id not found customer_response_handler';
                    }
                } else {
                    Error_Msg = objResponseJson['message'];
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }
        } else {
            if (objResponseJson.length === 36) {

            } else {
                Error_Msg = objResponseJson.toString();
            }
        }

        if (Error_Msg === 'NO_ERR') {
            var Customer = {};
            if ((parseInt(this.lm_request['product_id']) === 1) && this.lm_request['is_breakin'] === 'yes' && this.prepared_request['Plan_Name'] !== 'TP' && this.lm_request['is_inspection_done'] === 'no') {
                Customer = {
                    'insurer_customer_identifier': objResponseJson['brkId']
                };
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['brkId'];
            } else {
                Customer = {
                    'insurer_customer_identifier': objResponseJson.toString()
                };
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.toString();
            }
            objServiceHandler.Customer = Customer;
            //objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.toString();
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
IciciLombardMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);

    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    try {
        var Error_Msg = 'NO_ERR';
        var ProposalJson = {};
        if (objResponseJson.length === 36) {

        } else {
            if (objResponseJson.hasOwnProperty('status')) {
                if (objResponseJson['status'].indexOf('Success') > -1) {
                    var car_breakin_flag = false;
                    var car_breakin_value = parseInt((this.lm_request['vehicle_insurance_subtype'].split('CH'))[0]);

                    if (this.prepared_request['Plan_Name'] === 'TP') {
                        car_breakin_flag = true;
                    } else if ((parseInt(this.lm_request['product_id']) === 1) && car_breakin_value === 1 && this.lm_request['is_breakin'] === 'yes') {
                        car_breakin_flag = true;
                    } else {
                        if ((objResponseJson.hasOwnProperty('isQuoteDeviation') && objResponseJson['isQuoteDeviation'] === false)
                                && (objResponseJson.hasOwnProperty('breakingFlag') && objResponseJson['breakingFlag'] === false)
                                && (objResponseJson.hasOwnProperty('isApprovalRequired') && objResponseJson['isApprovalRequired'] === false)) {
                            car_breakin_flag = true;
                        } else {
                            car_breakin_flag = false;
                        }
                    }

                    if (this.prepared_request['Plan_Name'] !== 'TP') {
                        if (car_breakin_flag) {
                            if (objResponseJson['deviationMessage'] !== '') {
                                Error_Msg = objResponseJson['deviationMessage'];
                            }
                        } else {
                            objResponseJson['PolicyBoss_Remarks'] = "Either of these - isQuoteDeviation, breakingFlag, isApprovalRequired - is having flag as true. Hence Blocked.";
                            Error_Msg = "Either of these - isQuoteDeviation, breakingFlag, isApprovalRequired - is having flag as true. Hence Blocked.";
                        }
                    }
                } else {
                    Error_Msg = objResponseJson['message'];
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }
        }
        var pg_data = {};
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.length === 36) {
                pg_data = {
                    'transactionId': objResponseJson.toString()
                };
                ProposalJson = {
                    'insurer_proposal_identifier': objResponseJson.toString()
                };

                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.ProposalJson = ProposalJson;
                objServiceHandler.Payment.pg_redirect_mode = 'GET';
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.toString();
            } else {
                var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], objResponseJson['finalPremium'], 2, 5);
                var vehicle_expected_idv = this.lm_request['vehicle_expected_idv'] || 0;
				vehicle_expected_idv = vehicle_expected_idv -0;
                var vehicle_received_idv = (objResponseJson['generalInformation']['depriciatedIDV'] - 0);
                var idv_diff = vehicle_expected_idv - vehicle_received_idv;
                idv_diff = (0 > idv_diff) ? (0 - idv_diff) : idv_diff;
                var is_idv_verified = false;
                if (vehicle_expected_idv === vehicle_received_idv) {
                    is_idv_verified = true;
                }
                if (idv_diff < 50) {
                    is_idv_verified = true;
                }
                if (is_idv_verified) {
                    if (objPremiumVerification.Status) {
                        var customer_id = objResponseJson['generalInformation']['customerId'];
                        var proposal_no = objResponseJson['generalInformation']['proposalNumber'];
                        var transaction_id = (this.processed_request['___insurer_customer_identifier___']).toString();

                        //objResponseJson['generalInformation']['transactionId'] = transaction_id;
                        if ((parseInt(this.lm_request['product_id']) === 1) && this.lm_request['is_breakin'] === 'yes' && this.prepared_request['Plan_Name'] !== 'TP' && this.lm_request['is_inspection_done'] === 'no') {
                            if (transaction_id !== '') {
                                var myobj = {
                                    PB_CRN: parseInt(this.lm_request['crn']),
                                    UD_Id: this.lm_request['udid'],
                                    SL_Id: this.lm_request['slid'],
                                    Insurer_Id: 6,
                                    Request_Unique_Id: this.processed_request['___dbmaster_pb_request_unique_id___'],
                                    Service_Log_Unique_Id: this.processed_request['___dbmaster_pb_service_log_unique_id___'],
                                    Inspection_Id: transaction_id,
                                    Status: 'INSPECTION_SCHEDULED',
                                    Created_On: new Date(),
                                    Modified_On: '',
                                    Correlation_Id: objResponseJson['correlationId'],
                                    Reference_Date: objResponseJson['generalInformation']['referenceProposalDate'],
                                    Reference_No: objResponseJson['generalInformation']['proposalNumber']
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
                                } catch (e) {
                                    console.error('Exception', this.constructor.name, 'proposal_response_handler', e);
                                }
                                objServiceHandler.Insurer_Transaction_Identifier = proposal_no + "-" + customer_id + "-" + transaction_id;

                                var objRequestCore = {
                                    'customer_name': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                                    'crn': this.lm_request['crn'],
                                    'vehicle_text': this.lm_request['vehicle_text'],
                                    'insurer_name': 'ICICI Lombard General Insurance Co. Ltd.',
                                    'insurance_type': 'RENEW - Breakin Case',
                                    'inspection_id': transaction_id,
                                    'final_premium': Math.round(this.lm_request['final_premium']),
                                    'inspection_label': "*Note",
                                    'inspection_link': 'ICICI Lombard General Insurance Co. Ltd. will contact you.'
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
                                            if (dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'] !== 0 && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
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

                                pg_data = {
                                    'transactionId': objServiceHandler.Insurer_Transaction_Identifier
                                };

                            } else {
                                Error_Msg = 'Inspection Id not found customer_response_handler';
                            }
                        } else {
                            objServiceHandler.Insurer_Transaction_Identifier = proposal_no + "-" + customer_id;
                            pg_data = {
                                'transactionId': transaction_id
                            };
                        }

                        objServiceHandler.Payment.pg_data = pg_data;
                        objServiceHandler.Payment.pg_redirect_mode = 'GET';
                        //objServiceHandler.Insurer_Transaction_Identifier = proposal_no + "-" + customer_id;
                    } else {
                        Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                    }
                } else {
                    Error_Msg = 'LM_IDV_MISMATCH_REQUEST_IDV_' + vehicle_expected_idv.toString() + '_RECEIVED_IDV_' + vehicle_received_idv.toString();
                }
            }

            //for razorpay wallet
            //if ([7582, 8067, 16114].indexOf(parseInt(this.lm_request['ss_id'])) > -1) {
            this.prepared_request['rzrpay_customer_id'] = objResponseJson['generalInformation']['customerId'];
            this.processed_request['___rzrpay_customer_id___'] = objResponseJson['generalInformation']['customerId'];
            this.prepared_request['rzrpay_proposal_no'] = objResponseJson['generalInformation']['proposalNumber'];
            this.processed_request['___rzrpay_proposal_no___'] = objResponseJson['generalInformation']['proposalNumber'];
            //}
            // for razorpay wallet
            if (this.lm_request.hasOwnProperty('pay_from') && this.lm_request['pay_from'] === 'wallet') {
                var pg_data = {
                    'ss_id': this.lm_request['ss_id'],
                    'crn': this.lm_request['crn'],
                    'User_Data_Id': this.lm_request['udid'],
                    'product_id': this.lm_request['product_id'],
                    'premium_amount': this.lm_request['final_premium'],
                    'customer_name': this.lm_request['first_name'] + " " + this.lm_request['last_name'],
                    'txnId': this.lm_request['udid'] + ',' + this.lm_request['crn'] + ',' + this.lm_request['proposal_id'] + ',' + this.lm_request['insurer_id'],
                    'pg_type': "wallet"
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Payment.pg_url = ((config.environment.name === 'Production') ? "https://www.policyboss.com/wallet-confirm" : "http://qa.policyboss.com/TransactionDetail_Form/index.html") + "?udid=" + this.lm_request['udid'];
            } else {
//                if (this.lm_request && this.lm_request.hasOwnProperty('pg_order_response') && this.lm_request['pg_order_response']) {
//                    var merchant_key = config.razor_pay.rzp_icici.username;
//                    var razorpay_response = this.lm_request['pg_order_response'];
//                    var full_name = this.lm_request['middle_name'] === "" ? (this.lm_request['first_name'] + " " + this.lm_request['last_name']) : (this.lm_request['first_name'] + " " + this.lm_request['middle_name'] + " " + this.lm_request['last_name']);
//                    var pg_data = {
//                        'key': merchant_key,
//                        'full_name': full_name,
//                        'return_url': this.const_payment.pg_ack_url,
//                        'phone': this.lm_request['mobile'],
//                        'orderId': razorpay_response["id"],
//                        'txnId': this.lm_request['udid'] + ',' + this.lm_request['crn'] + ',' + this.lm_request['proposal_id'] + ',' + this.lm_request['insurer_id'],
//                        'quoteId': objServiceHandler.Insurer_Transaction_Identifier,
//                        'amount': Math.round(this.lm_request['final_premium']),
//                        'email': this.lm_request['email'],
//                        'img_url': 'https://origin-cdnh.policyboss.com/website/Images/PolicyBoss-Logo.jpg',
//                        'pg_type': "rzrpay",
//                        'transfer_id': razorpay_response.hasOwnProperty('transfers') && razorpay_response['transfers'][0].hasOwnProperty('status') && razorpay_response['transfers'][0]['status'] === "created" ? razorpay_response['transfers'][0]['id'] : ""
//                    };
//                    objServiceHandler.Payment.pg_data = pg_data;
//                    objServiceHandler.Payment.pg_redirect_mode = 'POST';
//                    objServiceHandler.Payment.pg_url = "";
//                    objServiceHandler.Insurer_Transaction_Identifier = razorpay_response["id"];
//                } else {
//                    Error_Msg = "LM_PG_ORDER_NOT_CREATED";
//                }
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
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
IciciLombardMotor.prototype.status_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'status_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Recon_Reference_Number': null,
        'Data': null,
        'Pg_Status': null,
        'pg_post': null
    };
    try {
        var Error_Msg = 'NO_ERR';
        var objserviceResponse = objResponseJson;
        if (objserviceResponse && objserviceResponse.hasOwnProperty('AuthCode') && objserviceResponse.hasOwnProperty('PGtransactionId')) {
            if ((objserviceResponse['AuthCode'] !== null && objserviceResponse['AuthCode'] !== "" && objserviceResponse['AuthCode'] !== undefined) && (objserviceResponse['AuthCode'] !== null && objserviceResponse['AuthCode'] !== "" && objserviceResponse['AuthCode'] !== undefined)) {
                Error_Msg = "NO_ERR";
            } else {
                Error_Msg = objserviceResponse;
            }
        } else {
            Error_Msg = objserviceResponse;
        }
        var pg_post = {
            "TransactionId": "",
            "Amount": "0",
            "MerchantId": "ICICIPART",
            "GatewayId": "",
            "GatewayName": "",
            "Success": "Fail",
            "AdditionalInfo1": "INR",
            "AdditionalInfo2": "",
            "AdditionalInfo3": "",
            "AdditionalInfo4": "",
            "AdditionalInfo5": "",
            "AdditionalInfo6": "",
            "AdditionalInfo7": "",
            "AdditionalInfo8": "",
            "AdditionalInfo9": "",
            "AdditionalInfo10": "",
            "AdditionalInfo11": "",
            "AdditionalInfo12": "",
            "AdditionalInfo13": "",
            "AdditionalInfo14": "",
            "AdditionalInfo15": "",
            "GatewayErrorCode": "",
            "GatewayErrorText": "",
            "PGIMasterErrorCode": "",
            "pgiUserErrorCode": "",
            "AuthCode": "",
            "PGTransactionId": "",
            "PGTransactionDate": "",
            "PGPaymentId": "",
            "OrderId": ""
        };
        if (Error_Msg === 'NO_ERR') {
            objServiceHandler['Data'] = objserviceResponse;
            objServiceHandler['Recon_Reference_Number'] = '';
            objServiceHandler['Pg_Status'] = "SUCCESS";
            pg_post['TransactionId'] = this.prepared_request['icici_transaction_id'];
            pg_post['Amount'] = objserviceResponse['Amount'];
            pg_post['AuthCode'] = objserviceResponse['AuthCode'];
            pg_post['PGTransactionId'] = objserviceResponse['PGtransactionId'];
            pg_post['GatewayName'] = objserviceResponse['GatewayName'];
            pg_post['GatewayId'] = objserviceResponse['GatewayId'];
            pg_post['MerchantId'] = objserviceResponse['MerchantId'];
            pg_post['Status'] = objserviceResponse['Status'];
            pg_post['Success'] = 'True';
            objServiceHandler['pg_post'] = pg_post;
        } else {
            objServiceHandler['Data'] = objserviceResponse;
            objServiceHandler['Recon_Reference_Number'] = '';
            objServiceHandler['Pg_Status'] = "FAIL";
            pg_post['TransactionId'] = this.prepared_request['icici_transaction_id'];
            objServiceHandler['pg_post'] = pg_post;
        }

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

IciciLombardMotor.prototype.pg_response_handler = function () {
    //TransactionId=3cc4b640-4dee-11e8-86a3-67490f199bec&Amount=2.00&MerchantId=ICICILUAT&GatewayId=27&GatewayName=BillDesk&Success=True&AdditionalInfo1=INR&AdditionalInfo2=INR&AdditionalInfo3=INR&AdditionalInfo4=INR&AdditionalInfo5=INR&AdditionalInfo6=INR&AdditionalInfo7=INR&AdditionalInfo8=INR&AdditionalInfo9=INR&AdditionalInfo10=NA&AdditionalInfo11=NA&AdditionalInfo12=NA&AdditionalInfo13=NA&AdditionalInfo14=NA&AdditionalInfo15=NA&GatewayErrorCode=&GatewayErrorText=&PGIMasterErrorCode=&pgiUserErrorCode=&AuthCode=1&PGTransactionId=1&PGTransactionDate=&PGPaymentId=
    try {
        var objInsurerProduct = this;
        this.const_policy.pg_status = 'FAIL';
        this.const_policy.transaction_status = 'FAIL';
        if (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === 'wallet') {
            var output = objInsurerProduct.const_payment_response.pg_post;
            if (output['status'] === 'Success') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_status = 'SUCCESS';
                this.const_policy.transaction_amount = output['amount'];
                this.const_policy.transaction_id = output['txnid'];
                this.const_policy.pg_reference_number_1 = objInsurerProduct.proposal_processed_request['___insurer_customer_identifier___'];
                this.const_policy.pg_reference_number_2 = output['transfer_id'];
                this.const_policy.pg_reference_number_3 = (config.environment.name === 'Production') ? 'IyaE5ZN1gdjDT2' : 'ICICILUAT';
                this.const_policy.pg_reference_number_4 = output['order_id'];
                this.const_policy.pg_reference_number_5 = objInsurerProduct.proposal_processed_request['___rzrpay_customer_id___'];
                this.const_policy.policy_id = objInsurerProduct.proposal_processed_request['___rzrpay_proposal_no___'];
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else if (objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response.pg_data.pg_type === "rzrpay") {
            var output = objInsurerProduct.const_payment_response.pg_get;
            if (output['Status'] === 'Success') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_status = 'SUCCESS';
                this.const_policy.transaction_amount = objInsurerProduct.const_payment_response.pg_data.amount;
                this.const_policy.transaction_id = output['PayId'].toString();
                this.const_policy.pg_reference_number_1 = objInsurerProduct.proposal_processed_request['___insurer_customer_identifier___'];
                this.const_policy.pg_reference_number_2 = objInsurerProduct.const_payment_response.pg_data.transfer_id;
                this.const_policy.pg_reference_number_3 = (config.environment.name === 'Production') ? 'IyaE5ZN1gdjDT2' : 'ICICILUAT';
                this.const_policy.pg_reference_number_4 = output['OrderId'];
                this.const_policy.pg_reference_number_5 = objInsurerProduct.proposal_processed_request['___rzrpay_customer_id___'];
                this.const_policy.policy_id = objInsurerProduct.proposal_processed_request['___rzrpay_proposal_no___'];
                if (output.hasOwnProperty('Signature') && output.Signature) {
                    var secret_key = config.razor_pay.rzp_icici.password;
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
            this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_post['TransactionId'];
            if (objInsurerProduct.lm_request.pg_post['Success'] === 'True') { //&& objInsurerProduct.lm_request.pg_post['GatewayErrorText'] === '' && objInsurerProduct.lm_request.pg_post['PGTransactionId'] !== ''
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_status = 'SUCCESS';
                this.const_policy.transaction_amount = objInsurerProduct.lm_request.pg_post['Amount'];
                this.const_policy.pg_reference_number_1 = objInsurerProduct.lm_request.pg_post['TransactionId'];
                this.const_policy.pg_reference_number_2 = objInsurerProduct.lm_request.pg_post['AuthCode'];
                this.const_policy.pg_reference_number_3 = objInsurerProduct.lm_request.pg_post['MerchantId'];
                this.const_policy.pg_reference_number_4 = objInsurerProduct.lm_request.pg_post['AdditionalInfo2'];
                this.const_policy.pg_reference_number_5 = objInsurerProduct.lm_request.pg_post['AdditionalInfo1'];
                this.const_policy.policy_id = objInsurerProduct.lm_request.pg_post['AdditionalInfo3'];
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
                this.const_policy.pg_message = objInsurerProduct.lm_request.pg_post['GatewayErrorText'];
            }
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex.stack);
    }
};
IciciLombardMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objInsurerProduct = this;
    let paymentTagResponse;
    let paymentMapResponse;
    let objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    let Error_Msg = 'NO_ERR';
    try {
        var product_name = 'CAR';
        if (parseInt(this.lm_request['product_id']) === 10) {
            product_name = 'TW';
        }
        if (objInsurerProduct.prepared_request.pg_status === 'FAIL') {

        }
        if (objInsurerProduct.prepared_request.pg_status === 'SUCCESS') {
            let policy_number = '';
            if (objResponseJson.hasOwnProperty('status')) {
                if (objResponseJson['status'] === true) {
                    if (objResponseJson['paymentMappingResponse'] && objResponseJson['paymentTagResponse']) {
                        paymentMapResponse = objResponseJson['paymentMappingResponse']['paymentMapResponseList'][0];
                        paymentTagResponse = objResponseJson['paymentTagResponse']['paymentTagResponseList'][0];
                        if ((paymentTagResponse['status'] === 'SUCCESS' && paymentMapResponse['status'] === 'SUCCESS') || (paymentTagResponse['status'] === 'FAILED' && paymentTagResponse['error_ID'] === '6')) {
                            if (paymentMapResponse.hasOwnProperty('policyNo') && paymentMapResponse['policyNo'] !== '' && paymentMapResponse['policyNo'] !== null) {
                                policy_number = paymentMapResponse['policyNo'];
                            } else {
                                Error_Msg = 'LM_POLICY_NUMBER_EMPTY';
                            }
                            /* else if (paymentTagResponse.hasOwnProperty('policyNo') && paymentTagResponse['policyNo'] !== '' && paymentTagResponse['policyNo'] !== null) {
                             policy_number = paymentTagResponse['policyNo'];
                             } */
                        } else {
                            Error_Msg = 'LM_MAP_ERR-' + paymentMapResponse['errorText'] + '|TAG_ERR-' + paymentTagResponse['errorText'];
                        }
                    }
                    if (parseInt(this.lm_request['product_id']) === 10 && objResponseJson['paymentMappingResponse'] === null && objResponseJson['paymentTagResponse']) {
                        paymentTagResponse = objResponseJson['paymentTagResponse']['paymentTagResponseList'][0];
                        if ((paymentTagResponse['status'] === 'SUCCESS') || (paymentTagResponse['status'] === 'FAILED' && paymentTagResponse['error_ID'] === '6')) {
                            if (paymentTagResponse.hasOwnProperty('policyNo') && paymentTagResponse['policyNo'] !== '' && paymentTagResponse['policyNo'] !== null) {
                                policy_number = paymentTagResponse['policyNo'];
                            } else {
                                Error_Msg = 'LM_POLICY_NUMBER_EMPTY';
                            }
                        } else {
                            Error_Msg = 'LM_TAG_ERR-' + paymentTagResponse['errorText'];
                        }
                    }

                } else {
                    Error_Msg = objResponseJson['statusMessage'];
                }

            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }

            if (Error_Msg === 'NO_ERR') {
                objInsurerProduct.const_policy.policy_number = policy_number;
                objInsurerProduct.const_policy.transaction_status = 'SUCCESS';

                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + objInsurerProduct.const_policy.policy_number.toString().replaceAll('/', '') + '.pdf';
                var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                //var pdf_web_path = config.environment.portalurl + config.pb_config.pdf_web_loc + pdf_file_name;
                //var pdf_web_path = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                objInsurerProduct.const_policy.policy_url = pdf_web_path;

                let tmp_customerId = null;
                if (objInsurerProduct.hasOwnProperty("const_payment_response")) {
                    if (objInsurerProduct.const_payment_response.hasOwnProperty("pg_data")) {
                        if (objInsurerProduct.const_payment_response.pg_data.hasOwnProperty("quoteId")) {
                            tmp_customerId = ((objInsurerProduct.const_payment_response.pg_data.quoteId).split('-')[1]);
                        }
                    }
                } else {
                    if (objInsurerProduct.hasOwnProperty("processed_request")) {
                        if (objInsurerProduct.processed_request.hasOwnProperty("___pg_reference_number_4___")) {
                            tmp_customerId = objInsurerProduct.processed_request['___pg_reference_number_4___'];
                        }
                    }
                }

                var args = {
                    data: {
                        "search_reference_number": objInsurerProduct.lm_request['search_reference_number'],
                        "api_reference_number": objInsurerProduct.lm_request['api_reference_number'],
                        "policy_number": objInsurerProduct.const_policy.policy_number,
                        "correlationId": objInsurerProduct.proposal_processed_request['___insurer_customer_identifier___'], //objResponseJson['correlationId'],
                        "customerId": tmp_customerId, //objInsurerProduct.insurer_master['service_logs']['insurer_db_master']['Insurer_Response']['generalInformation']['customerId'],
                        "crn": objInsurerProduct.lm_request['crn'],
                        "client_key": objInsurerProduct.lm_request['client_key'],
                        "secret_key": objInsurerProduct.lm_request['secret_key'],
                        "insurer_id": objInsurerProduct.lm_request['insurer_id'],
                        "method_type": "Pdf",
                        "execution_async": "no"
                    },
                    headers: {
                        "Content-Type": "application/json",
                        "client_key": objInsurerProduct.lm_request['client_key'],
                        "secret_key": objInsurerProduct.lm_request['secret_key']
                    }
                };
                this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
            } else {
                objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
                //find method field
                try {
                    var User_Data = require(appRoot + '/models/user_data');
                    User_Data.findOne({"User_Data_Id": this.lm_request['udid']}, function (err, dbUserData) {
                        if (err) {
                            console.error('Exception', this.constructor.name, ' PAYPASS : verification_response_handler', err);
                        } else {
                            if (dbUserData) {
                                let ObjPayPass = {
                                    'PB_CRN': dbUserData['PB_CRN'],
                                    'Customer': dbUserData['Proposal_Request']['first_name'] + ' ' + dbUserData['Proposal_Request']['last_name'],
                                    'Product': product_name,
                                    'VehicleNumber': dbUserData["Proposal_Request_Core"]["registration_no"],
                                    'correlationId': objResponseJson['correlationId'],
                                    'paymentEntryResponse_paymentID': objResponseJson['paymentEntryResponse']['paymentID'],
                                    'Error': Error_Msg
                                };
                                var msg = '<!DOCTYPE html><html><head><title>PolicyBoss-Landmark Paypass Notification</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                msg += '<div class="report"><span style="font-size:14px;font-family:\'Google Sans\' ,tahoma;">Dear ICICI Team,<BR>Following transaction is been received as Paypass (Payment Deducted but Policy Not Created).<BR>Following is transaction details. Please provide policy copy.<br>In case of query, Please write to techsupport@policyboss.com <br><br></span><table border="1" cellpadding="3" cellspacing="0" width="90%">';
                                for (let k3 in ObjPayPass) {
                                    msg += '<tr><td  width="30%" style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #ffcc00">' + k3 + '</td><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">' + ObjPayPass[k3] + '&nbsp;</td></tr>';
                                }
                                msg += '</table></div></body></html>';

                                var Email = require(appRoot + '/models/email');
                                var objModelEmail = new Email();
                                var sub = '[ICICI-PAYPASS] CRN: ' + dbUserData['PB_CRN'] + ' correlationId: ' + objResponseJson['correlationId'];
                                let arr_to = ['becky.sandhu@icicilombard.com', 'alkesh.parmar@ext.icicilombard.com', 'sheili.gwalia@icicilombard.com'];
                                let arr_cc = ['techsupport@policyboss.com', 'jyoti.sharma@policyboss.com', 'susanna.lobo@landmarkinsurance.in'];
                                objModelEmail.send('notifications@policyboss.com', arr_to.join(','), sub, msg, arr_cc.join(','), config.environment.notification_email, dbUserData['PB_CRN']);
                            } else {
                                console.error('Exception', this.constructor.name, ' PAYPASS - User_Data : verification_response_handler : dbUserData : ', dbUserData);
                                console.error('Exception', this.constructor.name, ' PAYPASS - User_Data : verification_response_handler : err : ', err);
                            }
                        }
                    });
                } catch (ex2) {
                    console.error('PaypassNotification', ex2);
                }
            }
            objServiceHandler.Insurer_Transaction_Identifier = objInsurerProduct.const_policy.transaction_id;
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
IciciLombardMotor.prototype.pg_response_handler_NIU = function () {
    //TransactionId=3cc4b640-4dee-11e8-86a3-67490f199bec&Amount=2.00&MerchantId=ICICILUAT&GatewayId=27&GatewayName=BillDesk&Success=True&AdditionalInfo1=INR&AdditionalInfo2=INR&AdditionalInfo3=INR&AdditionalInfo4=INR&AdditionalInfo5=INR&AdditionalInfo6=INR&AdditionalInfo7=INR&AdditionalInfo8=INR&AdditionalInfo9=INR&AdditionalInfo10=NA&AdditionalInfo11=NA&AdditionalInfo12=NA&AdditionalInfo13=NA&AdditionalInfo14=NA&AdditionalInfo15=NA&GatewayErrorCode=&GatewayErrorText=&PGIMasterErrorCode=&pgiUserErrorCode=&AuthCode=1&PGTransactionId=1&PGTransactionDate=&PGPaymentId=
    try {
        this.const_policy.pg_status = '';
        this.const_policy.transaction_id = this.const_payment_response.pg_post['TransactionId'];
        if (this.const_payment_response.pg_post['Success'] === 'True') {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.transaction_amount = this.const_payment_response.pg_post['Amount'];
            this.const_policy.pg_reference_number_1 = this.const_payment_response.pg_post['TransactionId'];
            this.const_policy.pg_reference_number_2 = this.const_payment_response.pg_post['AuthCode'];
            this.const_policy.pg_reference_number_3 = this.const_payment_response.pg_post['MerchantId'];
            this.const_policy.pg_reference_number_4 = this.const_payment_response.pg_post['AdditionalInfo2'];
            this.const_policy.pg_reference_number_5 = this.const_payment_response.pg_post['AdditionalInfo1'];
            this.const_policy.policy_id = this.const_payment_response.pg_post['AdditionalInfo3'];
        } else if (this.const_payment_response.pg_post['Success'] === 'False') {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler_NIU', ex);
    }
};
IciciLombardMotor.prototype.verification_response_handler_NIU = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler_NIU', objResponseJson);
    let paymentTagResponse;
    let paymentMapResponse;
    let objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    let Error_Msg = 'NO_ERR';
    try {
        var product_name = 'CAR';
        if (parseInt(this.lm_request['product_id']) === 10) {
            product_name = 'TW';
        }
        if (this.const_policy.pg_status === 'FAIL') {

        }
        if (this.const_policy.pg_status === 'SUCCESS') {
            let policy_number = '';
            if (objResponseJson.hasOwnProperty('status')) {
                if (objResponseJson['status'] === true) {
                    paymentMapResponse = objResponseJson['paymentMappingResponse']['paymentMapResponseList'][0];
                    paymentTagResponse = objResponseJson['paymentTagResponse']['paymentTagResponseList'][0];
                    if (paymentTagResponse['status'] === 'SUCCESS' && paymentMapResponse['status'] === 'SUCCESS') {
                        if (paymentMapResponse.hasOwnProperty('policyNo') && paymentMapResponse['policyNo'] !== '' && paymentMapResponse['policyNo'] !== null) {
                            policy_number = paymentMapResponse['policyNo'];
                        } else {
                            Error_Msg = 'LM_POLICY_NUMBER_EMPTY';
                        }
                        /* else if (paymentTagResponse.hasOwnProperty('policyNo') && paymentTagResponse['policyNo'] !== '' && paymentTagResponse['policyNo'] !== null) {
                         policy_number = paymentTagResponse['policyNo'];
                         } */
                    } else {
                        Error_Msg = 'LM_MAP_ERR-' + paymentMapResponse['errorText'] + '|TAG_ERR-' + paymentTagResponse['errorText'];
                    }
                } else {
                    Error_Msg = objResponseJson['statusMessage'];
                }

            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }

            if (Error_Msg === 'NO_ERR') {
                this.const_policy.policy_number = policy_number;
                this.const_policy.transaction_status = 'SUCCESS';

                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number.toString().replaceAll('/', '') + '.pdf';
                var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                //var pdf_web_path = config.environment.portalurl + config.pb_config.pdf_web_loc + pdf_file_name;
                //var pdf_web_path = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
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
                this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
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
                                    'VehicleNumber': dbUserData["Proposal_Request_Core"]["registration_no"],
                                    'correlationId': objResponseJson['correlationId'],
                                    'paymentEntryResponse_paymentID': objResponseJson['paymentEntryResponse']['paymentID'],
                                    'Error': Error_Msg
                                };
                                var msg = '<!DOCTYPE html><html><head><title>PolicyBoss-Landmark Paypass Notification</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                msg += '<div class="report"><span style="font-size:14px;font-family:\'Google Sans\' ,tahoma;">Dear ICICI Team,<BR>Following transaction is been received as Paypass (Payment Deducted but Policy Not Created).<BR>Following is transaction details. Please provide policy copy.<br>In case of query, Please write to techsupport@policyboss.com <br><br></span><table border="1" cellpadding="3" cellspacing="0" width="90%">';
                                for (let k3 in ObjPayPass) {
                                    msg += '<tr><td  width="30%" style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #ffcc00">' + k3 + '</td><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">' + ObjPayPass[k3] + '&nbsp;</td></tr>';
                                }
                                msg += '</table></div></body></html>';

                                var Email = require(appRoot + '/models/email');
                                var objModelEmail = new Email();
                                var sub = '[ICICI-PAYPASS] CRN: ' + dbUserData['PB_CRN'] + ' correlationId: ' + objResponseJson['correlationId'];
                                let arr_to = ['becky.sandhu@icicilombard.com', 'alkesh.parmar@ext.icicilombard.com', 'sheili.gwalia@icicilombard.com'];
                                let arr_cc = ['techsupport@policyboss.com', 'jyoti.sharma@policyboss.com', 'susanna.lobo@landmarkinsurance.in'];
                                objModelEmail.send('notifications@policyboss.com', arr_to.join(','), sub, msg, arr_cc.join(','), config.environment.notification_email, dbUserData['PB_CRN']);
                            }
                        }
                    });
                } catch (ex2) {
                    console.error('PaypassNotification', ex2);
                }
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler_NIU', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler_NIU', objServiceHandler);
    }
    return objServiceHandler;
};
IciciLombardMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
IciciLombardMotor.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var policy = {
        'policy_url': null,
        'policy_number': this.lm_request['policy_number'],
        'pdf_status': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objPremiumService = objResponseJson;
        if (objPremiumService.hasOwnProperty('errorText') && objPremiumService.errorText !== "" && objPremiumService.errorText !== null) {
            Error_Msg = objPremiumService.errorText;
        }
        if (Error_Msg === 'NO_ERR') {
            if (objPremiumService) {
                var product_name = 'CAR';
                if (parseInt(this.lm_request['product_id']) === 10) {
                    product_name = 'TW';
                }
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'].replaceAll('/', '') + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
                var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(objPremiumService, 'base64');
                fs.writeFileSync(pdf_sys_loc_horizon, binary);
                //fs.writeFileSync(pdf_sys_loc_portal, binary);
                //policy.policy_url = pdf_web_path_horizon;
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
        return objServiceHandler;
    }

};
IciciLombardMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "basicOD",
        "od_elect_access": "electricalAccessories",
        "od_non_elect_access": "nonElectricalAccessories",
        "od_cng_lpg": "biFuelKitOD",
        "od_disc_ncb": null,
        "od_disc_vol_deduct": "voluntaryDiscount",
        "od_disc_anti_theft": "antiTheftDiscount",
        "od_disc_aai": "automobileAssociationDiscount",
        "od_loading": null,
        "od_disc": null, //loading discount was assigned , no seoparate tag for it 
        "od_final_premium": ""//no specific tag it is calculated from tags = ( OD-Gross Premium) -( OD-MOTADON)
    },
    "liability": {
        "tp_basic": "basicTP",
        "tp_cover_owner_driver_pa": "paCoverForOwnerDriver",
        "tp_cover_unnamed_passenger_pa": "paCoverForUnNamedPassenger",
        "tp_cover_named_passenger_pa": null, //not available
        "tp_cover_paid_driver_pa": null, //Not available
        "tp_cover_paid_driver_ll": "paidDriver",
        "tp_cng_lpg": "biFuelKitTP",
        "tp_cover_tppd": 'tppD_Discount',
        "tp_final_premium": ""
    },
    "addon": {
        "addon_zero_dep_cover": "zeroDepreciation",
        "addon_road_assist_cover": "roadSideAssistance",
        "addon_ncb_protection_cover": null,
        "addon_engine_protector_cover": "engineProtect",
        "addon_invoice_price_cover": "returnToInvoice",
        "addon_key_lock_cover": "keyProtect",
        "addon_consumable_cover": "consumables",
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": "tyreProtect",
        "addon_personal_belonging_loss_cover": "lossOfPersonalBelongings",
        "addon_inconvenience_allowance_cover": null,
        "addon_medical_expense_cover": null,
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": ""
    },
    "net_premium": "packagePremium", //obtained by adding tags (OD-Gross Premium)+(TP-Gross Premium)
    "service_tax": "", //obtained by adding tags (OD-ServTax)+(TP-ServTax)(OD-ServTax)+(TP-ServTax)Gross Premium + ServTax
    "final_premium": "finalPremium"
};
module.exports = IciciLombardMotor;
