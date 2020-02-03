module.exports = {
    isEmptyJson: function (obj) {
        return !Object.keys(obj).length > 0;
    },
    isEmptyStr: function (str) {
        return (!str || 0 === str.length || str === undefined || str === null);
    },
    setEmptyValue: function (params) {
        if (0 === params || '0' === params)
            return 0;
        else
            return null;
    },
    formatDateVN: function (date) {
        if (date === null)
            return '';
        else if (8 < date.length && date.indexOf('/') < 0)
            return date.substring(8, 10) + ':' + date.substr(10) + ' - ' + date.substring(6, 8) + '/' + date.substring(4, 6) + '/' + date.substr(0, 4);
        else if (6 < date.length && date.indexOf('/') < 0)
            return date.substr(6) + '/' + date.substring(4, 6) + '/' + date.substr(0, 4);
        else if (date != null && date.length <= 6 && date.indexOf('/') < 0)
            return date.substr(4) + '/' + date.substr(0, 4);
        else
            return date;
    }
};