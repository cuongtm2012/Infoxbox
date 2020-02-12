module.exports = function CIC_MACR_RSLTResponse(cicMacrRSLTRequest, response, outputScrpTranlog, outputCicrptMain, outputCicMRPT) {
    
    const {
        fiSessionKey,
        fiCode,
        taskCode,
        niceSessionKey,
        inquiryDate
    } = cicMacrRSLTRequest;

    const {
        responseTime,
        responseCode,
        responseMessage
    } = response;

    const {
        S_REQ_STATUS,
        SCRP_STAT_CD,
        INQ_DTIM_SCRPLOG,
        SYS_DTIM
    } = outputScrpTranlog;

    const {
        PSN_NM,
        BIRTH_YMD,
        CIC_ID,
        PSN_ADDR,
        TEL_NO_MOLBILE,
        NATL_ID
    } = outputCicrptMain;

    const{
        SCORE,
        GRADE,
        BASE_DATE,
        CC_BAL,
        REL_OGZ_LIST,
    } = outputCicMRPT;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.niceSessionKey = niceSessionKey;
    this.inquiryDate = inquiryDate ? inquiryDate : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.scrapingStatusCode = SCRP_STAT_CD ? SCRP_STAT_CD : "";
    this.cicReportRequestDate = INQ_DTIM_SCRPLOG;
    this.cicReportResponseDate = SYS_DTIM;
    this.cicReportInquiryUserId = S_REQ_STATUS;
    this.name = PSN_NM ? PSN_NM : '';
    this.birth = BIRTH_YMD;
    this.cicId = CIC_ID;
    this.address = PSN_ADDR;
    this.phoneNumber = TEL_NO_MOLBILE;
    this.natId = NATL_ID;
    this.creditScore = SCORE;
    this.creditGrade = GRADE;
    this.baseDate = BASE_DATE;
    this.creditCardBalance = CC_BAL;
    this.relatedFiName = REL_OGZ_LIST;
};