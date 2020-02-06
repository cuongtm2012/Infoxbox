
module.exports = function CIC_S11A_RQSTResponse(cics11aRQSTRequest, response) {

    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = response;

    const { fiSessionKey,
        fiCode,
        taskCode,
        loginId,
        cicGoodCode,
        taxCode,
        natId,
        oldNatId,
        passportNumber,
        cicId,
        inquiryDate,
        infoProvConcent
    } = cics11aRQSTRequest;

    this.fiSessionKey = fiSessionKey;
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.loginId = loginId;
    this.cicGoodCode = cicGoodCode;
    this.taxCode = taxCode;
    this.natId = natId;
    this.oldNatId = oldNatId;
    this.passportNumber = passportNumber;
    this.cicId = cicId;
    this.inquiryDate = inquiryDate;
    this.infoProvConcent = infoProvConcent;
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";

};

