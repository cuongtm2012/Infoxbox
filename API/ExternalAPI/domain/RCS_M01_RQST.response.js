module.exports = function RCS_M01_RQSTResponse(RCS_M01_RQSTRequest, preResponse) {

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
        productCode,
        natId,
        nfNiceSessionKey,
		cicNiceSessionKey,
        mobilePhoneNumber,
        infoProvConcent
    } = RCS_M01_RQSTRequest;

    this.appNumber = appNumber ? appNumber : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.customerNumber = customerNumber;
    this.productCode = productCode;
    this.nfNiceSessionKey = nfNiceSessionKey;
    this.cicNiceSessionKey = cicNiceSessionKey;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.natId = natId;
    this.infoProvConcent = infoProvConcent;
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
};


