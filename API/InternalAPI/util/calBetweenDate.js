const moment = require('moment');

module.exports = {
    getMinute: function (start_date, end_date) {
        const _start_date = moment(start_date, 'YYYY-MM-DD HH:mm:ss');
        const _end_date = moment(end_date, 'YYYY-MM-DD HH:mm:ss');

        var duration = moment.duration(_end_date.diff(_start_date));

        return duration.asMinutes();
    }
}