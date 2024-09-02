/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var fs = require('fs');
var moment = require('moment');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
var mongojs = require('mongojs');
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
var Employee = require('../models/employee');
var User = require('../models/user');
module.exports.controller = function (app) {
    /**
     * a home page route
     */
    app.get('/employees/view/:Employee_Id', function (req, res) {
        Employee.findOne({Emp_Id: parseInt(req.params.Employee_Id)}, function (err, employee) {
            if (err)
                res.send(err);

            res.json(employee['_doc']);
        });
    });
    app.post('/employees', function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: '',
            sort: {'Modified_On': 'desc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);

        }
        var filter = obj_pagination.filter;
        console.error('Filter', req.body);
        if (req.body['search[value]'] !== '') {
            if (isNaN(req.body['search[value]'])) {
                filter = {
                    $or: [
                        {'Request_Unique_Id': new RegExp(req.body['search[value]'], 'i')},
                        {'Employee_Unique_Id': new RegExp(req.body['search[value]'], 'i')},
                        {'Method_Type': new RegExp(req.body['search[value]'], 'i')},
                        {'Error_Code': new RegExp(req.body['search[value]'], 'i')}
                    ]
                };
            } else {
                filter = {'Product_Id': parseInt(req.body['Product_Id'])};
            }
        } else {
            filter = {'Is_Active': true};
            if (req.body['page_action'] === 'ch_employee_list') {
                if (req.body['uid'] == '112666') {
                    filter['Sources'] = '8';
                }
                if (req.body['uid'] == '100151') {
                    filter['Sources'] = '2';
                }
                if (req.body['uid'] == '107124') {
                    filter['Sources'] = '1';
                }
            }
            if (req.body['page_action'] === 'employee_list') {
                filter['Reporting_Agent_Uid'] = req.body['uid'] - 0;
            }
            if (typeof req.body['Col_Name'] == 'string' && req.body['Col_Name'] !== '' && req.body['txtCol_Val'] !== '') {
                filter[req.body['Col_Name']] = (req.body['Col_Name'] === 'Ss_Id') ? req.body['txtCol_Val'] - 0 : req.body['txtCol_Val'];
            }
            if (req.body['Last_Status_Group'] !== '') {
                var objStatusSummary = {
                    'Lead/Cordinated/Registered': [1, 2, 3],
                    'DocumentUpload/Verified': [4, 5],
                    'Doc_Declined_Before_Certification': [6],
                    'TrainingSchedule': [7, 10, 15],
                    'TrainingPass': [8, 11, 16],
                    'TrainingFail': [9, 12, 17],
                    'Certified': [13, 14, 18],
                    'Doc_Declined_After_Certification': [6]
                };
                if (objStatusSummary.hasOwnProperty(req.body['Last_Status_Group'])) {
                    var arr_last_status = [];
                    for (var k in objStatusSummary[req.body['Last_Status_Group']]) {
                        arr_last_status.push(objStatusSummary[req.body['Last_Status_Group']][k].toString())
                    }
                    filter['Last_Status'] = {$in: arr_last_status};
                }
            }
        }


        Employee.paginate(filter, optionPaginate).then(function (employees) {
            console.log(obj_pagination.filter, optionPaginate, employees);
            res.json(employees);
        });
    });
    app.post('/dsas', LoadSession, function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: '',
            sort: {'Emp_Id': 'desc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        console.error('Filter', req.body);
        if (req.body['search[value]'] !== '') {
            if (isNaN(req.body['search[value]'])) {
                filter = {
                    $or: [
                        {'Request_Unique_Id': new RegExp(req.body['search[value]'], 'i')},
                        {'Employee_Unique_Id': new RegExp(req.body['search[value]'], 'i')},
                        {'Method_Type': new RegExp(req.body['search[value]'], 'i')},
                        {'Error_Code': new RegExp(req.body['search[value]'], 'i')}
                    ]
                };
            } else {
                filter = {'Product_Id': parseInt(req.body['Product_Id'])};
            }
        } else {
            filter = {'IsActive': 1};
            
            filter['Role_ID'] = 0;
			if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.role_detail.role.indexOf('Recruiter') > -1) {
				filter['Role_ID'] = {$in: Object.keys(config.channel.Const_FOS_Channel).map(Number)};
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                let obj_dsa_role_channel = swap(config.channel.Const_FOS_Channel);
                var arr_role = [];
                for (var x of req.obj_session.user.role_detail.channel_agent) {
                    arr_role.push(obj_dsa_role_channel[x] - 0);
                }
                filter['Role_ID'] = {$in: arr_role};
				
            } else {                
				filter['Emp_Id'] = {$in: req.obj_session.users_assigned.Team.DSA};
				filter['Role_ID'] = {$in: Object.keys(config.channel.Const_FOS_Channel).map(Number)};
            }
			
			/*
            if (req.body['page_action'] === 'ch_dsa_list' && req.obj_session.user.role_detail.title === "ChannelHead") {                
				
				let obj_dsa_role_channel = swap(config.channel.Const_FOS_Channel);
                var arr_role = [];
                for (var x of req.obj_session.user.role_detail.channel_agent) {
                    arr_role.push(obj_dsa_role_channel[x] - 0);
                }
                filter['Role_ID'] = {$in: arr_role};
            }

            if (req.body['page_action'] === 'dsa_list' && req.obj_session.hasOwnProperty('users_assigned') && req.obj_session.users_assigned.hasOwnProperty('Team')) {
                filter['Emp_Id'] = {$in: req.obj_session.users_assigned.Team.DSA};
                filter['Role_ID'] = {$in: Object.keys(config.channel.Const_FOS_Channel).map(Number)};
            }
            if (req.body['page_action'] === 'all_dsa_list') {
                filter['Role_ID'] = {$in: Object.keys(config.channel.Const_FOS_Channel).map(Number)};
            }
			*/

            if ((req.body['page_action'] === 'ch_cse_list' || req.body['page_action'] === 'cse_list') && req.obj_session.hasOwnProperty('users_assigned') && req.obj_session.users_assigned.hasOwnProperty('Team')) {
                //console.error('Employee', '/dsas', req.obj_session.users_assigned.Team.CSE);
                filter['Emp_Id'] = {$in: req.obj_session.users_assigned.Team.CSE};
                filter['Role_ID'] = 23;
            }
            if (req.body['page_action'] === 'all_cse_list') {
                filter['Role_ID'] = 23;
            }

            if (req.body['Col_Name'] !== '' && req.body['txtCol_Val'] !== '') {
                filter[req.body['Col_Name']] = (isNaN(req.body['txtCol_Val']) === false) ? req.body['txtCol_Val'] - 0 : req.body['txtCol_Val'];
            }
        }
        Employee.paginate(filter, optionPaginate).then(function (employees) {
            console.log(obj_pagination.filter, optionPaginate, employees);
            res.json(employees);
        });
    });
    app.post('/employees/cses', LoadSession, function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: '',
            sort: {'Modified_On': 'desc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        console.error('Filter', req.body);
        if (req.body['search[value]'] !== '') {
            if (isNaN(req.body['search[value]'])) {
                filter = {
                    $or: [
                        {'Request_Unique_Id': new RegExp(req.body['search[value]'], 'i')},
                        {'Employee_Unique_Id': new RegExp(req.body['search[value]'], 'i')},
                        {'Method_Type': new RegExp(req.body['search[value]'], 'i')},
                        {'Error_Code': new RegExp(req.body['search[value]'], 'i')}
                    ]
                };
            } else {
                filter = {'Product_Id': parseInt(req.body['Product_Id'])};
            }
        } else {
            filter = {'IsActive': 1};

            if (req.body['page_action'] === 'ch_dsa_list') {
                if (req.body['uid'] == '112666') { //gs
                    filter['Role_ID'] = 34;
                }
                if (req.body['uid'] == '100151') { //sm
                    filter['Role_ID'] = 29;
                }
            }
            if (req.body['page_action'] === 'dsa_list') {
                filter['Emp_Id'] = {$in: req.obj_session.users_assigned.Team.DSA};
                filter['Role_ID'] = {$in: [29, 34]};
            }
            if (req.body['page_action'] === 'all_dsa_list') {
                filter['Role_ID'] = {$in: [29, 34]};
            }

            if (req.body['page_action'] === 'ch_cse_list') {

            }
            if (req.body['page_action'] === 'cse_list') {
                filter['Emp_Id'] = {$in: req.obj_session.users_assigned.Team.CSE};
            }
            if (req.body['page_action'] === 'all_cse_list') {
                filter['Role_ID'] = {$in: [29, 34]};
            }
            if (req.body['Col_Name'] !== '' && req.body['txtCol_Val'] !== '') {
                filter[req.body['Col_Name']] = (req.body['Col_Name'] === 'Ss_Id') ? req.body['txtCol_Val'] - 0 : req.body['txtCol_Val'];
            }
        }
        Employee.paginate(filter, optionPaginate).then(function (employees) {
            console.log(obj_pagination.filter, optionPaginate, employees);
            if (req.body['page_action'] === 'cse_list') {
                User.find({UID: {$in: req.obj_session.users_assigned.Team.CSE_UID}}, function (err, users) {
                    if (err)
                        res.send(err);

                    var obj_users = {};
                    for (let k in users) {
                        var user_uid = users[k]._doc['UID'] - 0;
                        obj_users[user_uid] = {
                            "Employee_Name": users[k]._doc['Employee_Name'],
                            "Company": users[k]._doc['Company'],
                            "Designation": users[k]._doc['Designation'],
                            "Dept_Short_Name": users[k]._doc['Dept_Short_Name'],
                            "Dept_Segment": users[k]._doc['Dept_Segment'],
                            "Direct_Reporting_UID": users[k]._doc['Direct_Reporting_UID']
                        }
                    }
                    for (let j in employees.docs) {
                        var emp_uid = employees.docs[j]['Emp_Code'] - 0;
                        for (let h in obj_users[emp_uid]) {
                            employees.docs[j][h] = obj_users[emp_uid][h];
                        }
                    }
                    res.json(employees);
                });
            } else {
                res.json(employees);
            }

        });
    });
    app.post('/dsas_summary', LoadSession, function (req, res) {

        var filter = {};
        console.error('Filter', req.body);

        filter = {'IsActive': 1};

        if (req.body['page_action'] === 'ch_dsa_list') {
            if (req.body['uid'] == '112666') { //gs
                filter['Role_ID'] = 34;
            }
            if (req.body['uid'] == '100151') { //sm
                filter['Role_ID'] = 29;
            }
        }
        if (req.body['page_action'] === 'dsa_list') {
            filter['Emp_Id'] = {$in: req.obj_session.users_assigned.Team.DSA};
            filter['Role_ID'] = {$in: [29, 34]};
        }
        if (req.body['page_action'] === 'all_dsa_list') {
            filter['Role_ID'] = {$in: [29, 34]};
        }
        var obj_dsa_summary = {
            'Branch': {},
            'ReportingAllocation': {}
        };
        Employee.find(filter, function (err, employees) {
            console.error('dsas_summary', filter, employees);
            var obj_reporting_cnt = {};
            for (let k in employees) {
                var branch = employees[k]._doc['Branch'].toString().toUpperCase();
                var uid = employees[k]._doc['UID'];

                if (obj_dsa_summary['Branch'].hasOwnProperty(branch) === false) {
                    obj_dsa_summary['Branch'][branch] = 0;
                }
                if (obj_reporting_cnt.hasOwnProperty(uid) === false) {
                    obj_reporting_cnt[uid] = 0;
                }
                obj_dsa_summary['Branch'][branch]++;
                obj_reporting_cnt[uid]++;
            }
            var obj_allocation = {
                'Less_than_5': 5,
                '5_to_10': 10,
                '11_to_15': 15,
                '16_to_20': 20,
                '21_to_25': 25,
                '26_to_50': 50,
                '51_to_75': 75,
                'More_than_75': 100
            }
            var obj_allocation_summary = {
                'Less_than_5': 0,
                '5_to_10': 0,
                '11_to_15': 0,
                '16_to_20': 0,
                '21_to_25': 0,
                '26_to_50': 0,
                '51_to_75': 0,
                'More_than_75': 0
            }
            for (let k in obj_reporting_cnt) {
                for (let j in obj_allocation) {
                    if (obj_reporting_cnt[k] < obj_allocation[j]) {
                        obj_allocation_summary[j]++;
                        break;
                    }
                }
            }
            obj_dsa_summary['ReportingAllocationSummary'] = obj_allocation_summary;
            obj_dsa_summary['ReportingAllocationTotal'] = obj_reporting_cnt;
            res.json(obj_dsa_summary);
        });
    });    
	app.get('/employees/tds_cert/:Ss_Id/:Fin_Year/:Plateform/', LoadSession, function (req, res) {
		
		let Ss_Id = req.params.Ss_Id || 0;
		let Fin_Year = req.params.Fin_Year || '20-21';
		let Plateform = req.params.Plateform || 'HORIZON';
		
		if(Plateform === 'APP' || (Plateform === 'HORIZON' && req.obj_session)){
			Ss_Id = Ss_Id - 0;
			if(Ss_Id > 0){
				var Client = require('node-rest-client').Client;
				var client = new Client();
				client.get(config.environment.weburl + '/posps/dsas/view/' + Ss_Id, {}, function (data, response) {
					if (data && data['status'] === 'SUCCESS' && (data['user_type'] === 'POSP' || data['user_type'] === 'FOS')) {
						try {
							let is_certified_agent = false;
							let erp_code = 0;
							let Pan = '';
							let Is_LIBPL_Only = null;
							let Agent_Name = '';
							let downloaded_by = '';
							
							if (data['user_type'] === 'POSP' && (data['POSP']['Erp_Id'] - 0) > 0 && data['POSP']["Last_Status"] != "6" && data['POSP']["Pan_No"] !== '') {
								is_certified_agent = true;
								Pan = data['POSP']["Pan_No"];
								erp_code = data['POSP']["Erp_Id"];
								Agent_Name = data['POSP']["First_Name"]+'.'+data['POSP']["Last_Name"]+',CODE-'+erp_code+',SSID-'+Ss_Id;	
								if(Plateform === 'APP'){
									Is_LIBPL_Only = true;
								}
								else{
									Is_LIBPL_Only = false ;
								}
								Is_LIBPL_Only = true;
							}
							if (data['user_type'] === 'FOS' && (data['EMP']['VendorCode'] - 0) > 0 && data['EMP']["Pan"] !== '') {
								Pan = data['EMP']["Pan"];
								erp_code = data['EMP']['VendorCode'];
								Agent_Name = data['POSP']["First_Name"]+'.'+data['POSP']["Last_Name"]+',CODE-'+erp_code+',SSID-'+Ss_Id;	
								Is_LIBPL_Only = false;
							}
							
							if(Pan !== ''){
								if(req.obj_session){
									downloaded_by = req.obj_session.user.fullname + ' ( UID - ' + req.obj_session.user.erp_id + ' ,  SS_ID - ' + req.obj_session.user.ss_id + ' )';
								}
								else{
									downloaded_by = Agent_Name;
								}
								
								
								if(Is_LIBPL_Only === true && is_certified_agent === true){
									download_tds_libpl_callback(Pan,Fin_Year,Agent_Name,erp_code,downloaded_by,Is_LIBPL_Only,req,res);
								}
								else if(Is_LIBPL_Only === false){
									download_tds_callback(Pan,Fin_Year,Agent_Name,erp_code,downloaded_by,Is_LIBPL_Only,req,res);
								}
								else{
									res.json({'status' : 'ERROR','error_details' : 'Not_Allowed'});
								}
							}
							else{
								
								res.json({'status' : 'ERROR','error_details' : 'Invalid_Pan'});
							}
						}
						catch(e){
							res.send(e.stack);
						}
					}
					else{
						res.json({'status' : 'ERROR','error_details' : 'Invalid_Data'});
						
					}
				});
			}
		}
		else{
			res.json({'status' : 'ERROR','error_details' : 'Invalid_Session'});
			
		}
    });
	function download_tds_callback(Pan,Fin_Year,Agent_Name,erp_code,downloaded_by,Is_LIBPL_Only,req,res){
		if(Pan && Pan.toString().length === 10){
			let options  = {};
			var glob = require("glob");
			let files = [];
			let obj_files  =[];
			glob("/var/www/Production/HorizonAPI/SourceCode/tmp/tds_cert/"+Fin_Year+"/AFS/*" + Pan + "*", options, function (er, AFSfiles) {						  						  
			  glob("/var/www/Production/HorizonAPI/SourceCode/tmp/tds_cert/"+Fin_Year+"/Inve/*" + Pan + "*", options, function (er, Invefiles) {						  						  
			  glob("/var/www/Production/HorizonAPI/SourceCode/tmp/tds_cert/"+Fin_Year+"/LCPL/*" + Pan + "*", options, function (er, LCPLfiles) {
				  glob("/var/www/Production/HorizonAPI/SourceCode/tmp/tds_cert/"+Fin_Year+"/ISPL/*" + Pan + "*", options, function (er, ISPLfiles) {
					  glob("/var/www/Production/HorizonAPI/SourceCode/tmp/tds_cert/"+Fin_Year+"/RG/*" + Pan + "*", options, function (er, RGfiles) {
						  glob("/var/www/Production/HorizonAPI/SourceCode/tmp/tds_cert/"+Fin_Year+"/DATACOM/*" + Pan + "*", options, function (er, DATACOMfiles) {
						
for(let k in AFSfiles){
files.push({
'orig_file': AFSfiles[k],
'save_file': 'AFS'
})
}								
for(let k in Invefiles){
files.push({
'orig_file': Invefiles[k],
'save_file': 'INVE'
})
}									
for(let k in LCPLfiles){
files.push({
'orig_file': LCPLfiles[k],
'save_file': 'LCPL'
})
}									
for(let k in ISPLfiles){
files.push({
'orig_file': ISPLfiles[k],
'save_file': 'ISPL'
})
}									
for(let k in RGfiles){
files.push({
'orig_file': RGfiles[k],
'save_file': 'RG'
})
}									
for(let k in DATACOMfiles){
files.push({
'orig_file': DATACOMfiles[k],
'save_file': 'DATACOM'
})
}										
			  
			  if(files.length > 0){
				var zipdir = require('zip-dir');
				let archive_path = '/var/www/Production/HorizonAPI/SourceCode/tmp/tds_cert/';
				let archive_file_name = Fin_Year +'_'+erp_code+'_' + Pan +'_'+  moment().utcOffset("+05:30").format("YYYY-MM-DD_HHmmss");
				let file_dir = archive_path + 'archive/' + archive_file_name + '/';
				let archive_file_path = archive_path + 'archive/' + archive_file_name + '.zip';
				
				if (!fs.existsSync(file_dir)){
					fs.mkdirSync(file_dir);
				}
				for(let k in files){
					let Source_Pdf = files[k]['orig_file'];
					let file_name = Source_Pdf.split('/')[Source_Pdf.split('/').length - 1];
					let Target_Pdf = file_dir + files[k]['save_file'] + '_' +file_name;
					fs.copyFileSync(Source_Pdf, Target_Pdf);  
				}
						
				
				zipdir(file_dir, { saveTo: archive_file_path }, function (err, buffer) {
					if(req.query['op'] === 'DBG'){  
						let obj_response = {
							'agent_details' : Agent_Name,
							'download_by': downloaded_by,
							'download_on': moment().utcOffset("+05:30").toLocaleString(),
							//'session' : req.query['session_id'],
							'file_dir' : file_dir,
							'file_count' : files.length,
							'archive_file_path' : archive_file_path,
							'status' : (err) ? 'ERROR' : 'SUCCESS',
							'error_details' : err,
							'web_file_path' : 'https://horizon.policyboss.com:5443/employees/download_tds/'+archive_file_name
						};
						if(err === null){
							var Email = require('../models/email');
							var objModelEmail = new Email();											
							let subject = '[TDS-CERTIFICATE-DOWNLOAD] NAME : '+ Agent_Name;
							let content_html = '<!DOCTYPE html><html><head><title>Report</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
							content_html += '<div class="report" >';
							content_html += '<p><h1>FOS DOWNLOAD TDS CERTIFICATE</h1>' + objectToHtml(obj_response) + '</p>';
							content_html += '</div>';
							content_html += '</body></html>';
							objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, subject, content_html, '', '');
							
						}
						res.json(obj_response);
					}
					if(req.query['op'] === 'DOWNLOAD'){
						res.download(archive_file_path, archive_file_name);
					}									
				});
			  }
			  else{
				  
				  res.json({'status' : 'ERROR','error_details' : 'NO_FILE_FOUND'});
			  }
			  });
			  });
			  });
});						  
			}); 
			});
			
		}
		else{
			res.json({'status' : 'ERROR','error_details' : 'NO_PAN_CONFIGURE'});
			
		}
	}
	function download_tds_libpl_callback(Pan,Fin_Year,Agent_Name,erp_code,downloaded_by,Is_LIBPL_Only,req,res){
		if(Pan && Pan.toString().length === 10){
			let options  = {};
			var glob = require("glob");
			let files = [];
			let obj_files  =[];
			glob("/var/www/Production/HorizonAPI/SourceCode/tmp/tds_cert/"+Fin_Year+"/LIBPL/*" + Pan + "*", options, function (er,LIBPLfiles) {						  						  
						
				for(let k in LIBPLfiles){
					files.push({
					'orig_file': LIBPLfiles[k],
					'save_file': 'LIBPLfiles'
					});
				}			  
				if(files.length > 0){
					var zipdir = require('zip-dir');
					let archive_path = '/var/www/Production/HorizonAPI/SourceCode/tmp/tds_cert/';
					let archive_file_name = Fin_Year +'_'+erp_code+'_' + Pan +'_'+  moment().utcOffset("+05:30").format("YYYY-MM-DD_HHmmss");
					let file_dir = archive_path + 'archive/' + archive_file_name + '/';
					let archive_file_path = archive_path + 'archive/' + archive_file_name + '.zip';
					
					if (!fs.existsSync(file_dir)){
						fs.mkdirSync(file_dir);
					}
					for(let k in files){
						let Source_Pdf = files[k]['orig_file'];
						let file_name = Source_Pdf.split('/')[Source_Pdf.split('/').length - 1];
						let Target_Pdf = file_dir + files[k]['save_file'] + '_' +file_name;
						fs.copyFileSync(Source_Pdf, Target_Pdf);  
					}
							
					
					zipdir(file_dir, { saveTo: archive_file_path }, function (err, buffer) {
						if(req.query['op'] === 'DBG'){  
							let obj_response = {
								'agent_details' : Agent_Name,
								'download_by': downloaded_by,
								'download_on': moment().utcOffset("+05:30").toLocaleString(),
								//'session' : req.query['session_id'],
								'file_dir' : file_dir,
								'file_count' : files.length,
								'archive_file_path' : archive_file_path,
								'status' : (err) ? 'ERROR' : 'SUCCESS',
								'error_details' : err,
								'web_file_path' : 'https://horizon.policyboss.com:5443/employees/download_tds/'+archive_file_name
							};
							if(err === null){
								var Email = require('../models/email');
								var objModelEmail = new Email();											
								let subject = '[TDS-CERTIFICATE-DOWNLOAD] NAME : '+ Agent_Name;
								let content_html = '<!DOCTYPE html><html><head><title>Report</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
								content_html += '<div class="report" >';
								content_html += '<p><h1>FOS DOWNLOAD TDS CERTIFICATE</h1>' + objectToHtml(obj_response) + '</p>';
								content_html += '</div>';
								content_html += '</body></html>';
								objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, subject, content_html, '', '');
								
							}
							res.json(obj_response);
						}
						if(req.query['op'] === 'DOWNLOAD'){
							res.download(archive_file_path, archive_file_name);
						}									
					});
				}
				else{
					res.json({'status' : 'ERROR','error_details' : 'NO_FILE_FOUND','loc':"/var/www/Production/HorizonAPI/SourceCode/tmp/tds_cert/"+Fin_Year+"/LIBPL/*" + Pan + "*"});
					
				}
			});
		}
		else{
			res.json({'status' : 'ERROR','error_details' : 'NO_PAN_CONFIGURE'});
			
		}
	}
	app.get('/employees/download_tds/:archive_file_name', function (req, res) {
		let archive_file_name = req.params.archive_file_name || '';
		let archive_file_path = '/var/www/Production/HorizonAPI/SourceCode/tmp/tds_cert/archive/' + archive_file_name + '.zip';
		if(archive_file_name !== '' && fs.existsSync(archive_file_path)){
			res.download(archive_file_path, archive_file_name+ '.zip');
		}
		else{
			res.send('NO_FILE_EXIST');
		}
	});
    app.get('/employees/tree/:uid', function (req, res) {
        var objEmployeeOrgChart = {};
        User.find({$or: [
                {'Direct_Reporting_UID': req.params.uid - 0},
                {UID: req.params.uid - 0}
            ]}, function (err, users) {
            if (err)
                res.send(err);

            var arr_emp = [];
            for (var k in users) {
                var uid = users[k]._doc['UID'] - 0;
                var reporting_uid = users[k]._doc['Direct_Reporting_UID'] - 0;
                if (reporting_uid > 0 && uid > 0) {
                    if (uid == reporting_uid) {
                        var obj_emp = {
                            id: uid, name: users[k]._doc['Employee_Name'], title: users[k]._doc['Designation'], img: "https://balkangraph.com/js/img/3.jpg"
                        }
                    } else {
                        var obj_emp = {
                            id: uid, pid: reporting_uid, name: users[k]._doc['Employee_Name'], title: users[k]._doc['Designation'], img: "https://balkangraph.com/js/img/3.jpg"
                        }
                    }
                    arr_emp.push(obj_emp);
                }
            }
            res.json(arr_emp);
        });

    });

    app.get('/employees/rm_list/:source', function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: '',
            sort: {'Modified_On': 'desc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 50
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }
        var filter = obj_pagination.filter;
        console.error('Filter', req.body);
        if (req.body['search[value]'] !== '') {
            if (isNaN(req.body['search[value]'])) {
                filter = {
                    $or: [
                        {'Request_Unique_Id': new RegExp(req.body['search[value]'], 'i')},
                        {'Employee_Unique_Id': new RegExp(req.body['search[value]'], 'i')},
                        {'Method_Type': new RegExp(req.body['search[value]'], 'i')},
                        {'Error_Code': new RegExp(req.body['search[value]'], 'i')}
                    ]
                };
            } else {
                filter = {'Product_Id': parseInt(req.body['Product_Id'])};
            }
        } else {
            filter = {};
            if (typeof req.body['Col_Name'] == 'string' && req.body['Col_Name'] !== '' && req.body['txtCol_Val'] !== '') {
                filter[req.body['Col_Name']] = (req.body['Col_Name'] === 'Ss_Id') ? req.body['txtCol_Val'] - 0 : req.body['txtCol_Val'];
            }
        }


        Employee.paginate(filter, optionPaginate).then(function (employees) {
            console.log(obj_pagination.filter, optionPaginate, employees);
            res.json(employees);
        });
    });
	app.get('/employees/restpoc1', function (req, res){
		const request = require('request');
		let token = req.query['token'] || '';
		let policy_id = req.query['policy_id'] || '';
		let curl = "https://developer.cholainsurance.com/endpoint/integration-services-comprehensive/v1.0.0/DownloadPolicy?policy_id="+policy_id+"&user_code=landmark";
		let cheader = {
			 'Authorization': 'Bearer '+ new Buffer(token)
		  };
		request({
		  url: curl,		  
		  auth : {
			'bearer': new Buffer(token)
		  },
		  rejectUnauthorized: false
		}, function(err, resp) {
			  if(err) {
				console.error(err);
				
			  } else {
				console.log(resp.body);
			  }
			  
			  res.json({
				'err' :err,
				'url' : curl,
				'req_header' : cheader,
				'data' : resp.body,
				'full' : resp
			});
			  

		});
	});
	app.get('/employees/restpoc', function (req, res){
		let token = req.query['token'] || '';
		let policy_id = req.query['policy_id'] || '';
		
		var Client = require('node-rest-client').Client;
		var client = new Client();
		var url = "https://developer.cholainsurance.com/endpoint/integration-services-comprehensive/v1.0.0/DownloadPolicy?policy_id=" + policy_id + "&user_code=landmark";
					
		var args = {                    
                    headers: {                        
                        "Accept": "application/json"
                    }
                };
                args.headers.Authorization = 'Bearer ' + new Buffer(token);			
		client.get(url, args, function (data, response) {
			if(Buffer.isBuffer(data)){
				data = data.toString('utf8');
			}
			
			let obj_poc = {
				'url' : url,
				'arg1' :args,
				'data' : data,
				//'full_resp' : response
			};
			console.error('DBG','cholapoc',obj_poc, response);	
			res.send('<pre>' + JSON.stringify(obj_poc, undefined, 2) + '</pre>');			
			//res.json(obj_poc);			
		});
	});
	app.get('/employees/cholapoc', function (req, res){
		var Client = require('node-rest-client').Client;
		let token = req.query['token'] || '';
		let policy_id = req.query['policy_id'] || '';
		var client = new Client();
		var url = "https://apius.reqbin.com/api/v1/requests";
		var args1 = {
					data : {
	"id": "",
	"name": "",
	"errors": "",
	"json": "{\"method\":\"GET\",\"url\":\"https://developer.cholainsurance.com/endpoint/integration-services-comprehensive/v1.0.0/DownloadPolicyURL?policy_id=" + policy_id + "&user_code=landmark\",\"apiNode\":\"US\",\"contentType\":\"\",\"content\":\"\",\"headers\":\"Accept: application/json\\r\\nAuthorization: Bearer " + token + "\\r\\n\",\"errors\":\"\",\"curlCmd\":\"curl https://developer.cholainsurance.com/endpoint/integration-services-comprehensive/v1.0.0/DownloadPolicyURL?policy_id=" + policy_id + "&user_code=landmark\\n\\t-H \\\"Accept: application/json\\\"\\n    -H \\\"Authorization: Bearer " + token + "\\\"\",\"auth\":{\"auth\":\"noAuth\",\"bearerToken\":\"\",\"basicUsername\":\"\",\"basicPassword\":\"\",\"customHeader\":\"\",\"encrypted\":\"\"},\"compare\":false,\"idnUrl\":\"https://developer.cholainsurance.com/endpoint/integration-services-comprehensive/v1.0.0/DownloadPolicyURL?policy_id=" + policy_id + "&user_code=landmark\"}",
	"deviceId": "97058444-8221-4d41-b8e9-39fbf544c46aR",
	"sessionId": 1629202452436
}                       
                    };
		client.post(url, args1, function (data, response) {
			if(Buffer.isBuffer(data)){
    data = data.toString('utf8');
}
			res.json({
				'arg1' :args1,
				'data' : data
			});			
		});
	});
	
	
    app.post('/employees/dsas/update_rm', LoadSession, function (req, res) {
        var sql = require("mssql");
        sql.close();
        // config for your database   
        var objrequestCore = req.body;
        var obj_data = {
            'ss_id': 1,
            'fba_id': 1,
            "Reporting_Agent_UID": 1,
            "Reporting_Agent_Name": 1,
            "Reporting_Mobile_Number": 1,
            "Reporting_Email_ID": 1
        };
        var qry_str = "";
        for (var k in obj_data) {
            if (obj_data[k] == '') {
                res.send('ERR_PARAMETER_MISSING');
            }
        }

        qry_str = 'update Employee_Master set UID = ' + objrequestCore['Reporting_Agent_UID'].toString() + ' , Reporting_UID_Name = \'' + objrequestCore['Reporting_Agent_Name'].toString() + '\' , Reporting_Mobile_Number = ' + objrequestCore['Reporting_Mobile_Number'].toString() + ' , Reporting_Email_ID = \'' + objrequestCore['Reporting_Email_ID'].toString() + '\'    where Emp_Id = ' + objrequestCore["ss_id"].toString();
        // connect to your database
        sql.connect(config.portalsqldb, function (conn_err) {
            var obj_status = {
                'status': 'PENDING',
                'msg': 'NA',
                'qry': qry_str,
                'old': null,
                'new': objrequestCore
            };
            if (conn_err) {
                console.error(conn_err);
                obj_status['status'] = 'ERR';
                obj_status['msg'] = conn_err;
            } else {
                var find_query = 'select * from Employee_Master where Emp_Id = ' + objrequestCore["ss_id"].toString();
                var find_request = new sql.Request();

                find_request.query(find_query, function (err, recordset) {
                    if (err) {
                        console.error(err);
                    } else {
                        var obj_posp = recordset.recordset[0];
                        obj_status['old'] = obj_posp;
                        let Sources = config.channel.Const_FOS_Role_Source[obj_posp['Role_ID'].toString()] - 0;
                        Source_Name = config.channel.Const_FOS_Channel[obj_posp['Role_ID'].toString()] + '-FOS';
                        let obj_email = {
                            'status': 'DBG',
                            'source': Sources,
                            'source_name': Source_Name,
                            'ss_id': objrequestCore["ss_id"],
                            'fba_id': objrequestCore["fba_id"],
                            'name': obj_posp["Emp_Name"],
                            'agent_city': obj_posp["Branch"],
                            'previous_rm_uid': obj_posp['UID'],
                            'previous_rm_name': obj_posp['Reporting_UID_Name'],
                            'previous_rm_email': obj_posp['Reporting_Email_ID'],
                            'previous_rm_mobile': obj_posp['Reporting_Mobile_Number'],
                            'new_rm_uid': objrequestCore['Reporting_Agent_UID'],
                            'new_rm_name': objrequestCore['Reporting_Agent_Name'],
                            'new_rm_email': objrequestCore['Reporting_Email_ID'],
                            'new_rm_mobile': objrequestCore['Reporting_Mobile_Number'],
                            'remarks': (objrequestCore['Remarks'] !== '') ? objrequestCore['Remarks'] : 'NA',
                            'updated_by': req.obj_session.user.fullname + ' ( UID - ' + req.obj_session.user.erp_id + ' ,  SS_ID - ' + req.obj_session.user.ss_id + ' )',
                            'updated_on': moment().utcOffset("+05:30").toLocaleString()
                        };
                        if (obj_email['previous_rm_uid'] == obj_email['new_rm_uid']) {
                            obj_status['status'] = 'VALIDATION';
                            obj_status['msg'] = 'SAME_RECORD';
                            var today = moment().utcOffset("+05:30");
                            var today_str = moment(today).format("YYYYMMD");
                            var objRequest = {
                                'dt': today.toLocaleString(),
                                'req': req.body,
                                'resp': obj_status
                            };
                            fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {});
                            res.send(obj_status);
                        } else {
                            if (req.query['dbg'] === 'yes') {
                                ReportingUpdateEmailSend(obj_email);
                                res.send(obj_status);
                            } else {
                                // create Request object
                                var update_request = new sql.Request();
                                // query to the database and get the records            
                                update_request.query(qry_str, function (qry_err, recordset) {
                                    if (qry_err) {
                                        console.error(qry_err);
                                        obj_email['status'] = 'ERR';
                                        obj_status['status'] = 'QUERY_ERR';
                                        obj_status['msg'] = qry_err;
										
										var today = moment().utcOffset("+05:30");
										var today_str = moment(today).format("YYYYMMD");
										var objRequest = {
											'dt': today.toLocaleString(),
											'req': req.body,
											'resp': obj_status
										};
										fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {});
										return res.json(obj_status);
													
                                    } else {
                                        obj_email['status'] = 'SUCCESS';
                                        obj_status['status'] = 'SUCCESS';
                                        obj_status['msg'] = recordset;
                                        var Client = require('node-rest-client').Client;
                                        var client = new Client();
                                        client.get(config.environment.weburl + '/report/sync_emp_master?ss_id=' + objrequestCore["ss_id"], {}, function (data, response) {});
                                        client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + objrequestCore["ss_id"], {}, function (data, response) {});
                                        if (objrequestCore["ss_id"] - 0 > 0 && objrequestCore["Reporting_Agent_UID"] - 0 > 0) {
                                            let ERP_MAPPING_URL = config.environment.weburl + '/posps/mapping/erp_update_rm?ss_id=' + objrequestCore["ss_id"] + '&rm_uid=' + objrequestCore["Reporting_Agent_UID"];
                                            console.error('DBG', 'ERP_MAPPING_URL', ERP_MAPPING_URL)
                                            client.get(ERP_MAPPING_URL, {}, function (data, response) {
												if(data['status'] === 'SUCCESS'){
													if (req.query['email'] === 'no') {

													} else {
														ReportingUpdateEmailSend(obj_email);
													}
													obj_status['status'] = 'SUCCESS';
													obj_status['msg'] = 'SUCCESS';														
												}
												else{
													obj_status['status'] = 'FAIL';
													obj_status['msg'] = 'ERP_MAPPING_FAIL';
												}
												
												var today = moment().utcOffset("+05:30");
												var today_str = moment(today).format("YYYYMMD");
												var objRequest = {
													'dt': today.toLocaleString(),
													'req': req.body,
													'resp': obj_status
												};
												fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {});
												return res.json(obj_status);
											});
                                        }
										
                                    }
                                    
                                    
                                });
                            }
                        }
                    }
                });
            }
        });
    });
    function ReportingUpdateEmailSend(obj_email) {
        var Email = require('../models/email');
        let objModelEmail = new Email();
        let sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + obj_email['status'] + '] REPORTING_MANAGER_UPDATION, SS_ID : ' + obj_email['ss_id'] + ' , FBA_ID : ' + obj_email['fba_id'];

        let arr_to = [];
        let arr_bcc = [config.environment.notification_email];
        let arr_cc = [];
        let contentSms_Log = "REPORTING_MANAGER_UPDATION<BR>------------------------<BR>";
        for (let k in obj_email) {
            contentSms_Log += k.replace(/_/g, ' ').toString().toUpperCase() + ' : ' + obj_email[k] + '<BR>';
        }
        let email_body = contentSms_Log.replace(/\n/g, '<BR>');
        let email_data = '<!DOCTYPE html><html><head><style>*,body,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>REPORTING_MANAGER_UPDATION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
        email_data += '<div class="report"><span>Reporting Manager is updated for Following POSP as below summary.<br>For any query, Please write to techsupport@policyboss.com</span><br><br><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
        email_data += '<tr><td  width="70%">' + email_body + '&nbsp;</td></tr>';

        email_data += '</table></div><br></body></html>';
        if (obj_email['status'] === 'DBG') {
            arr_to.push('chirag.modi@policyboss.com');
        } else {
            arr_to.push(obj_email['new_rm_email']);
            let Sources = obj_email['source'];
            if (Sources === 1) {
                arr_cc.push('transactions.1920@gmail.com');
                arr_cc.push('srinivas@policyboss.com');
                arr_cc.push('ashutosh.sharma@magicfinmart.com');
            }
            if (Sources === 2) {
                arr_cc.push('susheel.menon@landmarkinsurance.in');
                arr_cc.push('sandeep.nair@landmarkinsurance.in');
            }
            if (Sources === 8) {
                arr_cc.push('gagandeep.singh@policyboss.com');
                arr_cc.push('saroj.singh@policyboss.com');
            }
        }
        objModelEmail.send('notifications@policyboss.com', arr_to.join(','), sub, email_data, arr_cc.join(','), arr_bcc.join(','), 0);

    }
}
function LoadSession(req, res, next) {
    try {
        var objRequestCore = req.body;
        if (req.method == "GET") {
            objRequestCore = req.query;
        }
        objRequestCore = JSON.parse(JSON.stringify(objRequestCore));
        if (objRequestCore.hasOwnProperty('session_id') && objRequestCore['session_id'] != '') {
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
function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}

