module.exports = {
    convertBase64ToText: function (base64) {
        return Buffer.from(base64, 'base64').toString('ascii');
    }
}