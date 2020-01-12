
module.exports = function LoanDetailResponse(params, niceSessionKey, sysDtim, workID, seqs) {
    const {
        reportDate,
        companyName,
        stLoanVND,
        stLoanUSD,
        mtLoanVND,
        mtLoanUSD,
        ltLoanVND,
        ltLoanUSD,
        sumTotalVND,
        sumTotalUSD,
        waitData
    } = params;

    this.NICE_SSIN_ID = niceSessionKey;
    this.SEQ = seqs;
    this.ST_LOAN_VND = parseFloat(stLoanVND) ? parseFloat(stLoanVND) : 0;
    this.ST_LOAN_USD = parseFloat(stLoanUSD) ? parseFloat(stLoanUSD) : 0;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID;
    this.LOAD_DATE = waitData ? waitData : null;
    this.LOAD_TIME = waitData ? waitData : null;
    this.OGZ_CD = waitData ? waitData : null;
    this.OGZ_NM = companyName ? companyName : null;
    this.RCT_RPT_DATE = reportDate ? reportDate : null;
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
    this.MT_LOAN_VND = parseFloat(mtLoanVND) ? parseFloat(mtLoanVND) : 0;
    this.MT_LOAN_UDS = parseFloat(mtLoanUSD) ? parseFloat(mtLoanUSD) : 0;
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
    this.LT_LOAN_VND = parseFloat(ltLoanVND) ? parseFloat(ltLoanVND) : 0;
    this.LT_LOAN_USD = parseFloat(ltLoanUSD) ? parseFloat(ltLoanUSD) : 0;
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
    this.OTR_LOAN_VND = waitData ? waitData : 0;
    this.OTR_LOAN_USD = waitData ? waitData : 0;
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
    this.OTR_BAD_LOAN_VND = waitData ? waitData : 0;
    this.OTR_BAD_LOAN_USD = waitData ? waitData : 0;
    this.OGZ_TOT_LOAN_VND = waitData ? waitData : 0;
    this.OGZ_TOT_LOAN_USD = waitData ? waitData : 0;
    this.SUM_TOT_OGZ_VND = parseFloat(sumTotalVND) ? parseFloat(sumTotalVND) : 0;
    this.SUM_TOT_OGZ_USD = parseFloat(sumTotalUSD) ? parseFloat(sumTotalUSD) : 0;
}