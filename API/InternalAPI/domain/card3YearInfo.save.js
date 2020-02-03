module.exports = function Card3YearInfo(listData, niceSessionKey) {
    const {
        borrowCreditCardArrear,
        creditCardLongestArrearDays,
        creditCardArrearCount
    } = listData;


    this.NICE_SSIN_ID = niceSessionKey;
    this.CARD_ARR_PSN_YN = borrowCreditCardArrear ? borrowCreditCardArrear : null;
    this.CARD_ARR_LGST_DAYS = creditCardLongestArrearDays ? creditCardLongestArrearDays : null;
    this.CARD_ARR_CNT = creditCardArrearCount ? creditCardArrearCount : null;

}
