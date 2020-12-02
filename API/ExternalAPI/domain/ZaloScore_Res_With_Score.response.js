module.exports = function zaloScoreResponseWithScore(zaloScoreRequest, preResponse, score , zaloRequestId) {
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = preResponse;

    const {
        fiSeesionKey,
        fiCode,
        taskCode,
        mobilePhoneNumber,
        scoreProduct,
        inquiryPurpose,
        infoProvConcent
    } = zaloScoreRequest;

    this.fiSessionKey = fiSeesionKey ? fiSeesionKey : "";
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
    this.scoreCode = 'NZ0100_001';
    this.score = score;
    this.zaloRequestId = zaloRequestId;
}
