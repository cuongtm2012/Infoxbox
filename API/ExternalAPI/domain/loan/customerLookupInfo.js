const validation = require('../../../shared/util/validation');

module.exports = function CustomerLookupInfo(params) {
    const {
        OGZ_NM_BRANCH_NM,
        OGZ_CD,
        INQ_GDS,
        INQ_DATE,
        INQ_TIME
    } = params;

    this.fiName = OGZ_NM_BRANCH_NM;
    this.cicFiCode = OGZ_CD;
    this.inquiryProduct = INQ_GDS;
    this.inquiryDate = validation.formatDateVN(INQ_DATE);
    this.inquiryTime = INQ_TIME;

}