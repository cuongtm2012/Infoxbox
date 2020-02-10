
module.exports = function CIC_PROC_StatusResponse(cicsProcStatRequest, response, responseCount, dataRes) {

    const {
        responseTime,
        responseCode,
        responseMessage
    } = response;
    const {
        fiCode,
        taskCode,
        searchDateFrom,
        searchDateTo
    } = cicsProcStatRequest;

    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.searchDateFrom = searchDateFrom;
    this.searchDateTo = searchDateTo;
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.responseCount = responseCount ? responseCount : 0;
    this.cicReportStatus = dataRes ? dataRes : '';


};

