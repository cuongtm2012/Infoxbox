
var internalCIC = require('./batch/internalB0003');
var internalCIC = new internalCIC();
var config = require('./config/config');

module.exports.start = function () {
    setTimeout(() => {
        internalCIC.cron((current, max) => {
            if (current == max) {
                // finish
                console.log("call internall batch B0003~~~");

                this.start();
            }
        });
    }, config.batch.TIME_OUT2);
}