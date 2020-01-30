module.exports = function LoanDetailNode(params, totalFiLoanVND, totalFiLoanUSD) {
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

    this.cicFiCodeName = OGZ_CD + '-' + OGZ_NM;
    this.recentReportDate = RCT_RPT_DATE ? RCT_RPT_DATE : null;
    this.shortTermLoanVnd = ST_LOAN_VND ? ST_LOAN_VND : "";
    this.shortTermLoanUsd = ST_LOAN_USD ? ST_LOAN_USD : "";
    this.shortTermNormalLoanVnd = ST_NORM_LOAN_VND ? ST_NORM_LOAN_VND : "";
    this.shortTermNormalLoanUsd = ST_NORM_LOAN_USD ? ST_NORM_LOAN_USD : "";
    this.shortTermCautiousLoanVnd = ST_CAT_LOAN_VND ? ST_CAT_LOAN_VND : "";
    this.shortTermCautiousLoanUsd = ST_CAT_LOAN_USD ? ST_CAT_LOAN_USD : "";
    this.shortTermFixedLoanVnd = ST_FIX_LOAN_VND ? ST_FIX_LOAN_VND : "";
    this.shortTermFixedLoanUsd = ST_FIX_LOAN_USD ? ST_FIX_LOAN_USD : "";
    this.shortTermDaubtLoanVnd = ST_CQ_LOAN_VND ? ST_CQ_LOAN_VND : "";
    this.shortTermDaubtLoanUsd = ST_CQ_LOAN_USD ? ST_CQ_LOAN_USD : "";
    this.shortTermEstLossLoanVnd = ST_EL_LOAN_VND ? ST_EL_LOAN_VND : "";
    this.shortTermEstLossLoanUsd = ST_EL_LOAN_USD ? ST_EL_LOAN_USD : "";
    this.midTermLoadnInVnd = MT_LOAN_VND ? MT_LOAN_VND : "";
    this.midTermLoadnInUsd = MT_LOAN_UDS ? MT_LOAN_UDS : "";
    this.midTermNormalLoanVnd = MT_NORM_LOAN_VND ? MT_NORM_LOAN_VND : "";
    this.midTermNormalLoanUsd = MT_NORM_LOAN_USD ? MT_NORM_LOAN_USD : "";
    this.midTermCautiousLoanVnd = MT_CAT_LOAN_VND ? MT_CAT_LOAN_VND : "";
    this.midTermCautiousLoanUsd = MT_CAT_LOAN_USD ? MT_CAT_LOAN_USD : "";
    this.midTermFixedLoanVnd = MT_FIX_LOAN_VND ? MT_FIX_LOAN_VND : "";
    this.midTermFixedLoanUsd = MT_FIX_LOAN_USD ? MT_FIX_LOAN_USD : "";
    this.midTermDaubtLoanVnd = MT_CQ_LOAN_VND ? MT_CQ_LOAN_VND : "";
    this.midTermDaubtLoanUsd = MT_CQ_LOAN_USD ? MT_CQ_LOAN_USD : "";
    this.midTermEstLossLoanVnd = MT_EL_LOAN_VND ? MT_EL_LOAN_VND : "";
    this.midTermEstLossLoanUsd = MT_EL_LOAN_USD ? MT_EL_LOAN_USD : "";
    this.longTermLoanVnd = LT_LOAN_VND ? LT_LOAN_VND : "";
    this.longTermLoanUsd = LT_LOAN_USD ? LT_LOAN_USD : "";
    this.longTermNormalLoanVnd = LT_NORM_LOAN_VND ? LT_NORM_LOAN_VND : "";
    this.longTermNormalLoanUsd = LT_NORM_LOAN_USD ? LT_NORM_LOAN_USD : "";
    this.longTermCautiousLoanVnd = LT_CAT_LOAN_VND ? LT_CAT_LOAN_VND : "";
    this.longTermCautiousLoanUsd = LT_CAT_LOAN_USD ? LT_CAT_LOAN_USD : "";
    this.longTermFixedLoanVnd = LT_FIX_LOAN_VND ? LT_FIX_LOAN_VND : "";
    this.longTermfixedLoanUsd = LT_FIX_LOAN_USD ? LT_FIX_LOAN_USD : "";
    this.longTermDaubtLoanVnd = LT_CQ_LOAN_VND ? LT_CQ_LOAN_VND : "";
    this.longTermDaubtLOanUsd = LT_CQ_LOAN_USD ? LT_CQ_LOAN_USD : "";
    this.longTermEstLossLoanVnd = LT_EL_LOAN_VND ? LT_EL_LOAN_VND : "";
    this.longTermEstLossLoanUsd = LT_EL_LOAN_USD ? LT_EL_LOAN_USD : "";
    this.otherLoanVnd = OTR_LOAN_VND ? OTR_LOAN_VND : "";
    this.otherLoanUsd = OTR_LOAN_USD ? OTR_LOAN_USD : "";
    this.otherNormalLoanVnd = OTR_NORM_LOAN_VND ? OTR_NORM_LOAN_VND : "";
    this.otherNormalLoanUsd = OTR_NORM_LOAN_USD ? OTR_NORM_LOAN_USD : "";
    this.otherCautousLoanVnd = OTR_CAT_LOAN_VND ? OTR_CAT_LOAN_VND : "";
    this.otherCautousLoanUsd = OTR_CAT_LOAN_USD ? OTR_CAT_LOAN_USD : "";
    this.otherFixedLoanVnd = OTR_FIX_LOAN_VND ? OTR_FIX_LOAN_VND : "";
    this.otherFixedLoanUsd = OTR_FIX_LOAN_USD ? OTR_FIX_LOAN_USD : "";
    this.otherDaubtLoanVnd = OTR_CQ_LOAN_VND ? OTR_CQ_LOAN_VND : "";
    this.otherDaubtLoanUsd = OTR_CQ_LOAN_USD ? OTR_CQ_LOAN_USD : "";
    this.otherEstLossLoanVnd = OTR_EL_LOAN_VND ? OTR_EL_LOAN_VND : "";
    this.otherEstLossLoanUsd = OTR_EL_LOAN_USD ? OTR_EL_LOAN_USD : "";
    this.otherBadLoanVnd = OTR_BAD_LOAN_VND ? OTR_BAD_LOAN_VND : "";
    this.otherbadLoanUsd = OTR_BAD_LOAN_USD ? OTR_BAD_LOAN_USD : "";
    this.totalLoanVnd = OGZ_TOT_LOAN_VND ? OGZ_TOT_LOAN_VND : "";
    this.totalLoanUsd = OGZ_TOT_LOAN_USD ? OGZ_TOT_LOAN_USD : "";
}