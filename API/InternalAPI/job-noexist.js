
var internalCIC = require('./batch/internalNoexist');
var internalCICNoExist = new internalCIC();
var config = require('./config/config');

module.exports.start = function () {
    setTimeout(() => {
        internalCICNoExist.cron((current, max) => {
            if (current == max) {
                // finish
                console.log("call internall batch noexist~~~");

                this.start();
            }
        });
    }, config.batch.TIME_OUT2);
}