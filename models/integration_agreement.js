/* Author : Muskan
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;

var integration_agreement_Schema = new Schema({
    "Integration_Agreement_Id": Number,
    "Insurer" : Number,
    "Is_Car": {type: Number, enum: [0, 1], default: 0},
    "Is_Bike": {type: Number, enum: [0, 1], default: 0},
    "Is_CV": {type: Number, enum: [0, 1], default: 0},
    "Is_Health": {type: Number, enum: [0, 1], default: 0},
    "Is_Travel": {type: Number, enum: [0, 1], default: 0},
    "Is_Life": {type: Number, enum: [0, 1], default: 0},
    "Is_Marine": {type: Number, enum: [0, 1], default: 0},
    "Is_Agreement": {type: Number, enum: [0, 1], default: 0},
    "Agreement_Signing_Date": {type: Date},
    "Is_NDA": {type: Number, enum: [0, 1], default: 0},
    "NDA_Signing_Date": {type: Date},
    "Remark": {type: String},
    "Created_By": {type: String},
    "Created_On": {type: Date},
    "Modified_On": {type: Date},
    "Modified_By": {type: String}
});
integration_agreement_Schema.plugin(mongoosePaginate);
integration_agreement_Schema.plugin(autoIncrement.plugin, {model: 'integration_agreement', field: 'Integration_Agreement_Id', startAt: 1});
var integration_agreement = mongoose.model('integration_agreement',integration_agreement_Schema);
module.exports = integration_agreement;