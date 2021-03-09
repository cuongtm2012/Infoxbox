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

    this.cmd = config.Vmg_CAC_1.DEV_cmd;
    this.phoneNumber = mobilePhoneNumber;
    this.workaddress = workAddress;
    this.homeaddress = homeAddress;
    this.referaddress = referAddress;
    this.customerCode = config.Vmg_CAC_1.DEV_customerCode;
    this.serviceCode = config.Vmg_CAC_1.DEV_serviceCode;
    this.token = config.VmgToken.Dev_Token;
}