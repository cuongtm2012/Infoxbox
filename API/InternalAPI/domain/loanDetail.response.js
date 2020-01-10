
module.exports = function LoanDetailResponse(params, niceSessionKey, sysDtim, workID, seqs) {
    const {
        seq,
        item,
        vnd,
        usd
    } = params;

    this.NICE_SSIN_ID = niceSessionKey;
    this.SEQ = seqs;
    this.ST_LOAN_VND = parseFloat(vnd) ? parseFloat(vnd) : 0;
    this.ST_LOAN_USD = parseFloat(usd) ? parseFloat(usd) : 0;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID;
    this.LOAD_DATE;
    this.LOAD_TIME;
    this.OGZ_CD;
    this.OGZ_NM;
    this.RCT_RPT_DATE;
    this.ST_LOAN_VND;
    this.ST_LOAN_USD;
    this.ST_NORM_LOAN_VND;
    this.ST_NORM_LOAN_USD;
    this.ST_CAT_LOAN_VND;
    this.ST_CAT_LOAN_USD;
    this.ST_FIX_LOAN_VND;
    this.ST_FIX_LOAN_USD;
    this.ST_CQ_LOAN_VND;
    this.ST_CQ_LOAN_USD;
    this.ST_EL_LOAN_VND;
    this.ST_EL_LOAN_USD;
    this.MT_LOAN_VND;
    this.MT_LOAN_UDS;
    this.MT_NORM_LOAN_VND;
    this.MT_NORM_LOAN_USD;
    this.MT_CAT_LOAN_VND;
    this.MT_CAT_LOAN_USD;
    this.MT_FIX_LOAN_VND;
    this.MT_FIX_LOAN_USD;
    this.MT_CQ_LOAN_VND;
    this.MT_CQ_LOAN_USD;
    this.MT_EL_LOAN_VND;
    this.MT_EL_LOAN_USD;
    this.LT_LOAN_VND;
    this.LT_LOAN_USD;
    this.LT_NORM_LOAN_VND;
    this.LT_NORM_LOAN_USD;
    this.LT_CAT_LOAN_VND;
    this.LT_CAT_LOAN_USD;
    this.LT_FIX_LOAN_VND;
    this.LT_FIX_LOAN_USD;
    this.LT_CQ_LOAN_VND;
    this.LT_CQ_LOAN_USD;
    this.LT_EL_LOAN_VND;
    this.LT_EL_LOAN_USD;
    this.OTR_LOAN_VND;
    this.OTR_LOAN_USD;
    this.OTR_NORM_LOAN_VND;
    this.OTR_NORM_LOAN_USD;
    this.OTR_CAT_LOAN_VND;
    this.OTR_CAT_LOAN_USD;
    this.OTR_FIX_LOAN_VND;
    this.OTR_FIX_LOAN_USD;
    this.OTR_CQ_LOAN_VND;
    this.OTR_CQ_LOAN_USD;
    this.OTR_EL_LOAN_VND;
    this.OTR_EL_LOAN_USD;
    this.OTR_BAD_LOAN_VND;
    this.OTR_BAD_LOAN_USD;
    this.OGZ_TOT_LOAN_VND;
    this.OGZ_TOT_LOAN_USD;
    this.SUM_TOT_OGZ_VND;
    this.SUM_TOT_OGZ_USD;
    this.SYS_DTIM;
    this.WORK_ID
}