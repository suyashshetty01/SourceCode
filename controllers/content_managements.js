/* Author : Kevin Monteiro
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
const cors = require('cors');
var appRoot = path.dirname(path.dirname(require.main.filename));


mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
var Content_Management = require('../models/content_management');
module.exports.controller = function (app) {
    app.use(cors());
    app.get('/content_managements/get_content', function (req, res) {
        let content_URL = req.query['content_URL'];		
		let Status  = req.query['status'] || 'Publish';
		let CM_Cond = {"URL": content_URL,'Status':Status};
		if(Status === 'Archived'){
			let Version  = req.query['Version'] || 0;
			CM_Cond['Version'] = Version;
		}
		if(content_URL){
			Content_Management.findOne(CM_Cond, function (err, dbContent_Management) {
				if (err)
					res.send(err);
				res.json(dbContent_Management);
			});
		}
		else{
			res.json({});
		}
        
    });
    app.get('/content_managements/fetch_all_content/:content_id?', function (req, res) {
        try {
            const content_id = (req.params.content_id && req.params.content_id - 0) || 0;
            if (content_id) {
                Content_Management.findOne({'Content_Id': content_id}, function (err, dbContent_Management) {
                    if (err)
                        res.send(err);
                    res.json(dbContent_Management);
                }).sort({'Created_On':-1});
            } else {
                Content_Management.find({}, function (err, dbContent_Management) {
                    if (err)
                        res.send(err);
                    res.json(dbContent_Management);
                }).sort({'Created_On':-1});
            }
        } catch (ex) {
            res.json({'Status': 'FAIL', 'Msg': 'Exception in Service', 'Error': ex.stack});
        }

    });    
    app.get('/content_management/change_blog_status/:content_id', (req, res) => {
        try {
            var content_id = req.params.content_id ? parseInt(req.params.content_id) : 0;
            if (!isNaN(content_id)) {
                var status = req.query.Status;
                if (['Publish', 'UnPublish'].indexOf(status) > -1) {
                    var update_Obj = {
                            "Status": status
                    };
                    var query_Obj = {
                        "Content_Id": content_id,
                        "Type": "BLOG"
                    };
                    Content_Management.findOneAndUpdate(query_Obj, {$set: update_Obj}, {new : true}, function (err, db_data) {
                        if (err) {
                            res.json({"Msg": "Error updating the Status", "Status": "FAIL"});
                        } else {
                            res.json({"Msg": "Data Updated", "Status": "SUCCESS", "Data": db_data});
                        }
                    });
                } else {
                    res.json({"Msg": "Enum Values For Status Must be Publish or UnPublish.", "Status": "FAIL"});
                }
            } else {
                res.json({"Msg": "Content Id Should be Numeric", "Status": "FAIL"});
            }
        } catch (e) {
            res.json({"Msg": "Exception in -/change_blog_status", "Status": "FAIL", "Data": e.stack});
        }
    });
    app.post('/content_management/update_node', (req, res) => {
        try {
            var {search_data, updated_data} = req.body;
            if (search_data["Content_Id"]) {
                var content_management = require('../models/content_management');
                content_management.findOneAndUpdate(search_data, {$set: updated_data},{new:true}, function (err, db_data) {
                    if (err) {
                        console.error("Error updating the Status");
                        res.json({"Msg": "Error updating the Status", "Status": "FAIL"});
                    } else {
                        res.json({"Msg": "Data Updated", "Status": "SUCCESS", "Data": db_data});
                    }
                });
            } else {
                res.json({"Msg": "Content_Id not found", "Status": "FAIL"});
            }
        } catch (e) {
            res.json({"Msg": "Exception in update node", "Status": "FAIL", "Data": e.stack});
        }
    });

    app.get('/content_management/delete_record/:Content_Id',(req,res)=>{
        try{
            var Content_Id=req.params.Content_Id ? parseInt(req.params.Content_Id) : 0;
            var Obj={
                "Content_Id":Content_Id
            }
            var content_management = require('../models/content_management');
    
            if (!isNaN(Content_Id)) {
                content_management.findOneAndDelete(Obj,function(err,deleted_data){
                    if(err){
                        res.json({"Msg":"Error deleting the Data","Status":"FAIL"});
                    }
                    else{
                        res.json({"Msg":"Data Deleted","Status":"SUCCESS","Data":deleted_data})
                    }
                }) 
            }
            else{
                res.json({"Msg":"Content Id Should be Numeric","Status":"FAIL"});
            }
        }
        catch(e){
            res.json({"Msg": "Exception in delete_record", "Status": "FAIL", "Data": e.stack});

        }
        
    });
    
    app.post('/content_managements/update_content_spotlight', (req, res) => {
    try {
        let Content_Id = (!isNaN(req.body.Content_Id)) ? parseInt(req.body.Content_Id) : 0;
        let updateObj = {'Is_Spotlight': req.body.Spotlight};
        var content_management = require('../models/content_management');
        if (Content_Id) {
            if(["Yes","No"].indexOf(req.body.Spotlight)>-1){
            content_management.findOneAndUpdate({"Content_Id": Content_Id}, {$set: updateObj}, {new : true}, function (err, spotlight_data_update) {
                if (err) {
                    res.json({"Status": "FAIL", "Msg": err});
                } else {
                    if (spotlight_data_update) {
                        res.json({"Status": "SUCCESS", "Msg": "Spotlight Updated Successfully", "Data": spotlight_data_update});
                    } else {
                        res.json({"Status": "FAIL", "Msg": "Spotlight Not Updated"});
                    }
                }
            });
        }
        else{
             res.json({"Status": "FAIL", "Msg": "Enter Valid Spotlight(Yes/No)"});
        }
        } else {
            res.json({"Status": "FAIL", "Msg": "Please select a valid content Id"});
        }
    } catch (e) {
        console.error("Exception in /spotlight_content_update service", e.stack);
        res.json({"Status": "FAIL", "Msg": e.stack});
    }
});
app.get('/create_sync_category', function (req, res) {
    var ssid_arr = fs.readFileSync(appRoot + "/tmp/sync_contact_ssid.json", { encoding: 'utf8', flag: 'r' });
    let data_arr = JSON.parse(ssid_arr);
    let resObj = {
        'Status': '',
        'category_success_resp': [],
        'dsa_not_found_arr' : []
    };
    let Client = require('node-rest-client').Client;
    let client1 = new Client();
    let client2 = new Client();
    try{
        let ss_id = data_arr['SsId'][0];
        let erp_id = '';
        client1.get('https://horizon.policyboss.com:5443' + '/posps/dsas/view/' + ss_id, {}, function (data, response) {
            if (data && data.status === 'SUCCESS') {
                ss_id = data.Ss_Id;
                erp_id = data.user_type === 'POSP' ? data.POSP.Erp_Id -0 : data.EMP.UID;
                client2.get('https://horizon.policyboss.com:5443/postservicecall/sync_contact/all_contact_category_sync?ss_id='+ss_id+'&erp_id='+erp_id, function (data2, response2) {
                    if (data2 && data2.Status === 'SUCCESS') {
                        resObj['category_success_resp'].push(data2);
                    } else {
                        resObj['category_success_resp'].push(data2);
                    }
                    resObj['Status'] = 'SUCCESS';
                    var ob = {
                        "ss_id" : ss_id,
                        "response" : data2
                    };
                    fs.appendFile(appRoot + "/tmp/sync_category_logs.txt",JSON.stringify(ob) + '\n\r');
                    res.json(resObj);
                });
            } else {
                resObj['dsa_not_found_arr'].push(ss_id);
                var ob = {
                        "ss_id" : ss_id,
                        "response" : resObj
                    };
                fs.appendFile(appRoot + "/tmp/sync_category_logs.txt",JSON.stringify(ob) + '\n\r');
                res.json(resObj);
            }
            data_arr['SsId'].shift();
            fs.writeFileSync(appRoot + "/tmp/sync_contact_ssid.json",JSON.stringify(data_arr));
            console.error('SSID DONE - ',ss_id);
        });
    }catch(e){
        console.error(e.stack);
        res.json({'Err' : e.stack});
    }
});
app.get('/check',(req,res)=>{
    console.log('service hit');
    res.json({'msg':'service hit'});
});

};