const convertMilionUnit = require('../../../shared/util/convertUnit');

module.exports = function Loan12MCatious(params) {
    const {
        BASE_MONTH,
        BASE_MONTH_CAT_LOAN_SUM,
        OGZ_NM,
        RPT_DATE
    } = params;

    this.baseMonth = BASE_MONTH;
    this.baseMonthCautiousLoanSum = convertMilionUnit.milionUnit(BASE_MONTH_CAT_LOAN_SUM);
    this.cicFiName = OGZ_NM;
    this.reportingDate = RPT_DATE;

}