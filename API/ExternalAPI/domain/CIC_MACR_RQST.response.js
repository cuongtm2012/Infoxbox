
module.exports = function CIC_MACR_RQSTResponse(cicMacrRQSTRequest, response) {

    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = response;

    const {
        fiSessionKey,
        fiCode,
        taskCode,
        name,
        mobilePhoneNumber,
        inquiryDate,
        infoProvConcent
    } = cicMacrRQSTRequest;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.name = name;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.inquiryDate = inquiryDate ? inquiryDate : "";
    this.infoProvConcent = infoProvConcent;
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
};