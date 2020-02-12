const validation = require('./validation');

module.exports = {
    convertBase64ToText: function (base64) {
        if (!validation.isEmptyStr(base64))
            return Buffer.from(base64, 'base64').toString('ascii');
    },
    convertTextToBase64: function (text) {
        if (!validation.isEmptyStr(text))
            return Buffer.from(text).toString('base64');
    }
}