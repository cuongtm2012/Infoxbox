
var cics37RSLTReq = require('./CIC_S37_RSLT.request');

module.exports = function CIC_S37_RSLTResponse(cics37RSLTRequest, response, dataRes) {

    const {
        responseTime,
        responseCode,
        responseMessage
    } = response;

    const {
        R_ERRYN,
        S_DTIM,
        R_DTIM,
        S_REQ_STATUS
    } = dataRes;

    const {
        fiSessionKey,
        fiCode,
        taskCode,
        niceSessionKey,
        inquiryDate

    } = cics37RSLTRequest;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.niceSessionKey = niceSessionKey;
    this.inquiryDate = inquiryDate ? inquiryDate : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.scrapingStatusCode = R_ERRYN ? R_ERRYN : "";
    this.cicReportRequestDate = S_DTIM ? S_DTIM : "";
    this.cicReportResponseDate = R_DTIM ? R_DTIM : "";
    this.cicReportInquiryUserId = S_REQ_STATUS ? S_REQ_STATUS : "";

};

