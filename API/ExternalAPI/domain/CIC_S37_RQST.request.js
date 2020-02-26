const dateutil = require('../util/dateutil');

module.exports = function CIC_S37_RQSTRequest(parameters, password, niceSessionKey) {
    const { fiSessionKey,
        fiCode,
        taskCode,
        loginId,
        loginPw,
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
    this.taxCode = taxCode ? taxCode : null;
    this.natId = natId ? natId : null;
    this.oldNatId = oldNatId ? oldNatId : null;
    this.passportNumber = passportNumber ? passportNumber : null;
    this.cicId = cicId ? cicId : null;
    this.inquiryDate = inquiryDate ? inquiryDate : dateutil.getCurrentInquiryDate();
    this.infoProvConcent = infoProvConcent.toUpperCase();
    this.niceSessionKey = niceSessionKey;

};
