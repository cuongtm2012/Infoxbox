const validation = require('../../shared/util/validation');

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
    this.ST_LOAN_VND = shortTermLoanVnd ? parseFloat(shortTermLoanVnd) : validation.setEmptyValue(shortTermLoanVnd);
    this.ST_LOAN_USD = shortTermLoanUsd ? parseFloat(shortTermLoanUsd) : validation.setEmptyValue(shortTermLoanUsd);
    this.ST_NORM_LOAN_VND = shortTermNormalLoanVnd ? parseFloat(shortTermNormalLoanVnd) : validation.setEmptyValue(shortTermNormalLoanVnd);
    this.ST_NORM_LOAN_USD = shortTermNormalLoanUsd ? parseFloat(shortTermNormalLoanUsd) : validation.setEmptyValue(shortTermNormalLoanUsd);
    this.ST_CAT_LOAN_VND = shortTermCautiousLoanVnd ? parseFloat(shortTermCautiousLoanVnd) : validation.setEmptyValue(shortTermCautiousLoanVnd);
    this.ST_CAT_LOAN_USD = shortTermCautiousLoanUsd ? parseFloat(shortTermCautiousLoanUsd) : validation.setEmptyValue(shortTermCautiousLoanUsd);
    this.ST_FIX_LOAN_VND = shortTermFixedLoanVnd ? parseFloat(shortTermFixedLoanVnd) : validation.setEmptyValue(shortTermFixedLoanVnd);
    this.ST_FIX_LOAN_USD = shortTermFixedLoanUsd ? parseFloat(shortTermFixedLoanUsd) : validation.setEmptyValue(shortTermFixedLoanUsd);
    this.ST_CQ_LOAN_VND = shortTermDaubtLoanVnd ? parseFloat(shortTermDaubtLoanVnd) : validation.setEmptyValue(shortTermDaubtLoanVnd);
    this.ST_CQ_LOAN_USD = shortTermDaubtLoanUsd ? parseFloat(shortTermDaubtLoanUsd) : validation.setEmptyValue(shortTermDaubtLoanUsd);
    this.ST_EL_LOAN_VND = shortTermEstLossLoanVnd ? parseFloat(shortTermEstLossLoanVnd) : validation.setEmptyValue(shortTermEstLossLoanVnd);
    this.ST_EL_LOAN_USD = shortTermEstLossLoanUsd ? parseFloat(shortTermEstLossLoanUsd) : validation.setEmptyValue(shortTermEstLossLoanUsd);
    this.MT_LOAN_VND = midTermLoadnInVnd ? parseFloat(midTermLoadnInVnd) : validation.setEmptyValue(midTermLoadnInVnd);
    this.MT_LOAN_UDS = midTermLoadnInUsd ? parseFloat(midTermLoadnInUsd) : validation.setEmptyValue(midTermLoadnInUsd);
    this.MT_NORM_LOAN_VND = midTermNormalLoanVnd ? parseFloat(midTermNormalLoanVnd) : validation.setEmptyValue(midTermNormalLoanVnd);
    this.MT_NORM_LOAN_USD = midTermNormalLoanUsd ? parseFloat(midTermNormalLoanUsd) : validation.setEmptyValue(midTermNormalLoanUsd);
    this.MT_CAT_LOAN_VND = midTermCautiousLoanVnd ? parseFloat(midTermCautiousLoanVnd) : validation.setEmptyValue(midTermCautiousLoanVnd);
    this.MT_CAT_LOAN_USD = midTermCautiousLoanUsd ? parseFloat(midTermCautiousLoanUsd) : validation.setEmptyValue(midTermCautiousLoanUsd);
    this.MT_FIX_LOAN_VND = midTermFixedLoanVnd ? parseFloat(midTermFixedLoanVnd) : validation.setEmptyValue(midTermFixedLoanVnd);
    this.MT_FIX_LOAN_USD = midTermFixedLoanUsd ? parseFloat(midTermFixedLoanUsd) : validation.setEmptyValue(midTermFixedLoanUsd);
    this.MT_CQ_LOAN_VND = midTermDaubtLoanVnd ? parseFloat(midTermDaubtLoanVnd) : validation.setEmptyValue(midTermDaubtLoanVnd);
    this.MT_CQ_LOAN_USD = midTermDaubtLoanUsd ? parseFloat(midTermDaubtLoanUsd) : validation.setEmptyValue(midTermDaubtLoanUsd);
    this.MT_EL_LOAN_VND = midTermEstLossLoanVnd ? parseFloat(midTermEstLossLoanVnd) : validation.setEmptyValue(midTermEstLossLoanVnd);
    this.MT_EL_LOAN_USD = midTermEstLossLoanUsd ? parseFloat(midTermEstLossLoanUsd) : validation.setEmptyValue(midTermEstLossLoanUsd);
    this.LT_LOAN_VND = longTermLoanVnd ? parseFloat(longTermLoanVnd) : validation.setEmptyValue(longTermLoanVnd);
    this.LT_LOAN_USD = longTermLoanUsd ? parseFloat(longTermLoanUsd) : validation.setEmptyValue(longTermLoanUsd);
    this.LT_NORM_LOAN_VND = longTermNormalLoanVnd ? parseFloat(longTermNormalLoanVnd) : validation.setEmptyValue(longTermNormalLoanVnd);
    this.LT_NORM_LOAN_USD = longTermNormalLoanUsd ? parseFloat(longTermNormalLoanUsd) : validation.setEmptyValue(longTermNormalLoanUsd);
    this.LT_CAT_LOAN_VND = longTermCautiousLoanVnd ? parseFloat(longTermCautiousLoanVnd) : validation.setEmptyValue(longTermCautiousLoanVnd);
    this.LT_CAT_LOAN_USD = longTermCautiousLoanUsd ? parseFloat(longTermCautiousLoanUsd) : validation.setEmptyValue(longTermCautiousLoanUsd);
    this.LT_FIX_LOAN_VND = longTermFixedLoanVnd ? parseFloat(longTermFixedLoanVnd) : validation.setEmptyValue(longTermFixedLoanVnd);
    this.LT_FIX_LOAN_USD = longTermfixedLoanUsd ? parseFloat(longTermfixedLoanUsd) : validation.setEmptyValue(longTermfixedLoanUsd);
    this.LT_CQ_LOAN_VND = longTermDaubtLoanVnd ? parseFloat(longTermDaubtLoanVnd) : validation.setEmptyValue(longTermDaubtLoanVnd);
    this.LT_CQ_LOAN_USD = longTermDaubtLOanUsd ? parseFloat(longTermDaubtLOanUsd) : validation.setEmptyValue(longTermDaubtLOanUsd);
    this.LT_EL_LOAN_VND = longTermEstLossLoanVnd ? parseFloat(longTermEstLossLoanVnd) : validation.setEmptyValue(longTermEstLossLoanVnd);
    this.LT_EL_LOAN_USD = longTermEstLossLoanUsd ? parseFloat(longTermEstLossLoanUsd) : validation.setEmptyValue(longTermEstLossLoanUsd);
    this.OTR_LOAN_VND = otherLoanVnd ? parseFloat(otherLoanVnd) : validation.setEmptyValue(otherLoanVnd);
    this.OTR_LOAN_USD = otherLoanUsd ? parseFloat(otherLoanUsd) : validation.setEmptyValue(otherLoanUsd);
    this.OTR_NORM_LOAN_VND = otherNormalLoanVnd ? parseFloat(otherNormalLoanVnd) : validation.setEmptyValueotherNormalLoanVnd
    this.OTR_NORM_LOAN_USD = otherNormalLoanUsd ? parseFloat(otherNormalLoanUsd) : validation.setEmptyValue(otherNormalLoanUsd);
    this.OTR_CAT_LOAN_VND = otherCautousLoanVnd ? parseFloat(otherCautousLoanVnd) : validation.setEmptyValue(otherCautousLoanVnd);
    this.OTR_CAT_LOAN_USD = otherCautousLoanUsd ? parseFloat(otherCautousLoanUsd) : validation.setEmptyValue(otherCautousLoanUsd);
    this.OTR_FIX_LOAN_VND = otherFixedLoanVnd ? parseFloat(otherFixedLoanVnd) : validation.setEmptyValue(otherFixedLoanVnd);
    this.OTR_FIX_LOAN_USD = otherFixedLoanUsd ? parseFloat(otherFixedLoanUsd) : validation.setEmptyValue(otherFixedLoanUsd);
    this.OTR_CQ_LOAN_VND = otherDaubtLoanVnd ? parseFloat(otherDaubtLoanVnd) : validation.setEmptyValue(otherDaubtLoanVnd);
    this.OTR_CQ_LOAN_USD = otherDaubtLoanUsd ? parseFloat(otherDaubtLoanUsd) : validation.setEmptyValue(otherDaubtLoanUsd);
    this.OTR_EL_LOAN_VND = otherEstLossLoanVnd ? parseFloat(otherEstLossLoanVnd) : validation.setEmptyValue(otherEstLossLoanVnd);
    this.OTR_EL_LOAN_USD = otherEstLossLoanUsd ? parseFloat(otherEstLossLoanUsd) : validation.setEmptyValue(otherEstLossLoanUsd);
    this.OTR_BAD_LOAN_VND = otherBadLoanVnd ? parseFloat(otherBadLoanVnd) : validation.setEmptyValue(otherBadLoanVnd);
    this.OTR_BAD_LOAN_USD = otherBadLoanUsd ? parseFloat(otherBadLoanUsd) : validation.setEmptyValue(otherBadLoanUsd);
    this.OGZ_TOT_LOAN_VND = parseFloat(shortTermLoanVnd ? shortTermLoanVnd : 0 + midTermLoadnInVnd ? midTermLoadnInVnd : 0 + longTermLoanVnd ? longTermLoanVnd : 0 + otherBadLoanVnd ? otherBadLoanVnd : 0);
    this.OGZ_TOT_LOAN_USD = parseFloat(shortTermLoanUsd ? shortTermLoanUsd : 0 + midTermLoadnInUsd ? midTermLoadnInUsd : 0 + longTermLoanUsd ? longTermLoanUsd : 0 + otherBadLoanUsd ? otherBadLoanUsd : 0);
    this.SUM_TOT_OGZ_VND = waitData ? waitData : null;
    this.SUM_TOT_OGZ_USD = waitData ? waitData : null;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID;
}