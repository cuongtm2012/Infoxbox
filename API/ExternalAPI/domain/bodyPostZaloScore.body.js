const crypto = require( "crypto" );
const config = require('../config/config')
const initializationVector = Array.apply(null, Array(16)).map(Number.prototype.valueOf,0);
const encryptionKey = config.ZaloAesKey.DEV

module.exports = function bodyZaloPost(token, phoneNumber) {
    let phoneNumberUtf8 =  Buffer.from(phoneNumber, 'utf-8');
    let phoneNumberAes = encodePhoneNumberAES_CBC_PKCS5PADDING(phoneNumberUtf8);
    let uidUrlEncode = encodeURIComponent(phoneNumberAes);


    this.auth_token = token;
    this.uid_type = 'PHONE';
    this.uid = uidUrlEncode;
    this.score_type = 'CREDIT';
    this.score_version = 2;

    function encodePhoneNumberAES_CBC_PKCS5PADDING(phoneNumber) {
        let binaryEncryptionKey = Buffer.from(encryptionKey, "base64");
        let binaryIV = Buffer.from(initializationVector, "base64");
        let cipher = crypto.createCipheriv("AES-128-CBC", binaryEncryptionKey, binaryIV);
        return (
            cipher.update(phoneNumber, "utf8", "base64") +
            cipher.final("base64")
        );
    }
}