module.exports = function NFScoreOKResponseWithScore(Request, preResponse, resultRclips) {
    var mockupResult = Math.floor(Math.random() * 10) + 1;
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = preResponse;

    const {
        appNumber,
        fiCode,
        taskCode,
        customerNumber,
        scoreProduct,
        mobilePhoneNumber,
        natId,
        infoProvConcent
    } = Request;

    this.appNumber = appNumber ? appNumber : "";
    this.fiCode = fiCode ? fiCode : "";
    this.taskCode = taskCode ? taskCode : "";
    this.customerNumber = customerNumber ? customerNumber : "";
    this.scoreProduct = scoreProduct ? scoreProduct : "";
    this.mobilePhoneNumber = mobilePhoneNumber ? mobilePhoneNumber : "";
    this.natId = natId ? natId : "";
    this.infoProvConcent = infoProvConcent ? infoProvConcent : "";
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.nfGrade = resultRclips.listResult.OT009.toString();
    this.cutoffResult = resultRclips.listResult.OT008;
}
