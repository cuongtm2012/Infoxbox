module.exports = function getApiStructureResponseWithoutResult(Request, preResponse) {
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = preResponse;

    const {
        fiCode,
        taskCode,
        alias
    } = Request;

    this.fiCode = fiCode ? fiCode : "";
    this.taskCode = taskCode ? taskCode : "";
    this.alias = alias ? alias : "";
    this.responseTime  = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
}