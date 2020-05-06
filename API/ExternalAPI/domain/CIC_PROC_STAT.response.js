
module.exports = function CIC_PROC_StatusResponse(cicsProcStatRequest, response, responseCount, dataRes, totalCount) {

    const {
        responseTime,
        responseCode,
        responseMessage
    } = response;
    const {
        fiCode,
        taskCode,
        searchDateFrom,
        searchDateTo,
        scrapingStatusCode,
        offset,
        maxnumrows
    } = cicsProcStatRequest;

    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.searchDateFrom = searchDateFrom;
    this.searchDateTo = searchDateTo;
    this.scrapingStatusCode = scrapingStatusCode;
    this.offset = offset;
    this.maximumrows = maxnumrows;
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.responseCount = responseCount ? responseCount : null;
    this.totalCount = totalCount;
    this.cicReportStatus = dataRes ? dataRes : '';


};

