
const _ = require('lodash');
const constant = require('./consant');

module.exports = {
    getCard3YInfor: function (listDelayCard3Y) {
        var res;
        var borrowCreditCardArrear, creditCardLongestArrearDays, creditCardArrearCount;
        _.forEach(listDelayCard3Y, val => {
            if (_.startsWith(val.item, constant.mappingCard3Year.borrowCreditCardArrear))
                borrowCreditCardArrear = val.content;

            if (_.startsWith(val.item, constant.mappingCard3Year.creditCardLongestArrearDays))
                creditCardLongestArrearDays = val.content;

            if (_.startsWith(val.item, constant.mappingCard3Year.creditCardArrearCount))
                creditCardArrearCount = val.content;
        });
        res = {
            borrowCreditCardArrear: borrowCreditCardArrear,
            creditCardLongestArrearDays: creditCardLongestArrearDays,
            creditCardArrearCount: creditCardArrearCount
        }

        return res;
    }
}