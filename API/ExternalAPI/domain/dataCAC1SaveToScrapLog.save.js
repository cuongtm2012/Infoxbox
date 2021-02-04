const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
const ipGateWay = require('../../shared/util/getIPGateWay');
module.exports = function dataCAC1SaveToScrapLog(requestParams, niceSessionKey) {
    const {
        appNumber,
        fiCode,
        taskCode,
        customerNumber,
        mobilePhoneNumber,
        homeAddress,
        workAddress,
        referAddress,
        infoProvConcent
    } = requestParams;

    this.niceSessionKey = niceSessionKey;
    this.custSsId = appNumber ? appNumber : null;
    this.custCd = fiCode;
    this.gdsCD = responCode.NiceProductCode.KYC_VC1_RQST.code;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.inqDt = dateutil.getCurrentInquiryDate();
    this.agrFG = infoProvConcent;
    this.sysDt = dateutil.timeStamp();
    this.workID = ipGateWay.getIPGateWay();

}
