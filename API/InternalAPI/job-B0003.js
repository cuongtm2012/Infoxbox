
var internalCIC = require('./batch/internalB0003');
var internalCICB0003 = new internalCIC();
var config = require('./config/config');

module.exports.start = function () {
    setTimeout(() => {
        internalCICB0003.cron((current, max) => {
            if (current == max) { // prevent process is running in array
                // finish
                console.log("call internall batch B0003~~~");

                this.start();
            }
        });
    }, config.batch.TIME_OUT1);
}