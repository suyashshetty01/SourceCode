/* Author: Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');
var corp_lead = require('../models/corp_lead');
var config = require('config');
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
module.exports.controller = function (app) {
    app.post('/add_corp_lead', function (req, res) {
        var contact_name = req.body.contact_name;
        var mobile = req.body.mobile;
        var email = req.body.email;
        var product = req.body.product;
        var message = req.body.message;
        var ip_address = req.body.ip_address === undefined ? "" : req.body.ip_address;
        var search_parameter = req.body.search_parameter === undefined ? "" : ((Object.keys(req.body.search_parameter).length === 0) ? "" : req.body.search_parameter);

        var arg = {
            Contact_Name: contact_name,
            Mobile_No: parseInt(mobile),
            Email_Id: email,
            Product: product,
            Message: message,
            IP_Address: ip_address,
            Created_On: new Date(),
            Search_Parameter: search_parameter
        };
        let obj_content = {
            Contact_Name: contact_name,
            Mobile_No: mobile,
            Email_Id: email,
            Remarks: message
        };

        let mail_content = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>CORP LEAD</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
        mail_content += objectToHtml(obj_content);
        mail_content += '</body></html>';

        let corp_lead_log = new corp_lead(arg);
        corp_lead_log.save(function (err, res1) {
            if (err) {
                res.json({'Status': 'Fail'});
            } else {
                if (res1.hasOwnProperty('_doc')) {
                    var Email = require('../models/email');
                    var objModelEmail = new Email();
                    if (config.environment.name === 'Production') {
                        var to = "sagar.tejuja@landmarkinsurance.in,manish.hingorani@landmarkinsurance.in";
                        var cc = "marketing@policyboss.com";
                    } else {
                        var to = "roshani.prajapati@policyboss.com";
                        var cc = "roshaniprajapati567@gmail.com,anuj.singh@policyboss.com";
                    }
                    var subject = "[CorpLeadId-" + res1['_doc']['Corp_Id'] + "]Product-" + res1['_doc']['Product'];
                    objModelEmail.send('noreply@policyboss.com', to, subject, mail_content, cc, config.environment.notification_email);
                    res.json({'Status': 'Success'});
                }
            }
        });
    });
};
function objectToHtml(objSummary) {
    var msg = '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Corp Lead</span><table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow: 1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  >';
    var row_inc = 0;
    for (var k in objSummary) {
        if (row_inc === 0) {
            msg += '<tr>';
            msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01">Details</th>';
            msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01">Value</th>';
            msg += '</tr>';
        }
        msg += '<tr>';
        msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;" align="center">' + k + '</td>';
        msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;" align="center">' + objSummary[k] + '</td>';
        msg += '</tr>';
        row_inc++;
    }
    msg += '</table></div>';
    return msg;
}