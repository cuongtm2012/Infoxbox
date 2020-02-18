const dateutil = require('../util/dateutil');

module.exports = function DataInqLogSave(params, respCd) {
    const {
        fiSessionKey,
        fiCode,
        taskCode,
        niceSessionKey,
        inquiryDate,
        natId,
        taxCode,
        oldNatId,
        passportNumber,
        cicId,
        infoProvConcent
    } = params;

    this.niceSessionKey = niceSessionKey ? niceSessionKey.substring(5, 25) : dateutil.timeStamp();
    this.fiCode = fiCode ? fiCode : null;
    this.taskCode = taskCode ? taskCode : null;
    this.natId = natId ? natId : null;
    this.taxCode = taxCode ? taxCode : null;
    this.oldNatId = oldNatId ? oldNatId : null;
    this.passportNumber = passportNumber ? passportNumber : null;
    this.cicId = cicId ? cicId : null;
    this.inquiryDate = inquiryDate ? inquiryDate : null;
    this.infoProvConcent = infoProvConcent ? infoProvConcent : null;
    this.respCd = respCd ? respCd : null;
}