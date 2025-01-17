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
function DigitMotor() {

}
util.inherits(DigitMotor, Motor);
DigitMotor.prototype.lm_request_single = {};
DigitMotor.prototype.insurer_integration = {};
DigitMotor.prototype.insurer_addon_list = [];
DigitMotor.prototype.insurer = {};
DigitMotor.prototype.pdf_attempt = 0;
DigitMotor.prototype.insurer_date_format = 'yyyy-MM-dd';
DigitMotor.prototype.insurer_product_api_pre = function () {

};
DigitMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        if (this.lm_request['is_policy_exist']) {
            if (this.lm_request['is_policy_exist'] === 'no') {
                this.method_content = this.method_content.replace('___is_policy_exist___', 'false');
            }
        }
        if (this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
            this.prepared_request['vehicle_insurance_subtype_2'] = "20103";
            this.processed_request['___vehicle_insurance_subtype_2___'] = this.prepared_request['vehicle_insurance_subtype_2'];
            this.prepared_request['og_prev_policy_type'] = "1OD_3TP";
            this.processed_request['___og_prev_policy_type___'] = this.prepared_request['og_prev_policy_type'];
        }
        if ((this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) && this.lm_request.hasOwnProperty('is_tppd') && this.lm_request['is_tppd'] === "yes") {//&& this.lm_request['vehicle_insurance_subtype'] === '0CH_1TP'
            this.method_content = this.method_content.replace('___is_tppd___', 'true');
        } else {
            this.method_content = this.method_content.replace('___is_tppd___', 'false');
        }
        if (this.lm_request.hasOwnProperty('is_pa_od') && this.lm_request['is_pa_od'] === "yes") {//&& this.lm_request['vehicle_insurance_subtype'] === '0CH_1TP'
            this.method_content = this.method_content.replace('___is_pa_od___', 'true');
        } else {
            this.method_content = this.method_content.replace('___is_pa_od___', 'false');
        }
        if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
            var premium_tp_policy_details = {
                "isCurrentThirdPartyPolicyActive": null,
                "currentThirdPartyPolicyInsurerCode": this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Id'],
                "currentThirdPartyPolicyNumber": "434525252524",
                "currentThirdPartyPolicyStartDateTime": "___pre_policy_start_date___",
                "currentThirdPartyPolicyExpiryDateTime": "___policy_end_date___"
            };
            var customer_tp_policy_details = {
                "isCurrentThirdPartyPolicyActive": null,
                "currentThirdPartyPolicyInsurerCode": "___tp_insurer_code___",
                "currentThirdPartyPolicyNumber": "___tp_policy_number___",
                "currentThirdPartyPolicyStartDateTime": "___tp_start_date___",
                "currentThirdPartyPolicyExpiryDateTime": "___tp_end_date___"
            };
            this.method_content = this.method_content.replace('___tp_policy_details___', JSON.stringify(premium_tp_policy_details));
            this.method_content = this.method_content.replace('"___policy_start_date___"', 'null');
            this.method_content = this.method_content.replace('"___policy_end_date___"', 'null');
            if (this.lm_request['method_type'] === 'Customer') {
                this.method_content = this.method_content.replace('___tp_policy_details___', JSON.stringify(customer_tp_policy_details));
                this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                var tp_start_date = (this.lm_request['tp_start_date']).split('-');
                this.prepared_request['tp_start_date'] = tp_start_date[2] + "-" + tp_start_date[1] + "-" + tp_start_date[0];
                this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
                var tp_end_date = (this.lm_request['tp_end_date']).split('-');
                this.prepared_request['tp_end_date'] = tp_end_date[2] + "-" + tp_end_date[1] + "-" + tp_end_date[0];
                this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
                this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Id'];
                this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
            }
            if (this.processed_request['___Plan_Code___'] === 'car_od' && this.processed_request['___Plan_Name___'] === 'OD') {
                this.prepared_request['addon_zero_dep_cover'] = 'no';
                this.processed_request['___addon_zero_dep_cover___'] = 'false';
            }
            console.log('txt_replace - > ' + this.method_content);
        } else {
            this.method_content = this.method_content.replace('___tp_policy_details___', null);
            console.log('txt_replace - > ' + this.method_content);
            this.method_content = this.method_content.replace('"___og_prev_policy_type___"', 'null');
        }
        if (this.lm_request['product_id'] === 10 && this.lm_request['vehicle_insurance_type'] === 'renew') {
            if (this.lm_request['vehicle_insurance_subtype'] === '0CH_1TP') {
                this.prepared_request['vehicle_insurance_subtype_2'] = "20202";
                this.processed_request['___vehicle_insurance_subtype_2___'] = this.prepared_request['vehicle_insurance_subtype_2'];
            }
            if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
                this.prepared_request['vehicle_insurance_subtype_2'] = "20203";
                this.processed_request['___vehicle_insurance_subtype_2___'] = this.prepared_request['vehicle_insurance_subtype_2'];
                this.prepared_request['og_prev_policy_type'] = "1OD_5TP";
                this.processed_request['___og_prev_policy_type___'] = this.prepared_request['og_prev_policy_type'];
            }
            if (this.lm_request['vehicle_insurance_subtype'] === '1CH_0TP') {
                this.prepared_request['vehicle_insurance_subtype_2'] = "20201";
                this.processed_request['___vehicle_insurance_subtype_2___'] = this.prepared_request['vehicle_insurance_subtype_2'];
            }
            if (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP') {
                this.prepared_request['vehicle_insurance_subtype'] = "22";
                this.processed_request['___vehicle_insurance_subtype___'] = this.prepared_request['vehicle_insurance_subtype'];
                this.prepared_request['vehicle_insurance_subtype_2'] = "20201";
                this.processed_request['___vehicle_insurance_subtype_2___'] = this.prepared_request['vehicle_insurance_subtype_2'];
            }
            if (this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                this.prepared_request['vehicle_insurance_subtype'] = "33";
                this.processed_request['___vehicle_insurance_subtype___'] = this.prepared_request['vehicle_insurance_subtype'];
                this.prepared_request['vehicle_insurance_subtype_2'] = "20201";
                this.processed_request['___vehicle_insurance_subtype_2___'] = this.prepared_request['vehicle_insurance_subtype_2'];
            }
        }
        if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
            if (this.prepared_request['vehicle_expected_idv'] === 0 || this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1 || (this.prepared_request['vehicle_normal_idv'] === undefined && this.prepared_request['vehicle_min_idv'] === undefined && this.prepared_request['vehicle_max_idv'] === undefined)) {
                this.method_content = this.method_content.replace('___vehicle_expected_idv___', '0');
                this.method_content = this.method_content.replace('___vehicle_normal_idv___', '0');
                this.method_content = this.method_content.replace('___vehicle_min_idv___', '0');
                this.method_content = this.method_content.replace('___vehicle_max_idv___', '0');
            } else {
                this.method_content = this.method_content.replace('___vehicle_expected_idv___', this.prepared_request['vehicle_expected_idv']);
                this.method_content = this.method_content.replace('___vehicle_normal_idv___', this.prepared_request['vehicle_normal_idv']);
                this.method_content = this.method_content.replace('___vehicle_min_idv___', this.prepared_request['vehicle_min_idv']);
                this.method_content = this.method_content.replace('___vehicle_max_idv___', this.prepared_request['vehicle_max_idv']);
            }
        }
        if (this.processed_request['___pa_unnamed_passenger_si___'] === "") {
            this.method_content = this.method_content.replace('___pa_unnamed_passenger_si___', '0');
        }
        if (this.lm_request['method_type'] === 'Proposal') {
            this.prepared_request['thankyouurl'] = this.pg_ack_url();
            //this.prepared_request['thankyouurl'] = 'http://localhost:50111/Payment/Transaction_Status/' + this.lm_request['crn'];
            this.processed_request['___thankyouurl___'] = this.prepared_request['thankyouurl'];
        }
        this.prepared_request['quote_number'] = moment().format("YYYYMMDDHHmmss");
        this.processed_request['___quote_number___'] = this.prepared_request['quote_number'];
        if (this.lm_request['method_type'] === 'Pdf') {
            var application_id = JSON.parse(this.processed_request['___dbmaster_insurer_request___'])['applicationId'];
            this.method_content = this.method_content.replace('___application_id___', application_id);
        }
        if (this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') {
            var ch_flag = ((parseInt(((this.lm_request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
            if (ch_flag && this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_inspection_done'] === 'no') {
                this.method_content = this.method_content.replace('___self_inspection___', 'true');
                this.method_content = this.method_content.replace('___self_inspection_2___', 'true');
            } else {
                this.method_content = this.method_content.replace('___self_inspection___', 'false');
                this.method_content = this.method_content.replace('___self_inspection_2___', 'false');
            }
            if (ch_flag && this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_inspection_done'] === 'yes') {
                if (this.lm_request['method_type'] === 'Proposal') {
                    if (this.Master_Details.hasOwnProperty('proposals')) {
                        if (this.Master_Details.proposals.length > 0) {
                            var i = this.Master_Details.proposals.length;
                            for (var j = 0; j < i; j++) {
                                var str = this.Master_Details.proposals[j]['Insurer_Transaction_Identifier'];
                                if (str.includes("#")) {
                                    this.method_content = this.method_content.replace('___insurer_customer_identifier___', this.Master_Details.proposals[j]['Insurer_Transaction_Identifier'].split('#')[1]);
                                    this.prepared_request['pg_application_id'] = this.Master_Details.proposals[j]['Insurer_Transaction_Identifier'].split('#')[1];
                                    this.processed_request['___pg_application_id___'] = this.prepared_request['pg_application_id'];
                                }
                            }
                        }
                    }
                    //this.method_content = this.method_content.replace('___insurer_customer_identifier___', 'V2046CB8AF3F0FEA89CB7BFB98BB2838AAB8ED845BD10FF5D7414A6A8EECE978BA64909B97F57B04CCF7C9FC3A3D251C47');
                    //this.prepared_request['pg_application_id'] = 'V2046CB8AF3F0FEA89CB7BFB98BB2838AAB8ED845BD10FF5D7414A6A8EECE978BA64909B97F57B04CCF7C9FC3A3D251C47';
                    //this.processed_request['___pg_application_id___'] = this.prepared_request['pg_application_id'];
                }
            }

            if (this.lm_request['vehicle_class'] && this.lm_request['vehicle_class'] === "gcv" && this.insurer_master.service_logs.insurer_db_master.Insurer_Response.vehicle.grossVehicleWeight) {
                this.method_content = this.method_content.replace('___grossVehicleWeight___', JSON.stringify(this.insurer_master.service_logs.insurer_db_master.Insurer_Response.vehicle.grossVehicleWeight));
            } else {
                this.method_content = this.method_content.replace('"grossVehicleWeight":___grossVehicleWeight___,', '');
            }
            this.prepared_request['enquiry_id'] = this.insurer_master.service_logs.insurer_db_master.Insurer_Response.enquiryId;
            this.processed_request['___enquiry_id___'] = this.prepared_request['enquiry_id'];

            //posp start
            var obj_posp_replace = {
                '___is_posp___': 'false',
                '___posp_mobile_no___': '',
                '___posp_agent_city___': '',
                '___posp_aadhar___': '',
                '___posp_first_name___': '',
                '___posp_middle_name___': '',
                '___posp_last_name___': '',
                '___posp_pan_no___': ''

            };
            if (this.lm_request['is_posp'] === 'yes') {
                obj_posp_replace = {
                    '___is_posp___': 'true',
                    '___posp_mobile_no___': '8356844187',
                    '___posp_agent_city___': this.lm_request['posp_agent_city'],
                    '___posp_aadhar___': this.lm_request['posp_aadhar'],
                    '___posp_first_name___': this.lm_request['posp_first_name'],
                    '___posp_middle_name___': ((this.lm_request['posp_middle_name'] === null || this.lm_request['posp_middle_name'] === '' || this.lm_request['posp_middle_name'] === undefined) ? '' : this.lm_request['posp_middle_name']),
                    '___posp_last_name___': this.lm_request['posp_last_name'],
                    '___posp_pan_no___': this.lm_request['posp_pan_no']
                };
            }
            this.method_content = this.method_content.toString().replaceJson(obj_posp_replace);
            //posp end 

            if (this.lm_request['vehicle_registration_type'] === "corporate") {
                this.method_content = this.method_content.replace('"addressType": "PRIMARY_RESIDENCE",', '"addressType": "HEAD_QUARTER",');
                var company_request_data1 = this.find_text_btw_key(this.method_content.toString(), '"isVehicleOwner": true,', '"nominee": {', false);
                this.method_content = this.method_content.replace(company_request_data1, '"isPayer": null,"companyName": "___company_name___"}],');
                var company_request_data2 = this.find_text_btw_key(this.method_content.toString(), '"nominee": {', '"pospInfo": {', false);
                this.method_content = this.method_content.replace(company_request_data2, '');
                this.method_content = this.method_content.replace('"nominee": {', '');
            }
        }
        if ((this.lm_request['method_type'] === 'Verification')) {
            this.prepared_request['enquiry_id'] = this.insurer_master.service_logs.insurer_db_master.Insurer_Response.enquiryId;
            this.processed_request['___enquiry_id___'] = this.prepared_request['enquiry_id'];
            this.prepared_request['transaction_Id'] = this.const_policy.pg_reference_number_1;
            this.processed_request['___transaction_Id___'] = this.prepared_request['transaction_Id'];
            this.prepared_request['final_policy_number'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['insurer_customer_identifier_3'];
            this.processed_request['___final_policy_number___'] = this.prepared_request['final_policy_number'];
        }
        if (this.lm_request['product_id'] === 12) {
            if (this.lm_request['vehicle_class'] && this.lm_request['vehicle_class'] === "gcv") {
                if (this.lm_request['imt23'] && this.lm_request['imt23'] === 'yes') {
                    this.method_content = this.method_content.replace('___is_imt23___', 'true');
                } else {
                    this.method_content = this.method_content.replace('___is_imt23___', 'false');
                }
            } else {
                this.method_content = this.method_content.replace('___is_imt23___', 'false');
            }
            if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
                if (this.prepared_request['pa_unnamed_passenger_si'] === "") {
                    this.method_content = this.method_content.replace('___pa_unnamed_passenger_si___', '0');
                }
                if (this.prepared_request['pa_paid_driver_si'] === "") {
                    this.method_content = this.method_content.replace('___pa_paid_driver_si___', '0');
                }
                if (this.prepared_request['is_llpd'] === "no") {
                    this.method_content = this.method_content.replace('___is_llpd_3___', 'false');
                } else {
                    this.method_content = this.method_content.replace('___is_llpd_3___', 'true');
                }
            }
            if (this.lm_request['method_type'] === 'Pdf') {
                this.prepared_request['policy_id'] = (JSON.parse(this.processed_request["___dbmaster_insurer_request___"])).applicationId;
                this.processed_request['___policy_id___'] = this.prepared_request['policy_id'];
            }
            if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
                if (this.processed_request['___is_tppd___'] === "") {
                    this.method_content = this.method_content.replace('___is_tppd___', 'false');
                }
            }
            if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
                if (this.lm_request['vehicle_class'] === "pcv") {
                    this.prepared_request['permit_type'] = "PRIVATE";
                    this.processed_request['___permit_type___'] = this.prepared_request['permit_type'];
                }
                if (this.lm_request['vehicle_class'] === "gcv") {
                    if (this.lm_request['vehicle_sub_class'] === "gcv_public_otthw" || this.lm_request['vehicle_sub_class'] === "gcv_public_thwpc") {
                        this.prepared_request['permit_type'] = "PUBLIC";
                        this.processed_request['___permit_type___'] = this.prepared_request['permit_type'];
                    } else if (this.lm_request['vehicle_sub_class'] === "gcv_private_otthw" || this.lm_request['vehicle_sub_class'] === "gcv_private_thwpc") {
                        this.prepared_request['permit_type'] = "PRIVATE";
                        this.processed_request['___permit_type___'] = this.prepared_request['permit_type'];
                    }
                }
            }
        }
        if ((this.lm_request['method_type'] === 'Status') && this.processed_request && this.processed_request['___dbmaster_pb_insurer_response_core___'] && (JSON.parse(this.processed_request['___dbmaster_pb_insurer_response_core___'])['Insurer_Request']) && (JSON.parse(JSON.parse(this.processed_request['___dbmaster_pb_insurer_response_core___'])['Insurer_Request'])['applicationId'])) {
            this.prepared_request['transaction_id'] = JSON.parse(JSON.parse(this.processed_request['___dbmaster_pb_insurer_response_core___'])['Insurer_Request'])['applicationId'];
            this.processed_request['___transaction_id___'] = this.prepared_request['transaction_id'];
        }
        if ((this.lm_request['method_type'] === 'Customer') && this.insurer_lm_request && this.insurer_lm_request['addon_zero_dep_cover'] && this.insurer_lm_request['addon_zero_dep_cover'] === "yes") {
            this.prepared_request['addon_zero_dep_cover'] = 'yes';
            this.processed_request['___addon_zero_dep_cover___'] = 'true';
        }
        
        if (this.lm_request['vehicle_insurance_type'] === 'new' && ([1, 10].indexOf(this.lm_request['product_id']) > -1) && this.lm_request['is_pa_od'] == "yes") {
            if(this.lm_request.hasOwnProperty('cpa_tenure')) {
                this.prepared_request['cpa_tenure'] = this.lm_request['cpa_tenure'];
                this.processed_request['___cpa_tenure___'] = this.prepared_request['cpa_tenure'];
            } else{
                this.prepared_request['cpa_tenure'] = 1;
                this.processed_request['___cpa_tenure___'] = 1;
            }
        } else{
            this.prepared_request['cpa_tenure'] = 0;
            this.processed_request['___cpa_tenure___'] = 0;
        }
        if (this.lm_request['method_type'] === 'Customer'){
            if([0, 1].indexOf(this.processed_request['___cpa_tenure___']) > -1){
                this.prepared_request['policy_od_amount'] = "INR 330.00";
                this.processed_request['___policy_od_amount___'] = this.prepared_request['policy_od_amount'];
            } else {
                this.prepared_request['policy_od_amount'] = "INR 909.00";
                this.processed_request['___policy_od_amount___'] = this.prepared_request['policy_od_amount'];
            }            
        }
        if(this.lm_request['method_type'] === 'Customer' && this.lm_request['vehicle_registration_type'] === "individual"){
            if(this.processed_request['___nominee_name___']) {
                let nomi_name = this.processed_request['___nominee_name___'].split(" ");
                
                this.prepared_request['nominee_first_name'] = nomi_name[0] !== undefined ? nomi_name[0] : "";
                this.processed_request['___nominee_first_name___'] = this.prepared_request['nominee_first_name'];
                this.prepared_request['nominee_middle_name'] = nomi_name.length === 2 ? "" : nomi_name[1] !== undefined ? nomi_name[1] : "";
                this.processed_request['___nominee_middle_name___'] = this.prepared_request['nominee_middle_name'];
                this.prepared_request['nominee_last_name'] = nomi_name.length === 2 ? nomi_name[1] : nomi_name[2] !== undefined ? nomi_name[2] : "";
                this.processed_request['___nominee_last_name___'] = this.prepared_request['nominee_last_name'];
            } else {
                this.prepared_request['nominee_first_name'] = "";
                this.processed_request['___nominee_first_name___'] = this.prepared_request['nominee_first_name'];
                this.prepared_request['nominee_middle_name'] = "";
                this.processed_request['___nominee_middle_name___'] = this.prepared_request['nominee_middle_name'];
                this.prepared_request['nominee_last_name'] = "";
                this.processed_request['___nominee_last_name___'] = this.prepared_request['nominee_last_name'];
            }
            if(this.processed_request['___first_name___'] || this.processed_request['___middle_name___'] || this.processed_request['___last_name___']){
                let firstName = this.processed_request['___first_name___'].split(" ");
                let middleName = this.processed_request['___middle_name___'];
                let lastName = this.processed_request['___last_name___'];
                if(firstName.length > 1){
                    this.prepared_request['first_name'] = this.processed_request['___first_name___'].split(" ")[0];
                    this.processed_request['___first_name___'] = this.prepared_request['first_name'];
                    
                    let MiddleName = "";
                    if(firstName.length > 2){
                        for (var j = 1; j <= firstName.length - 2; j++) {
                            MiddleName += firstName[j] + " ";
                        }
                    }
                    if(lastName === ""){
                        this.prepared_request['last_name'] = firstName[firstName.length - 1];
                        this.processed_request['___last_name___'] = this.prepared_request['last_name'];
                    } else if(middleName === "" && MiddleName !== ""){
                        this.prepared_request['middle_name'] = MiddleName;
                        this.processed_request['___middle_name___'] = this.prepared_request['middle_name'];
                    } else {
                        this.prepared_request['middle_name'] = MiddleName + " " + firstName[firstName.length - 1] + " " + middleName;
                        this.processed_request['___middle_name___'] = this.prepared_request['middle_name'];
                    }
                }
            }
        }
        //start for kyc
        if(this.lm_request['method_type'] === 'Customer'){
            var filepath = fs.readFileSync(appRoot + this.lm_request['doc_url']);
            var docConvert = Buffer.from(filepath).toString('base64');
            this.prepared_request['photo_doc'] = docConvert;
            this.processed_request['___photo_doc___'] = this.prepared_request['photo_doc'];
        }
        //end for kyc
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
DigitMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
    if (specific_insurer_object.method.Method_Type === 'Customer') {
        obj_response_handler = this.customer_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Status') {
        obj_response_handler = this.status_response_handler(objResponseJson);
    }
    return obj_response_handler;
};
DigitMotor.prototype.insurer_product_field_process_post = function () {

};
DigitMotor.prototype.insurer_product_api_post = function () {

};
DigitMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id; //
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        // var PostData = JSON.parse(docLog.Insurer_Request);

        //Example POST method invocation 
        var Client = require('node-rest-client').Client;
        console.log(this.lm_request);
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        var client = new Client();
        // set content-type header and data as json in args parameter 
        console.log(docLog.Insurer_Request);
        var username = objInsurerProduct.processed_request["___insurer_integration_service_user___"];
        var password = objInsurerProduct.processed_request["___insurer_integration_service_password___"];
        var args = {
            data: docLog.Insurer_Request,
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
            },
            "rejectUnauthorized": false
        };
        if (specific_insurer_object.method.Method_Type === 'Status') {
            var head = {
                headers: {
                    'Authorization': '2MKNV7SYB5IOYJ3XX9Q2KB7RYLHUO77R'
                }
            };
            if (config.environment.name === 'Production') {
                head['headers']['Authorization'] = '2MKNV7SYB5IOYJ3XX9Q2KB7RYLHUO77R';
            }
            //var txn_id = ((this.const_payment_response['pg_post'] && this.const_payment_response['pg_post']['applicationId']) ? (this.const_payment_response['pg_post']['applicationId']) : (objProduct['lm_request']['transactionId']));
            var txn_id = this.prepared_request['transaction_id'];
            client.get(specific_insurer_object['method']['Service_URL'] + txn_id, head, function (data, response) { //
                console.log(data);
                console.log(objResponseFull);
                var objResponseFull = {
                    'err': null,
                    'result': data,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        } else {
            if (specific_insurer_object.method.Method_Type === 'Proposal' || specific_insurer_object.method.Method_Type === 'Pdf') {
                args['headers']['Authorization'] = objInsurerProduct.processed_request["___insurer_integration_agent_code___"];
            }
            if (specific_insurer_object.method.Method_Name === "Digit_Car_Verification" || specific_insurer_object.method.Method_Name === "Digit_TW_Verification") {
                //specific_insurer_object.method.Method_Action = this.const_payment_response.pg_get.transactionNumber + "/issue";
                var objProposalInsurerRequest = JSON.parse(this.prepared_request['dbmaster_insurer_request']);
                specific_insurer_object.method.Method_Action = objProposalInsurerRequest.applicationId + "/issue";
                console.error('DigitVerificationAction', specific_insurer_object.method.Method_Action);
            }
            client.post(specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action, args, function (data, response) {

                console.log(data.toString());
                console.log(data);
                //data = data.toString();
                var parse = require('xml-parser');
                console.log("Digit" + data);
                var objResponseFull = {
                    'err': null,
                    'result': null,
                    'raw': JSON.stringify(docLog),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                console.log(objResponseFull);
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                if (specific_insurer_object.method.Method_Type === 'Idv') {
                    objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                }
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
DigitMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    //check error start
    try {
        if (objResponseJson.hasOwnProperty('error')) {
            //check error stop
            if (objResponseJson['error']['errorCode'] === 0 || objResponseJson['error']['httpCode'] === 200) {

            } else {
                Error_Msg = objResponseJson['error']['validationMessages'];
            }
        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }
        if (Error_Msg === 'NO_ERR') {
            var Idv_Breakup = this.const_idv_breakup;
            if (Error_Msg === 'NO_ERR') {
                Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson['vehicle']['vehicleIDV']['defaultIdv'] - 0);
                Idv_Breakup["Idv_Min"] = parseInt(objResponseJson['vehicle']['vehicleIDV']['minimumIdv'] - 0);
                Idv_Breakup["Idv_Max"] = parseInt(objResponseJson['vehicle']['vehicleIDV']['maximumIdv'] - 0);
                Idv_Breakup["Exshowroom"] = 0;
                var enquiry = objResponseJson['enquiryId'];
                objServiceHandler.Premium_Breakup = Idv_Breakup;
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['enquiryId'];
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        objServiceHandler.Error_Msg = JSON.stringify(e);
        console.error('Exception', this.constructor.name, 'idv_response_handler', objServiceHandler);
        return objServiceHandler;
    }
};
DigitMotor.prototype.customer_response_handler = function (objResponseJson) {

    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.prepared_request['Plan_Name'] !== 'TP' && this.lm_request['is_inspection_done'] === 'yes') {
            Error_Msg = 'NO_ERR';
            var objCustomerData = JSON.parse(objResponseJson);
            var Customer = {
                'insurer_customer_identifier': objCustomerData.enquiryId
            };
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = objCustomerData.enquiryId;
        } else {
            //check error start
            if (objResponseJson.hasOwnProperty('error')) {
                //check error stop
                if (objResponseJson['error']['errorCode'] === 0 || objResponseJson['error']['httpCode'] === 200) {

                } else {
                    if (objResponseJson['error']['validationMessages'][1]) {
                        Error_Msg = objResponseJson['error']['validationMessages'][1];
                    } else {
                        Error_Msg = objResponseJson['error']['validationMessages'];
                    }
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }
            if (Error_Msg === 'NO_ERR') {
                //var thankyouurl = ((config.environment.name === 'Production') ? 'http://www.policyboss.com' : 'http://localhost:50111') + '/Payment/Transaction_Status?crn=' + this.lm_request['crn'];
                //var thankyouurl = 'http://localhost:50111/Payment/Transaction_Status/' + this.lm_request['crn'];
                var thankyouurl = this.const_payment.pg_ack_url;
                var application_id = objResponseJson['applicationId'];
                var policy_no = objResponseJson['policyNumber'];
                var pg_data = {
                    'applicationId': application_id,
                    'successReturnUrl': thankyouurl, //this.const_payment.pg_ack_url,
                    'cancelReturnUrl': thankyouurl, //this.const_payment.pg_ack_url,
                    'expiryHours': '48'
                };
                console.log("Jyoti Digit PG DATA Customer : ", pg_data);
                //   objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                var Customer = {
                    'insurer_customer_identifier': objResponseJson.applicationId,
                    'insurer_customer_identifier_1': thankyouurl,
                    'insurer_customer_identifier_2': objResponseJson.enquiryId,
                    'insurer_customer_identifier_3': objResponseJson.policyNumber,
                    'final_premium_verified': this.round2Precision((objResponseJson.grossPremium.substring(4)) - 0)
                            //'insurer_customer_identifier_response': JSON.stringify(objResponseJson)
                };
                this.const_payment_response.final_premium = this.round2Precision((objResponseJson.grossPremium.substring(4)) - 0);
                var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], this.const_payment_response.final_premium, 50, 50);
                if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                    if (objPremiumVerification.Status) {
                        /*this.const_payment_response.pg_data = pg_data;
                         objServiceHandler.Customer = Customer;
                         objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.enquiryId;*/
                    } else {
                        Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                    }
                } else {
                    var vehicle_expected_idv = (this.lm_request['vehicle_expected_idv'] - 0);
                    var vehicle_received_idv = (objResponseJson['vehicle']['vehicleIDV']['idv'] - 0);
                    if (vehicle_expected_idv === vehicle_received_idv) {
                        if (objPremiumVerification.Status) {
                            /*this.const_payment_response.pg_data = pg_data;
                             objServiceHandler.Customer = Customer;
                             objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.enquiryId;*/
                        } else {
                            Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                        }
                    } else {
                        Error_Msg = 'LM_IDV_MISMATCH_REQUEST_IDV_' + vehicle_expected_idv.toString() + '_RECEIVED_IDV_' + vehicle_received_idv.toString();
                    }
                }
                this.const_payment_response.pg_data = pg_data;
                objServiceHandler.Customer = Customer;
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.enquiryId;
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
DigitMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };

    var Error_Msg = 'NO_ERR';
    try {
        var objPremiumService = objResponseJson;
        this.response_object.enquiry_id = objResponseJson.enquiryId;
        if (objResponseJson.hasOwnProperty('error')) {
            //check error stop
            if (objResponseJson['error']['errorCode'] === 0 || objResponseJson['error']['httpCode'] === 200) {

            } else {
                Error_Msg = objResponseJson['error']['validationMessages'];
            }
        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }
        if (this.lm_request['product_id'] === 10 && this.lm_request['is_breakin'] === "yes" && this.processed_request['___vehicle_expected_idv___'] > 59999) {
            Error_Msg = "it's break-in case and vehicle IDV is more then 60,000/- then in that case policy will issue after inspection.";
        }
        if (Error_Msg === 'NO_ERR') {
            var objLMPremium = {};
            objPremiumService = objPremiumService['contract'];
            for (var key in objPremiumService['coverages']) {
                if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
                    if (key === 'ownDamage') {
                        if (Object.keys(objPremiumService['coverages'][key]).length > 0) {
                            objLMPremium[key] = this.round2Precision((objPremiumService['coverages'][key]['netPremium'].substring(4)) - 0);
                        }
                    }
                } else {
                    if (key === 'thirdPartyLiability' || key === 'ownDamage') {
                        if ((Object.keys(objPremiumService['coverages'][key]).length > 0) && (objPremiumService['coverages'][key]['netPremium'])) {
                            objLMPremium[key] = this.round2Precision((objPremiumService['coverages'][key]['netPremium'].substring(4)) - 0);
                        }
                    }
                }
                if (key === 'ownDamage') {
                    if (Object.keys(objPremiumService['coverages'][key]).length > 0) {
                        if ((objPremiumService['coverages'][key]['discount']) && (Object.keys(objPremiumService['coverages'][key]['discount']['discounts']).length > 0)) {
                            for (var dis_key in objPremiumService['coverages'][key]['discount']['discounts']) {
                                objLMPremium[objPremiumService['coverages'][key]['discount']['discounts'][dis_key]['discountType']] =
                                        this.round2Precision((objPremiumService['coverages'][key]['discount']['discounts'][dis_key]['discountAmount'].substring(4)) - 0);
                            }
                        }
                    }
                }
                if (key === 'personalAccident') {
                    if (Object.keys(objPremiumService['coverages'][key]).length > 0 && objPremiumService['coverages'][key]['selection'] === true) {
                        objLMPremium[key] = this.round2Precision((objPremiumService['coverages'][key]['netPremium'].substring(4)) - 0);
                    } else {
                        objLMPremium[key] = 0;
                    }
                }
                if (key === 'addons' || key === 'legalLiability' || key === 'unnamedPA') {
                    for (var subkey in objPremiumService['coverages'][key]) {
                        if (Object.keys(objPremiumService['coverages'][key][subkey]).length > 0 && objPremiumService['coverages'][key][subkey]['selection'] === true) {
                            objLMPremium[subkey] = this.round2Precision((objPremiumService['coverages'][key][subkey]['netPremium'].substring(4)) - 0);
                        } else {
                            objLMPremium[subkey] = 0;
                        }
                    }
                }
            }
            console.log(objLMPremium);
            //objLMPremium['od_basic'] = objPremiumService['coveragePremium']['baseCoverPremium']['ownDamageCover']['tarifPremium'] - 0;
            //objLMPremium['od_disc'] = objLMPremium['od_basic'] - (objLMPremium['ownDamageCover'] + (objLMPremium['noClaimBonusDiscounts'] * 2));

            var premium_breakup = this.get_const_premium_breakup();
            for (var key in this.premium_breakup_schema) {
                if (typeof this.premium_breakup_schema[key] === 'object') {
                    var group_final = 0,
                            group_final_key = '';
                    for (var sub_key in this.premium_breakup_schema[key]) {
                        if (this.lm_request['product_id'] == 10 && sub_key === 'addon' && key !== 'addon_zero_dep_cover') {
                            continue;
                        }
                        var premium_key = this.premium_breakup_schema[key][sub_key];
                        var premium_val = 0;
                        if (premium_key && objLMPremium.hasOwnProperty(premium_key)) {
                            premium_val = objLMPremium[premium_key];
                        }
                        premium_val = isNaN(premium_val) ? 0 : premium_val;
                        premium_val = (premium_val < 0) ? 0 - premium_val : premium_val;
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
                    if (premium_key && objLMPremium.hasOwnProperty(premium_key)) {
                        premium_val = objLMPremium[premium_key];
                    }
                    premium_val = isNaN(premium_val) ? 0 : premium_val;
                    premium_breakup[key] = premium_val;
                }
                var objTax = this.round2Precision((objResponseJson['serviceTax']['totalTax'].substring(4)) - 0);
                premium_breakup['net_premium'] = this.round2Precision((objResponseJson['netPremium'].substring(4)) - 0);
                premium_breakup['service_tax'] = objTax;
                premium_breakup['final_premium'] = this.round2Precision((objResponseJson['grossPremium'].substring(4)) - 0);
            }
            if (this.lm_request['product_id'] == 10) {
                let zd = premium_breakup['addon']['addon_zero_dep_cover'];
                for (let k  in premium_breakup['addon']) {
                    premium_breakup['addon'][k] = 0;
                }
                premium_breakup['addon']['addon_zero_dep_cover'] = zd;
                premium_breakup['addon']['addon_final_premium'] = zd;
            }

            console.log(this.vehicle_age_year());
            //Coverage
            var Vehicle_Depreciation_Range = {
                'Age_0': '5', //Max 6 Month
                'Age_1': '15', //6-1Years
                'Age_2': '20', //1-2years
                'Age_3': '30', //2-3Years
                'Age_4': '40', //3-4Years
                'Age_5': '50' //4-5Years
            };
            this.prepared_request['enquiry_id'] = objResponseJson['enquiryId'];
            this.processed_request['___enquiry_id___'] = this.prepared_request['enquiry_id'];
            objServiceHandler.Premium_Breakup = premium_breakup;
            //objServiceHandler.Premium_Breakup.own_damage.od_basic = objServiceHandler.Premium_Breakup.own_damage.od_basic + objServiceHandler.Premium_Breakup.own_damage.od_disc_ncb;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['enquiryId'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
DigitMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
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
        method_content = method_content.replace('___lv_quote_no___', this.lv_quote_no());
        this.method_content = method_content.replace('___vehicle_expected_idv___', 0);
        for (var addon_key in this.const_addon_master) {
            this.method_content = this.method_content.replace('___' + addon_key + '___', 'false');
        }
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
DigitMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    try {
        var application_id = objResponseJson.toString();
        var breakin_inspection_id = "";
        if (this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.prepared_request['Plan_Name'] !== 'TP' && this.lm_request['is_inspection_done'] === 'no') {
            breakin_inspection_id = this.prepared_request['insurer_customer_identifier_3'];
            application_id = this.prepared_request['insurer_customer_identifier'];
        } else {
            if (application_id != '' && application_id.indexOf('http') > -1) {

            } else {
                Error_Msg = 'LM_NO_VALID_PG_REDIRECT_URL';
            }
        }

        if (Error_Msg === 'NO_ERR') {
            if (breakin_inspection_id !== '' && this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.prepared_request['Plan_Name'] !== 'TP' && this.lm_request['is_inspection_done'] === 'no') {
                var myobj = {
                    PB_CRN: parseInt(this.lm_request['crn']),
                    UD_Id: this.lm_request['udid'],
                    SL_Id: this.lm_request['slid'],
                    Insurer_Id: 44,
                    Request_Unique_Id: this.processed_request['___dbmaster_pb_request_unique_id___'],
                    Service_Log_Unique_Id: this.processed_request['___dbmaster_pb_service_log_unique_id___'],
                    Inspection_Id: breakin_inspection_id,
                    Application_Id: application_id,
                    Status: 'INSPECTION_SCHEDULED',
                    Created_On: new Date(),
                    Modified_On: ''
                };

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

                var objRequestCore = {
                    'customer_name': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                    'crn': this.lm_request['crn'],
                    'vehicle_text': this.lm_request['vehicle_text'],
                    'insurer_name': 'GoDigit General Insurance Co. Ltd.',
                    'insurance_type': 'RENEW - Breakin Case',
                    'inspection_id': breakin_inspection_id,
                    'final_premium': Math.round(this.lm_request['final_premium']),
                    'inspection_label': "*Note",
                    'inspection_link': 'GoDigit General Insurance Co. Ltd. will contact you.'
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
                            if (dbUserData.Premium_Request['posp_email_id'] !== 0 && dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                            }

                            var arr_bcc = ['horizonlive.2019@gmail.com'];
                            if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== 0 && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
                                if (dbUserData.Premium_Request['posp_reporting_email_id'].indexOf('@') > -1) {
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
            }

            if (this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.prepared_request['Plan_Name'] !== 'TP' && this.lm_request['is_inspection_done'] === 'no') {
                objServiceHandler.Payment.pg_ack_url = this.const_payment.pg_ack_url; //thankyouurl;
                objServiceHandler.Payment.pg_data = '';
                objServiceHandler.Payment.pg_url = application_id;
                objServiceHandler.Payment.pg_redirect_mode = 'GET';
                objServiceHandler.Error_Msg = Error_Msg;
                objServiceHandler.Insurer_Transaction_Identifier = breakin_inspection_id + "#" + application_id;
            } else {
                //var thankyouurl = ((config.environment.name === 'Production') ? 'http://www.policyboss.com' : 'http://qa.policyboss.com') + '/Payment/Transaction_Status?crn=' + this.lm_request['crn'];
                //var thankyouurl = 'http://localhost:50111/Payment/Transaction_Status/' + this.lm_request['crn'];
                objServiceHandler.Payment.pg_ack_url = this.const_payment.pg_ack_url; //thankyouurl;
                objServiceHandler.Payment.pg_data = "";
                objServiceHandler.Payment.pg_url = application_id;
                objServiceHandler.Payment.pg_redirect_mode = 'GET';
                objServiceHandler.Error_Msg = Error_Msg;
                objServiceHandler.Insurer_Transaction_Identifier = application_id;
            }
        }
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
DigitMotor.prototype.pg_response_handler_NIU = function () {
    ///msg=TRANS000000001||A12||MAM22661885141||AM2||4000.00||Canceled By User||0399
    //msg=TRANS000000001||A12||MAM22661885141||AM2||4000.00|| Success||0300
    //referenceid||partnercode||mcitnumber|| referencenum ||amount||msg||msgcode
    //SUCCESS if msgcode '0300'
    if (this.const_payment_response.pg_get.hasOwnProperty('transactionNumber')) {
        var msg = this.const_payment_response.pg_get['transactionNumber'];
        this.const_policy.pg_status = 'SUCCESS';
        this.const_policy.pg_reference_number_1 = msg;
        this.const_policy.transaction_id = msg;
        // this.prepared_request['transaction_Id'] =this.const_policy.pg_reference_number_1;
        //this.processed_request['___transaction_Id___'] = this.prepared_request['transaction_Id'];
    } else {
        this.const_policy.pg_status = 'FAIL';
        this.const_policy.transaction_status = 'FAIL';
    }
};
DigitMotor.prototype.verification_response_handler_NIU = function (objResponseJson) {
    try {
        /*
         {"email":"asdfasf@gmail.com",
         "mobile":"9845456465",
         "vanity_url_part":"godigit",
         "is_wallet_enabled":false,"findUser":true,
         "notifyUser":false,"txnId":"D-a0c64a5d6208"}: 
         */
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
            console.error('DigitChk', objResponseJson);
            /*if (objResponseJson.hasOwnProperty('error')) {
             //check error stop
             if (objResponseJson['error']['errorCode'] === 0 || objResponseJson['error']['errorMessage'] === 'Success') {
             if (objResponseJson.contractStatus.status === "COMPLETE") {
             
             } else {
             Error_Msg = objResponseJson.contractStatus.status;
             }                    
             } else {
             Error_Msg = objResponseJson['error']['errorMessage'];
             }
             } else {
             Error_Msg = JSON.stringify(objResponseJson);
             }*/

            if (Error_Msg === 'NO_ERR') {
                //if (objResponseJson.hasOwnProperty('policyNumber') && objResponseJson['policyNumber'] !== '') {
                if (this.prepared_request['final_policy_number'] !== '') {
                    //var objPremiumService = objResponseJson;
                    //this.const_policy.policy_number = objPremiumService['policyNumber'];
                    this.const_policy.policy_number = this.prepared_request['final_policy_number'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'CAR';
                    if (this.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    if (this.lm_request['product_id'] === 12) {
                        product_name = 'CV';
                    }
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    //var pdf_web_path = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path;
                    // this.const_policy.policy_no = this.const_policy.policy_number;
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
                            'crn': this.lm_request['crn'],
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
                    /*
                     client.post(config.environment.weburl + '/quote/pdf_initiate', args, function (data, response) {
                     
                     });*/
                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        this.const_policy.transaction_status = 'PAYPASS';
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
DigitMotor.prototype.pg_response_handler = function () {
    ///msg=TRANS000000001||A12||MAM22661885141||AM2||4000.00||Canceled By User||0399
    //msg=TRANS000000001||A12||MAM22661885141||AM2||4000.00|| Success||0300
    //referenceid||partnercode||mcitnumber|| referencenum ||amount||msg||msgcode
    //SUCCESS if msgcode '0300'
    try {
        var objInsurerProduct = this;
        if (objInsurerProduct.lm_request.pg_get.hasOwnProperty('transactionNumber')) {
            var msg = objInsurerProduct.lm_request.pg_get['transactionNumber'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.pg_reference_number_1 = msg;
            this.const_policy.transaction_id = msg;
            // this.prepared_request['transaction_Id'] =this.const_policy.pg_reference_number_1;
            //this.processed_request['___transaction_Id___'] = this.prepared_request['transaction_Id'];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
DigitMotor.prototype.status_response_handler = function (objResponseJson) {
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
        if (objserviceResponse && objserviceResponse[0]) {
            Error_Msg = "NO_ERR";
        } else {
            Error_Msg = objserviceResponse;
        }

        if (Error_Msg === 'NO_ERR') {
            var objResponse = objserviceResponse[0];
            objServiceHandler['Data'] = objserviceResponse;
            objServiceHandler['Recon_Reference_Number'] = objResponse['applicationId'];
            objServiceHandler['Pg_Status'] = "SUCCESS";
            objServiceHandler['pg_post'] = objResponse;
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
DigitMotor.prototype.verification_response_handler = function (objResponseJson) {
    var objInsurerProduct = this;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objInsurerProduct.prepared_request.pg_status === 'FAIL') {

        }
        if (objInsurerProduct.prepared_request.pg_status === 'SUCCESS') {
            if (Error_Msg === 'NO_ERR') {
                if (this.prepared_request['final_policy_number'] !== '') {
                    objInsurerProduct.const_policy.policy_number = objInsurerProduct.prepared_request['final_policy_number'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'CAR';
                    if (this.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    if (this.lm_request['product_id'] === 12) {
                        product_name = 'CV';
                    }
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + objInsurerProduct.const_policy.policy_number + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    //var pdf_web_path = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                    objInsurerProduct.const_policy.policy_url = pdf_web_path;
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    var args = {
                        data: {
                            "search_reference_number": objInsurerProduct.lm_request['search_reference_number'],
                            "api_reference_number": objInsurerProduct.lm_request['api_reference_number'],
                            "policy_number": objInsurerProduct.const_policy.policy_number,
                            'client_key': objInsurerProduct.lm_request['client_key'],
                            'secret_key': objInsurerProduct.lm_request['secret_key'],
                            'insurer_id': objInsurerProduct.lm_request['insurer_id'],
                            'crn': objInsurerProduct.lm_request['crn'],
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
                } else {
                    objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
                }
            }
            objServiceHandler.Insurer_Transaction_Identifier = objInsurerProduct.const_policy.transaction_id;
        }
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
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
DigitMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
DigitMotor.prototype.pdf_response_handler = function (objResponseJson) {
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
        if (objPremiumService.hasOwnProperty('schedulePathHC') || objPremiumService.hasOwnProperty('schedulePath')) {
            if (this.lm_request['product_id'] === 12) {
                if (objPremiumService['schedulePath'] != "") {
                    pdf_url = objPremiumService['schedulePath'];
                } else {
                    Error_Msg = 'LM_schedulePath_Node_Empty';
                }
            } else {
                if (objPremiumService['schedulePathHC'] != "" && objPremiumService.hasOwnProperty('schedulePathHC')) {
                    objPremiumService['schedulePathHC'] = objPremiumService['schedulePathHC'].replace('\u003d', '=');
                    pdf_url = objPremiumService['schedulePathHC'];
                } else if (objPremiumService['schedulePath'] != "" && objPremiumService.hasOwnProperty('schedulePath')) {
                    objPremiumService['schedulePath'] = objPremiumService['schedulePath'].replace('\u003d', '=');
                    pdf_url = objPremiumService['schedulePath'];
                } else {
                    Error_Msg = 'LM_schedulePathHC_Node_Empty';
                }
            }
        } else {
            Error_Msg = 'LM_schedulePathHC_OR_schedulePath_Node_Missing';
        }

        if (Error_Msg === 'NO_ERR') {
            var product_name = 'CAR';
            if (this.lm_request['product_id'] === 10) {
                product_name = 'TW';
            }
            if (this.lm_request['product_id'] === 12) {
                product_name = 'CV';
            }
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'] + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
            var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
            var https = require('https');
            var insurer_pdf_url = pdf_url;
            this.const_policy.insurer_policy_url = insurer_pdf_url;
            policy.policy_url = pdf_web_path_portal;
            policy.pdf_status = 'SUCCESS';
            try {
                var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                var request = https.get(insurer_pdf_url, function (response) {
                    response.pipe(file_horizon);
                });
            } catch (ep) {
                console.error('ExceptionPDF', this.constructor.name, 'pdf_response_handler', ep);
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.pdf_status = 'FAIL';
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
DigitMotor.prototype.vehicle_age_year = function () {
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
DigitMotor.prototype.lv_quote_no = function () {
    try {
        return this.create_guid('', 'numeric', 7);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'lv_quote_no', ex);
        return 0;
    }
};
DigitMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "ownDamage", //when PropCoverDetails_CoverGroups = Own Damage
        "od_elect_access": "electrical",
        "od_non_elect_access": "nonElectrical",
        "od_cng_lpg": "cng",
        "od_disc_ncb": "NCB_DISCOUNT",
        "od_disc_vol_deduct": "",
        "od_disc_anti_theft": "",
        "od_disc_aai": "",
        "od_loading": "",
        "od_disc": "",
        "od_disc_own_premises": "",
        "od_final_premium": "ownDamageCover" //NetODPremium
    },
    "liability": {
        "tp_basic": "thirdPartyLiability", ////when PropCoverDetails_CoverGroups = Basic TP  including TPPD premium
        "tp_cover_owner_driver_pa": "personalAccident", //when PropCoverDetails_CoverGroups = Owner Driver
        "tp_cover_unnamed_passenger_pa": "unnamedPax",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "unnamedPaidDriver", //otherDriverCover
        "tp_cover_paid_driver_ll": "paidDriverLL", //this is included in tp_basic
        "tp_cng_lpg": "",
        "tp_cover_imt23": "",
        "tp_cover_fairing_paying_passenger": "",
        "tp_cover_non_fairing_paying_passenger": "nonFarePaxLL",
        "tp_basic_other_use": "",
        "tp_cover_emp_pa": "",
        "tp_final_premium": "",
        "tp_cover_cleaner_ll": "cleanersLL"
    },
    "addon": {
        //"addon_rim_damage_cover": "rimDamageCover",
        "addon_zero_dep_cover": "partsDepreciation",
        "addon_road_assist_cover": "roadSideAssistance", ///when PropCoverDetails_CoverGroups = RoadSide Assist
        "addon_ncb_protection_cover": "",
        "addon_engine_protector_cover": "engineProtection",
        "addon_invoice_price_cover": "returnToInvoice",
        "addon_key_lock_cover": "",
        "addon_consumable_cover": "consumables",
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": "tyreProtection",
        "addon_personal_belonging_loss_cover": "",
        "addon_inconvenience_allowance_cover": null,
        "addon_medical_expense_cover": "",
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": 0
    },
    "net_premium": "netPremium",
    "service_tax": "totalTax",
    "final_premium": "grossPremium"
};
module.exports = DigitMotor;