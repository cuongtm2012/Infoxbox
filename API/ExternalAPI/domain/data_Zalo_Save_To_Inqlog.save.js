const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
module.exports = function dataZaloSaveToInqlog(requestParams, preResponse) {
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = preResponse;

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
    this.inqLogId = responCode.NiceProductCode.ZALO.code + dateutil.timeStamp2();
    this.fiCode = fiCode ? fiCode : null;
    this.taskCode = taskCode ? taskCode : null;
    this.natId =  null;
    this.taxCode =  null;
    this.oldNatId =  null;
    this.otrId = null;
    this.passportNumber = null;
    this.cicId = null;
    this.inquiryDate = dateutil.getCurrentInquiryDate();
    this.infoProvConcent = infoProvConcent ? infoProvConcent : null;
    this.respCd = responseCode ? responseCode : null;
    this.mobilePhoneNumber = mobilePhoneNumber ? mobilePhoneNumber : null;
}
