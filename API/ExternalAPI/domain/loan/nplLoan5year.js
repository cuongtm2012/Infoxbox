import convertMilionUnit from '../../../shared/util/convertUnit.js';

const npl5YLoan = {
    NPLLoan5Year: function (params) {
        const {
            OGZ_NM_BRANCH_NM,
            RCT_OCR_DATE,
            DEBT_GRP,
            AMT_VND,
            AMT_USD
        } = params;

        this.fiName = OGZ_NM_BRANCH_NM;
        this.recentOccurrenceDate = RCT_OCR_DATE;
        this.debitGroup = DEBT_GRP;
        this.amountVnd = convertMilionUnit.milionUnit(AMT_VND);
        this.amountUsd = convertMilionUnit.milionUnit(AMT_USD);

    }
}

export default npl5YLoan;