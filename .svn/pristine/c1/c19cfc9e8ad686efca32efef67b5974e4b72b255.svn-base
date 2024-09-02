/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
 * 
 * {
 "_id" : ObjectId("591ad96ac273518df36fbec2"),
 "Client_Id" : "1",
 "Client_Unique_Id" : "123124343",
 "Client_Name" : "Self",
 "Secret_Key" : "12345678",
 "Is_Active" : "1",
 "Created_On" : "",
 "Modified_On" : ""
 }
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
var fs = require('fs');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
//autoIncrement.initialize(connection);


var policy_emailSchema = new Schema({
    'Policy_Email_Id': Number,
    'From': String,
    'To': String,
    'Cc': String,
    'Bcc': String,
    'Sub': String,
    'Content': String,
    'PB_CRN': Number,
    'Policy_Number': String,
    'Customer_Name': String,
    'Insurer_Id': Number,
    'Transaction_Number': String,
    'Created_On': Date,
    'Message_Id': String,
    'Message_Date': String,
    'Response_Core': Object,
    'Attachment': String
});

policy_emailSchema.plugin(mongoosePaginate);

policy_emailSchema.plugin(autoIncrement.plugin, {model: 'Policy_Email', field: 'Policy_Email_Id', startAt: 1});
var Policy_Email = connection.model('Policy_Email', policy_emailSchema);
Policy_Email.prototype.findPolicy_SavePolicy = function (Search_With, insurer_pdf_url, pdf_sys_loc_horizon, pdf_sys_loc_portal, pdf_web_path_portal, request_unique_id) {
    var Policy_Email = require('../models/policy_email');
    Policy_Email.findOne({'Sub': new RegExp(Search_With, 'i')}, function (err, dbPolicyEmail) {
        if (err)
        {

        }
        if (dbPolicyEmail) {
            var arr_attachment = dbPolicyEmail.Attachment.toString().split(',');
            var attach_sys_path = appRoot + "/tmp/policy_email/" + arr_attachment[0];
            if (fs.existsSync(attach_sys_path)) {
                fs.createReadStream(attach_sys_path).pipe(fs.createWriteStream(pdf_sys_loc_horizon));
                fs.createReadStream(attach_sys_path).pipe(fs.createWriteStream(pdf_sys_loc_portal));
                var User_Data = require('../models/user_data');
                var objModelUserData = new User_Data();
                objModelUserData.update_policy_status(request_unique_id);
            }
        }
    });
};
Policy_Email.prototype.policy_write_file = function (insurer_pdf_url, pdf_sys_loc_horizon, pdf_sys_loc_portal, request_unique_id) {

    if (insurer_pdf_url.indexOf('https') > -1) {
        var http = require('https');
    } else {
        var http = require('http');
    }

    try {
        var request = http.get(insurer_pdf_url, function (response) {
            if (response.statusCode == 200) {
                var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                var file_portal = fs.createWriteStream(pdf_sys_loc_portal);
                response.pipe(file_horizon);
                response.pipe(file_portal);
                var User_Data = require('../models/user_data');
                var objModelUserData = new User_Data();
                objModelUserData.update_policy_status(request_unique_id);
            }
        });
    } catch (ep) {
        console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
    }

};
module.exports = Policy_Email;