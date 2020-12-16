const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
module.exports = function dataSaveToInqLog(fptRq, preResponse) {
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = preResponse;

    const {
        fiSessionKey,
        fiCode,
        taskCode,
        idType,
        natId,
        taxCode,
        oldNatId,
        otrId,
        passportNumber,
        cicId,
        month,
        infoProvConcent
    } = fptRq;

    this.niceSessionKey = niceSessionKey;
    this.inqLogId = responCode.NiceProductCode.ZALO.code + dateutil.timeStamp2();
    this.fiCode = fiCode ? fiCode : null;
    this.taskCode = taskCode ? taskCode : null;
    this.natId =  natId ? natId : null;
    this.taxCode =  taxCode ? taxCode : null;
    this.oldNatId =  oldNatId ? oldNatId : null;
    this.otrId = otrId ? otrId : null;
    this.passportNumber = passportNumber ? passportNumber : null;
    this.cicId = cicId ? cicId : null;
    this.month = month ? month : null;
    this.inquiryDate = dateutil.getCurrentInquiryDate();
    this.infoProvConcent = infoProvConcent ? infoProvConcent : null;
    this.respCd = responseCode ? responseCode : null;
    this.mobilePhoneNumber = null;
}
