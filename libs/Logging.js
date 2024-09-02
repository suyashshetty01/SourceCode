'use strict';
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var util = require('util');
const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = appRoot + "/tmp/error/";
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const infologger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info'
        }),
        new (require('winston-daily-rotate-file'))({
            filename: `${logDir}/-info.log`,
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            level: env === 'development' ? 'verbose' : 'info'
        })
    ]
});
const errorlogger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info'
        }),
        new (require('winston-daily-rotate-file'))({
            filename: `${logDir}/-error.log`,
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            level: env === 'development' ? 'verbose' : 'info'
        })
    ]
});
//logger.debug('Debugging info');
//logger.verbose('Verbose info');
//logger.info('Hello world');
//logger.warn('Warning message');
//logger.error('Error info');

function formatArgs(args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = function () {
    infologger.info.apply(infologger, formatArgs(arguments));
};
console.info = function () {
    infologger.info.apply(infologger, formatArgs(arguments));
};
console.debug = function () {
    infologger.debug.apply(infologger, formatArgs(arguments));
};
console.warn = function () {
    errorlogger.warn.apply(errorlogger, formatArgs(arguments));
};
console.error = function () {
    errorlogger.error.apply(errorlogger, formatArgs(arguments));
    var args = {
        data: formatArgs(arguments),
        headers: {
            "Content-Type": "application/json"
        }
    };
    var Client = require('node-rest-client').Client;
    var client = new Client();
    var config = require('config');
    client.post('http://qa-horizon.policyboss.com:3000' + '/report/save_log?env=' + config.environment.name + '&type=ERR', args, function (data, response) {

    });
};
