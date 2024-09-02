var express = require('express');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var config = require('config');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');
var fs = require('fs');
var session = require('express-session');
var sess;


var index = require('./routes/index');
var users = require('./routes/users');
var quote = require('./routes/quote');
var master = require('./routes/master');
var report = require('./routes/report');

//var admin = require('./routes/admin');
var postservicecall = require('./routes/postservicecall');

var app = express();
app.use(session({
        secret: 'Anuj',
        cookie: { maxAge: 600000 },
        saveUninitialized: true, //dont create session for anonymous users
        resave: false //dont save session to store if it hasnt change
        // rolling: true,  //reset the cokie max age on every request
        // duration: 30 * 60 * 1000,
        // activeDuration: 5 * 60 * 1000,
    }));
//app.use(bodyParser.json()); 
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.all('/*', function (req, res, next) {
	
	var ip;	
	var is_allowed = false;
	var referer = '';
	var source = 'YTD';
	try{
		if (req.headers['x-forwarded-for']) {
			ip = req.headers['x-forwarded-for'].split(",")[0];
		} else if (req.connection && req.connection.remoteAddress) {
			ip = req.connection.remoteAddress;
		} else {
			ip = req.ip;
		}
		
		
		
		referer = req.headers.referer;
		if(typeof referer !== 'undefined' && referer.toString().indexOf('policyboss') > -1){
			is_allowed = true;
			source = "PolicyBossSite";
		}
		if(typeof referer !== 'undefined' && referer.toString().indexOf('d3j57uxn247eva.cloudfront.net') > -1){
			is_allowed = true;
			source = "AWSPolicyBoss";
		}
		if(ip === '180.179.132.185'){
			source = "PolicyBossServer";
		}
		if(ip === '127.0.0.1'){
			source = "Horizon";
		}
		console.error('LOG','REFERER', source ,referer,ip,typeof req.headers.referer);
	}
	catch(e){
		console.error('Exception','REFERER_CHECK',e);		
	}
	if(is_allowed || true){
		res.header("Access-Control-Allow-Credentials", "true");
		res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
		res.header("Access-Control-Allow-Origin", "*");
		next();
	}
	else{
		console.error('LOG','REFERER',req.headers.referer);
		res.end('Access denied');
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/quote', quote);
app.use('/report', report);
app.use('/user', users);
//app.use('/admin', admin);
app.use('/postservicecall', postservicecall);
// viewed at http://localhost:8080
app.all('/adminpanel/nsci/nsci_list.html', function (req, res) {
    var http = require('http');
    var auth = require('basic-auth');
    var credentials = auth(req);

    if (!credentials || credentials.name !== 'tom' || credentials.pass !== 'jerry') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied');
    } else {
        var urlpath = req.url;
        urlpath = urlpath.toString().replace('adminpanel', 'Admin');
        res.sendFile(path.join(__dirname + urlpath));
    }
});
app.all('/adminpanel/pages/pospsummary.html', function (req, res) {
    var http = require('http');
    var auth = require('basic-auth');
    var credentials = auth(req);

    if (!credentials || credentials.name !== 'tom' || credentials.pass !== 'jerry') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied');
    } else {
        var urlpath = req.url;
        urlpath = urlpath.toString().replace('adminpanel', 'Admin');
        res.sendFile(path.join(__dirname + urlpath));
    }
});
app.all('/adminpanel/pages/daily.html', function (req, res) {
    var http = require('http');
    var auth = require('basic-auth');
    var credentials = auth(req);
    var urlpath = req.url;
    var arr_url = urlpath.split('?');
    var obj_qs = {}
    if (typeof arr_url[1] !== 'undefined') {
        var arr_qs = arr_url[1].split('&');
        for (var k in arr_qs) {
            var k1 = arr_qs[k].split('=')[0];
            var v1 = arr_qs[k].split('=')[1];
            obj_qs[k1] = v1;
        }
    }


    var is_authenticated = false;
    if (credentials) {
        if (obj_qs.hasOwnProperty('channel') && obj_qs.channel !== '') {
            if (obj_qs.channel == 'KM' && credentials.name === 'pluskar' || credentials.pass === 'finmart') {
                is_authenticated = true;
            }
            if (obj_qs.channel == 'DC' && credentials.name === 'dc' || credentials.pass === 'finmart') {
                is_authenticated = true;
            }
            if (obj_qs.channel == 'SM' && credentials.name === 'sm' || credentials.pass === 'horizon') {
                is_authenticated = true;
            }
			if (obj_qs.channel == 'GS' && credentials.name === 'gs' || credentials.pass === 'gs2019') {
                is_authenticated = true;
            }
            if (obj_qs.channel == 'FINPEACE' && credentials.name === 'fp' || credentials.pass === 'finmart') {
                is_authenticated = true;
            }
        } else {
            if (credentials.name === 'jerry' || credentials.pass === 'tom') {
                is_authenticated = true;
            }
        }
    }

    if (is_authenticated) {
        urlpath = arr_url[0];
        urlpath = urlpath.toString().replace('adminpanel', 'Admin');
        res.sendFile(path.join(__dirname + urlpath));
    } else {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied');

    }
});
app.all('/adminpanel/pages/dailysummary.html', function (req, res) {
    var http = require('http');
    var auth = require('basic-auth');
    var credentials = auth(req);

    if (!credentials || credentials.name !== 'policyboss' || credentials.pass !== '01012019') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied');
    } else {
        var urlpath = req.url;
        urlpath = urlpath.toString().replace('adminpanel', 'Admin');
        res.sendFile(path.join(__dirname + urlpath));
    }
});

