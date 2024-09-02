/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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


var sms_logSchema = new Schema({
    'Sms_Log_Id': Number,
    'PB_CRN': Number,
    'From': String,
    'To': Number,
    'Type': String,
    'Content': String,
    'Created_On': Date,
    'Modified_On': Date,
    'Status': String,
    'Api_Response': Object
});

sms_logSchema.plugin(mongoosePaginate);
//sms_logSchema.plugin(autoIncrement.plugin, {model: 'Client', field: 'Client_Id', startAt: 1});
//var Sms_Log = mongoose.model('Sms_Log', sms_logSchema);


sms_logSchema.plugin(autoIncrement.plugin, {model: 'Sms_Log', field: 'Sms_Log_Id', startAt: 1});
var Sms_Log = connection.model('Sms_Log', sms_logSchema);

Sms_Log.prototype.send_sms = function (mobile_no, sms_log_content, sms_log_type, pb_crn = 0, source = 'PB') {

    var Sms_Log = require('../models/sms_log');

    mobile_no = Math.round(mobile_no - 0);
    if (mobile_no === 0 || mobile_no.toString().length < 10) {
        console.error('Error', 'Invalid Mobile Number', mobile_no, sms_log_content, sms_log_type, pb_crn);
    } else {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        //console.log('args', args);
        var ObjSmsLog = {
            'PB_CRN': pb_crn - 0,
            'From': (source === 'PB') ? 'PLBOSS' : 'RPBOSS',
            'To': mobile_no,
            'Type': sms_log_type,
            'Content': sms_log_content,
            'Status': 1,
            'Created_On': new Date()
        };
        var objModelSms = new Sms_Log(ObjSmsLog);
        objModelSms.save(function (err, objDbSms) {
            if (err) {
                return console.error(err);
            }

            if (mobile_no.toString().length < 12) {
                mobile_no = '91' + mobile_no.toString();
            }
            var args = {
                data: {
                    'user': (source === 'PB') ? 'policy' : 'rupee',
                    'pwd': (source === 'PB') ? 'policyhttp' : 'apirupee',
                    'sender': (source === 'PB') ? 'PLBOSS' : 'RPBOSS',
                    'mobile': mobile_no.toString(),
                    'msg': sms_log_content.toString(),
                    'mt': '0'
                },
                headers: {
                    "Content-Type": "text/plain;charset=ISO-8859-1",
                    'sms_log_id': objDbSms.sms_log_id
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
                var Sms_LogSendStatus = 4;
                if (data.indexOf('not') > -1) {
                    Sms_LogSendStatus = 3;
                } else {
                    Sms_LogSendStatus = 2;
                }
                var ObjSms_Log = {
                    'Api_Response': data,
                    'Status': Sms_LogSendStatus,
                    'Modified_On': new Date()
                };
                var Sms_Log = require('../models/sms_log');
                Sms_Log.update({'Sms_Log_Id': objDbSms.Sms_Log_Id}, ObjSms_Log, function (err, numAffected) {
                    console.log('sms_logupdate', err, numAffected);
                });
            });
        });
}
//http://sms_log.cell24x7.com:1111/mspProducerM/sendSMS?user=policy&pwd=policyhttp&sender=POLBAZ&mobile=918369351516&msg=QUOTE%20MH-04-GJ-4131&mt=2
};
Sms_Log.prototype.policyIssuedMsgMotorCustomer = function (objReplace) {
    var contentSms_Log = "___business_source___\n\
-------------\n\
CRN: ___crn___\n\
Customer: ___first_name___ ___last_name___\n\
Status:___transaction_status___\n\
Product: ___product___\n\
Type: ___vehicle_insurance_subtype_text___\n\
Insurer: ___insurerco_name___\n\
Vehicle: ___vehicle_text___\n\
Premium: ___final_premium___ INR\n\
On: ___current_dt___\n\
Policy: ___policy_surl___";

    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};
