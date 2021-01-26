const convertMilionUnit = require('../../shared/util/convertUnit');
const util = require('../../shared/util/util');

module.exports = function CIC_MACR_RSLTResponse(cicMacrRSLTRequest, response, dataRes) {

    const {
        responseTime,
        responseCode,
        responseMessage
    } = response;

    const {
        SCRP_STAT_CD,
        INQ_DTIM,
        SYS_DTIM,
        PSN_NM,
        BIRTH_YMD,
        CIC_ID,
        PSN_ADDR,
        NATL_ID,
        TEL_NO_MOBILE,
        SCORE,
        GRADE,
        BASE_DATE,
        CC_BAL,
        REL_OGZ_LIST
    } = dataRes;

    const {
        fiSessionKey,
        fiCode,
        taskCode,
        niceSessionKey,
        inquiryDate

    } = cicMacrRSLTRequest;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.niceSessionKey = niceSessionKey;
    this.inquiryDate = inquiryDate ? inquiryDate : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.scrapingStatusCode = SCRP_STAT_CD ;
    this.cicReportRequestDate = INQ_DTIM;
    this.cicReportResponseDate = SYS_DTIM ? SYS_DTIM.substring(0, 8) : SYS_DTIM;
    this.name = PSN_NM;
    this.dateOfBirth = util.convertDateType(BIRTH_YMD);
    this.cicId = CIC_ID;
    this.address = PSN_ADDR;
    this.phoneNumber = TEL_NO_MOBILE;
    this.natId = NATL_ID;
    this.creditScore = SCORE
    this.creditGrade = GRADE;
    this.baseDate = util.convertDateType(BASE_DATE);
    this.creditCardBalance = convertMilionUnit.milionUnit(CC_BAL);
    this.relatedFiName = REL_OGZ_LIST;
};

