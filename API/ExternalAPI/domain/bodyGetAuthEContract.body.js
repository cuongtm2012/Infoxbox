const config = require('../config/config');
module.exports = function bodyGetAuthEContract() {
    this.username = config.bodyGetAuthEContract.DEV_username;
    this.password = config.bodyGetAuthEContract.DEV_password;
    this.rememberMe = false;
    this.clientid = config.bodyGetAuthEContract.DEV_clientid;
    this.clientsecret = config.bodyGetAuthEContract.DEV_clientsecret;
}