Sms_Log.prototype.policyIssuedMsg = function (objReplace) {
    var contentSms_Log = "___business_source___\n\
-------------\n\
CRN: ___crn___\n\
Status:___transaction_status___\n\
Product: ___product___\n\
Type: ___vehicle_insurance_subtype_text___\n\
Customer: ___first_name___ ___last_name___\n\
Agent: ___agent_name___\n\
AgentReporting: ___posp_reporting_agent_name___\n\
Insurer: ___insurerco_name___\n\
Rto: ___rto_text___\n\
Manf: ___vehicle_manf_date___\n\
Vehicle: ___vehicle_text___\n\
Idv: ___vehicle_expected_idv___ INR\n\
Premium: ___final_premium___ INR\n\
Version: ___app_version___\n\
On: ___current_dt___\n\
Policy: ___policy_surl___";

    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};
Sms_Log.prototype.policyIssuedMsgPosp = function (objReplace) {
    var contentSms_Log = "___business_source___\n\
-------------\n\
CRN: ___crn___\n\
Status:___transaction_status___\n\
Product: ___product___\n\
Type: ___vehicle_insurance_subtype_text___\n\
Customer: ___first_name___ ___last_name___\n\
SubFba: ___posp_sub_fba_name___(Id:___posp_sub_fba_id___)\n\
Agent: ___agent_name___\n\
AgentReporting: ___posp_reporting_agent_name___\n\
Insurer: ___insurerco_name___\n\
RegNo: ___rto_text___\n\
Manf: ___vehicle_manf_date___\n\
Vehicle: ___vehicle_text___\n\
Idv: ___vehicle_expected_idv___ INR\n\
Premium: ___final_premium___ INR\n\
Version: ___app_version___\n\
On: ___current_dt___\n\
Policy: ___policy_surl___";

    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};
Sms_Log.prototype.methodErrMsg = function (objReplace) {
    var contentSms_Log = "HORIZON-ERR-ALERT\n\
-------------------\n\
Source: ___business_source___\n\
CRN: ___crn___\n\
Product: ___product___\n\
Agent: ___agent_name___( ___agent_mobile___ )\n\
Customer: ___first_name___ ___last_name___(___mobile___)\n\
Insurer: ___insurerco_name___\n\
Premium: ___final_premium___ INR\n\
Method: ___method_type___\n\
Error: ___error___\n\
On: ___current_dt___";

    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};
Sms_Log.prototype.proposalSubmitAckMsg = function (objReplace) {
    var contentSms_Log = "POLBOS-PROPOSAL-SUBMIT\n\
-------------------------------\n\
Customer has submitted proposal and redirected to Payment Gateway.\n\
In case of successful payment, Transaction status will be notified.\n\
If policy not issued in next 15 minutes then kindly contact customer for followup.\n\
\n\
Source: ___business_source___\n\
CRN: ___crn___\n\
Proposal_Id: ___proposal_id___\n\
Product: ___product___\n\
SubFba: ___posp_sub_fba_name___(Mob:___posp_sub_fba_mobile_no___)\n\
Agent: ___agent_name___(Mob: ___agent_mobile___ )\n\
Customer: ___first_name___ ___last_name___\n\
Insurer: ___insurerco_name___\n\
Premium: ___final_premium___ INR\n\
LinkSentOn: ___link_sent_on___\n\
SubmittedOn: ___current_dt___\n\
AttemptCount: ___proposal_attempt_cnt___\n\
Ip: ___ip_address___";

    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};

Sms_Log.prototype.policyIssuedMsgHealthCustomer = function (objReplace) {
    var contentSms_Log = "___business_source___\n\
-------------\n\
CRN: ___crn___\n\
Status:___transaction_status___\n\
PolicyStatus:___transaction_substatus___\n\
Product: ___product___\n\
Customer: ___first_name___ ___last_name___\n\
Insurer: ___insurerco_name___\n\
Plan: ___erp_plan_name___\n\
SumInsured: ___health_insurance_si___ INR\n\
Premium: ___final_premium___ INR\n\
CoverType: ___health_insurance_type___\n\
MemberCount: ___member_count___\n\
On: ___current_dt___";


    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};
