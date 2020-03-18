
var internalCIC = require('./batch/inB0003delayReport2');
var internalCICB0003Delay2 = new internalCIC();
var config = require('./config/config');

module.exports.start = function () {
    setTimeout(() => {
        internalCICB0003Delay2.cron((current, max) => {
            if (current == max) { // prevent process is running in array
                // finish
                console.log("call internall batch B0003 delay report 2~~~");

                this.start();
            }
        });
    }, config.batch.TIME_OUT_DELAY);
}