const responCode = require('../../shared/constant/responseCodeExternal');
module.exports = function zaloScoreResponseWithScore(zaloScoreRequest, preResponse, score , zaloRequestId) {
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = preResponse;

    const {
        fiSessionKey,
        fiCode,
        taskCode,
        mobilePhoneNumber,
        scoreProduct,
        inquiryPurpose,
        infoProvConcent
    } = zaloScoreRequest;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode ? fiCode : "";
    this.taskCode = taskCode ? taskCode : "";
    this.mobilePhoneNumber = mobilePhoneNumber ? mobilePhoneNumber : "";
    this.scoreProduct = scoreProduct ? scoreProduct : "";
    this.inquiryPurpose = inquiryPurpose ? inquiryPurpose : "";
    this.infoProvConcent = infoProvConcent ? infoProvConcent : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime  = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.scoreCode = responCode.ScoreCode.zalo;
    this.score = score;
    this.zaloRequestId = zaloRequestId;
}
