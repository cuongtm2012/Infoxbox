
var internalCIC = require('./batch/internalA0001');
var internalCICA0001 = new internalCIC();
var config = require('./config/config');

module.exports.start = function () {
    setTimeout(() => {
        internalCICA0001.cron((current, max) => {
            if (current == max) { // prevent process is running in array
                // finish
                // console.log("call internall batch A0001~~~");

                this.start();
            }
        });
    }, config.batch.TIME_OUT3);
}