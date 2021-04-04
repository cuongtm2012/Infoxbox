const winston = require('winston');
const config = require('./config');
const moment = require('moment');
const appRoot = require('app-root-path');
const getNamespace = require('continuation-local-storage').getNamespace;
const gracefulFs = require('graceful-fs');

const fs = require('file-system');
const fss = require('fs');
var folderLogs = appRoot + '/logs';
var folderName_External = folderLogs + '/' + moment(new Date()).format('YYYYMM');
var folderName_normal = folderName_External + '/normal';
var folderName_error = folderName_External + '/error';
var logfile_error = folderName_error + '/' + moment(new Date()).format('YYYY-MM-DD') + '.log';
var logfile_normal = folderName_normal + '/' + moment(new Date()).format('YYYY-MM-DD') + '.log';
var todayLogFile = '';

gracefulFs.gracefulify(fs);
gracefulFs.gracefulify(fss);

async function ensureDirSync(dirpath) {
    try {

        if (fss.existsSync(dirpath)){
            return console.log('dir is exist');
        } else {
            return fs.mkdirSync(dirpath)
        }
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

async function ensureFileSync(filePath) {
    try {
        if (fss.existsSync(filePath)) {
            return console.log('file is exist');
        } else {
            return fs.writeFileSync(filePath, '');
        }
    } catch (err) {
       console.log(err.toString());
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
    if (todayLogFile !== logfile_normal) {
        console.log('created new logFile: ' +  moment(new Date()).format('YYYYMMDD'));
        todayLogFile = logfile_normal;
        await ensureDirSync(folderLogs);
        await ensureDirSync(folderName_External);
        await ensureDirSync(folderName_error);
        await ensureDirSync(folderName_normal);
        await ensureFileSync(logfile_error);
        await ensureFileSync(logfile_normal);
    }
    var myRequest = getNamespace('my request');
    message = myRequest && myRequest.get('reqId') ? JSON.stringify(message) + " reqId: " + myRequest.get('reqId') : message;
    return message;
};
function refreshDirNameAndFileName() {
    folderName_External = folderLogs + '/' + moment(new Date()).format('YYYYMM');
    folderName_normal = folderName_External + '/normal';
    folderName_error = folderName_External + '/error';
    logfile_error = folderName_error + '/' + moment(new Date()).format('YYYY-MM-DD') + '.log';
    logfile_normal = folderName_normal + '/' + moment(new Date()).format('YYYY-MM-DD') + '.log';

    winstonLoggerError = new winston.Logger({
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

    winstonLogger = new winston.Logger({
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
}
var logger = {
    log: async function (level, message) {
        refreshDirNameAndFileName();
        winstonLogger.log(level, await formatMessage(message));
    },
    error: async function (message) {
        refreshDirNameAndFileName();
        winstonLoggerError.error(await formatMessage(message));
    },
    warn: async function (message) {
        refreshDirNameAndFileName()
        winstonLogger.warn(await formatMessage(message));
    },
    verbose: async function (message) {
        refreshDirNameAndFileName();
        winstonLogger.verbose(await formatMessage(message));
    },
    info: async function (message) {
        refreshDirNameAndFileName();
        winstonLogger.info(await formatMessage(message));
    },
    debug: async function (message) {
        refreshDirNameAndFileName();
        winstonLogger.debug(await formatMessage(message));
    },
    silly: async function (message) {
        refreshDirNameAndFileName();
        winstonLogger.silly(await formatMessage(message));
    }
};

module.exports = logger;
