
module.exports = function CIC_S11A_RQSTRequest(parameters, password, niceSessionKey) {
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
    this.loginPw = password ? password : loginPw;
    this.cicGoodCode = cicGoodCode;
    this.taxCode = taxCode;
    this.natId = natId;
    this.oldNatId = oldNatId;
    this.passportNumber = passportNumber;
    this.cicId = cicId;
    this.inquiryDate = inquiryDate ;
    this.infoProvConcent = infoProvConcent;
    this.niceSessionKey = niceSessionKey;

};
