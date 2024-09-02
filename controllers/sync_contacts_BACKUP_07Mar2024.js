/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Email = require('../models/email');
var Sync_Contact = require('../models/sync_contact');
var sync_contact_erp_data = require('../models/sync_contact_erp_data');
var http = require('http');
var const_free_lead = 25;
let obj_RsaData;
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
module.exports.controller = function (app) {
    app.get('/sync_contacts/sync_sale', function (req, res, next) {
        try {
            var User_Data = require('../models/user_data');
            var arr_sale = ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY'];
            var today = moment().utcOffset("+05:30").startOf('Day');
            var yesterday = moment(today).add(-1, 'days').format("YYYY-MM-DD");
            let type = (req.query.hasOwnProperty('type') && req.query['type'] !== '') ? req.query['type'] : '';
            if (type === 'DAILY') {
                StartDate = moment(today).add(-1, 'days').startOf('Day');
                EndDate = moment(today).add(-1, 'days').endOf('Day');
            }
            if (type === 'CUSTOM') {
                StartDate = moment(req.query['datefrom']).utcOffset("+05:30").startOf('Day');
                EndDate = moment(req.query['dateto']).utcOffset("+05:30").endOf('Day');
            }
            var cond_ud = {
                'Product_Id': 1,
                'Last_Status': {$in: arr_sale},
                "Modified_On": {"$gte": StartDate, "$lte": EndDate}
            };
            User_Data.find(cond_ud).sort({User_Data_Id: 1}).select({User_Data_Id: 1, PB_CRN: 1, ERP_CS: 1, 'Premium_Request': 1, 'Proposal_Request_Core': 1, Modified_On: 1}).exec(function (err, dbUserDatas) {
                if (err) {
                    return res.send(err);
                }
                try {
                    var arr_report = {
                        'summary': {
                            'total': 0,
                            'process': 0,
                            'found': 0,
                            'err': 0
                        },
                        'list': {},
                        'found': [],
                        'err': [],
                    };
                    arr_report['summary']['total'] = dbUserDatas.length;
                    for (let j in dbUserDatas) {
                        let ud = dbUserDatas[j]._doc;
                        try {
                            let ss_id = ud['Premium_Request']['ss_id'];
                            let mobile = ud['Proposal_Request_Core']['mobile'] - 0;
                            let obj_Ud = {
                                'ss_id': ss_id,
                                'User_Data_Id': ud['User_Data_Id'],
                                'PB_CRN': ud['PB_CRN'],
                                'Mobile': mobile,
                                'On': ud['Modified_On'],
                                'Registration_No': ud['Proposal_Request_Core']['registration_no'],
                                'Name': ud['Proposal_Request_Core']['first_name'] + ' ' + ud['Proposal_Request_Core']['last_name'],
                                'Vehicle': ud['Premium_Request']['vehicle_full'],
                                'YOM': ud['Premium_Request']['vehicle_manf_date'].split('-')[0].toString()
                            };
                            arr_report['list'][ss_id + '_' + mobile] = obj_Ud;
                            sale_sync_handler(req, res, arr_report, ss_id, mobile, obj_Ud);
                        } catch (e) {
                            arr_report['summary']['process']++;
                            arr_report['summary']['err']++;
                            arr_report['err'].push({
                                'DT': ud.PB_CRN,
                                'err': e.stack
                            });
                            if (arr_report['summary']['total'] === arr_report['summary']['process']) {
                                sync_contact_sale_match_email(arr_report, req);
                                res.send('<pre>' + JSON.stringify(arr_report) + '</pre>');
                            }
                        }
                    }
                } catch (e) {
                    res.send(e.stack);
                }
                //res.send('<pre>' + JSON.stringify(arr_report) + '</pre>');
            });
        } catch (e) {
            res.send(e.stack);
        }
    });
    function sale_sync_handler(req, res, arr_report, ss_id, mobile, obj_Ud) {
        var Condi_Sync_Contanct_Lead = {
            'ss_id': ss_id,
            'sync_Mobile': mobile.toString(),
            //'Is_Customer_Data': null,
            //'yom': obj_Ud['YOM']
        };
        sync_contact_erp_data.findOne(Condi_Sync_Contanct_Lead).exec(function (err, db_sync_contact_erp_data) {
            if (!err) {
                arr_report['summary']['process']++;
                try {
                    arr_report['list'][ss_id + '_' + mobile]['found'] = 'no';
                    if (db_sync_contact_erp_data) {
                        arr_report['list'][ss_id + '_' + mobile]['found'] = 'yes';
                        arr_report['list'][ss_id + '_' + mobile]['lead_yom'] = db_sync_contact_erp_data._doc['yom'] || 'NA';
                        arr_report['list'][ss_id + '_' + mobile]['lead_name'] = db_sync_contact_erp_data._doc['name'] || 'NA';
                        arr_report['list'][ss_id + '_' + mobile]['lead_vehicle'] = (db_sync_contact_erp_data._doc['make']) ? db_sync_contact_erp_data._doc['make'] + '|' + db_sync_contact_erp_data._doc['model'] + '|' + db_sync_contact_erp_data._doc['variant'] : 'NA';
                        arr_report['summary']['found']++;
                        arr_report['found'].push(arr_report['list'][ss_id + '_' + mobile]);
                    }
                    if (req.query['op'] === 'execute') {
                        sync_contact_erp_data.update(Condi_Sync_Contanct_Lead, {$set: {'Is_Sale': 1, 'Sale_On': obj_Ud['On'], 'Sale_Crn': obj_Ud['PB_CRN']}}).exec(function (err, sync_contact_erp_data_count) {
                            console.error('DBG', 'sale_sync', Condi_Sync_Contanct_Lead, sync_contact_erp_data_count);
                        });
                    }
                    if (arr_report['summary']['total'] === arr_report['summary']['process']) {
                        sync_contact_sale_match_email(arr_report, req);
                        res.send('<pre>' + JSON.stringify(arr_report) + '</pre>');
                    }
                } catch (e) {
                    arr_report['summary']['err']++;
                    arr_report['err'].push({
                        'DT': obj_Ud.PB_CRN,
                        'cberr': e.stack
                    });
                    if (arr_report['summary']['total'] === arr_report['summary']['process']) {
                        sync_contact_sale_match_email(arr_report, req);
                        res.send('<pre>' + JSON.stringify(arr_report) + '</pre>');
                    }
                }
            }
        });
    }
    function sync_contact_sale_match_email(arr_report, req) {
        var today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
        var Email = require('../models/email');
        var objModelEmail = new Email();
        let sub = ((req.query['op'] === 'execute') ? '' : '[PREVIEW]') + '[SCHEDULER]SYNC_CONTACT::SALE_MATCH:Total-' + arr_report['found'].length + '::On-' + moment().format('YYYYMMDD_HH:mm:ss');
        let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
        res_report += '<p><h1>SYNC CONTACT LEAD ALLOCATION REPORT :: Total Lead - ' + arr_report['found'].length + ' :: ' + today_str + '</h1></p>';
        res_report += arrayobjectToHtml(arr_report['found'], 'SYNC CONTACT :: SALE MATCH', '', ['Mobile', 'found']);
        res_report += '</p>';
        res_report += '</body></html>';
        objModelEmail.send('customercare@policyboss.com', config.environment.notification_email, sub, res_report, '', '', '');
    }
app.post('/sync_contacts/contact_call_history', agent_details_pre, function (req, res) {
    var objRequestCore = req.body;
    // console.log("POST :: objRequestCore :: ", objRequestCore);
    var fbaid = objRequestCore['fba_id'] - 0;
    var ssid = objRequestCore['ss_id'] - 0;
    var syncPospSummary = {
        'Message': '',
        'Status': '',
        'StatusNo': 0
    };
    var mobile_list = [];
    var arrContact = [];
    var exist_contact = [];
    var today = moment().utcOffset("+05:30");
    var today_str = moment(today).format("YYYYMMD");
    var objRequest = {
        'dt': today.toLocaleString(),
        'resp': req.body
    };
    fs.appendFile(appRoot + "/tmp/log/contact_call_history_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    if (ssid > 0 && ssid !== 5)
    {
        for (var k in objRequestCore['call_history'])
        {
            objRequestCore['call_history'][k]['ss_id'] = ssid;
            objRequestCore['call_history'][k]['fba_id'] = fbaid;
            objRequestCore['call_history'][k]['Created_On'] = new Date();
            objRequestCore['call_history'][k]['Modified_On'] = new Date();
            arrContact.push(objRequestCore['call_history'][k]);
        }
            var sync_contact_call_history = require('../models/sync_contact_call_history');
            if (arrContact.length > 0)
            {
                sync_contact_call_history.insertMany(arrContact, function (err3, data) {
                    if (err3) {
                        syncPospSummary.Message = err3;
                        syncPospSummary.Status = 'Error';
                        syncPospSummary.StatusNo = 1;
                        res.json(syncPospSummary);
                    } else {
                        syncPospSummary.Message = 'Call History Added Successfully.';
                        syncPospSummary.Status = 'success';
                        syncPospSummary.StatusNo = 0;
                        res.json(syncPospSummary);
                    }
                });
            } else
            {
                syncPospSummary.Message = 'Call History No Data Available';
                syncPospSummary.Status = 'Error';
                syncPospSummary.StatusNo = 1;
                res.json(syncPospSummary);
            }
            //console.log(arrContact);
    } else
    {
        syncPospSummary.Message = 'Ss_Id not exist.Kindly contact tech support.';
        syncPospSummary.Status = 'Error';
        syncPospSummary.StatusNo = 1;
        res.json(syncPospSummary);
    }
});
    app.post('/sync_contacts/contact_entry_ver2_NIU', agent_details_pre, function (req, res) {
        var objRequestCore = req.body;
        // console.log("POST :: objRequestCore :: ", objRequestCore);
        var fbaid = objRequestCore['fbaid'] - 0;
        var ssid = objRequestCore['ssid'] - 0;
		var sub_fba_id = objRequestCore['sub_fba_id'] || 0;
		sub_fba_id = sub_fba_id -0;
        var syncPospSummary = {
            'Message': '',
            'Status': '',
            'StatusNo': 0
        };
        var mobile_list = [];
        var arrContact = [];
        var exist_contact = [];
        var today = moment().utcOffset("+05:30");
        var today_str = moment(today).format("YYYYMMD");
        var objRequest = {
            'dt': today.toLocaleString(),
            'resp': req.body
        };
        fs.appendFile(appRoot + "/tmp/log/contact_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        if (ssid > 0 && ssid !== 5)
        {
            for (let j in objRequestCore['contactlist'])
            {
				let is_valid_mobile = false;
				let mobileno = objRequestCore['contactlist'][j]['mobileno'].toString().replace(/\D/g,'');
				if(mobileno.length === 10 && (mobileno.length === 12 && mobileno.indexOf('91') === 0) || (mobileno.length === 13 && mobileno.indexOf('091') === 0) ){
					mobileno = mobileno.substr(mobileno.length - 10);
					var mobilepattern = new RegExp('^[6-9]{1}[0-9]{9}$');
					if(mobilepattern.test(mobileno) === true){
						is_valid_mobile = true;
					}									
				}
				
				
				if(is_valid_mobile === true){
					mobile_list.push(mobileno);
				}
                
            }
            var cond = {
                "mobileno": {
                    "$in": mobile_list
                },
                'ss_id': ssid
            };
            //console.log(cond);
			
                
			Sync_Contact.find(cond).exec(function (err2, dbItems) {
				try{
				//exist_contact = dbItems;
					if (err2) {
						syncPospSummary.Message = err2;
						syncPospSummary.Status = 'Error';
						syncPospSummary.StatusNo = 1;
						res.json(syncPospSummary);
					} else {
						let obj_raw_data = {};
						if (objRequestCore.hasOwnProperty('raw_data') && objRequestCore['raw_data'] && objRequestCore['raw_data'] !== null && objRequestCore['raw_data'] !== '') {
							objRequestCore['raw_data'] = JSON.parse(objRequestCore['raw_data']);
							for (let k in objRequestCore['raw_data']) {
								try {
									let data_key = objRequestCore['raw_data'][k]['displayName'] + '-' + objRequestCore['raw_data'][k]['phoneNumbers'][0]['normalizedNumber'].replace('+91', '');
									data_key = data_key.replace(/ /g, '_');
									if (obj_raw_data.hasOwnProperty(data_key) === false) {
										obj_raw_data[data_key] = [];
									}
									obj_raw_data[data_key].push(objRequestCore['raw_data'][k]);
								} catch (e) {
									console.error('Exception', 'sync_contact', 'rawdata_process', objRequestCore['raw_data'][k], e.stack);
								}
							}
							console.error('DBG', 'raw_data', obj_raw_data);
						}

						for (let i in dbItems) {
							exist_contact.push(dbItems[i]._doc['mobileno']);
						}
						for (let j in objRequestCore['contactlist'])
						{
							try {
								let objContacts = {};
								let is_valid_mobile = false;
								let mobileno = objRequestCore['contactlist'][j]['mobileno'].toString().replace(/\D/g,'');
								if(mobileno.length === 10 || (mobileno.length === 12 && mobileno.indexOf('91') === 0) || (mobileno.length === 13 && mobileno.indexOf('091') === 0)){
									mobileno = mobileno.substr(mobileno.length - 10);
									var mobilepattern = new RegExp('^[6-9]{1}[0-9]{9}$');
									if(mobilepattern.test(mobileno) === true){
										is_valid_mobile = true;
									}									
								}
								
								
								if(is_valid_mobile === false){
									continue;
								}
								
								
								let name = objRequestCore['contactlist'][j]['name'].toString();
								let data_key_2 = name + '-' + mobileno;
								data_key_2 = data_key_2.replace(/ /g, '_');
								console.error('DBG', 'raw_data_2', data_key_2);
								if (obj_raw_data.hasOwnProperty(data_key_2)) {
									objContacts['raw_data'] = obj_raw_data[data_key_2];
								}
								if (exist_contact.indexOf(mobileno) > -1)
								{
									objContacts['name'] = name;
									objContacts['Modified_On'] = new Date();
									let myquery = {mobileno: mobileno, ss_id: ssid};
									let newvalues = {$set: objContacts};
									Sync_Contact.update(myquery, newvalues, {multi: false}, function (err, numAffected) {
										if (err)
										{
											console.error('Exception', 'Contact_Sync_Save_Err', err);
										}
									});
								} else
								{
									objContacts['mobileno'] = mobileno;
									objContacts['name'] = name;
									objContacts['ss_id'] = ssid;
									objContacts['fba_id'] = fbaid;
									objContacts['sub_fba_id'] = sub_fba_id;
									objContacts['channel'] = req.agent['channel'];
									objContacts['Created_On'] = new Date();
									objContacts['Modified_On'] = new Date();
									objContacts['Short_Code'] = randomString(10);
									arrContact.push(objContacts);
								}
							} catch (e) {
								console.error('Exception', 'sync_contact', 'data_process_loop', e.stack);
							}
						}
						if (arrContact.length > 0)
						{
							Sync_Contact.insertMany(arrContact, function (Err_DbSync_Contact, DbSync_Contact) {
								if (Err_DbSync_Contact) {
									syncPospSummary.Message = Err_DbSync_Contact;
									syncPospSummary.Status = 'Error';
									syncPospSummary.StatusNo = 1;
									res.json(syncPospSummary);
								} else {
									syncPospSummary.Message = 'Contact Added Successfully.';
									syncPospSummary.Status = 'success';
									syncPospSummary.StatusNo = 0;
									res.json(syncPospSummary);
								}
							});
							/*
							sync_contacts.insertMany(arrContact, function (err3, data) {
								if (err3) {
									syncPospSummary.Message = err3;
									syncPospSummary.Status = 'Error';
									syncPospSummary.StatusNo = 1;
									res.json(syncPospSummary);
								} else {
									syncPospSummary.Message = 'Contact Added Successfully.';
									syncPospSummary.Status = 'success';
									syncPospSummary.StatusNo = 0;
									res.json(syncPospSummary);
								}
								db.close();
							});
							*/
						} else
						{
							syncPospSummary.Message = 'Contact Added Successfully.';
							syncPospSummary.Status = 'success';
							syncPospSummary.StatusNo = 0;
							res.json(syncPospSummary);
						}
						//console.log(arrContact);
					}
				}
				catch(e){
					syncPospSummary.Message = e.stack;
					syncPospSummary.Status = 'Error';
					syncPospSummary.StatusNo = 1;
					fs.appendFile(appRoot + "/tmp/log/contact_err_" + today_str + ".log", JSON.stringify(syncPospSummary) + "\r\n", function (err) {
						
					});
					res.json(syncPospSummary);					
				}
			});
        } else
        {
            syncPospSummary.Message = 'Ss_Id not exist.Kindly contact tech support.';
            syncPospSummary.Status = 'Error';
            syncPospSummary.StatusNo = 1;
			fs.appendFile(appRoot + "/tmp/log/contact_err_" + today_str + ".log", JSON.stringify(syncPospSummary) + "\r\n", function (err) {
				
			});
            res.json(syncPospSummary);
        }
    });
	/*
	app.get('/sync_contacts/sync_email', function (req, res) {
        try {
            let limit = (req.query.hasOwnProperty('limit')) ? req.query['limit'] - 0 : 10;
            Sync_Contact.find({}).sort({'Created_On':-1}).limit(limit).exec(function (err, emp_data) {
                try {                    
					for (let i in emp_data) {
						let d_id = emp_data[i]._doc['_id'];
						objContacts['raw_data'] = obj_raw_data[data_key_2];
						let email = '';
						try{
							if(objContacts['raw_data'] && objContacts['raw_data'].length > 0 && objContacts['raw_data'][0]['emails'].length > 0){
								email = objContacts['raw_data'][0]['emails'][0]['address'];
							}
						}
						catch(e){
							
						}
						objContacts['Email'] = email || '';
						if (req.query['op'] === 'execute') {
							Sync_Contact.update({'_id': d_id}, {$set: {'Short_Code': randomString(10)}}, {multi: false}, function (err, numAffected) {
								if (err)
								{
									//console.error('Exception', 'Contact_Sync_Save_Err', err);
								}
							});
						}
					}                    
                    res.send('<pre>' + arr_id[0] + '===' + arr_id.length + '</pre>');
                } catch (e) {
                    res.send('<pre>' + e.stack + '</pre>');
                }
            });
        } catch (e) {
            res.send('<pre>' + e.stack + '</pre>');
        }
    });
*/	
	app.post('/sync_contacts/contact_entry', agent_details_pre, function (req, res) {
        var objRequestCore = req.body;
        // console.log("POST :: objRequestCore :: ", objRequestCore);
        var fbaid = objRequestCore['fbaid'] - 0;
        var ssid = objRequestCore['ssid'] - 0;
		var sub_fba_id = objRequestCore['sub_fba_id'] || 0;
		sub_fba_id = sub_fba_id -0;
        var syncPospSummary = {
            'Message': '',
            'Status': '',
            'StatusNo': 0
        };
        var mobile_list = [];
        var arrContact = [];
        var exist_contact = [];
        var today = moment().utcOffset("+05:30");
        var today_str = moment(today).format("YYYYMMD");
        var objRequest = {
            'dt': today.toLocaleString(),
            'resp': req.body
        };
		var Telecom_Circle_Master = fs.readFileSync(appRoot + "/tmp/cachemaster/telecom_circle_master.log").toString();
		Telecom_Circle_Master = JSON.parse(Telecom_Circle_Master);
        fs.appendFile(appRoot + "/tmp/log/contact_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        if (ssid > 0 && ssid !== 5)
        {
            for (let j in objRequestCore['contactlist'])
            {
				let is_valid_mobile = false;
				let mobileno = objRequestCore['contactlist'][j]['mobileno'].toString().replace(/\D/g,'');
				if(mobileno.length === 10 || (mobileno.length === 12 && mobileno.indexOf('91') === 0) || (mobileno.length === 13 && mobileno.indexOf('091') === 0) ){
					mobileno = mobileno.substr(mobileno.length - 10);
					var mobilepattern = new RegExp('^[6-9]{1}[0-9]{9}$');
					if(mobilepattern.test(mobileno) === true){
						is_valid_mobile = true;
					}									
				}
				
				
				if(is_valid_mobile === true){
					mobile_list.push(mobileno);
				}
                
            }
            var cond = {
                "mobileno": {
                    "$in": mobile_list
                },
                'ss_id': ssid
            };
            //console.log(cond);
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err1, db) {
                var sync_contacts = db.collection('sync_contacts');
                sync_contacts.find(cond).toArray(function (err2, dbItems) {
                    //exist_contact = dbItems;
                    if (err2) {
                        syncPospSummary.Message = err2;
                        syncPospSummary.Status = 'Error';
                        syncPospSummary.StatusNo = 1;
                        res.json(syncPospSummary);
                    } else {
                        let obj_raw_data = {};
                        if (objRequestCore.hasOwnProperty('raw_data') && objRequestCore['raw_data'] && objRequestCore['raw_data'] !== null && objRequestCore['raw_data'] !== '') {
                            objRequestCore['raw_data'] = JSON.parse(objRequestCore['raw_data']);
                            for (let k in objRequestCore['raw_data']) {
                                try {
									let raw_mobile = '';
									if(objRequestCore['raw_data'][k].hasOwnProperty('phoneNumbers')){
										raw_mobile = objRequestCore['raw_data'][k]['phoneNumbers'][0]['normalizedNumber'].replace('+91', '');
									}
									if(objRequestCore['raw_data'][k].hasOwnProperty('phoneNo')){
										raw_mobile = objRequestCore['raw_data'][k]['phoneNo'][0].replace('+91', '');
									}
                                    let data_key = objRequestCore['raw_data'][k]['displayName'] + '-' + raw_mobile;
                                    data_key = data_key.replace(/ /g, '_');
                                    if (obj_raw_data.hasOwnProperty(data_key) === false) {
                                        obj_raw_data[data_key] = [];
                                    }
                                    obj_raw_data[data_key].push(objRequestCore['raw_data'][k]);
                                } catch (e) {
                                    console.error('Exception', 'sync_contact', 'rawdata_process', objRequestCore['raw_data'][k], e.stack);
                                }
                            }
                            console.error('DBG', 'raw_data', obj_raw_data);
                        }

                        for (let i in dbItems) {
                            exist_contact.push(dbItems[i]['mobileno']);
                        }
                        for (let j in objRequestCore['contactlist'])
                        {
                            try {
                                let objContacts = {};
								
                                let is_valid_mobile = false;
								let mobileno = objRequestCore['contactlist'][j]['mobileno'].toString().replace(/\D/g,'');
								if(mobileno.length === 10 || (mobileno.length === 12 && mobileno.indexOf('91') === 0) || (mobileno.length === 13 && mobileno.indexOf('091') === 0) ){
									mobileno = mobileno.substr(mobileno.length - 10);
									var mobilepattern = new RegExp('^[6-9]{1}[0-9]{9}$');
									if(mobilepattern.test(mobileno) === true){
										is_valid_mobile = true;
									}									
								}
								
								
								if(is_valid_mobile === false){
									continue;
								}
								
								let name = objRequestCore['contactlist'][j]['name'].toString();
                                let data_key_2 = name + '-' + mobileno;
                                data_key_2 = data_key_2.replace(/ /g, '_');
                                console.error('DBG', 'raw_data_2', data_key_2);
                                if (obj_raw_data.hasOwnProperty(data_key_2)) {
                                    objContacts['raw_data'] = obj_raw_data[data_key_2];
									objContacts['Is_Raw_Data_Available'] = 1;
									objContacts = RawData_Process_ver2(objContacts,mobileno);									
                                }
								
                                if (exist_contact.indexOf(objRequestCore['contactlist'][j]['mobileno']) > -1)
                                {
                                    
									objContacts['name'] = name;
                                    //objContacts['Modified_On'] = new Date();
                                    let myquery = {mobileno: mobileno, ss_id: ssid};									
                                    let newvalues = {$set: objContacts};
                                    Sync_Contact.update(myquery, newvalues, {multi: false}, function (err, numAffected) {
                                        if (err)
                                        {
                                            console.error('Exception', 'Contact_Sync_Save_Err', err);
                                        }
                                    });
									
                                } else
                                {
									
									let mobile_series = mobileno.substring(0, 4);
									objContacts['Telecom_Circle'] = "";
									if(Telecom_Circle_Master[mobile_series]){
										objContacts['Telecom_Circle'] = Telecom_Circle_Master[mobile_series]["Telecom_Circle"];
									}									
                                    objContacts['mobileno'] = mobileno;
                                    objContacts['name'] = name;
                                    objContacts['ss_id'] = ssid;
                                    objContacts['fba_id'] = fbaid;
									objContacts['sub_fba_id'] = sub_fba_id;
                                    objContacts['channel'] = req.agent['channel'];
                                    objContacts['Created_On'] = new Date();
                                    objContacts['Modified_On'] = new Date();
                                    objContacts['Short_Code'] = randomString(10);
                                    arrContact.push(objContacts);
                                }
                            } catch (e) {
                                console.error('Exception', 'sync_contact', 'data_process_loop', e.stack);
                            }
                        }
                        if (arrContact.length > 0)
                        {
                            sync_contacts.insertMany(arrContact, function (err3, data) {
                                if (err3) {
                                    syncPospSummary.Message = err3;
                                    syncPospSummary.Status = 'Error';
                                    syncPospSummary.StatusNo = 1;
                                    res.json(syncPospSummary);
                                } else {
                                    syncPospSummary.Message = 'Contact Added Successfully.';
                                    syncPospSummary.Status = 'success';
                                    syncPospSummary.StatusNo = 0;
                                    res.json(syncPospSummary);
                                }
                                db.close();
                            });
                        } else
                        {
                            syncPospSummary.Message = 'Contact Added Successfully.';
                            syncPospSummary.Status = 'success';
                            syncPospSummary.StatusNo = 0;
                            res.json(syncPospSummary);
                        }
                        //console.log(arrContact);
                    }
                });
            });
        } else
        {
            syncPospSummary.Message = 'Ss_Id not exist.Kindly contact tech support.';
            syncPospSummary.Status = 'Error';
            syncPospSummary.StatusNo = 1;
            res.json(syncPospSummary);
        }
    });
	function RawData_Process(objContacts,mobileno){
		let email = '';
		let work_email = '';
		let Company_Name = '';
		let Company_Title = '';
		let Family_Name = "";
		let Given_Name = "";
		let City = "";
		let Region = "";
		let Work_City = "";
		let Work_Region = "";
		let arr_mobile = [];
		console.error("Log","RawData_Process",mobileno,objContacts['raw_data']);
		try{
			if(objContacts['raw_data'] && objContacts['raw_data'].length > 0 && objContacts['raw_data'][0]){
				let contact_raw_single = objContacts['raw_data'][0];
				if(contact_raw_single['emails'] && contact_raw_single['emails'].length > 0){
					if(contact_raw_single['emails'][0]){
						if(contact_raw_single['emails'][0]['type'] == "HOME"){
							email = contact_raw_single['emails'][0]['address'] || ""; 
						}
						if(contact_raw_single['emails'][0]['type'] == "WORK"){
							work_email = contact_raw_single['emails'][0]['address'] || ""; 
						}
					}
					if(contact_raw_single['emails'][1]){
						if(email == '' && contact_raw_single['emails'][1]['type'] == "HOME"){
							email = contact_raw_single['emails'][1]['address'] || ""; 
						}
						if(work_email == '' && contact_raw_single['emails'][1]['type'] == "WORK"){
							work_email = contact_raw_single['emails'][1]['address'] || ""; 
						}
					}
				}
				if(contact_raw_single['emiailId'] && contact_raw_single['emiailId'].length > 0){
					email = contact_raw_single['emiailId'][0] || "";					
				}
				if(contact_raw_single['addresses'] && contact_raw_single['addresses'].length > 0){
					if(contact_raw_single['addresses'][0]){
						if(contact_raw_single['addresses'][0]['type'] == "HOME"){	
							City = contact_raw_single['addresses'][0]['city'] || "";
							Region = contact_raw_single['addresses'][0]['region'] || "";
						}
						if(contact_raw_single['addresses'][0]['type'] == "WORK"){	
							Work_City = contact_raw_single['addresses'][0]['city'] || "";
							Work_Region = contact_raw_single['addresses'][0]['region'] || "";
						}	
					}
					if(contact_raw_single['addresses'][1]){
						if(contact_raw_single['addresses'][1]['type'] == "HOME"){	
							City = contact_raw_single['addresses'][1]['city'] || "";
							Region = contact_raw_single['addresses'][1]['region'] || "";
						}
						if(contact_raw_single['addresses'][1]['type'] == "WORK"){	
							Work_City = contact_raw_single['addresses'][1]['city'] || "";
							Work_Region = contact_raw_single['addresses'][1]['region'] || "";
						}	
					}	
				}
				
				if(contact_raw_single['phoneNumbers'] && contact_raw_single['phoneNumbers'].length > 0){
					for(let k in contact_raw_single['phoneNumbers']){
						let mobileno_additional = contact_raw_single['phoneNumbers'][k]["normalizedNumber"].toString().replace(/\D/g,'');
						if(mobileno_additional.indexOf(mobileno) === -1){
							let is_valid_mobile = false;
							if(mobileno_additional.length === 10 || (mobileno_additional.length === 12 && mobileno_additional.indexOf('91') === 0) || (mobileno_additional.length === 13 && mobileno_additional.indexOf('091') === 0) ){
								mobileno_additional = mobileno_additional.substr(mobileno_additional.length - 10);
								var mobilepattern = new RegExp('^[6-9]{1}[0-9]{9}$');
								if(mobilepattern.test(mobileno_additional) === true){
									is_valid_mobile = true;
								}									
							}
							if(is_valid_mobile === true){
								arr_mobile.push(mobileno_additional);
							}
						}
					}	
				}
				if(contact_raw_single['phoneNo'] && contact_raw_single['phoneNo'].length > 0){
					for(let k in contact_raw_single['phoneNo']){
						let mobileno_additional = contact_raw_single['phoneNo'][k].toString().replace(/\D/g,'');
						if(mobileno_additional.indexOf(mobileno) === -1){
							let is_valid_mobile = false;
							if(mobileno_additional.length === 10 || (mobileno_additional.length === 12 && mobileno_additional.indexOf('91') === 0) || (mobileno_additional.length === 13 && mobileno_additional.indexOf('091') === 0) ){
								mobileno_additional = mobileno_additional.substr(mobileno_additional.length - 10);
								var mobilepattern = new RegExp('^[6-9]{1}[0-9]{9}$');
								if(mobilepattern.test(mobileno_additional) === true){
									is_valid_mobile = true;
								}									
							}
							if(is_valid_mobile === true){
								arr_mobile.push(mobileno_additional);
							}
						}
					}	
				}
				Company_Name = contact_raw_single['companyName'] || "";
				Company_Title = contact_raw_single['companyTitle'] || "";
				Family_Name = contact_raw_single['familyName'] || "";
				Given_Name = contact_raw_single['givenName'] || "";										
			}
		}
		catch(e){
			objContacts['Err_Raw_Data'] = e.stack;
			console.error("Exception","Err_Raw_Data",mobileno,objContacts['raw_data'],e.stack);
		}
		if(arr_mobile.length > 0){
			for(let s in arr_mobile){
				let inc = s - 0 + 2;
				objContacts['Mobile_'+inc] = arr_mobile[s].toString();
			}	
		}
		
		objContacts['Email'] = email;
		objContacts['Work_Email'] = work_email;
		objContacts['Company_Name'] = Company_Name;
		objContacts['Company_Title'] = Company_Title;
		objContacts['Family_Name'] = Family_Name;
		objContacts['Given_Name'] = Given_Name;
			
		objContacts['City'] = City;
		objContacts['Region'] = Region;		
		objContacts['Work_City'] = Work_City;
		objContacts['Work_Region'] = Work_Region;
		objContacts['Is_Raw_Data_Process'] = 1;
		console.error("Log","RawData_Process",mobileno, objContacts);
		return objContacts;		
	}
	function RawData_Process_ver2(objContacts,mobileno){
		let arr_mobile = [];
		let obj_raw_exception = {};
		console.error("Log","RawData_Process",mobileno,objContacts['raw_data']);
		
		if(objContacts['raw_data'] && objContacts['raw_data'].length > 0 && objContacts['raw_data'][0]){
			let contact_raw_single = objContacts['raw_data'][0];
			try{
				if(contact_raw_single['emails'] && contact_raw_single['emails'].length > 0){
					for(let email_single of contact_raw_single['emails']){
						if(email_single['type'] == "HOME"){
							objContacts['Email'] = email_single['address'] || "";
						}
						if(email_single['type'] == "WORK"){
							objContacts['Work_Email'] = email_single['address'] || "";
						}
						if(email_single['type'] == "OTHER"){
							objContacts['Other_Email'] = email_single['address'] || "";
						}						
					}	
				}
			}
			catch(e1){
				obj_raw_exception["emails"]  = e1.stack;
			}
			
			try{
				if(contact_raw_single['addresses'] && contact_raw_single['addresses'].length > 0){
					for(let address_single of contact_raw_single['addresses']){
						if(address_single['type'] == "HOME"){
							objContacts['Region'] = address_single['region'] || "";
							objContacts['City'] = address_single['city'] || "";
							objContacts['Address'] = address_single['formattedAddress'] || "";
						}
						if(address_single['type'] == "WORK"){
							objContacts['Work_Region'] = address_single['region'] || "";
							objContacts['Work_City'] = address_single['city'] || "";
							objContacts['Work_Address'] = address_single['formattedAddress'] || "";
						}
					}	
				}
			}
			catch(e1){
				obj_raw_exception["addresses"]  = e1.stack;
			}	
			
			try{
				if(contact_raw_single['events'] && contact_raw_single['events'].length > 0){
					for(let event_single of contact_raw_single['events']){
						if(event_single['type'] == "BIRTHDAY"){
							objContacts['Birthday_Date'] = event_single['startDate'] || "";
						}
						if(event_single['type'] == "ANNIVERSARY"){
							objContacts['Anniversary_Date'] = event_single['startDate'] || "";							
						}
					}	
				}
			}
			catch(e1){
				obj_raw_exception["events"]  = e1.stack;
			}	
			
			try{
				if(contact_raw_single['relations'] && contact_raw_single['relations'].length > 0){
					for(let relation_single of contact_raw_single['relations']){
						objContacts['Relation'] = relation_single['relationLabel'] || "";
					}	
				}
			}
			catch(e1){
				obj_raw_exception["relations"]  = e1.stack;
			}
			
			try{
				if(contact_raw_single['websites'] && contact_raw_single['websites'].length > 0){
					objContacts['Website'] = contact_raw_single['websites'].join(",");	
				}
			}
			catch(e1){
				obj_raw_exception["websites"]  = e1.stack;
			}
			
			try{
				if(contact_raw_single['phoneNumbers'] && contact_raw_single['phoneNumbers'].length > 0){
					for(let k in contact_raw_single['phoneNumbers']){
						let mobileno_additional = contact_raw_single['phoneNumbers'][k]["normalizedNumber"].toString().replace(/\D/g,'');
						mobileno_additional = mobileno_additional.substr(mobileno_additional.length - 10);
						if(mobileno_additional.indexOf(mobileno) === -1 && arr_mobile.indexOf(mobileno_additional) === -1){
							let is_valid_mobile = false;
							if(mobileno_additional.length === 10 || (mobileno_additional.length === 12 && mobileno_additional.indexOf('91') === 0) || (mobileno_additional.length === 13 && mobileno_additional.indexOf('091') === 0) ){
								var mobilepattern = new RegExp('^[6-9]{1}[0-9]{9}$');
								if(mobilepattern.test(mobileno_additional) === true){
									is_valid_mobile = true;
								}									
							}
							if(is_valid_mobile === true){
								arr_mobile.push(mobileno_additional);
							}
						}
					}	
				}
			}
			catch(e1){
				obj_raw_exception["phoneNumbers"]  = e1.stack;
			}	
			
			objContacts['Company_Name'] = contact_raw_single['companyName'] || "";
			objContacts['Company_Title'] = contact_raw_single['companyTitle'] || "";
			objContacts['Family_Name'] = contact_raw_single['familyName'] || "";
			objContacts['Middle_Name'] = contact_raw_single['middleName'] || "";
			objContacts['Given_Name'] = contact_raw_single['givenName'] || "";
			objContacts['Nick_Name'] = contact_raw_single['nickname'] || "";
			objContacts['Note'] = contact_raw_single['note'] || "";
			
			if(arr_mobile.length > 0){
				for(let s in arr_mobile){
					let inc = s - 0 + 2;
					objContacts['Mobile_'+inc] = arr_mobile[s].toString();
				}	
			}				
		}
		
		if(Object.keys(obj_raw_exception).length > 0){
			objContacts['Err_Raw_Data'] = obj_raw_exception;
			console.error("Log","RawData_Process","Exception",mobileno, obj_raw_exception);
		}		
		objContacts['Is_Raw_Data_Process'] = 1;
		for(let k in objContacts){
			if(objContacts[k] === ""){
				delete objContacts[k];
			}
		}
		console.error("Log","RawData_Process",mobileno, objContacts);
		return objContacts;		
	}
    app.get('/call_data',function (req,res){
       var Sync_Contact_Call_History = require('../models/sync_contact_call_history');
       Sync_Contact_Call_History.find({$expr: {$or:[{$eq: [{$dayOfWeek: "$callDate"},0]},{$eq: [{$dayOfWeek: "$callDate"},6]}]}}).exec(function (err, dbSyncs){
         res.send(dbSyncs);
       });
    });
	app.get('/sync_contacts/telecom_circle/cache_create',function (req,res){
       var Telecom_Circle = require('../models/telecom_circle');
       Telecom_Circle.find({"Telecom_Circle_Code":{"$ne":""}}).exec(function (err, dbTelecom_Circle){
		   let obj_Telecom_Circle ={};
		   for(let k in dbTelecom_Circle){
			   obj_Telecom_Circle[dbTelecom_Circle[k]._doc['Series']] = dbTelecom_Circle[k]._doc;
		   }
         res.json(obj_Telecom_Circle);
       });
    });
	app.get('/sync_contacts/telecom_circle/sync',function (req,res){
       var Telecom_Circle = require('../models/telecom_circle');
       Telecom_Circle.find({"Telecom_Circle_Code":{"$ne":""}}).exec(function (err, dbTelecom_Circle){
		   let obj_Telecom_Circle ={};
		   for(let k in dbTelecom_Circle){
			   let series = dbTelecom_Circle[k]._doc['Series'];
			   if (req.query['op'] === 'execute') {
					Sync_Contact.update({'ss_id': ss_id, 'mobileno': mobileno.toString()}, {$set: obj_contact}, {multi: false}, function (err, numAffected) {
						arr_summary["complete"][k_up] = obj_contact;
						arr_summary["complete"][k_up]['db'] =  {
							'err' : err || "NA",
							"numAffected" : numAffected || "NA"
						};
						arr_summary["complete_count"]++;
						if(arr_summary["process_count"].length > 0 && arr_summary["complete_count"] == arr_summary["process_count"]){
							return res.json(arr_summary);
						}
					});
				}
		   }
         res.json(obj_Telecom_Circle);
       });
    });
	
	app.get('/sync_contacts/raw_data/process', function (req, res) {
        try {
            let limit = (req.query.hasOwnProperty('limit')) ? req.query['limit'] - 0 : 100;
			let qry_mobileno = req.query['mobileno'] || '';
			let cond_sync = {
				"Email":"",
				"raw_data":{$exists:true},
				"Is_Raw_Data_Process":{$exists:false}
			};
			if(qry_mobileno !== ''){
				cond_sync = { 
					"mobileno":qry_mobileno,
					"raw_data" : {'$exists': true}
				};				
			}
            Sync_Contact.find(cond_sync).limit(limit).exec(function (err, db_sync_data) {
                try {
					let arr_summary = {
						"db_count" : db_sync_data.length,
						"process" : {},
						"process_count" : 0,
						"complete" : {},
						"complete_count" : 0
					};
                    if (db_sync_data.length > 0) {						
                        for (let i in db_sync_data) {
							let raw_data = db_sync_data[i]._doc['raw_data'];
							let ss_id = db_sync_data[i]._doc['ss_id'] -0;
							let mobileno = db_sync_data[i]._doc['mobileno'];
							let s_id = db_sync_data[i]._doc['_id'];
							
							let obj_contact = {
								'raw_data' : raw_data,
							};
							obj_contact = RawData_Process_ver2(obj_contact,mobileno);
							delete obj_contact["raw_data"];
							let k_up = ss_id+"_" +mobileno;
							arr_summary["process"][k_up] = obj_contact;
							
							arr_summary["process_count"]++;
							if (req.query['op'] === 'execute') {
								Sync_Contact.update({'ss_id': ss_id, 'mobileno': mobileno.toString()}, {"$set": obj_contact}, {multi: false}, function (err, numAffected) {
									try{
										arr_summary["complete"][k_up] = obj_contact;
										arr_summary["complete"][k_up]['db'] =  {
											'err' : err || "NA",
											"numAffected" : numAffected || "NA"
										};
										arr_summary["complete_count"]++;
										if(arr_summary["complete_count"] == arr_summary["process_count"]){
											return res.json(arr_summary);
										}
									}
									catch(e){
										return res.send(e.stack);	
									}
								});
							}							
						}						
					}
					if (req.query['op'] === 'dbg') {
						return res.json(arr_summary);
					}
				}
				catch(e)
				{
					res.send(e.stack);					
				}
			});
		}
		catch(e)
		{
			res.send(e.stack);
		}
	});
	
    app.get('/sync_contacts/sc_pr', function (req, res) {
        try {
            let limit = (req.query.hasOwnProperty('limit')) ? req.query['limit'] - 0 : 10;
            Sync_Contact.find({'Short_Code': {'$exists': false}}).limit(limit).exec(function (err, emp_data) {
                try {
                    let arr_id = [];
                    if (emp_data.length > 0) {
                        for (let i in emp_data) {
                            let d_id = emp_data[i]._doc['_id'];
                            arr_id.push(d_id);
                            if (req.query['op'] === 'execute') {
                                Sync_Contact.update({'_id': d_id}, {$set: {'Short_Code': randomString(10)}}, {multi: false}, function (err, numAffected) {
                                    if (err)
                                    {
                                        //console.error('Exception', 'Contact_Sync_Save_Err', err);
                                    }
                                });
                            }
                        }
                    }
                    res.send('<pre>' + arr_id[0] + '===' + arr_id.length + '</pre>');
                } catch (e) {
                    res.send('<pre>' + e.stack + '</pre>');
                }
            });
        } catch (e) {
            res.send('<pre>' + e.stack + '</pre>');
        }
    });
	app.get('/sync_contacts/get_agent_list', function (req, res) {
        try {
            let mobileno = (req.query.hasOwnProperty('mobileno')) ? req.query['mobileno'].toString()  : '';
			let sync_agent_city = (req.query.hasOwnProperty('sync_agent_city')) ? req.query['sync_agent_city'].toString()  : '';
			let obj_agent_final = {'data' : []};
			if(mobileno != ''){
				let Sync_Contact_Summary = require('../models/sync_contact_summary');
				//let cond_Sync_Contact_Summary = {'Type':{"$in":['POSP','FOS']}};
				let cond_Sync_Contact_Summary = {};
				if(sync_agent_city !== ''){
					cond_Sync_Contact_Summary['City'] = sync_agent_city;
				}
				obj_agent_final['cond_Sync_Contact_Summary'] = cond_Sync_Contact_Summary;
				Sync_Contact_Summary.distinct('ss_id', cond_Sync_Contact_Summary).exec(function (err, arr_Synced_Agent_ssid) {
					obj_agent_final['cond_Sync_Contact_Summary_length'] = arr_Synced_Agent_ssid.length;
					arr_Synced_Agent_ssid = arr_Synced_Agent_ssid || [];
					arr_Synced_Agent_ssid = arr_Synced_Agent_ssid.map(Number);
					let cond_Sync_Contact = {
						'ss_id' : { "$in" : arr_Synced_Agent_ssid},
						'mobileno': mobileno
					};
					obj_agent_final['cond_Sync_Contact'] = cond_Sync_Contact;
					Sync_Contact.find(cond_Sync_Contact).sort({'Created_On':-1}).exec(function (err, db_Sync_Contacts) {
						try {
							obj_agent_final['cond_Sync_Contact_length'] = db_Sync_Contacts.length;
							let Agent = require('../models/agent');
							let arr_ss_id = [];
							for (let k in db_Sync_Contacts) {							
								arr_ss_id.push(db_Sync_Contacts[k]._doc['ss_id'] -0);
							}
							//let cond_agent = {"Ss_Id": {$in: arr_ss_id},'Type':{$in:['POSP','FOS']}};
							let cond_agent = {"Ss_Id": {$in: arr_ss_id}};
							if(sync_agent_city !== ''){
								cond_agent['City'] = sync_agent_city;
							}
							obj_agent_final['cond_agent'] = cond_agent;
							Agent.find(cond_agent).exec(function (err, dbAgents) {
								obj_agent_final['cond_agent_length'] = dbAgents.length;
								let obj_agent_list = {};								
								if (dbAgents) {
									for (let k in dbAgents) {
										obj_agent_list[dbAgents[k]._doc['Ss_Id'].toString()] = dbAgents[k]._doc;
									}
								}
								for (let k in db_Sync_Contacts) {
									let ss_id = db_Sync_Contacts[k]._doc['ss_id'].toString();
									let ind_agent=  {
										'Contact_Saved_As' : db_Sync_Contacts[k]._doc['name'] || 'NA',
										'City' : 'NA',
										'Type' : 'NA',
										'Ss_Id' : ss_id,
										'Erp_Id' : 'NA',
										'Synced_On' : db_Sync_Contacts[k]._doc['Created_On'].toLocaleString(),
										'Agent_Name' : 'NA',
										'Channel' : 'NA',
										'RM' : 'NA',										
										'RM_Plus_One' : 'NA'
									};
									
									if(obj_agent_list.hasOwnProperty(ss_id) === true){
										ind_agent['Agent_Name'] = obj_agent_list[ss_id]['Name'];
										ind_agent['Erp_Id'] = obj_agent_list[ss_id]['Erp_Id'] || 'NA';
										ind_agent['Channel'] = obj_agent_list[ss_id]['Channel'];
										ind_agent['RM'] = obj_agent_list[ss_id]['RM_Name'] + '::UID-' + obj_agent_list[ss_id]['RM_UID']+'::BRANCH' + obj_agent_list[ss_id]['RM_Branch'];
										ind_agent['City'] = obj_agent_list[ss_id]['City'];
										ind_agent['Type'] = obj_agent_list[ss_id]['Type'];										
										ind_agent['RM_Plus_One'] = obj_agent_list[ss_id]['RM_Reporting_Name'] + '::UID-' + obj_agent_list[ss_id]['RM_Reporting_UID']+'::BRANCH' + obj_agent_list[ss_id]['RM_Reporting_Branch'];	
									}
									obj_agent_final['data'].push(ind_agent);
									
								}
								res.json(obj_agent_final);
							});
						} catch (e) {
							res.send('<pre>' + e.stack + '</pre>');
						}
					});
				});
			}
			else{
				res.send('<pre>invalid mobileno</pre>');
			}
        } catch (e) {
            res.send('<pre>' + e.stack + '</pre>');
        }
    });
    app.get('/sync_contacts/erp_sync_contact', function (req, res) {
        try {
            //var arg = {$where: "this._id.getTimestamp() >= ISODate('2017-02-25')"};
            //var limit = req.params['limit'] -0;
            var limit = 100;
            let successCount = 0;
            let failCount = 0;
            let emp_json_data = {};
            var objRequestCore = req.body;
            if (req.query.hasOwnProperty('limit') && req.query['limit'] - 0 > 0) {
                limit = req.query['limit'] - 0;
            }
            var range = (req.query.hasOwnProperty('range') && req.query['range'] !== '') ? req.query['range'] : 'daterange';
            var ss_id = (req.query.hasOwnProperty('ss_id') && req.query['ss_id'] !== '') ? (req.query['ss_id'] - 0) : 0;
            var batch = (req.query.hasOwnProperty('batch') && req.query['batch'] !== '') ? (req.query['batch'] - 0) : 20;
            var sync_con = {
                'ss_id': {$ne: 0},
                'sync_date': {$exists: false}
                //'channel': {$ne: 'PBS'}
            };
            if (ss_id > 0) {
                sync_con['ss_id'] = ss_id;
            }

            if (range === 'daterange') {
                var start_date = new Date();
                start_date.setDate(start_date.getDate() - 2);
                start_date.setHours(00, 00, 00, 000);
                var end_date = new Date();
                end_date.setDate(end_date.getDate() + 0);
                end_date.setHours(00, 00, 00, 000);
                var today = moment().utcOffset("+05:30").startOf('Day');
                var from_date = moment(today).format("YYYY-MM-D");
                var to_date = moment(today).format("YYYY-MM-D");
                sync_con['Created_On'] = {$gte: start_date, $lte: end_date};
            }
            Sync_Contact.find(sync_con).limit(limit).exec(function (err, emp_data) {
let url_arr = [];
                try {
                    if (err)
                    {
                        res.json({Msg: 'Error', Error_Msg: err});
                    } else
                    {
                        console.log('emp_data : ' + emp_data);
                        if (emp_data.length > 0) {
                            var Client = require('node-rest-client').Client;
                            var client = new Client();
                            for (let i in emp_data) {
                                let emp_data_val = emp_data[i]._doc;
								let filter_mobile = emp_data_val['mobileno'].replace(/\D/g,'');								
								if(filter_mobile.length === 10){
                                	if (emp_json_data.hasOwnProperty(emp_data_val['ss_id']))
                                	{
                                    		emp_json_data[emp_data_val['ss_id']] = emp_json_data[emp_data_val['ss_id']] + ',' + filter_mobile;
                                	} else
                                	{
                                    		emp_json_data[emp_data_val['ss_id']] = filter_mobile;
                                	}
								}
                            }
                            let objCallSummary = {
                                'main': {
                                    'total_job': 0,
                                    'done_job': 0,
                                    'success_job_cnt': 0,
                                    'nodetail_job_cnt': 0,
                                    'fail_job_cnt': 0,
                                    'mobile_received_cnt': 0,
                                    'mobile_not_received_cnt': 0,
                                    'mobile_data_cnt': 0,
                                    'total_contact': emp_data.length,
                                },
                                'success_job': [],
                                'fail_job': [],
                                'nodetail_job': []
                            };
 
                            for (let k in emp_json_data)
                            {
                                let ss_id_mobile = emp_json_data[k].split(',');
                                let ss_id = k;
                                let newArray = new Array(Math.ceil(ss_id_mobile.length / batch)).fill().map((_, i) => ss_id_mobile.slice(i * batch, i * batch + batch));
                                //let newArray = new Array(Math.ceil(ss_id_mobile.length / 10)).fill().map((_, i) => ss_id_mobile.slice(i * 10, i * 10 + 10));
                                objCallSummary.main.total_job += newArray.length;
				
                                for (let arrayData of newArray) {
                                    let arr_calling_data = arrayData.join(',');
                                    let url_api = config.environment.weburl + '/sync_contacts/emp_data?mobile=' + arr_calling_data + '&ss_id=' + ss_id;
					url_arr.push(url_api);	
                                    client.get(url_api, function (data, response) {
                                        objCallSummary.main.done_job++;
                                        try {
                                            if (data && data.hasOwnProperty('Summary')) {
                                                data.Summary.url = url_api;
                                                data.Summary.status = data.Msg;
                                                if (data.Msg === 'Success')
                                                {
                                                    objCallSummary.success_job.push(data.Summary);
                                                    objCallSummary.main.mobile_received_cnt += data.Summary.mobile_received;
                                                    objCallSummary.main.mobile_data_cnt += data.Summary.total_data;
                                                } else if (data.Msg === 'NoDetails')
                                                {
                                                    objCallSummary.main.mobile_not_received_cnt += data.Summary.mobile_not_received;
                                                    objCallSummary.nodetail_job.push(data.Summary);
                                                } else
                                                {
                                                    objCallSummary.fail_job.push(data.Summary);
                                                }
                                            } else {
                                                var SummaryErr = {
                                                    'url': url_api,
                                                    'err': data,
                                                    'status': 'api_failed'
                                                };
                                                objCallSummary.fail_job.push(SummaryErr);
                                            }
                                        } catch (e) {
                                            var SummaryErr = {
                                                'url': url_api,
                                                'err': e.stack,
                                                'status': 'api_exception'
                                            };
                                            console.error('Exception', 'post_call_error', e.stack);
                                            objCallSummary.fail_job.push(SummaryErr);
                                        }
                                        sync_contact_email(objCallSummary);
                                    });
                                }
                            }
                            res.json({'msg': 'data processed ' + emp_data.length});
                        } else {
                            res.json({'msg': 'No Data Avilable'});
                        }
                    }
                } catch (err) {
                    console.error('Exeception', 'erp_sync_contact', err.stack);
                    res.json({'Method':'erp_sync_contact','url_arr':url_arr,'msg': 'error', Error_Msg: err.stack});
                }
            });
        } catch (ex) {
            res.json(ex);
        }

    });
    app.get('/sync_contacts/emp_data', agent_details_pre, function (req, res) {
        var obj_summary = {
            'mobile_sent': 0,
            'mobile_received': 0,
            'mobile_not_received': 0,
            'total_data': 0,
            'error': ''
        };
        try {
            var objRequest = this;
            let mobileno = req.query['mobile'];
            obj_summary.mobile_sent = mobileno.split(',').length;
            var Ss_Id = req.query['ss_id'];
            var erp_id = 0;
            let mobilenoarr = mobileno.split(',');
            let emp_json_mobile = {};
            for (let i in mobilenoarr) {
                emp_json_mobile[mobilenoarr[i]] = [];
            }
            let fba_id = 0;
            if (req.hasOwnProperty('agent')) {
                if (req.agent['user_type'] === 'POSP') {
                    erp_id = req.agent['POSP']['Erp_Id'];
                    fba_id = req.agent['POSP']['Fba_Id'];
                }
                if (req.agent['user_type'] === 'FOS') {
                    erp_id = req.agent['EMP']['VendorCode'];
                    fba_id = req.agent['EMP']['FBA_ID'];
                }
                if (req.agent['user_type'] === 'EMP') {
                    erp_id = req.agent['EMP']['UID'];
                    fba_id = req.agent['EMP']['FBA_ID'];
                }
                /*if (req.agent['user_type'] === 'RBS') {
                 erp_id = req.agent['EMP']['UID'];
                 }*/
                fba_id = ((fba_id - 0) > 0) ? (fba_id - 0) : 0;
                erp_id = ((erp_id - 0) > 0) ? (erp_id - 0) : 0;
            }

            var objRequest_new = {
                "mobileno": mobileno,
                "ss_id": Ss_Id - 0
            };
            objRequest = objRequest_new;
            var url_api = 'http://lerpci.policyboss.com/RBServices.svc/getSyncData?MobileNo=' + mobileno + '&POSPID=' + erp_id + '&fbaid=' + fba_id;
            if (erp_id === 0 && fba_id === 0) {
                console.error('DBG', 'call_erp_sync', 'ss_id', Ss_Id, 'url', url_api);
            }
            //let url_api = 'http://ci.landmarkerp.com/RBServices.svc/getSyncData?MobileNo=9898147711,8860120841,8826630003,9810617900&POSPID=600501';
            //let url_api = 'http://ci.landmarkerp.com/RBServices.svc/getSyncData?MobileNo=9811556768,9800556768,9844556768,9811556768&POSPID=600501';
            var Client = require('node-rest-client').Client;
            var client = new Client();
            client.get(url_api, function (data, response) {
                try {
                    var today = moment().utcOffset("+05:30");
                    var today_str = moment(today).format("YYYYMMD");
                    let  status = '';
                    var objLog = {};
                    if (data) {
                        if (typeof data === 'string' && data.indexOf('{') > -1)
                        {
                            data = JSON.parse(data);
                        }
                        var todayDate = new Date();
                        if (data.hasOwnProperty('getSyncDataResult')) {
                            objLog = {
                                'dt': today.toLocaleString(),
                                'url': url_api,
                                'resp': data
                            };
                            fs.appendFile(appRoot + "/tmp/log/erp_fetch_" + today_str + ".log", JSON.stringify(objLog) + "\r\n", function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                            });
                            if (data['getSyncDataResult'] !== '' && data['getSyncDataResult'].length > 0)
                            {
                                status = 'Success';
                                let edata = data['getSyncDataResult'];
                                obj_summary.total_data = edata.length;
                                for (let k in edata)
                                {
                                    if (objRequest['mobileno'].indexOf(edata[k].Phone) > -1) {
                                        emp_json_mobile[edata[k].Phone].push(edata[k]);
                                    }
                                }
                            } else {
                                status = 'NoDetails';
                            }
                        } else {
                            status = 'Data_Node_Missing';
                        }
                    } else {
                        status = 'Data_Null';
                    }
                    if (status === 'Data_Null' || status === 'Data_Node_Missing') {
                        objLog = {
                            'dt': today.toLocaleString(),
                            'url': url_api,
                            'resp': status
                        };
                        fs.appendFile(appRoot + "/tmp/log/erp_fetch_err_" + today_str + ".log", JSON.stringify(objLog) + "\r\n", function (err) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                    } else {
                        var todayDate = new Date();
                        for (let insertData in emp_json_mobile)
                        {
                            try {
                                let arg = {};
                                if (emp_json_mobile[insertData].length > 0)
                                {
                                    obj_summary.mobile_received++;
                                    arg = {
                                        erp_core_response: emp_json_mobile[insertData],
                                        response_count: emp_json_mobile[insertData].length,
                                        sync_date: todayDate,
                                        'Is_Found': 1
                                    };
                                } else
                                {
                                    obj_summary.mobile_not_received++;
                                    arg = {
                                        erp_core_response: '',
                                        response_count: 0,
                                        sync_date: todayDate,
                                        'Is_Found': 0
                                    };
                                }
                                arg['Is_Synced'] = 1;
                                let myquery = {mobileno: insertData.toString(), ss_id: objRequest.ss_id - 0};
                                let newvalues = {$set: arg};
                                Sync_Contact.update(myquery, newvalues, {multi: true}, function (err, numAffected) {
                                    if (err)
                                    {
                                        console.error('Exception', 'Contact_Sync_Save', err);
                                    }
                                });
                            } catch (e) {
                                console.error('Exception', 'sync_contact_for_loop', e.stack);
                            }
                        }
                    }
                    return res.json({'Msg': status, 'Summary': obj_summary});
                } catch (ex) {
                    obj_summary.error = ex.stack;
                    console.error('Exception', 'Empdata', ex.stack)
                    return res.json({'Msg': 'Exception', 'Summary': obj_summary});
                }
            });
        } catch (errex) {
            obj_summary.error = errex.stack;
            console.error('Exception', 'Empdata', errex.stack)
            return res.json({'Msg': 'Exception', 'Summary': obj_summary});
        }
    });
    function getInsurerId(name) {
        var insurer_list = {
            "AEGON RELIGARE LIFE INSURANCE CO LTD": 25,
            "APOLLO MUNICH HEALTH INSURANCE CO LTD": 21,
            "BAJAJ ALLIANZ GENERAL INSURANCE CO LTD": 1,
            "BAJAJ ALLIANZ LIFE INSURANCE COMPANY LTD": 23,
            "BHARTI AXA GENERAL INSURANCE COMPANY LIMITED": 2,
            "BIRLA SUN LIFE INSURANCE COMPANY LIMITED": 32,
            "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LTD": 3,
            "DLF PRAMERICA LIFE INSURANCE COMPANY LTD": 22,
            "FUTURE GENERALI INDIA INSURANCE COMPANY LTD": 4,
            "HDFC ERGO GENERAL INSURANCE CO LTD": 5,
            "HDFC LIFE INSURANCE COMPANY LTD": 28,
            "ICICI LOMBARD GENERAL INSURANCE CO LTD": 6,
            "ICICI PRUDENTIAL LIFE INSURANCE COMPANY LIMITED": 39,
            "IFFCO-TOKIO GENERAL INSURANCE CO LTD": 7,
            "LIFE INSURANCE CORPORATION OF INDIA": 31,
            "MAX BUPA HEALTH INSURANCE CO LTD": 20,
            "NATIONAL INSURANCE CO LTD": 8,
            "RELIANCE GENERAL INSURANCE CO LTD": 9,
            "RELIGARE HEALTH INSURANCE COMPANY LTD": 34,
            "SBI GENERAL INSURANCE COMPANY LIMITED": 17,
            "SHRIRAM GENERAL INSURANCE COMPANY LTD": 18,
            "STAR HEALTH AND ALLIED INSURANCE COMPANY LIMITED": 26,
            "TATA AIG GENERAL INSURANCE CO LTD": 11,
            "THE NEW INDIA ASSURANCE CO LTD": 12,
            "THE ORIENTAL INSURANCE CO LTD": 13,
            "UNITED INDIA INSURANCE CO LTD": 14,
            "UNIVERSAL SOMPO GENERAL INSURANCE CO LTD": 19,
            "TATA AIA LIFE INSURANCE COMPANY LTD": 37,
            "BHARTI AXA LIFE INSURANCE CO LTD": 29,
            "MAGMA HDI GENERAL INSURANCE CO LTD": 35,
            "LIBERTY GENERAL INSURANCE LTD": 33,
            "RAHEJA QBE GENERAL INSURANCE CO LTD": 16,
            "INDIAN HEALTH ORGANISATION PVT LTD": 36,
            "CIGNA TTK HEALTH INSURANCE COMPANY LIMITED": 38,
            "KOTAK MAHINDRA GENERAL INSURANCE CO LTD": 30,
            "ROYAL SUNDARAM GENERAL INSURANCE COMPANY LIMITED": 10,
            "ADITYA BIRLA HEALTH INSURANCE COMPANY LIMITED": 42,
            "ACKO GENERAL INSURANCE LIMITED": 45,
            "GO DIGIT GENERAL INSURANCE LTD": 44,
            "DHFL GENERAL INSURANCE LIMITED": 47,
            "EDELWEISS GENERAL INSURANCE CO LTD": 46
        };
        var insurer_id = insurer_list.hasOwnProperty(name) ? insurer_list[name] : 0;
        return insurer_id;
    }
    app.get('/sync_contacts/erp_response_core_data', function (req, res, next) {
        //var Ss_Id = req.params.ss_id - 0;
        //var Fba_Id = req.params.fba_id - 0;

        var erp_sync_contact = {
            'response_count': {$gt: 0},
            'erp_core_response': {$exists: true},
            'Is_Migrate': {$exists: false}
        };
        var product_list = {
            "MOTOR": 1,
            "TWO WHEELER": 10,
            "HEALTH": 2
        };
        var erp_sync_response = {};
        var limit = (req.query.hasOwnProperty('limit')) ? req.query['limit'] - 0 : 1000;
        Sync_Contact.find(erp_sync_contact).limit(limit).exec(function (err, data) {
            if (data.length > 0) {
                for (let i in data) {
                    let erp_core_res = data[i]['_doc'];
                    let erp_core_response = erp_core_res['erp_core_response'];
                    let valid_data_count = erp_core_res.hasOwnProperty('valid_count') ? erp_core_res['valid_count'] : 0;
                    if (erp_core_response.length > 0) {
                        erp_sync_response[erp_core_res['ss_id'] + '_' + erp_core_res['fba_id'] + '_' + erp_core_res['mobileno']] = [];
                        if (req.query['op'] == 'execute') {
                            for (let j in erp_core_response) {
                                let edata_user = erp_core_response[j];
                                if (edata_user !== null) {
                                    try {
                                        let str_expiry_date = '';
										let str_expiry_month = '';
                                        let vehicle_registration_date = '';
                                        let vehicle_manf_date = '';
                                        let policyexpirydate = '';
                                        let t_date = '';
                                        let erp_qt_data;
                                        //5/27/2018 12:00:00 AM
                                        if (edata_user['RegistrationDate'] !== null && edata_user['RegistrationDate'] !== '' && edata_user['RegistrationDate'] !== "undefined")//7/19/2018 12:00:00 AM
                                        {
                                            vehicle_registration_date = edata_user['RegistrationDate'].split(' ')[0];
                                            t_date = moment(vehicle_registration_date, 'M/D/YYYY', true);
                                            if (t_date.isValid() === true) {
                                                vehicle_registration_date = moment(vehicle_registration_date, 'M/D/YYYY').format('YYYY-MM-DD');
                                            }
                                            vehicle_registration_date = (vehicle_registration_date === '1900-01-01') ? '' : vehicle_registration_date;
                                        }
                                        if (edata_user['ManufacturingDate'] !== null && edata_user['ManufacturingDate'] !== '' && edata_user['ManufacturingDate'] !== "undefined")//7/19/2018 12:00:00 AM
                                        {
                                            vehicle_manf_date = edata_user['ManufacturingDate'].split(' ')[0];
                                            t_date = moment(vehicle_manf_date, 'M/D/YYYY', true);
                                            if (t_date.isValid() === true) {
                                                vehicle_manf_date = moment(vehicle_manf_date, 'M/D/YYYY').format('YYYY-MM-DD');
                                            }
                                            vehicle_manf_date = (vehicle_manf_date === '1900-01-01') ? '' : vehicle_manf_date;
                                        }
										let yr = moment().format('YYYY') - 0;
                                        if (edata_user['ExpiryDate'] !== null && edata_user['ExpiryDate'] !== '' && edata_user['ExpiryDate'] !== "undefined")//7/19/2018 12:00:00 AM
                                        {
                                            policyexpirydate = edata_user['ExpiryDate'];
                                            t_date = moment(policyexpirydate, 'DD MMM YYYY', true);
                                            if (t_date.isValid() === true) {
                                                str_expiry_date = moment(policyexpirydate, 'DD MMM YYYY').format('YYYY-MM-DD');
												str_expiry_month = moment(policyexpirydate, 'DD MMM YYYY').format('MMM');
                                                //for year
                                                let mon = moment(str_expiry_date).format('M') - 0;
                                                let cur_mon = moment().format('M') - 0;
                                                
                                                if (mon < cur_mon) {
                                                    yr = yr+ 1;
                                                }
                                                let arr_exp = str_expiry_date.split('-');
                                                arr_exp[0] = yr;
                                                str_expiry_date = arr_exp.join('-');
                                                //for year
                                            } 
                                        }

                                        let product_id = product_list[edata_user['ProductName']];
                                        let reg_no = edata_user['RegistrationNo'];
                                        let reg_no_processed = '';
                                        reg_no = reg_no.toString().toUpperCase().trim();
                                        if (reg_no !== '' && reg_no.indexOf('APPL') === -1 && reg_no.indexOf('$') === -1) {
                                            reg_no_processed = reg_no_format(reg_no);
                                        } else {
                                            reg_no = '';
                                            reg_no_processed = '';
                                        }
                                        let arg1 = {
                                            "ss_id": erp_core_res.ss_id,
                                            "fba_id": erp_core_res.fba_id,
                                            "channel": erp_core_res.channel,
                                            "sync_Mobile": erp_core_res.mobileno,
                                            "sync_Name": erp_core_res.name || 'NA',
                                            "name": edata_user['ClientName'],
                                            "email": edata_user['EMail'],
                                            "mobile": erp_core_res.mobileno,
                                            "product": edata_user['ProductName'],
                                            "policy_expiry_date": str_expiry_date,
											"policy_expiry_month":str_expiry_month,
                                            "erp_qt": (edata_user['erp_QT'] !== null) ? edata_user['erp_QT'].toUpperCase() : '',
                                            "registration_no": reg_no,
                                            'vehicle_insurance_type': edata_user['InsuranceType'],
                                            'make': edata_user['Make'],
                                            'model': edata_user['Model'],
                                            'variant': edata_user['SubModel'],
                                            'city': edata_user['City'],
                                            'yom': (isNaN(edata_user['YOM']) === false) ? edata_user['YOM'].toString() : '',
                                            'rto_city': edata_user['RTO_City'],
                                            'rto_state': edata_user['RTO_State'],
                                            "registration_no_processed": reg_no_processed,
                                            "product_id": product_id,
                                            'vehicle_id': 0,
                                            'rto_id': 0,
                                            'vehicle_manf_date': vehicle_manf_date,
                                            'vehicle_registration_date': vehicle_registration_date,
                                            "Last_Lead_Created_On": '',
                                            "Is_Lead_Created": 0,
                                            "Is_Valid": 0,
                                            "Created_On": erp_core_res.sync_date,
                                            "Modified_On": erp_core_res.sync_date
                                        };
                                        //edata_user['Make'] !== '' && edata_user['Model'] !== '' &&
										edata_user['YOM'] = edata_user['YOM'] -0;
                                        if (isNaN(edata_user['YOM']) === false && (yr - 10) < edata_user['YOM']  && str_expiry_date !== '') {
                                            valid_data_count++;
                                            arg1['Is_Valid'] = 1;
                                        }
                                        erp_sync_response[erp_core_res['ss_id'] + '_' + erp_core_res['fba_id'] + '_' + erp_core_res['mobileno']].push(arg1);
                                        if (req.query['op'] === 'execute') {
                                            let check_sync_data = {
                                                'ss_id': arg1['ss_id'],
                                                'erp_qt': arg1['erp_qt'],
                                                "mobile": arg1['mobileno']
                                            };
                                            sync_contact_erp_data.count(check_sync_data).exec(function (err, syncCount) {
                                                syncCount = syncCount - 0;
                                                if (syncCount > 0) {
                                                    console.error('DBG', 'sync_contact', 'count', syncCount, check_sync_data);
                                                } else
                                                {
                                                    let data_sync_contact = new sync_contact_erp_data(arg1);
                                                    data_sync_contact.save(function (err1) {
                                                        if (err1) {
                                                            console.log('Error : ' + err1);
                                                        } else {
                                                            console.log("Success");
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    } catch (e) {
                                        let err_catch = {
                                            'err': e.stack,
                                            'data': edata_user
                                        };
                                        console.error('Exception', 'sync_contact_core_data', err_catch);
                                        erp_sync_response[erp_core_res['ss_id'] + '_' + erp_core_res['fba_id'] + '_' + erp_core_res['mobileno']].push(err_catch);
                                    }
                                }
                            }
                            Sync_Contact.update({'ss_id': erp_core_res['ss_id'], 'fba_id': erp_core_res['fba_id'], 'mobileno': erp_core_res['mobileno']}, {$set: {'Is_Migrate': 'yes', 'valid_count': valid_data_count}}, {multi: true}, function (err, numAffected) {
                                if (err) {
                                    return res.send(err);
                                } else {
                                }
                            });
                        }
                    }
                }
                var today = moment().utcOffset("+05:30");
                var today_str = moment(today).format("YYYYMMD");
                var objRequest = {
                    'dt': today.toLocaleString(),
                    'resp': erp_sync_response
                };
                fs.appendFile(appRoot + "/tmp/log/contact_migration_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
                res.send('<pre>Data Processed - ' + Object.keys(erp_sync_response).length + '</pre>');
            } else {
                res.json({'status': 'fail', 'msg': 'No Data Available'});
            }
        });
    });
    app.get('/sync_contacts/set_lead_data_main', function (req, res, next) {
        var Email = require('../models/email');
        var objModelEmail = new Email();
        let Client = require('node-rest-client').Client;
        let client = new Client();
		let agent_type = (req.query.hasOwnProperty('agent_type') && req.query['agent_type'] !== '') ? req.query['agent_type'] : 'POSP';
        let op = (req.query.hasOwnProperty('op') && req.query['op'] !== '') ? req.query['op'] : 'preview';
        let limit = (req.query.hasOwnProperty('limit') && req.query['limit'] !== '') ? req.query['limit'] - 0 : 100;
        let ss_id = (req.query.hasOwnProperty('ss_id') && req.query['ss_id'] !== '') ? req.query['ss_id'] - 0 : 0;
        let email_agent = (req.query.hasOwnProperty('email_agent') && req.query['email_agent'] !== '') ? req.query['email_agent'] : 'no';
        client.get(config.environment.weburl + '/sync_contacts/data_count?sync_summary=yes', {}, function (data, response) {
            if (data) {
                let Cond_Sync_Contact_Summary = {'Type': agent_type, 'lead': {'$lt': const_free_lead}, 'valid': {'$gt': 0}, 'lead_bal': {'$gt': 0}};
                if (ss_id > 0) {
                    Cond_Sync_Contact_Summary['ss_id'] = ss_id;
                }
                var Sync_Contact_Summary = require('../models/sync_contact_summary');
                Sync_Contact_Summary.find(Cond_Sync_Contact_Summary).sort({"last_synced_on":-1}).limit(limit).exec(function (err, Sync_Contact_Summary_Datas) {
                    try {
                        if (Sync_Contact_Summary_Datas && Sync_Contact_Summary_Datas.length > 0) {
                            let obj_summary = {
                                'condi': Cond_Sync_Contact_Summary,
                                'summary': {
                                    'total': Sync_Contact_Summary_Datas.length,
                                    'eligible': 0,
                                    'not_eligible': 0,
                                    'lead_processed': 0
                                },
                                'eligible_list': [],
                                'not_eligible_list': [],
                            };
                            for (let k in Sync_Contact_Summary_Datas) {
                                let Sync_Contact_Summary_Data = Sync_Contact_Summary_Datas[k]._doc;
                                let ss_id = Sync_Contact_Summary_Data['ss_id'];
                                let fba_id = Sync_Contact_Summary_Data['fba_id'];
                                let channel = Sync_Contact_Summary_Data['channel'];
                                let dataval = Sync_Contact_Summary_Data['valid'];
                                let lead = Sync_Contact_Summary_Data['lead'];
                                let data_bal = dataval - lead;
                                let lead_bal = 0;
                                if (data_bal > const_free_lead) {
                                    lead_bal = const_free_lead - lead;
                                } else {
                                    lead_bal = data_bal;
                                }


                                if (data_bal >= lead_bal && lead_bal > 0 && data_bal > 0) {
                                    let agent_lead_url = config.environment.weburl + '/sync_contacts/set_lead_data_agent?op=' + op + '&limit=' + lead_bal + '&mode=agent&email_agent=' + email_agent + '&ss_id=' + ss_id + '&fba_id=' + fba_id;
                                    obj_summary['summary']['eligible']++;
                                    obj_summary['summary']['lead_processed'] += lead_bal;
                                    obj_summary['eligible_list'].push({
                                        'channel': channel,
                                        'ss_id': ss_id,
                                        'fba_id': fba_id,
                                        'agent_lead_url': agent_lead_url,
                                        'data': dataval,
                                        'data_bal': data_bal,
                                        'lead': lead,
                                        'lead_bal': lead_bal,
                                        'eligible': 'yes'
                                    });
                                    if (op === 'execute') {
                                        client.get(agent_lead_url, {}, function (data, response) {
                                        });
                                    }
                                } else {
                                    obj_summary['not_eligible_list'].push({
                                        'channel': channel,
                                        'ss_id': ss_id,
                                        'fba_id': fba_id,
                                        'agent_lead_url': '',
                                        'data': dataval,
                                        'data_bal': data_bal,
                                        'lead': lead,
                                        'lead_bal': lead_bal,
                                        'eligible': 'no'
                                    });
                                    obj_summary['summary']['not_eligible']++;
                                }
                            }
                            var today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
                            let sub = '[SCHEDULER]INFO-LEAD_SYNC_CONTACT_MAIN-Agent:' + obj_summary['eligible_list'].length + '-' + moment().format('YYYYMMDD_HH:mm:ss');
                            let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                            res_report += '<p><h1>SYNC CONTACT LEAD ALLOCATION REPORT :: Total Agent - ' + obj_summary['eligible_list'].length + ' :: ' + today_str + '</h1></p>';
                            res_report += '<p><h1>SUMMARY</h1>' + objectToHtml(obj_summary['summary']) + '</p>';
                            res_report += arrayobjectToHtml(obj_summary['eligible_list'], 'ELIGIBLE_AGENT_LIST', 'Agent list who are eligible for lead allocation', ['agent_lead_url']);
                            res_report += arrayobjectToHtml(obj_summary['not_eligible_list'], 'NOT_ELIGIBLE_AGENT_LIST', 'Agent list who are NOT eligible for lead allocation', ['agent_lead_url']);
                            res_report += '</body></html>';
                            objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, res_report, 'chirag.modi@policyboss.com', '', '');
                            return res.send('<pre>' + JSON.stringify(obj_summary, undefined, 2) + '</pre>');
                        } else {
                            return res.send('No_Eligible_Data');
                        }
                    } catch (e) {
                        res.send(e.stack);
                    }
                });
            } else {
                return res.send('Data_Sync_Err');
            }
        });
    });
    app.get('/sync_contacts/set_lead_data_main_emp', function (req, res, next) {
        var Email = require('../models/email');
        var objModelEmail = new Email();
        let Client = require('node-rest-client').Client;
        let client = new Client();
        let op = (req.query.hasOwnProperty('op') && req.query['op'] !== '') ? req.query['op'] : 'preview';
        let limit = (req.query.hasOwnProperty('limit') && req.query['limit'] !== '') ? req.query['limit'] - 0 : 100;
        let ss_id = (req.query.hasOwnProperty('ss_id') && req.query['ss_id'] !== '') ? req.query['ss_id'] - 0 : 0;
        let email_agent = (req.query.hasOwnProperty('email_agent') && req.query['email_agent'] !== '') ? req.query['email_agent'] : 'no';
        client.get(config.environment.weburl + '/sync_contacts/data_count?sync_summary=yes', {}, function (data, response) {
            if (data) {
                let Cond_Sync_Contact_Summary = {"Type" : "EMPLOYEE", 'valid': {'$gt': 0}, 'lead_bal': {'$gt': 0}};
                if (ss_id > 0) {
                    Cond_Sync_Contact_Summary['ss_id'] = ss_id;
                }
                var Sync_Contact_Summary = require('../models/sync_contact_summary');
                Sync_Contact_Summary.find(Cond_Sync_Contact_Summary).limit(limit).exec(function (err, Sync_Contact_Summary_Datas) {
                    try {
                        if (Sync_Contact_Summary_Datas && Sync_Contact_Summary_Datas.length > 0) {
                            let obj_summary = {
                                'condi': Cond_Sync_Contact_Summary,
                                'summary': {
                                    'total': Sync_Contact_Summary_Datas.length,
                                    'eligible': 0,
                                    'not_eligible': 0,
                                    'lead_processed': 0
                                },
                                'eligible_list': [],
                                'not_eligible_list': [],
                            };
                            for (let k in Sync_Contact_Summary_Datas) {
                                let Sync_Contact_Summary_Data = Sync_Contact_Summary_Datas[k]._doc;
                                let ss_id = Sync_Contact_Summary_Data['ss_id'];
                                let fba_id = Sync_Contact_Summary_Data['fba_id'];
                                let channel = Sync_Contact_Summary_Data['channel'];
                                let dataval = Sync_Contact_Summary_Data['valid'];
                                let lead = Sync_Contact_Summary_Data['lead'];
                                let data_bal = dataval - lead;
                                let lead_bal = 0;
                                lead_bal = data_bal;
                                if (data_bal >= lead_bal && lead_bal > 0 && data_bal > 0) {
                                    let agent_lead_url = config.environment.weburl + '/sync_contacts/set_lead_data_agent?op=' + op + '&limit=' + lead_bal + '&mode=agent&email_agent=' + email_agent + '&ss_id=' + ss_id + '&fba_id=' + fba_id;
                                    obj_summary['summary']['eligible']++;
                                    obj_summary['summary']['lead_processed'] += lead_bal;
                                    obj_summary['eligible_list'].push({
                                        'channel': channel,
                                        'ss_id': ss_id,
                                        'fba_id': fba_id,
                                        'agent_lead_url': agent_lead_url,
                                        'data': dataval,
                                        'data_bal': data_bal,
                                        'lead': lead,
                                        'lead_bal': lead_bal,
                                        'eligible': 'yes'
                                    });
                                    if (op === 'execute') {
                                        client.get(agent_lead_url, {}, function (data, response) {
                                        });
                                    }
                                } else {
                                    obj_summary['not_eligible_list'].push({
                                        'channel': channel,
                                        'ss_id': ss_id,
                                        'fba_id': fba_id,
                                        'agent_lead_url': '',
                                        'data': dataval,
                                        'data_bal': data_bal,
                                        'lead': lead,
                                        'lead_bal': lead_bal,
                                        'eligible': 'no'
                                    });
                                    obj_summary['summary']['not_eligible']++;
                                }
                            }
                            var today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
                            let sub = '[SCHEDULER]INFO-LEAD_SYNC_CONTACT_MAIN-Agent:' + obj_summary['eligible_list'].length + '-' + moment().format('YYYYMMDD_HH:mm:ss');
                            let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                            res_report += '<p><h1>SYNC CONTACT LEAD ALLOCATION REPORT :: Total Agent - ' + obj_summary['eligible_list'].length + ' :: ' + today_str + '</h1></p>';
                            res_report += '<p><h1>SUMMARY</h1>' + objectToHtml(obj_summary['summary']) + '</p>';
                            res_report += arrayobjectToHtml(obj_summary['eligible_list'], 'ELIGIBLE_AGENT_LIST', 'Agent list who are eligible for lead allocation', ['agent_lead_url']);
                            res_report += arrayobjectToHtml(obj_summary['not_eligible_list'], 'NOT_ELIGIBLE_AGENT_LIST', 'Agent list who are NOT eligible for lead allocation', ['agent_lead_url']);
                            res_report += '</body></html>';
                            objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, res_report, 'chirag.modi@policyboss.com', '', '');
                            return res.send('<pre>' + JSON.stringify(obj_summary, undefined, 2) + '</pre>');
                        } else {
                            return res.send('No_Eligible_Data');
                        }
                    } catch (e) {
                        res.send(e.stack);
                    }
                });
            } else {
                return res.send('Data_Sync_Err');
            }
        });
    });
    app.get('/sync_contacts/set_lead_data_agent', agent_details_pre, function (req, res, next) {
        try {
            var today = moment().utcOffset("+05:30").startOf('Day');
            let lead_start_date = (req.query.hasOwnProperty('lead_start_date') && req.query['lead_start_date'] !== '') ? req.query['lead_start_date'] : moment(today).add(14, 'days').format("YYYY-MM-DD");
            var today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
            let Condi_Sync_Contanct_Lead = {
                'Is_Lead_Created': 0,
                'Is_Valid': 1,
                'policy_expiry_date': {$gte: lead_start_date}
            };
            let ss_id = null;
            let fba_id = null;
            if (req.query.hasOwnProperty('ss_id') && req.query['ss_id'] !== '' && req.query.hasOwnProperty('fba_id') && req.query['fba_id'] !== '') {
                ss_id = req.query['ss_id'] - 0;
                fba_id = req.query['fba_id'] - 0;
                Condi_Sync_Contanct_Lead['ss_id'] = ss_id;
                Condi_Sync_Contanct_Lead['fba_id'] = fba_id;
            }
            let op = (req.query.hasOwnProperty('op') && req.query['op'] !== '') ? req.query['op'] : 'preview';
            var Email = require('../models/email');
            var objModelEmail = new Email();
            var lead_res = {
                'Condi': Condi_Sync_Contanct_Lead,
                'Op': op,
                "Mode": 'agent',
                "On": '',
                "Status": "",
                "Msg": "",
                "totalcount": 0,
                "Data_Processed": [],
                "Data_Exception": [],
                "Data_Inner_Exception": [],
                'Agent_Summary': {},
                'date_slab_summary': {
                    'Expiring_Today': {'slab': 'Expiring_Today', 'count': 0},
                    'Expiring_in_within_3_Days': {'slab': 'Expiring_in_within_3_Days', 'count': 0},
                    'Expiring_in_Next_3_to_7_Days': {'slab': 'Expiring_in_Next_3_to_7_Days', 'count': 0},
                    'Expiring_in_Next_7_to_15_Days': {'slab': 'Expiring_in_Next_7_to_15_Days', 'count': 0},
                    'Expiring_in_Next_15_to_30_Days': {'slab': 'Expiring_in_Next_15_to_30_Days', 'count': 0},
                    'Expiring_beyond_30_Days': {'slab': 'Expiring_beyond_30_Days', 'count': 0},
                    'ALL': {'slab': 'ALL', 'count': 0}
                }
            };
            var limit = (req.query.hasOwnProperty('limit')) ? req.query['limit'] - 0 : 2000;
            var channel = '';
            let agent_details = {};
            lead_res['Agent_Summary'] = {
                'profile': null,
                'lead_list': [],
                'lead_count': 0
            };
            channel = req.agent['channel'];
            if (req.agent['user_type'] === 'POSP') {
                agent_details = {
                    'type': req.agent['user_type'],
                    'agent_name': req.agent['POSP']['First_Name'] + ' ' + req.agent['POSP']['Last_Name'],
                    'agent_email': req.agent['POSP']['Email_Id'],
                    'ss_id': ss_id,
                    'fba_id': fba_id,
                    'erp_code': req.agent['POSP']['Erp_Id'],
                    'rm_name': req.agent['POSP']['Reporting_Agent_Name'],
                    'rm_uid': req.agent['POSP']['Reporting_Agent_Uid'],
                    'rm_email': req.agent['POSP']['Reporting_Email_ID']
                };
            }
            if (req.agent['user_type'] === 'FOS') {
                agent_details = {
                    'type': req.agent['user_type'],
                    'agent_name': req.agent['EMP']['Emp_Name'],
                    'agent_email': req.agent['EMP']['Email_Id'],
                    'ss_id': ss_id,
                    'fba_id': fba_id,
                    'erp_code': req.agent['EMP']['VendorCode'],
                    'rm_name': req.agent['EMP']['Reporting_UID_Name'],
                    'rm_uid': req.agent['EMP']['UID'],
                    'rm_email': req.agent['EMP']['Reporting_Email_ID']
                };
            }
            if (req.agent['user_type'] === 'EMP') {
                agent_details = {
                    'type': req.agent['user_type'],
                    'agent_name': req.agent['EMP']['Emp_Name'],
                    'agent_email': req.agent['EMP']['Email_Id'],
                    'ss_id': ss_id,
                    'fba_id': fba_id,
                    'erp_code': req.agent['EMP']['UID'],
                    'rm_name': '',
                    'rm_uid': '',
                    'rm_email': ''
                };
            }
            lead_res['Agent_Summary']['profile'] = agent_details;
            let mode = 'agent';
            let obj_link_schema = {
                'Expiring_Today': 0,
                'Expiring_in_within_3_Days': 3,
                'Expiring_in_Next_3_to_7_Days': 7,
                'Expiring_in_Next_7_to_15_Days': 15,
                'Expiring_in_Next_15_to_30_Days': 60,
                'Expiring_beyond_30_Days': 300
            };
            if (op === 'count') {
                sync_contact_erp_data.count(Condi_Sync_Contanct_Lead).sort({policy_expiry_date: 1}).exec(function (err, leadCount) {
                    var objSummary = {
                        'Condi': Condi_Sync_Contanct_Lead,
                        'Count': leadCount
                    };
                    return res.send('<pre>' + JSON.stringify(objSummary, undefined, 2) + '</pre>');
                });
            } else {
                sync_contact_erp_data.find(Condi_Sync_Contanct_Lead).sort({policy_expiry_date: 1}).limit(limit).exec(function (err, quote_data) {
                    if (quote_data.length > 0) {
                        var Lead = require('../models/leads');
                        let Client = require('node-rest-client').Client;
                        let client = new Client();
                        for (let k in quote_data) {
                            let rwnluserData = quote_data[k]._doc;
                            try {
                                let arg = {};
                                let Policy_Expiry_Date = moment(rwnluserData['policy_expiry_date']).utcOffset("+05:30").startOf('Day');
                                let days_diff = Policy_Expiry_Date.diff(today, 'days');
                                days_diff = days_diff - 0;
                                let follow_slab = 'Expiring_beyond_30_Days';
                                for (let j in obj_link_schema) {
                                    if (days_diff <= obj_link_schema[j]) {
                                        follow_slab = j;
                                        break;
                                    }
                                }
                                lead_res['date_slab_summary'][follow_slab]['count']++;
                                lead_res['date_slab_summary']['ALL']['count']++;
                                lead_res['totalcount']++;
                                if (mode === 'agent') {
                                    let policy_expiry_date = rwnluserData['policy_expiry_date'];
                                    let yom = rwnluserData['yom'];
                                    let vehicle_registration_date = yom + '-' + moment(policy_expiry_date).add(1, 'days').format("MM-DD");
                                    let vehicle_manf_date = yom + '-01-10';
                                    lead_res['Agent_Summary']['lead_list'].push({
                                        'Contact_Id': rwnluserData['Sync_Contact_Erp_Data_Id'],
                                        "Customer_Name": rwnluserData['name'],
                                        "Product": rwnluserData['product'],
                                        "Policy_Expiry_Date": rwnluserData['policy_expiry_date'],
                                        "Registration_No": rwnluserData['registration_no']
                                    });
                                    arg = {
                                        "PB_CRN": "",
                                        "User_Data_Id": "",
                                        "ss_id": rwnluserData['ss_id'],
                                        "fba_id": rwnluserData['fba_id'],
										'ERP_QT' : rwnluserData['erp_qt'] || '',
                                        "channel": channel,
                                        "Created_On": new Date(),
                                        "Modified_On": new Date(),
                                        "Product_Id": 1,
                                        "previous_policy_number": "",
                                        "prev_policy_start_date": "",
                                        "policy_expiry_date": rwnluserData['policy_expiry_date'],
                                        "engine_number": "",
                                        "chassis_number": "",
                                        "company_name": "",
                                        "Customer_Name": rwnluserData['name'],
                                        "Customer_Address": "",
                                        "mobile": rwnluserData['mobile'],
                                        "email": "",
                                        "mobile2": "", //ErpqtRqst['__communication_address__'],
                                        "vehicle_insurance_type": "individual", //ErpqtRqst['__vehicle_insurance_type__'] === "new" ? "N" : "R",
                                        "issued_by_username": "", //to be ask
                                        "registration_no": rwnluserData['registration_no_processed'],
                                        "registration_no_processed": rwnluserData['registration_no_processed'],
                                        "nil_dept": "", //ErpqtRqst['__addon_zero_dep_cover__'] === "yes" ? "Yes" : "No",
                                        "rti": "", //to be ask
                                        "Make_Name": rwnluserData['make'],
                                        "Model_ID": "", //ErpqtRqst['__pb_model_id__'],
                                        "Model_Name": rwnluserData['model'], //ErpqtRqst['__pb_model_name__'],
                                        "Variant_Name": rwnluserData['variant'], //ErpqtRqst['__pb_variant_name__'],
                                        "Vehicle_ID": "", //ErpqtRqst['__vehicle_id__'],
                                        "Fuel_ID": "", //ErpqtRqst['__pb_fuel_id__'],
                                        "Fuel_Name": "", //ErpqtRqst['__pb_fuel_name__'],
                                        "RTO_City": rwnluserData['rto_city'], //ErpqtRqst['__pb_rto_city__'],
                                        "RTO_State": rwnluserData['rto_state'], //ErpqtRqst['__pb_rto_city__'],
                                        "VehicleCity_Id": "", //ErpqtRqst['__pb_vehiclecity_id__'],
                                        "VehicleCity_RTOCode": "", //ErpqtRqst['__pb_vehiclecity_rtocode__'],
                                        "vehicle_registration_date": vehicle_registration_date, //ErpqtRqst['__vehicle_registration_date__'],
                                        "vehicle_manf_date": vehicle_manf_date, //ErpqtRqst['__vehicle_manf_date__'],
                                        "prev_insurer_id": 0, //ErpqtRqst['__insurer_id__'],
                                        "vehicle_ncb_current": "", //rwnluserData.Premium_List.Summary.Request_Product['vehicle_ncb_next'],
                                        "is_claim_exists": "", //ErpqtRqst['__is_claim_exists__'],
                                        "is_renewal_proceed": "no",
                                        "lead_type": "sync_contacts",
                                        "lead_status": "pending",
                                        "lead_assigned_uid": null,
                                        "lead_assigned_name": "",
                                        "lead_assigned_ssid": null,
                                        "lead_assigned_on": new Date(),
                                        'agent_details': agent_details
                                    };
                                    lead_res['Data_Processed'].push(rwnluserData['Sync_Contact_Erp_Data_Id']);
                                    if (op === 'execute') {
                                        let condi_update_sync = {'Sync_Contact_Erp_Data_Id': rwnluserData['Sync_Contact_Erp_Data_Id']};
                                        console.error('Exception', 'Lead_Add', 'Sync_Update', condi_update_sync);
                                        sync_contact_erp_data.update(condi_update_sync, {$set: {'Is_Lead_Created': 1}}, function (err, numAffected) {
                                            if (err)
                                            {
                                                console.error('Exception', 'Lead_Add', 'Sync_Update', err);
                                            } else {
                                                let objModelLead = new Lead(arg);
                                                objModelLead.save(function (err, objDbLead) {
                                                    if (err)
                                                    {
                                                        console.error('Exception', 'Lead_Add', 'Lead_Allocate', err, arg);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            } catch (e) {
                                lead_res['Data_Exception'].push({
                                    'id': rwnluserData['Sync_Contact_Erp_Data_Id'],
                                    'msg': e.stack
                                });
                            }
                        }
                    }
                    lead_res['On'] = moment().format('YYYY-MM-DD_HH:mm:ss');
                    lead_res['Msg'] = "Data Uploaded Successfylly in Lead";
                    var today = new Date();
                    var today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
                    var log_file_name = today.toISOString().substring(0, 10).toString().replace(/-/g, '');
                    fs.appendFile(appRoot + "/tmp/log/sync_contact_lead_allocate_" + log_file_name + ".log", JSON.stringify(lead_res) + '\r\n', function (err) {

                    });
                    if (mode === 'agent' && lead_res.Agent_Summary['lead_list'].length > 0) {
                        lead_res.Agent_Summary['lead_count'] = lead_res.Agent_Summary['lead_list'].length;
                        let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                        res_report += '<p><h1>SYNC CONTACT LEAD ALLOCATION REPORT :: Total Lead-' + lead_res.Agent_Summary['lead_count'] + ' :: SSID-' + ss_id + ' :: ' + today_str + '</h1></p>';
                        res_report += '<p><h1>Details</h1>' + objectToHtml(lead_res.Agent_Summary['profile']) + '</p>';
                        res_report += '<p><h1>Date Range Summary</h1>';
                        res_report += arrayobjectToHtml(lead_res['date_slab_summary']);
                        res_report += '<p><h1>List</h1>';
                        res_report += arrayobjectToHtml(lead_res.Agent_Summary['lead_list'], 'Lead Allocation List', '', ['Registration_No']);
                        res_report += '</p>';
                        res_report += '</body></html>';
                        let sub = '[SCHEDULER]LEAD_SYNC_CONTACT_AGENT - Total Lead - ' + lead_res.Agent_Summary['lead_count'] + ' :: SSID-' + ss_id + ' :: ' + moment().format('YYYYMMDD_HH:mm:ss');
                        let to = config.environment.notification_email;
                        let cc = '';
                        let bcc = '';
                        if (req.query['op'] === 'execute' && req.query['email_agent'] === 'yes') {
                            to = lead_res.Agent_Summary['profile']['agent_email'];
                            cc = lead_res.Agent_Summary['profile']['rm_email'];
                            bcc = config.environment.notification_email;
                        }
                        objModelEmail.send('customercare@policyboss.com', to, sub, res_report, cc, bcc, '');
                    }
                    return res.json(lead_res);
                });
            }
        } catch (err) {
            lead_res['Data_Exception'].push({
                'msg': err.stack
            });
            res.json(lead_res);
        }
    });
    app.get('/sync_contacts/set_lead_data', agent_details_pre, function (req, res, next) {
        try {
            var today = moment().utcOffset("+05:30").startOf('Day');
            var followup_t_today = moment(today).format("YYYY-MM-DD");
            var followup_t_end = '';
            if (req.query.hasOwnProperty('dateto') && req.query['dateto'] !== '') {
                followup_t_end = req.query['dateto'];
                var t_date = moment(followup_t_end, 'YYYY-MM-DD', true);
                if (t_date.isValid() === false) {
                    return res.json('Invalid End Date Range');
                }
            } else {
                followup_t_end = moment(today).add(30, 'days').format("YYYY-MM-DD");
            }
            req.query['dateto'] = followup_t_end;
            let Condi_Sync_Contanct_Lead = {
                'Is_Lead_Created': 0,
                'Is_Valid': 1,
                'policy_expiry_date': {$gte: followup_t_today, $lte: followup_t_end}
            };
            let mode = (req.query.hasOwnProperty('mode') && req.query['mode'] !== '') ? req.query['mode'] : 'all';
            let ss_id = null;
            let fba_id = null;
            if (mode === 'agent') {
                if (req.query.hasOwnProperty('ss_id') && req.query['ss_id'] !== '' && req.query.hasOwnProperty('fba_id') && req.query['fba_id'] !== '') {
                    ss_id = req.query['ss_id'] - 0;
                    fba_id = req.query['fba_id'] - 0;
                    Condi_Sync_Contanct_Lead['ss_id'] = ss_id;
                    Condi_Sync_Contanct_Lead['fba_id'] = fba_id;
                }
            }
            var Email = require('../models/email');
            var objModelEmail = new Email();
            var lead_res = {
                'Op': (req.query.hasOwnProperty('op') && req.query['op'] !== '') ? req.query['op'] : 'preview',
                "Mode": mode,
                "On": '',
                "Status": "",
                "Msg": "",
                "totalcount": 0,
                "Data_Processed": [],
                "Data_Exception": [],
                "Data_Inner_Exception": [],
                'Agent_Summary': {},
                'date_slab_summary': {
                    'Expiring_Today': {'slab': 'Expiring_Today', 'count': 0},
                    'Expiring_in_within_3_Days': {'slab': 'Expiring_in_within_3_Days', 'count': 0},
                    'Expiring_in_Next_3_to_7_Days': {'slab': 'Expiring_in_Next_3_to_7_Days', 'count': 0},
                    'Expiring_in_Next_7_to_15_Days': {'slab': 'Expiring_in_Next_7_to_15_Days', 'count': 0},
                    'Expiring_in_Next_15_to_30_Days': {'slab': 'Expiring_in_Next_15_to_30_Days', 'count': 0},
                    'ALL': {'slab': 'ALL', 'count': 0}
                }
            };
            var limit = (req.query.hasOwnProperty('limit')) ? req.query['limit'] - 0 : 2000;
            var channel = '';
            let agent_details = {};
            if (mode === 'agent') {
                lead_res['Agent_Summary'] = {
                    'profile': null,
                    'lead_list': [],
                    'lead_count': 0
                };
                channel = req.agent['channel'];
                if (req.agent['user_type'] === 'POSP') {
                    agent_details = {
                        'type': req.agent['user_type'],
                        'agent_name': req.agent['POSP']['First_Name'] + ' ' + req.agent['POSP']['Last_Name'],
                        'agent_email': req.agent['POSP']['Email_Id'],
                        'ss_id': ss_id,
                        'fba_id': fba_id,
                        'erp_code': req.agent['POSP']['Erp_Id'],
                        'rm_name': req.agent['POSP']['Reporting_Agent_Name'],
                        'rm_uid': req.agent['POSP']['Reporting_Agent_Uid'],
                        'rm_email': req.agent['POSP']['Reporting_Email_ID']
                    };
                }
                if (req.agent['user_type'] === 'FOS') {
                    agent_details = {
                        'type': req.agent['user_type'],
                        'agent_name': req.agent['EMP']['Emp_Name'],
                        'agent_email': req.agent['EMP']['Email_Id'],
                        'ss_id': ss_id,
                        'fba_id': fba_id,
                        'erp_code': req.agent['EMP']['VendorCode'],
                        'rm_name': req.agent['EMP']['Reporting_UID_Name'],
                        'rm_uid': req.agent['EMP']['UID'],
                        'rm_email': req.agent['EMP']['Reporting_Email_ID']
                    };
                }
                if (req.agent['user_type'] === 'EMP') {
                    agent_details = {
                        'type': req.agent['user_type'],
                        'agent_name': req.agent['EMP']['Emp_Name'],
                        'agent_email': req.agent['EMP']['Email_Id'],
                        'ss_id': ss_id,
                        'fba_id': fba_id,
                        'erp_code': req.agent['EMP']['UID'],
                        'rm_name': '',
                        'rm_uid': '',
                        'rm_email': ''
                    };
                }
                lead_res['Agent_Summary']['profile'] = agent_details;
            }
            let obj_link_schema = {
                'Expiring_Today': 0,
                'Expiring_in_within_3_Days': 3,
                'Expiring_in_Next_3_to_7_Days': 7,
                'Expiring_in_Next_7_to_15_Days': 15,
                'Expiring_in_Next_15_to_30_Days': 60
            };
            if (req.query['op'] === 'count') {
                sync_contact_erp_data.count(Condi_Sync_Contanct_Lead).sort({policy_expiry_date: 1}).exec(function (err, leadCount) {
                    var objSummary = {
                        'Condi': Condi_Sync_Contanct_Lead,
                        'Count': leadCount
                    };
                    return res.send('<pre>' + JSON.stringify(objSummary, undefined, 2) + '</pre>');
                });
            } else {
                sync_contact_erp_data.find(Condi_Sync_Contanct_Lead).sort({policy_expiry_date: 1}).limit(limit).exec(function (err, quote_data) {
                    if (quote_data.length > 0) {
                        var Lead = require('../models/leads');
                        let Client = require('node-rest-client').Client;
                        let client = new Client();
                        for (let k in quote_data) {
                            let rwnluserData = quote_data[k]._doc;
                            try {
                                let arg = {};
                                if (rwnluserData.hasOwnProperty('policy_expiry_date') && rwnluserData['policy_expiry_date'] !== '') {
                                    let Policy_Expiry_Date = moment(rwnluserData['policy_expiry_date']).utcOffset("+05:30").startOf('Day');
                                    let days_diff = Policy_Expiry_Date.diff(today, 'days');
                                    days_diff = days_diff - 0;
                                    let follow_slab = 'Pending';
                                    for (let j in obj_link_schema) {
                                        if (days_diff <= obj_link_schema[j]) {
                                            follow_slab = j;
                                            break;
                                        }
                                    }
                                    let key_agent = rwnluserData['ss_id'] + '_' + rwnluserData['fba_id'];
                                    lead_res['date_slab_summary'][follow_slab]['count']++;
                                    lead_res['date_slab_summary']['ALL']['count']++;
                                    lead_res['totalcount']++;
                                    if (mode === 'all') {
                                        if (lead_res['Agent_Summary'].hasOwnProperty(key_agent) === false) {
                                            lead_res['Agent_Summary'][key_agent] = {
                                                'key_agent': key_agent,
                                                'lead_count': 0,
                                                'lead_list': []
                                            };
                                            if (mode === 'all') {
                                                client.get(config.environment.weburl + '/sync_contacts/set_lead_data?op=' + req.query['op'] + '&dateto=' + req.query['dateto'] + '&mode=agent&email_agent=' + req.query['email_agent'] + '&ss_id=' + rwnluserData['ss_id'] + '&fba_id=' + rwnluserData['fba_id'], {}, function (data, response) {
                                                });
                                            }
                                        }
                                        lead_res['Agent_Summary'][key_agent]['lead_list'].push(rwnluserData['Sync_Contact_Erp_Data_Id']);
                                        lead_res['Agent_Summary'][key_agent]['lead_count']++;
                                    }
                                    if (mode === 'agent') {
                                        let policy_expiry_date = rwnluserData['policy_expiry_date'];
                                        let yom = rwnluserData['yom'];
                                        let vehicle_registration_date = yom + '-' + moment(policy_expiry_date).add(1, 'days').format("MM-DD");
                                        let vehicle_manf_date = yom + '-01-10';
                                        lead_res['Agent_Summary']['lead_list'].push({
                                            'Contact_Id': rwnluserData['Sync_Contact_Erp_Data_Id'],
                                            "Customer_Name": rwnluserData['name'],
                                            "Product": rwnluserData['product'],
                                            "Policy_Expiry_Date": rwnluserData['policy_expiry_date'],
                                            "Registration_No": rwnluserData['registration_no']
                                        });
                                        arg = {
                                            "PB_CRN": "",
                                            "User_Data_Id": "",
											'ERP_QT' : rwnluserData['erp_qt'] || '',
                                            "ss_id": rwnluserData['ss_id'],
                                            "fba_id": rwnluserData['fba_id'],
                                            "channel": channel,
                                            "Created_On": new Date(),
                                            "Modified_On": new Date(),
                                            "Product_Id": 1,
                                            "previous_policy_number": "",
                                            "prev_policy_start_date": "",
                                            "policy_expiry_date": rwnluserData['policy_expiry_date'],
                                            "engine_number": "",
                                            "chassis_number": "",
                                            "company_name": "",
                                            "Customer_Name": rwnluserData['name'],
                                            "Customer_Address": "",
                                            "mobile": rwnluserData['mobile'],
                                            "email": "",
                                            "mobile2": "", //ErpqtRqst['__communication_address__'],
                                            "vehicle_insurance_type": "individual", //ErpqtRqst['__vehicle_insurance_type__'] === "new" ? "N" : "R",
                                            "issued_by_username": "", //to be ask
                                            "registration_no": rwnluserData['registration_no_processed'],
                                            "registration_no_processed": rwnluserData['registration_no_processed'],
                                            "nil_dept": "", //ErpqtRqst['__addon_zero_dep_cover__'] === "yes" ? "Yes" : "No",
                                            "rti": "", //to be ask
                                            "Make_Name": rwnluserData['make'],
                                            "Model_ID": "", //ErpqtRqst['__pb_model_id__'],
                                            "Model_Name": rwnluserData['model'], //ErpqtRqst['__pb_model_name__'],
                                            "Variant_Name": rwnluserData['variant'], //ErpqtRqst['__pb_variant_name__'],
                                            "Vehicle_ID": "", //ErpqtRqst['__vehicle_id__'],
                                            "Fuel_ID": "", //ErpqtRqst['__pb_fuel_id__'],
                                            "Fuel_Name": "", //ErpqtRqst['__pb_fuel_name__'],
                                            "RTO_City": rwnluserData['rto_city'], //ErpqtRqst['__pb_rto_city__'],
                                            "RTO_State": rwnluserData['rto_state'], //ErpqtRqst['__pb_rto_city__'],
                                            "VehicleCity_Id": "", //ErpqtRqst['__pb_vehiclecity_id__'],
                                            "VehicleCity_RTOCode": "", //ErpqtRqst['__pb_vehiclecity_rtocode__'],
                                            "vehicle_registration_date": vehicle_registration_date, //ErpqtRqst['__vehicle_registration_date__'],
                                            "vehicle_manf_date": vehicle_manf_date, //ErpqtRqst['__vehicle_manf_date__'],
                                            "prev_insurer_id": 0, //ErpqtRqst['__insurer_id__'],
                                            "vehicle_ncb_current": "", //rwnluserData.Premium_List.Summary.Request_Product['vehicle_ncb_next'],
                                            "is_claim_exists": "", //ErpqtRqst['__is_claim_exists__'],
                                            "is_renewal_proceed": "no",
                                            "lead_type": "sync_contacts",
                                            "lead_status": "pending",
                                            'agent_details': agent_details
                                        };
                                        lead_res['Data_Processed'].push(rwnluserData['Sync_Contact_Erp_Data_Id']);
                                        if (req.query['op'] === 'execute') {
                                            let condi_update_sync = {'Sync_Contact_Erp_Data_Id': rwnluserData['Sync_Contact_Erp_Data_Id']};
                                            console.error('Exception', 'Lead_Add', 'Sync_Update', condi_update_sync);
                                            sync_contact_erp_data.update(condi_update_sync, {$set: {'Is_Lead_Created': 1}}, function (err, numAffected) {
                                                if (err)
                                                {
                                                    console.error('Exception', 'Lead_Add', 'Sync_Update', err);
                                                } else {
                                                    let objModelLead = new Lead(arg);
                                                    objModelLead.save(function (err, objDbLead) {
                                                        if (err)
                                                        {
                                                            console.error('Exception', 'Lead_Add', 'Lead_Allocate', err, arg);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            } catch (e) {
                                lead_res['Data_Exception'].push({
                                    'id': rwnluserData['Sync_Contact_Erp_Data_Id'],
                                    'msg': e.stack
                                });
                            }
                        }
                    }
                    lead_res['On'] = moment().format('YYYY-MM-DD_HH:mm:ss');
                    lead_res['Msg'] = "Data Uploaded Successfylly in Lead";
                    var today = new Date();
                    var log_file_name = today.toISOString().substring(0, 10).toString().replace(/-/g, '');
                    fs.appendFile(appRoot + "/tmp/log/sync_contact_lead_allocate_" + log_file_name + ".log", JSON.stringify(lead_res) + '\r\n', function (err) {

                    });
                    var today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
                    if (mode == 'all') {
                        let sub = '[SCHEDULER]INFO-LEAD_SYNC_CONTACT-Total:' + lead_res['totalcount'] + '-' + moment().format('YYYYMMDD_HH:mm:ss');
                        let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                        res_report += '<p><h1>SYNC CONTACT LEAD ALLOCATION REPORT :: Total Lead - ' + lead_res['totalcount'] + ' :: ' + today_str + '</h1></p>';
                        res_report += '<p><h1>Date Range Summary From : ' + followup_t_today + ' ,  To : ' + followup_t_end + '</h1>';
                        res_report += arrayobjectToHtml(lead_res['date_slab_summary']);
                        res_report += '<p><h1>List</h1>';
                        res_report += arrayobjectToHtml(lead_res.Agent_Summary);
                        res_report += '</p>';
                        res_report += '</body></html>';
                        objModelEmail.send('customercare@policyboss.com', config.environment.notification_email, sub, res_report, '', '', '');
                    }
                    if (mode === 'agent' && lead_res.Agent_Summary['lead_list'].length > 0) {
                        lead_res.Agent_Summary['lead_count'] = lead_res.Agent_Summary['lead_list'].length;
                        let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                        res_report += '<p><h1>SYNC CONTACT LEAD ALLOCATION REPORT :: Total Lead-' + lead_res.Agent_Summary['lead_count'] + ' :: SSID-' + ss_id + ' :: ' + today_str + '</h1></p>';
                        res_report += '<p><h1>Details</h1>' + objectToHtml(lead_res.Agent_Summary['profile']) + '</p>';
                        res_report += '<p><h1>Date Range Summary From : ' + followup_t_today + ' ,  To : ' + followup_t_end + '</h1>';
                        res_report += arrayobjectToHtml(lead_res['date_slab_summary']);
                        res_report += '<p><h1>List</h1>';
                        res_report += arrayobjectToHtml(lead_res.Agent_Summary['lead_list'], 'Lead Allocation List', '', ['Registration_No']);
                        res_report += '</p>';
                        res_report += '</body></html>';
                        let sub = '[SCHEDULER]LEAD_SYNC_CONTACT_AGENT - Total Lead - ' + lead_res.Agent_Summary['lead_count'] + ' :: SSID-' + ss_id + ' :: ' + moment().format('YYYYMMDD_HH:mm:ss');
                        let to = config.environment.notification_email;
                        let cc = '';
                        let bcc = '';
                        if (req.query['op'] === 'execute' && req.query['email_agent'] === 'yes') {
                            to = lead_res.Agent_Summary['profile']['agent_email'];
                            cc = lead_res.Agent_Summary['profile']['rm_email'];
                            bcc = config.environment.notification_email;
                        }
                        objModelEmail.send('customercare@policyboss.com', to, sub, res_report, cc, bcc, '');
                    }
                    return res.json(lead_res);
                });
            }
        } catch (err) {
            lead_res['Data_Exception'].push({
                'msg': err.stack
            });
            res.json(lead_res);
        }
    });
    app.get('/sync_contacts/synced_data_behaviour', function (req, res, next) {
        try {
            //let arr_channel = ['ALL', 'PBS', 'RBS', 'DC', 'GS', 'SM', 'EM', 'LA'];
            let arr_channel = [
                'ALL',
                "CC-AUTO",
                "DC",
                "DC-NP",
                "EM",
                "GS",
                "GS-NP",
                "LA",
                "PBS",
                "RBS",
                "SG",
                "SM",
                'RURBAN'
            ];
            let Condi_Sync_Contanct_Lead = {
                'Is_Customer_Data': {$exists: false}
            };
            let cache = (req.query.hasOwnProperty('cache') && req.query['cache'] !== '') ? req.query['cache'] : 'yes';
            let cache_key = 'sync_contact_data_behavour';
            if (cache === 'yes') {
                if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
                    var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
                    var obj_cache_content = JSON.parse(cache_content);
                    return res.json(obj_cache_content);
                } else {
                    return res.json({});
                }
            } else {
                let obj_response = {
                    'Exception': []
                };
                for (let channel of arr_channel) {
                    obj_response[channel] = {
                        'make': {},
                        'state': {},
                        'yom': {},
                        'expiry_month': {}
                    };
                    for (let m = 0; m <= 11; m++) {
                        let curr_month = moment().add(m, 'months').format('MMMM');
                        obj_response[channel]['expiry_month'][curr_month] = 0;
                    }
                }
                sync_contact_erp_data.find(Condi_Sync_Contanct_Lead).exec(function (err, dbSyncDatas) {
                    if (err) {
                        return res.send(err);
                    }
                    if (dbSyncDatas && dbSyncDatas.length > 0) {
                        for (let k in dbSyncDatas) {
                            let SyncData = dbSyncDatas[k]._doc;
                            try {
                                let expiry_month = (SyncData['policy_expiry_date'] !== '') ? moment(SyncData['policy_expiry_date']).format('MMMM') : '';
                                SyncData['expiry_month'] = expiry_month;
                                SyncData['state'] = SyncData['rto_state'];
                                for (let j of Object.keys(obj_response['ALL'])) {
                                    if (SyncData.hasOwnProperty(j) && SyncData[j] !== null && SyncData[j] !== '') {
                                        let data_val = SyncData[j];
                                        if (obj_response['ALL'][j].hasOwnProperty(data_val) === false) {
                                            obj_response['ALL'][j][data_val] = 0;
                                        }
                                        obj_response['ALL'][j][data_val]++;
                                    }
                                }
                                let channel = SyncData['channel'];
                                if (obj_response.hasOwnProperty(channel)) {
                                    for (let j of Object.keys(obj_response[channel])) {
                                        if (SyncData.hasOwnProperty(j) && SyncData[j] !== null && SyncData[j] !== '') {
                                            let data_val = SyncData[j];
                                            if (obj_response[channel][j].hasOwnProperty(data_val) === false) {
                                                obj_response[channel][j][data_val] = 0;
                                            }
                                            obj_response[channel][j][data_val]++;
                                        }
                                    }
                                }
                            } catch (e) {
                                let obj_err = {
                                    'type': 'loop',
                                    'id': SyncData['erp_qt'],
                                    'err': e.stack
                                };
                                obj_response['Exception'].push(obj_err);
								console.error('Exception','synced_data_behaviour','loop',obj_err);
                            }
                        }
                        for (let x of arr_channel) {
                            obj_response[x]['make'] = sortObjectByVal(obj_response[x]['make']);
                            obj_response[x]['state'] = sortObjectByVal(obj_response[x]['state']);
                        }
                        fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(obj_response), function (err) {});
                        res.json(obj_response);
                    }
                });
            }
        } catch (e) {
            let obj_response = {
                'type': 'main',
                'err': e.stack
            }
			console.error('Exception','synced_data_behaviour','main',obj_response);
            return res.json(obj_response);
        }
    });
	app.get('/sync_contacts/sync_contact_call_histories/summary', function (req, res, next) {
        try {
            let arr_call_summary = [];
            let arr_Cond = [
				{ $match: {callDuration :{$gt:0},callType:{$in:['INCOMING','OUTGOING']}}},
				{
					$group: {
						_id: { ss_ids: "$ss_id", callTypes: "$callType" },
						num: { $sum :1 }
					}
				},
				{
					$group: {
						_id: "$_id.ss_ids",
						callTypesCounts: { $push: { CallTypeDescription: "$_id.callTypes",count: "$num" } }
					}
				},
				{
					$project: {
						_id: 1,
						callTypesCounts:1,
						"totalCallTypesOfSSId": {
							"$sum": "$callTypesCounts.count"
						}
					}
				}
			];
			let Sync_Contact_Call_History = require('../models/sync_contact_call_history');
            Sync_Contact_Call_History.aggregate(arr_Cond).exec(function (err, dbSyncCallHistories) {
				try{
					let objTotal = {
						'SS_ID' : 'Total(Count:'+dbSyncCallHistories.length+')',
						'IncomingCallCount' : 0,
						'OutgoingCallCount' : 0,
						'CallCount' : 0
					}
					for (let k in dbSyncCallHistories) {
						let indCallTypeObj = {
							'INCOMING' : 0,
							'OUTGOING' : 0
						};
						for(let j in dbSyncCallHistories[k]['callTypesCounts']){
								indCallTypeObj[dbSyncCallHistories[k]['callTypesCounts'][j]['CallTypeDescription']] = dbSyncCallHistories[k]['callTypesCounts'][j]['count'];
						}
						arr_call_summary.push({
							'SS_ID' : dbSyncCallHistories[k]['_id'],
							'IncomingCallCount' : indCallTypeObj['INCOMING'],
							'OutgoingCallCount' : indCallTypeObj['OUTGOING'],
							'CallCount' : dbSyncCallHistories[k]['totalCallTypesOfSSId']
						});
						objTotal['IncomingCallCount'] += indCallTypeObj['INCOMING'];
						objTotal['OutgoingCallCount'] += indCallTypeObj['OUTGOING'];
						objTotal['CallCount'] += dbSyncCallHistories[k]['totalCallTypesOfSSId'];
					}
					arr_call_summary.push(objTotal);
					
					let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
					res_report += '<p><h1>CONTACT ERP SYNC CALL HISTORY</h1></p>';
					res_report += arrayobjectToHtml(arr_call_summary, 'CALL HISTORY SUMMARY', '', []);
					res_report += '</p>';
					res_report += '</body></html>';
					res.send(res_report);
				}
				catch(e){
					res.send(e.stack);
				}
			});
		}
		catch(e){
			
		}
	});
	app.get('/sync_contacts/sms_logs/summary', function (req, res, next) {
        try {
            let arr_call_summary = [];
            let arr_Cond = [
{$match :{ 'Type' : {$in:["METHOD_SYNC_PURCHASE_MSG","ONLINE_RENEWAL","OTP_SMS_Link","PGDROP","POLBOS-PROTECT-ME-WELL","POLBOS-SCHEDULER","PROPOSAL_ACK_MSG",
    "PROPOSAL_LINK_SENT",
    "Site_Link",
    "Transaction_Fail",
    "Transaction_Success"
]}}},
    {$group: {
        _id: { 'MonthYear' : {$substr: ['$Created_On', 0, 7]},'Type':'$Type'},        
        'numberofSms': {$sum: 1}
    }},
    {$sort:{"_id.MonthYear":1}}
];
			let Sms_Log = require('../models/sms_log');
            Sms_Log.aggregate(arr_Cond).exec(function (err, dbSms_Logs) {
				try{
					let arr_type = ["METHOD_SYNC_PURCHASE_MSG","ONLINE_RENEWAL","OTP_SMS_Link","PGDROP","POLBOS-PROTECT-ME-WELL","POLBOS-SCHEDULER","PROPOSAL_ACK_MSG",
    "PROPOSAL_LINK_SENT",
    "Site_Link",
    "Transaction_Fail",
    "Transaction_Success"
];	
					let arr_sms_summary = [];
					let obj_sms_summary = {};
					for (let k in dbSms_Logs) {
						let obj_sms_log = {};
						if(obj_sms_summary.hasOwnProperty(dbSms_Logs[k]['_id']['MonthYear']) === false){
							obj_sms_summary[dbSms_Logs[k]['_id']['MonthYear']] = {
								'MonthYear' : dbSms_Logs[k]['_id']['MonthYear']
							};
							for(let j of arr_type){
								obj_sms_summary[dbSms_Logs[k]['_id']['MonthYear']][j] = 0;
							}
						}
						obj_sms_summary[dbSms_Logs[k]['_id']['MonthYear']][dbSms_Logs[k]['_id']['Type']] = dbSms_Logs[k]['numberofSms'];
					}
					for(let j in obj_sms_summary){
						arr_sms_summary.push(obj_sms_summary[j]);
					}
					let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
					res_report += '<p><h1>SMS SUMMARY</h1></p>';
					res_report += arrayobjectToHtml(arr_sms_summary, 'SMS SUMMARY', '', []);
					res_report += '</p>';
					res_report += '</body></html>';
					res.send(res_report);
				}
				catch(e){
					res.send(e.stack);
				}
			});
		}
		catch(e){
			
		}
	});
    app.get('/sync_contacts/data_count', function (req, res, next) {
        try {
			let obj_Agent_Master = {};
            let arr_agent_summary = {};
            let arr_Cond = [
                {"$match": {}},
                {$group: {
                        _id: {'ss_id': "$ss_id", 'fba_id': "$fba_id", 'channel': "$channel"},
                        contact: {$sum: 1},
                        sync: {$sum: "$Is_Synced"},
                        found: {$sum: "$Is_Found"},
                        rsa_visited: {$sum: "$is_rsa_visited"},
                        rsa_issued: {$sum: "$is_rsa_issued"},
						'first_synced_on' : {$first : "$Created_On"},
						'last_synced_on' : {$last : "$Created_On"}
                    }},
                {$project: {_id: 0, ss_id: '$_id.ss_id', fba_id: '$_id.fba_id', channel: '$_id.channel', contact: 1, sync: 1, found: 1, rsa_visited: 1, rsa_issued: 1,first_synced_on:1,last_synced_on:1}},
                {$sort: {'contact': -1}}
            ];
			let call_hist_cond = [
	{"$match": {'callType':{"$ne":'MISSED'}}},
	{"$group": {
			_id: {"Ss_Id": "$ss_id"},                       
			"Call_Count": {$sum: 1}
		}},
	{"$project": {_id: 0, "Ss_Id": "$_id.Ss_Id", "Call_Count": 1}},
	{"$sort": {'Call_Count': -1}}
];
			var sync_contact_call_history = require('../models/sync_contact_call_history');
			//sync_contact_call_history.aggregate(call_hist_cond).exec(function (err, dbSyncsHist) {
				var Agent = require('../models/agent');
				Agent.find({}).exec(function (err, dbAgentList) {
					for(let i in dbAgentList){
						let ind_agent = dbAgentList[i]._doc;
						obj_Agent_Master['SSID_'+ind_agent['Ss_Id']] = ind_agent;
					}
					
					let obj_agent_call = {};
					/*
					for (let k in dbSyncsHist) {
						obj_agent_call[dbSyncsHist[k]['Ss_Id']] = dbSyncsHist[k]['Call_Count']; 
					}*/
					
					Sync_Contact.aggregate(arr_Cond).exec(function (err, dbSyncs) {
						for (let k in dbSyncs) {
							let sync = dbSyncs[k]['sync'] || 0;
							let found = dbSyncs[k]['found'] || 0;
							let first_synced_on = moment(dbSyncs[k]['first_synced_on']).utcOffset("+05:30").format('YYYYMMDD') - 0 ;
							let last_synced_on = moment(dbSyncs[k]['last_synced_on']).utcOffset("+05:30").format('YYYYMMDD') - 0;
							let is_resync = (last_synced_on > first_synced_on) ? 1 : 0;
							arr_agent_summary[dbSyncs[k]['ss_id']] = {
								'Name' : 'NA',
								'City' : 'NA',
								'State' : 'NA',
								'Branch' : 'NA',
								'Type' : 'NA',							
								'Channel': dbSyncs[k]['channel'] || 'NA',
								'RM' : 'NA',
								'RM_UID' : 'NA',
								'RM_REPORT_TO' : 'NA',
								'RM_REPORT_UID' : 'NA',																
								'ss_id': dbSyncs[k]['ss_id'] || 0,
								'fba_id': dbSyncs[k]['fba_id'] || 0,
								'erp_id' : 	dbSyncs[k]['erp_id'] || 0,						
								'contact': dbSyncs[k]['contact'],
								'first_synced_on' : dbSyncs[k]['first_synced_on'],
								'last_synced_on' : dbSyncs[k]['last_synced_on'],
								'is_resync' : is_resync,
								'sync': dbSyncs[k]['sync'] || 0,
								'found': dbSyncs[k]['found'] || 0,
								'valid': 0,
								'lead': 0,
								'sale': 0,
								'found_rate': (sync > 0) ? Math.round((found / sync) * 100) : 0,
								'lead_bal': 0,
								'rsa_visited': dbSyncs[k]['rsa_visited'] || 0,
								'rsa_issued': dbSyncs[k]['rsa_issued'] || 0,
								'call_count' : obj_agent_call[dbSyncs[k]['ss_id']] || 0,
								'Jan_Lead' : 0,
								'Feb_Lead' : 0,
								'Mar_Lead' : 0,
								'Apr_Lead' : 0,
								'May_Lead' : 0,
								'Jun_Lead' : 0,
								'Jul_Lead' : 0,
								'Aug_Lead' : 0,
								'Sep_Lead' : 0,
								'Oct_Lead' : 0,								
								'Nov_Lead' : 0,
								'Dec_Lead' : 0
							};
							if(obj_Agent_Master.hasOwnProperty('SSID_'+dbSyncs[k]['ss_id'])){
								arr_agent_summary[dbSyncs[k]['ss_id']]['erp_id'] = obj_Agent_Master['SSID_'+dbSyncs[k]['ss_id']]['Erp_Id'];
								arr_agent_summary[dbSyncs[k]['ss_id']]['Name'] = obj_Agent_Master['SSID_'+dbSyncs[k]['ss_id']]['Name'].trim().toUpperCase();
								arr_agent_summary[dbSyncs[k]['ss_id']]['City'] = obj_Agent_Master['SSID_'+dbSyncs[k]['ss_id']]['City'].trim().toUpperCase();
								arr_agent_summary[dbSyncs[k]['ss_id']]['State'] = obj_Agent_Master['SSID_'+dbSyncs[k]['ss_id']]['State'].trim().toUpperCase();
								arr_agent_summary[dbSyncs[k]['ss_id']]['Branch'] = obj_Agent_Master['SSID_'+dbSyncs[k]['ss_id']]['Branch'].trim().toUpperCase();
								arr_agent_summary[dbSyncs[k]['ss_id']]['Channel'] = obj_Agent_Master['SSID_'+dbSyncs[k]['ss_id']]['Channel'];
								arr_agent_summary[dbSyncs[k]['ss_id']]['Type'] = obj_Agent_Master['SSID_'+dbSyncs[k]['ss_id']]['Type'];
								arr_agent_summary[dbSyncs[k]['ss_id']]['RM'] = obj_Agent_Master['SSID_'+dbSyncs[k]['ss_id']]['RM_Name'].trim().toUpperCase();
								arr_agent_summary[dbSyncs[k]['ss_id']]['RM_UID'] = obj_Agent_Master['SSID_'+dbSyncs[k]['ss_id']]['RM_UID'];
								arr_agent_summary[dbSyncs[k]['ss_id']]['RM_REPORT_TO'] = obj_Agent_Master['SSID_'+dbSyncs[k]['ss_id']]['RM_Reporting_Name'].trim().toUpperCase();
								arr_agent_summary[dbSyncs[k]['ss_id']]['RM_REPORT_UID'] = obj_Agent_Master['SSID_'+dbSyncs[k]['ss_id']]['RM_Reporting_UID'];
							}
						}
						arr_Cond = [
							{"$match": {}},
							{$group: {
									_id: {'ss_id': "$ss_id"},
									valid: {$sum: "$Is_Valid"},
									lead: {$sum: "$Is_Lead_Created"},
									sale: {$sum: "$Is_Sale"},
									'Jan_Lead' : {$sum: { $cond: {if: {$eq: ["$policy_expiry_month","Jan"]},then: 1,else: 0}}},
									'Feb_Lead' : {$sum: { $cond: {if: {$eq: ["$policy_expiry_month","Feb"]},then: 1,else: 0}}},
									'Mar_Lead' : {$sum: { $cond: {if: {$eq: ["$policy_expiry_month","Mar"]},then: 1,else: 0}}},
									'Apr_Lead' : {$sum: { $cond: {if: {$eq: ["$policy_expiry_month","Apr"]},then: 1,else: 0}}},
									'May_Lead' : {$sum: { $cond: {if: {$eq: ["$policy_expiry_month","May"]},then: 1,else: 0}}},
									'Jun_Lead' : {$sum: { $cond: {if: {$eq: ["$policy_expiry_month","Jun"]},then: 1,else: 0}}},
									'Jul_Lead' : {$sum: { $cond: {if: {$eq: ["$policy_expiry_month","Jul"]},then: 1,else: 0}}},
									'Aug_Lead' : {$sum: { $cond: {if: {$eq: ["$policy_expiry_month","Aug"]},then: 1,else: 0}}},
									'Sep_Lead' : {$sum: { $cond: {if: {$eq: ["$policy_expiry_month","Sep"]},then: 1,else: 0}}},
									'Oct_Lead' : {$sum: { $cond: {if: {$eq: ["$policy_expiry_month","Oct"]},then: 1,else: 0}}},
									'Nov_Lead' : {$sum: { $cond: {if: {$eq: ["$policy_expiry_month","Nov"]},then: 1,else: 0}}},
									'Dec_Lead' : {$sum: { $cond: {if: {$eq: ["$policy_expiry_month","Dec"]},then: 1,else: 0}}}
								}},
							{$project: {_id: 0, ss_id: '$_id.ss_id', valid: 1, lead: 1, sale: 1,
							'Jan_Lead' : 1,
'Feb_Lead' : 1,
'Mar_Lead' : 1,
'Apr_Lead' : 1,
'May_Lead' : 1,
'Jun_Lead' : 1,
'Jul_Lead' : 1,
'Aug_Lead' : 1,
'Sep_Lead' : 1,
'Oct_Lead' : 1,
'Nov_Lead' : 1,
'Dec_Lead' : 1
							}},
							{$sort: {'valid': -1}}
						];
						sync_contact_erp_data.aggregate(arr_Cond).exec(function (err, dbSyncDatas) {
							let arr_agent_summary_final = [];
							for (let k in dbSyncDatas) {
								//arr_agent_summary[dbSyncDatas[k]['ss_id']]['found'] = dbSyncDatas[k]['found'] || 0;
								arr_agent_summary[dbSyncDatas[k]['ss_id']]['valid'] = dbSyncDatas[k]['valid'] || 0;
								arr_agent_summary[dbSyncDatas[k]['ss_id']]['lead'] = dbSyncDatas[k]['lead'] || 0;
								arr_agent_summary[dbSyncDatas[k]['ss_id']]['sale'] = dbSyncDatas[k]['sale'] || 0;
								for(let x in dbSyncDatas[k]){
									if(x.indexOf('_Lead') > -1 && dbSyncDatas[k][x] > 0){
										arr_agent_summary[dbSyncDatas[k]['ss_id']][x] = dbSyncDatas[k][x];
									}
								}								
								let dataval = dbSyncDatas[k]['valid'] || 0;
								let lead = dbSyncDatas[k]['lead'] || 0;
								let data_bal = dataval - lead;
								let lead_bal = 0;
								if (arr_agent_summary[dbSyncDatas[k]['ss_id']]['channel'] === 'PBS') {
									lead_bal = data_bal;
								} else {
									if (data_bal > const_free_lead) {
										lead_bal = const_free_lead - lead;
									} else {
										lead_bal = data_bal;
									}
								}
								arr_agent_summary[dbSyncDatas[k]['ss_id']]['lead_bal'] = lead_bal;
							}
							arr_agent_summary_final = Object.values(arr_agent_summary);
							if (req.query['sync_summary'] === 'yes') {
								var Sync_Contact_Summary = require('../models/sync_contact_summary');
								Sync_Contact_Summary.remove({}, function (err, DbSync_Contact_Summary) {
									Sync_Contact_Summary.insertMany(arr_agent_summary_final, function (err, DbSync_Contact_Summary) {
										console.error('DBG', 'DbSync_Contact_Summary', 'save', err);
										res.send('sync_done');
									});
								});
							} else {
								let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
								res_report += '<p><h1>CONTACT ERP SYNC REPORT</h1></p>';
								res_report += arrayobjectToHtml(arr_agent_summary_final, 'Contact Report', '', []);
								res_report += '</p>';
								res_report += '</body></html>';
								res.send(res_report);
							}
						});
					});
				});
			//});
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.get('/sync_contacts/web_sync_contact_dashboard/:session_id', web_agent_details_pre, function (req, res, next) {
        try {
            var Lead = require('../models/leads');
            var _ = require("underscore");
            var session_id = req.params['session_id'];
            var Session = require('../models/session');
            var Ss_Id = req.ss_id;
            var Fba_Id = req.fba_id;
            var obj_session;
            Session.findOne({ "_id": session_id }, function (err, dbSession) {
                if (err) {
                    res.send(err);
                } else {
                    if (dbSession) {
                        dbSession = dbSession._doc;
                        if(dbSession && dbSession.session){
                            obj_session = JSON.parse(dbSession['session']);
                    	}
                        Ss_Id = obj_session.user && obj_session.user.ss_id ? obj_session.user.ss_id - 0 : Ss_Id;
                        Fba_Id = obj_session.user && obj_session.user.fba_id ? obj_session.user.fba_id - 0 : Fba_Id;
                    }
                    Sync_Contact.find({ ss_id: Ss_Id, fba_id: Fba_Id }, function (err, dbSync_Contacts) {
                        let objAgent = {
                            'Name': "",
                            "Mobile": ""
                        };
                        if (req.hasOwnProperty('agent')) {
                            if (req.agent['user_type'] === 'POSP') {
                                objAgent['Name'] = req.agent['POSP']['First_Name'] + ' ' + req.agent['POSP']['First_Name'];
                            } else {
                                objAgent['Name'] = req.agent['EMP']['Emp_Name'];
                            }
                        }

                        var contact_res = {
                            "Profile": objAgent,
                            "Total_Contact_Count": 0,
                            "LandMark_Count": 0,
                            "Landmark_Policy_Count": 0,
                            "Sync_Count": 0,
                            "Lead_Count": 0,
                            "Month_Count": {},
                            "Data_Exception": [],
                            "Data_Inner_Exception": []
                        };
                        for (var m = 0; m <= 11; m++) {
                            var curr_month = moment().add(m, 'months').format('MMMM YYYY');
                            contact_res['Month_Count'][curr_month] = {
                                "count": 0,
                                "data": [],
                                "lead_count": 0,
                                "lead_list": []
                            };
                        }
                        var landmark_count = 0;
                        if (dbSync_Contacts.length > 0) {
                            contact_res['Total_Contact_Count'] = dbSync_Contacts.length;
                            for (let x in dbSync_Contacts) {
                                if (dbSync_Contacts[x]._doc.hasOwnProperty('erp_core_response') && dbSync_Contacts[x]._doc['erp_core_response'] !== '') {
                                    landmark_count++;
                                }
                            }
                            sync_contact_erp_data.find({ ss_id: Ss_Id, fba_id: Fba_Id, 'product': 'MOTOR', 'Is_Valid': 1 }).sort({ 'policy_expiry_date': 1 }).exec(function (err, dbSync_contact_erp_datas) {
                                let data = dbSync_contact_erp_datas;
                                var sync_count = 0;
                                var lead_count = 0;
                                Lead.find({ ss_id: Ss_Id, lead_type: 'sync_contacts' }, function (lead_err, db_lead_data) {
                                    // Add dispostion for leads collection start
                                    if (lead_err) {
                                        console.error({ "Msg": lead_err, "Status": "find lead data" });
                                    } else {
                                        let temp_db_lead_data = db_lead_data;
                                        let db_lead_Arr = [];
                                        for (var i in temp_db_lead_data) {
                                            db_lead_Arr.push(temp_db_lead_data[i]['_doc']);
                                        }
                                        // Add dispostion for leads collection end
                                        for (let i in data) {
                                            let sync_contact_date = data[i]['_doc'];
                                            let ErpqtRqst = sync_contact_date;
                                            try {
                                                if (ErpqtRqst['Is_Lead_Created'] === 1) {
                                                    lead_count++;
                                                }
                                                if (ErpqtRqst.hasOwnProperty('product') && ErpqtRqst['product'] === 'MOTOR' && ErpqtRqst.hasOwnProperty('policy_expiry_date') && ErpqtRqst['policy_expiry_date'] !== '') {
                                                    let t_date = moment(ErpqtRqst['policy_expiry_date'], 'YYYY-MM-DD', true);
                                                    if (t_date.isValid() === true) {
                                                        let policy_expiry_month = moment(ErpqtRqst['policy_expiry_date']).format('MMMM') + ' ';
                                                        //for year
                                                        let mon = moment(ErpqtRqst['policy_expiry_date']).format('M') - 0;
                                                        let cur_mon = moment().format('M') - 0;
                                                        let yr = moment().format('YYYY');
                                                        if (mon < cur_mon) {
                                                            yr = (yr - 0) + 1;
                                                        }
                                                        let arr_exp = ErpqtRqst['policy_expiry_date'].split('-');
                                                        arr_exp[0] = yr;
                                                        ErpqtRqst['policy_expiry_date'] = arr_exp.join('-');
                                                        policy_expiry_month += yr;
                                                        //for year
                                                        let is_lead_visible_allowed = false;
                                                        if (contact_res['Month_Count'].hasOwnProperty(policy_expiry_month)) {
                                                            sync_count++;
                                                            contact_res['Month_Count'][policy_expiry_month]['count']++;
                                                            //contact_res['Month_Count'][policy_expiry_month]['data'].push(ErpqtRqst);
                                                            if (ErpqtRqst['Is_Lead_Created'] === 1) {
                                                                contact_res['Month_Count'][policy_expiry_month]['lead_count']++;
                                                                if (req.agent['user_type'] === 'EMP') {
                                                                    if ((cur_mon === mon) || ((cur_mon + 1) === mon)) {
                                                                        is_lead_visible_allowed = true;
                                                                    }
                                                                } else {
                                                                    is_lead_visible_allowed = true;
                                                                }

                                                                if (is_lead_visible_allowed) {
                                                                    // Add dispostion for leads collection start
                                                                    if (db_lead_data && db_lead_data.length > 0) {
                                                                        //let filtered = _.where(db_lead_Arr, { ss_id: ErpqtRqst['ss_id'], ERP_QT: ErpqtRqst['erp_qt'] });
																		//let mobile_data = ErpqtRqst['mobile'];
																		//let filtered = _.where(db_lead_Arr, { ss_id: Ss_Id, Make_Name : ErpqtRqst['make'],lead_type : 'sync_contacts', mobile : (ErpqtRqst['mobile'] -0)});
																		let filtered = _.filter(db_lead_Arr, function (filtered_data) {
                                                                            return (filtered_data.lead_type === 'sync_contacts' && filtered_data.ss_id === Ss_Id && (( filtered_data.ERP_QT === ErpqtRqst['erp_qt']) || (filtered_data.Make_Name === ErpqtRqst['make'] && filtered_data.mobile === (ErpqtRqst['mobile'] -0) && moment(filtered_data.vehicle_manf_date).year() === ErpqtRqst['yom'] -0)));});
                                                                        if (filtered.length > 0) {
                                                                            ErpqtRqst['lead_disposition'] = filtered[0]['lead_disposition'];
                                                                            ErpqtRqst['lead_disposition_assigned_on'] = filtered[0]['lead_disposition_assigned_on'];
                                                                            ErpqtRqst['lead_subdisposition'] = filtered[0]['lead_subdisposition'];
                                                                            ErpqtRqst['lead_ld'] = filtered[0]['Lead_Id'];
                                                                            ErpqtRqst['lead_data'] = filtered[0];
                                                                        }
                                                                    }
                                                                    // Add dispostion for leads collection end
                                                                    contact_res['Month_Count'][policy_expiry_month]['lead_list'].push(ErpqtRqst);
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        contact_res['Data_Inner_Exception'].push({
                                                            'id': ErpqtRqst['Sync_Contact_Erp_Data_Id'],
                                                            'mob': ErpqtRqst['erp_entry'],
                                                            'msg': 'Invalid Expiry Date',
                                                            'data': ErpqtRqst
                                                        });
                                                    }
                                                } else {
                                                    contact_res['Data_Inner_Exception'].push({
                                                        'id': ErpqtRqst['Sync_Contact_Erp_Data_Id'],
                                                        'mob': ErpqtRqst['erp_entry'],
                                                        'msg': 'No Expiry Date',
                                                        'data': ErpqtRqst
                                                    });
                                                }
                                            } catch (e1) {
                                                contact_res['Data_Inner_Exception'].push({
                                                    'id': ErpqtRqst['Sync_Contact_Erp_Data_Id'],
                                                    'mob': sync_contact_date['mobileno'],
                                                    'msg': e1.stack,
                                                    'data': ErpqtRqst
                                                });
                                            }
                                        }
                                        contact_res['Landmark_Policy_Count'] = sync_count;
                                        contact_res['LandMark_Count'] = landmark_count;
                                        contact_res['Sync_Count'] = sync_count;
                                        contact_res['Lead_Count'] = lead_count;
                                        var sync_contact_agreement = require('../models/sync_contact_agreement');
                                        sync_contact_agreement.count({ 'ss_id': Ss_Id }).exec(function (err, dataSyncAgreeCount) {
                                            contact_res['is_tele_support'] = (dataSyncAgreeCount > 0) ? 'yes' : 'no';
                                            res.json(contact_res);
                                        });
                                    }
                                });
                            });
                        } else {
                            res.json(contact_res);
                        }
                    });
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
	app.get('/sync_contacts/sync_contact_dashboard/:ss_id/:fba_id', agent_details_pre, function (req, res, next) {
        var Lead = require('../models/leads');
        var _ = require("underscore");
        var Ss_Id = req.params.ss_id - 0;
        var Fba_Id = req.params.fba_id - 0;
        Sync_Contact.find({ss_id: Ss_Id, fba_id: Fba_Id}, function (err, dbSync_Contacts) {
            let objAgent = {
                'Name': "",
                "Mobile": ""
            };
            if (req.hasOwnProperty('agent')) {
                if (req.agent['user_type'] === 'POSP') {
                    objAgent['Name'] = req.agent['POSP']['First_Name'] + ' ' + req.agent['POSP']['First_Name'];
                } else {
                    objAgent['Name'] = req.agent['EMP']['Emp_Name'];
                }
            }

            var contact_res = {
                "Profile": objAgent,
                "Total_Contact_Count": 0,
                "LandMark_Count": 0,
                "Landmark_Policy_Count": 0,
                "Sync_Count": 0,
                "Lead_Count": 0,
                "Month_Count": {},
                "Data_Exception": [],
                "Data_Inner_Exception": []
            };
            for (var m = 0; m <= 11; m++) {
                var curr_month = moment().add(m, 'months').format('MMMM YYYY');
                contact_res['Month_Count'][curr_month] = {
                    "count": 0,
                    "data": [],
                    "lead_count": 0,
                    "lead_list": []
                };
            }
            var landmark_count = 0;
            if (dbSync_Contacts.length > 0) {
                contact_res['Total_Contact_Count'] = dbSync_Contacts.length;
                for (let x in dbSync_Contacts) {
                    if (dbSync_Contacts[x]._doc.hasOwnProperty('erp_core_response') && dbSync_Contacts[x]._doc['erp_core_response'] !== '') {
                        landmark_count++;
                    }
                }
                sync_contact_erp_data.find({ss_id: Ss_Id, fba_id: Fba_Id, 'product': 'MOTOR', 'Is_Valid': 1}).sort({'policy_expiry_date': 1}).exec(function (err, dbSync_contact_erp_datas) {
                    let data = dbSync_contact_erp_datas;
                    var sync_count = 0;
                    var lead_count = 0;
                    Lead.find({ss_id: Ss_Id, lead_type: 'sync_contacts'}, function (lead_err, db_lead_data) {
                        // Add dispostion for leads collection start
                        if (lead_err) {
                            console.error({"Msg": lead_err, "Status": "find lead data"});
                        } else {
                            let temp_db_lead_data = db_lead_data;
                            let db_lead_Arr = [];
                            for (var i in temp_db_lead_data) {
                                db_lead_Arr.push(temp_db_lead_data[i]['_doc']);
                            }
                            // Add dispostion for leads collection end
                            for (let i in data) {
                                let sync_contact_date = data[i]['_doc'];
                                var ErpqtRqst = sync_contact_date;
                                try {
                                    if (ErpqtRqst['Is_Lead_Created'] === 1) {
                                        lead_count++;
                                    }
                                    if (ErpqtRqst.hasOwnProperty('product') && ErpqtRqst['product'] === 'MOTOR' && ErpqtRqst.hasOwnProperty('policy_expiry_date') && ErpqtRqst['policy_expiry_date'] !== '') {
                                        var t_date = moment(ErpqtRqst['policy_expiry_date'], 'YYYY-MM-DD', true);
                                        if (t_date.isValid() === true) {
                                            var policy_expiry_month = moment(ErpqtRqst['policy_expiry_date']).format('MMMM') + ' ';
                                            //for year
                                            let mon = moment(ErpqtRqst['policy_expiry_date']).format('M') - 0;
                                            let cur_mon = moment().format('M') - 0;
                                            let yr = moment().format('YYYY');
                                            if (mon < cur_mon) {
                                                yr = (yr - 0) + 1;
                                            }
                                            let arr_exp = ErpqtRqst['policy_expiry_date'].split('-');
                                            arr_exp[0] = yr;
                                            ErpqtRqst['policy_expiry_date'] = arr_exp.join('-');
                                            policy_expiry_month += yr;
                                            //for year
                                            let is_lead_visible_allowed = false;
                                            if (contact_res['Month_Count'].hasOwnProperty(policy_expiry_month))
                                            {
                                                sync_count++;
                                                contact_res['Month_Count'][policy_expiry_month]['count']++;
                                                //contact_res['Month_Count'][policy_expiry_month]['data'].push(ErpqtRqst);
                                                if (ErpqtRqst['Is_Lead_Created'] === 1) {
                                                    contact_res['Month_Count'][policy_expiry_month]['lead_count']++;
                                                    if (req.agent['user_type'] === 'EMP') {
                                                        if ((cur_mon === mon) || ((cur_mon + 1) === mon)) {
                                                            is_lead_visible_allowed = true;
                                                        }
                                                    } else {
                                                        is_lead_visible_allowed = true;
                                                    }

                                                    if (is_lead_visible_allowed) {
                                                        // Add dispostion for leads collection start
                                                        if (db_lead_data && db_lead_data.length > 0) {
                                                            let filtered = _.where(db_lead_Arr, {ss_id: ErpqtRqst['ss_id'], ERP_QT: ErpqtRqst['erp_qt']});
                                                            if (filtered.length > 0) {
                                                                ErpqtRqst['lead_disposition'] = filtered[0]['lead_disposition'];
                                                                ErpqtRqst['lead_disposition_assigned_on'] = filtered[0]['lead_disposition_assigned_on'];
                                                                ErpqtRqst['lead_subdisposition'] = filtered[0]['lead_subdisposition'];
                                                                ErpqtRqst['lead_ld'] = filtered[0]['Lead_Id'];
                                                                ErpqtRqst['lead_data'] = filtered[0];
                                                            }
                                                        }
                                                        // Add dispostion for leads collection end
                                                        contact_res['Month_Count'][policy_expiry_month]['lead_list'].push(ErpqtRqst);
                                                    }
                                                }
                                            }
                                        } else {
                                            contact_res['Data_Inner_Exception'].push({
                                                'id': ErpqtRqst['Sync_Contact_Erp_Data_Id'],
                                                'mob': ErpqtRqst['erp_entry'],
                                                'msg': 'Invalid Expiry Date',
                                                'data': ErpqtRqst
                                            });
                                        }
                                    } else {
                                        contact_res['Data_Inner_Exception'].push({
                                            'id': ErpqtRqst['Sync_Contact_Erp_Data_Id'],
                                            'mob': ErpqtRqst['erp_entry'],
                                            'msg': 'No Expiry Date',
                                            'data': ErpqtRqst
                                        });
                                    }
                                } catch (e1) {
                                    contact_res['Data_Inner_Exception'].push({
                                        'id': ErpqtRqst['Sync_Contact_Erp_Data_Id'],
                                        'mob': sync_contact_date['mobileno'],
                                        'msg': e1.stack,
                                        'data': ErpqtRqst
                                    });
                                }
                            }
                            contact_res['Landmark_Policy_Count'] = sync_count;
                            contact_res['LandMark_Count'] = landmark_count;
                            contact_res['Sync_Count'] = sync_count;
                            contact_res['Lead_Count'] = lead_count;
                            var sync_contact_agreement = require('../models/sync_contact_agreement');
                            sync_contact_agreement.count({'ss_id': Ss_Id}).exec(function (err, dataSyncAgreeCount) {
                                contact_res['is_tele_support'] = (dataSyncAgreeCount > 0) ? 'yes' : 'no';
                                res.json(contact_res);
                            });
                        }
                    });
                });
            } else {
                res.json(contact_res);
            }
        });
    });
    app.get('/sync_contacts/sync_contact_dashboard_NIU/:ss_id/:fba_id', agent_details_pre, function (req, res, next) {
        var Ss_Id = req.params.ss_id - 0;
        var Fba_Id = req.params.fba_id - 0;
        Sync_Contact.find({ss_id: Ss_Id, fba_id: Fba_Id}, function (err, dbSync_Contacts) {
            let objAgent = {
                'Name': "",
                "Mobile": ""
            };
            if (req.hasOwnProperty('agent')) {
                if (req.agent['user_type'] === 'POSP') {
                    objAgent['Name'] = req.agent['POSP']['First_Name'] + ' ' + req.agent['POSP']['First_Name'];
                } else {
                    objAgent['Name'] = req.agent['EMP']['Emp_Name'];
                }
            }

            var contact_res = {
                "Profile": objAgent,
                "Total_Contact_Count": 0,
                "LandMark_Count": 0,
                "Landmark_Policy_Count": 0,
                "Sync_Count": 0,
                "Lead_Count": 0,
                "Month_Count": {},
                "Data_Exception": [],
                "Data_Inner_Exception": []
            };
            for (var m = 0; m <= 11; m++) {
                var curr_month = moment().add(m, 'months').format('MMMM YYYY');
                contact_res['Month_Count'][curr_month] = {
                    "count": 0,
                    "data": [],
                    "lead_count": 0,
                    "lead_list": []
                };
            }
            var landmark_count = 0;
            if (dbSync_Contacts.length > 0) {
                contact_res['Total_Contact_Count'] = dbSync_Contacts.length;
                for (let x in dbSync_Contacts) {
                    if (dbSync_Contacts[x]._doc.hasOwnProperty('erp_core_response') && dbSync_Contacts[x]._doc['erp_core_response'] !== '') {
                        landmark_count++;
                    }
                }
                sync_contact_erp_data.find({ss_id: Ss_Id, fba_id: Fba_Id, 'product': 'MOTOR', 'Is_Valid': 1}).sort({'policy_expiry_date': 1}).exec(function (err, dbSync_contact_erp_datas) {
                    let data = dbSync_contact_erp_datas;
                    var sync_count = 0;
                    var lead_count = 0;
                    for (let i in data) {
                        let sync_contact_date = data[i]['_doc'];
                        var ErpqtRqst = sync_contact_date;
                        try {
                            if (ErpqtRqst['Is_Lead_Created'] === 1) {
                                lead_count++;
                            }
                            if (ErpqtRqst.hasOwnProperty('product') && ErpqtRqst['product'] === 'MOTOR' && ErpqtRqst.hasOwnProperty('policy_expiry_date') && ErpqtRqst['policy_expiry_date'] !== '') {
                                var t_date = moment(ErpqtRqst['policy_expiry_date'], 'YYYY-MM-DD', true);
                                if (t_date.isValid() === true) {
                                    var policy_expiry_month = moment(ErpqtRqst['policy_expiry_date']).format('MMMM') + ' ';
                                    //for year
                                    let mon = moment(ErpqtRqst['policy_expiry_date']).format('M') - 0;
                                    let cur_mon = moment().format('M') - 0;
                                    let yr = moment().format('YYYY');
                                    if (mon < cur_mon) {
                                        yr = (yr - 0) + 1;
                                    }
                                    let arr_exp = ErpqtRqst['policy_expiry_date'].split('-');
                                    arr_exp[0] = yr;
                                    ErpqtRqst['policy_expiry_date'] = arr_exp.join('-');
                                    policy_expiry_month += yr;
                                    //for year
                                    let is_lead_visible_allowed = false;
                                    if (contact_res['Month_Count'].hasOwnProperty(policy_expiry_month))
                                    {
                                        sync_count++;
                                        contact_res['Month_Count'][policy_expiry_month]['count']++;
                                        //contact_res['Month_Count'][policy_expiry_month]['data'].push(ErpqtRqst);
                                        if (ErpqtRqst['Is_Lead_Created'] === 1) {
                                            contact_res['Month_Count'][policy_expiry_month]['lead_count']++;
                                            if (req.agent['user_type'] === 'EMP') {
                                                if ((cur_mon === mon) || ((cur_mon + 1) === mon)) {
                                                    is_lead_visible_allowed = true;
                                                }
                                            } else {
                                                is_lead_visible_allowed = true;
                                            }

                                            if (is_lead_visible_allowed) {
                                                contact_res['Month_Count'][policy_expiry_month]['lead_list'].push(ErpqtRqst);
                                            }
                                        }
                                    }
                                } else {
                                    contact_res['Data_Inner_Exception'].push({
                                        'id': ErpqtRqst['Sync_Contact_Erp_Data_Id'],
                                        'mob': ErpqtRqst['erp_entry'],
                                        'msg': 'Invalid Expiry Date',
                                        'data': ErpqtRqst
                                    });
                                }
                            } else {
                                contact_res['Data_Inner_Exception'].push({
                                    'id': ErpqtRqst['Sync_Contact_Erp_Data_Id'],
                                    'mob': ErpqtRqst['erp_entry'],
                                    'msg': 'No Expiry Date',
                                    'data': ErpqtRqst
                                });
                            }
                        } catch (e1) {
                            contact_res['Data_Inner_Exception'].push({
                                'id': ErpqtRqst['Sync_Contact_Erp_Data_Id'],
                                'mob': sync_contact_date['mobileno'],
                                'msg': e1.stack,
                                'data': ErpqtRqst
                            });
                        }
                    }
                    contact_res['Landmark_Policy_Count'] = sync_count;
                    contact_res['LandMark_Count'] = landmark_count;
                    contact_res['Sync_Count'] = sync_count;
                    contact_res['Lead_Count'] = lead_count;
                    var sync_contact_agreement = require('../models/sync_contact_agreement');
                    sync_contact_agreement.count({'ss_id': Ss_Id}).exec(function (err, dataSyncAgreeCount) {
                        contact_res['is_tele_support'] = (dataSyncAgreeCount > 0) ? 'yes' : 'no';
                        res.json(contact_res);
                    });
                });
            } else {
                res.json(contact_res);
            }
        });
    });
    app.get('/sync_contacts/process_date_reg', function (req, res, next) {
        var limit = (req.query.hasOwnProperty('limit')) ? req.query['limit'] - 0 : 1000;
        sync_contact_erp_data.find({'Is_Date_Reg': {$exists: false}}).limit(limit).exec(function (err, dataSync) {
            let obj_sum = {
                'proc': 0,
                'notproc': 0,
                'err': 0,
                'err_list': []
            };
            for (let i in dataSync) {
                let id = dataSync[i]._doc['Sync_Contact_Erp_Data_Id'];
                try {
                    let obj_data = {
                        'Is_Date_Reg': 'no'
                    };
                    let policy_expiry_date = dataSync[i]._doc['policy_expiry_date'];
                    if (typeof policy_expiry_date !== 'undefined' && policy_expiry_date !== null && policy_expiry_date !== '' &&
                            (policy_expiry_date.indexOf('2017') > -1 || policy_expiry_date.indexOf('2018') > -1 || policy_expiry_date.indexOf('2019') > -1)) {
                        let policy_expiry_date_processed = policy_expiry_date.replace('2017', '2020').replace('2018', '2020').replace('2019', '2020');
                        obj_data['policy_expiry_date'] = policy_expiry_date_processed;
                        obj_data['Is_Date_Reg'] = 'yes';
                    }
                    let registration_no = dataSync[i]._doc['registration_no'];
                    if (typeof registration_no !== 'undefined' && registration_no !== null && registration_no !== '' && registration_no !== 'APPLIEDFOR' && registration_no.indexOf('-') === -1) {
                        let registration_no_processed = reg_no_format(registration_no);
                        obj_data['registration_no_processed'] = registration_no_processed;
                        obj_data['Is_Date_Reg'] = 'yes';
                    }
                    if (obj_data['Is_Date_Reg'] === 'yes') {
                        obj_sum['proc']++;
                    } else {
                        obj_sum['notproc']++;
                    }
                    sync_contact_erp_data.update({'Sync_Contact_Erp_Data_Id': id}, {$set: obj_data}, {multi: false}, function (err, numAffected) {

                    });
                } catch (e) {
                    obj_sum['err']++;
                    obj_sum['err_list'].push(id + '--' + e.stack);
                }
            }
            res.send('<pre>' + JSON.stringify(obj_sum, undefined, 2) + '</pre>');
        });
    });
    app.post('/sync_contacts/online_agreement', function (req, res) {
        var online_agreement = require('../models/sync_contact_agreement');
        req.body = JSON.parse(JSON.stringify(req.body));
        var objonline_agreement = new online_agreement();
        for (var key in req.body) {
            objonline_agreement[key] = req.body[key];
        }
        objonline_agreement.Created_On = new Date();
        objonline_agreement.Modified_On = new Date();
        objonline_agreement.save(function (err1) {
            if (err1) {
                res.json({'Status': "Failure", "data": req.body});
            } else {
                res.json({'Status': "Success", "data": req.body});
            }
        });
    });
    app.get('/sync_contacts/get_sync_erp_data/:ss_id/:fba_id/:lead_type?', function (req, res, next) {
        try {
            var Ss_Id = req.params.ss_id - 0;
            var fba_id = req.params.fba_id - 0;
            var lead_type = (req.params.lead_type !== "" && req.params.lead_type !== undefined) ? req.params.lead_type : "";
            var Condition = {
                "ss_id": Ss_Id,
                "fba_id": fba_id
            };
            if (lead_type !== "") {
                Condition["lead_type"] = lead_type;
            }
            var lead = require('../models/leads');
            lead.find(Condition).exec(function (err, dblead) {
                console.log(dblead);
                res.json(dblead);
            });
        } catch (e) {

        }
    });
    app.post('/sync_contacts/get_lead_data', LoadSession, function (req, res, next) {
        try {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: 'ss_id ERP_QT User_Data_Id Modified_On Lead_Id Customer_Name Product_Id mobile policy_expiry_date Created_On Make_Name Model_Name Variant_Name VehicleCity_RTOCode lead_type lead_disposition_assigned_on lead_disposition lead_subdisposition PB_CRN renewal_data.erp_qt lead_assigned_uid lead_assigned_name lead_assigned_ssid lead_assigned_on agent_details',
                sort: {'Lead_Id': -1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            console.error('HorizonLeadList', filter, req.body);
            var ObjRequest = req.body;
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                var arr_ch_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                }
                arr_ch_ssid.push(req.obj_session.user.ss_id);
                channel = req.obj_session.user.role_detail.channel;
                filter['$or'] = [
                    {'channel': channel},
                    {'ss_id': {$in: arr_ch_ssid}}
                ];
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                //filter['ss_id'] = {$in: arr_ssid};
                filter['$or'] = [
                    {'lead_assigned_ssid': {$in: arr_ssid}},
                    {'ss_id': {$in: arr_ssid}}
                ];
            }

            var fromDate = ObjRequest["from_date"] !== undefined ? ObjRequest["from_date"] : "";
            var toDate = ObjRequest["to_date"] !== undefined ? ObjRequest["to_date"] : "";
            if (ObjRequest.lead_type !== "" && ObjRequest.lead_type !== undefined) {
                filter["lead_type"] = ObjRequest.lead_type;
            }
            if (ObjRequest.lead_assigned !== "" && ObjRequest.lead_assigned !== undefined) {
                filter["lead_assigned"] = ObjRequest.lead_assigned;
            }
            if (ObjRequest.lead_disposition !== "" && ObjRequest.lead_disposition !== undefined) {
                filter["lead_disposition"] = ObjRequest.lead_disposition;
                if (filter["lead_disposition"] === 'PENDING') {
                    filter["lead_disposition"] = {$exists: false};
                }
                if (filter["lead_disposition"] === 'DISPOSED') {
                    filter["lead_disposition"] = {$exists: true};
                }
            }
            if (ObjRequest.lead_subdisposition !== "" && ObjRequest.lead_subdisposition !== undefined) {
                filter["lead_subdisposition"] = ObjRequest.lead_subdisposition;
            }
            if (ObjRequest.lead_status !== "" && ObjRequest.lead_status !== undefined) {
                filter["lead_status"] = ObjRequest.lead_status;
            }
            if (ObjRequest.src_ssid !== "" && ObjRequest.src_ssid !== undefined) {
                filter["ss_id"] = ObjRequest.src_ssid - 0;
            }
            if (ObjRequest.name !== "" && ObjRequest.name !== undefined) {
                filter["Customer_Name"] = new RegExp(req.body.name, 'i');
            }
            if (ObjRequest.mobile !== "" && ObjRequest.mobile !== undefined) {
                filter["mobile"] = req.body.mobile - 0;
            }
            if (ObjRequest.src_crn !== "" && ObjRequest.src_crn !== undefined) {
                filter["PB_CRN"] = req.body.src_crn - 0;
            }
            if (ObjRequest.erp_qt !== "" && ObjRequest.erp_qt !== undefined) {
                filter["renewal_data.erp_qt"] = req.body.erp_qt.toString();
            }
            if (fromDate !== "" && toDate !== "") {
                let StartDate = moment(fromDate).utcOffset("+05:30").startOf('Day');
                let EndDate = moment(toDate).utcOffset("+05:30").endOf('Day');
                filter["Modified_On"] = {$gte: StartDate, $lte: EndDate};
            }
            if (typeof req.body['expiry_identifier'] !== 'undefined' && req.body['expiry_identifier'] !== '') {
                let expiry_start = null;
                let expiry_end = null;
                if (req.body['expiry_identifier'] === 'EXPIRED_3') {
                    expiry_start = moment().add(-3, 'days').utcOffset("+05:30").startOf('Day');
                    expiry_end = moment().add(-1, 'days').utcOffset("+05:30").endOf('Day');
                }
                if (req.body['expiry_identifier'] === 'TODAY') {
                    expiry_start = moment().utcOffset("+05:30").startOf('Day');
                    expiry_end = moment().utcOffset("+05:30").endOf('Day');
                }
                if (req.body['expiry_identifier'] === 'TOMORROW') {
                    expiry_start = moment().add(1, 'days').utcOffset("+05:30").startOf('Day');
                    expiry_end = moment().add(1, 'days').utcOffset("+05:30").endOf('Day');
                }
                if (req.body['expiry_identifier'] === 'NEXT_2_7') {
                    expiry_start = moment().add(2, 'days').utcOffset("+05:30").startOf('Day');
                    expiry_end = moment().add(7, 'days').utcOffset("+05:30").endOf('Day');
                }
                if (req.body['expiry_identifier'] === 'NEXT_8_15') {
                    expiry_start = moment().add(8, 'days').utcOffset("+05:30").startOf('Day');
                    expiry_end = moment().add(15, 'days').utcOffset("+05:30").endOf('Day');
                }
                if (req.body['expiry_identifier'] === 'NEXT_16_30') {
                    expiry_start = moment().add(16, 'days').utcOffset("+05:30").startOf('Day');
                    expiry_end = moment().add(30, 'days').utcOffset("+05:30").endOf('Day');
                }
                filter['policy_expiry_date'] = {'$gte': expiry_start.format("YYYY-MM-DD"), '$lte': expiry_end.format("YYYY-MM-DD")};
            }
            var lead = require('../models/leads');
            console.error('HorizonLeadList', filter, req.body);
            lead.paginate(filter, optionPaginate).then(function (user_datas) {
                if (user_datas && user_datas.docs.length > 0) {
                    let arrSsIds = [];
                    let arrMobileNos = [];
                    for (let doc of user_datas.docs) {
                        arrSsIds.push(doc.ss_id);
                        arrMobileNos.push(doc.mobile + "");
                    }
                    console.error({'ss_id': {$in: arrSsIds}, mobileno: {'mobileno': arrMobileNos}});
                    Sync_Contact.find({'ss_id': {'$in': arrSsIds}, 'mobileno': {'$in': arrMobileNos}}, 'ss_id mobileno contact_group').exec(function (err, dbContact) {
                        if (err) {
                            res.json(err);
                        }
                        user_datas['sync_contact'] = dbContact;
                        res.json(user_datas);
                    });
                } else {
                    user_datas['sync_contact'] = [];
                    res.json(user_datas);
                }
            });
        } catch (e) {
            console.error(e);
            res.json({'Msg': 'error', 'Status': 'fail'});
        }
    });

    app.post('/sync_contacts/get_lead_sync_data', LoadSession, function (req, res, next) {
        try {
			var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);

            var optionPaginate = {
                select: 'Sync_Contact_Erp_Data_Id Modified_On erp_qt name product_id mobile policy_expiry_date make model variant rto_id Created_On',
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };

            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);

            }
            var filter = obj_pagination.filter;

            var ObjRequest = req.body;

            filter["ss_id"] = ObjRequest.ss_id - 0;
            filter["fba_id"] = ObjRequest.fba_id - 0;

            var fromDate = ObjRequest["from_date"] !== undefined ? ObjRequest["from_date"] : "";
            var toDate = ObjRequest["to_date"] !== undefined ? ObjRequest["to_date"] : "";

            if (ObjRequest.src_ssid !== "" && ObjRequest.src_ssid !== undefined) {
                filter["ss_id"] = parseInt(ObjRequest.src_ssid);
            }
            if (ObjRequest.name !== "" && ObjRequest.name !== undefined) {
                filter["name"] = new RegExp(req.body.name, 'i');
            }
            if (ObjRequest.mobile !== "" && ObjRequest.mobile !== undefined) {
                filter["mobile"] = req.body.mobile;
            }
            if (ObjRequest.erp_qt !== "" && ObjRequest.erp_qt !== undefined) {
                filter["erp_qt"] = req.body.erp_qt;
            }            
            if (fromDate !== "" && toDate !== "") {
                filter["policy_expiry_date"] = {$gte: fromDate, $lt: toDate};
            }
            var sync_erp_data = require('../models/sync_contact_erp_data');
            console.error('HorizonLeadList', filter, req.body);
            sync_erp_data.paginate(filter, optionPaginate).then(function (user_datas) {
                if (user_datas && user_datas.docs.length > 0) {
                    let arrSsIds = [];
                    let arrMobileNos = [];
                    for (let doc of user_datas.docs) {
                        arrSsIds.push(doc.ss_id);
                        arrMobileNos.push(doc.mobile + "");
                    }
                    console.error({'ss_id': {$in: arrSsIds}, mobileno: {'mobileno': arrMobileNos}});
                    Sync_Contact.find({'ss_id': {'$in': arrSsIds}, 'mobileno': {'$in': arrMobileNos}}, 'ss_id mobileno contact_group').exec(function (err, dbContact) {
                        if (err) {
                            res.json(err);
                        }
                        user_datas['sync_contact'] = dbContact;
                res.json(user_datas);
            });
                } else {
                    user_datas['sync_contact'] = [];
                    res.json(user_datas);
                }
            });
        } catch (e) {
            console.log(e.stack);
            res.json({'Msg': 'error', 'Status': 'fail'});
        }
    });

    app.post('/sync_contacts/save_lead_tele_support', function (req, res) {
        try {
            var lead_tele_support = require('../models/lead_tele_support');
            req.body = JSON.parse(JSON.stringify(req.body));
            var objlead_tele_support = new lead_tele_support();
            for (var key in req.body) {
                objlead_tele_support[key] = req.body[key];
            }
            objlead_tele_support.Created_On = new Date();
            objlead_tele_support.Modified_On = new Date();
            objlead_tele_support.save(function (err1) {
                if (err1) {
                    res.json({'Msg': '', Status: 'Fail'});
                } else {
                    res.json({'Msg': 'Saved Succesfully!!!', Status: 'Success'});
                }
            });
        } catch (errex) {
            res.json({'Msg': 'error', Error_Msg: errex.stack, Status: 'Fail'});
        }
    });
    app.get('/scr/:Short_Code', function (req, res, next) {
        var sync_contact_id = (req.params.hasOwnProperty('Short_Code')) ? req.params['Short_Code'] : "";
        Sync_Contact.find({'Short_Code': sync_contact_id}).limit(1).exec(function (err, dataSync) {
            if (dataSync[0]._doc.hasOwnProperty('is_rsa_issued') && dataSync[0]._doc['is_rsa_issued'] == 1) {
                res.send('Msg : RSA Certificate already issued.');
            } else {
                Sync_Contact.find({'mobileno': dataSync[0]._doc['mobileno'], 'is_rsa_issued': 1}).count().exec(function (err, SyncCount) {
                    if (SyncCount > 0) {
                        res.send('Msg : RSA Certificate already issued.');
                    } else {
                        let obj_res = {
                            'err': 0,
                            'err_list': []
                        };
                        try {
                            let is_rsa_camp = (dataSync[0]._doc.hasOwnProperty('is_rsa_camp_visited')) ? dataSync[0]._doc['is_rsa_camp_visited'] - 0 : 0;
                            let obj_is_rsa_camp = {
                                "is_rsa_camp_visited": is_rsa_camp + 1
                            };
                            let url_click = "";
                            if (config.environment.name === 'Production') {
                                url_click = "https://www.policyboss.com/RSA_Unlocking/index.html?sync_contact_id=" + sync_contact_id;
                            } else {
                                url_click = "http://qa.policyboss.com/RSA_Unlocking/index.html?sync_contact_id=" + sync_contact_id;
                            }
                            Sync_Contact.update({'Short_Code': sync_contact_id}, {$set: obj_is_rsa_camp}, function (err, numAffected) {
                                console.log(err);
                                return res.redirect(url_click);
                            });
                        } catch (e) {
                            obj_res['err']++;
                            obj_res['err_list'].push(e.stack);
                        }
                    }
                });
            }
            //res.send(obj_res);
        });
    });
    app.get('/sync_contacts/rsa', function (req, res, next) {
        var sync_contact_id = (req.query.hasOwnProperty('sync_contact_id')) ? req.query['sync_contact_id'] : "";
        var ipaddress = (req.query.hasOwnProperty('ip_address')) ? req.query['ip_address'] : "0.0.0.0";
        Sync_Contact.find({'Short_Code': sync_contact_id}).limit(1).exec(function (err, dataSync) {
            Sync_Contact.find({'mobileno': dataSync[0]._doc['mobileno'], 'is_rsa_issued': 1}).count().exec(function (err, SyncCount) {
                let obj_res = {
                    'mobileno': 0,
                    'err': 0,
                    'err_list': []
                };
                if (SyncCount > 0) {
                    obj_res['err'] = 3;
                    obj_res['err_list'].push({'Msg': 'RSA Certificate already issued for this mobile number.'});
                } else {
                    if (dataSync[0]._doc.hasOwnProperty('is_rsa_issued') && dataSync[0]._doc['is_rsa_issued'] == 1) {
                        obj_res['err'] = 3;
                        obj_res['err_list'].push({'Msg': 'RSA Certificate already issued for this mobile number.'});
                    } else {
                        try {
                            let mobileno = (dataSync[0]._doc.hasOwnProperty('mobileno')) ? dataSync[0]._doc['mobileno'] - 0 : 0;
                            obj_res['mobileno'] = mobileno;
                            let obj_is_rsa_camp = {
                                "rsa_link_history": []
                            };
                            if (dataSync[0]._doc.hasOwnProperty('rsa_link_history')) {
                                dataSync[0]._doc['rsa_link_history'].push({"ipaddress": ipaddress, "date_time": new Date()});
                                obj_is_rsa_camp['rsa_link_history'] = dataSync[0]._doc['rsa_link_history'];
                            } else {
                                obj_is_rsa_camp['rsa_link_history'].push({"ipaddress": ipaddress, "date_time": new Date()});
                            }

                            Sync_Contact.update({'Short_Code': sync_contact_id}, {$set: obj_is_rsa_camp}, function (err, numAffected) {
                                console.log(err);
                            });
                        } catch (e) {
                            obj_res['err']++;
                            obj_res['err_list'].push(e.stack);
                        }

                    }
                }
                res.send(obj_res);
            });
        });
    });
    app.post('/sync_contacts/rsa_data', function (req, res, next) {
        try {
            let sync_contact_id = (req.body.hasOwnProperty('sync_contact_id')) ? req.body['sync_contact_id'] : "";
            let ipaddress = (req.body.hasOwnProperty('ip_address')) ? req.body['ip_address'] : "0.0.0.0";
            let reg_no = (req.body.hasOwnProperty('reg_no')) ? req.body['reg_no'] : "";
            let name = (req.body.hasOwnProperty('name')) ? req.body['name'] : "";
            let mobile_no = (req.body.hasOwnProperty('mobile_no')) ? req.body['mobile_no'] : "";
            let email = (req.body.hasOwnProperty('email')) ? req.body['email'] : "";
            let state_city = (req.body.hasOwnProperty('state_city')) ? req.body['state_city'] : "";
            var today = moment().utcOffset("+05:30");
            var today_str = moment(today).format("YYYYMMDDHHmmss");
            console.log('today_str - ' + today_str);
            obj_RsaData = {
                "sync_contact_id": sync_contact_id,
                "ipaddress": ipaddress,
                "reg_no": reg_no,
                "name": name,
                "mobile_no": mobile_no,
                "email": email,
                "state_city": state_city,
                "rsa_request": {
                    "TransactionID": today_str,
                    "Token": ((config.environment.name === "Production") ? "globs_$prodvnt" : "globsjks_%qwrwr"),
                    "UserID": ((config.environment.name === "Production") ? "dmluZWV0LmFnZ2Fyd2FsQHJ1cGVlYm9zcy5jb20=" : "Z2F1cmF2LmFyb3JhQGdsb2JhbGFzc3VyZS5jb20="),
                    "Password": ((config.environment.name === "Production") ? "QXNzaXN0QDEyMw==" : "QXNzaXN0QDEyMw=="),
                    "CustomerName": name,
                    "CustomerEmail": email,
                    "MobileNo": mobile_no,
                    "RegistrationNo": reg_no,
                    "State": state_city.split('_')[0].replace(/-/g, ' '),
                    "City": state_city.split('_')[1].replace(/-/g, ' ')
                }
            };
            var args = {
                data: obj_RsaData['rsa_request'],
                headers: {
                    "Content-Type": "application/json"
                }
            };
            console.log(obj_RsaData['rsa_request']);
            //sync_contact_id = sync_contact_id;
            var url_api = '';
            if (config.environment.name === 'Production') {
                url_api = 'https://rsa.globalassure.com/API/RSA/APISaveCertificate';
            } else {
                url_api = 'https://uatrsa.globalassure.com/API/RSA/APISaveCertificate';
            }
            var Client = require('node-rest-client').Client;
            var client = new Client();
            client.post(url_api, args, function (data, response) {
                console.log(data);
                let obj_res = {
                    "rsa_response": {},
                    "rsa_request": obj_RsaData['rsa_request'],
                    "is_rsa_issued": 0
                };
                obj_res['rsa_response'] = data;
                if (data.status === "Success") {
                    var pdf_file_name = "RSA_" + data.CertificateNo + ".pdf";
                    var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    obj_res['is_rsa_issued'] = 1;
                    obj_res['rsa_url'] = pdf_web_path_portal;
                    //obj_res['rsa_url'] = "http://ci.landmarkerp.com/RBServices.svc/GenerateQT?ClientName=" + obj_RsaData['name'] + "&Mobile=" + obj_RsaData['mobile_no'] + "&Email=" + obj_RsaData['email'] + "&RegistrationNo=" + obj_RsaData['reg_no'] + "&ExpiryDate=&RegistrationDate=&YOM=&RegistrationCity=" + obj_RsaData['state_city'].split('_')[1].replace(/-/g, ' ') + "&RegistrationState=" + obj_RsaData['state_city'].split('_')[0].replace(/-/g, ' ') + "&AgentID=&Make=&Model=";
                    Sync_Contact.update({'Short_Code': obj_RsaData['sync_contact_id']}, {$set: obj_res}, function (err, numAffected) {
                        console.log(err);
                    });
                    obj_res['err'] = 0;
                    var binary = new Buffer(data.CertificateFile, 'base64');
                    fs.writeFileSync(pdf_sys_loc_horizon, binary);
                    obj_res['rsa_response']['CertificateFile'] = pdf_web_path_portal;
                    var Email = require('../models/email');
                    var objModelEmail = new Email();
                    var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com - RSA Certificate Number:' + data.CertificateNo;
                    email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of RSA Certificate File.</p>'
                            + '<BR><p>Certificate Number : ' + data.CertificateNo + '</p><BR><p>RSA Certificate File: ' + pdf_web_path_portal + ' </p></body></html>';
                    if (config.environment.name === 'Production') {
                        //objModelEmail.send('noreply@landmarkinsurance.co.in', obj_RsaData['email'], sub, email_body, '', config.environment.notification_email, '');
                    } else {
                        objModelEmail.send('noreply@landmarkinsurance.co.in', obj_RsaData['email'], sub, email_body, '', '', '');
                    }
                } else {
                    Sync_Contact.update({'Short_Code': obj_RsaData['sync_contact_id']}, {$set: obj_res}, function (err, numAffected) {
                        console.log(err);
                    });
                    obj_res['err'] = 1;
                }
                res.send(obj_res);
                ////Sync_Contact.update({'sync_contact_id': sync_contact_id_new}, {$set: obj_is_rsa_camp}, function (err, numAffected) {
                //console.log(data);
                //});
            });
        } catch (e) {
            let obj_res = {
                'err': 1,
                'err_list': e.stack
            };
            res.send(obj_res);
        }

    });
    app.post('/sync_contacts/get_sync_all_data', LoadSession, function (req, res) {
        try {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                //select: 'mobileno name Created_On ss_id fba_id channel sync_date contact_group',
                select: '',
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 20
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            var ObjRequest = req.body;
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.ss_id == 17010) {
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                var arr_ch_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                }
                arr_ch_ssid.push(req.obj_session.user.ss_id);
                channel = req.obj_session.user.role_detail.channel;
                filter['$or'] = [
                    {'channel': channel},
                    {'ss_id': {$in: arr_ch_ssid}}
                ];
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                filter['ss_id'] = {$in: arr_ssid};
            }
            //filter['Is_Found'] = 0;

            if (typeof req.body['Contact_Type'] !== 'undefined' && req.body['Contact_Type'] !== '') {
                if (req.body['Contact_Type'] === 'lead_allocated') {
                    optionPaginate.select = 'sync_Mobile name Created_On ss_id fba_id channel sync_date contact_group';
                    filter['Is_Lead_Created'] = 1;
                    if (typeof ObjRequest.mobile !== 'undefined' && ObjRequest.mobile !== "") {
                        filter["sync_Mobile"] = ObjRequest.mobileno;
                    }
                    console.error('Horizonsync_all_data', filter, req.body);
                    sync_contact_erp_data.paginate(filter, optionPaginate).then(function (user_datas) {
                        res.json(user_datas);
                    });
                } else if (req.body['Contact_Type'] === 'unmatched_contact' || req.body['Contact_Type'] === 'rsa_visited' || req.body['Contact_Type'] === 'rsa_issued') {
                    if (req.body['Contact_Type'] === 'unmatched_contact') {
                        filter['Is_Found'] = 0;
                    }
                    if (req.body['Contact_Type'] === 'rsa_visited') {
                        filter['is_rsa_camp_visited'] = {'$gt': 0};
                    }
                    if (req.body['Contact_Type'] === 'rsa_issued') {
                        filter['is_rsa_issued'] = 1;
                    }
                    if (typeof ObjRequest.mobile !== 'undefined' && ObjRequest.mobile !== "") {
                        filter["mobileno"] = ObjRequest.mobileno;
                    }
                    console.error('Horizonsync_all_data', filter, req.body);
                    Sync_Contact.paginate(filter, optionPaginate).then(function (user_datas) {
                        res.json(user_datas);
                    });
                }
            } else {
                if (typeof ObjRequest.name !== 'undefined' && ObjRequest.name !== "") {
                    filter["name"] = new RegExp(ObjRequest.name, 'i');
                }
				
				if (typeof ObjRequest.Col_Field_Agent_Key !== 'undefined' && ObjRequest.Col_Field_Agent_Key !== "" && typeof ObjRequest.Col_Field_Agent_Val !== 'undefined' && ObjRequest.Col_Field_Agent_Val !== "") {
                    filter[ObjRequest.Col_Field_Agent_Key] = ObjRequest.Col_Field_Agent_Val - 0;
                }
				
				if ((typeof ObjRequest.sync_agent_city !== 'undefined' && ObjRequest.sync_agent_city !== "") ||
				(typeof ObjRequest.sync_agent_state !== 'undefined' && ObjRequest.sync_agent_state !== "")) {
					let arr_agent_ssid_list = [];
					let Sync_Contact_Summary = require('../models/sync_contact_summary');
					let agent_list_cond = {};
					if(ObjRequest.sync_agent_city !== ""){
						agent_list_cond = {'Type':{"$in":['POSP','FOS']},'City': ObjRequest.sync_agent_city};
					}
					else if(ObjRequest.sync_agent_state !== ""){
						agent_list_cond = {'Type':{"$in":['POSP','FOS']},'State': ObjRequest.sync_agent_state};
					}
					Sync_Contact_Summary.distinct('ss_id', agent_list_cond).exec(function (err, arr_Synced_Agent_ssid) {
						arr_Synced_Agent_ssid = arr_Synced_Agent_ssid || [];
						arr_Synced_Agent_ssid = arr_Synced_Agent_ssid.map(Number);
						filter["ss_id"] = { "$in" : arr_Synced_Agent_ssid};
						console.error('Horizonsync_all_data', filter, req.body);
						Sync_Contact.paginate(filter, optionPaginate).then(function (user_datas) {
							user_datas['filter'] = filter;
							res.json(user_datas);
						});
					});                    
                }				
				else{
					console.error('Horizonsync_all_data', filter, req.body);
					Sync_Contact.paginate(filter, optionPaginate).then(function (user_datas) {
						res.json(user_datas);
					});	
				}
            }

        } catch (e) {
            console.error(e.stack);
            res.json({"Msg": "error", 'Details': e.stack});
        }
    });
	app.post('/sync_contacts/hire_me_data_ver1', LoadSession, function (req, res) {
        try {
            var ObjRequest = req.body;
			let Hire_Me_Cond = {};
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || [7606,26,45904,276,134110].indexOf(req.obj_session.user.ss_id) > -1) {
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                var arr_ch_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                }
                arr_ch_ssid.push(req.obj_session.user.ss_id);
                channel = req.obj_session.user.role_detail.channel;
                Hire_Me_Cond['$or'] = [
                    {'channel': channel},
                    {'ss_id': {$in: arr_ch_ssid}}
                ];
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                Hire_Me_Cond['ss_id'] = {$in: arr_ssid};
            }            
            let regx_str = '';
			if (ObjRequest.name !== "") {
				//Hire_Me_Cond["name"] = new RegExp(ObjRequest.name, 'i');
				let arr_name = ObjRequest.name.replace(/\s\s+/g, ' ').split(" ");
				if(ObjRequest.search_type === "search_exact"){
					regx_str = 	ObjRequest.name;					
					Hire_Me_Cond["name"] = new RegExp(regx_str, "gi");
				}
				if(ObjRequest.search_type === "search_any" && arr_name.length > 1){
					regx_str = 	arr_name.join("|");						
					Hire_Me_Cond["name"] = new RegExp(regx_str, "gi");
				}
				if(ObjRequest.search_type === "search_all" && arr_name.length > 1){
					//const regex = new RegExp('^(?=.*\\bjack\\b)(?=.*\\bjames\\b).*$', '');
					regx_str = 	'^(?=.*\\b' + arr_name.join('\\b)(?=.*\\b') + '\\b).*$';
					Hire_Me_Cond["name"] = new RegExp(regx_str, "gi");
				}
				
			}			
			
			if (ObjRequest.sync_agent_city !== "" || ObjRequest.sync_agent_state !== "") {
				let arr_agent_ssid_list = [];
				let Sync_Contact_Summary = require('../models/sync_contact_summary');
				let agent_list_cond = {};
				if(ObjRequest.sync_agent_city !== ""){
					//agent_list_cond = {'Type':{"$in":['POSP','FOS']},'City': ObjRequest.sync_agent_city};
					agent_list_cond = {'City': ObjRequest.sync_agent_city};
				}
				if(ObjRequest.sync_agent_state !== ""){
					//agent_list_cond = {'Type':{"$in":['POSP','FOS']},'State': ObjRequest.sync_agent_state};
					agent_list_cond = {'State': ObjRequest.sync_agent_state};
				}
				let agg_sync_hire = [];
				Sync_Contact_Summary.distinct('ss_id', agent_list_cond).exec(function (err, arr_Synced_Agent_ssid) {
					arr_Synced_Agent_ssid = arr_Synced_Agent_ssid || [];
					arr_Synced_Agent_ssid = arr_Synced_Agent_ssid.map(Number);
					Hire_Me_Cond["ss_id"] = { "$in" : arr_Synced_Agent_ssid};
					agg_sync_hire = [
						{"$match": Hire_Me_Cond},
						{$group: {
								_id: {mobileno: "$mobileno"},
								'Contact_Count' : {$sum: 1},
								'Last_Synced_Contact_Name': {$last: "$name"}
							}},
						{$project: {_id: 0, 
							Last_Synced_Contact_Name : 1,
							Mobile_No: "$_id.mobileno", 
							Contact_Count : 1
							}},
						{$sort: {'Contact_Count': -1}}
					];				
					Sync_Contact.aggregate(agg_sync_hire).exec(function (err, dbSyncHireMeData) {
						res.json({
							'data' : dbSyncHireMeData,
							'filter' : Hire_Me_Cond,
							'regex' : regx_str,
							'err' : err || 'NA'
						});
					});
				});                    
			}				
			else{				
				Sync_Contact.distinct('mobileno', Hire_Me_Cond).exec(function (err, arr_Synced_Contact_Mobile) {
					if(arr_Synced_Contact_Mobile.length > 0){
						agg_sync_hire = [
							{"$match": {"mobileno" : {"$in":arr_Synced_Contact_Mobile}}},
							{$group: {
									_id: {mobileno: "$mobileno"},
									'Contact_Count' : {$sum: 1},
									'Last_Synced_Contact_Name': {$last: "$name"}
								}},
							{$project: {_id: 0, 
								Last_Synced_Contact_Name : 1,
								Mobile_No: "$_id.mobileno", 
								Contact_Count : 1
								}},
							{$sort: {'Contact_Count': -1}}
						];
						Sync_Contact.aggregate(agg_sync_hire).exec(function (err, dbSyncHireMeData) {
							res.json({
								'data' : dbSyncHireMeData,
								'filter' : Hire_Me_Cond,
								'regex' : regx_str,
								'err' : err || 'NA'
							});
						});						
					}
					else{
						res.json({
							'data' : [],
							'filter' : Hire_Me_Cond,
							'regex' : regx_str,
							'err' : err || 'NA'
						});						
					}
					
				});
			}
        } catch (e) {
            console.error(e.stack);
            res.json({"Msg": "error", 'Details': e.stack});
        }
    });
	app.get('/sync_contacts/sync_contact_query_log/get_prefetch_list', LoadSession, function (req, res) {
		let Sync_Contact_Query_Log = require('../models/sync_contact_query_log');
		Sync_Contact_Query_Log.aggregate([
                {$group: { "_id": { Keyword: "$Keyword", Search_Type: "$Search_Type" },
				"Search_On":{$last:"$Created_On"}, 
				"Total_Contact_Count" : {"$sum": 1},
				"Total_Agent_Count" : {"$sum": "$Contact_Count"}
				} },
                {$project: {
                    "_id": 0,
                    "Search_On" : 1,
                    "Keyword" : "$_id.Keyword",
                    "Search_Type" : "$_id.Search_Type",
					"Total_Agent_Count" : 1,
                    "Total_Contact_Count" : 1
                    }},
				{$sort:{"Search_On":-1}}	
            ]).exec(function (err,dbSyncHireMeData) {
			if(dbSyncHireMeData && dbSyncHireMeData.length > 0){
				return res.json(dbSyncHireMeData);
			}
			else{
				return res.json([]);
			}
		});		
	});	
	app.post('/sync_contacts/hire_me_data', LoadSession, function (req, res) {
        try {
            var ObjRequest = req.body;
			let Hire_Me_Cond = {
				'ss_id' : {"$ne":0}
			};
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.ss_id == 17010) {
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                var arr_ch_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                }
                arr_ch_ssid.push(req.obj_session.user.ss_id);
                channel = req.obj_session.user.role_detail.channel;
                Hire_Me_Cond['$or'] = [
                    {'channel': channel},
                    {'ss_id': {$in: arr_ch_ssid}}
                ];
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                Hire_Me_Cond['ss_id'] = {$in: arr_ssid};
            }            
            let regx_str = '';
			if (ObjRequest.name !== "") {
				//Hire_Me_Cond["name"] = new RegExp(ObjRequest.name, 'i');
				let arr_name = ObjRequest.name.replace(/\s\s+/g, ' ').split(" ");
				if(ObjRequest.search_type === "search_exact"){
					regx_str = 	ObjRequest.name;					
					Hire_Me_Cond["name"] = new RegExp(regx_str, "gi");
				}
				if(ObjRequest.search_type === "search_any" && arr_name.length > 1){
					regx_str = 	arr_name.join("|");						
					Hire_Me_Cond["name"] = new RegExp(regx_str, "gi");
				}
				if(ObjRequest.search_type === "search_all" && arr_name.length > 1){
					//const regex = new RegExp('^(?=.*\\bjack\\b)(?=.*\\bjames\\b).*$', '');
					regx_str = 	'^(?=.*\\b' + arr_name.join('\\b)(?=.*\\b') + '\\b).*$';
					Hire_Me_Cond["name"] = new RegExp(regx_str, "gi");
				}
				
			}			
			
			if (ObjRequest.sync_agent_city !== "" || ObjRequest.sync_agent_state !== "") {
				let arr_agent_ssid_list = [];
				let Sync_Contact_Summary = require('../models/sync_contact_summary');
				let agent_list_cond = {};
				if(ObjRequest.sync_agent_city !== ""){
					//agent_list_cond = {'Type':{"$in":['POSP','FOS']},'City': ObjRequest.sync_agent_city};
					agent_list_cond = {'City': ObjRequest.sync_agent_city};
				}
				if(ObjRequest.sync_agent_state !== ""){
					//agent_list_cond = {'Type':{"$in":['POSP','FOS']},'State': ObjRequest.sync_agent_state};
					agent_list_cond = {'State': ObjRequest.sync_agent_state};
				}
				let agg_sync_hire = [];
				Sync_Contact_Summary.distinct('ss_id', agent_list_cond).exec(function (err, arr_Synced_Agent_ssid) {
					arr_Synced_Agent_ssid = arr_Synced_Agent_ssid || [];
					arr_Synced_Agent_ssid = arr_Synced_Agent_ssid.map(Number);
					Hire_Me_Cond["ss_id"] = { "$in" : arr_Synced_Agent_ssid};
					agg_sync_hire = [
						{"$match": Hire_Me_Cond},
						{$group: {
								_id: {mobileno: "$mobileno"},
								'Contact_Count' : {$sum: 1},
								'Last_Synced_Contact_Name': {$last: "$name"}
							}},
						{$project: {_id: 0, 
							Last_Synced_Contact_Name : 1,
							Mobile_No: "$_id.mobileno", 
							Contact_Count : 1
							}},
						{$sort: {'Contact_Count': -1}}
					];				
					Sync_Contact.aggregate(agg_sync_hire).exec(function (err, dbSyncHireMeData) {
						res.json({
							'data' : dbSyncHireMeData,
							'filter' : Hire_Me_Cond,
							'regex' : regx_str,
							'err' : err || 'NA'
						});
					});
				});                    
			}				
			else{
				let Sync_Contact_Query_Log = require('../models/sync_contact_query_log');
				Sync_Contact_Query_Log.find({"Keyword":ObjRequest.name,"Search_Type":ObjRequest.search_type}).select("-_id -Created_On").exec(function (err,dbSyncHireMeData) {
					if(dbSyncHireMeData && dbSyncHireMeData.length > 0){
						return res.json({
							"summary" : {
								"Last_Search_On" : dbSyncHireMeData[0]._doc["Created_On"],
								"Count" : dbSyncHireMeData.length
							},
							'data' : dbSyncHireMeData,
							'status' : "SUCCESS",
							'filter' : Hire_Me_Cond,
							'regex' : regx_str,
							'name' : ObjRequest.name,
							'search_type' : ObjRequest.search_type,
							'err' : err || 'NA'
						});
					}
					else{					
						Sync_Contact.distinct('mobileno', Hire_Me_Cond).exec(function (err, arr_Synced_Contact_Mobile) {
							if(arr_Synced_Contact_Mobile.length > 0){
								agg_sync_hire = [
									{"$match": {"mobileno" : {"$in":arr_Synced_Contact_Mobile}}},
									{$group: {
											_id: {mobileno: "$mobileno"},
											'Contact_Count' : {$sum: 1},
											"Ss_Id_List" : {$addToSet:"$ss_id"},
											'Last_Synced_Contact_Name': {$last: "$name"}
										}},
									{$project: {_id: 0, 
										Last_Synced_Contact_Name : 1,
										Mobile_No: "$_id.mobileno", 
										Contact_Count : 1,
										"Ss_Id_List" : 1
										}},
									{$sort: {'Contact_Count': -1}}
								];
								Sync_Contact.aggregate(agg_sync_hire).exec(function (err, dbSyncHireMeData) {
									if(dbSyncHireMeData && dbSyncHireMeData.length > 0){
										
										for(let k in dbSyncHireMeData){
											dbSyncHireMeData[k]["Keyword"] = ObjRequest.name;
											dbSyncHireMeData[k]["Search_Type"] = ObjRequest.search_type;
											dbSyncHireMeData[k]["Regex_Pattern"] = regx_str;								
											dbSyncHireMeData[k]["Created_On"] = new Date();
										}
										Sync_Contact_Query_Log.insertMany(dbSyncHireMeData, function (err, Db_Sync_Contact_Query_Log) {
											if(!err && Db_Sync_Contact_Query_Log){
												return res.json({
													"summary" : {
														"Last_Search_On" : new Date(),
														"Count" : dbSyncHireMeData.length
													},
													'data' : dbSyncHireMeData,
													'status' : "SUCCESS",
													'filter' : Hire_Me_Cond,
													'regex' : regx_str,
													'name' : ObjRequest.name,
													'search_type' : ObjRequest.search_type,
													'err' : err || 'NA'
												});
											}
											else{
												return res.json({
													'data' : [],	
													'status' : "FAIL",
													'filter' : Hire_Me_Cond,
													'regex' : regx_str,
													'name' : ObjRequest.name,
													'search_type' : ObjRequest.search_type,
													'err' : err || 'NA'
												});
											}
										});
									}
									else{
										return res.json({
											'data' : [],
											'status' : "SUCCESS",
											'filter' : Hire_Me_Cond,
											'regex' : regx_str,
											'name' : ObjRequest.name,
											'search_type' : ObjRequest.search_type,
											'err' : err || 'NA'
										});								
									}	
								});						
							}
							else{
								res.json({
									'data' : [],
									'filter' : Hire_Me_Cond,
									'regex' : regx_str,
									'name' : ObjRequest.name,
									'search_type' : ObjRequest.search_type,
									'err' : err || 'NA'
								});						
							}
							
						});
					}
				});	
			}
        } catch (e) {
            console.error(e.stack);
            res.json({"Msg": "error", 'Details': e.stack});
        }
    });
	app.post('/sync_contacts/sync_contact_query_logs/list', LoadSession, function (req, res) {
        try {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: '',
                sort: {},
                lean: true,
                page: 1,
                limit: 25
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = (req.body['length'] == -1) ? 10000 : parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;			
            var ObjRequest = req.body;
			filter["Keyword"] = ObjRequest['name'];
			filter["Search_Type"] = ObjRequest['search_type'];
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
            
			} else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                var arr_ch_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                }
                arr_ch_ssid.push(req.obj_session.user.ss_id);
                channel = req.obj_session.user.role_detail.channel;
                filter['$or'] = [
                    {'channel': channel},
                    {'ss_id': {$in: arr_ch_ssid}}
                ];
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                filter['ss_id'] = {$in: arr_ssid};
            }
            let Sync_Contact_Query_Log = require('../models/sync_contact_query_log');
            Sync_Contact_Query_Log.paginate(filter, optionPaginate).then(function (Db_Sync_Contact_Query_Logs) {
                return res.json(Db_Sync_Contact_Query_Logs);				
            });
        } catch (e) {
            console.error(e.stack);
            return res.json({"Msg": "error", 'Details': e.stack});
        }
    });
	app.post('/sync_contacts/hire_me_data_agent_list', LoadSession, function (req, res) {
        try {
            var ObjRequest = req.body;
			let Hire_Me_Cond = {};
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.ss_id == 17010) {
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                var arr_ch_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                }
                arr_ch_ssid.push(req.obj_session.user.ss_id);
                channel = req.obj_session.user.role_detail.channel;
                Hire_Me_Cond['$or'] = [
                    {'channel': channel},
                    {'ss_id': {$in: arr_ch_ssid}}
                ];
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                Hire_Me_Cond['ss_id'] = {$in: arr_ssid};
            }            
            let regx_str = '';
			if (ObjRequest.name !== "") {
				let arr_name = ObjRequest.name.replace(/\s\s+/g, ' ').split(" ");
				if(ObjRequest.search_type === "search_exact"){
					regx_str = 	ObjRequest.name;
					Hire_Me_Cond["name"] = new RegExp(regx_str, "gi");	
				}
				if(ObjRequest.search_type === "search_any" && arr_name.length > 1){
					regx_str = 	arr_name.join("|");	
					Hire_Me_Cond["name"] = new RegExp(regx_str, "gi");	
				}
				if(ObjRequest.search_type === "search_all" && arr_name.length > 1){
					//const regex = new RegExp('^(?=.*\\bjack\\b)(?=.*\\bjames\\b).*$', '');
					regx_str = 	'^(?=.*\\b' + arr_name.join('\\b)(?=.*\\b') + '\\b).*$';
					Hire_Me_Cond["name"] = new RegExp(regx_str, '');
				}
				
			}			
			
			if (ObjRequest.sync_agent_city !== "" || ObjRequest.sync_agent_state !== "") {
				let arr_agent_ssid_list = [];
				let Sync_Contact_Summary = require('../models/sync_contact_summary');
				let agent_list_cond = {};
				if(ObjRequest.sync_agent_city !== ""){
					//agent_list_cond = {'Type':{"$in":['POSP','FOS']},'City': ObjRequest.sync_agent_city};
					agent_list_cond = {'City': ObjRequest.sync_agent_city};
				}
				if(ObjRequest.sync_agent_state !== ""){
					//agent_list_cond = {'Type':{"$in":['POSP','FOS']},'State': ObjRequest.sync_agent_state};
					agent_list_cond = {'State': ObjRequest.sync_agent_state};
				}
				let agg_sync_hire = [];
				Sync_Contact_Summary.distinct('ss_id', agent_list_cond).exec(function (err, arr_Synced_Agent_ssid) {
					arr_Synced_Agent_ssid = arr_Synced_Agent_ssid || [];
					arr_Synced_Agent_ssid = arr_Synced_Agent_ssid.map(Number);
					Hire_Me_Cond["ss_id"] = { "$in" : arr_Synced_Agent_ssid};
					agg_sync_hire = [
						{"$match": Hire_Me_Cond},
						{$group: {
								_id: {mobileno: "$mobileno"},
								'Contact_Count' : {$sum: 1},
								'Last_Synced_Contact_Name': {$last: "$name"}
							}},
						{$project: {_id: 0, 
							Last_Synced_Contact_Name : 1,
							Mobile_No: "$_id.mobileno", 
							Contact_Count : 1
							}},
						{$sort: {'Contact_Count': -1}}
					];				
					Sync_Contact.aggregate(agg_sync_hire).exec(function (err, dbSyncHireMeData) {
						res.json({
							'data' : dbSyncHireMeData,
							'filter' : Hire_Me_Cond,
							'regex' : regx_str,
							'err' : err || 'NA'
						});
					});
				});                    
			}				
			else{
				agg_sync_hire = [
					{"$match": Hire_Me_Cond},
					{$group: {
							_id: {mobileno: "$mobileno"},
							'Contact_Count' : {$sum: 1},
							'Last_Synced_Contact_Name': {$last: "$name"}
						}},
					{$project: {_id: 0, 
						Last_Synced_Contact_Name : 1,
						Mobile_No: "$_id.mobileno", 
						Contact_Count : 1
						}},
					{$sort: {'Contact_Count': -1}}
				];				
				Sync_Contact.aggregate(agg_sync_hire).exec(function (err, dbSyncHireMeData) {
					res.json({
						'data' : dbSyncHireMeData,
						'filter' : Hire_Me_Cond,
						'regex' : regx_str,
						'err' : err || 'NA'
					});
				});	
			}
        } catch (e) {
            console.error(e.stack);
            res.json({"Msg": "error", 'Details': e.stack});
        }
    });
	app.get('/sync_contacts/check_agent_sync_status', function (req, res) {
		let ObjRequest = req.query;
		if (typeof ObjRequest.Col_Field_Agent_Key !== 'undefined' && ObjRequest.Col_Field_Agent_Key !== "" && 
		typeof ObjRequest.Col_Field_Agent_Val !== 'undefined' && ObjRequest.Col_Field_Agent_Val !== "") {
			let filter = {};
			filter[ObjRequest.Col_Field_Agent_Key] = ObjRequest.Col_Field_Agent_Val - 0;						
			Sync_Contact.findOne(filter).exec(function (err, dbSync_Contact) {				
				res.json(dbSync_Contact);
			});
		}
		else{
			res.json({});
		}
	});
    app.post('/sync_contacts/agent_summary_list', LoadSession, function (req, res) {
        try {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: '',
                sort: {'last_synced_on': -1},
                lean: true,
                page: 1,
                limit: 25
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = (req.body['length'] == -1) ? 10000 : parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            var ObjRequest = req.body;
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.ss_id == 17010) {
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                var arr_ch_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                }
                arr_ch_ssid.push(req.obj_session.user.ss_id);
                channel = req.obj_session.user.role_detail.channel;
                filter['$or'] = [
                    {'channel': channel},
                    {'ss_id': {$in: arr_ch_ssid}}
                ];
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                filter['ss_id'] = {$in: arr_ssid};
            }
            let Sync_Contact_Summary = require('../models/sync_contact_summary');
            Sync_Contact_Summary.paginate(filter, optionPaginate).then(function (user_datas) {
                res.json(user_datas);				
            });
        } catch (e) {
            console.error(e.stack);
            res.json({"Msg": "error", 'Details': e.stack});
        }
    });
    app.post('/sync_contacts/update_contact_group', function (req, res) {
        try {
            var ss_id = req.body['ss_id'] - 0;
            var mobile = req.body['mobile'].toString();
            var group = req.body['group'];
            if (ss_id > 0 && mobile !== '') {
                Sync_Contact.update({'ss_id': ss_id, 'mobileno': mobile}, {$set: {'contact_group': group}}, function (err, result) {
                    if (err)
                    {
                        res.json({'status': 'ERR', 'details': err});
                    } else {
                        sync_contact_erp_data.update({'ss_id': ss_id, 'mobile': mobile}, {$set: {'contact_group': group}}, {multi: true}, function (err, result) {});
                        res.json({'status': 'SUCCESS', 'details': result});
                    }
                });
            } else {
                res.json({'status': 'ERR', 'details': 'EMPTY_ID'});
            }
        } catch (e) {
            res.json({'status': 'ERR', 'details': e.stack});
        }
    });
    app.post('/sync_contacts/get_sync_match_data', LoadSession, function (req, res) {
        try {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: 'mobile name policy_expiry_date make model erp_qt rto_city registration_no Created_On',
                sort: {'Created_On': 1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            var ObjRequest = req.body;
            filter["ss_id"] = ObjRequest.ss_id - 0;
            filter["fba_id"] = ObjRequest.fba_id - 0;
            filter["Is_Lead_Created"] = 1;
            if (ObjRequest.mobile !== undefined && ObjRequest.mobile !== "") {
                filter["mobile"] = ObjRequest.mobile;
            }
            var sync_contact_erp_data = require('../models/sync_contact_erp_data');
            console.error('Horizonsync_match_data', filter, req.body);
            sync_contact_erp_data.paginate(filter, optionPaginate).then(function (user_datas) {
                //console.error('UserDataSearch', filter, optionPaginate, user_datas);
                res.json(user_datas);
            });
        } catch (e) {
            console.error(e);
            res.json({"Msg": "error"});
        }
    });
    app.post('/sync_contacts/razor_payment_data', LoadSession, function (req, res) {
        try {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: 'mobile name policy_expiry_date make model erp_qt rto_city registration_no Created_On',
                sort: {'Created_On': 1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            var ObjRequest = req.body;
            filter["ss_id"] = ObjRequest.ss_id - 0;
            filter["fba_id"] = ObjRequest.fba_id - 0;
            filter["Is_Lead_Created"] = 1;
            if (ObjRequest.mobile !== undefined && ObjRequest.mobile !== "") {
                filter["mobile"] = ObjRequest.mobile;
            }
            var sync_contact_erp_data = require('../models/sync_contact_erp_data');
            console.error('Horizonsync_match_data', filter, req.body);
            sync_contact_erp_data.paginate(filter, optionPaginate).then(function (user_datas) {
                //console.error('UserDataSearch', filter, optionPaginate, user_datas);
                res.json(user_datas);
            });
        } catch (e) {
            console.error(e);
            res.json({"Msg": "error"});
        }
    });
    app.get('/sync_contacts/get_lead_disposition_data/:lead_id', function (req, res) {
        try {
            var lead_id = parseInt(req.params.lead_id);
            var lead_disposition = require('../models/lead_disposition');
            lead_disposition.find({"Lead_Id": lead_id}, function (err, dblead) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(dblead);
                }
            });
        } catch (e) {

        }
    });
    app.post('/sync_contacts/lead_disposition_save', LoadSession, function (req, res) {
        try {
            var lead_disposition = require('../models/lead_disposition');
            var formidable = require('formidable');
            var form = new formidable.IncomingForm();
            var fs = require('fs');
            form.parse(req, function (err, fields, files) {
                console.error(fields);
                var pdf_web_path = "";
                if (files.hasOwnProperty('disposition_file')) {

                    var pdf_file_name = files['disposition_file'].name;
                    var path = appRoot + "/tmp/disposition/";
                    var pdf_sys_loc_horizon = path + fields["lead_id"] + '/' + pdf_file_name;
                    pdf_web_path = config.environment.downloadurl + "/disposition/" + fields["lead_id"] + '/' + pdf_file_name;
                    var oldpath = files.disposition_file.path;
                    if (fs.existsSync(path + fields["lead_id"]))
                    {

                    } else
                    {
                        fs.mkdirSync(path + fields["lead_id"]);
                    }
                    fs.readFile(oldpath, function (err, data) {
                        if (err) {
                            console.error('Read', err);
                        }
                        console.log('File read!');
                        // Write the file
                        fs.writeFile(pdf_sys_loc_horizon, data, function (err) {
                            if (err) {
                                console.error('Write', err);
                            }
                        });
                        // Delete the file
                        fs.unlink(oldpath, function (err) {
                            if (err)
                                throw err;
                            console.log('File deleted!');
                        });
                    });
                }
                var arg = {
                    Lead_Id: fields["lead_id"],
                    Status: fields["dsp_status"],
                    Sub_Status: fields["dsp_substatus"],
                    Created_On: new Date(),
                    Modified_On: new Date(),
                    Remark: fields["dsp_remarks"],
                    ss_id: req.obj_session.user.ss_id,
                    Is_Latest: 1,
                    fba_id: req.obj_session.user.fba_id,
                    File_Name: pdf_web_path,
                    Lead_Status: fields["Lead_Status"],
                    Customer_Name: fields["Customer_Name"],
                    Customer_Mobile: fields["Customer_Mobile"],
                    Policy_Expiry_Date: fields["Policy_expiry_date"],
                    Next_Call_Date: fields["Next_Call_Date"]
                };
                console.error(arg);
                var dispositionObj = new lead_disposition(arg);
                dispositionObj.save(function (err) {
                    console.error(err);
                    if (err)
                        throw err;
                    res.json({'Msg': 'Success'});
                });
            });
        } catch (e) {
            console.error(e);
            res.json({'Msg': 'Fail'});
        }
    });
    app.post('/sync_contacts/razor_payment_history', LoadSession, function (req, res) {
        try {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: 'Lead_Count Total_Premium Email Mobile Name Transaction_Status Created_On Ss_Id Fba_ID Plan',
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 25
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.uid == '102572') {
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                filter['Ss_Id'] = {$in: arr_ssid};
            }

            if (req.body.Transaction_Status !== undefined && req.body.Transaction_Status !== '') {
                filter["Transaction_Status"] = req.body.Transaction_Status;
            }
            if (req.body.name !== undefined) {
                filter["Name"] = new RegExp(req.body.name, 'i');
            }
			//filter['Source'] = {"$exists":false};
			filter['Source'] = {"$in":[null,""]};
            var razorpay_payment = require('../models/razorpay_payment');
            console.error('Horizonrazorpay_payment', filter, req.body);
            razorpay_payment.paginate(filter, optionPaginate).then(function (razorpay_payment) {
                //console.error('UserDataSearch', filter, optionPaginate, user_datas);
                res.json(razorpay_payment);
            });
        } catch (e) {
            console.error(e);
            res.json({"Msg": "error"});
        }
    });
    function agent_activity_summary_handler(req, res, data) {
        try {
            if (
                    data.sync !== null &&
                    data.obj_sync_analysis_summary !== null
                    ) {
                var obj_final_response = {
                    'obj_sync_summary': {},
                    'obj_sync_analysis_summary': {}
                };
                let dbsyncs = data.sync;
                let obj_sync_summary = {
                    'All': {
                        'Contact': 0,
                        'Channel': {},
                        'Sync_Count': 0,
                        'Found_Count': 0,
                        'Match_Count': 0,
                        'Agent': 0,
                        'Agent_List': [],
                        'Lead_Count': 0,
                        'Sale_Count': 0,
                    },
                    'Range': {
                        'Contact': 0,
                        'Channel': {},
                        'Sync_Count': 0,
                        'Found_Count': 0,
                        'Match_Count': 0,
                        'Agent': 0,
                        'Agent_List': [],
                        'Lead_Count': 0,
                        'Sale_Count': 0
                    }
                };
                obj_sync_summary['All'].Agent = dbsyncs.all.length;
                obj_sync_summary['Range'].Agent = dbsyncs.range.length;
                let SyncType = 'All';
                for (let k in dbsyncs[SyncType.toLowerCase()]) {
                    try {
                        let Sync = dbsyncs[SyncType.toLowerCase()][k]._doc;
                        obj_sync_summary[SyncType].Contact += Sync['contact'];
                        obj_sync_summary[SyncType].Sync_Count += Sync['sync'];
                        obj_sync_summary[SyncType].Found_Count += Sync['found'];
                        obj_sync_summary[SyncType].Match_Count += Sync['valid'];
                        obj_sync_summary[SyncType].Lead_Count += Sync['lead'];
                        obj_sync_summary[SyncType].Sale_Count += Sync['sale'];
                        obj_sync_summary[SyncType].Agent_List.push(Sync);
                        if (obj_sync_summary[SyncType].Channel.hasOwnProperty(Sync['channel']) === false) {
                            obj_sync_summary[SyncType].Channel[Sync['channel']] = {
                                'Channel': Sync['channel'],
                                'Agent': 0,
                                'Contact': 0,
                                'Sync_Contact': 0,
                                'Found_Contact': 0,
                                'Match_Contact': 0,
                                'Lead_Contact': 0,
                                'Sale_Contact': 0
                            };
                        }
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Agent']++;
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Contact'] += Sync['contact'];
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Sync_Contact'] += Sync['sync'];
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Found_Contact'] += Sync['found'];
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Match_Contact'] += Sync['valid'];
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Lead_Contact'] += Sync['lead'];
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Sale_Contact'] += Sync['sale'];
                    } catch (e) {
                    }
                }
                SyncType = 'Range';
                for (let k in dbsyncs[SyncType.toLowerCase()]) {
                    try {
                        let Sync = dbsyncs[SyncType.toLowerCase()][k];
                        obj_sync_summary[SyncType].Contact += Sync['agent_contact_count'] - 0;
                        obj_sync_summary[SyncType].Sync_Count += Sync['sync_contact_count'] - 0;
                        obj_sync_summary[SyncType].Found_Count += Sync['found_contact_count'] - 0;
                        obj_sync_summary[SyncType].Match_Count += Sync['match_contact_count'] - 0;
                        obj_sync_summary[SyncType].Sale_Count += Sync['sale_contact_count'] - 0;
                        obj_sync_summary[SyncType].Agent_List.push(Sync);
                        if (obj_sync_summary[SyncType].Channel.hasOwnProperty(Sync['channel']) === false) {
                            obj_sync_summary[SyncType].Channel[Sync['channel']] = {
                                'Channel': Sync['channel'],
                                'Agent': 0,
                                'Contact': 0,
                                'Sync_Contact': 0,
                                'Found_Contact': 0,
                                'Match_Contact': 0,
                                'Sale_Contact': 0,
                            };
                        }
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Agent']++;
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Contact'] += Sync['agent_contact_count'] - 0;
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Sync_Contact'] += Sync['sync_contact_count'] - 0;
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Found_Contact'] += Sync['found_contact_count'] - 0;
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Match_Contact'] += Sync['match_contact_count'] - 0;
                        obj_sync_summary[SyncType].Channel[Sync['channel']]['Sale_Contact'] += Sync['sale_contact_count'] - 0;
                    } catch (e) {
                    }
                }
                obj_sync_analysis_summary = data.obj_sync_analysis_summary;
                obj_final_response['obj_sync_summary'] = obj_sync_summary;
                obj_final_response['obj_sync_analysis_summary'] = obj_sync_analysis_summary;
                res.json(obj_final_response);
            }
        } catch (e) {
            res.send(e.stack);
        }

    }
    app.get('/sync_contacts/db_dashboard', LoadSession, function (req, res, next) {
//console.log('Start', this.constructor.name, 'quick_report');
        try {
            var today = moment().utcOffset("+05:30").startOf('Day');
            var arrFrom = req.query['datefrom'].split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
            var arrTo = req.query['dateto'].split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);
            var data = {
                'sync': null,
                'obj_sync_analysis_summary': null,
                'exec_time': {},
            };
            var cond_sync = {'ss_id': {$ne: 0}, 'channel': {$ne: null}};
            var arr_ssid = [];
            if (req.obj_session.hasOwnProperty('users_assigned')) {
                var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                arr_ssid = combine_arr.split(',').filter(Number).map(Number);
            }
            arr_ssid.push(req.obj_session.user.ss_id);
            if (req.query.hasOwnProperty('page_action') && req.query['page_action'] != '') {
                if (req.query['page_action'] === 'all_daily') {
                } else if (req.query['page_action'] === 'ch_all_daily') {
                    if (req.query.hasOwnProperty('channel') && req.query['channel'] != '') {
                        channel = req.query['channel'];
                    } else {
                        channel = req.obj_session.user.role_detail.channel;
                    }
                    cond_sync['channel'] = channel;
                } else if (req.query['page_action'] === 'my_daily') {
                    cond_sync['ss_id'] = {$in: arr_ssid};
                }

                let Sync_Contact = require('../models/sync_contact');
                let Sync_Contact_Summary = require('../models/sync_contact_summary');
                console.error('Agent_Summary', 'cond_sync', cond_sync);
                var summary;
                Sync_Contact_Summary.find(cond_sync).exec(function (err, dbSyncContactsAll) {
                    summary = {
                        'all': dbSyncContactsAll,
                        'range': null
                    };
                    let cond_sync_range = cond_sync;
                    cond_sync_range.Created_On = {"$gte": dateFrom, "$lte": dateTo};
                    var sync_agg = [
                        {"$match": cond_sync_range},
                        {$group: {
                                _id: {ss_id: "$ss_id", fba_id: "$fba_id", 'channel': "$channel"},
                                agent_contact_count: {$sum: 1},
                                sync_contact_count: {$sum: "$Is_Synced"},
                                found_contact_count: {$sum: "$Is_Found"},
                                match_contact_count: {$sum: "$valid_count"}
                            }},
                        {$project: {_id: 0, ss_id: "$_id.ss_id", fba_id: "$_id.fba_id", channel: '$_id.channel', agent_contact_count: 1, sync_contact_count: 1, found_contact_count: 1, match_contact_count: 1}},
                        {$sort: {'agent_contact_count': -1}}
                    ];
                    Sync_Contact.aggregate(sync_agg).exec(function (err, dbSyncContactsRange) {
                        summary.range = dbSyncContactsRange;
                        data.sync = summary;
                        agent_activity_summary_handler(req, res, data);
                    });
                });
                let args = {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                };
                var Client = require('node-rest-client').Client;
                var client = new Client();
                client.get(config.environment.weburl + '/sync_contacts/synced_data_behaviour?cache=yes', args, function (dataRest, response) {
                    data.obj_sync_analysis_summary = dataRest;
                    agent_activity_summary_handler(req, res, data);
                });
            }
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.post('/sync_contact_import', agent_details_pre_form, function (req, res) {
        try {
            const vCardFiles = req.files['sync_file'].path; //appRoot + "/tmp/" + "2020-08-19 12-36-59.vcf";   
            var vcard = require('vcard-json');
            var sync_contact = require('../models/sync_contact');
            var syncPospSummary = {
                'Message': '',
                'Status': '',
                'StatusNo': 0,
                'Inserted_Count': 0
            };
            let syncContact = [];
            let ss_id = req.agent['EMP'].Emp_Id;
            let fba_id = req.agent['EMP'].FBA_ID;
            let mobile_list = [];
            let exist_contact = [];
            vcard.parseVcardFile(vCardFiles, function (err, vcard) {
                console.log(vcard);
                if (ss_id > 0 && ss_id !== 5)
                {
                    for (let i in vcard)
                    {
                        if (vcard[i].phone.length > 0) {
                            for (let j in vcard[i].phone) {
                                mobile_list.push(vcard[i].phone[j].value.replace(/#|_|\+|\-|\(|\)| |/g,'').slice(-10));
                            }
                        }
                    }
                    let cond = {
                        "mobileno": {
                            "$in": mobile_list
                        },
                        'ss_id': ss_id
                    };
                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err1, db) {
                        var sync_contacts = db.collection('sync_contacts');
                        sync_contacts.find(cond).toArray(function (err2, dbItems) {
                            if (err2) {
                                syncPospSummary.Message = err2;
                                syncPospSummary.Status = 'Error';
                                syncPospSummary.StatusNo = 1;
                                res.json(syncPospSummary);
                            } else {
                                for (let i in dbItems) {
                                    exist_contact.push(dbItems[i]['mobileno']);
                                }
                                for (let i in vcard) {
                                    try {

                                        for (let j in vcard[i].phone) {
                                            let objRequest = {};
                                            let mobileno = vcard[i].phone[j].value.replace(/#|_|\+|\-|\(|\)| |/g,'').slice(-10).toString();
                                            let name = vcard[i].fullname.toString();
                                            let index = syncContact.findIndex(x => x.mobileno === mobileno);
                                            let is_duplicate = "";
                                            if (syncContact.length > 0 && index > 0) {
                                                is_duplicate = syncContact[index]['mobileno'];
                                            }
                                            if (is_duplicate === "") {
                                                if (exist_contact.indexOf(mobileno) > -1)
                                                {
                                                    objRequest['name'] = name;
                                                    objRequest['Modified_On'] = new Date();
                                                    objRequest['raw_data'] = vcard[i];
                                                    let myquery = {mobileno: mobileno, ss_id: ss_id};
                                                    let newvalues = {$set: objRequest};
                                                    Sync_Contact.update(myquery, newvalues, {multi: false}, function (err, numAffected) {
                                                        if (err)
                                                        {
                                                            console.error('Exception', 'Contact_Sync_Save_Err', err);
                                                        }
                                                    });
                                                } else {
                                                    objRequest['mobileno'] = mobileno;
                                                    objRequest['name'] = name;
                                                    objRequest['ss_id'] = ss_id;
                                                    objRequest['fba_id'] = fba_id;
                                                    objRequest['channel'] = req.agent['channel'];
                                                    objRequest['Created_On'] = new Date();
                                                    objRequest['Modified_On'] = new Date();
                                                    objRequest['Short_Code'] = randomString(10);
                                                    objRequest['raw_data'] = vcard[i];
                                                    objRequest['source'] = "horizon";
                                                    syncContact.push(objRequest);
                                                }
                                            }
                                        }
                                    } catch (e) {
                                        console.error('Exception', 'sync_contact', 'data_process_loop', e.stack);
										res.send(e.stack);
										
                                    }
                                }
                            }
                            if (syncContact.length > 0) {
                                sync_contact.insertMany(syncContact, function (err, users) {
                                    if (err) {
                                        syncPospSummary.Message = err;
                                        syncPospSummary.Status = 'Error';
                                        syncPospSummary.StatusNo = 1;
                                        syncPospSummary.Inserted_Count = users.length;
                                        res.json(syncPospSummary);
                                    } else {
                                        syncPospSummary.Message = 'Contact Added Successfully.';
                                        syncPospSummary.Status = 'success';
                                        syncPospSummary.StatusNo = 0;
                                        syncPospSummary.Inserted_Count = users.length;
                                        res.json(syncPospSummary);
                                    }
                                });
                            } else {
                                syncPospSummary.Message = 'No record added';
                                syncPospSummary.Status = 'Error';
                                syncPospSummary.StatusNo = 1;
                                syncPospSummary.Inserted_Count = 0;
                                res.json(syncPospSummary);
                            }
                        });
                    });
                }
            });
        } catch (e) {
            console.error(e.stack);
			res.send(e.stack);
        }
    });
    
	app.get('/sync_contacts/find_ibuddy/:mobileNumber', function (req, res) {
        try {
            var mobileNumber = parseInt(req.params.mobileNumber);
            var sync_contact = require('../models/sync_contact');
            var agg = [{"$match": {"mobileno": mobileNumber.toString()}},
                {$group: {_id: {ss_id: "$ss_id", name: "$name"}}},
                { $limit :5},
				{$sort: {"relationship_score":-1}}
			];
            Sync_Contact.aggregate(agg, function (err, dbBuudy) {
                let buddyResponse = {"Status": 0, "Msg": "Fail", "Data": ""};

                try {
                    if (err) {
                        buddyResponse['Msg'] = "Error";
                        buddyResponse['Data'] = err;
                        res.json(buddyResponse);
                    } else {
                        if (dbBuudy && dbBuudy.length > 0) {
                            let ssIdBuddy = [];
                            for (var q in dbBuudy) {
                                ssIdBuddy.push(dbBuudy[q]['_id']['ss_id']);
                            }
                            var Employee = require('../models/employee');
                            Employee.find({Emp_Id: {$in: ssIdBuddy}},{_id:0, Emp_Id:1, Emp_Code:1, Emp_Name:1}, function (err, iBuddy) {
                                let buddyResponse = {"Status": 0, "Msg": "Fail", "Data": ""};
                                if (err) {
                                    buddyResponse['Msg'] = "Error";
                                    buddyResponse['Data'] = err;
                                    res.json(buddyResponse);
                                } else {
                                    if (iBuddy && iBuddy.length > 0) {
                                        buddyResponse['Status'] = 1;
                                        buddyResponse['Msg'] = "Success";
                                        buddyResponse['Data'] = iBuddy;
                                        res.json(buddyResponse);
                                    } else {
                                        res.json(buddyResponse);
                                    }
                                }
                            });
                        } else {
                            res.json(buddyResponse);
                        }
                    }
                } catch (e) {
                    buddyResponse['Msg'] = "Error";
                    buddyResponse['Data'] = e;
                    res.json(buddyResponse);
                }
            });
        } catch (e) {
            res.json({"Status": 0, "Msg": "Error", "Data": e.stack});
        }
    });
	
	app.get('/protectme/:UID', function (req, res, next) {
        try {
            var User_Data_Id = req.params['UID'] - 0;
            var protect_me_well = require('../models/protect_me_well_detail');
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var ip_address = "";
            var url_click = "http://localhost:8080";
            http.get('http://bot.whatismyipaddress.com', function (res, req) {
                res.setEncoding('utf8');
                var bodyChunks = [];
                res.on('data', function (chunk) {
                    // You can process streamed parts here...
                    ip_address = chunk;
                });
                client.get(config.environment.weburl + '/user_datas/view/' + User_Data_Id, function (data, err) {
                    if (data.length > 0) {
                        data = data['0'];
                        var objData = {
                            "User_Data_Id": data["User_Data_Id"],
                            "Request_Unique_Id": data["Request_Unique_Id"],
                            "Name": data["Proposal_Request_Core"]["first_name"] + " " + data["Proposal_Request_Core"]["middle_name"] + " " + data["Proposal_Request_Core"]["last_name"],
                            "Mobile": data["Proposal_Request_Core"]["mobile"],
                            "Email": data["Proposal_Request_Core"]["email"],
                            "Age": data["Proposal_Request_Core"]["birth_date"],
                            "DOB": data["Proposal_Request_Core"]["birth_date"],
                            "Address": data["Proposal_Request_Core"]["permanent_address_1"] + " " + data["Proposal_Request_Core"]["permanent_address_2"] + " " + data["Proposal_Request_Core"]["permanent_address_3"] + " " + data["Proposal_Request_Core"]["locality"] + " " + data["Proposal_Request_Core"]["permanent_pincode"] + " " + data["Proposal_Request_Core"]["district"],
                            "is_protect_me_visited": 1,
                            "is_protect_issued": 0,
                            "Created_On": new Date(),
                            "Modified_On": new Date()

                        };
                        protect_me_well.findOne({"User_Data_Id": User_Data_Id}, function (err, dbData) {
                            if (err) {

                            } else {
                                if (dbData)
                                {
                                    var obj_res = {};
                                    let obj_visted_history = {
                                        "ip_address": ip_address,
                                        "date_time": new Date()
                                    };
                                    obj_res["protect_me_link_history"] = obj_visted_history;
                                    protect_me_well.updateOne({'User_Data_Id': User_Data_Id}, {$set: {'is_protect_me_visited': parseInt(dbData._doc["is_protect_me_visited"]) + 1}}, function (err, numAffected) {
                                        console.log(err);
                                    });
                                    protect_me_well.updateOne({'User_Data_Id': User_Data_Id}, {$addToSet: obj_res}, function (err, numAffected) {
                                        console.log(err);
                                        return res.redirect(url_click);
                                    });
                                } else {
                                    let obj_visted_history = [{
                                            "ip_address": ip_address,
                                            "date_time": new Date()
                                        }];
                                    objData["protect_me_link_history"] = obj_visted_history;
                                    protect_me_well.insertMany(objData, function (err, users) {
                                        if (err) {
                                            res.json({'Msg': '', Status: 'Fail'});
                                        } else {
                                            return res.redirect(url_click);
                                            //res.json({'Msg': 'Saved Succesfully!!!', Status: 'Success'});
                                        }
                                    });
                                }
                            }
                        });
                    }

                });
            });
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.get('/protectme_pdf/:UID', function (req, res, next) {
        try {
            var User_Data_Id = req.params['UID'] - 0;
            var protect_me_well = require('../models/protect_me_well_detail');
            protect_me_well.findOne({"User_Data_Id": User_Data_Id}, function (err, dbData) {
                if (err) {
                    res.json({msg: 'fail', url: ''});
                } else {
                    var url = dbData._doc.protect_me_link_url;
                    res.json({msg: 'success', url: url});
                }
            });
        } catch (e) {
            res.json({msg: 'fail', url: '', error: e});
        }
    });
    app.post('protect_initiate', function (req, res, next) {
        try {
            var User_Data_Id = 196023;
            var protect_me_well = require('../models/protect_me_well_detail');
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var ObjResponse1 = {};
            var ObjResponse2 = {};
            http.get('http://bot.whatismyipaddress.com', function (res, req) {
                res.setEncoding('utf8');
                var bodyChunks = [];
                res.on('data', function (chunk) {
                    // You can process streamed parts here...
                    ip_address = chunk;
                });
                var obj = {"agree": "Y", "name": "Jane Doe", "email": "name@mail.com", "mobile": "9848022338", "gender": "F", "location": "Bengaluru", "starting_age": 35, "education": "M", "marital_status": "M", "retirement_age": 60, "mother_age": 0, "father_age": 0, "spouse_age": 31, "mother_dependent": "N", "father_dependent": "N", "spouse_dependent": "Y", "occupation_self": "S", "home_purchase_age": 30, "annual_income_self": 1000000, "annual_income_spouse": 0, "annual_income_other": 0, "current_household_expenses": 500000, "current_investment_for_retirement": 0, "home_owned": "Y", "home_loan_availed": "Y", "other_loans_availed": "Y", "total_financial_assets": 500000, "total_real_estate_assets": 5000000, "occupation_spouse": "S", "dependent_children": 0, "dependent_children_ages": "", "dependent_parents": "N"};
                var arg = {"headers": {'X-API-KEY': '1ccf9d6c4ef087ee54c43ba8f2b0651d'}};
                client.post("https://api.protectmewell.com/index.php/api/v1/get_recommendation" + "?" + obj, arg, function (data, response) {
                    data = {
                        "status": 200,
                        "message": "Success",
                        "data": {
                            "recommended_portfolio": {
                                "term_plan": {
                                    "tp_duration": 30,
                                    "tp_start": 25,
                                    "tp_cover_size": 82500000,
                                    "premium_ns": "",
                                    "premium_s": ""
                                },
                                "critical_illness": {
                                    "ci_duration": 30,
                                    "ci_starting_age": 25,
                                    "ci_cover_size": 52000000,
                                    "ci_horizon_for_cover": 30
                                },
                                "health_insurance": {"hi_annual_health_cover": 2500000},
                                "annuity_funds": {
                                    "af_start_age": 55,
                                    "af_corpus": 280500000,
                                    "af_annual_payout": 14018200,
                                    "retirement_expenses": 32023500,
                                    "monthly_investment": 169300,
                                    "monthly_epf_investment": 44100,
                                    "additional_monthly_epf_investment": 125300,
                                    "annual_investment_percent": 18
                                }
                            },
                            "current_portfolio": {
                                "term_plan": {"tp_risk_cover_score": 6},
                                "critical_illness": {"ci_risk_cover_score": 0},
                                "health_insurance": {"hi_risk_cover_score": 10},
                                "annuity_funds": {"af_risk_cover_score": 0}
                            },
                            "hash": "5cd7503cca974087b531380dffbee28a"
                        }
                    };
                    ObjResponse1 = data;
                    if (ObjResponse1.status === 200 && ObjResponse1.message === "Success") {
                        var service_method_url = "https://api.protectmewell.com/index.php/api/v1/get_pdf_url";
                        const request = require('request');
                        request.post({
                            url: service_method_url,
                            form: {
                                hash: ObjResponse1.data.status
                            }
                        }, function (err, httpResponse, body) {
                            ObjResponse2 = body;
                            if (ObjResponse2.status === 200 && ObjResponse2.message === "Success") {

                                protect_me_well.findOne({"User_Data_Id": User_Data_Id}, function (err, dbData) {
                                    if (err) {

                                    } else {
                                        if (dbData)
                                        {
                                            var obj_res = {};
                                            let obj_visted_history = {
                                                "ip_address": ip_address,
                                                "date_time": new Date()
                                            };
                                            obj_res["protect_me_link_history"] = obj_visted_history;
                                            var obj_req = {"protect_me_link_url": ObjResponse2.data['pdf_url'],
                                                "Service_Response_1": ObjResponse1,
                                                "Service_Response_2": ObjResponse2
                                            };
                                            obj_res["protect_me_link_url"] = ObjResponse2.data['pdf_url'];
                                            obj_res["Service_Response_2"] = ObjResponse2;
                                            protect_me_well.updateOne({'User_Data_Id': User_Data_Id}, {$set: obj_req}, function (err, numAffected) {
                                                console.log(err);
                                            });
                                            protect_me_well.updateOne({'User_Data_Id': User_Data_Id}, {$addToSet: obj_res}, function (err, numAffected) {
                                                console.log(err);
                                            });
                                        }
                                    }
                                });
                            }

                        });
                    }
                });
            });
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.get('/sync_contacts/my_ibuddy', function (req, res) {
        try {
            let ibuddyRes = [];
            let sync_count = 6;
            var Sync_Contact_Call_History = require('../models/sync_contact_call_history');
            let mobileno = (req.query.hasOwnProperty('mobileno')) ? req.query.mobileno : "";
			let cache_key = 'ibuddy_'+mobileno;
			if(mobileno === ''){
				return res.send('no mobile');
			}
			let is_cache_enable = (req.query['cache'] === 'del') ? false : true;
			if (is_cache_enable && fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {				
				var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
				var obj_cache_content = JSON.parse(cache_content);
				return res.json(obj_cache_content);
			}
			else{
				let mobile_no = "+91" + mobileno.substring(mobileno.length, mobileno.length - 10);
				let update_data = (req.query.hasOwnProperty('update')) ? req.query['update'] : "no";
				MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err1, db) {
					var Sync_Contact_Summary = db.collection('sync_contact_summaries');
					Sync_Contact_Call_History.distinct('ss_id', {mobileno: mobile_no}).exec(function (err, sync_data) {
						if (err)
						{
							res.send({"Status": "0", "Msg": err});
						} else
						{
							try {
								let mobile = mobileno;
								if (sync_data.length > 0)
								{
									var Client = require('node-rest-client').Client;
									var client = new Client();
									for (let i in sync_data) {
										sync_count--;
										let ss_id = sync_data[i];
										let url_api = config.environment.weburl + "/sync_contacts/calculate_relationship_score/" + ss_id + "/" + mobile + "/" + update_data;
										client.get(url_api, function (data, response) {
											ibuddyRes.push({'ss_id': ss_id, 'mobile': mobile, 'score': (data && data.relationship_score ? data.relationship_score : 0), 'type': 'Sync_Call'});
											if (parseInt(i) === sync_data.length - 1) {
												if (sync_count < 6 && sync_count > 0)
												{
													var Client = require('node-rest-client').Client;
													var client = new Client();
													client.get(config.environment.weburl + '/sync_contacts/sync_contact_dats/' + mobileno + '/' + sync_count, function (sync_contact, response) {
														for (let j in sync_contact) {
															let sync_exist = ibuddyRes.some(filter => filter.ss_id === sync_contact[j]['_id']);
															if (!sync_exist) {
																sync_count--;
																ibuddyRes.push({'ss_id': sync_contact[j]['_id'], 'mobile': mobile, 'score': 0, 'type': 'Sync_Data'});
															}
														}
														if (sync_count === 0) {
															fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(ibuddyRes), function (err) {});
															res.send(ibuddyRes);
														} else {
															var Client = require('node-rest-client').Client;
															var client = new Client();
															client.get(config.environment.weburl + '/sync_contacts/sync_contact_call_histories/getTopPerformer/' + sync_count, function (topPerformer, response) {
																for (let k in topPerformer) {
																	let sync_exist = ibuddyRes.some(filter => filter.ss_id === topPerformer[k]['_id']);
																	if (!sync_exist) {
																		sync_count--;
																		ibuddyRes.push({'ss_id': topPerformer[k]['_id'], 'mobile': mobile, 'score': 0, 'type': 'Preferred_Data'});
																	}
																}
																/*if (sync_count === 0) {
																	res.send(ibuddyRes);
																} else {
																	res.send(ibuddyRes);
																}*/
																fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(ibuddyRes), function (err) {});
																res.send(ibuddyRes);
															});
														}
													});
												} else {
													fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(ibuddyRes), function (err) {});
													res.send(ibuddyRes);
												}
											}
										});
									}
								} else {
									var Client = require('node-rest-client').Client;
									var client = new Client();
									client.get(config.environment.weburl + '/sync_contacts/sync_contact_dats/' + mobileno + '/' + sync_count, function (sync_contact, response) {
										for (let j in sync_contact) {
											let sync_exist = ibuddyRes.some(filter => filter.ss_id === sync_contact[j]['_id']);
											if (!sync_exist) {
												sync_count--;
												ibuddyRes.push({'ss_id': sync_contact[j]['_id'], 'mobile': mobile, 'score': 0, 'type': 'Sync_Data'});
											}
										}
										if (sync_count === 0) {
											fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(ibuddyRes), function (err) {});
											res.send(ibuddyRes);
										} else {
											var Client = require('node-rest-client').Client;
											var client = new Client();
											client.get(config.environment.weburl + '/sync_contacts/sync_contact_call_histories/getTopPerformer/' + sync_count, function (topPerformer, response) {
												for (let k in topPerformer) {
													let sync_exist = ibuddyRes.some(filter => filter.ss_id === topPerformer[k]['_id']);
													if (!sync_exist) {
														sync_count--;
														ibuddyRes.push({'ss_id': topPerformer[k]['_id'], 'mobile': mobile, 'score': 0, 'type': 'Preferred_Data'});
													}
												}
												/*if (sync_count === 0) {
													res.send(ibuddyRes);
												} else {
													res.send(ibuddyRes);
												}*/
												fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(ibuddyRes), function (err) {});
												res.send(ibuddyRes);
											});
										}
									});
								}
							} catch (e) {
								res.send({"Status": "error", "Msg": e.stack});
							}
						}
					});
				});
			}
        } catch (e) {
            res.send('<pre>' + e.stack + '</pre>');
        }
    });
	app.get('/sync_contacts/my_ibuddy_adv', function (req, res) {
        try {
            let ibuddyRes = [];
            let sync_count = 6;
            var Sync_Contact_Call_History = require('../models/sync_contact_call_history');
            let mobileno = (req.query.hasOwnProperty('mobileno')) ? req.query.mobileno : "";
			let cache_key = 'ibuddy_'+mobileno;
			if(mobileno === ''){
				return res.send('no mobile');
			}
			let is_cache_enable = (req.query['cache'] === 'del') ? false : true;
			if (is_cache_enable && fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {				
				var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
				var obj_cache_content = JSON.parse(cache_content);
				return res.json(obj_cache_content);
			}
			else{
				let mobile_no = "+91" + mobileno.substring(mobileno.length, mobileno.length - 10);
				let update_data = (req.query.hasOwnProperty('update')) ? req.query['update'] : "no";
				MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err1, db) {
					var Sync_Contact_Summary = db.collection('sync_contact_summaries');
					Sync_Contact_Call_History.distinct('ss_id', {mobileno: mobile_no}).exec(function (err, sync_data) {
						if (err)
						{
							res.send({"Status": "0", "Msg": err});
						} else
						{
							try {
								let mobile = mobileno;
								if (sync_data.length > 0)
								{
									var Client = require('node-rest-client').Client;
									var client = new Client();
									for (let i in sync_data) {
										sync_count--;
										let ss_id = sync_data[i];
										let url_api = config.environment.weburl + "/sync_contacts/calculate_relationship_score/" + ss_id + "/" + mobile + "/" + update_data;
										client.get(url_api, function (data, response) {
											ibuddyRes.push({'ss_id': ss_id, 'mobile': mobile, 'score': (data && data.relationship_score ? data.relationship_score : 0), 'type': 'Sync_Call'});
											if (parseInt(i) === sync_data.length - 1) {
												if (sync_count < 6 && sync_count > 0)
												{
													var Client = require('node-rest-client').Client;
													var client = new Client();
													client.get(config.environment.weburl + '/sync_contacts/sync_contact_dats/' + mobileno + '/' + sync_count, function (sync_contact, response) {
														for (let j in sync_contact) {
															let sync_exist = ibuddyRes.some(filter => filter.ss_id === sync_contact[j]['_id']);
															if (!sync_exist) {
																sync_count--;
																ibuddyRes.push({'ss_id': sync_contact[j]['_id'], 'mobile': mobile, 'score': 0, 'type': 'Sync_Data'});
															}
														}
														if (sync_count === 0) {
															fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(ibuddyRes), function (err) {});
															res.send(ibuddyRes);
														} else {
															var Client = require('node-rest-client').Client;
															var client = new Client();
															client.get(config.environment.weburl + '/sync_contacts/sync_contact_call_histories/getTopPerformer/6', function (topPerformer, response) {
																for (let k in topPerformer) {
																	let sync_exist = ibuddyRes.some(filter => filter.ss_id === topPerformer[k]['_id']);
																	if (!sync_exist && sync_count > 0) {
																		sync_count--;
																		ibuddyRes.push({'ss_id': topPerformer[k]['_id'], 'mobile': mobile, 'score': 0, 'type': 'Preferred_Data'});
																	}
																}
																/*if (sync_count === 0) {
																	res.send(ibuddyRes);
																} else {
																	res.send(ibuddyRes);
																}*/
																fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(ibuddyRes), function (err) {});
																res.send(ibuddyRes);
															});
														}
													});
												} else {
													fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(ibuddyRes), function (err) {});
													res.send(ibuddyRes);
												}
											}
										});
									}
								} else {
									var Client = require('node-rest-client').Client;
									var client = new Client();
									client.get(config.environment.weburl + '/sync_contacts/sync_contact_dats/' + mobileno + '/' + sync_count, function (sync_contact, response) {
										for (let j in sync_contact) {
											let sync_exist = ibuddyRes.some(filter => filter.ss_id === sync_contact[j]['_id']);
											if (!sync_exist) {
												sync_count--;
												ibuddyRes.push({'ss_id': sync_contact[j]['_id'], 'mobile': mobile, 'score': 0, 'type': 'Sync_Data'});
											}
										}
										if (sync_count === 0) {
											fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(ibuddyRes), function (err) {});
											res.send(ibuddyRes);
										} else {
											var Client = require('node-rest-client').Client;
											var client = new Client();
											client.get(config.environment.weburl + '/sync_contacts/sync_contact_call_histories/getTopPerformer/6', function (topPerformer, response) {
												for (let k in topPerformer) {
													let sync_exist = ibuddyRes.some(filter => filter.ss_id === topPerformer[k]['_id']);
													if (!sync_exist && sync_count > 0) {
														sync_count--;
														ibuddyRes.push({'ss_id': topPerformer[k]['_id'], 'mobile': mobile, 'score': 0, 'type': 'Preferred_Data'});
													}
												}
												/*if (sync_count === 0) {
													res.send(ibuddyRes);
												} else {
													res.send(ibuddyRes);
												}*/
												fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(ibuddyRes), function (err) {});
												res.send(ibuddyRes);
											});
										}
									});
								}
							} catch (e) {
								res.send({"Status": "error", "Msg": e.stack});
							}
						}
					});
				});
			}
        } catch (e) {
            res.send('<pre>' + e.stack + '</pre>');
        }
    });
	app.get('/sync_contacts/report/historic_dashboard', LoadSession, function (req, res ,next) {
		try {
			let curr_date = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');	
			let sales_historic_summary_cache_key = 'the360degree_sync_contacts_historic_dashboard_summary_'+req.obj_session.user.ss_id;
			if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
				sales_historic_summary_cache_key = 	'the360degree_sync_contacts_historic_dashboard_summary_SuperAdmin';					
			}
			req.query['report_cache_key'] = sales_historic_summary_cache_key;
			var today = moment().utcOffset("+05:30").startOf('Day');
			var today_start = moment().utcOffset("+05:30").startOf('Day');
			var today_end = moment().utcOffset("+05:30").endOf('Day');
			var yesterday = moment().add(-1, 'days').utcOffset("+05:30").endOf('Day');
			var weekstart = moment().utcOffset("+05:30").startOf('week');
			weekstart = moment(weekstart).add(1, 'days');
			let weekstart_prev = moment(weekstart).add(-7, 'days').startOf('Day');
			let weekend_prev = moment(weekstart).add(-1, 'days').endOf('Day');
			let obj_sale_historic = {
				'TODAY': {
					'start': today_start,
					'end': today_end,
					'count': null,
					'data' : null
				},				
				'YESTERDAY': {
					'start': moment().subtract(1, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(1, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null,
					'data' : null
				},
				'DAY_BEFORE_YESTERDAY': {
					'start': moment().subtract(2, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(2, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null,
					'data' : null
				},	
				'2DAY_BEFORE_YESTERDAY': {
					'start': moment().subtract(3, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(3, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null,
					'data' : null
				},
				'3DAY_BEFORE_YESTERDAY': {
					'start': moment().subtract(4, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(4, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null,
					'data' : null
				},	
				'MONTHLY': {
					'start': moment().utcOffset("+05:30").startOf('month'),
					'end': yesterday,
					'count': null,
					'data' : null
				},
				'MONTHLY-PREVIOUS': {
					'start': moment().subtract(1, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(1, 'month').utcOffset("+05:30").endOf('month'),
					'count': null,
					'data' : null
				},
				'MONTHLY-PREVIOUS-2': {
					'start': moment().subtract(2, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(2, 'month').utcOffset("+05:30").endOf('month'),
					'count': null,
					'data' : null
				},
				'MONTHLY-PREVIOUS-3': {
					'start': moment().subtract(3, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(3, 'month').utcOffset("+05:30").endOf('month'),
					'count': null,
					'data' : null
				},
				'MONTHLY-PREVIOUS-4': {
					'start': moment().subtract(4, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(4, 'month').utcOffset("+05:30").endOf('month'),
					'count': null,
					'data' : null
				},
				'YEARLY': {
					'start': moment('2023-04-01').utcOffset("+05:30").startOf('day'),
					'end': yesterday,
					'count': null,
					'data' : null
				},
				'YEARLY-2022_2023': {
					'start': moment('2022-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2023-03-31').utcOffset("+05:30").endOf('day'),
					'count': null,
					'data' : null
				},
				'YEARLY-2021_2022': {
					'start': moment('2021-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2022-03-31').utcOffset("+05:30").endOf('day'),
					'count': null,
					'data' : null
				},
				'YEARLY-2020_2021': {
					'start': moment('2020-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2021-03-31').utcOffset("+05:30").endOf('day'),
					'count': null,
					'data' : null
				},
				'YEARLY-2019_2020': {
					'start': moment('2019-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2020-03-31').utcOffset("+05:30").endOf('day'),
					'count': null,
					'data' : null
				},
				/*	
				'ALL': {
					'start': moment('2017-04-01').utcOffset("+05:30").startOf('day'),
					'end': yesterday,
					'count': null,
					'data' : null
				}*/
			};
			
			if (fs.existsSync(appRoot + "/tmp/cachereport/" + sales_historic_summary_cache_key + ".log") === true) {
				let stats = fs.statSync(appRoot + "/tmp/cachereport/" + sales_historic_summary_cache_key + ".log");
				let mtime = moment(stats.mtime).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
				let mdate = moment(stats.mtime).utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
				if(curr_date === mdate){			
					var cache_content = fs.readFileSync(appRoot + "/tmp/cachereport/" + sales_historic_summary_cache_key + ".log").toString();
					obj_sale_historic = JSON.parse(cache_content);
					let cache_content_json ={};
					cache_content_json['cached_on_time'] = mtime;
					cache_content_json['cached_on_date'] = mdate;
					cache_content_json['curr_date'] = curr_date;
					cache_content_json['cached'] = 'YES';
					cache_content_json['report_cache_key'] = sales_historic_summary_cache_key;
					obj_sale_historic['cache'] = cache_content_json;
					//return res.json(cache_content_json);
				}
			}		
			
				
			
			let cond_ud = {};
			if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
			
			} else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
				var arr_ch_ssid = [];
				var arr_ch_list = [];
				if (req.obj_session.hasOwnProperty('users_assigned')) {
					arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
				}
				arr_ch_ssid.push(req.obj_session.user.ss_id);
				arr_ch_list = req.obj_session.user.role_detail.channel_transaction;
				cond_ud = {
					"$or": [
						{'channel': {$in:arr_ch_list}},
						{'ss_id': {$in: arr_ch_ssid}}
					]
				};
			}
			else {
				cond_ud['ss_id'] = {$in: arr_ssid};
			}			
					
			for (let k in obj_sale_historic) {
				if(k!== 'cache' && obj_sale_historic[k]['count'] === null){
					let arrFrom = obj_sale_historic[k]['start'].format('YYYY-MM-D').split('-');
					let dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
					let arrTo = obj_sale_historic[k]['end'].format('YYYY-MM-D').split('-');
					let dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
					dateTo.setDate(dateTo.getDate() + 1);
					cond_ud['Created_On'] = {"$gte": dateFrom, "$lte": dateTo};
					let ud_aggregate = [
						{	"$match": cond_ud},
						{	"$group": {
							_id: {},
							"SYNC" : {"$sum" : 1},
							"SYNC_AGENT_LIST" : { $addToSet : "$ss_id"},
							}
						},
						{
							"$project": {
								_id: 0, 
								'SYNC' : 1,
								'SYNC_AGENT' : {$size:"$SYNC_AGENT_LIST"}
							}
						}
					];	
					Sync_Contact.aggregate(ud_aggregate).exec(function (err, dbUsersData) {
						if (err) {
							return res.send(err);
						} else {
							obj_sale_historic[k]['data'] = dbUsersData || 0;
							obj_sale_historic[k]['count'] = dbUsersData.length;
							posp_historic_handler(obj_sale_historic, req, res);
						}
					});				
				}
				else{
					posp_historic_handler(obj_sale_historic, req, res);
				}	
			}
		} catch (Ex) {
			console.error('Exception', 'sync_contacts_historic_dashboard_ssid_', Ex.stack);
			res.send(Ex.stack);
		}
	});
	app.get('/sync_contacts/report/historic_lead_purchase', LoadSession, function (req, res ,next) {
		try {
			let curr_date = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
			let sales_historic_summary_cache_key = 'the360degree_lead_purchase_historic_dashboard_summary_'+req.obj_session.user.ss_id;
			if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
				sales_historic_summary_cache_key = 	'the360degree_lead_purchase_historic_dashboard_summary_SuperAdmin';					
			}	
			 
			req.query['report_cache_key'] = sales_historic_summary_cache_key;
			var today = moment().utcOffset("+05:30").startOf('Day');
			var today_start = moment().utcOffset("+05:30").startOf('Day');
			var today_end = moment().utcOffset("+05:30").endOf('Day');
			var yesterday = moment().add(-1, 'days').utcOffset("+05:30").endOf('Day');
			var weekstart = moment().utcOffset("+05:30").startOf('week');
			weekstart = moment(weekstart).add(1, 'days');
			let weekstart_prev = moment(weekstart).add(-7, 'days').startOf('Day');
			let weekend_prev = moment(weekstart).add(-1, 'days').endOf('Day');
			let obj_sale_historic = {
				'TODAY': {
					'start': today_start,
					'end': today_end,
					'count': null,
					'data' : null
				},				
				'YESTERDAY': {
					'start': moment().subtract(1, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(1, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null,
					'data' : null
				},
				'DAY_BEFORE_YESTERDAY': {
					'start': moment().subtract(2, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(2, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null,
					'data' : null
				},	
				'2DAY_BEFORE_YESTERDAY': {
					'start': moment().subtract(3, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(3, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null,
					'data' : null
				},
				'3DAY_BEFORE_YESTERDAY': {
					'start': moment().subtract(4, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(4, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null,
					'data' : null
				},	
				'MONTHLY': {
					'start': moment().utcOffset("+05:30").startOf('month'),
					'end': yesterday,
					'count': null,
					'data' : null
				},
				'MONTHLY-PREVIOUS': {
					'start': moment().subtract(1, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(1, 'month').utcOffset("+05:30").endOf('month'),
					'count': null,
					'data' : null
				},
				'MONTHLY-PREVIOUS-2': {
					'start': moment().subtract(2, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(2, 'month').utcOffset("+05:30").endOf('month'),
					'count': null,
					'data' : null
				},
				'MONTHLY-PREVIOUS-3': {
					'start': moment().subtract(3, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(3, 'month').utcOffset("+05:30").endOf('month'),
					'count': null,
					'data' : null
				},
				'MONTHLY-PREVIOUS-4': {
					'start': moment().subtract(4, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(4, 'month').utcOffset("+05:30").endOf('month'),
					'count': null,
					'data' : null
				},
				'YEARLY': {
					'start': moment('2023-04-01').utcOffset("+05:30").startOf('day'),
					'end': yesterday,
					'count': null,
					'data' : null
				},
				'YEARLY-2022_2023': {
					'start': moment('2022-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2023-03-31').utcOffset("+05:30").endOf('day'),
					'count': null,
					'data' : null
				},
				'YEARLY-2021_2022': {
					'start': moment('2021-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2022-03-31').utcOffset("+05:30").endOf('day'),
					'count': null,
					'data' : null
				},
				'YEARLY-2020_2021': {
					'start': moment('2020-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2021-03-31').utcOffset("+05:30").endOf('day'),
					'count': null,
					'data' : null
				},
				'YEARLY-2019_2020': {
					'start': moment('2019-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2020-03-31').utcOffset("+05:30").endOf('day'),
					'count': null,
					'data' : null
				},	
				'ALL': {
					'start': moment('2017-04-01').utcOffset("+05:30").startOf('day'),
					'end': yesterday,
					'count': null,
					'data' : null
				}
			};
			if (fs.existsSync(appRoot + "/tmp/cachereport/" + sales_historic_summary_cache_key + ".log") === true) {
				let stats = fs.statSync(appRoot + "/tmp/cachereport/" + sales_historic_summary_cache_key + ".log");
				let mtime = moment(stats.mtime).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
				let mdate = moment(stats.mtime).utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
				if(curr_date === mdate){			
					var cache_content = fs.readFileSync(appRoot + "/tmp/cachereport/" + sales_historic_summary_cache_key + ".log").toString();
					obj_sale_historic = JSON.parse(cache_content);
					obj_sale_historic['TODAY'] = {
						'start': today_start,
						'end': today_end,
						'count': null,
						'data' : null
					};
					let cache_content_json ={};
					cache_content_json['cached_on_time'] = mtime;
					cache_content_json['cached_on_date'] = mdate;
					cache_content_json['curr_date'] = curr_date;
					cache_content_json['cached'] = 'YES';
					cache_content_json['report_cache_key'] = sales_historic_summary_cache_key;
					//obj_sale_historic['cache'] = cache_content_json;
					//return res.json(cache_content_json);
				}
			}
			
			let cond_ud = {};
			if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
			
			} else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
				var arr_ch_ssid = [];
				var arr_ch_list = [];
				if (req.obj_session.hasOwnProperty('users_assigned')) {
					arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
				}
				arr_ch_ssid.push(req.obj_session.user.ss_id);
				arr_ch_list = req.obj_session.user.role_detail.channel_transaction;
				cond_ud = {
					"$or": [
						{'channel': {$in:arr_ch_list}},
						{'Ss_Id': {$in: arr_ch_ssid}}
					]
				};
			}
			else {
				cond_ud['Ss_Id'] = {$in: arr_ssid};
			}	
					
			for (let k in obj_sale_historic) {
				if(k !== 'cache' && obj_sale_historic[k]['count'] === null){
					let arrFrom = obj_sale_historic[k]['start'].format('YYYY-MM-D').split('-');
					let dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
					let arrTo = obj_sale_historic[k]['end'].format('YYYY-MM-D').split('-');
					let dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
					dateTo.setDate(dateTo.getDate() + 1);
					cond_ud['Created_On'] = {"$gte": dateFrom, "$lte": dateTo};
					cond_ud['Source'] = {$exists:false};
					let ud_aggregate = [
{	
	"$match" : cond_ud
},
{	
	"$group": {
		'_id':{},
		"TRANSACTION_ATTEMPT" : {$sum :1},
		"LEAD_PURCHASE_AGENT_LIST" : {"$addToSet": "$Ss_Id"},
		"TRANSACTION_SUCCESS" : {$sum: { $cond: {if:{$eq: ["$Transaction_Status","Success"]},then: 1,else: 0}}},
		"TRANSACTION_AMOUNT" : {$sum: { $cond: {if: {$eq: ["$Transaction_Status","Success"]},then: "$Total_Premium",else: 0}}},    
		"LEAD_COUNT" : {$sum: { $cond: {if:{$eq: ["$Transaction_Status","Success"]},then: "$Lead_Count",else: 0}}},
		'LEAD_PURCHASE_AGENT_SUCCESS_LIST' : {$addToSet: { $cond: {if: {$eq: ["$Transaction_Status","Success"]},then: "$Ss_Id",else:"$$REMOVE"}}},
	}
},
{
	"$project":{
		"_id" : 0,
		"TRANSACTION_ATTEMPT" : 1,
		"TRANSACTION_SUCCESS" : 1,
		"TRANSACTION_AMOUNT" : 1,
		"LEAD_COUNT" : 1,
		"AGENT_ATTEMPT" : {
				$size: "$LEAD_PURCHASE_AGENT_LIST"
		},
		"AGENT_SUCCESS" : {
				$size: "$LEAD_PURCHASE_AGENT_SUCCESS_LIST"
		}
	}
}				
];	
					let Razorpay_Payment = require('../models/razorpay_payment');	
					Razorpay_Payment.aggregate(ud_aggregate).exec(function (err, dbUsersData) {
						if (err) {
							return res.send(err);
						} else {
							obj_sale_historic[k]['data'] = dbUsersData || 0;
							obj_sale_historic[k]['count'] = dbUsersData.length;
							posp_historic_handler(obj_sale_historic, req, res);
						}
					});				
				}
				else{
					posp_historic_handler(obj_sale_historic, req, res);
				}	
			}
		} catch (Ex) {
			console.error('Exception', 'sync_contacts_historic_lead_purchase_ssid_', Ex.stack);
			res.send(Ex.stack);
		}
	});	
	app.get('/sync_contacts/dashboard/date_wise_sync', function (req, res, next) {
		let Start_Date = req.query['Start_Date'] || "";
		let End_Date = req.query['End_Date'] || '';
		let type = req.query['type'] || 'MONTHLY';
		
		if (type === 'MONTHLY') {
			Start_Date = moment().add(-1, 'days').utcOffset("+05:30").startOf('Month').format('YYYY-MM-DD');
			End_Date = moment().add(-1, 'days').utcOffset("+05:30").endOf('Month').format('YYYY-MM-DD');
		}
		if (type === 'CUSTOM') {
			Start_Date = moment(req.query['datefrom']).utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
			End_Date = moment(req.query['dateto']).utcOffset("+05:30").endOf('Day').format('YYYY-MM-DD');
		}
		
		var arrFrom = Start_Date.split('-');
		var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
		var arrTo = End_Date.split('-');
		var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
		dateTo.setDate(dateTo.getDate() + 1);
            
        let sync_cond = [
			{ $match: { Created_On: { "$gte": dateFrom , "$lte": dateTo } } },
			{ $group: { _id: { 
				$dateToString: { format: "%Y-%m-%d", date: "$Created_On"} 
				},
				"Ss_Id_List" : {$addToSet:"$ss_id"},
				'Employee_List' : {$addToSet: { $cond: {if: {$eq: ["$channel","PBS"]},then: "$ss_id",else:"$$REMOVE"}}},
				'Agent_List' : {$addToSet: { $cond: {if: {$ne: ["$channel","PBS"]},then: "$ss_id",else:"$$REMOVE"}}},
				'Employee_Sync' : {$sum: { $cond: {if: {$eq: ["$channel","PBS"]},then: 1,else: 0}}},
				'Agent_Sync' : {$sum: { $cond: {if: {$ne: ["$channel","PBS"]},then: 1,else: 0}}},
				'Total_Sync': {$sum: 1},    
			}},
			{$project: {_id:0,"Synced_On":"$_id","Total_Sync":1,"Employee_Cnt":{$size:"$Employee_List"},"Agent_Cnt":{$size:"$Agent_List"},"Employee_Sync":1,"Agent_Sync":1,"Ss_Id_List":1,"Synced_User_Count":{$size: "$Ss_Id_List"}}},
			{$sort:{Synced_On:-1}}
		];
        Sync_Contact.aggregate(sync_cond).exec(function (err, sync_con_db) {
            if (err) {
                res.send({"Status": "0", "Msg": err});
            } else {
				try{
					let Device = require('../models/device');
					let device_cond = [
						{ $match: { SS_ID : {$gt:0}, "Modified_On": { "$gte": dateFrom , "$lte": dateTo } } },
						{ $group: { _id: { 
							$dateToString: { format: "%Y-%m-%d", date: "$Modified_On"} 
							},
							"Ss_Id_List" : {$addToSet:"$SS_ID"}
						}},
						{$project: {_id:0,"Ss_Id_List":1,"Installed_On":"$_id","Installed_Count":{$size: "$Ss_Id_List"}}},
						{$sort:{Installed_On:-1}}
					];
					Device.aggregate(device_cond).exec(function (err, device_install_db) {
						try{
							let obj_device_date_wise = {};
							for(let single_device_date of device_install_db){
								obj_device_date_wise[single_device_date["Installed_On"]] = single_device_date;						
							}
							let obj_sync_con_db = [];
							for(let k in sync_con_db){
								let date_ident = sync_con_db[k]['Synced_On'];
								sync_con_db[k]['App_Installed_Cnt'] = obj_device_date_wise.hasOwnProperty(date_ident) ? obj_device_date_wise[date_ident]['Installed_Count'] : 0;						
							}	
							res.json(sync_con_db);
						}
						catch(e){
							res.send(e.stack);
						}
					});
				}
				catch(e){
					res.send(e.stack);
				}
            }
        });
	});
	app.get('/sync_contacts/dashboard/month_wise_sync', function (req, res, next) {
		let Start_Date =  "";
		let End_Date =  '';
		let type = req.query['type'] || '';
		
		if (type === 'CUSTOM') {
			Start_Date = moment(req.query['datefrom']).utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
			End_Date = moment(req.query['dateto']).utcOffset("+05:30").endOf('Day').format('YYYY-MM-DD');
		}
		
		var arrFrom = Start_Date.split('-');
		var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
		var arrTo = End_Date.split('-');
		var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
		dateTo.setDate(dateTo.getDate() + 1);
            
        let sync_cond = [
			{ $match: { Created_On: { "$gte": dateFrom , "$lte": dateTo } } },
			{ $group: { _id: { 
				$dateToString: { format: "%Y-%m", date: "$Created_On"} 
				},
				"Ss_Id_List" : {$addToSet:"$ss_id"},
				'Employee_List' : {$addToSet: { $cond: {if: {$eq: ["$channel","PBS"]},then: "$ss_id",else:"$$REMOVE"}}},
				'Agent_List' : {$addToSet: { $cond: {if: {$ne: ["$channel","PBS"]},then: "$ss_id",else:"$$REMOVE"}}},
				'Employee_Sync' : {$sum: { $cond: {if: {$eq: ["$channel","PBS"]},then: 1,else: 0}}},
				'Agent_Sync' : {$sum: { $cond: {if: {$ne: ["$channel","PBS"]},then: 1,else: 0}}},
				'Total_Sync': {$sum: 1},    
			}},
			{$project: {_id:0,"Synced_On":"$_id","Total_Sync":1,"Employee_Cnt":{$size:"$Employee_List"},"Agent_Cnt":{$size:"$Agent_List"},"Employee_Sync":1,"Agent_Sync":1,"Synced_User_Count":{$size: "$Ss_Id_List"}}},
			{$sort:{Synced_On:-1}}
		];
        Sync_Contact.aggregate(sync_cond).exec(function (err, sync_con_db) {
            if (err) {				
                res.send({"Status": "0", "Msg": err});
            } else {
                try{
					let Device = require('../models/device');
					let device_cond = [
						{ $match: { SS_ID : {$gt:0}, "Modified_On": { "$gte": dateFrom , "$lte": dateTo } } },
						{ $group: { _id: { 
							$dateToString: { format: "%Y-%m", date: "$Modified_On"} 
							},
							"Ss_Id_List" : {$addToSet:"$SS_ID"}
						}},
						{$project: {_id:0,"Ss_Id_List":1,"Installed_On":"$_id","Installed_Count":{$size: "$Ss_Id_List"}}},
						{$sort:{Installed_On:-1}}
					];
					Device.aggregate(device_cond).exec(function (err, device_install_db) {
						try{
							let obj_device_date_wise = {};
							for(let single_device_date of device_install_db){								
								obj_device_date_wise[single_device_date["Installed_On"]] = single_device_date;						
							}
							let obj_sync_con_db = [];
							for(let k in sync_con_db){
								let date_ident = sync_con_db[k]['Synced_On'];
								sync_con_db[k]['App_Installed_Cnt'] = obj_device_date_wise.hasOwnProperty(date_ident) ? obj_device_date_wise[date_ident]['Installed_Count'] : 0;						
							}	
							res.json(sync_con_db);
						}
						catch(e){
							res.send(e.stack);
						}
					});
				}
				catch(e){
					res.send(e.stack);
				}
            }
        });
	});
    app.get('/sync_contacts/sync_contact_dats/:mobileno/:limit', function (req, res, next) {
        //mobileno = "8471080469"; //for demo
        let mobileno = req.params.mobileno;
        let mobile_no = mobileno.substring(mobileno.length, mobileno.length - 10);
        let limit = req.params.limit - 0;
//        let temp_mobileno = "/" + mobileno + "$/";
        let sync_cond = [
            {$match: {mobileno: { $regex: mobile_no }}},
            {$group: {_id: '$ss_id'}},
            {$limit: limit}
        ];
        Sync_Contact.aggregate(sync_cond).exec(function (err, sync_con_db) {
            if (err) {
                res.send({"Status": "0", "Msg": err});
            } else {
                res.send(sync_con_db);
            }
        });
    });
    app.get('/sync_contacts/sync_contact_call_histories/getTopPerformer/:limit?', function (req, res, next) {
        try {
            let limit = req.params.limit - 0;
			let cache_key = 'getTopPerformer_'+limit;
			if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
				var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
				var obj_cache_content = JSON.parse(cache_content);
				return res.json(obj_cache_content);
			}
			else{
				let arr_Cond = [				
					{ $match: { Last_Status: {'$regex': 'WI'},  Modified_On: {$gte: new Date((new Date().getTime() - (60 * 24 * 60 * 60 * 1000)))}} },
					{ "$group": {
						"_id": {
							"ss_id": "$Premium_Request.ss_id"
						},
						"count": { "$sum": 1 }
					}},
					 { "$group": {
						"_id": "$_id.ss_id",
						"score": { "$sum": "$count" },
						"distinctCount": { "$sum": 1 }
					}},
					{ $sort : {"score" : -1 } },
					{ $limit: limit }
				];
				let User_Data = require('../models/user_data');
				User_Data.aggregate(arr_Cond).exec(function (err, dbLeadData) {
					try{
						if (err) {
							res.json(err);
						} else {
							fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(dbLeadData), function (err) {});
							
							res.json(dbLeadData);
						}
					}
					catch(e){
						res.json(e.stack);
					}
				});
			}
		}
		catch(e){
			res.json(e.stack);
		}
	});
    app.get('/sync_contacts/relationship_score', function (req, res) {
        try {
            let limit = (req.query.hasOwnProperty('limit')) ? req.query['limit'] - 0 : 100;
            let score = (req.query.hasOwnProperty('score')) ? req.query['score'] - 0 : 0;
            let update_data = (req.query.hasOwnProperty('update')) ? req.query['update'] : "no";
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err1, db) {
            var Sync_Contact_Summary = db.collection('sync_contact_summaries');
            Sync_Contact_Summary.find({call_count :{$gt:0}},{_id:0,ss_id:1}).toArray(function (err1,data){
                let arr_data = [];
                for (let i in data) {
                arr_data[i] =  data[i].ss_id;
                }
                let dbquery = {ss_id:{$in:arr_data},'relationship_score': {'$exists': false}};
            Sync_Contact.find(dbquery).limit(limit).exec(function (err, sync_data) {
                try {
                    if (sync_data.length > 0) {
                        var Client = require('node-rest-client').Client;
                        var client = new Client();
                        for (let i in sync_data) {
                            let ss_id = sync_data[i]._doc['ss_id'];
                            let mobile = sync_data[i]._doc['mobileno'];
                            let url_api = "http://localhost:3000/sync_contacts/calculate_relationship_score/"+ss_id+"/"+mobile+"/"+update_data;//LocalHost
//			      let url_api = "http://horizon.policyboss.com:5000/sync_contacts/calculate_relationship_score/"+ss_id+"/"+mobile+"/"+update_data;
			    client.get(url_api, function (data, response) {
			
			 });
                        }
                    }
                    res.send("Number of Data Updated : "+sync_data.length);
                } catch (e) {
                    res.send('<pre>' + e.stack + '</pre>');
                }
            });});});
        } catch (e) {
            res.send('<pre>' + e.stack + '</pre>');
        }
        
    });
    app.get('/sync_contacts/calculate_relationship_score/:ss_id/:mobile_no/:update_data', function (req, res) {
        try {
            
            var Sync_Contact_Call_History = require('../models/sync_contact_call_history');
            let ss_id = req.params.ss_id - 0;
            let mobile_no = req.params.mobile_no;
            mobile_no = "+91" + mobile_no.substring(mobile_no.length, mobile_no.length - 10);
            let update_data = req.params.update_data.toLowerCase();
            //var query_filter = "ss_id:"+ss_id+"mobileno:/"+mobile_no+"/";
            let relationship_score_history = {
                "name": "",
                "ss_id" : 0,
                "mobile_no" :"",
                "number_of _calls" : 0, 
                "total_talk_time" :  0,
                "number_of_calls_bonus":0,
                "avg_talk_time":0,
                "avg_talk_time_bonus":0, 
                "sat_call":0,
                "sat_call_bonus":0,
                "sunday_call":0,
                "sunday_call_bonus":0,
                "non_working_call":0,
                "non_working_call_bonus":0,
                "relationship_score":0,
                "Created_On": new Date(),
                "Modified_On":new Date()
            };
            relationship_score_history['ss_id'] = ss_id;
            relationship_score_history['mobile_no'] = mobile_no;
            Sync_Contact_Call_History.find({ss_id:ss_id,mobileno: mobile_no}).exec(function (err, dbSyncs) {
                try {
                    if (dbSyncs.length > 0) {
                        let number_of_call = dbSyncs.length;
                        let total_talk_time = 0;
                        let sat_call = 0;
                        let sun_call = 0;
                        let weekend_call = 0;
                        for (let j in dbSyncs)
                        {
                            total_talk_time += dbSyncs[j].callDuration;
                            let callDate = dbSyncs[j].callDate;
                            if(callDate.getDay() > 0 && callDate.getDay() <= 6)
                            {
                                 if(callDate.getHours() > 21 && callDate.getHours() < 9)
                                {
                                    weekend_call += 1; 
                                } 
                            }
                            if(callDate.getDay() == 6)
                            {                                
                                sat_call += 1;
                            }
                            if(callDate.getDay() == 0)
                            {
                                sun_call += 1;
                                weekend_call += 1;
                            }
                            
                        }
                        relationship_score_history['name'] = dbSyncs[0]['name'];
                        relationship_score_history['number_of _calls'] = number_of_call;
                        if(number_of_call > 0){
                        relationship_score_history['total_talk_time'] = total_talk_time;           
                        relationship_score_history['sat_call'] = sat_call;
                        relationship_score_history['sat_call_bonus'] = (sat_call > 0) ? 10 : 0;
                        relationship_score_history['sunday_call'] = sun_call;
                        relationship_score_history['sunday_call_bonus'] = (sun_call > 0) ? 20 : 0;
                        relationship_score_history['non_working_call'] = weekend_call;
                        relationship_score_history['non_working_call_bonus'] = (weekend_call > 0) ? 20 : 0;
                        relationship_score_history['number_of_calls_bonus'] = number_of_calls_bonus(number_of_call);
                        relationship_score_history['avg_talk_time'] = Math.floor(total_talk_time/number_of_call);
                        relationship_score_history['avg_talk_time_bonus'] = avg_talk_time_bonus(relationship_score_history['avg_talk_time']);
                        relationship_score_history['relationship_score'] = relationship_score_history['sat_call_bonus']+relationship_score_history['sunday_call_bonus']+relationship_score_history['number_of_calls_bonus']+relationship_score_history['avg_talk_time_bonus']+relationship_score_history['non_working_call_bonus'];
                        relationship_score_history['Created_On'] = new Date();
                        relationship_score_history['Modified_On'] = new Date();
                        if(update_data == 'yes'){
                        var MongoClient = require('mongodb').MongoClient;
                        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                        let relationship_scores = db.collection('relationship_scores');
                        relationship_scores.insertOne(relationship_score_history, function (err, resp) {
                        if (err) {
                            res.send(err);
                        }
                        else
                        {
                        let update_data = {"ss_id":ss_id,"mobileno":mobile_no};
                        let todate = new Date();
                        Sync_Contact.update(update_data, {$set: {'relationship_score': relationship_score_history['relationship_score'],'relationship_score_on':todate}}).exec(function (err, dbdata) {
                           if (err) {
                            res.send(err);
                        }
                        });
                        }
                        });});
                        }
                        else
                        {
                            console.log("Updation permission in no");
                        }
                        }
                        console.log(relationship_score_history);
                        res.send(relationship_score_history);
                    }
                    else
                    {
                       if(update_data == 'yes'){
                       let update_data = {"ss_id":ss_id,"mobileno":mobile_no};
                        let todate = new Date();
                        Sync_Contact.update(update_data, {$set: {'relationship_score': relationship_score_history['relationship_score'],'relationship_score_on':todate}}).exec(function (err, dbdata) {
                           if (err) {
                            res.send(err);
                        }
                        });
                        }
                        res.send("Call History Not Found");
                    }
                } catch (e) {
                    res.send('<pre>' + e.stack + '</pre>');
                }
            });
        } catch (e) {
            res.send('<pre>' + e.stack + '</pre>');
        }
    });
    app.get('/sync_contacts/get_sync_contact_erp_datas/:mobileNumber/:ss_id', function (req, res) {
        try {
            var ss_id = parseInt(req.params.ss_id);
            var mobileNumber = parseInt(req.params.mobileNumber);
            var filter = {
                '$or':[
                    {mobile:mobileNumber},{mobile:req.params.mobileNumber}
                ]
            };
            sync_contact_erp_data.find(filter).select('ss_id fba_id mobile name erp_qt').sort({'policy_expiry_date': -1}).limit(1).exec(function (err, erpqtdata) {
                let erpqtResponse = {"Status": 0, "Msg": "Fail", "Data":{}};
                if (err) {
                    erpqtResponse['Msg'] = "Error";
                    erpqtResponse['Data'] = err;
                    res.json(erpqtResponse);
                } else {
                    if (erpqtdata && erpqtdata.length > 0) {
                        erpqtResponse.Status=1;
                        erpqtResponse.Msg="Success";
                        erpqtResponse.Data=erpqtdata[0];
                        res.json(erpqtResponse);
                    }else{
                        res.json(erpqtResponse);
                    }
                }
            });
        } catch (e) {
            res.json({"Status": 0, "Msg": "Error", "Data": e.stack});
        }
    });
	app.get('/sync_contacts/sync_contact_summaries/get_synced_agent_city', function (req, res) {
        try {  
			let Sync_Contact_Summary = require('../models/sync_contact_summary');
			Sync_Contact_Summary.distinct('City', {'Type':'POSP'}).exec(function (err, arr_Synced_Agent_Cities) {
				res.json(arr_Synced_Agent_Cities);
			});            
        } catch (e) {
            res.send(e.stack);
        }
    });
	app.get('/sync_contacts/sync_contact_summaries/get_synced_agent_state', function (req, res) {
        try {  
			let Sync_Contact_Summary = require('../models/sync_contact_summary');
			Sync_Contact_Summary.distinct('State', {'Type':'POSP','Stage' : {'$ne':''}}).exec(function (err, arr_Synced_Agent_States) {
				res.json(arr_Synced_Agent_States);
			});            
        } catch (e) {
            res.send(e.stack);
        }
    });
	app.get('/sync_contacts/referral_mobile', agent_details_pre, function (req, res) {
        var obj_summary = {
			'url' : '',
            'mobile_sent': 0,
            'mobile_received': 0,
            'mobile_not_received': 0,
            'total_data': 0,
			'full_data' : null,
            'error': ''
        };
        try {
            var objRequest = this;
            let mobileno = req.query['mobile'];
            obj_summary.mobile_sent = mobileno.split(',').length;
            var Ss_Id = req.query['ss_id'];
            var erp_id = 0;
            let mobilenoarr = mobileno.split(',');
            let emp_json_mobile = {};
            for (let i in mobilenoarr) {
                emp_json_mobile[mobilenoarr[i]] = [];
            }
            let fba_id = 0;
            if (req.hasOwnProperty('agent')) {
                if (req.agent['user_type'] === 'POSP') {
                    erp_id = req.agent['POSP']['Erp_Id'];
                    fba_id = req.agent['POSP']['Fba_Id'];
                }
                if (req.agent['user_type'] === 'FOS') {
                    erp_id = req.agent['EMP']['VendorCode'];
                    fba_id = req.agent['EMP']['FBA_ID'];
                }
                if (req.agent['user_type'] === 'EMP') {
                    erp_id = req.agent['EMP']['UID'];
                    fba_id = req.agent['EMP']['FBA_ID'];
                }                
                fba_id = ((fba_id - 0) > 0) ? (fba_id - 0) : 0;
                erp_id = ((erp_id - 0) > 0) ? (erp_id - 0) : 0;
            }

            var objRequest_new = {
                "mobileno": mobileno,
                "ss_id": Ss_Id - 0
            };
            objRequest = objRequest_new;
            var url_api = 'http://lerpci.policyboss.com/RBServices.svc/getSyncData?MobileNo=' + mobileno + '&POSPID=' + erp_id + '&fbaid=' + fba_id;
			obj_summary['url'] = url_api;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            client.get(url_api, function (data, response) {
                try {
                    var today = moment().utcOffset("+05:30");
                    var today_str = moment(today).format("YYYYMMD");
                    let status = '';
                    var objLog = {};
                    if (data) {
                        if (typeof data === 'string' && data.indexOf('{') > -1)
                        {
                            data = JSON.parse(data);
                        }
                        var todayDate = new Date();
                        if (data.hasOwnProperty('getSyncDataResult')) {                                                        
                            if (data['getSyncDataResult'] !== '' && data['getSyncDataResult'].length > 0)
                            {
                                status = 'Success';
                                let edata = data['getSyncDataResult'];
                                obj_summary.total_data = edata.length;
                                for (let k in edata)
                                {
                                    if (objRequest['mobileno'].indexOf(edata[k].Phone) > -1) {
                                        emp_json_mobile[edata[k].Phone].push(edata[k]);
                                    }
                                }
								obj_summary.full_data = emp_json_mobile;
                            } else {
                                status = 'NoDetails';
                            }
                        } else {
                            status = 'Data_Node_Missing';
                        }
                    } else {
                        status = 'Data_Null';
                    }
					
                    if (status === 'Data_Null' || status === 'Data_Node_Missing') {                        
                    } else {
                        for (let insertData in emp_json_mobile)
                        {
                            try {
                                
                                if (emp_json_mobile[insertData].length > 0)
                                {
                                    obj_summary.mobile_received++;
                                    
                                } else
                                {
                                    obj_summary.mobile_not_received++;
                                    
                                }                                
                            } catch (e) {
                                console.error('Exception', 'sync_contact_for_loop', e.stack);
                            }
                        }
                    }
                    return res.json({'Msg': status, 'Summary': obj_summary});
                } catch (ex) {
                    obj_summary.error = ex.stack;
                    console.error('Exception', 'Empdata', ex.stack)
                    return res.json({'Msg': 'Exception', 'Summary': obj_summary});
                }
            });
        } catch (errex) {
            obj_summary.error = errex.stack;
            console.error('Exception', 'Empdata', errex.stack)
            return res.json({'Msg': 'Exception', 'Summary': obj_summary});
        }
    });
	app.get('/sync_contact/get_sync_contact_agreements', (req, res) => {
    try {
            let sync_contact_agreement = require('../models/sync_contact_agreement');
            let objRequest = req.query;
            sync_contact_agreement.find({ss_id:objRequest.ss_id}, function (save_contact_master_err, save_contact_master) {
                if (save_contact_master_err) {
                    res.json({"Status": "Fail", "Msg": save_contact_master_err});
                } else {
                    if (save_contact_master.length > 0) {
                        res.json({"Status": "Success", "Msg":save_contact_master});
                    }else{
                        res.json({"Status": "Fail", "Msg":"No Data Found"});
                    }
                }
            });
        } catch (err) {
            res.json({"Status": "Fail", "Msg": err.stack});
        }
});
	app.get('/sync_contacts/check_status_by_reg_mobile', (req, res) => {
		try {
			let sync_contact_agreement = require('../models/sync_contact_agreement');			
			let Vehicle_Reg_No = req.query['registration_no'] || '';
			let Mobile_No = req.query['mobile_no'] || '';
			let Obj_Sync_Contact_Status = {
				"status" : "PENDING",
				"agent_count" : 0,				
				"data_count" : 0,
				"lead_count" : 0,
				"mobile" : [],
				"lead" : [],
				"data" : [],
				"agent" : [],
								
			}
			if(Vehicle_Reg_No !== ''){
				Vehicle_Reg_No = Vehicle_Reg_No.toUpperCase().replace(/\-/g,'');
				sync_contact_erp_data.find({'registration_no':Vehicle_Reg_No}, function (sync_contact_erp_data_err, sync_contact_erp_data_datas) {
					Obj_Sync_Contact_Status['status'] = "FAIL";
					if (sync_contact_erp_data_datas) {
						Obj_Sync_Contact_Status['status'] = "SUCCESS";
						Obj_Sync_Contact_Status['data'] = sync_contact_erp_data_datas;
						Obj_Sync_Contact_Status['data_count'] = sync_contact_erp_data_datas.length;
						for(let Single_Sync_Contact of sync_contact_erp_data_datas){
							Obj_Sync_Contact_Status['agent'].push(Single_Sync_Contact._doc['ss_id']);
							if(Obj_Sync_Contact_Status['mobile'].indexOf(Single_Sync_Contact._doc['sync_Mobile']) === -1){
								Obj_Sync_Contact_Status['mobile'].push(Single_Sync_Contact._doc['sync_Mobile']);
							}
							if(Single_Sync_Contact._doc['Is_Lead_Created'] === 1){
								Obj_Sync_Contact_Status['lead'].push(Single_Sync_Contact._doc['ss_id']);
							}
						}
						Obj_Sync_Contact_Status['agent_count'] = Obj_Sync_Contact_Status['agent'].length;
						Obj_Sync_Contact_Status['lead_count'] = Obj_Sync_Contact_Status['lead'].length;
					}
					return res.json(Obj_Sync_Contact_Status);	
				});
			}
		} catch (err) {
			res.json({"Status": "Fail", "Msg": err.stack});
		}
	});
    app.post('/sync_contact_dashboard_lead_count_NIU', agent_details_pre, function (req, res, next) {
        try {
            var Ss_Id = req.body.ss_id - 0;
            var Fba_Id = req.body.fba_id - 0;
            var sync_contact_erp_data = require('../models/sync_contact_erp_data');
            Sync_Contact.find({ss_id: Ss_Id, fba_id: Fba_Id}, function (err, dbSync_Contacts) {
                var contact_res = {
                    "available_leads": 0
                };
                if (dbSync_Contacts.length > 0) {
                    sync_contact_erp_data.find({ss_id: Ss_Id, fba_id: Fba_Id, 'product': 'MOTOR', 'Is_Valid': 1, 'policy_expiry_date': {$gte: moment(req.body.startDate, 'DD-MM_YYYY').format('YYYY-MM-DD'), $lte: moment(req.body.endDate, 'DD-MM_YYYY').format('YYYY-MM-DD')}, Is_Lead_Created: 0}).count().exec(function (err, dbSync_contact_erp_datas_count) {
                        if (err) {
                            res.send(err);
                        }
                        contact_res['available_leads'] = dbSync_contact_erp_datas_count;
                        res.json(contact_res);
                    });
                } else {
                    res.json(contact_res);
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    
    app.get('/sync_contacts/set_coin_lead_data_agent', agent_details_pre, function (req, res, next) {
        try {
            var today = moment().utcOffset("+05:30").startOf('Day');
            let lead_start_date = (req.query.lead_start_date && moment(req.query.lead_start_date, 'YYYY-MM-DD', true).isValid()) ? moment(req.query['lead_start_date']).format("YYYY-MM-DD") : moment(today).add(14, 'days').format("YYYY-MM-DD");
            let lead_end_date = (req.query.lead_end_date && moment(req.query.lead_end_date, 'YYYY-MM-DD', true).isValid()) ? moment(req.query['lead_end_date']).format("YYYY-MM-DD") : "";
            let temp_start_month = lead_start_date.split('-')[1];
            let temp_start_date = lead_start_date.split('-')[2];
            let temp_end_month = lead_end_date.split('-')[1];
            let temp_end_date = lead_end_date.split('-')[2];
            let objforMonth = {"01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"};
            function getMonthRange(startDate, endDate) {
                let start = new Date(startDate);
                let end = new Date(endDate);
                if (start > end) {
                    [start, end] = [end, start];
                }
                let months = [];
                while (start <= end) {
                    let currentMonth = start.getMonth() + 1;
                    let formattedMonth = currentMonth.toString();
                    formattedMonth = ((formattedMonth).length > 1) ? currentMonth : "0" + currentMonth;
                    months.push(formattedMonth);
                    start.setMonth(start.getMonth() + 1);
                }

                return months;
            }
            let search_month = getMonthRange(lead_start_date, lead_end_date);
            console.error("search_month:", search_month);
            function removeDuplicateSearchMonth(filter_month) {
                return filter_month.filter((value, index) => filter_month.indexOf(value) === index);
            }
            search_month = removeDuplicateSearchMonth(search_month);
            let search_in_month_name = [];
            for (let i in search_month) {
                search_in_month_name.push(objforMonth[search_month[i]]);
            }
            console.error("search_in_month_name", search_in_month_name);
            
            let Condi_Sync_Contanct_Lead = {
                'Is_Lead_Created': 0,
                'Is_Valid': 1,
                policy_expiry_month: {$in: search_in_month_name}
            };
            let ss_id = null;
            let fba_id = null;
            if (req.query.hasOwnProperty('ss_id') && req.query['ss_id'] !== '' && req.query.hasOwnProperty('fba_id') && req.query['fba_id'] !== '') {
                ss_id = req.query['ss_id'] - 0;
                fba_id = req.query['fba_id'] - 0;
                Condi_Sync_Contanct_Lead['ss_id'] = ss_id;
                Condi_Sync_Contanct_Lead['fba_id'] = fba_id;
            }
            let op = (req.query.hasOwnProperty('op') && req.query['op'] !== '') ? req.query['op'] : 'preview';
            var Email = require('../models/email');
            var objModelEmail = new Email();
            var lead_res = {
                'Condi': Condi_Sync_Contanct_Lead,
                'Op': op,
                "Mode": 'agent',
                "On": '',
                "Status": "",
                "Msg": "",
                "totalcount": 0,
                "Data_Processed": [],
                "Data_Exception": [],
                "Data_Inner_Exception": [],
                'Agent_Summary': {},
                'date_slab_summary': {
                    'Expiring_Today': {'slab': 'Expiring_Today', 'count': 0},
                    'Expiring_in_within_3_Days': {'slab': 'Expiring_in_within_3_Days', 'count': 0},
                    'Expiring_in_Next_3_to_7_Days': {'slab': 'Expiring_in_Next_3_to_7_Days', 'count': 0},
                    'Expiring_in_Next_7_to_15_Days': {'slab': 'Expiring_in_Next_7_to_15_Days', 'count': 0},
                    'Expiring_in_Next_15_to_30_Days': {'slab': 'Expiring_in_Next_15_to_30_Days', 'count': 0},
                    'Expiring_beyond_30_Days': {'slab': 'Expiring_beyond_30_Days', 'count': 0},
                    'ALL': {'slab': 'ALL', 'count': 0}
                }
            };
            var limit = (req.query.hasOwnProperty('limit')) ? req.query['limit'] - 0 : 2000;
            var channel = '';
            let agent_details = {};
            lead_res['Agent_Summary'] = {
                'profile': null,
                'lead_list': [],
                'lead_count': 0
            };
            channel = (req.agent && req.agent.channel && req.agent['channel']) || "";
            if (req.agent['user_type'] === 'POSP') {
                agent_details = {
                    'type': req.agent['user_type'],
                    'agent_name': req.agent['POSP']['First_Name'] + ' ' + req.agent['POSP']['Last_Name'],
                    'agent_email': req.agent['POSP']['Email_Id'],
                    'ss_id': ss_id,
                    'fba_id': fba_id,
                    'erp_code': req.agent['POSP']['Erp_Id'],
                    'rm_name': req.agent['POSP']['Reporting_Agent_Name'],
                    'rm_uid': req.agent['POSP']['Reporting_Agent_Uid'],
                    'rm_email': req.agent['POSP']['Reporting_Email_ID']
                };
            }
            if (req.agent['user_type'] === 'FOS') {
                agent_details = {
                    'type': req.agent['user_type'],
                    'agent_name': req.agent['EMP']['Emp_Name'],
                    'agent_email': req.agent['EMP']['Email_Id'],
                    'ss_id': ss_id,
                    'fba_id': fba_id,
                    'erp_code': req.agent['EMP']['VendorCode'],
                    'rm_name': req.agent['EMP']['Reporting_UID_Name'],
                    'rm_uid': req.agent['EMP']['UID'],
                    'rm_email': req.agent['EMP']['Reporting_Email_ID']
                };
            }
            if (req.agent['user_type'] === 'EMP') {
                agent_details = {
                    'type': req.agent['user_type'],
                    'agent_name': req.agent['EMP']['Emp_Name'],
                    'agent_email': req.agent['EMP']['Email_Id'],
                    'ss_id': ss_id,
                    'fba_id': fba_id,
                    'erp_code': req.agent['EMP']['UID'],
                    'rm_name': '',
                    'rm_uid': '',
                    'rm_email': ''
                };
            }
            lead_res['Agent_Summary']['profile'] = agent_details;
            let mode = 'agent';
            let obj_link_schema = {
                'Expiring_Today': 0,
                'Expiring_in_within_3_Days': 3,
                'Expiring_in_Next_3_to_7_Days': 7,
                'Expiring_in_Next_7_to_15_Days': 15,
                'Expiring_in_Next_15_to_30_Days': 60,
                'Expiring_beyond_30_Days': 300
            };
            if (op === 'count') {
                sync_contact_erp_data.count(Condi_Sync_Contanct_Lead).sort({policy_expiry_date: 1}).exec(function (err, leadCount) {
                    var objSummary = {
                        'Condi': Condi_Sync_Contanct_Lead,
                        'Count': leadCount
                    };
                    return res.send('<pre>' + JSON.stringify(objSummary, undefined, 2) + '</pre>');
                });
            } else {
                console.error("Condi_Sync_Contanct_Lead", Condi_Sync_Contanct_Lead);
                let quote_data_obj = {};
                for (let month in search_month) {
                    quote_data_obj[search_month[month]] = [];
                }
                console.error("first_quote_data_obj", quote_data_obj);
                sync_contact_erp_data.find(Condi_Sync_Contanct_Lead).sort({policy_expiry_date: 1}).exec(function (err, db_sync_contact_erp_data) {
                    console.error("db_sync_contact_erp_data", db_sync_contact_erp_data);
                    let filter_quote_month_data = db_sync_contact_erp_data;
                    let loop_count = 0;
                    for (let k in filter_quote_month_data) {
                        let policy_expiry_date = filter_quote_month_data[k]._doc.policy_expiry_date;
                        let temp_policy_expiry_month = policy_expiry_date.split('-')[1];
                        let temp_policy_expiry_date = policy_expiry_date.split('-')[2];
                        if (quote_data_obj.hasOwnProperty(temp_policy_expiry_month)) {
                            if (search_month.length > 1) {
                                if (temp_policy_expiry_month == search_month[0]) {
                                    quote_data_obj[temp_policy_expiry_month].push(filter_quote_month_data[k]);
                                    loop_count++;
                                }
                                if (search_month.length >= 2) {
                                    if (temp_policy_expiry_month != search_month[0]) {
                                        quote_data_obj[temp_policy_expiry_month].push(filter_quote_month_data[k]);
                                        loop_count++;
                                    }
                                }
                            } else {
                                if (search_month.length == 1) {
                                    quote_data_obj[temp_policy_expiry_month].push(filter_quote_month_data[k]);
                                    loop_count++;
                                } else if ((temp_policy_expiry_date >= temp_start_date) &&
                                        (temp_policy_expiry_date < temp_end_date)) {
                                    quote_data_obj[temp_policy_expiry_month].push(filter_quote_month_data[k]);
                                    loop_count++;
                                }
                            }
                        }
                    }
                    console.error("second_quote_data_obj after month array filter", quote_data_obj);
                    console.error("loop_count", loop_count);
                    
                    let temp_quote_data = [];
                    let temp_limit = 0;
                    if (temp_start_month == temp_end_month) {
                        let temp_filter_arr_data = quote_data_obj[temp_start_month];
                        for (let j = 0; j < temp_filter_arr_data.length && temp_limit < limit; j++) {
                            temp_quote_data.push(temp_filter_arr_data[j]);
                            temp_limit++;
                        }
                    }
                    if (temp_start_month < temp_end_month) {
                        for (let i = temp_start_month; i <= temp_end_month && temp_limit < limit; i++) {
                            let index = i.toString();
                            index = ((index).length > 1) ? index : "0" + index;
                            let temp_filter_arr_data = quote_data_obj[index];
                            let filter_key_data_length = temp_filter_arr_data ? temp_filter_arr_data.length : 0;
                            if (filter_key_data_length > 0) {
                                for (let j = 0; j < temp_filter_arr_data.length && temp_limit < limit; j++) {
                                    temp_quote_data.push(temp_filter_arr_data[j]);
                                    temp_limit++;
                                }
                            }
                        }
                    }

                    let temp_change_start_month = temp_start_month;
                    if (temp_start_month > temp_end_month) {
                        for (let i = 1; i <= search_month.length && temp_limit < limit; i++) {
                            let month = temp_change_start_month.toString();
                            month = ((month).length > 1) ? month : "0" + month;
                            let temp_filter_arr_data = quote_data_obj[month];
                            let filter_key_data_length = temp_filter_arr_data ? temp_filter_arr_data.length : 0;

                            if (filter_key_data_length > 0) {
                                for (let j = 0; j < temp_filter_arr_data.length && temp_limit < limit; j++) {
                                    temp_quote_data.push(temp_filter_arr_data[j]);
                                    temp_limit++;
                                }
                            }

                            temp_change_start_month = (temp_change_start_month % 12) + 1;
                        }
                    }
                    console.error('Third filter temp_quote_data', temp_quote_data);
                    let quote_data = temp_quote_data;
                    if (quote_data.length > 0) {
                        var Lead = require('../models/leads');
                        let Client = require('node-rest-client').Client;
                        let client = new Client();
                        console.log("sync_fetch_data", quote_data);
                        for (let k in quote_data) {
                            let rwnluserData = quote_data[k]._doc;
                            try {
                                let arg = {};
                                let Policy_Expiry_Date = moment(rwnluserData['policy_expiry_date']).utcOffset("+05:30").startOf('Day');
                                let days_diff = Policy_Expiry_Date.diff(today, 'days');
                                days_diff = days_diff - 0;
                                let follow_slab = 'Expiring_beyond_30_Days';
                                for (let j in obj_link_schema) {
                                    if (days_diff <= obj_link_schema[j]) {
                                        follow_slab = j;
                                        break;
                                    }
                                }
                                lead_res['date_slab_summary'][follow_slab]['count']++;
                                lead_res['date_slab_summary']['ALL']['count']++;
                                lead_res['totalcount']++;
                                if (mode === 'agent') {
                                    let policy_expiry_date = rwnluserData['policy_expiry_date'];
                                    let yom = rwnluserData['yom'];
                                    let vehicle_registration_date = yom + '-' + moment(policy_expiry_date).add(1, 'days').format("MM-DD");
                                    let vehicle_manf_date = yom + '-01-10';
                                    lead_res['Agent_Summary']['lead_list'].push({
                                        'Contact_Id': rwnluserData['Sync_Contact_Erp_Data_Id'],
                                        "Customer_Name": rwnluserData['name'],
                                        "Product": rwnluserData['product'],
                                        "Policy_Expiry_Date": rwnluserData['policy_expiry_date'],
                                        "Registration_No": rwnluserData['registration_no']
                                    });
                                    arg = {
                                        "PB_CRN": "",
                                        "User_Data_Id": "",
                                        "ss_id": rwnluserData['ss_id'],
                                        "fba_id": rwnluserData['fba_id'],
                                        'ERP_QT': rwnluserData['erp_qt'] || '',
                                        "channel": channel,
                                        "Created_On": new Date(),
                                        "Modified_On": new Date(),
                                        "Product_Id": 1,
                                        "previous_policy_number": "",
                                        "prev_policy_start_date": "",
                                        "policy_expiry_date": rwnluserData['policy_expiry_date'],
                                        "engine_number": "",
                                        "chassis_number": "",
                                        "company_name": "",
                                        "Customer_Name": rwnluserData['name'],
                                        "Customer_Address": "",
                                        "mobile": rwnluserData['mobile'],
                                        "email": "",
                                        "mobile2": "", //ErpqtRqst['__communication_address__'],
                                        "vehicle_insurance_type": "individual", //ErpqtRqst['__vehicle_insurance_type__'] === "new" ? "N" : "R",
                                        "issued_by_username": "", //to be ask
                                        "registration_no": rwnluserData['registration_no_processed'],
                                        "registration_no_processed": rwnluserData['registration_no_processed'],
                                        "nil_dept": "", //ErpqtRqst['__addon_zero_dep_cover__'] === "yes" ? "Yes" : "No",
                                        "rti": "", //to be ask
                                        "Make_Name": rwnluserData['make'],
                                        "Model_ID": "", //ErpqtRqst['__pb_model_id__'],
                                        "Model_Name": rwnluserData['model'], //ErpqtRqst['__pb_model_name__'],
                                        "Variant_Name": rwnluserData['variant'], //ErpqtRqst['__pb_variant_name__'],
                                        "Vehicle_ID": "", //ErpqtRqst['__vehicle_id__'],
                                        "Fuel_ID": "", //ErpqtRqst['__pb_fuel_id__'],
                                        "Fuel_Name": "", //ErpqtRqst['__pb_fuel_name__'],
                                        "RTO_City": rwnluserData['rto_city'], //ErpqtRqst['__pb_rto_city__'],
                                        "RTO_State": rwnluserData['rto_state'], //ErpqtRqst['__pb_rto_city__'],
                                        "VehicleCity_Id": "", //ErpqtRqst['__pb_vehiclecity_id__'],
                                        "VehicleCity_RTOCode": "", //ErpqtRqst['__pb_vehiclecity_rtocode__'],
                                        "vehicle_registration_date": vehicle_registration_date, //ErpqtRqst['__vehicle_registration_date__'],
                                        "vehicle_manf_date": vehicle_manf_date, //ErpqtRqst['__vehicle_manf_date__'],
                                        "prev_insurer_id": 0, //ErpqtRqst['__insurer_id__'],
                                        "vehicle_ncb_current": "", //rwnluserData.Premium_List.Summary.Request_Product['vehicle_ncb_next'],
                                        "is_claim_exists": "", //ErpqtRqst['__is_claim_exists__'],
                                        "is_renewal_proceed": "no",
                                        "lead_type": "sync_contacts",
                                        "lead_status": "pending",
                                        "lead_assigned_uid": null,
                                        "lead_assigned_name": "",
                                        "lead_assigned_ssid": null,
                                        "lead_assigned_on": new Date(),
                                        'agent_details': agent_details
                                    };
                                    lead_res['Data_Processed'].push(rwnluserData['Sync_Contact_Erp_Data_Id']);
                                    if (op === 'execute') {
                                        let condi_update_sync = {'Sync_Contact_Erp_Data_Id': rwnluserData['Sync_Contact_Erp_Data_Id']};
                                        console.error('Exception', 'Lead_Add', 'Sync_Update', condi_update_sync);
                                        sync_contact_erp_data.update(condi_update_sync, {$set: {'Is_Lead_Created': 1}}, function (err, numAffected) {
                                            if (err)
                                            {
                                                console.error('Exception', 'Lead_Add', 'Sync_Update', err);
                                            } else {
                                                let objModelLead = new Lead(arg);
                                                objModelLead.save(function (err, objDbLead) {
                                                    if (err)
                                                    {
                                                        console.error('Exception', 'Lead_Add', 'Lead_Allocate', err, arg);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            } catch (e) {
                                lead_res['Data_Exception'].push({
                                    'id': rwnluserData['Sync_Contact_Erp_Data_Id'],
                                    'msg': e.stack
                                });
                            }
                        }
                    }
                    lead_res['On'] = moment().format('YYYY-MM-DD_HH:mm:ss');
                    lead_res['Msg'] = "Data Uploaded Successfylly in Lead";
                    var today = new Date();
                    var today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
                    var log_file_name = today.toISOString().substring(0, 10).toString().replace(/-/g, '');
                    fs.appendFile(appRoot + "/tmp/log/sync_contact_lead_allocate_" + log_file_name + ".log", JSON.stringify(lead_res) + '\r\n', function (err) {

                    });
                    if (mode === 'agent' && lead_res.Agent_Summary['lead_list'].length > 0) {
                        lead_res.Agent_Summary['lead_count'] = lead_res.Agent_Summary['lead_list'].length;
                        let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                        res_report += '<p><h1>SYNC CONTACT LEAD ALLOCATION REPORT :: Total Lead-' + lead_res.Agent_Summary['lead_count'] + ' :: SSID-' + ss_id + ' :: ' + today_str + '</h1></p>';
                        res_report += '<p><h1>Details</h1>' + objectToHtml(lead_res.Agent_Summary['profile']) + '</p>';
                        res_report += '<p><h1>Date Range Summary</h1>';
                        res_report += arrayobjectToHtml(lead_res['date_slab_summary']);
                        res_report += '<p><h1>List</h1>';
                        res_report += arrayobjectToHtml(lead_res.Agent_Summary['lead_list'], 'Lead Allocation List', '', ['Registration_No']);
                        res_report += '</p>';
                        res_report += '</body></html>';
                        let sub = '[SCHEDULER]LEAD_SYNC_CONTACT_AGENT - Total Lead - ' + lead_res.Agent_Summary['lead_count'] + ' :: SSID-' + ss_id + ' :: ' + moment().format('YYYYMMDD_HH:mm:ss');
                        let to = config.environment.notification_email;
                        let cc = '';
                        let bcc = '';
                        if (req.query['op'] === 'execute' && req.query['email_agent'] === 'yes') {
                            to = lead_res.Agent_Summary['profile']['agent_email'];
                            cc = lead_res.Agent_Summary['profile']['rm_email'];
                            bcc = config.environment.notification_email;
                        }
                        objModelEmail.send('customercare@policyboss.com', to, sub, res_report, cc, bcc, '');
                    }
                    return res.json(lead_res);
                });
            }
        } catch (err) {
            lead_res['Data_Exception'].push({
                'msg': err.stack
            });
            res.json(lead_res);
        }
    });
};
    function number_of_calls_bonus(number_of_calls)
    {
        var score_logic_slab = 0;
        var arr_logic = [10,25,50,75,100,150,200,350,500];
        if(number_of_calls > 500)
        {
            score_logic_slab = 600;
        }
        else
        {
        for (var k in arr_logic) {
            if (number_of_calls <= arr_logic[k]) {
                score_logic_slab = arr_logic[k];
                break;
            }
        }
    }
        var data = 
                {
                    '10':5,
                    '25':10,
                    '50':15,
                    '75':20,
                    '100':25,
                    '150':30,
                    '200':35,
                    '350':40,
                    '500':45,
                    '600':50
                };
        let number_of_calls_bonus = data[score_logic_slab];
        return number_of_calls_bonus;
        
    }
    function avg_talk_time_bonus(avg_talk_time)
    {
        var score_logic_slab = 0;
        var arr_logic = [120,300,600,1200,1800];
        if(avg_talk_time > 1800)
        {
            score_logic_slab = 18000;
        }
        else
        {
        for (var k in arr_logic) {
            if (avg_talk_time <= arr_logic[k]) {
                score_logic_slab = arr_logic[k];
                break;
            }
        }
    }
        var data = 
                {
                    '120':5,
                    '300':10,
                    '600':20,
                    '1200':30,
                    '1800':40,
                    '18000':50
                };
        let avg_talk_time_bonus = data[score_logic_slab];
        return avg_talk_time_bonus;
    }
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
function reg_no_format(Registration_Num) {

    if ([9, 10, 11].indexOf(Registration_Num.length) > -1) {
        var lastfour = Registration_Num.substr(Registration_Num.length - 4);
        var lastdigit = lastfour.match(/\d/g);
        if (lastdigit !== null) {
            lastdigit = lastdigit.join("");
            if (lastdigit.toString().length > 0) {
                if (lastdigit.toString().length < 4) {
                    var lastdigitnumber = lastdigit - 0;
                    var lastdigitpadzero = pad(lastdigitnumber, 4);
                    Registration_Num = Registration_Num.replace(lastdigit, lastdigitpadzero);
                }
                if (Registration_Num.length === 11) {
                    Registration_Num = Registration_Num.substring(0, 2) + '-' + Registration_Num.substring(2, 4) + '-' + Registration_Num.substring(4, 7) + '-' + Registration_Num.substring(7, 11);
                }
                if (Registration_Num.length === 10) {
                    Registration_Num = Registration_Num.substring(0, 2) + '-' + Registration_Num.substring(2, 4) + '-' + Registration_Num.substring(4, 6) + '-' + Registration_Num.substring(6, 10);
                }
                if (Registration_Num.length === 9) {
                    Registration_Num = Registration_Num.substring(0, 2) + '-' + Registration_Num.substring(2, 4) + '-' + Registration_Num.substring(4, 5) + '-' + Registration_Num.substring(5, 9);
                }
            }
        }
    }
    return Registration_Num;
}
function web_agent_details_pre(req, res, next) {
    var ss_id = 0;
    var session_id = req.params['session_id'];
    var Session = require('../models/session');
    var fba_id = 0;
    var obj_session;
    Session.findOne({ "_id": session_id }, function (err, dbSession) {
        if (err) {
            res.send(err);
        } else {
            if (dbSession) {
                dbSession = dbSession._doc;
                if(dbSession && dbSession.session){
                    obj_session = JSON.parse(dbSession['session']);
                }
                ss_id = obj_session.user && obj_session.user.ss_id ? obj_session.user.ss_id - 0 : ss_id;
                fba_id = obj_session.user && obj_session.user.fba_id ? obj_session.user.fba_id - 0 : fba_id;
            }
            req.ss_id = ss_id;
            req.fba_id = fba_id;
            if (ss_id > 0) {
                var Client = require('node-rest-client').Client;
                var client = new Client();
                client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id.toString(), {}, function (data, response) {
                    if (data['status'] === 'SUCCESS') {
                        req.agent = data;
                    } else {
                        //res.send('AGENT_NOT_EXIST<br>' + '<pre>' + JSON.stringify(req.query, undefined, 2) + '</pre>');
                    }
                    return next();
                });
            } else {
                return next();
            }
        }
    });
}
function agent_details_pre(req, res, next) {
    var ss_id = 0;
    if (req.query.hasOwnProperty('ss_id') && req.query['ss_id'] > 0) {
        ss_id = req.query['ss_id'] - 0;
    } else {
        if (typeof req.body['ssid'] !== 'undefined' && req.body['ssid'] > 0) {
            ss_id = req.body['ssid'] - 0;
        }
    }

    if (req.params.hasOwnProperty('ss_id') && (req.params.ss_id - 0) > 0) {
        ss_id = req.params.ss_id - 0;
    }

    if (ss_id > 0) {
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id.toString(), {}, function (data, response) {
            if (data['status'] === 'SUCCESS') {
                req.agent = data;
            } else {
                //res.send('AGENT_NOT_EXIST<br>' + '<pre>' + JSON.stringify(req.query, undefined, 2) + '</pre>');
            }
            return next();
        });
    } else {
        return next();
    }
}
function pad(str, width) {
    while (str.length < width)
        str = "0" + str;
    return str;
}
function arrayobjectToHtml(objSummary, Title = 'Report', SubTitle = '', ColumnToExclude = []) {
    var msg = '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;font-weight:bold">' + Title + '</span>';
    if (SubTitle !== '') {
        msg += '<span  style="font-family:\'Google Sans\' ,tahoma;font-size:12px;">' + SubTitle + '</span>';
    }
    msg += '<table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:         1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  >';
    var row_inc = 0;
    for (var k in objSummary) {
        if (row_inc === 0) {
            msg += '<tr>';
            for (var k_head in objSummary[k]) {
                if (ColumnToExclude.indexOf(k_head) < 0) {
                    msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01;text-align:center;"  align="center">' + k_head + '</th>';
                }
            }
            msg += '</tr>';
        }
        msg += '<tr>';
        for (var k_row in objSummary[k]) {
            if (ColumnToExclude.indexOf(k_row) < 0) {
                msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;;text-align:center;" align="center">' + objSummary[k][k_row] + '</td>';
            }
        }
        msg += '</tr>';
        row_inc++;
    }
    msg += '</table></div>';
    return msg;
}
function objectToHtml(objSummary) {

    var msg = '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Report</span><table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:         1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  >';
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
function sync_contact_email(objCallSummary) {
    try {
        if (objCallSummary.main.done_job === objCallSummary.main.total_job)
        {
            var today = moment().utcOffset("+05:30");
            var today_str = moment(today).format("YYYYMMD");
            var objRequest = {
                'dt': today.toLocaleString(),
                'resp': objCallSummary
            };
            fs.appendFile(appRoot + "/tmp/log/contact_syncing_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
                if (err) {
                    return console.log(err);
                }
            });
            objCallSummary.main.success_job_cnt = objCallSummary.success_job.length;
            objCallSummary.main.fail_job_cnt = objCallSummary.fail_job.length;
            objCallSummary.main.nodetail_job_cnt = objCallSummary.nodetail_job.length;
            var Email = require('../models/email');
            var objModelEmail = new Email();
            var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-SYNC_CONTACT-' + moment().format('YYYY-MM-DD_HH:mm:ss');
            let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
            res_report += '<p><h1>CONTACT ERP SYNC REPORT</h1></p>';
            res_report += '<p><h1>Details</h1>' + objectToHtml(objCallSummary.main) + '</p>';
            res_report += arrayobjectToHtml(objCallSummary['success_job'], 'Success Job', '', ['url', 'error', 'status']);
            //res_report += arrayobjectToHtml(objCallSummary['nodetail_job'], 'NoDetail Jon', '', ['url']);
            res_report += arrayobjectToHtml(objCallSummary['fail_job'], 'Fail Job', '', ['url']);
            res_report += '</p>';
            res_report += '</body></html>';
            objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, res_report, '', '', '');
        }
    } catch (e) {
        console.error('Exception', 'sync_contact_email', e.stack);
    }
}
function sortObjectByVal(obj) {
//var list = {"you": 100, "me": 75, "foo": 116, "bar": 15};
    var keysSorted = Object.keys(obj).sort(function (a, b) {
        return obj[b] - obj[a]
    });
    var newObj = {};
    for (var x of keysSorted) {
        newObj[x] = obj[x];
    }
    return newObj;
}
function randomString(length, chars) {
    chars = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
function agent_details_pre_form(req, res, next) {
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var ss_id = 0;
        if (fields.hasOwnProperty('ss_id') && fields['ss_id'] > 0) {
            ss_id = fields['ss_id'] - 0;
        }

        if (ss_id > 0) {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id.toString(), {}, function (data, response) {
                if (data['status'] === 'SUCCESS') {
                    req.agent = data;
                    req.files = files;
                } else {
                    //res.send('AGENT_NOT_EXIST<br>' + '<pre>' + JSON.stringify(req.query, undefined, 2) + '</pre>');
                }
                return next();
            });
        } else {
            return next();
        }
    });
}
function posp_historic_handler(obj_sale_historic, req, res) {
    let all_done = true;
    for (let k in obj_sale_historic) {
        if (k !== 'cache' && obj_sale_historic[k]['count'] === null) {
            all_done = false;
            break;
        }
    }
    if (all_done === true) {
		if(req.query.hasOwnProperty('report_cache_key') && req.query['report_cache_key'] !== ''){
			fs.writeFile(appRoot + "/tmp/cachereport/" + req.query['report_cache_key'] + ".log", JSON.stringify(obj_sale_historic), function (err) {
				if (err) {
					return console.error(err);
				}
				res.json(obj_sale_historic);
			});
		}
		else{
			res.json(obj_sale_historic);
		}
    }
}
