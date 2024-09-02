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
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
//autoIncrement.initialize(connection);


var smsSchema = new Schema({
    'Sms_Id': Number,
    'Request_Core': Object,
    'Request_Type': String,
    'Sender': Number,
    'Sender_Name': String,
    'Receiver': Number,
    'Receiver_Name': String,
    'FL_Response': Object,
    'FL_Status': Number,
    'Request_Id': Number,
    'Request_Unique_Id': String,
    'Sms_Content': Object,
    'Received_On': Date,
    'Replied_On': Date,
    'Status': Number,
    'Send_Api_Response': Object
});

smsSchema.plugin(mongoosePaginate);
//smsSchema.plugin(autoIncrement.plugin, {model: 'Client', field: 'Client_Id', startAt: 1});
//var Sms = mongoose.model('Sms', smsSchema);


smsSchema.plugin(autoIncrement.plugin, {model: 'Sms', field: 'Sms_Id', startAt: 1});
var Sms = connection.model('Sms', smsSchema);
Sms.prototype.quote_request_prepare = function (param) {
    var arrQuote = param.split('|');


};
Sms.prototype.send_sms = function (mobile_no, sms_content, sms_id, sms_list) {

    var ObjSms = {
        'Sms_Content': sms_list,
        'Replied_On': new Date()
    };
    var Sms = require('../models/sms');

    Sms.update({'Sms_Id': sms_id}, ObjSms, function (err, doc) {
        console.log('smsupdate', err, doc);
    });
    mobile_no = Math.round(mobile_no - 0);
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    var Client = require('node-rest-client').Client;
    var client = new Client();
    //console.log('args', args);
    if (config.sms.sendsms) {
        if (false) {
            if (mobile_no.toString().length < 12) {
                mobile_no = '91' + mobile_no.toString();
            }
            /*
             * string postData = "userId=" + ConfigurationManager.AppSettings["ACLSMSUserName"]
             + "&pass=" + ConfigurationManager.AppSettings["ACLSMSPpassword"]
             + "&appid=ebsalt&subappid=ebsalt&contenttype=1"
             + "&to=" + "91"+ To.ToString()
             + "&from=POBOSS"
             + "&text=" + _Message.Replace("$code$", Text)
             + "&selfid=true&alert=1&dlrreq=true";
             * 
             */
            var args = {
                data: {
                    'userId': 'ebsalt',
                    'pass': 'ipebsalt',
                    'appid': 'ebsalt',
                    'subappid': 'ebsalt',
                    'contenttype': '1',
                    'to': mobile_no.toString(),
                    'from': 'POBOSS',
                    'text': sms_content.toString(),
                    'selfid': 'true',
                    'alert': '1',
                    'dlrreq': 'true'
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'sms_id': sms_id
                }
            };
            function jsonToQueryString(json) {
                return '?' +
                        Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                            encodeURIComponent(json[key]);
                }).join('&');
            }
            //var qs = jsonToQueryString(args.data);
            client.post('http://push3.maccesssmspush.com/servlet/com.aclwireless.pushconnectivity.listeners.TextListener', args, function (data, response) {
                data = data.toString();
                console.log('==============');
                console.log('SendSmS', data);
                var SmsSendStatus = 4;
                if (data.indexOf('not') > -1) {
                    SmsSendStatus = 3;
                } else {
                    SmsSendStatus = 2;
                }
                var ObjSms = {
                    'Send_Api_Response': data,
                    'Status': SmsSendStatus
                };
                var Sms = require('../models/sms');
                Sms.update({'Sms_Id': sms_id}, ObjSms, function (err, numAffected) {
                    console.log('smsupdate', err, numAffected);
                });
            });
        } else if (true) {
            //user=policy&pwd=policyhttp&sender=POLBAZ&mobile=918369351516&msg=QUOTE%20MH-04-GJ-4131&mt=2
            if (mobile_no.toString().length < 12) {
                mobile_no = '91' + mobile_no.toString();
            }
            var args = {
                data: {
                    'user': 'policy',
                    'pwd': 'policyhttp',
                    'sender': 'POLBOS',
                    'mobile': mobile_no.toString(),
                    'msg': sms_content.toString(),
                    'mt': '2'
                },
                headers: {
                    "Content-Type": "text/plain;charset=ISO-8859-1",
                    'sms_id': sms_id
                }
            };
            function jsonToQueryString(json) {
                return '?' +
                        Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                            encodeURIComponent(json[key]);
                }).join('&');
            }
            var qs = jsonToQueryString(args.data);
            client.get('http://sms.cell24x7.com:1111/mspProducerM/sendSMS' + qs, {}, function (data, response) {
                data = data.toString();
                console.log('==============');
                console.log('SendSmS', data);
                var SmsSendStatus = 4;
                if (data.indexOf('not') > -1) {
                    SmsSendStatus = 3;
                } else {
                    SmsSendStatus = 2;
                }
                var ObjSms = {
                    'Send_Api_Response': data,
                    'Status': SmsSendStatus
                };
                var Sms = require('../models/sms');
                Sms.update({'Sms_Id': sms_id}, ObjSms, function (err, numAffected) {
                    console.log('smsupdate', err, numAffected);
                });
            });
        } else {
            var args = {
                data: {
                    'apikey': 'z0/UzzPAINE-Ny3IftQhvpe5kWSY0eTwytr8YhduDi',
                    'numbers': mobile_no.toString(),
                    'sender': 'TXTLCL',
                    'message': sms_content.toString()
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'sms_id': sms_id
                }
            };
            client.post('https://api.textlocal.in/send/', args, function (data, response) {
                console.log(data, response);
                var SmsSendStatus = 4;
                if (data.status === 'failure') {
                    SmsSendStatus = 3;
                }
                if (data.status === 'success') {
                    SmsSendStatus = 2;
                }
                var ObjSms = {
                    'Send_Api_Response': data,
                    'Status': SmsSendStatus
                };
                var Sms = require('../models/sms');
                Sms.update({'Sms_Id': sms_id}, ObjSms, function (err, numAffected) {
                    console.log('smsupdate', err, numAffected);
                });
            });
        }
    }

