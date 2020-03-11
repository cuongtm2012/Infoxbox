const validation = require('./validation');

module.exports = {
    checkStatusCodeScraping: function (checkedObject, msg) {
        let result = false;

        for (var i in checkedObject) {
            if (msg.split(']')[0].split('[')[1] === checkedObject[i].code) {
                result = true;
            }
        }
        return result;
    },

    getStatusScrappingCode: function (msg) {
        return msg.split(']')[0].split('[')[1];
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
        const regex = /[`~!@#$%^&*()_|+\-=?;:'",.<>br\{\}\[\]\\\/]/gi;
        if (!validation.isEmptyStr(string))
            return string.replace(regex, '');
        else
            return string;
    }
}