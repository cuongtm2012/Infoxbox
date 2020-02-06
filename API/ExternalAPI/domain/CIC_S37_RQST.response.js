// var BaseResponse = require('./Base.response');
var cics37RQSTReq = require('./CIC_S37_RQST.request');

module.exports = function CIC_S37_RQSTResponse(cics37RQSTRequest, response) {

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
    } = cics37RQSTRequest;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.loginId = loginId;
    this.cicGoodCode = cicGoodCode;
    this.taxCode = taxCode ? taxCode : "";
    this.natId = natId ? natId : "";
    this.oldNatId = oldNatId ? oldNatId : "";
    this.passportNumber = passportNumber ? passportNumber : "";
    this.cicId = cicId ? cicId : "";
    this.inquiryDate = inquiryDate ? inquiryDate : "";
    this.infoProvConcent = infoProvConcent;
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";

};

