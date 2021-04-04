const dateFormat = require('dateformat');

module.exports = {
    formatDate: function (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return year + month + day;
    },

    timeStamp: function () {
        return dateFormat(new Date(), "yyyymmddHHMMss");
    },
    getTimeHours: function () {
        return dateFormat(new Date(), "HH:MM:ss");
    },

    getDate: function () {
        return dateFormat(new Date(), "yyyymmdd");
    },

    getSeconds: function (start) {
        return ((new Date() - start) % 60000 / 1000).toFixed(2) + "s";
    }
};