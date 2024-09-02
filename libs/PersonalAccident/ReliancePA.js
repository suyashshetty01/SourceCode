/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var PersonalAccident = require(appRoot + '/libs/PersonalAccident');
var fs = require('fs');
var config = require('config');
var moment = require('moment');

function ReliancePA() {

}
util.inherits(ReliancePA, PersonalAccident);

ReliancePA.prototype.lm_request_single = {};
ReliancePA.prototype.insurer_integration = {};
ReliancePA.prototype.insurer_addon_list = [];
ReliancePA.prototype.insurer = {};
ReliancePA.prototype.insurer_date_format = 'dd/MM/yyyy';
ReliancePA.prototype.const_insurer_suminsured = [ 500000, 600000, 900000, 1000000, 1500000, 5000000, 10000000];


ReliancePA.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {

    console.log('insurer_product_api_pre');
    
};

ReliancePA.prototype.insurer_product_field_process_pre = function () {
    console.log('insurer_product_field_process_pre');
//    console.log(this.lm_request);
//    console.log(this.prepared_request);    
//    console.log(this.processed_request);
//    console.log(this.method_content);
    
    if (this.lm_request['method_type'] === 'Premium') {
        console.log(' Premium Health PA plan....' + this.method_content);

        var member = 1;
        
        if(this.lm_request['pa_insurance_si'] && this.lm_request['pa_insurance_si'] > 100000){
            this.prepared_request['pa_insurance_si'] = this.lm_request['pa_insurance_si'];
        } else {
            this.prepared_request['pa_insurance_si'] = 1000000;
        }
        this.processed_request['___pa_insurance_si___'] = this.prepared_request['pa_insurance_si'];
        
        for (member = 1; member <= this.lm_request['adult_count']; member++) {

                this.prepared_request['member_' + member + '_age'] = this.lm_request['member_' + member + '_age'];
                this.processed_request['___member_' + member + '_age___'] = this.prepared_request['member_' + member + '_age'];
                this.prepared_request['member_' + member + '_monthly_income'] = this.lm_request['member_' + member + '_monthly_income'];
                this.processed_request['___member_' + member + '_monthly_income___'] = this.prepared_request['member_' + member + '_monthly_income'];
//                this.prepared_request['member_' + member + '_occupation'] = this.lm_request['member_' + member + '_occupation'];
//                this.processed_request['___member_' + member + '_occupation___'] = this.prepared_request['member_' + member + '_occupation'];
                this.prepared_request['member_' + member + '_birth_date'] = this.lm_request['member_' + member + '_birth_date'];
                this.processed_request['___member_' + member + '_birth_date___'] = this.prepared_request['member_' + member + '_birth_date'];
                
                this.prepared_request['member_' + member + '_occupation'] = 1;//this.lm_request['member_' + member + '_occupation'];
                this.processed_request['___member_' + member + '_occupation___'] = 1;//this.lm_request['member_' + member + '_occupation'];
                
                this.prepared_request['member_' + member + '_MaritalStatusID'] = 1951;
                this.processed_request['___member_' + member + '_MaritalStatusID___'] = 1951;
                let annualIncome=(this.lm_request['member_' + member + '_monthly_income']-0)*12;
                
                if(annualIncome >= 60000 || member===1){
                    this.prepared_request['member_' + member + '_AnnualIncome'] = annualIncome;
                    this.prepared_request['member_' + member + '_TotalCapitalSI']=calculateTotalCapitalSI(annualIncome);
                
                }else {
                    
                    this.prepared_request['member_' + member + '_AnnualIncome'] = this.prepared_request['member_1_AnnualIncome'];
                    this.prepared_request['member_' + member + '_TotalCapitalSI']=this.prepared_request['member_1_TotalCapitalSI'];
                
                }
                
                this.processed_request['___member_' + member + '_AnnualIncome___'] = this.prepared_request['member_' + member + '_AnnualIncome'];
                this.processed_request['___member_' + member + '_TotalCapitalSI___'] = this.prepared_request['member_' + member + '_TotalCapitalSI'];
                
                if(member ===1){
                    this.prepared_request['member_' + member + '_RelationshipWithProposerID'] = 345;
                    
                    this.prepared_request['member_' + member + '_gender'] = 0;
                    
                }else{
                    this.prepared_request['member_' + member + '_RelationshipWithProposerID'] = 320;
                    
                    this.prepared_request['member_' + member + '_gender'] = 1;
                    
                }
                
                
                this.processed_request['___member_' + member + '_RelationshipWithProposerID___']=this.prepared_request['member_' + member + '_RelationshipWithProposerID'];
                this.processed_request['___member_' + member + '_gender___']=this.prepared_request['member_' + member + '_gender'];
            
            }
            
            for (member = 3; member <= this.lm_request['child_count']+2; member++) {
                
                this.prepared_request['member_' + member + '_age'] = this.lm_request['member_' + member + '_age'];
                this.processed_request['___member_' + member + '_age___'] = this.lm_request['member_' + member + '_age'];
                this.prepared_request['member_' + member + '_monthly_income'] = this.lm_request['member_' + member + '_monthly_income'];
                this.processed_request['___member_' + member + '_monthly_income___'] = this.lm_request['member_' + member + '_monthly_income'];
//                this.prepared_request['member_' + member + '_occupation'] = this.lm_request['member_' + member + '_occupation'];
//                this.processed_request['___member_' + member + '_occupation___'] = this.lm_request['member_' + member + '_occupation'];
                this.prepared_request['member_' + member + '_birth_date'] = this.lm_request['member_' + member + '_birth_date'];
                this.processed_request['___member_' + member + '_birth_date___'] = this.lm_request['member_' + member + '_birth_date'];
                this.prepared_request['member_' + member + '_MaritalStatusID'] = 1952;
                this.processed_request['___member_' + member + '_MaritalStatusID___'] = 1952;
                
                this.prepared_request['member_' + member + '_occupation'] = 55;//this.lm_request['member_' + member + '_occupation'];
                this.processed_request['___member_' + member + '_occupation___'] = 55;//this.lm_request['member_' + member + '_occupation'];
                
                
                this.prepared_request['member_' + member + '_AnnualIncome'] = this.prepared_request['member_1_AnnualIncome'];
                this.prepared_request['member_' + member + '_TotalCapitalSI']=this.prepared_request['member_1_TotalCapitalSI'];
                this.processed_request['___member_' + member + '_AnnualIncome___'] = this.prepared_request['member_' + member + '_AnnualIncome'];
                this.processed_request['___member_' + member + '_TotalCapitalSI___'] = this.prepared_request['member_' + member + '_TotalCapitalSI'];

                if(member ===3){
                    this.prepared_request['member_' + member + '_RelationshipWithProposerID'] = 1988;
                    
                    this.prepared_request['member_' + member + '_gender'] = 0;
                    
                }else{
                    this.prepared_request['member_' + member + '_RelationshipWithProposerID'] = 1989;
                    
                    this.prepared_request['member_' + member + '_gender'] = 1;
                    
                }
                this.processed_request['___member_' + member + '_RelationshipWithProposerID___']=this.prepared_request['member_' + member + '_RelationshipWithProposerID'];
                this.processed_request['___member_' + member + '_gender___']=this.prepared_request['member_' + member + '_gender'];
            
                
            }

            this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
            console.log(this.method_content);
        
    }else if (this.lm_request['method_type'] === 'Proposal') {
        
        console.log(' Proposal Health PA plan....' + this.method_content);

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;

        
        this.prepared_request['communication_city_code'] = this.lm_request['communication_city_code'];
        this.processed_request['___communication_city_code___'] = this.prepared_request['communication_city_code'];
        this.prepared_request['district_code'] = this.lm_request['communication_district_code'];
        this.processed_request['___district_code___'] = this.prepared_request['district_code'];
        this.prepared_request['state_code'] = this.lm_request['communication_state_code'];
        this.processed_request['___state_code___'] = this.prepared_request['state_code'];
        this.prepared_request['locality_code'] = this.lm_request['communication_locality_code'];
        this.processed_request['___locality_code___'] = this.prepared_request['locality_code'];                        
        this.prepared_request['pincode'] = this.lm_request['permanent_pincode'];
        this.processed_request['___pincode___'] = this.prepared_request['pincode']; 
        this.prepared_request['kyc_no'] = this.lm_request['kyc_no'];
        this.processed_request['___kyc_no___'] = this.prepared_request['kyc_no']; 
        this.prepared_request['gender'] = this.lm_request['gender'] === 'M'?0:1;
        this.processed_request['___gender___'] = this.prepared_request['gender'];
        this.prepared_request['salutation'] = this.lm_request['gender']=== "M" ? "Mr." : "Ms.";
        this.processed_request['___salutation___'] = this.prepared_request['salutation'];
        
        this.prepared_request['PrevYearPolicyNo'] = this.lm_request['policy_no'];
        this.processed_request['___PrevYearPolicyNo___'] = this.prepared_request['PrevYearPolicyNo']; 
        this.prepared_request['PrevInsuredName'] = this.lm_request['insurance_name'];
        this.processed_request['___PrevInsuredName___'] = this.prepared_request['PrevInsuredName'];
        
        
        this.prepared_request['nominee_birth_date'] = this.lm_request['nominee_birth_date']?this.lm_request['nominee_birth_date']:'28/04/2000';
        this.processed_request['___nominee_birth_date___'] = this.prepared_request['nominee_birth_date'];
//        this.prepared_request['nominee_relation'] = this.get_nominee_relation_id(this.lm_request['nominee_relation']);
        this.prepared_request['nominee_relation'] = this.lm_request['nominee_relation'];
        this.processed_request['___nominee_relation___'] = this.prepared_request['nominee_relation'];
        
        if(this.lm_request['pa_insurance_si'] && this.lm_request['pa_insurance_si'] > 0){
            this.prepared_request['pa_insurance_si'] = this.lm_request['pa_insurance_si'];
        } else {
            this.prepared_request['pa_insurance_si'] = 1000000;
        }
        this.processed_request['___pa_insurance_si___'] = this.prepared_request['pa_insurance_si'];
        

        if(["319", "321", "324","325"].indexOf(this.prepared_request['nominee_relation']) > -1){
            this.prepared_request['nominee_Salutation'] = "Mr.";
        }else if(["322", "323", "1255"].indexOf(this.prepared_request['nominee_relation']) > -1){
            this.prepared_request['nominee_Salutation'] = "Ms.";
        } if(this.prepared_request['nominee_relation'] === "320"){
            this.prepared_request['nominee_Salutation'] = this.lm_request['member_1_gender']=== "M" ? "Ms." : "Mr.";
        }
        this.processed_request['___nominee_Salutation___'] = this.prepared_request['nominee_Salutation'];    
        
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                console.log(txt_replace_with);
                let uName =this.lm_request['member_' + member + '_fullName'];
                let nameArr=uName.split(" ");
                this.prepared_request['member_' + member + '_first_name'] = nameArr[0].toUpperCase();
                this.processed_request['___member_' + member + '_first_name___'] = this.prepared_request['member_' + member + '_first_name'];
                this.prepared_request['member_' + member + '_last_name'] = nameArr.length >=2?nameArr[(nameArr.length)-1].toUpperCase():"";
                this.processed_request['___member_' + member + '_last_name___'] = this.prepared_request['member_' + member + '_last_name'];
                this.prepared_request['member_' + member + '_middle_name'] = (nameArr.slice(1, (nameArr.length)-1)).join(" ").toUpperCase();
                this.processed_request['___member_' + member + '_middle_name___'] = this.prepared_request['member_' + member + '_middle_name'];
                
                this.prepared_request['member_' + member + '_marital_status'] = this.lm_request['member_' + member + '_marital_status'];
                this.processed_request['___member_' + member + '_marital_status___'] = this.prepared_request['member_' + member + '_marital_status'];
                
                this.prepared_request['member_' + member + '_occupation'] = this.lm_request['member_' + member + '_occupation'];
                this.processed_request['___member_' + member + '_occupation___'] = this.prepared_request['member_' + member + '_occupation'];
                
                
                this.prepared_request['member_' + member + '_gender'] = this.lm_request['member_' + member + '_gender']=== "M" ? "0" : "1";
                this.processed_request['___member_' + member + '_gender___'] =  this.prepared_request['member_' + member + '_gender'];
                this.prepared_request['member_' + member + '_salutation'] = this.lm_request['member_' + member + '_gender']=== "M" ? "Mr." : "Ms.";
                this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['member_' + member + '_salutation'];
                
                this.prepared_request['member_' + member + '_age'] = this.lm_request['member_' + member + '_age'];
                this.processed_request['___member_' + member + '_age___'] = this.prepared_request['member_' + member + '_age'];

                this.prepared_request['member_' + member + '_birth_date'] = moment(this.lm_request['member_' + member + '_birth_date'],'YYYY-MM-DD').format('DD/MM/YYYY');
                this.processed_request['___member_' + member + '_birth_date___'] = this.prepared_request['member_' + member + '_birth_date'];
                this.prepared_request['member_' + member + '_MaritalStatusID'] = this.lm_request['member_' + member + '_marital_status'];
                this.processed_request['___member_' + member + '_MaritalStatusID___'] = this.prepared_request['member_' + member + '_MaritalStatusID'];
                
                
                let annualIncome=(this.lm_request['member_' + member + '_monthly_income']-0)*12;
//                this.prepared_request['member_' + member + '_AnnualIncome'] = annualIncome;
//                this.processed_request['___member_' + member + '_AnnualIncome___'] = this.prepared_request['member_' + member + '_AnnualIncome'];
                
                if(annualIncome >= 60000 || member===1){
                    this.prepared_request['member_' + member + '_AnnualIncome'] = annualIncome;
                    this.prepared_request['member_' + member + '_TotalCapitalSI']=calculateTotalCapitalSI(annualIncome);
                
                }else {
                    
                    this.prepared_request['member_' + member + '_AnnualIncome'] = this.prepared_request['member_1_AnnualIncome'];
                    this.prepared_request['member_' + member + '_TotalCapitalSI']=this.prepared_request['member_1_TotalCapitalSI'];
                
                }
                
                this.processed_request['___member_' + member + '_AnnualIncome___'] = this.prepared_request['member_' + member + '_AnnualIncome'];
                this.processed_request['___member_' + member + '_TotalCapitalSI___'] = this.prepared_request['member_' + member + '_TotalCapitalSI'];
                
                
                if(member ===1){
                    this.prepared_request['member_' + member + '_RelationshipWithProposerID'] = 345;
                    
//                    this.prepared_request['member_' + member + '_gender'] = 0;
                    
                }else{
                    this.prepared_request['member_' + member + '_RelationshipWithProposerID'] = 320;
                    
//                    this.prepared_request['member_' + member + '_gender'] = 1;
                    
                }
                this.processed_request['___member_' + member + '_RelationshipWithProposerID___']=this.prepared_request['member_' + member + '_RelationshipWithProposerID'];
//                this.processed_request['___member_' + member + '_gender___']=this.prepared_request['member_' + member + '_gender'];
            
            }
            for (member = 3; member <= this.lm_request['child_count']+2; member++) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                console.log(txt_replace_with);
                let uName =this.lm_request['member_' + member + '_fullName'];
                let nameArr=uName.split(" ");
                this.prepared_request['member_' + member + '_first_name'] = nameArr[0].toUpperCase();
                this.processed_request['___member_' + member + '_first_name___'] = nameArr[0];
                this.prepared_request['member_' + member + '_last_name'] = nameArr.length >=2?nameArr[(nameArr.length)-1]:"";
                this.processed_request['___member_' + member + '_last_name___'] = nameArr.length >=2?nameArr[(nameArr.length)-1]:"";
                this.prepared_request['member_' + member + '_middle_name'] = (nameArr.slice(1, (nameArr.length)-1)).join(" ");
                this.processed_request['___member_' + member + '_middle_name___'] = (nameArr.slice(1, (nameArr.length)-1)).join(" ");
                
                this.prepared_request['member_' + member + '_marital_status'] = this.lm_request['member_' + member + '_marital_status'];
                this.processed_request['___member_' + member + '_marital_status___'] = this.lm_request['member_' + member + '_marital_status'];
                
                this.prepared_request['member_' + member + '_occupation'] = 55;//this.lm_request['member_' + member + '_occupation'];
                this.processed_request['___member_' + member + '_occupation___'] = 55;//this.lm_request['member_' + member + '_occupation'];
                
                
                this.prepared_request['member_' + member + '_gender'] = this.lm_request['member_' + member + '_gender']=== "M" ? "0" : "1";
                this.processed_request['___member_' + member + '_gender___'] =  this.prepared_request['member_' + member + '_gender'];
                this.prepared_request['member_' + member + '_salutation'] = this.lm_request['member_' + member + '_gender']=== "M" ? "Mr." : "Ms.";
                this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['member_' + member + '_salutation'];
                
                this.prepared_request['member_' + member + '_age'] = this.lm_request['member_' + member + '_age'];
                this.processed_request['___member_' + member + '_age___'] = this.lm_request['member_' + member + '_age'];

                this.prepared_request['member_' + member + '_birth_date'] = this.lm_request['member_' + member + '_birth_date'];
                this.processed_request['___member_' + member + '_birth_date___'] = this.lm_request['member_' + member + '_birth_date'];
                this.prepared_request['member_' + member + '_MaritalStatusID'] = this.lm_request['member_' + member + '_marital_status'];
                this.processed_request['___member_' + member + '_MaritalStatusID___'] = this.lm_request['member_' + member + '_marital_status'];
                
                this.prepared_request['member_' + member + '_AnnualIncome'] = this.prepared_request['member_1_AnnualIncome'];
                this.prepared_request['member_' + member + '_TotalCapitalSI']=this.prepared_request['member_1_TotalCapitalSI'];
                this.processed_request['___member_' + member + '_AnnualIncome___'] = this.prepared_request['member_' + member + '_AnnualIncome'];
                this.processed_request['___member_' + member + '_TotalCapitalSI___'] = this.prepared_request['member_' + member + '_TotalCapitalSI'];


                if(this.prepared_request['member_' + member + '_gender']===0){
                    this.prepared_request['member_' + member + '_RelationshipWithProposerID'] = 1988;
                }else{
                    this.prepared_request['member_' + member + '_RelationshipWithProposerID'] = 1989;
                }
                this.processed_request['___member_' + member + '_RelationshipWithProposerID___']=this.prepared_request['member_' + member + '_RelationshipWithProposerID'];
//                this.processed_request['___member_' + member + '_gender___']=this.prepared_request['member_' + member + '_gender'];
            
        
            }
            this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
            this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
            console.log(this.method_content); 
        
        
    }

   
};
ReliancePA.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;

    var error_msg = 'NO_ERROR';
    var obj_response_handler;

    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Proposal') {
        obj_response_handler = this.proposal_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
