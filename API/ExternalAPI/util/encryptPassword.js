const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = '3zTvzr3p67VC61jmV54rIYu1545x4TlY';

module.exports = {
    encrypt: function (text) {
        // var cipher = crypto.createCipher(algorithm, password)
        // var crypted = cipher.update(text, 'utf8', 'hex')
        // crypted += cipher.final('hex');
        // return crypted;
        return text;
    },
    decrypt: function (text) {
        var decipher = crypto.createDecipher(algorithm, password)
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }
};