app.all('/adminpanel/pages/layout/default.html', function (req, res) {
    console.log('Start', this.constructor.name, 'motor_daily_report');
    var http = require('http');
    var auth = require('basic-auth');
    var credentials = auth(req);

    if (!credentials || credentials.name !== config.auth_url.user || credentials.pass !== config.auth_url.pass) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied');
    } else {
        var urlpath = req.url;
        urlpath = urlpath.toString().replace('adminpanel', 'Admin');
        res.sendFile(path.join(__dirname + urlpath));
    }
});
app.all('/adminpanel/*', function (req, res) {
    var urlpath = req.url;
    urlpath = urlpath.toString().replace('adminpanel', 'Admin');
    res.sendFile(path.join(__dirname + urlpath));
});
app.all('/pdf/*', function (req, res) {
    var urlpath = req.url;
    urlpath = urlpath.toString().replace('pdf', 'tmp/pdf');
    res.sendFile(path.join(__dirname + urlpath));
});
app.all('/HR_Photo/*', function (req, res) {
    var urlpath = req.url;
    urlpath = urlpath.toString().replace('HR_Photo', 'tmp/HR_Photo');
    res.sendFile(path.join(__dirname + urlpath));
});
app.all('/pdf-files/policy/*', function (req, res) {
    var urlpath = req.url;
    urlpath = urlpath.toString().replace('pdf-files/policy', 'tmp/pdf');
    res.sendFile(path.join(__dirname + urlpath));
});
app.all('/policy_email/*', function (req, res) {
    var urlpath = req.url;
    urlpath = urlpath.toString().replace('policy_email', 'tmp/policy_email');
    res.sendFile(path.join(__dirname + urlpath));
});
app.all('/customer_care_email/*', function (req, res) {
    var urlpath = req.url;
    urlpath = urlpath.toString().replace('customer_care_email', 'tmp/customer_care_email');
    res.sendFile(path.join(__dirname + urlpath));
});
app.all('/pg_ack/*', function (req, res) {
    var urlpath = req.url;
    urlpath = urlpath.toString().replace('pg_ack', 'tmp/pg_ack');
    res.sendFile(path.join(__dirname + urlpath));
});
app.all('/tmp/:folder/:file', function (req, res) {
    var urlpath = req.url;
    var folder = req.params.folder;
    var file = req.params.file;
    urlpath = urlpath.toString().replace('pdf', 'tmp/log');
    res.sendFile(path.join(__dirname + '/tmp/' + folder + '/' + file));
});
// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
    if (file.substr(-3) == '.js') {
        route = require('./controllers/' + file);
        console.log('Controller', file);
        route.controller(app);
    }
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
