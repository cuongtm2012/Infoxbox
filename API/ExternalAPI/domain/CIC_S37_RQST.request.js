
module.exports = function CIC_S37_RQSTRequest(parameters, password, niceSessionKey) {
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

    this.fiSessionKey = fiSessionKey ? fiSessionKey : null;
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.loginId = loginId;
    this.loginPw = password ? password : loginPw;
    this.cicGoodCode = cicGoodCode ? cicGoodCode : null;
    this.taxCode = taxCode ? taxCode : null;
    this.natId = natId ? natId : null;
    this.oldNatId = oldNatId ? oldNatId : null;
    this.passportNumber = passportNumber ? passportNumber : null;
    this.cicId = cicId ? cicId : null;
    this.inquiryDate = inquiryDate ? inquiryDate : null;
    this.infoProvConcent = infoProvConcent;
    this.niceSessionKey = niceSessionKey;

};
