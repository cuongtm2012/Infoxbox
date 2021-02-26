const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
module.exports = function dataMainScoreRclipsSaveToExtScore(niceSessionKey,rclipsResult, phoneNumber) {
    this.NICE_SSIN_ID = niceSessionKey;
    this.TEL_NO_MOBILE = phoneNumber;
    this.SCORE_CD = responCode.ScoreCode.NOK200_001;
    this.SCORE_EXT = rclipsResult.OT005;
    this.GRADE = rclipsResult.OT006;
    this.RSK_GLM_PROB = rclipsResult.OT020;
    this.RSK_RF_PROB = rclipsResult.OT021;
    this.RSK_GRB_PROB = rclipsResult.OT022;
    this.RSK_ESB_PROB = rclipsResult.OT023;
    this.BASE_DATE = dateutil.getCurrentInquiryDate();
    this.CUST_GB = responCode.CUST_GB.NICE;
    this.SYSTEM_DTIM = dateutil.timeStamp();
    this.FINAL_LIMIT = rclipsResult.OT010;
    this.FINAL_APPROVAL = rclipsResult.OT011;
}