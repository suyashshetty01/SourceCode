/* Author: Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
var agent_wallet = require('../models/agent_wallet');
var wallet_transaction = require('../models/wallet_transaction');
var wallet_history = require('../models/rzp_wallet_history');
var wallet_payment_update = require('../models/wallet_payment_update');
var User_Data = require('../models/user_data');
let auth_token = "";
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var moment = require('moment');
module.exports.controller = function (app) {
    app.get('/wallets/summary', LoadSession, function (req, res) {
        let account_count = 0;
        try {
            var agent_wallet = require('../models/agent_wallet');
            agent_wallet.count({}, function (err, totalAccount) {
                if (err) {
                    res.send(err);
                } else {
                    account_count = totalAccount;
                    var razorpay_wallet_history = require('../models/rzp_wallet_history');
                    let args = [
                        {"$facet": {
                                "Transaction_Count": [
                                    {"$match": {"transaction_type": "DEBIT", "Status": "SUCCESS"}},
                                    {"$count": "Transaction_Count"}
                                ],
                                "Deposite_Count": [
                                    {"$match": {"transaction_type": "CREDIT", "Status": "SUCCESS"}},
                                    {"$count": "Deposite_Count"}
                                ],
                                "Transaction_DEBIT_Amount": [
                                    {"$match": {"transaction_type": "DEBIT", "Status": "SUCCESS"}},
                                    {"$group": {_id: null, "TotalSum": {"$sum": "$transaction_amount"}}}
                                ],
                                "Transaction_CREDIT_Amount": [
                                    {"$match": {"transaction_type": "CREDIT", "Status": "SUCCESS"}},
                                    {"$group": {_id: null, "TotalSum": {"$sum": "$transaction_amount"}}}
                                ]
                            }},
                        {"$project": {
                                "Transaction_Count": {"$arrayElemAt": ["$Transaction_Count.Transaction_Count", 0]},
                                "Deposite_Count": {"$arrayElemAt": ["$Deposite_Count.Deposite_Count", 0]},
                                "Transaction_DEBIT_Amount": {"$arrayElemAt": ["$Transaction_DEBIT_Amount.TotalSum", 0]},
                                "Transaction_CREDIT_Amount": {"$arrayElemAt": ["$Transaction_CREDIT_Amount.TotalSum", 0]}
                            }}
                    ];
                    razorpay_wallet_history.aggregate(args, function (err, db_rzp) {
                        if (err) {
                            res.json(err);
                        } else {
                            if (db_rzp.length > 0) {
                                let obj_wallet_summary = {
                                    'account_count': account_count,
                                    'deposit_count': db_rzp[0].Deposite_Count,
                                    'transaction_count': db_rzp[0].Transaction_Count,
                                    'deposit_amount': db_rzp[0].Transaction_CREDIT_Amount,
                                    'transaction_amount': db_rzp[0].Transaction_DEBIT_Amount
                                };
                                res.json(obj_wallet_summary);
                            } else {
                                res.json({"Msg": "Fail"});
                            }
                        }
                    });
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/rzp_create_customer/:ssid/:created_by', function (req, res) {//create customer id; pass ssid of agent whose id needs to be created and ssid of agent creating it
        try {
            let daily_limit = req.query.daily_limit;
            let wallet_otp_number = req.query.otp_mobile_no;
            let update = req.query.update;
            agent_wallet.findOne({SS_ID: parseInt(req.params.ssid)}, function (err, dbAgentData) {
                if (err) {
                    console.error("create_customer-", err);
                } else {
                    if (dbAgentData && dbAgentData['_doc'].Merchant_Id.includes('cust_')) {
                        if (update === "yes") {
                            var update_agent_wallet = {
                                "daily_limit": daily_limit,
                                "wallet_otp_number": wallet_otp_number
                            };
                            agent_wallet.update({"SS_ID": parseInt(req.params.ssid)}, {$set: update_agent_wallet}, function (err, objproduct_share) {
                                if (err) {
                                    res.send({"Status": "Fail"});
                                } else {
                                    console.log("Updated Sucessfully");
                                    res.send({"Status": "Success", "Msg": "Updated"});
                                }
                            });
                        } else {
                            res.send({"Customer_Id": dbAgentData['_doc'].Merchant_Id});
                        }
                    } else {
                        let Client = require('node-rest-client').Client;
                        let client = new Client();
                        let ss_id = parseInt(req.params.ssid);
                        let creator = parseInt(req.params.created_by);
                        let username = config.razor_pay.rzp_sbi.username;
                        let password = config.razor_pay.rzp_sbi.password;
                        client.get('http://horizon.policyboss.com:5000/posps/dsas/view/' + ss_id, {}, function (data, response) {
                            if (data['status'] === 'SUCCESS') {
                                let create_url = "https://api.razorpay.com/v1/customers";
                                if (data.hasOwnProperty('EMP')) {
                                    let args = {
                                        data: {
                                            "name": data['EMP'].Emp_Name,
                                            "email": data['EMP'].Email_Id,
                                            "contact": data['EMP'].Mobile_Number,
                                            "fail_existing": "1",
                                            "notes": {
                                                "description" : data['EMP'].Emp_Name + "(ss_id-" + data['EMP'].Emp_Id + ",erp_id-" + data['EMP'].UID + ")"
                                            }
                                        },
                                        headers: {"Content-Type": "application/json",
                                            "Accept": "application/json",
                                            'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                                        }
                                    };
                                    client.post(create_url, args, function (data1, response1) {
                                        if (data1.id !== "" && data1.id !== undefined) {
                                            let args1 = {
                                                'SS_ID': ss_id,
                                                'FBA_ID': data['EMP'].FBA_ID,
                                                'EMP_ID': data['EMP'].UID,
                                                'Channel': data.channel,
                                                'agent_name': data['EMP'].Emp_Name,
                                                'agent_mobile': data['EMP'].Mobile_Number,
                                                'agent_email': data['EMP'].Email_Id,
                                                'Merchant_Id': data1.id,
                                                'creation_request': args.data,
                                                'creation_response': data1,
                                                'ifsc': "",
                                                'bank_account_no': "",
                                                'virtual_account_id': "",
                                                'virtual_acnt_request': "",
                                                'virtual_acnt_response': "",
                                                'wallet_amount': 0,
                                                'daily_limit': daily_limit,
                                                'wallet_otp_number': wallet_otp_number,
                                                'Creator_SSID': creator,
                                                'Created_On': new Date(),
                                                'Modified_On': new Date(),
                                                'Last_Deposit_Date': "",
                                                'Last_Transact_Date': "",
                                                'IsActive': 1
                                            };
                                            var customerObj = new agent_wallet(args1);
                                            customerObj.save(function (err) {
                                                if (err) {
                                                    console.error('Customer Creation Failed', JSON.stringify(args1), err);
                                                }
                                                res.send({"Customer_Id": data1.id});
                                            });
                                        } else {
                                            res.send({"Msg": "Fail"});
                                        }
                                    });
                                } else {
                                    res.send({'Msg': 'Employee details unavailable'});
                                }
                            } else {
                                res.send({'Msg': 'Invalid ss_id'});
                            }
                        });
                    }
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/rzp_virtual_acc/:cust_id/:ss_id', function (req, res) {//create virtual account; pass the customer id created previously
        try {
            let customer_id = req.params.cust_id;
            agent_wallet.findOne({Merchant_Id: req.params.cust_id}, function (err, dbAgentData) {
                if (err) {
                    console.error("create_virtual_acc-", err);
                } else {
                    if (dbAgentData && dbAgentData['_doc'].virtual_account_id !== "") {
                        res.send({"Msg": "Customer already exists", "Account_No": dbAgentData['_doc'].virtual_account_id, "Customer_Id": customer_id});
                    } else {
                        let ss_id = (dbAgentData && dbAgentData['_doc'].SS_ID) ? dbAgentData['_doc'].SS_ID : req.params.ss_id;
                        let create_url = "https://api.razorpay.com/v1/virtual_accounts";
                        let Client = require('node-rest-client').Client;
                        let client = new Client();
                        let username = config.razor_pay.rzp_sbi.username;
                        let password = config.razor_pay.rzp_sbi.password;
                        let note_agent_name = (dbAgentData && dbAgentData['_doc'].agent_name) ? dbAgentData['_doc'].agent_name : "";
                        let note_erp_id = (dbAgentData && dbAgentData['_doc'].EMP_ID) ? dbAgentData['_doc'].EMP_ID : "";
                        let args = {
                            data: {
                                "receivers": {
                                    "types": [
                                        "bank_account"
                                    ]
                                },
                                "description": "Virtual Account created for Landmark Insurance",
                                "customer_id": customer_id,
                                "notes": {
                                    "description" : note_agent_name + "(ss_id-" + ss_id + ",erp_id-" + note_erp_id + ")"
                                }
                            },
                            headers: {"Content-Type": "application/json",
                                "Accept": "application/json",
                                'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                            }
                        };
                        client.post(create_url, args, function (data1, response1) {
                            if (data1.id !== "" && data1.id !== undefined) {
                                let objUpdates = {
                                    "ifsc": data1['receivers'][0].ifsc,
                                    "bank_account_no": data1['receivers'][0].account_number,
                                    "virtual_account_id": data1.id,
                                    "virtual_acnt_request": args.data,
                                    "virtual_acnt_response": data1,
                                    "Modified_On": new Date()
                                };
                                agent_wallet.update({'Merchant_Id': data1.customer_id}, {$set: objUpdates}, function (err) {
                                    if (err) {
                                        console.error('rzp_virtual_acc_fail', JSON.stringify(objUpdates), err);
                                    }
                                    res.send({"Msg": "Customer Created", "Account_No": data1.id, "Customer_Id": customer_id});
                                });
                                try {
                                    client.get('http://horizon.policyboss.com:5000/posps/dsas/view/' + parseInt(ss_id), {}, function (agent_data, response) {
                                        if (agent_data['status'] === 'SUCCESS') {
                                            let agent_email_id = agent_data.EMP.Email_Id;
                                            let rm_email_id = "";
                                            if (agent_data.RM && agent_data.RM.rm_details && agent_data.RM.rm_details.email) {
                                                rm_email_id = agent_data.RM.rm_details.email;
                                            }
                                            /*
                                             let Email = require('../models/email');
                                             let objModelEmail = new Email();
                                             let subject = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Razorpay Virtual Account of SS_ID:' + dbAgentData['_doc'].SS_ID;
                                             let email_body = '<html><body><p>Hi,</p><p>Your Razorpay virtual account has been successfully created.</p>' +
                                             '<p>Your Merchant ID - <b>' + customer_id + '</b></p>' +
                                             '<p>Your Virtual Account ID - <b>' + data1.id + '</b></p>' +
                                             '<p>Your Bank Account Number - <b>' + data1['receivers'][0].account_number + '</b></p></body></html>';
                                             if (config.environment.name === 'Production') {
                                             objModelEmail.send('noreply@policyboss.com', '', subject, email_body, '', config.environment.notification_email, '');
                                             } else {
                                             objModelEmail.send('noreply@policyboss.com', 'anuj.singh@policyboss.com', subject, email_body, '', '', '');
                                             }*/

                                            var fs = require('fs');
                                            var email_data = '';
                                            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Wallet_Creation.html').toString();
                                            var Email = require('../models/email');
                                            var objModelEmail = new Email();
                                            var objEmail = {
                                                '___contact_name___': agent_data.EMP.Emp_Name,
                                                '___bank_account_no___': data1['receivers'][0].account_number,
                                                '___ifsc_code___': data1['receivers'][0].ifsc,
                                                '___merchant_id___': customer_id,
                                                '___virtual_account_id___': data1.id,
                                                '___bank_name___': data1['receivers'][0].bank_name,
                                                '___name___': data1['receivers'][0].name,
                                                '___daily_limit___': dbAgentData['_doc'].daily_limit,
                                                '___wallet_otp_number___': dbAgentData['_doc'].wallet_otp_number

                                            };
                                            let to = "";
                                            to = agent_email_id;
                                            to += rm_email_id ? ("," + rm_email_id) : "";
                                            let subject = '[Wallet - Creation]' + agent_data.EMP.Emp_Name + " - " + ss_id;
                                            email_body = email_data.replaceJson(objEmail);
                                            if (config.environment.name === 'Production') {
                                                objModelEmail.send('noreply@policyboss.com', to, subject, email_body, '', config.environment.notification_email, '');
                                            } else {
                                                objModelEmail.send('noreply@policyboss.com', 'anuj.singh@policyboss.com', subject, email_body, '', '', '');
                                            }

                                        }
                                    });
                                } catch (e) {
                                    res.json(e.stack);
                                }
                            } else {
                                res.send({"Msg": "Fail"});
                            }
                        });
                    }
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/rzp_loading/:pay_id/:cust_id/:amt', function (req, res) {//when amount is added to a virtual account; call this service to load that payment in razorpay wallet
        try {
            let payId = req.params.pay_id;
            let customer_id = req.params.cust_id;
            let amount = Number(req.params.amt);
            wallet_history.findOne({'rzp_payment_id': payId}, function (err, dbTransData) {
                if (err) {
                    console.error("rzp_loading-", err);
                } else {
                    if (dbTransData === null) {
                        let Client = require('node-rest-client').Client;
                        let client = new Client();
                        let create_url = "https://api.razorpay.com/v1/payments/" + payId + "/transfers";
                        let username = config.razor_pay.rzp_sbi.username;
                        let password = config.razor_pay.rzp_sbi.password;
                        let args = {
                            data: {
                                "transfers": [
                                    {
                                        "customer": customer_id,
                                        "amount": amount,
                                        "currency": "INR",
                                        "notes": {"customer_id": customer_id}
                                    }
                                ]
                            },
                            headers: {"Content-Type": "application/json",
                                "Accept": "application/json",
                                'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                            }
                        };
                        client.post(create_url, args, function (data, response) {
                            if (data.hasOwnProperty('items') && data['items'][0].id !== "" && data['items'][0].id !== undefined) {
                                let payObj = {
                                    'PB_CRN': 0,
                                    'User_Data_Id': 0,
                                    'Service_Log_Id': 0,
                                    'rzp_customer_id': customer_id,
                                    'rzp_payment_id': payId,
                                    'transaction_type': "CREDIT",
                                    'transaction_amount': Number((amount / 100).toFixed(2)),
                                    'rzp_payment_request': args.data,
                                    'rzp_payment_response': data,
                                    'Created_On': new Date(),
                                    'Status': "SUCCESS",
                                    'Channel': "",
                                    'Chassis_number': "",
                                    'Engine_number': ""
                                };
                                agent_wallet.findOne({Merchant_Id: customer_id}, function (err, dbAgentData) {
                                    if (err) {
                                        console.error("rzp_loading-", err);
                                    } else {
                                        if (dbAgentData && dbAgentData['_doc'].bank_account_no !== "") {
                                            let objUpdates = {
                                                "wallet_amount": dbAgentData['_doc'].wallet_amount + Number((amount / 100).toFixed(2)),
                                                "Modified_On": new Date(),
                                                "Last_Deposit_Date": new Date()
                                            };
                                            agent_wallet.update({'bank_account_no': dbAgentData['_doc'].bank_account_no}, {$set: objUpdates}, function (err) {
                                                if (err) {
                                                    console.error('rzp_loading_fail', err);
                                                }
                                            });
                                            try {
                                                let ss_id = (dbAgentData && dbAgentData['_doc'].SS_ID) ? dbAgentData['_doc'].SS_ID : 0;
                                                client.get('http://horizon.policyboss.com:5000/posps/dsas/view/' + parseInt(ss_id), {}, function (agent_data, response) {
                                                    if (agent_data['status'] === 'SUCCESS') {
                                                        let agent_email_id = agent_data.EMP.Email_Id;
                                                        let rm_email_id = "";
                                                        if (agent_data.RM && agent_data.RM.rm_details && agent_data.RM.rm_details.email) {
                                                            rm_email_id = agent_data.RM.rm_details.email;
                                                        }
                                                        var fs = require('fs');
                                                        var email_data = '';
                                                        email_data = fs.readFileSync(appRoot + '/resource/email/Send_Wallet_Deposit.html').toString();
                                                        var Email = require('../models/email');
                                                        var objModelEmail = new Email();
                                                        var bank_account_number = dbAgentData.bank_account_no ? (dbAgentData.bank_account_no).replace(/\d(?=\d{4})/g, "X") : "";
                                                        var objEmail = {
                                                            '___contact_name___': agent_data.EMP.Emp_Name,
                                                            '___bank_account_no___': bank_account_number,
                                                            '___date_time___': new Date(),
                                                            '___add_amount___': Number((amount / 100).toFixed(2)),
                                                            '___wallet_amount___': dbAgentData.wallet_amount + Number((amount / 100).toFixed(2)),
                                                            '___wallet_trans_type___': "credited"
                                                        };
                                                        let to = "";
                                                        to = agent_email_id;
                                                        to += rm_email_id ? ("," + rm_email_id) : "";
                                                        let subject = '[Wallet - Deposit]' + agent_data.EMP.Emp_Name + " - " + ss_id + " - " + Number((amount / 100).toFixed(2));
                                                        email_body = email_data.replaceJson(objEmail);
                                                        if (config.environment.name === 'Production') {
                                                            objModelEmail.send('noreply@policyboss.com', to, subject, email_body, '', config.environment.notification_email, '');
                                                        } else {
                                                            objModelEmail.send('noreply@policyboss.com', 'anuj.singh@policyboss.com', subject, email_body, '', '', '');
                                                        }
                                                        //store channel in rzp_wallet_histories collection
                                                        let rzpObjUpdate = {
                                                           "Channel": (dbAgentData && dbAgentData['_doc'].Channel) ? dbAgentData['_doc'].Channel : ""
                                                        };
                                                        wallet_history.update({'rzp_customer_id': customer_id,'rzp_payment_id': payId}, {$set: rzpObjUpdate}, function (err) {
                                                            if (err) {
                                                                console.error('rzp_loading_fail', err);
                                                            }
                                                        });
                                                    }
                                                });
                                            } catch (e) {
                                                res.json(e.stack);
                                            }
                                        }
                                    }
                                });
                                var transObj = new wallet_history(payObj);
                                transObj.save(function (err1) {
                                    if (err1) {
                                        console.error('rzp_wallet_loading_failed-', JSON.stringify(payObj), err1);
                                    } else {
                                        res.send({"Msg": "Success"});
                                    }
                                });
                            } else {
                                res.send({"Msg": "Fail", "Description": JSON.stringify(data.error)});
                            }
                        });
                    } else {
                        res.send({"Msg": "Success"});
                    }
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/rzp_order/:udid/:ssid/:amt/:ins_id/:crn/:proposal_id', function (req, res) {//create order id; before making payment to insurer accounts for premium payment
        try {
            let ssid = Number(req.params.ssid);
            let amount = Number(req.params.amt) * 100;
            let udid = req.params.udid;
            let insurer_id = req.params.ins_id;
            let crn = req.params.crn;
            let proposal_id = req.params.proposal_id;
            let transaction_id = udid + ',' + crn + ',' + proposal_id + ',' + insurer_id;
            let rzp_account_id = "";
//            if (parseInt(insurer_id) === 17) {
//                rzp_account_id = config.razor_pay.rzp_sbi.account_id;
//            } else if (parseInt(insurer_id) === 6) {
//                rzp_account_id = config.razor_pay.rzp_icici.account_id;
//            }
            let rzp_config_name = {17: "rzp_sbi", 6: "rzp_icici", 46: "rzp_edelweiss", 3: "rzp_chola", 48: "rzp_kotak", 4 : "rzp_future", 44: "rzp_digit"};
            let rzp_insurer = rzp_config_name[parseInt(insurer_id)];
            rzp_account_id = config.razor_pay[rzp_insurer].account_id;
            User_Data.findOne({User_Data_Id: Number(udid)}, function (dbErr, dbUserData) {
                if (dbErr) {
                    res.send(dbErr);
                } else {
                    let proposal_request = dbUserData.Proposal_Request;
                    let full_name = proposal_request['middle_name'] === "" ? (proposal_request['first_name'] + " " + proposal_request['last_name']) : (proposal_request['first_name'] + " " + proposal_request['middle_name'] + " " + proposal_request['last_name']);
                    let quote_no = dbUserData.Payment_Request.pg_data.txnid;
                    agent_wallet.findOne({SS_ID: ssid}, function (err, dbAgentData) {
                        if (err) {
                            console.error("rzp_order-", err);
                        } else {
                            let create_url = "https://api.razorpay.com/v1/orders";
                            let Client = require('node-rest-client').Client;
                            let client = new Client();
                            let username = config.razor_pay.rzp_sbi.username;
                            let password = config.razor_pay.rzp_sbi.password;
                            let customer_id = dbAgentData['_doc'].Merchant_Id;
                            let args = {
                                data: {
                                    "amount": ((config.environment.name === 'Production') ? amount : 100),
                                    "payment_capture": 1,
                                    "currency": "INR",
                                    "receipt": "receipt_" + udid,
                                    "notes": {
                                        "customer_name": full_name,
                                        "payment_mode": "wallet",
                                        "merchant_order_id": transaction_id,
                                        "quote_number": quote_no,
										"customer_id": customer_id
                                    },
                                    "transfers": [
                                        {
                                            "account": ([7582, 8067].indexOf(parseInt(ssid)) > -1) ? config.rzp_landmark.account_id : rzp_account_id,
                                            "amount": ((config.environment.name === 'Production') ? amount : 100),
                                            "currency": "INR",
                                            "on_hold": false
                                        }
                                    ]
                                },
                                headers: {"Content-Type": "application/json",
                                    "Accept": "application/json",
                                    'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                                }
                            };
                            client.post(create_url, args, function (data1, response1) {
                                if (data1.id !== "" && data1.id !== undefined && data1['status'] === 'created') {
                                    let objProposal = {
                                        'Insurer_Transaction_Identifier': (data1.id !== null) ? data1.id.toString() : '',
                                        'Modified_On': new Date()
                                    };
                                    let Proposal = require('../models/proposal');
                                    Proposal.update({'Proposal_Id': proposal_id - 0}, {$set: objProposal}, function (err1, numAffected) {
                                        if (err1) {
                                            res.send(err1);
                                        } else {
                                            res.send({"Customer_Id": customer_id, "Response": data1, "User_Data_Id": udid});
                                        }
                                    });
                                } else {
                                    res.send({"Msg": "Fail"});
                                }
                            });
                        }
                    });
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/rzp_payment/:cust_id/:ord_id/:amt/:udid/:trf_id/:cust_mobile_no/:cust_email_id', function (req, res) {//deduct payment amount
        try {
            let customer_id = req.params.cust_id;
            let order_id = req.params.ord_id;
            let amount = Number(req.params.amt);
            let udid = Number(req.params.udid);
            let trf_id = req.params.trf_id;
            let customer_mobile_no = req.params.cust_mobile_no;
            let customer_email_id = req.params.cust_email_id;
            agent_wallet.findOne({Merchant_Id: customer_id}, function (err, dbAgentData) {
                if (err) {
                    console.error("rzp_payment-", err);
                } else {
                    let pg_ack_url = (config.environment.name.toString() === 'Production') ? "https://horizon.policyboss.com/" : "http://qa-horizon.policyboss.com/";
                    wallet_history.findOne({'User_Data_Id': udid}, function (err1, dbPayData) {
                        if (err1) {
                            console.error('rzp_payment_fail', customer_id, amount, err1);
                        } else {
                            if (dbPayData !== null && dbPayData['_doc'].hasOwnProperty('rzp_payment_id') && dbPayData['_doc']['rzp_payment_id'].includes('pay_')) {
                                let rzp_res = dbPayData['_doc'].rzp_payment_response;
                                let obj_rzp_summary = {
                                    'pg_request': dbPayData['_doc'].rzp_payment_request,
                                    'pg_post': {
                                        "status": "Success",
                                        "amount": dbPayData['_doc'].transaction_amount,
                                        "razorpay_signature": rzp_res.razorpay_signature,
                                        "razorpay_order_id": rzp_res.razorpay_order_id,
                                        "razorpay_payment_id": rzp_res.razorpay_payment_id,
                                        "razorpay_transfer_id": dbPayData['_doc'].rzp_transfer_id
                                    },
                                    'pg_url': dbPayData['_doc'].return_url
                                };
                                res.send(obj_rzp_summary);
                            } else {
                                let create_url = "https://api.razorpay.com/v1/payments/create/openwallet";
                                let Client = require('node-rest-client').Client;
                                let client = new Client();
                                let username = config.razor_pay.rzp_sbi.username;
                                let password = config.razor_pay.rzp_sbi.password;
                                let args = {
                                    data: {
                                        "method": "wallet",
                                        "wallet": "openwallet",
                                        "customer_id": customer_id,
                                        "order_id": order_id,
                                        "amount": ((config.environment.name === 'Production') ? amount : 100),
                                        "currency": "INR",
                                        "contact": customer_mobile_no,
                                        "email": customer_email_id,
                                        "description": "Against " + order_id,
                                        "notes": {"customer_id": customer_id}
                                    },
                                    headers: {"Content-Type": "application/json",
                                        "Accept": "application/json",
                                        'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                                    }
                                };
                                client.post(create_url, args, function (data1, res1) {
                                    if (data1.razorpay_payment_id !== "" && data1.razorpay_payment_id !== undefined) {
                                        let objUpdates = {
                                            "wallet_amount": dbAgentData['_doc'].wallet_amount - Number((amount / 100).toFixed(2)),
                                            "Modified_On": new Date(),
                                            "Last_Transact_Date": new Date()
                                        };
                                        agent_wallet.update({Merchant_Id: customer_id}, {$set: objUpdates}, function (err2) {
                                            if (err2) {
                                                console.error('rzp_order_fail', customer_id, amount, err2);
                                            }
                                            User_Data.findOne({User_Data_Id: udid}, function (err3, dbUserData) {
                                                if (err3) {

                                                } else {
                                                    if (dbUserData !== null) {
                                                        let dbData = dbUserData._doc;
                                                        let proposal_id = dbData['Proposal_Id'];
                                                        let obj_rzp_summary = {
                                                            'pg_request': args.data,
                                                            'pg_post': {
                                                                "status": "Success",
                                                                "amount": Number((amount / 100).toFixed(2)),
                                                                "razorpay_signature": data1.razorpay_signature,
                                                                "razorpay_order_id": data1.razorpay_order_id,
                                                                "razorpay_payment_id": data1.razorpay_payment_id,
                                                                "razorpay_transfer_id": trf_id
                                                            }
                                                        };
                                                        obj_rzp_summary.pg_url = pg_ack_url + "transaction-status/" + udid + "/" + dbData['PB_CRN'] + "/" + proposal_id;

                                                        let historyObj = {
                                                            'PB_CRN': dbData['PB_CRN'],
                                                            'User_Data_Id': udid,
                                                            'Service_Log_Id': dbData.Proposal_Request_Core['slid'],
                                                            'rzp_customer_id': customer_id,
                                                            'rzp_payment_id': data1.razorpay_payment_id,
                                                            'rzp_transfer_id': trf_id,
                                                            'transaction_type': "DEBIT",
                                                            'transaction_amount': Number((amount / 100).toFixed(2)),
                                                            'rzp_payment_request': args.data,
                                                            'rzp_payment_response': data1,
                                                            'return_url': obj_rzp_summary.pg_url,
                                                            'Created_On': new Date(),
                                                            'Status': "SUCCESS",
                                                            'Channel': (dbAgentData && dbAgentData['_doc'].Channel) ? dbAgentData['_doc'].Channel : "",
                                                            'Chassis_number': (dbData.Proposal_Request_Core && dbData.Proposal_Request_Core.chassis_number) ? dbData.Proposal_Request_Core['chassis_number'] : "",
                                                            'Engine_number': (dbData.Proposal_Request_Core && dbData.Proposal_Request_Core.engine_number)? dbData.Proposal_Request_Core['engine_number'] : ""
                                                        };
                                                        try {
                                                            let ss_id = (dbAgentData && dbAgentData['_doc'].SS_ID) ? dbAgentData['_doc'].SS_ID : 0;
                                                            client.get('http://horizon.policyboss.com:5000/posps/dsas/view/' + parseInt(ss_id), {}, function (agent_data, response) {
                                                                if (agent_data['status'] === 'SUCCESS') {
                                                                    let agent_email_id = agent_data.EMP.Email_Id;
                                                                    let rm_email_id = "";
                                                                    if (agent_data.RM && agent_data.RM.rm_details && agent_data.RM.rm_details.email) {
                                                                        rm_email_id = agent_data.RM.rm_details.email;
                                                                    }
                                                                    var fs = require('fs');
                                                                    var email_data = '';
                                                                    email_data = fs.readFileSync(appRoot + '/resource/email/Send_Wallet_Deposit.html').toString();
                                                                    var Email = require('../models/email');
                                                                    var objModelEmail = new Email();
                                                                    var bank_account_number = dbAgentData.bank_account_no ? (dbAgentData.bank_account_no).replace(/\d(?=\d{4})/g, "X") : "";
                                                                    var objEmail = {
                                                                        '___contact_name___': agent_data.EMP.Emp_Name,
                                                                        '___bank_account_no___': bank_account_number,
                                                                        '___date_time___': new Date(),
                                                                        '___add_amount___': Number((amount / 100).toFixed(2)),
                                                                        '___wallet_amount___': dbAgentData.wallet_amount - Number((amount / 100).toFixed(2)),
                                                                        '___wallet_trans_type___': "debited"
                                                                    };
                                                                    let to = "";
                                                                    to = agent_email_id;
                                                                    to += rm_email_id ? ("," + rm_email_id) : "";
                                                                    let subject = '[Wallet - Transfer]' + agent_data.EMP.Emp_Name + " - " + ss_id + " - CRN: " + dbUserData._doc['PB_CRN'];
                                                                    email_body = email_data.replaceJson(objEmail);
                                                                    if (config.environment.name === 'Production') {
                                                                        objModelEmail.send('noreply@policyboss.com', to, subject, email_body, '', config.environment.notification_email, '');
                                                                    } else {
                                                                        objModelEmail.send('noreply@policyboss.com', 'roshani.prajapati@policyboss.com,anuj.singh@policyboss.com', subject, email_body, '', '', '');
                                                                    }
                                                                }
                                                            });
                                                        } catch (e) {
                                                            res.json(e.stack);
                                                        }
                                                        var transObj = new wallet_history(historyObj);
                                                        transObj.save(function (err4) {
                                                            if (err4) {
                                                                console.error('rzp_wallet_loading_failed-', JSON.stringify(historyObj));
                                                            }
                                                            res.send(obj_rzp_summary);
                                                        });
                                                    } else {
                                                        res.send({"Msg": "Fail"});
                                                    }
                                                }
                                            });
                                        });
                                    } else {
                                        let obj_rzp_summary = {
                                            'pg_request': args.data,
                                            'pg_post': {
                                                "status": "Fail",
                                                "amount": Number((amount / 100).toFixed(2)),
                                                "txn_id": "PB_" + udid,
                                                "order_id": order_id
                                            }
                                        };
//                                        obj_rzp_summary.pg_url = pg_ack_url + "transaction-status/" + udid;
                                        User_Data.findOne({User_Data_Id: udid}, function (err, userData) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                if (userData !== null) {
                                                    let user_data = userData._doc;
                                                    let proposal_id = user_data['Proposal_Id'];
                                                    obj_rzp_summary.pg_url = pg_ack_url + "transaction-status/" + udid + "/" + user_data['PB_CRN'] + "/" + proposal_id;
                                                    let historyObj = {
                                                        'PB_CRN': user_data['PB_CRN'],
                                                        'User_Data_Id': udid,
                                                        'Service_Log_Id': user_data.Proposal_Request_Core['slid'],
                                                        'rzp_customer_id': customer_id,
                                                        'rzp_payment_id': "",
                                                        'rzp_transfer_id': trf_id,
                                                        'transaction_type': "DEBIT",
                                                        'transaction_amount': Number((amount / 100).toFixed(2)),
                                                        'rzp_payment_request': args.data,
                                                        'rzp_payment_response': data1,
                                                        'return_url': obj_rzp_summary.pg_url,
                                                        'Created_On': new Date(),
                                                        'Status': "FAIL",
                                                        'Channel': (dbAgentData && dbAgentData['_doc'].Channel) ? dbAgentData['_doc'].Channel : "",
                                                        'Chassis_number': (user_data.Proposal_Request_Core && user_data.Proposal_Request_Core.chassis_number) ? user_data.Proposal_Request_Core['chassis_number'] : "",
                                                        'Engine_number': (user_data.Proposal_Request_Core && user_data.Proposal_Request_Core.engine_number)? user_data.Proposal_Request_Core['engine_number'] : ""
                                                    };
                                                    var transObj = new wallet_history(historyObj);
                                                    transObj.save(function (err4) {
                                                        if (err4) {
                                                            console.error('rzp_wallet_loading_failed-', JSON.stringify(historyObj));
                                                        }
                                                        res.send(obj_rzp_summary);
                                                    });
                                                } else {
                                                    res.send({"Msg": "Fail"});
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/rzp_getAccountDetail/:ssid', function (req, res) {//get agent wallet details
        try {
            agent_wallet.findOne({SS_ID: parseInt(req.params.ssid)}, {_id: 0}, function (err, dbAgentData) {
                if (err) {
                    console.error('rzp_getAccountDetail-', err);
                } else {
                    if (dbAgentData) {
                        res.send('<pre>' + JSON.stringify(dbAgentData, undefined, 2) + '</pre>');
                    } else {
                        res.send('Invalid ss_id');
                    }
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/getAccountDetail/:ssid', function (req, res) {
        try {
            let payu_token_url = (config.environment.name.toString() === 'Production') ? 'https://accounts.payu.in/' : 'https://uat-accounts.payu.in';
            let payu_base_url = (config.environment.name.toString() === 'Production') ? 'https://payout.payumoney.com' : 'https://test.payumoney.com';
            agent_wallet.findOne({SS_ID: parseInt(req.params.ssid)}, function (err, dbAgentData) {
                if (err) {

                } else {
                    if (dbAgentData) {
                        let client_id = (config.environment.name.toString() === 'Production') ? 'ccbb70745faad9c06092bb5c79bfd919b6f45fd454f34619d83920893e90ae6b' : '6f8bb4951e030d4d7349e64a144a534778673585f86039617c167166e9154f7e';
                        let args = {
                            data: {
                                "grant_type": "password",
                                "scope": "create_payout_transactions",
                                "client_id": client_id,
                                "username": (config.environment.name.toString() === 'Production') ? 'chirag.modi@policyboss.com' : 'payouttest4@mailinator.com',
                                "password": (config.environment.name.toString() === 'Production') ? 'P@yout21' : 'Tester@123'
                            },
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        };
                        function jsonToQueryString(json) {
                            return  Object.keys(json).map(function (key) {
                                return encodeURIComponent(key) + '=' +
                                        encodeURIComponent(json[key]);
                            }).join('&');
                        }
                        args.data = jsonToQueryString(args.data);
                        let Client = require('node-rest-client').Client;
                        let client = new Client();
                        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                        let obj_payu_summary = {
                            'rqst': null,
                            'rsps': null
                        };
                        client.post(payu_token_url + '/oauth/token', args, function (data) {
                            if (data && data.hasOwnProperty('access_token')) {
                                auth_token = data.access_token;
                                let args = {
                                    headers: {
                                        "Cache-Control": "no-cache",
                                        "Authorization": "Bearer " + auth_token,
                                        "payoutMerchantId": dbAgentData._doc['Merchant_Id'],
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    }
                                };
                                obj_payu_summary.rqst = args;
                                client.get(payu_base_url + '/payout/merchant/getAccountDetail', args, function (data) {
                                    try {
                                        obj_payu_summary.rsps = data;
                                        return res.send('<pre>' + JSON.stringify(obj_payu_summary, undefined, 2) + '</pre>');
                                    } catch (e) {
                                        return res.send(e.stack);
                                    }
                                });
                            } else {
                                return res.send(data);
                            }
                        });
                    } else {
                        res.send('Invalid ss_id');
                    }
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/executePaymentTransfer/:udid/:merchantid', function (req, res) {
        try {
            let payu_base_url = (config.environment.name.toString() === 'Production') ? 'https://payout.payumoney.com' : 'https://test.payumoney.com';
            let pg_ack_url = (config.environment.name.toString() === 'Production') ? "http://horizon.policyboss.com/" : "http://qa-horizon.policyboss.com/";
            let udid = parseInt(req.params.udid);
            let merchant_id = req.params['merchantid'];
            User_Data.findOne({User_Data_Id: udid}, function (err, dbUserData) {
                if (err) {
                    res.send(err);
                } else {
                    if (dbUserData) {
                        let dbData = dbUserData._doc;
                        let crn = dbData['PB_CRN'];
                        let proposal_id = dbData['Proposal_Id'];
                        let slid = dbData.Proposal_Request_Core['slid'];
                        let premium = dbData.Erp_Qt_Request_Core['___final_premium___'];
                        wallet_transaction.findOne({User_Data_Id: udid}, function (err, dbTrans) {
                            if (err)
                                res.send(err);
                            if (dbTrans !== null) {
//                            wallet_transaction.update({User_Data_Id: udid}, {$set: {'Status': "Pending"}}, function (err) {
//                                if (err) {
//                                    res.json({Details: err});
//                                } else {
//                                    res.json({Msg: 'Updated'});
//                                }
//                            });
                            } else {
                                let args = {
                                    data: [
                                        {
                                            "beneficiaryAccountNumber": "1234567890",
                                            "beneficiaryIfscCode": "KKBK0000431",
                                            "beneficiaryName": "Ankush Pokarana",
                                            "beneficiaryEmail": "",
                                            "beneficiaryMobile": "",
                                            "purpose": "Citi test",
                                            "amount": premium.toString(),
                                            "batchId": "citi",
                                            "merchantRefId": "POLICYBOSS-" + crn + '-' + udid,
                                            "paymentType": "IMPS",
                                            "recipientCardNo": "5123456789012346",
                                            "retry": false
                                        }
                                    ],
                                    headers: {
                                        "Cache-Control": "no-cache",
                                        "Authorization": "Bearer " + auth_token,
                                        "payoutMerchantId": merchant_id,
                                        "Content-Type": "application/json"
                                    }
                                };
                                let Client = require('node-rest-client').Client;
                                let client = new Client();
                                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                                let obj_payu_summary = {
                                    'rqst': null,
                                    'rsps': null
                                };
                                obj_payu_summary.rqst = args;
                                client.post(payu_base_url + '/payout/payment', args, function (data) {
                                    try {
                                        let args = {
                                            'PB_CRN': crn,
                                            'User_Data_Id': udid,
                                            'Service_Log_Id': slid,
                                            'Premium': premium,
                                            'Payu_Request': obj_payu_summary.rqst,
                                            'Payu_Response': data,
                                            'Payu_Status': data.status,
                                            'Payu_Requested_On': new Date(),
                                            'Created_On': new Date(),
                                            'Status': "Pending"
                                        };
                                        var transactionObj = new wallet_transaction(args);
                                        transactionObj.save(function (err) {
                                            if (err) {
                                                console.log('executePaymentTransfer-', 'Insert Failed');
                                            } else {
                                                console.log('executePaymentTransfer-', 'Inserted');
                                            }
                                        });
                                        obj_payu_summary.rsps = data;
                                        obj_payu_summary.rsps.pg_url = pg_ack_url + "transaction-status/" + udid + "/" + crn + "/" + proposal_id;
                                        obj_payu_summary.rsps.pg_post = {};
                                        if (data.status === 0) {
                                            obj_payu_summary.rsps.pg_post = {
                                                "status": "Success",
                                                "amount": premium,
                                                "txnid": "POLICYBOSS-" + crn + '-' + udid
                                            };
                                        } else {
                                            obj_payu_summary.rsps.pg_post = {
                                                "status": "Fail",
                                                "txnid": "POLICYBOSS-" + crn + '-' + udid
                                            };
                                        }
                                        return res.send('<pre>' + JSON.stringify(obj_payu_summary, undefined, 2) + '</pre>');
                                    } catch (e) {
                                        console.error("executePaymentTransfer-", e.stack);
                                    }
                                });
                            }
                        });
                    } else {
                        res.send('Invalid UDID');
                    }
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/policycancellation', function (req, res) {
        try {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err1, db) {
                var dhfl_cancelpolicy = db.collection('dhfl_cancelpolicy');
                var Email = require('../models/email');
                var objModelEmail = new Email();
                dhfl_cancelpolicy.find().toArray(function (err2, dbItems) {
                    if (err2)
                    {
                        res.send('Error');
                    } else {
                        for (let i in dbItems) {
                            if (i === "1" || i === "2") {
                                let msg = "Dear Sir,<BR><BR>Please find attached the Notice of cancellation issued against the Policy no " + dbItems[i].Insurance_Policy_No + " dated " + dbItems[i].Date + ".<BR><BR>Since the address in the Policy is incomplete, we are sending the Notice of cancellation in the email id provided by you at the time of issuance of the policy.<BR><BR>Please download letter from below link : " + dbItems[i].url + "<BR><BR><BR>For Landmark Insurance Brokers Pvt.Ltd.<BR><BR>Team Customer Care,";
                                let arr_cc = "customercare@policyboss.com";
                                let bcc = "horizonlive.2020@gmail.com";
                                let subject = "Notice of Cancellation against your Policy No: " + dbItems[i].Insurance_Policy_No;
                                let content_html = '<!DOCTYPE html><html><head><style>*,html,body{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>' + subject + '</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                content_html += '<p>' + msg + '</p>';
                                content_html += '</body></html>';
                                //let arr_to = dbItems[i].Email;
                                let arr_to = "anuj.singh@policyboss.com";
                                objModelEmail.send('noreply@policyboss.com', arr_to, subject, content_html, arr_cc, config.environment.notification_email, "");
                            }
                        }
                    }

                });
                res.send('Success');
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/getMerchantId/:ss_id', function (req, res) {
        try
        {
            var ss_id = parseInt(req.params.ss_id);
            console.log(ss_id);
            var agent_wallet = require('../models/agent_wallet');
            agent_wallet.find({"SS_ID": ss_id,"IsActive":1}, function (err, dbMerchantId) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(dbMerchantId);
                }
            });

        } catch (err) {
            res.json({'msg': 'error'});
        }
    });
    app.get('/wallets/agent_wallet_allow/:ss_id', function (req, res) {
        try
        {
            var ss_id = parseInt(req.params.ss_id);
            console.log(ss_id);
            var agent_wallet = require('../models/agent_wallet');
            agent_wallet.find({"SS_ID": ss_id, IsActive: 1}, function (err, dbAgentAllow) {
                if (err) {
                    res.json({'is_allow_wallet' : 'no'});
                } else {
                    if(dbAgentAllow.length > 0) {
                        res.json({'is_allow_wallet' : 'yes'});
                    } else {
                        res.json({'is_allow_wallet' : 'no'});
                    }
                }
            });

        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/rzp_wallet_histories/:cust_id', function (req, res) {
        try
        {
            let cust_id = req.params.cust_id;
            let date = moment().format('YYYY-MM-DD');
            let current_date = new Date(date + "T00:00:00Z") ;
            let end_date =  moment(current_date, "YYYY-MM-DDThh:mm:ssZ").add(1, 'days');
            var razorpay_wallet_history = require('../models/rzp_wallet_history');
            // razorpay_wallet_history.find({"rzp_customer_id": cust_id, "transaction_type": "DEBIT", 'Created_On': {$gt: current_date}}, function (err, dbrzpWalletHis) {
		razorpay_wallet_history.find({"rzp_customer_id": cust_id, "transaction_type": "DEBIT", "Status": "SUCCESS", 'Created_On': {$gte: current_date, $lte: end_date}}, function (err, dbrzpWalletHis) {
                if (err) {
                    res.json(err);
                } else {
                    if (dbrzpWalletHis.length > 0) {
                        res.json({'msg': 'success', 'rzp_wallet_history': dbrzpWalletHis});
                    } else {
                        res.json({'msg': 'success'});
                    }
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/get_session_data/:session_id', function (req, res) {
        try {
            console.log("Working");
            var session_id = req.params['session_id'];
            var Session = require('../models/session');
            Session.findOne({"_id": session_id}, function (err, dbSession) {
                if (err) {
                    res.send(err);
                } else {
                    if (dbSession) {
                        dbSession = dbSession._doc;
                        var obj_session = JSON.parse(dbSession['session']);
                        res.json({'msg' : 'success', 'session_data' : obj_session});
                    } else {
                        res.json({'msg': 'Session Expired.Not Authorized'});
                    }
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/get_wallet_details/:ss_id', function (req, res) {
        try
        {
            var ss_id = parseInt(req.params.ss_id);
            console.log(ss_id);
            var agent_wallet = require('../models/agent_wallet');
            agent_wallet.find({"SS_ID": ss_id}, function (err, dbData) {
                if (err) {
                    res.json({'Status' : 'Fail'});
                } else {
                    res.json(dbData);
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/razorpay/create_order_id/:udid', function (req, res) { //create order id
        try
        {
            var udid = parseInt(req.params.udid);
            var user_Data = require('../models/user_data');
            user_Data.findOne({'User_Data_Id': udid}, function (err, dbUserData) {
                if (err) {
                    res.json({'Status': 'Fail'});
                } else {
                    if (dbUserData) {
                        let dbData = dbUserData._doc;
                        let proposal_request = dbData['Proposal_Request_Core'];
                        let insurer_id = dbData['Insurer_Id'];
//                        let ssid = proposal_request['ss_id'] - 0;
                        let full_name = proposal_request['middle_name'] === "" ? (proposal_request['first_name'] + " " + proposal_request['last_name']) : (proposal_request['first_name'] + " " + proposal_request['middle_name'] + " " + proposal_request['last_name']);
                        let rzrpay_account_id = "";
                        let rzp_config_name = {6: "rzp_icici", 46: "rzp_edelweiss", 3: "rzp_chola", 4 : "rzp_future", 44: "rzp_digit"};
                        let rzp_insurer = rzp_config_name[insurer_id];
//                        rzrpay_account_id = config.razor_pay[rzp_insurer].account_id;
                        let Client = require('node-rest-client').Client;
                        let client = new Client();
                        let rzrpay_amount = 100;
                        if([16114].indexOf(parseInt(proposal_request['ss_id'])) > -1) {
                            rzrpay_account_id = config.rzp_landmark.account_id;
                        }
			else if([8067,7582].indexOf(parseInt(proposal_request['ss_id'])) > -1) {
                                rzrpay_amount = 100;
                                rzrpay_account_id = config.razor_pay[rzp_insurer].account_id;
                            } 
                        else {
                            rzrpay_amount = Math.round(proposal_request['final_premium']) * 100;
                            rzrpay_account_id = config.razor_pay[rzp_insurer].account_id;
                        }
			
                        let request = {
                            "amount": rzrpay_amount,
                            "payment_capture": 1,
                            "currency": "INR",
                            "notes": {
                                "customer_name": full_name,
                                "payment_mode" : "individual"
                            },
                            "transfers": [
                                {
                                    "account": rzrpay_account_id,
                                    "amount": rzrpay_amount,
                                    "currency": "INR"
                                }
                            ]
                        };
                        var username = config.razor_pay[rzp_insurer].username;
                        var password = config.razor_pay[rzp_insurer].password;
                        let create_order_url = "https://api.razorpay.com/v1/orders";
                        var args = {
                            data: request,
                            headers: {"Content-Type": "application/json",
                                "Accept": "application/json",
                                'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                            }
                        };
                        console.log(JSON.stringify(args));
                        let pg_ack_url = (config.environment.name.toString() === 'Production') ? "https://horizon.policyboss.com/" : "http://qa-horizon.policyboss.com/";
                        let return_url = pg_ack_url + "transaction-status/" + udid + "/" + dbData['PB_CRN'] + "/" + dbData['Proposal_Id'];
                        var merchant_key = config.razor_pay[rzp_insurer].username;
                        let quoteId = "";
                        if ([46].indexOf(parseInt(insurer_id)) > -1) {
                            quoteId = dbData['Processed_Request']['___policy_number_generate___'];
                        } else {
                            quoteId = dbData['Insurer_Transaction_Identifier'];
                        }	
                        var pg_data = {
                            'key': merchant_key,
                            'full_name': full_name,
                            'return_url': return_url,
                            'phone': proposal_request['mobile'],
                            'orderId': "",
                            'txnId': udid + ',' + dbData['PB_CRN'] + ',' + dbData['Proposal_Id'] + ',' + insurer_id,
                            'quoteId': quoteId,
                            'amount': Math.round(proposal_request['final_premium']), //(config.environment.name.toString() === 'Production') ? Math.round(proposal_request['final_premium']) : 1,
                            'email': proposal_request['email'],
                            'img_url': 'https://origin-cdnh.policyboss.com/website/Images/PolicyBoss-Logo.jpg',
                            'pg_type': "rzrpay",
                            'transfer_id': ""
                        };
                        let ObjUser_Data = {
                            "Payment_Request.pg_url": "",
                            "Payment_Request.pg_data": pg_data,
                            "Payment_Request.pg_redirect_mode": "POST"
                        };
                        client.post(create_order_url, args, function (rzp_response, response) {
                            if ((rzp_response.hasOwnProperty('status') && rzp_response['status'] === "created" && rzp_response.hasOwnProperty('id') && rzp_response['id'].includes('order_'))) {
                                pg_data['orderId'] = rzp_response["id"];
                                pg_data['transfer_id'] = rzp_response.hasOwnProperty('transfers') && rzp_response['transfers'][0].hasOwnProperty('status') && rzp_response['transfers'][0]['status'] === "created" ? rzp_response['transfers'][0]['id'] : "";
                                User_Data.update({'User_Data_Id': udid}, {$set: ObjUser_Data}, function (err1, numAffected) {
                                    if (err1) {
                                        res.json({'Status': 'Fail'});
                                    } else {
                                        let objProposal = {
                                            'Insurer_Transaction_Identifier': (rzp_response["id"] !== null) ? rzp_response["id"].toString() : '',
                                            'Modified_On': new Date(),
                                            'Proposal_Response.Payment.pg_url' : '',
                                            'Proposal_Response.Payment.pg_data' : pg_data
                                        };
                                        let Proposal = require('../models/proposal');
                                        Proposal.update({'Proposal_Id': dbData['Proposal_Id'] - 0}, {$set: objProposal}, function (err1, numAffected) {
                                            if (err1) {
                                                res.send(err1);
                                            } else {
                                                res.json({'Status': 'Success', 'data': rzp_response, 'Razorpay_Request': args});
                                            }
                                        });
                                    }
                                });
                            } else {
                                 User_Data.update({'User_Data_Id': udid}, {$set: ObjUser_Data}, function (err2, numAffected) {
                                    if (err2) {
                                        res.json({'Status': 'Fail'});
                                    } else {
                                        res.json({'Status': 'Fail', 'Msg': 'Razorpay Order Not Created'});
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({'Status': 'Fail'});
                    }
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/wallets/get_rzp_history_details/:crn', function (req, res) {
        try {
            let crn = req.params.crn - 0;
            wallet_history.findOne({'PB_CRN': crn, 'Status': "SUCCESS"}, function (err, db_rzp_history) {
                if (err) {
                    res.send({'Status': 'Fail'});
                } else {
                    res.send(db_rzp_history);
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/sync_wallet_balance/:ssid', function (req, res) { // get agent wallet amount
        try {
            let customer_id = "";
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let ss_id = parseInt(req.params.ssid);
            let username = config.razor_pay.rzp_sbi.username;
            let password = config.razor_pay.rzp_sbi.password;
            agent_wallet.findOne({SS_ID: ss_id}, {_id: 0}, function (err, dbAgentData) {
                if (err) {
                    res.json(err);
                } else {
                    if (dbAgentData) {
                        customer_id = dbAgentData.Merchant_Id ? dbAgentData['Merchant_Id'] : "";
                        let wallet_balance_url = "https://api.razorpay.com/v1/customers/" + customer_id + "/balance";
                        let args = {
                            headers: {"Content-Type": "application/json",
                                "Accept": "application/json",
                                'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                            }
                        };
                        client.get(wallet_balance_url, args, function (data, response) {
                            try {
                                if (data.hasOwnProperty('balance')) {
                                    console.log("data: -" + JSON.stringify(data));
                                    let rzp_wallet_amount = Number((data['balance'] / 100).toFixed(2));
                                    if (rzp_wallet_amount === dbAgentData['wallet_amount']) {
                                        res.json({'Status': 'Success', 'data': data, 'is_update': false});
                                    } else {
                                        let objUpdates = {
                                            "wallet_amount": rzp_wallet_amount,
                                            "Modified_On": new Date()
                                        };
                                        agent_wallet.update({Merchant_Id: customer_id}, {$set: objUpdates}, function (err1) {
                                            if (err1) {
                                                res.json(err1);
                                            }
                                            let args1 = {
                                                "SS_ID": ss_id,
                                                "Customer_Id": customer_id,
                                                "Old_Amount": dbAgentData['wallet_amount'],
                                                "New_Amount": rzp_wallet_amount,
                                                "Created_On": new Date(),
                                                "Modified_On": new Date()
                                            };
                                            var db_wallet_payment_save = new wallet_payment_update(args1);
                                            db_wallet_payment_save.save(function (err2) {
                                                if (err2) {
                                                    res.json(err2);
                                                } else {
                                                    res.json({'Status': 'Success', 'data': data, 'is_update': true});
                                                }
                                            });
                                        });
                                    }
                                } else {
                                    res.json({'Status': "Fail", 'data': data});
                                }
                            } catch (e) {
                                return res.send(e.stack);
                            }
                        });
                    } else {
                        res.json({'Status': "Fail", 'data': "No Record Available"});
                    }
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
	
    app.get('/razorpay/create_razorpay_order_id/:proposal_id', function (req, res) { //create order id by proposal_id
        try
        {
            var Proposal_Id = req.params.proposal_id ? parseInt(req.params.proposal_id) : "";
            if (Proposal_Id !== "") {
                var Proposal = require('../models/proposal');
                Proposal.findOne({'Proposal_Id': Proposal_Id}, function (err, dbProposal) {
                    if (err) {
                        res.json({'Status': 'Fail'});
                    } else {
                        if (dbProposal) {
                            let dbData = dbProposal._doc;
                            let proposal_request = dbData['Proposal_Request'];
                            let insurer_id = proposal_request['insurer_id'];
                            let full_name = proposal_request['middle_name'] === "" ? (proposal_request['first_name'] + " " + proposal_request['last_name']) : (proposal_request['first_name'] + " " + proposal_request['middle_name'] + " " + proposal_request['last_name']);
                            let rzrpay_account_id = "";
                            let rzp_config_name = {6: "rzp_icici", 46: "rzp_edelweiss", 3: "rzp_chola", 4: "rzp_future", 44: "rzp_digit"};
                            let rzp_insurer = rzp_config_name[insurer_id];
                            let Client = require('node-rest-client').Client;
                            let client = new Client();
                            let rzrpay_amount = 100;
                            if ([16114].indexOf(parseInt(proposal_request['ss_id'])) > -1) {
                                rzrpay_account_id = config.rzp_landmark.account_id;
                            } else if ([8067, 7582].indexOf(parseInt(proposal_request['ss_id'])) > -1) {
                                rzrpay_amount = 100;
                                rzrpay_account_id = config.razor_pay[rzp_insurer].account_id;
                            } else {
                                rzrpay_amount = Math.round(proposal_request['final_premium']) * 100;
                                rzrpay_account_id = config.razor_pay[rzp_insurer].account_id;
                            }

                            let request = {
                                "amount": rzrpay_amount,
                                "payment_capture": 1,
                                "currency": "INR",
                                "notes": {
                                    "customer_name": full_name,
                                    "payment_mode": "individual"
                                },
                                "transfers": [
                                    {
                                        "account": rzrpay_account_id,
                                        "amount": rzrpay_amount,
                                        "currency": "INR"
                                    }
                                ]
                            };
                            var username = config.razor_pay[rzp_insurer].username;
                            var password = config.razor_pay[rzp_insurer].password;
                            let create_order_url = "https://api.razorpay.com/v1/orders";
                            var args = {
                                data: request,
                                headers: {"Content-Type": "application/json",
                                    "Accept": "application/json",
                                    'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                                }
                            };
                            console.log(JSON.stringify(args));
                            client.post(create_order_url, args, function (rzp_response, response) {
                                if ((rzp_response && rzp_response.hasOwnProperty('status') && rzp_response['status'] === "created" && rzp_response.hasOwnProperty('id') && rzp_response['id'].includes('order_'))) {
                                    res.json({'Status': 'Success', 'data': rzp_response});
                                } else {
                                    res.json({'Status': 'Fail', 'Msg': 'Razorpay Order Not Created'});
                                }
                            });
                        } else {
                            res.json({'Status': 'Fail'});
                        }
                    }
                });
            } else {
                res.json({'Status': 'Fail', 'Msg': 'Invalid Proposal Id'});
            }
        } catch (e) {
            res.json({'Status': 'Fail', 'Msg': e.stack});
        }
    });
};
function LoadSession(req, res, next) {
    try {
        var objRequestCore = req.body;
        if (req.method === "GET") {
            objRequestCore = req.query;
        }
        objRequestCore = JSON.parse(JSON.stringify(objRequestCore));
        if (objRequestCore.hasOwnProperty('session_id') && objRequestCore['session_id'] !== '') {
            var Session = require('../models/session');
            Session.findOne({"_id": objRequestCore['session_id']}, function (err, dbSession) {
                if (err) {
                    res.send(err);
                } else {
                    if (dbSession) {
                        dbSession = dbSession._doc;
                        var obj_session = JSON.parse(dbSession['session']);
                        req.obj_session = obj_session;
                        return next();
                    } else {
                        return res.status(401).json({'Msg': 'Session Expired.Not Authorized'});
                    }
                }
            });
        } else {
            return next();
        }
    } catch (e) {
        console.error('Exception', 'GetReportingAssignedAgent', e);
        return next();

    }
}
