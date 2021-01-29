var winston = require('winston');
const config = require('./config');
const moment = require('moment');

var getNamespace = require('continuation-local-storage').getNamespace;

var fs = require('file-system');

var folderName_normal = config.log.orgLog + '/' + moment(new Date()).format('YYYYMM') + '/normal';
var folderName_error = config.log.orgLog + '/' + moment(new Date()).format('YYYYMM') + '/error';
var logfile_normal = folderName_normal + '/' + moment(new Date()).format('YYYY-MM-DD') + '.log';
var logfile_error = folderName_error + '/' + moment(new Date()).format('YYYY-MM-DD') + '.log';


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
            filename: logfile_normal,
            handleExceptions: true,
            json: true,
            maxsize: 10483960, // 10MB
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
var winstonLoggerError = new winston.Logger({
    transports: [
        new winston.transports.File({
            filename: logfile_error,
            handleExceptions: true,
            json: true,
            maxsize: 10483960, // 10MB
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
    ensureDirSync(folderName_normal);
    ensureDirSync(folderName_error);
    var myRequest = getNamespace('my request');
    message = myRequest && myRequest.get('reqId') ? JSON.stringify(message) + " reqId: " + myRequest.get('reqId') : message;
    return message;
};

var logger = {
    log: function (level, message) {
        winstonLogger.log(level, formatMessage(message));
    },
    error: function (message) {
        winstonLoggerError.error(formatMessage(message));
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