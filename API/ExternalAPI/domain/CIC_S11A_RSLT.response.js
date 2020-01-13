
var cics11aRSLTReq = require('./CIC_S11A_RSLT.request');

module.exports = function CIC_S11A_RSLTResponse(cics11aRSLTRequest, response, outputScrpTranlog, outputCicrptMain) {

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
    } = outputScrpTranlog;

    const {
        CIC_ID,
        INQ_CD,
        INQ_DTIM,
        INQ_OGZ_ADDR,
        INQ_OGZ_NM,
        INQ_USER_NM,
        NATL_ID,
        OTR_IDEN_EVD,
        PSN_ADDR,
        PSN_NM,
        RPT_SEND_DTIM
    } = outputCicrptMain;

    this.requestData = new cics11aRSLTReq(cics11aRSLTRequest);
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.scrapingStatusCode = R_ERRYN ? R_ERRYN : "";
    this.cicReportRequestDate = S_DTIM ? S_DTIM : "";
    this.cicReportResponseDate = R_DTIM ? R_DTIM : "";
    this.cicReportInquiryUserId = S_REQ_STATUS ? S_REQ_STATUS : "";
    this.cicInquiryFiName = INQ_OGZ_NM;
    this.cicInquiryFiAddress = INQ_OGZ_ADDR;
    this.cicUserName = INQ_USER_NM;
    this.cicInquiryCode = INQ_CD;
    this.cicReportInquiryDateTime = INQ_DTIM;
    this.cicReportResultDateTime = RPT_SEND_DTIM;
    this.name = PSN_NM;
    this.cicId = CIC_ID;
    this.address = PSN_ADDR;
    this.nationalId = NATL_ID;
    this.docIdEvidance = OTR_IDEN_EVD;

};

