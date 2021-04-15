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

var winstonLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.splat(),
        // Định dạng time cho log
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        // thêm màu sắc
        winston.format.colorize(),
        // thiết lập định dạng của log
        winston.format.printf(
            log => {
                // nếu log là error hiển thị stack trace còn không hiển thị message của log
                if(log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
                return  `[${log.timestamp}] [${log.level}] ${log.message}`;
            },
        ),
    ),
    transports: [
        new winston.transports.File({
            filename: logfile_normal,
            handleExceptions: true,
            json: true,
            maxsize: 10483960, // 10MB
            maxFiles: 10,
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

var winstonLoggerError = new winston.createLogger({
    format: winston.format.combine(
        winston.format.splat(),
        // Định dạng time cho log
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        // thêm màu sắc
        winston.format.colorize(),
        // thiết lập định dạng của log
        winston.format.printf(
            log => {
                // nếu log là error hiển thị stack trace còn không hiển thị message của log
                if(log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
                return  `[${log.timestamp}] [${log.level}] ${log.message}`;
            },
        ),
    ),
    transports: [
        new winston.transports.File({
            filename: logfile_error,
            handleExceptions: true,
            json: true,
            maxsize: 10483960, // 10MB
            maxFiles: 10,
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

    winstonLogger = winston.createLogger({
        format: winston.format.combine(
            winston.format.splat(),
            // Định dạng time cho log
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            // thêm màu sắc
            winston.format.colorize(),
            // thiết lập định dạng của log
            winston.format.printf(
                log => {
                    // nếu log là error hiển thị stack trace còn không hiển thị message của log
                    if(log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
                    return  `[${log.timestamp}] [${log.level}] ${log.message}`;
                },
            ),
        ),
        transports: [
            new winston.transports.File({
                filename: logfile_normal,
                handleExceptions: true,
                json: true,
                maxsize: 10483960, // 10MB
                maxFiles: 10,
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

    winstonLogger = winston.createLogger({
        format: winston.format.combine(
            winston.format.splat(),
            // Định dạng time cho log
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            // thêm màu sắc
            winston.format.colorize(),
            // thiết lập định dạng của log
            winston.format.printf(
                log => {
                    // nếu log là error hiển thị stack trace còn không hiển thị message của log
                    if(log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
                    return  `[${log.timestamp}] [${log.level}] ${log.message}`;
                },
            ),
        ),
        transports: [
            new winston.transports.File({
                filename: logfile_normal,
                handleExceptions: true,
                json: true,
                maxsize: 10483960, // 10MB
                maxFiles: 10,
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
        console.log('[',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),']','log: ', message);
    },
    error: async function (message) {
        console.log("\x1b[31m", '[' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ']' + ' error: ', message);
    },
    warn: async function (message) {
        console.log('[',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),']','warn: ', message);
    },
    verbose: async function (message) {
        console.log('[',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),']','verbose: ', message);
    },
    info: async function (message) {
        console.log('\x1b[36m%s\x1b[0m','[' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ']' + ' info: ', message);
    },
    debug: async function (message) {
        console.log('[',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),']','debug: ', message);
    },
    silly: async function (message) {
        console.log('[',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),']','silly: ', message);
    }
};

module.exports = logger;
