const validation = require('../../../shared/util/validation');

module.exports = function Loan12MCatious(params) {
    const {
        BASE_MONTH,
        BASE_MONTH_CAT_LOAN_SUM,
        OGZ_NM,
        RPT_DATE
    } = params;

    this.baseMonth = validation.formatDateVN(BASE_MONTH);
    this.baseMonthCautiousLoanSum = BASE_MONTH_CAT_LOAN_SUM;
    this.cicFiName = OGZ_NM;
    this.reportingDate = validation.formatDateVN(RPT_DATE);

}