import convertMilionUnit from '../../../shared/util/convertUnit.js';

const loan12MCat = {
    Loan12MCatious: function(params) {
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
}

export default loan12MCat;