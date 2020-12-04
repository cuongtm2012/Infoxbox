const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
const ipGateWay = require('../../shared/util/getIPGateWay');
module.exports = function dataRiskScoreSaveToScrapLog(riskScoreRequest, niceSessionKey) {
    const {
        fiSessionKey,
        fiCode,
        taskCode,
        mobilePhoneNumber,
        natId,
        month,
        infoProvConcent
    } = riskScoreRequest;

    this.niceSessionKey = niceSessionKey;
    this.custSsId = fiSessionKey ? fiSessionKey : null;
    this.custCd = fiCode;
    this.gdsCD = responCode.NiceProductCode.ZALO.code;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.natId = natId;
    this.inqDt = dateutil.getCurrentInquiryDate();
    this.agrFG = infoProvConcent;
    this.sysDt = dateutil.timeStamp();
    this.workID = ipGateWay.getIPGateWay();
}
