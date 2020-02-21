
var internalCIC = require('./batch/internalB1003');
var internalCICB1003 = new internalCIC();
var config = require('./config/config');

module.exports.start = function () {
    setTimeout(() => {
        internalCICB1003.cron((current, max) => {
            if (current == max) { // prevent process is running in array
                // finish
                console.log("call internall batch B1003~~~");

                this.start();
            }
        });
    }, config.batch.TIME_OUT3);
}