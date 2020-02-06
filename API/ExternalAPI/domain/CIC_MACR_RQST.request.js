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
<<<<<<< HEAD
    this.name = name; 
=======
    this.name = name;
>>>>>>> 73267f640f715f994e1212c0f469574e0f31d20c
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
