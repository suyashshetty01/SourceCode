/* Piyush
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
let mongoosePaginate = require('mongoose-paginate');

let user_disposition_Schema = new Schema({
    "Disposition_Id":Number, //store ssid
    "Status" : String,
    "Sub_Status" : String,
    "Remark" : String,
    "Disposition_By" : Number,//store ssid of logged in user
    "Is_Latest" : Number,
    "File_Name": String,
    "Customer_Name" : String,
    "Customer_Mobile" : Number,
    "Disposition_Source":String,
    "Next_Call_Date" : {type: Date},
    "Created_On" : {type: Date},
    "Modified_On" : {type: Date}
});

// the schema is useless so far
// we need to create a model using it
user_disposition_Schema.plugin(mongoosePaginate);
let user_disposition = mongoose.model('user_disposition', user_disposition_Schema);

// make this available to our users in our Node applications
module.exports = user_disposition;