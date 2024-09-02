let mongoose = require('mongoose');
let config = require('config');
let Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
let connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

let exam_resultSchema = new Schema({
    'User_Id': Number,
    'Total_Score': Number,
    'Passing_Marks': Number,
    'Result': String,    
    'Created_On': {type: Date},
    'Modified_On': {type: Date}
});


let exam_result = connection.model('exam_result', exam_resultSchema);
module.exports = exam_result;