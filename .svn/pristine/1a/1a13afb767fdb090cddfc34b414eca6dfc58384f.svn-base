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

var erp_dataSchema = new Schema({
    'Registration_Number': String,
    'Product_Id': Number,
    'Status': Number,
    'Vehicle_Data': Object,
    'Core_Response': Object,
    'Is_Active': {type: Boolean, default: true},
    'Created_On': {type: Date},
    'Modified_On': {type: Date}
});
erp_dataSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
    if (!this.Erp_Data_Id) {
        this.Created_On = currentDate;
    }
    this.Modified_On = currentDate;
    next();
});
erp_dataSchema.plugin(mongoosePaginate);
erp_dataSchema.plugin(autoIncrement.plugin, {model: 'Erp_Data', field: 'Erp_Data_Id', startAt: 1});
var Erp_Data = connection.model('Erp_Data', erp_dataSchema);
Erp_Data.prototype.get_erp_data_by_reg_number = function (reg_number, product_id) {
    var objErp = this;
    console.log('Start', 'get_erp_data_by_reg_number');
//url - http://202.131.96.98:8041/PolicyBossRegNoService.svc/GetRegNoData?v=MH04GJ4131
    reg_number = reg_number.toString().replace(/\-/g, '').toUpperCase();
    var Client = require('node-rest-client').Client;
    var client = new Client();
    //console.log('args', args);
    var Erp_Data_Model = require('../models/erp_data');
    var objErpData = {
        "Registration_Number": reg_number,
        "Product_Id": product_id,
        "Status": 2
    };
    Erp_Data_Model.findOne(objErpData, function (err, dbErpData) {
        if (!err && dbErpData) {
            console.log('Data_Exists');
            objErp.Response.json(dbErpData.Vehicle_Data);            
        } else {
            console.log('Data_Not_Exists');
            objErpData.Status = 1;
            var objErp_Data_Model = new Erp_Data_Model(objErpData);
            objErp_Data_Model.save(function (err, objDbErpData) {
                console.log('ErpData_inserted', objDbErpData.Erp_Data_Id);
                client.get('http://202.131.96.98:8041/PolicyBossRegNoService.svc/GetRegNoData?v=' + reg_number, function (ErpData, ErpResponse) {
                    console.log(ErpData, ErpResponse);
                    if (ErpData) {
                        if (typeof ErpData !== 'object') {

                        }
                        var erp_status = 1;
                        var erp_data = {'Status': 'No_Data'};
                        var objErpData = {
                            'Core_Response': ErpData
                        };
                        if (ErpData.hasOwnProperty('GetRegNoDataResult') && ErpData.GetRegNoDataResult.length > 0) {
                            objErpData.Vehicle_Data = ErpData.GetRegNoDataResult[0];
                            erp_status = 2;
                            erp_data = objErpData.Vehicle_Data;

                        }
                        objErpData.Status = erp_status;
                        var Erp_Data_Model = require('../models/erp_data');
                        Erp_Data_Model.update({'Erp_Data_Id': objDbErpData.Erp_Data_Id}, objErpData, function (err, doc) {
                            console.log('Erp_Data', 'Update', err, doc);
                        });
                        objErp.Response.json(erp_data);
                    }
                });
                console.log('Start', 'get_erp_data_by_reg_number');
            });
        }
    });


};

module.exports = Erp_Data;