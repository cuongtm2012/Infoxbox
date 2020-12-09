const dateFormat = require('dateformat');
const _ = require('lodash');

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
        var timeStamp = dateFormat(new Date(), "yyyymmddHHMMss");

        return timeStamp;
    },

    getTimeHours: function () {
        return dateFormat(new Date(), "HH:MM:ss");
    },

    timeStamp2: function () {
        var timeStamp = dateFormat(new Date(), "yyyymmddHHMMl");

        return timeStamp;
    },

    getSeconds: function (start) {
        return ((new Date() - start) % 60000 / 1000).toFixed(2) + "s";
    },

    getCurrentInquiryDate: function () {
        return dateFormat(new Date(), 'yyyymmdd');
    },

    validDateAndCurrentDate: function (startDate, endDate) {
        if (!_.isEmpty(startDate) && _.isEmpty(endDate))
            return parseFloat(startDate.substring(0, 8)) <= parseFloat(this.getCurrentInquiryDate());
        else if (!(_.isEmpty(startDate) && _.isEmpty(endDate)))
            return parseFloat(startDate.substring(0, 8)) <= parseFloat(endDate.substring(0, 8));
        else
            return true;
    },

    validFromDateEarlier93Days: function (searchDateFrom) {
        let today = new Date(this.getCurrentInquiryDate().substring(0, 4), this.getCurrentInquiryDate().substring(5, 6), this.getCurrentInquiryDate().substring(6, 8));
        let _searchDateFrom = new Date(searchDateFrom.substring(0, 4), searchDateFrom.substring(5, 6), searchDateFrom.substring(6, 8));

        return Math.round((today - _searchDateFrom) / (1000 * 60 * 60 * 24)) < 93;
    },

    getTimeHoursNoDot: function () {
        return dateFormat(new Date(), "HHMMss");
    },

};
