/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var corp_lead = require('../models/corporate_lead');
var Base = require('../libs/Base');

var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database


module.exports.controller = function (app) {
    app.get('/corp_product_types', function (req, res) {
        var corp_product = require('../models/corp_product');
        corp_product.find({Status: "Active"},function (err, dbProductData) {
            if (err) {
            } else {
                if (dbProductData) {
                    console.log(dbProductData);
                    res.send(dbProductData);
                }
            }
        });
    });

    app.get('/corp_sub_product_types/:product_type', function (req, res) {
        var corp_sub_product = require('../models/corp_sub_product');
        if (req.params.product_type) {
            corp_sub_product.find({Product_Id: parseInt(req.params.product_type),Status: "Active"}, function (err, dbSubProductData) {
                if (err) {
                } else {
                    if (dbSubProductData) {
                        console.log(dbSubProductData);
                        res.send(dbSubProductData);
                    }
                }
            });
        } else {
            res.send('Invalid Product Type');
        }
    });

    app.post('/corp_lead_save', function (req, res) {
        try {
            console.log(req.body);
            var formidable = require('formidable');

            var form = new formidable.IncomingForm();
            var fs = require('fs');
            form.parse(req, function (err, fields, files) {
                let objRequest = fields;
                console.log(fields);
                //var keys = Object.keys(files);
                let file_name;
                let Corporate_Lead_Id = objRequest['Corporate_Lead_Id'];
                if (Corporate_Lead_Id !== null && Corporate_Lead_Id !== "" && Corporate_Lead_Id !== undefined) {

                    let file_name = "";
                    if (!isEmpty(files)) {
                        file_name = file_saved(files, Corporate_Lead_Id);
                    }

                    let leadrequest = JSON.parse(objRequest['Lead_Request']);
                    leadrequest['files'] = {Floater_Location_list: file_name};



                    let updatelead_request = {
                        "Customer_name": objRequest['Customer_name'],
                        "Created_By": objRequest['Created_by'],
                        "Status": "Updated",
                        "Lead_Request": leadrequest,
                        "Modified_On": new Date()
                    };

                    corp_lead.update({'Corporate_Lead_Id': parseInt(Corporate_Lead_Id)}, updatelead_request, function (err, numaffected) {
                        res.json({"Msg": "Lead Updated Successfully.", "Status": "Success"});
                    });
                } else {
                    let leadrequest = JSON.parse(objRequest['Lead_Request']);
                    leadrequest['files'] = {Floater_Location_list: ""};

                    var lead_request = {
                        "Corp_Product_Id": objRequest['Corp_Product_Id'],
                        "Corp_Product_Name": objRequest['Corp_Product_Name'],
                        "Corp_Sub_Product_Id": objRequest['Corp_Sub_Product_Id'],
                        "Corp_Sub_Product_Name": objRequest['Corp_Sub_Product_Name'],
                        "Customer_name": objRequest['Customer_name'],
                        "Mobile_no": objRequest['Mobile_no'],
                        "Email": objRequest['Email'],
                        "Created_By": objRequest['Created_by'],
                        "Status": objRequest['Status'],
                        "Lead_Request": leadrequest,
                        "Source": objRequest['Source'],
                        "Created_On": new Date(),
                        "Modified_On": new Date()
                    };

                    let corp_leadobj = new corp_lead(lead_request);
                    corp_leadobj.save(function (err, dbres) {
                        var objResponse = dbres._doc;

                        // files
                        let file_name = "";
                        if (!isEmpty(files)) {
                            file_name = file_saved(files, objResponse.Corporate_Lead_Id);
                            corp_lead.update({'Corporate_Lead_Id': objResponse.Corporate_Lead_Id}, {$set: {"Lead_Request.files.Floater_Location_list": file_name}}, function (err, numAffected) {
                                console.log(err);
                                // res.json({"Msg": "Lead Updated Successfully.", "Status": "Success"});
                            });
                        }
                        var msg = "Lead Id : " + objResponse.Corporate_Lead_Id + " Created Successfully.";
                        res.json({"Msg": msg, "Status": "Success"});


                    });


                }
                //res.writeHead(200, {'content-type': 'text/plain'});
                //res.write('received upload:\n\n');
                //res.end();
            });

        } catch (e) {
            console.log(e);
            res.json({"Msg": e, "Status": "Fail"});
        }
    });


    app.post('/corp_lead_datas', function (req, res) {
        try {
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: 'Corporate_Lead_Id Customer_name Corp_Product_Name Corp_Sub_Product_Name Status Corp_Product_Id Corp_Sub_Product_Id Created_On Modified_On',
                sort: {'Modified_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            if (req.body.Created_by !== undefined) {
                filter["Created_By"] = req.body.Created_by;
            }
            if (req.body.customerName !== undefined) {
                filter["Customer_name"] = new RegExp(req.body.customerName, 'i');
            }
            if (req.body.Product_type !== undefined && req.body.Product_type !== "-- Select Product Type --") {
                filter["Corp_Product_Name"] = req.body.Product_type;
            }
            if (req.body.SubProduct_type !== undefined && req.body.SubProduct_type !== "-- Select Sub-Product Type --") {
                filter["Corp_Sub_Product_Name"] = req.body.SubProduct_type;
            }
             

            corp_lead.paginate(filter, optionPaginate).then(function (corp_datas) {
                res.json(corp_datas);
            });
        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });

    app.post('/finmart_corp_lead_datas', function (req, res) {
        try {

            var Page = req.params.Page - 0;
            var Skip = 0;
            var Limit = 10;
            
            if (Page > 1) {
                Skip = Limit * (Page - 1);
            }
            
            var Condition = {
                "Created_By": req.body.Created_by
                       
            };
            
            if(req.body.filter !== undefined){
                if(req.body.filter['Product_Name'] !== "" && req.body.filter['Product_Name'] !== "0" && req.body.filter['Product_Name'] !== undefined){
                    Condition['Corp_Product_Id'] = req.body.filter['Product_Name'];
                }
                if(req.body.filter['SubProduct_Name'] !== "" && req.body.filter['SubProduct_Name'] !== "0" && req.body.filter['SubProduct_Name'] !== undefined ){
                    Condition['Corp_Sub_Product_Id'] = req.body.filter['SubProduct_Name'];
                }
                if(req.body.filter['Customer_name'] !== "" &&  req.body.filter['Customer_name'] !== undefined){
                    Condition['Customer_name'] = new RegExp(req.body.filter['Customer_name'], 'i'); ;
                }
            }

            corp_lead.find(Condition).sort({
                Modified_On: -1
            }).select(['Corporate_Lead_Id', 'Customer_name', 'Corp_Product_Name', 'Corp_Sub_Product_Name', 'Status', 'Corp_Product_Id', 'Corp_Sub_Product_Id', 'Created_On', 'Modified_On', 'Lead_Request']).skip(Skip).limit(Limit).exec(function (err, dblead) {
                res.json(dblead);
            });
            
        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });

    app.get('/corp_forms_master/:product_type/:sub_product_type', function (req, res) {
        try {
            var product_id = parseInt(req.params['product_type']);
            var subproduct_id = req.params['sub_product_type'];
            var Conditions = {"Corp_Product_Id": {$in: [0, product_id]}, "Corp_Sub_Product_Id": {$in: [0, subproduct_id]}, "Is_Active": true};
            var resultArray = {"basic": null
                , "full": null
                , "global": null};
            var basicmaster = [];
            var fullmaster = [];
            var globalmaster = [];
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                var lms_forms_master = db.collection('corp_form_datas').find(Conditions, {_id: 0}).sort({tab_index: 1});
                lms_forms_master.forEach(function (doc, err) {

                    if (doc.form_category === "basic") {
                        basicmaster.push(doc);
                    } else if (doc.form_category === "full") {
                        fullmaster.push(doc);
                    } else {
                        globalmaster.push(doc);
                    }

                }, function () {
                    resultArray["basic"] = basicmaster;
                    resultArray["full"] = fullmaster;
                    resultArray["global"] = globalmaster;
                    res.json(resultArray);
                });
            });

        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });

    app.post('/get_corp_lead_datas', function (req, res) {
        try {

            corp_lead.find(function (err, dblmsData) {
                if (err) {

                } else {
                    if (dblmsData) {
                        console.log(dblmsData);
                        res.send(dblmsData);
                    }
                }
            });
        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });
    app.get('/get_corp_lead_data/:lead_id', function (req, res) {
        try {
            var Lead_Id = parseInt(req.params.lead_id);
            var corp_lead = require('../models/corporate_lead');
            corp_lead.find({"Corporate_Lead_Id": Lead_Id}, function (err, dblmsData) {
                if (err) {

                } else {
                    if (dblmsData) {
                        console.log(dblmsData);
                        res.send(dblmsData);
                    }
                }
            });
        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });

    app.get('/view_corp_lead_data/:lead_id', function (req, res) {
        try {
            var Lead_Id = parseInt(req.params.lead_id);
            var corp_lead = require('../models/corporate_lead');
            corp_lead.find({"Corporate_Lead_Id": Lead_Id}, function (err, dblmsData) {
                if (err) {

                } else {
                    if (dblmsData) {
                        console.log(dblmsData);
                        var objResponse = dblmsData[0]._doc.Lead_Request;
                        var lead_request = {
                            "Product_Name": dblmsData[0]._doc['Corp_Product_Name'],
                            "Sub_Product_Name": dblmsData[0]._doc['Corp_Sub_Product_Name'],
                            "Name_Insured": objResponse['Name_Insured'],
                            "Communication_Address": objResponse['Communication_Address'],
                            "Business_Occupancy": objResponse['Business_Occupancy'],
                            "Business_Occupancy_Details": objResponse['Business_Occupany_details'],
                            "Location_to_be_covered": objResponse['Location_to_be_covered'],
                            "Location_Pincode": objResponse['Location_to_be_covered_Pincode'],
                            "Current_insurer": objResponse['Current_insurer'],
                            "Policy_period": objResponse['Policy_period'],
                            "FEA_Arrangment": objResponse['FEA_Arrangment'],
                            "Type_of_Construction": objResponse['Type_of_Construction'],
                            "Age_of_building": objResponse['Age_of_building'],
                            "Is_any_low_line_area": objResponse['Is_any_low_line_area'],
                            "Stocks_on_Floater_Basis": objResponse['Stocks_on_Floater_Basis'],
                            "Stocks_Open_or_Closed": objResponse['Stocks_Open_or_Closed'],
                            "Manufacturing_description": objResponse['Manufacturing_description'],
                            "Additional_information": objResponse['Additional_information'],
                            "Additional_Requirements": objResponse['Additional_Requirements'],
                            "Material_used": objResponse['Material_used'],
                            "Sum_Insured_details": objResponse['Sum_Insured_details'],
                            "Floater_Location_list": config.environment.downloadurl + "/corp/" + Lead_Id + "/" + objResponse.files['Floater_Location_list']
                        };

                        res.send(lead_request);
                    }
                }
            });
        } catch (e) {
            console.log(e);
            res.json({"Msg": e});
        }
    });


};
function file_saved(files, Corporate_Lead_Id) {
    // files
    var fs = require('fs');
    let file_name = "";
    if (files.hasOwnProperty('Floater_Location_list')) {

        file_name = files['Floater_Location_list'].name.replace(/ /g, '_');
        let path = appRoot + "/tmp/corp/";
        let pdf_sys_loc_horizon = path + Corporate_Lead_Id + '/' + file_name;
        let oldpath = files['Floater_Location_list'].path;
        console.error('pdf_sys_loc_horizon_lms', pdf_sys_loc_horizon);
        console.error('oldpath_lms', oldpath);
        if (fs.existsSync(path + Corporate_Lead_Id))
        {
        } else
        {
            fs.mkdirSync(path + Corporate_Lead_Id);
        }
        fs.readFile(oldpath, function (err, data) {
            if (err) {
                console.error('Read', err);
            }
            console.log('File read!');
            console.error('File read_lms');
            // Write the file
            fs.writeFile(pdf_sys_loc_horizon, data, function (err) {
                if (err) {
                    console.error('Write', err);
                } else {
                    console.error('Writefile');
                }
            });
            // Delete the file
            fs.unlink(oldpath, function (err) {
                if (err)
                    throw err;
                console.log('File deleted!');
                console.error('File deleted_lms');
            });
        });



    }
    return file_name;
}
function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
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