import dateFormat from 'dateformat';
import * as _ from 'lodash';

const DateUtil = {
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
        var yearFrom = searchDateFrom.substring(0, 4);
        var monthFrom = searchDateFrom.substring(4, 6);
        var dayFrom = searchDateFrom.substring(6, 8);
        var dateFrom = new Date(yearFrom, monthFrom - 1, dayFrom);
        let today = new Date();
        let DifferenceInTime = today.getTime() - dateFrom.getTime();
        let DifferenceInDays = this.convertMiliseconds(DifferenceInTime, 'd');
        return DifferenceInDays < 93;

    },

    getTimeHoursNoDot: function () {
        return dateFormat(new Date(), "HHMMss");
    },

    getCurrentMonth: function () {
        return dateFormat(new Date(), 'yyyymm');
    },

    convertMiliseconds: function (miliseconds, format) {
        var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;

        total_seconds = parseInt(Math.floor(miliseconds / 1000));
        total_minutes = parseInt(Math.floor(total_seconds / 60));
        total_hours = parseInt(Math.floor(total_minutes / 60));
        days = parseInt(Math.floor(total_hours / 24));

        seconds = parseInt(total_seconds % 60);
        minutes = parseInt(total_minutes % 60);
        hours = parseInt(total_hours % 24);

        switch (format) {
            case 's':
                return total_seconds;
            case 'm':
                return total_minutes;
            case 'h':
                return total_hours;
            case 'd':
                return days;
            default:
                return {d: days, h: hours, m: minutes, s: seconds};
        }
    }

};

export default DateUtil;