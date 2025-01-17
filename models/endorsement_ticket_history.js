/* Author: Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');

var endorsement_ticket_historySchema = new Schema({
    "PB_CRN": Number,
    "Insurer_Id": Number,
    "Product_Id" : Number,
    "Endorsement_data": Object,
    "Created_on": Date,
    "Modified_on": Date
});

endorsement_ticket_historySchema.plugin(mongoosePaginate);
endorsement_ticket_historySchema.plugin(autoIncrement.plugin, {model: 'endorsement_ticket_history', field: 'Id', startAt: 1});
var endorsement_ticket_history = mongoose.model('endorsement_ticket_historys', endorsement_ticket_historySchema);
module.exports = endorsement_ticket_history;