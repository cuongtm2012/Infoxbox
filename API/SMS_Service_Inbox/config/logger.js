const winston = require('winston');
const config = require('./config');
const moment = require('moment');
const appRoot = require('app-root-path');
var getNamespace = require('continuation-local-storage').getNamespace;

var fs = require('file-system');

let folderLogs = appRoot + '/logs';
let folderName_SMS = folderLogs + '/' + moment(new Date()).format('YYYYMM');
let logfile_name = folderName_SMS + '/' + moment(new Date()).format('YYYY-MM-DD') + '.log';

function ensureDirSync(dirpath) {
    try {
        return fs.mkdirSync(dirpath)
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

var winstonLogger = winston.createLogger({
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
    folderLogs = appRoot + '/logs';
    folderName_SMS = folderLogs + '/' + moment(new Date()).format('YYYYMM');
    logfile_name = folderName_SMS + '/' + moment(new Date()).format('YYYY-MM-DD') + '.log';
    ensureDirSync(folderLogs);
    ensureDirSync(folderName_SMS);
    var myRequest = getNamespace('my request');
    message = myRequest && myRequest.get('reqId') ? JSON.stringify(message) + " reqId: " + myRequest.get('reqId') : message;
    return message;
};

var logger = {
    log: function (level, message) {
        winstonLogger.log(level, formatMessage(message));
    },
    error: function (message) {
        winstonLogger.error(formatMessage(message));
    },
    warn: function (message) {
        winstonLogger.warn(formatMessage(message));
    },
    verbose: function (message) {
        winstonLogger.verbose(formatMessage(message));
    },
    info: function (message) {
        winstonLogger.info(formatMessage(message));
    },
    debug: function (message) {
        winstonLogger.debug(formatMessage(message));
    },
    silly: function (message) {
        winstonLogger.silly(formatMessage(message));
    }
};

module.exports = logger;