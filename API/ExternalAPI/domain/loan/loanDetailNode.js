import convertMilionUnit from '../../../shared/util/convertUnit.js';

const LoanDetailNode = {
    LoanDetailNode: function (params) {
        const {
            OGZ_CD,
            OGZ_NM,
            RCT_RPT_DATE,
            ST_LOAN_VND,
            ST_LOAN_USD,
            ST_NORM_LOAN_VND,
            ST_NORM_LOAN_USD,
            ST_CAT_LOAN_VND,
            ST_CAT_LOAN_USD,
            ST_FIX_LOAN_VND,
            ST_FIX_LOAN_USD,
            ST_CQ_LOAN_VND,
            ST_CQ_LOAN_USD,
            ST_EL_LOAN_VND,
            ST_EL_LOAN_USD,
            MT_LOAN_VND,
            MT_LOAN_UDS,
            MT_NORM_LOAN_VND,
            MT_NORM_LOAN_USD,
            MT_CAT_LOAN_VND,
            MT_CAT_LOAN_USD,
            MT_FIX_LOAN_VND,
            MT_FIX_LOAN_USD,
            MT_CQ_LOAN_VND,
            MT_CQ_LOAN_USD,
            MT_EL_LOAN_VND,
            MT_EL_LOAN_USD,
            LT_LOAN_VND,
            LT_LOAN_USD,
            LT_NORM_LOAN_VND,
            LT_NORM_LOAN_USD,
            LT_CAT_LOAN_VND,
            LT_CAT_LOAN_USD,
            LT_FIX_LOAN_VND,
            LT_FIX_LOAN_USD,
            LT_CQ_LOAN_VND,
            LT_CQ_LOAN_USD,
            LT_EL_LOAN_VND,
            LT_EL_LOAN_USD,
            OTR_LOAN_VND,
            OTR_LOAN_USD,
            OTR_NORM_LOAN_VND,
            OTR_NORM_LOAN_USD,
            OTR_CAT_LOAN_VND,
            OTR_CAT_LOAN_USD,
            OTR_FIX_LOAN_VND,
            OTR_FIX_LOAN_USD,
            OTR_CQ_LOAN_VND,
            OTR_CQ_LOAN_USD,
            OTR_EL_LOAN_VND,
            OTR_EL_LOAN_USD,
            OTR_BAD_LOAN_VND,
            OTR_BAD_LOAN_USD,
            OGZ_TOT_LOAN_VND,
            OGZ_TOT_LOAN_USD
        } = params;

        this.cicFiCode = OGZ_CD ? OGZ_CD : '';
        this.cicFiName = OGZ_NM ? OGZ_NM : '';
        this.recentReportDate = RCT_RPT_DATE;
        this.shortTermLoanVnd = convertMilionUnit.milionUnit(ST_LOAN_VND);
        this.shortTermLoanUsd = convertMilionUnit.milionUnit(ST_LOAN_USD);
        this.shortTermNormalLoanVnd = convertMilionUnit.milionUnit(ST_NORM_LOAN_VND);
        this.shortTermNormalLoanUsd = convertMilionUnit.milionUnit(ST_NORM_LOAN_USD);
        this.shortTermCautiousLoanVnd = convertMilionUnit.milionUnit(ST_CAT_LOAN_VND);
        this.shortTermCautiousLoanUsd = convertMilionUnit.milionUnit(ST_CAT_LOAN_USD);
        this.shortTermFixedLoanVnd = convertMilionUnit.milionUnit(ST_FIX_LOAN_VND);
        this.shortTermFixedLoanUsd = convertMilionUnit.milionUnit(ST_FIX_LOAN_USD);
        this.shortTermDaubtLoanVnd = convertMilionUnit.milionUnit(ST_CQ_LOAN_VND);
        this.shortTermDaubtLoanUsd = convertMilionUnit.milionUnit(ST_CQ_LOAN_USD);
        this.shortTermEstLossLoanVnd = convertMilionUnit.milionUnit(ST_EL_LOAN_VND);
        this.shortTermEstLossLoanUsd = convertMilionUnit.milionUnit(ST_EL_LOAN_USD);
        this.midTermLoadnInVnd = convertMilionUnit.milionUnit(MT_LOAN_VND);
        this.midTermLoadnInUsd = convertMilionUnit.milionUnit(MT_LOAN_UDS);
        this.midTermNormalLoanVnd = convertMilionUnit.milionUnit(MT_NORM_LOAN_VND);
        this.midTermNormalLoanUsd = convertMilionUnit.milionUnit(MT_NORM_LOAN_USD);
        this.midTermCautiousLoanVnd = convertMilionUnit.milionUnit(MT_CAT_LOAN_VND);
        this.midTermCautiousLoanUsd = convertMilionUnit.milionUnit(MT_CAT_LOAN_USD);
        this.midTermFixedLoanVnd = convertMilionUnit.milionUnit(MT_FIX_LOAN_VND);
        this.midTermFixedLoanUsd = convertMilionUnit.milionUnit(MT_FIX_LOAN_USD);
        this.midTermDaubtLoanVnd = convertMilionUnit.milionUnit(MT_CQ_LOAN_VND);
        this.midTermDaubtLoanUsd = convertMilionUnit.milionUnit(MT_CQ_LOAN_USD);
        this.midTermEstLossLoanVnd = convertMilionUnit.milionUnit(MT_EL_LOAN_VND);
        this.midTermEstLossLoanUsd = convertMilionUnit.milionUnit(MT_EL_LOAN_USD);
        this.longTermLoanVnd = convertMilionUnit.milionUnit(LT_LOAN_VND);
        this.longTermLoanUsd = convertMilionUnit.milionUnit(LT_LOAN_USD);
        this.longTermNormalLoanVnd = convertMilionUnit.milionUnit(LT_NORM_LOAN_VND);
        this.longTermNormalLoanUsd = convertMilionUnit.milionUnit(LT_NORM_LOAN_USD);
        this.longTermCautiousLoanVnd = convertMilionUnit.milionUnit(LT_CAT_LOAN_VND);
        this.longTermCautiousLoanUsd = convertMilionUnit.milionUnit(LT_CAT_LOAN_USD);
        this.longTermFixedLoanVnd = convertMilionUnit.milionUnit(LT_FIX_LOAN_VND);
        this.longTermfixedLoanUsd = convertMilionUnit.milionUnit(LT_FIX_LOAN_USD);
        this.longTermDaubtLoanVnd = convertMilionUnit.milionUnit(LT_CQ_LOAN_VND);
        this.longTermDaubtLOanUsd = convertMilionUnit.milionUnit(LT_CQ_LOAN_USD);
        this.longTermEstLossLoanVnd = convertMilionUnit.milionUnit(LT_EL_LOAN_VND);
        this.longTermEstLossLoanUsd = convertMilionUnit.milionUnit(LT_EL_LOAN_USD);
        this.otherLoanVnd = convertMilionUnit.milionUnit(OTR_LOAN_VND);
        this.otherLoanUsd = convertMilionUnit.milionUnit(OTR_LOAN_USD);
        this.otherNormalLoanVnd = convertMilionUnit.milionUnit(OTR_NORM_LOAN_VND);
        this.otherNormalLoanUsd = convertMilionUnit.milionUnit(OTR_NORM_LOAN_USD);
        this.otherCautousLoanVnd = convertMilionUnit.milionUnit(OTR_CAT_LOAN_VND);
        this.otherCautousLoanUsd = convertMilionUnit.milionUnit(OTR_CAT_LOAN_USD);
        this.otherFixedLoanVnd = convertMilionUnit.milionUnit(OTR_FIX_LOAN_VND);
        this.otherFixedLoanUsd = convertMilionUnit.milionUnit(OTR_FIX_LOAN_USD);
        this.otherDaubtLoanVnd = convertMilionUnit.milionUnit(OTR_CQ_LOAN_VND);
        this.otherDaubtLoanUsd = convertMilionUnit.milionUnit(OTR_CQ_LOAN_USD);
        this.otherEstLossLoanVnd = convertMilionUnit.milionUnit(OTR_EL_LOAN_VND);
        this.otherEstLossLoanUsd = convertMilionUnit.milionUnit(OTR_EL_LOAN_USD);
        this.otherBadLoanVnd = convertMilionUnit.milionUnit(OTR_BAD_LOAN_VND);
        this.otherbadLoanUsd = convertMilionUnit.milionUnit(OTR_BAD_LOAN_USD);
        this.totalLoanVnd = convertMilionUnit.milionUnit(OGZ_TOT_LOAN_VND);
        this.totalLoanUsd = convertMilionUnit.milionUnit(OGZ_TOT_LOAN_USD);
    }
}

export default LoanDetailNode;