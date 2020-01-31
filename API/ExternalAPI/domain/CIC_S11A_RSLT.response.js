
const _ = require('lodash');

module.exports = function CIC_S11A_RSLTResponse(requestParams, response, outputScrpTranlog, outputCicrptMain, outputLoanDetailinfo, totalFiLoanVND, totalFiLoanUSD, cmtLoanDetaiInfo
    , creditCardTotalLimit, creditCardTotalBalance, creditCardTotalArrears, numberOfCreditCard, creditCardIssueCompany, cmtCreditCard
    , arrVamcLoanInfo, cmtVmacDisposalLoan
    , arrLoan12MInfo, cmtLoan12MInfo
    , arrNPL5YLoan, cmtNPL5YearLoan
    , arrLoan12MonCat, cmtLoan12MCat
    , gurAmountOfAssetBackedLoan, numberOfCollateral, numberOfFiWithCollateral
    , arrFinancialContract, cmtFinancialContract
    , arrCusLookup) {

    const {
        fiSessionKey,
        fiCode,
        taskCode,
        niceSessionKey,
        inquiryDate
    } = requestParams;

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

    this.fiSessionKey = fiSessionKey ? fiSessionKey : '';
    this.fiCode = fiCode ? fiCode : '';
    this.taskCode = taskCode ? taskCode : '';
    this.niceSessionKey = niceSessionKey ? niceSessionKey : '';
    this.inquiryDate = inquiryDate ? inquiryDate : '';
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
    if (_.isEmpty(cmtLoanDetaiInfo)) {
        this.loanDetailNode = outputLoanDetailinfo;
        this.totalFiLoanVND = totalFiLoanVND ? totalFiLoanVND : '';
        this.totalFiLoanUSD = totalFiLoanUSD ? totalFiLoanUSD : '';
    }
    if (_.isEmpty(outputLoanDetailinfo))
        this.cmtLoanDetaiInfo = cmtLoanDetaiInfo ? cmtLoanDetaiInfo : '';
    if (_.isEmpty(cmtCreditCard)) {
        this.creditCardTotalLimit = creditCardTotalLimit ? creditCardTotalLimit : '';
        this.creditCardTotalBalance = creditCardTotalBalance ? creditCardTotalBalance : '';
        this.creditCardTotalArrears = creditCardTotalArrears ? creditCardTotalArrears : '';
        this.numberOfCreditCard = numberOfCreditCard ? numberOfCreditCard : '';
        this.creditCardIssueCompany = creditCardIssueCompany ? creditCardIssueCompany : '';
    }
    if (_.isEmpty(creditCardTotalLimit) && _.isEmpty(creditCardTotalBalance) && _.isEmpty(creditCardTotalArrears) && _.isEmpty(numberOfCreditCard) && _.isEmpty(creditCardIssueCompany))
        this.cmtCreditCard = cmtCreditCard ? cmtCreditCard : '';
    if (_.isEmpty(cmtVmacDisposalLoan))
        this.disposalLoanNode = arrVamcLoanInfo ? arrVamcLoanInfo : '';
    if (_.isEmpty(arrVamcLoanInfo))
        this.cmtVmacDisposalLoan = cmtVmacDisposalLoan ? cmtVmacDisposalLoan : '';
    if (_.isEmpty(cmtLoanDetaiInfo))
        this.loanChangeNode = arrLoan12MInfo ? arrLoan12MInfo : '';
    if (_.isEmpty(arrLoan12MInfo))
        this.cmtLoan12MInfo = cmtLoan12MInfo ? cmtLoan12MInfo : '';
    if (_.isEmpty(cmtNPL5YearLoan))
        this.nplNode = arrNPL5YLoan ? arrNPL5YLoan : '';
    if (_.isEmpty(arrNPL5YLoan))
        this.cmtNPL5YearLoan = cmtNPL5YearLoan ? cmtNPL5YearLoan : '';
    if (_.isEmpty(cmtLoan12MCat))
        this.cautiousLoanNode = arrLoan12MonCat ? arrLoan12MonCat : '';
    if (_.isEmpty(arrLoan12MonCat))
        this.cmtLoan12MpnthCat = cmtLoan12MCat ? cmtLoan12MCat : '';
    this.gurAmountOfAssetBackedLoan = gurAmountOfAssetBackedLoan ? gurAmountOfAssetBackedLoan : '';
    this.numberOfCollateral = numberOfCollateral ? numberOfCollateral : '';
    this.numberOfFiWithCollateral = numberOfFiWithCollateral ? numberOfFiWithCollateral : '';
    if (_.isEmpty(cmtFinancialContract))
        this.financialContractNode = arrFinancialContract ? arrFinancialContract : '';
    if (_.isEmpty(arrFinancialContract))
        this.cmtFinancialContract = cmtFinancialContract ? cmtFinancialContract : '';
    this.customerInquiryNode = arrCusLookup ? arrCusLookup : '';
};

