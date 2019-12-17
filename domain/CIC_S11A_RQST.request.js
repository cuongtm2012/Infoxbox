
module.exports = function CIC_S11A_RQSTRequest(parameters) {
    const { fiSessionKey,
        fiCode,
        taskCode,
        loginId,
        loginPw,
        cicGoodCode,
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
    this.loginId = loginId;
    this.loginPw = loginPw;
    this.userPw = loginPw;
    this.cicGoodCode = cicGoodCode;
    this.taxCode = taxCode;
    this.natId = natId;
    this.oldNatId = oldNatId;
    this.passportNumber = passportNumber;
    this.cicId = cicId;
    this.inquiryDate = inquiryDate ;
    this.infoProvConcent = infoProvConcent;

};
