/* Author: Piyush Singh
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Base = require('../libs/Base');
var config = require('config');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var moment = require('moment');
var online_endorsement = require('../models/online_endorsement.js');
var insurer_url_api = {
            '44': 'godigit_online_endorsement',
            '46': 'edelweiss_endorsement'
        };
var endorsementSubCategoryObj = {
        "33": "Address Correction",
        "34": "CNG",
        "35": "Contact Number",
        "36": "Cubic Capacity",
        "37": "Correction In Policy Inception",
        "38": "Correction In RTO",
        "39": "Date of Birth",
        "40": "Correction In Email Id",
        "41": "Correction In Engine And Chassis",
        "42": "GST number updation",
        "43": "Hypothecation",
        "44": "IDV",
        "45": "Make & Model",
        "47": "Name Correction",
        "48": "No Claim Bonus",
        "49": "Nominee Name",
        "50": "PA Cover",
        "52": "Transfer Of Ownership",
        "53": "Registration Number",
        "71": "Correction in Policy Period",
        "72": "Change in NCB Percentage",
        "73": "Previous Insurer Change/Updation",
        "85": "Mfg. Year",
        "92": "Policy with wrong Broker code",
        "93": "Policy without Broker code"
    };

module.exports.controller = function (app) {

    app.post('/endorsements/godigit_online_endorsement', function (req, res) {
        try {
            var baseObj = new Base();
            var ObjRequest = req.body || {};
            var online_endorsement = require('../models/online_endorsement');
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var endorsement_subcategory_type = ObjRequest.endorsement_subcategory_type ? ObjRequest.endorsement_subcategory_type - 0 : 0;
            var updated_erpqt_data = ObjRequest.updated_qt_data || {};
            var processed_erpqt = {};
            var godigit_endorsement_url = ((config.environment.name === 'Production') ? 'https://preprod-digitpolicyissuance.godigit.com/endo/v1/g91/endorsement/{{policy_number}}?source=CD' : 'https://preprod-digitpolicyissuance.godigit.com/endo/v1/g91/endorsement/{{policy_number}}?source=CD');
            var username = ((config.environment.name !== 'Production') ? '51197558' : '51197558');
            var password = ((config.environment.name !== 'Production') ? 'digit123' : 'digit123');
            var insurer_request;
            //var json_file_path = appRoot + "/resource/request_file/Endorsement/GoDigit.json";
            //var jsonPol = fs.readFileSync(json_file_path, 'utf8');
            //console.log(jsonPol);
            for (var k in updated_erpqt_data) {
                processed_erpqt['___' + k + '___'] = updated_erpqt_data[k];
            }
            console.log(processed_erpqt);
            if(endorsement_subcategory_type === 33){/** Address */
                insurer_request = {
                    "person": [
                        {
                            "addresses": [
                                {
                                    "addressType": "PRIMARY_RESIDENCE",
                                    "streetNumber": "SO",
                                    "street": "___permanent_address_1___ ___permanent_address_2___ ___permanent_address_3___",
                                    "city": "___permanent_city___",
                                    "country": "IN",
                                    "pincode": "___permanent_pincode___"
                                },
                                {
                                    "addressType": "SECONDARY_RESIDENCE",
                                    "streetNumber": "SO",
                                    "street": "___communication_address_1___ ___communication_address_2___ ___communication_address_3___",
                                    "city": "___communication_city___",
                                    "country": "IN",
                                    "pincode": "___communication_pincode___"
                                }
                            ]
                        }
                    ]
                };
            }else if(endorsement_subcategory_type === 35){/** Mobile */
                insurer_request = {
                    "person": [
                        {
                            "communications": [
                                {
                                    "isPrefferedCommunication": true,
                                    "communicationType": "MOBILE",
                                    "communicationId": "___mobile___"
                                }
                            ]
                        }
                    ]
                };
            }else if(endorsement_subcategory_type === 40){/** Email */
                insurer_request = {
                    "person": [
                        {
                            "communications": [
                                {
                                    "isPrefferedCommunication": true,
                                    "communicationType": "EMAIL",
                                    "communicationId": "___email___"
                                }
                            ]
                        }
                    ]
                };
            }else if(endorsement_subcategory_type === 49){/** Nominee */
                insurer_request = {
                    "person": [],
                    "nominee": {
                        "firstName": "___nominee_first_name___",
                        "lastName": "___nominee_last_name___",
                        "dateOfBirth": "___nominee_birth_date___",
                        "relation": "___nominee_relation___"
                    }
                };
                /*
                var txt_ignore = baseObj.find_text_btw_key(jsonPol, '<!--AddressDetail_Start-->', '<!--AddressDetail_End-->', true);
                console.log(txt_ignore);
                jsonPol = jsonPol.replace(txt_ignore, "");
                console.log(jsonPol);
                txt_ignore = baseObj.find_text_btw_key(jsonPol, '<!--CommunicationDetail_Start-->', '<!--CommunicationDetail_End-->', true);
                console.log(txt_ignore);
                jsonPol = jsonPol.replace(txt_ignore, ""); 
                console.log(jsonPol);
                */
            }
            insurer_request = JSON.stringify(insurer_request);
            insurer_request = insurer_request.replaceJson(processed_erpqt);
            insurer_request = JSON.parse(insurer_request);
            console.log(insurer_request);
            var save_obj = {
                "Ticket_Id": ObjRequest.ticket_id || "",
                "CRN": ObjRequest.crn || 0,
                "Insurer_Id": ObjRequest.insurer_id || 0,
                "Product_Id": ObjRequest.product_id || 0,
                "Category": ObjRequest.category || "",
                "Sub_Category": ObjRequest.subcategory || "",
                "Insurer_Request": insurer_request,
                "Insurer_Response": "",
                "Created_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
            };
            let args = {
                data: insurer_request ,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                }
            };
            client.post(godigit_endorsement_url, args, function (data, response) {
                data = {
                        "requestId": "5893",
                        "link": "https://preprod-S3Service.godigit.com/S3Service/rest/download/file?target=75E6FC117C2BE63537F3EE8AA567E5EB9D94013B82576A23F60BA5FAD045D2CB883AAA28AFE5393F95EB1B92BF13FD5A8AE5CAA41E927DCD3A915546D714EA6150C4B88B250E5888BBCAD62A6AC0AEB0F997F326191F608E63153F4784FE4A99",
                        "status": "Non technical amendment successful"
                };
                if (true || data) {
                    save_obj['Insurer_Response'] = data;
                    online_endorsement_obj = new online_endorsement(save_obj);
                    online_endorsement_obj.save(function (err, dbEndorseData) {
                        if (err) {
                            res.json({"Status": "SUCCESS", "Msg": "Endorsement Data Updated Successfully Error.", "Data": dbEndorseData});
                        } else {
                            res.json({"Status": "SUCCESS", "Msg": "Endorsement Data Updated Successfully.", "Data": dbEndorseData});
                        }
                    });
                    //save to online_endorsement collection
                }
            });
        } catch (ex) {
            console.error('Exception in -/endorsements/godigit_online_endorsement service');
            res.json({"Error": "EXCEPTION IN /endorsements/godigit_online_endorsement service SERVICE", "Msg": ex.stack, "Status": "FAIL"});
        }
    });
    
    app.post('/endorsements/online_endorsements', function (req, res) {
        try {
            var ObjRequest = req.body || {};
            var insurer_id = (ObjRequest.insurer_id && (ObjRequest.insurer_id - 0)) || 0;
            var endorsement_subcategory_type = (ObjRequest.endorsement_subcategory_type && endorsementSubCategoryObj[ObjRequest.endorsement_subcategory_type]) || '';
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var insurer_api_url = ((config.environment.name === 'Production') ? config.environment.weburl + '/endorsements/' + insurer_url_api[insurer_id] : config.environment.weburl + '/endorsements/' + insurer_url_api[insurer_id]);
            let insurer_args = {
                data: ObjRequest,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(insurer_api_url, insurer_args, function (data, response) {
                if (data && data.Status === "SUCCESS") {
                    res.json({"Status": "SUCCESS", "Msg": "Endorsement Data Updated Successfully.", "Data": data.dbEndorseData});
                }
            });
        } catch (ex) {
            console.error('Exception in -/online_endorsements service');
            res.json({"Error": "EXCEPTION IN /online_endorsements service SERVICE", "Msg": ex.stack, "Status": "FAIL"});
        }
    });

};
