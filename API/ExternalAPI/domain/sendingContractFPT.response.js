export default function sendingContractDataFPTResponse(Request, preResponse) {
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
        templateId,
        alias,
        syncType,
    } = Request;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode ? fiCode : "";
    this.taskCode = taskCode ? taskCode : "";
    this.templateId = templateId ? templateId : "";
    this.alias = alias ? alias : "";
    this.syncType = syncType ? syncType : "";
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime  = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
}