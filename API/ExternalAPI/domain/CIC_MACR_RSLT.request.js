function CIC_MACR_RSLT_Request(requestParams) {
    const {
        fiSessionKey,
        fiCode,
        taskCode,
        niceSessionKey,
        inquiryDate

    } = requestParams;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.niceSessionKey = niceSessionKey;
    this.inquiryDate = inquiryDate ? inquiryDate : "";
}

export default CIC_MACR_RSLT_Request;