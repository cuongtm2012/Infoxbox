module.exports = function statusOfContractResponseWithResult(Request, preResponse, status) {
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
        id
    } = Request;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode ? fiCode : "";
    this.taskCode = taskCode ? taskCode : "";
    this.id = id ? id : "";
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    switch (status) {
        case 'processing':
            this.contractStatus = 'Processing';
            break;
        case 'draft':
            this.contractStatus = 'Draft';
            break;
        case 'completed':
            this.contractStatus = 'Completed';
            break;
        case 'voided':
            this.contractStatus = 'Voided';
            break;
        case 'rejected':
            this.contractStatus = 'Rejected';
            break;
        case 'dueDate':
            this.contractStatus = 'DueDate';
            break;
        default:
            this.contractStatus = status;
            break;
    }
}