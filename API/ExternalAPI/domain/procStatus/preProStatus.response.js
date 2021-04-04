module.exports = function PreProStatusResponse(params) {

    const {
        NICE_SSIN_ID,
        CUST_SSID_ID,
        CUST_CD,
        GDS_CD,
        INQ_DTIM,
        SCRP_STAT_CD,
        RSP_CD,
        CIC_GDS_CD
    } = params;

    this.niceSessionKey = NICE_SSIN_ID;
    this.fiSessionKey = CUST_SSID_ID;
    this.fiCode = CUST_CD;
    this.niceGoodCode = GDS_CD;
    this.cicGoodCode = CIC_GDS_CD;
    this.inquiryDate = INQ_DTIM;
    this.scrapingStatusCode = SCRP_STAT_CD;
    this.responseCode = RSP_CD;
};

