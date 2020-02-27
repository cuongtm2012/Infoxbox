
const dateutil = require('../util/dateutil');

module.exports = function cicB1003Request(parameters, defaultValue, decryptPW, niceSessionKey) {
    const {
        loginId,
        natId,
        oldNatId,
        passportNumber
    } = parameters;

    const {
        appCd,
        iftUrl,
        orgCd,
        dispNm,
        customerType,
        reportType,
        voteNo,
        reqStatus,
        inqDt1,
        inqDt2,
        step_useYn,
        step_input,
        step_data
    } = defaultValue;

    const _natId = natId ? natId : oldNatId;

    this.appCd = appCd;
    this.iftUrl = iftUrl;
    this.orgCd = orgCd;
    this.svcCd = 'B1003';
    this.dispNm = dispNm;
    this.userId = loginId;
    this.userPw = decryptPW;
    this.customerType = customerType;
    this.cicNo = '';
    this.taxNo = '';
    this.cmtNo = _natId ? _natId : passportNumber;
    this.reportType = reportType;
    this.voteNo = voteNo;
    this.reqStatus = reqStatus;
    this.inqDt1 = inqDt1;
    this.inqDt2 = inqDt2;
    this.step_useYn = step_useYn;
    this.step_input = step_input;
    this.step_data = step_data;
    this.niceSessionKey = niceSessionKey;
    this.sendTime = dateutil.timeStamp();

};