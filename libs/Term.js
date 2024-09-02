/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var Base = require('../libs/Base');

function Term() {

}
util.inherits(Term, Base);
Term.prototype.product_api_pre = function () {

}
Term.prototype.product_field_process_pre = function () {

}
Term.prototype.product_response_handler = function (objInsurerProduct) {
    console.log("test Term");
   var objProductResponse = objInsurerProduct.lm_request['search_reference_number'];
   objProductResponse.ssrn = objInsurerProduct.lm_request['search_reference_number'];
    return objProductResponse;
    

}
Term.prototype.product_field_process_post = function () {

}
Term.prototype.product_api_post = function () {

}
Term.prototype.update_term_crn_data = function (lm_request, client_id, request_unique_id) {
     var User_Data = require('../models/user_data');
                User_Data.findOne({"Request_Unique_Id": request_unique_id}, function (err, dbUserData) {
                    if (err) {

                    } else {
                        if (dbUserData) {
                            var ObjUser_Data = {'PB_CRN': lm_request.Existing_ProductInsuranceMapping_Id};
                            var User_Data = require('../models/user_data');
                            User_Data.update({"Request_Unique_Id": request_unique_id}, ObjUser_Data, function (err, numAffected) {
                                console.log('UserDataCRNUpdate', err, numAffected);
                            });
                        }
                    }
                });
};
module.exports = Term;
