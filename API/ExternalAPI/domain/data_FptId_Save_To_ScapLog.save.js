const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
const ipGateWay = require('../../shared/util/getIPGateWay');
module.exports = function dataFptIdSaveToScrapLog(Request, niceSessionKey) {
    const {
        fiSessionKey,
        fiCode,
        taskCode,
        infoProvConcent
    } = Request;

    this.niceSessionKey = niceSessionKey;
    this.custSsId = fiSessionKey ? fiSessionKey : null;
    this.custCd = fiCode;
    this.gdsCD = responCode.NiceProductCode.KYC_F01_RQST.code;
    this.inqDt = dateutil.getCurrentInquiryDate();
    this.agrFG = infoProvConcent;
    this.sysDt = dateutil.timeStamp();
    this.workID = ipGateWay.getIPGateWay();
}
