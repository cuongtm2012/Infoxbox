module.exports = function Loan12MCatious(params) {
    const {
        BASE_MONTH,
        BASE_MONTH_CAT_LOAN_SUM,
        OGZ_NM,
        RPT_DATE
    } = params;

    this.baseMonth = BASE_MONTH ? BASE_MONTH : '';
    this.baseMonthCautiousLoanSum = BASE_MONTH_CAT_LOAN_SUM ? BASE_MONTH_CAT_LOAN_SUM : '';
    this.cicFiName = OGZ_NM ? OGZ_NM : '';
    this.reportingDate = RPT_DATE ? RPT_DATE : '';

}