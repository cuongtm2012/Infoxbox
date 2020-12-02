const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
const ipGateWay = require('../../shared/util/getIPGateWay');
module.exports = function dataZaloSaveToScrapLog(requestParams, niceSessionKey) {
    const {
        fiSeesionKey,
        fiCode,
        taskCode,
        mobilePhoneNumber,
        scoreProduct,
        inquiryPurpose,
        infoProvConcent
    } = requestParams;

    this.niceSessionKey = niceSessionKey;
    this.custSsId = fiSeesionKey ? fiSeesionKey : null;
    this.custCd = fiCode;
    this.gdsCD = responCode.NiceProductCode.ZALO.code;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.inqDt = dateutil.getCurrentInquiryDate();
    this.agrFG = infoProvConcent;
    this.sysDt = dateutil.timeStamp();
    this.workID = ipGateWay.getIPGateWay();

}
