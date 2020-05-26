
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
        RPT_SEND_DTIM,
        LOAN_CMT
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
    this.cicReportResponseDate = SYS_DTIM.substring(0, 8);
    this.cicReportInquiryUserId = S_REQ_STATUS;
    this.cicInquiryFiName = INQ_OGZ_NM;
    this.cicInquiryFiAddress = INQ_OGZ_ADDR;
    this.cicUserName = INQ_USER_NM;
    this.cicInquiryCode = INQ_CD;
    this.cicReportInquiryDateTime = INQ_DTIM;
    this.cicReportResultDateTime = RPT_SEND_DTIM;
    this.commentOnCustomer = PSN_COMT;
    this.name = PSN_NM;
    this.cicId = CIC_ID;
    this.address = PSN_ADDR;
    this.nationalId = NATL_ID;
    this.docIdEvidance = OTR_IDEN_EVD;
    this.commentOnLoanInfo = LOAN_CMT;
    if (_.isEmpty(cmtLoanDetaiInfo)) {
        this.loanDetailNode = outputLoanDetailinfo;
        this.totalFiLoanVND = totalFiLoanVND;
        this.totalFiLoanUSD = totalFiLoanUSD;
        //add 8 fields 21/05/2020
        let resultLoan = getTotalLoan(outputLoanDetailinfo);
        this.tlv0000001 = totalFiLoanVND;
        this.tnlv000001 = resultLoan.tnlv000001;
        this.tclv000001 = resultLoan.tclv000001;
        this.tflv000001 = resultLoan.tflv000001;
        this.tdlv000001 = resultLoan.tdlv000001;
        this.telv000001 = resultLoan.telv000001;
        this.tblv000001 = resultLoan.tblv000001;
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

function getTotalLoan(loanDetailNode) {
    let tnlv000001 = 0.0; // sum of all FI's short term normal loan, mid term normal loan,long term normal loan,other normal loan
    let tclv000001 = 0.0; // sum of all FI's ,short term cautious loan,mid term cautious loan,long term cautious loan,other cautious loan
    let tflv000001 = 0.0; // sum of all FI's ,short term fixed loan,mid term fixed loan,long term fixed loan,other fixed loan
    let tdlv000001 = 0.0; // sum of all FI's ,short term doubt loan,mid term doubt loan,long term doubt loan,other doubt loan
    let telv000001 = 0.0; // sum of all FI's ,short term estimate loass loan,mid term estimate loass loan,long term estimate loass loan,other estimate loass loan
    // let tlv0000001 = 0.0; // same as totalFiLoanVnd  
    let tblv000001 = 0.0; // same as OtherBadLoanVnd
    
    _.forEach(loanDetailNode, res => {

        tnlv000001 = tnlv000001 + parseFloat(set1Is0(res.shortTermNormalLoanVnd)) + parseFloat(set1Is0(res.midTermNormalLoanVnd))
            + parseFloat(set1Is0(res.longTermNormalLoanVnd)) + parseFloat(set1Is0(res.otherNormalLoanVnd));

        tclv000001 = tclv000001 + parseFloat(set1Is0(res.shortTermCautiousLoanVnd)) + parseFloat(set1Is0(res.midTermCautiousLoanVnd))
            + parseFloat(set1Is0(res.longTermCautiousLoanVnd)) + parseFloat(set1Is0(res.otherCautousLoanVnd));

        tflv000001 = tflv000001 + parseFloat(set1Is0(res.shortTermFixedLoanVnd)) + parseFloat(set1Is0(res.midTermFixedLoanVnd))
            + parseFloat(set1Is0(res.longTermFixedLoanVnd)) + parseFloat(set1Is0(res.otherFixedLoanVnd));

        tdlv000001 = tdlv000001 + parseFloat(set1Is0(res.shortTermDaubtLoanVnd)) + parseFloat(set1Is0(res.midTermDaubtLoanVnd))
            + parseFloat(set1Is0(res.longTermDaubtLoanVnd)) + parseFloat(set1Is0(res.otherDaubtLoanVnd));

        telv000001 = telv000001 + parseFloat(set1Is0(res.shortTermEstLossLoanVnd)) + parseFloat(set1Is0(res.midTermEstLossLoanVnd))
            + parseFloat(set1Is0(res.longTermEstLossLoanVnd)) + parseFloat(set1Is0(res.otherEstLossLoanVnd));

        tblv000001 = tblv000001 + parseFloat(set1Is0(res.otherBadLoanVnd));

    });

    return { tnlv000001, tclv000001, tflv000001, tdlv000001, telv000001, tblv000001 };
}

function set1Is0(input) {
    if (_.isNumber(input))
        return input;
    else
        return 0;
}
