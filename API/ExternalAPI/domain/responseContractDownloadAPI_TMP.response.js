module.exports = function responseContractDownloadApi(Request, preResponse, dataGetStructure) {
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = preResponse;

    const {
        fiCode,
        taskCode,
        loginId,
        id
    } = Request;

    this.fiCode = fiCode ? fiCode : "";
    this.taskCode = taskCode ? taskCode : "";
    this.loginId = loginId ? loginId : "";
    this.id = id ? id : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
}