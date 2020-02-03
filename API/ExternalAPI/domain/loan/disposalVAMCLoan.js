const validation = require('../../../shared/util/validation');

module.exports = function DisposalVamcLoan(params) {
    const {
        SELL_OGZ_NM,
        PRCP_BAL,
        DATA_RPT_DATE
    } = params;

    this.disposalFiName = SELL_OGZ_NM;
    this.originalBalance = PRCP_BAL;
    this.dataReportingDate = validation.formatDateVN(DATA_RPT_DATE);
}