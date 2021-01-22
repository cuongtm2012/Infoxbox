const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
const ipGateWay = require('../../shared/util/getIPGateWay');
module.exports = function dataFPTContractSaveToScrapLog(Request, niceSessionKey) {
    const {
        fiSessionKey,
        fiCode,
        taskCode,
        templateId,
        alias,
        syncType,
    } = Request;

    this.niceSessionKey = niceSessionKey;
    this.custSsId = fiSessionKey ? fiSessionKey : null;
    this.custCd = fiCode;
    this.gdsCD = responCode.NiceProductCode.FTN_SCD_RQST.code;
    this.inqDt = dateutil.getCurrentInquiryDate();
    this.sysDt = dateutil.timeStamp();
    this.workID = ipGateWay.getIPGateWay();
}