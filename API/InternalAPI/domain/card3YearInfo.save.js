const parseValue = require('../util/parseValue');
const validation = require('../../shared/util/validation');

module.exports = function Card3YearInfo(listData, niceSessionKey) {
    const {
        borrowCreditCardArrear,
        creditCardLongestArrearDays,
        creditCardArrearCount
    } = listData;


    this.NICE_SSIN_ID = niceSessionKey;
    this.CARD_ARR_PSN_YN = borrowCreditCardArrear ? borrowCreditCardArrear : null;
    this.CARD_ARR_LGST_DAYS = creditCardLongestArrearDays ? parseValue.parseInteger(creditCardLongestArrearDays) : validation.setEmptyValue(creditCardLongestArrearDays);
    this.CARD_ARR_CNT = creditCardArrearCount ? parseValue.parseInteger(creditCardArrearCount) : validation.setEmptyValue(creditCardArrearCount);

}
