import convertMilionUnit from '../../../shared/util/convertUnit.js';

const loan12MInfor = {
    Loan12MInfo: function (params) {
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
}

export default loan12MInfor;