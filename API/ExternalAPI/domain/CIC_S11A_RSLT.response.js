

module.exports = function CIC_S11A_RSLTResponse(response, outputScrpTranlog, outputCicrptMain, outputLoanDetailinfo, totalFiLoanVND, totalFiLoanUSD, cmtLoanDetaiInfo
    , creditCardTotalLimit, creditCardTotalBalance, creditCardTotalArrears, numberOfCreditCard, creditCardIssueCompany, cmtCreditCard) {

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

    this.responseTime = responseTime ? responseTime : '';
    this.responseCode = responseCode ? responseCode : '';
    this.responseMessage = responseMessage ? responseMessage : '';
    this.scrapingStatusCode = R_ERRYN ? R_ERRYN : '';
    this.cicReportRequestDate = S_DTIM ? S_DTIM : '';
    this.cicReportResponseDate = R_DTIM ? R_DTIM : '';
    this.cicReportInquiryUserId = S_REQ_STATUS ? S_REQ_STATUS : '';
    this.cicInquiryFiName = INQ_OGZ_NM ? INQ_OGZ_NM : '';
    this.cicInquiryFiAddress = INQ_OGZ_ADDR ? INQ_OGZ_ADDR : '';
    this.cicUserName = INQ_USER_NM ? INQ_USER_NM : '';
    this.cicInquiryCode = INQ_CD ? INQ_CD : '';
    this.cicReportInquiryDateTime = INQ_DTIM ? INQ_DTIM : '';
    this.cicReportResultDateTime = RPT_SEND_DTIM ? RPT_SEND_DTIM : '';
    this.name = PSN_NM ? PSN_NM : '';
    this.cicId = CIC_ID ? CIC_ID : '';
    this.address = PSN_ADDR ? PSN_ADDR : '';
    this.nationalId = NATL_ID ? NATL_ID : '';
    this.docIdEvidance = OTR_IDEN_EVD ? OTR_IDEN_EVD : '';
    this.loanDetailNode = outputLoanDetailinfo;
    this.totalFiLoanVND = totalFiLoanVND ? totalFiLoanVND : '';
    this.totalFiLoanUSD = totalFiLoanUSD ? totalFiLoanUSD : '';
    this.cmtLoanDetaiInfo = cmtLoanDetaiInfo ? cmtLoanDetaiInfo : '';
    this.creditCardTotalLimit = creditCardTotalLimit ? creditCardTotalLimit : '';
    this.creditCardTotalBalance = creditCardTotalBalance ? creditCardTotalBalance : '';
    this.creditCardTotalArrears = creditCardTotalArrears ? creditCardTotalArrears : '';
    this.numberOfCreditCard = numberOfCreditCard ? numberOfCreditCard : '';
    this.creditCardIssueCompany = creditCardIssueCompany ? creditCardIssueCompany : '';
    this.cmtCreditCard = cmtCreditCard ? cmtCreditCard : '';

};

