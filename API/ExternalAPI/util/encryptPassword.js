// const crypto = require('crypto'),
//     algorithm = 'aes-256-ctr',
//     password = '3zTvzr3p67VC61jmV54rIYu1545x4TlY';

import crypto from 'crypto';
const algorithm = 'aes-256-ctr';
const password = '3zTvzr3p67VC61jmV54rIYu1545x4TlY';

function encrypt(text) {
    // var cipher = crypto.createCipher(algorithm, password)
    // var crypted = cipher.update(text, 'utf8', 'hex')
    // crypted += cipher.final('hex');
    // return crypted;
    return text;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}


export { encrypt, decrypt };