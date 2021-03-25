
var testLoadServer = require('./batch/testLoadServer');
var testLoadServerJob = new testLoadServer();
var config = require('./config/config');
let times = 0;

module.exports.start = function () {
    setTimeout(() => {
        testLoadServerJob.cron((current, max) => {
            if (current == max) { // prevent process is running in array
                times ++;
                console.log('Time of Load test Localhost__(13request/time)__: ', times);
                // finish
                // console.log("call internall batch A0001~~~");

                this.start();
            }
        });
    }, 1000);
}