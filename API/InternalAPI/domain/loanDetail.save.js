
module.exports = function LoanDetailResponse(params, ShortLoanTerm, MidLoanTerm, LongLoanTerm, OtherLoanTerm, niceSessionKey, sysDtim, workID) {
    const {
        cicFiCode,
        cicFiName,
        recentReportDate,
        seq,
        shortTermLoanVnd,
        shortTermLoanUsd,
        midTermLoadnInVnd,
        midTermLoadnInUsd,
        longTermLoanVnd,
        longTermLoanUsd,
        otherLoanVnd,
        otherLoanUsd,
        otherBadLoanVnd,
        otherBadLoanUsd,
        totalLoanVnd,
        totalLoanUsd,
        waitData
    } = params;
    const {
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
    } = ShortLoanTerm;
    const {
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
    } = MidLoanTerm;
    const {
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
    } = LongLoanTerm;
    const {
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
    } = OtherLoanTerm;

    this.NICE_SSIN_ID = niceSessionKey;
    this.SEQ = parseInt(seq);
    this.LOAD_DATE = waitData ? waitData : null;
    this.LOAD_TIME = waitData ? waitData : null;
    this.OGZ_CD = cicFiCode ? cicFiCode : null;
    this.OGZ_NM = (cicFiCode + '-' + cicFiName) ? (cicFiCode + '-' + cicFiName) : null;
    this.RCT_RPT_DATE = recentReportDate ? recentReportDate : null;
    this.ST_LOAN_VND = parseFloat(shortTermLoanVnd) ? parseFloat(shortTermLoanVnd) : 0;
    this.ST_LOAN_USD = parseFloat(shortTermLoanUsd) ? parseFloat(shortTermLoanUsd) : 0;
    this.ST_NORM_LOAN_VND = shortTermNormalLoanVnd ? shortTermNormalLoanVnd : 0;
    this.ST_NORM_LOAN_USD = shortTermNormalLoanUsd ? shortTermNormalLoanUsd : 0;
    this.ST_CAT_LOAN_VND = shortTermCautiousLoanVnd ? shortTermCautiousLoanVnd : 0;
    this.ST_CAT_LOAN_USD = shortTermCautiousLoanUsd ? shortTermCautiousLoanUsd : 0;
    this.ST_FIX_LOAN_VND = shortTermFixedLoanVnd ? shortTermFixedLoanVnd : 0;
    this.ST_FIX_LOAN_USD = shortTermFixedLoanUsd ? shortTermFixedLoanUsd : 0;
    this.ST_CQ_LOAN_VND = shortTermDaubtLoanVnd ? shortTermDaubtLoanVnd : 0;
    this.ST_CQ_LOAN_USD = shortTermDaubtLoanUsd ? shortTermDaubtLoanUsd : 0;
    this.ST_EL_LOAN_VND = shortTermEstLossLoanVnd ? shortTermEstLossLoanVnd : 0;
    this.ST_EL_LOAN_USD = shortTermEstLossLoanUsd ? shortTermEstLossLoanUsd : 0;
    this.MT_LOAN_VND = parseFloat(midTermLoadnInVnd) ? parseFloat(midTermLoadnInVnd) : 0;
    this.MT_LOAN_UDS = parseFloat(midTermLoadnInUsd) ? parseFloat(midTermLoadnInUsd) : 0;
    this.MT_NORM_LOAN_VND = midTermNormalLoanVnd ? midTermNormalLoanVnd : 0;
    this.MT_NORM_LOAN_USD = midTermNormalLoanUsd ? midTermNormalLoanUsd : 0;
    this.MT_CAT_LOAN_VND = midTermCautiousLoanVnd ? midTermCautiousLoanVnd : 0;
    this.MT_CAT_LOAN_USD = midTermCautiousLoanUsd ? midTermCautiousLoanUsd : 0;;
    this.MT_FIX_LOAN_VND = midTermFixedLoanVnd ? midTermFixedLoanVnd : 0;
    this.MT_FIX_LOAN_USD = midTermFixedLoanUsd ? midTermFixedLoanUsd : 0;
    this.MT_CQ_LOAN_VND = midTermDaubtLoanVnd ? midTermDaubtLoanVnd : 0;
    this.MT_CQ_LOAN_USD = midTermDaubtLoanUsd ? midTermDaubtLoanUsd : 0;
    this.MT_EL_LOAN_VND = midTermEstLossLoanVnd ? midTermEstLossLoanVnd : 0;
    this.MT_EL_LOAN_USD = midTermEstLossLoanUsd ? midTermEstLossLoanUsd : 0;
    this.LT_LOAN_VND = parseFloat(longTermLoanVnd) ? parseFloat(longTermLoanVnd) : 0;
    this.LT_LOAN_USD = parseFloat(longTermLoanUsd) ? parseFloat(longTermLoanUsd) : 0;
    this.LT_NORM_LOAN_VND = longTermNormalLoanVnd ? longTermNormalLoanVnd : 0;
    this.LT_NORM_LOAN_USD = longTermNormalLoanUsd ? longTermNormalLoanUsd : 0;
    this.LT_CAT_LOAN_VND = longTermCautiousLoanVnd ? longTermCautiousLoanVnd : 0;
    this.LT_CAT_LOAN_USD = longTermCautiousLoanUsd ? longTermCautiousLoanUsd : 0;
    this.LT_FIX_LOAN_VND = longTermFixedLoanVnd ? longTermFixedLoanVnd : 0;;
    this.LT_FIX_LOAN_USD = longTermfixedLoanUsd ? longTermfixedLoanUsd : 0;
    this.LT_CQ_LOAN_VND = longTermDaubtLoanVnd ? longTermDaubtLoanVnd : 0;
    this.LT_CQ_LOAN_USD = longTermDaubtLOanUsd ? longTermDaubtLOanUsd : 0;
    this.LT_EL_LOAN_VND = longTermEstLossLoanVnd ? longTermEstLossLoanVnd : 0;
    this.LT_EL_LOAN_USD = longTermEstLossLoanUsd ? longTermEstLossLoanUsd : 0;
    this.OTR_LOAN_VND = parseFloat(otherLoanVnd) ? parseFloat(otherLoanVnd) : 0;
    this.OTR_LOAN_USD = parseFloat(otherLoanUsd) ? parseFloat(otherLoanUsd) : 0;
    this.OTR_NORM_LOAN_VND = otherNormalLoanVnd ? otherNormalLoanVnd : 0;
    this.OTR_NORM_LOAN_USD = otherNormalLoanUsd ? otherNormalLoanUsd : 0;
    this.OTR_CAT_LOAN_VND = otherCautousLoanVnd ? otherCautousLoanVnd : 0;
    this.OTR_CAT_LOAN_USD = otherCautousLoanUsd ? otherCautousLoanUsd : 0;
    this.OTR_FIX_LOAN_VND = otherFixedLoanVnd ? otherFixedLoanVnd : 0;
    this.OTR_FIX_LOAN_USD = otherFixedLoanUsd ? otherFixedLoanUsd : 0;
    this.OTR_CQ_LOAN_VND = otherDaubtLoanVnd ? otherDaubtLoanVnd : 0;
    this.OTR_CQ_LOAN_USD = otherDaubtLoanUsd ? otherDaubtLoanUsd : 0;
    this.OTR_EL_LOAN_VND = otherEstLossLoanVnd ? otherEstLossLoanVnd : 0;
    this.OTR_EL_LOAN_USD = otherEstLossLoanUsd ? otherEstLossLoanUsd : 0;
    this.OTR_BAD_LOAN_VND = parseFloat(otherBadLoanVnd) ? parseFloat(otherBadLoanVnd) : 0;
    this.OTR_BAD_LOAN_USD = parseFloat(otherBadLoanUsd) ? parseFloat(otherBadLoanUsd) : 0;
    this.OGZ_TOT_LOAN_VND = waitData ? waitData : 0;
    this.OGZ_TOT_LOAN_USD = waitData ? waitData : 0;
    this.SUM_TOT_OGZ_VND = parseFloat(shortTermLoanVnd ? shortTermLoanVnd : 0 + midTermLoadnInVnd ? midTermLoadnInVnd : 0 + longTermLoanVnd ? longTermLoanVnd : 0 + otherBadLoanVnd ? otherBadLoanVnd : 0);
    this.SUM_TOT_OGZ_USD = parseFloat(shortTermLoanUsd ? shortTermLoanUsd : 0 + midTermLoadnInUsd ? midTermLoadnInUsd : 0 + longTermLoanUsd ? longTermLoanUsd : 0 + otherBadLoanUsd ? otherBadLoanUsd : 0);
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID;
}