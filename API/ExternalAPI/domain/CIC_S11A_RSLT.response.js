
const _ = require('lodash');

module.exports = function CIC_S11A_RSLTResponse(requestParams, response, outputScrpTranlog, outputCicrptMain, outputLoanDetailinfo, totalFiLoanVND, totalFiLoanUSD, cmtLoanDetaiInfo
    , creditCardTotalLimit, creditCardTotalBalance, creditCardTotalArrears, numberOfCreditCard, creditCardIssueCompany, cmtCreditCard
    , arrVamcLoanInfo, cmtVmacDisposalLoan
    , arrLoan12MInfo, cmtLoan12MInfo
    , arrNPL5YLoan, cmtNPL5YearLoan
    , arrLoan12MonCat, cmtLoan12MCat
    , gurAmountOfAssetBackedLoan, numberOfCollateral, numberOfFiWithCollateral
    , arrFinancialContract, cmtFinancialContract
    , arrCusLookup
    , borrowCreditCardArrear, creditCardLongestArrearDays, creditCardArrearCount, cmtCard3Year) {

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
        S_REQ_STATUS,
        SCRP_STAT_CD,
        INQ_DTIM_SCRPLOG,
        SYS_DTIM
    } = outputScrpTranlog;

    const {
        CIC_ID,
        INQ_CD,
        INQ_DTIM,
        INQ_OGZ_ADDR,
        INQ_OGZ_NM,
        INQ_USER_NM,
        NATL_ID,
        PSN_COMT,
        OTR_IDEN_EVD,
        PSN_ADDR,
        PSN_NM,
        RPT_SEND_DTIM
    } = outputCicrptMain;

    this.fiSessionKey = fiSessionKey;
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.niceSessionKey = niceSessionKey;
    this.inquiryDate = inquiryDate;
    this.responseTime = responseTime;
    this.responseCode = responseCode ? responseCode : '';
    this.responseMessage = responseMessage ? responseMessage : '';
    this.scrapingStatusCode = SCRP_STAT_CD ? SCRP_STAT_CD : '';
    this.cicReportRequestDate = INQ_DTIM_SCRPLOG;
    this.cicReportResponseDate = SYS_DTIM;
    this.commentOnCustomer = PSN_COMT;
    this.cicReportInquiryUserId = S_REQ_STATUS;
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
    if (_.isEmpty(cmtLoanDetaiInfo)) {
        this.loanDetailNode = outputLoanDetailinfo;
        this.totalFiLoanVND = totalFiLoanVND;
        this.totalFiLoanUSD = totalFiLoanUSD;
    }
    if (_.isEmpty(outputLoanDetailinfo))
        this.commentOnLoanDetail = cmtLoanDetaiInfo ? cmtLoanDetaiInfo : '';
    if (_.isEmpty(cmtCreditCard)) {
        this.creditCardTotalLimit = creditCardTotalLimit;
        this.creditCardTotalBalance = creditCardTotalBalance;
        this.creditCardTotalArrears = creditCardTotalArrears;
        this.numberOfCreditCard = numberOfCreditCard;
        this.creditCardIssueCompany = creditCardIssueCompany;
    }
    if (_.isEmpty(creditCardTotalLimit) && _.isEmpty(creditCardTotalBalance) && _.isEmpty(creditCardTotalArrears) && _.isEmpty(numberOfCreditCard) && _.isEmpty(creditCardIssueCompany))
        this.commentOnCreditCard = cmtCreditCard ? cmtCreditCard : '';
    if (_.isEmpty(cmtVmacDisposalLoan))
        this.disposalLoanNode = arrVamcLoanInfo ? arrVamcLoanInfo : '';
    if (_.isEmpty(arrVamcLoanInfo))
        this.commentOnVAMCDisposalLoan = cmtVmacDisposalLoan ? cmtVmacDisposalLoan : '';
    if (_.isEmpty(cmtLoan12MInfo))
        this.loanChangeNode = arrLoan12MInfo ? arrLoan12MInfo : '';
    if (_.isEmpty(arrLoan12MInfo))
        this.commentOnLoanChange12Month = cmtLoan12MInfo ? cmtLoan12MInfo : '';
    if (_.isEmpty(cmtNPL5YearLoan))
        this.nplNode = arrNPL5YLoan ? arrNPL5YLoan : '';
    if (_.isEmpty(arrNPL5YLoan))
        this.commentOnNPL5Years = cmtNPL5YearLoan ? cmtNPL5YearLoan : '';
    if (_.isEmpty(cmtCard3Year)) {
        this.borrowCreditCardArrear = borrowCreditCardArrear;
        this.creditCardLongestArrearDays = creditCardLongestArrearDays;
        this.creditCardArrearCount = creditCardArrearCount;
    }
    if (_.isEmpty(borrowCreditCardArrear) && _.isEmpty(creditCardLongestArrearDays) && _.isEmpty(creditCardArrearCount))
        this.commentOnCreditCard3Years = cmtCard3Year ? cmtCard3Year : '';
    if (_.isEmpty(cmtLoan12MCat))
        this.cautiousLoanNode = arrLoan12MonCat ? arrLoan12MonCat : '';
    if (_.isEmpty(arrLoan12MonCat))
        this.commentOnCautiousLoan12Month = cmtLoan12MCat ? cmtLoan12MCat : '';
    this.gurAmountOfAssetBackedLoan = gurAmountOfAssetBackedLoan;
    this.numberOfCollateral = numberOfCollateral;
    this.numberOfFiWithCollateral = numberOfFiWithCollateral;
    if (_.isEmpty(cmtFinancialContract))
        this.financialContractNode = arrFinancialContract ? arrFinancialContract : '';
    if (_.isEmpty(arrFinancialContract))
        this.commentOnFinancialContract = cmtFinancialContract ? cmtFinancialContract : '';
    this.customerInquiryNode = arrCusLookup ? arrCusLookup : '';

};

