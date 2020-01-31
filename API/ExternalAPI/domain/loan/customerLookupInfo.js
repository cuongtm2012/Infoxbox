module.exports = function CustomerLookupInfo(params) {
    const {
        OGZ_NM_BRANCH_NM,
        OGZ_CD,
        INQ_GDS,
        INQ_DATE,
        INQ_TIME
    } = params;

    this.fiName = OGZ_NM_BRANCH_NM ? OGZ_NM_BRANCH_NM : '';
    this.cicFiCode = OGZ_CD ? OGZ_CD : '';
    this.inquiryProduct = INQ_GDS ? INQ_GDS : '';
    this.inquiryDate = INQ_DATE ? INQ_DATE : '';
    this.inquiryTime = INQ_TIME ? INQ_TIME : '';

}