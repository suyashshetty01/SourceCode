/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true});

module.exports.controller = function (app) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    app.post('/digit_endorsment', function (req, res) {
        console.log("digit_endorsment starts");
        try {
            let digit_request = require('../resource/request_file/Digit_Car_Endorsement.json');
            const crn = req.body.PB_CRN;
            let title;
            var User_Data = require('../models/user_data');
            User_Data.find({'PB_CRN': crn}, function (err, objdata) {
                if (err)
                {
                    res.json({'Msg': 'Error'});
                } else {
                    var Erp_Qt = objdata[0]['_doc']['Erp_Qt_Request_Core'];
                    var Trans_Data = objdata[0]['_doc']['Transaction_Data'];
                    var Policy_No = Trans_Data['policy_number'];
                    if (Erp_Qt['___salutation___'] === 'MR') {
                        title = "01";
                    }
                    if (Erp_Qt['___salutation___'] === 'MISS') {
                        title = "02";
                    }
                    if (Erp_Qt['___salutation___'] === 'DR') {
                        title = "03";
                    }
                    if (Erp_Qt['___salutation___'] === 'MRS') {
                        title = "04";
                    }
                    var objRequest = JSON.stringify(digit_request);
                    objRequest = objRequest.replace('___title___', title);

                    objRequest = objRequest.replace('___adhar_Id___', Erp_Qt['___aadhar___']);
                    objRequest = objRequest.replace('___pan_Id___', Erp_Qt['___pan___']);

                    objRequest = objRequest.replace('___mobileId___', Erp_Qt['___mobile___']);
                    objRequest = objRequest.replace('___emailId___', Erp_Qt['___email___']);

                    let nomineeName = Erp_Qt['___nominee_name___'].split(" ");
                    objRequest = objRequest.replace('___firstName___', nomineeName[0]);
                    objRequest = objRequest.replace('___lastName___', nomineeName[1]);
                    objRequest = objRequest.replace('___dateOfBirth___', Erp_Qt['___nominee_birth_date___']);
                    objRequest = objRequest.replace('___relation___', Erp_Qt['___nominee_relation___']);

                    objRequest = objRequest.replace('___financer___', Erp_Qt['___financial_institute_name___']);

                    if (Erp_Qt['___vehicle_registration_type___'] === 'individual') {
                        objRequest = objRequest.replace('___addressType_1___', "PRIMARY_RESIDENCE");
                        objRequest = objRequest.replace('___street_pr___', Erp_Qt['___permanent_address_1___']);
                        objRequest = objRequest.replace('___streetno_pr___', Erp_Qt['___permanent_address_2___']);

                        objRequest = objRequest.replace('___addressType_2___', "SECONDARY_RESIDENCE");
                        objRequest = objRequest.replace('___street_sr___', Erp_Qt['___communication_address_1___']);
                        objRequest = objRequest.replace('___streetno_sr___', Erp_Qt['___communication_address_2___']);
                        objRequest = objRequest.replace('___district_sr___', Erp_Qt['___communication_address_3___']);
                        objRequest = objRequest.replace('___city_sr___', Erp_Qt['___communication_city___']);
                        objRequest = objRequest.replace('___pincode_sr___', Erp_Qt['___communication_pincode___']);
                        digit_request['person'][0]['address'][1]['country'] = "IN";

                        objRequest = objRequest.replace('___addressType_3___', "HEAD_QUARTER");
                        objRequest = objRequest.replace('___street_hq___', "");
                        objRequest = objRequest.replace('___streetno_hq___', "");

                        objRequest = objRequest.replace('___addressType_4___', "REGIONAL_OFFICE");
                        objRequest = objRequest.replace('___street_reg___', "");
                        objRequest = objRequest.replace('___street_no_reg___', "");
                        objRequest = objRequest.replace('___district_reg___', "");
                        objRequest = objRequest.replace('___city_reg___', "");
                        objRequest = objRequest.replace('___pincode_reg___', "");
                        digit_request['person'][0]['address'][3]['country'] = "";

                        objRequest = objRequest.replace('___addressType_5___', "BRANCH_OFFICE");
                        objRequest = objRequest.replace('___street_br___', "");
                        objRequest = objRequest.replace('___street_no_br___', "");
                        objRequest = objRequest.replace('___district_br___', "");
                        objRequest = objRequest.replace('___city_br___', "");
                        objRequest = objRequest.replace('___pincode_br___', "");
                        digit_request['person'][0]['address'][4]['country'] = "";
                    }

                    if (Erp_Qt['___vehicle_registration_type___'] === 'corporate') {
                        objRequest = objRequest.replace('___addressType_1___', "PRIMARY_RESIDENCE");
                        objRequest = objRequest.replace('___street_pr___', "");
                        objRequest = objRequest.replace('___streetno_pr___', "");

                        objRequest = objRequest.replace('___addressType_2___', "SECONDARY_RESIDENCE");
                        objRequest = objRequest.replace('___street_sr___', "");
                        objRequest = objRequest.replace('___streetno_sr___', "");
                        objRequest = objRequest.replace('___district_sr___', "");
                        objRequest = objRequest.replace('___city_sr___', "");
                        objRequest = objRequest.replace('___pincode_sr___', "");
                        digit_request['person'][0]['address'][1]['country'] = "";

                        objRequest = objRequest.replace('___addressType_3___', "HEAD_QUARTER");
                        objRequest = objRequest.replace('___street_hq___', Erp_Qt['___permanent_address_1___']);
                        objRequest = objRequest.replace('___streetno_hq___', Erp_Qt['___permanent_address_2___']);

                        objRequest = objRequest.replace('___addressType_4___', "REGIONAL_OFFICE");
                        objRequest = objRequest.replace('___street_reg___', Erp_Qt['___communication_address_1___']);
                        objRequest = objRequest.replace('___street_no_reg___', Erp_Qt['___communication_address_2___']);
                        objRequest = objRequest.replace('___district_reg___', Erp_Qt['___communication_address_3___']);
                        objRequest = objRequest.replace('___city_reg___', Erp_Qt['___communication_city___']);
                        objRequest = objRequest.replace('___pincode_reg___', Erp_Qt['___communication_pincode___']);
                        digit_request['person'][0]['address'][3]['country'] = "IN";

                        objRequest = objRequest.replace('___addressType_5___', "BRANCH_OFFICE");
                        objRequest = objRequest.replace('___street_br___', Erp_Qt['___communication_address_1___']);
                        objRequest = objRequest.replace('___street_no_br___', Erp_Qt['___communication_address_2___']);
                        objRequest = objRequest.replace('___district_br___', Erp_Qt['___communication_address_3___']);
                        objRequest = objRequest.replace('___city_br___', Erp_Qt['___communication_city___']);
                        objRequest = objRequest.replace('___pincode_br___', Erp_Qt['___communication_pincode___']);
                        digit_request['person'][0]['address'][4]['country'] = "IN";
                    }
                    console.log(digit_request);
                    objRequest = JSON.parse(objRequest);
                    objRequest = JSON.stringify(objRequest);
                }
                
                var args = {
                    data: objRequest,
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'OWPNXSTG8TCBFQMB7G0BW3NQR4QT1W55'
                    }
                };
                service_url = 'https://preprod-digitpolicyissuance.godigit.com/endo/v1/g91/endorsement/' + Policy_No + '?source=CD'
                
                if(config.environment.name === 'Production'){
                    args['headers']['Authorization'] = "";
                    service_url = 'https://prod-digitpolicyissuaance.godigit.com/endo/v1/g91/endorsement/' + Policy_No + '?source=CD';
                }
//                if(config.environment.name === 'Development'){}

                client.put(service_url, args, function (data, response) {
                    console.log(data.toString());
                    console.log(data);
                    if (data.status === "Non technical amendment successful") {
                        console.log("Sucess");
                        res.json(data);
                    }
                    else{
                        res.json(data);
                    }
                });
            });

        } catch (error) {
            console.log(error);
        }



        console.log(req);
//    if(){
//        
//    }
    });
};
