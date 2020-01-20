
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
    this.LOAD_DATE = sysDtim.substr(0, 8);
    this.LOAD_TIME = sysDtim.substr(8);
    this.OGZ_CD = cicFiCode ? cicFiCode : null;
    this.OGZ_NM = cicFiName ? cicFiName : null;
    this.RCT_RPT_DATE = recentReportDate ? recentReportDate : null;
    this.ST_LOAN_VND = parseFloat(shortTermLoanVnd) ? parseFloat(shortTermLoanVnd) : null;
    this.ST_LOAN_USD = parseFloat(shortTermLoanUsd) ? parseFloat(shortTermLoanUsd) : null;
    this.ST_NORM_LOAN_VND = shortTermNormalLoanVnd ? shortTermNormalLoanVnd : null;
    this.ST_NORM_LOAN_USD = shortTermNormalLoanUsd ? shortTermNormalLoanUsd : null;
    this.ST_CAT_LOAN_VND = shortTermCautiousLoanVnd ? shortTermCautiousLoanVnd : null;
    this.ST_CAT_LOAN_USD = shortTermCautiousLoanUsd ? shortTermCautiousLoanUsd : null;
    this.ST_FIX_LOAN_VND = shortTermFixedLoanVnd ? shortTermFixedLoanVnd : null;
    this.ST_FIX_LOAN_USD = shortTermFixedLoanUsd ? shortTermFixedLoanUsd : null;
    this.ST_CQ_LOAN_VND = shortTermDaubtLoanVnd ? shortTermDaubtLoanVnd : null;
    this.ST_CQ_LOAN_USD = shortTermDaubtLoanUsd ? shortTermDaubtLoanUsd : null;
    this.ST_EL_LOAN_VND = shortTermEstLossLoanVnd ? shortTermEstLossLoanVnd : null;
    this.ST_EL_LOAN_USD = shortTermEstLossLoanUsd ? shortTermEstLossLoanUsd : null;
    this.MT_LOAN_VND = parseFloat(midTermLoadnInVnd) ? parseFloat(midTermLoadnInVnd) : null;
    this.MT_LOAN_UDS = parseFloat(midTermLoadnInUsd) ? parseFloat(midTermLoadnInUsd) : null;
    this.MT_NORM_LOAN_VND = midTermNormalLoanVnd ? midTermNormalLoanVnd : null;
    this.MT_NORM_LOAN_USD = midTermNormalLoanUsd ? midTermNormalLoanUsd : null;
    this.MT_CAT_LOAN_VND = midTermCautiousLoanVnd ? midTermCautiousLoanVnd : null;
    this.MT_CAT_LOAN_USD = midTermCautiousLoanUsd ? midTermCautiousLoanUsd : null;;
    this.MT_FIX_LOAN_VND = midTermFixedLoanVnd ? midTermFixedLoanVnd : null;
    this.MT_FIX_LOAN_USD = midTermFixedLoanUsd ? midTermFixedLoanUsd : null;
    this.MT_CQ_LOAN_VND = midTermDaubtLoanVnd ? midTermDaubtLoanVnd : null;
    this.MT_CQ_LOAN_USD = midTermDaubtLoanUsd ? midTermDaubtLoanUsd : null;
    this.MT_EL_LOAN_VND = midTermEstLossLoanVnd ? midTermEstLossLoanVnd :null;
    this.MT_EL_LOAN_USD = midTermEstLossLoanUsd ? midTermEstLossLoanUsd : null;
    this.LT_LOAN_VND = parseFloat(longTermLoanVnd) ? parseFloat(longTermLoanVnd) : null;
    this.LT_LOAN_USD = parseFloat(longTermLoanUsd) ? parseFloat(longTermLoanUsd) : null;
    this.LT_NORM_LOAN_VND = longTermNormalLoanVnd ? longTermNormalLoanVnd : null;
    this.LT_NORM_LOAN_USD = longTermNormalLoanUsd ? longTermNormalLoanUsd : null;
    this.LT_CAT_LOAN_VND = longTermCautiousLoanVnd ? longTermCautiousLoanVnd : null;
    this.LT_CAT_LOAN_USD = longTermCautiousLoanUsd ? longTermCautiousLoanUsd : null;
    this.LT_FIX_LOAN_VND = longTermFixedLoanVnd ? longTermFixedLoanVnd : null;
    this.LT_FIX_LOAN_USD = longTermfixedLoanUsd ? longTermfixedLoanUsd : null;
    this.LT_CQ_LOAN_VND = longTermDaubtLoanVnd ? longTermDaubtLoanVnd : null;
    this.LT_CQ_LOAN_USD = longTermDaubtLOanUsd ? longTermDaubtLOanUsd : null;
    this.LT_EL_LOAN_VND = longTermEstLossLoanVnd ? longTermEstLossLoanVnd : null;
    this.LT_EL_LOAN_USD = longTermEstLossLoanUsd ? longTermEstLossLoanUsd : null;
    this.OTR_LOAN_VND = parseFloat(otherLoanVnd) ? parseFloat(otherLoanVnd) : null;
    this.OTR_LOAN_USD = parseFloat(otherLoanUsd) ? parseFloat(otherLoanUsd) : null;
    this.OTR_NORM_LOAN_VND = otherNormalLoanVnd ? otherNormalLoanVnd : null;
    this.OTR_NORM_LOAN_USD = otherNormalLoanUsd ? otherNormalLoanUsd : null;
    this.OTR_CAT_LOAN_VND = otherCautousLoanVnd ? otherCautousLoanVnd : null;
    this.OTR_CAT_LOAN_USD = otherCautousLoanUsd ? otherCautousLoanUsd : null;
    this.OTR_FIX_LOAN_VND = otherFixedLoanVnd ? otherFixedLoanVnd : null;
    this.OTR_FIX_LOAN_USD = otherFixedLoanUsd ? otherFixedLoanUsd : null;
    this.OTR_CQ_LOAN_VND = otherDaubtLoanVnd ? otherDaubtLoanVnd : null;
    this.OTR_CQ_LOAN_USD = otherDaubtLoanUsd ? otherDaubtLoanUsd : null;
    this.OTR_EL_LOAN_VND = otherEstLossLoanVnd ? otherEstLossLoanVnd : null;
    this.OTR_EL_LOAN_USD = otherEstLossLoanUsd ? otherEstLossLoanUsd : null;
    this.OTR_BAD_LOAN_VND = parseFloat(otherBadLoanVnd) ? parseFloat(otherBadLoanVnd) : null;
    this.OTR_BAD_LOAN_USD = parseFloat(otherBadLoanUsd) ? parseFloat(otherBadLoanUsd) : null;
    this.OGZ_TOT_LOAN_VND = parseFloat(shortTermLoanVnd ? shortTermLoanVnd : 0 + midTermLoadnInVnd ? midTermLoadnInVnd : 0 + longTermLoanVnd ? longTermLoanVnd : 0 + otherBadLoanVnd ? otherBadLoanVnd : 0);
    this.OGZ_TOT_LOAN_USD = parseFloat(shortTermLoanUsd ? shortTermLoanUsd : 0 + midTermLoadnInUsd ? midTermLoadnInUsd : 0 + longTermLoanUsd ? longTermLoanUsd : 0 + otherBadLoanUsd ? otherBadLoanUsd : 0);
    this.SUM_TOT_OGZ_VND = waitData ? waitData : null;
    this.SUM_TOT_OGZ_USD = waitData ? waitData : null;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID;
}