//http://sms.cell24x7.com:1111/mspProducerM/sendSMS?user=policy&pwd=policyhttp&sender=POLBAZ&mobile=918369351516&msg=QUOTE%20MH-04-GJ-4131&mt=2
};
Sms.prototype.initiateQuoteMsg = function (objReplace) {
    var contentSms = "LM Quote\n\
======\n\
Thank you ___sender_name___\n\
Fetching Quotes for\n\
  No: ___registration_number___\n\
  Veh: ___vehicle_name___\n\
  RegOn: ___regn_dt___\n\
Quotes premiums in INR\n\
Wait 20 sec for SMS or visit link\n\
  Quote: ___quote_url___";
    contentSms = contentSms.replaceJson(objReplace);
    return contentSms;
};
Sms.prototype.initiateQuoteShareMsg = function (objReplace) {
    var contentSms = "LM Quote\n\
======\n\
Thank you _receiver_name___\n\
You're referred by ___sender_name___\n\
Fetching Quotes for\n\
  No: ___registration_number___\n\
  Veh: ___vehicle_name___\n\
  RegOn: ___regn_dt___\n\
Quotes premiums in INR\n\
Wait 20 sec for SMS or visit link\n\
  Quote: ___quote_url___";
    contentSms = contentSms.replaceJson(objReplace);
    return contentSms;
};
Sms.prototype.initiateQuotePOSPAgentMsg_bk = function (objFastlane, objDbPosp = null, objSmsRequest = null) {
    var Receiver_Name = objSmsRequest['receiver_name'].toString().replace('_', ' ');
    var contentSms = "LM POSP Agent\n\
======\n\
Thank you " + objDbPosp.Name + "\n\
Customer Details\n\
  Name: " + Receiver_Name + "\n\
  Mob: " + objSmsRequest['receiver_mobile_no'] + "\n\
Fetching Quotes in 20 sec for\n\
  No: " + objFastlane["Registration_Number"] + "\n\
  Veh: " + objFastlane['Make_Name'] + ' ' + objFastlane['Model_Name'] + ' ' + objFastlane['Variant_Name'] + "\n\
  RegOn: " + objFastlane['FastlaneResponseObj']['regn_dt'] + "\n\
Quotes premiums in INR";
    return contentSms;
};
Sms.prototype.initiateQuotePOSPAgentMsg = function (objReplace) {
    var contentSms = "LM POSP Agent\n\
======\n\
Thank you ___posp_name___\n\
Customer Details\n\
  Name: ___receiver_name___\n\
  Mob: ___receiver_mobile_no___\n\
Fetching Quotes for\n\
  No: ___registration_number___\n\
  Veh: ___vehicle_name___\n\
  RegOn: ___regn_dt___\n\
Quotes premiums in INR\n\
Wait 20 sec for SMS or visit link\n\
  Quote: ___quote_url___";
    contentSms = contentSms.replaceJson(objReplace);
    return contentSms;
};
Sms.prototype.initiateQuotePOSPCustomerMsg_bk = function (objFastlane, objDbPosp = null, objSmsRequest = null) {
    var Sender_Name = objSmsRequest['sender_name'].toString().replace('_', ' ');
    var Receiver_Name = objSmsRequest['receiver_name'].toString().replace('_', ' ');
    var contentSms = "LM POSP Quotes\n\
======\n\
Thank you " + Receiver_Name + "\n\
You are referred by following POSP.\n\
  POSP_ID: " + objDbPosp.Posp_Id + "\n\
  Name: " + objDbPosp.Name + "\n\
  Mob: " + objDbPosp.Mobile + "\n\
Fetching Quotes in 20 sec for\n\
  Veh: " + objFastlane['Make_Name'] + ' ' + objFastlane['Model_Name'] + ' ' + objFastlane['Variant_Name'] + "\n\
  RegOn: " + objFastlane['FastlaneResponseObj']['regn_dt'] + "\n\
Quotes premiums in INR";
    return contentSms;
};
Sms.prototype.initiateQuotePOSPCustomerMsg = function (objFastlane, objDbPosp = null, objSmsRequest = null) {
    var Sender_Name = objSmsRequest['sender_name'].toString().replace('_', ' ');
    var Receiver_Name = objSmsRequest['receiver_name'].toString().replace('_', ' ');
    var contentSms = "LM POSP Quotes\n\
======\n\
Thank you ___receiver_name___\n\
You are referred by following POSP.\n\
  POSP_ID: ___posp_id___\n\
  Name: ___posp_name___\n\
  Mob: ___posp_mobile___\n\
Fetching Quotes for\n\
  No: ___registration_number___\n\
  Veh: ___vehicle_name___\n\
  RegOn: ___regn_dt___\n\
Quotes premiums in INR\n\
Wait 20 sec for SMS or visit link\n\
  Quote: ___quote_url___";
    return contentSms;
};
Sms.prototype.InsurerQuoteMsg = function (objReplace) {
    var contentSms = "___insurer_name___\n\
======\n\
QRN: ___Request_Id___#___Service_Log_Id___\n\
IDV: ___vehicle_expected_idv___\n\
Base Prem: ___base_premium___\n\
___addon_list___\n\
Buy: ___buy_url___";
    contentSms = contentSms.replaceJson(objReplace);
    return contentSms;

};
Sms.prototype.finishQuoteMsg = function (objSummary) {

    var contentSms = "LM Summary\n\
======\n\
Insurer:\n\
___insurer_list___\n\
IDV: ___idv_range___\n\
Premium: ___premium_range___\n\
SRN: ___srn___";
    contentSms = contentSms.replaceJson(objSummary);
    return contentSms;

};
Sms.prototype.agentAckCustomerBOMsg = function (objSmsContent) {
    var contentSms = "LM POSP Status\n\
========\n\
Following Customer has opened proposal page\n\
  Name: ___customer_name___\n\
  Mob: ___mobile___\n\
  Prem: ___premium_amt___ INR\n\
Please be standby, if Customer needs any assistance for Proposal form.\n\
We will update you further status.";
    contentSms = contentSms.replaceJson(objSmsContent);
    return contentSms;
};
Sms.prototype.indianMoneyFormat = function (x) {
    x = Math.round(x - 0);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
};
Sms.prototype.camelize = function (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return letter.toUpperCase();
    }).replace(/\s+/g, ' ');
};
module.exports = Sms;