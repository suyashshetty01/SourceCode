/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
module.exports.controller = function (app) {
    app.post('/posp_enquiry', function (req, res) {
        try {
            var posp_enquiry = require('../models/posp_enquiry');
            var posp_enquiry_data = new posp_enquiry();
            for (var key in req.body) {
                posp_enquiry_data[key] = req.body[key];
            }
            posp_enquiry_data.Status = "Active";
            posp_enquiry_data.Created_On = new Date();
            posp_enquiry_data.Modified_On = new Date();
            posp_enquiry_data.save(function (err1, dbrespnse) {
                if (err1) {
                    res.json({'Msg': err1, 'Status': "Error"});
                } else {
                    res.json({'Msg': "Data Inserted Successfully", 'Status': "Success"});
                    var Email = require('../models/email');
                    var objModelEmail = new Email();
                    let subject = 'POSP Inquiry - '+dbrespnse._doc["name"]+' - InquiryId : ' + dbrespnse.Posp_Enquiry_Id;
                    let mail_content = '<html><body>' +
                            'Dear Team,' +
                            '<p>we have received POSP inquiry as following</p>' +
                            '<p></p>Name - ' + dbrespnse._doc["name"] +
                            '<p></p>Contact Number  - ' + dbrespnse._doc["mobile"] +
                            '<p></p>Email Id  - ' + dbrespnse._doc["email"] +
                            '<p></p>City  - ' + dbrespnse._doc["city"] +
                            '<p></p><p></p>Regards,' +
                            '<p></p>PolicyBoss' +
                            '</body></html>';
                    let email_id = "marketing@policyboss.com;srinivas@policyboss.com";
                    objModelEmail.send('noreply@policyboss.com', email_id, subject, mail_content, '',config.environment.notification_email, '');
                }
            });
        } catch (e) {
            res.json({'Msg': e, 'Status': "Error"});
        }
    });
};