ReliancePA.prototype.insurer_product_field_process_post = function () {
    console.log("start : insurer_product_field_process_post");
};
ReliancePA.prototype.insurer_product_api_post = function () {
    console.log("start : insurer_product_api_post");
    console.log(this.prepared_request);
    console.log(this.processed_request);
};
ReliancePA.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;//
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
//Example POST method invocation 
        var Client = require('node-rest-client').Client;

        var client = new Client();

// set content-type header and data as json in args parameter 
        var args = {
            data: docLog.Insurer_Request,
            headers: {"Content-Type": "application/xml"}
        };
        
        console.log(args.data);
            if (docLog['Method_Type'] === 'Premium' || docLog['Method_Type'] === 'Proposal')  {
            client.post(specific_insurer_object.method.Service_URL, args, function (data, response) {
                
                console.log(data);
                var objResponseFull = {
                    'err': null,
                    'result': data,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        }  

    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

ReliancePA.prototype.premium_response_handler = function (objResponseJson) {
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
        };
        var Error_Msg = 'NO_ERR';
        //check error start
        
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        var objPremiumService = objResponseJson;
        
        if (objResponseJson.hasOwnProperty('HealthDetails')) {
            var objPremiumService = objResponseJson['HealthDetails'];
            if (objPremiumService.hasOwnProperty('ErrorMessages')) {
                if (objPremiumService['ErrorMessages']['ErrMessages'] === '') {
                } else {
                    Error_Msg = objPremiumService['ErrorMessages']['ErrMessages'];
                }
            }
        } else {
            Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
        }
        
        if (Error_Msg === 'NO_ERR') {
            
            var premium_breakup = this.get_const_premium_breakup();
            var plan_id = objResponseJson['HealthDetails']['RiskDetails']['PlanID'];
            
            if (objPremiumService.hasOwnProperty('Premium')) {
                var premium=objPremiumService['Premium'];
                var base_premium=0;
                if(premium.hasOwnProperty('NetPremium')){
                    base_premium = (premium['BasicPremium'] - 0);
                    var premium_breakup = this.get_const_premium_breakup();
                    premium_breakup['service_tax'] = base_premium * 0.18;
                    premium_breakup['final_premium'] = Math.round(base_premium + premium_breakup['service_tax']);
                    premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                    premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                    premium_breakup['net_premium'] = (premium['NetPremium'] - 0);//base_premium;    //check
                    //premium_breakup['pa_insurance_si'] = objPremiumService['SumInsured']; //check
                    if(objResponseJson['HealthDetails']['RiskDetails']['SumInsured']){
                       premium_breakup['pa_insurance_si'] = (objResponseJson['HealthDetails']['RiskDetails']['SumInsured'] - 0); 
                    }else{
                        premium_breakup['pa_insurance_si'] = 0;
                    }
                }
                
                
                let benefit_key = ['Accidental_Death', 'Permanent_Total_Disability', 'Permanent_Partial_Disability', 'Unique_Benefit_1', 'Unique_Benefit_2', 'Unique_Benefit_3', 'Unique_Benefit_4'];
                let benefitObj = {};
                if(objPremiumService.hasOwnProperty('RiskDetails')){
                    let RiskDetails=objPremiumService['RiskDetails'];
                    benefit_key.forEach(key => {
                        benefitObj[key] = RiskDetails[key];
                    });
                }
                
                premium_breakup['benefits'] = benefitObj;  //undefine
                objServiceHandler.Premium_Breakup = premium_breakup;
            } else {
                Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        //objServiceHandler.Insurer_Transaction_Identifier = objPremiumService.hasOwnProperty('correlationId') ? objPremiumService['correlationId'] : null;
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
ReliancePA.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('HealthDetails')) {
            var objPremiumService = objResponseJson['HealthDetails'];
            if (objPremiumService.hasOwnProperty('Policy'))
            {
                if (objPremiumService['Policy'].hasOwnProperty('ProposalNo') && objPremiumService['Policy']['ProposalNo'] !== '') {
                } else {
                    Error_Msg = JSON.stringify(objResponseJson['HealthDetails']['ErrorMessages']['ErrMessages']);
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson['HealthDetails']['ErrorMessages']['ErrMessages']);
            }
        } else {
            Error_Msg = JSON.stringify(objPremiumService);
        }
//        
        if (Error_Msg === 'NO_ERR') {
            var proposalAmt = objResponseJson['HealthDetails']['Premium']['FinalPremium'];


            var plan_id = objResponseJson['HealthDetails']['RiskDetails']['PlanID'];
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], proposalAmt);
            if (objPremiumVerification.Status) {
                var pg_data = {
                    'ProposalNo': objResponseJson['HealthDetails']['Policy']['ProposalNo'],
                    'userID': this.prepared_request['insurer_integration_service_user'],
                    'ProposalAmount': objPremiumVerification.Proposal_Amt,
                    'PaymentType': '1',
                    'Responseurl': this.const_payment.pg_ack_url,
                    'CKYC': this.processed_request['___kyc_no___'],
                    'IsDocumentUpload': false,
                    'PanNo': this.processed_request['___pan___'],
                    'IsForm60': false
                };


                objServiceHandler.Payment.pg_url += jsonToQueryString(pg_data);
                console.log(objServiceHandler.Payment.pg_url);
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'GET';
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['HealthDetails']['Policy']['ProposalNo'];
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
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
ReliancePA.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        var Error_Msg = 'NO_ERR';

        if (this.const_policy.transaction_status === 'SUCCESS') {//transaction success

            var product_name = 'Personal_Accident';
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            this.const_policy.policy_url = pdf_web_path_portal;

            var http = require('https');
            if (this.proposal_processed_request['___dbmaster_pb_plan_id___'] === 111) {
                var insurer_pdf_url = this.prepared_request['insurer_integration_pdf_url'];
                insurer_pdf_url = insurer_pdf_url.replace('___policy_number___', this.const_policy.policy_number);
                insurer_pdf_url = insurer_pdf_url.replace('___product_id___', this.prepared_request['product_id']);
            } else {
                console.log(this);
                var insurer_pdf_url=(this.prepared_request.insurer_integration_pdf_url ? this.prepared_request.insurer_integration_pdf_url : "https://rgipartners.reliancegeneral.co.in/API/Service/GeneratePolicyschedule")+"?PolicyNo=" + this.const_policy.policy_number + "&ProductCode=2913";
                console.log(insurer_pdf_url);
//                var insurer_pdf_url = "https://rzonews.reliancegeneral.co.in:8443/api/HealthInfinityAPIService/GeneratePolicyschedule?policyNo=" + this.const_policy.policy_number;
            }
            try {
                var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                http.get(insurer_pdf_url, function (response) {
                    response.pipe(file_horizon);
                });
            } catch (ep) {
                console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
            }
        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
        return objServiceHandler;

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
};
ReliancePA.prototype.pg_response_handler = function () {
    try {

        //Success -> Output=1|9202272311012647|C531031700163|0|CCAvenue|R31031700154|Success|
        //Failure -> Output=0|| C514081505462|0|Billdesk|R311027381|Failure|authentication failed from bank
        //MismatchPremium -> Output=0|||1|CCavenue|R06041700079||Response Amount is not matching with the Premium to be paid.


        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get['Output'];
        var response = output.split('|');
        this.const_policy.transaction_status = '';
        this.const_policy.transaction_id = response[2];
        if (output.indexOf('Success') > -1 && response[1] !== '') {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['ProposalAmount'];
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = response[1];
            this.const_policy.pg_reference_number_1 = response[5];
        } else if (output.indexOf('Success') > -1 && response[1] === '') {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['ProposalAmount'];
            this.const_policy.transaction_status = 'PAYPASS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = response[1];
        } else if (output.indexOf('Failure') > -1) {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
};
ReliancePA.prototype.member_above21 = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('member_above21', 'start');
    var member_above21 = 0;
    for (var x in this.lm_request) {
        if (x.indexOf('_age_in_months') > -1 && x.indexOf('elder_member_age_in_months') === -1 && this.lm_request[x] >= 252) {
            member_above21++;
        }
    }
    console.log('member_above21', 'finish');
    return member_above21;
};
ReliancePA.prototype.member_below21 = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('member_below21', 'start');
    var member_below21 = 0;
    for (var x in this.lm_request) {
        if (x.indexOf('_age_in_months') > -1 && x.indexOf('elder_member_age_in_months') === -1 && this.lm_request[x] < 252) {
            member_below21++;
        }
    }
    console.log('member_below21', 'finish');
    return member_below21;
};
ReliancePA.prototype.get_member_salutation = function (i, sal) {
    console.log(this.constructor.name, 'get_member_salutaion', ' Start ReliancePA');
    var objno = {"1": "Mr.", "2": "Mrs.", "5": "Miss."};
    this.prepared_request['member_' + i + '_salutation'] = objno[sal];
    this.processed_request['___member_' + i + '_salutation___'] = this.prepared_request['member_' + i + '_salutation'];
    console.log(this.constructor.name, 'get_member_salutaion', ' Start ReliancePA');
};
ReliancePA.prototype.get_member_relation = function (i, plan_id) {
    console.log(this.constructor.name, 'get_member_relation', ' Start ReliancePA');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in ReliancePA " + gender);
    if (plan_id === 112) {
        if (this.prepared_request["relation"] === '1988' || this.prepared_request["relation"] === '1989') {
            return (gender === 'M' ? '319' : '1255');
        } else if (this.prepared_request["relation"] === '1987' || this.prepared_request["relation"] === '1986') {
            return(gender === 'M' ? '321' : '322');
        } else if (this.prepared_request["relation"] === '320') {
            if (i >= 3) {
                return(gender === 'M' ? '1988' : '1989');
            }
            return '320';
        } else if (this.prepared_request["relation"] === '345' || this.prepared_request["relation"] === '') {
            if (i >= 3) {
                return(gender === 'M' ? '1988' : '1989');
            } else if (i === 1) {
                return '345';
            } else if (i === 2) {
                return '320';
            }
        }
    } else {
        if (this.prepared_request["relation"] === '1988' || this.prepared_request["relation"] === '1989') {
            this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? '319' : '1255';
        } else if (this.prepared_request["relation"] === '1987' || this.prepared_request["relation"] === '1986') {
            this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? '321' : '322';
        } else if (this.prepared_request["relation"] === '320') {
            if (i >= 3) {
                this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? '321' : '322';
            }
            this.prepared_request['member_' + i + '_relation'] = '320';
        } else if (this.prepared_request["relation"] === '345' || this.prepared_request["relation"] === '') {
            if (i >= 3) {
                this.prepared_request['member_' + i + '_relation'] = gender === 'M' ? '321' : '322';
            } else if (i === 1) {
                this.prepared_request['member_' + i + '_relation'] = '345';
            } else if (i === 2) {
                this.prepared_request['member_' + i + '_relation'] = '320';
            }
        }
        this.processed_request['___member_' + i + '_relation___'] = this.prepared_request['member_' + i + '_relation'];
        var rel = this.processed_request['___member_' + i + '_relation___'];
        var objno = {"345": "Self", "320": "Spouse", "321": "Son", "322": "Daughter", "319": "Father", "1255": "Mother"};
        if (["345", "320", "321", "322", "319", "1255"].includes(rel)) {
            this.prepared_request['member_' + i + '_relation_name'] = objno[rel];
            this.processed_request['___member_' + i + '_relation_name___'] = this.prepared_request['member_' + i + '_relation_name'];
        }
    }
    console.log(this.constructor.name, 'get_member_relation', 'End ReliancePA');
};
ReliancePA.prototype.get_addon_details = function () {
//    if (this.lm_request['addon_cover'] === 'yes') {
//        this.prepared_request['chargable_addon_cover'] = true;
//        this.processed_request['___chargable_addon_cover___'] = this.prepared_request['chargable_addon_cover'];
//    } else {
//        this.prepared_request['chargable_addon_cover'] = false;
//        this.processed_request['___chargable_addon_cover___'] = this.prepared_request['chargable_addon_cover'];
//    }
//    if (this.lm_request['addon_time'] === 'yes') {
//        this.prepared_request['chargable_addon_time'] = true;
//        this.processed_request['___chargable_addon_time___'] = this.prepared_request['chargable_addon_time'];
//    } else {
//        this.prepared_request['chargable_addon_time'] = false;
//        this.processed_request['___chargable_addon_time___'] = this.prepared_request['chargable_addon_time'];
//    }
//    if (this.lm_request['addon_global'] === 'yes') {
//        this.prepared_request['chargable_addon_global'] = true;
//        this.processed_request['___chargable_addon_global___'] = this.prepared_request['chargable_addon_global'];
//    } else {
//        this.prepared_request['chargable_addon_global'] = false;
//        this.processed_request['___chargable_addon_global___'] = this.prepared_request['chargable_addon_global'];
//    }
//    if (this.lm_request['freeAddOnCover'] === "Time") {
//        this.prepared_request['free_addon_time'] = true;
//        this.processed_request['___free_addon_time___'] = this.prepared_request['free_addon_time'];
//    } else {
//        this.prepared_request['free_addon_time'] = false;
//        this.processed_request['___free_addon_time___'] = this.prepared_request['free_addon_time'];
//    }
//    if (this.lm_request['freeAddOnCover'] === "Global") {
//        this.prepared_request['free_addon_global'] = true;
//        this.processed_request['___free_addon_global___'] = this.prepared_request['free_addon_global'];
//    } else {
//        this.prepared_request['free_addon_global'] = false;
//        this.processed_request['___free_addon_global___'] = this.prepared_request['free_addon_global'];
//    }
//    if (this.lm_request['method_type'] === "Proposal") {
//        if (this.lm_request['freeAddOnCover'] === "Cover") {
//            this.prepared_request['free_addon_cover'] = true;
//            this.processed_request['___free_addon_cover___'] = this.prepared_request['free_addon_cover'];
//        } else {
//            this.prepared_request['free_addon_cover'] = false;
//            this.processed_request['___free_addon_cover___'] = this.prepared_request['free_addon_cover'];
//        }
//    }

};
ReliancePA.prototype.get_nominee_relation_id = function (id) {
//    var objno = {"320": "320", "1988": "321", "1989": "322", "1986": "319", "1987": "1255"};
    var objno = {"319":"319", "320": "320", "321": "321", "322": "322", "323": "323","324":"324","325":"325", "1255": "1255"};
    //this.processed_request['___nominee_relation___'] = objno[id];
    return objno[id];
};
ReliancePA.prototype.calculate_bmi = function (i) {
    var height = this.prepared_request['member_' + i + '_height'];
    var weight = this.prepared_request['member_' + i + '_weight'];

    var bmi = Math.round((weight / height / height) * 10000);
    this.prepared_request['member_' + i + '_bmi'] = bmi;
    this.processed_request['___member_' + i + '_bmi___'] = bmi;

};
ReliancePA.prototype.get_plan_id = function (selected_si) {
    console.log('plan_id', 'start');
//    var plans = [
//        {'sum_ins': 300000, 'plan_id': 1},
//        {'sum_ins': 600000, 'plan_id': 1},
//        {'sum_ins': 900000, 'plan_id': 1},
//        {'sum_ins': 1200000, 'plan_id': 2},
//        {'sum_ins': 1500000, 'plan_id': 2},
//        {'sum_ins': 1800000, 'plan_id': 2}
//    ];
//    var index = plans.findIndex(x => x.sum_ins === selected_si - 0);
//    if (index === -1) {
//        return "";
//    }
//    return plans[index]['plan_id'];
    console.log('plan_id', 'end');
};
ReliancePA.prototype.is_valid_plan = function (lm_request, planCode) {
    if (lm_request['member_count'] > 4) {
        return false;
    } 
    
    return true;
};
ReliancePA.prototype.premium_breakup_schema = {
//    "addon": {
//        "addon_cover": 0,
//        "addon_time": 0,
//        "addon_global": 0,
//        "addon_final_premium": 0
//    },
//    "net_premium": "NetPremium",
//    "tax": {
//        "CGST": "CGST",
//        "SGST": "SGST",
//        "IGST": 0,
//        "UTGST": 0
//    },
//    "service_tax": 0,
//    "final_premium": "FinalPremium",
//    "discount": 0
};
function jsonToQueryString(json) {
    return  "?" + Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
    }).join('&');
}

function calculateTotalCapitalSI(annualIncome){
    let TotalCapitalSI={'2744':0,'1982':500000,'1983':1000000,'1984':2000000};
    
    let annualIncomeId='';
    if(annualIncome < 60000){
        annualIncomeId='2744';
    } else if(annualIncome >= 60000 && annualIncome < 120000){
        annualIncomeId='1982';
    } else if(annualIncome >= 120000 && annualIncome < 240000){
        annualIncomeId='1983';
    } else if(annualIncome >= 240000){
        annualIncomeId='1984';
    }
    return TotalCapitalSI[annualIncomeId];
    
}

module.exports = ReliancePA;