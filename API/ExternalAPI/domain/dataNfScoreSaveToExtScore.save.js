const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
module.exports = function dataNfSCoreRclipsSaveToExtScore(niceSessionKey,rclipsResult, phoneNumber) {
    this.NICE_SSIN_ID = niceSessionKey;
    this.TEL_NO_MOBILE = phoneNumber;
    this.SCORE_CD = responCode.ScoreCode.NOK100_001;
    this.SCORE_EXT = rclipsResult.OT003;
    this.GRADE = rclipsResult.OT009;
    this.BASE_DATE = dateutil.getCurrentInquiryDate();
    this.CUST_GB = responCode.CUST_GB.NICE;
    this.SYSTEM_DTIM = dateutil.timeStamp();
    this.FINAL_APPROVAL = rclipsResult.OT011;
}