const moment = require('moment');

const logger = {
    log: function (level, message) {
        console.log('[', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), ']', 'log: ', message);
    },
    error: function (message) {
        console.log("\x1b[31m", '[' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ']' + ' error: ', message);
    },
    warn: function (message) {
        console.log('[', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), ']', 'warn: ', message);
    },
    verbose: function (message) {
        console.log('[', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), ']', 'verbose: ', message);
    },
    info: function (message) {
        console.log('\x1b[36m%s\x1b[0m', '[' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ']' + ' info: ', message);
    },
    debug: function (message) {
        console.log('[', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), ']', 'debug: ', message);
    },
    silly: function (message) {
        console.log('[', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), ']', 'silly: ', message);
    }
};

module.exports = logger;
