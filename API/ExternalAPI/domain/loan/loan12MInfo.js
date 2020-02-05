const convertMilionUnit = require('../../../shared/util/convertUnit');

module.exports = function Loan12MInfo(params) {
    const {
        BASE_MONTH,
        BASE_MONTH_BAL,
        BASE_MONTH_CARD_BAL,
        BASE_MONTH_SUM
    } = params;

    this.baseMonth = BASE_MONTH;
    this.baseMonthLoanBalance = convertMilionUnit.milionUnit(BASE_MONTH_BAL);
    this.baseMonthCreditCardBalance = convertMilionUnit.milionUnit(BASE_MONTH_CARD_BAL);
    this.baseMonthSum = convertMilionUnit.milionUnit(BASE_MONTH_SUM);
}