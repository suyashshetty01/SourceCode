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
var moment = require('moment');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var fs = require('fs');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
//autoIncrement.initialize(connection);
var Const_Product = {
    '1': 'Car',
    '2': 'Health',
    '4': 'Travel',
    '3': 'Term',
    '10': 'TW',
    '12': 'CV',
    '17': 'CoronaCare'
};

var emailSchema = new Schema({
    'Email_Id': Number,
    'PB_CRN': Number,
    'From': String,
    'To': String,
    'Cc': String,
    'Bcc': String,
    'Sub': String,
    'Content': String,
    'Type': String,
    'Created_On': Date,
    'Modified_On': Date,
    'Status': String,
    'Response': Object,
    'Last_Event_Status': String,
    'Event_History': [{}],
    'Msg_Id': String
});

emailSchema.plugin(mongoosePaginate);

emailSchema.plugin(autoIncrement.plugin, {model: 'Email', field: 'Email_Id', startAt: 1});
var Email = connection.model('Email', emailSchema);

Email.prototype.verify = function (email_id, source) {
    try {
        var http = require("https");

        var options = {
            "method": "POST",
            "hostname": "api.sendgrid.com",
            "port": null,
            "path": "/v3/validations/email",
            "headers": {
                "authorization": "Bearer " + config.email.sg_api_key,
                "content-type": "application/json"
            }
        };

        var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
                
            });
        });
        req.write(JSON.stringify({email: email_id, source: source}));
        req.end();
    } catch (e) {
        console.error('Exception', 'Email', 'verify', e.stack);
    }
};
Email.prototype.send = function (from, to, sub, content, cc, bcc, crn, attachment) {
    var objModelEmailCore = this;
    var helper = require('sendgrid').mail;
    cc = cc.replace(';', ',');
    bcc = bcc.replace(';', ',');
    to = to.replace(';', ',');
    var Email = require('../models/email');
    if (crn) {
        crn = crn - 0;
    } else {
        crn = null;
    }


    let type = '';
    let notification_title = sub;
    if (sub.indexOf('Successful online payment transaction') > -1) {
        type = 'Success';
    } else if (sub.indexOf('Payment Request') > -1) {
        type = 'Payment_Link';
    } else if (sub.indexOf('PG_RETURN') > -1) {
        type = 'Horizon_Pg_Log';
    } else if (sub.indexOf('-ERP_CS-') > -1) {
        type = 'Erp_CsRequest';
    } else if (sub.indexOf('-ERP_CS_DOC-') > -1) {
        type = 'ErpCsDocRequest';
    } else if (sub.indexOf('CS_GENERATED') > -1) {
        type = 'Cs_Notification';
    } else if (sub.indexOf('SUCCESSFUL_TRANSACTION') > -1) {
        type = 'Success_Agent_Notification';
    } else if (sub.indexOf('REDIRECT_TO_PG') > -1) {
        type = 'PG_Redirect_Notification';
    } else if (sub.indexOf('Successful Transaction') > -1) {
        type = 'Success_Customer_Notification';
    } else if (sub.indexOf('PAYMENT_NOT_COMPLETED') > -1) {
        type = 'Incomplete_Payment_Notification';
    } else if (sub.indexOf('PG-DROP-OFF') > -1) {
        type = 'Pg_DropOff_Notication';
    } else if (sub.indexOf('Policy_Generated ') > -1) {
        type = 'Policy_Generated_Notication';
    } else if (sub.indexOf('PG_INFO') > -1 || sub.indexOf('PG_ERR') > -1) {
        type = 'Horizon_Pg_Log';
    } else if (sub.indexOf('TRANSACTION_CLOSED_PROCESS') > -1) {
        type = 'Multiple_CRN_Close';
    } else if (sub.indexOf('Vehicle Inspection Request') > -1) {
        type = 'Inspection_Request';
    } else if (sub.indexOf('Inspection Verification Successful') > -1) {
        type = 'Inspection_Success';
    } else if (sub.indexOf('Inspection Verification Unsuccessful') > -1) {
        type = 'Inspection_Reject';
    } else if (sub.indexOf('Policyboss Online Payment Transaction Success but Policy Authorization fail') > -1) {
        type = 'Paypass';
    } else if (sub.indexOf('[PRODUCTION]ERR-') > -1 && (sub.indexOf('-Customer-') > -1 || sub.indexOf('-Proposal-') > -1 || sub.indexOf('-Verification-') > -1 || sub.indexOf('-Verification-') > -1 || sub.indexOf('-Pdf-') > -1)) {
        if (sub.indexOf('-Customer-') > -1) {
            type = 'Customer_Err';
        }
        if (sub.indexOf('-Proposal-') > -1) {
            type = 'Proposal_Err';
        }
        if (sub.indexOf('-Verification-') > -1) {
            type = 'Verification_Err';
        }
        if (sub.indexOf('-Pdf-') > -1) {
            type = 'Pdf_Err';
        }
    } else if (sub.indexOf('[PRODUCTION]INFO-') > -1 && (sub.indexOf('-Customer-') > -1 || sub.indexOf('-Proposal-') > -1 || sub.indexOf('-Verification-') > -1 || sub.indexOf('-Pdf-') > -1)) {
        if (sub.indexOf('-Customer-') > -1) {
            type = 'Customer_Info';
        }
        if (sub.indexOf('-Proposal-') > -1) {
            type = 'Proposal_Info';
        }
        if (sub.indexOf('-Verification-') > -1) {
            type = 'Verification_Info';
        }
        if (sub.indexOf('-Pdf-') > -1) {
            type = 'Pdf_Info';
        }
    } else if (sub.indexOf('[TICKET]') > -1) {
        type = 'Ticket_';
        if (sub.indexOf('-Endorsement-') > -1) {
            type += 'Endorsement';
        }
        if (sub.indexOf('-Post Sale Query-Policy Cancellation') > -1) {
            type += 'Cancellation';
        }
        if (sub.indexOf('-Post Sale Query-Double Payment deducted') > -1) {
            type += 'Double_Payment';
        }
        if (sub.indexOf('-Proposal-') > -1) {
            type += 'Proposal';
        }
        if (sub.indexOf('-Login issue-') > -1) {
            type = 'Login_Issue';
        }
        if (sub.indexOf('-Quotation-') > -1) {
            type = 'Quotation';
        }
        if (sub.indexOf('-Done payment but not received policy copy-') > -1 || sub.indexOf('-Policy not received-') > -1) {
            type = 'Policy_Request';
        }
    }

    var ObjEmail = {
        'From': from,
        'To': to,
        'Cc': cc,
        'Bcc': bcc,
        'Sub': sub,
        'Type': type,
        'PB_CRN': crn,
        'Content': content,
        'Created_On': new Date(),
        'Modified_On': new Date()
    };
    var arr_to = to.split(',');
    var arr_to_processed = [];
    for (var k in arr_to) {
        arr_to_processed.push({'email': arr_to[k]});
    }

    var arr_cc = cc.split(',');
    var arr_cc_processed = [];
    for (var k in arr_cc) {
        arr_cc_processed.push({'email': arr_cc[k]});
    }
    var arr_bcc = bcc.split(',');
    var arr_bcc_processed = [];
    for (var k in arr_bcc) {
        arr_bcc_processed.push({'email': arr_bcc[k]});
    }

    var content_type = (content.toString().indexOf('<html>') > -1) ? 'text/html' : 'text/plain';
    var personalizations;
    personalizations = {
        to: arr_to_processed,
        subject: sub
    };
    if (cc) {
        Object.assign(personalizations, {cc: arr_cc_processed});
    }
    if (bcc) {
        Object.assign(personalizations, {bcc: arr_bcc_processed});
    }
    var objModelEmail = new Email(ObjEmail);
    objModelEmail.save(function (err, objDbEmail) {
        if (objModelEmailCore.hasOwnProperty('cb') && objModelEmailCore.cb == 'yes') {
            objModelEmailCore.Response.json({'MsgId': objDbEmail.Email_Id});
        }
        try {
            if (crn > 0) {
                let arr_agent_notification = [
                    'Payment_Link',
                    'Inspection_Request',
                    'Inspection_Success',
                    'Inspection_Reject',
                    'PG_Redirect_Notification',
                    'Success_Agent_Notification',
                    'Incomplete_Payment_Notification',
                    'Cs_Notification'
                ];
                let arr_ch_notification = [
                    'Success_Agent_Notification'
                ];
                let arr_it_notification = [
                    'Customer_Err',
                    'Proposal_Err',
                    'Verification_Err'
                ];
                let arr_cc_ticket_notification = [
                    'Ticket_Endorsement',
                    'Ticket_Policy_Request',
                    'Ticket_Cancellation',
                    'Ticket_Double_Payment'
                ];
                let arr_it_ticket_notification = [
                    'Ticket_Proposal',
                    'Ticket_Login_Issue'
                ];
                let arr_mapping_ticket_notification = [
                    'Ticket_Quotation'
                ];

                let Client = require('node-rest-client').Client;
                let client = new Client();
                client.get(config.environment.weburl + '/user_datas/detail_by_crn/' + crn, {}, function (data, response) {
                    data = (typeof data === 'string') ? JSON.parse(data) : data;
                    let agent_ss_id = data['Premium_Request']['ss_id'];
                    let channel = data['Premium_Request']['channel'];
                    let premium = data.hasOwnProperty('Erp_Qt_Request_Core') ? data['Erp_Qt_Request_Core']['___final_premium___'] : 0;
                    premium = Math.round(premium);
                    let product_id = data['Product_Id'];
                    let product_name = Const_Product[product_id.toString()];
                    let requestNotification = {
                        "ssid": 0,
                        "notifyFlag": "8000",
                        "body": notification_title,
                        "title": '[CRN:' + crn + ']' + type,
                        "web_url": "http://horizon.policyboss.com:5000/emails/preview/" + objDbEmail.Email_Id + '?',
                        "web_title": '[CRN:' + crn + ']' + type,
                        "img_url": "",
                        "category": ""
                    };
                    let args = {
                        data: requestNotification,
                        headers: {
                            "Content-Type": "application/json",
                            "token": "1234567890"
                        }
                    };
                    let category = "";
                    let arr_notification_receiver = [];
                    if (arr_agent_notification.indexOf(type) > -1 && agent_ss_id > 0 && [13600, 7582, 7960, 10745, 7961, 7601, 8067].indexOf(agent_ss_id) > -1) {
                        arr_notification_receiver.push(agent_ss_id);
                        category = 'Transaction';
                    }
                    if (arr_ch_notification.indexOf(type) > -1) {
                        notification_title = '[' + product_name + ':' + crn + '] policy on INR ' + premium;
                        args['data']['title'] = notification_title;
                        args['data']['web_title'] = notification_title;
                        args['data']['body'] = notification_title;
                        if (channel === 'DIRECT') {
                            arr_notification_receiver.push(1499);
                            arr_notification_receiver.push(7582);
                            arr_notification_receiver.push(1);
                        }
                        if (channel === 'DC') {
                            arr_notification_receiver.push(7844);
                        }
                        if (channel === 'SM') {
                            arr_notification_receiver.push(8304);
                        }
                        if (channel === 'GS') {
                            arr_notification_receiver.push(12816);
                        }
                        if (channel === 'EM') {
                            arr_notification_receiver.push(26);
                        }
                        if (product_id === 2) {
                            arr_notification_receiver.push(276);
                            arr_notification_receiver.push(7582);
                        }
                        category = 'Transaction';
                    }
                    if (arr_it_notification.indexOf(type) > -1) {
                        arr_notification_receiver.push(7582);//chirag
                        arr_notification_receiver.push(7960);//vijay
                        arr_notification_receiver.push(10745);//vikram
                        arr_notification_receiver.push(7961);//jatin
                        arr_notification_receiver.push(7601);//ashish
                        arr_notification_receiver.push(8067);//anuj
                        category = 'System_Log';
                    }
                    if (arr_it_ticket_notification.indexOf(type) > -1) {
                        arr_notification_receiver.push(7960);//vijay
                        arr_notification_receiver.push(10745);//vikram
                        arr_notification_receiver.push(7961);//jatin
                        category = 'Ticket';
                    }
                    if (arr_cc_ticket_notification.indexOf(type) > -1) {
                        arr_notification_receiver.push(14507); //jyoti
                        arr_notification_receiver.push(7626); // susana
                        category = 'Ticket';
                    }
                    if (arr_mapping_ticket_notification.indexOf(type) > -1) {
                        arr_notification_receiver.push(7814); //savio
                        category = 'Ticket';
                    }
                    if (arr_notification_receiver.length > 0) {
                        args['data']['category'] = category;
                        for (let k of arr_notification_receiver) {
                            args['data']['ssid'] = k;
                            client.post('http://api.magicfinmart.com/api/sendfinmartnotification', args, function (data, response) {});
                        }
                        let obj_notification = {
                            'Created_On': new Date(),
                            'Notification_Request': args['data'],
                            'To': arr_notification_receiver
                        };
                        var log_file_name = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
                        fs.appendFile(appRoot + "/tmp/log/notification_" + log_file_name + ".log", JSON.stringify(obj_notification) + "\r\n", function (err) {});
                    }
                });
            } else {
                console.error('DBG', 'NO_CRN', type);
            }
        } catch (e) {
            console.error('Exception', 'email_send', 'notification_process', e.stack);
        }

        if (config.email.send) {
            var sg = require('sendgrid')(config.email.sg_api_key);
            var request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: {
                    personalizations: [
                        personalizations
                    ],
                    from: {
                        email: from
                    },
                    content: [
                        {
                            type: content_type,
                            value: objDbEmail.Content
                        }
                    ]
                }
            });

            // With callback
            sg.API(request, function (error, response) {
                var Status = '';
                var ObjEmail = {};
                if (error) {
                    Status = 'Error';
                    var sg_response = {
                        'error': error
                    };
                    console.log('Error response received');
                } else {
                    Status = 'Success';
                    var sg_response = {
                        'statusCode': response.statusCode,
                        'body': response.body,
                        'headers': response.headers
                    };
                    ObjEmail.Msg_Id = response.headers['x-message-id'];
                }

                ObjEmail.Status = Status;
                ObjEmail.Response = sg_response;
                ObjEmail.Modified_On = new Date();
                Email.update({'Email_Id': objDbEmail.Email_Id}, ObjEmail, function (err, doc) {
                    console.log('emailupdate', err, doc);
                });
            });
        }
    });
};
module.exports = Email;