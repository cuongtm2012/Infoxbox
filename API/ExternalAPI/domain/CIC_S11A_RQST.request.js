const dateutil = require('../util/dateutil');

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

    this.fiSessionKey = fiSessionKey ? fiSessionKey : null;
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.loginId = loginId;
    this.loginPw = password ? password : loginPw;
    this.cicGoodCode = cicGoodCode;
    this.taxCode = taxCode ? taxCode : null;
    this.natId = natId ? natId : null;
    this.oldNatId = oldNatId ? oldNatId : null;
    this.passportNumber = passportNumber ? passportNumber : null;
    this.cicId = cicId ? cicId : null;
    this.inquiryDate = inquiryDate ? inquiryDate : dateutil.getCurrentInquiryDate();
    this.infoProvConcent = infoProvConcent.toUpperCase();
    this.niceSessionKey = niceSessionKey;

};
