const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
const ipGateWay = require('../../shared/util/getIPGateWay');
module.exports = function dataNFScoreOKSaveToScrapLog(Request, niceSessionKey) {
    const {
        appNumber,
        fiCode,
        taskCode,
        customerNumber,
        scoreProduct,
        mobilePhoneNumber,
        natId,
        infoProvConcent
    } = Request;

    this.niceSessionKey = niceSessionKey;
    this.custSsId = appNumber ? appNumber : null;
    this.custCd = fiCode;
    this.gdsCD = responCode.NiceProductCode.OKF_SCO_RQST.code;
    this.natId = natId;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.inqDt = dateutil.getCurrentInquiryDate();
    this.agrFG = infoProvConcent;
    this.sysDt = dateutil.timeStamp();
    this.workID = ipGateWay.getIPGateWay();
}