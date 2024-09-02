let mongoose = require('mongoose');
let config = require('config');
let Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
let connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

let training_historySchema = new Schema({
    'User_Id': Number,
    'Logged_In': Number,
    'Time_Spent': Number,
    'Day': {type: Date},    
    'Created_On': {type: Date},
    'Modified_On': {type: Date}
});


let training_history = connection.model('training_history', training_historySchema);
module.exports = training_history;