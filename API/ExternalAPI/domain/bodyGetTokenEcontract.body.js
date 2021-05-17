const config = require('../config/config');
module.exports = function bodyGetAuthEContract(username, password) {
    this.username = username;
    this.password = password;
    this.rememberMe = false;
    this.clientid = config.bodyGetAuthEContract.DEV_clientid;
    this.clientsecret = config.bodyGetAuthEContract.DEV_clientsecret;
}