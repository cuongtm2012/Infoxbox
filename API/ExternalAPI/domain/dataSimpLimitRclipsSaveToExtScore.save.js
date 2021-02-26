const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
module.exports = function dataSimpleLimitRclipsSaveToExtScore(niceSessionKey,rclipsResult, phoneNumber) {
    this.NICE_SSIN_ID = niceSessionKey;
    this.TEL_NO_MOBILE = phoneNumber;
    this.SCORE_CD = responCode.ScoreCode.NOK_SPL_LIMIT;
    this.BASE_DATE = dateutil.getCurrentInquiryDate();
    this.CUST_GB = responCode.CUST_GB.NICE;
    this.SYSTEM_DTIM = dateutil.timeStamp();
    this.FINAL_LIMIT = rclipsResult.OT010;
}