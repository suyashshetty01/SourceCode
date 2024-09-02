/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

module.exports.controller = function (app) {

    app.get('/icici_tokens/generate', function (req, res, next) {
        get_idv_motor_token(res);
        get_motor_token(res);
        get_health_token(res);
        get_hospi_token(res);
        get_marine_token(res);
        get_travel_token(res);
    });
};
function get_idv_motor_token(res) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    var args = {
        data: {
            'grant_type': 'password',
            'username': 'landmark',
            'password': ((config.environment.name !== 'Production') ? 'l@n!m@$k' : 'l@n&M@rk'),
            'scope': 'esbmotormodel',
            'client_id': 'ro.landmark',
            'client_secret': ((config.environment.name !== 'Production') ? 'ro.l@n!m@$k' : 'ro.l@n&M@rkcL!3nt')
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    function jsonToQueryString(json) {
        return  Object.keys(json).map(function (key) {
            return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
        }).join('&');
    }
    args.data = jsonToQueryString(args.data);
    var tokenservice_url = config.icici_health_auth.auth_url;
    console.log(JSON.stringify(args));
    client.post(tokenservice_url, args, function (data, response) {
        // parsed response body as js object 
        console.log('token generated in icici_tokens.js for motor');
        console.log(data);
        var product_id = 500;
        var access_key = data['access_token'];
        var objResponse = {
            "Token": access_key,
            "Product_Id": product_id,
            "Created_On": new Date()
        };
        var Icici_Token = require('../models/icici_token');
        var objIcici_Token = new Icici_Token(objResponse);
        objIcici_Token.save(function (err, objIcici_Token) {
            if (err) {
                res.json({'Msg': 'IDV Motor Failed'});
            } else {
                res.json({'Msg': 'IDV Motor Inserted'});
            }
        });
    });
}
function get_motor_token(res) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    var args = {
        data: {
            'grant_type': 'password',
            'username': 'landmark',
            'password': ((config.environment.name !== 'Production') ? 'l@n!m@$k' : 'l@n&M@rk'),
            'scope': 'esbmotor',
            'client_id': 'ro.landmark',
            'client_secret': ((config.environment.name !== 'Production') ? 'ro.l@n!m@$k' : 'ro.l@n&M@rkcL!3nt')
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    function jsonToQueryString(json) {
        return  Object.keys(json).map(function (key) {
            return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
        }).join('&');
    }
    args.data = jsonToQueryString(args.data);
    var tokenservice_url = config.icici_health_auth.auth_url;
    console.log(JSON.stringify(args));
    client.post(tokenservice_url, args, function (data, response) {
        // parsed response body as js object 
        console.log('token generated in icici_tokens.js for motor');
        console.log(data);
        var product_id = 1;
        var access_key = data['access_token'];
        var objResponse = {
            "Token": access_key,
            "Product_Id": product_id,
            "Created_On": new Date()
        };
        var Icici_Token = require('../models/icici_token');
        var objIcici_Token = new Icici_Token(objResponse);
        objIcici_Token.save(function (err, objIcici_Token) {
            if (err) {
                res.json({'Msg': 'Motor Failed'});
            } else {
                res.json({'Msg': 'Motor Inserted'});
            }
        });
    });
}
function get_health_token(res) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    var args = {
        data: {
            'grant_type': 'password',
            'username': ((config.environment.name !== 'Production') ? 'policyboss' : 'landmark'),
            'password': ((config.environment.name !== 'Production') ? 'pol!cyboss' : 'l@n&M@rk'),
            'scope': 'esbhealth',
            'client_id': ((config.environment.name !== 'Production') ? 'ro.policyboss' : 'ro.landmark'),
            'client_secret': ((config.environment.name !== 'Production') ? 'pol!cybossCLi3nt' : 'ro.l@n&M@rkcL!3nt')
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    function jsonToQueryString(json) {
        return  Object.keys(json).map(function (key) {
            return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
        }).join('&');
    }
    args.data = jsonToQueryString(args.data);
    var tokenservice_url = config.icici_health_auth.auth_url;
    console.log(JSON.stringify(args));
    client.post(tokenservice_url, args, function (data, response) {
        // parsed response body as js object 
        console.log('token generated in icici_tokens.js for health');
        console.log(data);
        var product_id = 2;
        var access_key = data['access_token'];
        var objResponse = {
            "Token": access_key,
            "Product_Id": product_id,
            "Created_On": new Date()
        };
        var Icici_Token = require('../models/icici_token');
        var objIcici_Token = new Icici_Token(objResponse);
        objIcici_Token.save(function (err, objIcici_Token) {
            if (err) {
                res.json({'Msg': 'Health Failed'});
            } else {
                res.json({'Msg': 'Health Inserted'});
            }
        });
    });
}
function get_marine_token(res) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    var args = {
        data: {'grant_type': 'password',
            'username': 'landmark',
            'password': 'l@n!m@$k',
            'scope': 'esbmarine',
            'client_id': 'ro.landmark',
            'client_secret': 'ro.l@n!m@$k'
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    function jsonToQueryString(json) {
        return  Object.keys(json).map(function (key) {
            return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
        }).join('&');
    }
    args.data = jsonToQueryString(args.data);
    var tokenservice_url = config.icici_marine_auth.auth_url;
    console.log(JSON.stringify(args));
    client.post(tokenservice_url, args, function (data, response) {
        // parsed response body as js object 
        console.log('token generated in icici_tokens.js for Marine');
        console.log(data);
        var product_id = 13;
        var access_key = data['access_token'];
        var objResponse = {
            "Token": access_key,
            "Product_Id": product_id,
            "Created_On": new Date()
        };
        var Icici_Token = require('../models/icici_token');
        var objIcici_Token = new Icici_Token(objResponse);
        objIcici_Token.save(function (err, objIcici_Token) {
            if (err) {
                res.json({'Msg': 'Marine Failed'});
            } else {
                res.json({'Msg': 'Marine Inserted'});
            }
        });
    });
}
function get_hospi_token(res) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    var args = {
        data: {
            'grant_type': 'password',
            'username': 'landmark',
            'password': ((config.environment.name !== 'Production') ? 'l@n!m@$k' : 'l@n&M@rk'),
            'scope': 'esbzerotat',
            'client_id': 'ro.landmark',
            'client_secret': ((config.environment.name !== 'Production') ? 'ro.l@n!m@$k' : 'ro.l@n&M@rkcL!3nt')
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    function jsonToQueryString(json) {
        return  Object.keys(json).map(function (key) {
            return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
        }).join('&');
    }
    args.data = jsonToQueryString(args.data);
    var tokenservice_url = config.icici_health_auth.auth_url;
    console.log(JSON.stringify(args));
    client.post(tokenservice_url, args, function (data, response) {
        // parsed response body as js object 
        console.log('token generated in icici_tokens.js for icici hospi');
        console.log(data);
        var product_id = 22; //used for hospicash
        var access_key = data['access_token'];
        var objResponse = {
            "Token": access_key,
            "Product_Id": product_id,
            "Created_On": new Date()
        };
        var Icici_Token = require('../models/icici_token');
        var objIcici_Token = new Icici_Token(objResponse);
        objIcici_Token.save(function (err, objIcici_Token) {
            if (err) {
                res.json({'Msg': 'Hospi Failed'});
            } else {
                res.json({'Msg': 'Hospi Inserted'});
            }
        });
    });
}
function get_travel_token(res) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    var args = {
        data: {
            'grant_type': 'password',
            'username': ((config.environment.name !== 'Production') ? 'policyboss' : 'landmark'),
            'password': ((config.environment.name !== 'Production') ? 'pol!cyboss' : 'l@n&M@rk'),
            'scope': 'esbinternationaltravel',
            'client_id': ((config.environment.name !== 'Production') ? 'ro.policyboss' : 'ro.landmark'),
            'client_secret': ((config.environment.name !== 'Production') ? 'pol!cybossCLi3nt' : 'ro.l@n&M@rkcL!3nt')
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    function jsonToQueryString(json) {
        return  Object.keys(json).map(function (key) {
            return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
        }).join('&');
    }
    args.data = jsonToQueryString(args.data);
    var tokenservice_url = config.icici_travel_auth.auth_url;
    console.log(JSON.stringify(args));
    client.post(tokenservice_url, args, function (data, response) {
        // parsed response body as js object 
        console.log('token generated in icici_tokens.js for travel');
        console.log(data);
        var product_id = 4;
        var access_key = data['access_token'];
        var objResponse = {
            "Token": access_key,
            "Product_Id": product_id,
            "Created_On": new Date()
        };
        var Icici_Token = require('../models/icici_token');
        var objIcici_Token = new Icici_Token(objResponse);
        objIcici_Token.save(function (err, objIcici_Token) {
            if (err) {
                res.json({'Msg': 'Travel Failed'});
            } else {
                res.json({'Msg': 'Travel Inserted'});
            }
        });
    });
}