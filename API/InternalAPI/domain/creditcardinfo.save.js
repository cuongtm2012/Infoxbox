module.exports = function creditcardinfo(creditcardinfor, niceSessionKey) {
    const {
        totCreditCardLimit,
        totAmountCardPayment,
        totAmountCardPaymentDelay,
        creditCardNumber,
        nameOfCardIssuer
    } = creditcardinfor;

    this.NICE_SSIN_ID = niceSessionKey;
    this.CARD_TOT_LMT = totCreditCardLimit ? totCreditCardLimit : '0';
    this.CARD_TOT_SETL_AMT = totAmountCardPayment ? totAmountCardPayment : '0';
    this.CARD_TOT_ARR_AMT = totAmountCardPaymentDelay ? totAmountCardPaymentDelay : '0';
    this.CARD_CNT = creditCardNumber ? creditCardNumber : '0';
    this.CARD_ISU_OGZ = nameOfCardIssuer ? nameOfCardIssuer : '0';
}