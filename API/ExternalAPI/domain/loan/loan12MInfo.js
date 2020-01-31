module.exports = function Loan12MInfo(params) {
    const {
        BASE_MONTH,
        BASE_MONTH_BAL,
        BASE_MONTH_CARD_BAL,
        BASE_MONTH_SUM
    } = params;

    this.baseMonth = BASE_MONTH ? BASE_MONTH : '';
    this.baseMonthLoanBalance = BASE_MONTH_BAL ? BASE_MONTH_BAL : '';
    this.baseMonthCreditCardBalance = BASE_MONTH_CARD_BAL ? BASE_MONTH_CARD_BAL : '';
    this.baseMonthSum = BASE_MONTH_SUM ? BASE_MONTH_SUM : '';
}