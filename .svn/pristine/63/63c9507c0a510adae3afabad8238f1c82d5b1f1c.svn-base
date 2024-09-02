/* Author: Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

var quote_download_historySchema = new Schema({
    "Download_History_Id": Number,
    "ss_id": Number,
    "Date_Time": Date,
    "Pdf_File_Name": Number,
    'PB_CRN': Number,
    "Product_Id": Number,
    "User_Data_Id": Number
});

quote_download_historySchema.plugin(mongoosePaginate);
var quote_download_history = connection.model('quote_download_historys', quote_download_historySchema);
module.exports = quote_download_history;