Sms_Log.prototype.policyIssuedMsgHealth = function (objReplace) {
    var contentSms_Log = "___business_source___\n\
-------------\n\
CRN: ___crn___\n\
Status:___transaction_status___\n\
PolicyStatus:___transaction_substatus___\n\
Product: ___product___\n\
Customer: ___first_name___ ___last_name___\n\
Agent: ___agent_name___\n\
AgentReporting: ___posp_reporting_agent_name___\n\
Insurer: ___insurerco_name___\n\
Plan: ___erp_plan_name___\n\
SumInsured: ___health_insurance_si___ INR\n\
Premium: ___final_premium___ INR\n\
CoverType: ___health_insurance_type___\n\
MemberCount: ___member_count___\n\
Version: ___app_version___\n\
On: ___current_dt___";


    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};
Sms_Log.prototype.policyIssuedMsgPospHealth = function (objReplace) {
    var contentSms_Log = "___business_source___\n\
-------------\n\
CRN: ___crn___\n\
Status:___transaction_status___\n\
PolicyStatus:___transaction_substatus___\n\
Product: ___product___\n\
Customer: ___first_name___ ___last_name___\n\
Agent: ___agent_name___\n\
AgentReporting: ___posp_reporting_agent_name___\n\
Insurer: ___insurerco_name___\n\
Plan: ___erp_plan_name___\n\
SumInsured: ___health_insurance_si___ INR\n\
Premium: ___final_premium___ INR\n\
CoverType: ___health_insurance_type___\n\
MemberCount: ___member_count___\n\
Version: ___app_version___\n\
On: ___current_dt___";

    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};
Sms_Log.prototype.policyIssuedMsgPospTravel = function (objReplace) {
    var contentSms_Log = "___business_source___\n\
-------------\n\
CRN: ___crn___\n\
Status:___transaction_status___\n\
Product: ___product___\n\
Customer: ___first_name___ ___last_name___\n\
Agent: ___agent_name___\n\
AgentReporting: ___posp_reporting_agent_name___\n\
Insurer: ___insurerco_name___\n\
Premium: ___final_premium___ INR\n\
On: ___current_dt___";

    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};

Sms_Log.prototype.proposalSubmitAckMsgTerm = function (objReplace) {
    var contentSms_Log = "POLBOS-PROPOSAL-SUBMIT\n\
-------------------------------\n\
Customer has submitted proposal and redirected to Payment Gateway.\n\
In case of successful payment, Transaction status will be notified.\n\
If no status in next 15 minutes then kindly contact customer for followup.\n\
\n\
Source: ___business_source___\n\
CRN: ___crn___\n\
Product: ___product___\n\
Agent: ___agent_name___(Mob: ___agent_mobile___ )\n\
Customer: ___customer_name___\n\
Insurer: ___insurerco_name___\n\
Premium: ___final_premium___ INR\n\
Plan: ___plan_name___\n\
Application No: ___application_number___\n\
LinkSentOn: ___link_sent_on___\n\
SubmittedOn: ___current_dt___\n\
ProposalAttemptCount: ___proposal_attempt_cnt___";

    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};

Sms_Log.prototype.policyIssuedMsgHealthOld = function (objReplace) {
    var contentSms_Log = "___business_source___\n\
-------------\n\
CRN: ___crn___\n\
Product: ___product___\n\
Agent: ___posp_first_name___ ___posp_last_name___\n\
Cust_Email : ___email___\n\
Insurer: ___insurerco_name___\n\
Premium: ___final_premium___ INR\n\
On: ___current_dt___";

    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};
Sms_Log.prototype.initiateQuoteMsg = function (objReplace) {
    var contentSms_Log = "LM Quote\n\
======\n\
Thank you ___sender_name___\n\
Fetching Quotes for\n\
  No: ___registration_number___\n\
  Veh: ___vehicle_name___\n\
  RegOn: ___regn_dt___\n\
Quotes premiums in INR\n\
Wait 20 sec for SMS or visit link\n\
  Quote: ___quote_url___";
    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};
