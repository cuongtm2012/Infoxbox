const validation = require('./validation');

module.exports = {
    checkStatusCodeScraping: function (checkedObject, msg) {
        let result = false;
        if (msg === undefined || msg === null || msg === "")
            return result;
        for (var i in checkedObject) {
            if (msg.split(']')[0].split('[')[1] === checkedObject[i].code) {
                result = true;
            }
        }
        return result;
    },

    getStatusScrappingCode: function (msg1, msg2) {
        if (!validation.isEmptyStr(msg1))
            return msg1.split(']')[0].split('[')[1];
        else
            return msg2.split(']')[0].split('[')[1];
    },

    validPhoneNumber: function (phoneNum) {
        const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        if (phoneNum.match(regex)) {
            return true;
        } else {
            return false;
        }
    },

    convertPhoneNumber: function (phoneNum) {
        if (!validation.isEmptyStr(phoneNum) && phoneNum.substring(0, 3).includes('+84'))
            return '0' + phoneNum.substr(3);
        else
            return phoneNum;
    },

    replaceSpacialCharacter: function (string) {
        const regex = /[`~!@#$%^&*()_|\=?;:'",.<>br\{\}\[\]\\\/]/gi;
        if (!validation.isEmptyStr(string))
            return string.replace(regex, '');
        else
            return string;
    },

    getOracleCode: function (msg) {
        let _result = msg.toString();
        return '[' + _result.split(':')[1].split(':')[0].trim() + ']';
    },

    convertDateType: function (date) {
        if (!validation.isEmptyStr(date) && date.length == 8)
            return date.substring(4, 8) + date.substring(2, 4) + date.substring(0, 2);
        else
            return date;
    },

    validNumber: function (phoneNum) {
        const regex = /^\d+$/;

        if (phoneNum.match(regex)) {
            return true;
        } else {
            return false;
        }
    },

    validPhoneNumber2021: function (phoneNumber) {
        let pattern = /^0[35789]{1}[0-9]{7}[0-9]{1}$/;
        let reg = new RegExp(pattern);
        return reg.test(phoneNumber);
    }
}