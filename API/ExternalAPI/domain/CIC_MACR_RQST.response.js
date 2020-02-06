
module.exports = function CIC_MACR_RQSTResponse(cicMacrRQSTRequest, response) {

    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = response;

    const { 
        fiSessionKey,
        fiCode,
        taskCode,
        name,
        mobilePhoneNumber,
        taxCode,
        natId,
        oldNatId,
        passportNumber,
        cicId,
        inquiryDate,
        infoProvConcent
    } = cicMacrRQSTRequest;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.name = name;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.taxCode = taxCode ? taxCode : "";
    this.natId = natId ? natId : "";
    this.oldNatId = oldNatId ? oldNatId : "";
    this.passportNumber = passportNumber ? passportNumber : "";
    this.cicId = cicId ? cicId : "";
    this.inquiryDate = inquiryDate ? inquiryDate : "" ;
    this.infoProvConcent = infoProvConcent;
<<<<<<< HEAD
    this.niceSessionKey = niceSessionKey;
=======
>>>>>>> 73267f640f715f994e1212c0f469574e0f31d20c
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";

};