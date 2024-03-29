var winston = require('winston');
const config = require('./config');
const moment = require('moment');
var getNamespace = require('continuation-local-storage').getNamespace;

var fs = require('file-system');

var now = new Date();
var folderName = config.log.orgLog + '/' + now.getFullYear() + (now.getMonth()+1);
var logfile_name = folderName + '/' + now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate() + '.log';

function ensureDirSync(dirpath) {
    try {
        return fs.mkdirSync(dirpath)
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

var winstonLogger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'debug',
            filename: logfile_name,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
            timestamp: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true
        })
    ],
    exitOnError: false
});

winstonLogger.stream = {
    write: function (message, encoding) {
        winstonLogger.info(message);
    }
};

// Wrap Winston logger to print reqId in each log
var formatMessage = function (message) {
    ensureDirSync(folderName);
    var myRequest = getNamespace('my request');
    message = myRequest && myRequest.get('reqId') ? JSON.stringify(message) + " reqId: " + myRequest.get('reqId') : message;
    return message;
};

var logger = {
    log: async function (level, message) {
        console.log('log: ',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), ' ', message);
    },
    error: async function (message) {
        console.log('error: ',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), ' ', message);
    },
    warn: async function (message) {
        console.log('warn: ',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), ' ', message);
    },
    verbose: async function (message) {
        console.log('verbose: ',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), ' ', message);
    },
    info: async function (message) {
        console.log('info: ',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), ' ', message);
    },
    debug: async function (message) {
        console.log('debug: ',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), ' ', message);
    },
    silly: async function (message) {
        console.log('silly: ',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), ' ', message);
    }
};

module.exports = logger;