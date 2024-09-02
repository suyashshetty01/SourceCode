
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
const multer = require('multer');
const upload = multer({dest : appRoot + '/tmp/multerUploads'})
module.exports.controller = function (app) {
    app.post('/fileUpload', (req, res) => {
        var fs = require('fs');
        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        let timeStamp = new Date().getSeconds();
        let docPath = '/tmp/formidableUpload/' + timeStamp;
        form.parse(req, function (err, fields, files) {
            if (files.hasOwnProperty('passport')) {
                let passportImg = fs.readFileSync(files.passport.path);
                if (fs.existsSync(appRoot + '/tmp/formidableUpload/')) {
                    fs.writeFileSync(appRoot + docPath, passportImg);
                } else {
                    fs.mkdirSync(appRoot + '/tmp/formidableUpload/');
                    fs.writeFileSync(appRoot + docPath, passportImg);
                }
            }
            res.write('file uploaded');

        });
    });
};