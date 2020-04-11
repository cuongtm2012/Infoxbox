
var internalCIC = require('./batch/internalB0002');
var internalCICB0002 = new internalCIC();
var config = require('./config/config');

module.exports.start = function () {
    setTimeout(() => {
        internalCICB0002.cron((current, max) => {
            if (current == max) { // prevent process is running in array
                // finish
                // console.log("call internall batch B0002~~~");

                this.start();
            }
        });
    }, config.batch.TIME_OUT);
}