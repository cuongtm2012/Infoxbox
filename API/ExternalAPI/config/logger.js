var winston = require('winston');
const config = require('./config');
const moment = require('moment');
var appRoot = require('app-root-path');
var getNamespace = require('continuation-local-storage').getNamespace;

var fs = require('file-system');

var folderLogs = appRoot + '/logs';
var folderName_External = folderLogs + '/' + moment(new Date()).format('YYYYMM');
var folderName_normal = folderName_External + '/normal';
var folderName_error = folderName_External + '/error';
var logfile_normal = folderName_normal + '/' + moment(new Date()).format('YYYY-MM-DD') + '.log';
var logfile_error = folderName_error + '/' + moment(new Date()).format('YYYY-MM-DD') + '.log';


async function ensureDirSync(dirpath) {
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
var formatMessage = async function (message) {
    await ensureDirSync(folderLogs);
    await ensureDirSync(folderName_External);
    await ensureDirSync(folderName_error);
    await ensureDirSync(folderName_normal);
    var myRequest = getNamespace('my request');
    message = myRequest && myRequest.get('reqId') ? JSON.stringify(message) + " reqId: " + myRequest.get('reqId') : message;
    return message;
};

var logger = {
    log: async function (level, message) {
        winstonLogger.log(level, await formatMessage(message));
    },
    error: async function (message) {
        winstonLoggerError.error(await formatMessage(message));
    },
    warn: async function (message) {
        winstonLogger.warn(await formatMessage(message));
    },
    verbose: async function (message) {
        winstonLogger.verbose(await formatMessage(message));
    },
    info: async function (message) {
        winstonLogger.info(await formatMessage(message));
    },
    debug: async function (message) {
        winstonLogger.debug(await formatMessage(message));
    },
    silly: async function (message) {
        winstonLogger.silly(await formatMessage(message));
    }
};

module.exports = logger;