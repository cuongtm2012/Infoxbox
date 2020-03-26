var moment = require('moment-timezone');

module.exports = {

    formatDate: function () {
        let timeOutput = moment().tz("Asia/Bangkok").format();

            month = '' + (timeOutput[5]+timeOutput[6]),
            day = '' + (timeOutput[8]+timeOutput[9]),
            year = (timeOutput[0]+timeOutput[1]+timeOutput[2]+timeOutput[3]),
            hh = '' + (timeOutput[11]+timeOutput[12]),
            mm = '' + (timeOutput[14]+timeOutput[15]),
            ss = '' + (timeOutput[17]+timeOutput[18]);
        return year + month + day + hh + mm + ss;
    },

    formatDateForTable: function () {
        let timeOutput = moment().tz("Asia/Bangkok").format();

        month = '' + (timeOutput[5]+timeOutput[6]),
        year = (timeOutput[0]+timeOutput[1]+timeOutput[2]+timeOutput[3]);
        return year + month;
    },


    formatDateForCampaign: function (date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hh = '' + d.getHours(),
            mm = '' + d.getMinutes(),
            ss = '' + d.getSeconds();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hh.length < 2) hh = '0' + hh;
        if (mm.length < 2) mm = '0' + mm;
        if (ss.length < 2) ss = '0' + ss;
        return year + '-' + month + '-' + day + ' ' + hh + ':' + mm;
    }
};
