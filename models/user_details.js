/*
 * Author : Khushbu Gite 
 * Date: 19-08-2019 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');

var userdetails_Schema = new Schema({
    "Ticket_Id" : Number,
    "Ticket_code" : String,
    "Product" : Number,
    "Category" : String,
    "Status" :  String,
    "Created_By" : String,
    "Modified_By" : Number,
    "Created_On" : Date,
    "Modified_On" : Date,
    "CRN" : Schema.Types.Mixed,
    "ss_id" : Number,
    "CRN_owner" : String,
    "fba_id" : Number,
    "CRN_fba_id" : Number,
    "channel" : String,
    "subchannel" : String,
    "Agent_Email_Id" : String,
    "Transaction_On" : Date,
    "Source" : String,
    "RM_Email_Id" :String,
    "Pincode" :Number,
	"Insurer_Id": Number
});

// the schema is useless so far
// we need to create a model using it
userdetails_Schema.plugin(mongoosePaginate);
userdetails_Schema.plugin(autoIncrement.plugin, {model: 'user_details', field: 'Ticket_Id', startAt: 1});
var user_details = mongoose.model('user_details', userdetails_Schema);

userdetails_Schema.pre('save', function (done) {
  if (this.isNew){ //new Record => create
    //this function is the one that should do the FindAndModify stuff
    getNewId(function(autoincremented_id){
      this.id=autoincremented_id;
      done();
    });
  }else{
    done();
  }
});

// make this available to our users in our Node applications
module.exports = user_details;
