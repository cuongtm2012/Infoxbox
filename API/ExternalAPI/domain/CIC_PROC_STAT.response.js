
function CIC_PROC_StatusResponse(cicsProcStatRequest, response, responseCount, dataRes, totalCount) {

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
    this.responseTime = responseTime ? responseTime : null;
    this.responseCode = responseCode ? responseCode : null;
    this.responseMessage = responseMessage ? responseMessage : null;
    this.responseCount = responseCount ? responseCount : null;
    this.totalCount = totalCount ? totalCount : null;
    this.cicReportStatus = dataRes ? dataRes : null;


}

export default CIC_PROC_StatusResponse;

