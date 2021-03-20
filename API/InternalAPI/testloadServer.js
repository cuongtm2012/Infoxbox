
var testLoadServer = require('./batch/testLoadServer');
var testLoadServerJob = new testLoadServer();
var config = require('./config/config');
let times = 0;
const logger = require('./config/logger');
module.exports.start = function () {
    setTimeout(() => {
        testLoadServerJob.cron((current, max , request) => {
            if (current == max) { // prevent process is running in array
                times += request;
                logger.info({Count_Request_Production: times});
                // finish
                // console.log("call internall batch A0001~~~");

                this.start();
            }
        });
    }, 1000);
}