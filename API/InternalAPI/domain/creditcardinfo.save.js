const validation = require('../../shared/util/validation');

module.exports = function creditcardinfo(creditcardinfor, niceSessionKey) {
    const {
        totCreditCardLimit,
        totAmountCardPayment,
        totAmountCardPaymentDelay,
        creditCardNumber,
        nameOfCardIssuer
    } = creditcardinfor;

    this.NICE_SSIN_ID = niceSessionKey;
    this.CARD_TOT_LMT = totCreditCardLimit ? totCreditCardLimit : validation.setEmptyValue(totCreditCardLimit);
    this.CARD_TOT_SETL_AMT = totAmountCardPayment ? totAmountCardPayment : validation.setEmptyValue(totAmountCardPayment);
    this.CARD_TOT_ARR_AMT = totAmountCardPaymentDelay ? totAmountCardPaymentDelay : validation.setEmptyValue(totAmountCardPaymentDelay);
    this.CARD_CNT = creditCardNumber ? creditCardNumber : validation.setEmptyValue(creditCardNumber);
    this.CARD_ISU_OGZ = nameOfCardIssuer ? nameOfCardIssuer : null;
}