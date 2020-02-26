
var cics37RSLTReq = require('./CIC_S37_RSLT.request');

module.exports = function CIC_S37_RSLTResponse(cics37RSLTRequest, response, outputScrpTranlog, outputS37Detail) {

    const {
        responseTime,
        responseCode,
        responseMessage
    } = response;

    const {
        R_ERRYN,
        S_DTIM,
        R_DTIM,
        S_REQ_STATUS,
        SCRP_STAT_CD,
        INQ_DTIM_SCRPLOG,
        SYS_DTIM
    } = outputScrpTranlog;

    const {
        fiSessionKey,
        fiCode,
        taskCode,
        niceSessionKey,
        inquiryDate

    } = cics37RSLTRequest;

    const {
        PSN_NM,
        CIC_ID,
        PSN_ADDR,
        RLTN_FI_CNT,
        CTS_LOAN_YN,
        BAD_LOAN_YN,
        BASE_DATE,
        EWS_GRD,
        RPT_CMT
    } = outputS37Detail;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.niceSessionKey = niceSessionKey;
    this.inquiryDate = inquiryDate ? inquiryDate : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.scrapingStatusCode = SCRP_STAT_CD;
    this.cicReportRequestDate = INQ_DTIM_SCRPLOG;
    this.cicReportResponseDate = SYS_DTIM.substring(0, 8);
    this.cicReportInquiryUserId = S_REQ_STATUS;
    this.name = PSN_NM;
    this.cicIdReport = CIC_ID;
    this.address = PSN_ADDR;
    this.numberOfFi = RLTN_FI_CNT;
    this.cautiousLoan = CTS_LOAN_YN;
    this.badLoan = BAD_LOAN_YN;
    this.baseDate = BASE_DATE;
    this.warningGrade = EWS_GRD;
    this.reportComment = RPT_CMT;
};

