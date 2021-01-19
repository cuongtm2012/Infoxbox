const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
const ipGateWay = require('../../shared/util/getIPGateWay');
module.exports = function dataFptIdAndFaceMatchingSaveToScrapLog(Request, niceSessionKey) {
    const {
        appNumber,
        fiCode,
        taskCode,
        infoProvConcent
    } = Request;

    this.niceSessionKey = niceSessionKey;
    this.custSsId = appNumber ? appNumber : null;
    this.custCd = fiCode;
    this.gdsCD = responCode.NiceProductCode.KYC_FI1_RQST.code;
    this.inqDt = dateutil.getCurrentInquiryDate();
    this.agrFG = infoProvConcent;
    this.sysDt = dateutil.timeStamp();
    this.workID = ipGateWay.getIPGateWay();
}