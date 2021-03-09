const config = require('../config/config');
const dateutil = require('../util/dateutil');
module.exports = function bodyPostVmgCAC1(req) {
    const {
        appNumber,
        fiSessionKey,
        fiCode,
        taskCode,
        customerNumber,
        productCode,
        nfGrade,
        mobilePhoneNumber,
        homeAddress,
        workAddress,
        referAddress,
        joinDate,
        cicNiceSessionKey,
        inquiryDate,
        infoProvConcent
    } = req;

    this.cmd = "cac1_nice";
    this.phoneNumber = mobilePhoneNumber;
    this.workaddress = workAddress;
    this.homeaddress = homeAddress;
    this.referaddress = referAddress;
    this.customerCode = 'NICE';
    this.serviceCode = 'cac1_nice';
    this.token = config.VmgToken.Prod_Token;
}