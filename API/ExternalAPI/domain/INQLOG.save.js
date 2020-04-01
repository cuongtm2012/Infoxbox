const dateutil = require('../util/dateutil');
const _ = require('lodash');
const responseCode = require('../../shared/constant/responseCodeExternal');

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
        infoProvConcent,
        mobilePhoneNumber
    } = params;

    let _niceSessionKey;
    let _oldNatId = oldNatId ? oldNatId : mobilePhoneNumber;

    if (!_.isEmpty(niceSessionKey) && (_.isEqual(responseCode.TaskCode.CIC_S11A_RQST.code, taskCode) || _.isEqual(responseCode.TaskCode.CIC_S37_RQST.code, taskCode) || _.isEqual(responseCode.TaskCode.CIC_MACR_RQST.code, taskCode)))
        _niceSessionKey = niceSessionKey;
    else if (!_.isEmpty(niceSessionKey))
        _niceSessionKey = niceSessionKey.substring(5, 25);
    else
        _niceSessionKey = 'E' + dateutil.timeStamp();

    this.niceSessionKey = _niceSessionKey;
    this.fiCode = fiCode ? fiCode.substring(0, 100) : null;
    this.taskCode = taskCode ? taskCode.substring(0, 100) : null;
    this.natId = natId ? natId : null;
    this.taxCode = taxCode ? taxCode : null;
    this.oldNatId = _oldNatId ? _oldNatId : null;
    this.passportNumber = passportNumber ? passportNumber : null;
    this.cicId = cicId ? cicId : null;
    this.inquiryDate = inquiryDate ? inquiryDate : null;
    this.infoProvConcent = infoProvConcent ? infoProvConcent : null;
    this.respCd = respCd ? respCd : null;
}