Sms_Log.prototype.initiateQuoteShareMsg = function (objReplace) {
    var contentSms_Log = "LM Quote\n\
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
    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};
Sms_Log.prototype.initiateQuotePOSPAgentMsg = function (objReplace) {
    var contentSms_Log = "LM POSP Agent\n\
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
    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};
Sms_Log.prototype.initiateQuotePOSPCustomerMsg = function (objFastlane, objDbPosp = null, objSms_LogRequest = null) {
    var Sender_Name = objSms_LogRequest['sender_name'].toString().replace('_', ' ');
    var Receiver_Name = objSms_LogRequest['receiver_name'].toString().replace('_', ' ');
    var contentSms_Log = "LM POSP Quotes\n\
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
    return contentSms_Log;
};
Sms_Log.prototype.InsurerQuoteMsg = function (objReplace) {
    var contentSms_Log = "___insurer_name___\n\
======\n\
QRN: ___Request_Id___#___Service_Log_Id___\n\
IDV: ___vehicle_expected_idv___\n\
Base Prem: ___base_premium___\n\
___addon_list___\n\
Buy: ___buy_url___";
    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;

};
Sms_Log.prototype.finishQuoteMsg = function (objSummary) {

    var contentSms_Log = "LM Summary\n\
======\n\
Insurer:\n\
___insurer_list___\n\
IDV: ___idv_range___\n\
Premium: ___premium_range___\n\
SRN: ___srn___";
    contentSms_Log = contentSms_Log.replaceJson(objSummary);
    return contentSms_Log;

};
Sms_Log.prototype.agentAckCustomerBOMsg = function (objSms_LogContent) {
    var contentSms_Log = "LM POSP Status\n\
========\n\
Following Customer has opened proposal page\n\
  Name: ___customer_name___\n\
  Mob: ___mobile___\n\
  Prem: ___premium_amt___ INR\n\
Please be standby, if Customer needs any assistance for Proposal form.\n\
We will update you further status.";
    contentSms_Log = contentSms_Log.replaceJson(objSms_LogContent);
    return contentSms_Log;
};
Sms_Log.prototype.proposalLinkMsg = function (objSms_LogContent) {
    var contentSms_Log = "Payment Request\n\
================\n\
CRN : ___crn___\n\
Premium : ___final_premium___\n\
Reminder : ___reminder___\n\
\n\
Dear ___salutation_text___ ___contact_name___ , \n\
Our representative ___agent_name___ has submitted your proposal for ___product_name___. Please click on link below to review and make payment.\n\
___short_url___ \n\
Please call 18004194199 or ___agent_mobile___ for any assistance";
    contentSms_Log = fs.readFileSync(appRoot + '/resource/sms/proposalLinkMsg.txt').toString();
    contentSms_Log = contentSms_Log.replaceJson(objSms_LogContent);
    return contentSms_Log;
};
Sms_Log.prototype.proposalLinkMsgCallCenter = function (objSms_LogContent) {
    var contentSms_Log = "Payment Request\n\
================\n\
CRN : ___crn___\n\
Premium : ___final_premium___\n\
Reminder : ___reminder___\n\
\n\
Dear ___salutation_text___ ___contact_name___ , \n\
Our representative ___agent_name___ has submitted your proposal for ___product_name___. Please click on link below to review and make payment.\n\
___short_url___ \n\
Please call 18004194199 for any assistance";
    contentSms_Log = contentSms_Log.replaceJson(objSms_LogContent);
    return contentSms_Log;
};

Sms_Log.prototype.erpCsMsg = function (objSms_LogContent) {
    var contentSms_Log = "ERP_CS_FAILED\n\
	=================\n\
CRN : ___pb_crn___\n\
Reason : ___reason___";
    contentSms_Log = contentSms_Log.replaceJson(objSms_LogContent);
    return contentSms_Log;
};


