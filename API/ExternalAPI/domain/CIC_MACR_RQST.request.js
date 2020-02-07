module.exports = function CIC_MACR_RQSTRequest(parameters, niceSessionKey) {
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
    } = parameters;

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
    this.niceSessionKey = niceSessionKey;


};
