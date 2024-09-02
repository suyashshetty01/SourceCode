/* Chirag Modi
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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

var short_urlSchema = new Schema({
    'Long_Url': String,
    'Short_Url': String,
    'Short_Url_Code': String,
    'Is_Active': {type: Boolean, default: true},
    'Created_On': {type: Date},
    'Visited_Count': Number,
    'Visited_On': {type: Date},
    'Visited_History': [{}]
});
short_urlSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
    if (!this.Short_Url_Id) {
        this.Created_On = currentDate;
    }
    next();
});
short_urlSchema.plugin(mongoosePaginate);

short_urlSchema.plugin(autoIncrement.plugin, {model: 'Short_Url', field: 'Short_Url_Id', startAt: 1});
var Short_Url = connection.model('Short_Url', short_urlSchema);
Short_Url.prototype.create_short_url = function (long_url, objDbSms, Request_Type) {
    //console.log('args', args);
    var Short_Url = require('../models/short_url');
    var objModelShortUrl = new Short_Url({'Long_Url': long_url, 'Short_Url': ''});
    objModelShortUrl.save(function (err, objDBShortURL) {
        var Short_Url_Id = objDBShortURL.Short_Url_Id;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.get('https://api-ssl.bitly.com/v3/shorten?access_token=' + config.environment.bitly_access_token + '&longUrl=' + encodeURIComponent(long_url), function (data, response) {
            console.log(data);
            if (data && data.status_code === 200) {
                var short_url = data.data.url;
                Short_Url.update({'Short_Url_Id': Short_Url_Id}, {'Short_Url': short_url}, function (err, objDBShortURL) {
                    var Sms = require('../models/sms');
                    var objSms = new Sms();
                    if (Request_Type === 'QUOTEURL' || Request_Type === 'PQUOTEURL') {
                        var sms_content = 'Welcome to Landmark POSP\n==========================\nProposal Page URL - ' + short_url;
                        var arrSmsList = {'Msg': sms_content};
                        objSms.send_sms(objDbSms['Receiver'], sms_content, objDbSms.Sms_Id, arrSmsList);
                        if (objDbSms['Sender'] !== '' && objDbSms['Sender'] !== objDbSms['Receiver']) {
                            objSms.send_sms(objDbSms['Sender'], sms_content, objDbSms.Sms_Id, arrSmsList);
                        }
                    }
                });
            } else {
                var sub = '[' + config.environment.name.toString().toUpperCase() + '-ERR]BITLY_ERROR';
                email_data = '<html><body><p>Data</p><pre>' + JSON.stringify(data, undefined, 2) + '</pre><p>Response</p><pre>' + JSON.stringify(response, undefined, 2) + '</pre></body></html>';
                var Email = require('../models/email');
                var objModelEmail = new Email();
                objModelEmail.send('noreply@landmarkinsurance.co.in', '', sub, email_data, '', 'horizon.lm.notification@gmail.com');
            }
        });
    });
};

Short_Url.prototype.proposal_link_sent = function (long_url, objdbsms, Request_Type) {
    var args = {
        data: {"longUrl": long_url},
        headers: {
            "Content-Type": "application/json"
        }
    };
    var Short_Url = require('../models/short_url');
    var objModelShortUrl = new Short_Url({'Long_Url': long_url, 'Short_Url': ''});
    objModelShortUrl.save(function (err, objDBShortURL) {
        var Short_Url_Id = objDBShortURL.Short_Url_Id;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.get('https://api-ssl.bitly.com/v3/shorten?access_token=' + config.environment.bitly_access_token + '&longUrl=' + encodeURIComponent(long_url), function (data, response) {
            console.log(data);
            if (data && data.status_code === 200) {
                var short_url = data.data.url;
                Short_Url.update({'Short_Url_Id': Short_Url_Id}, {'Short_Url': short_url}, function (err, objDBShortURL) {
                    objdbsms['___short_url___'] = short_url;
                    var SmsLog = require('../models/sms_log');
                    var objsmsLog = new SmsLog();
                    var sms_data = objsmsLog.proposalLinkMsg(objdbsms);
                    objsmsLog.send_sms(objdbsms['___phone_no___'], sms_data, 'PROPOSAL_LINK_SENT'); //mobile_no, sms_log_content, sms_log_type

                });
            } else {
                var sub = '[' + config.environment.name.toString().toUpperCase() + '-ERR]BITLY_ERROR';
                email_data = '<html><body><p>Data</p><pre>' + JSON.stringify(data, undefined, 2) + '</pre><p>Response</p><pre>' + JSON.stringify(response, undefined, 2) + '</pre></body></html>';
                var Email = require('../models/email');
                var objModelEmail = new Email();
                objModelEmail.send('noreply@landmarkinsurance.co.in', '', sub, email_data, '', 'horizon.lm.notification@gmail.com');
            }
        });
    });
};
Short_Url.prototype.quote_link_sent = function (long_url, objdbsms, Request_Type) {
    var args = {
        data: {"longUrl": long_url},
        headers: {
            "Content-Type": "application/json"
        }
    };
    var Short_Url = require('../models/short_url');
    var objModelShortUrl = new Short_Url({'Long_Url': long_url, 'Short_Url': ''});
    objModelShortUrl.save(function (err, objDBShortURL) {
        var Short_Url_Id = objDBShortURL.Short_Url_Id;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.get('https://api-ssl.bitly.com/v3/shorten?access_token=' + config.environment.bitly_access_token + '&longUrl=' + encodeURIComponent(long_url), function (data, response) {
            console.log(data);
            if (data && data.status_code === 200) {
                var short_url = data.data.url;
                Short_Url.update({'Short_Url_Id': Short_Url_Id}, {'Short_Url': short_url}, function (err, objDBShortURL) {
                    objdbsms['___short_url___'] = short_url;
                    var SmsLog = require('../models/sms_log');
                    var objsmsLog = new SmsLog();
                    var sms_data = objsmsLog.quoteLinkMsg(objdbsms);
                    objsmsLog.send_sms(objdbsms['___phone_no___'], sms_data, 'QUOTE_LINK_SENT'); //mobile_no, sms_log_content, sms_log_type

                });
            } else {
                var sub = '[' + config.environment.name.toString().toUpperCase() + '-ERR]BITLY_ERROR';
                email_data = '<html><body><p>Data</p><pre>' + JSON.stringify(data, undefined, 2) + '</pre><p>Response</p><pre>' + JSON.stringify(response, undefined, 2) + '</pre></body></html>';
                var Email = require('../models/email');
                var objModelEmail = new Email();
                objModelEmail.send('noreply@landmarkinsurance.co.in', '', sub, email_data, '', 'horizon.lm.notification@gmail.com');
            }

        });
    });
};
Short_Url.prototype.create_short_url_quote = function (sms_content_type, long_url, objSmsRequest, objContentReplace, sms_id, arrSmsList) {
    var args = {
        data: {"longUrl": long_url},
        headers: {
            "Content-Type": "application/json"
        }
    };

    //console.log('args', args);
    var Short_Url = require('../models/short_url');
    var objModelShortUrl = new Short_Url({'Long_Url': long_url, 'Short_Url': ''});
    objModelShortUrl.save(function (err, objDBShortURL) {
        var Short_Url_Id = objDBShortURL.Short_Url_Id;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.get('https://api-ssl.bitly.com/v3/shorten?access_token=' + config.environment.bitly_access_token + '&longUrl=' + encodeURIComponent(long_url), function (data, response) {
            console.log(data);
            if (data && data.status_code === 200) {
                var short_url = data.data.url;

                Short_Url.update({'Short_Url_Id': Short_Url_Id}, {'Short_Url': short_url}, function (err, objDBShortURL) {
                    var Sms = require('../models/sms');
                    var objSms = new Sms();

                    if (sms_content_type === 'QUOTE') {
                        objContentReplace['___buy_url___'] = short_url;
                        var sms_content = objSms.InsurerQuoteMsg(objContentReplace);
                        arrSmsList.Quote.push(sms_content);
                    }
                    if (sms_content_type === 'SUMMARY') {
                        objContentReplace['___quote_url___'] = short_url;
                        var sms_content = objSms.finishQuoteMsg(objContentReplace);
                        arrSmsList.Summary = sms_content;
                    }

                    if (objSmsRequest['request_type'] === 'QUOTE') {
                        if (sms_content_type === 'WELCOME') {
                            objContentReplace['___quote_url___'] = short_url;
                            var sms_content = objSms.initiateQuoteMsg(objContentReplace);
                            arrSmsList.Start = sms_content;
                        }
                        objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, sms_id, arrSmsList);
                    }
                    if (objSmsRequest['request_type'] === 'SQUOTE') {
                        if (sms_content_type === 'WELCOME') {
                            objContentReplace['___quote_url___'] = short_url;
                            var sms_content = objSms.initiateQuoteShareMsg(objContentReplace);
                            arrSmsList.Start = sms_content;
                        }
                        objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, sms_id, arrSmsList);
                    }
                    if (objSmsRequest['request_type'] === 'PQUOTE') {
                        if (sms_content_type === 'WELCOME') {
                            objContentReplace['___quote_url___'] = short_url;
                            var sms_content = objSms.initiateQuotePOSPAgentMsg(objContentReplace);
                            arrSmsList.PospStart = sms_content;
                            objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, sms_id, arrSmsList);

                            //send msg to customer
                            var sms_content = objSms.initiateQuotePOSPCustomerMsg(objContentReplace);
                            arrSmsList.CustomerStart = sms_content;
                            objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, sms_id, arrSmsList);
                        } else {
                            objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, sms_id, arrSmsList);
                            if (objSmsRequest['sender_mobile_no'] !== objSmsRequest['receiver_mobile_no']) {
                                objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, sms_id, arrSmsList);
                            }
                        }
                    }
                });
            } else {
                var sub = '[' + config.environment.name.toString().toUpperCase() + '-ERR]BITLY_ERROR';
                email_data = '<html><body><p>Data</p><pre>' + JSON.stringify(data, undefined, 2) + '</pre><p>Response</p><pre>' + JSON.stringify(response, undefined, 2) + '</pre></body></html>';
                var Email = require('../models/email');
                var objModelEmail = new Email();
                objModelEmail.send('noreply@landmarkinsurance.co.in', '', sub, email_data, '', 'horizon.lm.notification@gmail.com');
            }
        });
    });
};
module.exports = Short_Url;