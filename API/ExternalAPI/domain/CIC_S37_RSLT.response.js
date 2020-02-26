
const dateutil = require('../util/dateutil');

module.exports = function CIC_S37_RSLTResponse(cics37RSLTRequest, response, CICB1003, defaultValue, scrpStatCd) {

    const {
        responseTime,
        responseCode,
        responseMessage
    } = response;

    const {
        fiSessionKey,
        fiCode,
        taskCode,
        niceSessionKey,
        inquiryDate

    } = cics37RSLTRequest;

    const {
        cicNo,
        name,
        address,
        numberOfFi,
        cautionsLoanYn,
        badLoanYn,
        baseDate,
        warningGrage,
        reportComment
    } = CICB1003;

    const {
        reqStatus,
        inqDt1
    } = defaultValue

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.niceSessionKey = niceSessionKey;
    this.inquiryDate = inquiryDate ? inquiryDate : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.scrapingStatusCode = scrpStatCd;
    this.cicReportRequestDate = inqDt1;
    this.cicReportResponseDate = dateutil.getCurrentInquiryDate();
    this.cicReportInquiryUserId = reqStatus;
    this.name = name;
    this.cicIdReport = cicNo;
    this.address = address;
    this.numberOfFi = numberOfFi;
    this.cautiousLoan = cautionsLoanYn;
    this.badLoan = badLoanYn;
    this.baseDate = baseDate;
    this.warningGrade = warningGrage;
    this.reportComment = reportComment;
};

