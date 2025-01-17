/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var config = require('config');
var moment = require('moment');
var sleep = require('system-sleep');
var fs = require('fs');
var pdf = require('html-pdf');
var appRoot = path.dirname(path.dirname(require.main.filename));
var User_Data = require('../models/user_data');
var excel = require('excel4node');
//var win32ole = require('win32ole');
//var ExcelJS = require('exceljs');

module.exports.controller = function (app) {
    app.get('/create_edelweiss_feedfile', function (req, res) {
        var UDID = (req.params['UDID']);
        try {
            var User_Data = require(appRoot + '/models/user_data');
            var start_date = new Date();
            var days = (req.query.hasOwnProperty('days')) ? req.query.days - 0 : 1;
            start_date.setDate(start_date.getDate() - days);
            start_date.setHours(00, 00, 00, 000);
            var end_date = new Date();
            end_date.setDate(end_date.getDate() + 0);
            end_date.setHours(00, 00, 00, 000);
            var Last_Status = 'TRANS_SUCCESS';
            var queryList = {Insurer_Id: 46, Last_Status: new RegExp(Last_Status, 'i'), Product_Id: 1, Modified_On: {$gte: start_date, $lt: end_date}, "Transaction_Data": {$exists: true}};
            if (req.query.hasOwnProperty('policy') && req.query.policy !== "") {
                queryList['Transaction_Data.policy_number'] = {"$in": req.query.policy.split(',')};
            }
            User_Data.find(queryList, {_id: 0}, function (err, emp_data) {
                try {
                    if (err)
                        throw err;
                    //res.json(emp_data);
                    var excel = require('excel4node');
                    var date = moment().subtract(1, "days").format('DD-MM-YYYY');
                    if (req.query.hasOwnProperty('name') && req.query.name !== "") {
                        date = req.query.name;
                    }
                    //START Feed File Code=========================================================================================
                    var ff_file_name = "EdelweissMotor_FeedFile_" + date + ".xlsx";
                    var ff_loc_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                    var ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                    var User_Data = require(appRoot + '/models/user_data');
                    var workbook = new excel.Workbook();
                    var worksheet = workbook.addWorksheet('Sheet 1');
                    var style = workbook.createStyle({
                        font: {
                            color: '#FF0800',
                            size: 12
                        },
                        numberFormat: '$#,##0.00; ($#,##0.00); -'
                    });
                    var styleh = workbook.createStyle({
                        font: {
                            bold: true,
                            size: 12
                        }
                    });
                    if (parseInt(emp_data.length) > 0) {
                        //row 1
                        worksheet.cell(1, 1).string('Policy Issue Date').style(styleh);
                        worksheet.cell(1, 2).string('Policy Number').style(styleh);
                        worksheet.cell(1, 3).string('Proposal Number').style(styleh);
                        worksheet.cell(1, 4).string('Branch').style(styleh);
                        worksheet.cell(1, 5).string('Agent Code').style(styleh);
                        worksheet.cell(1, 6).string('Agent Name').style(styleh);
                        worksheet.cell(1, 7).string('Agent Email').style(styleh);
                        worksheet.cell(1, 8).string('Agent Contact Number').style(styleh);
                        worksheet.cell(1, 9).string('Sale Manager Code').style(styleh);
                        worksheet.cell(1, 10).string('Sale Manager Name').style(styleh);
                        worksheet.cell(1, 11).string('Type of Business').style(styleh);
                        worksheet.cell(1, 12).string('Policy Type').style(styleh);
                        worksheet.cell(1, 13).string('TP Policy Number').style(styleh);
                        worksheet.cell(1, 14).string('TP Insurance Company Name').style(styleh);
                        worksheet.cell(1, 15).string('Policy Start Date (DD/MM/YYYY)').style(styleh);
                        worksheet.cell(1, 16).string('Policy Start Time').style(styleh);
                        worksheet.cell(1, 17).string('Policy End Date (DD/MM/YYYY)').style(styleh);
                        worksheet.cell(1, 18).string('Policy End Time').style(styleh);
                        worksheet.cell(1, 19).string('OwnDamage Policy Period').style(styleh);
                        worksheet.cell(1, 20).string('TP Policy Period').style(styleh);
                        worksheet.cell(1, 21).string('Add-On Policy Period').style(styleh);
                        worksheet.cell(1, 22).string('Main Applicant (Proposer) Type').style(styleh);
                        worksheet.cell(1, 23).string('Kind of Policy').style(styleh);
                        worksheet.cell(1, 24).string('Previous Insurance Policy?').style(styleh);
                        worksheet.cell(1, 25).string('Previous Insurance Company Name').style(styleh);
                        worksheet.cell(1, 26).string('Previous Insurance Company Address').style(styleh);
                        worksheet.cell(1, 27).string('Previous Policy Start Date').style(styleh);
                        worksheet.cell(1, 28).string('Previous Policy End Date').style(styleh);
                        worksheet.cell(1, 29).string('Previous Policy No').style(styleh);
                        worksheet.cell(1, 30).string('Claims in Prev Policy').style(styleh);
                        worksheet.cell(1, 31).string('Nature of Loss').style(styleh);
                        worksheet.cell(1, 32).string('Make').style(styleh);
                        worksheet.cell(1, 33).string('Model').style(styleh);
                        worksheet.cell(1, 34).string('Variant').style(styleh);
                        worksheet.cell(1, 35).string('Cubic Capacity').style(styleh);
                        worksheet.cell(1, 36).string('Licenced Seating Capacity').style(styleh);
                        worksheet.cell(1, 37).string('Fuel Type').style(styleh);
                        worksheet.cell(1, 38).string('New Or Used?').style(styleh);
                        worksheet.cell(1, 39).string('Year of Manufacture').style(styleh);
                        worksheet.cell(1, 40).string('Registration Date').style(styleh);
                        worksheet.cell(1, 41).string('Vehicle Age').style(styleh);
                        worksheet.cell(1, 42).string('Engine Number').style(styleh);
                        worksheet.cell(1, 43).string('Chassis Number').style(styleh);
                        worksheet.cell(1, 44).string('Fibre Glass Fuel Tank').style(styleh);
                        worksheet.cell(1, 45).string('Bodystyle Description').style(styleh);
                        worksheet.cell(1, 46).string('Body Type').style(styleh);
                        worksheet.cell(1, 47).string('Transmission Type').style(styleh);
                        worksheet.cell(1, 48).string('Handicapped').style(styleh);
                        worksheet.cell(1, 49).string('Certified Vintage Car').style(styleh);
                        worksheet.cell(1, 50).string('Anti-theft Device Installed').style(styleh);
                        worksheet.cell(1, 51).string('Automobile Association Member?').style(styleh);
                        worksheet.cell(1, 52).string('State Code Required').style(styleh);
                        worksheet.cell(1, 53).string('District Code').style(styleh);
                        worksheet.cell(1, 54).string('Vehicle Series Number').style(styleh);
                        worksheet.cell(1, 55).string('Registration Number').style(styleh);
                        worksheet.cell(1, 56).string('Vehicle Registration Number Required').style(styleh);
                        worksheet.cell(1, 57).string('RTO State').style(styleh);
                        worksheet.cell(1, 58).string('RTO City / District').style(styleh);
                        worksheet.cell(1, 59).string('Cluster Zone').style(styleh);
                        worksheet.cell(1, 60).string('Transfer of NCB').style(styleh);
                        worksheet.cell(1, 61).string('Transfer of NCB%').style(styleh);
                        worksheet.cell(1, 62).string('Proof document date').style(styleh);
                        worksheet.cell(1, 63).string('Proof Provided for NCB').style(styleh);
                        worksheet.cell(1, 64).string('Applicable NCB').style(styleh);
                        worksheet.cell(1, 65).string('Own Damage Basic').style(styleh);
                        worksheet.cell(1, 66).string('Voluntry Deductible').style(styleh);
                        worksheet.cell(1, 67).string('Voluntry Discount').style(styleh);
                        worksheet.cell(1, 68).string('Exshowroom Price').style(styleh);
                        worksheet.cell(1, 69).string('IDV Value').style(styleh);
                        worksheet.cell(1, 70).string('Original IDV Value').style(styleh);
                        worksheet.cell(1, 71).string('Non Electrical Accessories').style(styleh);
                        worksheet.cell(1, 72).string('Accessory Description').style(styleh);
                        worksheet.cell(1, 73).string('Value of Accessory').style(styleh);
                        worksheet.cell(1, 74).string('Electrical / Electronic Accessories').style(styleh);
                        worksheet.cell(1, 75).string('Accessory Description').style(styleh);
                        worksheet.cell(1, 76).string('Value of Accessory').style(styleh);
                        worksheet.cell(1, 77).string('CNG /LPG Gas Kit').style(styleh);
                        worksheet.cell(1, 78).string('Accessory Description').style(styleh);
                        worksheet.cell(1, 79).string('Value of Kit').style(styleh);
                        worksheet.cell(1, 80).string('Internal CNG /LPG Gas Kit').style(styleh);
                        worksheet.cell(1, 81).string('Basic Third Party Liability').style(styleh);
                        worksheet.cell(1, 82).string('Third Party Property Damage Limit').style(styleh);
                        worksheet.cell(1, 83).string('Trailer TP SI').style(styleh);
                        worksheet.cell(1, 84).string('Geographical Area Extension of Liability').style(styleh);
                        worksheet.cell(1, 85).string('Legal Liability Employees').style(styleh);
                        worksheet.cell(1, 86).string('No of Employees').style(styleh);
                        worksheet.cell(1, 87).string('Legal Liability Paid Drivers').style(styleh);
                        worksheet.cell(1, 88).string('Number of Paid Drivers').style(styleh);
                        worksheet.cell(1, 89).string('PA Owner Driver').style(styleh);
                        worksheet.cell(1, 90).string('Sum Insured').style(styleh);
                        worksheet.cell(1, 91).string('PA for Unnamed Passenger').style(styleh);
                        worksheet.cell(1, 92).string('Sum Insured Per Person').style(styleh);
                        worksheet.cell(1, 93).string('Total Sum Insured').style(styleh);
                        worksheet.cell(1, 94).string('CNG LPG Kit Liability').style(styleh);
                        worksheet.cell(1, 95).string('Invoice Value Protect').style(styleh);
                        worksheet.cell(1, 96).string('Key and Locks Protect').style(styleh);
                        worksheet.cell(1, 97).string('NCB Protect').style(styleh);
                        worksheet.cell(1, 98).string('Depreciation Protect').style(styleh);
                        worksheet.cell(1, 99).string('Engine Protect').style(styleh);
                        worksheet.cell(1, 100).string('Consumable Expenses Protect').style(styleh);
                        worksheet.cell(1, 101).string('Mandatory Deduction Protect').style(styleh);
                        worksheet.cell(1, 102).string('Road Side Assistance').style(styleh);
                        worksheet.cell(1, 103).string('Personal Belongings Protect').style(styleh);
                        worksheet.cell(1, 104).string('Personal Accident Protect').style(styleh);
                        worksheet.cell(1, 105).string('Required Discount/Loading (%)').style(styleh);
                        worksheet.cell(1, 106).string('Allowable Discount/Loading').style(styleh);
                        worksheet.cell(1, 107).string('Finance Type').style(styleh);
                        worksheet.cell(1, 108).string('Financier Name').style(styleh);
                        worksheet.cell(1, 109).string('Branch Name and Address').style(styleh);
                        worksheet.cell(1, 110).string('IDV Value').style(styleh);
                        worksheet.cell(1, 111).string('Policy Start Date Lease').style(styleh);
                        worksheet.cell(1, 112).string('Comment to U/W').style(styleh);
                        worksheet.cell(1, 113).string('Main Applicant (Proposer) Type').style(styleh);
                        worksheet.cell(1, 114).string('Salutation').style(styleh);
                        worksheet.cell(1, 115).string('First Name').style(styleh);
                        worksheet.cell(1, 116).string('Middle Name').style(styleh);
                        worksheet.cell(1, 117).string('Last Name').style(styleh);
                        worksheet.cell(1, 118).string('Gender').style(styleh);
                        worksheet.cell(1, 119).string('Marital Status').style(styleh);
                        worksheet.cell(1, 120).string('Date of Birth').style(styleh);
                        worksheet.cell(1, 121).string('Nationality').style(styleh);
                        worksheet.cell(1, 122).string('Current Address line 1').style(styleh);
                        worksheet.cell(1, 123).string('Current Address line 2').style(styleh);
                        worksheet.cell(1, 124).string('Current Address line 3').style(styleh);
                        worksheet.cell(1, 125).string('Current Country').style(styleh);
                        worksheet.cell(1, 126).string('Pincode').style(styleh);
                        worksheet.cell(1, 127).string('Current City').style(styleh);
                        worksheet.cell(1, 128).string('Current State').style(styleh);
                        worksheet.cell(1, 129).string('PAN').style(styleh);
                        worksheet.cell(1, 130).string('GST').style(styleh);
                        worksheet.cell(1, 131).string('Aadhaar No').style(styleh);
                        worksheet.cell(1, 132).string('Mobile Number').style(styleh);
                        worksheet.cell(1, 133).string('Email Id').style(styleh);
                        worksheet.cell(1, 134).string('Occupation').style(styleh);
                        worksheet.cell(1, 135).string('Nominee Name').style(styleh);
                        worksheet.cell(1, 136).string('Relationship with Applicant').style(styleh);
                        worksheet.cell(1, 137).string('Other').style(styleh);
                        worksheet.cell(1, 138).string('Date of Birth').style(styleh);
                        worksheet.cell(1, 139).string('Is Nominee Minor?').style(styleh);
                        worksheet.cell(1, 140).string('Guardian Name').style(styleh);
                        worksheet.cell(1, 141).string('Inspection Number').style(styleh);
                        worksheet.cell(1, 142).string('PUC Number').style(styleh);
                        worksheet.cell(1, 143).string('PUC Expiry Date').style(styleh);
                        worksheet.cell(1, 144).string('Is Registration Address Same').style(styleh);
                        worksheet.cell(1, 145).string('Registration Address line 1').style(styleh);
                        worksheet.cell(1, 146).string('Reg_ Address line 2').style(styleh);
                        worksheet.cell(1, 147).string('Reg_ Address line 3').style(styleh);
                        worksheet.cell(1, 148).string('Reg_ Country').style(styleh);
                        worksheet.cell(1, 149).string('Reg_Pincode').style(styleh);
                        worksheet.cell(1, 150).string('Reg_City').style(styleh);
                        worksheet.cell(1, 151).string('Reg_State').style(styleh);
                        worksheet.cell(1, 152).string('State Code').style(styleh);
                        worksheet.cell(1, 153).string('Own Damage Basic').style(styleh);
                        worksheet.cell(1, 154).string('Non Electrical Accessories').style(styleh);
                        worksheet.cell(1, 155).string('Electrical / Electronic Accessories').style(styleh);
                        worksheet.cell(1, 156).string('CNG /LPG Gas Kit').style(styleh);
                        worksheet.cell(1, 157).string('No Claim Bonus Discount Amount').style(styleh); //Add
                        worksheet.cell(1, 158).string('Total').style(styleh);
                        worksheet.cell(1, 159).string('Basic Third Party Liability').style(styleh);
                        worksheet.cell(1, 160).string('Legal Liability Employees').style(styleh);
                        worksheet.cell(1, 161).string('Legal Liability Paid Drivers').style(styleh);
                        worksheet.cell(1, 162).string('PA Owner Driver').style(styleh);
                        worksheet.cell(1, 163).string('PA for Unnamed Passenger').style(styleh);
                        worksheet.cell(1, 164).string('CNG LPG Kit Liability').style(styleh);
                        worksheet.cell(1, 165).string('Total').style(styleh);
                        worksheet.cell(1, 166).string('Invoice Value Protect').style(styleh);
                        worksheet.cell(1, 167).string('Key and Locks Protect').style(styleh);
                        worksheet.cell(1, 168).string('NCB Protect').style(styleh);
                        worksheet.cell(1, 169).string('Depreciation Protect').style(styleh);
                        worksheet.cell(1, 170).string('Engine Protect').style(styleh);
                        worksheet.cell(1, 171).string('Consumable Expenses Protect').style(styleh);
                        worksheet.cell(1, 172).string('Mandatory Deduction Protect').style(styleh);
                        worksheet.cell(1, 173).string('Road Side Assistance').style(styleh);
                        worksheet.cell(1, 174).string('Personal Belongings Protect').style(styleh);
                        worksheet.cell(1, 175).string('Personal Accident Protect').style(styleh);
                        worksheet.cell(1, 176).string('Total').style(styleh);
                        worksheet.cell(1, 177).string('Net Premium').style(styleh);
                        worksheet.cell(1, 178).string('SGST').style(styleh); //Add
                        worksheet.cell(1, 179).string('CGST').style(styleh); //Add
                        worksheet.cell(1, 180).string('IGST').style(styleh);
                        worksheet.cell(1, 181).string('Final Premium').style(styleh);
                        worksheet.cell(1, 182).string('Receipt_Number').style(styleh);
                        worksheet.cell(1, 183).string('NEFT').style(styleh);
                        worksheet.cell(1, 184).string('NEFT From').style(styleh);
                        worksheet.cell(1, 185).string('Bank Name').style(styleh);
                        worksheet.cell(1, 186).string('Instrument No.').style(styleh);
                        worksheet.cell(1, 187).string('Account No.').style(styleh);
                        worksheet.cell(1, 188).string('Account Holder').style(styleh);
                        worksheet.cell(1, 189).string('Instrument Date').style(styleh);
                        worksheet.cell(1, 190).string('Amount').style(styleh);
                        worksheet.cell(1, 191).string('Sub Intermediary Category').style(styleh);
                        worksheet.cell(1, 192).string('Sub Intermediary Code').style(styleh);
                        worksheet.cell(1, 193).string('Sub Intermediary Name').style(styleh);
                        worksheet.cell(1, 194).string('Sub Intermediary Phone Email').style(styleh);
                        worksheet.cell(1, 195).string('POSP PAN Aadhar No').style(styleh);
                        worksheet.cell(1, 196).string('Previous Policy TP Tenure').style(styleh);//Active TP Policy Period for SAOD
                        worksheet.cell(1, 197).string('TP Policy Start Date').style(styleh);
                        worksheet.cell(1, 198).string('TP Policy End Date').style(styleh);
                        //row 2

                        for (var rowcount in emp_data) {
                            try {
                                var dbUserData = [];
                                dbUserData = emp_data[rowcount]._doc;
                                var Processed_Request = dbUserData.Processed_Request;
                                if (dbUserData.Transaction_Data.edelweiss_data) {
                                    Processed_Request = JSON.parse(dbUserData.Transaction_Data.edelweiss_data);
                                }
                                var Erp_Qt_Request_Core = dbUserData.Erp_Qt_Request_Core;
                                console.log(dbUserData.Erp_Qt_Request_Core['___crn___']);
                                let payment_bank_name = "";
                                if ((dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay") || dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") {
                                    if (dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") {
                                        payment_bank_name = "Razor Pay Wallet";
                                    } else {
                                        payment_bank_name = "Razor Pay";
                                    }
                                } else {
                                    payment_bank_name = "PAYU";
                                }
                                var mdp_prm = (dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___']) - ((Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_invoice_price_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_consumable_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_consumable_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_personal_belonging_loss_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_personal_belonging_loss_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_key_lock_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_key_lock_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_road_assist_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_road_assist_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_ncb_protection_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_ncb_protection_cover___'] : 0));
                                dbUserData.Erp_Qt_Request_Core['___addon_mandatory_deduction_protect_cover___'] = mdp_prm > 0 ? "yes" : "no";
                                dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_mandatory_deduction_protect___'] = mdp_prm;
                                var policy_number = dbUserData.Transaction_Data.policy_number.toString();
                                rowcount = parseInt(rowcount);
                                worksheet.cell(rowcount + 2, 1).string(moment(dbUserData.Transaction_Data.pg_reference_number_1).format('DD/MM/YYYY').toString());//moment(dbUserData.Erp_Qt_Request_Core['___policy_start_date___']).format("DD/MM/YYYY")
                                worksheet.cell(rowcount + 2, 2).string(dbUserData.Transaction_Data.policy_number); //Incorrect Policy Number
                                worksheet.cell(rowcount + 2, 3).string(dbUserData.Erp_Qt_Request_Core['___crn___']);
                                worksheet.cell(rowcount + 2, 4).string('Mumbai HO');
                                worksheet.cell(rowcount + 2, 5).string('2210001201');
                                worksheet.cell(rowcount + 2, 6).string('Landmark Insurance Brokers Pvt Ltd');
                                worksheet.cell(rowcount + 2, 7).string('customercare@policyboss.com');
                                worksheet.cell(rowcount + 2, 8).string('1800-419-4199');
                                worksheet.cell(rowcount + 2, 9).string('25159');
                                worksheet.cell(rowcount + 2, 10).string('Abirami Iyer');
                                worksheet.cell(rowcount + 2, 11).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" ? "Rollover" : "New"); //Rollover/ NEW
                                worksheet.cell(rowcount + 2, 12).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP" ? "Package" : (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "Standalone Own Damage(Addon-Optional)" : "Liability Only")); //Package/ Liability/ Standalone Own Damage(Addon-Optional)
                                worksheet.cell(rowcount + 2, 13).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? dbUserData.Erp_Qt_Request_Core['___tp_policy_number___'] : '');
                                worksheet.cell(rowcount + 2, 14).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? dbUserData.Master_Details.tp_insurer['Insurer_Name'] : "");
                                worksheet.cell(rowcount + 2, 15).string(moment(dbUserData.Erp_Qt_Request_Core['___policy_start_date___']).format("DD/MM/YYYY"));
                                worksheet.cell(rowcount + 2, 16).string('00:00 AM');
                                worksheet.cell(rowcount + 2, 17).string(moment(dbUserData.Erp_Qt_Request_Core['___policy_end_date___']).format("DD/MM/YYYY"));
                                worksheet.cell(rowcount + 2, 18).string('11:59 PM');
                                worksheet.cell(rowcount + 2, 19).string(dbUserData.Erp_Qt_Request_Core['___policy_od_tenure___']);
                                worksheet.cell(rowcount + 2, 20).string(dbUserData.Erp_Qt_Request_Core['___policy_tp_tenure___']);
                                worksheet.cell(rowcount + 2, 21).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___'] > 0 ? '1' : '0');
                                worksheet.cell(rowcount + 2, 22).string(dbUserData.Erp_Qt_Request_Core['___vehicle_registration_type___'] === "individual" ? "Person" : "Organisation"); //Person/Organisation
                                worksheet.cell(rowcount + 2, 23).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP" ? "Package" : (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "Standalone OD" : "Liability Only")); //Package/ Liability/ Standalone OD
                                worksheet.cell(rowcount + 2, 24).string(dbUserData.Erp_Qt_Request_Core['___is_policy_exist___']);
                                worksheet.cell(rowcount + 2, 25).string((dbUserData.Master_Details.prev_insurer) ? (dbUserData.Master_Details.prev_insurer['Insurer_Name']) : "");
                                worksheet.cell(rowcount + 2, 26).string('Mumbai'); //Previous Insurance Company Address
                                worksheet.cell(rowcount + 2, 27).string(moment(dbUserData.Premium_List.Summary.Request_Product['pre_policy_start_date']).format("DD/MM/YYYY")); //Previous Policy Start Date
                                worksheet.cell(rowcount + 2, 28).string(moment(dbUserData.Erp_Qt_Request_Core['___policy_expiry_date___']).format("DD/MM/YYYY"));
                                worksheet.cell(rowcount + 2, 29).string(dbUserData.Erp_Qt_Request_Core['___previous_policy_number___']);
                                worksheet.cell(rowcount + 2, 30).string(dbUserData.Erp_Qt_Request_Core['___is_claim_exists___']);
                                worksheet.cell(rowcount + 2, 31).string(''); // Optional Nature of Loss Keep it Blank
                                worksheet.cell(rowcount + 2, 32).string(Processed_Request['___dbmaster_insurer_vehicle_make_name___']);
                                worksheet.cell(rowcount + 2, 33).string(Processed_Request['___dbmaster_insurer_vehicle_model_name___']);
                                worksheet.cell(rowcount + 2, 34).string(Processed_Request['___dbmaster_insurer_vehicle_variant_name___']);
                                worksheet.cell(rowcount + 2, 35).string(Processed_Request['___dbmaster_insurer_vehicle_cubiccapacity___']);
                                worksheet.cell(rowcount + 2, 36).string(Processed_Request['___dbmaster_insurer_vehicle_seatingcapacity___']);
                                worksheet.cell(rowcount + 2, 37).string(Processed_Request['___dbmaster_insurer_vehicle_fueltype___']);
                                worksheet.cell(rowcount + 2, 38).string('Used'); //New Or Used?
                                worksheet.cell(rowcount + 2, 39).string(dbUserData.Erp_Qt_Request_Core['___vehicle_manf_year___']);
                                worksheet.cell(rowcount + 2, 40).string(moment(dbUserData.Erp_Qt_Request_Core['___vehicle_registration_date___']).format("DD/MM/YYYY"));
                                worksheet.cell(rowcount + 2, 41).string(dbUserData.Premium_List.Summary.Request_Product['vehicle_age_year'].toString()); //As per the vehicle Age
                                worksheet.cell(rowcount + 2, 42).string(dbUserData.Erp_Qt_Request_Core['___engine_number___']);
                                worksheet.cell(rowcount + 2, 43).string(dbUserData.Erp_Qt_Request_Core['___chassis_number___']);
                                worksheet.cell(rowcount + 2, 44).string('');
                                worksheet.cell(rowcount + 2, 45).string('');
                                worksheet.cell(rowcount + 2, 46).string('');
                                worksheet.cell(rowcount + 2, 47).string('Gear');
                                worksheet.cell(rowcount + 2, 48).string('');
                                worksheet.cell(rowcount + 2, 49).string('');
                                worksheet.cell(rowcount + 2, 50).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_anti_theft___'] > 0 ? "Yes" : "No"); //dbUserData.Erp_Qt_Request_Core['___is_antitheft_fit___']
                                worksheet.cell(rowcount + 2, 51).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_aai___'] > 0 ? "Yes" : "No"); //dbUserData.Erp_Qt_Request_Core['___is_aai_member___']
                                worksheet.cell(rowcount + 2, 52).string(dbUserData.Erp_Qt_Request_Core['___registration_no_1___']);
                                worksheet.cell(rowcount + 2, 53).string(dbUserData.Erp_Qt_Request_Core['___registration_no_2___']);
                                worksheet.cell(rowcount + 2, 54).string(dbUserData.Erp_Qt_Request_Core['___registration_no_3___']);
                                worksheet.cell(rowcount + 2, 55).string(dbUserData.Erp_Qt_Request_Core['___registration_no_4___']);
                                worksheet.cell(rowcount + 2, 56).string(dbUserData.Erp_Qt_Request_Core['___registration_no___']);
                                worksheet.cell(rowcount + 2, 57).string(dbUserData.Erp_Qt_Request_Core['___permanent_state___']);
                                worksheet.cell(rowcount + 2, 58).string(Processed_Request['___dbmaster_insurer_rto_city_name___'].toString()); //dbUserData.Erp_Qt_Request_Core['___pb_rto_city___']
                                worksheet.cell(rowcount + 2, 59).string(Processed_Request['___dbmaster_insurer_rto_zone_code___'].toString()); //dbUserData.Erp_Qt_Request_Core['___pb_vehicletariff_zone___']
                                worksheet.cell(rowcount + 2, 60).string(dbUserData.Erp_Qt_Request_Core['___is_claim_exists___'] === "yes" ? "NO" : "Yes"); //Transfer of NCB Yes/ NO
                                worksheet.cell(rowcount + 2, 61).string(dbUserData.Erp_Qt_Request_Core['___vehicle_ncb_current___'] + '%'); //Transfer of NCB If yes, then previous yr NCB in %
                                worksheet.cell(rowcount + 2, 62).string(moment(dbUserData.Erp_Qt_Request_Core['___policy_expiry_date___']).format("DD/MM/YYYY")); //Previous policy end date
                                worksheet.cell(rowcount + 2, 63).string('NCB declaration'); //NCB declaration (hard coded)
                                worksheet.cell(rowcount + 2, 64).string(dbUserData.Premium_List.Summary.Request_Product['vehicle_ncb_next'] + '%'); //Current year NCB
                                worksheet.cell(rowcount + 2, 65).string(''); //Keep it blank
                                worksheet.cell(rowcount + 2, 66).string("0");
                                worksheet.cell(rowcount + 2, 67).string("0");
                                worksheet.cell(rowcount + 2, 68).string(Processed_Request['___dbmaster_insurer_vehicle_exshowroom___'].toString()); //Exshowroom Price
                                worksheet.cell(rowcount + 2, 69).string(dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString()); //IDV Value
                                worksheet.cell(rowcount + 2, 70).string(Processed_Request['___vehicle_normal_idv___'].toString()); //Original IDV Value;
                                worksheet.cell(rowcount + 2, 71).string(dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "NO" : "Yes"); //Yes or NO
                                worksheet.cell(rowcount + 2, 72).string('Non electrical accessories'); //Non electrical accessories (Hard coded)
                                worksheet.cell(rowcount + 2, 73).string(dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString());
                                worksheet.cell(rowcount + 2, 74).string(dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "NO" : "Yes"); //Yes or NO
                                worksheet.cell(rowcount + 2, 75).string('electrical accessories'); //electrical accessories (Hard coded)
                                worksheet.cell(rowcount + 2, 76).string(dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString());
                                worksheet.cell(rowcount + 2, 77).string(dbUserData.Erp_Qt_Request_Core['___is_external_bifuel___'].toString()); //Yes or NO
                                worksheet.cell(rowcount + 2, 78).string(dbUserData.Erp_Qt_Request_Core['___external_bifuel_type___'] ? dbUserData.Erp_Qt_Request_Core['___external_bifuel_type___'].toString() : ""); //CNG/ LPG
                                worksheet.cell(rowcount + 2, 79).string(dbUserData.Erp_Qt_Request_Core['___external_bifuel_value___'].toString());
                                worksheet.cell(rowcount + 2, 80).string(["LPG", "CNG"].indexOf(Processed_Request['___dbmaster_insurer_vehicle_fueltype___']) > -1 ? "Yes" : "NO"); //Internal CNG /LPG Gas Kit  //Yes or NO
                                worksheet.cell(rowcount + 2, 81).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "0" : "750000"); //LIMIT needs to be mentioned //Basic Third Party Liability Limit
                                worksheet.cell(rowcount + 2, 82).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "0" : (dbUserData.Erp_Qt_Request_Core['___is_tppd___'] === "no" ? "0" : "750000")); //LIMIT needs to be mentioned //Third Party Property Damage Limit
                                worksheet.cell(rowcount + 2, 83).string('');
                                worksheet.cell(rowcount + 2, 84).string('');
                                worksheet.cell(rowcount + 2, 85).string('No'); //Legal Liability Employees
                                worksheet.cell(rowcount + 2, 86).string('');
                                worksheet.cell(rowcount + 2, 87).string(dbUserData.Erp_Qt_Request_Core['___is_llpd___']);
                                worksheet.cell(rowcount + 2, 88).string(dbUserData.Erp_Qt_Request_Core['___is_llpd___'].toString() === "yes" ? "1" : "0");
                                worksheet.cell(rowcount + 2, 89).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "No" : (dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "Yes" : "No")); //PA Owner Driver //Yes And No
                                worksheet.cell(rowcount + 2, 90).string(dbUserData.Erp_Qt_Request_Core['___pa_owner_driver_si___']);
//Done Till Here IDV Still Not Done
                                worksheet.cell(rowcount + 2, 91).string(Processed_Request['___pa_unnamed_passenger_si___'] === "" ? "No" : "Yes"); //PA for Unnamed Passenger yes and no
                                worksheet.cell(rowcount + 2, 92).string(Processed_Request['___pa_unnamed_passenger_si___'] === "" ? "0" : Processed_Request['___pa_unnamed_passenger_si___']); //Sum Insured Per Person   If yes, the PA SI per person
                                if (Processed_Request['___pa_unnamed_passenger_si___'] === "") {
                                    worksheet.cell(rowcount + 2, 93).string('0');
                                } else {
                                    worksheet.cell(rowcount + 2, 93).string((parseInt(Processed_Request['___pa_unnamed_passenger_si___']) * parseInt(Processed_Request['___dbmaster_insurer_vehicle_seatingcapacity___'])).toString()); //Total Sum Insured
                                }
//to be check
                                worksheet.cell(rowcount + 2, 94).string(["CNG", "LPG"].indexOf(Processed_Request['___dbmaster_insurer_vehicle_fueltype___']) > -1 ? "Yes" : "No"); //CNG LPG Kit Liability
                                worksheet.cell(rowcount + 2, 95).string(dbUserData.Erp_Qt_Request_Core['___addon_invoice_price_cover___'].toString()); //Invoice Value Protect yes or no
                                worksheet.cell(rowcount + 2, 96).string(dbUserData.Erp_Qt_Request_Core['___addon_key_lock_cover___'].toString()); //Key and Locks Protect yes or no
                                worksheet.cell(rowcount + 2, 97).string(dbUserData.Erp_Qt_Request_Core['___addon_ncb_protection_cover___'].toString()); //NCB Protect yes or no
                                worksheet.cell(rowcount + 2, 98).string(dbUserData.Erp_Qt_Request_Core['___addon_zero_dep_cover___'].toString()); //Depreciation Protect yes or no
                                worksheet.cell(rowcount + 2, 99).string(dbUserData.Erp_Qt_Request_Core['___addon_engine_protector_cover___'].toString()); //Engine Protect yes or no
                                worksheet.cell(rowcount + 2, 100).string(dbUserData.Erp_Qt_Request_Core['___addon_consumable_cover___'].toString()); //Consumable Expenses Protect yes or no
                                worksheet.cell(rowcount + 2, 101).string(mdp_prm > 0 ? "yes" : "no"); //Mandatory Deduction Protect yes or no
                                worksheet.cell(rowcount + 2, 102).string(dbUserData.Erp_Qt_Request_Core['___addon_road_assist_cover___'].toString()); //Road Side Assistance yes or no
                                worksheet.cell(rowcount + 2, 103).string(dbUserData.Erp_Qt_Request_Core['___addon_personal_belonging_loss_cover___'].toString()); //Personal Belongings Protect yes or no
                                worksheet.cell(rowcount + 2, 104).string('no'); //Personal Accident Protect yes or no
                                worksheet.cell(rowcount + 2, 105).string(Processed_Request['___own_damage_disc_rate___'].toString()); //Required Discount/Loading (%) AS per GRID Shared
                                worksheet.cell(rowcount + 2, 106).string(Processed_Request['___own_damage_disc_rate___'].toString()); //Allowable Discount/Loading AS per GRID Shared
                                worksheet.cell(rowcount + 2, 107).string(dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___']); //Hypothecation or blank
                                worksheet.cell(rowcount + 2, 108).string(dbUserData.Erp_Qt_Request_Core['___financial_institute_name___']);
                                worksheet.cell(rowcount + 2, 109).string(dbUserData.Erp_Qt_Request_Core['___financial_institute_city___']);
                                worksheet.cell(rowcount + 2, 110).string(dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString()); //IDV Value
                                worksheet.cell(rowcount + 2, 111).string('');
                                worksheet.cell(rowcount + 2, 112).string('');
                                worksheet.cell(rowcount + 2, 113).string(Processed_Request['___vehicle_registration_type___']); //Main Applicant (Proposer) Type Person/ Organisation
                                worksheet.cell(rowcount + 2, 114).string(dbUserData.Erp_Qt_Request_Core['___salutation___']);
                                worksheet.cell(rowcount + 2, 115).string(dbUserData.Erp_Qt_Request_Core['___first_name___']);
                                worksheet.cell(rowcount + 2, 116).string(dbUserData.Erp_Qt_Request_Core['___middle_name___']);
                                worksheet.cell(rowcount + 2, 117).string(dbUserData.Erp_Qt_Request_Core['___last_name___']);
                                worksheet.cell(rowcount + 2, 118).string(dbUserData.Erp_Qt_Request_Core['___gender___'] === "M" ? "Male" : (dbUserData.Erp_Qt_Request_Core['___gender___'] === "F" ? "Female" : "Unknown"));
                                worksheet.cell(rowcount + 2, 119).string(dbUserData.Erp_Qt_Request_Core['___marital_text___']);
                                var cust_dob = dbUserData.Erp_Qt_Request_Core['___birth_date___'].split("-");
                                worksheet.cell(rowcount + 2, 120).string(cust_dob[2] + '/' + cust_dob[1] + '/' + cust_dob[0]); //Mandatory DD/MM/YYYY
                                worksheet.cell(rowcount + 2, 121).string('Indian');
                                worksheet.cell(rowcount + 2, 122).string(dbUserData.Erp_Qt_Request_Core['___communication_address_1___']);
                                worksheet.cell(rowcount + 2, 123).string(dbUserData.Erp_Qt_Request_Core['___communication_address_2___']);
                                worksheet.cell(rowcount + 2, 124).string(dbUserData.Erp_Qt_Request_Core['___communication_address_3___']);
                                worksheet.cell(rowcount + 2, 125).string('India');
                                worksheet.cell(rowcount + 2, 126).string(dbUserData.Erp_Qt_Request_Core['___communication_pincode___']);
                                worksheet.cell(rowcount + 2, 127).string(dbUserData.Erp_Qt_Request_Core['___communication_city___']);
                                worksheet.cell(rowcount + 2, 128).string(dbUserData.Erp_Qt_Request_Core['___communication_state___']);
                                worksheet.cell(rowcount + 2, 129).string(dbUserData.Erp_Qt_Request_Core['___pan___']);
                                worksheet.cell(rowcount + 2, 130).string(dbUserData.Erp_Qt_Request_Core['___gst_no___']);
                                worksheet.cell(rowcount + 2, 131).string(dbUserData.Erp_Qt_Request_Core['___aadhar___']);
                                worksheet.cell(rowcount + 2, 132).string(dbUserData.Erp_Qt_Request_Core['___mobile___']);
                                worksheet.cell(rowcount + 2, 133).string(dbUserData.Erp_Qt_Request_Core['___email___']);
                                worksheet.cell(rowcount + 2, 134).string(dbUserData.Erp_Qt_Request_Core['___occupation___']);
                                worksheet.cell(rowcount + 2, 135).string(dbUserData.Erp_Qt_Request_Core['___nominee_name___']);
                                worksheet.cell(rowcount + 2, 136).string(dbUserData.Erp_Qt_Request_Core['___nominee_relation___']);
                                worksheet.cell(rowcount + 2, 137).string('');
                                var nominee_dob = dbUserData.Erp_Qt_Request_Core['___nominee_birth_date___'].split("-");
                                worksheet.cell(rowcount + 2, 138).string(nominee_dob[2] + '/' + nominee_dob[1] + '/' + nominee_dob[0]);
                                worksheet.cell(rowcount + 2, 139).string('no');
                                worksheet.cell(rowcount + 2, 140).string('');
                                worksheet.cell(rowcount + 2, 141).string('');
                                worksheet.cell(rowcount + 2, 142).string('');
                                worksheet.cell(rowcount + 2, 143).string('');
                                worksheet.cell(rowcount + 2, 144).string(''); //Is Registration Address Same //Yes or Blank
                                worksheet.cell(rowcount + 2, 145).string(dbUserData.Erp_Qt_Request_Core['___permanent_address_1___']);
                                worksheet.cell(rowcount + 2, 146).string(dbUserData.Erp_Qt_Request_Core['___permanent_address_2___']);
                                worksheet.cell(rowcount + 2, 147).string(dbUserData.Erp_Qt_Request_Core['___permanent_address_3___']);
                                worksheet.cell(rowcount + 2, 148).string('India');
                                worksheet.cell(rowcount + 2, 149).string(dbUserData.Erp_Qt_Request_Core['___permanent_pincode___']);
                                worksheet.cell(rowcount + 2, 150).string(dbUserData.Erp_Qt_Request_Core['___permanent_city___']);
                                worksheet.cell(rowcount + 2, 151).string(dbUserData.Erp_Qt_Request_Core['___permanent_state___']);
                                worksheet.cell(rowcount + 2, 152).string('');
                                worksheet.cell(rowcount + 2, 153).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_basic___'].toString());
                                worksheet.cell(rowcount + 2, 154).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_non_elect_access___'].toString());
                                worksheet.cell(rowcount + 2, 155).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_elect_access___'].toString());
                                worksheet.cell(rowcount + 2, 156).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_cng_lpg___'].toString());
                                worksheet.cell(rowcount + 2, 157).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_ncb___'].toString()); // NCB Discount Amount
                                worksheet.cell(rowcount + 2, 158).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_final_premium___'].toString());
                                worksheet.cell(rowcount + 2, 159).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_basic___'].toString());
                                worksheet.cell(rowcount + 2, 160).string('');
                                worksheet.cell(rowcount + 2, 161).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_paid_driver_ll___'].toString());
                                worksheet.cell(rowcount + 2, 162).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'].toString());
                                worksheet.cell(rowcount + 2, 163).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_unnamed_passenger_pa___'].toString());
                                worksheet.cell(rowcount + 2, 164).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cng_lpg___'].toString());
                                worksheet.cell(rowcount + 2, 165).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_final_premium___'].toString());
                                worksheet.cell(rowcount + 2, 166).string(dbUserData.Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_invoice_price_cover___'].toString() : "0");
                                worksheet.cell(rowcount + 2, 167).string(dbUserData.Erp_Qt_Request_Core['___addon_key_lock_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_key_lock_cover___'].toString() : "0");
                                worksheet.cell(rowcount + 2, 168).string(dbUserData.Erp_Qt_Request_Core['___addon_ncb_protection_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_ncb_protection_cover___'].toString() : "0");
                                worksheet.cell(rowcount + 2, 169).string(dbUserData.Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'].toString() : "0");
                                worksheet.cell(rowcount + 2, 170).string(dbUserData.Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'].toString() : "0");
                                worksheet.cell(rowcount + 2, 171).string(dbUserData.Erp_Qt_Request_Core['___addon_consumable_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_consumable_cover___'].toString() : "0");
                                worksheet.cell(rowcount + 2, 172).string(mdp_prm > 0 ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_mandatory_deduction_protect___'].toString() : "0"); //Mandatory Deduction Protect
                                worksheet.cell(rowcount + 2, 173).string(dbUserData.Erp_Qt_Request_Core['___addon_road_assist_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_road_assist_cover___'].toString() : "0");
                                worksheet.cell(rowcount + 2, 174).string(dbUserData.Erp_Qt_Request_Core['___addon_personal_belonging_loss_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_personal_belonging_loss_cover___'].toString() : "0");
                                worksheet.cell(rowcount + 2, 175).string('0'); //Personal Accident Protect
                                worksheet.cell(rowcount + 2, 176).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___'].toString());
                                worksheet.cell(rowcount + 2, 177).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString());
                                worksheet.cell(rowcount + 2, 178).string(Erp_Qt_Request_Core['___communication_state___'] === "MAHARASHTRA" ? ((((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 2).toFixed(2).toString()).split('.')[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")) : "0"); //Add SGST
                                worksheet.cell(rowcount + 2, 179).string(Erp_Qt_Request_Core['___communication_state___'] === "MAHARASHTRA" ? ((((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 2).toFixed(2).toString()).split('.')[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")) : "0"); //Add CGST
                                worksheet.cell(rowcount + 2, 180).string(Erp_Qt_Request_Core['___communication_state___'] === "MAHARASHTRA" ? "0" : ((((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 1).toFixed(2).toString()).split('.')[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"))); // IGST
                                worksheet.cell(rowcount + 2, 181).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString());
                                worksheet.cell(rowcount + 2, 182).string(dbUserData.Transaction_Data.policy_number).style(styleh);
                                worksheet.cell(rowcount + 2, 183).string('NEFT');
                                worksheet.cell(rowcount + 2, 184).string(dbUserData.Erp_Qt_Request_Core['___first_name___']); //Customer First Name
                                worksheet.cell(rowcount + 2, 185).string(payment_bank_name); //
                                worksheet.cell(rowcount + 2, 186).string(dbUserData.Transaction_Data.transaction_id.toString()); //Transaction ID
                                worksheet.cell(rowcount + 2, 187).string('1234'); //1234
                                worksheet.cell(rowcount + 2, 188).string('ABC');
                                worksheet.cell(rowcount + 2, 189).string(moment(dbUserData.Transaction_Data.pg_reference_number_1).format('DD/MM/YYYY').toString()); //Payment date //Instrument Date//
                                worksheet.cell(rowcount + 2, 190).string(typeof dbUserData.Transaction_Data.transaction_amount === 'number' ? dbUserData.Transaction_Data.transaction_amount.toString() : dbUserData.Transaction_Data.transaction_amount);
                                if (dbUserData.Erp_Qt_Request_Core['___is_posp___'] === "yes") {
                                    //if (dbUserData.Erp_Qt_Request_Core['___posp_ss_id___'] > 0) {
                                    worksheet.cell(rowcount + 2, 191).string('POSP');
                                    worksheet.cell(rowcount + 2, 192).string((dbUserData.Erp_Qt_Request_Core['___posp_ss_id___']).toString());
                                    var posp_name = "";
                                    if (dbUserData.Erp_Qt_Request_Core['___posp_middle_name___'] === null || dbUserData.Erp_Qt_Request_Core['___posp_middle_name___'] === "") {
                                        posp_name = dbUserData.Erp_Qt_Request_Core['___posp_first_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_last_name___'];
                                    } else {
                                        posp_name = dbUserData.Erp_Qt_Request_Core['___posp_first_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_middle_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_last_name___'];
                                    }
                                    worksheet.cell(rowcount + 2, 193).string(posp_name);
                                    worksheet.cell(rowcount + 2, 194).string('');
                                    worksheet.cell(rowcount + 2, 195).string(dbUserData.Erp_Qt_Request_Core['___posp_pan_no___']);
                                } else {
                                    worksheet.cell(rowcount + 2, 191).string('NA');
                                    worksheet.cell(rowcount + 2, 192).string('NA');
                                    worksheet.cell(rowcount + 2, 193).string('NA');
                                    worksheet.cell(rowcount + 2, 194).string('NA');
                                    worksheet.cell(rowcount + 2, 195).string('NA');
                                }
                                if (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP") {
                                    worksheet.cell(rowcount + 2, 196).string((Processed_Request['___saod_tp_policy_tenure___']).toString());
                                    worksheet.cell(rowcount + 2, 197).string(dbUserData.Erp_Qt_Request_Core['___tp_start_date___']);
                                    worksheet.cell(rowcount + 2, 198).string(dbUserData.Erp_Qt_Request_Core['___tp_end_date___']);
                                } else {
                                    worksheet.cell(rowcount + 2, 196).string('');
                                    worksheet.cell(rowcount + 2, 197).string('');
                                    worksheet.cell(rowcount + 2, 198).string('');
                                }
                            } catch (e) {
                                console.log("create_edelweiss_feedfile", e.message);
                                res.json({'msg': 'error-' + e.message});
                            }
                        }
                        workbook.write(ff_loc_path_portal);
                        res.json({'msg': 'Success'});
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Edelweiss Feed File Dated:' + date;
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File for ' + emp_data.length + ' Edelweiss Private Car Policy. Share status of each policy. Please confirm if these policies are enroll in Edelweiss system.</p>'
                                + '<BR><p>Feed-File Dated: ' + date + '</p><BR><p>Feed-File URL : ' + ff_web_path_portal + ' </p></body></html>';
                        var arrTo = ['shiv.yadav@edelweissfin.com', 'shrinath.pandey@edelweissfin.com', 'vibhash.shukla@edelweissfin.com'];
                        var arrBcc = [config.environment.notification_email, 'ashish.hatia@policyboss.com', 'anuj.singh@policyboss.com', 'vikram.jena@policyboss.com'];
                        if (config.environment.name === 'Production') {
                            if (req.query.hasOwnProperty('dbg') && req.query['dbg'] == 'yes') {
                                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_body, '', '', ''); //UAT
                    } else {
                                objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, '', arrBcc.join(','), ''); //UAT
                            }
                        } else {
                            var rep_to = "jyoti.gupta@policyboss.com";
                            objModelEmail.send('notifications@policyboss.com', rep_to, sub, email_body, '', '', ''); //UAT
                        }
                        var SmsLog = require('../models/sms_log');
                        var objSmsLog = new SmsLog();
                        var customer_msg = "HORIZON-FEEDfILE-SCHEDULER\n\---------------\n\ Hi ,\n\Edelweiss Motor FeedFile Dated : " + moment().subtract(1, "days").format('DD-MM-YYYY') + ".\n\Successfully Generated.\n\No. of Policy: " + emp_data.length;
                        objSmsLog.send_sms('9619160851', customer_msg, 'POLBOS-SCHEDULER'); //Anuj
                        objSmsLog.send_sms('7208803933', customer_msg, 'POLBOS-SCHEDULER'); //Ashish
                    } else {
                        res.json({'msg': 'No Data Avilable'});
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Edelweiss Feed File Dated:' + date;
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File of Edelweiss Private Car Policy. Share status of each policy. Please confirm if these policies are enroll in Edelweiss system.</p>'
                                + '<BR><p>Feed-File Dated: ' + date + '</p><BR><p>No Data Avilable </p></body></html>';
                        //var arrTo = ['Krishna.Parab@edelweissfin.com', 'Rohit.Bhosle@edelweissfin.com', 'Shrinath.Pandey@edelweissfin.com'];
                        var arrBcc = [config.environment.notification_email, 'ashish.hatia@policyboss.com', 'anuj.singh@policyboss.com', 'vikram.jena@policyboss.com'];
                        if (config.environment.name === 'Production') {
                            if (req.query.hasOwnProperty('dbg') && req.query['dbg'] == 'yes') {
                                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_body, '', '', ''); //UAT
                            } else {
                                objModelEmail.send('notifications@policyboss.com', arrBcc.join(','), sub, email_body, '', '', ''); //UAT
                            }
                        } else {
                            var rep_to = "jyoti.gupta@policyboss.com";
                            objModelEmail.send('notifications@policyboss.com', rep_to, sub, email_body, '', '', ''); //UAT
                        }
                        var SmsLog = require('../models/sms_log');
                        var objSmsLog = new SmsLog();
                        var customer_msg = "HORIZON-FEEDfILE-SCHEDULER\n\---------------\n\ Hi ,\n\Edelweiss Motor FeedFile Dated : " + moment().subtract(1, "days").format('DD-MM-YYYY') + ".\n\No Data Avilable.";
                        objSmsLog.send_sms('9619160851', customer_msg, 'POLBOS-SCHEDULER'); //Anuj
                        objSmsLog.send_sms('7208803933', customer_msg, 'POLBOS-SCHEDULER'); //Ashish
                    }
                } catch (e) {
                    console.log("create_edelweiss_feedfile", e);
                    res.json(e);
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }

    });

    app.get('/create_edelweiss_health_feedfile', function (req, res) {
//        var UDID = (req.params['UDID']);
        try {
            var User_Data = require(appRoot + '/models/user_data');
            var start_date = new Date();
            var days = (req.query.hasOwnProperty('days')) ? req.query.days - 0 : 1;
            start_date.setDate(start_date.getDate() - days);
            start_date.setHours(00, 00, 00, 000);
            var end_date = new Date();
            end_date.setDate(end_date.getDate() + 0);
            end_date.setHours(00, 00, 00, 000);
            var Last_Status = 'TRANS_SUCCESS';
            User_Data.find({Insurer_Id: 46, Last_Status: new RegExp(Last_Status, 'i'), Product_Id: 2, Modified_On: {$gte: start_date, $lt: end_date}}, {_id: 0}, function (err, emp_data) {//Actual
//                User_Data.find({Insurer_Id: 46, Last_Status: new RegExp(Last_Status, 'i'), Product_Id: 2}, {_id: 0}).sort({Modified_On: -1}).limit(1).exec(function (err, emp_data) {//Test
                try {
                    if (err)
                        throw err;
                    var excel = require('excel4node');
                    var date = moment().subtract(1, "days").format('DD-MM-YYYY');
                    //START Feed File Code=========================================================================================
                    var ff_file_name = "EdelweissHealth_FeedFile_" + date + ".xlsx";
                    var ff_loc_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                    var ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                    var workbook = new excel.Workbook();
                    var worksheet = workbook.addWorksheet('Sheet 1');
                    var style = workbook.createStyle({
                        font: {
                            color: '#FF0800',
                            size: 12
                        },
                        numberFormat: '$#,##0.00; ($#,##0.00); -'
                    });
                    var styleh = workbook.createStyle({
                        font: {
                            bold: true,
                            size: 12
                        }
                    });
                    if (parseInt(emp_data.length) > 0) {
                        //row 1
                        worksheet.cell(1, 1).string('Policy_Number').style(styleh);
                        worksheet.cell(1, 2).string('IMD_Name_ID').style(styleh);
                        worksheet.cell(1, 3).string('IMIDName').style(styleh);//Source
                        worksheet.cell(1, 4).string('Quote_Type').style(styleh);
                        worksheet.cell(1, 5).string('Sales_Product').style(styleh);
                        worksheet.cell(1, 6).string('Effective_Date').style(styleh);
                        worksheet.cell(1, 7).string('Business_Partner_Type').style(styleh);
                        worksheet.cell(1, 8).string('Policy_Start_Date').style(styleh);
                        worksheet.cell(1, 9).string('Policy_End_Date').style(styleh);
                        worksheet.cell(1, 10).string('Policy_Tenure').style(styleh);
                        worksheet.cell(1, 11).string('Branch').style(styleh);
                        worksheet.cell(1, 12).string('Distribution_Channel').style(styleh);
                        worksheet.cell(1, 13).string('Employee_Id').style(styleh);
                        worksheet.cell(1, 14).string('Sales_Manager').style(styleh);
                        worksheet.cell(1, 15).string('Policy_Type').style(styleh);
                        worksheet.cell(1, 16).string('Floater_Combination').style(styleh);
                        worksheet.cell(1, 17).string('Portability').style(styleh);
                        worksheet.cell(1, 18).string('Opt_for_Health_241_Add_on').style(styleh);
                        worksheet.cell(1, 19).string('NSTP_Flag').style(styleh);
                        worksheet.cell(1, 20).string('TPA').style(styleh);
                        worksheet.cell(1, 21).string('Discrepancy_Flag').style(styleh);
                        worksheet.cell(1, 22).string('Proposer_Salutation').style(styleh);
                        worksheet.cell(1, 23).string('Proposer_First_Name').style(styleh);
                        worksheet.cell(1, 24).string('Proposer_Middle_Name').style(styleh);
                        worksheet.cell(1, 25).string('Proposer_Last_Name').style(styleh);
                        worksheet.cell(1, 26).string('Proposer_Date_Of_Birth').style(styleh);
                        worksheet.cell(1, 27).string('Proposer_Age').style(styleh);
                        worksheet.cell(1, 28).string('Proposer_Gender').style(styleh);
                        worksheet.cell(1, 29).string('Proposer_Marital_Status').style(styleh);
                        worksheet.cell(1, 30).string('Proposer_Nationality').style(styleh);
                        worksheet.cell(1, 31).string('Proposer_Telephone').style(styleh);
                        worksheet.cell(1, 32).string('Proposer_Mobile').style(styleh);
                        worksheet.cell(1, 33).string('Proposer_Pan_No').style(styleh);
                        worksheet.cell(1, 34).string('Proposer_ID_Proof_Type').style(styleh);
                        worksheet.cell(1, 35).string('Proposer_ID_Proof_No').style(styleh);
                        worksheet.cell(1, 36).string('Proposer_Adhaar_No').style(styleh);
                        worksheet.cell(1, 37).string('Proposer_Profession').style(styleh);
                        worksheet.cell(1, 38).string('Proposer_Annual_income').style(styleh);
                        worksheet.cell(1, 39).string('Proposer_Email').style(styleh);
                        worksheet.cell(1, 40).string('Proposer_Correspondence_Address').style(styleh);
                        worksheet.cell(1, 41).string('Proposer_CLocality').style(styleh);
                        worksheet.cell(1, 42).string('Proposer_CCity').style(styleh);
                        worksheet.cell(1, 43).string('Proposer_CPincode').style(styleh);
                        worksheet.cell(1, 44).string('Proposer_CState').style(styleh);
                        worksheet.cell(1, 45).string('Proposer_CLandmark').style(styleh);
                        worksheet.cell(1, 46).string('Proposer_Permanent_Address').style(styleh);
                        worksheet.cell(1, 47).string('Proposer_Locality').style(styleh);
                        worksheet.cell(1, 48).string('Proposer_City').style(styleh);
                        worksheet.cell(1, 49).string('Proposer_Pincode').style(styleh);
                        worksheet.cell(1, 50).string('Proposer_State').style(styleh);
                        worksheet.cell(1, 51).string('Proposer_Landmark').style(styleh);
                        worksheet.cell(1, 52).string('Previous_Insurance_Policy').style(styleh);
                        worksheet.cell(1, 53).string('Previous_Policy_Start_Date').style(styleh);
                        worksheet.cell(1, 54).string('Previous_Policy_End_Date').style(styleh);
                        worksheet.cell(1, 55).string('Previous_Policy_No').style(styleh);
                        worksheet.cell(1, 56).string('Insured_Name').style(styleh);
                        worksheet.cell(1, 57).string('Previous_Insurer').style(styleh);
                        worksheet.cell(1, 58).string('Previous_Claim_made').style(styleh);
                        worksheet.cell(1, 59).string('Sum_Insured').style(styleh);
                        worksheet.cell(1, 60).string('Do_you_have_any_existing_policy_of_EGIC').style(styleh);
                        worksheet.cell(1, 61).string('PolicyNo').style(styleh);
                        worksheet.cell(1, 62).string('Name_of_Family_Physician').style(styleh);
                        worksheet.cell(1, 63).string('Contact_No').style(styleh);
                        worksheet.cell(1, 64).string('Address').style(styleh);
                        worksheet.cell(1, 65).string('Ever_filed_a_claim_with_their_current_previous_insurer').style(styleh);
                        worksheet.cell(1, 66).string('Insurance_ever_declined_cancelled_charged_a_higher_premium_issued_with_special_condition').style(styleh);
                        worksheet.cell(1, 67).string('Covered_under_any_other_health_insurance_policy_with_the_Company').style(styleh);
                        worksheet.cell(1, 68).string('Nominee_Name').style(styleh);
                        worksheet.cell(1, 69).string('Nominee_Date_of_Birth').style(styleh);
                        worksheet.cell(1, 70).string('Nominee_Relationship_with_Insured').style(styleh);
                        worksheet.cell(1, 71).string('Share').style(styleh);
                        worksheet.cell(1, 72).string('Is_Nominee_Minor').style(styleh);
                        var col_index = 72;
                        for (var i = 1; i <= 5; i++) {
                            worksheet.cell(1, col_index + 1).string('Member_' + i + '_Salutation').style(styleh);
                            worksheet.cell(1, col_index + 2).string('Member_' + i + '_First_Name').style(styleh);
                            worksheet.cell(1, col_index + 3).string('Member_' + i + '_Middle_Name').style(styleh);
                            worksheet.cell(1, col_index + 4).string('Member_' + i + '_Last_Name').style(styleh);
                            worksheet.cell(1, col_index + 5).string('Member_' + i + '_Date_Of_Birth').style(styleh);
                            worksheet.cell(1, col_index + 6).string('Member_' + i + '_Age').style(styleh);
                            worksheet.cell(1, col_index + 7).string('Member_' + i + '_Gender').style(styleh);
                            worksheet.cell(1, col_index + 8).string('Member_' + i + '_Mother_Name').style(styleh);
                            worksheet.cell(1, col_index + 9).string('Member_' + i + '_Relationship_with_Insured').style(styleh);
                            worksheet.cell(1, col_index + 10).string('Member_' + i + '_Plan_Name').style(styleh);
                            worksheet.cell(1, col_index + 11).string('Member_' + i + '_Marital_Status').style(styleh);
                            worksheet.cell(1, col_index + 12).string('Member_' + i + '_Nationality').style(styleh);
                            worksheet.cell(1, col_index + 13).string('Member_' + i + '_Telephone').style(styleh);
                            worksheet.cell(1, col_index + 14).string('Member_' + i + '_Mobile').style(styleh);
                            worksheet.cell(1, col_index + 15).string('Member_' + i + '_ID_Proof_Type').style(styleh);
                            worksheet.cell(1, col_index + 16).string('Member_' + i + '_ID_Proof_No').style(styleh);
                            worksheet.cell(1, col_index + 17).string('Member_' + i + '_Adhaar_No').style(styleh);
                            worksheet.cell(1, col_index + 18).string('Member_' + i + '_PAN_Form_60').style(styleh);
                            worksheet.cell(1, col_index + 19).string('Member_' + i + '_Profession').style(styleh);
                            worksheet.cell(1, col_index + 20).string('Member_' + i + '_Annual_income').style(styleh);
                            worksheet.cell(1, col_index + 21).string('Member_' + i + '_Height').style(styleh);
                            worksheet.cell(1, col_index + 22).string('Member_' + i + '_Weight').style(styleh);
                            worksheet.cell(1, col_index + 23).string('Member_' + i + '_BMI').style(styleh);
                            worksheet.cell(1, col_index + 24).string('Member_' + i + '_Blood_Group').style(styleh);
                            worksheet.cell(1, col_index + 25).string('Member_' + i + '_Email').style(styleh);
                            worksheet.cell(1, col_index + 26).string('Member_' + i + '_Correspondence_Address').style(styleh);
                            worksheet.cell(1, col_index + 27).string('Member_' + i + '_CLocality').style(styleh);
                            worksheet.cell(1, col_index + 28).string('Member_' + i + '_CCity').style(styleh);
                            worksheet.cell(1, col_index + 29).string('Member_' + i + '_CPincode').style(styleh);
                            worksheet.cell(1, col_index + 30).string('Member_' + i + '_CState').style(styleh);
                            worksheet.cell(1, col_index + 31).string('Member_' + i + '_CLandmark').style(styleh);
                            worksheet.cell(1, col_index + 32).string('Member_' + i + '_Permanent_Address').style(styleh);
                            worksheet.cell(1, col_index + 33).string('Member_' + i + '_Locality').style(styleh);
                            worksheet.cell(1, col_index + 34).string('Member_' + i + '_City').style(styleh);
                            worksheet.cell(1, col_index + 35).string('Member_' + i + '_Pincode').style(styleh);
                            worksheet.cell(1, col_index + 36).string('Member_' + i + '_State').style(styleh);
                            worksheet.cell(1, col_index + 37).string('Member_' + i + '_Landmark').style(styleh);
                            worksheet.cell(1, col_index + 38).string('Member_' + i + '_Sum_Insured').style(styleh);
                            worksheet.cell(1, col_index + 39).string('Member_' + i + '_Do_you_have_any_existing_policy_of_EGIC').style(styleh);
                            worksheet.cell(1, col_index + 40).string('Member_' + i + '_PolicyNo').style(styleh);
                            worksheet.cell(1, col_index + 41).string('Member_' + i + '_Critical_Illness').style(styleh);
                            worksheet.cell(1, col_index + 42).string('Member_' + i + '_Restoration').style(styleh);
                            worksheet.cell(1, col_index + 43).string('Member_' + i + '_Recharge').style(styleh);
                            worksheet.cell(1, col_index + 44).string('Member_' + i + '_Voluntary_Co_Payment').style(styleh);
                            worksheet.cell(1, col_index + 45).string('Member_' + i + '_a_Diabetes').style(styleh);
                            worksheet.cell(1, col_index + 46).string('Member_' + i + '_b_Hypertension_High_BP').style(styleh);
                            worksheet.cell(1, col_index + 47).string('Member_' + i + '_c_Epilepsy').style(styleh);
                            worksheet.cell(1, col_index + 48).string('Member_' + i + '_d_High_Cholesterol').style(styleh);
                            worksheet.cell(1, col_index + 49).string('Member_' + i + '_e_Thyroid_disorder').style(styleh);
                            worksheet.cell(1, col_index + 50).string('Member_' + i + '_f_Asthma').style(styleh);
                            worksheet.cell(1, col_index + 51).string('Member_' + i + '_g_Kidney_Disorder').style(styleh);
                            worksheet.cell(1, col_index + 52).string('Member_' + i + '_h_Cancer').style(styleh);
                            worksheet.cell(1, col_index + 53).string('Member_' + i + '_i_Heart_Disease').style(styleh);
                            worksheet.cell(1, col_index + 54).string('Member_' + i + '_j_Liver_diseases').style(styleh);
                            worksheet.cell(1, col_index + 55).string('Member_' + i + '_2_Disease_Condition_Details').style(styleh);
                            worksheet.cell(1, col_index + 56).string('Member_' + i + '_3_PED').style(styleh);
                            worksheet.cell(1, col_index + 57).string('Member_' + i + '_4_Receiving_received_any_treatment_medication_undergone_surgeries_for_any_medical_condition_disability').style(styleh);
                            worksheet.cell(1, col_index + 58).string('Member_' + i + '_5_Please_provide_details_of_hereditary_medical_history_if_any').style(styleh);
                            worksheet.cell(1, col_index + 59).string('Member_' + i + '_6_Any_allergies_reaction_to_any_drug').style(styleh);
                            worksheet.cell(1, col_index + 60).string('Member_' + i + '_7_Any_Other_Disease').style(styleh);
                            worksheet.cell(1, col_index + 61).string('Member_' + i + '_Medical_Package_Type').style(styleh);
                            worksheet.cell(1, col_index + 62).string('Member_' + i + '_Medical_Cost').style(styleh);
                            worksheet.cell(1, col_index + 63).string('Member_' + i + '_Name_of_Family_Physician').style(styleh);
                            worksheet.cell(1, col_index + 64).string('Member_' + i + '_Contact_No').style(styleh);
                            worksheet.cell(1, col_index + 65).string('Member_' + i + '_Address').style(styleh);
                            worksheet.cell(1, col_index + 66).string('Member_' + i + '_Ever_filed_a_claim_with_their_current_previous_insurer').style(styleh);
                            worksheet.cell(1, col_index + 67).string('Member_' + i + '_Insurance_ever_declined_cancelled_charged_a_higher_premium_issued_with_special_condition').style(styleh);
                            worksheet.cell(1, col_index + 68).string('Member_' + i + '_Covered_under_any_other_health_insurance_policy_with_the_Company').style(styleh);
                            worksheet.cell(1, col_index + 69).string('Member_' + i + '_Details').style(styleh);
                            worksheet.cell(1, col_index + 70).string('Member_' + i + '_Nominee_Name').style(styleh);
                            worksheet.cell(1, col_index + 71).string('Member_' + i + '_Nominee_Date_of_Birth').style(styleh);
                            worksheet.cell(1, col_index + 72).string('Member_' + i + '_Relationship_with_Insured_Beneficiary').style(styleh);
                            worksheet.cell(1, col_index + 73).string('Member_' + i + '_Is_Nominee_Minor').style(styleh);
                            col_index += 73;
                        }
                        worksheet.cell(1, col_index + 1).string('Basic_Cover_Premium').style(styleh);
                        worksheet.cell(1, col_index + 2).string('Total_Discount_Amount').style(styleh);
                        worksheet.cell(1, col_index + 3).string('Total_Premium_Before_Tax').style(styleh);
                        worksheet.cell(1, col_index + 4).string('Total_Premium_After_Tax').style(styleh);
                        worksheet.cell(1, col_index + 5).string('Cheque_From').style(styleh);
                        worksheet.cell(1, col_index + 6).string('Bank_Name').style(styleh);
                        worksheet.cell(1, col_index + 7).string('Bank_Branch').style(styleh);
                        worksheet.cell(1, col_index + 8).string('IFSC_code').style(styleh);
                        worksheet.cell(1, col_index + 9).string('Account_No').style(styleh);
                        worksheet.cell(1, col_index + 10).string('Cheque_Date').style(styleh);
                        worksheet.cell(1, col_index + 11).string('Cheque_No').style(styleh);
                        worksheet.cell(1, col_index + 12).string('Payer_Name').style(styleh);
                        worksheet.cell(1, col_index + 13).string('Amount').style(styleh);
                        worksheet.cell(1, col_index + 14).string('Policy_Status').style(styleh);
                        worksheet.cell(1, col_index + 15).string('Premium_Type').style(styleh);
                        worksheet.cell(1, col_index + 16).string('Sub Intermediary Category').style(styleh);
                        worksheet.cell(1, col_index + 17).string('Sub Intermediary Code').style(styleh);
                        worksheet.cell(1, col_index + 18).string('Sub Intermediary Name').style(styleh);
                        worksheet.cell(1, col_index + 19).string('Sub Intermediary Phone Email').style(styleh);
                        worksheet.cell(1, col_index + 20).string('POSP PAN Aadhar No').style(styleh);


                        //row 2
                        for (var rowcount in emp_data) {
                            try {
                                var dbUserData = [];
                                dbUserData = emp_data[rowcount]._doc;
                                var Processed_Request = dbUserData.Transaction_Data.hasOwnProperty("edelweiss_health_data") ? JSON.parse(dbUserData.Transaction_Data.edelweiss_health_data) : "";
                                var Erp_Qt_Request_Core = dbUserData.Erp_Qt_Request_Core;
                                var nstpFlag = (dbUserData.Transaction_Data.transaction_substatus !== 'IF') ? 'Yes' : 'No';

                                var nominee_name = Processed_Request['___nominee_first_name___'] + ' ' + Processed_Request['___nominee_last_name___'];
                                var isAddon = (Processed_Request['___dbmaster_pb_plan_name___'].includes('241')) ? 'YES' : 'NO';
                                var proposer_addr = Processed_Request['___permanent_address_1___'] + ',' + Processed_Request['___permanent_address_2___'] + ',' + Processed_Request['___permanent_address_3___'];
                                var floaterCombo = Processed_Request['___adult_count___'].toString() + 'Adult' + ' ' + Processed_Request['___child_count___'].toString() + 'Child';
                                var already_covered = "NO";
                                var existing_egic_policy = "";
                                for (var i = 1; i <= Processed_Request['___member_count___'] + 1; i++) {
                                    if (Processed_Request['___member_' + i + '_inc___'] !== '' && Processed_Request['___member_' + i + '_inc___'] !== undefined) {
                                        if (Processed_Request['___member_' + i + '_question_1282_details___'] !== 'NO') {
                                            already_covered = 'YES';
                                            existing_egic_policy = Processed_Request['___member_' + i + '_question_1282_details___'];
                                        }
                                    }
                                }
                                var policy_number = dbUserData.Transaction_Data.policy_number.toString();
                                rowcount = parseInt(rowcount);
                                worksheet.cell(rowcount + 2, 1).string(policy_number);
                                worksheet.cell(rowcount + 2, 2).string('onlinepolicy@policyboss.com');
                                worksheet.cell(rowcount + 2, 3).string('Landmark');
                                worksheet.cell(rowcount + 2, 4).string('Full');
                                worksheet.cell(rowcount + 2, 5).string('Edelweiss Health Insurance');
                                worksheet.cell(rowcount + 2, 6).string(Processed_Request['___policy_start___']);
                                worksheet.cell(rowcount + 2, 7).string('Person');
                                worksheet.cell(rowcount + 2, 8).string(Processed_Request['___policy_start___']);
                                worksheet.cell(rowcount + 2, 9).string(Processed_Request['___policy_end___']);
                                worksheet.cell(rowcount + 2, 10).string(Processed_Request['___policy_tenure___'].toString());
                                worksheet.cell(rowcount + 2, 11).string('Mumbai H.O.');
                                worksheet.cell(rowcount + 2, 12).string('Web Aggregator');
                                worksheet.cell(rowcount + 2, 13).string('25159');
                                worksheet.cell(rowcount + 2, 14).string('Abirami Iyer');
                                worksheet.cell(rowcount + 2, 15).string(Erp_Qt_Request_Core['___health_insurance_type___']);
                                worksheet.cell(rowcount + 2, 16).string(floaterCombo);//floater
                                worksheet.cell(rowcount + 2, 17).string('No');
                                worksheet.cell(rowcount + 2, 18).string(isAddon);
                                worksheet.cell(rowcount + 2, 19).string(nstpFlag);//NSTP
                                worksheet.cell(rowcount + 2, 20).string('');//TPA
                                worksheet.cell(rowcount + 2, 21).string('No');
                                worksheet.cell(rowcount + 2, 22).string(Processed_Request['___salutation___']);
                                worksheet.cell(rowcount + 2, 23).string(Processed_Request['___first_name___']);
                                worksheet.cell(rowcount + 2, 24).string(Processed_Request['___middle_name___']);
                                worksheet.cell(rowcount + 2, 25).string(Processed_Request['___last_name___']);
                                worksheet.cell(rowcount + 2, 26).string(Processed_Request['___birth_date___']);
                                worksheet.cell(rowcount + 2, 27).string('');
                                worksheet.cell(rowcount + 2, 28).string(Processed_Request['___gender_2___']);
                                worksheet.cell(rowcount + 2, 29).string(Processed_Request['___marital___']);
                                worksheet.cell(rowcount + 2, 30).string('Indian');
                                worksheet.cell(rowcount + 2, 31).string(Processed_Request['___mobile___'].toString());
                                worksheet.cell(rowcount + 2, 32).string(Processed_Request['___mobile___'].toString());
                                worksheet.cell(rowcount + 2, 33).string('');
                                worksheet.cell(rowcount + 2, 34).string('');
                                worksheet.cell(rowcount + 2, 35).string(Processed_Request['___pan___']);
                                worksheet.cell(rowcount + 2, 36).string('');//aadhar
                                worksheet.cell(rowcount + 2, 37).string(Processed_Request['___occupation___']);
                                worksheet.cell(rowcount + 2, 38).string(Processed_Request['___annual_income___']);
                                worksheet.cell(rowcount + 2, 39).string(Processed_Request['___email___']);
                                worksheet.cell(rowcount + 2, 40).string(proposer_addr);
                                worksheet.cell(rowcount + 2, 41).string(Processed_Request['___city___']);
                                worksheet.cell(rowcount + 2, 42).string(Processed_Request['___city___']);
                                worksheet.cell(rowcount + 2, 43).string(Processed_Request['___permanent_pincode___']);
                                worksheet.cell(rowcount + 2, 44).string(Processed_Request['___state___']);
                                worksheet.cell(rowcount + 2, 45).string('');
                                worksheet.cell(rowcount + 2, 46).string('YES');
                                worksheet.cell(rowcount + 2, 47).string('');
                                worksheet.cell(rowcount + 2, 48).string('');
                                worksheet.cell(rowcount + 2, 49).string('');
                                worksheet.cell(rowcount + 2, 50).string('');
                                worksheet.cell(rowcount + 2, 51).string('');
                                worksheet.cell(rowcount + 2, 52).string('NA');
                                worksheet.cell(rowcount + 2, 53).string('');
                                worksheet.cell(rowcount + 2, 54).string('');
                                worksheet.cell(rowcount + 2, 55).string('NA');//BD
                                worksheet.cell(rowcount + 2, 56).string('NA');
                                worksheet.cell(rowcount + 2, 57).string('NA');
                                worksheet.cell(rowcount + 2, 58).string('NA');
                                worksheet.cell(rowcount + 2, 59).string(Processed_Request['___health_insurance_si___'].toString());
                                worksheet.cell(rowcount + 2, 60).string(already_covered);
                                worksheet.cell(rowcount + 2, 61).string(existing_egic_policy);
                                worksheet.cell(rowcount + 2, 62).string('NA');
                                worksheet.cell(rowcount + 2, 63).string('NA');
                                worksheet.cell(rowcount + 2, 64).string('NA');
                                worksheet.cell(rowcount + 2, 65).string('');
                                worksheet.cell(rowcount + 2, 66).string('');
                                worksheet.cell(rowcount + 2, 67).string('');
                                worksheet.cell(rowcount + 2, 68).string(nominee_name);//nominee
                                worksheet.cell(rowcount + 2, 69).string(Processed_Request['___nominee_birth_date___']);
                                worksheet.cell(rowcount + 2, 70).string(Processed_Request['___nominee_relation___']);
                                worksheet.cell(rowcount + 2, 71).string('100%');
                                worksheet.cell(rowcount + 2, 72).string('No');
                                var index = 72;
                                for (var i = 1; i <= Processed_Request['___member_count___'] + 1; i++) {
                                    if (Processed_Request['___member_' + i + '_inc___'] !== '' && Processed_Request['___member_' + i + '_inc___'] !== undefined) {
                                        worksheet.cell(rowcount + 2, index + 1).string(Processed_Request['___member_' + i + '_salutation___']);//member 1
                                        worksheet.cell(rowcount + 2, index + 2).string(Processed_Request['___member_' + i + '_first_name___']);
                                        worksheet.cell(rowcount + 2, index + 3).string('');
                                        worksheet.cell(rowcount + 2, index + 4).string(Processed_Request['___member_' + i + '_last_name___']);
                                        worksheet.cell(rowcount + 2, index + 5).string(Processed_Request['___member_' + i + '_birth_date___']);
                                        worksheet.cell(rowcount + 2, index + 6).string(Processed_Request['___member_' + i + '_age___'].toString());
                                        worksheet.cell(rowcount + 2, index + 7).string(Processed_Request['___member_' + i + '_gender_2___']);
                                        worksheet.cell(rowcount + 2, index + 8).string('');
                                        worksheet.cell(rowcount + 2, index + 9).string(Processed_Request['___member_' + i + '_relation___']);
                                        worksheet.cell(rowcount + 2, index + 10).string(Processed_Request['___dbmaster_plan_name___']);
                                        worksheet.cell(rowcount + 2, index + 11).string(Processed_Request['___member_' + i + '_marital_status___']);
                                        worksheet.cell(rowcount + 2, index + 12).string('Indian');
                                        worksheet.cell(rowcount + 2, index + 13).string(Processed_Request['___mobile___'].toString());
                                        worksheet.cell(rowcount + 2, index + 14).string(Processed_Request['___mobile___'].toString());
                                        worksheet.cell(rowcount + 2, index + 15).string('NA');
                                        worksheet.cell(rowcount + 2, index + 16).string('NA');
                                        worksheet.cell(rowcount + 2, index + 17).string('NA');
                                        worksheet.cell(rowcount + 2, index + 18).string('NA');
                                        worksheet.cell(rowcount + 2, index + 19).string(Processed_Request['___member_' + i + '_occupation___']);//CU
                                        worksheet.cell(rowcount + 2, index + 20).string('NA');
                                        worksheet.cell(rowcount + 2, index + 21).string(Processed_Request['___member_' + i + '_height___']);
                                        worksheet.cell(rowcount + 2, index + 22).string(Processed_Request['___member_' + i + '_weight___']);
                                        worksheet.cell(rowcount + 2, index + 23).string(Processed_Request['___member_' + i + '_bmi___'].toString());
                                        worksheet.cell(rowcount + 2, index + 24).string(Processed_Request['___member_' + i + '_blood_group___']);
                                        worksheet.cell(rowcount + 2, index + 25).string(Processed_Request['___email___']);
                                        worksheet.cell(rowcount + 2, index + 26).string(proposer_addr);
                                        worksheet.cell(rowcount + 2, index + 27).string(Processed_Request['___city___']);
                                        worksheet.cell(rowcount + 2, index + 28).string(Processed_Request['___city___']);
                                        worksheet.cell(rowcount + 2, index + 29).string(Processed_Request['___permanent_pincode___']);
                                        worksheet.cell(rowcount + 2, index + 30).string(Processed_Request['___state___']);
                                        worksheet.cell(rowcount + 2, index + 31).string('');
                                        worksheet.cell(rowcount + 2, index + 32).string(proposer_addr);
                                        worksheet.cell(rowcount + 2, index + 33).string(Processed_Request['___city___']);
                                        worksheet.cell(rowcount + 2, index + 34).string(Processed_Request['___city___']);
                                        worksheet.cell(rowcount + 2, index + 35).string(Processed_Request['___permanent_pincode___']);
                                        worksheet.cell(rowcount + 2, index + 36).string(Processed_Request['___state___']);
                                        worksheet.cell(rowcount + 2, index + 37).string('');
                                        worksheet.cell(rowcount + 2, index + 38).string(Processed_Request['___health_insurance_si___'].toString());//DO
                                        worksheet.cell(rowcount + 2, index + 39).string(already_covered);
                                        worksheet.cell(rowcount + 2, index + 40).string(existing_egic_policy);
                                        worksheet.cell(rowcount + 2, index + 41).string(Processed_Request['___critical_plan_cover___']);
                                        worksheet.cell(rowcount + 2, index + 42).string(Processed_Request['___restoration_plan_cover___']);
                                        worksheet.cell(rowcount + 2, index + 43).string(Processed_Request['___recharge_plan_cover___']);
                                        worksheet.cell(rowcount + 2, index + 44).string('0%');
                                        worksheet.cell(rowcount + 2, index + 45).string(Processed_Request['___member_' + i + '_question_1266_details___']);//diabetes-DV
                                        worksheet.cell(rowcount + 2, index + 46).string(Processed_Request['___member_' + i + '_question_1267_details___']);
                                        worksheet.cell(rowcount + 2, index + 47).string(Processed_Request['___member_' + i + '_question_1268_details___']);
                                        worksheet.cell(rowcount + 2, index + 48).string(Processed_Request['___member_' + i + '_question_1269_details___']);
                                        worksheet.cell(rowcount + 2, index + 49).string(Processed_Request['___member_' + i + '_question_1270_details___']);
                                        worksheet.cell(rowcount + 2, index + 50).string(Processed_Request['___member_' + i + '_question_1271_details___']);
                                        worksheet.cell(rowcount + 2, index + 51).string(Processed_Request['___member_' + i + '_question_1272_details___']);
                                        worksheet.cell(rowcount + 2, index + 52).string(Processed_Request['___member_' + i + '_question_1273_details___']);
                                        worksheet.cell(rowcount + 2, index + 53).string(Processed_Request['___member_' + i + '_question_1274_details___']);
                                        worksheet.cell(rowcount + 2, index + 54).string(Processed_Request['___member_' + i + '_question_1275_details___']);
                                        worksheet.cell(rowcount + 2, index + 55).string('NA');
                                        worksheet.cell(rowcount + 2, index + 56).string(Processed_Request['___member_' + i + '_ped___']);
                                        worksheet.cell(rowcount + 2, index + 57).string(Processed_Request['___member_' + i + '_question_1276_details___']);
                                        worksheet.cell(rowcount + 2, index + 58).string(Processed_Request['___member_' + i + '_question_1277_details___']);
                                        worksheet.cell(rowcount + 2, index + 59).string(Processed_Request['___member_' + i + '_question_1278_details___']);
                                        worksheet.cell(rowcount + 2, index + 60).string(Processed_Request['___member_' + i + '_question_1279_details___']);
                                        worksheet.cell(rowcount + 2, index + 61).string('NA');
                                        worksheet.cell(rowcount + 2, index + 62).string('NA');
                                        worksheet.cell(rowcount + 2, index + 63).string('NA');
                                        worksheet.cell(rowcount + 2, index + 64).string(Processed_Request['___mobile___'].toString());
                                        worksheet.cell(rowcount + 2, index + 65).string(proposer_addr);//EP
                                        worksheet.cell(rowcount + 2, index + 66).string(Processed_Request['___member_' + i + '_question_1280_details___']);
                                        worksheet.cell(rowcount + 2, index + 67).string(Processed_Request['___member_' + i + '_question_1281_details___']);
                                        worksheet.cell(rowcount + 2, index + 68).string('');
                                        worksheet.cell(rowcount + 2, index + 69).string('');
                                        worksheet.cell(rowcount + 2, index + 70).string(Processed_Request['___member_' + i + '_nominee_name___']);
                                        worksheet.cell(rowcount + 2, index + 71).string(Processed_Request['___member_' + i + '_nominee_dob___']);
                                        worksheet.cell(rowcount + 2, index + 72).string(Processed_Request['___member_' + i + '_nominee_rel___']);
                                        worksheet.cell(rowcount + 2, index + 73).string('No');
                                        index += 73;
                                    }
                                }
                                var blank_count = 5 - Processed_Request['___member_count___'];
                                index += 73 * blank_count;

                                worksheet.cell(rowcount + 2, index + 1).string(Processed_Request['___base_premium___'].toString());
                                worksheet.cell(rowcount + 2, index + 2).string('');
                                worksheet.cell(rowcount + 2, index + 3).string(Processed_Request['___net_premium___'].toString());
                                worksheet.cell(rowcount + 2, index + 4).string(Processed_Request['___final_premium___'].toString());
                                worksheet.cell(rowcount + 2, index + 5).string('CUSTOMER');
                                worksheet.cell(rowcount + 2, index + 6).string('PAYU');
                                worksheet.cell(rowcount + 2, index + 7).string('Mumbai');
                                worksheet.cell(rowcount + 2, index + 8).string('');
                                worksheet.cell(rowcount + 2, index + 9).string('1234');
                                worksheet.cell(rowcount + 2, index + 10).string(Processed_Request['___policy_start___']);
                                worksheet.cell(rowcount + 2, index + 11).string(dbUserData.Transaction_Data['transaction_id']);
                                worksheet.cell(rowcount + 2, index + 12).string(Processed_Request['___first_name___']);
                                worksheet.cell(rowcount + 2, index + 13).string(Processed_Request['___final_premium___'].toString());
                                worksheet.cell(rowcount + 2, index + 14).string('');//policystatus
                                worksheet.cell(rowcount + 2, index + 15).string(Processed_Request['___premium_type___']);
                                if (dbUserData.Erp_Qt_Request_Core['___is_posp___'] === "yes" && dbUserData.Erp_Qt_Request_Core['___posp_ss_id___'] > 0 && Processed_Request['___health_insurance_si___'] < 500000) {
                                    worksheet.cell(rowcount + 2, index + 16).string('POSP');
                                    worksheet.cell(rowcount + 2, index + 17).string((dbUserData.Erp_Qt_Request_Core['___posp_ss_id___']).toString());
                                    worksheet.cell(rowcount + 2, index + 18).string(dbUserData.Erp_Qt_Request_Core['___posp_first_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_middle_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_last_name___']);
                                    worksheet.cell(rowcount + 2, index + 19).string('');
                                    worksheet.cell(rowcount + 2, index + 20).string(dbUserData.Erp_Qt_Request_Core['___posp_pan_no___']);
                                } else {
                                    worksheet.cell(rowcount + 2, index + 16).string('');
                                    worksheet.cell(rowcount + 2, index + 17).string('');
                                    worksheet.cell(rowcount + 2, index + 18).string('');
                                    worksheet.cell(rowcount + 2, index + 19).string('');
                                    worksheet.cell(rowcount + 2, index + 20).string('');
                                }
                            } catch (e) {
                                console.log("create_edelweiss_health_feedfile", e.message);
                                res.json({'msg': 'error-' + e.message});
                            }
                        }
                        workbook.write(ff_loc_path_portal);
                        res.json({'msg': 'Success'});
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        var arrTo = ['shiv.yadav@edelweissfin.com', 'shrinath.pandey@edelweissfin.com', 'vibhash.shukla@edelweissfin.com'];
                        var arrBcc = [config.environment.notification_email, 'ashish.hatia@policyboss.com', 'anuj.singh@policyboss.com'];
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Edelweiss Health Feed File Dated:' + date;
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File for ' + emp_data.length + ' Edelweiss Health Policy. Share status of each policy. Please confirm if these policies are enroll in Edelweiss system.</p>'
                                + '<BR><p>Feed-File Dated: ' + date + '</p><BR><p>Feed-File URL : ' + ff_web_path_portal + ' </p></body></html>';
                        if (config.environment.name === 'Production') {
                            if (req.query.hasOwnProperty('dbg') && req.query['dbg'] === 'yes') {
                                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_body, '', '', '');
                            } else {
                                objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, '', arrBcc.join(','), '');
                            }
                        } else {
                            objModelEmail.send('notifications@policyboss.com', 'policybosstesting@gmail.com', sub, email_body, '', '', ''); //UAT
                        }
                        var SmsLog = require('../models/sms_log');
                        var objSmsLog = new SmsLog();
                        var customer_msg = "HORIZON-FEEDfILE-SCHEDULER\n\---------------\n\ Hi ,\n\Edelweiss Health FeedFile Dated : " + moment().subtract(1, "days").format('DD-MM-YYYY') + ".\n\Successfully Generated.\n\No. of Policy: " + emp_data.length;
                        objSmsLog.send_sms('9619160851', customer_msg, 'POLBOS-SCHEDULER'); //Anuj
                        objSmsLog.send_sms('7208803933', customer_msg, 'POLBOS-SCHEDULER'); //Ashish
                    } else {
                        res.json({'msg': 'No Data Available'});
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Edelweiss Health Feed File Dated:' + date;
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File of Edelweiss Health Policy. Share status of each policy. Please confirm if these policies are enroll in Edelweiss system.</p>'
                                + '<BR><p>Feed-File Dated: ' + date + '</p><BR><p>No Data Avilable </p></body></html>';
                        var arrBcc = [config.environment.notification_email, 'ashish.hatia@policyboss.com', 'anuj.singh@policyboss.com'];
                        if (config.environment.name === 'Production') {
                            if (req.query.hasOwnProperty('dbg') && req.query['dbg'] === 'yes') {
                                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_body, '', '', ''); //UAT
                            } else {
                                objModelEmail.send('notifications@policyboss.com', arrBcc.join(','), sub, email_body, '', '', ''); //UAT
                            }
                        }
                        var SmsLog = require('../models/sms_log');
                        var objSmsLog = new SmsLog();
                        var customer_msg = "HORIZON-FEEDfILE-SCHEDULER\n\---------------\n\ Hi ,\n\Edelweiss Health FeedFile Dated" + moment().subtract(1, "days").format('DD-MM-YYYY') + ".\n\No Data Avilable.";
                        objSmsLog.send_sms('9619160851', customer_msg, 'POLBOS-SCHEDULER'); //Anuj
                        objSmsLog.send_sms('7208803933', customer_msg, 'POLBOS-SCHEDULER'); //Ashish
                    }
                } catch (e) {
                    console.log("create_edelweiss_health_feedfile", e);
                    res.json(e);
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }

    });

    app.get('/create_feedfile/kotakoem', function (req, res) {
        var UDID = (req.params['UDID']);
        try {
            var User_Data = require(appRoot + '/models/user_data');
            var start_date = new Date();
            var days = (req.query.hasOwnProperty('days')) ? req.query.days - 0 : 1;
            start_date.setDate(start_date.getDate() - days);
            start_date.setHours(00, 00, 00, 000);
            var end_date = new Date();
            end_date.setDate(end_date.getDate() + 0);
            end_date.setHours(00, 00, 00, 000);
            var Last_Status = 'TRANS_SUCCESS';
            User_Data.find({Insurer_Id: 48, Last_Status: new RegExp(Last_Status, 'i'), Product_Id: 10, Modified_On: {$gte: start_date, $lt: end_date}, "Transaction_Data.kotakoem_data": {$exists: true}}, {_id: 0}, function (err, emp_data) {
                try {
                    if (err)
                        throw err;
                    //res.json(emp_data);
                    var excel = require('excel4node');
                    var date = moment().subtract(1, "days").format('DD-MM-YYYY');
                    //START Feed File Code=========================================================================================
                    var ff_file_name = "KotakOEMMotor_FeedFile_" + date + "_RO_NB.csv";
                    var ff_loc_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                    var ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                    var ff_file_name_tp = "KotakOEMMotor_FeedFile_" + date + "_TP.csv";
                    var ff_loc_path_portal_tp = appRoot + "/tmp/pdf/" + ff_file_name_tp;
                    var ff_web_path_portal_tp = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name_tp;
                    var User_Data = require(appRoot + '/models/user_data');
                    if (parseInt(emp_data.length) > 0) {
                        var OccupationCode = {
                            "BUSINESS": "1",
                            "SALARIED": "2",
                            "PROFESSIONAL": "3",
                            "STUDENT": "4",
                            "HOUSEWIFE": "5",
                            "RETIRED": "6",
                            "OTHERS": "7"
                        };
                        var csvjson = require('csvjson');
                        var writeFile = require('fs').writeFile;
                        var fs = require('fs');
                        var data_list = [];
                        var data_list_tp = [];
                        for (var rowcount in emp_data) {
                            try {
                                var dbUserData = [];
                                dbUserData = emp_data[rowcount]._doc;
                                var Processed_Request = JSON.parse(dbUserData.Transaction_Data.kotakoem_data);
                                var Erp_Qt_Request_Core = dbUserData.Erp_Qt_Request_Core;
                                console.log(dbUserData.Erp_Qt_Request_Core['___crn___']);
                                var mdp_prm = (dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___']) - ((Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_invoice_price_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_consumable_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_consumable_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_personal_belonging_loss_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_personal_belonging_loss_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_key_lock_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_key_lock_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_road_assist_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_road_assist_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_ncb_protection_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_ncb_protection_cover___'] : 0));
                                dbUserData.Erp_Qt_Request_Core['___addon_mandatory_deduction_protect_cover___'] = mdp_prm > 0 ? "yes" : "no";
                                dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_mandatory_deduction_protect___'] = mdp_prm;
                                var policy_number = dbUserData.Transaction_Data.policy_number.toString();
                                var nominee_dob = dbUserData.Erp_Qt_Request_Core['___nominee_birth_date___'].split("-");
                                var PolicyTPTenure = 0;
                                var PolicyODTenure = 0;
                                var BreakinDay = 0;
                                if (Erp_Qt_Request_Core['___is_breakin___'] === "yes") {
                                    BreakinDay = 2;
                                }
                                if (parseInt(Erp_Qt_Request_Core['___policy_tp_tenure___']) > 1) {
                                    PolicyTPTenure = parseInt(Erp_Qt_Request_Core['___policy_tp_tenure___']) - 1;
                                }
                                if (parseInt(Erp_Qt_Request_Core['___policy_od_tenure___']) > 1) {
                                    PolicyODTenure = parseInt(Erp_Qt_Request_Core['___policy_od_tenure___']) - 1;
                                }
                                if (Erp_Qt_Request_Core['___vehicle_insurance_subtype___'].indexOf('0CH') > -1) {
                                    var data_csv = {
                                        "Unique ID": Erp_Qt_Request_Core['___crn___'],
                                        "Customer ID": "",
                                        "Customer Type": Processed_Request['___vehicle_registration_type___'],
                                        "Title": Erp_Qt_Request_Core['___salutation___'],
                                        "First Name": Erp_Qt_Request_Core['___first_name___'],
                                        "Middle Name": Erp_Qt_Request_Core['___middle_name___'],
                                        "Last Name": Erp_Qt_Request_Core['___last_name___'],
                                        "Company Name": "",
                                        "Contact Person": "",
                                        "Date of Birth (DD/MM/YYYY)": moment(Erp_Qt_Request_Core['___birth_date___']).format("DD/MM/YYYY"),
                                        "Email ID": Erp_Qt_Request_Core['___email___'],
                                        "Mobile": Erp_Qt_Request_Core['___mobile___'],
                                        "Gender": Erp_Qt_Request_Core['___gender___'] === "F" ? "Female" : "Male",
                                        "Marital Status": Erp_Qt_Request_Core['___marital_text___'],
                                        "Occupation": OccupationCode[Erp_Qt_Request_Core['___occupation___']],
                                        "Pan Card/ TAN Nos": Erp_Qt_Request_Core['___pan___'],
                                        "ID Proof": "3",
                                        "Proof ID Detail": "99999",
                                        "eIA Account Nos": "",
                                        "Kotak Group Employee": "",
                                        "Organization Name": "",
                                        "Employee Number": "",
                                        "Are you Kotak Group Customer": "",
                                        "Kotak Organization Name": "",
                                        "Kotak Group CRN": "",
                                        "Parent Customer ID": "",
                                        "Address Line 1": Erp_Qt_Request_Core['___communication_address_1___'],
                                        "Address Line 2": Erp_Qt_Request_Core['___communication_address_2___'],
                                        "Address Line 3": Erp_Qt_Request_Core['___communication_address_3___'],
                                        "Landmark": "",
                                        "pincode": Erp_Qt_Request_Core['___communication_pincode___'],
                                        "Bank Name": "",
                                        "Bank A/C No": "",
                                        "IFSC Code": "",
                                        "Business Type": "Liability Only",
                                        "Source Type": "Aggregator",
                                        "IMD_FU_Flag": "P",
                                        "IMD code": "3159270000",
                                        "FU code": "",
                                        "IMD location code": "0004",
                                        "Lead Generator": "",
                                        "Partner Application No": policy_number.toString(),
                                        "Partner Application Date": Processed_Request['___pg_reference_number_1___'],
                                        "Branch Inward Number": "",

                                        "Branch Inward Date": "",
                                        "Policy Term": Erp_Qt_Request_Core['___policy_tenure___'],
                                        "Policy Start Date": moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(BreakinDay)).format("DD/MM/YYYY"),
                                        "Policy Start Time": "00:00",
                                        "Policy Expiry Date": moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(BreakinDay)).add('years', parseInt(PolicyTPTenure)).format("DD/MM/YYYY"),
                                        "Policy Expiry Time": "23:59",
                                        "Service Tax Applicable": "No",
                                        "ST Exemption Reason": "",
                                        "NoPIP_Flag": Erp_Qt_Request_Core['___is_policy_exist___'] === "yes" ? "Yes" : "No", //Yes/No
                                        "PYP Type": "Comprehensive",
                                        "PYPPolicyNo": Erp_Qt_Request_Core['___previous_policy_number___'],
                                        "PYPInsurer": Processed_Request['___dbmaster_previousinsurer_code___'],
                                        "PYP Address": Processed_Request['___dbmaster_pb_previousinsurer_address___'],
                                        "PYP_Policy_Tenure": "Annual",
                                        "PYP_StartDate": Processed_Request['___pre_policy_start_date___'],
                                        "PYP_End_Date": Processed_Request['___policy_expiry_date___'],
                                        "Previous_NCB": Erp_Qt_Request_Core['___vehicle_ncb_current___'],
                                        "Total_Claim_Count": "No Claim",
                                        "RTO location": Erp_Qt_Request_Core['___registration_no_1___'] + Erp_Qt_Request_Core['___registration_no_2___'],
                                        "Make": Processed_Request['___dbmaster_insurer_vehicle_make_code___'].toString(),
                                        "Model": Processed_Request['___dbmaster_insurer_vehicle_model_code___'].toString(),
                                        "Variant": Processed_Request['___dbmaster_insurer_vehicle_variant_code___'].toString(),
                                        "Engine No": Erp_Qt_Request_Core['___engine_number___'].toString(),
                                        "Chassis No": Erp_Qt_Request_Core['___chassis_number___'].toString(),
                                        "Registration Number - Others": "",
                                        "RegistrationNos": Erp_Qt_Request_Core['___registration_no_1___'] + Erp_Qt_Request_Core['___registration_no_2___'] + Erp_Qt_Request_Core['___registration_no_3___'] + Erp_Qt_Request_Core['___registration_no_4___'],
                                        "Year of Manufacturer": Erp_Qt_Request_Core['___vehicle_manf_year___'],
                                        "Date of Registration/ Invoice": Processed_Request['___vehicle_registration_date___'],
                                        "External CNG/LPG kit (Yes/No)": "No",
                                        "Type of Policyholder": "Individual Owner",
                                        "Special Condtion": "",
                                        "Main Driver": "Self - Owner Driver",
                                        "InsuredhasDrivingLicense": "Yes",
                                        "Driver_First_Name": "",
                                        "Driver_Last_Name": "",
                                        "Driver_Age": "",
                                        "PA to OD": (Erp_Qt_Request_Core['___is_pa_od___'] === "yes" && Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'] > 0) ? "Yes" : "No",
                                        "NomineeName": Erp_Qt_Request_Core['___nominee_name___'],
                                        "NomineeDOB(DD/MM/YYYY)": nominee_dob[2] + '/' + nominee_dob[1] + '/' + nominee_dob[0],
                                        "Relationship": Erp_Qt_Request_Core['___nominee_relation___'] === "Aunt" ? "Aunty" : Erp_Qt_Request_Core['___nominee_relation___'],
                                        "PAOwnDriverAppointeeName": "",
                                        "PAOwnDriverAppointeeRelation": "",
                                        "LL_NoOfPaidDriver": "",
                                        "LL_NoPaidDriver_Employee": "",
                                        "PAtoUnnamed_Pillion_SI_Per Person_IMT_18": "",
                                        "NoOfUnname_Pillion": "",
                                        "PAtoPaidDriver_SI_Per_Person": "",
                                        "NoofPaidDriver_PA": "",
                                        "PAtoUnnmaed_Persons_IMT_16": "",
                                        "NoofUnnamed_persons": "",
                                        "IsBangladeshCovered": "",
                                        "IsBhutanCovered": "",
                                        "IsMaldivesCovered": "",
                                        "IsNepalCovered": "",
                                        "IsPakistanCovered": "",
                                        "IsSriLankaCovered": "",
                                        "ExtTPPD": (Erp_Qt_Request_Core['___is_tppd___'] === "yes" && Erp_Qt_Request_Core['___premium_breakup_tp_cover_tppd___'] > 0) ? "Yes" : "No",
                                        "Financier_Name": Erp_Qt_Request_Core['___financial_institute_name___'],
                                        "Financier_Agreement_Type": Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : Erp_Qt_Request_Core['___financial_agreement_type___'],
                                        "Financier Address": Erp_Qt_Request_Core['___financial_institute_city___'],
                                        "Loan Account Nos": "",
                                        "File Nos": "",
                                        "TotalTPPremium": Erp_Qt_Request_Core['___premium_breakup_tp_final_premium___'].toString(),
                                        "Net Premium": Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString(),
                                        "Service Tax/ Sales Tax": Erp_Qt_Request_Core['___premium_breakup_service_tax___'].toString(),
                                        "Total Premium": Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                                        "Pre inspection Number": "",
                                        "Preinspection Date & time": "",
                                        "Inspection Agency": "",
                                        "Preinspection Status": "",
                                        "Receipt number": "",
                                        "Mode of Entry": "",
                                        "Payment Mode": "Payment Aggregator",
                                        "Payer Type": "Customer",
                                        "Customer ID (Parent)": "",
                                        "Intermediary ID (Parent)": "",
                                        "Receipt Relationship": "",
                                        "Receipt Amount": Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                                        "Is GBM Receipt?": "No",
                                        "GBM Reference NO": "",
                                        "Cheque Number/Transaction Reference No/DD No": Processed_Request['___pg_reference_number_2___'],
                                        "Cheque Date/DD/Transaction Date": Processed_Request['___pg_reference_number_1___'],
                                        "Merchant ID": "",
                                        "Receipt IFSC Code": "",
                                        "Receipt Bank Name": "",
                                        "Bank Location": "",
                                        "Branch Name": "",
                                        "Cheque Type": "",
                                        "House Bank": "",
                                        "CD No": "",
                                        "GST Number": "",
                                        "PRODUCT_TYPE": Processed_Request['___vehicle_insurance_subtype_2___'],
                                        "PA_OD_TENURE": ""//Erp_Qt_Request_Core['___vehicle_insurance_type___'].toString() === "new" ? "1" : Erp_Qt_Request_Core['___policy_tp_tenure___'].toString()
                                    };
                                    data_list_tp.push(data_csv);
                                } else {
                                    var data_csv = {
                                        "Unique ID": Erp_Qt_Request_Core['___crn___'],
                                        "Customer ID": "",
                                        "Customer Type": Processed_Request['___vehicle_registration_type___'],
                                        "Title": Erp_Qt_Request_Core['___salutation___'],
                                        "First Name": Erp_Qt_Request_Core['___first_name___'],
                                        "Middle Name": Erp_Qt_Request_Core['___middle_name___'],
                                        "Last Name": Erp_Qt_Request_Core['___last_name___'],
                                        "Company Name": "",
                                        "Contact Person": "",
                                        "Date of Birth (DD/MM/YYYY)": moment(Erp_Qt_Request_Core['___birth_date___']).format("DD/MM/YYYY"),
                                        "Email ID": Erp_Qt_Request_Core['___email___'],
                                        "Mobile": Erp_Qt_Request_Core['___mobile___'],
                                        "Gender": Erp_Qt_Request_Core['___gender___'] === "F" ? "Female" : "Male",
                                        "Marital Status": Erp_Qt_Request_Core['___marital_text___'],
                                        "Occupation": OccupationCode[Erp_Qt_Request_Core['___occupation___']],
                                        "Pan Card/ TAN Nos": Erp_Qt_Request_Core['___pan___'],
                                        "ID Proof": "3",
                                        "Proof ID Detail": "999999",
                                        "eIA Account Nos": "",
                                        "Kotak Group Employee": "",
                                        "Organization Name": "",
                                        "Employee Number": "",
                                        "Are you Kotak Group Customer": "",
                                        "Kotak Organization Name": "",
                                        "Kotak Group CRN": "",
                                        "Parent Customer ID": "",
                                        "Address Line 1": Erp_Qt_Request_Core['___communication_address_1___'],
                                        "Address Line 2": Erp_Qt_Request_Core['___communication_address_2___'],
                                        "Address Line 3": Erp_Qt_Request_Core['___communication_address_3___'],
                                        "Landmark": "",
                                        "pincode": Erp_Qt_Request_Core['___communication_pincode___'],
                                        "Bank Name": "",
                                        "Bank A/C No": "",
                                        "IFSC Code": "",
                                        "Business Type": Processed_Request['___vehicle_insurance_type___'],
                                        "Source Type": "Aggregator",
                                        "IMD_FU_Flag": "P",
                                        "IMD code": "3159270000",
                                        "FU code": "",
                                        "IMD location code": "0004",
                                        "Lead Generator": "",
                                        "Partner Application No": policy_number,
                                        "Partner Application Date": Processed_Request['___pg_reference_number_1___'],
                                        "Branch Inward Number": "",
                                        "Branch Inward Date": "",
                                        "Policy Term": Erp_Qt_Request_Core['___policy_tenure___'],
                                        "Policy Start Date": moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(BreakinDay)).format("DD/MM/YYYY"),
                                        "Policy Start Time": "00:00",
                                        "Policy Expiry Date": moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(BreakinDay)).add('years', parseInt(PolicyTPTenure)).format("DD/MM/YYYY"),
                                        "Policy Expiry Time": "23:59",
                                        "Service Tax Applicable": "No",
                                        "ST Exemption Reason": "",
                                        "NoPIP_Flag": Erp_Qt_Request_Core['___is_policy_exist___'] === "yes" ? "Yes" : "No", //Yes/No
                                        "PYP Type": "Comprehensive",
                                        "PYPPolicyNo": Erp_Qt_Request_Core['___previous_policy_number___'],
                                        "PYPInsurer": Processed_Request['___dbmaster_previousinsurer_code___'],
                                        "PYP Address": Processed_Request['___dbmaster_pb_previousinsurer_address___'],
                                        "PYP_Policy_Tenure": "Annual",
                                        "PYP_StartDate": Processed_Request['___pre_policy_start_date___'],
                                        "PYP_End_Date": Processed_Request['___policy_expiry_date___'],
                                        "NCB Flag (Y_N)": Erp_Qt_Request_Core['___is_claim_exists___'] === "yes" ? "No" : "Yes", //Yes/No
                                        "Previous_NCB": Erp_Qt_Request_Core['___vehicle_ncb_current___'],
                                        "Total_Claim_Count": "No Claim",
                                        "Claim Free Years": "",
                                        "RTO location": Erp_Qt_Request_Core['___registration_no_1___'] + Erp_Qt_Request_Core['___registration_no_2___'],
                                        "Make": Processed_Request['___dbmaster_insurer_vehicle_make_code___'].toString(),
                                        "Model": Processed_Request['___dbmaster_insurer_vehicle_model_code___'].toString(),
                                        "Variant": Processed_Request['___dbmaster_insurer_vehicle_variant_code___'].toString(),
                                        "Engine No": Erp_Qt_Request_Core['___engine_number___'].toString(),
                                        "Chassis No": Erp_Qt_Request_Core['___chassis_number___'].toString(),
                                        "Registration Number - Others": "",
                                        "RegistrationNos": Erp_Qt_Request_Core['___registration_no_1___'] + Erp_Qt_Request_Core['___registration_no_2___'] + Erp_Qt_Request_Core['___registration_no_3___'] + Erp_Qt_Request_Core['___registration_no_4___'],
                                        "Year of Manufacturer": Erp_Qt_Request_Core['___vehicle_manf_year___'],
                                        "Date of Registration/ Invoice": Processed_Request['___vehicle_registration_date___'],
                                        "First_Veh_IDV": Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString(),
                                        "ElectricAccIDV": Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "" : Erp_Qt_Request_Core['___electrical_accessory___'].toString(),
                                        "NonElectricAccIDV": Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "" : Erp_Qt_Request_Core['___non_electrical_accessory___'].toString(),
                                        "CNG/LPG kit Value": Erp_Qt_Request_Core['___external_bifuel_value___'].toString() === "0" ? "" : Erp_Qt_Request_Core['___external_bifuel_value___'].toString(),
                                        "Loss of Accessories": "",
                                        "Type_Of_Policy_holder": "Individual Owner",
                                        "Cross_Sell_Discount": "",
                                        "Policy_No_Cross_Sell": "",
                                        "Credit_Scrore": "",
                                        "Market Movement": "0",
                                        "Return to Invoice": Erp_Qt_Request_Core['___addon_invoice_price_cover___'],
                                        "Depreciation Cover": Erp_Qt_Request_Core['___addon_zero_dep_cover___'],
                                        "Engine Protect": Erp_Qt_Request_Core['___addon_engine_protector_cover___'],
                                        "Consumable Cover": Erp_Qt_Request_Core['___addon_consumable_cover___'],
                                        "IsAntiTheftAttached": "",
                                        "Discount for Opting Soft Copy": "",
                                        "Voluntary_Deductible_Policy": "",
                                        "Voluntary_Deductible_Dep_Waiver": "",
                                        "Special Condtion": "",
                                        "Main Driver": "Self - Owner Driver",
                                        "InsuredhasDrivingLicense": "Yes",
                                        "Driver_First_Name": "NA",
                                        "Driver_Last_Name": "",
                                        "Driver_Age": "NA",
                                        "PA to OD": (Erp_Qt_Request_Core['___is_pa_od___'] === "yes" && Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'] > 0) ? "Yes" : "No",
                                        "NomineeName": Erp_Qt_Request_Core['___nominee_name___'],
                                        "NomineeDOB(DD/MM/YYYY)": nominee_dob[2] + '/' + nominee_dob[1] + '/' + nominee_dob[0],
                                        "Relationship": Erp_Qt_Request_Core['___nominee_relation___'] === "Aunt" ? "Aunty" : Erp_Qt_Request_Core['___nominee_relation___'],
                                        "PAOwnDriverAppointeeName": "",
                                        "PAOwnDriverAppointeeRelation": "",
                                        "LL_NoOfPaidDriver": "",
                                        "LL_NoPaidDriver_Employee": "",
                                        "PAtoUnnamed_Pillion_SI_Per Person": "",
                                        "NoOfUnnamed": "",
                                        "PAtoPaidDriver_SI_Per_Person": "",
                                        "NoofPaidDriver_PA": "",
                                        "LL_NoOfPersons": "",
                                        "LL_NoOfPersons_SI_Per_Person": "",
                                        "IsBangladeshCovered": "",
                                        "IsBhutanCovered": "",
                                        "IsMaldivesCovered": "",
                                        "IsNepalCovered": "",
                                        "IsPakistanCovered": "",
                                        "IsSriLankaCovered": "",
                                        "ExtTPPD": (Erp_Qt_Request_Core['___is_tppd___'] === "yes" && Erp_Qt_Request_Core['___premium_breakup_tp_cover_tppd___'] > 0) ? "Yes" : "No",
                                        "Financier_Name": Erp_Qt_Request_Core['___financial_institute_name___'],
                                        "Financier_Agreement_Type": Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : Erp_Qt_Request_Core['___financial_agreement_type___'],
                                        "Financier Address": Erp_Qt_Request_Core['___financial_institute_city___'],
                                        "Loan Account Nos": "",
                                        "File Nos": "",
                                        "TotalODPremium": (Erp_Qt_Request_Core['___premium_breakup_od_final_premium___'] + Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___']).toString(),
                                        "TotalTPPremium": Erp_Qt_Request_Core['___premium_breakup_tp_final_premium___'].toString(),
                                        "Net Premium": Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString(),
                                        "Service Tax/ Sales Tax": Erp_Qt_Request_Core['___premium_breakup_service_tax___'].toString(),
                                        "Total Premium": Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                                        "Pre inspection Number": "",
                                        "Preinspection Date & time": "",
                                        "Inspection Agency": "",
                                        "Preinspection Status": "",
                                        "Receipt number": "",
                                        "Mode of Entry": "",
                                        "Payment Mode": "Payment Aggregator",
                                        "Payer Type": "Customer",
                                        "Customer ID (Parent)": "",
                                        "Intermediary ID (Parent)": "",
                                        "Receipt Relationship": "",
                                        "Receipt Amount": Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                                        "Is GBM Receipt?": "NO",
                                        "GBM Reference NO": "",
                                        "Cheque Number/Transaction Reference No/DD No": Processed_Request['___pg_reference_number_2___'],
                                        "Cheque Date/DD/Transaction Date": Processed_Request['___pg_reference_number_1___'],
                                        "Merchant ID": "",
                                        "Receipt IFSC Code": "",
                                        "Receipt Bank Name": "",
                                        "Bank Location": "",
                                        "Branch Name": "",
                                        "Cheque Type": "",
                                        "House Bank": "",
                                        "GSTIN": "",
                                        "PA_OD_TENURE": "", //Erp_Qt_Request_Core['___vehicle_insurance_type___'].toString() === "new" ? "1" : Erp_Qt_Request_Core['___policy_tp_tenure___'].toString(),
                                        "PRODUCT_TYPE": Processed_Request['___vehicle_insurance_subtype_2___']
                                    };
                                    data_list.push(data_csv);
                                }
                            } catch (e) {
                                console.log("create_edelweiss_feedfile", e.message);
                                res.json({'msg': 'error-' + e.message});
                            }
                        }
                        if (data_list.length > 0) {
                            var txs = JSON.parse(JSON.stringify(data_list));
                            finalTxs = [];
                            for (let i = 0; i <= data_list.length; i++) {
                                finalTxs.push(data_list[i]);
                            }
                            const csvData = csvjson.toCSV(finalTxs, {
                                headers: 'key'
                            });
                            writeFile(ff_loc_path_portal, csvData, (err) => {
                                if (err) {
                                    console.log(err); // Do something to handle the error or just throw it
                                }
                                console.log('Success!');
                            });
                            //res.json({'msg': 'Success'});
                            var Email = require('../models/email');
                            var objModelEmail = new Email();
                            var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy KotakOEM TW Feed File - New Business/Rollover Dated:' + date;
                            email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File for ' + data_list.length + ' KOTAK TW Policy. Share status of each policy. Please confirm if these policies are enroll in Kotak system.</p>'
                                    + '<BR><p>Feed-File Dated: ' + date + '</p><BR><p>Feed-File URL : ' + ff_web_path_portal + ' </p></body></html>';
                            var arrTo = ['narayan.tilve@Kotak.com', 'prathmesh.hode@Kotak.com', 'nikita.naik@Kotak.com','vinaykumar.yadav@Kotak.com'];
                            var arrCc = ['abhijeet.pendharkar@Kotak.com', 'atish.sonawane@Kotak.com', 'pranab.chavan@kotak.com', 'Jayesh.Kerkar@kotak.com', 'rohan.talla@Kotak.com', 'gaurav.dhuri@Kotak.com'];
                            var arrBcc = [config.environment.notification_email, 'ashish.hatia@policyboss.com', 'anuj.singh@policyboss.com', 'vikram.jena@policyboss.com'];
                            if (config.environment.name === 'Production') {
                                if (req.query.hasOwnProperty('dbg') && req.query['dbg'] == 'yes') {
                                    objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_body, 'techsupport@policyboss.com', '', ''); //UAT
                                } else {
                                    objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, arrCc.join(','), arrBcc.join(','), '');
                                }
                            }
                            var SmsLog = require('../models/sms_log');
                            var objSmsLog = new SmsLog();
                            var customer_msg = "HORIZON-FEEDfILE-SCHEDULER\n\---------------\n\ Hi ,\n\KotakOEM TW RO_NB FeedFile Dated : " + moment().subtract(1, "days").format('DD-MM-YYYY') + ".\n\Successfully Generated.\n\No. of Policy: " + data_list.length;
                            objSmsLog.send_sms('9768463482', customer_msg, 'POLBOS-SCHEDULER'); //Vikram
                            objSmsLog.send_sms('9619160851', customer_msg, 'POLBOS-SCHEDULER'); //Anuj
                            objSmsLog.send_sms('7208803933', customer_msg, 'POLBOS-SCHEDULER'); //Ashish
                        }
                        if (data_list_tp.length > 0) {
                            var txs = JSON.parse(JSON.stringify(data_list_tp));
                            finalTxs = [];
                            for (let i = 0; i <= data_list_tp.length; i++) {
                                finalTxs.push(data_list_tp[i]);
                            }
                            const csvData = csvjson.toCSV(finalTxs, {
                                headers: 'key'
                            });
                            writeFile(ff_loc_path_portal_tp, csvData, (err) => {
                                if (err) {
                                    console.log(err); // Do something to handle the error or just throw it
                                }
                                console.log('Success!');
                            });
                            //res.json({'msg': 'Success'});
                            var Email = require('../models/email');
                            var objModelEmail = new Email();
                            var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy KotakOEM TW Feed File - TP  Dated:' + date;
                            email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File for ' + data_list_tp.length + ' KOTAK TW Policy. Share status of each policy. Please confirm if these policies are enroll in Kotak system.</p>'
                                    + '<BR><p>Feed-File Dated: ' + date + '</p><BR><p>Feed-File URL : ' + ff_web_path_portal_tp + ' </p></body></html>';
                            var arrTo = ['narayan.tilve@Kotak.com', 'prathmesh.hode@Kotak.com', 'nikita.naik@Kotak.com','vinaykumar.yadav@Kotak.com'];
                            var arrCc = ['abhijeet.pendharkar@Kotak.com', 'atish.sonawane@Kotak.com', 'pranab.chavan@kotak.com', 'Jayesh.Kerkar@kotak.com', 'rohan.talla@Kotak.com', 'gaurav.dhuri@Kotak.com'];
                            var arrBcc = [config.environment.notification_email, 'ashish.hatia@policyboss.com', 'anuj.singh@policyboss.com', 'vikram.jena@policyboss.com'];
                            if (config.environment.name === 'Production') {
                                if (req.query.hasOwnProperty('dbg') && req.query['dbg'] == 'yes') {
                                    objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_body, 'techsupport@policyboss.com', '', ''); //UAT
                                } else {
                                    objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, arrCc.join(','), arrBcc.join(','), '');
                                }
                            }
                            var SmsLog = require('../models/sms_log');
                            var objSmsLog = new SmsLog();
                            var customer_msg = "HORIZON-FEEDfILE-SCHEDULER\n\---------------\n\ Hi ,\n\KotakOEM TW TP FeedFile Dated : " + moment().subtract(1, "days").format('DD-MM-YYYY') + ".\n\Successfully Generated.\n\No. of Policy: " + data_list_tp.length;
                            objSmsLog.send_sms('9768463482', customer_msg, 'POLBOS-SCHEDULER'); //Vikram
                            objSmsLog.send_sms('9619160851', customer_msg, 'POLBOS-SCHEDULER'); //Anuj
                            objSmsLog.send_sms('7208803933', customer_msg, 'POLBOS-SCHEDULER'); //Ashish
                        }
                        res.json({'msg': 'Success'});
                    } else {
                        res.json({'msg': 'No Data Avilable'});
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy KotakOEM TW Feed File -  Dated:' + date;
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File of KOTAK TW Policy. Share status of each policy. Please confirm if these policies are enroll in Kotak system.</p>'
                                + '<BR><p>Feed-File Dated: ' + date + '</p><BR><p>No Data Avilable </p></body></html>';
                        //var arrTo = ['Krishna.Parab@edelweissfin.com', 'Rohit.Bhosle@edelweissfin.com', 'Shrinath.Pandey@edelweissfin.com'];
                        var arrBcc = [config.environment.notification_email, 'ashish.hatia@policyboss.com', 'anuj.singh@policyboss.com', 'vikram.jena@policyboss.com'];
                        if (config.environment.name === 'Production') {
                            if (req.query.hasOwnProperty('dbg') && req.query['dbg'] == 'yes') {
                                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_body, '', '', ''); //UAT
                            } else {
                                objModelEmail.send('notifications@policyboss.com', arrBcc.join(','), sub, email_body, '', '', ''); //UAT
                            }
                        }
                        var SmsLog = require('../models/sms_log');
                        var objSmsLog = new SmsLog();
                        var customer_msg = "HORIZON-FEEDfILE-SCHEDULER\n\---------------\n\ Hi ,\n\KotakOEM TW FeedFile Dated : " + moment().subtract(1, "days").format('DD-MM-YYYY') + ".\n\No Data Avilable.";
                        objSmsLog.send_sms('9768463482', customer_msg, 'POLBOS-SCHEDULER'); //Vikram
                        objSmsLog.send_sms('9619160851', customer_msg, 'POLBOS-SCHEDULER'); //Anuj
                        objSmsLog.send_sms('7208803933', customer_msg, 'POLBOS-SCHEDULER'); //Ashish
                    }
                } catch (e) {
                    console.log("create_edelweiss_feedfile", e);
                    res.json(e);
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }

    });

    app.get('/create_feedfile/sbigeneral', function (req, res) {
        var UDID = (req.params['UDID']);
        try {
            var User_Data = require(appRoot + '/models/user_data');
            var start_date = new Date();
            var days = (req.query.hasOwnProperty('days')) ? req.query.days - 0 : 1;
            start_date.setDate(start_date.getDate() - days);
            start_date.setHours(00, 00, 00, 000);
            var end_date = new Date();
            end_date.setDate(end_date.getDate() + 0);
            end_date.setHours(00, 00, 00, 000);
            var Last_Status = 'TRANS_SUCCESS';
            User_Data.find({Insurer_Id: 17, Last_Status: new RegExp(Last_Status, 'i'), Product_Id: 10, Modified_On: {$gte: start_date, $lt: end_date}, "Transaction_Data.sbigeneral_data": {$exists: true}}, {_id: 0}, function (err, emp_data) {
                try {
                    if (err)
                        throw err;
                    //res.json(emp_data);
                    var excel = require('excel4node');
                    var date = moment().subtract(1, "days").format('DD-MM-YYYY');
                    //START Feed File Code=========================================================================================
                    var ff_file_name = "SBIGeneralMotor_FeedFile_" + date + ".csv";
                    var ff_loc_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                    var ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                    var User_Data = require(appRoot + '/models/user_data');
                    if (parseInt(emp_data.length) > 0) {
                        var OccupationCode = {
                            "BUSINESS": "1",
                            "SALARIED": "2",
                            "PROFESSIONAL": "3",
                            "STUDENT": "4",
                            "HOUSEWIFE": "5",
                            "RETIRED": "6",
                            "OTHERS": "7"
                        };
                        var csvjson = require('csvjson');
                        var writeFile = require('fs').writeFile;
                        var fs = require('fs');
                        var data_list = [];
                        var obj_inscovertype = {
                            "0CH_1TP": "L",
                            "0CH_5TP": "L",
                            "1OD_0TP": "O",
                            "2CH_0TP": "P",
                            "3CH_0TP": "P",
                            "1CH_4TP": "P",
                            "1CH_0TP": "P"
                        };
                        for (var rowcount in emp_data) {
                            try {
                                var dbUserData = [];
                                dbUserData = emp_data[rowcount]._doc;
                                var Processed_Request = JSON.parse(dbUserData.Transaction_Data.sbigeneral_data);
                                var Erp_Qt_Request_Core = dbUserData.Erp_Qt_Request_Core;
                                console.log(dbUserData.Erp_Qt_Request_Core['___crn___']);
                                var mdp_prm = (dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___']) - ((Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_invoice_price_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_consumable_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_consumable_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_personal_belonging_loss_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_personal_belonging_loss_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_key_lock_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_key_lock_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_road_assist_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_road_assist_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_ncb_protection_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_ncb_protection_cover___'] : 0));
                                dbUserData.Erp_Qt_Request_Core['___addon_mandatory_deduction_protect_cover___'] = mdp_prm > 0 ? "yes" : "no";
                                dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_mandatory_deduction_protect___'] = mdp_prm;
                                console.log('SBIG - ' + dbUserData.Erp_Qt_Request_Core['___crn___']);
                                var policy_number = dbUserData.Transaction_Data.policy_number.toString();
                                var nominee_dob = dbUserData.Erp_Qt_Request_Core['___nominee_birth_date___'].split("-");
                                var PolicyTPTenure = 0;
                                var PolicyODTenure = 0;
                                var breakin_day = 0;
                                if (Erp_Qt_Request_Core['___is_breakin___'] === "yes") {
                                    breakin_day = 1;
                                }
                                if (parseInt(Erp_Qt_Request_Core['___policy_tp_tenure___']) > 1) {
                                    PolicyTPTenure = parseInt(Erp_Qt_Request_Core['___policy_tp_tenure___']) - 1;
                                }
                                if (parseInt(Erp_Qt_Request_Core['___policy_od_tenure___']) > 1) {
                                    PolicyODTenure = parseInt(Erp_Qt_Request_Core['___policy_od_tenure___']) - 1;
                                }
                                let rzp_transfer_id = "";
                                let rzp_pay_dt = "";
                                let ff_pay_id = "";
                                try {
                                    dbUserData.Transaction_Data.pg_reference_number_1 = '';
                                    if (dbUserData.Transaction_Data && dbUserData.Transaction_Data.pg_reference_number_1) {
                                        rzp_pay_dt = dbUserData.Transaction_Data['pg_reference_number_1'];
                                    } else {
                                           rzp_pay_dt = moment(dbUserData.Processed_Request['___current_date___'], 'DD/MM/YYYY').format('DD-MM-YYYY');
                                           if(config.environment.name === 'Development'){
                                              var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy SBIGENERAL Feed File Dated:' + date;
                                              email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File for ' + emp_data.length + ' SBIGENERAL TW Policy. Share status of each policy. Please confirm if these policies are enroll in SBI system.</p>'
                                                       + '<BR><p>Feed-File Dated: ' + date + '</p><BR><p>Feed-File URL : ' + ff_web_path_portal + ' </p></body></html>';
                                               var arrTo = ['somanshu.singh@policyboss.com', 'roshani.prajapati@policyboss.com', 'ravi.pandey@policyboss.com'];
                                               var Email = require('../../models/email');
                                               var objModelEmail = new Email();
                                               objModelEmail.send('notifications@policyboss.comm', 'ravi.pandey@policyboss.com', sub, email_body, config.environment.notification_email, '', '');
                                               console.log('mail sent');
                                            }
                                            if (config.environment.name === 'Production') {
                                      
                                            }                                        
                                    }
                                    if (dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay") {
                                        rzp_transfer_id = dbUserData.Payment_Request.pg_data['transfer_id'];
                                        ff_pay_id = dbUserData.Payment_Response.pg_get && dbUserData.Payment_Response.pg_get['PayId'].toString();
                                    } else if (dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") {
                                        if (dbUserData.Transaction_Data) {
                                            rzp_transfer_id = dbUserData.Transaction_Data['pg_reference_number_3'];
                                            ff_pay_id = dbUserData.Transaction_Data.transaction_id;
                                        } else {
                                            //rzp_transfer_id = (dbUserData.Verification_Request && dbUserData.Verification_Request.hasOwnProperty('pg_post') && dbUserData.Verification_Request.pg_post) ? dbUserData.Verification_Request.pg_post['transfer_id'] : dbUserData.Transaction_Data['pg_reference_number_3'];
                                            rzp_transfer_id = dbUserData.Payment_Response.pg_post && dbUserData.Payment_Response.pg_post['transfer_id'];
                                            rzp_pay_dt = moment(dbUserData.Processed_Request['___current_date___'], 'DD/MM/YYYY').format('DD-MM-YYYY');
                                            ff_pay_id = dbUserData.Payment_Response.pg_post && dbUserData.Payment_Response.pg_post['txnid']; // pay_id
                                        }
                                        //ff_pay_id = dbUserData.Transaction_Data.transaction_id;
                                    } else {
                                        rzp_transfer_id = dbUserData.Transaction_Data.transaction_id.toString();
                                        rzp_pay_dt = Processed_Request['___pg_reference_number_1___'];
                                        ff_pay_id = dbUserData.Transaction_Data.transaction_id;
                                    }
                                } catch (e) {
                                    console.error("Exception sbi feedfile contoller : " + e.stack);
                                }
                                var data_csv = {
                                    "Sr No.": (rowcount - 0) + 1,
                                    "POLICY_NO": policy_number,
                                    "LEADBY": "A", //Dealer/Agent
                                    "INSCOVERTYPE": obj_inscovertype[dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___']], //Standalone/ Package policy (OD only or Comprehensive policy) O- OD only Policy and P - Stands for Package Policy
                                    "INSPOLICYTYPE": Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "new" ? "N" : "R",
//                                    "PROPOSALCREATEDDATE": ((dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay") || dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") ? dbUserData.Transaction_Data['pg_reference_number_1'] : Processed_Request['___pg_reference_number_1___'],
                                    "PROPOSALCREATEDDATE": rzp_pay_dt,
                                    "PROPOSALCREATEDTIME": "",
//                                    "TRANSACTIONID": dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay" ? (dbUserData.Payment_Response.pg_get && dbUserData.Payment_Response.pg_get['PayId'].toString()) : dbUserData.Transaction_Data.transaction_id,
                                    "TRANSACTIONID": ff_pay_id,
                                    "VISOFNUMBER": "",
                                    "INSPOLICYISSUINGDEALERCODE": (Processed_Request['___dbmaster_insurer_rto_district_name___'] ? Processed_Request['___dbmaster_insurer_rto_district_name___']: '120667'),
                                    "INSPOLICYEFFECTIVEDATE": moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(breakin_day)).format("YYYY-MM-DD"),
                                    "INSPOLICYEFFECTIVETIME": "00:00:01",
                                    "INSPOLICYEXPIRYDATE": (moment(Erp_Qt_Request_Core['___policy_start_date___'], "YYYY-MM-DD").add('years', (Erp_Qt_Request_Core['___policy_tp_tenure___'] - 0)).subtract(1, "days")).add('days', parseInt(breakin_day)).format("YYYY-MM-DD"),
                                    "PROPOSERTYPE": "I",
                                    "SALUTATION": Erp_Qt_Request_Core['___salutation___'],
                                    "FIRSTNAME": Erp_Qt_Request_Core['___first_name___'],
                                    "MIDDLENAME": Erp_Qt_Request_Core['___middle_name___'],
                                    "LASTNAME": Erp_Qt_Request_Core['___last_name___'],
                                    "COMPANYNAME": "",
                                    "GENDER": Erp_Qt_Request_Core['___gender___'],
                                    "DATEOFBIRTH": moment(Erp_Qt_Request_Core['___birth_date___']).format("YYYY-MM-DD"),
                                    "ADDRESS1": Erp_Qt_Request_Core['___communication_address_1___'],
                                    "ADDRESS2": Erp_Qt_Request_Core['___communication_address_2___'],
                                    "ADDRESS3": Erp_Qt_Request_Core['___communication_address_3___'],
                                    "CITYCODE": Erp_Qt_Request_Core['___communication_city_code___'],
                                    "STATECODE": Erp_Qt_Request_Core['___communication_state___'],
                                    "PINCODE": Erp_Qt_Request_Core['___communication_pincode___'],
                                    "EMAIL": Erp_Qt_Request_Core['___email___'],
                                    "PROPOSERPAN": Erp_Qt_Request_Core['___pan___'],
                                    "PAOWNDRIVERNOMNAME": Erp_Qt_Request_Core['___nominee_name___'],
                                    "PAOWNDRIVERNOMGENDER": "",
                                    "PAOWNDRIVERNOMAGE": Erp_Qt_Request_Core['___nominee_age___'],
                                    "PAOWNDRIVERNOMRELEATION": Erp_Qt_Request_Core['___nominee_relation___'],
                                    "PAOWNDRIVERAPPOINTEENAME": "",
                                    "PAOWNDRIVERAPPOINTEERELATION": "",
                                    "VEHICLECLASS": "P",
                                    "VEHICLETYPE": "TWP",
                                    "VEHICLESUBCLASS": "",
                                    "CVMISCTYPE": "",
                                    "CARRIERTYPE": "",
                                    "GVW": 0,
                                    "CARRYINGCAPACITY": Processed_Request['___dbmaster_insurer_vehicle_seatingcapacity___'],
                                    "TARIFFPAXRANGE": "",
                                    "VEHICLEINVOICEDATE": Erp_Qt_Request_Core['___vehicle_registration_date___'],
                                    "MAKE": Processed_Request['___dbmaster_insurer_vehicle_make_name___'],
                                    "MODELCODE": Processed_Request['___dbmaster_insurer_vehicle_model_code___'],
                                    "VARIANTCODE": Processed_Request['___dbmaster_insurer_vehicle_variant_code___'],
                                    "ENGINENO": "'" + Erp_Qt_Request_Core['___engine_number___'].toString(),
                                    "CHASSISNO": "'" + Erp_Qt_Request_Core['___chassis_number___'].toString(),
                                    "CC": Processed_Request['___dbmaster_pb_cubic_capacity___'],
                                    "NOOFTRAILERS": 0,
                                    "TRAILERCHASSISNO": "",
                                    "TRAILERREGISTRATIONNO": "",
                                    "YEAROFMANUFACTURE": Erp_Qt_Request_Core['___vehicle_manf_year___'],
                                    "REGISTRATIONDATE": Erp_Qt_Request_Core['___vehicle_registration_date___'],
                                    "REGISTRATIONNO": Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "new" ? "" : Erp_Qt_Request_Core['___registration_no___'],
                                    "RTOCODE": Erp_Qt_Request_Core['___rto_id___'].toString(),
                                    "ISBANGLADESHCOVERED": 0,
                                    "ISBHUTANCOVERED": 0,
                                    "ISMALDIVESCOVERED": 0,
                                    "ISNEPALCOVERED": 0,
                                    "ISPAKISTANCOVERED": 0,
                                    "ISSRILANKACOVERED": 0,
                                    "GEOGRAPHICEXTNPREMIUM": 0,
                                    "GEOGRAPHICEXTNTPPREMIUM": 0,
                                    "FINANCERCODE": Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "0" : Erp_Qt_Request_Core['___financial_institute_code___'],
                                    "FINANCERBRANCH": Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : Erp_Qt_Request_Core['___financial_institute_city___'],
                                    "AGGREMENTTYPE": Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : Erp_Qt_Request_Core['___financial_agreement_type___'],
                                    "COMPDEDUCTIBLES": 100,
                                    "EXSHOWROOMPRICE": Processed_Request['___dbmaster_insurer_vehicle_exshowroom___'].toString(),
                                    "VEHICLEIDV": Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString(),
                                    "BODYIDV": 0,
                                    "TRAILERIDV": 0,
                                    "TOTALIDV": Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString(),
                                    "PREMIUMCALCULATEDBY": "I",
                                    "VEHICLEPREMIUM": (Erp_Qt_Request_Core['___premium_breakup_od_basic___'] - Erp_Qt_Request_Core['___premium_breakup_od_disc___']).toString(),
                                    "ODDISCPER": 0, //yet to check
                                    "TRAILERPREMIUM": 0,
                                    "NONELECTRICACCIDV": Erp_Qt_Request_Core['___non_electrical_accessory___'].toString(),
                                    "NONELECTRICACCPREMIUM": Erp_Qt_Request_Core['___premium_breakup_od_non_elect_access___'].toString(),
                                    "ELECTRICACCIDV": Erp_Qt_Request_Core['___electrical_accessory___'].toString(),
                                    "ELECTRICACCPREMIUM": Erp_Qt_Request_Core['___premium_breakup_od_elect_access___'].toString(),
                                    "BIFUELKITVALUE": 0,
                                    "BIFUELKITIDV": 0,
                                    "BIFUELTPPREMIUM": 0,
                                    "BIFUELKITPREMIUM": 0,
                                    "IMT23PREMIUM": 0,
                                    "IMT34PREMIUM": 0,
                                    "OVERTURNCOVER": 0,
                                    "IMT33PREMIUM": 0,
                                    "BASICODP": (Erp_Qt_Request_Core['___premium_breakup_od_basic___'] - Erp_Qt_Request_Core['___premium_breakup_od_disc___']).toString(),
                                    "VOLUNTARYDEDUCTIBLE": "",
                                    "VOLUNTARYDISC": 0,
                                    "ISAAMEMBERSHIP": 0,
                                    "AAMEMNO": "",
                                    "AADISCAMOUNT": 0,
                                    "AAEXPIRYPERIOD": "",
                                    "ISANTITHEFTATTACHED": 0,
                                    "ANTITHEFTDISCAMOUNT": 0,
                                    "NCBFLAG": Erp_Qt_Request_Core['___is_claim_exists___'] === "yes" ? "0" : "1",
                                    "NCBPER": Erp_Qt_Request_Core['___is_claim_exists___'] === "yes" ? "0" : Processed_Request['___vehicle_ncb_next___'],
                                    "NCBAMOUNT": Erp_Qt_Request_Core['___premium_breakup_od_disc_ncb___'].toString(),
                                    "ISOWNPREMISES": 0,
                                    "ADDONISNILDEP": Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "no" ? "0" : "1",
                                    "ADDONNILDEPAMT": Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "no" ? "0" : Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'],
                                    "ADDONISADDTOWING": 0,
                                    "ADDONADDTOWINGAMT": 0,
                                    "ADDONISEMICOVER": 0,
                                    "ADDONEMICOVERAMT": 0,
                                    "ADDONISRTI": Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "no" ? "0" : "1",
                                    "ADDONRTIAMT": Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "no" ? "0" : Erp_Qt_Request_Core['___premium_breakup_addon_invoice_price_cover___'],
                                    "ADDONISNCBPROT": 0,
                                    "ADDONNCBPROTAMT": 0,
                                    "ADDONISCONSUMABLE": 0,
                                    "ADDONCONSUMABLESAMT": 0,
                                    "ADDONISENGINEPROT": Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "no" ? "0" : "1",
                                    "ADDONENGINEPROTAMT": Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "no" ? "0" : Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'],
                                    "ADDONISPERSONALBELONGING": 0,
                                    "ADDONPERSONALBELONGINGAMT": 0,
                                    "ADDONISCOURTESYCAR": 0,
                                    "ADDONCOURTESYCARAMT": 0,
                                    "NETODPREMIUM": Erp_Qt_Request_Core['___premium_breakup_od_final_premium___'].toString(),
                                    "BASICTPL": Erp_Qt_Request_Core['___premium_breakup_tp_basic___'].toString(),
                                    "EXTTPPD": 0,
                                    "IMT34TP": "",
                                    "TRAILERTP": 0,
                                    "TOTALTP": Erp_Qt_Request_Core['___premium_breakup_tp_basic___'].toString(),
                                    "PACOVERPREMOWNERDRIVER": Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'].toString(),
                                    "PACOVERUNNAMEDDRIVER": 0,
                                    "PACOVERPILLIONRIDER": 0,
                                    "ISPAPAIDDRIVER": 0,
                                    "NOOFPAIDDRIVERPA": 0,
                                    "PACOVERPREMPAIDDRIVER": 0,
                                    "PASUMINSUREDPEREMPLOYEE": "",
                                    "ISPACLEANER": 0,
                                    "NOOFCLEANERPA": 0,
                                    "PACOVERPREMCLEANER": 0,
                                    "ISPACONDUCTOR": 0,
                                    "NOOFCONDUCTORPA": 0,
                                    "PACOVERPREMCONDUCTOR": 0,
                                    "ISPAHELPER": 0,
                                    "NOOFHELPERPA": 0,
                                    "PACOVERPREMHELPER": 0,
                                    "PANOOFPERSON": 0,
                                    "PASUMINSUREDPERUNNAMEDPERSON": 0,
                                    "PACOVERPREMUNNAMEDPERSON": 0,
                                    "PATOTALPREMIUM": Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'].toString(),
                                    "ISLLPAIDDRIVER": 0,
                                    "NOOFPAIDDRIVERLL": 0,
                                    "LLPAIDDRIVPREMIUM": 0,
                                    "ISLLCLEANER": 0,
                                    "NOOFCLEANERLL": 0,
                                    "LLCLEANERPREMIUM": 0,
                                    "ISLLCONDUCTOR": 0,
                                    "NOOFCONDUCTORLL": 0,
                                    "LLCONDUCTORPREMIUM": 0,
                                    "ISLLHELPER": 0,
                                    "NOOFHELPERLL": 0,
                                    "LLHELPERPREMIUM": 0,
                                    "ISLLOTHEREMP": 0,
                                    "LLOTHEREMPCOUNT": 0,
                                    "LLOTHEREMPPREMIUM": 0,
                                    "ISLLUNNAMEDPASS": 0,
                                    "LLUNNAMEDPASSCOUNT": 0,
                                    "LLUNNAMEDPASSPREMIUM": 0,
                                    "ISLLNFPP": 0,
                                    "LLNFPPCOUNT": 0,
                                    "LLNFPPPREMIUM": 0,
                                    "TOTALLEGALLIABILITY": 0,
                                    "NETLIABILITYPREMIUMB": Erp_Qt_Request_Core['___premium_breakup_tp_final_premium___'].toString(),
                                    "TOTALPREMIUM": Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString(),
                                    "SERVICETAX": 0,
                                    "GROSSPREMIUM": Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                                    "IMTCODE": applicable_imt(Erp_Qt_Request_Core),
//                                    "PAYMENTID": dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay" ?  (dbUserData.Payment_Response.pg_get && dbUserData.Payment_Response.pg_get['PayId']) : dbUserData.Transaction_Data.transaction_id,
                                    "PAYMENTID": ff_pay_id,
                                    "PROPOSERPAYMENTMODE": "F",
                                    "ISPROPOSALMANUALAPPROVED": 0,
                                    "PREVPOLICYNO": Erp_Qt_Request_Core['___previous_policy_number___'] === "" ? "" : "'" + Erp_Qt_Request_Core['___previous_policy_number___'],
                                    "FIRSTISSINGDEALERCODE": "N/A",
                                    "PREVPOLICYEFFECTIVEDATE": Processed_Request['___pre_policy_start_date___'],
                                    "PREVPOLICYEXPIRYDATE": Erp_Qt_Request_Core['___policy_expiry_date___'],
                                    "PREVINSURCOMPANYCODE": Processed_Request['___dbmaster_previousinsurer_code___'],
                                    "PREVINSURCOMPANYNAME": Processed_Request['___dbmaster_insurername___'],
                                    "PREVINSURCOMPANYADD": Processed_Request['___dbmaster_pb_previousinsurer_address___'],
                                    "ISPREVPOLCOPYSUBMIT": 0,
                                    "ISNCBCERTIFICATESUBMIT": 0,
                                    "ISCUSTOMERUNDERTAKINGSUBMIT": 0,
                                    "CURRENT_POLICY_TENURE": Erp_Qt_Request_Core['___policy_od_tenure___'],
                                    "PREVIOUS_POLICY_TENURE": 1,
                                    "TOTAL_NOOFOD_CLAIMS": 0,
                                    "IDV_TENURE2": "",
                                    "IDV_TENURE3": "",
                                    "TENURE1_END_DATE": moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(breakin_day)).format("YYYY-MM-DD"),
                                    "TENURE2_START_DATE": "",
                                    "TENURE2_END_DATE": "",
                                    "TENURE3_START_DATE": "",
                                    "ADDONEMICOVERMONTH": "",
                                    "ADDONISDAILYCASH": 0,
                                    "ADDONDAILYCASHAMT": "",
                                    "ADDONISRSA": 0,
                                    "ADDONRSAAMT": "",
                                    "ADDONISINCONALLOWANCE": 0,
                                    "ADDONINCONALLOWANCEAMT": "",
                                    "ADDONISTYRECOVER": 0,
                                    "ADDONADDONTYRECOVERAMT": "",
                                    "ADDONISKEYREPLACEMENT": 0,
                                    "ADDONKEYREPLACEMENTAMT": "",
                                    "BREAKININSPECTIONDATE": "",
                                    "BREAKINREFERENCENO": "",
                                    "BREAKININSPECTIONAGENCY": "",
                                    "RTOZONECODE": Erp_Qt_Request_Core['___pb_vehicletariff_zone___'],
                                    "ISHANDICAPVEHICLE": 0,
                                    "HANDICAPDISPREMIUM": 0,
                                    "ADDONRTICOVERAMOUNT": 0,
                                    "PSPNAME": "N/A",
                                    "PSPAADHAARCARDNUMBER": "N/A",
                                    "PSPPANNUMBER": "N/A",
                                    "CESS_AMT_1": 0,
                                    "CESS_AMT_2": 0,
                                    "CESS_AMT_3": 0,
                                    "CESS_AMT_4": "",
                                    "CESS_AMT_5": "",
                                    "VEHICLEPREMIUM_TENURE1": Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                                    "VEHICLEPREMIUM_TENURE2": "",
                                    "VEHICLEPREMIUM_TENURE3": "",
                                    "NONELECTRICACCIDV_TENURE2": "",
                                    "NONELECTRICACCIDV_TENURE3": "",
                                    "NONELECTRICACCPREMIUM_TENURE1": 0,
                                    "NONELECTRICACCPREMIUM_TENURE2": "",
                                    "NONELECTRICACCPREMIUM_TENURE3": "",
                                    "ELECTRICACCIDV_TENURE2": "",
                                    "ELECTRICACCIDV_TENURE3": "",
                                    "ELECTRICACCPREMIUM_TENURE1": 0,
                                    "ELECTRICACCPREMIUM_TENURE2": "",
                                    "ELECTRICACCPREMIUM_TENURE3": "",
                                    "BIFUELKITIDV_TENURE2": "",
                                    "BIFUELKITIDV_TENURE3": "",
                                    "BIFUELKITPREMIUM_TENURE1": 0,
                                    "BIFUELKITPREMIUM_TENURE2": "",
                                    "BIFUELKITPREMIUM_TENURE3": "",
                                    "BASICODP_TENURE1": Erp_Qt_Request_Core['___premium_breakup_od_final_premium___'].toString(),
                                    "BASICODP_TENURE2": "",
                                    "BASICODP_TENURE3": "",
                                    "LT_DISCOUNT_PERCENTAGE": "",
                                    "NETODPREMIUM_TENURE1": Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString(),
                                    "NETODPREMIUM_TENURE2": 0,
                                    "NETODPREMIUM_TENURE3": 0,
                                    "PSPUNIQUENO": "AB-DPTS000119",
                                    "BREAKINLOADINGPER": 0,
                                    "IMT44": 0,
                                    "ADDONISHOSPICASH": 0,
                                    "ADDONHOSPICASHAMT": 0,
                                    "ADDONISWHEELRIM": 0,
                                    "ADDONWHEELRIMAMT": 0,
                                    "BUYERSTATECODE": 36,
                                    "INSSTATECODE": 36,
                                    "INSOFFICECODE": 4,
                                    "BUYERGSTIN": "",
                                    "SGSTPER": 9,
                                    "SGSTAMOUNT": (Erp_Qt_Request_Core['___premium_breakup_service_tax___'] / 2).toString(),
                                    "CGSTPER": 9,
                                    "CGSTAMOUNT": (Erp_Qt_Request_Core['___premium_breakup_service_tax___'] / 2).toString(),
                                    "IGSTPER": 0,
                                    "IGSTAMOUNT": 0,
                                    "GSTCESSPER": 0,
                                    "GSTCESSAMOUNT": 0,
                                    "MOBILENO": Erp_Qt_Request_Core['___mobile___'],
                                    "MISPCODE": "AB-MTS000211",
                                    "SOLICTATIONTYPE": "D",
                                    "PREVPOLICYNILDEPAVAILED": Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "no" ? "0" : "1",
                                    "ADDONHOSPICASHPARAMETERS": "",
                                    "ADDONISADDROADASSIST": 0,
                                    "ADDONADDROADASSISTAMT": 0,
                                    "ADDONISADDON18": 0,
                                    "ADDONADDON18AMT": 0,
                                    "ADDONISADDON19": 0,
                                    "ADDONADDON19AMT": 0,
                                    "ADDONISADDON20": 0,
                                    "ADDONADDON20AMT": 0,
                                    "PROPOSERAADHAARNUMBER": "",
                                    "PROPOSERAADHAAREID": "",
                                    "ISPROPOSERFORM60": "",
                                    "PROPOSEREIA": "",
                                    "ISFREEINSURANCE": "",
                                    "PSPOTHERIDTYPE": "",
                                    "PSPOTHERIDNUMBER": "",
                                    "PUCCERTIFICATENUMBER": "",
                                    "PUCEXPIRYDATE": "",
                                    "COMFITNESSEXPIRYDATE": "",
                                    "ISPREVPOLICYVISOF": Erp_Qt_Request_Core['___is_policy_exist___'] === "no" ? "0" : "1",
                                    "ADDONDISCOUNTPER": "",
                                    "ADDONISADDON21": "",
                                    "ADDONADDON21AMT": "",
                                    "ADDONISADDON22": "",
                                    "ADDONADDON22AMT": "",
                                    "ADDONISADDON23": "",
                                    "ADDONADDON23AMT": "",
                                    "ADDONISADDON24": "",
                                    "ADDONADDON24AMT": "",
                                    "ADDONISADDON25": "",
                                    "ADDONADDON25AMT": "",
                                    "LASTCLAIMDATE": "",
                                    "TPPOLICYEFFECTIVEDATE": Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "" : moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(breakin_day)).format("YYYY-MM-DD"),
                                    "TPPOLICYEFFECTIVETIME": "",
                                    "TPPOLICYEXPIRYDATE": Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "" : (moment(Erp_Qt_Request_Core['___policy_start_date___'], "YYYY-MM-DD").add('years', (Erp_Qt_Request_Core['___policy_tp_tenure___'] - 0)).subtract(1, "days")).add('days', parseInt(breakin_day)).format('DD/MM/YYYY'),
                                    "TPCURRENT_POLICY_TENURE": Erp_Qt_Request_Core['___policy_tp_tenure___'],
                                    "TPPREVIOUS_POLICY_TENURE": "",
                                    "TENURE3_END_DATE": "",
                                    "TENURE4_START_DATE": "",
                                    "TENURE4_END_DATE": "",
                                    "TENURE5_START_DATE": "",
                                    "IDV_TENURE4": "",
                                    "IDV_TENURE5": "",
                                    "VEHICLEPREMIUM_TENURE4": 0,
                                    "VEHICLEPREMIUM_TENURE5": 0,
                                    "NONELECTRICACCIDV_TENURE4": 0,
                                    "NONELECTRICACCIDV_TENURE5": 0,
                                    "NONELECTRICACCPREMIUM_TENURE4": 0,
                                    "NONELECTRICACCPREMIUM_TENURE5": 0,
                                    "ELECTRICACCIDV_TENURE4": 0,
                                    "ELECTRICACCIDV_TENURE5": 0,
                                    "ELECTRICACCPREMIUM_TENURE4": 0,
                                    "ELECTRICACCPREMIUM_TENURE5": 0,
                                    "BIFUELKITIDV_TENURE4": 0,
                                    "BIFUELKITIDV_TENURE5": 0,
                                    "BIFUELKITPREMIUM_TENURE4": 0,
                                    "BIFUELKITPREMIUM_TENURE5": 0,
                                    "BASICODP_TENURE4": 0,
                                    "BASICODP_TENURE5": 0,
                                    "NETODPREMIUM_TENURE4": 0,
                                    "NETODPREMIUM_TENURE5": 0,
                                    "ISCPA_DL_EXIST": 1,
                                    "CPAEFFECTIVEDATE": "",
                                    "CPAEFFECTIVETIME": "",
                                    "CPAEXPIRYDATE": "",
                                    "CPA_CURRENT_TENURE": 0,
                                    "CPA_PREVIOUS_TENURE": "",
                                    "CPASUMINSURED": 1500000,
                                    "CPAWAIVERREASONCODE": 0,
                                    "TPSGSTPER": "",
                                    "TPSGSTAMOUNT": "",
                                    "TPCGSTPER": "",
                                    "TPCGSTAMOUNT": "",
                                    "TPIGSTPER": "",
                                    "TPIGSTAMOUNT": "",
                                    "KW": "",
                                    "ISTESTDRIVEVEHICLE": 0,
                                    "OTHERTPPOLICYNO": Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? Erp_Qt_Request_Core['___tp_policy_number___'] : "",
                                    "OTHERTPINSURCOMPANYNAME": Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? Erp_Qt_Request_Core['___tp_insurer_name___'] : "",
                                    "OTHERTPPOLICYEFFECTIVEDATE": Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? Erp_Qt_Request_Core['___tp_start_date___'] : "",
                                    "OTHERTPPOLICYEFFECTIVETIME": "",
                                    "OTHERTPPOLICYEXPIRYDATE": Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? Erp_Qt_Request_Core['___tp_end_date___'] : "",
                                    "INSPOLICYNO": policy_number,
                                    "INSPROPOSALNO": Erp_Qt_Request_Core['___crn___'],
//                                    "RECONCILEDCHEQUENO": dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay" ? dbUserData.Payment_Request.pg_data['transfer_id'] : (dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet" ? dbUserData.Transaction_Data['pg_reference_number_3'] : dbUserData.Transaction_Data.transaction_id.toString()),
                                    "RECONCILEDCHEQUENO": rzp_transfer_id,
//                                    "RECONCILEDCHEQUEDATE": ((dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay") || dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") ? dbUserData.Transaction_Data['pg_reference_number_1'] : Processed_Request['___pg_reference_number_1___'],
                                    "RECONCILEDCHEQUEDATE": rzp_pay_dt,
                                    "RECONCILEDCHEQUEBANK": "",
                                    "RECONCILEDCHEQUEBRANCH": "",
                                    "RECONCILEDCHEQUEAMOUNT": Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                                    "RECONCILEDCHEQUEISSUEDBY": "D",
                                    "PAYINSLIPNO": "'" + Processed_Request['___pg_reference_number_2___'],
//                                    "PAYINSLIPDATE": ((dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay") || dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") ? dbUserData.Transaction_Data['pg_reference_number_1'] : Processed_Request['___pg_reference_number_1___'],
                                    "PAYINSLIPDATE": rzp_pay_dt,
                                    "UNIQUEREFERENCENO": Processed_Request['___pg_reference_number_2___'],
                                    "CHEQUEAMOUNT": Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                                    "PYMTPROPAYMENTMODE": "I",
                                    "Feedfile Rec date": "",
                                    "MISPCODE": Erp_Qt_Request_Core['___posp_category___'] === "MISP" ? Erp_Qt_Request_Core['___posp_erp_id___'] : "",
                                    "MISPNAME": Erp_Qt_Request_Core['___posp_category___'] === "MISP" ? Erp_Qt_Request_Core['___posp_first_name___'] + " " + Erp_Qt_Request_Core['___posp_middle_name___'] + " " + Erp_Qt_Request_Core['___posp_last_name___'] : ""
                                };
                                data_list.push(data_csv);
                            } catch (e) {
                                console.log("create_edelweiss_feedfile", e.message);
                                res.json({'msg': 'error-' + e.message});
                            }
                        }
                        var txs = JSON.parse(JSON.stringify(data_list));
                        finalTxs = [];
                        for (let i = 0; i <= data_list.length; i++) {
                            finalTxs.push(data_list[i]);
                        }
                        const csvData = csvjson.toCSV(finalTxs, {
                            headers: 'key'
                        });
                        writeFile(ff_loc_path_portal, csvData, (err) => {
                            if (err) {
                                console.log(err); // Do something to handle the error or just throw it
                            }
                            console.log('Success!');
                        });
                        //res.json({'msg': 'Success'});
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy SBIGENERAL Feed File Dated:' + date;
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File for ' + emp_data.length + ' SBIGENERAL TW Policy. Share status of each policy. Please confirm if these policies are enroll in SBI system.</p>'
                                + '<BR><p>Feed-File Dated: ' + date + '</p><BR><p>Feed-File URL : ' + ff_web_path_portal + ' </p></body></html>';
                        var arrTo = ['SACHIN.KOCHAREKAR@SBIGENERAL.IN', 'debajyoti.sinha@sbigeneral.in', 'PALLAVI.PALAV@SBIGENERAL.IN', 'Kamlesh.chinchavle@sbigeneral.in'];
                        var arrCc = ['ABHISHEK.PANDEY@SBIGENERAL.IN', 'SARNA.BHATTACHARYA@SBIGENERAL.IN'];
                        var arrBcc = [config.environment.notification_email, 'ashish.hatia@policyboss.com', 'anuj.singh@policyboss.com', 'vikram.jena@policyboss.com'];
                        if (config.environment.name === 'Production') {
                            if (req.query.hasOwnProperty('dbg') && req.query['dbg'] == 'yes') {
                                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_body, '', '', ''); //UAT
                            } else {
                                objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, arrCc.join(','), arrBcc.join(','), ''); //UAT
                            }
                        }
                        var SmsLog = require('../models/sms_log');
                        var objSmsLog = new SmsLog();
                        var customer_msg = "HORIZON-FEEDfILE-SCHEDULER\n\---------------\n\ Hi ,\n\SBIGENERAL TW FeedFile Dated : " + moment().subtract(1, "days").format('DD-MM-YYYY') + ".\n\Successfully Generated.\n\No. of Policy: " + emp_data.length;
                        objSmsLog.send_sms('9768463482', customer_msg, 'POLBOS-SCHEDULER'); //Vikram
                        objSmsLog.send_sms('9619160851', customer_msg, 'POLBOS-SCHEDULER'); //Anuj
                        objSmsLog.send_sms('7208803933', customer_msg, 'POLBOS-SCHEDULER'); //Ashish
                        res.json({'msg': 'Success'});
                    } else {
                        res.json({'msg': 'No Data Avilable'});
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy SBIGENERAL Feed File Dated:' + date;
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File of SBIGENERAL TW Policy. Share status of each policy. Please confirm if these policies are enroll in SBI system.</p>'
                                + '<BR><p>Feed-File Dated: ' + date + '</p><BR><p>No Data Avilable </p></body></html>';
                        var arrBcc = [config.environment.notification_email, 'ashish.hatia@policyboss.com', 'anuj.singh@policyboss.com', 'vikram.jena@policyboss.com'];
                        if (config.environment.name === 'Production') {
                            if (req.query.hasOwnProperty('dbg') && req.query['dbg'] == 'yes') {
                                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_body, '', '', ''); //UAT
                            } else {
                                objModelEmail.send('notifications@policyboss.com', arrBcc.join(','), sub, email_body, '', '', ''); //UAT
                    }
                        }
                        var SmsLog = require('../models/sms_log');
                        var objSmsLog = new SmsLog();
                        var customer_msg = "HORIZON-FEEDfILE-SCHEDULER\n\---------------\n\ Hi ,\n\SBIGENERAL TW FeedFile Dated : " + moment().subtract(1, "days").format('DD-MM-YYYY') + ".\n\No Data Avilable.";
                        objSmsLog.send_sms('9768463482', customer_msg, 'POLBOS-SCHEDULER'); //Vikram
                        objSmsLog.send_sms('9619160851', customer_msg, 'POLBOS-SCHEDULER'); //Anuj
                        objSmsLog.send_sms('7208803933', customer_msg, 'POLBOS-SCHEDULER'); //Ashish
                    }
                } catch (e) {
                    console.log("create_sbigeneral_feedfile", e);
                    res.json(e);
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }

    });
    app.get('/create_feedfile/edelweiss_tw', function (req, res) {
        var UDID = (req.params['UDID']);
        try {
            var User_Data = require(appRoot + '/models/user_data');
            var days = (req.query.hasOwnProperty('days')) ? req.query.days - 0 : 1;
            var start_date = moment().subtract(days, "days").format('YYYY-MM-DD');
            start_date = new Date(start_date + "T06:00:00Z");
            var end_date = moment().format('YYYY-MM-DD');
            end_date = new Date(end_date + "T05:59:59Z");
            var Last_Status = 'TRANS_SUCCESS';
            User_Data.find({Insurer_Id: 46, Last_Status: new RegExp(Last_Status, 'i'), Product_Id: 10, Modified_On: {$gte: start_date, $lt: end_date}, "Transaction_Data.pg_reference_number_1": {$exists: true}}, {_id: 0}, function (err, emp_data) {
                try {
                    if (err)
                        throw err;
                    var date = moment().subtract(1, "days").format('DD-MM-YYYY');
                    var ff_file_name = "EdelweissMotor_FeedFile_" + date + ".csv";
                    var ff_loc_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                    var ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                    var User_Data = require(appRoot + '/models/user_data');
                    if (parseInt(emp_data.length) > 0) {
                        var OccupationCode = {
                            "BUSINESS": "1",
                            "SALARIED": "2",
                            "PROFESSIONAL": "3",
                            "STUDENT": "4",
                            "HOUSEWIFE": "5",
                            "RETIRED": "6",
                            "OTHERS": "7"
                        };
                        var csvjson = require('csvjson');
                        var writeFile = require('fs').writeFile;
                        var fs = require('fs');
                        var data_list = [];
                        var obj_inscovertype = {
                            "0CH_1TP": "L",
                            "0CH_5TP": "L",
                            "1OD_0TP": "O",
                            "2CH_0TP": "P",
                            "3CH_0TP": "P",
                            "1CH_4TP": "P",
                            "1CH_0TP": "P"
                        };
                        for (var rowcount in emp_data) {
                            try {
                                var dbUserData = [];
                                dbUserData = emp_data[rowcount]._doc;
                                //var Processed_Request = JSON.parse(dbUserData.Transaction_Data.sbigeneral_data);
                                var Erp_Qt_Request_Core = dbUserData.Erp_Qt_Request_Core;
                                console.log(dbUserData.Erp_Qt_Request_Core['___crn___']);
                                var mdp_prm = (dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___']) - ((Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_invoice_price_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_consumable_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_consumable_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_personal_belonging_loss_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_personal_belonging_loss_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_key_lock_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_key_lock_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_road_assist_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_road_assist_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_ncb_protection_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_ncb_protection_cover___'] : 0));
                                dbUserData.Erp_Qt_Request_Core['___addon_mandatory_deduction_protect_cover___'] = mdp_prm > 0 ? "yes" : "no";
                                dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_mandatory_deduction_protect___'] = mdp_prm;
                                console.log('Edelweiss TW- ' + dbUserData.Erp_Qt_Request_Core['___crn___']);
                                var policy_number = dbUserData.Transaction_Data.policy_number.toString();
                                var is_tp_only = false;
                                if (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'].indexOf('0CH') > -1) {
                                    is_tp_only = true;
                                } else {
                                    is_tp_only = false;
                                }
                                var cust_dob = dbUserData.Erp_Qt_Request_Core['___birth_date___'].split("-");
                                var nominee_dob = dbUserData.Erp_Qt_Request_Core['___nominee_birth_date___'].split("-");
                                var posp_flag_ff = "NA";
                                var posp_id_ff = "NA";
                                var posp_name_ff = "NA";
                                var posp_email_ff = "NA";
                                var posp_pan_no_ff = "NA";
                                var posp_name = "NA";
                                var posp_pan_no = "NA";
                               if (dbUserData.Erp_Qt_Request_Core['___is_posp___'] === "yes") {
                                    if (dbUserData.Erp_Qt_Request_Core['___posp_middle_name___'] === null || dbUserData.Erp_Qt_Request_Core['___posp_middle_name___'] === "") {
                                        posp_name = dbUserData.Erp_Qt_Request_Core['___posp_first_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_last_name___'];
                                    } else {
                                        posp_name = dbUserData.Erp_Qt_Request_Core['___posp_first_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_middle_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_last_name___'];
                                    }
                                    posp_pan_no = dbUserData.Erp_Qt_Request_Core['___posp_pan_no___'];
                                    posp_flag_ff = "POSP";
                                    posp_id_ff = (dbUserData.Erp_Qt_Request_Core['___posp_ss_id___']).toString();
                                    posp_name_ff = posp_name;
                                    posp_email_ff = "";
                                    posp_pan_no_ff = posp_pan_no;
                                }
                                let payment_bank_name = "";
                                if ((dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay") || dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") {
                                    if (dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") {
                                        payment_bank_name = "Razor Pay Wallet";
                                    } else {
                                        payment_bank_name = "Razor Pay";
                                    }
                                } else {
                                    payment_bank_name = "PAYU";
                                }
                                var data_csv = {
                                    "Source": "Policy Boss",
                                    "Policy_Number": policy_number,
                                    "Agent_Login_Email_ID": "customercare@policyboss.com",
                                    "Branch": "Mumbai HO",
                                    "Type_of_Business": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" ? "Rollover" : "New", //Rollover/ NEW
                                    "Policy_Type": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP" ? "Package" : (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "Standalone Own Damage(Addon-Optional)" : "Liability Only (TP:1)"),
                                    "Sub policy type": "",
                                    "Policy_Start_Date": moment(dbUserData.Erp_Qt_Request_Core['___policy_start_date___']).format("DD-MM-YYYY"),
                                    "Main_Applicant_Proposer_Type": dbUserData.Erp_Qt_Request_Core['___vehicle_registration_type___'] === "individual" ? "Person" : "Organisation",
                                    "Previous Policy TP Tenure": "1", //If PYP was long term TP policy, TP period would be  5 otherwise pass 1
                                    "Existing TP Policy Details": "",
                                    "Name Of Insurer": "",
                                    "Policy number": "",
                                    "Policy start date": "",
                                    "policy end date": "",
                                    "OwnDamage Policy Period": "",
                                    "TP Policy Period": dbUserData.Erp_Qt_Request_Core['___policy_tp_tenure___'],
                                    "Add-On Policy Period": "",
                                    "Previous Insurance Policy": (dbUserData.Erp_Qt_Request_Core['___is_policy_exist___'] === "yes" ? "Yes" : "No"),
                                    "Kind of Policy": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP" ? "Package" : (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "Standalone OD" : "Liability Only"), //Package/ Liability/ Standalone OD
                                    "Previous Insurance Company Name ": dbUserData.Processed_Request['___dbmaster_previousinsurer_code___'], //objProduct.insurer_master.prev_insurer.insurer_db_master['PreviousInsurer_Code'],
                                    "Previous Insurance Company Address": "Mumbai",
                                    "Previous Policy Start Date ": moment(dbUserData.Premium_List.Summary.Request_Product['pre_policy_start_date']).format("DD-MM-YYYY"),
                                    "Previous Policy End Date": moment(dbUserData.Erp_Qt_Request_Core['___policy_expiry_date___']).format("DD-MM-YYYY"),
                                    "Previous Policy No": dbUserData.Erp_Qt_Request_Core['___previous_policy_number___'],
                                    "Nature of Loss": "",
                                    "Make": dbUserData.Processed_Request['___dbmaster_insurer_vehicle_make_name___'],
                                    "Model": dbUserData.Processed_Request['___dbmaster_insurer_vehicle_model_name___'],
                                    "Variant": dbUserData.Processed_Request['___dbmaster_insurer_vehicle_variant_name___'],
                                    "New_or_Used": "Used", //New Or Used?
                                    "Year_of_Manufacture": dbUserData.Erp_Qt_Request_Core['___vehicle_manf_year___'],
                                    "Registration_Date": moment(dbUserData.Erp_Qt_Request_Core['___vehicle_registration_date___']).format("DD-MM-YYYY"),
                                    "Engine_Number": dbUserData.Erp_Qt_Request_Core['___engine_number___'],
                                    "Chassis_Number": dbUserData.Erp_Qt_Request_Core['___chassis_number___'],
                                    "Fibre_Glass_Fuel_Tank": "No",
                                    "Bodystyle_Description": "",
                                    "Body_Type": "",
                                    "Transmission_Type": "Gear",
                                    "Valid_Driving_License": dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "Yes" : "No",
                                    "Already_Have_PA_Cover": dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "No" : "Yes",
                                    "Handicapped": "No",
                                    "Automobile_Association_Member": dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_aai___'] > 0 ? "Yes" : "No", //dbUserData.Erp_Qt_Request_Core['___is_aai_member___']
                                    "Anti-Theft_Device_Installed": dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_anti_theft___'] > 0 ? "Yes" : "No", //dbUserData.Erp_Qt_Request_Core['___is_antitheft_fit___']
                                    "Type_of_Device_Installed": "",
                                    "Automobile_Association_Membership_Number": "",
                                    "Automobile_Association_Membership_Expiry_Date": "",
                                    "State_Code": dbUserData.Erp_Qt_Request_Core['___registration_no_1___'],
                                    "District_Code": dbUserData.Erp_Qt_Request_Core['___registration_no_2___'],
                                    "Vehicle_Series_Number": dbUserData.Erp_Qt_Request_Core['___registration_no_3___'],
                                    "Registration_Number": dbUserData.Erp_Qt_Request_Core['___registration_no_4___'],
                                    "Transfer_of_NCB": dbUserData.Erp_Qt_Request_Core['___is_claim_exists___'] === "yes" ? "NO" : "Yes", //Transfer of NCB Yes/ NO
                                    "Transfer_of_NCB_Percent": is_tp_only ? "" : (dbUserData.Erp_Qt_Request_Core['___vehicle_ncb_current___'] + '%'), //Transfer of NCB If yes, then previous yr NCB in %
                                    "Proof_Document_Date": is_tp_only ? "" : (moment(dbUserData.Erp_Qt_Request_Core['___policy_expiry_date___']).format("DD-MM-YYYY")), //Previous policy end date
                                    "Proof_Provided_for_NCB": is_tp_only ? "" : ('NCB declaration'),
                                    "Own Damage Basic": is_tp_only ? "No" : "Yes",
                                    "Own Damage Basic_IDV": "",
                                    "Non_Electrical_Accessories": dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "No" : "Yes", //Yes or NO
                                    "Non_Electrical_Description": dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "" : "Non electrical accessories", //Non electrical accessories (Hard coded)
                                    "Value_of_Non_Electrical": dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString(),
                                    "Electrical_Accessories": dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "No" : "Yes", //Yes or NO
                                    "Electrical_Description": dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "" : "Electrical accessories", //Electrical accessories (Hard coded)
                                    "Value_of_Electrical": dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString(),
                                    "CNG_LPG_Gas_Kit": "", //Yes or NO
                                    "CNG_LPG_Description": "", //CNG/ LPG
                                    "Value_of_CNG_LPG": "",
                                    "Internal_CNG/LPG_Gas_Kit": "", //Internal CNG /LPG Gas Kit  //Yes or NO
                                    "Internal_CNG/LPG_Gas_Kit_Description": "",
                                    "Side_Car": "",
                                    "Side_Car_IDV_Value": "",
                                    "Additional_Accessories": "No",
                                    "Value_of_Additional_Accessories": "",
                                    "Third_Party_Property_Damage": "Upto 100000", //LIMIT needs to be mentioned //Third Party Property Damage Limit
                                    "Legal_Liability_Employees": "No", //Legal Liability Employees
                                    "Legal_Liability_Employees_Number": "",
                                    "Legal_Liability_Paid_Drivers": "No",
                                    "Legal_Liability_Paid_Driver_Number": "",
                                    "Legal_Liability_Soldier_Sailors_Airman": "",
                                    "Legal_Liability_Soldier_Sailors_Airman_Number": "",
                                    "PA_Owner_Driver": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "No" : (dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "Yes" : "No"), //PA Owner Driver //Yes And No
                                    "PA_Owner_Driver_Policy_Tenure": dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "1" : "",
                                    "PA_for_Unnamed_Passenger": dbUserData.Processed_Request['___pa_unnamed_passenger_si___'] === "" ? "No" : "Yes", //PA for Unnamed Passenger yes and no
                                    "Sum_Insured_Per_Person": dbUserData.Processed_Request['___pa_unnamed_passenger_si___'] === "" ? "" : dbUserData.Processed_Request['___pa_unnamed_passenger_si___'], //Sum Insured Per Person   If yes, the PA SI per person
                                    "PA_to_Driver_Cleaner_Conductor": "No",
                                    "PA_to_Driver_Cleaner_Conductor_Number": "",
                                    "PA_to_Driver_Cleaner_Conductor_Sum_Insured_per_Person": "",
                                    "CNG_LPG_Kit_Liability": ((["CNG", "LPG"].indexOf(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_fueltype___']) > -1) ? "Yes" : "No"), //CNG LPG Kit Liability
                                    "PA_Cover_for_Named_Person_Other_than_Driver": "No",
                                    "PA_Cover_for_Named_Person_Other_than_Driver_Number_of_Drivers": "",
                                    "PA_Cover_for_Named_Person_Other_than_Driver_Sum_Insured_per_Person": "",
                                    "PA_Cover_for_Unnamed_Hirrer_or_Pillion_Passenger": "No",
                                    "PA_Cover_for_Unnamed_Hirrer_or_Pillion_Passenger_Number_of_Drivers": "",
                                    "PA_Cover_for_Unnamed_Hirrer_or_Pillion_Passenger_Sum_Insured_per_Person": "",
                                    "Invoice Value Protect": dbUserData.Erp_Qt_Request_Core['___addon_invoice_price_cover___'].toString(), //Invoice Value Protect yes or no
                                    "Depreciation Protect": dbUserData.Erp_Qt_Request_Core['___addon_zero_dep_cover___'].toString(), //Depreciation Protect yes or no
                                    "Pillion Protect": "No",
                                    "Pillion Protect Value": "",
                                    "Consumable Expenses Protect": dbUserData.Erp_Qt_Request_Core['___addon_consumable_cover___'].toString(), //Consumable Expenses Protect yes or no
                                    "Emergency Medical Expenses Protect": "No",
                                    "Additional Third Party Property Damage Protect": "No",
                                    "Additional Third Party Property Damage Protect Value": "",
                                    "Required_Discount": "",
                                    "Finance_Type": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'], //Hypothecation or blank
                                    "Financier_Name": dbUserData.Erp_Qt_Request_Core['___financial_institute_name___'],
                                    "Branch_Name": dbUserData.Erp_Qt_Request_Core['___financial_institute_city___'],
                                    "Net Premium": dbUserData.Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString(),
                                    "GST": dbUserData.Erp_Qt_Request_Core['___tax___'].toString(), //(Math.ceil(dbUserData.Erp_Qt_Request_Core['___tax___'] - 0)), //(((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0).toFixed(2).toString()).split('.')[0]),
                                    "Total Premium Payable ": (((dbUserData.Erp_Qt_Request_Core['___net_premium___'] - 0) + (dbUserData.Erp_Qt_Request_Core['___tax___'] - 0)).toString()),
                                    "IDV_Value": dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString(), //IDV Value
                                    "Comment_to_UW": "",
                                    "Ind_Salutation": dbUserData.Erp_Qt_Request_Core['___salutation___'],
                                    "Ind_First_Name": dbUserData.Erp_Qt_Request_Core['___first_name___'],
                                    "Ind_Middle_Name": dbUserData.Erp_Qt_Request_Core['___middle_name___'],
                                    "Ind_Last_Name": dbUserData.Erp_Qt_Request_Core['___last_name___'],
                                    "Ind_Gender": dbUserData.Erp_Qt_Request_Core['___gender___'] === "M" ? "Male" : (dbUserData.Erp_Qt_Request_Core['___gender___'] === "F" ? "Female" : "Unknown"),
                                    "Ind_Marital_Status": dbUserData.Erp_Qt_Request_Core['___marital_text___'],
                                    "Ind_Date_of_Birth": cust_dob[2] + '-' + cust_dob[1] + '-' + cust_dob[0], //Mandatory DD/MM/YYYY
                                    "Ind_Nationality": "Indian",
                                    "Ind_Current_Address_Line_1": dbUserData.Erp_Qt_Request_Core['___communication_address_1___'],
                                    "Ind_Current_Address_Line_2": dbUserData.Erp_Qt_Request_Core['___communication_address_2___'],
                                    "Ind_Current_Address_Line_3": dbUserData.Erp_Qt_Request_Core['___communication_address_3___'],
                                    "Ind_Pincode": dbUserData.Erp_Qt_Request_Core['___communication_pincode___'],
                                    "Ind_Current_City": dbUserData.Erp_Qt_Request_Core['___communication_city___'],
                                    "Ind_PAN_Number": dbUserData.Erp_Qt_Request_Core['___pan___'],
                                    "Ind_GST_Number": dbUserData.Erp_Qt_Request_Core['___gst_no___'],
                                    "Ind_Aadhar_Number": dbUserData.Erp_Qt_Request_Core['___aadhar___'],
                                    "Ind_Mobile_Number": dbUserData.Erp_Qt_Request_Core['___mobile___'],
                                    "Ind_Email_ID": dbUserData.Erp_Qt_Request_Core['___email___'],
                                    "Ind_Occupation": dbUserData.Erp_Qt_Request_Core['___occupation___'],
                                    "Org_GST_Registered": "",
                                    "Org_GST_Number": "",
                                    "Org_Salutation": "",
                                    "Org_Company_Name": "",
                                    "Org_Current_Address_Line_1": "",
                                    "Org_Current_Address_Line_2": "",
                                    "Org_Current_Address_Line_3": "",
                                    "Org_Pincode": "",
                                    "Org_Current_City": "",
                                    "Org_PAN_Number": "",
                                    "Org_Mobile_Number": "",
                                    "Org_Email_ID": "",
                                    "Nominee_Name": dbUserData.Erp_Qt_Request_Core['___nominee_name___'],
                                    "Relationship_with_Applicant": dbUserData.Erp_Qt_Request_Core['___nominee_relation___'],
                                    "Others": (dbUserData.Erp_Qt_Request_Core['___nominee_relation___'] === "Others" ? dbUserData.Erp_Qt_Request_Core['___nominee_other_relation___'] : ""),
                                    "Nominee_Date_of_Birth": nominee_dob[2] + '-' + nominee_dob[1] + '-' + nominee_dob[0],
                                    "Guardian_Name": "",
                                    "Inspection_Number": "",
                                    "Payment_Mode": "NEFT",
                                    "Cheque_From_1": "",
                                    "Cheque_Bank_Name_1": "",
                                    "Cheque_Branch_1": "",
                                    "Cheque_IFSC_1": "",
                                    "Cheque_Account_Number_1": "",
                                    "Cheque_Date_1": "",
                                    "Cheque_Number_1": "",
                                    "Cheque_Name_1": "",
                                    "Cheque_Amount_1": "",
                                    "Cheque_From_2": "",
                                    "Cheque_Bank_Name_2": "",
                                    "Cheque_Branch_2": "",
                                    "Cheque_IFSC_2": "",
                                    "Cheque_Account_Number_2": "",
                                    "Cheque_Date_2": "",
                                    "Cheque_Number_2": "",
                                    "Cheque_Name_2": "",
                                    "Cheque_Amount_2": "",
                                    "Cheque_From_3": "",
                                    "Cheque_Bank_Name_3": "",
                                    "Cheque_Branch_3": "",
                                    "Cheque_IFSC_3": "",
                                    "Cheque_Account_Number_3": "",
                                    "Cheque_Date_3": "",
                                    "Cheque_Number_3": "",
                                    "Cheque_Name_3": "",
                                    "Cheque_Amount_3": "",
                                    "NEFT_From_1": "Customer",
                                    "NEFT_Bank_Name_1": payment_bank_name,
                                    "NEFT_Instrument_Number_1": dbUserData.Transaction_Data.transaction_id.toString(), //Transaction ID
                                    "NEFT_Account_Number_1": "1234", //1234
                                    "NEFT_Accountholder_1": dbUserData.Erp_Qt_Request_Core['___first_name___'], //Customer First Name
                                    "NEFT_Instrument_Date_1": moment(dbUserData.Transaction_Data['pg_reference_number_1']).format('DD/MM/YYYY').toString(), //Payment date //Instrument Date
                                    "NEFT_Amount_1": (((dbUserData.Erp_Qt_Request_Core['___net_premium___'] - 0) + (dbUserData.Erp_Qt_Request_Core['___tax___'] - 0)).toString()),
                                    "NEFT_From_2": "",
                                    "NEFT_Bank_Name_2": "",
                                    "NEFT_Instrument_Number_2": "",
                                    "NEFT_Account_Number_2": "",
                                    "NEFT_Accountholder_2": "",
                                    "NEFT_Instrument_Date_2": "",
                                    "NEFT_Amount_2": "",
                                    "NEFT_From_3": "",
                                    "NEFT_Bank_Name_3": "",
                                    "NEFT_Instrument_Number_3": "",
                                    "NEFT_Account_Number_3": "",
                                    "NEFT_Accountholder_3": "",
                                    "NEFT_Instrument_Date_3": "",
                                    "NEFT_Amount_3": "",
                                    "Cash_From_1": "",
                                    "Cash_Name_1": "",
                                    "Cash_Amount_1": "",
                                    "Sub Intermediary Category": "",
                                    "Sub Intermediary Code": "",
                                    "Sub Intermediary Name": "",
                                    "Sub Intermediary Phone Email": "",
                                    "POSP PAN Aadhar No": "",
                                    "Business Source Unique Id": "",
                                    "Account No": "",
									"Identifier": ((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___ui_source___') && dbUserData.Erp_Qt_Request_Core['___ui_source___'] === 'quick_tw_journey') || (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___agent_source___') && dbUserData.Erp_Qt_Request_Core['___agent_source___'] === 'quick_tw_journey')) ? 'PBoss Express' : 'PBoss'
                                };
                                data_list.push(data_csv);
                            } catch (e) {
                                console.log("create_edelweiss_tw_feedfile", e.message);
                                res.json({'msg': 'error-' + e.message});
                            }
                        }
                        var txs = JSON.parse(JSON.stringify(data_list));
                        finalTxs = [];
                        for (let i = 0; i <= data_list.length; i++) {
                            finalTxs.push(data_list[i]);
                        }
                        const csvData = csvjson.toCSV(finalTxs, {
                            headers: 'key'
                        });
                        writeFile(ff_loc_path_portal, csvData, (err) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log('Success!');
                        });
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Edelweiss TW Feed File Dated:' + date;
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File for ' + emp_data.length + ' Edelweiss TW Policy. Share status of each policy. Please confirm if these policies are enroll in Edelweiss system.</p>'
                                + '<BR><p>Feed-File Dated: ' + date + '</p><BR><p>Feed-File URL : ' + ff_web_path_portal + ' </p></body></html>';
                       var arrTo = ['shiv.yadav@edelweissfin.com', 'shrinath.pandey@edelweissfin.com', 'vibhash.shukla@edelweissfin.com', 'akshay.kohade@edelweissfin.com'];
                        var arrBcc = [config.environment.notification_email, 'ashish.hatia@policyboss.com', 'anuj.singh@policyboss.com'];
                        if (config.environment.name === 'Production') {
                            if (req.query.hasOwnProperty('dbg') && req.query['dbg'] == 'yes') {
                                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_body, '', '', ''); //UAT
                            } else {
                                objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, '', arrBcc.join(','), ''); //UAT
                            }
                        }
                        var SmsLog = require('../models/sms_log');
                        var objSmsLog = new SmsLog();
                        var customer_msg = "HORIZON-FEEDfILE-SCHEDULER\n\---------------\n\ Hi ,\n\Edelweiss TW FeedFile Dated : " + moment().subtract(1, "days").format('DD-MM-YYYY') + ".\n\Successfully Generated.\n\No. of Policy: " + emp_data.length;
                        objSmsLog.send_sms('9619160851', customer_msg, 'POLBOS-SCHEDULER'); //Anuj
                        objSmsLog.send_sms('7208803933', customer_msg, 'POLBOS-SCHEDULER'); //Ashish
                        res.json({'msg': 'Success'});
                    } else {
                        res.json({'msg': 'No Data Avilable'});
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Edelweiss TW Feed File Dated:' + date;
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File of Edelweiss TW Policy. Share status of each policy. Please confirm if these policies are enroll in Edelweiss system.</p>'
                                + '<BR><p>Feed-File Dated: ' + date + '</p><BR><p>No Data Avilable </p></body></html>';
                        var arrBcc = [config.environment.notification_email, 'ashish.hatia@policyboss.com', 'anuj.singh@policyboss.com'];
                        if (config.environment.name === 'Production') {
                            if (req.query.hasOwnProperty('dbg') && req.query['dbg'] == 'yes') {
                                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, email_body, '', '', ''); //UAT
                            } else {
                                objModelEmail.send('notifications@policyboss.com', arrBcc.join(','), sub, email_body, '', '', ''); //UAT
                            }
                        }
                        var SmsLog = require('../models/sms_log');
                        var objSmsLog = new SmsLog();
                        var customer_msg = "HORIZON-FEEDfILE-SCHEDULER\n\---------------\n\ Hi ,\n\Edelweiss TW FeedFile Dated : " + moment().subtract(1, "days").format('DD-MM-YYYY') + ".\n\No Data Avilable.";
                        objSmsLog.send_sms('9619160851', customer_msg, 'POLBOS-SCHEDULER'); //Anuj
                        objSmsLog.send_sms('7208803933', customer_msg, 'POLBOS-SCHEDULER'); //Ashish
                    }
                } catch (e) {
                    console.log("create_edelweiss_tw_feedfile", e);
                    res.json(e);
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }

    });
    function applicable_imt(objResponseJson) {
        var objResponseJson = objResponseJson;
        var apllied_imt = "22";
        if (objResponseJson['___financial_agreement_type___'] === "Hire Purchase") {
            apllied_imt = apllied_imt + ',5';
        }
        if (objResponseJson['___financial_agreement_type___'] === "Lease agreement") {
            apllied_imt = apllied_imt + ',6';
        }
        if (objResponseJson['___financial_agreement_type___'] === "Hypothecation") {
            apllied_imt = apllied_imt + ',7';
        }
        if (objResponseJson['___premium_breakup_tp_cover_owner_driver_pa___'] > 0) {
            apllied_imt = apllied_imt + ',15';
        }
        if (objResponseJson['___premium_breakup_tp_cover_paid_driver_pa___'] > 0) {
            apllied_imt = apllied_imt + ',17';
        }
        if (objResponseJson['___premium_breakup_od_elect_access___'] > 0) {
            apllied_imt = apllied_imt + ',24';
        }
        if (objResponseJson['___premium_breakup_tp_cng_lpg___'] > 0) {
            apllied_imt = apllied_imt + ',25';
        }
        if (objResponseJson['___premium_breakup_tp_cover_paid_driver_ll___'] > 0) {
            apllied_imt = apllied_imt + ',28';
        }
        if (objResponseJson['___premium_breakup_tp_cover_unnamed_passenger_pa___'] > 0) {
            apllied_imt = apllied_imt + ',16';
        }
        return apllied_imt;
    }
    ;


};