Sms_Log.prototype.indianMoneyFormat = function (x) {
    x = Math.round(x - 0);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
};

Sms_Log.prototype.camelize = function (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return letter.toUpperCase();
    }).replace(/\s+/g, ' ');
};
Sms_Log.prototype.quoteLinkMsg = function (objSms_LogContent) {
    var contentSms_Log = "Thanks for sharing details of your ___product_name___ ___make_model___ for Insurance Quote.\n\Please click on this link to verify inputs and make the payment. ___short_url___\n\
    \n\From: \n\Landmark Insurance Brokers. \n\Toll Free - 18004194199";
    contentSms_Log = contentSms_Log.replaceJson(objSms_LogContent);
    return contentSms_Log;
};
Sms_Log.prototype.siteLinkMsg = function (objSms_LogContent) {
    var contentSms_Log = "Greetings from Landmark Insurance Brokers (PolicyBoss).\n\we noticed that you were trying to get insurance quote for your vehicle .We regret the inconvenience caused .Kindly check the link below to get started. ___site_url___ \n\Toll Free - 18004194199";
    contentSms_Log = contentSms_Log.replaceJson(objSms_LogContent);
    return contentSms_Log;
};

//marine sms

Sms_Log.prototype.policyIssuedMsgMarineCustomer = function (objReplace) {
    var contentSms_Log = "___business_source___\n\
-------------\n\
CRN: ___crn___\n\
Status:___transaction_status___\n\
PolicyStatus:___transaction_substatus___\n\
Product: ___product___\n\
Customer: ___contact_name___\n\
Insurer: ___insured_name___\n\
Plan: ___erp_plan_name___\n\
SumInsured: ___marine_insurance_si___ INR\n\
Premium: ___final_premium___ INR\n\
CoverType: ___marine_insurance_type___\n\
On: ___current_dt___";


    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};

Sms_Log.prototype.policyIssuedMsgPospMarine = function (objReplace) {
    var contentSms_Log = "___business_source___\n\
-------------\n\
CRN: ___crn___\n\
Status:___transaction_status___\n\
PolicyStatus:___transaction_substatus___\n\
Product: ___product___\n\
Customer: ___contact_name___\n\
Agent: ___agent_name___\n\
AgentReporting: ___posp_reporting_agent_name___\n\
Insurer: ___insured_name___\n\
Plan: ___erp_plan_name___\n\
SumInsured: ___marine_insurance_si___ INR\n\
Premium: ___final_premium___ INR\n\
CoverType: ___marine_insurance_type___\n\
Version: ___app_version___\n\
On: ___current_dt___";

    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};

Sms_Log.prototype.policyIssuedMsgMarine = function (objReplace) {
    var contentSms_Log = "___business_source___\n\
-------------\n\
CRN: ___crn___\n\
Status:___transaction_status___\n\
PolicyStatus:___transaction_substatus___\n\
Product: ___product___\n\
Customer: ___contact_name___\n\
Agent: ___agent_name___\n\
AgentReporting: ___posp_reporting_agent_name___\n\
Insurer: ___insured_name___\n\
Plan: ___erp_plan_name___\n\
SumInsured: ___marine_insurance_si___ INR\n\
Premium: ___final_premium___ INR\n\
CoverType: ___marine_insurance_type___\n\
Version: ___app_version___\n\
On: ___current_dt___";


    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};
Sms_Log.prototype.otp_quote = function (objReplace) {
    //var contentSms_Log = "___otp___ is the OTP for your ___product___ quote search on Policyboss.com. Validity 5 minutes. Landmark insurance brokers (PolicyBoss.com)";
	let contentSms_Log = '___otp___ is the OTP for your ___product___ on Policyboss.com. Validity 5 minutes. PolicyBoss.com';

    contentSms_Log = contentSms_Log.replaceJson(objReplace);
    return contentSms_Log;
};


module.exports = Sms_Log;
