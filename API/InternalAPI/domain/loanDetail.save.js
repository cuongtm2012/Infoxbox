
module.exports = function LoanDetailResponse(params, niceSessionKey, sysDtim, workID) {
    const {
        cicFiCode,
        cicFiName,
        recentReportDate,
        seq,
        shortTermLoanVnd,
        shortTermLoanUsd,
        shortTermNormalLoanVnd,
        shortTermNormalLoanUsd,
        shortTermCautiousLoanVnd,
        shortTermCautiousLoanUsd,
        shortTermFixedLoanVnd,
        shortTermFixedLoanUsd,
        shortTermDaubtLoanVnd,
        shortTermDaubtLoanUsd,
        shortTermEstLossLoanVnd,
        shortTermEstLossLoanUsd,
        midTermLoadnInVnd,
        midTermLoadnInUsd,
        midTermNormalLoanVnd,
        midTermNormalLoanUsd,
        midTermCautiousLoanVnd,
        midTermCautiousLoanUsd,
        midTermFixedLoanVnd,
        midTermFixedLoanUsd,
        midTermDaubtLoanVnd,
        midTermDaubtLoanUsd,
        midTermEstLossLoanVnd,
        midTermEstLossLoanUsd,
        longTermLoanVnd,
        longTermLoanUsd,
        longTermNormalLoanVnd,
        longTermNormalLoanUsd,
        longTermCautiousLoanVnd,
        longTermCautiousLoanUsd,
        longTermFixedLoanVnd,
        longTermfixedLoanUsd,
        longTermDaubtLoanVnd,
        longTermDaubtLOanUsd,
        longTermEstLossLoanVnd,
        longTermEstLossLoanUsd,
        otherLoanVnd,
        otherLoanUsd,
        otherNormalLoanVnd,
        otherNormalLoanUsd,
        otherCautousLoanVnd,
        otherCautousLoanUsd,
        otherFixedLoanVnd,
        otherFixedLoanUsd,
        otherDaubtLoanVnd,
        otherDaubtLoanUsd,
        otherEstLossLoanVnd,
        otherEstLossLoanUsd,
        otherBadLoanVnd,
        otherbadLoanUsd,
        totalLoanVnd,
        totalLoanUsd,
        waitData
    } = params;

    this.NICE_SSIN_ID = niceSessionKey;
    this.SEQ = parseInt(seq);
    this.LOAD_DATE = waitData ? waitData : null;
    this.LOAD_TIME = waitData ? waitData : null;
    this.OGZ_CD = cicFiCode ? cicFiCode : null;
    this.OGZ_NM = (cicFiCode + '-' + cicFiName) ? (cicFiCode + '-' + cicFiName) : null;
    this.RCT_RPT_DATE = recentReportDate ? recentReportDate : null;
    this.ST_LOAN_VND = parseFloat(shortTermLoanVnd) ? parseFloat(shortTermLoanVnd) : 0;
    this.ST_LOAN_USD = parseFloat(shortTermLoanUsd) ? parseFloat(shortTermLoanUsd) : 0;
    this.ST_NORM_LOAN_VND = waitData ? waitData : 0;
    this.ST_NORM_LOAN_USD = waitData ? waitData : 0;
    this.ST_CAT_LOAN_VND = waitData ? waitData : 0;
    this.ST_CAT_LOAN_USD = waitData ? waitData : 0;
    this.ST_FIX_LOAN_VND = waitData ? waitData : 0;
    this.ST_FIX_LOAN_USD = waitData ? waitData : 0;
    this.ST_CQ_LOAN_VND = waitData ? waitData : 0;
    this.ST_CQ_LOAN_USD = waitData ? waitData : 0;
    this.ST_EL_LOAN_VND = waitData ? waitData : 0;
    this.ST_EL_LOAN_USD = waitData ? waitData : 0;
    this.MT_LOAN_VND = parseFloat(midTermLoadnInVnd) ? parseFloat(midTermLoadnInVnd) : 0;
    this.MT_LOAN_UDS = parseFloat(midTermLoadnInUsd) ? parseFloat(midTermLoadnInUsd) : 0;
    this.MT_NORM_LOAN_VND = waitData ? waitData : 0;
    this.MT_NORM_LOAN_USD = waitData ? waitData : 0;
    this.MT_CAT_LOAN_VND = waitData ? waitData : 0;
    this.MT_CAT_LOAN_USD = waitData ? waitData : 0;
    this.MT_FIX_LOAN_VND = waitData ? waitData : 0;
    this.MT_FIX_LOAN_USD = waitData ? waitData : 0;
    this.MT_CQ_LOAN_VND = waitData ? waitData : 0;
    this.MT_CQ_LOAN_USD = waitData ? waitData : 0;
    this.MT_EL_LOAN_VND = waitData ? waitData : 0;
    this.MT_EL_LOAN_USD = waitData ? waitData : 0;
    this.LT_LOAN_VND = parseFloat(longTermLoanVnd) ? parseFloat(longTermLoanVnd) : 0;
    this.LT_LOAN_USD = parseFloat(longTermLoanUsd) ? parseFloat(longTermLoanUsd) : 0;
    this.LT_NORM_LOAN_VND = waitData ? waitData : 0;
    this.LT_NORM_LOAN_USD = waitData ? waitData : 0;
    this.LT_CAT_LOAN_VND = waitData ? waitData : 0;
    this.LT_CAT_LOAN_USD = waitData ? waitData : 0;
    this.LT_FIX_LOAN_VND = waitData ? waitData : 0;
    this.LT_FIX_LOAN_USD = waitData ? waitData : 0;
    this.LT_CQ_LOAN_VND = waitData ? waitData : 0;
    this.LT_CQ_LOAN_USD = waitData ? waitData : 0;
    this.LT_EL_LOAN_VND = waitData ? waitData : 0;
    this.LT_EL_LOAN_USD = waitData ? waitData : 0;
    this.OTR_LOAN_VND = parseFloat(otherLoanVnd) ? parseFloat(otherLoanVnd) : 0;
    this.OTR_LOAN_USD = parseFloat(otherLoanUsd) ? parseFloat(otherLoanUsd) : 0;
    this.OTR_NORM_LOAN_VND = waitData ? waitData : 0;
    this.OTR_NORM_LOAN_USD = waitData ? waitData : 0;
    this.OTR_CAT_LOAN_VND = waitData ? waitData : 0;
    this.OTR_CAT_LOAN_USD = waitData ? waitData : 0;
    this.OTR_FIX_LOAN_VND = waitData ? waitData : 0;
    this.OTR_FIX_LOAN_USD = waitData ? waitData : 0;
    this.OTR_CQ_LOAN_VND = waitData ? waitData : 0;
    this.OTR_CQ_LOAN_USD = waitData ? waitData : 0;
    this.OTR_EL_LOAN_VND = waitData ? waitData : 0;
    this.OTR_EL_LOAN_USD = waitData ? waitData : 0;
    this.OTR_BAD_LOAN_VND = parseFloat(otherBadLoanVnd) ? parseFloat(otherBadLoanVnd) : 0;
    this.OTR_BAD_LOAN_USD = parseFloat(otherbadLoanUsd) ? parseFloat(otherbadLoanUsd) : 0;
    this.OGZ_TOT_LOAN_VND = waitData ? waitData : 0;
    this.OGZ_TOT_LOAN_USD = waitData ? waitData : 0;
    this.SUM_TOT_OGZ_VND = parseFloat(shortTermLoanVnd + midTermLoadnInVnd + longTermLoanVnd + otherBadLoanVnd) ? parseFloat(shortTermLoanVnd + midTermLoadnInVnd + longTermLoanVnd + otherLoanVnd) : 0;
    this.SUM_TOT_OGZ_USD = parseFloat(shortTermLoanUsd + midTermLoadnInUsd + longTermLoanUsd + otherbadLoanUsd) ? parseFloat(shortTermLoanUsd + midTermLoadnInUsd + longTermLoanUsd + otherLoanUsd) : 0;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID;
}