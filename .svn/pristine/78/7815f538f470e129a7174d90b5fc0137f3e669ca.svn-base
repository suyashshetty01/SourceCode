/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Base = require('../libs/Base');
var moment = require('moment');
function CoronaCare() {

}
CoronaCare.prototype = new Base();
CoronaCare.prototype.__proto__ = Base.prototype;
CoronaCare.prototype.product_api_pre = function () {
    var objLMRequest = this.lm_request;
    objLMRequest['policy_start_date'] = this.policy_start_date();
    objLMRequest['policy_end_date'] = this.policy_end_date();
    this.lm_request = objLMRequest;
};
CoronaCare.prototype.product_field_process_pre = function () {

};
CoronaCare.prototype.product_response_handler = function () {

};
CoronaCare.prototype.product_field_process_post = function () {

};
CoronaCare.prototype.product_api_post = function () {

};
CoronaCare.prototype.update_coronacare_crn_data = function (lm_request, client_id, request_unique_id) {
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
CoronaCare.prototype.policy_start_date = function () {
    console.log(this.constructor.name, 'policy_start_date', 'Start');
    var pol_start_date = moment().add(1, 'days').format('YYYY-MM-DD');
    console.log(this.constructor.name, 'policy_start_date', 'Finish', pol_start_date);
    return pol_start_date;
};
CoronaCare.prototype.policy_end_date = function () {
    console.log('Start', this.constructor.name, 'policy_end_date');
    var pol_end_date = moment().add(1, 'year').format('YYYY-MM-DD');
    if (this.lm_request.hasOwnProperty('policy_tenure') && this.lm_request['policy_tenure'] > 0) {
        pol_end_date = moment().add(this.lm_request['policy_tenure'], 'year').format('YYYY-MM-DD');
    }
    console.log('Finish', this.constructor.name, 'policy_end_date', pol_end_date);
    return pol_end_date;
};
module.exports = CoronaCare;