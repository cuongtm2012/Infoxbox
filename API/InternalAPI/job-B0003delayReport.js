
var internalCIC = require('./batch/inB0003delayReport');
var internalCICB0003Delay = new internalCIC();
var config = require('./config/config');

module.exports.start = function () {
    setTimeout(() => {
        internalCICB0003Delay.cron((current, max) => {
            if (current == max) { // prevent process is running in array
                // finish
                // console.log("call internall batch B0003 delay report~~~");

                this.start();
            }
        });
    }, config.batch.TIME_OUT1);
}