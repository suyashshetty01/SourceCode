/*
 * Author : Dipali Revanwar
 * Date: 15-11-2021
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');

var content_management_Schema = new Schema({
    "Content_Id": Number,
    "Status": String,
    "Created_By": String,
    "Modified_By": Number,
    "Created_On": Date,
    "Modified_On": Date,
    "Is_Active": Number,
    "Is_Preview": Number,
    "ss_id": Number,
    "fba_id": Number,
    "Title": String,
    "URL": String,
    "Content": String,
    "Keywords": String,
    "Description": String,
    "Draft_Data": Object,
    "Final_Data": Object,
    "Version": Number,
    "Type": String,
    "Category": {type: String, enum: ["CMS", "BLOG"]},
    "Author": String,
    "Source": String,
    "Blog_Date": Date,
    "Image": String,
    "Blog_Title": String,
    "Spotlight":String
});

// the schema is useless so far
// we need to create a model using it
content_management_Schema.plugin(mongoosePaginate);
//content_management_Schema.plugin(autoIncrement.plugin, {model: 'content_management', field: 'Content_Id', startAt: 1});
var content_management = mongoose.model('content_management', content_management_Schema);

// make this available to our users in our Node applications
module.exports = content_management;