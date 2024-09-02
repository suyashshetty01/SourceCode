/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
 * 
 * {
 "_id" : ObjectId("591ad96ac273518df36fbec2"),
 "Client_Id" : "1",
 "Client_Unique_Id" : "123124343",
 "Client_Name" : "Self",
 "Secret_Key" : "12345678",
 "Is_Active" : "1",
 "Created_On" : "",
 "Modified_On" : ""
 }
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var insurerSchema = new Schema(
        {

            "Insurer_ID": Number,
            "Insurer_Name": String,
            "IsActive": Boolean,
            "CreatedOn": Date,
            "Insurer_Logo_Name": String,
            "IsInternal": Boolean,
            "Insurer_Code": String,
            "Insurer_Logo_Name_Mobile": String,
            "Product_Id":[Number]
        }
);

var Insurer = mongoose.model('Insurer', insurerSchema);

// make this available to our users in our Node applications
module.exports = Insurer;