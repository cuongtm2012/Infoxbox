const config = require('../config/config');
module.exports = function bodyGetAuthEContract() {
    this.username = config.bodyGetAuthEContract.PROD_username;
    this.password = config.bodyGetAuthEContract.PROD_password;
    this.rememberMe = false;
    this.clientid = config.bodyGetAuthEContract.PROD_clientid;
    this.clientsecret = config.bodyGetAuthEContract.PROD_clientsecret;
}