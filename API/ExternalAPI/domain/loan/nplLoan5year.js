module.exports = function NPLLoan5Year(params) {
    const {
        OGZ_NM_BRANCH_NM,
        RCT_OCR_DATE,
        DEBT_GRP,
        AMT_VND,
        AMT_USD
    } = params;

    this.fiName = OGZ_NM_BRANCH_NM ? OGZ_NM_BRANCH_NM : '';
    this.recentOccurrenceDate = RCT_OCR_DATE ? RCT_OCR_DATE : '';
    this.debitGroup = DEBT_GRP ? DEBT_GRP : '';
    this.amountVnd = AMT_VND ? AMT_VND : '';
    this.amountUsd = AMT_USD ? AMT_USD : '';

}