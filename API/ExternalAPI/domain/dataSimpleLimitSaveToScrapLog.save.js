const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
const ipGateWay = require('../../shared/util/getIPGateWay');
module.exports = function dataSimpleLimitSaveToScrapLog(Request, niceSessionKey) {
    const {
        fiSessionKey,
        fiCode,
        taskCode,
        customerNumber,
        name,
        sex,
        mobilePhoneNumber,
        natId,
        salary,
        joinYearMonth,
        infoProvConcent
    } = Request;

    this.niceSessionKey = niceSessionKey;
    this.custSsId = fiSessionKey ? fiSessionKey : null;
    this.custCd = fiCode;
    this.gdsCD = responCode.NiceProductCode.OKF_SPL_RQST.code;
    this.natId = natId;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.inqDt = dateutil.getCurrentInquiryDate();
    this.agrFG = infoProvConcent;
    this.sysDt = dateutil.timeStamp();
    this.workID = ipGateWay.getIPGateWay();
}