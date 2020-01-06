module.exports = function CIC_MACR_RQSTRequest(parameters) {
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

    this.fiSessionKey = fiSessionKey;
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.name = name;//add 
    this.mobilePhoneNumber = mobilePhoneNumber;//add
    this.taxCode = taxCode;
    this.natId = natId;
    this.oldNatId = oldNatId;
    this.passportNumber = passportNumber;
    this.cicId = cicId;
    this.inquiryDate = inquiryDate ;
    this.infoProvConcent = infoProvConcent;

};
