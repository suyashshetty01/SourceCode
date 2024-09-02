var express = require('express');

var router = express.Router();

/* GET users listing. */
router.get('/vehicles', function (req, res, next) {
    console.log('Premium Request Received with get ' + req);
    res.send('This is premium request');
});
router.post('/vehicles', function (req, res, next) {
    console.log('Premium Request Received with [pst ' + JSON.stringify(req));
    res.send('This is premium request');
});

module.exports = router;
