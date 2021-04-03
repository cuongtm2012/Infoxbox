import convertMilionUnit from '../../../shared/util/convertUnit.js';

export function disposalLoanNode(params) {
    const {
        SELL_OGZ_NM,
        PRCP_BAL,
        DATA_RPT_DATE
    } = params;

    this.disposalFiName = SELL_OGZ_NM;
    this.originalBalance = convertMilionUnit.milionUnit(PRCP_BAL);
    this.dataReportingDate = DATA_RPT_DATE;
}