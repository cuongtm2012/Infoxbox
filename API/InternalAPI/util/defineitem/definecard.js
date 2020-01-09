const constant = require('./consant');
const _ = require('lodash');

module.exports = {
    getContent: function (req) {
        var totCreditCardLimit, totAmountCardPayment, totAmountCardPaymentDelay, creditCardNumber, nameOfCardIssuer;

        _.forEach(req, res => {
            _.forEach(res, function (value, key) {
                if (_.isEqual(_.startCase(value), _.startCase(constant.CARDDEFINEBALANCE.TOTCreditCardLimit.name))) {
                    totCreditCardLimit = res.content;
                    console.log('totCreditCardLimit', totCreditCardLimit);
                }
                if (_.isEqual(_.startCase(value), _.startCase(constant.CARDDEFINEBALANCE.TOTAmountCardPayment.name))) {
                    totAmountCardPayment = res.content;
                }
                if (_.isEqual(_.startCase(value), _.startCase(constant.CARDDEFINEBALANCE.TOTAmountCardPaymentDeplay.name))) {
                    totAmountCardPaymentDelay = res.content;
                }
                if (_.isEqual(_.startCase(value), _.startCase(constant.CARDDEFINEBALANCE.CreditCardNumber.name))) {
                    creditCardNumber = res.content;
                }
                if (_.isEqual(_.startCase(value), _.startCase(constant.CARDDEFINEBALANCE.NameOfCardIssuer.name))) {
                    nameOfCardIssuer = res.content;
                }
            });
        });

        return { totCreditCardLimit: totCreditCardLimit, totAmountCardPayment: totAmountCardPayment, totAmountCardPaymentDelay: totAmountCardPaymentDelay, creditCardNumber: creditCardNumber, nameOfCardIssuer: nameOfCardIssuer };

    }
}