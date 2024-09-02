/* Author : Kevin Monteiro
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
var Content_Management = require('../models/content_management');
module.exports.controller = function (app) {
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
        
    })
};
