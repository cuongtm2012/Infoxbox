
const config = require('../config/config');

const sendDb = require('../job/send');
const sendDb = new sendDb();

module.exports.start = function(pool) {
    setTimeout(() => {
        sendDb.cron(pool, (current, max) => {
            if (current == max) {
                console.log("in job");
                
                this.start(pool);
            }
        });
    }, config.batch.TIME_OUT);
}