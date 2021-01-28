const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
const ipGateWay = require('../../shared/util/getIPGateWay');
module.exports = function dataMainScoreSaveToScrapLog(Request, niceSessionKey) {
    const {
        appNumber,
        fiCode,
        taskCode,
        customerNumber,
        productCode,
        nfGrade,
        natId,
        cicNiceSessionKey,
        mobilePhoneNumber,
        homeAddress,
        workAddress,
        referAddress,
        infoProvConcent
    } = Request;

    this.niceSessionKey = niceSessionKey;
    this.custSsId = appNumber ? appNumber : null;
    this.custCd = fiCode;
    this.natId = natId;
    this.gdsCD = responCode.NiceProductCode.RCS_M01_RQST.code;
    this.inqDt = dateutil.getCurrentInquiryDate();
    this.agrFG = infoProvConcent;
    this.sysDt = dateutil.timeStamp();
    this.workID = ipGateWay.getIPGateWay();
}