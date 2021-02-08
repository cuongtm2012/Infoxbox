const config = require('../config/config');
module.exports = function bodyPostVmgKYC2(phoneNumber) {
    this.cmd = 'checkwhitelist_nice';
    this.phoneNumber = phoneNumber;
    this.customerCode = "NICE";
    this.serviceCode = 'checkwhitelist_nice';
    this.token = config.VmgToken.Dev_Token;
}
