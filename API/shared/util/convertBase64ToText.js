module.exports = {
    convertBase64ToText: function (base64) {
        return Buffer.from(base64, 'base64').toString('ascii');
    },
    convertTextToBase64: function (text) {
        return Buffer.from(text).toString('base64');
    }
}